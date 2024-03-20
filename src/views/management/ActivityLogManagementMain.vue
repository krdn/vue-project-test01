<template>
  <div class="contents-wrapper" v-if="loaded">
    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <div class="header-wrapper">
          <span class="title">{{ $t('ActivityLogManagementMain') }}</span>
          <br />
          <span class="sub-title">{{ $t('LoginHistory') }}</span>
          <span class="sub-color-title">{{ $t('LimitSearchPeriod') }}</span>
        </div>

        <div class="search-area">
          <CButton color="primary" variant="outline" class="btn-sm">
            <CommonIcon
              icon="refresh"
              :width="25"
              :height="25"
              @click="refreshLoginGridData"
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
          :config="loginGridOptions"
          :grid-data="loginHistoryGridItems"
          :key="loginHistoryGridUpdateCount"
        ></DataGrid>
      </CCol>
    </CRow>

    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <div class="header-wrapper">
          <span class="sub-title">{{ $t('ActivityLog') }}</span>
          <span class="sub-color-title">{{ $t('LimitSearchPeriod') }}</span>
        </div>

        <div class="search-area">
          <CButton color="primary" variant="outline" class="btn-sm">
            <CommonIcon
              icon="refresh"
              :width="25"
              :height="25"
              @click="refreshAcitivyGridData"
            ></CommonIcon>
          </CButton>
          <CButton
            class="filter-flex"
            color="primary"
            variant="outline"
            @click="activitySearchPanelAPI!.open"
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
          :config="activityLogGridOptions"
          :grid-data="activityLogGridItems"
          :key="activityLogGridUpdateCount"
        ></DataGrid>
      </CCol>
    </CRow>
  </div>

  <SearchPanel
    @init="searchPanelOnInit"
    :options="searchPanelOptions"
    :showButton="false"
    :key="loginKey"
  >
    <DatePicker
      :placeholder="$t('StartDate')"
      v-model="loginLogStartDate"
      :minDate="minDate"
    ></DatePicker>
    <DatePicker
      :placeholder="$t('EndDate')"
      v-model="loginLogEndDate"
      :minDate="minDate"
    ></DatePicker>

    <CFormInput placeholder="ID" v-model="loginLogUserId"></CFormInput>
    <CFormInput :placeholder="$t('UserName')" v-model="loginLogUserName"></CFormInput>

    <CFormSelect v-model="loginLogStatus">
      <option disabled selected>{{ $t('State') }}</option>
      <option value="true">{{ $t('Success') }}</option>
      <option value="false">{{ $t('Fail') }}</option>
    </CFormSelect>

    <CFormInput type="search" placeholder="IP" v-model="loginLogIP"></CFormInput>

    <CButton class="btn-search-panel btn-sm" color="primary" @click="searchGridOnClick">
      <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
    </CButton>
  </SearchPanel>

  <SearchPanel
    @init="activitySearchPanelOnInit"
    :options="searchPanelOptions"
    :showButton="false"
    :key="activityKey"
  >
    <DatePicker
      :placeholder="$t('StartDate')"
      v-model="activityStartDate"
      :minDate="minDate"
    ></DatePicker>
    <DatePicker
      :placeholder="$t('EndDate')"
      v-model="activityEndDate"
      :minDate="minDate"
    ></DatePicker>

    <CFormInput placeholder="ID" v-model="activityUserId"></CFormInput>
    <CFormInput :placeholder="$t('UserName')" v-model="activityUserName"></CFormInput>

    <CFormSelect v-model="activityStatus">
      <option disabled selected>{{ $t('State') }}</option>
      <option value="true">{{ $t('Success') }}</option>
      <option value="false">{{ $t('Fail') }}</option>
    </CFormSelect>

    <CFormInput type="search" placeholder="IP" v-model="activityIP"></CFormInput>

    <CButton class="btn-search-panel btn-sm" color="primary" @click="searchActivityGridOnClick">
      <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
    </CButton>
  </SearchPanel>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import {
  TDataGridOptions,
  TDefaultDateRange,
  TSearchPanelAPI,
  TSearchPanelOptions
} from '@/types/types'

