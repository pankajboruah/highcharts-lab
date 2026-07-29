import { useCallback, useState } from 'react'
import { LineChart } from '@/components/charts/LineChart'
import type { SeriesData } from '@/components/charts/types'
import { useChartData } from '@/hooks/useChartData'
import { useServerStatus } from '@/lib/serverStatus'
import { fetchWithFallback, type FetchSource } from '@/lib/apiClient'
import { fallbackLineSeries } from '@/lib/mockData'
import { generateHighResLineSeries } from '@shared/dataGenerators'
import { DataSourceBadge } from './DataSourceBadge'

const formatPercent = (value: number) => `${value.toFixed(0)}%`

/** Section C: drag-to-zoom refetches a higher-resolution slice for the selected range. */
export function ZoomableLineChartDemo() {
  const { simulateDown } = useServerStatus()
  const base = useChartData('/api/line-series?dataset=cpu', fallbackLineSeries.cpu)
  const [zoomed, setZoomed] = useState<{
    data: SeriesData[]
    source: FetchSource
    isLoading: boolean
  } | null>(null)

  const handleZoom = useCallback(
    (start: number, end: number) => {
      setZoomed({ data: [], source: 'fallback', isLoading: true })
      const fallback = generateHighResLineSeries({ dataset: 'cpu', start, end })
      fetchWithFallback({
        url: `/api/line-series?dataset=cpu&start=${start}&end=${end}`,
        fallbackData: fallback,
        simulateDown,
      }).then((result) => setZoomed({ ...result, isLoading: false }))
    },
    [simulateDown],
  )

  const handleResetZoom = useCallback(() => setZoomed(null), [])

  const active = zoomed ?? base

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs">
          Drag across the chart to zoom in — it refetches a higher-resolution slice for that range.
        </p>
        <DataSourceBadge source={active.source} isLoading={active.isLoading} />
      </div>
      <LineChart
        chartHeight={280}
        dataSeries={active.data}
        enableLegend={false}
        enableZoom
        onZoom={handleZoom}
        onResetZoom={handleResetZoom}
        isLoading={active.isLoading}
        getFormattedValue={formatPercent}
      />
    </div>
  )
}
