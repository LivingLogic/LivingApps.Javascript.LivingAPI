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


export function element(name, ...args)
{
	let dom_node = document.createElement(name);
	for (let arg of args)
	{
		if (typeof(arg) === "string")
			dom_node.appendChild(document.createTextNode(arg));
		let ismap = arg instanceof Map;
		let isobject = ul4._isobject(arg);
		if (ismap || isobject)
		{
			if (isobject)
				arg = Object.entries(arg);
			for (let [name, value] of arg)
			{
				if (value !== null)
					dom_node.setAttribute(name, value);
			}
		}
	}
	return dom_node;
}


function _append_param_to_url(urlparams, name, value)
{
	if (ul4._islist(value))
	{
		for (let v of value)
			_append_param_to_url(urlparams, name, v);
	}
	else if (typeof(value) === "string")
		urlparams.append(name, value);
	else if (value !== null)
		urlparams.append(name, ul4._str(value));
}

export function url_with_params(url, ...params)
{
	let urlparams = new URLSearchParams();

	for (let param of params)
	{
		if (ul4._islist(param) && param.length == 2)
		{
			_append_param_to_url(urlparams, ...param);
		}
		else if (Object.prototype.toString.call(param) === "[object Object]" && !(param instanceof ul4.Proto))
		{
			for (let name in param)
				_append_param_to_url(urlparams, name, param[name]);
		}
		else if (param !== null && typeof(param) === "object" && typeof(param.__proto__) === "object" && param.__proto__ === Map.prototype)
		{
			for (let [name, value] of param)
				_append_param_to_url(urlparams, name, value);
		}
	}
	urlparams = urlparams.toString().replace("+", "%20");
	if (urlparams.length > 0)
		url += "?" + urlparams;
	return url;
}

/*
		let urlparams = new URLSearchParams({"template": identifier});
		for (let [name, value] of params)
		{
			if (Object.prototype.toString.call(v) === "[object Array]")
			{
				for (let [n, v])
			}
			urlparams.append()
*/

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
		else if (name.startsWith("x_"))
		{
			return this.hasOwnProperty(name) ? this[name] : null;
		}
		throw new ul4.AttributeError(this, name);
	}

	[ul4.symbols.setattr](name, value)
	{
		if (name.startsWith("x_"))
		{
			this[name] = value;
		}
		else
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


class GlobalsType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Globals;
	}
};

let globalstype = new GlobalsType("la", "Globals", "Global information");


export class Globals extends Base
{
	constructor(id)
	{
		super(id);
		this.version = null;
		this.hostname = null;
		this.platform = null;
		this.user = null;
		this.lang = null;
		this.datasources = null;
		this.app = null;
		this.record = null;
		this.mode = null;
		this.maxdbactions = null;
		this.maxtemplateruntime = null;
		this.flashmessages = null;
		this.view_template_id = null;
		this.email_template_id = null;
		this.handler = new Handler();
		this._log_stack = [];
		this._current_geo = null;
	}

	[ul4.symbols.type]()
	{
		return globalstype;
	}

	// distance between two geo coordinates (see https://de.wikipedia.org/wiki/Orthodrome#Genauere_Formel_zur_Abstandsberechnung_auf_der_Erde)
	geo_dist(geo1, geo2)
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

	scaled_url(image, width, height, type="fill", enlarge=true, gravity="sm", quality=null, rotate=null, blur=null, sharpen=null, format=null, cache=true)
	{
		let filename = null;

		if (image instanceof File)
		{
			image = "https://" + this.hostname + image.archive_url;
			filename = encodeURIComponent(image.filename);
			if (filename != image.filename)
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

		result += "/plain/" + encodeURIComponent(image);

		return result;
	}

	[ul4.symbols.repr]()
	{
		return "<Globals version=" + ul4._repr(this.version) + " mode=" + ul4._repr(this.mode) + ">";
	}

	current_geo()
	{
		return this._current_geo;
	}

	set_current_geo(position)
	{
		this._current_geo = new Geo(position.coords.latitude, position.coords.longitude);
	}

	_in_form()
	{
		return this.mode !== null && this.mode.startsWith("form/");
	}

	msg_bool(value)
	{
		switch (value)
		{
			case true:
				return this.msg_bool_true();
			case false:
				return this.msg_bool_false();
			default:
				return null;
		}
	}

	msg_bool_true(value)
	{
		switch (this.lang)
		{
			case "de":
				return "Ja";
			default:
				return "Yes";
		}
	}

	msg_bool_false(value)
	{
		switch (this.lang)
		{
			case "de":
				return "Nein";
			default:
				return "No";
		}
	}

	msg_no_fields()
	{
		switch (this.lang)
		{
			case "de":
				return "(Keine Felder gefunden)";
			default:
				return "(No fields found)";
		}
	}

	msg_nothing_selected()
	{
		switch (this.lang)
		{
			case "de":
				return "(Nichts ausgewählt)";
			default:
				return "(Nothing selected)";
		}
	}

	_make_log_message(messages)
	{
		return messages
			.map(m => typeof(m) !== "string" ? ul4._repr(m) : m)
			.join(" ")
		;
	}

	begin_logging(header)
	{
		this._log_stack.push({header: header, output: false});
	}

	end_logging()
	{
		if (this._log_stack)
		{
			if (this._log_stack[this._log_stack.length-1].output && console && console.groupEnd)
				console.groupEnd();
			this._log_stack.pop();
		}
	}

	group_logging(header, callback)
	{
		this.begin_logging(header);
		try
		{
			callback();
		}
		finally
		{
			this.end_logging();
		}
	}

	_start_log_message()
	{
		for (let level of this._log_stack)
		{
			if (!level.output)
			{
				if (console && console.group)
					console.group(level.header)
				level.output = true;
			}
		}
	}

	log_debug(...message)
	{
		this._start_log_message();
		if (console && console.debug)
			console.debug(this._make_log_message(message))
	}

	log_info(...message)
	{
		this._start_log_message();
		if (console && console.info)
			console.info(this._make_log_message(message))
	}

	log_warning(...message)
	{
		this._start_log_message();
		if (console && console.warn)
			console.warn(this._make_log_message(message))
	}

	log_error(...message)
	{
		this._start_log_message();
		if (console && console.error)
			console.error(this._make_log_message(message))
	}
};

Globals.prototype._ul4onattrs = ["version", "platform", "user", "maxdbactions", "maxtemplateruntime", "lang", "datasources", "hostname", "app", "record", "mode", "view_template_id", "email_template_id", "view_id"];
Globals.prototype._ul4attrs = new Set(["version", "hostname", "platform", "user", "lang", "datasources", "app", "record", "maxdbactions", "maxtemplateruntime", "flashmessages", "mode", "scaled_url", "geo_dist", "current_geo", "log_debug", "log_info", "log_warning", "log_error"]);
ul4.expose(Globals.prototype.log_debug, ["message", "*"]);
ul4.expose(Globals.prototype.log_info, ["message", "*"]);
ul4.expose(Globals.prototype.log_warning, ["message", "*"]);
ul4.expose(Globals.prototype.log_error, ["message", "*"]);
ul4.expose(Globals.prototype.geo_dist, ["geo1", "pk", "geo2", "pk"]);
ul4.expose(Globals.prototype.current_geo, []);
ul4.expose(Globals.prototype.scaled_url, [
	"image", "p",
	"width", "p",
	"height", "p",
	"type", "k=", "fill",
	"enlarge", "k=", true,
	"gravity", "k=", "sm",
	"quality", "k=", null,
	"rotate", "k=", null,
	"blur", "k=", null,
	"sharpen", "k=", null,
	"format", "k=", null,
	"cache", "k=", true
]);


class FlashMessageType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof FlashMessage;
	}
};

let flashmessagetype = new FlashMessageType("la", "FlashMessage", "A flash message in a web page");


export class FlashMessage extends Base
{
	[ul4.symbols.type]()
	{
		return flashmessagetype;
	}

	[ul4.symbols.repr]()
	{
		return "<FlashMessage type=" + ul4._repr(this.type) + " title=" + ul4._repr(this.title) + ">";
	}
};

FlashMessage.prototype._ul4onattrs = ["timestamp", "type", "title", "message"];
FlashMessage.prototype._ul4attrs = new Set(["timestamp", "type", "title", "message"]);


class AppType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof App;
	}
};

let apptype = new AppType("la", "App", "A LivingApps application");


export class App extends Base
{
	[ul4.symbols.type]()
	{
		return apptype;
	}

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

	template_url(identifier, record=null, params)
	{
		let url = "/gateway/apps/" + this.id;
		if (record !== null)
			url += "/" + record.id;
		return url_with_params(url, ['template', identifier], params);
	}

	new_embedded_url(params)
	{
		let url = "/dateneingabe/" + this.id + "/new";
		return url_with_params(url, params);
	}

