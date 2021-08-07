import {lex} from './Lexer'
import {parse} from './Parser'

export {lex, parse}
export default (input: string) => parse(lex(input))
