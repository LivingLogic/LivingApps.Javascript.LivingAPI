import axios, { AxiosResponse } from 'axios';
///@ts-ignore
import livingApi from './modules/livingapi';
///@ts-ignore
import { ul4, ul4on } from './modules/ul4';
import * as https from 'https';

export type Auth_Token = string;
export type LivingApi = any;
export type LAPIRecord = any;
let commonjs = (typeof module === 'object' && module.exports);
export interface LivingSDKOptions {
	url?: string;
	loginRequired?: boolean;
}

export class LivingSDK {
	private _password: string;
	private _userName: string;
	private _options: LivingSDKOptions
	private hostName: string;
	private session: Promise<string | undefined>;
	constructor(options: LivingSDKOptions = {}, username?: string, password?: string) {
		/** @type {String} */
		this._password = password || '';
		/** @type {String} */
		this._userName = username || '';
		/** @type {Object} */
		this._options = {
			/** @type {String} */
			url: options.url || 'https://my.living-apps.de',
			/** @type {Boolean} */
			loginRequired: options.loginRequired !== undefined ? options.loginRequired : true
		};
		this._options.url = this._options.url.lastIndexOf('/') === this._options.url.length - 1 ? this._options.url : `${this._options.url}/`;
		this.hostName = this._options.url.split('//')[1].substr(0, this._options.url.split('//')[1].length - 1);
		if (this._options.loginRequired && !this._userName) {
			throw new Error('[LivingSDK] You want to login without a username')
		}
		this.session = this.login();
	}

	/**
	 * get token for Session
	 * @return {Promise.<String>}
	 */
	login(): Promise<Auth_Token | undefined> {
		if (!this._options.loginRequired) {
			return Promise.resolve(undefined);
		}
		let url = `https://${this.hostName}/gateway/login`;
		return axios.post(url, {
			username: this._userName,
			password: this._password
		}, {
				httpsAgent: commonjs ? new https.Agent({
					ecdhCurve: 'auto'
				}) : undefined,
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then((a: any) => a.data.auth_token);
	}

	get(appId: string, templateName?: string): Promise<LivingApi> {
		return this.session.then((auth_token: Auth_Token | undefined) => {
			return axios.get(`https://${this.hostName}/gateway/apps/${appId}${templateName !== undefined ? '?template=' + templateName : ''}`,
				{
					httpsAgent: commonjs ? new https.Agent({
						ecdhCurve: 'auto'
					}) : undefined,
					headers: {
						'X-La-Auth-Token': auth_token !== undefined ? auth_token : '',
						Accept: 'application/la-ul4on'
					}
				})
				.then((res: AxiosResponse) => {
					let dump: any;
					dump = ul4on.loads(res.data);
					dump.get('globals').Login = this;
					return <LivingApi>dump;
				});
		});
	}

	_insert(app: any, values: any): Promise<LAPIRecord> {
		return this.session.then((auth_token) => {

			let fields: any = {};

			for (let ident in values) {
				if (!app.controls.has(ident)) {
					throw new Error(`insert() got an unexpected keyword argument ${ident}`);
				}

				fields[ident] = app.controls.get(ident).asjson(values[ident]);
			}
			let data: any = {}; {
			}
			data.id = app.id; 
			data.data = [{ 'fields': fields }];
			return axios.post(`https://${this.hostName}/gateway/v1/appdd/${app.id}.json`, {
				appdd: data
			}, {
					httpsAgent: commonjs ? new https.Agent({
						ecdhCurve: 'auto'
					}) : undefined,
					headers: {
						'X-La-Auth-Token': auth_token !== undefined ? auth_token : '',
					}
				})
				.then((res: AxiosResponse) => {
					return {
						HTTPstatusCode: res.status,
						recordid: res.data.id,
						Record: livingApi.Record.create({
							id: res.data.id,
							createdat: new Date(Date.now()),
							updatedat: null,
							updatedby: null,
							updatecount: 0
						})
					};
				})
		})

	}

	_update(record: LAPIRecord, values: any) {
		return this.session.then((auth_token: Auth_Token | undefined) => {
			let fields: any = {};
			let app = record.app;
			for (let ident in values) {
				if (!app.controls.has(ident)) {
					throw new Error(`update() got an unexpected keyword argument ${ident}`);
				}
				fields[ident] = values[ident];
			}
			let data: any = {};
			data.id = app.id;
			data.data = [{ 'id': record.id, 'fields': fields }];
			console.log(`https://${this.hostName}/gateway/v1/appdd/${app.id}.json`);
			return axios.post(`https://${this.hostName}/gateway/v1/appdd/${app.id}.json`, {
				appdd: data
			}, {
					httpsAgent: commonjs ? new https.Agent({
						ecdhCurve: 'auto'
					}) : undefined,
					headers: {
						'X-La-Auth-Token': auth_token !== undefined ? auth_token : '',
						'Content-Type': 'application/json'
					}
				})
				.then((res: AxiosResponse) => {
					let body = res.data;
					for (let ident in values)
						record.fields.get(ident).value = values[ident];
					let returnObj = {
						HTTPstatusCode: res.status,
						recordid: body.id,
						Record: record
					};
					return returnObj;
				});
		});
	}

	_delete(record: LAPIRecord) {
		let app = record.app;
		return this.session.then((auth_token: Auth_Token | undefined) => {
			return axios.delete(`https://${this.hostName}/gateway/v1/appdd/${app.id}/${record.id}.json`, {
				httpsAgent: commonjs ? new https.Agent({
					ecdhCurve: 'auto'
				}) : undefined,
				headers: {
					'X-La-Auth-Token': auth_token !== undefined ? auth_token : '',
				}
		
			})
		})
	}
}
	
export default LivingSDK;