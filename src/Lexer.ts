import { Iterator, Token } from './utils'

export const lex = (input: string) => new Lexer(input).scan()

const KEYWORDS: Record<string, Token> = {
  true: true,
  false: false
}

const isAlpha = (s: string) => /[a-zA-Z_$-]/.test(s)
const isNumeric = (s: string) => /[0-9]/.test(s)
const isAlphaNumeric = (s: string) => isAlpha(s) || isNumeric(s)

class Lexer extends Iterator<string> {
  private output: Array<Token> = []

  private string(quote: string) {
    while (this.peek() !== quote && !this.isAtEnd()) this.advance()

    if (this.isAtEnd()) {
      this.error('Unterminated string')
    }

    this.advance()
    this.output.push(this.input.substring(this.start, this.current))
  }

  private number() {
    while (isNumeric(this.peek()) && !this.isAtEnd()) this.advance()

    if (this.peek() == '-' && isNumeric(this.peek(1))) {
      this.advance()
      while (isNumeric(this.peek())) this.advance()
      this.output.push(this.input.substring(this.start, this.current))
      return
    } else if (this.peek() == '.' && isNumeric(this.peek(1))) {
      this.advance()
      while (isNumeric(this.peek())) this.advance()
    }

    this.output.push(parseFloat(this.input.substring(this.start, this.current)))
  }

  private identifier() {
    while (isAlphaNumeric(this.peek()) && !this.isAtEnd()) this.advance()

    const text = this.input.substring(this.start, this.current)
    if (Object.keys(KEYWORDS).includes(text)) {
      this.output.push(KEYWORDS[text])
    } else {
      this.output.push(text)
    }
  }

  public scan() {
    while (!this.isAtEnd()) {
      this.start = this.current

      const next = this.advance()
      switch (next) {
        case '{':
        case '}':
        case '=':
        case ',':
        case ':':
        case '[':
        case ']':
          this.output.push(next)
          break
        case '"':
        case "'":
          this.string(next)
          break
        case ' ':
        case '\r':
        case '\t':
        case '\n':
          break
        default:
          if (isNumeric(next)) {
            this.number()
          } else if (isAlpha(next)) {
            this.identifier()
          } else {
            this.error(`Unexpected character ${next}`)
          }
      }
    }

    return this.output
  }
}
