import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const SupplierLeaderboard = ({ suppliers }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Highest Risk Suppliers</h2>
      </div>
      <div className="p-2 flex-1 flex flex-col">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="p-4 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0 group cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center">
                  {supplier.name}
                  <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 shrink-0" />
                </span>
                <span className="text-xs text-slate-500 mt-0.5 font-medium">{supplier.country} • {supplier.industry}</span>
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-1 rounded-md shrink-0 ml-4">
                {supplier.risk_score.toFixed(1)} / 100
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${supplier.risk_score > 60 ? 'bg-red-500' : supplier.risk_score > 40 ? 'bg-orange-400' : 'bg-yellow-400'}`} 
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
