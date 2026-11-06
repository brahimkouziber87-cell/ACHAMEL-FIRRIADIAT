/**
 * privacy-controls.js
 * ---------------------------------------------------------------------------
 * أدوات الخصوصية وحماية المعطيات (CNDP):
 *  - تصدير كل البيانات المحلية إلى ملف JSON واحد.
 *  - حذف نهائي لكل البيانات المحلية (LocalStorage, SessionStorage,
 *    IndexedDB, Cache Storage) بعد تأكيد صريح.
 *  - ملخص حجم/عدد العناصر المخزّنة.
 *
 * كل شيء يجري داخل المتصفح؛ لا تُرسل أي بيانات إلى أي خادم.
 */
(function () {
  'use strict';

  var KNOWN_IDB_NAMES = ['MathPedagogicalSystemIDB', 'pedagogy_studio_db', 'keyval-store'];

  function toast(message, type) {
    try {
      if (typeof window.showAppToast === 'function') {
        window.showAppToast(message, type || 'info');
        return;
      }
      if (typeof window.showNotification === 'function') {
        window.showNotification(message, type || 'info');
        return;
      }
    } catch (_) {
      /* ignore */
    }
    // Fallback: non-blocking console message (never a blocking alert).
    console.info('[privacy]', message);
  }

  function dumpStorage(storage) {
    var result = {};
    if (!storage) return result;
    try {
      for (var i = 0; i < storage.length; i += 1) {
        var key = storage.key(i);
        if (key === null) continue;
        result[key] = storage.getItem(key);
      }
    } catch (err) {
      result.__error = 'تعذر قراءة التخزين: ' + (err && err.message ? err.message : err);
    }
    return result;
  }

  function listDatabases() {
    if (!window.indexedDB) return Promise.resolve([]);
    if (typeof indexedDB.databases === 'function') {
      return indexedDB.databases().then(function (dbs) {
        return (dbs || []).map(function (db) { return db && db.name; }).filter(Boolean);
      }).catch(function () { return []; });
    }
    return Promise.resolve(KNOWN_IDB_NAMES.slice());
  }

  function readDatabase(name) {
    return new Promise(function (resolve) {
      var request;
      try {
        request = indexedDB.open(name);
      } catch (_) {
        resolve(null);
        return;
      }

      request.onupgradeneeded = function () {
        // Do not create missing databases: abort cleanly.
        try { request.transaction.abort(); } catch (_) {}
        resolve(null);
      };
      request.onerror = function () { resolve(null); };
      request.onsuccess = function () {
        var db = request.result;
        var storeNames = Array.prototype.slice.call(db.objectStoreNames || []);
        if (storeNames.length === 0) {
          db.close();
          resolve({});
          return;
        }
        var output = {};
        var remaining = storeNames.length;
        var failed = false;

        storeNames.forEach(function (storeName) {
          try {
            var tx = db.transaction(storeName, 'readonly');
            var store = tx.objectStore(storeName);
            var getAll = store.getAll();
            getAll.onsuccess = function () {
              output[storeName] = getAll.result || [];
              remaining -= 1;
              if (remaining === 0 && !failed) {
                db.close();
                resolve(output);
              }
            };
            getAll.onerror = function () {
              failed = true;
              db.close();
              resolve(null);
            };
          } catch (_) {
            failed = true;
            db.close();
            resolve(null);
          }
        });
      };
    });
  }

  async function collectIndexedDB() {
    var names = await listDatabases();
    var result = {};
    for (var i = 0; i < names.length; i += 1) {
      var name = names[i];
      if (!name) continue;
      var data = await readDatabase(name);
      if (data !== null) result[name] = data;
    }
    return result;
  }

  function listCaches() {
    if (!('caches' in window)) return Promise.resolve([]);
    return caches.keys().then(function (keys) { return keys || []; }).catch(function () { return []; });
  }

  function downloadJson(payload, filename) {
    var blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function timestamp() {
    var now = new Date();
    function pad(value) { return String(value).padStart(2, '0'); }
    return (
      now.getFullYear() +
      '-' + pad(now.getMonth() + 1) +
      '-' + pad(now.getDate()) +
      '_' + pad(now.getHours()) +
      pad(now.getMinutes())
    );
  }

  window.exportAllLocalData = async function () {
    try {
      toast('جارٍ تجهيز نسخة من بياناتك المحلية…', 'info');

      var payload = {
        application: 'منظومة التدبير التربوي - مادة الرياضيات',
        formatVersion: 1,
        exportedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        localStorage: dumpStorage(window.localStorage),
        sessionStorage: dumpStorage(window.sessionStorage),
        indexedDB: await collectIndexedDB(),
        cacheStorage: await listCaches(),
      };

      downloadJson(payload, 'بياناتي_المحلية_' + timestamp() + '.json');
      toast('تم تصدير بياناتك المحلية بنجاح.', 'success');
      return true;
    } catch (err) {
      console.error('[privacy] export failed', err);
      toast('تعذر تصدير البيانات. حاول مرة أخرى.', 'error');
      return false;
    }
  };

  async function deleteAllLocalData() {
    try { window.localStorage.clear(); } catch (_) {}
    try { window.sessionStorage.clear(); } catch (_) {}

    var names = await listDatabases();
    var deletions = names.filter(Boolean).map(function (name) {
      return new Promise(function (resolve) {
        try {
          var request = indexedDB.deleteDatabase(name);
          request.onsuccess = function () { resolve(); };
          request.onerror = function () { resolve(); };
          request.onblocked = function () { resolve(); };
        } catch (_) {
          resolve();
        }
      });
    });
    await Promise.all(deletions);

    try {
      var keys = await listCaches();
      await Promise.all(keys.map(function (key) {
        return caches.delete(key).catch(function () {});
      }));
    } catch (_) {}

    return true;
  }

  window.confirmDeleteAllLocalData = async function () {
    var phrase = window.prompt(
      'سيتم حذف كل بيانات التلاميذ والنقط والغياب والتفضيلات من هذا الجهاز نهائياً، ولا يمكن التراجع.\n' +
      'احتفظ بنسخة احتياطية أولاً (زر «تصدير بياناتي»).\n\n' +
      'اكتب كلمة: حذف'
    );

    if (phrase === null) return false;
    if (String(phrase).trim() !== 'حذف') {
      toast('لم يتم الحذف: كلمة التأكيد غير مطابقة.', 'warning');
      return false;
    }

    var confirmed = window.confirm('تأكيد أخير: هل تريد فعلاً حذف كل البيانات المحلية نهائياً؟');
    if (!confirmed) return false;

    await deleteAllLocalData();
    toast('تم حذف البيانات المحلية. ستُعاد تهيئة المنظومة…', 'success');
    setTimeout(function () { window.location.reload(); }, 1200);
    return true;
  };

  window.refreshPrivacySummary = async function () {
    var target = document.getElementById('privacyStorageSummary');
    if (!target) return;

    var localKeys = 0;
    try { localKeys = window.localStorage.length; } catch (_) {}

    var dbs = await listDatabases();
    var cacheKeys = await listCaches();

    target.textContent =
      'عناصر التخزين المحلي: ' + localKeys +
      ' • قواعد IndexedDB: ' + dbs.length +
      ' • مخازن مؤقتة (Cache): ' + cacheKeys.length;
  };

  window.openPrivacyPolicy = function () {
    window.open('/privacy.html', '_blank', 'noopener');
  };
})();
