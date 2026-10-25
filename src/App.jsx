import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ModeA_RoomBrowser from './components/ModeA_RoomBrowser';
import ModeB_ListingAuditor from './components/ModeB_ListingAuditor';
import SafetyScorecard from './components/SafetyScorecard';
import { analyzeStructuredLease, DEMO_PRESETS } from './services/analyzer';

export default function App() {
  // Theme state: defaults to 'light' unless user has explicitly saved 'dark' in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('saferoom-theme') || 'light');

  // Default to 'browse' view so users first see real, available places!
  const [activeMode, setActiveMode] = useState('browse'); // 'browse' | 'evaluate'
  const [auditResult, setAuditResult] = useState(null);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('saferoom-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize evaluation with default preset
  useEffect(() => {
    const initial = analyzeStructuredLease(DEMO_PRESETS.budgetDorm.data);
    setAuditResult(initial);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Background Ambience Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Navigation */}
      <Navbar 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {activeMode === 'browse' ? (
          <ModeA_RoomBrowser onSwitchToEvaluate={() => setActiveMode('evaluate')} />
        ) : (
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
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <p>SafeRoom — Smart Accommodation & Rental Living Assistant | Devpost: Build With AI</p>
      </footer>
    </div>
  );
}
