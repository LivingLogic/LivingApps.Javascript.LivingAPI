;(function (root) {
	// amd is not implemented yet
	let amd = (typeof define === 'function' && define.amd);
	let commonjs = (typeof module === 'object' && module.exports);

	let livingApi, ul4on, request, http;
	if (commonjs) {
		livingApi = require('./modules/livingapi');
		ul4on = require('./modules/ul4').ul4on;
		http = require('https');
	} else {
		livingApi = root.livingapi;
		ul4on = root.ul4on;
	}

	class livingSDK {
		/**
		 * @param {String} [username]
		 * @param {String} [password]
		 * @param {Object} [options={}]
		 * @param {String} [options.url]
		 */
		constructor(options = {}, username, password) {
			/** @type {String} */
			this._password = password;
			/** @type {String} */
			this._userName = username;
			/** @type {Object} */
			this._options = {
				/** @type {String} */
				url: options.url !== undefined ? options.url : 'https://my.living-apps.de',
				/** @type {Boolean} */
				loginRequired: options.loginRequired !== undefined ? options.loginRequired : true
			};

			this._options.url = this._options.url.lastIndexOf('/') === this._options.url.length - 1 ? this._options.url : `${this._options.url}/`;
			if (this._options.loginRequired && !this._userName) {
				throw new Error('[livingSDK] You want to login without a username')
			}
			this.session = this.login();
		}

		/**
		 * get token for Session
		 * @return {Promise.<String>}
		 */
		login() {
			if (!this._options.loginRequired) {
				return undefined;
			}
			return new Promise((resolve, reject) => {
				if (commonjs) {     
					let options = {
						"ecdhCurve": 'auto',
					  	"method": "POST",
					  	"hostname": "my.living-apps.de",
					  	"port": 443,
					  	"path": "/gateway/login",
					  	"headers": {
							"content-type": "application/json"
					  	}
					};
					let req = http.request(options, function (res) {
						let chunks = [];;
					  	res.on("data", function (chunk) {
							chunks.push(chunk);
						});
					
					  	res.on("end", function () {
							let body = Buffer.concat(chunks);
							resolve(JSON.parse(body.toString()).auth_token);
					  	});
					});
					req.write(JSON.stringify({ username: 'rene.schwarzinger@milleniumfrog.de',
						password: 'Kl9BgZriXzxmLdpo' }));
					req.end();    
				} else {
					$.ajax(`${this._options.url}gateway/login`, {
						dataType: "json",
						data: JSON.stringify({
							'username': this._userName,
							'password': this._password
						}),
						method: 'POST',
						error: function (error) {
							reject(error);
						},
						success: function (body) {
							resolve(body.auth_token);
						}
					});
				}
			});
		}

		/**
		 *
		 */
		get(appID, templateName) {
			return new Promise((resolve, reject) => {
				this.session.then((auth_token) => {
					if (commonjs) {
						// let options = {
						// 	headers: {
						// 		'accept': 'application/la-ul4on',
						// 		'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
						// 	},
						// 	method: 'GET',
						// 	url: `${this._options.url}gateway/apps/${appID}${templateName !== undefined ? '/' + templateName : '' }`,
						// };
						// request(options, (error, response, body) => {
						// 	if (error)
						// 		reject(error);
						// 	switch (response.statusCode) {
						// 		case 200:
						// 			let dump = ul4on.loads(body);
						// 			dump.get('globals').Login = this;
						// 			dump.set('datasources', dump.get('viewtemplates').entries().next().value[1].get('datasources'));

						// 			resolve(dump);
						// 			break;
						// 		case 403:
						// 			this.session = this.login();
						// 			console.log("token is not valid");
						// 			resolve(this.get(appID, templateName));
						// 			break;
						// 		default:
						// 			reject("an error happend");
						// 	}
						// })
						let options = {
							"ecdhCurve": 'auto',
							"method": "GET",
							"hostname": this._options.url.split('//')[1].substr(0, this._options.url.split('//')[1].length-1),
							"port": 443,
							"path": `/gateway/apps/${appID}${templateName !== undefined ? '/' + templateName : '' }`,
							"headers": {
								'accept': 'application/la-ul4on',
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							}
						};
						let req = http.request(options, (res) => {
							let chunks = [];
							res.on("data", function (chunk) {
								chunks.push(chunk);
							});

							res.on("end",  () => {
								if (res.statusCode === 200) {
									let body = Buffer.concat(chunks).toString();
									let dump = ul4on.loads(body.toString());
									dump.get('globals').Login = this;
									dump.set('datasources', dump.get('viewtemplates').entries().next().value[1].get('datasources'));

									resolve(dump);
								} else if (res.statusCode === 403) {
									this.session = this.login();
									console.log("token is not valid");
									resolve(this.get(appID, templateName));
								}
							});
						});
						req.end();
					} else {
						$.ajax(`${this._options.url}gateway/apps/${appID}${templateName !== undefined ? '/' + templateName : '' }`, {
							headers: {
								'accept': 'application/la-ul4on',
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							},
							method: 'GET',
							statusCode: {
								500: () => {
									reject('internal error httpStatus: 500');
								},
								403: () => {
									this.session = this.login();
									console.log("token is not valid");
									resolve(this.get(appID, templateName));
								},
								200: (body) => {
									let dump = ul4on.loads(body);
									dump.get('globals').Login = this;
									dump.set('datasources', dump.get('viewtemplates').entries().next().value[1].get('datasources'));
									resolve(dump);
								}
							}
						})
					}
				});
			});
		}

		_insert(app, values) {
			return new Promise((resolve, reject) => {
				this.session.then((auth_token) => {
					let fields = {};

					for (let ident in values) {
						if (!app.controls.has(ident)) {
							reject(`insert() got an unexpected keyword argument ${ident}`);
						}
						// add data to fields

						fields[ident] = app.controls.get(ident).asjson(values[ident]);
					}
					let data = {};{

					}
					data.id = app.id;
					data.data = [{"fields": fields}];
					if (commonjs) {
						let options = {
							url: `${this._options.url}gateway/v1/appdd/${app.id}.json`,
							form: {"appdd": JSON.stringify(data)},
							headers: {
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							},
							method: 'post'
						};

						request(options, (error, response, body) => {
							//console.log(response);
							if (error) reject(error);
							//console.log(response.statusCode);
							if (response.statusCode !== 200) {
								reject('HTTP Code ' + response.statusCode);
							}
							let returnObj = {
								HTTPstatusCode: response.statusCode,
								recordid: JSON.parse(body).id,
								Record: livingApi.Record.create({
									id: JSON.parse(body).id,
									createdat: new Date(Date.now()),
									updatedat: null,
									updatedby: null,
									updatecount: 0
								})
							};
							resolve(returnObj);
						})
					} else {
						$.ajax(`${this._options.url}gateway/v1/appdd/${app.id}.json`, {
							method: 'post',
							data: {"appdd": JSON.stringify(data)},
							headers: {
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							},
							statusCode: {
								200: function (body) {
									let returnObj = {
										recordid:body.id,
										Record: livingApi.Record.create({
											id: body.id,
											createdat: new Date(Date.now()),
											updatedat: null,
											updatedby: null,
											updatecount: 0
										})
									};
									resolve(returnObj);
								}
							}
						});
					}
				})
			});
		}

		_update(record, values) {
			return new Promise((resolve, reject) => {
				this.session.then((auth_token) => {
					let fields = {};
					let app = record.app;
					for (let ident in values) {
						if (!app.controls.has(ident)) {
							reject(`update() got an unexpected keyword argument ${ident}`);
						}
						fields[ident] = values[ident];
					}
					let data = {};
					data.id = app.id;
					data.data = [{"id": record.id, "fields": fields}];
					if (commonjs) {
						let options = {
							url: `${this._options.url}gateway/v1/appdd/${app.id}.json`,
							form: {"appdd": JSON.stringify(data)},
							headers: {
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							},
							method: 'post'
						};
						request(options, (error, response, body) => {
							//console.log("hello");
							if (error) {
								reject(error);
							}
							switch (response.statusCode) {
								case 200:
									for (let ident in values)
										record.fields.get(ident).value = values[ident];
									let returnObj = {
										HTTPstatusCode: response.statusCode,
										recordid: JSON.parse(body).id,
										Record: record
									};
									resolve(returnObj);
									break;
								default:
									reject(`an unexpexted error happend, Statuscode ${response.statusCode}`);
							}
						});
					} else {
						$.ajax(`${this._options.url}gateway/v1/appdd/${app.id}.json`, {
							data: {"appdd": JSON.stringify(data)},
							headers: {
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							},
							method: 'post',
							statusCode: {
								200: (body) => {
									for (let ident in values)
										record.fields.get(ident).value = values[ident];
									let returnObj = {
										HTTPstatusCode: 200,
										recordid: body.id,
										Record: record
								};
								resolve(returnObj);
								}
							}
						})
					}
				});
			});
		}

		_delete (record) {
			return new Promise ((resolve, reject) => {
				this.session.then((auth_token) => {
					let app = record.app;
					let recordId = record.id;
					if (commonjs) {
						let options = {
							headers: {
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							},
							url: `${this._options.url}gateway/v1/appdd/${app.id}/${recordId}.json`,
							method: 'delete'
						};
						request(options, (error, response, reject) => {
							if (error)
								reject(error);
							switch (response.statusCode) {
								case 200:
									resolve (response.statusCode);
									break;
								default:
									reject ('an unexpexted error happend');
							}
						})
					} else {
						$.ajax(`${this._options.url}gateway/v1/appdd/${app.id}/${recordId}.json`, {
							method: 'delete',
							headers: {
								'X-La-Auth-Token': auth_token !== undefined ? auth_token : ''
							},
							statusCode: {
								200: () => {
									resolve (200);
								}
							}
						});
					}
				})
			})
		}
	}

	// export livingsdk
	if (commonjs) {
		module.exports = livingSDK;
	} else {
		root.livingSDK = livingSDK;
	}


})(this);
