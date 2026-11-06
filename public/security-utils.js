/**
 * security-utils.js
 * ------------------------------------------------------------------
 * أدوات أمنية مشتركة للتطبيق التقليدي (Vanilla JS).
 * الهدف: تعقيم أي HTML قادم من الخارج (الذكاء الاصطناعي، ملفات مستوردة)
 * قبل حقنه في DOM، لمنع هجمات XSS و Prompt Injection.
 *
 * يعتمد على DOMPurify المحلي (/vendor/purify.min.js) ليعمل دون إنترنت.
 */
(function () {
  'use strict';

  var PURIFY_CONFIG = {
    // MathML + SVG مطلوبان لعرض KaTeX والرسوم الرياضية.
    USE_PROFILES: { html: true, svg: true, svgFilters: true, mathMl: true },
    ADD_ATTR: [
      'target',
      'rel',
      'download',
      'data-lucide',
      'data-size',
      'aria-label',
      'aria-hidden',
      'role',
      'xmlns',
      'viewBox',
      'preserveAspectRatio',
      'marker-start',
      'marker-end'
    ],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'base', 'form'],
    FORBID_ATTR: ['srcdoc', 'formaction', 'action', 'ping'],
    ALLOW_DATA_ATTR: true,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // يمنع روابط javascript: ويسمح فقط بالبروتوكولات الآمنة.
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|data:image\/(?:png|jpe?g|gif|webp);base64):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
  };

  /**
   * يعقّم سلسلة HTML ويعيد نسخة آمنة.
   * إن لم تُحمَّل DOMPurify (فشل الشبكة/الملف)، يعمل بوضع "الفشل الآمن":
   * يعيد النص كما هو دون أي وسوم HTML.
   *
   * @param {string} html
   * @param {object} [overrides]
   * @returns {string}
   */
  function sanitizeHtml(html, overrides) {
    if (typeof html !== 'string' || html.length === 0) return '';

    if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
      var config = Object.assign({}, PURIFY_CONFIG, overrides || {});
      try {
        return window.DOMPurify.sanitize(html, config);
      } catch (err) {
        if (window.console && console.warn) {
          console.warn('[security] DOMPurify failed, falling back to plain text:', err);
        }
      }
    }

    // Fail closed: no HTML at all.
    var div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * يعقّم HTML ثم يعيّنه داخل عنصر. يعيد false إن لم يكن العنصر موجوداً.
   * @param {Element|null} element
   * @param {string} html
   * @returns {boolean}
   */
  function setSafeHtml(element, html) {
    if (!element) return false;
    element.innerHTML = sanitizeHtml(html);
    return true;
  }

  window.sanitizeHtml = sanitizeHtml;
  window.setSafeHtml = setSafeHtml;

  // ------------------------------------------------------------------
  // Authenticated API calls: attach the Firebase ID token (when the user
  // is signed in) to every same-origin /api/ request. This is transparent
  // for all existing fetch() call sites in the vanilla application.
  // ------------------------------------------------------------------
  var nativeFetch = typeof window.fetch === "function" ? window.fetch.bind(window) : null;
  if (nativeFetch) {
    window.fetch = async function (input, init) {
      var response;
      try {
        var url =
          typeof input === "string"
            ? input
            : input && typeof input.url === "string"
              ? input.url
              : "";
        var isApiRequest =
          url.indexOf("/api/") === 0 ||
          url.indexOf(window.location.origin + "/api/") === 0;

        if (isApiRequest && typeof window.getFirebaseIdToken === "function") {
          var token = await window.getFirebaseIdToken(false);
          if (token) {
            init = init ? Object.assign({}, init) : {};
            var headers = new Headers(init.headers || (input && input.headers) || {});
            if (!headers.has("Authorization")) {
              headers.set("Authorization", "Bearer " + token);
            }
            init.headers = headers;
          }
        }
      } catch (_) {
        // Never block a request because token retrieval failed.
      }

      response = await nativeFetch(input, init);

      // Surface expired sessions instead of failing silently.
      if (response && response.status === 401) {
        try {
          response
            .clone()
            .json()
            .then(function (body) {
              if (
                body &&
                (body.code === "AUTH_REQUIRED" || body.code === "INVALID_TOKEN") &&
                typeof window.showAppToast === "function"
              ) {
                window.showAppToast(
                  "🔐 يرجى تسجيل الدخول بحساب Google للاستفادة من خدمات الذكاء الاصطناعي.",
                  "error"
                );
              }
            })
            .catch(function () {});
        } catch (_) {}
      }

      return response;
    };
  }
})();
