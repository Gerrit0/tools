/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/nearley/lib/nearley.js":
/*!*********************************************!*\
  !*** ./node_modules/nearley/lib/nearley.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("(function(root, factory) {\n    if ( true && module.exports) {\n        module.exports = factory();\n    } else {\n        root.nearley = factory();\n    }\n}(this, function() {\n\n    function Rule(name, symbols, postprocess) {\n        this.id = ++Rule.highestId;\n        this.name = name;\n        this.symbols = symbols;        // a list of literal | regex class | nonterminal\n        this.postprocess = postprocess;\n        return this;\n    }\n    Rule.highestId = 0;\n\n    Rule.prototype.toString = function(withCursorAt) {\n        function stringifySymbolSequence (e) {\n            return e.literal ? JSON.stringify(e.literal) :\n                   e.type ? '%' + e.type : e.toString();\n        }\n        var symbolSequence = (typeof withCursorAt === \"undefined\")\n                             ? this.symbols.map(stringifySymbolSequence).join(' ')\n                             : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')\n                                 + \" ● \"\n                                 + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );\n        return this.name + \" → \" + symbolSequence;\n    }\n\n\n    // a State is a rule at a position from a given starting point in the input stream (reference)\n    function State(rule, dot, reference, wantedBy) {\n        this.rule = rule;\n        this.dot = dot;\n        this.reference = reference;\n        this.data = [];\n        this.wantedBy = wantedBy;\n        this.isComplete = this.dot === rule.symbols.length;\n    }\n\n    State.prototype.toString = function() {\n        return \"{\" + this.rule.toString(this.dot) + \"}, from: \" + (this.reference || 0);\n    };\n\n    State.prototype.nextState = function(child) {\n        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);\n        state.left = this;\n        state.right = child;\n        if (state.isComplete) {\n            state.data = state.build();\n        }\n        return state;\n    };\n\n    State.prototype.build = function() {\n        var children = [];\n        var node = this;\n        do {\n            children.push(node.right.data);\n            node = node.left;\n        } while (node.left);\n        children.reverse();\n        return children;\n    };\n\n    State.prototype.finish = function() {\n        if (this.rule.postprocess) {\n            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);\n        }\n    };\n\n\n    function Column(grammar, index) {\n        this.grammar = grammar;\n        this.index = index;\n        this.states = [];\n        this.wants = {}; // states indexed by the non-terminal they expect\n        this.scannable = []; // list of states that expect a token\n        this.completed = {}; // states that are nullable\n    }\n\n\n    Column.prototype.process = function(nextColumn) {\n        var states = this.states;\n        var wants = this.wants;\n        var completed = this.completed;\n\n        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration\n            var state = states[w];\n\n            if (state.isComplete) {\n                state.finish();\n                if (state.data !== Parser.fail) {\n                    // complete\n                    var wantedBy = state.wantedBy;\n                    for (var i = wantedBy.length; i--; ) { // this line is hot\n                        var left = wantedBy[i];\n                        this.complete(left, state);\n                    }\n\n                    // special-case nullables\n                    if (state.reference === this.index) {\n                        // make sure future predictors of this rule get completed.\n                        var exp = state.rule.name;\n                        (this.completed[exp] = this.completed[exp] || []).push(state);\n                    }\n                }\n\n            } else {\n                // queue scannable states\n                var exp = state.rule.symbols[state.dot];\n                if (typeof exp !== 'string') {\n                    this.scannable.push(state);\n                    continue;\n                }\n\n                // predict\n                if (wants[exp]) {\n                    wants[exp].push(state);\n\n                    if (completed.hasOwnProperty(exp)) {\n                        var nulls = completed[exp];\n                        for (var i = 0; i < nulls.length; i++) {\n                            var right = nulls[i];\n                            this.complete(state, right);\n                        }\n                    }\n                } else {\n                    wants[exp] = [state];\n                    this.predict(exp);\n                }\n            }\n        }\n    }\n\n    Column.prototype.predict = function(exp) {\n        var rules = this.grammar.byName[exp] || [];\n\n        for (var i = 0; i < rules.length; i++) {\n            var r = rules[i];\n            var wantedBy = this.wants[exp];\n            var s = new State(r, 0, this.index, wantedBy);\n            this.states.push(s);\n        }\n    }\n\n    Column.prototype.complete = function(left, right) {\n        var copy = left.nextState(right);\n        this.states.push(copy);\n    }\n\n\n    function Grammar(rules, start) {\n        this.rules = rules;\n        this.start = start || this.rules[0].name;\n        var byName = this.byName = {};\n        this.rules.forEach(function(rule) {\n            if (!byName.hasOwnProperty(rule.name)) {\n                byName[rule.name] = [];\n            }\n            byName[rule.name].push(rule);\n        });\n    }\n\n    // So we can allow passing (rules, start) directly to Parser for backwards compatibility\n    Grammar.fromCompiled = function(rules, start) {\n        var lexer = rules.Lexer;\n        if (rules.ParserStart) {\n          start = rules.ParserStart;\n          rules = rules.ParserRules;\n        }\n        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });\n        var g = new Grammar(rules, start);\n        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable\n        return g;\n    }\n\n\n    function StreamLexer() {\n      this.reset(\"\");\n    }\n\n    StreamLexer.prototype.reset = function(data, state) {\n        this.buffer = data;\n        this.index = 0;\n        this.line = state ? state.line : 1;\n        this.lastLineBreak = state ? -state.col : 0;\n    }\n\n    StreamLexer.prototype.next = function() {\n        if (this.index < this.buffer.length) {\n            var ch = this.buffer[this.index++];\n            if (ch === '\\n') {\n              this.line += 1;\n              this.lastLineBreak = this.index;\n            }\n            return {value: ch};\n        }\n    }\n\n    StreamLexer.prototype.save = function() {\n      return {\n        line: this.line,\n        col: this.index - this.lastLineBreak,\n      }\n    }\n\n    StreamLexer.prototype.formatError = function(token, message) {\n        // nb. this gets called after consuming the offending token,\n        // so the culprit is index-1\n        var buffer = this.buffer;\n        if (typeof buffer === 'string') {\n            var nextLineBreak = buffer.indexOf('\\n', this.index);\n            if (nextLineBreak === -1) nextLineBreak = buffer.length;\n            var line = buffer.substring(this.lastLineBreak, nextLineBreak)\n            var col = this.index - this.lastLineBreak;\n            message += \" at line \" + this.line + \" col \" + col + \":\\n\\n\";\n            message += \"  \" + line + \"\\n\"\n            message += \"  \" + Array(col).join(\" \") + \"^\"\n            return message;\n        } else {\n            return message + \" at index \" + (this.index - 1);\n        }\n    }\n\n\n    function Parser(rules, start, options) {\n        if (rules instanceof Grammar) {\n            var grammar = rules;\n            var options = start;\n        } else {\n            var grammar = Grammar.fromCompiled(rules, start);\n        }\n        this.grammar = grammar;\n\n        // Read options\n        this.options = {\n            keepHistory: false,\n            lexer: grammar.lexer || new StreamLexer,\n        };\n        for (var key in (options || {})) {\n            this.options[key] = options[key];\n        }\n\n        // Setup lexer\n        this.lexer = this.options.lexer;\n        this.lexerState = undefined;\n\n        // Setup a table\n        var column = new Column(grammar, 0);\n        var table = this.table = [column];\n\n        // I could be expecting anything.\n        column.wants[grammar.start] = [];\n        column.predict(grammar.start);\n        // TODO what if start rule is nullable?\n        column.process();\n        this.current = 0; // token index\n    }\n\n    // create a reserved token for indicating a parse fail\n    Parser.fail = {};\n\n    Parser.prototype.feed = function(chunk) {\n        var lexer = this.lexer;\n        lexer.reset(chunk, this.lexerState);\n\n        var token;\n        while (token = lexer.next()) {\n            // We add new states to table[current+1]\n            var column = this.table[this.current];\n\n            // GC unused states\n            if (!this.options.keepHistory) {\n                delete this.table[this.current - 1];\n            }\n\n            var n = this.current + 1;\n            var nextColumn = new Column(this.grammar, n);\n            this.table.push(nextColumn);\n\n            // Advance all tokens that expect the symbol\n            var literal = token.text !== undefined ? token.text : token.value;\n            var value = lexer.constructor === StreamLexer ? token.value : token;\n            var scannable = column.scannable;\n            for (var w = scannable.length; w--; ) {\n                var state = scannable[w];\n                var expect = state.rule.symbols[state.dot];\n                // Try to consume the token\n                // either regex or literal\n                if (expect.test ? expect.test(value) :\n                    expect.type ? expect.type === token.type\n                                : expect.literal === literal) {\n                    // Add it\n                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});\n                    nextColumn.states.push(next);\n                }\n            }\n\n            // Next, for each of the rules, we either\n            // (a) complete it, and try to see if the reference row expected that\n            //     rule\n            // (b) predict the next nonterminal it expects by adding that\n            //     nonterminal's start state\n            // To prevent duplication, we also keep track of rules we have already\n            // added\n\n            nextColumn.process();\n\n            // If needed, throw an error:\n            if (nextColumn.states.length === 0) {\n                // No states at all! This is not good.\n                var message = this.lexer.formatError(token, \"invalid syntax\") + \"\\n\";\n                message += \"Unexpected \" + (token.type ? token.type + \" token: \" : \"\");\n                message += JSON.stringify(token.value !== undefined ? token.value : token) + \"\\n\";\n                var err = new Error(message);\n                err.offset = this.current;\n                err.token = token;\n                throw err;\n            }\n\n            // maybe save lexer state\n            if (this.options.keepHistory) {\n              column.lexerState = lexer.save()\n            }\n\n            this.current++;\n        }\n        if (column) {\n          this.lexerState = lexer.save()\n        }\n\n        // Incrementally keep track of results\n        this.results = this.finish();\n\n        // Allow chaining, for whatever it's worth\n        return this;\n    };\n\n    Parser.prototype.save = function() {\n        var column = this.table[this.current];\n        column.lexerState = this.lexerState;\n        return column;\n    };\n\n    Parser.prototype.restore = function(column) {\n        var index = column.index;\n        this.current = index;\n        this.table[index] = column;\n        this.table.splice(index + 1);\n        this.lexerState = column.lexerState;\n\n        // Incrementally keep track of results\n        this.results = this.finish();\n    };\n\n    // nb. deprecated: use save/restore instead!\n    Parser.prototype.rewind = function(index) {\n        if (!this.options.keepHistory) {\n            throw new Error('set option `keepHistory` to enable rewinding')\n        }\n        // nb. recall column (table) indicies fall between token indicies.\n        //        col 0   --   token 0   --   col 1\n        this.restore(this.table[index]);\n    };\n\n    Parser.prototype.finish = function() {\n        // Return the possible parsings\n        var considerations = [];\n        var start = this.grammar.start;\n        var column = this.table[this.table.length - 1]\n        column.states.forEach(function (t) {\n            if (t.rule.name === start\n                    && t.dot === t.rule.symbols.length\n                    && t.reference === 0\n                    && t.data !== Parser.fail) {\n                considerations.push(t);\n            }\n        });\n        return considerations.map(function(c) {return c.data; });\n    };\n\n    return {\n        Parser: Parser,\n        Grammar: Grammar,\n        Rule: Rule,\n    };\n\n}));\n\n\n//# sourceURL=webpack:///./node_modules/nearley/lib/nearley.js?");

/***/ }),

