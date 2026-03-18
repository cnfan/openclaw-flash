# OpenClaw Flash 帮助文档

这是 `OpenClaw Flash` 站点的文档首页。

命名说明：

- `OpenClaw Flash` 是本站名称
- 本站当前主要收录的是 `OpenClaw` 的使用文档、设置说明和接入指南

左侧菜单已经整理为文档导航，建议直接从侧边栏进入对应专题。

## 文档入口

- [安装Openclaw](/installation/)
- [OpenClaw Onboard 教程](/guides/onboard.html)
- [OpenClaw 设置教程](/guides/settings.html)
- [OpenClaw 常用机制](/guides/mechanisms.html)
- [飞书接入教程](/integrations/feishu.html)
- [QQ 接入教程](/integrations/qq.html)

## 后续建议补充

### 1. 渠道与会话

- 私聊、群聊、线程与 session 的对应关系
- pairing 配对机制
- 常见渠道差异

### 2. 安全与运维

- sandbox 与权限边界
- 升级与备份
- 故障排查
- 启动与重启文档站：
  - 启动开发服务：`pnpm docs:dev`
  - 生产构建：`pnpm docs:build`
  - 清理缓存并重启：`pnpm docs:clean && pnpm docs:dev`

### 3. 团队协作

- 如何写 `AGENTS.md`
- 如何组织 `skills/`
- 如何管理工作区仓库
