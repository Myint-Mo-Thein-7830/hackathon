---
doc: prd
status: approved
---

# SafeRoom (Housing Scam Guard & Verified Room Finder) — Product Requirements

A single-page web app protecting university students and young renters from housing scams, phantom listings, predatory electricity markups, and illegal deposit terms by tailoring safety audits to Property Type (Condo vs. Apartment/Dormitory).
Source: `scope.md > The Unique Kernel` and `scope.md > Who It's For`.

## The Core Journey
1. **Arrival & Mode Selection:** The renter lands on SafeRoom's dark-mode dashboard. They can immediately toggle between two primary views:
   - **Mode A: Browse Safe Rooms** (pre-screened, verified rooms).
   - **Mode B: Audit Outside Listing** (interactive safety inspector).
2. **Outside Listing Inspection (Mode B - Star Demo Flow):**
   - The user pastes unverified listing text from Facebook Marketplace or a landlord chat message, OR clicks one of two 1-click sample demo chips:
     - **Chip 1 ("Sample: Predatory Apartment Listing"):** An apartment demanding 3 months deposit upfront and charging 10 THB/unit electricity.
     - **Chip 2 ("Sample: Fair Student Condo"):** A condo with standard (2+1) move-in terms and direct MEA government electricity billing.
   - The user selects the Property Type (**Auto-Detect**, **Condo**, or **Apartment/Dormitory**).
   - The user clicks **"Analyze Safety"** (or it triggers automatically upon clicking a sample chip).
3. **Reviewing the Unified Safety Scorecard:**
   - The scorecard instantly renders a high-visibility **0–100% Risk Gauge** with clear risk color coding:
     - 80–100%: Green / Low Risk (Terms match legal and market norms).
     - 50–79%: Amber / Review (Minor anomalies or missing clarity).
     - 0–49%: Red / High Hazard (Predatory terms, excessive deposit, or extreme utility markups).
   - The user views the **True Cost Breakdown**:
     - Upfront move-in cash required: $(2+1)$ months for condos vs. $(1+1)$ months for apartments.
     - Estimated real monthly outflow: Base rent + electricity (MEA progressive tier calculation for condos vs. flat sub-meter rate for apartments) + water/amenity fees.
   - The user scans the **Red-Flag Heatmap**: Badges highlighting exact exploitative terms.
4. **Taking Action with the Copilot:**
   - The user navigates to the **Landlord Inquiry Copilot**.
   - SafeRoom generates a polite, legally informed inquiry message addressing the specific red flags detected.
   - The user clicks **"Copy to Clipboard"** to paste directly into LINE or Facebook Messenger.
5. **Browsing Pre-Screened Rooms (Mode A):**
   - The user switches to the catalog view to browse pre-verified listings.
   - They filter by Property Type, Max Budget, and Location.
   - Clicking any room card opens its verified Safety Scorecard showing MEA meter confirmation or standard 6–8 THB sub-meter validation.

## Screens and Layout
SafeRoom is a responsive, single-page application with a fixed navigation header, an active view container, and an inspection scorecard display:
- **Top Navigation Bar:** SafeRoom brand logo with shield emblem, active mode toggle tabs (`Browse Safe Rooms` | `Audit Listing`), and quick hackathon demo badge.
- **Mode A View (Browse Safe Rooms):**
  - Filter bar: Property Type dropdown (`All`, `Condo`, `Apartment/Dorm`), Max Budget slider/input, and Search bar.
  - Responsive Room Grid: Cards showing thumbnail, title, property badge, monthly rent, move-in cash badge, electricity billing type tag (`Direct MEA/PEA` or `Sub-meter 7 THB`), and an "Inspect Room" button.
- **Mode B View (Audit Outside Listing):**
  - Input Section: Large text area with placeholder instructions, property type selector toggle (`Auto-Detect`, `Condo`, `Apartment/Dormitory`), and prominent 1-click test chips.
  - Action Button: Prominent "Run Safety Audit" button with loading/scanning animation.
- **Unified Safety Scorecard Surface:**
  - Placed prominently beneath or beside the input in Mode B, and presented as an interactive modal/drawer in Mode A.
  - Gauge meter, cost breakdown comparison cards, red-flag tag list, and copyable landlord inquiry box.

## Look and Feel
- **Theme:** Modern, sleek cybersecurity / inspection dashboard aesthetic with dark navy/slate canvas (`#0b0f19`, `#111827`) and elevated glassmorphic cards (`backdrop-blur`).
- **Color Accents:**
  - Safe / Verified: Vibrant Emerald (`#10b981`)
  - Caution / Review: Amber (`#f59e0b`)
  - Danger / Scam Hazard: Crimson / Coral Red (`#ef4444`)
  - Primary Brand Accent: Indigo / Electric Blue (`#3b82f6` / `#6366f1`)
- **Typography:** Modern clean sans-serif (Inter / System font stack) with bold numerical stats, monospace callout tags for rates, and crisp badge pills.

## Features and Behavior

