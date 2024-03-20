<template>
  <CTable class="device-info-table">
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell class="device-info-header" scope="col" colspan="5">{{
          $t('AnalyzeDeviceInfo')
        }}</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow>
        <CTableDataCell width="80px">
          <span class="device-info-sub-title">CPU</span>
          <br />
          <span v-text="analyzeDeviceInfo.cpuUsage"></span>
        </CTableDataCell>

        <CTableDataCell width="200px">
          <span class="device-info-sub-title">Memory</span>
          <br />
          <span
            >{{ analyzeDeviceInfo.memoryUsage }} / {{ analyzeDeviceInfo.totalMemory }}({{
              analyzeDeviceInfo.memoryUsagePercent
            }})</span
          >
        </CTableDataCell>

        <CTableDataCell width="80px">
          <span class="device-info-sub-title">GPU</span>
          <br />
          <span v-text="analyzeDeviceInfo.gpuUsage"></span>
        </CTableDataCell>

        <CTableDataCell width="170px">
          <span class="device-info-sub-title">GPU Memory</span>
          <br />
          <span
            >{{ analyzeDeviceInfo.gpuMemoryUsage }} / {{ analyzeDeviceInfo.gpuMemoryTotal }}({{
              analyzeDeviceInfo.gpuMemoryUsagePercent
            }})</span
          >
        </CTableDataCell>

        <CTableDataCell>
          <span class="device-info-sub-title">Hard Disk</span>
          <br />
          <span
            >{{ analyzeDeviceInfo.diskUsage }} / {{ analyzeDeviceInfo.totalDisk }}({{
              analyzeDeviceInfo.diskUsagePercent
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
    analyzeDeviceInfo: {
      type: Object as () => any,
      required: true,
      default: {
        cpuUsage: '',
        totalMemory: '',
        memoryUsage: '',
        memoryUsagePercent: '',
        gpuUsage: '',
        gpuMemoryUsage: '',
        gpuMemoryTotal: '',
        gpuMemoryUsagePercent: '',
        totalDisk: '',
        diskUsage: '',
        diskUsagePercent: ''
      }
    }
  }
})
export default class AnalyzeDeviceInfo extends Base {
  analyzeDeviceInfo!: any
}
</script>
