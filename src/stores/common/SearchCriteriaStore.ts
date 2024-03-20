import { defineStore } from 'pinia'

export const useSearchCriteriaStore = defineStore('useSearchCriteriaStore', {
  state: () => ({
    webLogSearchCriterias: [] as Array<any>,
    smtpLogSearchCriterias: [] as Array<any>,
    sqlInjectionSearchCriterias: [] as Array<any>,
    xssSearchCriterias: [] as Array<any>,
    unAuthorizedSearchCriterias: [] as Array<any>,
    insecureSearchCriterias: [] as Array<any>,
    forcefulSearchCriterias: [] as Array<any>,
    pathTraversalSearchCriterias: [] as Array<any>
  }),
  getters: {
    getWebLogSearchCriterias(state): Array<any> {
      return state.webLogSearchCriterias
    },
    getSmtpLogSearchCriterias(state): Array<any> {
      return state.smtpLogSearchCriterias
    },
    getSQLInjectionSearchCriterias(state): Array<any> {
      return state.sqlInjectionSearchCriterias
    },
    getXSSSearchCriterias(state): Array<any> {
      return state.xssSearchCriterias
    },
    getUnAuthorizedSearchCriterias(state): Array<any> {
      return state.unAuthorizedSearchCriterias
    },
    getInsecureSearchCriterias(state): Array<any> {
      return state.insecureSearchCriterias
    },
    getForcefulSearchCriterias(state): Array<any> {
      return state.forcefulSearchCriterias
    },
    getPathTraversalSearchCriterias(state): Array<any> {
      return state.pathTraversalSearchCriterias
    }
  },
  actions: {
    pushWebLogSearchCriterias(searchCriteria: any): void {
      if (this.webLogSearchCriterias.length == 5) {
        this.webLogSearchCriterias.shift()
      }

      this.webLogSearchCriterias.push(searchCriteria)
    },
    pushSmtpLogSearchCriterias(searchCriteria: any): void {
      if (this.smtpLogSearchCriterias.length == 5) {
        this.smtpLogSearchCriterias.shift()
      }

      this.smtpLogSearchCriterias.push(searchCriteria)
    },
    pushSQLInjectionSearchCriterias(searchCriteria: any): void {
      if (this.sqlInjectionSearchCriterias.length == 5) {
        this.sqlInjectionSearchCriterias.shift()
      }

      this.sqlInjectionSearchCriterias.push(searchCriteria)
    },
    pushXSSSearchCriterias(searchCriteria: any): void {
      if (this.xssSearchCriterias.length == 5) {
        this.xssSearchCriterias.shift()
      }

      this.xssSearchCriterias.push(searchCriteria)
    },
    pushUnAuthorizedSearchCriterias(searchCriteria: any): void {
      if (this.unAuthorizedSearchCriterias.length == 5) {
        this.unAuthorizedSearchCriterias.shift()
      }

      this.unAuthorizedSearchCriterias.push(searchCriteria)
    },
    pushInsecureSearchCriterias(searchCriteria: any): void {
      if (this.insecureSearchCriterias.length == 5) {
        this.insecureSearchCriterias.shift()
      }

      this.insecureSearchCriterias.push(searchCriteria)
    },
    pushForcefulSearchCriterias(searchCriteria: any): void {
      if (this.forcefulSearchCriterias.length == 5) {
        this.forcefulSearchCriterias.shift()
      }

      this.forcefulSearchCriterias.push(searchCriteria)
    },
    pushPathTraversalSearchCriterias(searchCriteria: any): void {
      if (this.pathTraversalSearchCriterias.length == 5) {
        this.pathTraversalSearchCriterias.shift()
      }

      this.pathTraversalSearchCriterias.push(searchCriteria)
    }
  }
})
