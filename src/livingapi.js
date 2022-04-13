/*!
 * LivingAPI JavaScript Library
 * https://my.living-apps.de/docs/LivingAPI.html
 *
 * Copyright 2017-2022 by LivingLogic AG, Bayreuth/Germany
 * Copyright 2017-2022 by Walter Dörwald
 *
 * All Rights Reserved
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Version of this Javascript package
import { version } from '../package.json';

export { version };

import * as ul4 from '@livinglogic/ul4';


export class Base extends ul4.Proto
{
	constructor(id)
	{
		super();
		this.id = id;
	}

	get ul4onid()
	{
		return this.id;
	}

	ul4ondump(encoder)
	{
		for (let i = 0; i < this._ul4onattrs.length; ++i)
			encoder.dump(this._dumpUL4ONAttr(this._ul4onattrs[i]));
	}

	_dumpUL4ONAttr(name)
	{
		return this[name];
	}

	ul4onload(decoder)
	{
		let i = 0;
		for (let iter = decoder.loadcontent(); ; ++i)
		{
			let iteritem = iter.next();
			if (iteritem.done)
				break;
			if (i < this._ul4onattrs.length)
				this._loadUL4ONAttr(this._ul4onattrs[i], iteritem.value);
		}
		for (; i < this._ul4onattrs.length; ++i)
			this._setDefaultUL4ONAttr(this._ul4onattrs[i]);
	}

	_loadUL4ONAttr(name, value)
	{
		this[name] = value;
	}

	_setDefaultUL4ONAttr(name)
	{
		this[name] = null;
	}

	[ul4.symbols.getattr](name)
	{
		if (this._ul4attrs.has(name))
		{
			let value = this[name];
			if (typeof(value) === "function")
			{
				let realvalue = value.bind(this);
				realvalue._ul4_name = value._ul4_name || value.name;
				realvalue._ul4_signature = value._ul4_signature;
				realvalue._ul4_needsobject = value._ul4_needsobject;
				realvalue._ul4_needscontext = value._ul4_needscontext;
				return realvalue;
			}
			return value;
		}
		throw new ul4.AttributeError(this, name);
	}

	[ul4.symbols.repr]()
	{
		return "<" + this.constructor.name + ">";
	}

	toString()
	{
		return this[ul4.symbols.repr]();
	}
};


export class Handler
{
	save(record)
	{
	}

	delete(record)
	{
	}
};


export class Globals extends Base
{
	static classdoc = "Global information";

	constructor(id)
	{
		super(id);
		this.version = null;
		this.hostname = null;
		this.platform = null;
		this.user = null;
		this.lang = null;
		this.app = null;
		this.record = null;
		this.maxdbactions = null;
		this.maxtemplateruntime = null;
		this.flashmessages = null;
		this.handler = new Handler();
	}

	// distance between two geo coordinates (see https://de.wikipedia.org/wiki/Orthodrome#Genauere_Formel_zur_Abstandsberechnung_auf_der_Erde)
	static geodist(geo1, geo2)
	{
		let sqsin = function sqsin(x) {x = Math.sin(x); return x*x};
		let sqcos = function sqsos(x) {x = Math.cos(x); return x*x};
		const deg2rad = Math.PI/180; // Conversion factor degree -> radians
		const radius = 6378.137; // Equatorial radius of earth in km
		const flat = 1/298.257223563; // Earth flattening

		const lat1 = geo1.lat * deg2rad;
		const long1 = geo1.long * deg2rad;
		const lat2 = geo2.lat * deg2rad;
		const long2 = geo2.long * deg2rad;
		const F = (lat1 + lat2)/2;
		const G = (lat1 - lat2)/2;
		const l = (long1 - long2)/2;
		const S = sqsin(G) * sqcos(l) + sqcos(F) * sqsin(l);
		const C = sqcos(G) * sqcos(l) + sqsin(F) * sqsin(l);
		const w = Math.atan(Math.sqrt(S/C));
		const D = 2 * w * radius;
		const T = Math.sqrt(S*C)/w;
		const H1 = (3*T-1)/(2*C);
		const H2 = (3*T+1)/(2*S);
		const s = D * (1 + flat * H1 * sqsin(F) * sqcos(G) - flat * H2 * sqcos(F) * sqsin(G));
		return s;
	}

	scaledURL(url, width, height, type="fill", enlarge=true, gravity="sm", quality=null, rotate=null, blur=null, sharpen=null, format=null, cache=true)
	{
		let filename = null;

		if (url instanceof File)
		{
			url = "https://" + this.hostname + url.url;
			filename = encodeURIComponent(url.filename);
			if (filename != url.filename)
				filename = null;
		}

		let result = "";

		if (cache)
			result += "/imgproxycache/insecure";
		else
			result += "/imgproxy/insecure";

		if (type !== "fit")
			result += "/rt:" + type;

		if (width !== null && width !== undefined)
			result += "/w:" + width;

		if (height !== null && height !== undefined)
			result += "/h:" + height;

		if (enlarge)
			result += "/el:1";

		if (gravity !== null && gravity !== undefined)
			result += "/g:" + gravity;

		if (quality !== null && quality !== undefined)
			result += "/q:" + quality;

		if (rotate !== null && rotate % 360 != 0)
			result += "/rot:" + rotatet;

		if (blur !== null && blur !== undefined)
			result += "/bl:" + blur;

		if (sharpen !== null && sharpen !== undefined)
			result += "/sh:" + sharpen;

		if (format !== null && format !== undefined)
			result += "/f:" + format;

		if (filename !== null && filename !== undefined)
			result += "/fn:" + filename;

		result += "/plain/" + encodeURIComponent(url);

		return result;
	}

	[ul4.symbols.repr]()
	{
		return "<Globals version=" + ul4._repr(this.version) + ">";
	}
};

Globals.prototype._ul4onattrs = ["version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages", "lang", "datasources", "hostname", "app", "record", "mode", "view_template_id", "email_template_id", "view_id"];
Globals.prototype._ul4attrs = new Set(["version", "hostname", "platform", "user", "lang", "app", "record", "maxdbactions", "maxtemplateruntime", "flashmessages", "mode"]);


export class FlashMessage extends Base
{
	static classdoc = "A flash message in a web page";

	[ul4.symbols.repr]()
	{
		return "<FlashMessage type=" + ul4._repr(this.type) + " title=" + ul4._repr(this.title) + ">";
	}
};

FlashMessage.prototype._ul4onattrs = ["timestamp", "type", "title", "message"];
FlashMessage.prototype._ul4attrs = new Set(["timestamp", "type", "title", "message"]);


export class App extends Base
{
	static classdoc = "A LivingApps application";

	[ul4.symbols.repr]()
	{
		return "<App id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}

	insert(values={})
	{
		let record = this[ul4.symbols.call](values);
		this.globals.handler.save(this);
		return record;
	}

	get layout_controls()
	{
		if (this.active_view === null)
			return new Map();
		return this.active_view.layout_controls;
	}

	[ul4.symbols.call](values={})
	{
		let record = new Record(null, this);
		if (ul4._ismap(values))
		{
			for (let identifier of values.keys())
			{
				if (!record.fields.has(identifier))
					throw new ul4.ArgumentError(ul4._repr(this) + "() get an unexpected keyword argument " + ul4._repr(identifier));
			}
			record._make_fields(true, values, null, null);
		}
		else if (ul4._isobject(values))
		{
			for (let identifier in values)
			{
				if (!record.fields.has(identifier))
					throw new ul4.ArgumentError(ul4._repr(this) + "() get an unexpected keyword argument " + ul4._repr(identifier));
			}
			record._make_fields(true, new Map(ul4._list(ul4.dicttype.items(values))), null, null);
		}
		else
			throw new ul4.TypeError("values must be an object or a Map");
		return record;
	}

	[ul4.symbols.getattr](name)
	{
		if (name.startsWith("c_"))
		{
			if (!this.controls.has(name.substr(2)))
				throw new ul4.AttributeError(this, name);
			return this.controls.get(name.substr(2));
		}
		else if (name.startsWith("p_") && this.params !== null)
		{
			if (!this.params.has(name.substr(2)))
				throw new ul4.AttributeError(this, name);
			return this.params.get(name.substr(2));
		}
		else if (name.startsWith("pv_") && this.params !== null)
		{
			if (!this.params.has(name.substr(3)))
				throw new ul4.AttributeError(this, name);
			return this.params.get(name.substr(3)).value;
		}
		else
			return super[ul4.symbols.getattr](name);
	}

	get active_view()
	{
		return this._active_view;
	}

	set active_view(view)
	{
		if (view === null)
			;
		else if (typeof(view) === "string")
		{
			if (this.views !== null && this.views.has(view))
				view = this.views.get(view);
			else
				throw new ul4.ValueError("View " + ul4._repr(view) + " not found!");
		}
		else if (view instanceof View)
		{
			if (view.app === this)
				;
			else
				throw new ul4.ValueError("View " + ul4._repr(view) + " belongs to the wrong app!");
		}
		else
		{
			throw new ul4.TypeError(ul4._repr(view) + " is not a view!");
		}

		this._active_view = view;
	}
};


App.prototype._ul4onattrs = ["globals", "name", "description", "lang", "startlink", "iconlarge", "iconsmall", "createdby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "basetable", "primarykey", "insertprocedure", "updateprocedure", "deleteprocedure", "templates", "createdat", "updatedat", "updatedby", "superid", "favorite", "_active_view"];
App.prototype._ul4attrs = new Set(["id", "globals", "name", "description", "lang", "startlink", "iconlarge", "iconsmall", "createdat", "createdby", "updatedat", "updatedby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "insert", "favorite", "_active_view"]);
ul4.expose(App.prototype[ul4.symbols.call], ["**values"], {"needsobject": true});
ul4.expose(App.prototype.insert, ["**values"], {"needsobject": true});


export class View extends Base
{
	static classdoc = "An input form for a LivingApps application";

	[ul4.symbols.repr]()
	{
		return "<View id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

View.prototype._ul4onattrs = ["name", "combined_type", "app", "order", "width", "height", "start", "end", "controls", "layout_controls", "lang"];
View.prototype._ul4attrs = new Set(["id", "name", "combined_type", "app", "order", "width", "height", "start", "end", "controls", "layout_controls", "lang"]);


export class DataSource extends Base
{
	static classdoc = "The data resulting from a data source configuration";

	[ul4.symbols.repr]()
	{
		return "<DataSource id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

DataSource.prototype._ul4onattrs = ["identifier", "app", "apps"];
DataSource.prototype._ul4attrs = new Set(["id", "identifier", "app", "apps"]);


export class Record extends Base
{
	static classdoc = "A record of a LivingApp application";

	constructor(id, app)
	{
		super(id);
		this.app = app;
		this.createdat = null;
		this.createdby = null;
		this.updatedat = null;
		this.updatedby = null;
		this.updatecount = 0;
		this._sparsevalues = new Map();
		this._values = null;
		this._fields = null;
		this.children = new Map();
		this.attachments = null;
		this.errors = [];
		this._sparsefielderrors = null;
		this._sparsefieldlookupdata = null;
		this._is_deleted = false;
		this._is_new = true;
	}

	_make_fields(defaults, values, errors, lookupdata)
	{
		let fields = new Map();

		for (let control of this.app.controls.values())
		{
			let identifier = control.identifier;
			let value = null;
			if (values !== null)
			{
				if (defaults && !values.has(identifier))
					value = control.default;
				else if (values.has(identifier))
					value = values.get(identifier);
			}
			let field = new control.fieldtype(control, this, value);
			fields.set(identifier, field);
			if (errors !== null && errors.has(identifier))
				field.errors = errors.get(identifier);
			if (lookupdata !== null && lookupdata.has(identifier))
				field.lookupdata = lookupdata.get(identifier);
		}

		this._fields = fields;
		this._sparsevalues = null;
		this._sparsefielderrors = null;
		this._sparselookupdata = null;
	}

	_in_form()
	{
		let globals = this.app.globals;

		return globals.mode !== null && globals.mode.startsWith("form/") && this === globals.record;
	}

	[ul4.symbols.repr]()
	{
		let v = ["<Record id=", ul4._repr(this.id)];
		for (let field of this.fields.values())
		{
			if (field.control.priority && !field.is_empty())
			{
				v.push(" v_");
				v.push(field.control.identifier);
				v.push("=");
				v.push(ul4._repr(field.value)); // FIXME: This might lead to infinite recursions
			}
		}
		v.push(" state=");
		v.push(ul4._repr(this.state));
		v.push(">");
		return v.join("");
	}

	get state()
	{
		if (this._is_deleted)
			return "deleted";
		else if (this._is_new)
			return "new";
		else if (this.is_dirty())
			return "dirty";
		else
			return "saved";
	}

	get values()
	{
		if (this._values === null)
		{
			this._values = new Map();
			for (let field of this.fields.values())
			{
				this._values.set(field.control.identifier, field.value);
			}
		}
		return this._values;
	}

	get fields()
	{
		if (this._fields === null)
			this._make_fields(false, this._sparsevalues, this._sparsefielderrors, this._sparsefieldlookupdata)
		return this._fields;
	}

	is_dirty()
	{
		if (this.id === null)
			return true;
		for (let field of this.fields.values())
		{
			if (field.is_dirty())
				return true;
		}
		return false;
	}

	has_errors()
	{
		if (this.errors.length !== 0)
			return true;
		for (let field of this.fields.values())
		{
			if (field.has_errors())
				return true;
		}
		return false;
	}

	delete()
	{
		let result = this.app.globals.handler.delete(this);
		this._is_deleted = true;
		return result;
	}

	save()
	{
		this.app.globals.handler.save(this);
	}

	update(values={})
	{
		if (ul4._ismap(values))
		{
			for (let [key, value] of values.entries())
			{
				if (!this.fields.has(key))
					throw new ul4.ArgumentError("update() get an unexpected keyword argument " + ul4._repr(key));
				fields.get(key).value = value;
			}
		}
		else if (ul4._isobject(values))
		{
			for (let key in values)
			{
				if (!this.fields.has(key))
					throw new ul4.ArgumentError("update() get an unexpected keyword argument " + ul4._repr(key));
				record.fields.get(key).value = values[key];
			}
		}
		else
			throw new ul4.TypeError("values must be an object or a Map");

		this.app.globals.handler.save(this);
	}

	search(search)
	{
		for (let identifier in search)
		{
			let fieldsearch = search[identifier];
			if (ul4._bool(fieldsearch))
			{
				if (!this.fields.get(identifier).search(fieldsearch))
					return false;
			}
		}
		return true;
	}

	ul4onload(decoder)
	{
		super.ul4onload(decoder);
		this._is_new = false;
	}

	_dumpUL4ONAttr(name)
	{
		if (name === "values")
			return this._sparsevalues;
		else
			return this[name];
	}

	_loadUL4ONAttr(name, value)
	{
		if (name === "values")
		{
			this._sparsevalues = value;
			this._values = null;
			this._fields = null;
		}
		else
			this[name] = value;
	}

	[ul4.symbols.getattr](name)
	{
		if (name.startsWith("c_"))
			return this.children.get(name.substr(2))
		else if (name.startsWith("f_"))
			return this.fields.get(name.substr(2))
		else if (name.startsWith("v_"))
			return this.values.get(name.substr(2))
		else
			return this[name];
	}

	[ul4.symbols.setattr](name, value)
	{
		if (name.startsWith("c_"))
			this.children[name.substr(2)] = value;
		else if (name.startsWith("v_"))
			this.fields.get(name.substr(2)).value = value;
		else
			throw new ul4.AttributeError(this, name);
	}
};

Record.prototype._ul4onattrs = ["app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "_sparsevalues", "attachments", "children", "errors", "_sparsefielderrors", "_sparsefieldlookupdata"];
Record.prototype._ul4attrs = new Set(["id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children", "errors"]);
ul4.expose(Record.prototype.is_dirty, []);
ul4.expose(Record.prototype.has_errors, []);
ul4.expose(Record.prototype.delete, []);
ul4.expose(Record.prototype.save, []);
ul4.expose(Record.prototype.update, ["**values"], {"needsobject": true});


export class Field extends Base
{
	static classdoc = "Holds the value of a field of a record (and related information)";

	constructor(control, record, value)
	{
		super(null);
		this.control = control;
		this.record = record;
		this._label = null;
		this._lookupdate = null;
		this.errors = [];
		this._value = null;
		if (!this._in_form())
			this.value = value;
		this._dirty = false;
		this._enabled = true;
		this._visible = true;
	}

	get value()
	{
		if (this._in_form())
			return this._get_dom_value();
		return this._value;
	}

	set value(value)
	{
		let oldvalue = this._value;

		let change = {value: value, errors: []};
		this._validate(change);

		if (ul4._ne(oldvalue, change.value))
		{
			this.record.values.set(this.control.identifier, change.value);
			this._value = change.value;
			this._dirty = true;
		}
		this.errors = change.errors;
		if (this._in_form())
			this._set_dom_value(this._value);
	}

	_validate(change)
	{
		// Do nothing, i.e. accept the value unchanged and without errors
	}

	_set_dom_label()
	{
		if (this._in_form())
			document.querySelector(this._sel_label).textContent = this.label;
	}

	get label()
	{
		if (this._label !== null)
			return this._label;
		return this.control.label;
	}

	set label(value)
	{
		this._label = value;
		this._set_dom_label();
	}

	get globals()
	{
		return this.control.globals;
	}

	is_empty()
	{
		return this._value === null || (ul4._islist(this._value) && this._value.length === 0);
	}

	is_dirty()
	{
		return this._dirty;
	}

	has_errors()
	{
		return this.errors.length !== 0;
	}

	search(searchvalue)
	{
		return this.control.search(this.value, searchvalue);
	}

	msg_field_required(value)
	{
		switch (this.globals.lang)
		{
			case "de":
				return `"${this.label}" wird benötigt!`;
			default:
				return `"${this.label}" is required!`;
		}
	}

	msg_field_wrong_type(value)
	{
		return `"${this.label}" doesn't support the type ${ul4._type(value).name}!`;
	}

	msg_bool_truerequired(value)
	{
		return `"${this.label}" only accepts "Yes"!`;
	}

	msg_string_tooshort(value)
	{
		return `"${this.label}" is too short. You must use at least ${this.control.minlength} characters!`;
	}

	msg_string_toolong(value)
	{
		return `"${this.label}" is too long. You may use at most ${this.control.maxlength} characters!`;
	}

	msg_email_format(value)
	{
		return `"${this.label}" must be a valid email address!`;
	}

	msg_url_format(value)
	{
		return `"${this.label}" must be a valid URL!`;
	}

	msg_tel_format(value)
	{
		return `"${this.label}" must be a valid phone number!`;
	}

	msg_date_format(value)
	{
		return `"${this.label}" doesn't support this date format!`;
	}

	msg_number_format(value)
	{
		return `"${this.label}" doesn't support this number format!`;
	}

	msg_lookup_wrongitem(value)
	{
		return `The option ${ul4._repr(value)} for "${this.label}" doesn't belong to this lookup!`;
	}

	msg_lookup_unknownkey(value)
	{
		return `The option ${ul4._repr(value)} for "${this.label}" is unknown!`;
	}

	msg_applookup_wrongrecord(value)
	{
		return `The record ${ul4._repr(value)} for "${this.label}" doesn't belong to the correct app!`;
	}

	msg_applookup_unknownkey(value)
	{
		return `The record ${ul4._repr(value)} for "${this.label}" can't be found!`;
	}

	/*
	The following methods are used in the input form.

	I.e. the are expected to be executed inside a browser.
	**/
	_in_form()
	{
		return this.record._in_form();
	}

	get _sel_root()
	{
		return "#livingapps-form ." + this.control._cssclass_root + ".llft-id-" + this.control.identifier;
	}

	get _sel_label()
	{
		return this._sel_root + " label span";
	}

	get _sel_control()
	{
		return this._sel_root + " " + this.control._cssclass_control;
	}

	_get_dom_value()
	{
		return document.querySelector(this._sel_control).value;
	}

	_set_dom_value(value)
	{
		document.querySelector(this._sel_control).value = value;
	}

	_show()
	{
		let el = document.querySelector(this._sel_root);
		el.style.transition = "height 0.2s ease";
		el.style.overflowY = "hidden";
		el.style.height = el.scrollHeight + "px";
	}

	_hide()
	{
		let el = document.querySelector(this._sel_root);
		el.style.transition = "height 0.2s ease";
		el.style.overflowY = "hidden";
		el.style.height = 0 + "px";
	}

	get visible()
	{
		return this._visible;
	}

	set visible(value)
	{
		if (this._in_form())
		{
			if (value)
				this._show();
			else
				this._hide();
		}
		this._visible = value;
	}

	get enabled()
	{
		return this._enabled;
	}

	set enabled(value)
	{
		if (this._in_form())
		{
			let disabled = !value;
			for (let node of document.querySelectorAll(this._sel_control))
				node.disabled = disabled;
		}
		this._enabled = value;
	}

	[ul4.symbols.repr]()
	{
		let s = "<Field identifier=";
		s += ul4._repr(this.control.identifier)
		if (this._dirty)
			s += " is_dirty()=True";
		if (this.errors.length > 0)
			s += " has_errors()=True";
		s += ">"
		return s;
	}

	[ul4.symbols.setattr](name, value)
	{
		if (name === "visible")
			this.visible = ul4._bool(value);
		else if (name === "enaabled")
			this.visible = ul4._bool(value);
		else
			return super[ul4.symbols.getattr](name);
	}
};

