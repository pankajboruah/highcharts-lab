import Highcharts from 'highcharts'

/**
 * Cross-chart hover/crosshair sync: on point mouseOver in one chart, walks
 * Highcharts' own global chart registry (`Highcharts.charts`) and highlights the
 * matching x-value on every *other* chart currently on the page — regardless of
 * where they sit in the React tree.
 *
 * Deliberately NOT React Context: chart instances are imperative objects created
 * by highcharts-react-official refs, not React state, and this fires on every
 * pixel of hover movement — direct imperative calls into sibling chart instances
 * are the right tool, not a Context-triggered re-render. `Highcharts.charts` is
 * itself a sparse array (entries removed on chart destroy), so falsy entries are
 * filtered defensively.
 *
 * Only currently-visible (non legend-hidden) series participate, and sync is
 * disabled while any chart in the group is mid-zoom-drag, matching the
 * production behavior this was ported from.
 */
export function attachCrosshairSync(chart: Highcharts.Chart, isZoomed: () => boolean) {
  const onPointMouseOver = (point: Highcharts.Point) => {
    if (isZoomed()) return
    const xValue = point.x

    Highcharts.charts.forEach((sibling) => {
      if (!sibling || sibling === chart) return
      sibling.series.forEach((series) => {
        if (!series.visible) return
        const match = series.points.find((p) => p.x === xValue)
        if (match) {
          match.setState('hover')
          sibling.tooltip?.refresh(match)
          sibling.xAxis[0]?.drawCrosshair(undefined, match)
        }
      })
    })
  }

  const onMouseOut = () => {
    Highcharts.charts.forEach((sibling) => {
      if (!sibling || sibling === chart) return
      sibling.tooltip?.hide()
      sibling.xAxis[0]?.hideCrosshair()
    })
  }

  return { onPointMouseOver, onMouseOut }
}
