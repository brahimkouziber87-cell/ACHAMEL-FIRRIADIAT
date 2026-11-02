import { LessonItem, getVariantQuestions } from "../data/curriculum";
import { DEFAULT_MOROCCAN_CLASS_ROSTER } from "./evaluationGridExporter";

export type SkillAcquisitionLevel = "ACQUIRED" | "IN_PROGRESS" | "NOT_ACQUIRED";

export interface SkillAcquisitionMeta {
  level: SkillAcquisitionLevel;
  labelAr: string;
  labelFr: string;
  shortAr: string;
  shortFr: string;
  numericScore: number; // 1.0 = ACQUIRED, 0.5 = IN_PROGRESS, 0.0 = NOT_ACQUIRED
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeColorHex: string;
}

export const SKILL_ACQUISITION_META: Record<
  SkillAcquisitionLevel,
  SkillAcquisitionMeta
> = {
  ACQUIRED: {
    level: "ACQUIRED",
    labelAr: "مكتسبة",
    labelFr: "Acquise (A)",
    shortAr: "مكتسبة ✓",
    shortFr: "A",
    numericScore: 1.0,
    bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-300 dark:border-emerald-700",
    badgeColorHex: "#059669",
  },
  IN_PROGRESS: {
    level: "IN_PROGRESS",
    labelAr: "في طور الاكتساب",
    labelFr: "En cours d'acquisition (ECA)",
    shortAr: "في طور الاكتساب ≈",
    shortFr: "ECA",
    numericScore: 0.5,
    bgClass: "bg-amber-50 dark:bg-amber-950/50",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-300 dark:border-amber-700",
    badgeColorHex: "#d97706",
  },
  NOT_ACQUIRED: {
    level: "NOT_ACQUIRED",
    labelAr: "غير مكتسبة",
    labelFr: "Non acquise (NA)",
    shortAr: "غير مكتسبة ✗",
    shortFr: "NA",
    numericScore: 0.0,
    bgClass: "bg-rose-50 dark:bg-rose-950/50",
    textClass: "text-rose-700 dark:text-rose-300",
    borderClass: "border-rose-300 dark:border-rose-700",
    badgeColorHex: "#e11d48",
  },
};

export interface StudentLessonSkillRecord {
  n1Status: SkillAcquisitionLevel;
  n2Status: SkillAcquisitionLevel;
  n3Status: SkillAcquisitionLevel;
  previousScoreOn20?: number;
}

export interface StudentSpecMatrixEvaluation {
  studentId: string;
  cne: string;
  fullNameAr: string;
  fullNameFr: string;
  previousExamGrade20: number;
  lessonRecords: Record<string, StudentLessonSkillRecord>;
  inspectorObservation: string;
}

export interface SuggestedRemedialExercise {
  id: string;
  lessonFr: string;
  lessonAr: string;
  level: "N1" | "N2";
  points: number;
  questionAr: string;
  questionFr: string;
  pedagogicalGoalAr: string;
  pedagogicalGoalFr: string;
}

export interface AdaptiveLessonWeightRecommendation {
  lessonFr: string;
  lessonAr: string;
  previousWeight: number;
  recommendedWeight: number;
  weightDelta: number;
  n1MasteryPct: number;
  n2MasteryPct: number;
  n3MasteryPct: number;
  n1NotAcquiredCount: number;
  n2NotAcquiredCount: number;
  overallMasteryPct: number;
  n1n2DeficitScore: number; // 0 to 100 (higher means greater deficit in N1/N2)
  priorityLevel: "CRITICAL_REMEDIATION" | "MODERATE_SUPPORT" | "CONSOLIDATION";
  priorityLabelAr: string;
  priorityLabelFr: string;
  suggestedExercises: SuggestedRemedialExercise[];
}

export interface AdaptiveSpecMatrixUpdateResult {
  recommendations: AdaptiveLessonWeightRecommendation[];
  updatedWeightsMap: Record<string, number>; // keyed by `${trackCode}_${lessonFr}`
  rawLessonWeightsMap: Record<string, number>; // keyed by `lessonFr`
  recommendedRatios: {
    n1: number;
    n2: number;
    n3: number;
  };
  globalMasteryIndex: number;
  globalN1MasteryPct: number;
  globalN2MasteryPct: number;
  globalN3MasteryPct: number;
  studentsNeedingSupportCount: number;
  totalStudentsCount: number;
  inspectorDiagnosticSummaryAr: string;
  inspectorDiagnosticSummaryFr: string;
}

const STORAGE_KEY_PREFIX = "spec_matrix_2d_skill_eval_v1_";
const MAX_STORED_SCOPES = 15;

function getStorageKey(trackCode: string, dsKey: string): string {
  return `${STORAGE_KEY_PREFIX}${trackCode || "DEFAULT"}_${dsKey || "DS1"}`;
}

/**
 * Generates deterministic initial realistic skill evaluation records per student
 * across all active lessons in the 2D Specification Matrix.
 */
