<route lang="yaml">
name: home
meta:
  title: 主页
</route>

<script lang="ts" setup>
function open(url: string) {
  window.open(url, '_blank')
}

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
        <el-button type="success" size="large" plain @click="open('https://blog.codingcoder.cn/post/codereviewserverdeploydoc.html')">
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
      <el-col>
        <page-main style="margin: 0;">
          <div class="ecology vue">
            <div class="main">
              <img src="../assets/images/plugin.png" style="width: 50%;">
              <h1>配套CodeReview IDEA插件</h1>
              <h2>支持在IDEA中进行便捷的代码review与意见记录、结合服务端实现便捷的团队代码检视协作。</h2>
              <div>
                <el-button type="primary" plain @click="open('https://blog.codingcoder.cn/post/codereviewhelperdoc.html')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  使用教程
                </el-button>
                <el-button plain @click="open('https://blog.codingcoder.cn/post/codereviewversions.html')">
                  <template #icon>
                    <el-icon>
                      <svg-icon name="ep:link" />
                    </el-icon>
                  </template>
                  插件获取
                </el-button>
              </div>
            </div>
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
