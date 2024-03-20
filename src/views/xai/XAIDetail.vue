<template>
  <div class="contents-wrapper height-auto" v-if="loaded">
    <div class="ip-detail">
      <div class="detail-close-button-wrapper">
        <CButton color="dark" class="detail-close-button" variant="outline" @click="closeOnClick">{{
          $t('Close')
        }}</CButton>
      </div>

      <CRow class="ip-detail-box">
        <div class="ip-detail-name">{{ srcIP }}</div>
        <div>
          <ul class="ip-detail-items up">
            <li>
              <label for="requestTrafficUsage">요청에 사용된 데이터 크기</label>
              <span id="requestTrafficUsage">{{ requestTrafficUsage }}</span>
            </li>
            <li>
              <label for="">응답에 사용된 데이터 크기 </label>
              <span>{{ responseTrafficUsage }}</span>
            </li>
            <li>
              <label for="">내부 IP 연결 개수 </label>
              <span>{{ connectToInternalIPCount }}</span>
            </li>
            <li>
              <label for="">외부IP 연결 개수</label>
              <span>{{ connectToExternalIPCount }}</span>
            </li>
          </ul>

          <div class="ip-detail-items">
            <label for="">User Agent</label>
            <ul class="ip-detail-item-list">
              <li v-for="userAgent of userAgentItems">
                <div class="user-agent" :title="userAgent">{{ userAgent }}</div>
              </li>
            </ul>
            <label for="">Network Vendor</label>
            <ul class="ip-detail-item-list">
              <li v-for="networkVendor of networkVendorItems">
                <div class="network-vendor" :title="networkVendor">{{ networkVendor }}</div>
              </li>
            </ul>
          </div>
        </div>
      </CRow>

      <CNav class="tab-nav" variant="tabs">
        <CNavItem>
          <CNavLink
            class="tab-link"
            href="javascript: void(0);"
            :active="activeTab == 1"
            @click="() => changeData(1)"
            >Detect</CNavLink
          >
        </CNavItem>
        <CNavItem>
          <CNavLink
            class="tab-link"
            href="javascript: void(0);"
            :active="activeTab == 2"
            @click="() => changeData(2)"
            >Connect</CNavLink
          >
        </CNavItem>
      </CNav>

      <div class="ip-detail-contents">
        <!-- tab01 Detect -->
        <CRow class="tab-content-wrap" v-if="activeTab == 1">
          <CCol :xxl="9" :xl="8" class="item">
            <div class="item-header">탐지(누적) 건수</div>
            <div class="item-contents">
              <LineChart
                :options="lineOptions"
                :seriesItems="detectStatus.seriesItems"
                :chartData="detectStatus.data"
              ></LineChart>
            </div>
          </CCol>

          <CCol :xxl="3" :xl="4" class="item">
            <div class="item-header">탐지된 모델 종류</div>
            <div class="item-contents">
              <RadarChart
                :options="radarChartOptions"
                :seriesItems="attackTypeStatus.seriesItems"
                :chartData="attackTypeStatus.data"
              ></RadarChart>
            </div>
          </CCol>
        </CRow>

        <CRow class="tab-content-wrap" v-if="activeTab == 1">
          <CCol :xxl="3" :xl="3" class="item">
            <div class="item-header">위협탐지 IP(In-Bound)</div>
            <div class="item-contents">
              <DataGrid
                :config="detectGridOptions"
                :context="context"
                :grid-data="inBoundItems"
                @grid-ready="inboundGridOnReady"
              />
            </div>
            <div class="item-header" v-if="activeTab == 1 && isInternalIP">
              외부유출 IP(Out-Bound)
            </div>
            <div class="item-contents" v-if="activeTab == 1 && isInternalIP">
              <DataGrid
                :config="detectGridOptions"
                :context="context"
                :grid-data="outBoundItems"
                @grid-ready="outboundGridOnReady"
              />
            </div>
          </CCol>

          <CCol :xxl="9" :xl="9" class="item">
            <div class="item-header">{{ selectedDestIP }} TimeLine</div>
            <div class="item-contents">
              <LineChart
                :options="lineOptions"
                :seriesItems="timelineStatus.seriesItems"
                :chartData="timelineStatus.data"
              ></LineChart>
            </div>
          </CCol>
        </CRow>

        <!-- tab02 Connect -->
        <CRow class="tab-content-wrap" v-if="activeTab == 2">
          <CCol :xxl="12" :xl="12" class="item">
            <div class="item-header">트래픽 추이</div>
            <div class="item-contents">
              <LineChart
                :options="lineOptions"
                :seriesItems="threatIPAccessStatus.seriesItems"
                :chartData="threatIPAccessStatus.data"
              ></LineChart>
            </div>
          </CCol>
        </CRow>

        <CRow class="tab-content-wrap" v-if="activeTab == 2">
          <CCol :xxl="3" :xl="3" class="item">
            <div class="item-header"><span>위협탐지 서비스 포트</span></div>
            <div class="item-contents">
              <DataGrid
                :config="byPortGridOptions"
                :grid-data="connectItemsByPort"
                @grid-ready="byPortGridOnReady"
              ></DataGrid>
            </div>
            <div class="item-header"><span>상태 코드별 카운트</span></div>
            <div class="item-contents">
              <DataGrid
                :config="byStatusCodeGridOptions"
                :grid-data="connectItemsByStatusCode"
                @grid-ready="byStatusGridOnReady"
              ></DataGrid>
            </div>
          </CCol>

          <CCol :xxl="9" :xl="9" class="item">
            <div class="item-header">내부자산 사용 트렌드 Top 10</div>
            <div class="item-contents">
              <TraceableSankeyDiagram
                :options="diagramOptions"
                :diagramData="diagramData"
              ></TraceableSankeyDiagram>
            </div>
          </CCol>
        </CRow>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Options } from '@/base-component/Base'