/***/ "./src/copy.ts":
/*!*********************!*\
  !*** ./src/copy.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction stripCopy(text) {\r\n    return text.split('\\n').slice(0, -2).join('\\n');\r\n}\r\nexports.stripCopy = stripCopy;\r\n\n\n//# sourceURL=webpack:///./src/copy.ts?");

/***/ }),

/***/ "./src/dfa_to_graph.ts":
/*!*****************************!*\
  !*** ./src/dfa_to_graph.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// This is reversed from the parse result used in the simulator.\r\n// Map<State, Map<State, Set<Inputs>>>\r\nfunction parseMachine(lines) {\r\n    const result = new Map();\r\n    for (const line of lines) {\r\n        const [from, input, to] = line.split(',');\r\n        const transitions = result.get(from) || new Map();\r\n        const targets = transitions.get(to) || new Set();\r\n        targets.add(input);\r\n        transitions.set(to, targets);\r\n        result.set(from, transitions);\r\n    }\r\n    return result;\r\n}\r\nfunction dfaToGraph(text) {\r\n    const [first, ...rest] = text.split('\\n');\r\n    const out = ['digraph G {', '\\trankdir=LR', '\\tstart[shape=point style=invis]', ''];\r\n    const out2 = [`\\tstart -> q_0`];\r\n    const accept = first.replace(/^\\{|\\}$/g, '').split(',');\r\n    const seen = new Set();\r\n    const machine = parseMachine(rest.filter(Boolean));\r\n    for (const [from, transitions] of machine) {\r\n        if (!seen.has(from)) {\r\n            seen.add(from);\r\n            const shape = accept.includes(from) ? 'doublecircle' : 'circle';\r\n            const label = `q<SUB>${from.replace(/`/g, 'eps')}</SUB>`;\r\n            out.push(`\\tq_${from.replace(/`/g, 'eps')}[shape=${shape} label=<${label}>]`);\r\n        }\r\n        for (const [target, inputs] of transitions) {\r\n            out2.push(`\\tq_${from.replace(/`/g, 'eps')} -> q_${target.replace(/`/g, 'eps')} [label=<${[...inputs].join(',').replace(/`/g, '&epsilon;')}>]`);\r\n            if (!seen.has(target)) {\r\n                seen.add(target);\r\n                const shape = accept.includes(target) ? 'doublecircle' : 'circle';\r\n                const label = `q<SUB>${target.replace(/`/g, 'eps')}</SUB>`;\r\n                out.push(`\\tq_${target.replace(/`/g, 'eps')}[shape=${shape} label=<${label}>]`);\r\n            }\r\n        }\r\n    }\r\n    return out.concat(out2, '}').join('\\n');\r\n}\r\nexports.dfaToGraph = dfaToGraph;\r\n\n\n//# sourceURL=webpack:///./src/dfa_to_graph.ts?");

/***/ }),

