import * as ul4 from '/static/ul4/1.0.0/dist/esm/ul4.js';
import { AttributeError, Proto, _repr, _makeset, _ismap, ArgumentError, _isobject, TypeError as TypeError$1, expose, _bool, _havemap, _format, _islist, _ne, _asjson, _fromjson, register } from '/static/ul4/1.0.0/dist/esm/ul4.js';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var version = "0.10.0";

var Base =
/*#__PURE__*/
function (_ul4$Proto) {
  _inherits(Base, _ul4$Proto);

  function Base() {
    _classCallCheck(this, Base);

    return _possibleConstructorReturn(this, _getPrototypeOf(Base).call(this));
  }

  _createClass(Base, [{
    key: "ul4ondump",
    value: function ul4ondump(encoder) {
      for (var i = 0; i < this._ul4onattrs.length; ++i) {
        encoder.dump(this._dumpUL4ONAttr(this._ul4onattrs[i]));
      }
    }
  }, {
    key: "_dumpUL4ONAttr",
    value: function _dumpUL4ONAttr(name) {
      return this[name];
    }
  }, {
    key: "ul4onload",
    value: function ul4onload(decoder) {
      var i = 0;

      for (var iter = decoder.loadcontent();; ++i) {
        var iteritem = iter.next();
        if (iteritem.done) break;
        if (i < this._ul4onattrs.length) this._loadUL4ONAttr(this._ul4onattrs[i], iteritem.value);
      }

      for (; i < this._ul4onattrs.length; ++i) {
        this._setDefaultUL4ONAttr(this._ul4onattrs[i]);
      }
    }
  }, {
    key: "_loadUL4ONAttr",
    value: function _loadUL4ONAttr(name, value) {
      this[name] = value;
    }
  }, {
    key: "_setDefaultUL4ONAttr",
    value: function _setDefaultUL4ONAttr(name) {
      this[name] = null;
    }
  }, {
    key: "__getattr__",
    value: function __getattr__(name) {
      if (this._ul4attrs.has(name)) {
        var value = this[name];

        if (typeof value === "function") {
          var realvalue = value.bind(this);
          realvalue._ul4_name = value._ul4_name || value.name;
          realvalue._ul4_signature = value._ul4_signature;
          realvalue._ul4_needsobject = value._ul4_needsobject;
          realvalue._ul4_needscontext = value._ul4_needscontext;
          return realvalue;
        }

        return value;
      }

      throw new AttributeError(this, name);
    }
  }, {
    key: "__repr__",
    value: function __repr__() {
      return "<" + this.constructor.name + ">";
    }
  }]);

  return Base;
}(Proto);
var Handler =
/*#__PURE__*/
function () {
  function Handler() {
    _classCallCheck(this, Handler);
  }

  _createClass(Handler, [{
    key: "save",
    value: function save(record) {}
  }, {
    key: "delete",
    value: function _delete(record) {}
  }]);

  return Handler;
}();
var Globals =
/*#__PURE__*/
function (_Base) {
  _inherits(Globals, _Base);

  function Globals() {
    var _this;

    _classCallCheck(this, Globals);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Globals).call(this));
    _this.version = null;
    _this.platform = null;
    _this.user = null;
    _this.maxdbactions = null;
    _this.maxtemplateruntime = null;
    _this.flashmessages = null;
    _this.handler = new Handler();
    return _this;
  } // distance between two geo coordinates (see https://de.wikipedia.org/wiki/Orthodrome#Genauere_Formel_zur_Abstandsberechnung_auf_der_Erde)


  _createClass(Globals, [{
    key: "__repr__",
    value: function __repr__() {
      return "<Globals version=" + _repr(this.version) + ">";
    }
  }], [{
    key: "geodist",
    value: function geodist(geo1, geo2) {
      var sqsin = function sqsin(x) {
        x = Math.sin(x);
        return x * x;
      };

      var sqcos = function sqsos(x) {
        x = Math.cos(x);
        return x * x;
      };

      var deg2rad = Math.PI / 180; // Conversion factor degree -> radians

      var radius = 6378.137; // Equatorial radius of earth in km

      var flat = 1 / 298.257223563; // Earth flattening

      var lat1 = geo1.lat * deg2rad;
      var long1 = geo1["long"] * deg2rad;
      var lat2 = geo2.lat * deg2rad;
      var long2 = geo2["long"] * deg2rad;
      var F = (lat1 + lat2) / 2;
      var G = (lat1 - lat2) / 2;
      var l = (long1 - long2) / 2;
      var S = sqsin(G) * sqcos(l) + sqcos(F) * sqsin(l);
      var C = sqcos(G) * sqcos(l) + sqsin(F) * sqsin(l);
      var w = Math.atan(Math.sqrt(S / C));
      var D = 2 * w * radius;
      var T = Math.sqrt(S * C) / w;
      var H1 = (3 * T - 1) / (2 * C);
      var H2 = (3 * T + 1) / (2 * S);
      var s = D * (1 + flat * H1 * sqsin(F) * sqcos(G) - flat * H2 * sqcos(F) * sqsin(G));
      return s;
    }
  }]);

  return Globals;
}(Base);
Globals.prototype._ul4onattrs = ["version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages"];
Globals.prototype._ul4attrs = _makeset("version", "platform", "user", "maxdbactions", "maxtemplateruntime", "flashmessages");
var FlashMessage =
/*#__PURE__*/
function (_Base2) {
  _inherits(FlashMessage, _Base2);

  function FlashMessage() {
    _classCallCheck(this, FlashMessage);

    return _possibleConstructorReturn(this, _getPrototypeOf(FlashMessage).apply(this, arguments));
  }

  _createClass(FlashMessage, [{
    key: "__repr__",
    value: function __repr__() {
      return "<FlashMessage type=" + _repr(this.type) + " title=" + _repr(this.title) + ">";
    }
  }]);

  return FlashMessage;
}(Base);
FlashMessage.prototype._ul4onattrs = ["timestamp", "type", "title", "message"];
FlashMessage.prototype._ul4attrs = _makeset("timestamp", "type", "title", "message");
var App =
/*#__PURE__*/
function (_Base3) {
  _inherits(App, _Base3);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "__repr__",
    value: function __repr__() {
      return "<App id=" + _repr(this.id) + " name=" + _repr(this.name) + ">";
    }
  }, {
    key: "insert",
    value: function insert() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var record = this.__call__(values);

      this.globals.handler.save(this);
      return record;
    }
  }, {
    key: "__call__",
    value: function __call__() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var record = new Record(this);

      if (_ismap(values)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = values.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if (!record.fields.has(key)) throw new ArgumentError("update() get an unexpected keyword argument " + _repr(key));
            record.fields.get(key).value = value;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else if (_isobject(values)) {
        for (var key in values) {
          if (!record.fields.has(key)) throw new ArgumentError("update() get an unexpected keyword argument " + _repr(key));
          record.fields.get(key).value = values[key];
        }
      } else throw new TypeError$1("values must be an object or a Map");

      return record;
    }
  }, {
    key: "__getattr__",
    value: function __getattr__(name) {
      if (name.startsWith("c_")) {
        if (!this.controls.has(name.substr(2))) throw new AttributeError(this, name);
        return this.controls.get(name.substr(2));
      } else return _get(_getPrototypeOf(App.prototype), "__getattr__", this).call(this, name);
    }
  }]);

  return App;
}(Base);
App.prototype._ul4onattrs = ["id", "globals", "name", "description", "language", "startlink", "iconlarge", "iconsmall", "createdby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "basetable", "primarykey", "insertprocedure", "updateprocedure", "deleteprocedure", "templates", "createdat", "updatedat", "updatedby"];
App.prototype._ul4attrs = _makeset("id", "globals", "name", "description", "language", "startlink", "iconlarge", "iconsmall", "createdat", "createdby", "updatedat", "updatedby", "controls", "records", "recordcount", "installation", "categories", "params", "views", "datamanagement_identifier", "insert");
expose(App.prototype.__call__, ["**values"], {
  "needsobject": true
});
expose(App.prototype.insert, ["**values"], {
  "needsobject": true
});
var View =
/*#__PURE__*/
function (_Base4) {
  _inherits(View, _Base4);

  function View() {
    _classCallCheck(this, View);

    return _possibleConstructorReturn(this, _getPrototypeOf(View).apply(this, arguments));
  }

  _createClass(View, [{
    key: "__repr__",
    value: function __repr__() {
      return "<View id=" + _repr(this.id) + " name=" + _repr(this.name) + ">";
    }
  }]);

  return View;
}(Base);
View.prototype._ul4onattrs = ["id", "name", "app", "order", "width", "height", "start", "end"];
View.prototype._ul4attrs = _makeset("id", "name", "app", "order", "width", "height", "start", "end");
var DataSourceData =
/*#__PURE__*/
function (_Base5) {
  _inherits(DataSourceData, _Base5);

  function DataSourceData() {
    _classCallCheck(this, DataSourceData);

    return _possibleConstructorReturn(this, _getPrototypeOf(DataSourceData).apply(this, arguments));
  }

  _createClass(DataSourceData, [{
    key: "__repr__",
    value: function __repr__() {
      return "<DataSource.Data id=" + _repr(this.id) + " identifier=" + _repr(this.identifier) + ">";
    }
  }]);

  return DataSourceData;
}(Base);
DataSourceData.prototype._ul4onattrs = ["id", "identifier", "app", "apps"];
DataSourceData.prototype._ul4attrs = _makeset("id", "identifier", "app", "apps");
var Record =
/*#__PURE__*/
function (_Base6) {
  _inherits(Record, _Base6);

  function Record(app) {
    var _this2;

    _classCallCheck(this, Record);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Record).call(this));
    _this2.id = null;
    _this2.app = app;
    _this2.createdat = null;
    _this2.createdby = null;
    _this2.updatedat = null;
    _this2.updatedby = null;
    _this2.updatecount = 0;
    _this2._sparsevalues = new Map();
    _this2._values = null;
    _this2._fields = null;
    _this2.children = new Map();
    _this2.attachments = null;
    _this2.errors = [];
    _this2._is_deleted = false;
    return _this2;
  }

  _createClass(Record, [{
    key: "__repr__",
    value: function __repr__() {
      var v = ["<Record id=", _repr(this.id)];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.fields.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var field = _step2.value;

          if (field.control.priority) {
            v.push(" v_");
            v.push(field.control.identifier);
            v.push("=");
            v.push(_repr(field.value)); // FIXME: This might lead to infinite recursions
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      v.push(">");
      return v.join("");
    }
  }, {
    key: "is_dirty",
    value: function is_dirty() {
      if (this.id === null) return true;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.fields.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var field = _step3.value;
          if (field.is_dirty()) return true;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return false;
    }
  }, {
    key: "has_errors",
    value: function has_errors() {
      if (this.errors.length !== 0) return true;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.fields.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var field = _step4.value;
          if (field.has_errors()) return true;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: "delete",
    value: function _delete() {
      return this.app.globals.handler["delete"](this);
    }
  }, {
    key: "save",
    value: function save() {
      this.app.globals.handler.save(this);
    }
  }, {
    key: "update",
    value: function update() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (_ismap(values)) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = values.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _step5$value = _slicedToArray(_step5.value, 2),
                key = _step5$value[0],
                value = _step5$value[1];

            if (!this.fields.has(key)) throw new ArgumentError("update() get an unexpected keyword argument " + _repr(key));
            fields.get(key).value = value;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      } else if (_isobject(values)) {
        for (var key in values) {
          if (!this.fields.has(key)) throw new ArgumentError("update() get an unexpected keyword argument " + _repr(key));
          record.fields.get(key).value = values[key];
        }
      } else throw new TypeError$1("values must be an object or a Map");

      this.app.globals.handler.save(this);
    }
  }, {
    key: "search",
    value: function search(_search) {
      for (var identifier in _search) {
        var fieldsearch = _search[identifier];

        if (_bool(fieldsearch)) {
          if (!this.fields.get(identifier).search(fieldsearch)) return false;
        }
      }

      return true;
    }
  }, {
    key: "_dumpUL4ONAttr",
    value: function _dumpUL4ONAttr(name) {
      if (name === "values") return this._sparsevalues;else return this[name];
    }
  }, {
    key: "_loadUL4ONAttr",
    value: function _loadUL4ONAttr(name, value) {
      if (name === "values") {
        this._sparsevalues = value;
        this._values = null;
        this._fields = null;
      } else this[name] = value;
    }
  }, {
    key: "__getattr__",
    value: function __getattr__(name) {
      if (name.startsWith("c_")) return this.children.get(name.substr(2));else if (name.startsWith("f_")) return this.fields.get(name.substr(2));else if (name.startsWith("v_")) return this.values.get(name.substr(2));else return this[name];
    }
  }, {
    key: "__setattr__",
    value: function __setattr__(name, value) {
      if (name.startsWith("c_")) this.children[name.substr(2)] = value;else if (name.startsWith("v_")) this.fields.get(name.substr(2)).value = value;else throw new AttributeError(this, name);
    }
  }, {
    key: "values",
    get: function get() {
      if (this._values === null) {
        this._values = _havemap ? new Map() : {};
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this.app.controls.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _step6$value = _slicedToArray(_step6.value, 2),
                identifier = _step6$value[0],
                control = _step6$value[1];

            var fieldvalue = this._sparsevalues.get(identifier);

            if (typeof fieldvalue === "undefined") fieldvalue = null;

            this._values.set(identifier, fieldvalue);
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
              _iterator6["return"]();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }

      return this._values;
    }
  }, {
    key: "fields",
    get: function get() {
      if (this._fields === null) {
        this._fields = _havemap ? new Map() : {};
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = this.values.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _step7$value = _slicedToArray(_step7.value, 2),
                identifier = _step7$value[0],
                value = _step7$value[1];

            var field = new Field(this.app.controls.get(identifier), this, value);

            this._fields.set(identifier, field);
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
              _iterator7["return"]();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }

      return this._fields;
    }
  }]);

  return Record;
}(Base);
Record.prototype._ul4onattrs = ["id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children"];
Record.prototype._ul4attrs = _makeset("id", "app", "createdat", "createdby", "updatedat", "updatedby", "updatecount", "values", "attachments", "children");
expose(Record.prototype.is_dirty, []);
expose(Record.prototype.has_errors, []);
expose(Record.prototype["delete"], []);
expose(Record.prototype.save, []);
expose(Record.prototype.update, ["**values"], {
  "needsobject": true
});
var Control =
/*#__PURE__*/
function (_Base7) {
  _inherits(Control, _Base7);

  function Control() {
    _classCallCheck(this, Control);

    return _possibleConstructorReturn(this, _getPrototypeOf(Control).apply(this, arguments));
  }

  _createClass(Control, [{
    key: "__repr__",
    value: function __repr__() {
      return "<" + this.__type__ + " id=" + _repr(this.id) + " identifier=" + _repr(this.identifier) + ">";
    }
  }, {
    key: "_logsearch",
    value: function _logsearch(value, search) {} //console.log("Searching for " + ul4._repr(search.value) + " in " + ul4._repr(this) + " with operator " + search.operator + " in value " + ul4._repr(value));
    // base implemntation, always returns ``false`` (i.e. "not found")
    // ``value`` is the value of the field
    // ``search`` is an object with information what we're searching for
    // keys in ``search`` are: ``operator`` (and ``value`` (if required by the operator))

  }, {
    key: "search",
    value: function search(value, _search2) {
      return false;
    }
  }]);

  return Control;
}(Base);
Control.prototype.type = null;
Control.prototype.subtype = null;
Control.prototype._ul4onattrs = ["id", "identifier", "field", "app", "label", "priority", "order", "default", "ininsertprocedure", "inupdateprocedure"];
Control.prototype._ul4attrs = _makeset("id", "identifier", "field", "app", "label", "priority", "order", "default", "ininsertprocedure", "inupdateprocedure");
var BoolControl =
/*#__PURE__*/
function (_Control) {
  _inherits(BoolControl, _Control);

  function BoolControl() {
    _classCallCheck(this, BoolControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(BoolControl).apply(this, arguments));
  }

  _createClass(BoolControl, [{
    key: "search",
    // ``search`` must by ``null``, ``false`` or ``true``
    value: function search(value, _search3) {
      this._logsearch(value, _search3);

      if (_search3.operator === "equals") return _search3.value === value;else return false;
    }
  }]);

  return BoolControl;
}(Control);
BoolControl.prototype.type = "bool";
var IntControl =
/*#__PURE__*/
function (_Control2) {
  _inherits(IntControl, _Control2);

  function IntControl() {
    _classCallCheck(this, IntControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(IntControl).apply(this, arguments));
  }

  _createClass(IntControl, [{
    key: "search",
    // ``search.value`` must by ``null`` or an integer
    value: function search(value, _search4) {
      this._logsearch(value, _search4);

      if (_search4.operator === "equals") return _search4.value === value;else return false;
    }
  }]);

  return IntControl;
}(Control);
IntControl.prototype.type = "int";
var NumberControl =
/*#__PURE__*/
function (_Control3) {
  _inherits(NumberControl, _Control3);

  function NumberControl() {
    _classCallCheck(this, NumberControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(NumberControl).apply(this, arguments));
  }

  _createClass(NumberControl, [{
    key: "search",
    // ``search.value`` must by ``null`` or an integer
    value: function search(value, _search5) {
      this._logsearch(value, _search5);

      if (_search5.operator === "equals") return _search5.value === value;else if (_search5.operator === "range") {
        if (value === null) return false;
        return (_search5.minvalue === null || _search5.minvalue <= value) && (_search5.maxvalue === null || value < _search5.maxvalue);
      } else return false;
    }
  }]);

  return NumberControl;
}(Control);
NumberControl.prototype.type = "number";
var StringControl =
/*#__PURE__*/
function (_Control4) {
  _inherits(StringControl, _Control4);

  function StringControl() {
    _classCallCheck(this, StringControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(StringControl).apply(this, arguments));
  }

  _createClass(StringControl, [{
    key: "search",
    value: function search(value, _search6) {
      this._logsearch(value, _search6);

      if (_search6.operator === "equals") return _search6.value === value;else if (_search6.operator === "contains") {
        if (_search6.value === null || value === null) return _search6.value === value;else return value.toLowerCase().indexOf(_search6.value.toLowerCase()) >= 0;
      }
    }
  }]);

  return StringControl;
}(Control);
StringControl.prototype.type = "string";
var TextControl =
/*#__PURE__*/
function (_StringControl) {
  _inherits(TextControl, _StringControl);

  function TextControl() {
    _classCallCheck(this, TextControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(TextControl).apply(this, arguments));
  }

  return TextControl;
}(StringControl);
TextControl.prototype.subtype = "text";
var EmailControl =
/*#__PURE__*/
function (_StringControl2) {
  _inherits(EmailControl, _StringControl2);

  function EmailControl() {
    _classCallCheck(this, EmailControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmailControl).apply(this, arguments));
  }

  return EmailControl;
}(StringControl);
EmailControl.prototype.subtype = "email";
var URLControl =
/*#__PURE__*/
function (_StringControl3) {
  _inherits(URLControl, _StringControl3);

  function URLControl() {
    _classCallCheck(this, URLControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(URLControl).apply(this, arguments));
  }

  return URLControl;
}(StringControl);
URLControl.prototype.subtype = "url";
var TelControl =
/*#__PURE__*/
function (_StringControl4) {
  _inherits(TelControl, _StringControl4);

  function TelControl() {
    _classCallCheck(this, TelControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(TelControl).apply(this, arguments));
  }

  return TelControl;
}(StringControl);
TelControl.prototype.subtype = "tel";
var PasswordControl =
/*#__PURE__*/
function (_StringControl5) {
  _inherits(PasswordControl, _StringControl5);

  function PasswordControl() {
    _classCallCheck(this, PasswordControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(PasswordControl).apply(this, arguments));
  }

  return PasswordControl;
}(StringControl);
PasswordControl.prototype.subtype = "password";
var TextAreaControl =
/*#__PURE__*/
function (_StringControl6) {
  _inherits(TextAreaControl, _StringControl6);

  function TextAreaControl() {
    _classCallCheck(this, TextAreaControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(TextAreaControl).apply(this, arguments));
  }

  return TextAreaControl;
}(StringControl);
TextAreaControl.prototype.subtype = "textarea";
TextAreaControl.prototype._ul4onattrs = StringControl.prototype._ul4onattrs.concat(["encrypted"]);
TextAreaControl.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(StringControl.prototype._ul4attrs).concat(["encrypted"]));
var DateControl =
/*#__PURE__*/
function (_Control5) {
  _inherits(DateControl, _Control5);

  function DateControl() {
    _classCallCheck(this, DateControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(DateControl).apply(this, arguments));
  }

  _createClass(DateControl, [{
    key: "formatstring",
    value: function formatstring(language) {
      language = language || this.app.language;
      if (language === "de") return "%d.%m.%Y";else return "%m/%d/%Y";
    } // searchvalue must be ``null``, a ``Date`` object or a string

  }, {
    key: "search",
    value: function search(value, _search7) {
      this._logsearch(value, _search7);

      var searchvalue = _search7.value;
      if (Object.prototype.toString.call(searchvalue) == "[object Date]") searchvalue = _format(searchvalue, this.formatstring(), this.app.language);
      if (value !== null) value = _format(value, this.formatstring(), this.app.language);
      if (_search7.operator === "equals") return searchvalue === value;else if (_search7.operator === "contains") {
        if (searchvalue === null || value === null) return searchvalue === value;else return value.toLowerCase().indexOf(searchvalue.toLowerCase()) >= 0;
      } else return false;
    }
  }]);

  return DateControl;
}(Control);
DateControl.prototype.type = "date";
DateControl.prototype.subtype = "date";
var DatetimeMinuteControl =
/*#__PURE__*/
function (_DateControl) {
  _inherits(DatetimeMinuteControl, _DateControl);

  function DatetimeMinuteControl() {
    _classCallCheck(this, DatetimeMinuteControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(DatetimeMinuteControl).apply(this, arguments));
  }

  _createClass(DatetimeMinuteControl, [{
    key: "formatstring",
    value: function formatstring(language) {
      language = language || this.app.language;
      if (language === "de") return "%d.%m.%Y %H:%M";else return "%m/%d/%Y %H:%M";
    }
  }]);

  return DatetimeMinuteControl;
}(DateControl);
DatetimeMinuteControl.prototype.subtype = "datetimeminute";
var DatetimeSecondControl =
/*#__PURE__*/
function (_DateControl2) {
  _inherits(DatetimeSecondControl, _DateControl2);

  function DatetimeSecondControl() {
    _classCallCheck(this, DatetimeSecondControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(DatetimeSecondControl).apply(this, arguments));
  }

  _createClass(DatetimeSecondControl, [{
    key: "formatstring",
    value: function formatstring(language) {
      language = language || this.app.language;
      if (language === "de") return "%d.%m.%Y %H:%M:%S";else return "%m/%d/%Y %H:%M:%S";
    }
  }]);

  return DatetimeSecondControl;
}(DateControl);
DatetimeSecondControl.prototype.subtype = "datetimesecond";
var LookupControl =
/*#__PURE__*/
function (_Control6) {
  _inherits(LookupControl, _Control6);

  function LookupControl() {
    _classCallCheck(this, LookupControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(LookupControl).apply(this, arguments));
  }

  _createClass(LookupControl, [{
    key: "search",
    // ``search.value`` must be ``null`` or a ``LookupItem`` key
    value: function search(value, _search8) {
      if (_search8.operator === "equals") {
        if (value === null) return _search8.value === null;else return value.key === _search8.value;
      } else return false;
    }
  }]);

  return LookupControl;
}(Control);
LookupControl.prototype.type = "lookup";
LookupControl.prototype._ul4onattrs = Control.prototype._ul4onattrs.concat(["lookupdata"]);
LookupControl.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(Control.prototype._ul4attrs).concat(["lookupdata"]));
var LookupSelectControl =
/*#__PURE__*/
function (_LookupControl) {
  _inherits(LookupSelectControl, _LookupControl);

  function LookupSelectControl() {
    _classCallCheck(this, LookupSelectControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(LookupSelectControl).apply(this, arguments));
  }

  return LookupSelectControl;
}(LookupControl);
LookupSelectControl.prototype.subtype = "select";
var LookupRadioControl =
/*#__PURE__*/
function (_LookupControl2) {
  _inherits(LookupRadioControl, _LookupControl2);

  function LookupRadioControl() {
    _classCallCheck(this, LookupRadioControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(LookupRadioControl).apply(this, arguments));
  }

  return LookupRadioControl;
}(LookupControl);
LookupRadioControl.prototype.subtype = "radio";
var LookupChoiceControl =
/*#__PURE__*/
function (_LookupControl3) {
  _inherits(LookupChoiceControl, _LookupControl3);

  function LookupChoiceControl() {
    _classCallCheck(this, LookupChoiceControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(LookupChoiceControl).apply(this, arguments));
  }

  return LookupChoiceControl;
}(LookupControl);
LookupChoiceControl.prototype.subtype = "choice";
var AppLookupControl =
/*#__PURE__*/
function (_Control7) {
  _inherits(AppLookupControl, _Control7);

  function AppLookupControl() {
    _classCallCheck(this, AppLookupControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppLookupControl).apply(this, arguments));
  }

  _createClass(AppLookupControl, [{
    key: "search",
    // ``search.value`` must be an object containing the search criteria for the referenced record
    value: function search(value, _search9) {
      if (value === null || _search9.value === null) return value === _search9.value;else return value.search(_search9);
    }
  }]);

  return AppLookupControl;
}(Control);
AppLookupControl.prototype.type = "applookup";
AppLookupControl.prototype._ul4onattrs = Control.prototype._ul4onattrs.concat(["lookupapp", "lookupcontrols"]);
AppLookupControl.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(Control.prototype._ul4attrs).concat(["lookupapp", "lookupcontrols"]));
var AppLookupSelectControl =
/*#__PURE__*/
function (_AppLookupControl) {
  _inherits(AppLookupSelectControl, _AppLookupControl);

  function AppLookupSelectControl() {
    _classCallCheck(this, AppLookupSelectControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppLookupSelectControl).apply(this, arguments));
  }

  return AppLookupSelectControl;
}(AppLookupControl);
AppLookupSelectControl.prototype.subtype = "select";
var AppLookupRadioControl =
/*#__PURE__*/
function (_AppLookupControl2) {
  _inherits(AppLookupRadioControl, _AppLookupControl2);

  function AppLookupRadioControl() {
    _classCallCheck(this, AppLookupRadioControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppLookupRadioControl).apply(this, arguments));
  }

  return AppLookupRadioControl;
}(AppLookupControl);
AppLookupRadioControl.prototype.subtype = "radio";
var AppLookupChoiceControl =
/*#__PURE__*/
function (_AppLookupControl3) {
  _inherits(AppLookupChoiceControl, _AppLookupControl3);

  function AppLookupChoiceControl() {
    _classCallCheck(this, AppLookupChoiceControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppLookupChoiceControl).apply(this, arguments));
  }

  return AppLookupChoiceControl;
}(AppLookupControl);
AppLookupChoiceControl.prototype.subtype = "choice";
var MultipleLookupControl =
/*#__PURE__*/
function (_LookupControl4) {
  _inherits(MultipleLookupControl, _LookupControl4);

  function MultipleLookupControl() {
    _classCallCheck(this, MultipleLookupControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleLookupControl).apply(this, arguments));
  }

  _createClass(MultipleLookupControl, [{
    key: "search",
    // search.value must be ``null`` or a ``LookupItem`` key
    value: function search(value, _search10) {
      if (_search10.operator === "equals") {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = value[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var item = _step8.value;
            if (item.key === _search10.value) return true;
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
              _iterator8["return"]();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        return false;
      } else return false;
    }
  }]);

  return MultipleLookupControl;
}(LookupControl);
MultipleLookupControl.prototype.subtype = "multiplelookup";
var MultipleLookupSelectControl =
/*#__PURE__*/
function (_MultipleLookupContro) {
  _inherits(MultipleLookupSelectControl, _MultipleLookupContro);

  function MultipleLookupSelectControl() {
    _classCallCheck(this, MultipleLookupSelectControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleLookupSelectControl).apply(this, arguments));
  }

  return MultipleLookupSelectControl;
}(MultipleLookupControl);
MultipleLookupSelectControl.prototype.subtype = "select";
var MultipleLookupCheckboxControl =
/*#__PURE__*/
function (_MultipleLookupContro2) {
  _inherits(MultipleLookupCheckboxControl, _MultipleLookupContro2);

  function MultipleLookupCheckboxControl() {
    _classCallCheck(this, MultipleLookupCheckboxControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleLookupCheckboxControl).apply(this, arguments));
  }

  return MultipleLookupCheckboxControl;
}(MultipleLookupControl);
MultipleLookupCheckboxControl.prototype.subtype = "checkbox";
var MultipleLookupChoiceControl =
/*#__PURE__*/
function (_MultipleLookupContro3) {
  _inherits(MultipleLookupChoiceControl, _MultipleLookupContro3);

  function MultipleLookupChoiceControl() {
    _classCallCheck(this, MultipleLookupChoiceControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleLookupChoiceControl).apply(this, arguments));
  }

  return MultipleLookupChoiceControl;
}(MultipleLookupControl);
MultipleLookupChoiceControl.prototype.subtype = "choice";
var MultipleAppLookupControl =
/*#__PURE__*/
function (_AppLookupControl4) {
  _inherits(MultipleAppLookupControl, _AppLookupControl4);

  function MultipleAppLookupControl() {
    _classCallCheck(this, MultipleAppLookupControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleAppLookupControl).apply(this, arguments));
  }

  _createClass(MultipleAppLookupControl, [{
    key: "search",
    // ``search.value`` must be an object containing the search criteria for the referenced record
    value: function search(value, _search11) {
      if (_search11.operator === "equals") {
        if (_search11.value === null) return value.length === 0;else {
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = value[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var item = _step9.value;
              if (item.search(_search11.value)) return true;
            }
          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
                _iterator9["return"]();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }

          return false;
        }
      } else return false;
    }
  }]);

  return MultipleAppLookupControl;
}(AppLookupControl);
MultipleAppLookupControl.prototype.type = "multipleapplookup";
var MultipleAppLookupSelectControl =
/*#__PURE__*/
function (_MultipleAppLookupCon) {
  _inherits(MultipleAppLookupSelectControl, _MultipleAppLookupCon);

  function MultipleAppLookupSelectControl() {
    _classCallCheck(this, MultipleAppLookupSelectControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleAppLookupSelectControl).apply(this, arguments));
  }

  return MultipleAppLookupSelectControl;
}(MultipleAppLookupControl);
MultipleAppLookupSelectControl.prototype.subtype = "select";
var MultipleAppLookupCheckboxControl =
/*#__PURE__*/
function (_MultipleAppLookupCon2) {
  _inherits(MultipleAppLookupCheckboxControl, _MultipleAppLookupCon2);

  function MultipleAppLookupCheckboxControl() {
    _classCallCheck(this, MultipleAppLookupCheckboxControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleAppLookupCheckboxControl).apply(this, arguments));
  }

  return MultipleAppLookupCheckboxControl;
}(MultipleAppLookupControl);
MultipleAppLookupCheckboxControl.prototype.subtype = "checkbox";
var MultipleAppLookupChoiceControl =
/*#__PURE__*/
function (_MultipleAppLookupCon3) {
  _inherits(MultipleAppLookupChoiceControl, _MultipleAppLookupCon3);

  function MultipleAppLookupChoiceControl() {
    _classCallCheck(this, MultipleAppLookupChoiceControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultipleAppLookupChoiceControl).apply(this, arguments));
  }

  return MultipleAppLookupChoiceControl;
}(MultipleAppLookupControl);
MultipleAppLookupChoiceControl.prototype.subtype = "choice";
var GeoControl =
/*#__PURE__*/
function (_Control8) {
  _inherits(GeoControl, _Control8);

  function GeoControl() {
    _classCallCheck(this, GeoControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(GeoControl).apply(this, arguments));
  }

  return GeoControl;
}(Control);
GeoControl.prototype.type = "geo";
var FileControl =
/*#__PURE__*/
function (_Control9) {
  _inherits(FileControl, _Control9);

  function FileControl() {
    _classCallCheck(this, FileControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileControl).apply(this, arguments));
  }

  return FileControl;
}(Control);
FileControl.prototype.type = "file";
var ButtonControl =
/*#__PURE__*/
function (_Control10) {
  _inherits(ButtonControl, _Control10);

  function ButtonControl() {
    _classCallCheck(this, ButtonControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(ButtonControl).apply(this, arguments));
  }

  return ButtonControl;
}(Control);
ButtonControl.prototype.type = "button";
var Field =
/*#__PURE__*/
function (_Base8) {
  _inherits(Field, _Base8);

  function Field(control, record, value) {
    var _this3;

    _classCallCheck(this, Field);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Field).call(this));
    _this3.control = control;
    _this3.record = record;
    _this3._value = value;
    _this3._dirty = false;
    _this3.errors = [];
    return _this3;
  }

  _createClass(Field, [{
    key: "is_empty",
    value: function is_empty() {
      return this._value === null || _islist(this._value) && this._value.length === 0;
    }
  }, {
    key: "is_dirty",
    value: function is_dirty() {
      return this._dirty;
    }
  }, {
    key: "has_errors",
    value: function has_errors() {
      return this.errors.length !== 0;
    }
  }, {
    key: "search",
    value: function search(searchvalue) {
      return this.control.search(this.value, searchvalue);
    }
  }, {
    key: "__repr__",
    value: function __repr__() {
      var s = "<Field identifier=";
      s += _repr(this.control.identifier);
      if (this._dirty) s += " is_dirty()=True";
      if (this.errors.length !== 0) s += " has_errors()=True";
      s += ">";
      return s;
    }
  }, {
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      var oldvalue = this._value;

      if (_ne(oldvalue, value)) {
        this.record.values.set(this.control.identifier, value);
        this._value = value;
        this._dirty = true;
      }
    }
  }]);

  return Field;
}(Base);
var LookupItem =
/*#__PURE__*/
function (_Base9) {
  _inherits(LookupItem, _Base9);

  function LookupItem() {
    _classCallCheck(this, LookupItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(LookupItem).apply(this, arguments));
  }

  _createClass(LookupItem, [{
    key: "__repr__",
    value: function __repr__() {
      return "<LookupItem key=" + _repr(this.key) + " label=" + _repr(this.label) + ">";
    }
  }]);

  return LookupItem;
}(Base);
LookupItem.prototype._ul4onattrs = ["key", "label"];
LookupItem.prototype._ul4attrs = _makeset("key", "label");
var User =
/*#__PURE__*/
function (_Base10) {
  _inherits(User, _Base10);

  function User() {
    _classCallCheck(this, User);

    return _possibleConstructorReturn(this, _getPrototypeOf(User).apply(this, arguments));
  }

  _createClass(User, [{
    key: "__repr__",
    value: function __repr__() {
      return "<User id=" + _repr(this.id) + " firstname=" + _repr(this.firstname) + " surname=" + _repr(this.surname) + " email=" + _repr(this.email) + ">";
    }
  }]);

  return User;
}(Base);
User.prototype._ul4onattrs = ["_id", "id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews"];
User.prototype._ul4attrs = _makeset("_id", "id", "gender", "firstname", "surname", "initials", "email", "language", "avatarsmall", "avatarlarge", "keyviews");
var File =
/*#__PURE__*/
function (_Base11) {
  _inherits(File, _Base11);

  function File() {
    _classCallCheck(this, File);

    return _possibleConstructorReturn(this, _getPrototypeOf(File).apply(this, arguments));
  }

  _createClass(File, [{
    key: "__repr__",
    value: function __repr__() {
      return "<File id=" + _repr(this.id) + " url=" + _repr(this.url) + " filename=" + _repr(this.filename) + ">";
    }
  }]);

  return File;
}(Base);
File.prototype._ul4onattrs = ["id", "url", "filename", "mimetype", "width", "height", "internalid", "createdat", "size"];
File.prototype._ul4attrs = _makeset("id", "url", "filename", "mimetype", "width", "height", "size", "createdat");
var Geo =
/*#__PURE__*/
function (_Base12) {
  _inherits(Geo, _Base12);

  function Geo(lat, _long, info) {
    var _this4;

    _classCallCheck(this, Geo);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Geo).call(this));
    _this4.lat = lat;
    _this4["long"] = _long;
    _this4.info = info;
    return _this4;
  }

  _createClass(Geo, [{
    key: "__repr__",
    value: function __repr__() {
      return "<Geo lat=" + _repr(this.lat) + " long=" + _repr(this["long"]) + " info=" + _repr(this.info) + ">";
    }
  }]);

  return Geo;
}(Base);
Geo.prototype._ul4onattrs = ["lat", "long", "info"];
Geo.prototype._ul4attrs = _makeset("lat", "long", "info");
var Attachment =
/*#__PURE__*/
function (_Base13) {
  _inherits(Attachment, _Base13);

  function Attachment() {
    _classCallCheck(this, Attachment);

    return _possibleConstructorReturn(this, _getPrototypeOf(Attachment).apply(this, arguments));
  }

  _createClass(Attachment, [{
    key: "__repr__",
    value: function __repr__() {
      return "<" + this.__type__ + " id=" + _repr(this.id) + " label=" + _repr(this.label) + ">";
    }
  }]);

  return Attachment;
}(Base);
Attachment.prototype._ul4onattrs = ["id", "record", "label", "active"];
Attachment.prototype._ul4attrs = _makeset("id", "record", "label", "active");
var NoteAttachment =
/*#__PURE__*/
function (_Attachment) {
  _inherits(NoteAttachment, _Attachment);

  function NoteAttachment() {
    _classCallCheck(this, NoteAttachment);

    return _possibleConstructorReturn(this, _getPrototypeOf(NoteAttachment).apply(this, arguments));
  }

  return NoteAttachment;
}(Attachment);
NoteAttachment.prototype.type = "noteattachment";
NoteAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
NoteAttachment.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(Attachment.prototype._ul4onattrs).concat(["value"]));
var URLAttachment =
/*#__PURE__*/
function (_Attachment2) {
  _inherits(URLAttachment, _Attachment2);

  function URLAttachment() {
    _classCallCheck(this, URLAttachment);

    return _possibleConstructorReturn(this, _getPrototypeOf(URLAttachment).apply(this, arguments));
  }

  return URLAttachment;
}(Attachment);
URLAttachment.prototype.type = "urlattachment";
URLAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
URLAttachment.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(Attachment.prototype._ul4onattrs).concat(["value"]));
var FileAttachment =
/*#__PURE__*/
function (_Attachment3) {
  _inherits(FileAttachment, _Attachment3);

  function FileAttachment() {
    _classCallCheck(this, FileAttachment);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileAttachment).apply(this, arguments));
  }

  return FileAttachment;
}(Attachment);
FileAttachment.prototype.type = "fileattachment";
FileAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
FileAttachment.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(Attachment.prototype._ul4onattrs).concat(["value"]));
var ImageAttachment =
/*#__PURE__*/
function (_Attachment4) {
  _inherits(ImageAttachment, _Attachment4);

  function ImageAttachment() {
    _classCallCheck(this, ImageAttachment);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImageAttachment).apply(this, arguments));
  }

  return ImageAttachment;
}(Attachment);
ImageAttachment.prototype.type = "imageattachment";
ImageAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["original", "thumb", "small", "medium", "large"]);
ImageAttachment.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(Attachment.prototype._ul4onattrs).concat(["original", "thumb", "small", "medium", "large"]));
var JSONAttachment =
/*#__PURE__*/
function (_Attachment5) {
  _inherits(JSONAttachment, _Attachment5);

  function JSONAttachment() {
    _classCallCheck(this, JSONAttachment);

    return _possibleConstructorReturn(this, _getPrototypeOf(JSONAttachment).apply(this, arguments));
  }

  _createClass(JSONAttachment, [{
    key: "_dumpUL4ONAttr",
    value: function _dumpUL4ONAttr(name) {
      if (name === "value") return _asjson(this.value);else return this[name];
    }
  }, {
    key: "_loadUL4ONAttr",
    value: function _loadUL4ONAttr(name, value) {
      if (name === "value") this.value = _fromjson(value);else this[name] = value;
    }
  }]);

  return JSONAttachment;
}(Attachment);
JSONAttachment.prototype.type = "jsonattachment";
JSONAttachment.prototype._ul4onattrs = Attachment.prototype._ul4onattrs.concat(["value"]);
JSONAttachment.prototype._ul4attrs = _makeset.apply(ul4, _toConsumableArray(Attachment.prototype._ul4onattrs).concat(["value"]));
var Installation =
/*#__PURE__*/
function (_Base14) {
  _inherits(Installation, _Base14);

  function Installation() {
    _classCallCheck(this, Installation);

    return _possibleConstructorReturn(this, _getPrototypeOf(Installation).apply(this, arguments));
  }

  _createClass(Installation, [{
    key: "__repr__",
    value: function __repr__() {
      return "<Installation id=" + _repr(this.id) + " name=" + _repr(this.name) + ">";
    }
  }]);

  return Installation;
}(Base);
Installation.prototype._ul4onattrs = ["id", "name"];
Installation.prototype._ul4attrs = _makeset("id", "name");
var Category =
/*#__PURE__*/
function (_Base15) {
  _inherits(Category, _Base15);

  function Category() {
    _classCallCheck(this, Category);

    return _possibleConstructorReturn(this, _getPrototypeOf(Category).apply(this, arguments));
  }

  _createClass(Category, [{
    key: "__repr__",
    value: function __repr__() {
      var v = [];
      var category = this;

      while (category !== null) {
        v.splice(0, 0, category.identifier);
        category = category.parent;
      }

      return "<Category id=" + _repr(this.id) + " identifierpath=" + _repr(v.join("/")) + +" name=" + _repr(this.name) + ">";
    }
  }]);

  return Category;
}(Base);
Category.prototype._ul4onattrs = ["id", "identifier", "name", "order", "parent", "children", "apps"];
Category.prototype._ul4attrs = _makeset("id", "identifier", "name", "order", "parent", "children", "apps");
var KeyView =
/*#__PURE__*/
function (_Base16) {
  _inherits(KeyView, _Base16);

  function KeyView() {
    _classCallCheck(this, KeyView);

    return _possibleConstructorReturn(this, _getPrototypeOf(KeyView).apply(this, arguments));
  }

  _createClass(KeyView, [{
    key: "__repr__",
    value: function __repr__() {
      return "<KeyView id=" + _repr(this.id) + " identifier=" + _repr(this.identifier) + ">";
    }
  }]);

  return KeyView;
}(Base);
KeyView.prototype._ul4onattrs = ["id", "identifier", "name", "key", "user"];
KeyView.prototype._ul4attrs = _makeset("id", "identifier", "name", "key", "user");
var AppParameter =
/*#__PURE__*/
function (_Base17) {
  _inherits(AppParameter, _Base17);

  function AppParameter() {
    _classCallCheck(this, AppParameter);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppParameter).apply(this, arguments));
  }

  _createClass(AppParameter, [{
    key: "__repr__",
    value: function __repr__() {
      return "<AppParameter id=" + _repr(this.id) + " identifier=" + _repr(this.identifier) + ">";
    }
  }]);

  return AppParameter;
}(Base);
AppParameter.prototype._ul4onattrs = ["id", "app", "identifier", "description", "value"];
AppParameter.prototype._ul4attrs = _makeset("id", "app", "identifier", "description", "value");
var classes = [Globals, FlashMessage, App, View, DataSourceData, Record, BoolControl, IntControl, NumberControl, TextControl, EmailControl, URLControl, TelControl, PasswordControl, TextAreaControl, DateControl, DatetimeMinuteControl, DatetimeSecondControl, LookupControl, LookupSelectControl, LookupRadioControl, LookupChoiceControl, AppLookupControl, AppLookupSelectControl, AppLookupRadioControl, AppLookupChoiceControl, MultipleLookupControl, MultipleLookupSelectControl, MultipleLookupCheckboxControl, MultipleLookupChoiceControl, MultipleAppLookupControl, MultipleAppLookupSelectControl, MultipleAppLookupCheckboxControl, MultipleAppLookupChoiceControl, GeoControl, FileControl, ButtonControl, Field, LookupItem, User, File, Geo, NoteAttachment, URLAttachment, FileAttachment, ImageAttachment, JSONAttachment, Installation, Category, KeyView, AppParameter];

