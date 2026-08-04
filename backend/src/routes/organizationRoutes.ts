import express from 'express';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

const toSlug = (value: string) =>
  (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Super Admin: Create a new organization and its initial admin
router.post('/', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }

  try {
    const { name, domain, logo, address, slug, adminName, adminEmail, adminPassword } = req.body;
    
    // Check if organization domain exists (optional check)
    if (domain) {
      const existingOrg = await Organization.findOne({ domain });
      if (existingOrg) return res.status(400).json({ message: 'Organization with this domain already exists' });
    }

    // Check if admin email exists
    if (adminEmail) {
      const existingUser = await User.findOne({ email: adminEmail });
      if (existingUser) return res.status(400).json({ message: 'Admin email already in use' });
    }

    const normalizedSlug = toSlug(slug || name);
    const existingSlug = await Organization.findOne({ slug: normalizedSlug });
    if (existingSlug) return res.status(400).json({ message: 'Organization slug already exists' });

    // Create Organization
    const organization = new Organization({ name, slug: normalizedSlug, domain, logo, address });
    await organization.save();

    // Create Admin if provided
    let adminUser = null;
    if (adminName && adminEmail && adminPassword) {
      adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'org_admin',
        organization: organization._id
      });
      await adminUser.save();
    }

    // Log Audit
    await AuditLog.create({
      userId: req.user.id,
      action: 'CREATE_ORGANIZATION',
      module: 'SYSTEM',
      details: `Created organization: ${name} (${domain || 'no domain'})${adminUser ? ` with admin: ${adminEmail}` : ''}`
    });

    res.status(201).json({
      organization,
      admin: adminUser ? { id: adminUser._id, name: adminUser.name, email: adminUser.email } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: Get organization profile by slug + published events
router.get('/slug/:slug', async (req, res) => {
  try {
    const slug = toSlug(req.params.slug);
    const organization = await Organization.findOne({ slug }).lean();
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    const { Event } = await import('../models/Event');
    const events = await Event.find({ organization: organization._id, status: 'published' })
      .sort({ date: 1 })
      .limit(30);

    res.json({ organization, events });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Super Admin: Get all organizations
router.get('/', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }

  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Super Admin: Assign Organization Admin
router.post('/assign-admin', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }

  try {
    const { userId, organizationId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'org_admin';
    user.organization = organizationId;
    await user.save();

    // Log Audit
    await AuditLog.create({
      userId: req.user.id,
      action: 'ASSIGN_ORG_ADMIN',
      module: 'SYSTEM',
      details: `Assigned user ${user.email} as admin for organization ${organizationId}`
    });

    res.json({ message: 'Organization Admin assigned successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Super Admin: Update Organization Status
router.patch('/:id/status', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }

  try {
    const { status } = req.body;
    const organization = await Organization.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    await AuditLog.create({
      userId: req.user.id,
      action: 'UPDATE_ORGANIZATION_STATUS',
      module: 'SYSTEM',
      details: `Updated organization ${organization.name} status to ${status}`
    });

    res.json(organization);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Super Admin: Update Organization Features
router.patch('/:id/features', authMiddleware, async (req: any, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }

  try {
    const { features } = req.body;
    const organization = await Organization.findByIdAndUpdate(req.params.id, { features }, { new: true });
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    await AuditLog.create({
      userId: req.user.id,
      action: 'UPDATE_ORGANIZATION_FEATURES',
      module: 'SYSTEM',
      details: `Updated organization ${organization.name} features`
    });

    res.json(organization);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

