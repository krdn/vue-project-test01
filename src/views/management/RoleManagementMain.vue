<template>
  <div class="contents-wrapper" v-if="loaded">
    <div class="contents-container">
      <CRow class="contents-header">
        <CCol :xxl="12" :xl="12" class="no-padding-top">
          <div class="title with-button">
            <span>권한 관리</span>
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
                @grid-ready="gridItemsGridOnReady"
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
import CIconInGrid from '@/components/common/CIconInGrid.vue'
import CommonIconInGrid from '@/components/common/CommonIconInGrid.vue'
import DataGrid from '@/components/grid/DataGrid.vue'

import type { TDataGridOptions, IModalData } from '@/types/types'
import type { CellClickedEvent, GridApi } from '@ag-grid-community/core'

@Options({
  components: { DataGrid, CIconInGrid, CommonIconInGrid }
})
export default class AuthManagementMain extends Base {
  gridItems: Array<any> = []
  gridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: true,
    // if "totalCount" in data is 0, set serverPagination as false
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'role', headerName: '권한명', onCellClicked: this.roleInfoOnClick },
      {
        field: 'description',
        headerName: '권한 설명',
        width: 650,
        onCellClicked: this.roleInfoOnClick
      },
      { field: 'createdDate', headerName: '생성일', onCellClicked: this.roleInfoOnClick },
      { field: 'modifiedDate', headerName: '수정일', onCellClicked: this.roleInfoOnClick },
      {
        field: 'canDelete',
        headerName: '삭제',
        width: 70,
        headerClass: 'header-text-center',
        cellClass: 'text-center',
        cellRendererSelector: this.canDeleteCellRenderer
      },
      {
        field: 'modifyColumn',
        headerName: '권한수정',
        width: 70,
        headerClass: 'header-text-center',
        cellClass: 'text-center',
        cellRenderer: CommonIconInGrid,
        cellRendererParams: { icon: 'modify', isRender: true, clickable: true }
      }
    ]
  }

  gridApi: GridApi | null = null

  context: any = { parentComponent: null }
  loaded: boolean = false
  key: number = 0

  async created() {
    this.context.parentComponent = this

    const data = await this.$http.postAsync('/role/getRoleItems')

    this.gridItems = data.data
    this.loaded = true
  }

  gridItemsGridOnReady(gridApi: GridApi): void {
    this.gridApi = gridApi
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
    this.$router.push({ name: 'EditRole', params: { id: params.data.id } })
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
              '/role/deleteRole',
              { id: params.data.id, deletedUserItems: [] },
              null,
              true
            )

            if (result.error && result.status == 627) {
              if (result.status == 627) {
                this.$modal.show({ bodyLocaleKey: 'CannotDeleteRoleIncludeUser' })
              } else {
                alert(result.message)
              }

              return
            }

            this.gridApi!.applyTransaction({ remove: [params.data] })
          }
        }
      ]
    } as IModalData

    this.$modal.show(modalData)
  }

  addOnClick(): void {
    this.$router.push({ name: 'NewRole' })
  }

  async roleInfoOnClick(e: CellClickedEvent): Promise<void> {
    const context = e.context.parentComponent
    context.$router.push({ name: 'RoleInfo', params: { id: e.data.id } })
  }
}
</script>
