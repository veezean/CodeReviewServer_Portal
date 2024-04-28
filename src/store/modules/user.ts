import md5 from 'js-md5'
import useRouteStore from './route'
import useMenuStore from './menu'
import api from '@/api'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    interface Resp {
      code: number;
      data: any;
    }

    const routeStore = useRouteStore()
    const menuStore = useMenuStore()

    const version = ref(localStorage.version ?? '')
    const account = ref(localStorage.account ?? '')
    const name = ref(localStorage.name ?? '')
    const phoneNumber = ref(localStorage.phoneNumber ?? '')
    const token = ref(localStorage.token ?? '')
    const failure_time = ref(localStorage.failure_time ?? '')
    const permissions = ref<string[]>([])
    const isLogin = computed(() => {
      let retn = false
      if (token.value) {
        if (new Date().getTime() < parseInt(failure_time.value)) {
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
      const res:Resp = await api.post('server/login/doLogin', {
        account: data.account,
        password: md5(data.password),
      })
      if (res.code === 0) {
        localStorage.setItem('account', res.data.userDetail.account)
        localStorage.setItem('name', res.data.userDetail.name)
        localStorage.setItem('phoneNumber', res.data.userDetail.phoneNumber)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('failure_time', res.data.expireAt)
        localStorage.setItem('version', res.data.version)

        account.value = res.data.userDetail.account
        name.value = res.data.userDetail.name
        phoneNumber.value = res.data.userDetail.phoneNumber
        token.value = res.data.token
        failure_time.value = res.data.expireAt
        version.value = res.data.version
      }
    }
    // 登出
    async function logout() {
      const res:Resp = await api.get('server/login/doLogout')
      if (res.code === 0) {
        localStorage.removeItem('account')
        localStorage.removeItem('name')
        localStorage.removeItem('phoneNumber')
        localStorage.removeItem('token')
        localStorage.removeItem('failure_time')
        localStorage.removeItem('version')
        account.value = ''
        name.value = ''
        phoneNumber.value = ''
        token.value = ''
        failure_time.value = ''
        version.value = ''
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
      const res = await api.get('server/role/getUserCanAccessPages')
      permissions.value = res.data
      return permissions.value
    }
    // 修改密码
    async function editPassword(data: {
      password: string
      newpassword: string
    }) {
      await api.post('server/user/changePwd', {
        originalPwd: md5(data.password),
        newPwd: md5(data.newpassword),
      })
    }

    // 修改基本信息
    async function editBaseInfo(data: {
      name: string
      phoneNumber: string
    }) {
      const resp:Resp = await api.post('server/user/editBaseInfo', data)
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
      version,
      login,
      logout,
      getPermissions,
      editPassword,
      editBaseInfo,
    }
  },
)

export default useUserStore
