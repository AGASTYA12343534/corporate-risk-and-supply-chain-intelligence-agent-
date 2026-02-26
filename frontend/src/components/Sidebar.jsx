import React from 'react';
import { LayoutDashboard, Users, AlertTriangle, Bell, BrainCircuit } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
    { name: 'Suppliers', icon: <Users size={20} /> },
    { name: 'Risk Events', icon: <AlertTriangle size={20} /> },
    { name: 'Alerts', icon: <Bell size={20} /> },
    { name: 'AI Analysis', icon: <BrainCircuit size={20} /> },
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
            <a
              key={link.name}
              href="#"
              className={`flex items-center px-6 py-3 text-sm font-medium transition-all ${
                link.active 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
