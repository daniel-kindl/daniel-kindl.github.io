/**
 * Scroll Top Component
 * Handles the scroll-to-top button visibility and functionality
 */

import { querySelector } from '../utils/domHelpers.js';

class ScrollTop {
  constructor() {
    this.button = null;
    this.scrollThreshold = 500;
  }

  /**
   * Initialize the scroll top component
   */
  init() {
    // Create button if it doesn't exist
    if (!document.querySelector('.scroll-top-btn')) {
      this.createButton();
    }

    this.button = querySelector('.scroll-top-btn');
    
    if (this.button) {
      this.attachScrollListener();
      this.attachClickListener();
    }
  }

  /**
   * Create the scroll top button element
   */
  createButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);
  }

  /**
   * Attach scroll listener to toggle visibility
   */
  attachScrollListener() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.scrollThreshold) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    });
  }

  /**
   * Attach click listener to scroll to top
   */
  attachClickListener() {
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

export const scrollTop = new ScrollTop();
