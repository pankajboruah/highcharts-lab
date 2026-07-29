import { generateCategoryBreakdown } from '../../shared/dataGenerators.js'
import type { MockHandlerResult } from './lineSeries.js'

export function getCategoryBreakdown(): MockHandlerResult {
  return { status: 200, body: generateCategoryBreakdown() }
}
