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
  Settings, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  Mail,
  PieChart,
  Layers,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export const CollegeAdminDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [collegeUsers, setCollegeUsers] = useState([]);
  const [collegeEvents, setCollegeEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [collegeSettings, setCollegeSettings] = useState<any>(null);
  
  const [stats, setStats] = useState({
    totalDepts: 0,
    totalStudents: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  });
  
  const [deptStats, setDeptStats] = useState([]);
  const [venueStats, setVenueStats] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddSpec, setShowAddSpec] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [newSpec, setNewSpec] = useState({ name: '', departmentId: '', description: '' });
  const [userAssignments, setUserAssignments] = useState<Record<string, { role: string; department: string; specialization: string }>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const [editingDept, setEditingDept] = useState<any>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student', department: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      // Fetch stats
      const statsRes = await fetch('/api/analytics/college-admin', { headers });
      const statsData = await statsRes.json();
      setStats(statsData.stats);
      setDeptStats(statsData.deptStats);
      setVenueStats(statsData.venueStats);

      // Fetch tab specific data
      if (activeTab === 'departments') {
        const deptsRes = await fetch('/api/departments', { headers });
        const specsRes = await fetch('/api/college-admin/specializations', { headers });
        setDepartments(await deptsRes.json());
        setSpecializations(await specsRes.json());
      } else if (activeTab === 'users') {
        const usersRes = await fetch('/api/college-admin/users', { headers });
        setCollegeUsers(await usersRes.json());
      } else if (activeTab === 'events') {
        const eventsRes = await fetch('/api/college-admin/events', { headers });
        setCollegeEvents(await eventsRes.json());
      } else if (activeTab === 'payments') {
        const transRes = await fetch('/api/college-admin/transactions', { headers });
        setTransactions(await transRes.json());
      } else if (activeTab === 'settings') {
        const settingsRes = await fetch('/api/college-admin/settings', { headers });
        setCollegeSettings(await settingsRes.json());
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

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) return alert('Please enter a department name');
    try {
      const res = await fetch('/api/college-admin/departments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newDept)
      });
      if (res.ok) {
        setShowAddDept(false);
        setNewDept({ name: '', description: '' });
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to create department');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleEditDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      const res = await fetch(`/api/college-admin/departments/${editingDept._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: editingDept.name, description: editingDept.description })
      });
      if (res.ok) {
        setEditingDept(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      return alert('Please fill in all required fields (Name, Email, Password)');
    }
    if (newUser.role === 'dept_admin' && !newUser.department) {
      return alert('Please select a department for the Department Admin');
    }
    try {
      const res = await fetch('/api/college-admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowAddUser(false);
        setNewUser({ name: '', email: '', password: '', role: 'student', department: '' });
        fetchData();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDept = async (deptId: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetch(`/api/college-admin/departments/${deptId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to delete department');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpec.departmentId) return alert('Please select a department');
    if (!newSpec.name.trim()) return alert('Please enter a specialization name');
    try {
      const res = await fetch('/api/college-admin/specializations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSpec)
      });
      if (res.ok) {
        setShowAddSpec(false);
        setNewSpec({ name: '', departmentId: '', description: '' });
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to create specialization');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const updateEventStatus = async (eventId: string, status: string) => {
    try {
      const res = await fetch(`/api/college-admin/events/${eventId}/status`, {
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

  const updateCollegeSettings = async (updates: any) => {
    try {
      const res = await fetch('/api/college-admin/settings', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setCollegeSettings(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignmentDraftChange = (userId: string, updates: Partial<{ role: string; department: string; specialization: string }>) => {
    setUserAssignments(prev => {
      const current = prev[userId] || { role: '', department: '', specialization: '' };
      const next = { ...current, ...updates };

      if (updates.role === 'student') {
        next.department = '';
        next.specialization = '';
      }
      if (updates.role === 'dept_admin') {
        next.specialization = '';
      }
      if (updates.department !== undefined && updates.department !== current.department) {
        next.specialization = '';
      }

      return { ...prev, [userId]: next };
    });
  };

  const saveUserAssignment = async (userId: string) => {
    const assignment = userAssignments[userId];
    if (!assignment) return;

    if (assignment.role === 'dept_admin' && !assignment.department) {
      alert('Please select a department for the department admin.');
      return;
    }
    if (assignment.role === 'spec_admin' && (!assignment.department || !assignment.specialization)) {
      alert('Please select both department and specialization for specialization admin.');
      return;
    }

    setSavingUserId(userId);
    try {
      const res = await fetch(`/api/college-admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          role: assignment.role,
          department: assignment.department || null,
          specialization: assignment.specialization || null
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Failed to update user assignment' }));
        alert(err.message || 'Failed to update user assignment');
        return;
      }

      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Unable to update user assignment right now.');
    } finally {
      setSavingUserId(null);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Departments', value: stats.totalDepts, icon: Building2, color: 'text-blue-600' },
          { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-purple-600' },
          { title: 'Global Events', value: stats.totalEvents, icon: Calendar, color: 'text-emerald-600' },
          { title: 'Total Registrations', value: stats.totalRegistrations, icon: TrendingUp, color: 'text-orange-600' },
        ].map((stat) => (
          <div key={stat.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/[0.05]/40 p-3">
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Department Distribution */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold">Department Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Venue Analytics */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold">Venue Utilization</h3>
          <div className="grid gap-4">
            {venueStats.map((venue: any) => (
              <div key={venue._id} className="rounded-xl border border-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-zinc-400" />
                    <span className="font-medium">{venue._id}</span>
                  </div>
                  <span className="text-sm text-zinc-400">{venue.count} Events</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-white/[0.05]">
                  <div 
                    className="h-full rounded-full bg-white transition-all" 
                    style={{ width: `${Math.min(100, (venue.registered / venue.totalSeats) * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-zinc-400">
                  <span>{venue.registered} / {venue.totalSeats} seats filled</span>
                  <span>{Math.round((venue.registered / venue.totalSeats) * 100) || 0}% occupancy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/[0.04] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Departments & Specializations</h2>
          <p className="text-xs text-zinc-400">Manage BBA, BTech, and other departments offered.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddDept(true)} variant="outline" className="gap-2">
            <Plus size={18} /> Add Department
          </Button>
          <Button onClick={() => {
            setNewUser({ name: '', email: '', password: '', role: 'dept_admin', department: '' });
            setShowAddUser(true);
          }} variant="outline" className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
            <Plus size={18} /> Add Admin
          </Button>
          <Button onClick={() => setShowAddSpec(true)} className="gap-2">
            <Plus size={18} /> Add Specialization
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Departments List */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm">
          <div className="border-b border-white/[0.04] p-6">
            <h3 className="font-semibold">Departments</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {departments.map((dept: any) => (
              <div key={dept._id} className="flex items-center justify-between p-6">
                <div>
                  <h4 className="font-medium">{dept.name}</h4>
                  <p className="text-sm text-zinc-400">{dept.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10" onClick={() => {
                    setNewUser({ name: '', email: '', password: '', role: 'dept_admin', department: dept._id });
                    setShowAddUser(true);
                  }}>
                    <Plus size={14} className="mr-1" /> Add Admin
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingDept(dept)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteDept(dept._id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations List */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm">
          <div className="border-b border-white/[0.04] p-6">
            <h3 className="font-semibold">Specializations</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {specializations.map((spec: any) => (
              <div key={spec._id} className="flex items-center justify-between p-6">
                <div>
                  <h4 className="font-medium">{spec.name}</h4>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">{spec.department?.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{spec.description}</p>
                </div>
                <Button variant="ghost" size="sm">Manage</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/[0.04] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Department Admins</h2>
          <p className="text-xs text-zinc-400">View and manage administrators across all departments.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input className="pl-10 h-9 w-64 rounded-xl border-white/[0.06] bg-white/[0.03] text-xs focus-visible:ring-purple-500/50" placeholder="Search admins..." />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.05]/40 border-b border-white/[0.06]">
            <tr>
              <th className="px-6 py-4 font-semibold text-xs text-zinc-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 font-semibold text-xs text-zinc-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 font-semibold text-xs text-zinc-400 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 font-semibold text-xs text-zinc-400 uppercase tracking-wider">Admin Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {collegeUsers.filter(u => u.role === 'dept_admin' || u.role === 'spec_admin').map((u: any) => {
              const draftRole = userAssignments[u._id]?.role ?? u.role;
              const draftDept = userAssignments[u._id]?.department ?? u.department?._id ?? '';
              const isAdmin = draftRole === 'dept_admin' || draftRole === 'spec_admin';
              
              return (
                <tr key={u._id} className="group hover:bg-white/[0.05]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-zinc-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                      draftRole === 'college_admin' ? "bg-purple-100 text-purple-700" :
                      draftRole === 'dept_admin' ? "bg-blue-100 text-blue-700" :
                      draftRole === 'spec_admin' ? "bg-orange-100 text-orange-700" :
                      "bg-white/[0.05] text-zinc-300"
                    )}>
                      {draftRole === 'dept_admin' ? 'Dept Admin' : draftRole.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{u.department?.name || '-'}</td>
                  <td className="px-6 py-4">
                    {u.role !== 'college_admin' ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Admin Toggle */}
                        <button
                          onClick={() => handleAssignmentDraftChange(u._id, { role: isAdmin ? 'student' : 'dept_admin' })}
                          className={cn(
                            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50",
                            isAdmin ? "bg-purple-500" : "bg-white/[0.08]"
                          )}
                        >
                          <span className={cn(
                            "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                            isAdmin ? "translate-x-5" : "translate-x-1"
                          )} />
                        </button>
                        
                        {isAdmin && (
                          <select
                            className="h-8 appearance-none rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-xs font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
                            value={draftDept}
                            onChange={(e) => handleAssignmentDraftChange(u._id, { department: e.target.value })}
                          >
                            <option value="" className="bg-zinc-900 text-white">Select Department</option>
                            {departments.map((d: any) => (
                              <option key={d._id} value={d._id} className="bg-zinc-900 text-white">{d.name}</option>
                            ))}
                          </select>
                        )}
                        
                        {(userAssignments[u._id]) && (
                          <Button
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => saveUserAssignment(u._id)}
                            isLoading={savingUserId === u._id}
                          >
                            Save
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500">Primary Admin</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/[0.04] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">College Events</h2>
          <p className="text-xs text-zinc-400">Manage and moderate all events within your institution.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} /> Create Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {collegeEvents.map((event: any) => (
          <div key={event._id} className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className={cn(
                "rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                event.status === 'published' ? "bg-emerald-100 text-emerald-700" :
                event.status === 'pending' ? "bg-orange-100 text-orange-700" :
                "bg-white/[0.05] text-zinc-300"
              )}>
                {event.status}
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {event.status === 'pending' && (
                  <button 
                    onClick={() => updateEventStatus(event._id, 'published')}
                    className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => updateEventStatus(event._id, 'moderated')}
                  className="rounded-lg bg-white/[0.05]/40 p-2 text-zinc-400 hover:bg-white/[0.05]"
                >
                  <ShieldCheck size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="mt-4 font-bold text-white">{event.title}</h3>
            <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{event.description}</p>
            
            <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {event.registeredCount} / {event.seatLimit}
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.04] pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px] font-bold">
                  {event.organizer?.name?.charAt(0)}
                </div>
                <span className="text-[10px] font-medium text-zinc-400">{event.organizer?.name}</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">{event.department?.name || 'College'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/[0.04] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Financial Oversight</h2>
          <p className="text-xs text-zinc-400">Track ticketing and registration payments.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={18} /> Export Report
        </Button>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.05]/40 border-b border-white/[0.06]">
            <tr>
              <th className="px-6 py-4 font-semibold">Transaction ID</th>
              <th className="px-6 py-4 font-semibold">Event</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {transactions.map((t: any) => (
              <tr key={t._id} className="hover:bg-white/[0.05]/40 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-zinc-400">{t._id}</td>
                <td className="px-6 py-4 font-medium">{t.event?.title}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{t.user?.name}</p>
                    <p className="text-xs text-zinc-400">{t.user?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold">₹{t.amount}</p>
                    <p className="text-[10px] text-zinc-400">Fee: ₹{t.platformFee}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                    t.status === 'completed' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-sm">
        <h3 className="text-lg font-bold">College Branding</h3>
        <p className="text-sm text-zinc-400">Customize how your institution appears across the platform.</p>
        
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input 
              label="College Name" 
              value={collegeSettings?.name || ''} 
              onChange={(e) => setCollegeSettings({...collegeSettings, name: e.target.value})}
            />
            <Input 
              label="Domain" 
              value={collegeSettings?.domain || ''} 
              disabled 
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Input 
              label="Logo URL" 
              value={collegeSettings?.logo || ''} 
              onChange={(e) => setCollegeSettings({...collegeSettings, logo: e.target.value})}
            />
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl border border-white/[0.06] bg-white/[0.05]/40 flex items-center justify-center overflow-hidden">
                {collegeSettings?.logo ? (
                  <img src={collegeSettings.logo} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <Building2 className="text-zinc-300" />
                )}
              </div>
              <p className="text-xs text-zinc-400">Preview of your college logo</p>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={() => updateCollegeSettings(collegeSettings)}>Save Branding Changes</Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-sm">
        <h3 className="text-lg font-bold">Platform Features</h3>
        <p className="text-sm text-zinc-400">Enable or disable specific modules for your college.</p>
        
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { id: 'payments', title: 'Payment Integration', desc: 'Allow paid events and ticketing' },
            { id: 'certificates', title: 'Automated Certificates', desc: 'Generate certificates for participants' },
            { id: 'qrCheckin', title: 'QR Check-in System', desc: 'Digital attendance tracking' },
            { id: 'customThemes', title: 'Custom Themes', desc: 'Advanced styling for event pages' },
          ].map((feature) => (
            <div key={feature.id} className="flex items-center justify-between rounded-xl border border-white/[0.04] p-4">
              <div>
                <h4 className="text-sm font-semibold">{feature.title}</h4>
                <p className="text-xs text-zinc-400">{feature.desc}</p>
              </div>
              <button 
                onClick={() => updateCollegeSettings({ features: { ...collegeSettings.features, [feature.id]: !collegeSettings.features[feature.id] } })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  collegeSettings?.features?.[feature.id] ? "bg-white" : "bg-white/[0.08]"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white/[0.02] transition-transform",
                  collegeSettings?.features?.[feature.id] ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading && !collegeSettings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/[0.06] border-t-black" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">College Command</h1>
          <p className="text-zinc-400">Full administrative control over {collegeSettings?.name || 'your institution'}.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Mail size={18} /> Announcement
          </Button>
          <Button className="gap-2">
            <Download size={18} /> Reports
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'departments' && renderDepartments()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'settings' && renderSettings()}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      {showAddDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#09090b] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold">Add Department</h2>
            <p className="mt-1 text-sm text-zinc-400">Create a new department (e.g., BBA, BTech).</p>
            <form onSubmit={handleAddDept} onKeyDown={(e) => e.key === 'Enter' && handleAddDept(e as any)} className="mt-6 space-y-4">
              <Input label="Department Name" value={newDept.name} onChange={e => setNewDept({ ...newDept, name: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <Input label="Description" value={newDept.description} onChange={e => setNewDept({ ...newDept, description: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 border-white/[0.06] hover:bg-white/[0.02]" onClick={() => setShowAddDept(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create Department</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#09090b] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold">Edit Department</h2>
            <form onSubmit={handleEditDept} onKeyDown={(e) => e.key === 'Enter' && handleEditDept(e as any)} className="mt-6 space-y-4">
              <Input label="Department Name" value={editingDept.name} onChange={e => setEditingDept({ ...editingDept, name: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <Input label="Description" value={editingDept.description} onChange={e => setEditingDept({ ...editingDept, description: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 border-white/[0.06] hover:bg-white/[0.02]" onClick={() => setEditingDept(null)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Changes</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showAddSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#09090b] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold">Add Specialization</h2>
            <p className="mt-1 text-sm text-zinc-400">Create a specialization under a department.</p>
            <form onSubmit={handleAddSpec} onKeyDown={(e) => e.key === 'Enter' && handleAddSpec(e as any)} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Department</label>
                <select 
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={newSpec.departmentId}
                  onChange={e => setNewSpec({ ...newSpec, departmentId: e.target.value })}
                  required
                >
                  <option value="" className="bg-zinc-900 text-white">Select Department</option>
                  {departments.map((d: any) => (
                    <option key={d._id} value={d._id} className="bg-zinc-900 text-white">{d.name}</option>
                  ))}
                </select>
              </div>
              <Input label="Specialization Name" value={newSpec.name} onChange={e => setNewSpec({ ...newSpec, name: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <Input label="Description" value={newSpec.description} onChange={e => setNewSpec({ ...newSpec, description: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 border-white/[0.06] hover:bg-white/[0.02]" onClick={() => setShowAddSpec(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create Specialization</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#09090b] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold">Add User</h2>
            <p className="mt-1 text-sm text-zinc-400">Create a new user or department admin.</p>
            <form onSubmit={handleAddUser} onKeyDown={(e) => e.key === 'Enter' && handleAddUser(e as any)} className="mt-6 space-y-4">
              <Input label="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <Input label="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="bg-white/[0.03] border-white/[0.06]" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Role</label>
                <select 
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="student" className="bg-zinc-900">Student</option>
                  <option value="dept_admin" className="bg-zinc-900">Department Admin</option>
                </select>
              </div>
              {newUser.role === 'dept_admin' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Department</label>
                  <select 
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                    value={newUser.department}
                    onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                    required
                  >
                    <option value="" className="bg-zinc-900">Select Department</option>
                    {departments.map((d: any) => (
                      <option key={d._id} value={d._id} className="bg-zinc-900">{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 border-white/[0.06] hover:bg-white/[0.02]" onClick={() => setShowAddUser(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create User</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
