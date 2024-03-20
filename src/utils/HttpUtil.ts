import api from './Interceptor'
import { App } from 'vue'
import { IHttpUtil } from '@/types/types'
import { AxiosError } from 'axios'
import { useLoadingStore } from '@/stores/common/LoadingStore'

import globalProperties from '@/main'
import type { IModalData, ISocketUtil } from '@/types/types'
import { de } from 'date-fns/locale'

class HttpUtil implements IHttpUtil {
  constructor() {}

  /**
   * REST API Post 요청을 보낸다.
   * @param url REST API Url
   * @param data Payload
   * @returns {Promise<any>} Request Promise
   */
  post(
    url: string,
    data?: any,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<any> {
    const loadingStore = useLoadingStore()
    loadingStore.bypassLoading = bypassLoading ? true : false

    return api.post(url, data).catch((exception) => this.handleError(exception, bypassThrowError))
  }

  /**
   * REST API Post 요청을 보낸다.
   * @param url REST API Url
   * @param data Payload
   * @returns {string} JSON data
   */
  async postAsync<T = any>(
    url: string,
    data?: any,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<T> {
    const loadingStore = useLoadingStore()
    loadingStore.bypassLoading = bypassLoading ? true : false

    const response = await api
      .post(url, data)
      .catch((exception) => this.handleError(exception, bypassThrowError))

    return response.data as T
  }

  /**
   * REST API Post 요청을 보낸다.
   * File을 Upload하는 경우 사용한다.
   * @param url REST API Url
   * @param data Payload
   * @returns {string} JSON data
   */
  async postWithFileAsync<T = any>(
    url: string,
    data?: FormData,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<T> {
    const loadingStore = useLoadingStore()
    loadingStore.bypassLoading = bypassLoading ? true : false

    let options = undefined

    if (data) {
      options = { headers: { 'Content-Type': 'multipart/form-data' } }
    }

    const response = await api
      .post(url, data, options)
      .catch((exception) => this.handleError(exception, bypassThrowError))

    return response.data
  }

  async downloadFile(
    url: string,
    data?: any,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<any> {
    const loadingStore = useLoadingStore()
    loadingStore.bypassLoading = bypassLoading ? true : false

    const response = await api
      .post(url, data, { responseType: 'blob' })
      .catch((exception) => this.handleError(exception, bypassThrowError))

    if (response.data.error) {
      return response.data
    }

    const contentDisposition = response.headers['content-disposition'].split("''")
    const fileName = decodeURIComponent(contentDisposition[contentDisposition.length - 1])

    return { mimeType: response.headers['content-type'], fileName: fileName, blob: response.data }
  }

  private handleError(exception: any, bypassThrowError?: boolean | null) {
    // exception == "Network Error" : 서버가 죽었을 때 발생하는 오류
    if (exception == 'Network Error') {
      // alert("API 서버가 죽었습니다. 관리자에게 문의하세요.");
      this.popupCoreUiModal(exception, 'API 서버가 실행되지 않았습니다. 관리자에게 문의하세요.')
      throw exception
    }

    if (exception instanceof AxiosError) {
      // Status Code가 600 이상인 경우 known error.
      if (
        exception.response &&
        exception.response.status &&
        exception.response.status >= 600 &&
        bypassThrowError
      ) {
        return {
          data: { error: true, status: exception.response.status, ...exception.response.data },
          headers: exception.response.headers
        }
      }

      if (exception.response && exception.response.data.message) {
        //alert(exception.response.data.message);
        this.popupCoreUiModal(
          this.getExceptionTitle(exception),
          this.getExceptionMessage(exception)
        )
      } else if (exception.response && Object.keys(exception.response.data).length > 0) {
        const errorData = exception.response.data
        let message = ''

        for (let key in errorData) {
          message = message + `${key}: ${errorData[key]}\n`
        }

        this.popupCoreUiModal(
          this.getExceptionTitle(exception),
          this.getExceptionMessage(exception)
        )
        // alert(message);
      } else {
        alert(exception.response!.statusText)
        // this.popupCoreUiModal(this.getExceptionTitle(exception), this.getExceptionMessage(exception));
      }
    } else {
      if (typeof exception == 'string') {
        alert(exception)
      } else {
        let message = ''

        for (let key in exception) {
          message = message + `${key}: ${exception[key]}\n`
        }

        alert(message)
      }
    }

    throw exception
  }

  private getExceptionTitle(exception: any): string {
    let title = '오류'
    if (
      exception.response &&
      exception.response.data &&
      exception.response.data.cause &&
      exception.response.data.cause.code
    ) {
      title = exception.response.data.cause.code
    }
    return title
  }

  // 전달되는 오류 메시지를 문자열로 변환한다.
  private getExceptionMessage(errMsgObj: any): string {
    if (typeof errMsgObj === 'object') {
      return JSON.stringify(errMsgObj.response.data, undefined, 4)
    } else {
      return errMsgObj
    }
  }

  private popupCoreUiModal(title: string, message: string) {
    const modalData = {
      title: title,
      bodyLocaleKey: message
      // buttonItems: [{
      //   color: 'danger',
      //   localeKey: 'Delete',
      //   callback: async (): Promise<void> => {
      //     // const data = await this.$http.postAsync('/clickhouse/deleteClickhouseQueryById', { id: this.$route.params.id });
      //     // alert(data.message);
      //     // this.$router.back();
      //   }
      // }]
    } as IModalData

    globalProperties.$modal.show(modalData)
  }
}

export default {
  install: (app: App): void => {
    app.config.globalProperties.$http = new HttpUtil()
  }
}
