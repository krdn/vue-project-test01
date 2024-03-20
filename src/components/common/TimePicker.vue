<template>
  <CTimePicker
    inputReadOnly
    time="00:00:00 AM"
    locale="en-US"
    @update:time="(selectedTime: string) => $emit('update:modelValue', selectedTime)"
  ></CTimePicker>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  emits: ['update:modelValue']
})
export default class TimePicker extends Vue {}
</script>
