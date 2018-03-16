;(function(undefined){

	let amd = (typeof define === 'function' && define.amd);
	let commonjs = (typeof module === 'object' && module.exports);

	let la = {};

	let ul4, ul4on;

	if (commonjs) {
		ul4 = require('ul4/ul4.min.js').ul4;
		ul4on = require('ul4/ul4.min.js').ul4on;
		module.exports = la;
	} else {
		ul4 = root.ul4;
		ul4on = root.ul4on;
		root.livingapi = la;
	}
la.Base = ul4._inherit(
	ul4.Proto,
	{
		create: function()
		{
			return ul4._clone(this);
		},

		ul4ondump: function ul4ondump(encoder)
		{
			for (var i = 0; i < this._ul4onattrs.length; ++i)
				encoder.dump(this._dumpUL4ONAttr(this._ul4onattrs[i]));
		},

		_dumpUL4ONAttr: function _dumpUL4ONAttr(name)
		{
			return this[name];
		},

		ul4onload: function ul4onload(decoder)
		{
			for (var i = 0, iter = decoder.loadcontent(); i < this._ul4onattrs.length; ++i)
			{
				var iteritem = iter.next();
				if (iteritem.done)
					break;
				this._loadUL4ONAttr(this._ul4onattrs[i], iteritem.value);
			}
			for (; i < this._ul4onattrs.length; ++i)
				this._setDefaultUL4ONAttr(this._ul4onattrs[i]);
		},

		_loadUL4ONAttr: function _loadUL4ONAttr(name, value)
		{
			this[name] = value;
		},

		_setDefaultUL4ONAttr: function _setDefaultUL4ONAttr(name)
		{
			this[name] = null;
		}
	}
);

la.Globals = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages"],

		__repr__: function repr()
		{
			return "<la.Globals version=" + ul4._repr(this.version) + ">";
		},

		// distance between two geo coordinates (see https://de.wikipedia.org/wiki/Orthodrome#Genauere_Formel_zur_Abstandsberechnung_auf_der_Erde)
		geodist: function geodist(geo1, geo2)
		{
			var sqsin = function sqsin(x) {x = Math.sin(x); return x*x};
			var sqcos = function sqsos(x) {x = Math.cos(x); return x*x};
			var deg2rad = Math.PI/180; // Conversion factor degree -> radians
			var radius = 6378.137; // Equatorial radius of earth in km
			var flat = 1/298.257223563; // Earth flattening

			var lat1 = geo1.lat * deg2rad;
			var long1 = geo1.long * deg2rad;
			var lat2 = geo2.lat * deg2rad;
			var long2 = geo2.long * deg2rad;
			var F = (lat1 + lat2)/2;
			var G = (lat1 - lat2)/2;
			var l = (long1 - long2)/2;
			var S = sqsin(G) * sqcos(l) + sqcos(F) * sqsin(l);
			var C = sqcos(G) * sqcos(l) + sqsin(F) * sqsin(l);
			var w = Math.atan(Math.sqrt(S/C));
			var D = 2 * w * radius;
			var T = Math.sqrt(S*C)/w;
			var H1 = (3*T-1)/(2*C);
			var H2 = (3*T+1)/(2*S);
			var s = D * (1 + flat * H1 * sqsin(F) * sqcos(G) - flat * H2 * sqcos(F) * sqsin(G));
			return s;
		}
	}
);

la.FlashMessage = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["timestamp", "type", "title", "message"],

		__repr__: function repr()
		{
			return "<la.FlashMessage type=" + ul4._repr(this.type) + " title=" + ul4._repr(this.title) + ">";
		}
	}
);

la.App = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "globals", "name", "description", "language", "startlink", "iconlarge", "iconsmall", "owner", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier"],

		__repr__: function repr()
		{
			return "<la.App id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
		}
	}
);

la.View = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "name", "app", "order", "width", "height", "start", "end"],

		__repr__: function repr()
		{
			return "<la.View id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
		}
	}
);

