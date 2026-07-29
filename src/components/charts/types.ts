import type Highcharts from 'highcharts'

/** A single named series in [timestamp, value] tuple form, as Highcharts expects. */
export type SeriesData = {
  id?: string
  name: string
  data: [number, number][]
  color?: string
}

export type LegendAttr = {
  maxHeight?: number
  inactiveColor?: string
}

type LineChartBase = {
  chartHeight?: number
  dataSeries: SeriesData[]
  enableZoom?: boolean
  onZoom?: (start: number, end: number) => void
  onResetZoom?: () => void
  xAxis?: Highcharts.XAxisOptions
  yAxis?: Highcharts.YAxisOptions
  plotLines?: { color: string; value: number }[]
  getFormattedValue?: (value: number) => string
  /** Identifies this chart instance for the cross-chart crosshair sync registry. */
  chartId?: string
  isLoading?: boolean
}

export type LineChartProps =
  | (LineChartBase & { enableLegend: true; legendAtr?: LegendAttr })
  | (LineChartBase & { enableLegend: false })

export type SparkLineSeriesData = {
  id?: string
  data: [number, number][]
  color?: string
}

export type SparkLineProps = {
  dataSeries: SparkLineSeriesData[]
  height?: number
  width?: number
  getFormattedValue?: (value: number) => string
}

/** Category-indexed series (stacked/grouped column charts) — data aligns 1:1 with `categories`. */
export type NumericSeriesData = {
  id?: string
  name: string
  data: number[]
  color?: string
}

export type ColumnChartProps = {
  chartHeight?: number
  categories: string[]
  dataSeries: NumericSeriesData[]
  enableLegend?: boolean
  getFormattedValue?: (value: number) => string
}

export type CategoryBreakdownProps = {
  chartHeight?: number
  categories: string[]
  dataSeries: NumericSeriesData[]
  minValueToDisplay?: number
  getFormattedValue?: (value: number) => string
}
