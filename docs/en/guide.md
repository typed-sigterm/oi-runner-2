# Quick Start

::: details The Origin of OI Runner++

Running single-file C++ programs in VS Code is not an easy task, and I have been **greatly affected** by this. Most online tutorials require configuring **long, complex, and mystical** `.vscode/launch.json` and `.vscode/tasks.json`, which is a complete torment.

In comparison, the experience with the [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) plugin is a bit better, but it is not suitable for the special scenario of OI:

- It leaves ugly historical records in the Terminal
- It does not display running time, exit codes
- You have to manually input examples every time

Later, I discovered [OI Runner](https://marketplace.visualstudio.com/items?itemName=CmdBlock.oi-runner). It is tailor-made for the OI scenario, and I personally think its experience is already close to perfect. However, after a long period of use, some problems gradually emerged:

- Running time, exit codes are mixed with output
- There is no status prompt for compiling/running
- The stop running button is ineffective
- The working directory during compilation/running is the source code directory, not the workspace directory

I submitted a [PR](https://github.com/CmdBlockZQG/oi-runner/pull/9), but it seems the maintainer has given up on maintaining OI Runner and did not respond.

On 2024/6/21, I decided to develop OI Runner++, completely rewriting and publishing it based on OI Runner. Therefore, OI Runner++ retains the simple UI design of OI Runner, but has made many improvements in functionality.

:::

First, you need to install [OI Runner++](https://marketplace.visualstudio.com/items?itemName=typed-sigterm.oi-runner-2) to VS Code.

After installation, open a folder, create a C++ source file, write some code, and then save it by pressing <kbd>Ctrl</kbd> + <kbd>S</kbd>:

![](/assets/guide/1.png)

To run the program, you need to press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command panel, type `OI Runner++` to find `OI Runner++: Focus on OI Runner++ View`, and click:

![](/assets/guide/2.png)

If the run panel is at the bottom, you can drag it to the right like this:

![](/assets/guide/3.gif)

Let's go 🚀

![](/assets/guide/4.gif)

::: tip

When the current edited file is switched, the content in the run panel will also switch accordingly.

That is to say, you can run multiple programs at the same time, and the input and output will not be mixed together.

:::

If you want to run programs in other languages, you can also switch languages:

![](/assets/guide/5.gif)

The languages OI Runner++ supports by default are:

- C++ (Compilation arguments: `-std=c++14 -O2`)
- Python

If you need support for other languages, or want to modify compilation options, please read the [Configuration Reference](./config).