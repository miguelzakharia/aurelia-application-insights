"use strict";

System.register(["aurelia-dependency-injection", "aurelia-event-aggregator", "aurelia-logging", "deepmerge", "applicationinsights-js", "./logAppender", "./appinsights-props"], function (_export, _context) {
	"use strict";

	var inject, EventAggregator, LogManager, deepmerge, AppInsights, AppInsightsAppender, dataKey, _createClass, _dec, _class, criteria, defaultOptions, delegate, ApplicationInsights;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

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
		return element.dataset[dataKey] != null && element.dataset[dataKey] != '';
	}

	return {
		setters: [function (_aureliaDependencyInjection) {
			inject = _aureliaDependencyInjection.inject;
		}, function (_aureliaEventAggregator) {
			EventAggregator = _aureliaEventAggregator.EventAggregator;
		}, function (_aureliaLogging) {
			LogManager = _aureliaLogging;
		}, function (_deepmerge) {
			deepmerge = _deepmerge.default;
		}, function (_applicationinsightsJs) {
			AppInsights = _applicationinsightsJs.AppInsights;
		}, function (_logAppender) {
			AppInsightsAppender = _logAppender.default;
		}, function (_appinsightsProps) {
			dataKey = _appinsightsProps.dataKey;
		}],
		execute: function () {
			_createClass = function () {
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

			criteria = {
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
			defaultOptions = {
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

			delegate = function delegate(criteria, listener) {
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

			_export("ApplicationInsights", ApplicationInsights = (_dec = inject(EventAggregator), _dec(_class = function () {
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

					this._options = deepmerge(defaultOptions, options);
					if (!this._initialized) {
						var errorMessage = "ApplicationInsights must be initialized before use.";
						this._log("error", errorMessage);
						throw new Error(errorMessage);
					}

					this._attachClickTracker();
					this._attachPageTracker();

					if (this._options.logForwarding.enabled) {
						LogManager.addAppender(new AppInsightsAppender(this));
					}
				};

				ApplicationInsights.prototype.init = function init(options) {
					if (!options || !options.instrumentationKey) {
						throw new Error('Options, including an instrumentationKey is required');
					}

					AppInsights.downloadAndSetup(options);
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
						var props = JSON.stringify(element.dataset[dataKey]);
						for (var propKey in props) {
							if (props.hasOwnProperty(propKey)) {
								dimensions[propKey] = props[propKey];
							}
						}
					}

					this._log("debug", dimensions);
					AppInsights.trackEvent('click', dimensions);
				};

				ApplicationInsights.prototype._trackPage = function _trackPage(path, title) {
					if (!this._initialized) {
						this._log("warn", "Try calling 'init()' before calling 'attach()'.");
						return;
					}

					this._log("debug", "Tracking path = " + path + ", title = " + title);
					AppInsights.trackPageView(title, path);
				};

				_createClass(ApplicationInsights, [{
					key: "initialized",
					get: function get() {
						return this._initialized;
					}
				}]);

				return ApplicationInsights;
			}()) || _class));

			_export("ApplicationInsights", ApplicationInsights);
		}
	};
});