export function createDefaultStudentSkillEvaluations(
  lessons: LessonItem[],
  presetMode: "REALISTIC_MIXED" | "WEAK_N1_N2" | "HIGH_MASTERY" = "REALISTIC_MIXED"
): StudentSpecMatrixEvaluation[] {
  const safeLessons = lessons.length > 0 ? lessons : [];

  return DEFAULT_MOROCCAN_CLASS_ROSTER.map((rosterItem, studentIdx) => {
    const lessonRecords: Record<string, StudentLessonSkillRecord> = {};
    let totalScoreAccumulator = 0;

    safeLessons.forEach((lesson, lessonIdx) => {
      const seed = (studentIdx * 7 + lessonIdx * 13) % 10;

      let n1Status: SkillAcquisitionLevel = "ACQUIRED";
      let n2Status: SkillAcquisitionLevel = "IN_PROGRESS";
      let n3Status: SkillAcquisitionLevel = "IN_PROGRESS";

      if (presetMode === "WEAK_N1_N2") {
        // Simulate noticeable deficit on early/core lessons in N1 and N2
        if (lessonIdx % 2 === 0) {
          n1Status = seed < 5 ? "NOT_ACQUIRED" : seed < 8 ? "IN_PROGRESS" : "ACQUIRED";
          n2Status = seed < 6 ? "NOT_ACQUIRED" : "IN_PROGRESS";
          n3Status = "NOT_ACQUIRED";
        } else {
          n1Status = seed < 3 ? "NOT_ACQUIRED" : seed < 7 ? "IN_PROGRESS" : "ACQUIRED";
          n2Status = seed < 4 ? "NOT_ACQUIRED" : seed < 8 ? "IN_PROGRESS" : "ACQUIRED";
          n3Status = seed < 7 ? "NOT_ACQUIRED" : "IN_PROGRESS";
        }
      } else if (presetMode === "HIGH_MASTERY") {
        n1Status = seed < 8 ? "ACQUIRED" : "IN_PROGRESS";
        n2Status = seed < 7 ? "ACQUIRED" : "IN_PROGRESS";
        n3Status = seed < 5 ? "ACQUIRED" : seed < 8 ? "IN_PROGRESS" : "NOT_ACQUIRED";
      } else {
        // REALISTIC_MIXED: varied mastery across lessons so adaptive weights have meaningful differentiation
        if (lessonIdx === 0) {
          // Lesson 1: weaker N1/N2 mastery (triggers remediation suggestion)
          n1Status = seed < 4 ? "NOT_ACQUIRED" : seed < 8 ? "IN_PROGRESS" : "ACQUIRED";
          n2Status = seed < 5 ? "NOT_ACQUIRED" : seed < 9 ? "IN_PROGRESS" : "ACQUIRED";
          n3Status = seed < 7 ? "NOT_ACQUIRED" : "IN_PROGRESS";
        } else if (lessonIdx === 1) {
          // Lesson 2: moderate N2 difficulty
          n1Status = seed < 2 ? "NOT_ACQUIRED" : seed < 5 ? "IN_PROGRESS" : "ACQUIRED";
          n2Status = seed < 4 ? "NOT_ACQUIRED" : seed < 8 ? "IN_PROGRESS" : "ACQUIRED";
          n3Status = seed < 5 ? "NOT_ACQUIRED" : seed < 8 ? "IN_PROGRESS" : "ACQUIRED";
        } else {
          // Other lessons: higher acquisition
          n1Status = seed < 1 ? "NOT_ACQUIRED" : seed < 3 ? "IN_PROGRESS" : "ACQUIRED";
          n2Status = seed < 2 ? "NOT_ACQUIRED" : seed < 5 ? "IN_PROGRESS" : "ACQUIRED";
          n3Status = seed < 3 ? "NOT_ACQUIRED" : seed < 7 ? "IN_PROGRESS" : "ACQUIRED";
        }
      }

      const lessonNumeric =
        SKILL_ACQUISITION_META[n1Status].numericScore * 0.45 +
        SKILL_ACQUISITION_META[n2Status].numericScore * 0.35 +
        SKILL_ACQUISITION_META[n3Status].numericScore * 0.2;
      const previousScoreOn20 = Number((lessonNumeric * 20).toFixed(1));
      totalScoreAccumulator += previousScoreOn20;

      lessonRecords[lesson.lessonFr] = {
        n1Status,
        n2Status,
        n3Status,
        previousScoreOn20,
      };
    });

    const avgGrade =
      safeLessons.length > 0
        ? Number((totalScoreAccumulator / safeLessons.length).toFixed(2))
        : 12.0;

    const observation =
      avgGrade >= 14
        ? "تحكم جيد في الكفايات الأساسية والتوليفية"
        : avgGrade >= 10
        ? "مكتسبات متوسطة تحتاج تثبيت مهارات التطبيق المباشر N1/N2"
        : "تعثر ملحوظ في المهارات القاعدية N1/N2 يستوجب دعماً بيداغوجياً عاجلاً";

    return {
      studentId: `ST_${studentIdx + 1}_${rosterItem.massarCode}`,
      cne: rosterItem.massarCode,
      fullNameAr: rosterItem.fullNameAr,
      fullNameFr: rosterItem.fullNameFr,
      previousExamGrade20: avgGrade,
      lessonRecords,
      inspectorObservation: observation,
    };
  });
}

/**
 * Ensures every current lesson has a valid record in each student's evaluation object.
 */
