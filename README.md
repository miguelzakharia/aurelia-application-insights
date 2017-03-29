# Aurelia-Application-Insights
An Aurelia plugin that adds [Microsoft Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) page and event tracking to your application with just a small amount of configuration. Set it up once and forget about it.

If you need a similar plugin for Google Analytics, check out [aurelia-google-analytics](https://github.com/miguelzakharia/aurelia-google-analytics).

## Getting Started

* Install aurelia-application-insights

```bash
yarn add aurelia-application-insights

# or ...
npm install aurelia-application-insights --save

# or ...
jspm install aurelia-application-insights
```

* Use the plugin in your app's main.js:

```javascript
export function configure(aurelia) {
    aurelia.use.plugin('aurelia-application-insights', config => {
			config.init('<Your Tracker ID>');
			config.attach({
				logging: {
					enabled: true // Set to `true` to have some log messages appear in the browser console.
				},
				pageTracking: {
					enabled: true // Set to `false` to disable in non-production environments.
				},
				clickTracking: {
					enabled: true // Set to `false` to disable in non-production environments.
				}
			});
		});

    aurelia.start().then(a => a.setRoot());
}
```

In order to use the click tracking feature, each HTML element you want to track must contain at least one `data-appinsights-*` attribute.
For example, you may want to categorize the clicks so you would add `data-appinsights-category="category 1"`. You can add as many of these attributes as you want. When the click event is catpured,
all of the `data-appinsights-*` attributes are parsed into a dimension dictionary that is sent to Application Insights. Assuming you have two attributes named `data-appinsights-category="category 1"` and `data-appinsights-label="button"`, the object sent to Application Insights will look like this:
```
{
	'category': 'category 1',
	'label': 'button'
}
```

## Building from source

Install dependencies

```shell
npm install
```

Then

```shell
gulp build
```

The result is 3 module formats separated by folder in `dist/`.

## Pull Requests

Yes, please!
