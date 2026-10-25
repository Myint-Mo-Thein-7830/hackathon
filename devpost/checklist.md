---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [ ] **1. Scaffolding, Core Layout, and Domain Heuristic Engine with 1-Click Test Chips (Mode B Kernel)**
  Becomes usable: A running Vite + React + Tailwind CSS app with the dark cybersecurity theme, navigation bar with mode switchers, and Mode B (Audit Outside Listing). Clicking the two test chips ("Sample: Predatory Apartment Listing" and "Sample: Fair Student Condo") or pasting text runs the property-type aware domain heuristic engine and outputs the raw audit metrics.
  Why now: Bootstraps the application, styling system, and immediately proves the unique kernel (Condo vs. Apartment domain logic) right on slice 1.
  PRD ref: `prd.md > The Core Journey` (steps 1–2), `prd.md > Look and Feel`, `prd.md > Mode B: Outside Listing Audit Engine`
  Spec ref: `spec.md > Stack`, `spec.md > Components > ModeB_ListingAuditor.jsx`, `spec.md > File Structure`
  Build: Scaffold the Vite React application with Tailwind CSS and Lucide React. Create `src/services/analyzer.js` implementing the regex/heuristic engine. Create `Navbar.jsx` and `ModeB_ListingAuditor.jsx` with sample test chips and property selector.
  Verify (mechanical): Run `npm run build` to verify clean build without syntax errors; run node verification test against `analyzer.js` for both test chip outputs.
  Learner check: Open `http://localhost:5173/`, click the "Sample: Predatory Apartment" chip, verify the text populates and analysis runs without error.
  Commit: `feat: bootstrap app and implement Mode B outside listing audit engine`

- [ ] **2. Unified Safety Scorecard with Risk Gauge, True Cost Calculator, Red-Flag Heatmap, and Copilot**
  Becomes usable: The full visual inspection scorecard renders upon analysis: the animated 0–100% Risk Gauge (Crimson for 30% hazard vs Emerald for 95% safe), True Upfront Cash & Monthly Outflow Breakdown (with MEA progressive tiers vs flat sub-meter rates), Red-Flag hazard badges, and the Landlord Inquiry Copilot with a functioning 1-click clipboard copy.
  Why now: Completes the star demo flow end-to-end, delivering the core value proposition and judge "aha!" moment.
  PRD ref: `prd.md > The Core Journey` (steps 3–4), `prd.md > Unified Safety Scorecard`
  Spec ref: `spec.md > Components > SafetyScorecard.jsx`, `CostCalculator.jsx`, `RedFlagHeatmap.jsx`, `InquiryCopilot.jsx`
  Build: Implement `SafetyScorecard.jsx`, `CostCalculator.jsx`, `RedFlagHeatmap.jsx`, and `InquiryCopilot.jsx` with copy-to-clipboard state and animations. Wire to `ModeB_ListingAuditor.jsx`.
  Verify (mechanical): Run build check, verify component rendering and mathematical calculations for both test cases.
  Learner check: Click "Sample: Predatory Apartment", observe the red hazard gauge and +750 THB/month penalty delta, and click "Copy Script" to verify the clipboard alert. Then click "Sample: Fair Student Condo" and see it flip to green safe.
  Commit: `feat: implement Unified Safety Scorecard, cost calculator, and inquiry copilot`

- [ ] **3. Mode A Pre-Vetted Safe Room Browser with Filters and Inspection Modals**
  Becomes usable: The complete Dual-Door experience: users can toggle to "Browse Safe Rooms", filter curated listings by Property Type (`Condo` vs `Apartment/Dorm`) and Max Budget, view transparent utility/deposit badges, and click "Inspect Room" to open the verified Safety Scorecard modal.
  Why now: Completes the full dual-mode journey specified in the PRD, making the app a complete product experience for both searchers and auditors.
  PRD ref: `prd.md > The Core Journey` (step 5), `prd.md > Mode A: Browse Pre-Vetted Safe Rooms`
  Spec ref: `spec.md > Components > ModeA_RoomBrowser.jsx`, `RoomCard.jsx`, `spec.md > Data Model`
  Build: Create `src/data/mockListings.js` with 6 realistic student listings. Implement `ModeA_RoomBrowser.jsx` and `RoomCard.jsx` with search, filter controls, and modal scorecard integration.
  Verify (mechanical): Run build check, test filter states (All, Condo, Apartment), and verify card rendering and modal opening.
  Learner check: Switch between "Browse Safe Rooms" and "Audit Listing", filter by "Condo", click a room to inspect its verified MEA meter scorecard.
  Commit: `feat: implement Mode A pre-vetted room browser and modal inspection`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after Slice 2 (Mode B outside listing audit & complete scorecard demo flow)
- [ ] Final kick-the-tires exploration and feedback completed — after Slice 3 (Full dual-door app)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be recorded upon completion]
Route and stops: [to be recorded upon completion]
Edit outcome: [to be recorded upon completion]
Reflection: [to be recorded upon completion]
Activity mode: [to be recorded upon completion]

## Revisions

