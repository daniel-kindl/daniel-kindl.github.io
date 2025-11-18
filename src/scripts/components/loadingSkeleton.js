/**
 * Loading Skeleton Component
 * Shows animated placeholder cards while content loads
 */

import { querySelector } from '../utils/domHelpers.js';

class LoadingSkeleton {
  /**
   * Create skeleton loader HTML
   * @param {number} count - Number of skeleton cards to show
   * @returns {string} HTML string
   */
  createSkeleton(count = 5) {
    const skeletons = [];
    
    for (let i = 0; i < count; i++) {
      skeletons.push(`
        <div class="project-card skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton skeleton-title"></div>
          </div>
          <div class="skeleton skeleton-description"></div>
          <div class="skeleton skeleton-description short"></div>
          <div class="skeleton-tech">
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-badge"></div>
          </div>
          <div class="skeleton skeleton-link"></div>
        </div>
      `);
    }
    
    return skeletons.join('');
  }

  /**
   * Show skeleton in specified element
   * @param {string} selector - CSS selector
   * @param {number} count - Number of cards
   */
  show(selector, count = 5) {
    const element = querySelector(selector);
    if (element) {
      element.innerHTML = this.createSkeleton(count);
    }
  }
}

export const loadingSkeleton = new LoadingSkeleton();
