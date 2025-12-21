/**
 * Logger Utility
 * Provides environment-aware logging
 */

const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

export const logger = {
  log: isDevelopment ? console.log.bind(console) : () => {},
  error: console.error.bind(console),
  warn: console.warn.bind(console)
};
