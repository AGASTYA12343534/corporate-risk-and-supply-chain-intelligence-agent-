import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Filter, X, Activity, ShieldAlert, Loader2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// CSV Export Helper
const downloadCSV = (data) => {
  const headers = ["ID", "Name", "Country", "Industry", "Risk Score", "Status", "Last Updated"];
  const rows = data.map(s => [
    s.id, s.name, s.country, s.industry, s.risk_score, s.status, new Date(s.last_updated).toLocaleDateString()
  ]);
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "suppliers_risk_export.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const SupplierModal = ({ supplierId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/suppliers/${supplierId}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [supplierId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (!data) return null;

  const score = data.risk_score;
  const chartData = [
    { name: 'Risk', value: score },
    { name: 'Safe', value: 100 - score }
  ];
  const chartColor = score > 60 ? '#ef4444' : score > 40 ? '#f97316' : '#eab308'; // red, orange, yellow

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in p-4">
      <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col slide-in-from-bottom-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02] z-10">
          <div>
            <h2 className="text-2xl font-black text-white font-heading tracking-wide">{data.name}</h2>
            <p className="text-sm font-medium text-blue-400">{data.country} • {data.industry}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white/10 hover:text-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white font-heading tracking-wide flex items-center"><Activity className="mr-3 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" size={20}/> Core Metrics</h3>
              <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5 shadow-inner">
                <div><span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Status</span><p className="font-semibold text-slate-300 mt-1">{data.status}</p></div>
                <div><span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Last Updated</span><p className="font-semibold text-slate-300 mt-1">{new Date(data.last_updated).toLocaleDateString()}</p></div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-white/[0.02] p-5 rounded-xl border border-white/5 shadow-inner relative relative z-10">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider absolute top-4 left-4">Risk Gauge</span>
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                      <Cell fill={chartColor} />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                  <span className="text-2xl font-black" style={{ color: chartColor }}>{score.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-100 pb-2 mb-4">
              <ShieldAlert className="mr-2 text-red-500" size={20}/> Associated Risk Events
            </h3>
            {data.risk_events && data.risk_events.length > 0 ? (
              <div className="space-y-3">
                {data.risk_events.map(ev => (
                  <div key={ev.id} className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold capitalize text-slate-800">{ev.event_type}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">{ev.severity}</span>
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed mb-2">{ev.description}</span>
                    <span className="text-xs text-slate-400 font-medium">Detected: {new Date(ev.date_detected).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-slate-500 italic bg-green-50 text-green-700 p-4 rounded-lg border border-green-100 font-medium text-sm">
                  No active risk events recorded for this supplier.
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  
  // Modal State
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/suppliers')
      .then(res => res.json())
      .then(data => {
        setSuppliers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const countries = ['All', ...new Set(suppliers.map(s => s.country))];
  const industries = ['All', ...new Set(suppliers.map(s => s.industry))];

  const filteredSuppliers = useMemo(() => {
    let result = suppliers;
    if (search) {
      result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (countryFilter !== 'All') {
      result = result.filter(s => s.country === countryFilter);
    }
    if (industryFilter !== 'All') {
      result = result.filter(s => s.industry === industryFilter);
    }
    // Sort by risk score
    return result.sort((a, b) => b.risk_score - a.risk_score);
  }, [suppliers, search, countryFilter, industryFilter]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-white font-heading tracking-wide">Vendor Matrix</h1>
          <p className="text-slate-400 font-medium mt-1 tracking-wide">Manage and monitor vulnerability nodes globally.</p>
        </div>
        <button 
          onClick={() => downloadCSV(filteredSuppliers)}
          className="flex items-center text-sm font-bold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all"
        >
          <Download size={16} className="mr-2" />
          Export Datastore
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/[0.02] backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/5 flex flex-col md:flex-row gap-4 relative z-10">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Query vendors..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-slate-200 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner placeholder-slate-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1 hover:bg-white/10 transition-colors">
            <Filter size={16} className="text-slate-400 mr-2" />
            <select 
              className="bg-transparent text-sm border-none outline-none font-bold text-slate-300 cursor-pointer [&>option]:bg-slate-900"
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
            >
              {countries.map(c => <option key={c} value={c}>{c === 'All' ? 'Global Nodes' : c}</option>)}
            </select>
          </div>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1 hover:bg-white/10 transition-colors">
            <Filter size={16} className="text-slate-400 mr-2" />
            <select 
              className="bg-transparent text-sm border-none outline-none font-bold text-slate-300 cursor-pointer [&>option]:bg-slate-900"
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
            >
              {industries.map(i => <option key={i} value={i}>{i === 'All' ? 'All Sectors' : i}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl shadow-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/[0.01]">
                <th className="px-6 py-5">Node Identity</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Classification</th>
                <th className="px-6 py-5">Risk Grade</th>
                <th className="px-6 py-5">State</th>
                <th className="px-6 py-5">Telemetry Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredSuppliers.map((supplier) => (
                <tr 
                  key={supplier.id} 
                  onClick={() => setSelectedSupplierId(supplier.id)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5 text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-400">{supplier.country}</td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-medium">{supplier.industry}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 text-[10px] font-black tracking-wider uppercase rounded border shadow-sm ${supplier.risk_score > 60 ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/20' : supplier.risk_score > 40 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20 shadow-green-500/20'}`}>
                      {supplier.risk_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-400">{supplier.status}</td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium tracking-wider">{new Date(supplier.last_updated).toLocaleDateString()}</td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-500 font-medium text-lg">No nodes trace matching parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedSupplierId && (
        <SupplierModal 
          supplierId={selectedSupplierId} 
          onClose={() => setSelectedSupplierId(null)} 
        />
      )}
    </div>
  );
};

export default Suppliers;
