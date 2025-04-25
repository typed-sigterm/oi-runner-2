# Changelog

> English｜[简体中文](https://gitee.com/typed-sigterm/oi-runner-2/blob/main/CHANGELOG.zh-CN.md)

## 2.0.0 (2025-04-26)

v2 is mainly based on the feedback from the hackers from [Moonshot48](https://www.msadream.cn/), and the features are basically on par with [Competitive Programming Helper](https://marketplace.visualstudio.com/items/?itemName=DivyanshuAgrawal.competitive-programming-helper).

### 🚀 Features

- Support multiple test cases, you can now keep multiple sets of input and output at the same time
- Improve the prompt page when no file is opened
- Support filling in the expected output and comparing it with the actual output in real time for debugging
- To prevent excessive output from crashing the run panel, the run panel now only displays the first 1e4 bytes of output by default. This limit does not apply when redirecting to a file, and can also be modified through configuration
- Add loading animation

### 🩹 Bug Fixes

- Fix the prompt above the stdout editor when redirecting output

### 📖 Documentation

- A brand new tutorial for beginners, which can be seen when opening VS Code
- Migrate all configuration instructions to the standard VS Code settings interface
- After completing the above two points, there is no longer a need for a documentation website. Visiting [the original documentation site](https://oi-runner-2.by-ts.top/) will redirect to GitHub or Gitee

### 🏡 Other Changes

- The unsaved file prompt now replaces the `Source File` text to fit the layout adjustment

## 1.3.2 (2024-12-23)

### 🩹 Bug Fixes

- Fix command IO charset, now default to `utf-8`
- Clear stderr channel when a new run is started

## 1.3.1 (2024-12-22)

### 🚀 Features

- The extension now automatically save the source file before running by default. You can disable this feature by setting `oi-runner-2.autoSave` to `false`

### 🩹 Bug Fixes

- Fix the appearance of link file button when stdout is empty

## 1.3.0 (2024-12-22)

### 🚀 Features

- You can now redirect stdin and stdout to a file in the run panel. This is useful when the data is too large to be inputted manually, or when you want to save the output for later use

### 🩹 Bug Fixes

- Fix the issue that the warning emitted by the compile command is not displayed when compile-and-run
- Enable more accurate timing

## 1.2.1 (2024-12-16)

### 🩹 Bug Fixes

- Fix default configuration

## 1.2.0 (2024-12-16)

### 🚀 Features

- Now if a file does not match any extension configured in `oi-runner-2.defaultTask`, the run panel won't switch to that file, remaining the original state
- You can move and rename files without losing the context in the run panel
- You will get notified to reload when the configuration is changed

### 🩹 Bug Fixes

- Kill all its child processes when a run is stopped, the stop button will no longer fail now
- Fix height shaking issue when the "unsaved" badge is toggled

### 📖 Documentation

- Update outdated screenshots
- Use equal width fonts on the version label
- Switch logo theme in dark mode

### 🏡 Other Changes

- OI Runner++ is also published on [Open VSX](https://open-vsx.org/extension/typed-sigterm/oi-runner-2), an open-source registry for VS Code extensions operated by the Eclipse Foundation

## 1.1.0 (2024-11-17)

### 🚀 Features

- Introduce new input box styles. We migrated from [CodeMirror](https://codemirror.net/) to [Monaco Editor](https://microsoft.github.io/monaco-editor/) to provide a better input experience, fixing keyboard pasting behavior permanently
- Display the current source file and its unsaved changes status in the run panel
- Improve the background shape the toolbar button when hovering

### 🩹 Bug Fixes

- Fix spinner and mask position
- Exclude the title above the input box from the scroll area
- Disable scrolling when mask is displayed

## 1.0.1 (2024-11-03)

### 🩹 Bug Fixes

- Show hint when a run is canceled
- Fix pasting behavior in stdin input box

### 📖 Documentation

- Make version label looks better
- Add preview image to README

## 1.0.0 (2024-10-25)

Wishing every contestant in tomorrow's <abbr title="Certified Software Professional, a very important OI contest of Chinese OIers">CSP</abbr> an ideal result!

### 🚀 Features

- The compile button is not displayed when the selected language has no compilation command
- Clear the stderr content from the last run when starting a new run.
- Add configuration `oi-runner-2.defaultTask` to support setting default running languages for different file extensions

### 🩹 Bug Fixes

- Modified the logo color to avoid being too close to the default background color
- Fix the issue with stdin being invalid

### 📖 Documentation

- [Documentation site](https://oi-runner-2.by-ts.top/zh-cn/) is now live, come and check it out
- Add configuration instructions in the README

## 0.1.0 (2024-10-23)

🚀 Let's go!
