import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  MoreVertical, 
  Shield, 
  Activity, 
  Globe, 
  Mail, 
  Lock,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Settings as SettingsIcon,
  Database,
  CreditCard,
  Flag,
  Trophy
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/utils';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#22c55e'];

export const PlatformAdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') || 'overview') as 'overview' | 'organizations' | 'users' | 'events' | 'payments' | 'settings' | 'logs';
  
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    platformProfit: 0
  });
  const [analytics, setAnalytics] = useState<any>({
    growthData: [],
    dailyActivity: [],
    organizationDistribution: [],
    categoryDistribution: []
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [showAddOrganization, setShowAddOrganization] = useState(false);
  const [creatingOrganization, setCreatingOrganization] = useState(false);
  const [addOrganizationError, setAddOrganizationError] = useState('');
  const [addOrganizationSuccess, setAddOrganizationSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingSettings, setUpdatingSettings] = useState(false);
  
  // User Management States
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  
  // Event Management States
  const [eventSearch, setEventSearch] = useState('');
  const [eventSortBy, setEventSortBy] = useState<'date-asc' | 'date-desc'>('date-asc');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('');

  // New Organization Form State
  const [newOrganization, setNewOrganization] = useState({ 
    name: '', 
    domain: '', 
    address: '',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orgsRes, analyticsRes, usersRes, logsRes, eventsRes, transactionsRes] = await Promise.all([
        fetch('/api/organizations', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/super-admin', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/auth/search', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/audit-logs', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/all-events', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/transactions', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      ]);

      const orgsData = await orgsRes.json();
      const analyticsData = await analyticsRes.json();
      const usersData = await usersRes.json();
      const logsData = await logsRes.json();
      const eventsData = await eventsRes.json();
      const transactionsData = await transactionsRes.json();

      if (Array.isArray(orgsData)) setOrganizations(orgsData);
      if (analyticsData.stats) setStats(analyticsData.stats);
      if (analyticsData.growthData) setAnalytics(prev => ({ ...prev, growthData: analyticsData.growthData }));
      if (analyticsData.dailyActivity) setAnalytics(prev => ({ ...prev, dailyActivity: analyticsData.dailyActivity }));
      if (analyticsData.organizationDistribution) setAnalytics(prev => ({ ...prev, organizationDistribution: analyticsData.organizationDistribution }));
      if (analyticsData.categoryDistribution) setAnalytics(prev => ({ ...prev, categoryDistribution: analyticsData.categoryDistribution }));
      if (analyticsData.settings) setSystemSettings(analyticsData.settings);
      if (Array.isArray(analyticsData.recentRegistrations)) setRecentRegistrations(analyticsData.recentRegistrations);
      if (Array.isArray(usersData)) setUsers(usersData);
      if (Array.isArray(logsData)) setAuditLogs(logsData);
      if (Array.isArray(eventsData)) setEvents(eventsData);
      if (Array.isArray(transactionsData)) setTransactions(transactionsData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (updates: any) => {
    setUpdatingSettings(true);
    try {
      const res = await fetch('/api/analytics/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setSystemSettings(updated);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleImpersonate = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Impersonation failed:', err);
    }
  };

  const handleUpdateOrganizationStatus = async (organizationId: string, status: string) => {
    try {
      const res = await fetch(`/api/organizations/${organizationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update organization status:', err);
    }
  };

  const handleModerateEvent = async (eventId: string, status: string) => {
    try {
      const res = await fetch(`/api/analytics/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to moderate event:', err);
    }
  };

  const handleUpdateOrganizationFeatures = async (organizationId: string, features: any) => {
    try {
      const res = await fetch(`/api/organizations/${organizationId}/features`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ features })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update organization features:', err);
    }
  };

  const handleAddOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOrganization(true);
    setAddOrganizationError('');
    setAddOrganizationSuccess('');

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newOrganization)
      });

      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await res.json()
        : { message: 'Unexpected server response while creating organization.' };

      if (res.ok) {
        setAddOrganizationSuccess('Organization created successfully.');
        setNewOrganization({ name: '', domain: '', address: '', adminName: '', adminEmail: '', adminPassword: '' });
        await fetchData();
        setTimeout(() => {
          setShowAddOrganization(false);
          setAddOrganizationSuccess('');
        }, 900);
      } else {
        setAddOrganizationError(payload.message || 'Failed to create organization');
      }
    } catch (err) {
      console.error(err);
      setAddOrganizationError('Unable to reach server. Please try again.');
    } finally {
      setCreatingOrganization(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                           u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = u.role === 'org_admin';
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch]);

  const filteredEvents = useMemo(() => {
    let result = events.filter((event: any) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.description?.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.organization?.name.toLowerCase().includes(eventSearch.toLowerCase());
      
      const matchesCategory = !eventCategoryFilter || event.category === eventCategoryFilter;
      const matchesStatus = !eventStatusFilter || event.status === eventStatusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    result.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return eventSortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [events, eventSearch, eventSortBy, eventCategoryFilter, eventStatusFilter]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/[0.06] border-t-black" />
          <p className="font-mono text-sm text-zinc-400 uppercase tracking-widest">Initializing Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Navigation Tabs */}
      <div className="flex border-b border-white/[0.06] pb-px">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'organizations', label: 'Organizations' },
          { id: 'users', label: 'Admins' },
          { id: 'events', label: 'Events' },
          { id: 'payments', label: 'Payments' },
          { id: 'settings', label: 'Settings' },
          { id: 'logs', label: 'Logs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400">
            <Shield size={14} className="text-emerald-500" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Platform Admin Control Plane</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Control Center</h1>
          <p className="text-zinc-400">Platform oversight and workspace infrastructure management.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === 'organizations' && (
            <Button onClick={() => setShowAddOrganization(true)} className="gap-2 shadow-lg bg-white text-black hover:bg-zinc-200">
              <Plus size={18} />
              Add Organization
            </Button>
          )}
        </div>
      </div>

      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Organizations', value: stats.totalOrganizations, icon: Building2, color: 'blue' },
                  { label: 'Active Users', value: stats.totalUsers, icon: Users, color: 'emerald' },
                  { label: 'Events Managed', value: stats.totalEvents, icon: Calendar, color: 'purple' },
                  { label: 'Platform Volume', value: `₹${stats.totalRevenue || 0}`, icon: CreditCard, color: 'orange' },
                ].map((stat, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.1]">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "rounded-xl p-2.5 transition-colors bg-white/10 text-white"
                      )}>
                        <stat.icon size={20} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                      <h3 className="mt-1 text-3xl font-bold tracking-tight">{stat.value.toLocaleString()}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold">Daily Registrations</h3>
                      <p className="text-xs text-zinc-400">Volume tracker for the last 30 days</p>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.dailyActivity}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 8, fill: '#888' }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#888' }}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46' }}
                          />
                          <Bar dataKey="count" fill="#6366f1" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-400">Distribution</h3>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.organizationDistribution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis dataKey="name" hide />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                            <Bar dataKey="userCount" fill="#a855f7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-400">Categories</h3>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.categoryDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analytics.categoryDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-bold">Recent Registrations</h3>
                      <Activity size={16} className="animate-pulse text-emerald-500" />
                    </div>
                    <div className="space-y-6">
                      {recentRegistrations.map((reg: any) => (
                        <div key={reg._id} className="flex items-start gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] font-mono text-[10px] font-bold">
                            {reg.user?.name.charAt(0)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-xs font-bold text-white">
                              {reg.user?.name}
                            </p>
                            <p className="truncate text-[10px] text-zinc-400">
                              Registered for <span className="font-semibold text-zinc-300">{reg.event?.title}</span>
                            </p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <Globe size={10} className="text-zinc-500" />
                              <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">{reg.organization?.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {recentRegistrations.length === 0 && (
                        <div className="flex h-32 flex-col items-center justify-center text-center">
                          <Database size={24} className="mb-2 text-zinc-500" />
                          <p className="text-xs text-zinc-400">No activity logs found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'organizations' && (
            <motion.div
              key="organizations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/[0.04] p-6">
                <div>
                  <h2 className="text-xl font-bold">Organization Directory</h2>
                  <p className="text-xs text-zinc-400">Manage workspace domains, features, and status.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <th className="px-6 py-4">Workspace</th>
                      <th className="px-6 py-4">Custom Domain</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {organizations.map((org: any) => (
                      <tr key={org._id} className="group hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] font-bold text-zinc-400">
                              {org.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white">{org.name}</p>
                              <p className="text-[10px] text-zinc-400">{org.address || 'Global Workspace'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                          {org.domain || 'no domain'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                            org.status === 'inactive' ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                          )}>
                            {org.status === 'inactive' ? <X size={10} /> : <CheckCircle2 size={10} />}
                            {org.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-400">
                          {formatDate(org.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn(
                              "h-8 text-[10px] font-bold uppercase tracking-widest",
                              org.status === 'inactive' ? "text-emerald-500" : "text-red-500"
                            )}
                            onClick={() => handleUpdateOrganizationStatus(org._id, org.status === 'inactive' ? 'active' : 'inactive')}
                          >
                            {org.status === 'inactive' ? 'Activate' : 'Deactivate'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-white/[0.04] p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Global Events</h2>
                    <p className="text-xs text-zinc-400">Moderation center for all workspace happenings.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <th className="px-6 py-4">Event Details</th>
                        <th className="px-6 py-4">Host Workspace</th>
                        <th className="px-6 py-4">Organizer</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredEvents.map((event: any) => (
                        <tr key={event._id} className="group hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{event.title}</p>
                            <p className="text-[10px] text-zinc-400">{event.category}</p>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {event.organization?.name}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs">{event.organizer?.name}</p>
                            <p className="text-[10px] text-zinc-400">{event.organizer?.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={event.status}
                              onChange={(e) => handleModerateEvent(event._id, e.target.value)}
                              className="rounded-lg bg-zinc-800 border-none px-2 py-1 text-[10px] font-bold uppercase text-white"
                            >
                              <option value="published">Published</option>
                              <option value="flagged">Flagged</option>
                              <option value="moderated">Moderated</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              className="text-red-400 text-xs"
                              onClick={() => handleModerateEvent(event._id, 'flagged')}
                            >
                              Flag
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden">
                <div className="border-b border-white/[0.04] p-6">
                  <h2 className="text-xl font-bold">Workspace Administrators</h2>
                  <p className="text-xs text-zinc-400">Global listing of organization managers.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <th className="px-6 py-4">Admin Name</th>
                        <th className="px-6 py-4">Workspace Affiliation</th>
                        <th className="px-6 py-4 text-right">Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredUsers.map((u: any) => (
                        <tr key={u._id} className="group hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-xs font-bold text-white">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-white">{u.name}</p>
                                <p className="text-[10px] text-zinc-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium">
                            {u.organization?.name || 'Global'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleImpersonate(u._id)}
                              className="text-[10px] uppercase text-zinc-300 hover:text-white"
                            >
                              Impersonate
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden"
            >
              <div className="border-b border-white/[0.04] p-6">
                <h2 className="text-xl font-bold">Audit Logs</h2>
                <p className="text-xs text-zinc-400">Trace actions executed by managers across Planora.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {auditLogs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4 text-[10px] font-mono text-zinc-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {log.userId?.name}
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 text-[10px] text-zinc-400 max-w-sm truncate">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-8 lg:grid-cols-2"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold mb-4">Platform Config</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Maintenance Mode</p>
                      <p className="text-xs text-zinc-400">Block all traffic during updates.</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateSettings({ maintenanceMode: !systemSettings?.maintenanceMode })}
                      className={cn(
                        "h-6 w-11 rounded-full relative transition-colors",
                        systemSettings?.maintenanceMode ? "bg-red-500" : "bg-zinc-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
                        systemSettings?.maintenanceMode ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Public Registration</p>
                      <p className="text-xs text-zinc-400">Allow users to sign up autonomously.</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateSettings({ registrationEnabled: !systemSettings?.registrationEnabled })}
                      className={cn(
                        "h-6 w-11 rounded-full relative transition-colors",
                        systemSettings?.registrationEnabled ? "bg-emerald-500" : "bg-zinc-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
                        systemSettings?.registrationEnabled ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Organization Modal */}
      {showAddOrganization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-xl rounded-3xl border border-white/[0.08] bg-zinc-900 p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <h2 className="text-xl font-bold">Add Workspace</h2>
              <button onClick={() => setShowAddOrganization(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddOrganization} className="space-y-4">
              <Input
                label="Organization Name"
                placeholder="e.g. Summer Sports Group"
                value={newOrganization.name}
                onChange={e => setNewOrganization({ ...newOrganization, name: e.target.value })}
                required
              />
              <Input
                label="Custom Website/Domain"
                placeholder="example.com"
                value={newOrganization.domain}
                onChange={e => setNewOrganization({ ...newOrganization, domain: e.target.value })}
              />
              <Input
                label="Office Location"
                value={newOrganization.address}
                onChange={e => setNewOrganization({ ...newOrganization, address: e.target.value })}
              />
              
              <div className="border-t border-white/[0.08] pt-4 mt-6">
                <h3 className="text-xs font-bold uppercase text-zinc-400 mb-3">Primary Admin</h3>
                <Input
                  label="Name"
                  placeholder="Manager Full Name"
                  value={newOrganization.adminName}
                  onChange={e => setNewOrganization({ ...newOrganization, adminName: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newOrganization.adminEmail}
                  onChange={e => setNewOrganization({ ...newOrganization, adminEmail: e.target.value })}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={newOrganization.adminPassword}
                  onChange={e => setNewOrganization({ ...newOrganization, adminPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddOrganization(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={creatingOrganization}>
                  Create Workspace
                </Button>
              </div>
              
              {addOrganizationError && (
                <div className="text-red-400 text-xs mt-2 border border-red-500/20 bg-red-500/10 p-2.5 rounded-lg">
                  {addOrganizationError}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
