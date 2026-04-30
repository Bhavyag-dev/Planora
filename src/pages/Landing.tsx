import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Bell,
  Menu,
  X,
  Bookmark,
  ArrowRight,
  Zap,
  Music,
  Trophy,
  Cpu,
  Palette,
  Mic2,
  Github,
  Twitter,
  Instagram,
  Mail,
  Clock,
  Star,
  Heart,
  ExternalLink,
  AlertTriangle,
  Info,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Code,
  Gamepad2,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { HeroBackground } from '../components/HeroBackground';

/* ==========================================================================
   NAVBAR
   ========================================================================== */

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Events', href: '/events', hasDropdown: true },
    { label: 'Clubs', href: '#clubs-section' },
    { label: 'Calendar', href: '#calendar-section' },
    { label: 'About', href: '#cta-section' },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? 'h-16 bg-zinc-950/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="CampusPulse Home">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110">
              <Zap className="text-white" size={20} fill="currentColor" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-lg transition-opacity group-hover:opacity-60" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Campus<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  to={link.href}
                  className="relative flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronRight size={14} className="rotate-90 transition-transform group-hover:rotate-[270deg]" />}
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-4 right-4 h-px origin-left scale-x-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
                {link.hasDropdown && (
                  <div className="invisible absolute top-full left-0 mt-2 w-52 rounded-2xl border border-white/[0.06] bg-zinc-900/90 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <Link to="/events" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
                      <Sparkles size={14} className="text-indigo-400" /> All Events
                    </Link>
                    <Link to="/events?cat=Tech" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
                      <Cpu size={14} className="text-purple-400" /> Tech Events
                    </Link>
                    <Link to="/events?cat=Cultural" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
                      <Music size={14} className="text-pink-400" /> Cultural
                    </Link>
                    <Link to="/events?cat=Sports" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
                      <Trophy size={14} className="text-amber-400" /> Sports
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <input
              type="text"
              placeholder="Search events, clubs..."
              aria-label="Search campus events"
              className={`h-10 rounded-full border border-white/[0.06] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-all duration-300 focus:border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                isSearchExpanded ? 'w-72 opacity-100' : 'w-44 opacity-70 hover:opacity-100'
              }`}
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => setIsSearchExpanded(false)}
            />
          </div>

          {/* Notification Bell */}
          <button className="relative rounded-full p-2.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
            </span>
          </button>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login">
              <Button variant="ghost" className="text-sm text-zinc-400 hover:text-white hover:bg-white/5">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/5 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative h-6 w-6">
              <span className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
              <span className={`absolute left-0 top-3 block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-white/[0.06] bg-zinc-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="rounded-xl px-4 py-3 text-lg font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">Log in</Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">Sign up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ==========================================================================
   HERO SECTION
   ========================================================================== */

const Hero = () => {
  return (
    <section id="hero-section" className="relative flex h-screen flex-col items-center justify-center overflow-hidden" aria-label="Hero">
      {/* Three.js Cinematic Background Canvas */}
      <HeroBackground />

      {/* Floating Glass Event Preview Cards (decorative, behind headline) */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden lg:block" aria-hidden="true">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] left-[6%] w-56 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><Cpu size={18} className="text-indigo-400" /></div>
            <div>
              <p className="text-xs font-semibold text-white/80">AI Workshop</p>
              <p className="text-[10px] text-zinc-500">Tomorrow • 2:00 PM</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -1.5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[30%] right-[5%] w-60 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><Music size={18} className="text-purple-400" /></div>
            <div>
              <p className="text-xs font-semibold text-white/80">Cultural Night</p>
              <p className="text-[10px] text-zinc-500">Oct 28 • Open Air Theater</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[22%] left-[8%] w-52 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-pink-500/20 flex items-center justify-center"><Trophy size={18} className="text-pink-400" /></div>
            <div>
              <p className="text-xs font-semibold text-white/80">Sports Meet</p>
              <p className="text-[10px] text-zinc-500">Nov 02 • Main Ground</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-[28%] right-[7%] w-48 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Code size={18} className="text-emerald-400" /></div>
            <div>
              <p className="text-xs font-semibold text-white/80">Hackathon</p>
              <p className="text-[10px] text-zinc-500">Oct 25 • Innovation Lab</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Content — layered above canvas */}
      <div className="relative z-10 mx-auto max-w-5xl text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-950/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.1)]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </span>
            The Ultimate Campus Hub
          </motion.span>

          {/* Headline */}
          <h1 className="mt-10 text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-[5.5rem] lg:leading-[1.05] drop-shadow-[0_0_60px_rgba(99,102,241,0.12)]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="block"
            >
              Discover Events
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="block"
            >
              Happening Across
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="block"
            >
              <span
                className="bg-[length:200%_200%] bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #818cf8, #a78bfa, #c084fc, #f472b6, #818cf8)',
                  animation: 'gradientShift 4s ease infinite',
                }}
              >
                Campus
              </span>
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mx-auto mt-8 max-w-2xl text-base text-zinc-400 md:text-lg lg:text-xl leading-relaxed"
          >
            Join thousands of students in discovering hackathons, cultural fests, workshops, and sports events. Your campus life, <span className="text-purple-300">amplified</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/events">
              <button className="group relative h-14 overflow-hidden rounded-2xl bg-white px-8 text-base font-semibold text-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10 flex items-center gap-2">
                  Browse Events <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </Link>
            <Link to="/login">
              <button className="group h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(139,92,246,0.12)] hover:scale-[1.02] active:scale-[0.98]">
                <span className="flex items-center gap-2">
                  Create Event <Sparkles size={16} className="text-purple-400 transition-transform group-hover:rotate-12" />
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-600">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-8 w-5 rounded-full border border-zinc-700 p-1"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ==========================================================================
   SCROLLING DATE STRIP
   ========================================================================== */

const DateStrip = () => {
  const [activeFilter, setActiveFilter] = useState('This Week');
  const filters = ['Today', 'Tomorrow', 'This Week', 'This Month'];

  return (
    <section className="relative z-10 border-y border-white/[0.04] bg-zinc-950/80 backdrop-blur-xl" aria-label="Date filters">
      {/* Gradient line on top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
          <div className="flex-shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
            <Calendar size={14} />
            <span>When</span>
          </div>

          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    : 'text-zinc-500 border border-transparent hover:text-zinc-300 hover:bg-white/[0.03]'
                }`}
                style={{ scrollSnapAlign: 'start' }}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="ml-auto hidden items-center gap-2 text-xs text-zinc-600 md:flex">
            <Clock size={12} />
            <span>Updated live</span>
            <span className="relative flex h-1.5 w-1.5 ml-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </section>
  );
};

