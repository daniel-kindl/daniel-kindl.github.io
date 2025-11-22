/**
 * Project Card Component
 * Creates and manages project card elements
 */

import { createElement } from '../utils/domHelpers.js';
import { truncateText, getLanguageIcon } from '../utils/stringHelpers.js';
import { config } from '../config.js';
import { readmeModal } from './readmeModal.js';

class ProjectCard {
  /**
   * Create a project card element
   * @param {Object} repo - Repository object
   * @returns {Element} Project card element
   */
  create(repo) {
    const card = createElement('div', { className: 'project-card' });

    const description = truncateText(repo.description);
    
    // Combine primary language and topics
    const languages = [repo.language, ...(repo.topics || [])]
      .filter(Boolean) // Remove null/undefined
      .filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates

    const techBadges = this.createTechBadges(languages);
    const projectIcon = config.defaultIcons.project;
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;

    // Check for homepage or extract URL from description
    let homepageUrl = repo.homepage;
    if (!homepageUrl && repo.description) {
      const urlMatch = repo.description.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        homepageUrl = urlMatch[0];
      }
    }

    card.innerHTML = `
        <div class="project-header">
          <div class="project-top">
            <i class="${projectIcon} project-icon"></i>
            <div class="project-links">
              <button class="btn-icon quick-look" title="Quick Look" aria-label="Quick Look">
                <i class="fas fa-eye"></i>
              </button>
              ${homepageUrl ? `
                <a href="${homepageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                  <i class="fas fa-external-link-alt"></i>
                </a>
              ` : ''}
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repo">
                <i class="fab fa-github"></i>
              </a>
            </div>
          </div>
          <h3 class="project-title">${repo.name}</h3>
          <p class="project-description">${description}</p>
        </div>
        
        <div class="project-footer">
          <div class="project-tech">
            ${techBadges}
          </div>
          <div class="project-stats">
            <span title="Stars"><i class="fas fa-star"></i> ${stars}</span>
            <span title="Forks"><i class="fas fa-code-branch"></i> ${forks}</span>
          </div>
        </div>
    `;

    // Attach Quick Look listener
    const quickLookBtn = card.querySelector('.quick-look');
    if (quickLookBtn) {
      quickLookBtn.addEventListener('click', () => {
        readmeModal.open(repo.html_url);
      });
    }

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
