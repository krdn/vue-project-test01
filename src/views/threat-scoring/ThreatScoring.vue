<template>
  <div class="contents-wrapper" v-if="dataLoaded">
    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <div class="search-area">
          <DatePicker
            :date="startDate"
            v-model="startDate"
            :placeholder="$t('StartDate')"
            :maxDate="endDate"
          ></DatePicker>

          <span>-</span>

          <DatePicker
            :date="endDate"
            v-model="endDate"
            :placeholder="$t('EndDate')"
            :maxDate="endDate"
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
          <CButton color="primary" class="btn-sm" @click="searchDataOnClick">
            <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
          </CButton>
        </div>
      </CCol>
    </CRow>

    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <!-- 위협 패킷 목록 -->
        <span class="title">{{ $t('ThreatPacketList') }}</span>
        <div class="search-area">
          <span>{{ $t('PageSize') }}</span>

          <select class="page-size-select" @change="threatPacketItemsPageSizeOnChange">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
          </select>
          <CButton
            color="primary"
            variant="outline"
            @click="downloadThreatPacketItemsOnClick"
            v-if="canDownload"
            >{{ $t('SaveCSV') }}</CButton
          >
        </div>
      </CCol>
    </CRow>

    <CRow class="double-contents-body threat-scoring">
      <CCol>
        <DataGrid
          :config="threatPacketItemsGridOptions"
          :search-criterias="searchCriterias"
          :context="context"
          :items-per-page="threatPacketItemsPageSize"
          grid-data="/threatScroing/getThreatPacketItems"
          export-data="/threatScroing/downloadThreatPacketItems"
          @grid-ready="threatPacketItemsGridOnReady"
        >
        </DataGrid>
      </CCol>
    </CRow>

    <hr class="margin-20" />

    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <!-- 검색결과 -->
        <span class="title">{{ $t('SearchResult') }}</span>
      </CCol>
    </CRow>

    <CRow class="double-contents-body threat-scoring">
      <CCol>
        <BarChart
          :options="barChartOptions"
          :seriesItems="threatPacketStatus.seriesItems"
          :chartData="threatPacketStatus.data"
        ></BarChart>
      </CCol>
    </CRow>

    <hr class="margin-20" />

    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <span class="title">IP based Risk Scoring</span>
        <div class="search-area">
          <span>{{ $t('PageSize') }}</span>
          <select class="page-size-select" @change="ipBasedScoringItemsPageSizeOnChange">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
          </select>
          <CButton
            color="primary"
            variant="outline"
            @click="downloadIPBasedScoringItemsOnClick"
            v-if="canDownload"
            >{{ $t('SaveCSV') }}</CButton
          >
        </div>
      </CCol>
    </CRow>
    <CRow class="double-contents-body threat-scoring">
      <CCol>
        <DataGrid
          :config="ipBasedScoringItemsGridOptions"
          :search-criterias="searchCriterias"
          :context="context"
          :items-per-page="ipBasedScoringItemsPageSize"
          grid-data="/threatScroing/getIPBasedScoringItems"
          export-data="/threatScroing/downloadIPBasedScoringItems"
          @grid-ready="ipBasedScoringItemsGridOnReady"
        >
        </DataGrid>
      </CCol>
    </CRow>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import DataGrid from '@/components/grid/DataGrid.vue'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import moment from 'moment'

import type { TDataGridOptions, TDataGridCustomApi } from '@/types/types'
import type { TChart, TXYChartOptions } from '@/types/chart-types'
import type { GridApi, ColumnApi, CellClickedEvent } from '@ag-grid-community/core'

@Options({
  components: { DataGrid }
})
export default class ThreatScoring extends Base {
  threatPacketItemsPageSize: number = 50
  ipBasedScoringItemsPageSize: number = 50
  startDate: Date | null = null
  endDate: Date | null = null
  dateRange: string = ''
  canDownload: boolean = true

  searchCriterias = { startDate: null, endDate: null } as any
  threatPacketStatus: TChart = { seriesItems: [], data: { categoryFieldName: '', items: [] } }

  threatLevelClassRules = {
    'threat-danger': (param: any) => param.value == 'H',
    'threat-warning': (param: any) => param.value == 'M'
  }

  threatPacketItemsGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: true,
    notAllowMovableColumns: true,
    columnDefinitions: [
      {
        field: 'src_ip',
        headerName: 'src_ip',
        sortable: true,
        cellClass: 'query-data-row',
        onCellClicked: this.setChartbasedSrcIPOnClick
      },
      { field: 'src_country_name', headerName: '국가', sortable: false },
      { field: 'attack_label', headerName: '분류', sortable: false, tooltipField: 'attack_label' },
      {
        field: 'threat_level',
        headerName: '레벨',
        sortable: false,
        cellClassRules: this.threatLevelClassRules,
        width: 65
      },
      { field: 'start_date', headerName: '시작일', sortable: true },
      { field: 'end_date', headerName: '종료일', sortable: true },
      {
        field: 'inference_datetime',
        headerName: '등록일',
        sortable: true,
        sort: 'desc',
        valueFormatter: (params) => {
          return moment(params.value).format('YYYY-MM-DD')
        }
      }
    ],
    onRowClick: undefined,
    detailColumns: ['threat_scoring_expanded']
  }

  ipBasedScoringItemsGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: true,
    notAllowMovableColumns: true,
    columnDefinitions: [
      {
        field: 'src_ip',
        headerName: 'src_ip',
        sortable: true,
        cellClass: 'query-data-row',
        onCellClicked: this.setChartbasedSrcIPOnClick
      },
      { field: 'threat_score', headerName: '위협 점수', sort: 'desc' },
      { field: 'attack_label', headerName: '분류' },
      { field: 'attack_total_count', headerName: '공격 탐지 카운트' },
      { field: 'inference_datetime', headerName: '이벤트 시간' }
    ],
    onRowClick: undefined
  }

  barChartOptions: TXYChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical',
    multipleSeries: false
  }

  threatPacketItemsGridApi!: GridApi
  threatPacketItemsCustomApi!: TDataGridCustomApi
  ipBasedScoringItemsGridApi!: GridApi
  ipBasedScoringItemsCustomApi!: TDataGridCustomApi

  context: any = { parentComponent: null }
  dataLoaded: boolean = false

  async created() {
    this.context.parentComponent = this

    const defaultDateRange = this.$momentUtil.getDefaultDateRange()
    this.canDownload = LocalStorageUtil.getMenuItems()[0].canDownload

    this.dateRange = LocalStorageUtil.getDefaultDateRange() as string

    this.startDate = new Date(defaultDateRange.startDate)
    this.endDate = Date.today()

    const data = await this.$http.postAsync<TChart>(
      '/threatScroing/getThreatPacketStatus',
      Object.assign(this.searchCriterias, defaultDateRange)
    )

    this.threatPacketStatus = data
    this.dataLoaded = true
  }

  async searchDataOnClick(e: Event) {
    if (this.startDate || this.endDate) {
      if (!this.$validationUtil.searchCriteriaIsNotNull(this.startDate, this.endDate)) {
        return
      }

      if (
        !this.$validationUtil.greaterThanStartDate(this.startDate as Date, this.endDate as Date)
      ) {
        return
      }

      this.dateRange = ''

      this.searchCriterias.startDate = this.startDate?.format()
      this.searchCriterias.endDate = this.endDate?.format()

      await this.threatPacketItemsCustomApi.search()
      await this.ipBasedScoringItemsCustomApi.search()
      const data = await this.$http.postAsync<TChart>(
        '/threatScroing/getThreatPacketStatus',
        this.searchCriterias
      )

      this.threatPacketStatus = data
    }
  }

  async threatPacketItemsPageSizeOnChange(e: Event) {
    const element = e.target as HTMLSelectElement

    this.threatPacketItemsPageSize = parseInt(element.value)
  }

  async ipBasedScoringItemsPageSizeOnChange(e: Event) {
    const element = e.target as HTMLSelectElement

    this.ipBasedScoringItemsPageSize = parseInt(element.value)
  }

  async downloadThreatPacketItemsOnClick(e: Event) {
    await this.threatPacketItemsCustomApi.exportCSV()
  }

  async downloadIPBasedScoringItemsOnClick(e: Event) {
    await this.ipBasedScoringItemsCustomApi.exportCSV()
  }

  async setChartSearchCriterias(e: Event, digit: number, unit: string) {
    if ((e.target as HTMLButtonElement).classList.contains('active')) {
      e.preventDefault()
      e.stopPropagation()

      return
    }

    this.dateRange = `${digit * -1} ${unit}`
    this.endDate = Date.today()
    this.startDate = this.$momentUtil.add(this.endDate, digit, unit as any).toDate()

    this.searchCriterias.startDate = this.startDate!.format()
    this.searchCriterias.endDate = this.endDate!.format()

    await this.threatPacketItemsCustomApi.search()
    await this.ipBasedScoringItemsCustomApi.search()
    const data = await this.$http.postAsync<TChart>(
      '/threatScroing/getThreatPacketStatus',
      this.searchCriterias
    )

    this.threatPacketStatus = data
  }

  async setChartbasedSrcIPOnClick(e: CellClickedEvent): Promise<void> {
    const context = e.context.parentComponent
    const data = await context.$http.postAsync('/threatScroing/getThreatPacketStatus', {
      startDate: context.searchCriterias.startDate,
      endDate: context.searchCriterias.endDate,
      srcIP: e.data.src_ip
    })

    context.threatPacketStatus = data
  }

  threatPacketItemsGridOnReady(
    gridApi: GridApi,
    columnApi: ColumnApi,
    customApi: TDataGridCustomApi
  ) {
    this.threatPacketItemsGridApi = gridApi
    this.threatPacketItemsCustomApi = customApi
  }

  ipBasedScoringItemsGridOnReady(
    gridApi: GridApi,
    columnApi: ColumnApi,
    customApi: TDataGridCustomApi
  ) {
    this.ipBasedScoringItemsGridApi = gridApi
    this.ipBasedScoringItemsCustomApi = customApi
  }
}
</script>
