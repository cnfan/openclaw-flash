<script setup lang="ts">
import VPAutoLink from "@theme/VPAutoLink.vue";
import { useData } from "@theme/useData";
import { resolveAutoLink } from "@theme/resolveAutoLink";
import { useSidebarItems } from "@theme/useSidebarItems";
import { useNavigate } from "@theme/useNavigate";
import { computed, onBeforeUnmount, onMounted } from "vue";
import { isPlainObject, isString } from "vuepress/shared";
import { useRoutePath } from "vuepress/client";

const { frontmatter, themeLocale } = useData();
const navigate = useNavigate();
const routePath = useRoutePath();
const sidebarItems = useSidebarItems();

const navbarLabel = computed(() => themeLocale.value.pageNavbarLabel ?? "page navigation");

const normalizeAutoLink = (raw: any): any | null => {
  if (!raw) return null;
  if (isString(raw)) {
    return resolveAutoLink(raw, routePath.value);
  }
  if (isPlainObject(raw)) {
    if ((raw as any).link) {
      return { ...(raw as any), link: resolveAutoLink((raw as any).link, routePath.value).link };
    }
    return null;
  }
  return null;
};

const flattenDocLinks = (items: any[], out: any[] = []): any[] => {
  for (const rawItem of items) {
    if (!rawItem) continue;

    if (isString(rawItem)) {
      const resolved = normalizeAutoLink(rawItem);
      if (resolved?.link) out.push(resolved);
      continue;
    }

    const item = rawItem as any;
    const children = Array.isArray(item.children) ? item.children : [];
    const firstChildResolved = children.length > 0 ? normalizeAutoLink(children[0]) : null;
    const itemResolved = item.link ? normalizeAutoLink(item) : null;

    if (itemResolved?.link) {
      if (!(firstChildResolved?.link && firstChildResolved.link === itemResolved.link)) {
        out.push(itemResolved);
      }
    }

    if (children.length > 0) flattenDocLinks(children, out);
  }
  return out;
};

const allDocLinks = computed(() => {
  const links = flattenDocLinks(sidebarItems.value as any[], []);
  const seen = new Set<string>();
  return links.filter((l) => {
    if (!l?.link || seen.has(l.link)) return false;
    seen.add(l.link);
    return true;
  });
});

const resolveFrontmatterLink = (value: any): any => {
  if (value === false) return false;
  if (isString(value)) return resolveAutoLink(value, routePath.value);
  if (isPlainObject(value)) {
    const resolved = resolveAutoLink((value as any).link, routePath.value);
    return { ...(value as any), link: resolved.link };
  }
  return null;
};

const findSibling = (offset: -1 | 1): any | null => {
  const items = allDocLinks.value as any[];
  const idx = items.findIndex((i) => i.link === routePath.value);
  if (idx === -1) return null;
  const candidate = items[idx + offset];
  return candidate?.link ? candidate : null;
};

const prevLink = computed(() => {
  const fm = resolveFrontmatterLink(frontmatter.value.prev);
  if (fm === false) return null;
  return fm ?? (themeLocale.value.prev === false ? null : findSibling(-1));
});

const nextLink = computed(() => {
  const fm = resolveFrontmatterLink(frontmatter.value.next);
  if (fm === false) return null;
  return fm ?? (themeLocale.value.next === false ? null : findSibling(1));
});

const onKeydown = (event: KeyboardEvent): void => {
  if (event.altKey) {
    if (event.key === "ArrowRight") {
      if (nextLink.value) {
        navigate(nextLink.value.link);
        event.preventDefault();
      }
    } else if (event.key === "ArrowLeft" && prevLink.value) {
      navigate(prevLink.value.link);
      event.preventDefault();
    }
  }
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onKeydown);
  }
});
</script>

<template>
  <nav v-if="prevLink || nextLink" class="vp-page-nav" :aria-label="navbarLabel">
    <VPAutoLink v-if="prevLink" class="prev" :config="prevLink">
      <div class="hint">
        <span class="arrow left" />
        {{ themeLocale.prev ?? "Prev" }}
      </div>
      <div class="link">
        <span class="external-link">{{ prevLink.text }}</span>
      </div>
    </VPAutoLink>

    <VPAutoLink v-if="nextLink" class="next" :config="nextLink">
      <div class="hint">
        {{ themeLocale.next ?? "Next" }}
        <span class="arrow right" />
      </div>
      <div class="link">
        <span class="external-link">{{ nextLink.text }}</span>
      </div>
    </VPAutoLink>
  </nav>
</template>

<style lang="scss">
$MQNarrow: 959px;

.vp-page-nav {
  display: flex;
  flex-wrap: wrap;

  max-width: var(--content-width, 740px);
  min-height: 2rem;
  margin-inline: auto;
  margin-top: 0;
  padding: 1rem 2rem 0;
  border-top: 1px solid var(--vp-c-divider);

  transition: border-top var(--vp-t-color);

  @media (max-width: $MQNarrow) {
    padding-inline: 1rem;
  }

  @media print {
    display: none;
  }

  .auto-link {
    display: inline-block;
    flex-grow: 1;

    margin: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.25rem;

    &:hover {
      background: var(--vp-c-control);
    }

    &.external-link::after {
      display: none;
    }

    &:not(.external-link) .external-link::after {
      display: none;
    }

    .hint {
      color: var(--vp-c-text-mute);
      font-size: 0.875rem;
      line-height: 2;
    }
  }

  .prev {
    text-align: start;
  }

  .next {
    text-align: end;
  }
}
</style>
