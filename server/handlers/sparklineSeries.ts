import { generateKpiMetrics } from '../../shared/dataGenerators'
import type { MockHandlerResult } from './lineSeries'

export function getSparklineSeries(): MockHandlerResult {
  return { status: 200, body: generateKpiMetrics() }
}
