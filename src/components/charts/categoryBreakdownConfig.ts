import type Highcharts from 'highcharts'
import { getCategoryColor, getLegendStyle, getSystemColorMode } from './theme'
import type { NumericSeriesData } from './types'

/**
 * Stacked resource/cost breakdown chart — fixed named-category palette (not the
 * general categorical order) plus a minimum-total filter that drops negligible
 * series entirely, ported from a production "cost by resource type" chart.
 */
export function categoryBreakdownOptions(props: {
  chartHeight?: number
  categories: string[]
  dataSeries: NumericSeriesData[]
  minValueToDisplay?: number
  getFormattedValue?: (value: number) => string
}): Highcharts.Options {
  const {
    chartHeight = 320,
    categories,
    dataSeries,
    minValueToDisplay = 0,
    getFormattedValue,
  } = props
  const mode = getSystemColorMode()
  const legendStyle = getLegendStyle(mode)

  const visibleSeries = dataSeries.filter((series) => {
    const total = series.data.reduce((sum, value) => sum + value, 0)
    return total >= minValueToDisplay
  })

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
    legend: {
      ...legendStyle,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      width: 160,
    },
    tooltip: {
      shared: true,
      formatter: tooltipFormatter,
    },
    plotOptions: {
      column: { stacking: 'normal', borderWidth: 0, borderRadius: 2 },
    },
    series: visibleSeries.map((series) => ({
      type: 'column' as const,
      id: series.id,
      name: series.name,
      data: series.data,
      color: series.id ? getCategoryColor(series.id, mode) : series.color,
    })),
    credits: { enabled: false },
  }
}
