<template>
  <div class="contents-wrapper" v-if="dataLoaded">
    <CRow class="double-contents-header">
      <CCol :xxl="12" :xl="12" class="container">
        <span class="title">{{ $t('DeviceStatus') }}</span>
      </CCol>
    </CRow>

    <CRow class="padding-left-right-10">
      <CCol lg="4" md="12" sm="12" xs="12">
        <CTable class="device-info-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell class="device-info-header" scope="col" colspan="2"
                >{{ $t('DataCollectionStatus') }}
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>
                <span class="device-info-sub-title">Row Count</span>
                <br />
                <span>{{ clickHouseInfoRowCount.toLocaleString() }}</span>
              </CTableDataCell>
              <CTableDataCell>
                <span class="device-info-sub-title">Bytes</span>
                <br />
                <span>{{ clickHouseInfoBytes }}</span>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCol>

      <CCol lg="8" md="12" sm="12" xs="12">
        <CTable class="device-info-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell class="device-info-header" scope="col" colspan="3"
                >{{ $t('AlarmHistory') }}
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <div>
            <div class="device-monitoring-alarm-scroll">
              <ul class="content">
                <li>
                  <div class="message-center">
                    <span class="device-monitoring-alarm" v-for="alarm in alarmData">
                      <div class="device-monitoring-alarm-icon">
                        <div
                          :class="{
                            triangle: alarm.warningLevelCodeId == 304,
                            diamond: alarm.warningLevelCodeId == 301
                          }"
                        >
                          <span
                            class="exclamation-mark"
                            :class="{ 'no-margin': alarm.warningLevelCodeId == 301 }"
                            >!</span
                          >
                        </div>

                        <div class="margin-left-30">
                          <span v-if="alarm.warningLevelCodeId == 304">{{ $t('Danger') }}</span>
                          <span v-if="alarm.warningLevelCodeId == 301">{{ $t('Warning') }}</span>
                        </div>
                      </div>
                      <div class="width-60-percent">
                        <span v-html="$t(`Code.${alarm.alarmCodeId}`, alarm.data)"></span>
                      </div>
                      <div>
                        <span class="date" v-html="alarm.createdDate"></span>
                      </div>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CTable>
      </CCol>
    </CRow>

    <CRow class="padding-left-right-10">
      <CCol lg="12" md="12" sm="12" xs="12">
        <CTable class="device-info-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell class="device-info-header" scope="col" colspan="3"
                >DTI.analysis
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell class="width-50-percent">
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">CPU</span>
                  <span class="device-info-sub-title">{{
                    analyzeDeviceInfo && analyzeDeviceInfo.cpuUsage
                  }}</span>
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(analyzeDeviceInfo.cpuUsage)" />
                </CProgress>
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">{{ $t('CPUTemperature') }}</span>
                  <span class="device-info-sub-title">{{
                    analyzeDeviceInfo && analyzeDeviceInfo.cpuTemperature
                  }}</span>
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(analyzeDeviceInfo.cpuTemperature)" />
                </CProgress>
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">Memory</span>
                  <span class="device-info-sub-title"
                    >{{ analyzeDeviceInfo && analyzeDeviceInfo.memoryUsage }} /
                    {{ analyzeDeviceInfo && analyzeDeviceInfo.totalMemory }} ({{
                      analyzeDeviceInfo && analyzeDeviceInfo.memoryUsagePercent
                    }})</span
                  >
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(analyzeDeviceInfo.memoryUsagePercent)" />
                </CProgress>
              </CTableDataCell>
              <CTableDataCell>
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">HardDisk</span>
                  <span class="device-info-sub-title"
                    >{{ analyzeDeviceInfo && analyzeDeviceInfo.diskUsage }} /
                    {{ analyzeDeviceInfo && analyzeDeviceInfo.totalDisk }} ({{
                      analyzeDeviceInfo && analyzeDeviceInfo.diskUsagePercent
                    }})</span
                  >
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(analyzeDeviceInfo.diskUsage)" />
                </CProgress>
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">GPU</span>
                  <span class="device-info-sub-title">{{
                    analyzeDeviceInfo && analyzeDeviceInfo.gpuUsage
                  }}</span>
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(analyzeDeviceInfo.gpuUsage)" />
                </CProgress>
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">{{ $t('GPUTemperature') }}</span>
                  <span class="device-info-sub-title">{{
                    analyzeDeviceInfo && analyzeDeviceInfo.gpuTemperature
                  }}</span>
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(analyzeDeviceInfo.gpuTemperature)" />
                </CProgress>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>

    <CRow class="padding-left-right-10">
      <CCol lg="12" md="12" sm="12" xs="12">
        <CTable class="device-info-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell class="device-info-header" scope="col" colspan="3"
                >DTI.manager
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell class="width-50-percent">
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">CPU</span>
                  <span class="device-info-sub-title">{{ webServerUsage.cpuUsage }}</span>
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(webServerUsage.cpuUsage)" />
                </CProgress>
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">Memory</span>
                  <span class="device-info-sub-title"
                    >{{ webServerUsage.memoryUsage }} / {{ webServerUsage.totalMemory }} ({{
                      webServerUsage.memoryUsagePercent
                    }})</span
                  >
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(webServerUsage.memoryUsagePercent)" />
                </CProgress>
                <div class="device-monitoring-progress">
                  <span class="device-info-sub-title">HardDisk</span>
                  <span class="device-info-sub-title"
                    >{{ webServerUsage.diskUsage }} / {{ webServerUsage.totalDisk }} ({{
                      webServerUsage.diskUsagePercent
                    }})</span
                  >
                </div>
                <CProgress class="mb-3">
                  <CProgressBar :value="cutPercent(webServerUsage.diskUsagePercent)" />
                </CProgress>
              </CTableDataCell>
              <CTableDataCell>
                <div class="display-flex-flex-direction-row">
                  <span>CPU</span>
                  <RadialProgress
                    :diameter="125"
                    :completed-steps="cutPercent(webServerUsage.cpuUsage)"
                    :total-steps="radialProgressOptions.totalSteps"
                    :isClockwise="false"
                    :startColor="radialProgressOptions.startColor"
                    :stopColor="radialProgressOptions.stopColor"
                    :innerStrokeColor="radialProgressOptions.innerStrokeColor"
                  >
                    <span>{{ webServerUsage.cpuUsage }}</span>
                  </RadialProgress>
                  <span class="inline-block-margin-top">/ 100%</span>
                  <span>Memory</span>
                  <RadialProgress
                    :diameter="125"
                    :completed-steps="cutPercent(webServerUsage.memoryUsagePercent)"
                    :total-steps="radialProgressOptions.totalSteps"
                    :isClockwise="false"
                    :startColor="radialProgressOptions.startColor"
                    :stopColor="radialProgressOptions.stopColor"
                    :innerStrokeColor="radialProgressOptions.innerStrokeColor"
                  >
                    <span>{{ webServerUsage.memoryUsagePercent }}</span>
                  </RadialProgress>
                  <span class="inline-block-margin-top">/ {{ webServerUsage.totalMemory }}</span>
                  <span>HardDisk</span>
                  <RadialProgress
                    :diameter="125"
                    :completed-steps="cutPercent(webServerUsage.diskUsagePercent)"
                    :total-steps="radialProgressOptions.totalSteps"
                    :isClockwise="false"
                    :startColor="radialProgressOptions.startColor"
                    :stopColor="radialProgressOptions.stopColor"
                    :innerStrokeColor="radialProgressOptions.innerStrokeColor"
                  >
                    <span>{{ webServerUsage.diskUsagePercent }}</span>
                  </RadialProgress>
                  <span class="inline-block-margin-top">/ {{ webServerUsage.totalDisk }}</span>
                </div>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import RadialProgress from 'vue3-radial-progress'

