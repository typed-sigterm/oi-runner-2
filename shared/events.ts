export const EventMarker = '__oiRunner2';

export interface TaskAttributes {
  name: string
  compilable: boolean
}
export type RunStep = 'compile' | 'execute' | 'compile-execute';

export interface IOFileChannel {
  file: string
}
export type IOChannel =
  | string // plain content
  | IOFileChannel; // link to file

export type EventMessage = { // extension -> webview
  type: 'setup'
  tasks: TaskAttributes[]
  extensions: string[]
} | { // webview -> extension
  type: 'webview:ready'
} | { // extension -> webview
  type: 'context:switch'
  file: string
  defaultTask: string
  isDirty: boolean
  // @todo context:destroy to remove closed editors
} | { // extension -> webview
  type: 'context:rename'
  from: string
  to: string
} | { // extension -> webview
  type: 'context:state-changed'
  isDirty: boolean
} | { // extension -> webview
  type: 'context:redirect'
  channel: 'stdin' | 'stdout'
} | { // webview -> extension
  type: 'run:launch'
  file: string
  task: string
  step: RunStep
  stdin?: IOChannel
  stdout?: IOFileChannel
} | { // extension -> webview
  type: 'run:compiled'
  skipExcuting: boolean
} | { // extension -> webview
  type: 'run:compile-failed'
  exitCode?: number
} | { // extension -> webview
  type: 'run:executed'
  stdout: string
  exitCode: number
  duration: number
  overflow: boolean
} | { // extension -> webview
  type: 'run:execute-failed'
} | { // webview -> extension
  type: 'run:kill'
  file: string
} | { // extension -> webview
  type: 'run:killed'
} | { // webview -> extension
  type: 'file:open-in-editor'
  path: string
} | { // webview -> extension
  type: 'file:select'
} | { // extension -> webview
  type: 'file:selected'
  path?: string
};
