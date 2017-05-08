/**
 * application-insights.js - Provides an abstraction over code that calls Microsoft Application Insights
 * for user tracking. Attaches to router:navigation:success event to track when
 * a page has been loaded. Registers a click event handler for elements that are defined
 * in the filter function to track clicks.
 */

import {
	inject
} from "aurelia-dependency-injection";
import {
	EventAggregator
} from "aurelia-event-aggregator";
import * as LogManager from "aurelia-logging";
import deepmerge from "deepmerge";
import {
	AppInsights
} from "applicationinsights-js";
import AppInsightsAppender from "./logAppender";
import {
	dataKey
} from "./appinsights-props";

/* Example
.plugin('aurelia-google-analytics', config => {
	config.init('<Tracker ID here>');
	config.attach({
		logging: {
			enabled: true
		},
		logForwarding: {
			enabled: true
		},
		pageTracking: {
			enabled: true,
			getTitle: function(payload) {
				return payload.instruction.config.title;
			}
		},
		clickTracking: {
			enabled: true,
			filter: (element) => {
				return element instanceof HTMLElement &&
				(element.nodeName.toLowerCase() === 'a' ||
					element.nodeName.toLowerCase() === 'button');
			}
		}
	});
})
*/

const criteria = {
	isElement: function (e) {
		return e instanceof HTMLElement;
	},
	hasClass: function (cls) {
		return function (e) {
			return criteria.isElement(e) && e.classList.contains(cls);
		};
	},
	hasTrackingInfo: function (e) {
		return criteria.isElement(e) && 
			(getAttributesLike('data-appinsights-', e.attributes).length > 0 || hasTrackProps(e));
	},
	isOfType: function (e, type) {
		return criteria.isElement(e) &&
			e.nodeName.toLowerCase() === type.toLowerCase();
	},
	isAnchor: function (e) {
		return criteria.isOfType(e, 'a');
	},
	isButton: function (e) {
		return criteria.isOfType(e, 'button');
	}
};

const defaultOptions = {
	logging: {
		enabled: true
	},
	logForwarding: {
		enabled: true
	},
	pageTracking: {
		enabled: false,
		getTitle: function (payload) {
			return payload.instruction.config.title;
		}
	},
	clickTracking: {
		enabled: false,
		filter: function (element) {
			return criteria.isElement(element) &&
				(criteria.isAnchor(element) ||
					criteria.isButton(element));
		}
	}
};

function getAttributesLike(partial, attributes) {
	const results = [];
	for (let x = 0; x < attributes.length; ++x) {
		if (attributes[x].name.indexOf(partial) >= 0) {
			results.push(attributes[x]);
		}
	}
	return results;
}

function hasTrackProps(element) {
	return element.dataset[dataKey] != null && element.dataset[dataKey] != '';
}

const delegate = function (criteria, listener) {
	return function (evt) {
		let el = evt.target;
		do {
			if (criteria && !criteria(el)) continue;
			evt.delegateTarget = el;
			listener.apply(this, arguments);
			return;
		} while ((el = el.parentNode));
	};
};

@inject(EventAggregator)
export class ApplicationInsights {
	constructor(eventAggregator) {
		this._eventAggregator = eventAggregator;
		this._initialized = false;
		this._logger = LogManager.getLogger('application-insights-plugin');
		this._options = defaultOptions;

		this._trackClick = this._trackClick.bind(this);
		this._trackPage = this._trackPage.bind(this);
	}

	get initialized() {
		return this._initialized;
	}

	attach(options = defaultOptions) {
		this._options = deepmerge(defaultOptions, options);
		if (!this._initialized) {
			const errorMessage = "ApplicationInsights must be initialized before use.";
			this._log("error", errorMessage);
			throw new Error(errorMessage);
		}

		this._attachClickTracker();
		this._attachPageTracker();

		if (this._options.logForwarding.enabled) {
			LogManager.addAppender(new AppInsightsAppender(this));
		}
	}

	init(key) {
		AppInsights.downloadAndSetup({ instrumentationKey: key });
		this._initialized = true;
	}

	_attachClickTracker() {
		if (!this._options.clickTracking.enabled) {
			return;
		}

		document
			.querySelector("body")
			.addEventListener(
				"click",
				delegate(this._options.clickTracking.filter, this._trackClick)
			);
	}

	_attachPageTracker() {
		if (!this._options.pageTracking.enabled) {
			return;
		}

		this._eventAggregator.subscribe("router:navigation:success", payload => {
			this._trackPage(
				payload.instruction.fragment,
				this._options.pageTracking.getTitle(payload)
			);
		});
	}

	_log(level, message) {
		if (!this._options.logging.enabled) {
			return;
		}

		this._logger[level](message);
	}

	_trackClick(evt) {
		if (!this._initialized) {
			this._log(
				"warn",
				"The component has not been initialized. Please call 'init()' before calling 'attach()'."
			);
			return;
		}
		if (!evt ||
			!evt.delegateTarget ||
			!criteria.hasTrackingInfo(evt.delegateTarget)
		) {
			return;
		}

		const dimensions = {};
		const element = evt.delegateTarget;
		const matches = getAttributesLike('data-appinsights-', element.attributes);
		matches.forEach(match =>
			dimensions[match.name.toLowerCase().replace('data-appinsights-', '')] = match.value
		);
		
		if (hasTrackProps(element)) {
			const props = JSON.stringify(element.dataset[dataKey]);
			for (const propKey in props) {
				if (props.hasOwnProperty(propKey)) {
					dimensions[propKey] = props[propKey];
				}
			}
		}

		this._log("debug", dimensions);
		AppInsights.trackEvent('click', dimensions);
	}

	_trackPage(path, title) {
		if (!this._initialized) {
			this._log("warn", "Try calling 'init()' before calling 'attach()'.");
			return;
		}

		this._log("debug", `Tracking path = ${path}, title = ${title}`);
		AppInsights.trackPageView(title, path);
	}
}
