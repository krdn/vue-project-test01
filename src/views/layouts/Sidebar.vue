<template>
  <div class="sidebar sidebar-fixed custom-side-bar">
    <div class="sidebar-brand">
      <!-- <div class="sidebar-hambuger">
        <span></span>
        <span></span>
        <span></span>
      </div> -->
      <div class="sidebar-logo"></div>
    </div>

    <Menu></Menu>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import Menu from '@/views/layouts/Menu.vue'

@Options({
  components: { Menu }
})
export default class Sidebar extends Base {}
</script>
