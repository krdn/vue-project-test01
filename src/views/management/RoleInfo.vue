<template>
  <div class="contents-wrapper" v-if="loaded">
    <div class="contents-container">
      <CRow class="contents-header">
        <CCol :xxl="12" :xl="12" class="no-padding-top">
          <div class="title with-button">
            <span>권한 정보</span>

            <div class="button-wrapper">
              <CButton color="dark" variant="outline" @click="closeOnClick">{{
                $t('Close')
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
                <CFormLabel for="roleName" class="sub-title">권한명</CFormLabel>
                <CFormInput
                  type="text"
                  id="roleName"
                  v-model="roleName"
                  autocomplete="off"
                  maxlength="20"
                  readonly
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
                  readonly
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
                      disabled
                      class="form-check-input me-2 menu-level-2-item"
                      v-model="menuItem.canView"
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
                        disabled
                        class="form-check-input me-2 menu-level-2-item"
                        v-model="childMenuItem.canView"
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

            <CFormSwitch
              size="xl"
              v-model="canDownload"
              :title="canDownload ? 'ON' : 'OFF'"
              disabled
            />
          </div>
        </CCol>

        <div>
          <hr class="margin-10 with-border section-devide" />
        </div>
      </CRow>

      <CRow class="contents-body">
        <CCol :xxl="12" :xl="12">
          <div class="sub-contents-wrapper">
            <div class="sub-contents-header">
              <span class="sub-title">사용자 목록</span>
            </div>
            <CRow class="sub-contents-body no-padding">
              <DataGrid
                :config="gridOptions"
                :grid-data="userItems"
                @grid-ready="userItemsGridOnReady"
              >
              </DataGrid>
            </CRow>
          </div>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Options } from '@/base-component/Base'
import { GridApi } from '@ag-grid-community/core'
import DataGrid from '@/components/grid/DataGrid.vue'
import { TDataGridOptions } from '@/types/types'

@Options({
  components: { DataGrid },
  props: {
    id: { type: String, default: '' }
  }
})
export default class RoleInfo extends Base {
  roleName: string = ''
  description: string = ''
  menuItems: Array<any> = []
  menuItemsForUI: Array<any> = []
  canDownload: boolean = true
  userItems: Array<any> = []

  userItemsGridApi: GridApi | null = null

  gridOptions: TDataGridOptions = {
    needMergeCell: false,
    pagination: false,
    serverPagination: false,
    notAllowMovableColumns: true,
    columnDefinitions: [
      { field: 'userName', headerName: '이름', width: 200, sort: 'asc' },
      { field: 'email', headerName: '이메일' },
      { field: 'createdDate', headerName: '생성일' },
      { field: 'modifiedDate', headerName: '수정일' }
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
    this.userItems = data.addedUserItems
    this.loaded = true
  }

  userItemsGridOnReady(gridApi: GridApi): void {
    this.userItemsGridApi = gridApi
  }

  closeOnClick(e: Event): void {
    this.$router.back()
  }
}
</script>
