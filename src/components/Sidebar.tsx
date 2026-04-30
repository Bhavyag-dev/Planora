import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  History,
  ShieldCheck,
  QrCode,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const [isOpen, setIsOpen] = React.useState(true);

  const menuItems = [
    { 
      title: 'Overview', 
      icon: LayoutDashboard, 
      path: user?.role === 'super_admin' || user?.role === 'admin' ? '/super-admin?tab=overview' : 
            user?.role === 'college_admin' ? '/college-admin' : 
            user?.role === 'dept_admin' ? '/dept-admin' : '/events',
      roles: ['super_admin', 'college_admin', 'dept_admin', 'admin']
    },
    { 
      title: 'Colleges', 
      icon: Building2, 
      path: '/super-admin?tab=colleges',
      roles: ['super_admin', 'admin']
    },
    { 
      title: 'Users', 
      icon: Users, 
      path: '/super-admin?tab=users',
      roles: ['super_admin', 'admin']
    },
    { 
      title: 'Global Events', 
      icon: Calendar, 
      path: '/super-admin?tab=events',
      roles: ['super_admin', 'admin']
    },
    { 
      title: 'Payments', 
      icon: CreditCard, 
      path: '/super-admin?tab=payments',
      roles: ['super_admin', 'admin']
    },
    { 
      title: 'Audit Logs', 
      icon: History, 
      path: '/super-admin?tab=logs',
      roles: ['super_admin', 'admin']
    },
    { 
      title: 'Events', 
      icon: Calendar, 
      path: '/events',
      roles: ['college_admin', 'dept_admin', 'student']
    },
    { 
      title: 'Departments', 
      icon: Building2, 
      path: '/college-admin/departments',
      roles: ['college_admin']
    },
    { 
      title: 'My Registrations', 
      icon: Users, 
      path: '/my-registrations',
      roles: ['student']
    },
    { 
      title: 'Check-in', 
      icon: QrCode, 
      path: '/check-in',
      roles: ['super_admin', 'admin', 'college_admin', 'dept_admin']
    },
    { 
      title: 'Platform Settings', 
      icon: Settings, 
      path: '/super-admin?tab=settings',
      roles: ['super_admin', 'admin']
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      path: '/settings',
      roles: ['college_admin', 'dept_admin', 'student']
    },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || ''));
  const platformItems = filteredItems.filter(item => item.path.startsWith('/super-admin'));
  const generalItems = filteredItems.filter(item => !item.path.startsWith('/super-admin'));

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 80 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl transition-all duration-300 ease-in-out lg:sticky",
          !isOpen && "hidden lg:flex lg:flex-col",
          className
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110">
              <Zap className="text-white" size={16} fill="currentColor" />
            </div>
            {isOpen && <span className="text-xl text-white">Campus<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pulse</span></span>}
          </Link>
        </div>

        <nav className="flex-1 space-y-6 px-3 py-4">
          {platformItems.length > 0 && (
            <div className="space-y-1">
              {isOpen && (
                <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Platform Command
                </div>
              )}
              {platformItems.map((item) => {
                const isActive = currentPath === item.path || 
                               (item.path === '/super-admin?tab=overview' && currentPath === '/super-admin') ||
                               (item.path === '/super-admin?tab=overview' && currentPath === '/super-admin/') ||
                               (currentPath.startsWith('/super-admin') && item.path.startsWith('/super-admin') && currentPath.includes(item.path.split('?')[1]));
                
                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-white/[0.08] text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/[0.05]" 
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-purple-400")} />
                    {isOpen && (
                      <span className="ml-3 flex-1">{item.title}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {generalItems.length > 0 && (
            <div className="space-y-1">
              {isOpen && platformItems.length > 0 && (
                <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  User Space
                </div>
              )}
              {generalItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-white/[0.08] text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/[0.05]" 
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-purple-400")} />
                    {isOpen && (
                      <span className="ml-3 flex-1">{item.title}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/20">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                <p className="truncate text-xs text-zinc-500 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            )}
            {isOpen && (
              <button onClick={logout} className="text-zinc-500 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
