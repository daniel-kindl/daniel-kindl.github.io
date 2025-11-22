/**
 * Contact Component
 * Handles contact section interactions
 */

import { querySelector } from '../utils/domHelpers.js';

class Contact {
  constructor() {
    this.copyBtn = null;
    this.email = 'daniel.kindl@proton.me';
  }

  init() {
    this.copyBtn = querySelector('#copy-email-btn');
    
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyEmail());
    }
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.email);
      
      // Visual feedback
      const originalIcon = this.copyBtn.innerHTML;
      this.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      this.copyBtn.classList.add('success');
      
      // Update tooltip if Tippy is used
      if (this.copyBtn._tippy) {
        this.copyBtn._tippy.setContent('Copied!');
        this.copyBtn._tippy.show();
      }

      setTimeout(() => {
        this.copyBtn.innerHTML = originalIcon;
        this.copyBtn.classList.remove('success');
        if (this.copyBtn._tippy) {
          this.copyBtn._tippy.setContent('Copy Email Address');
        }
      }, 2000);
      
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  }
}

export const contact = new Contact();
