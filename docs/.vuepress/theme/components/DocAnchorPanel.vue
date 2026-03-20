<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouteLink, onContentUpdated, useRoute } from "vuepress/client";

type HeadingItem = {
  id: string;
  text: string;
  level: number;
};

const headings = ref<HeadingItem[]>([]);
const activeId = ref("");
const panelRef = ref<HTMLElement | null>(null);
let ticking = false;
const route = useRoute();

type NavStackItem = {
  path: string;
  fullPath: string;
  title: string;
  ts: number;
};

const NAV_STACK_KEY = "oc:nav-stack";

const visibleHeadings = computed(() => headings.value);
const isReferencePage = computed(() => route.path.includes("/refrences/"));
const section = computed(() => {
  const match = route.path.match(/^\/([^/]+)\/refrences\//);
  return match ? match[1] : "";
});

const referenceBackConfig = computed(() => {
  if (route.path.startsWith("/installation/refrences/diagnose-lobster.html")) {
    return { title: "让龙虾飞", path: "/installation/workspace-control.html" };
  }
  if (section.value === "guides") return { title: "新手玩家", path: "/guides/openclaw-self-intro.html" };
  if (section.value === "installation") return { title: "快速安装", path: "/installation/installation-guide.html" };
  if (section.value === "integrations") return { title: "渠道接入", path: "/integrations/feishu.html" };
  if (section.value === "help-index") return { title: "帮助索引", path: "/help-index/help-index.html" };
  return { title: "上级", path: "/" };
});

const stackBack = computed<NavStackItem | null>(() => {
  if (typeof window === "undefined") return null;
  if (!isReferencePage.value) return null;
  try {
    const raw = window.sessionStorage.getItem(NAV_STACK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 2) return null;
    for (let i = parsed.length - 1; i >= 0; i -= 1) {
      const cur = parsed[i] as Partial<NavStackItem>;
      if (!cur || typeof cur !== "object") continue;
      if (cur.path === route.path) {
        const prev = parsed[i - 1] as Partial<NavStackItem> | undefined;
        if (!prev || typeof prev.path !== "string") return null;
        return {
          path: prev.path,
          fullPath: typeof prev.fullPath === "string" && prev.fullPath ? prev.fullPath : prev.path,
          title: typeof prev.title === "string" ? prev.title : "",
          ts: typeof prev.ts === "number" ? prev.ts : 0
        };
      }
    }
    return null;
  } catch {
    return null;
  }
});

const fallbackPath = computed(() => {
  return referenceBackConfig.value.path;
});

const parentTitle = computed(() => {
  return referenceBackConfig.value.title;
});

const backTarget = computed(() => {
  const stored = stackBack.value;
  if (stored?.path) {
    const title = stored.title?.trim();
    return {
      path: stored.fullPath || stored.path,
      title: title || parentTitle.value
    };
  }
  return {
    path: fallbackPath.value,
    title: parentTitle.value
  };
});

const collectHeadings = (): void => {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("#content h2[id], #content h3[id]")
  );
  headings.value = nodes
    .map((node) => ({
      id: node.id,
      text: node.textContent?.trim() ?? "",
      level: Number(node.tagName.slice(1))
    }))
    .filter((item) => item.id && item.text);
  if (!headings.value.some((item) => item.id === activeId.value)) {
    activeId.value = headings.value[0]?.id ?? "";
  }
};

const updateActiveHeading = (): void => {
  if (headings.value.length === 0) {
    activeId.value = "";
    return;
  }

  const doc = document.documentElement;
  const viewportBottom = window.scrollY + window.innerHeight;
  const pageBottom = doc.scrollHeight;
  if (viewportBottom >= pageBottom - 2) {
    activeId.value = headings.value[headings.value.length - 1].id;
    return;
  }

  const topOffset = 96;
  const probeLine = Math.max(topOffset, Math.round(window.innerHeight * 0.35));
  let currentId = headings.value[0]?.id ?? "";
  for (const heading of headings.value) {
    const element = document.getElementById(heading.id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= probeLine) {
      currentId = heading.id;
    } else {
      break;
    }
  }
  activeId.value = currentId;
};

const onScroll = (): void => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveHeading();
    ticking = false;
  });
};

const syncAnchorScrollToActive = (): void => {
  const panel = panelRef.value;
  if (!panel || !activeId.value) return;

  const buttons = panel.querySelectorAll<HTMLButtonElement>(".anchor-item");
  let activeButton: HTMLButtonElement | null = null;
  for (const button of buttons) {
    if (button.dataset.anchorId === activeId.value) {
      activeButton = button;
      break;
    }
  }
  if (!activeButton) return;

  const panelRect = panel.getBoundingClientRect();
  const buttonRect = activeButton.getBoundingClientRect();
  const edgePadding = 8;
  const outOfViewTop = buttonRect.top < panelRect.top + edgePadding;
  const outOfViewBottom = buttonRect.bottom > panelRect.bottom - edgePadding;
  if (outOfViewTop || outOfViewBottom) {
    activeButton.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
  }
};

const scrollToHeading = (id: string): void => {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
};

onMounted(() => {
  collectHeadings();
  updateActiveHeading();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onContentUpdated(() => {
  collectHeadings();
  updateActiveHeading();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});

watch(activeId, () => {
  void nextTick(() => {
    syncAnchorScrollToActive();
  });
});
</script>

<template>
  <aside v-if="headings.length || isReferencePage" ref="panelRef" class="doc-anchor-panel" aria-label="页面锚点导航">
    <RouteLink v-if="isReferencePage" class="anchor-title anchor-title-back" :to="backTarget.path">
      返回 {{ backTarget.title }}
    </RouteLink>
    <div v-else class="anchor-title">本页目录</div>
    <ul v-if="headings.length" class="anchor-list">
      <li v-for="item in visibleHeadings" :key="item.id">
        <button
          type="button"
          class="anchor-item"
          :data-anchor-id="item.id"
          :class="{
            active: item.id === activeId,
            'is-sub': item.level > 2
          }"
          @click="scrollToHeading(item.id)"
        >
          {{ item.text }}
        </button>
      </li>
    </ul>
  </aside>
</template>

<style scoped lang="scss">
.doc-anchor-panel {
  position: fixed;
  top: calc(var(--navbar-height) + 1rem);
  left: calc(var(--sidebar-width) + 1rem);
  width: 220px;
  max-height: calc(100vh - var(--navbar-height) - 2rem);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 0.25rem 0;
}

.anchor-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 0.6rem;
}

.anchor-title-back {
  display: inline-block;
  text-decoration: none;
  border: 1px solid var(--vp-c-accent-bg);
  background: var(--vp-c-accent-soft);
  color: var(--vp-c-accent);
  padding: 0.24rem 0.56rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.anchor-title-back:hover {
  background: var(--vp-c-accent-bg);
  color: var(--vp-c-accent-text);
}

.anchor-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.anchor-item {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.35;
  padding: 0.36rem 0.4rem;
  border-radius: 6px;
  cursor: pointer;
}

.anchor-item:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.anchor-item.active {
  color: var(--vp-c-accent);
  background: var(--vp-c-accent-soft);
  font-weight: 600;
}

.anchor-item.is-sub {
  padding-inline-start: 1rem;
}

@media (max-width: 959px) {
  .doc-anchor-panel {
    left: calc(var(--sidebar-width-mobile) + 0.75rem);
    width: 200px;
  }
}

@media (max-width: 1279px) {
  .doc-anchor-panel {
    display: none;
  }
}
</style>
