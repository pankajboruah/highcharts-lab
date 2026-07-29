import {
  generateHighResLineSeries,
  generateLineSeries,
  type LineDatasetKey,
} from '../../shared/dataGenerators'

export type MockHandlerResult = { status: number; body: unknown }

const VALID_DATASETS: LineDatasetKey[] = ['latency', 'region-us', 'region-eu', 'cpu']

function isValidDataset(value: unknown): value is LineDatasetKey {
  return typeof value === 'string' && (VALID_DATASETS as string[]).includes(value)
}

/**
 * Framework-neutral handler — called directly from server/express-app.ts for
 * local dev, and wrapped by api/line-series.ts for the Vercel deployment. Both
 * entrypoints share this one implementation so the business logic never
 * duplicates between them.
 */
export function getLineSeries(
  query: Record<string, string | string[] | undefined>,
): MockHandlerResult {
  const dataset = query.dataset
  if (!isValidDataset(dataset)) {
    return {
      status: 400,
      body: {
        error: `Invalid or missing "dataset". Expected one of: ${VALID_DATASETS.join(', ')}`,
      },
    }
  }

  const start = query.start ? Number(query.start) : undefined
  const end = query.end ? Number(query.end) : undefined

  if (start !== undefined && end !== undefined && !Number.isNaN(start) && !Number.isNaN(end)) {
    return { status: 200, body: generateHighResLineSeries({ dataset, start, end }) }
  }

  return { status: 200, body: generateLineSeries({ dataset }) }
}
