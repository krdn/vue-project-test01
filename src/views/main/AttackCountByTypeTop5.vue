<template>
  <div class="dashboard-tile top-data">
    <div class="title">
      <span>{{ $t('AttackCountByTypeTop5') }}</span>
    </div>

    <div class="content">
      <div class="tab-wrapper">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink
              href="javascript: void(0);"
              :active="activeTab == 1"
              @click="() => changeData(1)"
            >
              {{ $t('ThisWeek') }}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href="javascript: void(0);"
              :active="activeTab == 2"
              @click="() => changeData(2)"
            >
              {{ $t('LastWeek') }}
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>
      <div class="tab-content">
        <CTable class="dashboard-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell class="width-50 number-cell" scope="col">No</CTableHeaderCell>
              <CTableHeaderCell scope="col" v-html="$t('AttackType')"></CTableHeaderCell>
              <CTableHeaderCell
                class="width-90 number-cell"
                scope="col"
                v-html="$t('AttackCount')"
              ></CTableHeaderCell>
              <CTableHeaderCell
                class="width-90 number-cell"
                scope="col"
                v-html="$t('ByPreviousWeek')"
              ></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-if="tableItems.length > 0" v-for="(item, index) in tableItems">
              <CTableDataCell class="width-50 number-cell" v-html="index + 1"></CTableDataCell>
              <CTableDataCell v-html="item.attackLabel"></CTableDataCell>
              <CTableDataCell
                class="width-90 number-cell"
                v-html="item.attackCount.toLocaleString()"
              ></CTableDataCell>
              <CTableDataCell class="width-90 number-cell">
                <span
                  :class="getClass(item.byPreviousWeekRate)"
                  v-html="getRate(item.byPreviousWeekRate)"
                ></span>
              </CTableDataCell>
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
import { Options, Base } from '@/base-component/Base'

@Options({
  props: {
    attackCountByTypeTop5: {
      type: Object as () => any,
      required: true,
      default: { lastWeekData: [], twoWeeksAgoData: [] }
    }
  }
})
export default class AttackCountByTypeTop5 extends Base {
  attackCountByTypeTop5!: any
  tableItems: Array<any> = []
  activeTab: number = 1

  created(): void {
    this.tableItems = this.attackCountByTypeTop5.lastWeekData
  }

  changeData(activeTab: number) {
    if (this.activeTab != activeTab) {
      this.activeTab = activeTab

      if (activeTab == 1) {
        this.tableItems = this.attackCountByTypeTop5.lastWeekData
      } else {
        this.tableItems = this.attackCountByTypeTop5.twoWeeksAgoData
      }
    }
  }

  getRate(rate: number | null): string {
    if (rate && !isNaN(rate)) {
      return `${rate.toLocaleString()}%`
    }

    return ''
  }

  getClass(rate: number | null): string {
    if (rate == null) {
      return 'rate-arrow-dash'
    } else if (rate > 0) {
      return 'rate-arrow-up'
    } else {
      return 'rate-arrow-down'
    }
  }
}
</script>
