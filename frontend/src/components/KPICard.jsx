import React from 'react';

const KPICard = ({ title, value, icon, trend, color }) => {
  const bgColors = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800">{value !== undefined ? value : '--'}</p>
        <p className="text-xs text-slate-400 mt-2 font-medium">{trend}</p>
      </div>
      <div className={`p-3 rounded-xl ${bgColors[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default KPICard;
