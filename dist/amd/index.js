define(['exports', 'aurelia-framework', './application-insights'], function (exports, _aureliaFramework, _applicationInsights) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(aurelia, configCallback) {
    try {
      var instance = aurelia.container.get(_applicationInsights.ApplicationInsights);
      if (configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(instance);
      }

      aurelia.singleton(instance);

      aurelia.globalResources([_aureliaFramework.PLATFORM.moduleName('./appinsights-props')]);
    } catch (err) {
      console.error("configure: %o", err);
    }
  }
});