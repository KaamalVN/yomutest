const CACHE_NAME = "yomu-reader-v1";
const STATIC_ASSETS = ["/", "/manifest.json", "https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log("Caching static assets");
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => {
				console.log("Service worker installed");
				return self.skipWaiting();
			})
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME) {
							console.log("Deleting old cache:", cacheName);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				console.log("Service worker activated");
				return self.clients.claim();
			})
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
	// Skip non-GET requests
	if (event.request.method !== "GET") return;

	// Skip chrome-extension and other non-http requests
	if (!event.request.url.startsWith("http")) return;

	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				// Return cached version or fetch from network
				return (
					response ||
					fetch(event.request).then((fetchResponse) => {
						// Cache successful responses
						if (fetchResponse.status === 200) {
							const responseClone = fetchResponse.clone();
							caches.open(CACHE_NAME).then((cache) => {
								cache.put(event.request, responseClone);
							});
						}
						return fetchResponse;
					})
				);
			})
			.catch(() => {
				// Fallback for offline scenarios
				if (event.request.destination === "document") {
					return caches.match("/");
				}
			})
	);
});
