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
