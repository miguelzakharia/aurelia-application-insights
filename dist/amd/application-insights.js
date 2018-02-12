define(["exports", "aurelia-dependency-injection", "aurelia-event-aggregator", "aurelia-logging", "deepmerge", "applicationinsights-js", "./logAppender", "./appinsights-props"], function (exports, _aureliaDependencyInjection, _aureliaEventAggregator, _aureliaLogging, _deepmerge, _applicationinsightsJs, _logAppender, _appinsightsProps) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ApplicationInsights = undefined;

	var LogManager = _interopRequireWildcard(_aureliaLogging);

	var _deepmerge2 = _interopRequireDefault(_deepmerge);

	var _logAppender2 = _interopRequireDefault(_logAppender);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var _dec, _class;

	var criteria = {
		isElement: function isElement(e) {
			return e instanceof HTMLElement;
		},
		hasClass: function hasClass(cls) {
			return function (e) {
				return criteria.isElement(e) && e.classList.contains(cls);
			};
		},
		hasTrackingInfo: function hasTrackingInfo(e) {
			return criteria.isElement(e) && (getAttributesLike('data-appinsights-', e.attributes).length > 0 || hasTrackProps(e));
		},
		isOfType: function isOfType(e, type) {
			return criteria.isElement(e) && e.nodeName.toLowerCase() === type.toLowerCase();
		},
		isAnchor: function isAnchor(e) {
			return criteria.isOfType(e, 'a');
		},
		isButton: function isButton(e) {
			return criteria.isOfType(e, 'button');
		}
	};

	var defaultOptions = {
		logging: {
			enabled: true
		},
		logForwarding: {
			enabled: true
		},
		pageTracking: {
			enabled: false,
			getTitle: function getTitle(payload) {
				return payload.instruction.config.title;
			}
		},
		clickTracking: {
			enabled: false,
			filter: function filter(element) {
				return criteria.isElement(element) && (criteria.isAnchor(element) || criteria.isButton(element));
			}
		}
	};

	function getAttributesLike(partial, attributes) {
		var results = [];
		for (var x = 0; x < attributes.length; ++x) {
			if (attributes[x].name.indexOf(partial) >= 0) {
				results.push(attributes[x]);
			}
		}
		return results;
	}

	function hasTrackProps(element) {
		return element.dataset[_appinsightsProps.dataKey] != null && element.dataset[_appinsightsProps.dataKey] != '';
	}

	var delegate = function delegate(criteria, listener) {
		return function (evt) {
			var el = evt.target;
			do {
				if (criteria && !criteria(el)) continue;
				evt.delegateTarget = el;
				listener.apply(this, arguments);
				return;
			} while (el = el.parentNode);
		};
	};

	var ApplicationInsights = exports.ApplicationInsights = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
		function ApplicationInsights(eventAggregator) {
			_classCallCheck(this, ApplicationInsights);

			this._eventAggregator = eventAggregator;
			this._initialized = false;
			this._logger = LogManager.getLogger('application-insights-plugin');
			this._options = defaultOptions;

			this._trackClick = this._trackClick.bind(this);
			this._trackPage = this._trackPage.bind(this);
		}

		ApplicationInsights.prototype.attach = function attach() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;

			this._options = (0, _deepmerge2.default)(defaultOptions, options);
			if (!this._initialized) {
				var errorMessage = "ApplicationInsights must be initialized before use.";
				this._log("error", errorMessage);
				throw new Error(errorMessage);
			}

			this._attachClickTracker();
			this._attachPageTracker();

			if (this._options.logForwarding.enabled) {
				LogManager.addAppender(new _logAppender2.default(this));
			}
		};

		ApplicationInsights.prototype.init = function init(options) {
			if (!options || !options.instrumentationKey) {
				throw new Error('Options, including an instrumentationKey is required');
			}

			_applicationinsightsJs.AppInsights.downloadAndSetup(options);
			this._initialized = true;
		};

		ApplicationInsights.prototype._attachClickTracker = function _attachClickTracker() {
			if (!this._options.clickTracking.enabled) {
				return;
			}

			document.querySelector("body").addEventListener("click", delegate(this._options.clickTracking.filter, this._trackClick));
		};

		ApplicationInsights.prototype._attachPageTracker = function _attachPageTracker() {
			var _this = this;

			if (!this._options.pageTracking.enabled) {
				return;
			}

			this._eventAggregator.subscribe("router:navigation:success", function (payload) {
				_this._trackPage(payload.instruction.fragment, _this._options.pageTracking.getTitle(payload));
			});
		};

		ApplicationInsights.prototype._log = function _log(level, message) {
			if (!this._options.logging.enabled) {
				return;
			}

			this._logger[level](message);
		};

		ApplicationInsights.prototype._trackClick = function _trackClick(evt) {
			if (!this._initialized) {
				this._log("warn", "The component has not been initialized. Please call 'init()' before calling 'attach()'.");
				return;
			}
			if (!evt || !evt.delegateTarget || !criteria.hasTrackingInfo(evt.delegateTarget)) {
				return;
			}

			var dimensions = {};
			var element = evt.delegateTarget;
			var matches = getAttributesLike('data-appinsights-', element.attributes);
			matches.forEach(function (match) {
				return dimensions[match.name.toLowerCase().replace('data-appinsights-', '')] = match.value;
			});

			if (hasTrackProps(element)) {
				var props = JSON.stringify(element.dataset[_appinsightsProps.dataKey]);
				for (var propKey in props) {
					if (props.hasOwnProperty(propKey)) {
						dimensions[propKey] = props[propKey];
					}
				}
			}

			this._log("debug", dimensions);
			_applicationinsightsJs.AppInsights.trackEvent('click', dimensions);
		};

		ApplicationInsights.prototype._trackPage = function _trackPage(path, title) {
			if (!this._initialized) {
				this._log("warn", "Try calling 'init()' before calling 'attach()'.");
				return;
			}

			this._log("debug", "Tracking path = " + path + ", title = " + title);
			_applicationinsightsJs.AppInsights.trackPageView(title, path);
		};

		_createClass(ApplicationInsights, [{
			key: "initialized",
			get: function get() {
				return this._initialized;
			}
		}]);

		return ApplicationInsights;
	}()) || _class);
});