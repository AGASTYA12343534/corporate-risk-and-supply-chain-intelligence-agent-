import React from 'react';
import { Search, Bell, UserCircle, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <div className="h-20 bg-[#030712]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 w-full transition-all">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="md:hidden p-2 mr-2 text-slate-400 hover:bg-white/5 rounded-lg transition-colors">
          <Menu size={24} />
        </button>

      <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 w-96 focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-inner group">
        <Search className="text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search global intelligence..." 
          className="bg-transparent border-none outline-none ml-3 w-full text-sm placeholder-slate-600 text-slate-200"
        />
      </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-5">
        <button className="relative p-2 text-slate-400 hover:bg-white/5 hover:text-blue-400 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </button>
        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
        <button className="flex items-center space-x-3 text-sm font-medium text-slate-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 pr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 shadow-lg">RA</div>
          <span className="hidden md:inline font-semibold">Risk Admin</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
