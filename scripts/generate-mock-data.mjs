// Regenerates the static fallback fixtures under src/lib/mockData/*.json from the
// shared deterministic generators. Run with: npx tsx scripts/generate-mock-data.mjs
import {
  generateLineSeries,
  generateKpiMetrics,
  generateColumnSeries,
  generateCategoryBreakdown,
} from '../shared/dataGenerators.ts'
import { writeFileSync } from 'fs'

const out = (name, data) =>
  writeFileSync(
    new URL(`../src/lib/mockData/${name}.json`, import.meta.url),
    JSON.stringify(data, null, 2) + '\n',
  )

out('lineSeries.latency', generateLineSeries({ dataset: 'latency' }))
out('lineSeries.region-us', generateLineSeries({ dataset: 'region-us' }))
out('lineSeries.region-eu', generateLineSeries({ dataset: 'region-eu' }))
out('lineSeries.cpu', generateLineSeries({ dataset: 'cpu' }))
out('kpiMetrics', generateKpiMetrics())
out('columnSeries', generateColumnSeries())
out('categoryBreakdown', generateCategoryBreakdown())

console.log('Generated mock data fixtures.')
