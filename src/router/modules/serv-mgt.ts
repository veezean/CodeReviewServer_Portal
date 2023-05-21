import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/servMgt',
  component: Layout,
  redirect: '/servMgt/users',
  name: 'serviceMgt',
  meta: {
    title: '业务数据管理',
    icon: 'servmgt',
  },
  children: [
    {
      path: 'users',
      name: 'UserMgt',
      component: () => import('@/views/serv-mgt/user-mgt.vue'),
      meta: {
        title: '用户管理',
        icon: 'usermanage',
      },
    },
    {
      path: 'depts',
      name: 'DeptMgt',
      component: () => import('@/views/serv-mgt/dept-mgt.vue'),
      meta: {
        title: '部门管理',
        icon: 'deptmanage',
      },
    },
    {
      path: 'projs',
      name: 'ProjMgt',
      component: () => import('@/views/serv-mgt/project-mgt.vue'),
      meta: {
        title: '项目管理',
        icon: 'projectmanage',
      },
    },
    {
      path: 'commentFields',
      name: 'CommentFieldMgt',
      component: () => import('@/views/serv-mgt/comment-field-setting.vue'),
      meta: {
        title: '评审字段配置',
        icon: 'fieldconfig',
      },
    },
    {
      path: 'enums',
      name: 'EnumMgt',
      component: () => import('@/views/serv-mgt/enum-mgt.vue'),
      meta: {
        title: '字典值管理',
        icon: 'enums',
      },
    },
  ],
}

export default routes
