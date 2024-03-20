import { createI18n } from 'vue-i18n'
import ko from '@/locales/ko.json'
import en from '@/locales/en.json'

const i18n = createI18n({
  locale: 'ko',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    ko: ko,
    en: en
  }
})

export default i18n
