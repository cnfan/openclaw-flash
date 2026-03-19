# 安装文档图片说明

本目录包含各安装教程所需的图片素材。

## 文件夹结构

```
installation/
├── assets/
│   ├── windows-wsl2/       # Windows WSL2 安装的图片
│   ├── windows-vmware/     # Windows VMware 安装的图片
│   ├── windows-native/     # Windows 直接安装的图片
│   ├── linux-docker/         # Linux Docker 安装的图片
│   ├── linux-native-apt/     # Linux APT 直接安装的图片
│   ├── linux-native-yum/     # Linux YUM 直接安装的图片
│   ├── macos-docker/          # macOS Docker 安装的图片
│   └── macos-native/          # macOS 直接安装的图片
```

## 如何添加图片

1. **截图**：从实际安装过程中截取关键步骤的图片
2. **保存**：将图片保存到对应的文件夹中
3. **命名**：使用有意义的文件名，如：
   - `step1-install-wsl2.png` - 安装WSL2的截图
   - `step2-verify-version.png` - 验证版本的截图
   - `step3-config-ubuntu.png` - 配置Ubuntu的截图
   - `result-success.png` - 成功结果的截图

4. **引用**：在对应的 md 文件中填写真实存在的图片路径

## 示例

在引用前先确认文件已存在，再插入到文档中。
