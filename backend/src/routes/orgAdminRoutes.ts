import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Organization } from '../models/Organization';
import { Transaction } from '../models/Transaction';
import { AuditLog } from '../models/AuditLog';

const router = express.Router();

// Helper to log audit actions
const logAudit = async (userId: string, action: string, module: string, details: string) => {
  try {
    await AuditLog.create({ userId, action, module, details });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
};

// Middleware to ensure user is an organization admin
const isOrgAdmin = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  if (req.user?.role !== 'org_admin') {
    return res.status(403).json({ message: 'Organization Admin access required' });
  }
  next();
};

// --- User Management ---

// Get all users in organization
router.get('/users', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await User.find({ organization: req.user?.organization })
      .select('name email role organization createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user (e.g. sub-admin or team member) in the organization
router.post('/users', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    const allowedRoles = ['user', 'org_admin'];
    const desiredRole = role || 'user';
    if (!allowedRoles.includes(desiredRole)) {
      return res.status(400).json({ message: 'Invalid role for organization user creation' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

    const user = new User({
      name,
      email,
      password,
      role: desiredRole,
      organization: req.user?.organization
    });
    
    await user.save();
    await logAudit(req.user?.id!, 'CREATE_USER', 'USER', `Created user ${email} with role ${user.role} in organization ${req.user?.organization}`);
    res.status(201).json(user);
  } catch (err: any) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Update user role
router.patch('/users/:id', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.organization?.toString() !== req.user?.organization?.toString()) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) {
      const allowedRoles = ['user', 'org_admin'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      user.role = role;
    }

    await user.save();
    await logAudit(req.user?.id!, 'UPDATE_USER', 'USER', `Updated user ${user.email} role to ${role}`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Event Management ---

// Get all events in organization
router.get('/events', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const events = await Event.find({ organization: req.user?.organization })
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event status (Approval/Moderation)
router.patch('/events/:id/status', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event || event.organization?.toString() !== req.user?.organization?.toString()) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    await event.save();
    await logAudit(req.user?.id!, 'MODERATE_EVENT', 'EVENT', `Updated event ${event.title} status to ${status}`);
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Payments & Revenue ---

// Get all transactions in organization
router.get('/transactions', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const transactions = await Transaction.find({ organization: req.user?.organization })
      .populate('event', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Organization Settings & Branding ---

// Get organization settings
router.get('/settings', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const organization = await Organization.findById(req.user?.organization);
    res.json(organization);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update organization settings
router.patch('/settings', authMiddleware, isOrgAdmin, async (req: AuthRequest, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(req.user?.organization, req.body, { new: true });
    await logAudit(req.user?.id!, 'UPDATE_ORGANIZATION_SETTINGS', 'SYSTEM', `Updated organization branding/settings`);
    res.json(organization);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
