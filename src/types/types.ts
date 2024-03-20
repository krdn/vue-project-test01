import moment from 'moment'
import type { Socket } from 'socket.io-client'
import type { GridOptions, ColDef, RowClickedEvent } from '@ag-grid-community/core'
import type { TXYChartSeries, TChartData } from '@/types/chart-types'

export interface IHttpUtil {
  post(
    url: string,
    data?: any,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<any>
  postAsync<T = any>(
    url: string,
    data?: any,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<T>
  postWithFileAsync<T = any>(
    url: string,
    data?: FormData,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<T>
  downloadFile(
    url: string,
    data?: any,
    bypassLoading?: boolean | null,
    bypassThrowError?: boolean | null
  ): Promise<any>
}

export interface ICryptoUtil {
  encrypt(data: string): string
}

export interface IMomentUtil {
  getDefaultDateRange(): TDefaultDateRange
  getFormattedDateTime(date?: Date | string): string
  getFormattedDate(date?: Date | string): string
  add(
    date: Date | string,
    digit: number,
    unit: moment.unitOfTime.DurationConstructor
  ): moment.Moment
}

export interface ILocalStorageUtil {
  getJwtToken(): string | null
  getRefreshToken(): string | null
  getBothToken(): object
  setJwtToken(jwtToken: string): void
  setRefreshToken(refreshToken: string): void
  setBothToken(jwtToken: string, refreshToken: string): void
  removeJwtToken(): void
  removeRefreshToken(): void
  removeBothToken(): void
}

export interface IStringUtil {
  getCheckedMarkHtmlEntity(checked: boolean): string
}

export interface IChartUtil {
  getChartSeriesTypeInfo(format: string): TChartSeriesTypeInfo
}

export interface IValidationUtil {
  searchCriteriaIsNotNull(...args: any[]): boolean
  checkIfValidDatePeriod(startDate: Date | null, endDate: Date | null): boolean
  atleastOneSearchCriterias(...args: any[]): boolean
  greaterThanStartDate(startDate: Date, endDate: Date): boolean
  periodOutOfRange(startDate: Date, endDate: Date, range: number): boolean
  periodOutOfRangeOfMonths(startDate: Date, endDate: Date, range: number): boolean
  requiredFieldIsNotNull(...args: any[]): boolean
  searchPanelRequiresQueryStatement(condition: string): boolean
}

export interface IModal {
  show(data: IModalData): void
}

export interface IModalData {
  title?: string
  bodyLocaleKey: string
  messageParameters?: any
  isVisibleCloseButton?: boolean
  buttonItems?: Array<IButtonItems>
  closeCallBack?(): void
}

export interface IButtonItems {
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  localeKey: string
  callback?: Function
}

export interface ISocketUtil {
  socket: Socket
  connect(): void
  getSocketId(): string
  disconnect(): void
}

export type TDefaultDateRange = {
  /**
   * Format: YYYY-MM-DD
   */
  startDate: string
  /**
   * Format: YYYY-MM-DD
   */
  endDate: string
}

export type TChartSeriesTypeInfo = {
  unit: string
  displayFormat: TChartSeriesDisplayFormat
}

export type TChartDateOptions = {
  format: string
}

export type TDataGridCustomApi = {
  exportCSVCurrentPage(): Promise<void>
  exportCSV(): Promise<void>
  search(): Promise<void>
}

export type TDataGridOptions = {
  columnDefinitions: ColDef<any>[] | null | undefined
  notAllowMovableColumns: boolean
  pagination?: boolean
  needMergeCell?: boolean
  serverPagination?: boolean
  width?: number | string
  height?: number | string
  gridOptions?: GridOptions
  onRowClick?(params: RowClickedEvent): Promise<void> | void
  detailColumns?: Array<string>
}

export type TSmartTableOptions = {
  columnDefinitions: Array<TSmartTableColumn>
  pagination: 'clientSide' | 'serverSide' | 'none'
  rowSelectable?: boolean
  showPageSizeSelect?: boolean
  pageSizeSelectLabel?: string
  pageSizeItems?: Array<number>
  onRowClick?(item: Object, index: number, columnName: string, event: Event): Promise<void> | void
}

export type TSmartTableColumn = {
  key: string
  label: string
  width?: string | number
  class?: string
  _style?: any
  _props?: any
}

export type TSearchPanelOptions = {
  position: 'top left' | 'top right' | 'bottom left' | 'bottom right'
  direction: 'horizontal' | 'vertical'
}

export type TSearchPanelAPI = {
  open(e: Event): void
  close(): void
}

export type TDashboardChartData = {
  seriesItems: Array<TXYChartSeries>
  data: TChartData
}

type TChartSeriesDisplayFormat = {
  year?: string
  month?: string
  day?: string
  hour?: string
  minute?: string
  second?: string
  millisecond?: string
}
