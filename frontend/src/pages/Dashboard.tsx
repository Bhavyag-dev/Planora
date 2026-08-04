import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Globe, Sparkles, Ticket } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { user } = useAuth();

  const organizationName = useMemo(() => {
    const anyOrg = (user as any)?.organization;
    return anyOrg?.name || 'Your Workspace';
  }, [user]);

  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.14),transparent_55%)]" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-2 text-zinc-400">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Personal Dashboard</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-purple-300">{user?.name || 'User'}</span>
          </h1>
          <p className="mt-2 text-zinc-400">
            Prioritizing events from <span className="font-semibold text-zinc-200">{organizationName}</span>, with global discovery always available.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:from-indigo-500 hover:to-purple-500"
            >
              <Globe size={16} />
              Discover Global Events
            </Link>
            <Link
              to="/my-registrations"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.05]"
            >
              <Ticket size={16} className="text-emerald-400" />
              My Registrations
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <Calendar size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Workspace</p>
              <p className="text-sm font-semibold text-white">{organizationName}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            This dashboard will show your organization feed first (events, announcements), while you can still explore globally anytime.
          </p>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">What’s next</p>
          <h2 className="mt-2 text-xl font-bold text-white">Workspace-first experience + global discovery</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Next steps in this rebuild will wire in real multi-organization context, visibility rules, and a theme system—so this page becomes a true
            personalized hub instead of just a redirect target.
          </p>
        </div>
      </div>
    </div>
  );
}

