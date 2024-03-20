<template>
  <div class="dashboard-tile">
    <div class="title">
      {{ $t('WebHacking') }}
    </div>

    <div class="content">
      <ClusteredBarChart
        :options="options"
        :seriesItems="chart.seriesItems"
        :chartData="chart.data"
      ></ClusteredBarChart>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

import type { PropType } from 'vue'
import type { TChart, TXYChartOptions } from '@/types/chart-types'

@Options({
  props: {
    chart: { type: Object as PropType<TChart>, required: true, default: {} }
  }
})
export default class WebHackingTrend extends Base {
  chart!: TChart
  options: TXYChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical',
    multipleSeries: true
  }
}
</script>
