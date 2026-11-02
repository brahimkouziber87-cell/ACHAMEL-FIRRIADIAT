import test from "node:test";
import assert from "node:assert/strict";
import { CURRICULUM_DB } from "../data/curriculum";
import { COMPETENCY_QUESTION_BANK } from "../data/competencyQuestionBank";
import { parseImportedExamText } from "./importedExamSimulator";

test("1BAC_LSH and 1BAC_SH are both recognized and unified as 1ère Bac Lettres et Sciences Humaines", () => {
  // 1. Both keys must resolve
  assert.ok(CURRICULUM_DB["1BAC_LSH"], "CURRICULUM_DB must contain 1BAC_LSH");
  assert.ok(CURRICULUM_DB["1BAC_SH"], "CURRICULUM_DB must contain 1BAC_SH");
  assert.ok(CURRICULUM_DB["1BAC_LETTRES"], "CURRICULUM_DB must contain backward-compatible 1BAC_LETTRES");

  const trackLsh = CURRICULUM_DB["1BAC_LSH"];
  const trackSh = CURRICULUM_DB["1BAC_SH"];

  // 2. Both keys must point to the same curriculum data
  assert.strictEqual(trackLsh.code, "1BAC_LSH");
  assert.strictEqual(trackSh.code, "1BAC_LSH");

  // 3. Labels must explicitly mention both symbols (1Bac SH / 1Bac LSH)
  assert.ok(trackLsh.labelAr.includes("1Bac SH") && trackLsh.labelAr.includes("1Bac LSH"), "labelAr must mention both 1Bac SH and 1Bac LSH");
  assert.ok(trackLsh.labelAr.includes("الآداب والعلوم الإنسانية"), "labelAr must mention الآداب والعلوم الإنسانية");
  assert.ok(trackLsh.labelFr.includes("1Bac SH") && trackLsh.labelFr.includes("1Bac LSH"), "labelFr must mention both 1Bac SH and 1Bac LSH");

  // 4. Official Moroccan duration and exam count for 1Bac Lettres et Sciences Humaines
  assert.strictEqual(trackLsh.durationAr, "ساعة واحدة (1h)", "Duration in Arabic must be 1 hour");
  assert.strictEqual(trackLsh.durationFr, "1 heure", "Duration in French must be 1 hour");
  assert.strictEqual(trackLsh.dsCount, 2, "1Bac LSH must have 2 official DS per semester (Note 142-08)");

  // 5. Official curriculum lessons
  // Semester 1: DS1 (Logique, pourcentages, équations/inéquations/systèmes), DS2 (Suites numériques)
  assert.ok(trackLsh.semesters.S1.DS1, "S1 must contain DS1");
  assert.ok(trackLsh.semesters.S1.DS2, "S1 must contain DS2");
  const s1Lessons = trackLsh.semesters.S1.DS1.map(l => l.lessonAr).join(" ");
  assert.ok(s1Lessons.includes("النسب المئوية"), "DS1 must contain النسب المئوية");
  assert.ok(s1Lessons.includes("المعادلات"), "DS1 must contain المعادلات");

  const s1Ds2Lessons = trackLsh.semesters.S1.DS2.map(l => l.lessonAr).join(" ");
  assert.ok(s1Ds2Lessons.includes("المتتاليات العددية"), "DS2 must contain المتتاليات العددية");

  // Semester 2: DS1 (Dénombrement), DS2 (Fonctions, Statistiques)
  assert.ok(trackLsh.semesters.S2.DS1, "S2 must contain DS1");
  assert.ok(trackLsh.semesters.S2.DS2, "S2 must contain DS2");
  const s2Ds1Lessons = trackLsh.semesters.S2.DS1.map(l => l.lessonAr).join(" ");
  assert.ok(s2Ds1Lessons.includes("التعداد"), "S2 DS1 must contain التعداد");

  const s2Ds2Lessons = trackLsh.semesters.S2.DS2.map(l => l.lessonAr).join(" ");
  assert.ok(s2Ds2Lessons.includes("الدوال") || s2Ds2Lessons.includes("اشتقاق"), "S2 DS2 must contain الدوال");
  assert.ok(s2Ds2Lessons.includes("الإحصاء"), "S2 DS2 must contain الإحصاء");
});

test("Competency Question Bank includes exercises targeting 1BAC_LSH and 1BAC_SH", () => {
  const lshExercises = COMPETENCY_QUESTION_BANK.filter(ex =>
    ex.targetTracks.includes("1BAC_LSH") || ex.targetTracks.includes("1BAC_SH")
  );
  assert.ok(lshExercises.length >= 2, "Expected at least 2 competency exercises for 1BAC_LSH / 1BAC_SH");

  const pctEx = lshExercises.find(ex => ex.code === "LSH-PCT-01");
  assert.ok(pctEx, "LSH-PCT-01 exercise must exist");
  assert.ok(pctEx.statementAr.some(s => s.includes("المعامل الضارب")), "Must include multiplier coefficient");

  const suiteEx = lshExercises.find(ex => ex.code === "LSH-SUITE-02");
  assert.ok(suiteEx, "LSH-SUITE-02 exercise must exist");
  assert.ok(suiteEx.statementAr.some(s => s.includes("المتتالية الحسابية")), "Must include arithmetic progression");
});

test("Simulated exam analyzer correctly detects '1bac sh' and '1bac lsh'", () => {
  const simSh = parseImportedExamText("فرض محروس رقم 1 الدورة الأولى - مستوى 1bac sh ثانوية الخوارزمي");
  assert.strictEqual(simSh.detectedTrackCode, "1BAC_LSH", "Should detect 1bac sh as 1BAC_LSH");

  const simLsh = parseImportedExamText("Contrôle Continu N°2 Semestre 1 - Classe 1BAC LSH Lycée Ibn Khaldoun");
  assert.strictEqual(simLsh.detectedTrackCode, "1BAC_LSH", "Should detect 1bac lsh as 1BAC_LSH");
});
