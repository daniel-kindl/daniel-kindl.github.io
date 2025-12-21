/**
 * Safe localStorage wrapper
 * Handles errors from private browsing, quota exceeded, etc.
 */

import { logger } from './logger.js';

export const safeLocalStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.warn('localStorage getItem failed:', error);
      return null;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logger.warn('localStorage setItem failed:', error);
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.warn('localStorage removeItem failed:', error);
    }
  }
};