/***/ "./src/generate_sis.ts":
/*!*****************************!*\
  !*** ./src/generate_sis.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction last(arr) {\r\n    return arr[arr.length - 1];\r\n}\r\nfunction purge(arr) {\r\n    let maxProfit = -Infinity;\r\n    return arr.sort((a, b) => a[1] - b[1] ? a[1] - b[1] : a[0] - b[0])\r\n        .filter(([p, w]) => {\r\n        if (p > maxProfit) {\r\n            maxProfit = p;\r\n            return true;\r\n        }\r\n        return false;\r\n    });\r\n}\r\nfunction generateSi(text) {\r\n    const [wText, pText] = text.replace(/[^\\d \\n]/g, '').split('\\n');\r\n    if (!wText || !pText)\r\n        return 'Invalid input';\r\n    const w = wText.split(/\\s+/).map(Number);\r\n    const p = pText.split(/\\s+/).map(Number);\r\n    if (w.length !== p.length)\r\n        return 'Lists must be the same length';\r\n    const pw = p.map((p, i) => [p, w[i]]);\r\n    const result = [[[0, 0]]];\r\n    for (let i = 0; i < pw.length; i++) {\r\n        const item = pw[i];\r\n        // Generate S^i_1\r\n        const simin1 = last(result);\r\n        const si1 = simin1.map(([w, p]) => [w + item[0], p + item[1]])\r\n            .sort((a, b) => a[1] - b[1]);\r\n        result.push(si1);\r\n        // Generate S^{i+1}\r\n        result.push(purge(simin1.concat(si1)));\r\n    }\r\n    return '\\\\begin{align*}\\n' + result.map((row, i) => {\r\n        return `S^{${Math.floor(i / 2)}}${i % 2 ? '_1' : ''} &= \\\\{ ${row.map(r => `(${r[0]}, ${r[1]})`).join(', ')} \\\\}`;\r\n    }).join('\\\\\\\\\\n') + '\\n\\\\end{align*}';\r\n}\r\nexports.generateSi = generateSi;\r\n\n\n//# sourceURL=webpack:///./src/generate_sis.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst tools_1 = __webpack_require__(/*! ./tools */ \"./src/tools.ts\");\r\nconst select = document.querySelector('select');\r\nconst input = document.querySelector('textarea');\r\nconst output = document.querySelector('.right');\r\nconst copyBox = document.querySelector('input[type=checkbox]');\r\nconst copyButton = document.querySelector('button');\r\nlet transform = tools_1.tools[0].transform;\r\nfor (const tool of tools_1.tools) {\r\n    const option = select.appendChild(document.createElement('option'));\r\n    option.textContent = tool.name;\r\n    option.value = tool.name;\r\n}\r\nnavigator.clipboard.readText().then(text => input.value = text).catch(console.error);\r\nselect.value = tools_1.tools[0].name;\r\nselectTool(tools_1.tools[0]);\r\nselect.addEventListener('change', () => {\r\n    selectTool(tools_1.tools.find(t => t.name === select.value));\r\n});\r\ninput.addEventListener('input', runTransform);\r\nfunction selectTool(tool) {\r\n    input.placeholder = tool.placeholder;\r\n    transform = tool.transform;\r\n    runTransform();\r\n}\r\nfunction runTransform() {\r\n    try {\r\n        output.textContent = transform(input.value);\r\n        if (copyBox.checked) {\r\n            navigator.clipboard.writeText(output.textContent).catch(console.error);\r\n        }\r\n    }\r\n    catch (err) {\r\n        output.textContent = err.message;\r\n    }\r\n}\r\ncopyButton.addEventListener('click', () => {\r\n    navigator.clipboard.writeText(output.textContent || '').catch(console.error);\r\n});\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/pda_to_graph.ts":
