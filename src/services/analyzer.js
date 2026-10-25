/**
 * SafeRoom Domain Heuristic Engine
 * Property-type aware rental analysis for Condominiums vs. Apartments/Dormitories
 */

export const MONTHLY_KWH_BASELINE = 250;
export const MONTHLY_WATER_ESTIMATE = 200;
export const MEA_ESTIMATED_MONTHLY_COST = 1150; // Average residential tiered cost for 250 kWh (~4.6 THB/kWh)
export const APARTMENT_FAIR_ELECTRIC_RATE = 7;  // Market fair flat rate in THB/unit

export const SAMPLE_PREDATORY_APARTMENT = `Room for rent near university campus!
5,000 THB/month. Ready to move in now.
Terms:
- Security Deposit: 3 months (15,000 THB)
- Advance rent: 1 month (5,000 THB)
- Total move-in: 20,000 THB cash upfront
- Electricity: 10 THB per unit (sub-meter)
- Water: 200 THB flat
*High demand! Please wire 3,000 THB booking fee before viewing to lock your queue.*`;

export const SAMPLE_FAIR_CONDO = `Modern Studio at Skyline Condo (KMUTT / MRT)
9,000 THB/month, fully furnished.
Terms:
- Security Deposit: 2 months (18,000 THB)
- Advance rent: 1 month (9,000 THB)
- Standard 2+1 lease contract (1 year)
- Electricity: Direct government meter (MEA) - pay actual bill via MEA app
- Water: 35 THB/unit (building management rate)
- Free keycard access and gym/pool
*Welcome to schedule an in-person viewing any afternoon.*`;

/**
 * Auto-detect property type from listing content
 */
export function detectPropertyType(text) {
  const lower = text.toLowerCase();
  const condoKeywords = ['condo', 'condominium', 'คอนโด', 'mea', 'pea', 'government meter', 'building management', 'high-rise'];
  const aptKeywords = ['apartment', 'dorm', 'dormitory', 'mansion', 'หอพัก', 'sub-meter', 'submeter', 'flat rate'];

  let condoScore = 0;
  let aptScore = 0;

  condoKeywords.forEach(k => {
    if (lower.includes(k)) condoScore += 1;
  });

  aptKeywords.forEach(k => {
    if (lower.includes(k)) aptScore += 1;
  });

  if (condoScore > aptScore) return 'condo';
  if (aptScore > condoScore) return 'apartment';
  
  // Default fallback if indeterminate
  return 'apartment';
}

/**
 * Extract numerical rent amount from text
 */
function extractRent(text) {
  // Matches patterns like "5,000 THB", "9000/month", "rent: 8,500"
  const rentRegexes = [
    /(?:rent|price|ราคา|ค่าเช่า)?\s*[:=\s]?\s*([1-9][0-9]{0,2}(?:,[0-9]{3})|[1-9][0-9]{3,4})\s*(?:thb|baht|บาท|\/mo|\/month|ต่อเดือน)/i,
    /([1-9][0-9]{0,2}(?:,[0-9]{3})|[1-9][0-9]{3,4})\s*(?:thb|baht|บาท)/i
  ];

  for (const regex of rentRegexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      const num = parseInt(match[1].replace(/,/g, ''), 10);
      if (num >= 2000 && num <= 100000) return num;
    }
  }
  return 6000; // Reasonable default if unspecified
}

/**
 * Extract security deposit months
 */
function extractDeposit(text) {
  // Check for "3 months", "2 months deposit", "ประกัน 2 เดือน"
  const depMatch = text.match(/(?:deposit|security|ประกัน|ค่าประกัน)\s*[:=\s]?\s*(\d+)\s*(?:month|เดือน|mo)/i);
  if (depMatch && depMatch[1]) {
    return parseInt(depMatch[1], 10);
  }

  // Check for explicit mention of 2+1 or 1+1
  if (text.includes('2+1') || text.includes('2 + 1')) return 2;
  if (text.includes('1+1') || text.includes('1 + 1')) return 1;

  // Check for "3 months upfront"
  const upfrontMatch = text.match(/(\d+)\s*(?:month|months)\s*(?:upfront|deposit)/i);
  if (upfrontMatch && upfrontMatch[1]) {
    return parseInt(upfrontMatch[1], 10);
  }

  return null; // Not found
}

