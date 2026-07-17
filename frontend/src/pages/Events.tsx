import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Search, Filter, Tag, LayoutDashboard, Sparkles, CalendarDays } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import MagicBento from '../components/MagicBento';
import { useAuth } from '../hooks/useAuth';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  seatLimit: number;
  registeredCount: number;
}

export const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  // NOTE: Events is a global discover page and should not redirect users away.
  
  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc'>('date-asc');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    fetch('/api/events', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Expected array of events, got:', data);
          setEvents([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category || 'General'));
    return ['All', ...Array.from(cats)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = category === 'All' || event.category === category;
      const isAvailable = !showOnlyAvailable || (event.registeredCount < event.seatLimit);
      const isPublished = (event as any).status === 'published';
      
      return matchesSearch && matchesCategory && isAvailable && isPublished;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [events, search, category, sortBy, showOnlyAvailable]);

  const totalEvents = events.length;
  const availableEvents = events.filter((e) => e.registeredCount < e.seatLimit).length;
  const upcomingEvents = events.filter((e) => new Date(e.date).getTime() >= Date.now()).length;

  if (loading) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-zinc-400">Loading events...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" aria-hidden="true" />
        <div className="absolute -right-20 top-8 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <Sparkles size={12} className="text-purple-400" />
              Discover Layer
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Discover <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="mt-2 text-zinc-400">Find and register for the best activities on campus.</p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 md:w-auto md:min-w-[360px]">
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Total</p>
              <p className="mt-1 text-xl font-bold text-white">{totalEvents}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Available</p>
              <p className="mt-1 text-xl font-bold text-emerald-400">{availableEvents}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Upcoming</p>
              <p className="mt-1 text-xl font-bold text-indigo-300">{upcomingEvents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header section with gradient line */}
      <div className="relative pb-6 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent" />
        <div className="flex items-center gap-2 text-zinc-400">
          <CalendarDays size={16} />
          <p className="text-sm">Smart filters to help you find the right event faster.</p>
        </div>
        
        {(user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'college_admin' || user?.role === 'dept_admin') && (
          <Button onClick={() => {
            const path = user.role === 'super_admin' || user.role === 'admin' ? '/super-admin' : 
                         user.role === 'college_admin' ? '/college-admin' : '/dept-admin';
            navigate(path);
          }} variant="outline" className="gap-2 shrink-0">
            <LayoutDashboard size={18} />
            Go to Dashboard
          </Button>
        )}
      </div>

      {/* Filters Section - Glassmorphic card */}
      <div className="grid gap-4 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl md:grid-cols-4">
        <div className="relative md:col-span-2 space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
             Search
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <Input 
              placeholder="Search by title or description..." 
              className="pl-11 h-12 bg-white/[0.03] border-white/[0.06] rounded-xl text-white focus-visible:ring-purple-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
            <Tag size={12} /> Category
          </label>
          <select 
            className="flex h-12 w-full appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
            <Filter size={12} /> Sort & View
          </label>
          <div className="flex gap-2">
            <select 
              className="flex h-12 flex-1 appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date-asc" className="bg-zinc-900">Oldest First</option>
              <option value="date-desc" className="bg-zinc-900">Newest First</option>
            </select>
            <button
              onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              className={`flex h-12 w-12 items-center justify-center shrink-0 rounded-xl border transition-all duration-300 ${
                showOnlyAvailable 
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
              }`}
              title="Only show available events"
            >
              <Users size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="mt-8">
        <MagicBento 
          events={filteredEvents}
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect={true}
          spotlightRadius={400}
          particleCount={12}
          glowColor="132, 0, 255"
          disableAnimations={false}
        />
      </div>

      {filteredEvents.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01] p-16 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03] mb-4">
            <Search className="text-zinc-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </motion.div>
      )}
    </div>
  );
};
