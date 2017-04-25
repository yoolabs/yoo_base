

YLib = {};

// --------------- include some functionality from leaflet.js... utilities and leaflets event system. ----------------------------------
//--------------------------- BEGIN OF LEAFLET CODE ------------------------------------------------------------------------------------

YLib.Util = {
	extend: function (dest) { // (Object[, Object, ...]) ->
		var sources = Array.prototype.slice.call(arguments, 1),
		    i, j, len, src;

		for (j = 0, len = sources.length; j < len; j++) {
			src = sources[j] || {};
			for (i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},

	bind: function (fn, obj) { // (Function, Object) -> Function
		var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
		return function () {
			return fn.apply(obj, args || arguments);
		};
	},

	stamp: (function () {
		var lastId = 0, key = '_leaflet_id';
		return function (/*Object*/ obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),

	invokeEach: function (obj, method, context) {
		var i, args;

		if (typeof obj === 'object') {
			args = Array.prototype.slice.call(arguments, 3);

			for (i in obj) {
				method.apply(context, [i, obj[i]].concat(args));
			}
			return true;
		}

		return false;
	},

	limitExecByInterval: function (fn, time, context) {
		var lock, execOnUnlock;

		return function wrapperFn() {
			var args = arguments;

			if (lock) {
				execOnUnlock = true;
				return;
			}

			lock = true;

			setTimeout(function () {
				lock = false;

				if (execOnUnlock) {
					wrapperFn.apply(context, args);
					execOnUnlock = false;
				}
			}, time);

			fn.apply(context, args);
		};
	},

	falseFn: function () {
		return false;
	},

	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	splitWords: function (str) {
		return YLib.Util.trim(str).split(/\s+/);
	},

	setOptions: function (obj, options) {
		obj.options = YLib.extend({}, obj.options, options);
		return obj.options;
	},

	getParamString: function (obj, existingUrl) {
		var params = [];
		for (var i in obj) {
			params.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
		}
		return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	},

	template: function (str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			var value = data[key];
			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);
			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	},

	isArray: function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
};


(function () {

	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		var i, fn,
		    prefixes = ['webkit', 'moz', 'o', 'ms'];

		for (i = 0; i < prefixes.length && !fn; i++) {
			fn = window[prefixes[i] + name];
		}

		return fn;
	}

	var lastTime = 0;

	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame ||
	        getPrefixed('RequestAnimationFrame') || timeoutDefer;

	var cancelFn = window.cancelAnimationFrame ||
	        getPrefixed('CancelAnimationFrame') ||
	        getPrefixed('CancelRequestAnimationFrame') ||
	        function (id) { window.clearTimeout(id); };


	YLib.Util.requestAnimFrame = function (fn, context, immediate, element) {
		fn = YLib.bind(fn, context);

		if (immediate && requestFn === timeoutDefer) {
			fn();
		} else {
			return requestFn.call(window, fn, element);
		}
	};

	YLib.Util.cancelAnimFrame = function (id) {
		if (id) {
			cancelFn.call(window, id);
		}
	};

/*
	sprintf implementation programmed by Alexei - thanks!
	https://github.com/alexei/sprintf.js
*/
    YLib.Util.sprintf = function() {
        var key = arguments[0], cache = YLib.Util.sprintf.cache;
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] =  YLib.Util.sprintf.parse(key);
        }
        return  YLib.Util.sprintf.format.call(null, cache[key], arguments);
    }

    YLib.Util.sprintf.cache = {}
    YLib.Util.sprintf.re = {
        not_string: /[^s]/,
        number: /[def]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    }

    YLib.Util.sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = "";
        for (i = 0; i < tree_length; i++) {
            node_type = YLib.Util.sprintf.get_type(parse_tree[i]);
            if (node_type === "string") {
                output[output.length] = parse_tree[i];
            }
            else if (node_type === "array") {
                match = parse_tree[i]; // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]];
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (YLib.Util.sprintf.get_type(arg) == "function") {
                    arg = arg();
                }

                if (YLib.Util.sprintf.re.not_string.test(match[8]) && (YLib.Util.sprintf.get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", YLib.Util.sprintf.get_type(arg)));
                }

                if (YLib.Util.sprintf.re.number.test(match[8])) {
                    is_positive = arg >= 0;
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2);
                    break
                    case "c":
                        arg = String.fromCharCode(arg);
                    break
                    case "d":
                        arg = parseInt(arg, 10);
                    break
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                    break
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                    break
                    case "o":
                        arg = arg.toString(8);
                    break
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                    break
                    case "u":
                        arg = arg >>> 0;
                    break
                    case "x":
                        arg = arg.toString(16);
                    break
                    case "X":
                        arg = arg.toString(16).toUpperCase();
                    break
                }
                if (!is_positive || (YLib.Util.sprintf.re.number.test(match[8]) && match[3])) {
                    sign = is_positive ? "+" : "-";
                    arg = arg.toString().replace(YLib.Util.sprintf.re.sign, "");
                }
                pad_character = match[4] ? match[4] == "0" ? "0" : match[4].charAt(1) : " ";
                pad_length = match[6] - (sign + arg).length;
                pad = match[6] ? YLib.Util.sprintf.str_repeat(pad_character, pad_length) : "";
                output[output.length] = match[5] ? sign + arg + pad : (pad_character == 0 ? sign + pad + arg : pad + sign + arg);
            }
        }
        return output.join("");
    }

    YLib.Util.sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
        while (_fmt) {
            if ((match = YLib.Util.sprintf.re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0];
            }
            else if ((match = YLib.Util.sprintf.re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%";
            }
            else if ((match = YLib.Util.sprintf.re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [], replacement_field = match[2], field_match = [];
                    if ((field_match = YLib.Util.sprintf.re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1];
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = YLib.Util.sprintf.re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1];
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1];
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key");
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key");
                    }
                    match[2] = field_list;
                }
                else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
                }
                parse_tree[parse_tree.length] = match;
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder");
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return parse_tree;
    }

    YLib.Util.sprintf_array = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0);
        _argv.splice(0, 0, fmt);
        return YLib.Util.sprintf.apply(null, _argv);
    }
    YLib.Util.sprintf.get_type = function(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    YLib.Util.sprintf.str_repeat = function(input, multiplier) {
        return Array(multiplier + 1).join(input);
    }
/*
	/end of sprintf implementation
*/

}());




