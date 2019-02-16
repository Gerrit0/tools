import { buildPage } from './problems/problems'
import { buildTrueFalse } from './truefalse'
import { buildTable } from './table'

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
  }
]
