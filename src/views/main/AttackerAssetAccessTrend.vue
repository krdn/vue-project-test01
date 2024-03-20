<template>
  <div class="dashboard-tile">
    <div class="title">
      {{ $t('AttackerAssetAccessTrend') }}
    </div>

    <div class="content">
      <TraceableSankeyDiagram
        :options="options"
        :diagramData="diagramData"
      ></TraceableSankeyDiagram>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import { TSankeyOptions, TSankeyData } from '@/types/chart-types'

@Options({
  props: {
    diagramData: { type: Object as () => Array<TSankeyData>, required: true, default: {} }
  }
})
export default class AttackerAssetAccessTrend extends Base {
  diagramData!: Array<TSankeyData>
  options: TSankeyOptions = {
    orientation: 'horizontal',
    nodeWidth: 5,
    tooltipValueFieldName: 'tryCount'
  }
}
</script>
