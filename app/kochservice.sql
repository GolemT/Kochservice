-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 24. Okt 2023 um 10:28
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `kochservice`
--
CREATE DATABASE IF NOT EXISTS `kochservice` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `kochservice`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `recipe`
--

DROP TABLE IF EXISTS `recipe`;
CREATE TABLE `recipe` (
  `ID` int(11) NOT NULL,
  `title` text NOT NULL,
  `pic` text NOT NULL,
  `ingredients` text NOT NULL,
  `preparation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`preparation`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `recipe`
--

INSERT INTO `recipe` (`ID`, `title`, `pic`, `ingredients`, `preparation`) VALUES
(1, 'Crepes', 'recipes/crepes.png', '2 Eier, 250ml Milch, 160g Mehl, 1 Prise Zucker, 1 Prise Salz, 1 TL Butter', '{"Schritt 1": "Mehl mit Zucker und Salz vermischen. Eier und Milch hinzufügen und mit einem Schneebesen oder dem Handrührgerät zu einem glatten Teig verrühren.", "Schritt 2": "Eine Pfanne auf mittlere Stufe erhitzen. Butter in die Pfanne geben und flüssig werden lassen", "Schritt 3": "Eine Kelle des Teigs in die Pfanne gießen und durch schwenken der Pfanne verteilen.", "Schritt 4": "Nach ein paar Minuten den nun festeren Teig wenden. Die obere Seite sollte nun leicht braun angebacken sein. Wenn nicht braucht diese Seite noch ein paar Minuten", "Schritt 5": "Wenn beide Seiten leicht braun angebacken sind den Crepe von der Pfanne nehmen. Nun mit aufstrich der Wahl bedecken. Empfehlungen sind: Zucker, Nutella, Marmelade, Erdnussbutter"}'),
(2, 'Frittiertes Hühnchen mit Reis', 'recipes/FrittiertesHuehnchenMitReis.png', 'Hühnchenfilet, Mehl, Stärke, Soja sauce, Knoblauch, Salz, Pfeffer, Öl, Reis', '{"Schritt 1": "Hühnchenfilet in mundgerecht Stücke schneiden. 3 Knoblauch zehen in stücke schneiden. Nun die Hühnchenstücke und den Knoblauch in eine Schale geben. Soja sauce, Salz & Pfeffer dazugeben und mit der Hand durchmischen. Nun 20 min einziehen lassen.", "Schritt 2": "In einer anderen Schale Stärke & Mehl in gleichen Mengen zusammen mischen. Die Hühnerstückchen nun in das Mehl-Stärke gemisch eingeben und bedecken. Eine Pfanne mit Öl erhitzen und die Stückchen fritieren.", "Schritt 3": "Nach Wunsch kann man die frittierten Stückchen nochmal fritieren. Sie schmecken aber auch so gut :). Den Reis aufsetzten damit er rechtzeitig fertig wird. Eine Soße wird gemischt aus Essig, Ketchup, Honig & Soja Sauce. Abschmecken und bei Bedarf anpassen. Die Soße in einer Pfanne leicht erhitzen. Nun die frittierten Hühnchenstücke in die Soße geben sodass diese die Soße aufnehmen. Im Anschluss kann das Gericht serviert werden"}'),
(3, 'Schnitzel mit gedünstetem Blumenkohl/Brokkoli und Kartoffelpüree', 'recipes/SchnitzelMitGedünstetemBlumenkohlUndKartoffelpueree.png', '1 Blumenkohl/Brokkoli, 5 Kartoffeln, Filets (vom Huhn oder Schwein), 2 Eier, Paniermehl, Salz, Pfeffer, Paprikagewürz, Butter, Milch, Öl', '{"Schritt 1": "Kartoffeln schählen und klein schneiden. Anschließend in einen Topf kochenden Wasser geben zusammen mit einer guten Prise Salz. Das ganze 20 min köcheln lassen. Währenddessen den Stamm vom Blumenkohl/Brokkoli abschneiden und die einzelen Spitzen in einem Dünstaufsatz über einen Topf kochendes Wasser stellen.", "Schritt 2": "Filets auslegen und mit Salz und Paprikagewürz einreiben (Schweinefilets vorher noch klopfen, damit sie zarter werden). Die zwei Eier in einem Teller aufschlagen und verrühren. auf einen anderen Teller Paniermehl streuen. Nun die Filets erst in das Ei einlegen, anschließend im Paniermehl bedecken.", "Schritt 3": "Die Schnitzel dann in einer Pfanne bei mittlerer Temperatur mit Öl anbraten bis sie knusprig sind. Wenn der Blumenkohl/Brokolli noch leichten bis hat vom Herd nehmen. Das Wasser der Kartoffeln abgießen und die Kartoffeln dann stampfen. Dann erst ein bisschen Butter und später einen Schuss Milch unter weiteren Stampfen hinzugeben."}'),
(4, 'Omlette', 'recipes/Omlette.png', '4 Eier, Milch, Salz, Pfeffer, Öl, (Optional: Käse, Schinken, Paprika)', '{"Schritt 1": "Eier aufbrechen und in einer Schale zusammen verühren. Dazu einen Schuss Milch geben. Mit Salz und Pfeffer würzen", "Schritt 2": "Eine Pfanne mit ein bisschen Öl auf mittlere Temperatur bringen. Eier hineingeben. Fallsman Käse oder ähnliches im Omlett haben möchte nun dazugeben.", "Schritt 3": "Das ganze für ca. 5 Minuten kochen. Danach umdrehen und nochmal von der anderen Seite kochen. ODER: Kochen mit Deckel auf der Pfanne. So wird die Überseite etwas fester. Nach 10 min das Omlette in der Hälfte einklappen"}'),
(5, 'Zebrakuchen', 'recipes/Zebrakuchen.png', '300g Mehl, 1 Pck. Backpulver, 200g Zucker, 4 Eier, 250ml Speiseöl, 100ml Milch, 2EL Backkakao, 1 Pck. Vanillinzucker, 100g Puderzucker, 2-3EL Zitronensaft', '{"Schritt 1": "Backofen auf 180 Grad (Umluft: 160 Grad) vorheizen. Springform (Ø 26 cm) mit Backpapier auslegen. Mehl mit Backpulver und Zucker in einer Schüssel mischen. Eier, Öl und Milch zugeben und 2 Min. schaumig schlagen. Die Hälfte des Teiges in eine Schüssel füllen und mit Kakao und Vanillinzucker verrühren.", "Schritt 2": "Nun 2-3 EL des hellen Teiges in die Mitte des Springformbodens geben. Direkt auf den hellen Teig mittig 2-3 EL dunklen Teig geben. Der Teig fängt dadurch an nach außen zu verlaufen. Die zwei Teige auf diese Art und Weise immer von der Mitte aus verbrauchen bis der Springformboden komplett bedeckt ist. Im Backofen ca. 40 Min. backen. Nach dem Backen auf einem Kuchenrost erkalten lassen.", "Schritt 3": "Zebrakuchen aus der Form lösen und auf eine Kuchenplatte setzen. Puderzucker mit Zitronensaft verrühren und den Kuchen dünn damit bestreichen, sodass von oben noch die Marmorierung zu sehen ist. Nach Belieben bunt garnieren."}');
--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `recipe`
--
ALTER TABLE `recipe`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
