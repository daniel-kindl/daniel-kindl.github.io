/**
 * Application Entry Point
 * Initializes all components and manages application lifecycle
 */

import { logger } from './utils/logger.js';
import { projectGallery } from './components/projectGallery.js';
import { navigation } from './components/navigation.js';
import { footer } from './components/footer.js';
import { streamingText } from './components/streamingText.js';
import { scrollTop } from './components/scrollTop.js';
import { themeToggle } from './components/themeToggle.js';
import { scrollReveal } from './components/scrollReveal.js';
import { experienceTimeline } from './components/experienceTimeline.js';
import { skills } from './components/skills.js';
import { scrollProgress } from './components/scrollProgress.js';
import { readmeModal } from './components/readmeModal.js';
import { smoothScroll } from './components/smoothScroll.js';
import { tooltips } from './components/tooltips.js';
import { statusBar } from './components/statusBar.js';
import { contact } from './components/contact.js';
import { featuredProjects } from './components/featuredProjects.js';

class App {
  constructor() {
    this.components = [
      footer,
      navigation,
      streamingText,
      featuredProjects,
      projectGallery,
      scrollTop,
      themeToggle,
      experienceTimeline,
      skills,
      scrollReveal,
      scrollProgress,
      readmeModal,
      smoothScroll,
      tooltips,
      statusBar,
      contact,
    ];
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      logger.log('Initializing application...');

      // Initialize all components
      for (const component of this.components) {
        try {
          if (component && typeof component.init === 'function') {
            await component.init();
          }
        } catch (error) {
          logger.error(`Failed to initialize ${component.constructor.name}:`, error);
        }
      }

      logger.log('Application initialized successfully');
    } catch (error) {
      logger.error('Error initializing application:', error);
    }
  }

  /**
   * Tear down the application
   */
  destroy() {
    // Clean up components if needed
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

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => {
        logger.log('ServiceWorker registration successful');
      })
      .catch(err => {
        logger.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Export for potential external use
export default app;

