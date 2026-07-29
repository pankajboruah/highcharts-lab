import { Switch } from '@/components/ui/switch'
import { ServerStatusProvider, useServerStatus } from '@/lib/serverStatus'
import { ShowcasePage } from '@/pages/ShowcasePage'

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '#legend-isolate', label: 'Legend' },
  { href: '#crosshair-sync', label: 'Crosshair sync' },
  { href: '#zoom', label: 'Zoom' },
  { href: '#kpi-sparklines', label: 'Sparklines' },
  { href: '#stacked-column', label: 'Stacked column' },
  { href: '#category-breakdown', label: 'Breakdown' },
]

function Header() {
  const { simulateDown, setSimulateDown } = useServerStatus()

  return (
    <header className="border-border bg-background/90 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <p className="text-foreground text-sm font-medium">highcharts-lab</p>
          <p className="text-muted-foreground text-xs">Highcharts + React interaction patterns</p>
        </div>
        <nav className="text-muted-foreground hidden flex-wrap gap-4 text-xs md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <label className="text-muted-foreground flex items-center gap-2 text-xs">
          Simulate server down
          <Switch checked={simulateDown} onCheckedChange={setSimulateDown} />
        </label>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto max-w-4xl px-6 py-8 text-xs">
        <p>
          Built with React, TypeScript, Highcharts, and Tailwind. Data served from an Express API
          locally and Vercel serverless functions in production, with a client-side fallback to
          bundled mock data.
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/pankajboruah/highcharts-lab"
            className="hover:text-foreground underline underline-offset-2"
          >
            Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <ServerStatusProvider>
      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <ShowcasePage />
        <Footer />
      </div>
    </ServerStatusProvider>
  )
}

export default App
