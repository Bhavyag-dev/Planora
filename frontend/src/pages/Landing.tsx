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
  Check
} from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';

export function Landing() {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [langDropdown, setLangDropdown] = useState(false);
  const [planningDropdown, setPlanningDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [previewTab, setPreviewTab] = useState<'events' | 'members' | 'create'>('events');
  
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
            <div className="hidden md:flex items-center gap-6">
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
      <section className="relative flex flex-col items-center justify-center pt-40 pb-24 text-center px-6 overflow-hidden">
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

        {/* CTA Button */}
        <div className="relative z-10 mt-10 flex flex-col items-center gap-3">
          <Link
            to="/events"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-4 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors duration-200 shadow-md"
          >
            Get Started
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 select-none mt-1">
            ⚡ Start hosting in minutes. No credit card required.
          </span>
        </div>
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
            <div className="w-full h-[380px] rounded-[2rem] bg-neutral-950 p-6 flex flex-col justify-between shadow-xl border border-neutral-800 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/[0.02] blur-3xl" />
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-neutral-400">workspace_stats</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="my-auto">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Real-time Activity</span>
                <h3 className="text-4xl font-extrabold text-white tracking-tight mt-1 font-display">94.2%</h3>
                <p className="text-[13px] text-neutral-400 mt-2 font-medium leading-relaxed">Community Engagement score across 12 workspace events this month.</p>
              </div>
              <div className="border-t border-neutral-900 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 font-mono">planora_core_v1</span>
                <Link to="/signup" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors pointer-events-auto">View analytics ›</Link>
              </div>
            </div>

            {/* Big Mockup 2: Premium Visual Event Card */}
            <div className="w-full h-[380px] rounded-[2rem] overflow-hidden shadow-xl border border-neutral-200 relative group hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80" 
                alt="Premium Community Event" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-wider">Featured Meetup</span>
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
        <div className="mt-12 rounded-3xl border border-neutral-200/60 bg-zinc-950 p-3 shadow-2xl relative overflow-hidden text-zinc-300">
          
          {/* Mockup Tabs */}
          <div className="flex bg-zinc-900/50 border border-white/[0.04] p-1 rounded-2xl mb-4 max-w-xs mx-auto justify-between">
            <button 
              onClick={() => setPreviewTab('events')} 
              className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                previewTab === 'events' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Workspace Events
            </button>
            <button 
              onClick={() => setPreviewTab('members')} 
              className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                previewTab === 'members' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Team Members
            </button>
            <button 
              onClick={() => setPreviewTab('create')} 
              className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                previewTab === 'create' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Event Creator
            </button>
          </div>

          <div className="bg-zinc-900 rounded-[1.5rem] border border-white/[0.04] p-6 text-left flex gap-6 min-h-[360px]">
            {/* Mock Sidebar */}
            <div className="w-48 border-r border-white/[0.06] pr-6 hidden md:flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 font-bold tracking-tight text-white pl-2">
                  <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                    A
                  </div>
                  <span className="text-sm truncate">Acme Workshops</span>
                </div>
                <nav className="space-y-1.5 flex flex-col">
                  <span className="flex items-center gap-2.5 text-xs text-white bg-white/5 px-2.5 py-1.5 rounded-lg"><LayoutDashboard size={14} className="text-purple-400" /> Dashboard</span>
                  <span className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg"><Calendar size={14} /> Events</span>
                  <span className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg"><Users size={14} /> Team Roster</span>
                </nav>
              </div>
              <div className="text-[10px] text-zinc-500 border-t border-white/[0.06] pt-3 pl-2">
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
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Workspace Events</h4>
                      <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">2 Scheduled</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="p-4 bg-zinc-950 border border-white/[0.04] rounded-2xl space-y-2">
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-1.5 py-0.5 rounded">Workshop</span>
                        <h5 className="text-xs font-bold text-white leading-tight">Advanced React Patterns</h5>
                        <p className="text-[10px] text-zinc-500">A deep dive into server actions and hooks...</p>
                        <div className="pt-2 border-t border-white/[0.04] text-[9px] text-zinc-500 flex items-center gap-1.5">
                          <MapPin size={9} /> Acme Conf Room A
                        </div>
                      </div>
                      <div className="p-4 bg-zinc-950 border border-white/[0.04] rounded-2xl space-y-2">
                        <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-1.5 py-0.5 rounded">Meetup</span>
                        <h5 className="text-xs font-bold text-white leading-tight">AI & Analytics Forum</h5>
                        <p className="text-[10px] text-zinc-500">Exploring generative model integrations...</p>
                        <div className="pt-2 border-t border-white/[0.04] text-[9px] text-zinc-500 flex items-center gap-1.5">
                          <MapPin size={9} /> Community Hub Workspace
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {previewTab === 'members' && (
                  <motion.div 
                    key="members"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Active Team Members</h4>
                      <span className="text-[10px] text-zinc-500 bg-white/5 px-2.5 py-0.5 rounded-full">3 Collaborators</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-zinc-950 border border-white/[0.04] rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-[10px] text-white">S</div>
                          <div>
                            <p className="text-[10px] font-bold text-white leading-none">Sarah Chen</p>
                            <p className="text-[9px] text-zinc-500 mt-0.5">sarah@acme.com</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">owner</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-zinc-950 border border-white/[0.04] rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center font-bold text-[10px] text-white">D</div>
                          <div>
                            <p className="text-[10px] font-bold text-white leading-none">David Miller</p>
                            <p className="text-[9px] text-zinc-500 mt-0.5">david@acme.com</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">member</span>
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
                      <button disabled className="w-full h-8 bg-white text-black font-bold text-xs rounded-lg mt-1 opacity-80 cursor-not-allowed">
                        Create Event
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4 border-t border-white/[0.04] mt-6 flex items-center justify-between text-[10px] text-zinc-550">
                <span>Database Connection Status: OK</span>
                <span className="text-purple-400 font-semibold flex items-center gap-1">
                  <Check size={10} /> Active Workspace Locked
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-100/80 bg-neutral-50/50 rounded-[2.5rem] my-12 shadow-sm border border-neutral-100">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
            Built for Every Event Layout
          </h2>
          <p className="text-sm text-neutral-500">
            A flexible platform tailored for organizations, organizers, and networks of all scales.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-16">
          <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm text-left">
            <h4 className="font-bold text-neutral-900 text-base">Corporate Teams</h4>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Coordinate team syncs, masterclasses, and executive panel discussions securely inside workspace boundaries.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm text-left">
            <h4 className="font-bold text-neutral-900 text-base">Local Meetups</h4>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Perfect for tech communities, book clubs, and developer forums looking to build local connections with RSVP lists.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm text-left">
            <h4 className="font-bold text-neutral-900 text-base">Universities & Clubs</h4>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Allow campus chapters and activity groups to invite members, schedule fests, and collect attendee list approvals.</p>
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

      {/* FAQs */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20 border-t border-neutral-100/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-500">
            Answers to common questions about workspace limits, ticket setup, and features.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Is Planora free to use?",
              a: "Yes! Planora is 100% free for hosting free events with unlimited RSVPs. For paid ticketed events, we charge a flat 5% commission per ticket transaction with zero setup costs."
            },
            {
              q: "How does multi-workspace support work?",
              a: "Planora allows you to create separate workspaces for different organizations (e.g. Acme Corp, local meetups, or personal clubs). Each workspace isolates events, member roles, and settings."
            },
            {
              q: "Can I invite team members to co-host events?",
              a: "Absolutely. As a workspace owner, you can enter any team member's email in the dashboard roster. They will be added as a collaborator to co-manage the events feed."
            },
            {
              q: "Are there limit counts on attendees?",
              a: "No! Planora supports events of all scales. You can specify a custom seat limit when scheduling an event, and registrations will close automatically once the capacity is filled."
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-neutral-150 bg-white p-4 shadow-sm text-left transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between font-bold text-sm text-neutral-950 focus:outline-none cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-neutral-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-neutral-500 leading-relaxed mt-2.5 pt-2.5 border-t border-neutral-100">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / FAQs target anchors for navigation */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 border-t border-neutral-100/80 bg-white rounded-[2rem] my-12 shadow-sm border border-neutral-100">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 font-display">Simple Pricing for Organizers</h2>
          <p className="text-xs text-neutral-400 mt-2">No setup costs. Only pay when you host paid events.</p>
          
          <div className="grid gap-6 md:grid-cols-2 mt-10">
            <div className="rounded-2xl border border-neutral-100 p-6 text-left flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-neutral-900">Free Events</h3>
                <p className="text-xs text-neutral-400 mt-1">For open meetups, community gatherings, or forums.</p>
                <div className="text-2xl font-extrabold text-neutral-950 mt-4 font-display">₹0 <span className="text-xs text-neutral-400 font-normal">/ event</span></div>
              </div>
              <ul className="text-xs text-neutral-500 mt-6 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Unlimited RSVPs</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> QR Check-ins</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-950 bg-neutral-950 p-6 text-left text-white flex flex-col justify-between shadow-md relative overflow-hidden">
              <span className="absolute top-3 right-3 bg-white/20 text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">Popular</span>
              <div>
                <h3 className="font-bold">Paid Tickets</h3>
                <p className="text-xs text-neutral-300 mt-1">Host concerts, sports fests, and workshops.</p>
                <div className="text-2xl font-extrabold mt-4 font-display">5% <span className="text-xs text-neutral-300 font-normal">commission per ticket</span></div>
              </div>
              <ul className="text-xs text-neutral-300 mt-6 space-y-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400" /> Stripe Integration</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400" /> Realtime revenue payouts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proper Footer Container (Testimonials quote with cursive, rich menus, newsletter, social, copyright) */}
      <footer className="relative bg-[#fbfbfb] border-t border-neutral-100/60 pt-24 pb-20 z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
          
          {/* Top Highlight: Testimonial & Visual Cards */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 max-w-5xl mx-auto pb-12 border-b border-neutral-100">
            {/* Quote block */}
            <div className="flex-1 space-y-4 text-left">
              <span className="text-[11px] font-bold font-mono text-neutral-400 uppercase tracking-widest select-none">
                Planora Experience
              </span>
              <p className="text-2xl md:text-3xl font-medium text-neutral-800 leading-normal font-cursive">
                " With our combined expertise and passion for organization, we promise to deliver an event that's <span className="text-neutral-400 font-normal">not just an event</span>, but a vibrant memory etched in the minds of your audience. "
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="Trisha Woodward" 
                  className="h-9 w-9 rounded-full object-cover border border-neutral-200/50 shadow-sm"
                />
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 leading-none">Trisha Woodward</h5>
                  <p className="text-[10px] text-neutral-400 mt-1">Co-founder at Planora</p>
                </div>
              </div>
            </div>

            {/* Staggered visual photo cards */}
            <div className="flex gap-4 items-center shrink-0 mx-auto lg:mx-0">
              <div className="w-28 aspect-square rounded-2xl overflow-hidden shadow-md border border-neutral-200/50 rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=200&q=80" 
                  alt="community social" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-neutral-200/50 rotate-[4deg] hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80" 
                  alt="event presenter" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Middle Rich 5-Column Grid */}
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 max-w-5xl mx-auto pt-4 text-left">
            
            {/* Column 1: Brand Details */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <span className="text-xl font-extrabold tracking-tight text-neutral-950 font-display">
                Planora
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-xs">
                The destination for flawless events. From luxurious workspace conferences to playful community meetups, we guarantee excitement at every turn.
              </p>
              {/* Social Circles */}
              <div className="flex gap-2 pt-2">
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
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all shadow-sm"
                  >
                    <social.icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Product links */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-4 font-display">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/events" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Browse Events</Link></li>
                <li><a href="#pricing" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Ticket Pricing</a></li>
                <li><Link to="/signup" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Host Account</Link></li>
                <li><Link to="/login" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Creator Login</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources links */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-4 font-display">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#blog" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Platform Blog</a></li>
                <li><a href="#docs" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Help Center</a></li>
                <li><a href="#support" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Ticket Support</a></li>
                <li><a href="#rules" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Guidelines</a></li>
              </ul>
            </div>

            {/* Column 4: Company links */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-4 font-display">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#about" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">About Us</a></li>
                <li><a href="#careers" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Careers</a></li>
                <li><a href="#privacy" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Privacy Policy</a></li>
                <li><a href="#terms" className="text-neutral-500 hover:text-neutral-950 transition-colors py-1 block">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 5: Newsletter form */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-4 font-display">Newsletter</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Subscribe to get the latest workspace event announcements.
              </p>
              <form 
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center mt-2"
              >
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-white border border-neutral-200/80 px-4 py-2.5 pr-10 rounded-full text-xs focus:ring-1 focus:ring-neutral-400 focus:outline-none font-sans"
                />
                <button 
                  type="submit"
                  className="absolute right-1 w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition shadow-sm"
                >
                  <ArrowRight size={13} />
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Bar: Copyright and Coffee */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-neutral-100 max-w-5xl mx-auto">
            <p className="text-[11px] text-neutral-400 font-sans">
              © {new Date().getFullYear()} Planora. All rights reserved. Locally crafted for seamless communities.
            </p>
            
            {/* Coffee pill */}
            <a 
              href="https://buymeacoffee.com/planora"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 shadow-sm transition-all pointer-events-auto"
            >
              <Coffee size={14} className="text-amber-600" />
              <span>Buy us a coffee</span>
            </a>
          </div>

        </div>
      </footer>

      {/* Separate Watermark block BELOW the proper footer, collapsing cleanly on scroll */}
      <div className="relative w-full bg-[#fbfbfb] pb-12 pt-4 border-t border-neutral-100/40 select-none overflow-hidden z-0">
        <div className="w-full text-center">
          <motion.span 
            style={{ 
              y: -scrollRatio * 35 
            }}
            className="inline-block font-display font-black text-[13.5vw] tracking-[0.06em] text-[#ececee]/80 uppercase leading-none transform scale-x-[1.05] origin-center"
          >
            Planora
          </motion.span>
        </div>
      </div>

    </div>
  );
}
