var CACHE='armyhair-v1-r2';
var FILES=['./','index.html','style.css','engine.js','sprites.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('armyhair-')===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(n){if(n.ok&&new URL(e.request.url).origin===location.origin){var cp=n.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}return n;}).catch(function(){return caches.match('index.html');});}));});
