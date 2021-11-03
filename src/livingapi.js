/*!
 * LivingAPI JavaScript Library
 * https://my.living-apps.de/docs/LivingAPI.html
 *
 * Copyright 2017-2019 by LivingLogic AG, Bayreuth/Germany
 * Copyright 2017-2019 by Walter Dörwald
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
		return "<" + this.constructor.name + ">";
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

	constructor()
	{
		super();
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

	__repr__()
	{
		return "<Globals version=" + ul4._repr(this.version) + ">";
	}
};

Globals.prototype._ul4onattrs = ["version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages", "lang", "datasources", "hostname", "app", "record"];
Globals.prototype._ul4attrs = new Set(["version", "hostname", "platform", "user", "lang", "app", "record", "maxdbactions", "maxtemplateruntime", "flashmessages"]);

export class FlashMessage extends Base
{
	static classdoc = "A flash message in a web page";

	__repr__()
	{
		return "<FlashMessage type=" + ul4._repr(this.type) + " title=" + ul4._repr(this.title) + ">";
	}
};

FlashMessage.prototype._ul4onattrs = ["timestamp", "type", "title", "message"];
FlashMessage.prototype._ul4attrs = new Set(["timestamp", "type", "title", "message"]);

export class App extends Base
{
	static classdoc = "A LivingApps application";

	__repr__()
	{
		return "<App id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}

	insert(values={})
	{
		let record = this.__call__(values);
		this.globals.handler.save(this);
		return record;
	}

	__call__(values={})
	{
		let record = new Record(this);
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

App.prototype._ul4onattrs = ["id", "globals", "name", "description", "lang", "startlink", "iconlarge", "iconsmall", "createdby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "basetable", "primarykey", "insertprocedure", "updateprocedure", "deleteprocedure", "templates", "createdat", "updatedat", "updatedby", "superid", "favorite"];
App.prototype._ul4attrs = new Set(["id", "globals", "name", "description", "lang", "startlink", "iconlarge", "iconsmall", "createdat", "createdby", "updatedat", "updatedby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "insert", "favorite"]);
ul4.expose(App.prototype.__call__, ["**values"], {"needsobject": true});
ul4.expose(App.prototype.insert, ["**values"], {"needsobject": true});

export class View extends Base
{
	static classdoc = "An input form for a LivingApps application";

	__repr__()
	{
		return "<View id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

View.prototype._ul4onattrs = ["id", "name", "app", "order", "width", "height", "start", "end"];
View.prototype._ul4attrs = new Set(["id", "name", "app", "order", "width", "height", "start", "end"]);

export class DataSourceData extends Base
{
	static classdoc = "The data resulting from a data source configuration";

	__repr__()
	{
		return "<DataSource.Data id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

DataSourceData.prototype._ul4onattrs = ["id", "identifier", "app", "apps"];
DataSourceData.prototype._ul4attrs = new Set(["id", "identifier", "app", "apps"]);

export class Record extends Base
{
	static classdoc = "A record of a LivingApp application";

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
		let v = ["<Record id=", ul4._repr(this.id)];
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
				let field = new Field(this.app.controls.get(identifier), this, value);
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

Record.prototype._ul4onattrs = ["id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children"];
Record.prototype._ul4attrs = new Set(["id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children"]);
ul4.expose(Record.prototype.is_dirty, []);
ul4.expose(Record.prototype.has_errors, []);
ul4.expose(Record.prototype.delete, []);
ul4.expose(Record.prototype.save, []);
ul4.expose(Record.prototype.update, ["**values"], {"needsobject": true});

export class Control extends Base
{
	__repr__()
	{
		return "<" + this.constructor.name + " id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
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
Control.prototype._ul4onattrs = ["id", "identifier", "field", "app", "label", "priority", "order", "default", "ininsertprocedure", "inupdateprocedure"];
Control.prototype._ul4attrs = new Set(["id", "identifier", "field", "app", "label", "priority", "order", "default", "ininsertprocedure", "inupdateprocedure"]);

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

export class NumberControl extends Control
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

export class StringControl extends Control
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

StringControl.prototype.type = "string";

export class TextControl extends StringControl
{
	static classdoc = "A LivingApps text field (type 'string/text')";

};

TextControl.prototype.subtype = "text";

export class EmailControl extends StringControl
{
	static classdoc = "A LivingApps email field (type 'string/email')";

};

EmailControl.prototype.subtype = "email";

export class URLControl extends StringControl
{
	static classdoc = "A LivingApps URL field (type 'string/url')";

};

URLControl.prototype.subtype = "url";

export class TelControl extends StringControl
{
	static classdoc = "A LivingApps phone number field (type 'string/tel')";

};

TelControl.prototype.subtype = "tel";

export class PasswordControl extends StringControl
{
	static classdoc = "A LivingApps email field (type 'string/email')";

};

PasswordControl.prototype.subtype = "password";

export class TextAreaControl extends StringControl
{
	static classdoc = "A LivingApps textarea field (type 'string/textarea')";

};

TextAreaControl.prototype.subtype = "textarea";
TextAreaControl.prototype._ul4onattrs = StringControl.prototype._ul4onattrs.concat(["encrypted"]);
TextAreaControl.prototype._ul4attrs = new Set([...StringControl.prototype._ul4attrs, "encrypted"]);

export class HTMLControl extends StringControl
{
	static classdoc = "A LivingApps HTML field (type 'string/html')";

};

HTMLControl.prototype.subtype = "html";

export class DateControl extends Control
{
	static classdoc = "A LivingApps date field (type 'date/date')";

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

DateControl.prototype.type = "date";
DateControl.prototype.subtype = "date";

export class DatetimeMinuteControl extends DateControl
{
	static classdoc = "A LivingApps date field (type 'date/datetimeminute')";

	formatstring(language)
	{
		language = language || this.app.language;

		if (language === "de")
			return "%d.%m.%Y %H:%M";
		else
			return "%m/%d/%Y %H:%M";
	}
};

DatetimeMinuteControl.prototype.subtype = "datetimeminute";

export class DatetimeSecondControl extends DateControl
{
	static classdoc = "A LivingApps date field (type 'date/datetimesecond')";

	formatstring(language)
	{
		language = language || this.app.language;

		if (language === "de")
			return "%d.%m.%Y %H:%M:%S";
		else
			return "%m/%d/%Y %H:%M:%S";
	}
};

DatetimeSecondControl.prototype.subtype = "datetimesecond";

export class LookupControl extends Control
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

LookupControl.prototype.type = "lookup";
LookupControl.prototype._ul4onattrs = Control.prototype._ul4onattrs.concat(["lookupdata"]);
LookupControl.prototype._ul4attrs = new Set([...Control.prototype._ul4attrs, "lookupdata"]);

export class LookupSelectControl extends LookupControl
{
	static classdoc = "A LivingApps lookup field (type 'lookup/select')";

};

LookupSelectControl.prototype.subtype = "select";

export class LookupRadioControl extends LookupControl
{
	static classdoc = "A LivingApps lookup field (type 'lookup/radio')";

};

LookupRadioControl.prototype.subtype = "radio";

export class LookupChoiceControl extends LookupControl
{
	static classdoc = "A LivingApps lookup field (type 'lookup/choice')";

};

LookupChoiceControl.prototype.subtype = "choice";

export class AppLookupControl extends Control
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

AppLookupControl.prototype.type = "applookup";
AppLookupControl.prototype._ul4onattrs = Control.prototype._ul4onattrs.concat(["lookup_app", "lookup_controls", "local_master_control", "local_detail_controls", "remote_master_control"]);
AppLookupControl.prototype._ul4attrs = new Set([...Control.prototype._ul4attrs, "lookup_app", "lookup_controls", "local_master_control", "local_detail_controls", "remote_master_control"]);

export class AppLookupSelectControl extends AppLookupControl
{
	static classdoc = "A LivingApps applookup field (type 'applookup/select')";

};

AppLookupSelectControl.prototype.subtype = "select";

export class AppLookupRadioControl extends AppLookupControl
{
	static classdoc = "A LivingApps applookup field (type 'applookup/radio')";

};

AppLookupRadioControl.prototype.subtype = "radio";

export class AppLookupChoiceControl extends AppLookupControl
{
	static classdoc = "A LivingApps applookup field (type 'applookup/choice')";

};

AppLookupChoiceControl.prototype.subtype = "choice";

export class MultipleLookupControl extends LookupControl
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

MultipleLookupControl.prototype.subtype = "multiplelookup";

export class MultipleLookupSelectControl extends MultipleLookupControl
{
	static classdoc = "A LivingApps multiplelookup field (type 'multiplelookup/select')";

};

MultipleLookupSelectControl.prototype.subtype = "select";

export class MultipleLookupCheckboxControl extends MultipleLookupControl
{
	static classdoc = "A LivingApps multiplelookup field (type 'multiplelookup/checkbox')";

};

MultipleLookupCheckboxControl.prototype.subtype = "checkbox";

export class MultipleLookupChoiceControl extends MultipleLookupControl
{
	static classdoc = "A LivingApps multiplelookup field (type 'multiplelookup/choice')";

};

MultipleLookupChoiceControl.prototype.subtype = "choice";

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

export class MultipleAppLookupSelectControl extends MultipleAppLookupControl
{
	static classdoc = "A LivingApps multiple applookup field (type 'multipleapplookup/select')";

};

MultipleAppLookupSelectControl.prototype.subtype = "select";

export class MultipleAppLookupCheckboxControl extends MultipleAppLookupControl
{
	static classdoc = "A LivingApps multiple applookup field (type 'multipleapplookup/checkbox')";

};

MultipleAppLookupCheckboxControl.prototype.subtype = "checkbox";

export class MultipleAppLookupChoiceControl extends MultipleAppLookupControl
{
	static classdoc = "A LivingApps multiple applookup field (type 'multipleapplookup/choice')";

};

MultipleAppLookupChoiceControl.prototype.subtype = "choice";

export class GeoControl extends Control
{
	static classdoc = "A LivingApps geo field (type 'geo')";

};

GeoControl.prototype.type = "geo";

export class FileControl extends Control
{
	static classdoc = "A LivingApps upload field (type 'file')";

};

FileControl.prototype.type = "file";

export class FileSignatureControl extends FileControl
{
	static classdoc = "A LivingApps signature image field (type 'file/signature')";

};

FileSignatureControl.prototype.subtype = "signature";

export class ButtonControl extends Control
{
};

ButtonControl.prototype.type = "button";

export class Field extends Base
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
		let s = "<Field identifier=";
		s += ul4._repr(this.control.identifier)
		if (this._dirty)
			s += " is_dirty()=True";
		if (this.errors.length !== 0)
			s += " has_errors()=True";
		s += ">"
		return s;
	}
};

export class LookupItem extends Base
{
	static classdoc = "An option in a lookup control/field";

	__repr__()
	{
		return "<LookupItem key=" + ul4._repr(this.key) + " label=" + ul4._repr(this.label) + ">";
	}
};

LookupItem.prototype._ul4onattrs = ["id", "key", "label"];
LookupItem.prototype._ul4attrs = new Set(["id", "key", "label"]);

export class User extends Base
{
	static classdoc = "A LivingApps user/account";

	__repr__()
	{
		return "<User id=" + ul4._repr(this.id) + " firstname=" + ul4._repr(this.firstname) + " surname=" + ul4._repr(this.surname) + " email=" + ul4._repr(this.email) + ">";
	}
};

User.prototype._ul4onattrs = ["_id", "id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews"];
User.prototype._ul4attrs = new Set(["_id", "id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews"]);

export class File extends Base
{
	static classdoc = "An uploaded file";

	__repr__()
	{
		return "<File id=" + ul4._repr(this.id) + " url=" + ul4._repr(this.url) + " filename=" + ul4._repr(this.filename) + ">";
	}
};

File.prototype._ul4onattrs = ["id", "url", "filename", "mimetype", "width", "height", "internalid", "createdat", "size"];
File.prototype._ul4attrs = new Set(["id", "url", "filename", "mimetype", "width", "height", "size", "createdat"]);

export class Geo extends Base
{
	static classdoc = "Geographical coordinates and location information";

	constructor(lat, long, info)
	{
		super();
		this.lat = lat;
		this.long = long;
		this.info = info;
	}

	__repr__()
	{
		return "<Geo lat=" + ul4._repr(this.lat) + " long=" + ul4._repr(this.long) + " info=" + ul4._repr(this.info) + ">";
	}
};

Geo.prototype._ul4onattrs = ["lat", "long", "info"];
Geo.prototype._ul4attrs = new Set(["lat", "long", "info"]);

export class Attachment extends Base
{
	__repr__()
	{
		return "<" + this.__type__ + " id=" + ul4._repr(this.id) + " label=" + ul4._repr(this.label) + ">";
	}
};

Attachment.prototype._ul4onattrs = ["id", "record", "label", "active"];
Attachment.prototype._ul4attrs = new Set(["id", "record", "label", "active"]);

export class NoteAttachment extends Attachment
{
	static classdoc = "A note attachment of a record";

};

NoteAttachment.prototype.type = "noteattachment";
NoteAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
NoteAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);

export class URLAttachment extends Attachment
{
	static classdoc = "A URL attachment of a record";

};

URLAttachment.prototype.type = "urlattachment";
URLAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
URLAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);

export class FileAttachment extends Attachment
{
	static classdoc = "A file attachment of a record";

};

FileAttachment.prototype.type = "fileattachment";
FileAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
FileAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);

export class ImageAttachment extends Attachment
{
	static classdoc = "An image attachment of a record";

};

ImageAttachment.prototype.type = "imageattachment";
ImageAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["original", "thumb", "small", "medium", "large"]);
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
JSONAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
JSONAttachment.prototype._ul4attrs = new Set([...Attachment.prototype._ul4onattrs, "value"]);

export class Installation extends Base
{
	static classdoc = "The installation that created an app";

	__repr__()
	{
		return "<Installation id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
	}
};

Installation.prototype._ul4onattrs = ["id", "name"];
Installation.prototype._ul4attrs = new Set(["id", "name"]);

export class Category extends Base
{
	static classdoc = "A navigation category";

	__repr__()
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

Category.prototype._ul4onattrs = ["id", "identifier", "name", "order", "parent", "children", "apps"];
Category.prototype._ul4attrs = new Set(["id", "identifier", "name", "order", "parent", "children", "apps"]);

export class KeyView extends Base
{
	static classdoc = "Object granting access to a view template";

	__repr__()
	{
		return "<KeyView id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

KeyView.prototype._ul4onattrs = ["id", "identifier", "name", "key", "user"];
KeyView.prototype._ul4attrs = new Set(["id", "identifier", "name", "key", "user"]);

export class AppParameter extends Base
{
	static classdoc = "A parameter of a LivingApps application";

	__repr__()
	{
		return "<AppParameter id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
	}
};

AppParameter.prototype._ul4onattrs = ["id", "app", "identifier", "description", "value"];
AppParameter.prototype._ul4attrs = new Set(["id", "app", "identifier", "description", "value"]);

let classes = [
	Globals,
	FlashMessage,
	App,
	View,
	DataSourceData,
	Record,
	BoolControl,
	IntControl,
	NumberControl,
	TextControl,
	EmailControl,
	URLControl,
	TelControl,
	PasswordControl,
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
	ButtonControl,
	Field,
	LookupItem,
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
