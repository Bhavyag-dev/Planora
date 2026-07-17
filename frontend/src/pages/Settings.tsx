import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ShieldCheck, User, Building, Lock } from 'lucide-react';

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
    <div className="space-y-8 max-w-4xl min-h-[70vh]">
      <div className="relative pb-6 border-b border-white/[0.06]">
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-pink-500 to-transparent" />
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Account <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Settings</span></h1>
        <p className="text-zinc-400">Manage your profile, password, and preferences</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Nav */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.05] text-white">
            <User size={18} className="text-purple-400" />
            <span className="font-medium text-sm">Profile Details</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white transition-colors">
            <ShieldCheck size={18} />
            <span className="font-medium text-sm">Security & Privacy</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white transition-colors">
            <Building size={18} />
            <span className="font-medium text-sm">College Data</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-white/[0.06] pb-2">Personal Information</h3>
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
                <p className="text-xs text-zinc-500">Contact admin to change your registered email address.</p>
              </div>

              {/* Password */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-white border-b border-white/[0.06] pb-2 flex items-center gap-2">
                  <Lock size={16} /> Security
                </h3>
                <Input 
                  type="password"
                  label="Current Password" 
                  value={profileData.currentPassword} 
                  onChange={e => setProfileData({...profileData, currentPassword: e.target.value})} 
                  placeholder="Enter current password to change it"
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
                <div className={`p-4 rounded-xl border text-sm ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                  {status.message}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button type="submit" isLoading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