export function normalizeStudentEvaluationsForLessons(
  students: StudentSpecMatrixEvaluation[],
  lessons: LessonItem[]
): StudentSpecMatrixEvaluation[] {
  return students.map((student, sIdx) => {
    const nextRecords: Record<string, StudentLessonSkillRecord> = {
      ...student.lessonRecords,
    };
    let gradeSum = 0;

    lessons.forEach((lesson, lIdx) => {
      if (!nextRecords[lesson.lessonFr]) {
        const seed = (sIdx * 5 + lIdx * 11) % 10;
        const n1Status: SkillAcquisitionLevel =
          seed < 3 ? "NOT_ACQUIRED" : seed < 6 ? "IN_PROGRESS" : "ACQUIRED";
        const n2Status: SkillAcquisitionLevel =
          seed < 4 ? "NOT_ACQUIRED" : seed < 7 ? "IN_PROGRESS" : "ACQUIRED";
        const n3Status: SkillAcquisitionLevel =
          seed < 5 ? "NOT_ACQUIRED" : seed < 8 ? "IN_PROGRESS" : "ACQUIRED";
        nextRecords[lesson.lessonFr] = {
          n1Status,
          n2Status,
          n3Status,
          previousScoreOn20: 11.5,
        };
      }
      const rec = nextRecords[lesson.lessonFr];
      const computedScore =
        (SKILL_ACQUISITION_META[rec.n1Status].numericScore * 0.45 +
          SKILL_ACQUISITION_META[rec.n2Status].numericScore * 0.35 +
          SKILL_ACQUISITION_META[rec.n3Status].numericScore * 0.2) *
        20;
      gradeSum += computedScore;
    });

    const recalculatedGrade =
      lessons.length > 0
        ? Number((gradeSum / lessons.length).toFixed(2))
        : student.previousExamGrade20;

    return {
      ...student,
      previousExamGrade20: recalculatedGrade,
      lessonRecords: nextRecords,
    };
  });
}

export function loadOrInitializeStudentSkillAssessments(
  trackCode: string,
  dsKey: string,
  lessons: LessonItem[]
): StudentSpecMatrixEvaluation[] {
  if (typeof window === "undefined") {
    return createDefaultStudentSkillEvaluations(lessons, "REALISTIC_MIXED");
  }
  try {
    const key = getStorageKey(trackCode, dsKey);
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as StudentSpecMatrixEvaluation[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeStudentEvaluationsForLessons(parsed, lessons);
      }
    }
  } catch {
    // Ignore storage read errors and fall back to default
  }
  return createDefaultStudentSkillEvaluations(lessons, "REALISTIC_MIXED");
}

export function saveStudentSkillAssessments(
  trackCode: string,
  dsKey: string,
  students: StudentSpecMatrixEvaluation[]
): void {
  if (typeof window === "undefined") return;
  try {
    // Bound number of stored scopes in localStorage to prevent memory bloat
    const existingKeys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(STORAGE_KEY_PREFIX)) {
        existingKeys.push(k);
      }
    }
    if (existingKeys.length >= MAX_STORED_SCOPES) {
      window.localStorage.removeItem(existingKeys[0]);
    }

    const key = getStorageKey(trackCode, dsKey);
    window.localStorage.setItem(key, JSON.stringify(students));
  } catch {
    // Ignore quota errors gracefully
  }
}

export function cycleSkillAcquisitionLevel(
  current: SkillAcquisitionLevel
): SkillAcquisitionLevel {
  if (current === "ACQUIRED") return "IN_PROGRESS";
  if (current === "IN_PROGRESS") return "NOT_ACQUIRED";
  return "ACQUIRED";
}

/**
 * Generates curriculum-aware N1 and N2 remedial exercises for a lesson
 * based on its mathematical domain and existing curriculum questions.
 */
function buildSuggestedExercisesForLesson(
  lesson: LessonItem,
  n1MasteryPct: number,
  n2MasteryPct: number
): SuggestedRemedialExercise[] {
  const suggestions: SuggestedRemedialExercise[] = [];
  const variantQs = getVariantQuestions(lesson, "A", false, 0, "STANDARD");
  const qsAr =
    lesson.sampleExerciseAr && lesson.sampleExerciseAr.length > 0
      ? lesson.sampleExerciseAr
      : variantQs.questionsAr;
  const qsFr =
    lesson.sampleExerciseFr && lesson.sampleExerciseFr.length > 0
      ? lesson.sampleExerciseFr
      : variantQs.questionsFr;

  const sampleAr0 =
    qsAr && qsAr.length > 0
      ? qsAr[0]
      : `تطبيق مباشر للقواعد والخاصيات الأساسية في درس «${lesson.lessonAr}».`;
  const sampleFr0 =
    qsFr && qsFr.length > 0
      ? qsFr[0]
      : `Application directe des définitions et propriétés fondamentales du chapitre « ${lesson.lessonFr} ».`;

  const sampleAr1 =
    qsAr && qsAr.length > 1
      ? qsAr[1]
      : `حل وضعية مرحلية موجهة توظف تقنيات الحساب والاستدلال المباشر في «${lesson.lessonAr}».`;
  const sampleFr1 =
    qsFr && qsFr.length > 1
      ? qsFr[1]
      : `Résoudre une question intermédiaire guidée mobilisant les méthodes standards de « ${lesson.lessonFr} ».`;

  // Always suggest an N1 exercise if N1 mastery < 75%, or as foundational reinforcement
  if (n1MasteryPct < 75 || suggestions.length === 0) {
    suggestions.push({
      id: `${lesson.lessonFr}_REMEDIAL_N1`,
      lessonFr: lesson.lessonFr,
      lessonAr: lesson.lessonAr,
      level: "N1",
      points: n1MasteryPct < 50 ? 2.0 : 1.5,
      questionAr: `[دعم المكتسبات القاعدية N1 - ${lesson.lessonAr}] ${sampleAr0}`,
      questionFr: `[Consolidation fondamentale N1 - ${lesson.lessonFr}] ${sampleFr0}`,
      pedagogicalGoalAr: `معالجة تعثرات الاسترجاع والتطبيق المباشر (${Math.round(
        100 - n1MasteryPct
      )}% نسبة عدم التمكن في N1).`,
      pedagogicalGoalFr: `Remédier aux lacunes d'application directe (${Math.round(
        100 - n1MasteryPct
      )}% de déficit en N1).`,
    });
  }

  // Suggest an N2 exercise if N2 mastery < 80%
  if (n2MasteryPct < 80 || suggestions.length < 2) {
    suggestions.push({
      id: `${lesson.lessonFr}_REMEDIAL_N2`,
      lessonFr: lesson.lessonFr,
      lessonAr: lesson.lessonAr,
      level: "N2",
      points: n2MasteryPct < 55 ? 2.5 : 2.0,
      questionAr: `[تمرين داعم للاستدلال المرحلي N2 - ${lesson.lessonAr}] ${sampleAr1}`,
      questionFr: `[Exercice de renforcement méthodologique N2 - ${lesson.lessonFr}] ${sampleFr1}`,
      pedagogicalGoalAr: `تثبيت مهارات التطبيق في وضعيات مألوفة (${Math.round(
        100 - n2MasteryPct
      )}% نسبة عدم التمكن في N2).`,
      pedagogicalGoalFr: `Consolider le raisonnement intermédiaire (${Math.round(
        100 - n2MasteryPct
      )}% de déficit en N2).`,
    });
  }

  return suggestions;
}

