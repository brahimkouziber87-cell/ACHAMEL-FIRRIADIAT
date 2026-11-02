import test from "node:test";
import assert from "node:assert/strict";
import {
  createExcellenceTicketData,
  buildPrintedHeaderExerciseIconsStripHtml,
  DEFAULT_EXERCISE_SVG_PRESETS,
} from "./pedagogicalRewardsAndSvg";

test("createExcellenceTicketData generates deterministic serial and populates defaults", () => {
  const ticket = createExcellenceTicketData({
    studentId: "s1",
    studentName: "ياسين العلمي",
    className: "2BAC-SM-A",
    average: 17.5,
    issueDate: "2026-11-02",
  });

  assert.equal(ticket.studentName, "ياسين العلمي");
  assert.equal(ticket.className, "2BAC-SM-A");
  assert.equal(ticket.averageText, "17.50 / 20");
  assert.ok(ticket.ticketSerial.startsWith("EX-2026-"));
  assert.ok(ticket.rewardCategory.length > 5);
});

test("buildPrintedHeaderExerciseIconsStripHtml renders per-exercise custom SVG badges for printed header", () => {
  const html = buildPrintedHeaderExerciseIconsStripHtml([
    {
      id: "ex1",
      exerciseNumber: 1,
      title: "المتتاليات العددية",
      points: 7,
      presetId: "sequences_sigma",
      svg: DEFAULT_EXERCISE_SVG_PRESETS.sequences_sigma.svg,
    },
    {
      id: "ex2",
      exerciseNumber: 2,
      title: "الهندسة الفضائية",
      points: 6,
      presetId: "geometry_3d",
      svg: DEFAULT_EXERCISE_SVG_PRESETS.geometry_3d.svg,
    },
  ]);

  assert.ok(html.includes('id="wbPrintedHeaderExercisesStrip"'));
  assert.ok(html.includes("التمرين 1 (7 ن)"));
  assert.ok(html.includes("المتتاليات العددية"));
  assert.ok(html.includes("التمرين 2 (6 ن)"));
  assert.ok(html.includes("الهندسة الفضائية"));
  assert.ok(html.includes("data:image/svg+xml;utf8,"));
});
