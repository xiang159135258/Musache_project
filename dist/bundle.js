/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Scanner.js":
/*!************************!*\
  !*** ./src/Scanner.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Scanner)
/* harmony export */ });
class Scanner {
    // 实例化一个扫描器，构造时提供一个参数，这个参数就是字符串
    // 也就是说这个扫描器就是针对这个字符串工作的
    constructor(templateStr) {
        this.templateStr = templateStr
        this.pos = 0 // 指针
        this.tail = templateStr // 还没走过的字符串，简称：尾巴
    }

    // 功能弱，只是用来跳过指定的内容，没有返回值
    scan(tag) {
        if (this.tail.indexOf(tag) === 0) {
            // 指定内容的长度是多少，就让指针后移多少
            this.pos += tag.length
            this.tail = this.templateStr.substring(this.pos)
        }
    }

    // 让指进行扫描，直到遇到寻找的内容结束，并且能够返回结束扫描之前走过的字符串
    scanUntil(stopTag) {
        // 记录执行此方法pos指针的起始值
        const pos_backup = this.pos

        // 扫描stopTag不在首位，而且指针没有到最后，那么继续扫描
        while (!this.eos() && this.tail.indexOf(stopTag) !== 0) {
            this.pos++
            // 指针从该字符开始，直到最后的全部字符
            this.tail = this.templateStr.substring(this.pos)
        }

        // 返回扫描到stopTag在首位，之前的走过字符串
        return this.templateStr.substring(pos_backup, this.pos)
    }

    // end of string 判断指针是否到头了
    eos() {
        return this.pos >= this.templateStr.length
    }
}

/***/ }),

/***/ "./src/lookup.js":
/*!***********************!*\
  !*** ./src/lookup.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ lookup)
/* harmony export */ });
/**
 * 根据传入的字符串寻找对象中的值
 * @param {object} data 
 * @param {string} keyName 
 */

function lookup(data, keyName) {
    if (!data) return data
    let temp = data

    // 字符串中传值 "." 且 本身不是 "."
    if (keyName.indexOf('.') != 0 && keyName !== '.') {
        const keys = keyName.split('.')
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index]
            // 有值才往下找
            if (temp[key]) {
                temp = temp[key]
            } else {
                throw new Error('寻找的值不存在')
            }
        }
    } else {
        temp = temp[keyName]
    }

    return temp
}


/***/ }),

/***/ "./src/nestedTokens.js":
/*!*****************************!*\
  !*** ./src/nestedTokens.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * 传入一维的tokens，实现按照层级结构进行折叠
 * @param {array} tokens 
 * @returns 
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(tokens) {
    // 最终结果
    let nestedTokens = []

    // 栈结构，存放小tokens。栈顶的tokens数组中当前操作的这个tokens的第三项小数组
    let sections = []

    /**
     * 收集器，默认指向nestedTkens结果数组
     * 当匹配到 # 的时候，改变收集器的指向，指向到当前token中新开辟的下一个维度的token
     * 当匹配到 / 的时候，改变收集器的指向，判断当前栈sections是否有值？有值，则指向当前的栈顶；没值，则指向最终结果 nestedTokens
     */
    let collector = nestedTokens

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index]
        switch (token[0]) {
            case '#':
                // 收集当前维度的 子项
                collector.push(token)
                // 入栈
                sections.push(token)
                // 给当前匹配到的 #开头的token数组，开辟下标为2的下一个维度的子项，并且值为[]
                token[2] = []
                // 修正当前的收集器指向 新开辟的子项
                collector = token[2]
                break
            case '/':
                //出栈
                sections.pop()

                collector = sections.length
                    ? sections[sections.length - 1][2]
                    : nestedTokens
                break
            default:
                // 无需关心当前是什么维度，没有匹配到 # 或者 、 字符串时，直接收集token即可
                collector.push(token)
        }
    }

    return nestedTokens
}

/***/ }),

/***/ "./src/parseTemplateTokens.js":
/*!************************************!*\
  !*** ./src/parseTemplateTokens.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseTemplateToTokens)
/* harmony export */ });
/* harmony import */ var _Scanner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Scanner */ "./src/Scanner.js");
/* harmony import */ var _nestedTokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nestedTokens */ "./src/nestedTokens.js");



/**
 * 将模板字符串转换为tokens
 * @param {string} templateStr 
 */
function parseTemplateToTokens(templateStr) {
    let tokens = []
    const scanner = new _Scanner__WEBPACK_IMPORTED_MODULE_0__["default"](templateStr)

    let words
    while (!scanner.eos()) {
        words = scanner.scanUntil('{{')
        if (words) {
            tokens.push(['text', words])
        }
        scanner.scan('{{')

        words = scanner.scanUntil('}}')
        if (words) {
            if (words[0] === '#') {
                tokens.push(['#', words.substring(1)])
            } else if (words[0] === '/') {
                tokens.push(['/', words.substring(1)])
            } else {
                tokens.push(['name', words])
            }
        }
        scanner.scan('}}')
    }

    return (0,_nestedTokens__WEBPACK_IMPORTED_MODULE_1__["default"])(tokens)
}

