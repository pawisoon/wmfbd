const API_KEY = import.meta.env.VITE_AERODATABOX_KEY
const BASE = 'https://aerodatabox.p.rapidapi.com'

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
 * @param {string} flightNumber e.g. "AA123"
 * @param {string} date ISO date string "YYYY-MM-DD"
 */
async function fetchFlightOnDate(flightNumber, date) {
  const res = await fetch(`${BASE}/flights/number/${flightNumber}/${date}`, { headers })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`AeroDataBox date fetch failed: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : [data]
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
  for (let i = 1; i <= days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }

  // Batch requests — AeroDataBox free tier allows ~500/month, so we sample
  // every other day to stay within limits (45 requests per history fetch)
  const sampledDates = dates.filter((_, i) => i % 2 === 0)

  const results = await Promise.allSettled(
    sampledDates.map(date => fetchFlightOnDate(num, date))
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
