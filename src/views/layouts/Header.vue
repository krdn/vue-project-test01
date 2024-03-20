<template>
  <CHeader class="custom-header">
    <CContainer fluid>
      <CHeaderNav class="custom">
        <CNavItem>
          {{ userName }} {{ $t('Nim') }}
          <CDropdown class="account-dropdown" placement="bottom-end">
            <CDropdownToggle :caret="false" style="padding: 0">
              <CommonIcon icon="person" :width="25" :height="25" />
            </CDropdownToggle>
            <CDropdownMenu>
              <div class="account-wrapper">
                <CAvatar color="dark" text-color="white">{{ getIconName() }}</CAvatar>
                <div>{{ userName }} {{ $t('Nim') }}</div>
                <div class="login-date">THE LAST LOGIN: {{ lastLoginDate }}</div>
              </div>
              <div class="dropdown-item-wrapper">
                <div class="dropdown-item" @click="basicInfoOnClick">
                  {{ $t('BasicInformation') }}
                </div>
                <div class="dropdown-item" @click="historyOnClick">
                  {{ $t('HistoryManagement') }}
                </div>
              </div>
            </CDropdownMenu>
          </CDropdown>
        </CNavItem>

        <CNavItem>
          <CDropdown class="alarm-dropdown" placement="bottom-end" auto-close="outside">
            <CDropdownToggle :caret="false" class="position-relative">
              <CommonIcon
                :icon="store.getUneadAlarmList.length > 0 ? 'badge_bell' : 'bell'"
                :width="25"
                :height="25"
              >
              </CommonIcon>
            </CDropdownToggle>
            <CDropdownMenu>
              <ul class="content">
                <li>
                  <div class="alarm-list-header">
                    <span>{{ $t('Alarm') }}</span>
                    <span @click="alarmConfirmOnClick">{{ $t('Confirmation') }}</span>
                  </div>
                </li>
                <li v-if="store.getUneadAlarmList.length > 0 || store.getReadAlarmList.length > 0">
                  <div class="message-center">
                    <a class="alarm-item" v-for="alarm of store.getUneadAlarmList">
                      <div class="alarm-item-icon">
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
                      </div>
                      <div>
                        <span v-html="$t(`Code.${alarm.alarmCodeId}`, alarm.data)"></span>
                        <span class="date" v-html="alarm.createdDate"></span>
                      </div>
                    </a>

                    <a class="alarm-item read" v-for="alarm of store.getReadAlarmList">
                      <div class="alarm-item-icon">
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
                      </div>
                      <div>
                        <span v-html="$t(`Code.${alarm.alarmCodeId}`, alarm.data)"></span>
                        <span class="date" v-html="alarm.createdDate"></span>
                      </div>
                    </a>
                  </div>
                </li>
                <li>
                  <div class="alarm-list-footer">
                    <span
                      v-if="
                        store.getUneadAlarmList.length == 0 && store.getReadAlarmList.length > 0
                      "
                      >{{ $t('RecentAlarmChecked') }}</span
                    >
                    <span
                      v-if="
                        store.getUneadAlarmList.length == 0 && store.getReadAlarmList.length == 0
                      "
                      >{{ $t('NoRecentAlarm') }}</span
                    >
                  </div>
                </li>
              </ul>
            </CDropdownMenu>
          </CDropdown>
        </CNavItem>

        <CNavItem>
          <CDropdown class="custom-dropdown" placement="bottom-start">
            <CDropdownToggle :caret="false">
              <CommonIcon :icon="languageIcon" :width="25" :height="25" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem @click="changeLocale('english')">
                <CommonIcon icon="english" :width="25" :height="25">&nbsp;English</CommonIcon>
              </CDropdownItem>
              <CDropdownItem @click="changeLocale('korean')">
                <CommonIcon icon="korean" :width="25" :height="25">&nbsp;한글</CommonIcon>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CNavItem>

        <CNavItem>
          <CDropdown class="custom-dropdown" placement="bottom-end">
            <CDropdownToggle :caret="false">
              <CommonIcon icon="setup" :width="25" :height="25" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem @click="clickhouseQueryOnClick" v-if="queryStore.getIsVisibleQueryMenu"
                >Query</CDropdownItem
              >
              <CDropdownItem @click="systemInfoOnClick">{{
                $t('SystemInformation')
              }}</CDropdownItem>
              <CDropdownItem @click="deviceMonitoringOnClick">{{
                $t('DeviceStatus')
              }}</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CNavItem>

        <CNavItem>
          <CDropdown class="custom-dropdown">
            <CDropdownToggle :caret="false">
              <CommonIcon
                icon="logout"
                :width="25"
                :height="25"
                @click="
                  () => {
                    isOpen = true
                  }
                "
              />
            </CDropdownToggle>
            <CDropdownMenu style="border: 0"></CDropdownMenu>
          </CDropdown>
        </CNavItem>
      </CHeaderNav>
    </CContainer>
  </CHeader>

  <CModal alignment="center" backdrop="static" size="sm" :visible="isOpen">
    <CModalBody class="pad-40">
      <div>
        <CAvatar color="dark" text-color="white" class="modal-icon">{{ getIconName() }}</CAvatar>
        <div style="font-weight: bold">{{ userName }} 님</div>
        <div>{{ $t('Logout') }}</div>
      </div>
      <hr class="margin-20" />
      <div class="logout-modal-footer">
        <CButton color="dark" variant="outline" class="btn-lg" @click="modalOnClose">{{
          $t('Cancel')
        }}</CButton>
        <CButton color="primary" variant="outline" class="btn-lg" @click="logoutOnClick">{{
          $t('Confirmation')
        }}</CButton>
      </div>
    </CModalBody>
  </CModal>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import { useAlarmStore } from '@/stores/common/AlarmStore'
