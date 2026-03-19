import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);

const installationChildren = [
  "/installation/installation-guide.html",
  "/installation/quick-start.html",
  "/installation/talk-with-lobster.html",
  "/installation/workspace-control.html"
];
const guideChildren = [
  "/guides/understand-llm.html",
  "/guides/intro.html",
  "/guides/openclaw-self-intro.html",
  "/guides/skills-progressive-disclosure.html",
  "/guides/mechanisms.html",
  "/guides/how-to-build-reliable-lobster.html"
];

const misconceptionChildren = [
  "/misconceptions/not-just-a-chatbot.html",
  "/misconceptions/language-wall.html",
  "/misconceptions/memory-pollution.html",
  "/misconceptions/sandbox-illusion.html",
  "/misconceptions/myth-of-super-lobster.html"
];

const advancedChildren = [
  "/advanced/how-to-be-advanced.html",
  "/advanced/writer-workflow.html"
];

const expertChildren = [
  "/expert/how-to-be-expert.html",
  "/expert/external-systems.html"
];

const vipChildren = ["/vip/about-vip.html"];

const aboutChildren = [
  { text: "自然语言", link: "/about/openclaw-future-hll.html" },
  { text: "未来计划", link: "/about/future-plan.html" }
];

const tutorialSidebarSections = [
  {
    text: "龙虾误区",
    collapsible: true,
    children: misconceptionChildren
  },
  {
    text: "快速安装",
    collapsible: true,
    children: installationChildren
  },
  {
    text: "新手玩家",
    collapsible: true,
    children: guideChildren
  },
  {
    text: "高级玩家",
    collapsible: true,
    children: advancedChildren
  },
  {
    text: "专家玩家",
    collapsible: true,
    children: expertChildren
  }
];

const aboutSidebarSections = [
  {
    text: "关于作者",
    collapsible: false,
    children: aboutChildren
  }
];

const vipSidebarSections = [
  {
    text: "VIP",
    collapsible: false,
    children: vipChildren
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
        link: "/installation/installation-guide.html"
      },
      {
        text: "VIP",
        link: "/vip/about-vip.html"
      },
      {
        text: "关于作者",
        link: "/about/openclaw-future-hll.html"
      }
    ],
    sidebar: {
      "/about/": aboutSidebarSections,
      "/vip/": vipSidebarSections,
      "/": tutorialSidebarSections
    },
    sidebarDepth: 0,
    editLink: false,
    contributors: false,
    lastUpdated: false
  })
});
