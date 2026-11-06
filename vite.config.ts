import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          id: '/',
          name: 'منظومة التدبير التربوي - مادة الرياضيات',
          short_name: 'مسار رياضيات',
          description: 'منظومة شاملة لأستاذ مادة الرياضيات بالسلك الثانوي التأهيلي حصرا لتدبير الحصص وتتبع الغياب، لوحة قيادة مركزية، تقييم الفروض والمراقبة المستمرة، دفتر النصوص والتوزيع السنوي الرسمي لمقرر الرياضيات.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          start_url: '/',
          scope: '/',
          lang: 'ar',
          dir: 'rtl',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'لوحة القيادة والإنذار المبكر',
              short_name: 'لوحة القيادة',
              description: 'فتح لوحة القيادة المركزية ومؤشرات التلاميذ',
              url: '/?tab=dashboard',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'تسجيل الغياب والمواظبة',
              short_name: 'الغياب',
              description: 'تسجيل الحضور والغياب اليومي للتلاميذ',
              url: '/?tab=absence',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'نقط الفروض والمراقبة المستمرة',
              short_name: 'نقط الفروض',
              description: 'مسك وتتبع نقط الفروض المحروسة',
              url: '/?tab=grades',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'السبورة التفاعلية للرياضيات',
              short_name: 'السبورة',
              description: 'فتح السبورة التفاعلية ومعاينة PDF والأدوات الهندسية',
              url: '/?tab=distanceTeaching',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'الهندسة البيداغوجية والتقويم',
              short_name: 'الهندسة والتقويم',
              description: 'إعداد الفروض المحروسة والجذاذات والروائز وشبكات التقويم',
              url: '/?tab=pedagogy',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          // Only the small app shell is precached (icons/manifest). The heavy
          // vanilla bundles (~17 MB) are cached lazily on first use below,
          // which cuts the first visit install cost dramatically.
          globPatterns: ['**/*.{ico,png,svg,webmanifest}'],
          runtimeCaching: [
            {
              // HTML shell: network-first so a new release is picked up,
              // with offline fallback to the last cached page.
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-pages',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
              },
            },
            {
              // JS/CSS (including the 38 vanilla modules): cache after first load.
              urlPattern: ({ sameOrigin, request, url }) =>
                sameOrigin && request.method === 'GET' && /\.(?:js|css)$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-assets',
                expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              // Fonts are large and rarely change.
              urlPattern: /\.(?:woff2?|ttf|otf)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'fonts-cache',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdnjs-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/www\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'jsdelivr-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    ],
    build: {
      // Large print/PDF/studio bundles are expected; keep the warning useful.
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (/[\\/](pdfjs-dist|jspdf|html2canvas|html-to-image)[\\/]/.test(id)) return 'vendor-pdf';
            if (/[\\/](recharts|d3-[^\\/]+)[\\/]/.test(id)) return 'vendor-charts';
            if (/[\\/](katex|mathjs)[\\/]/.test(id)) return 'vendor-math';
            if (/[\\/](lucide-react)[\\/]/.test(id)) return 'vendor-icons';
            if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      hmr: false,
      watch: null,
    },
  };
});
