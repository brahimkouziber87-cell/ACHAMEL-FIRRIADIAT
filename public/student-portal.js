/**
 * student-portal.js
 * ---------------------------------------------------------------------------
 * بوابة المتعلّم: صفحة قراءة فقط تعرض سجلاً مشفّراً تم إنشاؤه من طرف الأستاذ(ة).
 *
 * - تقرأ معرّف المشاركة من المسار /s/<id> أو من ?share=<id>.
 * - تتعامل مع الحماية بالقن السري (X-Share-Pin) وأخطاء الانتهاء/القفل.
 * - تبني DOM بـ textContent فقط (لا innerHTML لبيانات غير موثوقة).
 * - المحتوى HTML المشترك يُعرض داخل iframe معزول (sandbox) بدون سكربتات.
 */
(function () {
  'use strict';

  var state = {
    shareId: '',
    pin: '',
    meta: null,
  };

  var el = {
    status: document.getElementById('portalStatus'),
    alert: document.getElementById('alertBox'),
    pinSection: document.getElementById('pinSection'),
    pinHint: document.getElementById('pinHint'),
    pinForm: document.getElementById('pinForm'),
    pinInput: document.getElementById('pinInput'),
    pinSubmit: document.getElementById('pinSubmit'),
    content: document.getElementById('content'),
    printBtn: document.getElementById('printBtn'),
    reloadBtn: document.getElementById('reloadBtn'),
    studentName: document.getElementById('studentName'),
    studentMeta: document.getElementById('studentMeta'),
    metricGrid: document.getElementById('metricGrid'),
    riskCard: document.getElementById('riskCard'),
    riskBody: document.getElementById('riskBody'),
    gradesCard: document.getElementById('gradesCard'),
    gradesBody: document.getElementById('gradesBody'),
    competenciesCard: document.getElementById('competenciesCard'),
    competenciesBody: document.getElementById('competenciesBody'),
    absencesCard: document.getElementById('absencesCard'),
    absencesBody: document.getElementById('absencesBody'),
    behaviorCard: document.getElementById('behaviorCard'),
    behaviorBody: document.getElementById('behaviorBody'),
    remediationCard: document.getElementById('remediationCard'),
    remediationBody: document.getElementById('remediationBody'),
    htmlCard: document.getElementById('htmlCard'),
    shareFrame: document.getElementById('shareFrame'),
    aboutMeta: document.getElementById('aboutMeta'),
  };

  // ---------------------------------------------------------------- utils
  function showAlert(message) {
    el.alert.textContent = message;
    el.alert.classList.remove('hidden');
  }

  function clearAlert() {
    el.alert.textContent = '';
    el.alert.classList.add('hidden');
  }

  function setStatus(text, tone) {
    el.status.textContent = text;
    el.status.className = 'badge ' + (tone || 'neutral');
  }

  function isFiniteNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }

  function fmt(value, suffix) {
    if (!isFiniteNumber(value)) return '—';
    var rounded = Math.round(value * 100) / 100;
    return String(rounded) + (suffix || '');
  }

  function fmtDate(value) {
    if (!value) return '—';
    var date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    try {
      return date.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (_) {
      return date.toISOString().slice(0, 10);
    }
  }

  function textNode(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function getShareId() {
    var match = window.location.pathname.match(/\/s\/([^/?#]+)/);
    if (match) return decodeURIComponent(match[1]);
    try {
      return new URLSearchParams(window.location.search).get('share') || '';
    } catch (_) {
      return '';
    }
  }

  // ---------------------------------------------------------------- fetch
  function fetchShare(pin) {
    var headers = { Accept: 'application/json' };
    if (pin) headers['X-Share-Pin'] = pin;

    return fetch('/api/share/' + encodeURIComponent(state.shareId), {
      method: 'GET',
      headers: headers,
      cache: 'no-store',
      credentials: 'omit',
    }).then(function (response) {
      return response
        .json()
        .catch(function () {
          return {};
        })
        .then(function (body) {
          return { status: response.status, body: body || {} };
        });
    });
  }

  function load(pin) {
    clearAlert();
    setStatus('جارٍ التحميل…', 'neutral');
    el.pinSubmit.disabled = true;

    fetchShare(pin)
      .then(function (result) {
        var body = result.body || {};

        if (result.status === 200 && body.success) {
          state.pin = pin || '';
          state.meta = body;
          el.pinSection.classList.add('hidden');
          render(body);
          return;
        }

        if (body.requiresPin) {
          el.pinSection.classList.remove('hidden');
          el.pinHint.textContent = body.title
            ? 'السجل: ' + body.title + ' — أدخل القن السري لعرضه.'
            : 'أدخل القن السري الذي سلّمه لك الأستاذ(ة) لعرض السجل.';
          setStatus('سجل محمي', 'warn');
          if (result.status === 401 && body.error) showAlert(body.error);
          if (result.status === 429) showAlert(body.error || 'تم قفل الرابط مؤقتاً.');
          el.pinInput.focus();
          return;
        }

        if (result.status === 410) {
          setStatus('منتهي الصلاحية', 'danger');
          showAlert('انتهت فترة صلاحية هذا الرابط. اطلب من الأستاذ(ة) رابطاً جديداً.');
          return;
        }

        if (result.status === 404) {
          setStatus('غير موجود', 'danger');
          showAlert('رابط السجل غير موجود. تأكد من الرابط أو اطلب رابطاً جديداً.');
          return;
        }

        if (result.status === 429) {
          setStatus('مقفل مؤقتاً', 'warn');
          showAlert(body.error || 'محاولات كثيرة. أعد المحاولة لاحقاً.');
          return;
        }

        setStatus('تعذر التحميل', 'danger');
        showAlert(body.error || 'تعذر تحميل السجل. تحقق من الاتصال ثم أعد المحاولة.');
      })
      .catch(function (err) {
        console.error('[portal] failed to load share', err);
        setStatus('تعذر الاتصال', 'danger');
        showAlert('تعذر الاتصال بالخادم. تحقق من الشبكة ثم أعد المحاولة.');
      })
      .then(function () {
        el.pinSubmit.disabled = false;
      });
  }

  // --------------------------------------------------------------- render
  function render(body) {
    var data = body.data || {};
    var student = data.student || {};
    var metrics = data.academicMetrics || {};
    var risk = data.riskIndex || {};
    var absences = data.absences || null;
    var behavior = data.behavior || null;
    var remediation = data.remediation || null;

    var studentName = student.name || body.title || 'سجل التلميذ(ة)';
    document.title = studentName + ' — بوابة المتعلّم';
    el.studentName.textContent = studentName;

    var metaParts = [];
    if (student.className) metaParts.push('القسم: ' + student.className);
    if (student.massar) metaParts.push('رقم مسار: ' + student.massar);
    if (data.schoolYear) metaParts.push('الموسم الدراسي: ' + data.schoolYear);
    el.studentMeta.textContent = metaParts.join(' • ');

    renderMetrics(metrics);
    renderRisk(risk);
    renderGrades(data);
    renderCompetencies(data);
    renderAbsences(absences);
    renderBehavior(behavior);
    renderRemediation(remediation);
    renderSharedHtml(data);

    var about = [];
    if (body.teacherName) about.push('الأستاذ(ة): ' + body.teacherName);
    if (body.institution || body.schoolName) about.push('المؤسسة: ' + (body.institution || body.schoolName));
    about.push('تاريخ الإنشاء: ' + fmtDate(body.createdAt));
    about.push('ينتهي في: ' + fmtDate(body.expiresAt));
    el.aboutMeta.textContent = about.join(' • ');

    el.content.classList.remove('hidden');
    el.printBtn.disabled = false;
    setStatus(body.title ? 'سجل مشفّر' : 'سجل مشفّر', 'ok');

    var heading = document.getElementById('studentTitle');
    if (heading) heading.classList.remove('hidden');
  }

  function renderMetrics(metrics) {
    clear(el.metricGrid);
    var cards = [
      { label: 'معدل الدورة الأولى', value: metrics.s1Avg, suffix: '/20' },
      { label: 'معدل الدورة الثانية', value: metrics.s2Avg, suffix: '/20' },
      { label: 'المعدل السنوي', value: metrics.annualAvg, suffix: '/20' },
      {
        label: 'الرتبة في القسم',
        value: metrics.rankInClass,
        suffix: metrics.classSize ? ' / ' + metrics.classSize : '',
        raw: true,
      },
    ];

    var visible = 0;
    cards.forEach(function (card) {
      if (card.raw ? !isFiniteNumber(card.value) : !isFiniteNumber(card.value)) return;
      var box = document.createElement('div');
      box.className = 'metric';
      box.appendChild(textNode('div', 'label', card.label));
      var value = textNode('div', 'value', fmt(card.value, ''));
      if (card.suffix) {
        var small = document.createElement('small');
        small.textContent = ' ' + card.suffix;
        value.appendChild(small);
      }
      box.appendChild(value);
      el.metricGrid.appendChild(box);
      visible += 1;
    });

    if (visible === 0) {
      el.metricGrid.appendChild(textNode('p', 'muted', 'لا توجد معدلات متاحة في هذا السجل.'));
    }
  }

  function renderRisk(risk) {
    clear(el.riskBody);
    var score = Number(risk.riskScore);
    if (!isFinite(score) && !risk.riskLabel && !risk.diagnosticSummary) {
      el.riskCard.classList.add('hidden');
      return;
    }

    var tone = score >= 66 ? 'danger' : score >= 33 ? 'warn' : 'ok';
    var label = risk.riskLabel || (tone === 'danger' ? 'تعثر مرتفع' : tone === 'warn' ? 'تعثر متوسط' : 'وضع مستقر');
    var badge = textNode('span', 'badge ' + tone, label);
    el.riskBody.appendChild(badge);

    if (isFinite(score)) {
      var row = document.createElement('div');
      row.className = 'bar-row';
      row.style.marginTop = '12px';
      row.appendChild(textNode('div', 'bar-label', 'درجة الخطر'));
      row.appendChild(textNode('div', 'bar-value', fmt(score, '%')));
      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill ' + (tone === 'danger' ? 'low' : tone === 'warn' ? 'mid' : '');
      fill.style.width = Math.min(100, Math.max(0, score)) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      el.riskBody.appendChild(row);
    }

    if (risk.diagnosticSummary) {
      el.riskBody.appendChild(textNode('p', 'muted', risk.diagnosticSummary));
    }

    el.riskCard.classList.remove('hidden');
  }

  function renderGrades(data) {
    clear(el.gradesBody);
    var exams = [];
    if (Array.isArray(data.grades)) exams = data.grades;
    else if (data.grades && Array.isArray(data.grades.examsData)) exams = data.grades.examsData;
    else if (Array.isArray(data.examsData)) exams = data.examsData;

    if (!exams.length) {
      el.gradesCard.classList.add('hidden');
      return;
    }

    var table = document.createElement('table');
    var caption = document.createElement('caption');
    caption.textContent = 'نقط الفروض مقارنة بمعدل القسم';
    table.appendChild(caption);

    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    ['الفرض', 'نقطة التلميذ(ة)', 'معدل القسم', 'أعلى نقطة'].forEach(function (label) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    exams.forEach(function (exam) {
      var row = document.createElement('tr');
      var title = exam.title || exam.code || 'فرض';
      if (exam.semester) title += ' — ' + exam.semester;
      row.appendChild(textNode('td', '', title));
      row.appendChild(textNode('td', '', fmt(Number(exam.studentMark), '/20')));
      row.appendChild(textNode('td', '', fmt(Number(exam.classAvg), '/20')));
      row.appendChild(textNode('td', '', fmt(Number(exam.classMax), '/20')));
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    el.gradesBody.appendChild(table);
    el.gradesCard.classList.remove('hidden');
  }

  function renderCompetencies(data) {
    clear(el.competenciesBody);
    var list = data.competencies;
    if (!list || typeof list !== 'object') {
      el.competenciesCard.classList.add('hidden');
      return;
    }

    var entries = [];
    if (Array.isArray(list)) {
      entries = list.map(function (item) {
        return {
          name: item.nameAr || item.name || item.competencyName || 'كفاية',
          pct: Number(item.pct !== undefined ? item.pct : item.masteryPct),
        };
      });
    } else {
      entries = Object.keys(list).map(function (key) {
        var item = list[key] || {};
        return {
          name: item.nameAr || item.name || key,
          pct: Number(item.pct !== undefined ? item.pct : item.masteryPct),
        };
      });
    }

    entries = entries.filter(function (entry) {
      return isFinite(entry.pct);
    });

    if (!entries.length) {
      el.competenciesCard.classList.add('hidden');
      return;
    }

    entries.forEach(function (entry) {
      var pct = Math.min(100, Math.max(0, entry.pct));
      var row = document.createElement('div');
      row.className = 'bar-row';
      row.appendChild(textNode('div', 'bar-label', entry.name));
      row.appendChild(textNode('div', 'bar-value', fmt(pct, '%')));
      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill' + (pct < 50 ? ' low' : pct < 75 ? ' mid' : '');
      fill.style.width = pct + '%';
      track.appendChild(fill);
      row.appendChild(track);
      el.competenciesBody.appendChild(row);
    });

    el.competenciesCard.classList.remove('hidden');
  }

  function renderAbsences(absences) {
    clear(el.absencesBody);
    if (!absences) {
      el.absencesCard.classList.add('hidden');
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'metric-grid';
    [
      { label: 'مجموع ساعات الغياب', value: absences.totalHours, suffix: ' س' },
      { label: 'غياب غير مبرر', value: absences.unjustifiedHours, suffix: ' س' },
      { label: 'غياب مبرر', value: absences.justifiedHours, suffix: ' س' },
      { label: 'عدد التأخرات', value: absences.lateCount, suffix: '' },
    ].forEach(function (item) {
      var box = document.createElement('div');
      box.className = 'metric';
      box.appendChild(textNode('div', 'label', item.label));
      box.appendChild(textNode('div', 'value', fmt(Number(item.value), item.suffix)));
      grid.appendChild(box);
    });
    el.absencesBody.appendChild(grid);

    var records = Array.isArray(absences.records) ? absences.records : [];
    if (records.length) {
      var table = document.createElement('table');
      table.style.marginTop = '14px';
      var caption = document.createElement('caption');
      caption.textContent = 'آخر الغيابات المسجلة';
      table.appendChild(caption);

      var thead = document.createElement('thead');
      var headRow = document.createElement('tr');
      ['التاريخ', 'الحصة', 'الحالة', 'المدة', 'الملاحظة'].forEach(function (label) {
        var th = document.createElement('th');
        th.scope = 'col';
        th.textContent = label;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      var tbody = document.createElement('tbody');
      records.forEach(function (record) {
        var row = document.createElement('tr');
        row.appendChild(textNode('td', '', fmtDate(record.date)));
        row.appendChild(textNode('td', '', record.session || '—'));
        row.appendChild(textNode('td', '', record.status || '—'));
        row.appendChild(textNode('td', '', record.duration !== undefined ? record.duration + ' س' : '—'));
        row.appendChild(textNode('td', '', record.reason || '—'));
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      el.absencesBody.appendChild(table);
    }

    el.absencesCard.classList.remove('hidden');
  }

  function renderBehavior(behavior) {
    clear(el.behaviorBody);
    if (!behavior) {
      el.behaviorCard.classList.add('hidden');
      return;
    }

    el.behaviorBody.appendChild(
      textNode('p', '', 'الواجبات غير المنجزة: ' + (behavior.missedHomework || 0))
    );

    var notes = behavior.notesList;
    if (Array.isArray(notes) && notes.length) {
      var list = document.createElement('ul');
      list.className = 'notes';
      notes.forEach(function (note) {
        var text = typeof note === 'string' ? note : note && (note.note || note.text || note.label);
        if (!text) return;
        list.appendChild(textNode('li', '', text));
      });
      if (list.childNodes.length) el.behaviorBody.appendChild(list);
    }

    el.behaviorCard.classList.remove('hidden');
  }

  function renderRemediation(remediation) {
    clear(el.remediationBody);
    if (!remediation) {
      el.remediationCard.classList.add('hidden');
      return;
    }

    if (remediation.notes) {
      el.remediationBody.appendChild(textNode('p', '', remediation.notes));
    }

    var actions = remediation.actionItems;
    if (Array.isArray(actions) && actions.length) {
      var list = document.createElement('ul');
      list.className = 'notes';
      actions.forEach(function (action) {
        if (!action) return;
        list.appendChild(textNode('li', '', typeof action === 'string' ? action : action.text || ''));
      });
      el.remediationBody.appendChild(list);
    }

    if (!el.remediationBody.childNodes.length) {
      el.remediationCard.classList.add('hidden');
      return;
    }

    el.remediationCard.classList.remove('hidden');
  }

  function renderSharedHtml(data) {
    var html = typeof data.html === 'string' ? data.html : data.htmlContent;
    if (typeof html !== 'string' || !html.trim()) {
      el.htmlCard.classList.add('hidden');
      return;
    }
    el.shareFrame.srcdoc = html;
    el.htmlCard.classList.remove('hidden');
  }

  // ---------------------------------------------------------------- init
  function init() {
    state.shareId = getShareId();
    if (!state.shareId) {
      setStatus('رابط غير صالح', 'danger');
      showAlert('لا يحتوي هذا الرابط على معرّف سجل. اطلب رابطاً صحيحاً من الأستاذ(ة).');
      return;
    }

    el.pinForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var pin = el.pinInput.value.trim();
      if (!pin) {
        showAlert('أدخل القن السري أولاً.');
        el.pinInput.focus();
        return;
      }
      load(pin);
    });

    el.printBtn.addEventListener('click', function () {
      window.print();
    });

    el.reloadBtn.addEventListener('click', function () {
      load(state.pin);
    });

    load('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
