import {
  IHttpUtil,
  IModal,
  IMomentUtil,
  ISocketUtil,
  IStringUtil,
  IValidationUtil
} from '@/types/types'
import type moment from 'moment'

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>

  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: IHttpUtil
    $modal: IModal
    $moment: moment
    $momentUtil: IMomentUtil
    $socket: ISocketUtil
    $stringUtil: IStringUtil
    $validationUtil: IValidationUtil
  }
}
