# Changes

## HEAD (2023-??-??)

Merge app fields `iconlarge` and `iconsmall` into `image`.

Merge user fields `avatarlarge` and `avatarsmall` into `image`.

Merge image layout control fields `original` and `scaled` into `image`.

Remove `ImageAttachment`.


## 1.1.4 (2023-04-12)

Fixed `Globals.dist` when the distance is zero (which would lead to a division
by zero).


## 1.1.3 (2023-03-17)

Regenerate minified files.


## 1.1.2 (2023-03-17)

Fix the UL4 module `la` (`la.MenuItem` was broken).


## 1.1.0 (2023-03-17)

Add `Panel` attributes `header_type`, `header_background`, `text_color`,
`background_color1` and `background_color2`.


## 1.0.1 (2023-03-16)

Fixed name of the attribute for the "nothing selected" option: `nonekey` has
been renamed to `none_key` and `nonelabel` has been renamed to `none_label`.

Added the class `MenuItem` and `Panel` and the `App` attributes `menus` and
`panel` for the menus/panels that appear on various LivingApps pages.

Added attribute `App.datasource`.

Fixed name of "geo distance" method (`Globals.dist()`).


## 1.0.0 (2023-02-02)

The image of a `ImageLayoutControl` can now be changed (via Javascript and UL4).

Change format of tag to use `1.0.0` instead of `rel-1-0-0`.


## 0.16.0 (2022-11-29)

Added property `View.globals`.

Added methods `Field.add_error(error)` and `Field.set_error(error)`.

Fixed various implementations of the `[ul4.symbols.setattr]` method.

Added `LayoutControl.visible` as a property and a UL4 attribute.


## 0.15.0 (2022-11-02)

Added the following methods to `App`: `template_url`, `new_embedded_url` and
`new_standalone_url`.

Added the following methods to `Record`: `template_url`, `edit_embedded_url` and
`edit_standalone_url`.

Update attributes of `AppParameter`.


## 0.14.3 (2022-07-11)

Pass `app` when rendering the update templates.

Updated dependencies.


## 0.14.2 (2022-06-17)

Fixed a typo in the setter for `Field.value`.


## 0.14.1 (2022-06-17)

When setting a field to a value in the form, avoid creating `Record.values`
when we don't have to.

Treat `null` as an empty value for string fields, instead of generating the
string `"null"`.


## 0.14.0 (2022-06-14)

Merged form functionality into the LivingAPI, i.e. in mode `form/*/*` when
getting or setting field attributes of fields of the global `record` variable,
values are fetched from/set on the DOM.

Added support for UL4 type objects for all LivingAPI classes.

Added support for custom attributes (whose name starts with `x_`) to most
LivingAPI classes.

Added several shortcut attributes for layout controls and parameters.

`Globals` now supports the standard LivingAPI logging functions
(`Globals.log_debug()` etc.) They log to the Javascript console.

Added `ButtonLayoutControl`.

Added `Globals.current_geo()` which returns the current geographical location
(which must be set beforehand via `Globals.set_current_geo()`).

Added attributes to `NumberControl`: `precision`, `minimum` and `maximum`.

Updated `File` attributes: Added `url`, `archived_url`, `archive` and `geo`.


## 0.13.2 (2022-02-22)

Fixed handling of `ul4.Date_` objects in `DateFieldBase.validate()`
(and subclasses).


## 0.13.1 (2021-12-22)

Fixed creating `Field` objects: Now for each control type the matching field
type will be used: e.g. the value for a `StringControl` will be in a
`StringField`.

Fix setting the initial value of a field: Now the value goes through the
normal field validation.


## 0.13.0 (2021-11-30)

Renamed `AppLookupControl.lookupapp` to `lookup_app` and
`AppLookupControl.lookupcontrols` to `lookup_controls`.

Add the following attributes for hierarchical applookup to ``AppLookupControl``:
``local_master_control``, ``local_detail_controls`` and ``remote_master_control``.

Add attribute `favorite` to `App` and expose it to UL4. Expose `superid` to
UL4ON.

Rename `App.language` to `App.lang`.

Added `Globals.mode` which is the template mode we're running in. Valid values
are `"form/new/init"`, `"form/new/search"`, `"form/new/failed"`,
`"form/new/presave"`, `"form/new/postsave"`, `"form/edit/init"`,
`"form/edit/search"`, `"form/edit/failed"`, `"form/edit/presave`,
`"form/edit/postsave"`, `"view/list"`, `"view/detail"`, `"view/support"`,
`"email/text` and `email/html"`.

Most LivingAPI objects are now persistent objects.

Updated the code to directly use `Set` and `Map`.

Implement `Globals.scaledURL()`.

All LivingAPI object now implement `toString()` (by calling `repr()`).

Add the classes `ViewControl`, `HTMLLayoutControl` and `ImageLayoutControl` and
attributes `View.controls` and `App.active_view`.

Setting `App.active_view` to a `View` objects makes `Control` attributes honor
the additional information defined in the `View`.

Added `View` attributes `lang`, `controls` and `layout_controls`.

Added `App` attribute `layout_controls`.

Added various `Control` attributes that are used in `View`s: `top`, `left`,
`width`, `height`, `default`, `tabindex`, `minlength`, `maxlength`, `required`,
`placeholder`, `mode`, `labelpos`, `autoalign` and `labelwidth`.

Added attribute `format` to `DateControl`.

Added attributes `none_key` and `none_label` to `LookupControl`,
`MultipleLookupControl`, `AppLookupControl` and `MultipleAppLookupControl`.

Implemented field value validation and support for field default values.


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
