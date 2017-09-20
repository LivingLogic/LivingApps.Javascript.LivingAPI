let request = require('request');
let ul4on = require('./modules/livingapi').ul4on;
let livingAPI = require('./modules/livingapi');
/**
 * @class
 */
module.exports =  class {
	/**
	 *
	 * @param {URL | String} [url='https://my.living-apps.de']
	 * @param {String} [username=undefind]
	 * @param {String} [password=undefined]
	 */
	constructor(url='https://my.living-apps.de/', username, password)
	{
		/**@type {URL | String} */
		this._url = url;
		// check if '/' ist at end
		if (this._url.lastIndexOf('/') !== this._url.length -1)
		{
			this._url += '/';
		}

		/**@type {String} */
		this._userName = username;

		/**@type {String} */
		this._password = password;

		/**@type {Boolean} */
		this._loginNeeded = (this._userName && this._password);

		/**@type {Boolean} */
		this._loggedIn = false;

		/**@type {Promise.<Object>} */
		if(this._loginNeeded)
		{
			/**
			 * @return {Promise.<Boolean>}
			 */
			this.login = (function (parentClass) {

			return new Promise ((resolve, reject) => {
				let options = {
					// activate cookies
					jar: true,
					// url
					url: parentClass._url + 'login.htm',
					headers: {
						'content-type': 'multipart/form-data'
					},
					formData: {
						"cugUsername": parentClass._userName,
						"cugPassword": parentClass._password,
						'com.livinglogic.cms.apps.cug.model.ClosedUserGroupLoginDisplayPreparer.loginFormSubmit': 'true'
					}
				};

				request(options, (error, response) => {
					if (error) reject(error);

					if (parentClass._loginNeeded && response.headers['set-cookie']){
						parentClass._loggedIn = true;
						resolve(parentClass._loggedIn);
					} else if (parentClass._loginNeeded && !response.headers['set-cookie']) {
						reject('its marked that you have to login: please type in the correct username and password');
					} else if (!parentClass._loginNeeded && !response.headers['set-cookie']) {
						resolve(parentClass._loggedIn);
					} else {
						reject('there is a bug that we actual dont know how to solve');
					}

				});
			})
		})(this);
		}
	}

	 /**
	 * Use to Insert or Update a String Data in Livingapps
	 * @param {String} string
	 */
	static String(string)
	{
		return {type: 'laString', value: string, asjson: string};
	}

	static Date(dateInit)
	{
		let date = new Date(dateInit);
		return {type: 'laDate', value: date, asjson: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`};
	}

	/**
	 * Update a number in Livingapps (converts to String)
	 * @param {Number} number
	 */
	static Number(number)
	{
		return {type: 'laNumber', value: number, asjson: number.toString()}
	}

	/**
	 * Use to Insert or Update a Location Data in Livingapps
	 * @param {String | Number} lat
	 * @param {String | Number} long
	 * @param {String} info
	 */
	static Geo(lat, long, info)
	{
		return {type: 'laGeo', value: {lat: lat, long: long, info: info}, asjson: `${lat}, ${long}, ${info}`};
	}
	/**
	 * Use to Insert or Update a RadioButton Data in Livingapps
	 * @param {String} key
	 */
	static RadioButton(key)
	{
		return {type: 'laRadio', value: key, asjson: key};
	}

	/**
	 * test if login service is online
	 * @param {URL} url
	 * @return {Promise.<Number>}
	 */
	static serviceStatus(url='https://my.living-apps.de/')
	{
		return new Promise((resolve, reject) => {
		   let options = {
				url: url + 'login.htm',
				method: 'post'
			};
			request(options, (err, response, body) => {
				if (err)
					reject(err);

				resolve(response.statusCode);
			})
		})
	}

	/**
	 * gets Appdata
	 * @type {Method}
	 * @param {String} appId
	 * @param {String} templateName
	 * @return {Promise.<Array.<Map>>}
	 */
	get(appId, templateName=undefined) {
		let lsdk = this;
		// get when user logs in
		if (this._loginNeeded){
			// login
			return this.login.then((loggedIn) => {
				return new Promise((resolve, reject) => {
					let options = {
						// activate cookies
						jar: true,
						// url
						url: lsdk._url + `gateway/apps/${appId}` + (templateName !== undefined ? `?template=${templateName}` : ''),
						method: 'get',
						headers: {
							"accept": "application/la-ul4on"
						}
					};
					request(options, (error, response, body) => {
						if (error) reject(error);
						// create object from response
						let dump = ul4on.loads(body);

						let globals = dump.get('globals');

						globals.Login = lsdk;
						let datasources = dump.get('viewtemplates').entries().next().value[1].get('datasources');

						resolve({globals: globals, datasources: datasources});
					})
				})
			})
			.catch((err) => {
				console.error(err.message);
			})
		} else {
			return new Promise((resolve, reject) => {
				let options = {
					jar: false,
					// url
					url: lsdk._url + `gateway/apps/${appId}/` + (templateName !== undefined ? `?template=${templateName}` : ''),
					method: 'get',
					headers: {
						'Accept': 'application/la-ul4on'
					}
				}
				request(options, (error, response, body) => {
					if (error)
						reject(error);

					// create object from response
					let dump = ul4on.loads(body);

					let globals = dump.get('globals');
					let datasources = dump.get('viewtemplates').entries().next().value[1].get('datasources');
					globals.LOGIN = lsdk;
					if (response.statusCode !== 200) {
						reject(new Error('HTTP Statuscode: ' + response.statusCode));
					}
					resolve({globals: globals, datasources: datasources});
				})
			})
		}
	}

	/**
	 * insert new Data to Living Apps
	 * @param {LaApp} app
	 * @param {Object} datas
	 * @return {Promise.<Number>}
	 */
	_insert(app, values)
	{
		let lsdk = this;
		return new Promise((resolve, reject) => {
			let fields = {};

			for (let ident in values) {
				if (!app.controls.has(ident)) {
					reject(`insert() got an unexpected keyword argument ${ident}`);
				}
				// add data to fields
				fields[ident] = app.controls.get(ident).asjson(values[ident]);
			}
			let data = {};
			data.id = app.id;
			data.data =  [{"fields": fields}];
			let options = {
				url: lsdk._url + `gateway/v1/appdd/${app.id}.json`,
				form: {"appdd": JSON.stringify(data)},
				jar: true,
				method: 'post'
			}

			request(options, (error, response, body) => {
				if(error) reject(error);

				if (response.statusCode !== 200) {
					reject('HTTP Code '  + response.statusCode);
				}
				let returnObj = {
					HTTPstatusCode: response.statusCode,
					recordid: JSON.parse(body).id,
					Record: livingAPI.Record.create({
						id: JSON.parse(body).id,
						createdat: new Date(Date.now()),
						updatedat: null,
						updatedby: null,
						updatecount: 0
					})
				}
				resolve(returnObj);
			})
		})
	}

	/**
	 * Update one Record
	 * @param {LaRecord} record
	 * @param {Map} datas
	 */
	_update(record, values)
	{
		let lsdk = this;
		return new Promise((resolve, reject) => {
			let fields = {};
			let app = record.app;
			for (let ident in values) {
				if (!app.controls.has(ident)) {
					reject(`update() got an unexpected keyword argument ${ident}`);
				}
				// add data to fields
				fields[ident] = values[ident];
			}
			let data = {};
			data.id = app.id;
			data.data =  [{"id": record.id, "fields": fields}];
			let options = {
				url: lsdk._url +`gateway/v1/appdd/${app.id}.json`,
				form: {"appdd": JSON.stringify(data)},
				jar: true,
				method: 'post'
			}
			request(options, (error, response, body) => {
				if(error)
					reject(error);

				if (response.statusCode !== 200)
					reject('HTTP Code '  + response.statusCode);

				for (let ident in values)
					record.fields.get(ident).value = values[ident];

				let returnObj = {
					HTTPstatusCode: response.statusCode,
					recordid: JSON.parse(body).id,
					Record: record
				}

				resolve(returnObj);
			})
		})
	}

	/**
	 * delete one Record
	 * @param {LaRecord} record
	 */
	_delete (record) {
		return new Promise((resolve, reject) => {
			let recordId = record.id;
			let appId = record.app.id;

			let options = {
				jar: true,
				url: this._url + `gateway/v1/appdd/${appId}/${recordId}.json`,
				method: 'delete'
			}
			request(options, (error, response, body) => {
				if (error)
					reject(error);

				if (response.statusCode !== 200)
					reject('HTTP Code '  + response.statusCode);
				resolve(response.statusCode);
			})
		});
	}
}
