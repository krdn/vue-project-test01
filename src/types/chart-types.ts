import type { Percent } from '@amcharts/amcharts5'

export type TDefaultChartOptions = {
  panX?: boolean
  panY?: boolean
  wheelX?: 'zoomX' | 'zoomY' | 'zoomXY' | 'panX' | 'panY' | 'panXY' | 'none'
  wheelY?: 'zoomX' | 'zoomY' | 'zoomXY' | 'panX' | 'panY' | 'panXY' | 'none'
}

export type TXYChartOptions = TDefaultChartOptions & {
  scrollbarX?: boolean
  legendXPosition?: number | Percent | undefined
  legendYPosition?: number | Percent | undefined
  legendLayout?: 'vertical' | 'horizontal' | 'gridLayout'
  multipleSeries?: boolean
}

export type TRadarChartOptions = TDefaultChartOptions & {
  legendXPosition?: number | Percent | undefined
  legendYPosition?: number | Percent | undefined
  legendLayout?: 'vertical' | 'horizontal' | 'gridLayout'
  textType?: 'adjusted' | 'regular' | 'circular' | 'radial' | 'aligned'
  multipleSeries?: boolean
  paddingTopForLabel?: number
  paddingBottomForLabel?: number
  paddingLeftForLabel?: number
  paddingRightForLabel?: number
}

export type TChart = {
  seriesItems: Array<TXYChartSeries>
  data: TChartData
}

export type TChartData = {
  /**
   * CategoryAxis를 사용하는 경우 해당 필드를 사용해야한다.
   */
  categoryFieldName?: string
  items: Array<any>
}

export type TSankeyOptions = {
  orientation?: 'horizontal' | 'vertical'
  nodeWidth?: number
  tooltipValueFieldName?: string
}

export type TSankeyData = {
  id: string
  from: string
  to: string
  value: number
}

export type TXYChartSeries = {
  name: string
  valueYField: string
  valueXField?: string
}
