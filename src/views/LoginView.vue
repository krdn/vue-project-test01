<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="logo"></div>
      <div class="box">
        <CForm
          id="loginForm"
          v-if="showLoginForm"
          :validated="invalidLoginData"
          @submit="preventSubmit"
        >
          <CFormInput
            type="text"
            :placeholder="$t('ID')"
            :feedbackInvalid="$t('InputID')"
            autocomplete="off"
            v-model="userId"
            tabindex="1"
            required
          />

          <CFormInput
            type="password"
            :placeholder="$t('Password')"
            :feedbackInvalid="$t('InputPassword')"
            autocomplete="off"
            v-model="password"
            @keydown="loginProcess"
            tabindex="2"
            required
          />

          <button type="button" class="login-button" @click="loginProcess" tabindex="3">
            LOG IN
          </button>

          <button type="button" class="inquiry-button" @click="inquiryOnClick" tabindex="4">
            {{ $t('Inquiry') }}
          </button>
        </CForm>

        <CForm id="otpForm" v-if="showOTPForm" :validated="invalidOTPData" @submit="preventSubmit">
          <div class="onetime-password-wrapper">
            <CFormInput
              type="text"
              class="onetime-password"
              :placeholder="$t('OTPAuthNumber')"
              :feedbackInvalid="$t('InputOTP')"
              autocomplete="off"
              v-model="otp"
              tabindex="6"
              required
            />
            <button type="button" tabindex="7" @click="validateOTP">{{ $t('Check') }}</button>
          </div>

          <button type="button" class="create-otp-button" @click="createOTPOnClick" tabindex="8">
            {{ $t('CreateOTP') }}
          </button>
        </CForm>
      </div>
    </div>
  </div>

  <CModal
    class="auto-adjust-width-modal-dialog"
    alignment="center"
    backdrop="static"
    :visible="showModal"
  >
    <CModalBody>
      <section v-if="modalContentType == 'LoginFailed'">
        <p class="modal-header-text" v-html="$t('InvalidUserInfo.Header1')"></p>

        <p class="modal-item-text" v-html="$t('InvalidUserInfo.Item1')"></p>
        <p class="modal-item-text" v-html="$t('InvalidUserInfo.Item2')"></p>
      </section>

      <section v-if="modalContentType == 'LoginTryCountExceed'">
        <p class="modal-header-text" v-html="$t('InvalidUserInfo.Header2')"></p>

        <p class="modal-item-text" v-html="$t('InvalidUserInfo.Item3')"></p>
      </section>

      <section v-if="modalContentType == 'NotAllowed'">
        <p class="modal-header-text" v-html="$t('InvalidUserInfo.Header3')"></p>

        <p class="modal-item-text" v-html="$t('InvalidUserInfo.Item4')"></p>
      </section>

      <section v-if="modalContentType == 'CreateGoogleOTP'">
        <p class="modal-header-text" v-html="$t('GoogleOTP.Header')"></p>

        <p class="modal-item-text" v-html="$t('GoogleOTP.Item1')"></p>
        <p class="modal-item-text" v-html="$t('GoogleOTP.Item2')"></p>

        <div class="qr-code-wrapper">
          <img v-if="auth.googleOTPQRCode != null" :src="auth.googleOTPQRCode" />
        </div>
      </section>

      <section v-if="modalContentType == 'LogoutAnotherDevice'">
        <p v-html="$t('AlreadyLoggedInMessage.Item1')"></p>
        <p v-html="$t('AlreadyLoggedInMessage.Item2')"></p>
        <p v-html="$t('AlreadyLoggedInMessage.Item3', { userAgent: userAgent })"></p>
        <p v-html="$t('AlreadyLoggedInMessage.Item4', { loggedDate: loggedDate })"></p>
      </section>

      <section v-if="modalContentType == 'AdminInquiry'">
        <p class="modal-header-text" v-html="$t('AdminInquiry.Header')"></p>

        <p class="modal-item-text" v-html="$t('AdminInquiry.Item1')"></p>
        <p class="modal-item-text" v-html="$t('AdminInquiry.Item2')"></p>
      </section>
    </CModalBody>

    <CModalFooter>
      <section v-if="modalContentType != 'LogoutAnotherDevice'">
        <CButton color="primary" variant="outline" @click="modalOnClose">
          {{ $t('Confirmation') }}
        </CButton>
      </section>

      <section v-if="modalContentType == 'LogoutAnotherDevice'">
        <CButton
          class="margin-right-10"
          color="danger"
          variant="outline"
          @click="disconnectOtherDevice"
        >
          {{ $t('Disconnect') }}
        </CButton>

        <CButton color="dark" variant="outline" @click="modalOnClose">
          {{ $t('Close') }}
        </CButton>
      </section>
    </CModalFooter>
  </CModal>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'
import { useAlarmStore } from '@/stores/common/AlarmStore'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import IndexedDBUtil from '@/utils/IndexedDBUtil'

import type { RouteRecordRaw, RouteRecordName } from 'vue-router'

export default class LoginView extends Base {
  userId: string = ''
  password: string = ''
  otp: string = ''
  userAgent: string = ''
  loggedDate: string = ''
  auth: any = { googleOTPQRCode: null }
  invalidLoginData: boolean = false
  invalidOTPData: boolean = false
  showLoginForm: boolean = true
  showOTPForm: boolean = false

  showModal: boolean = false
  modalContentType: string = ''

  alarmStore = useAlarmStore()

  private model: any = null
  private otpSecret: string = ''

  async created(): Promise<void> {
    const userInfo = await IndexedDBUtil.getUser()

    if (userInfo) {
      await this.$http.postAsync('/user/forceLogout', { userId: userInfo.userId })
      await IndexedDBUtil.clearAllData()
      LocalStorageUtil.clearLocalStorage()
    }

    await this.setSystemConfigurations()
  }

