import { Difficulty } from '../../../types/types'

export function generateDate(difficulty: Difficulty): Date {
  const date = new Date()

  switch (difficulty) {
    case Difficulty.very_easy:
      date.setFullYear(getRandomYearAround(date.getFullYear(), 10, 5))
      break
    case Difficulty.easy:
      date.setFullYear(getRandomYearAround(date.getFullYear(), 25, 10))
      break
    case Difficulty.medium:
      date.setFullYear(getRandomYearAround(date.getFullYear(), 50, 25))
      break
    case Difficulty.hard:
      date.setFullYear(getRandomYearAround(date.getFullYear(), 100, 50))
      break
    case Difficulty.very_hard:
      date.setFullYear(getRandomYearAround(date.getFullYear(), 1000, 100))
  }

  date.setMonth(Math.floor(Math.random() * 12))
  date.setDate(getRandomDay(date.getMonth(), date.getFullYear()))
  return date

  function getRandomYearAround(year: number, distanceAroundYear: number, stdDev = 20): number {
    do {
      // convert year to int
      year = Math.round(customBoxMuller(date.getFullYear(), stdDev))
    } while (
      year < date.getFullYear() - distanceAroundYear ||
      year > date.getFullYear() + distanceAroundYear
    )
    return year
  }

  function getRandomDay(month: number, year: number): number {
    switch (month) {
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return Math.floor(Math.random() * 31)
      case 3:
      case 5:
      case 8:
      case 10:
        return Math.floor(Math.random() * 30)
      case 1:
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return Math.floor(Math.random() * 29)
        } else {
          return Math.floor(Math.random() * 28)
        }
      default:
        throw new Error('Invalid month')
    }
  }
}

export function customBoxMuller(mean: number, stdev: number): number {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}

export function randomMathTermString(difficulty: Difficulty): string {
  let termLength: number
  switch (difficulty) {
    case Difficulty.very_easy:
      termLength = 2
      break
    case Difficulty.easy:
    case Difficulty.medium:
    case Difficulty.hard:
    case Difficulty.very_hard:
      termLength = difficulty
      break
  }
  const operators = ['+', '-', '*', '/']
  let termNumber = Math.floor(customBoxMuller(2, 5 * difficulty))
  let term = `${termNumber >= 0 ? termNumber : '(' + termNumber + ')'}`
  let operator: string
  for (let i = 0; i < termLength; i++) {
    operator = operators[Math.floor(Math.random() * operators.length)]
    switch (operator) {
      case '+':
        termNumber = Math.floor(customBoxMuller(20, 10 * difficulty))
        term += ` ${operator} ${termNumber >= 0 ? termNumber : '(' + termNumber + ')'}`
        break
      case '-':
        termNumber = Math.floor(customBoxMuller(2, 10 * difficulty))
        term += ` ${operator} ${termNumber > 0 ? termNumber : -(termNumber - 1)}`
        break
      case '*':
      case '/':
        termNumber = Math.floor(customBoxMuller(3, 3 * difficulty))
        term += ` ${operator} ${termNumber > 0 ? termNumber : -(termNumber - 1)}`
        break
    }
  }
  return term
}
