import mongoose from 'mongoose';
import { User } from './models/User';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix for mongodb+srv ENOTFOUND / ESERVFAIL DNS errors on certain ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const superAdminEmail = 'vvishwas221@gmail.com';
    const existingAdmin = await User.findOne({ email: superAdminEmail });

    if (existingAdmin) {
      console.log('User already exists, updating role to super_admin...');
      existingAdmin.role = 'super_admin';
      await existingAdmin.save();
      console.log('Super Admin role updated successfully');
    } else {
      const admin = new User({
        name: 'Super Admin',
        email: superAdminEmail,
        password: 'Admin@123', // Default password
        role: 'super_admin'
      });
      await admin.save();
      console.log('Super Admin created successfully');
      console.log('Email: vvishwas221@gmail.com');
      console.log('Password: Admin@123');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
