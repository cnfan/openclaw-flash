import { defineClientConfig } from "vuepress/client";
// @ts-ignore  // 临时忽略类型声明缺失，确保构建通过
import Layout from "./theme/layouts/Layout.vue";
// @ts-ignore  // 临时忽略类型声明缺失，确保构建通过
import SiteMapHome from "./theme/components/SiteMapHome.vue";

const NAV_STACK_KEY = "oc:nav-stack";

type NavStackItem = {
  path: string;
  fullPath: string;
  title: string;
  ts: number;
};

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component("SiteMapHome", SiteMapHome);

    if (typeof window !== "undefined") {
      const normalizeTitle = (rawTitle: string): string => {
        const siteTitle = siteData.value.title;
        const suffix = siteTitle ? ` | ${siteTitle}` : "";
        if (suffix && rawTitle.endsWith(suffix)) return rawTitle.slice(0, -suffix.length).trim();
        return rawTitle.trim();
      };

      const readStack = (): NavStackItem[] => {
        try {
          const raw = window.sessionStorage.getItem(NAV_STACK_KEY);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) return [];
          return parsed
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
              path: typeof item.path === "string" ? item.path : "",
              fullPath: typeof item.fullPath === "string" ? item.fullPath : "",
              title: typeof item.title === "string" ? item.title : "",
              ts: typeof item.ts === "number" ? item.ts : 0
            }))
            .filter((item) => item.path);
        } catch {
          return [];
        }
      };

      const writeStack = (stack: NavStackItem[]): void => {
        try {
          window.sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(stack));
        } catch {
          return;
        }
      };

      router.beforeEach((to, from) => {
        if (!from.path) return true;
        if (!from.matched || from.matched.length === 0) return true;

        const stack = readStack();
        const last = stack[stack.length - 1];
        if (last && last.path === from.path) {
          last.fullPath = from.fullPath || from.path;
          last.title = normalizeTitle(document.title || "");
          last.ts = Date.now();
          writeStack(stack);
        }
        return true;
      });

      router.afterEach((to) => {
        const stack = readStack();
        const toItem: NavStackItem = {
          path: to.path,
          fullPath: to.fullPath || to.path,
          title: "",
          ts: Date.now()
        };

        const last = stack[stack.length - 1];
        const secondLast = stack[stack.length - 2];
        if (last?.path === to.path) {
          last.fullPath = toItem.fullPath;
          last.ts = toItem.ts;
        } else if (secondLast?.path === to.path) {
          stack.pop();
          const newLast = stack[stack.length - 1];
          if (newLast) {
            newLast.fullPath = toItem.fullPath;
            newLast.ts = toItem.ts;
          }
        } else {
          stack.push(toItem);
        }

        if (stack.length > 50) stack.splice(0, stack.length - 50);
        writeStack(stack);

        window.requestAnimationFrame(() => {
          const updated = readStack();
          const top = updated[updated.length - 1];
          if (top && top.path === to.path) {
            top.title = normalizeTitle(document.title || "");
            top.fullPath = to.fullPath || to.path;
            top.ts = Date.now();
            writeStack(updated);
          }
        });
      });
    }
  },
  layouts: {
    Layout
  }
});
