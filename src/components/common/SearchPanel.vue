<template>
  <div :class="wrapperClassName" ref="searchPanel">
    <div class="search-panel-header">
      <span>{{ $t('SearchCriterias') }}</span>
      <CButton
        class="condition-save-button btn-xs"
        color="light"
        variant="outline"
        @click="(e: Event) => $emit('save-on-click', e)"
        v-if="showButton"
      >
        {{ $t('SaveSearchCriterias') }}
      </CButton>
      <CButton class="close-button" @click="() => close()">
        <CommonIcon icon="close" :width="24" :height="24"></CommonIcon>
      </CButton>
    </div>
    <div :class="bodyClassName">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import type { PropType } from 'vue'
import type { TSearchPanelOptions, TSearchPanelAPI } from '@/types/types'

@Options({
  props: {
    options: {
      type: Object as PropType<TSearchPanelOptions>,
      default: { position: 'top left', direction: 'horizontal' } as TSearchPanelOptions
    },
    showButton: { type: Boolean, default: true }
  },
  emits: ['init', 'save-on-click']
})
export default class SearchPanel extends Vue {
  options!: TSearchPanelOptions
  showButton!: boolean
  wrapperClassName: string = 'search-panel-wrapper'
  bodyClassName: string | null = null
  api: TSearchPanelAPI = {
    open: () => {},
    close: () => {}
  }

  created(): void {
    this.api = {
      open: (e: Event) => {
        this.wrapperClassName = 'search-panel-wrapper before-active'

        setTimeout(() => {
          const element = e.target as HTMLElement
          const wrapper = this.$refs.searchPanel as HTMLDivElement
          const body = document.getElementsByTagName('body')[0]
          const offset = this.getWrapperOffset(element, wrapper, body)

          wrapper.style.top = `${offset.top}px`
          wrapper.style.left = `${offset.left}px`

          this.wrapperClassName = 'search-panel-wrapper active'
        })
      },
      close: this.close
    }

    this.bodyClassName = `search-panel-body ${this.options.direction}`
    this.$emit('init', this.api)
  }

  close(): void {
    this.wrapperClassName = 'search-panel-wrapper'
  }

  private getWrapperOffset(element: HTMLElement, wrapper: HTMLDivElement, body: HTMLBodyElement) {
    const offsetLeft = element.offsetLeft
    const offsetTop = element.offsetTop
    const bodyWidth = body.clientWidth
    const bodyHeight = body.clientHeight

    let wrapperOffsetLeft = 0
    let wrapperOffsetTop = 0

    switch (this.options.position) {
      case 'top left':
        wrapperOffsetTop = offsetTop - wrapper.clientHeight
        wrapperOffsetLeft = offsetLeft - wrapper.clientWidth + element.clientWidth

        if (wrapperOffsetTop < 0) {
          wrapperOffsetTop = offsetTop + element.clientHeight
        }

        if (wrapperOffsetLeft < 0) {
          wrapperOffsetLeft = offsetLeft
        }

        break
      case 'top right':
        wrapperOffsetTop = offsetTop - wrapper.clientHeight
        wrapperOffsetLeft = offsetLeft

        if (wrapperOffsetTop < 0) {
          wrapperOffsetTop = offsetTop + element.clientHeight
        }

        if (wrapperOffsetLeft + wrapper.clientWidth > bodyWidth) {
          wrapperOffsetLeft = offsetLeft - wrapper.clientWidth + element.clientWidth
        }

        break
      case 'bottom left':
        wrapperOffsetTop = offsetTop + element.clientHeight
        wrapperOffsetLeft = offsetLeft - wrapper.clientWidth + element.clientWidth

        if (wrapperOffsetTop > bodyHeight) {
          wrapperOffsetTop = offsetTop - wrapper.clientHeight
        }

        if (wrapperOffsetLeft < 0) {
          wrapperOffsetLeft = offsetLeft
        }

        break
      default:
        wrapperOffsetTop = offsetTop + element.clientHeight
        wrapperOffsetLeft = offsetLeft

        if (wrapperOffsetTop > bodyHeight) {
          wrapperOffsetTop = offsetTop - wrapper.clientHeight
        }

        if (wrapperOffsetLeft + wrapper.clientWidth > bodyWidth) {
          wrapperOffsetLeft = offsetLeft - wrapper.clientWidth + element.clientWidth
        }

        break
    }

    return { top: wrapperOffsetTop, left: wrapperOffsetLeft }
  }
}
</script>
