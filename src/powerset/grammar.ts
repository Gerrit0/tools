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
    {"name": "main", "symbols": ["set", "_"], "postprocess": id},
    {"name": "set$ebnf$1", "symbols": ["elements"], "postprocess": id},
    {"name": "set$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "set", "symbols": ["_", {"literal":"{"}, "set$ebnf$1", "_", {"literal":"}"}], "postprocess": d => ({ type: 'set', elements: d[2] || [] })},
    {"name": "elements", "symbols": ["element"], "postprocess": d => [d[0]]},
    {"name": "elements", "symbols": ["elements", "_", {"literal":","}, "element"], "postprocess": d => d[0].concat(d[3])},
    {"name": "element", "symbols": ["tuple"], "postprocess": d => d[0]},
    {"name": "element", "symbols": ["single_item"], "postprocess": d => d[0]},
    {"name": "element", "symbols": ["set"], "postprocess": d => d[0]},
    {"name": "tuple$ebnf$1", "symbols": ["elements"], "postprocess": id},
    {"name": "tuple$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "tuple", "symbols": ["_", {"literal":"("}, "tuple$ebnf$1", "_", {"literal":")"}], "postprocess": d => ({ type: 'tuple', elements: d[2] || [] })},
    {"name": "single_item$ebnf$1", "symbols": [/[\w]/]},
    {"name": "single_item$ebnf$1", "symbols": ["single_item$ebnf$1", /[\w]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "single_item", "symbols": ["_", "single_item$ebnf$1"], "postprocess": d => d[1].join('')},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
];

export var ParserStart: string = "main";
