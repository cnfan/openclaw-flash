<script setup lang="ts">
import { isActiveSidebarItem } from "@theme/isActiveSidebarItem";
import { useSidebarItems } from "@theme/useSidebarItems";
import { provide, ref, watch } from "vue";
import { useRoute } from "vuepress/client";
import CustomSidebarItem from "./CustomSidebarItem.vue";

const route = useRoute();
const sidebarItems = useSidebarItems();
const openGroupKey = ref<string | null>(null);

const getGroupKey = (item: any): string => {
  const firstChildLink =
    "children" in item && Array.isArray(item.children) ? item.children[0]?.link : "";
  return `${item.text ?? ""}|${item.link ?? ""}|${firstChildLink ?? ""}`;
};

provide("single-open-sidebar-group-key", openGroupKey);

watch(
  () => [route.path, sidebarItems.value.length],
  () => {
    const activeRoot = sidebarItems.value.find((item) =>
      isActiveSidebarItem(item as any, route)
    ) as any | undefined;
    if (activeRoot) {
      openGroupKey.value = getGroupKey(activeRoot);
      return;
    }

    const firstCollapsibleRoot = (sidebarItems.value as any[]).find(
      (item) => item?.collapsible && !item?.link
    );
    if (firstCollapsibleRoot) {
      openGroupKey.value = getGroupKey(firstCollapsibleRoot);
    }
  },
  { immediate: true }
);
</script>

<template>
  <ul v-if="sidebarItems.length" class="vp-sidebar-items">
    <CustomSidebarItem
      v-for="item in sidebarItems"
      :key="`${item.text}${item.link}`"
      :item="item"
    />
  </ul>
</template>

<style lang="scss">
.vp-sidebar-items {
  margin: 0;
  padding: 1.5rem 0;
  list-style-type: none;

  @media (max-width: 719px) {
    padding: 1rem 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
}
</style>
