# OI Runner++

> English｜[简体中文](https://gitee.com/typed-sigterm/oi-runner-2/blob/main/README.zh-CN.md)

VS Code extension designed for OIers and ACMers, for running single-file programs.

![](./assets/guide/preview.png)

## Quick Start

<details>

<summary>The Story Behind OI Runner++</summary>
<br>

Running single C++ files in VS Code isn't straightforward, and I've **suffered** from this. Online tutorials often require configuring **lengthy, complex, and arcane** `.vscode/launch.json` and `.vscode/tasks.json` files, which is pure torture.

Compared to that, the [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) extension offers a better experience, but it's not suitable for the specific scenario of OI (competitive programming):

- It leaves messy history in the Terminal.
- It doesn't show execution time or exit code.
- You have to manually input test cases every time.

Later, I discovered [OI Runner](https://marketplace.visualstudio.com/items?itemName=CmdBlock.oi-runner). It's tailor-made for the OI scenario, and I personally think its experience is nearly perfect. However, after using it for a while, some issues became apparent:

- Execution time and exit code are mixed with the output.
- There's no status indication for compiling/running.
- The stop button doesn't work.
- The working directory for compilation/execution is the source file's directory, not the workspace directory.

I submitted a [PR](https://github.com/CmdBlockZQG/oi-runner/pull/9), but the maintainer seems to have abandoned OI Runner and didn't respond.

On 2024/6/21, I decided to develop OI Runner++, completely rewriting it based on OI Runner and releasing it. Therefore, OI Runner++ retains OI Runner's concise UI design but improves upon many features.

</details>

For a quick start guide:

1. Open the Command Palette (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>)
2. Enter & select `Welcome: Open Walkthrough...`
3. Enter & select `Get Started with OI Runner++`

## Configuration

All configuration descriptions can be accessed via the VS Code settings UI (<kbd>Ctrl</kbd> + <kbd>,</kbd>) by searching for `@ext:typed-sigterm.oi-runner-2`.

<details>

<summary>How to Access the Configuration Interface</summary>
<br>

If you want to modify the configuration for the current workspace (folder), simply create a `.vscode/settings.json` file.

If you want to apply the configuration to all workspaces, press <kbd>Ctrl</kbd> + <kbd>,</kbd> to open VS Code settings, then click the "Open Settings (JSON)" button in the top right corner to open the global configuration file:

![](./assets/guide/settings.png)
</details>

### `oi-runner-2.tasks`

Defines the tasks available in the run panel and their corresponding compilation and execution commands.

Format:

```jsonc
{
  "oi-runner-2.tasks": {
    "C++": { // Task label
      "compile": [ // Compilation command and arguments
        "g++",
        ["${file}", "-o${fileNoExt}", "-std=c++14", "-O2"] // The use of ${} is explained below
      ],
      "execute": [ // Execution command, required
        "${fileNoExt}${execExt}",
        []
      ]
    },
    "Python": {
      // The compilation command can be empty; the compile button will not be displayed when this task is selected
      "execute": [
        "python",
        ["${file}"]
      ]
    }
    // ...
  }
}
```

There are special strings in the commands and arguments that will be replaced with actual information when executed:

| Special String | Replaced With |
| --- | --- |
| `${file}` | The absolute path of the source file |
| `${fileNoExt}` | The absolute path of the source file without the extension |
| `${execExt}` | The extension of the executable file, `.exe` on Windows, an empty string on other systems |

The working directory for commands is the currently opened folder.

### `oi-runner-2.defaultTask`

Defines the default task selected in the run panel when a file is opened based on its extension.

Format:

```jsonc
{
  "oi-runner-2.tasks": {
    "C++": { /* ... */ },
    "Python": { /* ... */ }
  },
  "oi-runner-2.defaultTask": {
    ".py": "Python", // Files with the .py extension default to Python
    ".cpp": "C++"
    // If a file's extension doesn't match any entry here, the run panel won't automatically switch to that file
  }
}
```

### `oi-runner-2.addToRunMenu`

Whether to add OI Runner++ to the editor title menu's run button options.

If disabled, you need to press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command palette and search for `Launch OI Runner++` to open the run panel.

Format: `true` (default) or `false`.

### `oi-runner-2.autoSave`

Whether to automatically save the file before running.

Format: `true` (default) or `false`.

### `oi-runner-2.textareaMaxSize`

The maximum size of the stdout textarea in bytes (UTF-8 encoding).

Long strings may cause hangs; redirect long input/output to files if they exceed this limit.

Format: `number` (default: `10000`).

## Credits

This project is deeply inspired by [OI Runner](https://github.com/CmdBlockZQG/oi-runner). Thanks to [@CmdBlockZQG](https://github.com/CmdBlockZQG) and other contributors of OI Runner.