	new_standalone_url(params)
	{
		let url = "/gateway/apps/" + this.id + "/new";
		return url_with_params(url, params);
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
		else if (name.startsWith("lc_"))
		{
			if (this.layout_controls === null || !this.layout_controls.has(name.substr(3)))
				throw new ul4.AttributeError(this, name);
			return this.layout_controls.get(name.substr(3));
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

	get layout_controls()
	{
		if (this.active_views === null)
			return new Map();
		return this.active_view.layout_controls;
	}
};


App.prototype._ul4onattrs = ["globals", "name", "description", "lang", "startlink", "iconlarge", "iconsmall", "createdby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "basetable", "primarykey", "insertprocedure", "updateprocedure", "deleteprocedure", "templates", "createdat", "updatedat", "updatedby", "superid", "favorite", "_active_view"];
App.prototype._ul4attrs = new Set(["id", "globals", "name", "description", "lang", "startlink", "iconlarge", "iconsmall", "createdat", "createdby", "updatedat", "updatedby", "controls", "layout_controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "insert", "favorite", "_active_view", "template_url", "new_embedded_url", "new_standalone_url"]);
ul4.expose(App.prototype[ul4.symbols.call], ["values", "**"], {"needsobject": true});
ul4.expose(App.prototype.insert, ["values", "**"], {"needsobject": true});
ul4.expose(App.prototype.template_url, ["identifier", "p", "record", "p=", null, "params", "**"]);
ul4.expose(App.prototype.new_embedded_url, ["params", "**"]);
ul4.expose(App.prototype.new_standalone_url, ["params", "**"]);


class ViewType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof View;
	}
};

let viewtype = new ViewType("la", "View", "An input form for a LivingViews application");


export class View extends Base
{
	[ul4.symbols.type]()
	{
		return viewtype;
	}

	[ul4.symbols.repr]()
	{
		return "<View id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

View.prototype._ul4onattrs = ["name", "combined_type", "app", "order", "width", "height", "start", "end", "controls", "layout_controls", "lang", "login_required", "result_page", "use_geo"];
View.prototype._ul4attrs = new Set(["id", "name", "combined_type", "app", "order", "width", "height", "start", "end", "controls", "layout_controls", "lang", "login_required", "result_page", "use_geo"]);


class DataSourceType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof DataSource;
	}
};

let datasourcetype = new DataSourceType("la", "DataSource", "The data resulting from a data source configuration");


export class DataSource extends Base
{
	[ul4.symbols.type]()
	{
		return datasourcetype;
	}

	[ul4.symbols.repr]()
	{
		return "<DataSource id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

DataSource.prototype._ul4onattrs = ["identifier", "app", "apps"];
DataSource.prototype._ul4attrs = new Set(["id", "identifier", "app", "apps"]);


class RecordType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Record;
	}
};

let recordtype = new RecordType("la", "Record", "A record of a LivingApp application");


export class Record extends Base
{
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

	[ul4.symbols.type]()
	{
		return recordtype;
	}

	as_text(maxlevel=3, controls=null)
	{
		if (maxlevel == 0)
			return "...";
		let fields = [];
		for (let [identifier, control] of (controls || this.app.controls))
		{
			if (controls !== null || control.priority)
			{
				let fieldvalue = this.fields.get(identifier).value_as_text(maxlevel-1);
				if (fieldvalue !== null)
					fields.push([control.label, fieldvalue]);
			}
		}
		if (fields.length === 0)
			return this.globals.msg_no_fields();
		else if (fields.length === 1)
			return fields[0][1];
		let result = [];
		for (let [label, fieldvalue] of fields)
			result.push(label + ": " + fieldvalue);
		return result.join(", ");
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

		return globals._in_form() && this === globals.record;
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

	template_url(identifier, params)
	{
		let url = "/gateway/apps/" + this.app.id + "/" + this.id;
		return url_with_params(url, ['template', identifier], params);
	}

	edit_embedded_url(params)
	{
		let url = "/dateneingabe/" + this.app.id + "/" + this.id + "/edit";
		return url_with_params(url, params);
	}

	edit_standalone_url(params)
	{
		let url = "/gateway/apps/" + this.app.id + "/" + this.id + "/edit";
		return url_with_params(url, params);
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
			return this.fields.get(name.substr(2)).value
		else
			return super[ul4.symbols.getattr](name);
	}

	[ul4.symbols.setattr](name, value)
	{
		if (name.startsWith("c_"))
			this.children[name.substr(2)] = value;
		else if (name.startsWith("v_"))
			this.fields.get(name.substr(2)).value = value;
		else
			return super[ul4.symbols.setattr](name, value);
	}
};

Record.prototype._ul4onattrs = ["app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "_sparsevalues", "attachments", "children", "errors", "_sparsefielderrors", "_sparsefieldlookupdata"];
Record.prototype._ul4attrs = new Set(["id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "fields", "attachments", "children", "errors", "template_url", "edit_embedded_url", "edit_standalone_url"]);
ul4.expose(Record.prototype.is_dirty, []);
ul4.expose(Record.prototype.has_errors, []);
ul4.expose(Record.prototype.delete, []);
ul4.expose(Record.prototype.save, []);
ul4.expose(Record.prototype.update, ["values", "**"], {"needsobject": true});
ul4.expose(Record.prototype.template_url, ["identifier", "p", "params", "**"]);
ul4.expose(Record.prototype.edit_embedded_url, ["params", "**"]);
ul4.expose(Record.prototype.edit_standalone_url, ["params", "**"]);


class FieldType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Field;
	}
};

let fieldtype = new FieldType("la", "Field", "Holds the value of a field of a record (and related information)");


export class Field extends Base
{
	constructor(control, record, value)
	{
		super(null);
		this.control = control;
		this.record = record;
		this._label = null;
		this._lookupdata = null;
		this.errors = [];
		this._value = null;
		if (!this._in_form())
			this.value = value;
		this._dirty = false;
		this._enabled = true;
		this._writable = true;
		this._visible = true;
	}

	[ul4.symbols.type]()
	{
		return fieldtype;
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
			if (this.record._values !== null)
				this.record._values.set(this.control.identifier, change.value);
			this._value = change.value;
			this._dirty = true;
		}
		this.errors = change.errors;
		if (this._in_form())
			this._set_dom_value(this._value);
	}

	value_as_text(maxlevel=3)
	{
		return null;
	}

	_validate(change)
	{
		// Do nothing, i.e. accept the value unchanged and without errors
	}

	_set_dom_label()
	{
		if (this._in_form())
			this._dom_label.textContent = this.label;
	}

	get label()
	{
		return this._label ?? this.control.label;
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
		return this._value === null;
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

	I.e. they are expected to be executed inside a browser.
	*/
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

	get _dom_root()
	{
		return document.querySelector(this._sel_root);
	}

	get _dom_label()
	{
		return document.querySelector(this._sel_label);
	}

	get _dom_control()
	{
		return document.querySelector(this._sel_control);
	}

	get _dom_controls()
	{
		return document.querySelectorAll(this._sel_control);
	}

	_get_dom_value()
	{
		return this._dom_control.value;
	}

	_set_dom_value(value)
	{
		this._dom_control.value = value !== null ? value : "";
	}

	get visible()
	{
		return this._visible;
	}

	set visible(value)
	{
		if (this._in_form())
			this._dom_root.hidden = !value;
		this._visible = value;
	}

	get enabled()
	{
		if (this._in_form())
			return !this._dom_root.classList.contains("llft-control-readonly");
		else
			return this._enabled;
	}

	set enabled(value)
	{
		if (this._in_form())
		{
			let disabled = !value;
			for (let node of this._dom_controls)
				node.disabled = disabled;
			this._dom_root.classList.toggle("llft-control-readonly", disabled);
		}
		this._enabled = value;
	}

	get writable()
	{
		return this._writable;
	}

	set writable(value)
	{
		this._writable = value;
	}

	[ul4.symbols.repr]()
	{
		let s = "<" + this.constructor.name + " identifier=";
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
		if (name === "value")
			this.value = value;
		else if (name === "visible")
			this.visible = ul4._bool(value);
		else if (name === "enabled")
			this.enabled = ul4._bool(value);
		else if (name === "writable")
			this.writable = ul4._bool(value);
		else
			return super[ul4.symbols.getattr](name);
	}
};

Field.prototype._ul4onattrs = ["control", "record", "label", "value", "errors", "_visible", "_enabled", "_writable"];
Field.prototype._ul4attrs = new Set(["control", "record", "label", "value", "errors", "visible", "enabled", "writable"]);
Field.prototype._inputevent = "input";


class BoolFieldType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof BoolField;
	}
};

let boolfieldtype = new BoolFieldType("la", "BoolField", "Holds the value of a bool field of a record (and related information)");


export class BoolField extends Field
{
	[ul4.symbols.type]()
	{
		return boolfieldtype;
	}

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
		return this._dom_control.checked;
	}

	_set_dom_value(value)
	{
		this._dom_control.checked = value;
	}

	value_as_text(maxlevel=3)
	{
		return this.globals.msg_bool(this.value);
	}
};


class IntFieldType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof IntField;
	}
};

let intfieldtype = new IntFieldType("la", "IntField", "Holds the value of an int field of a record (and related information)");


export class IntField extends Field
{
	[ul4.symbols.type]()
	{
		return intfieldtype;
	}

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
		super._set_dom_value(value !== null ? value + "" : "");
	}

	value_as_text(maxlevel=3)
	{
		let value = this.value;
		return value != null ? value + "" : null;
	}

	get writable()
	{
		return this._writable;
	}

	set writable(value)
	{
		if (this._in_form())
		{
			let readonly = !value;
			for (let node of this._dom_controls)
				node.readOnly = readonly;
		}
		super.writable = value;
	}
};


class NumberFieldType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof NumberField;
	}
};

let numberfieldtype = new NumberFieldType("la", "NumberField", "Holds the value of a number field of a record (and related information)");


export class NumberField extends Field
{
	[ul4.symbols.type]()
	{
		return numberfieldtype;
	}

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
			let value = this._bound_value(change.value);
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
		else if (value === null)
			value = "";
		value += "";
		if (this.globals.lang == "de" && this.control.precision === null)
			value = value.replace(".", ",");
		super._set_dom_value(value);
	}

	value_as_text(maxlevel=3)
	{
		let value = this.value;
		if (value === null)
			return null;
		if (this.control.precision !== null)
			return value.toFixed(this.control.precision);
		return value.toString();
	}

	get writable()
	{
		return this._writable;
	}

	set writable(value)
	{
		if (this._in_form())
		{
			let readonly = !value;
			for (let node of this._dom_controls)
				node.readOnly = readonly;
		}
		super.writable = value;
	}
};


class StringFieldType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof StringField;
	}
};

let stringfieldtype = new StringFieldType("la", "StringField", "Holds the value of a string field of a record (and related information)");


