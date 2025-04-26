# OI Runner++

> [English](https://github.com/typed-sigterm/oi-runner-2/blob/main/README.md)｜简体中文

专为 OIer 和 ACMer 设计的 VS Code 插件，用于运行单文件程序。

![](./assets/preview.png)

## 快速上手

<details>

<summary>OI Runner++ 的由来</summary>

在 VS Code 中运行 C++ 单文件程序并非易事，我就**深受其害**。网上的教程大多要求配置**冗长、复杂、玄学**的 `.vscode/launch.json` 和 `.vscode/tasks.json`，这完全是一种折磨。

相比之下，[Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) 插件的体验好一些，但并不适合 OI 这一特殊场景：

- 会在 Terminal 中留下难看的历史记录
- 不显示运行耗时、退出代码
- 每次都要手动输入样例

后来，我发现了 [OI Runner](https://marketplace.visualstudio.com/items?itemName=CmdBlock.oi-runner)。它是为 OI 场景量身打造的，个人认为其体验已接近完美。但是经过较长时间的使用后，一些问题逐渐显现：

- 运行耗时、退出代码与输出混在一起
- 没有编译中/运行中的状态提示
- 停止运行按钮无效
- 编译/运行时的工作目录是源代码目录，而非工作区目录

我提了一个 [PR](https://github.com/CmdBlockZQG/oi-runner/pull/9)，然而维护者似乎已经放弃维护 OI Runner，没有回复。

2024/6/21，我决定开发 OI Runner++，以 OI Runner 为蓝本进行完全重写并发布。因此，OI Runner++ 保留了 OI Runner 简洁的 UI 设计，但在不少功能上进行了改进。

</details>

从以下任意一个链接安装插件：

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=typed-sigterm.oi-runner-2)
- [Open VSX](https://open-vsx.org/extension/typed-sigterm/oi-runner-2)

打开新手教程：

1. 打开命令面板 (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>)
2. 输入并选择 `欢迎: 打开演练...`
3. 输入并选择 `开始使用 OI Runner++`

## 配置

所有配置说明都可通过 VS Code 设置界面 (<kbd>Ctrl</kbd> + <kbd>,</kbd>) 访问，搜索 `@ext:typed-sigterm.oi-runner-2` 即可找到。

## 鸣谢

OI Runner++ 深受 [OI Runner](https://github.com/CmdBlockZQG/oi-runner) 启发，感谢 [@CmdBlockZQG](https://github.com/CmdBlockZQG) 及其他贡献者。
