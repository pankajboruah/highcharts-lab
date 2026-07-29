import { useEffect, useState } from 'react'
import { fetchWithFallback, type FetchSource } from '@/lib/apiClient'
import { useServerStatus } from '@/lib/serverStatus'

export type ChartDataState<T> = {
  data: T
  source: FetchSource
  isLoading: boolean
}

/**
 * Fetches `url` (falling back to `fallbackData` on failure) and re-fetches
 * whenever the global "simulate server down" toggle changes, so flipping it
 * immediately re-triggers every mounted chart's data load without a page
 * reload. `fallbackData` is expected to be a referentially-stable import
 * (the bundled JSON fixtures), not an inline literal.
 */
export function useChartData<T>(url: string, fallbackData: T): ChartDataState<T> {
  const { simulateDown } = useServerStatus()
  const [state, setState] = useState<ChartDataState<T>>({
    data: fallbackData,
    source: 'fallback',
    isLoading: true,
  })

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, isLoading: true }))

    fetchWithFallback({ url, fallbackData, simulateDown }).then((result) => {
      if (!cancelled) setState({ ...result, isLoading: false })
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, simulateDown])

  return state
}
