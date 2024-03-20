<template>
  <div class="contents-wrapper dashboard" :class="{ 'no-display': detailView }" v-if="dataLoaded">
    <CRow class="dashboard-item-row">
      <CCol :xxl="2" :xl="3">
        <ThreatScoreStatus
          :updatedDate="updatedDate"
          :threatScore="threatScore"
          :link="threatScoringLink"
        ></ThreatScoreStatus>
      </CCol>
      <CCol :xxl="10" :xl="9">
        <PacketCollectStatus
          :key="updateCount"
          :chart="packetCollectionStatus"
          :link="packetCollectionLink"
        ></PacketCollectStatus>
      </CCol>
    </CRow>

    <CRow class="dashboard-item-row">
      <!-- <CCol :xxl="2" :xl="3">
        <CrisisWarning :updatedDate="threatStatusUpdateDate" :status="threatStatusIndicator"></CrisisWarning>
      </CCol> -->
      <CCol :xxl="3" :xl="3">
        <ThreatScoringTop5 :threatScoringTop5="threatScoringTop5"></ThreatScoringTop5>
      </CCol>
      <CCol :xxl="5" :xl="5">
        <ScanningTrend
          :key="updateCount"
          :scanningChart="scanningTrend"
          :webHackingChart="webHackingTrend"
        ></ScanningTrend>
      </CCol>
      <!-- <CCol :xxl="3" :xl="3">
        <WebHackingTrend :key="updateCount" :chart="webHackingTrend"></WebHackingTrend>
      </CCol> -->
      <CCol :xxl="4" :xl="4">
        <AttackerAssetAccessTrend
          :diagramData="attackerAssetAccessTrend"
        ></AttackerAssetAccessTrend>
      </CCol>
    </CRow>

    <CRow class="dashboard-item-row">
      <CCol :xxl="4" :xl="4">
        <AttackCountByTypeTop5
          :attackCountByTypeTop5="attackCountByTypeTop5"
        ></AttackCountByTypeTop5>
      </CCol>
      <CCol :xxl="4" :xl="4">
        <ContinuousAttackIPTop5
          :continuousAttackIPTop5="continuousAttackIPTop5"
          @detailPageOnOpen="detailPageOnOpen"
        ></ContinuousAttackIPTop5>
      </CCol>
      <CCol :xxl="4" :xl="4">
        <AssetAccessCountTop5
          :assetAccessCountTop5="assetAccessCountTop5"
          @detailPageOnOpen="detailPageOnOpen"
        ></AssetAccessCountTop5>
      </CCol>
    </CRow>

    <CRow class="dashboard-item-row">
      <CCol :xxl="1" :xl="1" class="device-info-group-title">
        {{ $t('DeviceStatus') }}
        <CommonIcon
          class="hover-pointer inline"
          :width="24"
          :height="24"
          icon="link"
          @click="deviceMonitoringOnClick"
        ></CommonIcon>
      </CCol>

      <CCol :xxl="2" :xl="2">
        <ClickHouseInfo :clickHouseInfo="clickHouseInfo"></ClickHouseInfo>
      </CCol>

      <CCol :xxl="3" :xl="3">
        <WebServerUsage :webServerUsage="webServerUsage"></WebServerUsage>
      </CCol>

      <CCol :xxl="5" :xl="5">
        <AnalyzeDeviceInfo :analyzeDeviceInfo="analyzeDeviceInfo"></AnalyzeDeviceInfo>
      </CCol>
    </CRow>
  </div>

  <XAIDetail
    v-if="detailView"
    :selectedSrcIP="selectedSrcIP"
    @pageOnClose="detailPageOnClose"
  ></XAIDetail>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import ThreatScoreStatus from '@/views/main/ThreatScoreStatus.vue'
