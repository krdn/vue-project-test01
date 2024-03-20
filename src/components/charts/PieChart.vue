<template>
  <div ref="variableRadiusPieChart" class="chart-wrapper"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

@Options({
  props: {
    options: { type: Object, required: true, default: {} },
    chartData: { type: Object as () => Array<any>, required: true, default: [] }
  }
})
export default class VariableRadiusPieChart extends Vue {
  options!: any
  chartData!: Array<any>
  chart!: am5percent.PieChart

  mounted(): void {
    if (this.chartData.length > 0) {
      const root = am5.Root.new(this.$refs.variableRadiusPieChart as HTMLElement)
      root.setThemes([am5themes_Animated.new(root)])

      this.createChart(root)

      let series

      if (this.options.variableRadius) {
        series = this.createVariableRadiusSeries(root)
      } else {
        series = this.createSeries(root)
      }

      this.createLegend(root, series)

      this.chart.appear(1000, 100)
    }
  }

  private createChart(root: am5.Root): void {
    this.chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      })
    )
  }

  private createVariableRadiusSeries(root: am5.Root) {
    const series = this.chart.series.push(
      am5percent.PieSeries.new(root, {
        alignLabels: true,
        calculateAggregates: true,
        valueField: 'value',
        categoryField: 'category'
      })
    )
    series.slices.template.setAll({ strokeWidth: 3, stroke: am5.color(0xffffff) })
    series.labelsContainer.set('paddingTop', 30)

    series.slices.template.adapters.add('radius', (radius: any, target): any => {
      let dataItem = target.dataItem as any
      let high = series.getPrivate('valueHigh') as any

      if (dataItem) {
        let value = dataItem.get('valueWorking', 0)
        return (radius * value) / high
      }

      return radius
    })

    series.data.setAll(this.chartData)

    return series
  }

  private createSeries(root: am5.Root) {
    const series = this.chart.series.push(
      am5percent.PieSeries.new(root, { valueField: 'value', categoryField: 'category' })
    )
    series.data.setAll(this.chartData)

    return series
  }

  private createLegend(root: am5.Root, series: am5percent.PieSeries) {
    const legend = this.chart.children.push(
      am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 15, marginBottom: 15 })
    )
    legend.data.setAll(series.dataItems)
  }
}
</script>