/**
 * Extract electricity billing model and rate
 */
function extractElectricity(text) {
  const lower = text.toLowerCase();

  // Check if direct MEA/PEA
  if (lower.includes('mea') || lower.includes('pea') || lower.includes('government meter') || lower.includes('direct meter') || lower.includes('หลวง')) {
    return {
      type: 'direct_mea',
      rate: null,
      isDirect: true
    };
  }

  // Check for flat rate per unit: "10 THB/unit", "8 บาท/ยูนิต", "electric: 7"
  const rateMatch = text.match(/(?:electric|electricity|power|ไฟ|ค่าไฟ)\s*[:=\s]?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:thb|baht|บาท)?\s*(?:\/|\s*per\s*)?(?:unit|kwh|หน่วย)/i)
    || text.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:thb|baht|บาท)\s*(?:\/|\s*per\s*)?(?:unit|kwh|หน่วย)/i);

  if (rateMatch && rateMatch[1]) {
    const rate = parseFloat(rateMatch[1]);
    if (rate >= 3 && rate <= 25) {
      return {
        type: 'submeter_flat',
        rate: rate,
        isDirect: false
      };
    }
  }

  return {
    type: 'unknown',
    rate: null,
    isDirect: false
  };
}

/**
 * Primary Audit Function
 */