export class StringField extends Field
{
	[ul4.symbols.type]()
	{
		return stringfieldtype;
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

	get writable()
	{
		return this._writable;
	}

	set writable(value)
	{
		if (this._in_form())
		{
			let readonly = !value;
			for (let node of this._dom_controls)
				node.readOnly = readonly;
		}
		super.writable = value;
	}

	value_as_text(maxlevel=3)
	{
		return this.value;
	}
};


class PasswordFieldType extends StringFieldType
{
	instancecheck(obj)
	{
		return obj instanceof PasswordField;
	}
};

let passwordfieldtype = new PasswordFieldType("la", "PasswordField", "Holds the value of a string/password field of a record (and related information)");


export class PasswordField extends StringField
{
	[ul4.symbols.type]()
	{
		return passwordfieldtype;
	}
};


class EmailFieldType extends StringFieldType
{
	instancecheck(obj)
	{
		return obj instanceof EmailField;
	}
};

let emailfieldtype = new EmailFieldType("la", "EmailField", "Holds the value of a string/email field of a record (and related information)");


export class EmailField extends StringField
{
	[ul4.symbols.type]()
	{
		return emailfieldtype;
	}

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


class URLFieldType extends StringFieldType
{
	instancecheck(obj)
	{
		return obj instanceof URLField;
	}
};

let urlfieldtype = new URLFieldType("la", "URLField", "Holds the value of a string/url field of a record (and related information)");


export class URLField extends StringField
{
	[ul4.symbols.type]()
	{
		return urlfieldtype;
	}

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


class TelFieldType extends StringFieldType
{
	instancecheck(obj)
	{
		return obj instanceof TelField;
	}
};

let telfieldtype = new TelFieldType("la", "TelField", "Holds the value of a string/tel field of a record (and related information)");


export class TelField extends StringField
{
	[ul4.symbols.type]()
	{
		return telfieldtype;
	}

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


class TextAreaFieldType extends StringFieldType
{
	instancecheck(obj)
	{
		return obj instanceof TextAreaField;
	}
};

let textareafieldtype = new TextAreaFieldType("la", "TextAreaField", "Holds the value of a string/textarea field of a record (and related information)");


export class TextAreaField extends StringField
{
	[ul4.symbols.type]()
	{
		return textareafieldtype;
	}
};


class HTMLFieldType extends StringFieldType
{
	instancecheck(obj)
	{
		return obj instanceof HTMLField;
	}
};

let htmlfieldtype = new HTMLFieldType("la", "HTMLField", "Holds the value of a string/html field of a record (and related information)");


export class HTMLField extends StringField
{
	[ul4.symbols.type]()
	{
		return htmlfieldtype;
	}
};


class GeoFieldType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof GeoField;
	}
};

let geofieldtype = new GeoFieldType("la", "GeoField", "Holds the value of a geo field of a record (and related information)");


export class GeoField extends Field
{
	[ul4.symbols.type]()
	{
		return geofieldtype;
	}

	_get_dom_value()
	{
		for (let dom_node of this._dom_controls)
		{
			if (dom_node.id.endsWith("_geoinfo"))
			{
				let value = dom_node.value;
				if (value)
				{
					value = JSON.parse(value);
					return new Geo(
						value.geometry.coordinates[0],
						value.geometry.coordinates[1],
						value.properties.formatted_address
					);
				}
			}
		}
		return null;
	}

	_set_dom_value(value)
	{
		if (value === null)
		{
			for (let dom_node of this._dom_controls)
			{
				dom_node.value = null;
			}
		}
		else
		{
			for (let dom_node of this._dom_controls)
			{
				if (dom_node.id.endsWith("_geoinfo"))
				{
					let dom_value = {
						"type": "Feature",
						"geometry": {
							"coordinates": [
								value.lat,
								value.long
							]
						},
						"properties": {
							"formatted_address": value.info
						}
					};
					dom_node.value = ul4._asjson(dom_value);
				}
				else
					dom_node.value = value.info;
			}
		}
	}

	value_as_text(maxlevel=3)
	{
		let value = this.value;
		if (this.value === null)
			return null;
		// FIXME: Show N/S and W/E? Show arc minutes/seconds?
		let result = value.lat.toFixed(5) + ", " + value.long.toFixed(5);
		if (value.info !== null)
			result += " (" + value.info + ")";
		return result;
	}

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
GeoField.prototype._inputevent = "llgeo";


class FileFieldType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof FileField;
	}
};

let filefieldtype = new FileFieldType("la", "FileField", "Holds the value of a file field of a record (and related information)");


export class FileField extends Field
{
	[ul4.symbols.type]()
	{
		return filefieldtype;
	}

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


class FileSignatureFieldType extends FileFieldType
{
	instancecheck(obj)
	{
		return obj instanceof FileSignatureField;
	}
};

let filesignaturefieldtype = new FileSignatureFieldType("la", "FileSignatureField", "Holds the value of a file/signature field of a record (and related information)");


export class FileSignatureField extends FileField
{
	[ul4.symbols.type]()
	{
		return filesignaturefieldtype;
	}

	_validate(change)
	{
		// FIXME: Implement handling of data URLs.
		super._validate(change);
	}
};


class DateFieldBaseType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof DateFieldBase;
	}
};

let datefieldbasetype = new DateFieldBaseType("la", "DateFieldBase", "Holds the value of a date field of a record (and related information)");


export class DateFieldBase extends Field
{
	[ul4.symbols.type]()
	{
		return datefieldbasetype;
	}

	value_as_text(maxlevel=3)
	{
		let value = this.value;
		if (value === null)
			return null;
		if (typeof(value) === "string")
			return value;
		return ul4._format(value, this.control.formatstring())
	}

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
			else if (format.startsWith("%z"))
			{
				if (!value.startsWith("-") && !value.startsWith("+"))
					return null;
				value = value.substring(1);
				let _tzhour = _int(value, 2);
				if (_tzhour === null)
					return null;
				value = value.substring(2);
				if (!value.startsWith(":"))
					return null;
				value = value.substring(1);
				let _tzminute = _int(value, 2);
				if (_tzminute === null)
					return null;
				value = value.substring(2);
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
		else
			value = "";
		super._set_dom_value(value);
	}
};


class DateFieldType extends DateFieldBaseType
{
	instancecheck(obj)
	{
		return obj instanceof DateField;
	}
};

let datefieldtype = new DateFieldType("la", "DateField", "Holds the value of a date/date field of a record (and related information)");


export class DateField extends DateFieldBase
{
	[ul4.symbols.type]()
	{
		return datefieldtype;
	}

	_convert(date)
	{
		return new ul4.Date_(date.getFullYear(), date.getMonth()+1, date.getDate());
	}
};


class DatetimeMinuteFieldType extends DateFieldBaseType
{
	instancecheck(obj)
	{
		return obj instanceof DatetimeMinuteField;
	}
};

let datetimeminutefieldtype = new DatetimeMinuteFieldType("la", "DatetimeMinuteField", "Holds the value of a date/datetimeminute field of a record (and related information)");


export class DatetimeMinuteField extends DateFieldBase
{
	[ul4.symbols.type]()
	{
		return datetimeminutefieldtype;
	}

	_convert(date)
	{
		// Get rid of seconds and milliseconds, this modifies the object passed in.
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	}
};


class DatetimeSecondFieldType extends DateFieldBaseType
{
	instancecheck(obj)
	{
		return obj instanceof DatetimeSecondField;
	}
};

let datetimesecondfieldtype = new DatetimeSecondFieldType("la", "DatetimeSecondField", "Holds the value of a date/datetimesecond field of a record (and related information)");


export class DatetimeSecondField extends DateFieldBase
{
	[ul4.symbols.type]()
	{
		return datetimesecondfieldtype;
	}

	_convert(date)
	{
		// Get rid of milliseconds, this modifies the object passed in.
		date.setMilliseconds(0);
		return date;
	}
};

/*
`ChoiceFieldBase` is used as the base class for all `lookup`, `multiplelookup`,
`applookup` and `multipleapplookup` fields.

Since the inheritance hierarchy follows the data model *not* which HTML element
is used for editing, we would have to implement the same DOM interaction logic
in multiple classes (i.e. we would have to handle a HTML `select` element in
`LookupSelectField`, `MultipleLookupSelectField`, `AppLookupSelectField`
and `MultipleAppLookupSelectField`).

To solve this problem, all methods that handle HTML elements are implemented in
this class. Subclasses then simply call the appropriate method.
*/
export class ChoiceFieldBase extends Field
{
	_make_option(selected, value, label)
	{
		let option = element(
			"option",
			label,
			{
				"value": value,
				"class": value === this.control.nonekey ? "la-none-option" : null,
				"selected": selected ? "selected" : null,
			}
		);
		return option;
	}

	_set_dom_lookupdata_select(lookupdata)
	{
		if (lookupdata === null)
			lookupdata = this.control.lookup_data;
		if (ul4._isobject(lookupdata))
			lookupdata = new Map(Object.entries(lookupdata));

		let none_selected = false;
		let selected = new Set();
		for (let dom_option of this._dom_control.querySelectorAll("option:checked"))
		{
			let value = dom_option.getAttribute("value");
			if (lookupdata.has(value))
				selected.add(value);
			else if (value === this.control.nonekey)
				none_selected = true;
		}

		let new_children = [];
		if (this.control.nonekey !== null)
		{
			new_children.push(
				this._make_option(
					none_selected,
					this.control.nonekey,
					this.control.nonelabel !== null ? this.control.nonelabel : this.globals.msg_nothing_selected()
				)
			);
		}

		for (let [key, value] of lookupdata)
		{
			new_children.push(
				this._make_option(
					selected.has(key),
					key,
					this._make_label(value)
				)
			);
		}
		this._dom_control.replaceChildren(...new_children);
	}

