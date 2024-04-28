<script lang="ts" setup name="AppSetting">
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import eventBus from '@/utils/eventBus'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'
import useUserStore from '@/store/modules/user'

const route = useRoute()

const settingsStore = useSettingsStore()
const menuStore = useMenuStore()
const userStore = useUserStore()

const isShow = ref(false)

watch(() => settingsStore.settings.menu.menuMode, (value) => {
  if (value === 'single') {
    menuStore.setActived(0)
  }
  else {
    menuStore.setActived(route.fullPath)
  }
})

onMounted(() => {
  eventBus.on('global-version-help', () => {
    isShow.value = !isShow.value
  })
})

const { copy, copied, isSupported } = useClipboard()

watch(copied, (val) => {
  if (val) {
    ElMessage.success('复制成功，请粘贴到 src/settings.ts 文件中！')
  }
})

function handleCopy() {
  copy(JSON.stringify(settingsStore.settings, null, 2))
}

function open(url: string) {
  window.open(url, '_blank')
}
</script>

<template>
  <div>
    <el-drawer v-model="isShow" title="版本&帮助" direction="rtl" :size="600">
    <page-header title="欢迎使用CodeReview管理系统" />
      <div style="margin:20px">
        这是IDEA插件<b class="text-emphasis">CodeReviewHelper</b>配套的服务端管理系统，它可以用于团队协作时的代码检视场景。支持管理检视意见、检视意见确认、数据统计、用户管理、系统配置等功能。
        <el-button type="primary" size="large" text @click="open('https://mp.weixin.qq.com/s/2IQVa1ROvXeYYFECKlZAhA')">
          了解更多
        </el-button>
      </div>
      <el-divider>版本信息</el-divider>
      <div style="margin-left:20px;">
        <div>
          服务端版本：{{ userStore.version }}
          <el-button type="danger" size="large" text @click="open('https://mp.weixin.qq.com/s/yTR0iTDNGcpzQqvbS7DkjQ')">
            更新了啥
          </el-button>
        </div>
        <div>
          本系统最好结合配套IDEA插件一起使用，获取最佳使用体验。
          <el-button type="primary" size="large" text @click="open('https://blog.codingcoder.cn/post/codereviewversions.html')">
            点此获取
          </el-button>
        </div>
      </div>
      <el-divider>帮助文档</el-divider>
      <div style="margin:20px;">
          <el-button type="success" size="default" plain @click="open('https://blog.codingcoder.cn/post/codereviewserverdeploydoc.html')">
            使用教程（服务端）
          </el-button>
          <el-button type="primary" size="default" plain @click="open('https://blog.codingcoder.cn/post/codereviewhelperdoc.html')">
            使用教程（插件端）
          </el-button>
      </div>
      <el-divider>源码获取</el-divider>
      <div style="margin:20px;">
          本软件服务端与客户端全套代码开源，您可以获取源码进行二次开发定制。获取源码、以及源码介绍，您可以
          <el-button type="primary" size="large" text @click="open('https://blog.codingcoder.cn/post/codereviewserverdeploydoc.html')">
            点此获取
          </el-button>
      </div>
      <el-divider>问题反馈&功能建议</el-divider>
      <div style="margin:20px">
        <el-alert
          title="感谢选择使用本软件。功能持续迭代中，如果您在使用中有好的想法、或者对功能有诉求，可以通过下面方式联系开发者反馈。"
          type="warning"
          :closable="false"
        />
      </div>
      <div style="margin:20px">
        <img src="../../../assets/images/contact1.png" style="width: 100%;margin-top:20px">
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-drawer__header) {
  margin-bottom: initial;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-drawer__footer) {
  padding: 20px;
  border-top: 1px solid var(--el-border-color);
  transition: var(--el-transition-border);

  .el-button {
    width: 100%;
  }
}

:deep(.el-divider) {
  margin: 36px 0 24px;
}

.color-scheme {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;

  $width: 50px;

  .switch {
    width: $width;
    height: 30px;
    border-radius: 15px;
    cursor: pointer;
    background-color: var(--el-fill-color-darker);
    transition: background-color 0.3s;

    &.dark {
      .icon {
        margin-left: calc($width - 24px - 3px);
      }
    }

    .icon {
      margin: 3px;
      padding: 5px;
      font-size: 24px;
      border-radius: 50%;
      background-color: var(--el-fill-color-lighter);
      transition: margin-left 0.3s, background-color 0.3s;
    }
  }
}

.menu-mode {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;

  .mode {
    position: relative;
    width: 80px;
    height: 55px;
    margin: 10px;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    background-color: var(--g-app-bg);
    box-shadow: 0 0 5px 1px var(--el-border-color-lighter);
    transition: 0.2s;

    &:hover {
      box-shadow: 0 0 5px 1px var(--el-border-color-darker);
    }

    &.active {
      box-shadow: 0 0 0 2px var(--el-color-primary);
    }

    &::before,
    &::after,
    .mode-container {
      pointer-events: none;
      position: absolute;
      border-radius: 3px;
    }

    .mode-container::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: var(--g-sub-sidebar-menu-active-bg);
      opacity: 0.2;
    }

    &-side {
      &::before {
        content: "";
        top: 5px;
        left: 5px;
        bottom: 5px;
        width: 10px;
        background-color: var(--g-sub-sidebar-menu-active-bg);
      }

      &::after {
        content: "";
        top: 5px;
        left: 20px;
        bottom: 5px;
        width: 15px;
        background-color: var(--g-sub-sidebar-menu-active-bg);
        opacity: 0.5;
      }

      .mode-container {
        top: 5px;
        left: 40px;
        right: 5px;
        bottom: 5px;
        border: 1px dashed var(--g-sub-sidebar-menu-active-bg);
      }
    }

    &-head {
      &::before {
        content: "";
        top: 5px;
        left: 5px;
        right: 5px;
        height: 10px;
        background-color: var(--g-sub-sidebar-menu-active-bg);
      }

      &::after {
        content: "";
        top: 20px;
        left: 5px;
        bottom: 5px;
        width: 15px;
        background-color: var(--g-sub-sidebar-menu-active-bg);
        opacity: 0.5;
      }

      .mode-container {
        top: 20px;
        left: 25px;
        right: 5px;
        bottom: 5px;
        border: 1px dashed var(--g-sub-sidebar-menu-active-bg);
      }
    }

    &-single {
      &::before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        bottom: 5px;
        width: 15px;
        background-color: var(--g-sub-sidebar-menu-active-bg);
        opacity: 0.5;
      }

      .mode-container {
        top: 5px;
        left: 25px;
        right: 5px;
        bottom: 5px;
        border: 1px dashed var(--g-sub-sidebar-menu-active-bg);
      }
    }

    i {
      position: absolute;
      right: 10px;
      bottom: 10px;
      display: none;
    }

    &.active i {
      display: block;
      color: var(--el-color-primary);
    }
  }
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s;

  &:hover {
    background: var(--el-fill-color);
  }

  .label {
    font-size: 14px;
    color: var(--el-text-color-regular);
    display: flex;
    align-items: center;

    i {
      margin-left: 4px;
      font-size: 17px;
      color: var(--el-color-warning);
      cursor: help;
    }
  }

  .el-switch {
    height: auto;
  }

  .el-input {
    width: 150px;
  }
}
</style>
