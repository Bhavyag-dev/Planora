import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true }, // e.g., jecrc.edu
  logo: { type: String },
  address: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending', 'suspended'], 
    default: 'active' 
  },
  isVerified: { type: Boolean, default: false },
  commissionRate: { type: Number, default: 5 }, // Percentage
  features: {
    payments: { type: Boolean, default: true },
    certificates: { type: Boolean, default: true },
    qrCheckin: { type: Boolean, default: true },
    customThemes: { type: Boolean, default: false }
  },
  tier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  createdAt: { type: Date, default: Date.now },
});

export const College = mongoose.model('College', collegeSchema);
