/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	var ejs = __webpack_require__(2);

	var util = __webpack_require__(3);

	(function(win, $) {
	    function getData(callback) {
	        var baseData = util.local.get('score');
	        if (baseData) {
	            callback(baseData);
	            return;
	        }
	        getNewData(callback);
	    }

	    function getNewData(callback) {
	        $.get('/dean/getScore', function(json) {
	            if (json.ret == -2) {
	                //需要登录
	                // alert(win.location.pathname);
	                win.location.href = '/user/login?ref=' + win.location.pathname;
	            } else if (json.ret == 0) {
	                callback(json.data);
	                util.local.set('score', json.data);
	            } else {
	                //做一些其他处理,比如toast告诉用户数据拉取出错了
	            }
	        });
	    }

	    function render(data) {
	        var str = $('#tpl_score').html();
	        var html = ejs.render(str, {list: data.scoreList});
	        $('#score').html(html);
	    }

	    function updateData() {
	        setTimeout(function() {
	            getNewData(function(data) {
	                render(data);
	            })
	        }, 0)
	    }

	    (function init() {
	        getData(function(data) {
	            render(data);
	        });
	        updateData();
	    })();
	}(window, Zepto));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Zepto v1.2.0 - zepto event ajax form ie - zeptojs.com/license */
	(function(global, factory) {
	    if(exports === 'object' && typeof module !== 'undefined')
	        module.exports = factory(global)
	    if (true)
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return factory(global) }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	    else
	        factory(global)
	}( typeof window !== "undefined" ? window : this, function(window) {
	    var Zepto = (function() {
	        var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
	            document = window.document,
	            elementDisplay = {}, classCache = {},
	            cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
	            fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	            singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	            tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	            rootNodeRE = /^(?:body|html)$/i,
	            capitalRE = /([A-Z])/g,

	            // special attributes that should be get/set via method calls
	            methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

	            adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	            table = document.createElement('table'),
	            tableRow = document.createElement('tr'),
	            containers = {
	                'tr': document.createElement('tbody'),
	                'tbody': table, 'thead': table, 'tfoot': table,
	                'td': tableRow, 'th': tableRow,
	                '*': document.createElement('div')
	            },
	            readyRE = /complete|loaded|interactive/,
	            simpleSelectorRE = /^[\w-]*$/,
	            class2type = {},
	            toString = class2type.toString,
	            zepto = {},
	            camelize, uniq,
	            tempParent = document.createElement('div'),
	            propMap = {
	                'tabindex': 'tabIndex',
	                'readonly': 'readOnly',
	                'for': 'htmlFor',
	                'class': 'className',
	                'maxlength': 'maxLength',
	                'cellspacing': 'cellSpacing',
	                'cellpadding': 'cellPadding',
	                'rowspan': 'rowSpan',
	                'colspan': 'colSpan',
	                'usemap': 'useMap',
	                'frameborder': 'frameBorder',
	                'contenteditable': 'contentEditable'
	            },
	            isArray = Array.isArray ||
	                function(object){ return object instanceof Array }

	        zepto.matches = function(element, selector) {
	            if (!selector || !element || element.nodeType !== 1) return false
	            var matchesSelector = element.matches || element.webkitMatchesSelector ||
	                element.mozMatchesSelector || element.oMatchesSelector ||
	                element.matchesSelector
	            if (matchesSelector) return matchesSelector.call(element, selector)
	            // fall back to performing a selector:
	            var match, parent = element.parentNode, temp = !parent
	            if (temp) (parent = tempParent).appendChild(element)
	            match = ~zepto.qsa(parent, selector).indexOf(element)
	            temp && tempParent.removeChild(element)
	            return match
	        }

	        function type(obj) {
	            return obj == null ? String(obj) :
	            class2type[toString.call(obj)] || "object"
	        }

	        function isFunction(value) { return type(value) == "function" }
	        function isWindow(obj)     { return obj != null && obj == obj.window }
	        function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	        function isObject(obj)     { return type(obj) == "object" }
	        function isPlainObject(obj) {
	            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	        }

	        function likeArray(obj) {
	            var length = !!obj && 'length' in obj && obj.length,
	                type = $.type(obj)

	            return 'function' != type && !isWindow(obj) && (
	                    'array' == type || length === 0 ||
	                    (typeof length == 'number' && length > 0 && (length - 1) in obj)
	                )
	        }

	        function compact(array) { return filter.call(array, function(item){ return item != null }) }
	        function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	        camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	        function dasherize(str) {
	            return str.replace(/::/g, '/')
	                .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	                .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	                .replace(/_/g, '-')
	                .toLowerCase()
	        }
	        uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

	        function classRE(name) {
	            return name in classCache ?
	                classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	        }

	        function maybeAddPx(name, value) {
	            return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	        }

	        function defaultDisplay(nodeName) {
	            var element, display
	            if (!elementDisplay[nodeName]) {
	                element = document.createElement(nodeName)
	                document.body.appendChild(element)
	                display = getComputedStyle(element, '').getPropertyValue("display")
	                element.parentNode.removeChild(element)
	                display == "none" && (display = "block")
	                elementDisplay[nodeName] = display
	            }
	            return elementDisplay[nodeName]
	        }

	        function children(element) {
	            return 'children' in element ?
	                slice.call(element.children) :
	                $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
	        }

	        function Z(dom, selector) {
	            var i, len = dom ? dom.length : 0
	            for (i = 0; i < len; i++) this[i] = dom[i]
	            this.length = len
	            this.selector = selector || ''
	        }

	        // `$.zepto.fragment` takes a html string and an optional tag name
	        // to generate DOM nodes from the given html string.
	        // The generated DOM nodes are returned as an array.
	        // This function can be overridden in plugins for example to make
	        // it compatible with browsers that don't support the DOM fully.
	        zepto.fragment = function(html, name, properties) {
	            var dom, nodes, container

	            // A special case optimization for a single tag
	            if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

	            if (!dom) {
	                if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
	                if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	                if (!(name in containers)) name = '*'

	                container = containers[name]
	                container.innerHTML = '' + html
	                dom = $.each(slice.call(container.childNodes), function(){
	                    container.removeChild(this)
	                })
	            }

	            if (isPlainObject(properties)) {
	                nodes = $(dom)
	                $.each(properties, function(key, value) {
	                    if (methodAttributes.indexOf(key) > -1) nodes[key](value)
	                    else nodes.attr(key, value)
	                })
	            }

	            return dom
	        }

	        // `$.zepto.Z` swaps out the prototype of the given `dom` array
	        // of nodes with `$.fn` and thus supplying all the Zepto functions
	        // to the array. This method can be overridden in plugins.
	        zepto.Z = function(dom, selector) {
	            return new Z(dom, selector)
	        }

	        // `$.zepto.isZ` should return `true` if the given object is a Zepto
	        // collection. This method can be overridden in plugins.
	        zepto.isZ = function(object) {
	            return object instanceof zepto.Z
	        }

	        // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	        // takes a CSS selector and an optional context (and handles various
	        // special cases).
	        // This method can be overridden in plugins.
	        zepto.init = function(selector, context) {
	            var dom
	            // If nothing given, return an empty Zepto collection
	            if (!selector) return zepto.Z()
	            // Optimize for string selectors
	            else if (typeof selector == 'string') {
	                selector = selector.trim()
	                // If it's a html fragment, create nodes from it
	                // Note: In both Chrome 21 and Firefox 15, DOM error 12
	                // is thrown if the fragment doesn't begin with <
	                if (selector[0] == '<' && fragmentRE.test(selector))
	                    dom = zepto.fragment(selector, RegExp.$1, context), selector = null
	                // If there's a context, create a collection on that context first, and select
	                // nodes from there
	                else if (context !== undefined) return $(context).find(selector)
	                // If it's a CSS selector, use it to select nodes.
	                else dom = zepto.qsa(document, selector)
	            }
	            // If a function is given, call it when the DOM is ready
	            else if (isFunction(selector)) return $(document).ready(selector)
	            // If a Zepto collection is given, just return it
	            else if (zepto.isZ(selector)) return selector
	            else {
	                // normalize array if an array of nodes is given
	                if (isArray(selector)) dom = compact(selector)
	                // Wrap DOM nodes.
	                else if (isObject(selector))
	                    dom = [selector], selector = null
	                // If it's a html fragment, create nodes from it
	                else if (fragmentRE.test(selector))
	                    dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
	                // If there's a context, create a collection on that context first, and select
	                // nodes from there
	                else if (context !== undefined) return $(context).find(selector)
	                // And last but no least, if it's a CSS selector, use it to select nodes.
	                else dom = zepto.qsa(document, selector)
	            }
	            // create a new Zepto collection from the nodes found
	            return zepto.Z(dom, selector)
	        }

	        // `$` will be the base `Zepto` object. When calling this
	        // function just call `$.zepto.init, which makes the implementation
	        // details of selecting nodes and creating Zepto collections
	        // patchable in plugins.
	        $ = function(selector, context){
	            return zepto.init(selector, context)
	        }

	        function extend(target, source, deep) {
	            for (key in source)
	                if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	                    if (isPlainObject(source[key]) && !isPlainObject(target[key]))
	                        target[key] = {}
	                    if (isArray(source[key]) && !isArray(target[key]))
	                        target[key] = []
	                    extend(target[key], source[key], deep)
	                }
	                else if (source[key] !== undefined) target[key] = source[key]
	        }

	        // Copy all but undefined properties from one or more
	        // objects to the `target` object.
	        $.extend = function(target){
	            var deep, args = slice.call(arguments, 1)
	            if (typeof target == 'boolean') {
	                deep = target
	                target = args.shift()
	            }
	            args.forEach(function(arg){ extend(target, arg, deep) })
	            return target
	        }

	        // `$.zepto.qsa` is Zepto's CSS selector implementation which
	        // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	        // This method can be overridden in plugins.
	        zepto.qsa = function(element, selector){
	            var found,
	                maybeID = selector[0] == '#',
	                maybeClass = !maybeID && selector[0] == '.',
	                nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
	                isSimple = simpleSelectorRE.test(nameOnly)
	            return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
	                ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
	                (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
	                    slice.call(
	                        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
	                            maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	                                element.getElementsByTagName(selector) : // Or a tag
	                            element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	                    )
	        }

	        function filtered(nodes, selector) {
	            return selector == null ? $(nodes) : $(nodes).filter(selector)
	        }

	        $.contains = document.documentElement.contains ?
	            function(parent, node) {
	                return parent !== node && parent.contains(node)
	            } :
	            function(parent, node) {
	                while (node && (node = node.parentNode))
	                    if (node === parent) return true
	                return false
	            }

	        function funcArg(context, arg, idx, payload) {
	            return isFunction(arg) ? arg.call(context, idx, payload) : arg
	        }

	        function setAttribute(node, name, value) {
	            value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
	        }

	        // access className property while respecting SVGAnimatedString
	        function className(node, value){
	            var klass = node.className || '',
	                svg   = klass && klass.baseVal !== undefined

	            if (value === undefined) return svg ? klass.baseVal : klass
	            svg ? (klass.baseVal = value) : (node.className = value)
	        }

	        // "true"  => true
	        // "false" => false
	        // "null"  => null
	        // "42"    => 42
	        // "42.5"  => 42.5
	        // "08"    => "08"
	        // JSON    => parse if valid
	        // String  => self
	        function deserializeValue(value) {
	            try {
	                return value ?
	                value == "true" ||
	                ( value == "false" ? false :
	                    value == "null" ? null :
	                        +value + "" == value ? +value :
	                            /^[\[\{]/.test(value) ? $.parseJSON(value) :
	                                value )
	                    : value
	            } catch(e) {
	                return value
	            }
	        }

	        $.type = type
	        $.isFunction = isFunction
	        $.isWindow = isWindow
	        $.isArray = isArray
	        $.isPlainObject = isPlainObject

	        $.isEmptyObject = function(obj) {
	            var name
	            for (name in obj) return false
	            return true
	        }

	        $.isNumeric = function(val) {
	            var num = Number(val), type = typeof val
	            return val != null && type != 'boolean' &&
	                (type != 'string' || val.length) &&
	                !isNaN(num) && isFinite(num) || false
	        }

	        $.inArray = function(elem, array, i){
	            return emptyArray.indexOf.call(array, elem, i)
	        }

	        $.camelCase = camelize
	        $.trim = function(str) {
	            return str == null ? "" : String.prototype.trim.call(str)
	        }

	        // plugin compatibility
	        $.uuid = 0
	        $.support = { }
	        $.expr = { }
	        $.noop = function() {}

	        $.map = function(elements, callback){
	            var value, values = [], i, key
	            if (likeArray(elements))
	                for (i = 0; i < elements.length; i++) {
	                    value = callback(elements[i], i)
	                    if (value != null) values.push(value)
	                }
	            else
	                for (key in elements) {
	                    value = callback(elements[key], key)
	                    if (value != null) values.push(value)
	                }
	            return flatten(values)
	        }

	        $.each = function(elements, callback){
	            var i, key
	            if (likeArray(elements)) {
	                for (i = 0; i < elements.length; i++)
	                    if (callback.call(elements[i], i, elements[i]) === false) return elements
	            } else {
	                for (key in elements)
	                    if (callback.call(elements[key], key, elements[key]) === false) return elements
	            }

	            return elements
	        }

	        $.grep = function(elements, callback){
	            return filter.call(elements, callback)
	        }

	        if (window.JSON) $.parseJSON = JSON.parse

	        // Populate the class2type map
	        $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	            class2type[ "[object " + name + "]" ] = name.toLowerCase()
	        })

	        // Define methods that will be available on all
	        // Zepto collections
	        $.fn = {
	            constructor: zepto.Z,
	            length: 0,

	            // Because a collection acts like an array
	            // copy over these useful array functions.
	            forEach: emptyArray.forEach,
	            reduce: emptyArray.reduce,
	            push: emptyArray.push,
	            sort: emptyArray.sort,
	            splice: emptyArray.splice,
	            indexOf: emptyArray.indexOf,
	            concat: function(){
	                var i, value, args = []
	                for (i = 0; i < arguments.length; i++) {
	                    value = arguments[i]
	                    args[i] = zepto.isZ(value) ? value.toArray() : value
	                }
	                return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
	            },

	            // `map` and `slice` in the jQuery API work differently
	            // from their array counterparts
	            map: function(fn){
	                return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
	            },
	            slice: function(){
	                return $(slice.apply(this, arguments))
	            },

	            ready: function(callback){
	                // need to check if document.body exists for IE as that browser reports
	                // document ready when it hasn't yet created the body element
	                if (readyRE.test(document.readyState) && document.body) callback($)
	                else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	                return this
	            },
	            get: function(idx){
	                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
	            },
	            toArray: function(){ return this.get() },
	            size: function(){
	                return this.length
	            },
	            remove: function(){
	                return this.each(function(){
	                    if (this.parentNode != null)
	                        this.parentNode.removeChild(this)
	                })
	            },
	            each: function(callback){
	                emptyArray.every.call(this, function(el, idx){
	                    return callback.call(el, idx, el) !== false
	                })
	                return this
	            },
	            filter: function(selector){
	                if (isFunction(selector)) return this.not(this.not(selector))
	                return $(filter.call(this, function(element){
	                    return zepto.matches(element, selector)
	                }))
	            },
	            add: function(selector,context){
	                return $(uniq(this.concat($(selector,context))))
	            },
	            is: function(selector){
	                return this.length > 0 && zepto.matches(this[0], selector)
	            },
	            not: function(selector){
	                var nodes=[]
	                if (isFunction(selector) && selector.call !== undefined)
	                    this.each(function(idx){
	                        if (!selector.call(this,idx)) nodes.push(this)
	                    })
	                else {
	                    var excludes = typeof selector == 'string' ? this.filter(selector) :
	                        (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
	                    this.forEach(function(el){
	                        if (excludes.indexOf(el) < 0) nodes.push(el)
	                    })
	                }
	                return $(nodes)
	            },
	            has: function(selector){
	                return this.filter(function(){
	                    return isObject(selector) ?
	                        $.contains(this, selector) :
	                        $(this).find(selector).size()
	                })
	            },
	            eq: function(idx){
	                return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
	            },
	            first: function(){
	                var el = this[0]
	                return el && !isObject(el) ? el : $(el)
	            },
	            last: function(){
	                var el = this[this.length - 1]
	                return el && !isObject(el) ? el : $(el)
	            },
	            find: function(selector){
	                var result, $this = this
	                if (!selector) result = $()
	                else if (typeof selector == 'object')
	                    result = $(selector).filter(function(){
	                        var node = this
	                        return emptyArray.some.call($this, function(parent){
	                            return $.contains(parent, node)
	                        })
	                    })
	                else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
	                else result = this.map(function(){ return zepto.qsa(this, selector) })
	                return result
	            },
	            closest: function(selector, context){
	                var nodes = [], collection = typeof selector == 'object' && $(selector)
	                this.each(function(_, node){
	                    while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
	                        node = node !== context && !isDocument(node) && node.parentNode
	                    if (node && nodes.indexOf(node) < 0) nodes.push(node)
	                })
	                return $(nodes)
	            },
	            parents: function(selector){
	                var ancestors = [], nodes = this
	                while (nodes.length > 0)
	                    nodes = $.map(nodes, function(node){
	                        if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	                            ancestors.push(node)
	                            return node
	                        }
	                    })
	                return filtered(ancestors, selector)
	            },
	            parent: function(selector){
	                return filtered(uniq(this.pluck('parentNode')), selector)
	            },
	            children: function(selector){
	                return filtered(this.map(function(){ return children(this) }), selector)
	            },
	            contents: function() {
	                return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
	            },
	            siblings: function(selector){
	                return filtered(this.map(function(i, el){
	                    return filter.call(children(el.parentNode), function(child){ return child!==el })
	                }), selector)
	            },
	            empty: function(){
	                return this.each(function(){ this.innerHTML = '' })
	            },
	            // `pluck` is borrowed from Prototype.js
	            pluck: function(property){
	                return $.map(this, function(el){ return el[property] })
	            },
	            show: function(){
	                return this.each(function(){
	                    this.style.display == "none" && (this.style.display = '')
	                    if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	                        this.style.display = defaultDisplay(this.nodeName)
	                })
	            },
	            replaceWith: function(newContent){
	                return this.before(newContent).remove()
	            },
	            wrap: function(structure){
	                var func = isFunction(structure)
	                if (this[0] && !func)
	                    var dom   = $(structure).get(0),
	                        clone = dom.parentNode || this.length > 1

	                return this.each(function(index){
	                    $(this).wrapAll(
	                        func ? structure.call(this, index) :
	                            clone ? dom.cloneNode(true) : dom
	                    )
	                })
	            },
	            wrapAll: function(structure){
	                if (this[0]) {
	                    $(this[0]).before(structure = $(structure))
	                    var children
	                    // drill down to the inmost element
	                    while ((children = structure.children()).length) structure = children.first()
	                    $(structure).append(this)
	                }
	                return this
	            },
	            wrapInner: function(structure){
	                var func = isFunction(structure)
	                return this.each(function(index){
	                    var self = $(this), contents = self.contents(),
	                        dom  = func ? structure.call(this, index) : structure
	                    contents.length ? contents.wrapAll(dom) : self.append(dom)
	                })
	            },
	            unwrap: function(){
	                this.parent().each(function(){
	                    $(this).replaceWith($(this).children())
	                })
	                return this
	            },
	            clone: function(){
	                return this.map(function(){ return this.cloneNode(true) })
	            },
	            hide: function(){
	                return this.css("display", "none")
	            },
	            toggle: function(setting){
	                return this.each(function(){
	                    var el = $(this)
	                        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
	                })
	            },
	            prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
	            next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
	            html: function(html){
	                return 0 in arguments ?
	                    this.each(function(idx){
	                        var originHtml = this.innerHTML
	                        $(this).empty().append( funcArg(this, html, idx, originHtml) )
	                    }) :
	                    (0 in this ? this[0].innerHTML : null)
	            },
	            text: function(text){
	                return 0 in arguments ?
	                    this.each(function(idx){
	                        var newText = funcArg(this, text, idx, this.textContent)
	                        this.textContent = newText == null ? '' : ''+newText
	                    }) :
	                    (0 in this ? this.pluck('textContent').join("") : null)
	            },
	            attr: function(name, value){
	                var result
	                return (typeof name == 'string' && !(1 in arguments)) ?
	                    (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
	                    this.each(function(idx){
	                        if (this.nodeType !== 1) return
	                        if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
	                        else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
	                    })
	            },
	            removeAttr: function(name){
	                return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
	                    setAttribute(this, attribute)
	                }, this)})
	            },
	            prop: function(name, value){
	                name = propMap[name] || name
	                return (1 in arguments) ?
	                    this.each(function(idx){
	                        this[name] = funcArg(this, value, idx, this[name])
	                    }) :
	                    (this[0] && this[0][name])
	            },
	            removeProp: function(name){
	                name = propMap[name] || name
	                return this.each(function(){ delete this[name] })
	            },
	            data: function(name, value){
	                var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

	                var data = (1 in arguments) ?
	                    this.attr(attrName, value) :
	                    this.attr(attrName)

	                return data !== null ? deserializeValue(data) : undefined
	            },
	            val: function(value){
	                if (0 in arguments) {
	                    if (value == null) value = ""
	                    return this.each(function(idx){
	                        this.value = funcArg(this, value, idx, this.value)
	                    })
	                } else {
	                    return this[0] && (this[0].multiple ?
	                            $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
	                            this[0].value)
	                }
	            },
	            offset: function(coordinates){
	                if (coordinates) return this.each(function(index){
	                    var $this = $(this),
	                        coords = funcArg(this, coordinates, index, $this.offset()),
	                        parentOffset = $this.offsetParent().offset(),
	                        props = {
	                            top:  coords.top  - parentOffset.top,
	                            left: coords.left - parentOffset.left
	                        }

	                    if ($this.css('position') == 'static') props['position'] = 'relative'
	                    $this.css(props)
	                })
	                if (!this.length) return null
	                if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
	                    return {top: 0, left: 0}
	                var obj = this[0].getBoundingClientRect()
	                return {
	                    left: obj.left + window.pageXOffset,
	                    top: obj.top + window.pageYOffset,
	                    width: Math.round(obj.width),
	                    height: Math.round(obj.height)
	                }
	            },
	            css: function(property, value){
	                if (arguments.length < 2) {
	                    var element = this[0]
	                    if (typeof property == 'string') {
	                        if (!element) return
	                        return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
	                    } else if (isArray(property)) {
	                        if (!element) return
	                        var props = {}
	                        var computedStyle = getComputedStyle(element, '')
	                        $.each(property, function(_, prop){
	                            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
	                        })
	                        return props
	                    }
	                }

	                var css = ''
	                if (type(property) == 'string') {
	                    if (!value && value !== 0)
	                        this.each(function(){ this.style.removeProperty(dasherize(property)) })
	                    else
	                        css = dasherize(property) + ":" + maybeAddPx(property, value)
	                } else {
	                    for (key in property)
	                        if (!property[key] && property[key] !== 0)
	                            this.each(function(){ this.style.removeProperty(dasherize(key)) })
	                        else
	                            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
	                }

	                return this.each(function(){ this.style.cssText += ';' + css })
	            },
	            index: function(element){
	                return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
	            },
	            hasClass: function(name){
	                if (!name) return false
	                return emptyArray.some.call(this, function(el){
	                    return this.test(className(el))
	                }, classRE(name))
	            },
	            addClass: function(name){
	                if (!name) return this
	                return this.each(function(idx){
	                    if (!('className' in this)) return
	                    classList = []
	                    var cls = className(this), newName = funcArg(this, name, idx, cls)
	                    newName.split(/\s+/g).forEach(function(klass){
	                        if (!$(this).hasClass(klass)) classList.push(klass)
	                    }, this)
	                    classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
	                })
	            },
	            removeClass: function(name){
	                return this.each(function(idx){
	                    if (!('className' in this)) return
	                    if (name === undefined) return className(this, '')
	                    classList = className(this)
	                    funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
	                        classList = classList.replace(classRE(klass), " ")
	                    })
	                    className(this, classList.trim())
	                })
	            },
	            toggleClass: function(name, when){
	                if (!name) return this
	                return this.each(function(idx){
	                    var $this = $(this), names = funcArg(this, name, idx, className(this))
	                    names.split(/\s+/g).forEach(function(klass){
	                        (when === undefined ? !$this.hasClass(klass) : when) ?
	                            $this.addClass(klass) : $this.removeClass(klass)
	                    })
	                })
	            },
	            scrollTop: function(value){
	                if (!this.length) return
	                var hasScrollTop = 'scrollTop' in this[0]
	                if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
	                return this.each(hasScrollTop ?
	                    function(){ this.scrollTop = value } :
	                    function(){ this.scrollTo(this.scrollX, value) })
	            },
	            scrollLeft: function(value){
	                if (!this.length) return
	                var hasScrollLeft = 'scrollLeft' in this[0]
	                if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
	                return this.each(hasScrollLeft ?
	                    function(){ this.scrollLeft = value } :
	                    function(){ this.scrollTo(value, this.scrollY) })
	            },
	            position: function() {
	                if (!this.length) return

	                var elem = this[0],
	                    // Get *real* offsetParent
	                    offsetParent = this.offsetParent(),
	                    // Get correct offsets
	                    offset       = this.offset(),
	                    parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

	                // Subtract element margins
	                // note: when an element has margin: auto the offsetLeft and marginLeft
	                // are the same in Safari causing offset.left to incorrectly be 0
	                offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
	                offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

	                // Add offsetParent borders
	                parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
	                parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

	                // Subtract the two offsets
	                return {
	                    top:  offset.top  - parentOffset.top,
	                    left: offset.left - parentOffset.left
	                }
	            },
	            offsetParent: function() {
	                return this.map(function(){
	                    var parent = this.offsetParent || document.body
	                    while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
	                        parent = parent.offsetParent
	                    return parent
	                })
	            }
	        }

	        // for now
	        $.fn.detach = $.fn.remove

	        // Generate the `width` and `height` functions
	        ;['width', 'height'].forEach(function(dimension){
	            var dimensionProperty =
	                dimension.replace(/./, function(m){ return m[0].toUpperCase() })

	            $.fn[dimension] = function(value){
	                var offset, el = this[0]
	                if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
	                    isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
	                    (offset = this.offset()) && offset[dimension]
	                else return this.each(function(idx){
	                    el = $(this)
	                    el.css(dimension, funcArg(this, value, idx, el[dimension]()))
	                })
	            }
	        })

	        function traverseNode(node, fun) {
	            fun(node)
	            for (var i = 0, len = node.childNodes.length; i < len; i++)
	                traverseNode(node.childNodes[i], fun)
	        }

	        // Generate the `after`, `prepend`, `before`, `append`,
	        // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	        adjacencyOperators.forEach(function(operator, operatorIndex) {
	            var inside = operatorIndex % 2 //=> prepend, append

	            $.fn[operator] = function(){
	                // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	                var argType, nodes = $.map(arguments, function(arg) {
	                        var arr = []
	                        argType = type(arg)
	                        if (argType == "array") {
	                            arg.forEach(function(el) {
	                                if (el.nodeType !== undefined) return arr.push(el)
	                                else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
	                                arr = arr.concat(zepto.fragment(el))
	                            })
	                            return arr
	                        }
	                        return argType == "object" || arg == null ?
	                            arg : zepto.fragment(arg)
	                    }),
	                    parent, copyByClone = this.length > 1
	                if (nodes.length < 1) return this

	                return this.each(function(_, target){
	                    parent = inside ? target : target.parentNode

	                    // convert all methods to a "before" operation
	                    target = operatorIndex == 0 ? target.nextSibling :
	                        operatorIndex == 1 ? target.firstChild :
	                            operatorIndex == 2 ? target :
	                                null

	                    var parentInDocument = $.contains(document.documentElement, parent)

	                    nodes.forEach(function(node){
	                        if (copyByClone) node = node.cloneNode(true)
	                        else if (!parent) return $(node).remove()

	                        parent.insertBefore(node, target)
	                        if (parentInDocument) traverseNode(node, function(el){
	                            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
	                                (!el.type || el.type === 'text/javascript') && !el.src){
	                                var target = el.ownerDocument ? el.ownerDocument.defaultView : window
	                                target['eval'].call(target, el.innerHTML)
	                            }
	                        })
	                    })
	                })
	            }

	            // after    => insertAfter
	            // prepend  => prependTo
	            // before   => insertBefore
	            // append   => appendTo
	            $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
	                $(html)[operator](this)
	                return this
	            }
	        })

	        zepto.Z.prototype = Z.prototype = $.fn

	        // Export internal API functions in the `$.zepto` namespace
	        zepto.uniq = uniq
	        zepto.deserializeValue = deserializeValue
	        $.zepto = zepto

	        return $
	    })()

	    window.Zepto = Zepto
	    window.$ === undefined && (window.$ = Zepto)

	    ;(function($){
	        var _zid = 1, undefined,
	            slice = Array.prototype.slice,
	            isFunction = $.isFunction,
	            isString = function(obj){ return typeof obj == 'string' },
	            handlers = {},
	            specialEvents={},
	            focusinSupported = 'onfocusin' in window,
	            focus = { focus: 'focusin', blur: 'focusout' },
	            hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

	        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

	        function zid(element) {
	            return element._zid || (element._zid = _zid++)
	        }
	        function findHandlers(element, event, fn, selector) {
	            event = parse(event)
	            if (event.ns) var matcher = matcherFor(event.ns)
	            return (handlers[zid(element)] || []).filter(function(handler) {
	                return handler
	                    && (!event.e  || handler.e == event.e)
	                    && (!event.ns || matcher.test(handler.ns))
	                    && (!fn       || zid(handler.fn) === zid(fn))
	                    && (!selector || handler.sel == selector)
	            })
	        }
	        function parse(event) {
	            var parts = ('' + event).split('.')
	            return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
	        }
	        function matcherFor(ns) {
	            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	        }

	        function eventCapture(handler, captureSetting) {
	            return handler.del &&
	                (!focusinSupported && (handler.e in focus)) ||
	                !!captureSetting
	        }

	        function realEvent(type) {
	            return hover[type] || (focusinSupported && focus[type]) || type
	        }

	        function add(element, events, fn, data, selector, delegator, capture){
	            var id = zid(element), set = (handlers[id] || (handlers[id] = []))
	            events.split(/\s/).forEach(function(event){
	                if (event == 'ready') return $(document).ready(fn)
	                var handler   = parse(event)
	                handler.fn    = fn
	                handler.sel   = selector
	                // emulate mouseenter, mouseleave
	                if (handler.e in hover) fn = function(e){
	                    var related = e.relatedTarget
	                    if (!related || (related !== this && !$.contains(this, related)))
	                        return handler.fn.apply(this, arguments)
	                }
	                handler.del   = delegator
	                var callback  = delegator || fn
	                handler.proxy = function(e){
	                    e = compatible(e)
	                    if (e.isImmediatePropagationStopped()) return
	                    e.data = data
	                    var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
	                    if (result === false) e.preventDefault(), e.stopPropagation()
	                    return result
	                }
	                handler.i = set.length
	                set.push(handler)
	                if ('addEventListener' in element)
	                    element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	            })
	        }
	        function remove(element, events, fn, selector, capture){
	            var id = zid(element)
	                ;(events || '').split(/\s/).forEach(function(event){
	                findHandlers(element, event, fn, selector).forEach(function(handler){
	                    delete handlers[id][handler.i]
	                    if ('removeEventListener' in element)
	                        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	                })
	            })
	        }

	        $.event = { add: add, remove: remove }

	        $.proxy = function(fn, context) {
	            var args = (2 in arguments) && slice.call(arguments, 2)
	            if (isFunction(fn)) {
	                var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
	                proxyFn._zid = zid(fn)
	                return proxyFn
	            } else if (isString(context)) {
	                if (args) {
	                    args.unshift(fn[context], fn)
	                    return $.proxy.apply(null, args)
	                } else {
	                    return $.proxy(fn[context], fn)
	                }
	            } else {
	                throw new TypeError("expected function")
	            }
	        }

	        $.fn.bind = function(event, data, callback){
	            return this.on(event, data, callback)
	        }
	        $.fn.unbind = function(event, callback){
	            return this.off(event, callback)
	        }
	        $.fn.one = function(event, selector, data, callback){
	            return this.on(event, selector, data, callback, 1)
	        }

	        var returnTrue = function(){return true},
	            returnFalse = function(){return false},
	            ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
	            eventMethods = {
	                preventDefault: 'isDefaultPrevented',
	                stopImmediatePropagation: 'isImmediatePropagationStopped',
	                stopPropagation: 'isPropagationStopped'
	            }

	        function compatible(event, source) {
	            if (source || !event.isDefaultPrevented) {
	                source || (source = event)

	                $.each(eventMethods, function(name, predicate) {
	                    var sourceMethod = source[name]
	                    event[name] = function(){
	                        this[predicate] = returnTrue
	                        return sourceMethod && sourceMethod.apply(source, arguments)
	                    }
	                    event[predicate] = returnFalse
	                })

	                event.timeStamp || (event.timeStamp = Date.now())

	                if (source.defaultPrevented !== undefined ? source.defaultPrevented :
	                        'returnValue' in source ? source.returnValue === false :
	                        source.getPreventDefault && source.getPreventDefault())
	                    event.isDefaultPrevented = returnTrue
	            }
	            return event
	        }

	        function createProxy(event) {
	            var key, proxy = { originalEvent: event }
	            for (key in event)
	                if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

	            return compatible(proxy, event)
	        }

	        $.fn.delegate = function(selector, event, callback){
	            return this.on(event, selector, callback)
	        }
	        $.fn.undelegate = function(selector, event, callback){
	            return this.off(event, selector, callback)
	        }

	        $.fn.live = function(event, callback){
	            $(document.body).delegate(this.selector, event, callback)
	            return this
	        }
	        $.fn.die = function(event, callback){
	            $(document.body).undelegate(this.selector, event, callback)
	            return this
	        }

	        $.fn.on = function(event, selector, data, callback, one){
	            var autoRemove, delegator, $this = this
	            if (event && !isString(event)) {
	                $.each(event, function(type, fn){
	                    $this.on(type, selector, data, fn, one)
	                })
	                return $this
	            }

	            if (!isString(selector) && !isFunction(callback) && callback !== false)
	                callback = data, data = selector, selector = undefined
	            if (callback === undefined || data === false)
	                callback = data, data = undefined

	            if (callback === false) callback = returnFalse

	            return $this.each(function(_, element){
	                if (one) autoRemove = function(e){
	                    remove(element, e.type, callback)
	                    return callback.apply(this, arguments)
	                }

	                if (selector) delegator = function(e){
	                    var evt, match = $(e.target).closest(selector, element).get(0)
	                    if (match && match !== element) {
	                        evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
	                        return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
	                    }
	                }

	                add(element, event, callback, data, selector, delegator || autoRemove)
	            })
	        }
	        $.fn.off = function(event, selector, callback){
	            var $this = this
	            if (event && !isString(event)) {
	                $.each(event, function(type, fn){
	                    $this.off(type, selector, fn)
	                })
	                return $this
	            }

	            if (!isString(selector) && !isFunction(callback) && callback !== false)
	                callback = selector, selector = undefined

	            if (callback === false) callback = returnFalse

	            return $this.each(function(){
	                remove(this, event, callback, selector)
	            })
	        }

	        $.fn.trigger = function(event, args){
	            event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
	            event._args = args
	            return this.each(function(){
	                // handle focus(), blur() by calling them directly
	                if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
	                // items in the collection might not be DOM elements
	                else if ('dispatchEvent' in this) this.dispatchEvent(event)
	                else $(this).triggerHandler(event, args)
	            })
	        }

	        // triggers event handlers on current element just as if an event occurred,
	        // doesn't trigger an actual event, doesn't bubble
	        $.fn.triggerHandler = function(event, args){
	            var e, result
	            this.each(function(i, element){
	                e = createProxy(isString(event) ? $.Event(event) : event)
	                e._args = args
	                e.target = element
	                $.each(findHandlers(element, event.type || event), function(i, handler){
	                    result = handler.proxy(e)
	                    if (e.isImmediatePropagationStopped()) return false
	                })
	            })
	            return result
	        }

	        // shortcut methods for `.bind(event, fn)` for each event type
	        ;('focusin focusout focus blur load resize scroll unload click dblclick '+
	        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
	        'change select keydown keypress keyup error').split(' ').forEach(function(event) {
	            $.fn[event] = function(callback) {
	                return (0 in arguments) ?
	                    this.bind(event, callback) :
	                    this.trigger(event)
	            }
	        })

	        $.Event = function(type, props) {
	            if (!isString(type)) props = type, type = props.type
	            var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
	            if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
	            event.initEvent(type, bubbles, true)
	            return compatible(event)
	        }

	    })(Zepto)

	    ;(function($){
	        var jsonpID = +new Date(),
	            document = window.document,
	            key,
	            name,
	            rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	            scriptTypeRE = /^(?:text|application)\/javascript/i,
	            xmlTypeRE = /^(?:text|application)\/xml/i,
	            jsonType = 'application/json',
	            htmlType = 'text/html',
	            blankRE = /^\s*$/,
	            originAnchor = document.createElement('a')

	        originAnchor.href = window.location.href

	        // trigger a custom event and return false if it was cancelled
	        function triggerAndReturn(context, eventName, data) {
	            var event = $.Event(eventName)
	            $(context).trigger(event, data)
	            return !event.isDefaultPrevented()
	        }

	        // trigger an Ajax "global" event
	        function triggerGlobal(settings, context, eventName, data) {
	            if (settings.global) return triggerAndReturn(context || document, eventName, data)
	        }

	        // Number of active Ajax requests
	        $.active = 0

	        function ajaxStart(settings) {
	            if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
	        }
	        function ajaxStop(settings) {
	            if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
	        }

	        // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	        function ajaxBeforeSend(xhr, settings) {
	            var context = settings.context
	            if (settings.beforeSend.call(context, xhr, settings) === false ||
	                triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
	                return false

	            triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
	        }
	        function ajaxSuccess(data, xhr, settings, deferred) {
	            var context = settings.context, status = 'success'
	            settings.success.call(context, data, status, xhr)
	            if (deferred) deferred.resolveWith(context, [data, status, xhr])
	            triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
	            ajaxComplete(status, xhr, settings)
	        }
	        // type: "timeout", "error", "abort", "parsererror"
	        function ajaxError(error, type, xhr, settings, deferred) {
	            var context = settings.context
	            settings.error.call(context, xhr, type, error)
	            if (deferred) deferred.rejectWith(context, [xhr, type, error])
	            triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
	            ajaxComplete(type, xhr, settings)
	        }
	        // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	        function ajaxComplete(status, xhr, settings) {
	            var context = settings.context
	            settings.complete.call(context, xhr, status)
	            triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
	            ajaxStop(settings)
	        }

	        function ajaxDataFilter(data, type, settings) {
	            if (settings.dataFilter == empty) return data
	            var context = settings.context
	            return settings.dataFilter.call(context, data, type)
	        }

	        // Empty function, used as default callback
	        function empty() {}

	        $.ajaxJSONP = function(options, deferred){
	            if (!('type' in options)) return $.ajax(options)

	            var _callbackName = options.jsonpCallback,
	                callbackName = ($.isFunction(_callbackName) ?
	                        _callbackName() : _callbackName) || ('Zepto' + (jsonpID++)),
	                script = document.createElement('script'),
	                originalCallback = window[callbackName],
	                responseData,
	                abort = function(errorType) {
	                    $(script).triggerHandler('error', errorType || 'abort')
	                },
	                xhr = { abort: abort }, abortTimeout

	            if (deferred) deferred.promise(xhr)

	            $(script).on('load error', function(e, errorType){
	                clearTimeout(abortTimeout)
	                $(script).off().remove()

	                if (e.type == 'error' || !responseData) {
	                    ajaxError(null, errorType || 'error', xhr, options, deferred)
	                } else {
	                    ajaxSuccess(responseData[0], xhr, options, deferred)
	                }

	                window[callbackName] = originalCallback
	                if (responseData && $.isFunction(originalCallback))
	                    originalCallback(responseData[0])

	                originalCallback = responseData = undefined
	            })

	            if (ajaxBeforeSend(xhr, options) === false) {
	                abort('abort')
	                return xhr
	            }

	            window[callbackName] = function(){
	                responseData = arguments
	            }

	            script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
	            document.head.appendChild(script)

	            if (options.timeout > 0) abortTimeout = setTimeout(function(){
	                abort('timeout')
	            }, options.timeout)

	            return xhr
	        }

	        $.ajaxSettings = {
	            // Default type of request
	            type: 'GET',
	            // Callback that is executed before request
	            beforeSend: empty,
	            // Callback that is executed if the request succeeds
	            success: empty,
	            // Callback that is executed the the server drops error
	            error: empty,
	            // Callback that is executed on request complete (both: error and success)
	            complete: empty,
	            // The context for the callbacks
	            context: null,
	            // Whether to trigger "global" Ajax events
	            global: true,
	            // Transport
	            xhr: function () {
	                return new window.XMLHttpRequest()
	            },
	            // MIME types mapping
	            // IIS returns Javascript as "application/x-javascript"
	            accepts: {
	                script: 'text/javascript, application/javascript, application/x-javascript',
	                json:   jsonType,
	                xml:    'application/xml, text/xml',
	                html:   htmlType,
	                text:   'text/plain'
	            },
	            // Whether the request is to another domain
	            crossDomain: false,
	            // Default timeout
	            timeout: 0,
	            // Whether data should be serialized to string
	            processData: true,
	            // Whether the browser should be allowed to cache GET responses
	            cache: true,
	            //Used to handle the raw response data of XMLHttpRequest.
	            //This is a pre-filtering function to sanitize the response.
	            //The sanitized response should be returned
	            dataFilter: empty
	        }

	        function mimeToDataType(mime) {
	            if (mime) mime = mime.split(';', 2)[0]
	            return mime && ( mime == htmlType ? 'html' :
	                    mime == jsonType ? 'json' :
	                        scriptTypeRE.test(mime) ? 'script' :
	                        xmlTypeRE.test(mime) && 'xml' ) || 'text'
	        }

	        function appendQuery(url, query) {
	            if (query == '') return url
	            return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	        }

	        // serialize payload and append it to the URL for GET requests
	        function serializeData(options) {
	            if (options.processData && options.data && $.type(options.data) != "string")
	                options.data = $.param(options.data, options.traditional)
	            if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType))
	                options.url = appendQuery(options.url, options.data), options.data = undefined
	        }

	        $.ajax = function(options){
	            var settings = $.extend({}, options || {}),
	                deferred = $.Deferred && $.Deferred(),
	                urlAnchor, hashIndex
	            for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

	            ajaxStart(settings)

	            if (!settings.crossDomain) {
	                urlAnchor = document.createElement('a')
	                urlAnchor.href = settings.url
	                // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
	                urlAnchor.href = urlAnchor.href
	                settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
	            }

	            if (!settings.url) settings.url = window.location.toString()
	            if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
	            serializeData(settings)

	            var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
	            if (hasPlaceholder) dataType = 'jsonp'

	            if (settings.cache === false || (
	                    (!options || options.cache !== true) &&
	                    ('script' == dataType || 'jsonp' == dataType)
	                ))
	                settings.url = appendQuery(settings.url, '_=' + Date.now())

	            if ('jsonp' == dataType) {
	                if (!hasPlaceholder)
	                    settings.url = appendQuery(settings.url,
	                        settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
	                return $.ajaxJSONP(settings, deferred)
	            }

	            var mime = settings.accepts[dataType],
	                headers = { },
	                setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
	                protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	                xhr = settings.xhr(),
	                nativeSetHeader = xhr.setRequestHeader,
	                abortTimeout

	            if (deferred) deferred.promise(xhr)

	            if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
	            setHeader('Accept', mime || '*/*')
	            if (mime = settings.mimeType || mime) {
	                if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
	                xhr.overrideMimeType && xhr.overrideMimeType(mime)
	            }
	            if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
	                setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

	            if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
	            xhr.setRequestHeader = setHeader

	            xhr.onreadystatechange = function(){
	                if (xhr.readyState == 4) {
	                    xhr.onreadystatechange = empty
	                    clearTimeout(abortTimeout)
	                    var result, error = false
	                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
	                        dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))

	                        if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
	                            result = xhr.response
	                        else {
	                            result = xhr.responseText

	                            try {
	                                // http://perfectionkills.com/global-eval-what-are-the-options/
	                                // sanitize response accordingly if data filter callback provided
	                                result = ajaxDataFilter(result, dataType, settings)
	                                if (dataType == 'script')    (1,eval)(result)
	                                else if (dataType == 'xml')  result = xhr.responseXML
	                                else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
	                            } catch (e) { error = e }

	                            if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred)
	                        }

	                        ajaxSuccess(result, xhr, settings, deferred)
	                    } else {
	                        ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
	                    }
	                }
	            }

	            if (ajaxBeforeSend(xhr, settings) === false) {
	                xhr.abort()
	                ajaxError(null, 'abort', xhr, settings, deferred)
	                return xhr
	            }

	            var async = 'async' in settings ? settings.async : true
	            xhr.open(settings.type, settings.url, async, settings.username, settings.password)

	            if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

	            for (name in headers) nativeSetHeader.apply(xhr, headers[name])

	            if (settings.timeout > 0) abortTimeout = setTimeout(function(){
	                xhr.onreadystatechange = empty
	                xhr.abort()
	                ajaxError(null, 'timeout', xhr, settings, deferred)
	            }, settings.timeout)

	            // avoid sending empty string (#319)
	            xhr.send(settings.data ? settings.data : null)
	            return xhr
	        }

	        // handle optional data/success arguments
	        function parseArguments(url, data, success, dataType) {
	            if ($.isFunction(data)) dataType = success, success = data, data = undefined
	            if (!$.isFunction(success)) dataType = success, success = undefined
	            return {
	                url: url
	                , data: data
	                , success: success
	                , dataType: dataType
	            }
	        }

	        $.get = function(/* url, data, success, dataType */){
	            return $.ajax(parseArguments.apply(null, arguments))
	        }

	        $.post = function(/* url, data, success, dataType */){
	            var options = parseArguments.apply(null, arguments)
	            options.type = 'POST'
	            return $.ajax(options)
	        }

	        $.getJSON = function(/* url, data, success */){
	            var options = parseArguments.apply(null, arguments)
	            options.dataType = 'json'
	            return $.ajax(options)
	        }

	        $.fn.load = function(url, data, success){
	            if (!this.length) return this
	            var self = this, parts = url.split(/\s/), selector,
	                options = parseArguments(url, data, success),
	                callback = options.success
	            if (parts.length > 1) options.url = parts[0], selector = parts[1]
	            options.success = function(response){
	                self.html(selector ?
	                    $('<div>').html(response.replace(rscript, "")).find(selector)
	                    : response)
	                callback && callback.apply(self, arguments)
	            }
	            $.ajax(options)
	            return this
	        }

	        var escape = encodeURIComponent

	        function serialize(params, obj, traditional, scope){
	            var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
	            $.each(obj, function(key, value) {
	                type = $.type(value)
	                if (scope) key = traditional ? scope :
	                scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
	                // handle data in serializeArray() format
	                if (!scope && array) params.add(value.name, value.value)
	                // recurse into nested objects
	                else if (type == "array" || (!traditional && type == "object"))
	                    serialize(params, value, traditional, key)
	                else params.add(key, value)
	            })
	        }

	        $.param = function(obj, traditional){
	            var params = []
	            params.add = function(key, value) {
	                if ($.isFunction(value)) value = value()
	                if (value == null) value = ""
	                this.push(escape(key) + '=' + escape(value))
	            }
	            serialize(params, obj, traditional)
	            return params.join('&').replace(/%20/g, '+')
	        }
	    })(Zepto)

	    ;(function($){
	        $.fn.serializeArray = function() {
	            var name, type, result = [],
	                add = function(value) {
	                    if (value.forEach) return value.forEach(add)
	                    result.push({ name: name, value: value })
	                }
	            if (this[0]) $.each(this[0].elements, function(_, field){
	                type = field.type, name = field.name
	                if (name && field.nodeName.toLowerCase() != 'fieldset' &&
	                    !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
	                    ((type != 'radio' && type != 'checkbox') || field.checked))
	                    add($(field).val())
	            })
	            return result
	        }

	        $.fn.serialize = function(){
	            var result = []
	            this.serializeArray().forEach(function(elm){
	                result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
	            })
	            return result.join('&')
	        }

	        $.fn.submit = function(callback) {
	            if (0 in arguments) this.bind('submit', callback)
	            else if (this.length) {
	                var event = $.Event('submit')
	                this.eq(0).trigger(event)
	                if (!event.isDefaultPrevented()) this.get(0).submit()
	            }
	            return this
	        }

	    })(Zepto)

	    ;(function(){
	        // getComputedStyle shouldn't freak out when called
	        // without a valid element as argument
	        try {
	            getComputedStyle(undefined)
	        } catch(e) {
	            var nativeGetComputedStyle = getComputedStyle
	            window.getComputedStyle = function(element, pseudoElement){
	                try {
	                    return nativeGetComputedStyle(element, pseudoElement)
	                } catch(e) {
	                    return null
	                }
	            }
	        }
	    })()
	    return Zepto
	}))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;!function(e){if(true)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ejs=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	/*
	 * EJS Embedded JavaScript templates
	 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *         http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	*/

	'use strict';

	/**
	 * @file Embedded JavaScript templating engine.
	 * @author Matthew Eernisse <mde@fleegix.org>
	 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
	 * @project EJS
	 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
	 */

	/**
	 * EJS internal functions.
	 *
	 * Technically this "module" lies in the same file as {@link module:ejs}, for
	 * the sake of organization all the private functions re grouped into this
	 * module.
	 *
	 * @module ejs-internal
	 * @private
	 */

	/**
	 * Embedded JavaScript templating engine.
	 *
	 * @module ejs
	 * @public
	 */

	var fs = require('fs');
	var path = require('path');
	var utils = require('./utils');

	var scopeOptionWarned = false;
	var _VERSION_STRING = require('../package.json').version;
	var _DEFAULT_DELIMITER = '%';
	var _DEFAULT_LOCALS_NAME = 'locals';
	var _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';
	var _OPTS = [ 'cache', 'filename', 'delimiter', 'scope', 'context',
	        'debug', 'compileDebug', 'client', '_with', 'root', 'rmWhitespace',
	        'strict', 'localsName'];
	var _TRAILING_SEMCOL = /;\s*$/;
	var _BOM = /^\uFEFF/;

	/**
	 * EJS template function cache. This can be a LRU object from lru-cache NPM
	 * module. By default, it is {@link module:utils.cache}, a simple in-process
	 * cache that grows continuously.
	 *
	 * @type {Cache}
	 */

	exports.cache = utils.cache;

	/**
	 * Name of the object containing the locals.
	 *
	 * This variable is overriden by {@link Options}`.localsName` if it is not
	 * `undefined`.
	 *
	 * @type {String}
	 * @public
	 */

	exports.localsName = _DEFAULT_LOCALS_NAME;

	/**
	 * Get the path to the included file from the parent file path and the
	 * specified path.
	 *
	 * @param {String}  name     specified path
	 * @param {String}  filename parent file path
	 * @param {Boolean} isDir    parent file path whether is directory
	 * @return {String}
	 */
	exports.resolveInclude = function(name, filename, isDir) {
	  var dirname = path.dirname;
	  var extname = path.extname;
	  var resolve = path.resolve;
	  var includePath = resolve(isDir ? filename : dirname(filename), name);
	  var ext = extname(name);
	  if (!ext) {
	    includePath += '.ejs';
	  }
	  return includePath;
	};

	/**
	 * Get the path to the included file by Options
	 * 
	 * @param  {String}  path    specified path
	 * @param  {Options} options compilation options
	 * @return {String}
	 */
	function getIncludePath(path, options){
	  var includePath;
	  if (path.charAt(0) == '/') {
	    includePath = exports.resolveInclude(path.replace(/^\/*/,''), options.root || '/', true);
	  }
	  else {
	    if (!options.filename) {
	      throw new Error('`include` use relative path requires the \'filename\' option.');
	    }
	    includePath = exports.resolveInclude(path, options.filename);  
	  }
	  return includePath;
	}

	/**
	 * Get the template from a string or a file, either compiled on-the-fly or
	 * read from cache (if enabled), and cache the template if needed.
	 *
	 * If `template` is not set, the file specified in `options.filename` will be
	 * read.
	 *
	 * If `options.cache` is true, this function reads the file from
	 * `options.filename` so it must be set prior to calling this function.
	 *
	 * @memberof module:ejs-internal
	 * @param {Options} options   compilation options
	 * @param {String} [template] template source
	 * @return {(TemplateFunction|ClientFunction)}
	 * Depending on the value of `options.client`, either type might be returned.
	 * @static
	 */

	function handleCache(options, template) {
	  var func;
	  var filename = options.filename;
	  var hasTemplate = arguments.length > 1;

	  if (options.cache) {
	    if (!filename) {
	      throw new Error('cache option requires a filename');
	    }
	    func = exports.cache.get(filename);
	    if (func) {
	      return func;
	    }
	    if (!hasTemplate) {
	      template = fs.readFileSync(filename).toString().replace(_BOM, '');
	    }
	  }
	  else if (!hasTemplate) {
	    // istanbul ignore if: should not happen at all
	    if (!filename) {
	      throw new Error('Internal EJS error: no file name or template '
	                    + 'provided');
	    }
	    template = fs.readFileSync(filename).toString().replace(_BOM, '');
	  }
	  func = exports.compile(template, options);
	  if (options.cache) {
	    exports.cache.set(filename, func);
	  }
	  return func;
	}

	/**
	 * Get the template function.
	 *
	 * If `options.cache` is `true`, then the template is cached.
	 *
	 * @memberof module:ejs-internal
	 * @param {String}  path    path for the specified file
	 * @param {Options} options compilation options
	 * @return {(TemplateFunction|ClientFunction)}
	 * Depending on the value of `options.client`, either type might be returned
	 * @static
	 */

	function includeFile(path, options) {
	  var opts = utils.shallowCopy({}, options);
	  opts.filename = getIncludePath(path, opts);
	  return handleCache(opts);
	}

	/**
	 * Get the JavaScript source of an included file.
	 *
	 * @memberof module:ejs-internal
	 * @param {String}  path    path for the specified file
	 * @param {Options} options compilation options
	 * @return {Object}
	 * @static
	 */

	function includeSource(path, options) {
	  var opts = utils.shallowCopy({}, options);
	  var includePath;
	  var template;
	  includePath = getIncludePath(path,opts);
	  template = fs.readFileSync(includePath).toString().replace(_BOM, '');
	  opts.filename = includePath;
	  var templ = new Template(template, opts);
	  templ.generateSource();
	  return {
	    source: templ.source,
	    filename: includePath,
	    template: template
	  };
	}

	/**
	 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
	 * `lineno`.
	 *
	 * @implements RethrowCallback
	 * @memberof module:ejs-internal
	 * @param {Error}  err      Error object
	 * @param {String} str      EJS source
	 * @param {String} filename file name of the EJS file
	 * @param {String} lineno   line number of the error
	 * @static
	 */

	function rethrow(err, str, filename, lineno){
	  var lines = str.split('\n');
	  var start = Math.max(lineno - 3, 0);
	  var end = Math.min(lines.length, lineno + 3);
	  // Error context
	  var context = lines.slice(start, end).map(function (line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? ' >> ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'ejs') + ':'
	    + lineno + '\n'
	    + context + '\n\n'
	    + err.message;

	  throw err;
	}

	/**
	 * Copy properties in data object that are recognized as options to an
	 * options object.
	 *
	 * This is used for compatibility with earlier versions of EJS and Express.js.
	 *
	 * @memberof module:ejs-internal
	 * @param {Object}  data data object
	 * @param {Options} opts options object
	 * @static
	 */

	function cpOptsInData(data, opts) {
	  _OPTS.forEach(function (p) {
	    if (typeof data[p] != 'undefined') {
	      opts[p] = data[p];
	    }
	  });
	}

	/**
	 * Compile the given `str` of ejs into a template function.
	 *
	 * @param {String}  template EJS template
	 *
	 * @param {Options} opts     compilation options
	 *
	 * @return {(TemplateFunction|ClientFunction)}
	 * Depending on the value of `opts.client`, either type might be returned.
	 * @public
	 */

	exports.compile = function compile(template, opts) {
	  var templ;

	  // v1 compat
	  // 'scope' is 'context'
	  // FIXME: Remove this in a future version
	  if (opts && opts.scope) {
	    if (!scopeOptionWarned){
	      console.warn('`scope` option is deprecated and will be removed in EJS 3');
	      scopeOptionWarned = true;
	    }
	    if (!opts.context) {
	      opts.context = opts.scope;
	    }
	    delete opts.scope;
	  }
	  templ = new Template(template, opts);
	  return templ.compile();
	};

	/**
	 * Render the given `template` of ejs.
	 *
	 * If you would like to include options but not data, you need to explicitly
	 * call this function with `data` being an empty object or `null`.
	 *
	 * @param {String}   template EJS template
	 * @param {Object}  [data={}] template data
	 * @param {Options} [opts={}] compilation and rendering options
	 * @return {String}
	 * @public
	 */

	exports.render = function (template, d, o) {
	  var data = d || {};
	  var opts = o || {};

	  // No options object -- if there are optiony names
	  // in the data, copy them to options
	  if (arguments.length == 2) {
	    cpOptsInData(data, opts);
	  }

	  return handleCache(opts, template)(data);
	};

	/**
	 * Render an EJS file at the given `path` and callback `cb(err, str)`.
	 *
	 * If you would like to include options but not data, you need to explicitly
	 * call this function with `data` being an empty object or `null`.
	 *
	 * @param {String}             path     path to the EJS file
	 * @param {Object}            [data={}] template data
	 * @param {Options}           [opts={}] compilation and rendering options
	 * @param {RenderFileCallback} cb callback
	 * @public
	 */

	exports.renderFile = function () {
	  var args = Array.prototype.slice.call(arguments);
	  var filename = args.shift();
	  var cb = args.pop();
	  var data = args.shift() || {};
	  var opts = args.pop() || {};
	  var result;

	  // Don't pollute passed in opts obj with new vals
	  opts = utils.shallowCopy({}, opts);

	  // No options object -- if there are optiony names
	  // in the data, copy them to options
	  if (arguments.length == 3) {
	    // Express 4
	    if (data.settings && data.settings['view options']) {
	      cpOptsInData(data.settings['view options'], opts);
	    }
	    // Express 3 and lower
	    else {
	      cpOptsInData(data, opts);
	    }
	  }
	  opts.filename = filename;

	  try {
	    result = handleCache(opts)(data);
	  }
	  catch(err) {
	    return cb(err);
	  }
	  return cb(null, result);
	};

	/**
	 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
	 * @public
	 */

	exports.clearCache = function () {
	  exports.cache.reset();
	};

	function Template(text, opts) {
	  opts = opts || {};
	  var options = {};
	  this.templateText = text;
	  this.mode = null;
	  this.truncate = false;
	  this.currentLine = 1;
	  this.source = '';
	  this.dependencies = [];
	  options.client = opts.client || false;
	  options.escapeFunction = opts.escape || utils.escapeXML;
	  options.compileDebug = opts.compileDebug !== false;
	  options.debug = !!opts.debug;
	  options.filename = opts.filename;
	  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
	  options.strict = opts.strict || false;
	  options.context = opts.context;
	  options.cache = opts.cache || false;
	  options.rmWhitespace = opts.rmWhitespace;
	  options.root = opts.root;
	  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;

	  if (options.strict) {
	    options._with = false;
	  }
	  else {
	    options._with = typeof opts._with != 'undefined' ? opts._with : true;
	  }

	  this.opts = options;

	  this.regex = this.createRegex();
	}

	Template.modes = {
	  EVAL: 'eval',
	  ESCAPED: 'escaped',
	  RAW: 'raw',
	  COMMENT: 'comment',
	  LITERAL: 'literal'
	};

	Template.prototype = {
	  createRegex: function () {
	    var str = _REGEX_STRING;
	    var delim = utils.escapeRegExpChars(this.opts.delimiter);
	    str = str.replace(/%/g, delim);
	    return new RegExp(str);
	  },

	  compile: function () {
	    var src;
	    var fn;
	    var opts = this.opts;
	    var prepended = '';
	    var appended = '';
	    var escape = opts.escapeFunction;

	    if (!this.source) {
	      this.generateSource();
	      prepended += '  var __output = [], __append = __output.push.bind(__output);' + '\n';
	      if (opts._with !== false) {
	        prepended +=  '  with (' + opts.localsName + ' || {}) {' + '\n';
	        appended += '  }' + '\n';
	      }
	      appended += '  return __output.join("");' + '\n';
	      this.source = prepended + this.source + appended;
	    }

	    if (opts.compileDebug) {
	      src = 'var __line = 1' + '\n'
	          + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
	          + '  , __filename = ' + (opts.filename ?
	                JSON.stringify(opts.filename) : 'undefined') + ';' + '\n'
	          + 'try {' + '\n'
	          + this.source
	          + '} catch (e) {' + '\n'
	          + '  rethrow(e, __lines, __filename, __line);' + '\n'
	          + '}' + '\n';
	    }
	    else {
	      src = this.source;
	    }

	    if (opts.debug) {
	      console.log(src);
	    }

	    if (opts.client) {
	      src = 'escape = escape || ' + escape.toString() + ';' + '\n' + src;
	      if (opts.compileDebug) {
	        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
	      }
	    }

	    if (opts.strict) {
	      src = '"use strict";\n' + src;
	    }

	    try {
	      fn = new Function(opts.localsName + ', escape, include, rethrow', src);
	    }
	    catch(e) {
	      // istanbul ignore else
	      if (e instanceof SyntaxError) {
	        if (opts.filename) {
	          e.message += ' in ' + opts.filename;
	        }
	        e.message += ' while compiling ejs';
	      }
	      throw e;
	    }

	    if (opts.client) {
	      fn.dependencies = this.dependencies;
	      return fn;
	    }

	    // Return a callable function which will execute the function
	    // created by the source-code, with the passed data as locals
	    // Adds a local `include` function which allows full recursive include
	    var returnedFn = function (data) {
	      var include = function (path, includeData) {
	        var d = utils.shallowCopy({}, data);
	        if (includeData) {
	          d = utils.shallowCopy(d, includeData);
	        }
	        return includeFile(path, opts)(d);
	      };
	      return fn.apply(opts.context, [data || {}, escape, include, rethrow]);
	    };
	    returnedFn.dependencies = this.dependencies;
	    return returnedFn;
	  },

	  generateSource: function () {
	    var opts = this.opts;

	    if (opts.rmWhitespace) {
	      // Have to use two separate replace here as `^` and `$` operators don't
	      // work well with `\r`.
	      this.templateText =
	        this.templateText.replace(/\r/g, '').replace(/^\s+|\s+$/gm, '');
	    }

	    // Slurp spaces and tabs before <%_ and after _%>
	    this.templateText =
	      this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

	    var self = this;
	    var matches = this.parseTemplateText();
	    var d = this.opts.delimiter;

	    if (matches && matches.length) {
	      matches.forEach(function (line, index) {
	        var opening;
	        var closing;
	        var include;
	        var includeOpts;
	        var includeObj;
	        var includeSrc;
	        // If this is an opening tag, check for closing tags
	        // FIXME: May end up with some false positives here
	        // Better to store modes as k/v with '<' + delimiter as key
	        // Then this can simply check against the map
	        if ( line.indexOf('<' + d) === 0        // If it is a tag
	          && line.indexOf('<' + d + d) !== 0) { // and is not escaped
	          closing = matches[index + 2];
	          if (!(closing == d + '>' || closing == '-' + d + '>' || closing == '_' + d + '>')) {
	            throw new Error('Could not find matching close tag for "' + line + '".');
	          }
	        }
	        // HACK: backward-compat `include` preprocessor directives
	        if ((include = line.match(/^\s*include\s+(\S+)/))) {
	          opening = matches[index - 1];
	          // Must be in EVAL or RAW mode
	          if (opening && (opening == '<' + d || opening == '<' + d + '-' || opening == '<' + d + '_')) {
	            includeOpts = utils.shallowCopy({}, self.opts);
	            includeObj = includeSource(include[1], includeOpts);
	            if (self.opts.compileDebug) {
	              includeSrc =
	                  '    ; (function(){' + '\n'
	                  + '      var __line = 1' + '\n'
	                  + '      , __lines = ' + JSON.stringify(includeObj.template) + '\n'
	                  + '      , __filename = ' + JSON.stringify(includeObj.filename) + ';' + '\n'
	                  + '      try {' + '\n'
	                  + includeObj.source
	                  + '      } catch (e) {' + '\n'
	                  + '        rethrow(e, __lines, __filename, __line);' + '\n'
	                  + '      }' + '\n'
	                  + '    ; }).call(this)' + '\n';
	            }else{
	              includeSrc = '    ; (function(){' + '\n' + includeObj.source +
	                  '    ; }).call(this)' + '\n';
	            }
	            self.source += includeSrc;
	            self.dependencies.push(exports.resolveInclude(include[1],
	                includeOpts.filename));
	            return;
	          }
	        }
	        self.scanLine(line);
	      });
	    }

	  },

	  parseTemplateText: function () {
	    var str = this.templateText;
	    var pat = this.regex;
	    var result = pat.exec(str);
	    var arr = [];
	    var firstPos;

	    while (result) {
	      firstPos = result.index;

	      if (firstPos !== 0) {
	        arr.push(str.substring(0, firstPos));
	        str = str.slice(firstPos);
	      }

	      arr.push(result[0]);
	      str = str.slice(result[0].length);
	      result = pat.exec(str);
	    }

	    if (str) {
	      arr.push(str);
	    }

	    return arr;
	  },

	  scanLine: function (line) {
	    var self = this;
	    var d = this.opts.delimiter;
	    var newLineCount = 0;

	    function _addOutput() {
	      if (self.truncate) {
	        // Only replace single leading linebreak in the line after
	        // -%> tag -- this is the single, trailing linebreak
	        // after the tag that the truncation mode replaces
	        // Handle Win / Unix / old Mac linebreaks -- do the \r\n
	        // combo first in the regex-or
	        line = line.replace(/^(?:\r\n|\r|\n)/, '');
	        self.truncate = false;
	      }
	      else if (self.opts.rmWhitespace) {
	        // Gotta be more careful here.
	        // .replace(/^(\s*)\n/, '$1') might be more appropriate here but as
	        // rmWhitespace already removes trailing spaces anyway so meh.
	        line = line.replace(/^\n/, '');
	      }
	      if (!line) {
	        return;
	      }

	      // Preserve literal slashes
	      line = line.replace(/\\/g, '\\\\');

	      // Convert linebreaks
	      line = line.replace(/\n/g, '\\n');
	      line = line.replace(/\r/g, '\\r');

	      // Escape double-quotes
	      // - this will be the delimiter during execution
	      line = line.replace(/"/g, '\\"');
	      self.source += '    ; __append("' + line + '")' + '\n';
	    }

	    newLineCount = (line.split('\n').length - 1);

	    switch (line) {
	      case '<' + d:
	      case '<' + d + '_':
	        this.mode = Template.modes.EVAL;
	        break;
	      case '<' + d + '=':
	        this.mode = Template.modes.ESCAPED;
	        break;
	      case '<' + d + '-':
	        this.mode = Template.modes.RAW;
	        break;
	      case '<' + d + '#':
	        this.mode = Template.modes.COMMENT;
	        break;
	      case '<' + d + d:
	        this.mode = Template.modes.LITERAL;
	        this.source += '    ; __append("' + line.replace('<' + d + d, '<' + d) + '")' + '\n';
	        break;
	      case d + d + '>':
	        this.mode = Template.modes.LITERAL;
	        this.source += '    ; __append("' + line.replace(d + d + '>', d + '>') + '")' + '\n';
	        break;
	      case d + '>':
	      case '-' + d + '>':
	      case '_' + d + '>':
	        if (this.mode == Template.modes.LITERAL) {
	          _addOutput();
	        }

	        this.mode = null;
	        this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
	        break;
	      default:
	        // In script mode, depends on type of tag
	        if (this.mode) {
	          // If '//' is found without a line break, add a line break.
	          switch (this.mode) {
	            case Template.modes.EVAL:
	            case Template.modes.ESCAPED:
	            case Template.modes.RAW:
	              if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
	                line += '\n';
	              }
	          }
	          switch (this.mode) {
	            // Just executing code
	            case Template.modes.EVAL:
	              this.source += '    ; ' + line + '\n';
	              break;
	            // Exec, esc, and output
	            case Template.modes.ESCAPED:
	              this.source += '    ; __append(escape(' +
	                line.replace(_TRAILING_SEMCOL, '').trim() + '))' + '\n';
	              break;
	            // Exec and output
	            case Template.modes.RAW:
	              this.source += '    ; __append(' +
	                line.replace(_TRAILING_SEMCOL, '').trim() + ')' + '\n';
	              break;
	            case Template.modes.COMMENT:
	              // Do nothing
	              break;
	            // Literal <%% mode, append as raw output
	            case Template.modes.LITERAL:
	              _addOutput();
	              break;
	          }
	        }
	        // In string mode, just add the output
	        else {
	          _addOutput();
	        }
	    }

	    if (self.opts.compileDebug && newLineCount) {
	      this.currentLine += newLineCount;
	      this.source += '    ; __line = ' + this.currentLine + '\n';
	    }
	  }
	};

	/**
	 * Escape characters reserved in XML.
	 *
	 * This is simply an export of {@link module:utils.escapeXML}.
	 *
	 * If `markup` is `undefined` or `null`, the empty string is returned.
	 *
	 * @param {String} markup Input string
	 * @return {String} Escaped string
	 * @public
	 * @func
	 * */
	exports.escapeXML = utils.escapeXML;

	/**
	 * Express.js support.
	 *
	 * This is an alias for {@link module:ejs.renderFile}, in order to support
	 * Express.js out-of-the-box.
	 *
	 * @func
	 */

	exports.__express = exports.renderFile;

	// Add require support
	/* istanbul ignore else */
	if (require.extensions) {
	  require.extensions['.ejs'] = function (module, flnm) {
	    var filename = flnm || /* istanbul ignore next */ module.filename;
	    var options = {
	          filename: filename,
	          client: true
	        };
	    var template = fs.readFileSync(filename).toString();
	    var fn = exports.compile(template, options);
	    module._compile('module.exports = ' + fn.toString() + ';', filename);
	  };
	}

	/**
	 * Version of EJS.
	 *
	 * @readonly
	 * @type {String}
	 * @public
	 */

	exports.VERSION = _VERSION_STRING;

	/* istanbul ignore if */
	if (typeof window != 'undefined') {
	  window.ejs = exports;
	}

	},{"../package.json":6,"./utils":2,"fs":3,"path":4}],2:[function(require,module,exports){
	/*
	 * EJS Embedded JavaScript templates
	 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *         http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	*/

	/**
	 * Private utility functions
	 * @module utils
	 * @private
	 */

	'use strict';

	var regExpChars = /[|\\{}()[\]^$+*?.]/g;

	/**
	 * Escape characters reserved in regular expressions.
	 *
	 * If `string` is `undefined` or `null`, the empty string is returned.
	 *
	 * @param {String} string Input string
	 * @return {String} Escaped string
	 * @static
	 * @private
	 */
	exports.escapeRegExpChars = function (string) {
	  // istanbul ignore if
	  if (!string) {
	    return '';
	  }
	  return String(string).replace(regExpChars, '\\$&');
	};

	var _ENCODE_HTML_RULES = {
	      '&': '&amp;'
	    , '<': '&lt;'
	    , '>': '&gt;'
	    , '"': '&#34;'
	    , "'": '&#39;'
	    }
	  , _MATCH_HTML = /[&<>\'"]/g;

	function encode_char(c) {
	  return _ENCODE_HTML_RULES[c] || c;
	};

	/**
	 * Stringified version of constants used by {@link module:utils.escapeXML}.
	 *
	 * It is used in the process of generating {@link ClientFunction}s.
	 *
	 * @readonly
	 * @type {String}
	 */

	var escapeFuncStr =
	  'var _ENCODE_HTML_RULES = {\n'
	+ '      "&": "&amp;"\n'
	+ '    , "<": "&lt;"\n'
	+ '    , ">": "&gt;"\n'
	+ '    , \'"\': "&#34;"\n'
	+ '    , "\'": "&#39;"\n'
	+ '    }\n'
	+ '  , _MATCH_HTML = /[&<>\'"]/g;\n'
	+ 'function encode_char(c) {\n'
	+ '  return _ENCODE_HTML_RULES[c] || c;\n'
	+ '};\n';

	/**
	 * Escape characters reserved in XML.
	 *
	 * If `markup` is `undefined` or `null`, the empty string is returned.
	 *
	 * @implements {EscapeCallback}
	 * @param {String} markup Input string
	 * @return {String} Escaped string
	 * @static
	 * @private
	 */

	exports.escapeXML = function (markup) {
	  return markup == undefined
	    ? ''
	    : String(markup)
	        .replace(_MATCH_HTML, encode_char);
	};
	exports.escapeXML.toString = function () {
	  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr
	};

	/**
	 * Copy all properties from one object to another, in a shallow fashion.
	 *
	 * @param  {Object} to   Destination object
	 * @param  {Object} from Source object
	 * @return {Object}      Destination object
	 * @static
	 * @private
	 */
	exports.shallowCopy = function (to, from) {
	  from = from || {};
	  for (var p in from) {
	    to[p] = from[p];
	  }
	  return to;
	};

	/**
	 * Simple in-process cache implementation. Does not implement limits of any
	 * sort.
	 *
	 * @implements Cache
	 * @static
	 * @private
	 */
	exports.cache = {
	  _data: {},
	  set: function (key, val) {
	    this._data[key] = val;
	  },
	  get: function (key) {
	    return this._data[key];
	  },
	  reset: function () {
	    this._data = {};
	  }
	};


	},{}],3:[function(require,module,exports){

	},{}],4:[function(require,module,exports){
	(function (process){
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	}).call(this,require('_process'))
	},{"_process":5}],5:[function(require,module,exports){
	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };

	},{}],6:[function(require,module,exports){
	module.exports={
	  "name": "ejs",
	  "description": "Embedded JavaScript templates",
	  "keywords": [
	    "template",
	    "engine",
	    "ejs"
	  ],
	  "version": "2.5.2",
	  "author": "Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",
	  "contributors": [
	    "Timothy Gu <timothygu99@gmail.com> (https://timothygu.github.io)"
	  ],
	  "license": "Apache-2.0",
	  "main": "./lib/ejs.js",
	  "repository": {
	    "type": "git",
	    "url": "git://github.com/mde/ejs.git"
	  },
	  "bugs": "https://github.com/mde/ejs/issues",
	  "homepage": "https://github.com/mde/ejs",
	  "dependencies": {},
	  "devDependencies": {
	    "browserify": "^13.0.1",
	    "eslint": "^3.0.0",
	    "istanbul": "~0.4.3",
	    "jake": "^8.0.0",
	    "jsdoc": "^3.4.0",
	    "lru-cache": "^4.0.1",
	    "mocha": "^3.0.2",
	    "rimraf": "^2.2.8",
	    "uglify-js": "^2.6.2"
	  },
	  "engines": {
	    "node": ">=0.10.0"
	  },
	  "scripts": {
	    "test": "mocha",
	    "coverage": "istanbul cover node_modules/mocha/bin/_mocha",
	    "doc": "rimraf out && jsdoc -c jsdoc.json lib/* docs/jsdoc/*",
	    "devdoc": "rimraf out && jsdoc -p -c jsdoc.json lib/* docs/jsdoc/*"
	  }
	}

	},{}]},{},[1])(1)
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	    /**
	     * local二次封装Storage,规范只能用于存储对象,如果要存储其他类型,先转换为对象类型。
	     */
	    local: {
	        get: function(key) {
	            return JSON.parse(window.localStorage.getItem('eux_' + key));
	        },
	        set: function(key, value) {
	            window.localStorage.setItem('eux_'+ key, JSON.stringify(value));
	        }
	    }
	}

/***/ }
/******/ ]);