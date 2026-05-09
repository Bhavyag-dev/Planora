import { useMemo, useState } from 'react';
import { Globe, Palette, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { analyzeWebsiteTheme } from '../lib/themeAnalyzer';

export function ThemeLab() {
  const { isAuthenticated, user } = useAuth();

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  const canApply = useMemo(() => isAuthenticated && user?.role === 'college_admin', [isAuthenticated, user?.role]);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const payload = await analyzeWebsiteTheme(url.trim());
      setData(payload);
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const applyToMyCollege = async () => {
    if (!data?.suggested) return;
    setApplying(true);
    setError('');
    try {
      const res = await fetch('/api/theme/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ theme: data.suggested }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || 'Failed to apply theme');
    } catch (e: any) {
      setError(e?.message || 'Failed to apply theme');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_55%)]" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-2 text-zinc-400">
            <Palette size={14} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Theme Lab</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white">Analyze any college website theme</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Paste a website URL and get recommended primary/secondary colors + favicon hints. College admins can apply suggestions instantly.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input label="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://jecrcu.edu.in" />
            </div>
            <Button onClick={analyze} isLoading={loading} className="shrink-0 gap-2">
              <Globe size={16} />
              Analyze
            </Button>
          </div>

          {error && <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Suggested tokens</p>
                <p className="mt-1 text-sm text-zinc-400">{data.url}</p>
              </div>
              {canApply && (
                <Button onClick={applyToMyCollege} isLoading={applying} className="gap-2">
                  <Sparkles size={16} />
                  Apply to my college
                </Button>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Primary</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-xl border border-white/[0.1]" style={{ background: data.suggested.primaryColor }} />
                  <span className="font-mono text-sm text-zinc-200">{data.suggested.primaryColor}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Secondary</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-xl border border-white/[0.1]" style={{ background: data.suggested.secondaryColor }} />
                  <span className="font-mono text-sm text-zinc-200">{data.suggested.secondaryColor}</span>
                </div>
              </div>
            </div>

            {data.suggested.favicon && (
              <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Favicon</p>
                <div className="mt-2 flex items-center gap-3">
                  <img src={data.suggested.favicon} alt="favicon" className="h-8 w-8 rounded-lg border border-white/[0.1] bg-white" />
                  <span className="truncate text-sm text-zinc-300">{data.suggested.favicon}</span>
                </div>
              </div>
            )}

            {Array.isArray(data.palette) && data.palette.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Detected palette</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.palette.slice(0, 12).map((c: string) => (
                    <div key={c} className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-zinc-300">
                      <span className="h-3 w-3 rounded-full" style={{ background: c }} />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!canApply && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-zinc-400">
              Login as a <span className="font-semibold text-zinc-200">College Admin</span> to apply suggestions directly to your college theme.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