/*!*****************************!*\
  !*** ./src/pda_to_graph.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// This is reversed from the parse result used in the simulator.\r\n// Map<State, Map<State, Set<Inputs>>>\r\nfunction parseMachine(lines) {\r\n    const result = new Map();\r\n    for (const line of lines) {\r\n        let [_, from, input, pop, to, push] = line.match(/^\\((\\d+),(.),(.)\\)->\\((\\d+),(.)\\)$/);\r\n        const transitions = result.get(from) || new Map();\r\n        const targets = transitions.get(to) || new Set();\r\n        if (input === '`')\r\n            input = 'ε';\r\n        if (pop === '`')\r\n            pop = 'ε';\r\n        if (push === '`')\r\n            push = 'ε';\r\n        targets.add(`${input}, ${pop} → ${push}`);\r\n        transitions.set(to, targets);\r\n        result.set(from, transitions);\r\n    }\r\n    return result;\r\n}\r\nfunction toHtmlEntities(str) {\r\n    return str.replace(/./g, function (s) {\r\n        return '&#' + s.charCodeAt(0) + ';';\r\n    });\r\n}\r\nfunction pdaToGraph(text) {\r\n    const [first, ...rest] = text.split('\\n');\r\n    const out = ['digraph G {', '\\trankdir=LR', '\\tstart[shape=point style=invis]', ''];\r\n    const out2 = [`\\tstart -> q_0`];\r\n    const accept = first.replace(/^\\{|\\}$/g, '').split(',');\r\n    const seen = new Set();\r\n    const machine = parseMachine(rest.filter(Boolean));\r\n    for (const [from, transitions] of machine) {\r\n        if (!seen.has(from)) {\r\n            seen.add(from);\r\n            const shape = accept.includes(from) ? 'doublecircle' : 'circle';\r\n            const label = `q<SUB>${from.replace(/ε/g, 'eps')}</SUB>`;\r\n            out.push(`\\tq_${from.replace(/ε/g, 'eps')}[shape=${shape} label=<${label}>]`);\r\n        }\r\n        for (const [target, inputs] of transitions) {\r\n            out2.push(`\\tq_${from.replace(/ε/g, 'eps')} -> q_${target.replace(/ε/g, 'eps')} [label=<${[...inputs].map(toHtmlEntities).join('<BR/>')}>]`);\r\n            if (!seen.has(target)) {\r\n                seen.add(target);\r\n                const shape = accept.includes(target) ? 'doublecircle' : 'circle';\r\n                const label = `q<SUB>${target.replace(/ε/g, 'eps')}</SUB>`;\r\n                out.push(`\\tq_${target.replace(/ε/g, 'eps')}[shape=${shape} label=<${label}>]`);\r\n            }\r\n        }\r\n    }\r\n    return out.concat(out2, '}').join('\\n');\r\n}\r\nexports.pdaToGraph = pdaToGraph;\r\n\n\n//# sourceURL=webpack:///./src/pda_to_graph.ts?");

/***/ }),

