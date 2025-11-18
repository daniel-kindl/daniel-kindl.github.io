/**
 * Application Entry Point
 * Initializes all components and manages application lifecycle
 */

import { cursorHalo } from './components/cursorHalo.js';
import { carousel } from './components/carousel.js';
import { navigation } from './components/navigation.js';
import { footer } from './components/footer.js';
import { streamingText } from './components/streamingText.js';
import { magneticButtons } from './components/magneticButtons.js';
import { parallaxEffect } from './components/parallaxEffect.js';
import { tiltEffect } from './components/tiltEffect.js';

class App {
  constructor() {
    this.components = [
      footer,
      navigation,
      streamingText,
      cursorHalo,
      carousel,
      magneticButtons,
      parallaxEffect,
      tiltEffect,
    ];
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing application...');

      // Initialize all components
      for (const component of this.components) {
        if (component && typeof component.init === 'function') {
          await component.init();
        }
      }

      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  /**
   * Tear down the application
   */
  destroy() {
    // Clean up components if needed
    if (cursorHalo && typeof cursorHalo.destroy === 'function') {
      cursorHalo.destroy();
    }
    if (streamingText && typeof streamingText.destroy === 'function') {
      streamingText.destroy();
    }
  }
}

// Initialize application when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for potential external use
export default app;

