import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Calendar, 
  Plus, 
  MapPin, 
  TrendingUp, 
  CreditCard, 
  Settings as SettingsIcon, 
  Search, 
  CheckCircle2, 
  X,
  Globe,
  Upload,
  Trophy
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export const OrgAdminDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [orgUsers, setOrgUsers] = useState<any[]>([]);
  const [orgEvents, setOrgEvents] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [orgSettings, setOrgSettings] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  });
  
  const [venueStats, setVenueStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // User Management
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [creatingUser, setCreatingUser] = useState(false);
  
  // Event Management
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    coverImage: '',
    galleryImages: [] as string[],
    category: 'General',
    seatLimit: 50,
    status: 'published'
  });

  const filesToDataUrls = async (files: FileList | null) => {
    if (!files || files.length === 0) return [] as string[];
    const toDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    return Promise.all(Array.from(files).map((f) => toDataUrl(f)));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      // Fetch platform settings for categories
      const sysSettingsRes = await fetch('/api/analytics/settings', { headers });
      const sysSettingsData = await sysSettingsRes.json().catch(() => null);
      if (sysSettingsData?.eventCategories) setCategories(sysSettingsData.eventCategories);
      
      // Fetch stats
      const statsRes = await fetch('/api/analytics/org-stats', { headers });
      const statsData = await statsRes.json();
      if (statsData.stats) setStats(statsData.stats);
      if (statsData.venueStats) setVenueStats(statsData.venueStats);

      // Fetch tab specific data
      if (activeTab === 'users') {
        const usersRes = await fetch('/api/org-admin/users', { headers });
        setOrgUsers(await usersRes.json());
      } else if (activeTab === 'events') {
        const eventsRes = await fetch('/api/org-admin/events', { headers });
        setOrgEvents(await eventsRes.json());
      } else if (activeTab === 'payments') {
        const transRes = await fetch('/api/org-admin/transactions', { headers });
        setTransactions(await transRes.json());
      } else if (activeTab === 'settings') {
        const settingsRes = await fetch('/api/org-admin/settings', { headers });
        setOrgSettings(await settingsRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      const res = await fetch('/api/org-admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowAddUser(false);
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        fetchData();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/org-admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateEventStatus = async (eventId: string, status: string) => {
    try {
      const res = await fetch(`/api/org-admin/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrgSettings = async (updates: any) => {
    try {
      const res = await fetch('/api/org-admin/settings', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setOrgSettings(updated);
        alert('Settings updated successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingEvent(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newEvent),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(payload?.message || 'Failed to create event');
        return;
      }

      setShowAddEvent(false);
      setNewEvent({ title: '', description: '', date: '', venue: '', coverImage: '', galleryImages: [], category: 'General', seatLimit: 50, status: 'published' });
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setCreatingEvent(false);
    }
  };

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/[0.06] border-t-black" />
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Workspace Users', value: stats.totalUsers, icon: Users, color: 'text-purple-500' },
          { title: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-indigo-500' },
          { title: 'Total RSVPs', value: stats.totalRegistrations, icon: Trophy, color: 'text-emerald-500' },
          { title: 'Revenue Generated', value: `₹${stats.totalRevenue || 0}`, icon: CreditCard, color: 'text-orange-500' }
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-0.5">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Venue Util */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Venue Insights</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={venueStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} name="Events Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Occupancy Metrics</h3>
          <div className="space-y-4">
            {venueStats.map((venue: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
                  <span>{venue.name}</span>
                  <span>{venue.registered} / {venue.capacity} RSVPs</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${Math.min(100, (venue.registered / (venue.capacity || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/[0.04] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Workspace Members</h2>
          <p className="text-xs text-zinc-400">Manage admin roles and registered users mapping to your workspace.</p>
        </div>
        <Button onClick={() => setShowAddUser(true)} className="gap-2 bg-white text-black hover:bg-zinc-200">
          <Plus size={16} /> Add Member
        </Button>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/[0.04] text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {orgUsers.map((u: any) => (
              <tr key={u._id} className="hover:bg-white/[0.01]">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-white">{u.name}</p>
                    <p className="text-xs text-zinc-400">{u.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                    u.role === 'org_admin' ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800 text-zinc-300"
                  )}>
                    {u.role === 'org_admin' ? 'Workspace Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-400">
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  {u.email !== user?.email ? (
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                      className="bg-zinc-800 border-none rounded-lg px-2 py-1 text-xs text-white"
                    >
                      <option value="user">User</option>
                      <option value="org_admin">Workspace Admin</option>
                    </select>
                  ) : (
                    <span className="text-xs text-zinc-500">Primary Admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/[0.04] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Workspace Events</h2>
          <p className="text-xs text-zinc-400">Create, edit, and moderate events hosted under your brand.</p>
        </div>
        <Button className="gap-2 bg-white text-black hover:bg-zinc-200" onClick={() => setShowAddEvent(true)}>
          <Plus size={16} /> Create Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orgEvents.map((event: any) => (
          <div key={event._id} className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            {event.coverImage && (
              <img src={event.coverImage} alt={event.title} className="mb-4 h-40 w-full rounded-xl object-cover border border-white/[0.08]" />
            )}
            <div className="flex items-center justify-between">
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                event.status === 'published' ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-300"
              )}>
                {event.status}
              </span>
              <div className="flex gap-2">
                <select
                  value={event.status}
                  onChange={(e) => updateEventStatus(event._id, e.target.value)}
                  className="bg-zinc-800 border-none text-[10px] text-white rounded-lg px-2 py-0.5"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="flagged">Flagged</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <h3 className="mt-4 font-bold text-white leading-tight">{event.title}</h3>
            <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{event.description}</p>
            
            <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-1">
                <Calendar size={13} />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Users size={13} />
                {event.registeredCount} / {event.seatLimit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="border-b border-white/[0.04] pb-6">
        <h2 className="text-xl font-bold">Revenue & Ticket Transactions</h2>
        <p className="text-xs text-zinc-400">Overview of paid event registration logs.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/[0.04] text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {transactions.map((t: any) => (
              <tr key={t._id} className="hover:bg-white/[0.01]">
                <td className="px-6 py-4 font-mono text-xs text-zinc-400">{t._id}</td>
                <td className="px-6 py-4 font-semibold text-white">{t.event?.title}</td>
                <td className="px-6 py-4 text-xs text-zinc-300">{t.user?.name}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-white">₹{t.amount}</span>
                  <span className="text-[10px] text-zinc-500 block">Payout: ₹{t.organizationRevenue}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[9px] font-bold uppercase">
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-500">{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No ticket sales recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl space-y-8">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold">Workspace Details & Branding</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Customize your profile, custom logo, theme, and social handles.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input 
            label="Organization Name" 
            value={orgSettings?.name || ''} 
            onChange={(e) => setOrgSettings({...orgSettings, name: e.target.value})}
          />
          <Input 
            label="Slug (public URL path)" 
            value={orgSettings?.slug || ''} 
            onChange={(e) => setOrgSettings({...orgSettings, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
          />
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold uppercase text-zinc-400">About Workspace</label>
            <textarea
              className="w-full rounded-xl bg-zinc-800 border-none text-sm text-white p-3 focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={orgSettings?.about || ''}
              onChange={(e) => setOrgSettings({...orgSettings, about: e.target.value})}
            />
          </div>
          <Input 
            label="Physical Address" 
            value={orgSettings?.address || ''} 
            onChange={(e) => setOrgSettings({...orgSettings, address: e.target.value})}
          />
          <Input 
            label="Website" 
            value={orgSettings?.socialLinks?.website || ''} 
            onChange={(e) => setOrgSettings({
              ...orgSettings,
              socialLinks: { ...(orgSettings?.socialLinks || {}), website: e.target.value }
            })}
          />
        </div>

        <div className="border-t border-white/[0.06] pt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-400 block">Workspace Logo</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                {orgSettings?.logo ? (
                  <img src={orgSettings.logo} alt="logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={24} className="text-zinc-500" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="text-xs"
                onChange={async (e) => {
                  const urls = await filesToDataUrls(e.target.files);
                  if (urls[0]) setOrgSettings({ ...orgSettings, logo: urls[0] });
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex justify-end">
          <Button onClick={() => updateOrgSettings(orgSettings)} className="bg-white text-black hover:bg-zinc-200">
            Save Branding Settings
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Navigation tabs */}
      <div className="flex border-b border-white/[0.06] pb-px">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'events', label: 'Events' },
          { id: 'users', label: 'Members' },
          { id: 'payments', label: 'Payments' },
          { id: 'settings', label: 'Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={cn(
              "px-6 py-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'settings' && renderSettings()}
        </AnimatePresence>
      </div>

      {/* Add Member Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-zinc-900 p-8 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <h2 className="text-xl font-bold">Add Member</h2>
              <button onClick={() => setShowAddUser(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                label="Full Name"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-zinc-400">Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-xl bg-zinc-800 border-none text-sm text-white p-3"
                >
                  <option value="user">User</option>
                  <option value="org_admin">Workspace Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={creatingUser}>
                  Add Member
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-3xl border border-white/[0.08] bg-zinc-900 p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <h2 className="text-xl font-bold">Create Event</h2>
              <button onClick={() => setShowAddEvent(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <Input 
                label="Event Title" 
                value={newEvent.title} 
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} 
                required 
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-zinc-400">Description</label>
                <textarea
                  className="w-full rounded-xl bg-zinc-800 border-none text-sm text-white p-3 focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input 
                  label="Date & Time" 
                  type="datetime-local" 
                  value={newEvent.date} 
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} 
                  required 
                />
                <Input 
                  label="Venue" 
                  value={newEvent.venue} 
                  onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} 
                  required 
                />
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-zinc-400">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full rounded-xl bg-zinc-800 border-none text-sm text-white p-3"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Input 
                  label="RSVP Capacity" 
                  type="number" 
                  value={newEvent.seatLimit} 
                  onChange={e => setNewEvent({ ...newEvent, seatLimit: parseInt(e.target.value) || 50 })} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-zinc-400">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const urls = await filesToDataUrls(e.target.files);
                    if (urls[0]) setNewEvent({ ...newEvent, coverImage: urls[0] });
                  }}
                />
                {newEvent.coverImage && <img src={newEvent.coverImage} className="h-32 w-full object-cover rounded-xl mt-2" />}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddEvent(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={creatingEvent}>
                  Create Event
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
