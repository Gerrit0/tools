import { buildPage } from './problems/problems'
import { buildTrueFalse } from './truefalse'
import { buildTable, buildMathTable } from './table'
import { stripCopy } from './copy'
import { generateSi } from './generate_sis'
import { buildPowerSet } from './powerset/powerset'
import { dfaToGraph } from './dfa_to_graph'
import { pdaToGraph } from './pda_to_graph'

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
    name: 'DFA to Graphviz Digraph',
    transform: dfaToGraph,
    placeholder: '{2}\n0,0,0\n0,1,0\n0,0,1\n1,0,2'
  },
  {
    name: 'PDA to Graphviz Digraph',
    transform: pdaToGraph,
    placeholder: '{4}\n(0,`,`)->(1,$)\n...'
  },
  {
    name: 'Power Set',
    transform: buildPowerSet,
    placeholder: '{ 1, 2, 3 } or { (1, 2), 3 }'
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
    name: 'Build S^i arrays',
    transform: generateSi,
    placeholder: 'w_i\np_i'
  },
  {
    name: 'Strip Kindle Copy',
    transform: stripCopy,
    placeholder: ''
  }
]
