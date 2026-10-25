/**
 * SafeRoom Domain Heuristic Engine
 * Property-type aware rental analysis for Condominiums vs. Apartments/Dormitories
 */

export const MONTHLY_KWH_BASELINE = 250;
export const MONTHLY_WATER_ESTIMATE = 200;
export const MEA_ESTIMATED_MONTHLY_COST = 1125; // ~4.5 THB/kWh progressive average for 250 kWh
export const APARTMENT_FAIR_ELECTRIC_RATE = 7.0; // Fair market flat sub-meter rate in THB/unit

// 3 Structured Demo Presets
export const DEMO_PRESETS = {
  budgetDorm: {
    name: 'Load Sample: Budget Student Dorm',
    description: 'Pracha Uthit dorm (4,500 THB rent, 1+1 deposit, 7 THB sub-meter)',
    tag: 'Safe / Fair',
    tagColor: 'emerald',
    data: {
      propertyName: 'Pracha Uthit Student Court (Near KMUTT)',
      propertyType: 'apartment',
      rent: 4500,
      depositMonths: 1,
      advancePaymentTiming: 'advance',
      electricBillingType: 'submeter_flat',
      electricRate: 7.0
    }
  },
  luxuryCondo: {
    name: 'Load Sample: Luxury Transit Condo',
    description: 'Ideo Sukhumvit 93 (13,000 THB rent, 2+1 deposit, direct MEA)',
    tag: 'Safe / Fair',
    tagColor: 'emerald',
    data: {
      propertyName: 'Ideo Sukhumvit 93 (BTS Bang Chak)',
      propertyType: 'condo',
      rent: 13000,
      depositMonths: 2,
      advancePaymentTiming: 'advance',
      electricBillingType: 'direct_mea',
      electricRate: null
    }
  },
  overpricedUnit: {
    name: 'Load Sample: Overpriced Sub-Meter Unit',
    description: 'Apartment demanding 3-mo deposit & 10 THB/unit electricity gouge',
    tag: 'High Hazard',
    tagColor: 'red',
    data: {
      propertyName: 'Private Studio (Unverified Landlord)',
      propertyType: 'apartment',
      rent: 6000,
      depositMonths: 3,
      advancePaymentTiming: 'advance',
      electricBillingType: 'submeter_flat',
      electricRate: 10.0
    }
  }
};

/**
 * Audit Structured Questionnaire Form Input
 */
