<route lang="yaml">
name: home
meta:
  title: 主页
</route>

<script lang="ts" setup>
function open(url: string) {
  window.open(url, '_blank')
}

const fantasticStartkitInfo = ref({
  feature: [
    '支持 TypeScript',
    '默认集成 vue-router 和 pinia',
    '全局 SCSS 资源引入',
    '全局组件自动注册',
    '支持 SVG 图标，CSS 精灵图自动合成',
    '支持 mock 数据，可摆脱后端束缚独立开发',
    '支持 gzip / brotli 优化项目体积，提高加载速度',
    '结合 IDE 插件、ESlint 、stylelint 、Git 钩子，轻松实现团队代码规范',
  ],
})

const fantasticAdminInfo = ref({
  imageVisible: false,
  index: 0,
  data: [
    'https://hooray.gitee.io/fantastic-admin/preview1.png',
    'https://hooray.gitee.io/fantastic-admin/preview2.png',
    'https://hooray.gitee.io/fantastic-admin/preview3.png',
    'https://hooray.gitee.io/fantastic-admin/preview4.png',
    'https://hooray.gitee.io/fantastic-admin/preview5.png',
    'https://hooray.gitee.io/fantastic-admin/preview6.png',
  ],
})

const oneStepAdminInfo = ref({
  imageVisible: false,
  index: 0,
  data: [
    'https://hooray.gitee.io/one-step-admin/preview1.png',
    'https://hooray.gitee.io/one-step-admin/preview2.png',
    'https://hooray.gitee.io/one-step-admin/preview3.png',
    'https://hooray.gitee.io/one-step-admin/preview4.png',
    'https://hooray.gitee.io/one-step-admin/preview5.png',
    'https://hooray.gitee.io/one-step-admin/preview6.png',
  ],
})
</script>

