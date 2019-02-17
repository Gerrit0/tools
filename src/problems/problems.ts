import { Parser, Grammar } from 'nearley'
import * as grammar from './grammar'

export interface Problem {
  value: number
  parts: string[]
}

const template = `
\\documentclass[12pt]{article}
\\pagestyle{empty}
\\usepackage[left=2cm,right=2cm,top=1cm,bottom=2cm,nohead,nofoot]{geometry}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{arydshln}
% List spacing
\\usepackage[shortlabels]{enumitem}
\\setlist[enumerate]{topsep=0pt}

\\usepackage{setspace}
\\onehalfspacing

\\newcommand{\\sect}[1] {\\vspace{1em}\\underline{Section #1}}

\\newcommand{\\problem}[1] {\\vspace{1em}#1.}

\\newcommand{\\norm}[1]{||\\vec{#1}||}
\\newcommand{\\adj}[0] {\\text{adj}}
\\newcommand{\\proj}[0]{\\text{proj}}
\\newcommand{\\R}{\\mathbb{R}}

\\renewcommand{\\labelenumi}{\\alph{enumi}.}


\\newif\\ifsuggested
%\\suggestedtrue % Comment out to remove suggested
% https://tex.stackexchange.com/a/15510
\\usepackage{comment}
\\ifsuggested
    \\newenvironment{suggested}{}{}
\\else
    \\excludecomment{suggested}
\\fi
% End suggested section

\\begin{document}

\\begin{flushright}
\\singlespacing
Gerrit Birkeland\\\\
%YEAR%/%MONTH%/%DAY%
\\end{flushright}

\\begin{flushleft}

\\sect{XXX}

%PROBLEMS%

\\end{flushleft}
\\end{document}
`.trim()

export function buildPage (text: string): string {
  const handInDate = nextTuesday(new Date())
  const map: {[k: string]: string | number} = {
    problems: buildProblems(text),
    year: handInDate.getFullYear(),
    month: (handInDate.getMonth() + 1).toString().padStart(2, '0'),
    day: handInDate.getDate().toString().padStart(2, '0')
  }

  return template.replace(/%(\w+)%/g, (_, key) => {
    return (map[key.toLowerCase()] || '') + ''
  })
}

function nextTuesday (d: Date) {
  if (d.getDay() === 2) {
    d.setDate(d.getDate() + 7)
  }
  while (d.getDay() !== 2) {
    d.setDate(d.getDate() + 1)
  }
  return d
}

export function buildProblems (text: string): string {
  const lines = text.split('\n')

  const suggestedLine = lines.find(line => line.startsWith('Suggested:'))
  const suggestedProblemText = suggestedLine ? suggestedLine.substr(10) : ''

  const problemLine = lines.find(line => line.startsWith('Hand in:'))
  const problemText = problemLine ? problemLine.substr(8) : lines[0]

  let inSuggested = false
  const suggestedProblems = buildList(suggestedProblemText)
  const requiredProblems = buildList(problemText)

  const result: string[] = []
  const startSuggested = () => !inSuggested && result.push('\\begin{suggested}') && (inSuggested = true)
  const endSuggested = () => inSuggested && result.push('\\end{suggested}', '') && (inSuggested = false)

  let suggestedIndex = 0
  let requiredIndex = 0

  while (suggestedIndex < suggestedProblems.length || requiredIndex < requiredProblems.length) {
    const suggested = suggestedProblems[suggestedIndex]
    const required = requiredProblems[requiredIndex]

    if (!suggested) {
      endSuggested()
      result.push(...buildProblem(required), '')
      requiredIndex++
      continue
    }

    if (!required) {
      startSuggested()
      result.push(...buildProblem(suggested))
      suggestedIndex++
      continue
    }

    if (suggested.value < required.value) {
      startSuggested()
      result.push(...buildProblem(suggested))
      suggestedIndex++
      continue
    }

    if (required.value < suggested.value) {
      endSuggested()
      result.push(...buildProblem(required), '')
      requiredIndex++
      continue
    }

    // Some parts of the problem may be required, and others not required.
    endSuggested()
    result.push(...buildMergedProblem(required, suggested))
    requiredIndex++
    suggestedIndex++
  }

  return result.join('\n')
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

function buildProblem (problem: Problem): string[] {
  const result: string[] = []

  if (problem.parts.length === 1) {
    result.push(`\\problem{${problem.value}${problem.parts[0]}}`)
  } else {
    result.push(`\\problem{${problem.value}}`)

    if (problem.parts.length) {
      result.push(`\\begin{enumerate}`)
      let index = 0
      for (const part of problem.parts) {
        const partIndex = alphabet.indexOf(part)
        if (partIndex !== index) {
          result.push(`\\setcounter{enumi}{${partIndex}}`)
          index = partIndex + 1
        } else {
          index++
        }
        result.push('\\item')
      }
      result.push(`\\end{enumerate}`)
    }
  }

  return result
}

function buildMergedProblem (required: Problem, suggested: Problem): string[] {
  const suggestedParts = suggested.parts.length ?
    suggested.parts.filter(p => !required.parts.includes(p)) :
    getPartsExcept(required.parts)

  const result = [
    '\\begin{suggested}',
    ...buildProblem({ ...suggested, parts: suggestedParts }),
    '\\end{suggested}',
    '',
    ...buildProblem(required),
    ''
  ]

  return result
}

export function getPartsExcept (parts: string[]): string[] {
  let index = 0
  const result: string[] = []
  for (const part of parts) {
    while (alphabet.indexOf(part) > index) {
      result.push(alphabet[index++])
    }
    index++
  }
  return result
}

export interface Range {
  range: [number, number]
}

export function buildList (text: string): Problem[] {
  const parser = new Parser(Grammar.fromCompiled(grammar))

  parser.feed(text)

  const results = parser.results as (Problem | Range)[][]

  // Empty input
  if (results.length === 0) {
    return []
  }

  if (results.length !== 1) {
    throw new Error('Ambiguous grammar')
  }

  return results[0].flatMap<Problem>(item => {
    if ('value' in item) return item
    const [ min, max ] = item.range
    if (min > max) throw new Error(`Invalid range ${min}-${max} has no elements.`)

    return Array.from({ length: max - min + 1 })
      .map((_, i) => ({ value: min + i, parts: [] }))
  })
}
