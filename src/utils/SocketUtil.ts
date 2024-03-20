import { App } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAlarmStore } from '@/stores/common/AlarmStore'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import IndexedDBUtil from '@/utils/IndexedDBUtil'
import globalProperties from '@/main'

import type { IModalData, ISocketUtil } from '@/types/types'

class SocketUtil implements ISocketUtil {
  constructor() {
    const token = LocalStorageUtil.getJwtToken()

    if (token) {
      this.connect()
    }
  }

  socket!: Socket

  /**
   * Server Socket에 연결한다.
   */
  connect(): void {
    let url: string = ''

    if (import.meta.env.VITE_NODE_ENV == 'production') {
      url = import.meta.env.VITE_API_URL
    } else {
      url = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`
    }

    if (this.socket && this.socket.connected) {
      return
    }

    this.socket = io(url, { auth: { token: LocalStorageUtil.getJwtToken() } })

    this.socket.on('connect', () => {
      const token = LocalStorageUtil.getJwtToken()

      if (token) {
        this.socket.emit('updateSocketId', { socketId: this.socket.id })
      }
    })

    this.socket.on('forceLogout', (): void => {
      const modalData = {
        bodyLocaleKey: 'ForceLogoutMessage',
        isVisibleCloseButton: false,
        buttonItems: [
          {
            color: 'primary',
            localeKey: 'Confirmation',
            callback: async (): Promise<void> => {
              IndexedDBUtil.clearAllData()
              LocalStorageUtil.clearLocalStorage()

              this.socket.disconnect()

              const location = window.location
              window.location.href = `${location.origin}/#/Login`
            }
          }
        ]
      } as IModalData

      globalProperties.$modal.show(modalData)
    })

    this.socket.on('systemConfigurationOnUpdate', (systemConfiguration: any): void => {
      if (systemConfiguration && Object.keys(systemConfiguration).length > 0) {
        LocalStorageUtil.setDefaultDateRange(systemConfiguration.defaultDateRange)
        LocalStorageUtil.setUseMultiFactorAuthentication(
          systemConfiguration.useMultiFactorAuthentication
        )
      }
    })

    this.socket.on('notifySystemStatus', (alarmData: any): void => {
      if (alarmData) {
        const store = useAlarmStore()
        store.pushAlarmData(alarmData)

        store.showToastMessage()
      }
    })
  }

  /**
   * Socket ID를 반환한다.
   * @returns {string} Socket ID.
   */
  getSocketId(): string {
    return this.socket.id
  }

  disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect()
    }
  }
}

export default {
  install: (app: App): void => {
    app.config.globalProperties.$socket = new SocketUtil()
  }
}
