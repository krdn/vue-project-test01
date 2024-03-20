<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-title">
      <span>Query</span>
    </div>

    <CButton color="primary" variant="outline" @click="addOnClick">{{ $t('Add') }}</CButton>
    <!-- 암호화된 쿼리해제를 위하여 임시로 만든 버튼입니다. -->
    <!-- <CButton color="primary" variant="outline" @click="decryptOnClick">{{ $t("암호풀기") }}</CButton> -->
  </div>

  <div class="contents-wrapper">
    <CTable bordered striped hover>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Target</CTableHeaderCell>
          <CTableHeaderCell class="date-cell" scope="col">Created Date</CTableHeaderCell>
          <CTableHeaderCell class="width-120" scope="col">Created By</CTableHeaderCell>
          <CTableHeaderCell class="date-cell" scope="col">Modified Date</CTableHeaderCell>
          <CTableHeaderCell class="width-120" scope="col">Modified By</CTableHeaderCell>
          <CTableHeaderCell class="status-cell" scope="col">Active</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow
          v-for="item in gridItems"
          class="query-data-row"
          @click="(e: any) => dataRowOnClick(item.id)"
        >
          <CTableDataCell>{{ item.queryName }}</CTableDataCell>
          <CTableDataCell>{{ item.target }}</CTableDataCell>
          <CTableDataCell class="date-cell">{{ item.createdDate }}</CTableDataCell>
          <CTableDataCell class="width-120">{{ item.createdBy }}</CTableDataCell>
          <CTableDataCell class="date-cell">{{ item.modifiedDate }}</CTableDataCell>
          <CTableDataCell class="width-120">{{ item.modifiedBy }}</CTableDataCell>
          <CTableDataCell
            class="status-cell"
            v-html="$stringUtil.getCheckedMarkHtmlEntity(item.active)"
          ></CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
</template>

<script lang="ts">
import { Base } from '@/base-component/Base'

export default class QueryItems extends Base {
  gridItems: Array<any> = []

  async beforeCreate(): Promise<void> {
    this.gridItems = await this.$http.postAsync('/clickhouse/getQueryGridData')
  }

  async addOnClick(): Promise<void> {
    this.$router.push({ name: 'NewQuery' })
  }

  async decryptOnClick(): Promise<void> {
    const data = await this.$http.postAsync('/clickhouse/decryptAllClickhouseQuery')

    alert(data.message)

    this.$router.back()
  }

  dataRowOnClick(dataKey: string): void {
    this.$router.push({ name: 'EditQuery', params: { id: dataKey } })
  }
}
</script>
