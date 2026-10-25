---
doc: scope
status: approved
---

# SafeRoom (Housing Scam Guard & Verified Room Finder)

A property-type aware rental guard that protects students and renters from housing scams, phantom listings, illegal deposit terms, and predatory utility gouging.

## The Unique Kernel
Property-Type Aware Domain Logic. SafeRoom evaluates listings against separate legal and market benchmarks for **Condominiums** (direct government MEA/PEA meters, 2+1 deposit standard) versus **Apartments/Dormitories** (commercial sub-meters at 6–8 THB/unit, 1+1 deposit standard). This ensures legitimate terms aren't falsely flagged while real red flags (like 10 THB/unit electricity markups or 3-month deposits for dorms) are instantly caught.

## Who It's For
University students, interns, and young professionals relocating to an unfamiliar city. Today, they scroll through unverified Facebook Marketplace groups, LINE square chats, and local boards, vulnerable to phantom landlords, hidden utility surcharges, and exploitative upfront move-in cash demands.

## The Core Loop
1. Renter arrives with an outside listing (or browses the pre-vetted catalog).
2. Renter pastes the raw listing text or clicks a sample demo chip.
3. SafeRoom audits the text against the appropriate property standard and renders the **Unified Safety Scorecard**:
   - 0–100% Risk Gauge (Safe / Review / Hazard).
   - Upfront move-in cash required vs. real monthly outflow (accounting for electricity tiering).
   - Red-flag hazard pills highlighting exact predatory terms.
4. Renter clicks **Copy Script** on the Landlord Inquiry Copilot to challenge red flags or clarify terms before paying any money.

## Inspiration & Identity
- Clean, trustworthy, protective aesthetic: deep slate and navy tones with vibrant emerald (safe), amber (warning), and crimson (hazard) indicators.
- Modern glassmorphic cards, crisp typography, and high-contrast badges resembling an official safety inspection certificate.

## Why This Matters to the Learner
To deliver a high-impact, prize-ready hackathon proof of concept that solves real-world housing exploitation and information asymmetry faced by students and young renters.

## What "Working" Looks Like
A working single-page application demonstrable in under 60 seconds:
- Tester clicks **"Sample: Predatory Apartment Listing"** chip: Scorecard instantly reveals high hazard (~30%), highlights a 3-month deposit request and 10 THB/unit electricity gouge, calculates the inflated move-in cost, and generates a pre-written inquiry message challenging the rate.
- Tester clicks **"Sample: Fair Student Condo"** chip: Scorecard immediately rates it safe (~95%), shows standard (2+1) move-in terms, applies direct MEA utility formula, and verifies peace of mind.
- Tester switches to **Browse Safe Rooms** mode to view pre-screened rooms filtered by location and property type.

## The POC Boundary
- Single-page client-side web application built with React, Vite, and Tailwind CSS.
- Mode A: Browse curated pre-screened rooms powered by structured local mock data (`src/data/mockListings.json`).
- Mode B: Outside listing audit with 1-click sample demo chips, property-type selector/auto-detector, and instant rule/regex heuristic analysis (ensuring 100% offline reliability for demoing).
- Unified Safety Scorecard with live cost calculations and 1-click clipboard copilot.

## Later
- Community scam reporter and landlord blacklist.
- Image verification for reverse photo lookup against known phantom listings.
- Direct LINE Bot or browser extension integration.

## Explicitly Cut
- **User Authentication / Accounts:** Unnecessary friction for the core audit and browse loop.
- **Cloud Database / Backend Infrastructure:** Keeping the app 100% client-side ensures instant demo reliability without latency or hosting costs.
- **Payment Processing:** Room transactions happen outside the app; SafeRoom is an audit and verification guard.
