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

	/// <reference path="./common.d.ts" />
	"use strict";
	var types = __webpack_require__(1);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(5);
	var History = __webpack_require__(6);
	var Clipboard = __webpack_require__(7);
	var history = History.createHistory();
	var success_1 = __webpack_require__(16);
	var error_1 = __webpack_require__(17);
	var new_organization_1 = __webpack_require__(18);
	var invite_1 = __webpack_require__(20);
	var access_tokens_1 = __webpack_require__(21);
	var authorized_1 = __webpack_require__(22);
	var registered_1 = __webpack_require__(23);
	var authorization_1 = __webpack_require__(24);
	var login_1 = __webpack_require__(25);
	var user_1 = __webpack_require__(26);
	var themes_1 = __webpack_require__(27);
	var head_1 = __webpack_require__(19);
	$.ajaxSetup({
	    headers: {
	        "X-Version": version,
	    },
	    xhrFields: {
	        withCredentials: true,
	    },
	});
	$(document).ajaxSend(function () {
	    if (head_1.global.head) {
	        head_1.global.head.setState({ requestCount: head_1.global.head.state.requestCount + 1 });
	    }
	    if (head_1.global.body) {
	        head_1.global.body.setState({ requestCount: head_1.global.body.state.requestCount + 1 });
	    }
	}).ajaxComplete(function () {
	    if (head_1.global.head) {
	        head_1.global.head.setState({ requestCount: head_1.global.head.state.requestCount - 1 });
	    }
	    if (head_1.global.body) {
	        head_1.global.body.setState({ requestCount: head_1.global.body.state.requestCount - 1 });
	    }
	}).ajaxError(function () {
	    if (head_1.global.head) {
	        head_1.global.head.showAlert(false, "something happens unexpectedly, see console to get more details.");
	    }
	});
	var clipboard = new Clipboard(".clip");
	clipboard.on("success", function (e) {
	    head_1.global.head.showAlert(true, "emails copied:" + e.text);
	});
	head_1.global.win = $(window);
	head_1.global.doc = $(document);
	head_1.global.win.scroll(function () {
	    if (head_1.global.scrolled && head_1.global.win.scrollTop() >= head_1.global.doc.height() - head_1.global.win.height()) {
	        head_1.global.scrolled();
	    }
	});
	socket.on(types.themePushEvents.themeCreated, function (theme) {
	    if (head_1.global.themeCreated) {
	        head_1.global.themeCreated(theme);
	    }
	});
	socket.on(types.themePushEvents.themeUpdated, function (theme) {
	    if (head_1.global.themeUpdated) {
	        head_1.global.themeUpdated(theme);
	    }
	});
	ReactDOM.render(React.createElement(common.Router, {history: history}, React.createElement(common.Route, {path: "/", component: themes_1.ThemesComponent}), React.createElement(common.Route, {path: "/themes.html", component: themes_1.ThemesComponent}), React.createElement(common.Route, {path: "/success.html", component: success_1.SuccessComponent}), React.createElement(common.Route, {path: "/error.html", component: error_1.ErrorComponent}), React.createElement(common.Route, {path: "/new_organization.html", component: new_organization_1.NewOrganizationComponent}), React.createElement(common.Route, {path: "/invite.html", component: invite_1.InviteComponent}), React.createElement(common.Route, {path: "/access_tokens.html", component: access_tokens_1.AccessTokensComponent}), React.createElement(common.Route, {path: "/authorized.html", component: authorized_1.AuthorizedComponent}), React.createElement(common.Route, {path: "/registered.html", component: registered_1.RegisteredComponent}), React.createElement(common.Route, {path: "/authorization.html", component: authorization_1.AuthorizationComponent}), React.createElement(common.Route, {path: "/login.html", component: login_1.LoginComponent}), React.createElement(common.Route, {path: "/user.html", component: user_1.UserComponent})), document.getElementById("container"));


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	exports.yes = "√";
	exports.no = "X";
	exports.responseType = stringEnumify({
	    json: "json",
	    others: "others",
	});
	exports.httpMethod = stringEnumify({
	    get: "get",
	    post: "post",
	    put: "put",
	    delete: "delete",
	});
	function stringEnumify(obj) {
	    return obj;
	}
	exports.themeStatus = stringEnumify({
	    open: "open",
	    closed: "closed",
	});
	exports.themeOrder = stringEnumify({
	    newest: "newest",
	    recentlyUpdated: "recently updated",
	});
	exports.themePushEvents = stringEnumify({
	    themeCreated: "theme created",
	    themeUpdated: "theme updated",
	});
	exports.loginStatus = stringEnumify({
	    unknown: "unknown",
	    fail: "fail",
	    success: "success",
	});
	exports.environment = stringEnumify({
	    development: "development",
	    test: "test",
	    production: "production",
	});
	exports.scopeNames = stringEnumify({
	    readUser: "read:user",
	    writeUser: "write:user",
	    readOrganization: "read:organization",
	    writeOrganization: "write:organization",
	    readTheme: "read:theme",
	    writeTheme: "write:theme",
	    readApplication: "read:application",
	    writeApplication: "write:application",
	    deleteApplication: "delete:application",
	    readAccessToken: "read:access_token",
	    writeAccessToken: "write:access_token",
	    deleteAccessToken: "delete:access_token",
	});
	exports.oauthAuthorization = stringEnumify({
	    login: "login",
	    authorization: "authorization",
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./common.d.ts" />
	"use strict";
	function getUrlParameter(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    var array = window.location.search.substr(1).match(reg);
	    if (array && array.length >= 3) {
	        return decodeURI(array[2]);
	    }
	    return null;
	}
	exports.getUrlParameter = getUrlParameter;
	function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	        .toString(16)
	        .substring(1);
	}
	function guid() {
	    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
	}
	exports.guid = guid;
	function isEmail(s) {
	    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(s);
	}
	exports.isEmail = isEmail;
	exports.sessionStorageNames = {
	    loginResult: "loginResult",
	};
	exports.localStorageNames = {
	    lastSuccessfulEmailTime: "lastSuccessfulEmailTime",
	    lastOrganizationId: "lastOrganizationId",
	    lastLoginEmail: "lastLoginEmail",
	    lastLoginName: "lastLoginName",
	};
	exports.itemLimit = 10;
	exports.maxOrganizationNumberUserCanCreate = 3;
	function getFullUrl(avatar) {
	    return imageServerBaseUrl + "/" + avatar;
	}
	exports.getFullUrl = getFullUrl;
	function find(array, predicate) {
	    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
	        var a = array_1[_i];
	        if (predicate(a)) {
	            return a;
	        }
	    }
	    return null;
	}
	exports.find = find;
	function findIndex(array, predicate) {
	    for (var i = 0; i < array.length; i++) {
	        if (predicate(array[i])) {
	            return i;
	        }
	    }
	    return -1;
	}
	exports.findIndex = findIndex;
	_a = __webpack_require__(3), exports.match = _a.match, exports.RoutingContext = _a.RoutingContext, exports.Route = _a.Route, exports.Router = _a.Router, exports.Link = _a.Link;
	var _a;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = ReactRouter;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = History;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _clipboardAction = __webpack_require__(8);

	var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

	var _tinyEmitter = __webpack_require__(10);

	var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

	var _goodListener = __webpack_require__(11);

	var _goodListener2 = _interopRequireDefault(_goodListener);

	/**
	 * Base class which takes one or more elements, adds event listeners to them,
	 * and instantiates a new `ClipboardAction` on each click.
	 */

	var Clipboard = (function (_Emitter) {
	    _inherits(Clipboard, _Emitter);

	    /**
	     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
	     * @param {Object} options
	     */

	    function Clipboard(trigger, options) {
	        _classCallCheck(this, Clipboard);

	        _Emitter.call(this);

	        this.resolveOptions(options);
	        this.listenClick(trigger);
	    }

	    /**
	     * Helper function to retrieve attribute value.
	     * @param {String} suffix
	     * @param {Element} element
	     */

	    /**
	     * Defines if attributes would be resolved using internal setter functions
	     * or custom functions that were passed in the constructor.
	     * @param {Object} options
	     */

	    Clipboard.prototype.resolveOptions = function resolveOptions() {
	        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
	        this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
	        this.text = typeof options.text === 'function' ? options.text : this.defaultText;
	    };

	    /**
	     * Adds a click event listener to the passed trigger.
	     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
	     */

	    Clipboard.prototype.listenClick = function listenClick(trigger) {
	        var _this = this;

	        this.listener = _goodListener2['default'](trigger, 'click', function (e) {
	            return _this.onClick(e);
	        });
	    };

	    /**
	     * Defines a new `ClipboardAction` on each click event.
	     * @param {Event} e
	     */

	    Clipboard.prototype.onClick = function onClick(e) {
	        var trigger = e.delegateTarget || e.currentTarget;

	        if (this.clipboardAction) {
	            this.clipboardAction = null;
	        }

	        this.clipboardAction = new _clipboardAction2['default']({
	            action: this.action(trigger),
	            target: this.target(trigger),
	            text: this.text(trigger),
	            trigger: trigger,
	            emitter: this
	        });
	    };

	    /**
	     * Default `action` lookup function.
	     * @param {Element} trigger
	     */

	    Clipboard.prototype.defaultAction = function defaultAction(trigger) {
	        return getAttributeValue('action', trigger);
	    };

	    /**
	     * Default `target` lookup function.
	     * @param {Element} trigger
	     */

	    Clipboard.prototype.defaultTarget = function defaultTarget(trigger) {
	        var selector = getAttributeValue('target', trigger);

	        if (selector) {
	            return document.querySelector(selector);
	        }
	    };

	    /**
	     * Default `text` lookup function.
	     * @param {Element} trigger
	     */

	    Clipboard.prototype.defaultText = function defaultText(trigger) {
	        return getAttributeValue('text', trigger);
	    };

	    /**
	     * Destroy lifecycle.
	     */

	    Clipboard.prototype.destroy = function destroy() {
	        this.listener.destroy();

	        if (this.clipboardAction) {
	            this.clipboardAction.destroy();
	            this.clipboardAction = null;
	        }
	    };

	    return Clipboard;
	})(_tinyEmitter2['default']);

	function getAttributeValue(suffix, element) {
	    var attribute = 'data-clipboard-' + suffix;

	    if (!element.hasAttribute(attribute)) {
	        return;
	    }

	    return element.getAttribute(attribute);
	}

	exports['default'] = Clipboard;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _select = __webpack_require__(9);

	var _select2 = _interopRequireDefault(_select);

	/**
	 * Inner class which performs selection from either `text` or `target`
	 * properties and then executes copy or cut operations.
	 */

	var ClipboardAction = (function () {
	    /**
	     * @param {Object} options
	     */

	    function ClipboardAction(options) {
	        _classCallCheck(this, ClipboardAction);

	        this.resolveOptions(options);
	        this.initSelection();
	    }

	    /**
	     * Defines base properties passed from constructor.
	     * @param {Object} options
	     */

	    ClipboardAction.prototype.resolveOptions = function resolveOptions() {
	        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        this.action = options.action;
	        this.emitter = options.emitter;
	        this.target = options.target;
	        this.text = options.text;
	        this.trigger = options.trigger;

	        this.selectedText = '';
	    };

	    /**
	     * Decides which selection strategy is going to be applied based
	     * on the existence of `text` and `target` properties.
	     */

	    ClipboardAction.prototype.initSelection = function initSelection() {
	        if (this.text && this.target) {
	            throw new Error('Multiple attributes declared, use either "target" or "text"');
	        } else if (this.text) {
	            this.selectFake();
	        } else if (this.target) {
	            this.selectTarget();
	        } else {
	            throw new Error('Missing required attributes, use either "target" or "text"');
	        }
	    };

	    /**
	     * Creates a fake textarea element, sets its value from `text` property,
	     * and makes a selection on it.
	     */

	    ClipboardAction.prototype.selectFake = function selectFake() {
	        var _this = this;

	        this.removeFake();

	        this.fakeHandler = document.body.addEventListener('click', function () {
	            return _this.removeFake();
	        });

	        this.fakeElem = document.createElement('textarea');
	        this.fakeElem.style.position = 'absolute';
	        this.fakeElem.style.left = '-9999px';
	        this.fakeElem.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
	        this.fakeElem.setAttribute('readonly', '');
	        this.fakeElem.value = this.text;

	        document.body.appendChild(this.fakeElem);

	        this.selectedText = _select2['default'](this.fakeElem);
	        this.copyText();
	    };

	    /**
	     * Only removes the fake element after another click event, that way
	     * a user can hit `Ctrl+C` to copy because selection still exists.
	     */

	    ClipboardAction.prototype.removeFake = function removeFake() {
	        if (this.fakeHandler) {
	            document.body.removeEventListener('click');
	            this.fakeHandler = null;
	        }

	        if (this.fakeElem) {
	            document.body.removeChild(this.fakeElem);
	            this.fakeElem = null;
	        }
	    };

	    /**
	     * Selects the content from element passed on `target` property.
	     */

	    ClipboardAction.prototype.selectTarget = function selectTarget() {
	        this.selectedText = _select2['default'](this.target);
	        this.copyText();
	    };

	    /**
	     * Executes the copy operation based on the current selection.
	     */

	    ClipboardAction.prototype.copyText = function copyText() {
	        var succeeded = undefined;

	        try {
	            succeeded = document.execCommand(this.action);
	        } catch (err) {
	            succeeded = false;
	        }

	        this.handleResult(succeeded);
	    };

	    /**
	     * Fires an event based on the copy operation result.
	     * @param {Boolean} succeeded
	     */

	    ClipboardAction.prototype.handleResult = function handleResult(succeeded) {
	        if (succeeded) {
	            this.emitter.emit('success', {
	                action: this.action,
	                text: this.selectedText,
	                trigger: this.trigger,
	                clearSelection: this.clearSelection.bind(this)
	            });
	        } else {
	            this.emitter.emit('error', {
	                action: this.action,
	                trigger: this.trigger,
	                clearSelection: this.clearSelection.bind(this)
	            });
	        }
	    };

	    /**
	     * Removes current selection and focus from `target` element.
	     */

	    ClipboardAction.prototype.clearSelection = function clearSelection() {
	        if (this.target) {
	            this.target.blur();
	        }

	        window.getSelection().removeAllRanges();
	    };

	    /**
	     * Sets the `action` to be performed which can be either 'copy' or 'cut'.
	     * @param {String} action
	     */

	    /**
	     * Destroy lifecycle.
	     */

	    ClipboardAction.prototype.destroy = function destroy() {
	        this.removeFake();
	    };

	    _createClass(ClipboardAction, [{
	        key: 'action',
	        set: function set() {
	            var action = arguments.length <= 0 || arguments[0] === undefined ? 'copy' : arguments[0];

	            this._action = action;

	            if (this._action !== 'copy' && this._action !== 'cut') {
	                throw new Error('Invalid "action" value, use either "copy" or "cut"');
	            }
	        },

	        /**
	         * Gets the `action` property.
	         * @return {String}
	         */
	        get: function get() {
	            return this._action;
	        }

	        /**
	         * Sets the `target` property using an element
	         * that will be have its content copied.
	         * @param {Element} target
	         */
	    }, {
	        key: 'target',
	        set: function set(target) {
	            if (target !== undefined) {
	                if (target && typeof target === 'object' && target.nodeType === 1) {
	                    this._target = target;
	                } else {
	                    throw new Error('Invalid "target" value, use a valid Element');
	                }
	            }
	        },

	        /**
	         * Gets the `target` property.
	         * @return {String|HTMLElement}
	         */
	        get: function get() {
	            return this._target;
	        }
	    }]);

	    return ClipboardAction;
	})();

	exports['default'] = ClipboardAction;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	function select(element) {
	    var selectedText;

	    if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
	        element.focus();
	        element.setSelectionRange(0, element.value.length);

	        selectedText = element.value;
	    }
	    else {
	        if (element.hasAttribute('contenteditable')) {
	            element.focus();
	        }

	        var selection = window.getSelection();
	        var range = document.createRange();

	        range.selectNodeContents(element);
	        selection.removeAllRanges();
	        selection.addRange(range);

	        selectedText = selection.toString();
	    }

	    return selectedText;
	}

	module.exports = select;


