const KEY = 'wmfbd:recent'
const MAX = 6

export function getRecentFlights() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addRecentFlight(flight) {
  const num = flight?.number || flight?.callSign
  if (!num) return
  const list = getRecentFlights().filter(f => (f.number || f.callSign) !== num)
  list.unshift(flight)
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  } catch {}
}

export function clearRecentFlights() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}