Field.prototype._ul4onattrs = ["control", "record", "label", "value", "errors", "enabled", "writable", "_visible"];
Field.prototype._ul4attrs = new Set(["control", "record", "label", "value", "errors", "enabled", "writable", "visible"]);


export class BoolField extends Field
{
	static classdoc = "Holds the value of a bool field of a record (and related information)";

	_validate(change)
	{
		if (change.value === null)
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(change.value));
		}
		else if (typeof(change.value) === "boolean")
		{
			if (this.control.required && !change.value)
				change.errors.push(this.msg_bool_truerequired(change.value));
		}
		else
		{
			change.errors.push(this.msg_field_wrong_type(change.value));
			change.value = null;
		}
	}

	_get_dom_value()
	{
		return document.querySelector(this._sel_control).checked;
	}

	_set_dom_value(value)
	{
		document.querySelector(this._sel_control).checked = value;
	}
};


export class IntField extends Field
{
	static classdoc = "Holds the value of an int field of a record (and related information)";

	_parse(value)
	{
		if (/^\s*[-+]?\d+\s*$/.test(value))
			return parseInt(value);
		else
			return null;
	}

	_validate(change)
	{
		if (change.value === null)
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(change.value));
		}
		else if (typeof(change.value) === "string")
		{
			let value = this._parse(change.value);
			if (value !== null)
				change.value = value;
			else
				change.errors.push(this.msg_number_format(change.value));
				// Keep original invalid string
		}
		else if (typeof(change.value) === "number")
		{
			if (Math.round(change.value) !== change.value)
				change.errors.push(this.msg_field_wrong_type(change.value));
				// Keep original floating point number
		}
		else
		{
			change.errors.push(this.msg_field_wrong_type(change.value));
			change.value = null;
		}
	}

	_get_dom_value()
	{
		let value = super._get_dom_value();
		if (value)
		{
			let testvalue = this._parse(value);
			if (testvalue !== null)
				value = testvalue;
		}
		return value;
	}

	_set_dom_value(value)
	{
		super._set_dom_value(value + "");
	}
};


