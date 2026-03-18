# 初识龙虾

这篇先解决一个关键问题：`~/.openclaw` 与 `~/.openclaw/workspace` 到底是什么、该怎么用。

- ` ~/.openclaw`：OpenClaw 的“主目录”
- ` ~/.openclaw/workspace`：OpenClaw 的“工作区目录”

在 Docker 安装方式下，~ 就是 `/home/node`。

## 一、关于`~/.openclaw`

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

## 二、关于`~/.openclaw/workspace`

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


## 三、注意备份，你的龙虾可以起死回生
```bash
# 备份(普通用户可以直接复制走我说的~/.openclaw ，这样死后删除原来的，再复制回来就完成重生了)
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz -C /home/node .openclaw
```