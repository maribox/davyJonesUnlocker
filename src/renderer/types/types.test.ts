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
      const operator = randomOperator()
      const term = randomTerm()
      if (!(operator === '/' && term === '0')) {
        terms.push(operator)
        terms.push(term)
      }
    }
    return terms.join('')
  }
  return randomMathTerm()
}

test('random tests', () => {
  for (let i = 0; i < 500; i++) {
    const term = randomMathTerm()
    mathTermTest(term)
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

test('specific tests', () => {
  mathTermTest('-2 - 25/48')
})

test('invalid tests', () => {
  expect(() => new MathTerm('1+')).toThrow(Error)
  expect(() => new MathTerm('1+1+')).toThrow(Error)
  expect(() => new MathTerm('1+5/65*2+')).toThrow(Error)
  expect(() => new MathTerm('(-1)+5/65*(-2)-1+')).toThrow(Error)
  expect(() => new MathTerm('console.log("test")')).toThrow(Error)
  expect(() => new MathTerm('1/0')).toThrow(Error)
  expect(() => new MathTerm('Math.sqrt(-1)')).toThrow(Error)
  expect(() => new MathTerm('1+*2')).toThrow(Error)
  expect(() => new MathTerm('1+(2')).toThrow(Error)
  expect(() => new MathTerm('Math.sin()')).toThrow(Error)
  expect(() => new MathTerm('Math.pow(2, 3, 4)')).toThrow(Error)
  expect(() => new MathTerm('Math.random(10)')).toThrow(Error)
  expect(() => new MathTerm('Math.abs("hello")')).toThrow(Error)
  expect(() => new MathTerm('Math.log(-1)')).toThrow(Error)
  expect(() => new MathTerm('Math.max()')).toThrow(Error)
  expect(() => new MathTerm('Math.min()')).toThrow(Error)
  expect(() => new MathTerm('sqrt(4)')).not.toThrow(Error)
})
