# 快速开始

::: details OI Runner++ 的由来

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

:::

首先，你需要安装 [OI Runner++](https://marketplace.visualstudio.com/items?itemName=typed-sigterm.oi-runner-2) 到 VS Code。

安装完成后，打开一个文件夹，创建一个 C++ 源文件，写一些代码然后按 <kbd>Ctrl</kbd> + <kbd>S</kbd> 保存：

![](/assets/guide/1.png)

为了运行程序，需要按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 打开命令面板，输入 `OI Runner++` 找到 `OI Runner++: Focus on OI Runner++ View`，并点击：

![](/assets/guide/2.png)

如果运行面板在底部，你可以像这样把它拖到右侧：

![](/assets/guide/3.gif)

好了🎉

![](/assets/guide/4.gif)

::: tip

当前编辑的文件切换时，运行面板中的内容也会跟着切换。

也就是说，你可以同时运行多个程序，输入输出不会混在一起。

:::

如果想运行其他语言的程序，也可以切换语言：

![](/assets/guide/5.gif)

OI Runner++ 默认支持的语言有：

- C++（编译参数：`-std=c++14 -O2`）
- Python

如果你需要其他语言的支持，或者修改编译选项，请阅读[配置参考](./config)。
