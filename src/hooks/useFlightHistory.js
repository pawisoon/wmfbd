import { useState, useEffect, useCallback } from 'react'
import { fetchDelayHistory } from '../services/aeroDataBox'
import { cacheGet, cacheSet, cacheMeta, cacheDelete } from '../utils/cache'

function cacheKey(flightNumber, originIata) {
  return `history:${flightNumber.toUpperCase()}:${(originIata || '').toUpperCase()}`
}

/**
 * Fetches 90 days of delay history for a flight, with localStorage caching.
 * Cached results are served instantly; fresh fetches hit the API.
 *
 * Returns { stats, loading, error, fromCache, cachedAt, refresh }
 */
export function useFlightHistory(flightNumber, originIata) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fromCache, setFromCache] = useState(false)
  const [cachedAt, setCachedAt] = useState(null)

  const key = flightNumber ? cacheKey(flightNumber, originIata) : null

  const load = useCallback(async (bust = false) => {
    if (!flightNumber) return

    // Check cache (unless busting)
    if (!bust) {
      const cached = cacheGet(key)
      if (cached) {
        const meta = cacheMeta(key)
        setStats(cached)
        setFromCache(true)
        setCachedAt(meta?.cachedAt ? new Date(meta.cachedAt) : null)
        setLoading(false)
        return
      }
    } else {
      cacheDelete(key)
    }

    setLoading(true)
    setError(null)
    setFromCache(false)
    setCachedAt(null)

    try {
      const result = await fetchDelayHistory(flightNumber, originIata)
      if (result) cacheSet(key, result)
      setStats(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [flightNumber, originIata, key])

  useEffect(() => {
    if (!flightNumber) {
      setStats(null)
      setError(null)
      setFromCache(false)
      setCachedAt(null)
      return
    }
    load(false)
  }, [flightNumber, originIata]) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => load(true), [load])

  return { stats, loading, error, fromCache, cachedAt, refresh }
}
