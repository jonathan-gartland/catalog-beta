# 🥃 Whiskey Collection Tracker

A beautiful and modern Next.js application for tracking and managing your premium whiskey collection with detailed insights, valuations, and analytics.

## Features

### 📊 Collection Analytics
- **Portfolio Overview**: Track total bottles, investment value, current market value, and gain/loss
- **Breakdown Statistics**: View collection distribution by country, type, and distillery
- **Performance Tracking**: Monitor investment performance with percentage gains/losses

### 🔗 Google Sheets Integration
- **Live Data Sync**: Connect directly to your Google Sheets for real-time data
- **Dual Data Sources**: Toggle between local data and Google Sheets seamlessly
- **Add New Bottles**: Add whiskeys directly to your spreadsheet from the app
- **Automatic Updates**: Changes in your spreadsheet appear instantly in the app
- **Fallback Support**: Gracefully falls back to local data if connection fails

### 🔍 Advanced Filtering & Search
- **Text Search**: Search by whiskey name, distillery, or batch information
- **Smart Filters**: Filter by country, whiskey type, and distillery
- **Flexible Sorting**: Sort by name, purchase price, current value, purchase date, or ABV
- **Real-time Updates**: All filters and sorting update the view instantly

### 🎨 Beautiful UI/UX
- **Modern Design**: Clean, card-based layout with dark mode support
- **Responsive**: Fully responsive design that works on desktop, tablet, and mobile
- **Visual Indicators**: Color-coded gain/loss indicators and status badges
- **Intuitive Navigation**: Easy-to-use filter controls and clear data presentation
- **Loading States**: Smooth loading indicators and error handling

### 📋 Detailed Bottle Information
Each bottle card displays:
- Name and distillery information
- Country/region and whiskey type
- Age statement and ABV
- Purchase price and current valuation
- Investment performance (gain/loss with percentage)
- Batch information and tasting notes
- Bottle size and status

### ➕ Collection Management
- **Add New Whiskeys**: Comprehensive form for adding new bottles
- **Data Validation**: Ensures data consistency and quality
- **Batch Operations**: Support for multiple bottles of the same whiskey

## Data Structure

The application uses your Google Sheets data with the following fields:
- **Name**: Whiskey bottle name
- **Quantity**: Number of bottles owned
- **Country**: Country of origin
- **Type**: Whiskey type (Scotch, Bourbon, Rye, etc.)
- **Region**: Specific region or distillery location
- **Distillery**: Producer/distillery name
- **Age**: Age statement
- **Purchase Date**: When the bottle was acquired
- **ABV**: Alcohol by volume percentage
- **Size**: Bottle size (750ml, 700ml, etc.)
- **Purchase Price**: Original purchase price
- **Status**: Current status (unopened, opened, etc.)
- **Batch**: Batch or release information
- **Notes**: Additional notes
- **Current Value**: Current market value

## Technology Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks (useState, useMemo)
- **Build Tool**: Built-in Next.js build system

## Getting Started

### Quick Start (Local Data)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Google Sheets Integration (Optional)

For live data synchronization with Google Sheets:

1. **Follow the detailed setup guide:** [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
2. **Configure your environment variables**
3. **Toggle to "Google Sheets" mode** in the app

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   ├── StatsCard.tsx   # Statistics display cards
│   ├── WhiskeyCard.tsx # Individual bottle cards
│   └── FilterControls.tsx # Search and filter controls
├── data/               # Data files
│   └── whiskey-data.ts # Your whiskey collection data
├── types/              # TypeScript type definitions
│   └── whiskey.ts      # Whiskey-related interfaces
└── utils/              # Utility functions
    └── whiskey-stats.ts # Statistics calculations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding New Bottles
Add new entries to the `whiskeyCollection` array in `src/data/whiskey-data.ts`

### Updating Valuations
Modify the `currentValue` field for any bottle to track market changes

### Custom Filters
Extend the `FilterState` interface in `src/components/FilterControls.tsx` to add new filter options

## Performance Features

- **Optimized Rendering**: Uses React.memo and useMemo for efficient re-renders
- **Smart Filtering**: Client-side filtering with optimized algorithms
- **Responsive Images**: Optimized loading and display
- **Type Safety**: Full TypeScript coverage prevents runtime errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features for future development:
- [ ] Export collection data to CSV/PDF
- [ ] Price alerts and market tracking
- [ ] Tasting notes and ratings
- [ ] Collection sharing capabilities
- [ ] Barcode scanning for new additions
- [ ] Integration with whiskey databases
- [ ] Advanced analytics and charts

---

Built with ❤️ and 🥃 by whiskey enthusiasts, for whiskey enthusiasts.