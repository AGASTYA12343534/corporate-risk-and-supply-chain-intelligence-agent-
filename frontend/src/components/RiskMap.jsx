import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from 'react-tooltip';
import { AlertTriangle, Loader2 } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const RiskMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/api/risk-map')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  // Map to dict for fast lookup by country name
  const dataByCountry = React.useMemo(() => {
    const map = {};
    data.forEach(d => {
      // Basic normalization to match simple-maps TopoJSON names
      let name = d.country;
      if (name === "US" || name === "USA") name = "United States of America";
      map[name] = d;
    });
    return map;
  }, [data]);

  const getColor = (score) => {
    if (!score) return "#1e293b"; // slate-800
    if (score <= 30) return "#22c55e"; // green-500
    if (score <= 60) return "#eab308"; // yellow-500
    if (score <= 80) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const topCountries = [...data].sort((a,b) => b.avg_risk_score - a.avg_risk_score).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white font-heading tracking-wide">Geospatial Topography</h1>
          <p className="text-slate-400 font-medium mt-1 tracking-wide">Global overview of vulnerability concentrations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Main Map Container */}
        <div className="flex-1 bg-white/[0.02] backdrop-blur-md rounded-2xl shadow-xl border border-white/5 overflow-hidden relative flex flex-col">
          
          <div className="absolute top-4 right-4 z-10 bg-[#0a0a0a]/90 backdrop-blur p-4 rounded-xl border border-white/10 shadow-2xl pointer-events-none">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Risk Topology</h4>
            <div className="space-y-2.5">
              <div className="flex items-center text-xs font-bold text-slate-300"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] mr-3"></span> Critical Node</div>
              <div className="flex items-center text-xs font-bold text-slate-300"><span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] mr-3"></span> High Risk</div>
              <div className="flex items-center text-xs font-bold text-slate-300"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] mr-3"></span> Medium Risk</div>
              <div className="flex items-center text-xs font-bold text-slate-300"><span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] mr-3"></span> Safe</div>
              <div className="flex items-center text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-800 mr-3 border border-slate-700"></span> Inactive</div>
            </div>
          </div>

          <div className="flex-1 bg-transparent overflow-hidden mix-blend-screen opacity-90">
            <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "100%" }}>
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.name;
                      const countryData = dataByCountry[countryName];
                      const riskScore = countryData ? countryData.avg_risk_score : null;
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getColor(riskScore)}
                          stroke="#030712"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none", transition: "all 250ms" },
                            hover: { fill: riskScore ? "#60a5fa" : "#334155", outline: "none", cursor: riskScore ? "pointer" : "default", transition: "all 250ms" },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={() => {
                            if (countryData) {
                              setTooltipContent(`${countryName} - Suppliers: ${countryData.count} | Avg Risk: ${countryData.avg_risk_score.toFixed(1)}`);
                            } else {
                              setTooltipContent("");
                            }
                          }}
                          onMouseLeave={() => setTooltipContent("")}
                          data-tooltip-id="risk-tooltip"
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
          <Tooltip id="risk-tooltip" content={tooltipContent} hidden={!tooltipContent} style={{ backgroundColor: "#1e293b", color: "#fff", fontWeight: "bold", borderRadius: "8px", zIndex: 100 }} />
        </div>

        {/* Sidebar Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6 relative z-10">
          <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl shadow-xl border border-white/5 overflow-hidden flex-1 flex flex-col">
            <div className="px-6 py-5 border-b border-white/5 flex items-center bg-white/[0.01]">
               <AlertTriangle size={18} className="text-red-500 mr-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"/>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest font-heading">Hot Zones</h2>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto">
              {topCountries.map((c, idx) => (
                 <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.05]">
                    <div className="flex items-center">
                       <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black mr-3 shadow-sm border ${idx === 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{idx+1}</span>
                       <div className="flex flex-col">
                         <span className="text-sm font-bold text-slate-200">{c.country}</span>
                         <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{c.count} nodes</span>
                       </div>
                    </div>
                    <span className="text-sm font-black text-red-400 bg-red-500/10 px-2.5 py-1.5 rounded shadow-sm border border-red-500/20">{c.avg_risk_score.toFixed(1)}</span>
                 </div>
              ))}
              {topCountries.length === 0 && (
                <div className="text-slate-500 text-sm italic text-center mt-4">No data available</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiskMap;
