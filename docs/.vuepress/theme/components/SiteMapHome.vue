<script setup lang="ts">
import { useData } from "@theme/useData";
import { resolveAutoLink } from "@theme/resolveAutoLink";
import { computed } from "vue";
import { isPlainObject, isString } from "vuepress/shared";
import { useRoutePath } from "vuepress/client";

type NavItem = {
  text?: string;
  link?: string;
};

type SidebarSection = {
  text?: string;
  link?: string;
  children?: unknown[];
};

type DocLink = {
  text: string;
  link: string;
};

const { site, theme } = useData();
const routePath = useRoutePath();

const titleByPath = computed(() => {
  const map = new Map<string, string>();
  const pages = (site.value as any)?.pages as any[] | undefined;
  if (Array.isArray(pages)) {
    for (const p of pages) {
      if (p?.path && p?.title) map.set(p.path, p.title);
    }
  }
  return map;
});

const normalizeDocLink = (raw: unknown): DocLink | null => {
  if (!raw) return null;
  if (isString(raw)) {
    const resolved = resolveAutoLink(raw, routePath.value);
    const text = titleByPath.value.get(resolved.link) ?? resolved.text ?? raw;
    return { text: String(text), link: resolved.link };
  }
  if (isPlainObject(raw)) {
    const obj = raw as any;
    if (!obj.link) return null;
    const resolved = resolveAutoLink(obj.link, routePath.value);
    const text = obj.text ?? titleByPath.value.get(resolved.link) ?? resolved.text ?? obj.link;
    return { text: String(text), link: resolved.link };
  }
  return null;
};

const pickSidebarKey = (link: string, keys: string[]): string => {
  const sorted = [...keys].sort((a, b) => b.length - a.length);
  for (const k of sorted) {
    if (k === "/") continue;
    if (link.startsWith(k)) return k;
  }
  return keys.includes("/") ? "/" : keys[0] ?? "/";
};

const sitemap = computed(() => {
  const navbar = ((theme.value as any)?.navbar ?? []) as NavItem[];
  const sidebar = ((theme.value as any)?.sidebar ?? {}) as Record<string, SidebarSection[]>;
  const sidebarKeys = Object.keys(sidebar);

  const top = navbar
    .filter((n) => n?.text && n?.link)
    .map((n) => {
      const key = pickSidebarKey(n.link!, sidebarKeys);
      const sectionsRaw = Array.isArray(sidebar[key]) ? sidebar[key] : [];
      const sections = sectionsRaw
        .filter((s) => s?.text)
        .map((s) => {
          const docsRaw = Array.isArray(s.children) ? s.children : [];
          const docs: DocLink[] = [];
          const sectionLink = s.link ? normalizeDocLink({ text: s.text, link: s.link }) : null;
          if (sectionLink) docs.push(sectionLink);
          for (const d of docsRaw) {
            const dl = normalizeDocLink(d);
            if (dl) docs.push(dl);
          }
          const seen = new Set<string>();
          const uniqueDocs = docs.filter((d) => {
            if (!d.link || seen.has(d.link)) return false;
            seen.add(d.link);
            return true;
          });
          return {
            text: s.text as string,
            link: s.link as string | undefined,
            docs: uniqueDocs
          };
        });

      return {
        text: n.text as string,
        link: n.link as string,
        docs: sections.flatMap(s => s.docs)
      };
    });

  return top;
});
</script>

<template>
  <div class="sitemap-home">
    <header class="sitemap-header">
      <div class="sitemap-title">网站地图</div>
      <div class="sitemap-subtitle">大类 → 文档</div>
    </header>

    <div class="sitemap-grid">
      <section v-for="cat in sitemap" :key="cat.link" class="sitemap-card">
        <RouterLink class="sitemap-card-title" :to="cat.link">{{ cat.text }}</RouterLink>

        <div class="sitemap-sections">
          <div class="sitemap-links">
            <RouterLink v-for="doc in cat.docs" :key="doc.link" class="sitemap-link" :to="doc.link">
              {{ doc.text }}
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.sitemap-home {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
}

.sitemap-header {
  margin-bottom: 1.25rem;
}

.sitemap-title {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.sitemap-subtitle {
  margin-top: 0.25rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.sitemap-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.sitemap-card {
  border: 1px solid color-mix(in srgb, var(--vp-c-border) 70%, transparent);
  border-radius: 0.9rem;
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  padding: 1rem;
}

.sitemap-card-title {
  display: inline-block;
  font-weight: 800;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  text-decoration: none;
  padding: 0.25rem 0.4rem;
  border-radius: 0.6rem;
}

.sitemap-card-title:hover {
  background: color-mix(in srgb, var(--vp-c-accent) 10%, transparent);
  color: var(--vp-c-accent);
}

.sitemap-sections {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.75rem;
}

.sitemap-section-title {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 750;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.sitemap-section-title:hover {
  color: var(--vp-c-accent);
}

.sitemap-links {
  margin-top: 0.45rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.35rem;
}

.sitemap-link {
  display: block;
  padding: 0.5rem 0.6rem;
  border-radius: 0.7rem;
  border: 1px solid color-mix(in srgb, var(--vp-c-border) 60%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg) 95%, transparent);
  color: var(--vp-c-text);
  text-decoration: none;
  font-size: 0.92rem;
  line-height: 1.3;
}

.sitemap-link:hover {
  border-color: color-mix(in srgb, var(--vp-c-accent) 55%, var(--vp-c-border));
}

@media (max-width: 959px) {
  .sitemap-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 719px) {
  .sitemap-home {
    padding: 1rem 1rem 2rem;
  }

  .sitemap-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>

