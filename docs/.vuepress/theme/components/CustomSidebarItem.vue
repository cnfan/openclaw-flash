<script setup lang="ts">
import VPAutoLink from "@theme/VPAutoLink.vue";
import VPDropdownTransition from "@theme/VPDropdownTransition.vue";
import { isActiveSidebarItem } from "@theme/isActiveSidebarItem";
import { computed, inject, nextTick, onBeforeUnmount, ref, type Ref } from "vue";
import { useRoute, useRouter } from "vuepress/client";

const { item, depth = 0 } = defineProps<{
  item: any;
  depth?: number;
}>();

const route = useRoute();
const router = useRouter();
const openGroupKey = inject<Ref<string | null> | null>(
  "single-open-sidebar-group-key",
  null
);

const collapsible = computed(() => item?.collapsible);
const isActive = computed(() => isActiveSidebarItem(item, route));
const itemClass = computed(() => ({
  "vp-sidebar-item": true,
  "vp-sidebar-heading": depth === 0,
  active: isActive.value,
  collapsible: collapsible.value
}));

const groupKey = computed(() => {
  const firstChildLink =
    "children" in item && Array.isArray(item.children) ? item.children[0]?.link : "";
  return `${item.text ?? ""}|${item.link ?? ""}|${firstChildLink ?? ""}`;
});

const isTopLevelAccordionGroup = computed(
  () => depth === 0 && collapsible.value && !item?.link && openGroupKey
);

const isOpenDefault = computed(() => (collapsible.value ? isActive.value : true));
const isOpenLocal = ref(isOpenDefault.value);

const isOpen = computed(() =>
  isTopLevelAccordionGroup.value
    ? openGroupKey?.value === groupKey.value
    : isOpenLocal.value
);

const onClick = (event: Event): void => {
  if (!collapsible.value) return;
  event.preventDefault();

  if (isTopLevelAccordionGroup.value) {
    if (openGroupKey?.value !== groupKey.value) {
      openGroupKey!.value = groupKey.value;
    }

    const firstLeafLink =
      "children" in item && Array.isArray(item.children) ? item.children[0]?.link : "";
    if (firstLeafLink && route.path !== firstLeafLink) {
      void router.push(firstLeafLink);
    }
    return;
  }
  isOpenLocal.value = !isOpenLocal.value;
};

const unregisterRouterHook = router.afterEach(() => {
  void nextTick(() => {
    if (isTopLevelAccordionGroup.value) return;
    isOpenLocal.value = isOpenDefault.value;
  });
});

onBeforeUnmount(() => {
  unregisterRouterHook();
});
</script>

<template>
  <li>
    <VPAutoLink v-if="item.link" :class="itemClass" :config="item">
      <template #after>
        <span v-if="collapsible" class="arrow" :class="isOpen ? 'down' : 'right'" />
      </template>
    </VPAutoLink>
    <button
      v-else
      type="button"
      :class="itemClass"
      @click="onClick"
    >
      {{ item.text }}
      <span v-if="collapsible" class="arrow" :class="isOpen ? 'down' : 'right'" />
    </button>

    <VPDropdownTransition v-if="'children' in item && item.children.length">
      <ul v-show="isOpen" class="vp-sidebar-children">
        <CustomSidebarItem
          v-for="child in item.children"
          :key="`${depth}${child.text}${child.link}`"
          :item="child"
          :depth="depth + 1"
        />
      </ul>
    </VPDropdownTransition>
  </li>
</template>

<style lang="scss">
.vp-sidebar-item {
  border-inline-start: 0.25rem solid transparent;
  color: var(--vp-c-text);
  cursor: default;

  &:focus-visible {
    outline-width: 1px;
    outline-offset: -1px;
  }

  &.vp-sidebar-heading {
    box-sizing: border-box;
    width: 100%;
    border: 0;
    background: transparent;
    text-align: start;
    margin: 0;
    padding-block: 0.35rem;
    padding-inline: 1.25rem 1.5rem;
    font-weight: bold;
    font-size: 1.1em;
    transition: color 0.15s ease;

    + .vp-sidebar-children {
      overflow: hidden;
      transition: height 0.1s ease-out;
      margin-bottom: 0.75rem;
    }
  }

  &.collapsible {
    cursor: pointer;
  }

  &:not(.vp-sidebar-heading) {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding-block: 0.35rem;
    padding-inline: 2rem 1rem;
    font-weight: 400;
    font-size: 1em;
    line-height: 1.4;

    + .vp-sidebar-children {
      padding-inline-start: 1rem;
      font-size: 0.95em;
    }

    .vp-sidebar-children .vp-sidebar-children & {
      padding-block: 0.25rem;
      padding-inline: 1.75rem 1rem;

      &.active {
        border-inline-start-color: transparent;
        font-weight: 500;
      }
    }

    a.vp-sidebar-heading + .vp-sidebar-children &.active {
      border-inline-start-color: transparent;
    }
  }

  &.active:not(.vp-sidebar-heading) {
    border-inline-start-color: var(--vp-c-accent);
    color: var(--vp-c-accent);
    font-weight: 600;
  }

  .auto-link {
    display: block;
  }

  &.auto-link {
    display: block;
    cursor: pointer;

    &:hover {
      color: var(--vp-c-accent);
    }
  }
}
</style>
