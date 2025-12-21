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

/**
 * Normalize and validate a URL
 * Handles missing protocols and validates the URL format
 * @param {string} url - URL to normalize
 * @returns {string|null} Normalized URL or null if invalid
 */
export function normalizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Trim whitespace
  url = url.trim();
  
  if (!url) {
    return null;
  }
  
  // If URL doesn't start with http:// or https://, try to add https://
  if (!/^https?:\/\//i.test(url)) {
    // Check if it looks like a domain (contains a dot and no spaces)
    if (url.includes('.') && !url.includes(' ')) {
      url = 'https://' + url;
    } else {
      return null;
    }
  }
  
  // Validate URL using URL constructor
  try {
    const validUrl = new URL(url);
    if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
      return null;
    }
    return validUrl.href;
  } catch (error) {
    return null;
  }
}
