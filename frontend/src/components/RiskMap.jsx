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
    if (!score) return "#f1f5f9"; // default slate-100
    if (score <= 30) return "#86efac"; // green-300
    if (score <= 60) return "#fde047"; // yellow-300
    if (score <= 80) return "#fb923c"; // orange-400
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
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Global Risk Map</h1>
          <p className="text-slate-500 font-medium mt-1">Geospatial overview of supplier vulnerability concentrations</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Main Map Container */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
          
          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-100 shadow-sm pointer-events-none">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Risk Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center text-xs font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Critical (81-100)</div>
              <div className="flex items-center text-xs font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span> High (61-80)</div>
              <div className="flex items-center text-xs font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-yellow-300 mr-2"></span> Medium (31-60)</div>
              <div className="flex items-center text-xs font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-green-300 mr-2"></span> Low (0-30)</div>
              <div className="flex items-center text-xs font-medium text-slate-600"><span className="w-3 h-3 rounded-full bg-slate-100 mr-2 border border-slate-200"></span> No Data</div>
            </div>
          </div>

          <div className="flex-1 bg-blue-50/30 overflow-hidden">
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
                          stroke="#cbd5e1"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: riskScore ? "#3b82f6" : "#e2e8f0", outline: "none", cursor: riskScore ? "pointer" : "default", transition: "all 250ms" },
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
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
               <AlertTriangle size={18} className="text-red-500 mr-2"/>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top Riskiest Territories</h2>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto">
              {topCountries.map((c, idx) => (
                 <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50 transition-all hover:bg-slate-100">
                    <div className="flex items-center">
                       <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mr-3 ${idx === 0 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>{idx+1}</span>
                       <div className="flex flex-col">
                         <span className="text-sm font-bold text-slate-800">{c.country}</span>
                         <span className="text-xs font-medium text-slate-500">{c.count} suppliers</span>
                       </div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">{c.avg_risk_score.toFixed(1)}</span>
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
