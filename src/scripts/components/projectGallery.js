/**
 * Project Gallery Component
 * Manages the project grid, filtering, and interactions
 */

import { querySelector, createElement } from '../utils/domHelpers.js';
import { projectCard } from './projectCard.js';
import { githubService } from '../services/githubService.js';
import { loadingSkeleton } from './loadingSkeleton.js';
import { config } from '../config.js';

class ProjectGallery {
  constructor() {
    this.container = null;
    this.filterContainer = null;
    this.gridContainer = null;
    this.loadMoreBtn = null;
    this.projects = [];
    this.activeFilter = 'All';
    this.visibleCount = config.github.projectsPerPage;
  }

  /**
   * Initialize the project gallery
   */
  async init() {
    this.container = querySelector('#projects-container');
    if (!this.container) return;

    // Create structure
    this.createStructure();
    
    // Load data
    this.loadProjects();
  }

  /**
   * Create the DOM structure for filters and grid
   */
  createStructure() {
    this.filterContainer = createElement('div', { className: 'filter-container' });
    this.gridContainer = createElement('div', { className: 'projects-grid' });
    
    this.container.appendChild(this.filterContainer);
    this.container.appendChild(this.gridContainer);
  }

  /**
   * Load projects from GitHub
   */
  async loadProjects() {
    this.showLoadingState();

    try {
      const githubProjects = await githubService.fetchAllRepositories();
      const featured = config.featuredProjects || [];
      
      // Create a Set of featured URLs to avoid duplicates
      // We normalize to lowercase to ensure case-insensitive comparison
      const featuredUrls = new Set(featured.map(p => p.html_url.toLowerCase()));
      
      // Filter github projects that are not in featured
      const uniqueGithubProjects = githubProjects.filter(p => !featuredUrls.has(p.html_url.toLowerCase()));
      
      // Merge: Featured first, then the rest
      this.projects = [...featured, ...uniqueGithubProjects];

      if (this.projects.length === 0) {
        this.showEmptyState();
        return;
      }
      
      this.renderFilters();
      this.renderProjects();
      
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to featured projects from config on error
      if (config.featuredProjects && config.featuredProjects.length > 0) {
        this.projects = config.featuredProjects;
        this.renderFilters();
        this.renderProjects();
      } else {
        this.showErrorState();
      }
    }
  }

  /**
   * Render filter buttons based on available languages
   */
  renderFilters() {
    // Extract all unique languages/topics
    const languages = new Set(['All']);
    this.projects.forEach(repo => {
      if (repo.language) languages.add(repo.language);
      if (repo.topics) repo.topics.forEach(topic => languages.add(topic));
    });

    // Create buttons
    this.filterContainer.innerHTML = '';
    // Convert to array and sort
    Array.from(languages).sort().forEach(lang => {
      const btn = createElement('button', { 
        className: `filter-btn ${lang === this.activeFilter ? 'active' : ''}`,
        'data-filter': lang
      }, lang);
      
      btn.addEventListener('click', () => this.handleFilterClick(lang));
      this.filterContainer.appendChild(btn);
    });
  }

  /**
   * Handle filter button click
   * @param {string} filter - Selected filter
   */
  handleFilterClick(filter) {
    if (this.activeFilter === filter) return;

    this.activeFilter = filter;
    this.visibleCount = config.github.projectsPerPage; // Reset visible count
    
    // Update buttons UI
    const buttons = this.filterContainer.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Animate grid out, then render new items
    this.gridContainer.style.opacity = '0';
    this.gridContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      this.renderProjects();
      this.gridContainer.style.opacity = '1';
      this.gridContainer.style.transform = 'translateY(0)';
    }, 300);
  }

  /**
   * Render projects based on active filter
   */
  renderProjects() {
    this.gridContainer.innerHTML = '';

    // Remove existing load more button if any
    if (this.loadMoreBtn) {
      this.loadMoreBtn.remove();
      this.loadMoreBtn = null;
    }

    const filteredProjects = this.activeFilter === 'All'
      ? this.projects
      : this.projects.filter(repo => {
          const tags = [repo.language, ...(repo.topics || [])].filter(Boolean);
          return tags.includes(this.activeFilter);
        });

    if (filteredProjects.length === 0) {
      this.gridContainer.innerHTML = '<p class="no-results">No projects found for this category.</p>';
      return;
    }

    // Slice projects based on visible count
    const projectsToShow = filteredProjects.slice(0, this.visibleCount);

    projectsToShow.forEach((repo, index) => {
      const card = projectCard.create(repo);
      
      // Add animation delay for staggered appearance
      card.style.animationDelay = `${index * 50}ms`;
      
      this.gridContainer.appendChild(card);
    });

    // Show Load More button if there are more projects
    if (filteredProjects.length > this.visibleCount) {
      this.renderLoadMoreButton();
    }
  }

  /**
   * Render Load More button
   */
  renderLoadMoreButton() {
    this.loadMoreBtn = createElement('button', { 
      className: 'btn btn-secondary load-more-btn',
      style: 'margin: 3rem auto 0; display: flex;'
    }, 'Load More');
    
    this.loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More';
    
    this.loadMoreBtn.addEventListener('click', () => {
      this.visibleCount += config.github.projectsPerPage;
      this.renderProjects();
    });
    
    this.container.appendChild(this.loadMoreBtn);
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    // We can use the existing skeleton loader but adapted for grid
    // For now, let's just put a simple loading message or use the skeleton if it supports grid
    // Assuming loadingSkeleton.show appends to the target
    if (this.gridContainer) {
        loadingSkeleton.show('.projects-grid', 6);
    }
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    if (this.gridContainer) {
        this.gridContainer.innerHTML = '<p class="text-center">No projects found.</p>';
    }
  }

  /**
   * Show error state
   */
  showErrorState() {
    if (this.gridContainer) {
        this.gridContainer.innerHTML = '<p class="text-center error">Failed to load projects.</p>';
    }
  }
}

export const projectGallery = new ProjectGallery();
