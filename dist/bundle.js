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
eval("\nexports.__esModule = true;\nfunction stripCopy(text) {\n    return text.split('\\n').slice(0, -2).join('\\n');\n}\nexports.stripCopy = stripCopy;\n\n\n//# sourceURL=webpack:///./src/copy.ts?");

/***/ }),

/***/ "./src/generate_sis.ts":
/*!*****************************!*\
  !*** ./src/generate_sis.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nexports.__esModule = true;\nfunction last(arr) {\n    return arr[arr.length - 1];\n}\nfunction purge(arr) {\n    var maxProfit = -Infinity;\n    return arr.sort(function (a, b) { return a[1] - b[1] ? a[1] - b[1] : a[0] - b[0]; })\n        .filter(function (_a) {\n        var p = _a[0], w = _a[1];\n        if (p > maxProfit) {\n            maxProfit = p;\n            return true;\n        }\n        return false;\n    });\n}\nfunction generateSi(text) {\n    var _a = text.replace(/[^\\d \\n]/g, '').split('\\n'), wText = _a[0], pText = _a[1];\n    if (!wText || !pText)\n        return 'Invalid input';\n    var w = wText.split(/\\s+/).map(Number);\n    var p = pText.split(/\\s+/).map(Number);\n    if (w.length !== p.length)\n        return 'Lists must be the same length';\n    var pw = p.map(function (p, i) { return [p, w[i]]; });\n    var result = [[[0, 0]]];\n    var _loop_1 = function (i) {\n        var item = pw[i];\n        // Generate S^i_1\n        var simin1 = last(result);\n        var si1 = simin1.map(function (_a) {\n            var w = _a[0], p = _a[1];\n            return [w + item[0], p + item[1]];\n        })\n            .sort(function (a, b) { return a[1] - b[1]; });\n        result.push(si1);\n        // Generate S^{i+1}\n        result.push(purge(simin1.concat(si1)));\n    };\n    for (var i = 0; i < pw.length; i++) {\n        _loop_1(i);\n    }\n    return '\\\\begin{align*}\\n' + result.map(function (row, i) {\n        return \"S^{\" + Math.floor(i / 2) + \"}\" + (i % 2 ? '_1' : '') + \" &= \\\\{ \" + row.map(function (r) { return \"(\" + r[0] + \", \" + r[1] + \")\"; }).join(', ') + \" \\\\}\";\n    }).join('\\\\\\\\\\n') + '\\n\\\\end{align*}';\n}\nexports.generateSi = generateSi;\n\n\n//# sourceURL=webpack:///./src/generate_sis.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nexports.__esModule = true;\nvar tools_1 = __webpack_require__(/*! ./tools */ \"./src/tools.ts\");\nvar select = document.querySelector('select');\nvar input = document.querySelector('textarea');\nvar output = document.querySelector('.right');\nvar copyBox = document.querySelector('input[type=checkbox]');\nvar copyButton = document.querySelector('button');\nvar transform = tools_1.tools[0].transform;\nfor (var _i = 0, tools_2 = tools_1.tools; _i < tools_2.length; _i++) {\n    var tool = tools_2[_i];\n    var option = select.appendChild(document.createElement('option'));\n    option.textContent = tool.name;\n    option.value = tool.name;\n}\nnavigator.clipboard.readText().then(function (text) { return input.value = text; })[\"catch\"](console.error);\nselect.value = tools_1.tools[0].name;\nselectTool(tools_1.tools[0]);\nselect.addEventListener('change', function () {\n    selectTool(tools_1.tools.find(function (t) { return t.name === select.value; }));\n});\ninput.addEventListener('input', runTransform);\nfunction selectTool(tool) {\n    input.placeholder = tool.placeholder;\n    transform = tool.transform;\n    runTransform();\n}\nfunction runTransform() {\n    try {\n        output.textContent = transform(input.value);\n        if (copyBox.checked) {\n            navigator.clipboard.writeText(output.textContent)[\"catch\"](console.error);\n        }\n    }\n    catch (err) {\n        output.textContent = err.message;\n    }\n}\ncopyButton.addEventListener('click', function () {\n    navigator.clipboard.writeText(output.textContent || '')[\"catch\"](console.error);\n});\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/problems/grammar.ts":
