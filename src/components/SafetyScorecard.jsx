import React from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  AlertTriangle, 
  Building2, 
  Home, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import CostCalculator from './CostCalculator';
import RedFlagHeatmap from './RedFlagHeatmap';
import InquiryCopilot from './InquiryCopilot';

export default function SafetyScorecard({ auditResult }) {
  if (!auditResult) return null;

  const { score, riskLevel, propertyType, redFlags, inquiryScript } = auditResult;
  const isCondo = propertyType === 'condo';

  // Gauge colors and descriptions
  let strokeColor = '#10b981'; // safe
  let glowClass = 'glow-safe';
  let badgeText = 'LOW RISK / VERIFIED SAFE';
  let badgeBg = 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40';

  if (riskLevel === 'hazard') {
    strokeColor = '#ef4444';
    glowClass = 'glow-hazard';
    badgeText = 'HIGH HAZARD / PREDATORY';
    badgeBg = 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-500/40';
  } else if (riskLevel === 'caution') {
    strokeColor = '#f59e0b';
    glowClass = 'glow-caution';
    badgeText = 'NEEDS REVIEW / CAUTION';
    badgeBg = 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40';
  }

  // Circular progress calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div id="safety-scorecard" className={`rounded-2xl p-6 sm:p-8 space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl transition-all duration-300 ${glowClass}`}>
      {/* Header Banner & Gauge Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        {/* Left: Status Title & Benchmark Pill */}
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wide border ${badgeBg}`}>
              {badgeText}
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {isCondo ? <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> : <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              <span>{isCondo ? 'Condominium Rules Applied' : 'Apartment/Dormitory Rules Applied'}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {auditResult.propertyName || 'Lease Terms Scorecard'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            {isCondo
              ? 'Evaluated against legal condo baselines: direct MEA/PEA government meter billing and maximum 2-month security deposit limit.'
              : 'Evaluated against fair student dorm benchmarks: 6–8 THB/unit sub-meter electric rate and standard 1-month deposit.'}
          </p>
        </div>

        {/* Right: SVG Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-200 dark:text-slate-800/80"
              fill="transparent"
            />
            {/* Animated Gauge Arc */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Number in Gauge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
              {score}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              / 100 Safe
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: True Upfront Cash & Monthly Outflow Breakdown */}
      <CostCalculator auditResult={auditResult} />

      {/* Section 2: Red-Flag Heatmap */}
      <RedFlagHeatmap redFlags={redFlags} propertyType={propertyType} />

      {/* Section 3: Landlord Inquiry Copilot */}
      <InquiryCopilot script={inquiryScript} propertyType={propertyType} />

      {/* Domain Logic Transparency Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-300 font-semibold">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Why Property Type Calibration Matters</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          In Thailand, landlords often misrepresent apartments as condos or charge private markups on condo electricity.
          SafeRoom prevents false alarms: a 2-month deposit is normal and expected for high-rise condos, but is abusive for standard student dorms (which strictly cap at 1 month). Similarly, a 7 THB electric rate is fair for a dorm sub-meter, but is an unlawful markup for a condo that should have a direct MEA meter.
        </p>
      </div>
    </div>
  );
}
