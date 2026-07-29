import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getCategoryBreakdown } from '../server/handlers/categoryBreakdown'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const { status, body } = getCategoryBreakdown()
  res.status(status).json(body)
}
