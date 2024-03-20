<template>
  <div class="dashboard-tile">
    <div class="crisis-warning-title">
      <span @click="ncscOnClick">{{ $t('CrisisWarning') }}</span>
      <span :class="className">{{ $t(localeKey) }}</span>
    </div>

    <div class="content">
      <div class="update-date">
        <span>Updated: {{ $moment(updatedDate).format('YYYY-MM-DD') }}</span>
      </div>
      <div class="crisis-warning" :class="className"></div>
      <div>
        <p
          class="crisis-description"
          v-for="description of descriptionItems"
          v-text="description"
          :title="description"
        ></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Base } from '@/base-component/Base'

@Options({
  props: {
    updatedDate: { type: String, required: true, default: Date.today().format() },
    status: { type: String, required: true, default: 'interest' }
  }
})
export default class CrisisWarning extends Base {
  updatedDate!: Date
  status!: string

  statusText: string = ''
  localeKey: string = ''
  className = ''
  dataset: TDataSet = {
    interest: [
      '웜ㆍ바이러스, 해킹기법 등에 의한 피해발생 가능성 증가',
      '해외 사이버공격 피해확산, 국내유입 우려',
      '정보유출 등 사이버공격 시도 탐지',
      '국내외 정치ㆍ군사적 위기상황조성 등 사이버안보 위해 가능성 증가'
    ],
    caution: [
      '다수기관의 정보통신망 및 정보시스템 장애 발생',
      '다수기관의 정보유출 등 침해사고 확산 가능성 증가',
      '국내외 정치ㆍ군사적 위기발생 등 사이버안보 위해 가능성 고조'
    ],
    boundary: [
      '복수 ISP망 또는 기간망에 피해 발생',
      '대규모 피해 확산 가능성 증대',
      '정보유출 등 대규모 침해사고 발생',
      '복수분야에서 광범위한 피해가 발생하는 등 대규모 피해로 확대될 가능성이 높아 다수기관의 공조대응이 필요한 경우'
    ],
    serious: [
      '전국적인 네트워크 및 정보시스템 사용 불가능',
      '주요 핵심기반시설의 피해로 국민혼란 발생',
      '정보유출 등 대규모 침해사고가 전국적으로 발생',
      '국가적 차원의 평가와 조치가 필요하다고 판단되는 사고 발생'
    ]
  }

  descriptionItems: string[] = []

  created(): void {
    const key = this.getKey()

    this.className = `${key}-stage`
    this.descriptionItems = this.dataset[key]
  }

  ncscOnClick(): void {
    window.open(
      'https://www.ncsc.go.kr:4018/PageLink.do?link=forward:/cop/bbs/selectBoardList.do?bbsId=CyberCrisis_main&menuNo=020000&subMenuNo=020100&thirdMenuNo=',
      '_blank'
    )
  }

  private getKey(): string {
    let key = null

    switch (this.status) {
      case '주의':
        key = 'caution'
        this.statusText = this.$t('StageOfCaution')
        this.localeKey = 'StageOfCaution'

        break

      case '경계':
        key = 'boundary'
        this.statusText = this.$t('StageOfBoundary')
        this.localeKey = 'StageOfBoundary'

        break

      case '심각':
        key = 'serious'
        this.statusText = this.$t('StageOfSerious')
        this.localeKey = 'StageOfSerious'

        break

      default:
        key = 'interest'
        this.statusText = this.$t('StageOfInterest')
        this.localeKey = 'StageOfInterest'

        break
    }

    return key
  }
}

type TDataSet = {
  [index: string]: string[]
  interest: string[]
  caution: string[]
  boundary: string[]
  serious: string[]
}
</script>
