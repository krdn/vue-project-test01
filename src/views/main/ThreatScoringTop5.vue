<template>
  <div class="dashboard-tile">
    <div style="font-size: 16px; font-weight: 700"><span v-html="$t('Top5Threats')"></span></div>

    <div class="content">
      <div class="tab-content" style="margin-top: 20px">
        <CTable class="dashboard-table">
          <CTableHead>
            <CTableRow color="secondary">
              <CTableHeaderCell class="width-50 number-cell" scope="col">No</CTableHeaderCell>
              <CTableHeaderCell scope="col" v-html="$t('AttackIP')"></CTableHeaderCell>
              <CTableHeaderCell
                class="width-90 number-cell"
                scope="col"
                v-html="$t('Score')"
              ></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-if="tableItems.length > 0" v-for="(item, index) in tableItems">
              <CTableDataCell class="width-50 number-cell" v-html="index + 1"></CTableDataCell>
              <CTableDataCell v-html="item.attackIP"></CTableDataCell>
              <CTableDataCell
                class="width-90 number-cell"
                v-html="item.attackCount"
              ></CTableDataCell>
            </CTableRow>

            <CTableRow v-if="tableItems.length == 0">
              <CTableDataCell class="no-data" colspan="4" v-html="$t('NoData')"></CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Options } from '@/base-component/Base'

@Options({
  props: {
    threatScoringTop5: { type: Object as () => any, required: true, default: {} }
  }
})
export default class AssetAccessCountTop5 extends Base {
  threatScoringTop5!: any
  tableItems: Array<any> = []

  created(): void {
    // this.tableItems = this.threatScoringTop5;
    this.tableItems = [
      { attackIP: '80.79.4.244', attackCount: 100 },
      { attackIP: '80.79.4.231', attackCount: 95 },
      { attackIP: '175.110.114.197', attackCount: 88 },
      { attackIP: '1.214.174.131', attackCount: 80 },
      { attackIP: '211.115.206.18', attackCount: 50 }
    ]
  }
}
</script>
