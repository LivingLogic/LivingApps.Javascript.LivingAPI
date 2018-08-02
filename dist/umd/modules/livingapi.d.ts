import { AxiosResponse } from "axios";

export interface Base {
	create: (...args: any[]) => any;
	ul4ondump: (encoder: any) => any;
	ul4onload: (decoder: any) => any;
	_dumpUL4ONAttr: (name: string) => any;
	_loadUL4ONAttr: (name: string, value: any) => void;
	_setDefaultUL4ONAttr: (name: string) => void;
}

export interface Globals extends Base {
	version: string;
	platform: string;
	user: User;
	maxdbaction: number;
	maxtemplateruntime: number;
	flashmessages: FlashMessage[];
	/** distance between two geo coordinates */
	geodist: (geo1: any, geo2: any) => any;
	__repr__: () => string;
}

export interface FlashMessage extends Base {
	timestamp: Date;
	type: string;
	title: string;
	message: string | null;
	__repr__: () => string;
}

export interface App extends Base {
	id: string;
	globals: Globals;
	name: string;
	description: string;
	language: string;
	startlink: string;
	iconlarge: File;
	iconsmall: File;
	owner: User;
	controls: Map<string, Control>;
	records: Map<string, Record>;
	recordcount: number;
	installation: Installation;
	categories: Category[];
	params: Map<string, AppParameter>;
	views: Map<string, View>;
	datamanagement_identifier: string;
	insert: (values: any) => Record;
	__repr__: () => string;
}

export interface View extends Base {
	id: string;
	name: string; 
	app: App;
	order: number;
	width: number;
	height: number;
	start: Date;
	end: Date;
	__repr__: () => string;
}

export interface DataSource extends Base {
	id: string;
	identifier: string;
	app: App;
	apps: Map<string, App>;
	__repr__: () => string;
	search: (search: any) => boolean;
	_dumpUL4ONAttr: (name: string) => any;
	_loadUL4ONAttr: (name: string, value: any) => void;
}

export interface Record extends Base {
	id: string;
	app: App;
	createdat: Date;
	createdby: User;
	updatedat: Date;
	updateby: User;
	updatecount: number;
	values: Map<string, any>;
	attachments: Map<string, Attachment>;
	children: Map<string, Map<string, Record>>
	update: (values: any) => Record;
	delete: () => AxiosResponse;
	__repr__: () => string;

}

export interface Control extends Base {
	id: string;
	identifier: string;
	type: string;
	subtype: string;
	field: Field;
	default: any;
	app: App;
	label: string;
	priority: boolean;
	order: number;
	asjson:(...any: any[]) => any;
	ul4onload: (...any: any[]) => any;
	__repr__: () => string;
	search: (value: any, search: null | any) => boolean;
}

export interface BoolControl extends Control {
	__type__: string;
	search: (value: any, search: null | boolean) => boolean;
}

export interface IntControl extends Control {
	__type__: string;
	search: (value: any, search: null | number) => boolean;
}

export interface NumberControl extends Control {
	__type__: string;
	search: (value: any, search: null | number) => boolean;
}

export interface StringControl extends Control {
	asjson:(...any: any[]) => any;
	search: (value: any, search: null | string) => boolean;
}

export interface TextControl extends StringControl {
	__type__: string;
}

export interface EmailControl extends StringControl {
	__type__: string;
}

export interface URLControl extends StringControl {
	__type__: string;
}

export interface TelControl extends StringControl {

}

export interface PasswordControl extends StringControl {

}

export interface TextAreaControl extends StringControl {
	__type__: string;
}

export interface DateControl extends Control {
	__type__: string;
	asjson: (...any: any[]) => any;
	formatString: (language: string) => string;
	search: (value: any, search: null | Date | string) => boolean;
}

export interface DatetimeMinuteControl extends DateControl {
	formatString: (language: string) => string;
}

export interface DatetimeSecondControl extends DateControl {
	formatString: (language: string) => string;
}

export interface LookupControl extends Control {
	ul4onload: (decoder: any) => any;
	search: (value: any, search: any) => boolean;
}

export interface LookupSelectControl extends LookupControl {
	__type__:string;
}

export interface LookupRadioControl extends LookupControl {
	__type__:string;
}

export interface LookupChoiceControl extends LookupControl {
	__type__:string;
}

export interface AppLookupControl extends Control {
	ul4onload: (decoder: any) => void;
	ul4onattr: () => string[];
	search: ( value: any, serach: any) => boolean; 
}

export interface AppLookupSelectControl extends AppLookupControl {

}

export interface AppLookupRadioControl extends AppLookupControl {

}

export interface AppLookupChoiceControl extends AppLookupControl {

}

export interface MultipleLookupControl extends LookupControl {

}

export interface MultipleLookupSelectControl extends MultipleLookupControl {

}

export interface MultipleLookupCheckboxControl extends MultipleLookupControl {

}

export interface MultipleAppLookupControl extends AppLookupControl {

}

export interface MultipleAppLookupSelectControl extends  MultipleAppLookupControl {

}

export interface MultipleAppLookupCheckboxControl extends MultipleAppLookupControl{

}

export interface GeoControl extends Control {
	asjson: ( value: any ) => any;
}

export interface FileControl extends Control {

}

export interface ButtonControl extends Control {

}

export interface Field extends Base {
	create: (control, record, value) => Field;
	search: (searchvalue) =>  boolean;
	__repr__: () => string;
}

export interface LookupItem extends Base {

}

export interface User extends Base {

}

export interface File extends Base {

}

export interface Geo extends Base {

}

export interface Attachment extends Base {

}

export interface NoteAttachment extends Attachment {

}

export interface URLAttachment extends Attachment {

}

export interface FileAttachment extends Attachment {

}

export interface ImageAttachment extends Attachment {

}

export interface JSONAttachment extends Attachment {

}

export interface Installation extends Base {

}

export interface Category extends Base {

}

export interface KeyView extends Base {

}

export interface AppParameter extends Base {

}

