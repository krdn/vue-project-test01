import { App } from 'vue'
import moment from 'moment'
import globalProperties from '@/main'

import type { IModalData, IValidationUtil } from '@/types/types'

class ValidationUtil implements IValidationUtil {
  constructor() {}

  searchCriteriaIsNotNull(...args: any[]): boolean {
    let result = true

    for (let item of args) {
      if (item == null || item == undefined) {
        result = false

        break
      }
    }

    if (!result) {
      globalProperties.$modal.show(this.createModalData('SearchCriteriaCannotNull'))
    }

    return result
  }

  checkIfValidDatePeriod(startDate: Date | null, endDate: Date | null) {
    if (startDate == null && endDate == null) {
      globalProperties.$modal.show(this.createModalData('RequiredBothDates'))

      return false
    }

    if (startDate == null || endDate == null) {
      globalProperties.$modal.show(this.createModalData('RequiredBothDates'))

      return false
    }

    return this.greaterThanStartDate(startDate, endDate)
  }

  atleastOneSearchCriterias(...args: any[]): boolean {
    let result = false

    for (let item of args) {
      if (item != null && item != undefined && item != '') {
        result = true

        break
      }
    }

    if (!result) {
      globalProperties.$modal.show(this.createModalData('AtleastOneSearchCriterias'))
    }

    return result
  }

  greaterThanStartDate(startDate: Date, endDate: Date): boolean {
    let start = moment(startDate)
    let end = moment(endDate)
    let result = end.isSameOrAfter(start)

    if (!result) {
      globalProperties.$modal.show(this.createModalData('GreaterThanStartDate'))
    }

    return result
  }

  periodOutOfRange(startDate: Date, endDate: Date, range: number): boolean {
    let start = moment(startDate)
    let end = moment(endDate)
    let period = moment.duration(end.diff(start)).asDays()
    let result = Math.floor(period) <= range

    if (!result) {
      globalProperties.$modal.show(this.createModalData('PeriodOutOfRangeOfDays', { range: range }))
    }

    return result
  }

  periodOutOfRangeOfMonths(startDate: Date, endDate: Date, range: number): boolean {
    let start = moment(startDate)
    let period = start.add(range, 'months').add(1, 'days').format('YYYY-MM-DD')
    let result = endDate < new Date(period)

    if (!result) {
      globalProperties.$modal.show(
        this.createModalData('PeriodOutOfRangeOfMonths', { range: range })
      )
    }

    return result
  }

  requiredFieldIsNotNull(...args: any[]): boolean {
    let result = true

    for (let item of args) {
      if (item == null || item == undefined || item == '') {
        result = false

        break
      }
    }

    if (!result) {
      globalProperties.$modal.show(this.createModalData('RequiredFieldCannotNull'))
    }

    return result
  }

  searchPanelRequiresQueryStatement(condition: string): boolean {
    let result = true

    const regex = new RegExp(
      /^\w+\s*(?:=\s*|!=\s*)'[\w\d.]+'(?:\s+(?:and|or)\s+\w+\s*(?:=\s*|!=\s*)'[\w\d.]+'(?:\s+(?:and|or)\s+\w+\s*(?:=\s*|!=\s*)'[\w\d.]+')*)*\s*$/gimu
    )

    if (!regex.test(condition)) {
      result = false
    }

    if (!result) {
      globalProperties.$modal.show(this.createModalData('SearchPanelRequiresQueryStatement'))
    }

    return result
  }

  private createModalData(localeKey: string, messageParameters?: Object): IModalData {
    const modalData = {
      bodyLocaleKey: localeKey,
      messageParameters: messageParameters
    }

    return modalData
  }
}

export default {
  install: (app: App) => {
    app.config.globalProperties.$validationUtil = new ValidationUtil()
  }
}
