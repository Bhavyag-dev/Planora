import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Organization } from './models/Organization';
import { User } from './models/User';
import { Event } from './models/Event';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

const demoOrganizations = [
  {
    name: 'JECRC Events Group',
    slug: 'jecrc-events',
    domain: 'jecrcu.edu.in',
    address: 'Jaipur, Rajasthan',
    about: 'A leading group focused on innovation, entrepreneurship, and professional conferences.',
    socialLinks: {
      instagram: 'https://instagram.com/jecrcevents',
      youtube: 'https://youtube.com/@jecrcevents',
      website: 'https://www.jecrcu.edu.in',
    },
    theme: {
      primaryColor: '#6d28d9',
      secondaryColor: '#ec4899',
      headerStyle: 'glass',
      heroTitle: 'Welcome to JECRC Events Hub',
      heroSubtitle: 'Explore conferences, networking, workshops, and team life in one simple platform.',
      heroBanner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
    },
  },
  {
    name: 'ABC Corporate Network',
    slug: 'abc-network',
    domain: 'abc.edu.in',
    address: 'Noida, Uttar Pradesh',
    about: 'A modern corporate network with strong developer communities and industry collaboration.',
    socialLinks: {
      instagram: 'https://instagram.com/abcnetwork',
      linkedin: 'https://linkedin.com/company/abcnetwork',
      website: 'https://abc.edu.in',
    },
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#14b8a6',
      headerStyle: 'classic',
      heroTitle: 'ABC Network Hub',
      heroSubtitle: 'Workshops, hackathons, meetups, and opportunities curated for every learner.',
      heroBanner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
    },
  },
  {
    name: 'Global Design Collective',
    slug: 'global-design',
    domain: 'gsd.edu.in',
    address: 'Bengaluru, Karnataka',
    about: 'A design-driven collective known for creative showcases, exhibitions, and interdisciplinary events.',
    socialLinks: {
      instagram: 'https://instagram.com/gsddesign',
      facebook: 'https://facebook.com/gsddesign',
      website: 'https://gsd.edu.in',
    },
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#f43f5e',
      headerStyle: 'minimal',
      heroTitle: 'Create. Collaborate. Celebrate.',
      heroSubtitle: 'From design showcases to creator meetups, discover what is next in design.',
      heroBanner: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1600&q=80',
    },
  },
  {
    name: 'North Valley Association',
    slug: 'north-valley',
    domain: 'nvc.edu.in',
    address: 'Pune, Maharashtra',
    about: 'A community-centric association with active clubs, sports culture, and strong civic participation.',
    socialLinks: {
      instagram: 'https://instagram.com/northvalley',
      youtube: 'https://youtube.com/@northvalley',
      website: 'https://nvc.edu.in',
    },
    theme: {
      primaryColor: '#22c55e',
      secondaryColor: '#3b82f6',
      headerStyle: 'glass',
      heroTitle: 'North Valley Events & Meetups',
      heroSubtitle: 'Join local events, competitions, and member-led communities.',
      heroBanner: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1600&q=80',
    },
  },
];

async function upsertOrgAdmin(organizationId: mongoose.Types.ObjectId, orgName: string, domain: string) {
  const email = `admin@${domain}`;
  const password = process.env.DEMO_ADMIN_PASSWORD;
  if (!password) throw new Error('DEMO_ADMIN_PASSWORD is required to seed demo accounts');

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'org_admin';
    existing.organization = organizationId;
    existing.password = password;
    await existing.save();
    return existing;
  }

  const admin = new User({
    name: `${orgName} Admin`,
    email,
    password,
    role: 'org_admin',
    organization: organizationId,
  });
  await admin.save();
  return admin;
}

async function upsertUser(organizationId: mongoose.Types.ObjectId, domain: string) {
  const email = `user@${domain}`;
  const password = process.env.DEMO_STUDENT_PASSWORD;
  if (!password) throw new Error('DEMO_STUDENT_PASSWORD is required to seed demo accounts');

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'user';
    existing.organization = organizationId;
    existing.password = password;
    await existing.save();
    return existing;
  }

  const user = new User({
    name: 'Demo User',
    email,
    password,
    role: 'user',
    organization: organizationId,
  });
  await user.save();
  return user;
}

