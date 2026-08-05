import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface WorkspaceMember {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: 'owner' | 'member';
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  members: WorkspaceMember[];
}

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  refreshWorkspaces: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, slug?: string) => Promise<Workspace>;
  inviteMember: (email: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(
    localStorage.getItem('activeWorkspaceId')
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkspaces = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setWorkspaces([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/organizations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setWorkspaces(data);
        
        // Auto-select first workspace if none or invalid is active
        if (data.length > 0) {
          const currentExists = data.some(w => w._id === activeWorkspaceId);
          if (!activeWorkspaceId || !currentExists) {
            const defaultId = data[0]._id;
            setActiveWorkspaceId(defaultId);
            localStorage.setItem('activeWorkspaceId', defaultId);
          }
        } else {
          setActiveWorkspaceId(null);
          localStorage.removeItem('activeWorkspaceId');
        }
      } else {
        setError(data.message || 'Failed to load workspaces');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, activeWorkspaceId]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWorkspaces();
    } else {
      setWorkspaces([]);
      setActiveWorkspaceId(null);
      localStorage.removeItem('activeWorkspaceId');
    }
  }, [isAuthenticated]);

  const activeWorkspace = useMemo(() => {
    return workspaces.find(w => w._id === activeWorkspaceId) || null;
  }, [workspaces, activeWorkspaceId]);

  const switchWorkspace = useCallback((id: string) => {
    setActiveWorkspaceId(id);
    localStorage.setItem('activeWorkspaceId', id);
  }, []);

  const createWorkspace = useCallback(async (name: string, slug?: string) => {
    if (!token) throw new Error('Unauthenticated');
    const res = await fetch('/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, slug })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create workspace');
    
    // Switch to new workspace
    setActiveWorkspaceId(data._id);
    localStorage.setItem('activeWorkspaceId', data._id);
    
    // Reload workspace list
    const updatedRes = await fetch('/api/organizations', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedData = await updatedRes.json();
    if (updatedRes.ok && Array.isArray(updatedData)) {
      setWorkspaces(updatedData);
    }
    
    return data as Workspace;
  }, [token]);

  const inviteMember = useCallback(async (email: string) => {
    if (!token || !activeWorkspaceId) throw new Error('Workspace active context is missing');
    const res = await fetch(`/api/organizations/${activeWorkspaceId}/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invitation failed');
    
    // Refresh workspace details to show new member
    await refreshWorkspaces();
  }, [token, activeWorkspaceId, refreshWorkspaces]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspaces,
      activeWorkspace,
      loading,
      error,
      refreshWorkspaces,
      switchWorkspace,
      createWorkspace,
      inviteMember
    }),
    [workspaces, activeWorkspace, loading, error, refreshWorkspaces, switchWorkspace, createWorkspace, inviteMember]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return ctx;
}
