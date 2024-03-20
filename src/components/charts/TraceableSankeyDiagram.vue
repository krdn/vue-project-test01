<template>
  <div ref="traceableSnakeyDiagram" class="chart-wrapper"></div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import type { TSankeyOptions, TSankeyData } from '@/types/chart-types'
import * as am5 from '@amcharts/amcharts5'
import * as am5flow from '@amcharts/amcharts5/flow'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

@Options({
  props: {
    options: { type: Object as () => TSankeyOptions, required: true, default: {} },
    diagramData: { type: Object as () => Array<TSankeyData>, required: true, default: {} }
  }
})
export default class TraceableSankeyDiagram extends Vue {
  options!: TSankeyOptions
  diagramData!: Array<TSankeyData>
  diagram!: am5flow.Sankey

  mounted(): void {
    const root = am5.Root.new(this.$refs.traceableSnakeyDiagram as HTMLElement)
    root.setThemes([am5themes_Animated.new(root)])

    this.createSankey(root)
    this.bindEvents()
    this.setDiagramOptions()

    this.diagram.data.setAll(this.diagramData)
    this.diagram.appear(1000, 100)
  }

  updated(): void {
    this.diagram.data.setAll(this.diagramData)
  }

  private createSankey(root: am5.Root): void {
    this.diagram = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: 'from',
        targetIdField: 'to',
        valueField: 'value',
        idField: 'id',
        nodeWidth: this.options.nodeWidth,
        tooltipText: 'Incoming: {from}\nOutgoing: {to}'
      })
    )
  }

  private bindEvents(): void {
    this.diagram.links.template.events.on('pointerover', (event: am5.ISpritePointerEvent) => {
      let dataItem = event.target.dataItem as any
      let nodeIdForHover = dataItem.dataContext.nodeIdForHover

      am5.array.each(this.diagram.dataItems, (dataItem: any) => {
        if (dataItem.dataContext.nodeIdForHover == nodeIdForHover) {
          dataItem.get('link').hover()
        }
      })
    })

    this.diagram.links.template.events.on('pointerout', (event: am5.ISpritePointerEvent) => {
      am5.array.each(this.diagram.dataItems, (dataItem: any) => {
        dataItem.get('link').unhover()
      })
    })
  }

  private setDiagramOptions(): void {
    this.diagram.nodes.labels.template.setAll({
      maxWidth: 130,
      oversizedBehavior: 'wrap',
      breakWords: true,
      textAlign: 'center'
    })
    this.diagram.nodes.labels.template.adapters.add('centerX', (center, target): any => {
      const item = target.dataItem as any

      // if (item.get('outgoingLinks', []) == 0) {
      //   return am5.p100;
      // }

      // return am5.p0;
      if (item.get('incomingLinks', []) == 0) {
        return am5.p0
      } else if (item.get('outgoingLinks', []) == 0) {
        return am5.p100
      }
      return am5.p50
    })

    let linkFormat = 'From: [bold]{sourceId}[/]\nTo: [bold]{targetId}\nValue: [bold]{value}[/]'
    let nodeFormat = '[bold]{name}[/]\nOutgoing: {sumOutgoing}\nIncoming: {sumIncoming}'

    if (this.options.tooltipValueFieldName) {
      linkFormat = `From: [bold]{sourceId}[/]\nTo: [bold]{targetId}\nValue: [bold]{${this.options.tooltipValueFieldName}}[/]`
    }

    this.diagram.nodes.template?.setAll({ tooltipText: nodeFormat })
    this.diagram.links.template.setAll({ tooltipText: linkFormat })
    this.diagram.nodes.get('colors')?.set('step', 2)
  }
}
</script>
