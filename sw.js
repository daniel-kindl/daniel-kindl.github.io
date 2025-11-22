/**
 * Service Worker
 * Caches assets for offline access and faster load times
 */

const CACHE_NAME = 'dk-portfolio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/404.html',
  '/src/styles/global.css',
  '/src/scripts/app.js',
  '/src/scripts/config.js',
  '/src/scripts/components/navigation.js',
  '/src/scripts/components/projectGallery.js',
  '/src/scripts/components/experienceTimeline.js',
  '/src/scripts/components/skills.js',
  '/src/scripts/components/readmeModal.js',
  '/src/scripts/components/smoothScroll.js',
  '/src/scripts/components/tooltips.js',
  '/src/scripts/utils/domHelpers.js',
  '/src/scripts/services/githubService.js',
  '/src/images/favicon.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
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

        return fetch(fetchRequest).then(
          (response) => {
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
          }
        );
      })
  );
});