	_set_dom_lookupdata_input(lookupdata)
	{
		if (lookupdata === null)
			lookupdata = this.control.lookupdata;
		else if (ul4._isobject(lookupdata))
			lookupdata = new Map(Object.entries(lookupdata));

		let none_selected = false;
		let selected = new Set();
		for (let dom_input of this._dom_controls)
		{
			let value = dom_input.getAttribute("value");
			if (dom_input.checked)
			{
				if (lookupdata.has(value))
					selected.add(value);
				else if (value === this.control.nonekey)
					none_selected = true;

			}
		}

		let dom_none_input = this._dom_root.querySelector("input[value=" + this.control.nonekey + "]");
		if (dom_none_input !== null)
			dom_none_input.checked = none_selected;

		for (let [key, item] of this.control.lookupdata)
		{
			let dom_input = this._dom_root.querySelector("input[value=" + key + "]");
			let dom_label = this._dom_root.querySelector("label[for=" + dom_input.id + "]")

			if (lookupdata.has(key))
			{
				dom_input.style.display = "inline";
				dom_label.style.display = "inline";
				dom_label.innerText = this._make_label(lookupdata.get(key));
			}
			else
			{
				dom_input.style.display = "none";
				dom_label.style.display = "none";
				dom_label.checked = false;
			}
		}
	}
};


class LookupFieldBaseType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof LookupFieldBase;
	}
};

let lookupfieldbasetype = new LookupFieldBaseType("la", "LookupFieldBase", "Base type of LookupField and MultipleLookupField");


export class LookupFieldBase extends ChoiceFieldBase
{
	[ul4.symbols.type]()
	{
		return lookupfieldbasetype;
	}

	get lookupdata()
	{
		if (this._lookupdata !== null)
			return this._lookupdata;
		else
			return this.control.lookupdata;
	}

	set lookupdata(value)
	{
		if (this._in_form())
			this._set_dom_lookupdata(value);
		this._lookupdata = value;
	}

	_set_dom_lookupdata(lookupdata)
	{
	}

	_make_label(value)
	{
		if (typeof(value) === "string")
			return value;
		else if (value instanceof LookupItem)
			return value.label;
		else
			return ul4._str(value);
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


class LookupFieldType extends LookupFieldBaseType
{
	instancecheck(obj)
	{
		return obj instanceof LookupField;
	}
};

let lookupfieldtype = new LookupFieldType("la", "LookupField", "Holds the value of a lookup field of a record (and related information)");


export class LookupField extends LookupFieldBase
{
	[ul4.symbols.type]()
	{
		return lookupfieldtype;
	}

	value_as_text(maxlevel=3)
	{
		let value = this.value;
		if (value === null)
			return null;
		return value.label;
	}

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


class LookupRadioFieldType extends LookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof LookupRadioField;
	}
};

let lookupradiofieldtype = new LookupRadioFieldType("la", "LookupRadioField", "Holds the value of a lookup/radio field of a record (and related information)");


export class LookupRadioField extends LookupField
{
	[ul4.symbols.type]()
	{
		return lookupradiofieldtype;
	}

	get _sel_label()
	{
		return this._sel_root + " label:not([for]) > span";
	}

	_get_dom_value()
	{
		for (let node of this._dom_controls)
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

		for (let node of this._dom_controls)
			node.checked = node.getAttribute("value") === value;
	}

	_set_dom_lookupdata(lookupdata)
	{
		this._set_dom_lookupdata_input(lookupdata);
	}
};


class LookupSelectFieldType extends LookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof LookupSelectField;
	}
};

let lookupselectfieldtype = new LookupSelectFieldType("la", "LookupSelectField", "Holds the value of a lookup/select field of a record (and related information)");


export class LookupSelectField extends LookupField
{
	[ul4.symbols.type]()
	{
		return lookupselectfieldtype;
	}

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

	_set_dom_lookupdata(lookupdata)
	{
		this._set_dom_lookupdata_select(lookupdata);
	}
};


class LookupChoiceFieldType extends LookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof LookupChoiceField;
	}
};

let lookupchoicefieldtype = new LookupChoiceFieldType("la", "LookupChoiceField", "Holds the value of a lookup/choice field of a record (and related information)");


export class LookupChoiceField extends LookupField
{
	[ul4.symbols.type]()
	{
		return lookupchoicefieldtype;
	}
};


class MultipleLookupFieldType extends LookupFieldBaseType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupField;
	}
};

let multiplelookupfieldtype = new MultipleLookupFieldType("la", "MultipleLookupField", "Holds the value of a multiple lookup field of a record (and related information)");


export class MultipleLookupField extends LookupFieldBase
{
	[ul4.symbols.type]()
	{
		return multiplelookupfieldtype;
	}

	is_empty()
	{
		return this._value.length === 0;
	}

	value_as_text(maxlevel=3)
	{
		let value = this.value;
		if (value === null || value.length === 0)
			return null;
		return value.map(item => item.label).join(", ");
	}

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


class MultipleLookupCheckboxFieldType extends MultipleLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupCheckboxField;
	}
};

let multiplelookupcheckboxfieldtype = new MultipleLookupCheckboxFieldType("la", "MultipleLookupCheckboxField", "Holds the value of a multiplelookup/radio field of a record (and related information)");


export class MultipleLookupCheckboxField extends MultipleLookupField
{
	[ul4.symbols.type]()
	{
		return multiplelookupcheckboxfieldtype;
	}

	get _sel_label()
	{
		return this._sel_root + " label:not([for]) > span";
	}

	_get_dom_value()
	{
		let value = [];
		for (let node of this._dom_controls)
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

		for (let node of this._dom_controls)
			node.checked = values.has(node.getAttribute("value"));
	}

	_set_dom_lookupdata(lookupdata)
	{
		this._set_dom_lookupdata_input(lookupdata);
	}
};


class MultipleLookupSelectFieldType extends MultipleLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupSelectField;
	}
};

let multiplelookupselectfieldtype = new MultipleLookupSelectFieldType("la", "MultipleLookupSelectField", "Holds the value of a multiplelookup/select field of a record (and related information)");

export class MultipleLookupSelectField extends MultipleLookupField
{
	[ul4.symbols.type]()
	{
		return multiplelookupselectfieldtype;
	}

	_get_dom_value()
	{
		let value = [];
		for (let option of this._dom_control.querySelectorAll("option"))
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
		for (let option of this._dom_control.querySelectorAll("option"))
			option.selected = values.has(option.getAttribute("value"));
	}

	_set_dom_lookupdata(lookupdata)
	{
		this._set_dom_lookupdata_select(lookupdata);
	}
};


class MultipleLookupChoiceFieldType extends MultipleLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupChoiceField;
	}
};

let multiplelookupchoicefieldtype = new MultipleLookupChoiceFieldType("la", "MultipleLookupChoiceField", "Holds the value of a multiplelookup/choice field of a record (and related information)");


export class MultipleLookupChoiceField extends MultipleLookupField
{
	[ul4.symbols.type]()
	{
		return multiplelookupchoicefieldtype;
	}
};


class AppLookupFieldBaseType extends FieldType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupFieldBase;
	}
};

let applookupfieldbasetype = new AppLookupFieldBaseType("la", "AppLookupFieldBase", "Base type of AppLookupField and MultipleAppLookupField");


export class AppLookupFieldBase extends ChoiceFieldBase
{
	[ul4.symbols.type]()
	{
		return applookupfieldbasetype;
	}

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
		if (this._in_form())
			this._set_dom_lookupdata(value);
		this._lookupdata = value;
	}

	_set_dom_lookupdata(lookupdata)
	{
	}

	_make_label(value)
	{
		if (typeof(value) === "string")
			return value;
		else if (value instanceof Record)
			return value.as_text(this.control.lookup_controls);
		else
			return ul4._str(value);
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

	[ul4.symbols.setattr](key, value)
	{
		if (key === "lookupdata")
			this.lookupdata = value;
		else
			super[ul4.symbols.setattr](key, value);
	}
};
AppLookupFieldBase.prototype._ul4attrs = new Set([...Field.prototype._ul4attrs, "lookupdata"]);



class AppLookupFieldType extends AppLookupFieldBaseType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupField;
	}
};

let applookupfieldtype = new AppLookupFieldType("la", "AppLookupField", "Holds the value of a applookup field of a record (and related information)");


export class AppLookupField extends AppLookupFieldBase
{
	[ul4.symbols.type]()
	{
		return applookupfieldtype;
	}

	value_as_text(maxlevel=3)
	{
		let value = this.value;
		if (value === null)
			return null;
		return "(" + this.value.as_text(maxlevel) + ")";
	}

	_validate(change)
	{
		this._find_record(change);
	}
};


class AppLookupSelectFieldType extends AppLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupSelectField;
	}
};

let applookupselectfieldtype = new AppLookupSelectFieldType("la", "AppLookupSelectField", "Holds the value of a `applookup`/`select` field of a record (and related information)");


export class AppLookupSelectField extends AppLookupField
{
	[ul4.symbols.type]()
	{
		return applookupselectfieldtype;
	}

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

	_set_dom_lookupdata(lookupdata)
	{
		this._set_dom_lookupdata_select(lookupdata);
	}
};


class AppLookupRadioFieldType extends AppLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupRadioField;
	}
};

let applookupradiofieldtype = new AppLookupRadioFieldType("la", "AppLookupRadioField", "Holds the value of a `applookup`/`radio` field of a record (and related information)");


export class AppLookupRadioField extends AppLookupField
{
	[ul4.symbols.type]()
	{
		return applookupradiofieldtype;
	}
};


class AppLookupChoiceFieldType extends AppLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupChoiceField;
	}
};

let applookupchoicefieldtype = new AppLookupChoiceFieldType("la", "AppLookupChoiceField", "Holds the value of a `applookup`/`choice` field of a record (and related information)");


export class AppLookupChoiceField extends AppLookupField
{
	[ul4.symbols.type]()
	{
		return applookupchoicefieldtype;
	}
};


class MultipleAppLookupFieldType extends AppLookupFieldBaseType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupField;
	}
};

let multipleapplookupfieldtype = new MultipleAppLookupFieldType("la", "MultipleAppLookupField", "Holds the value of a multiple applookup field of a record (and related information)");