la.DataSource = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "identifier", "app", "apps"],

		__repr__: function repr()
		{
			return "<la.DataSource id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
		}
	}
);

la.Record = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children"],
		__repr__: function repr()
		{
			return "<la.Record id=" + ul4._repr(this.id) + ">";
		},

		search: function search(search)
		{
			for (var identifier in search)
			{
				var fieldsearch = search[identifier];
				if (ul4._bool(fieldsearch))
				{
					if (!this.fields.get(identifier).search(fieldsearch))
						return false;
				}
			}
			return true;
		},

		_dumpUL4ONAttr: function _dumpUL4ONAttr(name)
		{
			if (name === "values")
				return this._sparsevalues;
			else
				return this[name];
		},

		_loadUL4ONAttr: function _loadUL4ONAttr(name, value)
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
	}
);

Object.defineProperty(la.Record, "values", {
	get: function()
	{
		if (this._values === null)
		{
			this._values = ul4on._havemap ? new Map() : {};
			var self = this;
			this.app.controls.forEach(function(control, id){
				var fieldvalue = self._sparsevalues.get(control.identifier);
				if (typeof(fieldvalue) === "undefined")
					fieldvalue = null;
				self._values.set(id, fieldvalue);
			});
		}
		return this._values;
	}
});

Object.defineProperty(la.Record, "fields", {
	get: function()
	{
		if (this._fields === null)
		{
			this._fields = ul4on._havemap ? new Map() : {};
			var self = this;
			this.values.forEach(function(value, id){
				var field = la.Field.create(self.app.controls.get(id), self.app, value);
				self._fields.set(id, field);
			});
		}
		return this._fields;
	}
});

la.Control = ul4._inherit(
	la.Base,
	{
		type: null,
		subtype: null,
		_ul4onattrs: ["id", "identifier", "field", "app", "label", "priority", "order", "default"],

		__repr__: function repr()
		{
			return "<la." + this.__type__ + " id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
		},

		_logsearch: function _logsearch(value, search)
		{
			//console.log("Searching for " + ul4._repr(search.value) + " in " + ul4._repr(this) + " with operator " + search.operator + " in value " + ul4._repr(value));
		},

		// base implemntation, always returns ``false`` (i.e. "not found")
		// ``value`` is the value of the field
		// ``search`` is an object with information what we're searching for
		// keys in ``search`` are: ``operator`` (and ``value`` (if required by the operator))
		search: function search(value, search)
		{
			return false;
		}
	}
);

la.BoolControl = ul4._inherit(
	la.Control,
	{
		type: "bool",
		__type__: "BoolControl",

		// ``search`` must by ``null``, ``false`` or ``true``
		search: function search(value, search)
		{
			this._logsearch(value, search);
			if (search.operator === "equals")
				return search.value === value;
			else
				return false;
		}
	}
);

la.IntControl = ul4._inherit(
	la.Control,
	{
		type: "int",
		__type__: "IntControl",

		// ``search.value`` must by ``null`` or an integer
		search: function search(value, search)
		{
			this._logsearch(value, search);
			if (search.operator === "equals")
				return search.value === value;
			else
				return false;
		}
	}
);

la.NumberControl = ul4._inherit(
	la.Control,
	{
		type: "number",
		__type__: "NumberControl",

		// ``search.value`` must by ``null`` or an integer
		search: function search(value, search)
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
	}
);

la.StringControl = ul4._inherit(
	la.Control,
	{
		type: "string",

		search: function search(value, search)
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
	}
);

la.TextControl = ul4._inherit(
	la.StringControl,
	{
		subtype: "text",
		__type__: "TextControl"
	}
);

la.EmailControl = ul4._inherit(
	la.StringControl,
	{
		subtype: "email",
		__type__: "EmailControl"
	}
);

la.URLControl = ul4._inherit(
	la.StringControl,
	{
		subtype: "url",
		__type__: "URLControl"
	}
);

la.TelControl = ul4._inherit(
	la.StringControl,
	{
		subtype: "tel"
	}
);

