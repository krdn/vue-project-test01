<template>
  준비중입니다.
  <!-- <div class="contents-wrapper dashboard">
    <div style="display: flex; gap: 10px; justify-content: end; margin-bottom: 10px; padding-top: 20px;">
      <DatePicker v-model="startDate" :placeholder="$t('StartDate')"></DatePicker>
      <TimePicker v-model="startTime"></TimePicker>

      <span>-</span>

      <DatePicker v-model="endDate" :placeholder="$t('EndDate')"></DatePicker>
      <TimePicker v-model="endTime"></TimePicker>

      <CButton color="primary" @click="search">
        <CommonIcon icon="search" :width="19" :height="19"></CommonIcon>
      </CButton>

      <CButton color="primary" @click="download">
        PDF 다운로드
      </CButton>
    </div>
  </div> -->
</template>

<script lang="ts">
import { Base, Options } from '@/base-component/Base'

@Options({
  components: {}
})
export default class ReportByPeriod extends Base {
  startDate: Date | null = null
  startTime: string = '00:00:00 AM'
  endDate: Date | null = null
  endTime: string = '00:00:00 AM'
  startDateTime: string = ''
  endDateTime: string = ''

  async search() {
    if (!this.$validationUtil.checkIfValidDatePeriod(this.startDate, this.endDate)) {
      return
    }

    this.startDateTime = this.startDate!.format() + this.get24hourFormat(this.startTime)
    this.endDateTime = this.endDate!.format() + this.get24hourFormat(this.endTime)

    if (
      !this.$validationUtil.checkIfValidDatePeriod(
        new Date(this.startDateTime),
        new Date(this.endDateTime)
      )
    ) {
      return
    }

    await this.$http.postAsync('/report/getLoginData', {
      startDate: this.startDateTime,
      endDate: this.endDateTime,
      isMonthlyReport: false
    })
    await this.$http.postAsync('/report/getTypeOfAttackByPeriod', {
      startDate: this.startDateTime,
      endDate: this.endDateTime
    })
    await this.$http.postAsync('/report/getThreatSrcCountryTop10', {
      startDate: this.startDateTime,
      endDate: this.endDateTime
    })
  }

  download() {}

  private get24hourFormat(time: string) {
    const timeParts = time.split(':')
    let hour = parseInt(timeParts[0])
    const minute = timeParts[1]
    const second = timeParts[2].slice(0, 2)
    const isPM = time.includes('PM')

    const formatedHour = isPM ? (hour == 12 ? hour : hour + 12) : hour == 12 ? 0 : hour

    return ` ${formatedHour < 10 ? '0' + formatedHour : formatedHour}:${minute}:${second}`
  }
}
</script>
