const PREFIX = 'wmfbd:'
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { value, expiresAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      localStorage.removeItem(PREFIX + key)
      return null
    }
    return value
  } catch {
    return null
  }
}

export function cacheSet(key, value, ttlMs = DEFAULT_TTL_MS) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({
      value,
      expiresAt: Date.now() + ttlMs,
      cachedAt: Date.now(),
    }))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

/** Returns the { cachedAt, expiresAt } metadata without the value. */
export function cacheMeta(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { expiresAt, cachedAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) return null
    return { cachedAt, expiresAt }
  } catch {
    return null
  }
}

export function cacheDelete(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {}
}
