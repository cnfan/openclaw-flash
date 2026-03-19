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
const guideChildren = [
  "/guides/understand-llm.md",
  "/guides/intro.md",
  "/guides/openclaw-self-intro.md",
  "/guides/skills-progressive-disclosure.md",
  "/guides/mechanisms.md",
  "/guides/how-to-build-reliable-lobster.md"
];

const misconceptionChildren = [
  "/misconceptions/not-just-a-chatbot.md",
  "/misconceptions/language-wall.md",
  "/misconceptions/memory-pollution.md",
  "/misconceptions/sandbox-illusion.md",
  "/misconceptions/myth-of-super-lobster.md"
];

const advancedChildren = [
  "/advanced/how-to-be-advanced.md",
  "/advanced/writer-workflow.md"
];

const expertChildren = [
  "/expert/how-to-be-expert.md",
  "/expert/external-systems.md"
];

const aboutChildren = [
  { text: "自然语言", link: "/about/openclaw-future-hll.md" },
  { text: "未来计划", link: "/about/future-plan.md" }
];

const tutorialSidebarSections = [
  {
    text: "龙虾误区",
    link: "/misconceptions/not-just-a-chatbot.md",
    collapsible: true,
    children: misconceptionChildren
  },
  {
    text: "快速安装",
    link: "/installation/installation-guide.md",
    collapsible: true,
    children: installationChildren
  },
  {
    text: "新手玩家",
    link: "/guides/understand-llm.md",
    collapsible: true,
    children: guideChildren
  },
  {
    text: "高级玩家",
    link: "/advanced/writer-workflow.md",
    collapsible: true,
    children: advancedChildren
  },
  {
    text: "专家玩家",
    link: "/expert/external-systems.md",
    collapsible: true,
    children: expertChildren
  }
];

const aboutSidebarSections = [
  {
    text: "关于作者",
    link: "/about/openclaw-future-hll.md",
    collapsible: false,
    children: aboutChildren
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
      },
      {
        text: "关于作者",
        link: "/about/openclaw-future-hll.md"
      }
    ],
    sidebar: {
      "/about/": aboutSidebarSections,
      "/": tutorialSidebarSections
    },
    sidebarDepth: 0,
    editLink: false,
    contributors: false,
    lastUpdated: false
  })
});
