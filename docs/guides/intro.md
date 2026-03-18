# 初识Openclaw

这篇先解决一个关键问题：`~/.openclaw` 与 `~/.openclaw/workspace` 到底是什么、该怎么用。

## 先记住这两个目录

- ` ~/.openclaw`：OpenClaw 的“主目录”
- ` ~/.openclaw/workspace`：OpenClaw 的“工作区目录”

在 Docker 安装方式下，~ 就是 `/home/node`。

## `~/.openclaw` 是什么

**下面先说一些用户容易理解的东西：**

> - 如果你觉得“OpenClaw 没反应了”，就是这里出问题了
> - 这里保存 OpenClaw 的核心配置和运行状态
> - 渠道配置、技能配置、自动化相关配置通常都和这里有关
> - 一些运行日志、缓存、统计信息也会在这里留下痕迹
> - token用量，每次会话历史这里也有

**你必须告诉你的 龙虾 Openclaw 不要试图通过编辑文件去解决问题，容易玩死自己 正确的方式是通过命令**
可以把它理解成 OpenClaw 的 ***“运行与状态根目录”*** ，常见内容包括：

- **配置文件（例如 `openclaw.json`），划重点，超级重要，编辑它就会玩死龙虾，而且你如果敢让豆包教你怎么改，死得很快**
- 凭证与会话相关数据
- 自动化任务状态
- skills 与运行时缓存数据
- 部分模型调用与运行记录（具体取决于版本与配置）
- 提前透露下，所谓的多agent协助，这里就是主agent的地盘，其他每个agent都会在workspace所在目录建立一个 workspace-<agent名字> 的目录，他们有自己的规则自己的三观自己的skills

这个目录的建议策略：

- 用最小权限（建议 `700`）
- 定期做备份

## `~/.openclaw/workspace` 是什么

`workspace` 更像“工作上下文目录”，用于放本次项目相关内容，例如：

- 当前任务涉及的项目文件
- 工作区级别的 skills
- 与当前项目绑定的执行上下文
- **Openclaw的记忆**，我们说大模型llm是没有记忆的，但是Openclaw有
- **Openclaw的意识**，我们说大模型llm是没有意识的，但是Openclaw有

你可以理解为：

- `~/.openclaw` 管“平台级状态”
- `~/.openclaw/workspace` 管“项目级上下文”

进一步说，`workspace` 是你和 OpenClaw 协作的“现场”：

- 这里有Openclaw自己的规则，这里会记录谁是它的主人，也会让他知道它是谁
- 龙虾世界的**意识**、**记忆**、**规则**、**三观**都在这里
- 项目级 skills（`<workspace>/skills`）优先级通常高于全局 skills
- 这个目录越干净、越清晰，OpenClaw 执行越稳定

结构示意：

```text
~/.openclaw/workspace/
  ├─ AGENTS.md
  ├─ project-a/
  ├─ project-b/
  ├─ skills/
  └─ ...
```

使用建议：

- 一个项目一个子目录，避免上下文串线
- 跨项目共用能力放 `~/.openclaw/skills`，项目私有能力放 `<workspace>/skills`
- 大改前先备份或打快照，减少误操作恢复成本

## 为什么要这样分层

这和主流 AI Agent 工程实践一致：把“长期状态”和“任务工作区”分开，便于隔离、迁移、审计和回滚。

当前主流实践的共同点：

- 优先在隔离环境运行（容器 / 虚拟机 / 沙箱）
- 指令与记忆使用项目级文件管理（如 AGENTS.md、CLAUDE.md）
- 任务执行在独立环境中完成，降低主系统风险

## 你可以直接照做的运维动作

```bash
# 查看目录结构
ls -la ~/.openclaw
ls -la ~/.openclaw/workspace

# 仅示例：权限收敛
chmod 700 ~/.openclaw

# 备份
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz -C /home/node .openclaw
```

## 常见误区

- 把 `workspace` 当成安全沙箱：它是工作目录，不是完整安全边界
- 把整个 `.openclaw` 暴露给多人共享：会带来凭证和状态污染风险
- 不做备份直接升级：一旦配置损坏，恢复成本高

## 下一步

- [Openclaw 的自我介绍](./openclaw-self-intro.md)
- [Onboard 教程](./onboard.md)
- [设置教程](./settings.md)
- [常用机制](./mechanisms.md)

## 关键规则文档索引（原文 + 中文）

- AGENTS： [原文](./refrences/AGENTS.md) ｜ [中文](./refrences/AGENTS.zh-CN.md)
- SOUL： [原文](./refrences/SOUL.md) ｜ [中文](./refrences/SOUL.zh-CN.md)
- USER： [原文](./refrences/USER.md) ｜ [中文](./refrences/USER.zh-CN.md)
- TOOLS： [原文](./refrences/TOOLS.md) ｜ [中文](./refrences/TOOLS.zh-CN.md)
- IDENTITY： [原文](./refrences/IDENTITY.md) ｜ [中文](./refrences/IDENTITY.zh-CN.md)
- BOOTSTRAP： [原文](./refrences/BOOTSTRAP.md) ｜ [中文](./refrences/BOOTSTRAP.zh-CN.md)
- HEARTBEAT： [原文](./refrences/HEARTBEAT.md) ｜ [中文](./refrences/HEARTBEAT.zh-CN.md)

## 参考

- OpenAI Codex（云端隔离环境与工作区实践）：https://developers.openai.com/codex/cloud/environments
- OpenAI Codex（AGENTS.md 项目指令实践）：https://developers.openai.com/codex/guides/agents-md
- Anthropic Claude Code（Best Practices）：https://code.claude.com/docs/en/best-practices
- Anthropic Claude Code（Memory 机制）：https://code.claude.com/docs/en/memory
