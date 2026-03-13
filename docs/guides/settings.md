# OpenClaw 设置教程

这篇文档介绍 OpenClaw 最常用的设置入口、配置文件位置，以及新手最需要先改的几个配置项。

## 先理解两个核心位置

根据官方 `Setup` 和 `Configuration` 文档，OpenClaw 的个性化主要放在两个地方：

- 工作区：`~/.openclaw/workspace`
- 配置文件：`~/.openclaw/openclaw.json`

可以把它们理解成：

- `workspace` 负责提示词、记忆、技能、工作文件
- `openclaw.json` 负责模型、渠道、自动化、网络和运行参数

## 最推荐的设置方式

官方当前给了 4 种常见配置入口：

- `openclaw onboard`：完整初始化向导
- `openclaw configure`：交互式配置向导
- Control UI：浏览器图形界面
- 直接编辑 `~/.openclaw/openclaw.json`

如果你是第一次配置，我建议顺序是：

1. 先运行 `openclaw onboard`
2. 再运行 `openclaw configure`
3. 最后在浏览器里打开 Control UI 做细修

## 常用命令

```bash
openclaw onboard
openclaw configure
openclaw config get agents.defaults.workspace
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config unset tools.web.search.apiKey
```

如果 Gateway 已经启动，也可以直接打开：

```text
http://127.0.0.1:18789
```

然后在 `Config` 标签页里修改配置。

## 配置文件位置与特点

官方说明当前配置文件是：

```text
~/.openclaw/openclaw.json
```

几个关键点：

- 这是 JSON5 风格配置，允许更宽松的写法
- 如果文件不存在，OpenClaw 会使用默认安全配置
- Gateway 会监听这个文件，修改后通常可以自动热更新
- 配置必须严格匹配 schema，未知字段或类型错误会导致 Gateway 拒绝启动

所以不要把它当成“随便写”的 JSON 文本。

## 建议优先设置的项目

## 1. 工作区目录

这是最先要确认的一项：

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace"
    }
  }
}
```

如果你想把工作区放到一个单独项目目录、外接磁盘或专门的私有仓库里，就先改这个字段。

## 2. 模型与模型别名

你通常至少要设置主模型和备用模型：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["openai/gpt-5.2"]
      },
      "models": {
        "anthropic/claude-sonnet-4-5": { "alias": "Sonnet" },
        "openai/gpt-5.2": { "alias": "GPT" }
      }
    }
  }
}
```

这决定了：

- 默认用哪个模型
- 失败时怎么回退
- 聊天里 `/model` 可看到哪些别名

## 3. 渠道接入

如果你要接 Telegram、Discord、飞书等渠道，都会写到 `channels` 下。

例如官方文档给出的 Telegram 示例结构是：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123:abc",
      "dmPolicy": "pairing",
      "allowFrom": ["tg:123"]
    }
  }
}
```

飞书、Slack、IRC 等其它渠道也是同样思路：在 `channels.<channelName>` 下配置。

## 4. 自动化能力

OpenClaw 当前把自动化相关能力放在配置里，包括：

- `cron`
- `hooks`

最常见的是定时任务：

```json
{
  "cron": {
    "enabled": true,
    "store": "~/.openclaw/cron/jobs.json",
    "maxConcurrentRuns": 1
  }
}
```

## 5. 沙箱与隔离

如果你的 OpenClaw 会执行命令、读写文件或对外联网，建议尽早看 `sandbox` 相关设置。

官方配置文档明确提到，`workspace` 只是默认工作目录，不是硬隔离。真要隔离，需要用：

- `agents.defaults.sandbox`
- 对应的容器或沙箱策略

## 6. 诊断日志

排查问题时很有用：

```json
{
  "diagnostics": {
    "flags": ["gateway.*"]
  }
}
```

也可以临时用环境变量覆盖：

```bash
OPENCLAW_DIAGNOSTICS=gateway.* openclaw gateway
```

## 推荐的新手设置流程

## 第一步：跑完完整向导

```bash
openclaw onboard
```

## 第二步：确认工作区和模型

```bash
openclaw config get agents.defaults.workspace
openclaw config get agents.defaults.model.primary
```

## 第三步：接一个渠道

建议先接一个你最常用的渠道，比如飞书或 Telegram。

## 第四步：验证系统状态

```bash
openclaw doctor
openclaw status
openclaw logs --follow
```

## 第五步：把工作区做成私有 Git 仓库

这是官方推荐做法，主要用于备份你的提示词、记忆文件和技能。

## 常见问题

## 1. 配置改错后为什么启动失败？

因为当前官方配置是严格校验的。未知字段、类型不对、枚举值不合法，都可能让 Gateway 直接拒绝启动。

## 2. 改了配置为什么没有生效？

先确认：

- Gateway 是否在运行
- 是否改的是 `~/.openclaw/openclaw.json`
- 当前 profile 是否切换到了其他配置目录

## 3. 工作区和配置文件有什么区别？

- 工作区是“内容”和“记忆”
- 配置文件是“运行参数”和“系统行为”

这两者不要混在一起。

## 官方参考

- Setup: https://docs.openclaw.ai/start/setup
- Configuration: https://docs.openclaw.ai/gateway/configuration
- Agent Workspace: https://docs.openclaw.ai/zh-CN/concepts/agent-workspace
- Diagnostics Flags: https://docs.openclaw.ai/diagnostics/flags
