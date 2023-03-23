export default class MathTerm {
  private root: Node

  constructor(expression: string) {
    this.root = this.parse(expression)
  }

  private parse(expression: string): Node {
    const regex = /(\d+\.?\d*|\+|-|\*|\/|\^|\(|\))/g
    const tokens = expression.match(regex)!
    if (!tokens) {
      throw new Error('Invalid expression')
    }

    const operators = ['+', '-', '*', '/']

    const parseNode = (start: number, end: number): Node => {
      if (start === end) {
        return { value: tokens[start] }
      }

      let operatorIndex = -1
      let operatorPrecedence = Infinity

      if (tokens[start] === '-' || tokens[start] === '+') {
        const nextNode = parseNode(start + 1, end)
        return { value: tokens[start], left: { value: '0' }, right: nextNode }
      }
      if (tokens[start] === '(' && tokens[end] === ')') {
        let parenthesisCount = 0
        for (let i = start + 1; i <= end - 1; i++) {
          if (tokens[i] === '(') {
            parenthesisCount++
          }
          if (tokens[i] === ')') {
            parenthesisCount--
          }
          if (parenthesisCount < 0) {
            break
          }
        }
        if (parenthesisCount >= 0) {
          return parseNode(start + 1, end - 1)
        }
      }

      for (let i = end; i >= start; i--) {
        if (tokens[i] === ')') {
          let parenthesisCount = 0
          for (let j = i; j >= start; j--) {
            if (tokens[j] === ')') {
              parenthesisCount++
            }
            if (tokens[j] === '(') {
              parenthesisCount--
            }
            if (parenthesisCount == 0 && j < i) {
              i = j
              break
            }
          }
        }
        if (operators.includes(tokens[i])) {
          const currentPrecedence = this.getPrecedence(tokens[i])

          if (currentPrecedence < operatorPrecedence) {
            operatorIndex = i
            operatorPrecedence = currentPrecedence
          }
        }
      }

      if (operatorIndex === -1) {
        if (tokens[start] === '(' && tokens[end] === ')') {
          return parseNode(start + 1, end - 1)
        } else {
          return { value: tokens[start] }
        }
      }

      const node: Node = {
        value: tokens[operatorIndex],
        left: parseNode(start, operatorIndex - 1),
        right: parseNode(operatorIndex + 1, end)
      }

      return node
    }

    return parseNode(0, tokens.length - 1)
  }
  private getPrecedence(operator: string): number {
    switch (operator) {
      case '+':
      case '-':
        return 1
      case '*':
      case '/':
        return 2
      default:
        return Infinity
    }
  }

  public evaluate(): number {
    const evaluateNode = (node: Node): number => {
      if (!node.left && !node.right) {
        return Number(node.value)
      }

      const leftValue = evaluateNode(node.left!)
      const rightValue = evaluateNode(node.right!)

      switch (node.value) {
        case '+':
          return leftValue + rightValue
        case '-':
          return leftValue - rightValue
        case '*':
          return leftValue * rightValue
        case '/':
          return leftValue / rightValue

        default:
          throw new Error(`Invalid operator: ${node.value}`)
      }
    }

    return evaluateNode(this.root)
  }
  public toString(): string {
    const toStringNode = (node: Node): string => {
      if (!node.left && !node.right) {
        return node.value
      }

      const leftValue = toStringNode(node.left!)
      const rightValue = toStringNode(node.right!)

      return `(${leftValue} ${node.value} ${rightValue})`
    }

    return toStringNode(this.root)
  }
}

interface Node {
  value: string
  left?: Node
  right?: Node
}
