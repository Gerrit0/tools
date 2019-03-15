function toLatexSymbols (s: string) {
  return '$' + s.replace(/~|&|\||\\c|\\t|<>|>/g, v => {
    return ({
      '~': '\\sim ',
      '&': '\\wedge ',
      '|': '\\vee ',
      '\\c': '\\textbf{c}',
      '\\t': '\\textbf{t}',
      '>': '\\rightarrow ',
      '<>': '\\leftrightarrow '
    } as { [k: string]: string })[v]
  }) + '$'
}

export function buildTable (text: string): string {
  const lines = text.split('\n').map(s => s.trim())
  const columns = lines.reduce((max, line) =>
    Math.max(max, line.split(/\s+/).length), 0)

  const result = [
    `\\begin{tabular}{|${'c|'.repeat(columns)}}`,
    '\\hline'
  ]

  for (let i = 0; i < lines.length; i++) {
    if (/^-+$/.test(lines[i].trim())) {
      result.push('\\hline')
      continue
    }

    const entries = lines[i].split(/\s+/)

    if (i === 0) {
      result.push(entries.map(toLatexSymbols).join(' & ') + '\\\\')
      result.push('\\hline')
      continue
    }

    result.push(entries.join(' & ') + '\\\\')
  }

  result.push('\\hline', '\\end{tabular}')

  return result.join('\n')
}

export function buildMathTable (text: string): string {
  const lines = text.split('\n').map(s => s.trim())
  const columns = lines.reduce((max, line) =>
    Math.max(max, line.split(/\s+/).length), 0)

  const result = [
    `\\begin{tabular}{|${'c|'.repeat(columns)}}`,
    '\\hline'
  ]

  for (let i = 0; i < lines.length; i++) {
    if (/^-+$/.test(lines[i].trim())) {
      result.push('\\hline')
      continue
    }

    const entries = lines[i].split(/\s+/)

    if (i === 0) {
      result.push(entries.join(' & ') + '\\\\')
      result.push('\\hline')
      continue
    }

    result.push(entries.map(toLatexSymbols).join(' & ') + '\\\\')
  }

  result.push('\\hline', '\\end{tabular}')

  return result.join('\n')
}
