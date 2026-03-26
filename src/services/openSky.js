const BASE = 'https://opensky-network.org/api'

/**
 * Fetch live state for a callsign (flight number, e.g. "AAL123").
 * OpenSky uses ICAO callsigns — airline code + flight number digits.
 *
 * @param {string} callsign e.g. "AA123" → padded to 8 chars "AAL123  "
 */
export async function getLiveState(callsign) {
  // Normalize: airline IATA → ICAO where we can, pad to 8 chars
  const normalized = normalizeCallsign(callsign)
  const url = `${BASE}/states/all?callsign=${encodeURIComponent(normalized)}`

  const res = await fetch(url)
  if (!res.ok) return null

  const data = await res.json()
  const states = data?.states
  if (!states || states.length === 0) return null

  // State vector: [icao24, callsign, origin_country, time_position, last_contact,
  //                longitude, latitude, baro_altitude, on_ground, velocity,
  //                true_track, vertical_rate, sensors, geo_altitude, squawk,
  //                spi, position_source]
  const s = states[0]
  return {
    callsign: s[1]?.trim(),
    originCountry: s[2],
    longitude: s[5],
    latitude: s[6],
    altitude: s[7],   // meters, baro
    onGround: s[8],
    velocity: s[9],   // m/s
    heading: s[10],
    lastContact: s[4],
  }
}

/**
 * Convert IATA-style flight number to ICAO callsign (best-effort).
 * Most airlines map 1:1 for 3-letter prefixes. We handle common ones.
 */
function normalizeCallsign(raw) {
  const upper = raw.toUpperCase().replace(/\s+/g, '')

  // Map common IATA → ICAO prefixes
  const iataToIcao = {
    AA: 'AAL', UA: 'UAL', DL: 'DAL', WN: 'SWA', B6: 'JBU',
    AS: 'ASA', NK: 'NKS', F9: 'FFT', G4: 'AAY', HA: 'HAL',
    BA: 'BAW', LH: 'DLH', AF: 'AFR', KL: 'KLM', IB: 'IBE',
    EK: 'UAE', QR: 'QTR', SQ: 'SIA', CX: 'CPA', JL: 'JAL',
    NH: 'ANA', TK: 'THY', FR: 'RYR', U2: 'EZY', VY: 'VLG',
  }

  const match = upper.match(/^([A-Z]{2})(\d+)$/)
  if (match) {
    const icaoPrefix = iataToIcao[match[1]] || match[1]
    return (icaoPrefix + match[2]).padEnd(8, ' ')
  }

  // Already ICAO-style or unknown — just pad
  return upper.padEnd(8, ' ')
}

/**
 * Get a human-readable status string from a live state.
 */
export function describeState(state, departureIata) {
  if (!state) return null

  if (state.onGround) {
    return { label: 'On ground', color: 'amber', icon: '🛬' }
  }

  const altFt = state.altitude ? Math.round(state.altitude * 3.281) : null
  const speedKt = state.velocity ? Math.round(state.velocity * 1.944) : null

  return {
    label: `Airborne · ${altFt ? altFt.toLocaleString() + ' ft' : ''} · ${speedKt ? speedKt + ' kt' : ''}`.replace(/· $/g, ''),
    color: 'green',
    icon: '✈️',
  }
}
