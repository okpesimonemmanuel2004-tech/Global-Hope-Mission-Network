const V='ghmen-v1',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put('index.html',c));return x}).catch(()=>caches.match('index.html')));
    return;
  }
  if(!(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)))return;
  e.respondWith(caches.match(r).then(h=>{
    const n=fetch(r).then(x=>{if(x.ok||x.type==='opaque')caches.open(V).then(c=>c.put(r,x.clone()));return x}).catch(()=>h);
    return h||n;
  }));
});