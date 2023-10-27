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

### Aufsetzten der Datenbank mit XAMPP und phpMyAdmin

Nach Installation von MariaDB und XAMPP muss zuerst das XAMPP panel gestartet 
werden. Hier findet man 5 Services. Gebraucht werden nur die Module Apache und
MySQL. Diese mit dem jeweiligen Knopf starten. Im Anschluss im XAMPP Control
Panel auf 'Admin' klicken. Dies führt einen zum phpMyAdmin Control panel. Hier
kann durch die Schaltfläche "importieren" eine Datenbank erstellt werden. Die zu
importierende Datein ist in dem App Folder zu finden:
    
    Kochservice/app/kochservice.sql

### Initialisieren der Anwendung

Um die benötigten Dependencies zu installieren zuerst:
    
    npm install

### Run

Damit abfragen geschehen können muss die Datenbank laufen. Solange diese nicht gehostet
ist wird sie hier über XAMPP gestartet. In XAMPP startet man die db indem man die Module
 Apache und MySQL startet.

Das Frontend kann durch:

    npm run app

gestartet werden. Nun ist die Website aufrufbar über https://localhost:3000

Damit das Backend funktioniert muss dieses noch gestartet werden. 
In einer weiteren Konsole eingeben:

    npm run backend

Das Backend ist nun auf https://localhost:3001 aktiv.


Für einfache Entwicklung können sowohl Frontend als auch Backend zusammen im
selben Terminal gestartet werden. Dies funktioniert über:

    npm run dev