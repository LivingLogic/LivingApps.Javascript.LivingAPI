# Changes


## 0.9.1 (2019-05-13)

Removed test file.


## 0.9.0 (2019-05-13)

Fixed the package name in `package.json`.


## 0.8.0 (2019-05-13)

The LivingAPI source is a Javascript module now. However the default babeled
version in `dist/umd/livingapi.js` still uses UMD to support both Node and the
browser. For the module version use `dist/esm-node/ul4.js` (if you want to
use the module from Node) or `dist/esm-static/ul4.js` if you want to use the
module in a modern browser on https://my.living-apps.de/).

Building is now done with `rollup`.


## 0.7.0 (2019-04-15)

Renamed the class `DataSource` to `DataSourceData`.


## 0.6.0 (2019-04-15)

Registered `FlashMessage` with the UL4ON machinery (this shouldn't be
necessary as flash messages should be consumed by the HTML page itself). Moving
them over to Javascript might make sense for reactive frameworks but currently
this doesn't clear the list of flash messages in the server.