export class MultipleAppLookupField extends AppLookupFieldBase
{
	[ul4.symbols.type]()
	{
		return multipleapplookupfieldtype;
	}

	is_empty()
	{
		return this._value.length === 0;
	}

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


class MultipleAppLookupCheckboxFieldType extends MultipleAppLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupCheckboxField;
	}
};

let multipleapplookupcheckboxfieldtype = new MultipleAppLookupCheckboxFieldType("la", "MultipleAppLookupCheckboxField", "Holds the value of a `multipleapplookup`/`checkbox` field of a record (and related information)");


export class MultipleAppLookupCheckboxField extends MultipleAppLookupField
{
	[ul4.symbols.type]()
	{
		return multipleapplookupcheckboxfieldtype;
	}
};


class MultipleAppLookupSelectFieldType extends MultipleAppLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupSelectField;
	}
};

let multipleapplookupselectfieldtype = new MultipleAppLookupSelectFieldType("la", "MultipleAppLookupSelectField", "Holds the value of a `multipleapplookup`/`select` field of a record (and related information)");


export class MultipleAppLookupSelectField extends MultipleAppLookupField
{
	[ul4.symbols.type]()
	{
		return multipleapplookupselectfieldtype;
	}

	_set_dom_lookupdata(lookupdata)
	{
		this._set_dom_lookupdata_select(lookupdata);
	}
};


class MultipleAppLookupChoiceFieldType extends MultipleAppLookupFieldType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupChoiceField;
	}
};

let multipleapplookupchoicefieldtype = new MultipleAppLookupChoiceFieldType("la", "MultipleAppLookupChoiceField", "Holds the value of a `multipleapplookup`/`choice` field of a record (and related information)");


export class MultipleAppLookupChoiceField extends MultipleAppLookupField
{
	[ul4.symbols.type]()
	{
		return multipleapplookupchoicefieldtype;
	}
};


class ControlType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Control;
	}
};

let controltype = new ControlType("la", "Control", "Metainformation about a field in a LivingApps application");


export class Control extends Base
{
	[ul4.symbols.type]()
	{
		return controltype;
	}

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


class BoolControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof BoolControl;
	}
};

let boolcontroltype = new BoolControlType("la", "BoolControl", "A LivingApps boolean field (type 'bool')");


export class BoolControl extends Control
{
	[ul4.symbols.type]()
	{
		return boolcontroltype;
	}

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


class IntControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof IntControl;
	}
};

let intcontroltype = new IntControlType("la", "IntControl", "A LivingApps integer field (type 'int')");


export class IntControl extends Control
{
	[ul4.symbols.type]()
	{
		return intcontroltype;
	}

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


class PlaceholderControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof PlaceholderControld;
	}
};

let placeholdercontroltype = new PlaceholderControlType("la", "PlaceholderControl", "A LivingApps field that has a placeholder");


class PlaceholderControl extends Control
{
	[ul4.symbols.type]()
	{
		return placeholdercontroltype;
	}

	get placeholder()
	{
		let view_control = this._view_control();
		if (view_control === null)
			return null;
		return view_control.placeholder;
	}
};

PlaceholderControl.prototype._ul4attrs = new Set([...Control.prototype._ul4attrs, "placeholder"]);


class NumberControlType extends PlaceholderControlType
{
	instancecheck(obj)
	{
		return obj instanceof NumberControl;
	}
};

let numbercontroltype = new NumberControlType("la", "NumberControl", "A LivingApps number field (type 'number')");


export class NumberControl extends PlaceholderControl
{
	[ul4.symbols.type]()
	{
		return numbercontroltype;
	}

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


class StringControlType extends PlaceholderControlType
{
	instancecheck(obj)
	{
		return obj instanceof StringControl;
	}
};

let stringcontroltype = new StringControlType("la", "StringControl", "A LivingApps number field (type 'string')");


export class StringControl extends PlaceholderControl
{
	[ul4.symbols.type]()
	{
		return stringcontroltype;
	}

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


class TextControlType extends StringControlType
{
	instancecheck(obj)
	{
		return obj instanceof TextControl;
	}
};

let textcontroltype = new TextControlType("la", "TextControl", "A LivingApps text field (type 'string/text')");


export class TextControl extends StringControl
{
	[ul4.symbols.type]()
	{
		return textcontroltype;
	}
};

TextControl.prototype.subtype = "text";
TextControl.prototype.fieldtype = StringField;


class PasswordControlType extends StringControlType
{
	instancecheck(obj)
	{
		return obj instanceof PasswordControl;
	}
};

let passwordcontroltype = new PasswordControlType("la", "PasswordControl", "A LivingApps password field (type 'string/password')");


export class PasswordControl extends StringControl
{
	[ul4.symbols.type]()
	{
		return passwordcontroltype;
	}
};

PasswordControl.prototype.subtype = "password";
PasswordControl.prototype.fieldtype = PasswordField;


class EmailControlType extends StringControlType
{
	instancecheck(obj)
	{
		return obj instanceof EmailControl;
	}
};

let emailcontroltype = new EmailControlType("la", "EmailControl", "A LivingApps email field (type 'string/email')");


export class EmailControl extends StringControl
{
	[ul4.symbols.type]()
	{
		return emailcontroltype;
	}
};

EmailControl.prototype.subtype = "email";
EmailControl.prototype.fieldtype = EmailField;


class URLControlType extends StringControlType
{
	instancecheck(obj)
	{
		return obj instanceof URLControl;
	}
};

let urlcontroltype = new URLControlType("la", "URLControl", "A LivingApps URL field (type 'string/url')");


export class URLControl extends StringControl
{
	[ul4.symbols.type]()
	{
		return urlcontroltype;
	}
};

URLControl.prototype.subtype = "url";
URLControl.prototype.fieldtype = URLField;


class TelControlType extends StringControlType
{
	instancecheck(obj)
	{
		return obj instanceof TelControl;
	}
};

let telcontroltype = new TelControlType("la", "TelControl", "A LivingApps phone number field (type 'string/tel')");


export class TelControl extends StringControl
{
	[ul4.symbols.type]()
	{
		return telcontroltype;
	}
};

TelControl.prototype.subtype = "tel";
TelControl.prototype.fieldtype = TelField;


class TextAreaControlType extends StringControlType
{
	instancecheck(obj)
	{
		return obj instanceof TextAreaControl;
	}
};

let textareacontroltype = new TextAreaControlType("la", "TextAreaControl", "A LivingApps textarea field (type 'string/textarea')");


export class TextAreaControl extends StringControl
{
	[ul4.symbols.type]()
	{
		return textareacontroltype;
	}

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


class HTMLControlType extends StringControlType
{
	instancecheck(obj)
	{
		return obj instanceof HTMLControl;
	}
};

let htmlcontroltype = new HTMLControlType("la", "HTMLControl", "A LivingApps HTML field (type 'string/html')");


export class HTMLControl extends StringControl
{
	[ul4.symbols.type]()
	{
		return htmlcontroltype;
	}
};

HTMLControl.prototype.subtype = "html";
HTMLControl.prototype.fieldtype = HTMLField;


class DateControlType extends PlaceholderControlType
{
	instancecheck(obj)
	{
		return obj instanceof DateControl;
	}
};

let datecontroltype = new DateControlType("la", "DateControl", "A LivingApps date field (type 'date/date')");


export class DateControl extends PlaceholderControl
{
	[ul4.symbols.type]()
	{
		return datecontroltype;
	}

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
			...this._formatstrings_parse[lang],
			...this._formatstrings_parse["intl"]
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
	"intl": "%Y-%m-%d"
};

let _suffixes = [
	"",
	" %H:%M",
	"T%H:%M",
	" %H:%M:%S",
	"T%H:%M:%S",
	" %H:%M:%S.%f",
	"T%H:%M:%S.%f",
	" %H:%M%z",
	"T%H:%M%z",
	" %H:%M:%S%z",
	"T%H:%M:%S%z",
	" %H:%M:%S.%f%z",
	"T%H:%M:%S.%f%z",
	" %H:%M %z",
	"T%H:%M %z",
	" %H:%M:%S %z",
	"T%H:%M:%S %z",
	" %H:%M:%S.%f %z",
	"T%H:%M:%S.%f %z"
]

DateControl.prototype._formatstrings_parse = {
	"en": _suffixes.map(s => "%m/%d/%Y" + s),
	"de": _suffixes.map(s => "%d.%m.%Y" + s),
	"fr": _suffixes.map(s => "%d.%m.%Y" + s),
	"it": _suffixes.map(s => "%d.%m.%Y" + s),
	"intl": _suffixes.map(s => "%Y-%m-%d" + s)
};


class DatetimeMinuteControlType extends DateControlType
{
	instancecheck(obj)
	{
		return obj instanceof DatetimeMinuteControl;
	}
};

let datetimeminutecontroltype = new DatetimeMinuteControlType("la", "DatetimeMinuteControl", "A LivingApps date field (type 'date/datetimeminute')");


export class DatetimeMinuteControl extends DateControl
{
	[ul4.symbols.type]()
	{
		return datetimeminutecontroltype;
	}

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
};

DatetimeMinuteControl.prototype.subtype = "datetimeminute";
DatetimeMinuteControl.prototype.fieldtype = DatetimeMinuteField;
DatetimeMinuteControl.prototype._formatstrings = {
	"de": "%d.%m.%Y %H:%M",
	"fr": "%d.%m.%Y %H:%M",
	"it": "%d.%m.%Y %H:%M",
	"en": "%m/%d/%Y %H:%M",
	"intl": "%Y-%m-%d %H:%M"
};


class DatetimeSecondControlType extends DateControlType
{
	instancecheck(obj)
	{
		return obj instanceof DatetimeSecondControl;
	}
};

let datetimesecondcontroltype = new DatetimeSecondControlType("la", "DatetimeSecondControl", "A LivingApps date field (type 'date/datetimesecond')");


export class DatetimeSecondControl extends DateControl
{
	[ul4.symbols.type]()
	{
		return datetimesecondcontroltype;
	}

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
};

DatetimeSecondControl.prototype.subtype = "datetimesecond";
DatetimeSecondControl.prototype.fieldtype = DatetimeSecondField;
DatetimeSecondControl.prototype._formatstrings = {
	"de": "%d.%m.%Y %H:%M:%S",
	"fr": "%d.%m.%Y %H:%M:%S",
	"it": "%d.%m.%Y %H:%M:%S",
	"en": "%m/%d/%Y %H:%M:%S",
	"intl": "%Y-%m-%d %H:%M:%S"
};


class LookupControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof LookupControl;
	}
};

let lookupcontroltype = new LookupControlType("la", "LookupControl", "A LivingApps date field (type 'lookup')");


export class LookupControl extends Control
{
	[ul4.symbols.type]()
	{
		return lookupcontroltype;
	}

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


class LookupSelectControlType extends LookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof LookupSelectControl;
	}
};

