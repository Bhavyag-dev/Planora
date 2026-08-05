import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  Plus,
  Zap,
  Building2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const { workspaces, activeWorkspace, switchWorkspace, createWorkspace } = useWorkspace();
  const location = useLocation();
  const currentPath = location.pathname;

  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard'
    },
    { 
      title: 'Events Feed', 
      icon: Calendar, 
      path: '/events'
    },
    { 
      title: 'My Tickets', 
      icon: Users, 
      path: '/my-registrations'
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      path: '/settings'
    }
  ];

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setCreating(true);
    setError('');
    try {
      await createWorkspace(newOrgName);
      setNewOrgName('');
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <aside className="w-64 border-r border-white/[0.06] bg-zinc-950 flex flex-col h-screen sticky top-0 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <Zap className="text-white" size={16} fill="currentColor" />
            </div>
            <span className="text-xl text-white font-display">Planora</span>
          </Link>
        </div>

        {/* Workspace Selector */}
        <div className="px-4 py-4 border-b border-white/[0.06] relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white hover:bg-white/[0.06] transition-all focus:outline-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold shrink-0">
                {activeWorkspace?.name?.charAt(0) || 'W'}
              </div>
              <span className="text-sm font-semibold truncate text-zinc-100">
                {activeWorkspace?.name || 'Create a Workspace'}
              </span>
            </div>
            <ChevronDown size={14} className="text-zinc-400 shrink-0" />
          </button>

          <AnimatePresence>
            {showOrgDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-4 right-4 mt-2 p-1.5 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl z-50 overflow-hidden"
              >
                <div className="max-h-48 overflow-y-auto no-scrollbar space-y-0.5">
                  {workspaces.map(w => (
                    <button
                      key={w._id}
                      onClick={() => {
                        switchWorkspace(w._id);
                        setShowOrgDropdown(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-lg hover:bg-white/5 transition-colors",
                        activeWorkspace?._id === w._id ? "text-purple-400 font-bold bg-white/[0.03]" : "text-zinc-300"
                      )}
                    >
                      <div className="h-5 w-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                        {w.name.charAt(0)}
                      </div>
                      <span className="truncate">{w.name}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/[0.06] mt-1.5 pt-1.5">
                  <button
                    onClick={() => {
                      setShowCreateModal(true);
                      setShowOrgDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-lg text-purple-300 hover:bg-purple-500/10 hover:text-white transition-all font-semibold"
                  >
                    <Plus size={14} />
                    <span>Create Workspace</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.title}
                to={item.path}
                className={cn(
                  "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive 
                    ? "bg-white/[0.06] text-white border border-white/[0.04]" 
                    : "text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0 mr-3 transition-colors", isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-purple-400")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Logout */}
        <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>

      </aside>

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-zinc-900 p-6 shadow-2xl space-y-6 relative"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-xl font-bold text-white">Create Workspace</h3>
                <p className="text-sm text-zinc-400 mt-1">Setup a workspace for your team or organization.</p>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Workspace Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp Workshops"
                    value={newOrgName}
                    onChange={e => setNewOrgName(e.target.value)}
                    className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:border-white focus:ring-1 focus:ring-white outline-none text-white text-sm transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full h-11 bg-white text-black font-semibold rounded-xl text-sm transition-all hover:bg-zinc-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creating && <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />}
                  Create Workspace
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
