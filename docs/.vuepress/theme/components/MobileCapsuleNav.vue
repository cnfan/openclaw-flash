<script setup lang="ts">
import VPAutoLink from "@theme/VPAutoLink.vue";
import { isActiveSidebarItem } from "@theme/isActiveSidebarItem";
import { useSidebarItems } from "@theme/useSidebarItems";
import { computed, ref, watch } from "vue";
import { useRoute } from "vuepress/client";

const route = useRoute();
const sidebarItems = useSidebarItems();

const getGroupKey = (item: any): string => {
  const firstChildLink =
    "children" in item && Array.isArray(item.children) ? item.children[0]?.link : "";
  return `${item.text ?? ""}|${item.link ?? ""}|${firstChildLink ?? ""}`;
};

const activeGroupKey = ref<string | null>(null);

watch(
  () => [route.path, sidebarItems.value.length],
  () => {
    const activeRoot = (sidebarItems.value as any[]).find((item) =>
      isActiveSidebarItem(item, route)
    );
    if (activeRoot) {
      activeGroupKey.value = getGroupKey(activeRoot);
      return;
    }
    activeGroupKey.value = (sidebarItems.value as any[])[0]
      ? getGroupKey((sidebarItems.value as any[])[0])
      : null;
  },
  { immediate: true }
);

const activeRoot = computed(() =>
  (sidebarItems.value as any[]).find((item) => getGroupKey(item) === activeGroupKey.value)
);

const flattenLinks = (items: any[], out: any[] = []): any[] => {
  for (const item of items) {
    if (!item) continue;
    if (item.link) out.push({ text: item.text, link: item.link });
    if (Array.isArray(item.children) && item.children.length) flattenLinks(item.children, out);
  }
  return out;
};

const activeLinks = computed(() => {
  const root = activeRoot.value;
  if (!root) return [];
  const links: any[] = [];
  if (root.link) links.push({ text: root.text, link: root.link });
  if (Array.isArray(root.children) && root.children.length) flattenLinks(root.children, links);
  const seen = new Set<string>();
  return links.filter((l) => {
    if (!l?.link || seen.has(l.link)) return false;
    seen.add(l.link);
    return true;
  });
});

const toggleGroup = (item: any): void => {
  const key = getGroupKey(item);
  activeGroupKey.value = activeGroupKey.value === key ? null : key;
};
</script>

<template>
  <div v-if="sidebarItems.length" class="mobile-capsule-nav">
    <div class="capsule-grid">
      <button
        v-for="item in sidebarItems"
        :key="getGroupKey(item)"
        class="capsule"
        :class="{ active: getGroupKey(item) === activeGroupKey }"
        type="button"
        @click="toggleGroup(item)"
      >
        {{ item.text }}
      </button>
    </div>

    <div v-if="activeRoot && activeGroupKey" class="panel">
      <div class="panel-title">{{ activeRoot.text }}</div>
      <div class="panel-links">
        <VPAutoLink
          v-for="linkItem in activeLinks"
          :key="linkItem.link"
          class="panel-link"
          :config="linkItem"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-capsule-nav {
  display: none;
}

@media (max-width: 719px) {
  .mobile-capsule-nav {
    display: block;
    padding: 0.75rem 0.9rem;
    border-bottom: 1px solid var(--vp-c-border);
    background: var(--vp-navbar-c-bg);
  }

  .capsule-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .capsule {
    height: 2.25rem;
    padding: 0 0.9rem;
    border-radius: 9999px;
    border: 1px solid var(--vp-c-border);
    background: color-mix(in srgb, var(--vp-c-bg) 85%, transparent);
    color: var(--vp-c-text);
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
    cursor: pointer;
  }

  .capsule.active {
    border-color: var(--vp-c-accent);
    color: var(--vp-c-accent);
    background: color-mix(in srgb, var(--vp-c-accent) 10%, transparent);
  }

  .panel {
    margin-top: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 0.75rem;
    background: var(--vp-c-bg);
  }

  .panel-title {
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

  .panel-links {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0.35rem;
  }

  .panel-link {
    display: block;
    padding: 0.5rem 0.6rem;
    border-radius: 0.6rem;
    border: 1px solid color-mix(in srgb, var(--vp-c-border) 60%, transparent);
    background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  }

  .panel-link:hover {
    border-color: var(--vp-c-accent);
  }
}
</style>
