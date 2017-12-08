Javascript-SDK
==============

Mit dem Javascript-SDK können sie mithilfe der Programmiersprache Javascript mit
LivingApps interagieren.

Das SDK erlaubt Ihnen, die Daten die Sie in den Datenquellen für eines Ihrer
Anzeige-Templates konfiguriert haben, abzurufen, neue Datensätze anzulegen,
sowie existierende zu ändern und zu löschen.

Die folgenden Beispiele wurde mit ``node.js`` Version 8.4 auf Ubuntu 16.04
getestet.


Installation
------------

Das Javascript-SDK steht auf Github zur Verfügung und kann folgendermaßen
geklont werden:

.. sourcecode:: bash

	$ git clone https://github.com/LivingLogic/LivingApps.Javascript.LivingAPI

Danach können die benötigten Packete installiert werden:

.. sourcecode:: bash

	$ cd LivingApps.Javascript.LivingAPI
	$ npm install

Sollten Sie bereits ein Projekt mit Node.js haben, können Sie das Javascript-SDK
verwenden indem sie die benötigten Packete separat installieren:

.. sourcecode:: bash

	$ npm install blueimp-md5
	$ npm install request

und dann die Dateien aus dem `src`-Verzeichnis in Ihr Projekt-Verzeichnis
kopieren.
Sollten Sie allerdings das SDK im Client einsetzen müssen Sie jQuery 
in ihr HTML einbinden.

.. sourcecode:: HTML

	<script
        src="https://code.jquery.com/jquery-3.2.1.min.js"
        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
        crossorigin="anonymous"></script>
		<script src="../src/modules/ul4.js"></script>
        <script src="../src/modules/livingapi.js"></script>
        <script src="../src/livingSDK.js"></script>
	

Einloggen
---------

Als erstes müssen die benötigten Module eingebunden werden (Clientseitig haben Sie das bereits schon im Codeblock darüber getan):

.. sourcecode:: javascript

	let livingSDK = require('src/livapp');
	let ul4 = require('src/modules/ul4.js');

Nun können Sie ein ``livingSDK``-Objekt anlegen, und sich damit in LivingApps
einloggen:

.. sourcecode:: javascript

	let loginOptions = [
		{}, // setzt URL automatisch
		'me@example.org', // Ihr Benutzername
		'password' // Ihr Passwort
	];
	let lsdk = livingSDK(...loginOptions);


Beispiele
---------

Das ``Globals``-Objekt und die Datenquellen auslesen:

.. sourcecode:: javascript

	let loginOptions = [
		{}, // setzt URL automatisch
		'me@example.org', // Ihr Benutzername
		'password' // Ihr Passwort
	];
	let lsdk = livingSDK(...loginOptions);
	let data = lsdk.get('59b02548af9e99d525d316b4'); // appid
	return data.then((LAAPI) => {
		let globals = LAAPI.get('globals');
		let datasources = LAAPI.get('datasources');
		// Das App-Objekt aus der Datenquelle holen
		let app = datasources.get('persons').app;
		console.log(ul4._repr(app));
		// out: <la.App id=\'59b02548af9e99d525d316b4\' name=\'LivingAPI-Demo\'>
	})

Einen Datensatz anlegen:

.. sourcecode:: javascript

	let loginOptions = [
		{}, // setzt URL automatisch
		'me@example.org', // Ihr Benutzername
		'password' // Ihr Passwortf
	];
	let lsdk = livingSDK(...loginOptions);
	let data = lsdk.get('59b02548af9e99d525d316b4'); // appid
	return data.then((LAAPI) => {
		let globals = LAAPI.get('globals');
		let datasources = LAAPI.get('datasources');
		// get app
		let app = datasources.get('persons').app;
		// set content of new Record
		let newInsert = {
			"text": "das ist ein Text",
			date: new Date(Date.now())
		}
		return app.insert(newInsert);
	})

Einen Datensatz ändern:

.. sourcecode:: javascript

	let loginOptions = [
		{}, // setzt URL automatisch
		'me@example.org', // Ihr Benutzername
		'password' // Ihr Passwort
	];
	let lsdk = livingSDK(...loginOptions);
	let data = lsdk.get("59b02548af9e99d525d316b4");
	return data.then((LAAPI) => {
		let globals = LAAPI.get('globals');
		let datasources = LAAPI.get('datasources');
		let app = datasources.get('test').app;
		let r = app.records.values();
		let last;
		let counter = 0;
		// Letzten Datensatz holen
		for (let d of r) {
			last = d;
		}
		return last.update({
			text: "Neuer Text",
			date: new Date(Date.now())
		});
	})

Einen Datensatz löschen:

.. sourcecode:: javascript

	let loginOptions = [
		{}, // setzt URL automatisch
		'me@example.org', // Ihr Benutzername
		'password' // Ihr Passwort
	];
	let lsdk = livingSDK(...loginOptions);
	let data = lsdk.get("59b02548af9e99d525d316b4");
	return data.then((LAAPI) => {
		let globals = LAAPI.get('globals');
		let datasources = LAAPI.get('datasources');
		let app = datasources.get('test').app;
		let r = app.records.values();
		let last;
		// Letzten Datensatz holen
		for (let d of r) {
			last = d;
		}
		return last.delete();
	})
