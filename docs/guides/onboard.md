# OpenClaw Onboard 教程

这篇文档专门介绍 `openclaw onboard` 怎么用。

先说结论：

- `openclaw onboard` 是当前官方推荐的首次配置方式
- 它适用于 macOS、Linux，以及通过 WSL2 运行的 Windows
- 它不只是“安装后随便点几下”，而是会一次性把模型、网关、渠道、技能、工作区等关键配置串起来

## 一、什么是 onboard

根据当前官方文档，`onboard` 是 OpenClaw 的首次引导向导。

它的目标是：

- 配置本地 Gateway
- 或配置远程 Gateway 连接
- 选择模型和认证方式
- 设置工作区默认值
- 配置消息渠道
- 安装推荐 Skills

最基本的命令是：

```bash
openclaw onboard
```

## 二、什么时候应该用 onboard

最适合下面几种场景：

- 第一次安装 OpenClaw
- 想重新整理当前配置
- 想一次性把模型、渠道和工作区都重配一遍
- 想给另一个新环境做标准化初始化

如果你只是想微调某一项配置，通常更适合用：

```bash
openclaw configure
```

## 三、onboard 会配置什么

根据当前官方向导说明，本地模式下通常会走这些步骤：

1. 现有配置检测
2. 模型与认证
3. 模式选择
4. 工作区
5. Gateway
6. 渠道
7. 后台服务
8. 健康检查
9. Skills
10. 完成摘要

你可以把它理解成“一次完整的首次上线流程”。

## 四、最常见的使用方式

## 方式 1：交互式首次配置

这是最推荐的方式：

```bash
openclaw onboard
```

然后按提示依次完成：

- QuickStart 或 Advanced
- 本地模式或远程模式
- 模型和认证方式
- 工作区目录
- Gateway 端口与认证
- 渠道接入
- 是否安装后台服务
- 是否安装推荐 Skills

## 方式 2：安装后台服务时一起做

很多用户第一次上手时会直接这样做：

```bash
openclaw onboard --install-daemon
```

这样在引导过程中就会把 Gateway 后台服务一起安装好。

## 方式 3：脚本化部署

