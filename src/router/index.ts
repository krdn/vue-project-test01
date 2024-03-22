import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component:() => import('./src/views/main/Dashboard.vue')
    },
    // {
    //   path: '/CollectStatus',
    //   name: 'CollectStatus',
    //   component: () => import('@/views/collect-status/CollectStatus.vue')
    // },
    // {
    //   path: '/CollectStatus/WebLogCollectStatus',
    //   name: 'WebLogCollectStatusMain',
    //   component: () => import('@/views/collect-status/WebLogCollectStatusMain.vue')
    // },
    // {
    //   path: '/CollectStatus/SMTPLogCollectStatus',
    //   name: 'SMTPLogCollectStatusMain',
    //   component: () => import('@/views/collect-status/SMTPLogCollectStatusMain.vue')
    // },
    // {
    //   path: '/AnalysisStatus',
    //   name: 'AnalysisStatus',
    //   component: () => import('@/views/analysis-status/AnalysisStatus.vue')
    // },
    // {
    //   path: '/AnalysisStatus/SqlInjectionMain',
    //   name: 'SqlInjection',
    //   component: () => import('@/views/analysis-status/SqlInjectionMain.vue')
    // },
    // {
    //   path: '/AnalysisStatus/XSSMain',
    //   name: 'XSS',
    //   component: () => import('@/views/analysis-status/XSSMain.vue')
    // },
    // {
    //   path: '/AnalysisStatus/UnauthorizedAccessMain',
    //   name: 'UnauthorizedAccess',
    //   component: () => import('@/views/analysis-status/UnauthorizedAccessMain.vue')
    // },
    // {
    //   path: '/AnalysisStatus/InsecureAuthenticationMain',
    //   name: 'InsecureAuthentication',
    //   component: () => import('@/views/analysis-status/InsecureAuthenticationMain.vue')
    // },
    // {
    //   path: '/AnalysisStatus/ForcefulBrowsingMain',
    //   name: 'ForcefulBrowsing',
    //   component: () => import('@/views/analysis-status/ForcefulBrowsingMain.vue')
    // },
    // {
    //   path: '/AnalysisStatus/PathTraversalMain',
    //   name: 'PathTraversal',
    //   component: () => import('@/views/analysis-status/PathTraversalMain.vue')
    // },
    // {
    //   path: '/ThreatScoring',
    //   name: 'ThreatScoring',
    //   component: () => import('@/views/threat-scoring/ThreatScoring.vue')
    // },
    // {
    //   path: '/GlobalIntelligence',
    //   name: 'GlobalIntelligence',
    //   component: () => import('@/views/global-intelligence/GlobalIntelligence.vue')
    // },
    // {
    //   path: '/GlobalIntelligence/MitreAttack',
    //   name: 'MitreAttackMain',
    //   component: () => import('@/views/global-intelligence/MitreAttackMain.vue')
    // },
    // {
    //   path: '/Report',
    //   name: 'Report',
    //   component: () => import('@/views/report/Report.vue')
    // },
    // {
    //   path: '/Report/ReportByPeriod',
    //   name: 'ReportByPeriod',
    //   component: () => import('@/views/report/ReportByPeriod.vue')
    // },
    // {
    //   path: '/Report/ReportByMonth',
    //   name: 'ReportByMonth',
    //   component: () => import('@/views/report/ReportByMonth.vue')
    // },
    // {
    //   path: '/Management',
    //   name: 'Management',
    //   component: () => import('@/views/management/Management.vue')
    // },
    // {
    //   path: '/Management/UserManagement',
    //   name: 'UserManagementMain',
    //   component: () => import('@/views/management/UserManagementMain.vue')
    // },
    // {
    //   path: '/Management/ActivityLogManagement',
    //   name: 'ActivityLogManagementMain',
    //   component: () => import('@/views/management/ActivityLogManagementMain.vue')
    // },
    // {
    //   path: '/Management/RoleManagement',
    //   name: 'RoleManagementMain',
    //   component: () => import('@/views/management/RoleManagementMain.vue')
    // },
    // {
    //   path: '/Management/SystemManagement',
    //   name: 'SystemManagementMain',
    //   component: () => import('@/views/management/SystemManagementMain.vue')
    // },
// {
//   path: null,
//   name: 'DownloadManual',
//   to: null
// }

  ]
})

export default router
