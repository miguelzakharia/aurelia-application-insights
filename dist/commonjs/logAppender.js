"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _applicationinsightsJs = require("applicationinsights-js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppInsightsAppender = function () {
	function AppInsightsAppender() {
		_classCallCheck(this, AppInsightsAppender);
	}

	AppInsightsAppender.prototype.debug = function debug(logger, message) {
		_applicationinsightsJs.AppInsights.trackTrace(message, { "id": logger.id }, 0);
	};

	AppInsightsAppender.prototype.info = function info(logger, message) {
		_applicationinsightsJs.AppInsights.trackTrace(message, { "id": logger.id }, 1);
	};

	AppInsightsAppender.prototype.warn = function warn(logger, message) {
		_applicationinsightsJs.AppInsights.trackTrace(message, { "id": logger.id }, 2);
	};

	AppInsightsAppender.prototype.error = function error(logger, message) {
		_applicationinsightsJs.AppInsights.trackException(message, "framework", { "id": logger.id }, {}, 3);
	};

	return AppInsightsAppender;
}();

exports.default = AppInsightsAppender;