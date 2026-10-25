/**
 * Curated Mock Listings for SafeRoom Mode A (Browse Safe Rooms)
 * Pre-audited properties demonstrating transparent utility & deposit benchmarks.
 */

export const MOCK_LISTINGS = [
  {
    id: 'room-1',
    title: 'Skyline Residence Bang Sue',
    propertyType: 'condo',
    location: 'MRT Bang Sue / KMUTT Shuttle',
    baseRent: 8500,
    depositMonths: 2,
    advanceRentMonths: 1,
    upfrontCash: 25500, // (2 deposit + 1 advance) * 8500
    electricBillingType: 'direct_mea',
    electricRatePerUnit: null,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1150, // MEA tier avg
    monthlyTotalEst: 9850,
    gougeDeltaMonthly: 0,
    safetyScore: 98,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Direct MEA Government Meter',
      'Standard (2+1) Lease Terms',
      'Keycard Floor Access',
      'Gym & Coworking Lounge'
    ],
    redFlags: [],
    inquiryScript: `Hello! I would like to schedule an in-person viewing for Skyline Residence Bang Sue (8,500 THB/mo). Please let me know your available times this week.`,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'High-rise studio with unblocked city views. Directly connected to MRT Bang Sue with direct government utility billing.'
  },
  {
    id: 'room-2',
    title: 'Green Campus Dormitory',
    propertyType: 'apartment',
    location: 'Pracha Uthit / KMUTT Walking Distance',
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
    safetyScore: 94,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Fair Sub-Meter Rate (7 THB/unit)',
      'Strict (1+1) Move-In Terms',
      '24/7 Gated CCTV Security',
      'Coin Laundry & Drinking Water'
    ],
    redFlags: [],
    inquiryScript: `Hello! I am interested in Green Campus Dormitory (4,500 THB/mo). I would like to confirm the sub-meter rate (7 THB) and arrange a physical room inspection.`,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    description: 'Popular student apartment located 5 minutes walking distance from university gates. Transparent electricity sub-metering.'
  },
  {
    id: 'room-3',
    title: 'Metro Luxe Kaset-Phahol',
    propertyType: 'condo',
    location: 'BTS Sena Nikhom / Kasetsart Univ',
    baseRent: 7500,
    depositMonths: 2,
    advanceRentMonths: 1,
    upfrontCash: 22500,
    electricBillingType: 'direct_mea',
    electricRatePerUnit: null,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1150,
    monthlyTotalEst: 8850,
    gougeDeltaMonthly: 0,
    safetyScore: 97,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Official MEA Resident Account',
      'No Landlord Utility Surcharge',
      'Fully Furnished with Aircon',
      'Swimming Pool & Shuttle Bus'
    ],
    redFlags: [],
    inquiryScript: `Hello! Inquiring about Metro Luxe Kaset-Phahol (7,500 THB/mo). Please let me know if an afternoon viewing is possible this Saturday.`,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: 'Compact 1-bedroom modern condo. Pay electricity directly via the MEA Smart Life application with zero markups.'
  },
  {
    id: 'room-4',
    title: 'Siam Living Student Mansion',
    propertyType: 'apartment',
    location: 'Samyan / Chula Shuttle Zone',
    baseRent: 5200,
    depositMonths: 1,
    advanceRentMonths: 1,
    upfrontCash: 10400,
    electricBillingType: 'submeter_flat',
    electricRatePerUnit: 6.5,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1625, // 250 * 6.5
    monthlyTotalEst: 7025,
    gougeDeltaMonthly: 0,
    safetyScore: 96,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Discount Sub-Meter Rate (6.5 THB)',
      'Official 1-Month Deposit Policy',
      'Biometric Door Lock',
      'High-Speed Student WiFi'
    ],
    redFlags: [],
    inquiryScript: `Hello! I would like to schedule a viewing for Siam Living Student Mansion (5,200 THB/mo). Please send available inspection slots.`,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    description: 'Purpose-built student mansion near major academic campuses. Unusually low sub-meter electricity rate for central Bangkok.'
  },
  {
    id: 'room-5',
    title: 'The Parkland Grand Asoke',
    propertyType: 'condo',
    location: 'MRT Phetchaburi / ARL Makkasan',
    baseRent: 12000,
    depositMonths: 2,
    advanceRentMonths: 1,
    upfrontCash: 36000,
    electricBillingType: 'direct_mea',
    electricRatePerUnit: null,
    waterMonthlyEst: 200,
    monthlyElectricEst: 1150,
    monthlyTotalEst: 13350,
    gougeDeltaMonthly: 0,
    safetyScore: 96,
    riskLevel: 'safe',
    verifiedFeatures: [
      'Direct MEA Billing',
      'Standard 2+1 Contract',
      'Smart TV & Washing Machine',
      'Sky Fitness & Sauna'
    ],
    redFlags: [],
    inquiryScript: `Hello! Inquiring about The Parkland Grand Asoke (12,000 THB/mo). Could you confirm title deed verification prior to contract signing?`,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    description: 'Premium student & intern high-rise next to transit interchange. Official juristic building management.'
  },
  {
    id: 'room-6',
    title: 'Baan Rim Klong Residence',
    propertyType: 'apartment',
    location: 'BTS Ari / Phaya Thai Area',
    baseRent: 6000,
    depositMonths: 1.5,
    advanceRentMonths: 1,
    upfrontCash: 15000, // (1.5 + 1) * 6000
    electricBillingType: 'submeter_flat',
    electricRatePerUnit: 8.0,
    waterMonthlyEst: 200,
    monthlyElectricEst: 2000, // 250 * 8
    monthlyTotalEst: 8200,
    gougeDeltaMonthly: 250, // (8 - 7) * 250
    safetyScore: 78,
    riskLevel: 'caution',
    verifiedFeatures: [
      'Sub-Meter Rate: 8.0 THB/unit',
      'Deposit: 1.5 Months (Review Terms)',
      'Quiet Residential Alley'
    ],
    redFlags: [
      {
        severity: 'warning',
        title: 'Elevated Electricity Rate (8.0 THB/unit)',
        description: 'Rate is at the upper threshold of acceptable market baselines.'
      },
      {
        severity: 'warning',
        title: 'Non-Standard Deposit (1.5 Months)',
        description: 'Standard apartment guidelines recommend strictly 1 month deposit.'
      }
    ],
    inquiryScript: `Hello! Inquiring about Baan Rim Klong Residence (6,000 THB/mo). Would management consider a standard 1-month deposit contract?`,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description: 'Charming apartment near BTS Ari. Note that electricity is 8 THB/unit and deposit is 1.5 months.'
  }
];
