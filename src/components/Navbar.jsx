import React from 'react';
import { ShieldCheck, Search, Calculator, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode, theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveMode('browse')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Safe<span className="text-emerald-600 dark:text-emerald-400">Room</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-emerald-200 dark:border-indigo-500/20">
                  Rental Assistant
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">Smart Accommodation & Rental Living Assistant</p>
            </div>
          </div>

          {/* Center: Dual-Door Mode Switcher */}
          <nav className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              id="mode-browse-tab"
              onClick={() => setActiveMode('browse')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeMode === 'browse'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Accommodations</span>
            </button>

            <button
              id="mode-evaluate-tab"
              onClick={() => setActiveMode('evaluate')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeMode === 'evaluate'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Evaluate a Lease</span>
            </button>
          </nav>

          {/* Right: Theme Toggle & Status Badge */}
          <div className="flex items-center space-x-3">
            {/* Daylight / Night Mode Toggle Switch */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Daylight (Light) Mode' : 'Night (Dark) Mode'}`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Hackathon Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Devpost: Build With AI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
