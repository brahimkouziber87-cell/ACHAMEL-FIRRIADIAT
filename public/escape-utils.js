/**
 * escape-utils.js
 * ---------------------------------------------------------------------------
 * أدوات تعقيم نصية مشتركة تُحمَّل قبل بقية سكربتات الواجهة.
 * الهدف: ضمان توفر escapeHtml/escapeQuotes في كل الملفات حتى التي لا تعرّفهما،
 * وتفادي كسر الواجهة أو حقن HTML عند إدخال أسماء تحتوي رموزاً خاصة.
 *
 * - escapeHtml: يعقّم النص لعرضه داخل HTML.
 * - escapeQuotes: يهيّئ النص لوضعه داخل سلسلة JS ضمن خاصية onclick/onchange.
 */
(function () {
  'use strict';

  if (typeof window.escapeHtml !== 'function') {
    window.escapeHtml = function escapeHtml(value) {
      if (value === null || value === undefined) return '';
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };
  }

  if (typeof window.escapeQuotes !== 'function') {
    window.escapeQuotes = function escapeQuotes(value) {
      if (value === null || value === undefined) return '';
      return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    };
  }
})();
