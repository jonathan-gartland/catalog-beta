# CLAUDE.md

This file provides context and guidelines for AI assistance on this project.

## Project Overview

This is a **Whiskey Collection Tracker** - a Next.js application for tracking and managing a premium whiskey collection with detailed insights, valuations, and analytics.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **React**: Version 19.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Next.js built-in build system
- **Linting**: ESLint with Next.js config

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main page component (home)
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── AddWhiskeyForm.tsx # Form for adding new whiskeys
│   ├── AuthToggle.tsx     # Authentication toggle component
│   ├── FilterControls.tsx # Search and filter controls
│   ├── StatsCard.tsx      # Statistics display cards
│   └── WhiskeyCard.tsx    # Individual bottle cards
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── data/                  # Data files
│   └── whiskey-data.ts    # Whiskey collection data
├── types/                 # TypeScript type definitions
│   └── whiskey.ts         # Whiskey-related interfaces
└── utils/                 # Utility functions
    ├── bottleImages.ts    # Bottle image utilities
    └── whiskey-stats.ts   # Statistics calculations
```

## Key Conventions

### Component Patterns
- All components are client components (use `'use client'` directive)
- Components use functional components with hooks
- TypeScript interfaces are defined in `src/types/`
- Components are located in `src/components/`

### Data Management
- Primary data source: `src/data/whiskey-data.ts`
- Data structure follows `WhiskeyBottle` interface from `src/types/whiskey.ts`
- Statistics calculated using utilities in `src/utils/whiskey-stats.ts`

### Styling
- Uses Tailwind CSS utility classes
- Supports dark mode (dark: variants)
- Responsive design with mobile-first approach
- Card-based layout for visual consistency

### State Management
- Uses React hooks (useState, useMemo, useContext)
- Filter state managed in main page component
- Auth state managed via AuthContext

## Important Files

### `src/types/whiskey.ts`
Defines the `WhiskeyBottle` interface and related types. This is the source of truth for data structure.

### `src/data/whiskey-data.ts`
Contains the whiskey collection data array. This is the primary data source when not using Google Sheets.

### `src/utils/whiskey-stats.ts`
Contains calculation functions for collection statistics (totals, breakdowns, etc.).

### `src/utils/bottleImages.ts`
Handles bottle image paths and fallbacks.

### `src/components/FilterControls.tsx`
Manages filtering and sorting state. The `FilterState` interface defines available filter options.

## Development Guidelines

### Adding New Features
1. Create components in `src/components/`
2. Define types in `src/types/` if needed
3. Add utilities to `src/utils/` for reusable logic
4. Follow existing component patterns and styling

### Code Style
- Use TypeScript for all files
- Prefer functional components over class components
- Use meaningful variable and function names
- Add comments for complex logic
- Follow Next.js 15 conventions (App Router)

### Performance Considerations
- Use `useMemo` for expensive calculations
- Use `React.memo` for components that re-render frequently
- Optimize image loading (bottle images in `public/bottles/`)
- Client-side filtering is used for performance

### Testing
- Run `npm run type-check` to verify TypeScript types
- Run `npm run lint` to check code quality
- Use `npm run dev` for local development

## Environment Variables

See `env.example` for required environment variables. The project supports optional Google Sheets integration.

## Common Tasks

### Adding a New Whiskey
- Use the `AddWhiskeyForm` component
- Data should match the `WhiskeyBottle` interface
- Bottle images should be added to `public/bottles/`

### Modifying Filters
- Update `FilterState` interface in `FilterControls.tsx`
- Add filter logic in `page.tsx` filteredBottles useMemo
- Update filter UI in `FilterControls.tsx`

### Updating Statistics
- Modify calculation functions in `src/utils/whiskey-stats.ts`
- Statistics are recalculated automatically when data changes

## Notes

- The project uses Next.js 15 App Router (not Pages Router)
- All components are client-side by default
- Dark mode is supported via Tailwind dark: variants
- Bottle images use placeholder fallback if not found
- Authentication context controls visibility of sensitive financial data

