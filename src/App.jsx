import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BrowseAccommodations from './components/BrowseAccommodations';
import EvaluateLeaseView from './components/EvaluateLeaseView';
import RentalChatbot from './components/RentalChatbot';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme}/>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' ? (
          <BrowseAccommodations setActiveTab={setActiveTab} onSwitchToEvaluate={() => setActiveTab('evaluate')}/>
        ) : (
          <EvaluateLeaseView setActiveTab={setActiveTab}/>
        )}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        SafeRoom Bangkok • Built with Google Gemini for Devpost Learn AI Basics Hackathon
      </footer>
      
      {/* Floating AI Accommodation Assistant */}
      <RentalChatbot/>
    </div>
  );
}
