import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../context/WorkspaceContext';
import { Button } from './Button';
import { LogOut, Zap } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-2xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-[27px] font-black tracking-tighter text-neutral-950 font-display flex items-baseline leading-none">
              Planora
              <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-none ml-0.5 shrink-0" />
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900">Login</Button>
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
    <nav className="sticky top-0 z-30 flex h-16 items-center border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-2xl relative">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-neutral-700">
            {activeWorkspace?.name || 'Workspace Dashboard'}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-transform hover:scale-105 cursor-pointer"
            >
              {user?.name?.charAt(0) || 'U'}
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white border border-neutral-200 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                <div className="p-1">
                  <div className="px-3 py-2 text-xs text-neutral-450 border-b border-neutral-100 mb-1">
                    Logged in as <span className="font-semibold text-neutral-850">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-655 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
