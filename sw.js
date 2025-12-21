/**
 * Service Worker
 * Caches assets for offline access and faster load times
 */

const VERSION = '2.1.0';
const CACHE_NAME = `dk-portfolio-v${VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/resume.html',
  '/404.html',
  '/manifest.json',
  '/data/pinned-repos.json',
  '/src/styles/global.css',
  '/src/scripts/app.js',
  '/src/scripts/config.js',
  '/src/scripts/utils/domHelpers.js',
  '/src/scripts/utils/stringHelpers.js',
  '/src/scripts/utils/logger.js',
  '/src/scripts/utils/storage.js',
  '/src/scripts/services/githubService.js',
  '/src/scripts/services/pinnedReposService.js',
  '/src/scripts/components/navigation.js',
  '/src/scripts/components/projectGallery.js',
  '/src/scripts/components/projectCard.js',
  '/src/scripts/components/experienceTimeline.js',
  '/src/scripts/components/skills.js',
  '/src/scripts/components/readmeModal.js',
  '/src/scripts/components/smoothScroll.js',
  '/src/scripts/components/tooltips.js',
  '/src/scripts/components/footer.js',
  '/src/scripts/components/streamingText.js',
  '/src/scripts/components/scrollTop.js',
  '/src/scripts/components/themeToggle.js',
  '/src/scripts/components/scrollReveal.js',
  '/src/scripts/components/scrollProgress.js',
  '/src/scripts/components/statusBar.js',
  '/src/scripts/components/contact.js',
  '/src/scripts/components/featuredProjects.js',
  '/src/scripts/components/loadingSkeleton.js',
  '/src/scripts/components/heroPinned.js',
  '/src/images/favicon.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
          console.error('Failed to cache some assets during install:', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed for:', event.request.url, error);
            // Return 404 page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/404.html');
            }
            throw error;
          });
      })
  );
});
