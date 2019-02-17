# Hand in: 2, 3b, d, 4b, d, 6, 10, 14, 17, 19, 23, 24b, 25b, 29, 33, 38, 42, 44, 46, 48
# Suggested: 1 - 4, 6, 9 - 14, 17 - 20, 22 - 25, 28, 29, 32, 33, 37, 38, 41 - 48

@preprocessor typescript

main -> _ problems {% d => d[1] %}

problems ->
    problem # No id since we want the problem to be in an array
  | problem_range # ditto
  | problems _ "," _ (problem|problem_range) {% d => d[0].concat(d[4]) %}

problem -> number _ parts:? {% ([value, _, parts]) => ({ value, parts: parts || [] }) %}

problem_range -> number _ "-" _ number {% d => ({ range: [d[0], d[4]] }) %}

parts ->
    part {% id %}
  | parts _ "," _ part {% d => d[0].concat(d[4]) %}

part -> [a-z]:+ {% id %}

number -> [0-9]:+ {% d => +d[0].join('') %}

_ -> [\s]:* {% () => null %}
