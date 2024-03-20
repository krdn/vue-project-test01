<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-title">
      <span>{{ $t('SystemManagementMain') }}</span>
    </div>
  </div>

  <div class="contents-wrapper">
    <div class="pad-10">
      <span class="contents-title">{{ $t('SetDataPeriod') }}</span>
      <span class="sub-color-title">{{ $t('SetDataPeriodDescription') }}</span>

      <div class="system-contents">
        <CFormSelect v-model="selectedOption" @change="selectOnChange" class="width-200">
          <option v-for="option in options" :value="option.value">
            {{ option.label }}
          </option>
        </CFormSelect>
        <CButton
          color="primary"
          variant="outline"
          @click="
            () => {
              isDateModal = true
            }
          "
          >{{ $t('Apply') }}</CButton
        >
      </div>
    </div>

    <div class="pad-10 line">
      <span class="contents-title">{{ $t('SetMultiFactor') }}</span>
      <span class="sub-color-title">{{ $t('SetMultiFactorDescription') }}</span>

      <div class="system-contents align-center">
        <span>Multi Factor Authentication</span>

        <CFormSwitch
          size="xl"
          v-model="useMultiFactorAuthentication"
          @change="changeSwitch"
          :title="useMultiFactorAuthentication ? 'ON' : 'OFF'"
        />
      </div>
    </div>
  </div>

  <CModal alignment="center" backdrop="static" size="sm" :visible="isDateModal">
    <CModalBody class="pad-40">
      <div>
        <div>
          {{ $t('DataPeriods.Periods') }}
          <br />
          <span class="bold" v-text="selectedLabel"></span>
          {{ $t('DataPeriods.Question') }}
        </div>
      </div>
      <hr class="margin-20" />
      <div class="logout-modal-footer">
        <CButton color="dark" variant="outline" @click="cancelDateRange">{{
          $t('Cancel')
        }}</CButton>
        <CButton
          color="primary"
          variant="outline"
          @click="changeDefaultDateRange(selectedOption)"
          >{{ $t('Confirmation') }}</CButton
        >
      </div>
    </CModalBody>
  </CModal>

  <CModal alignment="center" backdrop="static" size="sm" :visible="isMFAModal">
    <CModalBody class="pad-40">
      <div>
        <div>
          {{ $t('UseMultiFactor.MultiFactor') }}

          <br />

          <span class="bold">{{
            useMultiFactorAuthentication
              ? $t('UseMultiFactor.Active')
              : $t('UseMultiFactor.InActive')
          }}</span>

          {{ $t('UseMultiFactor.Question') }}
        </div>
      </div>
      <hr class="margin-20" />
      <div class="logout-modal-footer">
        <CButton color="dark" variant="outline" @click="cancelSwitch">{{ $t('Cancel') }}</CButton>
        <CButton color="primary" variant="outline" @click="updateMultiFactorAuthentication"
          >{{ $t('Confirmation') }}
        </CButton>
      </div>
    </CModalBody>
  </CModal>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

export default class SystemManagementMain extends Base {
  options: Array<any> = []
  selectedOption: string = ''
  selectedLabel: string = ''
  useMultiFactorAuthentication: boolean = false
  isDateModal: boolean = false
  isMFAModal: boolean = false

  private dateRangeItems = [] as Array<any>

  async created() {
    const response = await this.$http.postAsync('/settings/getSystemConfigurationData')

    this.dateRangeItems = response.dateRangeItems

    this.options = Array.from(this.dateRangeItems, (item) => {
      return { label: item.name, value: item.id }
    })

    this.selectedOption = response.defaultDateRangeCode.toString()
    this.selectedLabel = this.options.filter((item) => item.value == this.selectedOption)[0].label
    this.useMultiFactorAuthentication = response.useMultiFactorAuthentication
  }

  async changeDefaultDateRange(selected: any) {
    this.isDateModal = false

    await this.$http.postAsync('/settings/updateSystemConfiguration', { dateRangeCode: selected })

    const result = this.dateRangeItems.filter((item: any) => item.id == selected)[0].value

    LocalStorageUtil.setDefaultDateRange(result)
  }

  selectOnChange(e: Event): void {
    const selectElement = e.target as HTMLSelectElement

    this.selectedLabel = this.options.filter((item) => item.value == selectElement.value)[0].label
  }

  cancelDateRange() {
    this.isDateModal = false
  }

  changeSwitch(): void {
    this.isMFAModal = true
  }

  cancelSwitch(): void {
    this.useMultiFactorAuthentication = !this.useMultiFactorAuthentication
    this.isMFAModal = false
  }

  updateMultiFactorAuthentication() {
    this.isMFAModal = false
    this.$http.postAsync('/settings/updateSystemConfiguration', {
      useMFA: this.useMultiFactorAuthentication
    })

    LocalStorageUtil.setUseMultiFactorAuthentication(this.useMultiFactorAuthentication)
  }
}
</script>
