#!/usr/bin/env node
/**
 * run-tests.mjs
 * ---------------------------------------------------------------------------
 * مشغّل اختبارات محايد عبر المنصات وإصدارات Node.
 *
 * السبب: `node --test src` يعمل في Node 24+ لكنه يفشل في Node 22
 * (يحاول استيراد المجلد كوحدة ES). هذا السكربت يكتشف ملفات `*.test.ts`
 * ثم يمرّرها صراحةً إلى مشغّل Node، فيعمل في CI المحلي وعلى Linux.
 */
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const testFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(full);
    } else if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx')) {
      testFiles.push(full);
    }
  }
}

walk(path.join(root, 'src'));

if (testFiles.length === 0) {
  console.error('✗ لم يُعثر على أي ملف اختبار (*.test.ts) داخل src.');
  process.exit(1);
}

testFiles.sort();
console.log(`تشغيل ${testFiles.length} ملف اختبار...\n`);

const child = spawn(
  process.execPath,
  ['--import', 'tsx', '--test', ...testFiles],
  { stdio: 'inherit', env: process.env }
);

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
