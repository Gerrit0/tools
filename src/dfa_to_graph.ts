export function dfaToGraph (text: string): string {
  const [first, ...rest] = text.split('\n')
  const out = ['digraph G {', '\trankdir=LR', '\tstart[shape=point style=invis]', '']
  const out2 = ['']

  const accept = first.replace(/^\{|\}$/g, '').split(',')
  const seen = new Set<string>()
  let seenFirst = false

  for (const line of rest.filter(Boolean)) {
    const [from, what, to] = line.split(',')
    if (!seenFirst) {
      out2.push(`\tstart -> q_${from.replace(/`/g, 'eps')}`)
      seenFirst = true
    }
    out2.push(
      `\tq_${from.replace(/`/g, 'eps')} -> q_${to.replace(/`/g, 'eps')} [label=<${what.replace(
        /`/g,
        '&epsilon;'
      )}>]`
    )
    seen.add(from)
    seen.add(to)
  }

  for (const state of seen) {
    if (accept.includes(state)) {
      out.push(
                `\tq_${state.replace(/`/g, 'eps')}[shape=doublecircle label=<q<SUB>${state.replace(
                    /`/g,
                    '&epsilon;'
                )}</SUB>>]`
            )
    } else {
      out.push(
                `\tq_${state.replace(/`/g, 'eps')}[shape=circle label=<q<SUB>${state.replace(
                    /`/g,
                    '&epsilon;'
                )}</SUB>>]`
            )
    }
  }

  out2.push('}')

  return out.concat(out2).join('\n')
}