/*!*********************************!*\
  !*** ./src/problems/grammar.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nexports.__esModule = true;\n// Generated automatically by nearley, version 2.16.0\n// http://github.com/Hardmath123/nearley\n// Bypasses TS6133. Allow declared but unused functions.\n// @ts-ignore\nfunction id(d) { return d[0]; }\n;\n;\n;\nexports.Lexer = undefined;\nexports.ParserRules = [\n    { \"name\": \"main\", \"symbols\": [\"_\", \"problems\"], \"postprocess\": function (d) { return d[1]; } },\n    { \"name\": \"problems\", \"symbols\": [\"problem\"] },\n    { \"name\": \"problems\", \"symbols\": [\"problem_range\"] },\n    { \"name\": \"problems$subexpression$1\", \"symbols\": [\"problem\"] },\n    { \"name\": \"problems$subexpression$1\", \"symbols\": [\"problem_range\"] },\n    { \"name\": \"problems\", \"symbols\": [\"problems\", \"_\", { \"literal\": \",\" }, \"_\", \"problems$subexpression$1\"], \"postprocess\": function (d) { return d[0].concat(d[4]); } },\n    { \"name\": \"problem$ebnf$1\", \"symbols\": [\"parts\"], \"postprocess\": id },\n    { \"name\": \"problem$ebnf$1\", \"symbols\": [], \"postprocess\": function () { return null; } },\n    { \"name\": \"problem\", \"symbols\": [\"number\", \"_\", \"problem$ebnf$1\"], \"postprocess\": function (_a) {\n            var value = _a[0], _ = _a[1], parts = _a[2];\n            return ({ value: value, parts: parts || [] });\n        } },\n    { \"name\": \"problem_range\", \"symbols\": [\"number\", \"_\", { \"literal\": \"-\" }, \"_\", \"number\"], \"postprocess\": function (d) { return ({ range: [d[0], d[4]] }); } },\n    { \"name\": \"parts\", \"symbols\": [\"part\"], \"postprocess\": id },\n    { \"name\": \"parts\", \"symbols\": [\"parts\", \"_\", { \"literal\": \",\" }, \"_\", \"part\"], \"postprocess\": function (d) { return d[0].concat(d[4]); } },\n    { \"name\": \"part$ebnf$1\", \"symbols\": [/[a-z]/] },\n    { \"name\": \"part$ebnf$1\", \"symbols\": [\"part$ebnf$1\", /[a-z]/], \"postprocess\": function (d) { return d[0].concat([d[1]]); } },\n    { \"name\": \"part\", \"symbols\": [\"part$ebnf$1\"], \"postprocess\": id },\n    { \"name\": \"number$ebnf$1\", \"symbols\": [/[0-9]/] },\n    { \"name\": \"number$ebnf$1\", \"symbols\": [\"number$ebnf$1\", /[0-9]/], \"postprocess\": function (d) { return d[0].concat([d[1]]); } },\n    { \"name\": \"number\", \"symbols\": [\"number$ebnf$1\"], \"postprocess\": function (d) { return +d[0].join(''); } },\n    { \"name\": \"_$ebnf$1\", \"symbols\": [] },\n    { \"name\": \"_$ebnf$1\", \"symbols\": [\"_$ebnf$1\", /[\\s]/], \"postprocess\": function (d) { return d[0].concat([d[1]]); } },\n    { \"name\": \"_\", \"symbols\": [\"_$ebnf$1\"], \"postprocess\": function () { return null; } }\n];\nexports.ParserStart = \"main\";\n\n\n//# sourceURL=webpack:///./src/problems/grammar.ts?");

/***/ }),

