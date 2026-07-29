import { generateKpiMetrics } from '../../shared/dataGenerators.js'
import type { MockHandlerResult } from './lineSeries.js'

export function getSparklineSeries(): MockHandlerResult {
  return { status: 200, body: generateKpiMetrics() }
}
