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
import { AccordionGallery } from '../components/AccordionGallery';
import CardNav from '../components/CardNav';
import { StepperHowItWorks } from '../components/StepperHowItWorks';
import GalleryTunnel from '../components/originkit/ui/hero-13/gallery-tunnel';

const HERO_TUNNEL_IMAGES = [
  '/originkit/hero-13/potrait-1.png',
  '/originkit/hero-13/potrait-2.png',
  '/originkit/hero-13/potrait-3.png',
  '/originkit/hero-13/potrait-4.png',
  '/originkit/hero-13/potrait-5.png',
  '/originkit/hero-13/potrait-6.png',
];

export function Landing() {
  const { isAuthenticated, user } = useAuth();
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
      
      {/* Integrated React Bits CardNav Component */}
      <CardNav
        items={[
          {
            label: "Platform",
            bgColor: "#171717",
            textColor: "#ffffff",
            links: [
              { label: "Home Overview", href: "/", ariaLabel: "Home Overview" },
              { label: "How Hosting Works", href: "#how-it-works", ariaLabel: "How Hosting Works" },
              { label: "Ticket Pricing", href: "#pricing", ariaLabel: "Ticket Pricing" }
            ]
          },
          {
            label: "Workspace",
            bgColor: "#262626",
            textColor: "#ffffff",
            links: [
              { label: "Create Event", href: "/dashboard", ariaLabel: "Create Event" },
              { label: "Workspace Dashboard", href: "/dashboard", ariaLabel: "Workspace Dashboard" },
              { label: "Explore Events", href: "/events", ariaLabel: "Explore Events" }
            ]
          },
          {
            label: "Contacts",
            bgColor: "#3b3b3b",
            textColor: "#ffffff",
            links: [
              { label: "Call for Sponsors", href: "mailto:sponsors@planora.events", ariaLabel: "Call for Sponsors" },
              { label: "Contact Us", href: "mailto:hello@planora.events", ariaLabel: "Contact Us" },
              { label: "Help & Support", href: "#faq", ariaLabel: "Help & Support" }
            ]
          }
        ]}
        baseColor="rgba(255, 255, 255, 0.95)"
        menuColor="#0a0a0a"
        buttonBgColor="#0a0a0a"
        buttonTextColor="#ffffff"
        ctaText={isAuthenticated && user ? 'Dashboard' : 'Get Started'}
        ctaHref={isAuthenticated && user ? '/dashboard' : '/signup'}
        ease="power3.out"
      />

      {/* Full-Bleed Page Level Background Gallery Tunnel from Originkit (Original #131313 Dark Theme) */}
      <div className="absolute top-0 inset-x-0 h-screen z-0 overflow-hidden pointer-events-auto select-none bg-[#131313]">
        <GalleryTunnel
          images={HERO_TUNNEL_IMAGES.map(src => ({ src }))}
          background="#131313"
          lineColor="#B0B0B0"
          lineOpacity={0}
          grid={8}
          speed={50}
          boost={100}
          fade={100}
          label={false}
          cellMode="square"
        />
        {/* Radial vignette blur behind hero text for legibility */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[75vh] w-[90vw] max-w-4xl bg-[#131313]/85 blur-[50px] z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#131313] z-10" />
      </div>

      {/* Hero Section */}
      <section className="relative z-20 flex flex-col items-center justify-center min-h-screen pt-32 pb-20 text-center px-6 overflow-hidden">
        {/* Central Badge */}
        <div className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold text-white shadow-lg select-none">
          <span>⚡</span>
          <span className="text-neutral-400">→</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-4 w-4 rounded-full bg-white/20 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')] bg-cover" />
            Planora Events
          </span>
          <span className="text-neutral-400">→</span>
          <span>🔍</span>
        </div>

        {/* Heading with text-shadow glow for maximum readability against background */}
        <h1 
          style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.95), 0 8px 60px rgba(0, 0, 0, 0.85)' }}
          className="relative z-10 max-w-5xl text-4xl font-extrabold tracking-tight text-white leading-[1.12] sm:text-5xl md:text-6xl lg:text-[4.6rem] font-display"
        >
          Radiant <span className="font-cursive text-neutral-300 font-normal capitalize tracking-normal text-[1.05em] inline-block mr-1">Events</span>,<br />
          Seamless Organization <span className="font-cursive text-neutral-300 font-normal lowercase tracking-normal text-[1.05em] inline-block mr-1">easy!</span>
        </h1>

        {/* Subtitle */}
        <p 
          style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.95)' }}
          className="relative z-10 mt-8 max-w-2xl text-[15px] font-medium text-neutral-300 leading-relaxed font-sans"
        >
          Dive into the ultimate event management experience with Planora.<br />
          We specialize in helping workspaces and communities create vibrant, unforgettable happenings.
        </p>
      </section>



      {/* Sponsors & Partners Section featuring Accordion Gallery */}
      <section className="w-full bg-[#fbfbfb] relative z-10 py-16 border-t border-neutral-100/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 font-display">
              Backed by the people building the future
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Supported by visionary companies, innovation hubs, and community leaders worldwide.
            </p>
          </div>

          {/* Interactive Accordion Gallery Sponsor Showcase */}
          <div>
            <AccordionGallery
              items={[
                { 
                  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 
                  label: 'Vercel — Cloud Infrastructure', 
                  link: '#', 
                  alt: 'Vercel Infrastructure',
                  isSponsored: true
                },
                { 
                  image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', 
                  label: 'Stripe — Payment & Financial Ecosystem', 
                  link: '#', 
                  alt: 'Stripe Ecosystem',
                  isSponsored: true
                },
                { 
                  image: '', 
                  label: 'Available Sponsor Slot #1', 
                  alt: 'Available Sponsor Slot',
                  isSponsored: false,
                  onSponsorClick: () => window.location.href = 'mailto:sponsors@planora.events?subject=Sponsorship%20Inquiry%20Slot%201'
                },
                { 
                  image: '', 
                  label: 'Available Sponsor Slot #2', 
                  alt: 'Available Sponsor Slot',
                  isSponsored: false,
                  onSponsorClick: () => window.location.href = 'mailto:sponsors@planora.events?subject=Sponsorship%20Inquiry%20Slot%202'
                },
                { 
                  image: '', 
                  label: 'Available Sponsor Slot #3', 
                  alt: 'Available Sponsor Slot',
                  isSponsored: false,
                  onSponsorClick: () => window.location.href = 'mailto:sponsors@planora.events?subject=Sponsorship%20Inquiry%20Slot%203'
                }
              ]}
              defaultIndex={0}
              expandRatio={0.52}
              trigger="hover"
              height={460}
              radius={24}
              gap={12}
              grayscale={true}
              accentColor="#ffffff"
              overlayColor="#060010"
            />
          </div>
        </div>
      </section>

      {/* Interactive How It Works Stepper Section */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 bg-neutral-50/50 rounded-[2.5rem] my-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-display">Hosting in Four Simple Steps</h2>
          <p className="text-sm text-neutral-500 font-medium">Go from account setup to a live workspace event in under five minutes.</p>
        </div>

        <StepperHowItWorks />
      </section>

      {/* Feature Showcase */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-100/80">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 font-display leading-tight">
            Designed for Flawless Workspace Execution
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-xl mx-auto leading-relaxed">
            Everything you need to host internal meetups, community conferences, and team activities in one place.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-12 mt-16">
          
          {/* Bento Card 1: Large Dark Glass Hero Card (7 Cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-7 rounded-3xl bg-neutral-950 p-8 sm:p-10 text-white shadow-2xl border border-neutral-800 flex flex-col justify-between overflow-hidden relative"
          >
            <div className="space-y-4 relative z-10">
              <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Building2 size={20} />
              </div>
              <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">
                Multi-Tenant Workspace Scope
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
                Create and manage isolated environments for each team, community chapter, or company department under one global profile with scoped permissions.
              </p>
            </div>

            {/* Micro Widget: Workspace Selector Pill List */}
            <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3 relative z-10">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-white text-black font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Acme Corp Workshops</p>
                    <p className="text-[10px] text-neutral-400">12 Members • Active Scope</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white text-black font-mono">
                  Owner
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-neutral-800 text-white font-bold text-xs flex items-center justify-center">
                    D
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Dev Community Meetups</p>
                    <p className="text-[10px] text-neutral-400">48 Members</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300 font-mono">
                  Member
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 2: Light Clean Card (5 Cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-5 rounded-3xl bg-white p-8 sm:p-10 border border-neutral-200/90 shadow-sm flex flex-col justify-between hover:border-neutral-300 hover:shadow-xl transition-all"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center">
                <UserPlus size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-neutral-950 font-display tracking-tight">
                Instant Team Invites
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Invite workspace members directly by email to co-host events, edit schedules, and coordinate attendee guest lists seamlessly.
              </p>
            </div>

            {/* Micro Widget: Member List */}
            <div className="mt-8 pt-6 border-t border-neutral-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-neutral-700 font-semibold p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span>admin@planora.events</span>
                <span className="text-[10px] font-bold font-mono uppercase bg-neutral-950 text-white px-2 py-0.5 rounded-md">Owner</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span>alex.dev@acme.com</span>
                <span className="text-[10px] font-bold font-mono uppercase bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md">Member</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 3: Light Clean Card (5 Cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-5 rounded-3xl bg-white p-8 sm:p-10 border border-neutral-200/90 shadow-sm flex flex-col justify-between hover:border-neutral-300 hover:shadow-xl transition-all"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center">
                <Share2 size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-neutral-950 font-display tracking-tight">
                Unified Seat & RSVP Controls
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Define exact venue capacities, prevent overbooking, track confirmed attendees live, and manage ticket allocations.
              </p>
            </div>

            {/* Micro Widget: Capacity Meter */}
            <div className="mt-8 pt-6 border-t border-neutral-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-900">
                <span>Seat Allocation</span>
                <span className="font-mono">184 / 250 RSVPs</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-950 rounded-full w-3/4" />
              </div>
            </div>
          </motion.div>

          {/* Bento Card 4: Light Clean Card (7 Cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-7 rounded-3xl bg-white p-8 sm:p-10 border border-neutral-200/90 shadow-sm flex flex-col justify-between hover:border-neutral-300 hover:shadow-xl transition-all"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-display tracking-tight">
                Public & Private Visibility Scope
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Publish internal team syncs privately scoped to your workspace, or broadcast public events openly to the global landing page.
              </p>
            </div>

            {/* Micro Widget: Visibility Toggle Mockup */}
            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900">Event Publication State</p>
                <p className="text-[11px] text-neutral-400">Discoverable on landing page & workspace feed</p>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-full bg-neutral-950 text-white px-3 text-[10px] font-bold font-mono uppercase">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span>Published</span>
              </div>
            </div>
          </motion.div>

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
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20 border-t border-neutral-100/80 overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 font-display">
            Loved by Event Organizers
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-xl mx-auto">
            Hear from community builders who switched to Planora to coordinate their scheduling.
          </p>
        </div>

        {/* Continuous Unlimited Moving Marquee Reviews */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          {/* Left & Right Gradient Fade Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Marquee Motion Track */}
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              ease: 'linear',
              duration: 40,
              repeat: Infinity
            }}
          >
            {[
              {
                quote: "Planora solved our workspace scheduling immediately. We can switch between internal department activities and global meetups without any configuration overhead.",
                name: "Sarah Chen",
                role: "Tech Ops Lead at Acme Corp",
                initials: "SC"
              },
              {
                quote: "Switching between our local developer workspace and national events is seamless. Team invitations and simple free RSVPs have saved us hours of email coordination.",
                name: "David Miller",
                role: "Dev Community Organizer",
                initials: "DM"
              },
              {
                quote: "Clean design, fast RSVP, and zero ticketing clutter. Our student activities team coordinates fests with instant confirmations. Highly recommended.",
                name: "Dr. Marcus Vance",
                role: "Student Coordinator",
                initials: "MV"
              },
              {
                quote: "Having workspace-scoped permissions for 12 sub-teams was essential for us. Planora handled multi-tenancy effortlessly without security leaks.",
                name: "Elena Rostova",
                role: "VP of Engineering at CloudScale",
                initials: "ER"
              },
              {
                quote: "We host bi-weekly startup pitch nights. The live RSVP tracker and one-click shareable event links are absolute game changers for guest management.",
                name: "Priya Sharma",
                role: "Founder at FounderX Meetups",
                initials: "PS"
              },
              {
                quote: "Extremely sleek UI, zero clutter, and ultra-fast loading speed. Our community attendees love how effortless registering for events has become.",
                name: "Alex Rivera",
                role: "Community Director at DesignCraft",
                initials: "AR"
              },
              {
                quote: "Planora solved our workspace scheduling immediately. We can switch between internal department activities and global meetups without any configuration overhead.",
                name: "Sarah Chen",
                role: "Tech Ops Lead at Acme Corp",
                initials: "SC"
              },
              {
                quote: "Switching between our local developer workspace and national events is seamless. Team invitations and simple free RSVPs have saved us hours of email coordination.",
                name: "David Miller",
                role: "Dev Community Organizer",
                initials: "DM"
              },
              {
                quote: "Clean design, fast RSVP, and zero ticketing clutter. Our student activities team coordinates fests with instant confirmations. Highly recommended.",
                name: "Dr. Marcus Vance",
                role: "Student Coordinator",
                initials: "MV"
              },
              {
                quote: "Having workspace-scoped permissions for 12 sub-teams was essential for us. Planora handled multi-tenancy effortlessly without security leaks.",
                name: "Elena Rostova",
                role: "VP of Engineering at CloudScale",
                initials: "ER"
              },
              {
                quote: "We host bi-weekly startup pitch nights. The live RSVP tracker and one-click shareable event links are absolute game changers for guest management.",
                name: "Priya Sharma",
                role: "Founder at FounderX Meetups",
                initials: "PS"
              },
              {
                quote: "Extremely sleek UI, zero clutter, and ultra-fast loading speed. Our community attendees love how effortless registering for events has become.",
                name: "Alex Rivera",
                role: "Community Director at DesignCraft",
                initials: "AR"
              }
            ].map((review, idx) => (
              <div 
                key={idx}
                className="w-[360px] sm:w-[400px] shrink-0 rounded-3xl border border-neutral-200/90 bg-white p-7 shadow-sm hover:shadow-xl hover:border-neutral-400 transition-all duration-300 flex flex-col justify-between space-y-6 text-left"
              >
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium italic">
                  "{review.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                  <div className="h-9 w-9 rounded-full bg-neutral-950 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {review.initials}
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-neutral-950 font-display">{review.name}</h5>
                    <p className="text-[10px] text-neutral-400 font-medium">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing / FAQs target anchors for navigation - Light Glassmorphic Style */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 relative overflow-hidden bg-white/70 backdrop-blur-md rounded-[2.5rem] my-16 shadow-md border border-neutral-200/50 select-none">
        {/* Subtle monochrome glow effect */}
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-neutral-900/[0.02] blur-[100px] pointer-events-none" />
        
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
            <div className="rounded-3xl border border-neutral-200 bg-white/60 p-8 backdrop-blur-md text-left flex flex-col justify-between hover:border-neutral-400 hover:shadow-lg transition-all duration-300 relative group">
              <div>
                {/* Badge */}
                <div className="flex justify-start mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
                    🟢 Core Community
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-neutral-950 font-display">Free Events</h3>
                <p className="text-xs text-neutral-500 mt-1">For open meetups, community gatherings, or forums.</p>
                
                <ul className="text-xs text-neutral-600 mt-8 space-y-3.5 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> Unlimited RSVPs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> QR Code Check-ins
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> Workspace Isolation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> Public Event Feed
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
            <div className="rounded-3xl border-2 border-neutral-900 bg-white p-8 backdrop-blur-md text-left flex flex-col justify-between shadow-xl hover:border-neutral-950 transition-all duration-300 relative group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-neutral-950 text-[9px] font-black uppercase tracking-widest text-white px-3.5 py-1 rounded-full shadow-md z-20">
                Most Popular
              </div>
              <div>
                {/* Badge */}
                <div className="flex justify-start mb-4 mt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white">
                    ⭐ Commercial Access
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-neutral-950 font-display">Paid Tickets</h3>
                <p className="text-xs text-neutral-500 mt-1">Host concerts, sports fests, and workshops.</p>
                
                <ul className="text-xs text-neutral-600 mt-8 space-y-3.5 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> Stripe Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> Realtime Revenue Payouts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> Ticket Sales Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neutral-950 font-bold">✓</span> Secure Attendee Check-ins
                  </li>
                </ul>
              </div>
              
              <div className="mt-10 pt-6 border-t border-neutral-100 space-y-4">
                <div>
                  <div className="text-4xl font-black text-neutral-950 font-display">5%</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">commission per ticket</div>
                </div>
                
                <button className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer">
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
            <span className="font-black text-neutral-950 text-sm tracking-tight">Planora</span>
            <span className="font-medium text-neutral-400">Aesthetic planning. Seamless conversion.</span>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <Faq02 />

      {/* Unforgettable Event Panel Layout */}
      <section className="w-full bg-[#fbfbfb] relative z-10 py-24 border-t border-neutral-100/80">
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
                <li><Link to="/dashboard" className="text-neutral-500 hover:text-neutral-950 transition-colors py-0.5 inline-block font-medium">Workspace Events</Link></li>
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

          {/* Bottom Bar: Divider, Buy us a coffee, and All Rights Reserved */}
          <div className="flex flex-col items-center justify-center gap-4 mt-16 pt-8 border-t border-neutral-200/60 max-w-7xl mx-auto text-center">
            {/* Buy us a coffee pill */}
            <a 
              href="https://buymeacoffee.com/planora"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all pointer-events-auto leading-none"
            >
              <Coffee size={14} className="text-amber-600" />
              <span>Buy us a coffee</span>
            </a>

            {/* All rights reserved */}
            <p className="text-xs text-neutral-400 font-sans leading-none">
              © {new Date().getFullYear()} Planora. All rights reserved. Locally crafted for seamless communities.
            </p>
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
