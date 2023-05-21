import type { Settings } from '#/global'

const globalSettings: Settings.all = {
  app: {
    colorScheme: 'light',
    enablePermission: true,
    enableProgress: true,
    enableDynamicTitle: true,
  },
  layout: {
    enableMobileAdaptation: false,
  },
  home: {
    enable: true,
    title: '首页',
  },
  menu: {
    menuMode: 'single',
  },
  topbar: {
    mode: 'fixed',
  },
  toolbar: {
    enableFullscreen: true,
    enableColorScheme: true,
  },
  navSearch: {
    enable: false,
  },
  copyright: {
    enable: true,
    dates: '2023',
    company: 'Veezean@公众号[架构悟道]',
  },
}

export default globalSettings
