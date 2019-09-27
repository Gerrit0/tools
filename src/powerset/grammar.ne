@preprocessor typescript

main -> set _ {% id %}

set -> _ "{" elements:? _ "}" {% d => ({ type: 'set', elements: d[2] || [] }) %}

elements ->
  element {% d => [d[0]] %}
  | elements _ "," element {% d => d[0].concat(d[3]) %}

element ->
  tuple {% d => d[0] %}
  | single_item {% d => d[0] %}
  | set {% d => d[0] %}

tuple -> _ "(" elements:? _ ")" {% d => ({ type: 'tuple', elements: d[2] || [] }) %}

single_item -> _ [\w]:+ {% d => d[1].join('') %}

_ -> [\s]:* {% () => null %}
