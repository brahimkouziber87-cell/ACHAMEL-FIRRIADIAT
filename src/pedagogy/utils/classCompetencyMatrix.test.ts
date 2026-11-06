import test from "node:test";
import assert from "node:assert/strict";
import {
  buildClassCompetencyMatrix,
  masteryLevelFromPct,
  masteryLevelLabelAr,
  matrixToCsv,
  MASTERY_THRESHOLDS,
  type CompetencyDefinition,
  type StudentCompetencyInput,
} from "./classCompetencyMatrix";

const COMPETENCIES: CompetencyDefinition[] = [
  { id: "c1", nameAr: "حل المعادلات", weight: 2 },
  { id: "c2", nameAr: "البرهان الهندسي" },
  { id: "c3", nameAr: "الدوال والتمثيل المبياني" },
];

const STUDENTS: StudentCompetencyInput[] = [
  { studentId: "s1", studentName: "أمين", scores: { c1: 90, c2: 80, c3: 70 } },
  { studentId: "s2", studentName: "سلمى", scores: { c1: 60, c2: 45, c3: 55 } },
  { studentId: "s3", studentName: "يوسف", scores: { c1: 30, c2: 20, c3: null } },
];

test("masteryLevelFromPct applies the ministerial thresholds", () => {
  assert.equal(masteryLevelFromPct(80), "MASTERED");
  assert.equal(masteryLevelFromPct(MASTERY_THRESHOLDS.mastered), "MASTERED");
  assert.equal(masteryLevelFromPct(60), "DEVELOPING");
  assert.equal(masteryLevelFromPct(49.9), "NOT_MASTERED");
  assert.equal(masteryLevelFromPct(null), null);
  assert.equal(masteryLevelLabelAr("MASTERED"), "متحكم");
  assert.equal(masteryLevelLabelAr(null), "غير مقيّم");
});

test("buildClassCompetencyMatrix produces per-student cells and weighted overall", () => {
  const matrix = buildClassCompetencyMatrix(COMPETENCIES, STUDENTS);
  assert.equal(matrix.rows.length, 3);
  assert.equal(matrix.rows[0].cells.c1.level, "MASTERED");
  assert.equal(matrix.rows[2].cells.c1.level, "NOT_MASTERED");
  assert.equal(matrix.rows[2].cells.c3.pct, null);
  assert.equal(matrix.rows[2].cells.c3.level, null);

  // (90*2 + 80 + 70) / 4 = 82.5
  assert.equal(matrix.rows[0].overallPct, 82.5);
  assert.equal(matrix.rows[0].masteredCount, 2);
  assert.equal(matrix.rows[2].weakCount, 2);
});

test("class-level summary ranks weak competencies by priority", () => {
  const matrix = buildClassCompetencyMatrix(COMPETENCIES, STUDENTS);
  assert.equal(matrix.columns.length, 3);

  const geometry = matrix.columns.find((column) => column.competencyId === "c2");
  assert.ok(geometry);
  assert.equal(geometry?.classPct, 48.33);
  assert.equal(geometry?.level, "NOT_MASTERED");
  assert.equal(geometry?.atRiskCount, 2);

  assert.equal(matrix.priorityCompetencies[0], "c2");
  assert.ok(matrix.recommendedActionsAr.some((action) => action.includes("البرهان الهندسي")));
  assert.deepEqual(matrix.atRiskStudents, ["s3"]);
});

test("missing scores are ignored instead of counted as zero", () => {
  const matrix = buildClassCompetencyMatrix(COMPETENCIES, [
    { studentId: "s1", studentName: "تلميذ", scores: { c1: 80, c2: null, c3: undefined } },
  ]);
  assert.equal(matrix.rows[0].overallPct, 80);
  assert.equal(matrix.rows[0].masteredCount, 1);
  assert.equal(matrix.columns.find((column) => column.competencyId === "c2")?.classPct, null);
});

test("empty input is handled without throwing", () => {
  const matrix = buildClassCompetencyMatrix([], []);
  assert.equal(matrix.rows.length, 0);
  assert.equal(matrix.globalPct, null);
  assert.ok(matrix.recommendedActionsAr.length > 0);
});

test("matrixToCsv exports a BOM-prefixed, escaped table", () => {
  const matrix = buildClassCompetencyMatrix(COMPETENCIES, [
    { studentId: "s1", studentName: 'تلميذ, "متميز"', scores: { c1: 90, c2: 70, c3: 50 } },
  ]);
  const csv = matrixToCsv(matrix);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes("التلميذ"));
  assert.ok(csv.includes('"تلميذ, ""متميز"""'));
  assert.equal(csv.split("\r\n").length, 2);
});
