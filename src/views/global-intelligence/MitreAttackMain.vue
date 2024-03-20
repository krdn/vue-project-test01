<template>
  <div class="contents-wrapper">
    <DataGrid :config="config" grid-data="/globalIntelligence/getMitreAttackGridData"></DataGrid>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'
import { TDataGridOptions } from '@/types/types'
import { CellClickedEvent } from '@ag-grid-community/core'
import DataGrid from '@/components/grid/DataGrid.vue'

@Options({
  components: { DataGrid }
})
export default class MitreAttackMain extends Base {
  config: TDataGridOptions = {
    needMergeCell: true,
    pagination: true,
    serverPagination: true,
    notAllowMovableColumns: true,
    columnDefinitions: [
      {
        field: 'tacticName',
        headerName: 'Tactic',
        rowSpan: this.tacticRowSpan,
        cellClass: this.tacticCellClass,
        sortable: false,
        onCellClicked: this.tacticNameOnClick
      },
      {
        field: 'techniqueName',
        headerName: 'Technique',
        colSpan: this.techniqueColSpan,
        rowSpan: this.techniqueRowSpan,
        cellClass: this.techniqueCellClass,
        sortable: false,
        onCellClicked: this.techniqueNameOnClick
      },
      {
        field: 'subTechniqueName',
        headerName: 'Sub Technique',
        cellClass: 'hyperlink-text',
        sortable: false,
        onCellClicked: this.subTechniqueNameOnClick
      },
      { field: 'threatScore', headerName: 'Threat Score', sortable: false }
    ]
  }

  async addOnClick(): Promise<void> {
    this.$router.push({ name: 'NewUser' })
  }

  tacticRowSpan(params: any): any {
    if (params.data && params.data.tacticRowSpan) {
      return params.data.tacticRowSpan
    }

    return
  }

  techniqueRowSpan(params: any): any {
    if (params.data && params.data.techniqueRowSpan) {
      return params.data.techniqueRowSpan
    }

    return
  }

  techniqueColSpan(params: any): any {
    if (params.data && params.data.techniqueColSpan) {
      return params.data.techniqueColSpan
    }

    return
  }

  tacticCellClass(params: any): any {
    if (params.data && params.data.tacticRowSpan > 1) {
      return 'row-span hyperlink-text'
    }

    return 'hyperlink-text'
  }

  techniqueCellClass(params: any): any {
    if (params.data && params.data.techniqueRowSpan > 1) {
      return 'row-span hyperlink-text'
    }

    return 'hyperlink-text'
  }

  tacticNameOnClick(e: CellClickedEvent): void {
    window.open(e.data.tacticUrl)
  }

  techniqueNameOnClick(e: CellClickedEvent): void {
    window.open(e.data.techniqueUrl)
  }

  subTechniqueNameOnClick(e: CellClickedEvent): void {
    window.open(e.data.subTechniqueUrl)
  }
}
</script>
