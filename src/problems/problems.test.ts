import { Problem, buildProblems, getPartsExcept, buildList } from './problems'
import * as test from 'tape'

const cases: { [k: string]: [string, Problem[]] } = {
  'Just a number': ['1', [{ value: 1, parts: [] }]],
  'Multiple numbers': ['1, 2', [{ value: 1, parts: [] }, { value: 2, parts: [] }]],
  'Number with part': ['1a', [{ value: 1, parts: ['a'] }]],
  Ranges: ['1-2', [{ value: 1, parts: [] }, { value: 2, parts: [] }]],
  Everything: [
    '1a, 2bcd, e, 5-6',
    [
      { value: 1, parts: ['a'] },
      { value: 2, parts: ['b', 'c', 'd', 'e'] },
      { value: 5, parts: [] },
      { value: 6, parts: [] }
    ]
  ],
  'Empty input': ['', []],
  'Whitespace': ['  1,   3  ', [{ value: 1, parts: [] }, { value: 3, parts: [] }]]
}

for (const [name, [input, output]] of Object.entries(cases)) {
  test(name, t => {
    t.plan(1)
    t.deepEqual(buildList(input), output)
  })
}

const errorCases: { [k: string]: string } = {
  'Missing comma': '1 2',
  'Parts without a number': 'a, b'
}

for (const [name, input] of Object.entries(errorCases)) {
  test(name, t => {
    t.plan(1)
    t.throws(() => buildList(input))
  })
}

const mergedCase = String.raw`
\begin{suggested}
\problem{1}
\begin{enumerate}
\item
\item
\setcounter{enumi}{4}
\item
\end{enumerate}
\end{suggested}

\problem{1}
\begin{enumerate}
\setcounter{enumi}{2}
\item
\item
\end{enumerate}
`.trimLeft()

const textCases: { [k: string]: [string, string] } = {
  'Number': ['1', `\\problem{1}\n`],
  'Suggested': ['Suggested: 1\nHand in: 2', `\\begin{suggested}\n\\problem{1}\n\\end{suggested}\n\n\\problem{2}\n`],
  'Merged': ['Suggested: 1ab, e\nHand in: 1cd', mergedCase],
  'Merged without parts': ['Suggested: 1\nHand in: 1cd', mergedCase.replace('\\setcounter{enumi}{4}\n\\item\n', '')],
  'In both': ['Suggested: 1\nHand in: 1', '\\problem{1}\n']
}

for (const [name, [input, output]] of Object.entries(textCases)) {
  test(name, t => {
    t.plan(1)
    t.equal(buildProblems(input), output)
  })
}

test('getPartsExcept', t => {
  t.plan(2)
  t.deepEqual(getPartsExcept(['d']), ['a', 'b', 'c'])
  t.deepEqual(getPartsExcept(['a', 'd']), ['b', 'c'])
})
