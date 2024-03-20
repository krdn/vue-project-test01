<template>
  <div class="contents-wrapper dashboard">
    <div class="system-info">
      <img class="width-480" src="~@/assets/images/dti.png" />
      <hr class="margin-30" />
      <hr class="margin-30" />
      <CTable>
        <CTableBody>
          <CTableRow class="bottom-border">
            <CTableHeaderCell class="gray">{{ $t('SystemInformation') }}</CTableHeaderCell>
            <CTableDataCell></CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell class="left">COMPANY</CTableDataCell>
            <CTableDataCell class="right">CTILab Co., Ltd</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell class="left">PRODUCT NAME</CTableDataCell>
            <CTableDataCell class="right">DTI.ai</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell class="left">VERSION</CTableDataCell>
            <CTableDataCell class="right">v1.0</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>
  </div>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'
import { useQueryStore } from '@/stores/component/QueryStore'

export default class SystemInfo extends Base {
  inputValue: string = ''
  store = useQueryStore()

  created(): void {
    document
      .querySelectorAll('.nav-link.active')
      .forEach((element) => element.classList.remove('active'))
  }

  mounted(): void {
    window.addEventListener('keydown', this.showQueryMenu)
  }

  beforeUnmount(): void {
    window.removeEventListener('keydown', this.showQueryMenu)
  }

  showQueryMenu(event: KeyboardEvent) {
    this.inputValue += event.key

    if (this.inputValue == 'ctilab') {
      this.store.showQueryMenu()
    }
  }
}
</script>
