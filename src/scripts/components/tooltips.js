/**
 * Tooltips Component
 * Initializes Tippy.js tooltips for elements
 */

class Tooltips {
  init() {
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