la.PasswordControl = ul4._inherit(
	la.StringControl,
	{
		subtype: "password"
	}
);

la.TextAreaControl = ul4._inherit(
	la.StringControl,
	{
		subtype: "textarea",
		__type__: "TextAreaControl"
	}
);

la.DateControl = ul4._inherit(
	la.Control,
	{
		type: "date",
		subtype: "date",
		__type__: "DateControl",

		formatstring: function formatstring(language)
		{
			language = language || this.app.language;

			if (language === "de")
				return "%d.%m.%Y";
			else
				return "%m/%d/%Y";
		},

		// searchvalue must be ``null``, a ``Date`` object or a string
		search: function search(value, search)
		{
			this._logsearch(value, search);

			var searchvalue = search.value;
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
	}
);

la.DatetimeMinuteControl = ul4._inherit(
	la.DateControl,
	{
		subtype: "datetimeminute",
		__type__: "DatetimeMinuteControl",

		formatstring: function formatstring(language)
		{
			language = language || this.app.language;

			if (language === "de")
				return "%d.%m.%Y %H:%M";
			else
				return "%m/%d/%Y %H:%M";
		}
	}
);

la.DatetimeSecondControl = ul4._inherit(
	la.DateControl,
	{
		subtype: "datetimesecond",
		__type__: "DatetimeMinuteSecond",

		formatstring: function formatstring(language)
		{
			language = language || this.app.language;

			if (language === "de")
				return "%d.%m.%Y %H:%M:%S";
			else
				return "%m/%d/%Y %H:%M:%S";
		}
	}
);

la.LookupControl = ul4._inherit(
	la.Control,
	{
		type: "lookup",

		_ul4onattrs: la.Control._ul4onattrs.concat(["lookupdata"]),

		// ``search.value`` must be ``null`` or a ``LookupItem`` key
		// if this control is an applookup ``search.value`` must be an object containing the search criteria for the referenced record
		search: function search(value, search)
		{
			if (this.lookupapp === null || typeof(this.lookupapp) === "undefined")
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
			else
			{
				if (value === null || search.value === null)
					return value === search.value;
				else
					return value.search(search);
			}
		}
	}
);

la.LookupSelectControl = ul4._inherit(
	la.LookupControl,
	{
		subtype: "select",
		__type__: "LookupSelectControl"
	}
);

la.LookupRadioControl = ul4._inherit(
	la.LookupControl,
	{
		subtype: "radio",
		__type__: "LookupRadioControl"
	}
);

la.LookupChoiceControl = ul4._inherit(
	la.LookupControl,
	{
		subtype: "choice",
		__type__: "LookupChoiceControl"
	}
);

la.AppLookupControl = ul4._inherit(
	la.Control,
	{
		type: "applookup",
		_ul4onattrs: la.Control._ul4onattrs.concat(["lookupapp", "lookupcontrols"]),

		// ``search.value`` must be an object containing the search criteria for the referenced record
		search: function search(value, search)
		{
			if (value === null || search.value === null)
				return value === search.value;
			else
				return value.search(search);
		}
	}
);

la.AppLookupSelectControl = ul4._inherit(
	la.AppLookupControl,
	{
		subtype: "select",
		__type__: "AppLookupSelectControl"
	}
);

la.AppLookupRadioControl = ul4._inherit(
	la.AppLookupControl,
	{
		subtype: "radio",
		__type__: "AppLookupRadioControl"
	}
);

la.AppLookupChoiceControl = ul4._inherit(
	la.AppLookupControl,
	{
		subtype: "choice",
		__type__: "AppLookupChoiceControl"
	}
);

la.MultipleLookupControl = ul4._inherit(
	la.LookupControl,
	{
		type: "multiplelookup",

		// search.value must be ``null`` or a ``LookupItem`` key
		// if this control is an applookup ``search.value`` must be an object containing the search criteria for the referenced record
		search: function search(value, search)
		{
			if (search.operator === "equals")
			{
				if (this.lookupapp === null)
				{
					for (var i = 0; i < value.length; ++i)
					{
						if (value[i].key === search.value)
							return true;
					}
					return false;
				}
				else
				{
					if (search.value === null)
						return value.length === 0;
					else
					{
						for (var i = 0; i < value.length; ++i)
						{
							if (value[i].search(search.value))
								return true;
						}
						return false;
					}
				}
			}
			else
				return false;
		}
	}
);

la.MultipleLookupSelectControl = ul4._inherit(
	la.MultipleLookupControl,
	{
		subtype: "select",
		__type__: "MultipleLookupSelectControl"
	}
);

la.MultipleLookupCheckboxControl = ul4._inherit(
	la.MultipleLookupControl,
	{
		subtype: "checkbox",
		__type__: "MultipleLookupCheckboxControl"
	}
);

la.MultipleAppLookupControl = ul4._inherit(
	la.AppLookupControl,
	{
		type: "multipleapplookup",

		// ``search.value`` must be an object containing the search criteria for the referenced record
		search: function search(value, search)
		{
			if (search.operator === "equals")
			{
				if (search.value === null)
					return value.length === 0;
				else
				{
					for (var i = 0; i < value.length; ++i)
					{
						if (value[i].search(search.value))
							return true;
					}
					return false;
				}
			}
			else
				return false;
		}
	}
);

la.MultipleAppLookupSelectControl = ul4._inherit(
	la.MultipleAppLookupControl,
	{
		subtype: "select",
		__type__: "MultipleAppLookupSelectControl"
	}
);

la.MultipleAppLookupCheckboxControl = ul4._inherit(
	la.MultipleAppLookupControl,
	{
		subtype: "checkbox",
		__type__: "MultipleAppLookupCheckboxControl"
	}
);

la.GeoControl = ul4._inherit(
	la.Control,
	{
		type: "geo",
		__type__: "GeoControl"
	}
);

la.FileControl = ul4._inherit(
	la.Control,
	{
		type: "file",
		__type__: "FileControl"
	}
);

la.ButtonControl = ul4._inherit(
	la.Control,
	{
		type: "button",
		__type__: "ButtonControl"
	}
);

la.Field = ul4._inherit(
	la.Base,
	{
		create: function create(control, record, value)
		{
			var field = la.Base.create.call(this);
			field.control = control;
			field.record = record;
			field.value = value;
			return field;
		},

		search: function search(searchvalue)
		{
			return this.control.search(this.value, searchvalue);
		},

		__repr__: function repr()
		{
			return "<la.Field>";
		}
	}
);

la.LookupItem = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["key", "label"],

		__repr__: function repr()
		{
			return "<la.LookupItem key=" + ul4._repr(this.key) + " label=" + ul4._repr(this.label) + ">";
		}
	}
);

