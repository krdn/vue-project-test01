<template>
  <router-view />
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'

export default class GlobalIntelligence extends Base {
  mounted(): void {
    this.$router.push({ name: 'MitreAttackMain' })
  }
}
</script>
