import useRouteStore from './route'
import useMenuStore from './menu'
import api from '@/api'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const routeStore = useRouteStore()
    const menuStore = useMenuStore()

    const account = ref(localStorage.account ?? '')
    const name = ref(localStorage.name ?? '')
    const phoneNumber = ref(localStorage.phoneNumber ?? '')
    const token = ref(localStorage.token ?? '')
    const failure_time = ref(localStorage.failure_time ?? '')
    const permissions = ref<string[]>([])
    const isLogin = computed(() => {
      let retn = false
      if (token.value) {
        if (new Date().getTime() < parseInt(failure_time.value) * 1000) {
          retn = true
        }
      }
      return retn
    })

    // 登录
    async function login(data: {
      account: string
      password: string
    }) {
      const res = await api.post('server/login/doLogin', data)
      if (res.code === 0) {
        localStorage.setItem('account', res.data.userDetail.account)
        localStorage.setItem('name', res.data.userDetail.name)
        localStorage.setItem('phoneNumber', res.data.userDetail.phoneNumber)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('failure_time', res.data.expireAt)

        account.value = res.data.userDetail.account
        name.value = res.data.userDetail.name
        phoneNumber.value = res.data.userDetail.phoneNumber
        token.value = res.data.token
        failure_time.value = res.data.expireAt
      }
    }
    // 登出
    async function logout() {
      const res = await api.get('server/login/doLogout')
      if (res.code === 0) {
        localStorage.removeItem('account')
        localStorage.removeItem('name')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('token')
        localStorage.removeItem('failure_time')
        account.value = ''
        name.value = ''
        phoneNumber.value = ''
        token.value = ''
        failure_time.value = ''
        routeStore.removeRoutes()
        menuStore.setActived(0)
      }
      else {
        console.warn('logout failed...')
      }
    }
    // 获取我的权限
    async function getPermissions() {
      // 通过 mock 获取权限
      const res = await api.get('member/permission', {
        baseURL: '/mock/',
        params: {
          account: account.value,
        },
      })
      permissions.value = res.data.permissions
      return permissions.value
    }
    // 修改密码
    async function editPassword(data: {
      password: string
      newpassword: string
    }) {
      await api.post('server/user/changePwd', {
        originalPwd: data.password,
        newPwd: data.newpassword,
      })
    }
    // 修改基本信息
    async function editBaseInfo(data: {
      name: string
      phoneNumber: string
    }) {
      const resp = await api.post('server/user/editBaseInfo', data)
      if (resp.code === 0) {
        localStorage.setItem('name', data.name)
        localStorage.setItem('phoneNumber', data.phoneNumber)
        name.value = data.name
        phoneNumber.value = data.phoneNumber
      }
    }

    return {
      account,
      name,
      phoneNumber,
      token,
      permissions,
      isLogin,
      login,
      logout,
      getPermissions,
      editPassword,
      editBaseInfo,
    }
  },
)

export default useUserStore
