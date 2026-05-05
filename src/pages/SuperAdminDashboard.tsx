import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
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
  ArrowDownRight,
  LayoutDashboard,
  Settings as SettingsIcon,
  Database,
  CreditCard,
  Ticket,
  Flag,
  Trophy
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const SuperAdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') || 'overview') as 'overview' | 'colleges' | 'users' | 'events' | 'payments' | 'settings' | 'logs';
  
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const [colleges, setColleges] = useState([]);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalColleges: 0,
    totalStudents: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    platformProfit: 0
  });
  const [analytics, setAnalytics] = useState<any>({
    growthData: [],
    dailyActivity: [],
    collegeDistribution: [],
    categoryDistribution: []
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [creatingCollege, setCreatingCollege] = useState(false);
  const [addCollegeError, setAddCollegeError] = useState('');
  const [addCollegeSuccess, setAddCollegeSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingSettings, setUpdatingSettings] = useState(false);
  
  // User Management States
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  
  // Event Management States
  const [eventSearch, setEventSearch] = useState('');
  const [eventSortBy, setEventSortBy] = useState<'date-asc' | 'date-desc'>('date-asc');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('');

  // New College Form State
  const [newCollege, setNewCollege] = useState({ 
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
      const [collegesRes, analyticsRes, usersRes, logsRes, eventsRes, transactionsRes] = await Promise.all([
        fetch('/api/colleges', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/super-admin', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/auth/search', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/audit-logs', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/all-events', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/analytics/transactions', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      ]);

      const collegesData = await collegesRes.json();
      const analyticsData = await analyticsRes.json();
      const usersData = await usersRes.json();
      const logsData = await logsRes.json();
      const eventsData = await eventsRes.json();
      const transactionsData = await transactionsRes.json();

      if (Array.isArray(collegesData)) setColleges(collegesData);
      if (analyticsData.stats) setStats(analyticsData.stats);
      if (analyticsData.growthData) setAnalytics(prev => ({ ...prev, growthData: analyticsData.growthData }));
      if (analyticsData.dailyActivity) setAnalytics(prev => ({ ...prev, dailyActivity: analyticsData.dailyActivity }));
      if (analyticsData.collegeDistribution) setAnalytics(prev => ({ ...prev, collegeDistribution: analyticsData.collegeDistribution }));
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

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/auth/users/${userId}/role`, {
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
      console.error('Failed to update role:', err);
    }
  };

  const handleUpdateCollegeStatus = async (collegeId: string, status: string) => {
    try {
      const res = await fetch(`/api/colleges/${collegeId}/status`, {
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
      console.error('Failed to update college status:', err);
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

  const handleUpdateCollegeFeatures = async (collegeId: string, features: any) => {
    try {
      const res = await fetch(`/api/colleges/${collegeId}/features`, {
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
      console.error('Failed to update college features:', err);
    }
  };

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCollege(true);
    setAddCollegeError('');
    setAddCollegeSuccess('');

    try {
      const res = await fetch('/api/colleges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCollege)
      });

      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await res.json()
        : { message: 'Unexpected server response while creating college.' };

      if (res.ok) {
        setAddCollegeSuccess('College created successfully.');
        setNewCollege({ name: '', domain: '', address: '', adminName: '', adminEmail: '', adminPassword: '' });
        await fetchData();
        setTimeout(() => {
          setShowAddCollege(false);
          setAddCollegeSuccess('');
        }, 900);
      } else {
        setAddCollegeError(payload.message || 'Failed to create college');
      }
    } catch (err) {
      console.error(err);
      setAddCollegeError('Unable to reach server. Please try again.');
    } finally {
      setCreatingCollege(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => {
      return Object.values(obj).map(val => {
        if (typeof val === 'object') return JSON.stringify(val).replace(/,/g, ';');
        return String(val).replace(/,/g, ';');
      }).join(',');
    }).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                           u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredEvents = useMemo(() => {
    let result = events.filter((event: any) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.description?.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.college?.name.toLowerCase().includes(eventSearch.toLowerCase());
      
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
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400">
            <Shield size={14} className="text-emerald-500" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Super Admin Control Plane</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Platform Control Center</h1>
          <p className="text-zinc-400">Global oversight and infrastructure management for CampusSaaS.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2 border-white/[0.06] text-zinc-400"
            onClick={() => exportToCSV(users, 'platform_users_export')}
          >
            <Database size={16} />
            Export Data
          </Button>
          {activeTab === 'colleges' && (
            <Button onClick={() => setShowAddCollege(true)} className="gap-2 shadow-lg shadow-black/5">
              <Plus size={18} />
              Add College
            </Button>
          )}
        </div>
      </div>

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
                { label: 'Total Institutions', value: stats.totalColleges, icon: Building2, trend: '+2 this month', color: 'blue' },
                { label: 'Active Students', value: stats.totalStudents, icon: Users, trend: '+12% growth', color: 'emerald' },
                { label: 'Global Events', value: stats.totalEvents, icon: Calendar, trend: '89 active now', color: 'purple' },
                { label: 'Platform Revenue', value: `₹${(stats as any).totalRevenue || 0}`, icon: CreditCard, trend: `₹${(stats as any).platformProfit || 0} profit`, color: 'orange' },
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.1] hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "rounded-xl p-2.5 transition-colors",
                      stat.color === 'blue' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100" :
                      stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" :
                      stat.color === 'purple' ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100" :
                      "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                    )}>
                      <stat.icon size={20} />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      <ArrowUpRight size={12} />
                      {stat.trend}
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
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Daily Activity</h3>
                      <p className="text-xs text-zinc-400">Registration volume over the last 30 days</p>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.dailyActivity}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 8, fill: '#888' }}
                          tickFormatter={(val) => val.split('-').slice(1).join('/')}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#888' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#000" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-400">Institutional Distribution</h3>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.collegeDistribution}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" hide />
                          <Tooltip />
                          <Bar dataKey="studentCount" fill="#000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-400">Event Categories</h3>
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
                            {analytics.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Real-time Activity</h3>
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
                            <Globe size={10} className="text-zinc-400" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">{reg.college?.name}</span>
                          </div>
                        </div>
                        <div className="text-[9px] font-medium text-zinc-400">
                          {formatDate(reg.createdAt)}
                        </div>
                      </div>
                    ))}
                    {recentRegistrations.length === 0 && (
                      <div className="flex h-32 flex-col items-center justify-center text-center">
                        <Database size={24} className="mb-2 text-zinc-300" />
                        <p className="text-xs text-zinc-400">No recent activity detected</p>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" className="mt-6 w-full text-xs font-bold uppercase tracking-widest">View All Logs</Button>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Platform Leaderboard</h3>
                    <Trophy size={16} className="text-yellow-500" />
                  </div>
                  <div className="space-y-4">
                    {analytics.collegeDistribution.map((college: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-4 text-[10px] font-bold text-zinc-400">0{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-xs font-bold">{college.name}</p>
                          <div className="mt-1 h-1 w-full rounded-full bg-white/[0.05]">
                            <div 
                              className="h-full rounded-full bg-white/[0.05]" 
                              style={{ width: `${(college.studentCount / analytics.collegeDistribution[0].studentCount) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold">{college.studentCount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.05] p-6 text-white shadow-xl">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.02]/10">
                    <Shield size={20} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold">System Health</h3>
                  <p className="mt-1 text-xs text-zinc-400">All global services are operational.</p>
                  <div className="mt-6 space-y-3">
                    {[
                      { label: 'API Gateway', status: 'Operational' },
                      { label: 'Auth Service', status: 'Operational' },
                      { label: 'Storage Engine', status: 'Operational' },
                      { label: 'Analytics Pipeline', status: 'Operational' },
                    ].map((svc, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-medium text-zinc-400">{svc.label}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">{svc.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'colleges' && (
          <motion.div
            key="colleges"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/[0.04] p-6">
              <div>
                <h2 className="text-xl font-bold">Institutional Directory</h2>
                <p className="text-xs text-zinc-400">Manage all registered colleges and their administrative access.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search institutions..." 
                    className="h-9 rounded-lg border border-white/[0.06] pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.05]/40/50 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <th className="px-6 py-4">Institution</th>
                    <th className="px-6 py-4">Network Domain</th>
                    <th className="px-6 py-4">Features</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {colleges.map((college: any) => (
                    <tr key={college._id} className="group hover:bg-white/[0.05]/40/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] font-bold text-zinc-400">
                            {college.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{college.name}</p>
                            <p className="text-[10px] text-zinc-400">{college.address || 'Global Campus'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                          <Globe size={12} className="text-zinc-400" />
                          {college.domain}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(college.features || {}).map(([key, val]: [string, any]) => (
                            <button
                              key={key}
                              onClick={() => handleUpdateCollegeFeatures(college._id, { ...college.features, [key]: !val })}
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tighter transition-colors",
                                val ? "bg-emerald-100 text-emerald-700" : "bg-white/[0.05] text-zinc-400"
                              )}
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                          college.status === 'inactive' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {college.status === 'inactive' ? <X size={10} /> : <CheckCircle2 size={10} />}
                          {college.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400">
                        {formatDate(college.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn(
                              "h-8 text-[10px] font-bold uppercase tracking-widest",
                              college.status === 'inactive' ? "text-emerald-600" : "text-red-600"
                            )}
                            onClick={() => handleUpdateCollegeStatus(college._id, college.status === 'inactive' ? 'active' : 'inactive')}
                          >
                            {college.status === 'inactive' ? 'Activate' : 'Deactivate'}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
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
                  <h2 className="text-xl font-bold">Global Event Registry</h2>
                  <p className="text-xs text-zinc-400">Monitor and moderate all events across the platform.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search events or colleges..." 
                      className="h-9 w-full rounded-lg border border-white/[0.06] pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                    />
                  </div>
                  <select 
                    className="h-9 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    value={eventCategoryFilter || 'All'}
                    onChange={(e) => setEventCategoryFilter(e.target.value === 'All' ? '' : e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {systemSettings?.eventCategories?.map((cat: string) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select 
                    className="h-9 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    value={eventStatusFilter || 'All'}
                    onChange={(e) => setEventStatusFilter(e.target.value === 'All' ? '' : e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="flagged">Flagged</option>
                    <option value="moderated">Moderated</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select 
                    className="h-9 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    value={eventSortBy}
                    onChange={(e) => setEventSortBy(e.target.value as any)}
                  >
                    <option value="date-asc">Date (Asc)</option>
                    <option value="date-desc">Date (Desc)</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-white/[0.05]/40/50 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">College</th>
                      <th className="px-6 py-4">Organizer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Registrations</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredEvents.map((event: any) => (
                      <tr key={event._id} className="group hover:bg-white/[0.05]/40/50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{event.title}</p>
                        <p className="text-[10px] text-zinc-400">{event.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium">{event.college?.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs">{event.organizer?.name}</p>
                        <p className="text-[10px] text-zinc-400">{event.organizer?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={event.status}
                          onChange={(e) => handleModerateEvent(event._id, e.target.value)}
                          className={cn(
                            "rounded-lg border-none bg-white/[0.05] px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                            event.status === 'flagged' ? "text-red-600" : "text-zinc-400"
                          )}
                        >
                          <option value="published">Published</option>
                          <option value="flagged">Flagged</option>
                          <option value="moderated">Moderated</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-white/[0.05] overflow-hidden">
                            <div 
                              className="h-full bg-white/[0.05]" 
                              style={{ width: `${Math.min((event.registeredCount / event.seatLimit) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold">{event.registeredCount}/{event.seatLimit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => handleModerateEvent(event._id, 'flagged')}
                          >
                            <Flag size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

        {activeTab === 'payments' && (
          <motion.div
            key="payments"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Volume</p>
                <p className="mt-2 text-3xl font-bold">₹{stats.totalRevenue || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Platform Profit</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">₹{stats.platformProfit || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.05] p-6 text-white shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 opacity-60">Commission Rate</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-3xl font-bold">5%</p>
                  <Button variant="ghost" size="sm" className="text-[10px] text-white/60 hover:text-white">Adjust</Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden">
              <div className="border-b border-white/[0.04] p-6">
                <h2 className="text-xl font-bold">Transaction History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-white/[0.05]/40/50 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">College</th>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Fee</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {transactions.map((tx: any) => (
                      <tr key={tx._id} className="hover:bg-white/[0.05]/40/50">
                        <td className="px-6 py-4 font-mono text-[10px]">{tx._id}</td>
                        <td className="px-6 py-4 text-xs">{tx.college?.name}</td>
                        <td className="px-6 py-4 text-xs">{tx.event?.title}</td>
                        <td className="px-6 py-4 font-bold">₹{tx.amount}</td>
                        <td className="px-6 py-4 text-emerald-600">₹{tx.platformFee}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                          No transactions recorded yet.
                        </td>
                      </tr>
                    )}
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input 
                    placeholder="Search by name, email or UID..." 
                    className="pl-10"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <select 
                  className="h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="college_admin">College Admin</option>
                  <option value="dept_admin">Dept Admin</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-white/[0.05]/40/50 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <th className="px-6 py-4">User Identity</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Affiliation</th>
                      <th className="px-6 py-4">Security</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredUsers.map((u: any) => (
                      <tr key={u._id} className="group hover:bg-white/[0.05]/40/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-[10px] font-bold text-white">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white">{u.name}</p>
                              <p className="text-[10px] text-zinc-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            className="bg-transparent text-[9px] font-bold uppercase tracking-wider text-zinc-400 focus:outline-none"
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="college_admin">College Admin</option>
                            <option value="dept_admin">Dept Admin</option>
                            <option value="student">Student</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-zinc-300">{u.college?.name || 'Platform Level'}</p>
                          <p className="text-[10px] text-zinc-400">{u.department?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <Shield size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                              onClick={() => handleImpersonate(u._id)}
                            >
                              Impersonate
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreVertical size={16} />
                            </Button>
                          </div>
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden"
          >
            <div className="border-b border-white/[0.04] p-6">
              <h2 className="text-xl font-bold">Audit Trail</h2>
              <p className="text-xs text-zinc-400">Comprehensive log of all administrative actions across the platform.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.05]/40/50 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {auditLogs.map((log: any) => (
                    <tr key={log._id} className="hover:bg-white/[0.05]/40/50">
                      <td className="px-6 py-4 whitespace-nowrap text-[10px] font-mono text-zinc-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-white/[0.05] flex items-center justify-center text-[8px] font-bold">
                            {log.userId?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{log.userId?.name}</p>
                            <p className="text-[9px] text-zinc-400">{log.userId?.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-400">
                          {log.module}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-zinc-400 max-w-xs truncate">
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
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Platform Configuration</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Maintenance Mode</p>
                      <p className="text-xs text-zinc-400">Disable all non-admin access to the platform.</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateSettings({ maintenanceMode: !systemSettings?.maintenanceMode })}
                      className={cn(
                        "h-6 w-11 rounded-full transition-colors relative",
                        systemSettings?.maintenanceMode ? "bg-red-500" : "bg-white/[0.08]"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 h-4 w-4 rounded-full bg-white/[0.02] transition-all",
                        systemSettings?.maintenanceMode ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Public Registration</p>
                      <p className="text-xs text-zinc-400">Allow new students to sign up autonomously.</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateSettings({ registrationEnabled: !systemSettings?.registrationEnabled })}
                      className={cn(
                        "h-6 w-11 rounded-full transition-colors relative",
                        systemSettings?.registrationEnabled ? "bg-emerald-500" : "bg-white/[0.08]"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 h-4 w-4 rounded-full bg-white/[0.02] transition-all",
                        systemSettings?.registrationEnabled ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Platform Name</label>
                    <Input 
                      value={systemSettings?.platformName} 
                      onChange={(e) => setSystemSettings({...systemSettings, platformName: e.target.value})}
                      onBlur={() => handleUpdateSettings({ platformName: systemSettings.platformName })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Support Email</label>
                    <Input 
                      value={systemSettings?.supportEmail} 
                      onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                      onBlur={() => handleUpdateSettings({ supportEmail: systemSettings.supportEmail })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Global Commission Rate (%)</label>
                    <Input 
                      type="number"
                      value={systemSettings?.globalCommissionRate} 
                      onChange={(e) => setSystemSettings({...systemSettings, globalCommissionRate: parseInt(e.target.value)})}
                      onBlur={() => handleUpdateSettings({ globalCommissionRate: systemSettings.globalCommissionRate })}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Event Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {systemSettings?.eventCategories?.map((cat: string, i: number) => (
                        <div key={i} className="flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium">
                          {cat}
                          <button 
                            onClick={() => {
                              const newCats = systemSettings.eventCategories.filter((_: any, index: number) => index !== i);
                              handleUpdateSettings({ eventCategories: newCats });
                            }}
                            className="ml-1 text-zinc-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        id="new-category"
                        placeholder="Add new category..." 
                        className="h-9 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !systemSettings.eventCategories.includes(val)) {
                              handleUpdateSettings({ eventCategories: [...systemSettings.eventCategories, val] });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => {
                          const input = document.getElementById('new-category') as HTMLInputElement;
                          const val = input.value.trim();
                          if (val && !systemSettings.eventCategories.includes(val)) {
                            handleUpdateSettings({ eventCategories: [...systemSettings.eventCategories, val] });
                            input.value = '';
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Infrastructure Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Payment Gateway</label>
                    <select 
                      className="w-full rounded-xl border border-white/[0.06] p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      value={systemSettings?.paymentGateway?.provider}
                      onChange={(e) => handleUpdateSettings({ paymentGateway: { ...systemSettings.paymentGateway, provider: e.target.value } })}
                    >
                      <option value="Stripe">Stripe</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Provider</label>
                    <select 
                      className="w-full rounded-xl border border-white/[0.06] p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      value={systemSettings?.emailConfig?.provider}
                      onChange={(e) => handleUpdateSettings({ emailConfig: { ...systemSettings.emailConfig, provider: e.target.value } })}
                    >
                      <option value="SendGrid">SendGrid</option>
                      <option value="AWS SES">AWS SES</option>
                      <option value="Mailgun">Mailgun</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Global Announcements</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Banner Active</p>
                    <button 
                      onClick={() => handleUpdateSettings({ globalBanner: { ...systemSettings.globalBanner, active: !systemSettings.globalBanner.active } })}
                      className={cn(
                        "h-6 w-11 rounded-full transition-colors relative",
                        systemSettings?.globalBanner?.active ? "bg-blue-500" : "bg-white/[0.08]"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 h-4 w-4 rounded-full bg-white/[0.02] transition-all",
                        systemSettings?.globalBanner?.active ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Banner Message</label>
                    <textarea 
                      className="w-full rounded-xl border border-white/[0.06] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      rows={3}
                      value={systemSettings?.globalBanner?.message}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        globalBanner: { ...systemSettings.globalBanner, message: e.target.value }
                      })}
                      onBlur={() => handleUpdateSettings({ globalBanner: systemSettings.globalBanner })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Add College Modal */}
      {showAddCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-900/80 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_55%)]" aria-hidden="true" />
            <div className="absolute -right-20 top-8 h-44 w-44 rounded-full bg-purple-500/15 blur-3xl" aria-hidden="true" />
            <div className="absolute -left-16 bottom-8 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" aria-hidden="true" />

            <div className="relative flex items-center justify-between border-b border-white/[0.08] bg-black/20 px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Add New College</h2>
                <p className="text-sm text-zinc-400">Create a college account and set its primary admin.</p>
              </div>
              <button onClick={() => setShowAddCollege(false)} className="rounded-full p-2 text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCollege} className="relative p-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* College Details */}
                <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                    <Building2 size={16} className="text-zinc-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Institutional Identity</h3>
                  </div>
                  <Input
                    label="College Name"
                    placeholder="e.g. Stanford University"
                    value={newCollege.name}
                    onChange={e => setNewCollege({ ...newCollege, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Network Domain"
                    placeholder="stanford.edu"
                    value={newCollege.domain}
                    onChange={e => setNewCollege({ ...newCollege, domain: e.target.value })}
                    required
                  />
                  <Input
                    label="Physical Address"
                    placeholder="Campus location..."
                    value={newCollege.address}
                    onChange={e => setNewCollege({ ...newCollege, address: e.target.value })}
                  />
                </div>

                {/* Admin Details */}
                <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                    <Shield size={16} className="text-zinc-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Primary Administrator</h3>
                  </div>
                  <Input
                    label="Full Name"
                    placeholder="Admin Name"
                    value={newCollege.adminName}
                    onChange={e => setNewCollege({ ...newCollege, adminName: e.target.value })}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Admin Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <Input
                        placeholder="admin@college.edu"
                        className="pl-10"
                        type="email"
                        value={newCollege.adminEmail}
                        onChange={e => setNewCollege({ ...newCollege, adminEmail: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Initial Password</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={newCollege.adminPassword}
                        onChange={e => setNewCollege({ ...newCollege, adminPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <AlertCircle size={18} />
                  <p className="text-[10px] font-medium leading-tight">
                    This will create the college and its admin login.<br />
                    Make sure the admin email is valid and unique.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddCollege(false)} disabled={creatingCollege}>
                    Cancel
                  </Button>
                  <Button type="submit" className="shadow-xl shadow-purple-900/30" isLoading={creatingCollege}>
                    Create College
                  </Button>
                </div>
              </div>
              {(addCollegeError || addCollegeSuccess) && (
                <div className={cn(
                  "mt-4 rounded-xl border px-4 py-3 text-sm",
                  addCollegeError
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                )}>
                  {addCollegeError || addCollegeSuccess}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
