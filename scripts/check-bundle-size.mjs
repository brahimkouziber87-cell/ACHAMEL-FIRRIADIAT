#!/usr/bin/env node
/**
 * check-bundle-size.mjs
 * ---------------------------------------------------------------------------
 * ميزانية حجم الحزمة (bundle budget) لمنع التضخم الصامت.
 *
 * يُشغَّل بعد `npm run build`:
 *   npm run size
 *   npm run size -- --json
 *
 * كل ميزانية لها حدّان:
 *   - limit:  حد أقصى صارم، تجاوزه يفشل البناء (exit code 1).
 *   - warn:   عتبة تحذير فقط (لا تفشل).
 *
 * عند إضافة ملف كبير جديد، أضف قاعدة له هنا بدل رفع الحدود العامة.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const MB = 1024 * 1024;

/** @type {{name:string, match:(file:string)=>boolean, pick?:'all'|'largest', limit:number, warn:number, hint?:string}[]} */
const RULES = [
  {
    name: 'التطبيق الرئيسي (dist/app.js)',
    match: (f) => f === path.join(DIST, 'app.js'),
    limit: 3.3 * MB,
    warn: 3.1 * MB,
    hint: 'الملف الأساسي للواجهة القديمة. أي إضافة كبيرة يجب أن تُقسَّم إلى وحدة مستقلة.',
  },
  {
    name: 'الصفحة الرئيسية (dist/index.html)',
    match: (f) => f === path.join(DIST, 'index.html'),
    limit: 1.95 * MB,
    warn: 1.8 * MB,
    hint: 'الملف يحوي كل شاشات HTML. أخرج الأقسام النادرة إلى قوالب منفصلة عند الحاجة.',
  },
  {
    name: 'أكبر حزمة JS في dist/assets',
    match: (f) => f.startsWith(path.join(DIST, 'assets')) && f.endsWith('.js'),
    pick: 'largest',
    limit: 3.0 * MB,
    warn: 1.5 * MB,
    hint: 'PedagogicalStudioApp هو الأكبر. الهدف التالي: تقسيمه عبر dynamic import حسب التبويب.',
  },
  {
    name: 'عامل الخدمة (dist/sw.js)',
    match: (f) => f === path.join(DIST, 'sw.js'),
    limit: 150 * 1024,
    warn: 120 * 1024,
  },
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function format(bytes) {
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

if (!fs.existsSync(DIST)) {
  console.error('✗ مجلد dist غير موجود. شغّل `npm run build` أولاً.');
  process.exit(1);
}

const files = walk(DIST);
const jsonMode = process.argv.includes('--json');

if (jsonMode) {
  const rows = files.map((file) => ({
    file: path.relative(process.cwd(), file).replaceAll('\\', '/'),
    bytes: fs.statSync(file).size,
  }));
  rows.sort((a, b) => b.bytes - a.bytes);
  console.log(JSON.stringify({ totalBytes: rows.reduce((a, r) => a + r.bytes, 0), files: rows }, null, 2));
  process.exit(0);
}

let failed = 0;
let warned = 0;
const results = [];

for (const rule of RULES) {
  let matched = files.filter(rule.match);
  if (rule.pick === 'largest' && matched.length > 1) {
    matched = [matched.reduce((a, b) => (fs.statSync(a).size >= fs.statSync(b).size ? a : b))];
  }
  if (matched.length === 0) {
    // sw.js غير موجود عند تعطيل PWA: ليس خطأ.
    if (rule.name.includes('sw.js')) continue;
    results.push({ rule, status: 'missing', file: null, size: 0 });
    continue;
  }
  for (const file of matched) {
    const size = fs.statSync(file).size;
    let status = 'ok';
    if (size > rule.limit) {
      status = 'fail';
      failed += 1;
    } else if (size > rule.warn) {
      status = 'warn';
      warned += 1;
    }
    results.push({ rule, status, file: path.relative(process.cwd(), file).replaceAll('\\', '/'), size });
  }
}

const icon = { ok: '✓', warn: '!', fail: '✗', missing: '?' };
const color = { ok: '\x1b[32m', warn: '\x1b[33m', fail: '\x1b[31m', missing: '\x1b[90m' };
const reset = '\x1b[0m';

console.log('\nميزانية حجم الحزمة:\n');
for (const { rule, status, file, size } of results) {
  const pct = size ? ` (${Math.round((size / rule.limit) * 100)}% من الحد)` : '';
  console.log(
    `${color[status]}${icon[status]}${reset} ${rule.name.padEnd(38)} ${format(size).padStart(10)}${pct}`
  );
  if (file) console.log(`    ${file}`);
  if (status === 'fail' || status === 'warn') console.log(`    الحد: ${format(rule.limit)} — ${format(rule.warn)} تحذير`);
  if ((status === 'fail' || status === 'warn') && rule.hint) console.log(`    ملاحظة: ${rule.hint}`);
}

const total = files.reduce((sum, f) => sum + fs.statSync(f).size, 0);
console.log(`\nالمجموع الكلي لـ dist: ${format(total)}`);

if (failed > 0) {
  console.error(`\n✗ فشل: ${failed} ملف تجاوز الميزانية، و${warned} تحذير.`);
  process.exit(1);
}
if (warned > 0) {
  console.log(`\n! نجاح مع ${warned} تحذير (لا يوقف البناء).`);
} else {
  console.log('\n✓ كل الملفات داخل الميزانية.');
}
