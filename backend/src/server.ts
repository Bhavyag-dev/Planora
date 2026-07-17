import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import cron from 'node-cron';
import type { Server } from 'node:http';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
import collegeRoutes from './routes/collegeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import collegeAdminRoutes from './routes/collegeAdminRoutes';
import themeRoutes from './routes/themeRoutes';
import { Event } from './models/Event';
import { Registration } from './models/Registration';
import { sendReminderEmail } from './services/emailService';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDir, '../../.env') });

// Force DNS resolvers (helps with MongoDB SRV lookup on some networks)
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // Middleware
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS'));
    },
  }));
  app.use(express.json());

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('MongoDB connection error:', err));
  } else {
    console.warn('MONGODB_URI not found in environment variables. Database features will not work.');
  }

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/registrations', registrationRoutes);
  app.use('/api/colleges', collegeRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/college-admin', collegeAdminRoutes);
  app.use('/api/theme', themeRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Cron job for event reminders (runs every hour)
  cron.schedule('0 * * * *', async () => {
    console.log('Running event reminder cron job...');
    try {
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);
      
      const startWindow = new Date(tomorrow);
      startWindow.setMinutes(0, 0, 0);
      
      const endWindow = new Date(tomorrow);
      endWindow.setMinutes(59, 59, 999);

      // Find events happening in the 24h window
      const upcomingEvents = await Event.find({
        date: { $gte: startWindow, $lte: endWindow }
      });

      for (const event of upcomingEvents) {
        const registrations = await Registration.find({
          event: event._id,
          reminderSent: false
        }).populate('user', 'name email');

        for (const reg of registrations) {
          const user = reg.user as any;
          if (user && user.email) {
            await sendReminderEmail(user.email, user.name, event);
            reg.reminderSent = true;
            await reg.save();
          }
        }
      }
    } catch (err) {
      console.error('Cron job error:', err);
    }
  });

  app.get('/', (_req, res) => {
    res.status(200).type('text/plain').send('Campus Events API is running.');
  });

  const server: Server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err?.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other server or change PORT in .env.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
}

startServer();
