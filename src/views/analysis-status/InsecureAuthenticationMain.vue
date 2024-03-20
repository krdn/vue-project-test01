<template>
  <div
    class="contents-wrapper"
    :class="{ 'no-display': detailView }"
    v-if="chartDataLoaded && searchPanelAPI != null"
  >
    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <span class="title">{{ $t('InsecureAuthentication') }}</span>
        <div class="search-area">
          <DatePicker
            :date="chartStartDate"
            v-model="chartStartDate"
            :placeholder="$t('StartDate')"
          ></DatePicker>

          <span>-</span>

          <DatePicker
            :date="chartEndDate"
            v-model="chartEndDate"
            :placeholder="$t('EndDate')"
          ></DatePicker>

          <CButton
            color="primary"
            variant="outline"
            class="period"
            :class="{ active: dateRange == '2 weeks' }"
            @click="(e: Event) => setChartSearchCriterias(e, -2, 'weeks')"
            >2 WEEKS</CButton
          >
          <CButton
            color="primary"
            variant="outline"
            class="period"
            :class="{ active: dateRange == '1 months' }"
            @click="(e: Event) => setChartSearchCriterias(e, -1, 'months')"
            >1 MONTH</CButton
          >
          <CButton
            color="primary"
            variant="outline"
            class="period"
            :class="{ active: dateRange == '3 months' }"
            @click="(e: Event) => setChartSearchCriterias(e, -3, 'months')"
            >3 MONTHS</CButton
          >
          <CButton
            color="primary"
            variant="outline"
            class="period"
            :class="{ active: dateRange == '6 months' }"
            @click="(e: Event) => setChartSearchCriterias(e, -6, 'months')"
            >6 MONTHS</CButton
          >
          <CButton color="primary" class="btn-sm" @click="searchChartOnClick">
            <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
          </CButton>
        </div>
      </CCol>
    </CRow>
    <CRow class="double-contents-body">
      <CCol>
        <BarChart
          :options="chartOptions"
          :seriesItems="insecureAuthenticationStatus!.seriesItems"
          :chartData="insecureAuthenticationStatus!.data"
        ></BarChart>
      </CCol>
    </CRow>
    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <span class="title">{{ $t('SearchResult') }}</span>

        <div class="search-area">
          <span>{{ $t('PageSize') }}</span>

          <select class="page-size-select" @change="pageSizeOnChange">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
          </select>

          <CButton
            color="primary"
            variant="outline"
            @click="downloadCurrentItems"
            v-if="canDownload"
            >{{ $t('SaveResult') }}</CButton
          >
          <CButton
            color="primary"
            variant="outline"
            @click="downloadGridAllItems"
            v-if="canDownload"
            >{{ $t('SaveFile') }}</CButton
          >
          <CButton color="primary" variant="outline" class="btn-sm">
            <CommonIcon
              icon="refresh"
              :width="25"
              :height="25"
              @click="refreshGridOnClick"
            ></CommonIcon>
          </CButton>
          <CButton
            class="filter-flex"
            color="primary"
            variant="outline"
            @click="searchPanelAPI!.open"
            >{{ $t('Filter') }}
            <CommonIcon
              icon="filter"
              :width="32"
              :height="32"
              style="pointer-events: none"
            ></CommonIcon>
          </CButton>
        </div>
      </CCol>
    </CRow>
    <CRow class="double-contents-body">
      <CCol>
        <DataGrid
          :config="gridOptions"
          :search-criterias="searchCriterias.grid"
          :context="context"
          :items-per-page="itemsPerPage"
          grid-data="/analyze/getAnalyzeItems"
          export-data="/analyze/downloadAnalyzeItems"
          @grid-ready="gridOnReady"
        >
        </DataGrid>
      </CCol>
    </CRow>
  </div>

  <XAIDetail
    v-if="detailView"
    :selectedSrcIP="selectedSrcIP"
    @pageOnClose="detailPageOnClose"
  ></XAIDetail>

  <SearchPanel
    @init="searchPanelOnInit"
    @save-on-click="saveButtonOnClick"
    :options="searchPanelOptions"
    :key="searchPanelKey"
  >
    <DatePicker :placeholder="$t('StartDate')" v-model="gridStartDate"></DatePicker>
    <DatePicker :placeholder="$t('EndDate')" v-model="gridEndDate"></DatePicker>

    <AutoComplete
      placeholder="검색어 입력"
      width="250px"
      v-model="condition"
      :dataItems="searchCriteriaStore.getInsecureSearchCriterias"
    ></AutoComplete>

    <CButton class="btn-search-panel btn-sm" color="primary" @click="searchGridOnClick">
      <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
    </CButton>
  </SearchPanel>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import { GridApi, ColumnApi, RowClickedEvent } from '@ag-grid-community/core'
