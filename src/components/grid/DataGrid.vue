<template>
  <AgGridVue
    class="ag-theme-alpine"
    :style="gridStyle"
    :columnDefs="config.columnDefinitions"
    :pagination="config.pagination"
    :paginationPageSize="itemsPerPage"
    :cacheBlockSize="50"
    :rowBuffer="50"
    :rowData="rowData"
    :datasource="dataSource"
    :rowModelType="rowModelType"
    :suppressRowTransform="config.needMergeCell"
    :suppressMovableColumns="config.notAllowMovableColumns"
    :defaultColDef="defaultColumnDefinition"
    :suppressRowClickSelection="false"
    :suppressSizeToFit="true"
    :rowSelection="rowSelection"
    :rowMultiSelectWithClick="rowMultiSelectWithClick"
    :context="context"
    :rowHeight="35"
    :enableBrowserTooltips="true"
    @virtualRowRemoved="virtualRowOnRemove"
    @paginationChanged="pageOnChange"
    @rowClicked="config.onRowClick"
    @grid-ready="onGridReady"
  >
  </AgGridVue>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { AgGridVue } from '@ag-grid-community/vue3'
import {
  ModuleRegistry,
  ColDef,
  GridApi,
  ColumnApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  ICellRendererParams,
  IRowNode,
  PaginationChangedEvent,
  VirtualRowRemovedEvent
} from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { CsvExportModule } from '@ag-grid-community/csv-export'
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model'
import type { TDataGridOptions, TDataGridCustomApi } from '@/types/types'
import type { PropType } from 'vue'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule, InfiniteRowModelModule])

@Options({
  props: {
    config: { type: Object as PropType<TDataGridOptions>, required: true, default: {} },
    gridData: { type: [Array, String], required: true, default: '' },
    exportData: { type: String, required: false, default: '' },
    searchCriterias: { type: Object as PropType<any>, required: false, default: {} },
    itemsPerPage: { type: Number, required: false, default: 50 },
    rowSelection: { type: String, required: false, default: 'single' },
    rowMultiSelectWithClick: { type: Boolean, required: false, default: false },
    context: { type: Object as () => any, required: false, default: {} },
    autoSizeStrategy: { type: Object as () => any, required: false, default: {} }
  },
  components: { AgGridVue },
  emits: ['grid-ready', 'grid-data-loaded'],
  watch: {
    itemsPerPage() {
      this.removeAllDetails()
    }
  }
})
export default class DataGrid extends Vue {
  // Component Properties
  config!: TDataGridOptions
  gridData!: Array<any> | string
  exportData?: string
  searchCriterias?: any
  rowSelection?: string
  rowMultiSelectWithClick?: boolean

  itemsPerPage!: number

  // Public Property
  rowModelType: string = ''
  gridStyle: any = { width: null, height: null }
  defaultColumnDefinition: ColDef = { sortable: true }
  rowData: Array<any> | null = null
  dataSource: IDatasource | null = null
  context?: any
  gridApi?: GridApi
  columnApi?: ColumnApi
  customApi!: TDataGridCustomApi

  // Private Property
  private observer?: MutationObserver

  // Lifecycle
  async created(): Promise<void> {
    if (this.config.detailColumns && this.config.detailColumns.length > 0) {
      this.config.columnDefinitions![0].cellRenderer = (props: ICellRendererParams) => {
        const wrapper = document.createElement('span')
        const expandIcon = document.createElement('span')
        const valueElement = document.createElement('span')

        wrapper.appendChild(expandIcon)
        wrapper.appendChild(valueElement)

        expandIcon.style.setProperty('margin-right', '12px')
        expandIcon.style.setProperty('cursor', 'pointer')
        expandIcon.classList.add('ag-icon')
        expandIcon.classList.add('ag-icon-tree-closed')
        expandIcon.onclick = this.expandRowOnClick

        valueElement.innerText = props.value

        return wrapper
      }
    }

    await this.setData()

    window.addEventListener('resize', this.resizeGrid)
  }

  mounted(): void {
    this.setGridHeight()
  }

