import React from 'react';
import { ShieldCheck, Search, ShieldAlert, Sparkles, Building2, Home } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveMode('audit')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Safe<span className="text-emerald-400">Room</span></span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Condo vs. Dorm Logic
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Housing Scam Guard & Verified Room Finder</p>
            </div>
          </div>

          {/* Dual-Door Mode Switcher */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              id="mode-audit-tab"
              onClick={() => setActiveMode('audit')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeMode === 'audit'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Audit Listing</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[9px] bg-indigo-900/80 text-indigo-200 font-mono">
                Star Demo
              </span>
            </button>

            <button
              id="mode-browse-tab"
              onClick={() => setActiveMode('browse')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeMode === 'browse'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Safe Rooms</span>
            </button>
          </nav>

          {/* Hackathon Badge */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Devpost Learn: Build With AI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
