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
      <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col h-screen sticky top-0 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <Zap className="text-white" size={16} fill="currentColor" />
            </div>
            <span className="text-xl text-neutral-900 font-display">Planora</span>
          </Link>
        </div>

        {/* Workspace Selector */}
        <div className="px-4 py-4 border-b border-neutral-200 relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800 hover:bg-neutral-100/60 transition-all focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-650 font-bold shrink-0">
                {activeWorkspace?.name?.charAt(0) || 'W'}
              </div>
              <span className="text-sm font-semibold truncate text-neutral-800">
                {activeWorkspace?.name || 'Create a Workspace'}
              </span>
            </div>
            <ChevronDown size={14} className="text-neutral-500 shrink-0" />
          </button>

          <AnimatePresence>
            {showOrgDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-4 right-4 mt-2 p-1.5 rounded-xl border border-neutral-200 bg-white shadow-2xl z-50 overflow-hidden"
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
                        "w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer",
                        activeWorkspace?._id === w._id ? "text-purple-655 font-bold bg-purple-50/50" : "text-neutral-600"
                      )}
                    >
                      <div className="h-5 w-5 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold">
                        {w.name.charAt(0)}
                      </div>
                      <span className="truncate">{w.name}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-neutral-150 mt-1.5 pt-1.5">
                  <button
                    onClick={() => {
                      setShowCreateModal(true);
                      setShowOrgDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-lg text-purple-655 hover:bg-purple-50/50 transition-all font-semibold cursor-pointer"
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
                    ? "bg-neutral-100/80 text-neutral-900 border border-neutral-200/30" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0 mr-3 transition-colors", isActive ? "text-purple-650" : "text-neutral-400 group-hover:text-purple-650")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Logout */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between text-neutral-500">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-neutral-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="p-1.5 rounded-lg hover:bg-neutral-50 text-neutral-500 hover:text-red-650 transition-colors cursor-pointer"
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
              className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-6 relative"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-xl font-bold text-neutral-950">Create Workspace</h3>
                <p className="text-sm text-neutral-500 mt-1">Setup a workspace for your team or organization.</p>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-0.5">Workspace Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp Workshops"
                    value={newOrgName}
                    onChange={e => setNewOrgName(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-neutral-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-neutral-800 text-sm transition-all placeholder:text-neutral-400"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-655 bg-red-50 border border-red-200 p-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full h-11 bg-neutral-950 text-white font-semibold rounded-xl text-sm transition-all hover:bg-neutral-800 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creating && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
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