export class NumberField extends Field
{
	static classdoc = "Holds the value of a number field of a record (and related information)";

	_parse(value)
	{
		if (value === null)
			return null;

		// Try to ignore thousands separators and return the value as a number
		let testvalue = value;
		// Count decimal delimiters
		let seps = "";
		let commas = 0;
		let dots = 0
		for (let i = 0; i < value.length; ++i)
		{
			let c = value[i];
			if (c == ",")
			{
				commas++;
				seps += c;
			}
			else if (c == ".")
			{
				dots++;
				seps += c;
			}
		}
		let convert = null;
		if (commas == 0)
		{
			if (dots <= 1)
				; // nothing to do
			else
				convert = "de";
		}
		else if (commas == 1)
		{
			if (dots == 1)
				convert = (seps == ".,") ? "de" : "en";
			else
				convert = "de";
		}
		else // commas > 1
		{
			if (dots <= 1)
				convert = "en";
			else
				return null; // We can't guess what the user meant
		}

		if (convert === "de")
			testvalue = testvalue.replace(/\./g, "").replace(/,/g, ".");
		else if (convert === "en")
			testvalue = testvalue.replace(/,/g, "");
		let floatvalue = parseFloat(testvalue);
		if (isNaN(floatvalue))
			return value;
		return floatvalue;
	}

	_validate(change)
	{
		if (change.value === null || change.value === "")
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(change.value));
			change.value = null;
		}
		else if (typeof(change.value) === "string")
		{
			let value = this._parse(change.value);
			if (value !== null)
			{
				value = this._bound_value(value);
				if (this.control.precision !== null)
					value = ul4._round(value, this.control.precision);
				change.value = value;
			}
			else
				change.errors.push(this.msg_number_format(change.value));
				// Keep original invalid string
		}
		else if (typeof(change.value) === "number")
		{
			value = this._bound_value(value);
			if (this.control.precision !== null)
				value = ul4._round(value, this.control.precision);
			change.value = value;
		}
		else
		{
			change.errors.push(this.msg_field_wrong_type(change.value));
			change.value = null;
		}
	}

	_bound_value(value)
	{
		if (this.control.minimum !== null)
		{
			if (value < this.control.minimum)
				value = this.control.minimum;
		}
		if (this.control.maximum !== null)
		{
			if (value > this.control.maximum)
				value = this.control.maximum;
		}
		return value;
	}

	_get_dom_value()
	{
		let value = super._get_dom_value();
		if (value)
		{
			if (typeof(value) == "string")
			{
				let testvalue = this._parse(value);
				if (testvalue !== null)
					value = testvalue;
			}
			if (typeof(value) === "number")
			{
				if (this.control.precision !== null)
					value = ul4._round(value, this.control.precision);
				value = this._bound_value(value);
			}
		}
		else
			value = null;
		return value;
	}

	_set_dom_value(value)
	{
		if (typeof(value) === "number")
		{
			value = this._bound_value(value);
			if (this.control.precision !== null)
				value = value.toFixed(this.control.precision);
		}
		value += "";
		if (this.globals.lang == "de" && this.control.precision === null)
			value = value.replace(".", ",");
		super._set_dom_value(value);
	}
};


export class StringField extends Field
{
	static classdoc = "Holds the value of a string field of a record (and related information)";

	_validate(change)
	{
		if (change.value === null || change.value === "")
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(change.value));
			change.value = null;
		}
		else if (typeof(change.value) === "string")
		{
			let minlength = this.control.minlength;
			let maxlength = this.control.maxlength;
			if (minlength !== null && change.value.length < minlength)
				change.errors.push(this.msg_string_tooshort(change.value))
			if (maxlength !== null && change.value.length > maxlength)
				change.errors.push(this.msg_string_toolong(change.value))
		}
		else
		{
			change.errors.push(this.msg_field_wrong_type(change.value));
			change.value = null;
		}
	}
};


export class EmailField extends StringField
{
	static classdoc = "Holds the value of a string/email field of a record (and related information)";

	_validate(change)
	{
		if (typeof(change.value) === "string" && change.value.length > 0)
		{
			const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
			if (!re.test(change.value))
				change.errors.push(this.msg_email_format(change.value));
		}
		super._validate(change);
	}
};


export class URLField extends StringField
{
	static classdoc = "Holds the value of a string/url field of a record (and related information)";

	_validate(change)
	{
		if (typeof(change.value) === "string" && change.value.length > 0)
		{
			let url = null;
			try
			{
				url = new URL(change.value);
			}
			catch (exc)
			{
				change.errors.push(this.msg_url_format(change.value));
			}
			if (url !== null && url.protocol !== "http:" && url.protocol !== "https:")
			{
				change.errors.push(this.msg_url_format(change.value));
			}
		}
		super._validate(change);
	}
};


export class TelField extends StringField
{
	static classdoc = "Holds the value of a string/tel field of a record (and related information)";

	_validate(change)
	{
		if (typeof(change.value) === "string" && change.value.length > 0)
		{
			const re = /^\\+?[0-9 /()-]+$/;
			if (!re.test(change.value))
				change.errors.push(this.msg_tel_format(change.value));
		}
		super._validate(change);
	}
};


export class TextAreaField extends StringField
{
	static classdoc = "Holds the value of a string/textarea field of a record (and related information)";
};


export class HTMLField extends StringField
{
	static classdoc = "Holds the value of a string/html field of a record (and related information)";
};