/***/ "./src/powerset/grammar.ts":
/*!*********************************!*\
  !*** ./src/powerset/grammar.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// Generated automatically by nearley, version 2.16.0\r\n// http://github.com/Hardmath123/nearley\r\n// Bypasses TS6133. Allow declared but unused functions.\r\n// @ts-ignore\r\nfunction id(d) { return d[0]; }\r\n;\r\n;\r\n;\r\nexports.Lexer = undefined;\r\nexports.ParserRules = [\r\n    { \"name\": \"main\", \"symbols\": [\"set\", \"_\"], \"postprocess\": id },\r\n    { \"name\": \"set$ebnf$1\", \"symbols\": [\"elements\"], \"postprocess\": id },\r\n    { \"name\": \"set$ebnf$1\", \"symbols\": [], \"postprocess\": () => null },\r\n    { \"name\": \"set\", \"symbols\": [\"_\", { \"literal\": \"{\" }, \"set$ebnf$1\", \"_\", { \"literal\": \"}\" }], \"postprocess\": d => ({ type: 'set', elements: d[2] || [] }) },\r\n    { \"name\": \"elements\", \"symbols\": [\"element\"], \"postprocess\": d => [d[0]] },\r\n    { \"name\": \"elements\", \"symbols\": [\"elements\", \"_\", { \"literal\": \",\" }, \"element\"], \"postprocess\": d => d[0].concat(d[3]) },\r\n    { \"name\": \"element\", \"symbols\": [\"tuple\"], \"postprocess\": d => d[0] },\r\n    { \"name\": \"element\", \"symbols\": [\"single_item\"], \"postprocess\": d => d[0] },\r\n    { \"name\": \"element\", \"symbols\": [\"set\"], \"postprocess\": d => d[0] },\r\n    { \"name\": \"tuple$ebnf$1\", \"symbols\": [\"elements\"], \"postprocess\": id },\r\n    { \"name\": \"tuple$ebnf$1\", \"symbols\": [], \"postprocess\": () => null },\r\n    { \"name\": \"tuple\", \"symbols\": [\"_\", { \"literal\": \"(\" }, \"tuple$ebnf$1\", \"_\", { \"literal\": \")\" }], \"postprocess\": d => ({ type: 'tuple', elements: d[2] || [] }) },\r\n    { \"name\": \"single_item$ebnf$1\", \"symbols\": [/[\\w]/] },\r\n    { \"name\": \"single_item$ebnf$1\", \"symbols\": [\"single_item$ebnf$1\", /[\\w]/], \"postprocess\": (d) => d[0].concat([d[1]]) },\r\n    { \"name\": \"single_item\", \"symbols\": [\"_\", \"single_item$ebnf$1\"], \"postprocess\": d => d[1].join('') },\r\n    { \"name\": \"_$ebnf$1\", \"symbols\": [] },\r\n    { \"name\": \"_$ebnf$1\", \"symbols\": [\"_$ebnf$1\", /[\\s]/], \"postprocess\": (d) => d[0].concat([d[1]]) },\r\n    { \"name\": \"_\", \"symbols\": [\"_$ebnf$1\"], \"postprocess\": () => null }\r\n];\r\nexports.ParserStart = \"main\";\r\n\n\n//# sourceURL=webpack:///./src/powerset/grammar.ts?");

/***/ }),

/***/ "./src/powerset/powerset.ts":
/*!**********************************!*\
  !*** ./src/powerset/powerset.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst nearley_1 = __webpack_require__(/*! nearley */ \"./node_modules/nearley/lib/nearley.js\");\r\nconst grammar = __webpack_require__(/*! ./grammar */ \"./src/powerset/grammar.ts\");\r\nfunction buildPowerSet(text) {\r\n    return text.split('\\n').map(line => {\r\n        const set = parseText(line);\r\n        const elements = ['\\\\emptyset'];\r\n        const otherElements = [];\r\n        for (let i = 1; i <= 2 ** set.elements.length - 1; i++) {\r\n            console.log(i, set.elements, takeElements(i, set.elements));\r\n            otherElements.push(`\\\\{ ${takeElements(i, set.elements)} \\\\}`);\r\n        } // jkim021892@gmail\r\n        elements.push(...otherElements.sort((a, b) => a.length - b.length));\r\n        return `\\\\{ ${elements.join(', ')} \\\\}`;\r\n    }).join('\\n\\n');\r\n}\r\nexports.buildPowerSet = buildPowerSet;\r\nfunction takeElements(bitmap, elements) {\r\n    return elements.filter((_, i) => bitmap & (1 << i)).map(parsedToString).join(', ');\r\n}\r\nexports.takeElements = takeElements;\r\nfunction parsedToString(el) {\r\n    if (typeof el === 'string')\r\n        return el;\r\n    return el.type === 'set'\r\n        ? `\\\\{ ${el.elements.map(parsedToString)} \\\\}`\r\n        : `( ${el.elements.map(parsedToString)} )`;\r\n}\r\nexports.parsedToString = parsedToString;\r\nfunction parseText(text) {\r\n    const parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(grammar));\r\n    parser.feed(text);\r\n    const results = parser.results;\r\n    if (results.length === 0) {\r\n        return { type: 'set', elements: [] };\r\n    }\r\n    if (results.length !== 1) {\r\n        throw new Error('Ambiguous grammar');\r\n    }\r\n    return results[0];\r\n}\r\nexports.parseText = parseText;\r\n\n\n//# sourceURL=webpack:///./src/powerset/powerset.ts?");

/***/ }),