/***/ "./src/problems/problems.ts":
/*!**********************************!*\
  !*** ./src/problems/problems.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nexports.__esModule = true;\nvar nearley_1 = __webpack_require__(/*! nearley */ \"./node_modules/nearley/lib/nearley.js\");\nvar grammar = __webpack_require__(/*! ./grammar */ \"./src/problems/grammar.ts\");\nvar template = \"\\n\\\\documentclass[12pt]{article}\\n\\\\pagestyle{empty}\\n\\\\usepackage[left=2cm,right=2cm,top=1cm,bottom=2cm,nohead,nofoot]{geometry}\\n\\\\usepackage{amsmath,amssymb,amsthm,arydshln}\\n% List spacing\\n\\\\usepackage[shortlabels]{enumitem}\\n\\\\setlist[enumerate]{topsep=0pt}\\n\\n\\\\usepackage{setspace}\\n\\\\onehalfspacing\\n\\n\\\\newcommand{\\\\sect}[1] {\\\\vspace{1em}\\\\underline{Section #1}}\\n\\n\\\\newcommand{\\\\problem}[1] {\\\\vspace{1em}#1.}\\n\\n\\\\newcommand{\\\\norm}[1]{||\\\\vec{#1}||}\\n\\\\newcommand{\\\\adj}[0] {\\\\text{adj}}\\n\\\\newcommand{\\\\proj}[0]{\\\\text{proj}}\\n\\\\newcommand{\\\\R}{\\\\mathbb{R}}\\n\\n\\\\renewcommand{\\\\labelenumi}{\\\\alph{enumi}.}\\n\\n\\n\\\\newif\\\\ifsuggested\\n%\\\\suggestedtrue % Comment out to remove suggested\\n% https://tex.stackexchange.com/a/15510\\n\\\\usepackage{comment}\\n\\\\ifsuggested\\n    \\\\newenvironment{suggested}{}{}\\n\\\\else\\n    \\\\excludecomment{suggested}\\n\\\\fi\\n% End suggested section\\n\\n\\\\begin{document}\\n\\n\\\\begin{flushright}\\n\\\\singlespacing\\nGerrit Birkeland\\\\\\\\\\n%YEAR%/%MONTH%/%DAY%\\n\\\\end{flushright}\\n\\n\\\\begin{flushleft}\\n\\n\\\\sect{XXX}\\n\\n%PROBLEMS%\\n\\n\\\\end{flushleft}\\n\\\\end{document}\\n\".trim();\nfunction buildPage(text) {\n    var handInDate = nextTuesday(new Date());\n    var map = {\n        problems: buildProblems(text),\n        year: handInDate.getFullYear(),\n        month: (handInDate.getMonth() + 1).toString().padStart(2, '0'),\n        day: handInDate.getDate().toString().padStart(2, '0')\n    };\n    return template.replace(/%(\\w+)%/g, function (_, key) {\n        return (map[key.toLowerCase()] || '') + '';\n    });\n}\nexports.buildPage = buildPage;\nfunction nextTuesday(d) {\n    if (d.getDay() === 2) {\n        d.setDate(d.getDate() + 7);\n    }\n    while (d.getDay() !== 2) {\n        d.setDate(d.getDate() + 1);\n    }\n    return d;\n}\nfunction buildProblems(text) {\n    var lines = text.split('\\n');\n    var suggestedLine = lines.find(function (line) { return line.startsWith('Suggested:'); });\n    var suggestedProblemText = suggestedLine ? suggestedLine.substr(10) : '';\n    var problemLine = lines.find(function (line) { return line.startsWith('Hand in:'); });\n    var problemText = problemLine ? problemLine.substr(8) : lines[0];\n    var inSuggested = false;\n    var suggestedProblems = buildList(suggestedProblemText);\n    var requiredProblems = buildList(problemText);\n    var result = [];\n    var startSuggested = function () { return !inSuggested && result.push('\\\\begin{suggested}') && (inSuggested = true); };\n    var endSuggested = function () { return inSuggested && result.push('\\\\end{suggested}', '') && (inSuggested = false); };\n    var suggestedIndex = 0;\n    var requiredIndex = 0;\n    while (suggestedIndex < suggestedProblems.length || requiredIndex < requiredProblems.length) {\n        var suggested = suggestedProblems[suggestedIndex];\n        var required = requiredProblems[requiredIndex];\n        if (!suggested) {\n            endSuggested();\n            result.push.apply(result, buildProblem(required).concat(['']));\n            requiredIndex++;\n            continue;\n        }\n        if (!required) {\n            startSuggested();\n            result.push.apply(result, buildProblem(suggested));\n            suggestedIndex++;\n            continue;\n        }\n        if (suggested.value < required.value) {\n            startSuggested();\n            result.push.apply(result, buildProblem(suggested));\n            suggestedIndex++;\n            continue;\n        }\n        if (required.value < suggested.value) {\n            endSuggested();\n            result.push.apply(result, buildProblem(required).concat(['']));\n            requiredIndex++;\n            continue;\n        }\n        // Some parts of the problem may be required, and others not required.\n        endSuggested();\n        result.push.apply(result, buildMergedProblem(required, suggested));\n        requiredIndex++;\n        suggestedIndex++;\n    }\n    endSuggested();\n    return result.join('\\n');\n}\nexports.buildProblems = buildProblems;\nvar alphabet = 'abcdefghijklmnopqrstuvwxyz';\nfunction buildProblem(problem) {\n    var result = [];\n    if (problem.parts.length === 1) {\n        result.push(\"\\\\problem{\" + problem.value + problem.parts[0] + \"}\");\n    }\n    else {\n        result.push(\"\\\\problem{\" + problem.value + \"}\");\n        if (problem.parts.length) {\n            result.push(\"\\\\begin{enumerate}\");\n            var index = 0;\n            for (var _i = 0, _a = problem.parts; _i < _a.length; _i++) {\n                var part = _a[_i];\n                var partIndex = alphabet.indexOf(part);\n                if (partIndex !== index) {\n                    result.push(\"\\\\setcounter{enumi}{\" + partIndex + \"}\");\n                    index = partIndex + 1;\n                }\n                else {\n                    index++;\n                }\n                result.push('\\\\item');\n            }\n            result.push(\"\\\\end{enumerate}\");\n        }\n    }\n    return result;\n}\nfunction buildMergedProblem(required, suggested) {\n    if (required.parts.length === 0) {\n        return buildProblem(required).concat(['']);\n    }\n    var suggestedParts = suggested.parts.length ?\n        suggested.parts.filter(function (p) { return !required.parts.includes(p); }) :\n        getPartsExcept(required.parts);\n    var result = [\n        '\\\\begin{suggested}'\n    ].concat(buildProblem(__assign({}, suggested, { parts: suggestedParts })), [\n        '\\\\end{suggested}',\n        ''\n    ], buildProblem(required), [\n        ''\n    ]);\n    return result;\n}\nfunction getPartsExcept(parts) {\n    var index = 0;\n    var result = [];\n    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {\n        var part = parts_1[_i];\n        while (alphabet.indexOf(part) > index) {\n            result.push(alphabet[index++]);\n        }\n        index++;\n    }\n    return result;\n}\nexports.getPartsExcept = getPartsExcept;\nfunction buildList(text) {\n    var parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(grammar));\n    parser.feed(text);\n    var results = parser.results;\n    // Empty input\n    if (results.length === 0) {\n        return [];\n    }\n    if (results.length !== 1) {\n        throw new Error('Ambiguous grammar');\n    }\n    return results[0].flatMap(function (item) {\n        if ('value' in item)\n            return item;\n        var _a = item.range, min = _a[0], max = _a[1];\n        if (min > max)\n            throw new Error(\"Invalid range \" + min + \"-\" + max + \" has no elements.\");\n        return Array.from({ length: max - min + 1 })\n            .map(function (_, i) { return ({ value: min + i, parts: [] }); });\n    });\n}\nexports.buildList = buildList;\n\n\n//# sourceURL=webpack:///./src/problems/problems.ts?");

