'use strict';

System.register(['./application-insights'], function (_export, _context) {
  "use strict";

  var ApplicationInsights;
  function configure(aurelia, configCallback) {
    try {
      var instance = aurelia.container.get(ApplicationInsights);
      if (configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(instance);
      }

      aurelia.singleton(instance);
    } catch (err) {
      console.error("configure: %o", err);
    }
  }

  _export('configure', configure);

  return {
    setters: [function (_applicationInsights) {
      ApplicationInsights = _applicationInsights.ApplicationInsights;
    }],
    execute: function () {}
  };
});