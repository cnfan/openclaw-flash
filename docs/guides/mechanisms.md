# OpenClaw 常用机制

这篇文档解释几个最值得先理解的机制：

- 定时任务 `cron`
- 关键 Markdown 文件
- Skills 与渐进式披露（独立专题）

如果你先理解这三块，后面改设置、写技能、做自动化会顺很多。

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

## 三、Skills 与渐进式披露（独立专题）

这块内容已拆到单独文档，避免本页过长，也方便你专门优化 Skill 设计：

- [Skills 与渐进式披露](./skills-progressive-disclosure.md)

## 四、我认为还应优先了解的机制

除了上面四个，我认为还有几块很值得你后续补文档：

- 渠道会话隔离机制：不同私聊、群聊、线程怎么映射 session
- pairing 配对机制：未知用户怎么申请接入
- memory 检索机制：`memory_search` 和 `memory_get` 的边界
- sandbox 机制：工作区不是硬隔离，命令执行如何真正隔离
- bootstrap 机制：首次启动时哪些文件会自动生成
