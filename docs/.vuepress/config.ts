import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);

const installationChildren = [
  "/installation/installation-guide.md",
  "/installation/quick-start.md",
  "/installation/talk-with-lobster.md",
  "/installation/workspace-control.md"
];
const guideChildren = ["/guides/intro.md", "/guides/openclaw-self-intro.md", "/guides/skills-progressive-disclosure.md", "/guides/mechanisms.md"];

const sidebarSections = [
  {
    text: "快速安装",
    collapsible: true,
    children: installationChildren
  },
  {
    text: "新手玩家",
    collapsible: true,
    children: guideChildren
  }
];

export default defineUserConfig({
  lang: "zh-CN",
  title: "OpenClaw Flash",
  description: "OpenClaw Flash 中文帮助文档",
  base: "/openclaw-flash/",
  clientConfigFile: path.resolve(__dirname, "./client.ts"),
  bundler: viteBundler(),
  theme: defaultTheme({
    navbar: [
      {
        text: "教程",
        link: "/installation/installation-guide.md"
      }
    ],
    sidebar: sidebarSections,
    sidebarDepth: 0,
    editLink: false,
    contributors: false,
    lastUpdated: false
  })
});
