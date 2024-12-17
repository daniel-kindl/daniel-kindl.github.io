"use client"

import React from 'react';
import styles from '../styles/Footer.module.css';

function Footer() 
{
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.socialIcons}>
          <a href="https://github.com" className={styles.socialIcon} target="https://github.com/daniel-kindl" rel="noopener noreferrer">
            <img src="/github-icon.svg" alt="GitHub" />
          </a>
          <a href="https://linkedin.com" className={styles.socialIcon} target="https://www.linkedin.com/in/kindldaniel" rel="noopener noreferrer">
            <img src="/linkedin-icon.svg" alt="LinkedIn" />
          </a>
        </div>
        <p className={styles.copyRight}>© 2024 Daniel Kindl. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;