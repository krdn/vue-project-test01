<!-- <template>
  <div ref="variableRaderChart" class="chart-wrapper"></div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { RadarAxesType } from '@/types/enum';
import { TimeUnit } from '@amcharts/amcharts5/.internal/core/util/Time';
import { DateAxis, CategoryAxis, ValueAxis } from '@amcharts/amcharts5/xy';
import type { TVariableRadarChartOptions } from '@/types/chart-types';
import * as am5 from '@amcharts/amcharts5';
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Options({
  props: {
    options: { type: Object as () => TVariableRadarChartOptions, required: true, default: {} },
    chartData: { type: Object as () => Array<any>, required: true, default: [] }
  }
})
export default class VariableRadarChart extends Vue {
  chartData!: Array<any>;
  options!: TVariableRadarChartOptions;
  newData: Array<any> = [];
  chart!: am5radar.RadarChart;

  created(): void {
    this.migrateData();
  }

  mounted(): void {
    const root = am5.Root.new(this.$refs.variableRaderChart as HTMLElement);
    root.setThemes([am5themes_Animated.new(root)]);

    this.createChart(root);
    const xAxis = this.createXAxis(root);
    const yAxis = this.createYAxis(root);
    const series = this.createSeries(root, xAxis, yAxis);

    series.data.setAll(this.newData);
    series.appear(1000);
    this.chart.appear(1000, 100);
  }

  /**
   * 원본 데이터를 유지하기 위해 원본 데이터를 복사해서 사용한다.
   */
  private migrateData(): void {
    this.chartData.map(element => {
      const newElement = Object.assign({}, element);

      if (this.options.axesType == RadarAxesType.dateAxis && typeof newElement[this.options.valueXField] == 'string') {
        const date = new Date(newElement[this.options.valueXField]);
        date.setHours(0, 0, 0, 0);

        newElement[this.options.valueXField] = date.getTime();
      }

      this.newData.push(newElement);
    });
  }

  private createChart(root: am5.Root): void {
    const settings = { panX: this.options.panX, panY: this.options.panY, innerRadius: this.options.innerRadius, layout: root.verticalLayout } as any;

    this.chart = root.container.children.push(am5radar.RadarChart.new(root, settings));
  }

  private createXAxis(root: am5.Root) {
    let xAxis = null;

    const xRenderer = am5radar.AxisRendererCircular.new(root, {});
    xRenderer.labels.template.setAll({ textType:"adjusted" });

    if (this.options.axesType == RadarAxesType.dateAxis) {
      const dateFormats = {} as any;
      dateFormats[this.options.timeUnit as string] = this.options.dateFormat;

      xAxis = this.chart.xAxes.push(DateAxis.new(root, {
        maxDeviation: 0,
        baseInterval: {
          timeUnit: this.options.timeUnit as TimeUnit,
          count: 1
        },
        renderer: xRenderer,
        groupData: false,
        dateFormats: dateFormats,
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: 'yyyy-MM-dd'
      }));
    } else if (this.options.axesType == RadarAxesType.categoryAxis) {
      xAxis = this.chart.xAxes.push(CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: this.options.categoryField as string,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));
    }

    xAxis!.data.setAll(this.newData);

    return xAxis;
  }

  private createYAxis(root: am5.Root) {
    return this.chart.yAxes.push(ValueAxis.new(root, { renderer: am5radar.AxisRendererRadial.new(root, {}), min: 0 }));
  }

  private createSeries(root: am5.Root, xAxis: any, yAxis: any): am5radar.RadarColumnSeries {
    const series = this.chart.series.push(am5radar.RadarColumnSeries.new(root, {
      name: 'Series',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: this.options.valueYField,
      categoryXField: this.options.categoryField,
      tooltip: am5.Tooltip.new(root, {
        labelText: '{valueX}'
      })
    }));

    // series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add('fill', (fill, target) => {
      return this.chart.get('colors')!.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add('stroke', (stroke, target) => {
      return this.chart.get('colors')!.getIndex(series.columns.indexOf(target));
    });

    return series;
  }
}
</script> -->