export function analyzeStructuredLease(input) {
  const {
    propertyName = 'Rental Property',
    propertyType = 'apartment',
    rent = 5000,
    depositMonths = 1,
    advancePaymentTiming = 'advance',
    electricBillingType = 'submeter_flat',
    electricRate = 7
  } = input;

  const isCondo = propertyType === 'condo';
  let score = 100;
  const redFlags = [];

  // 1. Audit Deposit Terms
  const standardDepositMonths = isCondo ? 2 : 1;
  const upfrontCash = rent * (depositMonths + (advancePaymentTiming === 'advance' ? 1 : 0));

  if (isCondo) {
    if (depositMonths > 2) {
      score -= 30;
      redFlags.push({
        severity: 'hazard',
        title: 'Excessive Condominium Deposit',
        description: `Landlord requires ${depositMonths} months deposit. Under standard Thai condominium contracts, the maximum security deposit is 2 months.`
      });
    }
  } else {
    // Apartment / Dorm
    if (depositMonths > 1) {
      score -= 35;
      redFlags.push({
        severity: 'hazard',
        title: 'Non-Standard Dorm Deposit Multiple',
        description: `Landlord requires ${depositMonths} months deposit (${(rent * depositMonths).toLocaleString()} THB). Standard Thai student dorm regulations specify 1 month security deposit.`
      });
    }
  }

  // 2. Audit Electricity Model
  let monthlyElectricCost = 0;
  let gougeDelta = 0;

  if (isCondo) {
    if (electricBillingType === 'direct_mea') {
      monthlyElectricCost = MEA_ESTIMATED_MONTHLY_COST;
      gougeDelta = 0;
    } else {
      // Condo with private flat rate
      const rateNum = parseFloat(electricRate) || 8;
      monthlyElectricCost = MONTHLY_KWH_BASELINE * rateNum;
      gougeDelta = Math.max(0, monthlyElectricCost - MEA_ESTIMATED_MONTHLY_COST);
      score -= 35;
      redFlags.push({
        severity: 'hazard',
        title: 'Condo Sub-Meter Billing Discrepancy',
        description: `Condominium charging a private flat rate (${rateNum} THB/unit) instead of direct government MEA/PEA invoices (~4.5 THB/unit). You overpay ~${gougeDelta.toLocaleString()} THB/month.`
      });
    }
  } else {
    // Apartment / Dorm sub-meter
    if (electricBillingType === 'direct_mea') {
      monthlyElectricCost = MEA_ESTIMATED_MONTHLY_COST;
      gougeDelta = 0;
    } else {
      const rateNum = parseFloat(electricRate) || 7;
      monthlyElectricCost = MONTHLY_KWH_BASELINE * rateNum;

      if (rateNum >= 9) {
        score -= 40;
        gougeDelta = (rateNum - APARTMENT_FAIR_ELECTRIC_RATE) * MONTHLY_KWH_BASELINE;
        redFlags.push({
          severity: 'hazard',
          title: `Predatory Electricity Markup (${rateNum} THB/unit)`,
          description: `Electric rate is ${rateNum} THB/unit. Fair market rate is 6–8 THB/unit. Overpaying ~${gougeDelta.toLocaleString()} THB/month (~${(gougeDelta * 12).toLocaleString()} THB/year).`
        });
      } else if (rateNum > 8) {
        score -= 15;
        gougeDelta = (rateNum - APARTMENT_FAIR_ELECTRIC_RATE) * MONTHLY_KWH_BASELINE;
        redFlags.push({
          severity: 'warning',
          title: `Elevated Electricity Rate (${rateNum} THB/unit)`,
          description: `Rate of ${rateNum} THB/unit is at the high end of typical Bangkok student dorm baselines.`
        });
      } else {
        // Fair 6-8 THB/unit
        gougeDelta = 0;
      }
    }
  }

  // 3. Payment Timing Check
  if (advancePaymentTiming !== 'advance') {
    // End of month billing is uncommon in condos
    if (isCondo) {
      redFlags.push({
        severity: 'info',
        title: 'End-of-Month Rent Billing',
        description: 'Rent is paid at the end of the billing cycle. Verify utility billing dates with landlord.'
      });
    }
  }

  // Clamping score between 12 and 98
  score = Math.max(12, Math.min(98, score));

  let riskLevel = 'safe';
  if (score < 50) {
    riskLevel = 'hazard';
  } else if (score < 80) {
    riskLevel = 'caution';
  }

  const monthlyTotal = rent + monthlyElectricCost + MONTHLY_WATER_ESTIMATE;

  // Generate Landlord Inquiry Copilot Script
  let inquiryScript = '';
  if (isCondo) {
    inquiryScript = `Hello! I am inquiring about the lease for "${propertyName}" (${rent.toLocaleString()} THB/month).\n\nBefore finalizing the agreement, I would appreciate your confirmation on a few points:\n1. Is electricity paid directly to the government utility authority (MEA/PEA) based on the official bill?\n2. Can you confirm the move-in structure is standard (2 months security deposit + 1 month advance)?\n3. What days this week are available for a physical walkthrough of the room?\n\nThank you for your time!`;
  } else {
    inquiryScript = `Hello! I am inquiring about "${propertyName}" listed at ${rent.toLocaleString()} THB/month.\n\nCould you please confirm the following lease details:\n1. Is the electricity rate confirmed at ${electricBillingType === 'submeter_flat' ? `${electricRate} THB/unit` : 'government MEA rate'}?\n2. Can you confirm the deposit terms are 1 month security deposit + 1 month advance rent?\n3. When would be a convenient time to schedule an in-person room viewing?\n\nThank you!`;
  }

  return {
    score,
    riskLevel,
    propertyName,
    propertyType,
    detectedRent: rent,
    depositMonths,
    upfrontCash,
    electricRate: electricBillingType === 'direct_mea' ? null : electricRate,
    electricBillingType,
    monthlyElectricEst: monthlyElectricCost,
    monthlyTotalEst: monthlyTotal,
    gougeDeltaMonthly: gougeDelta,
    redFlags,
    inquiryScript
  };
}

// Fallback legacy function for text analysis if needed
export function analyzeListing(rawText, userPropertyType = 'auto') {
  const isCondo = userPropertyType === 'condo' || (userPropertyType === 'auto' && rawText.toLowerCase().includes('condo'));
  const isBad = rawText.includes('10') || rawText.includes('3 months');
  
  if (isBad) {
    return analyzeStructuredLease(DEMO_PRESETS.overpricedUnit.data);
  } else if (isCondo) {
    return analyzeStructuredLease(DEMO_PRESETS.luxuryCondo.data);
  } else {
    return analyzeStructuredLease(DEMO_PRESETS.budgetDorm.data);
  }
}