@Options({
  components: {
    RadialProgress
  }
})
export default class DeviceMonitoring extends Base {
  radialProgressOptions = {
    startColor: '#315880',
    stopColor: '#315880',
    innerStrokeColor: '#EEEEEE',
    totalSteps: 100
  }
  dataLoaded: boolean = false
  clickHouseInfoRowCount: String = ''
  clickHouseInfoBytes: String = ''
  alarmData: Array<any> = []
  analyzeDeviceInfo: any
  webServerUsage: any

  async beforeCreate(): Promise<void> {
    const getDeviceStatusResponse = await this.$http.postAsync('/deviceInfo/getDeviceStatus')
    this.clickHouseInfoRowCount = getDeviceStatusResponse.clickHouseInfo.rowCount
    this.clickHouseInfoBytes = getDeviceStatusResponse.clickHouseInfo.bytes
    this.alarmData = getDeviceStatusResponse.alarmData
    this.analyzeDeviceInfo = getDeviceStatusResponse.analyzeDviceInfo
    this.webServerUsage = getDeviceStatusResponse.webServerUsage

    this.dataLoaded = true
  }

  created() {
    document
      .querySelectorAll('.nav-link.active')
      .forEach((element) => element.classList.remove('active'))
  }

  cutPercent(item: any) {
    const data = item
    const dataCutPercent = data.slice(0, -1)
    const itemNumber = parseFloat(dataCutPercent)

    return itemNumber
  }
}
</script>
