import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, Bell, BrainCircuit, Globe, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Users size={20} /> },
    { name: 'Risk Map', path: '/risk-map', icon: <Globe size={20} /> },
    { name: 'Risk Events', path: '/risk-events', icon: <AlertTriangle size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'AI Analysis', path: '/ai-analysis', icon: <BrainCircuit size={20} /> },
  ];

  return (
    <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-30 md:hidden"
        onClick={() => setIsOpen(false)}
      ></div>
    )}
    
    <div className={`w-64 bg-[#050505]/60 backdrop-blur-2xl border-r border-white/5 text-slate-400 h-screen fixed top-0 left-0 flex flex-col shadow-2xl z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center">
          <BrainCircuit className="text-blue-500 mr-3 animate-pulse drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={28} />
          <span className="text-white font-black text-xl tracking-tight font-heading">RiskRadar</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 py-6">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `flex items-center px-6 py-4 text-sm font-medium transition-all group relative overflow-hidden ${
                isActive 
                  ? 'text-white border-l-2 border-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent' 
                  : 'hover:text-blue-400 hover:bg-white/5'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
