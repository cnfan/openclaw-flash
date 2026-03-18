# 和龙虾对话
这篇是安装阶段第 3 步：把消息渠道接好，让你能在聊天工具里直接和龙虾对话。  
这都是最近一个星期的变化，在这之前，也许只有程序员可以接入，要理解官方的开发者对接流程，熟知对接原理，才能清晰明白的走完流程。
::: details 原理（点击展开）
扫码相当于你把 1、2、3 这些复杂操作授权给官方流程处理，让本来 3-30 分钟（不熟悉时甚至更久）的配置压缩到 1 分钟左右。

QQ 机器人的对接原理是：

1. 你在 QQ 开放平台创建机器人应用，获取 `AppID` 和 `AppSecret`，相当于开了一个可编程控制的 QQ 账号。
2. 你在 OpenClaw 里配置 `AppID:AppSecret`，相当于把控制权授权给 OpenClaw。
3. 你在 QQ 里添加机器人应用并完成权限开通，相当于定义这个账号可执行的范围。
4. 你在 OpenClaw 里启动对应插件后，它开始监听 QQ 消息。

飞书的对接原理是：

飞书的一键安装相当于把 1、2、3、4 全部交给官方引导流程，让本来 3-30 分钟的流程压缩到 1 分钟左右。

1. 你在飞书开放平台创建应用，获取 `App ID` 和 `App Secret`。
2. 你在 OpenClaw 里配置 `App ID:App Secret`，把控制权授权给 OpenClaw。
3. 你在飞书里完成应用授权与权限开通，定义可执行范围。
4. 你在 OpenClaw 里启动机器人插件后，它开始监听飞书消息。
:::

## 一、QQ

推荐优先使用官方接入页：

- 官方入口：https://q.qq.com/qqbot/openclaw/index.html

1. 扫码完成 在 QQ 开放平台创建机器人应用并授权与权限开通
2. 官方提供命令，直接复制粘贴完成接入，但是注意Docker用户要在容器内执行
```bash
docker exec -it openclaw-cli bash
```
以下是命令，注意替换 `------------:------------` 为你自己的 `AppID:AppSecret`：
```bash
1.安装OpenClaw开源社区QQBot插件
openclaw plugins install @tencent-connect/openclaw-qqbot@latest
2.配置绑定当前QQ机器人
openclaw channels add --channel qqbot --token "------------:------------"
```

## 二、飞书

飞书现在也支持引导安装，一条命令可以完成大部分初始化：

```bash
npx -y @larksuite/openclaw-lark install
```
注意Docker用户要在容器内执行
```bash
docker exec -it openclaw-cli bash
```

渠道接入成功后，先重启网关再回到聊天工具测试：

<RestartGatewaySnippet />
