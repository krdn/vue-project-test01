<template>
  <div class="contents-wrapper" v-if="dataLoaded && searchPanelAPI != null">
    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <span class="title">{{ $t('SMTPLogCollectStatusMain') }}</span>
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
        <LineChart
          :options="lineOptions"
          :seriesItems="smtpLogCollectStatus.seriesItems"
          :chartData="smtpLogCollectStatus.data"
        ></LineChart>
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
          :items-per-page="itemsPerPage"
          grid-data="/smtpLog/getSMTPLogCollectItems"
          export-data="/smtpLog/downloadSMTPLogCollectItems"
          @grid-ready="gridOnReady"
        >
        </DataGrid>
      </CCol>
    </CRow>
  </div>

  <SearchPanel
    @init="searchPanelOnInit"
    @save-on-click="saveButtonOnClick"
    :options="options"
    :key="searchPanelKey"
  >
    <DatePicker :placeholder="$t('StartDate')" v-model="gridStartDate"></DatePicker>
    <DatePicker :placeholder="$t('EndDate')" v-model="gridEndDate"></DatePicker>

    <AutoComplete
      placeholder="검색어 입력"
      width="250px"
      v-model="condition"
      :dataItems="searchCriteriaStore.getSmtpLogSearchCriterias"
    ></AutoComplete>
    <CButton class="btn-search-panel btn-sm" color="primary" @click="searchGridOnClick">
      <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
    </CButton>
  </SearchPanel>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import { GridApi, ColumnApi } from '@ag-grid-community/core'
import { useSearchCriteriaStore } from '@/stores/common/SearchCriteriaStore'
import SearchPanel from '@/components/common/SearchPanel.vue'
import DataGrid from '@/components/grid/DataGrid.vue'
import AutoComplete from '@/components/common/AutoComplete.vue'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

import type {
  TSearchPanelAPI,
  TSearchPanelOptions,
  TDataGridCustomApi,
  TDataGridOptions,
  TDefaultDateRange
} from '@/types/types'
import type { TXYChartOptions, TChart } from '@/types/chart-types'

