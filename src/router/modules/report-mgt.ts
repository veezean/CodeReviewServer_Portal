import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/reports',
  component: Layout,
  redirect: '/reports/dashboard',
  name: 'reportDashboard',
  meta: {
    title: '统计报表',
    icon: 'report',
    auth: 'reports',
  },
  children: [
    {
      path: 'dashboard',
      name: 'reportDashBoard',
      component: () => import('@/views/report-mgt/report-statistic.vue'),
      meta: {
        title: '数据报表',
        icon: 'dashboard',
        auth: 'dashboard',
      },
    },
  ],
}

export default routes
