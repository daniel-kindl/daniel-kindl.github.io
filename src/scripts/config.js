/**
 * Application Configuration
 * Central configuration file for all constants and settings
 */

export const config = {
  // GitHub API Configuration
  github: {
    username: 'daniel-kindl',
    excludedRepos: [],
    apiBaseUrl: 'https://api.github.com',
    maxProjectsToDisplay: 12,
    maxLanguagesPerProject: 4,
  },

  // UI Configuration
  ui: {
    projectDescriptionMaxLength: 120,
    carouselTransitionDuration: 500,
    cursorHaloEasing: 0.08,
    cursorHaloSize: 400,
  },

  // Streaming Text Configuration
  streamingText: {
    texts: [
      'Building scalable applications with C#, .NET, and modern technologies.',
      'Passionate about clean code and elegant solutions.',
      'Creating AI-powered applications that make a difference.',
      'Solving complex problems with simple, efficient code.',
    ],
    typingSpeed: 50,        // Milliseconds per character
    deletingSpeed: 30,      // Milliseconds per character when deleting
    pauseBeforeDelete: 2000, // Pause after typing complete text
    pauseBeforeType: 500,    // Pause before typing next text
  },

  // Animation Configuration
  animation: {
    smoothScrollOffset: 80,
    haloBlurAmount: 40,
  },

  // Language Icons Mapping
  languageIcons: {
    JavaScript: 'fab fa-js',
    TypeScript: 'fab fa-js',
    Python: 'fab fa-python',
    Java: 'fab fa-java',
    'C#': 'fas fa-hashtag',
    'C++': 'fas fa-code',
    C: 'fas fa-code',
    Ruby: 'fas fa-gem',
    Go: 'fas fa-code',
    Rust: 'fas fa-cog',
    PHP: 'fab fa-php',
    Swift: 'fab fa-swift',
    Kotlin: 'fas fa-mobile-alt',
    HTML: 'fab fa-html5',
    CSS: 'fab fa-css3-alt',
    Shell: 'fas fa-terminal',
    Dockerfile: 'fab fa-docker',
    Vue: 'fab fa-vuejs',
    React: 'fab fa-react',
  },

  // Default Icons
  defaultIcons: {
    language: 'fas fa-code',
    project: 'fas fa-folder-open',
  },
};