### Mode A: Browse Pre-Vetted Safe Rooms
Source: `scope.md > The Core Loop`
- Users can view a pre-populated catalog of 6 curated listings (mix of student condos and private dorms).
- Filterable in real time by Property Type and Maximum Rent.
- Each listing highlights transparent utility terms:
  - Condos clearly state: *"Direct MEA/PEA Meter • Move-in: (2+1) Months"*.
  - Apartments clearly state: *"Sub-meter: 7 THB/unit (Market Normal) • Move-in: (1+1) Months"*.
- Clicking a card triggers the Unified Safety Scorecard modal with pre-verified 90–98% safety scores.

### Mode B: Outside Listing Audit Engine
Source: `scope.md > The Unique Kernel` and `scope.md > What "Working" Looks Like`
- **Text Extraction & Keyword Heuristics:** Evaluates raw text for rent amount, security deposit terms, electricity rate, advance payment clauses, and viewing conditions.
- **Property-Type Aware Benchmarks:**
  - *Condo Standard:* 
    - Move-in deposit expected: 2 months security deposit + 1 month advance rent.
    - Utility expected: Direct MEA/PEA government progressive tiers (~4.2–5.0 THB/kWh avg).
    - Red flags: Deposit > 2 months; flat private rate charged instead of government bill; deposit demanded before in-person viewing.
  - *Apartment / Dorm Standard:*
    - Move-in deposit expected: 1 month security deposit + 1 month advance rent.
    - Utility expected: Sub-meter flat rate between 6–8 THB/kWh.
    - Red flags: Deposit > 1 month for standard room; sub-meter rate $\ge 9$ THB/unit (predatory); hidden minimum monthly fees.
- **1-Click Test Chips:**
  - Clicking **"Sample: Predatory Apartment Listing"** populates text with an apartment demanding 3 months deposit and 10 THB/unit electricity, selects Apartment mode, and runs analysis immediately.
  - Clicking **"Sample: Fair Student Condo"** populates text with a condo listing with 2+1 terms and direct MEA billing, selects Condo mode, and runs analysis immediately.
- **Fail-Safe Offline Reliability:** Operates with pure client-side regex heuristics so the demo operates instantaneously with zero API keys or network latency.

### Unified Safety Scorecard
Source: `scope.md > The Core Loop`
- **Safety Gauge (0–100%):** Circular or semi-circular animated score meter with dynamic risk badge (Low Risk, Caution, High Hazard).
- **True Cost Breakdown:**
  - Upfront Move-in Cash: Computes Base Rent $\times 3$ for Condos or Base Rent $\times 2$ for Apartments.
  - Monthly Outflow Calculator:
    - Base rent + estimated electricity + estimated water (200 THB).
    - Condo electricity formula: Progressive tiered estimate (~1,150 THB for 250 kWh baseline).
    - Apartment electricity formula: Quoted flat rate $\times$ 250 kWh (e.g. $250 \times 7 = 1,750$ THB vs. $250 \times 10 = 2,500$ THB).
  - Monthly Penalty / Gouge Delta: Explicitly calculates how many extra THB/month the renter overpays compared to government or market benchmarks.
- **Red-Flag Heatmap:** List of detected red flags with hazard severity tags and explanations.
- **Landlord Inquiry Copilot:** Generates tailored inquiry text ready to be sent to the landlord. Includes 1-click "Copy Script" button with visual "Copied!" feedback.

## States and Boundaries
- **First Use / Idle State:** Mode B displays placeholder instructions and the two sample demo chips ready for 1-click testing.
- **Active / Scored State:** Full scorecard rendered with animated score dial, cost comparison, and copyable inquiry script.
- **Sparse / Ambiguous Input State:** When text lacks pricing or utility details, the app outputs an Amber review score with an informational pill: *"Missing critical utility or deposit terms — verify before sending funds."*
- **Offline Reliability:** No external API dependency is required to complete the analysis loop.

## Product Decisions
- **100% Client-Side Execution:** Decision made to use client-side heuristics and local mock data to guarantee zero failure rate, instant load time, and seamless demo video recording.
- **Dual-Door UX:** Allows judges to see both sides of the solution: pre-vetted trust (Mode A) and active protection from wild unvetted listings (Mode B).
- **250 kWh Baseline:** Calibrated to real-world typical student consumption in Thailand (air conditioner, laptop, mini-fridge).

## What We're Building
- Complete single-page React + Vite + Tailwind CSS application.
- Dual-Mode navigation (Browse Safe Rooms vs. Audit Listing).
- Interactive 1-click test chips for instantaneous judge demonstrations.
- Property-type aware scoring engine for Condos vs. Apartments.
- True upfront move-in cash & monthly utility gouge calculator.
- Landlord inquiry generator with 1-click clipboard copying.
- Curated mock dataset of 6 verified rental properties.

## Deferred From the POC
- Community user accounts and profile bookmarks.
- Multi-language translation (Thai / English toggle).
- AI image inspection for reverse photo searching.

## Non-Goals
- Real money deposit escrow or payment handling.
- Direct MLS or Facebook Marketplace API automated scraping (users copy/paste text).
- Backend server infrastructure or external databases.

## Open Questions
- None blocking spec or build; all core acceptance criteria and domain rules are defined.
