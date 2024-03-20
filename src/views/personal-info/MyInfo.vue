<template>
  <div class="contents-wrapper">
    <div class="contents-container">
      <CRow class="contents-header">
        <CCol :xxl="6" :xl="6">
          <div class="title with-button">
            <span>{{ $t('BasicInformation') }}</span>
            <CButton
              color="primary"
              variant="outline"
              @click="
                () => {
                  changePassword = true
                }
              "
              >{{ $t('Edit') }}</CButton
            >
          </div>
        </CCol>
      </CRow>

      <CRow class="contents-body">
        <CCol :xxl="6" :xl="6">
          <CRow class="sub-contents-body">
            <div class="pad-10">
              <CTable>
                <CTableHead>
                  <CTableRow color="secondary">
                    <CTableHeaderCell>{{ $t('UserName') }}</CTableHeaderCell>
                    <CTableHeaderCell>{{ userName }}</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>ID</CTableDataCell>
                    <CTableDataCell>{{ userId }}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{{ $t('Role') }}</CTableDataCell>
                    <CTableDataCell>{{ role }}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{{ $t('Phone') }}</CTableDataCell>
                    <CTableDataCell>{{ phone }}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>{{ $t('Email') }}</CTableDataCell>
                    <CTableDataCell>{{ email }}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          </CRow>
        </CCol>
      </CRow>
    </div>
  </div>

  <CModal
    class="basic-info-modal"
    backdrop="static"
    size="lg"
    :visible="changePassword"
    @close="changePasswordModalOnClose"
  >
    <CModalHeader>
      <CModalTitle>
        {{ $t('EditBasicInformation') }}
        <div class="sub-title">{{ $t('InquiryDescription') }}</div>
      </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable>
        <CTableBody class="body-table">
          <CTableRow>
            <CTableDataCell>{{ $t('UserName') }}</CTableDataCell>
            <CTableDataCell>{{ userName }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>ID</CTableDataCell>
            <CTableDataCell>{{ userId }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t('Role') }}</CTableDataCell>
            <CTableDataCell>{{ role }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t('Phone') }}</CTableDataCell>
            <CTableDataCell>{{ phone }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t('Email') }}</CTableDataCell>
            <CTableDataCell>{{ email }}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>{{ $t('Password') }}</CTableDataCell>
            <CTableDataCell>
              <CForm>
                <CFormInput
                  id="oldPassword"
                  type="password"
                  name="oldPassword"
                  :placeholder="$t('CurrentPassword')"
                  :feedbackInvalid="$t('WrongOldPassword')"
                  :invalid="isInValidOldPassword == null ? null : isInValidOldPassword"
                  autocomplete="off"
                  v-model="oldPassword"
                  tabindex="1"
                  @update:modelValue="oldPasswordOnUpdate"
                  @blur="oldPasswordOnBlur"
                  required
                />
              </CForm>

              <hr class="margin-30" />

              <CForm class="first-login" @submit="preventSubmit">
                <CFormLabel for="newPassword">{{ $t('NewPassword') }}</CFormLabel>
                <CFormInput
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  :text="$t('PasswordPatternDescription')"
                  :placeholder="$t('PasswordPattern')"
                  :feedbackValid="$t('CanUsePassword')"
                  :feedbackInvalid="invalidFeedbackMessageForNewPassword"
                  :valid="isValidNewPassword == null ? null : isValidNewPassword"
                  :invalid="isValidNewPassword == null ? null : !isValidNewPassword"
                  autocomplete="off"
                  v-model="newPassword"
                  tabindex="2"
                  @update:modelValue="newPasswordOnUpdate"
                  required
                />
              </CForm>

              <hr class="margin-20" />

              <CForm class="first-login" @submit="preventSubmit">
                <CFormInput
                  id="checkPassword"
                  type="password"
                  name="checkNewPassword"
                  :placeholder="$t('CheckNewPassword')"
                  :feedbackValid="$t('SameNewPassword')"
                  :feedbackInvalid="$t('DifferentNewPassword')"
                  :valid="isValidCheckNewPassword == null ? null : isValidCheckNewPassword"
                  :invalid="isValidCheckNewPassword == null ? null : !isValidCheckNewPassword"
                  autocomplete="off"
                  v-model="checkNewPassword"
                  tabindex="3"
                  @update:modelValue="checkPasswordOnUpdate"
                  required
                />
              </CForm>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </CModalBody>
    <CModalFooter>
      <CButton
        color="primary"
        variant="outline"
        @click="
          () => {
            adminInquiry = true
          }
        "
      >
        {{ $t('Inquiry') }}
      </CButton>
      <CButton color="dark" variant="outline" @click="changePasswordModalOnClose">
        {{ $t('Cancel') }}
      </CButton>

      <CButton color="primary" variant="outline" @click="handleChangePassword">
        {{ $t('Edit') }}
      </CButton>
    </CModalFooter>
  </CModal>
  <CModal alignment="center" backdrop="static" :visible="adminInquiry">
    <CModalBody>
      <div class="title" style="font-size: large; font-weight: bold">{{ $t('Inquiry') }}</div>
      <div>
        - to be decided <br />
        - TEL : 1588-0000 <br />
        - E-Mail : ctilab@ctilab.co.kr
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" variant="outline" @click="adminInquiryModalOnClose">
        {{ $t('Confirmation') }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'
import IndexedDBUtil from '@/utils/IndexedDBUtil'

export default class MyInfo extends Base {
  userName: string = ''
  userId: string = ''
  phone: string = ''
  email: string = ''
  role: string = ''
  isInValidOldPassword: boolean | null = null
  isValidNewPassword: boolean | null = null
  isValidCheckNewPassword: boolean | null = null
  invalidFeedbackMessageForNewPassword: string = ''

  changePassword: boolean = false
  oldPassword: string = ''
  checkPassword: string = ''
  checkNewPassword: string = ''
  newPassword: string = ''
  adminInquiry: boolean = false

  private previousOldPassword: string = ''

  async created(): Promise<void> {
    const userInfo = await IndexedDBUtil.getUser()

    this.userName = userInfo.userName
    this.userId = userInfo.userId
    this.phone = userInfo.phone
    this.email = userInfo.email
    this.role = userInfo.role

    document
      .querySelectorAll('.nav-link.active')
      .forEach((element) => element.classList.remove('active'))
  }

  changePasswordModalOnClose(): void {
    this.changePassword = false

    this.oldPassword = ''
    this.newPassword = ''
    this.checkNewPassword = ''
    this.isInValidOldPassword = null
    this.isValidNewPassword = null
    this.isValidCheckNewPassword = null
    this.invalidFeedbackMessageForNewPassword = ''
  }

  adminInquiryModalOnClose(): void {
    this.adminInquiry = false
  }

  validatePassword(): boolean {
    return this.newPassword == this.checkNewPassword
  }

  oldPasswordOnUpdate(e: Event): void {
    this.isInValidOldPassword = !this.oldPassword
  }

  async oldPasswordOnBlur(e: Event): Promise<void> {
    if (this.oldPassword != this.previousOldPassword) {
      const data = await this.$http.postAsync('/user/validateOldPassword', {
        password: this.oldPassword
      })

      this.isInValidOldPassword = !data.result
    }

    this.previousOldPassword = (e.target as HTMLInputElement).value
  }

  preventSubmit(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
  }

  newPasswordOnUpdate(e: Event): void {
    this.invalidFeedbackMessageForNewPassword = this.$t('WrongPasswordPattern')

    if (!this.newPassword || !this.newPassword.isValidPassword()) {
      this.isValidNewPassword = false
    } else {
      this.isValidNewPassword = true
    }

    if (this.checkNewPassword && this.newPassword == this.checkNewPassword) {
      this.isValidCheckNewPassword = true
    } else {
      this.isValidCheckNewPassword = false
    }
  }

  checkPasswordOnUpdate(e: Event): void {
    this.isValidCheckNewPassword = this.newPassword == this.checkNewPassword
  }

  async handleChangePassword(): Promise<void> {
    if (!this.validatePassword()) {
      alert('비밀번호가 일치하지 않습니다.')

      return
    }

    const requestBody = {
      userId: this.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }
    const changePasswordResponse = await this.$http.postAsync('/user/changePassword', requestBody)

    if (changePasswordResponse.isSamePassword === true) {
      alert('기존 비밀번호랑 동일합니다')

      ;(document.querySelector('#newPassword') as HTMLInputElement).focus()
    } else {
      alert('비밀번호가 변경 되었습니다.')

      this.changePasswordModalOnClose()
    }
  }
}
</script>
