---
doc: spec
status: approved
---

# SafeRoom (Housing Scam Guard & Verified Room Finder) — Technical Spec

## How This Works, In Plain Language
SafeRoom is a fast, responsive, single-page client-side web application designed to run entirely in the browser. It gives renters two entry points:
1. **Mode A (Browse Safe Rooms):** Displays a curated catalog of pre-verified listings stored locally in a structured JSON file. Each room card discloses clear, property-type specific utility and deposit terms.
2. **Mode B (Audit Outside Listing):** Provides a safety inspector where renters can paste unvetted listing text or click 1-click sample demo chips. A client-side heuristic engine analyzes the text against property-type legal benchmarks (Condo vs. Apartment/Dormitory) and renders a Unified Safety Scorecard with live upfront and monthly cost calculations.

Because the analysis engine runs locally in the browser with regular-expression heuristics and domain rule algorithms, SafeRoom loads instantly, requires zero API keys, and has zero external server points of failure during hackathon judging and demo video recording.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.
1. **User loads the app:** `App.jsx` initializes state (`activeMode: 'audit'`), loading mock listings into memory and presenting the navigation bar.
2. **User interacts in Mode B (Audit Outside Listing):**
   - User clicks **"Sample: Predatory Apartment Listing"** chip.
   - `ListingAuditor.jsx` sets the input text, flags the property type as `apartment`, and triggers `analyzeListing(text, 'apartment')` in `analyzer.js`.
   - `analyzer.js` scans the text using domain regex rules:
     - Detects deposit: 3 months (exceeds apartment 1-month benchmark).
     - Detects electricity: 10 THB/unit (exceeds 6–8 THB standard; marked as predatory gouge).
     - Computes risk score: 32% (High Hazard).
     - Calculates upfront move-in cash $(3 \times \text{base rent})$ and monthly outflow $(\text{base rent} + [250 \times 10] + 200)$.
     - Drafts an assertive landlord inquiry script.
3. **Scorecard renders:** `SafetyScorecard.jsx` displays the animated gauge dial in red, outlines the cost gouging delta (+750 THB/month over market rate), displays the red-flag badges, and renders the copyable copilot message.
4. **User clicks "Sample: Fair Student Condo" chip:**
   - Text updates, property type toggles to `condo`, and `analyzer.js` evaluates against condo standards.
   - Detects deposit: standard 2+1; electricity: direct MEA government meter.
   - Scorecard renders in green (95% Low Risk) with progressive tier calculations (~1,150 THB for 250 kWh).
5. **User clicks "Browse Safe Rooms":** `App.jsx` toggles view to `RoomBrowser.jsx`, rendering the filterable catalog. Clicking any card opens the modal scorecard.