  unmounted(): void {
    this.observer?.disconnect()
  }

  destroyed(): void {
    window.removeEventListener('resize', this.resizeGrid)
  }

  // Events
  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api
    this.columnApi = e.columnApi
    this.customApi = {
      exportCSVCurrentPage: this.exportCSVCurrentPage,
      exportCSV: this.exportCSV,
      search: this.search
    }

    this.resizeColumnToFit()

    const detailWrapper = this.$el.querySelector('.ag-full-width-container')

    this.observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (
          mutation.type == 'childList' &&
          detailWrapper.children.length == 0 &&
          mutation.removedNodes.length > 0
        ) {
          this.gridApi?.purgeInfiniteCache()

          break
        }
      }
    })

    this.observer.observe(detailWrapper, { childList: true })

    this.$emit('grid-ready', this.gridApi, this.columnApi, this.customApi, this)
  }

  async search(): Promise<void> {
    this.setData(false)
  }

  async exportCSVCurrentPage(): Promise<void> {
    const totalRowCount = this.gridApi?.paginationGetRowCount()

    if (totalRowCount) {
      const currentPageNumber = this.gridApi?.paginationGetCurrentPage() as number
      const pageSize = this.gridApi?.paginationGetPageSize() as number
      const offset = pageSize * currentPageNumber

      await this.downloadCSV(offset, pageSize)
    }

    return
  }

  async exportCSV(): Promise<void> {
    const totalRowCount = this.gridApi?.paginationGetRowCount()

    if (totalRowCount) {
      await this.downloadCSV(0, 1000000)
    }

    return
  }

  expandRowOnClick(e: Event): void {
    e.stopPropagation()
    const element = e.target as HTMLSpanElement

    if (element.classList.contains('ag-icon-tree-closed')) {
      element.classList.remove('ag-icon-tree-closed')
      element.classList.add('ag-icon-tree-open')

      this.appendDetail(element)
    } else {
      element.classList.remove('ag-icon-tree-open')
      element.classList.add('ag-icon-tree-closed')

      this.removeDetail(element)
    }
  }

  pageOnChange(e: PaginationChangedEvent): void {
    const detailWrapper = this.$el.querySelector('.ag-full-width-container') as HTMLDivElement

    if (detailWrapper.lastElementChild) {
      const viewport = this.$el.querySelector(
        '.ag-center-cols-viewport[role="presentation"]'
      ) as HTMLDivElement
      const rowGroup = this.$el.querySelector(
        '.ag-center-cols-container[role="rowgroup"]'
      ) as HTMLDivElement

      let detailHeight = 0

      while (detailWrapper.lastElementChild) {
        detailHeight = detailHeight + detailWrapper.lastElementChild.clientHeight

        detailWrapper.lastElementChild.remove()
      }

      const viewportHeight = parseInt(
        viewport.style.getPropertyValue('height').match(/[0-9]+/g)![0]
      )
      const rowGroupHeight = parseInt(
        rowGroup.style.getPropertyValue('height').match(/[0-9]+/g)![0]
      )

      viewport.style.setProperty('height', `${viewportHeight - detailHeight}px`)
      rowGroup.style.setProperty('height', `${rowGroupHeight - detailHeight}px`)
    }
  }

  virtualRowOnRemove(e: VirtualRowRemovedEvent): void {
    const viewport = this.$el.querySelector(
      '.ag-center-cols-viewport[role="presentation"]'
    ) as HTMLDivElement
    const detailWrapper = this.$el.querySelector('.ag-full-width-container') as HTMLDivElement
    const rowGroup = this.$el.querySelector(
      '.ag-center-cols-container[role="rowgroup"]'
    ) as HTMLDivElement
    const bottom = this.gridApi?.getVerticalPixelRange().bottom as number
    const viewportHeight = parseInt(viewport.style.getPropertyValue('height').match(/[0-9]+/g)![0])

    if (detailWrapper.lastElementChild && bottom + 500 < viewportHeight) {
      const viewport = this.$el.querySelector(
        '.ag-center-cols-viewport[role="presentation"]'
      ) as HTMLDivElement

      let detailHeight = 0

      while (detailWrapper.lastElementChild) {
        detailHeight = detailHeight + detailWrapper.lastElementChild.clientHeight

        detailWrapper.lastElementChild.remove()
      }

      const viewportHeight = parseInt(
        viewport.style.getPropertyValue('height').match(/[0-9]+/g)![0]
      )
      const rowGroupHeight = parseInt(
        rowGroup.style.getPropertyValue('height').match(/[0-9]+/g)![0]
      )

      viewport.style.setProperty('height', `${viewportHeight - detailHeight}px`)
      rowGroup.style.setProperty('height', `${rowGroupHeight - detailHeight}px`)
    }
  }

  // Private Methods
  private appendDetail(element: HTMLSpanElement): void {
    const viewport = element.closest('[role="presentation"]') as HTMLDivElement
    const rowGroup = element.closest('[role="rowgroup"]') as HTMLDivElement
    const row = element.closest('[role="row"]') as HTMLDivElement
    const detail = document.createElement('div')
    const rowId = row.getAttribute('row-id') as string
    const rowNode = this.gridApi?.getRowNode(rowId) as IRowNode

    let matchData = row.style.getPropertyValue('height').match(/[0-9]+/g)
    let rowHeight = 0

    if (matchData && matchData.length > 0) {
      rowHeight = parseInt(matchData[0])
    }

    matchData = row.style.getPropertyValue('transform').match(/[0-9]+/g)
    let position = 0

    if (matchData && matchData.length > 0) {
      position = parseInt(matchData[0])
    }

    const detailWrapper = this.$el.querySelector('.ag-full-width-container') as HTMLDivElement
    detailWrapper.append(detail)
    detail.style.setProperty('width', '100%')
    detail.style.setProperty('padding', '17px')
    detail.style.setProperty('position', 'absolute')
    detail.style.setProperty('font-size', '14px')
    detail.style.setProperty('border-bottom', '1px solid #dde2eb')
    detail.style.setProperty('transform', `translateY(${rowHeight + position}px)`)

    detail.setAttribute('role', 'row')
    detail.setAttribute('row-id', rowId)

    for (let detailColumn of this.config.detailColumns!) {
      if (detailColumn == 'threat_scoring_expanded') {
        const ul = document.createElement('ul')
        ul.setAttribute('class', 'pad-inline-0')
        ul.innerHTML = rowNode.data[detailColumn]
        detail.append(ul)
      } else {
        const p = document.createElement('p')
        p.style.setProperty('word-break', 'break-word')

        if (detailColumn == 'raw_packet_data') {
          rowNode.data[detailColumn] = this.highlightXaiKeywords(
            rowNode.data['xai'],
            rowNode.data[detailColumn]
          )
        }

        if (detailColumn == 'xai') {
          rowNode.data[detailColumn] = this.getTop5Xai(rowNode.data[detailColumn])
        }

        p.innerHTML = rowNode.data[detailColumn]
        detail.append(p)
      }
    }

    const detailHeight = detail.clientHeight

    for (let i = 0; i < detailWrapper.children.length; i++) {
      const child = detailWrapper.children[i] as HTMLDivElement
      const childRowId = parseInt(child.getAttribute('row-id') as string)

      if (childRowId > parseInt(rowId)) {
        matchData = child.style.getPropertyValue('transform').match(/[0-9]+/g)

        if (matchData && matchData.length > 0) {
          position = parseInt(matchData[0])

          child.style.setProperty('transform', `translateY(${position + detailHeight}px)`)
        }
      }
    }

    const viewportHeight = parseInt(viewport.style.getPropertyValue('height').match(/[0-9]+/g)![0])
    const rowGroupHeight = parseInt(rowGroup.style.getPropertyValue('height').match(/[0-9]+/g)![0])

    viewport.style.setProperty('height', `${viewportHeight + detailHeight}px`)
    rowGroup.style.setProperty('height', `${rowGroupHeight + detailHeight}px`)

    for (let child of rowGroup.children) {
      const childElement = child as HTMLDivElement
      const childRowId = parseInt(childElement.getAttribute('row-id') as string)

      if (childRowId > parseInt(rowId)) {
        const transform = childElement.style.getPropertyValue('transform')
        const position = parseInt(transform.match(/[0-9]+/g)![0])

        childElement.style.setProperty('transform', `translateY(${position + detailHeight}px)`)
      }
    }
  }

  private removeDetail(element: HTMLSpanElement): void {
    const viewport = element.closest('[role="presentation"]') as HTMLDivElement
    const rowGroup = element.closest('[role="rowgroup"]') as HTMLDivElement
    const row = element.closest('[role="row"]') as HTMLDivElement
    const rowId = row.getAttribute('row-id') as string

    const detailWrapper = this.$el.querySelector('.ag-full-width-container') as HTMLDivElement
    const detail = detailWrapper.querySelector(`[row-id="${rowId}"]`) as HTMLDivElement
    const detailHeight = detail.clientHeight
    detail.remove()

    let matchData = null
    let position = null

    for (let i = 0; i < detailWrapper.children.length; i++) {
      const child = detailWrapper.children[i] as HTMLDivElement
      const childRowId = parseInt(child.getAttribute('row-id') as string)

      if (childRowId > parseInt(rowId)) {
        matchData = child.style.getPropertyValue('transform').match(/[0-9]+/g)

        if (matchData && matchData.length > 0) {
          position = parseInt(matchData[0])

          child.style.setProperty('transform', `translateY(${position - detailHeight}px)`)
        }
      }
    }

    const viewportHeight = parseInt(viewport.style.getPropertyValue('height').match(/[0-9]+/g)![0])
    const rowGroupHeight = parseInt(rowGroup.style.getPropertyValue('height').match(/[0-9]+/g)![0])

    viewport.style.setProperty('height', `${viewportHeight - detailHeight}px`)
    rowGroup.style.setProperty('height', `${rowGroupHeight - detailHeight}px`)

    let currentRow = row.nextSibling as any

    while (currentRow != null) {
      const transform = currentRow.style.getPropertyValue('transform')
      const position = parseInt(transform.match(/[0-9]+/g)[0])

      currentRow.style.setProperty('transform', `translateY(${position - detailHeight}px)`)

      currentRow = currentRow.nextSibling
    }
  }

  private removeAllDetails(): void {
    const detailWrapper = this.$el.querySelector('.ag-full-width-container') as HTMLDivElement

    if (detailWrapper.lastElementChild) {
      const viewport = this.$el.querySelector(
        '.ag-center-cols-viewport[role="presentation"]'
      ) as HTMLDivElement
      const rowGroup = this.$el.querySelector(
        '.ag-center-cols-container[role="rowgroup"]'
      ) as HTMLDivElement

      let detailHeight = 0

      while (detailWrapper.lastElementChild) {
        detailHeight = detailHeight + detailWrapper.lastElementChild.clientHeight

        detailWrapper.lastElementChild.remove()
      }

      viewport.style.setProperty('height', `${viewport.clientHeight - detailHeight}px`)
      rowGroup.style.setProperty('height', `${viewport.clientHeight - detailHeight}px`)
    }
  }

  private async downloadCSV(offset: number, pageSize: number): Promise<void> {
    const parameters = Object.assign({}, this.searchCriterias)
    parameters.offset = offset
    parameters.pageSize = pageSize

    const downloadAPIUrl = this.exportData ? this.exportData : (this.gridData as string)

    const data = await this.$http.downloadFile(downloadAPIUrl, parameters)

    const url = window.URL.createObjectURL(data.blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', data.fileName)
    a.click()
    a.remove()
  }

  private async setData(optBypassShowLoading?: boolean): Promise<void> {
    if (this.config.pagination && this.config.serverPagination) {
      this.rowModelType = 'infinite'
      this.dataSource = this.createDataSource()
    } else {
      this.rowModelType = 'clientSide'

      if (typeof this.gridData == 'string') {
        const response = await this.$http.postAsync(
          this.gridData,
          this.searchCriterias,
          optBypassShowLoading == undefined
        )

        if (Array.isArray(response)) {
          this.rowData = response
        } else {
          let executeTime = response.executeTime
          this.rowData = response.data
        }
      } else {
        this.rowData = this.gridData
      }

      this.$emit('grid-data-loaded', true)
    }
  }

  private createDataSource(): IDatasource {
    return {
      rowCount: this.itemsPerPage,
      getRows: async (params: IGetRowsParams) => {
        let parameters: any = Object.assign({}, this.searchCriterias)

        const orderByItems = []

        for (let model of params.sortModel) {
          orderByItems.push(`${model.colId} ${model.sort}`)
        }

        if (this.config.pagination && this.config.serverPagination) {
          parameters.offset = params.startRow
          parameters.pageSize = 50
        }

        if (orderByItems.length > 0) {
          parameters.orderby = orderByItems.join(', ')
        }

        const response = await this.$http.postAsync(this.gridData as string, parameters, true)
        let dataSource = response.data
        let totalCount = response.totalCount
        let executeTime = response.executeTime

        params.successCallback(dataSource, totalCount)

        this.$emit('grid-data-loaded', true)
      }
    }
  }

  private setGridHeight(): void {
    setTimeout(() => {
      // 따로 넓이를 설정하지 않으면 그리드의 넓이는 100%
      if (!this.config.width) {
        this.gridStyle.width = '100%'
      } else {
        this.gridStyle.width =
          typeof this.config.width == 'string' ? this.config.width : `${this.config.width}px`
      }

      // 높이를 설정하지 않으면 부모 높이 - 부모의 자식 엘리먼트 높이 한 값
      if (!this.config.height) {
        const parentElement = this.$el.parentElement
        const children = parentElement.children

        let parentHeight = this.getParentHeight(parentElement)
        let childrenHeight = 0

        for (let child of children) {
          if (!child.classList.contains('ag-theme-alpine')) {
            childrenHeight = childrenHeight + child.clientHeight
          }
        }

        this.gridStyle.height = `${parentHeight - childrenHeight}px`
      } else {
        this.gridStyle.height =
          typeof this.config.height == 'string' ? this.config.height : `${this.config.height}px`
      }
    })
  }

  private getParentHeight(parentElement: any): number {
    const parentStyle = getComputedStyle(parentElement)
    const parentPaddingTop = parseFloat(parentStyle.paddingTop)
    const parentPaddingBottom = parseFloat(parentStyle.paddingBottom)
    let parentHeight = parentElement.clientHeight

    if (!isNaN(parentPaddingTop)) {
      parentHeight = parentHeight - parentPaddingTop
    }

    if (!isNaN(parentPaddingBottom)) {
      parentHeight = parentHeight - parentPaddingBottom
    }

    return parentHeight
  }

  private resizeGrid(e: any) {
    this.setGridHeight()
  }

  private resizeColumnToFit(): void {
    if (this.gridApi) {
      setTimeout(() => {
        this.gridApi!.sizeColumnsToFit()
      }, 300)
    }
  }

  private highlightXaiKeywords(xai: string, rawPacket: string) {
    const parsedObject: { [value: string]: any } = JSON.parse(xai)
    const keys = Object.keys(parsedObject).slice(0, 5)

    let rawPacketData = rawPacket

    keys.forEach((key, index) => {
      const regex = new RegExp(key, 'gi')
      rawPacketData = rawPacketData.replace(regex, `<span class="xai-${index + 1}">${key}</span>`)
    })

    return rawPacketData
  }

  private getTop5Xai(xai: string) {
    const parsedObject: { [value: string]: any } = JSON.parse(xai)
    const top5Xai = Object.entries(parsedObject).slice(0, 5)

    const output = top5Xai
      .map((entry, index) => {
        let rank = ''

        switch (index) {
          case 0:
            rank = '<b>1st</b>'
            break
          case 1:
            rank = '<b>2nd</b>'
            break
          case 2:
            rank = '<b>3rd</b>'
            break
          default:
            rank = `<b>${index + 1}th</b>`
        }

        return `${rank} { "${entry[0]}": ${entry[1]} }`
      })
      .join(', ')

    return output
  }
}
</script>
