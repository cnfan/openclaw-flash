# 诊断龙虾

这页只做一件事：用最短命令判断当前环境是否健康。

::: tip Docker 用户入口
如果你是 Docker 部署，先看 [快速设置（Docker 进入方式 + 一次性 CLI）](../quick-start.md)，再回到本页排查。
:::

## 一分钟排查

```bash
openclaw doctor
openclaw status --deep
openclaw health
```

建议顺序：

1. 先 `doctor` 看总览
2. 再 `status --deep` 看运行状态
3. 最后 `health` 验证链路

## 结果怎么判断

- 全部通过：继续正常使用
- 有红色/失败项：先修失败项，再重跑同一条命令
- 仍失败：回到安装总览对应系统文档逐项核对

## 常见第一反应

- 配置问题：先检查 `~/.openclaw/openclaw.json`
- 服务问题：重启 gateway 后再跑 doctor
- 渠道问题：先在 dashboard 本地验证，再查渠道配置

## 相关入口

- [让龙虾飞](../workspace-control.md)
- [快速设置（安装后）](../quick-start.md)
