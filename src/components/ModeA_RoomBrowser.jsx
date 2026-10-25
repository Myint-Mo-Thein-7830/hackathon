import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  Home, 
  X, 
  ShieldCheck, 
  RotateCcw,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MOCK_LISTINGS } from '../data/mockListings';
import RoomCard from './RoomCard';
import SafetyScorecard from './SafetyScorecard';

export default function ModeA_RoomBrowser({ onSwitchToEvaluate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All'); // 'All' | 'Condo' | 'Dorm'
  const [maxRent, setMaxRent] = useState(16000);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Pagination state (6 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic covering all of Bangkok
  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q)) ||
        (item.address && item.address.toLowerCase().includes(q)) ||
        (item.landmark && item.landmark.toLowerCase().includes(q)) ||
        (item.transit && item.transit.toLowerCase().includes(q));

      const matchesType =
        propertyFilter === 'All' ||
        (propertyFilter === 'Condo' && (item.type === 'Condominium' || item.propertyType === 'condo')) ||
        (propertyFilter === 'Dorm' && (item.type?.includes('Apartment') || item.propertyType === 'apartment'));

      const price = item.rent || item.baseRent;
      const matchesPrice = price <= maxRent;

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchQuery, propertyFilter, maxRent]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, propertyFilter, maxRent]);

  // Paginated items
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredListings, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPropertyFilter('All');
    setMaxRent(16000);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Rebranded Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-2 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Greater Bangkok Pre-Screened Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Find & Evaluate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">Ideal Rental Accommodation</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Transparent cost calculations, fair lease verification, and pre-screened rooms tailored for students and young professionals across Bangkok.
        </p>

        {/* Callout Banner to Companion Tool */}
        <div className="pt-3">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 shadow-sm">
            <span>Evaluating an outside listing from Facebook Marketplace or LINE?</span>
            <button
              onClick={onSwitchToEvaluate}
              className="font-bold underline text-indigo-300 hover:text-white flex items-center space-x-1"
            >
              <span>Evaluate a Lease →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Search & Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Universal Search Input (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-accommodations-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any district, transit, campus (KMUTT, Ari, Rama 9, Sukhumvit)..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/80 transition-all"
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
              id="filter-type-all"
              onClick={() => setPropertyFilter('All')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
                propertyFilter === 'All'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              id="filter-type-condos"
              onClick={() => setPropertyFilter('Condo')}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                propertyFilter === 'Condo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Condos</span>
            </button>
            <button
              id="filter-type-dorms"
              onClick={() => setPropertyFilter('Dorm')}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                propertyFilter === 'Dorm'
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
              <span className="text-emerald-400 font-bold">{maxRent.toLocaleString()} THB</span>
            </div>
            <input
              type="range"
              min="4000"
              max="20000"
              step="500"
              value={maxRent}
              onChange={(e) => setMaxRent(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results Count & Quick Location Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800/80">
          <div className="text-slate-400 flex items-center space-x-2">
            <span>
              Showing <span className="font-bold text-white">{filteredListings.length}</span> verified accommodations in Bangkok
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Popular Hubs:</span>
            {['KMUTT', 'Ari', 'Sukhumvit', 'Rama 9'].map(hub => (
              <button
                key={hub}
                onClick={() => setSearchQuery(hub)}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                {hub}
              </button>
            ))}
            {(searchQuery || propertyFilter !== 'All' || maxRent < 16000) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 ml-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Accommodations Grid */}
      {paginatedListings.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 rounded-full bg-slate-900 w-12 h-12 mx-auto flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No Matching Accommodations Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, raising your maximum rent budget, or resetting filters.
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
          {paginatedListings.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onSelectRoom={setSelectedRoom}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl border flex items-center space-x-1 text-xs font-semibold transition-all ${
              currentPage === 1
                ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-xl border flex items-center space-x-1 text-xs font-semibold transition-all ${
              currentPage === totalPages
                ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal: Full Safety Scorecard Inspection for Pre-Screened Room */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-start space-x-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-1">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-extrabold text-xl text-white">{selectedRoom.name || selectedRoom.title}</h3>
                  <p className="text-xs text-indigo-300 font-medium">{selectedRoom.landmark} • {selectedRoom.district}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedRoom.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {selectedRoom.googleMapsUrl && (
                  <a
                    href={selectedRoom.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span className="hidden sm:inline">Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                )}
                <button
                  id="close-room-modal-btn"
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mount Full Unified Safety Scorecard */}
            <SafetyScorecard
              auditResult={{
                score: selectedRoom.safetyScore,
                riskLevel: selectedRoom.riskLevel || (selectedRoom.safetyScore >= 80 ? 'safe' : 'caution'),
                propertyType: (selectedRoom.type === 'Condominium' || selectedRoom.propertyType === 'condo') ? 'condo' : 'apartment',
                propertyName: selectedRoom.name || selectedRoom.title,
                detectedRent: selectedRoom.rent || selectedRoom.baseRent,
                depositMonths: selectedRoom.depositMonths,
                upfrontCash: selectedRoom.totalMoveInCash || selectedRoom.upfrontCash,
                electricRate: selectedRoom.isGovernmentMeter ? null : (selectedRoom.electricityRate || selectedRoom.electricRatePerUnit),
                electricBillingType: selectedRoom.isGovernmentMeter ? 'direct_mea' : 'submeter_flat',
                monthlyElectricEst: selectedRoom.monthlyElectricEst || (selectedRoom.isGovernmentMeter ? 1125 : Math.round(250 * selectedRoom.electricityRate)),
                monthlyTotalEst: selectedRoom.monthlyTotalEst || ((selectedRoom.rent || selectedRoom.baseRent) + (selectedRoom.isGovernmentMeter ? 1125 : Math.round(250 * selectedRoom.electricityRate)) + 200),
                gougeDeltaMonthly: selectedRoom.gougeDeltaMonthly || 0,
                redFlags: selectedRoom.redFlags || [],
                inquiryScript: selectedRoom.inquiryScript
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