export class GeoField extends Field
{
	static classdoc = "Holds the value of a geo field of a record (and related information)";

	_validate(change)
	{
		if (change.value === null || change.value === "")
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(change.value));
			change.value = null;
		}
		else if (!(change.value instanceof Geo))
		{
			change.errors.push(this.msg_field_wrong_type(change.value));
			change.value = null;
		}
	}
};


export class FileField extends Field
{
	static classdoc = "Holds the value of a file field of a record (and related information)";

	_validate(change)
	{
		if (change.value === null || change.value === "")
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(change.value));
			change.value = null;
		}
		else if (!(change.value instanceof File))
		{
			change.errors.push(this.msg_field_wrong_type(change.value));
			change.value = null;
		}
	}

	_get_dom_value()
	{
		// Always return `null``
		return null;
	}

	_set_dom_value()
	{
		// Do nothing
	}
};


export class FileSignatureField extends FileField
{
	static classdoc = "Holds the value of a file/signature field of a record (and related information)";

	_validate(change)
	{
		// FIXME: Implement handling of data URLs.
		super._validate(change);
	}
};


export class DateFieldBase extends Field
{
	static classdoc = "Holds the value of a date field of a record (and related information)";

	_parse(value, format)
	{
		let year = null, month = null, day = null, hour = 0, minute = 0, second = 0, ispm = null;

		function _int(v, len, min, max)
		{
			v = v.substring(0, len);
			if (v.length != len)
				return null;
			v = parseInt(v, 10);
			if (isNaN(v) || v < min || v > max)
				return null;
			return v;
		}

		while (value)
		{
			// Are both `value` and `format` not `null`,
			// i.e. neither `value` nor `format` is exhaused?
			if (!format)
				return null;
			if (format.startsWith("%Y"))
			{
				year = _int(value, 4);
				if (year === null)
					return null;
				value = value.substring(4);
				format = format.substring(2);
			}
			else if (format.startsWith("%y"))
			{
				year = _int(value, 2);
				if (year === null)
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%m"))
			{
				month = _int(value, 2);
				if (month === null)
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%d"))
			{
				day = _int(value, 2);
				if (day === null)
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%H"))
			{
				hour = _int(value, 2);
				if (hour === null)
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%I"))
			{
				hour = _int(value, 2);
				if (hour === null)
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%M"))
			{
				minute = _int(value, 2);
				if (minute === null)
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%S"))
			{
				second = _int(value, 2);
				if (second === null)
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%p"))
			{
				if (value.toLowerCase().startsWith("pm"))
					ispm = true;
				else if (value.toLowerCase().startsWith("am"))
					ispm = false;
				else
					return null;
				value = value.substring(2);
				format = format.substring(2);
			}
			else if (format.startsWith("%%"))
			{
				if (!value.startsWith("%"))
					return null;
				value = value.substring(1);
				format = format.substring(2);
			}
			else
			{
				if (!value.startsWith(format.substring(0, 1)))
					return null;
				value = value.substring(1);
				format = format.substring(1);
			}
		}
		// Are both `value` and `format` `null`?
		// I.e. both `value` and `format` must be exhausted, otherwise ...
		if (format)
			// ... `format` has remaining content that the value didn't provide
			return null;

		// Check existance of values and their range
		if (year === null)
			return null;
		if (month === null || month < 1 || month > 12)
			return null;
		if (day === null || day < 1 || day > 31) // FIXME: Use the actuall number of days
			return null;
		if (ispm === null)
		{
			if (hour < 0 || hour > 23)
				return null;
		}
		else
		{
			if (hour < 0 || hour > 11)
				return null;
			if (ispm)
				hour += 12;
		}
		if (minute < 0 || minute > 59)
			return null;
		if (minute < 0 || minute > 59)
			return null;
		if (second < 0 || second > 60)
			return null;
		return new Date(year, month-1, day, hour, minute, second);
	}

	_validate(change)
	{
		if (change.value === null || change.value === "")
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(change.value));
			change.value = null;
		}
		else if (change.value instanceof Date)
		{
			change.value = this._convert(change.value);
		}
		else if (change.value instanceof ul4.Date_)
		{
			change.value = this._convert(change.value._date);
		}
		else if (typeof(change.value) === "string")
		{
			let value = null;
			for (let format of this.control.formatstrings_parse())
			{
				value = this._parse(change.value, format);
				if (value !== null)
					break;
			}
			if (value !== null)
				change.value = this._convert(value);
			else
				change.errors.push(this.msg_date_format(change.value));
				// Keep original invalid string
		}
		else
		{
			change.errors.push(this.msg_field_wrong_type(change.value));
			change.value = null;
		}
	}

	_get_dom_value()
	{
		let value = super._get_dom_value();
		if (!value)
			return null;

		for (let format of this.control.formatstrings_parse())
		{
			let date = this._parse(value, format);
			if (date !== null)
				return this._convert(date);
		}
		return null;
	}

	_set_dom_value(value)
	{
		if (value !== null)
			value = ul4._format(value, this.control.formatstring(), this.globals.lang);
		super._set_dom_value(value);
	}
};


export class DateField extends DateFieldBase
{
	static classdoc = "Holds the value of a date/date field of a record (and related information)";

	_convert(date)
	{
		return new ul4.Date_(date.getFullYear(), date.getMonth()+1, date.getDate());
	}
};


export class DatetimeMinuteField extends DateFieldBase
{
	static classdoc = "Holds the value of a date/datetimeminute field of a record (and related information)";

	_convert(date)
	{
		// Get rid of seconds and milliseconds
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	}
};


export class DatetimeSecondField extends DateFieldBase
{
	static classdoc = "Holds the value of a date/datetimesecond field of a record (and related information)";

	_convert(date)
	{
		// Get rid of milliseconds
		date.setMilliseconds(0);
		return date;
	}
};


export class LookupFieldBase extends Field
{
	static classdoc = "Base type of LookupField and MultipleLookupField";

	get lookupdata()
	{
		if (this._lookupdate !== null)
			return this._lookupdate;
		else
			return this.control.lookupdata;
	}

	set lookupdata(value)
	{
		this._lookupdate = value;
	}

	_find_lookupitem(change)
	{
		let v = change.value;
		if (typeof(v) === "string")
		{
			// If `lookupdata` is `null`, this probably an interface,
			// so we can't validate anything (note that interfaces will however go
			// away in the future)
			if (this.lookupdata === null)
				return;
			let lookupitem = this.control.lookupdata.get(v);
			if (lookupitem === undefined)
			{
				// If the lookup control is auto expandable,
				// the user may have given us a label
				if (this.control.autoexpandable)
				{
					// Search for the LookupItem with that label
					for (let search_lookupitem of this.lookupdata.values())
					{
						if (v === search_lookupitem.label)
						{
							change.value = search_lookupitem;
							return;
						}
					}
					// If we couldn't find the label, keep the label as it is.
				}
				else
				{
					change.errors.push(this.msg_lookup_unknownkey(v))
					change.value = null;
				}
			}
			else
			{
				change.value = lookupitem;
			}
		}
		else if (v instanceof LookupItem)
		{
			let value = this.control.lookupdata.get(v.key);
			if (value !== v)
			{
				change.errors.push(this.msg_lookup_wrongitem(v));
				change.value = null;
			}
		}
		else
		{
			change.errors.push(this.msg_field_wrong_type(v));
			change.value = null;
		}
	}
};


export class LookupField extends LookupFieldBase
{
	static classdoc = "Holds the value of a lookup field of a record (and related information)";

	_validate(change)
	{
		let v = change.value;
		if (v === null || v === "" || this.control.nonekey === v)
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(v));
			change.value = null;
		}
		else
		{
			this._find_lookupitem(change);
		}
	}
};


export class LookupRadioField extends LookupField
{
	static classdoc = "Holds the value of a lookup/radio field of a record (and related information)";

	get _sel_label()
	{
		return this._sel_root + " label:not([for]) > span";
	}

	_get_dom_value()
	{
		for (let node of document.querySelectorAll(this._sel_control))
		{
			if (node.checked)
			{
				let key = node.getAttribute("value");
				return this.control.lookupdata.get(key);
			}

		}
		return null;
	}

	_set_dom_value(value)
	{
		if (value instanceof LookupItem)
			value = value.key;
		if (value === null)
			value = this.control.nonekey;

		for (let node of document.querySelectorAll(this._sel_control))
			node.checked = node.getAttribute("value") === value;
	}
};


export class LookupSelectField extends LookupField
{
	static classdoc = "Holds the value of a lookup/select field of a record (and related information)";

	_get_dom_value()
	{
		let value = super._get_dom_value();
		if (value)
		{
			if (value === this.control.nonekey)
				value = null;
			else
				value = this.control.lookupdata.get(value);
		}
		return value;
	}

	_set_dom_value(value)
	{
		let change = {value: value, errors: []};
		this._validate(change);
		super._set_dom_value(change.value != null ? change.value.key : this.control.nonekey);
	}
};


export class LookupChoiceField extends LookupField
{
	static classdoc = "Holds the value of a lookup/choice field of a record (and related information)";
};


export class MultipleLookupField extends LookupFieldBase
{
	static classdoc = "Holds the value of a multiple lookup field of a record (and related information)";

	_validate(change)
	{
		let v = change.value;
		let islist = (Object.prototype.toString.call(v) === "[object Array]");

		if (v === null || v === "" || this.control.nonekey === v || (islist && v.length === 0))
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(v));
			change.value = [];
		}
		else if (islist)
		{
			let newvalue = [];
			for (let item of v)
			{
				let singlechange = {value: item, errors: []};
				this._find_lookupitem(singlechange);
				if (singlechange.errors.length > 0)
					change.errors = [...change.errors, ...singlechange.errors];
				else
					newvalue.push(singlechange.value);
			}
			change.value = newvalue;
		}
		else
		{
			this._find_lookupitem(change);
			if (change.errors.length > 0)
				change.value = [];
			else
				change.value = [change.value];
		}
	}
};


export class MultipleLookupCheckboxField extends MultipleLookupField
{
	static classdoc = "Holds the value of a multiplelookup/radio field of a record (and related information)";

