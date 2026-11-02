import test from "node:test";
import assert from "node:assert/strict";
import { COMPETENCY_QUESTION_BANK } from "../data/competencyQuestionBank";
import { OFFICIAL_DIDACTIC_CONSIGNES } from "../data/didacticConsignes";

test("Competency Question Bank is fully structured with Bloom taxonomy and KaTeX", () => {
  assert.ok(COMPETENCY_QUESTION_BANK.length >= 6, "Expected at least 6 competency items");

  for (const item of COMPETENCY_QUESTION_BANK) {
    assert.ok(item.code.length > 0, `Item ${item.id} missing code`);
    assert.ok(["N1", "N2", "N3"].includes(item.bloomLevel), `Item ${item.code} invalid bloom level`);
    assert.ok(item.statementAr.length > 0, `Item ${item.code} missing statementAr`);
    assert.ok(item.statementFr.length > 0, `Item ${item.code} missing statementFr`);
    assert.ok(item.points > 0, `Item ${item.code} points must be positive`);
    assert.ok(item.hints.hint1Ar.length > 0, `Item ${item.code} missing hint1Ar`);
    assert.ok(item.solutionAr.length > 0, `Item ${item.code} missing solutionAr`);
    assert.ok(item.didacticObstacleAr.length > 0, `Item ${item.code} missing didactic obstacle`);
  }
});

test("Official Didactic Consignes include all mandatory ministerial exam instructions", () => {
  assert.ok(OFFICIAL_DIDACTIC_CONSIGNES.length >= 6, "Expected at least 6 consignes");
  const keys = OFFICIAL_DIDACTIC_CONSIGNES.map((c) => c.key);
  assert.ok(keys.includes("CALC_ALLOWED"), "Missing CALC_ALLOWED");
  assert.ok(keys.includes("BLANCO_FORBIDDEN"), "Missing BLANCO_FORBIDDEN");
  assert.ok(keys.includes("CARE_REDACTION"), "Missing CARE_REDACTION");
  assert.ok(keys.includes("JUSTIFY_STEPS"), "Missing JUSTIFY_STEPS");
});
