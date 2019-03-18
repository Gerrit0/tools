function last<T> (arr: T[]): T {
  return arr[arr.length - 1]
}

function purge (arr: [number, number][]): [number, number][] {
  let maxProfit = -Infinity
  return arr.sort((a, b) => a[1] - b[1] ? a[1] - b[1] : a[0] - b[0])
    .filter(([p, w]) => {
      if (p > maxProfit) {
        maxProfit = p
        return true
      }
      return false
    })
}

export function generateSi (text: string): string {
  const [ wText, pText ] = text.replace(/[^\d \n]/g, '').split('\n')
  if (!wText || !pText) return 'Invalid input'

  const w = wText.split(/\s+/).map(Number)
  const p = pText.split(/\s+/).map(Number)

  if (w.length !== p.length) return 'Lists must be the same length'

  const pw = p.map((p, i) => [p, w[i]])

  const result: [number, number][][] = [[ [0, 0] ]]

  console.log(pw)

  for (let i = 0; i < pw.length; i++) {
    const item = pw[i]
    // Generate S^i_1
    const simin1 = last(result)
    const si1 = simin1.map(([w, p]) => [w + item[0], p + item[1]] as [number, number])
      .sort((a, b) => a[1] - b[1])
    result.push(si1)

    // Generate S^{i+1}
    result.push(purge(simin1.concat(si1)))
  }

  return '\\begin{align*}\n' + result.map((row, i) => {
    return `S^${Math.floor(i / 2)}${i % 2 ? '_1' : ''} &= \\{ ${row.map(r => `(${r[0]}, ${r[1]})`).join(', ')} \\}`
  }).join('\\\\\n') + '\\end{align*}'
}
