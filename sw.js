// Service worker mínimo — só existe pra deixar o site instalável
// (ícone na tela inicial) e fazer a "casca" do site (HTML/CSS/JS
// estático) carregar mais rápido em visitas repetidas.
//
// Importante: NUNCA cacheia chamadas pro backend (outro domínio) —
// dashboard, guerra ao vivo e histórico continuam sempre buscando
// dado fresco, sem risco de mostrar informação velha.

const CACHE_NAME = 'ccbr-shell-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './config.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((nomes) =>
            Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Só cuida de GET dentro do próprio site. Chamadas pro backend
    // (outro domínio, tipo ngrok ou a futura VPS) passam direto.
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request).then((emCache) => {
            const buscaRede = fetch(request)
                .then((resposta) => {
                    if (resposta.ok) {
                        const copia = resposta.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
                    }
                    return resposta;
                })
                .catch(() => emCache);
            return emCache || buscaRede;
        })
    );
});