import { useCallback, useState } from 'react'
import type Highcharts from 'highcharts'

/**
 * Click-to-isolate + shift-click-to-multiselect legend behavior, shared by every
 * chart type in this repo (LineChart, ColumnChart, CategoryBreakdownChart).
 *
 * - Plain click isolates that one series; clicking the same lone-isolated series
 *   again resets to "all visible".
 * - Shift+click toggles a series in/out of a running multiselect set, leaving
 *   other selected series visible; if the set empties, all series reset to visible.
 * - The click handler returns `false` to suppress Highcharts' default legend
 *   toggle — visibility is applied manually via `series.setVisible()` so both
 *   click modes can share one source of truth (`selected`).
 */
export function useChartLegend() {
  // null = default state, every series visible
  const [selected, setSelected] = useState<Set<string> | null>(null)

  const handleLegendItemClick = useCallback(
    (event: Highcharts.SeriesLegendItemClickEventObject) => {
      const clickedName = event.target.name
      const isShiftClick = Boolean((event.browserEvent as MouseEvent).shiftKey)

      setSelected((prev) => {
        if (isShiftClick) {
          const next = new Set(prev ?? [])
          if (next.has(clickedName)) next.delete(clickedName)
          else next.add(clickedName)
          return next.size === 0 ? null : next
        }
        if (prev && prev.size === 1 && prev.has(clickedName)) return null
        return new Set([clickedName])
      })

      return false
    },
    [],
  )

  const isVisible = useCallback(
    (name: string) => selected === null || selected.has(name),
    [selected],
  )

  const reset = useCallback(() => setSelected(null), [])

  return { selectedSeries: selected, handleLegendItemClick, isVisible, reset }
}

/**
 * Applies the current isolate/multiselect selection to a live chart instance.
 * Call from a `useEffect` keyed on `selectedSeries` (and after data updates)
 * so manual `setVisible` calls stay in sync with React state.
 */
export function applyLegendSelection(
  chart: Highcharts.Chart | undefined,
  isVisible: (name: string) => boolean,
) {
  if (!chart) return
  chart.series.forEach((series) => {
    const shouldBeVisible = isVisible(series.name)
    if (series.visible !== shouldBeVisible) {
      series.setVisible(shouldBeVisible, false)
    }
  })
  chart.redraw()
}
