<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-title">
      <span>{{ $t('NewUser') }}</span>
    </div>

    <CButton color="primary" variant="outline" @click="saveOnClick">{{ $t('Save') }}</CButton>
    <CButton color="dark" variant="outline" @click="closeOnClick">{{ $t('Close') }}</CButton>
  </div>

  <div class="contents-wrapper">
    <CRow>
      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="userId">{{ $t('ID') }}</CFormLabel>
          <CFormInput
            type="text"
            id="userId"
            placeholder="ID"
            v-model="userId"
            :feedbackInvalid="$t('WrongUserIdPattern')"
            :invalid="isValidUserId == null ? null : !isValidUserId"
            @update:modelValue="checkUserId"
          />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="password">{{ $t('Password') }}</CFormLabel>
          <CFormInput
            type="password"
            id="password"
            :placeholder="$t('PasswordPattern')"
            v-model="password"
            autocomplete="off"
            :feedbackValid="$t('CanUsePassword')"
            :feedbackInvalid="invalidFeedbackMessageForPassword"
            :valid="isValidPassword == null ? null : isValidPassword"
            :invalid="isValidPassword == null ? null : !isValidPassword"
            @update:modelValue="passwordOnUpdate"
          />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="checkPassword">{{ $t('CheckPassword') }}</CFormLabel>
          <CFormInput
            type="password"
            id="checkPassword"
            :placeholder="$t('CheckPassword')"
            v-model="checkPassword"
            autocomplete="off"
            :feedbackValid="$t('SameNewPassword')"
            :feedbackInvalid="$t('DifferentNewPassword')"
            :valid="isValidCheckPassword == null ? null : isValidCheckPassword"
            :invalid="isValidCheckPassword == null ? null : !isValidCheckPassword"
            @update:modelValue="checkPasswordOnUpdate"
          />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="userName">{{ $t('UserName') }}</CFormLabel>
          <CFormInput
            type="text"
            id="userName"
            placeholder="User Name"
            v-model="userName"
            :feedbackInvalid="$t('InputUserName')"
            :invalid="isValidUserName == null ? null : !isValidUserName"
            @update:modelValue="checkUserName"
          />
        </CForm>
      </CCol>
    </CRow>

    <CRow>
      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="email">{{ $t('Email') }}</CFormLabel>
          <CFormInput
            type="email"
            id="email"
            placeholder="abc@ctilab.co.kr"
            v-model="email"
            :feedbackInvalid="$t('WrongEmailPattern')"
            :invalid="isValidEmail == null ? null : !isValidEmail"
            @update:modelValue="checkEmail"
          />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="phone">{{ $t('Phone') }}</CFormLabel>
          <CFormInput
            type="text"
            id="phone"
            placeholder="010-0000-0000"
            v-model="phone"
            :feedbackInvalid="$t('WrongPhonePattern')"
            :invalid="isValidPhone == null ? null : !isValidPhone"
            @update:modelValue="checkPhoneNumber"
          />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel>{{ $t('Role') }}</CFormLabel>
          <CFormSelect v-model="selectedRole">
            <option v-for="option in options" :value="option.value">
              {{ option.label }}
            </option>
          </CFormSelect>
        </CForm>
      </CCol>
    </CRow>
  </div>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'

export default class User extends Base {
  userId: string = ''
  password: string = ''
  checkPassword: string = ''
  userName: string = ''
  email: string = ''
  phone: string = ''
  options: Array<any> = []
  selectedRole: string = ''

  isValidUserId: boolean | null = null
  isValidPassword: boolean | null = null
  isValidCheckPassword: boolean | null = null
  isValidUserName: boolean | null = null
  isValidEmail: boolean | null = null
  isValidPhone: boolean | null = null

  invalidFeedbackMessageForPassword: string = ''

  private roleItems = [] as Array<any>

  async created() {
    const response = await this.$http.postAsync('/role/getRoleItems')

    this.roleItems = response.data

    this.options = Array.from(this.roleItems.slice(1) as Array<any>, (item) => {
      return { label: item.role, value: item.id }
    })

    this.selectedRole = this.roleItems[1].id
  }

  checkUserId(e: Event): void {
    if (!this.userId || !this.userId.isValidUserId()) {
      this.isValidUserId = false
    } else {
      this.isValidUserId = true
    }
  }

  passwordOnUpdate(e: Event): void {
    this.invalidFeedbackMessageForPassword = this.$t('WrongPasswordPattern')

    if (!this.password || !this.password.isValidPassword()) {
      this.isValidPassword = false
    } else {
      this.isValidPassword = true
    }

    if (this.checkPassword) {
      if (this.password == this.checkPassword) {
        this.isValidCheckPassword = true
      } else {
        this.isValidCheckPassword = false
      }
    }
  }

  checkPasswordOnUpdate(e: Event): void {
    if (this.password == this.checkPassword) {
      this.isValidCheckPassword = true
    } else {
      this.isValidCheckPassword = false
    }
  }

  checkUserName(e: Event): void {
    const regex = new RegExp(/^\s*$/)

    if (!this.userName || regex.test(this.userName)) {
      this.isValidUserName = false
    } else {
      this.isValidUserName = true
    }
  }

  checkEmail(e: Event): void {
    if (!this.email || !this.email.isValidEmail()) {
      this.isValidEmail = false
    } else {
      this.isValidEmail = true
    }
  }

  checkPhoneNumber(e: Event): void {
    if (!this.phone || !this.phone.isValidPhoneNumber()) {
      this.isValidPhone = false
    } else {
      this.isValidPhone = true
    }
  }

  async saveOnClick(e: Event) {
    if (!this.isValidUserId) {
      ;(document.querySelector('#userId') as HTMLInputElement).focus()

      return
    }

    if (!this.isValidPassword) {
      ;(document.querySelector('#password') as HTMLInputElement).focus()

      return
    }

    if (!this.isValidCheckPassword) {
      ;(document.querySelector('#checkPassword') as HTMLInputElement).focus()

      return
    }

    if (!this.isValidUserName) {
      ;(document.querySelector('#userName') as HTMLInputElement).focus()

      return
    }

    if (!this.isValidEmail) {
      ;(document.querySelector('#email') as HTMLInputElement).focus()

      return
    }

    if (!this.isValidPhone) {
      ;(document.querySelector('#phone') as HTMLInputElement).focus()

      return
    }

    const data = await this.$http.postAsync('/user/saveUser', {
      userId: this.userId,
      password: this.password,
      userName: this.userName.trim(),
      email: this.email,
      phone: this.phone,
      role: this.selectedRole
    })

    alert(data.message)

    this.$router.back()
  }

  closeOnClick(): void {
    this.$router.back()
  }
}
</script>
