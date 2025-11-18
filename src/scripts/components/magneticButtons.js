/**
 * Magnetic Button Effect Component
 * Buttons follow the mouse cursor with smooth magnetic attraction
 */

import { querySelectorAll } from '../utils/domHelpers.js';

class MagneticButtons {
  constructor() {
    this.buttons = [];
  }

  /**
   * Initialize magnetic effect on all buttons
   */
  init() {
    this.buttons = querySelectorAll('.btn, .carousel-btn, .social-link');
    
    this.buttons.forEach(button => {
      button.addEventListener('mouseenter', () => this.handleMouseEnter(button));
      button.addEventListener('mousemove', (e) => this.handleMouseMove(e, button));
      button.addEventListener('mouseleave', () => this.handleMouseLeave(button));
    });
  }

  /**
   * Handle mouse enter
   * @param {Element} button - Button element
   */
  handleMouseEnter(button) {
    button.style.transition = 'transform 0.08s ease';
  }

  /**
   * Handle mouse move for magnetic effect
   * @param {MouseEvent} event - Mouse event
   * @param {Element} button - Button element
   */
  handleMouseMove(event, button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) * 0.15;
    const deltaY = (event.clientY - centerY) * 0.15;
    
    button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }

  /**
   * Handle mouse leave
   * @param {Element} button - Button element
   */
  handleMouseLeave(button) {
    button.style.transition = 'transform 0.3s ease';
    button.style.transform = 'translate(0, 0)';
  }
}

export const magneticButtons = new MagneticButtons();
