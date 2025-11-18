/**
 * Cursor Halo Component
 * Creates a glowing halo effect that follows the cursor
 */

import { querySelector } from '../utils/domHelpers.js';
import { config } from '../config.js';

class CursorHalo {
  constructor() {
    this.haloElement = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.haloX = 0;
    this.haloY = 0;
    this.animationFrameId = null;
  }

  /**
   * Initialize the cursor halo effect
   */
  init() {
    this.haloElement = querySelector('.cursor-halo');

    if (!this.haloElement) {
      console.warn('Cursor halo element not found');
      return;
    }

    this.attachEventListeners();
    this.startAnimation();
  }

  /**
   * Attach event listeners for mouse tracking
   */
  attachEventListeners() {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseleave', () => this.handleMouseLeave());
    document.addEventListener('mouseenter', () => this.handleMouseEnter());
  }

  /**
   * Handle mouse move event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  /**
   * Handle mouse leave event
   */
  handleMouseLeave() {
    if (this.haloElement) {
      this.haloElement.style.opacity = '0';
    }
  }

  /**
   * Handle mouse enter event
   */
  handleMouseEnter() {
    if (this.haloElement) {
      this.haloElement.style.opacity = '1';
    }
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    const animate = () => {
      this.updateHaloPosition();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Update halo position with easing
   */
  updateHaloPosition() {
    if (!this.haloElement) return;

    // Smooth follow with easing
    this.haloX += (this.mouseX - this.haloX) * config.ui.cursorHaloEasing;
    this.haloY += (this.mouseY - this.haloY) * config.ui.cursorHaloEasing;

    this.haloElement.style.left = `${this.haloX}px`;
    this.haloElement.style.top = `${this.haloY}px`;
  }

  /**
   * Destroy the cursor halo and clean up
   */
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

export const cursorHalo = new CursorHalo();
