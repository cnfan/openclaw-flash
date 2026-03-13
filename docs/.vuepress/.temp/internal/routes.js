export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/home/cnfan/openclaw-flash-help/docs/README.md"), meta: {"title":"OpenClaw Flash 帮助文档"} }],
  ["/guides/mechanisms.html", { loader: () => import(/* webpackChunkName: "guides_mechanisms.html" */"/home/cnfan/openclaw-flash-help/docs/guides/mechanisms.md"), meta: {"title":"OpenClaw 常用机制"} }],
  ["/guides/onboard.html", { loader: () => import(/* webpackChunkName: "guides_onboard.html" */"/home/cnfan/openclaw-flash-help/docs/guides/onboard.md"), meta: {"title":"OpenClaw Onboard 教程"} }],
  ["/guides/settings.html", { loader: () => import(/* webpackChunkName: "guides_settings.html" */"/home/cnfan/openclaw-flash-help/docs/guides/settings.md"), meta: {"title":"OpenClaw 设置教程"} }],
  ["/help-index/", { loader: () => import(/* webpackChunkName: "help-index_index.html" */"/home/cnfan/openclaw-flash-help/docs/help-index/README.md"), meta: {"title":"索引帮助页"} }],
  ["/integrations/feishu.html", { loader: () => import(/* webpackChunkName: "integrations_feishu.html" */"/home/cnfan/openclaw-flash-help/docs/integrations/feishu.md"), meta: {"title":"飞书接入教程"} }],
  ["/integrations/qq.html", { loader: () => import(/* webpackChunkName: "integrations_qq.html" */"/home/cnfan/openclaw-flash-help/docs/integrations/qq.md"), meta: {"title":"QQ 接入教程"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/home/cnfan/openclaw-flash-help/docs/.vuepress/.temp/pages/404.html.vue"), meta: {"title":""} }],
]);
