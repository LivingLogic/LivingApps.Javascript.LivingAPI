import*as e from"@livinglogic/ul4";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e})(e,t)}function _possibleConstructorReturn(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function _createSuper(e){var t=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var r,o=_getPrototypeOf(e);if(t){var a=_getPrototypeOf(this).constructor;r=Reflect.construct(o,arguments,a)}else r=o.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _get(e,t,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(e,t,r){var o=function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=_getPrototypeOf(e)););return e}(e,t);if(o){var a=Object.getOwnPropertyDescriptor(o,t);return a.get?a.get.call(r):a.value}})(e,t,r||e)}function _slicedToArray(e,t){return function _arrayWithHoles(e){if(Array.isArray(e))return e}(e)||function _iterableToArrayLimit(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var o,a,n=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(o=r.next()).done)&&(n.push(o.value),!t||n.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return n}(e,t)||_unsupportedIterableToArray(e,t)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _toConsumableArray(e){return function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}(e)||function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||_unsupportedIterableToArray(e)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,o=new Array(t);r<t;r++)o[r]=e[r];return o}function _createForOfIteratorHelper(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var o=0,F=function(){};return{s:F,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,n=!0,l=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return n=e.done,e},e:function(e){l=!0,a=e},f:function(){try{n||null==r.return||r.return()}finally{if(l)throw a}}}}var t="0.13.0",r=function(t){_inherits(Base,e.Proto);var r=_createSuper(Base);function Base(){return _classCallCheck(this,Base),r.call(this)}return _createClass(Base,[{key:"ul4ondump",value:function ul4ondump(e){for(var t=0;t<this._ul4onattrs.length;++t)e.dump(this._dumpUL4ONAttr(this._ul4onattrs[t]))}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(e){return this[e]}},{key:"ul4onload",value:function ul4onload(e){for(var t=0,r=e.loadcontent();;++t){var o=r.next();if(o.done)break;t<this._ul4onattrs.length&&this._loadUL4ONAttr(this._ul4onattrs[t],o.value)}for(;t<this._ul4onattrs.length;++t)this._setDefaultUL4ONAttr(this._ul4onattrs[t])}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(e,t){this[e]=t}},{key:"_setDefaultUL4ONAttr",value:function _setDefaultUL4ONAttr(e){this[e]=null}},{key:"__getattr__",value:function __getattr__(t){if(this._ul4attrs.has(t)){var r=this[t];if("function"==typeof r){var o=r.bind(this);return o._ul4_name=r._ul4_name||r.name,o._ul4_signature=r._ul4_signature,o._ul4_needsobject=r._ul4_needsobject,o._ul4_needscontext=r._ul4_needscontext,o}return r}throw new e.AttributeError(this,t)}},{key:"__repr__",value:function __repr__(){return"<"+this.constructor.name+">"}}]),Base}(),o=function(){function Handler(){_classCallCheck(this,Handler)}return _createClass(Handler,[{key:"save",value:function save(e){}},{key:"delete",value:function _delete(e){}}]),Handler}(),a=function(t){_inherits(Globals,r);var a=_createSuper(Globals);function Globals(){var e;return _classCallCheck(this,Globals),(e=a.call(this)).version=null,e.hostname=null,e.platform=null,e.user=null,e.lang=null,e.app=null,e.record=null,e.maxdbactions=null,e.maxtemplateruntime=null,e.flashmessages=null,e.handler=new o,e}return _createClass(Globals,[{key:"__repr__",value:function __repr__(){return"<Globals version="+e._repr(this.version)+">"}}],[{key:"geodist",value:function geodist(e,t){var r=function sqsin(e){return(e=Math.sin(e))*e},o=function sqsos(e){return(e=Math.cos(e))*e},a=Math.PI/180,n=1/298.257223563,l=e.lat*a,i=e.long*a,s=t.lat*a,p=(l+s)/2,u=(l-s)/2,c=(i-t.long*a)/2,_=r(u)*o(c)+o(p)*r(c),h=o(u)*o(c)+r(p)*r(c),f=Math.atan(Math.sqrt(_/h)),y=2*f*6378.137,d=Math.sqrt(_*h)/f,v=(3*d+1)/(2*_);return y*(1+n*((3*d-1)/(2*h))*r(p)*o(u)-n*v*o(p)*r(u))}}]),Globals}();_defineProperty(a,"classdoc","Global information"),a.prototype._ul4onattrs=["version","platform","user","maxdbactions","maxtemplateruntime","flashmessages","lang","datasources","hostname","app","record"],a.prototype._ul4attrs=e._makeset("version","hostname","platform","user","lang","app","record","maxdbactions","maxtemplateruntime","flashmessages");var n=function(t){_inherits(FlashMessage,r);var o=_createSuper(FlashMessage);function FlashMessage(){return _classCallCheck(this,FlashMessage),o.apply(this,arguments)}return _createClass(FlashMessage,[{key:"__repr__",value:function __repr__(){return"<FlashMessage type="+e._repr(this.type)+" title="+e._repr(this.title)+">"}}]),FlashMessage}();_defineProperty(n,"classdoc","A flash message in a web page"),n.prototype._ul4onattrs=["timestamp","type","title","message"],n.prototype._ul4attrs=e._makeset("timestamp","type","title","message");var l=function(t){_inherits(App,r);var o=_createSuper(App);function App(){return _classCallCheck(this,App),o.apply(this,arguments)}return _createClass(App,[{key:"__repr__",value:function __repr__(){return"<App id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}},{key:"insert",value:function insert(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=this.__call__(e);return this.globals.handler.save(this),t}},{key:"__call__",value:function __call__(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=new p(this);if(e._ismap(t)){var o,a=_createForOfIteratorHelper(t.entries());try{for(a.s();!(o=a.n()).done;){var n=_slicedToArray(o.value,2),l=n[0],i=n[1];if(!r.fields.has(l))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(l));r.fields.get(l).value=i}}catch(e){a.e(e)}finally{a.f()}}else{if(!e._isobject(t))throw new e.TypeError("values must be an object or a Map");for(var s in t){if(!r.fields.has(s))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(s));r.fields.get(s).value=t[s]}}return r}},{key:"__getattr__",value:function __getattr__(t){if(t.startsWith("c_")){if(!this.controls.has(t.substr(2)))throw new e.AttributeError(this,t);return this.controls.get(t.substr(2))}return _get(_getPrototypeOf(App.prototype),"__getattr__",this).call(this,t)}}]),App}();_defineProperty(l,"classdoc","A LivingApps application"),l.prototype._ul4onattrs=["id","globals","name","description","lang","startlink","iconlarge","iconsmall","createdby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","basetable","primarykey","insertprocedure","updateprocedure","deleteprocedure","templates","createdat","updatedat","updatedby","superid","favorite"],l.prototype._ul4attrs=e._makeset("id","globals","name","description","lang","startlink","iconlarge","iconsmall","createdat","createdby","updatedat","updatedby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","insert","favorite"),e.expose(l.prototype.__call__,["**values"],{needsobject:!0}),e.expose(l.prototype.insert,["**values"],{needsobject:!0});var i=function(t){_inherits(View,r);var o=_createSuper(View);function View(){return _classCallCheck(this,View),o.apply(this,arguments)}return _createClass(View,[{key:"__repr__",value:function __repr__(){return"<View id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}}]),View}();_defineProperty(i,"classdoc","An input form for a LivingApps application"),i.prototype._ul4onattrs=["id","name","app","order","width","height","start","end"],i.prototype._ul4attrs=e._makeset("id","name","app","order","width","height","start","end");var s=function(t){_inherits(DataSourceData,r);var o=_createSuper(DataSourceData);function DataSourceData(){return _classCallCheck(this,DataSourceData),o.apply(this,arguments)}return _createClass(DataSourceData,[{key:"__repr__",value:function __repr__(){return"<DataSource.Data id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),DataSourceData}();_defineProperty(s,"classdoc","The data resulting from a data source configuration"),s.prototype._ul4onattrs=["id","identifier","app","apps"],s.prototype._ul4attrs=e._makeset("id","identifier","app","apps");var p=function(t){_inherits(Record,r);var o=_createSuper(Record);function Record(e){var t;return _classCallCheck(this,Record),(t=o.call(this)).id=null,t.app=e,t.createdat=null,t.createdby=null,t.updatedat=null,t.updatedby=null,t.updatecount=0,t._sparsevalues=new Map,t._values=null,t._fields=null,t.children=new Map,t.attachments=null,t.errors=[],t._is_deleted=!1,t}return _createClass(Record,[{key:"__repr__",value:function __repr__(){var t,r=["<Record id=",e._repr(this.id)],o=_createForOfIteratorHelper(this.fields.values());try{for(o.s();!(t=o.n()).done;){var a=t.value;a.control.priority&&(r.push(" v_"),r.push(a.control.identifier),r.push("="),r.push(e._repr(a.value)))}}catch(e){o.e(e)}finally{o.f()}return r.push(">"),r.join("")}},{key:"values",get:function get(){if(null===this._values){this._values=e._havemap?new Map:{};var t,r=_createForOfIteratorHelper(this.app.controls.entries());try{for(r.s();!(t=r.n()).done;){var o=_slicedToArray(t.value,2),a=o[0],n=(o[1],this._sparsevalues.get(a));void 0===n&&(n=null),this._values.set(a,n)}}catch(e){r.e(e)}finally{r.f()}}return this._values}},{key:"fields",get:function get(){if(null===this._fields){this._fields=e._havemap?new Map:{};var t,r=_createForOfIteratorHelper(this.values.entries());try{for(r.s();!(t=r.n()).done;){var o=_slicedToArray(t.value,2),a=o[0],n=o[1],l=new J(this.app.controls.get(a),this,n);this._fields.set(a,l)}}catch(e){r.e(e)}finally{r.f()}}return this._fields}},{key:"is_dirty",value:function is_dirty(){if(null===this.id)return!0;var e,t=_createForOfIteratorHelper(this.fields.values());try{for(t.s();!(e=t.n()).done;){if(e.value.is_dirty())return!0}}catch(e){t.e(e)}finally{t.f()}return!1}},{key:"has_errors",value:function has_errors(){if(0!==this.errors.length)return!0;var e,t=_createForOfIteratorHelper(this.fields.values());try{for(t.s();!(e=t.n()).done;){if(e.value.has_errors())return!0}}catch(e){t.e(e)}finally{t.f()}return!1}},{key:"delete",value:function _delete(){return this.app.globals.handler.delete(this)}},{key:"save",value:function save(){this.app.globals.handler.save(this)}},{key:"update",value:function update(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(e._ismap(t)){var r,o=_createForOfIteratorHelper(t.entries());try{for(o.s();!(r=o.n()).done;){var a=_slicedToArray(r.value,2),n=a[0],l=a[1];if(!this.fields.has(n))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(n));fields.get(n).value=l}}catch(e){o.e(e)}finally{o.f()}}else{if(!e._isobject(t))throw new e.TypeError("values must be an object or a Map");for(var i in t){if(!this.fields.has(i))throw new e.ArgumentError("update() get an unexpected keyword argument "+e._repr(i));record.fields.get(i).value=t[i]}}this.app.globals.handler.save(this)}},{key:"search",value:function search(t){for(var r in t){var o=t[r];if(e._bool(o)&&!this.fields.get(r).search(o))return!1}return!0}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(e){return"values"===e?this._sparsevalues:this[e]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(e,t){"values"===e?(this._sparsevalues=t,this._values=null,this._fields=null):this[e]=t}},{key:"__getattr__",value:function __getattr__(e){return e.startsWith("c_")?this.children.get(e.substr(2)):e.startsWith("f_")?this.fields.get(e.substr(2)):e.startsWith("v_")?this.values.get(e.substr(2)):this[e]}},{key:"__setattr__",value:function __setattr__(t,r){if(t.startsWith("c_"))this.children[t.substr(2)]=r;else{if(!t.startsWith("v_"))throw new e.AttributeError(this,t);this.fields.get(t.substr(2)).value=r}}}]),Record}();_defineProperty(p,"classdoc","A record of a LivingApp application"),p.prototype._ul4onattrs=["id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"],p.prototype._ul4attrs=e._makeset("id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"),e.expose(p.prototype.is_dirty,[]),e.expose(p.prototype.has_errors,[]),e.expose(p.prototype.delete,[]),e.expose(p.prototype.save,[]),e.expose(p.prototype.update,["**values"],{needsobject:!0});var u=function(t){_inherits(Control,r);var o=_createSuper(Control);function Control(){return _classCallCheck(this,Control),o.apply(this,arguments)}return _createClass(Control,[{key:"__repr__",value:function __repr__(){return"<"+this.constructor.name+" id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}},{key:"_logsearch",value:function _logsearch(e,t){}},{key:"search",value:function search(e,t){return!1}}]),Control}();u.prototype.type=null,u.prototype.subtype=null,u.prototype._ul4onattrs=["id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure"],u.prototype._ul4attrs=e._makeset("id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure");var c=function(e){_inherits(BoolControl,u);var t=_createSuper(BoolControl);function BoolControl(){return _classCallCheck(this,BoolControl),t.apply(this,arguments)}return _createClass(BoolControl,[{key:"search",value:function search(e,t){return this._logsearch(e,t),"equals"===t.operator&&t.value===e}}]),BoolControl}();_defineProperty(c,"classdoc","A LivingApps boolean field (type 'bool')"),c.prototype.type="bool";var _=function(e){_inherits(IntControl,u);var t=_createSuper(IntControl);function IntControl(){return _classCallCheck(this,IntControl),t.apply(this,arguments)}return _createClass(IntControl,[{key:"search",value:function search(e,t){return this._logsearch(e,t),"equals"===t.operator&&t.value===e}}]),IntControl}();_defineProperty(_,"classdoc","A LivingApps integer field (type 'int')"),_.prototype.type="int";var h=function(e){_inherits(NumberControl,u);var t=_createSuper(NumberControl);function NumberControl(){return _classCallCheck(this,NumberControl),t.apply(this,arguments)}return _createClass(NumberControl,[{key:"search",value:function search(e,t){return this._logsearch(e,t),"equals"===t.operator?t.value===e:"range"===t.operator&&(null!==e&&((null===t.minvalue||t.minvalue<=e)&&(null===t.maxvalue||e<t.maxvalue)))}}]),NumberControl}();_defineProperty(h,"classdoc","A LivingApps number field (type 'number')"),h.prototype.type="number";var f=function(e){_inherits(StringControl,u);var t=_createSuper(StringControl);function StringControl(){return _classCallCheck(this,StringControl),t.apply(this,arguments)}return _createClass(StringControl,[{key:"search",value:function search(e,t){return this._logsearch(e,t),"equals"===t.operator?t.value===e:"contains"===t.operator?null===t.value||null===e?t.value===e:e.toLowerCase().indexOf(t.value.toLowerCase())>=0:void 0}}]),StringControl}();f.prototype.type="string";var y=function(e){_inherits(TextControl,f);var t=_createSuper(TextControl);function TextControl(){return _classCallCheck(this,TextControl),t.apply(this,arguments)}return TextControl}();_defineProperty(y,"classdoc","A LivingApps text field (type 'string/text')"),y.prototype.subtype="text";var d=function(e){_inherits(EmailControl,f);var t=_createSuper(EmailControl);function EmailControl(){return _classCallCheck(this,EmailControl),t.apply(this,arguments)}return EmailControl}();_defineProperty(d,"classdoc","A LivingApps email field (type 'string/email')"),d.prototype.subtype="email";var v=function(e){_inherits(URLControl,f);var t=_createSuper(URLControl);function URLControl(){return _classCallCheck(this,URLControl),t.apply(this,arguments)}return URLControl}();_defineProperty(v,"classdoc","A LivingApps URL field (type 'string/url')"),v.prototype.subtype="url";var C=function(e){_inherits(TelControl,f);var t=_createSuper(TelControl);function TelControl(){return _classCallCheck(this,TelControl),t.apply(this,arguments)}return TelControl}();_defineProperty(C,"classdoc","A LivingApps phone number field (type 'string/tel')"),C.prototype.subtype="tel";var m=function(e){_inherits(PasswordControl,f);var t=_createSuper(PasswordControl);function PasswordControl(){return _classCallCheck(this,PasswordControl),t.apply(this,arguments)}return PasswordControl}();_defineProperty(m,"classdoc","A LivingApps email field (type 'string/email')"),m.prototype.subtype="password";var k=function(e){_inherits(TextAreaControl,f);var t=_createSuper(TextAreaControl);function TextAreaControl(){return _classCallCheck(this,TextAreaControl),t.apply(this,arguments)}return TextAreaControl}();_defineProperty(k,"classdoc","A LivingApps textarea field (type 'string/textarea')"),k.prototype.subtype="textarea",k.prototype._ul4onattrs=f.prototype._ul4onattrs.concat(["encrypted"]),k.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(f.prototype._ul4attrs).concat(["encrypted"]));var g=function(e){_inherits(HTMLControl,f);var t=_createSuper(HTMLControl);function HTMLControl(){return _classCallCheck(this,HTMLControl),t.apply(this,arguments)}return HTMLControl}();_defineProperty(g,"classdoc","A LivingApps HTML field (type 'string/html')"),g.prototype.subtype="html";var A=function(t){_inherits(DateControl,u);var r=_createSuper(DateControl);function DateControl(){return _classCallCheck(this,DateControl),r.apply(this,arguments)}return _createClass(DateControl,[{key:"formatstring",value:function formatstring(e){return"de"===(e=e||this.app.language)?"%d.%m.%Y":"%m/%d/%Y"}},{key:"search",value:function search(t,r){this._logsearch(t,r);var o=r.value;return"[object Date]"==Object.prototype.toString.call(o)&&(o=e._format(o,this.formatstring(),this.app.language)),null!==t&&(t=e._format(t,this.formatstring(),this.app.language)),"equals"===r.operator?o===t:"contains"===r.operator&&(null===o||null===t?o===t:t.toLowerCase().indexOf(o.toLowerCase())>=0)}}]),DateControl}();_defineProperty(A,"classdoc","A LivingApps date field (type 'date/date')"),A.prototype.type="date",A.prototype.subtype="date";var b=function(e){_inherits(DatetimeMinuteControl,A);var t=_createSuper(DatetimeMinuteControl);function DatetimeMinuteControl(){return _classCallCheck(this,DatetimeMinuteControl),t.apply(this,arguments)}return _createClass(DatetimeMinuteControl,[{key:"formatstring",value:function formatstring(e){return"de"===(e=e||this.app.language)?"%d.%m.%Y %H:%M":"%m/%d/%Y %H:%M"}}]),DatetimeMinuteControl}();_defineProperty(b,"classdoc","A LivingApps date field (type 'date/datetimeminute')"),b.prototype.subtype="datetimeminute";var L=function(e){_inherits(DatetimeSecondControl,A);var t=_createSuper(DatetimeSecondControl);function DatetimeSecondControl(){return _classCallCheck(this,DatetimeSecondControl),t.apply(this,arguments)}return _createClass(DatetimeSecondControl,[{key:"formatstring",value:function formatstring(e){return"de"===(e=e||this.app.language)?"%d.%m.%Y %H:%M:%S":"%m/%d/%Y %H:%M:%S"}}]),DatetimeSecondControl}();_defineProperty(L,"classdoc","A LivingApps date field (type 'date/datetimesecond')"),L.prototype.subtype="datetimesecond";var S=function(e){_inherits(LookupControl,u);var t=_createSuper(LookupControl);function LookupControl(){return _classCallCheck(this,LookupControl),t.apply(this,arguments)}return _createClass(LookupControl,[{key:"search",value:function search(e,t){return"equals"===t.operator&&(null===e?null===t.value:e.key===t.value)}}]),LookupControl}();S.prototype.type="lookup",S.prototype._ul4onattrs=u.prototype._ul4onattrs.concat(["lookupdata"]),S.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(u.prototype._ul4attrs).concat(["lookupdata"]));var P=function(e){_inherits(LookupSelectControl,S);var t=_createSuper(LookupSelectControl);function LookupSelectControl(){return _classCallCheck(this,LookupSelectControl),t.apply(this,arguments)}return LookupSelectControl}();_defineProperty(P,"classdoc","A LivingApps lookup field (type 'lookup/select')"),P.prototype.subtype="select";var w=function(e){_inherits(LookupRadioControl,S);var t=_createSuper(LookupRadioControl);function LookupRadioControl(){return _classCallCheck(this,LookupRadioControl),t.apply(this,arguments)}return LookupRadioControl}();_defineProperty(w,"classdoc","A LivingApps lookup field (type 'lookup/radio')"),w.prototype.subtype="radio";var M=function(e){_inherits(LookupChoiceControl,S);var t=_createSuper(LookupChoiceControl);function LookupChoiceControl(){return _classCallCheck(this,LookupChoiceControl),t.apply(this,arguments)}return LookupChoiceControl}();_defineProperty(M,"classdoc","A LivingApps lookup field (type 'lookup/choice')"),M.prototype.subtype="choice";var O=function(e){_inherits(AppLookupControl,u);var t=_createSuper(AppLookupControl);function AppLookupControl(){return _classCallCheck(this,AppLookupControl),t.apply(this,arguments)}return _createClass(AppLookupControl,[{key:"search",value:function search(e,t){return null===e||null===t.value?e===t.value:e.search(t)}}]),AppLookupControl}();O.prototype.type="applookup",O.prototype._ul4onattrs=u.prototype._ul4onattrs.concat(["lookup_app","lookup_controls","local_master_control","local_detail_controls","remote_master_control"]),O.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(u.prototype._ul4attrs).concat(["lookup_app","lookup_controls","local_master_control","local_detail_controls","remote_master_control"]));var x=function(e){_inherits(AppLookupSelectControl,O);var t=_createSuper(AppLookupSelectControl);function AppLookupSelectControl(){return _classCallCheck(this,AppLookupSelectControl),t.apply(this,arguments)}return AppLookupSelectControl}();_defineProperty(x,"classdoc","A LivingApps applookup field (type 'applookup/select')"),x.prototype.subtype="select";var I=function(e){_inherits(AppLookupRadioControl,O);var t=_createSuper(AppLookupRadioControl);function AppLookupRadioControl(){return _classCallCheck(this,AppLookupRadioControl),t.apply(this,arguments)}return AppLookupRadioControl}();_defineProperty(I,"classdoc","A LivingApps applookup field (type 'applookup/radio')"),I.prototype.subtype="radio";var T=function(e){_inherits(AppLookupChoiceControl,O);var t=_createSuper(AppLookupChoiceControl);function AppLookupChoiceControl(){return _classCallCheck(this,AppLookupChoiceControl),t.apply(this,arguments)}return AppLookupChoiceControl}();_defineProperty(T,"classdoc","A LivingApps applookup field (type 'applookup/choice')"),T.prototype.subtype="choice";var R=function(e){_inherits(MultipleLookupControl,S);var t=_createSuper(MultipleLookupControl);function MultipleLookupControl(){return _classCallCheck(this,MultipleLookupControl),t.apply(this,arguments)}return _createClass(MultipleLookupControl,[{key:"search",value:function search(e,t){if("equals"===t.operator){var r,o=_createForOfIteratorHelper(e);try{for(o.s();!(r=o.n()).done;){if(r.value.key===t.value)return!0}}catch(e){o.e(e)}finally{o.f()}return!1}return!1}}]),MultipleLookupControl}();R.prototype.subtype="multiplelookup";var N=function(e){_inherits(MultipleLookupSelectControl,R);var t=_createSuper(MultipleLookupSelectControl);function MultipleLookupSelectControl(){return _classCallCheck(this,MultipleLookupSelectControl),t.apply(this,arguments)}return MultipleLookupSelectControl}();_defineProperty(N,"classdoc","A LivingApps multiplelookup field (type 'multiplelookup/select')"),N.prototype.subtype="select";var D=function(e){_inherits(MultipleLookupCheckboxControl,R);var t=_createSuper(MultipleLookupCheckboxControl);function MultipleLookupCheckboxControl(){return _classCallCheck(this,MultipleLookupCheckboxControl),t.apply(this,arguments)}return MultipleLookupCheckboxControl}();_defineProperty(D,"classdoc","A LivingApps multiplelookup field (type 'multiplelookup/checkbox')"),D.prototype.subtype="checkbox";var U=function(e){_inherits(MultipleLookupChoiceControl,R);var t=_createSuper(MultipleLookupChoiceControl);function MultipleLookupChoiceControl(){return _classCallCheck(this,MultipleLookupChoiceControl),t.apply(this,arguments)}return MultipleLookupChoiceControl}();_defineProperty(U,"classdoc","A LivingApps multiplelookup field (type 'multiplelookup/choice')"),U.prototype.subtype="choice";var j=function(e){_inherits(MultipleAppLookupControl,O);var t=_createSuper(MultipleAppLookupControl);function MultipleAppLookupControl(){return _classCallCheck(this,MultipleAppLookupControl),t.apply(this,arguments)}return _createClass(MultipleAppLookupControl,[{key:"search",value:function search(e,t){if("equals"===t.operator){if(null===t.value)return 0===e.length;var r,o=_createForOfIteratorHelper(e);try{for(o.s();!(r=o.n()).done;){if(r.value.search(t.value))return!0}}catch(e){o.e(e)}finally{o.f()}return!1}return!1}}]),MultipleAppLookupControl}();j.prototype.type="multipleapplookup";var H=function(e){_inherits(MultipleAppLookupSelectControl,j);var t=_createSuper(MultipleAppLookupSelectControl);function MultipleAppLookupSelectControl(){return _classCallCheck(this,MultipleAppLookupSelectControl),t.apply(this,arguments)}return MultipleAppLookupSelectControl}();_defineProperty(H,"classdoc","A LivingApps multiple applookup field (type 'multipleapplookup/select')"),H.prototype.subtype="select";var G=function(e){_inherits(MultipleAppLookupCheckboxControl,j);var t=_createSuper(MultipleAppLookupCheckboxControl);function MultipleAppLookupCheckboxControl(){return _classCallCheck(this,MultipleAppLookupCheckboxControl),t.apply(this,arguments)}return MultipleAppLookupCheckboxControl}();_defineProperty(G,"classdoc","A LivingApps multiple applookup field (type 'multipleapplookup/checkbox')"),G.prototype.subtype="checkbox";var B=function(e){_inherits(MultipleAppLookupChoiceControl,j);var t=_createSuper(MultipleAppLookupChoiceControl);function MultipleAppLookupChoiceControl(){return _classCallCheck(this,MultipleAppLookupChoiceControl),t.apply(this,arguments)}return MultipleAppLookupChoiceControl}();_defineProperty(B,"classdoc","A LivingApps multiple applookup field (type 'multipleapplookup/choice')"),B.prototype.subtype="choice";var E=function(e){_inherits(GeoControl,u);var t=_createSuper(GeoControl);function GeoControl(){return _classCallCheck(this,GeoControl),t.apply(this,arguments)}return GeoControl}();_defineProperty(E,"classdoc","A LivingApps geo field (type 'geo')"),E.prototype.type="geo";var V=function(e){_inherits(FileControl,u);var t=_createSuper(FileControl);function FileControl(){return _classCallCheck(this,FileControl),t.apply(this,arguments)}return FileControl}();_defineProperty(V,"classdoc","A LivingApps upload field (type 'file')"),V.prototype.type="file";var q=function(e){_inherits(FileSignatureControl,V);var t=_createSuper(FileSignatureControl);function FileSignatureControl(){return _classCallCheck(this,FileSignatureControl),t.apply(this,arguments)}return FileSignatureControl}();_defineProperty(q,"classdoc","A LivingApps signature image field (type 'file/signature')"),q.prototype.subtype="signature";var W=function(e){_inherits(ButtonControl,u);var t=_createSuper(ButtonControl);function ButtonControl(){return _classCallCheck(this,ButtonControl),t.apply(this,arguments)}return ButtonControl}();W.prototype.type="button";var J=function(t){_inherits(Field,r);var o=_createSuper(Field);function Field(e,t,r){var a;return _classCallCheck(this,Field),(a=o.call(this)).control=e,a.record=t,a._value=r,a._dirty=!1,a.errors=[],a}return _createClass(Field,[{key:"value",get:function get(){return this._value},set:function set(t){var r=this._value;e._ne(r,t)&&(this.record.values.set(this.control.identifier,t),this._value=t,this._dirty=!0)}},{key:"is_empty",value:function is_empty(){return null===this._value||e._islist(this._value)&&0===this._value.length}},{key:"is_dirty",value:function is_dirty(){return this._dirty}},{key:"has_errors",value:function has_errors(){return 0!==this.errors.length}},{key:"search",value:function search(e){return this.control.search(this.value,e)}},{key:"__repr__",value:function __repr__(){var t="<Field identifier=";return t+=e._repr(this.control.identifier),this._dirty&&(t+=" is_dirty()=True"),0!==this.errors.length&&(t+=" has_errors()=True"),t+=">"}}]),Field}(),K=function(t){_inherits(LookupItem,r);var o=_createSuper(LookupItem);function LookupItem(){return _classCallCheck(this,LookupItem),o.apply(this,arguments)}return _createClass(LookupItem,[{key:"__repr__",value:function __repr__(){return"<LookupItem key="+e._repr(this.key)+" label="+e._repr(this.label)+">"}}]),LookupItem}();_defineProperty(K,"classdoc","An option in a lookup control/field"),K.prototype._ul4onattrs=["key","label"],K.prototype._ul4attrs=e._makeset("key","label");var Y=function(t){_inherits(User,r);var o=_createSuper(User);function User(){return _classCallCheck(this,User),o.apply(this,arguments)}return _createClass(User,[{key:"__repr__",value:function __repr__(){return"<User id="+e._repr(this.id)+" firstname="+e._repr(this.firstname)+" surname="+e._repr(this.surname)+" email="+e._repr(this.email)+">"}}]),User}();_defineProperty(Y,"classdoc","A LivingApps user/account"),Y.prototype._ul4onattrs=["_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews"],Y.prototype._ul4attrs=e._makeset("_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews");var z=function(t){_inherits(File,r);var o=_createSuper(File);function File(){return _classCallCheck(this,File),o.apply(this,arguments)}return _createClass(File,[{key:"__repr__",value:function __repr__(){return"<File id="+e._repr(this.id)+" url="+e._repr(this.url)+" filename="+e._repr(this.filename)+">"}}]),File}();_defineProperty(z,"classdoc","An uploaded file"),z.prototype._ul4onattrs=["id","url","filename","mimetype","width","height","internalid","createdat","size"],z.prototype._ul4attrs=e._makeset("id","url","filename","mimetype","width","height","size","createdat");var $=function(t){_inherits(Geo,r);var o=_createSuper(Geo);function Geo(e,t,r){var a;return _classCallCheck(this,Geo),(a=o.call(this)).lat=e,a.long=t,a.info=r,a}return _createClass(Geo,[{key:"__repr__",value:function __repr__(){return"<Geo lat="+e._repr(this.lat)+" long="+e._repr(this.long)+" info="+e._repr(this.info)+">"}}]),Geo}();_defineProperty($,"classdoc","Geographical coordinates and location information"),$.prototype._ul4onattrs=["lat","long","info"],$.prototype._ul4attrs=e._makeset("lat","long","info");var Q=function(t){_inherits(Attachment,r);var o=_createSuper(Attachment);function Attachment(){return _classCallCheck(this,Attachment),o.apply(this,arguments)}return _createClass(Attachment,[{key:"__repr__",value:function __repr__(){return"<"+this.__type__+" id="+e._repr(this.id)+" label="+e._repr(this.label)+">"}}]),Attachment}();Q.prototype._ul4onattrs=["id","record","label","active"],Q.prototype._ul4attrs=e._makeset("id","record","label","active");var X=function(e){_inherits(NoteAttachment,Q);var t=_createSuper(NoteAttachment);function NoteAttachment(){return _classCallCheck(this,NoteAttachment),t.apply(this,arguments)}return NoteAttachment}();_defineProperty(X,"classdoc","A note attachment of a record"),X.prototype.type="noteattachment",X.prototype._ul4onattrs=Q.prototype._ul4onattrs.concat(["value"]),X.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Q.prototype._ul4onattrs).concat(["value"]));var Z=function(e){_inherits(URLAttachment,Q);var t=_createSuper(URLAttachment);function URLAttachment(){return _classCallCheck(this,URLAttachment),t.apply(this,arguments)}return URLAttachment}();_defineProperty(Z,"classdoc","A URL attachment of a record"),Z.prototype.type="urlattachment",Z.prototype._ul4onattrs=Q.prototype._ul4onattrs.concat(["value"]),Z.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Q.prototype._ul4onattrs).concat(["value"]));var ee=function(e){_inherits(FileAttachment,Q);var t=_createSuper(FileAttachment);function FileAttachment(){return _classCallCheck(this,FileAttachment),t.apply(this,arguments)}return FileAttachment}();_defineProperty(ee,"classdoc","A file attachment of a record"),ee.prototype.type="fileattachment",ee.prototype._ul4onattrs=Q.prototype._ul4onattrs.concat(["value"]),ee.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Q.prototype._ul4onattrs).concat(["value"]));var te=function(e){_inherits(ImageAttachment,Q);var t=_createSuper(ImageAttachment);function ImageAttachment(){return _classCallCheck(this,ImageAttachment),t.apply(this,arguments)}return ImageAttachment}();_defineProperty(te,"classdoc","An image attachment of a record"),te.prototype.type="imageattachment",te.prototype._ul4onattrs=Q.prototype._ul4onattrs.concat(["original","thumb","small","medium","large"]),te.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Q.prototype._ul4onattrs).concat(["original","thumb","small","medium","large"]));var re=function(t){_inherits(JSONAttachment,Q);var r=_createSuper(JSONAttachment);function JSONAttachment(){return _classCallCheck(this,JSONAttachment),r.apply(this,arguments)}return _createClass(JSONAttachment,[{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return"value"===t?e._asjson(this.value):this[t]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,r){"value"===t?this.value=e._fromjson(r):this[t]=r}}]),JSONAttachment}();_defineProperty(re,"classdoc","A JSON attachment of a record"),re.prototype.type="jsonattachment",re.prototype._ul4onattrs=Q.prototype._ul4onattrs.concat(["value"]),re.prototype._ul4attrs=e._makeset.apply(e,_toConsumableArray(Q.prototype._ul4onattrs).concat(["value"]));var oe=function(t){_inherits(Installation,r);var o=_createSuper(Installation);function Installation(){return _classCallCheck(this,Installation),o.apply(this,arguments)}return _createClass(Installation,[{key:"__repr__",value:function __repr__(){return"<Installation id="+e._repr(this.id)+" name="+e._repr(this.name)+">"}}]),Installation}();_defineProperty(oe,"classdoc","The installation that created an app"),oe.prototype._ul4onattrs=["id","name"],oe.prototype._ul4attrs=e._makeset("id","name");var ae=function(t){_inherits(Category,r);var o=_createSuper(Category);function Category(){return _classCallCheck(this,Category),o.apply(this,arguments)}return _createClass(Category,[{key:"__repr__",value:function __repr__(){for(var t=[],r=this;null!==r;)t.splice(0,0,r.identifier),r=r.parent;return"<Category id="+e._repr(this.id)+" identifierpath="+e._repr(t.join("/"))+NaN+e._repr(this.name)+">"}}]),Category}();_defineProperty(ae,"classdoc","A navigation category"),ae.prototype._ul4onattrs=["id","identifier","name","order","parent","children","apps"],ae.prototype._ul4attrs=e._makeset("id","identifier","name","order","parent","children","apps");var ne=function(t){_inherits(KeyView,r);var o=_createSuper(KeyView);function KeyView(){return _classCallCheck(this,KeyView),o.apply(this,arguments)}return _createClass(KeyView,[{key:"__repr__",value:function __repr__(){return"<KeyView id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),KeyView}();_defineProperty(ne,"classdoc","Object granting access to a view template"),ne.prototype._ul4onattrs=["id","identifier","name","key","user"],ne.prototype._ul4attrs=e._makeset("id","identifier","name","key","user");var le=function(t){_inherits(AppParameter,r);var o=_createSuper(AppParameter);function AppParameter(){return _classCallCheck(this,AppParameter),o.apply(this,arguments)}return _createClass(AppParameter,[{key:"__repr__",value:function __repr__(){return"<AppParameter id="+e._repr(this.id)+" identifier="+e._repr(this.identifier)+">"}}]),AppParameter}();_defineProperty(le,"classdoc","A parameter of a LivingApps application"),le.prototype._ul4onattrs=["id","app","identifier","description","value"],le.prototype._ul4attrs=e._makeset("id","app","identifier","description","value");for(var ie=0,se=[a,n,l,i,s,p,c,_,h,y,d,v,C,m,k,A,b,L,S,P,w,M,O,x,I,T,R,N,D,U,j,H,G,B,E,V,W,J,K,Y,z,$,X,Z,ee,te,re,oe,ae,ne,le];ie<se.length;ie++){var pe=se[ie];e.register("de.livinglogic.livingapi."+pe.name.toLowerCase(),pe)}export{l as App,T as AppLookupChoiceControl,O as AppLookupControl,I as AppLookupRadioControl,x as AppLookupSelectControl,le as AppParameter,Q as Attachment,r as Base,c as BoolControl,W as ButtonControl,ae as Category,u as Control,s as DataSourceData,A as DateControl,b as DatetimeMinuteControl,L as DatetimeSecondControl,d as EmailControl,J as Field,z as File,ee as FileAttachment,V as FileControl,q as FileSignatureControl,n as FlashMessage,$ as Geo,E as GeoControl,a as Globals,g as HTMLControl,o as Handler,te as ImageAttachment,oe as Installation,_ as IntControl,re as JSONAttachment,ne as KeyView,M as LookupChoiceControl,S as LookupControl,K as LookupItem,w as LookupRadioControl,P as LookupSelectControl,G as MultipleAppLookupCheckboxControl,B as MultipleAppLookupChoiceControl,j as MultipleAppLookupControl,H as MultipleAppLookupSelectControl,D as MultipleLookupCheckboxControl,U as MultipleLookupChoiceControl,R as MultipleLookupControl,N as MultipleLookupSelectControl,X as NoteAttachment,h as NumberControl,m as PasswordControl,p as Record,f as StringControl,C as TelControl,k as TextAreaControl,y as TextControl,Z as URLAttachment,v as URLControl,Y as User,i as View,t as version};
//# sourceMappingURL=livingapi.js.map
