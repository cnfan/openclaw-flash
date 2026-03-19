import { defineClientConfig } from "vuepress/client";
// @ts-ignore  // 临时忽略类型声明缺失，确保构建通过
import Layout from "./theme/layouts/Layout.vue";
// @ts-ignore  // 临时忽略类型声明缺失，确保构建通过
import SiteMapHome from "./theme/components/SiteMapHome.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("SiteMapHome", SiteMapHome);
  },
  layouts: {
    Layout
  }
});
