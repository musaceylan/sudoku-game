// Service Worker for Sudoku Play - Enhanced PWA Support
const CACHE_NAME = 'sudoku-v6.0.0';
const STATIC_CACHE = 'sudoku-static-v6';
const DYNAMIC_CACHE = 'sudoku-dynamic-v6';

// All app files to cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/difficulty.html',
    '/game.html',
    '/daily.html',
    '/settings.html',
    '/stats.html',
    '/achievements.html',
    '/sudoku.js',
    '/translations.js',
    '/manifest.json'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

// Install - Cache all static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('[SW] Caching external assets');
                // Try to cache external assets but don't fail if they don't load
                return Promise.allSettled(
                    EXTERNAL_ASSETS.map(url =>
                        fetch(url, { mode: 'cors' })
                            .then(response => {
                                if (response.ok) {
                                    return cache.put(url, response);
                                }
                            })
                            .catch(() => console.log('[SW] Could not cache:', url))
                    )
                );
            })
        ]).then(() => {
            console.log('[SW] Installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => !currentCaches.includes(cacheName))
                    .map(cacheName => {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => {
            console.log('[SW] Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch - Network first for HTML, Cache first for assets
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) schemes
    if (!url.protocol.startsWith('http')) return;

    // For HTML pages - Network first, fallback to cache
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(STATIC_CACHE).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request).then(cachedResponse => {
                        return cachedResponse || caches.match('/index.html');
                    });
                })
        );
        return;
    }

    // For JS files - Stale while revalidate
    if (url.pathname.endsWith('.js')) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                const fetchPromise = fetch(request).then(networkResponse => {
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(STATIC_CACHE).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                }).catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // For fonts and external resources - Cache first
    if (url.origin !== location.origin) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Return offline fallback for fonts
                    return new Response('', { status: 503 });
                });
            })
        );
        return;
    }

    // Default - Cache first, network fallback
    event.respondWith(
        caches.match(request).then(cachedResponse => {
            return cachedResponse || fetch(request).then(response => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            });
        })
    );
});

// Background sync for game stats (if supported)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-stats') {
        console.log('[SW] Syncing stats...');
        // Future: sync stats to server
    }
});

// Handle push notifications (for daily reminders)
self.addEventListener('push', event => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'Time for your daily Sudoku!',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/daily.html'
        },
        actions: [
            { action: 'play', title: 'Play Now' },
            { action: 'later', title: 'Later' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Sudoku Play', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'later') return;

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Focus existing window if open
            for (const client of clientList) {
                if (client.url.includes('sudoku') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Message handling for cache updates
self.addEventListener('message', event => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data?.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});
