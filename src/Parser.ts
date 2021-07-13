import { isQuoted, Iterator, Token } from './utils'

// Grammar - Recursive Descent
//
// MAIN → EXPR*
// EXPR → OBJECT | IDENTIFIER (= VALUE)?
//
// OBJECT → { OBJECT_VALUES? }
// OBJECT_VALUES → OBJECT_VALUE (, OBJECT_VALUE)*
// OBJECT_VALUE → NUMBER | IDENTIFIER | (IDENTIFIER | STRING | NUMBER): VALUE
//
// ARRAY → [ ARRAY_VALUES? ]
// ARRAY_VALUES → (ARRAY_VALUE) (ARRAY_VALUE)*
// ARRAY_VALUE → VALUE
//
// VALUE → IDENTIFIER | OBJECT | ARRAY | ("|') STRING ("|') | BOOLEAN | NUMBER
// IDENTIFIER → STRING

export type OBJECT = { [key in string | number]: VALUE }
export type VALUE = OBJECT | Array<VALUE> | string | boolean | number

export const parse = (input: Array<Token>) => new Parser(input).parse()

class Parser extends Iterator<Array<Token>> {
  private output: Record<string, VALUE> = {}

  private object() {
    const result: OBJECT = {}
    const parseValue = () => {
      let identifier = this.advance()

      if (typeof identifier === 'number') {
        identifier = identifier as number
      } else if (typeof identifier === 'string' && isQuoted(identifier)) {
        identifier = identifier.slice(1, -1)
      }
      identifier = identifier as string

      if (this.peek() === ':') {
        this.advance()
        result[identifier] = this.value()
      } else {
        result[identifier] = true
      }
    }

    this.advance()
    if (this.peek() !== '}') {
      parseValue()
      while (this.peek() === ',') {
        this.advance()
        if (this.peek() === '}') {
          this.error('Trailing comma')
        }
        parseValue()
      }
    }

    if (this.advance() !== '}') {
      this.error('Unterminated object')
    }
    return result
  }

  private array() {
    const result: Array<VALUE> = []

    this.advance()
    if (this.peek() !== ']') {
      result.push(this.value())
      while (this.peek() === ',') {
        this.advance()
        if (this.peek() === ']') {
          this.error('Trailing comma')
        }
        result.push(this.value())
      }
    }
    if (this.advance() !== ']') {
      this.error('Unterminated array')
    }
    return result
  }

  private value(): VALUE {
    if (this.peek() === '{') {
      return this.object()
    } else if (this.peek() === '[') {
      return this.array()
    } else if (
      typeof this.peek() === 'string' &&
      isQuoted(this.peek() as string)
    ) {
      return (this.advance() as string).slice(1, -1)
    } else {
      return this.advance()
    }
  }

  public parse() {
    if (this.input.length < 1) {
      return null
    }

    while (!this.isAtEnd()) {
      const peeked = this.peek()

      if (peeked === '{') {
        if (!this.output.highlight) {
          this.output.highlight = {}
        }

        this.output.highlight = {
          ...(this.output.highlight as OBJECT),
          ...this.object()
        }
      } else {
        const identifier = this.advance() as string

        if (this.peek() === '=') {
          this.advance()
          this.output[identifier] = this.value()
        } else {
          this.output[identifier] = true
        }
      }
    }

    return this.output
  }
}
