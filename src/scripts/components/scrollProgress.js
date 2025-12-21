/**
 * Scroll Progress Component
 * Shows a progress bar at the top of the page indicating scroll position
 */

import { createElement } from '../utils/domHelpers.js';

class ScrollProgress {
  constructor() {
    this.progressBar = null;
    this.scrollHandler = null;
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
    this.scrollHandler = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      if (this.progressBar) {
        this.progressBar.style.width = `${scrolled}%`;
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  destroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}

export const scrollProgress = new ScrollProgress();
