# Apps erstellen mit Ionic und Living-Apps

Kaffee ist eine wichtige Resource in einem Softwareunternehmen,
deshalb verfolgen wir mithilfe einer Living-App wieviel Kaffee
konsumiert wird. Allerdings gibt es keine zentrale Station wo
der Kaffeekonsum eingetragen wird, sondern es wird jeweils fast
immer am Rechner nachgetragen. Nun wollen wir in diesem Beitrag
eine App erstellen, die auf einem in der Küche aufgestellten Tablet
installiert wird und eine zentrale Anlaufstelle zum eintragen des 
Kaffees ist. 
Für diesen Beitrag benötigen Sie etwas Kenntnisse über Javascript
und Ionic.

## Todo-Liste
- eine Living-App
- ein Formular zur Eingabe des Kaffeekonsums
- Schnellzugriffsliste auf Namen

## eine Living-App erstellen
Zuallererst benötigen Sie ein Living-Apps Konto mit erweiterten Rechten,
um später Datenquellen freizuschalten. Folgen Sie einfach der Anleitung
und falls bei ihnen etwas anders aufscheint schreiben Sie uns.

![alt](./src/assets/Screenshot_20171208_154847.png)

Erstellen Sie eine App in Living-Apps, ihr Fenster sollte nun wie 
oben Aussehen. Nun ziehen Sie mehrere Textfelder und benennen 
diese bitte wie im  Bild darunter zu sehen. Bitte vergessen Sie 
nicht auch einen Absenden-Button zu erstellen.

![alt](./src/assets/Screenshot_20171208_155022.png)
![alt](./src/assets/Screenshot_20171208_155049.png)

Damit Sie später die App besser erkennen können benennen Sie die Living-App. Öffnen Sie nun bei Ihrer App den Reiter Erweitert und Konfiguration.

![alt](./src/assets/Screenshot_20171208_155142.png)

Falls ihr Bildschirm nicht so aussieht wie auf dem Bild oben
(Sie benötigen die Anzeigetemplates) fragen Sie bitte nach
einem erweiterten Account.

Falls Sie bei ihnen alles bisher funktioniert erstellen Sie ein Anzeigetemplate und füllen den Identifizierer ein und für setzen
ein Häkchen bei Standard? und setzen Sie die Berechtigung auf "User mit Rechten auf der Applikation", dami nur Sie und eingeladene Personen später direkten Zugriff darauf haben und keine Dritten.

![alt](./src/assets/Screenshot_20171208_155205.png)
![alt](./src/assets/Screenshot_20171208_155227.png)

Anschließend müssen Sie Datenquellen hinzufügen, denn auf diese greifen
Sie später über das SDK zu. Gehen Sie dazu so vor wie in den nächsten zwei Bildern abgebildet.

![alt](./src/assets/Screenshot_20171208_155323.png)
![alt](./src/assets/Screenshot_20171208_155356.png)

Wenn Sie diese Schritte abgeschlossen haben, können Sie mithilfe 
des SDKs auf die Datenquellen zugreifen, wie Sie in einem 
späteren Kapitel sehen können.

## Formular zur Eingabe
In der Living-App habe Sie bereits ein Formular erstellt, das Sie online
aufrufen können, allerdings benötigen wir ein Formular in Ihrer App.
Um das möglichst schnell Realisieren können Sie Ionic vordefinierte 
Elemente benutzen. 
Erstellen Sie aber zuerst einmal Ihr Ionic (falls Sie Ionic noch nicht installiert haben können Sie das mit npm i -g Ionic) Projekt mit 

```bash
ionic start
```

Während der Initialisierung des Projekts werden Sie nach einem Template
gefragt, Sie können ein beliebigen nutzen, im Blog verwenden wir aber 
das Blank Template, falls Sie aber die App erweitern wollen können Sie
auch sofort mit einem anderen Template mit einem Menü beginnen.

![alt](./src/assets/mobile_screenshot.png)

Die Gestaltung soll nahe einer Vorgängerversion (darüber zu sehen) 
nahe kommen mit einer Auwahlbox für die 
Kaffeesorte, eine Möglichkeit die Rundenzahl (von 1-5) zu erniedrigen und
erhöhen und schließlich ein Textfeld wo Sie Ihren Namen eintragen
können. Darunter soll noch eine Liste aller bereits eingegeben
Namen erscheinen, um eine Schnellauswahl zu ermöglichen.

### Schritt 1. 
Führen Sie folgenden Befehl aus:
```bash
ionic serve
``` 
Nun können Sie im Browser sehen, wie die App aussieht und dank 
des Live-Previews sehen Sie die Veränderungen.