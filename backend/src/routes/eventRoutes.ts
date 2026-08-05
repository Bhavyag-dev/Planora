import express from 'express';
import { Event } from '../models/Event';
import { Registration } from '../models/Registration';
import { Organization } from '../models/Organization';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper: Check if user is a member of the organization
const checkMembership = async (organizationId: string, userId: string) => {
  const org = await Organization.findById(organizationId);
  if (!org) return false;
  return org.members.some((m: any) => m.user.toString() === userId);
};

// Public/Authenticated: Get events
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { organizationId } = req.query;
    let query: any = {};

    if (organizationId) {
      query.organization = organizationId;
    } else {
      // By default, if no organizationId is requested, only return published events across organizations.
      // This supports the public landing page listing.
      query.status = 'published';
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public/Authenticated: Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Create event under active workspace
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, coverImage, date, venue, category, seatLimit, organizationId, status } = req.body;
    if (!organizationId) return res.status(400).json({ message: 'Organization ID is required' });

    const isMember = await checkMembership(organizationId, req.user?.id!);
    if (!isMember) return res.status(403).json({ message: 'You are not a member of this workspace' });

    const event = new Event({
      title,
      description,
      coverImage: coverImage || '',
      date,
      venue,
      category: category || 'General',
      seatLimit: seatLimit || 100,
      status: status || 'published',
      organizer: req.user?.id,
      organization: organizationId
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Update event
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isMember = await checkMembership(event.organization.toString(), req.user?.id!);
    if (!isMember) return res.status(403).json({ message: 'Access denied: you do not belong to this workspace' });

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Delete event
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isMember = await checkMembership(event.organization.toString(), req.user?.id!);
    if (!isMember) return res.status(403).json({ message: 'Access denied: you do not belong to this workspace' });

    const eventId = event._id;
    await Event.findByIdAndDelete(eventId);
    
    // Clean up registrations
    await Registration.deleteMany({ event: eventId });

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
