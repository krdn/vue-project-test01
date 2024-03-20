<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-title">
      <span>New Query</span>
    </div>

    <CButton color="primary" variant="outline" @click="saveOnClick">{{ $t('Save') }}</CButton>
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
          <CFormCheck id="flexCheckDefault" type="checkbox" label="Active" v-model="active" />
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

export default class NewQuery extends Base {
  queryName: string = ''
  parameters: string = ''
  query: string = ''
  target: string = ''
  active: boolean = true

  async saveOnClick() {
    const parameters = {
      queryName: this.queryName,
      parameters: this.parameters,
      query: this.query,
      target: this.target,
      active: this.active
    }

    const data = await this.$http.postAsync('/clickhouse/saveClickhouseQuery', parameters)

    alert(data.message)

    this.$router.back()
  }

  closeOnClick(): void {
    this.$router.back()
  }
}
</script>
