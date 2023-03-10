import { expect } from 'vitest'
import { generateDate } from '../components/sharedFunctions'
import { Difficulty } from '../types/types'

expect(generateDate(Difficulty.very_hard)).toBeInstanceOf(Date)
