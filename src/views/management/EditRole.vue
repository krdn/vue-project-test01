<template>
  <div class="contents-wrapper" v-if="loaded">
    <div class="contents-container">
      <CRow class="contents-header">
        <CCol :xxl="12" :xl="12" class="no-padding-top">
          <div class="title with-button">
            <span>권한 수정</span>

            <div class="button-wrapper">
              <CButton v-if="canDelete" color="warning" variant="outline" @click="deleteOnClick">{{
                $t('Delete')
              }}</CButton>
              <CButton color="dark" variant="outline" @click="cancelOnClick">{{
                $t('Cancel')
              }}</CButton>
              <CButton color="primary" variant="outline" @click="saveOnClick">{{
                $t('Save')
              }}</CButton>
            </div>
          </div>
        </CCol>
      </CRow>

      <CRow class="contents-body no-flex">
        <CCol lg="6" md="12" sm="12" xs="12">
          <div class="sub-contents-wrapper">
            <div class="sub-contents-body">
              <CForm>
                <CFormLabel for="roleName" class="sub-title required">권한명</CFormLabel>
                <CFormInput
                  type="text"
                  id="roleName"
                  v-model="roleName"
                  autocomplete="off"
                  maxlength="20"
                  tabindex="1"
                />
              </CForm>
            </div>
          </div>
        </CCol>

        <CCol lg="6" md="12" sm="12" xs="12">
          <div class="sub-contents-wrapper">
            <div class="sub-contents-body">
              <CForm>
                <CFormTextarea
                  id="description"
                  label="권한 설명"
                  rows="3"
                  v-model="description"
                  tabindex="2"
                />
              </CForm>
            </div>
          </div>
        </CCol>

        <CCol lg="12" md="12" sm="12" xs="12">
          <div class="sub-contents-wrapper">
            <div class="sub-contents-header">
              <span class="sub-title">권한</span>
            </div>

            <div class="sub-contents-body">
              <div>
                <hr class="margin-10 with-border section-devide" />
              </div>

              <div class="menu-item-wrapper">
                <span class="sub-title">읽기 권한</span>

                <div v-for="menuItem of menuItemsForUI" class="menu-level-1">
                  <label class="form-check">
                    <input
                      :id="menuItem.id"
                      type="checkbox"
                      v-bind:disabled="menuItem.name == 'Dashboard'"
                      class="form-check-input me-2 menu-level-2-item"
                      v-model="menuItem.canView"
                      @change="setCheckedChildMenu(menuItem)"
                    />
                    {{ $t(menuItem.name) }}
                  </label>

                  <div
                    v-if="menuItem.items && menuItem.items.length > 0"
                    v-for="childMenuItem of menuItem.items"
                    class="menu-level-2"
                  >
                    <label class="form-check">
                      <input
                        :id="childMenuItem.id"
                        type="checkbox"
                        class="form-check-input me-2 menu-level-2-item"
                        v-model="childMenuItem.canView"
                        @change="setCheckedParentMenu(menuItem)"
                      />
                      {{ $t(childMenuItem.name) }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CCol>

        <div>
          <hr class="margin-10 with-border section-devide" />
        </div>

        <CCol :xxl="12" :xl="12">
          <div class="download-switch-wrapper">
            <span class="sub-title">다운로드</span>

            <CFormSwitch size="xl" v-model="canDownload" :title="canDownload ? 'ON' : 'OFF'" />
          </div>
        </CCol>

        <div>
          <hr class="margin-10 with-border section-devide" />
        </div>
      </CRow>

      <CRow class="contents-body">
        <CCol :xxl="6" :xl="6" class="no-padding">
          <div class="sub-contents-wrapper">
            <CRow class="sub-contents-body">
              <DataGrid
                :config="gridOptions"
                :grid-data="[...addedUserItems]"
                :rowMultiSelectWithClick="true"
                rowSelection="multiple"
                @grid-ready="addedUserItemsGridOnReady"
              >
              </DataGrid>
            </CRow>

            <CRow class="contents-body no-flex">
              <CCol :xxl="12" :xl="12" class="text-align-right">
                <CButton color="dark" variant="outline" @click="deleteUserOnClick">
                  <CIcon icon="cil-minus"></CIcon>
                  삭제
                </CButton>
              </CCol>
            </CRow>
          </div>
        </CCol>

        <CCol :xxl="6" :xl="6" class="no-padding">
          <div class="sub-contents-wrapper">
            <CRow class="sub-contents-body">
              <DataGrid
                :config="gridOptions"
                :grid-data="userItems"
                :rowMultiSelectWithClick="true"
                rowSelection="multiple"
                @grid-ready="userItemsGridOnReady"
              >
              </DataGrid>
            </CRow>

            <CRow class="contents-body no-flex">
              <CCol :xxl="12" :xl="12" class="text-align-right">
                <CButton color="dark" variant="outline" @click="addUserOnClick">
                  <CIcon icon="cil-plus"></CIcon>
                  추가
                </CButton>
              </CCol>
            </CRow>
          </div>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import { GridApi } from '@ag-grid-community/core'
import DataGrid from '@/components/grid/DataGrid.vue'

import type { TDataGridOptions } from '@/types/types'

@Options({
  components: { DataGrid },
  props: {
    id: { type: String, default: '' }
  }
})
export default class EditRole extends Base {
  roleName: string = ''
  description: string = ''
  canDownload: boolean = true
  canDelete: boolean = false

  menuItems: Array<any> = []
  menuItemsForUI: Array<any> = []
  userItems: Array<any> = []
  addedUserItems: Array<any> = []
  originalAddedUserItems: Array<any> = []

  userItemsGridApi: GridApi | null = null
  addedUserItemsGridApi: GridApi | null = null

  gridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: false,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { headerName: '', checkboxSelection: true, headerCheckboxSelection: true, width: 65 },
      { field: 'userName', headerName: '이름', width: 200, sort: 'asc' },
      { field: 'email', headerName: '이메일' },
      { field: 'role', headerName: '권한명' }
    ],
    onRowClick: undefined
  }

  loaded: boolean = false

  async created(): Promise<void> {
    const data = await this.$http.postAsync('/role/getRole', { roleId: this.$route.params.id })

    this.roleName = data.role
    this.description = data.description
    this.canDownload = data.canDownload
    this.menuItems = data.menuItems
    this.menuItemsForUI = data.menuItems.filter((item: any) => item.name != 'DownloadManual')
    this.addedUserItems = data.addedUserItems
    this.originalAddedUserItems = [...data.addedUserItems]
    this.userItems = data.userItems
    this.canDelete = data.canDelete
    this.loaded = true
  }

  addUserOnClick(e: Event): void {
    if (this.userItemsGridApi && this.addedUserItemsGridApi) {
      const selectedRows = this.userItemsGridApi.getSelectedRows()

      if (selectedRows && selectedRows.length > 0) {
        this.addedUserItemsGridApi.applyTransaction({ add: selectedRows })
        this.userItemsGridApi.applyTransaction({ remove: selectedRows })
        this.addedUserItems.push(...selectedRows)
      }
    }
  }

  deleteUserOnClick(e: Event): void {
    if (this.userItemsGridApi && this.addedUserItemsGridApi) {
      const selectedRows = this.addedUserItemsGridApi.getSelectedRows()

      if (selectedRows && selectedRows.length > 0) {
        this.userItemsGridApi.applyTransaction({ add: selectedRows })
        this.addedUserItemsGridApi.applyTransaction({ remove: selectedRows })

        for (let i = 0; i < this.addedUserItems.length; i++) {
          for (let removedUser of selectedRows) {
            if (this.addedUserItems[i].userId == removedUser.userId) {
              this.addedUserItems.splice(i, 1)
              i--

              break
            }
          }
        }
      }
    }
  }

  userItemsGridOnReady(gridApi: GridApi): void {
    this.userItemsGridApi = gridApi
  }

  addedUserItemsGridOnReady(gridApi: GridApi): void {
    this.addedUserItemsGridApi = gridApi
  }

  async saveOnClick(e: Event): Promise<void> {
    if (!this.$validationUtil.requiredFieldIsNotNull(this.roleName)) {
      return
    }

    const deletedUserItems = []

    for (let originalAddedUser of this.originalAddedUserItems) {
      const result = this.addedUserItems.filter(
        (userItem) => userItem.userId == originalAddedUser.userId
      )

      if (result.length == 0) {
        deletedUserItems.push(originalAddedUser)
      }
    }

    const menuItems = [] as Array<any>
    this.createMenuItemsForSave(menuItems)

    const data = await this.$http.postAsync('/role/updateRole', {
      id: this.$route.params.id,
      role: this.roleName,
      description: this.description,
      menuItems: menuItems,
      addedUserItems: this.addedUserItems,
      deletedUserItems: deletedUserItems
    })

    alert(data.message)

    this.$router.back()
  }

  cancelOnClick(e: Event): void {
    if (confirm(this.$t('CancelConfirm'))) {
      this.$router.back()
    }
  }

  async deleteOnClick(e: Event): Promise<void> {
    const renderedRowNodes = this.addedUserItemsGridApi?.getRenderedNodes()

    if (renderedRowNodes && renderedRowNodes.length > 0) {
      this.$modal.show({ bodyLocaleKey: 'CannotDeleteRoleIncludeUser' })

      return
    }

    const data = await this.$http.postAsync('/role/deleteRole', {
      id: this.$route.params.id,
      deletedUserItems: this.originalAddedUserItems
    })

    alert(data.message)

    this.$router.back()
  }

  setCheckedChildMenu(parentMenu: any): void {
    if (parentMenu.items && parentMenu.items.length > 0) {
      if (parentMenu.canView == false) {
        parentMenu.items.map((item: { canView: boolean }) => (item.canView = false))
      } else {
        parentMenu.items.map((item: { canView: boolean }) => (item.canView = true))
      }
    }
  }

  setCheckedParentMenu(parentMenu: any): void {
    const allFalse = this.getChildMenuItemsWhereCanViewFalse(parentMenu.items)
    if (allFalse) {
      parentMenu.canView = false
    } else {
      parentMenu.canView = true
    }
  }

  private createMenuItemsForSave(result: Array<any>, optMenuItems?: Array<any>): void {
    if (!optMenuItems) {
      optMenuItems = this.menuItems
    }

    for (let menuItem of optMenuItems) {
      result.push({
        menuId: menuItem.menuId,
        canView: menuItem.canView,
        canDownload: this.canDownload
      })

      if (menuItem.items && menuItem.items.length > 0) {
        this.createMenuItemsForSave(result, menuItem.items)
      }
    }
  }

  private getChildMenuItemsWhereCanViewFalse(items: Array<any>) {
    return items.every((obj) => obj['canView'] == false)
  }
}
</script>
