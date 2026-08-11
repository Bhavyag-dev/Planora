import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, CheckCircle2, Users } from 'lucide-react';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || 'Received an unexpected response from the server.');
      }

      if (!res.ok) throw new Error(data?.message || 'Signup failed');

      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 md:p-6 lg:p-8 bg-[#f5f5f7] overflow-hidden font-sans antialiased text-neutral-900">
      {/* Full-Bleed Page Level Background Image with Glass Ambient Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img 
          src="/morning.png" 
          alt="Event Background" 
          className="w-full h-full object-cover opacity-[0.92] filter saturate-[1.15] contrast-[1.05]" 
        />
        {/* Subtle glass atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbfbfb]/20 via-transparent to-[#fbfbfb]/50" />
        
        {/* Soft Ambient glowing glass depth behind the card */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-orange-400/15 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-rose-400/15 blur-[150px]" />
      </div>

      {/* Main Glass Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[980px] bg-white/45 backdrop-blur-2xl border border-white/70 rounded-3xl md:rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden z-10"
      >
        <div className="grid lg:grid-cols-2 gap-0 min-h-[660px]">
          
          {/* Left Column - Create Account Form */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative z-10">
            <div className="w-full max-w-[380px] space-y-6">
              
              {/* Header */}
              <div className="text-left">
                <Link 
                  to="/" 
                  aria-label="Back to Home"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-neutral-600 hover:text-neutral-950 hover:bg-white/85 hover:scale-105 transition-all mb-6 shadow-xs group"
                >
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                </Link>
                <h1 className="text-[32px] font-black tracking-tight text-neutral-950 font-display leading-none">
                  Join Planora
                </h1>
                <p className="mt-2 text-neutral-550 text-sm font-medium">
                  Create your account to discover exciting events.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3.5 bg-white/40 backdrop-blur-xl border border-white/70 rounded-xl focus:bg-white/65 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 outline-none text-sm transition-all placeholder:text-neutral-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.02)] font-medium text-neutral-900"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 bg-white/40 backdrop-blur-xl border border-white/70 rounded-xl focus:bg-white/65 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 outline-none text-sm transition-all placeholder:text-neutral-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.02)] font-medium text-neutral-900"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3.5 bg-white/40 backdrop-blur-xl border border-white/70 rounded-xl focus:bg-white/65 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 outline-none text-sm transition-all placeholder:text-neutral-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.02)] font-medium text-neutral-900"
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md p-3 text-xs font-semibold text-red-700"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-11 mt-3 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white text-sm font-semibold rounded-xl tracking-[-0.01em] border border-neutral-800/80 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.16)] hover:from-neutral-800 hover:to-neutral-900 hover:border-neutral-700 hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.22)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <span>Create your account</span>
                      <ArrowLeft size={14} className="rotate-180 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account link */}
              <div className="text-center pt-2">
                <p className="text-sm text-neutral-500 font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-neutral-950 hover:underline transition-all">
                    Sign in
                  </Link>
                </p>
              </div>

            </div>
          </div>

          {/* Right Column - Image & Frosted Glass Brand Section */}
          <div className="relative hidden lg:block rounded-[2rem] m-3 overflow-hidden shadow-inner select-none border border-white/40">
            
            {/* Background Event Image */}
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
              alt="Planora Events Crowd"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.92] saturate-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Bottom Frosted Glass Overlay Card */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/65 backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl p-5 space-y-3">
              <p className="text-xs font-semibold text-neutral-800 leading-relaxed font-sans">
                Create unforgettable moments. Planora helps communities design and manage radiant, seamless happenings.
              </p>
              
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-white/70 backdrop-blur-md border border-white/80 rounded-lg text-[10px] font-bold text-neutral-700 shadow-xs">
                  <Sparkles size={10} className="text-amber-600" />
                  <span>Radiant</span>
                </div>
                
                <div className="flex items-center gap-1 px-2.5 py-1 bg-white/70 backdrop-blur-md border border-white/80 rounded-lg text-[10px] font-bold text-neutral-700 shadow-xs">
                  <CheckCircle2 size={10} className="text-emerald-600" />
                  <span>Seamless</span>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 bg-white/70 backdrop-blur-md border border-white/80 rounded-lg text-[10px] font-bold text-neutral-700 shadow-xs">
                  <Users size={10} className="text-indigo-600" />
                  <span>Community</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};
