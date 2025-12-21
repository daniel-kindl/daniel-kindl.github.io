/**
 * Hero Pinned Projects Component
 * Renders a compact list of pinned repositories in the hero section
 */

import { pinnedReposService } from '../services/pinnedReposService.js';
import { querySelector, createElement } from '../utils/domHelpers.js';
import { truncateText, getLanguageIcon, normalizeUrl } from '../utils/stringHelpers.js';

function getPrimaryLink(repo) {
  if (repo?.homepage) {
    const normalized = normalizeUrl(repo.homepage);
    if (normalized) return normalized;
  }
  return repo?.html_url ?? '#';
}

class HeroPinned {
  async init() {
    const container = querySelector('#hero-pinned');
    if (!container) return;

    try {
      const repos = await pinnedReposService.getPinnedRepos();
      container.innerHTML = '';

      repos.slice(0, 3).forEach(repo => container.appendChild(this.createPin(repo)));
    } catch (error) {
      container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Unable to load pinned projects</p>';
    }
  }

  createPin(repo) {
    const card = createElement('a', {
      className: 'hero-pin',
      href: getPrimaryLink(repo),
      target: '_blank',
      rel: 'noopener noreferrer',
    });
    card.setAttribute('aria-label', `Open ${repo.name}`);

    const name = createElement('div', { className: 'hero-pin-name' });
    name.textContent = repo.name;

    const desc = createElement('div', { className: 'hero-pin-desc' });
    desc.textContent = truncateText(repo.description, 90);

    const meta = createElement('div', { className: 'hero-pin-meta' });

    if (repo.language) {
      const lang = createElement('span');
      lang.innerHTML = `<i class="${getLanguageIcon(repo.language)}"></i> ${repo.language}`;
      meta.appendChild(lang);
    }

    if (repo.updated_at) {
      const updated = createElement('span');
      updated.textContent = `Updated ${new Date(repo.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}`;
      meta.appendChild(updated);
    }

    card.append(name, desc, meta);
    return card;
  }
}

export const heroPinned = new HeroPinned();
