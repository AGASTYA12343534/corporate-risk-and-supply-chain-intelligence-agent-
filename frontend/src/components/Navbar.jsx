import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
        <Search className="text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search suppliers, events, or alerts..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-slate-400 text-slate-700"
        />
      </div>
      <div className="flex items-center space-x-5">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-6 w-px bg-slate-200"></div>
        <button className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-800">
          <UserCircle size={28} className="text-slate-400" />
          <span>Risk Admin</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
