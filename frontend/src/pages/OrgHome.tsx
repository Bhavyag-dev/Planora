import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ExternalLink, Facebook, Instagram, Linkedin, MapPin, PlayCircle, Search } from 'lucide-react';

export function OrgHome() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/organizations/slug/${slug}`)
      .then(async (res) => {
        const payload = await res.json().catch(() => null);
        if (!res.ok) throw new Error(payload?.message || 'Unable to load organization');
        setData(payload);
      })
      .catch((e: any) => setError(e?.message || 'Unable to load organization'))
      .finally(() => setLoading(false));
  }, [slug]);

  const organization = data?.organization || {};
  const events = Array.isArray(data?.events) ? data.events : [];
  const theme = organization.theme || {};
  const gallery = Array.isArray(organization.galleryImages) ? organization.galleryImages : [];
  const stories = Array.isArray(organization.storyHighlights) ? organization.storyHighlights : [];
  const primary = theme.primaryColor || '#6366f1';
  const secondary = theme.secondaryColor || '#a855f7';
  const headerStyle = theme.headerStyle || 'glass';
  const heroTitle = theme.heroTitle || organization.name || 'Organization';
  const heroSubtitle = theme.heroSubtitle || organization.about || 'Discover updates and events.';
  const fontFamily =
    theme.typography?.trim() || "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";

  const socialItems = useMemo(
    () =>
      [
        { key: 'instagram', href: organization.socialLinks?.instagram, icon: Instagram, label: 'Instagram' },
        { key: 'facebook', href: organization.socialLinks?.facebook, icon: Facebook, label: 'Facebook' },
        { key: 'linkedin', href: organization.socialLinks?.linkedin, icon: Linkedin, label: 'LinkedIn' },
        { key: 'youtube', href: organization.socialLinks?.youtube, icon: PlayCircle, label: 'YouTube' },
      ].filter((x) => !!x.href),
    [organization.socialLinks],
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) {
      if (e?.category) set.add(e.category);
    }
    return ['All', ...Array.from(set)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event: any) => {
      const matchesQuery =
        !query.trim() ||
        event.title?.toLowerCase().includes(query.toLowerCase()) ||
        event.description?.toLowerCase().includes(query.toLowerCase()) ||
        event.venue?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [events, query, categoryFilter]);

  useEffect(() => {
    if (!organization?.name) return;
    const prevTitle = document.title;
    document.title = `${organization.name} | Organization Space`;
    const desc = (organization.about || heroSubtitle || '').slice(0, 160);
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    const prevDescription = meta.content;
    meta.content = desc || 'Explore organization events, stories, and highlights.';

    return () => {
      document.title = prevTitle;
      meta!.content = prevDescription;
    };
  }, [organization?.name, organization?.about, heroSubtitle]);

  if (loading) return <div className="p-10 text-zinc-400">Loading organization page...</div>;
  if (error) return <div className="p-10 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily }}>
      <div
        className="relative border-b border-white/[0.06]"
        style={{
          background:
            headerStyle === 'classic'
              ? `linear-gradient(135deg, ${primary}22 0%, ${secondary}22 100%)`
              : headerStyle === 'minimal'
                ? '#0a0a0a'
                : `radial-gradient(ellipse at top, ${primary}33 0%, transparent 60%), radial-gradient(ellipse at right, ${secondary}24 0%, transparent 50%)`,
        }}
      >
        {theme.heroBanner && (
          <img src={theme.heroBanner} alt="hero banner" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-zinc-950" />
        <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-4">
                {organization.logo ? (
                  <img src={organization.logo} alt={organization.name} className="h-16 w-16 rounded-2xl border border-white/[0.2] bg-white object-contain p-1 shadow-xl" />
                ) : (
                  <div className="h-16 w-16 rounded-2xl border border-white/[0.2] bg-white/[0.05]" />
                )}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">Organization Space</p>
                  <p className="text-sm font-semibold text-zinc-300">{organization.slug ? `/org/${organization.slug}` : 'Public Profile'}</p>
                </div>
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl" style={{ color: '#fff' }}>
                {heroTitle}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 md:text-base">{heroSubtitle}</p>
              {organization.address && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-black/30 px-3 py-1 text-xs text-zinc-300">
                  <MapPin size={12} /> {organization.address}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/events"
                className="rounded-xl border border-white/[0.2] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/[0.1]"
              >
                Explore all events
              </Link>
              {organization.socialLinks?.website && (
                <a
                  href={organization.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.2] px-4 py-2 text-sm text-zinc-200 hover:bg-white/[0.07]"
                >
                  Website <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${primary}33`, color: primary }}>
              Primary {primary}
            </span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${secondary}33`, color: secondary }}>
              Secondary {secondary}
            </span>
            <span className="rounded-full border border-white/[0.1] px-3 py-1 text-xs font-semibold text-zinc-300">
              {events.length} Published events
            </span>
            {socialItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/[0.2] bg-black/20 p-2 text-zinc-300 transition-all hover:bg-white/[0.07] hover:text-white"
                  title={item.label}
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <div className="sticky top-0 z-20 -mx-6 border-y border-white/[0.06] bg-zinc-950/85 px-6 py-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { id: 'about', label: 'About' },
              { id: 'stories', label: 'Stories' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'events', label: 'Events' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full border border-white/[0.1] px-3 py-1 text-zinc-300 transition hover:bg-white/[0.08]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {organization.about && (
          <section id="about" className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-2 whitespace-pre-wrap text-zinc-400">{organization.about}</p>
          </section>
        )}

        {stories.length > 0 && (
          <section id="stories">
            <h2 className="text-xl font-semibold">Stories / Highlights</h2>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {stories.map((img: string, idx: number) => (
                <div key={`${img}-${idx}`} className="group relative">
                  <img src={img} className="h-24 w-24 rounded-2xl border border-white/[0.12] object-cover shadow-lg" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/0 transition group-hover:ring-white/30" />
                </div>
              ))}
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section id="gallery">
            <h2 className="text-xl font-semibold">Workspace Gallery</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {gallery.map((img: string, idx: number) => (
                <img key={`${img}-${idx}`} src={img} className="h-48 w-full rounded-2xl border border-white/[0.1] object-cover" />
              ))}
            </div>
          </section>
        )}

        <section id="events">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <div className="mt-4 grid gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events by title, venue, description..."
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-10 pr-3 text-sm text-white outline-none focus:border-white/[0.18]"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-white outline-none focus:border-white/[0.18]"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-zinc-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {filteredEvents.map((event: any) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.04] hover:shadow-2xl"
              >
                {event.coverImage ? (
                  <img src={event.coverImage} className="mb-3 h-44 w-full rounded-xl border border-white/[0.08] object-cover" />
                ) : (
                  <div
                    className="mb-3 h-44 w-full rounded-xl border border-white/[0.08]"
                    style={{ background: `linear-gradient(135deg, ${primary}33 0%, ${secondary}33 100%)` }}
                  />
                )}
                <h3 className="font-semibold text-white group-hover:text-zinc-100">{event.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{event.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1"><Calendar size={12} /> {new Date(event.date).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {event.venue}</span>
                </div>
              </Link>
            ))}
            {filteredEvents.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.01] p-8 text-center text-zinc-500 md:col-span-2">
                No published events yet. Organization admin can create and publish events from Events panel.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

