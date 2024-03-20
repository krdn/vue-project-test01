<template>
  <CommonIcon
    :class="{ 'clickable-icon': clickable }"
    v-if="isRender"
    :icon="icon"
    :color="color"
    :width="width"
    :height="height"
    @click="iconOnClick"
  ></CommonIcon>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import CommonIcon from '@/components/common/CommonIcon.vue'

import type { VNode } from 'vue'

@Options({
  props: {
    params: { type: Object as () => any, required: true },
    components: { CommonIcon }
  },
  emits: {}
})
export default class CommonIconInGrid extends Vue {
  params!: any
  component: VNode | null = null

  icon: string = ''
  isRender: boolean = false
  clickable?: boolean
  color?: string | null = null
  width?: number | null = null
  height?: number | null = null

  created() {
    this.icon = this.params.icon
    this.isRender = this.params.isRender
    this.clickable = this.params.clickable
    this.color = this.params.color
    this.width = this.params.width
    this.height = this.params.height
  }

  iconOnClick(e: Event): void {
    if (this.clickable && this.params.context) {
      const parentComponent = this.params.context.parentComponent

      if (parentComponent && typeof parentComponent[`${this.icon}OnClick`] == 'function') {
        parentComponent[`${this.icon}OnClick`].call(this, this.params)
      }
    }
  }
}
</script>