/***/ "./src/problems/grammar.ts":
/*!*********************************!*\
  !*** ./src/problems/grammar.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// Generated automatically by nearley, version 2.16.0\r\n// http://github.com/Hardmath123/nearley\r\n// Bypasses TS6133. Allow declared but unused functions.\r\n// @ts-ignore\r\nfunction id(d) { return d[0]; }\r\n;\r\n;\r\n;\r\nexports.Lexer = undefined;\r\nexports.ParserRules = [\r\n    { \"name\": \"main\", \"symbols\": [\"_\", \"problems\"], \"postprocess\": d => d[1] },\r\n    { \"name\": \"problems\", \"symbols\": [\"problem\"] },\r\n    { \"name\": \"problems\", \"symbols\": [\"problem_range\"] },\r\n    { \"name\": \"problems$subexpression$1\", \"symbols\": [\"problem\"] },\r\n    { \"name\": \"problems$subexpression$1\", \"symbols\": [\"problem_range\"] },\r\n    { \"name\": \"problems\", \"symbols\": [\"problems\", { \"literal\": \",\" }, \"_\", \"problems$subexpression$1\"], \"postprocess\": d => d[0].concat(d[3]) },\r\n    { \"name\": \"problem$ebnf$1\", \"symbols\": [\"parts\"], \"postprocess\": id },\r\n    { \"name\": \"problem$ebnf$1\", \"symbols\": [], \"postprocess\": () => null },\r\n    { \"name\": \"problem\", \"symbols\": [\"number\", \"_\", \"problem$ebnf$1\"], \"postprocess\": ([value, _, parts]) => ({ value, parts: parts || [] }) },\r\n    { \"name\": \"problem_range\", \"symbols\": [\"number\", \"_\", { \"literal\": \"-\" }, \"_\", \"number\"], \"postprocess\": d => ({ range: [d[0], d[4]] }) },\r\n    { \"name\": \"parts\", \"symbols\": [\"part\"], \"postprocess\": id },\r\n    { \"name\": \"parts\", \"symbols\": [\"parts\", \"_\", { \"literal\": \",\" }, \"_\", \"part\"], \"postprocess\": d => d[0].concat(d[4]) },\r\n    { \"name\": \"part$ebnf$1\", \"symbols\": [/[a-z]/] },\r\n    { \"name\": \"part$ebnf$1\", \"symbols\": [\"part$ebnf$1\", /[a-z]/], \"postprocess\": (d) => d[0].concat([d[1]]) },\r\n    { \"name\": \"part\", \"symbols\": [\"part$ebnf$1\"], \"postprocess\": id },\r\n    { \"name\": \"number$ebnf$1\", \"symbols\": [/[0-9]/] },\r\n    { \"name\": \"number$ebnf$1\", \"symbols\": [\"number$ebnf$1\", /[0-9]/], \"postprocess\": (d) => d[0].concat([d[1]]) },\r\n    { \"name\": \"number\", \"symbols\": [\"number$ebnf$1\"], \"postprocess\": d => +d[0].join('') },\r\n    { \"name\": \"_$ebnf$1\", \"symbols\": [] },\r\n    { \"name\": \"_$ebnf$1\", \"symbols\": [\"_$ebnf$1\", /[\\s]/], \"postprocess\": (d) => d[0].concat([d[1]]) },\r\n    { \"name\": \"_\", \"symbols\": [\"_$ebnf$1\"], \"postprocess\": () => null }\r\n];\r\nexports.ParserStart = \"main\";\r\n\n\n//# sourceURL=webpack:///./src/problems/grammar.ts?");

/***/ }),

