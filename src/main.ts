import './utils/system.copyright'
import ElementPlus from 'element-plus'
import App from './App.vue'
import pinia from './store'
import router from './router'
import useSettingsStore from './store/modules/settings'

// 自定义指令
import directive from '@/utils/directive'
// 加载 svg 图标
import 'virtual:svg-icons-register'
// 全局样式
import '@/assets/styles/globals.scss'
// 加载 iconify 图标（element plus）
import { downloadAndInstall } from '@/iconify-ep'


//引入依赖和语言
import 'highlight.js/styles/stackoverflow-light.css'
import hljs from "highlight.js/lib/core";
import hljsVuePlugin from "@highlightjs/vue-plugin";
//import "highlight.js/lib/common"; //单一加载
//按需引入语言
import javascript from "highlight.js/lib/languages/javascript";
import java from "highlight.js/lib/languages/java";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";
import html from "highlight.js/lib/languages/vbscript-html";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/json";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", html);

const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.use(hljsVuePlugin)

directive(app)
if (useSettingsStore().settings.app.iconifyOfflineUse) {
  downloadAndInstall()
}

app.mount('#app')
