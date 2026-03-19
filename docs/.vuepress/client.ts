import { defineClientConfig } from "vuepress/client";
import Layout from "./theme/layouts/Layout.vue";
import SiteMapHome from "./theme/components/SiteMapHome.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("SiteMapHome", SiteMapHome);
  },
  layouts: {
    Layout
  }
});
