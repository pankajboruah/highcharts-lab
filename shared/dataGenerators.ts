/**
 * Deterministic (seeded) mock-data generators. Used by both the live server
 * handlers (server/handlers/*.ts, imported by Express and Vercel alike) and,
 * pre-computed once, as the bundled client-side fallback fixtures — so the two
 * data sources can never drift out of shape.
 */

export type SeriesData = { id?: string; name: string; data: [number, number][]; color?: string }
export type SparklineSeries = { id?: string; data: [number, number][] }
export type KpiMetric = {
  id: string
  label: string
  unit: string
  current: number
  delta: number
  series: SparklineSeries
}
export type NumericSeriesData = { id?: string; name: string; data: number[]; color?: string }

function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rngFor(seed: string) {
  return mulberry32(hashSeed(seed))
}

/** A smooth-ish random walk so series look like plausible metrics, not white noise. */
function randomWalk(rng: () => number, length: number, base: number, volatility: number, min = 0) {
  const values: number[] = []
  let current = base
  for (let i = 0; i < length; i++) {
    current += (rng() - 0.5) * volatility
    current = Math.max(min, current)
    values.push(Math.round(current * 100) / 100)
  }
  return values
}

export const LATENCY_SERIES_NAMES = [
  'API Gateway',
  'Auth Service',
  'Payments Service',
  'Search Service',
  'Notifications Service',
]

export type LineDatasetKey = 'latency' | 'region-us' | 'region-eu' | 'cpu'

const LINE_DATASET_CONFIG: Record<
  LineDatasetKey,
  { seriesNames: string[]; base: number; volatility: number; min: number }
> = {
  latency: { seriesNames: LATENCY_SERIES_NAMES, base: 120, volatility: 14, min: 20 },
  'region-us': { seriesNames: ['Requests/sec', 'Errors/sec'], base: 800, volatility: 60, min: 0 },
  'region-eu': { seriesNames: ['Requests/sec', 'Errors/sec'], base: 650, volatility: 55, min: 0 },
  cpu: { seriesNames: ['CPU Utilization %'], base: 45, volatility: 8, min: 2 },
}

/**
 * Generates a set of named time series over a window ending "now" (or a fixed
 * anchor when `endTime` is passed, so fallback fixtures stay stable across builds).
 */
export function generateLineSeries(options: {
  dataset: LineDatasetKey
  pointCount?: number
  intervalMs?: number
  endTime?: number
  seed?: string
}): SeriesData[] {
  const {
    dataset,
    pointCount = 96,
    intervalMs = 15 * 60 * 1000,
    endTime = 1_774_684_800_000,
  } = options
  const config = LINE_DATASET_CONFIG[dataset]
  const startTime = endTime - (pointCount - 1) * intervalMs

  return config.seriesNames.map((name, seriesIndex) => {
    const rng = rngFor(options.seed ?? `${dataset}:${name}`)
    const values = randomWalk(
      rng,
      pointCount,
      config.base * (1 + seriesIndex * 0.12),
      config.volatility,
      config.min,
    )
    const data: [number, number][] = values.map((value, i) => [startTime + i * intervalMs, value])
    return { id: name.toLowerCase().replace(/\s+/g, '-'), name, data }
  })
}

/** Higher-resolution slice for a zoomed time range — same shape, finer interval. */
export function generateHighResLineSeries(options: {
  dataset: LineDatasetKey
  start: number
  end: number
  seed?: string
}): SeriesData[] {
  const { dataset, start, end } = options
  const span = Math.max(end - start, 60_000)
  const pointCount = 60
  const intervalMs = span / pointCount
  const config = LINE_DATASET_CONFIG[dataset]

  return config.seriesNames.map((name, seriesIndex) => {
    const rng = rngFor(`${options.seed ?? dataset}:${name}:zoom:${start}`)
    const values = randomWalk(
      rng,
      pointCount,
      config.base * (1 + seriesIndex * 0.12),
      config.volatility * 0.6,
      config.min,
    )
    const data: [number, number][] = values.map((value, i) => [
      Math.round(start + i * intervalMs),
      value,
    ])
    return { id: name.toLowerCase().replace(/\s+/g, '-'), name, data }
  })
}

