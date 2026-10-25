import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Building2, 
  Home, 
  X, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MOCK_LISTINGS } from '../data/mockListings';
import RoomCard from './RoomCard';
import SafetyScorecard from './SafetyScorecard';

export default function ModeA_RoomBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all'); // 'all' | 'condo' | 'apartment'
  const [maxBudget, setMaxBudget] = useState(15000);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Filter logic
  const filteredRooms = useMemo(() => {
    return MOCK_LISTINGS.filter(room => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        room.title.toLowerCase().includes(query) || 
        room.location.toLowerCase().includes(query) ||
        room.description.toLowerCase().includes(query);

      // Property type match
      const matchesType = propertyFilter === 'all' || room.propertyType === propertyFilter;

      // Price match
      const matchesPrice = room.baseRent <= maxBudget;

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchQuery, propertyFilter, maxBudget]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPropertyFilter('all');
    setMaxBudget(15000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-2 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Pre-Vetted & Audit-Verified Properties</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Browse Pre-Screened <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">Safe Rooms</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Every listing is pre-inspected for legitimate deposit structures and transparent electricity billing models. No phantom listings, zero predatory markups.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box (6 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by campus, MRT, BTS, or building name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/80 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Property Type Filter (4 cols) */}
          <div className="md:col-span-4 flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPropertyFilter('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
                propertyFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              id="filter-condos-tab"
              onClick={() => setPropertyFilter('condo')}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                propertyFilter === 'condo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Condos</span>
            </button>
            <button
              id="filter-apartments-tab"
              onClick={() => setPropertyFilter('apartment')}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                propertyFilter === 'apartment'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Dorms</span>
            </button>
          </div>

          {/* Max Budget Slider (3 cols) */}
          <div className="md:col-span-3 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">Max Rent:</span>
              <span className="text-emerald-400 font-bold">{maxBudget.toLocaleString()} THB</span>
            </div>
            <input
              type="range"
              min="4000"
              max="15000"
              step="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results Count & Reset row */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
          <div className="text-slate-400">
            Showing <span className="font-bold text-white">{filteredRooms.length}</span> of {MOCK_LISTINGS.length} pre-vetted rooms
          </div>

          {(searchQuery || propertyFilter !== 'all' || maxBudget < 15000) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 rounded-full bg-slate-900 w-12 h-12 mx-auto flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No Matching Rooms Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, raising your budget limit, or changing the property type filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onSelectRoom={setSelectedRoom}
            />
          ))}
        </div>
      )}

      {/* Modal: Full Safety Scorecard Inspection for Pre-Vetted Room */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-white">{selectedRoom.title}</h3>
                  <p className="text-xs text-slate-400">{selectedRoom.location}</p>
                </div>
              </div>

              <button
                id="close-room-modal-btn"
                onClick={() => setSelectedRoom(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mount Full Unified Safety Scorecard */}
            <SafetyScorecard
              auditResult={{
                score: selectedRoom.safetyScore,
                riskLevel: selectedRoom.riskLevel,
                propertyType: selectedRoom.propertyType,
                detectedRent: selectedRoom.baseRent,
                depositMonths: selectedRoom.depositMonths,
                upfrontCash: selectedRoom.upfrontCash,
                electricRate: selectedRoom.electricRatePerUnit,
                electricBillingType: selectedRoom.electricBillingType,
                monthlyElectricEst: selectedRoom.monthlyElectricEst,
                monthlyTotalEst: selectedRoom.monthlyTotalEst,
                gougeDeltaMonthly: selectedRoom.gougeDeltaMonthly,
                redFlags: selectedRoom.redFlags,
                inquiryScript: selectedRoom.inquiryScript
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
