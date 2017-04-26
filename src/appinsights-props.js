export var dataKey = 'appinsights';

export class AppinsightsPropsCustomAttribute {
	static inject = [Element];

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
}