let lookupselectcontroltype = new LookupSelectControlType("la", "LookupSelectControl", "A LivingApps lookup field (type 'lookup/select')");


export class LookupSelectControl extends LookupControl
{
	[ul4.symbols.type]()
	{
		return lookupselectcontroltype;
	}
};

LookupSelectControl.prototype.subtype = "select";
LookupSelectControl.prototype.fieldtype = LookupSelectField;
LookupSelectControl.prototype._cssclass_control = "select";


class LookupRadioControlType extends LookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof LookupRadioControl;
	}
};

let lookupradiocontroltype = new LookupRadioControlType("la", "LookupRadioControl", "A LivingApps lookup field (type 'lookup/radio')");


export class LookupRadioControl extends LookupControl
{
	[ul4.symbols.type]()
	{
		return lookupradiocontroltype;
	}
};

LookupRadioControl.prototype.subtype = "radio";
LookupRadioControl.prototype.fieldtype = LookupRadioField;
LookupRadioControl.prototype._cssclass_root = "llft-element";


class LookupChoiceControlType extends LookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof LookupChoiceControl;
	}
};

let lookupchoicecontroltype = new LookupChoiceControlType("la", "LookupChoiceControl", "A LivingApps lookup field (type 'lookup/choice')");


export class LookupChoiceControl extends LookupControl
{
	[ul4.symbols.type]()
	{
		return lookupchoicecontroltype;
	}
};

LookupChoiceControl.prototype.subtype = "choice";
LookupChoiceControl.prototype.fieldtype = LookupChoiceField;


class AppLookupControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupControl;
	}
};

let applookupcontroltype = new AppLookupControlType("la", "AppLookupControl", "A LivingApps lookup field (type 'applookup')");


export class AppLookupControl extends Control
{
	[ul4.symbols.type]()
	{
		return applookupcontroltype;
	}

	get lookupdata()
	{
		if (this.lookup_app !== null && this.lookup_app.records !== null)
			return this.lookup_app.records;
		else
			return new Map();
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


class AppLookupSelectControlType extends AppLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupSelectControl;
	}
};

let applookupselectcontroltype = new AppLookupSelectControlType("la", "AppLookupSelectControl", "A LivingApps applookup field (type 'applookup/select')");


export class AppLookupSelectControl extends AppLookupControl
{
	[ul4.symbols.type]()
	{
		return applookupselectcontroltype;
	}
};

AppLookupSelectControl.prototype.subtype = "select";
AppLookupSelectControl.prototype.fieldtype = AppLookupSelectField;
AppLookupSelectControl.prototype._cssclass_control = "select";


class AppLookupRadioControlType extends AppLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupRadioControl;
	}
};

let applookupradiocontroltype = new AppLookupRadioControlType("la", "AppLookupRadioControl", "A LivingApps applookup field (type 'applookup/radio')");


export class AppLookupRadioControl extends AppLookupControl
{
	[ul4.symbols.type]()
	{
		return applookupradiocontroltype;
	}
};

AppLookupRadioControl.prototype.subtype = "radio";
AppLookupRadioControl.prototype.fieldtype = AppLookupRadioField;


class AppLookupChoiceControlType extends AppLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof AppLookupChoiceControl;
	}
};

let applookupchoicecontroltype = new AppLookupChoiceControlType("la", "AppLookupChoiceControl", "A LivingApps applookup field (type 'applookup/choice')");


export class AppLookupChoiceControl extends AppLookupControl
{
	[ul4.symbols.type]()
	{
		return applookupchoicecontroltype;
	}
};

AppLookupChoiceControl.prototype.subtype = "choice";
AppLookupChoiceControl.prototype.fieldtype = AppLookupChoiceField;


class MultipleLookupControlType extends LookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupControl;
	}
};

let multiplelookupcontroltype = new MultipleLookupControlType("la", "MultipleLookupControl", "A LivingApps multiple applookup field (type 'multipleapplookup')");


export class MultipleLookupControl extends LookupControl
{
	[ul4.symbols.type]()
	{
		return multiplelookupcontroltype;
	}

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


class MultipleLookupCheckboxControlType extends MultipleLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupCheckboxControl;
	}
};

let multiplelookupcheckboxcontroltype = new MultipleLookupCheckboxControlType("la", "MultipleLookupCheckboxControl", "A LivingApps multiplelookup field (type 'multiplelookup/checkbox')");


export class MultipleLookupCheckboxControl extends MultipleLookupControl
{
	[ul4.symbols.type]()
	{
		return multiplelookupcheckboxcontroltype;
	}

	get _sel_label()
	{
		return this._sel_root + " label:not([for]) > span";
	}
};

MultipleLookupCheckboxControl.prototype.subtype = "checkbox";
MultipleLookupCheckboxControl.prototype.fieldtype = MultipleLookupCheckboxField;
MultipleLookupCheckboxControl.prototype._cssclass_root = "llft-element";


class MultipleLookupSelectControlType extends MultipleLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupSelectControl;
	}
};

let multiplelookupselectcontroltype = new MultipleLookupSelectControlType("la", "MultipleLookupSelectControl", "A LivingApps multiplelookup field (type 'multiplelookup/select')");


export class MultipleLookupSelectControl extends MultipleLookupControl
{
	[ul4.symbols.type]()
	{
		return multiplelookupselectcontroltype;
	}
};

MultipleLookupSelectControl.prototype.subtype = "select";
MultipleLookupSelectControl.prototype.fieldtype = MultipleLookupSelectField;
MultipleLookupSelectControl.prototype._cssclass_control = "select";


class MultipleLookupChoiceControlType extends MultipleLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleLookupChoiceControl;
	}
};

let multiplelookupchoicecontroltype = new MultipleLookupChoiceControlType("la", "MultipleLookupChoiceControl", "A LivingApps multiplelookup field (type 'multiplelookup/choice')");


export class MultipleLookupChoiceControl extends MultipleLookupControl
{
	[ul4.symbols.type]()
	{
		return multiplelookupchoicecontroltype;
	}
};

MultipleLookupChoiceControl.prototype.subtype = "choice";
MultipleLookupChoiceControl.prototype.fieldtype = MultipleLookupChoiceField;


class MultipleAppLookupControlType extends AppLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupControl;
	}
};

let multipleapplookupcontroltype = new MultipleAppLookupControlType("la", "MultipleAppLookupControl", "A LivingApps multiple applookup field (type 'multipleapplookup')");


export class MultipleAppLookupControl extends AppLookupControl
{
	[ul4.symbols.type]()
	{
		return multipleapplookupcontroltype;
	}

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


class MultipleAppLookupSelectControlType extends MultipleAppLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupSelectControl;
	}
};

let multipleapplookupselectcontroltype = new MultipleAppLookupSelectControlType("la", "MultipleAppLookupSelectControl", "A LivingApps multiple applookup field (type 'multipleapplookup/select')");


export class MultipleAppLookupSelectControl extends MultipleAppLookupControl
{
	[ul4.symbols.type]()
	{
		return multipleapplookupselectcontroltype;
	}
};

MultipleAppLookupSelectControl.prototype.subtype = "select";
MultipleAppLookupSelectControl.prototype.fieldtype = MultipleAppLookupSelectField;
MultipleAppLookupSelectControl.prototype._cssclass_control = "select";


class MultipleAppLookupCheckboxControlType extends MultipleAppLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupCheckboxControl;
	}
};

let multipleapplookupcheckboxcontroltype = new MultipleAppLookupCheckboxControlType("la", "MultipleAppLookupCheckboxControl", "A LivingApps multiple applookup field (type 'multipleapplookup/checkbox')");


export class MultipleAppLookupCheckboxControl extends MultipleAppLookupControl
{
	[ul4.symbols.type]()
	{
		return multipleapplookupcheckboxcontroltype;
	}
};

MultipleAppLookupCheckboxControl.prototype.subtype = "checkbox";
MultipleAppLookupCheckboxControl.prototype.fieldtype = MultipleAppLookupCheckboxField;


class MultipleAppLookupChoiceControlType extends MultipleAppLookupControlType
{
	instancecheck(obj)
	{
		return obj instanceof MultipleAppLookupChoiceControl;
	}
};

let multipleapplookupchoicecontroltype = new MultipleAppLookupChoiceControlType("la", "MultipleAppLookupChoiceControl", "A LivingApps multiple applookup field (type 'multipleapplookup/choice')");


export class MultipleAppLookupChoiceControl extends MultipleAppLookupControl
{
	[ul4.symbols.type]()
	{
		return multipleapplookupchoicecontroltype;
	}
};

MultipleAppLookupChoiceControl.prototype.subtype = "choice";
MultipleAppLookupChoiceControl.prototype.fieldtype = MultipleAppLookupChoiceField;


class GeoControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof GeoControl;
	}
};

let geocontroltype = new GeoControlType("la", "GeoControl", "A LivingApps geo field (type 'geo')");


export class GeoControl extends Control
{
	[ul4.symbols.type]()
	{
		return geocontroltype;
	}
};