	get _sel_label()
	{
		return this._sel_root + " label:not([for]) > span";
	}

	_get_dom_value()
	{
		let value = [];
		for (let node of document.querySelectorAll(this._sel_control))
		{
			if (node.checked)
			{
				let key = node.getAttribute("value");
				value.push(this.control.lookupdata.get(key));
			}

		}
		return value;
	}

	_set_dom_value(value)
	{
		let change = {value: value, errors: []};
		this._validate(change);
		let values = new Set();
		for (let value of change.value)
			values.add(value.key);

		for (let node of document.querySelectorAll(this._sel_control))
			node.checked = values.has(node.getAttribute("value"));
	}
};


export class MultipleLookupSelectField extends MultipleLookupField
{
	static classdoc = "Holds the value of a multiplelookup/select field of a record (and related information)";

	_get_dom_value()
	{
		let value = [];
		for (let option of document.querySelector(this._sel_control).querySelectorAll("option"))
		{
			if (option.selected)
				value.push(this.control.lookupdata.get(option.getAttribute("value")));
		}
		return value;
	}

	_set_dom_value(value)
	{
		let change = {value: value, errors: []};
		this._validate(change);
		let values = new Set();
		for (let value of change.value)
			values.add(value.key);
		for (let option of document.querySelector(this._sel_control).querySelectorAll("option"))
			option.selected = values.has(option.getAttribute("value"));
	}
};


export class MultipleLookupChoiceField extends MultipleLookupField
{
	static classdoc = "Holds the value of a multiplelookup/choice field of a record (and related information)";
};


export class AppLookupFieldBase extends Field
{
	static classdoc = "Base type of AppLookupField and MultipleAppLookupField";

	get lookupdata()
	{
		if (this._lookupdata !== null)
			return this._lookupdata;
		else
		{
			if (this.control.lookup_app.records !== null)
				return this.control.lookup_app.records;
		}
		return new Map();
	}

	set lookupdata(value)
	{
		this._lookupdata = value;
	}

	_find_record(change)
	{
		let v = change.value;
		if (typeof(v) === "string")
		{
			let record = this.control.lookup_app.records !== null ?
				this.control.lookup_app.records.get(v) :
				undefined
			;

			if (record === undefined)
			{
				change.errors.push(this.msg_applookup_unknownkey(v))
				change.value = null;
			}
			else
			{
				change.value = record;
			}
		}
		else if (v instanceof Record)
		{
			if (v.app !== this.control.lookup_app)
			{
				change.errors.push(this.msg_applookup_wrongrecord(v));
				change.value = null;
			}
		}
		else
		{
			change.errors.push(this.msg_field_wrong_type(v));
			change.value = null;
		}
	}
};


export class AppLookupField extends AppLookupFieldBase
{
	static classdoc = "Holds the value of a applookup field of a record (and related information)";

	_validate(change)
	{
		this._find_record(change);
	}
};


export class AppLookupSelectField extends AppLookupField
{
	static classdoc = "Holds the value of a `applookup`/`select` field of a record (and related information)";

	_get_dom_value()
	{
		let value = super._get_dom_value();

		if (this.control.lookup_app.records !== null)
		{
			value = this.control.lookup_app.records.get(value);
			if (value === undefined)
				value = null;
		}
		else
			value = null;
		return value;
	}

	_set_dom_value(value)
	{
		let change = {value: value, errors: []};
		this._validate(change);
		super._set_dom_value(change.value != null ? change.value.id : this.control.nonekey);
	}
};


export class AppLookupRadioField extends AppLookupField
{
	static classdoc = "Holds the value of a `applookup`/`radio` field of a record (and related information)";
};


export class AppLookupChoiceField extends AppLookupField
{
	static classdoc = "Holds the value of a `applookup`/`choice` field of a record (and related information)";
};


export class MultipleAppLookupField extends AppLookupFieldBase
{
	static classdoc = "Holds the value of a multiple applookup field of a record (and related information)";

	_validate(change)
	{
		let v = change.value;
		let islist = (Object.prototype.toString.call(v) === "[object Array]");

		if (v === null || v === "" || this.control.nonekey === v || (islist && v.length === 0))
		{
			if (this.control.required)
				change.errors.push(this.msg_field_required(v));
			change.value = [];
		}
		else if (islist)
		{
			let newvalue = [];
			for (let item of v)
			{
				let singlechange = {value: item, errors: []};
				this._find_record(singlechange);
				if (singlechange.errors.length > 0)
					change.errors = [...change.errors, ...singlechange.errors];
				else
					newvalue.push(singlechange.value);
			}
			change.value = newvalue;
		}
		else
		{
			this._find_record(change);
			if (change.errors.length > 0)
				change.value = [];
			else
				change.value = [change.value];
		}
	}
};


export class MultipleAppLookupCheckboxField extends MultipleAppLookupField
{
	static classdoc = "Holds the value of a `multipleapplookup`/`checkbox` field of a record (and related information)";
};


export class MultipleAppLookupSelectField extends MultipleAppLookupField
{
	static classdoc = "Holds the value of a `multipleapplookup`/`select` field of a record (and related information)";
};


export class MultipleAppLookupChoiceField extends MultipleAppLookupField
{
	static classdoc = "Holds the value of a `multipleapplookup`/`choice` field of a record (and related information)";
};


export class Control extends Base
{
	[ul4.symbols.repr]()
	{
		return "<" + this.constructor.name + " id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}

	get globals()
	{
		return this.app.globals;
	}

	get fulltype()
	{
		return this.subtype ? this.type + "/" + this.subtype : this.type;
	}

	get label()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return this._label;
		let label = view_control.label;
		if (label === null)
			return this._label;
		return label;
	}

	set label(value)
	{
		this._label = value;
	}

	get default()
	{
		return null;
	}

	get top()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.top : null;
	}

	get left()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.left : null;
	}

	get width()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.width : null;
	}

	get height()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.height : null;
	}

	get liveupdate()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.liveupdate : false;
	}

	get tabindex()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.tabindex : null;
	}

	get required()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.required : false;
	}

	get mode()
	{
		let view_control = this._view_control();
		if (this.app._active_view !== null && view_control === null)
			return null;
		if (this.app.globals.mode === null)
			return "display";
		return view_control !== null ? view_control.mode : "edit";
	}

	get labelpos()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.labelpos : "left";
	}

	get labelwidth()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.labelwidth : null;
	}

	get autoalign()
	{
		let view_control = this._view_control();
		return view_control !== null ? view_control.autoalign : true;
	}

	get in_active_view()
	{
		let view_control = this._view_control();
		return view_control !== null;
	}

	_view_control()
	{
		if (this.app._active_view === null)
			return null;
		let view_control = this.app._active_view.controls.get(this.identifier);
		return view_control ?? null;
	}

	_logsearch(value, search)
	{
		//console.log("Searching for " + ul4._repr(search.value) + " in " + ul4._repr(this) + " with operator " + search.operator + " in value " + ul4._repr(value));
	}

	// base implemntation, always returns ``false`` (i.e. "not found")
	// ``value`` is the value of the field
	// ``search`` is an object with information what we're searching for
	// keys in ``search`` are: ``operator`` (and ``value`` (if required by the operator))
	search(value, search)
	{
		return false;
	}
};

Control.prototype.type = null;
Control.prototype.subtype = null;
Control.prototype._ul4onattrs = ["identifier", "fieldname", "app", "_label", "priority", "order", "ininsertprocedure", "inupdateprocedure"];
Control.prototype._ul4attrs = new Set(["id", "identifier", "fieldname", "app", "priority", "order", "ininsertprocedure", "inupdateprocedure", "fulltype", "label", "top", "left", "width", "height", "liveupdate", "tabindex", "required", "mode", "labelpos", "autoalign", "in_active_view"]);
Control.prototype._cssclass_root = "llft-control";
Control.prototype._cssclass_control = "input";


export class BoolControl extends Control
{
	static classdoc = "A LivingApps boolean field (type 'bool')";

	// ``search`` must by ``null``, ``false`` or ``true``
	search(value, search)
	{
		this._logsearch(value, search);
		if (search.operator === "equals")
			return search.value === value;
		else
			return false;
	}
};

BoolControl.prototype.type = "bool";
BoolControl.prototype.fieldtype = BoolField;


export class IntControl extends Control
{
	static classdoc = "A LivingApps integer field (type 'int')";

	// ``search.value`` must by ``null`` or an integer
	search(value, search)
	{
		this._logsearch(value, search);
		if (search.operator === "equals")
			return search.value === value;
		else
			return false;
	}
};

IntControl.prototype.type = "int";
IntControl.prototype.fieldtype = IntField;


class PlaceholderControl extends Control
{
	static classdoc = "A LivingApps multiplelookup field (type 'multiplelookup/select')";

	get placeholder()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return null;
		return view_control.placeholder;
	}
};

PlaceholderControl.prototype._ul4attrs = new Set([...Control.prototype._ul4attrs, "placeholder"]);


export class NumberControl extends PlaceholderControl
{
	static classdoc = "A LivingApps number field (type 'number')";

