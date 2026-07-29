import { generateCategoryBreakdown } from '../../shared/dataGenerators'
import type { MockHandlerResult } from './lineSeries'

export function getCategoryBreakdown(): MockHandlerResult {
  return { status: 200, body: generateCategoryBreakdown() }
}
