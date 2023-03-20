import { expect, test } from 'vitest'
import { generateDate } from '../components/sharedFunctions'
import { Difficulty } from '../../../types/types'

test('generateDateTest', () => {
  expect(generateDate(Difficulty.very_hard)).toBeInstanceOf(Date)
})
