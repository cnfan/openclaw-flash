import { GitContributors } from "/home/cnfan/openclaw-flash-help/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.125_@vuepress+bundler-vite@2.0.0-rc.27_@types+node@25.5.0_485eedd0aef183c25bf3a79ee426d2a9/node_modules/@vuepress/plugin-git/dist/client/components/GitContributors.js";
import { GitChangelog } from "/home/cnfan/openclaw-flash-help/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.125_@vuepress+bundler-vite@2.0.0-rc.27_@types+node@25.5.0_485eedd0aef183c25bf3a79ee426d2a9/node_modules/@vuepress/plugin-git/dist/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
