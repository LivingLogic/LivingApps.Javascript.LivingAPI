/*!
 * UL4/UL4ON JavaScript Library
 * http://www.livinglogic.de/Python/ul4c/
 * http://www.livinglogic.de/Python/ul4on/
 *
 * Copyright 2011-2018 by LivingLogic AG, Bayreuth/Germany
 * Copyright 2011-2018 by Walter DÃ¶rwald
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

/*jslint vars: true */
export let ul4 = {};

let iscommon = (typeof module === 'object' && module.exports);

	ul4.version = "46";

	//
	// UL4ON
	//

	ul4._registry = {};

	ul4._havemap = (typeof(Map) === "function" && typeof(Map.prototype.forEach) === "function");

	ul4._havemapconstructor = (function ()
	{
		if (ul4._havemap)
		{
			try
			{
				if (new Map([[1, 2]]).size == 1)
					return true;
			}
			catch (error)
			{
			}
		}
		return false;
	})();

	ul4._haveset = (typeof(Set) === "function" && typeof(Set.prototype.forEach) === "function");

	ul4._havesetconstructor = (function ()
	{
		if (ul4._haveset)
		{
			try
			{
				if (new Set([1, 2]).size == 2)
					return true;
			}
			catch (error)
			{
			}
			return false;
		}
		else
			return false;
	})();

	// helper functions that work with Maps and objects
	if (ul4._havemap)
	{
		ul4._makemap = function _makemap(...items)
		{
			let map = new Map();

			for (let i = 0; i < items.length; ++i)
			{
				let [key, value] = items[i];
				map.set(key, value);
			}
			return map;
		};

		ul4._setmap = function _setmap(map, key, value)
		{
			if (map.__proto__ === Map.prototype)
				map.set(key, value);
			else
				map[key] = value;
		};

		ul4._emptymap = function _emptymap()
		{
			return new Map();
		};

		ul4._getmap = function _getmap(map, key, value)
		{
			if (map.__proto__ === Map.prototype)
				return map.get(key);
			else
				return map[key];
		};
	}
	else
	{
		ul4._makemap = function _makemap(...items)
		{
			let map = {};

			for (let i = 0; i < items.length; ++i)
			{
				let [key, value] = items[i];
				map[key] = value;
			}
			return map;
		};

		ul4._setmap = function _setmap(map, key, value)
		{
			map[key] = value;
		};

		ul4._emptymap = function _emptymap()
		{
			return {};
		};

		ul4._getmap = function _getmap(map, key, value)
		{
			return map[key];
		};
	}

	// Function used for making sets, when the Set constructor doesn't work (or we don't have sets)
	if (ul4._haveset)
	{
		ul4._emptyset = function _emptyset()
		{
			return new Set();
		};
	}
	else
	{
		ul4._emptyset = function _emptyset()
		{
			return new ul4._Set();
		};
	}

	ul4._makeset = function _makeset(...items)
	{
		let set = ul4._emptyset();

		for (let i = 0; i < items.length; ++i)
			set.add(items[i]);
		return set;
	};

	// Register the constructor function ``f`` under the name ``name`` with the UL4ON machinery
	ul4.register = function register(name, f)
	{
		f.prototype.ul4onname = name;
		ul4._registry[name] = f;
	};

	// Return a string that contains the object ``obj`` in the UL4ON serialization format
	ul4.dumps = function dumps(obj, indent)
	{
		let encoder = new ul4.Encoder(indent);
		encoder.dump(obj);
		return encoder.finish();
	};

	// Load an object from the string ``data``.
	// ``data`` must contain the object in the UL4ON serialization format
	// ``registry`` may be null or a dictionary mapping type names to constructor functions
	ul4.loads = function loads(data, registry)
	{
		let decoder = new ul4.Decoder(data, registry);
		return decoder.load();
	};

	// Helper class for encoding
	ul4.Encoder = class Encoder
	{
		// Create a new Encoder object
		constructor(indent=null)
		{
			this.indent = indent;
			this.data = [];
			this._level = 0;
			this._strings2index = {};
			this._ids2index = {};
			this._backrefs = 0;
		}

		_line(line, ...args)
		{
			if (this.indent !== null)
			{
				for (let i = 0; i < this._level; ++i)
					this.data.push(this.indent);
			}
			else
			{
				if (this.data.length)
					this.data.push(" ");
			}
			this.data.push(line);

			if (args.length)
			{
				let oldindent = this.indent;
				this.indent = null;
				for (let i = 0; i < args.length; ++i)
					this.dump(args[i]);
				this.indent = oldindent;
			}

			if (this.indent !== null)
				this.data.push("\n");
		}

		// Return the complete string written to the buffer
		finish()
		{
			return this.data.join("");
		}

		dump(obj)
		{
			if (obj === null)
				this._line("n");
			else if (typeof(obj) == "boolean")
				this._line(obj ? "bT" : "bF");
			else if (typeof(obj) == "number")
			{
				let type = (Math.round(obj) == obj) ? "i" : "f";
				this._line(type + obj);
			}
			else if (typeof(obj) == "string")
			{
				let index = this._strings2index[obj];
				if (typeof(index) !== "undefined")
				{
					this._line("^" + index);
				}
				else
				{
					this._strings2index[obj] = this._backrefs++;
					let dump = ul4._str_repr(obj).replace("<", "\\x3c");
					this._line("S" + dump);
				}
			}
			else if (ul4._iscolor(obj))
				this._line("c", obj.r(), obj.g(), obj.b(), obj.a());
			else if (ul4._isdate(obj))
				this._line("x", obj.year(), obj.month(), obj.day());
			else if (ul4._isdatetime(obj))
				this._line("z", obj.getFullYear(), obj.getMonth()+1, obj.getDate(), obj.getHours(), obj.getMinutes(), obj.getSeconds(), obj.getMilliseconds() * 1000);
			else if (ul4._istimedelta(obj))
				this._line("t", obj.days(), obj.seconds(), obj.microseconds());
			else if (ul4._ismonthdelta(obj))
				this._line("m", obj.months());
			else if (obj instanceof ul4.slice)
				this._line("r", obj.start, obj.stop);
			else if (obj.ul4onname && obj.ul4ondump)
			{
				if (obj.__id__)
				{
					let index = this._ids2index[obj.__id__];
					if (typeof(index) != "undefined")
					{
						this._line("^" + index);
						return;
					}
					this._ids2index[obj.__id__] = this._backrefs++;
				}
				this._line("O", obj.ul4onname);
				++this._level;
				obj.ul4ondump(this);
				--this._level;
				this._line(")");
			}
			else if (ul4._islist(obj))
			{
				this._line("l");
				++this._level;
				for (let i = 0; i < obj.length; ++i)
					this.dump(obj[i]);
				--this._level;
				this._line("]");
			}
			else if (ul4._ismap(obj))
			{
				this._line("e");
				++this._level;
				obj.forEach(function(value, key) {
					this.dump(key);
					this.dump(value);
				}, this);
				--this._level;
				this._line("}");
			}
			else if (ul4._isdict(obj))
			{
				this._line("d");
				++this._level;
				for (let key in obj)
				{
					this.dump(key);
					this.dump(obj[key]);
				}
				--this._level;
				this._line("}");
			}
			else if (ul4._isset(obj))
			{
				this._line("y");
				++this._level;
				obj.forEach(function(value) {
					this.dump(value);
				}, this);
				--this._level;
				this._line("}");
			}
			else
				throw new ul4.ValueError("can't create UL4ON dump of object " + ul4._repr(obj));
		}
	};

	// Helper class for decoding
	ul4.Decoder = class Decoder
	{
		// Creates a new decoder for reading from the string ``data``
		constructor(data, registry)
		{
			this.data = data;
			this.pos = 0;
			this.backrefs = [];
			this.registry = typeof(registry) === "undefined" ? null : registry;
			this.stack = []; // Use for informative error messages
		}

		// Read a character from the buffer
		readchar()
		{
			if (this.pos >= this.data.length)
				throw new ul4.ValueError("UL4 decoder at EOF");
			return this.data.charAt(this.pos++);
		}

		// Read a character from the buffer (return null on eof)
		readcharoreof()
		{
			if (this.pos >= this.data.length)
				return null;
			return this.data.charAt(this.pos++);
		}

		// Read next not-whitespace character from the buffer
		readblackchar()
		{
			let re_white = /\s/;

			for (;;)
			{
				if (this.pos >= this.data.length)
					throw new ul4.ValueError("UL4 decoder at EOF at position " + this.pos + " with path " + this.stack.join("/"));
				let c = this.data.charAt(this.pos++);
				if (!c.match(re_white))
					return c;
			}
		}

		// Read ``size`` characters from the buffer
		read(size)
		{
			if (this.pos+size > this.length)
				size = this.length-this.pos;
			let result = this.data.substring(this.pos, this.pos+size);
			this.pos += size;
			return result;
		}

		// "unread" one character
		backup()
		{
			--this.pos;
		}

		// Read a number from the buffer
		readnumber()
		{
			let re_digits = /[-+0123456789.eE]/, value = "";
			for (;;)
			{
				let c = this.readcharoreof();
				if (c !== null && c.match(re_digits))
					value += c;
				else
				{
					let result = parseFloat(value);
					if (isNaN(result))
						throw new ul4.ValueError("invalid number, got " + ul4._repr("value") + " at position " + this.pos + " with path " + this.stack.join("/"));
					return result;
				}
			}
		}

		_beginfakeloading()
		{
			let oldpos = this.backrefs.length;
			this.backrefs.push(null);
			return oldpos;
		}

		_endfakeloading(oldpos, value)
		{
			this.backrefs[oldpos] = value;
		}

		_readescape(escapechar, length)
		{
			let chars = this.read(length);
			if (chars.length != length)
				throw new ul4.ValueError("broken escape " + ul4._repr("\\" + escapechar + chars) + " at position " + this.pos + " with path " + this.stack.join("/"));
			let codepoint = parseInt(chars, 16);
			if (isNaN(codepoint))
				throw new ul4.ValueError("broken escape " + ul4._repr("\\" + escapechar + chars) + " at position " + this.pos + " with path " + this.stack.join("/"));
			return String.fromCharCode(codepoint);
		}

		// Load the next object from the buffer
		load()
		{
			let typecode = this.readblackchar();
			let result;
			switch (typecode)
			{
				case "^":
					return this.backrefs[this.readnumber()];
				case "n":
				case "N":
					if (typecode === "N")
						this.backrefs.push(null);
					return null;
				case "b":
				case "B":
					result = this.readchar();
					if (result === "T")
						result = true;
					else if (result === "F")
						result = false;
					else
						throw new ul4.ValueError("wrong value for boolean, expected 'T' or 'F', got " + ul4._repr(result) + " at position " + this.pos + " with path " + this.stack.join("/"));
					if (typecode === "B")
						this.backrefs.push(result);
					return result;
				case "i":
				case "I":
				case "f":
				case "F":
					result = this.readnumber();
					if (typecode === "I" || typecode === "F")
						this.backrefs.push(result);
					return result;
				case "s":
				case "S":
					result = [];
					let delimiter = this.readblackchar();
					for (;;)
					{
						let c = this.readchar();
						if (c == delimiter)
							break;
						if (c == "\\")
						{
							let c2 = this.readchar();
							if (c2 == "\\")
								result.push("\\");
							else if (c2 == "n")
								result.push("\n");
							else if (c2 == "r")
								result.push("\r");
							else if (c2 == "t")
								result.push("\t");
							else if (c2 == "f")
								result.push("\u000c");
							else if (c2 == "b")
								result.push("\u0008");
							else if (c2 == "a")
								result.push("\u0007");
							else if (c2 == "'")
								result.push("'");
							else if (c2 == '"')
								result.push('"');
							else if (c2 == "x")
								result.push(this._readescape("x", 2));
							else if (c2 == "u")
								result.push(this._readescape("u", 4));
							else if (c2 == "U")
								result.push(this._readescape("U", 8));
							else
								result.push("\\" + c2);
						}
						else
							result.push(c);
					}
					result = result.join("");
					if (typecode === "S")
						this.backrefs.push(result);
					return result;
				case "c":
				case "C":
					result = new ul4.Color();
					if (typecode === "C")
						this.backrefs.push(result);
					result._r = this.load();
					result._g = this.load();
					result._b = this.load();
					result._a = this.load();
					return result;
				case "x":
				case "X":
				{
					let year = this.load();
					let month = this.load();
					let day = this.load();
					result = new ul4.Date(year, month, day);
					if (typecode === "X")
						this.backrefs.push(result);
					return result;
				}
				case "z":
				case "Z":
					result = new Date();
					result.setFullYear(this.load());
					result.setDate(1);
					result.setMonth(this.load() - 1);
					result.setDate(this.load());
					result.setHours(this.load());
					result.setMinutes(this.load());
					result.setSeconds(this.load());
					result.setMilliseconds(this.load()/1000);
					if (typecode === "Z")
						this.backrefs.push(result);
					return result;
				case "t":
				case "T":
					result = new ul4.TimeDelta();
					result._days = this.load();
					result._seconds = this.load();
					result._microseconds = this.load();
					if (typecode === "T")
						this.backrefs.push(result);
					return result;
				case "r":
				case "R":
					result = new ul4.slice();
					if (typecode === "R")
						this.backrefs.push(result);
					result.start = this.load();
					result.stop = this.load();
					return result;
				case "m":
				case "M":
					result = new ul4.MonthDelta();
					if (typecode === "M")
						this.backrefs.push(result);
					result._months = this.load();
					return result;
				case "l":
				case "L":
					this.stack.push("list");
					result = [];
					if (typecode === "L")
						this.backrefs.push(result);
					for (;;)
					{
						typecode = this.readblackchar();
						if (typecode === "]")
							break;
						this.backup();
						result.push(this.load());
					}
					this.stack.pop();
					return result;
				case "d":
				case "D":
				case "e":
				case "E":
					if (!ul4._havemap && (typecode == "e" || typecode == "E"))
						throw new ul4.ValueError("ordered dictionaries are not supported at position " + this.pos + " with path " + this.stack.join("/"));
					result = ul4._emptymap();
					this.stack.push(typecode === "d" || typecode === "D" ? "dict" : "odict");
					if (typecode === "D" || typecode === "E")
						this.backrefs.push(result);
					for (;;)
					{
						typecode = this.readblackchar();
						if (typecode === "}")
							break;
						this.backup();
						let key = this.load();
						let value = this.load();
						ul4._setmap(result, key, value);
					}
					this.stack.pop();
					return result;
				case "y":
				case "Y":
					this.stack.push("set");
					result = ul4._makeset();
					if (typecode === "Y")
						this.backrefs.push(result);
					for (;;)
					{
						typecode = this.readblackchar();
						if (typecode === "}")
							break;
						this.backup();
						result.add(this.load());
					}
					this.stack.pop();
					return result;
				case "o":
				case "O":
				{
					let oldpos;
					if (typecode === "O")
						oldpos = this._beginfakeloading();
					let name = this.load();
					this.stack.push(name);
					let constructor;
					if (this.registry !== null)
					{
						constructor = this.registry[name];
						if (typeof(constructor) === "undefined")
							constructor = ul4._registry[name];
					}
					else
						constructor = ul4._registry[name];
					if (typeof(constructor) === "undefined")
						throw new ul4.ValueError("can't load object of type " + ul4._repr(name) + " at position " + this.pos + " with path " + this.stack.join("/"));
					result = new constructor();
					if (typecode === "O")
						this._endfakeloading(oldpos, result);
					result.ul4onload(this);
					typecode = this.readblackchar();
					if (typecode !== ")")
						throw new ul4.ValueError("object terminator ')' for object of type '" + name + "' expected, got " + ul4._repr(typecode) + " at position " + this.pos + " with path " + this.stack.join("/"));
					this.stack.pop();
					return result;
				}
				default:
					throw new ul4.ValueError("unknown typecode " + ul4._repr(typecode) + " at position " + this.pos + " with path " + this.stack.join("/"));
			}
		}

		// Return an iterator for loading the content of a object
		loadcontent()
		{
			let self = this;
			return {
				next: function()
				{
					let typecode = self.readblackchar();
					// Always "unread" the typecode even at the end
					// so that at the end of a call to ul4onload()
					// the next input is the "end of object" marker
					// no matter whether ul4onload() uses loadcontent() or not.
					self.backup();
					if (typecode == ")")
						return {done: true};
					else
						return {done: false, value: self.load()};
				}
			};
		}
	};

	//
	// UL4
	//

	// REs for parsing JSON
	ul4._rvalidchars = /^[\],:{}\s]*$/;
	ul4._rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	ul4._rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	ul4._rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

	/// Helper functions

	// Clone an object and extend it
	ul4._inherit = function _inherit(baseobj, attrs)
	{
		return Object.assign(Object.create(baseobj), attrs);
	};

	// Convert a map to an object
	ul4._map2object = function _map2object(obj)
	{
		if (ul4._ismap(obj))
		{
			let newobj = {};
			obj.forEach(function(value, key){
				if (typeof(key) !== "string")
					throw new ul4.TypeError("keys must be strings");
				newobj[key] = value;
			});
			return newobj;
		}
		return obj;
	};

	// Clip a number to the range [0;max)
	ul4._bound = function _bound(value, upper)
	{
		if (value < 0)
			return 0;
		else if (value > upper)
			return upper;
		else
			return value;
	};

	// Create a pretty stacktrace from an exception
	ul4._stacktrace = function _stacktrace(exc)
	{
		let output = (exc instanceof ul4.Exception ? exc.constructor.name + ": " : "") + exc.toString();
		if (exc.context)
			output = ul4._stacktrace(exc.context) + "\n\n" + output;
		return output;
	};

	// Call a function ``f`` with UL4 argument handling
	ul4._internal_call = function _internal_call(context, f, name, functioncontext, signature, needscontext, needsobject, args, kwargs)
	{
		let finalargs;
		if (needsobject)
		{
			if (signature === null)
			{
				if (args.length)
					throw new ul4.ArgumentError(ul4._repr(f) + " doesn't support positional arguments!");
				finalargs = [kwargs];
			}
			else
				finalargs = [signature.bindObject(name, args, kwargs)];
		}
		else
		{
			if (signature === null)
				throw new ul4.ArgumentError(ul4._repr(f) + " doesn't support positional arguments!");
			finalargs = signature.bindArray(name, args, kwargs);
		}
		if (needscontext)
			finalargs.unshift(context);
		return f.apply(functioncontext, finalargs);
	};

	ul4._callfunction = function _callfunction(context, f, args, kwargs)
	{
		let name = f._ul4_name || f.name;
		if (typeof(f._ul4_signature) === "undefined" || typeof(f._ul4_needsobject) === "undefined" || typeof(f._ul4_needscontext) === "undefined")
			throw new ul4.TypeError(ul4._repr(f) + " is not callable by UL4");
		return ul4._internal_call(context, f, name, ul4, f._ul4_signature, f._ul4_needscontext, f._ul4_needsobject, args, kwargs);
	};

	ul4._callobject = function _callobject(context, obj, args, kwargs)
	{
		if (typeof(obj._ul4_callsignature) === "undefined" || typeof(obj._ul4_callneedsobject) === "undefined" || typeof(obj._ul4_callneedscontext) === "undefined")
			throw new ul4.TypeError(ul4._repr(obj) + " is not callable by UL4");
		return ul4._internal_call(context, obj.__call__, obj.name, obj, obj._ul4_callsignature, obj._ul4_callneedscontext, obj._ul4_callneedsobject, args, kwargs);
	};

	ul4._callrender = function _callrender(context, obj, args, kwargs)
	{
		if (typeof(obj._ul4_rendersignature) === "undefined" || typeof(obj._ul4_renderneedsobject) === "undefined" || typeof(obj._ul4_renderneedscontext) === "undefined")
			throw new ul4.TypeError(ul4._repr(obj) + " is not renderable by UL4");
		return ul4._internal_call(context, obj.__render__, obj.name, obj, obj._ul4_rendersignature, obj._ul4_renderneedscontext, obj._ul4_renderneedsobject, args, kwargs);
	};

	ul4._call = function _call(context, f, args, kwargs)
	{
		if (typeof(f) === "function")
			return ul4._callfunction(context, f, args, kwargs);
		else if (f && typeof(f.__call__) === "function")
			return ul4._callobject(context, f, args, kwargs);
		else
			throw new ul4.TypeError(ul4._type(f) + " is not callable");
	};

	ul4._unpackvar = function _unpackvar(lvalue, value)
	{
		if (!ul4._islist(lvalue))
			return [[lvalue, value]];
		else
		{
			let newvalue = [];
			let iter = ul4._iter(value);

			for (let i = 0;;++i)
			{
				let item = iter.next();

				if (item.done)
				{
					if (i === lvalue.length)
						break;
					else
						throw new ul4.ValueError("need " + lvalue.length + " value" + (lvalue.length === 1 ? "" : "s") + " to unpack, got " + i);
				}
				else
				{
					if (i < lvalue.length)
						newvalue = newvalue.concat(ul4._unpackvar(lvalue[i], item.value));
					else
						throw new ul4.ValueError("too many values to unpack (expected " + lvalue.length + ")");
				}
			}
			return newvalue;
		}
	};

	ul4._formatsource = function _formatsource(out)
	{
		let finalout = [];
		let level = 0, needlf = false;
		for (let i = 0; i < out.length; ++i)
		{
			let part = out[i];
			if (typeof(part) === "number")
			{
				level += part;
				needlf = true;
			}
			else
			{
				if (needlf)
				{
					finalout.push("\n");
					for (let j = 0; j < level; ++j)
						finalout.push("\t");
					needlf = false;
				}
				finalout.push(part);
			}
		}
		if (needlf)
			finalout.push("\n");
		return finalout.join("");
	};

	// Compare ``obj1`` and ``obj2`` if they have the same value
	ul4._eq = function _eq(obj1, obj2)
	{
		let numbertypes = ["boolean", "number"];

		if (obj1 && typeof(obj1.__eq__) === "function")
			return obj1.__eq__(obj2);
		else if (obj2 && typeof(obj2.__eq__) === "function")
			return obj2.__eq__(obj1);
		else if (obj1 === null)
			return obj2 === null;
		else if (numbertypes.indexOf(typeof(obj1)) != -1)
		{
			if (numbertypes.indexOf(typeof(obj2)) != -1)
				return obj1 == obj2;
			else
				return false;
		}
		else if (typeof(obj1) === "string")
		{
			if (typeof(obj2) === "string")
				return obj1 == obj2;
			else
				return false;
		}
		else if (ul4._isdatetime(obj1))
		{
			if (ul4._isdatetime(obj2))
				return obj1.getTime() == obj2.getTime();
			else
				return false;
		}
		else if (ul4._islist(obj1))
		{
			if (ul4._islist(obj2))
			{
				// Shortcut, if it's the same object
				if (obj1 === obj2)
					return true;
				if (obj1.length != obj2.length)
					return false;
				for (let i = 0; i < obj1.length; ++i)
				{
					if (!ul4._eq(obj1[i], obj2[i])) // This might lead to infinite recursion and a stackoverflow, but it does in all implementations
						return false;
				}
				return true;
			}
			else
				return false;
		}
		else if (ul4._isobject(obj1))
		{
			if (ul4._isobject(obj2))
			{
				// Shortcut, if it's the same object
				if (obj1 === obj2)
					return true;
				// Test that each attribute of ``obj1`` can also be found in ``obj2`` and has the same value
				for (let key in obj1)
				{
					if (obj2.hasOwnProperty(key))
					{
						if (!ul4._eq(obj1[key], obj2[key]))
							return false;
					}
					else
						return false;
				}
				// Test that each attribute of ``obj2`` is also in ``obj1`` (the value has been tested before)
				for (let key in obj2)
				{
					if (!obj1.hasOwnProperty(key))
						return false;
				}
				return true;
			}
			else if (ul4._ismap(obj2))
			{
				// Test that each attribute of ``obj1`` can also be found in ``obj2`` and has the same value
				for (let key in obj1)
				{
					if (obj2.has(key))
					{
						if (!ul4._eq(obj1[key], obj2.get(key)))
							return false;
					}
					else
						return false;
				}
				// Test that each attribute of ``obj2`` is also in ``obj1`` (the value has been tested before)
				let result = true;
				obj2.forEach(function(value, key) {
					if (!obj1.hasOwnProperty(key))
						result = false;
				}, this);
				return result;
			}
			else
				return false;
		}
		else if (ul4._ismap(obj1))
		{
			if (ul4._isobject(obj2))
			{
				// Test that each attribute of ``obj1`` can also be found in ``obj2`` and has the same value
				obj1.forEach(function(value, key) {
					if (!obj2.hasOwnProperty(key))
						return false;
					else if (!ul4._eq(obj1.get(key), obj2[key]))
						return false;
				}, this);
				// Test that each attribute of ``obj2`` is also in ``obj1`` (the value has been tested before)
				for (let key in obj2)
				{
					if (!obj1.has(key))
						return false;
				}
				return true;
			}
			else if (ul4._ismap(obj2))
			{
				// Shortcut, if it's the same object
				if (obj1 === obj2)
					return true;
				if (obj1.size != obj2.size)
					return false;
				let result = true;
				// Test that each attribute of ``obj1`` can also be found in ``obj2`` and has the same value
				obj1.forEach(function(value, key) {
					if (!obj2.has(key))
						result = false;
					else if (!ul4._eq(obj1.get(key), obj2.get(key)))
						result = false;
				});
				return result;
			}
			else
				return false;
		}
		else if (ul4._isset(obj1))
		{
			// We don't have to test for ``ul4._Set`` as ``ul4._Set`` implements ``__eq__``
			if (ul4._isset(obj2))
			{
				// Shortcut, if it's the same object
				if (obj1 === obj2)
					return true;
				if (obj1.size != obj2.size)
					return false;
				let result = true;
				obj1.forEach(function(value) {
					if (!obj2.has(value))
						result = false;
				});
				return result;
			}
			else
				return false;
		}
		else
			return obj1 === obj2;
	};

	// Compare ``obj1`` and ``obj2`` if they don't have the same value
	ul4._ne = function _ne(obj1, obj2)
	{
		if (obj1 && typeof(obj1.__ne__) === "function")
			return obj1.__ne__(obj2);
		else if (obj2 && typeof(obj2.__ne__) === "function")
			return obj2.__ne__(obj1);
		else
			return !ul4._eq(obj1, obj2);
	};

	ul4._unorderable = function _unorderable(operator, obj1, obj2)
	{
		throw new ul4.TypeError("unorderable types: " + ul4._type(obj1) + " " + operator + " " + ul4._type(obj2));
	};

	// Return:
	// -1 when ``obj1 < obj2``,
	//  0 when ``obj1 == obj2``,
	//  1 when ``obj1 > obj2``,
	//  null when ``obj1`` and ``obj2`` are comparable, but neither of the previous cases holds (only for sets)
	// raise TypeError if objects are uncomparable
	// This the purpose of ``_cmp`` is to support implementation of <, <=, > and >=
	// and dicts/maps are not comparable with the operator ``_cmp`` does not support dicts/maps

	ul4._cmp = function _cmp(operator, obj1, obj2)
	{
		let numbertypes = ["boolean", "number"];

		if (numbertypes.indexOf(typeof(obj1)) != -1)
		{
			if (numbertypes.indexOf(typeof(obj2)) != -1)
				return (obj1 > obj2) - (obj1 < obj2);
		}
		else if (typeof(obj1) === "string")
		{
			if (typeof(obj2) === "string")
				return (obj1 > obj2) - (obj1 < obj2);
		}
		else if (ul4._isdatetime(obj1))
		{
			if (ul4._isdatetime(obj2))
			{
				let v1 = obj1.getTime(), v2 = obj2.getTime();
				return (v1 > v2) - (v1 < v2);
			}
		}
		else if (ul4._islist(obj1))
		{
			if (ul4._islist(obj2))
			{
				if (obj1 === obj2)
					return 0;
				for (let i = 0; i < obj1.length; ++i)
				{
					if (i >= obj2.length)
						return 1;
					let res = ul4._cmp(operator, obj1[i], obj2[i]);
					if (res)
						return res;
				}
				return obj2.length > obj1.length ? -1 : 0;
			}
		}
		else if (ul4._isset(obj1) || ul4._isul4set(obj1))
		{
			if (ul4._isset(obj2) || ul4._isul4set(obj2))
			{
				let in1only = false;
				let in2only = false;

				for (let iter = _iter(obj1);;)
				{
					let item = iter.next();
					if (item.done)
						break;
					if (!obj2.has(item.value))
					{
						in1only = true;
						break;
					}
				}
				for (let iter = _iter(obj2);;)
				{
					let item = iter.next();
					if (item.done)
						break;
					if (!obj1.has(item.value))
					{
						in2only = true;
						break;
					}
				}

				if (in1only)
				{
					if (in2only)
						return null;
					else
						return 1;
				}
				else
				{
					if (in2only)
						return -1;
					else
						return 0;
				}
			}
		}
		return ul4._unorderable(operator, obj1, obj2);
	};

	// Return whether ``obj1 < obj2``
	ul4._lt = function _lt(obj1, obj2)
	{
		let numbertypes = ["boolean", "number"];

		if (obj1 && typeof(obj1.__lt__) === "function")
			return obj1.__lt__(obj2);
		else if (numbertypes.indexOf(typeof(obj1)) != -1)
		{
			if (numbertypes.indexOf(typeof(obj2)) != -1)
				return obj1 < obj2;
		}
		else if (typeof(obj1) === "string")
		{
			if (typeof(obj2) === "string")
				return obj1 < obj2;
		}
		else if (ul4._isdatetime(obj1))
		{
			if (ul4._isdatetime(obj2))
				return obj1.getTime() < obj2.getTime();
		}
		else if (ul4._islist(obj1))
		{
			if (ul4._islist(obj2))
			{
				if (obj1 === obj2)
					return false;
				for (let i = 0; i < obj1.length; ++i)
				{
					if (i >= obj2.length)
						return false;
					let eq = ul4._eq(obj1[i], obj2[i]);
					if (!eq)
						return ul4._lt(obj1[i], obj2[i]);
				}
				return obj1.length < obj2.length;
			}
		}
		// FIXME: Set comparison
		else if (ul4._isset(obj1))
		{
			if (ul4._isset(obj2))
			{
				if (ul4._isset(obj2))
				{
					for (let key in obj1)
					{
						if (!obj2.has(obj1[key]))
							in1only = true;
					}
					for (let key in obj2)
					{
						if (!obj1.has(obj2[key]))
							in2only = true;
					}
				}
				else if (ul4._isul4set(obj2))
				{
					for (let key in obj1)
					{
						if (!obj2.items[obj1[key]])
							in1only = true;
					}
					for (let value in obj2.items)
					{
						if (!obj1.has(value))
						{
							in2only = true;
							break;
						}
					}
				}
			}
			else if (ul4._isul4set(obj2))
			{
				if (ul4._isset(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.has(value))
						{
							in1only = true;
							break;
						}
					}
					for (let key in obj2)
					{
						if (!obj1.items[obj2[key]])
							in2only = true;
					}
				}
				else if (ul4._isul4set(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.items[value])
						{
							in1only = true;
							break;
						}
					}
					for (let value in obj2.items)
					{
						if (!obj1.items[value])
						{
							in2only = true;
							break;
						}
					}
				}
			}
			else
				ul4._unorderable(operator, obj1, obj2);

			if (in1only)
			{
				if (in2only)
					return null;
				else
					return 1;
			}
			else
			{
				if (in2only)
					return -1;
				else
					return 0;
			}
		}
		ul4._unorderable("<", obj1, obj2);
	};

	// Return whether ``obj1 <= obj2``
	ul4._le = function _le(obj1, obj2)
	{
		let numbertypes = ["boolean", "number"];

		if (obj1 && typeof(obj1.__le__) === "function")
			return obj1.__le__(obj2);
		if (numbertypes.indexOf(typeof(obj1)) != -1)
		{
			if (numbertypes.indexOf(typeof(obj2)) != -1)
				return obj1 <= obj2;
		}
		else if (typeof(obj1) === "string")
		{
			if (typeof(obj2) === "string")
				return obj1 <= obj2;
		}
		else if (ul4._isdatetime(obj1))
		{
			if (ul4._isdatetime(obj2))
				return obj1.getTime() <= obj2.getTime();
		}
		else if (ul4._islist(obj1))
		{
			if (ul4._islist(obj2))
			{
				if (obj1 === obj2)
					return true;
				for (let i = 0; i < obj1.length; ++i)
				{
					if (i >= obj2.length)
						return false;
					let eq = ul4._eq(obj1[i], obj2[i]);
					if (!eq)
						return ul4._lt(obj1[i], obj2[i]);
				}
				return obj1.length <= obj2.length;
			}
		}
		// FIXME: Set comparison
		else if (ul4._isset(obj1) || ul4._isul4set(obj1))
		{
			let in1only = false;
			let in2only = false;

			if (ul4._isset(obj2))
			{
				if (ul4._isset(obj2))
				{
					obj1.forEach(function(value) {
						if (!obj2.has(value))
							in1only = true;
					});
					obj2.forEach(function(value) {
						if (!obj1.has(value))
							in2only = true;
					});
				}
				else if (ul4._isul4set(obj2))
				{
					obj1.forEach(function(value) {
						if (!obj2.items[value])
							in1only = true;
					});
					for (let value in obj2.items)
					{
						if (!obj1.has(value))
						{
							in2only = true;
							break;
						}
					}
				}
			}
			else if (ul4._isul4set(obj2))
			{
				if (ul4._isset(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.has(value))
						{
							in1only = true;
							break;
						}
					}
					obj2.forEach(function(value) {
						if (!obj1.items[value])
							in2only = true;
					});
				}
				else if (ul4._isul4set(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.items[value])
						{
							in1only = true;
							break;
						}
					}
					for (let value in obj2.items)
					{
						if (!obj1.items[value])
						{
							in2only = true;
							break;
						}
					}
				}
			}
			else
				ul4._unorderable(operator, obj1, obj2);

			if (in1only)
			{
				if (in2only)
					return null;
				else
					return 1;
			}
			else
			{
				if (in2only)
					return -1;
				else
					return 0;
			}
		}
		ul4._unorderable("<=", obj1, obj2);
	};

	// Return whether ``obj1 > obj2``
	ul4._gt = function _gt(obj1, obj2)
	{
		let numbertypes = ["boolean", "number"];

		if (obj1 && typeof(obj1.__gt__) === "function")
			return obj1.__gt__(obj2);
		if (numbertypes.indexOf(typeof(obj1)) != -1)
		{
			if (numbertypes.indexOf(typeof(obj2)) != -1)
				return obj1 > obj2;
		}
		else if (typeof(obj1) === "string")
		{
			if (typeof(obj2) === "string")
				return obj1 > obj2;
		}
		else if (ul4._isdatetime(obj1))
		{
			if (ul4._isdatetime(obj2))
				return obj1.getTime() > obj2.getTime();
		}
		else if (ul4._islist(obj1))
		{
			if (ul4._islist(obj2))
			{
				if (obj1 === obj2)
					return false;
				for (let i = 0; i < obj1.length; ++i)
				{
					if (i >= obj2.length)
						return true;
					let eq = ul4._eq(obj1[i], obj2[i]);
					if (!eq)
						return ul4._gt(obj1[i], obj2[i]);
				}
				return obj1.length > obj2.length;
			}
		}
		// FIXME: Set comparison
		else if (ul4._isset(obj1) || ul4._isul4set(obj1))
		{
			let in1only = false;
			let in2only = false;

			if (ul4._isset(obj2))
			{
				if (ul4._isset(obj2))
				{
					obj1.forEach(function(value) {
						if (!obj2.has(value))
							in1only = true;
					});
					obj2.forEach(function(value) {
						if (!obj1.has(value))
							in2only = true;
					});
				}
				else if (ul4._isul4set(obj2))
				{
					obj1.forEach(function(value) {
						if (!obj2.items[value])
							in1only = true;
					});
					obj2.forEach(function(value) {
						if (!obj1.has(value))
						{
							in2only = true;
						}
					});
				}
			}
			else if (ul4._isul4set(obj2))
			{
				if (ul4._isset(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.has(value))
						{
							in1only = true;
							break;
						}
					}
					obj2.forEach(function(value) {
						if (!obj1.items[value])
							in2only = true;
					});
				}
				else if (ul4._isul4set(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.items[value])
						{
							in1only = true;
							break;
						}
					}
					for (let value in obj2.items)
					{
						if (!obj1.items[value])
						{
							in2only = true;
							break;
						}
					}
				}
			}
			else
				ul4._unorderable(operator, obj1, obj2);

			if (in1only)
			{
				if (in2only)
					return null;
				else
					return 1;
			}
			else
			{
				if (in2only)
					return -1;
				else
					return 0;
			}
		}
		ul4._unorderable(">", obj1, obj2);
	};

	// Return whether ``obj1 >= obj2``
	ul4._ge = function _ge(obj1, obj2)
	{
		let numbertypes = ["boolean", "number"];

		if (obj1 && typeof(obj1.__ge__) === "function")
			return obj1.__ge__(obj2);
		else if (numbertypes.indexOf(typeof(obj1)) != -1)
		{
			if (numbertypes.indexOf(typeof(obj2)) != -1)
				return obj1 >= obj2;
		}
		else if (typeof(obj1) === "string")
		{
			if (typeof(obj2) === "string")
				return obj1 >= obj2;
		}
		else if (ul4._isdatetime(obj1))
		{
			if (ul4._isdatetime(obj2))
				return obj1.getTime() >= obj2.getTime();
		}
		else if (ul4._islist(obj1))
		{
			if (ul4._islist(obj2))
			{
				if (obj1 === obj2)
					return true;
				for (let i = 0; i < obj1.length; ++i)
				{
					if (i >= obj2.length)
						return true;
					let eq = ul4._eq(obj1[i], obj2[i]);
					if (!eq)
						return ul4._gt(obj1[i], obj2[i]);
				}
				return obj1.length >= obj2.length;
			}
		}
		// FIXME: Set comparison
		else if (ul4._isset(obj1) || ul4._isul4set(obj1))
		{
			let in1only = false;
			let in2only = false;

			if (ul4._isset(obj2))
			{
				if (ul4._isset(obj2))
				{
					obj1.forEach(function(value) {
						if (!obj2.has(value))
							in1only = true;
					});
					obj2.forEach(function(value) {
						if (!obj1.has(value))
							in2only = true;
					});
				}
				else if (ul4._isul4set(obj2))
				{
					obj1.forEach(function(value) {
						if (!obj2.items[value])
							in1only = true;
					});
					for (let value in obj2.items)
					{
						if (!obj1.has(value))
						{
							in2only = true;
							break;
						}
					}
				}
			}
			else if (ul4._isul4set(obj2))
			{
				if (ul4._isset(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.has(value))
						{
							in1only = true;
							break;
						}
					}
					obj2.forEach(function(value, key) {
						if (!obj1.items[value])
							in2only = true;
					});
				}
				else if (ul4._isul4set(obj2))
				{
					for (let value in obj1.items)
					{
						if (!obj2.items[value])
						{
							in1only = true;
							break;
						}
					}
					for (let value in obj2.items)
					{
						if (!obj1.items[value])
						{
							in2only = true;
							break;
						}
					}
				}
			}
			else
				ul4._unorderable(operator, obj1, obj2);

			if (in1only)
			{
				if (in2only)
					return null;
				else
					return 1;
			}
			else
			{
				if (in2only)
					return -1;
				else
					return 0;
			}
		}
		ul4._unorderable(">=", obj1, obj2);
	};

	// Return an iterator for ``obj``
	ul4._iter = function _iter(obj)
	{
		if (typeof(obj) === "string" || ul4._islist(obj))
		{
			return {
				index: 0,
				next: function()
				{
					if (this.index < obj.length)
						return {value: obj[this.index++], done: false};
					else
						return {done: true};
				}
			};
		}
		else if (ul4._isiter(obj))
			return obj;
		else if (obj !== null && typeof(obj.__iter__) === "function")
			return obj.__iter__();
		else if (ul4._ismap(obj))
		{
			let keys = [];
			obj.forEach(function(value, key) {
				keys.push(key);
			});
			return {
				index: 0,
				next: function()
				{
					if (this.index >= keys.length)
						return {done: true};
					return {value: keys[this.index++], done: false};
				}
			};
		}
		else if (ul4._isset(obj))
		{
			let values = [];
			obj.forEach(function(item) {
				values.push(item);
			});
			return {
				index: 0,
				next: function()
				{
					if (this.index >= values.length)
						return {done: true};
					return {value: values[this.index++], done: false};
				}
			};
		}
		else if (ul4._isul4set(obj))
		{
			return ul4._iter(obj.items);
		}
		else if (ul4._isobject(obj))
		{
			let keys = [];
			for (let key in obj)
				keys.push(key);
			return {
				index: 0,
				next: function()
				{
					if (this.index >= keys.length)
						return {done: true};
					return {value: keys[this.index++], done: false};
				}
			};
		}
		throw new ul4.TypeError(ul4._type(obj) + " object is not iterable");
	};

	ul4._str_repr = function _str_repr(str, ascii)
	{
		let result = "";
		let squote = false, dquote = false;

		for (let i = 0; i < str.length; ++i)
		{
			let c = str[i];
			if (c == '"')
			{
				dquote = true;
				if (squote)
					break;
			}
			else if (c == "'")
			{
				squote = true;
				if (dquote)
					break;
			}
		}

		// Prefer single quotes: Only use double quotes if the string contains single quotes, but no double quotes
		let quote = (squote && !dquote) ? '"' : "'";

		for (let i = 0; i < str.length; ++i)
		{
			let c = str[i];
			switch (c)
			{
				case '"':
					result += (quote == c) ? '\\"' : c;
					break;
				case "'":
					result += (quote == c) ? "\\'" : c;
					break;
				case "\\":
					result += "\\\\";
					break;
				case "\t":
					result += "\\t";
					break;
				case "\n":
					result += "\\n";
					break;
				case "\r":
					result += "\\r";
					break;
				default:
					let code = c.charCodeAt(0);
					let escape;
					if (code < 32)
						escape = 2;
					else if (code < 0x7f)
						escape = 0;
					else if (!ascii && !/[\u007f-\u00a0\u00ad\u0378-\u0379\u0380-\u0383\u038b\u038d\u03a2\u0530\u0557-\u0558\u0560\u0588\u058b-\u058c\u0590\u05c8-\u05cf\u05eb-\u05ef\u05f5-\u0605\u061c-\u061d\u06dd\u070e-\u070f\u074b-\u074c\u07b2-\u07bf\u07fb-\u07ff\u082e-\u082f\u083f\u085c-\u085d\u085f-\u089f\u08b5-\u08e2\u0984\u098d-\u098e\u0991-\u0992\u09a9\u09b1\u09b3-\u09b5\u09ba-\u09bb\u09c5-\u09c6\u09c9-\u09ca\u09cf-\u09d6\u09d8-\u09db\u09de\u09e4-\u09e5\u09fc-\u0a00\u0a04\u0a0b-\u0a0e\u0a11-\u0a12\u0a29\u0a31\u0a34\u0a37\u0a3a-\u0a3b\u0a3d\u0a43-\u0a46\u0a49-\u0a4a\u0a4e-\u0a50\u0a52-\u0a58\u0a5d\u0a5f-\u0a65\u0a76-\u0a80\u0a84\u0a8e\u0a92\u0aa9\u0ab1\u0ab4\u0aba-\u0abb\u0ac6\u0aca\u0ace-\u0acf\u0ad1-\u0adf\u0ae4-\u0ae5\u0af2-\u0af8\u0afa-\u0b00\u0b04\u0b0d-\u0b0e\u0b11-\u0b12\u0b29\u0b31\u0b34\u0b3a-\u0b3b\u0b45-\u0b46\u0b49-\u0b4a\u0b4e-\u0b55\u0b58-\u0b5b\u0b5e\u0b64-\u0b65\u0b78-\u0b81\u0b84\u0b8b-\u0b8d\u0b91\u0b96-\u0b98\u0b9b\u0b9d\u0ba0-\u0ba2\u0ba5-\u0ba7\u0bab-\u0bad\u0bba-\u0bbd\u0bc3-\u0bc5\u0bc9\u0bce-\u0bcf\u0bd1-\u0bd6\u0bd8-\u0be5\u0bfb-\u0bff\u0c04\u0c0d\u0c11\u0c29\u0c3a-\u0c3c\u0c45\u0c49\u0c4e-\u0c54\u0c57\u0c5b-\u0c5f\u0c64-\u0c65\u0c70-\u0c77\u0c80\u0c84\u0c8d\u0c91\u0ca9\u0cb4\u0cba-\u0cbb\u0cc5\u0cc9\u0cce-\u0cd4\u0cd7-\u0cdd\u0cdf\u0ce4-\u0ce5\u0cf0\u0cf3-\u0d00\u0d04\u0d0d\u0d11\u0d3b-\u0d3c\u0d45\u0d49\u0d4f-\u0d56\u0d58-\u0d5e\u0d64-\u0d65\u0d76-\u0d78\u0d80-\u0d81\u0d84\u0d97-\u0d99\u0db2\u0dbc\u0dbe-\u0dbf\u0dc7-\u0dc9\u0dcb-\u0dce\u0dd5\u0dd7\u0de0-\u0de5\u0df0-\u0df1\u0df5-\u0e00\u0e3b-\u0e3e\u0e5c-\u0e80\u0e83\u0e85-\u0e86\u0e89\u0e8b-\u0e8c\u0e8e-\u0e93\u0e98\u0ea0\u0ea4\u0ea6\u0ea8-\u0ea9\u0eac\u0eba\u0ebe-\u0ebf\u0ec5\u0ec7\u0ece-\u0ecf\u0eda-\u0edb\u0ee0-\u0eff\u0f48\u0f6d-\u0f70\u0f98\u0fbd\u0fcd\u0fdb-\u0fff\u10c6\u10c8-\u10cc\u10ce-\u10cf\u1249\u124e-\u124f\u1257\u1259\u125e-\u125f\u1289\u128e-\u128f\u12b1\u12b6-\u12b7\u12bf\u12c1\u12c6-\u12c7\u12d7\u1311\u1316-\u1317\u135b-\u135c\u137d-\u137f\u139a-\u139f\u13f6-\u13f7\u13fe-\u13ff\u1680\u169d-\u169f\u16f9-\u16ff\u170d\u1715-\u171f\u1737-\u173f\u1754-\u175f\u176d\u1771\u1774-\u177f\u17de-\u17df\u17ea-\u17ef\u17fa-\u17ff\u180e-\u180f\u181a-\u181f\u1878-\u187f\u18ab-\u18af\u18f6-\u18ff\u191f\u192c-\u192f\u193c-\u193f\u1941-\u1943\u196e-\u196f\u1975-\u197f\u19ac-\u19af\u19ca-\u19cf\u19db-\u19dd\u1a1c-\u1a1d\u1a5f\u1a7d-\u1a7e\u1a8a-\u1a8f\u1a9a-\u1a9f\u1aae-\u1aaf\u1abf-\u1aff\u1b4c-\u1b4f\u1b7d-\u1b7f\u1bf4-\u1bfb\u1c38-\u1c3a\u1c4a-\u1c4c\u1c80-\u1cbf\u1cc8-\u1ccf\u1cf7\u1cfa-\u1cff\u1df6-\u1dfb\u1f16-\u1f17\u1f1e-\u1f1f\u1f46-\u1f47\u1f4e-\u1f4f\u1f58\u1f5a\u1f5c\u1f5e\u1f7e-\u1f7f\u1fb5\u1fc5\u1fd4-\u1fd5\u1fdc\u1ff0-\u1ff1\u1ff5\u1fff-\u200f\u2028-\u202f\u205f-\u206f\u2072-\u2073\u208f\u209d-\u209f\u20bf-\u20cf\u20f1-\u20ff\u218c-\u218f\u23fb-\u23ff\u2427-\u243f\u244b-\u245f\u2b74-\u2b75\u2b96-\u2b97\u2bba-\u2bbc\u2bc9\u2bd2-\u2beb\u2bf0-\u2bff\u2c2f\u2c5f\u2cf4-\u2cf8\u2d26\u2d28-\u2d2c\u2d2e-\u2d2f\u2d68-\u2d6e\u2d71-\u2d7e\u2d97-\u2d9f\u2da7\u2daf\u2db7\u2dbf\u2dc7\u2dcf\u2dd7\u2ddf\u2e43-\u2e7f\u2e9a\u2ef4-\u2eff\u2fd6-\u2fef\u2ffc-\u3000\u3040\u3097-\u3098\u3100-\u3104\u312e-\u3130\u318f\u31bb-\u31bf\u31e4-\u31ef\u321f\u32ff\u4db6-\u4dbf\u9fd6-\u9fff\ua48d-\ua48f\ua4c7-\ua4cf\ua62c-\ua63f\ua6f8-\ua6ff\ua7ae-\ua7af\ua7b8-\ua7f6\ua82c-\ua82f\ua83a-\ua83f\ua878-\ua87f\ua8c5-\ua8cd\ua8da-\ua8df\ua8fe-\ua8ff\ua954-\ua95e\ua97d-\ua97f\ua9ce\ua9da-\ua9dd\ua9ff\uaa37-\uaa3f\uaa4e-\uaa4f\uaa5a-\uaa5b\uaac3-\uaada\uaaf7-\uab00\uab07-\uab08\uab0f-\uab10\uab17-\uab1f\uab27\uab2f\uab66-\uab6f\uabee-\uabef\uabfa-\uabff\ud7a4-\ud7af\ud7c7-\ud7ca\ud7fc-\uf8ff\ufa6e-\ufa6f\ufada-\ufaff\ufb07-\ufb12\ufb18-\ufb1c\ufb37\ufb3d\ufb3f\ufb42\ufb45\ufbc2-\ufbd2\ufd40-\ufd4f\ufd90-\ufd91\ufdc8-\ufdef\ufdfe-\ufdff\ufe1a-\ufe1f\ufe53\ufe67\ufe6c-\ufe6f\ufe75\ufefd-\uff00\uffbf-\uffc1\uffc8-\uffc9\uffd0-\uffd1\uffd8-\uffd9\uffdd-\uffdf\uffe7\uffef-\ufffb\ufffe-\uffff]/.test(c))
						escape = 0;
					else if (code <= 0xff)
						escape = 2;
					else if (code <= 0xffff)
						escape = 4;
					else
						escape = 8;

					if (escape === 0)
						result += c;
					else if (escape === 2)
						result += "\\x" + ul4._lpad(code.toString(16), "0", 2);
					else if (escape === 4)
						result += "\\u" + ul4._lpad(code.toString(16), "0", 4);
					else
						result += "\\U" + ul4._lpad(code.toString(16), "0", 8);
					break;
			}
		}
		return quote + result + quote;
	};

	ul4._date_repr = function _date_repr(obj, ascii)
	{
		let year = obj._date.getFullYear();
		let month = obj._date.getMonth()+1;
		let day = obj._date.getDate();
		let result = "@(" + year + "-" + ul4._lpad(month.toString(), "0", 2) + "-" + ul4._lpad(day.toString(), "0", 2) + ")";
		return result;
	};

	ul4._datetime_repr = function _datetime_repr(obj, ascii)
	{
		let year = obj.getFullYear();
		let month = obj.getMonth()+1;
		let day = obj.getDate();
		let hour = obj.getHours();
		let minute = obj.getMinutes();
		let second = obj.getSeconds();
		let ms = obj.getMilliseconds();
		let result = "@(" + year + "-" + ul4._lpad(month.toString(), "0", 2) + "-" + ul4._lpad(day.toString(), "0", 2) + "T";

		if (hour || minute || second || ms)
		{
			result += ul4._lpad(hour.toString(), "0", 2) + ":" + ul4._lpad(minute.toString(), "0", 2);
			if (second || ms)
			{
				result += ":" + ul4._lpad(second.toString(), "0", 2);
				if (ms)
					result += "." + ul4._lpad(ms.toString(), "0", 3) + "000";
			}
		}
		result += ")";

		return result;
	};

	ul4._map_repr = function _map_repr(obj, ascii)
	{
		let v = [];
		v.push("{");

		let i = 0;
		obj.forEach(function(value, key) {
			if (i++)
				v.push(", ");
			v.push(ul4._repr_internal(key, ascii));
			v.push(": ");
			v.push(ul4._repr_internal(value, ascii));
		});

		v.push("}");
		return v.join("");
	};

	ul4._list_repr = function _list_repr(obj, ascii)
	{
		let v = [];
		v.push("[");
		for (let i = 0; i < obj.length; ++i)
		{
			let item = obj[i];
			if (i)
				v.push(", ");
			v.push(ul4._repr_internal(item, ascii));
		}
		v.push("]");
		return v.join("");
	};

	ul4._set_repr = function _set_repr(obj, ascii)
	{
		let v = [];
		v.push("{");
		if (!obj.size)
			v.push("/");
		else
		{
			let i = 0;
			obj.forEach(function(value) {
				if (i++)
					v.push(", ");
				v.push(ul4._repr_internal(value, ascii));
			});
		}
		v.push("}");
		return v.join("");
	};

	ul4._object_repr = function _object_repr(obj, ascii)
	{
		let v = [];
		v.push("{");
		let i = 0;
		for (let key in obj)
		{
			if (!obj.hasOwnProperty(key))
				continue;
			if (i++)
				v.push(", ");
			v.push(ul4._repr_internal(key, ascii));
			v.push(": ");
			v.push(ul4._repr_internal(obj[key], ascii));
		}
		v.push("}");
		return v.join("");
	};

	ul4._repr_internal = function _repr_internal(obj, ascii)
	{
		if (obj === null)
			return "None";
		else if (obj === false)
			return "False";
		else if (obj === true)
			return "True";
		else if (typeof(obj) === "string")
			return ul4._str_repr(obj, ascii);
		else if (typeof(obj) === "number")
			return "" + obj;
		else if (typeof(obj) === "function")
			if (obj._ul4_name || obj.name)
				return "<function " + (obj._ul4_name || obj.name) + ">";
			else
				return "<anonymous function>";
		else if (ul4._isdate(obj))
			return ul4._date_repr(obj, ascii);
		else if (ul4._isdatetime(obj))
			return ul4._datetime_repr(obj, ascii);
		else if (typeof(obj) === "undefined")
			return "<undefined>";
		else if (typeof(obj) === "object" && typeof(obj.__repr__) === "function")
			return obj.__repr__();
		else if (ul4._islist(obj))
			return ul4._list_repr(obj, ascii);
		else if (ul4._ismap(obj))
			return ul4._map_repr(obj, ascii);
		else if (ul4._isset(obj))
			return ul4._set_repr(obj, ascii);
		else if (ul4._isobject(obj))
			return ul4._object_repr(obj, ascii);
		return "?";
	};

	// Return a string representation of ``obj``: If possible this should be an object literal supported by UL4, otherwise the output should be bracketed with ``<`` and ``>``
	ul4._repr = function _repr(obj)
	{
		return ul4._repr_internal(obj, false);
	};

	ul4._ascii = function _ascii(obj)
	{
		return ul4._repr_internal(obj, true);
	};

	ul4._date_str = function _date_str(obj)
	{
		let year = obj._date.getFullYear();
		let month = obj._date.getMonth()+1;
		let day = obj._date.getDate();

		return year + "-" + ul4._lpad(month.toString(), "0", 2) + "-" + ul4._lpad(day.toString(), "0", 2);
	};

	ul4._datetime_str = function _datetime_str(obj)
	{
		let year = obj.getFullYear();
		let month = obj.getMonth()+1;
		let day = obj.getDate();
		let hour = obj.getHours();
		let minute = obj.getMinutes();
		let second = obj.getSeconds();
		let ms = obj.getMilliseconds();

		let result = year + "-" + ul4._lpad(month.toString(), "0", 2) + "-" + ul4._lpad(day.toString(), "0", 2) + " " + ul4._lpad(hour.toString(), "0", 2) + ":" + ul4._lpad(minute.toString(), "0", 2);
		if (second || ms)
		{
			result += ":" + ul4._lpad(second.toString(), "0", 2);
			if (ms)
				result += "." + ul4._lpad(ms.toString(), "0", 3) + "000";
		}
		return result;
	};

	ul4._str = function _str(obj)
	{
		if (typeof(obj) === "undefined")
			return "";
		else if (obj === null)
			return "";
		else if (obj === false)
			return "False";
		else if (obj === true)
			return "True";
		else if (typeof(obj) === "string")
			return obj;
		else if (typeof(obj) === "number")
			return obj.toString();
		else if (ul4._isdate(obj))
			return ul4._date_str(obj);
		else if (ul4._isdatetime(obj))
			return ul4._datetime_str(obj);
		else if (ul4._islist(obj))
			return ul4._list_repr(obj);
		else if (ul4._isset(obj))
			return ul4._set_repr(obj);
		else if (ul4._ismap(obj))
			return ul4._map_repr(obj);
		else if (typeof(obj) === "object" && typeof(obj.__str__) === "function")
			return obj.__str__();
		else if (typeof(obj) === "object" && typeof(obj.__repr__) === "function")
			return obj.__repr__();
		else if (ul4._isobject(obj))
			return ul4._object_repr(obj);
		return "?";
	};

	// Convert ``obj`` to bool, according to its "truth value"
	ul4._bool = function _bool(obj)
	{
		if (typeof(obj) === "undefined" || obj === null || obj === false || obj === 0 || obj === "")
			return false;
		else
		{
			if (typeof(obj) === "object", typeof(obj.__bool__) === "function")
				return obj.__bool__();
			if (ul4._islist(obj))
				return obj.length !== 0;
			else if (ul4._ismap(obj) || ul4._isset(obj))
				return obj.size != 0;
			else if (ul4._isobject(obj))
			{
				for (let key in obj)
				{
					if (!obj.hasOwnProperty(key))
						continue;
					return true;
				}
				return false;
			}
			return true;
		}
	};

	// Convert ``obj`` to an integer (if ``base`` is given ``obj`` must be a string and ``base`` is the base for the conversion (default is 10))
	ul4._int = function _int(obj, base)
	{
		let result;
		if (base !== null)
		{
			if (typeof(obj) !== "string" || !ul4._isint(base))
				throw new ul4.TypeError("int() requires a string and an integer");
			result = parseInt(obj, base);
			if (result.toString() == "NaN")
				throw new ul4.TypeError("invalid literal for int()");
			return result;
		}
		else
		{
			if (typeof(obj) == "string")
			{
				result = parseInt(obj);
				if (result.toString() == "NaN")
				throw new ul4.TypeError("invalid literal for int()");
				return result;
			}
			else if (typeof(obj) == "number")
				return Math.floor(obj);
			else if (obj === true)
				return 1;
			else if (obj === false)
				return 0;
			throw new ul4.TypeError("int() argument must be a string or a number");
		}
	};

	// Convert ``obj`` to a float
	ul4._float = function _float(obj)
	{
		if (typeof(obj) === "string")
			return parseFloat(obj);
		else if (typeof(obj) === "number")
			return obj;
		else if (obj === true)
			return 1.0;
		else if (obj === false)
			return 0.0;
		throw new ul4.TypeError("float() argument must be a string or a number");
	};

	// Convert ``obj`` to a list
	ul4._list = function _list(obj)
	{
		let iter = ul4._iter(obj);

		let result = [];
		for (;;)
		{
			let value = iter.next();
			if (value.done)
				return result;
			result.push(value.value);
		}
	};

	// Convert ``obj`` to a set
	ul4._set = function _set(obj)
	{
		let iter = ul4._iter(obj);

		let result = ul4._emptyset();
		for (;;)
		{
			let value = iter.next();
			if (value.done)
				return result;
			result.add(value.value);
		}
	};

	// Return the length of ``sequence``
	ul4._len = function _len(sequence)
	{
		if (typeof(sequence) == "string" || ul4._islist(sequence))
			return sequence.length;
		else if (ul4._ismap(sequence) || ul4._isset(sequence))
			return sequence.size;
		else if (ul4._isobject(sequence))
		{
			let i = 0;
			for (let key in sequence)
				++i;
			return i;
		}
		throw new ul4.TypeError("object of type '" + ul4._type(sequence) + "' has no len()");
	};

	ul4._type = function _type(obj)
	{
		if (obj === null)
			return "none";
		else if (obj === false || obj === true)
			return "bool";
		else if (typeof(obj) === "undefined")
			return "undefined";
		else if (typeof(obj) === "number")
			return Math.round(obj) == obj ? "int" : "float";
		else if (typeof(obj) === "function")
			return "function";
		else
		{
			if (typeof(obj.ul4type) === "function")
				return obj.ul4type();
			else
				return ul4.Protocol.get(obj).ul4type(obj);
		}
	};

	// (this is non-trivial, because it follows the Python semantic of ``-5 % 2`` being ``1``)
	ul4._mod = function _mod(obj1, obj2)
	{
		let div = Math.floor(obj1 / obj2);
		let mod = obj1 - div * obj2;

		if (mod !== 0 && ((obj2 < 0 && mod > 0) || (obj2 > 0 && mod < 0)))
		{
			mod += obj2;
			--div;
		}
		return obj1 - div * obj2;
	},

	// Return the attribute with the name ``attrname`` of the object ``obj``
	// If ``obj`` doesn't have such an attribute, return ``default_``
	ul4._getattr = function _getattr(obj, attrname, default_=null)
	{
		let proto = ul4.Protocol.get(obj);
		try
		{
			return proto.getattr(obj, attrname);
		}
		catch (exc)
		{
			if (exc instanceof ul4.AttributeError && exc.obj === obj)
				return default_;
			else
				throw exc;
		}
	};

	// Return wether the object ``obj`` has an attribute with the name ``attrname``
	ul4._hasattr = function _hasattr(obj, attrname)
	{
		let proto = ul4.Protocol.get(obj);
		return proto.hasattr(obj, attrname);
	};

	// Return the names of the attributes of the object ``obj`` as a set.
	ul4._dir = function _dir(obj)
	{
		let proto = ul4.Protocol.get(obj);
		return proto.dir();
	};

	// Return whether any of the items in ``iterable`` are true
	ul4._any = function _any(iterable)
	{
		if (typeof(iterable) == "string")
		{
			for (let i = 0; i < iterable.length; ++i)
			{
				if (iterable[i] !== '\x00')
					return true;
			}
			return false;
		}
		else
		{
			for (let iter = ul4._iter(iterable);;)
			{
				let item = iter.next();
				if (item.done)
					return false;
				if (ul4._bool(item.value))
					return true;
			}
		}
	};

	// Return whether all of the items in ``iterable`` are true
	ul4._all = function _all(iterable)
	{
		if (typeof(iterable) == "string")
		{
			for (let i = 0; i < iterable.length; ++i)
			{
				if (iterable[i] === '\x00')
					return false;
			}
			return true;
		}
		else
		{
			for (let iter = ul4._iter(iterable);;)
			{
				let item = iter.next();
				if (item.done)
					return true;
				if (!ul4._bool(item.value))
					return false;
			}
		}
	};

	// Check if ``obj`` is undefined
	ul4._isundefined = function _isundefined(obj)
	{
		return typeof(obj) === "undefined";
	};


	// Check if ``obj`` is *not* undefined
	ul4._isdefined = function _isdefined(obj)
	{
		return typeof(obj) !== "undefined";
	};

	// Check if ``obj`` is ``None``
	ul4._isnone = function _isnone(obj)
	{
		return obj === null;
	};

	// Check if ``obj`` is a boolean
	ul4._isbool = function _isbool(obj)
	{
		return typeof(obj) == "boolean";
	};

	// Check if ``obj`` is a int
	ul4._isint = function _isint(obj)
	{
		return (typeof(obj) == "number") && Math.round(obj) == obj;
	};

	// Check if ``obj`` is a float
	ul4._isfloat = function _isfloat(obj)
	{
		return (typeof(obj) == "number") && Math.round(obj) != obj;
	};

	// Check if ``obj`` is a string
	ul4._isstr = function _isstr(obj)
	{
		return typeof(obj) == "string";
	};

	// Check if ``obj`` is a datetime
	ul4._isdatetime = function _isdate(obj)
	{
		return Object.prototype.toString.call(obj) == "[object Date]";
	};

	ul4._isdate = function _isdate(obj)
	{
		return (obj instanceof ul4.Date);
	};

	// Check if ``obj`` is a color
	ul4._iscolor = function _iscolor(obj)
	{
		return (obj instanceof ul4.Color);
	};

	// Check if ``obj`` is a timedelta object
	ul4._istimedelta = function _istimedelta(obj)
	{
		return (obj instanceof ul4.TimeDelta);
	};

	// Check if ``obj`` is a monthdelta object
	ul4._ismonthdelta = function _ismonthdelta(obj)
	{
		return (obj instanceof ul4.MonthDelta);
	};

	// Check if ``obj`` is a template
	ul4._istemplate = function _istemplate(obj)
	{
		return (obj instanceof ul4.Template || obj instanceof ul4.TemplateClosure);
	};

	// Check if ``obj`` is a function
	ul4._isfunction = function _isfunction(obj)
	{
		return typeof(obj) === "function" || (Object.prototype.toString.call(obj) == "[object Object]" && (obj instanceof ul4.Template || obj instanceof ul4.TemplateClosure));
	};

	// Check if ``obj`` is a list
	ul4._islist = function _islist(obj)
	{
		return Object.prototype.toString.call(obj) == "[object Array]";
	};

	// Check if ``obj`` is a set
	ul4._isset = function _isset(obj)
	{
		return Object.prototype.toString.call(obj) == "[object Set]";
	};

	// Check if ``obj`` is an exception (at least a UL4 exception)
	ul4._isexception = function _isexception(obj)
	{
		return (obj instanceof ul4.Exception);
	};

	ul4._isul4set = function _isul4set(obj)
	{
		return (obj instanceof ul4._Set);
	};

	ul4._isanyset = function _isanyset(obj)
	{
		return (ul4._isset(obj) || ul4._isul4set(obj));
	};

	// Check if ``obj`` is an iterator
	ul4._isiter = function _isiter(obj)
	{
		return obj !== null && typeof(obj) === "object" && typeof(obj.next) === "function";
	};

	// Check if ``obj`` is a JS object
	ul4._isobject = function _isobject(obj)
	{
		return Object.prototype.toString.call(obj) == "[object Object]" && typeof(obj.__type__) === "undefined" && !(obj instanceof ul4.Proto);
	};

	if (ul4._havemap)
	{
		// Check if ``obj`` is a ``Map``
		ul4._ismap = function _ismap(obj)
		{
			return obj !== null && typeof(obj) === "object" && typeof(obj.__proto__) === "object" && obj.__proto__ === Map.prototype;
		};

		// Check if ``obj`` is a dict (i.e. a normal Javascript object or a ``Map``)
		ul4._isdict = function _isdict(obj)
		{
			return ul4._isobject(obj) || ul4._ismap(obj);
		};
	}
	else
	{
		ul4._ismap = function _ismap(obj)
		{
			return false;
		};

		ul4._isdict = function _isdict(obj)
		{
			return ul4._isobject(obj);
		};
	}

	// Repeat string ``str`` ``rep`` times
	ul4._str_repeat = function _str_repeat(str, rep)
	{
		let result = "";
		for (; rep>0; --rep)
			result += str;
		return result;
	};

	ul4._list_repeat = function _list_repeat(list, rep)
	{
		let result = [];
		for (; rep>0; --rep)
			for (let i = 0; i < list.length; ++i)
				result.push(list[i]);
		return result;
	};

	ul4._str_json = function _str_json(str)
	{
		let result = "";
		for (let i = 0; i < str.length; ++i)
		{
			let c = str[i];
			switch (c)
			{
				case "\r":
					result += "\\r";
					break;
				case "\n":
					result += "\\n";
					break;
				case "\t":
					result += "\\t";
					break;
				case "\\":
					result += "\\\\";
					break;
				case '"':
					result += '\\"';
					break;
				case '<':
					result += '\\u003c';
					break;
				default:
					let code = c.charCodeAt(0);
					if (code >= 32 && code < 128)
						result += c;
					else
						result += "\\u" + ul4._lpad(code.toString(16), "0", 4);
					break;
			}
		}
		return '"' + result + '"';
	};

	// Encodes ``obj`` in the Javascript Object Notation (see http://json.org/; with support for dates, colors and templates)
	ul4._asjson = function _asjson(obj)
	{
		if (obj === null)
			return "null";
		else if (typeof(obj) === "undefined")
			return "undefined";
		else if (obj === false)
			return "false";
		else if (obj === true)
			return "true";
		else if (typeof(obj) === "string")
			return ul4._str_json(obj);
		else if (typeof(obj) === "number")
		{
			return "" + obj;
		}
		else if (ul4._islist(obj))
		{
			let v = [];
			v.push("[");
			for (let i = 0; i < obj.length; ++i)
			{
				if (i != 0)
					v.push(", ");
				v.push(ul4._asjson(obj[i]));
			}
			v.push("]");
			return v.join("");
		}
		else if (ul4._ismap(obj))
		{
			let v = [];
			v.push("{");
			let i = 0;
			obj.forEach(function(value, key) {
				if (i++)
					v.push(", ");
				v.push(ul4._asjson(key));
				v.push(": ");
				v.push(ul4._asjson(value));
			});
			v.push("}");
			return v.join("");
		}
		else if (ul4._isobject(obj))
		{
			let v = [];
			v.push("{");
			let i = 0;
			for (let key in obj)
			{
				if (i++)
					v.push(", ");
				v.push(ul4._asjson(key));
				v.push(": ");
				v.push(ul4._asjson(obj[key]));
			}
			v.push("}");
			return v.join("");
		}
		else if (ul4._isdate(obj))
		{
			return "new ul4.Date(" + obj._date.getFullYear() + ", " + (obj._date.getMonth()+1) + ", " + obj._date.getDate() + ")";
		}
		else if (ul4._isdatetime(obj))
		{
			return "new Date(" + obj.getFullYear() + ", " + obj.getMonth() + ", " + obj.getDate() + ", " + obj.getHours() + ", " + obj.getMinutes() + ", " + obj.getSeconds() + ", " + obj.getMilliseconds() + ")";
		}
		else if (ul4._istimedelta(obj))
		{
			return "new ul4.TimeDelta(" + obj._days + ", " + obj._seconds + ", " + obj._microseconds + ")";
		}
		else if (ul4._ismonthdelta(obj))
		{
			return "new ul4.MonthDelta(" + obj._months + ")";
		}
		else if (ul4._iscolor(obj))
		{
			return "new ul4.Color(" + obj._r + ", " + obj._g + ", " + obj._b + ", " + obj._a + ")";
		}
		else if (ul4._istemplate(obj))
		{
			return "ul4.Template.loads(" + ul4._repr(obj.dumps()) + ")";
		}
		throw new ul4.TypeError("asjson() requires a serializable object");
	};

	// Decodes the string ``string`` from the Javascript Object Notation (see http://json.org/) and returns the resulting object
	ul4._fromjson = function _fromjson(string)
	{
		// The following is from jQuery's parseJSON function
		string = ul4.StrProtocol.strip(string);
		if (root.JSON && root.JSON.parse)
			return root.JSON.parse(string);
		if (ul4._rvalidchars.test(string.replace(ul4._rvalidescape, "@").replace(ul4._rvalidtokens, "]").replace(ul4._rvalidbraces, "")))
			return (new Function("return " + string))();
		throw new ul4.TypeError("invalid JSON");
	};

	// Encodes ``obj`` in the UL4 Object Notation format
	ul4._asul4on = function _asul4on(obj)
	{
		return ul4.dumps(obj);
	};

	// Decodes the string ``string`` from the UL4 Object Notation format and returns the resulting decoded object
	ul4._fromul4on = function _fromul4on(string)
	{
		return ul4.loads(string);
	};

	ul4._format_datetime = function _format_datetime(obj, fmt, lang)
	{
		let translations = {
			de: {
				ms: ["Jan", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
				ml: ["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
				ws: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
				wl: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
				xf: "%d.%m.%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			en: {
				ms: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				ml: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				ws: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				wl: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				xf: "%m/%d/%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %I:%M:%S %p"
			},
			fr: {
				ms: ["janv.", "f\u00e9vr.", "mars", "avril", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."],
				ml: ["janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"],
				ws: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
				wl: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
				xf: "%d/%m/%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			es: {
				ms: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
				ml: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
				ws: ["dom", "lun", "mar", "mi\u00e9", "jue", "vie", "s\u00e1b"],
				wl: ["domingo", "lunes", "martes", "mi\u00e9rcoles", "jueves", "viernes", "s\u00e1bado"],
				xf: "%d/%m/%y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			it: {
				ms: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
				ml: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
				ws: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
				wl: ["domenica", "luned\u00ec", "marted\u00ec", "mercoled\u00ec", "gioved\u00ec", "venerd\u00ec", "sabato"],
				xf: "%d/%m/%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			da: {
				ms: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
				ml: ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"],
				ws: ["s\u00f8n", "man", "tir", "ons", "tor", "fre", "l\u00f8r"],
				wl: ["s\u00f8ndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l\u00f8rdag"],
				xf: "%d-%m-%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			sv: {
				ms: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
				ml: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
				ws: ["s\u00f6n", "m\u00e5n", "tis", "ons", "tor", "fre", "l\u00f6r"],
				wl: ["s\u00f6ndag", "m\u00e5ndag", "tisdag", "onsdag", "torsdag", "fredag", "l\u00f6rdag"],
				xf: "%Y-%m-%d",
				Xf: "%H.%M.%S",
				cf: "%a %d %b %Y %H.%M.%S"
			},
			nl: {
				ms: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
				ml: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
				ws: ["zo", "ma", "di", "wo", "do", "vr", "za"],
				wl: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
				xf: "%d-%m-%y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			pt: {
				ms: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
				ml: ["Janeiro", "Fevereiro", "Mar\u00e7o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
				ws: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "S\u00e1b"],
				wl: ["Domingo", "Segunda", "Ter\u00e7a", "Quarta", "Quinta", "Sexta", "S\u00e1bado"],
				xf: "%d-%m-%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			cs: {
				ms: ["led", "\u00fano", "b\u0159e", "dub", "kv\u011b", "\u010den", "\u010dec", "srp", "z\u00e1\u0159", "\u0159\u00edj", "lis", "pro"],
				ml: ["leden", "\u00fanor", "b\u0159ezen", "duben", "kv\u011bten", "\u010derven", "\u010dervenec", "srpen", "z\u00e1\u0159\u00ed", "\u0159\u00edjen", "listopad", "prosinec"],
				ws: ["Ne", "Po", "\u00dat", "St", "\u010ct", "P\u00e1", "So"],
				wl: ["Ned\u011ble", "Pond\u011bl\u00ed", "\u00dater\u00fd", "St\u0159eda", "\u010ctvrtek", "P\u00e1tek", "Sobota"],
				xf: "%d.%m.%Y",
				Xf: "%H:%M:%S",
				cf: "%a\u00a0%d.\u00a0%B\u00a0%Y,\u00a0%H:%M:%S"
			},
			sk: {
				ms: ["jan", "feb", "mar", "apr", "m\u00e1j", "j\u00fan", "j\u00fal", "aug", "sep", "okt", "nov", "dec"],
				ml: ["janu\u00e1r", "febru\u00e1r", "marec", "apr\u00edl", "m\u00e1j", "j\u00fan", "j\u00fal", "august", "september", "okt\u00f3ber", "november", "december"],
				ws: ["Ne", "Po", "Ut", "St", "\u0160t", "Pi", "So"],
				wl: ["Nede\u013ea", "Pondelok", "Utorok", "Streda", "\u0160tvrtok", "Piatok", "Sobota"],
				xf: "%d.%m.%Y",
				Xf: "%H:%M:%S",
				cf: "%a\u00a0%d.\u00a0%B\u00a0%Y,\u00a0%H:%M:%S"
			},
			pl: {
				ms: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "pa\u017a", "lis", "gru"],
				ml: ["stycze\u0144", "luty", "marzec", "kwiecie\u0144", "maj", "czerwiec", "lipiec", "sierpie\u0144", "wrzesie\u0144", "pa\u017adziernik", "listopad", "grudzie\u0144"],
				ws: ["nie", "pon", "wto", "\u015bro", "czw", "pi\u0105", "sob"],
				wl: ["niedziela", "poniedzia\u0142ek", "wtorek", "\u015broda", "czwartek", "pi\u0105tek", "sobota"],
				xf: "%d.%m.%Y",
				Xf: "%H:%M:%S",
				cf: "%a, %d %b %Y, %H:%M:%S"
			},
			hr: {
				ms: ["Sij", "Vel", "O\u017eu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
				ml: ["Sije\u010danj", "Velja\u010da", "O\u017eujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
				ws: ["Ned", "Pon", "Uto", "Sri", "\u010cet", "Pet", "Sub"],
				wl: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "\u010cetvrtak", "Petak", "Subota"],
				xf: "%d.%m.%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			sr: {
				ms: ["\u0458\u0430\u043d", "\u0444\u0435\u0431", "\u043c\u0430\u0440", "\u0430\u043f\u0440", "\u043c\u0430\u0458", "\u0458\u0443\u043d", "\u0458\u0443\u043b", "\u0430\u0432\u0433", "\u0441\u0435\u043f", "\u043e\u043a\u0442", "\u043d\u043e\u0432", "\u0434\u0435\u0446"],
				ml: ["\u0458\u0430\u043d\u0443\u0430\u0440", "\u0444\u0435\u0431\u0440\u0443\u0430\u0440", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440\u0438\u043b", "\u043c\u0430\u0458", "\u0458\u0443\u043d", "\u0458\u0443\u043b", "\u0430\u0432\u0433\u0443\u0441\u0442", "\u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440", "\u043e\u043a\u0442\u043e\u0431\u0430\u0440", "\u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440", "\u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440"],
				ws: ["\u043d\u0435\u0434", "\u043f\u043e\u043d", "\u0443\u0442\u043e", "\u0441\u0440\u0435", "\u0447\u0435\u0442", "\u043f\u0435\u0442", "\u0441\u0443\u0431"],
				wl: ["\u043d\u0435\u0434\u0435\u0459\u0430", "\u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a", "\u0443\u0442\u043e\u0440\u0430\u043a", "\u0441\u0440\u0435\u0434\u0430", "\u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a", "\u043f\u0435\u0442\u0430\u043a", "\u0441\u0443\u0431\u043e\u0442\u0430"],
				xf: "%d.%m.%Y.",
				Xf: "%H:%M:%S",
				cf: "%A, %d. %B %Y. %H:%M:%S"
			},
			ro: {
				ms: ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"],
				ml: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
				ws: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sb"],
				wl: ["duminic\u0103", "luni", "mar\u0163i", "miercuri", "joi", "vineri", "s\u00e2mb\u0103t\u0103"],
				xf: "%d.%m.%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			hu: {
				ms: ["jan", "febr", "m\u00e1rc", "\u00e1pr", "m\u00e1j", "j\u00fan", "j\u00fal", "aug", "szept", "okt", "nov", "dec"],
				ml: ["janu\u00e1r", "febru\u00e1r", "m\u00e1rcius", "\u00e1prilis", "m\u00e1jus", "j\u00fanius", "j\u00falius", "augusztus", "szeptember", "okt\u00f3ber", "november", "december"],
				ws: ["v", "h", "k", "sze", "cs", "p", "szo"],
				wl: ["vas\u00e1rnap", "h\u00e9tf\u0151", "kedd", "szerda", "cs\u00fct\u00f6rt\u00f6k", "p\u00e9ntek", "szombat"],
				xf: "%Y-%m-%d",
				Xf: "%H.%M.%S",
				cf: "%Y. %b. %d., %A, %H.%M.%S"
			},
			tr: {
				ms: ["Oca", "\u015eub", "Mar", "Nis", "May", "Haz", "Tem", "A\u011fu", "Eyl", "Eki", "Kas", "Ara"],
				ml: ["Ocak", "\u015eubat", "Mart", "Nisan", "May\u0131s", "Haziran", "Temmuz", "A\u011fustos", "Eyl\u00fcl", "Ekim", "Kas\u0131m", "Aral\u0131k"],
				ws: ["Paz", "Pzt", "Sal", "\u00c7r\u015f", "Pr\u015f", "Cum", "Cts"],
				wl: ["Pazar", "Pazartesi", "Sal\u0131", "\u00c7ar\u015famba", "Per\u015fembe", "Cuma", "Cumartesi"],
				xf: "%d-%m-%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			ru: {
				ms: ["\u042f\u043d\u0432", "\u0424\u0435\u0432", "\u041c\u0430\u0440", "\u0410\u043f\u0440", "\u041c\u0430\u0439", "\u0418\u044e\u043d", "\u0418\u044e\u043b", "\u0410\u0432\u0433", "\u0421\u0435\u043d", "\u041e\u043a\u0442", "\u041d\u043e\u044f", "\u0414\u0435\u043a"],
				ml: ["\u042f\u043d\u0432\u0430\u0440\u044c", "\u0424\u0435\u0432\u0440\u0430\u043b\u044c", "\u041c\u0430\u0440\u0442", "\u0410\u043f\u0440\u0435\u043b\u044c", "\u041c\u0430\u0439", "\u0418\u044e\u043d\u044c", "\u0418\u044e\u043b\u044c", "\u0410\u0432\u0433\u0443\u0441\u0442", "\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c", "\u041e\u043a\u0442\u044f\u0431\u0440\u044c", "\u041d\u043e\u044f\u0431\u0440\u044c", "\u0414\u0435\u043a\u0430\u0431\u0440\u044c"],
				ws: ["\u0412\u0441\u043a", "\u041f\u043d\u0434", "\u0412\u0442\u0440", "\u0421\u0440\u0434", "\u0427\u0442\u0432", "\u041f\u0442\u043d", "\u0421\u0431\u0442"],
				wl: ["\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435", "\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a", "\u0412\u0442\u043e\u0440\u043d\u0438\u043a", "\u0421\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440\u0433", "\u041f\u044f\u0442\u043d\u0438\u0446\u0430", "\u0421\u0443\u0431\u0431\u043e\u0442\u0430"],
				xf: "%d.%m.%Y",
				Xf: "%H:%M:%S",
				cf: "%a %d %b %Y %H:%M:%S"
			},
			zh: {
				ms: [" 1\u6708", " 2\u6708", " 3\u6708", " 4\u6708", " 5\u6708", " 6\u6708", " 7\u6708", " 8\u6708", " 9\u6708", "10\u6708", "11\u6708", "12\u6708"],
				ml: ["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"],
				ws: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"],
				wl: ["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"],
				xf: "%Y\u5e74%b%d\u65e5",
				Xf: "%H\u65f6%M\u5206%S\u79d2",
				cf: "%Y\u5e74%b%d\u65e5 %A %H\u65f6%M\u5206%S\u79d2"
			},
			ko: {
				ms: [" 1\uc6d4", " 2\uc6d4", " 3\uc6d4", " 4\uc6d4", " 5\uc6d4", " 6\uc6d4", " 7\uc6d4", " 8\uc6d4", " 9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"],
				ml: ["1\uc6d4", "2\uc6d4", "3\uc6d4", "4\uc6d4", "5\uc6d4", "6\uc6d4", "7\uc6d4", "8\uc6d4", "9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"],
				ws: ["\uc77c", "\uc6d4", "\ud654", "\uc218", "\ubaa9", "\uae08", "\ud1a0"],
				wl: ["\uc77c\uc694\uc77c", "\uc6d4\uc694\uc77c", "\ud654\uc694\uc77c", "\uc218\uc694\uc77c", "\ubaa9\uc694\uc77c", "\uae08\uc694\uc77c", "\ud1a0\uc694\uc77c"],
				xf: "%Y\ub144 %B %d\uc77c",
				Xf: "%H\uc2dc %M\ubd84 %S\ucd08",
				cf: "%Y\ub144 %B %d\uc77c (%a) %p %I\uc2dc %M\ubd84 %S\ucd08"
			},
			ja: {
				ms: [" 1\u6708", " 2\u6708", " 3\u6708", " 4\u6708", " 5\u6708", " 6\u6708", " 7\u6708", " 8\u6708", " 9\u6708", "10\u6708", "11\u6708", "12\u6708"],
				ml: ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"],
				ws: ["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"],
				wl: ["\u65e5\u66dc\u65e5", "\u6708\u66dc\u65e5", "\u706b\u66dc\u65e5", "\u6c34\u66dc\u65e5", "\u6728\u66dc\u65e5", "\u91d1\u66dc\u65e5", "\u571f\u66dc\u65e5"],
				xf: "%Y\u5e74%B%d\u65e5",
				Xf: "%H\u6642%M\u5206%S\u79d2",
				cf: "%Y\u5e74%B%d\u65e5 %H\u6642%M\u5206%S\u79d2"
			}
		};

		let translation = translations[lang];

		let result = [];
		let inspec = false;
		for (let i = 0; i < fmt.length; ++i)
		{
			let c = fmt[i];
			if (inspec)
			{
				switch (c)
				{
					case "a":
						c = translation.ws[obj.getDay()];
						break;
					case "A":
						c = translation.wl[obj.getDay()];
						break;
					case "b":
						c = translation.ms[obj.getMonth()];
						break;
					case "B":
						c = translation.ml[obj.getMonth()];
						break;
					case "c":
						c = ul4._format(obj, translation.cf, lang);
						break;
					case "d":
						c = ul4._lpad(obj.getDate(), "0", 2);
						break;
					case "f":
						c = ul4._lpad(obj.getMilliseconds(), "0", 3) + "000";
						break;
					case "H":
						c = ul4._lpad(obj.getHours(), "0", 2);
						break;
					case "I":
						c = ul4._lpad(((obj.getHours()-1) % 12)+1, "0", 2);
						break;
					case "j":
						c = ul4._lpad(ul4.DateTimeProtocol.yearday(obj), "0", 3);
						break;
					case "m":
						c = ul4._lpad(obj.getMonth()+1, "0", 2);
						break;
					case "M":
						c = ul4._lpad(obj.getMinutes(), "0", 2);
						break;
					case "p":
						c = obj.getHours() < 12 ? "AM" : "PM";
						break;
					case "S":
						c = ul4._lpad(obj.getSeconds(), "0", 2);
						break;
					case "U":
						c = ul4._lpad(ul4._week4format(obj, 6), "0", 2);
						break;
					case "w":
						c = obj.getDay();
						break;
					case "W":
						c = ul4._lpad(ul4._week4format(obj, 0), "0", 2);
						break;
					case "x":
						c = ul4._format(obj, translation.xf, lang);
						break;
					case "X":
						c = ul4._format(obj, translation.Xf, lang);
						break;
					case "y":
						c = (obj.getFullYear() % 100).toString();
						break;
					case "Y":
						c = obj.getFullYear().toString();
						break;
					case "z":
						// UTC offset in the form +HHMM or -HHMM
						c = "";
						break;
					case "Z":
						// Time zone name
						c = "";
						break;
				}
				result.push(c);
				inspec = false;
			}
			else
			{
				if (c == "%")
					inspec = true;
				else
					result.push(c);
			}
		}
		return result.join("");
	};

	ul4._format_int = function _format_int(obj, fmt, lang)
	{
		let work = fmt;

		// Defaults
		let fill = ' ';
		let align = '>'; // '<', '>', '=' or '^'
		let sign = '-'; // '+', '-' or ' '
		let alternate = false;
		let minimumwidth = 0;
		let type = 'd'; // 'b', 'c', 'd', 'o', 'x', 'X' or 'n'

		// Determine output type
		if (/[bcdoxXn]$/.test(work))
		{
			type = work.substring(work.length-1);
			work = work.substring(0, work.length-1);
		}

		// Extract minimum width
		if (/\d+$/.test(work))
		{
			let minimumwidthStr = /\d+$/.exec(work);
			work = work.replace(/\d+$/, "");
			if (/^0/.test(minimumwidthStr))
			{
				align = '=';
				fill = '0';
			}
			minimumwidth = parseInt(minimumwidthStr);
		}

		// Alternate form?
		if (/#$/.test(work))
		{
			alternate = true;
			work = work.substring(0, work.length-1);
		}

		// Determine sign
		if (/[+ -]$/.test(work))
		{
			if (type == 'c')
				throw new ul4.ValueError("sign not allowed for integer format type 'c'");
			sign = work.substring(work.length-1);
			work = work.substring(0, work.length-1);
		}

		// Extract fill and align char
		if (work.length >= 3)
			throw new ul4.ValueError("illegal integer format string " + ul4._repr(fmt));
		else if (work.length == 2)
		{
			if (/[<>=^]$/.test(work))
			{
				align = work[1];
				fill = work[0];
			}
			else
				throw new ul4.ValueError("illegal integer format string " + ul4._repr(fmt));
		}
		else if (work.length == 1)
		{
			if (/^[<>=^]$/.test(work))
				align = work;
			else
				throw new ul4.ValueError("illegal integer format string " + ul4._repr(fmt));
		}

		// Basic number formatting
		let neg = obj < 0;

		if (neg)
			obj = -obj;

		let output;
		switch (type)
		{
			case 'b':
				output = obj.toString(2);
				break;
			case 'c':
				if (neg || obj > 65535)
					throw new ul4.ValueError("value out of bounds for c format");
				output = String.fromCharCode(obj);
				break;
			case 'd':
				output = obj.toString();
				break;
			case 'o':
				output = obj.toString(8);
				break;
			case 'x':
				output = obj.toString(16);
				break;
			case 'X':
				output = obj.toString(16).toUpperCase();
				break;
			case 'n':
				// FIXME: locale formatting
				output = obj.toString();
				break;
		}

		// The rest of the formatting
		if (align === '=')
		{
			if (neg || sign !== '-')
				--minimumwidth;
			if (alternate && (type === 'b' || type === 'o' || type === 'x' || type === 'X'))
				minimumwidth -= 2;

			if (output.length < minimumwidth)
				output = ul4._str_repeat(fill, minimumwidth-output.length) + output;

			if (alternate && (type === 'b' || type === 'o' || type === 'x' || type === 'X'))
				output = "0" + type + output;

			if (neg)
				output = "-" + output;
			else if (sign != '-')
				output = sign + output;
		}
		else
		{
			if (alternate && (type == 'b' || type == 'o' || type == 'x' || type == 'X'))
				output = "0" + type + output;
			if (neg)
				output = "-" + output;
			else if (sign != '-')
				output = sign + output;
			if (output.length < minimumwidth)
			{
				if (align == '<')
					output = output + ul4._str_repeat(fill, minimumwidth-output.length);
				else if (align == '>')
					output = ul4._str_repeat(fill, minimumwidth-output.length) + output;
				else // if (align == '^')
				{
					let pad = minimumwidth - output.length;
					let padBefore = Math.floor(pad/2);
					let padAfter = pad-padBefore;
					output = ul4._str_repeat(fill, padBefore) + output + ul4._str_repeat(fill, padAfter);
				}
			}
		}
		return output;
	};

	// Format ``obj`` using the format string ``fmt`` in the language ``lang``
	ul4._format = function _format(obj, fmt, lang)
	{
		if (typeof(lang) === "undefined" || lang === null)
			lang = "en";
		else
		{
			let translations = {de: null, en: null, fr: null, es: null, it: null, da: null, sv: null, nl: null, pt: null, cs: null, sk: null, pl: null, hr: null, sr: null, ro: null, hu: null, tr: null, ru: null, zh: null, ko: null, ja: null};
			lang = lang.toLowerCase();
			if (typeof(translations[lang]) === "undefined")
			{
				lang = lang.split(/_/)[0];
				if (typeof(translations[lang]) === "undefined")
					lang = "en";
			}
		}
		if (ul4._isdate(obj))
			return ul4._format_datetime(obj._date, fmt, lang);
		if (ul4._isdatetime(obj))
			return ul4._format_datetime(obj, fmt, lang);
		else if (ul4._isint(obj))
			return ul4._format_int(obj, fmt, lang);
		else if (obj === true)
			return ul4._format_int(1, fmt, lang);
		else if (obj === false)
			return ul4._format_int(0, fmt, lang);
	};

	ul4._lpad = function _lpad(string, pad, len)
	{
		if (typeof(string) === "number")
			string = string.toString();
		while (string.length < len)
			string = pad + string;
		return string;
	};

	ul4._rpad = function _rpad(string, pad, len)
	{
		if (typeof(string) === "number")
			string = string.toString();
		while (string.length < len)
			string = string + pad;
		return string;
	};

	// This is outside of ``Proto`` on purpose
	// This way reactive frameworks like ``Vue.js`` don't get to see it
	// and complain about mutating render functions when those create new objects.
	let _nextid = 1;

	ul4.Proto = class Proto
	{
		constructor()
		{
			this.__id__ = _nextid++;
		}

		ul4type()
		{
			return this.constructor.name;
		}

		// equality comparison of objects defaults to identity comparison
		__eq__(other)
		{
			return this === other;
		}

		// To overwrite equality comparison, you only have to overwrite ``__eq__``,
		// ``__ne__`` will be synthesized from that
		__ne__(other)
		{
			return !this.__eq__(other);
		}

		// For other comparison operators, each method has to be implemented:
		// ``<`` calls ``__lt__``, ``<=`` calls ``__le__``, ``>`` calls ``__gt__`` and
		// ``>=`` calls ``__ge__``

		__bool__()
		{
			return true;
		}
	};

	ul4.Signature = class Signature extends ul4.Proto
	{
		constructor(...args)
		{
			super();
			this.args = [];
			this.argNames = {};
			this.remargs = null;
			this.remkwargs = null;

			let nextDefault = false;
			let lastArgname = null;
			for (let i = 0; i < args.length; ++i)
			{
				let argName = args[i];
				if (nextDefault)
				{
					this.args.push({name: lastArgname, defaultValue: argName});
					this.argNames[lastArgname] = true;
					nextDefault = false;
				}
				else
				{
					if (argName.substr(argName.length-1) === "=")
					{
						lastArgname = argName.substr(0, argName.length-1);
						nextDefault = true;
					}
					else if (argName.substr(0, 2) === "**")
						this.remkwargs = argName.substr(2);
					else if (argName.substr(0, 1) === "*")
						this.remargs = argName.substr(1);
					else
					{
						this.args.push({name: argName});
						this.argNames[argName] = true;
					}
				}
			}
		}

		// Create the argument array for calling a function with this signature with the arguments available from ``args``
		bindArray(name, args, kwargs)
		{
			let finalargs = [];
			let decname = name !== null ? name + "() " : "";

			for (let i = 0; i < this.args.length; ++i)
			{
				let arg = this.args[i];
				if (i < args.length)
				{
					if (kwargs.hasOwnProperty(arg.name))
						throw new ul4.ArgumentError(decname + "argument " + ul4._repr(arg.name) + " (position " + i + ") specified multiple times");
					finalargs.push(args[i]);
				}
				else
				{
					if (kwargs.hasOwnProperty(arg.name))
						finalargs.push(kwargs[arg.name]);
					else
					{
						if (arg.hasOwnProperty("defaultValue"))
							finalargs.push(arg.defaultValue);
						else
							throw new ul4.ArgumentError("required " + decname + "argument " + ul4._repr(arg.name) + " (position " + i + ") missing");
					}
				}
			}

			// Do we accept additional positional arguments?
			if (this.remargs === null)
			{
				// No, but we have them -> complain
				if (args.length > this.args.length)
				{
					let prefix = name === null ? "expected" : name + "() expects";
					throw new ul4.ArgumentError(prefix + " at most " + this.args.length + " positional argument" + (this.args.length != 1 ? "s" : "") + ", " + args.length + " given");
				}
			}
			else
			{
				// Put additional positional arguments in the call into the ``*`` argument (if there are none, this pushes an empty list)
				finalargs.push(args.slice(this.args.length));
			}

			// Do we accept arbitrary keyword arguments?
			if (this.remkwargs === null)
			{
				// No => complain about unknown ones
				for (let key in kwargs)
				{
					if (!this.argNames[key])
					{
						if (name === null)
							throw new ul4.ArgumentError("an argument named " + ul4._repr(key) + " isn't supported");
						else
							throw new ul4.ArgumentError(name + "() doesn't support an argument named " + ul4._repr(key));
					}
				}
			}
			else
			{
				// Yes => Put the unknown ones into an object and add that to the arguments array
				let remkwargs = ul4._emptymap();
				for (let key in kwargs)
				{
					if (!this.argNames[key])
						ul4._setmap(remkwargs, key, kwargs[key]);
				}
				finalargs.push(remkwargs);
			}

			return finalargs;
		}

		// Create the argument object for calling a function with this signature with the arguments available from ``args``
		bindObject(name, args, kwargs)
		{
			args = this.bindArray(name, args, kwargs);
			let argObject = {};
			let i;
			for (i = 0; i < this.args.length; ++i)
				argObject[this.args[i].name] = args[i];
			if (this.remargs !== null)
				argObject[this.remargs] = args[i++];
			if (this.remkwargs !== null)
				argObject[this.remkwargs] = args[i++];
			return argObject;
		}

		__repr__()
		{
			return "<Signature " + this.toString() + ">";
		}

		__str__()
		{
			return this.toString();
		}

		toString()
		{
			let v = [];
			for (let i = 0; i < this.args.length; ++i)
			{
				let arg = this.args[i];
				if (arg.hasOwnProperty("defaultValue"))
					v.push(arg.name + "=" + ul4._repr(arg.defaultValue));
				else
					v.push(arg.name);
			}
			if (this.remargs !== null)
				v.push("*" + this.remargs);
			if (this.remkwargs !== null)
				v.push("**" + this.remkwargs);
			return "(" + v.join(", ") + ")";
		}
	};

	// When we don't have a real ``Set`` type, emulate one that supports strings
	ul4._Set = class _Set
	{
		constructor(...items)
		{
			this.items = {};
			this.add(...items);
		}

		add(...items)
		{
			for (let i = 0; i < items.length; ++i)
				this.items[items[i]] = true;
		}

		clear()
		{
			this.items = {};
		}

		__getattr__(attrname)
		{
			let self = this;
			switch (attrname)
			{
				case "add":
					return ul4.expose(function add(items){ self.add(...items); }, ["*items"]);
				default:
					throw new ul4.AttributeError(this, attrname);
			}
		}

		__contains__(item)
		{
			return this.items[item] || false;
		}

		has(item)
		{
			return this.items[item] || false;
		}

		__bool__()
		{
			for (let item in this.items)
			{
				if (!this.items.hasOwnProperty(item))
					continue;
				return true;
			}
			return false;
		}

		__repr__()
		{
			let v = [];
			v.push("{");
			let i = 0;
			for (let item in this.items)
			{
				if (!this.items.hasOwnProperty(item))
					continue;
				if (i++)
					v.push(", ");
				v.push(ul4._repr(item));
			}
			if (!i)
				v.push("/");
			v.push("}");
			return v.join("");
		}

		__eq__(other)
		{
			// We'll check that everything in ``this`` is in ``other``
			// and if both have the same number of items they are equal
			if (ul4._isset(other))
			{
				let count = 0;
				for (let item in this.items)
				{
					if (!other.has(item))
						return false;
					// count the number of items we have
					++count;
				}
				return other.size == count;
			}
			else if (ul4._isul4set(other))
			{
				let count = 0;
				for (let item in this.items)
				{
					if (!other[item])
						return false;
					// count the number of items we have
					++count;
				}
				// Subtract the number of items that ``other`` has
				for (let item in other.items)
					--count;
				return count == 0;
			}
			else
				return false;
		}

		__le__(other)
		{
			// check that ``this`` is a subset of ``other``,
			// i.e. everything in ``this`` is also in ``other``
			if (ul4._isset(other))
			{
				let count = 0;
				for (let item in this.items)
				{
					if (!other.has(item))
						return false;
				}
				return true;
			}
			else if (ul4._isul4set(other))
			{
				let count = 0;
				for (let item in this.items)
				{
					if (!other.items[item])
						return false;
				}
				return true;
			}
			else
				ul4._unorderable("<", this, other);
		}

		__ge__(other)
		{
			// check that ``this`` is a superset of ``other``,
			// i.e. everything in ``other`` is also in ``this``
			if (ul4._isset(other))
			{
				other.forEach(function(value) {
					if (!this.items[value])
						return false;
				}, this);
				return true;
			}
			else if (ul4._isul4set(other))
			{
				let count = 0;
				for (let key in other.items)
				{
					if (!this.items[key])
						return false;
				}
				return true;
			}
			else
				ul4._unorderable("<=", this, other);
		}
	};

	ul4._Set.prototype.__type__ = "set";

	// Adds name and signature to a function/method and makes the method callable in templates
	ul4.expose = function expose(f, signature, options)
	{
		options = options || {};
		if (options.name)
			f._ul4_name = options.name;
		if (ul4._islist(signature))
			signature = new ul4.Signature(...signature);
		f._ul4_signature = signature;
		f._ul4_needsobject = options.needsobject || false;
		f._ul4_needscontext = options.needscontext || false;
	};

	// Protocol objects for all builtin types
	// These objects are singleton, so we replace the constructor with the prototype object afterwards
	ul4.Protocol = class Protocol
	{
		ul4type()
		{
			return this.constructor.name;
		}

		dir()
		{
			return this.attrs;
		}

		get(obj)
		{
			if (ul4._isstr(obj))
				return ul4.StrProtocol;
			else if (ul4._islist(obj))
				return ul4.ListProtocol;
			else if (ul4._isdate(obj))
				return ul4.DateProtocol;
			else if (ul4._isset(obj))
				return ul4.SetProtocol;
			else if (ul4._ismap(obj))
				return ul4.MapProtocol;
			else if (ul4._isdatetime(obj))
				return ul4.DateTimeProtocol;
			else if (ul4._isobject(obj))
				return ul4.ObjectProtocol;
			else
				return ul4.Protocol;
		}

		getattr(obj, attrname)
		{
			if (obj === null || typeof(obj) === "undefined")
				throw new ul4.AttributeError(obj, attrname);
			else if (typeof(obj.__getattr__) === "function")
				return obj.__getattr__(attrname);
			else if (this.attrs.has(attrname))
			{
				let attr = this[attrname];
				let realattr = function realattr(...args) {
					return attr.apply(this, [obj, ...args]);
				};
				realattr.name = attr.name;
				realattr._ul4_name = attr._ul4_name || attr.name;
				realattr._ul4_signature = attr._ul4_signature;
				realattr._ul4_needsobject = attr._ul4_needsobject;
				realattr._ul4_needscontext = attr._ul4_needscontext;
				return realattr;
			}
			else
				throw new ul4.AttributeError(obj, attrname);
		}

		hasattr(obj, attrname)
		{
			if (obj === null || typeof(obj) === "undefined")
				return false;
			else if (typeof(obj.__getattr__) === "function")
			{
				try
				{
					obj.__getattr__(attrname);
					return true;
				}
				catch (exc)
				{
					if (exc instanceof ul4.AttributeError && exc.obj === object)
						return false;
					else
						throw exc;
				}
			}
			else
				return this.attrs.has(attrname);
		}
	};

	ul4.Protocol = ul4.Protocol.prototype;
	ul4.Protocol.attrs = ul4._emptyset();

	ul4.StrProtocol = class StrProtocol extends ul4.Protocol.constructor
	{
		ul4type(obj)
		{
			return "str";
		}

		count(obj, sub, start=null, end=null)
		{
			return ul4._count(obj, sub, start, end);
		}

		find(obj, sub, start=null, end=null)
		{
			return ul4._find(obj, sub, start, end);
		}

		rfind(obj, sub, start=null, end=null)
		{
			return ul4._rfind(obj, sub, start, end);
		}

		replace(obj, old, new_, count=null)
		{
			if (count === null)
				count = obj.length;

			let result = [];
			while (obj.length)
			{
				let pos = obj.indexOf(old);
				if (pos === -1 || !count--)
				{
					result.push(obj);
					break;
				}
				result.push(obj.substr(0, pos));
				result.push(new_);
				obj = obj.substr(pos + old.length);
			}
			return result.join("");
		}

		strip(obj, chars=null)
		{
			chars = chars || " \r\n\t";
			if (typeof(chars) !== "string")
				throw new ul4.TypeError("strip() requires a string argument");

			while (obj && chars.indexOf(obj[0]) >= 0)
				obj = obj.substr(1);
			while (obj && chars.indexOf(obj[obj.length-1]) >= 0)
				obj = obj.substr(0, obj.length-1);
			return obj;
		}

		lstrip(obj, chars=null)
		{
			chars = chars || " \r\n\t";
			if (typeof(chars) !== "string")
				throw new ul4.TypeError("lstrip() requires a string argument");

			while (obj && chars.indexOf(obj[0]) >= 0)
				obj = obj.substr(1);
			return obj;
		}

		rstrip(obj, chars=null)
		{
			chars = chars || " \r\n\t";
			if (typeof(chars) !== "string")
				throw new ul4.TypeError("rstrip() requires a string argument");

			while (obj && chars.indexOf(obj[obj.length-1]) >= 0)
				obj = obj.substr(0, obj.length-1);
			return obj;
		}

		split(obj, sep=null, count=null)
		{
			if (sep !== null && typeof(sep) !== "string")
				throw new ul4.TypeError("split() requires a string");

			if (count === null)
			{
				let result = obj.split(sep !== null ? sep : /[ \n\r\t]+/);
				if (sep === null)
				{
					if (result.length && !result[0].length)
						result.splice(0, 1);
					if (result.length && !result[result.length-1].length)
						result.splice(-1);
				}
				return result;
			}
			else
			{
				if (sep !== null)
				{
					let result = [];
					while (obj.length)
					{
						let pos = obj.indexOf(sep);
						if (pos === -1 || !count--)
						{
							result.push(obj);
							break;
						}
						result.push(obj.substr(0, pos));
						obj = obj.substr(pos + sep.length);
					}
					return result;
				}
				else
				{
					let result = [];
					while (obj.length)
					{
						obj = ul4.StrProtocol.lstrip(obj, null);
						let part;
						if (!count--)
							 part = obj; // Take the rest of the string
						else
							part = obj.split(/[ \n\r\t]+/, 1)[0];
						if (part.length)
							result.push(part);
						obj = obj.substr(part.length);
					}
					return result;
				}
			}
		}

		rsplit(obj, sep=null, count=null)
		{
			if (sep !== null && typeof(sep) !== "string")
				throw new ul4.TypeError("rsplit() requires a string as second argument");

			if (count === null)
			{
				let result = obj.split(sep !== null ? sep : /[ \n\r\t]+/);
				if (sep === null)
				{
					if (result.length && !result[0].length)
						result.splice(0, 1);
					if (result.length && !result[result.length-1].length)
						result.splice(-1);
				}
				return result;
			}
			else
			{
				if (sep !== null)
				{
					let result = [];
					while (obj.length)
					{
						let pos = obj.lastIndexOf(sep);
						if (pos === -1 || !count--)
						{
							result.unshift(obj);
							break;
						}
						result.unshift(obj.substr(pos+sep.length));
						obj = obj.substr(0, pos);
					}
					return result;
				}
				else
				{
					let result = [];
					while (obj.length)
					{
						obj = ul4.StrProtocol.rstrip(obj);
						let part;
						if (!count--)
							 part = obj; // Take the rest of the string
						else
						{
							part = obj.split(/[ \n\r\t]+/);
							part = part[part.length-1];
						}
						if (part.length)
							result.unshift(part);
						obj = obj.substr(0, obj.length-part.length);
					}
					return result;
				}
			}
		}

		splitlines(obj, keepends=false)
		{
			let pos = 0;
			let lookingAtLineEnd = function lookingAtLineEnd()
			{
				let c = obj[pos];
				if (c === '\n' || c == '\u000B' || c == '\u000C' || c == '\u001C' || c == '\u001D' || c == '\u001E' || c == '\u0085' || c == '\u2028' || c == '\u2029')
					return 1;
				if (c === '\r')
				{
					if (pos == length-1)
						return 1;
					if (obj[pos+1] === '\n')
						return 2;
					return 1;
				}
				return 0;
			};

			let result = [], length = obj.length;

			for (pos = 0, startpos = 0;;)
			{
				if (pos >= length)
				{
					if (startpos != pos)
						result.push(obj.substring(startpos));
					return result;
				}
				let lineendlen = lookingAtLineEnd();
				if (!lineendlen)
					++pos;
				else
				{
					let endpos = pos + (keepends ? lineendlen : 0);
					result.push(obj.substring(startpos, endpos));
					pos += lineendlen;
					startpos = pos;
				}
			}
		}

		lower(obj)
		{
			return obj.toLowerCase();
		}

		upper(obj)
		{
			return obj.toUpperCase();
		}

		capitalize(obj)
		{
			if (obj.length)
				obj = obj[0].toUpperCase() + obj.slice(1).toLowerCase();
			return obj;
		}

		join(obj, iterable)
		{
			let resultlist = [];
			for (let iter = ul4._iter(iterable);;)
			{
				let item = iter.next();
				if (item.done)
					break;
				resultlist.push(item.value);
			}
			return resultlist.join(obj);
		}

		startswith(obj, prefix)
		{
			if (typeof(prefix) === "string")
				return obj.substr(0, prefix.length) === prefix;
			else if (ul4._islist(prefix))
			{
				for (let i = 0; i < prefix.length; ++i)
				{
					let singlepre = prefix[i];
					if (obj.substr(0, singlepre.length) === singlepre)
						return true;
				}
				return false;
			}
			else
				throw new ul4.TypeError("startswith() argument must be string");
		}

		endswith(obj, suffix)
		{
			if (typeof(suffix) === "string")
				return obj.substr(obj.length-suffix.length) === suffix;
			else if (ul4._islist(suffix))
			{
				for (let i = 0; i < suffix.length; ++i)
				{
					let singlesuf = suffix[i];
					if (obj.substr(obj.length-singlesuf.length) === singlesuf)
						return true;
				}
				return false;
			}
			else
				throw new ul4.TypeError("endswith() argument must be string or list of strings");
		}
	};

	ul4.StrProtocol = ul4.StrProtocol.prototype;
	ul4.StrProtocol.attrs = ul4._makeset(
		"split",
		"rsplit",
		"splitlines",
		"strip",
		"lstrip",
		"rstrip",
		"upper",
		"lower",
		"capitalize",
		"startswith",
		"endswith",
		"replace",
		"count",
		"find",
		"rfind",
		"join"
	);

	ul4.expose(ul4.StrProtocol.count, ["sub", "start=", null, "end=", null]);
	ul4.expose(ul4.StrProtocol.find, ["sub", "start=", null, "end=", null]);
	ul4.expose(ul4.StrProtocol.rfind, ["sub", "start=", null, "end=", null]);
	ul4.expose(ul4.StrProtocol.replace, ["old", "new", "count=", null]);
	ul4.expose(ul4.StrProtocol.strip, ["chars=", null]);
	ul4.expose(ul4.StrProtocol.lstrip, ["chars=", null]);
	ul4.expose(ul4.StrProtocol.rstrip, ["chars=", null]);
	ul4.expose(ul4.StrProtocol.split, ["sep=", null, "count=", null]);
	ul4.expose(ul4.StrProtocol.rsplit, ["sep=", null, "count=", null]);
	ul4.expose(ul4.StrProtocol.splitlines, ["keepends=", false]);
	ul4.expose(ul4.StrProtocol.lower, []);
	ul4.expose(ul4.StrProtocol.upper, []);
	ul4.expose(ul4.StrProtocol.capitalize, []);
	ul4.expose(ul4.StrProtocol.join, ["iterable"]);
	ul4.expose(ul4.StrProtocol.startswith, ["prefix"]);
	ul4.expose(ul4.StrProtocol.endswith, ["suffix"]);

	ul4.ListProtocol = class ListProtocol extends ul4.Protocol.constructor
	{
		ul4type(obj)
		{
			return "list";
		}

		append(obj, items)
		{
			for (let i = 0; i < items.length; ++i)
				obj.push(items[i]);
			return null;
		}

		insert(obj, pos, items)
		{
			if (pos < 0)
				pos += obj.length;

			for (let i = 0; i < items.length; ++i)
				obj.splice(pos++, 0, items[i]);
			return null;
		}

		pop(obj, pos)
		{
			if (pos < 0)
				pos += obj.length;

			let result = obj[pos];
			obj.splice(pos, 1);
			return result;
		}

		count(obj, sub, start=null, end=null)
		{
			return ul4._count(obj, sub, start, end);
		}

		find(obj, sub, start=null, end=null)
		{
			return ul4._find(obj, sub, start, end);
		}

		rfind(obj, sub, start=null, end=null)
		{
			return ul4._rfind(obj, sub, start, end);
		}
	};

	ul4.ListProtocol = ul4.ListProtocol.prototype;
	ul4.ListProtocol.attrs = ul4._makeset(
		"append",
		"insert",
		"pop",
		"count",
		"find",
		"rfind"
	);

	ul4.expose(ul4.ListProtocol.append, ["*items"]);
	ul4.expose(ul4.ListProtocol.insert, ["pos", "*items"]);
	ul4.expose(ul4.ListProtocol.pop, ["pos=", -1]);
	ul4.expose(ul4.ListProtocol.count, ["sub", "start=", null, "end=", null]);
	ul4.expose(ul4.ListProtocol.find, ["sub", "start=", null, "end=", null]);
	ul4.expose(ul4.ListProtocol.rfind, ["sub", "start=", null, "end=", null]);

	ul4.MapProtocol = class MapProtocol extends ul4.Protocol.constructor
	{
		ul4type(obj)
		{
			return "dict";
		}

		getattr(obj, attrname)
		{
			if (this.attrs.has(attrname))
			{
				let attr = this[attrname];
				let realattr = function realattr(...args) {
					return attr.apply(this, [obj, ...args]);
				};
				realattr.name = attr.name;
				realattr._ul4_name = attr._ul4_name || attr.name;
				realattr._ul4_signature = attr._ul4_signature;
				realattr._ul4_needsobject = attr._ul4_needsobject;
				realattr._ul4_needscontext = attr._ul4_needscontext;
				return realattr;
			}
			else
				return obj.get(attrname);
		}

		get(obj, key, default_=null)
		{
			if (obj.has(key))
				return obj.get(key);
			return default_;
		}

		items(obj)
		{
			let result = [];
			obj.forEach(function(value, key) {
				result.push([key, value]);
			});
			return result;
		}

		values(obj)
		{
			let result = [];
			obj.forEach(function(value, key) {
				result.push(value);
			});
			return result;
		}

		update(obj, other, kwargs)
		{
			return ul4._update(obj, other, kwargs);
		}

		clear(obj)
		{
			obj.clear();
			return null;
		}
	};

	ul4.MapProtocol = ul4.MapProtocol.prototype;
	ul4.MapProtocol.attrs = ul4._makeset("get", "items", "values", "update", "clear");

	ul4.expose(ul4.MapProtocol.get, ["key", "default=", null]);
	ul4.expose(ul4.MapProtocol.items, []);
	ul4.expose(ul4.MapProtocol.values, []);
	ul4.expose(ul4.MapProtocol.update, ["*other", "**kwargs"]);
	ul4.expose(ul4.MapProtocol.clear, []);

	ul4.SetProtocol = class SetProtocol extends ul4.Protocol.constructor
	{
		ul4type(obj)
		{
			return "set";
		}

		add(obj, items)
		{
			for (let i = 0; i < items.length; ++i)
			{
				obj.add(items[i]);
			}
		}

		clear(obj)
		{
			obj.clear();
			return null;
		}
	};

	ul4.SetProtocol = ul4.SetProtocol.prototype;
	ul4.SetProtocol.attrs = ul4._makeset("add", "clear");

	ul4.expose(ul4.SetProtocol.add, ["*items"]);
	ul4.expose(ul4.SetProtocol.clear, []);

	ul4.DateProtocol = class DateProtocol extends ul4.Protocol.constructor
	{
		ul4type(obj)
		{
			return "date";
		}

		weekday(obj)
		{
			return ul4.DateTimeProtocol.weekday(obj._date);
		}

		calendar(obj, firstweekday=0, mindaysinfirstweek=4)
		{
			return ul4.DateTimeProtocol.calendar(obj._date, firstweekday, mindaysinfirstweek);
		}

		week(obj, firstweekday=0, mindaysinfirstweek=4)
		{
			return ul4.DateProtocol.calendar(obj, firstweekday, mindaysinfirstweek)[1];
		}

		day(obj)
		{
			return obj._date.getDate();
		}

		month(obj)
		{
			return obj._date.getMonth()+1;
		}

		year(obj)
		{
			return obj._date.getFullYear();
		}

		mimeformat(obj)
		{
			let weekdayname = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
			let monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			let d = obj._date;

			return weekdayname[ul4.DateTimeProtocol.weekday(d)] + ", " + ul4._lpad(d.getDate(), "0", 2) + " " + monthname[d.getMonth()] + " " + d.getFullYear();
		}

		isoformat(obj)
		{
			let d = obj._date;
			return d.getFullYear() + "-" + ul4._lpad((d.getMonth()+1).toString(), "0", 2) + "-" + ul4._lpad(d.getDate().toString(), "0", 2);
		}

		yearday(obj)
		{
			return ul4.DateTimeProtocol.yearday(obj._date);
		}
	};

	ul4.DateProtocol = ul4.DateProtocol.prototype;
	ul4.DateProtocol.attrs = ul4._makeset("weekday", "week", "calendar", "day", "month", "year", "mimeformat", "isoformat", "yearday");

	ul4.expose(ul4.DateProtocol.weekday, []);
	ul4.expose(ul4.DateProtocol.calendar, ["firstweekday=", 0, "mindaysinfirstweek=", 4]);
	ul4.expose(ul4.DateProtocol.week, ["firstweekday=", 0, "mindaysinfirstweek=", 4]);
	ul4.expose(ul4.DateProtocol.day, []);
	ul4.expose(ul4.DateProtocol.month, []);
	ul4.expose(ul4.DateProtocol.year, []);
	ul4.expose(ul4.DateProtocol.mimeformat, []);
	ul4.expose(ul4.DateProtocol.isoformat, []);
	ul4.expose(ul4.DateProtocol.yearday, []);

	ul4.DateTimeProtocol = class DatetimeProtocol extends ul4.Protocol.constructor
	{
		ul4type(obj)
		{
			return "datetime";
		}

		weekday(obj)
		{
			let d = obj.getDay();
			return d ? d-1 : 6;
		}

		calendar(obj, firstweekday=0, mindaysinfirstweek=4)
		{
			// Normalize parameters
			firstweekday = ul4._mod(firstweekday, 7);
			if (mindaysinfirstweek < 1)
				mindaysinfirstweek = 1;
			else if (mindaysinfirstweek > 7)
				mindaysinfirstweek = 7;

			// ``obj`` might be in the first week of the next year, or last week of
			// the previous year, so we might have to try those too.
			for (let offset = +1; offset >= -1; --offset)
			{
				let year = obj.getFullYear() + offset;
				// ``refdate`` will always be in week 1
				let refDate = new Date(year, 0, mindaysinfirstweek);
				// Go back to the start of ``refdate``s week (i.e. day 1 of week 1)
				let weekDayDiff = ul4._mod(ul4.DateTimeProtocol.weekday(refDate) - firstweekday, 7);
				let weekStartYear = refDate.getFullYear();
				let weekStartMonth = refDate.getMonth();
				let weekStartDay = refDate.getDate() - weekDayDiff;
				let weekStart = new Date(weekStartYear, weekStartMonth, weekStartDay);
				// Is our date ``obj`` at or after day 1 of week 1?
				if (obj.getTime() >= weekStart.getTime())
				{
					let diff = ul4.SubAST.prototype._do(obj, weekStart);
					// Add 1, because the first week is week 1, not week 0
					let week = Math.floor(diff.days()/7) + 1;
					return [year, week, ul4.DateTimeProtocol.weekday(obj)];
				}
			}
		}

		week(obj, firstweekday=0, mindaysinfirstweek=4)
		{
			return ul4.DateTimeProtocol.calendar(obj, firstweekday, mindaysinfirstweek)[1];
		}

		day(obj)
		{
			return obj.getDate();
		}

		month(obj)
		{
			return obj.getMonth()+1;
		}

		year(obj)
		{
			return obj.getFullYear();
		}

		hour(obj)
		{
			return obj.getHours();
		}

		minute(obj)
		{
			return obj.getMinutes();
		}

		second(obj)
		{
			return obj.getSeconds();
		}

		microsecond(obj)
		{
			return obj.getMilliseconds() * 1000;
		}

		mimeformat(obj)
		{
			let weekdayname = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
			let monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

			return weekdayname[ul4.DateTimeProtocol.weekday(obj)] + ", " + ul4._lpad(obj.getDate(), "0", 2) + " " + monthname[obj.getMonth()] + " " + obj.getFullYear() + " " + ul4._lpad(obj.getHours(), "0", 2) + ":" + ul4._lpad(obj.getMinutes(), "0", 2) + ":" + ul4._lpad(obj.getSeconds(), "0", 2) + " GMT";
		}

		isoformat(obj)
		{
			let year = obj.getFullYear();
			let month = obj.getMonth()+1;
			let day = obj.getDate();
			let hour = obj.getHours();
			let minute = obj.getMinutes();
			let second = obj.getSeconds();
			let ms = obj.getMilliseconds();
			let result = year + "-" + ul4._lpad(month.toString(), "0", 2) + "-" + ul4._lpad(day.toString(), "0", 2) + "T" + ul4._lpad(hour.toString(), "0", 2) + ":" + ul4._lpad(minute.toString(), "0", 2) + ":" + ul4._lpad(second.toString(), "0", 2);
			if (ms)
				result += "." + ul4._lpad(ms.toString(), "0", 3) + "000";
			return result;
		}

		yearday(obj)
		{
			let leap = ul4._isleap(obj) ? 1 : 0;
			let day = obj.getDate();
			switch (obj.getMonth())
			{
				case 0:
					return day;
				case 1:
					return 31 + day;
				case 2:
					return 31 + 28 + leap + day;
				case 3:
					return 31 + 28 + leap + 31 + day;
				case 4:
					return 31 + 28 + leap + 31 + 30 + day;
				case 5:
					return 31 + 28 + leap + 31 + 30 + 31 + day;
				case 6:
					return 31 + 28 + leap + 31 + 30 + 31 + 30 + day;
				case 7:
					return 31 + 28 + leap + 31 + 30 + 31 + 30 + 31 + day;
				case 8:
					return 31 + 28 + leap + 31 + 30 + 31 + 30 + 31 + 31 + day;
				case 9:
					return 31 + 28 + leap + 31 + 30 + 31 + 30 + 31 + 31 + 30 + day;
				case 10:
					return 31 + 28 + leap + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + day;
				case 11:
					return 31 + 28 + leap + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + day;
			}
		}
	};

	ul4.DateTimeProtocol = ul4.DateTimeProtocol.prototype;
	ul4.DateTimeProtocol.attrs = ul4._makeset("weekday", "week", "calendar", "day", "month", "year", "hour", "minute", "second", "microsecond", "mimeformat", "isoformat", "yearday");

	ul4.expose(ul4.DateTimeProtocol.weekday, []);
	ul4.expose(ul4.DateTimeProtocol.calendar, ["firstweekday=", 0, "mindaysinfirstweek=", 4]);
	ul4.expose(ul4.DateTimeProtocol.week, ["firstweekday=", 0, "mindaysinfirstweek=", 4]);
	ul4.expose(ul4.DateTimeProtocol.day, []);
	ul4.expose(ul4.DateTimeProtocol.month, []);
	ul4.expose(ul4.DateTimeProtocol.year, []);
	ul4.expose(ul4.DateTimeProtocol.hour, []);
	ul4.expose(ul4.DateTimeProtocol.minute, []);
	ul4.expose(ul4.DateTimeProtocol.second, []);
	ul4.expose(ul4.DateTimeProtocol.microsecond, []);
	ul4.expose(ul4.DateTimeProtocol.mimeformat, []);
	ul4.expose(ul4.DateTimeProtocol.isoformat, []);
	ul4.expose(ul4.DateTimeProtocol.yearday, []);

	ul4.ObjectProtocol = class ObjectProtocol extends ul4.Protocol.constructor
	{
		ul4type(obj)
		{
			return "dict";
		}

		getattr(obj, attrname)
		{
			let result;
			if (obj && typeof(obj.__getattr__) === "function") // test this before the generic object test
				result = obj.__getattr__(attrname);
			else
				result = obj[attrname];
			if (typeof(result) !== "function")
				return result;
			let realresult = function(...args) {
				// We can use ``apply`` here, as we know that ``obj`` is a real object.
				return result.apply(obj, args);
			};
			realresult._ul4_name = result._ul4_name || result.name;
			realresult._ul4_signature = result._ul4_signature;
			realresult._ul4_needsobject = result._ul4_needsobject;
			realresult._ul4_needscontext = result._ul4_needscontext;
			return realresult;
		}

		get(obj, key, default_=null)
		{
			let result = obj[key];
			if (typeof(result) === "undefined")
				return default_;
			return result;
		}

		items(obj)
		{
			let result = [];
			for (let key in obj)
				result.push([key, obj[key]]);
			return result;
		}

		values(obj)
		{
			let result = [];
			for (let key in obj)
				result.push(obj[key]);
			return result;
		}

		clear(obj)
		{
			for (let key in obj)
				delete obj[key];
		}
	};

	ul4.ObjectProtocol = ul4.ObjectProtocol.prototype;
	ul4.ObjectProtocol.attrs = ul4._makeset("get", "items", "values", "update", "clear");

	ul4.expose(ul4.ObjectProtocol.get, ["key", "default=", null]);
	ul4.expose(ul4.ObjectProtocol.items, []);
	ul4.expose(ul4.ObjectProtocol.values, []);
	ul4.expose(ul4.ObjectProtocol.clear, []);

	ul4.Context = class Context
	{
		constructor(vars)
		{
			if (vars === null || typeof(vars) === "undefined")
				vars = {};
			this.vars = vars;
			this.indents = [];
			this.escapes = [];
			this._output = [];
		}

		/* Return a clone of the ``Context``, but with a fresh empty ``vars`` objects that inherits from the previous one.
		 * This is used by the various comprehensions to avoid leaking loop variables.
		 */
		inheritvars()
		{
			let context = Object.create(this);
			context.vars = Object.create(this.vars);
			return context;
		}

		/* Return a clone of the ``Context`` with one additional indentation (this is used by ``RenderAST``) */
		withindent(indent)
		{
			let context = Object.create(this);
			if (indent !== null)
			{
				context.indents = this.indents.slice();
				context.indents.push(indent);
			}
			return context;
		}

		/* Return a clone of the ``Context`` with the output buffer replaced (this is used by ``renders`` to collect the output in a separate buffer) */
		replaceoutput()
		{
			let context = Object.create(this);
			context._output = [];
			return context;
		}

		clone(vars)
		{
			return Object.create(this);
		}

		output(value)
		{
			for (let i = 0; i < this.escapes.length; ++i)
			{
				let escape = this.escapes[i];
				value = escape(value);
			}
			this._output.push(value);
		}

		getoutput()
		{
			return this._output.join("");
		}

		get(name)
		{
			return this.vars[name];
		}

		set(name, value)
		{
			this.vars[name] = value;
		}
	};

	/// Exceptions

	// Note that extending ``Error`` doesn't work, so we do it the "classic" way
	ul4.Exception = function Exception(message, fileName, lineNumber)
	{
		let instance = new Error(message, fileName, lineNumber);
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		instance.__id__ = _nextid++;
		instance.context = null;
		return instance;
	};

	ul4.Exception.prototype = Object.create(Error.prototype, {
		constructor: {
			value: Error,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (Object.setPrototypeOf)
		Object.setPrototypeOf(ul4.Exception, Error);
	else
		ul4.Exception.__proto__ = Error;

	ul4.Exception.prototype.__getattr__ = function __getattr__(attrname)
	{
		switch (attrname)
		{
			case "context":
				return this.context;
			default:
				throw new ul4.AttributeError(this, attrname);
		}
	};

	// Exceptions used internally by UL4 for flow control
	ul4.InternalException = class InternalException extends ul4.Exception
	{
	};

	// Control flow exceptions
	ul4.ReturnException = class ReturnException extends ul4.InternalException
	{
		constructor(result)
		{
			super("return");
			this.result = result;
		}
	};

	ul4.BreakException = class BreakException extends ul4.InternalException
	{
		constructor()
		{
			super("break");
		}
	};

	ul4.ContinueException = class ContinueException extends ul4.InternalException
	{
		constructor()
		{
			super("continue");
		}
	};

	// Real exceptions raised by various parts of UL4
	ul4.SyntaxError = class SyntaxError extends ul4.Exception
	{
	};

	ul4.LValueRequiredError = class LValueRequiredError extends ul4.SyntaxError
	{
		constructor()
		{
			super("lvalue required");
		}
	};

	ul4.TypeError = class TypeError extends ul4.Exception
	{
	};

	ul4.ValueError = class ValueError extends ul4.Exception
	{
	};

	ul4.ArgumentError = class ArgumentError extends ul4.Exception
	{
	};

	ul4.NotSubscriptableError = class NotSubscriptableError extends ul4.Exception
	{
		constructor(obj)
		{
			super("Object of type " + _type(obj) + " is not subscriptable");
			this.obj = obj;
		}

		toString()
		{
			return "Object of type " + _type(this.obj) + " is not subscriptable";
		}
	};

	ul4.ZeroDivisionError = class ZeroDivisionError extends ul4.Exception
	{
		constructor()
		{
			super("division by zero");
		}
	};

	ul4.IndexError = class IndexError extends ul4.Exception
	{
		constructor(obj, index)
		{
			super("index " + ul4._repr(index) + " out of range");
			this.obj = obj;
			this.index = index;
		}

		toString()
		{
			return "index " + this.index + " out of range for " + ul4._type(this.obj);
		}
	};

	ul4.AttributeError = class AttributeError extends ul4.Exception
	{
		constructor(obj, attrname)
		{
			super("object of type " + ul4._type(obj) + " has no attribute " + ul4._repr(attrname));
			this.obj = obj;
			this.attrname = attrname;
		}
	};

	/// Exception that wraps other exceptions while they bubble up the stack
	ul4.LocationError = class LocationError extends ul4.Exception
	{
		constructor(location)
		{
			super("nested exception in " + ul4._repr(location));
			this.location = location;
		}

		_templateprefix()
		{
			let template = this.location.template;
			let out = [];
			if (template.parenttemplate !== null)
				out.push("in local template ");
			else
				out.push("in template ");
			let first = true;
			while (template != null)
			{
				if (first)
					first = false;
				else
					out.push(" in ");
				out.push(template.name ? ul4._repr(template.name) : "(unnamed)");
				template = template.parenttemplate;
			}
			return out.join("");
		}

		toString()
		{
			let template = this.location.template;
			let templateprefix = this._templateprefix();

			let prefix = this.location.sourceprefix;
			let code = this.location.source;
			let suffix = this.location.sourcesuffix;
			prefix = ul4._repr(prefix).slice(1, -1);
			code = ul4._repr(code).slice(1, -1);
			suffix = ul4._repr(suffix).slice(1, -1);

			let text = prefix + code + suffix;
			let underline = ul4._str_repeat("\u00a0", prefix.length) + ul4._str_repeat("~", code.length);

			let pos = "offset " + this.location.pos.start + ":" + this.location.pos.stop + "; line " + this.location.line + "; col " + this.location.col;

			let message = templateprefix + ": " + pos + "\n" + text + "\n" + underline;
			return message;
		}

		__getattr__(attrname)
		{
			switch (attrname)
			{
				case "context":
					return this.context;
				case "location":
					return this.location;
				default:
					throw new ul4.AttributeError(this, attrname);
			}
		}
	};

	/// Classes for the syntax tree
	ul4.AST = class AST extends ul4.Proto
	{
		constructor(template, pos)
		{
			super();
			this.template = template;
			this.pos = pos;
			this._line = null;
			this._col = null;
		}

		get fullsource()
		{
			return this.template._source;
		}

		get source()
		{
			return this.pos.of(this.template._source);
		}

		get sourceprefix()
		{
			let outerstartpos = this.pos.start;
			let innerstartpos = outerstartpos;
			let source = this.fullsource;

			let maxprefix = 40;
			let preprefix = "\u2026";
			while (maxprefix > 0)
			{
				// We arrived at the start of the source code
				if (outerstartpos === 0)
				{
					preprefix = "";
					break;
				}
				// We arrived at the start of the line
				if (source.charAt(outerstartpos-1) === "\n")
				{
					preprefix = "";
					break;
				}
				--maxprefix;
				--outerstartpos;
			}
			return preprefix + source.substring(outerstartpos, innerstartpos);
		}

		get sourcesuffix()
		{
			let outerstoppos = this.pos.stop;
			let innerstoppos = outerstoppos;
			let source = this.fullsource;

			let maxsuffix = 40;
			let postsuffix = "\u2026";
			while (maxsuffix > 0)
			{
				// We arrived at the ed of the source code
				if (outerstoppos >= source.length)
				{
					postsuffix = "";
					break;
				}
				// We arrived at the end of the line
				if (source.charAt(outerstoppos) === "\n")
				{
					postsuffix = "";
					break;
				}
				--maxsuffix;
				++outerstoppos;
			}
			return source.substring(innerstoppos, outerstoppos) + postsuffix;
		}

		get line()
		{
			if (this._line === null)
				this._calculateLineCol();
			return this._line;
		}

		get col()
		{
			if (this._col === null)
				this._calculateLineCol();
			return this._col;
		}

		_calculateLineCol()
		{
			this._line = 1
			this._col = 1;
			let stop = this.pos.start;
			for (let i = 0; i < stop; ++i)
			{
				if (this.template.source[i] === "\n")
				{
					++this._line;
					this._col = 1;
				}
				else
					++this._col;
			}
		}

		__getattr__(attrname)
		{
			if (attrname === "type" || attrname === "fullsource" || attrname === "source" || attrname === "sourceprefix" || attrname === "sourcesuffix" || attrname === "line" || attrname === "col")
				return this[attrname];
			else if (this._ul4onattrs.indexOf(attrname) >= 0)
				return this[attrname];
			throw new ul4.AttributeError(this, attrname);
		}

		__setitem__(attrname, value)
		{
			throw new ul4.TypeError("object is immutable");
		}

		__str__()
		{
			let out = [];
			this._str(out);
			return ul4._formatsource(out);
		}

		__repr__()
		{
			let out = [];
			this._repr(out);
			return ul4._formatsource(out);
		}

		_decorate_exception(exc)
		{
			while (exc.context !== undefined && exc.context !== null)
				exc = exc.context;
			exc.context = new ul4.LocationError(this);
		}

		_handle_eval(context)
		{
			try
			{
				return this._eval(context);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.InternalException) && !(exc instanceof ul4.LocationError))
					this._decorate_exception(exc);
				throw exc;
			}
		}

		_handle_eval_set(context, value)
		{
			try
			{
				return this._eval_set(context, value);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.LocationError))
					this._decorate_exception(exc);
				throw exc;
			}
		}

		_eval_set(context, value)
		{
			throw new ul4.LValueRequiredError();
		}

		_handle_eval_modify(context, operator, value)
		{
			try
			{
				return this._eval_modify(context, operator, value);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.LocationError))
					this._decorate_exception(exc);
				throw exc;
			}
		}

		_eval_modify(context, operator, value)
		{
			throw new ul4.LValueRequiredError();
		}

		_repr(out)
		{
		}

		_str(out)
		{
			out.push(this.source.replace(/\r?\n/g, ' '));
		}

		ul4ondump(encoder)
		{
			for (let i = 0; i < this._ul4onattrs.length; ++i)
			{
				let attrname = this._ul4onattrs[i];
				encoder.dump(this[attrname]);
			}
		}

		ul4onload(decoder)
		{
			for (let i = 0; i < this._ul4onattrs.length; ++i)
			{
				let attrname = this._ul4onattrs[i];
				this[attrname] = decoder.load();
			}
		}
	};

	// used in ul4ondump/ul4ondump to automatically dump these attributes
	ul4.AST.prototype._ul4onattrs = ["template", "pos"];

	ul4.TextAST = class TextAST extends ul4.AST
	{
		constructor(template, pos)
		{
			super(template, pos);
		}

		get text()
		{
			return this.source;
		}

		_eval(context)
		{
			context.output(this.text);
		}

		_str(out)
		{
			out.push("text ");
			out.push(ul4._repr(this.text));
		}

		_repr(out)
		{
			out.push("<TextAST ");
			out.push(ul4._repr(this.text));
			out.push(">");
		}
	};

	ul4.IndentAST = class IndentAST extends ul4.TextAST
	{
		constructor(template, pos, text)
		{
			super(template, pos);
			this._text = text;
		}

		get text()
		{
			if (typeof(this.template) !== "undefined")
				return this._text === null ? this.source : this._text;
			else
				return null;
		}

		_eval(context)
		{
			for (let i = 0; i < context.indents.length; ++i)
			{
				let indent = context.indents[i];
				context.output(indent);
			}
			context.output(this.text);
		}

		ul4ondump(encoder)
		{
			super.ul4ondump(encoder);

			if (this._text === this.source)
				encoder.dump(null);
			else
				encoder.dump(this._text);
		}

		ul4onload(decoder)
		{
			super.ul4onload(decoder);
			this._text = decoder.load();
		}

		_str(out)
		{
			out.push("indent ");
			out.push(ul4._repr(this.text));
		}

		_repr(out)
		{
			out.push("<IndentAST ");
			out.push(ul4._repr(this.text));
			out.push(">");
		}
	};

	ul4.LineEndAST = class LineEndAST extends ul4.TextAST
	{
		_str(out)
		{
			out.push("lineend ");
			out.push(ul4._repr(this.text));
		}

		_repr(out)
		{
			out.push("<LineEndAST ");
			out.push(ul4._repr(this.text));
			out.push(">");
		}
	};

	ul4.CodeAST = class CodeAST extends ul4.AST
	{
	};

	ul4.ConstAST = class ConstAST extends ul4.CodeAST
	{
		constructor(template, pos, value)
		{
			super(template, pos);
			this.value = value;
		}

		_repr(out)
		{
			out.push("<ConstAST value=");
			out.push(ul4._repr(this.value));
			out.push(">");
		}

		_eval(context)
		{
			return this.value;
		}
	};

	ul4.ConstAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["value"]);

	ul4.ItemArgBase = class ItemArgBase extends ul4.CodeAST
	{
		_handle_eval_list(context, result)
		{
			try
			{
				return this._eval_list(context, result);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.InternalException) && !(exc instanceof ul4.LocationError))
					this._decorate_exception(exc);
				throw exc;
			}
		}

		_handle_eval_set(context, result)
		{
			try
			{
				return this._eval_set(context, result);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.InternalException) && !(exc instanceof ul4.LocationError))
					this._decorate_exception(exc);
				throw exc;
			}
		}

		_handle_eval_dict(context, result)
		{
			try
			{
				return this._eval_dict(context, result);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.InternalException) && !(exc instanceof ul4.LocationError))
					this._decorate_exception(exc);
				throw exc;
			}
		}

		_handle_eval_call(context, args, kwargs)
		{
			try
			{
				return this._eval_call(context, args, kwargs);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.InternalException) && !(exc instanceof ul4.LocationError))
					this._decorate_exception(exc);
				throw exc;
			}
		}
	};

	ul4.SeqItemAST = class SeqItemAST extends ul4.ItemArgBase
	{
		constructor(template, pos, value)
		{
			super(template, pos);
			this.value = value;
		}

		_repr(out)
		{
			out.push("<SeqItemAST value=");
			out.push(ul4._repr(this.value));
			out.push(">");
		}

		_eval_list(context, result)
		{
			let value = this.value._handle_eval(context);
			result.push(value);
		}

		_eval_set(context, result)
		{
			let value = this.value._handle_eval(context);
			result.add(value);
		}
	};

	ul4.SeqItemAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["value"]);

	ul4.UnpackSeqItemAST = class UnpackSeqItemAST extends ul4.ItemArgBase
	{
		constructor(template, pos, value)
		{
			super(template, pos);
			this.value = value;
		}

		_repr(out)
		{
			out.push("<UnpackSeqItemAST value=");
			out.push(ul4._repr(this.value));
			out.push(">");
		}

		_eval_list(context, result)
		{
			let value = this.value._handle_eval(context);
			for (let iter = ul4._iter(value);;)
			{
				let item = iter.next();
				if (item.done)
					break;
				result.push(item.value);
			}
		}

		_eval_set(context, result)
		{
			let value = this.value._handle_eval(context);
			for (let iter = ul4._iter(value);;)
			{
				let item = iter.next();
				if (item.done)
					break;
				result.add(item.value);
			}
		}
	};

	ul4.UnpackSeqItemAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["value"]);

	ul4.DictItemAST = class DictItemAST extends ul4.ItemArgBase
	{
		constructor(template, pos, key, value)
		{
			super(template, pos);
			this.key = key;
			this.value = value;
		}

		_repr(out)
		{
			out.push("<DictItemAST key=");
			out.push(ul4._repr(this.key));
			out.push(" value=");
			out.push(ul4._repr(this.value));
			out.push(">");
		}

		_eval_dict(context, result)
		{
			let key = this.key._handle_eval(context);
			let value = this.value._handle_eval(context);
			ul4._setmap(result, key, value);
		}
	};

	ul4.DictItemAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["key", "value"]),

	ul4.UnpackDictItemAST = class UnpackDictItemAST extends ul4.ItemArgBase
	{
		constructor(template, pos, item)
		{
			super(template, pos);
			this.item = item;
		}

		_repr(out)
		{
			out.push("<UnpackDictItemAST item=");
			out.push(ul4._repr(this.item));
			out.push(">");
		}

		_eval_dict(context, result)
		{
			let item = this.item._handle_eval(context);
			if (ul4._islist(item))
			{
				for (let i = 0; i < item.length; ++i)
				{
					let subitem = item[i];
					if (!ul4._islist(subitem) || subitem.length != 2)
						throw new ul4.ArgumentError("** requires a list of (key, value) pairs");
					ul4._setmap(result, subitem[0], subitem[1]);
				}
			}
			else if (ul4._ismap(item))
			{
				item.forEach(function(value, key) {
					ul4._setmap(result, key, value);
				});
			}
			else if (ul4._isobject(item))
			{
				for (let key in item)
					ul4._setmap(result, key, item[key]);
			}
		}
	};

	ul4.UnpackDictItemAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["item"]);

	ul4.PosArgAST = class PosArgAST extends ul4.ItemArgBase
	{
		constructor(template, pos, value)
		{
			super(template, pos);
			this.value = value;
		}

		_repr(out)
		{
			out.push("<PosArgAST value=");
			this.value._repr(out);
			out.push(">");
		}

		_eval_call(context, args, kwargs)
		{
			let value = this.value._handle_eval(context);
			args.push(value);
		}
	};

	ul4.PosArgAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["value"]);

	ul4.KeywordArgAST = class KeywordArgAST extends ul4.ItemArgBase
	{
		constructor(template, pos, name, value)
		{
			super(template, pos);
			this.name = name;
			this.value = value;
		}

		_repr(out)
		{
			out.push("<KeywordArgAST name=");
			out.push(ul4._repr(this.name));
			out.push(" value=");
			this.value._repr(out);
			out.push(">");
		}

		_eval_call(context, args, kwargs)
		{
			if (kwargs.hasOwnProperty(this.name))
				throw new ul4.ArgumentError("duplicate keyword argument " + this.name);
			let value = this.value._handle_eval(context);
			kwargs[this.name] = value;
		}
	};

	ul4.KeywordArgAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["name", "value"]);

	ul4.UnpackListArgAST = class UnpackListArgAST extends ul4.ItemArgBase
	{
		constructor(template, pos, item)
		{
			super(template, pos);
			this.item = item;
		}

		_repr(out)
		{
			out.push("<UnpackListArgAST item=");
			this.item._repr(out);
			out.push(">");
		}

		_eval_call(context, args, kwargs)
		{
			let item = this.item._handle_eval(context);
			args.push(...item);
		}
	};

	ul4.UnpackListArgAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["item"]);

	ul4.UnpackDictArgAST = class UnpackDictArgAST extends ul4.ItemArgBase
	{
		constructor(template, pos, item)
		{
			super(template, pos);
			this.item = item;
		}

		_repr(out)
		{
			out.push("<UnpackDictArgAST item=");
			this.item._repr(out);
			out.push(">");
		}

		_eval_call(context, args, kwargs)
		{
			let item = this.item._handle_eval(context);
			if (ul4._islist(item))
			{
				for (let i = 0; i < item.length; ++i)
				{
					let subitem = item[i];
					if (!ul4._islist(subitem) || subitem.length != 2)
						throw new ul4.ArgumentError("** requires a list of (key, value) pairs");
					let [key, value] = subitem;
					if (kwargs.hasOwnProperty(key))
						throw new ul4.ArgumentError("duplicate keyword argument " + key);
					kwargs[key] = value;
				}
			}
			else if (ul4._ismap(item))
			{
				item.forEach(function(value, key) {
					if (kwargs.hasOwnProperty(key))
						throw new ul4.ArgumentError("duplicate keyword argument " + key);
					kwargs[key] = value;
				});
			}
			else if (ul4._isobject(item))
			{
				for (let key in item)
				{
					if (kwargs.hasOwnProperty(key))
						throw new ul4.ArgumentError("duplicate keyword argument " + key);
					kwargs[key] = item[key];
				}
			}
		}
	};

	ul4.UnpackDictArgAST.prototype._ul4onattrs = ul4.ItemArgBase.prototype._ul4onattrs.concat(["item"]);

	ul4.ListAST = class ListAST extends ul4.CodeAST
	{
		constructor(template, pos)
		{
			super(template, pos);
			this.items = [];
		}

		_repr(out)
		{
			out.push("<ListAST");
			for (let i = 0; i < this.items.length; ++i)
			{
				let item = this.items[i];
				out.push(" ");
				item._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let result = [];
			for (let i = 0; i < this.items.length; ++i)
			{
				let item = this.items[i];
				item._handle_eval_list(context, result);
			}
			return result;
		}
	};

	ul4.ListAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["items"]);

	ul4.ListCompAST = class ListCompAST extends ul4.CodeAST
	{
		constructor(template, pos, item, varname, container, condition)
		{
			super(template, pos);
			this.item = item;
			this.varname = varname;
			this.container = container;
			this.condition = condition;
		}

		_repr(out)
		{
			out.push("<ListCompAST");
			out.push(" item=");
			this.item._repr(out);
			out.push(" varname=");
			out.push(ul4._repr(this.varname));
			out.push(" container=");
			this.container._repr(out);
			if (this.condition !== null)
			{
				out.push(" condition=");
				this.condition._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let container = this.container._handle_eval(context);

			let localcontext = context.inheritvars();

			let result = [];
			for (let iter = ul4._iter(container);;)
			{
				let item = iter.next();
				if (item.done)
					break;
				let varitems = ul4._unpackvar(this.varname, item.value);
				for (let i = 0; i < varitems.length; ++i)
				{
					let [lvalue, value] = varitems[i];
					lvalue._handle_eval_set(localcontext, value);
				}
				if (this.condition === null || ul4._bool(this.condition._handle_eval(localcontext)))
					result.push(this.item._handle_eval(localcontext));
			}
			return result;
		}
	};

	ul4.ListCompAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["item", "varname", "container", "condition"]);

	ul4.SetAST = class SetAST extends ul4.CodeAST
	{
		constructor(template, pos)
		{
			super(template, pos);
			this.items = [];
		}

		_repr(out)
		{
			out.push("<SetAST");
			for (let i = 0; i < this.items.length; ++i)
			{
				let item = this.items[i];
				out.push(" ");
				item._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let result = ul4._emptyset();

			for (let i = 0; i < this.items.length; ++i)
			{
				let item = this.items[i];
				item._handle_eval_set(context, result);
			}

			return result;
		}
	};

	ul4.SetAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["items"]);

	ul4.SetCompAST = class SetCompAST extends ul4.CodeAST
	{
		constructor(template, pos, item, varname, container, condition)
		{
			super(template, pos);
			this.item = item;
			this.varname = varname;
			this.container = container;
			this.condition = condition;
		}

		__getattr__(attrname)
		{
			switch (attrname)
			{
				case "item":
					return this.item;
				case "varname":
					return this.varname;
				case "container":
					return this.container;
				case "condition":
					return this.condition;
				default:
					return super.__getattr__(attrname);
			}
		}

		_repr(out)
		{
			out.push("<SetCompAST");
			out.push(" item=");
			this.item._repr(out);
			out.push(" varname=");
			this.varname._repr(out);
			out.push(" container=");
			this.container._repr(out);
			if (this.condition !== null)
			{
				out.push(" condition=");
				this.condition._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let container = this.container._handle_eval(context);

			let localcontext = context.inheritvars();

			let result = ul4._emptyset();
			for (let iter = ul4._iter(container);;)
			{
				let item = iter.next();
				if (item.done)
					break;
				let varitems = ul4._unpackvar(this.varname, item.value);
				for (let i = 0; i < varitems.length; ++i)
				{
					let [lvalue, value] = varitems[i];
					lvalue._handle_eval_set(localcontext, value);
				}
				if (this.condition === null || ul4._bool(this.condition._handle_eval(localcontext)))
					result.add(this.item._handle_eval(localcontext));
			}

			return result;
		}
	};

	ul4.SetCompAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["item", "varname", "container", "condition"]);

	ul4.DictAST = class DictAST extends ul4.CodeAST
	{
		constructor(template, pos)
		{
			super(template, pos);
			this.items = [];
		}

		__getattr__(attrname)
		{
			switch (attrname)
			{
				case "items":
					return this.items;
				default:
					return super.__getattr__(attrname);
			}
		}

		_repr(out)
		{
			out.push("<DictAST");
			for (let i = 0; i < this.items.length; ++i)
			{
				let item = this.items[i];
				out.push(" ");
				item._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let result = ul4._emptymap();
			for (let i = 0; i < this.items.length; ++i)
			{
				let item = this.items[i];
				item._handle_eval_dict(context, result);
			}
			return result;
		}
	};

	ul4.DictAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["items"]);

	ul4.DictCompAST = class DictCompAST extends ul4.CodeAST
	{
		constructor(template, pos, key, value, varname, container, condition)
		{
			super(template, pos);
			this.key = key;
			this.value = value;
			this.varname = varname;
			this.container = container;
			this.condition = condition;
		}

		_repr(out)
		{
			out.push("<DictCompAST");
			out.push(" key=");
			this.key._repr(out);
			out.push(" value=");
			this.value._repr(out);
			out.push(" varname=");
			this.varname._repr(out);
			out.push(" container=");
			this.container._repr(out);
			if (this.condition !== null)
			{
				out.push(" condition=");
				this.condition._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let container = this.container._handle_eval(context);

			let localcontext = context.inheritvars();

			let result = ul4._emptymap();

			for (let iter = ul4._iter(container);;)
			{
				let item = iter.next();
				if (item.done)
					break;
				let varitems = ul4._unpackvar(this.varname, item.value);
				for (let i = 0; i < varitems.length; ++i)
				{
					let [lvalue, value] = varitems[i];
					lvalue._handle_eval_set(localcontext, value);
				}
				if (this.condition === null || ul4._bool(this.condition._handle_eval(localcontext)))
				{
					let key = this.key._handle_eval(localcontext);
					let value = this.value._handle_eval(localcontext);
					ul4._setmap(result, key, value);
				}
			}

			return result;
		}
	};

	ul4.DictCompAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["key", "value", "varname", "container", "condition"]);

	ul4.GenExprAST = class GenExprAST extends ul4.CodeAST
	{
		constructor(template, pos, item, varname, container, condition)
		{
			super(template, pos);
			this.item = item;
			this.varname = varname;
			this.container = container;
			this.condition = condition;
		}

		_repr(out)
		{
			out.push("<GenExprAST");
			out.push(" item=");
			this.item._repr(out);
			out.push(" varname=");
			this.varname._repr(out);
			out.push(" container=");
			this.container._repr(out);
			if (this.condition !== null)
			{
				out.push(" condition=");
				this.condition._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let container = this.container._handle_eval(context);
			let iter = ul4._iter(container);

			let localcontext = context.inheritvars();

			let self = this;

			let result = {
				next: function(){
					while (true)
					{
						let item = iter.next();
						if (item.done)
							return item;
						let varitems = ul4._unpackvar(self.varname, item.value);
						for (let i = 0; i < varitems.length; ++i)
						{
							let [lvalue, value] = varitems[i];
							lvalue._handle_eval_set(localcontext, value);
						}
						if (self.condition === null || ul4._bool(self.condition._handle_eval(localcontext)))
						{
							let value = self.item._handle_eval(localcontext);
							return {value: value, done: false};
						}
					}
				}
			};

			return result;
		}
	};

	ul4.GenExprAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["item", "varname", "container", "condition"]);

	ul4.VarAST = class VarAST extends ul4.CodeAST
	{
		constructor(template, pos, name)
		{
			super(template, pos);
			this.name = name;
		}

		_repr(out)
		{
			out.push("<VarAST name=");
			out.push(ul4._repr(this.name));
			out.push(">");
		}

		_eval(context)
		{
			return this._get(context, this.name);
		}

		_eval_set(context, value)
		{
			this._set(context, this.name, value);
		}

		_eval_modify(context, operator, value)
		{
			this._modify(context, operator, this.name, value);
		}

		_get(context, name)
		{
			let result = context.get(name);
			if (typeof(result) === "undefined")
				result = ul4.functions[name];
			return result;
		}

		_set(context, name, value)
		{
			context.set(name, value);
		}

		_modify(context, operator, name, value)
		{
			let newvalue = operator._ido(context.get(name), value);
			context.set(name, newvalue);
		}
	};

	ul4.VarAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["name"]);

	ul4.UnaryAST = class UnaryAST extends ul4.CodeAST
	{
		constructor(template, pos, obj)
		{
			super(template, pos);
			this.obj = obj;
		}

		_repr(out)
		{
			out.push("<");
			out.push(this.constructor.name);
			out.push(" obj=");
			this.obj._repr(out);
			out.push(">");
		}

		_eval(context)
		{
			let obj = this.obj._handle_eval(context);
			return this._do(obj);
		}
	};

	ul4.UnaryAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["obj"]);

	// Negation
	ul4.NegAST = class NegAST extends ul4.UnaryAST
	{
		_do(obj)
		{
			if (obj !== null && typeof(obj.__neg__) === "function")
				return obj.__neg__();
			return -obj;
		}
	};

	// Bitwise not
	ul4.BitNotAST = class BitNotAST extends ul4.UnaryAST
	{
		_do(obj)
		{
			return -obj-1;
		}
	};

	// Not
	ul4.NotAST = class NotAST extends ul4.UnaryAST
	{
		_do(obj)
		{
			return !ul4._bool(obj);
		}
	};

	// If expression
	ul4.IfAST = class IfAST extends ul4.CodeAST
	{
		constructor(template, pos, objif, objcond, objelse)
		{
			super(template, pos);
			this.objif = objif;
			this.objcond = objcond;
			this.objelse = objelse;
		}

		_repr(out)
		{
			out.push("<");
			out.push(this.constructor.name);
			out.push(+1);
			out.push("objif=");
			this.objif._repr(out);
			out.push(0);
			out.push("objcond=");
			this.objcond._repr(out);
			out.push(0);
			out.push("objelse=");
			this.objelse._repr(out);
			out.push(-1);
			out.push(">");
		}

		_eval(context)
		{
			let result;
			let condvalue = this.objcond._handle_eval(context);
			if (ul4._bool(condvalue))
				result = this.objif._handle_eval(context);
			else
				result = this.objelse._handle_eval(context);
			return result;
		}
	};

	ul4.IfAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["objif", "objcond", "objelse"]);

	ul4.ReturnAST = class ReturnAST extends ul4.UnaryAST
	{
		_eval(context)
		{
			let result = this.obj._handle_eval(context);
			throw new ul4.ReturnException(result);
		}

		_str(out)
		{
			out.push("return ");
			this.obj._str(out);
		}
	};

	ul4.PrintAST = class PrintAST extends ul4.UnaryAST
	{
		_eval(context)
		{
			let obj = this.obj._handle_eval(context);
			let output = ul4._str(obj);
			context.output(output);
		}

		_str(out)
		{
			out.push("print ");
			this.obj._str(out);
		}
	};

	ul4.PrintXAST = class PrintXAST extends ul4.UnaryAST
	{
		_eval(context)
		{
			let obj = this.obj._handle_eval(context);
			let output = ul4._xmlescape(obj);
			context.output(output);
		}

		_str(out)
		{
			out.push("printx ");
			this.obj._str(out);
		}
	};

	ul4.BinaryAST = class BinaryAST extends ul4.CodeAST
	{
		constructor(template, pos, obj1, obj2)
		{
			super(template, pos);
			this.obj1 = obj1;
			this.obj2 = obj2;
		}

		_repr(out)
		{
			out.push("<");
			out.push(this.constructor.name);
			out.push(" obj1=");
			this.obj1._repr(out);
			out.push(" obj2=");
			this.obj2._repr(out);
			out.push(">");
		}

		_eval(context)
		{
			let obj1 = this.obj1._handle_eval(context);
			let obj2 = this.obj2._handle_eval(context);
			return this._do(obj1, obj2);
		}
	};

	ul4.BinaryAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["obj1", "obj2"]);

	// Item access and assignment: dict[key], list[index], string[index], color[index]
	ul4.ItemAST = class ItemAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			let result = this._get(obj1, obj2);
			return result;
		}

		_eval_set(context, value)
		{
			let obj1 = this.obj1._handle_eval(context);
			let obj2 = this.obj2._handle_eval(context);
			this._set(obj1, obj2, value);
		}

		_eval_modify(context, operator, value)
		{
			let obj1 = this.obj1._handle_eval(context);
			let obj2 = this.obj2._handle_eval(context);
			this._modify(operator, obj1, obj2, value);
		}

		_get(container, key)
		{
			if (typeof(container) === "string" || ul4._islist(container))
			{
				if (key instanceof ul4.slice)
				{
					let start = key.start, stop = key.stop;
					if (typeof(start) === "undefined" || start === null)
						start = 0;
					if (typeof(stop) === "undefined" || stop === null)
						stop = container.length;
					return container.slice(start, stop);
				}
				else
				{
					let orgkey = key;
					if (key < 0)
						key += container.length;
					if (key < 0 || key >= container.length)
						throw new ul4.IndexError(container, orgkey);
					return container[key];
				}
			}
			else if (container && typeof(container.__getitem__) === "function") // objects without ``_getitem__`` don't support item access
				return container.__getitem__(key);
			else if (ul4._ismap(container))
				return container.get(key);
			else
				throw new ul4.TypeError(ul4._type(container) + " object is not subscriptable");
		}

		_set(container, key, value)
		{
			if (ul4._islist(container))
			{
				if (key instanceof ul4.slice)
				{
					let start = key.start, stop = key.stop;
					if (start === null)
						start = 0;
					else if (start < 0)
						start += container.length;
					if (start < 0)
						start = 0;
					else if (start > container.length)
						start = container.length;
					if (stop === null)
						stop = container.length;
					else if (stop < 0)
						stop += container.length;
					if (stop < 0)
						stop = 0;
					else if (stop > container.length)
						stop = container.length;
					if (stop < start)
						stop = start;
					container.splice(start, stop-start); // Remove old element
					for (let iter = ul4._iter(value);;)
					{
						let item = iter.next();
						if (item.done)
							break;
						container.splice(start++, 0, item.value);
					}
				}
				else
				{
					let orgkey = key;
					if (key < 0)
						key += container.length;
					if (key < 0 || key >= container.length)
						throw new ul4.IndexError(container, orgkey);
					container[key] = value;
				}
			}
			else if (container && typeof(container.__setitem__) === "function") // test this before the generic object test
				container.__setitem__(key, value);
			else if (ul4._ismap(container))
				container.set(key, value);
			else if (ul4._isobject(container))
				container[key] = value;
			else
				throw new ul4.NotSubscriptableError(container);
		}

		_modify(operator, container, key, value)
		{
			this._set(container, key, operator._ido(this._get(container, key), value));
		}
	};

	// Identifty test operator ``is``
	ul4.IsAST = class IsAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return obj1 === obj2;
		}
	};

	// Inverted identity test operator ``is not``
	ul4.IsNotAST = class IsNotAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return obj1 !== obj2;
		}
	};

	// Comparison operator ==
	ul4.EQAST = class EQAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return ul4._eq(obj1, obj2);
		}
	};

	// Comparison operator !=
	ul4.NEAST = class NEAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return ul4._ne(obj1, obj2);
		}
	};

	// Comparison operator <
	ul4.LTAST = class LTAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return ul4._lt(obj1, obj2);
		}
	};

	// Comparison operator <=
	ul4.LEAST = class LEAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return ul4._le(obj1, obj2);
		}
	};

	// Comparison operator >
	ul4.GTAST = class GTAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return ul4._gt(obj1, obj2);
		}
	};

	// Comparison operator >=
	ul4.GEAST = class GEAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return ul4._ge(obj1, obj2);
		}
	};

	// Containment test: string in string, obj in list, key in dict, value in rgb
	ul4.ContainsAST = class ContainsAST extends ul4.BinaryAST
	{
		_do(obj, container)
		{
			if (typeof(obj) === "string" && typeof(container) === "string")
			{
				return container.indexOf(obj) !== -1;
			}
			else if (ul4._islist(container))
			{
				return container.indexOf(obj) !== -1;
			}
			else if (container && typeof(container.__contains__) === "function") // test this before the generic object test
				return container.__contains__(obj);
			else if (ul4._ismap(container) || ul4._isset(container))
				return container.has(obj);
			else if (ul4._isobject(container))
			{
				for (let key in container)
				{
					if (key === obj)
						return true;
				}
				return false;
			}
			else if (ul4._iscolor(container))
			{
				return container._r === obj || container._g === obj || container._b === obj || container._a === obj;
			}
			throw new ul4.TypeError(ul4._type(container) + " object is not iterable");
		}
	};

	// Inverted containment test
	ul4.NotContainsAST = class NotContainsAST extends ul4.BinaryAST
	{
		_do(obj, container)
		{
			return !ul4.ContainsAST.prototype._do(obj, container);
		}
	};

	// Addition: num + num, string + string
	ul4.AddAST = class AddAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj1 && typeof(obj1.__add__) === "function")
				return obj1.__add__(obj2);
			else if (obj2 && typeof(obj2.__radd__) === "function")
				return obj2.__radd__(obj1);
			if (obj1 === null || obj2 === null)
				throw new ul4.TypeError(ul4._type(this.obj1) + " + " + ul4._type(this.obj2) + " is not supported");
			if (ul4._islist(obj1) && ul4._islist(obj2))
				return [...obj1, ...obj2];
			else
				return obj1 + obj2;
		}

		_ido(obj1, obj2)
		{
			if (ul4._islist(obj1) && ul4._islist(obj2))
			{
				ul4.ListProtocol.append(obj1, obj2);
				return obj1;
			}
			else
				return this._do(obj1, obj2);
		}
	};

	// Substraction: num - num
	ul4.SubAST = class SubAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj1 && typeof(obj1.__sub__) === "function")
				return obj1.__sub__(obj2);
			else if (obj2 && typeof(obj2.__rsub__) === "function")
				return obj2.__rsub__(obj1);
			else if (ul4._isdate(obj1) && ul4._isdate(obj2))
				return this._date_sub(obj1, obj2);
			else if (ul4._isdatetime(obj1) && ul4._isdatetime(obj2))
				return this._datetime_sub(obj1, obj2);
			if (obj1 === null || obj2 === null)
				throw new ul4.TypeError(ul4._type(this.obj1) + " - " + ul4._type(this.obj2) + " is not supported");
			return obj1 - obj2;
		}

		_date_sub(obj1, obj2)
		{
			return this._datetime_sub(obj1._date, obj2._date);
		}

		_datetime_sub(obj1, obj2)
		{
			let swap = (obj2 > obj1);

			if (swap)
			{
				let t = obj1;
				obj1 = obj2;
				obj2 = t;
			}
			// From now on obj1 is > than obj2

			let year1 = obj1.getFullYear();
			let yearday1 = ul4.DateTimeProtocol.yearday(obj1);
			let year2 = obj2.getFullYear();
			let yearday2 = ul4.DateTimeProtocol.yearday(obj2);

			let diffdays = 0;

			while (year1 > year2)
			{
				diffdays += ul4.DateProtocol.yearday(ul4._date(year2, 12, 31));
				++year2;
			}
			diffdays += yearday1 - yearday2;

			let hours1 = obj1.getHours();
			let minutes1 = obj1.getMinutes();
			let seconds1 = obj1.getSeconds();
			let hours2 = obj2.getHours();
			let minutes2 = obj2.getMinutes();
			let seconds2 = obj2.getSeconds();

			let diffseconds = (seconds1 - seconds2) + 60 * ((minutes1 - minutes2) + 60 * (hours1 - hours2));

			let diffmilliseconds = obj1.getMilliseconds() - obj2.getMilliseconds();

			if (swap)
			{
				diffdays = -diffdays;
				diffseconds = -diffseconds;
				diffmilliseconds = -diffmilliseconds;
			}
			return new ul4.TimeDelta(diffdays, diffseconds, 1000*diffmilliseconds);
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};


	// Multiplication: num * num, int * str, str * int, int * list, list * int
	ul4.MulAST = class MulAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj1 && typeof(obj1.__mul__) === "function")
				return obj1.__mul__(obj2);
			else if (obj2 && typeof(obj2.__rmul__) === "function")
				return obj2.__rmul__(obj1);
			if (obj1 === null || obj2 === null)
				throw new ul4.TypeError(ul4._type(obj1) + " * " + ul4._type(obj2) + " not supported");
			else if (ul4._isint(obj1) || ul4._isbool(obj1))
			{
				if (typeof(obj2) === "string")
				{
					if (obj1 < 0)
						throw new ul4.ValueError("repetition counter must be positive");
					return ul4._str_repeat(obj2, obj1);
				}
				else if (ul4._islist(obj2))
				{
					if (obj1 < 0)
						throw new ul4.ValueError("repetition counter must be positive");
					return ul4._list_repeat(obj2, obj1);
				}
			}
			else if (ul4._isint(obj2) || ul4._isbool(obj2))
			{
				if (typeof(obj1) === "string")
				{
					if (obj2 < 0)
						throw new ul4.ValueError("repetition counter must be positive");
					return ul4._str_repeat(obj1, obj2);
				}
				else if (ul4._islist(obj1))
				{
					if (obj2 < 0)
						throw new ul4.ValueError("repetition counter must be positive");
					return ul4._list_repeat(obj1, obj2);
				}
			}
			return obj1 * obj2;
		}

		_ido(obj1, obj2)
		{
			if (ul4._islist(obj1) && ul4._isint(obj2))
			{
				if (obj2 > 0)
				{
					let i = 0;
					let targetsize = obj1.length * obj2;
					while (obj1.length < targetsize)
						obj1.push(obj1[i++]);
				}
				else
					obj1.splice(0, obj1.length);
				return obj1;
			}
			else
				return this._do(obj1, obj2);
		}
	};

	// Truncating division
	ul4.FloorDivAST = class FloorDivAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj1 && typeof(obj1.__floordiv__) === "function")
				return obj1.__floordiv__(obj2);
			else if (obj2 && typeof(obj2.__rfloordiv__) === "function")
				return obj2.__rfloordiv__(obj1);
			if (obj1 === null || obj2 === null)
				throw new ul4.TypeError(ul4._type(obj1) + " // " + ul4._type(obj2) + " not supported");
			else if (typeof(obj1) === "number" && typeof(obj2) === "number" && obj2 === 0)
				throw new ul4.ZeroDivisionError();
			return Math.floor(obj1 / obj2);
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	// "Real" division
	ul4.TrueDivAST = class TrueDivAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj1 && typeof(obj1.__truediv__) === "function")
				return obj1.__truediv__(obj2);
			else if (obj2 && typeof(obj2.__rtruediv__) === "function")
				return obj2.__rtruediv__(obj1);
			if (obj1 === null || obj2 === null)
				throw new ul4.TypeError(ul4._type(obj1) + " / " + ul4._type(obj2) + " not supported");
			else if (typeof(obj1) === "number" && typeof(obj2) === "number" && obj2 === 0)
				throw new ul4.ZeroDivisionError();
			return obj1 / obj2;
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	// Modulo
	ul4.ModAST = class ModAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			return ul4._mod(obj1, obj2);
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	// Bitwise left shift
	ul4.ShiftLeftAST = class ShiftLeftAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj2 === false)
				obj2 = 0;
			else if (obj2 === true)
				obj2 = 1;
			if (obj2 < 0)
				return ul4.ShiftRightAST.prototype._do(obj1, -obj2);
			if (obj1 === false)
				obj1 = 0;
			else if (obj1 === true)
				obj1 = 1;
			while (obj2--)
				obj1 *= 2;
			return obj1;
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	// Bitwise right shift
	ul4.ShiftRightAST = class ShiftRightAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj2 === false)
				obj2 = 0;
			else if (obj2 === true)
				obj2 = 1;
			if (obj2 < 0)
				return ul4.ShiftLeftAST.prototype._do(obj1, -obj2);
			if (obj1 === false)
				obj1 = 0;
			else if (obj1 === true)
				obj1 = 1;
			while (obj2--)
				obj1 /= 2;
			return Math.floor(obj1);
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	// Bitwise and
	ul4.BitAndAST = class BitAndAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj2 === false)
				obj2 = 0;
			else if (obj2 === true)
				obj2 = 1;
			return obj1 & obj2;
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	// Bitwise exclusive or
	ul4.BitXOrAST = class BitXOrAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj2 === false)
				obj2 = 0;
			else if (obj2 === true)
				obj2 = 1;
			return obj1 ^ obj2;
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	// Bitwise or
	ul4.BitOrAST = class BitOrAST extends ul4.BinaryAST
	{
		_do(obj1, obj2)
		{
			if (obj2 === false)
				obj2 = 0;
			else if (obj2 === true)
				obj2 = 1;
			return obj1 | obj2;
		}

		_ido(obj1, obj2)
		{
			return this._do(obj1, obj2);
		}
	};

	ul4.AndAST = class AndAST extends ul4.BinaryAST
	{
		_eval(context)
		{
			let obj1 = this.obj1._handle_eval(context);
			if (!ul4._bool(obj1))
				return obj1;
			let obj2 = this.obj2._handle_eval(context);
			return obj2;
		}
	};

	ul4.OrAST = class OrAST extends ul4.BinaryAST
	{
		_eval(context)
		{
			let obj1 = this.obj1._handle_eval(context);
			if (ul4._bool(obj1))
				return obj1;
			let obj2 = this.obj2._handle_eval(context);
			return obj2;
		}
	};

	ul4.AttrAST = class AttrAST extends ul4.CodeAST
	{
		constructor(template, pos, obj, attrname)
		{
			super(template, pos);
			this.obj = obj;
			this.attrname = attrname;
		}

		_repr(out)
		{
			out.push("<AttrAST");
			out.push(" obj=");
			this.obj._repr(out);
			out.push(" attrname=");
			out.push(ul4._repr(this.attrname));
			out.push(">");
		}

		_eval(context)
		{
			let obj = this.obj._handle_eval(context);
			let result = this._get(obj, this.attrname);
			return result;
		}

		_eval_set(context, value)
		{
			let obj = this.obj._handle_eval(context);
			this._set(obj, this.attrname, value);
		}

		_eval_modify(context, operator, value)
		{
			let obj = this.obj._handle_eval(context);
			this._modify(operator, obj, this.attrname, value);
		}

		_get(object, attrname)
		{
			let proto = ul4.Protocol.get(object);
			try
			{
				return proto.getattr(object, attrname);
			}
			catch (exc)
			{
				if (exc instanceof ul4.AttributeError && exc.obj === object)
					return undefined;
				else
					throw exc;
			}
		}

		_set(object, attrname, value)
		{
			if (typeof(object) === "object" && typeof(object.__setattr__) === "function")
				object.__setattr__(attrname, value);
			else if (ul4._ismap(object))
				object.set(attrname, value);
			else if (ul4._isobject(object))
				object[attrname] = value;
			else
				throw new ul4.TypeError(ul4._type(object) + " object has no writable attributes");
		}

		_modify(operator, object, attrname, value)
		{
			let oldvalue = this._get(object, attrname);
			let newvalue = operator._ido(oldvalue, value);
			this._set(object, attrname, newvalue);
		}
	};

	ul4.AttrAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["obj", "attrname"]);

	ul4.CallAST = class CallAST extends ul4.CodeAST
	{
		constructor(template, pos, obj, args)
		{
			super(template, pos);
			this.obj = obj;
			this.args = args;
		}

		_repr(out)
		{
			out.push("<CallAST");
			out.push(" obj=");
			this.obj._repr(out);
			for (let i = 0; i < this.args.length; ++i)
			{
				let arg = this.args[i];
				out.push(" ");
				arg._repr(out);
			}
			out.push(">");
		}

		_makeargs(context)
		{
			let args = [], kwargs = {};
			for (let i = 0; i < this.args.length; ++i)
			{
				let arg = this.args[i];
				arg._handle_eval_call(context, args, kwargs);
			}
			return {args: args, kwargs: kwargs};
		}

		_handle_eval(context)
		{
			try
			{
				return this._eval(context);
			}
			catch (exc)
			{
				this._decorate_exception(exc);
				throw exc;
			}
		}

		_eval(context)
		{
			let obj = this.obj._handle_eval(context);
			let args = this._makeargs(context);
			let result = ul4._call(context, obj, args.args, args.kwargs);
			return result;
		}
	};

	ul4.CallAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["obj", "args"]);

	ul4.RenderAST = class RenderAST extends ul4.CallAST
	{
		constructor(template, pos, obj, args)
		{
			super(template, pos, obj, args);
			this.indent = null;
		}

		_repr(out)
		{
			out.push("<");
			out.push(this._reprname);
			out.push("<RenderAST");
			out.push(" indent=");
			out.push(ul4._repr(this.indent));
			out.push(" obj=");
			this.obj._repr(out);
			out.push(0);
			for (let i = 0; i < this.args.length; ++i)
			{
				let arg = this.args[i];
				out.push(" ");
				arg._repr(out);
				out.push(0);
			}
			out.push(-1);
			out.push(">");
		}

		_str(out)
		{
			out.push("render ");
			out.push(this.tag.code.replace(/\r?\n/g, ' '));
			if (this.indent !== null)
			{
				out.push(" with indent ");
				out.push(ul4._repr(this.indent.text));
			}
		}

		_handle_eval(context)
		{
			let localcontext = context.withindent(this.indent !== null ? this.indent.text : null);
			let obj = this.obj._handle_eval(localcontext);
			let args = this._makeargs(localcontext);
			this._handle_additional_arguments(localcontext, args);

			try
			{
				let result = ul4._callrender(localcontext, obj, args.args, args.kwargs);
				return result;
			}
			catch (exc)
			{
				this._decorate_exception(exc);
				throw exc;
			}
		}

		_handle_additional_arguments(context, args)
		{
		}
	};

	ul4.RenderAST.prototype._ul4onattrs = ul4.CallAST.prototype._ul4onattrs.concat(["indent"]);
	ul4.RenderAST.prototype._reprname = "RenderAST";

	ul4.RenderXAST = class RenderXAST extends ul4.RenderAST
	{
		_handle_eval(context)
		{
			context.escapes.push(ul4._xmlescape);

			let result = null;
			try
			{
				result = super._handle_eval(context);
			}
			finally
			{
				context.escapes.splice(context.escapes.length-1, 1);
			}
			return result;
		}
	};

	ul4.RenderBlockAST = class RenderBlockAST extends ul4.RenderAST
	{
		_handle_additional_arguments(context, args)
		{
			if (args.kwargs.hasOwnProperty("content"))
				throw new ul4.ArgumentError("duplicate keyword argument content");
			let closure = new ul4.TemplateClosure(this.content, this.content.signature, context.vars);
			args.kwargs.content = closure;
		}
	};

	ul4.RenderBlockAST.prototype._ul4onattrs = ul4.RenderAST.prototype._ul4onattrs.concat(["content"]);

	ul4.RenderBlocksAST = class RenderBlocksAST extends ul4.RenderAST
	{
		_handle_additional_arguments(context, args)
		{
			let localcontext = context.inheritvars();
			ul4.BlockAST.prototype._eval.call(this, localcontext);

			for (let key in localcontext.vars)
			{
				if (localcontext.vars.hasOwnProperty(key))
				{
					if (key in args.kwargs)
						throw new ul4.ArgumentError("duplicate keyword argument " + key);
					args.kwargs[key] = localcontext.get(key);
				}
			}
		}
	};

	ul4.RenderBlocksAST.prototype._ul4onattrs = ul4.RenderAST.prototype._ul4onattrs.concat(["content"]);

	// Slice object
	ul4.slice = class slice extends ul4.Proto
	{
		constructor(start, stop)
		{
			super();
			this.start = start;
			this.stop = stop;
		}

		of(string)
		{
			let start = this.start || 0;
			let stop = this.stop === null ? string.length : this.stop;
			return string.slice(start, stop);
		}

		__repr__()
		{
			return "slice(" + ul4._repr(this.start) + ", " + ul4._repr(this.stop) + ", None)";
		}

		__getattr__(attrname)
		{
			switch (attrname)
			{
				case "start":
					return this.start;
				case "stop":
					return this.stop;
				default:
					throw new ul4.AttributeError(this, attrname);
			}
		}
	};


	// List/String slice
	ul4.SliceAST = class SliceAST extends ul4.CodeAST
	{
		constructor(template, pos, index1, index2)
		{
			super(template, pos);
			this.index1 = index1;
			this.index2 = index2;
		}

		_repr(out)
		{
			out.push("<SliceAST");
			if (this.index1 !== null)
			{
				out.push(" index1=");
				this.index1._repr(out);
			}
			if (this.index2 !== null)
			{
				out.push(" index2=");
				this.index2._repr(out);
			}
			out.push(">");
		}

		_eval(context)
		{
			let index1 = this.index1 !== null ? this.index1._handle_eval(context) : null;
			let index2 = this.index2 !== null ? this.index2._handle_eval(context) : null;
			return new ul4.slice(index1, index2);
		}
	};

	ul4.SliceAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["index1", "index2"]);

	ul4.SetVarAST = class SetVarAST extends ul4.CodeAST
	{
		constructor(template, pos, lvalue, value)
		{
			super(template, pos);
			this.lvalue = lvalue;
			this.value = value;
		}

		_repr(out)
		{
			out.push("<");
			out.push(this.constructor.name);
			out.push(" lvalue=");
			out.push(ul4._repr(this.lvalue));
			out.push(" value=");
			this.value._repr(out);
			out.push(">");
		}

		_eval(context)
		{
			let value = this.value._handle_eval(context);
			let items = ul4._unpackvar(this.lvalue, value);
			for (let i = 0; i < items.length; ++i)
			{
				let [lvalue, value] = items[i];
				lvalue._handle_eval_set(context, value);
			}
		}
	};

	ul4.SetVarAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["lvalue", "value"]);

	ul4.ModifyVarAST = class ModifyVarAST extends ul4.SetVarAST
	{
		_eval(context)
		{
			let value = this.value._handle_eval(context);
			let items = ul4._unpackvar(this.lvalue, value);
			for (let i = 0; i < items.length; ++i)
			{
				let [lvalue, value] = items[i];
				lvalue._handle_eval_modify(context, this._operator, value);
			}
		}
	};

	ul4.AddVarAST = class AddVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.AddVarAST.prototype._operator = ul4.AddAST.prototype;

	ul4.SubVarAST = class SubVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.SubVarAST.prototype._operator = ul4.SubAST.prototype;

	ul4.MulVarAST = class MulVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.MulVarAST.prototype._operator = ul4.MulAST.prototype;

	ul4.TrueDivVarAST = class TrueDivVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.TrueDivVarAST.prototype._operator = ul4.TrueDivAST.prototype;

	ul4.FloorDivVarAST = class FloorDivVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.FloorDivVarAST.prototype._operator = ul4.FloorDivAST.prototype;

	ul4.ModVarAST = class ModVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.ModVarAST.prototype._operator = ul4.ModAST.prototype;

	ul4.ShiftLeftVarAST = class ShiftLeftVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.ShiftLeftVarAST.prototype._operator = ul4.ShiftLeftAST.prototype;

	ul4.ShiftRightVarAST = class ShiftRightVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.ShiftRightVarAST.prototype._operator = ul4.ShiftRightAST.prototype;

	ul4.BitAndVarAST = class BitAndVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.BitAndVarAST.prototype._operator = ul4.BitAndAST.prototype;

	ul4.BitXOrVarAST = class BitXOrVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.BitXOrVarAST.prototype._operator = ul4.BitXOrAST.prototype;

	ul4.BitOrVarAST = class BitOrVarAST extends ul4.ModifyVarAST
	{
	};

	ul4.BitOrVarAST.prototype._operator = ul4.BitOrAST.prototype;

	ul4.BlockAST = class BlockAST extends ul4.CodeAST
	{
		constructor(template, pos)
		{
			super(template, pos);
			this.content = [];
		}

		_eval(context)
		{
			for (let i = 0; i < this.content.length; ++i)
			{
				let item = this.content[i];
				item._handle_eval(context);
			}
		}

		_str(out)
		{
			if (this.content.length)
			{
				for (let i = 0; i < this.content.length; ++i)
				{
					let item = this.content[i];
					item._str(out);
					out.push(0);
				}
			}
			else
			{
				out.push("pass");
				out.push(0);
			}
		}
	};

	ul4.BlockAST.prototype._ul4onattrs = ul4.CodeAST.prototype._ul4onattrs.concat(["content"]);

	ul4.ForBlockAST = class ForBlockAST extends ul4.BlockAST
	{
		constructor(template, pos, varname, container)
		{
			super(template, pos);
			this.varname = varname;
			this.container = container;
		}

		_repr(out)
		{
			out.push("<ForBlockAST");
			out.push(" varname=");
			out.push(ul4._repr(this.varname));
			out.push(" container=");
			this.container._repr(out);
			out.push(">");
		}

		_str_varname(out, varname)
		{
			if (ul4._islist(varname))
			{
				out.push("(");
				for (let i = 0; i < varname.length; ++i)
				{
					if (i)
						out.push(", ");
					this._str_varname(out, varname[i]);
				}
				if (varname.length == 1)
					out.push(",");
				out.push(")");
			}
			else
				varname._str(out);
		}

		_eval(context)
		{
			let container = this.container._handle_eval(context);

			for (let iter = ul4._iter(container);;)
			{
				let value = iter.next();
				if (value.done)
					break;
				let varitems = ul4._unpackvar(this.varname, value.value);
				for (let i = 0; i < varitems.length; ++i)
				{
					let [lvalue, value] = varitems[i];
					lvalue._handle_eval_set(context, value);
				}
				try
				{
					// We can't call _handle_eval() here, as this would in turn call this function again, leading to infinite recursion
					// But we don't have to, as wrapping original exception in ``Error`` has already been done by the lower levels
					super._eval(context);
				}
				catch (exc)
				{
					if (exc instanceof ul4.BreakException)
						break;
					else if (exc instanceof ul4.ContinueException)
						;
					else
						throw exc;
				}
			}
		}

		_str(out)
		{
			out.push("for ");
			this._str_varname(out, this.varname);
			out.push(" in ");
			this.container._str(out);
			out.push(":");
			out.push(+1);
			ul4.BlockAST.prototype._str.call(this, out);
			out.push(-1);
		}
	};

	ul4.ForBlockAST.prototype._ul4onattrs = ul4.BlockAST.prototype._ul4onattrs.concat(["varname", "container"]);

	ul4.WhileBlockAST = class WhileBlockAST extends ul4.BlockAST
	{
		constructor(template, pos, condition)
		{
			super(template, pos);
			this.condition = condition;
		}

		_repr(out)
		{
			out.push("<WhileAST");
			out.push(" condition=");
			this.condition._repr(out);
			out.push(">");
		}

		_str(out)
		{
			out.push("while ");
			this.condition._repr(out);
			out.push(":");
			out.push(+1);
			ul4.BlockAST.prototype._str.call(this, out);
			out.push(-1);
		}

		_eval(context)
		{
			while (true)
			{
				let cond = this.condition._handle_eval(context);
				if (!ul4._bool(cond))
					break;
				try
				{
					// We can't call _handle_eval() here, as this would in turn call this function again, leading to infinite recursion
					// But we don't have to, as wrapping the original exception in ``Error`` has already been done by the lower levels
					super._eval(context);
				}
				catch (exc)
				{
					if (exc instanceof ul4.BreakException)
						break;
					else if (exc instanceof ul4.ContinueException)
						;
					else
						throw exc;
				}
			}
		}
	};

	ul4.WhileBlockAST.prototype._ul4onattrs = ul4.BlockAST.prototype._ul4onattrs.concat(["condition"]);

	ul4.BreakAST = class BreakAST extends ul4.CodeAST
	{
		_eval(context)
		{
			throw new ul4.BreakException();
		}

		_str(out)
		{
			out.push("break");
			out.push(0);
		}

		_repr(out)
		{
			out.push("<BreakAST>");
		}
	};

	ul4.ContinueAST = class ContinueAST extends ul4.CodeAST
	{
		_eval(context)
		{
			throw new ul4.ContinueException();
		}

		_str(out)
		{
			out.push("continue");
			out.push(0);
		}

		_repr(out)
		{
			out.push("<ContinueAST>");
		}
	};

	ul4.CondBlockAST = class CondBlockAST extends ul4.BlockAST
	{
		_eval(context)
		{
			for (let i = 0; i < this.content.length; ++i)
			{
				let block = this.content[i];
				let execute = block._execute(context);
				if (execute)
				{
					block._handle_eval(context);
					break;
				}
			}
		}
	};

	ul4.ConditionalBlockAST = class ConditionalBlockAST extends  ul4.BlockAST
	{
		constructor(template, pos, condition)
		{
			super(template, pos);
			this.condition = condition;
		}

		_repr(out)
		{
			out.push("<");
			out.push(this.constructor.name);
			out.push(" condition=");
			this.condition._repr(out);
			out.push(">");
		}

		_str(out)
		{
			out.push(this._strname);
			out.push(" ");
			this.condition._str(out);
			out.push(":");
			out.push(+1);
			ul4.BlockAST.prototype._str.call(this, out);
			out.push(-1);
		}

		_execute(context)
		{
			let cond = this.condition._handle_eval(context);
			let result = ul4._bool(cond);
			return result;
		}
	};

	ul4.ConditionalBlockAST.prototype._ul4onattrs = ul4.BlockAST.prototype._ul4onattrs.concat(["condition"]);

	ul4.IfBlockAST = class IfBlockAST extends ul4.ConditionalBlockAST
	{
	};

	ul4.IfBlockAST.prototype._strname = "if";

	ul4.ElIfBlockAST = class ElIfBlockAST extends ul4.ConditionalBlockAST
	{
	};

	ul4.ElIfBlockAST.prototype._strname = "else if";

	ul4.ElseBlockAST = class ElseBlockAST extends ul4.BlockAST
	{
		_repr(out)
		{
			out.push("<ElseAST");
			out.push(">");
		}

		_str(out)
		{
			out.push("else:");
			out.push(+1);
			ul4.BlockAST.prototype._str.call(this, out);
			out.push(-1);
		}

		_execute(context)
		{
			return true;
		}
	};

	ul4.Template = class Template extends ul4.BlockAST
	{
		constructor(template, pos, source, name, whitespace, startdelim, enddelim, signature)
		{
			super(template, pos);
			this._source = source;
			this.name = name;
			this.whitespace = whitespace;
			this.startdelim = startdelim;
			this.enddelim = enddelim;
			this.docpos = null;
			this.signature = signature;
			this._asts = null;
			this._ul4_callsignature = signature;
			this._ul4_rendersignature = signature;
			this.parenttemplate = null;
		}

		__getattr__(attrname)
		{
			let self = this;
			switch (attrname)
			{
				case "content":
					return this.content;
				case "source":
					return this.source;
				case "name":
					return this.name;
				case "whitespace":
					return this.whitespace;
				case "startdelim":
					return this.startdelim;
				case "enddelim":
					return this.enddelim;
				case "doc":
					return this.doc();
				case "signature":
					return this.signature;
				case "parenttemplate":
					return this.parenttemplate;
				case "render":
					let render = function render(context, vars){ self._renderbound(context, vars); };
					ul4.expose(render, this.signature, {needscontext: true, needsobject: true});
					return render;
				case "renders":
					let renders = function renders(context, vars){ return self._rendersbound(context, vars); };
					ul4.expose(renders, this.signature, {needscontext: true, needsobject: true});
					return renders;
				default:
					return super.__getattr__(attrname);
			}
		}

		ul4ondump(encoder)
		{
			let signature;
			encoder.dump(ul4.version);
			encoder.dump(this.name);
			encoder.dump(this._source);
			encoder.dump(this.whitespace);
			encoder.dump(this.startdelim);
			encoder.dump(this.enddelim);
			encoder.dump(this.docpos);
			encoder.dump(this.parenttemplate);
			if (this.signature === null || this.signature instanceof ul4.SignatureAST)
				signature = this.signature;
			else
			{
				signature = [];
				for (let i = 0; i < this.signature.args.length; ++i)
				{
					let arg = this.signature.args[i];
					if (typeof(arg.defaultValue) === "undefined")
						signature.push(arg.name);
					else
						signature.push(arg.name+"=", arg.defaultValue);
				}
				if (this.signature.remargs !== null)
					signature.push("*" + this.signature.remargs);
				if (this.signature.remkwargs !== null)
					signature.push("**" + this.signature.remkwargs);
			}
			encoder.dump(signature);
			super.ul4ondump(encoder);
		}

		ul4onload(decoder)
		{
			let version = decoder.load();
			let signature;

			if (version === null)
				throw new ul4.ValueError("UL4ON doesn't support templates in 'source' format in Javascript implementation");

			if (version !== ul4.version)
				throw new ul4.ValueError("invalid version, expected " + ul4.version + ", got " + version);

			this.name = decoder.load();
			this._source = decoder.load();
			this.whitespace = decoder.load();
			this.startdelim = decoder.load();
			this.enddelim = decoder.load();
			this.docpos = decoder.load();
			this.parenttemplate = decoder.load();
			signature = decoder.load();
			if (ul4._islist(signature))
				signature = new ul4.Signature(...signature);
			this.signature = signature;
			this._ul4_callsignature = signature;
			this._ul4_rendersignature = signature;
			super.ul4onload(decoder);
		}

		loads(string)
		{
			return ul4.loads(string);
		}

		_eval(context)
		{
			let signature = null;
			if (this.signature !== null)
				signature = this.signature._handle_eval(context);
			let closure = new ul4.TemplateClosure(this, signature, context.vars);
			context.set(this.name, closure);
		}

		_repr(out)
		{
			out.push("<Template");
			if (this.name !== null)
			{
				out.push(" name=");
				out.push(ul4._repr(this.name));
			}
			out.push(" whitespace=");
			out.push(ul4._repr(this.whitespace));
			if (this.startdelim !== "<?")
			{
				out.push(" startdelim=");
				out.push(ul4._repr(this.startdelim));
			}
			if (this.enddelim !== "?>")
			{
				out.push(" enddelim=");
				out.push(ul4._repr(this.enddelim));
			}
			out.push(">");
		}

		_str(out)
		{
			out.push("def ");
			out.push(this.name ? this.name : "unnamed");
			out.push(":");
			out.push(+1);
			ul4.BlockAST.prototype._str.call(this, out);
			out.push(-1);
		}

		_renderbound(context, vars)
		{
			let localcontext = context.clone();
			localcontext.vars = vars;
			try
			{
				ul4.BlockAST.prototype._eval.call(this, localcontext);
			}
			catch (exc)
			{
				if (!(exc instanceof ul4.ReturnException))
					throw exc;
			}
		}

		__render__(context, vars)
		{
			this._renderbound(context, vars);
		}

		render(context, vars)
		{
			this._renderbound(context, vars);
		}

		_rendersbound(context, vars)
		{
			let localcontext = context.replaceoutput();
			this._renderbound(localcontext, vars);
			return localcontext.getoutput();
		}

		renders(vars)
		{
			vars = vars || {};
			let context = new ul4.Context();
			if (this.signature !== null)
				vars = this.signature.bindObject(this.name, [], vars);
			return this._rendersbound(context, vars);
		}

		doc()
		{
			return this.docpos != null ? this.docpos.of(this._source) : null;
		}

		_callbound(context, vars)
		{
			let localcontext = context.clone();
			localcontext.vars = vars;
			try
			{
				ul4.BlockAST.prototype._eval.call(this, localcontext);
			}
			catch (exc)
			{
				if (exc instanceof ul4.ReturnException)
					return exc.result;
				else
					throw exc;
			}
			return null;
		}

		call(vars)
		{
			vars = vars || {};
			let context = new ul4.Context();
			if (this.signature !== null)
				vars = this.signature.bindObject(this.name, [], vars);
			return this._callbound(context, vars);
		}

		__call__(context, vars)
		{
			return this._callbound(context, vars);
		}

		ul4type()
		{
			return "template";
		}
	};

	ul4.Template.prototype._ul4_callneedsobject = true;
	ul4.Template.prototype._ul4_callneedscontext = true;
	ul4.Template.prototype._ul4_renderneedsobject = true;
	ul4.Template.prototype._ul4_renderneedscontext = true;

	ul4.SignatureAST = class SignatureAST extends ul4.CodeAST
	{
		constructor(template, pos)
		{
			super(template, pos);
			this.params = [];
		}

		ul4ondump(encoder)
		{
			super.ul4ondump(encoder);

			let dump = [];

			for (let i = 0; i < this.params.length; ++i)
			{
				let param = this.params[i];
				if (param[1] === null)
					dump.push(param[0]);
				else
					dump.push(param);
			}
			encoder.dump(dump);
		}

		ul4onload(decoder)
		{
			super.ul4onload(decoder);
			let dump = decoder.load();
			this.params = [];
			for (let i = 0; i < dump.length; ++i)
			{
				let param = dump[i];
				if (typeof(param) === "string")
					this.params.push([param, null]);
				else
					this.params.push(param);
			}
		}

		_eval(context)
		{
			let args = [];
			for (let i = 0; i < this.params.length; ++i)
			{
				let param = this.params[i];
				if (param[1] === null)
					args.push(param[0]);
				else
				{
					args.push(param[0] + "=");
					args.push(param[1]._handle_eval(context));
				}
			}
			return new ul4.Signature(...args);
		}

		_repr(out)
		{
			out.push("<");
			out.push(this.constructor.name);
			out.push(" params=");
			this.params._repr(out);
			out.push(">");
		}
	};

	ul4.TemplateClosure = class TemplateClosure extends ul4.Proto
	{
		constructor(template, signature, vars)
		{
			super();
			this.template = template;
			this.signature = signature;
			this.vars = vars;
			this._ul4_callsignature = signature;
			this._ul4_rendersignature = signature;
			// Copy over the required attribute from the template
			this.name = template.name;
			this.tag = template.tag;
			this.endtag = template.endtag;
			this._source = template._source;
			this.startdelim = template.startdelim;
			this.enddelim = template.enddelim;
			this.docpos = template.docpos;
			this.content = template.content;
		}

		__render__(context, vars)
		{
			this.template._renderbound(context, ul4._inherit(this.vars, vars));
		}

		render(context, vars)
		{
			this.template._renderbound(context, ul4._inherit(this.vars, vars));
		}

		__call__(context, vars)
		{
			return this.template._callbound(context, ul4._inherit(this.vars, vars));
		}

		_renderbound(context, vars)
		{
			this.template._renderbound(context, ul4._inherit(this.vars, vars));
		}

		_rendersbound(context, vars)
		{
			return this.template._rendersbound(context, ul4._inherit(this.vars, vars));
		}

		__getattr__(attrname)
		{
			let self = this;
			switch (attrname)
			{
				case "render":
					let render = function render(context, vars){ self._renderbound(context, vars); };
					ul4.expose(render, this.signature, {needscontext: true, needsobject: true});
					return render;
				case "renders":
					let renders = function renders(context, vars){ return self._rendersbound(context, vars); };
					ul4.expose(renders, this.signature, {needscontext: true, needsobject: true});
					return renders;
				case "signature":
					return this.signature;
				default:
					return this.template.__getattr__(attrname);
			}
		}

		ul4type()
		{
			return "template";
		}
	};

	ul4.TemplateClosure.prototype._ul4_callneedsobject = true;
	ul4.TemplateClosure.prototype._ul4_callneedscontext = true;
	ul4.TemplateClosure.prototype._ul4_renderneedsobject = true;
	ul4.TemplateClosure.prototype._ul4_renderneedscontext = true;

	// Create a color object from the red, green, blue and alpha values ``r``, ``g``, ``b`` and ``b``
	ul4._rgb = function _rgb(r, g, b, a)
	{
		return new this.Color(255*r, 255*g, 255*b, 255*a);
	};

	// Convert ``obj`` to a string and escape the characters ``&``, ``<``, ``>``, ``'`` and ``"`` with their XML character/entity reference
	ul4._xmlescape = function _xmlescape(obj)
	{
		obj = ul4._str(obj);
		obj = obj.replace(/&/g, "&amp;");
		obj = obj.replace(/</g, "&lt;");
		obj = obj.replace(/>/g, "&gt;");
		obj = obj.replace(/'/g, "&#39;");
		obj = obj.replace(/"/g, "&quot;");
		return obj;
	};

	// Convert ``obj`` to a string suitable for output into a CSV file
	ul4._csv = function _csv(obj)
	{
		if (obj === null)
			return "";
		else if (typeof(obj) !== "string")
			obj = ul4._repr(obj);
		if (obj.indexOf(",") !== -1 || obj.indexOf('"') !== -1 || obj.indexOf("\n") !== -1)
			obj = '"' + obj.replace(/"/g, '""') + '"';
		return obj;
	};

	// Return a string containing one character with the codepoint ``i``
	ul4._chr = function _chr(i)
	{
		if (typeof(i) != "number")
			throw new ul4.TypeError("chr() requires an int");
		return String.fromCharCode(i);
	};

	// Return the codepoint for the one and only character in the string ``c``
	ul4._ord = function _ord(c)
	{
		if (typeof(c) != "string" || c.length != 1)
			throw new ul4.TypeError("ord() requires a string of length 1");
		return c.charCodeAt(0);
	};

	// Convert an integer to a hexadecimal string
	ul4._hex = function _hex(number)
	{
		if (typeof(number) != "number")
			throw new ul4.TypeError("hex() requires an int");
		if (number < 0)
			return "-0x" + number.toString(16).substr(1);
		else
			return "0x" + number.toString(16);
	};

	// Convert an integer to a octal string
	ul4._oct = function _oct(number)
	{
		if (typeof(number) != "number")
			throw new ul4.TypeError("oct() requires an int");
		if (number < 0)
			return "-0o" + number.toString(8).substr(1);
		else
			return "0o" + number.toString(8);
	};

	// Convert an integer to a binary string
	ul4._bin = function _bin(number)
	{
		if (typeof(number) != "number")
			throw new ul4.TypeError("bin() requires an int");
		if (number < 0)
			return "-0b" + number.toString(2).substr(1);
		else
			return "0b" + number.toString(2);
	};

	// Return the minimum value
	ul4._min = function _min(obj)
	{
		if (obj.length == 0)
			throw new ul4.ArgumentError("min() requires at least 1 argument, 0 given");
		else if (obj.length == 1)
			obj = obj[0];
		let iter = ul4._iter(obj);
		let result;
		let first = true;
		while (true)
		{
			let item = iter.next();
			if (item.done)
			{
				if (first)
					throw new ul4.ValueError("min() argument is an empty sequence!");
				return result;
			}
			if (first || (item.value < result))
				result = item.value;
			first = false;
		}
	};

	// Return the maximum value
	ul4._max = function _max(obj)
	{
		if (obj.length == 0)
			throw new ul4.ArgumentError("max() requires at least 1 argument, 0 given");
		else if (obj.length == 1)
			obj = obj[0];
		let iter = ul4._iter(obj);
		let result;
		let first = true;
		while (true)
		{
			let item = iter.next();
			if (item.done)
			{
				if (first)
					throw new ul4.ValueError("max() argument is an empty sequence!");
				return result;
			}
			if (first || (item.value > result))
				result = item.value;
			first = false;
		}
	};

	// Return the of the values from the iterable starting with ``start`` (default ``0``)
	ul4._sum = function _sum(iterable, start=0)
	{
		for (let iter = ul4._iter(iterable);;)
		{
			let item = iter.next();
			if (item.done)
				break;
			start += item.value;
		}
		return start;
	};

	// Return the first value produced by iterating through ``iterable`` (defaulting to ``defaultValue`` if the iterator is empty)
	ul4._first = function _first(iterable, defaultValue=null)
	{
		let item = ul4._iter(iterable).next();
		return item.done ? defaultValue : item.value;
	};

	// Return the last value produced by iterating through ``iterable`` (defaulting to ``defaultValue`` if the iterator is empty)
	ul4._last = function _last(iterable, defaultValue=null)
	{
		let value = defaultValue;

		for (let iter = ul4._iter(iterable);;)
		{
			let item = iter.next();
			if (item.done)
				break;
			value = item.value;
		}
		return value;
	};

	// Return a sorted version of ``iterable``
	ul4._sorted = function _sorted(context, iterable, key=null, reverse=false)
	{
		if (key === null)
		{
			// FIXME: stability
			let cmp = reverse ? function cmp(a, b)
			{
				return -ul4._cmp("<=>", a, b);
			} : function cmp(a, b)
			{
				return ul4._cmp("<=>", a, b);
			};
			let result = ul4._list(iterable);
			result.sort(cmp);
			return result;
		}
		else
		{
			let sort = [];

			for (let i = 0, iter = ul4._iter(iterable);;++i)
			{
				let item = iter.next();
				if (item.done)
					break;
				let keyvalue = ul4._call(context, key, [item.value], {});
				// For a stable sorting we have to use the nagative index if
				// reverse sorting is specified
				sort.push([keyvalue, reverse ? -i : i, item.value]);
			}
			cmp = function cmp(s1, s2)
			{
				let res = ul4._cmp("<=>", s1[0], s2[0]);
				if (res)
					return reverse ? -res : res;
				res = ul4._cmp("<=>", s1[1], s2[1]);
				return reverse ? -res : res;
			};

			sort.sort(cmp);

			let result = [];
			for (let i = 0; i < sort.length; ++i)
			{
				let item = sort[i];
				result.push(item[2]);
			}
			return result;
		}
	};

	// Return a iterable object iterating from ``start`` up to (but not including) ``stop`` with a step size of ``step``
	ul4._range = function _range(args)
	{
		let start, stop, step;
		if (args.length < 1)
			throw new ul4.ArgumentError("required range() argument missing");
		else if (args.length > 3)
			throw new ul4.ArgumentError("range() expects at most 3 positional arguments, " + args.length + " given");
		else if (args.length == 1)
		{
			start = 0;
			stop = args[0];
			step = 1;
		}
		else if (args.length == 2)
		{
			start = args[0];
			stop = args[1];
			step = 1;
		}
		else if (args.length == 3)
		{
			start = args[0];
			stop = args[1];
			step = args[2];
		}
		let lower, higher;
		if (step === 0)
			throw new ul4.ValueError("range() requires a step argument != 0");
		else if (step > 0)
		{
			lower = start;
			higher = stop;
		}
		else
		{
			lower = stop;
			higher = start;
		}
		let length = (lower < higher) ? Math.floor((higher - lower - 1)/Math.abs(step)) + 1 : 0;

		return {
			index: 0,
			next: function()
			{
				if (this.index >= length)
					return {done: true};
				return {value: start + (this.index++) * step, done: false};
			}
		};
	};

	// Return a iterable object returning a slice from the argument
	ul4._slice = function _slice(args)
	{
		let iterable, start, stop, step;
		if (args.length < 2)
			throw new ul4.ArgumentError("required slice() argument missing");
		else if (args.length > 4)
			throw new ul4.ArgumentError("slice() expects at most 4 positional arguments, " + args.length + " given");
		else if (args.length == 2)
		{
			iterable = args[0];
			start = 0;
			stop = args[1];
			step = 1;
		}
		else if (args.length == 3)
		{
			iterable = args[0];
			start = args[1] !== null ? args[1] : 0;
			stop = args[2];
			step = 1;
		}
		else if (args.length == 4)
		{
			iterable = args[0];
			start = args[1] !== null ? args[1] : 0;
			stop = args[2];
			step = args[3] !== null ? args[3] : 1;
		}
		if (start < 0)
			throw new ul4.ValueError("slice() requires a start argument >= 0");
		if (stop < 0)
			throw new ul4.ValueError("slice() requires a stop argument >= 0");
		if (step <= 0)
			throw new ul4.ValueError("slice() requires a step argument > 0");

		let next = start, count = 0;
		let iter = ul4._iter(iterable);
		return {
			next: function() {
				let result;
				while (count < next)
				{
					result = iter.next();
					if (result.done)
						return result;
					++count;
				}
				if (stop !== null && count >= stop)
					return {done: true};
				result = iter.next();
				if (result.done)
					return result;
				++count;
				next += step;
				if (stop !== null && next > stop)
					next = stop;
				return result;
			}
		};
	};

	// ``%`` escape unsafe characters in the string ``string``
	ul4._urlquote = function _urlquote(string)
	{
		return encodeURIComponent(string);
	};

	// The inverse function of ``urlquote``
	ul4._urlunquote = function _urlunquote(string)
	{
		return decodeURIComponent(string);
	};

	// Return a reverse iterator over ``sequence``
	ul4._reversed = function _reversed(sequence)
	{
		if (typeof(sequence) != "string" && !ul4._islist(sequence)) // We don't have to materialize strings or lists
			sequence = ul4._list(sequence);
		return {
			index: sequence.length-1,
			next: function() {
				return this.index >= 0 ? {value: sequence[this.index--], done: false} : {done: true};
			}
		};
	};

	// Returns a random number in the interval ``[0;1[``
	ul4._random = function _random()
	{
		return Math.random();
	};

	// Return a randomly select item from ``range(start, stop, step)``
	ul4._randrange = function _randrange(args)
	{
		let start, stop, step;
		if (args.length < 1)
			throw new ul4.ArgumentError("required randrange() argument missing");
		else if (args.length > 3)
			throw new ul4.ArgumentError("randrange() expects at most 3 positional arguments, " + args.length + " given");
		else if (args.length == 1)
		{
			start = 0;
			stop = args[0];
			step = 1;
		}
		else if (args.length == 2)
		{
			start = args[0];
			stop = args[1];
			step = 1;
		}
		else if (args.length == 3)
		{
			start = args[0];
			stop = args[1];
			step = args[2];
		}
		let width = stop-start;

		let value = Math.random();

		let n;
		if (step > 0)
			n = Math.floor((width + step - 1) / step);
		else if (step < 0)
			n = Math.floor((width + step + 1) / step);
		else
			throw new ul4.ValueError("randrange() requires a step argument != 0");
		return start + step*Math.floor(value * n);
	};

	// Return a random item/char from the list/string ``sequence``
	ul4._randchoice = function _randchoice(sequence)
	{
		let iscolor = ul4._iscolor(sequence);
		if (typeof(sequence) !== "string" && !ul4._islist(sequence) && !iscolor)
			throw new ul4.TypeError("randchoice() requires a string or list");
		if (iscolor)
			sequence = ul4._list(sequence);
		return sequence[Math.floor(Math.random() * sequence.length)];
	};

	// Round a number ``x`` to ``digits`` decimal places (may be negative)
	ul4._round = function _round(x, digits=0)
	{
		if (digits)
		{
			let threshold = Math.pow(10, digits);
			return Math.round(x*threshold)/threshold;
		}
		else
			return Math.round(x);
	};

	// Return a hex-encode MD5 hash of the argument
	// This uses the md5 function from https://github.com/blueimp/JavaScript-MD5
	if (iscommon)
	{
		ul4._md5 = function _md5(string)
		{
			let md5 = require('blueimp-md5');
			return md5(string);
		};
	}
	else
	{
		ul4._md5 = function _md5(string)
		{
			return md5(string);
		};
	}

	// Return an iterator over ``[index, item]`` lists from the iterable object ``iterable``. ``index`` starts at ``start`` (defaulting to 0)
	ul4._enumerate = function _enumerate(iterable, start=0)
	{
		return {
			iter: ul4._iter(iterable),
			index: start,
			next: function() {
				let item = this.iter.next();
				return item.done ? item : {value: [this.index++, item.value], done: false};
			}
		};
	};

	// Return an iterator over ``[isfirst, item]`` lists from the iterable object ``iterable`` (``isfirst`` is true for the first item, false otherwise)
	ul4._isfirst = function _isfirst(iterable)
	{
		let iter = ul4._iter(iterable);
		let isfirst = true;
		return {
			next: function() {
				let item = iter.next();
				let result = item.done ? item : {value: [isfirst, item.value], done: false};
				isfirst = false;
				return result;
			}
		};
	};

	// Return an iterator over ``[islast, item]`` lists from the iterable object ``iterable`` (``islast`` is true for the last item, false otherwise)
	ul4._islast = function _islast(iterable)
	{
		let iter = ul4._iter(iterable);
		let lastitem = iter.next();
		return {
			next: function() {
				if (lastitem.done)
					return lastitem;
				let item = iter.next();
				let result = {value: [item.done, lastitem.value], done: false};
				lastitem = item;
				return result;
			}
		};
	};

	// Return an iterator over ``[isfirst, islast, item]`` lists from the iterable object ``iterable`` (``isfirst`` is true for the first item, ``islast`` is true for the last item. Both are false otherwise)
	ul4._isfirstlast = function _isfirstlast(iterable)
	{
		let iter = ul4._iter(iterable);
		let isfirst = true;
		let lastitem = iter.next();
		return {
			next: function() {
				if (lastitem.done)
					return lastitem;
				let item = iter.next();
				let result = {value: [isfirst, item.done, lastitem.value], done: false};
				lastitem = item;
				isfirst = false;
				return result;
			}
		};
	};

	// Return an iterator over ``[index, isfirst, islast, item]`` lists from the iterable object ``iterable`` (``isfirst`` is true for the first item, ``islast`` is true for the last item. Both are false otherwise)
	ul4._enumfl = function _enumfl(iterable, start=0)
	{
		let iter = ul4._iter(iterable);
		let i = start;
		let isfirst = true;
		let lastitem = iter.next();
		return {
			next: function() {
				if (lastitem.done)
					return lastitem;
				let item = iter.next();
				let result = {value: [i++, isfirst, item.done, lastitem.value], done: false};
				lastitem = item;
				isfirst = false;
				return result;
			}
		};
	};

	// Return an iterator over lists, where the i'th list consists of all i'th items from the arguments (terminating when the shortest argument ends)
	ul4._zip = function _zip(iterables)
	{
		let result;
		if (iterables.length)
		{
			let iters = [];
			for (let i = 0; i < iterables.length; ++i)
				iters.push(ul4._iter(iterables[i]));

			return {
				next: function() {
					let items = [];
					for (let i = 0; i < iters.length; ++i)
					{
						let item = iters[i].next();
						if (item.done)
							return item;
						items.push(item.value);
					}
					return {value: items, done: false};
				}
			};
		}
		else
		{
			return {
				next: function() {
					return {done: true};
				}
			};
		}
	};

	// Return the absolute value for the number ``number``
	ul4._abs = function _abs(number)
	{
		if (number !== null && typeof(number.__abs__) === "function")
			return number.__abs__();
		return Math.abs(number);
	};

	// Return a ``Date`` object from the arguments passed in
	ul4._date = function _date(year, month, day)
	{
		return new ul4.Date(year, month, day);
	};

	ul4._datetime = function _datetime(year, month, day, hour=0, minute=0, second=0, microsecond=0)
	{
		return new Date(year, month-1, day, hour, minute, second, microsecond/1000);
	};

	// Return a ``TimeDelta`` object from the arguments passed in
	ul4._timedelta = function _timedelta(days=0, seconds=0, microseconds=0)
	{
		return new this.TimeDelta(days, seconds, microseconds);
	};

	// Return a ``MonthDelta`` object from the arguments passed in
	ul4._monthdelta = function _monthdelta(months=0)
	{
		return new this.MonthDelta(months);
	};

	// Return a ``Color`` object from the hue, luminescence, saturation and alpha values ``h``, ``l``, ``s`` and ``a`` (i.e. using the HLS color model)
	ul4._hls = function _hls(h, l, s, a)
	{
		let _v = function(m1, m2, hue)
		{
			hue = hue % 1.0;
			if (hue < 1/6)
				return m1 + (m2-m1)*hue*6.0;
			else if (hue < 0.5)
				return m2;
			else if (hue < 2/3)
				return m1 + (m2-m1)*(2/3-hue)*6.0;
			return m1;
		};

		let m1, m2;
		if (typeof(a) === "undefined")
			a = 1;
		if (s === 0.0)
			return ul4._rgb(l, l, l, a);
		if (l <= 0.5)
			m2 = l * (1.0+s);
		else
			m2 = l+s-(l*s);
		m1 = 2.0*l - m2;
		return ul4._rgb(_v(m1, m2, h+1/3), _v(m1, m2, h), _v(m1, m2, h-1/3), a);
	};

	// Return a ``Color`` object from the hue, saturation, value and alpha values ``h``, ``s``, ``v`` and ``a`` (i.e. using the HSV color model)
	ul4._hsv = function _hsv(h, s, v, a)
	{
		if (s === 0.0)
			return ul4._rgb(v, v, v, a);
		let i = Math.floor(h*6.0);
		let f = (h*6.0) - i;
		let p = v*(1.0 - s);
		let q = v*(1.0 - s*f);
		let t = v*(1.0 - s*(1.0-f));
		switch (i%6)
		{
			case 0:
				return ul4._rgb(v, t, p, a);
			case 1:
				return ul4._rgb(q, v, p, a);
			case 2:
				return ul4._rgb(p, v, t, a);
			case 3:
				return ul4._rgb(p, q, v, a);
			case 4:
				return ul4._rgb(t, p, v, a);
			case 5:
				return ul4._rgb(v, p, q, a);
		}
	};

	// Return the item with the key ``key`` from the dict ``container``. If ``container`` doesn't have this key, return ``defaultvalue``
	ul4._get = function _get(container, key, defaultvalue)
	{
		if (ul4._ismap(container))
		{
			if (container.has(key))
				return container.get(key);
			return defaultvalue;
		}
		else if (ul4._isobject(container))
		{
			let result = container[key];
			if (typeof(result) === "undefined")
				return defaultvalue;
			return result;
		}
		throw new ul4.TypeError("get() requires a dict");
	};

	// Return a ``Date`` object for the current time
	ul4.now = function now()
	{
		return new Date();
	};

	// Return a ``Date`` object for the current time in UTC
	ul4.utcnow = function utcnow()
	{
		let now = new Date();
		// FIXME: The timezone is wrong for the new ``Date`` object.
		return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
	};

	// Return an ``ul4.Date`` object for today
	ul4.today = function today()
	{
		let now = new Date();
		return new ul4.Date(now.getFullYear(), now.getMonth()+1, now.getDate());
	};

	ul4.functions = {
		repr: ul4._repr,
		ascii: ul4._ascii,
		str: ul4._str,
		int: ul4._int,
		float: ul4._float,
		list: ul4._list,
		set: ul4._set,
		bool: ul4._bool,
		len: ul4._len,
		type: ul4._type,
		format: ul4._format,
		any: ul4._any,
		all: ul4._all,
		zip: ul4._zip,
		getattr: ul4._getattr,
		hasattr: ul4._hasattr,
		dir: ul4._dir,
		isundefined: ul4._isundefined,
		isdefined: ul4._isdefined,
		isnone: ul4._isnone,
		isbool: ul4._isbool,
		isint: ul4._isint,
		isfloat: ul4._isfloat,
		isstr: ul4._isstr,
		isdate: ul4._isdate,
		isdatetime: ul4._isdatetime,
		iscolor: ul4._iscolor,
		istimedelta: ul4._istimedelta,
		ismonthdelta: ul4._ismonthdelta,
		istemplate: ul4._istemplate,
		isfunction: ul4._isfunction,
		islist: ul4._islist,
		isset: ul4._isanyset,
		isdict: ul4._isdict,
		isexception: ul4._isexception,
		asjson: ul4._asjson,
		fromjson: ul4._fromjson,
		asul4on: ul4._asul4on,
		fromul4on: ul4._fromul4on,
		now: ul4.now,
		utcnow: ul4.utcnow,
		today: ul4.today,
		enumerate: ul4._enumerate,
		isfirst: ul4._isfirst,
		islast: ul4._islast,
		isfirstlast: ul4._isfirstlast,
		enumfl: ul4._enumfl,
		abs: ul4._abs,
		date: ul4._date,
		datetime: ul4._datetime,
		timedelta: ul4._timedelta,
		monthdelta: ul4._monthdelta,
		rgb: ul4._rgb,
		hls: ul4._hls,
		hsv: ul4._hsv,
		xmlescape: ul4._xmlescape,
		csv: ul4._csv,
		chr: ul4._chr,
		ord: ul4._ord,
		hex: ul4._hex,
		oct: ul4._oct,
		bin: ul4._bin,
		min: ul4._min,
		max: ul4._max,
		sum: ul4._sum,
		first: ul4._first,
		last: ul4._last,
		sorted: ul4._sorted,
		range: ul4._range,
		slice: ul4._slice,
		urlquote: ul4._urlquote,
		urlunquote: ul4._urlunquote,
		reversed: ul4._reversed,
		random: ul4._random,
		randrange: ul4._randrange,
		randchoice: ul4._randchoice,
		round: ul4._round,
		md5: ul4._md5
	};

	ul4.expose(ul4._repr, ["obj"], {name: "repr"});
	ul4.expose(ul4._ascii, ["obj"], {name: "ascii"});
	ul4.expose(ul4._str, ["obj=", ""], {name: "str"});
	ul4.expose(ul4._int, ["obj=", 0, "base=", null], {name: "int"});
	ul4.expose(ul4._float, ["obj=", 0.0], {name: "float"});
	ul4.expose(ul4._list, ["iterable=", []], {name: "list"});
	ul4.expose(ul4._set, ["iterable=", []], {name: "set"});
	ul4.expose(ul4._bool, ["obj=", false], {name: "bool"});
	ul4.expose(ul4._len, ["sequence"], {name: "len"});
	ul4.expose(ul4._type, ["obj"], {name: "type"});
	ul4.expose(ul4._format, ["obj", "fmt", "lang=", null], {name: "format"});
	ul4.expose(ul4._any, ["iterable"], {name: "any"});
	ul4.expose(ul4._all, ["iterable"], {name: "all"});
	ul4.expose(ul4._zip, ["*iterables"], {name: "zip"});
	ul4.expose(ul4._getattr, ["obj", "attrname", "default=", null], {name: "getattr"});
	ul4.expose(ul4._hasattr, ["obj", "attrname"], {name: "hasattr"});
	ul4.expose(ul4._dir, ["obj"], {name: "dir"});
	ul4.expose(ul4._isundefined, ["obj"], {name: "isundefined"});
	ul4.expose(ul4._isdefined, ["obj"], {name: "isdefined"});
	ul4.expose(ul4._isnone, ["obj"], {name: "isnone"});
	ul4.expose(ul4._isbool, ["obj"], {name: "isbool"});
	ul4.expose(ul4._isint, ["obj"], {name: "isint"});
	ul4.expose(ul4._isfloat, ["obj"], {name: "isfloat"});
	ul4.expose(ul4._isstr, ["obj"], {name: "isstr"});
	ul4.expose(ul4._isdate, ["obj"], {name: "isdate"});
	ul4.expose(ul4._isdatetime, ["obj"], {name: "isdatetime"});
	ul4.expose(ul4._iscolor, ["obj"], {name: "iscolor"});
	ul4.expose(ul4._istimedelta, ["obj"], {name: "istimedelta"});
	ul4.expose(ul4._ismonthdelta, ["obj"], {name: "ismonthdelta"});
	ul4.expose(ul4._istemplate, ["obj"], {name: "istemplate"});
	ul4.expose(ul4._isfunction, ["obj"], {name: "isfunction"});
	ul4.expose(ul4._islist, ["obj"], {name: "islist"});
	ul4.expose(ul4._isanyset, ["obj"], {name: "isset"});
	ul4.expose(ul4._isdict, ["obj"], {name: "isdict"});
	ul4.expose(ul4._isexception, ["obj"], {name: "isexception"});
	ul4.expose(ul4._asjson, ["obj"], {name: "asjson"});
	ul4.expose(ul4._fromjson, ["string"], {name: "fromjson"});
	ul4.expose(ul4._asul4on, ["obj"], {name: "asul4on"});
	ul4.expose(ul4._fromul4on, ["string"], {name: "fromul4on"});
	ul4.expose(ul4.now, []);
	ul4.expose(ul4.utcnow, []);
	ul4.expose(ul4.today, []);
	ul4.expose(ul4._enumerate, ["iterable", "start=", 0], {name: "enumerate"});
	ul4.expose(ul4._isfirst, ["iterable"], {name: "isfirst"});
	ul4.expose(ul4._islast, ["iterable"], {name: "islast"});
	ul4.expose(ul4._isfirstlast, ["iterable"], {name: "isfirstlast"});
	ul4.expose(ul4._enumfl, ["iterable", "start=", 0], {name: "enumfl"});
	ul4.expose(ul4._abs, ["number"], {name: "abs"});
	ul4.expose(ul4._date, ["year", "month", "day"], {name: "date"});
	ul4.expose(ul4._datetime, ["year", "month", "day", "hour=", 0, "minute=", 0, "second=", 0, "microsecond=", 0], {name: "datetime"});
	ul4.expose(ul4._timedelta, ["days=", 0, "seconds=", 0, "microseconds=", 0], {name: "timedelta"});
	ul4.expose(ul4._monthdelta, ["months=", 0], {name: "monthdelta"});
	ul4.expose(ul4._rgb, ["r", "g", "b", "a=", 1.0], {name: "rgb"});
	ul4.expose(ul4._hls, ["h", "l", "s", "a=", 1.0], {name: "hls"});
	ul4.expose(ul4._hsv, ["h", "s", "v", "a=", 1.0], {name: "hsv"});
	ul4.expose(ul4._xmlescape, ["obj"], {name: "xmlescape"});
	ul4.expose(ul4._csv, ["obj"], {name: "csv"});
	ul4.expose(ul4._chr, ["i"], {name: "chr"});
	ul4.expose(ul4._ord, ["c"], {name: "ord"});
	ul4.expose(ul4._hex, ["number"], {name: "hex"});
	ul4.expose(ul4._oct, ["number"], {name: "oct"});
	ul4.expose(ul4._bin, ["number"], {name: "bin"});
	ul4.expose(ul4._min, ["*obj"], {name: "min"});
	ul4.expose(ul4._max, ["*obj"], {name: "max"});
	ul4.expose(ul4._sum, ["iterable", "start=", 0], {name: "sum"});
	ul4.expose(ul4._first, ["iterable", "default=", null], {name: "first"});
	ul4.expose(ul4._last, ["iterable", "default=", null], {name: "last"});
	ul4.expose(ul4._sorted, ["iterable", "key=", null, "reverse=", false], {name: "sorted", needscontext: true});
	ul4.expose(ul4._range, ["*args"], {name: "range"});
	ul4.expose(ul4._slice, ["*args"], {name: "slice"});
	ul4.expose(ul4._urlquote, ["string"], {name: "urlquote"});
	ul4.expose(ul4._urlunquote, ["string"], {name: "urlunquote"});
	ul4.expose(ul4._reversed, ["sequence"], {name: "reversed"});
	ul4.expose(ul4._random, [], {name: "random"});
	ul4.expose(ul4._randrange, ["*args"], {name: "randrange"});
	ul4.expose(ul4._randchoice, ["sequence"], {name: "randchoice"});
	ul4.expose(ul4._round, ["x", "digit=", 0], {name: "round"});
	ul4.expose(ul4._md5, ["string"], {name: "md5"});

	// Functions implementing UL4 methods
	ul4._count = function _count(obj, sub, start=null, end=null)
	{
		if (start < 0)
			start += obj.length;
		if (start === null)
			start = 0;

		if (end < 0)
			end += obj.length;
		if (end === null)
			end = obj.length;

		let isstr = ul4._isstr(obj);

		if (isstr && !sub.length)
		{
			if (end < 0 || start > obj.length || start > end)
				return 0;
			let result = end - start + 1;
			if (result > obj.length + 1)
				result = obj.length + 1;
			return result;
		}

		start = ul4._bound(start, obj.length);
		end = ul4._bound(end, obj.length);

		let count = 0;
		if (ul4._islist(obj))
		{
			for (let i = start; i < end; ++i)
			{
				if (ul4._eq(obj[i], sub))
					++count;
			}
			return count;
		}
		else // string
		{
			let lastIndex = start;

			for (;;)
			{
				lastIndex = obj.indexOf(sub, lastIndex);
				if (lastIndex == -1)
					break;
				if (lastIndex + sub.length > end)
					break;
				++count;
				lastIndex += sub.length;
			}
			return count;
		}
	};

	ul4._find = function _find(obj, sub, start=null, end=null)
	{
		if (start < 0)
			start += obj.length;
		if (start === null)
			start = 0;
		if (end < 0)
			end += obj.length;
		if (end === null)
			end = obj.length;
		start = ul4._bound(start, obj.length);
		end = ul4._bound(end, obj.length);

		if (start !== 0 || end !== obj.length)
		{
			if (typeof(obj) == "string")
				obj = obj.substring(start, end);
			else
				obj = obj.slice(start, end);
		}
		let result = obj.indexOf(sub);
		if (result !== -1)
			result += start;
		return result;
	};

	ul4._rfind = function _rfind(obj, sub, start=null, end=null)
	{
		if (start < 0)
			start += obj.length;
		if (start === null)
			start = 0;
		if (end < 0)
			end += obj.length;
		if (end === null)
			end = obj.length;
		start = ul4._bound(start, obj.length);
		end = ul4._bound(end, obj.length);

		if (start !== 0 || end !== obj.length)
		{
			if (typeof(obj) == "string")
				obj = obj.substring(start, end);
			else
				obj = obj.slice(start, end);
		}
		let result = obj.lastIndexOf(sub);
		if (result !== -1)
			result += start;
		return result;
	};

	ul4._week4format = function _week(obj, firstweekday=null)
	{
		if (firstweekday === null)
			firstweekday = 0;
		else
			firstweekday %= 7;

		let yearday = ul4.DateTimeProtocol.yearday(obj)+6;
		let jan1 = new Date(obj.getFullYear(), 0, 1);
		let jan1weekday = jan1.getDay();
		if (--jan1weekday < 0)
			jan1weekday = 6;

		while (jan1weekday != firstweekday)
		{
			--yearday;
			if (++jan1weekday == 7)
				jan1weekday = 0;
		}
		return Math.floor(yearday/7);
	};

	ul4._isleap = function _isleap(obj)
	{
		return new Date(obj.getFullYear(), 1, 29).getMonth() === 1;
	};

	ul4._update = function _update(obj, others, kwargs)
	{
		if (!ul4._isdict(obj))
			throw new ul4.TypeError("update() requires a dict");
		for (let i = 0; i < others.length; ++i)
		{
			let other = others[i];
			if (ul4._ismap(other))
			{
				other.forEach(function(value, key) {
					ul4._setmap(obj, key, value);
				});
			}
			else if (ul4._isobject(other))
			{
				for (let key in other)
					ul4._setmap(obj, key, other[key]);
			}
			else if (ul4._islist(other))
			{
				for (let i = 0; i < other.length; ++i)
				{
					let item = other[i];
					if (!ul4._islist(item) || (item.length != 2))
						throw new ul4.TypeError("update() requires a dict or a list of (key, value) pairs");
					ul4._setmap(obj, item[0], item[1]);
				}
			}
			else
				throw new ul4.TypeError("update() requires a dict or a list of (key, value) pairs");
		}
		kwargs.forEach(function(value, key) {
			ul4._setmap(obj, key, value);
		});
		return null;
	};

	ul4.Color = class Color extends ul4.Proto
	{
		constructor(r=0, g=0, b=0, a=255)
		{
			super();
			this._r = r;
			this._g = g;
			this._b = b;
			this._a = a;
		}

		__repr__()
		{
			let r = ul4._lpad(this._r.toString(16), "0", 2);
			let g = ul4._lpad(this._g.toString(16), "0", 2);
			let b = ul4._lpad(this._b.toString(16), "0", 2);
			let a = ul4._lpad(this._a.toString(16), "0", 2);
			if (this._a !== 0xff)
			{
				if (r[0] === r[1] && g[0] === g[1] && b[0] === b[1] && a[0] === a[1])
					return "#" + r[0] + g[0] + b[0] + a[0];
				else
					return "#" + r + g + b + a;
			}
			else
			{
				if (r[0] === r[1] && g[0] === g[1] && b[0] === b[1])
					return "#" + r[0] + g[0] + b[0];
				else
					return "#" + r + g + b;
			}
		}

		__str__()
		{
			if (this._a !== 0xff)
			{
				return "rgba(" + this._r + ", " + this._g + ", " + this._b + ", " + (this._a/255) + ")";
			}
			else
			{
				let r = ul4._lpad(this._r.toString(16), "0", 2);
				let g = ul4._lpad(this._g.toString(16), "0", 2);
				let b = ul4._lpad(this._b.toString(16), "0", 2);
				if (r[0] === r[1] && g[0] === g[1] && b[0] === b[1])
					return "#" + r[0] + g[0] + b[0];
				else
					return "#" + r + g + b;
			}
		}

		__iter__()
		{
			return {
				obj: this,
				index: 0,
				next: function() {
					if (this.index == 0)
					{
						++this.index;
						return {value: this.obj._r, done: false};
					}
					else if (this.index == 1)
					{
						++this.index;
						return {value: this.obj._g, done: false};
					}
					else if (this.index == 2)
					{
						++this.index;
						return {value: this.obj._b, done: false};
					}
					else if (this.index == 3)
					{
						++this.index;
						return {value: this.obj._a, done: false};
					}
					else
						return {done: true};
				}
			};
		}

		__getattr__(attrname)
		{
			let self = this;
			switch (attrname)
			{
				case "r":
					let r = function r(){ return self._r; };
					ul4.expose(r, []);
					return r;
				case "g":
					let g = function g(){ return self._g; };
					ul4.expose(g, []);
					return g;
				case "b":
					let b = function b(){ return self._b; };
					ul4.expose(b, []);
					return b;
				case "a":
					let a = function a(){ return self._a; };
					ul4.expose(a, []);
					return a;
				case "lum":
					let lum = function lum(){ return self.lum(); };
					ul4.expose(lum, []);
					return lum;
				case "hls":
					let hls = function hls(){ return self.hls(); };
					ul4.expose(hls, []);
					return hls;
				case "hlsa":
					let hlsa = function hlsa(){ return self.hlsa(); };
					ul4.expose(hlsa, []);
					return hlsa;
				case "hsv":
					let hsv = function hsv(){ return self.hsv(); };
					ul4.expose(hsv, []);
					return hsv;
				case "hsva":
					let hsva = function hsva(){ return self.hsva(); };
					ul4.expose(hsva, []);
					return hsva;
				case "witha":
					let witha = function witha(a){ return self.witha(a); };
					ul4.expose(witha, ["a"]);
					return witha;
				case "withlum":
					let withlum = function withlum(lum){ return self.withlum(lum); };
					ul4.expose(withlum, ["lum"]);
					return withlum;
				case "abslum":
					let abslum = function abslum(lum){ return self.abslum(lum); };
					ul4.expose(abslum, ["lum"]);
					return abslum;
				case "rellum":
					let rellum = function rellum(lum){ return self.rellum(lum); };
					ul4.expose(rellum, ["lum"]);
					return rellum;
				default:
					throw new ul4.AttributeError(this, attrname);
			}
		}

		__getitem__(key)
		{
			let orgkey = key;
			if (key < 0)
				key += 4;
			switch (key)
			{
				case 0:
					return this._r;
				case 1:
					return this._g;
				case 2:
					return this._b;
				case 3:
					return this._a;
				default:
					throw new ul4.IndexError(this, orgkey);
			}
		}

		__eq__(other)
		{
			if (other instanceof ul4.Color)
				return this._r == other._r && this._g == other._g && this._b == other._b && this._a == other._a;
			return false;
		}

		r()
		{
				return this._r;
		}

		g()
		{
			return this._g;
		}

		b()
		{
			return this._b;
		}

		a()
		{
			return this._a;
		}

		lum()
		{
			return this.hls()[1];
		}

		hls()
		{
			let r = this._r/255.0;
			let g = this._g/255.0;
			let b = this._b/255.0;
			let maxc = Math.max(r, g, b);
			let minc = Math.min(r, g, b);
			let h, l, s;
			let rc, gc, bc;

			l = (minc+maxc)/2.0;
			if (minc == maxc)
				return [0.0, l, 0.0];
			if (l <= 0.5)
				s = (maxc-minc) / (maxc+minc);
			else
				s = (maxc-minc) / (2.0-maxc-minc);
			rc = (maxc-r) / (maxc-minc);
			gc = (maxc-g) / (maxc-minc);
			bc = (maxc-b) / (maxc-minc);
			if (r == maxc)
				h = bc-gc;
			else if (g == maxc)
				h = 2.0+rc-bc;
			else
				h = 4.0+gc-rc;
			h = (h/6.0) % 1.0;
			return [h, l, s];
		}

		hlsa()
		{
			let hls = this.hls();
			return hls.concat(this._a/255.0);
		}

		hsv()
		{
			let r = this._r/255.0;
			let g = this._g/255.0;
			let b = this._b/255.0;
			let maxc = Math.max(r, g, b);
			let minc = Math.min(r, g, b);
			let v = maxc;
			if (minc == maxc)
				return [0.0, 0.0, v];
			let s = (maxc-minc) / maxc;
			let rc = (maxc-r) / (maxc-minc);
			let gc = (maxc-g) / (maxc-minc);
			let bc = (maxc-b) / (maxc-minc);
			let h;
			if (r == maxc)
				h = bc-gc;
			else if (g == maxc)
				h = 2.0+rc-bc;
			else
				h = 4.0+gc-rc;
			h = (h/6.0) % 1.0;
			return [h, s, v];
		}

		hsva()
		{
			let hsv = this.hsv();
			return hsv.concat(this._a/255.0);
		}

		witha(a)
		{
			if (typeof(a) !== "number")
				throw new ul4.TypeError("witha() requires a number");
			return new ul4.Color(this._r, this._g, this._b, a);
		}

		withlum(lum)
		{
			if (typeof(lum) !== "number")
				throw new ul4.TypeError("witha() requires a number");
			let hlsa = this.hlsa();
			return ul4._hls(hlsa[0], lum, hlsa[2], hlsa[3]);
		}

		ul4type()
		{
			return "color";
		}
	};

	ul4.expose(ul4.Color.prototype.r, []);
	ul4.expose(ul4.Color.prototype.g, []);
	ul4.expose(ul4.Color.prototype.b, []);
	ul4.expose(ul4.Color.prototype.a, []);
	ul4.expose(ul4.Color.prototype.lum, []);
	ul4.expose(ul4.Color.prototype.hls, []);
	ul4.expose(ul4.Color.prototype.hlsa, []);
	ul4.expose(ul4.Color.prototype.hsv, []);
	ul4.expose(ul4.Color.prototype.hsva, []);
	ul4.expose(ul4.Color.prototype.witha, ["a"]);
	ul4.expose(ul4.Color.prototype.withlum, ["lum"]);

	const _js_Date = Date;

	ul4.Date = class Date extends ul4.Proto
	{
		constructor(year, month, day)
		{
			super();
			this._date = new _js_Date(year, month-1, day);
		}

		__repr__()
		{
			return '@(' + this.__str__() + ")";
		}

		__str__()
		{
			return ul4._lpad(this._date.getFullYear(), "0", 4) + "-" + ul4._lpad(this._date.getMonth()+1, "0", 2) + "-" + ul4._lpad(this._date.getDate(), "0", 2);
		}

		__eq__(other)
		{
			if (other instanceof ul4.Date)
				return this._date.getTime() === other._date.getTime();
			return false;
		}

		__lt__(other)
		{
			if (other instanceof ul4.Date)
				return this._date < other._date;
			ul4._unorderable("<", this, other);
		}

		__le__(other)
		{
			if (other instanceof ul4.Date)
				return this._date <= other._date;
			ul4._unorderable("<=", this, other);
		}

		__gt__(other)
		{
			if (other instanceof ul4.Date)
				return this._date > other._date;
			ul4._unorderable(">", this, other);
		}

		__ge__(other)
		{
			if (other instanceof ul4.Date)
				return this._date >= other._date;
			ul4._unorderable(">=", this, other);
		}

		year()
		{
			return this._date.getFullYear();
		}

		month()
		{
			return this._date.getMonth()+1;
		}

		day()
		{
			return this._date.getDate();
		}

		ul4type()
		{
			return "date";
		}
	};


	ul4.TimeDelta = class TimeDelta extends ul4.Proto
	{
		constructor(days=0, seconds=0, microseconds=0)
		{
			super();
			let total_microseconds = Math.floor((days * 86400 + seconds)*1000000 + microseconds);

			microseconds = ul4.ModAST.prototype._do(total_microseconds, 1000000);
			let total_seconds = Math.floor(total_microseconds / 1000000);
			seconds = ul4.ModAST.prototype._do(total_seconds, 86400);
			days = Math.floor(total_seconds / 86400);
			if (seconds < 0)
			{
				seconds += 86400;
				--days;
			}

			this._microseconds = microseconds;
			this._seconds = seconds;
			this._days = days;
		}

		__repr__()
		{
			let v = [], first = true;
			v.push("timedelta(");
			if (this._days)
			{
				v.push("days=" + this._days);
				first = false;
			}
			if (this._seconds)
			{
				if (!first)
					v.push(", ");
				v.push("seconds=" + this._seconds);
				first = false;
			}
			if (this._microseconds)
			{
				if (!first)
					v.push(", ");
				v.push("microseconds=" + this._microseconds);
			}
			v.push(")");
			return v.join("");
		}

		__str__()
		{
			let v = [];
			if (this._days)
			{
				v.push(this._days + " day");
				if (this._days !== -1 && this._days !== 1)
					v.push("s");
				v.push(", ");
			}
			let seconds = this._seconds % 60;
			let minutes = Math.floor(this._seconds / 60);
			let hours = Math.floor(minutes / 60);
			minutes = minutes % 60;

			v.push("" + hours);
			v.push(":");
			v.push(ul4._lpad(minutes.toString(), "0", 2));
			v.push(":");
			v.push(ul4._lpad(seconds.toString(), "0", 2));
			if (this._microseconds)
			{
				v.push(".");
				v.push(ul4._lpad(this._microseconds.toString(), "0", 6));
			}
			return v.join("");
		}

		__bool__()
		{
			return this._days !== 0 || this._seconds !== 0 || this._microseconds !== 0;
		}

		__abs__()
		{
			return this._days < 0 ? new ul4.TimeDelta(-this._days, -this._seconds, -this._microseconds) : this;
		}

		__eq__(other)
		{
			if (other instanceof ul4.TimeDelta)
				return (this._days === other._days) && (this._seconds === other._seconds) && (this._microseconds === other._microseconds);
			return false;
		}

		__lt__(other)
		{
			if (other instanceof ul4.TimeDelta)
			{
				if (this._days != other._days)
					return this._days < other._days;
				if (this._seconds != other._seconds)
					return this._seconds < other._seconds;
				return this._microseconds < other._microseconds;
			}
			ul4._unorderable("<", this, other);
		}

		__le__(other)
		{
			if (other instanceof ul4.TimeDelta)
			{
				if (this._days != other._days)
					return this._days < other._days;
				if (this._seconds != other._seconds)
					return this._seconds < other._seconds;
				return this._microseconds <= other._microseconds;
			}
			ul4._unorderable("<=", this, other);
		}

		__gt__(other)
		{
			if (other instanceof ul4.TimeDelta)
			{
				if (this._days != other._days)
					return this._days > other._days;
				if (this._seconds != other._seconds)
					return this._seconds > other._seconds;
				return this._microseconds > other._microseconds;
			}
			ul4._unorderable(">", this, other);
		}

		__ge__(other)
		{
			if (other instanceof ul4.TimeDelta)
			{
				if (this._days != other._days)
					return this._days > other._days;
				if (this._seconds != other._seconds)
					return this._seconds > other._seconds;
				return this._microseconds >= other._microseconds;
			}
			ul4._unorderable(">=", this, other);
		}

		__neg__()
		{
			return new ul4.TimeDelta(-this._days, -this._seconds, -this._microseconds);
		}

		adddate(date, days)
		{
			let year = date._date.getFullYear();
			let month = date._date.getMonth();
			let day = date._date.getDate() + days;
			return new ul4.Date(year, month, day);
		}

		_adddatetime(date, days, seconds, microseconds)
		{
			let year = date.getFullYear();
			let month = date.getMonth();
			let day = date.getDate() + days;
			let hour = date.getHours();
			let minute = date.getMinutes();
			let second = date.getSeconds() + seconds;
			let millisecond = date.getMilliseconds() + microseconds/1000;
			return new Date(year, month, day, hour, minute, second, millisecond);
		}

		__add__(other)
		{
			if (other instanceof ul4.TimeDelta)
				return new ul4.TimeDelta(this._days + other._days, this._seconds + other._seconds, this._microseconds + other._microseconds);
			else if (ul4._isdate(other))
				return this._adddate(other, this._days);
			else if (ul4._isdatetime(other))
				return this._adddatetime(other, this._days, this._seconds, this._microseconds);
			throw new ul4.TypeError(ul4._type(this) + " + " + ul4._type(other) + " not supported");
		}

		__radd__(other)
		{
			if (ul4._isdate(other))
				return this._adddate(other, this._days);
			else if (ul4._isdatetime(other))
				return this._adddatetime(other, this._days, this._seconds, this._microseconds);
			throw new ul4.TypeError(ul4._type(this) + " + " + ul4._type(other) + " not supported");
		}

		__sub__(other)
		{
			if (other instanceof ul4.TimeDelta)
				return new ul4.TimeDelta(this._days - other._days, this._seconds - other._seconds, this._microseconds - other._microseconds);
			throw new ul4.TypeError(ul4._type(this) + " - " + ul4._type(other) + " not supported");
		}

		__rsub__(other)
		{
			if (ul4._isdate(other))
				return this._adddate(other, -this._days);
			else if (ul4._isdatetime(other))
				return this._adddatetime(other, -this._days, -this._seconds, -this._microseconds);
			throw new ul4.TypeError(ul4._type(this) + " - " + ul4._type(other) + " not supported");
		}

		__mul__(other)
		{
			if (typeof(other) === "number")
				return new ul4.TimeDelta(this._days * other, this._seconds * other, this._microseconds * other);
			throw new ul4.TypeError(ul4._type(this) + " * " + ul4._type(other) + " not supported");
		}

		__rmul__(other)
		{
			if (typeof(other) === "number")
				return new ul4.TimeDelta(this._days * other, this._seconds * other, this._microseconds * other);
			throw new ul4.TypeError(ul4._type(this) + " * " + ul4._type(other) + " not supported");
		}

		__truediv__(other)
		{
			if (typeof(other) === "number")
			{
				return new ul4.TimeDelta(this._days / other, this._seconds / other, this._microseconds / other);
			}
			else if (other instanceof ul4.TimeDelta)
			{
				let myValue = this._days;
				let otherValue = other._days;
				let hasSeconds = this._seconds || other._seconds;
				let hasMicroseconds = this._microseconds || other._microseconds;
				if (hasSeconds || hasMicroseconds)
				{
					myValue = myValue*86400+this._seconds;
					otherValue = otherValue*86400 + other._seconds;
					if (hasMicroseconds)
					{
						myValue = myValue * 1000000 + this._microseconds;
						otherValue = otherValue * 1000000 + other._microseconds;
					}
				}
				return myValue/otherValue;
			}
			throw new ul4.TypeError(ul4._type(this) + " / " + ul4._type(other) + " not supported");
		}

		__getattr__(attrname)
		{
			let self = this;
			switch (attrname)
			{
				case "days":
					let days = function days(){ return self._days; };
					ul4.expose(days, []);
					return days;
				case "seconds":
					let seconds = function seconds(){ return self._seconds; };
					ul4.expose(seconds, []);
					return seconds;
				case "microseconds":
					let microseconds = function microseconds(){ return self._microseconds; };
					ul4.expose(microseconds, []);
					return microseconds;
				default:
					throw new ul4.AttributeError(this, attrname);
			}
		}

		days()
		{
			return this._days;
		}

		seconds()
		{
			return this._seconds;
		}

		microseconds()
		{
			return this._microseconds;
		}

		ul4type()
		{
			return "timedelta";
		}
	};


	ul4.MonthDelta = class MonthDelta extends ul4.Proto
	{
		constructor(months=0)
		{
			super();
			this._months = months;
		}

		__repr__()
		{
			if (!this._months)
				return "monthdelta()";
			return "monthdelta(" + this._months + ")";
		}

		__str__()
		{
			if (this._months)
			{
				if (this._months !== -1 && this._months !== 1)
					return this._months + " months";
				return this._months + " month";
			}
			return "0 months";
		}

		toString()
		{
			return this.__str__();
		}

		__bool__()
		{
			return this._months !== 0;
		}

		__abs__()
		{
			return this._months < 0 ? new ul4.MonthDelta(-this._months) : this;
		}

		__eq__(other)
		{
			if (other instanceof MonthDelta)
				return this._months === other._months;
			return false;
		}

		__lt__(other)
		{
			if (other instanceof ul4.MonthDelta)
				return this._months < other._months;
			ul4._unorderable("<", this, other);
		}

		__le__(other)
		{
			if (other instanceof ul4.MonthDelta)
				return this._months <= other._months;
			ul4._unorderable("<=", this, other);
		}

		__gt__(other)
		{
			if (other instanceof ul4.MonthDelta)
				return this._months > other._months;
			ul4._unorderable(">", this, other);
		}

		__ge__(other)
		{
			if (other instanceof ul4.MonthDelta)
				return this._months >= other._months;
			ul4._unorderable(">=", this, other);
		}

		__neg__()
		{
			return new ul4.MonthDelta(-this._months);
		}

		_adddate(date, months)
		{
			let result = this._adddatetime(date._date, months);
			return new ul4.Date(result.getFullYear(), result.getMonth()+1, result.getDate());
		}

		_adddatetime(date, months)
		{
			let year = date.getFullYear();
			let month = date.getMonth() + months;
			let day = date.getDate();
			let hour = date.getHours();
			let minute = date.getMinutes();
			let second = date.getSeconds();
			let millisecond = date.getMilliseconds();

			while (true)
			{
				// As the month might be out of bounds, we have to find out, what the real target month is
				let targetmonth = new Date(year, month, 1, hour, minute, second, millisecond).getMonth();
				let result = new Date(year, month, day, hour, minute, second, millisecond);
				if (result.getMonth() === targetmonth)
					return result;
				--day;
			}
		}

		__add__(other)
		{
			if (ul4._ismonthdelta(other))
				return new ul4.MonthDelta(this._months + other._months);
			else if (ul4._isdate(other))
				return this._adddate(other, this._months);
			else if (ul4._isdatetime(other))
				return this._adddatetime(other, this._months);
			throw new ul4.ArgumentError(ul4._type(this) + " + " + ul4._type(other) + " not supported");
		}

		__radd__(other)
		{
			if (ul4._isdate(other))
				return this._adddate(other, this._months);
			else if (ul4._isdatetime(other))
				return this._adddatetime(other, this._months);
			throw new ul4.ArgumentError(ul4._type(this) + " + " + ul4._type(other) + " not supported");
		}

		__sub__(other)
		{
			if (ul4._ismonthdelta(other))
				return new ul4.MonthDelta(this._months - other._months);
			throw new ul4.ArgumentError(ul4._type(this) + " - " + ul4._type(other) + " not supported");
		}

		__rsub__(other)
		{
			if (ul4._isdate(other))
				return this._adddate(other, -this._months);
			else if (ul4._isdatetime(other))
				return this._adddatetime(other, -this._months);
			throw new ul4.ArgumentError(ul4._type(this) + " - " + ul4._type(other) + " not supported");
		}

		__mul__(other)
		{
			if (typeof(other) === "number")
				return new ul4.MonthDelta(this._months * Math.floor(other));
			throw new ul4.ArgumentError(ul4._type(this) + " * " + ul4._type(other) + " not supported");
		}

		__rmul__(other)
		{
			if (typeof(other) === "number")
				return new ul4.MonthDelta(this._months * Math.floor(other));
			throw new ul4.ArgumentError(ul4._type(this) + " * " + ul4._type(other) + " not supported");
		}

		__floordiv__(other)
		{
			if (typeof(other) === "number")
				return new ul4.MonthDelta(Math.floor(this._months / other));
			else if (ul4._ismonthdelta(other))
				return Math.floor(this._months / other._months);
			throw new ul4.ArgumentError(ul4._type(this) + " // " + ul4._type(other) + " not supported");
		}

		__truediv__(other)
		{
			if (ul4._ismonthdelta(other))
				return this._months / other._months;
			throw new ul4.ArgumentError(ul4._type(this) + " / " + ul4._type(other) + " not supported");
		}

		__getattr__(attrname)
		{
			let self = this;
			switch (attrname)
			{
				case "months":
					let months = function months(){ return self._months; };
					ul4.expose(months, []);
					return months;
				default:
					throw new ul4.AttributeError(this, attrname);
			}
		}

		months()
		{
			return this._months;
		}

		ul4type()
		{
			return "monthdelta";
		}
	};

	const classes = [
		ul4.TextAST,
		ul4.IndentAST,
		ul4.LineEndAST,
		ul4.ConstAST,
		ul4.SeqItemAST,
		ul4.UnpackSeqItemAST,
		ul4.DictItemAST,
		ul4.UnpackDictItemAST,
		ul4.PosArgAST,
		ul4.KeywordArgAST,
		ul4.UnpackListArgAST,
		ul4.UnpackDictArgAST,
		ul4.ListAST,
		ul4.ListCompAST,
		ul4.DictAST,
		ul4.DictCompAST,
		ul4.SetAST,
		ul4.SetCompAST,
		ul4.GenExprAST,
		ul4.VarAST,
		ul4.NotAST,
		ul4.NegAST,
		ul4.BitNotAST,
		ul4.IfAST,
		ul4.ReturnAST,
		ul4.PrintAST,
		ul4.PrintXAST,
		ul4.ItemAST,
		ul4.IsAST,
		ul4.IsNotAST,
		ul4.EQAST,
		ul4.NEAST,
		ul4.LTAST,
		ul4.LEAST,
		ul4.GTAST,
		ul4.GEAST,
		ul4.NotContainsAST,
		ul4.ContainsAST,
		ul4.AddAST,
		ul4.SubAST,
		ul4.MulAST,
		ul4.FloorDivAST,
		ul4.TrueDivAST,
		ul4.ModAST,
		ul4.ShiftLeftAST,
		ul4.ShiftRightAST,
		ul4.BitAndAST,
		ul4.BitXOrAST,
		ul4.BitOrAST,
		ul4.AndAST,
		ul4.OrAST,
		ul4.SliceAST,
		ul4.AttrAST,
		ul4.CallAST,
		ul4.RenderAST,
		ul4.RenderXAST,
		ul4.RenderBlockAST,
		ul4.RenderBlocksAST,
		ul4.SetVarAST,
		ul4.AddVarAST,
		ul4.SubVarAST,
		ul4.MulVarAST,
		ul4.TrueDivVarAST,
		ul4.FloorDivVarAST,
		ul4.ModVarAST,
		ul4.ShiftLeftVarAST,
		ul4.ShiftRightVarAST,
		ul4.BitAndVarAST,
		ul4.BitXOrVarAST,
		ul4.BitOrVarAST,
		ul4.ForBlockAST,
		ul4.WhileBlockAST,
		ul4.BreakAST,
		ul4.ContinueAST,
		ul4.CondBlockAST,
		ul4.IfBlockAST,
		ul4.ElIfBlockAST,
		ul4.ElseBlockAST,
		ul4.SignatureAST,
		ul4.Template
	];

	for (let i = 0; i < classes.length; ++i)
	{
		let constructor = classes[i];
		let ul4onname = constructor.name;
		if (ul4onname.substr(ul4onname.length-3) === "AST")
			ul4onname = ul4onname.substr(0, ul4onname.length-3);
		ul4onname = ul4onname.toLowerCase();
		constructor.prototype.type = ul4onname;
		ul4.register("de.livinglogic.ul4." + ul4onname, constructor);
	}