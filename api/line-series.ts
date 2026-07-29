import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getLineSeries } from '../server/handlers/lineSeries'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { status, body } = getLineSeries(req.query)
  res.status(status).json(body)
}
