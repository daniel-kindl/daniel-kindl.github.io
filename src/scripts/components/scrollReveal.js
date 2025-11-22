/**
 * Scroll Reveal Component
 * Animates elements as they scroll into view
 */

import { querySelectorAll } from '../utils/domHelpers.js';

class ScrollReveal {
  constructor() {
    this.elements = [];
    this.observer = null;
  }

  /**
   * Initialize scroll reveal
   */
  init() {
    this.elements = querySelectorAll('.reveal');
    this.setupObserver();
    this.observeElements();
  }

  /**
   * Setup Intersection Observer
   */
  setupObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          this.observer.unobserve(entry.target); // Only animate once
        }
      });
    }, options);
  }

  /**
   * Observe all reveal elements
   */
  observeElements() {
    this.elements.forEach(el => {
      this.observer.observe(el);
    });
  }
}

export const scrollReveal = new ScrollReveal();
