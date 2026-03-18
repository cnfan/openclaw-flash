import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  lang: "zh-CN",
  title: "OpenClaw Flash Help",
  description: "OpenClaw Flash 中文帮助文档",
  base: "/openclaw-flash/",
  clientConfigFile: path.resolve(__dirname, "./client.ts"),
  bundler: viteBundler(),
  theme: defaultTheme({
    navbar: [
      {
        text: "教程",
        link: "/guides/onboard.html"
      }
    ],
    sidebar: {
      "/": [
        {
          text: "快速安装",
          collapsible: true,
          children: [
            "/installation/windows-wsl2.md",
            "/installation/windows-vmware.md",
            "/installation/windows-native.md"
          ]
        },
        {
          text: "基础指南",
          collapsible: true,
          children: [
            "/README.md",
            "/guides/onboard.md",
            "/guides/settings.md",
            "/guides/mechanisms.md"
          ]
        },
        {
          text: "渠道接入",
          collapsible: true,
          children: ["/integrations/feishu.md", "/integrations/qq.md"]
        },
        {
          text: "帮助索引",
          collapsible: true,
          children: ["/help-index/README.md"]
        }
      ],
      "/guides/": [
        {
          text: "快速安装",
          collapsible: true,
          children: [
            "/installation/windows-wsl2.md",
            "/installation/windows-vmware.md",
            "/installation/windows-native.md"
          ]
        },
        {
          text: "基础指南",
          collapsible: true,
          children: ["/guides/onboard.md", "/guides/settings.md", "/guides/mechanisms.md"]
        },
        {
          text: "渠道接入",
          collapsible: true,
          children: ["/integrations/feishu.md", "/integrations/qq.md"]
        },
        {
          text: "帮助索引",
          collapsible: true,
          children: ["/help-index/README.md"]
        }
      ],
      "/integrations/": [
        {
          text: "快速安装",
          collapsible: true,
          children: [
            "/installation/windows-wsl2.md",
            "/installation/windows-vmware.md",
            "/installation/windows-native.md"
          ]
        },
        {
          text: "基础指南",
          collapsible: true,
          children: ["/guides/onboard.md", "/guides/settings.md", "/guides/mechanisms.md"]
        },
        {
          text: "渠道接入",
          collapsible: true,
          children: ["/integrations/feishu.md", "/integrations/qq.md"]
        },
        {
          text: "帮助索引",
          collapsible: true,
          children: ["/help-index/README.md"]
        }
      ],
      "/help-index/": [
        {
          text: "快速安装",
          collapsible: true,
          children: [
            "/installation/windows-wsl2.md",
            "/installation/windows-vmware.md",
            "/installation/windows-native.md"
          ]
        },
        {
          text: "基础指南",
          collapsible: true,
          children: ["/guides/onboard.md", "/guides/settings.md", "/guides/mechanisms.md"]
        },
        {
          text: "渠道接入",
          collapsible: true,
          children: ["/integrations/feishu.md", "/integrations/qq.md"]
        },
        {
          text: "帮助索引",
          collapsible: true,
          children: ["/help-index/README.md"]
        }
      ],
      "/installation/": [
        {
          text: "快速安装",
          collapsible: true,
          children: [
            "/installation/windows-wsl2.md",
            "/installation/windows-vmware.md",
            "/installation/windows-native.md"
          ]
        },
        {
          text: "基础指南",
          collapsible: true,
          children: ["/guides/onboard.md", "/guides/settings.md", "/guides/mechanisms.md"]
        },
        {
          text: "渠道接入",
          collapsible: true,
          children: ["/integrations/feishu.md", "/integrations/qq.md"]
        },
        {
          text: "帮助索引",
          collapsible: true,
          children: ["/help-index/README.md"]
        }
      ]
    },
    sidebarDepth: 0,
    editLink: false,
    contributors: false,
    lastUpdated: false
  })
});
