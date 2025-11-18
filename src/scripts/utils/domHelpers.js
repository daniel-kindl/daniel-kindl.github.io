/**
 * DOM Helper Utilities
 * Utility functions for DOM manipulation
 */

/**
 * Query selector with error handling
 * @param {string} selector - CSS selector
 * @returns {Element|null} DOM element or null
 */
export function querySelector(selector) {
  return document.querySelector(selector);
}

/**
 * Query all selectors
 * @param {string} selector - CSS selector
 * @returns {NodeList} NodeList of elements
 */
export function querySelectorAll(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Create an element with optional attributes
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string} innerHTML - Inner HTML content
 * @returns {Element} Created DOM element
 */
export function createElement(tag, attributes = {}, innerHTML = '') {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
}

/**
 * Add event listener with optional delegation
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {string} selector - Optional selector for delegation
 */
export function addEventDelegate(element, event, handler, selector = null) {
  if (selector) {
    element.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        handler(e);
      }
    });
  } else {
    element.addEventListener(event, handler);
  }
}

/**
 * Set text content safely
 * @param {string} selector - CSS selector
 * @param {string} text - Text content
 */
export function setTextContent(selector, text) {
  const element = querySelector(selector);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Set inner HTML safely
 * @param {string} selector - CSS selector
 * @param {string} html - HTML content
 */
export function setInnerHTML(selector, html) {
  const element = querySelector(selector);
  if (element) {
    element.innerHTML = html;
  }
}