// shortcuts for most used utility functions
YLib.extend = YLib.Util.extend;
YLib.bind = YLib.Util.bind;
YLib.stamp = YLib.Util.stamp;
YLib.setOptions = YLib.Util.setOptions;
YLib.Class = function () {};
YLib.Class.prototype.settings = {};
YLib.Class.prototype.initialize = function () {

};
YLib.Class.prototype.showError = function(msg){
	$err = jQuery('<div class="msg alert alert-error"></div>');

	 msg = YLib.Util.sprintf('Error: %s', msg);

	if(typeof self.$messageFrame == 'undefined') self.$messageFrame == jQuery('#system-message-container');
	$err.html(msg);
	$err.insertBefore(self.$messageFrame);
};

YLib.Class.prototype.showMessage = function(msg){
	$msg = jQuery('<div class="msg alert alert-notification"></div>');

	if(typeof self.$messageFrame == 'undefined') self.$messageFrame == jQuery('#system-message-container');
	$msg.html(msg);
	$msg.insertBefore(self.$messageFrame);
};

YLib.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks) {
			this.callInitHooks();
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;

	var proto = new F();
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		YLib.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		YLib.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = YLib.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	YLib.extend(proto, props);

	proto._initHooks = [];

	var parent = this;
	var self = this;
	// jshint camelcase: false
	NewClass.__super__ = parent.prototype;

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parent.prototype.callInitHooks) {
			parent.prototype.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};
YLib.Class.include = function (props) {
	YLib.extend(this.prototype, props);
};
YLib.Class.mergeOptions = function (options) {
	YLib.extend(this.prototype.options, options);
};
YLib.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
};



var eventsKey = '_ylib_events';
YLib.Mixin = {};

//--------------------------- END OF LEAFLET CODE ------------------------------------------------------------------------------------



//--------------------------- BEGIN OF LEAFLET CODE ------------------------------------------------------------------------------------



