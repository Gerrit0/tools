// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

interface NearleyToken {  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: NearleyToken) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "main", "symbols": ["_", "problems"], "postprocess": d => d[1]},
    {"name": "problems", "symbols": ["problem"]},
    {"name": "problems", "symbols": ["problem_range"]},
    {"name": "problems$subexpression$1", "symbols": ["problem"]},
    {"name": "problems$subexpression$1", "symbols": ["problem_range"]},
    {"name": "problems", "symbols": ["problems", {"literal":","}, "_", "problems$subexpression$1"], "postprocess": d => d[0].concat(d[3])},
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
  ],
  ParserStart: "main",
};

export default grammar;
