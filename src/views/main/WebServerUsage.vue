<template>
  <CTable class="device-info-table">
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell class="device-info-header" scope="col" colspan="3">{{
          $t('WebServerUsage')
        }}</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow>
        <CTableDataCell width="80px">
          <span class="device-info-sub-title">CPU</span>
          <br />
          <span v-text="webServerUsage.cpuUsage"></span>
        </CTableDataCell>

        <CTableDataCell width="200px">
          <span class="device-info-sub-title">Memory</span>
          <br />
          <span
            >{{ webServerUsage.memoryUsage }} / {{ webServerUsage.totalMemory }}({{
              webServerUsage.memoryUsagePercent
            }})</span
          >
        </CTableDataCell>

        <CTableDataCell>
          <span class="device-info-sub-title">Hard Disk</span>
          <br />
          <span
            >{{ webServerUsage.diskUsage }} / {{ webServerUsage.totalDisk }}({{
              webServerUsage.diskUsagePercent
            }})</span
          >
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

@Options({
  props: {
    webServerUsage: {
      type: Object as () => any,
      required: true,
      default: {
        cpuUsage: '',
        totalMemory: '',
        memoryUsage: '',
        memoryUsagePercent: '',
        totalDisk: '',
        diskUsage: '',
        diskUsagePercent: ''
      }
    }
  }
})
export default class WebServerUsage extends Base {
  webServerUsage!: any
}
</script>