/* ==========================================================================
   FEATURED EVENTS SECTION
   ========================================================================== */

const FeaturedEvents = () => {
  const [hoveredBookmark, setHoveredBookmark] = useState<number | null>(null);

  const events = [
    {
      title: 'Global AI Hackathon',
      club: 'Tech Wizards',
      date: 'Oct 25, 2024',
      time: '10:00 AM',
      location: 'Innovation Lab',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
      category: 'Tech',
      attendees: 234,
      gradient: 'from-indigo-600/20 to-cyan-600/20',
      accentColor: 'indigo',
    },
    {
      title: 'Rhythm & Blues Night',
      club: 'Music Society',
      date: 'Oct 27, 2024',
      time: '06:30 PM',
      location: 'Open Air Theater',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      category: 'Cultural',
      attendees: 456,
      gradient: 'from-purple-600/20 to-pink-600/20',
      accentColor: 'purple',
    },
    {
      title: 'Inter-College Cricket',
      club: 'Sports Council',
      date: 'Nov 01, 2024',
      time: '09:00 AM',
      location: 'Main Ground',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop',
      category: 'Sports',
      attendees: 189,
      gradient: 'from-amber-600/20 to-orange-600/20',
      accentColor: 'pink',
    },
  ];

  return (
    <section className="relative py-28 px-6" aria-label="Featured Events">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.04] blur-[120px]" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/[0.04] blur-[100px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-indigo-400 mb-4"
            >
              What's Happening
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Featured <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Events</span>
            </h2>
            <p className="mt-3 text-zinc-500 max-w-md">Handpicked experiences you shouldn't miss this month.</p>
          </div>
          <Link
            to="/events"
            className="group flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 text-sm font-semibold text-purple-400 transition-all hover:border-purple-500/30 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
          >
            View All Events
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, rotateY: 2, rotateX: -1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] shadow-2xl transition-all duration-500 hover:border-white/[0.1] hover:shadow-purple-500/5"
              style={{ perspective: '1000px' }}
            >
              {/* Hover gradient border glow */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${event.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} aria-hidden="true" />
              <div className="absolute inset-[1px] rounded-3xl bg-zinc-950" aria-hidden="true" />

              <div className="relative">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-zinc-950/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/10">
                      {event.category}
                    </span>
                  </div>

                  {/* Bookmark */}
                  <button
                    className="absolute top-4 right-4 rounded-full bg-zinc-950/60 p-2.5 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-purple-500 hover:border-purple-400 hover:scale-110"
                    onMouseEnter={() => setHoveredBookmark(i)}
                    onMouseLeave={() => setHoveredBookmark(null)}
                    aria-label={`Bookmark ${event.title}`}
                  >
                    <Bookmark size={16} fill={hoveredBookmark === i ? 'currentColor' : 'none'} className="transition-all duration-300" />
                  </button>

                  {/* Attendees */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-7 w-7 rounded-full border-2 border-zinc-950 bg-gradient-to-br from-indigo-400 to-purple-500" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-zinc-300 ml-1">+{event.attendees}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
                    <span className="h-1 w-1 rounded-full bg-purple-400" />
                    {event.club}
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white tracking-tight">{event.title}</h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <Calendar size={14} className="text-zinc-500" />
                      {event.date} • {event.time}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <MapPin size={14} className="text-zinc-500" />
                      {event.location}
                    </div>
                  </div>

                  <button className="mt-6 w-full rounded-xl bg-white/[0.04] border border-white/[0.06] py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.1] hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]">
                    Register Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   CATEGORIES SECTION
   ========================================================================== */

const Categories = () => {
  const categories = [
    { name: 'Tech Events', icon: <Cpu size={26} />, count: 24, color: 'indigo', gradient: 'from-indigo-500/10 to-indigo-500/5' },
    { name: 'Cultural', icon: <Music size={26} />, count: 18, color: 'purple', gradient: 'from-purple-500/10 to-purple-500/5' },
    { name: 'Sports', icon: <Trophy size={26} />, count: 12, color: 'pink', gradient: 'from-pink-500/10 to-pink-500/5' },
    { name: 'Hackathons', icon: <Code size={26} />, count: 8, color: 'emerald', gradient: 'from-emerald-500/10 to-emerald-500/5' },
    { name: 'Workshops', icon: <BookOpen size={26} />, count: 15, color: 'amber', gradient: 'from-amber-500/10 to-amber-500/5' },
    { name: 'Seminars', icon: <Mic2 size={26} />, count: 10, color: 'blue', gradient: 'from-blue-500/10 to-blue-500/5' },
  ];

  // Color map for dynamic Tailwind classes
  const colorMap: Record<string, { text: string; bg: string; border: string; shadow: string }> = {
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/30', shadow: 'hover:shadow-indigo-500/10' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/30', shadow: 'hover:shadow-purple-500/10' },
    pink: { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'hover:border-pink-500/30', shadow: 'hover:shadow-pink-500/10' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30', shadow: 'hover:shadow-emerald-500/10' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/30', shadow: 'hover:shadow-amber-500/10' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30', shadow: 'hover:shadow-blue-500/10' },
  };

  return (
    <section className="relative py-28 px-6 bg-gradient-to-b from-zinc-950 via-zinc-900/30 to-zinc-950" aria-label="Event categories">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04),transparent_70%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-purple-400 mb-4">Browse</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Explore by <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Category</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => {
            const colors = colorMap[cat.color];
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`group flex flex-col items-center gap-4 rounded-3xl border border-white/[0.04] bg-white/[0.02] p-8 transition-all duration-300 ${colors.border} ${colors.shadow} hover:bg-white/[0.04] hover:shadow-lg`}
                aria-label={`${cat.name} - ${cat.count} events`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors.bg} ${colors.text} transition-transform duration-300 group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-white">{cat.name}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{cat.count} events</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   TIMELINE STRIP SECTION
   ========================================================================== */

const TimelineStrip = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const days = [
    { day: 'Mon', date: '21', events: 2, active: false },
    { day: 'Tue', date: '22', events: 0, active: false },
    { day: 'Wed', date: '23', events: 3, active: true },
    { day: 'Thu', date: '24', events: 1, active: false },
    { day: 'Fri', date: '25', events: 4, active: false },
    { day: 'Sat', date: '26', events: 2, active: false },
    { day: 'Sun', date: '27', events: 1, active: false },
    { day: 'Mon', date: '28', events: 5, active: false },
    { day: 'Tue', date: '29', events: 0, active: false },
    { day: 'Wed', date: '30', events: 2, active: false },
    { day: 'Thu', date: '31', events: 1, active: false },
    { day: 'Fri', date: '01', events: 3, active: false },
    { day: 'Sat', date: '02', events: 6, active: false },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative border-y border-white/[0.04] bg-zinc-950/60 backdrop-blur-xl py-8" aria-label="Timeline">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-1.5 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Scroll timeline left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-1.5 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Scroll timeline right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">Timeline</span>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto no-scrollbar"
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
            role="listbox"
            aria-label="Select date"
          >
            {days.map((d, i) => (
              <button
                key={i}
                role="option"
                aria-selected={d.active}
                className={`relative flex h-20 w-16 flex-shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-300 ${
                  d.active
                    ? 'border-indigo-500/40 bg-gradient-to-b from-indigo-600/20 to-purple-600/20 text-white shadow-[0_0_25px_rgba(99,102,241,0.15)]'
                    : 'border-white/[0.04] bg-white/[0.02] text-zinc-500 hover:border-white/[0.08] hover:text-zinc-300'
                }`}
                style={{ scrollSnapAlign: 'center' }}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider">{d.day}</span>
                <span className={`text-xl font-bold ${d.active ? 'text-white' : ''}`}>{d.date}</span>
                {d.events > 0 && (
                  <div className={`absolute -bottom-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${
                    d.active ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {d.events}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   CLUBS SHOWCASE SECTION (Marquee)
   ========================================================================== */

const ClubsShowcase = () => {
  const clubs = [
    { name: 'Tech Wizards', description: 'Innovation & Development', members: 120, icon: <Cpu size={24} />, color: 'indigo' },
    { name: 'Music Society', description: 'Rhythm & Harmony', members: 85, icon: <Music size={24} />, color: 'purple' },
    { name: 'Sports Council', description: 'Athletics & Fitness', members: 200, icon: <Trophy size={24} />, color: 'pink' },
    { name: 'Art Collective', description: 'Creativity Unleashed', members: 65, icon: <Palette size={24} />, color: 'amber' },
    { name: 'Debate Club', description: 'Words & Arguments', members: 45, icon: <Mic2 size={24} />, color: 'emerald' },
    { name: 'Gaming Guild', description: 'Digital Adventures', members: 150, icon: <Gamepad2 size={24} />, color: 'blue' },
    { name: 'Science Society', description: 'Discovery & Research', members: 90, icon: <GraduationCap size={24} />, color: 'cyan' },
    { name: 'Code Club', description: 'Open Source Projects', members: 110, icon: <Code size={24} />, color: 'violet' },
  ];

  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400 bg-indigo-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    pink: 'text-pink-400 bg-pink-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
  };

  const ClubCard = ({ club }: { key?: React.Key; club: typeof clubs[0] }) => (
    <div className="group flex-shrink-0 w-72 rounded-3xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]">
      <div className="flex items-start justify-between">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorMap[club.color]} transition-transform duration-300 group-hover:scale-110`}>
          {club.icon}
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          <Users size={12} />
          <span>{club.members}</span>
        </div>
      </div>
      <h3 className="mt-5 text-lg font-bold text-white">{club.name}</h3>
      <p className="mt-1 text-sm text-zinc-500">{club.description}</p>
      <button className="mt-5 flex items-center gap-2 text-xs font-bold text-purple-400 transition-all duration-300 hover:gap-3 group-hover:text-purple-300">
        Explore <ArrowRight size={12} />
      </button>
    </div>
  );

  return (
    <section id="clubs-section" className="relative py-28 overflow-hidden" aria-label="Campus clubs">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/20 to-zinc-950" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 mb-16">
        <div className="text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-purple-400 mb-4">Community</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Campus <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Clubs</span>
          </h2>
          <p className="mt-3 text-zinc-500">The heartbeat of our campus community.</p>
        </div>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-r from-zinc-950 to-transparent" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-l from-zinc-950 to-transparent" aria-hidden="true" />

        <div className="flex gap-6 animate-marquee">
          {[...clubs, ...clubs].map((club, i) => (
            <ClubCard key={i} club={club} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (reverse) */}
      <div className="relative mt-6">
        <div className="absolute left-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-r from-zinc-950 to-transparent" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-l from-zinc-950 to-transparent" aria-hidden="true" />

        <div className="flex gap-6 animate-marquee-reverse">
          {[...clubs.slice(4), ...clubs.slice(0, 4), ...clubs.slice(4), ...clubs.slice(0, 4)].map((club, i) => (
            <ClubCard key={i} club={club} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   CALENDAR PREVIEW SECTION
   ========================================================================== */

const CalendarPreview = () => {
  const eventDays = [3, 7, 12, 15, 18, 23, 24, 25, 28];
  const today = 23;
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const upcomingEvents = [
    { label: 'Hackathon Registration Deadline', date: 'Oct 24', urgent: true },
    { label: 'Cultural Fest Auditions', date: 'Oct 25', urgent: false },
    { label: 'Workshop: AI & ML Basics', date: 'Oct 28', urgent: false },
    { label: 'Inter-College Sports Meet', date: 'Nov 02', urgent: false },
  ];

  return (
    <section id="calendar-section" className="relative py-28 px-6" aria-label="Calendar preview">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-600/[0.03] blur-[150px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-purple-400 mb-4">Plan Ahead</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Plan Your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Month</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
              Stay ahead of the curve. Sync your campus calendar and never miss a deadline or a party.
            </p>

            <div className="mt-10 space-y-3">
              {upcomingEvents.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:border-white/[0.08] hover:bg-white/[0.04]"
                >
                  {item.urgent ? (
                    <div className="relative">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-red-400 opacity-75" />
                    </div>
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                  )}
                  <span className="flex-1 text-sm font-medium text-white">{item.label}</span>
                  <span className="text-xs font-medium text-zinc-500 bg-white/[0.03] px-3 py-1 rounded-lg">{item.date}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl shadow-2xl"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">October 2024</h3>
              <div className="flex gap-2">
                <button className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white" aria-label="Previous month">
                  <ChevronLeft size={16} />
                </button>
                <button className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white" aria-label="Next month">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 text-center mb-3">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 py-2">{d}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Offset for October 2024 starting on Tuesday */}
              {[...Array(2)].map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === today;
                const hasEvent = eventDays.includes(day);

                return (
                  <button
                    key={day}
                    className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                      isToday
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20'
                        : hasEvent
                        ? 'text-white hover:bg-white/[0.06] bg-white/[0.03]'
                        : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                    }`}
                    aria-label={`October ${day}${hasEvent ? ', has events' : ''}`}
                  >
                    {day}
                    {hasEvent && !isToday && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   ANNOUNCEMENTS SECTION
   ========================================================================== */

const Announcements = () => {
  const announcements = [
    {
      title: 'Exam Schedule Released',
      description: 'End-semester examination timetable for all departments is now available. Check the academic portal.',
      type: 'Alert',
      icon: <AlertTriangle size={16} />,
      color: 'red',
      time: '2 hours ago',
    },
    {
      title: 'New Library Timings',
      description: 'Library will now operate from 7 AM to 11 PM on weekdays. Extended weekend hours announced.',
      type: 'Notice',
      icon: <Info size={16} />,
      color: 'blue',
      time: '5 hours ago',
    },
    {
      title: 'Fest Registration Open',
      description: 'Annual TechFest registration is live! Early bird discount available until October 25th.',
      type: 'Update',
      icon: <CheckCircle size={16} />,
      color: 'emerald',
      time: '1 day ago',
    },
  ];

  const colorMap: Record<string, { text: string; bg: string; border: string; pulse?: boolean }> = {
    red: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', pulse: true },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  };

  return (
    <section className="relative py-28 px-6" aria-label="Announcements">
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/[0.03] blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-purple-400 mb-4">Stay Updated</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Campus <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Buzz</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {announcements.map((item, i) => {
            const colors = colorMap[item.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group rounded-3xl border border-white/[0.04] bg-white/[0.02] p-7 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full ${colors.bg} ${colors.text} px-3 py-1 text-[10px] font-bold uppercase tracking-widest`}>
                    {colors.pulse && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                      </span>
                    )}
                    {item.icon}
                    {item.type}
                  </span>
                  <span className="text-[10px] text-zinc-600">{item.time}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{item.description}</p>
                <button className="mt-6 flex items-center gap-2 text-xs font-bold text-white transition-all duration-300 hover:gap-3 group-hover:text-purple-300">
                  Read More <ArrowRight size={12} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   CTA BANNER SECTION
   ========================================================================== */

const CTABanner = () => {
  return (
    <section id="cta-section" className="px-6 py-16" aria-label="Call to action">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] p-1"
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-[2.5rem]"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 5s ease infinite',
          }}
          aria-hidden="true"
        />

        <div className="relative rounded-[2.3rem] bg-zinc-950 px-8 py-16 md:px-16 md:py-20 text-center overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-indigo-600/20 blur-[100px]" aria-hidden="true" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-purple-600/20 blur-[100px]" aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-pink-600/10 blur-[80px]" aria-hidden="true" />

          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-6 right-1/4 text-indigo-500/20"
              aria-hidden="true"
            >
              <Star size={40} />
            </motion.div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Never Miss Another <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Campus Event</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Join <span className="font-semibold text-white">5,000+</span> students who are already part of the most vibrant campus community platform.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/signup">
                <button className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-10 text-lg font-semibold text-white shadow-xl shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]">
                  <span className="relative z-10 flex items-center gap-2">
                    Join Now <Sparkles size={18} className="transition-transform group-hover:rotate-12" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </Link>
              <Link to="/events">
                <button className="h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-10 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02] active:scale-[0.98]">
                  Explore Events
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '5,000+', label: 'Students' },
                { value: '200+', label: 'Events' },
                { value: '50+', label: 'Clubs' },
                { value: '15+', label: 'Colleges' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ==========================================================================
   FOOTER
   ========================================================================== */

const Footer = () => {
  const [emailFocused, setEmailFocused] = useState(false);

  const footerLinks = {
    Product: [
      { label: 'Browse Events', href: '/events' },
      { label: 'Create Event', href: '/login' },
      { label: 'Clubs Directory', href: '#clubs-section' },
      { label: 'Campus Calendar', href: '#calendar-section' },
    ],
    Resources: [
      { label: 'Help Center', href: '#' },
      { label: 'API Docs', href: '#' },
      { label: 'Guidelines', href: '#' },
      { label: 'Status', href: '#' },
    ],
    Company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Press Kit', href: '#' },
    ],
  };

  const socials = [
    { icon: <Twitter size={18} />, label: 'Twitter', href: '#' },
    { icon: <Instagram size={18} />, label: 'Instagram', href: '#' },
    { icon: <Github size={18} />, label: 'GitHub', href: '#' },
    { icon: <Mail size={18} />, label: 'Email', href: '#' },
  ];

  return (
    <footer className="relative border-t border-white/[0.04] bg-zinc-950 pt-24 pb-8 px-6" role="contentinfo">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="CampusPulse Home">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110">
                <Zap className="text-white" size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">CampusPulse</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm text-zinc-500 leading-relaxed">
              The all-in-one platform for campus life. Discover events, join clubs, and stay connected with your university community.
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.04] bg-white/[0.02] text-zinc-400 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white">{title}</h4>
              <ul className="mt-6 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-zinc-500 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white">Newsletter</h4>
            <p className="mt-6 text-sm text-zinc-500">Get weekly updates on campus events.</p>
            <div className="mt-4 space-y-3">
              <div className={`relative rounded-xl transition-all duration-300 ${emailFocused ? 'shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''}`}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address for newsletter"
                  className="h-11 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </div>
              <button className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-purple-500/15 transition-all duration-300 hover:shadow-purple-500/25 hover:from-indigo-500 hover:to-purple-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">© 2024 CampusPulse. All rights reserved. Built for students, by students.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">Privacy</a>
            <a href="#" className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">Terms</a>
            <a href="#" className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ==========================================================================
   MAIN LANDING PAGE — Composition of ALL sections
   ========================================================================== */

export const Landing = () => {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-purple-500 selection:text-white">
      {/* <!-- Navbar --> */}
      <Navbar />

      <main>
        {/* <!-- Hero Section --> */}
        <Hero />

        {/* <!-- Date Strip --> */}
        <DateStrip />

        {/* <!-- Events --> */}
        <FeaturedEvents />

        {/* <!-- Categories --> */}
        <Categories />

        {/* <!-- Timeline --> */}
        <TimelineStrip />

        {/* <!-- Clubs --> */}
        <ClubsShowcase />

        {/* <!-- Calendar --> */}
        <CalendarPreview />

        {/* <!-- Announcements --> */}
        <Announcements />

        {/* <!-- CTA --> */}
        <CTABanner />
      </main>

      {/* <!-- Footer --> */}
      <Footer />
    </div>
  );
};