/***/ "./src/problems/problems.ts":
/*!**********************************!*\
  !*** ./src/problems/problems.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst nearley_1 = __webpack_require__(/*! nearley */ \"./node_modules/nearley/lib/nearley.js\");\r\nconst grammar = __webpack_require__(/*! ./grammar */ \"./src/problems/grammar.ts\");\r\nconst template = `\n\\\\documentclass[12pt]{article}\n\\\\pagestyle{empty}\n\\\\usepackage[left=2cm,right=2cm,top=1cm,bottom=2cm,nohead,nofoot]{geometry}\n\\\\usepackage{amsmath,amssymb,amsthm,arydshln}\n% List spacing\n\\\\usepackage[shortlabels]{enumitem}\n\\\\setlist[enumerate]{topsep=0pt}\n\n\\\\usepackage{setspace}\n\\\\onehalfspacing\n\n\\\\newcommand{\\\\sect}[1] {\\\\vspace{1em}\\\\underline{Section #1}}\n\n\\\\newcommand{\\\\problem}[1] {\\\\vspace{1em}#1.}\n\n\\\\newcommand{\\\\norm}[1]{||\\\\vec{#1}||}\n\\\\newcommand{\\\\adj}[0] {\\\\text{adj}}\n\\\\newcommand{\\\\proj}[0]{\\\\text{proj}}\n\\\\newcommand{\\\\R}{\\\\mathbb{R}}\n\n\\\\renewcommand{\\\\labelenumi}{\\\\alph{enumi}.}\n\n\n\\\\newif\\\\ifsuggested\n%\\\\suggestedtrue % Comment out to remove suggested\n% https://tex.stackexchange.com/a/15510\n\\\\usepackage{comment}\n\\\\ifsuggested\n    \\\\newenvironment{suggested}{}{}\n\\\\else\n    \\\\excludecomment{suggested}\n\\\\fi\n% End suggested section\n\n\\\\begin{document}\n\n\\\\begin{flushright}\n\\\\singlespacing\nGerrit Birkeland\\\\\\\\\n%YEAR%/%MONTH%/%DAY%\n\\\\end{flushright}\n\n\\\\begin{flushleft}\n\n\\\\sect{XXX}\n\n%PROBLEMS%\n\n\\\\end{flushleft}\n\\\\end{document}\n`.trim();\r\nfunction buildPage(text) {\r\n    const handInDate = nextTuesday(new Date());\r\n    const map = {\r\n        problems: buildProblems(text),\r\n        year: handInDate.getFullYear(),\r\n        month: (handInDate.getMonth() + 1).toString().padStart(2, '0'),\r\n        day: handInDate.getDate().toString().padStart(2, '0')\r\n    };\r\n    return template.replace(/%(\\w+)%/g, (_, key) => {\r\n        return (map[key.toLowerCase()] || '') + '';\r\n    });\r\n}\r\nexports.buildPage = buildPage;\r\nfunction nextTuesday(d) {\r\n    if (d.getDay() === 2) {\r\n        d.setDate(d.getDate() + 7);\r\n    }\r\n    while (d.getDay() !== 2) {\r\n        d.setDate(d.getDate() + 1);\r\n    }\r\n    return d;\r\n}\r\nfunction buildProblems(text) {\r\n    const lines = text.split('\\n');\r\n    const suggestedLine = lines.find(line => line.startsWith('Suggested:'));\r\n    const suggestedProblemText = suggestedLine ? suggestedLine.substr(10) : '';\r\n    const problemLine = lines.find(line => line.startsWith('Hand in:'));\r\n    const problemText = problemLine ? problemLine.substr(8) : lines[0];\r\n    let inSuggested = false;\r\n    const suggestedProblems = buildList(suggestedProblemText);\r\n    const requiredProblems = buildList(problemText);\r\n    const result = [];\r\n    const startSuggested = () => !inSuggested && result.push('\\\\begin{suggested}') && (inSuggested = true);\r\n    const endSuggested = () => inSuggested && result.push('\\\\end{suggested}', '') && (inSuggested = false);\r\n    let suggestedIndex = 0;\r\n    let requiredIndex = 0;\r\n    while (suggestedIndex < suggestedProblems.length || requiredIndex < requiredProblems.length) {\r\n        const suggested = suggestedProblems[suggestedIndex];\r\n        const required = requiredProblems[requiredIndex];\r\n        if (!suggested) {\r\n            endSuggested();\r\n            result.push(...buildProblem(required), '');\r\n            requiredIndex++;\r\n            continue;\r\n        }\r\n        if (!required) {\r\n            startSuggested();\r\n            result.push(...buildProblem(suggested));\r\n            suggestedIndex++;\r\n            continue;\r\n        }\r\n        if (suggested.value < required.value) {\r\n            startSuggested();\r\n            result.push(...buildProblem(suggested));\r\n            suggestedIndex++;\r\n            continue;\r\n        }\r\n        if (required.value < suggested.value) {\r\n            endSuggested();\r\n            result.push(...buildProblem(required), '');\r\n            requiredIndex++;\r\n            continue;\r\n        }\r\n        // Some parts of the problem may be required, and others not required.\r\n        endSuggested();\r\n        result.push(...buildMergedProblem(required, suggested));\r\n        requiredIndex++;\r\n        suggestedIndex++;\r\n    }\r\n    endSuggested();\r\n    return result.join('\\n');\r\n}\r\nexports.buildProblems = buildProblems;\r\nconst alphabet = 'abcdefghijklmnopqrstuvwxyz';\r\nfunction buildProblem(problem) {\r\n    const result = [];\r\n    if (problem.parts.length === 1) {\r\n        result.push(`\\\\problem{${problem.value}${problem.parts[0]}}`);\r\n    }\r\n    else {\r\n        result.push(`\\\\problem{${problem.value}}`);\r\n        if (problem.parts.length) {\r\n            result.push(`\\\\begin{enumerate}`);\r\n            let index = 0;\r\n            for (const part of problem.parts) {\r\n                const partIndex = alphabet.indexOf(part);\r\n                if (partIndex !== index) {\r\n                    result.push(`\\\\setcounter{enumi}{${partIndex}}`);\r\n                    index = partIndex + 1;\r\n                }\r\n                else {\r\n                    index++;\r\n                }\r\n                result.push('\\\\item');\r\n            }\r\n            result.push(`\\\\end{enumerate}`);\r\n        }\r\n    }\r\n    return result;\r\n}\r\nfunction buildMergedProblem(required, suggested) {\r\n    if (required.parts.length === 0) {\r\n        return [...buildProblem(required), ''];\r\n    }\r\n    const suggestedParts = suggested.parts.length ?\r\n        suggested.parts.filter(p => !required.parts.includes(p)) :\r\n        getPartsExcept(required.parts);\r\n    const result = [\r\n        '\\\\begin{suggested}',\r\n        ...buildProblem({ ...suggested, parts: suggestedParts }),\r\n        '\\\\end{suggested}',\r\n        '',\r\n        ...buildProblem(required),\r\n        ''\r\n    ];\r\n    return result;\r\n}\r\nfunction getPartsExcept(parts) {\r\n    let index = 0;\r\n    const result = [];\r\n    for (const part of parts) {\r\n        while (alphabet.indexOf(part) > index) {\r\n            result.push(alphabet[index++]);\r\n        }\r\n        index++;\r\n    }\r\n    return result;\r\n}\r\nexports.getPartsExcept = getPartsExcept;\r\nfunction buildList(text) {\r\n    const parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(grammar));\r\n    parser.feed(text);\r\n    const results = parser.results;\r\n    // Empty input\r\n    if (results.length === 0) {\r\n        return [];\r\n    }\r\n    if (results.length !== 1) {\r\n        throw new Error('Ambiguous grammar');\r\n    }\r\n    return results[0].flatMap(item => {\r\n        if ('value' in item)\r\n            return item;\r\n        const [min, max] = item.range;\r\n        if (min > max)\r\n            throw new Error(`Invalid range ${min}-${max} has no elements.`);\r\n        return Array.from({ length: max - min + 1 })\r\n            .map((_, i) => ({ value: min + i, parts: [] }));\r\n    });\r\n}\r\nexports.buildList = buildList;\r\n\n\n//# sourceURL=webpack:///./src/problems/problems.ts?");

/***/ }),

