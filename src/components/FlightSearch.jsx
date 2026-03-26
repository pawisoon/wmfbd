import { useState, useRef } from 'react'
import { searchFlights } from '../services/aeroDataBox'
import { useLocale } from '../i18n/LocaleContext'

export function FlightSearch({ onSelect }) {
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setLoading(true)
    setError(null)
    setSearched(false)

    try {
      const flights = await searchFlights(q)
      setResults(flights)
      setSearched(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(flight) {
    onSelect(flight)
    setResults([])
    setSearched(false)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
            ✈
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value.toUpperCase())}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3.5 bg-white/8 border border-white/15 rounded-xl
                       text-white placeholder-gray-500 text-sm font-medium tracking-wide
                       focus:outline-none focus:border-brand-500 focus:bg-white/10
                       transition-all"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40
                     rounded-xl text-white text-sm font-semibold transition-colors
                     disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : t('searchButton')}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}

      {searched && results.length === 0 && !error && (
        <p className="mt-3 text-gray-400 text-sm text-center">
          {t('noFlightsFound')} <span className="text-white font-medium">{query}</span>
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-2 glass divide-y divide-white/5 overflow-hidden">
          {results.map((flight, i) => (
            <FlightOption key={i} flight={flight} onSelect={handleSelect} />
          ))}
        </ul>
      )}
    </div>
  )
}

function FlightOption({ flight, onSelect }) {
  const dep = flight?.departure?.airport
  const arr = flight?.arrival?.airport
  const time = flight?.departure?.scheduledTime?.local

  return (
    <li>
      <button
        onClick={() => onSelect(flight)}
        className="w-full px-4 py-3 flex items-center gap-3 glass-hover text-left"
      >
        <AirlineIcon airline={flight?.airline?.iata} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">
              {flight?.number || flight?.callSign}
            </span>
            {flight?.airline?.name && (
              <span className="text-gray-500 text-xs">{flight.airline.name}</span>
            )}
          </div>
          <div className="text-gray-400 text-xs mt-0.5 flex items-center gap-1.5">
            <span>{dep?.iata || dep?.name || '?'}</span>
            <span className="text-gray-600">→</span>
            <span>{arr?.iata || arr?.name || '?'}</span>
            {time && (
              <>
                <span className="text-gray-600">·</span>
                <span>{formatTime(time)}</span>
              </>
            )}
          </div>
        </div>
        <span className="text-gray-600 text-sm">›</span>
      </button>
    </li>
  )
}

function AirlineIcon({ airline }) {
  return (
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0">
      {airline || '✈'}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function formatTime(isoStr) {
  try {
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return isoStr
  }
}