/***/ }),

/***/ "./src/table.ts":
/*!**********************!*\
  !*** ./src/table.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nexports.__esModule = true;\nfunction toLatexSymbols(s) {\n    return '$' + s.replace(/~|&|\\||\\\\c|\\\\t|<>|>/g, function (v) {\n        return {\n            '~': '\\\\sim ',\n            '&': '\\\\wedge ',\n            '|': '\\\\vee ',\n            '\\\\c': '\\\\textbf{c}',\n            '\\\\t': '\\\\textbf{t}',\n            '>': '\\\\rightarrow ',\n            '<>': '\\\\leftrightarrow '\n        }[v];\n    }) + '$';\n}\nfunction buildTable(text) {\n    var lines = text.split('\\n').map(function (s) { return s.trim(); });\n    var columns = lines.reduce(function (max, line) {\n        return Math.max(max, line.split(/\\s+/).length);\n    }, 0);\n    var result = [\n        \"\\\\begin{tabular}{|\" + 'c|'.repeat(columns) + \"}\",\n        '\\\\hline'\n    ];\n    for (var i = 0; i < lines.length; i++) {\n        if (/^-+$/.test(lines[i].trim())) {\n            result.push('\\\\hline');\n            continue;\n        }\n        var entries = lines[i].split(/\\s+/);\n        if (i === 0) {\n            result.push(entries.map(toLatexSymbols).join(' & ') + '\\\\\\\\');\n            result.push('\\\\hline');\n            continue;\n        }\n        result.push(entries.join(' & ') + '\\\\\\\\');\n    }\n    result.push('\\\\hline', '\\\\end{tabular}');\n    return result.join('\\n');\n}\nexports.buildTable = buildTable;\nfunction buildMathTable(text) {\n    var lines = text.split('\\n').map(function (s) { return s.trim(); });\n    var columns = lines.reduce(function (max, line) {\n        return Math.max(max, line.split(/\\s+/).length);\n    }, 0);\n    var result = [\n        \"\\\\begin{tabular}{|\" + 'c|'.repeat(columns) + \"}\",\n        '\\\\hline'\n    ];\n    for (var i = 0; i < lines.length; i++) {\n        if (/^-+$/.test(lines[i].trim())) {\n            result.push('\\\\hline');\n            continue;\n        }\n        var entries = lines[i].split(/\\s+/);\n        if (i === 0) {\n            result.push(entries.join(' & ') + '\\\\\\\\');\n            result.push('\\\\hline');\n            continue;\n        }\n        result.push(entries.map(toLatexSymbols).join(' & ') + '\\\\\\\\');\n    }\n    result.push('\\\\hline', '\\\\end{tabular}');\n    return result.join('\\n');\n}\nexports.buildMathTable = buildMathTable;\n\n\n//# sourceURL=webpack:///./src/table.ts?");

/***/ }),