## Stack
- **Framework & Runtime:** [React 18+](https://react.dev/) with [Vite](https://vitejs.dev/) — Lightning-fast development server, instant hot-module replacement, and lightweight single-page bundle.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling enabling glassmorphism, responsive grids, and high-contrast alert states.
- **Icons:** [Lucide React](https://lucide.dev/) — Clean, consistent iconography for shield verification, warnings, electric meters, and copy buttons.
- **Analysis Engine:** Pure client-side JavaScript regex & domain rule heuristics (`src/services/analyzer.js`) — 100% offline reliability, instant response, and zero external API downtime.

## Where It Runs and How Someone Tries It
- **Runtime:** Browser (modern Chrome, Edge, Safari, Firefox). Runs on Node.js 18+ locally.
- **Start Command:**
  ```bash
  npm install
  npm run dev
  ```
- **Local URL:** `http://localhost:5173/`
- **Demo Recording Instructions:** Open browser to `http://localhost:5173/`, demonstrate Mode B by clicking both test chips in sequence to show the red and green scorecard reactions, then switch to Mode A to demonstrate the verified room catalog and modal inspection.

## Look and Feel
Consistent with `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`:
- **Canvas:** Dark cyberpunk/inspection slate (`bg-slate-950` / `bg-slate-900`) with subtle radial glow backgrounds.
- **Surfaces:** Glassmorphic card containers (`bg-slate-900/80 backdrop-blur border border-slate-800`).
- **Accent Signals:**
  - Safe / Low Risk: Emerald (`#10b981`)
  - Review / Caution: Amber (`#f59e0b`)
  - Scam / Hazard: Crimson Red (`#ef4444`)
  - Primary / Interactive: Indigo / Cyan (`#6366f1` / `#06b6d4`)
- **Typography:** Inter / system sans font, high numerical readability for financial stats, and clean badge typography.

## Components

### `App.jsx`
- Root component maintaining application-level state: `activeMode` (`'browse'` | `'audit'`) and selected listing modal.
- PRD ref: `prd.md > Screens and Layout`.

### `Navbar.jsx`
- Brand identity with SafeRoom shield emblem, mode toggle buttons, and hackathon project status pill.
- PRD ref: `prd.md > Screens and Layout`.

### `ModeA_RoomBrowser.jsx`
- Catalog container managing search query, property type filter (`all`, `condo`, `apartment`), and max price slider.
- Maps filtered rooms into `RoomCard` items.
- PRD ref: `prd.md > Mode A: Browse Pre-Vetted Safe Rooms`.

### `RoomCard.jsx`
- Individual listing card displaying property photo, verified badge, property type tag, monthly rent, move-in cash badge, and electric billing model badge.
- PRD ref: `prd.md > Mode A: Browse Pre-Vetted Safe Rooms`.

### `ModeB_ListingAuditor.jsx`
- The hero demo surface with a text input area, property-type toggle (`auto`, `condo`, `apartment`), and the two 1-click sample demo chips.
- PRD ref: `prd.md > Mode B: Outside Listing Audit Engine`.

### `SafetyScorecard.jsx`
- Unified output component rendering the safety gauge, cost breakdown, red-flag heatmap, and landlord inquiry copilot.
- PRD ref: `prd.md > Unified Safety Scorecard`.

### `CostCalculator.jsx`
- Sub-component calculating:
  - Total upfront move-in cash ($(2+1)$ for condo vs $(1+1)$ for apartment).
  - True monthly outflow: Base rent + electricity (progressive MEA vs flat rate) + 200 THB water.
  - Overpayment penalty delta.
- PRD ref: `prd.md > Unified Safety Scorecard`.

### `RedFlagHeatmap.jsx`
- Renders individual hazard badges with severity indicators and explanatory warnings.
- PRD ref: `prd.md > Unified Safety Scorecard`.

### `InquiryCopilot.jsx`
- Generates tailored pushback scripts and handles 1-click clipboard copy with visual feedback.
- PRD ref: `prd.md > Unified Safety Scorecard`.

## Data Model

### Listing Object (Mode A Mock Data)
```json
{
  "id": "room-1",
  "title": "Skyline Residence Bang Sue",
  "propertyType": "condo",
  "location": "MRT Bang Sue / KMUTT Shuttle",
  "baseRent": 8500,
  "depositMonths": 2,
  "advanceRentMonths": 1,
  "electricBillingType": "direct_mea",
  "electricRatePerUnit": null,
  "waterMonthlyEst": 200,
  "safetyScore": 96,
  "verifiedFeatures": ["Direct MEA Meter", "Standard 2+1 Deposit", "Physical Keycard Access"],
  "image": "/images/condo1.jpg"
}
```

### Audit Result Object (Mode B Heuristic Output)
```typescript
interface AuditResult {
  score: number; // 0 - 100
  riskLevel: 'safe' | 'caution' | 'hazard';
  propertyType: 'condo' | 'apartment';
  detectedRent: number;
  depositMonths: number;
  upfrontCash: number;
  electricRate: number; // rate in THB or 0 if direct
  electricBillingType: 'direct_mea' | 'submeter_flat';
  monthlyElectricEst: number;
  monthlyTotalEst: number;
  gougeDeltaMonthly: number; // extra cost vs benchmark
  redFlags: Array<{
    severity: 'hazard' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
  inquiryScript: string;
}
```

## File Structure

```
c:\GitHub\Hackathon_Projects/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── LICENSE
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   └── checklist.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   └── mockListings.js
│   ├── services/
│   │   └── analyzer.js
│   └── components/
│       ├── Navbar.jsx
│       ├── ModeA_RoomBrowser.jsx
│       ├── RoomCard.jsx
│       ├── ModeB_ListingAuditor.jsx
│       ├── SafetyScorecard.jsx
│       ├── CostCalculator.jsx
│       ├── RedFlagHeatmap.jsx
│       └── InquiryCopilot.jsx
```

## External Services and Dependencies
- **Zero External Paid APIs:** SafeRoom uses local client-side rule extraction, avoiding API key requirements, network latency, or unexpected rate limits.
- **npm Dependencies:** `react`, `react-dom`, `lucide-react`, `tailwindcss`, `autoprefixer`, `postcss`, `vite`.

## Important Failure Modes
1. **Empty / Garbage Text Input:** If the user clicks "Analyze" with empty or gibberish text, `ListingAuditor.jsx` displays a friendly prompt suggesting the user paste listing text or click one of the sample chips.
2. **Missing Utility or Deposit Rates in Listing:** If an outside listing does not state electricity rates or deposit terms, `analyzer.js` marks an Amber "Information Missing" flag advising the student to clarify before making a deposit.
3. **Property Type Unspecified:** Auto-detection defaults intelligently based on keywords ("condo", "dorm", "apartment", "mansion"); if indeterminate, defaults to `apartment` (the higher-risk category) to protect the renter.

## What Was Simplified and Why
- **Client-Side Regex & Rule Heuristics** instead of external LLM cloud API: Eliminates API key configuration friction for judges and guarantees instant, 100% reliable demo performance without network dependencies.
- **Local Static Mock JSON** instead of Cloud Database (Firebase/Supabase): A proof of concept only requires 6 curated, realistic listings to prove the concept; avoiding cloud backends removes setup overhead and point-of-failure risks.
- **No User Login / Auth:** All features are directly accessible with zero sign-up friction.

## Decisions and Open Issues
- **Decisions Made:** Client-side architecture selected for bulletproof hackathon demo reliability; standard 250 kWh monthly baseline agreed for utility cost estimations; dual-door interface adopted to give judges both proactive screening (Mode A) and active listing defense (Mode B).
- **Open Issues:** None. Ready to proceed to `5-build`.
