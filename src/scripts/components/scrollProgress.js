/**
 * Scroll Progress Component
 * Shows a progress bar at the top of the page indicating scroll position
 */

import { createElement } from '../utils/domHelpers.js';

class ScrollProgress {
  constructor() {
    this.progressBar = null;
  }

  /**
   * Initialize the scroll progress component
   */
  init() {
    this.createProgressBar();
    this.attachScrollListener();
  }

  /**
   * Create the progress bar element
   */
  createProgressBar() {
    this.progressBar = createElement('div', { className: 'scroll-progress' });
    document.body.appendChild(this.progressBar);
  }

  /**
   * Attach scroll listener to update progress
   */
  attachScrollListener() {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      if (this.progressBar) {
        this.progressBar.style.width = `${scrolled}%`;
      }
    });
  }
}

export const scrollProgress = new ScrollProgress();
