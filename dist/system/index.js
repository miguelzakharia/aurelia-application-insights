'use strict';

System.register(['aurelia-framework', './application-insights'], function (_export, _context) {
  "use strict";

  var PLATFORM, ApplicationInsights;
  function configure(aurelia, configCallback) {
    try {
      var instance = aurelia.container.get(ApplicationInsights);
      if (configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(instance);
      }

      aurelia.singleton(instance);

      aurelia.globalResources([PLATFORM.moduleName('./appinsights-props')]);
    } catch (err) {
      console.error("configure: %o", err);
    }
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaFramework) {
      PLATFORM = _aureliaFramework.PLATFORM;
    }, function (_applicationInsights) {
      ApplicationInsights = _applicationInsights.ApplicationInsights;
    }],
    execute: function () {}
  };
});