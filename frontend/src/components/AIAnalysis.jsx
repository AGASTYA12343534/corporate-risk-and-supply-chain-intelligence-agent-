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
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
            <BrainCircuit className="mr-3 text-blue-600" size={32} />
            AI Intelligence Generator
          </h1>
          <p className="text-slate-500 font-medium mt-1">Configure and generate dynamically synthesized supplier risk reports using predictive models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Setup */}
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full sticky top-24">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 pb-2 border-b border-slate-50">Report Configuration</h3>
            
            <div className="space-y-4 flex-1">
              {/* Target Entity */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Analysis Target Entity</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>

              {/* Vendor Selection (Multi-select via styled checkboxes) */}
              <div className="flex flex-col flex-1 max-h-[400px]">
                <label className="block text-sm font-bold text-slate-700 mb-2 mt-2">Explicit Vendor Selection <span className="text-xs text-slate-400 font-normal ml-1">(Overrides DB defaults)</span></label>
                <div className="border border-slate-200 rounded-lg overflow-y-auto flex-1 bg-slate-50 p-2 space-y-1">
                   {suppliers.map(sup => (
                     <label key={sup.id} className={`flex items-center p-2 rounded cursor-pointer transition-colors ${selectedSupplierIds.includes(sup.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100 border border-transparent'}`}>
                       <input 
                         type="checkbox" 
                         className="w-4 h-4 text-blue-600 accent-blue-600 rounded mr-3"
                         checked={selectedSupplierIds.includes(sup.id)}
                         onChange={() => handleSupplierToggle(sup.id)}
                       />
                       <span className="text-sm font-medium text-slate-700 flex-1">{sup.name}</span>
                       <span className={`text-xs ml-2 font-bold px-2 py-0.5 rounded ${sup.risk_score > 60 ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>{sup.risk_score.toFixed(0)}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAnalyzing}
              className={`mt-6 w-full py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center ${isAnalyzing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
            >
              {isAnalyzing ? (
                <><Loader2 className="animate-spin mr-2" size={20} /> Generating Analysis...</>
              ) : (
                <><BrainCircuit className="mr-2" size={20} /> Synthesize Intelligence</>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Report Viewer */}
        <div className="lg:col-span-2">
          
          {/* Default Empty State */}
          {!isAnalyzing && !report && (
             <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
               <FileText size={64} className="mb-4 opacity-50" />
               <p className="font-semibold text-lg">Analysis Studio is Empty</p>
               <p className="text-sm mt-1">Select an entity and vendors to execute the simulation.</p>
             </div>
          )}

          {/* Loading State Spinner */}
          {isAnalyzing && (
             <div className="h-full min-h-[500px] border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center bg-white text-slate-600 animate-in zoom-in-95 duration-500">
               <div className="relative">
                 <Loader2 className="animate-spin text-blue-100" size={120} strokeWidth={1} />
                 <BrainCircuit className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={48} />
               </div>
               <p className="font-bold text-lg mt-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Agent is analyzing risk exposure...</p>
               <p className="text-sm font-medium text-slate-400 mt-2">Evaluating geopolitical, financial and cyber indicators against the mapping.</p>
             </div>
          )}

          {/* Rendered HTML Report Card */}
          {!isAnalyzing && report && (
            <div className="animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Generated Output</span>
                <button 
                  onClick={handleDownloadPDF} 
                  className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-blue-100"
                >
                  <Download size={16} className="mr-2" /> Download PDF
                </button>
              </div>

              <div ref={reportRef} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden text-slate-800 font-sans">
                {/* PDF Header Block */}
                <div className="bg-slate-900 px-8 py-10 flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Automated Target Analysis</h2>
                    <h1 className="text-3xl font-black text-white">{report.company_name}</h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-lg">Confidential risk modeling compiled by RiskRadar AI dynamically mapping {supplier_details_len} tier-1 sub-entities.</p>
                  </div>
                  {/* Gauge specifically formatted for white bg in pdf, we inject a white rounded block */}
                  <div className="bg-white rounded-xl p-4 shadow-xl flex flex-col items-center relative w-36 h-36 border-4 border-slate-800">
                     <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1 absolute top-3">Exposure Avg</span>
                     <ResponsiveContainer width="100%" height={80} className="mt-4">
                        <PieChart>
                          <Pie
                            data={[{value: mappedAvgScore}, {value: 100 - mappedAvgScore}]}
                            cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={25} outerRadius={35} dataKey="value" stroke="none"
                          >
                            <Cell fill={mappedAvgScore > 60 ? '#ef4444' : mappedAvgScore > 40 ? '#f97316' : '#22c55e'} />
                            <Cell fill="#f1f5f9" />
                          </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     <span className="absolute bottom-4 font-black text-slate-800 text-2xl">{mappedAvgScore.toFixed(0)}</span>
                  </div>
                </div>

                {/* PDF Body Container */}
                <div className="p-8 space-y-8">
                  {/* Executive Summary */}
                  <section>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-100 pb-2 mb-4">
                      <FileText className="mr-2 text-blue-600" size={20} /> Executive Summary
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-sm leading-relaxed font-medium text-slate-700">
                      {report.exposure_analysis.split('\\n').map((l, i) => <p key={i} className="mb-2 last:mb-0">{l}</p>)}
                    </div>
                  </section>

                  {/* Mitigation Plan block */}
                  <section>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-100 pb-2 mb-4">
                      <CheckCircle2 className="mr-2 text-green-500" size={20} /> Recommended Mitigations
                    </h3>
                    <div className="space-y-3">
                      {parseLinesToList(report.recommended_mitigation).map((item, idx) => (
                        <div key={idx} className="flex p-4 rounded-lg border border-slate-100 shadow-sm bg-white">
                          <span className="shrink-0 w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center mr-3 mt-0.5">{idx + 1}</span>
                          <p className="text-sm font-medium text-slate-700 leading-snug">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Specific Vendors List */}
                  <section>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-100 pb-2 mb-4">
                       <AlertTriangle className="mr-2 text-orange-500" size={20} /> Analyzed Supplier Breakdown
                    </h3>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50">
                      {report.supplier_details.map((detail, idx) => (
                        <div key={idx} className="p-4 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors leading-relaxed">
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
