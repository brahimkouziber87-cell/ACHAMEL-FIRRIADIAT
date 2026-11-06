/**
 * psychometrics.ts
 * ---------------------------------------------------------------------------
 * محرك القياس النفسي التربوي لتحليل نتائج الفروض وبنك الأسئلة.
 *
 * يحسب المؤشرات المعتمدة في التقويم التربوي:
 *  - معامل الصعوبة (Difficulty Index) لكل سؤال.
 *  - معامل التمييز (Discrimination Index) بطريقة المجموعتين العليا/الدنيا (27%).
 *  - معامل الثبات KR-20 للمحاولة كاملة.
 *  - تحليل المشتتات (Distractor Analysis) لأسئلة الاختيار من متعدد.
 *  - تصنيف جودة كل سؤال وتوصيات علاجية بالعربية.
 *
 * الوحدة نقية (pure) ولا تعتمد على DOM أو localStorage، لذا تُختبر بسهولة.
 */

export type ItemQuality = "EXCELLENT" | "GOOD" | "ACCEPTABLE" | "REVIEW" | "REJECT";

export interface ExamItemRef {
  id: string;
  /** فهرس الخيار الصحيح (0-based). */
  correctOption: number;
  /** عدد الخيارات، الافتراضي 4. */
  optionCount?: number;
  /** معرّف الكفاية المرتبطة بالسؤال (اختياري). */
  competencyId?: string;
}

export interface StudentAnswerSheet {
  studentId: string;
  /** إجابات التلميذ: معرّف السؤال ← فهرس الخيار (أو null إذا لم يجب). */
  answers: Record<string, number | null | undefined>;
}

export interface DistractorStat {
  option: number;
  chosenCount: number;
  sharePct: number;
  isCorrect: boolean;
  /** مشتت فعّال: اختاره عدد كافٍ من التلاميذ ولم يكن الخيار الصحيح. */
  worksAsDistractor: boolean;
}

export interface ItemPsychometrics {
  itemId: string;
  competencyId?: string;
  sampleSize: number;
  correctCount: number;
  /** من 0 إلى 1. */
  difficulty: number;
  difficultyLabelAr: string;
  /** من -1 إلى 1، أو null إذا كانت العينة صغيرة. */
  discrimination: number | null;
  discriminationLabelAr: string;
  quality: ItemQuality;
  qualityLabelAr: string;
  flagsAr: string[];
  distractors: DistractorStat[];
}

