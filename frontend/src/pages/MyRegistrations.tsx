import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Zap } from 'lucide-react';
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

  if (loading) return (
    <div className="flex h-64 items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-zinc-400 font-medium">Loading your tickets...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 select-none text-white">
      {/* Header section with gradient line */}
      <div className="relative pb-6 border-b border-white/[0.06]">
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-purple-500 to-transparent" />
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          My <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Tickets</span>
        </h1>
        <p className="text-zinc-400">View and manage your registered event bookings</p>
      </div>

      {registrations.length > 0 ? (
        <div className="grid gap-8 2xl:grid-cols-2">
          {registrations.map((reg, index) => (
            <motion.div
              key={reg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/[0.06] bg-zinc-900/40 backdrop-blur-md shadow-2xl transition-all hover:bg-zinc-900/60 hover:shadow-purple-500/10 hover:border-white/[0.1]"
            >
              {/* Ticket (Event Info) */}
              <div className="flex flex-col flex-1 p-8 relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={60} />
                 </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                      Confirmed Entry
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-4">{reg.event.title}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                        <Calendar size={16} className="text-purple-400" />
                      </div>
                      <span className="font-medium">{formatDate(reg.event.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                        <MapPin size={16} className="text-pink-400" />
                      </div>
                      <span className="font-medium">{reg.event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/[0.06] pt-4 flex items-center justify-between text-xs text-zinc-500">
                  <span>Registered on: {new Date(reg.registeredAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-zinc-400">Order ID: #{reg._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01] p-16 text-center">
          <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
          <p className="text-zinc-400 max-w-sm mx-auto mb-6">
            You haven't registered for any events yet. Browse events and secure your spot today!
          </p>
        </div>
      )}
    </div>
  );
};
