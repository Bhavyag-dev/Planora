import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../context/WorkspaceContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { 
  Lock, 
  User, 
  Users, 
  ShieldCheck, 
  Crown, 
  UserCheck, 
  UserMinus, 
  Copy, 
  Check, 
  Plus, 
  Link2, 
  X
} from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const { 
    activeWorkspace, 
    inviteMember, 
    updateMemberRole, 
    removeMember, 
    getInviteCode, 
    joinByInviteCode
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'team' | 'account'>('team');

  // Account Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountStatus, setAccountStatus] = useState<{type: 'error' | 'success', message: string} | null>(null);
  const [accountLoading, setAccountLoading] = useState(false);

  // Team Invite Form State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'member'>('member');
  const [inviteStatus, setInviteStatus] = useState<{type: 'error' | 'success', message: string} | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);

  // Invite Code State
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Join Code Form State
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinStatus, setJoinStatus] = useState<{type: 'error' | 'success', message: string} | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);

  // Member Action Loading Tracker
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);

  const currentUserRole = activeWorkspace?.members.find(
    m => (typeof m.user === 'object' ? m.user._id : m.user) === user?.id
  )?.role;
  const isOwner = currentUserRole === 'owner';

  useEffect(() => {
    if (activeWorkspace) {
      getInviteCode().then(code => setInviteCode(code)).catch(() => {});
    }
  }, [activeWorkspace, getInviteCode]);

  const handleCopyInviteCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      return setAccountStatus({ type: 'error', message: 'New passwords do not match' });
    }

    setAccountLoading(true);
    setAccountStatus(null);

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

      setAccountStatus({ type: 'success', message: 'Profile settings updated successfully!' });
      setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err: any) {
      setAccountStatus({ type: 'error', message: err.message });
    } finally {
      setAccountLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviteLoading(true);
    setInviteStatus(null);

    try {
      await inviteMember(inviteEmail.trim(), inviteRole);
      setInviteStatus({ type: 'success', message: `Invited ${inviteEmail} as ${inviteRole}!` });
      setInviteEmail('');
      setTimeout(() => setShowInviteModal(false), 1500);
    } catch (err: any) {
      setInviteStatus({ type: 'error', message: err.message });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (memberUserId: string, newRole: 'owner' | 'member') => {
    setUpdatingMemberId(memberUserId);
    try {
      await updateMemberRole(memberUserId, newRole);
    } catch (err: any) {
      alert(err.message || 'Failed to update member role');
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleRemoveMember = async (memberUserId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) return;

    setUpdatingMemberId(memberUserId);
    try {
      await removeMember(memberUserId);
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setJoinLoading(true);
    setJoinStatus(null);

    try {
      await joinByInviteCode(joinCodeInput.trim().toUpperCase());
      setJoinStatus({ type: 'success', message: 'Successfully joined workspace!' });
      setJoinCodeInput('');
    } catch (err: any) {
      setJoinStatus({ type: 'error', message: err.message });
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl min-h-[70vh] text-neutral-900">
      {/* Page Header */}
      <div className="relative pb-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-2 font-display">
            Workspace & <span className="bg-gradient-to-r from-purple-650 to-pink-500 bg-clip-text text-transparent">Team Settings</span>
          </h1>
          <p className="text-neutral-500 text-sm">
            {activeWorkspace ? `Managing ${activeWorkspace.name} workspace & permissions` : 'Manage your profile and workspace settings'}
          </p>
        </div>

        {/* Tab Selector Pill */}
        <div className="inline-flex p-1 bg-neutral-100 border border-neutral-200/80 rounded-2xl select-none shrink-0">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'team'
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Users size={14} />
            <span>Team & Roles</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'account'
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <User size={14} />
            <span>Account Profile</span>
          </button>
        </div>
      </div>

      {activeTab === 'team' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Workspace Quick Link & Code Banner */}
          {activeWorkspace && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center text-base font-bold font-display shadow-md">
                    {activeWorkspace.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-950 font-display flex items-center gap-2">
                      {activeWorkspace.name}
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full text-neutral-600">
                        {isOwner ? 'Owner View' : 'Member View'}
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">workspace slug: {activeWorkspace.slug}</p>
                  </div>
                </div>

                {/* Invite Actions */}
                <div className="flex items-center gap-2">
                  {inviteCode && (
                    <button
                      onClick={handleCopyInviteCode}
                      className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      {copiedCode ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      <span>{copiedCode ? 'Code Copied!' : `Code: ${inviteCode}`}</span>
                    </button>
                  )}

                  {isOwner && (
                    <Button
                      onClick={() => setShowInviteModal(true)}
                      size="sm"
                      className="flex items-center gap-1.5 cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
                    >
                      <Plus size={14} />
                      <span>Invite Member</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Members Roster Table */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-neutral-950 font-display flex items-center gap-2">
                  <ShieldCheck size={18} className="text-purple-650" />
                  <span>Team Members & Scoped Roles</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Workspace owners can manage member roles or remove team members.
                </p>
              </div>
              <span className="text-xs font-extrabold text-neutral-600 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full">
                {activeWorkspace?.members.length || 0} Members
              </span>
            </div>

            {/* Members List */}
            <div className="divide-y divide-neutral-100">
              {activeWorkspace?.members.map(member => {
                const memUser = typeof member.user === 'object' ? member.user : null;
                if (!memUser) return null;
                const isSelf = memUser._id === user?.id;
                const isTargetOwner = member.role === 'owner';
                const isLoadingThis = updatingMemberId === memUser._id;

                return (
                  <div key={memUser._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-950 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {memUser.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-neutral-900">{memUser.name}</p>
                          {isSelf && (
                            <span className="text-[10px] font-bold text-purple-650 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 font-sans">{memUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:justify-end">
                      {/* Role Selector or Badge */}
                      {isOwner && !isSelf ? (
                        <div className="relative">
                          <select
                            disabled={isLoadingThis}
                            value={member.role}
                            onChange={e => handleRoleChange(memUser._id, e.target.value as 'owner' | 'member')}
                            className="h-9 pl-3 pr-8 text-xs font-bold rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer appearance-none"
                          >
                            <option value="member">Member</option>
                            <option value="owner">Owner</option>
                          </select>
                          <Crown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                          isTargetOwner
                            ? 'bg-amber-50 text-amber-900 border-amber-200/80'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}>
                          {isTargetOwner ? <Crown size={12} className="text-amber-600" /> : <UserCheck size={12} />}
                          <span className="capitalize">{member.role}</span>
                        </span>
                      )}

                      {/* Remove Button for Owners */}
                      {isOwner && !isSelf && (
                        <button
                          disabled={isLoadingThis}
                          onClick={() => handleRemoveMember(memUser._id, memUser.name)}
                          className="h-9 w-9 rounded-xl border border-neutral-200 hover:border-red-200 hover:bg-red-50 text-neutral-400 hover:text-red-650 flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                          title="Remove Member"
                        >
                          <UserMinus size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Join Another Workspace via Invite Code Widget */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-neutral-950 font-display flex items-center gap-2">
                <Link2 size={16} className="text-indigo-600" />
                <span>Join Another Workspace via Code</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Received a workspace invite code? Enter it below to join the workspace immediately.
              </p>
            </div>

            <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="text"
                required
                placeholder="e.g. 4B8A9F12"
                value={joinCodeInput}
                onChange={e => setJoinCodeInput(e.target.value)}
                className="flex-1 h-11 px-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono tracking-wider uppercase text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
              <Button type="submit" isLoading={joinLoading} className="cursor-pointer">
                Join Workspace
              </Button>
            </form>

            {joinStatus && (
              <p className={`text-xs p-3 rounded-xl border ${joinStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-650' : 'bg-green-50 border-green-200 text-green-700'}`}>
                {joinStatus.message}
              </p>
            )}
          </div>

        </motion.div>
      )}

      {/* Account Settings Tab */}
      {activeTab === 'account' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs"
        >
          <form onSubmit={handleAccountSubmit} className="space-y-8">
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

            {accountStatus && (
              <div className={`p-4 rounded-xl border text-sm ${accountStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-650' : 'bg-green-50 border-green-200 text-green-600'}`}>
                {accountStatus.message}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={accountLoading} className="cursor-pointer">
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Invite Member Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-6 relative"
            >
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-xl font-bold text-neutral-950 font-display">Invite Team Member</h3>
                <p className="text-sm text-neutral-500 mt-1">Send an invitation to join {activeWorkspace?.name}</p>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Assigned Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setInviteRole('member')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        inviteRole === 'member'
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <UserCheck size={14} /> Member
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteRole('owner')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        inviteRole === 'owner'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Crown size={14} /> Owner
                    </button>
                  </div>
                </div>

                {inviteStatus && (
                  <p className={`text-xs p-3 rounded-xl border ${inviteStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-650' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    {inviteStatus.message}
                  </p>
                )}

                <Button
                  type="submit"
                  isLoading={inviteLoading}
                  className="w-full h-11 bg-neutral-950 text-white font-semibold rounded-xl text-sm transition-all hover:bg-neutral-800 cursor-pointer"
                >
                  Send Workspace Invitation
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
