import { useEffect, useMemo, useRef } from 'react'
import Highcharts from 'highcharts'
import { HighchartsReact, type HighchartsReactRefObject } from 'highcharts-react-official'
import { columnChartOptions } from './columnChartConfig'
import { applyLegendSelection, useChartLegend } from './useChartLegend'
import type { ColumnChartProps } from './types'

/** Stacked column chart with vertical legend + the same isolate/multiselect hook as LineChart. */
export function ColumnChart({
  chartHeight,
  categories,
  dataSeries,
  enableLegend = true,
  getFormattedValue,
}: ColumnChartProps) {
  const chartRef = useRef<HighchartsReactRefObject>(null)
  const { handleLegendItemClick, isVisible, selectedSeries } = useChartLegend()

  const options = useMemo(
    () =>
      columnChartOptions({
        chartHeight,
        categories,
        dataSeries,
        enableLegend,
        getFormattedValue,
        onLegendItemClick: enableLegend ? handleLegendItemClick : undefined,
      }),
    [chartHeight, categories, dataSeries, enableLegend, getFormattedValue, handleLegendItemClick],
  )

  useEffect(() => {
    applyLegendSelection(chartRef.current?.chart, isVisible)
  }, [selectedSeries, isVisible, dataSeries])

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
}
