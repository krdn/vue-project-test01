import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/layouts/Layout.vue'
import LoginView from '@/views/LoginView.vue'
import FirstLogin from '@/views/FirstLogin.vue'
import MyInfo from '@/views/personal-info/MyInfo.vue'
import SystemInfo from '@/views/system-info/SystemInfo.vue'
import DeviceMonitoring from '@/views/system-info/DeviceMonitoring.vue'
import History from '@/views/personal-info/History.vue'
import XAIDetail from '@/views/xai/XAIDetail.vue'
import IndexedDBUtil from '@/utils/IndexedDBUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import globalProperties from '@/main'

import type { RouteRecordRaw, RouteRecordName } from 'vue-router';

const addRoute = (items: any, target: Array<RouteRecordRaw>) => {
  for (let menu of items) {
    if (menu.to && Array.isArray(target)) {
      const route = {
        path: menu.to,
        name: menu.name,
        meta: { default: false, canView: menu.canView },
        component: async () => {
          // console.log('menu.component:', `@@/views/${menu.component}.vue`)
          return import(`/src/views/${menu.component}.vue`)
          // return await import(`@/views/${menu.component}.vue`)

        }
      } as any

      target.push(route)

      if (menu.items && menu.items.length > 0) {
        route.children = []

        addRoute(menu.items, route.children)
      }
    }
  }
}

const createDefaultRouter = (): Array<RouteRecordRaw> => {
  const layout = {
    path: '/',
    name: 'Main',
    children: [],
    meta: { default: true, canView: true },
    component: Layout
  } as RouteRecordRaw
  const routeItems = [layout] as Array<RouteRecordRaw>

  layout.children?.push({
    path: '/MyInfo',
    name: 'MyInfo',
    meta: { default: true, canView: true },
    component: MyInfo
  })
  layout.children?.push({
    path: '/SystemInfo',
    name: 'SystemInfo',
    meta: { default: true, canView: true },
    component: SystemInfo
  })
  layout.children?.push({
    path: '/DeviceMonitoring',
    name: 'DeviceMonitoring',
    meta: { default: true, canView: true },
    component: DeviceMonitoring
  })
  layout.children?.push({
    path: '/History',
    name: 'History',
    meta: { default: true, canView: true },
    component: History
  })
  layout.children?.push({
    path: '/XAIDetail',
    name: 'XAIDetail',
    meta: { default: true, canView: true },
    component: XAIDetail
  })

  routeItems.push({
    path: '/Login',
    name: 'Login',
    meta: { default: true, canView: true },
    component: LoginView
  })
  routeItems.push({
    path: '/FirstLogin',
    name: 'FirstLogin',
    meta: { default: true, canView: true },
    component: FirstLogin
  })

  const menuItems = LocalStorageUtil.getMenuItems()

  if (menuItems && menuItems.length > 0) {
    addRoute(menuItems, layout.children as Array<RouteRecordRaw>)
  }

  if (import.meta.env.VITE_NODE_ENV != 'production') {
    layout.children?.push({
      path: '/Query',
      name: 'Query',
      meta: { default: true, canView: true },
      component: () => import('@/views/settings/query/Query.vue')
    })
    layout.children?.push({
      path: '/Query/QueryItems',
      name: 'QueryItems',
      meta: { default: true, canView: true },
      component: () => import('@/views/settings/query/QueryItems.vue')
    })
    layout.children?.push({
      path: '/Query/NewQuery',
      name: 'NewQuery',
      meta: { default: true, canView: true },
      component: () => import('@/views/settings/query/NewQuery.vue')
    })
    layout.children?.push({
      path: '/Query/EditQuery/:id',
      name: 'EditQuery',
      meta: { default: true, canView: true },
      component: () => import('@/views/settings/query/EditQuery.vue')
    })
  }

  return routeItems
}

console.log(import.meta.env.BASE_URL)

const routes: Array<RouteRecordRaw> = createDefaultRouter()
const router = createRouter({ history: createWebHashHistory(import.meta.env.BASE_URL), routes })

/**
 * 네비게이션 가드는 주로 탐색을 리디렉션하거나 취소하여, 탐색을 막는데 사용됩니다
 * https://router.vuejs.kr/guide/advanced/navigation-guards
 * @param to: 탐색 될 라우트 위치 객체
 * @param from: 탐색 전 현재 라우트 위치 객체
 * @param next: 다음 가드로 이동하기 위해 호출되는 함수 -> RFC를 문제(조심)
 * https://router.vuejs.kr/guide/advanced/navigation-guards#optional-third-argument-next
 */
router.beforeEach(async (to, from, next) => {
  const navigation = window.performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming

  if (to.name == 'Login') {
    next()
  } else if (
    import.meta.env.VITE_NODE_ENV == 'production' &&
    from.name != 'Login' &&
    (from.name == undefined || from.path == '/') &&
    (navigation.type == 'reload' || navigation.type == 'back_forward')
  ) {
    const userInfo = await IndexedDBUtil.getUser()

    if (userInfo) {
      await globalProperties.$http.postAsync('/user/logout', {
        userId: userInfo.userId,
        socketId: globalProperties.$socket.getSocketId()
      })
    }

    await IndexedDBUtil.clearAllData()
    LocalStorageUtil.clearLocalStorage()

    next({ name: 'Login' })
  } else {
    if (to.meta.canView) {
      const jwtToken = LocalStorageUtil.getJwtToken()

      if (jwtToken) {
        const menuElement = document.querySelector('.sidebar-nav')

        if (menuElement) {
          const selectedMenu = menuElement.querySelector(`[comp-name="${to.name as string}"]`)

          if (selectedMenu) {
            const prevSelectedMenuItems = menuElement.querySelectorAll('.nav-link.active')

            if (prevSelectedMenuItems) {
              prevSelectedMenuItems.forEach((item) => item.classList.remove('active'))
            }

            selectedMenu.classList.add('active')
            const bothActiveId = selectedMenu.getAttribute('both-active')

            if (bothActiveId) {
              menuElement
                .querySelector(`#${bothActiveId}`)
                ?.querySelector('.nav-link')
                ?.classList.add('active')
            }
          }
        }

        next()
      } else {
        const userInfo = await IndexedDBUtil.getUser()

        if (userInfo) {
          await globalProperties.$http.postAsync('/user/logout', {
            userId: userInfo.userId,
            socketId: globalProperties.$socket.getSocketId()
          })

          await IndexedDBUtil.clearAllData()
        }

        next({ name: 'Login' })
      }
    } else {
      // TODO: Show alert message 
      alert('Not Permission')

      if (from.name) {
        next({ name: from.name as RouteRecordName })
      } else {
        next({ name: 'Login' })
      }
    }
  }
})

export default router
