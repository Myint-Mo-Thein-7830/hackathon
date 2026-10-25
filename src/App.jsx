import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ModeB_ListingAuditor from './components/ModeB_ListingAuditor';
import ModeA_RoomBrowser from './components/ModeA_RoomBrowser';
import SafetyScorecard from './components/SafetyScorecard';
import { analyzeListing, SAMPLE_PREDATORY_APARTMENT } from './services/analyzer';

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

            {/* Complete Unified Safety Scorecard */}
            {auditResult && (
              <SafetyScorecard auditResult={auditResult} />
            )}
          </div>
        ) : (
          <ModeA_RoomBrowser />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <p>SafeRoom — Built for Devpost Learn: Build With AI (Basics Hackathon)</p>
      </footer>
    </div>
  );
}
