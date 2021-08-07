import parse from '../src'
import cases, {n} from './cases'

describe(`${n} tests with ordering permutations`, () => {
  for (const test of cases) {
    it(`${test.error ? 'Exception: ' : ''}${test.input}`, () => {
      if (test.error) {
        expect(() => parse(test.input)).toThrow(
          new Error(`Fenceparser: ${test.error}.`)
        )
      } else if (test.output) {
        expect(parse(test.input)).toEqual(test.output)
      }
    })
  }
})