	// ``search.value`` must by ``null`` or an integer
	search(value, search)
	{
		this._logsearch(value, search);
		if (search.operator === "equals")
			return search.value === value;
		else if (search.operator === "range")
		{
			if (value === null)
				return false;
			return (search.minvalue === null || search.minvalue <= value) && (search.maxvalue === null || value < search.maxvalue);
		}
		else
			return false;
	}
};

NumberControl.prototype.type = "number";
NumberControl.prototype.fieldtype = NumberField;
NumberControl.prototype._ul4onattrs = [...Control.prototype._ul4onattrs, "precision", "minimum", "maximum"];
NumberControl.prototype._ul4attrs = new Set([...Control.prototype._ul4attrs, "precision", "minimum", "maximum"]);


export class StringControl extends PlaceholderControl
{
	_user_placeholder(user, placeholder)
	{
		if (placeholder === null)
			return null;
		switch (placeholder)
		{
			case "{gender}":
				return user !== null ? user.gender : null;
			case "{title}":
				return user !== null ? user.title : null;
			case "{firstname}":
				return user !== null ? user.firstname : null;
			case "{surname}":
				return user !== null ? user.surname : null;
			case "{account}":
				return user !== null ? user.email : null;
			case "{streetname}":
				return user !== null ? user.streetname : null;
			case "{streetnumber}":
				return user !== null ? user.streetnumber : null;
			case "{street}":
				if (user === null)
					return null;
				else if (user.street === null)
					return user.streetnumber;
				else if (user.streetnumber === null)
					return user.street;
				else
					return user.street + " " + user.streetnumber;
			case "{zip}":
				return user !== null ? user.zip : null;
			case "{phone}":
				return user !== null ? user.phone : null;
			case "{fax}":
				return user !== null ? user.fax : null;
			case "{company}":
				return user !== null ? user.company : null;
			case "{city}":
				return user !== null ? user.city : null;
			case "{summary}":
				return user !== null ? user.summary : null;
			case "{interests}":
				return user !== null ? user.interests : null;
			case "{personal_website}":
				return user !== null ? user.personal_website : null;
			case "{company_website}":
				return user !== null ? user.company_website : null;
			case "{position}":
				return user !== null ? user.position : null;
			case "{department}":
				return user !== null ? user.department : null;
			case "{today}":
				return ul4.today();
			default:
				return placeholder;
		}
	}

	get default()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return null;

		return this._user_placeholder(this.app.globals.user, view_control.default);
	}

	get minlength()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return 0;
		let minlength = view_control.minlength;
		if (minlength === null || minlength < 0)
			return 0;
		return minlength;
	}

	get maxlength()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return 4000;
		let maxlength = view_control.maxlength;
		if (maxlength === null || maxlength < 0 || maxlength > 4000)
			return 4000;
		return maxlength;
	}

	search(value, search)
	{
		this._logsearch(value, search);
		if (search.operator === "equals")
			return search.value === value;
		else if (search.operator === "contains")
		{
			if (search.value === null || value === null)
				return search.value === value;
			else
				return value.toLowerCase().indexOf(search.value.toLowerCase()) >= 0;
		}
	}
};

StringControl.prototype.type = "string";


export class TextControl extends StringControl
{
	static classdoc = "A LivingApps text field (type 'string/text')";
};

TextControl.prototype.subtype = "text";
TextControl.prototype.fieldtype = StringField;


export class EmailControl extends StringControl
{
	static classdoc = "A LivingApps email field (type 'string/email')";
};

EmailControl.prototype.subtype = "email";
EmailControl.prototype.fieldtype = EmailField;


export class URLControl extends StringControl
{
	static classdoc = "A LivingApps URL field (type 'string/url')";
};

URLControl.prototype.subtype = "url";
URLControl.prototype.fieldtype = URLField;


export class TelControl extends StringControl
{
	static classdoc = "A LivingApps phone number field (type 'string/tel')";
};

TelControl.prototype.subtype = "tel";
TelControl.prototype.fieldtype = TelField;


export class TextAreaControl extends StringControl
{
	static classdoc = "A LivingApps textarea field (type 'string/textarea')";

	get maxlength()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return null;
		// We only get the encrypted text in encryption mode, so we can't check its length
		if (this.encrypted !== null)
			return null;
		let maxlength = view_control.maxlength;
		if (maxlength < 0)
			return null;
		return maxlength;
	}
};

TextAreaControl.prototype.subtype = "textarea";
TextAreaControl.prototype.fieldtype = TextAreaField;
TextAreaControl.prototype._ul4onattrs = [...StringControl.prototype._ul4onattrs, "encrypted"];
TextAreaControl.prototype._ul4attrs = new Set([...StringControl.prototype._ul4attrs, "encrypted"]);
TextAreaControl.prototype._cssclass_control = "textarea";


export class HTMLControl extends StringControl
{
	static classdoc = "A LivingApps HTML field (type 'string/html')";
};

HTMLControl.prototype.subtype = "html";
HTMLControl.prototype.fieldtype = HTMLField;


export class DateControl extends PlaceholderControl
{
	static classdoc = "A LivingApps date field (type 'date/date')";

	get default()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return null;

		return view_control.default === "{today}" ? ul4.today() : null;
	}

	formatstring(lang)
	{
		lang = lang || this.globals.lang;

		if (lang !== "de" && lang !== "fr" && lang !== "it")
			lang = "en";
		return this._formatstrings[lang];
	}

	formatstrings_parse(lang)
	{
		lang = lang || this.globals.lang;
		if (lang !== "de" && lang !== "fr" && lang !== "it")
			lang = "en";

		return [
			this._formatstrings[lang],
			...this._formatstrings["intl"],
			DatetimeMinuteControl.prototype._formatstrings[lang],
			...DatetimeMinuteControl.prototype._formatstrings["intl"],
			DatetimeSecondControl.prototype._formatstrings[lang],
			...DatetimeSecondControl.prototype._formatstrings["intl"]
		];
	}

	// searchvalue must be ``null``, a ``Date`` object or a string
	search(value, search)
	{
		this._logsearch(value, search);

		let searchvalue = search.value;
		if (Object.prototype.toString.call(searchvalue) == "[object Date]")
			searchvalue = ul4._format(searchvalue, this.formatstring(), this.app.language);
		if (value !== null)
			value = ul4._format(value, this.formatstring(), this.app.language);

		if (search.operator === "equals")
			return searchvalue === value;
		else if (search.operator === "contains")
		{
			if (searchvalue === null || value === null)
				return searchvalue === value;
			else
				return value.toLowerCase().indexOf(searchvalue.toLowerCase()) >= 0;
		}
		else
			return false;
	}
};

DateControl.prototype.type = "date";
DateControl.prototype.subtype = "date";
DateControl.prototype.fieldtype = DateField;
DateControl.prototype._formatstrings = {
	"de": "%d.%m.%Y",
	"fr": "%d.%m.%Y",
	"it": "%d.%m.%Y",
	"en": "%m/%d/%Y",
	"intl": ["%Y-%m-%d"]
};


export class DatetimeMinuteControl extends DateControl
{
	static classdoc = "A LivingApps date field (type 'date/datetimeminute')";

	get default()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return null;

		if (view_control.default === "{today}")
		{
			let now = new Date();
			now.setSeconds(0);
			now.setMilliseconds(0);
			return now;
		}
		else
			return null;
	}

	formatstrings_parse(lang)
	{
		lang = lang || this.globals.lang;
		if (lang !== "de" && lang !== "fr" && lang !== "it")
			lang = "en";

		return [
			this._formatstrings[lang],
			...this._formatstrings["intl"],
			DatetimeSecondControl.prototype._formatstrings[lang],
			...DatetimeSecondControl.prototype._formatstrings["intl"],
			DateControl.prototype._formatstrings[lang],
			...DateControl.prototype._formatstrings["intl"]
		];
	}
};

DatetimeMinuteControl.prototype.subtype = "datetimeminute";
DatetimeMinuteControl.prototype.fieldtype = DatetimeMinuteField;
DatetimeMinuteControl.prototype._formatstrings = {
	"de": "%d.%m.%Y %H:%M",
	"fr": "%d.%m.%Y %H:%M",
	"it": "%d.%m.%Y %H:%M",
	"en": "%m/%d/%Y %H:%M",
	"intl": ["%Y-%m-%dT%H:%M", "%Y-%m-%d %H:%M"]
};


export class DatetimeSecondControl extends DateControl
{
	static classdoc = "A LivingApps date field (type 'date/datetimesecond')";

	get default()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return null;

		if (view_control.default === "{today}")
		{
			let now = new Date();
			now.setMilliseconds(0);
			return now;
		}
		else
			return null;
	}

	formatstrings_parse(lang)
	{
		lang = lang || this.globals.lang;
		if (lang !== "de" && lang !== "fr" && lang !== "it")
			lang = "en";

		return [
			this._formatstrings[lang],
			...this._formatstrings["intl"],
			DatetimeMinuteControl.prototype._formatstrings[lang],
			...DatetimeMinuteControl.prototype._formatstrings["intl"],
			DateControl.prototype._formatstrings[lang],
			...DateControl.prototype._formatstrings["intl"]
		];
	}
};

DatetimeSecondControl.prototype.subtype = "datetimesecond";
DatetimeSecondControl.prototype.fieldtype = DatetimeSecondField;
DatetimeSecondControl.prototype._formatstrings = {
	"de": "%d.%m.%Y %H:%M:%S",
	"fr": "%d.%m.%Y %H:%M:%S",
	"it": "%d.%m.%Y %H:%M:%S",
	"en": "%m/%d/%Y %H:%M:%S",
	"intl": ["%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"]
};


export class LookupControl extends Control
{
	get default()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return null;

