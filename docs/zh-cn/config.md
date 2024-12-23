# 配置参考

::: details 如何进入配置界面

如果你想修改当前工作区（文件夹）的配置，创建 `.vscode/settings.json` 文件即可。

如果你想把配置应用到所有工作区，按 <kbd>Ctrl</kbd> + <kbd>,</kbd> 打开 VS Code 设置，按右上角“打开设置（JSON）”按钮即可打开全局配置文件：

![](/assets/guide/settings.png)

:::

### `oi-runner-2.tasks`

定义运行面板中可选的任务和对应的编译、执行命令。

格式：

```jsonc
{
  "oi-runner-2.tasks": {
    "C++": { // 任务名称
      "compile": [ // 编译命令和参数
        "g++",
        ["${file}", "-o${fileNoExt}", "-std=c++14", "-O2"] // ${} 的用法请参考下文
      ],
      "execute": [ // 执行命令，必填
        "${fileNoExt}${execExt}",
        []
      ]
    },
    "Python": {
      // 编译命令可以为空，选择此任务时不会显示编译按钮
      "execute": [
        "python",
        ["${file}"]
      ]
    }
    // ...
  }
}
```

命令和参数中有一些特殊字符串，执行时会被替换为实际信息：

| 特殊字符串 | 替换为 |
| --- | --- |
| `${file}` | 源文件的绝对路径 |
| `${fileNoExt}` | 源文件的绝对路径去掉扩展名的部分 |
| `${execExt}` | 可执行文件的扩展名，Windows 下为 `.exe`，其他系统为空字符串 |

命令的执行目录是当前打开的文件夹。

### `oi-runner-2.defaultTask`

打开文件时，运行面板默认选择的语言。

格式：

```jsonc
{
  "oi-runner-2.tasks": {
    "C++": { /* ... */ },
    "Python": { /* ... */ }
  },
  "oi-runner-2.defaultTask": {
    ".py": "Python" // 拓展名是 .py 的文件默认选择 Python
    // 如果一个文件的拓展名没有在这里指定默认任务，则运行面板不会切换到这个文件
  }
}
```

### `oi-runner-2.addToRunMenu`

是否将 OI Runner++ 添加到编辑器的运行按钮选项中。

如果禁用，则需要通过 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 打开命令面板，搜索 `Launch OI Runner++` 打开运行面板。

格式：`true`（默认）或 `false`
