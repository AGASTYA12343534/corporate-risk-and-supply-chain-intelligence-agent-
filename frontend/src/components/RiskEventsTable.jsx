import React from 'react';

const severityBadge = (severity) => {
  const normalized = severity ? severity.toLowerCase() : '';
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = severity || 'Unknown';

  if (normalized === 'critical') style = 'bg-red-100 text-red-700 border-red-200';
  else if (normalized === 'high') style = 'bg-orange-100 text-orange-700 border-orange-200';
  else if (normalized === 'medium') style = 'bg-yellow-100 text-yellow-700 border-yellow-200';
  else if (normalized === 'low') style = 'bg-green-100 text-green-700 border-green-200';
  
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${style}`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
};

const RiskEventsTable = ({ events }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Recent Risk Events</h2>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4 font-bold">Event Type</th>
              <th className="px-6 py-4 font-bold">Severity</th>
              <th className="px-6 py-4 font-bold">Description</th>
              <th className="px-6 py-4 font-bold">Date Detected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 text-sm font-semibold text-slate-800 capitalize">
                  {event.event_type}
                </td>
                <td className="px-6 py-4">
                  {severityBadge(event.severity)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-sm truncate group-hover:text-slate-800 transition-colors">
                  {event.description}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                  {new Date(event.date_detected).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">No recent risk events detected.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskEventsTable;
