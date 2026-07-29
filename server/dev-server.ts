import { createExpressApp } from './express-app.js'

const PORT = process.env.PORT ? Number(process.env.PORT) : 5174

createExpressApp().listen(PORT, () => {
  console.log(`[mock-server] listening on http://localhost:${PORT}`)
})
