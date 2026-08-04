import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';

const router = express.Router();

const ensureDatabaseConnected = (res: express.Response) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Database is not connected. Configure MONGODB_URI and restart the backend server.',
    });
    return false;
  }
  return true;
};

// Helper to log audit actions
const logAudit = async (userId: string, action: string, module: string, details: string) => {
  try {
    await AuditLog.create({ userId, action, module, details });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
};

const normalizeEmailDomain = (email: string) => {
  const parts = String(email || '').trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
};

const findOrganizationByDomain = async (domain: string) => {
  if (!domain) return null;

  // Exact match first
  let org = await Organization.findOne({ domain: new RegExp(`^${domain}$`, 'i') });
  if (org) return org;

  // If email is from subdomain, try parent domains
  const segments = domain.split('.');
  for (let i = 1; i < segments.length - 1; i += 1) {
    const parent = segments.slice(i).join('.');
    if (parent.split('.').length < 2) continue;
    org = await Organization.findOne({ domain: new RegExp(`^${parent}$`, 'i') });
    if (org) return org;
  }

  return null;
};

router.post('/signup', async (req, res) => {
  try {
    if (!ensureDatabaseConnected(res)) return;

    const { name, email, password, organizationId } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Find organization by ID first, then by domain
    let organization = null;
    if (organizationId) {
      organization = await Organization.findById(organizationId);
    } else {
      const domain = normalizeEmailDomain(email);
      organization = await findOrganizationByDomain(domain);
    }
    
    // Super Admin check
    let role = 'user';
    if (normalizedEmail === process.env.SUPER_ADMIN_EMAIL) {
      role = 'super_admin';
    }

    const user = new User({ 
      name, 
      email: normalizedEmail, 
      password, 
      role,
      organization: organization?._id 
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, organization: user.organization, email: user.email }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '7d' }
    );
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        organization: user.organization
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    if (!ensureDatabaseConnected(res)) return;

    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').trim().toLowerCase() }).populate('organization');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Auto-promote super admin if email matches
    if (user.email === process.env.SUPER_ADMIN_EMAIL && user.role !== 'super_admin') {
      user.role = 'super_admin';
      await user.save();
    }

    // Auto-map user to organization by email domain if missing
    if (user.role === 'user' && !user.organization && user.email) {
      const domain = normalizeEmailDomain(user.email);
      const organization = await findOrganizationByDomain(domain);
      if (organization) {
        user.organization = organization._id as any;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, organization: user.organization?._id, email: user.email }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '7d' }
    );
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        organization: user.organization
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users by email or filter by organization
router.get('/search', authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== 'super_admin' && req.user?.role !== 'org_admin' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { email, organizationId, role } = req.query;
    const query: any = {};
    
    if (email) query.email = { $regex: email as string, $options: 'i' };
    if (organizationId) query.organization = organizationId;
    if (role) query.role = role;

    const users = await User.find(query)
      .select('name email role organization')
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Super Admin: Impersonate user
router.post('/impersonate', authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign(
      { id: user._id, role: user.role, organization: user.organization, email: user.email, impersonatedBy: req.user.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        organization: user.organization
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Super Admin: Update User Role
router.patch('/users/:userId/role', authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await logAudit(req.user.id, 'UPDATE_USER_ROLE', 'USER', `Updated user ${user.email} role to ${role}`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Profile / Password
router.patch('/update-profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;

    if (currentPassword && newPassword) {
      const isMatch = await (user as any).comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


