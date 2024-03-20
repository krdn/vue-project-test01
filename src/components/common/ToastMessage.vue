<template>
  <CToaster placement="bottom-end">
    <CToast :autohide="false" :visible="isVisibleToastMessage" @close="toastOnClose" :key="key">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold" v-html="$t('NewAlarm')"></span>
        <small v-html="timeAgoMessage"></small>
      </CToastHeader>
      <CToastBody
        v-html="$t('NewAlarmToastMessage', { count: store.getUneadAlarmList.length })"
      ></CToastBody>
    </CToast>
  </CToaster>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { useAlarmStore } from '@/stores/common/AlarmStore'

export default class ToastMessage extends Vue {
  store = useAlarmStore()
  timeAgoMessage: string = 'Now'
  key: number = 0

  get isVisibleToastMessage(): boolean {
    if (this.store.getIsVisibleToastMessage) {
      this.interval = setInterval(() => {
        if (this.minutes == 1) {
          this.timeAgoMessage = `${this.minutes++} minute ago`
        } else {
          this.timeAgoMessage = `${this.minutes++} minutes ago`
        }
      }, 60000)
    }

    this.key++

    return this.store.getIsVisibleToastMessage
  }

  private interval: number = 0
  private minutes: number = 1

  destroyed() {
    if (this.interval > 0) {
      clearInterval(this.interval)
    }
  }

  toastOnClose(): void {
    if (this.interval > 0) {
      clearInterval(this.interval)
    }

    this.store.hideToastMessage()
  }
}
</script>
