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
  ChevronRight,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { MOCK_LISTINGS, BANGKOK_50_DISTRICTS } from '../data/mockListings';
import RoomCard from './RoomCard';
import SafetyScorecard from './SafetyScorecard';

export default function ModeA_RoomBrowser({ onSwitchToEvaluate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All'); // 'All' | 'Condo' | 'Dorm'
  const [selectedDistrict, setSelectedDistrict] = useState('All 50 Districts');
  
  // Dual price filter states
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(20000);

  const [selectedRoom, setSelectedRoom] = useState(null);

  // Pagination state (6 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Price Quick-Filter Presets
  const pricePills = [
    { label: 'Under 5k', min: 0, max: 5000 },
    { label: '5k - 8k', min: 5000, max: 8000 },
    { label: '8k - 12k', min: 8000, max: 12000 },
    { label: '12k - 20k', min: 12000, max: 20000 },
    { label: 'Any', min: 0, max: 50000 }
  ];

  const handleApplyPricePill = (min, max) => {
    setMinRent(min);
    setMaxRent(max);
  };

  // Comprehensive Filter Logic
  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((item) => {
      // 1. Text Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.district && item.district.toLowerCase().includes(q)) ||
        (item.address && item.address.toLowerCase().includes(q)) ||
        (item.landmark && item.landmark.toLowerCase().includes(q)) ||
        (item.transit && item.transit.toLowerCase().includes(q));

      // 2. Property Type Match
      const matchesType =
        propertyFilter === 'All' ||
        (propertyFilter === 'Condo' && (item.type === 'Condominium' || item.propertyType === 'condo')) ||
        (propertyFilter === 'Dorm' && (item.type?.includes('Apartment') || item.propertyType === 'apartment'));

      // 3. 50-District Match
      const matchesDistrict =
        selectedDistrict === 'All 50 Districts' ||
        (item.district && item.district.toLowerCase().includes(selectedDistrict.toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(selectedDistrict.toLowerCase()));

      // 4. Dual Price Match
      const price = item.rent || item.baseRent;
      const matchesPrice = price >= minRent && price <= maxRent;

      return matchesSearch && matchesType && matchesDistrict && matchesPrice;
    });
  }, [searchQuery, propertyFilter, selectedDistrict, minRent, maxRent]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, propertyFilter, selectedDistrict, minRent, maxRent]);

  // Paginated items
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredListings, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPropertyFilter('All');
    setSelectedDistrict('All 50 Districts');
    setMinRent(0);
    setMaxRent(20000);
    setCurrentPage(1);
  };

  // Google Maps Dynamic Query URL
  const districtMapsQuery = encodeURIComponent(
    'condo apartment in ' + (selectedDistrict === 'All 50 Districts' ? 'Bangkok' : selectedDistrict + ' Bangkok')
  );
  const districtGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${districtMapsQuery}`;

  return (
    <div className="space-y-8 bg-transparent">
      {/* Rebranded Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-2 pt-2 bg-transparent">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Bangkok Verified Rental Living Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find & Evaluate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400">Ideal Rental Accommodation</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Transparent cost calculations, fair lease verification, and pre-screened rooms tailored for students and young professionals across Bangkok.
        </p>

        {/* Callout Banner to Companion Tool */}
        <div className="pt-2 bg-transparent">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-900 dark:text-indigo-200 shadow-sm">
            <span>Evaluating an outside listing from Facebook Marketplace or LINE?</span>
            <button
              onClick={onSwitchToEvaluate}
              className="font-bold underline text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white flex items-center space-x-1"
            >
              <span>Evaluate a Lease →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Dashboard */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Row 1: Search + Property Type Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Universal Search Input (7 cols) */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-accommodations-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by campus, landmark, BTS/MRT, address (e.g. KMUTT, Bang Chak, Ari)..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Property Type Toggle (5 cols) */}
          <div className="md:col-span-5 flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              id="filter-type-all"
              onClick={() => setPropertyFilter('All')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                propertyFilter === 'All'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              id="filter-type-condos"
              onClick={() => setPropertyFilter('Condo')}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                propertyFilter === 'Condo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Condos</span>
            </button>
            <button
              id="filter-type-dorms"
              onClick={() => setPropertyFilter('Dorm')}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                propertyFilter === 'Dorm'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dorms</span>
            </button>
          </div>
        </div>

        {/* Row 2: 50 Districts Selector + Dual Price Filtering */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {/* 50 Bangkok Districts Dropdown (4 cols) */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Bangkok District (All 50)</span>
            </label>
            <select
              id="district-dropdown-selector"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
            >
              {BANGKOK_50_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Dual Numeric Price Inputs (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <span>Monthly Rent Range (THB)</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {minRent.toLocaleString()} – {maxRent.toLocaleString()} THB
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  id="input-min-rent"
                  type="number"
                  min="0"
                  max="50000"
                  step="500"
                  value={minRent}
                  onChange={(e) => setMinRent(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Min THB"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">Min</span>
              </div>
              <div className="relative">
                <input
                  id="input-max-rent"
                  type="number"
                  min="0"
                  max="50000"
                  step="500"
                  value={maxRent}
                  onChange={(e) => setMaxRent(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Max THB"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">Max</span>
              </div>
            </div>
          </div>

          {/* Rent Slider synced with Max Rent (3 cols) */}
          <div className="md:col-span-3 space-y-1">
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
              <span>Slider Adjustment</span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{maxRent.toLocaleString()} THB</span>
            </div>
            <input
              type="range"
              min="4000"
              max="20000"
              step="500"
              value={Math.min(20000, maxRent)}
              onChange={(e) => setMaxRent(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Row 3: Quick Filter Price Pills & Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">Quick Price:</span>
            {pricePills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => handleApplyPricePill(pill.min, pill.max)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                  minRent === pill.min && maxRent === pill.max
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              Showing <strong className="text-slate-900 dark:text-white">{filteredListings.length}</strong> matching rooms
            </span>

            {(searchQuery || propertyFilter !== 'All' || selectedDistrict !== 'All 50 Districts' || minRent > 0 || maxRent < 20000) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1 ml-2 transition-colors font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic 50-District Google Maps Explorer Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start space-x-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 flex-shrink-0 mx-auto sm:mx-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Exploring accommodations in {selectedDistrict === 'All 50 Districts' ? 'Bangkok' : selectedDistrict}?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              View all live condominium and apartment listings in {selectedDistrict === 'All 50 Districts' ? 'Bangkok' : selectedDistrict} directly on Google Maps.
            </p>
          </div>
        </div>

        <a
          id="google-maps-district-link"
          href={districtGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex-shrink-0"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Open {selectedDistrict === 'All 50 Districts' ? 'Bangkok' : selectedDistrict} on Maps</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      {/* Accommodations Card Grid Section */}
      <section className="bg-transparent">
        {paginatedListings.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-950 w-12 h-12 mx-auto flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No Matching Accommodations Found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms, selecting "All 50 Districts", or widening your rent price range.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-transparent">
            {paginatedListings.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onSelectRoom={setSelectedRoom}
              />
            ))}
          </div>
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl border flex items-center space-x-1 text-xs font-semibold transition-all ${
              currentPage === 1
                ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal: Full Safety Scorecard Inspection for Pre-Screened Room */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start space-x-3">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-1">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">{selectedRoom.name || selectedRoom.title}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold">{selectedRoom.landmark || selectedRoom.transit} • {selectedRoom.district}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedRoom.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {selectedRoom.googleMapsUrl && (
                  <a
                    href={selectedRoom.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center space-x-1 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="hidden sm:inline">Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                <button
                  id="close-room-modal-btn"
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
