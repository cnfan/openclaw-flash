<script setup lang="ts">
import VPPageMeta from "@theme/VPPageMeta.vue";
import VPPageNav from "./VPPageNav.vue";
import type { Slot } from "@vuepress/helper/client";
import { Content } from "vuepress/client";
import DocAnchorPanel from "./DocAnchorPanel.vue";

defineSlots<{
  "top"?: Slot;
  "bottom"?: Slot;
  "content-top"?: Slot;
  "content-bottom"?: Slot;
}>();
</script>

<template>
  <main class="vp-page">
    <slot name="top" />

    <div class="vp-doc-layout">
      <DocAnchorPanel />
      <div class="vp-doc-main" vp-content>
        <slot name="content-top" />
        <Content id="content" />
        <slot name="content-bottom" />
      </div>
    </div>

    <VPPageMeta />
    <VPPageNav />
    <slot name="bottom" />
  </main>
</template>

<style lang="scss">
.vp-page {
  display: block;
  padding-top: var(--navbar-height);
  padding-bottom: 2rem;
  padding-inline-start: var(--sidebar-width);

  @media (max-width: 959px) {
    padding-inline-start: var(--sidebar-width-mobile);
  }

  @media (max-width: 719px) {
    padding-inline-start: 0;
  }
}

.vp-doc-layout {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 1.5rem 1.5rem 0;
}

.vp-doc-main {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: none;
  margin: 0;
  padding-inline-start: 260px;
}

.vp-page .vp-doc-main[vp-content] {
  max-width: 1120px;
  margin: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 260px;
}

@media (max-width: 1279px) {
  .vp-doc-main {
    padding-inline-start: 0;
  }

  .vp-page .vp-doc-main[vp-content] {
    padding-left: 0;
  }
}

@media (max-width: 719px) {
  .vp-doc-layout {
    padding-inline: 1rem;
    padding-top: 1rem;
  }
}
</style>
