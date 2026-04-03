/**
 * Build Script — Pre-renders critical content into index.html for SEO.
 *
 * Reads src/scripts/config.js (ES module) and data/pinned-repos.json,
 * then replaces <!-- BUILD:* --> placeholder comments with static HTML.
 * Writes the result back to index.html in-place.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

// ─── Load data ────────────────────────────────────────────────────────────────

const { config } = await import('../src/scripts/config.js');

let pinnedRepos = [];
try {
  const pinnedRaw = readFileSync(join(root, 'data/pinned-repos.json'), 'utf8');
  pinnedRepos = JSON.parse(pinnedRaw).repos || [];
} catch {
  console.warn('Warning: could not read data/pinned-repos.json, using fallback.');
}

// ─── Helper: escape HTML entities ─────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── Build: Experience HTML ────────────────────────────────────────────────────

function buildExperienceHtml(experience) {
  if (!experience || experience.length === 0) return '';

  const items = experience.map((item, index) => {
    const techTags = (item.technologies || [])
      .map(tech => `<span class="tag">${escapeHtml(tech)}</span>`)
      .join('');

    const locationHtml = item.location
      ? `<div class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(item.location)}</div>`
      : '';

    const techHtml = techTags
      ? `<div class="timeline-tech">${techTags}</div>`
      : '';

    return `
  <div class="timeline-item reveal reveal-delay-${(index % 3) + 1}">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <div class="timeline-header">
        <div class="timeline-date">${escapeHtml(item.period)}</div>
        ${locationHtml}
      </div>
      <h3 class="timeline-role">${escapeHtml(item.role)}</h3>
      <h4 class="timeline-company">${escapeHtml(item.company)}</h4>
      <p class="timeline-description">${escapeHtml(item.description)}</p>
      ${techHtml}
    </div>
  </div>`;
  }).join('');

  return `<div class="timeline">${items}
</div>`;
}

// ─── Build: Skills HTML ────────────────────────────────────────────────────────

function buildSkillsHtml(skills) {
  if (!skills || skills.length === 0) return '';

  return skills.map((category, index) => {
    const tagsHtml = (category.items || [])
      .map(item => `<span class="tag"><i class="${escapeHtml(item.icon)}"></i> ${escapeHtml(item.name)}</span>`)
      .join('\n        ');

    return `<div class="skill-category reveal reveal-delay-${(index % 2) + 1}">
  <h3><i class="${escapeHtml(category.icon)}"></i> ${escapeHtml(category.category)}</h3>
  <div class="skill-tags">
    ${tagsHtml}
  </div>
</div>`;
  }).join('\n');
}

// ─── Build: Featured Projects HTML ────────────────────────────────────────────

function buildFeaturedProjectsHtml(repos, fallback) {
  const projects = repos.length > 0 ? repos : (fallback || []);
  if (projects.length === 0) return '';

  const cards = projects.map(repo => {
    return `  <div class="featured-project-card">
    <div class="featured-project-header">
      <i class="fas fa-folder-open featured-project-icon"></i>
    </div>
    <h3 class="featured-project-title">${escapeHtml(repo.name)}</h3>
    <p class="featured-project-description">${escapeHtml(repo.description || '')}</p>
  </div>`;
  }).join('\n');

  return `<div class="featured-projects-grid">
${cards}
</div>`;
}

// ─── Replace placeholder ──────────────────────────────────────────────────────

function replacePlaceholder(html, name, content) {
  const regex = new RegExp(
    `<!-- BUILD:${name} -->([\\s\\S]*?)<!-- \\/BUILD:${name} -->`,
    'g'
  );
  return html.replace(regex, `<!-- BUILD:${name} -->${content}<!-- /BUILD:${name} -->`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const indexPath = join(root, 'index.html');
let html = readFileSync(indexPath, 'utf8');

const now = new Date();
const year = now.getFullYear().toString();
const buildDate = now.toISOString().split('T')[0];

const experienceHtml = buildExperienceHtml(config.experience);
const skillsHtml = buildSkillsHtml(config.skills);
const featuredHtml = buildFeaturedProjectsHtml(pinnedRepos, config.featuredProjects);

html = replacePlaceholder(html, 'experience', experienceHtml);
html = replacePlaceholder(html, 'skills', skillsHtml);
html = replacePlaceholder(html, 'featured-projects', featuredHtml);
html = replacePlaceholder(html, 'year', year);
html = replacePlaceholder(html, 'build-date', buildDate);

writeFileSync(indexPath, html, 'utf8');

console.log(`Build complete: experience(${config.experience?.length || 0} items), skills(${config.skills?.length || 0} categories), featured-projects(${pinnedRepos.length || config.featuredProjects?.length || 0} repos), year=${year}, build-date=${buildDate}`);
