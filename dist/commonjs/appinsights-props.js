'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dataKey = exports.dataKey = 'appinsights';

var AppinsightsPropsCustomAttribute = exports.AppinsightsPropsCustomAttribute = (_temp = _class = function () {
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
}(), _class.inject = [Element], _temp);