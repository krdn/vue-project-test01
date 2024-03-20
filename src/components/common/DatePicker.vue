<template>
  <CDatePicker
    ref="datePicker"
    :placeholder="props.placeholder"
    v-model:date="props.modelValue"
    :disabledDates="props.disabledDates"
    :maxDate="props.maxDate"
    :minDate="props.minDate"
    :locale="localeAbbrevation"
    :inputDateParse="(input: string) => parseDate(input)"
    :inputDateFormat="(input: string) => formatDate(input)"
    :firstDayOfWeek="0"
    :todayButtonSize="props.todayButtonSize"
    :confirmButtonSize="props.confirmButtonSize"
    :cancelButtonSize="props.cancelButtonSize"
    @update:date="(selectedDate: Date) => $emit('update:modelValue', selectedDate)"
  >
  </CDatePicker>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { format, parse } from 'date-fns'

@Options({
  props: {
    todayButton: { default: 'today' },
    todayButtonSize: { type: String, default: 'xs' },

    cancelButton: { default: 'Cancel' },
    cancelButtonColor: { type: String, default: 'primary' },
    cancelButtonSize: { type: String, default: 'xs' },
    cancelButtonVariant: { type: String, default: 'ghost' },
    cleaner: { type: Boolean, default: true },
    confirmButton: { default: 'OK' },
    confirmButtonColor: { type: String, default: 'primary' },
    confirmButtonSize: { type: String, default: 'xs' },
    confirmButtonVariant: { type: String, default: 'ghost' },

    modelValue: { default: null },
    placeholder: { type: String, default: null },
    disabledDates: { type: Object as () => Array<any>, default: [] },
    maxDate: { type: Date, default: () => Date.today() },
    minDate: { type: Date, default: null }
  },
  emits: ['update:modelValue']
})
export default class DatePicker extends Vue {
  props: any = {}

  get locale() {
    return this.$i18n.locale
  }

  get localeAbbrevation() {
    if (this.locale == 'ko') {
      return 'ko-KR'
    }

    return 'en-US'
  }

  get dateFormat() {
    if (this.locale == 'ko') {
      return 'yyyy-MM-dd'
    }

    return 'MM/dd/yyyy'
  }

  mounted() {
    // this.props = Object.assign(this.props, this.$props);

    const inputElement = (this.$refs.datePicker as any).$el.nextElementSibling.querySelector(
      'input.form-control.date-picker-input'
    ) as HTMLInputElement
    inputElement.addEventListener('keyup', (e: KeyboardEvent) => {
      if (inputElement.value.length == 0) {
        this.props.modelValue = null

        this.$emit('update:modelValue', null)
      }
    })
  }

  parseDate(input: string) {
    if (input.length == this.dateFormat.length) {
      return parse(input, this.dateFormat, Date.today())
    }

    return false
  }

  formatDate(input: string) {
    return format(new Date(input), this.dateFormat)
  }
}
</script>
