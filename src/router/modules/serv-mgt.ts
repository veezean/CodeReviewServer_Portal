import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/servMgt',
  component: Layout,
  redirect: '/servMgt/commentFields',
  name: 'serviceMgt',
  meta: {
    title: '评审配置',
    icon: 'servmgt',
    auth: 'servMgt',
  },
  children: [
    {
      path: 'commentFields',
      name: 'CommentFieldMgt',
      component: () => import('@/views/serv-mgt/comment-field-setting.vue'),
      meta: {
        title: '评审字段配置',
        icon: 'fieldconfig',
        auth: 'commentFields',
      },
    },
    {
      path: 'enums',
      name: 'EnumMgt',
      component: () => import('@/views/serv-mgt/enum-mgt.vue'),
      meta: {
        title: '字典值管理',
        icon: 'enums',
        auth: 'enums',
      },
    },
  ],
}

export default routes
