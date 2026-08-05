import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AuthStatus, AuthUser } from './authTypes';
import { clearStoredSession, getStoredToken, getStoredUser, setStoredSession } from './authStorage';
import { getPostLoginRoute } from './postLoginRoute';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string, opts?: { redirectTo?: string }) => void;
  logout: (opts?: { redirectTo?: string }) => void;
  refreshFromStorage: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refreshFromStorage = useCallback(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setStatus('authenticated');
    } else {
      setToken(null);
      setUser(null);
      setStatus('anonymous');
    }
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  const login = useCallback(
    (nextUser: AuthUser, nextToken: string, opts?: { redirectTo?: string }) => {
      setStoredSession(nextUser, nextToken);
      setUser(nextUser);
      setToken(nextToken);
      setStatus('authenticated');

      const redirectTo = opts?.redirectTo ?? getPostLoginRoute(nextUser);
      navigate(redirectTo, { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(
    (opts?: { redirectTo?: string }) => {
      clearStoredSession();
      setUser(null);
      setToken(null);
      setStatus('anonymous');

      const redirectTo = opts?.redirectTo ?? '/';
      if (location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')) {
        return;
      }
      navigate(redirectTo, { replace: true });
    },
    [navigate, location.pathname],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, token, login, logout, refreshFromStorage }),
    [status, user, token, login, logout, refreshFromStorage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return {
    ...ctx,
    loading: ctx.status === 'loading',
    isAuthenticated: ctx.status === 'authenticated',
  };
}
