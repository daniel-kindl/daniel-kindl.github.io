/**
 * Status Bar Component
 * Renders a VS Code-like status bar at the bottom of the screen
 */

import { createElement } from '../utils/domHelpers.js';

class StatusBar {
  constructor() {
    this.element = null;
  }

  init() {
    this.createDOM();
    this.attachListeners();
  }

  createDOM() {
    this.element = createElement('div', { className: 'status-bar' });
    
    this.element.innerHTML = `
      <div class="status-left">
        <div class="status-item git-branch">
          <i class="fas fa-code-branch"></i>
          <span>main*</span>
        </div>
        <div class="status-item errors">
          <i class="fas fa-times-circle"></i>
          <span>0</span>
        </div>
        <div class="status-item warnings">
          <i class="fas fa-exclamation-triangle"></i>
          <span>0</span>
        </div>
      </div>
      <div class="status-right">
        <div class="status-item position">
          <span>Ln 1, Col 1</span>
        </div>
        <div class="status-item encoding">
          <span>UTF-8</span>
        </div>
        <div class="status-item language">
          <span>JavaScript</span>
        </div>
        <div class="status-item prettier">
          <i class="fas fa-check-double"></i>
          <span>Prettier</span>
        </div>
        <div class="status-item feedback">
          <i class="far fa-smile"></i>
        </div>
      </div>
    `;

    document.body.appendChild(this.element);
  }

  attachListeners() {
    // Track mouse position to update Ln/Col
    document.addEventListener('mousemove', (e) => {
      const x = Math.floor(e.clientX / 10) + 1;
      const y = Math.floor(e.clientY / 20) + 1;
      
      const posEl = this.element.querySelector('.position span');
      if (posEl) {
        posEl.textContent = `Ln ${y}, Col ${x}`;
      }
    });
  }
}

export const statusBar = new StatusBar();
