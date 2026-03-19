---
title: OpenClaw Flash
---

<script setup>
import { onMounted } from 'vue'

const base = typeof __VUEPRESS_BASE__ === 'string' ? __VUEPRESS_BASE__ : '/'
const normalizedBase = base.endsWith('/') ? base : `${base}/`
const target = `${normalizedBase}installation/installation-guide.html`

onMounted(() => {
  if (typeof window !== 'undefined' && window.location && window.location.pathname !== target) {
    window.location.replace(target)
  }
})
</script>

正在跳转到安装页面...

如果没有自动跳转，请点击：<a :href="target">安装龙虾</a>
