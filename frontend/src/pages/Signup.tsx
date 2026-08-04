import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'motion/react';
import { Zap, ArrowLeft } from 'lucide-react';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
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
        body: JSON.stringify({ name, email, password, role }),
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
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 overflow-hidden font-sans">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.15),transparent_50%)]" aria-hidden="true" />
      <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px]" aria-hidden="true" />
      <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-pink-500/10 blur-[150px]" aria-hidden="true" />
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group z-20">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.08] transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md p-8 z-10"
      >
        <div className="absolute inset-0 rounded-3xl bg-zinc-900/50 border border-white/[0.06] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]" aria-hidden="true" />
        
        <div className="relative space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                <Zap className="text-white" size={20} fill="currentColor" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-white mt-2">Join Planora</h1>
            <p className="mt-2 text-zinc-400 text-sm">Create your account to discover exciting events</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </motion.div>
            )}

            <Button type="submit" className="w-full mt-4" isLoading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
