/**
 * Pinned Repos Service
 * Fetches pinned repositories data from the static JSON file
 * Falls back to config.featuredProjects if fetch fails
 */

import { config } from '../config.js';

class PinnedReposService {
  constructor() {
    this.dataUrl = '/data/pinned-repos.json';
  }

  /**
   * Fetch pinned repositories from the static JSON file
   * @returns {Promise<Array>} Array of repository objects
   */
  async getPinnedRepos() {
    try {
      const response = await fetch(this.dataUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if data has repos and is not empty
      if (data && data.repos && data.repos.length > 0) {
        return data.repos;
      }

      // Fall back to config if repos array is empty
      return this.getFallbackProjects();
    } catch (error) {
      console.error('Error fetching pinned repos:', error);
      return this.getFallbackProjects();
    }
  }

  /**
   * Get fallback projects from config
   * @returns {Array} Array of featured projects from config
   */
  getFallbackProjects() {
    return config.featuredProjects || [];
  }
}

export const pinnedReposService = new PinnedReposService();