/***/ }),

/***/ "./src/parseTokens.js":
/*!****************************!*\
  !*** ./src/parseTokens.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lookup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lookup */ "./src/lookup.js");
/* harmony import */ var _renderTemplate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderTemplate */ "./src/renderTemplate.js");
/**
 * 处理数组、对象循环，结合renderTemplate实现递归
 * @param {array} token 
 * @param {object} data 
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(token, data) {
    let resultStr = ''
    const key = token[1]
    const childTokens = token[2]

    // data中的实际数据，决定循环的方式
    const v = (0,_lookup__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key)

    if (Array.isArray(v)) {
        for (let index = 0; index < v.length; index++) {
            resultStr += (0,_renderTemplate__WEBPACK_IMPORTED_MODULE_1__["default"])(childTokens, {
                ...v[index],
                '.': v[index]
            })
        }
    } else if (typeof v === 'object') {
        resultStr += (0,_renderTemplate__WEBPACK_IMPORTED_MODULE_1__["default"])(childTokens, v)
    }

    return resultStr
}

/***/ }),

/***/ "./src/renderTemplate.js":
/*!*******************************!*\
  !*** ./src/renderTemplate.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lookup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lookup */ "./src/lookup.js");
/* harmony import */ var _parseTokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parseTokens */ "./src/parseTokens.js");
/**
 * 将tokens和data结合，生成DOM字符串
 * @param {array} tokens 
 * @param {object} data 
 * @returns 
 */

// console.log(lookup({a: {b: {c: '我才是结果'}}}, 'a.b.c'))


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(tokens, data) {
    let templateStr = ''

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index]

        const type = token[0]
        const key = token[1]

        if (type === 'name') {
            templateStr += (0,_lookup__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key)
        } else if (type === 'text') {
            templateStr += key
        } else if (type === '#') {
            templateStr += (0,_parseTokens__WEBPACK_IMPORTED_MODULE_1__["default"])(token, data)
        }
    }

    return templateStr
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _parseTemplateTokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parseTemplateTokens */ "./src/parseTemplateTokens.js");
/* harmony import */ var _renderTemplate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderTemplate */ "./src/renderTemplate.js");



const myTemplateEngine = {
    render(templateStr, data) {
        const tokens = (0,_parseTemplateTokens__WEBPACK_IMPORTED_MODULE_0__["default"])(templateStr)
        console.log('tokens', tokens)

        const domStr = (0,_renderTemplate__WEBPACK_IMPORTED_MODULE_1__["default"])(tokens, data)
        console.log('domStr', domStr)

        let container = document.getElementById('container')
        container.innerHTML = domStr // 上树
        container = null
    }
}

// 测试用例一
// const templateStr = '今天开始学习{{thing}}，我好{{mood}}啊'
// const data = {
//     thing: 'mustache',
//     mood: '开心'
// }


// 测试用例二
// const templateStr = `
//     <div>
//         <ol>
//             {{#students}}
//             <li class="students">
//                 学生{{.}}
//             </li>
//             {{/students}}
//         </ol>
//     </div>
// `
// const data = {
//     students: ['小明', '小强', '小王']
// }


// 测试用例三
// const templateStr = `
//     <div>
//         <ol>
//             {{#students}}
//             <li class="hobbies">
//                 学生{{name}}的爱好
//                 <ol>
//                     {{#hobbies}}
//                     <li>{{.}}</li>
//                     {{/hobbies}}
//                 </ol>
//             </li>
//             {{/students}}
//         </ol>
//     </div>
// `
// const data = {
//     students: [
//         {name: '小明', hobbies: ['游戏', '打球']},
//         {name: '小强', hobbies: ['吃饭', '睡觉']},
//         {name: '小王', hobbies: ['打豆豆', '游泳']}
//     ]
// }


// -----------------------------
// 增加循环的对象是对象

// 测试用例四
// const templateStr = `
//     <div>
//         <ol>
//             {{#hobbies}}
//             <div class="hobbies">
//                 <li>{{one}}</li>
//                 <li>{{two}}</li>
//             </div>
//             {{/students}}
//         </ol>
//     </div>
// `
// const data = {
//     hobbies: { one: '游戏', two: '打球' }
// }


// 测试用例五
const templateStr = `
    <div>
        <ol>
            {{#students}}
            <li class="hobbies">
                学生{{name}}的爱好
                <ol>
                    {{#hobbies}}
                    <li>{{one}}</li>
                    <li>{{two}}</li>
                    {{/hobbies}}
                </ol>
            </li>
            {{/students}}
        </ol>
    </div>
`
const data = {
    students: [
        {name: '小明', hobbies: { one: '游戏', two: '打球' }},
        {name: '小强', hobbies: { one: '游戏', two: '打球' }},
        {name: '小王', hobbies: { one: '游戏', two: '打球' }}
    ]
    
}

// 执行
myTemplateEngine.render(templateStr, data)
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map