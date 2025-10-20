/* eslint-disable no-restricted-globals */

// Nombre del caché
const CACHE_NAME = "clima-pwa-v1";

// Archivos a cachear
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/manifest.json",
  "/favicon.ico",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caché abierto");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación y limpieza de cachés antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Eliminando caché antiguo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepción de peticiones
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si hay una respuesta en caché, la devuelve
      if (response) {
        return response;
      }

      // Si no, hace la petición a la red
      return fetch(event.request).then((response) => {
        // Verifica si la respuesta es válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clona la respuesta
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
