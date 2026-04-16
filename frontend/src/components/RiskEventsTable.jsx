import React from 'react';
import { AlertTriangle } from 'lucide-react';

const getSeverityStyle = (severity) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
    case 'High':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.2)]';
    case 'Medium':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]';
    case 'Low':
      return 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

const RiskEventsTable = ({ events }) => {
  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl border border-white/10 flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center tracking-wide font-heading">
          <AlertTriangle className="mr-3 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" size={20} /> Active Anomalies
        </h3>
        <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">View Logs</button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="pb-4 !pl-2">Threat Intelligence</th>
              <th className="pb-4">Severity</th>
              <th className="pb-4 text-right !pr-2">Detected</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {events.map((event, idx) => (
              <tr key={event.id || idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <td className="py-4 !pl-2">
                  <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{event.title}</div>
                  <div className="text-xs text-slate-500 mt-1.5 font-medium tracking-wide">{event.event_type} &bull; {event.affected_region}</div>
                </td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-black rounded border ${getSeverityStyle(event.severity)} shadow-sm`}>
                    {event.severity}
                  </span>
                </td>
                <td className="py-4 text-right text-sm text-slate-400 font-medium !pr-2">
                  {new Date(event.date_reported).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-slate-500 font-medium">No active anomalies detected.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskEventsTable;
