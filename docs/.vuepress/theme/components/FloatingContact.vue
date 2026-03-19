<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useRoutePath } from "vuepress/client";

import douyinAvatarUrl from "../../../asserts/douyinhao.png";

const isOpen = ref(false);

const routePath = useRoutePath();
const shouldShowReferenceBack = computed(() => {
  const pathFromRouter = routePath.value ?? "";
  const pathFromLocation =
    typeof window !== "undefined" && window.location?.pathname
      ? window.location.pathname
      : "";
  const path = pathFromRouter || pathFromLocation;
  const isReference = /(?:^|\/)(refrences|references)(?:\/|\.html$)/.test(path);
  const hasHistory =
    typeof window !== "undefined" && window.history ? window.history.length > 1 : false;
  return isReference || hasHistory;
});

const backToSafePlace = (event?: Event): void => {
  event?.preventDefault();
  const base = typeof __VUEPRESS_BASE__ === "string" ? __VUEPRESS_BASE__ : "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;

  if (typeof window !== "undefined" && window.history && window.history.length > 1) {
    window.history.back();
    return;
  }

  if (typeof window !== "undefined") {
    window.location.assign(`${normalizedBase}installation/installation-guide.html`);
  }
};

const open = (): void => {
  isOpen.value = true;
};

const close = (): void => {
  isOpen.value = false;
};

const toggle = (): void => {
  isOpen.value = !isOpen.value;
};

const douyinOpenUrl = "https://v.douyin.com/8T5oV4bKbG4/";
const tipText = "内容太多，难免有误。\n抖音联系作者";

let navigateTimer: number | null = null;
let closeTimer: number | null = null;

const openTipAndNavigate = (event?: Event): void => {
  event?.preventDefault();
  isOpen.value = true;

  if (typeof window === "undefined") return;

  if (navigateTimer) window.clearTimeout(navigateTimer);
  if (closeTimer) window.clearTimeout(closeTimer);

  closeTimer = window.setTimeout(() => {
    isOpen.value = false;
  }, 700);

  navigateTimer = window.setTimeout(() => {
    const w = window.open(douyinOpenUrl, "_blank", "noopener,noreferrer");
    if (!w) window.location.assign(douyinOpenUrl);
  }, 880);
};

onBeforeUnmount(() => {
  if (typeof window !== "undefined" && navigateTimer) {
    window.clearTimeout(navigateTimer);
    navigateTimer = null;
  }
  if (typeof window !== "undefined" && closeTimer) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
});
</script>

<template>
  <div class="floating-contact" @mouseenter="open" @mouseleave="close">
    <a
      v-if="shouldShowReferenceBack"
      class="back-button"
      href="#"
      aria-label="返回"
      @click="backToSafePlace"
    >
      返回
    </a>

    <a
      class="avatar-link"
      :href="douyinOpenUrl"
      aria-label="打开抖音"
      @click="openTipAndNavigate"
      @keydown.enter.prevent="openTipAndNavigate"
    >
      <img class="avatar" :src="douyinAvatarUrl" alt="打开抖音" />
    </a>

    <div class="tooltip" :class="{ open: isOpen }" role="tooltip">
      {{ tipText }}
    </div>
  </div>
</template>

<style scoped>
.floating-contact {
  position: fixed;
  right: 18px;
  top: 45vh;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  border: 2px solid rgba(34, 197, 94, 0.95);
  background: rgba(255, 255, 255, 0.96);
  color: rgba(22, 163, 74, 0.98);
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.back-button:hover {
  border-color: rgba(22, 163, 74, 0.98);
  background: rgba(240, 253, 244, 0.98);
  box-shadow: 0 10px 28px rgba(22, 163, 74, 0.18);
}

.avatar-button {
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.avatar-link {
  display: inline-flex;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  border: 2px solid rgba(255, 255, 255, 0.9);
}

.tooltip {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  width: clamp(180px, 62vw, 280px);
  max-width: calc(100vw - 110px);
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.96);
  color: rgba(10, 10, 10, 0.9);
  font-size: 13px;
  line-height: 1.35;
  white-space: pre-line;
  opacity: 0;
  transform: translateY(-50%) translateX(4px);
  transition: opacity 120ms ease, transform 120ms ease;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.floating-contact:hover .tooltip,
.tooltip.open {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

@media (max-width: 719px) {
  .floating-contact {
    right: 12px;
  }

  .back-button {
    width: 48px;
    height: 48px;
    font-size: 14px;
  }

  .avatar {
    width: 48px;
    height: 48px;
  }
}
</style>
