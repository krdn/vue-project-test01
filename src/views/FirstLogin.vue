<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="logo"></div>
      <div class="box">
        <CForm class="first-login" @submit="preventSubmit">
          <div class="paragraph-wrapper">
            <p>{{ $t('FirstLogin') }}</p>
            <p>{{ $t('InputNewPassword') }}</p>
          </div>

          <hr class="margin-30" />

          <CFormLabel for="oldPassword">{{ $t('PasswordIssued') }}</CFormLabel>
          <CFormInput
            id="oldPassword"
            type="password"
            name="oldPassword"
            :placeholder="$t('PasswordIssued')"
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

        <button type="button" class="login-button" @click="loginProcess" tabindex="5">
          LOG IN
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'
import IndexedDBUtil from '@/utils/IndexedDBUtil'

export default class LoginView extends Base {
  oldPassword: string = ''
  newPassword: string = ''
  checkNewPassword: string = ''

  isInValidOldPassword: boolean | null = null
  isValidNewPassword: boolean | null = null
  isValidCheckNewPassword: boolean | null = null

  invalidFeedbackMessageForNewPassword: string = ''

  private previousOldPassword: string = ''

  async loginProcess(e: Event): Promise<void> {
    this.isInValidOldPassword = !this.oldPassword

    if (this.isInValidOldPassword) {
      ;(document.querySelector('#oldPassword') as HTMLInputElement).focus()

      return
    }

    if (!this.isValidNewPassword) {
      ;(document.querySelector('#newPassword') as HTMLInputElement).focus()

      return
    }

    if (!this.isValidCheckNewPassword) {
      ;(document.querySelector('#checkPassword') as HTMLInputElement).focus()

      return
    }

    const user = await IndexedDBUtil.getUser()
    const data = await this.$http.postAsync('/user/changePassword', {
      userId: user.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    })

    if (data.isSamePassword) {
      this.invalidFeedbackMessageForNewPassword = this.$t('NewPasswordSameOldPassword')
      this.isValidNewPassword = false

      ;(document.querySelector('#newPassword') as HTMLInputElement).focus()
    } else {
      this.$router.push({ name: 'Dashboard' })
    }
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

  newPasswordOnUpdate(e: Event): void {
    this.invalidFeedbackMessageForNewPassword = this.$t('WrongPasswordPattern')

    if (!this.newPassword || !this.newPassword.isValidPassword()) {
      this.isValidNewPassword = false
    } else {
      this.isValidNewPassword = true
    }

    if (this.checkNewPassword) {
      if (this.newPassword == this.checkNewPassword) {
        this.isValidCheckNewPassword = true
      } else {
        this.isValidCheckNewPassword = false
      }
    }
  }

  checkPasswordOnUpdate(e: Event): void {
    if (this.newPassword == this.checkNewPassword) {
      this.isValidCheckNewPassword = true
    } else {
      this.isValidCheckNewPassword = false
    }
  }

  preventSubmit(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
  }
}
</script>
