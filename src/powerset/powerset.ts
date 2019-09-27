import { Parser, Grammar } from 'nearley'
import * as grammar from './grammar'

export type ParsedSet = { type: 'set', elements: Element[] }
export type ParsedTuple = { type: 'tuple', elements: Element[] }
export type Element = ParsedSet | ParsedTuple | string

export function buildPowerSet (text: string): string {
  return text.split('\n').map(line => {
    const set = parseText(line)
    const elements = [ '\\emptyset' ]

    const otherElements: string[] = []
    for (let i = 1; i <= 2 ** set.elements.length - 1; i++) {
      console.log(i, set.elements, takeElements(i, set.elements))
      otherElements.push(`\\{ ${takeElements(i, set.elements)} \\}`)
    }// jkim021892@gmail

    elements.push(...otherElements.sort((a, b) => a.length - b.length))

    return `\\{ ${elements.join(', ')} \\}`
  }).join('\n\n')
}

export function takeElements (bitmap: number, elements: Element[]): string {
  return elements.filter((_, i) => bitmap & (1 << i)).map(parsedToString).join(', ')
}

export function parsedToString (el: string | Element): string {
  if (typeof el === 'string') return el
  return el.type === 'set'
    ? `\\{ ${el.elements.map(parsedToString)} \\}`
    : `( ${el.elements.map(parsedToString)} )`
}

export function parseText (text: string): ParsedSet {
  const parser = new Parser(Grammar.fromCompiled(grammar))
  parser.feed(text)
  const results = parser.results as ParsedSet[]

  if (results.length === 0) {
    return { type: 'set', elements: [] }
  }

  if (results.length !== 1) {
    throw new Error('Ambiguous grammar')
  }

  return results[0]
}
