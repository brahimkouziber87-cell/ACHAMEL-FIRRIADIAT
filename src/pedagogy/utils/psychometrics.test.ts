import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeExamPsychometrics,
  classifyItemQuality,
  computeDifficultyIndex,
  computeDiscriminationIndex,
  computeDistractorAnalysis,
  computeKR20,
  difficultyLabelAr,
  reliabilityLabelAr,
  type ExamItemRef,
  type StudentAnswerSheet,
} from "./psychometrics";

const ITEMS: ExamItemRef[] = [
  { id: "q1", correctOption: 0, optionCount: 4, competencyId: "c1" },
  { id: "q2", correctOption: 1, optionCount: 4, competencyId: "c1" },
  { id: "q3", correctOption: 2, optionCount: 4, competencyId: "c2" },
  { id: "q4", correctOption: 3, optionCount: 4, competencyId: "c2" },
];

function buildSheets(pattern: number[][]): StudentAnswerSheet[] {
  return pattern.map((answers, index) => ({
    studentId: `s${index + 1}`,
    answers: {
      q1: answers[0],
      q2: answers[1],
      q3: answers[2],
      q4: answers[3],
    },
  }));
}

test("computeDifficultyIndex clamps to [0,1] and handles invalid input", () => {
  assert.equal(computeDifficultyIndex(5, 10), 0.5);
  assert.equal(computeDifficultyIndex(12, 10), 1);
  assert.equal(computeDifficultyIndex(-3, 10), 0);
  assert.equal(computeDifficultyIndex(3, 0), 0);
});

test("computeDiscriminationIndex follows the upper/lower group formula", () => {
  assert.equal(computeDiscriminationIndex(8, 2, 10), 0.6);
  assert.equal(computeDiscriminationIndex(2, 8, 10), -0.6);
  assert.equal(computeDiscriminationIndex(5, 5, 0), null);
});

test("computeKR20 returns a bounded reliability coefficient", () => {
  const kr20 = computeKR20([8, 6, 4, 9], [3, 2, 1, 4, 3, 2, 4, 1, 3, 2]);
  assert.ok(kr20 !== null && kr20 >= 0 && kr20 <= 1);

  assert.equal(computeKR20([5], [1, 2, 3]), null);
  assert.equal(computeKR20([5, 5], [2, 2]), null);
});

test("quality classification rejects negative discrimination and extreme difficulty", () => {
  assert.equal(classifyItemQuality(0.5, -0.1).quality, "REJECT");
  assert.equal(classifyItemQuality(0.05, 0.5).quality, "REJECT");
  assert.equal(classifyItemQuality(0.5, 0.45).quality, "EXCELLENT");
  assert.equal(classifyItemQuality(0.5, 0.25).quality, "ACCEPTABLE");
  assert.equal(classifyItemQuality(0.5, 0.1).quality, "REVIEW");
});

test("difficulty and reliability labels are meaningful in Arabic", () => {
  assert.equal(difficultyLabelAr(0.1), "صعب جداً");
  assert.equal(difficultyLabelAr(0.5), "مناسب");
  assert.equal(difficultyLabelAr(0.95), "سهل جداً");
  assert.equal(reliabilityLabelAr(0.85), "ثبات جيد");
  assert.equal(reliabilityLabelAr(null), "غير متاح");
});

test("distractor analysis counts choices and flags non-working distractors", () => {
  const sheets = buildSheets([
    [0, 1, 2, 3],
    [1, 1, 2, 3],
    [2, 1, 2, 3],
    [3, 1, 2, 3],
  ]);
  const stats = computeDistractorAnalysis(ITEMS[0], sheets);
  assert.equal(stats.length, 4);
  assert.equal(stats[0].isCorrect, true);
  assert.equal(stats[0].chosenCount, 1);
  assert.equal(stats[1].worksAsDistractor, true);
  assert.equal(stats[0].worksAsDistractor, false);
});

test("analyzeExamPsychometrics produces a complete report with flags and recommendations", () => {
  const sheets = buildSheets([
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 0, 2, 3],
    [1, 0, 2, 3],
    [2, 3, 0, 1],
    [3, 2, 1, 0],
    [3, 2, 0, 1],
  ]);

  const report = analyzeExamPsychometrics(ITEMS, sheets);
  assert.equal(report.itemCount, 4);
  assert.equal(report.studentCount, 8);
  assert.equal(report.items.length, 4);
  assert.ok(report.meanScore >= 0 && report.meanScore <= 4);
  assert.ok(report.stdDev >= 0);
  assert.ok(report.kr20 === null || (report.kr20 >= 0 && report.kr20 <= 1));
  assert.ok(report.recommendationsAr.length > 0);
  assert.ok(report.items.every((item) => item.sampleSize === 8));
  assert.ok(report.items.every((item) => item.distractors.length === 4));
});

test("analyzeExamPsychometrics handles empty data safely", () => {
  const report = analyzeExamPsychometrics(ITEMS, []);
  assert.equal(report.itemCount, 4);
  assert.equal(report.studentCount, 0);
  assert.equal(report.items.length, 0);
  assert.equal(report.kr20, null);
  assert.ok(report.globalFlagsAr.length > 0);
});
