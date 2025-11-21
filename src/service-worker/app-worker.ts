
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching } from "serwist";
import { Serwist, NetworkOnly } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const bypass: RuntimeCaching = {
  matcher: ({ sameOrigin, url: { pathname } }) => sameOrigin && pathname.startsWith("/ping.txt"),
  method: "GET",
  handler: new NetworkOnly(),
}

const runtimeCaching = [
  ...defaultCache,
  bypass
];

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // precacheOptions: {
  //   cleanupOutdatedCaches: true,
  //   concurrency: 10,
  //   ignoreURLParametersMatching: [],
  // },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // disableDevLogs: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: '/offline', // the page that'll display if user goes offline
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();