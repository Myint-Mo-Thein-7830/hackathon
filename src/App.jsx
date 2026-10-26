import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BrowseAccommodations from './components/BrowseAccommodations';
import EvaluateLeaseView from './components/EvaluateLeaseView';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'evaluate'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Background Ambience Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-opacity duration-300 ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-emerald-500/5'}`}></div>
        <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl transition-opacity duration-300 ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-teal-500/5'}`}></div>
        <div className={`absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl transition-opacity duration-300 ${theme === 'dark' ? 'bg-indigo-500/5' : 'bg-emerald-500/5'}`}></div>
      </div>

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeMode={activeTab}
        setActiveMode={setActiveTab}
        theme={theme} 
        toggleTheme={toggleTheme}
      />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' ? (
          <BrowseAccommodations setActiveTab={setActiveTab} onSwitchToEvaluate={() => setActiveTab('evaluate')} />
        ) : (
          <EvaluateLeaseView setActiveTab={setActiveTab} />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        SafeRoom Bangkok • Built for Devpost Learn AI Basics Hackathon
      </footer>
    </div>
  );
}
