/**
 * Theme Toggle Component
 * Handles switching between light and dark themes
 */

import { querySelector } from '../utils/domHelpers.js';

class ThemeToggle {
  constructor() {
    this.toggleBtn = null;
    this.icon = null;
    this.theme = localStorage.getItem('theme') || 'dark';
  }

  /**
   * Initialize the theme toggle
   */
  init() {
    this.toggleBtn = querySelector('.theme-toggle');
    this.icon = this.toggleBtn?.querySelector('i');

    if (this.toggleBtn) {
      // Set initial theme
      this.setTheme(this.theme);
      
      // Attach click listener
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(this.theme);
  }

  /**
   * Set the theme
   * @param {string} theme - 'light' or 'dark'
   */
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    if (this.icon) {
      this.icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
}

export const themeToggle = new ThemeToggle();
