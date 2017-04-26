"use strict";

System.register(["applicationinsights-js"], function (_export, _context) {
	"use strict";

	var AppInsights, AppInsightsAppender;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_applicationinsightsJs) {
			AppInsights = _applicationinsightsJs.AppInsights;
		}],
		execute: function () {
			_export("default", AppInsightsAppender = function () {
				function AppInsightsAppender() {
					_classCallCheck(this, AppInsightsAppender);
				}

				AppInsightsAppender.prototype.debug = function debug(logger, message) {
					AppInsights.trackTrace(message, { "id": logger.id }, 0);
				};

				AppInsightsAppender.prototype.info = function info(logger, message) {
					AppInsights.trackTrace(message, { "id": logger.id }, 1);
				};

				AppInsightsAppender.prototype.warn = function warn(logger, message) {
					AppInsights.trackTrace(message, { "id": logger.id }, 2);
				};

				AppInsightsAppender.prototype.error = function error(logger, message) {
					AppInsights.trackException(message, "framework", { "id": logger.id }, {}, 3);
				};

				return AppInsightsAppender;
			}());

			_export("default", AppInsightsAppender);
		}
	};
});