import DataGrid from '@/components/grid/DataGrid.vue'
import SearchPanel from '@/components/common/SearchPanel.vue'

@Options({
  components: { DataGrid, SearchPanel }
})
export default class ActivityLogManagementMain extends Base {
  searchPanelAPI: TSearchPanelAPI | null = null
  activitySearchPanelAPI: TSearchPanelAPI | null = null
  searchPanelOptions: TSearchPanelOptions = { direction: 'horizontal', position: 'top left' }

  defaultDateRange: TDefaultDateRange = { startDate: '', endDate: '' }
  loginLogStartDate: Date | null = null
  loginLogEndDate: Date | null = null
  loginLogUserId: string = ''
  loginLogUserName: string = ''
  loginLogStatus: string | null = null
  loginLogIP: string = ''
  loginKey: number = 0

  activityStartDate: Date | null = null
  activityEndDate: Date | null = null
  activityUserId: string = ''
  activityUserName: string = ''
  activityStatus: string | null = null
  activityIP: string = ''
  activityKey: number = 0

  minDate: Date | null = null

  loginSearchCriterias: any = {
    startDate: null,
    endDate: null,
    isAllData: true,
    userId: null,
    userName: null,
    activityStatus: null,
    activityIP: null
  }
  activityLogSearchCriterias: any = {
    startDate: null,
    endDate: null,
    isAllData: true,
    userId: null,
    userName: null,
    activityStatus: null,
    activityIP: null
  }

  loginGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'logDate', headerName: '일시' },
      { field: 'userId', headerName: 'ID' },
      { field: 'userName', headerName: '사용자명' },
      { field: 'activityIP', headerName: '로그인IP', width: 500 },
      { field: 'activityStatus', headerName: '상태', cellRenderer: this.statusCellRenderer },
      { field: 'userAgent', headerName: '기기' }
    ]
  }

  activityLogGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'logDate', headerName: '일시' },
      { field: 'userId', headerName: 'ID' },
      { field: 'userName', headerName: '사용자명' },
      { field: 'activity', headerName: '활동 내용', width: 500 },
      { field: 'activityStatus', headerName: '상태', cellRenderer: this.statusCellRenderer },
      { field: 'activityIP', headerName: 'IP' }
    ]
  }

  loginHistoryGridItems = [] as Array<any>
  activityLogGridItems = [] as Array<any>

  loginHistoryGridUpdateCount: number = 0
  activityLogGridUpdateCount: number = 0

  loaded: boolean = false

  async created(): Promise<void> {
    this.defaultDateRange.endDate = this.$momentUtil.getFormattedDate(Date.today())
    this.defaultDateRange.startDate = this.$momentUtil
      .add(Date.today(), -3, 'months')
      .add(1, 'days')
      .format('YYYY-MM-DD')

    this.loginSearchCriterias.startDate = this.defaultDateRange.startDate
    this.loginSearchCriterias.endDate = this.defaultDateRange.endDate
    this.activityLogSearchCriterias.startDate = this.defaultDateRange.startDate
    this.activityLogSearchCriterias.endDate = this.defaultDateRange.endDate
    this.loginLogStartDate = new Date(this.defaultDateRange.startDate)
    this.loginLogEndDate = Date.today()
    this.activityStartDate = new Date(this.defaultDateRange.startDate)
    this.activityEndDate = Date.today()

    this.minDate = Date.today()
    this.minDate.setMonth(this.minDate.getMonth() - 3)
    this.minDate.setDate(this.minDate.getDate() + 1)

    const data = await this.$http.postAsync('/activityLog/getActivityItems', {
      loginStartDate: this.defaultDateRange.startDate,
      loginEndDate: this.defaultDateRange.endDate,
      activityStartDate: this.defaultDateRange.startDate,
      activityEndDate: this.defaultDateRange.endDate,
      isAllData: true
    })

    this.loginHistoryGridItems = data.loginLogItems
    this.activityLogGridItems = data.activityLogItems

    this.loaded = true
  }

  statusCellRenderer(params: any) {
    if (params.value == true) {
      return '<span class="status-circle success"></span> 성공'
    } else {
      return '<span class="status-circle fail"></span> 실패'
    }
  }

  async refreshLoginGridData() {
    this.loginSearchCriterias.startDate = this.defaultDateRange.startDate
    this.loginSearchCriterias.endDate = this.defaultDateRange.endDate
    this.loginSearchCriterias.userId = null
    this.loginSearchCriterias.userName = null
    this.loginSearchCriterias.activityStatus = null
    this.loginSearchCriterias.activityIP = null

    await this.setLoginHistoryData()

    this.loginLogStartDate = new Date(this.defaultDateRange.startDate)
    this.loginLogEndDate = Date.today()
    this.loginLogUserId = ''
    this.loginLogUserName = ''
    this.loginLogStatus = ''
    this.loginLogIP = ''
    this.loginKey++
  }

  async refreshAcitivyGridData() {
    this.activityLogSearchCriterias.startDate = this.defaultDateRange.startDate
    this.activityLogSearchCriterias.endDate = this.defaultDateRange.endDate
    this.activityLogSearchCriterias.userId = null
    this.activityLogSearchCriterias.userName = null
    this.activityLogSearchCriterias.activityStatus = null
    this.activityLogSearchCriterias.activityIP = null

    await this.setActivityLogGridOnClick()

    this.activityStartDate = new Date(this.defaultDateRange.startDate)
    this.activityEndDate = Date.today()
    this.activityUserId = ''
    this.activityUserName = ''
    this.activityStatus = ''
    this.activityIP = ''
    this.activityKey++
  }

  searchPanelOnInit(api: TSearchPanelAPI) {
    this.searchPanelAPI = api
  }

  activitySearchPanelOnInit(api: TSearchPanelAPI) {
    this.activitySearchPanelAPI = api
  }

  async searchGridOnClick() {
    if (
      !this.$validationUtil.checkIfValidDatePeriod(this.loginLogStartDate, this.loginLogEndDate)
    ) {
      return
    }

    this.loginSearchCriterias.startDate = this.loginLogStartDate!.format()
    this.loginSearchCriterias.endDate = this.loginLogEndDate!.format()
    this.loginSearchCriterias.userId = this.loginLogUserId
    this.loginSearchCriterias.userName = this.loginLogUserName
    this.loginSearchCriterias.activityStatus = this.loginLogStatus
    this.loginSearchCriterias.activityIP = this.loginLogIP

    await this.setLoginHistoryData()

    this.searchPanelAPI?.close()
  }

  async searchActivityGridOnClick() {
    if (
      !this.$validationUtil.checkIfValidDatePeriod(this.activityStartDate, this.activityEndDate)
    ) {
      return
    }

    this.activityLogSearchCriterias.startDate = this.activityStartDate!.format()
    this.activityLogSearchCriterias.endDate = this.activityEndDate!.format()
    this.activityLogSearchCriterias.userId = this.activityUserId
    this.activityLogSearchCriterias.userName = this.activityUserName
    this.activityLogSearchCriterias.activityStatus = this.activityStatus
    this.activityLogSearchCriterias.activityIP = this.activityIP

    await this.setActivityLogGridOnClick()

    this.activitySearchPanelAPI?.close()
  }

  private async setLoginHistoryData(): Promise<void> {
    const data = await this.$http.postAsync(
      '/activityLog/getLoginLogItems',
      this.loginSearchCriterias
    )

    this.loginHistoryGridItems = data
    this.loginHistoryGridUpdateCount++
  }

  private async setActivityLogGridOnClick(): Promise<void> {
    const data = await this.$http.postAsync(
      '/activityLog/getActivityLogItems',
      this.activityLogSearchCriterias
    )

    this.activityLogGridItems = data
    this.activityLogGridUpdateCount++
  }
}
</script>
