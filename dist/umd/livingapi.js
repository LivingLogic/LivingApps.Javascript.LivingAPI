!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("@livinglogic/ul4")):"function"==typeof define&&define.amd?define(["exports","@livinglogic/ul4"],e):e((t=t||self).la={},t.ul4)}(this,function(t,e){"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function _createSuper(t){return function(){var e,r=_getPrototypeOf(t);if(function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()){var o=_getPrototypeOf(this).constructor;e=Reflect.construct(r,arguments,o)}else e=r.apply(this,arguments);return _possibleConstructorReturn(this,e)}}function _get(t,e,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(t,e,r){var o=function _superPropBase(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=_getPrototypeOf(t)););return t}(t,e);if(o){var n=Object.getOwnPropertyDescriptor(o,e);return n.get?n.get.call(r):n.value}})(t,e,r||t)}function _slicedToArray(t,e){return function _arrayWithHoles(t){if(Array.isArray(t))return t}(t)||function _iterableToArrayLimit(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var r=[],o=!0,n=!1,a=void 0;try{for(var l,i=t[Symbol.iterator]();!(o=(l=i.next()).done)&&(r.push(l.value),!e||r.length!==e);o=!0);}catch(t){n=!0,a=t}finally{try{o||null==i.return||i.return()}finally{if(n)throw a}}return r}(t,e)||_unsupportedIterableToArray(t,e)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _toConsumableArray(t){return function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}(t)||function _iterableToArray(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||_unsupportedIterableToArray(t)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,o=new Array(e);r<e;r++)o[r]=t[r];return o}function _createForOfIteratorHelper(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=_unsupportedIterableToArray(t))){var e=0,r=function(){};return{s:r,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,n,a=!0,l=!1;return{s:function(){o=t[Symbol.iterator]()},n:function(){var t=o.next();return a=t.done,t},e:function(t){l=!0,n=t},f:function(){try{a||null==o.return||o.return()}finally{if(l)throw n}}}}var r=function(t){_inherits(Base,e.Proto);var r=_createSuper(Base);function Base(){return _classCallCheck(this,Base),r.call(this)}return _createClass(Base,[{key:"ul4ondump",value:function ul4ondump(t){for(var e=0;e<this._ul4onattrs.length;++e)t.dump(this._dumpUL4ONAttr(this._ul4onattrs[e]))}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return this[t]}},{key:"ul4onload",value:function ul4onload(t){for(var e=0,r=t.loadcontent();;++e){var o=r.next();if(o.done)break;e<this._ul4onattrs.length&&this._loadUL4ONAttr(this._ul4onattrs[e],o.value)}for(;e<this._ul4onattrs.length;++e)this._setDefaultUL4ONAttr(this._ul4onattrs[e])}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,e){this[t]=e}},{key:"_setDefaultUL4ONAttr",value:function _setDefaultUL4ONAttr(t){this[t]=null}},{key:"__getattr__",value:function __getattr__(t){if(this._ul4attrs.has(t)){var r=this[t];if("function"==typeof r){var o=r.bind(this);return o._ul4_name=r._ul4_name||r.name,o._ul4_signature=r._ul4_signature,o._ul4_needsobject=r._ul4_needsobject,o._ul4_needscontext=r._ul4_needscontext,o}return r}throw new e.AttributeError(this,t)}},{key:"__repr__",value:function __repr__(){return"<"+this.constructor.name+">"}}]),Base}(),o=function(){function Handler(){_classCallCheck(this,Handler)}return _createClass(Handler,[{key:"save",value:function save(t){}},{key:"delete",value:function _delete(t){}}]),Handler}(),n=function(t){_inherits(Globals,r);var n=_createSuper(Globals);function Globals(){var t;return _classCallCheck(this,Globals),(t=n.call(this)).version=null,t.hostname=null,t.platform=null,t.user=null,t.lang=null,t.maxdbactions=null,t.maxtemplateruntime=null,t.flashmessages=null,t.handler=new o,t}return _createClass(Globals,[{key:"__repr__",value:function __repr__(){return"<Globals version="+e._repr(this.version)+">"}}],[{key:"geodist",value:function geodist(t,e){var r=function sqsin(t){return(t=Math.sin(t))*t},o=function sqsos(t){return(t=Math.cos(t))*t},n=Math.PI/180,a=1/298.257223563,l=t.lat*n,i=t.long*n,u=e.lat*n,s=(l+u)/2,p=(l-u)/2,c=(i-e.long*n)/2,_=r(p)*o(c)+o(s)*r(c),h=o(p)*o(c)+r(s)*r(c),y=Math.atan(Math.sqrt(_/h)),f=2*y*6378.137,C=Math.sqrt(_*h)/y,d=(3*C+1)/(2*_);return f*(1+a*((3*C-1)/(2*h))*r(s)*o(p)-a*d*o(s)*r(p))}}]),Globals}();n.prototype._ul4onattrs=["version","platform","user","maxdbactions","maxtemplateruntime","flashmessages","lang","datasources","hostname"],n.prototype._ul4attrs=e._makeset("version","hostname","platform","user","lang","maxdbactions","maxtemplateruntime","flashmessages");var a=function(t){_inherits(FlashMessage,r);var o=_createSuper(FlashMessage);function FlashMessage(){return _classCallCheck(this,FlashMessage),o.apply(this,arguments)}return _createClass(FlashMessage,[{key:"__repr__",value:function __repr__(){return"<FlashMessage type="+e._repr(this.type)+" title="+e._repr(this.title)+">"}}]),FlashMessage}();a.prototype._ul4onattrs=["timestamp","type","title","message"],a.prototype._ul4attrs=e._makeset("timestamp","type","title","message");var l=function(t){_inherits(App,r);var o=_createSuper(App);function App(){return _classCallCheck(this,App),o.apply(this,arguments)}return _createClass(App,[{key:"__repr__",value:function __repr__(){return"<App id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}},{key:"insert",value:function insert(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this.__call__(t);return this.globals.handler.save(this),e}},{key:"__call__",value:function __call__(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=new s(this);if(e._ismap(t)){var o,n=_createForOfIteratorHelper(t.entries());try{for(n.s();!(o=n.n()).done;){var a=_slicedToArray(o.value,2),l=a[0],i=a[1];if(!r.fields.has(l))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(l));r.fields.get(l).value=i}}catch(t){n.e(t)}finally{n.f()}}else{if(!e._isobject(t))throw new e.TypeError("values must be an object or a Map");for(var u in t){if(!r.fields.has(u))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(u));r.fields.get(u).value=t[u]}}return r}},{key:"__getattr__",value:function __getattr__(t){if(t.startsWith("c_")){if(!this.controls.has(t.substr(2)))throw new e.AttributeError(this,t);return this.controls.get(t.substr(2))}return _get(_getPrototypeOf(App.prototype),"__getattr__",this).call(this,t)}}]),App}();l.prototype._ul4onattrs=["id","globals","name","description","language","startlink","iconlarge","iconsmall","createdby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","basetable","primarykey","insertprocedure","updateprocedure","deleteprocedure","templates","createdat","updatedat","updatedby"],l.prototype._ul4attrs=e._makeset("id","globals","name","description","language","startlink","iconlarge","iconsmall","createdat","createdby","updatedat","updatedby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","insert"),e.expose(l.prototype.__call__,["**values"],{needsobject:!0}),e.expose(l.prototype.insert,["**values"],{needsobject:!0});var i=function(t){_inherits(View,r);var o=_createSuper(View);function View(){return _classCallCheck(this,View),o.apply(this,arguments)}return _createClass(View,[{key:"__repr__",value:function __repr__(){return"<View id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}}]),View}();i.prototype._ul4onattrs=["id","name","app","order","width","height","start","end"],i.prototype._ul4attrs=e._makeset("id","name","app","order","width","height","start","end");var u=function(t){_inherits(DataSourceData,r);var o=_createSuper(DataSourceData);function DataSourceData(){return _classCallCheck(this,DataSourceData),o.apply(this,arguments)}return _createClass(DataSourceData,[{key:"__repr__",value:function __repr__(){return"<DataSource.Data id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),DataSourceData}();u.prototype._ul4onattrs=["id","identifier","app","apps"],u.prototype._ul4attrs=e._makeset("id","identifier","app","apps");var s=function(t){_inherits(Record,r);var o=_createSuper(Record);function Record(t){var e;return _classCallCheck(this,Record),(e=o.call(this)).id=null,e.app=t,e.createdat=null,e.createdby=null,e.updatedat=null,e.updatedby=null,e.updatecount=0,e._sparsevalues=new Map,e._values=null,e._fields=null,e.children=new Map,e.attachments=null,e.errors=[],e._is_deleted=!1,e}return _createClass(Record,[{key:"__repr__",value:function __repr__(){var t,r=["<Record id=",e._repr(this.id)],o=_createForOfIteratorHelper(this.fields.values());try{for(o.s();!(t=o.n()).done;){var n=t.value;n.control.priority&&(r.push(" v_"),r.push(n.control.identifier),r.push("="),r.push(e._repr(n.value)))}}catch(t){o.e(t)}finally{o.f()}return r.push(">"),r.join("")}},{key:"is_dirty",value:function is_dirty(){if(null===this.id)return!0;var t,e=_createForOfIteratorHelper(this.fields.values());try{for(e.s();!(t=e.n()).done;){if(t.value.is_dirty())return!0}}catch(t){e.e(t)}finally{e.f()}return!1}},{key:"has_errors",value:function has_errors(){if(0!==this.errors.length)return!0;var t,e=_createForOfIteratorHelper(this.fields.values());try{for(e.s();!(t=e.n()).done;){if(t.value.has_errors())return!0}}catch(t){e.e(t)}finally{e.f()}return!1}},{key:"delete",value:function _delete(){return this.app.globals.handler.delete(this)}},{key:"save",value:function save(){this.app.globals.handler.save(this)}},{key:"update",value:function update(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(e._ismap(t)){var r,o=_createForOfIteratorHelper(t.entries());try{for(o.s();!(r=o.n()).done;){var n=_slicedToArray(r.value,2),a=n[0],l=n[1];if(!this.fields.has(a))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(a));fields.get(a).value=l}}catch(t){o.e(t)}finally{o.f()}}else{if(!e._isobject(t))throw new e.TypeError("values must be an object or a Map");for(var i in t){if(!this.fields.has(i))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(i));record.fields.get(i).value=t[i]}}this.app.globals.handler.save(this)}},{key:"search",value:function search(t){for(var r in t){var o=t[r];if(e._bool(o)&&!this.fields.get(r).search(o))return!1}return!0}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return"values"===t?this._sparsevalues:this[t]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,e){"values"===t?(this._sparsevalues=e,this._values=null,this._fields=null):this[t]=e}},{key:"__getattr__",value:function __getattr__(t){return t.startsWith("c_")?this.children.get(t.substr(2)):t.startsWith("f_")?this.fields.get(t.substr(2)):t.startsWith("v_")?this.values.get(t.substr(2)):this[t]}},{key:"__setattr__",value:function __setattr__(t,r){if(t.startsWith("c_"))this.children[t.substr(2)]=r;else{if(!t.startsWith("v_"))throw new e.AttributeError(this,t);this.fields.get(t.substr(2)).value=r}}},{key:"values",get:function get(){if(null===this._values){this._values=e._havemap?new Map:{};var t,r=_createForOfIteratorHelper(this.app.controls.entries());try{for(r.s();!(t=r.n()).done;){var o=_slicedToArray(t.value,2),n=o[0],a=(o[1],this._sparsevalues.get(n));void 0===a&&(a=null),this._values.set(n,a)}}catch(t){r.e(t)}finally{r.f()}}return this._values}},{key:"fields",get:function get(){if(null===this._fields){this._fields=e._havemap?new Map:{};var t,r=_createForOfIteratorHelper(this.values.entries());try{for(r.s();!(t=r.n()).done;){var o=_slicedToArray(t.value,2),n=o[0],a=o[1],l=new K(this.app.controls.get(n),this,a);this._fields.set(n,l)}}catch(t){r.e(t)}finally{r.f()}}return this._fields}}]),Record}();s.prototype._ul4onattrs=["id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"],s.prototype._ul4attrs=e._makeset("id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"),e.expose(s.prototype.is_dirty,[]),e.expose(s.prototype.has_errors,[]),e.expose(s.prototype.delete,[]),e.expose(s.prototype.save,[]),e.expose(s.prototype.update,["**values"],{needsobject:!0});var p=function(t){_inherits(Control,r);var o=_createSuper(Control);function Control(){return _classCallCheck(this,Control),o.apply(this,arguments)}return _createClass(Control,[{key:"__repr__",value:function __repr__(){return"<"+this.__type__+" id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}},{key:"_logsearch",value:function _logsearch(t,e){}},{key:"search",value:function search(t,e){return!1}}]),Control}();p.prototype.type=null,p.prototype.subtype=null,p.prototype._ul4onattrs=["id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure"],p.prototype._ul4attrs=e._makeset("id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure");var c=function(t){_inherits(BoolControl,p);var e=_createSuper(BoolControl);function BoolControl(){return _classCallCheck(this,BoolControl),e.apply(this,arguments)}return _createClass(BoolControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator&&e.value===t}}]),BoolControl}();c.prototype.type="bool";var _=function(t){_inherits(IntControl,p);var e=_createSuper(IntControl);function IntControl(){return _classCallCheck(this,IntControl),e.apply(this,arguments)}return _createClass(IntControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator&&e.value===t}}]),IntControl}();_.prototype.type="int";var h=function(t){_inherits(NumberControl,p);var e=_createSuper(NumberControl);function NumberControl(){return _classCallCheck(this,NumberControl),e.apply(this,arguments)}return _createClass(NumberControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator?e.value===t:"range"===e.operator&&(null!==t&&((null===e.minvalue||e.minvalue<=t)&&(null===e.maxvalue||t<e.maxvalue)))}}]),NumberControl}();h.prototype.type="number";var y=function(t){_inherits(StringControl,p);var e=_createSuper(StringControl);function StringControl(){return _classCallCheck(this,StringControl),e.apply(this,arguments)}return _createClass(StringControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator?e.value===t:"contains"===e.operator?null===e.value||null===t?e.value===t:t.toLowerCase().indexOf(e.value.toLowerCase())>=0:void 0}}]),StringControl}();y.prototype.type="string";var f=function(t){_inherits(TextControl,y);var e=_createSuper(TextControl);function TextControl(){return _classCallCheck(this,TextControl),e.apply(this,arguments)}return TextControl}();f.prototype.subtype="text";var C=function(t){_inherits(EmailControl,y);var e=_createSuper(EmailControl);function EmailControl(){return _classCallCheck(this,EmailControl),e.apply(this,arguments)}return EmailControl}();C.prototype.subtype="email";var d=function(t){_inherits(URLControl,y);var e=_createSuper(URLControl);function URLControl(){return _classCallCheck(this,URLControl),e.apply(this,arguments)}return URLControl}();d.prototype.subtype="url";var v=function(t){_inherits(TelControl,y);var e=_createSuper(TelControl);function TelControl(){return _classCallCheck(this,TelControl),e.apply(this,arguments)}return TelControl}();v.prototype.subtype="tel";var m=function(t){_inherits(PasswordControl,y);var e=_createSuper(PasswordControl);function PasswordControl(){return _classCallCheck(this,PasswordControl),e.apply(this,arguments)}return PasswordControl}();m.prototype.subtype="password";var k=function(t){_inherits(TextAreaControl,y);var e=_createSuper(TextAreaControl);function TextAreaControl(){return _classCallCheck(this,TextAreaControl),e.apply(this,arguments)}return TextAreaControl}();k.prototype.subtype="textarea",k.prototype._ul4onattrs=y.prototype._ul4onattrs.concat(["encrypted"]),k.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(y.prototype._ul4attrs).concat(["encrypted"]));var g=function(t){_inherits(HTMLControl,y);var e=_createSuper(HTMLControl);function HTMLControl(){return _classCallCheck(this,HTMLControl),e.apply(this,arguments)}return HTMLControl}();g.prototype.subtype="html";var b=function(t){_inherits(DateControl,p);var r=_createSuper(DateControl);function DateControl(){return _classCallCheck(this,DateControl),r.apply(this,arguments)}return _createClass(DateControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y":"%m/%d/%Y"}},{key:"search",value:function search(t,r){this._logsearch(t,r);var o=r.value;return"[object Date]"==Object.prototype.toString.call(o)&&(o=e._format(o,this.formatstring(),this.app.language)),null!==t&&(t=e._format(t,this.formatstring(),this.app.language)),"equals"===r.operator?o===t:"contains"===r.operator&&(null===o||null===t?o===t:t.toLowerCase().indexOf(o.toLowerCase())>=0)}}]),DateControl}();b.prototype.type="date",b.prototype.subtype="date";var A=function(t){_inherits(DatetimeMinuteControl,b);var e=_createSuper(DatetimeMinuteControl);function DatetimeMinuteControl(){return _classCallCheck(this,DatetimeMinuteControl),e.apply(this,arguments)}return _createClass(DatetimeMinuteControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y %H:%M":"%m/%d/%Y %H:%M"}}]),DatetimeMinuteControl}();A.prototype.subtype="datetimeminute";var L=function(t){_inherits(DatetimeSecondControl,b);var e=_createSuper(DatetimeSecondControl);function DatetimeSecondControl(){return _classCallCheck(this,DatetimeSecondControl),e.apply(this,arguments)}return _createClass(DatetimeSecondControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y %H:%M:%S":"%m/%d/%Y %H:%M:%S"}}]),DatetimeSecondControl}();L.prototype.subtype="datetimesecond";var S=function(t){_inherits(LookupControl,p);var e=_createSuper(LookupControl);function LookupControl(){return _classCallCheck(this,LookupControl),e.apply(this,arguments)}return _createClass(LookupControl,[{key:"search",value:function search(t,e){return"equals"===e.operator&&(null===t?null===e.value:t.key===e.value)}}]),LookupControl}();S.prototype.type="lookup",S.prototype._ul4onattrs=p.prototype._ul4onattrs.concat(["lookupdata"]),S.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(p.prototype._ul4attrs).concat(["lookupdata"]));var M=function(t){_inherits(LookupSelectControl,S);var e=_createSuper(LookupSelectControl);function LookupSelectControl(){return _classCallCheck(this,LookupSelectControl),e.apply(this,arguments)}return LookupSelectControl}();M.prototype.subtype="select";var w=function(t){_inherits(LookupRadioControl,S);var e=_createSuper(LookupRadioControl);function LookupRadioControl(){return _classCallCheck(this,LookupRadioControl),e.apply(this,arguments)}return LookupRadioControl}();w.prototype.subtype="radio";var O=function(t){_inherits(LookupChoiceControl,S);var e=_createSuper(LookupChoiceControl);function LookupChoiceControl(){return _classCallCheck(this,LookupChoiceControl),e.apply(this,arguments)}return LookupChoiceControl}();O.prototype.subtype="choice";var x=function(t){_inherits(AppLookupControl,p);var e=_createSuper(AppLookupControl);function AppLookupControl(){return _classCallCheck(this,AppLookupControl),e.apply(this,arguments)}return _createClass(AppLookupControl,[{key:"search",value:function search(t,e){return null===t||null===e.value?t===e.value:t.search(e)}}]),AppLookupControl}();x.prototype.type="applookup",x.prototype._ul4onattrs=p.prototype._ul4onattrs.concat(["lookupapp","lookupcontrols"]),x.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(p.prototype._ul4attrs).concat(["lookupapp","lookupcontrols"]));var I=function(t){_inherits(AppLookupSelectControl,x);var e=_createSuper(AppLookupSelectControl);function AppLookupSelectControl(){return _classCallCheck(this,AppLookupSelectControl),e.apply(this,arguments)}return AppLookupSelectControl}();I.prototype.subtype="select";var F=function(t){_inherits(AppLookupRadioControl,x);var e=_createSuper(AppLookupRadioControl);function AppLookupRadioControl(){return _classCallCheck(this,AppLookupRadioControl),e.apply(this,arguments)}return AppLookupRadioControl}();F.prototype.subtype="radio";var T=function(t){_inherits(AppLookupChoiceControl,x);var e=_createSuper(AppLookupChoiceControl);function AppLookupChoiceControl(){return _classCallCheck(this,AppLookupChoiceControl),e.apply(this,arguments)}return AppLookupChoiceControl}();T.prototype.subtype="choice";var R=function(t){_inherits(MultipleLookupControl,S);var e=_createSuper(MultipleLookupControl);function MultipleLookupControl(){return _classCallCheck(this,MultipleLookupControl),e.apply(this,arguments)}return _createClass(MultipleLookupControl,[{key:"search",value:function search(t,e){if("equals"===e.operator){var r,o=_createForOfIteratorHelper(t);try{for(o.s();!(r=o.n()).done;){if(r.value.key===e.value)return!0}}catch(t){o.e(t)}finally{o.f()}return!1}return!1}}]),MultipleLookupControl}();R.prototype.subtype="multiplelookup";var D=function(t){_inherits(MultipleLookupSelectControl,R);var e=_createSuper(MultipleLookupSelectControl);function MultipleLookupSelectControl(){return _classCallCheck(this,MultipleLookupSelectControl),e.apply(this,arguments)}return MultipleLookupSelectControl}();D.prototype.subtype="select";var N=function(t){_inherits(MultipleLookupCheckboxControl,R);var e=_createSuper(MultipleLookupCheckboxControl);function MultipleLookupCheckboxControl(){return _classCallCheck(this,MultipleLookupCheckboxControl),e.apply(this,arguments)}return MultipleLookupCheckboxControl}();N.prototype.subtype="checkbox";var P=function(t){_inherits(MultipleLookupChoiceControl,R);var e=_createSuper(MultipleLookupChoiceControl);function MultipleLookupChoiceControl(){return _classCallCheck(this,MultipleLookupChoiceControl),e.apply(this,arguments)}return MultipleLookupChoiceControl}();P.prototype.subtype="choice";var U=function(t){_inherits(MultipleAppLookupControl,x);var e=_createSuper(MultipleAppLookupControl);function MultipleAppLookupControl(){return _classCallCheck(this,MultipleAppLookupControl),e.apply(this,arguments)}return _createClass(MultipleAppLookupControl,[{key:"search",value:function search(t,e){if("equals"===e.operator){if(null===e.value)return 0===t.length;var r,o=_createForOfIteratorHelper(t);try{for(o.s();!(r=o.n()).done;){if(r.value.search(e.value))return!0}}catch(t){o.e(t)}finally{o.f()}return!1}return!1}}]),MultipleAppLookupControl}();U.prototype.type="multipleapplookup";var j=function(t){_inherits(MultipleAppLookupSelectControl,U);var e=_createSuper(MultipleAppLookupSelectControl);function MultipleAppLookupSelectControl(){return _classCallCheck(this,MultipleAppLookupSelectControl),e.apply(this,arguments)}return MultipleAppLookupSelectControl}();j.prototype.subtype="select";var H=function(t){_inherits(MultipleAppLookupCheckboxControl,U);var e=_createSuper(MultipleAppLookupCheckboxControl);function MultipleAppLookupCheckboxControl(){return _classCallCheck(this,MultipleAppLookupCheckboxControl),e.apply(this,arguments)}return MultipleAppLookupCheckboxControl}();H.prototype.subtype="checkbox";var G=function(t){_inherits(MultipleAppLookupChoiceControl,U);var e=_createSuper(MultipleAppLookupChoiceControl);function MultipleAppLookupChoiceControl(){return _classCallCheck(this,MultipleAppLookupChoiceControl),e.apply(this,arguments)}return MultipleAppLookupChoiceControl}();G.prototype.subtype="choice";var B=function(t){_inherits(GeoControl,p);var e=_createSuper(GeoControl);function GeoControl(){return _classCallCheck(this,GeoControl),e.apply(this,arguments)}return GeoControl}();B.prototype.type="geo";var E=function(t){_inherits(FileControl,p);var e=_createSuper(FileControl);function FileControl(){return _classCallCheck(this,FileControl),e.apply(this,arguments)}return FileControl}();E.prototype.type="file";var V=function(t){_inherits(FileSignatureControl,E);var e=_createSuper(FileSignatureControl);function FileSignatureControl(){return _classCallCheck(this,FileSignatureControl),e.apply(this,arguments)}return FileSignatureControl}();V.prototype.subtype="signature";var q=function(t){_inherits(ButtonControl,p);var e=_createSuper(ButtonControl);function ButtonControl(){return _classCallCheck(this,ButtonControl),e.apply(this,arguments)}return ButtonControl}();q.prototype.type="button";var K=function(t){_inherits(Field,r);var o=_createSuper(Field);function Field(t,e,r){var n;return _classCallCheck(this,Field),(n=o.call(this)).control=t,n.record=e,n._value=r,n._dirty=!1,n.errors=[],n}return _createClass(Field,[{key:"is_empty",value:function is_empty(){return null===this._value||e._islist(this._value)&&0===this._value.length}},{key:"is_dirty",value:function is_dirty(){return this._dirty}},{key:"has_errors",value:function has_errors(){return 0!==this.errors.length}},{key:"search",value:function search(t){return this.control.search(this.value,t)}},{key:"__repr__",value:function __repr__(){var t="<Field identifier=";return t+=e._repr(this.control.identifier),this._dirty&&(t+=" is_dirty()=True"),0!==this.errors.length&&(t+=" has_errors()=True"),t+=">"}},{key:"value",get:function get(){return this._value},set:function set(t){var r=this._value;e._ne(r,t)&&(this.record.values.set(this.control.identifier,t),this._value=t,this._dirty=!0)}}]),Field}(),W=function(t){_inherits(LookupItem,r);var o=_createSuper(LookupItem);function LookupItem(){return _classCallCheck(this,LookupItem),o.apply(this,arguments)}return _createClass(LookupItem,[{key:"__repr__",value:function __repr__(){return"<LookupItem key="+e._repr(this.key)+" label="+e._repr(this.label)+">"}}]),LookupItem}();W.prototype._ul4onattrs=["key","label"],W.prototype._ul4attrs=e._makeset("key","label");var J=function(t){_inherits(User,r);var o=_createSuper(User);function User(){return _classCallCheck(this,User),o.apply(this,arguments)}return _createClass(User,[{key:"__repr__",value:function __repr__(){return"<User id="+e._repr(this.id)+" firstname="+e._repr(this.firstname)+" surname="+e._repr(this.surname)+" email="+e._repr(this.email)+">"}}]),User}();J.prototype._ul4onattrs=["_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews"],J.prototype._ul4attrs=e._makeset("_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews");var Y=function(t){_inherits(File,r);var o=_createSuper(File);function File(){return _classCallCheck(this,File),o.apply(this,arguments)}return _createClass(File,[{key:"__repr__",value:function __repr__(){return"<File id="+e._repr(this.id)+" url="+e._repr(this.url)+" filename="+e._repr(this.filename)+">"}}]),File}();Y.prototype._ul4onattrs=["id","url","filename","mimetype","width","height","internalid","createdat","size"],Y.prototype._ul4attrs=e._makeset("id","url","filename","mimetype","width","height","size","createdat");var z=function(t){_inherits(Geo,r);var o=_createSuper(Geo);function Geo(t,e,r){var n;return _classCallCheck(this,Geo),(n=o.call(this)).lat=t,n.long=e,n.info=r,n}return _createClass(Geo,[{key:"__repr__",value:function __repr__(){return"<Geo lat="+e._repr(this.lat)+" long="+e._repr(this.long)+" info="+e._repr(this.info)+">"}}]),Geo}();z.prototype._ul4onattrs=["lat","long","info"],z.prototype._ul4attrs=e._makeset("lat","long","info");var $=function(t){_inherits(Attachment,r);var o=_createSuper(Attachment);function Attachment(){return _classCallCheck(this,Attachment),o.apply(this,arguments)}return _createClass(Attachment,[{key:"__repr__",value:function __repr__(){return"<"+this.__type__+" id="+e._repr(this.id)+" label="+e._repr(this.label)+">"}}]),Attachment}();$.prototype._ul4onattrs=["id","record","label","active"],$.prototype._ul4attrs=e._makeset("id","record","label","active");var Q=function(t){_inherits(NoteAttachment,$);var e=_createSuper(NoteAttachment);function NoteAttachment(){return _classCallCheck(this,NoteAttachment),e.apply(this,arguments)}return NoteAttachment}();Q.prototype.type="noteattachment",Q.prototype._ul4onattrs=$.prototype._ul4onattrs.concat(["value"]),Q.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray($.prototype._ul4onattrs).concat(["value"]));var X=function(t){_inherits(URLAttachment,$);var e=_createSuper(URLAttachment);function URLAttachment(){return _classCallCheck(this,URLAttachment),e.apply(this,arguments)}return URLAttachment}();X.prototype.type="urlattachment",X.prototype._ul4onattrs=$.prototype._ul4onattrs.concat(["value"]),X.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray($.prototype._ul4onattrs).concat(["value"]));var Z=function(t){_inherits(FileAttachment,$);var e=_createSuper(FileAttachment);function FileAttachment(){return _classCallCheck(this,FileAttachment),e.apply(this,arguments)}return FileAttachment}();Z.prototype.type="fileattachment",Z.prototype._ul4onattrs=$.prototype._ul4onattrs.concat(["value"]),Z.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray($.prototype._ul4onattrs).concat(["value"]));var tt=function(t){_inherits(ImageAttachment,$);var e=_createSuper(ImageAttachment);function ImageAttachment(){return _classCallCheck(this,ImageAttachment),e.apply(this,arguments)}return ImageAttachment}();tt.prototype.type="imageattachment",tt.prototype._ul4onattrs=$.prototype._ul4onattrs.concat(["original","thumb","small","medium","large"]),tt.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray($.prototype._ul4onattrs).concat(["original","thumb","small","medium","large"]));var et=function(t){_inherits(JSONAttachment,$);var r=_createSuper(JSONAttachment);function JSONAttachment(){return _classCallCheck(this,JSONAttachment),r.apply(this,arguments)}return _createClass(JSONAttachment,[{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return"value"===t?e._asjson(this.value):this[t]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,r){"value"===t?this.value=e._fromjson(r):this[t]=r}}]),JSONAttachment}();et.prototype.type="jsonattachment",et.prototype._ul4onattrs=$.prototype._ul4onattrs.concat(["value"]),et.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray($.prototype._ul4onattrs).concat(["value"]));var rt=function(t){_inherits(Installation,r);var o=_createSuper(Installation);function Installation(){return _classCallCheck(this,Installation),o.apply(this,arguments)}return _createClass(Installation,[{key:"__repr__",value:function __repr__(){return"<Installation id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}}]),Installation}();rt.prototype._ul4onattrs=["id","name"],rt.prototype._ul4attrs=e._makeset("id","name");var ot=function(t){_inherits(Category,r);var o=_createSuper(Category);function Category(){return _classCallCheck(this,Category),o.apply(this,arguments)}return _createClass(Category,[{key:"__repr__",value:function __repr__(){for(var t=[],r=this;null!==r;)t.splice(0,0,r.identifier),r=r.parent;return"<Category id="+e._repr(this.id)+" identifierpath="+e._repr(t.join("/"))+NaN+e._repr(this.name)+">"}}]),Category}();ot.prototype._ul4onattrs=["id","identifier","name","order","parent","children","apps"],ot.prototype._ul4attrs=e._makeset("id","identifier","name","order","parent","children","apps");var nt=function(t){_inherits(KeyView,r);var o=_createSuper(KeyView);function KeyView(){return _classCallCheck(this,KeyView),o.apply(this,arguments)}return _createClass(KeyView,[{key:"__repr__",value:function __repr__(){return"<KeyView id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),KeyView}();nt.prototype._ul4onattrs=["id","identifier","name","key","user"],nt.prototype._ul4attrs=e._makeset("id","identifier","name","key","user");var at=function(t){_inherits(AppParameter,r);var o=_createSuper(AppParameter);function AppParameter(){return _classCallCheck(this,AppParameter),o.apply(this,arguments)}return _createClass(AppParameter,[{key:"__repr__",value:function __repr__(){return"<AppParameter id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),AppParameter}();at.prototype._ul4onattrs=["id","app","identifier","description","value"],at.prototype._ul4attrs=e._makeset("id","app","identifier","description","value");for(var lt=0,it=[n,a,l,i,u,s,c,_,h,f,C,d,v,m,k,b,A,L,S,M,w,O,x,I,F,T,R,D,N,P,U,j,H,G,B,E,q,K,W,J,Y,z,Q,X,Z,tt,et,rt,ot,nt,at];lt<it.length;lt++){var ut=it[lt];e.register("de.livinglogic.livingapi."+ut.name.toLowerCase(),ut)}t.App=l,t.AppLookupChoiceControl=T,t.AppLookupControl=x,t.AppLookupRadioControl=F,t.AppLookupSelectControl=I,t.AppParameter=at,t.Attachment=$,t.Base=r,t.BoolControl=c,t.ButtonControl=q,t.Category=ot,t.Control=p,t.DataSourceData=u,t.DateControl=b,t.DatetimeMinuteControl=A,t.DatetimeSecondControl=L,t.EmailControl=C,t.Field=K,t.File=Y,t.FileAttachment=Z,t.FileControl=E,t.FileSignatureControl=V,t.FlashMessage=a,t.Geo=z,t.GeoControl=B,t.Globals=n,t.HTMLControl=g,t.Handler=o,t.ImageAttachment=tt,t.Installation=rt,t.IntControl=_,t.JSONAttachment=et,t.KeyView=nt,t.LookupChoiceControl=O,t.LookupControl=S,t.LookupItem=W,t.LookupRadioControl=w,t.LookupSelectControl=M,t.MultipleAppLookupCheckboxControl=H,t.MultipleAppLookupChoiceControl=G,t.MultipleAppLookupControl=U,t.MultipleAppLookupSelectControl=j,t.MultipleLookupCheckboxControl=N,t.MultipleLookupChoiceControl=P,t.MultipleLookupControl=R,t.MultipleLookupSelectControl=D,t.NoteAttachment=Q,t.NumberControl=h,t.PasswordControl=m,t.Record=s,t.StringControl=y,t.TelControl=v,t.TextAreaControl=k,t.TextControl=f,t.URLAttachment=X,t.URLControl=d,t.User=J,t.View=i,t.version="0.11.1",Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=livingapi.js.map
