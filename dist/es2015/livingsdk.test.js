import { LivingSDK } from './livingsdk';
import { expect } from 'chai';
import 'mocha';
describe('LivingSDK: ', () => {
    describe('login', () => {
        it('successfull login', () => {
            let lsdk = new LivingSDK({ loginRequired: false });
            return lsdk.login().then((auth_token) => {
                expect(typeof auth_token).to.equal('undefined');
            });
        });
    });
});
