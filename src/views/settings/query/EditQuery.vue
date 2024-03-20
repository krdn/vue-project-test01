<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-title">
      <span>Edit Query: 저장된 쿼리수({{ queryCount }})</span>
    </div>

    <CButton color="primary" variant="outline" @click="saveOnClick">{{ $t('Save') }}</CButton>
    <CButton color="danger" variant="outline" @click="deleteOnClick">{{ $t('Delete') }}</CButton>
    <CButton color="dark" variant="outline" @click="closeOnClick">{{ $t('Close') }}</CButton>
  </div>

  <div class="contents-wrapper">
    <CRow>
      <CCol lg="3" md="3" sm="5" xs="5">
        <CForm>
          <CFormLabel for="queryName">Query Name</CFormLabel>
          <CFormInput type="text" id="queryName" v-model="queryName" />
        </CForm>
      </CCol>
      <CCol lg="3" md="3" sm="5" xs="5">
        <CForm>
          <CFormLabel for="parameters">Parameters</CFormLabel>
          <CFormInput type="text" id="parameters" v-model="parameters" />
        </CForm>
      </CCol>
      <CCol lg="3" md="3" sm="5" xs="5">
        <CForm>
          <CFormLabel for="target">Target</CFormLabel>
          <CFormInput type="text" id="target" v-model="target" />
        </CForm>
      </CCol>
      <CCol lg="1" md="1" sm="2" xs="2">
        <CForm class="checkbox-inline">
          <CFormCheck label="Active" v-model="active" />
        </CForm>
      </CCol>
    </CRow>

    <CRow>
      <CCol lg="12" md="12" sm="12" xs="12">
        <CForm>
          <CFormTextarea id="query" label="Query" rows="40" v-model="query"></CFormTextarea>
        </CForm>
      </CCol>
    </CRow>
  </div>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'
import type { IModalData } from '@/types/types'

export default class EditQuery extends Base {
  queryName: string = ''
  parameters: string = ''
  query: string = ''
  target: string = ''
  active: boolean = false
  queryCount: number = 0

  async beforeCreate(): Promise<void> {
    const data = await this.$http.postAsync('/clickhouse/getClickhouseQueryById', {
      id: this.$route.params.id
    })

    this.queryName = data.queryName
    this.parameters = data.parameters
    this.query = data.query
    this.target = data.target
    this.active = data.active

    this.queryCount = data.queries.length
  }

  async saveOnClick(): Promise<void> {
    const parameters = {
      id: this.$route.params.id,
      queryName: this.queryName,
      parameters: this.parameters,
      query: this.query,
      target: this.target,
      active: this.active
    }

    const data = await this.$http.postAsync('/clickhouse/updateClickhouseQueryById', parameters)

    alert(data.message)

    this.$router.back()
  }

  deleteOnClick(e: Event): void {
    const modalData = {
      bodyLocaleKey: 'DataDeleteConfirm',
      buttonItems: [
        {
          color: 'danger',
          localeKey: 'Delete',
          callback: async (): Promise<void> => {
            const data = await this.$http.postAsync('/clickhouse/deleteClickhouseQueryById', {
              id: this.$route.params.id
            })

            alert(data.message)

            this.$router.back()
          }
        }
      ]
    } as IModalData

    this.$modal.show(modalData)
  }

  closeOnClick(): void {
    this.$router.back()
  }
}
</script>
