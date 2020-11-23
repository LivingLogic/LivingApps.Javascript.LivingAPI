# Changes


## HEAD (2020-10-??)

Renamed `AppLookupControl.lookupapp` to `lookup_app` and
`AppLookupControl.lookupcontrols` to `lookup_controls`.

Add the following attributes for hierarchical applookup to ``AppLookupControl``:
``local_master_control``, ``local_detail_controls`` and ``remote_master_control``.

Add attribute `favorite` to `App` and expose it to UL4. Expose `superid` to
UL4ON.


## 0.12.0 (2020-08-31)

Added classes `FileSignatureControl` and `HTMLControl`.

Added attributes `Globals.app` and `Globals.record`.


## 0.11.1 (2020-04-06)

Updated dependencies.


## 0.11.0 (2019-07-24)

Add support for the following attributes of the ``globals`` objects: ``lang``,
``datasources`` and ``hostname``.


## 0.10.0 (2019-05-13)

The UMD version is the default now (i.e. in `package.json/main`).

Update to UL4 1.1.0 (which has the same change).


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
