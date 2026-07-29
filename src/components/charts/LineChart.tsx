import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Highcharts from 'highcharts'
import { HighchartsReact, type HighchartsReactRefObject } from 'highcharts-react-official'
import { Button } from '@/components/ui/button'
import { applyLegendSelection, useChartLegend } from './useChartLegend'
import { attachCrosshairSync } from './useChartCrosshairSync'
import { getLegendStyle, getSystemColorMode } from './theme'
import type { LineChartProps } from './types'

/**
 * Multi-series datetime line chart. Showcases three custom Highcharts behaviors
 * ported from a production dashboard:
 *  - legend click-to-isolate / shift-click-to-multiselect (see useChartLegend)
 *  - cross-chart crosshair sync via Highcharts' global chart registry
 *  - custom drag-to-zoom with a React-rendered reset button (native one hidden)
 */
export function LineChart(props: LineChartProps) {
  const {
    chartHeight = 320,
    dataSeries,
    enableZoom = false,
    onZoom,
    onResetZoom,
    xAxis,
    yAxis,
    plotLines,
    getFormattedValue,
    chartId,
    isLoading,
    enableLegend,
  } = props
  const legendAtr = enableLegend ? props.legendAtr : undefined

  const chartRef = useRef<HighchartsReactRefObject>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const { handleLegendItemClick, isVisible, selectedSeries } = useChartLegend()

  const isZoomedRef = useRef(isZoomed)
  isZoomedRef.current = isZoomed

  const handleResetZoom = useCallback(() => {
    const chart = chartRef.current?.chart
    chart?.zoomOut()
    setIsZoomed(false)
    onResetZoom?.()
  }, [onResetZoom])

  const options: Highcharts.Options = useMemo(() => {
    const legendStyle = getLegendStyle(getSystemColorMode())

    const selectionHandler: Highcharts.ChartSelectionCallbackFunction = (event) => {
      if (event.xAxis?.[0]) {
        const { min, max } = event.xAxis[0]
        setIsZoomed(true)
        onZoom?.(Math.round(min), Math.round(max))
      }
      return true
    }

    const yAxisLabelFormatter: Highcharts.AxisLabelsFormatterCallbackFunction | undefined =
      getFormattedValue
        ? function () {
            return getFormattedValue(this.value as number)
          }
        : undefined

    const tooltipFormatter: Highcharts.TooltipFormatterCallbackFunction | undefined =
      getFormattedValue
        ? function () {
            return `<b>${this.series.name}</b><br/>${Highcharts.dateFormat('%b %e, %H:%M', this.x as number)}: ${getFormattedValue(this.y as number)}`
          }
        : undefined

    const mouseOver: Highcharts.PointMouseOverCallbackFunction = function () {
      const chart = chartRef.current?.chart
      if (chart) attachCrosshairSync(chart, () => isZoomedRef.current).onPointMouseOver(this)
    }

    const mouseOut: Highcharts.PointMouseOutCallbackFunction = () => {
      const chart = chartRef.current?.chart
      if (chart) attachCrosshairSync(chart, () => isZoomedRef.current).onMouseOut()
    }

    return {
      chart: {
        height: chartHeight,
        resetZoomButton: { theme: { style: { display: 'none' } } },
        ...(enableZoom
          ? { zooming: { type: 'x' as const }, events: { selection: selectionHandler } }
          : {}),
      },
      title: { text: undefined },
      xAxis: {
        type: 'datetime',
        plotLines: plotLines?.map((line) => ({ color: line.color, value: line.value, width: 1 })),
        ...xAxis,
      },
      yAxis: {
        title: { text: undefined },
        labels: { formatter: yAxisLabelFormatter },
        ...yAxis,
      },
      legend: enableLegend
        ? {
            ...legendStyle,
            enabled: true,
            maxHeight: legendAtr?.maxHeight,
            itemHiddenStyle: {
              ...legendStyle.itemHiddenStyle,
              color: legendAtr?.inactiveColor ?? legendStyle.itemHiddenStyle?.color,
            },
          }
        : { enabled: false },
      tooltip: {
        shared: false,
        valueDecimals: 2,
        formatter: tooltipFormatter,
      },
      plotOptions: {
        series: {
          marker: { enabled: false },
          events: {
            legendItemClick: enableLegend ? handleLegendItemClick : undefined,
          },
          point: {
            events: { mouseOver, mouseOut },
          },
        },
      },
      series: dataSeries.map((series) => ({
        type: 'line' as const,
        id: series.id,
        name: series.name,
        data: series.data,
        color: series.color,
      })),
      credits: { enabled: false },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chartHeight,
    dataSeries,
    enableZoom,
    enableLegend,
    legendAtr,
    xAxis,
    yAxis,
    plotLines,
    getFormattedValue,
    handleLegendItemClick,
    onZoom,
  ])

  useEffect(() => {
    applyLegendSelection(chartRef.current?.chart, isVisible)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeries, dataSeries])

  return (
    <div className="relative" data-chart-id={chartId}>
      {isZoomed && (
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 z-10"
          onClick={handleResetZoom}
        >
          Reset zoom
        </Button>
      )}
      {isLoading && (
        <div className="bg-background/60 text-muted-foreground absolute inset-0 z-10 flex items-center justify-center text-sm">
          Loading…
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  )
}
