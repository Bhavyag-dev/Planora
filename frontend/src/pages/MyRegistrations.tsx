import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Zap, Trash2 } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface Registration {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: string;
    venue: string;
  };
  registeredAt: string;
}

export const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registrations/my', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      setRegistrations(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => {
      setRegistrations([]);
      setLoading(false);
    });
  }, []);

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to cancel this ticket registration?')) return;
    try {
      const res = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setRegistrations(prev => prev.filter(r => r._id !== registrationId));
      }
    } catch (err) {
      console.error('Failed to cancel ticket:', err);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center bg-transparent text-neutral-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-650 border-t-transparent" />
        <p className="text-neutral-500 font-medium text-sm">Loading your tickets...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 select-none text-neutral-900">
      {/* Header section with gradient line */}
      <div className="relative pb-6 border-b border-neutral-200">
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-purple-500 to-transparent" />
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-2">
          My <span className="bg-gradient-to-r from-purple-650 to-pink-500 bg-clip-text text-transparent">Tickets</span>
        </h1>
        <p className="text-neutral-500 text-sm">View and manage your registered event bookings</p>
      </div>

      {registrations.length > 0 ? (
        <div className="grid gap-8 2xl:grid-cols-2">
          {registrations.map((reg, index) => (
            <motion.div
              key={reg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xs hover:border-neutral-300 transition-all duration-300"
            >
              {/* Ticket (Event Info) */}
              <div className="flex flex-col flex-1 p-8 relative">
                 <div className="absolute top-0 right-0 p-4 opacity-5 text-neutral-950 pointer-events-none">
                    <Zap size={60} />
                 </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border bg-emerald-50 text-emerald-600 border-emerald-150">
                      Confirmed Entry
                    </span>
                    <button
                      onClick={() => handleCancelRegistration(reg._id)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-neutral-500 hover:text-red-600 hover:bg-red-50 border border-neutral-200 rounded-full transition-colors cursor-pointer"
                      title="Cancel Ticket Registration"
                    >
                      <Trash2 size={13} />
                      <span>Cancel Ticket</span>
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-neutral-950 tracking-tight mb-4">{reg.event.title}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/50">
                        <Calendar size={16} className="text-purple-600" />
                      </div>
                      <span className="font-semibold">{formatDate(reg.event.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/50">
                        <MapPin size={16} className="text-pink-650" />
                      </div>
                      <span className="font-semibold">{reg.event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-neutral-100 pt-4 flex items-center justify-between text-xs text-neutral-450">
                  <span>Registered on: {new Date(reg.registeredAt).toLocaleDateString()}</span>
                  <span className="font-bold text-neutral-600">Order ID: #{reg._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 p-16 text-center bg-white shadow-xs">
          <h3 className="text-xl font-bold text-neutral-900 mb-1">No tickets found</h3>
          <p className="text-xs text-neutral-550 max-w-sm mx-auto mb-6">
            You haven't registered for any events yet. Browse events and secure your spot today!
          </p>
        </div>
      )}
    </div>
  );
};
