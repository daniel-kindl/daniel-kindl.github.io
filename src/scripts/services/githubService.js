/**
 * GitHub Service
 * Handles all GitHub API interactions
 */

import { config } from '../config.js';

class GitHubService {
  constructor() {
    this.baseUrl = config.github.apiBaseUrl;
    this.username = config.github.username;
  }

  /**
   * Fetch all public repositories for the configured user
   * @returns {Promise<Array>} Array of repository objects
   */
  async fetchAllRepositories() {
    try {
      const url = `${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=100`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();

      return repos
        .filter(repo => !repo.fork && !config.github.excludedRepos.includes(repo.name))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  }

  /**
   * Fetch programming languages used in a specific repository
   * @param {string} repoName - Name of the repository
   * @returns {Promise<Array<string>>} Array of language names
   */
  async fetchRepositoryLanguages(repoName) {
    try {
      const url = `${this.baseUrl}/repos/${this.username}/${repoName}/languages`;
      const response = await fetch(url);

      if (!response.ok) {
        return [];
      }

      const languages = await response.json();
      return Object.keys(languages).slice(0, config.github.maxLanguagesPerProject);
    } catch (error) {
      console.error(`Error fetching languages for ${repoName}:`, error);
      return [];
    }
  }

  /**
   * Fetch repository with its languages
   * @param {Object} repo - Repository object
   * @returns {Promise<Object>} Repository with languages
   */
  async fetchRepositoryWithLanguages(repo) {
    const languages = await this.fetchRepositoryLanguages(repo.name);
    return { repo, languages };
  }

  /**
   * Fetch multiple repositories with their languages
   * @param {Array} repos - Array of repository objects
   * @param {number} limit - Maximum number of repositories to fetch
   * @returns {Promise<Array>} Array of repositories with languages
   */
  async fetchRepositoriesWithLanguages(repos, limit = config.github.maxProjectsToDisplay) {
    const projectPromises = repos
      .slice(0, limit)
      .map(repo => this.fetchRepositoryWithLanguages(repo));

    return await Promise.all(projectPromises);
  }
}

export const githubService = new GitHubService();
