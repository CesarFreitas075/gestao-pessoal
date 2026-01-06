const CACHE_NAME = 'gestao-pessoal-cache-v5';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',

  // storage
  './storage/storage.js',

  // módulos
  './modules/financeiro.js',
  './modules/tarefas.js',
  './modules/anotacoes.js',
  './modules/agenda.js',
  './modules/checklist.js',
  './modules/pedidos.js',

  // ícones essenciais
  './icons/apple-touch-icon.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
  // navegação offline → sempre abre o app
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match('./index.html'));
    return;
  }

  // arquivos normais
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
