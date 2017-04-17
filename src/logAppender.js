import {
	AppInsights
} from "applicationinsights-js";

export default class AppInsightsAppender {
	constructor(plugin) {
		this._plugin = plugin;
	}

	debug(logger, message) {
		if (!this._plugin.initialized) {
			return;
		}

		AppInsights.trackTrace(message, { "id": logger.id }, AI.SeverityLevel.Verbose);
	}

	info(logger, message) {
		if (!this._plugin.initialized) {
			return;
		}
		AppInsights.trackTrace(message, { "id": logger.id }, AI.SeverityLevel.Information);
	}

	warn(logger, message) {
		if (!this._plugin.initialized) {
			return;
		}
		AppInsights.trackTrace(message, { "id": logger.id }, AI.SeverityLevel.Warning);
	}

	error(logger, message) {
		if (!this._plugin.initialized) {
			return;
		}
		AppInsights.trackException(message, "framework", { "id": logger.id }, {}, AI.SeverityLevel.Error);
	}
}
