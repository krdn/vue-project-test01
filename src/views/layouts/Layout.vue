<template>
  <Sidebar></Sidebar>

  <div class="wrapper">
    <Header></Header>

    <div class="body">
      <CContainer fluid>
        <router-view />
      </CContainer>
    </div>
  </div>
  <Modal />
  <Loading />
  <ToastMessage />
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Loading from '@/components/common/Loading.vue'
import ToastMessage from '@/components/common/ToastMessage.vue'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import IndexedDBUtil from '@/utils/IndexedDBUtil'

@Options({
  components: { Sidebar, Header, Loading, ToastMessage }
})
export default class Layout extends Base {
  locale: string = 'ko'

  private readonly sessionTimeout = 1800000
  private remainTimeout = this.sessionTimeout
  private interval: number | null = null

  async mounted(): Promise<void> {
    if (this.interval == null) {
      this.interval = setInterval(async () => {
        this.remainTimeout = this.remainTimeout - 60000

        if (this.remainTimeout == 0) {
          const userInfo = await IndexedDBUtil.getUser()

          await this.$http.postAsync('/user/forceLogout', { userId: userInfo.userId })
          await IndexedDBUtil.clearAllData()

          LocalStorageUtil.clearLocalStorage()

          clearInterval(this.interval as number)

          this.remainTimeout = this.sessionTimeout
          this.interval = null

          this.$modal.show({
            bodyLocaleKey: 'SessionTimeout',
            closeCallBack: () => {
              this.$router.push({ name: 'Login' })
            }
          })
        }
      }, 60000)

      window.addEventListener('mousemove', this.onMouseMove)
    }
  }

  unmounted() {
    if (this.interval != null) {
      clearInterval(this.interval)

      this.remainTimeout = this.sessionTimeout
      this.interval = null
    }

    window.removeEventListener('mousemove', this.onMouseMove)
  }

  private onMouseMove(e: MouseEvent) {
    this.remainTimeout = this.sessionTimeout
  }
}
</script>
