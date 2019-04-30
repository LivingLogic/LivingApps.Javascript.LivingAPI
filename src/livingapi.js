;(function(){
let root = this, la = {}, ul4;

let isamd = typeof(define) === "function" && define.amd;
let iscommon = typeof(module) === "object" && module.exports;

if (isamd)
{
	// AMD
	define([], function()
	{
		return la;
	});
}
else if (iscommon)
{
	// COMMONJS
	ul4 = require('./ul4.js');
	module.exports.la = la;
}
else
{
	// DEFAULT
	ul4 = root.ul4;
	root.la = la;
}

la.Base = class Base extends ul4.Proto
{
	constructor()
	{
		super();
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

	__getattr__(name)
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

	__repr__()
	{
		return "<la." + this.constructor.name + ">";
	}
};

la.Handler = class Handler
{
	save(record)
	{
	}

	delete(record)
	{
	}
};

la.Globals = class Globals extends la.Base
{
	constructor()
	{
		super();
		this.version = null;
		this.platform = null;
		this.user = null;
		this.maxdbactions = null;
		this.maxtemplateruntime = null;
		this.flashmessages = null;
		this.handler = new la.Handler();
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

	__repr__()
	{
		return "<la.Globals version=" + ul4._repr(this.version) + ">";
	}
};

la.Globals.prototype._ul4onattrs = ["version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages"];
la.Globals.prototype._ul4attrs = ul4._makeset("version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages");

la.FlashMessage = class FlashMessage extends la.Base
{
	__repr__()
	{
		return "<la.FlashMessage type=" + ul4._repr(this.type) + " title=" + ul4._repr(this.title) + ">";
	}
};

la.FlashMessage.prototype._ul4onattrs = ["timestamp", "type", "title", "message"];
la.FlashMessage.prototype._ul4attrs = ul4._makeset("timestamp", "type", "title", "message");

la.App = class App extends la.Base
{
	__repr__()
	{
		return "<la.App id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}

	insert(values={})
	{
		let record = this.__call__(values);
		this.globals.handler.save(this);
		return record;
	}

	__call__(values={})
	{
		let record = new la.Record(this);
		if (ul4._ismap(values))
		{
			for (let [key, value] of values.entries())
			{
				if (!record.fields.has(key))
					throw new ul4.ArgumentError("update() get an unexpected keyword argument " + ul4._repr(key));
				record.fields.get(key).value = value;
			}
		}
		else if (ul4._isobject(values))
		{
			for (let key in values)
			{
				if (!record.fields.has(key))
					throw new ul4.ArgumentError("update() get an unexpected keyword argument " + ul4._repr(key));
				record.fields.get(key).value = values[key];
			}
		}
		else
			throw new ul4.TypeError("values must be an object or a Map");
		return record;
	}

	__getattr__(name)
	{
		if (name.startsWith("c_"))
		{
			if (!this.controls.has(name.substr(2)))
				throw new ul4.AttributeError(this, name);
			return this.controls.get(name.substr(2));
		}
		else
			return super.__getattr__(name);
	}
};

la.App.prototype._ul4onattrs = ["id", "globals", "name", "description", "language", "startlink", "iconlarge", "iconsmall", "createdby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "basetable", "primarykey", "insertprocedure", "updateprocedure", "deleteprocedure", "templates", "createdat", "updatedat", "updatedby"];
la.App.prototype._ul4attrs = ul4._makeset("id", "globals", "name", "description", "language", "startlink", "iconlarge", "iconsmall", "createdat", "createdby", "updatedat", "updatedby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "insert");
ul4.expose(la.App.prototype.__call__, ["**values"], {"needsobject": true});
ul4.expose(la.App.prototype.insert, ["**values"], {"needsobject": true});

la.View = class View extends la.Base
{
	__repr__()
	{
		return "<la.View id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

la.View.prototype._ul4onattrs = ["id", "name", "app", "order", "width", "height", "start", "end"];
la.View.prototype._ul4attrs = ul4._makeset("id", "name", "app", "order", "width", "height", "start", "end");

la.DataSource = class DataSource extends la.Base
{
	__repr__()
	{
		return "<la.DataSource id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

la.DataSource.prototype._ul4onattrs = ["id", "identifier", "app", "apps"];
la.DataSource.prototype._ul4attrs = ul4._makeset("id", "identifier", "app", "apps");

la.Record = class Record extends la.Base
{
	constructor(app)
	{
		super();
		this.id = null;
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
		this._is_deleted = false;
	}

	__repr__()
	{
		let v = ["<la.Record id=", ul4._repr(this.id)];
		for (let field of this.fields.values())
		{
			if (field.control.priority)
			{
				v.push(" v_");
				v.push(field.control.identifier);
				v.push("=");
				v.push(ul4._repr(field.value)); // FIXME: This might lead to infinite recursions
			}
		}
		v.push(">")
		return v.join("");
	}

	get values()
	{
		if (this._values === null)
		{
			this._values = ul4._havemap ? new Map() : {};
			for (let [identifier, control] of this.app.controls.entries())
			{
				let fieldvalue = this._sparsevalues.get(identifier);
				if (typeof(fieldvalue) === "undefined")
					fieldvalue = null;
				this._values.set(identifier, fieldvalue);
			}
		}
		return this._values;
	}

	get fields()
	{
		if (this._fields === null)
		{
			this._fields = ul4._havemap ? new Map() : {};
			for (let [identifier, value] of this.values.entries())
			{
				let field = new la.Field(this.app.controls.get(identifier), this, value);
				this._fields.set(identifier, field);
			}
		}
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
		return this.app.globals.handler.delete(this);
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
				if (!record.fields.has(key))
					throw new ul4.ArgumentError("update() get an unexpected keyword argument " + ul4._repr(key));
				fields.get(key).value = value;
			}
		}
		else if (ul4._isobject(values))
		{
			for (let key in values)
			{
				if (!record.fields.has(key))
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

	__getattr__(name)
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

	__setattr__(name, value)
	{
		if (name.startsWith("c_"))
			this.children[name.substr(2)] = value;
		else if (name.startsWith("v_"))
			this.fields.get(name.substr(2)).value = value;
		else
			throw new ul4.AttributeError(this, name);
	}
};

la.Record.prototype._ul4onattrs = ["id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children"];
la.Record.prototype._ul4attrs = ul4._makeset("id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children");
ul4.expose(la.Record.prototype.is_dirty, []);
ul4.expose(la.Record.prototype.has_errors, []);
ul4.expose(la.Record.prototype.delete, []);
ul4.expose(la.Record.prototype.save, []);
ul4.expose(la.Record.prototype.update, ["**values"], {"needsobject": true});

la.Control = class Control extends la.Base
{
	__repr__()
	{
		return "<la." + this.__type__ + " id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
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

la.Control.prototype.type = null;
la.Control.prototype.subtype = null;
la.Control.prototype._ul4onattrs = ["id", "identifier", "field", "app", "label", "priority", "order", "default", "ininsertprocedure", "inupdateprocedure"];
la.Control.prototype._ul4attrs = ul4._makeset("id", "identifier", "field", "app", "label", "priority", "order", "default", "ininsertprocedure", "inupdateprocedure");

la.BoolControl = class BoolControl extends la.Control
{
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

la.BoolControl.prototype.type = "bool";

la.IntControl = class IntControl extends la.Control
{
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

la.IntControl.prototype.type = "int";

la.NumberControl = class NumberControl extends la.Control
{
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

la.NumberControl.prototype.type = "number";

la.StringControl = class StringControl extends la.Control
{
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

la.StringControl.prototype.type = "string";

la.TextControl = class TextControl extends la.StringControl
{
};

la.TextControl.prototype.subtype = "text";

la.EmailControl = class EmailControl extends la.StringControl
{
};

la.EmailControl.prototype.subtype = "email";

la.URLControl = class URLControl extends la.StringControl
{
};

la.URLControl.prototype.subtype = "url";

la.TelControl = class TelControl extends la.StringControl
{
};

la.TelControl.prototype.subtype = "tel";

la.PasswordControl = class PasswordControl extends la.StringControl
{
};

la.PasswordControl.prototype.subtype = "password";

la.TextAreaControl = class TextAreaControl extends la.StringControl
{
};

la.TextAreaControl.prototype.subtype = "textarea";
la.TextAreaControl.prototype._ul4onattrs = la.StringControl.prototype._ul4onattrs.concat(["encrypted"]);
la.TextAreaControl.prototype._ul4attrs = ul4._makeset(...la.StringControl.prototype._ul4attrs, "encrypted");

la.DateControl = class DateControl extends la.Control
{
	formatstring(language)
	{
		language = language || this.app.language;

		if (language === "de")
			return "%d.%m.%Y";
		else
			return "%m/%d/%Y";
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

la.DateControl.prototype.type = "date";
la.DateControl.prototype.subtype = "date";

la.DatetimeMinuteControl = class DatetimeMinuteControl extends la.DateControl
{
	formatstring(language)
	{
		language = language || this.app.language;

		if (language === "de")
			return "%d.%m.%Y %H:%M";
		else
			return "%m/%d/%Y %H:%M";
	}
};

la.DatetimeMinuteControl.prototype.subtype = "datetimeminute";

la.DatetimeSecondControl = class DatetimeSecondControl extends la.DateControl
{
	formatstring(language)
	{
		language = language || this.app.language;

		if (language === "de")
			return "%d.%m.%Y %H:%M:%S";
		else
			return "%m/%d/%Y %H:%M:%S";
	}
};

la.DatetimeSecondControl.prototype.subtype = "datetimesecond";

la.LookupControl = class LookupControl extends la.Control
{
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

la.LookupControl.prototype.type = "lookup";
la.LookupControl.prototype._ul4onattrs = la.Control.prototype._ul4onattrs.concat(["lookupdata"]);
la.LookupControl.prototype._ul4attrs = ul4._makeset(...la.Control.prototype._ul4attrs, "lookupdata");

la.LookupSelectControl = class LookupSelectControl extends la.LookupControl
{
};

la.LookupSelectControl.prototype.subtype = "select";

la.LookupRadioControl = class LookupRadioControl extends la.LookupControl
{
};

la.LookupRadioControl.prototype.subtype = "radio";

la.LookupChoiceControl = class LookupChoiceControl extends la.LookupControl
{
};

la.LookupChoiceControl.prototype.subtype = "choice";

la.AppLookupControl = class AppLookupControl extends la.Control
{
	// ``search.value`` must be an object containing the search criteria for the referenced record
	search(value, search)
	{
		if (value === null || search.value === null)
			return value === search.value;
		else
			return value.search(search);
	}
};

la.AppLookupControl.prototype.type = "applookup";
la.AppLookupControl.prototype._ul4onattrs = la.Control.prototype._ul4onattrs.concat(["lookupapp", "lookupcontrols"]);
la.AppLookupControl.prototype._ul4attrs = ul4._makeset(...la.Control.prototype._ul4attrs, "lookupapp", "lookupcontrols");

la.AppLookupSelectControl = class AppLookupSelectControl extends la.AppLookupControl
{
};

la.AppLookupSelectControl.prototype.subtype = "select";

la.AppLookupRadioControl = class AppLookupRadioControl extends la.AppLookupControl
{
};

la.AppLookupRadioControl.prototype.subtype = "radio";

la.AppLookupChoiceControl = class AppLookupChoiceControl extends la.AppLookupControl
{
};

la.AppLookupChoiceControl.prototype.subtype = "choice";

la.MultipleLookupControl = class MultipleLookupControl extends la.LookupControl
{
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

la.MultipleLookupControl.prototype.subtype = "multiplelookup";

la.MultipleLookupSelectControl = class MultipleLookupSelectControl extends la.MultipleLookupControl
{
};

la.MultipleLookupSelectControl.prototype.subtype = "select";

la.MultipleLookupCheckboxControl = class MultipleLookupCheckboxControl extends la.MultipleLookupControl
{
};

la.MultipleLookupCheckboxControl.prototype.subtype = "checkbox";

la.MultipleLookupChoiceControl = class MultipleLookupChoiceControl extends la.MultipleLookupControl
{
};

la.MultipleLookupChoiceControl.prototype.subtype = "choice";

la.MultipleAppLookupControl = class MultipleAppLookupControl extends la.AppLookupControl
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

la.MultipleAppLookupControl.prototype.type = "multipleapplookup";

la.MultipleAppLookupSelectControl = class MultipleAppLookupSelectControl extends la.MultipleAppLookupControl
{
};

la.MultipleAppLookupSelectControl.prototype.subtype = "select";

la.MultipleAppLookupCheckboxControl = class MultipleAppLookupCheckboxControl extends la.MultipleAppLookupControl
{
};

la.MultipleAppLookupCheckboxControl.prototype.subtype = "checkbox";

la.MultipleAppLookupChoiceControl = class MultipleAppLookupChoiceControl extends la.MultipleAppLookupControl
{
};

la.MultipleAppLookupChoiceControl.prototype.subtype = "choice";

la.GeoControl = class GeoControl extends la.Control
{
};

la.GeoControl.prototype.type = "geo";

la.FileControl = class FileControl extends la.Control
{
};

la.FileControl.prototype.type = "file";

la.ButtonControl = class ButtonControl extends la.Control
{
};

la.ButtonControl.prototype.type = "button";

la.Field = class Field extends la.Base
{
	constructor(control, record, value)
	{
		super();
		this.control = control;
		this.record = record;
		this._value = value;
		this._dirty = false;
		this.errors = [];
	}

	get value()
	{
		return this._value;
	}

	set value(value)
	{
		let oldvalue = this._value;

		if (ul4._ne(oldvalue, value))
		{
			this.record.values.set(this.control.identifier, value);
			this._value = value;
			this._dirty = true;
		}
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

	__repr__()
	{
		let s = "<la.Field identifier=";
		s += ul4._repr(this.control.identifier)
		if (this._dirty)
			s += " is_dirty()=True";
		if (this.errors.length !== 0)
			s += " has_errors()=True";
		s += ">"
		return s;
	}
};

la.LookupItem = class LookupItem extends la.Base
{
	__repr__()
	{
		return "<la.LookupItem key=" + ul4._repr(this.key) + " label=" + ul4._repr(this.label) + ">";
	}
};

la.LookupItem.prototype._ul4onattrs = ["key", "label"];
la.LookupItem.prototype._ul4attrs = ul4._makeset("key", "label");

la.User = class User extends la.Base
{
	__repr__()
	{
		return "<la.User id=" + ul4._repr(this.id) + " firstname=" + ul4._repr(this.firstname) + " surname=" + ul4._repr(this.surname) + " email=" + ul4._repr(this.email) + ">";
	}
};

la.User.prototype._ul4onattrs = ["_id", "id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews"];
la.User.prototype._ul4attrs = ul4._makeset("_id", "id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews");

la.File = class File extends la.Base
{
	__repr__()
	{
		return "<la.File id=" + ul4._repr(this.id) + " url=" + ul4._repr(this.url) + " filename=" + ul4._repr(this.filename) + ">";
	}
};

la.File.prototype._ul4onattrs = ["id", "url", "filename", "mimetype", "width", "height", "internalid", "createdat", "size"];
la.File.prototype._ul4attrs = ul4._makeset("id", "url", "filename", "mimetype", "width", "height", "size", "createdat");

la.Geo = class Geo extends la.Base
{
	constructor(lat, long, info)
	{
		super();
		this.lat = lat;
		this.long = long;
		this.info = info;
	}

	__repr__()
	{
		return "<la.Geo lat=" + ul4._repr(this.lat) + " long=" + ul4._repr(this.long) + " info=" + ul4._repr(this.info) + ">";
	}
};

la.Geo.prototype._ul4onattrs = ["lat", "long", "info"];
la.Geo.prototype._ul4attrs = ul4._makeset("lat", "long", "info");

la.Attachment = class Attachment extends la.Base
{
	__repr__()
	{
		return "<la." + this.__type__ + " id=" + ul4._repr(this.id) + " label=" + ul4._repr(this.label) + ">";
	}
};

la.Attachment.prototype._ul4onattrs = ["id", "record", "label", "active"];
la.Attachment.prototype._ul4attrs = ul4._makeset("id", "record", "label", "active");

la.NoteAttachment = class NoteAttachment extends la.Attachment
{
};

la.NoteAttachment.prototype.type = "noteattachment";
la.NoteAttachment.prototype._ul4onattrs = la.Attachment.prototype._ul4onattrs.concat(["value"]);
la.NoteAttachment.prototype._ul4attrs = ul4._makeset(...la.Attachment.prototype._ul4onattrs, "value");

la.URLAttachment = class URLAttachment extends la.Attachment
{
};

la.URLAttachment.prototype.type = "urlattachment";
la.URLAttachment.prototype._ul4onattrs = la.Attachment.prototype._ul4onattrs.concat(["value"]);
la.URLAttachment.prototype._ul4attrs = ul4._makeset(...la.Attachment.prototype._ul4onattrs, "value");

la.FileAttachment = class FileAttachment extends la.Attachment
{
};

la.FileAttachment.prototype.type = "fileattachment";
la.FileAttachment.prototype._ul4onattrs = la.Attachment.prototype._ul4onattrs.concat(["value"]);
la.FileAttachment.prototype._ul4attrs = ul4._makeset(...la.Attachment.prototype._ul4onattrs, "value");

la.ImageAttachment = class ImageAttachment extends la.Attachment
{
};

la.ImageAttachment.prototype.type = "imageattachment";
la.ImageAttachment.prototype._ul4onattrs = la.Attachment.prototype._ul4onattrs.concat(["original", "thumb", "small", "medium", "large"]);
la.ImageAttachment.prototype._ul4attrs = ul4._makeset(...la.Attachment.prototype._ul4onattrs, "original", "thumb", "small", "medium", "large");

la.JSONAttachment = class JSONAttachment extends la.Attachment
{
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

la.JSONAttachment.prototype.type = "jsonattachment";
la.JSONAttachment.prototype._ul4onattrs = la.Attachment.prototype._ul4onattrs.concat(["value"]);
la.JSONAttachment.prototype._ul4attrs = ul4._makeset(...la.Attachment.prototype._ul4onattrs, "value");

la.Installation = class Installation extends la.Base
{
	__repr__()
	{
		return "<la.Installation id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

la.Installation.prototype._ul4onattrs = ["id", "name"];
la.Installation.prototype._ul4attrs = ul4._makeset("id", "name");

la.Category = class Category extends la.Base
{
	__repr__()
	{
		let v = [];
		let category = this;
		while (category !== null)
		{
			v.splice(0, 0, category.identifier);
			category = category.parent;
		}
		return "<la.Category id=" + ul4._repr(this.id) + " identifierpath=" + ul4._repr(v.join("/")) +  + " name=" + ul4._repr(this.name) + ">";
	}
};

la.Category.prototype._ul4onattrs = ["id", "identifier", "name", "order", "parent", "children", "apps"];
la.Category.prototype._ul4attrs = ul4._makeset("id", "identifier", "name", "order", "parent", "children", "apps");

la.KeyView = class KeyView extends la.Base
{
	__repr__()
	{
		return "<la.KeyView id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

la.KeyView.prototype._ul4onattrs = ["id", "identifier", "name", "key", "user"];
la.KeyView.prototype._ul4attrs = ul4._makeset("id", "identifier", "name", "key", "user");

la.AppParameter = class AppParameter extends la.Base
{
	__repr__()
	{
		return "<la.AppParameter id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

la.AppParameter.prototype._ul4onattrs = ["id", "app", "identifier", "description", "value"];
la.AppParameter.prototype._ul4attrs = ul4._makeset("id", "app", "identifier", "description", "value");

let classes = [
	la.Globals,
	la.FlashMessage,
	la.App,
	la.View,
	la.DataSource,
	la.Record,
	la.BoolControl,
	la.IntControl,
	la.NumberControl,
	la.TextControl,
	la.EmailControl,
	la.URLControl,
	la.TelControl,
	la.PasswordControl,
	la.TextAreaControl,
	la.DateControl,
	la.DatetimeMinuteControl,
	la.DatetimeSecondControl,
	la.LookupControl,
	la.LookupSelectControl,
	la.LookupRadioControl,
	la.LookupChoiceControl,
	la.AppLookupControl,
	la.AppLookupSelectControl,
	la.AppLookupRadioControl,
	la.AppLookupChoiceControl,
	la.MultipleLookupControl,
	la.MultipleLookupSelectControl,
	la.MultipleLookupCheckboxControl,
	la.MultipleLookupChoiceControl,
	la.MultipleAppLookupControl,
	la.MultipleAppLookupSelectControl,
	la.MultipleAppLookupCheckboxControl,
	la.MultipleAppLookupChoiceControl,
	la.GeoControl,
	la.FileControl,
	la.ButtonControl,
	la.Field,
	la.LookupItem,
	la.User,
	la.File,
	la.Geo,
	la.NoteAttachment,
	la.URLAttachment,
	la.FileAttachment,
	la.ImageAttachment,
	la.JSONAttachment,
	la.Installation,
	la.Category,
	la.KeyView,
	la.AppParameter
];

for (let constructor of classes)
{
	// Register under the old name
	ul4.register("de.livingapps.appdd." + constructor.name.toLowerCase(), constructor);
	// Register under the new name
	ul4.register("de.livinglogic.livingapi." + constructor.name.toLowerCase(), constructor);
}

})();
