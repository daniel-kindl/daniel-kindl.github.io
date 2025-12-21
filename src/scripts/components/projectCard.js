/**
 * Project Card Component
 * Creates and manages project card elements
 */

import { createElement } from '../utils/domHelpers.js';
import { truncateText, getLanguageIcon, normalizeUrl } from '../utils/stringHelpers.js';
import { config } from '../config.js';
import { readmeModal } from './readmeModal.js';

/**
 * @typedef {Object} Repository
 * @property {string} name - Repository name
 * @property {string} description - Repository description
 * @property {string} html_url - GitHub URL
 * @property {string} language - Primary language
 * @property {string[]} topics - Repository topics/tags
 * @property {number} stargazers_count - Number of stars
 * @property {number} forks_count - Number of forks
 * @property {string} [homepage] - Project homepage URL
 */

const CSS_CLASSES = {
  CARD: 'project-card',
  HEADER: 'project-header',
  TOP: 'project-top',
  ICON: 'project-icon',
  LINKS: 'project-links',
  BTN_ICON: 'btn-icon',
  QUICK_LOOK: 'quick-look'
};

class ProjectCard {
  /**
   * Create a project card element
   * @param {Repository} repo - Repository object
   * @returns {Element} Project card element
   */
  create(repo) {
    const card = createElement('div', { className: CSS_CLASSES.CARD });

    const {
      description: rawDescription,
      language,
      topics = [],
      stargazers_count: stars = 0,
      forks_count: forks = 0,
      homepage
    } = repo;

    const description = truncateText(rawDescription);
    
    // Combine primary language and topics
    const languages = [language, ...topics]
      .filter(Boolean)
      .filter((item, index, self) => self.indexOf(item) === index);

    const techBadges = this.createTechBadges(languages);
    const { project: projectIcon } = config.defaultIcons;

    // Determine external link URL
    // Priority: 1. repo.homepage (GitHub API field), 2. URL from description
    let homepageUrl = normalizeUrl(homepage);
    
    // If homepage is not available or invalid, try to extract URL from description
    if (!homepageUrl && rawDescription) {
      const urlMatch = rawDescription.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        homepageUrl = normalizeUrl(urlMatch[0]);
      }
    }

    card.innerHTML = `
        <div class="${CSS_CLASSES.HEADER}">
          <div class="${CSS_CLASSES.TOP}">
            <i class="${projectIcon} ${CSS_CLASSES.ICON}"></i>
            <div class="${CSS_CLASSES.LINKS}">
              <button class="${CSS_CLASSES.BTN_ICON} ${CSS_CLASSES.QUICK_LOOK}" title="Quick Look" aria-label="Quick Look">
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
