import { expect } from 'vitest'
import { generateDate } from '../components/Task'
import { Difficulty } from '../types/types'

expect(generateDate(Difficulty.very_hard)).toBeInstanceOf(Date)
