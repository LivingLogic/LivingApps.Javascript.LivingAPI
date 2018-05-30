import { AxiosResponse } from "axios";

export interface Base {
	create: (...args: any[]) => any;
	ul4ondump: (encoder: any) => any;
	ul4onload: (decoder: any) => any;
}

export interface Globals extends Base {
	/** distance between two geo coordinates */
	geodist: (geo1: any, geo2: any) => any;
}

export interface FlashMessage extends Base {

}

export interface App extends Base {
	insert: (values: any) => Record;
}

export interface View extends Base {

}

export interface DataSource extends Base {

}

export interface Record extends Base {
	update: (values: any) => Record;
	delete: () => AxiosResponse;
}

export interface Control extends Base {
	asjson:(...any: any[]) => any;
	ul4onload: (...any: any[]) => any;

}

export interface BoolControl extends Control {
	search: (value: any, search: null | boolean) => boolean;
}

export interface IntControl extends Control {
	search: (value: any, search: null | number) => boolean;
}

export interface NumberControl extends Control {
	search: (value: any, search: null | number) => boolean;
}

export interface StringControl extends Control {
	asjson:(...any: any[]) => any;
	search: (value: any, search: null | string) => boolean;
}

export interface TextControl extends StringControl {

}

export interface EmailControl extends StringControl {

}

export interface TelControl extends StringControl {

}

export interface PasswordControl extends StringControl {

}

export interface TextAreaControl extends StringControl {

}

export interface DateControl extends Control {
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

}

export interface LookupRadioControl extends LookupControl {
	
}

export interface LookupChoiceControl extends LookupControl {
	
}

export interface AppLookupControl extends Control {

}