import { buildPage } from './problems/problems'
import { buildTrueFalse } from './truefalse'
import { buildTable, buildMathTable } from './table'
import { stripCopy } from './copy'

export interface Tool {
  name: string
  placeholder: string
  transform: (text: string) => string
}

export const tools: Tool[] = [
  {
    name: 'Discrete Problems',
    transform: buildPage,
    placeholder: 'Suggested: 1, 2, 5-10\nHand in: 2b, 6'
  },
  {
    name: 'True / False',
    transform: buildTrueFalse,
    placeholder: '1'
  },
  {
    name: 'Table',
    transform: buildTable,
    placeholder: 'a b ~a|b\nT T T'
  },
  {
    name: 'Math Table',
    transform: buildMathTable,
    placeholder: 'Cost(V_4,7) 7\nCost(V_4,8) 3'
  },
  {
    name: 'Strip Kindle Copy',
    transform: stripCopy,
    placeholder: ''
  }
]
