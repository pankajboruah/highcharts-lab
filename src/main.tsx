import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource-variable/geist'
import App from './App.tsx'
import { initHighchartsTheme } from './components/charts/theme'

initHighchartsTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
