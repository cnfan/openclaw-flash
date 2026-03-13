import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";

export default defineUserConfig({
  lang: "zh-CN",
  title: "OpenClaw Flash Help",
  description: "OpenClaw Flash 中文帮助文档",
  base: "/",
  bundler: viteBundler(),
  theme: defaultTheme({
    navbar: false,
    sidebar: {
      "/": [
        {
          text: "帮助文档",
          children: [
            "/README.md",
            "/guides/onboard.md",
            "/guides/settings.md",
            "/guides/mechanisms.md",
            "/integrations/feishu.md",
            "/integrations/qq.md",
            "/help-index/README.md"
          ]
        }
      ],
      "/guides/": [
        {
          text: "使用指南",
          children: [
            "/guides/onboard.md",
            "/guides/settings.md",
            "/guides/mechanisms.md"
          ]
        }
      ],
      "/integrations/": [
        {
          text: "渠道接入",
          children: [
            "/integrations/feishu.md",
            "/integrations/qq.md"
          ]
        }
      ],
      "/help-index/": [
        {
          text: "帮助索引",
          children: ["/help-index/README.md"]
        }
      ]
    },
    sidebarDepth: 2,
    editLink: false,
    contributors: false,
    lastUpdated: false
  })
});