la.User = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["_id", "id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews"],

		__repr__: function repr()
		{
			return "<la.User id=" + ul4._repr(this.id) + " firstname=" + ul4._repr(this.firstname) + " lastname=" + ul4._repr(this.lastname) + " email=" + ul4._repr(this.email) + ">";
		}
	}
);

la.File = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "url", "filename", "mimetype", "width", "height"],

		__repr__: function repr()
		{
			return "<la.File id=" + ul4._repr(this.id) + " url=" + ul4._repr(this.url) + " filename=" + ul4._repr(this.filename) + ">";
		}
	}
);

la.Geo = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["lat", "long", "info"],

		__repr__: function repr()
		{
			return "<la.Geo lat=" + ul4._repr(this.lat) + " long=" + ul4._repr(this.long) + " info=" + ul4._repr(this.info) + ">";
		}
	}
);

la.Attachment = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "record", "label", "active"],

		__repr__: function repr()
		{
			return "<la." + this.__type__ + " id=" + ul4._repr(this.id) + " label=" + ul4._repr(this.label) + ">";
		}
	}
);

la.NoteAttachment = ul4._inherit(
	la.Attachment,
	{
		type: "noteattachment",
		__type__: "NoteAttachment",
		_ul4onattrs: la.Attachment._ul4onattrs.concat(["value"])
	}
);

