import { LivingSDK, LivingSDKOptions, Auth_Token } from './livingsdk';
import { expect } from 'chai';
import 'mocha'

describe('LivingSDK: ', () => {
	/*
	 * test login
	 * - getAuthToken
	 */
	describe('login', () => {
		it('successfull login', () => {
			let lsdk = new LivingSDK({loginRequired: false});
			return lsdk.login().then((auth_token: Auth_Token) => {
				expect(typeof auth_token).to.equal('undefined');
			})
		})
	})
});