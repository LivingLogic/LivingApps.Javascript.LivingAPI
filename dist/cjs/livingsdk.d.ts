export declare type Auth_Token = string;
export declare type LivingApi = any;
export declare type LAPIRecord = any;
export interface LivingAPIOptions {
    url: string;
    loginRequired: boolean;
}
export default class LivingSDK {
    private _password;
    private _userName;
    private _options;
    private hostName;
    private session;
    constructor(options: any, username: string, password: string);
    login(): Promise<Auth_Token | undefined>;
    get(appId: string, templateName: string): Promise<LivingApi>;
    _insert(app: any, values: any): Promise<LAPIRecord>;
    _update(record: LAPIRecord, values: any): Promise<any>;
    _delete(record: LAPIRecord): Promise<any>;
}