const KPI_METRIC_DEFS = [
  { id: 'rps', label: 'Requests / sec', unit: '', base: 1400, volatility: 90, min: 0 },
  { id: 'error-rate', label: 'Error rate', unit: '%', base: 0.8, volatility: 0.3, min: 0 },
  { id: 'p95-latency', label: 'P95 latency', unit: 'ms', base: 210, volatility: 25, min: 40 },
  { id: 'active-users', label: 'Active users', unit: '', base: 5200, volatility: 220, min: 0 },
  { id: 'cache-hit-rate', label: 'Cache hit rate', unit: '%', base: 92, volatility: 3, min: 60 },
  { id: 'queue-depth', label: 'Queue depth', unit: '', base: 34, volatility: 12, min: 0 },
]

export function generateKpiMetrics(
  options: { pointCount?: number; endTime?: number } = {},
): KpiMetric[] {
  const { pointCount = 24, endTime = 1_774_684_800_000 } = options
  const intervalMs = 60 * 60 * 1000
  const startTime = endTime - (pointCount - 1) * intervalMs

  return KPI_METRIC_DEFS.map((def) => {
    const rng = rngFor(`kpi:${def.id}`)
    const values = randomWalk(rng, pointCount, def.base, def.volatility, def.min)
    const data: [number, number][] = values.map((value, i) => [startTime + i * intervalMs, value])
    const current = values[values.length - 1]
    const prior = values[0]
    const delta = prior === 0 ? 0 : Math.round(((current - prior) / prior) * 1000) / 10
    return {
      id: def.id,
      label: def.label,
      unit: def.unit,
      current,
      delta,
      series: { id: def.id, data },
    }
  })
}

export const DEPLOYMENT_TEAMS = ['Platform', 'Growth', 'Checkout', 'Mobile']

export function generateColumnSeries(options: { weekCount?: number; endTime?: number } = {}): {
  categories: string[]
  series: NumericSeriesData[]
} {
  const { weekCount = 8, endTime = 1_774_684_800_000 } = options
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const categories: string[] = []
  for (let i = weekCount - 1; i >= 0; i--) {
    const d = new Date(endTime - i * weekMs)
    categories.push(`${d.getUTCMonth() + 1}/${d.getUTCDate()}`)
  }

  const series = DEPLOYMENT_TEAMS.map((team) => {
    const rng = rngFor(`deploys:${team}`)
    const data = Array.from({ length: weekCount }, () => Math.round(rng() * 8 + 1))
    return { id: team.toLowerCase(), name: team, data }
  })

  return { categories, series }
}

export const RESOURCE_CATEGORIES = ['compute', 'storage', 'network', 'cache', 'other'] as const

export function generateCategoryBreakdown(
  options: { monthCount?: number; endTime?: number } = {},
): {
  categories: string[]
  series: NumericSeriesData[]
} {
  const { monthCount = 6, endTime = 1_774_684_800_000 } = options
  const categories: string[] = []
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(endTime)
    d.setUTCMonth(d.getUTCMonth() - i)
    categories.push(d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }))
  }

  const resourceBase: Record<string, number> = {
    compute: 4200,
    storage: 1500,
    network: 900,
    cache: 300,
    other: 60,
  }

  const series = RESOURCE_CATEGORIES.map((resource) => {
    const rng = rngFor(`cost:${resource}`)
    const data = Array.from({ length: monthCount }, () => {
      const base = resourceBase[resource]
      return Math.round(base * (0.85 + rng() * 0.3))
    })
    return { id: resource, name: resource[0].toUpperCase() + resource.slice(1), data }
  })

  return { categories, series }
}
