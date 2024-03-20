<template>
  <div class="contents-wrapper" v-if="loaded">
    <div class="contents-container">
      <CRow class="contents-header">
        <CCol :xxl="12" :xl="12" class="no-padding-top">
          <div class="title with-button">
            <span v-html="$t('UserManagementMain')"></span>
            <CButton color="primary" variant="outline" @click="addOnClick">{{ $t('Add') }}</CButton>
          </div>
        </CCol>
      </CRow>

      <CRow class="contents-body">
        <CCol :xxl="12" :xl="12">
          <div class="sub-contents-wrapper">
            <div class="sub-contents-body">
              <DataGrid
                :config="gridOptions"
                :context="context"
                :grid-data="gridItems"
                @grid-ready="gridOnReady"
              >
              </DataGrid>
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import DataGrid from '@/components/grid/DataGrid.vue'
import CommonIconInGrid from '@/components/common/CommonIconInGrid.vue'

import type { TDataGridOptions, IModalData } from '@/types/types'
import type { GridApi } from '@ag-grid-community/core'

@Options({
  components: { DataGrid, CommonIconInGrid }
})
export default class UserManagementMain extends Base {
  gridItems: Array<any> = []
  gridApi: GridApi | null = null

  gridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'userId', headerName: '아이디' },
      { field: 'userName', headerName: '사용자명' },
      { field: 'role', headerName: '권한' },
      { field: 'email', headerName: '이메일' },
      { field: 'active', headerName: '상태', cellRenderer: this.statusCellRenderer },
      {
        field: 'createdDate',
        headerName: '생성일'
      },
      {
        field: 'modifiedDate',
        headerName: '수정일'
      },
      {
        field: 'canDelete',
        headerName: '삭제',
        width: 80,
        headerClass: 'header-text-center',
        cellClass: 'text-center',
        cellRendererSelector: this.canDeleteCellRenderer
      },
      {
        field: 'modifyColumn',
        headerName: '수정',
        width: 80,
        headerClass: 'header-text-center',
        cellClass: 'text-center',
        cellRenderer: CommonIconInGrid,
        cellRendererParams: { icon: 'modify', isRender: true, clickable: true }
      }
    ]
  }

  context: any = { parentComponent: null }
  loaded: boolean = false
  key: number = 0

  async created() {
    this.context.parentComponent = this

    this.gridItems = await this.$http.postAsync('/user/getUserGridData')
    this.loaded = true
  }

  addOnClick(): void {
    this.$router.push({ name: 'NewUser' })
  }

  statusCellRenderer(params: any) {
    if (params.value == true) {
      return '<span class="status-circle success"></span> active'
    } else if (params.value == false) {
      return '<span class="status-circle fail"></span> inactive'
    }
  }

  canDeleteCellRenderer(params: any) {
    if (params.data.canDelete) {
      return {
        component: CommonIconInGrid,
        params: { icon: 'delete', isRender: true, clickable: true }
      }
    }

    return { component: CommonIconInGrid }
  }

  modifyOnClick(params: any): void {
    this.$router.push({ name: 'EditUser', params: { id: params.data.id } })
  }

  deleteOnClick(params: any): void {
    const modalData = {
      bodyLocaleKey: 'DataDeleteConfirm',
      buttonItems: [
        {
          color: 'danger',
          localeKey: 'Delete',
          callback: async (): Promise<void> => {
            const result = await this.$http.postAsync(
              '/user/deleteUserById',
              { id: params.data.id },
              null,
              true
            )

            if (result.error) {
              alert(result.message)

              return
            }

            this.gridApi!.applyTransaction({ remove: [params.data] })
          }
        }
      ]
    } as IModalData

    this.$modal.show(modalData)
  }

  gridOnReady(gridApi: GridApi) {
    this.gridApi = gridApi
  }
}
</script>
