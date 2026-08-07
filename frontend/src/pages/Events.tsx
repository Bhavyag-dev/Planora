import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Filter, Tag, Sparkles, CalendarDays, Globe } from 'lucide-react';
import { Input } from '../components/Input';
import MagicBento from '../components/MagicBento';
import { useWorkspace } from '../context/WorkspaceContext';

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
  const { activeWorkspace } = useWorkspace();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'workspace' | 'global'>('workspace');

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc'>('date-asc');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = '/api/events';
    if (viewMode === 'workspace' && activeWorkspace) {
      url += `?organizationId=${activeWorkspace._id}`;
    }
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setEvents([]);
        setLoading(false);
      });
  }, [viewMode, activeWorkspace]);

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
      
      return matchesSearch && matchesCategory && isAvailable;
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-neutral-900 bg-transparent">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-650 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-neutral-500">Loading events...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-12 select-none text-neutral-900">
      
      {/* Header card */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_55%)]" aria-hidden="true" />
        <div className="absolute -right-20 top-8 h-44 w-44 rounded-full bg-purple-500/5 blur-3xl" aria-hidden="true" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-500">
              <Sparkles size={14} className="text-purple-600 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Discover Feed</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
              {viewMode === 'workspace' 
                ? `${activeWorkspace?.name || 'Workspace'} Events` 
                : 'All Published Events'}
            </h1>
            <p className="text-sm text-neutral-500 max-w-xl">
              Everything you need to host internal meetups, community conferences, and team activities in one place.
            </p>
          </div>

          {/* Toggle View Mode */}
          {activeWorkspace && (
            <div className="flex rounded-xl bg-neutral-50 p-1 border border-neutral-200 shadow-xs">
              <button
                onClick={() => setViewMode('workspace')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'workspace'
                    ? 'bg-white text-neutral-900 shadow-xs font-bold'
                    : 'text-neutral-550 hover:text-neutral-800'
                }`}
              >
                <Users size={12} />
                Workspace
              </button>
              <button
                onClick={() => setViewMode('global')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'global'
                    ? 'bg-white text-neutral-900 shadow-xs font-bold'
                    : 'text-neutral-550 hover:text-neutral-800'
                }`}
              >
                <Globe size={12} />
                Global (Public)
              </button>
            </div>
          )}
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
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-16 text-center shadow-xs"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 border border-neutral-200/60 mb-4">
            <Search className="text-neutral-450" size={24} />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2 font-display">No events found</h3>
          <p className="text-neutral-500 max-w-sm mx-auto text-xs">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </motion.div>
      )}

    </div>
  );
};
