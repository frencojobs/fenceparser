// from https://stackoverflow.com/a/30551462
const p = (xs: string[]): typeof xs[] => {
  if (!xs.length) return [[]]
  return xs.flatMap((x) => p(xs.filter((v) => v !== x)).map((vs) => [x, ...vs]))
}

interface TestCase {
  input: string[]
  output?: Record<string, unknown> | null
  error?: string
}

export const prepareCases = (cases: TestCase[]) => {
  return cases
    .map(({input, ...props}) =>
      p(input).map((p) => ({input: p.join(' '), ...props})),
    )
    .reduce((a, b) => [...a, ...b])
}
