# OpenClaw 常用机制

这篇文档解释几个最值得先理解的机制：

- 定时任务 `cron`
- 关键 Markdown 文件
- Skills 机制
- 渐进披露机制

如果你先理解这四块，后面改设置、写技能、做自动化会顺很多。

## 一、cron 机制

OpenClaw 的定时任务由 Gateway 管理，当前默认存储位置是：

```text
~/.openclaw/cron/jobs.json
```

运行历史默认在：

```text
~/.openclaw/cron/runs/<jobId>.jsonl
```

官方文档说明，任务本质上由三部分组成：

- 调度计划：什么时候执行
- 负载：执行什么
- 投递方式：把结果发到哪里

## 1. 支持的调度类型

- `at`：一次性执行
- `every`：固定间隔
- `cron`：标准 5 段 cron 表达式，可选时区

## 2. 常见命令

```bash
openclaw cron list
openclaw cron add --name "提醒" --at "20m" --session main --system-event "20 分钟后提醒我" --wake now
openclaw cron runs --id <jobId>
openclaw cron run <jobId> --force
```

## 3. 两种执行会话

官方文档里有两个关键目标：

- `main`
- `isolated`

可以简单理解为：

- `main` 适合提醒、续写、延续当前主会话语境
- `isolated` 适合定时报表、晨报、自动总结这类相对独立的任务

## 4. 一个典型例子

每天早上 7 点生成晨报并发到指定渠道：

```bash
openclaw cron add \
  --name "晨报" \
  --cron "0 7 * * *" \
  --tz "Asia/Shanghai" \
  --session isolated \
  --message "总结昨晚到现在的重要更新。" \
  --announce
```

## 5. 使用建议

- 修改任务优先用 `openclaw cron add/edit`，不要直接手改 `jobs.json`
- 需要跨时区时一定显式加 `--tz`
- 周期任务优先用 `isolated`，避免把主会话越用越乱

## 二、几个关键 Markdown 文件

OpenClaw 的工作区是一个很核心的设计。官方当前给出的关键文件包括：

- `AGENTS.md`
- `SOUL.md`
- `USER.md`
- `IDENTITY.md`
- `TOOLS.md`
- `HEARTBEAT.md`
- `BOOT.md`
- `BOOTSTRAP.md`
- `MEMORY.md`
- `memory/YYYY-MM-DD.md`

## 1. `AGENTS.md`

作用：

- 智能体操作说明
- 行为规则
- 工作习惯
- 记忆使用方式

它会在每次会话开始时被加载，是最核心的行为文件之一。

## 2. `SOUL.md`

作用：

- 人设
- 语气
- 边界

如果你希望它更像助理、工程师、客服或运营，这里很关键。

## 3. `USER.md`

作用：

- 记录用户是谁
- 记录称呼偏好
- 记录长期稳定偏好

## 4. `IDENTITY.md`

作用：

- 定义智能体自己的名字、身份感、风格

通常在首次 bootstrap 过程中被创建或更新。

## 5. `TOOLS.md`

作用：

- 记录本机工具说明
- 记录环境约定
- 记录命令习惯

注意：它不会直接控制工具是否可用，它只是给模型看的环境提示。

## 6. `MEMORY.md`

作用：

- 长期记忆
- 精炼过的重要信息

官方说明里强调，它通常只在主私聊会话中加载，不应该在群聊或共享上下文里随便加载。

## 7. `memory/YYYY-MM-DD.md`

作用：

- 每日记忆日志
- 原始事件记录
- 决策、限制、偏好、待办

这是“流水账记忆”，`MEMORY.md` 更像“提炼后的长期记忆”。

## 三、Skills 机制

OpenClaw 使用兼容 AgentSkills 的技能目录。一个 Skill 本质上就是一个目录，里面至少有：

- `SKILL.md`

官方当前给出的加载位置有三层：

1. 安装自带的 bundled skills
2. 本机共享技能：`~/.openclaw/skills`
3. 工作区技能：`<workspace>/skills`

冲突时优先级是：

```text
<workspace>/skills > ~/.openclaw/skills > bundled skills
```

## 1. Skill 适合放什么

- 工具使用说明
- 外部系统接入流程
- 某个固定工作流的步骤化指令
- 对某些插件或脚本的约束说明

## 2. 共享 Skill 和工作区 Skill 的区别

- `~/.openclaw/skills`：同一台机器的多个智能体可共享
- `<workspace>/skills`：只服务当前工作区和当前智能体

## 3. ClawHub 是什么

官方当前提供了一个公开技能注册表 `ClawHub`，可以用来：

- 搜索技能
- 安装技能
- 更新技能
- 同步技能

常见命令：

```bash
clawhub search "calendar"
clawhub install <skill-slug>
clawhub update --all
clawhub sync --all
```

## 四、渐进披露机制

这是 OpenClaw 很关键、但很多人一开始没意识到的机制。

根据官方 `上下文` 文档：

- 系统提示词里只会注入一个紧凑的 Skills 列表
- 默认不会把每个 Skill 的完整说明都塞进上下文
- 模型应该只在需要时再去 `read` 对应 Skill 的 `SKILL.md`

这就是“渐进披露”的核心思路：

- 先给最小索引
- 需要时再展开详细说明

## 1. 为什么要这么设计

因为上下文窗口是有限的。

如果一上来把所有技能全文、所有工作区文件、所有说明都塞进上下文：

- token 会暴涨
- 响应速度会变慢
- 有效上下文会被无关信息挤掉

## 2. 你应该怎么利用这个机制

- Skill 描述写短、写准
- 只把真正需要长期保留的规则放到 `AGENTS.md`
- 大块操作细节放到单独 Skill 或单独文档
- 不要把所有东西都堆进一个大提示词文件

## 3. 一个很实用的经验

应该把“索引”和“正文”分开：

- `AGENTS.md` 负责总原则
- `SKILL.md` 负责某类任务的详细工作流
- `MEMORY.md` 负责长期记忆
- 每日 `memory/*.md` 负责原始记录

这样既省上下文，也更容易维护。

## 五、我认为还应优先了解的机制

除了上面四个，我认为还有几块很值得你后续补文档：

- 渠道会话隔离机制：不同私聊、群聊、线程怎么映射 session
- pairing 配对机制：未知用户怎么申请接入
- memory 检索机制：`memory_search` 和 `memory_get` 的边界
- sandbox 机制：工作区不是硬隔离，命令执行如何真正隔离
- bootstrap 机制：首次启动时哪些文件会自动生成

## 官方参考

- Cron Jobs: https://docs.openclaw.ai/zh-CN/automation/cron-jobs
- Agent Workspace: https://docs.openclaw.ai/zh-CN/concepts/agent-workspace
- Memory: https://docs.openclaw.ai/concepts/memory
- Skills: https://docs.openclaw.ai/tools/skills
- Context: https://docs.openclaw.ai/zh-CN/concepts/context
- Agent Bootstrapping: https://docs.openclaw.ai/start/bootstrapping
