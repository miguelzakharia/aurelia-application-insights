import { AppInsights } from "applicationinsights-js";

let AppInsightsAppender = class AppInsightsAppender {
	debug(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, 0);
	}

	info(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, 1);
	}

	warn(logger, message) {
		AppInsights.trackTrace(message, { "id": logger.id }, 2);
	}

	error(logger, message) {
		AppInsights.trackException(message, "framework", { "id": logger.id }, {}, 3);
	}
};
export { AppInsightsAppender as default };