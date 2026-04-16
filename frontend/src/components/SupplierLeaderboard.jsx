import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

const SupplierLeaderboard = ({ suppliers }) => {
  return (
    <div className="bg-slate-950 rounded-xl shadow-sm border border-slate-800 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center font-heading tracking-wide">
          <TrendingUp className="mr-3 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" size={20} /> Critical Nodes
        </h3>
      </div>
      <div className="p-2 flex-1 flex flex-col">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="flex flex-col space-y-3 p-4 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-colors">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-300 text-sm">{supplier.name}</span>
              <span className={`text-xs font-black px-2 py-1 rounded border ${supplier.risk_score > 80 ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.2)]'}`}>
                {supplier.risk_score.toFixed(1)} / 100
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden shadow-inner">
              <div 
                className={`h-1.5 rounded-full shadow-[0_0_8px] ${supplier.risk_score > 80 ? 'bg-red-500 shadow-red-500' : 'bg-orange-500 shadow-orange-500'}`} 
                style={{ width: `${Math.min(supplier.risk_score, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && (
          <div className="p-8 flex-1 flex items-center justify-center text-center text-slate-400 font-medium text-sm">
            No high-risk suppliers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierLeaderboard;
