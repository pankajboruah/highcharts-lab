import { useMemo } from 'react'
import Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import { categoryBreakdownOptions } from './categoryBreakdownConfig'
import type { CategoryBreakdownProps } from './types'

/** Resource/cost breakdown chart: fixed category palette + adjustable minimum-total filter. */
export function CategoryBreakdownChart({
  chartHeight,
  categories,
  dataSeries,
  minValueToDisplay,
  getFormattedValue,
}: CategoryBreakdownProps) {
  const options = useMemo(
    () =>
      categoryBreakdownOptions({
        chartHeight,
        categories,
        dataSeries,
        minValueToDisplay,
        getFormattedValue,
      }),
    [chartHeight, categories, dataSeries, minValueToDisplay, getFormattedValue],
  )

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
