# Kochservice

## Description

Dieses Project bildet eine Website um Rezepte für verschiedene Gerichte zu erstellen, anzusehen und mit weiteren zu Teilen.

### Technologies

#### Programming

Die Anwendung läuft auf dem Javascript Framework [NextJS](https://nextjs.org) in Verbindung mit der React library. Sowohl Frontend als auch Backend sind mit Javascript geschrieben und nutzen libraries für diese Sprache.

#### Database

MariaDB wurde als Datenbank genutzt da keinerlei Lizensen benötigt werden und eine relationale Datenbank für die gespeicherten Rezepte benötigt wird.

##### Datastructure:

- ID (int)
- title (String)
- pic (String)
- ingredients (String)
- preparation (JSON)

## How to Setup/Run
Um die Anwendung zu starten wird Node.JS und der Paketmanager npm benötigt. Es wird außerdem eine IDE wie Visuall Studio Code empfohlen.

### Initialisieren der Anwendung

Nachdem man das Projekt heruntergeladen hat benötigt man noch einige libraries. Um die benötigten Dependencies zu installieren im Terminal zuerst folgendes eingeben:
    
    npm install

### Run

Um die Anwendung nun zu starten muss nur noch folgende Anweisung in die Console eingeben:

    npm run dev

Dadurch wird Next.js gestartet und die Anwendung ist nun unter [localhost:3000](localhost:3000) erreichbar.

### Credentials & Database

Die Anwendung benötigt die Login Details um sich mit der Datenbank verbinden zu können. Diese können in einer ==.env== Datei gespeichert werden. Diese sollte so aussehen:

    HOST=
    DATABASE=
    USER=
    PASSWORD=

Die Anwendung wird diese Variablen benutzen um sich mit der Datenbank zu verbinden und authorisieren. Eine einfache Datenbank kann man local auf der Maschine hosten. Das XAMPP Controll Panel ist in dieser Hinsicht, aufgrund seines graphischen Userinterface,  sehr einfach zu verstehen.

## How to Use

Die laufende Anwendung ist unter [Kochservice](kochservice.vercel.app) erreichbar. Dies ist immer der aktuelle Stand des main branches.

## License

MIT License

Copyright (c) 2024 GolemT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.