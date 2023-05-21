<route lang="yaml">
meta:
  enabled: false
</route>

<script lang="ts">
import api from '@/api'

api.get('xxx', {

}).then((resp) => {
  // 对结果进行处理

})

api.post('news/create', {
  title: '新闻标题',
  content: '新闻内容',
}).then((res) => {
  // 后续业务代码
})
</script>

<template>
  <page-main>
    <router-link :to="{ name: 'AllComments' }">
      查看详情页333
    </router-link>
  </page-main>
</template>