/***/ "./src/table.ts":
/*!**********************!*\
  !*** ./src/table.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction toLatexSymbols(s) {\r\n    return '$' + s.replace(/~|&|\\||\\\\c|\\\\t|<>|>/g, v => {\r\n        return {\r\n            '~': '\\\\sim ',\r\n            '&': '\\\\wedge ',\r\n            '|': '\\\\vee ',\r\n            '\\\\c': '\\\\textbf{c}',\r\n            '\\\\t': '\\\\textbf{t}',\r\n            '>': '\\\\rightarrow ',\r\n            '<>': '\\\\leftrightarrow '\r\n        }[v];\r\n    }) + '$';\r\n}\r\nfunction buildTable(text) {\r\n    const lines = text.split('\\n').map(s => s.trim());\r\n    const columns = lines.reduce((max, line) => Math.max(max, line.split(/\\s+/).length), 0);\r\n    const result = [\r\n        `\\\\begin{tabular}{|${'c|'.repeat(columns)}}`,\r\n        '\\\\hline'\r\n    ];\r\n    for (let i = 0; i < lines.length; i++) {\r\n        if (/^-+$/.test(lines[i].trim())) {\r\n            result.push('\\\\hline');\r\n            continue;\r\n        }\r\n        const entries = lines[i].split(/\\s+/);\r\n        if (i === 0) {\r\n            result.push(entries.map(toLatexSymbols).join(' & ') + '\\\\\\\\');\r\n            result.push('\\\\hline');\r\n            continue;\r\n        }\r\n        result.push(entries.join(' & ') + '\\\\\\\\');\r\n    }\r\n    result.push('\\\\hline', '\\\\end{tabular}');\r\n    return result.join('\\n');\r\n}\r\nexports.buildTable = buildTable;\r\nfunction buildMathTable(text) {\r\n    const lines = text.split('\\n').map(s => s.trim());\r\n    const columns = lines.reduce((max, line) => Math.max(max, line.split(/\\s+/).length), 0);\r\n    const result = [\r\n        `\\\\begin{tabular}{|${'c|'.repeat(columns)}}`,\r\n        '\\\\hline'\r\n    ];\r\n    for (let i = 0; i < lines.length; i++) {\r\n        if (/^-+$/.test(lines[i].trim())) {\r\n            result.push('\\\\hline');\r\n            continue;\r\n        }\r\n        const entries = lines[i].split(/\\s+/);\r\n        if (i === 0) {\r\n            result.push(entries.join(' & ') + '\\\\\\\\');\r\n            result.push('\\\\hline');\r\n            continue;\r\n        }\r\n        result.push(entries.map(toLatexSymbols).join(' & ') + '\\\\\\\\');\r\n    }\r\n    result.push('\\\\hline', '\\\\end{tabular}');\r\n    return result.join('\\n');\r\n}\r\nexports.buildMathTable = buildMathTable;\r\n\n\n//# sourceURL=webpack:///./src/table.ts?");

/***/ }),

/***/ "./src/tools.ts":
/*!**********************!*\
  !*** ./src/tools.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst problems_1 = __webpack_require__(/*! ./problems/problems */ \"./src/problems/problems.ts\");\r\nconst truefalse_1 = __webpack_require__(/*! ./truefalse */ \"./src/truefalse.ts\");\r\nconst table_1 = __webpack_require__(/*! ./table */ \"./src/table.ts\");\r\nconst copy_1 = __webpack_require__(/*! ./copy */ \"./src/copy.ts\");\r\nconst generate_sis_1 = __webpack_require__(/*! ./generate_sis */ \"./src/generate_sis.ts\");\r\nconst powerset_1 = __webpack_require__(/*! ./powerset/powerset */ \"./src/powerset/powerset.ts\");\r\nconst dfa_to_graph_1 = __webpack_require__(/*! ./dfa_to_graph */ \"./src/dfa_to_graph.ts\");\r\nconst pda_to_graph_1 = __webpack_require__(/*! ./pda_to_graph */ \"./src/pda_to_graph.ts\");\r\nexports.tools = [\r\n    {\r\n        name: 'Discrete Problems',\r\n        transform: problems_1.buildPage,\r\n        placeholder: 'Suggested: 1, 2, 5-10\\nHand in: 2b, 6'\r\n    },\r\n    {\r\n        name: 'DFA to Graphviz Digraph',\r\n        transform: dfa_to_graph_1.dfaToGraph,\r\n        placeholder: '{2}\\n0,0,0\\n0,1,0\\n0,0,1\\n1,0,2'\r\n    },\r\n    {\r\n        name: 'PDA to Graphviz Digraph',\r\n        transform: pda_to_graph_1.pdaToGraph,\r\n        placeholder: '{4}\\n(0,`,`)->(1,$)\\n...'\r\n    },\r\n    {\r\n        name: 'Power Set',\r\n        transform: powerset_1.buildPowerSet,\r\n        placeholder: '{ 1, 2, 3 } or { (1, 2), 3 }'\r\n    },\r\n    {\r\n        name: 'True / False',\r\n        transform: truefalse_1.buildTrueFalse,\r\n        placeholder: '1'\r\n    },\r\n    {\r\n        name: 'Table',\r\n        transform: table_1.buildTable,\r\n        placeholder: 'a b ~a|b\\nT T T'\r\n    },\r\n    {\r\n        name: 'Math Table',\r\n        transform: table_1.buildMathTable,\r\n        placeholder: 'Cost(V_4,7) 7\\nCost(V_4,8) 3'\r\n    },\r\n    {\r\n        name: 'Build S^i arrays',\r\n        transform: generate_sis_1.generateSi,\r\n        placeholder: 'w_i\\np_i'\r\n    },\r\n    {\r\n        name: 'Strip Kindle Copy',\r\n        transform: copy_1.stripCopy,\r\n        placeholder: ''\r\n    }\r\n];\r\n\n\n//# sourceURL=webpack:///./src/tools.ts?");

/***/ }),

/***/ "./src/truefalse.ts":
/*!**************************!*\
  !*** ./src/truefalse.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nfunction buildTrueFalse(text) {\r\n    const num = +text;\r\n    if (Number.isNaN(num)) {\r\n        return 'Input is not numeric.';\r\n    }\r\n    if (num > 10) {\r\n        return 'Input is too large.';\r\n    }\r\n    const rows = Math.pow(2, num);\r\n    const result = [];\r\n    for (let i = 0; i < rows; i++) {\r\n        const row = [];\r\n        for (let s = num - 1; s >= 0; s--) {\r\n            row.push(i & (1 << s) ? 'F' : 'T');\r\n        }\r\n        result.push(row.join(' '));\r\n    }\r\n    return result.join('\\n');\r\n}\r\nexports.buildTrueFalse = buildTrueFalse;\r\n\n\n//# sourceURL=webpack:///./src/truefalse.ts?");

/***/ })

/******/ });