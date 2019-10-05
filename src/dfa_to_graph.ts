// This is reversed from the parse result used in the simulator.
// Map<State, Map<State, Set<Inputs>>>
function parseMachine (lines: string[]): Map<string, Map<string, Set<string>>> {
  const result: Map<string, Map<string, Set<string>>> = new Map()

  for (const line of lines) {
    const [from, input, to] = line.split(',')
    const transitions: Map<string, Set<string>> = result.get(from) || new Map()
    const targets: Set<string> = transitions.get(to) || new Set()
    targets.add(input)
    transitions.set(to, targets)
    result.set(from, transitions)
  }

  return result
}

export function dfaToGraph (text: string): string {
  const [first, ...rest] = text.split('\n')
  const out = ['digraph G {', '\trankdir=LR', '\tstart[shape=point style=invis]', '']
  const out2 = [`\tstart -> q_0`]

  const accept = first.replace(/^\{|\}$/g, '').split(',')
  const seen = new Set<string>()
  const machine = parseMachine(rest.filter(Boolean))

  for (const [from, transitions] of machine) {
    if (!seen.has(from)) {
      seen.add(from)
      const shape = accept.includes(from) ? 'doublecircle' : 'circle'
      const label = `q<SUB>${from.replace(/`/g, 'eps')}</SUB>`
      out.push(`\tq_${from.replace(/`/g, 'eps')}[shape=${shape} label=<${label}>]`)
    }

    for (const [target, inputs] of transitions) {
      out2.push(
        `\tq_${
          from.replace(/`/g, 'eps')
        } -> q_${
          target.replace(/`/g, 'eps')
        } [label=<${
          [...inputs].join(',').replace(/`/g, '&epsilon;')
        }>]`
      )

      if (!seen.has(target)) {
        seen.add(target)
        const shape = accept.includes(target) ? 'doublecircle' : 'circle'
        const label = `q<SUB>${target.replace(/`/g, 'eps')}</SUB>`
        out.push(`\tq_${target.replace(/`/g, 'eps')}[shape=${shape} label=<${label}>]`)
      }
    }
  }

  return out.concat(out2, '}').join('\n')
}
