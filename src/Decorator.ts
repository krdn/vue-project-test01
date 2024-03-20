import { useStateStore } from '@/stores/component/StateStore'
import globalProperties from '@/main'
import 'reflect-metadata'

// Class, Method, Property 등 Decorator pattern을 활용해야 하는 경우 해당 함수를 참조해서 Decorator 함수를 생성할 수 있으니 참조 용도로 사용하세요.
function KeepData(target: any, propertyName: string) {
  setTimeout(() => {
    let stateName = globalProperties.$router.currentRoute.value.name as string

    if (!stateName) {
      const routeItems = globalProperties.$router.getRoutes()
      const target = window.location.hash.replace('#', '')

      for (let item of routeItems) {
        if (item.path == target) {
          stateName = item.name as string

          break
        }
      }
    }

    const store = useStateStore()
    store.addComponentState(stateName)

    const componentState = store.getComponentState(stateName)

    if (componentState != null) {
      componentState[propertyName] = null
    }
  })
}

export { KeepData }
