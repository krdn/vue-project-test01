<template>
  준비중입니다.
  <!-- 1. 서비스 개요 -->
  <ReportSiemDevices />
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
// import ReportSiemDevices from '@/components/report/ReportSiemDevices.vue';

@Options({
  components: {
    // ReportSiemDevices
  }
})
export default class ReportByMonth extends Base {
  year: number | null = null
  reportMonth: number | null = null
  daysInMonth: number | null = null
  startDate: string = ''
  endDate: string = ''

  async created(): Promise<void> {
    const today = Date.today()

    this.year = today.getFullYear()
    this.reportMonth = today.getMonth()

    if (this.reportMonth == 0) {
      this.reportMonth = 12
    }

    this.daysInMonth = new Date(this.year, this.reportMonth, 0).getDate()

    this.startDate = `${this.year}-${this.reportMonth < 10 ? '0' + this.reportMonth : this.reportMonth}-01`
    this.endDate = `${this.year}-${this.reportMonth < 10 ? '0' + this.reportMonth : this.reportMonth}-${this.daysInMonth}`

    // await this.$http.postAsync('/report/getLoginData', { startDate: this.startDate, endDate: this.endDate, isMonthlyReport: true });
    // await this.$http.postAsync('/report/getTypeOfAttackPerMonth')
    // await this.$http.postAsync('/report/getThreatSrcCountryTop10', { startDate: this.startDate, endDate: this.endDate + ' 23:59:59' });
  }
}
</script>