for (var _i = 0, _classes = classes; _i < _classes.length; _i++) {
  var _constructor = _classes[_i];
  register("de.livinglogic.livingapi." + _constructor.name.toLowerCase(), _constructor);
}

export { App, AppLookupChoiceControl, AppLookupControl, AppLookupRadioControl, AppLookupSelectControl, AppParameter, Attachment, Base, BoolControl, ButtonControl, Category, Control, DataSourceData, DateControl, DatetimeMinuteControl, DatetimeSecondControl, EmailControl, Field, File, FileAttachment, FileControl, FlashMessage, Geo, GeoControl, Globals, Handler, ImageAttachment, Installation, IntControl, JSONAttachment, KeyView, LookupChoiceControl, LookupControl, LookupItem, LookupRadioControl, LookupSelectControl, MultipleAppLookupCheckboxControl, MultipleAppLookupChoiceControl, MultipleAppLookupControl, MultipleAppLookupSelectControl, MultipleLookupCheckboxControl, MultipleLookupChoiceControl, MultipleLookupControl, MultipleLookupSelectControl, NoteAttachment, NumberControl, PasswordControl, Record, StringControl, TelControl, TextAreaControl, TextControl, URLAttachment, URLControl, User, View, version };
//# sourceMappingURL=livingapi.js.map
