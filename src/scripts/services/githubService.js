/**
 * GitHub Service
 * Fetches repository data from the pre-built static cache file.
 * Falls back to an empty array if the file is unavailable.
 */

import { logger } from '../utils/logger.js';

class GitHubService {
  /**
   * Fetch all public repositories from the static cache.
   * @returns {Promise<Array>} Array of repository objects
   */
  async fetchAllRepositories() {
    try {
      const response = await fetch('/data/github-repos.json');
      if (response.ok) {
        const data = await response.json();
        if (data && data.repos && data.repos.length > 0) {
          return data.repos;
        }
      }
    } catch (e) {
      logger.error('Error loading github-repos.json:', e);
    }
    return [];
  }
}

export const githubService = new GitHubService();
