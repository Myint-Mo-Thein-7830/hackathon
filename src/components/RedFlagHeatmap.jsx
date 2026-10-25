import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RedFlagHeatmap({ redFlags, propertyType }) {
  if (!redFlags) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-red-500 dark:text-red-400" />
          <span>Red-Flag Heatmap & Exploitation Audit</span>
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
          redFlags.length === 0 
            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
            : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'
        }`}>
          {redFlags.length} Flag{redFlags.length === 1 ? '' : 's'} Detected
        </span>
      </div>

      {redFlags.length === 0 ? (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-emerald-800 dark:text-emerald-300">Clean Legal & Market Alignment</div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
              No predatory clauses, excessive deposit multiples, or utility rate markups were found. Listing adheres to standard {propertyType === 'condo' ? 'Condominium' : 'Apartment'} guidelines.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {redFlags.map((flag, idx) => {
            const isHazard = flag.severity === 'hazard';
            const isWarning = flag.severity === 'warning';

            return (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border transition-all ${
                  isHazard
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/40 text-red-900 dark:text-red-200 shadow-sm'
                    : isWarning
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 p-1 rounded-md flex-shrink-0 ${
                    isHazard 
                      ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' 
                      : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {isHazard ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
                        {flag.title}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded uppercase font-bold ${
                        isHazard 
                          ? 'bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200' 
                          : 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
                      }`}>
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {flag.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
