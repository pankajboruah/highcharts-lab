import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSparklineSeries } from '../server/handlers/sparklineSeries'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const { status, body } = getSparklineSeries()
  res.status(status).json(body)
}
