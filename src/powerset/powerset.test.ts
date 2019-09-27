import * as test from 'tape'
import { ParsedSet, parseText, Element, parsedToString, takeElements, buildPowerSet } from './powerset'

const cases: { [k: string]: [string, ParsedSet] } = {
  'Empty set': ['{ }', { type: 'set', elements: [] }],
  'With elements': ['{1, 2}', { type: 'set', elements: ['1', '2'] }],
  'With a tuple': ['{(0)}', { type: 'set', elements: [{ type: 'tuple', elements: ['0'] }] }],
  'Spacing': ['   {  1  ,   4 }', { type: 'set', elements: ['1', '4'] }]
}

for (const [name, [input, output]] of Object.entries(cases)) {
  test(name, t => {
    t.plan(1)
    t.deepEqual(parseText(input), output)
  })
}

const stringifyCases: { [k: string]: [Element, string] } = {
  String: ['1', '1'],
  'Basic set': [{ type: 'set', elements: ['1'] }, '\\{ 1 \\}'],
  'Basic tuple': [{ type: 'tuple', elements: [] }, '(  )'],
  'Basic tuple with element': [{ type: 'tuple', elements: ['5'] }, '( 5 )']
}

for (const [name, [input, output]] of Object.entries(stringifyCases)) {
  test(name, t => {
    t.plan(1)
    t.equal(parsedToString(input), output)
  })
}

const takeElementsCases: { [k: string]: [[number, Element[]], string] } = {
  'No elements': [[0, []], ''],
  'With a string': [[1, ['1']], '1'],
  'With a set': [[1, [{ type: 'set', elements: ['1'] }]], '\\{ 1 \\}'],
  'With a tuple': [[1, [{ type: 'tuple', elements: ['1'] }]], '( 1 )'],
  'Filtered': [[1, ['1', '2', '3']], '1'],
  'Second': [[2, ['1', '2', '3']], '2'],
  'Multiple': [[3, ['1', '2', '3']], '1, 2']
}

for (const [name, [input, output]] of Object.entries(takeElementsCases)) {
  test(name, t => {
    t.plan(1)
    t.equal(takeElements(...input), output)
  })
}

const buildPowerSetCases: { [k: string]: [string, string] } = {
  'Empty set': ['{}', '\\{ \\emptyset \\}'],
  'With one element': ['{ 1 }', '\\{ \\emptyset, \\{ 1 \\} \\}'],
  'With a tuple element': ['{ (1) }', '\\{ \\emptyset, \\{ ( 1 ) \\} \\}'],
  'With two elements': ['{ 1, 2 }', '\\{ \\emptyset, \\{ 1 \\}, \\{ 2 \\}, \\{ 1, 2 \\} \\}'],
  'With three elements': ['{ 1, 2, 3 }', '\\{ \\emptyset, \\{ 1 \\}, \\{ 2 \\}, \\{ 3 \\}, \\{ 1, 2 \\}, \\{ 1, 3 \\}, \\{ 2, 3 \\}, \\{ 1, 2, 3 \\} \\}']
}

for (const [name, [input, output]] of Object.entries(buildPowerSetCases)) {
  test(name, t => {
    t.plan(1)
    t.equal(buildPowerSet(input), output)
  })
}