export function analyzeListing(rawText, userPropertyType = 'auto') {
  if (!rawText || rawText.trim().length === 0) {
    return null;
  }

  const detectedType = userPropertyType === 'auto' ? detectPropertyType(rawText) : userPropertyType;
  const isCondo = detectedType === 'condo';
  const rent = extractRent(rawText);
  const deposit = extractDeposit(rawText);
  const electric = extractElectricity(rawText);

  let score = 100;
  const redFlags = [];

  // 1. Audit Deposit Terms
  let depositMonths = deposit;
  let upfrontCash = 0;

  if (isCondo) {
    // Condo standard: 2 months deposit + 1 month advance (2+1)
    if (depositMonths === null) {
      depositMonths = 2; // Default assumption for condo
    }
    upfrontCash = rent * (depositMonths + 1);

    if (depositMonths > 2) {
      score -= 30;
      redFlags.push({
        severity: 'hazard',
        title: 'Excessive Condo Deposit',
        description: `Demanding ${depositMonths} months deposit. Standard Thai condo contracts require at most 2 months security deposit.`
      });
    }
  } else {
    // Apartment standard: 1 month deposit + 1 month advance (1+1)
    if (depositMonths === null) {
      depositMonths = 1; // Default assumption for apartment
    }
    upfrontCash = rent * (depositMonths + 1);

    if (depositMonths > 1) {
      score -= 35;
      redFlags.push({
        severity: 'hazard',
        title: 'Predatory Apartment Deposit Term',
        description: `Demanding ${depositMonths} months security deposit (${rent * depositMonths} THB). Standard Thai apartment/dormitory regulations limit deposit to 1 month.`
      });
    }
  }

  // 2. Audit Electricity Rates
  let monthlyElectricCost = 0;
  let gougeDelta = 0;

  if (isCondo) {
    if (electric.isDirect) {
      monthlyElectricCost = MEA_ESTIMATED_MONTHLY_COST;
      gougeDelta = 0;
    } else if (electric.rate) {
      // Condo with flat private rate is a hazard
      score -= 35;
      monthlyElectricCost = MONTHLY_KWH_BASELINE * electric.rate;
      gougeDelta = Math.max(0, monthlyElectricCost - MEA_ESTIMATED_MONTHLY_COST);
      redFlags.push({
        severity: 'hazard',
        title: 'Unlawful Private Electricity Markup in Condo',
        description: `Charging ${electric.rate} THB/unit flat rate. Condominiums must legally bill via direct government MEA/PEA meters (~4.6 THB/unit average).`
      });
    } else {
      // Unspecified in condo
      monthlyElectricCost = MEA_ESTIMATED_MONTHLY_COST;
      score -= 10;
      redFlags.push({
        severity: 'warning',
        title: 'Unverified Electricity Meter',
        description: 'Listing does not explicitly confirm direct MEA/PEA government billing. Request copy of utility bill.'
      });
    }
  } else {
    // Apartment sub-meter logic
    if (electric.rate) {
      monthlyElectricCost = MONTHLY_KWH_BASELINE * electric.rate;
      if (electric.rate >= 9) {
        score -= 40;
        gougeDelta = (electric.rate - APARTMENT_FAIR_ELECTRIC_RATE) * MONTHLY_KWH_BASELINE;
        redFlags.push({
          severity: 'hazard',
          title: 'Predatory Electricity Gouge (≥ 9 THB/unit)',
          description: `Electric rate is ${electric.rate} THB/unit. Market fair rate is 6–8 THB/unit. You will overpay ~${gougeDelta.toLocaleString()} THB/month.`
        });
      } else if (electric.rate > 8) {
        score -= 15;
        gougeDelta = (electric.rate - APARTMENT_FAIR_ELECTRIC_RATE) * MONTHLY_KWH_BASELINE;
        redFlags.push({
          severity: 'warning',
          title: 'Elevated Electricity Rate',
          description: `Rate of ${electric.rate} THB/unit is above the typical 7 THB market baseline.`
        });
      } else {
        // Fair 6-8 THB/unit
        gougeDelta = 0;
      }
    } else if (electric.isDirect) {
      monthlyElectricCost = MEA_ESTIMATED_MONTHLY_COST;
      gougeDelta = 0;
    } else {
      // Unknown rate
      monthlyElectricCost = MONTHLY_KWH_BASELINE * APARTMENT_FAIR_ELECTRIC_RATE;
      score -= 15;
      redFlags.push({
        severity: 'warning',
        title: 'Hidden Utility Terms',
        description: 'No electricity rate stated. Inquire immediately to prevent surprise charges of 9-10 THB/unit.'
      });
    }
  }

  // 3. Phantom Landlord & Pressure Tactics Check
  const lowerText = rawText.toLowerCase();
  const wirePhrases = ['wire', 'transfer', 'โอนจอง', 'lock queue', 'booking fee', 'hold room', 'before viewing', 'ก่อนดูห้อง'];
  const hasWirePressure = wirePhrases.some(p => lowerText.includes(p));

  if (hasWirePressure) {
    score -= 45;
    redFlags.push({
      severity: 'hazard',
      title: 'High Phantom Landlord Scam Alert',
      description: 'Listing pressures upfront wire transfer/booking fee before in-person viewing. Never send funds prior to viewing the room and verifying title.'
    });
  }

  // Final score clamping & risk classification
  score = Math.max(12, Math.min(98, score));

  let riskLevel = 'safe';
  if (score < 50) {
    riskLevel = 'hazard';
  } else if (score < 80) {
    riskLevel = 'caution';
  }

  // Calculate real monthly outflow
  const monthlyTotal = rent + monthlyElectricCost + MONTHLY_WATER_ESTIMATE;

  // Generate Landlord Inquiry Script
  let inquiryScript = '';
  if (isCondo) {
    inquiryScript = `Hello! I am interested in your condo room listed for ${rent.toLocaleString()} THB/month.\n\nCould you please confirm:\n1. Is electricity paid directly to the government (MEA/PEA) via official utility invoice?\n2. Is the move-in term strictly standard (2 months security deposit + 1 month advance)?\n3. Can we schedule an in-person physical viewing before any reservation deposit is transferred?\n\nThank you!`;
  } else {
    inquiryScript = `Hello! I am inquiring about the room listing for ${rent.toLocaleString()} THB/month.\n\nI would like to clarify a couple of details before moving forward:\n1. Could you confirm the exact sub-meter electricity rate per unit (standard is 6-8 THB/unit)?\n2. For the security deposit, is this 1 month deposit as per standard rental guidelines?\n3. What day and time are you available for an in-person viewing at the property?\n\nThank you!`;
  }

  return {
    score,
    riskLevel,
    propertyType: detectedType,
    detectedRent: rent,
    depositMonths,
    upfrontCash,
    electricRate: electric.rate,
    electricBillingType: electric.type,
    monthlyElectricEst: monthlyElectricCost,
    monthlyTotalEst: monthlyTotal,
    gougeDeltaMonthly: gougeDelta,
    redFlags,
    inquiryScript,
    rawText
  };
}