  async setSystemConfigurations(): Promise<void> {
    const data = await this.$http.postAsync('/settings/getSystemConfigurationForLogin')

    LocalStorageUtil.setDefaultDateRange(data.defaultDateRange)
    LocalStorageUtil.setUseMultiFactorAuthentication(data.useMultiFactorAuthentication)
  }

  async loginProcess(e: any): Promise<void> {
    if (!e.keyCode || e.keyCode == 13) {
      this.invalidLoginData = this.validateLoginForm() == false

      if (this.invalidLoginData) {
        return
      }

      await this.login()
    }
  }

  async disconnectOtherDevice(): Promise<void> {
    LocalStorageUtil.setBothToken(this.model.jwtToken, this.model.refreshToken)

    this.$socket.connect()

    await IndexedDBUtil.insertUser(this.model.user)

    LocalStorageUtil.setMenuItems(this.model.menuItems)

    await this.$http.postAsync('/user/disconnectOtherDevice', {
      userId: this.userId,
      socketId: this.model.loggedUser.socketId
    })

    this.showModal = false
    this.$router.push({ name: 'Dashboard' })
  }

  async validateOTP() {
    this.invalidOTPData =
      (document.querySelector('#otpForm') as HTMLFormElement).checkValidity() == false

    if (this.invalidOTPData) {
      return
    }

    const data = await this.$http.postAsync('/user/verifyOTP', {
      userId: this.userId,
      password: this.password,
      otp: this.otp,
      secretKey: this.otpSecret
    })

    if (data) {
      if (this.model.loggedUser) {
        this.modalContentType = 'LogoutAnotherDevice'
        this.userAgent = this.model.loggedUser.userAgent
        this.loggedDate = this.model.loggedUser.loggedDate
        this.showModal = true
      } else {
        LocalStorageUtil.setBothToken(this.model.jwtToken, this.model.refreshToken)

        this.$socket.connect()

        await IndexedDBUtil.insertUser(this.model.user)

        LocalStorageUtil.setMenuItems(this.model.menuItems)

        if (this.model.user.firstLogin) {
          this.$router.push({ name: 'FirstLogin' })
        } else {
          this.$router.push({ name: 'Dashboard' })
        }
      }
    }
  }

  inquiryOnClick(): void {
    this.modalContentType = 'AdminInquiry'

    this.showModal = true
  }

  modalOnClose(): void {
    this.showModal = false
  }

  async createOTPOnClick(): Promise<void> {
    const data = await this.$http.postAsync('/user/createOTP', { userId: this.model.user.userId })

    this.otpSecret = data.key
    this.auth.googleOTPQRCode = data.dataURL

    this.modalContentType = 'CreateGoogleOTP'
    this.showModal = true
  }

  preventSubmit(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
  }

  private async login(): Promise<void> {
    this.model = await this.$http.postAsync(
      '/user/login',
      { userId: this.userId, password: this.password },
      null,
      true
    )

    if (this.model.error) {
      if (this.model.status == 600) {
        this.modalContentType = 'LoginFailed'
      } else if (this.model.status == 608) {
        this.modalContentType = 'LoginTryCountExceed'
      } else if (this.model.status == 619) {
        this.modalContentType = 'NotAllowed'
      } else {
        alert(this.model.message)

        return
      }

      this.showModal = true
    } else {
      const mainRouteItem = this.$router.getRoutes().filter((item) => item.name == 'Main')[0]
      this.addRoute(this.model.menuItems, mainRouteItem.name as RouteRecordName)

      if (this.model.alarmData && Array.isArray(this.model.alarmData)) {
        this.alarmStore.pushAlarmData(this.model.alarmData)
      }

      if (LocalStorageUtil.getUseMultiFactorAuthentication()) {
        this.showLoginForm = false
        this.showOTPForm = true
      } else {
        if (this.model.loggedUser) {
          this.modalContentType = 'LogoutAnotherDevice'
          this.userAgent = this.model.loggedUser.userAgent
          this.loggedDate = this.model.loggedUser.loggedDate
          this.showModal = true
        } else {
          LocalStorageUtil.setBothToken(this.model.jwtToken, this.model.refreshToken)

          this.$socket.connect()

          await IndexedDBUtil.insertUser(this.model.user)

          LocalStorageUtil.setMenuItems(this.model.menuItems)

          if (this.model.user.firstLogin) {
            this.$router.push({ name: 'FirstLogin' })
          } else {
            this.$router.push({ name: 'Dashboard' })
          }
        }
      }
    }
  }

  private validateLoginForm(): boolean {
    const form = document.querySelector('#loginForm') as HTMLFormElement

    return form.checkValidity()
  }

  private addRoute(items: any, parentRouteName: RouteRecordName) {
    for (let menu of items) {
      if (menu.to) {
        const aaa = `@/views/${menu.component}.vue`;

        // const DashboardComponent = () => import(`@/views/${menu.component}.vue`);

        // const DashboardComponent = () => import(aaa);
        // const DashboardComponent = () => import(`@/views/main/Dashboard.vue`);

        const route = {
          path: menu.to,
          name: menu.name,
          meta: { default: false, canView: menu.canView },
          // component: () => import(`@/views/${menu.component}.vue`)
          component: () => import(`/src/views/${menu.component}.vue`)
          // component: () => import(`@/views/main/Dashboard.vue`)
        } as RouteRecordRaw;

        this.$router.addRoute(parentRouteName, route);

        if (menu.items && menu.items.length > 0) {
          route.children = [];

          this.addRoute(menu.items, route.name as RouteRecordName);
        }
      }
    }
  }
}
</script>
