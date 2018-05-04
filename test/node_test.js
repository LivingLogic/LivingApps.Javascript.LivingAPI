let livingSDK;
let config;
let defaultSettings = {
}
let defaultNoLogin = {
    loginRequired: false
}
if (typeof module === 'object' && module.exports){
    livingSDK = require('../src/livingSDK');
    config = require('./config');
} else {
    config = this.configs;
    livingSDK = this.livingSDK;
}
describe ('login', () => {
    it ('login', () => {
        let lsdk = new livingSDK(defaultSettings, config.username, config.password);
        return lsdk.login().then((res) => console.log(res));
    });
    it ('login and get function', () => {
        let lsdk = new livingSDK(defaultSettings, config.username, config.password);
        lsdk.session = (function() {return new Promise ((resolve, reject) => {resolve(123)})})();
        return lsdk.get(config.appId).then((LAAPI) => {
            return LAAPI
        });
    });
    it ('insert a entry', () => {
        let lsdk = new livingSDK(defaultSettings, config.username, config.password);
        return lsdk.get(config.appId).then((LAAPI) => {
            let app = LAAPI.get('datasources').get('default').app;
            return app.insert({
                mitarbeiter: 'Einstein',
                interessensgebiete: ['kaffee']
            });
        })
    });
    it ('update first entry', () => {
        let lsdk = new livingSDK(defaultSettings, config.username, config.password);
        return lsdk.get(config.appId).then((LAAPI) => {
            let app = LAAPI.get('datasources').get('default').app;
            let records = app.records.values();
            let last;
            for (let d of records) {
                last = d;
                break;
            }
            return last.update({
                mitarbeiter: 'Time: ' + Date.now(),
                interessensgebiete: ['kaffee']
            })
        })
    });
    it ('delete a entry', () => {
        let lsdk = new livingSDK(defaultSettings, config.username, config.password);
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
describe ('without login', () => {
    it ('get function', () => {
        let lsdk = new livingSDK(defaultNoLogin);
        lsdk.session = (function() {return new Promise ((resolve, reject) => {resolve(123)})})();
        return lsdk.get(config.appId).then((LAAPI) => {
            return LAAPI
        });
    }); 
});