/***/ },
/* 10 */
/***/ function(module, exports) {

	function E () {
		// Keep this empty so it's easier to inherit from
	  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	}

	E.prototype = {
		on: function (name, callback, ctx) {
	    var e = this.e || (this.e = {});

	    (e[name] || (e[name] = [])).push({
	      fn: callback,
	      ctx: ctx
	    });

	    return this;
	  },

	  once: function (name, callback, ctx) {
	    var self = this;
	    function listener () {
	      self.off(name, listener);
	      callback.apply(ctx, arguments);
	    };

	    listener._ = callback
	    return this.on(name, listener, ctx);
	  },

	  emit: function (name) {
	    var data = [].slice.call(arguments, 1);
	    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	    var i = 0;
	    var len = evtArr.length;

	    for (i; i < len; i++) {
	      evtArr[i].fn.apply(evtArr[i].ctx, data);
	    }

	    return this;
	  },

	  off: function (name, callback) {
	    var e = this.e || (this.e = {});
	    var evts = e[name];
	    var liveEvents = [];

	    if (evts && callback) {
	      for (var i = 0, len = evts.length; i < len; i++) {
	        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
	          liveEvents.push(evts[i]);
	      }
	    }

	    // Remove event from queue to prevent memory leak
	    // Suggested by https://github.com/lazd
	    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

	    (liveEvents.length)
	      ? e[name] = liveEvents
	      : delete e[name];

	    return this;
	  }
	};

	module.exports = E;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(12);
	var delegate = __webpack_require__(13);

	/**
	 * Validates all params and calls the right
	 * listener function based on its target type.
	 *
	 * @param {String|HTMLElement|HTMLCollection|NodeList} target
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listen(target, type, callback) {
	    if (!target && !type && !callback) {
	        throw new Error('Missing required arguments');
	    }

	    if (!is.string(type)) {
	        throw new TypeError('Second argument must be a String');
	    }

	    if (!is.function(callback)) {
	        throw new TypeError('Third argument must be a Function');
	    }

	    if (is.node(target)) {
	        return listenNode(target, type, callback);
	    }
	    else if (is.nodeList(target)) {
	        return listenNodeList(target, type, callback);
	    }
	    else if (is.string(target)) {
	        return listenSelector(target, type, callback);
	    }
	    else {
	        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
	    }
	}

	/**
	 * Adds an event listener to a HTML element
	 * and returns a remove listener function.
	 *
	 * @param {HTMLElement} node
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listenNode(node, type, callback) {
	    node.addEventListener(type, callback);

	    return {
	        destroy: function() {
	            node.removeEventListener(type, callback);
	        }
	    }
	}

	/**
	 * Add an event listener to a list of HTML elements
	 * and returns a remove listener function.
	 *
	 * @param {NodeList|HTMLCollection} nodeList
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listenNodeList(nodeList, type, callback) {
	    Array.prototype.forEach.call(nodeList, function(node) {
	        node.addEventListener(type, callback);
	    });

	    return {
	        destroy: function() {
	            Array.prototype.forEach.call(nodeList, function(node) {
	                node.removeEventListener(type, callback);
	            });
	        }
	    }
	}

	/**
	 * Add an event listener to a selector
	 * and returns a remove listener function.
	 *
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function listenSelector(selector, type, callback) {
	    return delegate(document.body, selector, type, callback);
	}

	module.exports = listen;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Check if argument is a HTML element.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.node = function(value) {
	    return value !== undefined
	        && value instanceof HTMLElement
	        && value.nodeType === 1;
	};

	/**
	 * Check if argument is a list of HTML elements.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.nodeList = function(value) {
	    var type = Object.prototype.toString.call(value);

	    return value !== undefined
	        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
	        && ('length' in value)
	        && (value.length === 0 || exports.node(value[0]));
	};

	/**
	 * Check if argument is a string.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.string = function(value) {
	    return typeof value === 'string'
	        || value instanceof String;
	};

	/**
	 * Check if argument is a function.
	 *
	 * @param {Object} value
	 * @return {Boolean}
	 */
	exports.function = function(value) {
	    var type = Object.prototype.toString.call(value);

	    return type === '[object Function]';
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var closest = __webpack_require__(14);

	/**
	 * Delegates event to a selector.
	 *
	 * @param {Element} element
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Object}
	 */
	function delegate(element, selector, type, callback) {
	    var listenerFn = listener.apply(this, arguments);

	    element.addEventListener(type, listenerFn);

	    return {
	        destroy: function() {
	            element.removeEventListener(type, listenerFn);
	        }
	    }
	}

	/**
	 * Finds closest match and invokes callback.
	 *
	 * @param {Element} element
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} callback
	 * @return {Function}
	 */
	function listener(element, selector, type, callback) {
	    return function(e) {
	        e.delegateTarget = closest(e.target, selector, true);

	        if (e.delegateTarget) {
	            callback.call(element, e);
	        }
	    }
	}

	module.exports = delegate;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var matches = __webpack_require__(15)

	module.exports = function (element, selector, checkYoSelf) {
	  var parent = checkYoSelf ? element : element.parentNode

	  while (parent && parent !== document) {
	    if (matches(parent, selector)) return parent;
	    parent = parent.parentNode
	  }
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	
	/**
	 * Element prototype.
	 */

	var proto = Element.prototype;

	/**
	 * Vendor function.
	 */

	var vendor = proto.matchesSelector
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	/**
	 * Expose `match()`.
	 */

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = el.parentNode.querySelectorAll(selector);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var types = __webpack_require__(1);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	var spec = {
	    getInitialState: function () {
	        var willClearPreviousStatus = common.getUrlParameter("clear_previous_status");
	        if (willClearPreviousStatus === types.yes) {
	            window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
	        }
	        var redirectUrl = common.getUrlParameter("redirect_url");
	        return {
	            redirectUrl: redirectUrl ? decodeURIComponent(redirectUrl) : "",
	        };
	    },
	    render: function () {
	        var self = this;
	        var redirectUrlView;
	        if (self.state.redirectUrl) {
	            redirectUrlView = (React.createElement("span", null, "or ", React.createElement("a", {href: self.state.redirectUrl, className: "alert-link"}, "Continue")));
	        }
	        return (React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-body"}, React.createElement("div", {className: "alert alert-success", role: "alert"}, "success! go to ", React.createElement(common.Link, {to: "/", className: "alert-link"}, "Home page"), " now.", redirectUrlView))))));
	    },
	};
	exports.SuccessComponent = React.createClass(spec);


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	var spec = {
	    getInitialState: function () {
	        return {
	            message: decodeURIComponent(common.getUrlParameter("message")),
	        };
	    },
	    render: function () {
	        var self = this;
	        return (React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-body"}, React.createElement("div", {className: "alert alert-danger", role: "alert"}, React.createElement("span", null, self.state.message), "go to ", React.createElement(common.Link, {to: "/", className: "alert-link"}, "Home page"), " now."))))));
	    },
	};
	exports.ErrorComponent = React.createClass(spec);


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var React = __webpack_require__(4);
	var spec = {
	    add: function () {
	        var self = this;
	        $.post(apiBaseUrl + "/api/organizations", {
	            organizationName: self.state.organizationName,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.setState({ createdOrganizationCount: head_1.global.head.state.createdOrganizationCount + 1 });
	                head_1.global.head.showAlert(true, "success");
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    organizationNameChanged: function (e) {
	        var self = this;
	        self.setState({ organizationName: e.target.value });
	    },
	    getInitialState: function () {
	        return {
	            organizationName: "",
	        };
	    },
	    render: function () {
	        var self = this;
	        var addView;
	        if (self.state.organizationName.trim()) {
	            addView = (React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.add}, "Add"));
	        }
	        else {
	            addView = (React.createElement("button", {type: "button", className: "btn btn-primary", disabled: true}, "Please input organization name"));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "New Organization"), React.createElement("div", {className: "panel-body"}, React.createElement("form", {className: "form-horizontal"}, React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-sm-2 control-label"}, "organization name: "), React.createElement("div", {className: "col-sm-4"}, React.createElement("input", {type: "text", className: "form-control", value: self.state.organizationName, onChange: self.organizationNameChanged})), React.createElement("div", {className: "col-sm-2"}, addView)))))))));
	    },
	};
	exports.NewOrganizationComponent = React.createClass(spec);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var types = __webpack_require__(1);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	function getCurrentUser(next) {
	    var loginResult = window.sessionStorage.getItem(common.sessionStorageNames.loginResult);
	    if (loginResult) {
	        var data = JSON.parse(loginResult);
	        next(data);
	    }
	    else {
	        $.ajax({
	            url: apiBaseUrl + "/api/user",
	            cache: false,
	        }).then(function (data) {
	            window.sessionStorage.setItem(common.sessionStorageNames.loginResult, JSON.stringify(data));
	            next(data);
	        });
	    }
	}
	exports.global = new Object();
	var timeoutId;
	var spec = {
	    exit: function () {
	        var self = this;
	        $.ajax({
	            type: "DELETE",
	            url: apiBaseUrl + "/api/user/logged_in",
	            cache: false,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                self.setState({
	                    loginStatus: types.loginStatus.fail,
	                    currentUserId: "",
	                    currentUserName: "",
	                    currentUserEmail: "",
	                    currentAvatar: "",
	                    createdOrganizationCount: common.maxOrganizationNumberUserCanCreate,
	                    joinedOrganizationCount: 0,
	                });
	                window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
	            }
	            else {
	                self.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    showAlert: function (isSuccess, message) {
	        var self = this;
	        self.setState({
	            alertIsSuccess: isSuccess,
	            alertMessage: message,
	            showAlertMessage: true,
	        });
	        if (timeoutId) {
	            clearTimeout(timeoutId);
	        }
	        timeoutId = setTimeout(function () {
	            self.setState({ showAlertMessage: false });
	            timeoutId = null;
	        }, 3000);
	    },
	    authenticate: function (next) {
	        var self = this;
	        getCurrentUser(function (data) {
	            if (data.isSuccess) {
	                self.setState({
	                    loginStatus: types.loginStatus.success,
	                    currentUserId: data.user.id,
	                    currentUserName: data.user.name,
	                    currentUserEmail: data.user.email,
	                    currentAvatar: common.getFullUrl(data.user.avatar),
	                    createdOrganizationCount: data.user.createdOrganizationCount,
	                    joinedOrganizationCount: data.user.joinedOrganizationCount,
	                });
	                window.localStorage.setItem(common.localStorageNames.lastLoginEmail, data.user.email);
	                window.localStorage.setItem(common.localStorageNames.lastLoginName, data.user.name);
	                next(null);
	            }
	            else {
	                self.setState({ loginStatus: types.loginStatus.fail });
	                next(new Error(data.errorMessage));
	            }
	        });
	    },
	    componentDidMount: function () {
	        var self = this;
	        exports.global.head = self;
	        $(document).ready(function () {
	            self.authenticate(function (error) {
	                if (error) {
	                    console.log(error);
	                }
	                if (exports.global.authenticated) {
	                    exports.global.authenticated(error);
	                }
	            });
	        });
	    },
	    componentWillUnmount: function () {
	        exports.global.head = undefined;
	        exports.global.authenticated = undefined;
	        clearTimeout(timeoutId);
	        timeoutId = null;
	    },
	    getInitialState: function () {
	        return {
	            loginStatus: types.loginStatus.unknown,
	            currentUserId: "",
	            currentUserName: "",
	            currentUserEmail: "",
	            currentAvatar: "",
	            createdOrganizationCount: common.maxOrganizationNumberUserCanCreate,
	            joinedOrganizationCount: 0,
	            requestCount: 0,
	            alertIsSuccess: true,
	            showAlertMessage: false,
	            alertMessage: "",
	        };
	    },
	    render: function () {
	        var self = this;
	        var createOrganizationView = (React.createElement("li", null, React.createElement(common.Link, {to: "/new_organization.html"}, "New Organization")));
	        var inviteView = (React.createElement("li", null, React.createElement(common.Link, {to: "/invite.html"}, "Invite")));
	        var registeredView = (React.createElement("li", null, React.createElement(common.Link, {to: "/registered.html"}, "Registered")));
	        var authorizedView = (React.createElement("li", null, React.createElement(common.Link, {to: "/authorized.html"}, "Authorized")));
	        var sccessTokenView = (React.createElement("li", null, React.createElement(common.Link, {to: "/access_tokens.html"}, "Access tokens")));
	        var logoutView;
	        if (self.state.loginStatus === types.loginStatus.success) {
	            logoutView = (React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: self.exit}, React.createElement("span", {className: "glyphicon glyphicon-log-out", "aria-hidden": "true"}))));
	        }
	        var loginView;
	        switch (self.state.loginStatus) {
	            case types.loginStatus.unknown:
	                loginView = (React.createElement("a", {href: "javascript:void(0)"}, React.createElement("span", {className: "glyphicon glyphicon-user head-icon"}), "  ", React.createElement("span", null, "Login now...")));
	                break;
	            case types.loginStatus.success:
	                loginView = (React.createElement(common.Link, {to: "/user.html"}, React.createElement("span", {className: "glyphicon glyphicon-user head-icon"}), "  ", React.createElement("span", null, self.state.currentUserName), React.createElement("span", {className: "glyphicon glyphicon-envelope head-icon"}), "  ", React.createElement("span", null, self.state.currentUserEmail), React.createElement("img", {src: self.state.currentAvatar, className: "head-avatar"})));
	                break;
	            case types.loginStatus.fail:
	                loginView = (React.createElement(common.Link, {to: "/login.html"}, React.createElement("span", {className: "glyphicon glyphicon-user head-icon"}), "  Login"));
	                break;
	            default:
	                break;
	        }
	        var loginWithGithubView;
	        if (self.state.loginStatus === types.loginStatus.fail) {
	            loginWithGithubView = (React.createElement("li", null, React.createElement("a", {href: apiBaseUrl + "/login_with_github"}, React.createElement("span", {className: "fa fa-github head-icon"}), "  Login with Github")));
	        }
	        var alertMessageView;
	        if (self.state.showAlertMessage) {
	            alertMessageView = (React.createElement("div", {className: "head-alert alert alert-" + (self.state.alertIsSuccess ? "success" : "danger"), role: "alert"}, self.state.alertMessage));
	        }
	        var waitView;
	        if (self.state.requestCount > 0) {
	            waitView = (React.createElement("div", {className: "head-wait"}, React.createElement("i", {className: "fa fa-spinner fa-pulse fa-5x"})));
	        }
	        return (React.createElement("header", {className: "navbar navbar-inverse", role: "banner"}, React.createElement("div", {className: "container-fluid"}, React.createElement("div", {className: "navbar-header"}, React.createElement("button", {type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar-collapse-1", "aria-expanded": "false"}, React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"})), React.createElement(common.Link, {className: "navbar-brand hidden-sm", to: "/"}, "Home")), React.createElement("div", {className: "collapse navbar-collapse", role: "navigation", id: "navbar-collapse-1"}, React.createElement("ul", {className: "nav navbar-nav"}, React.createElement("li", null, React.createElement(common.Link, {to: "/"}, "Themes")), createOrganizationView, inviteView, registeredView, authorizedView, sccessTokenView), React.createElement("ul", {className: "nav navbar-nav navbar-right"}, React.createElement("li", null, loginView), loginWithGithubView, logoutView))), alertMessageView, waitView));
	    },
	};
	exports.HeadComponent = React.createClass(spec);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	var spec = {
	    getOrganizationsCurrentUserCreated: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + "/api/user/created",
	            cache: false,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                self.setState({ organizationsCurrentUserCreated: data.organizations });
	                if (data.organizations.length > 0) {
	                    var lastOrganizationId_1 = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
	                    if (lastOrganizationId_1 && common.find(data.organizations, function (o) { return o.id === lastOrganizationId_1; })) {
	                        self.setState({ currentOrganizationId: lastOrganizationId_1 });
	                    }
	                    else {
	                        self.setState({ currentOrganizationId: data.organizations[0].id });
	                    }
	                }
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    invite: function (e) {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + "/api/users/" + self.state.email + "/joined/" + self.state.currentOrganizationId,
	            data: {},
	            cache: false,
	            type: "PUT",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    clickOrganization: function (organization) {
	        var self = this;
	        self.setState({ currentOrganizationId: organization.id });
	        window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
	    },
	    emailChanged: function (e) {
	        var self = this;
	        self.setState({ email: e.target.value });
	    },
	    componentDidMount: function () {
	        var self = this;
	        head_1.global.body = self;
	        self.getOrganizationsCurrentUserCreated();
	    },
	    componentWillUnmount: function () {
	        head_1.global.body = undefined;
	    },
	    getInitialState: function () {
	        return {
	            email: "",
	            organizationsCurrentUserCreated: [],
	            currentOrganizationId: "",
	            requestCount: 0,
	        };
	    },
	    render: function () {
	        var _this = this;
	        var self = this;
	        var inviteView;
	        if (common.isEmail(self.state.email.trim()) && self.state.requestCount === 0) {
	            inviteView = (React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.invite}, "Invite"));
	        }
	        else {
	            inviteView = (React.createElement("button", {type: "button", className: "btn btn-primary", disabled: true}, "Please input invitee's email"));
	        }
	        var organizationsView = self.state.organizationsCurrentUserCreated.map(function (organization) {
	            return (React.createElement("label", {className: "the-label " + (self.state.currentOrganizationId === organization.id ? "label-active" : ""), key: organization.id, onClick: self.clickOrganization.bind(_this, organization)}, organization.name));
	        });
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "Invite"), React.createElement("div", {className: "panel-body"}, React.createElement("form", {className: "form-horizontal"}, React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-12"}, organizationsView)), React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-sm-2 control-label"}, React.createElement("span", {className: "glyphicon glyphicon-envelope"})), React.createElement("div", {className: "col-sm-4"}, React.createElement("input", {type: "text", className: "form-control", onChange: self.emailChanged, value: self.state.email})), React.createElement("div", {className: "col-sm-2"}, inviteView)))))))));
	    },
	};
	exports.InviteComponent = React.createClass(spec);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var React = __webpack_require__(4);
	var spec = {
	    edit: function (accessToken) {
	        var self = this;
	        self.setState({
	            idInEditing: accessToken.id,
	            descriptionInEditing: accessToken.description,
	            scopesInEditing: accessToken.scopes.map(function (a) { return a.name; }),
	            newAccessToken: "",
	        });
	    },
	    get: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + "/api/user/access_tokens",
	            cache: false,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                for (var _i = 0, _a = data.accessTokens; _i < _a.length; _i++) {
	                    var token = _a[_i];
	                    token.lastUsed = token.lastUsed ? moment(token.lastUsed, moment.ISO_8601).fromNow() : "never used";
	                }
	                self.setState({ accessTokens: data.accessTokens });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    new: function () {
	        var self = this;
	        self.setState({
	            idInEditing: null,
	            descriptionInEditing: "",
	            scopesInEditing: [],
	            newAccessToken: "",
	        });
	    },
	    save: function () {
	        var self = this;
	        if (self.state.idInEditing) {
	            $.ajax({
	                url: apiBaseUrl + ("/api/user/access_tokens/" + self.state.idInEditing),
	                method: "PUT",
	                data: {
	                    description: self.state.descriptionInEditing,
	                    scopes: self.state.scopesInEditing,
	                },
	            }).then(function (data) {
	                if (data.isSuccess) {
	                    head_1.global.head.showAlert(true, "success");
	                    self.new();
	                    self.get();
	                }
	                else {
	                    head_1.global.head.showAlert(false, data.errorMessage);
	                }
	            });
	        }
	        else {
	            $.ajax({
	                url: apiBaseUrl + "/api/user/access_tokens",
	                method: "POST",
	                data: {
	                    description: self.state.descriptionInEditing,
	                    scopes: self.state.scopesInEditing,
	                },
	            }).then(function (data) {
	                if (data.isSuccess) {
	                    head_1.global.head.showAlert(true, "success");
	                    self.new();
	                    self.get();
	                    self.setState({ newAccessToken: data.accessToken });
	                }
	                else {
	                    head_1.global.head.showAlert(false, data.errorMessage);
	                }
	            });
	        }
	    },
	    remove: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + ("/api/user/access_tokens/" + self.state.idInEditing),
	            method: "DELETE",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	                self.new();
	                self.get();
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    regenerate: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + ("/api/user/access_tokens/" + self.state.idInEditing + "/value"),
	            method: "PUT",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	                self.new();
	                self.get();
	                self.setState({ newAccessToken: data.accessToken });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    descriptionInEditingChanged: function (e) {
	        var self = this;
	        self.setState({ descriptionInEditing: e.target.value });
	    },
	    scopesInEditingChanged: function (e) {
	        var self = this;
	        var value = e.target.value;
	        var index = self.state.scopesInEditing.indexOf(value);
	        if (index >= 0) {
	            self.setState({ scopesInEditing: self.state.scopesInEditing.splice(index, 1) });
	        }
	        else {
	            self.setState({ scopesInEditing: self.state.scopesInEditing.concat([value]) });
	        }
	    },
	    componentDidMount: function () {
	        var self = this;
	        self.get();
	        $.ajax({
	            url: apiBaseUrl + "/api/scopes",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                self.setState({ scopes: data.scopes });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    getInitialState: function () {
	        return {
	            accessTokens: [],
	            idInEditing: null,
	            descriptionInEditing: "",
	            scopes: [],
	            scopesInEditing: [],
	            newAccessToken: "",
	        };
	    },
	    render: function () {
	        var _this = this;
	        var self = this;
	        var accessTokensView = self.state.accessTokens.map(function (accessToken) {
	            var scopesView = accessToken.scopes.map(function (scope) {
	                return (React.createElement("span", {key: scope.name, className: "label label-success access-token-scope"}, scope.name));
	            });
	            return (React.createElement("tr", {key: accessToken.id}, React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: self.edit.bind(_this, accessToken)}, accessToken.description, "(last used: ", accessToken.lastUsed, ")"), React.createElement("p", null, "last used: ", accessToken.lastUsed, "•", scopesView))));
	        });
	        var scopesView = self.state.scopes.map(function (scope) {
	            var checked = self.state.scopesInEditing.indexOf(scope.name) >= 0;
	            return (React.createElement("label", {key: scope.name, className: "checkbox"}, React.createElement("input", {type: "checkbox", onChange: self.scopesInEditingChanged, value: scope.name, checked: checked}), scope.name, " : ", scope.description));
	        });
	        var newAccessTokenView;
	        if (self.state.newAccessToken) {
	            newAccessTokenView = (React.createElement("div", {className: "form-group"}, React.createElement("label", null, "new access token"), React.createElement("input", {type: "text", className: "form-control", value: self.state.newAccessToken, readOnly: true})));
	        }
	        var descriptionView = (React.createElement("div", {className: "form-group"}, React.createElement("label", {htmlFor: "description"}, "description"), React.createElement("input", {type: "text", className: "form-control", id: "description", onChange: self.descriptionInEditingChanged, value: self.state.descriptionInEditing})));
	        var accessTokenView;
	        if (self.state.idInEditing) {
	            accessTokenView = (React.createElement("form", {className: "form"}, React.createElement("button", {type: "button", className: "btn btn-default", onClick: self.new}, "New"), React.createElement("button", {type: "button", className: "btn btn-danger", onClick: self.regenerate}, "Regenerate access token"), newAccessTokenView, descriptionView, React.createElement("div", {className: "checkbox"}, scopesView), React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.save}, "Update"), React.createElement("button", {type: "button", className: "btn btn-danger", onClick: self.remove}, "Delete")));
	        }
	        else {
	            accessTokenView = (React.createElement("form", {className: "form"}, newAccessTokenView, descriptionView, React.createElement("div", {className: "checkbox"}, scopesView), React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.save}, "Create")));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "Access tokens"), React.createElement("div", {className: "panel-body"}, React.createElement("form", {className: "form"}, React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-12"}, React.createElement("table", {className: "table"}, React.createElement("tbody", null, accessTokensView))))), accessTokenView))))));
	    },
	};
	exports.AccessTokensComponent = React.createClass(spec);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var React = __webpack_require__(4);
	var spec = {
	    show: function (application) {
	        var self = this;
	        self.state.application = application;
	    },
	    get: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + "/api/user/authorized",
	            cache: false,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                for (var _i = 0, _a = data.applications; _i < _a.length; _i++) {
	                    var application = _a[_i];
	                    application.lastUsed = application.lastUsed ? moment(application.lastUsed, moment.ISO_8601).fromNow() : "never used";
	                }
	                self.setState({ applications: data.applications });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    revoke: function (application) {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + ("/api/user/authorized/" + application.id),
	            method: "DELETE",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	                self.setState({ application: null });
	                self.get();
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    componentDidMount: function () {
	        var self = this;
	        self.get();
	    },
	    getInitialState: function () {
	        return {
	            applications: [],
	            application: null,
	        };
	    },
	    render: function () {
	        var _this = this;
	        var self = this;
	        var applicationsView = self.state.applications.map(function (application) {
	            return (React.createElement("tr", {key: application.id}, React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: self.show.bind(_this, application)}, application.name), React.createElement("p", null, "owned by: ", application.creator.name, "•" + ' ' + "last used: ", application.lastUsed)), React.createElement("td", {className: "authorized-application"}, React.createElement("button", {type: "button", className: "btn btn-danger", onClick: self.revoke.bind(_this, application)}, "Revoke"))));
	        });
	        var applicationView;
	        if (self.state.application) {
	            var scopesView = self.state.application.scopes.map(function (scope) {
	                return (React.createElement("tr", {key: scope.name}, React.createElement("td", null, scope.name), React.createElement("td", null, scope.description)));
	            });
	            applicationView = (React.createElement("form", {className: "form"}, React.createElement("div", {className: "form-group"}, React.createElement("label", null, "name"), React.createElement("input", {type: "text", className: "form-control", readOnly: true, value: self.state.application.name})), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "home url"), React.createElement("input", {type: "text", className: "form-control", readOnly: true, value: self.state.application.homeUrl})), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "description"), React.createElement("input", {type: "text", className: "form-control", readOnly: true, value: self.state.application.description})), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "scopes"), React.createElement("table", null, React.createElement("tbody", null, scopesView)))));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "Authorized applications"), React.createElement("div", {className: "panel-body"}, React.createElement("form", {className: "form"}, React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-12"}, React.createElement("table", {className: "table"}, React.createElement("tbody", null, applicationsView))))), applicationView))))));
	    },
	};
	exports.AuthorizedComponent = React.createClass(spec);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var React = __webpack_require__(4);
	var spec = {
	    edit: function (application) {
	        var self = this;
	        self.setState({
	            idInEditing: application.id,
	            nameInEditing: application.name,
	            homeUrlInEditing: application.homeUrl,
	            descriptionInEditing: application.description,
	            authorizationCallbackUrlInEditing: application.authorizationCallbackUrl,
	            clientSecretInEditing: application.clientSecret,
	        });
	    },
	    get: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + "/api/user/registered",
	            cache: false,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                self.setState({ applications: data.applications });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    new: function () {
	        var self = this;
	        self.setState({
	            idInEditing: null,
	            nameInEditing: "",
	            homeUrlInEditing: "",
	            descriptionInEditing: "",
	            authorizationCallbackUrlInEditing: "",
	            clientSecretInEditing: "",
	        });
	    },
	    save: function () {
	        var self = this;
	        if (self.state.idInEditing) {
	            $.ajax({
	                url: apiBaseUrl + ("/api/user/registered/" + self.state.idInEditing),
	                method: "PUT",
	                data: {
	                    name: self.state.nameInEditing,
	                    homeUrl: self.state.homeUrlInEditing,
	                    description: self.state.descriptionInEditing,
	                    authorizationCallbackUrl: self.state.authorizationCallbackUrlInEditing,
	                },
	            }).then(function (data) {
	                if (data.isSuccess) {
	                    head_1.global.head.showAlert(true, "success");
	                    self.new();
	                    self.get();
	                }
	                else {
	                    head_1.global.head.showAlert(false, data.errorMessage);
	                }
	            });
	        }
	        else {
	            $.ajax({
	                url: apiBaseUrl + "/api/user/registered",
	                method: "POST",
	                data: {
	                    name: self.state.nameInEditing,
	                    homeUrl: self.state.homeUrlInEditing,
	                    description: self.state.descriptionInEditing,
	                    authorizationCallbackUrl: self.state.authorizationCallbackUrlInEditing,
	                },
	            }).then(function (data) {
	                if (data.isSuccess) {
	                    head_1.global.head.showAlert(true, "success");
	                    self.new();
	                    self.get();
	                }
	                else {
	                    head_1.global.head.showAlert(false, data.errorMessage);
	                }
	            });
	        }
	    },
	    remove: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + ("/api/user/registered/" + self.state.idInEditing),
	            method: "DELETE",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	                self.new();
	                self.get();
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    resetClientSecret: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + ("/api/user/registered/" + self.state.idInEditing + "/client_secret"),
	            method: "PUT",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	                self.new();
	                self.get();
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    nameInEditingChanged: function (e) {
	        var self = this;
	        self.setState({ nameInEditing: e.target.value });
	    },
	    homeUrlInEditingChanged: function (e) {
	        var self = this;
	        self.setState({ homeUrlInEditing: e.target.value });
	    },
	    descriptionInEditingChanged: function (e) {
	        var self = this;
	        self.setState({ descriptionInEditing: e.target.value });
	    },
	    authorizationCallbackUrlInEditingChanged: function (e) {
	        var self = this;
	        self.setState({ authorizationCallbackUrlInEditing: e.target.value });
	    },
	    componentDidMount: function () {
	        var self = this;
	        self.get();
	    },
	    getInitialState: function () {
	        return {
	            applications: [],
	            idInEditing: null,
	            nameInEditing: "",
	            homeUrlInEditing: "",
	            descriptionInEditing: "",
	            authorizationCallbackUrlInEditing: "",
	            clientSecretInEditing: "",
	        };
	    },
	    render: function () {
	        var _this = this;
	        var self = this;
	        var applicationsView = self.state.applications.map(function (application) {
	            return (React.createElement("tr", {key: application.id}, React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: self.edit.bind(_this, application)}, application.name), React.createElement("p", null, "client id: ", application.clientId))));
	        });
	        var nameView = (React.createElement("div", {className: "form-group"}, React.createElement("label", {htmlFor: "name"}, "name"), React.createElement("input", {type: "text", className: "form-control", id: "name", placeholder: "name", onChange: self.nameInEditingChanged, value: self.state.nameInEditing})));
	        var homeUrlView = (React.createElement("div", {className: "form-group"}, React.createElement("label", {htmlFor: "home-url"}, "home url"), React.createElement("input", {type: "text", className: "form-control", id: "home-url", placeholder: "https://", onChange: self.homeUrlInEditingChanged, value: self.state.homeUrlInEditing})));
	        var descriptionView = (React.createElement("div", {className: "form-group"}, React.createElement("label", {htmlFor: "description"}, "description"), React.createElement("input", {type: "text", className: "form-control", id: "description", placeholder: "optional", onChange: self.descriptionInEditingChanged, value: self.state.descriptionInEditing})));
	        var authorizationCallbackUrl = (React.createElement("div", {className: "form-group"}, React.createElement("label", {htmlFor: "authorizationCallbackUrl"}, "authorization callback url"), React.createElement("input", {type: "text", className: "form-control", id: "authorizationCallbackUrl", placeholder: "https://", onChange: self.authorizationCallbackUrlInEditingChanged, value: self.state.authorizationCallbackUrlInEditing})));
	        var applicationView;
	        if (self.state.idInEditing) {
	            applicationView = (React.createElement("form", {className: "form"}, React.createElement("button", {type: "button", className: "btn btn-default", onClick: self.new}, "New"), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "client secret"), React.createElement("input", {type: "text", className: "form-control", readOnly: true, value: self.state.clientSecretInEditing})), React.createElement("button", {type: "button", className: "btn btn-danger", onClick: self.resetClientSecret}, "Reset client secret"), nameView, homeUrlView, descriptionView, authorizationCallbackUrl, React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.save}, "Update"), React.createElement("button", {type: "button", className: "btn btn-danger", onClick: self.remove}, "Delete")));
	        }
	        else {
	            applicationView = (React.createElement("form", {className: "form"}, nameView, homeUrlView, descriptionView, authorizationCallbackUrl, React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.save}, "Register")));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "Registered applications"), React.createElement("div", {className: "panel-body"}, React.createElement("form", {className: "form"}, React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-12"}, React.createElement("table", {className: "table"}, React.createElement("tbody", null, applicationsView))))), applicationView))))));
	    },
	};
	exports.RegisteredComponent = React.createClass(spec);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	var spec = {
	    confirm: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + ("/api/user/access_tokens/" + self.state.code),
	            method: "POST",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                alert("success");
	                location.href = self.state.redirectUrl;
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    componentDidMount: function () {
	        var self = this;
	        var scopes = decodeURIComponent(common.getUrlParameter("scopes"));
	        self.setState({
	            redirectUrl: decodeURIComponent(common.getUrlParameter("redirect_url")),
	            scopes: scopes.split(","),
	            code: decodeURIComponent(common.getUrlParameter("code")),
	        });
	        var applicationId = common.getUrlParameter("application_id");
	        if (applicationId) {
	            $.ajax({
	                url: apiBaseUrl + ("/api/applications/" + decodeURIComponent(applicationId)),
	            }).then(function (data) {
	                if (data.isSuccess) {
	                    self.setState({ application: data.application });
	                }
	                else {
	                    head_1.global.head.showAlert(false, data.errorMessage);
	                }
	            });
	        }
	        $.ajax({
	            url: apiBaseUrl + "/api/scopes",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                self.setState({ allScopes: data.scopes });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    getInitialState: function () {
	        return {
	            allScopes: [],
	            scopes: [],
	            redirectUrl: "",
	            code: "",
	            application: null,
	        };
	    },
	    render: function () {
	        var self = this;
	        var applicationView;
	        if (self.state.application) {
	            applicationView = (React.createElement("div", {className: "panel-heading"}, "Authorization to ", self.state.application.name, " (owned by ", self.state.application.creator.name, ")"));
	        }
	        var scopesView = self.state.allScopes.map(function (scope) {
	            var checked = self.state.scopes.indexOf(scope.name) >= 0;
	            return (React.createElement("label", {key: scope.name, className: "checkbox"}, React.createElement("input", {type: "checkbox", checked: checked, value: scope.name, readOnly: true}), scope.name, " : ", scope.description));
	        });
	        var codeView;
	        if (self.state.code) {
	            codeView = (React.createElement("form", {className: "form"}, React.createElement("div", {className: "checkbox"}, scopesView), React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.confirm}, "Confirm")));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, applicationView, React.createElement("div", {className: "panel-body"}, codeView))))));
	    },
	};
	exports.AuthorizationComponent = React.createClass(spec);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	var guid = common.guid();
	var spec = {
	    login: function () {
	        var self = this;
	        var lastSuccessfulEmailTime = window.localStorage.getItem(common.localStorageNames.lastSuccessfulEmailTime);
	        if (lastSuccessfulEmailTime) {
	            var time = new Date().getTime() - parseInt(lastSuccessfulEmailTime, 10);
	            if (time < 60 * 1000) {
	                head_1.global.head.showAlert(false, "please do it after " + (60 - time / 1000) + " seconds");
	                return;
	            }
	        }
	        $.post(apiBaseUrl + "/api/tokens", {
	            email: self.state.emailHead + "@" + self.state.emailTail,
	            name: self.getName(),
	            guid: guid,
	            code: self.state.code,
	            redirectUrl: self.state.redirectUrl,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success, please check your email.");
	                window.localStorage.setItem(common.localStorageNames.lastSuccessfulEmailTime, new Date().getTime().toString());
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	                self.refreshCaptcha();
	            }
	        });
	    },
	    refreshCaptcha: function () {
	        var self = this;
	        $.post(apiBaseUrl + "/api/captchas", {
	            id: guid,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                self.setState({ captchaUrl: data.url });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    getName: function () {
	        var self = this;
	        if (self.state.innerName) {
	            return self.state.innerName;
	        }
	        return self.state.emailHead;
	    },
	    setRawEmail: function (email) {
	        var self = this;
	        if (common.isEmail(email)) {
	            var tmp = email.trim().toLowerCase().split("@");
	            self.setState({
	                emailHead: tmp[0],
	                emailTail: tmp[1],
	                innerRawEmail: email,
	            });
	        }
	        else {
	            self.setState({
	                emailHead: "",
	                emailTail: "",
	                innerRawEmail: email,
	            });
	        }
	    },
	    rawEmailChanged: function (e) {
	        var self = this;
	        self.setRawEmail(e.target.value);
	    },
	    nameChanged: function (e) {
	        var self = this;
	        var name = e.target.value;
	        self.setState({ innerName: name.trim() });
	    },
	    codeChanged: function (e) {
	        var self = this;
	        self.setState({ code: e.target.value });
	    },
	    componentWillUnmount: function () {
	        head_1.global.authenticated = undefined;
	        head_1.global.body = undefined;
	    },
	    getInitialState: function () {
	        var self = this;
	        head_1.global.body = self;
	        head_1.global.authenticated = function (error) {
	            if (error) {
	                self.setRawEmail(window.localStorage.getItem(common.localStorageNames.lastLoginEmail));
	                self.setState({
	                    innerName: window.localStorage.getItem(common.localStorageNames.lastLoginName),
	                    redirectUrl: decodeURIComponent(common.getUrlParameter("redirect_url")),
	                });
	                self.refreshCaptcha();
	                return;
	            }
	            alert("You are already logged in, will be redirect to home page now.");
	            location.href = "/";
	        };
	        return {
	            emailHead: "",
	            emailTail: "",
	            innerName: "",
	            innerRawEmail: "",
	            captchaUrl: "",
	            code: "",
	            redirectUrl: "",
	            requestCount: 0,
	        };
	    },
	    render: function () {
	        var self = this;
	        var loginView;
	        if (self.state.emailHead && self.state.emailTail && self.state.code && self.state.requestCount === 0) {
	            loginView = (React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.login}, "Login"));
	        }
	        else {
	            loginView = (React.createElement("button", {type: "button", className: "btn btn-primary", disabled: true}, "Please input email and code"));
	        }
	        var captchaView;
	        if (self.state.captchaUrl) {
	            captchaView = (React.createElement("div", {className: "col-sm-2"}, React.createElement("img", {src: self.state.captchaUrl}), React.createElement("span", {className: "glyphicon glyphicon-refresh pointer", "aria-hidden": "true", onClick: self.refreshCaptcha})));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "Login"), React.createElement("div", {className: "panel-body"}, React.createElement("form", {className: "form-horizontal"}, React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-sm-1 control-label"}, React.createElement("span", {className: "glyphicon glyphicon-envelope"})), React.createElement("div", {className: "col-sm-4"}, React.createElement("input", {type: "text", className: "form-control", onChange: self.rawEmailChanged, value: self.state.innerRawEmail})), React.createElement("label", {className: "col-sm-1 control-label"}, "name:"), React.createElement("div", {className: "col-sm-2"}, React.createElement("input", {type: "text", className: "form-control", onChange: self.nameChanged, value: self.state.innerName}))), React.createElement("div", {className: "form-group"}, captchaView, React.createElement("div", {className: "col-sm-2"}, React.createElement("input", {type: "text", className: "form-control", onChange: self.codeChanged, value: self.state.code})), React.createElement("div", {className: "col-sm-4"}, loginView)))))))));
	    },
	};
	exports.LoginComponent = React.createClass(spec);


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var head_1 = __webpack_require__(19);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	var spec = {
	    save: function () {
	        var self = this;
	        var file = $(":file")[0]["files"][0];
	        if (file) {
	            var formData = new FormData();
	            formData.append("file", file);
	            $.ajax({
	                url: imageUploaderBaseUrl + "/api/temperary",
	                data: formData,
	                processData: false,
	                contentType: false,
	                type: "POST",
	            }).then(function (data) {
	                if (data.isSuccess) {
	                    var name_1 = data.names[0];
	                    self.update(name_1);
	                }
	                else {
	                    head_1.global.head.showAlert(false, data.errorMessage);
	                }
	            });
	        }
	        else {
	            self.update(null);
	        }
	    },
	    update: function (avatarFileName) {
	        var self = this;
	        if (self.state.name.trim() !== head_1.global.head.state.currentUserName || avatarFileName) {
	            $.ajax({
	                url: apiBaseUrl + "/api/user",
	                data: {
	                    name: self.state.name,
	                    avatarFileName: avatarFileName,
	                },
	                cache: false,
	                type: "PUT",
	            }).then(function (data) {
	                if (data.isSuccess) {
	                    window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
	                    head_1.global.head.authenticate(function (error) { ; });
	                    head_1.global.head.showAlert(true, "success");
	                }
	                else {
	                    head_1.global.head.showAlert(false, data.errorMessage);
	                }
	            });
	        }
	        else {
	            head_1.global.head.showAlert(false, "nothing changes.");
	        }
	    },
	    nameChanged: function (e) {
	        var self = this;
	        self.setState({ name: e.target.value });
	    },
	    componentWillUnmount: function () {
	        head_1.global.authenticated = undefined;
	    },
	    getInitialState: function () {
	        var self = this;
	        head_1.global.authenticated = function (error) {
	            if (error) {
	                self.setState({ name: head_1.global.head.state.currentUserName });
	            }
	        };
	        return {
	            name: "",
	        };
	    },
	    render: function () {
	        var self = this;
	        var saveView;
	        if (self.state.name.trim() !== "") {
	            saveView = (React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.save}, "Save"));
	        }
	        else {
	            saveView = (React.createElement("button", {type: "button", className: "btn btn-primary", disabled: true}, "name can not be empty "));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "User Information"), React.createElement("div", {className: "panel-body"}, React.createElement("form", {className: "form-horizontal"}, React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-sm-1 control-label"}, "name:"), React.createElement("div", {className: "col-sm-2"}, React.createElement("input", {type: "text", className: "form-control", value: self.state.name, onChange: self.nameChanged})), React.createElement("label", {className: "col-sm-1 control-label"}, "avatar:"), React.createElement("div", {className: "col-sm-2"}, React.createElement("input", {type: "file", name: "avatar"})), React.createElement("div", {className: "col-sm-4"}, saveView)))))))));
	    },
	};
	exports.UserComponent = React.createClass(spec);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var types = __webpack_require__(1);
	var head_1 = __webpack_require__(19);
	var common = __webpack_require__(2);
	var React = __webpack_require__(4);
	function changeOrganization(id) {
	    socket.emit("change organization", {
	        to: id,
	    });
	}
	var intervalId;
	var md;
	function replaceProtocal(src) {
	    if (src.indexOf("http://") === 0 && src.indexOf("http://localhost") !== 0) {
	        return "https://" + src.substring("http://".length);
	    }
	    return src;
	}
	function extractSummary(markdown) {
	    var tokens = md.parse(markdown, {});
	    var image = undefined;
	    var text = [];
	    var maxSize = 80;
	    var size = 0;
	    function limitSize(content) {
	        if (content.length > maxSize - size) {
	            content = content.substr(0, maxSize - size) + "...";
	            size = maxSize;
	        }
	        return content;
	    }
	    function pushText(content) {
	        content = limitSize(content);
	        if (text.length > 0 && typeof text[text.length - 1] === "string") {
	            text[text.length - 1] += content;
	        }
	        else {
	            text.push(content);
	        }
	    }
	    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
	        var token = tokens_1[_i];
	        if (size >= maxSize) {
	            break;
	        }
	        if (token.tag === "") {
	            if (token.children && token.children.length > 0
	                && token.children[0].tag === "a"
	                && token.children[0].attrs && token.children[0].attrs.length > 0
	                && token.children[0].attrs[0].length > 1) {
	                var content = limitSize(token.children[1].content);
	                text.push({
	                    content: content,
	                    href: token.children[0].attrs[0][1],
	                });
	            }
	            else if (token.children && token.children.length > 0
	                && token.children[0].tag === "img"
	                && token.children[0].attrs && token.children[0].attrs.length > 0
	                && token.children[0].attrs[0].length > 1) {
	                if (!image) {
	                    image = token.children[0].attrs[0][1];
	                    image = replaceProtocal(image);
	                }
	            }
	            else {
	                pushText(token.content);
	            }
	        }
	        else if (token.tag === "code") {
	            pushText(token.content);
	        }
	    }
	    return {
	        image: image,
	        text: text,
	    };
	}
	var spec = {
	    getOrganizationsCurrentUserIn: function () {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + "/api/user/joined",
	            cache: false,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                self.setState({ organizationsCurrentUserIn: data.organizations });
	                if (data.organizations.length > 0) {
	                    var lastOrganizationId_1 = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
	                    if (lastOrganizationId_1 && common.find(data.organizations, function (o) { return o.id === lastOrganizationId_1; })) {
	                        self.setState({ currentOrganizationId: lastOrganizationId_1 });
	                    }
	                    else {
	                        self.setState({ currentOrganizationId: data.organizations[0].id });
	                    }
	                    changeOrganization(self.state.currentOrganizationId);
	                    self.fetchThemes(1);
	                }
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    getEmails: function (users) {
	        return users.reduce(function (r, u) { return r + u.email + ";"; }, "");
	    },
	    fetchThemes: function (page, organizationId) {
	        var self = this;
	        self.setState({ currentPage: page });
	        $.ajax({
	            url: apiBaseUrl + "/api/organizations/" + (organizationId ? organizationId : self.state.currentOrganizationId) + "/themes",
	            data: {
	                page: page,
	                limit: common.itemLimit,
	                q: self.state.q,
	                isOpen: self.state.isOpen ? types.yes : types.no,
	                isClosed: self.state.isClosed ? types.yes : types.no,
	                order: self.state.order,
	            },
	            cache: false,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                for (var _i = 0, _a = data.themes; _i < _a.length; _i++) {
	                    var theme = _a[_i];
	                    self.initTheme(theme);
	                }
	                if (page === 1) {
	                    self.setState({
	                        themes: data.themes,
	                        totalCount: data.totalCount,
	                    });
	                }
	                else {
	                    self.setState({
	                        themes: self.state.themes.concat(data.themes),
	                        totalCount: data.totalCount,
	                    });
	                }
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    initTheme: function (theme) {
	        var self = this;
	        theme.isWatching = theme.watchers.some(function (w) { return w.id === head_1.global.head.state.currentUserId; });
	        theme.isOwner = theme.owners.some(function (o) { return o.id === head_1.global.head.state.currentUserId; });
	        theme.createTimeText = moment(theme.createTime, moment.ISO_8601).fromNow();
	        if (theme.updateTime) {
	            theme.updateTimeText = moment(theme.updateTime, moment.ISO_8601).fromNow();
	        }
	        else {
	            theme.updateTimeText = theme.createTimeText;
	        }
	        theme.isHovering = false;
	        theme.expanded = false;
	        theme.watchersEmails = self.getEmails(theme.watchers);
	        theme.ownersEmails = self.getEmails(theme.owners);
	        theme.creator.avatar = common.getFullUrl(theme.creator.avatar);
	        for (var _i = 0, _a = theme.watchers; _i < _a.length; _i++) {
	            var watcher = _a[_i];
	            watcher.avatar = common.getFullUrl(watcher.avatar);
	        }
	        for (var _b = 0, _c = theme.owners; _b < _c.length; _b++) {
	            var owner = _c[_b];
	            owner.avatar = common.getFullUrl(owner.avatar);
	        }
	        if (theme.detail) {
	            theme.summaryDetail = extractSummary(theme.detail);
	        }
	    },
	    clickOrganization: function (organization) {
	        var self = this;
	        if (self.state.currentOrganizationId !== organization.id) {
	            changeOrganization(organization.id);
	        }
	        self.setState({ currentOrganizationId: organization.id });
	        self.fetchThemes(1, organization.id);
	        window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
	    },
	    createTheme: function () {
	        var self = this;
	        $.post(apiBaseUrl + "/api/themes", {
	            themeTitle: self.state.newThemeTitle,
	            themeDetail: self.state.newThemeDetail,
	            organizationId: self.state.currentOrganizationId,
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    setThemeTimeText: function () {
	        var self = this;
	        for (var _i = 0, _a = self.state.themes; _i < _a.length; _i++) {
	            var theme = _a[_i];
	            theme.createTimeText = moment(theme.createTime, moment.ISO_8601).fromNow();
	            if (theme.updateTime) {
	                theme.updateTimeText = moment(theme.updateTime, moment.ISO_8601).fromNow();
	            }
	            else {
	                theme.updateTimeText = theme.createTimeText;
	            }
	        }
	    },
	    watch: function (theme) {
	        $.ajax({
	            url: apiBaseUrl + "/api/user/watched/" + theme.id,
	            type: "PUT",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    unwatch: function (theme) {
	        $.ajax({
	            url: apiBaseUrl + "/api/user/watched/" + theme.id,
	            data: {},
	            type: "DELETE",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    showMoreThemes: function () {
	        var self = this;
	        self.fetchThemes(self.state.currentPage + 1);
	    },
	    close: function (theme) {
	        $.ajax({
	            url: apiBaseUrl + "/api/themes/" + theme.id,
	            data: {
	                status: types.themeStatus.closed,
	            },
	            cache: false,
	            type: "PUT",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    reopen: function (theme) {
	        $.ajax({
	            url: apiBaseUrl + "/api/themes/" + theme.id,
	            data: {
	                status: types.themeStatus.open,
	            },
	            cache: false,
	            type: "PUT",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    edit: function (theme) {
	        var self = this;
	        var themes = self.state.themes;
	        head_1.global.win.scrollTop(theme.scrollTop);
	        self.setState({
	            themeIdInEditing: theme.id,
	            titleInEditing: theme.title,
	            detailInEditing: theme.detail,
	            themes: themes,
	        });
	    },
	    cancel: function (theme) {
	        var self = this;
	        var themes = self.state.themes;
	        head_1.global.win.scrollTop(theme.scrollTop);
	        self.setState({
	            themeIdInEditing: null,
	            titleInEditing: "",
	            detailInEditing: "",
	            themes: themes,
	        });
	    },
	    save: function (theme) {
	        var self = this;
	        $.ajax({
	            url: apiBaseUrl + "/api/themes/" + theme.id,
	            data: {
	                title: self.state.titleInEditing,
	                detail: self.state.detailInEditing,
	                imageNames: self.state.imageNamesInEditing,
	            },
	            cache: false,
	            type: "PUT",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                head_1.global.head.showAlert(true, "success");
	                self.setState({ imageNamesInEditing: [] });
	                self.cancel(theme);
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    clickOpen: function () {
	        var self = this;
	        self.setState({ isOpen: !self.state.isOpen });
	    },
	    clickClosed: function () {
	        var self = this;
	        self.setState({ isClosed: !self.state.isClosed });
	    },
	    clickShowCreate: function () {
	        var self = this;
	        self.setState({ showCreate: !self.state.showCreate });
	    },
	    clickOrder: function (order) {
	        var self = this;
	        self.setState({ order: order });
	    },
	    nextThemeCount: function () {
	        var self = this;
	        var count = self.state.totalCount - common.itemLimit * self.state.currentPage;
	        return count > common.itemLimit ? common.itemLimit : count;
	    },
	    canShowMoreThemes: function () {
	        var self = this;
	        return self.nextThemeCount() > 0 && self.state.requestCount === 0;
	    },
	    mouseEnterTheme: function (theme) {
	        var self = this;
	        var themes = self.state.themes;
	        theme.isHovering = true;
	        self.setState({ themes: themes });
	    },
	    mouseLeaveTheme: function (theme) {
	        var self = this;
	        var themes = self.state.themes;
	        theme.isHovering = false;
	        self.setState({ themes: themes });
	    },
	    newThemeTitleChanged: function (e) {
	        var self = this;
	        self.setState({ newThemeTitle: e.target.value });
	    },
	    newThemeDetailChanged: function (e) {
	        var self = this;
	        self.setState({ newThemeDetail: e.target.value });
	    },
	    qChanged: function (e) {
	        var self = this;
	        self.setState({ q: e.target.value });
	    },
	    titleInEditingChanged: function (e) {
	        var self = this;
	        self.setState({ titleInEditing: e.target.value });
	    },
	    detailInEditingChanged: function (e) {
	        var self = this;
	        self.setState({ detailInEditing: e.target.value });
	    },
	    qKeyUp: function (e) {
	        var self = this;
	        if (e.keyCode === 13) {
	            self.fetchThemes(1);
	        }
	    },
	    onDragEnter: function (e) {
	        var file = e.dataTransfer.files[0];
	        if (file) {
	            e.preventDefault();
	        }
	    },
	    onDragOver: function (e) {
	        var file = e.dataTransfer.files[0];
	        if (file) {
	            e.preventDefault();
	            e.stopPropagation();
	            return false;
	        }
	    },
	    onDragLeave: function (e) {
	        var file = e.dataTransfer.files[0];
	        if (file) {
	            e.preventDefault();
	        }
	    },
	    onDrop: function (e) {
	        var self = this;
	        var file = e.dataTransfer.files[0];
	        if (file) {
	            e.preventDefault();
	            self.uploadImage(file, e.target.selectionStart);
	        }
	    },
	    onPaste: function (e) {
	        var self = this;
	        var items = (e.clipboardData || e.originalEvent.clipboardData).items;
	        if (items.length > 0) {
	            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
	                var item = items_1[_i];
	                if (item.type.indexOf("image") === 0) {
	                    var file = item.getAsFile();
	                    e.preventDefault();
	                    self.uploadImage(file, e.target.selectionStart);
	                    break;
	                }
	            }
	        }
	    },
	    onImageUploaded: function (e) {
	        var self = this;
	        var file = e.target.files[0];
	        if (file) {
	            e.preventDefault();
	            self.uploadImage(file);
	        }
	    },
	    uploadImage: function (file, index) {
	        var self = this;
	        var formData = new FormData();
	        formData.append("file", file);
	        $.ajax({
	            url: imageUploaderBaseUrl + "/api/temperary",
	            data: formData,
	            processData: false,
	            contentType: false,
	            type: "POST",
	        }).then(function (data) {
	            if (data.isSuccess) {
	                var name_1 = data.names[0];
	                var names = self.state.imageNamesInEditing;
	                names.push(name_1);
	                self.setState({ imageNamesInEditing: names });
	                var head = void 0;
	                var tail = void 0;
	                if (index) {
	                    head = self.state.detailInEditing.substring(0, index);
	                    tail = self.state.detailInEditing.substring(index);
	                }
	                else {
	                    head = self.state.detailInEditing;
	                    tail = "";
	                }
	                var result = head + "![](" + imageServerBaseUrl + "/" + name_1 + ")" + tail;
	                self.setState({ detailInEditing: result });
	            }
	            else {
	                head_1.global.head.showAlert(false, data.errorMessage);
	            }
	        });
	    },
	    expand: function (theme) {
	        var self = this;
	        var themes = self.state.themes;
	        theme.expanded = true;
	        theme.scrollTop = head_1.global.win.scrollTop();
	        self.setState({ themes: themes });
	    },
	    collapse: function (theme) {
	        var self = this;
	        var themes = self.state.themes;
	        theme.expanded = false;
	        head_1.global.win.scrollTop(theme.scrollTop);
	        self.setState({ themes: themes });
	    },
	    componentDidMount: function () {
	        var self = this;
	        head_1.global.body = self;
	        self.getOrganizationsCurrentUserIn();
	        intervalId = setInterval(self.setThemeTimeText, 10000);
	        head_1.global.themeCreated = function (theme) {
	            if (theme.organizationId === self.state.currentOrganizationId) {
	                self.initTheme(theme);
	                self.setState({ themes: [theme].concat(self.state.themes) });
	            }
	        };
	        head_1.global.themeUpdated = function (theme) {
	            if (theme.organizationId === self.state.currentOrganizationId) {
	                var index = common.findIndex(self.state.themes, function (t) { return t.id === theme.id; });
	                if (index > -1) {
	                    self.initTheme(theme);
	                    var themes = self.state.themes;
	                    theme.expanded = themes[index].expanded;
	                    theme.scrollTop = themes[index].scrollTop;
	                    themes[index] = theme;
	                    self.setState({ themes: themes });
	                }
	            }
	        };
	        head_1.global.scrolled = function () {
	            if (self.canShowMoreThemes()) {
	                self.showMoreThemes();
	            }
	        };
	        md = markdownit({
	            linkify: true,
	            highlight: function (str, lang) {
	                if (lang && hljs.getLanguage(lang)) {
	                    try {
	                        return hljs.highlight(lang, str).value;
	                    }
	                    catch (error) {
	                        console.log(error);
	                    }
	                }
	                try {
	                    return hljs.highlightAuto(str).value;
	                }
	                catch (error) {
	                    console.log(error);
	                }
	                return "";
	            },
	        });
	        var defaultImageRender = md.renderer.rules.image;
	        md.renderer.rules.image = function (tokens, index, options, env, s) {
	            var token = tokens[index];
	            var aIndex = token.attrIndex("src");
	            token.attrs[aIndex][1] = replaceProtocal(token.attrs[aIndex][1]);
	            token.attrPush(["class", "theme-detail-image"]);
	            return defaultImageRender(tokens, index, options, env, s);
	        };
	        var defaultLinkRender = md.renderer.rules.link_open || function (tokens, index, options, env, s) {
	            return s.renderToken(tokens, index, options);
	        };
	        md.renderer.rules.link_open = function (tokens, index, options, env, s) {
	            var aIndex = tokens[index].attrIndex("target");
	            tokens[index].attrPush(["target", "_blank"]);
	            tokens[index].attrPush(["rel", "nofollow"]);
	            return defaultLinkRender(tokens, index, options, env, s);
	        };
	    },
	    componentWillUnmount: function () {
	        head_1.global.body = undefined;
	        if (intervalId) {
	            clearInterval(intervalId);
	        }
	        head_1.global.themeCreated = undefined;
	        head_1.global.themeUpdated = undefined;
	        head_1.global.scrolled = undefined;
	        md = undefined;
	    },
	    getInitialState: function () {
	        return {
	            organizationsCurrentUserIn: [],
	            currentOrganizationId: "",
	            themes: [],
	            newThemeTitle: "",
	            newThemeDetail: "",
	            currentPage: 1,
	            totalCount: 0,
	            themeIdInEditing: null,
	            titleInEditing: "",
	            detailInEditing: "",
	            imageNamesInEditing: [],
	            q: "",
	            isOpen: true,
	            isClosed: false,
	            showCreate: false,
	            order: types.themeOrder.newest,
	            requestCount: 0,
	        };
	    },
	    render: function () {
	        var _this = this;
	        var self = this;
	        var canSave = self.state.titleInEditing.trim() && self.state.requestCount === 0;
	        var showMoreThemesView;
	        if (self.canShowMoreThemes()) {
	            showMoreThemesView = (React.createElement("button", {type: "button", className: "btn btn-primary btn-lg col-sm-12", onClick: self.showMoreThemes}, "show ", self.nextThemeCount(), " more ", self.nextThemeCount() > 1 ? "themes" : "theme", "(total ", self.state.totalCount, ")"));
	        }
	        else {
	            showMoreThemesView = (React.createElement("button", {type: "button", className: "btn btn-primary btn-lg col-sm-12", disabled: true}, "total ", self.state.totalCount));
	        }
	        var themesView = self.state.themes.map(function (theme) {
	            var themeTitleView;
	            var themeDetailView;
	            if (self.state.themeIdInEditing !== theme.id) {
	                themeTitleView = (React.createElement("span", null, theme.title, React.createElement("span", {className: "theme-title-status label label-" + (theme.status === types.themeStatus.open ? "success" : "danger")}, theme.status)));
	                if (theme.detail) {
	                    if (theme.expanded) {
	                        if (!theme.htmlDetail) {
	                            theme.htmlDetail = md.render(theme.detail);
	                        }
	                        themeDetailView = (React.createElement("div", {dangerouslySetInnerHTML: { __html: theme.htmlDetail }}));
	                    }
	                    else {
	                        var imageView = void 0;
	                        var textView = theme.summaryDetail.text.map(function (t, i) {
	                            if (typeof t === "string") {
	                                return (React.createElement("span", {key: i}, t));
	                            }
	                            else {
	                                return (React.createElement("a", {key: i, href: t.href, target: "_blank", rel: "nofollow"}, t.content));
	                            }
	                        });
	                        if (theme.summaryDetail.image) {
	                            imageView = (React.createElement("img", {src: theme.summaryDetail.image, className: "float-left theme-head-image"}));
	                        }
	                        themeDetailView = (React.createElement("div", {onClick: self.expand.bind(_this, theme), className: "clearfix pointer"}, imageView, textView));
	                    }
	                }
	            }
	            else {
	                themeTitleView = (React.createElement("input", {className: "form-control", onChange: self.titleInEditingChanged, value: self.state.titleInEditing}));
	                themeDetailView = (React.createElement("textarea", {rows: 10, className: "form-control", onDragEnter: self.onDragEnter, onDragOver: self.onDragOver, onDragLeave: self.onDragLeave, onDrop: self.onDrop, onPaste: self.onPaste, onChange: self.detailInEditingChanged, value: self.state.detailInEditing}));
	            }
	            var ownersView;
	            if (theme.owners.length > 0) {
	                ownersView = (React.createElement("button", {type: "button", className: "clip btn btn-xs btn-link", "data-clipboard-text": theme.ownersEmails}, theme.owners.length, " ", theme.owners.length > 1 ? "owners" : "owner"));
	            }
	            else {
	                ownersView = (React.createElement("span", null, "no owner"));
	            }
	            var watchersView;
	            if (theme.watchers.length > 0) {
	                watchersView = (React.createElement("button", {type: "button", className: "clip btn btn-xs btn-link", "data-clipboard-text": theme.watchersEmails}, theme.watchers.length, " ", theme.watchers.length > 1 ? "watchers" : "watcher"));
	            }
	            else {
	                watchersView = (React.createElement("span", null, "no watcher"));
	            }
	            var watchButton;
	            if (theme.isWatching) {
	                watchButton = (React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.unwatch.bind(_this, theme)}, "unwatch"));
	            }
	            else {
	                watchButton = (React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.watch.bind(_this, theme)}, "watch"));
	            }
	            var hoveringView;
	            if (theme.isHovering || theme.expanded || self.state.themeIdInEditing === theme.id) {
	                var ownerView = void 0;
	                if (theme.isOwner) {
	                    var openButton = void 0;
	                    if (theme.status === "open") {
	                        openButton = (React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.close.bind(_this, theme)}, "close"));
	                    }
	                    else {
	                        openButton = (React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.reopen.bind(_this, theme)}, "reopen"));
	                    }
	                    var cancelButton = void 0;
	                    var editButton = void 0;
	                    var saveButton = void 0;
	                    var uploadButton = void 0;
	                    if (self.state.themeIdInEditing !== null) {
	                        if (self.state.themeIdInEditing === theme.id) {
	                            cancelButton = (React.createElement("div", {className: "inline"}, "•", React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.cancel.bind(_this, theme)}, "cancel")));
	                            if (canSave && (self.state.titleInEditing !== theme.title || self.state.detailInEditing !== theme.detail)) {
	                                saveButton = (React.createElement("div", {className: "inline"}, "•", React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.save.bind(_this, theme)}, "save")));
	                            }
	                            uploadButton = (React.createElement("div", {className: "inline"}, "•", React.createElement("button", {type: "button", className: "btn btn-xs btn-link relative"}, React.createElement("span", {className: "pointer"}, "upload image"), React.createElement("input", {type: "file", accept: "image/*", onChange: self.onImageUploaded, className: "theme-image-chooser"}))));
	                        }
	                    }
	                    else {
	                        editButton = (React.createElement("div", {className: "inline"}, "•", React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.edit.bind(_this, theme)}, "edit")));
	                    }
	                    ownerView = (React.createElement("div", {className: "inline"}, "•", openButton, editButton, saveButton, cancelButton, uploadButton));
	                }
	                var collapseButton = void 0;
	                if (theme.expanded) {
	                    collapseButton = (React.createElement("div", {className: "inline"}, "•", React.createElement("button", {type: "button", className: "btn btn-xs btn-link", onClick: self.collapse.bind(_this, theme)}, "collapse")));
	                }
	                hoveringView = (React.createElement("div", {className: "inline"}, "•", watchButton, ownerView, collapseButton));
	            }
	            return (React.createElement("tr", {key: theme.id, onMouseEnter: self.mouseEnterTheme.bind(_this, theme), onMouseLeave: self.mouseLeaveTheme.bind(_this, theme)}, React.createElement("td", {className: "theme-creator-avatar"}, React.createElement("img", {src: theme.creator.avatar, height: "50", width: "50"})), React.createElement("td", null, React.createElement("h5", null, themeTitleView), React.createElement("div", null, themeDetailView), React.createElement("div", {className: "theme-buttons"}, React.createElement("button", {type: "button", className: "clip btn btn-xs btn-link", "data-clipboard-text": theme.creator.email}, theme.creator.name), "•" + ' ' + "created ", theme.createTimeText, React.createElement("div", {style: { display: theme.updateTimeText ? "inline" : "none" }}, "•" + ' ' + "updated ", theme.updateTimeText), "•", ownersView, "•", watchersView, hoveringView))));
	        });
	        var organizationsView = self.state.organizationsCurrentUserIn.map(function (organization) {
	            return (React.createElement("label", {key: organization.id, className: "the-label " + (self.state.currentOrganizationId === organization.id ? "label-active" : ""), onClick: self.clickOrganization.bind(_this, organization)}, organization.name));
	        });
	        var currentOrganizationView;
	        if (self.state.currentOrganizationId !== "") {
	            var createButton = void 0;
	            if (self.state.newThemeTitle.trim() && self.state.requestCount === 0) {
	                createButton = (React.createElement("button", {type: "button", className: "btn btn-primary", onClick: self.createTheme}, "Create"));
	            }
	            else {
	                createButton = (React.createElement("button", {type: "button", className: "btn btn-primary", disabled: true}, "Please input title"));
	            }
	            var showCreateView = (React.createElement("span", {className: "theme-add btn btn-primary glyphicon glyphicon-" + (self.state.showCreate ? "minus" : "plus"), "aria-hidden": "true", onClick: self.clickShowCreate}));
	            var newThemeTitleView = void 0;
	            var newThemeDetailView = void 0;
	            var createButtonView = void 0;
	            if (self.state.showCreate) {
	                newThemeTitleView = (React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-sm-2 control-label"}, "title"), React.createElement("div", {className: "col-sm-10"}, React.createElement("input", {type: "text", className: "form-control", onChange: self.newThemeTitleChanged, value: self.state.newThemeTitle}))));
	                newThemeDetailView = (React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "col-sm-2 control-label"}, "detail"), React.createElement("div", {className: "col-sm-10"}, React.createElement("textarea", {className: "form-control", rows: 10, onChange: self.newThemeDetailChanged, value: self.state.newThemeDetail}))));
	                createButtonView = (React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-10 col-sm-offset-2"}, createButton)));
	            }
	            currentOrganizationView = (React.createElement("form", {className: "form-horizontal"}, React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-12"}, organizationsView)), React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-4"}, React.createElement("input", {className: "form-control", onChange: self.qChanged, value: self.state.q, onKeyUp: self.qKeyUp})), React.createElement("div", {className: "col-sm-8"}, React.createElement("label", {className: "the-label " + (self.state.isOpen ? "label-active" : ""), onClick: self.clickOpen}, "open"), React.createElement("label", {className: "the-label " + (self.state.isClosed ? "label-active" : ""), onClick: self.clickClosed}, "closed"), "order by", React.createElement("label", {className: "the-label " + (self.state.order === "newest" ? "label-active" : ""), onClick: self.clickOrder.bind(this, "newest")}, "newest"), React.createElement("label", {className: "the-label " + (self.state.order === "recently updated" ? "label-active" : ""), onClick: self.clickOrder.bind(this, "recently updated")}, "recently updated"), React.createElement("span", {className: "glyphicon glyphicon-search btn btn-primary", "aria-hidden": "true", onClick: self.fetchThemes.bind(this, 1, undefined)}), showCreateView)), newThemeTitleView, newThemeDetailView, createButtonView, React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "col-sm-12"}, React.createElement("table", {className: "table"}, React.createElement("tbody", null, themesView))), React.createElement("div", {className: "col-sm-12"}, showMoreThemesView))));
	        }
	        return (React.createElement("div", null, React.createElement(head_1.HeadComponent, null), React.createElement("div", {className: "container body-container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "Themes"), React.createElement("div", {className: "panel-body"}, currentOrganizationView))))));
	    },
	};
	exports.ThemesComponent = React.createClass(spec);


/***/ }
/******/ ]);