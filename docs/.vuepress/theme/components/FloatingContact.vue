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
const tipText = "有问题点击我";

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
  right: calc(1rem - 1px);
  bottom: 8rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.back-button {
  display: none;
  align-items: center;
  justify-content: center;
  width: var(--oc-fab-size);
  height: var(--oc-fab-size);
  border-radius: 9999px;
  border: 1px solid rgba(34, 197, 94, 0.95);
  background: rgba(255, 255, 255, 0.96);
  color: rgba(22, 163, 74, 0.98);
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  margin-bottom: 12px;
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  border-color: rgba(22, 163, 74, 0.98);
  background: rgba(240, 253, 244, 0.98);
  box-shadow: 2px 2px 12px 4px rgba(22, 163, 74, 0.15);
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
  width: var(--oc-fab-size);
  height: var(--oc-fab-size);
  border-radius: 9999px;
  object-fit: cover;
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.tooltip {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  width: auto;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 13px;
  line-height: 1;
  opacity: 0;
  transform: translateY(-50%) translateX(4px);
  transition: opacity 120ms ease, transform 120ms ease;
  pointer-events: none;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  border-width: 4px 0 4px 8px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.75);
}

.floating-contact:hover .tooltip,
.tooltip.open {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

@media (max-width: 959px) {
  .floating-contact {
    right: calc(1rem - 1px);
    transform: scale(0.8);
    transform-origin: 100% 100%;
  }
}

@media (max-width: 719px) {
  .floating-contact {
    right: calc(1rem - 1px);
  }

  .back-button {
    display: inline-flex;
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
