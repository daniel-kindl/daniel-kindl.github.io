"use client"

import React, { useState } from 'react';
import styles              from '../styles/Navbar.module.css';

function Navbar() 
{
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <ul className={`${styles.navMenu}`}>
          <li>
            <a href="#home" className={styles.navbarLink}>Home</a>
          </li>
          <li>
            <a href="#about" className={styles.navbarLink}>About</a>
          </li>
          <li>
            <a href="#projects" className={styles.navbarLink}>Projects</a>
          </li>
          <li>
            <a href="#contact" className={styles.navbarLink}>Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;