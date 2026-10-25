import React from 'react';
import { DollarSign, Zap, Droplets, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { MONTHLY_KWH_BASELINE, MONTHLY_WATER_ESTIMATE, APARTMENT_FAIR_ELECTRIC_RATE, MEA_ESTIMATED_MONTHLY_COST } from '../services/analyzer';

export default function CostCalculator({ auditResult }) {
  if (!auditResult) return null;

  const {
    detectedRent,
    depositMonths,
    upfrontCash,
    electricRate,
    electricBillingType,
    monthlyElectricEst,
    monthlyTotalEst,
    gougeDeltaMonthly,
    propertyType
  } = auditResult;

  const isCondo = propertyType === 'condo';
  const standardDepositMonths = isCondo ? 2 : 1;
  const isDepositOverStandard = depositMonths > standardDepositMonths;
  const excessDepositCash = isDepositOverStandard ? (depositMonths - standardDepositMonths) * detectedRent : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>True Upfront Cash & Monthly Outflow</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          Based on {MONTHLY_KWH_BASELINE} kWh/mo student baseline
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Upfront Move-in Cash Required */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Move-In Cash Needed</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              isDepositOverStandard
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {depositMonths} Deposit + 1 Advance
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {upfrontCash.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">THB Upfront</span>
          </div>

          {/* Upfront Breakdown Details */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Security Deposit ({depositMonths} mo):</span>
              <span className="font-mono">{(detectedRent * depositMonths).toLocaleString()} THB</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Advance First Month Rent:</span>
              <span className="font-mono">{detectedRent.toLocaleString()} THB</span>
            </div>
            {isDepositOverStandard && (
              <div className="p-2 rounded-lg bg-red-950/60 border border-red-900/60 text-red-300 text-[11px] flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Excess Deposit:</strong> Demands {depositMonths} months instead of standard {standardDepositMonths} month(s). 
                  Ties up <strong className="text-red-200">+{excessDepositCash.toLocaleString()} THB</strong> extra cash!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Real Monthly Living Outflow */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Real Monthly Living Outflow</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              Rent + Utilities
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {monthlyTotalEst.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">THB / month</span>
          </div>

          {/* Monthly Breakdown Details */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Base Room Rent:</span>
              <span className="font-mono">{detectedRent.toLocaleString()} THB</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>
                  Electricity ({isCondo ? 'Direct MEA Tier' : `${electricRate || 7} THB/unit`}):
                </span>
              </span>
              <span className="font-mono text-amber-300">~{monthlyElectricEst.toLocaleString()} THB</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 flex items-center space-x-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>Water / Facilities (Est.):</span>
              </span>
              <span className="font-mono text-cyan-300">~{MONTHLY_WATER_ESTIMATE.toLocaleString()} THB</span>
            </div>

            {/* Utility Gouge Delta Callout */}
            {gougeDeltaMonthly > 0 ? (
              <div className="p-2 rounded-lg bg-red-950/60 border border-red-900/60 text-red-300 text-[11px] flex items-start space-x-2">
                <TrendingUp className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Predatory Utility Penalty:</strong> Charging {electricRate} THB/unit over fair {APARTMENT_FAIR_ELECTRIC_RATE} THB benchmark.
                  Overpaying <strong className="text-red-200">+{gougeDeltaMonthly.toLocaleString()} THB/mo</strong> (~{(gougeDeltaMonthly * 12).toLocaleString()} THB/year lost)!
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 text-[11px] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Utility rates within fair market / direct government guidelines.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