import { useQueryStore } from '@/stores/component/QueryStore'
import { getActivePinia } from 'pinia'
import { Store } from 'pinia'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import IndexedDBUtil from '@/utils/IndexedDBUtil'
import Breadcrumb from './Breadcrumb.vue'

@Options({
  props: {},
  components: { Breadcrumb }
})
export default class Header extends Base {
  locale: string = 'ko'
  alertIcon: string = 'bell'
  languageIcon: string = 'korean'
  userName: string = ''
  lastLoginDate: string = ''
  isOpen: boolean = false
  changeLocaleCallBackFunctionName?: string

  store = useAlarmStore()
  queryStore = useQueryStore()

  async created(): Promise<void> {
    const userInfo = await IndexedDBUtil.getUser()

    this.userName = userInfo.userName
    this.lastLoginDate = userInfo.lastLoginDate
  }

  getIconName(): String {
    const englishRegex = /[a-zA-Z]/
    const koreanRegex = /[가-힣]/

    if (englishRegex.test(this.userName)) {
      return this.userName.charAt(0).toUpperCase()
    } else if (koreanRegex.test(this.userName)) {
      return this.userName.slice(-2)
    }

    return 'G'
  }

  basicInfoOnClick(): void {
    this.$router.push({ name: 'MyInfo', path: '/' })
  }

  historyOnClick(): void {
    this.$router.push({ name: 'History' })
  }

  async alarmConfirmOnClick(e: Event): Promise<void> {
    if (this.store.getUneadAlarmList.length > 0) {
      const readAlarmIds = []
      let unreadAlarmItem = this.store.getUneadAlarmList.shift()

      while (unreadAlarmItem) {
        unreadAlarmItem.readDate = Date.today()
        readAlarmIds.push(unreadAlarmItem.id)

        this.store.pushReadAlarmData(unreadAlarmItem)

        unreadAlarmItem = this.store.getUneadAlarmList.shift()
      }

      await this.$http.postAsync('/alarm/updateAlarmData', { updateAlarmIds: readAlarmIds })
    }
  }

  changeLocale(language: string): void {
    let locale = this.locale
    if (language == 'english') {
      locale = 'en'
    } else if (language == 'korean') {
      locale = 'ko'
    }

    this.$i18n.locale = locale
    this.locale = locale
    this.languageIcon = locale == 'ko' ? 'korean' : 'english'
  }

  clickhouseQueryOnClick(): void {
    this.$router.push({ name: 'QueryItems' })
  }

  systemInfoOnClick(): void {
    this.$router.push({ name: 'SystemInfo' })
  }

  deviceMonitoringOnClick(): void {
    this.$router.push({ name: 'DeviceMonitoring' })
  }

  async logoutOnClick(e: Event): Promise<void> {
    const userInfo = await IndexedDBUtil.getUser()

    if (userInfo) {
      await this.$http.postAsync('/user/logout', { userId: userInfo.userId })
    }

    IndexedDBUtil.clearAllData()
    LocalStorageUtil.clearLocalStorage()

    const storeInfo = getActivePinia() as any
    ;(storeInfo._s as Map<string, Store>).forEach((activeStore: Store): void =>
      activeStore.$reset()
    )

    this.$socket.disconnect()
    this.$router.push({ path: '/Login' })
  }

  modalOnClose(): void {
    this.isOpen = false
  }
}
</script>
