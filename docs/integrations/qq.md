# QQ 接入教程

这篇文档分成两部分：

- 当前官方支持现状
- 当前可用的社区方案

先说结论：

截至 2026-03-13，我没有在 OpenClaw 官方渠道文档里看到 QQ 被列为官方内置支持渠道。官方 `Chat Channels` 页面当前列出的支持渠道包括 WhatsApp、Telegram、Discord、IRC、Slack、飞书、Google Chat、Mattermost、Signal、BlueBubbles 等，但没有 QQ。

所以这篇教程不会把 QQ 写成“官方一键接入”，而是按“社区插件接入”来说明。

## 一、现状判断

根据当前检索结果：

- 官方渠道总览页没有列出 QQ
- 社区插件目录里已经出现 QQ 相关插件
- 其中一个可见插件安装命令是 `@sliverp/qqbot`

这意味着：

- QQ 接入目前更像社区扩展能力
- 可用性要看插件维护情况
- 升级兼容性风险会高于官方内置渠道

## 二、最接近“一键接入”的方案

当前比较直观的社区方案是安装 QQ Bot 插件：

```bash
openclaw plugins install @sliverp/qqbot@latest
```

这是我目前检索到的最接近“直接安装即可用”的接入路径。

## 三、接入前提

这个方案依赖腾讯 QQ 开放平台的 QQ Bot，而不是普通 QQ 号直接登录。

也就是说你需要：

1. 去 QQ 开放平台申请 Bot
2. 获取应用凭证
3. 把凭证填到 OpenClaw 配置里

根据当前插件说明，核心凭证是：

- `AppID`
- `AppSecret`

## 四、安装步骤

## 第 1 步：安装插件

```bash
openclaw plugins install @sliverp/qqbot@latest
```

如果你想从源码安装，插件目录页给出的方式是：

```bash
git clone https://github.com/sliverp/qqbot.git
cd qqbot
openclaw plugins install .
```

## 第 2 步：到 QQ 开放平台创建机器人

按当前插件说明，需要：

1. 注册 QQ 开放平台账号
2. 创建 QQ Bot
3. 在开发管理里完成沙箱配置
4. 把自己的测试账号加入机器人可见范围

插件页面特别强调了一个现实限制：

- 该路线支持个人沙箱调试
- 文档里提到“不支持机器人在 QQ 群里配置”，主要支持私聊 Bot 场景

所以如果你期待“像 Telegram 一样直接进群工作”，这条路线目前要先降低预期。

## 第 3 步：在 OpenClaw 中添加渠道

插件页面给出的向导式命令是：

```bash
openclaw channels add --channel qqbot --token "AppID:AppSecret"
```

## 第 4 步：或直接写配置文件

编辑：

```text
~/.openclaw/openclaw.json
```

加入：

```json
{
  "channels": {
    "qqbot": {
      "enabled": true,
      "appId": "你的 AppID",
      "clientSecret": "你的 AppSecret"
    }
  }
}
```

## 第 5 步：启动 Gateway

```bash
openclaw gateway
```

然后回到 QQ 客户端里测试和机器人对话。

## 五、我对这条路线的建议

如果你的目标是“先尽快稳定上线”，优先级建议是：

1. 飞书
2. Telegram
3. Discord
4. QQ 社区插件

原因不是 QQ 不重要，而是当前检索结果显示 QQ 更像社区插件能力，不像飞书那样已经明确写入官方生产就绪文档。

## 六、可能的限制

使用社区 QQ 插件时，你要提前接受几个现实问题：

- 版本升级后可能不兼容
- 排障时要同时看 OpenClaw 和插件两边日志
- 渠道能力可能先支持私聊，再逐步补群聊或多媒体
- 中国大陆网络环境下，插件依赖和平台审核流程会影响落地速度

## 七、如果你真想做“尽量接近一键”

我建议把操作流程固定成这四步：

1. 安装 OpenClaw
2. 安装 QQ 插件
3. 在 QQ 开放平台申请 Bot 并拿凭证
4. 运行 `openclaw channels add --channel qqbot --token "AppID:AppSecret"`

然后再补一页你们自己的内部 SOP，把：

- 平台申请截图
- 审核注意事项
- 测试账号加入方式
- 常见报错截图

全部整理进去。这样对团队成员来说才接近真正的“一键接入”。

## 官方与社区参考

- 官方渠道总览：https://docs.openclaw.ai/channels/index
- 社区插件目录页：https://openclawdir.com/plugins/qqbot-openclaw-c3jxol
- 社区插件源码说明中引用的仓库：https://github.com/sliverp/qqbot

说明：

`openclawdir.com` 是社区目录，不是 OpenClaw 官方站点。我在这里把它作为“社区插件发现入口”引用，不把它视为官方文档。
