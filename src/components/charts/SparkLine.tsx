import { useMemo } from 'react'
import Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import type { SparkLineProps } from './types'

/**
 * Minimal inline area chart — no axes, legend, or credits. Used inline in
 * tables/KPI cards (see Section D of the showcase page).
 */
export function SparkLine({
  dataSeries,
  height = 32,
  width = 96,
  getFormattedValue,
}: SparkLineProps) {
  const options: Highcharts.Options = useMemo(() => {
    const tooltipFormatter: Highcharts.TooltipFormatterCallbackFunction = function () {
      const value = getFormattedValue ? getFormattedValue(this.y as number) : this.y
      return `<span style="font-size:11px">${Highcharts.dateFormat('%b %e, %H:%M', this.x as number)}: <b>${value}</b></span>`
    }

    return {
      chart: {
        type: 'area',
        height,
        width,
        margin: [2, 2, 2, 2],
        backgroundColor: 'transparent',
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: { type: 'datetime', visible: false },
      yAxis: { visible: false, startOnTick: false, endOnTick: false },
      legend: { enabled: false },
      tooltip: {
        outside: true,
        useHTML: true,
        borderWidth: 0,
        shadow: false,
        formatter: tooltipFormatter,
      },
      plotOptions: {
        area: {
          marker: { enabled: false, states: { hover: { enabled: true, radius: 2 } } },
          fillOpacity: 0.25,
          lineWidth: 1.5,
          states: { hover: { lineWidth: 1.5 } },
        },
      },
      series: dataSeries.map((series) => ({
        type: 'area' as const,
        id: series.id,
        data: series.data,
        color: series.color,
      })),
    }
  }, [dataSeries, height, width, getFormattedValue])

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