如果你是给服务器、批量环境、自动化脚本使用，就要走非交互模式：

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-skills
```

注意：

- `--json` 不等于非交互
- 真正脚本化时必须显式加 `--non-interactive`

## 五、QuickStart 和 Advanced 有什么区别

向导开始时会让你选两种模式：

- QuickStart
- Advanced

### QuickStart 适合谁

适合：

- 第一次使用
- 想尽快跑通
- 不想一开始就手动调很多细节

根据当前官方向导说明，QuickStart 会偏向这些默认值：

- 本地 Gateway
- 默认或已有工作区
- 端口 `18789`
- 自动生成 Gateway Token
- 本地新安装默认 `tools.profile: "coding"`
- 私聊隔离默认写入 `session.dmScope: "per-channel-peer"`
- Tailscale 默认关闭

### Advanced 适合谁

适合：

- 你明确知道自己要什么
- 你要接远程 Gateway
- 你要细调渠道、后台服务和技能安装
- 你要控制安全与暴露方式

## 六、每一步该怎么选

## 1. 现有配置检测

如果 `~/.openclaw/openclaw.json` 已存在，向导会让你选：

- 保留
- 修改
- 重置

官方当前明确说明：

- 重新运行向导不会自动清空配置
- 只有你明确选了 `Reset` 或传 `--reset` 才会执行重置

## 2. 模型与认证

当前官方向导支持的认证路线很丰富，常见包括：

- Anthropic API Key
- Anthropic OAuth / setup-token
- OpenAI Code / Codex
- OpenAI API Key
- Gemini API Key
- Moonshot / Kimi
- Z.AI
- OpenAI 兼容或 Anthropic 兼容的自定义提供商
- Ollama 等本地模型

如果你只是想先稳定跑起来，优先选官方向导里已经直接支持的主流提供商。

## 3. 模式选择

有两种核心模式：

- 本地模式
- 远程模式

### 本地模式

适合：

- 你的电脑自己跑 Gateway
- 个人开发机
- 家庭主机

### 远程模式

适合：

- Gateway 跑在 VPS、NAS、远程 Linux 主机
- 本机只做客户端连接

官方说明里特别强调：

- 远程模式只会配置本地客户端如何连接远端 Gateway
- 不会替你去远端机器安装或修改任何东西

## 4. 工作区

向导会问你工作区目录。

这是最关键的选择之一，因为这里会放：

- `AGENTS.md`
- `MEMORY.md`
- `skills/`
- 每日记忆
- 其他工作文件

如果你没有特殊需求，先用默认工作区就够了。

## 5. Gateway

这里通常会涉及：

- 绑定方式
- 端口
- 鉴权方式
- 是否启用 Tailscale

如果你不确定，优先保持：

- `loopback`
- 默认端口 `18789`
- Token 鉴权开启

## 6. 渠道

向导会让你按需接入渠道，例如：

- Telegram
- WhatsApp
- Discord
- 飞书
- Slack

当前官方说明还提到，有些渠道本身是插件形式交付的。如果你在向导里选中，向导会提示你先安装插件，然后再继续配置。

## 7. 后台服务

如果你希望 OpenClaw 常驻，建议在这一步直接安装。

平台对应关系通常是：

- Linux / WSL2：`systemd`
- macOS：`launchd`

## 8. 健康检查

向导后期会尝试启动 Gateway，并跑一次健康检查。

你也可以手动补执行：

```bash
openclaw health
openclaw status --deep
openclaw doctor
```

## 9. Skills

官方当前把 Skills 安装放在向导后段。

它会：

- 读取可用技能
- 检查依赖
- 让你选择 Node 包管理器
- 安装可选依赖

如果你是脚本化部署，不想在这里停住，可以加：

```bash
--skip-skills
```

## 七、常用参数

## 1. `--install-daemon`

在引导时直接安装后台服务。

## 2. `--non-interactive`

用于自动化脚本。

## 3. `--json`

输出机器可读摘要，但它本身不代表非交互。

## 4. `--reset`

重置配置、凭证和会话。

当前官方说明里，`--reset` 默认范围是：

- 配置
- 凭证
- 会话

如果你要连工作区也一起清掉，需要：

```bash
--reset-scope full
```

## 八、重跑 onboard 会发生什么

根据当前官方参考文档：

- 默认不会清空你现有内容
- 只有你明确选择重置，才会做破坏性修改
- 重置使用的是 `trash`，不是直接 `rm`

这意味着它总体上比你手动删配置更安全。

## 九、一个推荐的新手流程

如果你是第一次上手，我建议按这个顺序：

1. 运行 `openclaw onboard`
2. 选 `QuickStart`
3. 先接一个最容易验证的渠道
4. 安装后台服务
5. 跑 `openclaw doctor`
6. 打开 `openclaw dashboard`
7. 再回头细调工作区、技能和更多渠道

## 十、一个推荐的自动化流程

如果你要做团队初始化或服务器标准化部署，可以先固定：

- 统一模型提供商
- 统一工作区路径
- 统一端口
- 统一 daemon 安装
- 统一跳过或固定 Skills

然后使用 `--non-interactive`。

## 十一、常见问题

## 1. 为什么向导停下来让我先跑 `doctor`？

因为当前官方逻辑里，如果配置无效或者存在遗留旧字段，向导会先中止，要求你修好配置再继续。

## 2. `--json` 为什么还是会交互？

因为官方明确说明：`--json` 只影响输出格式，不代表脚本模式。脚本模式必须显式加 `--non-interactive`。

## 3. 最快开始聊天的方法是什么？

官方向导页给的最快路径是：

```bash
openclaw dashboard
```

也就是说你甚至可以先不接消息渠道，先在浏览器里测试。

## 4. 能不能用 onboard 再加一个新智能体？

更合适的命令通常是：

```bash
openclaw agents add <名称>
```

如果不传 `--workspace`，它也会进入向导式流程。

## 官方参考

- Onboarding Wizard (CLI): https://docs.openclaw.ai/start/wizard
- Onboarding Overview: https://docs.openclaw.ai/start/onboarding-overview
- Wizard Reference: https://docs.openclaw.ai/reference/wizard
- Setup: https://docs.openclaw.ai/zh-CN/start/setup
