# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (hot reload)
npm run build      # Production build → dist/
npm run preview    # Serve the production build locally
```

No test runner or linter is configured.

## Environment Setup

Copy `.env.local.example` to `.env.local` and set your RapidAPI key:

```
VITE_AERODATABOX_KEY=your_rapidapi_key_here
```

The OpenSky API is public and requires no key.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI framework | React + React DOM | ^18.3.1 |
| Build tool | Vite + @vitejs/plugin-react | ^5.4.10 / ^4.3.1 |
| Styling | Tailwind CSS | ^3.4.14 |
| CSS processing | PostCSS + Autoprefixer | ^8.4.47 / ^10.4.20 |
| Class utility | clsx | ^2.1.1 |
| Font | Inter (Google Fonts, weights 300–700) | — |
| Module format | ES Modules (`"type": "module"`) | — |

**State & data:**
- React Context API — `LocaleContext` for i18n
- Custom hooks: `useFlightHistory`, `useLiveStatus`
- `localStorage` — caches recent flight lookups and 90-day history

**i18n:** Multi-language support in `src/i18n/`

**Config files:** `vite.config.js`, `tailwind.config.js` (custom brand colors), `postcss.config.js`

## Architecture

React 18 SPA built with Vite + Tailwind CSS (dark mode via `class` strategy, `dark` class set on `<html>`).

**Data flow:**
1. User enters a flight number (e.g. `AA123`) → `FlightSearch` calls AeroDataBox to resolve the route
2. `useFlightHistory` fetches 90 days of historical departures for that route, sampling every other day to stay within the free-tier quota (~500 calls/month). Results are aggregated into delay buckets: on-time / minor (<30 min) / moderate (30–60 min) / severe (>60 min) / cancelled
3. `useLiveStatus` polls OpenSky every 30 s using the ICAO callsign (converted from IATA via a hardcoded airline mapping in `src/services/openSky.js`)
4. `App.jsx` orchestrates state: idle → loading → error | results

**Key files:**
- `src/services/aeroDataBox.js` — AeroDataBox API client; handles search, history fetch, and delay aggregation logic
- `src/services/openSky.js` — OpenSky client; IATA→ICAO mapping table for common airlines
- `src/hooks/useFlightHistory.js` — fetches and caches 90-day delay history
- `src/hooks/useLiveStatus.js` — 30 s polling hook for live position data
- `src/components/DelayGauge.jsx` — pure SVG radial gauge (no charting library)
- `src/index.css` — defines `.glass` and `.glass-hover` glassmorphism utility classes used throughout

**External APIs:**
- AeroDataBox via RapidAPI (`aerodatabox.p.rapidapi.com`) — historical flight data (requires `VITE_AERODATABOX_KEY`)
- OpenSky Network (`opensky-network.org/api`) — live flight state, no auth required
