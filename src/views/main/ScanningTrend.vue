<template>
  <div class="dashboard-tile" style="display: flex">
    <div style="width: 50%; height: 100%">
      <div class="title">
        {{ $t('Scanning') }}
      </div>

      <div class="content">
        <ClusteredBarChart
          :options="options"
          :seriesItems="scanningChart.seriesItems"
          :chartData="scanningChart.data"
        >
        </ClusteredBarChart>
      </div>
    </div>

    <div style="width: 50%; height: 100%">
      <div class="title">
        {{ $t('WebHacking') }}
      </div>

      <div class="content">
        <ClusteredBarChart
          :options="options"
          :seriesItems="webHackingChart.seriesItems"
          :chartData="webHackingChart.data"
        >
        </ClusteredBarChart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

import type { PropType } from 'vue'
import type { TChart, TXYChartOptions } from '@/types/chart-types'

@Options({
  props: {
    scanningChart: { type: Object as PropType<TChart>, required: true, default: {} },
    webHackingChart: { type: Object as PropType<TChart>, required: true, default: {} }
  }
})
export default class ScanningTrend extends Base {
  scanningChart!: TChart
  options: TXYChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical',
    multipleSeries: false
  }

  webHackingChart!: TChart
}
</script>
