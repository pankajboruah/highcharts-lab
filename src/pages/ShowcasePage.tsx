import { LineChart } from '@/components/charts/LineChart'
import { ColumnChart } from '@/components/charts/ColumnChart'
import { DemoSection } from '@/components/demo/DemoSection'
import { DataSourceBadge } from '@/components/demo/DataSourceBadge'
import { ZoomableLineChartDemo } from '@/components/demo/ZoomableLineChartDemo'
import { KpiTable } from '@/components/demo/KpiTable'
import { CategoryBreakdownDemo } from '@/components/demo/CategoryBreakdownDemo'
import { useChartData } from '@/hooks/useChartData'
import { fallbackLineSeries, fallbackColumnSeries } from '@/lib/mockData'

const formatMs = (value: number) => `${value.toFixed(0)}ms`
const formatDeployments = (value: number) => `${value.toFixed(0)}`

function LegendIsolateDemo() {
  const { data, source, isLoading } = useChartData(
    '/api/line-series?dataset=latency',
    fallbackLineSeries.latency,
  )
  return (
    <div>
      <div className="mb-2 flex justify-end">
        <DataSourceBadge source={source} isLoading={isLoading} />
      </div>
      <LineChart
        chartHeight={320}
        dataSeries={data}
        enableLegend
        legendAtr={{ maxHeight: 60 }}
        getFormattedValue={formatMs}
        isLoading={isLoading}
      />
      <p className="text-muted-foreground mt-2 text-xs">
        Click a legend item to isolate that series; click it again to reset. Shift+click to build a
        multiselect.
      </p>
    </div>
  )
}

function CrosshairSyncDemo() {
  const us = useChartData('/api/line-series?dataset=region-us', fallbackLineSeries['region-us'])
  const eu = useChartData('/api/line-series?dataset=region-eu', fallbackLineSeries['region-eu'])
  return (
    <div>
      <div className="mb-2 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium">US-East</p>
          <DataSourceBadge source={us.source} isLoading={us.isLoading} />
        </div>
        <div className="mb-1 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium">EU-West</p>
          <DataSourceBadge source={eu.source} isLoading={eu.isLoading} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LineChart
          chartHeight={260}
          dataSeries={us.data}
          enableLegend={false}
          chartId="region-us"
          isLoading={us.isLoading}
        />
        <LineChart
          chartHeight={260}
          dataSeries={eu.data}
          enableLegend={false}
          chartId="region-eu"
          isLoading={eu.isLoading}
        />
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Hover either chart — the matching timestamp is highlighted on both via Highcharts' global
        chart registry.
      </p>
    </div>
  )
}

function DeploymentsColumnDemo() {
  const { data, source, isLoading } = useChartData('/api/column-series', fallbackColumnSeries)
  return (
    <div>
      <div className="mb-2 flex justify-end">
        <DataSourceBadge source={source} isLoading={isLoading} />
      </div>
      <ColumnChart
        chartHeight={320}
        categories={data.categories}
        dataSeries={data.series}
        getFormattedValue={formatDeployments}
      />
    </div>
  )
}

export function ShowcasePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <DemoSection
        id="legend-isolate"
        title="Legend isolate + shift-multiselect"
        description="Five service latency series. Click a legend item to isolate it; shift+click to build a multiselect."
        highchartsFeature="legendItemClick override"
      >
        <LegendIsolateDemo />
      </DemoSection>

      <DemoSection
        id="crosshair-sync"
        title="Synced crosshair across charts"
        description="Two independent charts, one shared hover state — driven entirely by Highcharts' own chart registry."
        highchartsFeature="Highcharts.charts registry"
      >
        <CrosshairSyncDemo />
      </DemoSection>

      <DemoSection
        id="zoom"
        title="Zoomable chart with range refetch"
        description="Drag-select a range to zoom; the custom reset button restores the original view."
        highchartsFeature="chart.events.selection"
      >
        <ZoomableLineChartDemo />
      </DemoSection>

      <DemoSection
        id="kpi-sparklines"
        title="Sparklines in a KPI grid"
        description="Minimal inline area charts embedded next to headline metrics, as in a real dashboard."
        highchartsFeature="Gradient area sparkline"
      >
        <KpiTable />
      </DemoSection>

      <DemoSection
        id="stacked-column"
        title="Stacked column with vertical legend"
        description="Weekly deployments per team — same isolate/multiselect legend hook as the line chart above."
        highchartsFeature="Shared useChartLegend hook"
      >
        <DeploymentsColumnDemo />
      </DemoSection>

      <DemoSection
        id="category-breakdown"
        title="Resource breakdown with threshold filter"
        description="Fixed named-category palette; drag the slider to see negligible series drop out live."
        highchartsFeature="Fixed palette + min-value filter"
      >
        <CategoryBreakdownDemo />
      </DemoSection>
    </main>
  )
}
