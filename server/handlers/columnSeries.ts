import { generateColumnSeries } from '../../shared/dataGenerators'
import type { MockHandlerResult } from './lineSeries'

export function getColumnSeries(): MockHandlerResult {
  return { status: 200, body: generateColumnSeries() }
}
