# OI Runner++

> • English｜[简体中文](https://oier-runner-2.by-ts.top/zh-CN/)

VS Code extension designed for OIer and ACMer, used to run single file program.

## Configuration

<!-- #region config -->

### `oi-runner-2.tasks`

Defines the languages available in the run panel and their corresponding compilation and execution commands.

Format:

```jsonc
{
  "oi-runner-2.tasks": {
    "C++": { // Language label
      "compile": [ // Compilation command and arguments
        "g++",
        ["${file}", "-o${fileNoExt}", "-std=c++14", "-O2"] // The use of ${} is explained below
      ],
      "execute": [ // Execution command
        "${fileNoExt}${execExt}",
        []
      ]
    },
    "Python": {
      // The compilation command can be empty; the compile button will not be displayed when this language is selected
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

The working directory is the opened folder.

<!-- #endregion config -->

## Credits

This project is deeply inspired by [OI Runner](https://github.com/CmdBlockZQG/oi-runner). Thanks to [@CmdBlockZQG](https://github.com/CmdBlockZQG) and other contributors of OI Runner.
