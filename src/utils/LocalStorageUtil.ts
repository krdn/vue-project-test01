import {
  JWT_TOKEN,
  REFRESH_TOKEN,
  DEFAULT_DATE_RANGE,
  USE_MULTI_FACTOR_AUTHENTICATION
} from '@/../constant/constant'
import { ILocalStorageUtil } from '@/types/types'

class LocalStorageUtil implements ILocalStorageUtil {
  constructor() {}

  // getter
  /**
   * LocalStorage에 저장된 Json Web Token을 반환한다.
   * @returns {string|null} Json Web Token.
   */
  getJwtToken(): string | null {
    return window.localStorage.getItem(JWT_TOKEN)
  }

  /**
   * LocalStorage에 저장된 Refresh Token을 반환한다.
   * @returns {string|null} Refresh Token.
   */
  getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN)
  }

  /**
   * LocalStorage에 저장된 Json Web Token, Refresh Token을 반환한다.
   * @returns {Object} Json Web Token, Refresh Token.
   */
  getBothToken(): object {
    return { jwtToken: this.getJwtToken(), refreshToken: this.getRefreshToken() }
  }

  getDefaultDateRange(): string | null {
    const data = window.localStorage.getItem(DEFAULT_DATE_RANGE)

    if (data) {
      return data
    }

    return null
  }

  getUseMultiFactorAuthentication(): boolean {
    return window.localStorage.getItem(USE_MULTI_FACTOR_AUTHENTICATION) == 'true'
  }

  // setter
  /**
   * LocalStorage에 Json Web Token을 Write한다.
   * @param jwtToken Json Web Token.
   */
  setJwtToken(jwtToken: string): void {
    window.localStorage.setItem(JWT_TOKEN, jwtToken)
  }

  /**
   * LocalStorage에 Refresh Token을 Write한다.
   * @param refreshToken Refresh Token.
   */
  setRefreshToken(refreshToken: string): void {
    window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }

  /**
   * LocalStorage에 Json Web Token, Refresh Token을 Write한다.
   * @param jwtToken Json Web Token.
   * @param refreshToken Refresh Token.
   */
  setBothToken(jwtToken: string, refreshToken: string): void {
    this.setJwtToken(jwtToken)
    this.setRefreshToken(refreshToken)
  }

  setDefaultDateRange(defaultDateRange: string): void {
    window.localStorage.setItem(DEFAULT_DATE_RANGE, defaultDateRange)
  }

  setUseMultiFactorAuthentication(useMultiFactorAuthentication: boolean): void {
    window.localStorage.setItem(
      USE_MULTI_FACTOR_AUTHENTICATION,
      useMultiFactorAuthentication.toString()
    )
  }

  // remove
  /**
   * LocalStorage에서 Json Web Token을 삭제한다.
   */
  removeJwtToken(): void {
    window.localStorage.removeItem(JWT_TOKEN)
  }

  /**
   * LocalStorage에서 Refresh Token을 삭제한다.
   */
  removeRefreshToken(): void {
    window.localStorage.removeItem(REFRESH_TOKEN)
  }

  removeDefaultDateRange(): void {
    window.localStorage.removeItem(DEFAULT_DATE_RANGE)
  }

  removeUseMultiFactorAuthentication(): void {
    window.localStorage.removeItem(USE_MULTI_FACTOR_AUTHENTICATION)
  }

  /**
   * LocalStorage에서 Json Web Token, Refresh Token을 삭제한다.
   */
  removeBothToken(): void {
    this.removeJwtToken()
    this.removeRefreshToken()
  }

  /**
   * LocalStorage를 초기화한다.
   */
  clearLocalStorage(): void {
    window.localStorage.clear()
  }

  /**
   * 개발용도로 사용되는 함수입니다.
   * Production mode에서는 사용해도 아무 기능을 하지 않습니다.
   * @param menuItems
   */
  setMenuItems(menuItems: Array<any>): void {
    if (import.meta.env.NODE_ENV != 'production') {
      menuItems.push({
        component: 'settings/query/Query',
        name: 'Query',
        to: '/Query',
        icon: 'management',
        class: undefined,
        visible: true,
        canView: true,
        items: [
          {
            component: 'settings/query/QueryItems',
            name: 'QueryItems',
            to: '/Query/QueryItems',
            visible: true,
            canView: true
          },
          {
            component: 'settings/query/NewQuery',
            name: 'NewQuery',
            to: '/Query/NewQuery',
            visible: false,
            canView: true
          },
          {
            component: 'settings/query/EditQuery',
            name: 'EditQuery',
            to: '/Query/EditQuery/:id',
            visible: false,
            canView: true
          }
        ]
      })
    }

    window.localStorage.setItem('menuItems', JSON.stringify(menuItems))
  }

  /**
   * 개발용도로 사용되는 함수입니다.
   * Production mode에서는 사용해도 아무 기능을 하지 않습니다.
   */
  getMenuItems(): Array<any> {
    const menuItems = window.localStorage.getItem('menuItems')

    if (menuItems) {
      return JSON.parse(menuItems)
    }

    return []
  }
}

export default new LocalStorageUtil()
