import { expect, test } from 'vitest'
import MathTerm from './MathTerm'
import { randomMathTermString } from '../src/lockScreen/components/sharedFunctions'
import { Difficulty } from './types'

test('standard tests', () => {
  mathTermTest('1')
  mathTermTest('1+1')
  mathTermTest('1+5/65*2')
  mathTermTest('(-1)+5/65*(-2)-1')
})

function randomMathTerm(): string {
  const operators = ['+', '-', '*', '/']
  const randomInt = (min: number, max: number): any =>
    Math.floor(Math.random() * (max - min + 1) + min)
  const randomOperator = (): any => operators[randomInt(0, operators.length - 1)]
  const randomTerm = (): any => randomInt(0, 100).toString()
  const randomMathTerm = (): any => {
    const terms = [randomTerm()]
    for (let i = 0; i < randomInt(0, 5); i++) {
      terms.push(randomOperator())
      terms.push(randomTerm())
    }
    return terms.join('')
  }
  return randomMathTerm()
}

test('random tests', () => {
  for (let i = 0; i < 100; i++) {
    mathTermTest(randomMathTerm())
  }
})

test('bracket and minus tests', () => {
  mathTermTest('1-1')
  mathTermTest('1-5/65*2')
  mathTermTest('(-1)-5/65*(-2)-1')
  mathTermTest('1-(1)')
  mathTermTest('1-(5/65*2)')
  mathTermTest('(-1)-(5/65*(-2))-1')
  mathTermTest('(1)-(1)')
  mathTermTest('(1)-(5/65*2)')
  mathTermTest('((-1))-(5/65*(-2))-1')
  mathTermTest('((1))-(1)')
  mathTermTest('((1))-(5/65*2)')
  mathTermTest('(((-1)))-(5/65*(-2))-1')
  mathTermTest('((1-1))')
  mathTermTest('((1-5/65*2))')
  mathTermTest('(((-1)-5/65*(-2))-1)')
  mathTermTest('((1)-(1))')
  mathTermTest('((1)-(5/65*2))')
  mathTermTest('(((-1))-(5/65*(-2))-1)')
  mathTermTest('(((1))-(1))')
  mathTermTest('(((1))-(5/65*2))')
  mathTermTest('(((((-1)))-(5/65*(-2))-1))')
})

function mathTermTest(termString: string): void {
  const term = new MathTerm(termString)
  console.log(term.toString())
  expect(term.evaluate()).toEqual(eval(termString.replace(/\^/g, '**')))
}

test('random-math-test', () => {
  console.log('starte test')
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < Object.values(Difficulty).length / 2; j++) {
      const term = randomMathTermString(Difficulty.very_hard)
      console.log(term)
      mathTermTest(term)
    }
  }
})
