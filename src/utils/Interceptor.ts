import axios from 'axios'
import i18n from '@/i18n'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import IndexedDBUtil from './IndexedDBUtil'
import { useLoadingStore } from '@/stores/common/LoadingStore'

const LOGIN_URL: string = import.meta.env.VITE_LOGIN_URL
const REFRESH_TOKEN_URL: string = import.meta.env.VITE_REFRESH_TOKEN_URL
const FORCE_LOGOUT_URL: string = import.meta.env.VITE_FORCE_LOGOUT_URL

let lock: boolean = false
let callbackQueue: ((token: string) => void)[] = []
let baseURL: string = ''

if (import.meta.env.VITE_NODE_ENV == 'production') {
  baseURL = `${import.meta.env.VITE_API_URL}/api`
} else {
  baseURL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api`
}

// url 호출 시 기본 값 셋팅
const api = axios.create({ baseURL: baseURL, headers: { 'Content-Type': 'application/json' } })

// Request interceptor
api.interceptors.request.use((config: any) => {
  if (!config.headers) {
    return config
  }

  config.headers['X-Language'] = i18n.global.locale

  let token: string | null = null

  if (config.url == LOGIN_URL || config.url == FORCE_LOGOUT_URL) {
    // 로그인 또는 강제 로그아웃인 경우 토큰 정보를 확인하지 않음.
    return config
  } else if (config.url == REFRESH_TOKEN_URL) {
    // Token 갱신이 필요한 경우에는 refresh token값을 설정
    token = LocalStorageUtil.getRefreshToken()
  } else {
    token = LocalStorageUtil.getJwtToken()
  }

  const loadingStore = useLoadingStore()
  loadingStore.showLoading()

  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.config.url != REFRESH_TOKEN_URL && callbackQueue.length == 0) {
      const loadingStore = useLoadingStore()
      loadingStore.hideLoading()
    }

    return response
  },
  async (error) => {
    const loadingStore = useLoadingStore()

    if (!error.response) {
      loadingStore.hideLoading()

      return Promise.reject(error.message)
    }

    const config = error.config
    const status = error.response.status

    // Token 갱신을 실패한 경우 queue에 쌓여있는 모든 request를 중단한다.
    // 강제 로그아웃을 진행하고, 로그인 페이지로 redirect 한다.
    // 402 : Token이 사라진 경우, 강제 로그아웃을 진행한다.
    if (config.url == REFRESH_TOKEN_URL || status == 402) {
      callbackQueue = []

      setTimeout(() => {
        api
          .post(FORCE_LOGOUT_URL, config.data)
          .then(() => {
            alert(i18n.global.t('AuthorizeException'))

            LocalStorageUtil.clearLocalStorage()
            window.location.href = `${window.location.origin}/#/Login`
          })
          .catch((error) => {
            throw error
          })
      })

      return Promise.reject(error)
    }

    // 419: 토큰 재발급 코드로, 419 코드 에러가 에러로 취급하지 않는다.
    // 419 코드 에러 외 다른 에러가 발생했을 시 error를 반환한다.
    if (status != 419) {
      loadingStore.hideLoading()

      return Promise.reject(error)
    }

    if (lock) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          config.headers.Authorization = `Bearer ${token}`

          resolve(api(config))
        })
      })
    }

    lock = true
    const jwtToken = await getRefreshToken()

    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`
    }

    return api(config)
  }
)

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  callbackQueue.push(callback)
}

const executeCallbackQueue = (token: string): void => {
  let callback = callbackQueue.shift()

  while (typeof callback == 'function') {
    callback(token)

    callback = callbackQueue.shift()
  }
}

const getRefreshToken = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = await IndexedDBUtil.getUser().catch((error) => {
        console.log(error)
      })

      const {
        data: { jwtToken, refreshToken }
      } = await api.post(REFRESH_TOKEN_URL, { userId: userInfo.userId })

      lock = false

      executeCallbackQueue(jwtToken)

      LocalStorageUtil.setJwtToken(jwtToken)

      if (refreshToken) {
        LocalStorageUtil.setRefreshToken(refreshToken)
      }

      return resolve(jwtToken)
    } catch (e) {
      lock = false
      callbackQueue = []

      reject(e)
    }
  })
}

export default api
