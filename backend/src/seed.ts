import mongoose from 'mongoose';
import { User } from './models/User';
import { Organization } from './models/Organization';
import { Event } from './models/Event';
import { Registration } from './models/Registration';
import dotenv from 'dotenv';
import dns from 'dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clean up
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('Cleared database');

    // Create main test user
    const testEmail = 'admin@campusevents.com';
    const testPassword = 'admin12345';
    
    const user = new User({
      name: 'Generic SaaS User',
      email: testEmail,
      password: testPassword
    });
    await user.save();
    console.log(`Created test user: ${testEmail} / ${testPassword}`);

    // Create Organizations
    const org1 = new Organization({
      name: 'Acme Corp Workshops',
      slug: 'acme-corp',
      members: [{ user: user._id, role: 'owner' }]
    });
    await org1.save();
    console.log('Created organization: Acme Corp Workshops (acme-corp)');

    const org2 = new Organization({
      name: 'Dev Community Meetups',
      slug: 'dev-community',
      members: [{ user: user._id, role: 'owner' }]
    });
    await org2.save();
    console.log('Created organization: Dev Community Meetups (dev-community)');

    // Create Events under Acme Corp
    const event1 = new Event({
      title: 'Advanced React & Next.js Masterclass',
      description: 'Join us for an intensive deep-dive workshop into rendering patterns, state management, and Tailwind customization.',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      venue: 'Acme Conference Room A',
      category: 'Workshop',
      seatLimit: 50,
      registeredCount: 0,
      organization: org1._id,
      organizer: user._id
    });
    await event1.save();
    console.log('Created event: Advanced React & Next.js Masterclass');

    // Create Events under Dev Community
    const event2 = new Event({
      title: 'Open Source Contribution Night',
      description: 'Bring your laptop and let\'s contribute to popular libraries. Mentors will be present to assist with PRs.',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      venue: 'Community Hub Workspace',
      category: 'Meetup',
      seatLimit: 120,
      registeredCount: 0,
      organization: org2._id,
      organizer: user._id
    });
    await event2.save();
    console.log('Created event: Open Source Contribution Night');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB. Seeding finished.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