GeoControl.prototype.type = "geo";
GeoControl.prototype.fieldtype = GeoField;
GeoControl.prototype._cssclass_root = "llft-element";


class FileControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof FileControl;
	}
};

let filecontroltype = new FileControlType("la", "FileControl", "A LivingApps upload field (type 'file')");


export class FileControl extends Control
{
	[ul4.symbols.type]()
	{
		return filecontroltype;
	}
};

FileControl.prototype.type = "file";
FileControl.prototype.fieldtype = FileField;
FileControl.prototype._cssclass_root = "llft-element";


class FileSignatureControlType extends FileControlType
{
	instancecheck(obj)
	{
		return obj instanceof FileSignatureControl;
	}
};

let filesignaturecontroltype = new FileSignatureControlType("la", "FileSignatureControl", "A LivingApps signature image field (type 'file/signature')");


export class FileSignatureControl extends FileControl
{
	[ul4.symbols.type]()
	{
		return filesignaturecontroltype;
	}
};

FileSignatureControl.prototype.subtype = "signature";
FileSignatureControl.prototype.fieldtype = FileSignatureField;


class ButtonControlType extends ControlType
{
	instancecheck(obj)
	{
		return obj instanceof ButtonControl;
	}
};

let buttoncontroltype = new ButtonControlType("la", "ButtonControl", "A submit button");


export class ButtonControl extends Control
{
	[ul4.symbols.type]()
	{
		return buttoncontroltype;
	}
};

ButtonControl.prototype.type = "button";


class LookupItemType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof LookupItem;
	}
};

let lookupitemtype = new LookupItemType("la", "LookupItem", "An option in a lookup control/field");


export class LookupItem extends Base
{
	[ul4.symbols.type]()
	{
		return lookupitemtype;
	}

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


class ViewLookupItemType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof ViewLookupItem;
	}
};

let viewlookupitemtype = new ViewLookupItemType("la", "ViewLookupItem", "View specific information about a lookup item");


export class ViewLookupItem extends Base
{
	[ul4.symbols.type]()
	{
		return viewlookupitemtype;
	}

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


class LayoutControlType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof LayoutControl;
	}
};

let layoutcontroltype = new LayoutControlType("la", "LayoutControl", "A decoration in an input form");


export class LayoutControl extends Base
{
	[ul4.symbols.type]()
	{
		return layoutcontroltype;
	}

	[ul4.symbols.repr]()
	{
		return "<" + this.constructor.name + " id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}

	get globals()
	{
		return this.view.app.globals;
	}

	get _sel_root()
	{
		return "#livingapps-form .llft-element.llft-id-" + this.identifier;
	}

	get _dom_root()
	{
		return document.querySelector(this._sel_root);
	}
};

LayoutControl.prototype._ul4onattrs = ["label", "identifier", "view", "top", "left", "width", "height"];
LayoutControl.prototype._ul4attrs = new Set(["id", "label", "identifier", "view", "top", "left", "width", "height"]);


class HTMLLayoutControlType extends LayoutControlType
{
	instancecheck(obj)
	{
		return obj instanceof HTMLLayoutControl;
	}
};

let htmllayoutcontroltype = new HTMLLayoutControlType("la", "HTMLLayoutControl", "HTML decoration in an input form");


export class HTMLLayoutControl extends LayoutControl
{
	[ul4.symbols.type]()
	{
		return htmllayoutcontroltype;
	}

	get value()
	{
		return this._value;
	}

	set value(value)
	{
		this._value = value;
		if (this.globals._in_form())
			this._set_dom_value(this._value);
	}

	_set_dom_value(value)
	{
		this._dom_root.innerHTML = value;
	}

	[ul4.symbols.setattr](name, value)
	{
		if (name === "value")
			this.value = value;
		else
			return super[ul4.symbols.getattr](name);
	}
};

HTMLLayoutControl.prototype._ul4onattrs = [...LayoutControl.prototype._ul4onattrs, "_value"];
HTMLLayoutControl.prototype._ul4attrs = new Set([...LayoutControl.prototype._ul4attrs, "value"]);


class ImageLayoutControlType extends LayoutControlType
{
	instancecheck(obj)
	{
		return obj instanceof ImageLayoutControl;
	}
};

let imagelayoutcontroltype = new ImageLayoutControlType("la", "ImageLayoutControl", "An image decoration in an input form");


export class ImageLayoutControl extends LayoutControl
{
	[ul4.symbols.type]()
	{
		return imagelayoutcontroltype;
	}
};

ImageLayoutControl.prototype._ul4onattrs = [...LayoutControl.prototype._ul4onattrs, "original", "scaled"];
ImageLayoutControl.prototype._ul4attrs = new Set([...LayoutControl.prototype._ul4attrs, "original", "scaled"]);


class ButtonLayoutControlType extends LayoutControlType
{
	instancecheck(obj)
	{
		return obj instanceof ButtonLayoutControl;
	}
};

let buttonlayoutcontroltype = new ButtonLayoutControlType("la", "ButtonLayoutControl", "A submit button in an input form");


export class ButtonLayoutControl extends LayoutControl
{
	[ul4.symbols.type]()
	{
		return buttonlayoutcontroltype;
	}
};


class ViewControlType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof ViewControl;
	}
};

let viewcontroltype = new ViewControlType("la", "ViewControl", "Contains view specific information about a control");


export class ViewControl extends Base
{
	[ul4.symbols.type]()
	{
		return viewcontroltype;
	}

	get mode()
	{
		return this._mode ? "display" : "edit";
	}
};

ViewControl.prototype._ul4onattrs = ["view", "control", "top", "left", "width", "height", "liveupdate", "default", "tabindex", "minlength", "maxlength", "required", "placeholder", "_mode", "labelpos", "lookupnonekey", "lookupnonelabel", "label", "autoalign", "labelwidth", "lookupdata", "autoexpandable"];
ViewControl.prototype._ul4attrs = new Set(["id", "view", "control", "top", "left", "width", "height", "liveupdate", "default", "tabindex", "minlength", "maxlength", "required", "placeholder", "mode", "labelpos", "lookupnonekey", "lookupnonelabel", "label", "autoalign", "labelwidth", "lookupdata", "autoexpandable"]);


class UserType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof User;
	}
};

let usertype = new UserType("la", "User", "A LivingApps user/account");


export class User extends Base
{
	[ul4.symbols.type]()
	{
		return usertype;
	}

	[ul4.symbols.repr]()
	{
		return "<User id=" + ul4._repr(this.id) + " firstname=" + ul4._repr(this.firstname) + " surname=" + ul4._repr(this.surname) + " email=" + ul4._repr(this.email) + ">";
	}
};

User.prototype._ul4onattrs = ["_id", "gender", "title", "firstname", "surname", "initials", "email", "streetname", "streetnumber", "zip", "city", "phone", "fax", "lang", "avatarsmall", "avatarlarge", "summary", "interests", "personalwebsite", "companywebsite", "company", "position", "department", "keyviews"];
User.prototype._ul4attrs = new Set(["id", "_id", "gender", "title", "firstname", "surname", "initials", "email", "streetname", "streetnumber", "zip", "city", "phone", "fax", "lang", "avatarsmall", "avatarlarge", "summary", "interests", "personalwebsite", "companywebsite", "company", "position", "department", "keyviews"]);


class FileType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof File;
	}
};

let filetype = new FileType("la", "File", "An uploaded file");


export class File extends Base
{
	[ul4.symbols.type]()
	{
		return filetype;
	}

	[ul4.symbols.repr]()
	{
		return "<File id=" + ul4._repr(this.id) + " url=" + ul4._repr(this.url) + " filename=" + ul4._repr(this.filename) + ">";
	}

	get url()
	{
		return "/gateway/files/" + this.id;
	}

	get archive_url()
	{
		if (this.archive === null)
			return this.url;
		return this.archive.url + "/" + this.filename;
	}
};

File.prototype._ul4onattrs = ["filename", "mimetype", "width", "height", "internalid", "createdat", "size", "duration", "geo", "storagefilename", "archive"];
File.prototype._ul4attrs = new Set(["id", "url", "archive_url", "filename", "mimetype", "width", "height", "size", "duration", "geo", "archive", "createdat"]);


class GeoType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Geo;
	}
};

let geotype = new GeoType("la", "Geo", "Geographical coordinates and location information");


export class Geo extends Base
{
	constructor(lat, long, info=null)
	{
		super(null);
		this.lat = lat;
		this.long = long;
		this.info = info;
	}

	[ul4.symbols.type]()
	{
		return geotype;
	}

	[ul4.symbols.repr]()
	{
		return "<Geo lat=" + ul4._repr(this.lat) + " long=" + ul4._repr(this.long) + " info=" + ul4._repr(this.info) + ">";
	}
};

Geo.prototype._ul4onattrs = ["lat", "long", "info"];
Geo.prototype._ul4attrs = new Set(["lat", "long", "info"]);


class AttachmentType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Attachment;
	}
};

let attachmenttype = new AttachmentType("la", "Attachment", "An attachment of a record");


export class Attachment extends Base
{
	[ul4.symbols.type]()
	{
		return attachmenttype;
	}

	[ul4.symbols.repr]()
	{
		return "<" + this.constructor.name + " id=" + ul4._repr(this.id) + " label=" + ul4._repr(this.label) + ">";
	}
};

Attachment.prototype._ul4onattrs = ["record", "label", "active"];
Attachment.prototype._ul4attrs = new Set(["id", "record", "label", "active"]);


class NoteAttachmentType extends AttachmentType
{
	instancecheck(obj)
	{
		return obj instanceof NoteAttachment;
	}
};

let noteattachmenttype = new NoteAttachmentType("la", "NoteAttachment", "A note attachment of a record");


export class NoteAttachment extends Attachment
{
	[ul4.symbols.type]()
	{
		return noteattachmenttype;
	}
};

