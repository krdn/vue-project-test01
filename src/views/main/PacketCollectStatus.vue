<template>
  <div class="dashboard-tile">
    <div class="title">
      {{ $t('TotalLogCollectionTrend') }}
      <CommonIcon
        :width="24"
        :height="24"
        icon="link"
        class="inline"
        @click="goToWebLogCollection"
        v-if="link"
      ></CommonIcon>
    </div>

    <div class="content">
      <LineChart
        :options="options"
        :seriesItems="chart.seriesItems"
        :chartData="chart.data"
      ></LineChart>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

import type { PropType } from 'vue'
import type { TChart, TXYChartOptions } from '@/types/chart-types'

@Options({
  props: {
    chart: { type: Object as PropType<TChart>, required: true, default: {} },
    link: { type: Boolean, required: false, default: true }
  }
})
export default class PacketCollectStatus extends Base {
  link!: boolean
  chart!: TChart
  options: TXYChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical',
    multipleSeries: true
  }

  goToWebLogCollection(e: Event) {
    this.$router.push({ name: 'WebLogCollectStatusMain' })
  }
}
</script>
