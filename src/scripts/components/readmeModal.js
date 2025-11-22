/**
 * README Modal Component
 * Fetches and displays GitHub READMEs in a modal
 */

import { createElement, querySelector } from '../utils/domHelpers.js';
import { smoothScroll } from './smoothScroll.js';

class ReadmeModal {
  constructor() {
    this.overlay = null;
    this.content = null;
    this.isOpen = false;
  }

  init() {
    this.createDOM();
    this.attachListeners();
  }

  createDOM() {
    this.overlay = createElement('div', { className: 'readme-overlay' });
    this.overlay.innerHTML = `
      <div class="readme-modal">
        <div class="readme-header">
          <h2 class="readme-title">Project README</h2>
          <button class="readme-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="readme-content markdown-body" data-lenis-prevent>
          <div class="readme-loading">
            <i class="fas fa-spinner fa-spin"></i> Loading README...
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    this.content = this.overlay.querySelector('.readme-content');
  }

  attachListeners() {
    this.overlay.querySelector('.readme-close').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  async open(repoUrl) {
    this.isOpen = true;
    this.overlay.classList.add('active');
    this.content.innerHTML = `
      <div class="readme-loading">
        <i class="fas fa-spinner fa-spin"></i> Loading README...
      </div>
    `;
    document.body.style.overflow = 'hidden';
    if (smoothScroll) smoothScroll.stop();

    try {
      // Extract owner and repo from URL
      // Format: https://github.com/owner/repo
      const parts = repoUrl.split('/');
      const owner = parts[parts.length - 2];
      const repo = parts[parts.length - 1];

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) throw new Error('README not found');
      
      const data = await response.json();

      // Calculate base URLs for relative links
      const htmlUrl = data.html_url;
      const downloadUrl = data.download_url;
      const blobBase = htmlUrl.substring(0, htmlUrl.lastIndexOf('/') + 1);
      const rawBase = downloadUrl.substring(0, downloadUrl.lastIndexOf('/') + 1);

      // Decode base64 content properly handling UTF-8 characters (emojis, etc.)
      const binaryString = atob(data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decodedContent = new TextDecoder('utf-8').decode(bytes);
      
      // Configure custom renderer for relative links
      const renderer = new marked.Renderer();
      
      renderer.link = (href, title, text) => {
        let link = href;
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
          const cleanHref = href.replace(/^\.\//, '');
          try {
            link = new URL(cleanHref, blobBase).href;
          } catch (e) {
            console.warn('Invalid URL:', cleanHref);
          }
        }
        const target = link && link.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"';
        return `<a href="${link}" title="${title || ''}" ${target}>${text}</a>`;
      };

      renderer.image = (href, title, text) => {
        let src = href;
        if (href && !href.startsWith('http') && !href.startsWith('data:')) {
          const cleanHref = href.replace(/^\.\//, '');
          try {
            src = new URL(cleanHref, rawBase).href;
          } catch (e) {
            console.warn('Invalid Image URL:', cleanHref);
          }
        }
        return `<img src="${src}" alt="${text}" title="${title || ''}">`;
      };
      
      // Use marked to parse markdown
      this.content.innerHTML = marked.parse(decodedContent, { renderer });

      // Apply syntax highlighting and add copy buttons
      if (window.hljs) {
        this.content.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
          this.addCopyButton(block.parentElement);
        });
      }
      
    } catch (error) {
      this.content.innerHTML = `
        <div class="readme-error">
          <i class="fas fa-exclamation-circle"></i>
          <p>Could not load README. It might not exist or the API limit was reached.</p>
          <a href="${repoUrl}" target="_blank" class="btn btn-primary">View on GitHub</a>
        </div>
      `;
    }
  }

  addCopyButton(preBlock) {
    const button = createElement('button', {
      className: 'copy-btn',
      'aria-label': 'Copy code'
    });
    button.innerHTML = '<i class="far fa-copy"></i>';
    
    button.addEventListener('click', async () => {
      const code = preBlock.querySelector('code').innerText;
      try {
        await navigator.clipboard.writeText(code);
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        setTimeout(() => {
          button.innerHTML = '<i class="far fa-copy"></i>';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
    
    preBlock.style.position = 'relative';
    preBlock.appendChild(button);
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (smoothScroll) smoothScroll.start();
  }
}

export const readmeModal = new ReadmeModal();
