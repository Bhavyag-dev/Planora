import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { formatDate, cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

interface Event {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  galleryImages?: string[];
  date: string;
  venue: string;
  category?: string;
  seatLimit: number;
  registeredCount: number;
}

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setLoading(false);
      });

    // Check if already registered
    if (isAuthenticated) {
      fetch('/api/registrations/my', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const isReg = data.some(reg => reg.event._id === id);
          setRegistered(isReg);
        }
      });
    }
  }, [id, isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    setError('');

    try {
      const res = await fetch('/api/registrations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ eventId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRegistered(true);
      setEvent(prev => prev ? { ...prev, registeredCount: prev.registeredCount + 1 } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="text-zinc-400 font-medium">Loading event details...</p>
      </div>
    </div>
  );
  
  if (!event) return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Event not found</h2>
      <p className="text-zinc-400">This event may have been removed or doesn't exist.</p>
    </div>
  );

  const isFull = event.registeredCount >= event.seatLimit;
  const fillPercent = Math.min(100, (event.registeredCount / event.seatLimit) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft size={16} />
        Back to events
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* LEFT: Event Info */}
        <div className="md:col-span-2 space-y-6">
          {event.coverImage && (
            <img src={event.coverImage} alt={event.title} className="h-72 w-full rounded-3xl border border-white/[0.08] object-cover" />
          )}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {event.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-400">
                <Sparkles size={12} /> {event.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{event.title}</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                  <Calendar size={16} className="text-purple-400" />
                </div>
                <span className="text-sm font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                  <MapPin size={16} className="text-pink-400" />
                </div>
                <span className="text-sm font-medium">{event.venue}</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">About this event</h3>
            <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
          {Array.isArray(event.galleryImages) && event.galleryImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Event Gallery</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {event.galleryImages.slice(0, 6).map((img, idx) => (
                  <img key={`${img}-${idx}`} src={img} className="h-44 w-full rounded-2xl border border-white/[0.08] object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Registration Card */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Availability</span>
                <span className={cn(
                  "text-sm font-bold",
                  isFull ? "text-red-400" : "text-emerald-400"
                )}>
                  {isFull ? "Sold Out" : `${event.seatLimit - event.registeredCount} seats left`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    fillPercent > 80 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 text-center">{event.registeredCount} / {event.seatLimit} registered</p>

              {registered ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                  <span className="font-bold text-emerald-400">You're registered!</span>
                  <Link to="/my-registrations" className="text-sm text-emerald-300 underline underline-offset-2 hover:text-emerald-200 transition-colors">View your ticket & QR code</Link>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={isFull || registering}
                  isLoading={registering}
                  onClick={handleRegister}
                >
                  {isFull ? "Sold Out" : "Register Now"}
                </Button>
              )}

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
          
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h4 className="font-semibold text-white mb-4">Event Info</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                  <Users size={14} className="text-indigo-400" />
                </div>
                Capacity: {event.seatLimit} people
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                </div>
                Instant confirmation
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                  <Clock size={14} className="text-amber-400" />
                </div>
                QR code entry pass
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