import DataGrid from '@/components/grid/DataGrid.vue'

import type {
  TChart,
  TSankeyData,
  TSankeyOptions,
  TXYChartOptions,
  TRadarChartOptions
} from '@/types/chart-types'
import type { TDataGridOptions, TDefaultDateRange } from '@/types/types'
import type { CellClickedEvent, GridApi } from '@ag-grid-community/core'

@Options({
  components: { DataGrid },
  props: { selectedSrcIP: { type: String, default: '', required: true } },
  emits: ['page-on-close']
})
export default class XAIDetail extends Base {
  defaultDateRange: TDefaultDateRange = { startDate: '', endDate: '' }
  context: any = { parentComponent: null }
  selectedSrcIP!: string

  srcIP: string = ''
  requestTrafficUsage: string = ''
  responseTrafficUsage: string = ''
  connectToInternalIPCount: number = 0
  connectToExternalIPCount: number = 0
  userAgentItems: Array<any> = []
  networkVendorItems: Array<any> = []
  isInternalIP: boolean = false

  activeTab: number = 1

  lineOptions: TXYChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical',
    multipleSeries: false
  }

  detectStatus: TChart = {} as TChart

  radarChartOptions: TRadarChartOptions = {
    legendXPosition: 811,
    legendYPosition: 0,
    legendLayout: 'vertical',
    textType: 'adjusted',
    paddingBottomForLabel: 20
  }

  attackTypeStatus: TChart = {} as TChart
  threatIPAccessStatus: TChart = {} as TChart

  selectedDestIP: string = ''
  inBoundItems: Array<any> = []
  outBoundItems: Array<any> = []
  inBoundGridApi: GridApi | null = null
  outBoundGridApi: GridApi | null = null
  detectGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: false,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      {
        field: 'destIP',
        headerName: 'IP',
        cellStyle: { cursor: 'pointer' },
        onCellClicked: this.destIPOnClick
      },
      { field: 'detectCount', headerName: 'Count' }
    ]
  }

  connectItemsByPort: Array<any> = []
  connectItemsByStatusCode: Array<any> = []
  byPortGridApi: GridApi | null = null
  byPortGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: false,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'servicePort', headerName: 'Port' },
      { field: 'connectCount', headerName: 'Count' }
    ]
  }

  byStatusGridApi: GridApi | null = null
  byStatusCodeGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: false,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'statusCode', headerName: 'Code' },
      { field: 'responseCount', headerName: 'Count' }
    ]
  }

  diagramData!: Array<TSankeyData>
  diagramOptions: TSankeyOptions = {
    orientation: 'horizontal',
    nodeWidth: 5,
    tooltipValueFieldName: 'tryCount'
  }

  loaded: boolean = false
  timelineLoaded: boolean = false
  timelineStatus: TChart = {} as TChart

  async created() {
    this.context.parentComponent = this
    this.defaultDateRange = this.$momentUtil.getDefaultDateRange()

    const result = await this.$http.postAsync('/xai/getThreatIPDetail', {
      srcIP: this.selectedSrcIP,
      ...this.defaultDateRange
    })

    this.srcIP = result.detailData.srcIP
    this.requestTrafficUsage = result.detailData.requestTrafficUsage
    this.responseTrafficUsage = result.detailData.responseTrafficUsage
    this.connectToInternalIPCount = result.detailData.connectToInternalIPCount
    this.connectToExternalIPCount = result.detailData.connectToExternalIPCount
    this.userAgentItems = result.detailData.userAgentItems
    this.networkVendorItems = result.detailData.networkVendorItems
    this.isInternalIP = result.detailData.isInternalIP

    this.detectStatus = result.detectStatus
    this.attackTypeStatus = result.attackTypeStatus
    this.threatIPAccessStatus = result.threatIPAccessStatus

    this.inBoundItems = result.inBoundItems
    this.outBoundItems = result.outBoundItems

    this.connectItemsByPort = result.connectItemsByPort
    this.connectItemsByStatusCode = result.connectItemsByStatusCode

    this.diagramData = result.threatIPAccessTrend
    this.timelineStatus = result.threatIPTimeline

    this.loaded = true
  }

  closeOnClick(e: Event): void {
    this.$emit('page-on-close')
  }

  changeData(activeTab: number): void {
    if (this.activeTab != activeTab) {
      this.activeTab = activeTab
    }
  }

  inboundGridOnReady(gridApi: GridApi): void {
    this.inBoundGridApi = gridApi
  }

  outboundGridOnReady(gridApi: GridApi): void {
    this.outBoundGridApi = gridApi
  }

  byPortGridOnReady(gridApi: GridApi): void {
    this.byPortGridApi = gridApi
  }

  byStatusGridOnReady(gridApi: GridApi): void {
    this.byStatusGridApi = gridApi
  }

  async destIPOnClick(e: CellClickedEvent) {
    const context = e.context.parentComponent
    const data = await context.$http.postAsync('/xai/getThreatIPTimeline', {
      srcIP: context.srcIP,
      destIP: e.data.destIP,
      startDate: context.defaultDateRange.startDate,
      endDate: context.defaultDateRange.endDate
    })

    context.timelineStatus = data
    context.selectedDestIP = e.data.destIP
  }
}
</script>
