import { ApplicationInsights } from './application-insights';

export function configure(aurelia, configCallback) {
  try {
    const instance = aurelia.container.get(ApplicationInsights);
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(instance);
    }

    aurelia.singleton(instance);
  } catch (err) {
    console.error("configure: %o", err);
  }
}