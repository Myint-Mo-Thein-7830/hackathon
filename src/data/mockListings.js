/**
 * SafeRoom Verified Accommodations Dataset (Bangkok Multi-District Dataset)
 * Complete with direct Google Maps search and place links.
 */
import rawListings from './mockListings.json';

export const BANGKOK_50_DISTRICTS = [
  "All 50 Districts",
  "Bang Bon", "Bang Kapi", "Bang Khen", "Bang Kho Laem", "Bang Khun Thian",
  "Bang Na", "Bang Phlat", "Bang Rak", "Bang Sue", "Bangkok Noi",
  "Bangkok Yai", "Bueng Kum", "Chatuchak", "Chom Thong", "Din Daeng",
  "Don Mueang", "Dusit", "Huai Khwang", "Khan Na Yao", "Khlong Sam Wa",
  "Khlong San", "Khlong Toei", "Lak Si", "Lat Krabang", "Lat Phrao",
  "Min Buri", "Nong Chok", "Nong Khaem", "Pathum Wan", "Phasi Charoen",
  "Phaya Thai", "Phra Khanong", "Phra Nakhon", "Pom Prap Sattru Phai", "Prawet",
  "Rat Burana", "Ratchathewi", "Sai Mai", "Samphanthawong", "Saphan Sung",
  "Sathon", "Suan Luang", "Taling Chan", "Tawi Watthana", "Thon Buri",
  "Thung Khru", "Wang Thonglang", "Watthana", "Yan Nawa"
];

export const MOCK_LISTINGS = rawListings.map(item => {
  const isCondo = item.type === 'Condominium' || item.propertyType === 'condo';
  const rent = item.rent || item.baseRent || 5000;
  const deposit = item.depositMonths ?? (isCondo ? 2 : 1);
  const upfront = item.totalMoveInCash || item.upfrontCash || (rent * (deposit + 1));
  const isGov = item.isGovernmentMeter ?? isCondo;
  const electricRate = isGov ? 4.5 : (item.electricityRate || 7.0);
  const monthlyElectric = isGov ? 1125 : Math.round(250 * electricRate);
  const monthlyTotal = rent + monthlyElectric + 200;

  return {
    ...item,
    title: item.title || item.name,
    baseRent: rent,
    rent: rent,
    depositMonths: deposit,
    advanceRentMonths: item.advanceRentMonths || 1,
    totalMoveInCash: upfront,
    upfrontCash: upfront,
    propertyType: isCondo ? 'condo' : 'apartment',
    location: item.location || `${item.transit || item.landmark || item.address} • ${item.district}`,
    isGovernmentMeter: isGov,
    electricBillingType: isGov ? 'direct_mea' : 'submeter_flat',
    electricityRate: electricRate,
    electricRatePerUnit: isGov ? null : electricRate,
    safetyScore: item.safetyScore || 95,
    riskLevel: item.riskLevel || (item.safetyScore >= 80 ? 'safe' : 'caution'),
    monthlyElectricEst: item.monthlyElectricEst || monthlyElectric,
    monthlyTotalEst: item.monthlyTotalEst || monthlyTotal,
    gougeDeltaMonthly: item.gougeDeltaMonthly || (isGov ? 0 : Math.max(0, (electricRate - 7.0) * 250)),
    verifiedFeatures: item.verifiedFeatures || item.amenities || [],
    redFlags: item.redFlags || [],
    inquiryScript: item.inquiryScript || `Hello! I would like to schedule an in-person viewing for ${item.name} (${rent.toLocaleString()} THB/mo). Please let me know what days and times are available.`
  };
});
