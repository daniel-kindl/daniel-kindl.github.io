/**
 * Featured Projects Component
 * Displays pinned GitHub repositories in a card layout
 */

import { logger } from '../utils/logger.js';
import { querySelector, createElement } from '../utils/domHelpers.js';
import { truncateText, getLanguageIcon, normalizeUrl } from '../utils/stringHelpers.js';
import { pinnedReposService } from '../services/pinnedReposService.js';
import { readmeModal } from './readmeModal.js';

/**
 * @typedef {Object} PinnedRepository
 * @property {string} name - Repository name
 * @property {string} description - Repository description
 * @property {string} html_url - GitHub URL
 * @property {string} language - Primary language
 * @property {string[]} topics - Repository topics
 * @property {number} stargazers_count - Star count
 * @property {number} forks_count - Fork count
 * @property {string} [homepage] - Homepage URL
 */

const CSS_CLASSES = {
  CARD: 'featured-project-card',
  HEADER: 'project-header',
  ICON: 'project-icon',
  STATS: 'project-stats',
  TECH_BADGES: 'tech-badges'
};

class FeaturedProjects {
  constructor() {
    this.container = null;
  }

  /**
   * Initialize the featured projects component
   */
  async init() {
    this.container = querySelector('#featured-projects-container');
    if (!this.container) return;

    this.showLoadingState();
    await this.loadProjects();
  }

  /**
   * Load projects from the pinned repos service
   */
  async loadProjects() {
    try {
      const repos = await pinnedReposService.getPinnedRepos();

      if (repos.length === 0) {
        this.showEmptyState();
        return;
      }

      this.renderProjects(repos);
    } catch (error) {
      logger.error('Error loading featured projects:', error);
      this.showErrorState();
    }
  }

  /**
   * Render project cards
   * @param {Array} repos - Array of repository objects
   */
  renderProjects(repos) {
    this.container.innerHTML = '';
    
    const grid = createElement('div', { className: 'featured-projects-grid' });

    repos.forEach((repo, index) => {
      const card = this.createCard(repo);
      card.style.animationDelay = `${index * 100}ms`;
      grid.appendChild(card);
    });

    this.container.appendChild(grid);
  }

  /**
   * Create a featured project card
   * @param {PinnedRepository} repo - Repository object
   * @returns {Element} Card element
   */
  createCard(repo) {
    const card = createElement('div', { className: CSS_CLASSES.CARD });

    const {
      description: rawDescription,
      language,
      stargazers_count: stars = 0,
      updated_at: updatedAt,
      homepage
    } = repo;

    const description = truncateText(rawDescription, 100);
    const languageIcon = language ? getLanguageIcon(language) : 'fas fa-code';
    const updatedDate = this.formatDate(updatedAt);
    const homepageUrl = normalizeUrl(homepage);

    card.innerHTML = `
      <div class="featured-project-header">
        <i class="fas fa-folder-open featured-project-icon"></i>
        <div class="featured-project-links">
          <button class="btn-icon quick-look" title="Quick Look" aria-label="Quick Look">
            <i class="fas fa-eye"></i>
          </button>
          ${homepageUrl ? `
            <a href="${homepageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Live Demo" title="Live Demo">
              <i class="fas fa-external-link-alt"></i>
            </a>
          ` : ''}
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repo" title="GitHub Repo">
            <i class="fab fa-github"></i>
          </a>
        </div>
      </div>
      <h3 class="featured-project-title">${repo.name}</h3>
      <p class="featured-project-description">${description}</p>
      <div class="featured-project-footer">
        <div class="featured-project-meta">
          ${repo.language ? `
            <span class="featured-project-language">
              <i class="${languageIcon}"></i> ${repo.language}
            </span>
          ` : ''}
          <span class="featured-project-stars">
            <i class="fas fa-star"></i> ${stars}
          </span>
          <span class="featured-project-updated">
            <i class="fas fa-clock"></i> ${updatedDate}
          </span>
        </div>
        ${repo.topics && repo.topics.length > 0 ? `
          <div class="featured-project-topics">
            ${repo.topics.slice(0, 3).map(topic => `<span class="featured-project-topic">${topic}</span>`).join('')}
          </div>
        ` : ''}
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
   * Format date to relative time string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  /**
   * Show loading state with skeleton cards
   */
  showLoadingState() {
    const skeletons = [];
    for (let i = 0; i < 3; i++) {
      skeletons.push(`
        <div class="featured-project-card skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton skeleton-icon"></div>
          </div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-description"></div>
          <div class="skeleton skeleton-description short"></div>
          <div class="skeleton-meta">
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-badge"></div>
          </div>
        </div>
      `);
    }

    this.container.innerHTML = `
      <div class="featured-projects-grid">
        ${skeletons.join('')}
      </div>
    `;
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    this.container.innerHTML = `
      <p class="featured-projects-empty">No featured projects available.</p>
    `;
  }

  /**
   * Show error state
   */
  showErrorState() {
    this.container.innerHTML = `
      <p class="featured-projects-error">Failed to load featured projects.</p>
    `;
  }
}

export const featuredProjects = new FeaturedProjects();
