export type Token = string | number | boolean

export const isQuoted = (s: string) => {
  const first = s[0]
  const last = s[s.length - 1]

  return s.length > 1 && first === last && (first === '"' || last === "'")
}

export class Iterator<T extends string | Array<Token>> {
  protected error(err: string) {
    throw new Error(`Fenceparser: ${err}.`)
  }

  protected start = 0
  protected current = 0

  protected peek(n?: number): T[number] {
    return this.input[this.current + (n ?? 0)]
  }

  protected advance(): T[number] {
    return this.input[this.current++]
  }

  protected isAtEnd() {
    return this.current >= this.input.length
  }

  public constructor(protected readonly input: T) {}
}
