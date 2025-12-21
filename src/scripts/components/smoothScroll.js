/**
 * Smooth Scroll Component
 * Implements momentum scrolling using Lenis
 */

import { logger } from '../utils/logger.js';

class SmoothScroll {
  constructor() {
    this.lenis = null;
    this.rafCallback = this.raf.bind(this);
    this.anchorClickHandler = null;
  }

  init() {
    if (typeof Lenis === 'undefined') {
      logger.warn('Lenis library not loaded');
      return;
    }

    // Initialize Lenis
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Connect Lenis to requestAnimationFrame
    requestAnimationFrame(this.rafCallback);

    // Use event delegation for anchor links
    this.anchorClickHandler = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        this.lenis.scrollTo(target);
      }
    };
    document.addEventListener('click', this.anchorClickHandler);
  }

  raf(time) {
    this.lenis.raf(time);
    requestAnimationFrame(this.rafCallback); // Reuse bound function
  }

  /**
   * Stop scrolling (e.g. when modal is open)
   */
  stop() {
    this.lenis.stop();
  }

  /**
   * Resume scrolling
   */
  start() {
    this.lenis.start();
  }

  destroy() {
    if (this.anchorClickHandler) {
      document.removeEventListener('click', this.anchorClickHandler);
    }
  }
}

export const smoothScroll = new SmoothScroll();
