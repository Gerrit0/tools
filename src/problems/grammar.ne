# Hand in: 2, 3b, d, 4b, d, 6, 10, 14, 17, 19, 23, 24b, 25b, 29, 33, 38, 42, 44, 46, 48
# Suggested: 1 - 4, 6, 9 - 14, 17 - 20, 22 - 25, 28, 29, 32, 33, 37, 38, 41 - 48

@preprocessor typescript

main -> _ problems _ {% d => d[1] %}

problems ->
    (problem_range|problem) _ "," _ problems {% d => [d[0][0]].concat(d[4]) %}
  | problem_range
  | problem

problem_range ->
  number _ ("-"|"−"|"–"|"—"|"―") _ number {% d => ({ range: [d[0], d[4]] }) %}

problem -> number modifiers {% ([value, parts ]) => ({ value, parts }) %}

modifiers ->
  modifier:* {% id %}
  | modifiers _ "," _ modifier:+ {% d => d[0].concat(d[4]) %}

modifier -> [a-z] {% id %}

number -> [0-9]:+ {% d => +d[0].join('') %}

_ -> [ \t]:*

