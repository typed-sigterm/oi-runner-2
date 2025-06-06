# 更新记录

> [English](https://github.com/typed-sigterm/oi-runner-2/blob/main/CHANGELOG.md)｜简体中文

## 2.0.1 (2025-04-26)

### 🔥 性能优化

- 使用 Monaco Editor 内置的多文件状态管理逻辑，减少在文件、样例间切换时的延迟
- 修改 Monaco Editor 导入方式，减小插件体积

### 📖 文档改进

- 修改新手教程中部分用词

## 2.0.0 (2025-04-26)

v2 主要听取了来自 [Moonshot48](https://www.msadream.cn/) 的同学的反馈，功能基本追平了 [Competitive Programming Helper](https://marketplace.visualstudio.com/items/?itemName=DivyanshuAgrawal.competitive-programming-helper)。

### 🚀 新功能

- 支持多组测试样例，你现在可以同时保留多组输入输出
- 改进未打开文件时的提示页
- 支持填入预期的输出，与实际输出实时对比，方便调试
- 为了防止输出过多爆掉运行面板，现在运行面板中默认只显示前 1e4 字节的输出。重定向到文件时不受限制，也可以通过配置修改阈值
- 添加加载动画

### 🩹 Bug 修复

- 修复重定向输出后 output 编辑器上方的提示

### 📖 文档改进

- 全新的新手教程，更新后打开 VS Code 就能看到
- 迁移所有配置说明到标准的 VS Code 设置界面
- 完成以上两点后，已经不再需要一个文档网站。访问[原文档站](https://oi-runner-2.by-ts.top/)会重定向到 GitHub 或 Gitee

### 🏡 其他修改

- 文件未保存提示现在替换 `Source File` 文本，以适应布局调整

## 1.3.2 (2024-12-23)

### 🩹 Bug 修复

- 修正命令输入输出编码为 `utf-8`
- 开始运行时清除上次的 stderr 输出

## 1.3.1 (2024-12-22)

### 🚀 新功能

- 默认情况下，插件现在会在运行前自动保存源文件。你可以设置 `oi-runner-2.autoSave` 为 `false` 来禁用此功能

### 🩹 Bug 修复

- 修复 stdout 为空时 Link File 按钮的显示

## 1.3.0 (2024-12-22)

### 🚀 新功能

- 现在你可以在运行面板中将 stdin 和 stdout 重定向到文件。当数据量过大，或需要保存数据时，推荐使用此方法

### 🩹 Bug 修复

- 修复 Compile & Run 时无法显示编译警告的问题
- 提高计时精度

## 1.2.0 (2024-12-16)

### 🩹 Bug 修复

- 修复默认配置

## 1.2.0 (2024-12-16)

### 🚀 新功能

- 现在如果一个文件不匹配 `oi-runner-2.defaultTask` 配置中的任何拓展名，则运行面板不会切换到对应的文件，保留在编辑器切换前的状态
- 现在运行面板中的内容在文件移动、重命名时会保留
- 当配置更改时，你会得到提示是否重新加载拓展

### 🩹 Bug 修复

- 停止运行时也结束运行命令所有的子进程，现在停止运行按钮不会再失效了
- 修复保存状态标志显示、隐藏时容器高度抖动的问题

### 📖 文档改进

- 更新过时的图片
- 在版本标签上使用等宽字体
- 在暗色模式中自动切换 logo 样式

### 🏡 其他修改

- OI Runner++ 已发布到 [Open VSX](https://open-vsx.org/extension/typed-sigterm/oi-runner-2)，Open VSX 是一个由 Eclipse Foundation 运营的开源 VS Code 插件市场

## 1.1.0 (2024-11-17)

### 🚀 新功能

- 更新了输入框样式。我们从 [CodeMirror](https://codemirror.net/) 迁移到了 [Monaco Editor](https://microsoft.github.io/monaco-editor/)，获得了更好的输入体验，并且终于修复了 Ctrl+V 粘贴不生效的问题
- 在运行面板中显示当前运行的文件，以及文件是否已保存
- 改进了工具栏按钮 hover 时的的背景形状

### 🩹 Bug 修复

- 修复加载动画和遮罩的位置
- 输入框滚动时不影响上方的标题
- 遮罩显示时阻止滚动

## 1.0.1 (2024-11-03)

### 🩹 Bug 修复

- 当运行被取消时显示提示
- 修复无法在 stdin 输入框中粘贴文本的问题

### 📖 文档改进

- 优化版本标签外观
- 在 README 中添加效果图

## 1.0.0 (2024-10-25)

CSP 2024 rp++

### 🚀 新功能

- 所选的语言没有编译命令时，不显示编译按钮
- 开始运行时清空上次运行输出到 stderr 的内容
- 新增配置 `oi-runner-2.defaultTask`，支持为不同拓展名的文件设置默认运行语言

### 🩹 Bug 修复

- 修改 logo 颜色，避免与默认背景色过于接近
- 修复 stdin 无效的问题

### 📖 文档改进

- [文档站](https://oi-runner-2.by-ts.top/zh-cn/)上线，来看看罢
- 在 README 中补充配置说明

## 0.1.0 (2024-10-23)

🚀 第一版发布
