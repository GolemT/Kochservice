import Link from "next/link";
import randomID from "./logic";
import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css'; // Import the CSS module
import Image from "next/image";
import HamburgerMenu from '../public/Menu_icon.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  const num = randomID();

  return (
    <div className={styles.headbar}>
      <span className={styles.menu} onClick={openNav}>
        <Image className={styles.menu} src={HamburgerMenu} alt="menu" width={50} height={50}/>
      </span>
      <span className={styles.header}>
        <Link href="/">GolemT's Kochservice</Link>
      </span>
      <span className={styles.sitename}>
        Searchbar
      </span>
      <div id="sidenav" className={`${isOpen ? styles.opensidenav : styles.sidenav}`}>
        <a onClick={closeNav} className={styles.closebtn}>&times;</a>
        <Link href="/">Home</Link>
        <Link href="/rezepte">Rezepte</Link>
        <Link href={`/gericht?ID=${num}`}>Random</Link>
        <Link href="/vorschlaege">Vorschläge</Link>
        <Link href="/kontakt">Kontakt</Link>
      </div>
    </div>
  );
};

export default Navbar;
