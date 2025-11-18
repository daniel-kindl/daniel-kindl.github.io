/**
 * Footer Component
 * Manages footer dynamic content
 */

import { setTextContent } from '../utils/domHelpers.js';

class Footer {
  /**
   * Initialize footer
   */
  init() {
    this.setCurrentYear();
  }

  /**
   * Set current year in footer
   */
  setCurrentYear() {
    const currentYear = new Date().getFullYear();
    setTextContent('#footer-year', currentYear.toString());
  }
}

export const footer = new Footer();
