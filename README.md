# Kochservice

## Good to know:

### index
Main Page, auf der alle weiteren Websiten angezeigt werden

### rezepte
Gesamtübersicht aller verfügbaren Rezepte auf der Website

### gericht
Page mit einem einzelnen Gericht, zeigt die Zubereitung an

### vorschlaege
Kontaktvormular um neue Rezepte anzufordern

### kontakt
Impressum und Danksagung an Entwickler

## How to Setup/Run
Es werden Node.js und MariaDB gebraucht um die Anwendung zu starten.
Für Nutzerfreundlichkeit wird außerdem XAMPP empfohlen
Um die Website zum laufen zu bringen zuerst
    
    npm install

und im Anschluss:

    npm run dev

Nun ist die Website aufrufbar über https://localhost:3000

Damit das Backend funktioniert muss dieses noch gestartet werden. 
Angefangen mit der MariaDB welcher über XAMPP gestartet werden kann
indem man Apache und MySQL startet. Im Anschluss muss in einer weiteren
Konsole:

    node app/start.js

gestartet werden. Das Backend ist nun auf https://localhost:3001 aktiv.