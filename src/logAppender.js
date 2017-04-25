import {
	AppInsights
} from "applicationinsights-js";

export default class AppInsightsAppender {
	debug(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, /* Verbose */ 0);
	}

	info(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, /* Information */ 1);
	}

	warn(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, /* Warning */ 2);
	}

	error(logger, message) {
		AppInsights.trackException(message, "framework", { "id": logger.id }, {}, /* Error */ 3);
	}
}
