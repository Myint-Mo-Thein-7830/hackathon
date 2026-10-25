import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Building2, 
  Home, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  FileText
} from 'lucide-react';
import { 
  analyzeListing, 
  SAMPLE_PREDATORY_APARTMENT, 
  SAMPLE_FAIR_CONDO 
} from '../services/analyzer';

export default function ModeB_ListingAuditor({ onAuditResult, auditResult }) {
  const [inputText, setInputText] = useState(SAMPLE_PREDATORY_APARTMENT);
  const [propertyType, setPropertyType] = useState('apartment');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Execute analysis
  const handleAnalyze = (textToAnalyze = inputText, typeToUse = propertyType) => {
    if (!textToAnalyze || textToAnalyze.trim().length === 0) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = analyzeListing(textToAnalyze, typeToUse);
      onAuditResult(result);
      setIsAnalyzing(false);
    }, 250);
  };

  // Load sample 1
  const loadPredatorySample = () => {
    setInputText(SAMPLE_PREDATORY_APARTMENT);
    setPropertyType('apartment');
    handleAnalyze(SAMPLE_PREDATORY_APARTMENT, 'apartment');
  };

  // Load sample 2
  const loadFairSample = () => {
    setInputText(SAMPLE_FAIR_CONDO);
    setPropertyType('condo');
    handleAnalyze(SAMPLE_FAIR_CONDO, 'condo');
  };

  const handleClear = () => {
    setInputText('');
    onAuditResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-2 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Property-Type Aware Inspection</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Audit Any Outside Listing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400">Hidden Scams & Gouging</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Paste text from Facebook Marketplace, LINE, or landlord chats. SafeRoom audits against distinct benchmarks for 
          <span className="text-slate-200 font-medium"> Condos</span> (direct MEA meters, 2+1 deposits) vs. 
          <span className="text-slate-200 font-medium"> Apartments/Dorms</span> (commercial sub-meters, 1+1 deposits).
        </p>
      </div>

      {/* 1-Click Star Demo Chips Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1-Click Live Demo Chips (Try These First):</span>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center space-x-1 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Input</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
          <button
            id="demo-chip-predatory"
            onClick={loadPredatorySample}
            className="group flex items-start space-x-3 p-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-red-500/30 hover:border-red-500/60 transition-all text-left shadow-sm hover:shadow-red-500/10"
          >
            <div className="mt-0.5 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-red-300">Sample 1: Predatory Apartment</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-900/60 text-red-200 font-mono">High Risk</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Demands 3-month deposit, 10 THB/unit electricity gouge & upfront booking fee.
              </p>
            </div>
          </button>

          <button
            id="demo-chip-fair"
            onClick={loadFairSample}
            className="group flex items-start space-x-3 p-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left shadow-sm hover:shadow-emerald-500/10"
          >
            <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-300">Sample 2: Fair Student Condo</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-200 font-mono">Safe</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Standard (2+1) deposit, direct MEA government meter, physical viewing welcomed.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Audit Input Panel */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-4">
        {/* Property Type Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Listing Text & Property Type:</span>
          </label>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPropertyType('auto')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                propertyType === 'auto'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Detect</span>
            </button>

            <button
              id="type-condo-btn"
              onClick={() => setPropertyType('condo')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                propertyType === 'condo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Condo</span>
            </button>

            <button
              id="type-apartment-btn"
              onClick={() => setPropertyType('apartment')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                propertyType === 'apartment'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Apartment / Dorm</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            id="listing-input-textarea"
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw rental listing text here... (e.g. rent price, deposit months, electricity rate per unit, water fee, booking details)"
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 font-mono transition-all resize-y"
          />
          <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-500">
            {inputText.length} characters
          </div>
        </div>

        {/* Submit Audit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Target Standard:</span>{' '}
            {propertyType === 'condo' ? (
              <span className="text-emerald-400">Condo (MEA Meter • Max 2 Mos Deposit)</span>
            ) : propertyType === 'apartment' ? (
              <span className="text-indigo-400">Apartment / Dorm (Sub-meter 6-8 THB • Max 1 Mo Deposit)</span>
            ) : (
              <span className="text-amber-400">Smart Auto-Detection based on text keywords</span>
            )}
          </div>

          <button
            id="run-audit-btn"
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !inputText.trim()}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
              isAnalyzing || !inputText.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isAnalyzing ? 'Auditing Listing...' : 'Run Safety Audit'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
