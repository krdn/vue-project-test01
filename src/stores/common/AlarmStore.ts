import { defineStore } from 'pinia'

export const useAlarmStore = defineStore('useAlarmStore', {
  state: () => ({
    isVisibleToastMessage: false,
    unreadAlarmList: [] as Array<any>,
    readAlarmList: [] as Array<any>
  }),
  getters: {
    getIsVisibleToastMessage(state): boolean {
      return state.isVisibleToastMessage
    },
    getUneadAlarmList(state): Array<any> {
      return state.unreadAlarmList
    },
    getReadAlarmList(state): Array<any> {
      return state.readAlarmList
    }
  },
  actions: {
    showToastMessage(): void {
      this.isVisibleToastMessage = true
    },
    hideToastMessage(): void {
      this.isVisibleToastMessage = false
    },
    pushAlarmData(data: Array<any>): void {
      for (let item of data) {
        if (item.readDate == null) {
          this.pushUnreadAlarmData(item)
        } else {
          this.pushReadAlarmData(item)
        }
      }

      const compareFunction = (prev: any, next: any) => {
        const prevCreatedDate = new Date(prev.createdDate)
        const nextCreatedDate = new Date(next.createdDate)

        if (prevCreatedDate > nextCreatedDate) {
          return -1
        } else if (prevCreatedDate < nextCreatedDate) {
          return 1
        } else {
          return 0
        }
      }

      this.unreadAlarmList = this.unreadAlarmList.sort(compareFunction)
      this.readAlarmList = this.readAlarmList.sort(compareFunction)
    },
    pushUnreadAlarmData(data: any): void {
      data.createdDate = new Date(data.createdDate).format('YYYY-MM-DD HH:mm:ss')

      this.unreadAlarmList.push(data)
    },
    pushReadAlarmData(data: any): void {
      data.readDate = new Date(data.readDate).format('YYYY-MM-DD HH:mm:ss')

      this.readAlarmList.push(data)
    }
  }
})
