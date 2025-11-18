/**
 * Tilt Effect Component
 * 3D tilt effect on cards following mouse
 */

import { querySelectorAll } from '../utils/domHelpers.js';

class TiltEffect {
  constructor() {
    this.cards = [];
  }

  /**
   * Initialize tilt effect
   */
  init() {
    // Wait a bit for cards to be rendered
    setTimeout(() => {
      this.cards = querySelectorAll('.skill-category, .project-card');
      this.attachEventListeners();
    }, 1000);
  }

  /**
   * Attach event listeners to cards
   */
  attachEventListeners() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
      card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
      card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
    });
  }

  /**
   * Handle mouse enter
   * @param {Element} card - Card element
   */
  handleMouseEnter(card) {
    card.style.transition = 'transform 0.1s ease';
  }

  /**
   * Handle mouse move for tilt effect
   * @param {MouseEvent} event - Mouse event
   * @param {Element} card - Card element
   */
  handleMouseMove(event, card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const percentX = (event.clientX - centerX) / (rect.width / 2);
    const percentY = (event.clientY - centerY) / (rect.height / 2);
    
    const tiltX = percentY * -10; // Tilt up/down
    const tiltY = percentX * 10;  // Tilt left/right
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  }

  /**
   * Handle mouse leave
   * @param {Element} card - Card element
   */
  handleMouseLeave(card) {
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }
}

export const tiltEffect = new TiltEffect();
