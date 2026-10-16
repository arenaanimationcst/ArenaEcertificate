const V='arena-cert-v3';
const FILES=['./','./index.html','./admin/','./admin/index.html','./admin/manifest.webmanifest','./c/','./c/index.html',
'./assets/style.css','./assets/fonts.css','./assets/cert.js','./assets/admin.js','./assets/viewer.js','./assets/reg.js','./assets/bg.jpg',
'./assets/icon-192.png','./assets/icon-512.png','./assets/fonts/great-vibes-400.woff2','./assets/fonts/funnel-display-400.woff2','./assets/fonts/funnel-display-700.woff2',
'./vendor/jspdf.umd.min.js','./vendor/xlsx.full.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Serve from cache instantly, refresh the cache in the background (works offline, picks up updates on next visit)
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(caches.open(V).then(async c=>{
  const hit=await c.match(e.request,{ignoreSearch:true});
  const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
  return hit||net}))});
