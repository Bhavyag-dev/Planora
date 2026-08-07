import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Lock, User } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState<{type: 'error' | 'success', message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match' });
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: profileData.name,
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus({ type: 'success', message: 'Settings updated successfully!' });
      setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl min-h-[70vh] text-neutral-900">
      <div className="relative pb-6 border-b border-neutral-200">
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-pink-500 to-transparent" />
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-2 font-display">
          Account <span className="bg-gradient-to-r from-purple-650 to-pink-500 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-neutral-500 text-sm">Manage your profile and security credentials</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2 flex items-center gap-2 font-display">
              <User size={16} className="text-purple-650" />
              <span>Personal Information</span>
            </h3>
            <Input 
              label="Full Name" 
              value={profileData.name} 
              onChange={e => setProfileData({...profileData, name: e.target.value})} 
              placeholder="Your Name"
            />
            <Input 
              label="Email Address" 
              value={user?.email || ''} 
              disabled
            />
            <p className="text-xs text-neutral-450">Contact support to modify your account email address.</p>
          </div>

          {/* Password */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2 flex items-center gap-2 font-display">
              <Lock size={16} className="text-pink-600" /> Security & Password
            </h3>
            <Input 
              type="password"
              label="Current Password" 
              value={profileData.currentPassword} 
              onChange={e => setProfileData({...profileData, currentPassword: e.target.value})} 
              placeholder="Enter current password to make changes"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="password"
                label="New Password" 
                value={profileData.newPassword} 
                onChange={e => setProfileData({...profileData, newPassword: e.target.value})} 
                placeholder="New password"
              />
              <Input 
                type="password"
                label="Confirm New Password" 
                value={profileData.confirmPassword} 
                onChange={e => setProfileData({...profileData, confirmPassword: e.target.value})} 
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {status && (
            <div className={`p-4 rounded-xl border text-sm ${status.type === 'error' ? 'bg-red-50 border-red-200 text-red-650' : 'bg-green-50 border-green-200 text-green-600'}`}>
              {status.message}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={loading} className="cursor-pointer">
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