import { useSearchCriteriaStore } from '@/stores/common/SearchCriteriaStore'
import { ATTACK_TYPE } from '@/../constant/constant'
import SearchPanel from '@/components/common/SearchPanel.vue'
import DataGrid from '@/components/grid/DataGrid.vue'
import AutoComplete from '@/components/common/AutoComplete.vue'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import XAIDetail from '@/views/xai/XAIDetail.vue'

import type {
  TSearchPanelOptions,
  TSearchPanelAPI,
  TDataGridCustomApi,
  TDataGridOptions,
  TDefaultDateRange
} from '@/types/types'
import type { TChart, TXYChartOptions } from '@/types/chart-types'
import type { CellClickedEvent } from '@ag-grid-community/core'

@Options({
  components: { SearchPanel, DataGrid, AutoComplete, XAIDetail }
})
export default class InsecureAuthenticationMain extends Base {
  chartDataLoaded: boolean = false
  gridDataLoaded: boolean = false
  searchPanelAPI: TSearchPanelAPI | null = null
  searchPanelOptions: TSearchPanelOptions = { direction: 'horizontal', position: 'top left' }
  searchCriteriaStore = useSearchCriteriaStore()
  searchPanelKey: number = 0
  canDownload: boolean = true

  insecureAuthenticationStatus: TChart | null = null
  threatAnalyzeItems: Array<any> | null = null

  chartStartDate: Date | null = null
  chartEndDate: Date | null = null
  gridStartDate: Date | null = null
  gridEndDate: Date | null = null
  condition: string = ''
  itemsPerPage: number = 50

  dateRange: string = ''
  defaultDateRange: TDefaultDateRange = { startDate: '', endDate: '' }

  gridApi?: GridApi
  customApi?: TDataGridCustomApi

  searchCriterias: any = {
    chart: { type: null, startDate: null, endDate: null },
    grid: { type: null, startDate: null, endDate: null, condition: null }
  }

