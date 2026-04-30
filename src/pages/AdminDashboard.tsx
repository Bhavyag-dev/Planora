import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Trash2, Users, Edit, Calendar as CalendarIcon, MapPin, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { formatDate } from '../lib/utils';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  seatLimit: number;
  registeredCount: number;
  status: string;
}

export const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc'>('date-asc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'General',
    seatLimit: 50,
    status: 'published'
  });

  useEffect(() => {
    fetchEvents();
    fetchSettings();
  }, []);

  const fetchEvents = () => {
    fetch('/api/events', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  };

  const fetchSettings = () => {
    fetch('/api/analytics/settings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.eventCategories) {
          setCategories(data.eventCategories);
        }
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchEvents();
        setShowForm(false);
        setEditingId(null);
        setFormData({ title: '', description: '', date: '', venue: '', category: 'General', seatLimit: 50 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (event: Event) => {
    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const date = new Date(event.date);
    const formattedDate = date.toISOString().slice(0, 16);
    
    setFormData({
      title: event.title,
      description: event.description,
      date: formattedDate,
      venue: event.venue,
      category: event.category || 'General',
      seatLimit: event.seatLimit,
      status: event.status || 'published'
    });
    setEditingId(event._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvents = React.useMemo(() => {
    let result = events.filter((event: any) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    result.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [events, search, sortBy, statusFilter, categoryFilter]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage your campus events and participants</p>
        </div>
        <Button onClick={() => {
          if (showForm && editingId) {
            setEditingId(null);
            setFormData({ title: '', description: '', date: '', venue: '', category: 'General', seatLimit: 50 });
          } else {
            setShowForm(!showForm);
          }
        }} className="gap-2">
          {showForm && editingId ? <Plus size={18} /> : <Plus size={18} />}
          {showForm && editingId ? 'Create New' : 'Create Event'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <Input 
            placeholder="Search events..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Category:</label>
            <select 
              className="h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Status:</label>
            <select 
              className="h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="flagged">Flagged</option>
              <option value="moderated">Moderated</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Sort:</label>
            <select 
              className="h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date-asc">Date (Asc)</option>
              <option value="date-desc">Date (Desc)</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg"
        >
          <h2 className="mb-6 text-xl font-bold">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Input 
                label="Event Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Description</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <Input 
                label="Date & Time" 
                type="datetime-local" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                required 
              />
              <Input 
                label="Venue" 
                value={formData.venue} 
                onChange={e => setFormData({...formData, venue: e.target.value})} 
                required 
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Status</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="flagged">Flagged</option>
                  <option value="moderated">Moderated</option>
                </select>
              </div>
              <Input 
                label="Seat Limit" 
                type="number" 
                value={formData.seatLimit} 
                onChange={e => setFormData({...formData, seatLimit: parseInt(e.target.value)})} 
                required 
              />
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Update Event' : 'Create Event'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: '', description: '', date: '', venue: '', category: 'General', seatLimit: 50 });
                }}>Cancel</Button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.05]/40 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Date & Venue</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Registrations</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredEvents.map((event) => (
              <tr key={event._id} className="hover:bg-white/[0.05]/40/50">
                <td className="px-6 py-4">
                  <div className="font-semibold">{event.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{event.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <MapPin size={14} />
                    {event.venue}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    event.status === 'published' ? 'bg-emerald-50 text-emerald-600' :
                    event.status === 'draft' ? 'bg-white/[0.05] text-zinc-400' :
                    event.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.05]">
                      <div 
                        className="h-full bg-white" 
                        style={{ width: `${(event.registeredCount / event.seatLimit) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {event.registeredCount} / {event.seatLimit}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/events/${event._id}/participants`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Participants">
                        <Users size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(event)}
                      title="Edit Event"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(event._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
