import { cacheGet, cacheSet } from '../utils/cache'

const API_KEY = import.meta.env.VITE_AERODATABOX_KEY
const BASE = 'https://aerodatabox.p.rapidapi.com'
const DATE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days — past flight data never changes

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
}

/**
 * Search for flights by number — returns route/schedule options.
 * @param {string} flightNumber e.g. "AA123"
 */
export async function searchFlights(flightNumber) {
  const num = flightNumber.toUpperCase().replace(/\s+/g, '')
  const res = await fetch(`${BASE}/flights/number/${num}`, { headers })
  if (!res.ok) {
    if (res.status === 404) return []
    throw new Error(`AeroDataBox search failed: ${res.status}`)
  }
  const data = await res.json()
  // API returns array of flight objects
  return Array.isArray(data) ? data : [data]
}

/**
 * Fetch flight status for a specific date.
 * Caches each date's response individually in localStorage — past flight data
 * never changes, so once we have a result for a date we never need to re-fetch it.
 * Only confirmed responses (200 and 404) are cached; transient errors are not,
 * so they'll be retried on the next run.
 */
async function fetchFlightOnDate(flightNumber, date) {
  const key = `date:${flightNumber}:${date}`
  const cached = cacheGet(key)
  if (cached !== null) return cached

  const url = `${BASE}/flights/number/${flightNumber}/${date}`
  let res = await fetch(url, { headers })

  if (res.status === 429) {
    await sleep(1000)
    res = await fetch(url, { headers })
  }

  if (res.status === 404) {
    cacheSet(key, [], DATE_CACHE_TTL) // flight never operated this day — safe to cache
    return []
  }

  if (!res.ok) return [] // transient error — don't cache, will retry next run

  const data = await res.json()
  const flights = Array.isArray(data) ? data : [data]
  cacheSet(key, flights, DATE_CACHE_TTL)
  return flights
}

/**
 * Run an array of async tasks with limited concurrency and a pause between batches.
 */
async function fetchInBatches(items, fetcher, { concurrency = 5, delayMs = 200 } = {}) {
  const results = []
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.allSettled(batch.map(fetcher))
    results.push(...batchResults)
    if (i + concurrency < items.length) await sleep(delayMs)
  }
  return results
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * Compute delay minutes from a flight object.
 * Returns null if status is unknown.
 */
function getDelayMinutes(flight) {
  const dep = flight?.departure
  if (!dep) return null

  const scheduledStr = dep.scheduledTime?.utc || dep.scheduledTime?.local

  // AeroDataBox uses revisedTime for delayed departures; actualTime for gate-out.
  // Fall through all three so we catch whichever is populated.
  const actualStr =
    dep.actualTime?.utc   || dep.actualTime?.local   ||
    dep.revisedTime?.utc  || dep.revisedTime?.local  ||
    dep.runwayTime?.utc   || dep.runwayTime?.local

  if (!scheduledStr || !actualStr) return null

  const scheduled = new Date(scheduledStr)
  const actual = new Date(actualStr)
  return Math.round((actual - scheduled) / 60000)
}

/**
 * Fetch last `days` days of history for a flight number and a specific departure
 * airport IATA (to narrow to the right route).
 *
 * Returns aggregated delay stats.
 */
export async function fetchDelayHistory(flightNumber, originIata, days = 90) {
  const num = flightNumber.toUpperCase().replace(/\s+/g, '')
  const dates = []

  // Start at day 7, not day 1 — flights from the past week often lack a
  // confirmed actualTime on AeroDataBox, causing the same flight to appear
  // or disappear across runs as the API catches up. Skipping them gives
  // stable, settled data.
  const SETTLE_DAYS = 7
  for (let i = SETTLE_DAYS; i <= days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }

  // Sample every 3rd day → ~28 requests (down from 45). Fewer parallel
  // requests means fewer rate-limit drops, which was the main remaining
  // source of variance between runs.
  const sampledDates = dates.filter((_, i) => i % 3 === 0)

  const results = await fetchInBatches(
    sampledDates,
    date => fetchFlightOnDate(num, date),
    { concurrency: 5, delayMs: 200 }
  )

  const flights = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(f => {
      // Filter to the specific route if we know the origin
      if (!originIata) return true
      const iata = f?.departure?.airport?.iata?.toUpperCase()
      return !iata || iata === originIata.toUpperCase()
    })

  return aggregateDelays(flights)
}

/**
 * Turn raw flight records into delay bucket percentages.
 */
export function aggregateDelays(flights) {
  const buckets = { onTime: 0, minor: 0, moderate: 0, severe: 0, cancelled: 0 }
  let total = 0

  for (const f of flights) {
    if (f?.status === 'Cancelled') {
      buckets.cancelled++
      total++
      continue
    }

    const delay = getDelayMinutes(f)
    if (delay === null) continue

    total++
    if (delay <= 5) buckets.onTime++
    else if (delay <= 30) buckets.minor++
    else if (delay <= 60) buckets.moderate++
    else buckets.severe++
  }

  if (total === 0) return null

  const pct = key => Math.round((buckets[key] / total) * 100)

  return {
    total,
    delayChance: 100 - pct('onTime'),
    onTime: pct('onTime'),
    minor: pct('minor'),       // 1–30 min
    moderate: pct('moderate'), // 31–60 min
    severe: pct('severe'),     // >60 min
    cancelled: pct('cancelled'),
  }
}
