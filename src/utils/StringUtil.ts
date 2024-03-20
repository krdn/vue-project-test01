import { App } from 'vue'
import { IStringUtil } from '@/types/types'

class StringUtil implements IStringUtil {
  constructor() {}

  /**
   * HTML Checked Mark Entity를 반환한다.
   * @param checked Check 여부.
   * @returns {string} HTML Checked Mark Entity.
   */
  getCheckedMarkHtmlEntity(checked: boolean): string {
    if (checked) {
      return '&#10003;'
    }

    return ''
  }
}

export default {
  install: (app: App) => {
    app.config.globalProperties.$stringUtil = new StringUtil()
  }
}
