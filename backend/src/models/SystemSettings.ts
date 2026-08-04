import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  globalBanner: {
    message: String,
    active: { type: Boolean, default: false },
    type: { type: String, enum: ['info', 'warning', 'error'], default: 'info' }
  },
  registrationEnabled: {
    type: Boolean,
    default: true
  },
  maxEventsPerOrganization: {
    type: Number,
    default: 100
  },
  platformName: {
    type: String,
    default: 'Planora'
  },
  supportEmail: {
    type: String,
    default: 'support@planora.io'
  },
  globalCommissionRate: {
    type: Number,
    default: 5
  },
  paymentGateway: {
    provider: { type: String, default: 'Stripe' },
    active: { type: Boolean, default: true }
  },
  emailConfig: {
    provider: { type: String, default: 'SendGrid' },
    fromEmail: { type: String, default: 'noreply@planora.io' }
  },
  eventCategories: {
    type: [String],
    default: ['Conference', 'Meetup', 'Workshop', 'Seminar', 'Networking', 'General']
  }
}, { timestamps: true });

export const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);
