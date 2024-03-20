<template>
  <router-view />
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'

export default class Management extends Base {
  mounted(): void {
    const componentName = this.$router.currentRoute.value.name

    if (componentName == 'Management') {
      this.$router.push({ name: 'UserManagementMain' })
    }
  }
}
</script>
