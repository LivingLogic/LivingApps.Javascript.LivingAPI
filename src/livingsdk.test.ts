import { LivingSDK, LivingSDKOptions, Auth_Token } from './livingsdk';
import { expect } from 'chai';
import 'mocha';
import {livingappsData as lsd } from './config'

enum lsdktemplates {
	default= 'default',
	loggedIn = 'loggedInUsers',
	admin = 'withAdminPriveleges',
	permissions = 'withPermissions',
	workpriv = 'withWorkingPriveleges'
}

describe('LivingSDK: ', () => {
	/*
	 * test login
	 * - getAuthToken
	 */
	describe('.login()', () => {
		it('no login', () => {
			let lsdk = new LivingSDK({loginRequired: false});
			return lsdk.login().then((auth_token: Auth_Token) => {
				expect(typeof auth_token).to.equal('undefined');
			});
		});
		it('login with correct username and password', () => {
			let lsdk = new LivingSDK({}, lsd.username, lsd.password);
			return lsdk.login().then((auth_token: Auth_Token) => {
				expect(typeof auth_token).to.equal('string');
			});
		});
		it('change auth_token', () => {
			let lsdk = new LivingSDK({}, lsd.username, lsd.password);
			return lsdk.login().then(() => {
				// session is private -> cast lsdk to any
				(<any>lsdk).session = Promise.resolve("10");
				return (<any>lsdk).session;
			}).then(() => {
				return lsdk.get(lsd.appId, lsdktemplates.loggedIn);
			})
			.then(() => {
				throw new Error("user still logged in");
			}).catch((err: any) => {
				expect(err.message).to.equal("Request failed with status code 403");
			});
		});
		it('login with wrong data', () => {
			let lsdk = new LivingSDK({}, "foo", "bar");
			return lsdk.login().then((auth_token: Auth_Token) => {
				// teste ob ergebnis leer ist
				expect(auth_token).to.equal(undefined);
			});
		});
	});


	describe('.get()', () => {
		// not logged in user
		function createMinLSDK () {
			return new LivingSDK({loginRequired: false});
		}
		// logged in user
		function createMaxLSDK () {
			return new LivingSDK({}, lsd.username, lsd.password);
		}
		describe('permissions without login', () => {
			it('request default', () => {
				return createMinLSDK().get(lsd.appId);
			});
			it('request loggedInUsers', () => {
				return createMinLSDK().get(lsd.appId, lsdktemplates.loggedIn)
					.then(() => {
						throw new Error('should not reach this part of code');
					})
					.catch((err: any) => {
						expect(err.message).to.equal('Request failed with status code 403');
					})
			})
			it('request withPermissionsForApp', () => {
				return createMinLSDK().get(lsd.appId, lsdktemplates.permissions)
					.then(() => {
						throw new Error('should not reach this part of code');
					})
					.catch((err: any) => {
						expect(err.message).to.equal('Request failed with status code 403');
					})
			})
			it('request withWorkingPrivelegesApp', () => {
				return createMinLSDK().get(lsd.appId, lsdktemplates.workpriv)
					.then(() => {
						throw new Error('should not reach this part of code');
					})
					.catch((err: any) => {
						expect(err.message).to.equal('Request failed with status code 403');
					})
			})
			it('request withAdminPriveleges', () => {
				return createMinLSDK().get(lsd.appId, lsdktemplates.admin)
					.then(() => {
						throw new Error('should not reach this part of code');
					})
					.catch((err: any) => {
						expect(err.message).to.equal('Request failed with status code 403');
					})
			})
		});

		describe('permissions with admin login', () => {
			it('request default', () => {
				return createMaxLSDK().get(lsd.appId);
			});
			it('request loggedInUsers', () => {
				return createMaxLSDK().get(lsd.appId, lsdktemplates.loggedIn);
			})
			it('request withPermissionsForApp', () => {
				return createMaxLSDK().get(lsd.appId, lsdktemplates.permissions);
			})
			it('request withWorkingPrivelegesApp', () => {
				return createMaxLSDK().get(lsd.appId, lsdktemplates.workpriv);
			})
			it('request withAdminPriveleges', () => {
				return createMaxLSDK().get(lsd.appId, lsdktemplates.admin);
			})
		});

		it('request not existing app', () => {
			return createMaxLSDK().get('afsdadstasda')
				.then(() => {
					throw new Error('should not reach this part of code');
				})
				.catch((err: any) => {
					expect(err.message).to.equal('Request failed with status code 404');
				})
		});
	})

});