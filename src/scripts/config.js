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
    projectsPerPage: 6,
    maxLanguagesPerProject: 4,
  },

  // UI Configuration
  ui: {
    projectDescriptionMaxLength: 120,
  },

  // Streaming Text Configuration
  streamingText: {
    texts: [
      'Building scalable applications with C#, .NET, and modern technologies.',
      'Passionate about clean code and elegant solutions.',
      'Creating AI-powered applications that make a difference.',
      'Solving complex problems with simple, efficient code.',
    ],
    typingSpeed: 50,               // Milliseconds per character
    deletingSpeed: 30,             // Milliseconds per character when deleting
    pauseBeforeDelete: 2 * 1000,   // Pause after typing complete text (2 seconds)
    pauseBeforeType: 500,          // Pause before typing next text
  },

  // Animation Configuration
  animation: {
    smoothScrollOffset: 80,
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

  // Work Experience
  experience: [
    {
      company: 'SPS software s.r.o.',
      role: 'Junior Software Engineer',
      period: 'July 2023 - Present',
      location: 'Chomutov, Czechia',
      description: 'Developing and maintaining desktop applications for industrial measurement and testing. Leading the modernization of legacy systems from Delphi to .NET.',
      technologies: ['C#', '.NET', 'Delphi', 'Avalonia UI', 'REST API', 'SignalR']
    }
  ],

  // Skills
  skills: [
    {
      category: 'Backend & Architecture',
      icon: 'fas fa-server',
      items: [
        { name: 'C#', icon: 'fab fa-microsoft' },
        { name: '.NET 9/10', icon: 'fas fa-layer-group' },
        { name: 'ASP.NET Core', icon: 'fas fa-network-wired' },
        { name: 'Delphi', icon: 'fas fa-history' }
      ]
    },
    {
      category: 'Frontend & UI',
      icon: 'fas fa-laptop-code',
      items: [
        { name: 'TypeScript / JS', icon: 'fab fa-js' },
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Avalonia UI', icon: 'fas fa-desktop' }
      ]
    },
    {
      category: 'Data & DevOps',
      icon: 'fas fa-database',
      items: [
        { name: 'SQL Server', icon: 'fas fa-server' },
        { name: 'PostgreSQL', icon: 'fas fa-database' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'Microsoft Access', icon: 'fas fa-table' },
        { name: 'Docker', icon: 'fab fa-docker' },
        { name: 'Jenkins', icon: 'fab fa-jenkins' }
      ]
    },
    {
      category: 'Tools & AI',
      icon: 'fas fa-robot',
      items: [
        { name: 'VS Code', icon: 'fas fa-code' },
        { name: 'Visual Studio', icon: 'fab fa-microsoft' },
        { name: 'Git / GitHub', icon: 'fab fa-git-alt' },
        { name: 'GitHub Copilot', icon: 'fas fa-robot' },
      ]
    }
  ],

  // Featured Projects (Fallback if GitHub API fails or for custom projects)
  featuredProjects: [
    {
      name: 'Portfolio',
      description: 'My personal portfolio website built with vanilla JavaScript and Neo-Brutalist design.',
      html_url: 'https://github.com/daniel-kindl/daniel-kindl.github.io',
      language: 'JavaScript',
      topics: ['portfolio', 'css', 'javascript'],
      stargazers_count: 0,
      forks_count: 0
    },
    {
      name: 'Data & Algo Visualization',
      description: 'Interactive visualization of common data structures and algorithms to help understand their inner workings.',
      html_url: 'https://github.com/daniel-kindl/data-and-algorithms-visualization',
      language: 'TypeScript',
      topics: ['algorithms', 'data-structures', 'visualization', 'education'],
      stargazers_count: 0,
      forks_count: 0
    }
  ]
};