  chartOptions: TXYChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical'
  }

  gridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: true,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'rowNum', headerName: 'No', sortable: false, width: 85 },
      {
        field: 'start_date',
        headerName: '시간(start_date)',
        cellClass: 'query-data-select',
        headerTooltip: '시간(start_date)'
      },
      {
        field: 'src_ip',
        headerName: '출발지(src_ip)',
        onCellClicked: this.srcIPOnClick,
        cellClass: 'query-data-row query-data-select',
        headerTooltip: '출발지(src_ip)'
      },
      {
        field: 'src_port',
        headerName: '출발지 포트(src_port)',
        cellClass: 'query-data-select',
        headerTooltip: '출발지 포트(src_port)'
      },
      {
        field: 'dest_ip',
        headerName: '목적지(dest_ip)',
        cellClass: 'query-data-select',
        headerTooltip: '목적지(dest_ip)'
      },
      {
        field: 'dest_port',
        headerName: '목적지 포트(dest_port)',
        cellClass: 'query-data-select',
        headerTooltip: '목적지 포트(dest_port)'
      },
      {
        field: 'url',
        headerName: 'URL(url)',
        cellClass: 'query-data-select',
        headerTooltip: 'url'
      },
      {
        field: 'status_code',
        headerName: '상태(status_code)',
        cellClass: 'query-data-select',
        headerTooltip: '상태(status_code)'
      }
    ],
    onRowClick: undefined,
    detailColumns: ['raw_packet_data', 'xai']
  }

  context: any = { parentComponent: null }
  selectedSrcIP: string = ''
  detailView: boolean = false

  async created(): Promise<void> {
    this.context.parentComponent = this
    this.defaultDateRange = this.$momentUtil.getDefaultDateRange()
    this.canDownload = LocalStorageUtil.getMenuItems()[0].canDownload

    this.dateRange = LocalStorageUtil.getDefaultDateRange() as string

    this.searchCriterias.chart.startDate = this.defaultDateRange.startDate
    this.searchCriterias.chart.endDate = this.defaultDateRange.endDate
    this.searchCriterias.chart.type = ATTACK_TYPE.INSECURE_AUTHENTICATION

    this.searchCriterias.grid.startDate = this.defaultDateRange.startDate
    this.searchCriterias.grid.endDate = this.defaultDateRange.endDate
    this.searchCriterias.grid.type = ATTACK_TYPE.INSECURE_AUTHENTICATION

    this.chartStartDate = new Date(this.defaultDateRange.startDate)
    this.chartEndDate = Date.today()
    this.gridStartDate = new Date(this.defaultDateRange.startDate)
    this.gridEndDate = Date.today()

    this.gridOptions.onRowClick = (e: RowClickedEvent) => {}

    await this.setChartData()

    this.chartDataLoaded = true
  }

  async setChartData() {
    const data = await this.$http.postAsync('/analyze/getAnalyzeStatus', this.searchCriterias.chart)

    this.insecureAuthenticationStatus = data
  }

  async setChartSearchCriterias(e: Event, digit: number, unit: string) {
    if ((e.target as HTMLButtonElement).classList.contains('active')) {
      e.preventDefault()
      e.stopPropagation()

      return
    }

    this.dateRange = `${digit * -1} ${unit}`
    this.chartEndDate = Date.today()
    this.chartStartDate = this.$momentUtil
      .add(this.chartEndDate, digit, unit as any)
      .toDate() as Date

    this.searchCriterias.chart.startDate = this.chartStartDate.format()
    this.searchCriterias.chart.endDate = this.chartEndDate.format()

    await this.setChartData()
  }

  async searchChartOnClick() {
    if (!this.$validationUtil.searchCriteriaIsNotNull(this.chartStartDate, this.chartEndDate)) {
      return
    } else if (
      !this.$validationUtil.greaterThanStartDate(
        this.chartStartDate as Date,
        this.chartEndDate as Date
      )
    ) {
      return
    }

    this.dateRange = ''

    this.searchCriterias.chart.startDate = this.chartStartDate!.format()
    this.searchCriterias.chart.endDate = this.chartEndDate!.format()

    await this.setChartData()
  }

  downloadCurrentItems() {
    this.customApi!.exportCSVCurrentPage!()
  }

  async downloadGridAllItems() {
    this.customApi!.exportCSV!()
  }

  pageSizeOnChange(e: Event) {
    const element = e.target as HTMLSelectElement

    this.itemsPerPage = parseInt(element.value)
  }

  searchPanelOnInit(api: TSearchPanelAPI) {
    this.searchPanelAPI = api
  }

  searchGridOnClick() {
    if (!this.$validationUtil.checkIfValidDatePeriod(this.gridStartDate, this.gridEndDate)) {
      return
    }

    if (this.condition && !this.$validationUtil.searchPanelRequiresQueryStatement(this.condition)) {
      return
    }

    this.searchCriterias.grid.startDate = this.gridStartDate!.format()
    this.searchCriterias.grid.endDate = this.gridEndDate!.format()
    this.searchCriterias.grid.condition = this.condition

    this.searchPanelAPI?.close()
    this.customApi!.search!()
  }

  refreshGridOnClick() {
    this.searchCriterias.grid.startDate = this.defaultDateRange.startDate
    this.searchCriterias.grid.endDate = this.defaultDateRange.endDate
    this.searchCriterias.grid.condition = null

    this.customApi!.search!()

    this.gridStartDate = new Date(this.defaultDateRange.startDate)
    this.gridEndDate = Date.today()
    this.condition = ''
    this.searchPanelKey++
  }

  saveButtonOnClick(e: Event) {
    this.searchCriteriaStore.pushInsecureSearchCriterias(this.condition)
  }

  gridOnReady(gridApi: GridApi, columnApi: ColumnApi, customApi: TDataGridCustomApi) {
    this.gridApi = gridApi
    this.customApi = customApi
  }

  async srcIPOnClick(e: CellClickedEvent): Promise<void> {
    const context = e.context.parentComponent
    context.selectedSrcIP = e.data.src_ip
    context.detailView = true

    context.searchPanelAPI?.close()
  }

  detailPageOnClose(): void {
    this.detailView = false
  }
}
</script>
