import { lex } from './Lexer'
import { parse } from './Parser'

export default (input: string) => parse(lex(input))
