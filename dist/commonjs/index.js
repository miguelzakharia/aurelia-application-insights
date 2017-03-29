'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;

var _applicationInsights = require('./application-insights');

function configure(aurelia, configCallback) {
  try {
    var instance = aurelia.container.get(_applicationInsights.ApplicationInsights);
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(instance);
    }

    aurelia.singleton(instance);
  } catch (err) {
    console.error("configure: %o", err);
  }
}