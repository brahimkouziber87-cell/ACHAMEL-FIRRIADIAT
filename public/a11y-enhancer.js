/**
 * a11y-enhancer.js
 * ---------------------------------------------------------------------------
 * طبقة وصولية تدريجية (progressive accessibility layer) للتطبيق الرئيسي.
 *
 * تعالج المشاكل البنيوية في واجهة ضخمة دون إعادة كتابتها:
 *  - معلم <main> ورابط «تخطَّ إلى المحتوى».
 *  - عنوان h1 مخفي بصرياً (sr-only) إن لم يوجد.
 *  - أسماء وصولية للأزرار والروابط التي تعتمد على أيقونة فقط.
 *  - تسميات (aria-label) للحقول التي لا تملك <label>.
 *  - تصحيح قفزات ترتيب العناوين عبر aria-level دون تغيير المظهر.
 *  - مراقبة العناصر المضافة ديناميكياً (النوافذ المنبثقة).
 *
 * كل شيء متدرّج: لا يغيّر أي onclick أو نص ظاهر، ولا يرمي أخطاء إن غاب عنصر.
 */
(function () {
  'use strict';

  var ICON_LABELS = {
    x: 'إغلاق', 'x-circle': 'إلغاء', 'x-octagon': 'إغلاق',
    plus: 'إضافة', 'plus-circle': 'إضافة', minus: 'إنقاص',
    trash: 'حذف', 'trash-2': 'حذف',
    pencil: 'تعديل', 'edit-3': 'تعديل', 'edit-2': 'تعديل', pen: 'تعديل',
    save: 'حفظ', printer: 'طباعة', download: 'تنزيل', upload: 'رفع',
    search: 'بحث', filter: 'تصفية', settings: 'إعدادات', sliders: 'إعدادات',
    eye: 'عرض', 'eye-off': 'إخفاء', refresh: 'تحديث', 'refresh-cw': 'تحديث',
    'rotate-ccw': 'إعادة', 'rotate-cw': 'إعادة', undo: 'تراجع', redo: 'إعادة',
    check: 'تأكيد', 'check-circle': 'تأكيد', copy: 'نسخ', 'external-link': 'فتح في نافذة جديدة',
    calendar: 'التقويم', clock: 'الوقت', bell: 'التنبيهات', 'bell-ring': 'التنبيهات',
    user: 'المستخدم', users: 'المستخدمون', 'user-check': 'المستخدم',
    'file-text': 'ملف', file: 'ملف', folder: 'مجلد', 'folder-open': 'فتح المجلد',
    image: 'صورة', camera: 'تصوير', share: 'مشاركة', 'share-2': 'مشاركة',
    'qr-code': 'رمز QR', menu: 'القائمة', 'more-horizontal': 'المزيد', 'more-vertical': 'المزيد',
    maximize: 'تكبير', minimize: 'تصغير', 'zoom-in': 'تكبير', 'zoom-out': 'تصغير',
    play: 'تشغيل', pause: 'إيقاف مؤقت', volume: 'الصوت', wifi: 'الاتصال',
    database: 'قاعدة البيانات', cloud: 'السحابة', lock: 'قفل', unlock: 'فتح القفل',
    shield: 'الحماية', 'help-circle': 'مساعدة', info: 'معلومات', 'alert-triangle': 'تحذير',
    'chevron-down': 'توسيع', 'chevron-up': 'طي', 'chevron-left': 'السابق', 'chevron-right': 'التالي',
    'arrow-left': 'السابق', 'arrow-right': 'التالي', 'arrow-up': 'أعلى', 'arrow-down': 'أسفل',
    send: 'إرسال', mail: 'بريد', phone: 'هاتف', link: 'رابط', list: 'قائمة',
    grid: 'شبكة', table: 'جدول', 'bar-chart-3': 'إحصائيات', 'trending-up': 'تطور',
    graduation: 'التعليم', 'graduation-cap': 'التعليم', book: 'كتاب', 'book-open': 'كتاب',
    calculator: 'آلة حاسبة', sigma: 'رياضيات', sparkles: 'ذكاء اصطناعي', zap: 'تنفيذ سريع',
    stethoscope: 'تشخيص', award: 'شهادة', tag: 'وسم', map: 'خريطة', 'map-pin': 'الموقع',
    school: 'المؤسسة', home: 'الرئيسية', layers: 'طبقات', code: 'كود', type: 'نص',
  };

  var FUNCTION_LABELS = [
    [/^close/i, 'إغلاق'],
    [/^open/i, 'فتح'],
    [/^show/i, 'عرض'],
    [/^view|^preview|^display/i, 'عرض'],
    [/^toggle/i, 'تبديل'],
    [/^save/i, 'حفظ'],
    [/^delete|^remove|^clear|^purge/i, 'حذف'],
    [/^print/i, 'طباعة'],
    [/^export/i, 'تصدير'],
    [/^download/i, 'تنزيل'],
    [/^upload/i, 'رفع'],
    [/^add|^create|^new/i, 'إضافة'],
    [/^edit|^update|^modify/i, 'تعديل'],
    [/^refresh|^reload|^sync/i, 'تحديث'],
    [/^search|^filter|^find/i, 'بحث'],
    [/^select|^choose/i, 'اختيار'],
    [/^copy|^duplicate/i, 'نسخ'],
    [/^share/i, 'مشاركة'],
    [/^send|^submit/i, 'إرسال'],
    [/^back|^prev/i, 'السابق'],
    [/^next/i, 'التالي'],
    [/^confirm|^validate/i, 'تأكيد'],
    [/^cancel|^dismiss/i, 'إلغاء'],
    [/^scroll/i, 'انتقال'],
    [/^go/i, 'انتقال'],
    [/^reset/i, 'إعادة تعيين'],
    [/^restore/i, 'استرجاع'],
    [/^import/i, 'استيراد'],
    [/^generate/i, 'توليد'],
    [/^calculate|^compute/i, 'حساب'],
    [/^run/i, 'تشغيل'],
    [/^stop/i, 'إيقاف'],
  ];

  var FIELD_FALLBACKS = {
    checkbox: 'خيار',
    radio: 'خيار',
    range: 'شريط تمرير',
    color: 'لون',
    file: 'اختيار ملف',
    date: 'تاريخ',
    time: 'وقت',
    'datetime-local': 'تاريخ ووقت',
    month: 'شهر',
    week: 'أسبوع',
    number: 'رقم',
    search: 'بحث',
    tel: 'هاتف',
    email: 'بريد إلكتروني',
    password: 'كلمة سر',
    url: 'رابط',
  };

  function cleanText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .replace(/^(مثال|مثلاً|example)\s*[:：]\s*/i, '')
      .trim();
  }

  function hasAccessibleName(el) {
    if (el.getAttribute('aria-label')) return true;
    if (el.getAttribute('aria-labelledby')) return true;
    if (el.getAttribute('title')) return true;
    if (cleanText(el.textContent)) return true;
    var img = el.querySelector('img[alt]');
    if (img && cleanText(img.getAttribute('alt'))) return true;
    var svgTitle = el.querySelector('svg title');
    if (svgTitle && cleanText(svgTitle.textContent)) return true;
    return false;
  }

  function labelFromIcon(el) {
    var icon = el.querySelector('[data-lucide]');
    if (!icon) return '';
    var name = icon.getAttribute('data-lucide');
    return ICON_LABELS[name] || '';
  }

  function labelFromHandler(el) {
    var code = el.getAttribute('onclick') || el.getAttribute('onchange') || '';
    if (!code) return '';
    var match = code.match(/(?:^|[^\w$.])([A-Za-z_$][\w$]*)\s*\(/);
    if (!match) return '';
    var fn = match[1];
    for (var i = 0; i < FUNCTION_LABELS.length; i++) {
      if (FUNCTION_LABELS[i][0].test(fn)) return FUNCTION_LABELS[i][1];
    }
    // camelCase → words, keep it readable for screen readers.
    var words = fn.replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim();
    return words.length >= 3 ? words : '';
  }

  function ensureName(el) {
    if (hasAccessibleName(el)) return false;
    var label = labelFromIcon(el) || labelFromHandler(el);
    if (!label) {
      if (el.tagName === 'A') label = 'رابط';
      else if (el.tagName === 'BUTTON') label = 'زر';
      else return false;
    }
    el.setAttribute('aria-label', label);
    return true;
  }

  function ensureFieldLabel(el) {
    if (el.type === 'hidden' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return false;
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
    if (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]')) return false;
    if (el.closest('label')) return false;
    if (el.getAttribute('title')) return false;

    var label = cleanText(el.getAttribute('placeholder')) || cleanText(el.getAttribute('data-label'));
    if (!label) {
      var name = el.getAttribute('name') || el.getAttribute('id') || '';
      if (/search|بحث/i.test(name)) label = 'بحث';
    }
    if (!label) {
      if (el.tagName === 'SELECT') label = 'قائمة اختيار';
      else if (el.tagName === 'TEXTAREA') label = 'حقل نص';
      else label = FIELD_FALLBACKS[el.type] || 'حقل إدخال';
    }
    el.setAttribute('aria-label', label);
    return true;
  }

  function processControls(root) {
    var selector = 'button, a, input, select, textarea, [role="button"]';
    var nodes;
    try {
      nodes = root.querySelectorAll(selector);
    } catch (_) {
      return;
    }
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest('[aria-hidden="true"]')) continue;
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
        ensureFieldLabel(el);
      } else {
        ensureName(el);
      }
    }
  }

  function processHeadings(root) {
    var headings = [];
    try {
      headings = Array.prototype.slice.call(root.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    } catch (_) {
      return;
    }
    var previous = 0;
    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];
      if (heading.closest('[aria-hidden="true"]')) continue;
      var level = Number(heading.tagName.charAt(1));
      if (previous > 0 && level > previous + 1) {
        var corrected = previous + 1;
        if (!heading.hasAttribute('data-a11y-level')) {
          heading.setAttribute('role', 'heading');
          heading.setAttribute('aria-level', String(corrected));
          heading.setAttribute('data-a11y-level', String(level));
        }
        level = corrected;
      }
      previous = level;
    }
  }

  function markDecorativeIcons(root) {
    var icons;
    try {
      icons = root.querySelectorAll('[data-lucide]');
    } catch (_) {
      return;
    }
    for (var i = 0; i < icons.length; i++) {
      var icon = icons[i];
      if (icon.closest('button, a')) continue; // keep the name derivation path
      if (!icon.getAttribute('aria-hidden') && !cleanText(icon.textContent)) {
        icon.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function injectStyles() {
    if (document.getElementById('a11yEnhancerStyles')) return;
    var style = document.createElement('style');
    style.id = 'a11yEnhancerStyles';
    style.textContent = [
      '.a11y-skip-link{position:absolute;inset-inline-start:-9999px;top:8px;z-index:100000;background:#0f172a;color:#fff;padding:10px 16px;border-radius:8px;font-weight:800;text-decoration:none;}',
      '.a11y-skip-link:focus{inset-inline-start:8px;outline:3px solid #f59e0b;outline-offset:2px;}',
      '.a11y-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;}',
    ].join('');
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureMainLandmark() {
    var main = document.querySelector('main, [role="main"]');
    if (!main) {
      var container = document.querySelector('body > .container') || document.querySelector('.container');
      if (container) {
        main = container;
        container.setAttribute('role', 'main');
        if (!container.id) container.id = 'mainContent';
        if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
      }
    }
    return main;
  }

  function ensureSkipLink(main) {
    if (!main) return;
    var id = main.id;
    if (!id) {
      id = 'mainContent';
      main.id = id;
    }
    if (document.querySelector('.a11y-skip-link')) return;
    var link = document.createElement('a');
    link.className = 'a11y-skip-link';
    link.href = '#' + id;
    link.textContent = 'تخطَّ إلى المحتوى الرئيسي';
    document.body.insertBefore(link, document.body.firstChild);
  }

  function ensureH1(main) {
    if (!main || document.querySelector('h1')) return;
    var h1 = document.createElement('h1');
    h1.className = 'a11y-sr-only';
    h1.textContent = 'منظومة التدبير التربوي لمادة الرياضيات';
    main.insertBefore(h1, main.firstChild);
  }

  function run(root) {
    root = root || document;
    injectStyles();
    var main = ensureMainLandmark();
    ensureSkipLink(main);
    ensureH1(main);
    processControls(root);
    processHeadings(root);
    markDecorativeIcons(root);
  }

  var scheduled = null;
  function schedule(root) {
    if (scheduled) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      try {
        run(root || document);
      } catch (err) {
        console.warn('[a11y] enhancement failed:', err && err.message ? err.message : err);
      }
    }, 180);
  }

  function observe() {
    if (typeof MutationObserver === 'undefined' || !document.body) return;
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length) {
          schedule(document);
          return;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    run(document);
    observe();
  }

  window.runA11yEnhancer = function () { run(document); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