/***/ "./src/tools.ts":
/*!**********************!*\
  !*** ./src/tools.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nexports.__esModule = true;\nvar problems_1 = __webpack_require__(/*! ./problems/problems */ \"./src/problems/problems.ts\");\nvar truefalse_1 = __webpack_require__(/*! ./truefalse */ \"./src/truefalse.ts\");\nvar table_1 = __webpack_require__(/*! ./table */ \"./src/table.ts\");\nvar copy_1 = __webpack_require__(/*! ./copy */ \"./src/copy.ts\");\nvar generate_sis_1 = __webpack_require__(/*! ./generate_sis */ \"./src/generate_sis.ts\");\nexports.tools = [\n    {\n        name: 'Discrete Problems',\n        transform: problems_1.buildPage,\n        placeholder: 'Suggested: 1, 2, 5-10\\nHand in: 2b, 6'\n    },\n    {\n        name: 'True / False',\n        transform: truefalse_1.buildTrueFalse,\n        placeholder: '1'\n    },\n    {\n        name: 'Table',\n        transform: table_1.buildTable,\n        placeholder: 'a b ~a|b\\nT T T'\n    },\n    {\n        name: 'Math Table',\n        transform: table_1.buildMathTable,\n        placeholder: 'Cost(V_4,7) 7\\nCost(V_4,8) 3'\n    },\n    {\n        name: 'Build S^i arrays',\n        transform: generate_sis_1.generateSi,\n        placeholder: 'w_i\\np_i'\n    },\n    {\n        name: 'Strip Kindle Copy',\n        transform: copy_1.stripCopy,\n        placeholder: ''\n    }\n];\n\n\n//# sourceURL=webpack:///./src/tools.ts?");

/***/ }),

/***/ "./src/truefalse.ts":
/*!**************************!*\
  !*** ./src/truefalse.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nexports.__esModule = true;\nfunction buildTrueFalse(text) {\n    var num = +text;\n    if (Number.isNaN(num)) {\n        return 'Input is not numeric.';\n    }\n    if (num > 10) {\n        return 'Input is too large.';\n    }\n    var rows = Math.pow(2, num);\n    var result = [];\n    for (var i = 0; i < rows; i++) {\n        var row = [];\n        for (var s = num - 1; s >= 0; s--) {\n            row.push(i & (1 << s) ? 'F' : 'T');\n        }\n        result.push(row.join(' '));\n    }\n    return result.join('\\n');\n}\nexports.buildTrueFalse = buildTrueFalse;\n\n\n//# sourceURL=webpack:///./src/truefalse.ts?");

/***/ })

/******/ });