NoteAttachment.prototype.type = "noteattachment";
NoteAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "value"];
NoteAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);


class URLAttachmentType extends AttachmentType
{
	instancecheck(obj)
	{
		return obj instanceof URLAttachment;
	}
};

let urlattachmenttype = new URLAttachmentType("la", "URLAttachment", "A URL attachment of a record");


export class URLAttachment extends Attachment
{
	[ul4.symbols.type]()
	{
		return urlattachmenttype;
	}
};

URLAttachment.prototype.type = "urlattachment";
URLAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "value"];
URLAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);


class FileAttachmentType extends AttachmentType
{
	instancecheck(obj)
	{
		return obj instanceof FileAttachment;
	}
};

let fileattachmenttype = new FileAttachmentType("la", "FileAttachment", "A file attachment of a record");


export class FileAttachment extends Attachment
{
	[ul4.symbols.type]()
	{
		return fileattachmenttype;
	}
};

FileAttachment.prototype.type = "fileattachment";
FileAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "value"];
FileAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);


class ImageAttachmentType extends AttachmentType
{
	instancecheck(obj)
	{
		return obj instanceof ImageAttachment;
	}
};

let imageattachmenttype = new ImageAttachmentType("la", "ImageAttachment", "An image attachment of a record");


export class ImageAttachment extends Attachment
{
	[ul4.symbols.type]()
	{
		return imageattachmenttype;
	}
};

ImageAttachment.prototype.type = "imageattachment";
ImageAttachment.prototype._ul4onattrs = [...Attachment.prototype._ul4onattrs, "original", "thumb", "small", "medium","large"];
ImageAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "original", "thumb", "small", "medium", "large"]);


class JSONAttachmentType extends AttachmentType
{
	instancecheck(obj)
	{
		return obj instanceof JSONAttachment;
	}
};

let jsonattachmenttype = new JSONAttachmentType("la", "JSONAttachment", "A JSON attachment of a record");


export class JSONAttachment extends Attachment
{
	[ul4.symbols.type]()
	{
		return jsonattachmenttype;
	}

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


class InstallationType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Installation;
	}
};

let installationtype = new InstallationType("la", "Installation", "The installation that created an app");


export class Installation extends Base
{
	[ul4.symbols.type]()
	{
		return installationtype;
	}

	[ul4.symbols.repr]()
	{
		return "<Installation id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

Installation.prototype._ul4onattrs = ["name"];
Installation.prototype._ul4attrs = new Set(["id", "name"]);


class CategoryType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Category;
	}
};

let categorytype = new CategoryType("la", "Category", "A navigation category");


export class Category extends Base
{
	[ul4.symbols.type]()
	{
		return categorytype;
	}

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


class KeyViewType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof KeyView;
	}
};

let keyviewtype = new KeyViewType("la", "KeyView", "Object granting access to a view template");


export class KeyView extends Base
{
	[ul4.symbols.type]()
	{
		return keyviewtype;
	}

	[ul4.symbols.repr]()
	{
		return "<KeyView id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

KeyView.prototype._ul4onattrs = ["identifier", "name", "key", "user"];
KeyView.prototype._ul4attrs = new Set(["id", "identifier", "name", "key", "user"]);


class AppParameterType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof AppParameter;
	}
};

let appparametertype = new AppParameterType("la", "AppParameter", "A parameter of a LivingApps application");


export class AppParameter extends Base
{
	[ul4.symbols.type]()
	{
		return appparametertype;
	}

	[ul4.symbols.repr]()
	{
		return "<AppParameter id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}

	get app()
	{
		if (this.owner instanceof App)
			return this.owner;
		return null;
	}
};

AppParameter.prototype._ul4onattrs = ["owner", "parent", "type", "order", "identifier", "description", "value", "createdat", "createdby", "updatedat", "updatedby"];
AppParameter.prototype._ul4attrs = new Set(["id", "owner", "parent", "app", "type", "order", "identifier", "description", "value", "createdat", "createdby", "updatedat", "updatedby"]);


class FormType extends ul4.Type
{
	instancecheck(obj)
	{
		return obj instanceof Form;
	}
};

let formtype = new FormType("la", "Form", "The input form.");

export class Form extends ul4.Proto
{
	constructor(globals, template)
	{
		super();
		this.globals = globals;
		this.template = template;
		this._geo_wired = false;

		for (let field of globals.record.fields.values())
			this.wire_field(field);
		this.render_template(null);
	}

	[ul4.symbols.type]()
	{
		return formtype;
	}

	get _dom_button()
	{
		return document.querySelector(this._sel_form + " " + this._sel_button);
	}

	get enabled()
	{
		return !this._dom_button.disabled;
	}

	set enabled(value)
	{
		this._dom_button.disabled = !value;
	}

	[ul4.symbols.getattr](key)
	{
		if (key === "enabled")
			return this.enabled;
		else
			throw new ul4.AttributeError(this, key);
	}

	[ul4.symbols.setattr](key, value)
	{
		if (key === "enabled")
			this.enabled = ul4._bool(value);
		else
			throw new ul4.AttributeError(this, key);
	}

	[ul4.symbols.repr]()
	{
		return "<" + this.constructor.name + " enabled=" + ul4._repr(this.enabled) + ">";
	}

	toString()
	{
		return this[ul4.symbols.repr]();
	}

	render_template(identifier)
	{
		let vars = {
			"record": this.globals.record,
			"app": this.globals.app,
			"fields": this.globals.record.fields,
			"identifier": identifier
		};

		let globalVars = {
			"globals": this.globals,
			"form": this,
			"la": module
		};

		let msg = "LivingApps update template: ";
		if (identifier === null)
			msg += "Initialization";
		else
			msg += "Value change in " + ul4._repr(identifier);

		this.globals.group_logging(msg, () => {
			try
			{
				this.template.renders(vars, globalVars);
			}
			catch (exc)
			{
				if (console && console.error)
				{
					this.globals._start_log_message();
					if (console.group)
						console.group("UL4 stacktrace");
					ul4.report_exc(exc);
					if (console.groupEnd)
						console.groupEnd();

					if (console.groupCollapsed)
						console.groupCollapsed("Javascript stacktrace");
					console.error(exc);
					if (console.groupEnd)
						console.groupEnd();
				}
			}
		});
	}

	wire_geo()
	{
		if (this._geo_wired)
			return;

		if (this.globals.app.active_view !== null && navigator.geolocation)
		{
			let use_geo = this.globals.app.active_view.use_geo;
			if (use_geo === "once" || use_geo === "watch")
			{
				navigator.geolocation.getCurrentPosition((position) => {
					this.globals.mode = this.globals.mode.substring(0, this.globals.mode.lastIndexOf("/") + 1) + "geo";
					this.globals.set_current_geo(position);
					this.render_template(null);
				});
			}

			if (use_geo === "watch")
			{
				navigator.geolocation.watchPosition((position) => {
					this.globals.mode = this.globals.mode.substring(0, this.globals.mode.lastIndexOf("/") + 1) + "geo";
					this.globals.set_current_geo(position);
					this.render_template(null);
				});
			}
		}
		this._geo_wired = true;
	}

	wire_field(field)
	{
		for (let dom_node of field._dom_controls)
		{
			dom_node.addEventListener(field._inputevent, (event) => {
				this.wire_geo();
				this.globals.mode = this.globals.mode.substring(0, this.globals.mode.lastIndexOf("/") + 1) + "input";
				this.render_template(field.control.identifier);
			});
		}
	}
};

Form.prototype._ul4attrs = new Set(["enabled"]);
Form.prototype._sel_form = "#livingapps-form form";
Form.prototype._sel_button = "[type=submit]";


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

export const module = new ul4.Module(
	"la",
	"LivingAPI types",
	{
		FlashMessage: FlashMessage,
		File: File,
		Geo: Geo,
		User: User,
		KeyView: KeyView,
		Globals: Globals,
		App: App,
		TextControl: TextControl,
		URLControl: URLControl,
		EmailControl: EmailControl,
		PasswordControl: PasswordControl,
		TelControl: TelControl,
		TextAreaControl: TextAreaControl,
		HTMLControl: HTMLControl,
		IntControl: IntControl,
		NumberControl: NumberControl,
		DateControl: DateControl,
		DatetimeMinuteControl: DatetimeMinuteControl,
		DatetimeSecondControl: DatetimeSecondControl,
		BoolControl: BoolControl,
		LookupSelectControl: LookupSelectControl,
		LookupRadioControl: LookupRadioControl,
		LookupChoiceControl: LookupChoiceControl,
		AppLookupSelectControl: AppLookupSelectControl,
		AppLookupRadioControl: AppLookupRadioControl,
		AppLookupChoiceControl: AppLookupChoiceControl,
		MultipleLookupSelectControl: MultipleLookupSelectControl,
		MultipleLookupCheckboxControl: MultipleLookupCheckboxControl,
		MultipleLookupChoiceControl: MultipleLookupChoiceControl,
		MultipleAppLookupSelectControl: MultipleAppLookupSelectControl,
		MultipleAppLookupCheckboxControl: MultipleAppLookupCheckboxControl,
		MultipleAppLookupChoiceControl: MultipleAppLookupChoiceControl,
		FileControl: FileControl,
		FileSignatureControl: FileSignatureControl,
		GeoControl: GeoControl,
		ViewControl: ViewControl,
		Record: Record,
		ImageAttachment: ImageAttachment,
		FileAttachment: FileAttachment,
		URLAttachment: URLAttachment,
		NoteAttachment: NoteAttachment,
		JSONAttachment: JSONAttachment,
		Installation: Installation,
		HTMLLayoutControl: HTMLLayoutControl,
		ImageLayoutControl: ImageLayoutControl,
		ButtonLayoutControl: ButtonLayoutControl,
		View: View,
		DataSource: DataSource,
		LookupItem: LookupItem,
		ViewLookupItem: ViewLookupItem,
		Category: Category,
		AppParameter: AppParameter,
	}
);
