function normalizeUrl(input: string) {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

function extractThemeColor(html: string) {
  const metaRegex = /<meta[^>]+name=["']theme-color["'][^>]*content=["']([^"']+)["'][^>]*>/i;
  const match = html.match(metaRegex);
  const color = match?.[1]?.trim();
  return color && color.startsWith('#') ? color : '';
}

function extractFavicon(html: string, baseUrl: string) {
  const linkRegex =
    /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const match = linkRegex.exec(html);
  const href = match?.[1];
  if (!href) return '';
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function pickTopColors(hexes: string[]) {
  const counts = new Map<string, number>();
  for (const h of hexes) {
    const key = h.toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([hex]) => hex);

  const neutral = new Set(['#ffffff', '#000000', '#111111', '#1a1a1a', '#eeeeee', '#f5f5f5', '#fefefe']);
  const filtered = sorted.filter((h) => !neutral.has(h.toLowerCase()));

  return {
    primary: filtered[0] || sorted[0] || '#6366f1',
    secondary: filtered[1] || sorted[1] || '#a855f7',
    palette: sorted.slice(0, 12),
  };
}

export async function analyzeWebsiteTheme(urlInput: string) {
  const url = normalizeUrl(urlInput);
  if (!url) throw new Error('URL is required');

  // Client-side fetch via text proxy to avoid CORS + mixed TLS issues
  const proxyUrl = `https://r.jina.ai/${url}`;
  const resp = await fetch(proxyUrl, { method: 'GET' });
  if (!resp.ok) throw new Error(`Unable to fetch website (status ${resp.status})`);
  const html = await resp.text();

  const themeColor = extractThemeColor(html);
  const favicon = extractFavicon(html, url);
  const hexMatches = html.match(/#[0-9a-fA-F]{6}\b/g) || [];
  const colors = pickTopColors(hexMatches);

  const primary = themeColor || colors.primary;
  const secondary = colors.secondary;

  return {
    url,
    suggested: {
      primaryColor: primary,
      secondaryColor: secondary,
      favicon,
      heroBanner: '',
      typography: '',
      headerStyle: 'glass',
      heroTitle: '',
      heroSubtitle: '',
    },
    palette: colors.palette,
    notes: [
      themeColor ? 'Primary color derived from meta theme-color.' : 'Primary color derived from dominant CSS hex colors.',
      favicon ? 'Favicon detected from link rel=icon.' : 'Favicon not detected.',
      'Fetched via client-side proxy.',
    ],
  };
}