/**
 * Automatic function that updates 2D Specification Matrix weights (`أوزان مصفوفة التخصيص 2D`)
 * based on previous guarded exam results (`نتائج الفرض المحروس السابقة`), boosting weights
 * and suggesting targeted N1/N2 exercises for lessons with the lowest skill acquisition.
 */
export function computeAdaptive2DSpecMatrixWeights(
  lessons: LessonItem[],
  students: StudentSpecMatrixEvaluation[],
  trackCode: string,
  currentN1 = 30,
  currentN2 = 50,
  currentN3 = 20
): AdaptiveSpecMatrixUpdateResult {
  if (!lessons || lessons.length === 0) {
    return {
      recommendations: [],
      updatedWeightsMap: {},
      rawLessonWeightsMap: {},
      recommendedRatios: { n1: currentN1, n2: currentN2, n3: currentN3 },
      globalMasteryIndex: 0,
      globalN1MasteryPct: 0,
      globalN2MasteryPct: 0,
      globalN3MasteryPct: 0,
      studentsNeedingSupportCount: 0,
      totalStudentsCount: students.length,
      inspectorDiagnosticSummaryAr: "لا توجد دروس محددة في الفرض الحالي.",
      inspectorDiagnosticSummaryFr: "Aucune leçon sélectionnée dans le devoir actuel.",
    };
  }

  const safeStudents =
    students && students.length > 0
      ? normalizeStudentEvaluationsForLessons(students, lessons)
      : createDefaultStudentSkillEvaluations(lessons, "REALISTIC_MIXED");

  const studentCount = Math.max(1, safeStudents.length);

  // Normalize initial lesson weights so they sum to 100
  const rawInitialSum =
    lessons.reduce((acc, l) => acc + (Number(l.weight) || 0), 0) || 100;

  let globalN1Sum = 0;
  let globalN2Sum = 0;
  let globalN3Sum = 0;

  const interimStats = lessons.map((lesson) => {
    const baseWeight = Math.round(((Number(lesson.weight) || 0) / rawInitialSum) * 100);

    let n1ScoreSum = 0;
    let n2ScoreSum = 0;
    let n3ScoreSum = 0;
    let n1NotAcquiredCount = 0;
    let n2NotAcquiredCount = 0;

    safeStudents.forEach((student) => {
      const rec = student.lessonRecords[lesson.lessonFr];
      const n1 = rec ? rec.n1Status : "IN_PROGRESS";
      const n2 = rec ? rec.n2Status : "IN_PROGRESS";
      const n3 = rec ? rec.n3Status : "IN_PROGRESS";

      n1ScoreSum += SKILL_ACQUISITION_META[n1].numericScore;
      n2ScoreSum += SKILL_ACQUISITION_META[n2].numericScore;
      n3ScoreSum += SKILL_ACQUISITION_META[n3].numericScore;

      if (n1 === "NOT_ACQUIRED") n1NotAcquiredCount += 1;
      if (n2 === "NOT_ACQUIRED") n2NotAcquiredCount += 1;
    });

    const n1MasteryPct = Number(((n1ScoreSum / studentCount) * 100).toFixed(1));
    const n2MasteryPct = Number(((n2ScoreSum / studentCount) * 100).toFixed(1));
    const n3MasteryPct = Number(((n3ScoreSum / studentCount) * 100).toFixed(1));

    globalN1Sum += n1MasteryPct;
    globalN2Sum += n2MasteryPct;
    globalN3Sum += n3MasteryPct;

    const overallMasteryPct = Number(
      (n1MasteryPct * 0.45 + n2MasteryPct * 0.35 + n3MasteryPct * 0.2).toFixed(1)
    );

    // Deficit score heavily weights N1 (55%) and N2 (45%) acquisition gaps as requested
    const n1Deficit = Math.max(0, 100 - n1MasteryPct);
    const n2Deficit = Math.max(0, 100 - n2MasteryPct);
    const n1n2DeficitScore = Number((n1Deficit * 0.55 + n2Deficit * 0.45).toFixed(1));

    // Adaptive multiplier: lessons with higher N1/N2 deficit receive up to +65% boost in weight
    const boostFactor = 1 + (n1n2DeficitScore / 100) * 0.85;
    const unnormalizedTargetWeight = Math.max(5, baseWeight * boostFactor);

    return {
      lesson,
      baseWeight,
      n1MasteryPct,
      n2MasteryPct,
      n3MasteryPct,
      n1NotAcquiredCount,
      n2NotAcquiredCount,
      overallMasteryPct,
      n1n2DeficitScore,
      unnormalizedTargetWeight,
    };
  });

  const totalUnnormalized =
    interimStats.reduce((acc, item) => acc + item.unnormalizedTargetWeight, 0) || 100;

  // Compute integer weights summing exactly to 100%
  const roundedWeights = interimStats.map((item) =>
    Math.max(5, Math.round((item.unnormalizedTargetWeight / totalUnnormalized) * 100))
  );
  const weightSumDiff = 100 - roundedWeights.reduce((a, b) => a + b, 0);
  if (roundedWeights.length > 0 && weightSumDiff !== 0) {
    // Adjust the lesson with highest N1/N2 deficit so total is strictly 100%
    let maxDeficitIdx = 0;
    interimStats.forEach((item, idx) => {
      if (item.n1n2DeficitScore > interimStats[maxDeficitIdx].n1n2DeficitScore) {
        maxDeficitIdx = idx;
      }
    });
    roundedWeights[maxDeficitIdx] = Math.max(
      5,
      roundedWeights[maxDeficitIdx] + weightSumDiff
    );
  }

  const updatedWeightsMap: Record<string, number> = {};
  const rawLessonWeightsMap: Record<string, number> = {};

  const recommendations: AdaptiveLessonWeightRecommendation[] = interimStats.map(
    (item, idx) => {
      const recommendedWeight = roundedWeights[idx];
      const weightDelta = recommendedWeight - item.baseWeight;

      updatedWeightsMap[`${trackCode}_${item.lesson.lessonFr}`] = recommendedWeight;
      rawLessonWeightsMap[item.lesson.lessonFr] = recommendedWeight;

      let priorityLevel: AdaptiveLessonWeightRecommendation["priorityLevel"] =
        "CONSOLIDATION";
      let priorityLabelAr = "تثبيت وإغناء المكتسبات";
      let priorityLabelFr = "Consolidation des acquis";

      if (item.n1n2DeficitScore >= 45) {
        priorityLevel = "CRITICAL_REMEDIATION";
        priorityLabelAr = "أولوية قصوى للدعم (تعثر N1/N2)";
        priorityLabelFr = "Priorité critique (Déficit N1/N2)";
      } else if (item.n1n2DeficitScore >= 28) {
        priorityLevel = "MODERATE_SUPPORT";
        priorityLabelAr = "دعم مرحلي موجه (N1/N2)";
        priorityLabelFr = "Soutien ciblé (N1/N2)";
      }

      const suggestedExercises = buildSuggestedExercisesForLesson(
        item.lesson,
        item.n1MasteryPct,
        item.n2MasteryPct
      );

      return {
        lessonFr: item.lesson.lessonFr,
        lessonAr: item.lesson.lessonAr,
        previousWeight: item.baseWeight,
        recommendedWeight,
        weightDelta,
        n1MasteryPct: item.n1MasteryPct,
        n2MasteryPct: item.n2MasteryPct,
        n3MasteryPct: item.n3MasteryPct,
        n1NotAcquiredCount: item.n1NotAcquiredCount,
        n2NotAcquiredCount: item.n2NotAcquiredCount,
        overallMasteryPct: item.overallMasteryPct,
        n1n2DeficitScore: item.n1n2DeficitScore,
        priorityLevel,
        priorityLabelAr,
        priorityLabelFr,
        suggestedExercises,
      };
    }
  );

  const lessonCount = Math.max(1, lessons.length);
  const globalN1MasteryPct = Number((globalN1Sum / lessonCount).toFixed(1));
  const globalN2MasteryPct = Number((globalN2Sum / lessonCount).toFixed(1));
  const globalN3MasteryPct = Number((globalN3Sum / lessonCount).toFixed(1));
  const globalMasteryIndex = Number(
    (
      globalN1MasteryPct * 0.45 +
      globalN2MasteryPct * 0.35 +
      globalN3MasteryPct * 0.2
    ).toFixed(1)
  );

  // Also recalibrate global cognitive level ratios (N1/N2/N3) if N1 or N2 mastery is weak
  let recN1 = currentN1;
  let recN2 = currentN2;
  let recN3 = currentN3;

  if (globalN1MasteryPct < 55) {
    recN1 = 40;
    recN2 = 45;
    recN3 = 15;
  } else if (globalN2MasteryPct < 60) {
    recN1 = 35;
    recN2 = 50;
    recN3 = 15;
  } else if (globalMasteryIndex >= 75) {
    recN1 = 25;
    recN2 = 50;
    recN3 = 25;
  }

  const studentsNeedingSupportCount = safeStudents.filter(
    (s) => s.previousExamGrade20 < 10
  ).length;

  const criticalLessons = recommendations.filter(
    (r) => r.priorityLevel === "CRITICAL_REMEDIATION"
  );

  const inspectorDiagnosticSummaryAr =
    criticalLessons.length > 0
      ? `بناءً على تحليل نتائج الفرض المحروس السابق (${safeStudents.length} تلميذاً)، سُجل نقص في اكتساب المهارات الأساسية (N1: ${globalN1MasteryPct}%، N2: ${globalN2MasteryPct}%) خصوصاً في: ${criticalLessons
          .map((c) => `«${c.lessonAr}»`)
          .join("، ")}. تم رفع أوزان هذه الدروس تلقائياً واقتراح تمارين داعمة (N1/N2) للفرض القادم.`
      : `تُظهر نتائج الفرض السابق تحكماً متوازناً في المهارات القاعدية (N1: ${globalN1MasteryPct}%، N2: ${globalN2MasteryPct}%). تم تعديل أوزان المصفوفة بشكل طفيف لضمان تثبيت المكتسبات المستهدفة.`;

  const inspectorDiagnosticSummaryFr =
    criticalLessons.length > 0
      ? `Suite à l'analyse des résultats précédents (${safeStudents.length} élèves), un déficit d'acquisition N1 (${globalN1MasteryPct}%) / N2 (${globalN2MasteryPct}%) est observé sur : ${criticalLessons
          .map((c) => `« ${c.lessonFr} »`)
          .join(", ")}. Les pondérations 2D ont été automatiquement réajustées avec suggestion d'exercices de remédiation N1/N2.`
      : `Les résultats précédents montrent une maîtrise globale satisfaisante (N1: ${globalN1MasteryPct}%, N2: ${globalN2MasteryPct}%). Les pondérations de la matrice 2D ont été équilibrées pour consolider les acquis.`;

  return {
    recommendations,
    updatedWeightsMap,
    rawLessonWeightsMap,
    recommendedRatios: { n1: recN1, n2: recN2, n3: recN3 },
    globalMasteryIndex,
    globalN1MasteryPct,
    globalN2MasteryPct,
    globalN3MasteryPct,
    studentsNeedingSupportCount,
    totalStudentsCount: safeStudents.length,
    inspectorDiagnosticSummaryAr,
    inspectorDiagnosticSummaryFr,
  };
}

