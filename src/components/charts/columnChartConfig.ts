import type Highcharts from 'highcharts'
import { getLegendStyle, getSystemColorMode } from './theme'
import type { NumericSeriesData } from './types'

/**
 * Stacked column chart options factory. Legend sits vertical/right (fixed width)
 * rather than the horizontal layout LineChart uses — both consume the same
 * `getLegendStyle()` base so item dimming/sizing stays visually consistent.
 */
export function columnChartOptions(props: {
  chartHeight?: number
  categories: string[]
  dataSeries: NumericSeriesData[]
  enableLegend?: boolean
  getFormattedValue?: (value: number) => string
  onLegendItemClick?: (event: Highcharts.SeriesLegendItemClickEventObject) => boolean
}): Highcharts.Options {
  const {
    chartHeight = 320,
    categories,
    dataSeries,
    enableLegend = true,
    getFormattedValue,
    onLegendItemClick,
  } = props
  const legendStyle = getLegendStyle(getSystemColorMode())

  const yAxisLabelFormatter: Highcharts.AxisLabelsFormatterCallbackFunction | undefined =
    getFormattedValue
      ? function () {
          return getFormattedValue(this.value as number)
        }
      : undefined

  const tooltipFormatter: Highcharts.TooltipFormatterCallbackFunction | undefined =
    getFormattedValue
      ? function () {
          const points = this.points ?? []
          const rows = points
            .map((point) => `${point.series.name}: <b>${getFormattedValue(point.y as number)}</b>`)
            .join('<br/>')
          return `${this.x}<br/>${rows}`
        }
      : undefined

  return {
    chart: { type: 'column', height: chartHeight, backgroundColor: 'transparent' },
    title: { text: undefined },
    xAxis: { categories },
    yAxis: {
      title: { text: undefined },
      labels: { formatter: yAxisLabelFormatter },
    },
    legend: enableLegend
      ? { ...legendStyle, layout: 'vertical', align: 'right', verticalAlign: 'middle', width: 160 }
      : { enabled: false },
    tooltip: {
      shared: true,
      valueDecimals: 0,
      formatter: tooltipFormatter,
    },
    plotOptions: {
      column: { stacking: 'normal', borderWidth: 0, borderRadius: 2 },
      series: {
        events: { legendItemClick: onLegendItemClick },
      },
    },
    series: dataSeries.map((series) => ({
      type: 'column' as const,
      id: series.id,
      name: series.name,
      data: series.data,
      color: series.color,
    })),
    credits: { enabled: false },
  }
}
