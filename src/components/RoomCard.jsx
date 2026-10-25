import React from 'react';
import { 
  Building2, 
  Home, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export default function RoomCard({ room, onSelectRoom }) {
  const isCondo = room.propertyType === 'condo';
  const isSafe = room.riskLevel === 'safe';

  return (
    <div className="group glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col">
      {/* Property Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={room.imageUrl}
          alt={room.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md backdrop-blur-md ${
            isCondo
              ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-700/50'
              : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/50'
          }`}>
            {isCondo ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
            <span className="capitalize">{room.propertyType}</span>
          </span>

          <span className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold shadow-md backdrop-blur-md ${
            isSafe
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
              : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
          }`}>
            {isSafe ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            <span>{room.safetyScore}/100</span>
          </span>
        </div>

        {/* Price Tag in Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1 text-white">
            <span className="text-2xl font-black font-mono tracking-tight">{room.baseRent.toLocaleString()}</span>
            <span className="text-xs text-slate-300 font-medium">THB/mo</span>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700">
            Move-in: {room.upfrontCash.toLocaleString()} THB
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors">
            {room.title}
          </h3>

          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>

          {/* Transparent Disclosures Row */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[9px] uppercase">Electricity Model</span>
              <span className="text-amber-400 font-bold truncate block">
                {room.electricBillingType === 'direct_mea' 
                  ? '⚡ Direct MEA Govt' 
                  : `⚡ Sub-meter ${room.electricRatePerUnit} THB`}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[9px] uppercase">Deposit Policy</span>
              <span className="text-emerald-400 font-bold truncate block">
                {room.depositMonths} Mo Dep + 1 Adv
              </span>
            </div>
          </div>

          {/* Verified Feature Pills */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {room.verifiedFeatures.slice(0, 3).map((feat, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectRoom(room)}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm group-hover:shadow-indigo-500/20"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:text-white" />
          <span>Inspect Safety Scorecard</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
