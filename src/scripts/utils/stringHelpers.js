/**
 * String Helper Utilities
 * Utility functions for string manipulation
 */

import { config } from '../config.js';

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = config.ui.projectDescriptionMaxLength) {
  if (!text || text.length <= maxLength) {
    return text || 'No description available';
  }

  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Get icon class for a programming language
 * @param {string} language - Programming language name
 * @returns {string} Font Awesome icon class
 */
export function getLanguageIcon(language) {
  return config.languageIcons[language] || config.defaultIcons.language;
}
