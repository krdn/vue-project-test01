import Modal from '@/components/common/Modal.vue'
import { useModalStore } from '@/stores/common/ModalStore'

import type { App } from 'vue'
import type { IModal, IModalData } from '@/types/types'

const ModalPlugin = {
  install: (app: App): void => {
    app.component('Modal', Modal)

    app.config.globalProperties.$modal = {
      show: (modalData: IModalData) => {
        const store = useModalStore()

        store.show(modalData)
      }
    } as IModal
  }
}

export default ModalPlugin
