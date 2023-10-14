'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/assest/06d-hue-ales-krivec-unsplash.jpg": "31054deb791dd026ed0c9db9eb520992",
"assets/assest/cyber.png": "f0ba37ee0c18c15831bd1164c5f2d476",
"assets/assest/datas.png": "c171c770ed02e2857b70b910e353d4e4",
"assets/assest/fore.png": "0cbb21f79695be688ade04f617c41535",
"assets/assest/google.png": "88bf3ec69b7d9e844b9882fc8d1b6c72",
"assets/assest/html.jpg": "2b4e81f6b2d8569fa06c0755ef62a716",
"assets/assest/icon.png": "415e9d970413ee9cd54b3e2fb32f8daf",
"assets/assest/IMG-20221126-WA0087.jpg": "875afe15b41ba43460c6f742ab036e57",
"assets/assest/iot.png": "840b56c4e4300e8cd06793258eefe1df",
"assets/assest/mta.jpeg": "d4d21c97e5ba7151e09eb9edb4520b0f",
"assets/assest/mycv.png": "17044fe8960ecce2a90ffd39c0bf045f",
"assets/assest/myphoto.jpg": "709f68565588f3f801183e5021db451e",
"assets/assest/network.png": "3a2587721a1655e3082d2d14da922051",
"assets/assest/one.jpg": "5e88b32a292f49c6430b1a6fb297bcb5",
"assets/assest/python.png": "1b607d976d7362d9e2861a86268f8b10",
"assets/assest/qr.png": "52392b4b33069828c19cc32a8bbc6e72",
"assets/assest/QRcode.png": "02c79d7f2c977b1009aa4ef165c4ca71",
"assets/assest/sql.png": "f4bcfbffc5b1dc5ae51be06cc127b798",
"assets/assest/three.png": "9ba015ed8b8d37a879c8c5e1b77c161e",
"assets/assest/two.jpg": "1f32518ede2da78a81748a9f75a76255",
"assets/AssetManifest.bin": "23dd7e62b792cbac26a457b8a9553c2b",
"assets/AssetManifest.json": "8b4d35d9af2401249643a8a7086b4241",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "d77d51b9fb668491332a6b6b6da7c583",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "7c4a2df28f03b428a63fb10250463cf5",
"canvaskit/canvaskit.wasm": "048b1fda1729a5a5e174936a96cbea2c",
"canvaskit/chromium/canvaskit.js": "2236901a15edcdf16e2eaf18ea7a7415",
"canvaskit/chromium/canvaskit.wasm": "cd2923db695a0156fa92dc26111a0e41",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "eae1410d0a6d5632bfb7623c6536fbdb",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "675a4cadb8194bb45a5897ec213835c9",
"flutter.js": "a96e4cac3d2da39d86bf871613180e7b",
"icons/Icon-192.png": "c77e7a6a1999c53769fa4a694c7b4103",
"icons/Icon-512.png": "9557cc2cc73a85ac2379b86d41e6ae44",
"icons/Icon-maskable-192.png": "c77e7a6a1999c53769fa4a694c7b4103",
"icons/Icon-maskable-512.png": "9557cc2cc73a85ac2379b86d41e6ae44",
"index.html": "973286cb68a47c5c4447c0a26fb3e2a5",
"/": "973286cb68a47c5c4447c0a26fb3e2a5",
"main.dart.js": "ff0deda728f5c841235d5e9a1a0b0892",
"manifest.json": "ff75e0dc7634b22671558b075d1faab0",
"version.json": "000e1c9ad2448280041f98ed50a95687"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
