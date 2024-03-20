<template>
  <CTable class="device-info-table">
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell class="device-info-header" scope="col" colspan="2">{{
          $t('LogDataDB')
        }}</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow>
        <CTableDataCell>
          <span class="device-info-sub-title">Row Count</span>
          <br />
          <span v-text="clickHouseInfo.rowCount.toLocaleString()"></span>
        </CTableDataCell>
        <CTableDataCell>
          <span class="device-info-sub-title">Bytes</span>
          <br />
          <span v-text="clickHouseInfo.bytes"></span>
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

@Options({
  props: {
    clickHouseInfo: {
      type: Object as () => any,
      required: true,
      default: { rowCount: 0, bytes: '' }
    }
  }
})
export default class ClickHouseInfo extends Base {
  clickHouseInfo!: any
}
</script>
