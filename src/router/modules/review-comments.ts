import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/reviewcomments',
  component: Layout,
  redirect: '/reviewcomments/mytodo',
  name: 'reviewComments',
  meta: {
    title: '检视数据',
    icon: 'comments',
    auth: 'reviewcomments',
  },
  children: [
    {
      path: 'mytodo',
      name: 'MyTodoComments',
      component: () => import('@/views/comment/mytodocomment.vue'),
      meta: {
        title: '我的待办',
        icon: 'todo',
        auth: 'mytodo',
      },
    },
    {
      path: 'mycommitted',
      name: 'MyCommittedComments',
      component: () => import('@/views/comment/mycommittedcomment.vue'),
      meta: {
        title: '我提交的',
        icon: 'commit',
        auth: 'mycommitted',
      },
    },
    {
      path: 'myconfirmed',
      name: 'MyConfirmedComments',
      component: () => import('@/views/comment/myconfirmedcomment.vue'),
      meta: {
        title: '我确认的',
        icon: 'confirmed',
        auth: 'myconfirmed',
      },
    },
    {
      path: 'all',
      name: 'AllComments',
      component: () => import('@/views/comment/allcomment.vue'),
      meta: {
        title: '全部数据',
        icon: 'allcomments',
        auth: 'all',
      },
    },
  ],
}

export default routes