YLib.Mixin.Events = {
	addEventListener: function (types, fn, context, once) { // (String, Function[, Object]) or (Object[, Object])

		// types can be a map of types/handlers
		if (YLib.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

		var events = this[eventsKey] = this[eventsKey] || {},
		    contextId = context && YLib.stamp(context),
		    i, len, event, type, indexKey, indexLenKey, typeIndex;

		// types can be a string of space-separated words
		types = YLib.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			event = {
				action: fn,
				context: context || this,
				once: once || false,
			};
			type = types[i];

			if (context) {
				// store listeners of a particular context in a separate hash (if it has an id)
				// gives a major performance boost when removing thousands of map layers

				indexKey = type + '_idx',
				indexLenKey = indexKey + '_len',

				typeIndex = events[indexKey] = events[indexKey] || {};

				if (!typeIndex[contextId]) {
					typeIndex[contextId] = [];

					// keep track of the number of keys in the index to quickly check if it's empty
					events[indexLenKey] = (events[indexLenKey] || 0) + 1;
				}

				typeIndex[contextId].push(event);


			} else {
				events[type] = events[type] || [];
				events[type].push(event);
			}
		}

		return this;
	},
	hasEventListeners: function (type) { // (String) -> Boolean
		var events = this[eventsKey];
		return !!events && ((type in events && events[type].length > 0) ||
		                    (type + '_idx' in events && events[type + '_idx_len'] > 0));
	},
	removeEventListener: function (types, fn, context) { // ([String, Function, Object]) or (Object[, Object])
		if (!this[eventsKey]) {
			return this;
		}

		if (!types) {
			return this.clearAllEventListeners();
		}

		if (YLib.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }

		var events = this[eventsKey],
		    contextId = context && YLib.stamp(context),
		    i, len, type, listeners, j, indexKey, indexLenKey, typeIndex;

		types = YLib.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			type = types[i];
			indexKey = type + '_idx';
			indexLenKey = indexKey + '_len';

			typeIndex = events[indexKey];

			if (!fn) {
				// clear all listeners for a type if function isn't specified
				delete events[type];
				delete events[indexKey];

			} else {
				listeners = context && typeIndex ? typeIndex[contextId] : events[type];

				if (listeners) {
					for (j = listeners.length - 1; j >= 0; j--) {
						if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
							listeners.splice(j, 1);
						}
					}

					if (context && typeIndex && (listeners.length === 0)) {
						delete typeIndex[contextId];
						events[indexLenKey]--;
					}
				}
			}
		}

		return this;
	},
	clearAllEventListeners: function () {
		delete this[eventsKey];
		return this;
	},
	fireEvent: function (type, data) { // (String[, Object])
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = YLib.Util.extend({}, data, { type: type, target: this });

		var events = this[eventsKey],
		    listeners, i, len, typeIndex, contextId;

		if (events[type]) {
			// make sure adding/removing listeners inside other listeners won't cause infinite loop
			listeners = events[type].slice();
			var remove = [];
			for (i = 0, len = listeners.length; i < len; i++) {
				if(!listeners[i] || !listeners[i].action) {
					console.log("invalid event handler for event "+type);
					break;
				}
				listeners[i].action.call(listeners[i].context || this, event);
				if(listeners[i].once) remove.push(i);
			}
			//remove one time listeners
			for (i = 0, len = remove.length; i < len; i++) {
				this.removeEventListener(type,remove[i].action);
			}
		}

		// fire event for the context-indexed listeners as well
		typeIndex = events[type + '_idx'];
		remove = [];
		for (contextId in typeIndex) {
			listeners = typeIndex[contextId];
			if (listeners) {
				for (i = 0, len = listeners.length; i < len; i++) {
					if(!listeners[i] || !listeners[i].action) {
						console.log("invalid event handler for event "+type);
						break;
					}
					listeners[i].action.call(listeners[i].context || this, event);
					if(listeners[i].once) remove.push(i);
				}
			}
		}
		//remove one time listeners
		for (i = 0, len = remove.length; i < len; i++) {
			this.removeEventListener(type,remove[i].action,remove[i].context);
		}

		return this;
	},
	addOneTimeEventListener: function (types, fn, context) {

		return this.addEventListener(types, fn, context, true);
	}
};
YLib.Mixin.Events.on = YLib.Mixin.Events.addEventListener;
YLib.Mixin.Events.off = YLib.Mixin.Events.removeEventListener;
YLib.Mixin.Events.once = YLib.Mixin.Events.addOneTimeEventListener;
YLib.Mixin.Events.fire = YLib.Mixin.Events.fireEvent;

//--------------------------- END OF LEAFLET CODE ------------------------------------------------------------------------------------
