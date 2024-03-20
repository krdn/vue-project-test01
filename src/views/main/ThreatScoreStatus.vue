<template>
  <div class="dashboard-tile" :class="backgroundColor">
    <div class="title">
      {{ $t('ThreatScoringStatus') }}
      <CommonIcon
        :width="20"
        :height="20"
        icon="link"
        class="inline"
        @click="threatScoringOnClick"
        v-if="link"
      >
      </CommonIcon>
    </div>

    <div class="content threat-score-status">
      <div class="update-date">
        <span>Updated: {{ $moment(updatedDate).format('YYYY-MM-DD') }}</span>
      </div>
      <div class="threat-score">
        <span v-html="threatScore" :class="{ 'white-font': whiteFont }"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

@Options({
  props: {
    threatScore: { type: Number, required: true, default: Date.today() },
    updatedDate: { type: Date, required: true, default: Date.today() },
    link: { type: Boolean, required: false, default: true }
  }
})
export default class ThreatScoreStatus extends Base {
  threatScore!: number
  updatedDate!: Date
  link!: boolean
  backgroundColor: string = ''
  whiteFont: boolean = false

  created(): void {
    if (this.threatScore > 0) {
      this.whiteFont = true
    }

    if (this.threatScore > 0 && this.threatScore < 25) {
      this.backgroundColor = 'interest'
    } else if (this.threatScore >= 25 && this.threatScore < 50) {
      this.backgroundColor = 'caution'
    } else if (this.threatScore >= 50 && this.threatScore < 75) {
      this.backgroundColor = 'boundary'
    } else if (this.threatScore >= 75) {
      this.backgroundColor = 'serious'
    }
  }

  threatScoringOnClick(): void {
    this.$router.push({ name: 'ThreatScoring' })
  }
}
</script>
