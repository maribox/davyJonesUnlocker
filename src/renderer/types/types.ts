export enum TaskType {
  Calculating,
  WeekdayCalculating
}

export enum Difficulty {
  very_easy,
  easy,
  medium,
  hard,
  very_hard
}

export type ITask = {
  taskType: TaskType
  difficulty: Difficulty
}

export interface Settings {
  difficulty: Difficulty
  allowedTasks: TaskType[]
  numberOfTasks: number
  locale: string
}

export interface IPC {
  closeApp: () => any
  openSettings: () => any
  closeSettings: () => any
  getSettings: () => any
  setSettings: (settings: string) => Promise<boolean>
}
