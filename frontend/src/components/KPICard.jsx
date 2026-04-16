import React from 'react';

const KPICard = ({ title, value, icon, trend, color }) => {
  const bgColors = {
    blue: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    red: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    orange: 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    purple: 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
  };

  return (
    <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-start justify-between transition-all hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:border-white/10 duration-300 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10 w-full flex items-start justify-between">
        <div>
          <h3 className="text-slate-400 text-sm font-semibold mb-2 tracking-wide">{title}</h3>
          <p className="text-4xl font-black text-white tracking-tight drop-shadow-sm">{value !== undefined ? value : '--'}</p>
          <p className="text-xs text-slate-500 mt-3 font-medium tracking-wide">{trend}</p>
        </div>
        <div className={`p-4 rounded-xl ${bgColors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
