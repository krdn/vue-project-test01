<template>
  <router-view />
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'

export default class CollectStatus extends Base {
  mounted(): void {
    const componentName = this.$router.currentRoute.value.name

    if (componentName == 'CollectStatus') {
      this.$router.push({ name: 'WebLogCollectStatusMain' })
    }
  }
}
</script>