export interface IntegratedPedagogicalReportParams {
  trackNameAr: string;
  trackNameFr: string;
  dsTitleAr: string;
  dsTitleFr: string;
  school: string;
  prof: string;
  year: string;
  academy?: string;
  direction?: string;
  lessons: LessonItem[];
  students: StudentSpecMatrixEvaluation[];
  adaptiveResult: AdaptiveSpecMatrixUpdateResult;
}

/**
 * Exports a comprehensive standalone A4 HTML Integrated Pedagogical Report
 * (`تقرير بيداغوجي مدمج لتقييم المهارات المكتسبة ومصفوفة التخصيص 2D`)
 */
export function exportIntegratedPedagogicalReportHTML(
  params: IntegratedPedagogicalReportParams
): void {
  const {
    trackNameAr,
    trackNameFr,
    dsTitleAr,
    school,
    prof,
    year,
    academy = "الأكاديمية الجهوية للتربية والتكوين",
    direction = "المديرية الإقليمية",
    lessons,
    students,
    adaptiveResult,
  } = params;

  const lessonHeadersHtml = lessons
    .map(
      (l) => `
      <th colspan="3" style="border:1px solid #cbd5e1;padding:6px;background:#f1f5f9;font-size:11px;text-align:center;">
        <div><strong>${l.lessonAr}</strong></div>
        <div style="font-size:9px;color:#475569;direction:ltr;">${l.lessonFr}</div>
      </th>`
    )
    .join("");

  const lessonSubHeadersHtml = lessons
    .map(
      () => `
      <th style="border:1px solid #cbd5e1;padding:3px;background:#e0f2fe;font-size:9px;text-align:center;">N1</th>
      <th style="border:1px solid #cbd5e1;padding:3px;background:#fef3c7;font-size:9px;text-align:center;">N2</th>
      <th style="border:1px solid #cbd5e1;padding:3px;background:#f3e8ff;font-size:9px;text-align:center;">N3</th>`
    )
    .join("");

  const badgeHtml = (level: SkillAcquisitionLevel) => {
    const meta = SKILL_ACQUISITION_META[level];
    return `<span style="display:inline-block;padding:2px 5px;border-radius:4px;font-size:9px;font-weight:700;color:#fff;background:${meta.badgeColorHex};">${meta.labelAr}</span>`;
  };

  const studentRowsHtml = students
    .map((student, idx) => {
      const cells = lessons
        .map((l) => {
          const rec = student.lessonRecords[l.lessonFr] || {
            n1Status: "IN_PROGRESS",
            n2Status: "IN_PROGRESS",
            n3Status: "IN_PROGRESS",
          };
          return `
            <td style="border:1px solid #cbd5e1;padding:4px;text-align:center;">${badgeHtml(rec.n1Status)}</td>
            <td style="border:1px solid #cbd5e1;padding:4px;text-align:center;">${badgeHtml(rec.n2Status)}</td>
            <td style="border:1px solid #cbd5e1;padding:4px;text-align:center;">${badgeHtml(rec.n3Status)}</td>
          `;
        })
        .join("");

      return `
        <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
          <td style="border:1px solid #cbd5e1;padding:5px;text-align:center;font-weight:700;">${idx + 1}</td>
          <td style="border:1px solid #cbd5e1;padding:5px;font-family:monospace;text-align:center;font-size:10px;">${student.cne}</td>
          <td style="border:1px solid #cbd5e1;padding:5px;font-weight:700;">${student.fullNameAr}<div style="font-size:9px;color:#64748b;direction:ltr;">${student.fullNameFr}</div></td>
          <td style="border:1px solid #cbd5e1;padding:5px;text-align:center;font-weight:800;color:${
            student.previousExamGrade20 >= 10 ? "#047857" : "#be123c"
          };">${student.previousExamGrade20.toFixed(2)} / 20</td>
          ${cells}
          <td style="border:1px solid #cbd5e1;padding:5px;font-size:10px;color:#334155;">${student.inspectorObservation}</td>
        </tr>
      `;
    })
    .join("");

  const adaptiveRowsHtml = adaptiveResult.recommendations
    .map(
      (rec) => `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:6px;font-weight:700;">${rec.lessonAr} <span style="font-size:10px;color:#64748b;">(${rec.lessonFr})</span></td>
        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;">${rec.n1MasteryPct}%</td>
        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;">${rec.n2MasteryPct}%</td>
        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;">${rec.n3MasteryPct}%</td>
        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:700;">${rec.previousWeight}%</td>
        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:800;color:#1d4ed8;background:#eff6ff;">
          ${rec.recommendedWeight}% (${rec.weightDelta >= 0 ? `+${rec.weightDelta}%` : `${rec.weightDelta}%`})
        </td>
        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:700;">${rec.priorityLabelAr}</td>
        <td style="border:1px solid #cbd5e1;padding:6px;font-size:10px;">
          ${rec.suggestedExercises
            .map(
              (ex) =>
                `<div style="margin-bottom:3px;">• <strong>[${ex.level} - ${ex.points} ن]</strong>: ${ex.questionAr}</div>`
            )
            .join("")}
        </td>
      </tr>`
    )
    .join("");

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>تقرير بيداغوجي مدمج - مصفوفة التخصيص 2D وتقييم المهارات المكتسبة</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    body {
      font-family: 'Cairo', 'Amiri', 'Segoe UI', Tahoma, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 16px;
      font-size: 12px;
      line-height: 1.45;
    }
    .header-box {
      border: 2px solid #1e3a8a;
      border-radius: 8px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .kpi-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      background: #f8fafc;
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 14px;
      margin: 12px 0 6px 0;
      color: #1e3a8a;
      border-right: 4px solid #1e3a8a;
      padding-right: 8px;
    }
    .diagnostic-banner {
      border: 1px solid #93c5fd;
      background: #eff6ff;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 14px;
      font-size: 11.5px;
    }
    .sign-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 18px;
    }
    .sign-box {
      border: 1px dashed #94a3b8;
      border-radius: 6px;
      padding: 10px;
      min-height: 65px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <div style="font-weight:800;font-size:13px;color:#1e3a8a;">المملكة المغربية - وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
      <div style="font-size:11px;color:#334155;">${academy} | ${direction}</div>
      <div style="font-size:11px;color:#334155;">المؤسسة: <strong>${school}</strong> | الأستاذ(ة): <strong>${prof}</strong></div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:16px;font-weight:900;color:#0f172a;">تقرير بيداغوجي مدمج لتقييم المهارات المكتسبة ومصفوفة التخصيص 2D</div>
      <div style="font-size:11px;color:#475569;">${trackNameAr} (${trackNameFr}) — ${dsTitleAr}</div>
    </div>
    <div style="text-align:left;font-size:11px;color:#334155;">
      <div>السنة الدراسية: <strong>${year}</strong></div>
      <div>عدد التلاميذ: <strong>${students.length}</strong></div>
      <div>تاريخ الاستخراج: <strong>${new Date().toLocaleDateString("ar-MA")}</strong></div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div style="font-size:10px;color:#64748b;">المؤشر العام للتحكم</div>
      <div style="font-size:16px;font-weight:900;color:#1e3a8a;">${adaptiveResult.globalMasteryIndex}%</div>
    </div>
    <div class="kpi-card">
      <div style="font-size:10px;color:#64748b;">تحكم المهارات القاعدية N1</div>
      <div style="font-size:16px;font-weight:900;color:#0284c7;">${adaptiveResult.globalN1MasteryPct}%</div>
    </div>
    <div class="kpi-card">
      <div style="font-size:10px;color:#64748b;">تحكم المهارات المرحلية N2</div>
      <div style="font-size:16px;font-weight:900;color:#d97706;">${adaptiveResult.globalN2MasteryPct}%</div>
    </div>
    <div class="kpi-card">
      <div style="font-size:10px;color:#64748b;">تحكم مهارات التوليف N3</div>
      <div style="font-size:16px;font-weight:900;color:#7c3aed;">${adaptiveResult.globalN3MasteryPct}%</div>
    </div>
    <div class="kpi-card">
      <div style="font-size:10px;color:#64748b;">تلاميذ في وضعية دعم عاجل</div>
      <div style="font-size:16px;font-weight:900;color:#e11d48;">${adaptiveResult.studentsNeedingSupportCount} / ${adaptiveResult.totalStudentsCount}</div>
    </div>
  </div>

  <div class="diagnostic-banner">
    <strong>خلاصة التشخيص البيداغوجي للمفتش التربوي:</strong> ${adaptiveResult.inspectorDiagnosticSummaryAr}
    <div style="direction:ltr;font-size:10.5px;color:#334155;margin-top:4px;">${adaptiveResult.inspectorDiagnosticSummaryFr}</div>
  </div>

  <h2>أولاً: التحيين التلقائي لأوزان مصفوفة التخصيص 2D والتمارين الداعمة المقترحة (N1/N2)</h2>
  <table>
    <thead>
      <tr style="background:#e2e8f0;font-size:11px;">
        <th style="border:1px solid #cbd5e1;padding:6px;">الدرس / الفصل</th>
        <th style="border:1px solid #cbd5e1;padding:6px;">تحكم N1</th>
        <th style="border:1px solid #cbd5e1;padding:6px;">تحكم N2</th>
        <th style="border:1px solid #cbd5e1;padding:6px;">تحكم N3</th>
        <th style="border:1px solid #cbd5e1;padding:6px;">الوزن السابق</th>
        <th style="border:1px solid #cbd5e1;padding:6px;">الوزن المحيّن تلقائياً</th>
        <th style="border:1px solid #cbd5e1;padding:6px;">درجة الأولوية البيداغوجية</th>
        <th style="border:1px solid #cbd5e1;padding:6px;">التمارين الإضافية المقترحة للفرض القادم (N1/N2)</th>
      </tr>
    </thead>
    <tbody>
      ${adaptiveRowsHtml}
    </tbody>
  </table>

  <h2>ثانياً: شبكة تقييم المهارات المكتسبة لكل تلميذ عبر جدول التخصيص (مكتسبة / في طور الاكتساب / غير مكتسبة)</h2>
  <table>
    <thead>
      <tr>
        <th rowspan="2" style="border:1px solid #cbd5e1;padding:5px;background:#f1f5f9;">ر.ت</th>
        <th rowspan="2" style="border:1px solid #cbd5e1;padding:5px;background:#f1f5f9;">رمز مسار CNE</th>
        <th rowspan="2" style="border:1px solid #cbd5e1;padding:5px;background:#f1f5f9;">إسم التلميذ(ة)</th>
        <th rowspan="2" style="border:1px solid #cbd5e1;padding:5px;background:#f1f5f9;">نقطة الفرض السابق</th>
        ${lessonHeadersHtml}
        <th rowspan="2" style="border:1px solid #cbd5e1;padding:5px;background:#f1f5f9;">ملاحظة التشخيص والدعم</th>
      </tr>
      <tr>
        ${lessonSubHeadersHtml}
      </tr>
    </thead>
    <tbody>
      ${studentRowsHtml}
    </tbody>
  </table>

  <div class="sign-grid">
    <div class="sign-box"><strong>توقيع الأستاذ(ة) المكون(ة)</strong></div>
    <div class="sign-box"><strong>توقيع السيد(ة) المفتش(ة) التربوي(ة)</strong></div>
    <div class="sign-box"><strong>توقيع السيد(ة) مدير(ة) المؤسسة</strong></div>
  </div>
</body>
</html>`;

  const blob = new Blob(["\ufeff" + htmlContent], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `التقرير_البيداغوجي_المدمج_مصفوفة_2D_${dsTitleAr.replace(/\s+/g, "_")}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports the per-student skill acquisition matrix and adaptive lesson weights as UTF-8 CSV (Excel compatible).
 */
export function exportIntegratedPedagogicalReportCSV(
  params: IntegratedPedagogicalReportParams
): void {
  const { trackNameAr, dsTitleAr, lessons, students, adaptiveResult } = params;

  const lines: string[] = [];
  lines.push(
    `"التقرير البيداغوجي المدمج لمصفوفة التخصيص 2D وتقييم المهارات المكتسبة","${trackNameAr}","${dsTitleAr}"`
  );
  lines.push("");
  lines.push(
    `"أولاً: التحيين التلقائي لأوزان مصفوفة التخصيص 2D بناءً على نتائج الفرض السابق"`
  );
  lines.push(
    `"الدرس (عربي)","الدرس (فرنسي)","نسبة تملك N1 %","نسبة تملك N2 %","نسبة تملك N3 %","الوزن السابق %","الوزن المحدث تلقائياً %","الفارق %","الأولوية البيداغوجية"`
  );

  adaptiveResult.recommendations.forEach((rec) => {
    lines.push(
      `"${rec.lessonAr}","${rec.lessonFr}","${rec.n1MasteryPct}%","${rec.n2MasteryPct}%","${rec.n3MasteryPct}%","${rec.previousWeight}%","${rec.recommendedWeight}%","${rec.weightDelta}%","${rec.priorityLabelAr}"`
    );
  });

  lines.push("");
  lines.push(
    `"ثانياً: شبكة تقييم المهارات المكتسبة لكل تلميذ عبر جدول التخصيص"`
  );

  const studentHeaderCols = [
    `"ر.ت"`,
    `"رمز مسار CNE"`,
    `"إسم التلميذ(ة)"`,
    `"نقطة الفرض السابق (/20)"`,
  ];
  lessons.forEach((l) => {
    studentHeaderCols.push(`"${l.lessonAr} - N1"`);
    studentHeaderCols.push(`"${l.lessonAr} - N2"`);
    studentHeaderCols.push(`"${l.lessonAr} - N3"`);
  });
  studentHeaderCols.push(`"ملاحظة التشخيص البيداغوجي"`);
  lines.push(studentHeaderCols.join(","));

  students.forEach((st, idx) => {
    const rowCols = [
      `"${idx + 1}"`,
      `"${st.cne}"`,
      `"${st.fullNameAr}"`,
      `"${st.previousExamGrade20.toFixed(2)}"`,
    ];
    lessons.forEach((l) => {
      const rec = st.lessonRecords[l.lessonFr] || {
        n1Status: "IN_PROGRESS",
        n2Status: "IN_PROGRESS",
        n3Status: "IN_PROGRESS",
      };
      rowCols.push(`"${SKILL_ACQUISITION_META[rec.n1Status].labelAr}"`);
      rowCols.push(`"${SKILL_ACQUISITION_META[rec.n2Status].labelAr}"`);
      rowCols.push(`"${SKILL_ACQUISITION_META[rec.n3Status].labelAr}"`);
    });
    rowCols.push(`"${st.inspectorObservation.replace(/"/g, '""')}"`);
    lines.push(rowCols.join(","));
  });

  const csvContent = lines.join("\r\n");
  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `شبكة_المهارات_المكتسبة_ومصفوفة_2D_${dsTitleAr.replace(/\s+/g, "_")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
