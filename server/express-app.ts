import express from 'express'
import cors from 'cors'
import { getLineSeries } from './handlers/lineSeries.js'
import { getSparklineSeries } from './handlers/sparklineSeries.js'
import { getColumnSeries } from './handlers/columnSeries.js'
import { getCategoryBreakdown } from './handlers/categoryBreakdown.js'

/**
 * Local dev Express app. Mounts the same framework-neutral handlers the Vercel
 * serverless functions in /api use, so `npm run dev:server` and the deployed
 * /api/* routes never diverge in behavior.
 */
export function createExpressApp() {
  const app = express()
  app.use(cors())

  app.get('/api/line-series', (req, res) => {
    const { status, body } = getLineSeries(req.query as Record<string, string>)
    res.status(status).json(body)
  })

  app.get('/api/sparkline-series', (_req, res) => {
    const { status, body } = getSparklineSeries()
    res.status(status).json(body)
  })

  app.get('/api/column-series', (_req, res) => {
    const { status, body } = getColumnSeries()
    res.status(status).json(body)
  })

  app.get('/api/category-breakdown', (_req, res) => {
    const { status, body } = getCategoryBreakdown()
    res.status(status).json(body)
  })

  return app
}
