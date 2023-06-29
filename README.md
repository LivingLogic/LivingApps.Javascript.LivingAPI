# LivingAPI

This package provides a Javascript API for the objects provided by the
"LivingAPI" of the [LivingApps platform](https://www.living-apps.de/).

It allows you to work with LivingAPI objects in your Javascript code.

For more info about LivingApps and the LivingAPI see
https://my.living-apps.de/docs/LivingAPI.html (in german).


## Build instructions

Install the npm packages:

```
npm install
```

Build `dist/umd/livingapi.js`, `dist/esm-node/livingapi.js` and
`dist/esm-static/livingapi.js`:

```
npm run build
```


## Using the LivingAPI in your project

In your HTML include the following:

```html
<script src="{path_to_ul4}/dist/umd/ul4.js"></script>
<script src="{path_to_livingapi}/dist/umd/livingapi.js"></script>
```

now you can use the Javascript variable `la`.

Or if you want to use the LivingAPI on https://my.living-apps.de/ as a module,
do

```html
<script type="module">
	import * as la from '/static/livingapi/1.2.0/dist/esm-static/livingapi.js';
	...
</script>
```

or (if you need both UL4 and LivingAPI):

```html
<script type="module">
	import * as ul4 from '/static/ul4/1.15.3/dist/esm/ul4.js';
	import * as la from '/static/livingapi/1.2.0/dist/esm-static/livingapi.js';
	...
</script>
```

## Authors

- Walter Dörwald: `ul4.js` and `livingapi.js`

- René Schwarzinger: modifications in `livingapi.js`

- Peter Böker: modifications in `livingapi.js`
