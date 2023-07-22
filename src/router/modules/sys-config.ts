import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/systemConfig',
  component: Layout,
  redirect: '/systemConfig/users',
  name: 'systemConfig',
  meta: {
    title: '系统管理',
    icon: 'sysconfig',
    auth: 'systemConfig',
  },
  children: [
    {
      path: 'users',
      name: 'UserMgt',
      component: () => import('@/views/sysconfig/user-mgt.vue'),
      meta: {
        title: '用户管理',
        icon: 'usermanage',
        auth: 'users',
      },
    },
    {
      path: 'roles',
      name: 'RoleMgt',
      component: () => import('@/views/sysconfig/role-mgt.vue'),
      meta: {
        title: '角色管理',
        icon: 'rolemanage',
        auth: 'roles',
      },
    },
    {
      path: 'depts',
      name: 'DeptMgt',
      component: () => import('@/views/sysconfig/dept-mgt.vue'),
      meta: {
        title: '部门管理',
        icon: 'deptmanage',
        auth: 'depts',
      },
    },
    {
      path: 'projs',
      name: 'ProjMgt',
      component: () => import('@/views/sysconfig/project-mgt.vue'),
      meta: {
        title: '项目管理',
        icon: 'projectmanage',
        auth: 'projs',
      },
    },
  ],
}

export default routes
