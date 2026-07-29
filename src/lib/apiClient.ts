export type FetchSource = 'live' | 'fallback'

export type FetchWithFallbackResult<T> = { data: T; source: FetchSource }

/**
 * Fetches `url` with a timeout, falling back to bundled local data on any
 * failure (network error, non-2xx, or timeout) — the fallback path a genuine
 * server outage would hit.
 *
 * When `simulateDown` is set, this short-circuits directly to the fallback
 * *before* attempting the network call, rather than pointing at a broken URL.
 * That's a deliberate choice: it keeps the "simulate server down" demo toggle
 * instant and deterministic instead of waiting out a real timeout, while still
 * exercising the exact same fallback branch a real outage would take.
 */
export async function fetchWithFallback<T>(options: {
  url: string
  fallbackData: T
  timeoutMs?: number
  simulateDown?: boolean
}): Promise<FetchWithFallbackResult<T>> {
  const { url, fallbackData, timeoutMs = 2500, simulateDown = false } = options

  if (simulateDown) {
    return { data: fallbackData, source: 'fallback' }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = (await response.json()) as T
    return { data, source: 'live' }
  } catch {
    return { data: fallbackData, source: 'fallback' }
  } finally {
    clearTimeout(timer)
  }
}
