import { SparkLine } from '@/components/charts/SparkLine'
import { useChartData } from '@/hooks/useChartData'
import { fallbackKpiMetrics } from '@/lib/mockData'
import { DataSourceBadge } from './DataSourceBadge'

/** Section D: sparklines embedded in a small KPI grid, mimicking a real dashboard use case. */
export function KpiTable() {
  const { data, source, isLoading } = useChartData('/api/sparkline-series', fallbackKpiMetrics)

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <DataSourceBadge source={source} isLoading={isLoading} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((metric) => (
          <div
            key={metric.id}
            className="border-border flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div>
              <p className="text-muted-foreground text-xs">{metric.label}</p>
              <p className="text-lg font-medium tabular-nums">
                {metric.current.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                {metric.unit}
              </p>
              <p
                className="text-xs tabular-nums"
                style={{ color: metric.delta >= 0 ? '#0ca30c' : '#d03b3b' }}
              >
                {metric.delta >= 0 ? '+' : ''}
                {metric.delta}% / 24h
              </p>
            </div>
            <SparkLine
              dataSeries={[{ id: metric.id, data: metric.series.data }]}
              height={36}
              width={100}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
