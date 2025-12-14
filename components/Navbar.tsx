import React from 'react';
import { ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import { User, Role } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPage }) => {
  return (
    <nav className="w-full bg-slate-900/50 backdrop-blur-lg border-b border-purple-900/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => user ? onNavigate('user-home') : onNavigate('landing')}
          >
            <ShieldCheck className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
              KycVault
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <button 
                  onClick={() => onNavigate('landing')}
                  className={`text-sm font-medium transition-colors ${currentPage === 'landing' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                >
                  Login
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 px-3 py-1.5 rounded-full transition-all"
                  onClick={() => onNavigate('profile')}
                  title="View Profile"
                >
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{user.username}</span>
                    <span className="text-xs text-purple-400 uppercase tracking-wider">{user.role}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:border-purple-400 transition-colors">
                     <UserIcon size={16} className="text-purple-300 group-hover:text-white" />
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-700 mx-1"></div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
