import { createPinia, Pinia } from 'pinia'
import { Router } from 'vue-router'
import { IHttpUtil } from './types/types'
import { App } from 'vue'

const initPinia = (app: App<Element>): Pinia => {
  const pinia = createPinia()

  pinia.use(({ store }) => {
    store.$http = app.config.globalProperties.$http
    store.$router = app.config.globalProperties.$router
  })

  return pinia
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $http: IHttpUtil
    $router: Router
  }
}

export { initPinia }
