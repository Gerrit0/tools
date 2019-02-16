// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

export interface Token { value: any; [key: string]: any };

export interface Lexer {
  reset: (chunk: string, info: any) => void;
  next: () => Token | undefined;
  save: () => any;
  formatError: (token: Token) => string;
  has: (tokenType: string) => boolean
};

export interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
};

export type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

export var Lexer: Lexer | undefined = undefined;

export var ParserRules: NearleyRule[] = [
    {"name": "main", "symbols": ["_", "problems", "_"], "postprocess": d => d[1]},
    {"name": "problems$subexpression$1", "symbols": ["problem_range"]},
    {"name": "problems$subexpression$1", "symbols": ["problem"]},
    {"name": "problems", "symbols": ["problems$subexpression$1", "_", {"literal":","}, "_", "problems"], "postprocess": d => [d[0][0]].concat(d[4])},
    {"name": "problems", "symbols": ["problem_range"]},
    {"name": "problems", "symbols": ["problem"]},
    {"name": "problem_range$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "problem_range$subexpression$1", "symbols": [{"literal":"−"}]},
    {"name": "problem_range$subexpression$1", "symbols": [{"literal":"–"}]},
    {"name": "problem_range$subexpression$1", "symbols": [{"literal":"—"}]},
    {"name": "problem_range$subexpression$1", "symbols": [{"literal":"―"}]},
    {"name": "problem_range", "symbols": ["number", "_", "problem_range$subexpression$1", "_", "number"], "postprocess": d => ({ range: [d[0], d[4]] })},
    {"name": "problem", "symbols": ["number", "modifiers"], "postprocess": ([value, parts ]) => ({ value, parts })},
    {"name": "modifiers$ebnf$1", "symbols": []},
    {"name": "modifiers$ebnf$1", "symbols": ["modifiers$ebnf$1", "modifier"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "modifiers", "symbols": ["modifiers$ebnf$1"], "postprocess": id},
    {"name": "modifiers$ebnf$2", "symbols": ["modifier"]},
    {"name": "modifiers$ebnf$2", "symbols": ["modifiers$ebnf$2", "modifier"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "modifiers", "symbols": ["modifiers", "_", {"literal":","}, "_", "modifiers$ebnf$2"], "postprocess": d => d[0].concat(d[4])},
    {"name": "modifier", "symbols": [/[a-z]/], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": d => +d[0].join('')},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \t]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"]}
];

export var ParserStart: string = "main";
