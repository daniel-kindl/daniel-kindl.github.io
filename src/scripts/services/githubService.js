/**
 * GitHub Service
 * Handles all GitHub API interactions
 */

import { logger } from '../utils/logger.js';
import { safeLocalStorage } from '../utils/storage.js';
import { config } from '../config.js';

class GitHubService {
  constructor() {
    this.baseUrl = config.github.apiBaseUrl;
    this.username = config.github.username;
    this.cacheKey = 'github_portfolio_data_v2';
    this.cacheDuration = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Get data from cache if valid
   * @returns {Array|null} Cached data or null
   */
  getFromCache() {
    const cached = safeLocalStorage.getItem(this.cacheKey);
    if (!cached) return null;

    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < this.cacheDuration) {
        return data;
      }
    } catch (error) {
      logger.error('Error parsing cache:', error);
    }
    return null;
  }

  /**
   * Save data to cache
   * @param {Array} data - Data to cache
   */
  saveToCache(data) {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data
      };
      safeLocalStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      logger.error('Error saving to cache:', error);
    }
  }

  /**
   * Fetch all public repositories for the configured user
   * @returns {Promise<Array>} Array of repository objects
   */
  async fetchAllRepositories() {
    // Check cache first
    const cachedData = this.getFromCache();
    if (cachedData) {
      logger.log('Using cached GitHub data');
      return cachedData;
    }

    try {
      const url = `${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=100`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();

      const filteredRepos = repos
        .filter(repo => !repo.fork && !config.github.excludedRepos.includes(repo.name))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      // Save to cache
      this.saveToCache(filteredRepos);

      return filteredRepos;
    } catch (error) {
      logger.error('Error fetching repositories:', error);
      return [];
    }
  }
}

export const githubService = new GitHubService();
