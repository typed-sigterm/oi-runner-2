# Changelog

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
