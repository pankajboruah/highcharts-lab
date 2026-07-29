import { generateColumnSeries } from '../../shared/dataGenerators.js'
import type { MockHandlerResult } from './lineSeries.js'

export function getColumnSeries(): MockHandlerResult {
  return { status: 200, body: generateColumnSeries() }
}
