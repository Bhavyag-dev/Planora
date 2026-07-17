const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function configureApiRequests() {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return nativeFetch(`${apiBaseUrl}${input}`, init);
    }

    if (input instanceof URL && input.pathname.startsWith('/api/')) {
      return nativeFetch(`${apiBaseUrl}${input.pathname}${input.search}`, init);
    }

    return nativeFetch(input, init);
  }) as typeof window.fetch;
}