<template>
  <div>
    <page-header title="欢迎使用CodeReview管理系统">
      <template #content>
        <div>
          <div style="margin-bottom: 5px;">
            这是IDEA插件<b class="text-emphasis">CodeReviewHelper</b>配套的服务端管理系统，它可以用于团队协作时的代码检视场景。支持管理检视意见、检视意见确认、数据统计、用户管理、系统配置等功能。
          </div>
        </div>
      </template>
      <el-button-group>
        <el-button type="success" size="large" plain @click="open('http://blog.codingcoder.cn/post/codereviewserverdeploydoc.html')">
          帮助文档
        </el-button>
        <el-dropdown>
          <el-button type="primary" size="large">
            源码获取
            <el-icon class="el-icon--right">
              <svg-icon name="ep:arrow-down" />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="open('https://github.com/veezean/IntellijIDEA-CodeReview-Plugin')">
                IDEA插件
              </el-dropdown-item>
              <el-dropdown-item @click="open('https://github.com/veezean/CodeReviewServer')">
                Server后端
              </el-dropdown-item>
              <el-dropdown-item @click="open('https://github.com/veezean/CodeReviewServer_Portal')">
                Server前端
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>
    </page-header>
    <el-row :gutter="20" style="margin: 0 10px;">
      <el-col :lg="8">
        <page-main style="margin: 0;">
          <div class="ecology vue">
            <div class="main">
              <img src="https://cn.vuejs.org/logo.svg" style="width: 30%;">
              <h1>Fantastic-startkit</h1>
              <h2>一款开箱即用的 Vue 项目启动套件</h2>
              <div>
                <el-button type="primary" plain @click="open('https://hooray.gitee.io/fantastic-startkit/')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  访问官网
                </el-button>
                <el-button plain @click="open('https://hooray.github.io/fantastic-startkit/')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  备用地址
                </el-button>
              </div>
            </div>
            <el-divider border-style="dashed" />
            <ul>
              <li v-for="item in fantasticStartkitInfo.feature" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
        </page-main>
      </el-col>
      <el-col :lg="8">
        <page-main style="margin: 0;">
          <div class="ecology fa">
            <div class="main">
              <img src="https://hooray.gitee.io/fantastic-admin/logo.png" style="width: 30%;">
              <h1>Fantastic-admin</h1>
              <h2>一款开箱即用的 Vue 中后台管理系统框架</h2>
              <div>
                <el-button type="primary" plain @click="open('https://hooray.gitee.io/fantastic-admin/')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  访问官网
                </el-button>
                <el-button plain @click="open('https://hooray.github.io/fantastic-admin/')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  备用地址
                </el-button>
              </div>
            </div>
            <el-divider border-style="dashed" />
            <el-carousel trigger="click" indicator-position="none" :interval="5000" height="250px">
              <el-carousel-item v-for="(item, index) in fantasticAdminInfo.data" :key="item">
                <el-image :src="item" fit="cover" style="cursor: pointer; width: 100%; height: 250px; margin: auto;" @click="fantasticAdminInfo.imageVisible = true; fantasticAdminInfo.index = index" />
              </el-carousel-item>
            </el-carousel>
            <el-image-viewer v-if="fantasticAdminInfo.imageVisible" :url-list="fantasticAdminInfo.data" :initial-index="fantasticAdminInfo.index" @close="fantasticAdminInfo.imageVisible = false" />
          </div>
        </page-main>
      </el-col>
      <el-col :lg="8">
        <page-main style="margin: 0;">
          <div class="ecology osa">
            <div class="main">
              <img src="https://hooray.gitee.io/one-step-admin/logo.png" style="width: 30%;">
              <h1>One-step-admin</h1>
              <h2>一款干啥都快人一步的 Vue 中后台系统框架</h2>
              <div>
                <el-button type="primary" plain @click="open('https://hooray.gitee.io/one-step-admin/')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  访问官网
                </el-button>
                <el-button plain @click="open('https://hooray.github.io/one-step-admin/')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  备用地址
                </el-button>
              </div>
            </div>
            <el-divider border-style="dashed" />
            <el-carousel trigger="click" indicator-position="none" :interval="5000" height="250px">
              <el-carousel-item v-for="(item, index) in oneStepAdminInfo.data" :key="item">
                <el-image :src="item" fit="cover" style="cursor: pointer; width: 100%; height: 250px; margin: auto;" @click="oneStepAdminInfo.imageVisible = true; oneStepAdminInfo.index = index" />
              </el-carousel-item>
            </el-carousel>
            <el-image-viewer v-if="oneStepAdminInfo.imageVisible" :url-list="oneStepAdminInfo.data" :initial-index="oneStepAdminInfo.index" @close="oneStepAdminInfo.imageVisible = false" />
          </div>
        </page-main>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.text-emphasis {
  text-emphasis-style: "❤";
}

.ecology {
  padding: 10px 0 0;

  &.vue {
    h1 {
      color: #41b883;
    }
  }

  &.fa {
    h1 {
      color: #e60000;
    }
  }

  &.osa {
    h1 {
      color: #67c23a;
    }
  }

  .main {
    text-align: center;

    img {
      display: block;
      margin: 0 auto;
    }

    h1 {
      margin: 10px auto 0;
      text-align: center;
    }

    h2 {
      font-size: 16px;
      font-weight: normal;
      color: var(--el-text-color-secondary);
      text-align: center;
    }
  }

  .el-carousel {
    box-shadow: var(--el-box-shadow-light);
    transition: var(--el-transition-box-shadow);
  }

  ul li {
    line-height: 28px;
  }
}

.question {
  .answer {
    margin: 20px 0 0;
    padding-left: 20px;
    font-size: 16px;
    color: var(--el-text-color-secondary);

    li {
      margin-bottom: 10px;
      line-height: 1.5;

      &:last-child {
        margin-bottom: 0;
      }
    }

    span {
      color: var(--el-text-color-primary);
      font-weight: bold;
    }
  }
}
</style>
