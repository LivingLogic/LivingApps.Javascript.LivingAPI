const config = require('../../../../test/config');
const LivingSDK = require('../../App_erstellen_Ionic/src/kaffeeapp_ionic/src/assets/scripts/src/livingSDK');

console.log("started script");
let lsdk = new LivingSDK({}, config.username, config.password);
lsdk.get('5a33c42ac10bb04e6cf76e1c').then((LAAPI) => {
	let app = LAAPI.get('datasources').get('default').app;
	let records = app.records.values();
	console.log('Schöne Grüße an: ');
	for(let record of records) {
		console.log(record.fields.get('name').value);
	}
})