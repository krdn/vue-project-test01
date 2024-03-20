<template>
  <div ref="radarChart" class="chart-wrapper"></div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import * as am5radar from '@amcharts/amcharts5/radar'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

import type { TChartData, TXYChartSeries, TRadarChartOptions } from '@/types/chart-types'

@Options({
  props: {
    options: { type: Object as () => TRadarChartOptions, required: true, default: {} },
    seriesItems: { type: Object as () => Array<TXYChartSeries>, required: true, default: [] },
    chartData: {
      type: Object as () => TChartData,
      required: true,
      default: { categoryFieldName: 'category', items: [] }
    }
  }
})
export default class RadarChart extends Vue {
  chartData!: TChartData
  options!: TRadarChartOptions
  seriesItems!: Array<TXYChartSeries>
  chart!: am5radar.RadarChart
  legend!: am5.Legend

  mounted(): void {
    if (this.seriesItems.length > 0 && this.chartData.items.length > 0) {
      const root = am5.Root.new(this.$refs.radarChart as HTMLElement)
      root.setThemes([am5themes_Animated.new(root)])

      this.createChart(root)
      const xAxis = this.createXAxis(root)

      if (this.options.multipleSeries) {
        this.createMultipleSeries(root, xAxis)
      } else {
        this.createSeries(root, xAxis)
      }

      this.chart
        .set('cursor', am5radar.RadarCursor.new(root, { behavior: 'zoomX' }))
        .lineY.set('visible', false)

      this.createLegend(root, this.chart)

      this.chart.series.each(
        (
          item:
            | am5radar.RadarLineSeries
            | am5radar.RadarColumnSeries
            | am5radar.SmoothedRadarLineSeries
        ) => {
          item.appear(1000, 100)
        }
      )
      this.chart.appear(1000, 100)
    }
  }

  updated(): void {
    this.chart.xAxes.each((xAxis) => {
      xAxis.data.setAll(this.chartData.items)
    })
  }

  private createChart(root: am5.Root): void {
    const settings = {
      panX: this.options.panX,
      panY: this.options.panY,
      layout: root.verticalLayout
    } as any

    this.chart = root.container.children.push(am5radar.RadarChart.new(root, settings))
  }

  private createXAxis(root: am5.Root) {
    let xAxis = null

    const xRenderer = am5radar.AxisRendererCircular.new(root, {})
    xRenderer.labels.template.setAll({
      textType: this.options.textType,
      breakWords: true,
      maxWidth: 100,
      oversizedBehavior: 'wrap',
      paddingTop: this.options.paddingTopForLabel,
      paddingBottom: this.options.paddingBottomForLabel,
      paddingLeft: this.options.paddingLeftForLabel,
      paddingRight: this.options.paddingRightForLabel
    })

    xAxis = this.chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: this.chartData.categoryFieldName as string,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    xAxis.data.setAll(this.chartData.items)

    return xAxis
  }

  private createSeries(root: am5.Root, xAxis: any): void {
    const yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5radar.AxisRendererRadial.new(root, { strokeWidth: 2 }),
        min: 0,
        extraMax: 0.1,
        maxPrecision: 0
      })
    ) as any

    this.seriesItems.forEach((item) => {
      const addedSeries = this.chart.series.push(
        am5radar.SmoothedRadarLineSeries.new(root, {
          name: item.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: item.valueYField,
          categoryXField: this.chartData.categoryFieldName,
          tooltip: am5.Tooltip.new(root, {
            labelText: '{name}: {valueY}'
          })
        })
      )

      addedSeries.data.setAll(this.chartData.items)

      addedSeries.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { fill: addedSeries.get('fill'), radius: 5 })
        })
      })
    })
  }

  private createMultipleSeries(root: am5.Root, xAxis: any): void {
    this.seriesItems.forEach((item) => {
      const yAxis = this.chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5radar.AxisRendererRadial.new(root, { strokeWidth: 2 }),
          min: 0,
          extraMax: 0.1,
          maxPrecision: 0
        })
      )

      const addedSeries = this.chart.series.push(
        am5radar.SmoothedRadarLineSeries.new(root, {
          name: item.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: item.valueYField,
          categoryXField: this.chartData.categoryFieldName,
          tooltip: am5.Tooltip.new(root, {
            labelText: '{name}: {valueY}'
          })
        })
      )

      addedSeries.data.setAll(this.chartData.items)

      addedSeries.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { fill: addedSeries.get('fill'), radius: 5 })
        })
      })

      const renderer = yAxis.get('renderer')
      renderer.labels.template.set('fill', addedSeries.get('fill'))
      renderer.set('stroke', addedSeries.get('fill'))
    })
  }

  private createLegend(root: am5.Root, chart: am5xy.XYChart): void {
    let layout = null

    if (this.options.legendLayout == 'horizontal') {
      layout = root.horizontalLayout
    } else if (this.options.legendLayout == 'vertical') {
      layout = root.verticalLayout
    } else {
      layout = root.gridLayout
    }

    this.legend = chart.children.unshift(
      am5.Legend.new(root, {
        layout: layout,
        x: am5.p100,
        centerX: am5.p100,
        y: new am5.Percent(-5),
        centerY: new am5.Percent(-5)
      })
    )

    this.legend.data.setAll(chart.series.values)
  }
}
</script>
