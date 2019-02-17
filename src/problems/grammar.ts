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
    {"name": "main", "symbols": ["_", "problems"], "postprocess": d => d[1]},
    {"name": "problems", "symbols": ["problem"]},
    {"name": "problems", "symbols": ["problem_range"]},
    {"name": "problems$subexpression$1", "symbols": ["problem"]},
    {"name": "problems$subexpression$1", "symbols": ["problem_range"]},
    {"name": "problems", "symbols": ["problems", "_", {"literal":","}, "_", "problems$subexpression$1"], "postprocess": d => d[0].concat(d[4])},
    {"name": "problem$ebnf$1", "symbols": ["parts"], "postprocess": id},
    {"name": "problem$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "problem", "symbols": ["number", "_", "problem$ebnf$1"], "postprocess": ([value, _, parts]) => ({ value, parts: parts || [] })},
    {"name": "problem_range", "symbols": ["number", "_", {"literal":"-"}, "_", "number"], "postprocess": d => ({ range: [d[0], d[4]] })},
    {"name": "parts", "symbols": ["part"], "postprocess": id},
    {"name": "parts", "symbols": ["parts", "_", {"literal":","}, "_", "part"], "postprocess": d => d[0].concat(d[4])},
    {"name": "part$ebnf$1", "symbols": [/[a-z]/]},
    {"name": "part$ebnf$1", "symbols": ["part$ebnf$1", /[a-z]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "part", "symbols": ["part$ebnf$1"], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": d => +d[0].join('')},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
];

export var ParserStart: string = "main";
