<template>
  <div ref="lineChart" class="chart-wrapper"></div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import type { TXYChartOptions, TChartData, TXYChartSeries } from '@/types/chart-types'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

@Options({
  props: {
    options: { type: Object as () => TXYChartOptions, required: true, default: {} },
    seriesItems: { type: Object as () => Array<TXYChartSeries>, required: true, default: [] },
    chartData: {
      type: Object as () => TChartData,
      required: true,
      default: { categoryFieldName: 'category', items: [] }
    }
  }
})
export default class LineChart extends Vue {
  chartData!: TChartData
  options!: TXYChartOptions
  seriesItems!: Array<TXYChartSeries>
  chart!: am5xy.XYChart
  legend!: am5.Legend

  mounted(): void {
    if (this.seriesItems.length > 0 && this.chartData.items.length > 0) {
      const root = am5.Root.new(this.$refs.lineChart as HTMLElement)
      root.setThemes([am5themes_Animated.new(root)])

      this.createChart(root)
      const xAxis = this.createXAxis(root)

      if (this.options.multipleSeries) {
        this.createMultipleSeries(root, xAxis)
      } else {
        this.createSeries(root, xAxis)
      }

      this.createLegend(root)

      this.chart.set('cursor', am5xy.XYCursor.new(root, {})).lineY.set('visible', false)

      this.chart.series.each((item: am5xy.XYSeries) => {
        item.appear(1000, 100)
      })
      this.chart.appear(1000, 100)
    }
  }

  updated(): void {
    this.chart.xAxes.each((xAxis) => {
      xAxis.data.setAll(this.chartData.items)
    })

    this.legend.data.clear()

    this.chart.series.each((series) => {
      series.set(
        'name',
        this.seriesItems.filter((element) => element.valueYField == series.get('valueYField'))[0]
          .name
      )
      series.data.setAll(this.chartData.items)

      this.legend.data.push(series)
    })
  }

  private createChart(root: am5.Root): void {
    const settings = {
      panX: this.options.panX,
      panY: this.options.panY,
      layout: root.verticalLayout
    } as any

    if (this.options.scrollbarX) {
      settings.scrollbarX = am5xy.XYChartScrollbar.new(root, {
        orientation: 'horizontal',
        minHeight: 3
      })
    }

    this.chart = root.container.children.push(am5xy.XYChart.new(root, settings))
  }

  private createXAxis(root: am5.Root) {
    let xAxis = null

    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 0 })

    xAxis = this.chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: this.chartData.categoryFieldName as string,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    ;(xAxis as any).onPrivate('cellWidth', (cellWidth: any): any => {
      let rotated = false

      xRenderer.labels.each((label) => {
        if (label.width() > cellWidth) {
          rotated = true
        }
      })

      if (rotated) {
        xRenderer.labels.template.setAll({ rotation: -45, centerX: am5.p100 })
      } else {
        xRenderer.labels.template.setAll({ rotation: 0, centerX: am5.p50 })
      }
    })

    xRenderer.grid.template.setAll({ location: 1 })

    xAxis.data.setAll(this.chartData.items)

    return xAxis
  }

  private createSeries(root: am5.Root, xAxis: any): void {
    const yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.5, opacity: 0.5 }),
        min: 0,
        extraMax: 0.1,
        maxPrecision: 0
      })
    ) as any

    this.seriesItems.forEach((item) => {
      const addedSeries = this.chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
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

      addedSeries.bullets.push((root: am5.Root) => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { radius: 4, fill: addedSeries.get('fill') })
        })
      })
    })
  }

  private createMultipleSeries(root: am5.Root, xAxis: any): void {
    let opposite = false

    this.seriesItems.forEach((item) => {
      const yAxis = this.chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.5,
            opacity: 0.5,
            opposite: opposite
          }),
          min: 0,
          extraMax: 0.1,
          maxPrecision: 0
        })
      )

      const addedSeries = this.chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
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

      addedSeries.bullets.push((root: am5.Root) => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { radius: 4, fill: addedSeries.get('fill') })
        })
      })

      const renderer = yAxis.get('renderer')
      renderer.labels.template.set('fill', addedSeries.get('fill'))
      renderer.set('stroke', addedSeries.get('fill'))

      opposite = !opposite
    })
  }

  private createLegend(root: am5.Root): void {
    let layout = null

    if (this.options.legendLayout == 'horizontal') {
      layout = root.horizontalLayout
    } else if (this.options.legendLayout == 'vertical') {
      layout = root.verticalLayout
    } else {
      layout = root.gridLayout
    }

    this.legend = this.chart.children.unshift(
      am5.Legend.new(root, {
        layout: layout,
        x: am5.p100,
        centerX: am5.p100,
        y: new am5.Percent(-5),
        centerY: new am5.Percent(-5)
      })
    )

    this.legend.data.setAll(this.chart.series.values)
  }
}
</script>
