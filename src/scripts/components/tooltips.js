/**
 * Tooltips Component
 * Initializes Tippy.js tooltips for elements
 */

import { logger } from '../utils/logger.js';

class Tooltips {
  init() {
    if (typeof tippy === 'undefined') {
      logger.warn('Tippy.js library not loaded');
      return;
    }

    // Initialize tooltips for elements with aria-label
    tippy('[aria-label]', {
      content(reference) {
        return reference.getAttribute('aria-label');
      },
      animation: 'scale',
      theme: 'translucent',
      placement: 'top',
      arrow: true,
    });

    // Initialize tooltips for elements with data-tippy-content
    tippy('[data-tippy-content]', {
      animation: 'scale',
      theme: 'translucent',
      placement: 'top',
      arrow: true,
    });
  }
}

export const tooltips = new Tooltips();
