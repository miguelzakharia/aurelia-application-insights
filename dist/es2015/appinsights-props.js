var _class, _temp;

export var dataKey = 'appinsights';

export let AppinsightsPropsCustomAttribute = (_temp = _class = class AppinsightsPropsCustomAttribute {

	constructor(element) {
		this.element = element;
	}

	valueChanged(newValue) {
		if (!(typeof newValue == 'object' && newValue !== null)) {
			this.element.dataset[dataKey] = '';
			return;
		}

		this.element.dataset[dataKey] = JSON.stringify(newValue);
	}
}, _class.inject = [Element], _temp);