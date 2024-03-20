<template>
  <CIcon :icon="icon" :size="size"></CIcon>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

@Options({
  props: {
    params: { type: Object as () => any, required: true }
  }
})
export default class CIconInGrid extends Vue {
  params!: any

  icon: string = ''
  size: string = 'sm'

  created() {
    this.icon = this.params.icon

    if (this.params.size) {
      this.size = this.params.size
    }
  }
}
</script>
