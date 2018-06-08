import { LivingSDK, LivingSDKOptions, Auth_Token } from './livingsdk';
import { expect } from 'chai';
import 'mocha';
import {livingappsData as lsd } from './config'

describe('LivingSDK: ', () => {
	/*
	 * test login
	 * - getAuthToken
	 */
	describe('login', () => {
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
				return lsdk.get(lsd.appId, 'closed');
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
			})
		})
	})
});