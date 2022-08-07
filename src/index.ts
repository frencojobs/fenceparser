import {lex} from './lex'
import {parse} from './parse'

export {FenceparserError} from './error'
export {lex, parse}
export default (input: string) => parse(lex(input))
