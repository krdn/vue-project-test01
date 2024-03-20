import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('useLoadingStore', {
  state: () => ({
    isOpen: false,
    bypassLoading: false
  }),
  getters: {
    getIsOpen(state): boolean {
      return state.isOpen
    },
    getBypassLoading(state): boolean {
      return state.bypassLoading
    }
  },
  actions: {
    showLoading(): void {
      if (!this.isOpen && !this.bypassLoading) {
        this.isOpen = true
      }
    },
    hideLoading(): void {
      if (this.isOpen) {
        this.isOpen = false
      }
    }
  }
})
