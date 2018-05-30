(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./livingsdk", "chai", "mocha"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const livingsdk_1 = require("./livingsdk");
    const chai_1 = require("chai");
    require("mocha");
    describe('LivingSDK: ', () => {
        describe('login', () => {
            it('successfull login', () => {
                let lsdk = new livingsdk_1.LivingSDK({ loginRequired: false });
                return lsdk.login().then((auth_token) => {
                    chai_1.expect(typeof auth_token).to.equal('undefined');
                });
            });
        });
    });
});
