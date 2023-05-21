import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/systemConfig',
  component: Layout,
  redirect: '/systemConfig/sysconfig',
  name: 'systemConfig',
  meta: {
    title: '系统管理配置',
    icon: 'sysconfig',
  },
  children: [
    {
      path: 'sysconfig',
      name: 'SystemConfig',
      component: () => import('@/views/sysconfig/sys-config.vue'),
      meta: {
        title: '系统配置',
        icon: 'syspropconfig',
      },
    },
    {
      path: 'sysNotification',
      name: 'SysNotification',
      component: () => import('@/views/sysconfig/sys-notification.vue'),
      meta: {
        title: '系统通知',
        icon: 'sysnotification',
      },
    },
  ],
}

export default routes
