import { defineStore } from 'pinia'

export const useStateStore = defineStore('useStateStore', {
  state: () => ({
    componentState: {} as IComponentState
  }),
  actions: {
    addComponentState(stateName: string) {
      const state = this.getComponentState(stateName)

      if (state == null) {
        this.componentState[stateName] = {}
      }
    },
    getComponentState(stateName: string) {
      if (this.componentState.hasOwnProperty(stateName)) {
        return this.componentState[stateName]
      }

      return null
    },
    removeComponentState(stateName: string) {
      const newComponentState = {} as IComponentState

      for (let property in this.componentState) {
        if (property != stateName) {
          newComponentState[property] = this.componentState[property]
        }
      }

      this.componentState = newComponentState
    }
  }
})

interface IComponentState {
  [index: string]: any
}
