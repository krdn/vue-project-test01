<template>
  <CModal
    alignment="center"
    backdrop="static"
    :visible="store.getIsOpen"
    @close="modalOnClose"
    aria-labelledby="VerticallyCenteredExample"
  >
    <CModalHeader>
      <CModalTitle id="ToggleBetweenModalsExample1">{{ store.title }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <p>{{ $t(store.getBodyLocaleKey, store.messageParameters) }}</p>
    </CModalBody>
    <CModalFooter>
      <CButton
        v-for="item in store.getButtonItems"
        :color="item.color"
        variant="outline"
        class="btn-lg"
        @click="() => buttonOnClick(item.callback)"
        >{{ $t(item.localeKey) }}</CButton
      >
      <CButton
        v-if="store.getIsVisibleCloseButton"
        color="dark"
        variant="outline"
        class="btn-lg"
        @click="modalOnClose"
      >
        {{ $t('Close') }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { useModalStore } from '@/stores/common/ModalStore'

export default class Modal extends Vue {
  store = useModalStore()
  visibleStaticBackdrop: boolean = false

  buttonOnClick(callback: Function | undefined): void {
    this.store.isOpen = false

    if (callback) {
      callback()
    }
  }

  modalOnClose(e: Event): void {
    this.store.isOpen = false

    if (this.store.closeCallBack) {
      this.store.closeCallBack()
    }
  }
}
</script>
