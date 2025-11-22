/**
 * Experience Timeline Component
 * Renders the work experience timeline from config
 */

import { querySelector, createElement } from '../utils/domHelpers.js';
import { config } from '../config.js';

class ExperienceTimeline {
  constructor() {
    this.container = null;
  }

  /**
   * Initialize the timeline
   */
  init() {
    this.container = querySelector('#experience-container');
    if (!this.container) return;

    this.render();
  }

  /**
   * Render the timeline items
   */
  render() {
    const { experience } = config;

    if (!experience || experience.length === 0) return;

    const timeline = createElement('div', { className: 'timeline' });

    experience.forEach((item, index) => {
      const timelineItem = this.createTimelineItem(item, index);
      timeline.appendChild(timelineItem);
    });

    this.container.appendChild(timeline);
  }

  /**
   * Create a single timeline item
   * @param {Object} item - Experience data
   * @param {number} index - Index for animation delay
   */
  createTimelineItem(item, index) {
    const el = createElement('div', { 
      className: `timeline-item reveal reveal-delay-${(index % 3) + 1}` 
    });

    const techTags = item.technologies
      ? `<div class="timeline-tech">
          ${item.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
         </div>`
      : '';

    el.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <div class="timeline-date">${item.period}</div>
          ${item.location ? `<div class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${item.location}</div>` : ''}
        </div>
        <h3 class="timeline-role">${item.role}</h3>
        <h4 class="timeline-company">${item.company}</h4>
        <p class="timeline-description">${item.description}</p>
        ${techTags}
      </div>
    `;

    return el;
  }
}

export const experienceTimeline = new ExperienceTimeline();
