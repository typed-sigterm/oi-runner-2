export const EventMarker = '__oiRunner2';

export interface TaskAttributes {
  name: string
  compilable: boolean
}
export type RunStep = 'compile' | 'execute' | 'compile-execute';

export type EventMessage = { // extension -> webview
  type: 'config'
  tasks: TaskAttributes[]
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
} | { // webview -> extension
  type: 'context:goto-source'
  file: string
} | { // extension -> webview
  type: 'context:state-changed'
  isDirty: boolean
} | { // webview -> extension
  type: 'run:launch'
  file: string
  task: string
  step: RunStep
  stdin?: string
} | { // extension -> webview
  type: 'run:compiled'
  skipExcuting: boolean
} | { // extension -> webview
  type: 'run:compile-failed'
  exitCode: number
} | { // extension -> webview
  type: 'run:executed'
  stdout: string
  exitCode: number
  duration: number
} | { // extension -> webview
  type: 'run:execute-failed'
} | { // webview -> extension
  type: 'run:kill'
  file: string
} | { // extension -> webview
  type: 'run:killed'
};