async function upsertEvent(organizationId: mongoose.Types.ObjectId, organizerId: mongoose.Types.ObjectId, orgSlug: string, idx: number) {
  const title = `${orgSlug.toUpperCase()} Event Fest ${idx + 1}`;
  const existing = await Event.findOne({ title, organization: organizationId });
  if (existing) {
    existing.status = 'published';
    existing.coverImage = `https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80&sig=${idx + 11}`;
    existing.galleryImages = [
      `https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80&sig=${idx + 21}`,
      `https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80&sig=${idx + 31}`,
      `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80&sig=${idx + 41}`,
    ];
    await existing.save();
    return existing;
  }

  const event = new Event({
    title,
    description:
      'A premium event experience with speaker sessions, competitions, workshops, and networking activities.',
    coverImage: `https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80&sig=${idx + 11}`,
    galleryImages: [
      `https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80&sig=${idx + 21}`,
      `https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80&sig=${idx + 31}`,
      `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80&sig=${idx + 41}`,
    ],
    date: new Date(Date.now() + (idx + 3) * 24 * 60 * 60 * 1000),
    venue: 'Main Auditorium',
    category: idx % 2 === 0 ? 'Meetup' : 'Workshop',
    seatLimit: 250,
    status: 'published',
    organizer: organizerId,
    organization: organizationId,
  });
  await event.save();
  return event;
}

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found');
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    for (let i = 0; i < demoOrganizations.length; i += 1) {
      const c = demoOrganizations[i];

      const existingOrg = await Organization.findOne({ $or: [{ domain: c.domain }, { slug: c.slug }] });
      let organization: any;
      if (existingOrg) {
        existingOrg.name = c.name;
        existingOrg.slug = c.slug;
        existingOrg.domain = c.domain;
        existingOrg.address = c.address;
        existingOrg.about = c.about;
        existingOrg.socialLinks = {
          instagram: c.socialLinks.instagram || '',
          facebook: c.socialLinks.facebook || '',
          linkedin: c.socialLinks.linkedin || '',
          youtube: c.socialLinks.youtube || '',
          website: c.socialLinks.website || '',
        } as any;
        existingOrg.theme = {
          ...(existingOrg.theme || {}),
          ...(c.theme || {}),
          updatedAt: new Date(),
        } as any;
        existingOrg.storyHighlights = [
          `https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=500&q=80&sig=${i + 1}`,
          `https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=500&q=80&sig=${i + 101}`,
        ];
        existingOrg.galleryImages = [
          `https://images.unsplash.com/photo-1462536943532-57a629f6cc60?auto=format&fit=crop&w=1000&q=80&sig=${i + 201}`,
          `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80&sig=${i + 301}`,
          `https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80&sig=${i + 401}`,
        ];
        await existingOrg.save();
        organization = existingOrg;
      } else {
        organization = new Organization({
          ...c,
          storyHighlights: [
            `https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=500&q=80&sig=${i + 1}`,
            `https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=500&q=80&sig=${i + 101}`,
          ],
          galleryImages: [
            `https://images.unsplash.com/photo-1462536943532-57a629f6cc60?auto=format&fit=crop&w=1000&q=80&sig=${i + 201}`,
            `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80&sig=${i + 301}`,
            `https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80&sig=${i + 401}`,
          ],
        });
        await organization.save();
      }

      const admin = await upsertOrgAdmin(organization._id as mongoose.Types.ObjectId, c.name, c.domain);
      await upsertUser(organization._id as mongoose.Types.ObjectId, c.domain);
      await upsertEvent(organization._id as mongoose.Types.ObjectId, admin._id as mongoose.Types.ObjectId, c.slug, i);

      console.log(`Seeded organization: ${c.name} (${c.slug})`);
      console.log(`  Admin login: admin@${c.domain}`);
      console.log(`  User login: user@${c.domain}`);
    }

    await mongoose.disconnect();
    console.log('Demo data seeded successfully');
  } catch (err) {
    console.error('seed-demo error:', err);
    process.exit(1);
  }
}

run();
