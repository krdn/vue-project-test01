<template>
  <CModal alignment="center" backdrop="static" :visible="store.getIsOpen">
    <CModalBody class="loading-spinner"> </CModalBody>
  </CModal>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { useLoadingStore } from '@/stores/common/LoadingStore'

export default class Loading extends Vue {
  store = useLoadingStore()
  visibleStaticBackdrop: boolean = false
}
</script>
