import moment from 'moment'

declare global {
  interface DateConstructor {
    today(): Date
  }

  interface Date {
    format(optFormat?: string): string
  }
}

/**
 * 오늘 날짜를 반환한다. (YYYY-MM-DD HH:mm:ss)
 * @returns Date
 */
Date.today = (): Date => {
  return new Date(moment().format('YYYY-MM-DD HH:mm:ss'))
}

/**
 * Return Formatted Date String.
 * @param {string} [optFormat] Moment Date Format. Default: YYYY-MM-DD. ex) YYYY-MM-DD hh:mm:ss.
 * @returns Return Formatted Date String.
 */
Date.prototype.format = function (optFormat?: string): string {
  if (!optFormat) {
    optFormat = 'YYYY-MM-DD'
  }

  return moment(this).format(optFormat)
}
