import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, Bell, BrainCircuit, Globe } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Users size={20} /> },
    { name: 'Risk Map', path: '/risk-map', icon: <Globe size={20} /> },
    { name: 'Risk Events', path: '/risk-events', icon: <AlertTriangle size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'AI Analysis', path: '/ai-analysis', icon: <BrainCircuit size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-slate-300 h-screen fixed top-0 left-0 flex flex-col shadow-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <BrainCircuit className="text-blue-500 mr-3" size={28} />
        <span className="text-white font-bold text-xl tracking-tight">RiskRadar</span>
      </div>
      <div className="flex-1 py-6">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `flex items-center px-6 py-3 text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
