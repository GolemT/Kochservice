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
(1, 'Crepes', '', '2 Eier, 250ml Milch, 160g Mehl, 1 Prise Zucker, 1 Prise Salz, 1 TL Butter', '{\r\n    \"Schritt 1\": \"Mehl mit Zucker und Salz vermischen. Eier und Milch hinzufügen und mit einem Schneebesen oder dem Handrührgerät zu einem glatten Teig verrühren.\",\r\n                \"Schritt 2\": \"Eine Pfanne auf mittlere Stufe erhitzen. Butter in die Pfanne geben und flüssig werden lassen\",\r\n                \"Schritt 3\": \"Eine Kelle des Teigs in die Pfanne gießen und durch schwenken der Pfanne verteilen.\",\r\n                \"Schritt 4\": \"Nach ein paar Minuten den nun festeren Teig wenden. Die obere Seite sollte nun leicht braun angebacken sein. Wenn nicht braucht diese Seite noch ein paar Minuten\",\r\n                \"Schritt 5\": \"Wenn beide Seiten leicht braun angebacken sind den Crepe von der Pfanne nehmen. Nun mit aufstrich der Wahl bedecken. Empfehlungen sind: Zucker, Nutella, Marmelade, Erdnussbutter\"\r\n}');

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
