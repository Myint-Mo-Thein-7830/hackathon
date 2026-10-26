import React, { useState, useEffect } from 'react';
import ModeB_ListingAuditor from './ModeB_ListingAuditor';
import SafetyScorecard from './SafetyScorecard';
import { analyzeStructuredLease, DEMO_PRESETS } from '../services/analyzer';

export default function EvaluateLeaseView({ setActiveTab }) {
  const [auditResult, setAuditResult] = useState(() => analyzeStructuredLease(DEMO_PRESETS.budgetDorm.data));

  return (
    <div className="space-y-8 bg-transparent">
      <ModeB_ListingAuditor 
        onAuditResult={setAuditResult} 
        auditResult={auditResult} 
      />

      {auditResult && (
        <SafetyScorecard auditResult={auditResult} />
      )}
    </div>
  );
}
