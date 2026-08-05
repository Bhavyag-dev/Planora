import express from 'express';
import { Registration } from '../models/Registration';
import { Event } from '../models/Event';
import { Organization } from '../models/Organization';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper: Check if user is a member of the organization
const checkMembership = async (organizationId: string, userId: string) => {
  const org = await Organization.findById(organizationId);
  if (!org) return false;
  return org.members.some((m: any) => m.user.toString() === userId);
};

// Authenticated: Register for an event
router.post('/register', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.registeredCount >= event.seatLimit) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const existingRegistration = await Registration.findOne({ event: eventId, user: userId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = new Registration({
      event: eventId,
      user: userId
    });

    await registration.save();

    // Increment event registered count
    event.registeredCount += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Get my registrations
router.get('/my', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const registrations = await Registration.find({ user: req.user?.id }).populate('event');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Get event participants
router.get('/event/:eventId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Verify current user belongs to the event's organization
    const isMember = await checkMembership(event.organization.toString(), req.user?.id!);
    if (!isMember) return res.status(403).json({ message: 'Access denied: you must belong to this workspace' });

    const registrations = await Registration.find({ event: req.params.eventId }).populate('user', 'name email');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
