import {
	AppInsights
} from "applicationinsights-js";

export default class AppInsightsAppender {
	debug(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, AI.SeverityLevel.Verbose);
	}

	info(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, AI.SeverityLevel.Information);
	}

	warn(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, AI.SeverityLevel.Warning);
	}

	error(logger, message) {
		AppInsights.trackException(message, "framework", { "id": logger.id }, {}, AI.SeverityLevel.Error);
	}
}
