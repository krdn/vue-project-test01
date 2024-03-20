import { App } from 'vue'
import moment from 'moment'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import globalProperties from '@/main'

import type { IMomentUtil, IModalData, TDefaultDateRange } from '@/types/types'
import type { DurationInputArg2 } from 'moment'

class MomentUtil implements IMomentUtil {
  constructor() {}

  getDefaultDateRange(): TDefaultDateRange {
    const defaultDateRange = LocalStorageUtil.getDefaultDateRange()

    if (!defaultDateRange) {
      const modalData = {
        bodyLocaleKey: 'AuthorizeException',
        closeCallBack: () => {
          LocalStorageUtil.clearLocalStorage()
          window.location.href = `${window.location.origin}/#/Login`
        }
      } as IModalData

      globalProperties.$modal.show(modalData)
    }

    const standard = Date.today()
    const parts = (defaultDateRange as string).split(' ') as Array<string>
    const startDate = moment(standard)
      .add(parseInt(parts[0]) * -1, parts[1] as DurationInputArg2)
      .add(1, 'days')
      .format('YYYY-MM-DD')
    const endDate = moment(standard).format('YYYY-MM-DD')

    return { startDate: startDate, endDate: endDate }
  }

  /**
   * Data를 DateTime Format으로 변환한다.
   * @param date Format이 필요한 Date.
   * @returns {string} Formatted Date String.
   */
  getFormattedDateTime(date?: Date | string): string {
    if (!date) {
      return ''
    }

    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * Data를 Date Format으로 변환한다.
   * @param date Format이 필요한 Date.
   * @returns {string} Formatted Date String.
   */
  getFormattedDate(date?: Date | string): string {
    if (!date) {
      return ''
    }

    return moment(date).format('YYYY-MM-DD')
  }

  add(
    date: Date | string,
    digit: number,
    unit: moment.unitOfTime.DurationConstructor
  ): moment.Moment {
    return moment(date).add(digit, unit).add(1, 'days')
  }
}

export default {
  install: (app: App) => {
    const momentUtil = new MomentUtil()

    app.config.globalProperties.$moment = moment
    app.config.globalProperties.$momentUtil = momentUtil
  }
}
