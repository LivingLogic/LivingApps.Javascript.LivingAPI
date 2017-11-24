;(function(root){
    
        let amd = (typeof define === 'function' && define.amd);
        let commonjs = (typeof module === 'object' && module.exports);
    
        let la = {};
    
		let ul4, ul4on;
		
        if (commonjs) {
            ul4 = require('./ul4').ul4;
            ul4on = require('./ul4').ul4on;
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
				encoder.dump(this[this._ul4onattrs[i]]);
		},

		ul4onload: function ul4onload(decoder)
		{
			for (var i = 0; i < this._ul4onattrs.length; ++i)
				this[this._ul4onattrs[i]] = decoder.load();
		}
	}
);

la.Globals = ul4._inherit(
	la.Base,
	{
		_ul4onattrs: ["version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages"],

		__repr__: function repr()
		{
			return "<la.Globals version=" + ul4._repr(this.version) + " platform=" + ul4._repr(this.platform) + ">";
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
		insert: function (values) {
			return this.globals.Login._insert(this, values);
		},

		_ul4onattrs: ["id", "globals", "name", "description", "language", "startlink", "iconlarge", "iconsmall", "owner", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagment_identifier"],
		
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
		delete: function () {
			return this.app.globals.Login._delete(this);
		},

		update: function (values) {
			return this.app.globals.Login._update(this, values);
		},

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

		ul4ondump: function ul4ondump(encoder)
		{
			encoder.dump(this.id);
			encoder.dump(this.app);
			encoder.dump(this.createdat);
			encoder.dump(this.createdby);
			encoder.dump(this.updatedat);
			encoder.dump(this.updatedby);
			encoder.dump(this.updatecount);

			var fieldvalues = {};
			for (var id in this.fields)
			{
				var field = this.fields[id];

				if (field.value !== null)
					fieldvalues[id] = field.value;
			}
			encoder.dump(fieldvalues);

			encoder.dump(this.attachments);
		},

		ul4onload: function ul4onload(decoder)
		{
			this.id = decoder.load();
			this.app = decoder.load();
			this.createdat = decoder.load();
			this.createdby = decoder.load();
			this.updatedat = decoder.load();
			this.updatedby = decoder.load();
			this.updatecount = decoder.load();
			var self = this;
			this.fields = ul4on._havemap ? new Map() : {};

			var fieldvalues = decoder.load();

			this.app.controls.forEach(function(control, id){
				var fieldvalue = fieldvalues.get(control.identifier);
				if (typeof(fieldvalue) === "undefined")
					fieldvalue = null;

				var field = la.Field.create(control, self.app, fieldvalue);
				self.fields.set(id, field);
			});

			this.attachments = decoder.load();
		},
	}
);

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

		asjson: function asjson(value) {
			return value;
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
			else
				return false;
		}
	}
);

la.StringControl = ul4._inherit(
	la.Control,
	{
		type: "string",

		asjson: function (value) {
			return value;
		},

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

		/**
		 * @param {Date} value
		 */
		asjson: function asjson(value) {
			if (value instanceof Date){
				value = `${value.getFullYear()}-${value.getMonth()+1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
			}
			return value;
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
		_ul4onattrs: la.Control._ul4onattrs.concat(["lookupdata", "lookupapp", "lookupcontrols"]),

		asjson: function asjson(value) {
			if(la.LookupItem.isprotoof(value)){
				return value.key;
			} else if (la.Record.isprotoof(value)) {
				return value.id;
			}
			return value;
		},

		// ``search.value`` must be ``null`` or a ``LookupItem`` key
		// if this control is an applookup ``search.value`` must be an object containing the search criteria for the referenced record
		search: function search(value, search)
		{
			if (this.lookupapp === null)
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

la.MultipleLookupControl = ul4._inherit(
	la.LookupControl,
	{
		type: "multiplelookup",

		asjson: function asjson(value)
		{
			if(la.LookupItem.isprotoof(value))
				return value.key;
			else if (la.Record.isprotoof(value))
				return value.id;
			else if (Object.prototype.toString.call(value) === "[object Array]")
			{
				let newValue = [];
				for (let item of value)
					newValue.push(this.asjson(item));
				return newValue;
			}
			return value;
		},

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

la.GeoControl = ul4._inherit(
	la.Control,
	{
		type: "geo",
		__type__: "GeoControl",

		asjson: function asjson(value)
		{
			if (la.Geo.isprotoof(value))
				value = `${value.lat}, ${value.long}, ${value.info}`;
			return value;
		}
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
		//_ul4onattrs: ["id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews"],

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
		create: function create(lat, long, info)
		{
			var geo = la.Base.create.call(this);
			geo.lat = lat;
			geo.long = long;
			geo.info = info;
			return geo;
		},

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
		ul4ondump: function ul4ondump(encoder)
		{
			la.Attachment.ul4ondump.call(this, encoder);
			encoder.dump(ul4._asjson(this.value));
		},
		ul4onload: function ul4onload(decoder)
		{
			la.Attachment.ul4onload.call(this, decoder);
			this.value = ul4._fromjson(decoder.load());
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
	"LookupSelectControl",
	"LookupRadioControl",
	"LookupChoiceControl",
	"MultipleLookupSelectControl",
	"MultipleLookupCheckboxControl",
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

})(this);
