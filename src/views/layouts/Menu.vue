<template>
  <component :is="component" :locale="locale" ref="menu"></component>
</template>

<script lang="ts">
import { h } from 'vue'
import { Options, Base } from '@/base-component/Base'
import CommonIcon from '@/components/common/CommonIcon.vue'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

import type { VNode } from 'vue'

@Options({
  components: {
    CommonIcon
  }
})
export default class Menu extends Base {
  menuItems: any = ''
  component: VNode | null = null

  get locale(): string {
    return this.$i18n.locale
  }

  created(): void {
    this.menuItems = LocalStorageUtil.getMenuItems()
    this.component = h(
      'ul',
      { class: 'sidebar-nav' },
      {
        default: () =>
          this.menuItems.map((item: any, index: number) => this.renderItem(item, index))
      }
    )
  }

  beforeUpdate(): void {
    this.component = h(
      'ul',
      { class: 'sidebar-nav' },
      {
        default: () =>
          this.menuItems.map((item: any, index: number) => this.renderItem(item, index))
      }
    )
  }

  renderItem(item: any, itemIndex: number, parentId?: string) {
    let menuId = ''

    if (parentId) {
      menuId = `${parentId}-${itemIndex}`
    } else {
      menuId = `menu-${itemIndex}`
    }

    if (item.visible && item.canView) {
      return h(
        'li',
        { class: 'nav-item', id: menuId },
        {
          default: () => {
            const components = []
            const clickFunction =
              item.name == 'DownloadManual' ? this.downloadManual : this.menuOnClick

            components.push(
              h(
                'a',
                {
                  class: 'nav-link',
                  'aria-current': 'page',
                  'comp-name': item.name,
                  'both-active': parentId,
                  href: item.to ? `#${item.to}` : 'javascript: void(0);',
                  onClick: clickFunction
                },
                {
                  default: () => {
                    const menuContents = []

                    if (item.icon) {
                      menuContents.push(h(CommonIcon, { width: 25, height: 25, icon: item.icon }))
                    }

                    menuContents.push(this.$t(item.name))

                    return menuContents
                  }
                }
              )
            )

            if (item.items) {
              const className = `level-${menuId.split('-').length}-menu-list`

              components.push(
                h(
                  'ul',
                  { class: className },
                  {
                    default: () =>
                      item.items.map((child: any, childItemIndex: number) =>
                        this.renderItem(child, childItemIndex, menuId)
                      )
                  }
                )
              )
            }

            return components
          }
        }
      )
    }
  }

  menuOnClick(e: any) {
    if (e.target.classList.contains('active')) {
      e.preventDefault()
      e.stopPropagation()

      return
    }
  }

  async downloadManual(): Promise<void> {
    const data = await this.$http.downloadFile('/manual/downloadManual')
    const url = window.URL.createObjectURL(data.blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'DTI.ai Manual.pdf')
    a.click()
    a.remove()
  }
}
</script>