la.URLAttachment = ul4._inherit(
	la.Attachment,
	{
		type: "urlattachment",
		__type__: "URLAttachment",
		_ul4onattrs: la.Attachment._ul4onattrs.concat(["value"])
	}
);

la.FileAttachment = ul4._inherit(
	la.Attachment,
	{
		type: "fileattachment",
		__type__: "FileAttachment",
		_ul4onattrs: la.Attachment._ul4onattrs.concat(["value"])
	}
);

la.ImageAttachment = ul4._inherit(
	la.Attachment,
	{
		type: "imageattachment",
		__type__: "ImageAttachment",
		_ul4onattrs: la.Attachment._ul4onattrs.concat(["original", "thumb", "small", "medium", "large"])
	}
);

la.JSONAttachment = ul4._inherit(
	la.Attachment,
	{
		type: "jsonattachment",
		__type__: "JSONAttachment",
		_ul4onattrs: la.Attachment._ul4onattrs.concat(["value"]),
		_dumpUL4ONAttr: function _dumpUL4ONAttr(name)
		{
			if (name === "value")
				return ul4._asjson(this.value);
			else
				return this[name];
		},

		_loadUL4ONAttr: function _loadUL4ONAttr(name, value)
		{
			if (name === "value")
				this.value = ul4._fromjson(value);
			else
				this[name] = value
		}
	}
);

la.Installation = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "name"],

		__repr__: function repr()
		{
			return "<la.Installation id=" + ul4._repr(this.id) + " name=" + ul4._repr(this.name) + ">";
		}
	}
);

la.Category = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "identifier", "name", "order", "parent", "children", "apps"],

		__repr__: function repr()
		{
			var v = [];
			var category = this;
			while (category !== null)
			{
				v.splice(0, 0, category.identifier);
				category = category.parent;
			}
			return "<la.Category id=" + ul4._repr(this.id) + " identifierpath=" + ul4._repr(v.join("/")) +  + " name=" + ul4._repr(this.name) + ">";
		}
	}
);

la.KeyView = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "identifier", "name", "key", "user"],

		__repr__: function repr()
		{
			return "<la.KeyView id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
		}
	}
);

la.AppParameter = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["id", "app", "identifier", "description", "value"],

		__repr__: function repr()
		{
			return "<la.AppParameter id=" + ul4._repr(this.id) + " identifier=" + ul4._repr(this.identifier) + ">";
		}
	}
);

var classes = [
	"Globals",
	"App",
	"View",
	"DataSource",
	"Record",
	"BoolControl",
	"IntControl",
	"NumberControl",
	"TextControl",
	"EmailControl",
	"URLControl",
	"TelControl",
	"PasswordControl",
	"TextAreaControl",
	"DateControl",
	"DatetimeMinuteControl",
	"DatetimeSecondControl",
	"LookupControl",
	"LookupSelectControl",
	"LookupRadioControl",
	"LookupChoiceControl",
	"AppLookupControl",
	"AppLookupSelectControl",
	"AppLookupRadioControl",
	"AppLookupChoiceControl",
	"MultipleLookupControl",
	"MultipleLookupSelectControl",
	"MultipleLookupCheckboxControl",
	"MultipleAppLookupControl",
	"MultipleAppLookupSelectControl",
	"MultipleAppLookupCheckboxControl",
	"GeoControl",
	"FileControl",
	"ButtonControl",
	"Field",
	"LookupItem",
	"User",
	"File",
	"Geo",
	"NoteAttachment",
	"URLAttachment",
	"FileAttachment",
	"ImageAttachment",
	"JSONAttachment",
	"Installation",
	"Category",
	"KeyView",
	"AppParameter"
];

for (var i = 0; i < classes.length; ++i)
{
	var name = classes[i];
	var object = la[name];
	ul4on.register("de.livingapps.appdd." + name.toLowerCase(), object);
}

})();