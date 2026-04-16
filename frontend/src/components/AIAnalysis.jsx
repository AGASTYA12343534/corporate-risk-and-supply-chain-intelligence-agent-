import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { BrainCircuit, Download, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AIAnalysis = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState([]);
  const [companyName, setCompanyName] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  
  const reportRef = useRef();

  useEffect(() => {
    fetch('http://localhost:8000/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data));
  }, []);

  const handleSupplierToggle = (id) => {
    if (selectedSupplierIds.includes(id)) {
      setSelectedSupplierIds(selectedSupplierIds.filter(v => v !== id));
    } else {
      setSelectedSupplierIds([...selectedSupplierIds, id]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return alert("Please enter an analysis entity name.");
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          supplier_ids: selectedSupplierIds
        })
      });
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Analysis engine failure. Please ensure backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    const opt = {
      margin:       0.5,
      filename:     `${report?.company_name.replace(/\\s+/g, '_')}_Risk_Report.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(reportRef.current).save();
  };

  // Parsing utilities to make strings look beautiful
  // Since the payload strings are paragraph-based, we extract lists where possible natively.
  const parseLinesToList = (textString) => {
    if (!textString) return [];
    return textString.split('\\n').map(l => l.replace(/^- /, '').trim()).filter(l => l.length > 5);
  };

  // Derive an average risk score dynamically for the visual gauge based on returned supplier details logic or directly from selected ids.
  // The API doesn't pass back a raw numeric average risk score, so we map to our locally fetched suppliers.
  const activeSuppliers = suppliers.filter(s => selectedSupplierIds.includes(s.id));
  const mappedAvgScore = activeSuppliers.length > 0 
    ? activeSuppliers.reduce((sum, s) => sum + s.risk_score, 0) / activeSuppliers.length 
    : 45.0; // fallback if auto-picked by backend

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white font-heading tracking-wide flex items-center">
            <BrainCircuit className="mr-4 text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" size={36} />
            AI Synthesizer
          </h1>
          <p className="text-slate-400 font-medium mt-2 tracking-wide">Dynamically generate entity risk models via predictive agent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Setup */}
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="bg-white/[0.02] backdrop-blur-md rounded-2xl shadow-2xl border border-white/5 p-7 flex flex-col h-full sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Parameter Tuning</h3>
            
            <div className="space-y-6 flex-1">
              {/* Target Entity */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Target Entity</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation" 
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner placeholder-slate-600 tracking-wide font-medium"
                />
              </div>

              {/* Vendor Selection (Multi-select via styled checkboxes) */}
              <div className="flex flex-col flex-1 max-h-[400px]">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Manual Node Selection <span className="text-[10px] text-slate-600 normal-case ml-1 font-normal tracking-normal">(Overrides auto-routing)</span></label>
                <div className="border border-white/5 rounded-xl overflow-y-auto flex-1 bg-white/[0.01] p-2 space-y-1 shadow-inner">
                   {suppliers.map(sup => (
                     <label key={sup.id} className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all ${selectedSupplierIds.includes(sup.id) ? 'bg-blue-600/10 border border-blue-500/30' : 'hover:bg-white/[0.05] border border-transparent'}`}>
                       <input 
                         type="checkbox" 
                         className="w-4 h-4 text-blue-600 accent-blue-600 rounded mr-3 bg-black border-white/20"
                         checked={selectedSupplierIds.includes(sup.id)}
                         onChange={() => handleSupplierToggle(sup.id)}
                       />
                       <span className="text-sm font-bold text-slate-300 flex-1">{sup.name}</span>
                       <span className={`text-[10px] uppercase font-black px-2 py-1 rounded border shadow-sm ${sup.risk_score > 60 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{sup.risk_score.toFixed(0)}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAnalyzing}
              className={`mt-8 w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center tracking-wide ${isAnalyzing ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-blue-600 hover:bg-blue-500 border border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]'}`}
            >
              {isAnalyzing ? (
                <><Loader2 className="animate-spin mr-3" size={20} /> SYNTHESIZING...</>
              ) : (
                <><BrainCircuit className="mr-3" size={20} /> INITIATE GENERATION</>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Report Viewer */}
        <div className="lg:col-span-2">
          
          {/* Default Empty State */}
          {!isAnalyzing && !report && (
             <div className="h-full min-h-[500px] border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
               <FileText size={64} className="mb-6 opacity-20 text-slate-300" />
               <p className="font-bold text-xl font-heading tracking-wide text-slate-400">Analysis Matrix Idle</p>
               <p className="text-sm mt-2 tracking-wide">Configure entity parameters to begin trace.</p>
             </div>
          )}

          {/* Loading State Spinner */}
          {isAnalyzing && (
             <div className="h-full min-h-[500px] border border-white/5 shadow-2xl rounded-2xl flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md text-slate-400 animate-in zoom-in-95 duration-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent animate-pulse pointer-events-none"></div>
               <div className="relative z-10 w-40 h-40 flex items-center justify-center">
                 <div className="absolute inset-0 border-t-2 border-l-2 border-blue-500 rounded-full animate-[spin_2s_linear_infinite] shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                 <div className="absolute inset-4 border-r-2 border-b-2 border-purple-500 rounded-full animate-[spin_3s_linear_infinite_reverse] shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
                 <BrainCircuit className="text-blue-400 animate-pulse drop-shadow-[0_0_12px_rgba(59,130,246,1)]" size={48} />
               </div>
               <p className="font-black text-xl mt-12 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-heading tracking-widest uppercase">Processing Telemetry...</p>
               <p className="text-xs font-bold text-slate-500 mt-3 tracking-widest uppercase">Evaluating geopolitical and systemic pathways.</p>
             </div>
          )}

          {/* Rendered HTML Report Card */}
          {!isAnalyzing && report && (
            <div className="animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Compiler Result</span>
                <button 
                  onClick={handleDownloadPDF} 
                  className="flex items-center text-sm font-black text-white hover:text-white bg-blue-600/20 px-5 py-2.5 rounded-lg transition-all border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-blue-600/40"
                >
                  <Download size={16} className="mr-2" /> EXECUTE EXPORT
                </button>
              </div>

              <div ref={reportRef} className="bg-[#050505] rounded-xl shadow-2xl border border-white/10 overflow-hidden text-slate-300 font-sans p-1">
                {/* PDF Header Block */}
                <div className="bg-[#0a0a0a] rounded-t-lg px-8 py-10 flex justify-between items-start border-b border-white/5">
                  <div>
                    <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-3">AI Intelligence Abstract</h2>
                    <h1 className="text-4xl font-black text-white font-heading tracking-wide mb-3">{report.company_name}</h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-lg font-medium leading-relaxed">Confidential modeling compiled by RiskRadar AI dynamically charting internal routing topology.</p>
                  </div>
                  {/* Gauge */}
                  <div className="bg-[#030712] rounded-xl p-4 shadow-inner flex flex-col items-center relative w-40 h-40 border border-white/10">
                     <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1 absolute top-4">Exposure Force</span>
                     <ResponsiveContainer width="100%" height={80} className="mt-6">
                        <PieChart>
                          <Pie
                            data={[{value: mappedAvgScore}, {value: 100 - mappedAvgScore}]}
                            cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={28} outerRadius={40} dataKey="value" stroke="none"
                          >
                            <Cell fill={mappedAvgScore > 60 ? '#ef4444' : mappedAvgScore > 40 ? '#f97316' : '#22c55e'} />
                            <Cell fill="#1e293b" />
                          </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     <span className="absolute bottom-5 font-black text-white text-3xl">{mappedAvgScore.toFixed(0)}</span>
                  </div>
                </div>

                {/* PDF Body Container */}
                <div className="p-10 space-y-10 bg-[#050505]">
                  {/* Executive Summary */}
                  <section>
                    <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 flex items-center border-b border-white/10 pb-3 mb-6">
                      <FileText className="mr-3 text-blue-500" size={18} /> Executive Synthesis
                    </h3>
                    <div className="bg-white/[0.02] p-6 rounded-xl border border-white/5 text-sm leading-relaxed font-medium text-slate-300 shadow-inner">
                      {report.exposure_analysis.split('\n').map((l, i) => <p key={i} className="mb-3 last:mb-0">{l}</p>)}
                    </div>
                  </section>

                  {/* Mitigation Plan block */}
                  <section>
                    <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 flex items-center border-b border-white/10 pb-3 mb-6">
                      <CheckCircle2 className="mr-3 text-green-500" size={18} /> Recommended Fixes
                    </h3>
                    <div className="space-y-4">
                      {parseLinesToList(report.recommended_mitigation).map((item, idx) => (
                        <div key={idx} className="flex p-5 rounded-xl border border-white/5 shadow-sm bg-white/[0.02]">
                          <span className="shrink-0 w-7 h-7 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-black text-xs flex items-center justify-center mr-4 shadow-sm">{idx + 1}</span>
                          <p className="text-sm font-medium text-slate-300 leading-snug tracking-wide">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Specific Vendors List */}
                  <section>
                    <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 flex items-center border-b border-white/10 pb-3 mb-6">
                       <AlertTriangle className="mr-3 text-orange-500" size={18} /> Topology Assessment
                    </h3>
                    <div className="divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden bg-white/[0.02] shadow-inner">
                      {report.supplier_details.map((detail, idx) => (
                        <div key={idx} className="p-5 text-sm font-medium text-slate-300 hover:bg-white/[0.05] transition-colors leading-relaxed tracking-wide">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Extracted logic purely for readability above inside the react element syntax
const supplier_details_len = "multiple"; 

export default AIAnalysis;
