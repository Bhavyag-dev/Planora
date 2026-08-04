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
  CheckCircle2
} from 'lucide-react';

export function Landing() {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [langDropdown, setLangDropdown] = useState(false);
  const [planningDropdown, setPlanningDropdown] = useState(false);
  const [partiesDropdown, setPartiesDropdown] = useState(false);

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

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      alt: 'Refreshing summer drinks'
    },
    {
      url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80',
      alt: 'Watermelon on beach towel'
    },
    {
      url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80',
      alt: 'Raising glasses'
    },
    {
      url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80',
      alt: 'Pool party floating'
    },
    {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      alt: 'Surfboards on tropical beach'
    },
    {
      url: 'https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=600&q=80',
      alt: 'Ice cream sprinkle cone'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-neutral-900 font-sans antialiased selection:bg-neutral-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#fbfbfb]/85 backdrop-blur-md border-b border-neutral-100/60 transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-neutral-900 font-display">
              Sumip
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors">
              Home
            </Link>
            
            {/* Planning Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setPlanningDropdown(!planningDropdown);
                  setPartiesDropdown(false);
                }}
                className="flex items-center gap-1 text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none"
              >
                Planning <ChevronDown size={14} className={`transition-transform duration-200 ${planningDropdown ? 'rotate-180' : ''}`} />
              </button>
              {planningDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl border border-neutral-100 bg-white p-2 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Link to="/events" className="block rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950">
                    Browse All Events
                  </Link>
                  <Link to="/signup" className="block rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950">
                    Create Organizer Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Summer-Parties Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setPartiesDropdown(!partiesDropdown);
                  setPlanningDropdown(false);
                }}
                className="flex items-center gap-1 text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none"
              >
                Summer-Parties <ChevronDown size={14} className={`transition-transform duration-200 ${partiesDropdown ? 'rotate-180' : ''}`} />
              </button>
              {partiesDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl border border-neutral-100 bg-white p-2 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Link to="/events?cat=Meetup" className="block rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950">
                    Pool Meetups
                  </Link>
                  <Link to="/events?cat=Workshop" className="block rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950">
                    Summer Workshops
                  </Link>
                </div>
              )}
            </div>

            <a href="#pricing" className="text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors">
              Pricing
            </a>
            <a href="#faqs" className="text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors">
              FAQs
            </a>
          </nav>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-950 transition-colors focus:outline-none"
              >
                <Globe size={15} />
                <span>English</span>
              </button>
              {langDropdown && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl border border-neutral-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 animate-in fade-in duration-200">
                  <button className="w-full text-left rounded-lg px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 font-medium">English</button>
                  <button className="w-full text-left rounded-lg px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 font-medium">Español</button>
                </div>
              )}
            </div>

            {/* Auth Button */}
            {isAuthenticated && user ? (
              <Link
                to={user.role === 'super_admin' || user.role === 'admin' ? '/super-admin' : user.role === 'org_admin' ? '/org-admin' : '/dashboard'}
                className="rounded-full bg-neutral-950 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors duration-200 shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-neutral-950 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors duration-200 shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-20 pb-16 text-center px-6 overflow-hidden">
        {/* Central Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white px-4 py-1.5 text-[11px] font-semibold text-neutral-700 shadow-sm hover:border-neutral-300 transition-colors duration-300 select-none">
          <span>🥤</span>
          <span className="text-neutral-400">→</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-4 w-4 rounded-full bg-neutral-100 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')] bg-cover" />
            Brightness-dreams
          </span>
          <span className="text-neutral-400">→</span>
          <span>🔍</span>
        </div>

        {/* Heading */}
        <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-neutral-950 leading-[1.08] sm:text-6xl md:text-7xl lg:text-[5.4rem] font-display">
          Radiant Revelries,<br />
          Sparkling Summer Parties Easy!
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-2xl text-[15px] font-medium text-neutral-500 leading-relaxed font-sans">
          Dive into the ultimate summer party experience with SumipSplash<br />
          Celebrations! We specialize in creating vibrant, unforgettable events.
        </p>

        {/* CTA Button */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            to="/events"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-4 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors duration-200 shadow-md"
          >
            Get Started
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 select-none mt-1">
            🍁 Pause or cancel service anytime.
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

      {/* Summer Gallery Showcase */}
      <section className="w-full px-6 pt-16 pb-12 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x no-scrollbar">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-72 h-96 rounded-[2rem] overflow-hidden snap-center shadow-sm border border-neutral-100 group cursor-pointer"
              >
                <img 
                  src={img.url} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Live Events Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
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
              Ready to host your own summer parties? Register or login to create events.
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

      {/* Features / Marketing Pitch */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-neutral-100/80">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white font-bold">
              1
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-neutral-900">Vibrant Party Templates</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                Customize your summer workspace with beautiful theme variations, custom colors, and highlights.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-neutral-900">Smart QR Checks</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                Instant attendee check-in with high-security auto-generated QR code cards.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-neutral-900">Flexible Ticket Rules</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                Supports free or premium paid ticket registrations using Stripe payouts and dashboard reports.
              </p>
            </div>
          </div>
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
                <p className="text-xs text-neutral-400 mt-1">For open meetups, community gatherings, or picnics.</p>
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
                <p className="text-xs text-neutral-300 mt-1">Host concerts, pool fests, and workshops.</p>
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

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-400 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-lg font-extrabold text-white font-display">Sumip</span>
            <p className="text-xs text-neutral-500 mt-1">© {new Date().getFullYear()} SumipSplash. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs font-semibold">
            <Link to="/events" className="hover:text-white transition-colors">Explore Parties</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Start Hosting</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
