export const EventMarker = '__oierRunner2';

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
  // @todo context:destroy to remove closed editors
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

export interface EventPayload {
  'context:switch': {
    file: string
  }
  'run:launch': {
    file: string
    task: string
    step: RunStep
    stdin?: string
  }
  'run:compiled': {
    file: string
  }
  'run-excuted': {
    file: string
    stdout: string
    exitCode?: number
    duration?: number
  }
  'run:kill': {
    file: string
  }
}
