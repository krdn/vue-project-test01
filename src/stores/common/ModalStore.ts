import { defineStore } from 'pinia'
import { IModalData, IButtonItems } from '@/types/types'

export const useModalStore = defineStore('useModalStore', {
  state: () => ({
    isOpen: false,
    isVisibleCloseButton: true,
    title: '',
    bodyLocaleKey: '',
    messageParameters: {},
    buttonItems: [] as Array<IButtonItems>,
    closeCallBack: Object as (() => void) | undefined
  }),
  getters: {
    getIsOpen(state): boolean {
      return state.isOpen
    },
    // getTitle(state): string {
    //   return state.title;
    // },
    getBodyLocaleKey(state): string {
      return state.bodyLocaleKey
    },
    getButtonItems(state): Array<IButtonItems> {
      return state.buttonItems
    },
    getIsVisibleCloseButton(state): boolean {
      return state.isVisibleCloseButton
    }
  },
  actions: {
    show(data: IModalData): void {
      this.isOpen = true
      this.title = data.title ? data.title : ''
      this.bodyLocaleKey = data.bodyLocaleKey
      this.messageParameters = data.messageParameters ? data.messageParameters : {}
      this.isVisibleCloseButton = data.isVisibleCloseButton != false
      this.buttonItems = data.buttonItems ? data.buttonItems : []
      this.closeCallBack = data.closeCallBack
    }
  }
})
