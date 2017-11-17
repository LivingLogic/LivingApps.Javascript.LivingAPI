let  livingSDK = this.livingSDK !== undefined ? this.livingSDK : undefined;
let config = this.config ? this.config: undefined;
if (typeof module === 'object' && module.exports){
    console.log("livingSDK for nodejs");
    livingSDK = require('../src/livingSDK');
    config = require('./config');
}
describe ('login', () => {
    it ('login', () => {
        let lsdk = new livingSDK({}, config.username, config.password);
        return lsdk.login().then((res) => console.log(res));
    });
    it ('login and get function', () => {
        let lsdk = new livingSDK({}, config.username, config.password);
        lsdk.session = (function() {return new Promise ((resolve, reject) => {resolve(123)})})();
        return lsdk.get(config.appId).then((LAAPI) => {
            return LAAPI
        });
    });
    it ('insert a entry', () => {
        let lsdk = new livingSDK({}, config.username, config.password);
        return lsdk.get(config.appId).then((LAAPI) => {
            let app = LAAPI.get('datasources').get('default').app;
            return app.insert({
                mitarbeiter: 'Einstein',
                interessensgebiete: ['kaffee']
            });
        })
    });
    it ('update last entry', () => {
        let lsdk = new livingSDK({}, config.username, config.password);
        return lsdk.get(config.appId).then((LAAPI) => {
            let app = LAAPI.get('datasources').get('default').app;
            let records = app.records.values();
            let last;
            for (let d of records) {
                last = d;
            }
            return last.update({
                mitarbeiter: 'itsMe',
                interessensgebiete: ['kaffee']
            })
        })
    });
    it ('delete a entry', () => {
        let lsdk = new livingSDK({}, config.username, config.password);
        return lsdk.get(config.appId).then((LAAPI) => {
            let app = LAAPI.get('datasources').get('default').app;
            let records = app.records.values();
            let last;
            for (let d of records) {
                last = d;
            }
            return last.delete();
        })
    })
});