		return this.lookupdata.get(view_control) ?? null;
	}

	get autoexpandable()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return false;
		return view_control.autoexpandable;
	}

	get nonekey()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return null;
		return view_control.lookupnonekey;
	}

	get nonelabel()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return null;
		return view_control.lookupnonelabel;
	}

	// ``search.value`` must be ``null`` or a ``LookupItem`` key
	search(value, search)
	{
		if (search.operator === "equals")
		{
			if (value === null)
				return search.value === null;
			else
				return value.key === search.value;
		}
		else
			return false;
	}
};

LookupControl.prototype.type = "lookup";
LookupControl.prototype.fieldtype = LookupField;
LookupControl.prototype._ul4onattrs = [...Control.prototype._ul4onattrs, "lookupdata"];
LookupControl.prototype._ul4attrs = new Set([...Control.prototype._ul4attrs, "lookupdata"]);


export class LookupSelectControl extends LookupControl
{
	static classdoc = "A LivingApps lookup field (type 'lookup/select')";

};

LookupSelectControl.prototype.subtype = "select";
LookupSelectControl.prototype.fieldtype = LookupSelectField;
LookupSelectControl.prototype._cssclass_control = "select";


export class LookupRadioControl extends LookupControl
{
	static classdoc = "A LivingApps lookup field (type 'lookup/radio')";
};

LookupRadioControl.prototype.subtype = "radio";
LookupRadioControl.prototype.fieldtype = LookupRadioField;
LookupRadioControl.prototype._cssclass_root = "llft-element";


export class LookupChoiceControl extends LookupControl
{
	static classdoc = "A LivingApps lookup field (type 'lookup/choice')";

};

LookupChoiceControl.prototype.subtype = "choice";
LookupChoiceControl.prototype.fieldtype = LookupChoiceField;


export class AppLookupControl extends Control
{
	get nonekey()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return null;
		return view_control.lookupnonekey;
	}

	get nonelabel()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return null;
		return view_control.lookupnonelabel;
	}

	// ``search.value`` must be an object containing the search criteria for the referenced record
	search(value, search)
	{
		if (value === null || search.value === null)
			return value === search.value;
		else
			return value.search(search);
	}
};

AppLookupControl.prototype.type = "applookup";
AppLookupControl.prototype.fieldtype = AppLookupField;
AppLookupControl.prototype._ul4onattrs = [...Control.prototype._ul4onattrs, "lookup_app", "lookup_controls", "local_master_control", "local_detail_controls", "remote_master_control"];
AppLookupControl.prototype._ul4attrs = new Set([...Control.prototype._ul4attrs, "lookup_app", "lookup_controls", "local_master_control", "local_detail_controls", "remote_master_control"]);


export class AppLookupSelectControl extends AppLookupControl
{
	static classdoc = "A LivingApps applookup field (type 'applookup/select')";

};

AppLookupSelectControl.prototype.subtype = "select";
AppLookupSelectControl.prototype.fieldtype = AppLookupSelectField;
AppLookupSelectControl.prototype._cssclass_control = "select";


export class AppLookupRadioControl extends AppLookupControl
{
	static classdoc = "A LivingApps applookup field (type 'applookup/radio')";

};

AppLookupRadioControl.prototype.subtype = "radio";
AppLookupRadioControl.prototype.fieldtype = AppLookupRadioField;


export class AppLookupChoiceControl extends AppLookupControl
{
	static classdoc = "A LivingApps applookup field (type 'applookup/choice')";

};

AppLookupChoiceControl.prototype.subtype = "choice";
AppLookupChoiceControl.prototype.fieldtype = AppLookupChoiceField;


export class MultipleLookupControl extends LookupControl
{
	get default()
	{
		let view_control = this._view_control();

		if (view_control === null)
			return null;

		let defaultValue = this.lookupdata.get(view_control)

		return (defaultValue !== undefined) ? [defaultValue] : [];
	}

	// search.value must be ``null`` or a ``LookupItem`` key
	search(value, search)
	{
		if (search.operator === "equals")
		{
			for (let item of value)
			{
				if (item.key === search.value)
					return true;
			}
			return false;
		}
		else
			return false;
	}
};

MultipleLookupControl.prototype.type = "multiplelookup";
MultipleLookupControl.prototype.fieldtype = MultipleLookupField;


export class MultipleLookupCheckboxControl extends MultipleLookupControl
{
	static classdoc = "A LivingApps multiplelookup field (type 'multiplelookup/checkbox')";

	get _sel_label()
	{
		return this._sel_root + " label:not([for]) > span";
	}
};

MultipleLookupCheckboxControl.prototype.subtype = "checkbox";
MultipleLookupCheckboxControl.prototype.fieldtype = MultipleLookupCheckboxField;
MultipleLookupCheckboxControl.prototype._cssclass_root = "llft-element";


export class MultipleLookupSelectControl extends MultipleLookupControl
{
	static classdoc = "A LivingApps multiplelookup field (type 'multiplelookup/select')";

};

MultipleLookupSelectControl.prototype.subtype = "select";
MultipleLookupSelectControl.prototype.fieldtype = MultipleLookupSelectField;
MultipleLookupSelectControl.prototype._cssclass_control = "select";


export class MultipleLookupChoiceControl extends MultipleLookupControl
{
	static classdoc = "A LivingApps multiplelookup field (type 'multiplelookup/choice')";

};

MultipleLookupChoiceControl.prototype.subtype = "choice";
MultipleLookupChoiceControl.prototype.fieldtype = MultipleLookupChoiceField;


export class MultipleAppLookupControl extends AppLookupControl
{
	// ``search.value`` must be an object containing the search criteria for the referenced record
	search(value, search)
	{
		if (search.operator === "equals")
		{
			if (search.value === null)
				return value.length === 0;
			else
			{
				for (let item of value)
				{
					if (item.search(search.value))
						return true;
				}
				return false;
			}
		}
		else
			return false;
	}
};

MultipleAppLookupControl.prototype.type = "multipleapplookup";
MultipleAppLookupControl.prototype.fieldtype = MultipleAppLookupField;


export class MultipleAppLookupSelectControl extends MultipleAppLookupControl
{
	static classdoc = "A LivingApps multiple applookup field (type 'multipleapplookup/select')";

};

MultipleAppLookupSelectControl.prototype.subtype = "select";
MultipleAppLookupSelectControl.prototype.fieldtype = MultipleAppLookupSelectField;
MultipleAppLookupSelectControl.prototype._cssclass_control = "select";


export class MultipleAppLookupCheckboxControl extends MultipleAppLookupControl
{
	static classdoc = "A LivingApps multiple applookup field (type 'multipleapplookup/checkbox')";

};

MultipleAppLookupCheckboxControl.prototype.subtype = "checkbox";
MultipleAppLookupCheckboxControl.prototype.fieldtype = MultipleAppLookupCheckboxField;


export class MultipleAppLookupChoiceControl extends MultipleAppLookupControl
{
	static classdoc = "A LivingApps multiple applookup field (type 'multipleapplookup/choice')";
};

MultipleAppLookupChoiceControl.prototype.subtype = "choice";
MultipleAppLookupChoiceControl.prototype.fieldtype = MultipleAppLookupChoiceField;


export class GeoControl extends Control
{
	static classdoc = "A LivingApps geo field (type 'geo')";
};

GeoControl.prototype.type = "geo";
GeoControl.prototype.fieldtype = GeoField;
GeoControl.prototype._cssclass_root = "llft-element";


export class FileControl extends Control
{
	static classdoc = "A LivingApps upload field (type 'file')";
};

FileControl.prototype.type = "file";
FileControl.prototype.fieldtype = FileField;
FileControl.prototype._cssclass_root = "llft-element";


export class FileSignatureControl extends FileControl
{
	static classdoc = "A LivingApps signature image field (type 'file/signature')";
};

FileSignatureControl.prototype.subtype = "signature";
FileSignatureControl.prototype.fieldtype = FileSignatureField;


export class ButtonControl extends Control
{
};

ButtonControl.prototype.type = "button";


export class LookupItem extends Base
{
	static classdoc = "An option in a lookup control/field";

	get label()
	{
		if (this.control === null)
			return this._label;
		let view_lookupitem = this._view_lookupitem();
		if (view_lookupitem === null)
			return this._label;
		let label = view_lookupitem.label;
		if (label === null)
			return this._label;
		return label;
	}

	get visible()
	{
		if (this.control === null)
			return true;
		let view_lookupitem = this._view_lookupitem();
		if (view_lookupitem === null)
			return true;
		return view_lookupitem.visible;
	}

	_view_lookupitem()
	{
		let identifier = this.control.identifier;
		let active_view = this.control.app.active_view;
		if (active_view !== null && active_view.controls !== null)
		{
			let view_control = active_view.controls.get(identifier);
			if (view_control !== undefined && view_control.lookupdata !== undefined && view_control.lookupdata !== null)
			{
				let view_lookupitem = view_control.lookupdata.get(this.key);
				if (view_lookupitem !== undefined)
					return view_lookupitem;
			}
		}
		return null;
	}

	[ul4.symbols.repr]()
	{
		let repr = "<LookupItem key=" + ul4._repr(this.key) + " label=" + ul4._repr(this.label);
		if (!this.visible)
			repr += "visible=False"
		return repr + ">";
	}
};

LookupItem.prototype._ul4onattrs = ["control", "key", "_label"];
LookupItem.prototype._ul4attrs = new Set(["id", "control", "key", "label"]);


export class ViewLookupItem extends Base
{
	static classdoc = "View specific information about a lookup item";

	[ul4.symbols.repr]()
	{
		let repr = "<ViewLookupItem key=" + ul4._repr(this.key) + " label=" + ul4._repr(this.label);
		if (!this.visible)
			repr += " visible=False"
		return repr + ">";
	}
};

