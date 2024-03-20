<template>
  <CSmartTable
    :columns="options.columnDefinitions"
    :columnSorter="columnSorter"
    :sorterValue="sortItem"
    :items="items"
    :itemsPerPage="pageSize"
    :itemsPerPageSelect="pageSizeSelectLabel"
    :itemsPerPageOptions="pageSizeItems"
    :pagination="pagination"
    :paginationProps="paginationProps"
    :tableProps="{ hover: true, bordered: true }"
    @active-Page-change="pageOnChange"
    @items-per-page-change="pageSizeOnChange"
    @sorter-change="sortOnChange"
  />
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import type { TSmartTableOptions } from '@/types/types'
import type { PropType } from 'vue'
import type {
  Pagination,
  Sorter,
  SorterValue
} from '@coreui/vue-pro/dist/components/smart-table/types'

@Options({
  props: {
    options: { type: Object as PropType<TSmartTableOptions>, required: true, default: {} },
    dataSource: { type: String as () => Array<any> | string, required: true, default: [] },
    searchCriterias: { type: Object as PropType<any>, default: {} },
    itemsPerPage: { type: Number, default: undefined }
  },
  emits: ['grid-ready', 'grid-data-loaded'],
  watch: {
    itemsPerPage(): void {
      this.pageSize = this.itemsPerPage

      this.setTableData()
    }
  }
})
export default class SmartTable extends Vue {
  options!: TSmartTableOptions
  dataSource!: Array<any> | string
  searchCriterias: any
  itemsPerPage?: number | undefined

  items: Array<any> = []
  totalCount: number | null = null
  pageSizeSelect: boolean = false
  pageSize: number | null = null
  pageSizeSelectLabel: string | null = null
  pageSizeItems: Array<number> | null = null
  columnSorter: Sorter | boolean = false
  pagination: Pagination | boolean = false
  paginationProps: any | null = null
  pageNumber: number | null = null
  totalPage: number | null = null
  sortItem: SorterValue | null = null
  orderby: string | null = null

  pageOnChange: Function | null = null
  pageSizeOnChange: Function | null = null
  sortOnChange: Function | null = null

  async created(): Promise<void> {
    this.setOptions()

    if (typeof this.dataSource == 'string') {
      await this.setTableData()
    } else {
      this.items = this.dataSource
    }

    this.options.columnDefinitions.map((element) => {
      if (!element._style) {
        element._style = {}
      }

      if (element.width) {
        if (typeof element.width == 'string') {
          element._style.width = element.width
        } else {
          element._style.width = `${element.width}px`
        }
      } else {
        element._style.width = `calc(100% / ${this.options.columnDefinitions.length})`
      }
    })
  }

  mounted(): void {
    const root = this.$el as HTMLDivElement

    root.classList.add('smart-table')

    const tableWrapper = root.querySelector('.position-relative') as HTMLDivElement
    const pager = root.querySelector('.row') as HTMLDivElement

    tableWrapper.classList.add('table-wrapper')
    tableWrapper.style.setProperty('height', `calc(100% - ${pager.clientHeight}px)`)
  }

  async setPageNumber(pageNumber: number): Promise<void> {
    if (this.options.pagination == 'serverSide') {
      this.pageNumber = pageNumber

      await this.setTableData()
    }
  }

  async setPageSize(pageSize: number): Promise<void> {
    if (this.options.pagination == 'serverSide') {
      this.pageSize = pageSize

      await this.setTableData()
    }
  }

  async setColumnSorter(sort: SorterValue): Promise<void> {
    if (this.options.pagination == 'serverSide') {
      this.sortItem = sort

      await this.setTableData()
    }
  }

  private setOptions() {
    if (this.options.pagination == 'serverSide') {
      this.columnSorter = { external: true }
      this.pagination = { external: true }

      this.pageSize = this.itemsPerPage ? this.itemsPerPage : 10
      this.pageNumber = 1

      this.paginationProps = { activePage: this.pageNumber, pages: 1 }
      this.pageOnChange = this.setPageNumber
      this.sortOnChange = this.setColumnSorter
    } else {
      const pagination = this.options.pagination == 'clientSide'

      this.columnSorter = pagination
      this.pagination = pagination

      if (pagination) {
        this.pageSize = this.itemsPerPage ? this.itemsPerPage : 10
        this.pageNumber = 1
        this.pageOnChange = this.setPageNumber
        this.sortOnChange = this.setColumnSorter
      }
    }

    if (this.options.showPageSizeSelect) {
      this.pageSizeSelect = true

      if (this.options.pageSizeSelectLabel) {
        this.pageSizeSelectLabel = this.options.pageSizeSelectLabel
      } else {
        this.pageSizeSelectLabel = this.$t('PageSize')
      }

      if (this.options.pageSizeItems) {
        this.pageSizeItems = this.options.pageSizeItems
      } else {
        this.pageSizeItems = [10, 50, 100]
      }

      this.pageSizeOnChange = this.setPageSize
    }
  }

  private async setTableData() {
    this.searchCriterias.pageSize = this.pageSize!
    this.searchCriterias.offset = this.pageSize! * this.pageNumber! - this.pageSize!

    if (this.sortItem) {
      this.searchCriterias.orderby = `${this.sortItem.column} ${this.sortItem.state}`
    }

    this.searchCriterias.orderby = ''

    if (this.sortItem) {
      this.searchCriterias.orderby = `${this.sortItem.column} ${this.sortItem.state}`
    }

    const response = await this.$http.postAsync(this.dataSource as string, this.searchCriterias)

    for (let key in response) {
      if (Array.isArray(response[key])) {
        this.items = response[key]
      } else if (typeof response[key] == 'number') {
        this.totalCount = response[key]
      } else {
        throw Error('Grid DataSource is wrong.')
      }
    }

    this.paginationProps.pages =
      Math.ceil((this.totalCount as number) / (this.pageSize as number)) || 1
  }
}
</script>
