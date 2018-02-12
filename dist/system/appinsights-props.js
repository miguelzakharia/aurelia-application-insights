'use strict';

System.register([], function (_export, _context) {
	"use strict";

	var _typeof, _class, _temp, dataKey, AppinsightsPropsCustomAttribute;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [],
		execute: function () {
			_typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
				return typeof obj;
			} : function (obj) {
				return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
			};

			_export('dataKey', dataKey = 'appinsights');

			_export('dataKey', dataKey);

			_export('AppinsightsPropsCustomAttribute', AppinsightsPropsCustomAttribute = (_temp = _class = function () {
				function AppinsightsPropsCustomAttribute(element) {
					_classCallCheck(this, AppinsightsPropsCustomAttribute);

					this.element = element;
				}

				AppinsightsPropsCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
					if (!((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) == 'object' && newValue !== null)) {
						this.element.dataset[dataKey] = '';
						return;
					}

					this.element.dataset[dataKey] = JSON.stringify(newValue);
				};

				return AppinsightsPropsCustomAttribute;
			}(), _class.inject = [Element], _temp));

			_export('AppinsightsPropsCustomAttribute', AppinsightsPropsCustomAttribute);
		}
	};
});