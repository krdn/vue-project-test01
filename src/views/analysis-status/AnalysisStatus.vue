<template>
  <router-view />
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'

export default class AnalysisStatus extends Base {
  mounted(): void {
    const componentName = this.$router.currentRoute.value.name

    if (componentName == 'AnalysisStatus') {
      this.$router.push({ name: 'SqlInjection' })
    }
  }
}
</script>
