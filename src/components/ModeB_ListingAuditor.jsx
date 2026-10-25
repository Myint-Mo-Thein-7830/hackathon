import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Calculator,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { 
  analyzeStructuredLease, 
  DEMO_PRESETS 
} from '../services/analyzer';

export default function ModeB_ListingAuditor({ onAuditResult, auditResult }) {
  // Form State
  const [propertyName, setPropertyName] = useState('Pracha Uthit Student Court (Near KMUTT)');
  const [propertyType, setPropertyType] = useState('apartment'); // 'condo' | 'apartment'
  const [rent, setRent] = useState(4500);
  const [depositMonths, setDepositMonths] = useState(1);
  const [advancePaymentTiming, setAdvancePaymentTiming] = useState('advance'); // 'advance' | 'end_of_month'
  const [electricBillingType, setElectricBillingType] = useState('submeter_flat'); // 'direct_mea' | 'submeter_flat'
  const [electricRate, setElectricRate] = useState(7.0);

  // Quick rent quick-chips
  const rentChips = [5000, 7500, 10000, 15000];

  const handleEvaluate = (customData = null) => {
    const dataToUse = customData || {
      propertyName,
      propertyType,
      rent: Number(rent),
      depositMonths: Number(depositMonths),
      advancePaymentTiming,
      electricBillingType,
      electricRate: electricBillingType === 'direct_mea' ? null : Number(electricRate)
    };

    const result = analyzeStructuredLease(dataToUse);
    onAuditResult(result);
  };

  const loadPreset = (presetKey) => {
    const preset = DEMO_PRESETS[presetKey];
    if (!preset) return;

    setPropertyName(preset.data.propertyName);
    setPropertyType(preset.data.propertyType);
    setRent(preset.data.rent);
    setDepositMonths(preset.data.depositMonths);
    setAdvancePaymentTiming(preset.data.advancePaymentTiming);
    setElectricBillingType(preset.data.electricBillingType);
    setElectricRate(preset.data.electricRate || 7.0);

    handleEvaluate(preset.data);
  };

  const handleReset = () => {
    setPropertyName('');
    setPropertyType('apartment');
    setRent(5000);
    setDepositMonths(1);
    setAdvancePaymentTiming('advance');
    setElectricBillingType('submeter_flat');
    setElectricRate(7.0);
    onAuditResult(null);
  };

  return (
    <div className="space-y-6 bg-transparent">
      {/* Rebranded Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 pt-2 bg-transparent">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Smart Rental Living Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find & Evaluate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400">Ideal Rental Accommodation</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Transparent cost calculations, fair lease verification, and pre-screened rooms tailored for students and young professionals.
        </p>
      </div>

      {/* 3 1-Click Demo Buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>1-Click Lease Demo Scenarios (Instant Auto-Fill):</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Form</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Preset 1: Budget Dorm */}
          <button
            id="preset-budget-dorm"
            onClick={() => loadPreset('budgetDorm')}
            className="p-3.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 dark:bg-slate-950/70 dark:hover:bg-slate-950 border border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/60 transition-all text-left shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Sample 1: Budget Dorm</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono">Fair</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
              Pracha Uthit Dorm (4,500 THB rent, 1+1 deposit, 7 THB sub-meter)
            </p>
          </button>

          {/* Preset 2: Luxury Transit Condo */}
          <button
            id="preset-luxury-condo"
            onClick={() => loadPreset('luxuryCondo')}
            className="p-3.5 rounded-xl bg-indigo-50/60 hover:bg-indigo-50 dark:bg-slate-950/70 dark:hover:bg-slate-950 border border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all text-left shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">Sample 2: Transit Condo</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-mono">Fair</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
              Ideo Sukhumvit 93 (13,000 THB rent, 2+1 deposit, direct MEA meter)
            </p>
          </button>

          {/* Preset 3: Overpriced Sub-Meter Unit */}
          <button
            id="preset-overpriced-unit"
            onClick={() => loadPreset('overpricedUnit')}
            className="p-3.5 rounded-xl bg-red-50/60 hover:bg-red-50 dark:bg-slate-950/70 dark:hover:bg-slate-950 border border-red-200 dark:border-red-500/30 hover:border-red-400 dark:hover:border-red-500/60 transition-all text-left shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800 dark:text-red-300">Sample 3: Overpriced Dorm</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 font-mono">High Risk</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
              Demanding 3-month deposit & 10 THB/unit electricity markup
            </p>
          </button>
        </div>
      </div>

      {/* Structured Multi-Input Lease Questionnaire Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lease Terms Questionnaire</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Input the key terms from your contract or landlord conversation for an instant evaluation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input 1: Property Name or Location */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>1. Property Name or Location</span>
            </label>
            <input
              id="input-property-name"
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g. Ideo Sukhumvit 93 or Dorm near KMUTT campus"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
            />
          </div>

          {/* Input 2: Property Type Segmented Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <span>2. Property Type</span>
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                id="toggle-condo"
                onClick={() => {
                  setPropertyType('condo');
                  if (depositMonths === 1) setDepositMonths(2);
                  setElectricBillingType('direct_mea');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  propertyType === 'condo'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Condominium</span>
              </button>

              <button
                type="button"
                id="toggle-apartment"
                onClick={() => {
                  setPropertyType('apartment');
                  if (depositMonths === 2) setDepositMonths(1);
                  setElectricBillingType('submeter_flat');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  propertyType === 'apartment'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Apartment / Dorm</span>
              </button>
            </div>
          </div>

          {/* Input 3: Monthly Base Rent */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>3. Monthly Base Rent (THB)</span>
              </label>
              <div className="flex space-x-1">
                {rentChips.map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setRent(chip)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent transition-colors"
                  >
                    {chip.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                id="input-rent"
                type="number"
                min="1000"
                max="100000"
                step="500"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                THB / mo
              </span>
            </div>
          </div>

          {/* Input 4: Required Security Deposit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>4. Required Security Deposit</span>
            </label>
            <select
              id="select-deposit"
              value={depositMonths}
              onChange={(e) => setDepositMonths(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value={1}>1 Month Deposit (Standard for Apartments/Dorms)</option>
              <option value={2}>2 Months Deposit (Standard for Condominiums)</option>
              <option value={3}>3+ Months Deposit (Unusual / High Hazard)</option>
            </select>
          </div>

          {/* Input 5: Advance Rent Payment Timing */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>5. Advance Rent Payment Timing</span>
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAdvancePaymentTiming('advance')}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                  advancePaymentTiming === 'advance'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Advance at Month Start
              </button>
              <button
                type="button"
                onClick={() => setAdvancePaymentTiming('end_of_month')}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                  advancePaymentTiming === 'end_of_month'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Pay at End of Month
              </button>
            </div>
          </div>

          {/* Input 6: Electricity Billing Model */}
          <div className="space-y-3 md:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>6. Electricity Billing Model</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  electricBillingType === 'direct_mea'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/60 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="electric-type"
                  checked={electricBillingType === 'direct_mea'}
                  onChange={() => setElectricBillingType('direct_mea')}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Direct Government Bill (MEA/PEA)</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Official progressive utility meter (~4.5 THB/unit average). Standard for condos.
                  </p>
                </div>
              </label>

              <label 
                className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  electricBillingType === 'submeter_flat'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/60 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="electric-type"
                  checked={electricBillingType === 'submeter_flat'}
                  onChange={() => setElectricBillingType('submeter_flat')}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Private Sub-Meter Flat Rate</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Building charges a set THB per unit. Typical for student apartments (6–8 THB).
                  </p>
                </div>
              </label>
            </div>

            {/* Revealed Sub-Meter Rate Input */}
            {electricBillingType === 'submeter_flat' && (
              <div className="pt-2 flex items-center space-x-3">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Sub-Meter Rate per Unit:</span>
                <div className="relative w-36">
                  <input
                    id="input-electric-rate"
                    type="number"
                    min="4"
                    max="20"
                    step="0.5"
                    value={electricRate}
                    onChange={(e) => setElectricRate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-xs text-amber-700 dark:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                    THB / unit
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {electricRate >= 9 ? (
                    <span className="text-red-600 dark:text-red-400 font-bold">⚠️ Predatory markup!</span>
                  ) : electricRate > 8 ? (
                    <span className="text-amber-600 dark:text-amber-400">Above average normal</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400">✓ Fair market rate</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            id="evaluate-lease-btn"
            onClick={() => handleEvaluate()}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>Evaluate Lease & Calculate True Costs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
