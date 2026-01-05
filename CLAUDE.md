# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js application for tracking and managing a premium whiskey collection with detailed insights, valuations, and analytics. The app uses a hierarchical navigation structure: Brands → Brand Details → Bottle Details.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **React**: Version 19.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Next.js built-in build system
- **Linting**: ESLint with Next.js config
- **Git Hooks**: Husky with lint-staged and commitlint

## Development Commands

```bash
# Development
npm run dev              # Start development server on localhost:3000
npm run build            # Build for production
npm start                # Start production server

# Quality checks
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking (tsc --noEmit)
npm run clean            # Remove build artifacts (.next, out, dist)

# Git hooks (run automatically)
# pre-commit: runs lint-staged (ESLint + type-check on staged .ts/.tsx files)
# commit-msg: runs commitlint (conventional commits)
```

## Architecture

### View Hierarchy

The app uses a three-tiered drill-down navigation:

1. **Brands View** (`viewMode: 'brands'`)
   - Shows all brands grouped from the collection
   - Uses `groupByBrand()` from `src/utils/brand-utils.ts`
   - Brand extraction logic handles single-word brands (e.g., "Ardbeg") vs multi-word brands (e.g., "Elijah Craig")

2. **Brand Detail View** (`viewMode: 'brand-detail'`)
   - Shows all expressions for a selected brand
   - Uses `groupByExpression()` from `src/utils/expression-utils.ts`
   - Displays expressions with aggregate stats (total bottles, sizes available)

3. **Bottle Detail View** (`viewMode: 'bottle-detail'`)
   - Shows individual bottles for a selected expression
   - Displays detailed bottle information and statistics

### Key Architectural Patterns

**Data Flow**:
- Single source of truth: `src/data/whiskey-data.ts` (array of `WhiskeyBottle` objects)
- All views derive data from this array using utility functions
- State managed with React hooks (useState, useMemo)

**Grouping Logic**:
- Brand grouping: Extracts brand from bottle name (e.g., "Elijah Craig Barrel Proof" → "Elijah Craig")
- Expression grouping: Groups bottles by exact name match (same expression = same name)

**Authentication**:
- Simple password-based auth using AuthContext
- Stored in localStorage as 'whiskey-auth'
- Controls visibility of financial data (prices, valuations)

**UI Components**:
- Custom UI primitives in `src/components/ui/` (Button, Card, Input, Select, Modal)
- Feature components in `src/components/` (BrandCard, ExpressionCard, WhiskeyCard, etc.)
- All components are client components (`'use client'`)

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx             # Main page with view mode logic
│   └── globals.css          # Global styles and Tailwind imports
├── components/              # React components
│   ├── ui/                  # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Modal.tsx
│   ├── BrandCard.tsx        # Brand list view card
│   ├── BrandDetailView.tsx  # Brand detail page
│   ├── ExpressionCard.tsx   # Expression card in brand detail
│   ├── BottleDetailView.tsx # Bottle detail page
│   ├── WhiskeyCard.tsx      # Individual bottle card
│   ├── StatsCard.tsx        # Statistics display card
│   ├── FilterControls.tsx   # Search/filter UI (if used)
│   ├── AddWhiskeyForm.tsx   # Add new whiskey form
│   └── AuthToggle.tsx       # Auth toggle component
├── contexts/
│   └── AuthContext.tsx      # Authentication context provider
├── constants/
│   └── whiskey.ts           # Enums (WhiskeyCountry, WhiskeyType, BottleStatus, BottleSize)
├── data/
│   └── whiskey-data.ts      # Collection data array (whiskeyCollection)
├── hooks/
│   ├── useDebounce.ts       # Debounce hook
│   └── useCollectionFilters.ts # Collection filtering logic
├── types/
│   └── whiskey.ts           # WhiskeyBottle, WhiskeyStats interfaces
└── utils/
    ├── whiskey-stats.ts     # calculateWhiskeyStats, formatCurrency
    ├── brand-utils.ts       # groupByBrand, extractBrandName, getBottlesByBrand
    ├── expression-utils.ts  # groupByExpression
    └── bottleImages.ts      # Bottle image path utilities
```

## Key Files and Their Purpose

### Core Data and Types
- `src/types/whiskey.ts` - TypeScript interfaces (WhiskeyBottle, WhiskeyStats)
- `src/constants/whiskey.ts` - Enums for country, type, status, size
- `src/data/whiskey-data.ts` - Primary data source (array of bottles)

### Grouping and Statistics
- `src/utils/brand-utils.ts` - Brand extraction and grouping logic
  - `SINGLE_WORD_BRANDS` array defines brands that are always one word
  - `extractBrandName()` handles brand name parsing
  - `groupByBrand()` creates BrandGroup objects with aggregated stats
- `src/utils/expression-utils.ts` - Expression grouping (by exact name match)
- `src/utils/whiskey-stats.ts` - Portfolio statistics calculations

### View Components
- `src/app/page.tsx` - Main orchestrator with view mode state machine
- `src/components/BrandDetailView.tsx` - Shows expressions for a brand
- `src/components/BottleDetailView.tsx` - Shows individual bottles for an expression

## Adding New Bottles to Data

1. Edit `src/data/whiskey-data.ts`
2. Add new object to `whiskeyCollection` array matching `WhiskeyBottle` interface
3. All fields are required except `replacementCost` (optional)
4. Use enum values from `src/constants/whiskey.ts` for country, type, status, size

## Modifying Brand Grouping Logic

If a brand is incorrectly grouped (e.g., "Highland Park" being split):
1. Add the brand to `SINGLE_WORD_BRANDS` array in `src/utils/brand-utils.ts`
2. Or modify the `extractBrandName()` function logic

## Data Source

The whiskey collection data in `src/data/whiskey-data.ts` is manually maintained. There is a sibling Python project (`../liquor_app/`) that syncs data from Google Sheets to PostgreSQL, but there is **no automatic sync** between that database and this Next.js app.

To update data from the spreadsheet:
1. Run the sync in the `liquor_app` project: `python3 sync_from_sheets.py`
2. Export data from PostgreSQL
3. Manually update `src/data/whiskey-data.ts` with the new data

## Notes

- Images stored in `public/bottles/` with fallback handling
- Dark mode supported via Tailwind `dark:` variants
- All components are client-side rendered
- Type checking runs automatically on pre-commit via lint-staged
- Commitlint enforces conventional commit format
