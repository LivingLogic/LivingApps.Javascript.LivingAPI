import*as t from"@livinglogic/ul4";import{_makeset as e,expose as r,register as o,AttributeError as n,Proto as a,_repr as l,_ismap as i,ArgumentError as u,_isobject as s,TypeError as p,_bool as c,_havemap as _,_format as h,_islist as y,_ne as f,_asjson as d,_fromjson as C}from"@livinglogic/ul4";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function _createSuper(t){return function(){var e,r=_getPrototypeOf(t);if(function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()){var o=_getPrototypeOf(this).constructor;e=Reflect.construct(r,arguments,o)}else e=r.apply(this,arguments);return _possibleConstructorReturn(this,e)}}function _get(t,e,r){return(_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function _get(t,e,r){var o=function _superPropBase(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=_getPrototypeOf(t)););return t}(t,e);if(o){var n=Object.getOwnPropertyDescriptor(o,e);return n.get?n.get.call(r):n.value}})(t,e,r||t)}function _slicedToArray(t,e){return function _arrayWithHoles(t){if(Array.isArray(t))return t}(t)||function _iterableToArrayLimit(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var r=[],o=!0,n=!1,a=void 0;try{for(var l,i=t[Symbol.iterator]();!(o=(l=i.next()).done)&&(r.push(l.value),!e||r.length!==e);o=!0);}catch(t){n=!0,a=t}finally{try{o||null==i.return||i.return()}finally{if(n)throw a}}return r}(t,e)||_unsupportedIterableToArray(t,e)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _toConsumableArray(t){return function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}(t)||function _iterableToArray(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||_unsupportedIterableToArray(t)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,o=new Array(e);r<e;r++)o[r]=t[r];return o}function _createForOfIteratorHelper(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=_unsupportedIterableToArray(t))){var e=0,r=function(){};return{s:r,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,n,a=!0,l=!1;return{s:function(){o=t[Symbol.iterator]()},n:function(){var t=o.next();return a=t.done,t},e:function(t){l=!0,n=t},f:function(){try{a||null==o.return||o.return()}finally{if(l)throw n}}}}var v="0.11.1",m=function(t){_inherits(Base,a);var e=_createSuper(Base);function Base(){return _classCallCheck(this,Base),e.call(this)}return _createClass(Base,[{key:"ul4ondump",value:function ul4ondump(t){for(var e=0;e<this._ul4onattrs.length;++e)t.dump(this._dumpUL4ONAttr(this._ul4onattrs[e]))}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return this[t]}},{key:"ul4onload",value:function ul4onload(t){for(var e=0,r=t.loadcontent();;++e){var o=r.next();if(o.done)break;e<this._ul4onattrs.length&&this._loadUL4ONAttr(this._ul4onattrs[e],o.value)}for(;e<this._ul4onattrs.length;++e)this._setDefaultUL4ONAttr(this._ul4onattrs[e])}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,e){this[t]=e}},{key:"_setDefaultUL4ONAttr",value:function _setDefaultUL4ONAttr(t){this[t]=null}},{key:"__getattr__",value:function __getattr__(t){if(this._ul4attrs.has(t)){var e=this[t];if("function"==typeof e){var r=e.bind(this);return r._ul4_name=e._ul4_name||e.name,r._ul4_signature=e._ul4_signature,r._ul4_needsobject=e._ul4_needsobject,r._ul4_needscontext=e._ul4_needscontext,r}return e}throw new n(this,t)}},{key:"__repr__",value:function __repr__(){return"<"+this.constructor.name+">"}}]),Base}(),k=function(){function Handler(){_classCallCheck(this,Handler)}return _createClass(Handler,[{key:"save",value:function save(t){}},{key:"delete",value:function _delete(t){}}]),Handler}(),g=function(t){_inherits(Globals,m);var e=_createSuper(Globals);function Globals(){var t;return _classCallCheck(this,Globals),(t=e.call(this)).version=null,t.hostname=null,t.platform=null,t.user=null,t.lang=null,t.maxdbactions=null,t.maxtemplateruntime=null,t.flashmessages=null,t.handler=new k,t}return _createClass(Globals,[{key:"__repr__",value:function __repr__(){return"<Globals version="+l(this.version)+">"}}],[{key:"geodist",value:function geodist(t,e){var r=function sqsin(t){return(t=Math.sin(t))*t},o=function sqsos(t){return(t=Math.cos(t))*t},n=Math.PI/180,a=1/298.257223563,l=t.lat*n,i=t.long*n,u=e.lat*n,s=(l+u)/2,p=(l-u)/2,c=(i-e.long*n)/2,_=r(p)*o(c)+o(s)*r(c),h=o(p)*o(c)+r(s)*r(c),y=Math.atan(Math.sqrt(_/h)),f=2*y*6378.137,d=Math.sqrt(_*h)/y,C=(3*d+1)/(2*_);return f*(1+a*((3*d-1)/(2*h))*r(s)*o(p)-a*C*o(s)*r(p))}}]),Globals}();g.prototype._ul4onattrs=["version","platform","user","maxdbactions","maxtemplateruntime","flashmessages","lang","datasources","hostname"],g.prototype._ul4attrs=e("version","hostname","platform","user","lang","maxdbactions","maxtemplateruntime","flashmessages");var b=function(t){_inherits(FlashMessage,m);var e=_createSuper(FlashMessage);function FlashMessage(){return _classCallCheck(this,FlashMessage),e.apply(this,arguments)}return _createClass(FlashMessage,[{key:"__repr__",value:function __repr__(){return"<FlashMessage type="+l(this.type)+" title="+l(this.title)+">"}}]),FlashMessage}();b.prototype._ul4onattrs=["timestamp","type","title","message"],b.prototype._ul4attrs=e("timestamp","type","title","message");var A=function(t){_inherits(App,m);var e=_createSuper(App);function App(){return _classCallCheck(this,App),e.apply(this,arguments)}return _createClass(App,[{key:"__repr__",value:function __repr__(){return"<App id="+l(this.id)+" name="+l(this.name)+">"}},{key:"insert",value:function insert(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this.__call__(t);return this.globals.handler.save(this),e}},{key:"__call__",value:function __call__(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=new w(this);if(i(t)){var r,o=_createForOfIteratorHelper(t.entries());try{for(o.s();!(r=o.n()).done;){var n=_slicedToArray(r.value,2),a=n[0],c=n[1];if(!e.fields.has(a))throw new u("update() get an unexpected keyword argument "+l(a));e.fields.get(a).value=c}}catch(t){o.e(t)}finally{o.f()}}else{if(!s(t))throw new p("values must be an object or a Map");for(var _ in t){if(!e.fields.has(_))throw new u("update() get an unexpected keyword argument "+l(_));e.fields.get(_).value=t[_]}}return e}},{key:"__getattr__",value:function __getattr__(t){if(t.startsWith("c_")){if(!this.controls.has(t.substr(2)))throw new n(this,t);return this.controls.get(t.substr(2))}return _get(_getPrototypeOf(App.prototype),"__getattr__",this).call(this,t)}}]),App}();A.prototype._ul4onattrs=["id","globals","name","description","language","startlink","iconlarge","iconsmall","createdby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","basetable","primarykey","insertprocedure","updateprocedure","deleteprocedure","templates","createdat","updatedat","updatedby"],A.prototype._ul4attrs=e("id","globals","name","description","language","startlink","iconlarge","iconsmall","createdat","createdby","updatedat","updatedby","controls","records","recordcount","installation","categories","params","views","datamanagement_identifier","insert"),r(A.prototype.__call__,["**values"],{needsobject:!0}),r(A.prototype.insert,["**values"],{needsobject:!0});var L=function(t){_inherits(View,m);var e=_createSuper(View);function View(){return _classCallCheck(this,View),e.apply(this,arguments)}return _createClass(View,[{key:"__repr__",value:function __repr__(){return"<View id="+l(this.id)+" name="+l(this.name)+">"}}]),View}();L.prototype._ul4onattrs=["id","name","app","order","width","height","start","end"],L.prototype._ul4attrs=e("id","name","app","order","width","height","start","end");var S=function(t){_inherits(DataSourceData,m);var e=_createSuper(DataSourceData);function DataSourceData(){return _classCallCheck(this,DataSourceData),e.apply(this,arguments)}return _createClass(DataSourceData,[{key:"__repr__",value:function __repr__(){return"<DataSource.Data id="+l(this.id)+" identifier="+l(this.identifier)+">"}}]),DataSourceData}();S.prototype._ul4onattrs=["id","identifier","app","apps"],S.prototype._ul4attrs=e("id","identifier","app","apps");var w=function(t){_inherits(Record,m);var e=_createSuper(Record);function Record(t){var r;return _classCallCheck(this,Record),(r=e.call(this)).id=null,r.app=t,r.createdat=null,r.createdby=null,r.updatedat=null,r.updatedby=null,r.updatecount=0,r._sparsevalues=new Map,r._values=null,r._fields=null,r.children=new Map,r.attachments=null,r.errors=[],r._is_deleted=!1,r}return _createClass(Record,[{key:"__repr__",value:function __repr__(){var t,e=["<Record id=",l(this.id)],r=_createForOfIteratorHelper(this.fields.values());try{for(r.s();!(t=r.n()).done;){var o=t.value;o.control.priority&&(e.push(" v_"),e.push(o.control.identifier),e.push("="),e.push(l(o.value)))}}catch(t){r.e(t)}finally{r.f()}return e.push(">"),e.join("")}},{key:"is_dirty",value:function is_dirty(){if(null===this.id)return!0;var t,e=_createForOfIteratorHelper(this.fields.values());try{for(e.s();!(t=e.n()).done;){if(t.value.is_dirty())return!0}}catch(t){e.e(t)}finally{e.f()}return!1}},{key:"has_errors",value:function has_errors(){if(0!==this.errors.length)return!0;var t,e=_createForOfIteratorHelper(this.fields.values());try{for(e.s();!(t=e.n()).done;){if(t.value.has_errors())return!0}}catch(t){e.e(t)}finally{e.f()}return!1}},{key:"delete",value:function _delete(){return this.app.globals.handler.delete(this)}},{key:"save",value:function save(){this.app.globals.handler.save(this)}},{key:"update",value:function update(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(i(t)){var e,r=_createForOfIteratorHelper(t.entries());try{for(r.s();!(e=r.n()).done;){var o=_slicedToArray(e.value,2),n=o[0],a=o[1];if(!this.fields.has(n))throw new u("update() get an unexpected keyword argument "+l(n));fields.get(n).value=a}}catch(t){r.e(t)}finally{r.f()}}else{if(!s(t))throw new p("values must be an object or a Map");for(var c in t){if(!this.fields.has(c))throw new u("update() get an unexpected keyword argument "+l(c));record.fields.get(c).value=t[c]}}this.app.globals.handler.save(this)}},{key:"search",value:function search(t){for(var e in t){var r=t[e];if(c(r)&&!this.fields.get(e).search(r))return!1}return!0}},{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return"values"===t?this._sparsevalues:this[t]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,e){"values"===t?(this._sparsevalues=e,this._values=null,this._fields=null):this[t]=e}},{key:"__getattr__",value:function __getattr__(t){return t.startsWith("c_")?this.children.get(t.substr(2)):t.startsWith("f_")?this.fields.get(t.substr(2)):t.startsWith("v_")?this.values.get(t.substr(2)):this[t]}},{key:"__setattr__",value:function __setattr__(t,e){if(t.startsWith("c_"))this.children[t.substr(2)]=e;else{if(!t.startsWith("v_"))throw new n(this,t);this.fields.get(t.substr(2)).value=e}}},{key:"values",get:function get(){if(null===this._values){this._values=_?new Map:{};var t,e=_createForOfIteratorHelper(this.app.controls.entries());try{for(e.s();!(t=e.n()).done;){var r=_slicedToArray(t.value,2),o=r[0],n=(r[1],this._sparsevalues.get(o));void 0===n&&(n=null),this._values.set(o,n)}}catch(t){e.e(t)}finally{e.f()}}return this._values}},{key:"fields",get:function get(){if(null===this._fields){this._fields=_?new Map:{};var t,e=_createForOfIteratorHelper(this.values.entries());try{for(e.s();!(t=e.n()).done;){var r=_slicedToArray(t.value,2),o=r[0],n=r[1],a=new lt(this.app.controls.get(o),this,n);this._fields.set(o,a)}}catch(t){e.e(t)}finally{e.f()}}return this._fields}}]),Record}();w.prototype._ul4onattrs=["id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"],w.prototype._ul4attrs=e("id","app","createdat","createdby","updatedat","updatedby","updatecount","values","attachments","children"),r(w.prototype.is_dirty,[]),r(w.prototype.has_errors,[]),r(w.prototype.delete,[]),r(w.prototype.save,[]),r(w.prototype.update,["**values"],{needsobject:!0});var M=function(t){_inherits(Control,m);var e=_createSuper(Control);function Control(){return _classCallCheck(this,Control),e.apply(this,arguments)}return _createClass(Control,[{key:"__repr__",value:function __repr__(){return"<"+this.__type__+" id="+l(this.id)+" identifier="+l(this.identifier)+">"}},{key:"_logsearch",value:function _logsearch(t,e){}},{key:"search",value:function search(t,e){return!1}}]),Control}();M.prototype.type=null,M.prototype.subtype=null,M.prototype._ul4onattrs=["id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure"],M.prototype._ul4attrs=e("id","identifier","field","app","label","priority","order","default","ininsertprocedure","inupdateprocedure");var O=function(t){_inherits(BoolControl,M);var e=_createSuper(BoolControl);function BoolControl(){return _classCallCheck(this,BoolControl),e.apply(this,arguments)}return _createClass(BoolControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator&&e.value===t}}]),BoolControl}();O.prototype.type="bool";var I=function(t){_inherits(IntControl,M);var e=_createSuper(IntControl);function IntControl(){return _classCallCheck(this,IntControl),e.apply(this,arguments)}return _createClass(IntControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator&&e.value===t}}]),IntControl}();I.prototype.type="int";var x=function(t){_inherits(NumberControl,M);var e=_createSuper(NumberControl);function NumberControl(){return _classCallCheck(this,NumberControl),e.apply(this,arguments)}return _createClass(NumberControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator?e.value===t:"range"===e.operator&&(null!==t&&((null===e.minvalue||e.minvalue<=t)&&(null===e.maxvalue||t<e.maxvalue)))}}]),NumberControl}();x.prototype.type="number";var F=function(t){_inherits(StringControl,M);var e=_createSuper(StringControl);function StringControl(){return _classCallCheck(this,StringControl),e.apply(this,arguments)}return _createClass(StringControl,[{key:"search",value:function search(t,e){return this._logsearch(t,e),"equals"===e.operator?e.value===t:"contains"===e.operator?null===e.value||null===t?e.value===t:t.toLowerCase().indexOf(e.value.toLowerCase())>=0:void 0}}]),StringControl}();F.prototype.type="string";var R=function(t){_inherits(TextControl,F);var e=_createSuper(TextControl);function TextControl(){return _classCallCheck(this,TextControl),e.apply(this,arguments)}return TextControl}();R.prototype.subtype="text";var D=function(t){_inherits(EmailControl,F);var e=_createSuper(EmailControl);function EmailControl(){return _classCallCheck(this,EmailControl),e.apply(this,arguments)}return EmailControl}();D.prototype.subtype="email";var T=function(t){_inherits(URLControl,F);var e=_createSuper(URLControl);function URLControl(){return _classCallCheck(this,URLControl),e.apply(this,arguments)}return URLControl}();T.prototype.subtype="url";var N=function(t){_inherits(TelControl,F);var e=_createSuper(TelControl);function TelControl(){return _classCallCheck(this,TelControl),e.apply(this,arguments)}return TelControl}();N.prototype.subtype="tel";var P=function(t){_inherits(PasswordControl,F);var e=_createSuper(PasswordControl);function PasswordControl(){return _classCallCheck(this,PasswordControl),e.apply(this,arguments)}return PasswordControl}();P.prototype.subtype="password";var U=function(t){_inherits(TextAreaControl,F);var e=_createSuper(TextAreaControl);function TextAreaControl(){return _classCallCheck(this,TextAreaControl),e.apply(this,arguments)}return TextAreaControl}();U.prototype.subtype="textarea",U.prototype._ul4onattrs=F.prototype._ul4onattrs.concat(["encrypted"]),U.prototype._ul4attrs=e.apply(t,_toConsumableArray(F.prototype._ul4attrs).concat(["encrypted"]));var j=function(t){_inherits(DateControl,M);var e=_createSuper(DateControl);function DateControl(){return _classCallCheck(this,DateControl),e.apply(this,arguments)}return _createClass(DateControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y":"%m/%d/%Y"}},{key:"search",value:function search(t,e){this._logsearch(t,e);var r=e.value;return"[object Date]"==Object.prototype.toString.call(r)&&(r=h(r,this.formatstring(),this.app.language)),null!==t&&(t=h(t,this.formatstring(),this.app.language)),"equals"===e.operator?r===t:"contains"===e.operator&&(null===r||null===t?r===t:t.toLowerCase().indexOf(r.toLowerCase())>=0)}}]),DateControl}();j.prototype.type="date",j.prototype.subtype="date";var H=function(t){_inherits(DatetimeMinuteControl,j);var e=_createSuper(DatetimeMinuteControl);function DatetimeMinuteControl(){return _classCallCheck(this,DatetimeMinuteControl),e.apply(this,arguments)}return _createClass(DatetimeMinuteControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y %H:%M":"%m/%d/%Y %H:%M"}}]),DatetimeMinuteControl}();H.prototype.subtype="datetimeminute";var G=function(t){_inherits(DatetimeSecondControl,j);var e=_createSuper(DatetimeSecondControl);function DatetimeSecondControl(){return _classCallCheck(this,DatetimeSecondControl),e.apply(this,arguments)}return _createClass(DatetimeSecondControl,[{key:"formatstring",value:function formatstring(t){return"de"===(t=t||this.app.language)?"%d.%m.%Y %H:%M:%S":"%m/%d/%Y %H:%M:%S"}}]),DatetimeSecondControl}();G.prototype.subtype="datetimesecond";var B=function(t){_inherits(LookupControl,M);var e=_createSuper(LookupControl);function LookupControl(){return _classCallCheck(this,LookupControl),e.apply(this,arguments)}return _createClass(LookupControl,[{key:"search",value:function search(t,e){return"equals"===e.operator&&(null===t?null===e.value:t.key===e.value)}}]),LookupControl}();B.prototype.type="lookup",B.prototype._ul4onattrs=M.prototype._ul4onattrs.concat(["lookupdata"]),B.prototype._ul4attrs=e.apply(t,_toConsumableArray(M.prototype._ul4attrs).concat(["lookupdata"]));var V=function(t){_inherits(LookupSelectControl,B);var e=_createSuper(LookupSelectControl);function LookupSelectControl(){return _classCallCheck(this,LookupSelectControl),e.apply(this,arguments)}return LookupSelectControl}();V.prototype.subtype="select";var q=function(t){_inherits(LookupRadioControl,B);var e=_createSuper(LookupRadioControl);function LookupRadioControl(){return _classCallCheck(this,LookupRadioControl),e.apply(this,arguments)}return LookupRadioControl}();q.prototype.subtype="radio";var E=function(t){_inherits(LookupChoiceControl,B);var e=_createSuper(LookupChoiceControl);function LookupChoiceControl(){return _classCallCheck(this,LookupChoiceControl),e.apply(this,arguments)}return LookupChoiceControl}();E.prototype.subtype="choice";var W=function(t){_inherits(AppLookupControl,M);var e=_createSuper(AppLookupControl);function AppLookupControl(){return _classCallCheck(this,AppLookupControl),e.apply(this,arguments)}return _createClass(AppLookupControl,[{key:"search",value:function search(t,e){return null===t||null===e.value?t===e.value:t.search(e)}}]),AppLookupControl}();W.prototype.type="applookup",W.prototype._ul4onattrs=M.prototype._ul4onattrs.concat(["lookupapp","lookupcontrols"]),W.prototype._ul4attrs=e.apply(t,_toConsumableArray(M.prototype._ul4attrs).concat(["lookupapp","lookupcontrols"]));var K=function(t){_inherits(AppLookupSelectControl,W);var e=_createSuper(AppLookupSelectControl);function AppLookupSelectControl(){return _classCallCheck(this,AppLookupSelectControl),e.apply(this,arguments)}return AppLookupSelectControl}();K.prototype.subtype="select";var J=function(t){_inherits(AppLookupRadioControl,W);var e=_createSuper(AppLookupRadioControl);function AppLookupRadioControl(){return _classCallCheck(this,AppLookupRadioControl),e.apply(this,arguments)}return AppLookupRadioControl}();J.prototype.subtype="radio";var Y=function(t){_inherits(AppLookupChoiceControl,W);var e=_createSuper(AppLookupChoiceControl);function AppLookupChoiceControl(){return _classCallCheck(this,AppLookupChoiceControl),e.apply(this,arguments)}return AppLookupChoiceControl}();Y.prototype.subtype="choice";var z=function(t){_inherits(MultipleLookupControl,B);var e=_createSuper(MultipleLookupControl);function MultipleLookupControl(){return _classCallCheck(this,MultipleLookupControl),e.apply(this,arguments)}return _createClass(MultipleLookupControl,[{key:"search",value:function search(t,e){if("equals"===e.operator){var r,o=_createForOfIteratorHelper(t);try{for(o.s();!(r=o.n()).done;){if(r.value.key===e.value)return!0}}catch(t){o.e(t)}finally{o.f()}return!1}return!1}}]),MultipleLookupControl}();z.prototype.subtype="multiplelookup";var $=function(t){_inherits(MultipleLookupSelectControl,z);var e=_createSuper(MultipleLookupSelectControl);function MultipleLookupSelectControl(){return _classCallCheck(this,MultipleLookupSelectControl),e.apply(this,arguments)}return MultipleLookupSelectControl}();$.prototype.subtype="select";var Q=function(t){_inherits(MultipleLookupCheckboxControl,z);var e=_createSuper(MultipleLookupCheckboxControl);function MultipleLookupCheckboxControl(){return _classCallCheck(this,MultipleLookupCheckboxControl),e.apply(this,arguments)}return MultipleLookupCheckboxControl}();Q.prototype.subtype="checkbox";var X=function(t){_inherits(MultipleLookupChoiceControl,z);var e=_createSuper(MultipleLookupChoiceControl);function MultipleLookupChoiceControl(){return _classCallCheck(this,MultipleLookupChoiceControl),e.apply(this,arguments)}return MultipleLookupChoiceControl}();X.prototype.subtype="choice";var Z=function(t){_inherits(MultipleAppLookupControl,W);var e=_createSuper(MultipleAppLookupControl);function MultipleAppLookupControl(){return _classCallCheck(this,MultipleAppLookupControl),e.apply(this,arguments)}return _createClass(MultipleAppLookupControl,[{key:"search",value:function search(t,e){if("equals"===e.operator){if(null===e.value)return 0===t.length;var r,o=_createForOfIteratorHelper(t);try{for(o.s();!(r=o.n()).done;){if(r.value.search(e.value))return!0}}catch(t){o.e(t)}finally{o.f()}return!1}return!1}}]),MultipleAppLookupControl}();Z.prototype.type="multipleapplookup";var tt=function(t){_inherits(MultipleAppLookupSelectControl,Z);var e=_createSuper(MultipleAppLookupSelectControl);function MultipleAppLookupSelectControl(){return _classCallCheck(this,MultipleAppLookupSelectControl),e.apply(this,arguments)}return MultipleAppLookupSelectControl}();tt.prototype.subtype="select";var et=function(t){_inherits(MultipleAppLookupCheckboxControl,Z);var e=_createSuper(MultipleAppLookupCheckboxControl);function MultipleAppLookupCheckboxControl(){return _classCallCheck(this,MultipleAppLookupCheckboxControl),e.apply(this,arguments)}return MultipleAppLookupCheckboxControl}();et.prototype.subtype="checkbox";var rt=function(t){_inherits(MultipleAppLookupChoiceControl,Z);var e=_createSuper(MultipleAppLookupChoiceControl);function MultipleAppLookupChoiceControl(){return _classCallCheck(this,MultipleAppLookupChoiceControl),e.apply(this,arguments)}return MultipleAppLookupChoiceControl}();rt.prototype.subtype="choice";var ot=function(t){_inherits(GeoControl,M);var e=_createSuper(GeoControl);function GeoControl(){return _classCallCheck(this,GeoControl),e.apply(this,arguments)}return GeoControl}();ot.prototype.type="geo";var nt=function(t){_inherits(FileControl,M);var e=_createSuper(FileControl);function FileControl(){return _classCallCheck(this,FileControl),e.apply(this,arguments)}return FileControl}();nt.prototype.type="file";var at=function(t){_inherits(ButtonControl,M);var e=_createSuper(ButtonControl);function ButtonControl(){return _classCallCheck(this,ButtonControl),e.apply(this,arguments)}return ButtonControl}();at.prototype.type="button";var lt=function(t){_inherits(Field,m);var e=_createSuper(Field);function Field(t,r,o){var n;return _classCallCheck(this,Field),(n=e.call(this)).control=t,n.record=r,n._value=o,n._dirty=!1,n.errors=[],n}return _createClass(Field,[{key:"is_empty",value:function is_empty(){return null===this._value||y(this._value)&&0===this._value.length}},{key:"is_dirty",value:function is_dirty(){return this._dirty}},{key:"has_errors",value:function has_errors(){return 0!==this.errors.length}},{key:"search",value:function search(t){return this.control.search(this.value,t)}},{key:"__repr__",value:function __repr__(){var t="<Field identifier=";return t+=l(this.control.identifier),this._dirty&&(t+=" is_dirty()=True"),0!==this.errors.length&&(t+=" has_errors()=True"),t+=">"}},{key:"value",get:function get(){return this._value},set:function set(t){var e=this._value;f(e,t)&&(this.record.values.set(this.control.identifier,t),this._value=t,this._dirty=!0)}}]),Field}(),it=function(t){_inherits(LookupItem,m);var e=_createSuper(LookupItem);function LookupItem(){return _classCallCheck(this,LookupItem),e.apply(this,arguments)}return _createClass(LookupItem,[{key:"__repr__",value:function __repr__(){return"<LookupItem key="+l(this.key)+" label="+l(this.label)+">"}}]),LookupItem}();it.prototype._ul4onattrs=["key","label"],it.prototype._ul4attrs=e("key","label");var ut=function(t){_inherits(User,m);var e=_createSuper(User);function User(){return _classCallCheck(this,User),e.apply(this,arguments)}return _createClass(User,[{key:"__repr__",value:function __repr__(){return"<User id="+l(this.id)+" firstname="+l(this.firstname)+" surname="+l(this.surname)+" email="+l(this.email)+">"}}]),User}();ut.prototype._ul4onattrs=["_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews"],ut.prototype._ul4attrs=e("_id","id","gender","firstname","surname","initials","email","language","avatarsmall","avatarlarge","keyviews");var st=function(t){_inherits(File,m);var e=_createSuper(File);function File(){return _classCallCheck(this,File),e.apply(this,arguments)}return _createClass(File,[{key:"__repr__",value:function __repr__(){return"<File id="+l(this.id)+" url="+l(this.url)+" filename="+l(this.filename)+">"}}]),File}();st.prototype._ul4onattrs=["id","url","filename","mimetype","width","height","internalid","createdat","size"],st.prototype._ul4attrs=e("id","url","filename","mimetype","width","height","size","createdat");var pt=function(t){_inherits(Geo,m);var e=_createSuper(Geo);function Geo(t,r,o){var n;return _classCallCheck(this,Geo),(n=e.call(this)).lat=t,n.long=r,n.info=o,n}return _createClass(Geo,[{key:"__repr__",value:function __repr__(){return"<Geo lat="+l(this.lat)+" long="+l(this.long)+" info="+l(this.info)+">"}}]),Geo}();pt.prototype._ul4onattrs=["lat","long","info"],pt.prototype._ul4attrs=e("lat","long","info");var ct=function(t){_inherits(Attachment,m);var e=_createSuper(Attachment);function Attachment(){return _classCallCheck(this,Attachment),e.apply(this,arguments)}return _createClass(Attachment,[{key:"__repr__",value:function __repr__(){return"<"+this.__type__+" id="+l(this.id)+" label="+l(this.label)+">"}}]),Attachment}();ct.prototype._ul4onattrs=["id","record","label","active"],ct.prototype._ul4attrs=e("id","record","label","active");var _t=function(t){_inherits(NoteAttachment,ct);var e=_createSuper(NoteAttachment);function NoteAttachment(){return _classCallCheck(this,NoteAttachment),e.apply(this,arguments)}return NoteAttachment}();_t.prototype.type="noteattachment",_t.prototype._ul4onattrs=ct.prototype._ul4onattrs.concat(["value"]),_t.prototype._ul4attrs=e.apply(t,_toConsumableArray(ct.prototype._ul4onattrs).concat(["value"]));var ht=function(t){_inherits(URLAttachment,ct);var e=_createSuper(URLAttachment);function URLAttachment(){return _classCallCheck(this,URLAttachment),e.apply(this,arguments)}return URLAttachment}();ht.prototype.type="urlattachment",ht.prototype._ul4onattrs=ct.prototype._ul4onattrs.concat(["value"]),ht.prototype._ul4attrs=e.apply(t,_toConsumableArray(ct.prototype._ul4onattrs).concat(["value"]));var yt=function(t){_inherits(FileAttachment,ct);var e=_createSuper(FileAttachment);function FileAttachment(){return _classCallCheck(this,FileAttachment),e.apply(this,arguments)}return FileAttachment}();yt.prototype.type="fileattachment",yt.prototype._ul4onattrs=ct.prototype._ul4onattrs.concat(["value"]),yt.prototype._ul4attrs=e.apply(t,_toConsumableArray(ct.prototype._ul4onattrs).concat(["value"]));var ft=function(t){_inherits(ImageAttachment,ct);var e=_createSuper(ImageAttachment);function ImageAttachment(){return _classCallCheck(this,ImageAttachment),e.apply(this,arguments)}return ImageAttachment}();ft.prototype.type="imageattachment",ft.prototype._ul4onattrs=ct.prototype._ul4onattrs.concat(["original","thumb","small","medium","large"]),ft.prototype._ul4attrs=e.apply(t,_toConsumableArray(ct.prototype._ul4onattrs).concat(["original","thumb","small","medium","large"]));var dt=function(t){_inherits(JSONAttachment,ct);var e=_createSuper(JSONAttachment);function JSONAttachment(){return _classCallCheck(this,JSONAttachment),e.apply(this,arguments)}return _createClass(JSONAttachment,[{key:"_dumpUL4ONAttr",value:function _dumpUL4ONAttr(t){return"value"===t?d(this.value):this[t]}},{key:"_loadUL4ONAttr",value:function _loadUL4ONAttr(t,e){"value"===t?this.value=C(e):this[t]=e}}]),JSONAttachment}();dt.prototype.type="jsonattachment",dt.prototype._ul4onattrs=ct.prototype._ul4onattrs.concat(["value"]),dt.prototype._ul4attrs=e.apply(t,_toConsumableArray(ct.prototype._ul4onattrs).concat(["value"]));var Ct=function(t){_inherits(Installation,m);var e=_createSuper(Installation);function Installation(){return _classCallCheck(this,Installation),e.apply(this,arguments)}return _createClass(Installation,[{key:"__repr__",value:function __repr__(){return"<Installation id="+l(this.id)+" name="+l(this.name)+">"}}]),Installation}();Ct.prototype._ul4onattrs=["id","name"],Ct.prototype._ul4attrs=e("id","name");var vt=function(t){_inherits(Category,m);var e=_createSuper(Category);function Category(){return _classCallCheck(this,Category),e.apply(this,arguments)}return _createClass(Category,[{key:"__repr__",value:function __repr__(){for(var t=[],e=this;null!==e;)t.splice(0,0,e.identifier),e=e.parent;return"<Category id="+l(this.id)+" identifierpath="+l(t.join("/"))+NaN+l(this.name)+">"}}]),Category}();vt.prototype._ul4onattrs=["id","identifier","name","order","parent","children","apps"],vt.prototype._ul4attrs=e("id","identifier","name","order","parent","children","apps");var mt=function(t){_inherits(KeyView,m);var e=_createSuper(KeyView);function KeyView(){return _classCallCheck(this,KeyView),e.apply(this,arguments)}return _createClass(KeyView,[{key:"__repr__",value:function __repr__(){return"<KeyView id="+l(this.id)+" identifier="+l(this.identifier)+">"}}]),KeyView}();mt.prototype._ul4onattrs=["id","identifier","name","key","user"],mt.prototype._ul4attrs=e("id","identifier","name","key","user");var kt=function(t){_inherits(AppParameter,m);var e=_createSuper(AppParameter);function AppParameter(){return _classCallCheck(this,AppParameter),e.apply(this,arguments)}return _createClass(AppParameter,[{key:"__repr__",value:function __repr__(){return"<AppParameter id="+l(this.id)+" identifier="+l(this.identifier)+">"}}]),AppParameter}();kt.prototype._ul4onattrs=["id","app","identifier","description","value"],kt.prototype._ul4attrs=e("id","app","identifier","description","value");for(var gt=0,bt=[g,b,A,L,S,w,O,I,x,R,D,T,N,P,U,j,H,G,B,V,q,E,W,K,J,Y,z,$,Q,X,Z,tt,et,rt,ot,nt,at,lt,it,ut,st,pt,_t,ht,yt,ft,dt,Ct,vt,mt,kt];gt<bt.length;gt++){var At=bt[gt];o("de.livinglogic.livingapi."+At.name.toLowerCase(),At)}export{A as App,Y as AppLookupChoiceControl,W as AppLookupControl,J as AppLookupRadioControl,K as AppLookupSelectControl,kt as AppParameter,ct as Attachment,m as Base,O as BoolControl,at as ButtonControl,vt as Category,M as Control,S as DataSourceData,j as DateControl,H as DatetimeMinuteControl,G as DatetimeSecondControl,D as EmailControl,lt as Field,st as File,yt as FileAttachment,nt as FileControl,b as FlashMessage,pt as Geo,ot as GeoControl,g as Globals,k as Handler,ft as ImageAttachment,Ct as Installation,I as IntControl,dt as JSONAttachment,mt as KeyView,E as LookupChoiceControl,B as LookupControl,it as LookupItem,q as LookupRadioControl,V as LookupSelectControl,et as MultipleAppLookupCheckboxControl,rt as MultipleAppLookupChoiceControl,Z as MultipleAppLookupControl,tt as MultipleAppLookupSelectControl,Q as MultipleLookupCheckboxControl,X as MultipleLookupChoiceControl,z as MultipleLookupControl,$ as MultipleLookupSelectControl,_t as NoteAttachment,x as NumberControl,P as PasswordControl,w as Record,F as StringControl,N as TelControl,U as TextAreaControl,R as TextControl,ht as URLAttachment,T as URLControl,ut as User,L as View,v as version};
//# sourceMappingURL=livingapi.js.map
