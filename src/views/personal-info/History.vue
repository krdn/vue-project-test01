<template>
  <div class="contents-wrapper" v-if="loaded">
    <div class="contents-container">
      <CRow class="contents-header">
        <CCol :xxl="12" :xl="12" class="no-padding-top">
          <div class="title">{{ $t('HistoryTitle') }}</div>
          <div>{{ $t('HistoryDescription') }}</div>
        </CCol>
      </CRow>
      <CRow class="contents-body">
        <CCol :xxl="6" :xl="6" class="no-padding">
          <div class="sub-contents-wrapper">
            <CRow class="sub-contents-header">
              <span class="sub-title">{{ $t('LoginHistory') }}</span>

              <div class="search-area">
                <DatePicker
                  v-model="loginHistoryStartDate"
                  :placeholder="$t('StartDate')"
                  :minDate="minDate"
                ></DatePicker>

                <span>-</span>

                <DatePicker
                  v-model="loginHistoryEndDate"
                  :placeholder="$t('EndDate')"
                  :minDate="minDate"
                ></DatePicker>

                <CButton color="primary" class="btn-sm" @click="searchLoginHistoryGridOnClick">
                  <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
                </CButton>
              </div>
            </CRow>

            <CRow class="sub-contents-body">
              <DataGrid
                :config="loginHistoryGridOptions"
                :grid-data="loginHistoryGridItems"
                :key="loginHistoryGridUpdateCount"
              ></DataGrid>
            </CRow>
          </div>
        </CCol>

        <CCol :xxl="6" :xl="6" class="no-padding">
          <div class="sub-contents-wrapper">
            <CRow class="sub-contents-header">
              <span class="sub-title">{{ $t('ActivityLog') }}</span>

              <div class="search-area">
                <DatePicker
                  v-model="activityLogStartDate"
                  :placeholder="$t('StartDate')"
                  :minDate="minDate"
                ></DatePicker>

                <span>-</span>

                <DatePicker
                  v-model="activityLogEndDate"
                  :placeholder="$t('EndDate')"
                  :minDate="minDate"
                ></DatePicker>

                <CButton color="primary" @click="searchActivityLogGridOnClick">
                  <CommonIcon icon="search" :width="25" :height="25"></CommonIcon>
                </CButton>
              </div>
            </CRow>

            <CRow class="sub-contents-body">
              <DataGrid
                :config="activityLogGridOptions"
                :grid-data="activityLogGridItems"
                :key="activityLogGridUpdateCount"
              ></DataGrid>
            </CRow>
          </div>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import DataGrid from '@/components/grid/DataGrid.vue'

import type { TDataGridOptions, TDefaultDateRange } from '@/types/types'

@Options({
  components: { DataGrid }
})
export default class History extends Base {
  defaultDateRange: TDefaultDateRange = { startDate: '', endDate: '' }
  loginHistoryStartDate: Date | null = null
  loginHistoryEndDate: Date | null = null
  activityLogStartDate: Date | null = null
  activityLogEndDate: Date | null = null
  itemsPerPage: number = 50

  minDate: Date | null = null

  searchCriterias: any = {
    loginHistory: { startDate: null, endDate: null },
    activityLog: { startDate: null, endDate: null }
  }

  loginHistoryGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    // if "totalCount" in data is 0, set serverPagination as false
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'logDate', headerName: '일시' },
      { field: 'activityIP', headerName: '로그인IP' },
      { field: 'activityStatus', headerName: '상태', cellRenderer: this.statusCellRenderer },
      { field: 'userAgent', headerName: '기기' }
    ],
    onRowClick: undefined
  }

  activityLogGridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'logDate', headerName: '일시' },
      { field: 'activity', headerName: '활동 내용', tooltipField: 'activity' },
      { field: 'activityStatus', headerName: '상태', cellRenderer: this.statusCellRenderer },
      { field: 'activityIP', headerName: '변경 IP' }
    ],
    onRowClick: undefined
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

    this.searchCriterias.loginHistory.startDate = this.defaultDateRange.startDate
    this.searchCriterias.loginHistory.endDate = this.defaultDateRange.endDate
    this.loginHistoryStartDate = new Date(this.defaultDateRange.startDate)
    this.loginHistoryEndDate = Date.today()

    this.searchCriterias.activityLog.startDate = this.defaultDateRange.startDate
    this.searchCriterias.activityLog.endDate = this.defaultDateRange.endDate
    this.activityLogStartDate = new Date(this.defaultDateRange.startDate)
    this.activityLogEndDate = Date.today()

    this.minDate = Date.today()
    this.minDate.setMonth(this.minDate.getMonth() - 3)
    this.minDate.setDate(this.minDate.getDate() + 1)

    const data = await this.$http.postAsync('/activityLog/getActivityItems', {
      loginStartDate: this.defaultDateRange.startDate,
      loginEndDate: this.defaultDateRange.endDate,
      activityStartDate: this.defaultDateRange.startDate,
      activityEndDate: this.defaultDateRange.endDate,
      isAllData: false
    })

    this.loginHistoryGridItems = data.loginLogItems
    this.activityLogGridItems = data.activityLogItems

    this.loaded = true

    document
      .querySelectorAll('.nav-link.active')
      .forEach((element) => element.classList.remove('active'))
  }

  statusCellRenderer(params: any) {
    if (params.value == true) {
      return '<span class="status-circle success"></span> 성공'
    } else {
      return '<span class="status-circle fail"></span> 실패'
    }
  }

  preventSubmit(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
  }

  async searchLoginHistoryGridOnClick(e: Event): Promise<void> {
    if (
      !this.$validationUtil.checkIfValidDatePeriod(
        this.loginHistoryStartDate,
        this.loginHistoryEndDate
      )
    ) {
      return
    }

    this.searchCriterias.loginHistory.startDate = this.loginHistoryStartDate?.format()
    this.searchCriterias.loginHistory.endDate = this.loginHistoryEndDate?.format()

    const data = await this.$http.postAsync('/activityLog/getLoginLogItems', {
      startDate: this.searchCriterias.loginHistory.startDate,
      endDate: this.searchCriterias.loginHistory.endDate,
      isAllData: false
    })

    this.loginHistoryGridItems = data
    this.loginHistoryGridUpdateCount++
  }

  async searchActivityLogGridOnClick() {
    if (
      !this.$validationUtil.checkIfValidDatePeriod(
        this.activityLogStartDate,
        this.activityLogEndDate
      )
    ) {
      return
    }

    this.searchCriterias.activityLog.startDate = this.activityLogStartDate?.format()
    this.searchCriterias.activityLog.endDate = this.activityLogEndDate?.format()

    const data = await this.$http.postAsync('/activityLog/getActivityLogItems', {
      startDate: this.searchCriterias.activityLog.startDate,
      endDate: this.searchCriterias.activityLog.endDate,
      isAllData: false
    })

    this.activityLogGridItems = data
    this.activityLogGridUpdateCount++
  }
}
</script>
