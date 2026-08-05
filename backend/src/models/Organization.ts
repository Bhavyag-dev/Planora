import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true, lowercase: true, trim: true },
  logo: { type: String },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'member'], default: 'member' }
  }]
}, { timestamps: true });

export const Organization = mongoose.model('Organization', organizationSchema);
