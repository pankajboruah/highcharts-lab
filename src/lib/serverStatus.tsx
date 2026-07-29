import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'highcharts-lab:simulate-server-down'

type ServerStatusContextValue = {
  simulateDown: boolean
  setSimulateDown: (value: boolean) => void
}

const ServerStatusContext = createContext<ServerStatusContextValue | null>(null)

function readInitialValue(): boolean {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(STORAGE_KEY) === '1'
}

/**
 * Global "simulate server down" toggle, persisted to sessionStorage so it
 * survives a refresh mid-demo. Every chart section reads this via
 * useChartData() so flipping it re-triggers every fetch at once.
 */
export function ServerStatusProvider({ children }: { children: ReactNode }) {
  const [simulateDown, setSimulateDownState] = useState(readInitialValue)

  const setSimulateDown = useCallback((value: boolean) => {
    setSimulateDownState(value)
    window.sessionStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  }, [])

  return (
    <ServerStatusContext.Provider value={{ simulateDown, setSimulateDown }}>
      {children}
    </ServerStatusContext.Provider>
  )
}

export function useServerStatus() {
  const context = useContext(ServerStatusContext)
  if (!context) throw new Error('useServerStatus must be used within a ServerStatusProvider')
  return context
}
