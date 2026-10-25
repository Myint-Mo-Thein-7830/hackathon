import React from 'react';
import { 
  Building2, 
  Home, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Maximize2
} from 'lucide-react';

export default function RoomCard({ room, onSelectRoom }) {
  const isCondo = room.type === 'Condominium' || room.propertyType === 'condo';
  const isSafe = room.safetyScore >= 80;

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm hover:shadow-md rounded-2xl overflow-hidden transition-all flex flex-col justify-between">
      <div>
        {/* Property Image & Overlay Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={room.imageUrl}
            alt={room.name || room.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
              isCondo
                ? 'bg-indigo-600 text-white'
                : 'bg-emerald-700 text-white'
            }`}>
              {isCondo ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
              <span>{room.type || (isCondo ? 'Condominium' : 'Apartment / Dorm')}</span>
            </span>

            {/* Safety Score Badge on image: high contrast text */}
            <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>{room.safetyScore}/100</span>
            </span>
          </div>

          {/* Size badge bottom right on image */}
          {room.sizeSqm && (
            <div className="absolute bottom-2.5 right-3">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white border border-white/20">
                {room.sizeSqm} m²
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Header Row: Title & Rent */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 flex-1">
              {room.name || room.title}
            </h3>
            <div className="text-right flex-shrink-0">
              <span className="text-slate-900 dark:text-white font-black text-lg">
                {(room.rent || room.baseRent).toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium ml-1">THB/mo</span>
            </div>
          </div>

          {/* Location / Landmark / Address subtext */}
          <div className="space-y-0.5">
            <p className="text-slate-600 dark:text-slate-400 text-xs flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="truncate">{room.landmark || room.district} • {room.transit || room.location}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate pl-4.5">
              {room.address}
            </p>
          </div>

          {/* Amenities pills */}
          <div className="pt-1 flex flex-wrap gap-1.5">
            {(room.amenities || room.verifiedFeatures || []).slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] px-2 py-0.5 rounded"
              >
                ✓ {amenity}
              </span>
            ))}
          </div>

          {/* Bottom Details Footer (Electricity & Move-In Cash) */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Electricity</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold truncate block">
                {room.isGovernmentMeter || room.electricBillingType === 'direct_mea'
                  ? '⚡ Direct MEA Govt'
                  : `⚡ Sub-meter ${room.electricityRate || room.electricRatePerUnit} THB`}
              </span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Move-In Cash</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate block">
                {(room.totalMoveInCash || room.upfrontCash).toLocaleString()} THB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row: Google Maps + Scorecard */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-12 gap-2">
        {/* Google Maps Link */}
        {room.googleMapsUrl && (
          <a
            href={room.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open on Google Maps"
            className="col-span-4 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center space-x-1 transition-all shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="truncate">Maps</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        )}

        {/* Inspect Scorecard Button */}
        <button
          onClick={() => onSelectRoom(room)}
          className={`${room.googleMapsUrl ? 'col-span-8' : 'col-span-12'} py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-95`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-200" />
          <span>Inspect Scorecard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
