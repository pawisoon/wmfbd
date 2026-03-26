import { useState } from 'react'
import { LocaleProvider, useLocale } from './i18n/LocaleContext'
import { FlightSearch } from './components/FlightSearch'
import { RecentFlights } from './components/RecentFlights'
import { DelayGauge } from './components/DelayGauge'
import { DelayBreakdown } from './components/DelayBreakdown'
import { LiveStatus } from './components/LiveStatus'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { LanguagePicker } from './components/LanguagePicker'
import { useFlightHistory } from './hooks/useFlightHistory'
import { getRecentFlights, addRecentFlight, clearRecentFlights } from './utils/recentFlights'

export default function App() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  )
}

const HAS_API_KEY = Boolean(import.meta.env.VITE_AERODATABOX_KEY)

function Inner() {
  const { t } = useLocale()
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
      <header className="text-center mb-10 w-full max-w-xl">
        <div className="flex justify-end mb-4">
          <LanguagePicker />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {t('title')}
        </h1>
        <p className="mt-2 text-gray-500 text-sm">{t('subtitle')}</p>
      </header>

      {/* API key warning */}
      {!HAS_API_KEY && (
        <div className="mb-6 w-full max-w-xl px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center">
          ⚠️ {t('noApiKey')}{' '}
          <a href="https://rapidapi.com/aedbx-aedbx/api/aerodatabox" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">
            {t('noApiKeyLink')}
          </a>{' '}
          {t('noApiKeySuffix')}
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
            {t('searchAgain')}
          </button>
        </div>
      )}

      {/* No data */}
      {selectedFlight && !loading && !error && !stats && (
        <div className="glass p-8 w-full max-w-xl mx-auto text-center space-y-3">
          <RouteHeader flight={selectedFlight} />
          <p className="text-gray-500 text-sm mt-4">{t('noData')}</p>
          <button onClick={handleReset} className="text-brand-400 hover:text-brand-300 text-sm underline">
            {t('tryAnother')}
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
              {t('changeLink')}
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
                {t('cached')} · {timeAgo(cachedAt)}
              </span>
              <button
                onClick={refresh}
                className="text-brand-400 hover:text-brand-300 transition-colors"
              >
                {t('refresh')}
              </button>
            </div>
          )}

          {/* Live status */}
          <div className="pt-2 border-t border-white/8 flex items-center justify-between">
            <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">{t('live')}</span>
            <LiveStatus flightNumber={flightNumber} departureIata={originIata} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-16 text-gray-700 text-xs text-center space-y-2">
        <p>{t('dataSource')}</p>
        <p>{t('liveRefresh')}</p>
        <a
          href="https://buymeacoffee.com/pawisoon"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg
                     bg-yellow-500/10 border border-yellow-500/20 text-yellow-400
                     hover:bg-yellow-500/20 transition-colors text-xs font-medium"
        >
          ☕ {t('donate')}
        </a>
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
