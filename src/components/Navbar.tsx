import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';
import { Calendar, User as UserIcon, LogOut, LayoutDashboard, Zap } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-2xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5 group font-bold tracking-tight text-white">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110">
              <Zap className="text-white" size={16} fill="currentColor" />
            </div>
            <span className="text-xl text-white">Campus<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pulse</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:bg-white/5 hover:text-white">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white shadow-lg shadow-purple-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all border-0 ring-0">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-30 flex h-16 items-center border-b border-white/[0.06] bg-zinc-950/80 px-6 backdrop-blur-2xl relative">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-zinc-500">
            {user?.college?.name || 'Global Platform'}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-500/20">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </nav>
  );
};
