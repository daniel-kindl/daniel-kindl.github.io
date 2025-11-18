/**
 * Project Card Component
 * Creates and manages project card elements
 */

import { createElement } from '../utils/domHelpers.js';
import { truncateText, getLanguageIcon } from '../utils/stringHelpers.js';
import { config } from '../config.js';

class ProjectCard {
  /**
   * Create a project card element
   * @param {Object} repo - Repository object
   * @param {Array<string>} languages - Array of language names
   * @returns {Element} Project card element
   */
  create(repo, languages) {
    const card = createElement('div', { className: 'project-card' });

    const description = truncateText(repo.description);
    const techBadges = this.createTechBadges(languages);
    const projectIcon = config.defaultIcons.project;

    card.innerHTML = `
      <div class="project-header">
        <h3 class="project-title">
          <i class="${projectIcon}"></i> ${repo.name}
        </h3>
      </div>
      <p class="project-description">${description}</p>
      <div class="project-tech">
        ${techBadges}
      </div>
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
        <i class="fab fa-github"></i> View on GitHub
      </a>
    `;

    return card;
  }

  /**
   * Create tech badge HTML
   * @param {Array<string>} languages - Array of language names
   * @returns {string} HTML string of tech badges
   */
  createTechBadges(languages) {
    if (!languages || languages.length === 0) {
      return `<span class="tech-badge">
        <i class="${config.defaultIcons.language}"></i> No languages detected
      </span>`;
    }

    return languages
      .slice(0, config.github.maxLanguagesPerProject)
      .map(lang => {
        const icon = getLanguageIcon(lang);
        return `<span class="tech-badge"><i class="${icon}"></i> ${lang}</span>`;
      })
      .join('');
  }
}

export const projectCard = new ProjectCard();
