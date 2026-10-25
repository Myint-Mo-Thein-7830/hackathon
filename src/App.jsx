import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ModeB_ListingAuditor from './components/ModeB_ListingAuditor';
import { analyzeListing, SAMPLE_PREDATORY_APARTMENT } from './services/analyzer';
import { ShieldCheck, AlertOctagon, CheckCircle2, AlertTriangle, ArrowRight, DollarSign, Zap } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState('audit'); // 'audit' | 'browse'
  const [auditResult, setAuditResult] = useState(null);

  // Initialize with the predatory sample on initial load so there's immediate data
  useEffect(() => {
    const initial = analyzeListing(SAMPLE_PREDATORY_APARTMENT, 'apartment');
    setAuditResult(initial);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background Ambience Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Navigation */}
      <Navbar activeMode={activeMode} setActiveMode={setActiveMode} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {activeMode === 'audit' ? (
          <div className="space-y-8">
            <ModeB_ListingAuditor 
              onAuditResult={setAuditResult} 
              auditResult={auditResult} 
            />

            {/* Preliminary Metrics Viewer (Enhanced in Slice 2 to full Scorecard) */}
            {auditResult && (
              <section id="audit-results-preview" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl border ${
                      auditResult.riskLevel === 'hazard'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : auditResult.riskLevel === 'caution'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      {auditResult.riskLevel === 'hazard' ? (
                        <AlertOctagon className="w-6 h-6" />
                      ) : auditResult.riskLevel === 'caution' ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <ShieldCheck className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-bold text-white">
                          {auditResult.riskLevel === 'hazard'
                            ? 'High Scam / Exploitation Hazard'
                            : auditResult.riskLevel === 'caution'
                            ? 'Review Recommended'
                            : 'Verified Safe Listing'}
                        </h2>
                        <span className={`px-2 py-0.5 rounded text-xs font-extrabold uppercase font-mono ${
                          auditResult.riskLevel === 'hazard'
                            ? 'bg-red-900/80 text-red-200 border border-red-700/50'
                            : auditResult.riskLevel === 'caution'
                            ? 'bg-amber-900/80 text-amber-200 border border-amber-700/50'
                            : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/50'
                        }`}>
                          Score: {auditResult.score}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Audited under <span className="capitalize font-semibold text-slate-300">{auditResult.propertyType}</span> standard
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Upfront Cash: </span>
                      <span className="text-white font-bold">{auditResult.upfrontCash.toLocaleString()} THB</span>
                    </div>
                    <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Est. Monthly: </span>
                      <span className="text-white font-bold">{auditResult.monthlyTotalEst.toLocaleString()} THB</span>
                    </div>
                  </div>
                </div>

                {/* Detected Red Flags list */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Detected Safety Flags ({auditResult.redFlags.length})
                  </h3>
                  {auditResult.redFlags.length === 0 ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>No predatory clauses detected. All terms align with standard legal and market baselines.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {auditResult.redFlags.map((flag, idx) => (
                        <div key={idx} className={`p-3 rounded-xl border text-xs space-y-1 ${
                          flag.severity === 'hazard'
                            ? 'bg-red-500/10 border-red-500/30 text-red-200'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        }`}>
                          <div className="font-bold flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            <span>{flag.title}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{flag.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-20 space-y-3">
            <h2 className="text-xl font-bold text-white">Mode A: Browse Safe Rooms</h2>
            <p className="text-sm text-slate-400">Pre-vetted room catalog will be mounted in Slice 3.</p>
            <button
              onClick={() => setActiveMode('audit')}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
            >
              Back to Audit Listing
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <p>SafeRoom — Built for Devpost Learn: Build With AI (Basics Hackathon)</p>
      </footer>
    </div>
  );
}