export interface ExamPsychometricsReport {
  itemCount: number;
  studentCount: number;
  meanScore: number;
  stdDev: number;
  minScore: number;
  maxScore: number;
  /** من 0 إلى 1، أو null إذا تعذّر الحساب. */
  kr20: number | null;
  reliabilityLabelAr: string;
  items: ItemPsychometrics[];
  globalFlagsAr: string[];
  recommendationsAr: string[];
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const round2 = (value: number): number => Math.round(value * 100) / 100;

/** معامل الصعوبة: نسبة الإجابات الصحيحة. */
export function computeDifficultyIndex(correctCount: number, totalCount: number): number {
  if (!Number.isFinite(correctCount) || !Number.isFinite(totalCount) || totalCount <= 0) return 0;
  return clamp01(correctCount / totalCount);
}

/** معامل التمييز بطريقة المجموعتين العليا/الدنيا. */
export function computeDiscriminationIndex(
  upperCorrect: number,
  lowerCorrect: number,
  groupSize: number
): number | null {
  if (!Number.isFinite(groupSize) || groupSize <= 0) return null;
  return Math.max(-1, Math.min(1, (upperCorrect - lowerCorrect) / groupSize));
}

/**
 * معامل الثبات KR-20.
 * @param itemCorrectCounts عدد الإجابات الصحيحة لكل سؤال.
 * @param totalScores الدرجات الكلية (عدد الإجابات الصحيحة) لكل تلميذ.
 */
export function computeKR20(itemCorrectCounts: number[], totalScores: number[]): number | null {
  const k = itemCorrectCounts.length;
  const n = totalScores.length;
  if (k < 2 || n < 2) return null;

  const p = itemCorrectCounts.map((count) => clamp01(count / n));
  const sumPQ = p.reduce((acc, pi) => acc + pi * (1 - pi), 0);

  const mean = totalScores.reduce((a, b) => a + b, 0) / n;
  const variance = totalScores.reduce((acc, score) => acc + (score - mean) ** 2, 0) / n;
  if (variance <= 0) return null;

  const value = (k / (k - 1)) * (1 - sumPQ / variance);
  if (!Number.isFinite(value)) return null;
  return round2(clamp01(value));
}

export function difficultyLabelAr(difficulty: number): string {
  if (difficulty < 0.2) return "صعب جداً";
  if (difficulty < 0.4) return "صعب";
  if (difficulty <= 0.8) return "مناسب";
  if (difficulty <= 0.9) return "سهل";
  return "سهل جداً";
}

export function discriminationLabelAr(discrimination: number | null): string {
  if (discrimination === null) return "غير محسوب (عينة صغيرة)";
  if (discrimination < 0) return "سالب — راجع مفتاح التصحيح";
  if (discrimination < 0.2) return "ضعيف";
  if (discrimination < 0.3) return "مقبول";
  if (discrimination < 0.4) return "جيد";
  return "ممتاز";
}

export function reliabilityLabelAr(kr20: number | null): string {
  if (kr20 === null) return "غير متاح";
  if (kr20 >= 0.9) return "ثبات ممتاز";
  if (kr20 >= 0.8) return "ثبات جيد";
  if (kr20 >= 0.7) return "ثبات مقبول";
  return "ثبات ضعيف — راجع صياغة الأسئلة";
}

export function classifyItemQuality(
  difficulty: number,
  discrimination: number | null
): { quality: ItemQuality; labelAr: string } {
  if (discrimination !== null && discrimination < 0) {
    return { quality: "REJECT", labelAr: "مرفوض — تمييز سالب" };
  }
  if (difficulty < 0.15 || difficulty > 0.95) {
    return { quality: "REJECT", labelAr: "مرفوض — صعوبة قصوى" };
  }
  if (discrimination === null) {
    return { quality: "REVIEW", labelAr: "يحتاج مراجعة — عينة صغيرة" };
  }
  if (discrimination >= 0.4 && difficulty >= 0.3 && difficulty <= 0.8) {
    return { quality: "EXCELLENT", labelAr: "ممتاز" };
  }
  if (discrimination >= 0.3) {
    return { quality: "GOOD", labelAr: "جيد" };
  }
  if (discrimination >= 0.2) {
    return { quality: "ACCEPTABLE", labelAr: "مقبول" };
  }
  return { quality: "REVIEW", labelAr: "يحتاج مراجعة — تمييز ضعيف" };
}

/** تحليل توزيع اختيارات المشتتات لسؤال واحد. */
export function computeDistractorAnalysis(
  item: ExamItemRef,
  sheets: StudentAnswerSheet[]
): DistractorStat[] {
  const optionCount = Math.max(2, Math.min(10, item.optionCount ?? 4));
  const counts = new Array<number>(optionCount).fill(0);
  let answered = 0;

  for (const sheet of sheets) {
    const choice = sheet.answers?.[item.id];
    if (typeof choice === "number" && choice >= 0 && choice < optionCount) {
      counts[choice] += 1;
      answered += 1;
    }
  }

  const minDistractorShare = 0.05; // 5% على الأقل لاعتباره مشتتاً فعّالاً
  return counts.map((chosenCount, option) => {
    const isCorrect = option === item.correctOption;
    const share = answered > 0 ? chosenCount / answered : 0;
    return {
      option,
      chosenCount,
      sharePct: Math.round(share * 100),
      isCorrect,
      worksAsDistractor: !isCorrect && share >= minDistractorShare,
    };
  });
}

/** التحليل الكامل لمحاولة/فرض. */
export function analyzeExamPsychometrics(
  items: ExamItemRef[],
  sheets: StudentAnswerSheet[]
): ExamPsychometricsReport {
  const studentCount = sheets.length;
  const itemCount = items.length;

  if (itemCount === 0 || studentCount === 0) {
    return {
      itemCount,
      studentCount,
      meanScore: 0,
      stdDev: 0,
      minScore: 0,
      maxScore: 0,
      kr20: null,
      reliabilityLabelAr: reliabilityLabelAr(null),
      items: [],
      globalFlagsAr: ["لا توجد بيانات كافية لتحليل المحاولة."],
      recommendationsAr: ["أدخل إجابات التلاميذ أولاً ثم أعد تشغيل التحليل."],
    };
  }

  const totalScores = sheets.map((sheet) =>
    items.reduce((acc, item) => {
      const choice = sheet.answers?.[item.id];
      return acc + (choice === item.correctOption ? 1 : 0);
    }, 0)
  );

  const sorted = sheets
    .map((sheet, index) => ({ sheet, total: totalScores[index] }))
    .sort((a, b) => b.total - a.total);

  const groupSize = Math.max(1, Math.round(studentCount * 0.27));
  const upperGroup = sorted.slice(0, groupSize).map((entry) => entry.sheet);
  const lowerGroup = sorted.slice(-groupSize).map((entry) => entry.sheet);

  const itemsStats: ItemPsychometrics[] = items.map((item) => {
    const correctCount = sheets.reduce((acc, sheet) => {
      return acc + (sheet.answers?.[item.id] === item.correctOption ? 1 : 0);
    }, 0);

    const difficulty = computeDifficultyIndex(correctCount, studentCount);
    const upperCorrect = upperGroup.reduce(
      (acc, sheet) => acc + (sheet.answers?.[item.id] === item.correctOption ? 1 : 0),
      0
    );
    const lowerCorrect = lowerGroup.reduce(
      (acc, sheet) => acc + (sheet.answers?.[item.id] === item.correctOption ? 1 : 0),
      0
    );
    const discrimination =
      studentCount >= 3 ? computeDiscriminationIndex(upperCorrect, lowerCorrect, groupSize) : null;

    const { quality, labelAr } = classifyItemQuality(difficulty, discrimination);
    const flags: string[] = [];
    if (difficulty < 0.2) flags.push("صعوبة مرتفعة جداً (أقل من 20% إجابات صحيحة).");
    if (difficulty > 0.9) flags.push("سهل جداً (أكثر من 90% إجابات صحيحة).");
    if (discrimination !== null && discrimination < 0.2) flags.push("تمييز ضعيف بين المتفوقين والمتعثرين.");
    if (discrimination !== null && discrimination < 0) flags.push("تمييز سالب: تحقق من مفتاح التصحيح أو صياغة السؤال.");

    const distractors = computeDistractorAnalysis(item, sheets);
    if (distractors.every((distractor) => distractor.isCorrect || distractor.chosenCount === 0)) {
      flags.push("لا توجد مشتتات فعّالة: راجع الخيارات غير الصحيحة.");
    }

    return {
      itemId: item.id,
      competencyId: item.competencyId,
      sampleSize: studentCount,
      correctCount,
      difficulty: round2(difficulty),
      difficultyLabelAr: difficultyLabelAr(difficulty),
      discrimination: discrimination === null ? null : round2(discrimination),
      discriminationLabelAr: discriminationLabelAr(discrimination),
      quality,
      qualityLabelAr: labelAr,
      flagsAr: flags,
      distractors,
    };
  });

  const meanScore = totalScores.reduce((a, b) => a + b, 0) / studentCount;
  const variance = totalScores.reduce((acc, score) => acc + (score - meanScore) ** 2, 0) / studentCount;
  const kr20 = computeKR20(
    itemsStats.map((stat) => stat.correctCount),
    totalScores
  );

  const globalFlags: string[] = [];
  const rejected = itemsStats.filter((stat) => stat.quality === "REJECT").length;
  const review = itemsStats.filter((stat) => stat.quality === "REVIEW").length;
  if (rejected > 0) globalFlags.push(`${rejected} سؤال/أسئلة تحتاج مراجعة عاجلة أو حذفاً.`);
  if (review > 0) globalFlags.push(`${review} سؤال/أسئلة تحتاج تحسين الصياغة أو المشتتات.`);
  if (kr20 !== null && kr20 < 0.7) globalFlags.push("ثبات المحاولة ضعيف: النتائج غير مستقرة.");

  const recommendations: string[] = [];
  const tooHard = itemsStats.filter((stat) => stat.difficulty < 0.2);
  const tooEasy = itemsStats.filter((stat) => stat.difficulty > 0.9);
  const negative = itemsStats.filter((stat) => (stat.discrimination ?? 0) < 0);
  if (tooHard.length) {
    recommendations.push(
      `أعد تدريس المفاهيم المرتبطة بالأسئلة ${tooHard.map((s) => s.itemId).join("، ")} قبل التقويم القادم.`
    );
  }
  if (tooEasy.length) {
    recommendations.push(
      `ارفع مستوى الأسئلة ${tooEasy.map((s) => s.itemId).join("، ")} أو استبدلها بأسئلة تمييزية.`
    );
  }
  if (negative.length) {
    recommendations.push("تحقق من مفتاح التصحيح للأسئلة ذات التمييز السالب قبل نشر النتائج.");
  }
  if (recommendations.length === 0) {
    recommendations.push("جودة المحاولة مقبولة: حافظ على نفس البنية في الفروض القادمة.");
  }

  return {
    itemCount,
    studentCount,
    meanScore: round2(meanScore),
    stdDev: round2(Math.sqrt(variance)),
    minScore: Math.min(...totalScores),
    maxScore: Math.max(...totalScores),
    kr20,
    reliabilityLabelAr: reliabilityLabelAr(kr20),
    items: itemsStats,
    globalFlagsAr: globalFlags,
    recommendationsAr: recommendations,
  };
}
