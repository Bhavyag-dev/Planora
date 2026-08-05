import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const Login = () => {
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || 'Received an unexpected response from the server.');
      }

      if (!res.ok) throw new Error(data?.message || 'Login failed');

      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 md:p-6 lg:p-8 bg-[#fbfbfb] overflow-hidden font-sans antialiased text-neutral-900">
      {/* Full-Bleed Page Level Background Image */}
      <div className="absolute top-0 inset-x-0 h-screen z-0 overflow-hidden pointer-events-none select-none">
        <img 
          src="/morning.png" 
          alt="Event Background" 
          className="w-full h-full object-cover opacity-[0.85] filter saturate-[1.1] contrast-[1.02]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fbfbfb]/20 to-[#fbfbfb]/80" />
      </div>

      {/* Main Glass Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-[1000px] bg-white/80 backdrop-blur-xl border border-neutral-200/50 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
      >
        <div className="grid lg:grid-cols-2 gap-0 min-h-[700px]">
          
          {/* Left Column - Login Form */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-[380px] space-y-6">
              
              {/* Header */}
              <div className="text-left">
                <Link to="/" className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-950 transition-colors text-xs font-bold mb-6">
                  <ArrowLeft size={14} /> Back to Home
                </Link>
                <h1 className="text-[32px] font-black tracking-tight text-neutral-950 font-display leading-none">
                  Welcome back
                </h1>
                <p className="mt-2 text-neutral-500 text-sm">
                  Sign in to your Planora account to continue.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[48px] px-4 bg-white/50 border border-neutral-200/80 rounded-xl focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none text-[15px] transition-all placeholder:text-neutral-400"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button type="button" className="text-xs font-bold text-neutral-500 hover:text-neutral-950 hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[48px] px-4 bg-white/50 border border-neutral-200/80 rounded-xl focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none text-[15px] transition-all placeholder:text-neutral-400"
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-650"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[48px] mt-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl text-[15px] shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                  Sign In
                </button>
              </form>

              {/* Redirect to signup link */}
              <div className="text-center pt-2">
                <p className="text-sm text-neutral-500">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-bold text-neutral-950 hover:underline transition-all">
                    Create an account
                  </Link>
                </p>
              </div>

            </div>
          </div>

          {/* Right Column - Image & Brand Section */}
          <div className="relative hidden lg:block rounded-[2rem] m-4 overflow-hidden shadow-inner select-none">
            
            {/* Background Event Image */}
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
              alt="Planora Conference Stage"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.95]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />

            {/* Bottom Glass Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-100/50 shadow-xl p-5 space-y-3.5">
              <p className="text-xs font-semibold text-neutral-700 leading-relaxed">
                Connect and collaborate. Bring your community together with beautiful event scheduling and coordination tools.
              </p>
              
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-lg text-[10px] font-bold text-neutral-600">
                  <Sparkles size={10} className="text-neutral-500" />
                  <span>Interactive</span>
                </div>
                
                <div className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-lg text-[10px] font-bold text-neutral-600">
                  <CheckCircle2 size={10} className="text-neutral-500" />
                  <span>Productive</span>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-lg text-[10px] font-bold text-neutral-600">
                  <span>🚀</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};
