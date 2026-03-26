import { useState, useEffect, useRef } from 'react'
import { getLiveState, describeState } from '../services/openSky'

const POLL_INTERVAL_MS = 30_000

/**
 * Polls OpenSky every 30s for a flight's live position/status.
 *
 * @param {string|null} flightNumber e.g. "AA123"
 * @param {string|null} departureIata for context in descriptions
 */
export function useLiveStatus(flightNumber, departureIata) {
  const [liveState, setLiveState] = useState(null)
  const [status, setStatus] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!flightNumber) {
      setLiveState(null)
      setStatus(null)
      return
    }

    async function poll() {
      const state = await getLiveState(flightNumber)
      setLiveState(state)
      setStatus(describeState(state, departureIata))
      setLastUpdated(new Date())
    }

    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)

    return () => clearInterval(intervalRef.current)
  }, [flightNumber, departureIata])

  return { liveState, status, lastUpdated }
}
