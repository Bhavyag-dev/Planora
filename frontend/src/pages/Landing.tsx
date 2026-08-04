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
  Instagram
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fbfbfb]/20 to-[#fbfbfb]/75" />
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

      {/* Brand Logos Bar */}
      <section className="relative z-10 bg-[#fbfbfb] mx-auto max-w-5xl px-6 py-6 border-t border-b border-neutral-100/60 mt-4 select-none">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[13px] font-bold text-neutral-300 font-mono tracking-wider">
          <span className="hover:text-neutral-400 transition-colors">Retool</span>
          <span className="hover:text-neutral-400 transition-colors">remote</span>
          <span className="hover:text-neutral-400 transition-colors">ARC</span>
          <span className="hover:text-neutral-400 transition-colors">Raycast</span>
          <span className="hover:text-neutral-400 transition-colors">runway</span>
          <span className="hover:text-neutral-400 transition-colors">ramp ⏿</span>
          <span className="hover:text-neutral-400 transition-colors">HEX</span>
          <span className="hover:text-neutral-400 transition-colors">▲ Vercel</span>
          <span className="hover:text-neutral-400 transition-colors">descript</span>
          <span className="hover:text-neutral-400 transition-colors">Cash App</span>
        </div>
      </section>

      {/* Fold 2: Unforgettable Event Panel Layout (Reference Image 2) */}
      <section className="relative z-10 bg-[#fbfbfb] mx-auto max-w-7xl px-6 py-24 border-b border-neutral-100/40">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
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
      <section className="relative z-10 bg-[#fbfbfb] mx-auto max-w-7xl px-6 py-16 border-t border-neutral-100/60">
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