ViewLookupItem.prototype._ul4onattrs = ["key", "label", "visible"];
ViewLookupItem.prototype._ul4attrs = new Set(["key", "label", "visible"]);


export class LayoutControl extends Base
{
	static classdoc = "A decoration in an input form";

	[ul4.symbols.repr]()
	{
		return "<" + this.constructor.name + " id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

LayoutControl.prototype._ul4onattrs = ["label", "identifier", "view", "top", "left", "width", "height"];
LayoutControl.prototype._ul4attrs = new Set(["id", "label", "identifier", "view", "top", "left", "width", "height"]);


export class HTMLLayoutControl extends LayoutControl
{
	static classdoc = "HTML decoration in an input form";
};

HTMLLayoutControl.prototype._ul4onattrs = [...LayoutControl.prototype._ul4onattrs, "value"];
HTMLLayoutControl.prototype._ul4attrs = new Set([LayoutControl.prototype._ul4attrs, "value"]);


export class ImageLayoutControl extends LayoutControl
{
	static classdoc = "An image decoration in an input form";
};

ImageLayoutControl.prototype._ul4onattrs = [...LayoutControl.prototype._ul4onattrs, "original", "scaled"];
ImageLayoutControl.prototype._ul4attrs = new Set([LayoutControl.prototype._ul4attrs, "original", "scaled"]);


export class ButtonLayoutControl extends LayoutControl
{
	static classdoc = "A submit button in an input form";
};


export class ViewControl extends Base
{
	static classdoc = "Contains view specific information aboutn a control";

	get mode()
	{
		return this._mode ? "display" : "edit";
	}
};

ViewControl.prototype._ul4onattrs = ["view", "control", "top", "left", "width", "height", "liveupdate", "default", "tabindex", "minlength", "maxlength", "required", "placeholder", "_mode", "labelpos", "lookupnonekey", "lookupnonelabel", "label", "autoalign", "labelwidth", "lookupdata", "autoexpandable"];
ViewControl.prototype._ul4attrs = new Set(["id", "view", "control", "top", "left", "width", "height", "liveupdate", "default", "tabindex", "minlength", "maxlength", "required", "placeholder", "mode", "labelpos", "lookupnonekey", "lookupnonelabel", "label", "autoalign", "labelwidth", "lookupdata", "autoexpandable"]);


export class User extends Base
{
	static classdoc = "A LivingApps user/account";

	[ul4.symbols.repr]()
	{
		return "<User id=" + ul4._repr(this.id) + " firstname=" + ul4._repr(this.firstname) + " surname=" + ul4._repr(this.surname) + " email=" + ul4._repr(this.email) + ">";
	}
};

User.prototype._ul4onattrs = ["_id", "gender", "title", "firstname", "surname", "initials", "email", "streetname", "streetnumber", "zip", "city", "phone", "fax", "lang", "avatarsmall", "avatarlarge", "summary", "interests", "personalwebsite", "companywebsite", "company", "position", "department", "keyviews"];
User.prototype._ul4attrs = new Set(["id", "_id", "gender", "title", "firstname", "surname", "initials", "email", "streetname", "streetnumber", "zip", "city", "phone", "fax", "lang", "avatarsmall", "avatarlarge", "summary", "interests", "personalwebsite", "companywebsite", "company", "position", "department", "keyviews"]);


export class File extends Base
{
	static classdoc = "An uploaded file";

	[ul4.symbols.repr]()
	{
		return "<File id=" + ul4._repr(this.id) + " url=" + ul4._repr(this.url) + " filename=" + ul4._repr(this.filename) + ">";
	}

	get archive_url()
	{
		if (this.archive ==- null)
			return this.url;
		return this.archive.url + "/" + this.filename;
	}
};

File.prototype._ul4onattrs = ["url", "filename", "mimetype", "width", "height", "internalid", "createdat", "size", "archive"];
File.prototype._ul4attrs = new Set(["id", "url", "archive_url", "filename", "mimetype", "width", "height", "size", "archive", "createdat"]);


export class Geo extends Base
{
	static classdoc = "Geographical coordinates and location information";

	constructor(lat, long, info)
	{
		super(null);
		this.lat = lat;
		this.long = long;
		this.info = info;
	}

	[ul4.symbols.repr]()
	{
		return "<Geo lat=" + ul4._repr(this.lat) + " long=" + ul4._repr(this.long) + " info=" + ul4._repr(this.info) + ">";
	}
};

Geo.prototype._ul4onattrs = ["lat", "long", "info"];
Geo.prototype._ul4attrs = new Set(["lat", "long", "info"]);


export class Attachment extends Base
{
	[ul4.symbols.repr]()
	{
		return "<" + this.constructor.name + " id=" + ul4._repr(this.id) + " label=" + ul4._repr(this.label) + ">";
	}
};

Attachment.prototype._ul4onattrs = ["record", "label", "active"];
Attachment.prototype._ul4attrs = new Set(["id", "record", "label", "active"]);


export class NoteAttachment extends Attachment
{
	static classdoc = "A note attachment of a record";

};

NoteAttachment.prototype.type = "noteattachment";
NoteAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "value"];
NoteAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);


export class URLAttachment extends Attachment
{
	static classdoc = "A URL attachment of a record";

};

URLAttachment.prototype.type = "urlattachment";
URLAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "value"];
URLAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);


export class FileAttachment extends Attachment
{
	static classdoc = "A file attachment of a record";

};

FileAttachment.prototype.type = "fileattachment";
FileAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "value"];
FileAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);


export class ImageAttachment extends Attachment
{
	static classdoc = "An image attachment of a record";

};

ImageAttachment.prototype.type = "imageattachment";
ImageAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "original", "thumb", "small", "medium","large"];
ImageAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "original", "thumb", "small", "medium", "large"]);


export class JSONAttachment extends Attachment
{
	static classdoc = "A JSON attachment of a record";

	_dumpUL4ONAttr(name)
	{
		if (name === "value")
			return ul4._asjson(this.value);
		else
			return this[name];
	}

	_loadUL4ONAttr(name, value)
	{
		if (name === "value")
			this.value = ul4._fromjson(value);
		else
			this[name] = value
	}
};

JSONAttachment.prototype.type = "jsonattachment";
JSONAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "value"];
JSONAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);


export class Installation extends Base
{
	static classdoc = "The installation that created an app";

	[ul4.symbols.repr]()
	{
		return "<Installation id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

Installation.prototype._ul4onattrs = ["name"];
Installation.prototype._ul4attrs = new Set(["id", "name"]);


export class Category extends Base
{
	static classdoc = "A navigation category";

	[ul4.symbols.repr]()
	{
		let v = [];
		let category = this;
		while (category !== null)
		{
			v.splice(0, 0, category.identifier);
			category = category.parent;
		}
		return "<Category id=" + ul4._repr(this.id) + " identifierpath=" + ul4._repr(v.join("/")) +  + " name=" + ul4._repr(this.name) + ">";
	}
};

Category.prototype._ul4onattrs = ["identifier", "name", "order", "parent", "children", "apps"];
Category.prototype._ul4attrs = new Set(["id", "identifier", "name", "order", "parent", "children", "apps"]);


export class KeyView extends Base
{
	static classdoc = "Object granting access to a view template";

	[ul4.symbols.repr]()
	{
		return "<KeyView id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

KeyView.prototype._ul4onattrs = ["identifier", "name", "key", "user"];
KeyView.prototype._ul4attrs = new Set(["id", "identifier", "name", "key", "user"]);


export class AppParameter extends Base
{
	static classdoc = "A parameter of a LivingApps application";

	[ul4.symbols.repr]()
	{
		return "<AppParameter id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

AppParameter.prototype._ul4onattrs = ["app", "identifier", "description", "value"];
AppParameter.prototype._ul4attrs = new Set(["id", "app", "identifier", "description", "value"]);


let classes = [
	Globals,
	FlashMessage,
	App,
	View,
	DataSource,
	Record,
	BoolControl,
	IntControl,
	NumberControl,
	TextControl,
	EmailControl,
	URLControl,
	TelControl,
	TextAreaControl,
	DateControl,
	DatetimeMinuteControl,
	DatetimeSecondControl,
	LookupControl,
	LookupSelectControl,
	LookupRadioControl,
	LookupChoiceControl,
	AppLookupControl,
	AppLookupSelectControl,
	AppLookupRadioControl,
	AppLookupChoiceControl,
	MultipleLookupControl,
	MultipleLookupSelectControl,
	MultipleLookupCheckboxControl,
	MultipleLookupChoiceControl,
	MultipleAppLookupControl,
	MultipleAppLookupSelectControl,
	MultipleAppLookupCheckboxControl,
	MultipleAppLookupChoiceControl,
	GeoControl,
	FileControl,
	FileSignatureControl,
	ButtonControl,
	Field,
	BoolField,
	StringField,
	EmailField,
	URLField,
	TelField,
	TextAreaField,
	HTMLField,
	IntField,
	NumberField,
	GeoField,
	FileField,
	FileSignatureField,
	DateFieldBase,
	DateField,
	DatetimeMinuteField,
	DatetimeSecondField,
	LookupFieldBase,
	LookupField,
	MultipleLookupField,
	AppLookupFieldBase,
	AppLookupField,
	MultipleAppLookupField,
	LookupItem,
	ViewLookupItem,
	LayoutControl,
	HTMLLayoutControl,
	ImageLayoutControl,
	ButtonLayoutControl,
	ViewControl,
	User,
	File,
	Geo,
	NoteAttachment,
	URLAttachment,
	FileAttachment,
	ImageAttachment,
	JSONAttachment,
	Installation,
	Category,
	KeyView,
	AppParameter
];

for (let constructor of classes)
{
	ul4.register("de.livinglogic.livingapi." + constructor.name.toLowerCase(), constructor);
}
