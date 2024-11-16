# Changelog

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

- The compile button is not displayed when the selected language has no compilation command.
- Clear the stderr content from the last run when starting a new run.
- Added configuration `oi-runner-2.defaultTask` to support setting default running languages for different file extensions.

### 🩹 Bug Fixes

- Modified the logo color to avoid being too close to the default background color.
- Fixed the issue with stdin being invalid.

### 📖 Documentation

- [Documentation site](https://oi-runner-2.by-ts.top/zh-cn/) is now live, come and check it out.
- Added configuration instructions in the README.

## 0.1.0 (2024-10-23)

🚀 Let's go!
