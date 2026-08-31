const CACHE_NAME = 'aya-cache-v4';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Don't cache API calls or Supabase — only static assets
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Skip API calls — always fetch fresh
  if (url.includes('/api/') || url.includes('supabase.co')) {
    return;
  }
  // Only cache GET requests for static assets
  if (event.request.method !== 'GET') {
    return;
  }
  // Cache everything else
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  );
});

// Push Notification Support
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'AYA Notification', body: event.data.text() };
    }
  }

  const title = data.title || 'At Your Age (AYA)';
  const options = {
    body: data.body || 'Your daily challenge is ready!',
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || data.icon || '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/game' },
    actions: [
      { action: 'open', title: '🔥 Open AYA' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/game';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});


