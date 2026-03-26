import { useState } from 'react'
import { FlightSearch } from './components/FlightSearch'
import { RecentFlights } from './components/RecentFlights'
import { DelayGauge } from './components/DelayGauge'
import { DelayBreakdown } from './components/DelayBreakdown'
import { LiveStatus } from './components/LiveStatus'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { useFlightHistory } from './hooks/useFlightHistory'
import { getRecentFlights, addRecentFlight, clearRecentFlights } from './utils/recentFlights'

const HAS_API_KEY = Boolean(import.meta.env.VITE_AERODATABOX_KEY)

export default function App() {
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [recents, setRecents] = useState(getRecentFlights)

  const flightNumber = selectedFlight?.number || selectedFlight?.callSign || null
  const originIata = selectedFlight?.departure?.airport?.iata || null

  const { stats, loading, error, fromCache, cachedAt, refresh } = useFlightHistory(
    selectedFlight ? flightNumber : null,
    originIata
  )

  function handleSelect(flight) {
    addRecentFlight(flight)
    setRecents(getRecentFlights())
    setSelectedFlight(flight)
  }

  function handleClearRecents() {
    clearRecentFlights()
    setRecents([])
  }

  function handleReset() {
    setSelectedFlight(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-20">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Will my flight be delayed?
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Historical delay odds based on the last 90 days
        </p>
      </header>

      {/* API key warning */}
      {!HAS_API_KEY && (
        <div className="mb-6 w-full max-w-xl px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center">
          ⚠️ No <code className="font-mono bg-white/10 px-1 rounded">VITE_AERODATABOX_KEY</code> set.
          Add your <a href="https://rapidapi.com/aedbx-aedbx/api/aerodatabox" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">RapidAPI AeroDataBox</a> key to <code className="font-mono bg-white/10 px-1 rounded">.env.local</code>.
        </div>
      )}

      {/* Search */}
      {!selectedFlight && (
        <>
          <FlightSearch onSelect={handleSelect} />
          <RecentFlights
            flights={recents}
            onSelect={handleSelect}
            onClear={handleClearRecents}
          />
        </>
      )}

      {/* Loading */}
      {selectedFlight && loading && <LoadingSkeleton />}

      {/* Error */}
      {selectedFlight && error && (
        <div className="glass p-6 w-full max-w-xl mx-auto text-center space-y-3">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={handleReset} className="text-gray-400 hover:text-white text-sm underline">
            Search again
          </button>
        </div>
      )}

      {/* No data */}
      {selectedFlight && !loading && !error && !stats && (
        <div className="glass p-8 w-full max-w-xl mx-auto text-center space-y-3">
          <RouteHeader flight={selectedFlight} />
          <p className="text-gray-500 text-sm mt-4">
            Not enough historical data to compute delay odds for this flight.
          </p>
          <button onClick={handleReset} className="text-brand-400 hover:text-brand-300 text-sm underline">
            Try another flight
          </button>
        </div>
      )}

      {/* Results */}
      {selectedFlight && !loading && !error && stats && (
        <div className="glass p-6 w-full max-w-xl mx-auto space-y-6">
          {/* Route header + back */}
          <div className="flex items-center justify-between">
            <RouteHeader flight={selectedFlight} />
            <button
              onClick={handleReset}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              ← Change
            </button>
          </div>

          {/* Gauge */}
          <div className="flex justify-center pt-2">
            <DelayGauge delayChance={stats.delayChance} />
          </div>

          {/* Breakdown bars */}
          <DelayBreakdown stats={stats} />

          {/* Cache badge */}
          {fromCache && cachedAt && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Cached · {timeAgo(cachedAt)}
              </span>
              <button
                onClick={refresh}
                className="text-brand-400 hover:text-brand-300 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Live status */}
          <div className="pt-2 border-t border-white/8 flex items-center justify-between">
            <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Live</span>
            <LiveStatus
              flightNumber={flightNumber}
              departureIata={originIata}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-16 text-gray-700 text-xs text-center space-y-1">
        <p>Data: AeroDataBox · OpenSky Network</p>
        <p>Live positions refresh every 30s</p>
      </footer>
    </div>
  )
}

function timeAgo(date) {
  const mins = Math.round((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

function RouteHeader({ flight }) {
  const dep = flight?.departure?.airport
  const arr = flight?.arrival?.airport
  const num = flight?.number || flight?.callSign

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xs">
        {flight?.airline?.iata || '✈'}
      </div>
      <div>
        <div className="text-white font-semibold text-sm">{num}</div>
        <div className="text-gray-500 text-xs">
          {dep?.iata || '?'} → {arr?.iata || '?'}
          {dep?.municipalityName ? ` · ${dep.municipalityName}` : ''}
        </div>
      </div>
    </div>
  )
}
