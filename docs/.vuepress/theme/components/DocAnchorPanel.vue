<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { onContentUpdated } from "vuepress/client";

type HeadingItem = {
  id: string;
  text: string;
  level: number;
};

const headings = ref<HeadingItem[]>([]);
const activeId = ref("");
let ticking = false;

const visibleHeadings = computed(() => headings.value);

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
  const topOffset = 96;
  let currentId = headings.value[0]?.id ?? "";
  for (const heading of headings.value) {
    const element = document.getElementById(heading.id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= topOffset) {
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
</script>

<template>
  <aside v-if="headings.length" class="doc-anchor-panel" aria-label="页面锚点导航">
    <div class="anchor-title">本页目录</div>
    <ul class="anchor-list">
      <li v-for="item in visibleHeadings" :key="item.id">
        <button
          type="button"
          class="anchor-item"
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
  overflow: visible;
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

.anchor-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: visible;
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
