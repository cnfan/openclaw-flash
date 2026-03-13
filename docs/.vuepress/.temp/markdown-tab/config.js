import { CodeTabs } from "/home/cnfan/openclaw-flash-help/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.125_@vuepress+bundler-vite@2.0.0-rc.27_@types+no_280cd8b1637d6f8c01846f71e1669cb5/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/CodeTabs.js";
import { Tabs } from "/home/cnfan/openclaw-flash-help/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.125_@vuepress+bundler-vite@2.0.0-rc.27_@types+no_280cd8b1637d6f8c01846f71e1669cb5/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/Tabs.js";
import "/home/cnfan/openclaw-flash-help/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.125_@vuepress+bundler-vite@2.0.0-rc.27_@types+no_280cd8b1637d6f8c01846f71e1669cb5/node_modules/@vuepress/plugin-markdown-tab/dist/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
