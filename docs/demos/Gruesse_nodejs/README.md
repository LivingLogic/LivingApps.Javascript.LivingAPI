# Schöne Grüße an A, B, C, D und Z
Tja, eine Namensliste ist doch etwas praktisches, Sie können 
in ihr Emailadressen hinterlegen, Sonderwünsche abspeichern
und Namen abfragen. Aber die alten Papierlisten sind schon
schwer UpToDate zu halten oder falls sich eine Sache ändert
muss sich eine ganze Menge drum herum ändern, da die Liste 
ansonsten sehr unübersichtlich wird.
Heute wollen wir Ihnen eine gute Alternative zu dem Zettelchaos
vorstellen, LivingApps.
In diesem Beitrag soll es darum gehen, wie Sie mit nodejs mit
LivingApps kommunizieren können.
Am Ende des Beitrags sollen Sie ein Skript haben, das alle
auf Namen in ihrer LivingApp grüßt.

## Todo Liste
- eine LivingApp anlegen (Siehe App_erstellen_ionic)
- Daten von LivingApps abholen

## eine LivingApp anlegen
Das wird in dem Beitrag nicht weiter erläutert, 
da dazu bereits eine detailierte Anleitung im 
Beitrag App_erstellen_Ionic ist.
[Siehe hier](https://github.com/milleniumfrog/LivingApps.Javascript.LivingAPI/tree/updatedoc/docs/demos/App_erstellen_Ionic)

## Daten von LivingApps abholen
Binden Sie hierzu livingSDK.js ein. Klonen Sie dazu das letzte,
offizielle Repository von Github und kopieren dessen src Ordner in ihren 
Projektordner und binden es mit: 
```Javascript
const LivingSDK = require('path to livingSDK.js');
```

Instanziieren Sie das SDK mit 
```Javascript
let lsdk = new LivingSDK({}, 'username', 'password');
```

Sie haben sich soeben mit dem SDK bei LivingApps angemeldet und können
mit 
```Javascript
lsdk.get('appid').then((LAAPI) => {...});
```

den Zugang zu den Datenquellen holen. In den nächsten Schritten 
wird im ... Bereich eingesetzt.

Zunächst wollen Sie auf die Datenquelle, die Sie vorhin im Anzeigetemplate
hinterlegt haben zugreifen und von dort aus auf die App.
Kombiniert sähe das folgendermaßen aus:
```Javascript
	let app = LAAPI.get('datasources').get('Datenquellenidentifizierer').app;
```

Von dort haben Sie dann Zugriff auf alle Einträge/Records:
```Javascript
	let records = app.records.values(); // app.records ist ein dictonary, in JS eine Map
```

Jetzt müssen Sie das ganze nur noch ausgeben.
```Javascript
	console.log('Schöne Grüße an: ');
	for(let record of records) {
		console.log(record.fields.get('name').value); // Sie fragen den Wert von Name von der Liste ab
	}
```

und schon gibt das Skript folgendes aus:
```bash
	Schöne Grüße an:
	Name3
	Name2
	Name1
```

So einfach ist es Daten von LivingApps als Backend zu 
benutzen und Leute via Konsole zu Grüßen

Viel Spaß mit dem SDK