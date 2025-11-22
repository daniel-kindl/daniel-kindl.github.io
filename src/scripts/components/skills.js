/**
 * Skills Component
 * Renders the skills grid from config
 */

import { querySelector, createElement } from '../utils/domHelpers.js';
import { config } from '../config.js';

class Skills {
  constructor() {
    this.container = null;
  }

  /**
   * Initialize the skills component
   */
  init() {
    this.container = querySelector('.skills-grid');
    if (!this.container) return;

    // Clear existing content (if any)
    this.container.innerHTML = '';
    
    this.render();
  }

  /**
   * Render the skills categories
   */
  render() {
    const { skills } = config;

    if (!skills || skills.length === 0) return;

    skills.forEach((category, index) => {
      const categoryEl = this.createCategory(category, index);
      this.container.appendChild(categoryEl);
    });
  }

  /**
   * Create a skill category element
   * @param {Object} category - Category data
   * @param {number} index - Index for animation delay
   */
  createCategory(category, index) {
    const el = createElement('div', { 
      className: `skill-category reveal reveal-delay-${(index % 2) + 1}` 
    });

    const tagsHtml = category.items.map(item => `
      <span class="tag">
        <i class="${item.icon}"></i> ${item.name}
      </span>
    `).join('');

    el.innerHTML = `
      <h3><i class="${category.icon}"></i> ${category.category}</h3>
      <div class="skill-tags">
        ${tagsHtml}
      </div>
    `;

    return el;
  }
}

export const skills = new Skills();
