/**
 * SafeRoom Verified Accommodations Dataset
 * Real, recognizable student and young professional accommodations in Bangkok.
 */

export const MOCK_LISTINGS = [
  {
    id: 'bkk-1',
    title: 'Lumpini Ville Ratburana - Riverview',
    propertyType: 'condo',
    location: 'Rat Burana Rd, Bangkok (10 mins to KMUTT / Bangmod)',
    baseRent: 7500,
    depositMonths: 2,
    advanceRentMonths: 1,
    upfrontCash: 22500, // (2 deposit + 1 advance) * 7500
    electricBillingType: 'direct_mea',
    electricRatePerUnit: null,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1125, // MEA residential tier estimate (~4.5 THB/unit)
    monthlyTotalEst: 8825,
    gougeDeltaMonthly: 0,
    safetyScore: 98,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Direct MEA Government Meter (~4.5 THB)',
      'Standard (2 + 1) Move-In Terms',
      'Shuttle Van to BTS Krung Thonburi',
      'Swimming Pool, Gym & River Park'
    ],
    redFlags: [],
    inquiryScript: `Hello! I would like to schedule an in-person viewing for Lumpini Ville Ratburana - Riverview (7,500 THB/mo). Please let me know what days and times are available this week.`,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Popular riverside condominium near KMUTT. Excellent building juristic management, standard 2-month deposit, and direct MEA government meter electricity.'
  },
  {
    id: 'bkk-2',
    title: 'Pracha Uthit Student Court',
    propertyType: 'apartment',
    location: 'Soi Pracha Uthit 45, Thung Khru (Walking distance to KMUTT)',
    baseRent: 4500,
    depositMonths: 1,
    advanceRentMonths: 1,
    upfrontCash: 9000, // (1 deposit + 1 advance) * 4500
    electricBillingType: 'submeter_flat',
    electricRatePerUnit: 7.0,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1750, // 250 kWh * 7 THB
    monthlyTotalEst: 6450,
    gougeDeltaMonthly: 0,
    safetyScore: 95,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Standard Market Sub-Meter (7.0 THB/unit)',
      'Fair (1 + 1) Move-In Deposit',
      'Keycard Access & Gated CCTV',
      'Study Lounge & Coin Laundry'
    ],
    redFlags: [],
    inquiryScript: `Hello! I am inquiring about Pracha Uthit Student Court (4,500 THB/mo). Could you confirm the sub-meter rate (7 THB) and arrange a room walkthrough?`,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    description: 'Clean, secure student apartment only 5 minutes walking distance from KMUTT university gates. Strictly follows fair 1-month deposit guidelines.'
  },
  {
    id: 'bkk-3',
    title: 'Ideo Sukhumvit 93',
    propertyType: 'condo',
    location: 'Sukhumvit 93, Bang Chak, Phra Khanong (15m from BTS Skywalk)',
    baseRent: 13000,
    depositMonths: 2,
    advanceRentMonths: 1,
    upfrontCash: 39000, // (2 deposit + 1 advance) * 13000
    electricBillingType: 'direct_mea',
    electricRatePerUnit: null,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1125,
    monthlyTotalEst: 14325,
    gougeDeltaMonthly: 0,
    safetyScore: 97,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Direct MEA Government Meter App Billing',
      'Standard (2 + 1) Verified Contract',
      '2 Large Swimming Pools & Co-Working Hub',
      'On-Site Starbucks & 7-Eleven'
    ],
    redFlags: [],
    inquiryScript: `Hello! Inquiring about Ideo Sukhumvit 93 (13,000 THB/mo). Could we schedule a walkthrough of the unit this weekend?`,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: 'Modern transit-oriented high-rise right at BTS Bang Chak station. Full juristic management with transparent official government electricity rates.'
  },
  {
    id: 'bkk-4',
    title: 'Twin Peaks Residence Phahonyothin',
    propertyType: 'apartment',
    location: 'Phahonyothin Soi 5, Samsen Nai, Phaya Thai (7 mins to BTS Sanam Pao)',
    baseRent: 6800,
    depositMonths: 1,
    advanceRentMonths: 1,
    upfrontCash: 13600, // (1 deposit + 1 advance) * 6800
    electricBillingType: 'submeter_flat',
    electricRatePerUnit: 7.5,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1875, // 250 kWh * 7.5 THB
    monthlyTotalEst: 8875,
    gougeDeltaMonthly: 125, // (7.5 - 7.0) * 250
    safetyScore: 92,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Fair Sub-Meter Rate (7.5 THB/unit)',
      'Standard (1 + 1) Move-In Terms',
      'Quiet Residential Soi with Balcony',
      'Elevator, Resident Parking & Security'
    ],
    redFlags: [],
    inquiryScript: `Hello! I would like to inquire about Twin Peaks Residence Phahonyothin (6,800 THB/mo). Is the unit available for an in-person viewing?`,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    description: 'Serene, boutique apartment in Phaya Thai near Ari neighborhood. Honest 1-month deposit policy with clear sub-meter pricing.'
  }
];
