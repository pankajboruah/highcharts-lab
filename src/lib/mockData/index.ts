import type { SeriesData, KpiMetric, NumericSeriesData } from '@shared/dataGenerators'

import latency from './lineSeries.latency.json'
import regionUs from './lineSeries.region-us.json'
import regionEu from './lineSeries.region-eu.json'
import cpu from './lineSeries.cpu.json'
import kpiMetrics from './kpiMetrics.json'
import columnSeries from './columnSeries.json'
import categoryBreakdown from './categoryBreakdown.json'

/**
 * Pre-generated, checked-in snapshots of the mock API responses (see
 * scripts/generate-mock-data.mjs). These are the client-side fallback used when
 * the live server is unreachable — kept as static JSON rather than re-running the
 * generators at runtime, so the fallback stays available even if generator logic
 * changes later.
 */
export const fallbackLineSeries: Record<
  'latency' | 'region-us' | 'region-eu' | 'cpu',
  SeriesData[]
> = {
  latency: latency as SeriesData[],
  'region-us': regionUs as SeriesData[],
  'region-eu': regionEu as SeriesData[],
  cpu: cpu as SeriesData[],
}

export const fallbackKpiMetrics = kpiMetrics as KpiMetric[]

export const fallbackColumnSeries = columnSeries as {
  categories: string[]
  series: NumericSeriesData[]
}

export const fallbackCategoryBreakdown = categoryBreakdown as {
  categories: string[]
  series: NumericSeriesData[]
}
