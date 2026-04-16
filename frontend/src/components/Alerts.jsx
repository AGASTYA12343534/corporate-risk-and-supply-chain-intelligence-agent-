import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, Clock, MapPin, Search, Loader2 } from 'lucide-react';

const alertStyles = {
  Severe: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.2)]',
  Moderate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]',
  Low: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]',
};

const iconMap = {
  Geopolitical: <ShieldAlert size={18} className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />,
  Logistics: <MapPin size={18} className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />,
  Financial: <AlertCircle size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />,
  Systemic: <AlertCircle size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/alerts')
      .then(res => res.json())
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, []);

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.summary.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-white font-heading tracking-wide">Threat Detection Feed</h1>
          <p className="text-slate-400 font-medium mt-1 tracking-wide">Real-time global disruptions sorted by kinetic severity.</p>
        </div>
        
        <div className="relative w-full sm:w-80 group mt-4 sm:mt-0">
          <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-blue-400 transition-colors z-10" size={18} />
          <input 
            type="text" 
            placeholder="Filter active threats..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-lg text-sm font-medium text-slate-300 focus:ring-1 focus:ring-blue-500/50 outline-none shadow-inner placeholder-slate-500 relative z-10"
          />
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
         <div className="py-20 text-center text-slate-500 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md shadow-xl">
           <AlertCircle size={40} className="mx-auto mb-3 opacity-50 text-slate-400" />
           <p className="font-semibold text-lg font-heading tracking-wide">No threat anomalies matched query.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className="bg-white/[0.02] backdrop-blur-md rounded-2xl shadow-xl border border-white/5 overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-white/10 hover:bg-white/[0.04] duration-300 group">
               <div className="p-6 border-b border-white/5 flex-1 flex flex-col relative z-20">
                 <div className="flex justify-between items-start mb-4">
                   <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-black rounded shadow-sm border ${alertStyles[alert.impact_level] || alertStyles['Moderate']}`}>
                     {alert.impact_level} Impact
                   </span>
                   <div className="flex items-center text-slate-400 text-xs font-bold bg-black/40 px-2.5 py-1 rounded border border-white/5">
                     <Clock size={12} className="mr-1.5 opacity-70" />
                     {new Date(alert.created_at).toLocaleDateString()}
                   </div>
                 </div>
                 
                 <h3 className="font-bold text-white text-lg leading-snug mb-3 group-hover:text-blue-400 transition-colors font-heading tracking-wide">
                   {alert.title}
                 </h3>
                 <p className="text-sm text-slate-400 leading-relaxed font-medium flex-1">
                   {alert.summary}
                 </p>
               </div>
               
               <div className="px-6 py-4 bg-white/[0.01] flex justify-between items-center text-sm font-bold text-slate-300 w-full relative z-20">
                 <div className="flex items-center">
                   {iconMap[alert.category] || <AlertCircle size={18} className="text-slate-500 mr-2" />}
                   <span className="ml-2.5 tracking-wide uppercase text-[10px]">{alert.category}</span>
                 </div>
                 <div className="flex items-center text-xs tracking-wider">
                   <MapPin size={14} className="text-slate-500 mr-1.5" />
                   {alert.affected_region}
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Alerts;
