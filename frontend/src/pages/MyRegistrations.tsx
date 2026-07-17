import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QrCode, Calendar, MapPin, Zap, ExternalLink } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

interface Registration {
  _id: string;
  qrCode: string;
  attended: boolean;
  event: {
    _id: string;
    title: string;
    date: string;
    venue: string;
  };
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
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-zinc-400 font-medium">Loading your tickets...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header section with gradient line */}
      <div className="relative pb-6 border-b border-white/[0.06]">
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-purple-500 to-transparent" />
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">My <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Tickets</span></h1>
        <p className="text-zinc-400">Manage your event passes and prepare for check-in</p>
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
              {/* Ticket Left Side (Event Info) */}
              <div className="flex flex-col flex-1 p-8 relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={60} />
                 </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border",
                      reg.attended 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    )}>
                      {reg.attended ? "Checked In" : "Valid Entry Pass"}
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
                
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-mono bg-white/[0.05] px-2 py-1 rounded">ID: {reg._id.slice(-8).toUpperCase()}</span>
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    View Details <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Ticket Perforation / Separator */}
              <div className="relative hidden md:flex flex-col items-center border-l-2 border-dashed border-white/[0.1] my-4">
                <div className="absolute -top-6 h-4 w-4 rounded-full bg-zinc-950 shadow-inner" />
                <div className="absolute -bottom-6 h-4 w-4 rounded-full bg-zinc-950 shadow-inner" />
              </div>

              {/* Ticket Right Side (QR Code & Status) */}
              <div className="flex flex-col items-center justify-center bg-white/[0.02] p-8 md:w-64 border-t md:border-t-0 border-white/[0.06]">
                <div className="relative group/qr">
                   {/* QR Code Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl opacity-20 blur-lg transition-opacity group-hover/qr:opacity-40" />
                  
                  <div className="relative rounded-xl border border-white/[0.1] bg-white p-3 shadow-xl">
                    <img 
                      src={reg.qrCode} 
                      alt="Check-in QR Code" 
                      className="h-32 w-32 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">
                    Scan at entrance
                  </span>
                  <span className={cn("text-xs font-medium", reg.attended ? "text-zinc-500" : "text-green-400")}>
                    {reg.attended ? 'Code Scanned' : 'Ready to Scan'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01] p-16 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.03] mb-6">
            <QrCode className="text-zinc-500" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No tickets yet</h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-8">
            You haven't registered for any events. Browse the upcoming campus activities and secure your spot!
          </p>
          <a href="/events" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200">
            Browse Events
          </a>
        </motion.div>
      )}
    </div>
  );
};
