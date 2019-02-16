export function buildTrueFalse (text: string): string {
  const num = +text

  if (Number.isNaN(num)) {
    return 'Input is not numeric.'
  }

  if (num > 10) {
    return 'Input is too large.'
  }

  const rows = Math.pow(2, num)

  const result = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let s = num - 1; s >= 0; s--) {
      row.push(i & (1 << s) ? 'F' : 'T')
    }
    result.push(row.join(' '))
  }

  return result.join('\n')
}