@Options({
  components: { SearchPanel, DataGrid, AutoComplete }
})
export default class SMTPLogCollectStatusMain extends Base {
  dataLoaded: boolean = false
  lineOptions: TXYChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical',
    multipleSeries: false
  }

  searchPhrase: string = ''

  chartStartDate: Date | null = null
  chartEndDate: Date | null = null
  gridStartDate: Date | null = null
  gridEndDate: Date | null = null
  gridSearchCondition: string = ''
  searchPanelAPI: TSearchPanelAPI | null = null
  searchPanelKey: number = 0
  options: TSearchPanelOptions = { direction: 'horizontal', position: 'top left' }
  smtpLogCollectStatus: TChart = {} as TChart
  smtpLogCollectItems: any = {}
  itemsPerPage: number = 50
  gridApi: GridApi | null = null
  condition: string = ''
  searchCriteriaStore = useSearchCriteriaStore()
  canDownload: boolean = true

  dateRange: string = ''
  defaultDateRange: TDefaultDateRange = { startDate: '', endDate: '' }

  gridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: true,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'rowNum', headerName: 'No', width: 90 },
      {
        field: 'timestamp',
        headerName: '시간(timestamp)',
        cellClass: 'query-data-select',
        tooltipField: 'timestamp'
      },
      {
        field: 'src_address',
        headerName: '출발지(src_address)',
        cellClass: 'query-data-select',
        headerTooltip: '출발지(src_address)'
      },
      {
        field: 'src_port',
        headerName: '출발지 포트(src_port)',
        cellClass: 'query-data-select',
        headerTooltip: '출발지 포트(src_port)'
      },
      {
        field: 'dest_address',
        headerName: '목적지(dest_address)',
        cellClass: 'query-data-select',
        headerTooltip: '목적지(dest_address)'
      },
      {
        field: 'dest_port',
        headerName: '목적지 포트(dest_port)',
        cellClass: 'query-data-select',
        headerTooltip: '목적지 포트(dest_port)'
      },
      {
        field: 'helo',
        headerName: 'User Agent(helo)',
        cellClass: 'query-data-select',
        tooltipField: 'helo',
        headerTooltip: 'User Agent(helo)'
      },
      {
        field: 'mail_from',
        headerName: 'From(mail_from)',
        cellClass: 'query-data-select',
        tooltipField: 'mail_from'
      },
      {
        field: 'rcpt_to',
        headerName: 'To(rcpt_to)',
        cellClass: 'query-data-select',
        tooltipField: 'rcpt_to'
      },
      {
        field: 'response_code',
        headerName: '상태(response_code)',
        cellClass: 'query-data-select',
        tooltipField: 'response_code',
        headerTooltip: '상태(response_code)'
      }
    ]
  }

  searchCriterias: any = {
    chart: { startDate: null, endDate: null },
    grid: {
      type: '',
      startDate: null,
      endDate: null,
      condition: '',
      pageSize: 10,
      pageNumber: 1,
      orderbyParts: {
        orderby: 'timestamp',
        direction: 'ASC'
      }
    }
  }

  customApi?: TDataGridCustomApi

  async created(): Promise<void> {
    this.defaultDateRange = this.$momentUtil.getDefaultDateRange()
    this.canDownload = LocalStorageUtil.getMenuItems()[0].canDownload

    this.dateRange = LocalStorageUtil.getDefaultDateRange() as string

    this.searchCriterias.chart.startDate = this.defaultDateRange.startDate
    this.searchCriterias.chart.endDate = this.defaultDateRange.endDate

    this.searchCriterias.grid.startDate = this.defaultDateRange.startDate
    this.searchCriterias.grid.endDate = this.defaultDateRange.endDate

    this.chartStartDate = new Date(this.defaultDateRange.startDate)
    this.chartEndDate = Date.today()
    this.gridStartDate = new Date(this.defaultDateRange.startDate)
    this.gridEndDate = Date.today()

    await this.getSMTPLogCollectStatusData()

    this.dataLoaded = true
  }

  private async getSMTPLogCollectStatusData(): Promise<void> {
    const data = await this.$http.postAsync(
      '/smtpLog/getSMTPLogCollectStatus',
      this.searchCriterias.chart
    )

    this.smtpLogCollectStatus = data
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

    await this.getSMTPLogCollectStatusData()
  }

  async setChartSearchCriterias(e: Event, digit: number, unit: string) {
    if ((e.target as HTMLButtonElement).classList.contains('active')) {
      e.preventDefault()
      e.stopPropagation()

      return
    }

    this.dateRange = `${digit * -1} ${unit}`
    this.chartEndDate = Date.today()
    this.chartStartDate = this.$momentUtil.add(this.chartEndDate, digit, unit as any).toDate()

    this.searchCriterias.chart.startDate = this.chartStartDate!.format()
    this.searchCriterias.chart.endDate = this.chartEndDate!.format()

    await this.getSMTPLogCollectStatusData()
  }

  searchPanelOnInit(api: TSearchPanelAPI): void {
    this.searchPanelAPI = api
  }

  saveButtonOnClick(e: Event): void {
    this.searchCriteriaStore.pushSmtpLogSearchCriterias(this.condition)
  }

  pageSizeOnChange(e: Event): void {
    const element = e.target as HTMLSelectElement

    this.itemsPerPage = parseInt(element.value)
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

  downloadCurrentItems() {
    this.customApi!.exportCSVCurrentPage!()
  }

  async downloadGridAllItems() {
    this.customApi!.exportCSV!()
  }

  gridOnReady(gridApi: GridApi, columnApi: ColumnApi, customApi: TDataGridCustomApi) {
    this.gridApi = gridApi
    this.customApi = customApi
  }
}
</script>
