import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, Clock, MapPin, Search, Loader2 } from 'lucide-react';

const alertStyles = {
  Severe: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const iconMap = {
  Geopolitical: <ShieldAlert size={18} className="text-red-500" />,
  Logistics: <MapPin size={18} className="text-orange-500" />,
  Financial: <AlertCircle size={18} className="text-yellow-600" />,
  Systemic: <AlertCircle size={18} className="text-blue-500" />
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
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Active Supply Chain Alerts</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time global disruptions sorted by impact severity</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search alerts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
         <div className="py-20 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl">
           <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
           <p className="font-semibold text-lg">No alerts matched your search.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md duration-300 group">
               <div className="p-5 border-b border-slate-50 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-3">
                   <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded border ${alertStyles[alert.impact_level] || alertStyles['Moderate']}`}>
                     {alert.impact_level} Impact
                   </span>
                   <div className="flex items-center text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded">
                     <Clock size={12} className="mr-1" />
                     {new Date(alert.created_at).toLocaleDateString()}
                   </div>
                 </div>
                 
                 <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                   {alert.title}
                 </h3>
                 <p className="text-sm text-slate-600 leading-relaxed font-medium flex-1">
                   {alert.summary}
                 </p>
               </div>
               
               <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-slate-600 w-full">
                 <div className="flex items-center">
                   {iconMap[alert.category] || <AlertCircle size={18} className="text-slate-500 mr-2" />}
                   <span className="ml-2">{alert.category}</span>
                 </div>
                 <div className="flex items-center">
                   <MapPin size={16} className="text-slate-400 mr-1" />
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
