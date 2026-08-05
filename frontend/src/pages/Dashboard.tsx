import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../context/WorkspaceContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar, 
  Users, 
  Sparkles, 
  MapPin, 
  PlusCircle, 
  Mail, 
  X,
  Clock
} from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { formatDate } from '../lib/utils';

export function Dashboard() {
  const { user, token } = useAuth();
  const { workspaces, activeWorkspace, createWorkspace, inviteMember } = useWorkspace();

  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Invite states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // Event modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [eventError, setEventError] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'General',
    seatLimit: 100,
    coverImage: ''
  });

  // Onboarding workspace states
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');

  const fetchWorkspaceEvents = useCallback(async () => {
    if (!activeWorkspace || !token) return;
    setLoadingEvents(true);
    try {
      const res = await fetch(`/api/events?organizationId=${activeWorkspace._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoadingEvents(false);
    }
  }, [activeWorkspace, token]);

  useEffect(() => {
    fetchWorkspaceEvents();
  }, [fetchWorkspaceEvents]);

  // Determine current user's role in active workspace
  const userRole = activeWorkspace?.members.find(
    (m: any) => m.user._id === user?.id || m.user === user?.id
  )?.role || 'member';

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    setCreatingWorkspace(true);
    setWorkspaceError('');
    try {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName('');
    } catch (err: any) {
      setWorkspaceError(err.message || 'Failed to create workspace');
    } finally {
      setCreatingWorkspace(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError('');
    setInviteSuccess(false);
    try {
      await inviteMember(inviteEmail);
      setInviteEmail('');
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err: any) {
      setInviteError(err.message || 'Invitation failed');
    } finally {
      setInviting(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) return;
    setCreatingEvent(true);
    setEventError('');
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newEvent,
          organizationId: activeWorkspace._id
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create event');
      
      setShowEventModal(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        venue: '',
        category: 'General',
        seatLimit: 100,
        coverImage: ''
      });
      fetchWorkspaceEvents();
    } catch (err: any) {
      setEventError(err.message || 'Failed to create event');
    } finally {
      setCreatingEvent(false);
    }
  };

  // If no workspaces, render onboarding flow
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto space-y-8 pb-12 select-none">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/25">
          <Sparkles className="text-white" size={32} />
        </div>
        
        <div>
          <h1 className="text-4xl font-extrabold text-white font-display">Setup Your Workspace</h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Welcome to Planora. To begin scheduling events and inviting team members, create a workspace for your community, club, or company.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={handleCreateWorkspace} className="space-y-5 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Workspace Name</label>
              <Input
                required
                placeholder="e.g. Acme Corp Events"
                value={newWorkspaceName}
                onChange={e => setNewWorkspaceName(e.target.value)}
              />
            </div>
            
            {workspaceError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{workspaceError}</p>
            )}

            <Button type="submit" className="w-full h-11" isLoading={creatingWorkspace}>
              Get Started
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 select-none">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_55%)]" aria-hidden="true" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Workspace</span>
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
              {activeWorkspace?.name || 'Workspace Dashboard'}
            </h1>
            <p className="mt-2 text-zinc-400 text-sm max-w-xl">
              Organize, share, and schedule events seamlessly.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowEventModal(true)} className="gap-2 rounded-2xl py-3 px-5">
              <Plus size={16} />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side: Events List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="text-purple-400" size={20} />
              <span>Workspace Events</span>
            </h2>
            <span className="text-xs text-zinc-500 font-bold bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.04]">
              {events.length} Total
            </span>
          </div>

          {loadingEvents ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map(ev => (
                <div 
                  key={ev._id}
                  className="rounded-2xl border border-white/[0.06] bg-zinc-900/30 overflow-hidden flex flex-col hover:border-white/[0.1] hover:bg-zinc-900/50 transition-all shadow-lg"
                >
                  {ev.coverImage && (
                    <div className="h-32 w-full overflow-hidden relative">
                      <img src={ev.coverImage} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                        {ev.category}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight mt-2.5 line-clamp-1">{ev.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{ev.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/[0.04] space-y-1.5 text-zinc-400 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{formatDate(ev.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-white/[0.1] bg-white/[0.01] rounded-3xl p-12 text-center">
              <p className="text-zinc-500 text-sm">No events scheduled in this workspace yet.</p>
              <button 
                onClick={() => setShowEventModal(true)} 
                className="mt-3 text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline"
              >
                Schedule your first event
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Roster & Members */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="text-pink-400" size={20} />
              <span>Workspace Members</span>
            </h2>

            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-xl space-y-4">
              <div className="space-y-3">
                {activeWorkspace?.members.map((m: any) => (
                  <div key={m.user._id || m.user} className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-zinc-300 shrink-0">
                        {m.user.name?.charAt(0) || 'M'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{m.user.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{m.user.email}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                      m.role === 'owner' 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Invite Member Section (Only Workspace Owners) */}
              {userRole === 'owner' && (
                <div className="border-t border-white/[0.06] pt-4 mt-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Invite Team Member</h4>
                  <form onSubmit={handleInvite} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="email"
                        required
                        placeholder="colleague@domain.com"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        className="w-full h-9 px-3 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:border-white focus:ring-1 focus:ring-white outline-none text-white text-xs transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={inviting}
                      className="h-9 px-3.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-250 transition-colors disabled:opacity-50"
                    >
                      Invite
                    </button>
                  </form>

                  {inviteSuccess && (
                    <p className="text-[10px] text-emerald-400 mt-2">Member added to workspace successfully!</p>
                  )}
                  {inviteError && (
                    <p className="text-[10px] text-red-400 mt-2">{inviteError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-zinc-900 p-6 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <button 
                onClick={() => setShowEventModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-xl font-bold text-white">Create New Event</h3>
                <p className="text-sm text-zinc-400 mt-1">Schedule a meeting, meetup, or workshop for your workspace.</p>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Event Title</label>
                  <Input
                    required
                    placeholder="e.g. Weekly All Hands"
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about this event..."
                    value={newEvent.description}
                    onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl focus:border-white focus:ring-1 focus:ring-white outline-none text-white text-sm transition-all placeholder:text-zinc-550"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.06] rounded-xl focus:border-white focus:ring-1 focus:ring-white outline-none text-white text-xs transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Venue</label>
                    <Input
                      required
                      placeholder="e.g. Conference Room A"
                      value={newEvent.venue}
                      onChange={e => setNewEvent({...newEvent, venue: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                      className="w-full h-11 bg-zinc-900 border border-white/[0.06] rounded-xl focus:border-white text-zinc-300 px-3 text-sm"
                    >
                      <option value="General">General</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Meetup">Meetup</option>
                      <option value="Conference">Conference</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Seat Limit</label>
                    <Input
                      type="number"
                      required
                      min={1}
                      value={newEvent.seatLimit}
                      onChange={e => setNewEvent({...newEvent, seatLimit: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-0.5">Cover Image URL (Optional)</label>
                  <Input
                    placeholder="https://unsplash.com/... (optional)"
                    value={newEvent.coverImage}
                    onChange={e => setNewEvent({...newEvent, coverImage: e.target.value})}
                  />
                </div>

                {eventError && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{eventError}</p>
                )}

                <button
                  type="submit"
                  disabled={creatingEvent}
                  className="w-full h-11 bg-white text-black font-semibold rounded-xl text-sm transition-all hover:bg-zinc-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creatingEvent && <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />}
                  Create Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
