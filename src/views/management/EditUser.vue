<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-title">
      <span>{{ $t('EditUser') }}</span>
    </div>

    <CButton color="primary" variant="outline" @click="saveOnClick">{{ $t('Save') }}</CButton>
    <CButton color="danger" variant="outline" @click="deleteOnClick" v-if="canDelete">{{
      $t('Delete')
    }}</CButton>
    <CButton color="dark" variant="outline" @click="closeOnClick">{{ $t('Close') }}</CButton>
  </div>

  <div class="contents-wrapper">
    <CRow>
      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="userId">{{ $t('ID') }}</CFormLabel>
          <CFormInput type="text" id="userId" placeholder="ID" v-model="userId" readonly />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="password">{{ $t('NewPassword') }}</CFormLabel>
          <CFormInput
            type="password"
            id="password"
            :placeholder="$t('PasswordPattern')"
            :feedbackValid="$t('CanUsePassword')"
            :feedbackInvalid="invalidFeedbackMessageForPassword"
            :valid="isValidPassword == null ? null : isValidPassword"
            :invalid="isValidPassword == null ? null : !isValidPassword"
            v-model="password"
            autocomplete="off"
            @update:modelValue="passwordOnUpdate"
          />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="checkPassword">{{ $t('CheckNewPassword') }}</CFormLabel>
          <CFormInput
            type="password"
            id="checkPassword"
            :placeholder="$t('CheckNewPassword')"
            :feedbackValid="$t('SameNewPassword')"
            :feedbackInvalid="$t('DifferentNewPassword')"
            :valid="isValidCheckPassword == null ? null : isValidCheckPassword"
            :invalid="isValidCheckPassword == null ? null : !isValidCheckPassword"
            v-model="checkPassword"
            autocomplete="off"
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
          <CFormInput type="email" id="email" placeholder="abc@naver.com" v-model="email" />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6">
        <CForm>
          <CFormLabel for="phone">{{ $t('Phone') }}</CFormLabel>
          <CFormInput type="text" id="phone" placeholder="010-0000-0000" v-model="phone" />
        </CForm>
      </CCol>

      <CCol lg="3" md="6" sm="6" xs="6" v-if="canDelete">
        <CForm>
          <CFormLabel>{{ $t('Role') }}</CFormLabel>
          <CFormSelect v-model="role">
            <option v-for="option in options" :value="option.value">
              {{ option.label }}
            </option>
          </CFormSelect>
        </CForm>
      </CCol>

      <CCol lg="1" md="1" sm="2" xs="2">
        <CForm class="checkbox-inline">
          <CFormCheck id="flexCheckDefault" type="checkbox" label="Active" v-model="active" />
        </CForm>
      </CCol>
    </CRow>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

import type { IModalData } from '@/types/types'

@Options({
  props: {
    id: { type: String, default: '' }
  }
})
export default class User extends Base {
  id!: string
  userId: string = ''
  password: string | null = null
  checkPassword: string | null = null
  userName: string = ''
  email: string = ''
  phone: string = ''
  active: boolean = false
  options: Array<any> = []
  role: string = ''
  canDelete: boolean = false

  isValidUserName: boolean | null = true
  isValidPassword: boolean | null = null
  isValidCheckPassword: boolean | null = null

  invalidFeedbackMessageForPassword: string = ''

  private roleItems = [] as Array<any>

  async beforeCreate(): Promise<void> {
    const response = await this.$http.postAsync('/role/getRoleItems')

    this.roleItems = response.data
    this.options = Array.from(this.roleItems.slice(1) as Array<any>, (item) => {
      return { label: item.role, value: item.id }
    })

    const data = await this.$http.postAsync('/user/getUserById', { id: this.$route.params.id })

    this.userId = data.userId
    this.userName = data.userName
    this.email = data.email
    this.phone = data.phone
    this.active = data.active
    this.role = data.role
    this.canDelete = data.canDelete
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

  async saveOnClick(e: Event) {
    if (this.password) {
      if (!this.isValidPassword) {
        ;(document.querySelector('#password') as HTMLInputElement).focus()

        return
      }

      if (!this.isValidCheckPassword) {
        ;(document.querySelector('#checkPassword') as HTMLInputElement).focus()

        return
      }
    }

    const data = await this.$http.postAsync('/user/updateUserById', {
      id: this.$route.params.id,
      userId: this.userId,
      password: this.password,
      userName: this.userName.trim(),
      email: this.email,
      phone: this.phone,
      active: this.active,
      role: this.role
    })

    alert(data.message)

    this.$router.back()
  }

  deleteOnClick(e: Event): void {
    const modalData = {
      bodyLocaleKey: 'DataDeleteConfirm',
      buttonItems: [
        {
          color: 'danger',
          localeKey: 'Delete',
          callback: async (): Promise<void> => {
            const data = await this.$http.postAsync('/user/deleteUserById', {
              id: this.$route.params.id
            })

            alert(data.message)

            this.$router.back()
          }
        }
      ]
    } as IModalData

    this.$modal.show(modalData)
  }

  closeOnClick(): void {
    this.$router.back()
  }
}
</script>
