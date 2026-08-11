import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Globe, 
  ChevronDown, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Sparkles, 
  CheckCircle2,
  Menu,
  X,
  Coffee,
  Twitter,
  Instagram,
  LayoutDashboard,
  UserPlus,
  Share2,
  HelpCircle,
  Building2,
  Plus,
  Users,
  Check,
  Ticket,
  Zap
} from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Faq02 } from '../components/Faq02';

export function Landing() {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [langDropdown, setLangDropdown] = useState(false);
  const [planningDropdown, setPlanningDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [previewTab, setPreviewTab] = useState<'events' | 'tickets' | 'create'>('events');


  
  // Navbar shrink scroll triggers (copied collapse physics from Fetchz)
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [scrollRatio, setScrollRatio] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          // Show only published events
          setEvents(data.filter((e: any) => e.status === 'published').slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Safe bottom collapse tracker (does not reflow layout or cause page height jitter)
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrolledVal = window.scrollY;
      const triggerStart = docHeight - 300;
      if (scrolledVal > triggerStart) {
        const ratio = (scrolledVal - triggerStart) / 300;
        setScrollRatio(Math.min(1, Math.max(0, ratio)));
      } else {
        setScrollRatio(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
      alt: 'Corporate event conference'
    },
    {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      alt: 'Seminar stage presentation'
    },
    {
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      alt: 'Networking dinner gathering'
    },
    {
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      alt: 'Music concert crowd'
    },
    {
      url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
      alt: 'Festive community social event'
    },
    {
      url: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&w=600&q=80',
      alt: 'Creative design workshop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-neutral-900 font-sans antialiased selection:bg-neutral-200 overflow-x-hidden">
      
      {/* Floating Collapsible Navbar (Physics and collapse styles copied from Fetchz) */}
      <div className={`fixed inset-x-0 top-0 z-50 pointer-events-none ${scrolled ? 'px-4 sm:px-8 md:px-16 pt-4' : 'px-0 pt-0'}`}>
        <motion.nav
          initial={false}
          animate={{
            borderRadius: scrolled ? "9999px" : "0px",
            boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.06)" : "0 0px 0px rgba(0,0,0,0)",
            paddingLeft: scrolled ? (isDesktop ? "1.5rem" : "1.25rem") : "2rem",
            paddingRight: scrolled ? (isDesktop ? "1.5rem" : "1.25rem") : "2rem",
            maxWidth: scrolled ? (isDesktop ? "44rem" : "92%") : "100%",
            backgroundColor: scrolled ? "rgba(251, 251, 251, 0.85)" : "rgba(251, 251, 251, 0)",
            backdropFilter: scrolled ? "blur(18px)" : "blur(0px)",
            border: scrolled ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(0, 0, 0, 0)",
          }}
          style={{ marginLeft: "auto", marginRight: "auto" }}
          transition={{ type: "spring", stiffness: 130, damping: 23 }}
          className="pointer-events-auto w-full flex flex-col justify-center py-3.5 text-neutral-900 z-50"
        >
          {/* Main Navbar Row */}
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 pl-2">
              <span className="text-[22px] font-black tracking-tight text-neutral-950 font-display">
                Planora
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-9">
              <Link to="/" className="text-[13px] font-semibold text-neutral-600 hover:text-neutral-950 transition-colors">
                Home
              </Link>
              
              {/* Planning Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => {
                  setPlanningDropdown(true);
                  setCategoryDropdown(false);
                }}
                onMouseLeave={() => setPlanningDropdown(false)}
              >
                <button 
                  className="flex items-center gap-1 text-[13px] font-semibold text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none"
                >
                  Planning <ChevronDown size={13} className={`transition-transform duration-200 ${planningDropdown ? 'rotate-180' : ''}`} />
                </button>
                {planningDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-44 z-50 pointer-events-auto">
                    <div className="rounded-2xl border border-white/60 bg-white/55 p-2 shadow-xl backdrop-blur-xl animate-in fade-in duration-200">
                      <Link to="/events" onClick={() => setPlanningDropdown(false)} className="block rounded-xl px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-white/40 hover:text-neutral-950 transition-colors duration-150">
                        Browse Events
                      </Link>
                      <Link to="/signup" onClick={() => setPlanningDropdown(false)} className="block rounded-xl px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-white/40 hover:text-neutral-950 transition-colors duration-150">
                        Host Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => {
                  setCategoryDropdown(true);
                  setPlanningDropdown(false);
                }}
                onMouseLeave={() => setCategoryDropdown(false)}
              >
                <button 
                  className="flex items-center gap-1 text-[13px] font-semibold text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none"
                >
                  Categories <ChevronDown size={13} className={`transition-transform duration-200 ${categoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {categoryDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-44 z-50 pointer-events-auto">
                    <div className="rounded-2xl border border-white/60 bg-white/55 p-2 shadow-xl backdrop-blur-xl animate-in fade-in duration-200">
                      <Link to="/events?cat=Technical" onClick={() => setCategoryDropdown(false)} className="block rounded-xl px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-white/40 hover:text-neutral-950 transition-colors duration-150">
                        Technical & Talks
                      </Link>
                      <Link to="/events?cat=Workshop" onClick={() => setCategoryDropdown(false)} className="block rounded-xl px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-white/40 hover:text-neutral-950 transition-colors duration-150">
                        Workshops
                      </Link>
                      <Link to="/events?cat=Cultural" onClick={() => setCategoryDropdown(false)} className="block rounded-xl px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-white/40 hover:text-neutral-950 transition-colors duration-150">
                        Cultural fests
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <a href="#pricing" className="text-[13px] font-semibold text-neutral-600 hover:text-neutral-950 transition-colors">
                Pricing
              </a>
            </div>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <Link
                  to={user.role === 'super_admin' || user.role === 'admin' ? '/super-admin' : user.role === 'org_admin' ? '/org-admin' : '/dashboard'}
                  className="rounded-full bg-neutral-950 px-4.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-[13px] font-semibold text-neutral-600 hover:text-neutral-950 transition">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-neutral-950 px-4.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none md:hidden"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Collapsible mobile panel within floating pill container */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full mt-3 pt-3 border-t border-neutral-200/50 flex flex-col gap-2.5 overflow-hidden md:hidden px-1"
              >
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-neutral-700 hover:text-neutral-950">
                  Home
                </Link>
                <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-neutral-700 hover:text-neutral-950">
                  Browse Events
                </Link>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-neutral-700 hover:text-neutral-950">
                  Pricing
                </a>
                <div className="border-t border-neutral-100 pt-3 flex items-center justify-between gap-3">
                  {isAuthenticated && user ? (
                    <Link
                      to={user.role === 'super_admin' || user.role === 'admin' ? '/super-admin' : user.role === 'org_admin' ? '/org-admin' : '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-full bg-neutral-950 text-center py-2 text-xs font-bold text-white"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-neutral-600 py-1 px-3">
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-full bg-neutral-950 text-center py-2 px-4 text-xs font-bold text-white shrink-0"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Full-Bleed Page Level Background Image spanning absolute top-0 */}
      <div className="absolute top-0 inset-x-0 h-screen z-0 overflow-hidden pointer-events-none select-none">
        <img 
          src="/morning.png" 
          alt="Event Background" 
          className="w-full h-full object-cover opacity-[0.88] filter saturate-[1.1] contrast-[1.02]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fbfbfb]/20 to-[#fbfbfb]" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-32 pb-20 text-center px-6 overflow-hidden">
        {/* Central Badge */}
        <div className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white px-4 py-1.5 text-[11px] font-semibold text-neutral-700 shadow-sm hover:border-neutral-300 transition-colors duration-300 select-none">
          <span>⚡</span>
          <span className="text-neutral-400">→</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-4 w-4 rounded-full bg-neutral-100 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')] bg-cover" />
            Planora Events
          </span>
          <span className="text-neutral-400">→</span>
          <span>🔍</span>
        </div>

        {/* Heading with text-shadow glow for maximum readability against background */}
        <h1 
          style={{ textShadow: '0 2px 16px rgba(255, 255, 255, 0.95), 0 4px 40px rgba(255, 255, 255, 0.85)' }}
          className="relative z-10 max-w-5xl text-4xl font-extrabold tracking-tight text-neutral-800 leading-[1.12] sm:text-5xl md:text-6xl lg:text-[4.6rem] font-display"
        >
          Radiant <span className="font-cursive text-neutral-700 font-normal capitalize tracking-normal text-[1.05em] inline-block mr-1">Events</span>,<br />
          Seamless Organization <span className="font-cursive text-neutral-700 font-normal lowercase tracking-normal text-[1.05em] inline-block mr-1">easy!</span>
        </h1>

        {/* Subtitle */}
        <p 
          style={{ textShadow: '0 2px 10px rgba(255, 255, 255, 0.95)' }}
          className="relative z-10 mt-8 max-w-2xl text-[15px] font-semibold text-neutral-850 leading-relaxed font-sans"
        >
          Dive into the ultimate event management experience with Planora.<br />
          We specialize in helping workspaces and communities create vibrant, unforgettable happenings.
        </p>
      </section>

      {/* Fold 2: Unforgettable Event Panel Layout (Reference Image 2) */}
      <section className="w-full bg-[#fbfbfb] relative z-10 py-24 border-b border-neutral-100/40">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Text details */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-4xl font-extrabold text-neutral-900 leading-[1.1] tracking-tight font-display sm:text-5xl">
              Together, let's<br />
              make this event<br />
              unforgettable!<br />
              with <span className="text-neutral-400 font-normal font-cursive text-3.5xl block sm:inline leading-none">ultimate planning experience!</span>
            </h2>
            <p className="text-[14px] leading-relaxed text-neutral-500 font-sans">
              Our passion for creating colorful and energetic events means every single meetup, workshop, and conference is a masterpiece of fun. Get ready for a workspace filled with vivid memories and vibrant celebrations.
            </p>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Learn more <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: Two Big Mockups side-by-side */}
          <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2 relative z-10">
            {/* Big Mockup 1: Clean Glass-Dashboard Card */}
            <div className="w-full h-[380px] rounded-[2rem] glass-red-glow p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-650/10 blur-[50px]" />
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-neutral-400">workspace_stats</span>
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="my-auto">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest font-mono">Real-time Activity</span>
                <h3 className="text-4xl font-extrabold text-white tracking-tight mt-1 font-display">94.2%</h3>
                <p className="text-[13px] text-neutral-400 mt-2 font-medium leading-relaxed">Community Engagement score across 12 workspace events this month.</p>
              </div>
              <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between">
                <span className="text-[10px] text-neutral-550 font-mono">planora_core_v1</span>
                <Link to="/signup" className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors pointer-events-auto">View analytics ›</Link>
              </div>
            </div>

            {/* Big Mockup 2: Premium Visual Event Card */}
            <div className="w-full h-[380px] rounded-[2rem] overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300 glass-red-glow">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80" 
                alt="Premium Community Event" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-650/5 blur-[60px]" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded-full bg-red-600/80 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">Featured Meetup</span>
                <h4 className="text-xl font-extrabold tracking-tight text-white mt-3 font-display">Creative Design Workspace Hub</h4>
                <p className="text-xs text-neutral-300 mt-1 font-medium">Dec 26, 2026 • 65 Attendees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Live Events Section */}
      <section className="w-full bg-[#fbfbfb] relative z-10 py-16 border-t border-neutral-100/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
              <Sparkles size={12} className="text-amber-500" /> Discover Exciting Happenings
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-display">
              Upcoming Sparkling Events
            </h2>
          </div>
          <Link 
            to="/events" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            View all {events.length > 0 ? `(${events.length})` : ''} events 
            <ArrowRight size={14} />
          </Link>
        </div>

        {loadingEvents ? (
          <div className="flex h-40 items-center justify-center text-sm font-medium text-neutral-400">
            Loading brilliant events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center">
            <Calendar className="mx-auto text-neutral-300 mb-3" size={32} />
            <h3 className="text-[15px] font-semibold text-neutral-900">No active events found</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Ready to host your own events? Register or login to create events.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link 
                key={event._id}
                to={`/events/${event._id}`}
                className="group flex flex-col bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Event Image */}
                <div className="relative aspect-[16/10] bg-neutral-50 overflow-hidden">
                  {event.coverImage ? (
                    <img 
                      src={event.coverImage} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-100">
                      <Calendar size={32} />
                    </div>
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-100 px-3 py-1 text-[11px] font-bold text-neutral-900 uppercase tracking-wider shadow-sm">
                    {event.category}
                  </span>
                </div>

                {/* Event Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors leading-tight font-display">
                    {event.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium mt-1 flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(event.date).toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-neutral-500 mt-3 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span className="flex items-center gap-1 text-neutral-500">
                      <MapPin size={13} />
                      {event.venue}
                    </span>
                    <span className="text-neutral-900">
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-100/80">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/85 bg-neutral-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <Sparkles size={12} className="text-purple-600" />
            Core Capabilities
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
            Designed for Flawless Workspace Execution
          </h2>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto">
            Everything you need to host internal meetups, community conferences, and team activities in one place.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-indigo-55 border border-indigo-100 flex items-center justify-center text-indigo-650">
                <Building2 size={20} />
              </div>
              <h3 className="font-bold text-neutral-900 text-lg">Multi-Tenant Workspaces</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Create and manage isolated environments for each team, community chapter, or campus club under one global account profile.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-purple-55 border border-purple-100 flex items-center justify-center text-purple-650">
                <UserPlus size={20} />
              </div>
              <h3 className="font-bold text-neutral-900 text-lg">Instant Team Invites</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Invite team members by email directly from the workspace roster to co-host, edit event settings, or coordinate guest lists.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-pink-55 border border-pink-100 flex items-center justify-center text-pink-650">
                <Share2 size={20} />
              </div>
              <h3 className="font-bold text-neutral-900 text-lg">Unified Hosting Control</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Schedule workshops, panel discussions, or hackathons with ease. Setup seat limits to prevent capacity issues.
              </p>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-emerald-55 border border-emerald-100 flex items-center justify-center text-emerald-650">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-neutral-900 text-lg">Global Discover</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Publish events locally to active workspaces, or make them public to allow discoverability and open registration.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-100/80 bg-neutral-50/50 rounded-[2.5rem] my-12 shadow-inner">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-display">Hosting in Four Simple Steps</h2>
          <p className="text-sm text-neutral-500">Go from account setup to a live workspace event in under five minutes.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16 relative">
          {/* Step 1 */}
          <div className="space-y-4 text-left p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm relative">
            <span className="absolute top-4 right-4 text-neutral-100 font-display font-black text-4xl select-none">01</span>
            <div className="h-8 w-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center text-xs font-bold font-mono">1</div>
            <h3 className="font-bold text-neutral-900 text-base mt-2">Create Workspace</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">Create a custom workspace (e.g. Acme Corp Dev) to isolate your event activities.</p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 text-left p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm relative">
            <span className="absolute top-4 right-4 text-neutral-100 font-display font-black text-4xl select-none">02</span>
            <div className="h-8 w-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center text-xs font-bold font-mono">2</div>
            <h3 className="font-bold text-neutral-900 text-base mt-2">Schedule Event</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">Enter details, seat capacities, venue, category, and cover image to create an event.</p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 text-left p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm relative">
            <span className="absolute top-4 right-4 text-neutral-100 font-display font-black text-4xl select-none">03</span>
            <div className="h-8 w-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center text-xs font-bold font-mono">3</div>
            <h3 className="font-bold text-neutral-900 text-base mt-2">Invite & Share</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">Share the registration URL, invite workspace colleagues, or open it up for global attendees.</p>
          </div>

          {/* Step 4 */}
          <div className="space-y-4 text-left p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm relative">
            <span className="absolute top-4 right-4 text-neutral-100 font-display font-black text-4xl select-none">04</span>
            <div className="h-8 w-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center text-xs font-bold font-mono">4</div>
            <h3 className="font-bold text-neutral-900 text-base mt-2">Track Registrations</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">Monitor attendees lists in real-time. Instantly check-in registered users.</p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Mockup */}
      <section id="preview" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-100/80">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
            A Minimal, Clean Interface
          </h2>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto">
            Interact with the mockup tabs below to preview the actual dashboard workspace.
          </p>
        </div>

        {/* Interactive Mockup Container */}
        <div className="mt-12 rounded-3xl border border-neutral-800 bg-zinc-950 p-3 shadow-2xl relative overflow-hidden text-zinc-300">
          {/* Red glow highlight */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-650/10 blur-[60px] pointer-events-none" />

          {/* Mockup Tabs */}
          <div className="flex bg-zinc-900/50 border border-white/[0.04] p-1 rounded-2xl mb-4 max-w-xs mx-auto justify-between relative z-10">
            <button 
              onClick={() => setPreviewTab('events')} 
              className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                previewTab === 'events' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Workspace Events
            </button>
            <button 
              onClick={() => setPreviewTab('tickets')} 
              className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                previewTab === 'tickets' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              My Tickets
            </button>
            <button 
              onClick={() => setPreviewTab('create')} 
              className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                previewTab === 'create' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Event Creator
            </button>
          </div>

          <div className="bg-zinc-900 rounded-[1.5rem] border border-white/[0.04] p-6 text-left flex gap-6 min-h-[360px] relative z-10">
            {/* Mock Sidebar */}
            <div className="w-48 border-r border-white/[0.06] pr-6 hidden md:flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 font-bold tracking-tight text-white pl-2">
                  <div className="h-6 w-6 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                    A
                  </div>
                  <span className="text-sm truncate">Acme Workshops</span>
                </div>
                <nav className="space-y-1.5 flex flex-col">
                  <span className="flex items-center gap-2.5 text-xs text-white bg-white/5 px-2.5 py-1.5 rounded-lg"><LayoutDashboard size={14} className="text-red-500" /> Dashboard</span>
                  <span className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg"><Calendar size={14} className="text-red-500" /> Events</span>
                  <span className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg"><Ticket size={14} className="text-red-500" /> My Tickets</span>
                </nav>
              </div>
              <div className="text-[10px] text-zinc-550 border-t border-white/[0.06] pt-3 pl-2">
                SaaS Dashboard v1.0
              </div>
            </div>

            {/* Mock Dashboard Area */}
            <div className="flex-1 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {previewTab === 'events' && (
                  <motion.div 
                    key="events"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 w-full"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Workspace Events</h4>
                      <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded">3 Scheduled</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Event 1 */}
                      <div className="p-4 bg-zinc-950 border border-white/[0.04] rounded-2xl space-y-2 hover:border-red-500/20 transition-colors">
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">Workshop</span>
                        <h5 className="text-xs font-bold text-white leading-tight">Advanced React Patterns</h5>
                        <p className="text-[10px] text-zinc-500">Deep dive into hooks and rendering...</p>
                        <div className="pt-2 border-t border-white/[0.04] text-[9px] text-zinc-500 flex items-center gap-1.5">
                          <MapPin size={9} /> Acme Conf Room A
                        </div>
                      </div>
                      {/* Event 2 */}
                      <div className="p-4 bg-zinc-950 border border-white/[0.04] rounded-2xl space-y-2 hover:border-red-500/20 transition-colors">
                        <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">Meetup</span>
                        <h5 className="text-xs font-bold text-white leading-tight">AI & Analytics Forum</h5>
                        <p className="text-[10px] text-zinc-500">Exploring generative model integrations...</p>
                        <div className="pt-2 border-t border-white/[0.04] text-[9px] text-zinc-500 flex items-center gap-1.5">
                          <MapPin size={9} /> Community Hub
                        </div>
                      </div>
                      {/* Event 3 */}
                      <div className="p-4 bg-zinc-950 border border-white/[0.04] rounded-2xl space-y-2 hover:border-red-500/20 transition-colors">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">Masterclass</span>
                        <h5 className="text-xs font-bold text-white leading-tight">Creative Design Systems</h5>
                        <p className="text-[10px] text-zinc-500">Building scalable UI/UX components...</p>
                        <div className="pt-2 border-t border-white/[0.04] text-[9px] text-zinc-500 flex items-center gap-1.5">
                          <MapPin size={9} /> Zoom Room B
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {previewTab === 'tickets' && (
                  <motion.div 
                    key="tickets"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 w-full"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Active Tickets</h4>
                      <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded">3 Booked</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Ticket 1 */}
                      <div className="p-4 bg-zinc-950 border border-dashed border-white/[0.08] rounded-2xl space-y-3 relative hover:border-red-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">VIP Admission</span>
                          <Zap size={11} className="text-amber-400" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white truncate">Advanced React Patterns</h5>
                          <p className="text-[9px] text-zinc-500 mt-1 font-mono">Seat A-12 • Order #F9B2C</p>
                        </div>
                        <div className="pt-2 border-t border-white/[0.04] text-[8px] text-zinc-500 flex items-center justify-between">
                          <span>Acme Workshops</span>
                          <span className="text-emerald-400 font-bold">Confirmed</span>
                        </div>
                      </div>
                      {/* Ticket 2 */}
                      <div className="p-4 bg-zinc-950 border border-dashed border-white/[0.08] rounded-2xl space-y-3 relative hover:border-red-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">General Access</span>
                          <Zap size={11} className="text-zinc-500" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white truncate">AI & Analytics Forum</h5>
                          <p className="text-[9px] text-zinc-500 mt-1 font-mono">Seat B-45 • Order #D81A2</p>
                        </div>
                        <div className="pt-2 border-t border-white/[0.04] text-[8px] text-zinc-500 flex items-center justify-between">
                          <span>Dev Meetups</span>
                          <span className="text-emerald-400 font-bold">Confirmed</span>
                        </div>
                      </div>
                      {/* Ticket 3 */}
                      <div className="p-4 bg-zinc-950 border border-dashed border-white/[0.08] rounded-2xl space-y-3 relative hover:border-red-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">Developer Pass</span>
                          <Zap size={11} className="text-red-400" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white truncate">Creative Design Systems</h5>
                          <p className="text-[9px] text-zinc-500 mt-1 font-mono">Seat C-88 • Order #A5E4F</p>
                        </div>
                        <div className="pt-2 border-t border-white/[0.04] text-[8px] text-zinc-500 flex items-center justify-between">
                          <span>Ajux Design</span>
                          <span className="text-emerald-400 font-bold">Confirmed</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {previewTab === 'create' && (
                  <motion.div 
                    key="create"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3 max-w-sm"
                  >
                    <h4 className="text-sm font-semibold text-white">Schedule Workspace Event</h4>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold uppercase text-zinc-550 tracking-wider">Event Title</span>
                        <input disabled placeholder="e.g. Design Sync" className="w-full h-8 px-2.5 bg-zinc-950 border border-white/[0.06] rounded-lg text-xs text-zinc-450 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold uppercase text-zinc-550 tracking-wider">Venue</span>
                          <input disabled placeholder="e.g. Zoom Link" className="w-full h-8 px-2.5 bg-zinc-950 border border-white/[0.06] rounded-lg text-xs text-zinc-450 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold uppercase text-zinc-550 tracking-wider">Seat Limit</span>
                          <input disabled value="100" className="w-full h-8 px-2.5 bg-zinc-950 border border-white/[0.06] rounded-lg text-xs text-zinc-450 focus:outline-none" />
                        </div>
                      </div>
                      <button disabled className="w-full h-8 bg-red-650 hover:bg-red-555 text-white font-bold text-xs rounded-lg mt-1 opacity-80 cursor-not-allowed">
                        Create Event
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4 border-t border-white/[0.04] mt-6 flex items-center justify-between text-[10px] text-zinc-550">
                <span>Database Connection Status: OK</span>
                <span className="text-red-500 font-semibold flex items-center gap-1">
                  <Check size={10} /> Active Workspace Locked
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-100/80">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
            Loved by Event Organizers
          </h2>
          <p className="text-sm text-neutral-500">
            Hear from community builders who switched to Planora to coordinate their scheduling.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between text-left space-y-6">
            <p className="text-xs text-neutral-550 leading-relaxed font-medium italic">
              "Planora solved our workspace scheduling immediately. We can switch between internal department activities and global meetups without any configuration overhead."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-955 text-white font-bold flex items-center justify-center text-xs">SC</div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900">Sarah Chen</h5>
                <p className="text-[10px] text-neutral-400">Tech Ops Lead at Acme Corp</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between text-left space-y-6">
            <p className="text-xs text-neutral-550 leading-relaxed font-medium italic">
              "Switching between our local developer workspace and national events is seamless. Team invitations and simple free RSVPs have saved us hours of email coordination."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-955 text-white font-bold flex items-center justify-center text-xs">DM</div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900">David Miller</h5>
                <p className="text-[10px] text-neutral-400">Dev Community Organizer</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between text-left space-y-6">
            <p className="text-xs text-neutral-550 leading-relaxed font-medium italic">
              "Clean design, fast RSVP, and zero ticketing clutter. Our student activities team coordinates fests with instant confirmations. Highly recommended."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-955 text-white font-bold flex items-center justify-center text-xs">MV</div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900">Dr. Marcus Vance</h5>
                <p className="text-[10px] text-neutral-400">Student Coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / FAQs target anchors for navigation - Light Glassmorphic Style */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 relative overflow-hidden bg-white/70 backdrop-blur-md rounded-[2.5rem] my-16 shadow-md border border-neutral-200/50 select-none">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
        
        {/* Large semi-transparent background heading */}
        <div className="absolute top-8 inset-x-0 text-center pointer-events-none select-none z-0">
          <span className="text-[12vw] font-black uppercase tracking-widest text-neutral-900/[0.02] font-display block select-none leading-none">
            Pricing
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-display">Simple Pricing for Organizers</h2>
            <p className="text-xs text-neutral-500">No setup costs. Only pay when you host paid events.</p>
          </div>

          {/* Two pricing cards grid */}
          <div className="grid gap-8 md:grid-cols-2 mt-8 max-w-4xl mx-auto">
            
            {/* Card 1: Free Events */}
            <div className="rounded-3xl border border-neutral-200 bg-white/60 p-8 backdrop-blur-md text-left flex flex-col justify-between hover:border-purple-500/30 hover:shadow-lg transition-all duration-300 relative group">
              <div>
                {/* Badge */}
                <div className="flex justify-start mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                    🟢 Core Community
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-neutral-950 font-display">Free Events</h3>
                <p className="text-xs text-neutral-500 mt-1">For open meetups, community gatherings, or forums.</p>
                
                <ul className="text-xs text-neutral-600 mt-8 space-y-3.5 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Unlimited RSVPs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> QR Code Check-ins
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Workspace Isolation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Public Event Feed
                  </li>
                </ul>
              </div>
              
              <div className="mt-10 pt-6 border-t border-neutral-100 space-y-4">
                <div>
                  <div className="text-4xl font-black text-neutral-950 font-display">₹0</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">per event</div>
                </div>
                
                <button className="w-full py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-950 hover:bg-neutral-50 text-neutral-800 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer">
                  Choose Free <span className="text-[9px]">▼</span>
                </button>
                
                <div className="text-[10px] text-neutral-400 font-medium text-center bg-neutral-50 py-1.5 rounded-lg">
                  Ideal for local communities
                </div>
              </div>
            </div>

            {/* Card 2: Paid Tickets */}
            <div className="rounded-3xl border-2 border-purple-500/30 bg-white p-8 backdrop-blur-md text-left flex flex-col justify-between shadow-xl hover:border-purple-500/60 hover:shadow-purple-500/5 transition-all duration-300 relative group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-[9px] font-black uppercase tracking-widest text-white px-3.5 py-1 rounded-full shadow-md z-20">
                Most Popular
              </div>
              <div>
                {/* Badge */}
                <div className="flex justify-start mb-4 mt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-200">
                    ⭐ Commercial Access
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-neutral-950 font-display">Paid Tickets</h3>
                <p className="text-xs text-neutral-500 mt-1">Host concerts, sports fests, and workshops.</p>
                
                <ul className="text-xs text-neutral-600 mt-8 space-y-3.5 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Stripe Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Realtime Revenue Payouts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Ticket Sales Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">✓</span> Secure Attendee Check-ins
                  </li>
                </ul>
              </div>
              
              <div className="mt-10 pt-6 border-t border-neutral-100 space-y-4">
                <div>
                  <div className="text-4xl font-black text-neutral-950 font-display">5%</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">commission per ticket</div>
                </div>
                
                <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/10 flex items-center justify-center gap-1 cursor-pointer">
                  Choose Paid <span className="text-[9px]">▼</span>
                </button>
                
                <div className="text-[10px] text-neutral-400 font-medium text-center bg-neutral-50 py-1.5 rounded-lg">
                  Flat rate. Only pay on sales.
                </div>
              </div>
            </div>
            
          </div>

          {/* Subtitle Section */}
          <div className="pt-10 max-w-2xl mx-auto space-y-4 border-t border-neutral-100">
            <h2 className="text-3xl font-black tracking-tight text-neutral-950 font-display">
              Flawless events aren't luck. They are engineered.
            </h2>
            <p className="text-xs leading-relaxed text-neutral-500 font-sans max-w-xl mx-auto">
              At Planora, we follow a simple and scalable workflow. Every feature is built with strategy, aesthetics, and performance in mind. You know what to expect, and your attendees get a premium experience.
            </p>
          </div>

          {/* Footer Branding Bar inside the Section */}
          <div className="pt-6 flex flex-row items-center justify-between text-[11px] text-neutral-450 border-t border-neutral-100">
            <span className="font-black text-purple-600 text-sm tracking-tight">Planora</span>
            <span className="font-medium text-neutral-400">Aesthetic planning. Seamless conversion.</span>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <Faq02 />

      {/* Proper Footer Container (Testimonials quote with cursive, rich menus, newsletter, social, copyright) */}
      <footer className="relative bg-[#fbfbfb] border-t border-neutral-100/80 pt-20 pb-20 w-full overflow-hidden z-10">
        {/* Relative z-10 wrapper content so footer text renders on top of Planora watermark */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          {/* Middle Rich 12-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 lg:gap-12 max-w-7xl mx-auto text-left items-start">
            
            {/* Column 1: Brand Details (4 cols) */}
            <div className="space-y-4 sm:col-span-2 md:col-span-4 lg:col-span-4">
              <Link to="/" className="text-2xl font-black tracking-tight text-neutral-950 font-display block leading-none">
                Planora
              </Link>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-sm">
                The destination for flawless events. From luxurious workspace conferences to playful community meetups, we guarantee excitement at every turn.
              </p>
              {/* Social Circles */}
              <div className="flex items-center gap-2.5 pt-1">
                {[
                  { icon: Twitter, url: 'https://twitter.com/planora' },
                  { icon: Instagram, url: 'https://instagram.com/planora' },
                  { icon: Globe, url: 'https://planora.events' }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 transition-all shadow-sm"
                  >
                    <social.icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Product links (2 cols) */}
            <div className="space-y-4 sm:col-span-1 md:col-span-2 lg:col-span-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-display leading-none">Product</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/events" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Browse Events</Link></li>
                <li><a href="#pricing" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Ticket Pricing</a></li>
                <li><Link to="/signup" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Host Account</Link></li>
                <li><Link to="/login" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Creator Login</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources links (2 cols) */}
            <div className="space-y-4 sm:col-span-1 md:col-span-2 lg:col-span-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-display leading-none">Resources</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#blog" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Platform Blog</a></li>
                <li><a href="#docs" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Help Center</a></li>
                <li><a href="#support" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Ticket Support</a></li>
                <li><a href="#rules" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Guidelines</a></li>
              </ul>
            </div>

            {/* Column 4: Company links (2 cols) */}
            <div className="space-y-4 sm:col-span-1 md:col-span-2 lg:col-span-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-display leading-none">Company</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#about" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">About Us</a></li>
                <li><a href="#careers" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Careers</a></li>
                <li><a href="#privacy" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Privacy Policy</a></li>
                <li><a href="#terms" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 5: Newsletter form (2 cols) */}
            <div className="space-y-4 sm:col-span-1 md:col-span-2 lg:col-span-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-display leading-none">Newsletter</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Subscribe to get the latest workspace event announcements.
              </p>
              <form 
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center mt-2 w-full"
              >
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-white border border-neutral-200/90 px-4 py-2.5 pr-10 rounded-full text-xs placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none font-sans transition-all shadow-xs"
                />
                <button 
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition shadow-sm cursor-pointer"
                >
                  <ArrowRight size={13} />
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Bar: Copyright and Coffee */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-neutral-200/60 max-w-7xl mx-auto">
            <p className="text-xs text-neutral-400 font-sans leading-none">
              © {new Date().getFullYear()} Planora. All rights reserved. Locally crafted for seamless communities.
            </p>
            
            {/* Coffee pill */}
            <a 
              href="https://buymeacoffee.com/planora"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all pointer-events-auto leading-none"
            >
              <Coffee size={14} className="text-amber-600" />
              <span>Buy us a coffee</span>
            </a>
          </div>

        </div>

        {/* Large Static Watermark Wordmark in the background */}
        <div className="absolute inset-0 select-none overflow-hidden z-0 flex items-center justify-center pointer-events-none">
          <span className="inline-block font-display font-black text-[18vw] tracking-[0.06em] text-neutral-950/[0.03] uppercase leading-none transform scale-x-[1.05] origin-center">
            Planora
          </span>
        </div>
      </footer>

    </div>
  );
}
