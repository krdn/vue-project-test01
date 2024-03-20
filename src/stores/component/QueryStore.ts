import { defineStore } from 'pinia'

export const useQueryStore = defineStore('useQueryStore', {
  state: () => ({
    isVisibleQueryMenu: false
  }),
  getters: {
    getIsVisibleQueryMenu(state): boolean {
      return state.isVisibleQueryMenu
    }
  },
  actions: {
    showQueryMenu(): void {
      this.isVisibleQueryMenu = true
    }
  }
})
