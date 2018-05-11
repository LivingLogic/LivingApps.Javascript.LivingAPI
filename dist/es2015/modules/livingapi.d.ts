import { LOADIPHLPAPI } from "dns";

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
	
}

export interface Control extends Base {
	asjons:(...gitany: any[]) => any;
}