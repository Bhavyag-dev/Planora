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
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-extrabold tracking-tight text-neutral-950 font-display">
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
      <section className="mx-auto max-w-5xl px-6 py-6 border-t border-b border-neutral-100/60 mt-4 select-none">
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
      <section className="mx-auto max-w-7xl px-6 py-20">
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

          {/* Right Floating Dashboard Visual Layer (Dark Panel with Overlays) */}
          <div className="lg:col-span-7 relative">
            {/* Dark background panel */}
            <div className="w-full h-[400px] rounded-[2.5rem] bg-neutral-950 relative overflow-hidden flex flex-col justify-end p-8 shadow-xl">
              {/* Decorative radial lighting */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/[0.03] blur-3xl" />
              
              <div className="flex items-center justify-between text-xs text-neutral-500 select-none z-10">
                <span className="font-semibold text-neutral-300">Upcoming events &nbsp; <span className="text-white">2 / 30</span></span>
                <div className="flex gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                </div>
              </div>
            </div>

            {/* Overlapping progress track card (Left float) */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 w-72 rounded-3xl border border-neutral-100 bg-[#e7f0e9]/90 p-5 shadow-2xl backdrop-blur-md z-20 transition-transform hover:-translate-y-[52%] duration-300">
              <div className="flex items-center justify-between">
                {/* Horizontal dot timeline indicator */}
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-neutral-400" />
                  <div className="h-2 w-2 rounded-full bg-neutral-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 flex items-center justify-center text-[7px] text-white">✓</div>
                  <div className="h-2 w-2 rounded-full bg-neutral-200" />
                  <div className="h-2 w-2 rounded-full bg-neutral-200" />
                </div>
                <Link to="/signup" className="rounded-full bg-white border border-neutral-200/60 px-3 py-1.5 text-[10px] font-bold text-neutral-800 hover:bg-neutral-50 shadow-sm transition-colors">
                  Join ›
                </Link>
              </div>

              {/* Mapped faces */}
              <div className="flex items-center -space-x-1.5 mt-6">
                <div className="h-6 w-6 rounded-full border-2 border-white bg-[#d1d5db] bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80')] bg-cover" />
                <div className="h-6 w-6 rounded-full border-2 border-white bg-[#9ca3af] bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80')] bg-cover" />
                <div className="h-6 w-6 rounded-full border-2 border-white bg-[#e5e7eb] bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80')] bg-cover" />
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Plan starts Dec 26, 2026</span>
                <h4 className="text-xl font-extrabold text-neutral-900 leading-tight mt-1">Design Workshop with Expert Team ☡</h4>
              </div>
            </div>

            {/* Overlapping Image Card 1 (Center float) */}
            <div className="absolute right-36 top-6 w-44 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-20 hidden sm:block rotate-[-2deg] transition-all hover:scale-103 hover:rotate-[0deg] duration-300">
              <img 
                src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=400&q=80" 
                alt="event thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping Image Card 2 (Right float) */}
            <div className="absolute -right-4 top-16 w-44 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-20 rotate-[3deg] transition-all hover:scale-103 hover:rotate-[0deg] duration-300">
              <img 
                src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80" 
                alt="event thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Live Events Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-neutral-100/60">
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

      {/* Proper Footer Container (Testimonials quote with cursive, menus, coffee, social, copyright) */}
      <footer className="relative bg-[#fbfbfb] border-t border-neutral-100 pt-20 pb-16 z-10">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          {/* Quote / Testimonial row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-5xl mx-auto">
            {/* Quote block */}
            <div className="flex-1 space-y-3 text-left">
              <span className="text-[11px] font-bold font-mono text-neutral-300 uppercase tracking-widest select-none">
                Planora Experience
              </span>
              <p className="text-3xl font-medium text-neutral-800 leading-normal font-cursive">
                " With our combined expertise and passion for organization, we promise to deliver an event that's <span className="text-neutral-400 font-normal">not just an event</span>, a vibrant memory etched in the minds of your audience. "
              </p>
              <div className="flex items-center gap-2 pt-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="Trisha" 
                  className="h-8 w-8 rounded-full object-cover border border-neutral-200/50 shadow-sm"
                />
                <div>
                  <h5 className="text-[11px] font-bold text-neutral-900 leading-none">Trisha Woodward</h5>
                  <p className="text-[9px] text-neutral-400">Co-founder at Planora</p>
                </div>
              </div>
            </div>

            {/* Floating side-by-side card images (Completely above watermark) */}
            <div className="flex gap-4 items-center shrink-0">
              <div className="w-28 aspect-square rounded-2xl overflow-hidden shadow-md border border-neutral-200/50 rotate-[-4deg]">
                <img 
                  src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=200&q=80" 
                  alt="thumb" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-neutral-200/50 rotate-[4deg]">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80" 
                  alt="thumb" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Footer bottom controls: menus, coffee, social, copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-neutral-100/80 max-w-5xl mx-auto">
            <div className="flex flex-col md:items-start gap-4">
              {/* Menu Links */}
              <div className="flex gap-6 text-xs font-semibold text-neutral-800 font-display">
                <a href="#about" className="hover:text-neutral-500 transition-colors">About us &nbsp;→</a>
                <a href="#blog" className="hover:text-neutral-500 transition-colors">Blog &nbsp;→</a>
                <a href="#contact" className="hover:text-neutral-500 transition-colors">Contact us &nbsp;→</a>
              </div>
              
              <p className="text-[11px] text-neutral-400 max-w-sm leading-relaxed font-sans">
                Destination for flawless events. From luxurious workspace conferences to playful meetups, we guarantee a wave of excitement at every turn.
              </p>

              {/* Social Circles */}
              <div className="flex gap-2">
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

            {/* Coffee and copyright */}
            <div className="flex flex-col items-center md:items-end gap-3 text-right">
              {/* Buy us a coffee pill button */}
              <a 
                href="https://buymeacoffee.com/planora"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 shadow-sm transition-all pointer-events-auto"
              >
                <Coffee size={14} className="text-amber-600" />
                <span>Buy us a coffee</span>
              </a>
              <p className="text-[11px] text-neutral-400 mt-2 font-sans">
                © {new Date().getFullYear()} Planora. All rights reserved.
              </p>
            </div>
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
