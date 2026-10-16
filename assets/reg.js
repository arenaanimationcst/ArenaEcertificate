if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register(new URL('../sw.js',document.currentScript.src)).catch(()=>{});
