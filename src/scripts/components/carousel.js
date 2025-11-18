/**
 * Carousel Component
 * Manages 3D carousel functionality for projects
 */

import { querySelector, querySelectorAll } from '../utils/domHelpers.js';
import { projectCard } from './projectCard.js';
import { githubService } from '../services/githubService.js';
import { loadingSkeleton } from './loadingSkeleton.js';

class Carousel {
  constructor() {
    this.carouselElement = null;
    this.prevButton = null;
    this.nextButton = null;
    this.currentIndex = 0;
    this.cards = [];
  }

  /**
   * Initialize the carousel
   */
  async init() {
    this.carouselElement = querySelector('#carousel-3d');
    this.prevButton = querySelector('.prev-btn');
    this.nextButton = querySelector('.next-btn');

    if (!this.carouselElement) {
      console.error('Carousel element not found');
      return;
    }

    await this.loadProjects();
  }

  /**
   * Load projects from GitHub
   */
  async loadProjects() {
    this.showLoadingState();

    try {
      const repos = await githubService.fetchAllRepositories();

      if (repos.length === 0) {
        this.showEmptyState();
        return;
      }

      const projects = await githubService.fetchRepositoriesWithLanguages(repos);
      this.renderProjects(projects);
      this.attachEventListeners();
      this.updateCarousel();
    } catch (error) {
      console.error('Error loading projects:', error);
      this.showErrorState();
    }
  }

  /**
   * Render projects into the carousel
   * @param {Array} projects - Array of project objects
   */
  renderProjects(projects) {
    this.carouselElement.innerHTML = '';

    projects.forEach(({ repo, languages }) => {
      const card = projectCard.create(repo, languages);
      this.carouselElement.appendChild(card);
    });

    this.cards = querySelectorAll('.project-card');
    
    // Ensure at least one card is visible
    if (this.cards.length > 0) {
      this.currentIndex = 0;
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.previous());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    // Click on cards to center them
    this.cards.forEach((card, index) => {
      card.addEventListener('click', () => this.goToIndex(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      this.previous();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }

  /**
   * Go to previous slide
   */
  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.updateCarousel();
  }

  /**
   * Go to next slide
   */
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.updateCarousel();
  }

  /**
   * Go to specific index
   * @param {number} index - Target index
   */
  goToIndex(index) {
    if (this.cards[index] && !this.cards[index].classList.contains('active')) {
      this.currentIndex = index;
      this.updateCarousel();
    }
  }

  /**
   * Update carousel positions
   */
  updateCarousel() {
    if (!this.cards || this.cards.length === 0) {
      return;
    }

    this.cards.forEach((card, index) => {
      // Remove all position classes
      card.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2', 'hidden');
      
      // Force display
      card.style.display = 'flex';
      card.style.visibility = 'visible';

      // Calculate position relative to current index
      const position = (index - this.currentIndex + this.cards.length) % this.cards.length;

      if (position === 0) {
        card.classList.add('active');
      } else if (position === 1) {
        card.classList.add('right-1');
      } else if (position === 2) {
        card.classList.add('right-2');
      } else if (position === this.cards.length - 1) {
        card.classList.add('left-1');
      } else if (position === this.cards.length - 2) {
        card.classList.add('left-2');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    loadingSkeleton.show('#carousel-3d', 5);
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    this.carouselElement.innerHTML = '<p style="color: var(--text-secondary);">No projects found.</p>';
  }

  /**
   * Show error state
   */
  showErrorState() {
    this.carouselElement.innerHTML = '<p style="color: var(--text-secondary);">Failed to load projects. Please try again later.</p>';
  }
}

export const carousel = new Carousel();
