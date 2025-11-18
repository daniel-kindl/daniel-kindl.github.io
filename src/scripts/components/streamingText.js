/**
 * Streaming Text Component
 * Creates a typewriter effect with rotating text
 */

import { querySelector } from '../utils/domHelpers.js';
import { config } from '../config.js';

class StreamingText {
  constructor() {
    this.element = null;
    this.texts = config.streamingText.texts;
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.timeoutId = null;
  }

  /**
   * Initialize the streaming text effect
   */
  init() {
    this.element = querySelector('#streaming-text');

    if (!this.element) {
      console.warn('Streaming text element not found');
      return;
    }

    this.startTyping();
  }

  /**
   * Start the typing animation
   */
  startTyping() {
    this.type();
  }

  /**
   * Type or delete characters
   */
  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      // Remove character
      this.currentCharIndex--;
      this.element.textContent = currentText.substring(0, this.currentCharIndex);

      if (this.currentCharIndex === 0) {
        // Finished deleting, move to next text
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        this.timeoutId = setTimeout(() => this.type(), config.streamingText.pauseBeforeType);
        return;
      }

      this.timeoutId = setTimeout(() => this.type(), config.streamingText.deletingSpeed);
    } else {
      // Add character
      this.currentCharIndex++;
      this.element.textContent = currentText.substring(0, this.currentCharIndex);

      if (this.currentCharIndex === currentText.length) {
        // Finished typing, pause then start deleting
        this.isDeleting = true;
        this.timeoutId = setTimeout(() => this.type(), config.streamingText.pauseBeforeDelete);
        return;
      }

      this.timeoutId = setTimeout(() => this.type(), config.streamingText.typingSpeed);
    }
  }

  /**
   * Destroy the streaming text and clean up
   */
  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

export const streamingText = new StreamingText();
