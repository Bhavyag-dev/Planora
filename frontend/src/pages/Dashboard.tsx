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
  X,
  Clock,
  Check,
  Trash2
} from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { formatDate } from '../lib/utils';

export function Dashboard() {
  const { user, token } = useAuth();
  const { workspaces, activeWorkspace, createWorkspace, inviteMember, removeMember } = useWorkspace();

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

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e._id !== eventId));
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!confirm('Are you sure you want to remove this member from the workspace?')) return;
    try {
      await removeMember(memberUserId);
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
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
          <h1 className="text-4xl font-extrabold text-neutral-950 font-display">Setup Your Workspace</h1>
          <p className="mt-2 text-neutral-500 text-sm">
            Welcome to Planora. To begin scheduling events and inviting team members, create a workspace for your community, club, or company.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-sm"
        >
          <form onSubmit={handleCreateWorkspace} className="space-y-5 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5 font-display">Workspace Name</label>
              <Input
                required
                placeholder="e.g. Acme Corp Events"
                value={newWorkspaceName}
                onChange={e => setNewWorkspaceName(e.target.value)}
              />
            </div>
            
            {workspaceError && (
              <p className="text-xs text-red-655 bg-red-50 border border-red-200 p-2 rounded-lg">{workspaceError}</p>
            )}

            <Button type="submit" className="w-full h-11 cursor-pointer" isLoading={creatingWorkspace}>
              Get Started
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 select-none text-neutral-900">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.06),transparent_55%)]" aria-hidden="true" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-neutral-550">
              <Sparkles size={14} className="text-purple-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Workspace</span>
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
              {activeWorkspace?.name || 'Workspace Dashboard'}
            </h1>
            <p className="mt-2 text-neutral-500 text-sm max-w-xl">
              Organize, share, and schedule events seamlessly.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowEventModal(true)} className="gap-2 rounded-2xl py-3 px-5 cursor-pointer">
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
            <h2 className="text-2xl font-bold text-neutral-950 tracking-tight flex items-center gap-2">
              <Calendar className="text-purple-600" size={20} />
              <span>Workspace Events</span>
            </h2>
            <span className="text-xs text-neutral-500 font-bold bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200/50">
              {events.length} Total
            </span>
          </div>

          {loadingEvents ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map(ev => (
                <div 
                  key={ev._id}
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden flex flex-col hover:border-neutral-300 hover:shadow-sm transition-all"
                >
                  {ev.coverImage && (
                    <div className="h-32 w-full overflow-hidden relative">
                      <img src={ev.coverImage} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-purple-655 uppercase tracking-widest bg-purple-50 border border-purple-100 px-2 py-0.5 rounded">
                          {ev.category}
                        </span>
                        <button
                          onClick={() => handleDeleteEvent(ev._id)}
                          title="Delete Event"
                          className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-950 tracking-tight mt-2.5 line-clamp-1">{ev.title}</h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{ev.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1.5 text-neutral-500 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-neutral-400" />
                        <span>{formatDate(ev.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-neutral-400" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-neutral-300 bg-neutral-50/20 rounded-3xl p-12 text-center">
              <p className="text-neutral-500 text-sm">No events scheduled in this workspace yet.</p>
              <button 
                onClick={() => setShowEventModal(true)} 
                className="mt-3 text-xs font-bold text-purple-655 hover:text-purple-500 hover:underline cursor-pointer"
              >
                Schedule your first event
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Roster & Members */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-950 tracking-tight flex items-center gap-2">
              <Users className="text-pink-600" size={20} />
              <span>Workspace Members</span>
            </h2>

            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
              <div className="space-y-3">
                {activeWorkspace?.members.map((m: any) => {
                  const memberId = m.user._id || m.user;
                  const isSelf = memberId === user?.id;
                  return (
                    <div key={memberId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center font-bold text-neutral-600 shrink-0">
                          {m.user.name?.charAt(0) || 'M'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 truncate">{m.user.name}</p>
                          <p className="text-[10px] text-neutral-450 truncate">{m.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          m.role === 'owner' 
                            ? 'bg-purple-50 text-purple-655 border-purple-150' 
                            : 'bg-neutral-50 text-neutral-550 border-neutral-200'
                        }`}>
                          {m.role}
                        </span>
                        {userRole === 'owner' && !isSelf && (
                          <button
                            onClick={() => handleRemoveMember(memberId)}
                            title="Remove Member"
                            className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Invite Member Section (Only Workspace Owners) */}
              {userRole === 'owner' && (
                <div className="border-t border-neutral-100 pt-4 mt-2">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Invite Team Member</h4>
                  <form onSubmit={handleInvite} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="email"
                        required
                        placeholder="colleague@domain.com"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-neutral-800 text-xs transition-all placeholder:text-neutral-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={inviting}
                      className="h-9 px-3.5 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Invite
                    </button>
                  </form>

                  {inviteSuccess && (
                    <p className="text-[10px] text-emerald-600 mt-2">Member added to workspace successfully!</p>
                  )}
                  {inviteError && (
                    <p className="text-[10px] text-red-655 mt-2">{inviteError}</p>
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
              className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh] no-scrollbar text-neutral-900"
            >
              <button 
                onClick={() => setShowEventModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-xl font-bold text-neutral-950">Create New Event</h3>
                <p className="text-sm text-neutral-500 mt-1">Schedule a meeting, meetup, or workshop for your workspace.</p>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Event Title</label>
                  <Input
                    required
                    placeholder="e.g. Weekly All Hands"
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about this event..."
                    value={newEvent.description}
                    onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-3 bg-white border border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-neutral-800 text-sm transition-all placeholder:text-neutral-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-neutral-850 text-xs transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Venue</label>
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
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                      className="w-full h-11 bg-white border border-neutral-200 rounded-xl focus:border-purple-500 text-neutral-800 px-3 text-sm"
                    >
                      <option value="General">General</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Meetup">Meetup</option>
                      <option value="Conference">Conference</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Seat Limit</label>
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
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Cover Image URL (Optional)</label>
                  <Input
                    placeholder="https://unsplash.com/... (optional)"
                    value={newEvent.coverImage}
                    onChange={e => setNewEvent({...newEvent, coverImage: e.target.value})}
                  />
                </div>

                {eventError && (
                  <p className="text-xs text-red-655 bg-red-50 border border-red-200 p-2 rounded-lg">{eventError}</p>
                )}

                <button
                  type="submit"
                  disabled={creatingEvent}
                  className="w-full h-11 bg-neutral-950 text-white font-semibold rounded-xl text-sm transition-all hover:bg-neutral-800 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creatingEvent && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
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
