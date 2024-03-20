<template>
  <div class="auto-complete-wrapper" @click="onFocus" :style="style">
    <div :class="autoCompleteInputWrapperClassName">
      <label
        v-if="placeholder != ''"
        v-text="placeholder"
        :class="autoCompleteLabelClassName"
        @click="onFocus"
      ></label>
      <input
        type="text"
        autocomplete="off"
        v-model="searchPhrase"
        @keyup="autoCompleteOnKeyUp"
        @focus="autoCompleteOnFocus"
        @blur="autoCompleteOnBlur"
        ref="searchPhraseInput"
      />

      <svg :class="iconClass" viewBox="0 0 24 24" @click="onFocus">
        <path d="M7,10L12,15L17,10H7Z"></path>
      </svg>
    </div>

    <div :class="autoCompleteItemsWrapperClassName" v-if="items.length > 0">
      <ul ref="selectItems">
        <li v-for="item of items" v-html="item" @mousedown="itemOnMouseDown"></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import type { PropType } from 'vue'

@Options({
  props: {
    placeholder: { type: String, default: '' },
    width: { type: String, default: '150px' },
    position: { type: String as PropType<'left' | 'right'>, default: 'left' },
    dataItems: { type: Object as () => Array<string>, required: true, default: [] },
    modelValue: { type: String, required: true, default: '' }
  },
  emits: ['update:modelValue']
})
export default class AutoComplete extends Vue {
  placeholder!: string
  width!: string
  position!: string
  dataItems!: Array<string>
  modelValue!: string
  iconClass: string = 'caret-icon'

  searchPhrase: string = ''
  items: Array<string> = []
  style: any = { width: null }
  autoCompleteInputWrapperClassName: string = 'auto-complete-input-wrapper'
  autoCompleteLabelClassName: string = 'auto-complete-label'
  autoCompleteItemsWrapperClassName: string = 'auto-complete-items-wrapper left'

  created() {
    this.style.width = this.width
    this.items = Array.from(this.dataItems)
  }

  autoCompleteOnFocus(e: Event) {
    this.autoCompleteInputWrapperClassName = 'auto-complete-input-wrapper active'

    if (this.items.length > 0) {
      this.autoCompleteItemsWrapperClassName = `auto-complete-items-wrapper ${this.position} active`
    }

    this.autoCompleteLabelClassName = 'auto-complete-label active'
    this.iconClass = 'caret-icon open'

    // this.clearHighlight();
    this.queryData()
  }

  autoCompleteOnBlur(e: Event) {
    this.autoCompleteInputWrapperClassName = 'auto-complete-input-wrapper'

    if (this.items.length > 0) {
      this.autoCompleteItemsWrapperClassName = `auto-complete-items-wrapper ${this.position}`
    }

    this.iconClass = 'caret-icon'

    if (this.searchPhrase.length > 0) {
      this.autoCompleteLabelClassName = 'auto-complete-label active has-data'
    } else {
      this.autoCompleteLabelClassName = 'auto-complete-label'
    }

    this.clearHighlight()
  }

  autoCompleteOnKeyUp(e: KeyboardEvent): void {
    let opened = false

    if (
      this.items.length > 0 &&
      this.autoCompleteItemsWrapperClassName == `auto-complete-items-wrapper ${this.position}`
    ) {
      this.autoCompleteItemsWrapperClassName = `auto-complete-items-wrapper ${this.position} active`
      this.iconClass = 'caret-icon open'

      opened = true
    }

    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
      this.selectListItem(e.key)
    } else if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
    } else if (e.key == 'Enter') {
      const selectedItem = this.getSelectedItem()

      if (selectedItem) {
        this.searchPhrase = selectedItem.innerText
        this.$emit('update:modelValue', this.searchPhrase)

        if (!opened && this.items.length > 0) {
          this.autoCompleteItemsWrapperClassName = `auto-complete-items-wrapper ${this.position}`
          this.iconClass = 'caret-icon'
        }

        this.queryData()

        setTimeout(() => {
          this.clearHighlight(selectedItem.innerText)
        })
      }
    } else {
      if (this.dataItems.length > 0) {
        this.items = this.dataItems
          .filter((item) => item.indexOf(this.searchPhrase) > -1)
          .map((item) => {
            return item.replace(
              this.searchPhrase,
              `<span class="highlight">${this.searchPhrase}</span>`
            )
          })

        if (this.items.length == 0) {
          this.items = ['<span>No Data.</span>']
        }
      }

      this.$emit('update:modelValue', this.searchPhrase)
    }
  }

  itemOnMouseDown(e: Event): void {
    const element = e.target as HTMLLIElement

    if (element.innerText == 'No Data.') {
      e.preventDefault()
      e.stopPropagation()

      return
    }

    const selectedItem = this.getSelectedItem()

    if (selectedItem) {
      selectedItem.classList.remove('selected')
    }

    element.classList.add('selected')
    this.searchPhrase = element.innerText

    if (this.items.length > 0) {
      this.autoCompleteItemsWrapperClassName = `auto-complete-items-wrapper ${this.position}`
    }

    this.$emit('update:modelValue', this.searchPhrase)
  }

  onFocus(e: Event) {
    ;(this.$refs.searchPhraseInput as HTMLInputElement).focus()

    e.preventDefault()
    e.stopPropagation()
  }

  private selectListItem(key: string): void {
    if (this.items.length > 0) {
      const elements = (this.$refs.selectItems as HTMLUListElement).getElementsByTagName('li')
      let target: HTMLLIElement | null = null

      if (elements.length == 1 && elements[0].innerText == 'No Data.') {
        return
      }

      for (const element of elements) {
        if (element.classList.contains('selected')) {
          target = element
          target.classList.remove('selected')

          break
        }
      }

      if (key == 'ArrowUp') {
        if (target == null) {
          target = elements[elements.length - 1]
          target.classList.add('selected')
        } else {
          let prevElement =
            target.previousElementSibling == null
              ? elements[elements.length - 1]
              : target.previousElementSibling
          prevElement.classList.add('selected')
        }
      } else {
        if (target == null) {
          target = elements[0]
          target.classList.add('selected')
        } else {
          let nextElement =
            target.nextElementSibling == null ? elements[0] : target.nextElementSibling
          nextElement.classList.add('selected')
        }
      }
    }
  }

  private getSelectedItem(): HTMLLIElement | null {
    if (this.items.length > 0) {
      const elements = (this.$refs.selectItems as HTMLUListElement).getElementsByTagName('li')
      let selectedItem: HTMLLIElement | null = null

      for (const element of elements) {
        if (element.classList.contains('selected')) {
          selectedItem = element

          break
        }
      }

      return selectedItem
    }

    return null
  }

  private clearHighlight(optSelectedItemText?: string): void {
    if (this.items.length > 0) {
      const elements = (this.$refs.selectItems as HTMLUListElement).getElementsByTagName('li')

      for (const element of elements) {
        const innerText = element.innerText

        element.innerHTML = ''
        element.innerText = innerText

        if (optSelectedItemText && optSelectedItemText == innerText) {
          element.classList.add('selected')
        }
      }
    }
  }

  private queryData(): void {
    if (this.searchPhrase.length > 0 && this.dataItems.length > 0) {
      this.items = this.dataItems
        .filter((item) => item.indexOf(this.searchPhrase) > -1)
        .map((item) => {
          return item.replace(
            this.searchPhrase,
            `<span class="highlight">${this.searchPhrase}</span>`
          )
        })
    }
  }
}
</script>
