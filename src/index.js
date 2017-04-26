import {
	PLATFORM
} from "aurelia-framework";

import {
  ApplicationInsights
} from './application-insights';

export function configure(aurelia, configCallback) {
  try {
    const instance = aurelia.container.get(ApplicationInsights);
    if (configCallback !== undefined && typeof (configCallback) === 'function') {
      configCallback(instance);
    }

    aurelia.singleton(instance);

		aurelia.globalResources([
			PLATFORM.moduleName('./appinsights-props')
		]);
  } catch (err) {
    console.error("configure: %o", err);
  }
}
