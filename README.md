<img align="center" src="https://raw.githubusercontent.com/frencojobs/fenceparser/dev/.github/cover.png" />

<p align="center"> A well-tested parser for parsing metadata out of fenced code blocks in Markdown. </p>

## Overview

Assuming you have this code fence in your Markdown,

<!-- prettier-ignore-start -->

````md
 ```ts twoslash {1-3, 5} title="Hello, World"
````

<!-- prettier-ignore-end -->

Using [remark](https://github.com/remarkjs/remark) will yield two information about that code block, `lang` and `meta` like this.

```json
{
  "lang": "ts",
  "meta": "twoslash {1-3, 5} title=\"Hello, World\""
}
```

Use `fenceparser` to parse the `meta` string out to a useful object.

```js
import parse from 'fenceparser'

console.log(parse(meta))

// {
//   twoslash: true,
//   highlight: { '1-3': true, '5': true },
//   title: 'Hello, World'
// }
```

> The parser won't intentionally handle parsing the language part since it is usually handled by the Markdown parsers.

## Syntax

The syntax grammar is loosely based on techniques used by various syntax-highlighters. Rules are such that

- Valid HTML attributes can be used, `attribute`, `data-attribute`, etc.
- Attributes without values are assigned as `true`
- Attribute values can be single or double quoted strings, int/float numbers, booleans, objects or arrays
- Non-quoted strings are valid as long as they are not separated by a whitespace or a line-break, `attr=--theme-color`
- Objects can accept valid attributes as children, or valid attributes with value assigned by `:` keyword, `{1-3, 5, ids: {7}}`
- Arrays are just like JavaScript's arrays
- Objects without attribute keys `{1-3} {7}` are merged and assigned to the `highlight` object
- No trailing commas

## Acknowledgements

1. This project is made initially to use with [Twoslash](https://github.com/shikijs/twoslash).
2. The `Lexer` and `Parser` are based on the examples from the book [Crafting Interpreters](http://craftinginterpreters.com).
