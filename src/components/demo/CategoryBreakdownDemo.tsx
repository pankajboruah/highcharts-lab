import { useState } from 'react'
import { CategoryBreakdownChart } from '@/components/charts/CategoryBreakdownChart'
import { useChartData } from '@/hooks/useChartData'
import { fallbackCategoryBreakdown } from '@/lib/mockData'
import { DataSourceBadge } from './DataSourceBadge'

const formatDollars = (value: number) => `$${value.toLocaleString()}`

/** Section F: fixed category palette + a live-adjustable minimum-total filter. */
export function CategoryBreakdownDemo() {
  const { data, source, isLoading } = useChartData(
    '/api/category-breakdown',
    fallbackCategoryBreakdown,
  )
  const [threshold, setThreshold] = useState(0)

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label className="text-muted-foreground flex items-center gap-2 text-xs">
          Minimum total to display
          <input
            type="range"
            min={0}
            max={6000}
            step={250}
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="accent-foreground w-40"
          />
          <span className="tabular-nums">{formatDollars(threshold)}</span>
        </label>
        <DataSourceBadge source={source} isLoading={isLoading} />
      </div>
      <CategoryBreakdownChart
        chartHeight={300}
        categories={data.categories}
        dataSeries={data.series}
        minValueToDisplay={threshold}
        getFormattedValue={formatDollars}
      />
    </div>
  )
}
