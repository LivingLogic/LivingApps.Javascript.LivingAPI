!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("@livinglogic/ul4")):"function"==typeof define&&define.amd?define(["exports","@livinglogic/ul4"],e):e((t=t||self).la={},t.ul4)}(this,function(t,e){"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function _get(t,e,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(t,e,r){var o=function _superPropBase(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=_getPrototypeOf(t)););return t}(t,e);if(o){var n=Object.getOwnPropertyDescriptor(o,e);return n.get?n.get.call(r):n.value}})(t,e,r||t)}function _slicedToArray(t,e){return function _arrayWithHoles(t){if(Array.isArray(t))return t}(t)||function _iterableToArrayLimit(t,e){var r=[],o=!0,n=!1,l=void 0;try{for(var a,i=t[Symbol.iterator]();!(o=(a=i.next()).done)&&(r.push(a.value),!e||r.length!==e);o=!0);}catch(t){n=!0,l=t}finally{try{o||null==i.return||i.return()}finally{if(n)throw l}}return r}(t,e)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function _toConsumableArray(t){return function _arrayWithoutHoles(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}(t)||function _iterableToArray(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var r=function(t){function Base(){return _classCallCheck(this,Base),_possibleConstructorReturn(this,_getPrototypeOf(Base).call(this))}return _inherits(Base,e.Proto),_createClass(Base,[{key:"ul4ondump",value:function ul4ondump(t){for(var e=0;e<this._ul4onattrs.length;++e)t.dump(this._dumpUL4ONAttr(this._ul4onattrs[e]))}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return this[t]}},{key:"ul4onload",value:function ul4onload(t){for(var e=0,r=t.loadcontent();;++e){var o=r.next();if(o.done)break;e<this._ul4onattrs.length&&this._loadUL4ONAttr(this._ul4onattrs[e],o.value)}for(;e<this._ul4onattrs.length;++e)this._setDefaultUL4ONAttr(this._ul4onattrs[e])}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,e){this[t]=e}},{key:"_setDefaultUL4ONAttr",value:function _setDefaultUL4ONAttr(t){this[t]=null}},{key:"__getattr__",value:function __getattr__(t){if(this._ul4attrs.has(t)){var r=this[t];if("function"==typeof r){var o=r.bind(this);return o._ul4_name=r._ul4_name||r.name,o._ul4_signature=r._ul4_signature,o._ul4_needsobject=r._ul4_needsobject,o._ul4_needscontext=r._ul4_needscontext,o}return r}throw new e.AttributeError(this,t)}},{key:"__repr__",value:function __repr__(){return"<"+this.constructor.name+">"}}]),Base}(),o=function(){function Handler(){_classCallCheck(this,Handler)}return _createClass(Handler,[{key:"save",value:function save(t){}},{key:"delete",value:function _delete(t){}}]),Handler}(),n=function(t){function Globals(){var t;return _classCallCheck(this,Globals),(t=_possibleConstructorReturn(this,_getPrototypeOf(Globals).call(this))).version=null,t.platform=null,t.user=null,t.maxdbactions=null,t.maxtemplateruntime=null,t.flashmessages=null,t.handler=new o,t}return _inherits(Globals,r),_createClass(Globals,[{key:"__repr__",value:function __repr__(){return"<Globals version="+e._repr(this.version)+">"}}],[{key:"geodist",value:function geodist(t,e){var r=function sqsin(t){return(t=Math.sin(t))*t},o=function sqsos(t){return(t=Math.cos(t))*t},n=Math.PI/180,l=1/298.257223563,a=t.lat*n,i=t.long*n,s=e.lat*n,u=(a+s)/2,p=(a-s)/2,c=(i-e.long*n)/2,_=r(p)*o(c)+o(u)*r(c),h=o(p)*o(c)+r(u)*r(c),y=Math.atan(Math.sqrt(_/h)),f=2*y*6378.137,C=Math.sqrt(_*h)/y,d=(3*C+1)/(2*_);return f*(1+l*((3*C-1)/(2*h))*r(u)*o(p)-l*d*o(u)*r(p))}}]),Globals}();n.prototype._ul4onattrs=["version","platform","user","maxdbactions","maxtemplateruntime","flashmessages"],n.prototype._ul4attrs=e._makeset("version","platform","user","maxdbactions","maxtemplateruntime","flashmessages");var l=function(t){function FlashMessage(){return _classCallCheck(this,FlashMessage),_possibleConstructorReturn(this,_getPrototypeOf(FlashMessage).apply(this,arguments))}return _inherits(FlashMessage,r),_createClass(FlashMessage,[{key:"__repr__",value:function __repr__(){return"<FlashMessage type="+e._repr(this.type)+" title="+e._repr(this.title)+">"}}]),FlashMessage}();l.prototype._ul4onattrs=["timestamp","type","title","message"],l.prototype._ul4attrs=e._makeset("timestamp","type","title","message");var a=function(t){function App(){return _classCallCheck(this,App),_possibleConstructorReturn(this,_getPrototypeOf(App).apply(this,arguments))}return _inherits(App,r),_createClass(App,[{key:"__repr__",value:function __repr__(){return"<App id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}},{key:"insert",value:function insert(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this.__call__(t);return this.globals.handler.save(this),e}},{key:"__call__",value:function __call__(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=new u(this);if(e._ismap(t)){var o=!0,n=!1,l=void 0;try{for(var a,i=t.entries()[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=_slicedToArray(a.value,2),p=s[0],c=s[1];if(!r.fields.has(p))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(p));r.fields.get(p).value=c}}catch(t){n=!0,l=t}finally{try{o||null==i.return||i.return()}finally{if(n)throw l}}}else{if(!e._isobject(t))throw new e.TypeError("values must be an object or a Map");for(var p in t){if(!r.fields.has(p))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(p));r.fields.get(p).value=t[p]}}return r}},{key:"__getattr__",value:function __getattr__(t){if(t.startsWith("c_")){if(!this.controls.has(t.substr(2)))throw new e.AttributeError(this,t);return this.controls.get(t.substr(2))}return _get(_getPrototypeOf(App.prototype),"__getattr__",this).call(this,t)}}]),App}();a.prototype._ul4onattrs=["id","globals","name","description","language","startlink","iconlarge","iconsmall","createdby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","basetable","primarykey","insertprocedure","updateprocedure","deleteprocedure","templates","createdat","updatedat","updatedby"],a.prototype._ul4attrs=e._makeset("id","globals","name","description","language","startlink","iconlarge","iconsmall","createdat","createdby","updatedat","updatedby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","insert"),e.expose(a.prototype.__call__,["**values"],{needsobject:!0}),e.expose(a.prototype.insert,["**values"],{needsobject:!0});var i=function(t){function View(){return _classCallCheck(this,View),_possibleConstructorReturn(this,_getPrototypeOf(View).apply(this,arguments))}return _inherits(View,r),_createClass(View,[{key:"__repr__",value:function __repr__(){return"<View id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}}]),View}();i.prototype._ul4onattrs=["id","name","app","order","width","height","start","end"],i.prototype._ul4attrs=e._makeset("id","name","app","order","width","height","start","end");var s=function(t){function DataSourceData(){return _classCallCheck(this,DataSourceData),_possibleConstructorReturn(this,_getPrototypeOf(DataSourceData).apply(this,arguments))}return _inherits(DataSourceData,r),_createClass(DataSourceData,[{key:"__repr__",value:function __repr__(){return"<DataSource.Data id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),DataSourceData}();s.prototype._ul4onattrs=["id","identifier","app","apps"],s.prototype._ul4attrs=e._makeset("id","identifier","app","apps");var u=function(t){function Record(t){var e;return _classCallCheck(this,Record),(e=_possibleConstructorReturn(this,_getPrototypeOf(Record).call(this))).id=null,e.app=t,e.createdat=null,e.createdby=null,e.updatedat=null,e.updatedby=null,e.updatecount=0,e._sparsevalues=new Map,e._values=null,e._fields=null,e.children=new Map,e.attachments=null,e.errors=[],e._is_deleted=!1,e}return _inherits(Record,r),_createClass(Record,[{key:"__repr__",value:function __repr__(){var t=["<Record id=",e._repr(this.id)],r=!0,o=!1,n=void 0;try{for(var l,a=this.fields.values()[Symbol.iterator]();!(r=(l=a.next()).done);r=!0){var i=l.value;i.control.priority&&(t.push(" v_"),t.push(i.control.identifier),t.push("="),t.push(e._repr(i.value)))}}catch(t){o=!0,n=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw n}}return t.push(">"),t.join("")}},{key:"is_dirty",value:function is_dirty(){if(null===this.id)return!0;var t=!0,e=!1,r=void 0;try{for(var o,n=this.fields.values()[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){if(o.value.is_dirty())return!0}}catch(t){e=!0,r=t}finally{try{t||null==n.return||n.return()}finally{if(e)throw r}}return!1}},{key:"has_errors",value:function has_errors(){if(0!==this.errors.length)return!0;var t=!0,e=!1,r=void 0;try{for(var o,n=this.fields.values()[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){if(o.value.has_errors())return!0}}catch(t){e=!0,r=t}finally{try{t||null==n.return||n.return()}finally{if(e)throw r}}return!1}},{key:"delete",value:function _delete(){return this.app.globals.handler.delete(this)}},{key:"save",value:function save(){this.app.globals.handler.save(this)}},{key:"update",value:function update(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(e._ismap(t)){var r=!0,o=!1,n=void 0;try{for(var l,a=t.entries()[Symbol.iterator]();!(r=(l=a.next()).done);r=!0){var i=_slicedToArray(l.value,2),s=i[0],u=i[1];if(!this.fields.has(s))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(s));fields.get(s).value=u}}catch(t){o=!0,n=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw n}}}else{if(!e._isobject(t))throw new e.TypeError("values must be an object or a Map");for(var s in t){if(!this.fields.has(s))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(s));record.fields.get(s).value=t[s]}}this.app.globals.handler.save(this)}},{key:"search",value:function search(t){for(var r in t){var o=t[r];if(e._bool(o)&&!this.fields.get(r).search(o))return!1}return!0}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return"values"===t?this._sparsevalues:this[t]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,e){"values"===t?(this._sparsevalues=e,this._values=null,this._fields=null):this[t]=e}},{key:"__getattr__",value:function __getattr__(t){return t.startsWith("c_")?this.children.get(t.substr(2)):t.startsWith("f_")?this.fields.get(t.substr(2)):t.startsWith("v_")?this.values.get(t.substr(2)):this[t]}},{key:"__setattr__",value:function __setattr__(t,r){if(t.startsWith("c_"))this.children[t.substr(2)]=r;else{if(!t.startsWith("v_"))throw new e.AttributeError(this,t);this.fields.get(t.substr(2)).value=r}}},{key:"values",get:function get(){if(null===this._values){this._values=e._havemap?new Map:{};var t=!0,r=!1,o=void 0;try{for(var n,l=this.app.controls.entries()[Symbol.iterator]();!(t=(n=l.next()).done);t=!0){var a=_slicedToArray(n.value,2),i=a[0],s=(a[1],this._sparsevalues.get(i));void 0===s&&(s=null),this._values.set(i,s)}}catch(t){r=!0,o=t}finally{try{t||null==l.return||l.return()}finally{if(r)throw o}}}return this._values}},{key:"fields",get:function get(){if(null===this._fields){this._fields=e._havemap?new Map:{};var t=!0,r=!1,o=void 0;try{for(var n,l=this.values.entries()[Symbol.iterator]();!(t=(n=l.next()).done);t=!0){var a=_slicedToArray(n.value,2),i=a[0],s=a[1],u=new q(this.app.controls.get(i),this,s);this._fields.set(i,u)}}catch(t){r=!0,o=t}finally{try{t||null==l.return||l.return()}finally{if(r)throw o}}}return this._fields}}]),Record}();u.prototype._ul4onattrs=["id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"],u.prototype._ul4attrs=e._makeset("id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"),e.expose(u.prototype.is_dirty,[]),e.expose(u.prototype.has_errors,[]),e.expose(u.prototype.delete,[]),e.expose(u.prototype.save,[]),e.expose(u.prototype.update,["**values"],{needsobject:!0});var p=function(t){function Control(){return _classCallCheck(this,Control),_possibleConstructorReturn(this,_getPrototypeOf(Control).apply(this,arguments))}return _inherits(Control,r),_createClass(Control,[{key:"__repr__",value:function __repr__(){return"<"+this.__type__+" id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}},{key:"_logsearch",value:function _logsearch(t,e){}},{key:"search",value:function search(t,e){return!1}}]),Control}();p.prototype.type=null,p.prototype.subtype=null,p.prototype._ul4onattrs=["id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure"],p.prototype._ul4attrs=e._makeset("id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure");var c=function(t){function BoolControl(){return _classCallCheck(this,BoolControl),_possibleConstructorReturn(this,_getPrototypeOf(BoolControl).apply(this,arguments))}return _inherits(BoolControl,p),_createClass(BoolControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator&&e.value===t}}]),BoolControl}();c.prototype.type="bool";var _=function(t){function IntControl(){return _classCallCheck(this,IntControl),_possibleConstructorReturn(this,_getPrototypeOf(IntControl).apply(this,arguments))}return _inherits(IntControl,p),_createClass(IntControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator&&e.value===t}}]),IntControl}();_.prototype.type="int";var h=function(t){function NumberControl(){return _classCallCheck(this,NumberControl),_possibleConstructorReturn(this,_getPrototypeOf(NumberControl).apply(this,arguments))}return _inherits(NumberControl,p),_createClass(NumberControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator?e.value===t:"range"===e.operator&&(null!==t&&((null===e.minvalue||e.minvalue<=t)&&(null===e.maxvalue||t<e.maxvalue)))}}]),NumberControl}();h.prototype.type="number";var y=function(t){function StringControl(){return _classCallCheck(this,StringControl),_possibleConstructorReturn(this,_getPrototypeOf(StringControl).apply(this,arguments))}return _inherits(StringControl,p),_createClass(StringControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator?e.value===t:"contains"===e.operator?null===e.value||null===t?e.value===t:t.toLowerCase().indexOf(e.value.toLowerCase())>=0:void 0}}]),StringControl}();y.prototype.type="string";var f=function(t){function TextControl(){return _classCallCheck(this,TextControl),_possibleConstructorReturn(this,_getPrototypeOf(TextControl).apply(this,arguments))}return _inherits(TextControl,y),TextControl}();f.prototype.subtype="text";var C=function(t){function EmailControl(){return _classCallCheck(this,EmailControl),_possibleConstructorReturn(this,_getPrototypeOf(EmailControl).apply(this,arguments))}return _inherits(EmailControl,y),EmailControl}();C.prototype.subtype="email";var d=function(t){function URLControl(){return _classCallCheck(this,URLControl),_possibleConstructorReturn(this,_getPrototypeOf(URLControl).apply(this,arguments))}return _inherits(URLControl,y),URLControl}();d.prototype.subtype="url";var v=function(t){function TelControl(){return _classCallCheck(this,TelControl),_possibleConstructorReturn(this,_getPrototypeOf(TelControl).apply(this,arguments))}return _inherits(TelControl,y),TelControl}();v.prototype.subtype="tel";var k=function(t){function PasswordControl(){return _classCallCheck(this,PasswordControl),_possibleConstructorReturn(this,_getPrototypeOf(PasswordControl).apply(this,arguments))}return _inherits(PasswordControl,y),PasswordControl}();k.prototype.subtype="password";var m=function(t){function TextAreaControl(){return _classCallCheck(this,TextAreaControl),_possibleConstructorReturn(this,_getPrototypeOf(TextAreaControl).apply(this,arguments))}return _inherits(TextAreaControl,y),TextAreaControl}();m.prototype.subtype="textarea",m.prototype._ul4onattrs=y.prototype._ul4onattrs.concat(["encrypted"]),m.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(y.prototype._ul4attrs).concat(["encrypted"]));var g=function(t){function DateControl(){return _classCallCheck(this,DateControl),_possibleConstructorReturn(this,_getPrototypeOf(DateControl).apply(this,arguments))}return _inherits(DateControl,p),_createClass(DateControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y":"%m/%d/%Y"}},{key:"search",value:function search(t,r){this._logsearch(t,r);var o=r.value;return"[object Date]"==Object.prototype.toString.call(o)&&(o=e._format(o,this.formatstring(),this.app.language)),null!==t&&(t=e._format(t,this.formatstring(),this.app.language)),"equals"===r.operator?o===t:"contains"===r.operator&&(null===o||null===t?o===t:t.toLowerCase().indexOf(o.toLowerCase())>=0)}}]),DateControl}();g.prototype.type="date",g.prototype.subtype="date";var b=function(t){function DatetimeMinuteControl(){return _classCallCheck(this,DatetimeMinuteControl),_possibleConstructorReturn(this,_getPrototypeOf(DatetimeMinuteControl).apply(this,arguments))}return _inherits(DatetimeMinuteControl,g),_createClass(DatetimeMinuteControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y %H:%M":"%m/%d/%Y %H:%M"}}]),DatetimeMinuteControl}();b.prototype.subtype="datetimeminute";var A=function(t){function DatetimeSecondControl(){return _classCallCheck(this,DatetimeSecondControl),_possibleConstructorReturn(this,_getPrototypeOf(DatetimeSecondControl).apply(this,arguments))}return _inherits(DatetimeSecondControl,g),_createClass(DatetimeSecondControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y %H:%M:%S":"%m/%d/%Y %H:%M:%S"}}]),DatetimeSecondControl}();A.prototype.subtype="datetimesecond";var L=function(t){function LookupControl(){return _classCallCheck(this,LookupControl),_possibleConstructorReturn(this,_getPrototypeOf(LookupControl).apply(this,arguments))}return _inherits(LookupControl,p),_createClass(LookupControl,[{key:"search",value:function search(t,e){return"equals"===e.operator&&(null===t?null===e.value:t.key===e.value)}}]),LookupControl}();L.prototype.type="lookup",L.prototype._ul4onattrs=p.prototype._ul4onattrs.concat(["lookupdata"]),L.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(p.prototype._ul4attrs).concat(["lookupdata"]));var O=function(t){function LookupSelectControl(){return _classCallCheck(this,LookupSelectControl),_possibleConstructorReturn(this,_getPrototypeOf(LookupSelectControl).apply(this,arguments))}return _inherits(LookupSelectControl,L),LookupSelectControl}();O.prototype.subtype="select";var R=function(t){function LookupRadioControl(){return _classCallCheck(this,LookupRadioControl),_possibleConstructorReturn(this,_getPrototypeOf(LookupRadioControl).apply(this,arguments))}return _inherits(LookupRadioControl,L),LookupRadioControl}();R.prototype.subtype="radio";var P=function(t){function LookupChoiceControl(){return _classCallCheck(this,LookupChoiceControl),_possibleConstructorReturn(this,_getPrototypeOf(LookupChoiceControl).apply(this,arguments))}return _inherits(LookupChoiceControl,L),LookupChoiceControl}();P.prototype.subtype="choice";var w=function(t){function AppLookupControl(){return _classCallCheck(this,AppLookupControl),_possibleConstructorReturn(this,_getPrototypeOf(AppLookupControl).apply(this,arguments))}return _inherits(AppLookupControl,p),_createClass(AppLookupControl,[{key:"search",value:function search(t,e){return null===t||null===e.value?t===e.value:t.search(e)}}]),AppLookupControl}();w.prototype.type="applookup",w.prototype._ul4onattrs=p.prototype._ul4onattrs.concat(["lookupapp","lookupcontrols"]),w.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(p.prototype._ul4attrs).concat(["lookupapp","lookupcontrols"]));var M=function(t){function AppLookupSelectControl(){return _classCallCheck(this,AppLookupSelectControl),_possibleConstructorReturn(this,_getPrototypeOf(AppLookupSelectControl).apply(this,arguments))}return _inherits(AppLookupSelectControl,w),AppLookupSelectControl}();M.prototype.subtype="select";var S=function(t){function AppLookupRadioControl(){return _classCallCheck(this,AppLookupRadioControl),_possibleConstructorReturn(this,_getPrototypeOf(AppLookupRadioControl).apply(this,arguments))}return _inherits(AppLookupRadioControl,w),AppLookupRadioControl}();S.prototype.subtype="radio";var x=function(t){function AppLookupChoiceControl(){return _classCallCheck(this,AppLookupChoiceControl),_possibleConstructorReturn(this,_getPrototypeOf(AppLookupChoiceControl).apply(this,arguments))}return _inherits(AppLookupChoiceControl,w),AppLookupChoiceControl}();x.prototype.subtype="choice";var D=function(t){function MultipleLookupControl(){return _classCallCheck(this,MultipleLookupControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleLookupControl).apply(this,arguments))}return _inherits(MultipleLookupControl,L),_createClass(MultipleLookupControl,[{key:"search",value:function search(t,e){if("equals"===e.operator){var r=!0,o=!1,n=void 0;try{for(var l,a=t[Symbol.iterator]();!(r=(l=a.next()).done);r=!0){if(l.value.key===e.value)return!0}}catch(t){o=!0,n=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw n}}return!1}return!1}}]),MultipleLookupControl}();D.prototype.subtype="multiplelookup";var N=function(t){function MultipleLookupSelectControl(){return _classCallCheck(this,MultipleLookupSelectControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleLookupSelectControl).apply(this,arguments))}return _inherits(MultipleLookupSelectControl,D),MultipleLookupSelectControl}();N.prototype.subtype="select";var U=function(t){function MultipleLookupCheckboxControl(){return _classCallCheck(this,MultipleLookupCheckboxControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleLookupCheckboxControl).apply(this,arguments))}return _inherits(MultipleLookupCheckboxControl,D),MultipleLookupCheckboxControl}();U.prototype.subtype="checkbox";var F=function(t){function MultipleLookupChoiceControl(){return _classCallCheck(this,MultipleLookupChoiceControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleLookupChoiceControl).apply(this,arguments))}return _inherits(MultipleLookupChoiceControl,D),MultipleLookupChoiceControl}();F.prototype.subtype="choice";var I=function(t){function MultipleAppLookupControl(){return _classCallCheck(this,MultipleAppLookupControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleAppLookupControl).apply(this,arguments))}return _inherits(MultipleAppLookupControl,w),_createClass(MultipleAppLookupControl,[{key:"search",value:function search(t,e){if("equals"===e.operator){if(null===e.value)return 0===t.length;var r=!0,o=!1,n=void 0;try{for(var l,a=t[Symbol.iterator]();!(r=(l=a.next()).done);r=!0){if(l.value.search(e.value))return!0}}catch(t){o=!0,n=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw n}}return!1}return!1}}]),MultipleAppLookupControl}();I.prototype.type="multipleapplookup";var T=function(t){function MultipleAppLookupSelectControl(){return _classCallCheck(this,MultipleAppLookupSelectControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleAppLookupSelectControl).apply(this,arguments))}return _inherits(MultipleAppLookupSelectControl,I),MultipleAppLookupSelectControl}();T.prototype.subtype="select";var j=function(t){function MultipleAppLookupCheckboxControl(){return _classCallCheck(this,MultipleAppLookupCheckboxControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleAppLookupCheckboxControl).apply(this,arguments))}return _inherits(MultipleAppLookupCheckboxControl,I),MultipleAppLookupCheckboxControl}();j.prototype.subtype="checkbox";var G=function(t){function MultipleAppLookupChoiceControl(){return _classCallCheck(this,MultipleAppLookupChoiceControl),_possibleConstructorReturn(this,_getPrototypeOf(MultipleAppLookupChoiceControl).apply(this,arguments))}return _inherits(MultipleAppLookupChoiceControl,I),MultipleAppLookupChoiceControl}();G.prototype.subtype="choice";var B=function(t){function GeoControl(){return _classCallCheck(this,GeoControl),_possibleConstructorReturn(this,_getPrototypeOf(GeoControl).apply(this,arguments))}return _inherits(GeoControl,p),GeoControl}();B.prototype.type="geo";var E=function(t){function FileControl(){return _classCallCheck(this,FileControl),_possibleConstructorReturn(this,_getPrototypeOf(FileControl).apply(this,arguments))}return _inherits(FileControl,p),FileControl}();E.prototype.type="file";var V=function(t){function ButtonControl(){return _classCallCheck(this,ButtonControl),_possibleConstructorReturn(this,_getPrototypeOf(ButtonControl).apply(this,arguments))}return _inherits(ButtonControl,p),ButtonControl}();V.prototype.type="button";var q=function(t){function Field(t,e,r){var o;return _classCallCheck(this,Field),(o=_possibleConstructorReturn(this,_getPrototypeOf(Field).call(this))).control=t,o.record=e,o._value=r,o._dirty=!1,o.errors=[],o}return _inherits(Field,r),_createClass(Field,[{key:"is_empty",value:function is_empty(){return null===this._value||e._islist(this._value)&&0===this._value.length}},{key:"is_dirty",value:function is_dirty(){return this._dirty}},{key:"has_errors",value:function has_errors(){return 0!==this.errors.length}},{key:"search",value:function search(t){return this.control.search(this.value,t)}},{key:"__repr__",value:function __repr__(){var t="<Field identifier=";return t+=e._repr(this.control.identifier),this._dirty&&(t+=" is_dirty()=True"),0!==this.errors.length&&(t+=" has_errors()=True"),t+=">"}},{key:"value",get:function get(){return this._value},set:function set(t){var r=this._value;e._ne(r,t)&&(this.record.values.set(this.control.identifier,t),this._value=t,this._dirty=!0)}}]),Field}(),H=function(t){function LookupItem(){return _classCallCheck(this,LookupItem),_possibleConstructorReturn(this,_getPrototypeOf(LookupItem).apply(this,arguments))}return _inherits(LookupItem,r),_createClass(LookupItem,[{key:"__repr__",value:function __repr__(){return"<LookupItem key="+e._repr(this.key)+" label="+e._repr(this.label)+">"}}]),LookupItem}();H.prototype._ul4onattrs=["key","label"],H.prototype._ul4attrs=e._makeset("key","label");var K=function(t){function User(){return _classCallCheck(this,User),_possibleConstructorReturn(this,_getPrototypeOf(User).apply(this,arguments))}return _inherits(User,r),_createClass(User,[{key:"__repr__",value:function __repr__(){return"<User id="+e._repr(this.id)+" firstname="+e._repr(this.firstname)+" surname="+e._repr(this.surname)+" email="+e._repr(this.email)+">"}}]),User}();K.prototype._ul4onattrs=["_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews"],K.prototype._ul4attrs=e._makeset("_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews");var W=function(t){function File(){return _classCallCheck(this,File),_possibleConstructorReturn(this,_getPrototypeOf(File).apply(this,arguments))}return _inherits(File,r),_createClass(File,[{key:"__repr__",value:function __repr__(){return"<File id="+e._repr(this.id)+" url="+e._repr(this.url)+" filename="+e._repr(this.filename)+">"}}]),File}();W.prototype._ul4onattrs=["id","url","filename","mimetype","width","height","internalid","createdat","size"],W.prototype._ul4attrs=e._makeset("id","url","filename","mimetype","width","height","size","createdat");var J=function(t){function Geo(t,e,r){var o;return _classCallCheck(this,Geo),(o=_possibleConstructorReturn(this,_getPrototypeOf(Geo).call(this))).lat=t,o.long=e,o.info=r,o}return _inherits(Geo,r),_createClass(Geo,[{key:"__repr__",value:function __repr__(){return"<Geo lat="+e._repr(this.lat)+" long="+e._repr(this.long)+" info="+e._repr(this.info)+">"}}]),Geo}();J.prototype._ul4onattrs=["lat","long","info"],J.prototype._ul4attrs=e._makeset("lat","long","info");var Y=function(t){function Attachment(){return _classCallCheck(this,Attachment),_possibleConstructorReturn(this,_getPrototypeOf(Attachment).apply(this,arguments))}return _inherits(Attachment,r),_createClass(Attachment,[{key:"__repr__",value:function __repr__(){return"<"+this.__type__+" id="+e._repr(this.id)+" label="+e._repr(this.label)+">"}}]),Attachment}();Y.prototype._ul4onattrs=["id","record","label","active"],Y.prototype._ul4attrs=e._makeset("id","record","label","active");var z=function(t){function NoteAttachment(){return _classCallCheck(this,NoteAttachment),_possibleConstructorReturn(this,_getPrototypeOf(NoteAttachment).apply(this,arguments))}return _inherits(NoteAttachment,Y),NoteAttachment}();z.prototype.type="noteattachment",z.prototype._ul4onattrs=Y.prototype._ul4onattrs.concat(["value"]),z.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Y.prototype._ul4onattrs).concat(["value"]));var Q=function(t){function URLAttachment(){return _classCallCheck(this,URLAttachment),_possibleConstructorReturn(this,_getPrototypeOf(URLAttachment).apply(this,arguments))}return _inherits(URLAttachment,Y),URLAttachment}();Q.prototype.type="urlattachment",Q.prototype._ul4onattrs=Y.prototype._ul4onattrs.concat(["value"]),Q.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Y.prototype._ul4onattrs).concat(["value"]));var X=function(t){function FileAttachment(){return _classCallCheck(this,FileAttachment),_possibleConstructorReturn(this,_getPrototypeOf(FileAttachment).apply(this,arguments))}return _inherits(FileAttachment,Y),FileAttachment}();X.prototype.type="fileattachment",X.prototype._ul4onattrs=Y.prototype._ul4onattrs.concat(["value"]),X.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Y.prototype._ul4onattrs).concat(["value"]));var Z=function(t){function ImageAttachment(){return _classCallCheck(this,ImageAttachment),_possibleConstructorReturn(this,_getPrototypeOf(ImageAttachment).apply(this,arguments))}return _inherits(ImageAttachment,Y),ImageAttachment}();Z.prototype.type="imageattachment",Z.prototype._ul4onattrs=Y.prototype._ul4onattrs.concat(["original","thumb","small","medium","large"]),Z.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Y.prototype._ul4onattrs).concat(["original","thumb","small","medium","large"]));var $=function(t){function JSONAttachment(){return _classCallCheck(this,JSONAttachment),_possibleConstructorReturn(this,_getPrototypeOf(JSONAttachment).apply(this,arguments))}return _inherits(JSONAttachment,Y),_createClass(JSONAttachment,[{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return"value"===t?e._asjson(this.value):this[t]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,r){"value"===t?this.value=e._fromjson(r):this[t]=r}}]),JSONAttachment}();$.prototype.type="jsonattachment",$.prototype._ul4onattrs=Y.prototype._ul4onattrs.concat(["value"]),$.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Y.prototype._ul4onattrs).concat(["value"]));var tt=function(t){function Installation(){return _classCallCheck(this,Installation),_possibleConstructorReturn(this,_getPrototypeOf(Installation).apply(this,arguments))}return _inherits(Installation,r),_createClass(Installation,[{key:"__repr__",value:function __repr__(){return"<Installation id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}}]),Installation}();tt.prototype._ul4onattrs=["id","name"],tt.prototype._ul4attrs=e._makeset("id","name");var et=function(t){function Category(){return _classCallCheck(this,Category),_possibleConstructorReturn(this,_getPrototypeOf(Category).apply(this,arguments))}return _inherits(Category,r),_createClass(Category,[{key:"__repr__",value:function __repr__(){for(var t=[],r=this;null!==r;)t.splice(0,0,r.identifier),r=r.parent;return"<Category id="+e._repr(this.id)+" identifierpath="+e._repr(t.join("/"))+NaN+e._repr(this.name)+">"}}]),Category}();et.prototype._ul4onattrs=["id","identifier","name","order","parent","children","apps"],et.prototype._ul4attrs=e._makeset("id","identifier","name","order","parent","children","apps");var rt=function(t){function KeyView(){return _classCallCheck(this,KeyView),_possibleConstructorReturn(this,_getPrototypeOf(KeyView).apply(this,arguments))}return _inherits(KeyView,r),_createClass(KeyView,[{key:"__repr__",value:function __repr__(){return"<KeyView id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),KeyView}();rt.prototype._ul4onattrs=["id","identifier","name","key","user"],rt.prototype._ul4attrs=e._makeset("id","identifier","name","key","user");var ot=function(t){function AppParameter(){return _classCallCheck(this,AppParameter),_possibleConstructorReturn(this,_getPrototypeOf(AppParameter).apply(this,arguments))}return _inherits(AppParameter,r),_createClass(AppParameter,[{key:"__repr__",value:function __repr__(){return"<AppParameter id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),AppParameter}();ot.prototype._ul4onattrs=["id","app","identifier","description","value"],ot.prototype._ul4attrs=e._makeset("id","app","identifier","description","value");for(var nt=0,lt=[n,l,a,i,s,u,c,_,h,f,C,d,v,k,m,g,b,A,L,O,R,P,w,M,S,x,D,N,U,F,I,T,j,G,B,E,V,q,H,K,W,J,z,Q,X,Z,$,tt,et,rt,ot];nt<lt.length;nt++){var at=lt[nt];e.register("de.livinglogic.livingapi."+at.name.toLowerCase(),at)}t.App=a,t.AppLookupChoiceControl=x,t.AppLookupControl=w,t.AppLookupRadioControl=S,t.AppLookupSelectControl=M,t.AppParameter=ot,t.Attachment=Y,t.Base=r,t.BoolControl=c,t.ButtonControl=V,t.Category=et,t.Control=p,t.DataSourceData=s,t.DateControl=g,t.DatetimeMinuteControl=b,t.DatetimeSecondControl=A,t.EmailControl=C,t.Field=q,t.File=W,t.FileAttachment=X,t.FileControl=E,t.FlashMessage=l,t.Geo=J,t.GeoControl=B,t.Globals=n,t.Handler=o,t.ImageAttachment=Z,t.Installation=tt,t.IntControl=_,t.JSONAttachment=$,t.KeyView=rt,t.LookupChoiceControl=P,t.LookupControl=L,t.LookupItem=H,t.LookupRadioControl=R,t.LookupSelectControl=O,t.MultipleAppLookupCheckboxControl=j,t.MultipleAppLookupChoiceControl=G,t.MultipleAppLookupControl=I,t.MultipleAppLookupSelectControl=T,t.MultipleLookupCheckboxControl=U,t.MultipleLookupChoiceControl=F,t.MultipleLookupControl=D,t.MultipleLookupSelectControl=N,t.NoteAttachment=z,t.NumberControl=h,t.PasswordControl=k,t.Record=u,t.StringControl=y,t.TelControl=v,t.TextAreaControl=m,t.TextControl=f,t.URLAttachment=Q,t.URLControl=d,t.User=K,t.View=i,t.version="0.10.0",Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=livingapi.js.map
