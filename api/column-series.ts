import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getColumnSeries } from '../server/handlers/columnSeries'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const { status, body } = getColumnSeries()
  res.status(status).json(body)
}
