# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:5173)
npm run build        # TypeScript check + production build
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## Architecture

CryptoTracker is a React + TypeScript web application for tracking cryptocurrency prices, viewing historical charts, and setting price alerts.

### Tech Stack
- **Vite** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Recharts** - Charting library for price history visualization
- **CoinGecko API** - Free cryptocurrency data (no API key required)

### Code Structure

```
src/
├── api.ts           # CoinGecko API functions (fetchPrices, fetchPriceHistory)
├── hooks.ts         # React hooks (usePrices, usePriceHistory, useAlerts)
├── types.ts         # TypeScript interfaces (CryptoPrice, Alert, etc.)
├── App.tsx          # Main app component with dashboard layout
├── index.css        # Global styles with CSS variables
└── components/
    ├── PriceList.tsx    # Live price display with coin selection
    ├── PriceChart.tsx   # Historical price chart with time range selector
    └── Alerts.tsx       # Price alert creation and management
```

### Key Patterns

- **Custom Hooks**: All data fetching and state management is in `hooks.ts`. Components are presentational.
- **Auto-refresh**: Prices refresh every 30 seconds via `usePrices()` hook.
- **Local Storage**: Alerts persist in localStorage via `useAlerts()` hook.
- **CSS Variables**: Theme colors defined in `:root` in `index.css` for easy customization.

### API Rate Limits

CoinGecko free tier allows ~10-30 requests/minute. The app uses:
- Price fetching: every 30 seconds
- Chart data: on coin selection or time range change