import PacketCollectStatus from '@/views/main/PacketCollectStatus.vue'
import ThreatScoringTop5 from '@/views/main/ThreatScoringTop5.vue'
import AttackerAssetAccessTrend from '@/views/main/AttackerAssetAccessTrend.vue'
// import CrisisWarning from '@/views/main/CrisisWarning.vue';
import AttackCountByTypeTop5 from '@/views/main/AttackCountByTypeTop5.vue'
import ContinuousAttackIPTop5 from '@/views/main/ContinuousAttackIPTop5.vue'
import AssetAccessCountTop5 from '@/views/main/AssetAccessCountTop5.vue'
import WebHackingTrend from '@/views/main/WebHackingTrend.vue'
import ScanningTrend from '@/views/main/ScanningTrend.vue'
import ClickHouseInfo from '@/views/main/ClickHouseInfo.vue'
import WebServerUsage from '@/views/main/WebServerUsage.vue'
import AnalyzeDeviceInfo from '@/views/main/AnalyzeDeviceInfo.vue'
import XAIDetail from '@/views/xai/XAIDetail.vue'

import type { TChartData, TSankeyData } from '@/types/chart-types'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

@Options({
  components: {
    ThreatScoreStatus,
    PacketCollectStatus,
    ThreatScoringTop5,
    AttackerAssetAccessTrend,
    // CrisisWarning,
    AttackCountByTypeTop5,
    ContinuousAttackIPTop5,
    AssetAccessCountTop5,
    WebHackingTrend,
    ScanningTrend,
    ClickHouseInfo,
    WebServerUsage,
    AnalyzeDeviceInfo,
    XAIDetail
  },
  watch: {
    async currentLocale() {
      await this.getDashboardData()
    }
  }
})
export default class Dashboard extends Base {
  dataLoaded: boolean = false
  loading: boolean = false
  updateCount: number = 0

  packetCollectionStatus: TChartData = {} as TChartData
  webHackingTrend: TChartData = {} as TChartData
  scanningTrend: TChartData = {} as TChartData
  attackerAssetAccessTrend: Array<TSankeyData> = []
  attackCountByTypeTop5: any = {}
  continuousAttackIPTop5: any = {}
  assetAccessCountTop5: any = {}
  threatScoringTop5: any = {}
  clickHouseInfo: any = {}
  webServerUsage: any = {}
  analyzeDeviceInfo: any = {}
  updatedDate: Date = Date.today()
  threatStatusIndicator: string = ''
  threatStatusUpdateDate: string = ''
  threatScore: number = 0

  threatScoringLink: boolean | null = null
  packetCollectionLink: boolean | null = null

  selectedSrcIP: string = ''
  detailView: boolean = false

  async created(): Promise<void> {
    const menuItems = LocalStorageUtil.getMenuItems()
    this.threatScoringLink = menuItems.find((item) => item.name == 'ThreatScoring').canView
    this.packetCollectionLink = menuItems.find((item) => item.name == 'CollectStatus').canView

    await this.getDashboardData()
  }

  get currentLocale() {
    return this.$i18n.locale
  }

  private async getDashboardData(): Promise<void> {
    const data = await this.$http.postAsync('/dashboard/getAll')

    this.threatScore = data.threatScore
    this.packetCollectionStatus = data.packetCollectionStatus
    this.attackerAssetAccessTrend = data.attackerAssetAccessTrend
    // this.threatStatusIndicator = data.threatStatusIndicator;
    // this.threatStatusUpdateDate = data.threatStatusUpdateDate;
    this.attackCountByTypeTop5 = data.attackCountByTypeTop5
    this.continuousAttackIPTop5 = data.continuousAttackIPTop5
    this.assetAccessCountTop5 = data.assetAccessCountTop5
    this.webHackingTrend = data.webHackingTrend
    this.scanningTrend = data.scanningTrend
    this.clickHouseInfo = data.clickHouseInfo
    this.webServerUsage = data.webServerUsage
    this.analyzeDeviceInfo = data.analyzeDeviceInfo
    this.dataLoaded = true
  }

  deviceMonitoringOnClick(): void {
    this.$router.push({ name: 'DeviceMonitoring' })
  }

  detailPageOnOpen(data: any): void {
    this.selectedSrcIP = data.srcIP
    this.detailView = data.detailView
  }

  detailPageOnClose(): void {
    this.detailView = false
  }
}
</script>
