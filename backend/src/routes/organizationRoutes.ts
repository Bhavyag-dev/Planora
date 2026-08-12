import express from 'express';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

const toSlug = (value: string) =>
  (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Authenticated: Create a new organization / workspace
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const normalizedSlug = toSlug(slug || name);
    const existingSlug = await Organization.findOne({ slug: normalizedSlug });
    if (existingSlug) return res.status(400).json({ message: 'Workspace slug already exists' });

    const organization = new Organization({
      name,
      slug: normalizedSlug,
      members: [{
        user: req.user?.id,
        role: 'owner'
      }]
    });

    await organization.save();
    res.status(201).json(organization);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Get all organizations the current user belongs to
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const organizations = await Organization.find({
      'members.user': req.user?.id
    }).populate('members.user', 'name email');
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Invite a member by email
router.post('/:id/invite', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: 'Workspace not found' });

    // Verify current user is the owner of the organization
    const isOwner = organization.members.some(
      (m: any) => m.user.toString() === req.user?.id && m.role === 'owner'
    );
    if (!isOwner) return res.status(403).json({ message: 'Only workspace owners can invite members' });

    // Find the target user
    const targetUser = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!targetUser) return res.status(404).json({ message: 'User with this email not found on the platform' });

    // Check if already a member
    const alreadyMember = organization.members.some(
      (m: any) => m.user.toString() === targetUser._id.toString()
    );
    if (alreadyMember) return res.status(400).json({ message: 'User is already a member of this workspace' });

    // Add user as member
    organization.members.push({
      user: targetUser._id as any,
      role: 'member'
    });

    await organization.save();
    res.json({ message: 'User invited successfully', organization });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Remove a member from organization (Owner only)
router.delete('/:id/members/:memberUserId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: 'Workspace not found' });

    // Verify current user is owner
    const isOwner = organization.members.some(
      (m: any) => m.user.toString() === req.user?.id && m.role === 'owner'
    );
    if (!isOwner) return res.status(403).json({ message: 'Only workspace owners can remove members' });

    const targetUserId = req.params.memberUserId;
    if (targetUserId === req.user?.id) {
      return res.status(400).json({ message: 'Workspace owner cannot remove themselves' });
    }

    organization.members = organization.members.filter(
      (m: any) => m.user.toString() !== targetUserId
    ) as any;

    await organization.save();
    res.json({ message: 'Member removed successfully', organization });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
