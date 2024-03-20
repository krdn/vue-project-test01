import { createApp } from 'vue'
import { initPinia } from '@/CustomPinia'
import { CIcon } from '@coreui/icons-vue'
import { addLicense } from '@amcharts/amcharts5'
import App from '@/App.vue'
import router from '@/router/MainRouter'
import httpUtil from '@/utils/HttpUtil'
import socketUtil from '@/utils/SocketUtil'
import validationUtil from '@/utils/ValidationUtil'
import CoreuiVue from '@coreui/vue-pro'
import ModalPlugin from '@/utils/ModalPlugin'
import i18n from '@/i18n'
import momentUtil from '@/utils/MomentUtil'
import stringUtil from '@/utils/StringUtil'
import * as icons from '@coreui/icons'

// Components
import BarChart from '@/components/charts/BarChart.vue'
import RadarChart from './components/charts/RadarChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import TraceableSankeyDiagram from '@/components/charts/TraceableSankeyDiagram.vue'
import ClusteredBarChart from '@/components/charts/ClusteredBarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import CommonIcon from '@/components/common/CommonIcon.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import TimePicker from '@/components/common/TimePicker.vue'

// Prototypes
import '@/prototypes/Date'
import '@/prototypes/String'

const app = createApp(App)
// Router
app.use(router)

// Utils
app.use(httpUtil)
app.use(socketUtil)
app.use(momentUtil)
app.use(stringUtil)
app.use(validationUtil)

// 3rd Party Libraries
app.use(initPinia(app))
app.use(CoreuiVue)
app.use(i18n)
app.use(ModalPlugin)

app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('CommonIcon', CommonIcon)
app.component('BarChart', BarChart)
app.component('RadarChart', RadarChart)
app.component('LineChart', LineChart)
app.component('TraceableSankeyDiagram', TraceableSankeyDiagram)
app.component('ClusteredBarChart', ClusteredBarChart)
app.component('PieChart', PieChart)
app.component('DatePicker', DatePicker)
app.component('TimePicker', TimePicker)

//amChart License Register
addLicense('AM5C416796958')

app.mount('#app')

window.onkeydown = function (e: KeyboardEvent) {
  if (import.meta.env.VITE_NODE_ENV == 'production' && e.key == 'F5') {
    e.preventDefault()
    e.stopPropagation()
  }
}

window.onmousedown = function (e: MouseEvent) {
  if (import.meta.env.VITE_NODE_ENV == 'production' && (e.button == 3 || e.button == 4)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

window.oncontextmenu = function (e: MouseEvent) {
  if (import.meta.env.VITE_NODE_ENV == 'production') {
    e.preventDefault()
    e.stopPropagation()
  }
}

export default app.config.globalProperties
