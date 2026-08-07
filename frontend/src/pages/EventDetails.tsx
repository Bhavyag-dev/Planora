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
  date: string;
  venue: string;
  category?: string;
  seatLimit: number;
  registeredCount: number;
}

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
    <div className="flex h-64 items-center justify-center bg-transparent text-neutral-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-650 border-t-transparent" />
        <p className="text-neutral-500 font-medium text-sm">Loading event details...</p>
      </div>
    </div>
  );
  
  if (!event) return (
    <div className="flex h-64 flex-col items-center justify-center text-center bg-transparent text-neutral-900">
      <h2 className="text-2xl font-bold text-neutral-950 mb-2">Event not found</h2>
      <p className="text-neutral-500">This event may have been removed or doesn't exist.</p>
    </div>
  );

  const isFull = event.registeredCount >= event.seatLimit;
  const fillPercent = Math.min(100, (event.registeredCount / event.seatLimit) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 select-none text-neutral-900">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-neutral-550 hover:text-neutral-900 cursor-pointer">
        <ArrowLeft size={16} />
        Back to events
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* LEFT: Event Info */}
        <div className="md:col-span-2 space-y-6">
          {event.coverImage && (
            <img src={event.coverImage} alt={event.title} className="h-72 w-full rounded-3xl border border-neutral-200 object-cover" />
          )}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {event.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-655">
                <Sparkles size={12} /> {event.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 font-display">{event.title}</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2.5 text-neutral-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/50">
                  <Calendar size={16} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/50">
                  <MapPin size={16} className="text-pink-655" />
                </div>
                <span className="text-sm font-medium">{event.venue}</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold text-neutral-950 font-display">About this event</h3>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap text-sm">
              {event.description}
            </p>
          </div>
        </div>

        {/* RIGHT: Registration Card */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Availability</span>
                <span className={cn(
                  "text-sm font-bold",
                  isFull ? "text-red-650" : "text-emerald-650"
                )}>
                  {isFull ? "Sold Out" : `${event.seatLimit - event.registeredCount} seats left`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    fillPercent > 80 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-indigo-500 to-purple-600"
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              <p className="text-xs text-neutral-450 text-center">{event.registeredCount} / {event.seatLimit} registered</p>

              {registered ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-150 p-5 text-center">
                  <CheckCircle2 size={28} className="text-emerald-600" />
                  <span className="font-bold text-emerald-600">You're registered!</span>
                  <Link to="/my-registrations" className="text-sm text-emerald-600 underline underline-offset-2 hover:text-emerald-700 transition-colors font-semibold">View your tickets</Link>
                </div>
              ) : (
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white cursor-pointer" 
                  size="lg" 
                  disabled={isFull || registering}
                  isLoading={registering}
                  onClick={handleRegister}
                >
                  {isFull ? "Sold Out" : "Register Now"}
                </Button>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center text-sm text-red-655">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
          
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h4 className="font-semibold text-neutral-950 mb-4 font-display">Event Details</h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/50">
                  <Users size={14} className="text-indigo-600" />
                </div>
                <span>Capacity: {event.seatLimit} people</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/50">
                  <CheckCircle2 size={14} className="text-emerald-650" />
                </div>
                <span>Instant confirmation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
