import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Calendar, Users, MapPin, Trash2, Edit2, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const DeptAdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc'>('date-asc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'Technical',
    seatLimit: 50,
    status: 'published'
  });

  useEffect(() => {
    fetchEvents();
    fetchSettings();
  }, []);

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

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will notify all registered participants.')) return;
    
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingEvent ? `/api/events/${editingEvent._id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...newEvent, departmentId: user?.department })
      });
      if (res.ok) {
        setShowAddEvent(false);
        setEditingEvent(null);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          venue: '',
          category: 'Technical',
          seatLimit: 50,
          status: 'published'
        });
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      venue: event.venue,
      category: event.category,
      seatLimit: event.seatLimit,
      status: event.status || 'published'
    });
    setShowAddEvent(true);
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Events</h1>
          <p className="text-zinc-400">Manage events and registrations for your department.</p>
        </div>
        <Button onClick={() => setShowAddEvent(true)} className="gap-2">
          <Plus size={18} />
          Create Event
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event: any) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold text-zinc-400">
                  {event.category}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  event.status === 'published' ? 'bg-emerald-50 text-emerald-600' :
                  event.status === 'draft' ? 'bg-white/[0.05] text-zinc-400' :
                  event.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(event)}>
                  <Edit2 size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <h3 className="mt-4 text-xl font-bold">{event.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{event.description}</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Calendar size={16} />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin size={16} />
                {event.venue}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Users size={16} />
                {event.registeredCount} / {event.seatLimit} registered
              </div>
            </div>

            <div className="mt-6">
              <Link to={`/admin/events/${event._id}/participants`}>
                <Button variant="outline" className="w-full">View Participants</Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl bg-white/[0.02] p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={handleAddEvent} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Event Title"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Description</label>
                <textarea
                  className="w-full rounded-lg border border-white/[0.06] p-3 text-sm focus:border-black focus:outline-none"
                  rows={4}
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                />
              </div>
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Category</label>
                <select
                  className="w-full rounded-lg border border-white/[0.06] p-2.5 text-sm focus:border-black focus:outline-none"
                  value={newEvent.category}
                  onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Status</label>
                <select
                  className="w-full rounded-lg border border-white/[0.06] p-2.5 text-sm focus:border-black focus:outline-none"
                  value={newEvent.status}
                  onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}
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
                value={newEvent.seatLimit}
                onChange={e => setNewEvent({ ...newEvent, seatLimit: parseInt(e.target.value) })}
                required
              />
              <div className="flex gap-3 pt-4 sm:col-span-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => {
                  setShowAddEvent(false);
                  setEditingEvent(null);
                  setNewEvent({
                    title: '',
                    description: '',
                    date: '',
                    venue: '',
                    category: 'Technical',
                    seatLimit: 50,
                    status: 'published'
                  });
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
