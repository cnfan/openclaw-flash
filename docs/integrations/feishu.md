# 飞书接入教程

这篇文档介绍如何把 OpenClaw 接入飞书。

根据当前官方文档，飞书渠道状态是“生产就绪”，支持：

- 机器人私聊
- 群组消息
- WebSocket 长连接接收消息

## 一、前提说明

当前官方说明里提到：

- 新版本通常已经内置 Feishu 插件
- 如果你是旧版本或自定义安装，可以手动安装插件

手动安装命令：

```bash
openclaw plugins install @openclaw/feishu
```

## 二、最推荐的接入方式

官方当前最推荐的是通过向导接入：

```bash
openclaw onboard
```

向导会带你完成：

1. 创建飞书应用并获取凭证
2. 配置应用凭证
3. 启动 Gateway

如果你已经安装完 OpenClaw，只想单独加渠道，也可以运行：

```bash
openclaw channels add
```

然后选择 `Feishu`。

## 三、在飞书开放平台准备应用

你需要先在飞书开放平台创建一个机器人应用，并拿到：

- `App ID`
- `App Secret`

如果你走 Webhook 模式，还会涉及：

- `Verification Token`

不过根据当前官方页面，飞书默认更偏向 WebSocket 长连接模式。

## 四、通过向导配置

执行：

```bash
openclaw channels add
```

然后：

1. 选择飞书
2. 粘贴 `App ID`
3. 粘贴 `App Secret`
4. 完成保存

## 五、通过配置文件配置

也可以直接编辑：

```text
~/.openclaw/openclaw.json
```

一个典型配置如下：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx",
          "botName": "我的 AI 助手"
        }
      }
    }
  }
}
```

## 六、几个常用设置

## 1. 私聊策略 `dmPolicy`

飞书和其他渠道一样，可以控制陌生用户如何接入。常见值包括：

- `pairing`
- `allowlist`
- `open`
- `disabled`

如果你是第一次部署，建议先用：

```json
"dmPolicy": "pairing"
```

这样更安全。

## 2. 流式输出

官方飞书页面给出了这些选项：

```json
{
  "channels": {
    "feishu": {
      "streaming": true,
      "blockStreaming": true
    }
  }
}
```

作用可以理解成：

- `streaming: true`：边生成边发送
- `blockStreaming: true`：按块流式输出

如果你更想要“等完整答案生成后一次性发送”，可以把 `streaming` 设为 `false`。

## 3. 消息引用

群聊里常用：

```json
{
  "channels": {
    "feishu": {
      "replyToMode": "all"
    }
  }
}
```

官方给出的值有：

- `off`
- `first`
- `all`

一般建议：

- 私聊用 `off`
- 群聊用 `first` 或 `all`

## 4. Webhook 模式的验证令牌

如果你选择的是 `connectionMode: "webhook"`，官方说明需要设置：

- `verificationToken`

并且默认监听地址是：

```text
127.0.0.1
```

只有你明确需要改监听地址时，才需要设置 `webhookHost`。

## 七、启动与验证

配置完成后，检查状态：

```bash
openclaw gateway status
openclaw logs --follow
```

如果 Gateway 已经在跑，也可以看总状态：

```bash
openclaw status
```

## 八、常见问题

## 1. 新版本还需要单独装 Feishu 插件吗？

通常不需要。官方文档当前写的是“当前版本已内置 Feishu 插件”。只有旧版本或自定义安装才需要手动安装。

## 2. 推荐 WebSocket 还是 Webhook？

从当前官方飞书页面看，飞书机器人状态说明明确提到使用 WebSocket 长连接接收消息，所以这通常是更自然的默认选择。

## 3. 为什么推荐 `pairing`？

因为它更适合刚上线时控制陌生人接入，避免机器人一开就对任何人开放。

## 官方参考

- 飞书渠道：https://docs.openclaw.ai/zh-CN/channels/feishu
- Chat Channels: https://docs.openclaw.ai/channels/index
- 配对机制：https://docs.openclaw.ai/zh-CN/channels/pairing
