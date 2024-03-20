class IndexedDBUtil {
  constructor() {
    this.createIndexedDB()
  }

  existIndexedDB = false

  /**
   * Indexed DB에 사용자 정보를 insert한다.
   * @param userInfo 사용자 정보.
   * @returns {string} Status Message.
   */
  insertUser = (userInfo: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB.open('DTIAI')

      indexedDB.addEventListener('success', (e) => {
        const database = indexedDB.result
        const transaction = database.transaction(['User'], 'readwrite')

        transaction.addEventListener('error', (e) => {
          reject(e)
        })

        const store = transaction.objectStore('User')
        const request = store.put({
          id: 1,
          userId: userInfo.userId,
          userName: userInfo.userName,
          email: userInfo.email,
          phone: userInfo.phone,
          role: userInfo.roleName,
          lastLoginDate: userInfo.lastLoginDate,
          active: userInfo.active
        })

        request.addEventListener('success', (e) => {
          resolve('Complete')
        })
      })

      indexedDB.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  /**
   * User 정보를 반환한다.
   * @returns {Object} User Info.
   */
  getUser = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB.open('DTIAI')

      indexedDB.addEventListener('success', (e) => {
        const database = indexedDB.result
        const transaction = database.transaction(['User'], 'readwrite')

        transaction.addEventListener('error', (e) => {
          reject(e)
        })

        const store = transaction.objectStore('User')
        const request = store.get(1)

        request.addEventListener('success', (e: any) => {
          resolve(e.target.result)
        })
      })

      indexedDB.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  /**
   * Dashboard Data를 반환한다.
   * @param startDate Start Date of Search Criteria.
   * @param endDate End Date of Search Criteria.
   * @returns {Object} Dashboard Data.
   */
  getDashboardData = (startDate: string, endDate: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB.open('DTIAI')

      indexedDB.addEventListener('success', (e) => {
        const database = indexedDB.result
        const transaction = database.transaction(['Dashboard'], 'readwrite')

        transaction.addEventListener('error', (e) => {
          reject(e)
        })

        const store = transaction.objectStore('Dashboard')
        const request = store.get([startDate, endDate, 'Dashboard'])

        request.addEventListener('success', (e: any) => {
          resolve(e.target.result)
        })
      })

      indexedDB.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  /**
   * Dashboard Data를 Indexed DB에 저장한다.
   * @param dashboardData Dashboard Data.
   * @returns {string} Status Message.
   */
  insertDashboardData = (dashboardData: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB.open('DTIAI')

      indexedDB.addEventListener('success', (e) => {
        const database = indexedDB.result
        const transaction = database.transaction(['Dashboard'], 'readwrite')

        transaction.addEventListener('error', (e) => {
          reject(e)
        })

        const store = transaction.objectStore('Dashboard')
        const request = store.put(dashboardData)

        request.addEventListener('success', (e) => {
          resolve('Complete')
        })
      })

      indexedDB.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  insertMenu = (menuItems: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB.open('DTIAI')

      indexedDB.addEventListener('success', (e) => {
        const database = indexedDB.result
        const transaction = database.transaction(['Menu'], 'readwrite')

        transaction.addEventListener('error', (e) => {
          reject(e)
        })

        const store = transaction.objectStore('Menu')
        const request = store.put({ id: 1, menu: JSON.stringify(menuItems) })

        request.addEventListener('success', (e) => {
          resolve('Complete')
        })
      })

      indexedDB.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  getMenu = (): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB.open('DTIAI')

      indexedDB.addEventListener('success', (e) => {
        const database = indexedDB.result
        const transaction = database.transaction(['Menu'], 'readwrite')

        transaction.addEventListener('error', (e) => {
          reject(e)
        })

        const store = transaction.objectStore('Menu')
        const request = store.get(1)

        request.addEventListener('success', (e: any) => {
          if (e.target.result) {
            resolve(JSON.parse(e.target.result.menu))
          } else {
            resolve([])
          }
        })
      })

      indexedDB.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  /**
   * Indexed DB에 있는 모든 데이터를 삭제한다.
   */
  clearAllData = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB.open('DTIAI')

      indexedDB.addEventListener('success', (e) => {
        const database = indexedDB.result
        const storeNameItems = database.objectStoreNames

        for (let i = 0; i < storeNameItems.length; i++) {
          const transaction = database.transaction([storeNameItems[i]], 'readwrite')

          transaction.addEventListener('error', (e) => {
            reject(e)
          })

          const store = transaction.objectStore(storeNameItems[i])
          store.clear()
        }

        resolve()
      })

      indexedDB.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  /**
   * Indexed DB를 삭제한다.
   */
  remove = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase('DTIAI')

      request.addEventListener('success', (e) => {
        resolve()
      })

      request.addEventListener('error', (e) => {
        reject(e)
      })
    })
  }

  /**
   * Indexed DB를 생성한다.
   * @returns {string} Status Message.
   */
  private createIndexedDB = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      if (window.indexedDB) {
        const indexedDB = window.indexedDB.open(
          'DTIAI',
          parseInt(import.meta.env.VITE_INDEXED_DB_VERSION)
        )

        indexedDB.addEventListener('success', (e) => {
          this.existIndexedDB = true
        })

        indexedDB.addEventListener('upgradeneeded', (e) => {
          const database = indexedDB.result
          const storeCount = database.objectStoreNames.length

          for (let i = 0; i < storeCount; i++) {
            database.deleteObjectStore(database.objectStoreNames[0])
          }

          database.createObjectStore('User', { keyPath: 'id' })
          database.createObjectStore('Dashboard', { keyPath: ['startDate', 'endDate', 'target'] })
          database.createObjectStore('Menu', { keyPath: 'id' })

          this.existIndexedDB = true

          resolve('Done.')
        })

        indexedDB.addEventListener('error', (e) => {
          reject(e)
        })
      } else {
        reject('Browser does not support indexed databases.')
      }
    })
  }
}

export default new IndexedDBUtil()
