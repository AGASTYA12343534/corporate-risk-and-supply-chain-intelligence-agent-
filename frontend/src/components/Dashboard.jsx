import React, { useState, useEffect } from 'react';
import KPICard from './KPICard';
import RiskEventsTable from './RiskEventsTable';
import SupplierLeaderboard from './SupplierLeaderboard';
import { ShieldAlert, Users, AlertCircle, LineChart, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, eventsRes, suppliersRes] = await Promise.all([
          fetch('http://localhost:8000/api/dashboard/summary'),
          fetch('http://localhost:8000/api/risk-events'),
          fetch('http://localhost:8000/api/suppliers')
        ]);
        
        if (summaryRes.ok && eventsRes.ok && suppliersRes.ok) {
            const summaryData = await summaryRes.json();
            const eventsData = await eventsRes.json();
            const suppliersData = await suppliersRes.json();
            
            setSummary(summaryData);
            setEvents(eventsData.sort((a,b) => b.id - a.id).slice(0, 5));
            setSuppliers(suppliersData.sort((a,b) => b.risk_score - a.risk_score).slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-500 font-semibold tracking-wide">Gathering Global Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-sm font-heading">Risk Intelligence Core</h1>
          <p className="text-slate-400 font-medium mt-1 tracking-wide">Real-time macro telemetry of external exposure.</p>
        </div>
        <div className="text-xs text-slate-400 font-bold bg-white/5 px-4 py-2 rounded-lg shadow-sm border border-white/10">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Total Suppliers Managed" 
          value={summary?.total_suppliers} 
          icon={<Users size={28} />} 
          trend="Stable"
          color="blue"
        />
        <KPICard 
          title="High Risk Suppliers" 
          value={summary?.high_risk_count} 
          icon={<ShieldAlert size={28} />} 
          trend="Critical attention needed"
          color="red"
        />
        <KPICard 
          title="Active Global Alerts" 
          value={summary?.active_alerts_count} 
          icon={<AlertCircle size={28} />} 
          trend="+2 recent alerts"
          color="orange"
        />
        <KPICard 
          title="Avg Network Risk Score" 
          value={summary?.average_risk_score} 
          icon={<LineChart size={28} />} 
          trend={summary?.average_risk_score > 40 ? "Elevated Baseline" : "Normal Baseline"}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-7 shadow-xl">
          <RiskEventsTable events={events} />
        </div>
        <div className="lg:col-span-1 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-7 shadow-xl">
          <SupplierLeaderboard suppliers={suppliers} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
