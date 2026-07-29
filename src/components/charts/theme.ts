import Highcharts from 'highcharts'

/**
 * Categorical palette + chart chrome, validated for CVD-safety via the
 * dataviz skill's palette validator (adjacent-pair ΔE ≥ 8 CVD / ≥ 15 normal-vision
 * in both light and dark). Swap these values to re-theme every chart in one place —
 * the original codebase duplicated font/color setup per component; this module
 * is the single source of truth instead.
 */

export type ColorMode = 'light' | 'dark'

const CATEGORICAL: Record<ColorMode, string[]> = {
  light: [
    '#2a78d6', // blue
    '#eb6834', // orange
    '#1baf7a', // aqua
    '#eda100', // yellow
    '#e87ba4', // magenta
    '#008300', // green
    '#4a3aa7', // violet
    '#e34948', // red
  ],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
}

const CHROME: Record<
  ColorMode,
  {
    surface: string
    primaryInk: string
    secondaryInk: string
    mutedInk: string
    gridline: string
    baseline: string
  }
> = {
  light: {
    surface: '#fcfcfb',
    primaryInk: '#0b0b0b',
    secondaryInk: '#52514e',
    mutedInk: '#898781',
    gridline: '#e1e0d9',
    baseline: '#c3c2b7',
  },
  dark: {
    surface: '#1a1a19',
    primaryInk: '#ffffff',
    secondaryInk: '#c3c2b7',
    mutedInk: '#898781',
    gridline: '#2c2c2a',
    baseline: '#383835',
  },
}

/** Named colors for the category/resource-breakdown chart, distinct from the general categorical order. */
export const CATEGORY_PALETTE: Record<string, Record<ColorMode, string>> = {
  compute: { light: '#2a78d6', dark: '#3987e5' },
  storage: { light: '#1baf7a', dark: '#199e70' },
  network: { light: '#4a3aa7', dark: '#9085e9' },
  cache: { light: '#eda100', dark: '#c98500' },
  other: { light: '#898781', dark: '#898781' },
}

export function getCategoryColor(key: string, mode: ColorMode): string {
  return CATEGORY_PALETTE[key]?.[mode] ?? CATEGORY_PALETTE.other[mode]
}

export function getSystemColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Shared legend styling constants — consumed by every chart type so this is defined exactly once. */
export function getLegendStyle(mode: ColorMode) {
  const chrome = CHROME[mode]
  return {
    itemStyle: {
      fontSize: '12px',
      fontWeight: '400',
      color: chrome.secondaryInk,
    },
    itemHiddenStyle: {
      opacity: 0.3,
      color: chrome.mutedInk,
      textDecoration: 'none',
    },
    itemHoverStyle: {
      color: chrome.primaryInk,
    },
    symbolWidth: 8,
    symbolHeight: 8,
    symbolRadius: 2,
    navigation: {
      activeColor: chrome.primaryInk,
      inactiveColor: chrome.mutedInk,
    },
  } satisfies Highcharts.LegendOptions
}

export function buildHighchartsTheme(mode: ColorMode): Highcharts.Options {
  const chrome = CHROME[mode]
  return {
    colors: CATEGORICAL[mode],
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
      },
    },
    title: { style: { color: chrome.primaryInk, fontWeight: '500' } },
    subtitle: { style: { color: chrome.secondaryInk } },
    credits: { enabled: false },
    xAxis: {
      gridLineColor: chrome.gridline,
      lineColor: chrome.baseline,
      tickColor: chrome.baseline,
      labels: { style: { color: chrome.mutedInk, fontSize: '11px' } },
    },
    yAxis: {
      gridLineColor: chrome.gridline,
      lineColor: chrome.baseline,
      tickColor: chrome.baseline,
      labels: { style: { color: chrome.mutedInk, fontSize: '11px' } },
      title: { style: { color: chrome.mutedInk } },
    },
    legend: getLegendStyle(mode),
    tooltip: {
      backgroundColor: chrome.surface,
      borderColor: chrome.gridline,
      style: { color: chrome.primaryInk, fontSize: '12px' },
    },
    plotOptions: {
      series: {
        animation: { duration: 250 },
      },
    },
  }
}

/** Applies the theme globally and keeps already-mounted charts in sync with OS theme changes. */
export function initHighchartsTheme() {
  const apply = (mode: ColorMode) => {
    Highcharts.setOptions(buildHighchartsTheme(mode))
    Highcharts.charts.forEach((chart) => {
      if (!chart) return
      chart.update(buildHighchartsTheme(mode), true, false, false)
    })
  }

  apply(getSystemColorMode())

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', (event) => {
    apply(event.matches ? 'dark' : 'light')
  })
}
