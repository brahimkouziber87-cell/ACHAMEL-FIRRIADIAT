import JSZip from "jszip";
import {
  LessonItem,
  InsertedFigure,
  DSQuestionDensity,
  computeExactExerciseEffectiveWeights,
  getQuestionBaremesAndLevels,
  getVariantQuestions,
} from "../data/curriculum";

// ============================================================================
// 1. مُولّد جدول التخصيص ثنائي البعد (Tableau de Spécification 2D - Bloom × Chapitres)
// ============================================================================

export interface SpecMatrixCell {
  questionsCount: number;
  points: number;
  percentageOfTotal: number;
  questionIndices: number[]; // 1-indexed question numbers within the exercise
}

export interface SpecMatrixRow {
  lessonIndex: number;
  lessonTitleAr: string;
  lessonTitleFr: string;
  capacitiesAr: string[];
  capacitiesFr: string[];
  weightPercent: number;
  totalQuestions: number;
  totalPoints: number;
  estimatedMinutes: number;
  dominantLevel: "N1" | "N2" | "N3";
  n1: SpecMatrixCell;
  n2: SpecMatrixCell;
  n3: SpecMatrixCell;
}

export interface SpecMatrix2DSummary {
  rows: SpecMatrixRow[];
  totals: {
    n1Questions: number;
    n1Points: number;
    n1Percent: number;
    n2Questions: number;
    n2Points: number;
    n2Percent: number;
    n3Questions: number;
    n3Points: number;
    n3Percent: number;
    grandTotalQuestions: number;
    grandTotalPoints: number;
    totalEstimatedMinutes: number;
  };
  targetRatios: { n1: number; n2: number; n3: number };
  deviations: { n1Delta: number; n2Delta: number; n3Delta: number };
  conformityScore: number; // 0 to 100% alignment with Note 142-08 targets
  inspectorAuditStatus: "CONFORME" | "TOLERANCE" | "A_EQUILIBRER";
  inspectorVerdictAr: string;
  inspectorVerdictFr: string;
}

export function build2DSpecificationMatrix(
  lessons: LessonItem[],
  n1Target: number,
  n2Target: number,
  n3Target: number,
  dsStructureMode: string = "EXERCICES_SEULS",
  isMission: boolean = false,
  dsQuestionDensity: DSQuestionDensity = "STANDARD",
  qcmQuestionCount: number = 4,
  examDurationMinutes: number = 120
): SpecMatrix2DSummary {
  const hasQCM =
    dsStructureMode === "QCM_ET_EXERCICES" || dsStructureMode === "COMPLETE_EXAM_MAROC";
  const hasProb =
    dsStructureMode === "EXERCICES_ET_PROBLEME" ||
    dsStructureMode === "COMPLETE_EXAM_MAROC" ||
    dsStructureMode === "EXAMEN_BLANC_2BAC";

  const validQcmCount = Math.max(2, Math.min(10, qcmQuestionCount || 4));
  const fixedQcmPts = hasQCM ? Number((validQcmCount * 1.0).toFixed(2)) : 0;
  const fixedProbPts = hasProb ? 8.5 : 0;
  const exBudget =
    hasQCM || hasProb ? Math.max(4, 20 - fixedQcmPts - fixedProbPts) : 20;

  const totalRawWeight =
    lessons.reduce((sum, l) => sum + (Number(l.weight) || 0), 0) || 100;

  const rows: SpecMatrixRow[] = [];

  if (hasQCM) {
    const qcmN1Count = Math.ceil(validQcmCount * 0.75);
    const qcmN2Count = Math.max(0, validQcmCount - qcmN1Count);
    const qcmN1Pts = Number((qcmN1Count * 1.0).toFixed(2));
    const qcmN2Pts = Number((qcmN2Count * 1.0).toFixed(2));
    const n1Indices = Array.from({ length: qcmN1Count }, (_, i) => i + 1);
    const n2Indices = Array.from({ length: qcmN2Count }, (_, i) => qcmN1Count + i + 1);

    rows.push({
      lessonIndex: 1,
      lessonTitleAr: "تمرين الاختيار من متعدد (QCM) مع التعليل",
      lessonTitleFr: "QCM & Vrai/Faux avec justification",
      capacitiesAr: [
        "التحقق من المكتسبات الأساسية والتعاريف والخاصيات المباشرة",
        "التعليل الرياضي الموجز والتمييز بين القضايا الصحيحة والخاطئة",
      ],
      capacitiesFr: [
        "Vérification des acquis fondamentaux et application directe des propriétés",
        "Justification mathématique concise et discrimination d'affirmations",
      ],
      weightPercent: Number(((fixedQcmPts / 20) * 100).toFixed(1)),
      totalQuestions: validQcmCount,
      totalPoints: fixedQcmPts,
      estimatedMinutes: Math.max(10, Math.round((fixedQcmPts / 20) * examDurationMinutes)),
      dominantLevel: "N1",
      n1: {
        questionsCount: qcmN1Count,
        points: qcmN1Pts,
        percentageOfTotal: Number(((qcmN1Pts / 20) * 100).toFixed(1)),
        questionIndices: n1Indices,
      },
      n2: {
        questionsCount: qcmN2Count,
        points: qcmN2Pts,
        percentageOfTotal: Number(((qcmN2Pts / 20) * 100).toFixed(1)),
        questionIndices: n2Indices,
      },
      n3: { questionsCount: 0, points: 0, percentageOfTotal: 0, questionIndices: [] },
    });
  }

  const exactWeights = computeExactExerciseEffectiveWeights(lessons, exBudget);

  lessons.forEach((lesson, idx) => {
    const effectiveWeight = exactWeights[idx] ?? lesson.weight;

    const variantQs = getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity);
    const qCount = Math.max(
      1,
      variantQs.questionsFr.length ||
        lesson.sampleExerciseFr?.length ||
        lesson.sampleExerciseAr?.length ||
        3
    );

    const metas = getQuestionBaremesAndLevels(
      effectiveWeight,
      qCount,
      n1Target,
      n2Target,
      n3Target,
      lesson.customQuestionBaremes,
      lesson.customQuestionLevels
    );

    const n1Cell: SpecMatrixCell = {
      questionsCount: 0,
      points: 0,
      percentageOfTotal: 0,
      questionIndices: [],
    };
    const n2Cell: SpecMatrixCell = {
      questionsCount: 0,
      points: 0,
      percentageOfTotal: 0,
      questionIndices: [],
    };
    const n3Cell: SpecMatrixCell = {
      questionsCount: 0,
      points: 0,
      percentageOfTotal: 0,
      questionIndices: [],
    };

    metas.forEach((m, qIdx) => {
      const pts = parseFloat(m.points || "0");
      if (m.level === "N1") {
        n1Cell.questionsCount += 1;
        n1Cell.points = Number((n1Cell.points + pts).toFixed(2));
        n1Cell.questionIndices.push(qIdx + 1);
      } else if (m.level === "N2") {
        n2Cell.questionsCount += 1;
        n2Cell.points = Number((n2Cell.points + pts).toFixed(2));
        n2Cell.questionIndices.push(qIdx + 1);
      } else {
        n3Cell.questionsCount += 1;
        n3Cell.points = Number((n3Cell.points + pts).toFixed(2));
        n3Cell.questionIndices.push(qIdx + 1);
      }
    });

    n1Cell.percentageOfTotal = Number(((n1Cell.points / 20) * 100).toFixed(1));
    n2Cell.percentageOfTotal = Number(((n2Cell.points / 20) * 100).toFixed(1));
    n3Cell.percentageOfTotal = Number(((n3Cell.points / 20) * 100).toFixed(1));

    const rowTotalPts = Number((n1Cell.points + n2Cell.points + n3Cell.points).toFixed(2));
    const dominantLevel: "N1" | "N2" | "N3" =
      n3Cell.points >= n2Cell.points && n3Cell.points >= n1Cell.points
        ? "N3"
        : n2Cell.points >= n1Cell.points
        ? "N2"
        : "N1";

    rows.push({
      lessonIndex: idx + (hasQCM ? 2 : 1),
      lessonTitleAr: lesson.lessonAr,
      lessonTitleFr: lesson.lessonFr,
      capacitiesAr: lesson.capacitiesAr || [],
      capacitiesFr: lesson.capacitiesFr || [],
      weightPercent: Number(((rowTotalPts / 20) * 100).toFixed(1)),
      totalQuestions: qCount,
      totalPoints: rowTotalPts,
      estimatedMinutes: Math.max(10, Math.round((rowTotalPts / 20) * examDurationMinutes)),
      dominantLevel,
      n1: n1Cell,
      n2: n2Cell,
      n3: n3Cell,
    });
  });

  if (hasProb) {
    rows.push({
      lessonIndex: rows.length + 1,
      lessonTitleAr: "المسألة التوليفية الشاملة (أجزاء I و II و III)",
      lessonTitleFr: "Problème de Synthèse (Parties I, II, III)",
      capacitiesAr: [
        "توليف موارد التحليل والدوال والمتتاليات في وضعية مسألة مركبة",
        "التأويل الهندسي وبناء الاستدلال الاستنتاجي المتدرج (نمط البكالوريا)",
      ],
      capacitiesFr: [
        "Mobilisation conjointe de l'analyse, des fonctions et des suites numériques",
        "Interprétation géométrique et résolution de problème de synthèse (Format Bac)",
      ],
      weightPercent: 42.5,
      totalQuestions: 6,
      totalPoints: 8.5,
      estimatedMinutes: Math.max(25, Math.round((8.5 / 20) * examDurationMinutes)),
      dominantLevel: "N3",
      n1: { questionsCount: 1, points: 1.5, percentageOfTotal: 7.5, questionIndices: [1] },
      n2: { questionsCount: 3, points: 4.0, percentageOfTotal: 20.0, questionIndices: [2, 3, 4] },
      n3: { questionsCount: 2, points: 3.0, percentageOfTotal: 15.0, questionIndices: [5, 6] },
    });
  }

  const n1Questions = rows.reduce((s, r) => s + r.n1.questionsCount, 0);
  const n1Points = Number(rows.reduce((s, r) => s + r.n1.points, 0).toFixed(2));
  const n2Questions = rows.reduce((s, r) => s + r.n2.questionsCount, 0);
  const n2Points = Number(rows.reduce((s, r) => s + r.n2.points, 0).toFixed(2));
  const n3Questions = rows.reduce((s, r) => s + r.n3.questionsCount, 0);
  const n3Points = Number(rows.reduce((s, r) => s + r.n3.points, 0).toFixed(2));

  const grandTotalQuestions = n1Questions + n2Questions + n3Questions;
  const grandTotalPoints = Number((n1Points + n2Points + n3Points).toFixed(2)) || 20;
  const totalEstimatedMinutes = rows.reduce((s, r) => s + r.estimatedMinutes, 0);

  const n1Percent = Number(((n1Points / grandTotalPoints) * 100).toFixed(1));
  const n2Percent = Number(((n2Points / grandTotalPoints) * 100).toFixed(1));
  const n3Percent = Number(((n3Points / grandTotalPoints) * 100).toFixed(1));

  const n1Delta = Number((n1Percent - n1Target).toFixed(1));
  const n2Delta = Number((n2Percent - n2Target).toFixed(1));
  const n3Delta = Number((n3Percent - n3Target).toFixed(1));

  const diff = Math.abs(n1Delta) + Math.abs(n2Delta) + Math.abs(n3Delta);
  const scorePenalty = Math.abs(grandTotalPoints - 20) > 0.1 ? 12 : 0;
  const conformityScore = Math.max(
    0,
    Math.min(100, Math.round(100 - diff * 0.55 - scorePenalty))
  );

  const inspectorAuditStatus: "CONFORME" | "TOLERANCE" | "A_EQUILIBRER" =
    conformityScore >= 88
      ? "CONFORME"
      : conformityScore >= 75
      ? "TOLERANCE"
      : "A_EQUILIBRER";

  const inspectorVerdictAr =
    inspectorAuditStatus === "CONFORME"
      ? `توزيع مثالي ومطابق لمعايير المذكرة الوزارية 142-08 (${conformityScore}%): تقاطع الدروس والمهارات يضمن تمثيلية عادلة للتطبيق المباشر (${n1Percent}%)، الاستدلال (${n2Percent}%)، والتوليف (${n3Percent}%).`
      : inspectorAuditStatus === "TOLERANCE"
      ? `توزيع مقبول بيداغوجياً ضمن هامش التسامح (${conformityScore}%): يُلاحظ فارق طفيف بين النسب المستهدفة والنسب الفعلية للأسئلة (${n1Percent}% / ${n2Percent}% / ${n3Percent}%).`
      : `يُنصح بإعادة موازنة المستويات المهارية للأسئلة (${conformityScore}%): الفارق الحالي بين الأهداف المهارية وتوزيع نقط الأسئلة يتطلب ضبطاً عبر مدير تجزئة النقط.`;

  const inspectorVerdictFr =
    inspectorAuditStatus === "CONFORME"
      ? `Ventilation conforme aux prescriptions de la Note 142-08 (${conformityScore}%) : croisement équilibré entre chapitres et taxonomie cognitive (N1: ${n1Percent}%, N2: ${n2Percent}%, N3: ${n3Percent}%).`
      : inspectorAuditStatus === "TOLERANCE"
      ? `Équilibre acceptable dans la marge de tolérance pédagogique (${conformityScore}%) : léger écart entre la cible et la pondération effective des questions.`
      : `Rééquilibrage recommandé (${conformityScore}%) : ajustez les niveaux N1/N2/N3 ou les barèmes par question pour converger vers la cible réglementaire.`;

  return {
    rows,
    totals: {
      n1Questions,
      n1Points,
      n1Percent,
      n2Questions,
      n2Points,
      n2Percent,
      n3Questions,
      n3Points,
      n3Percent,
      grandTotalQuestions,
      grandTotalPoints,
      totalEstimatedMinutes,
    },
    targetRatios: { n1: n1Target, n2: n2Target, n3: n3Target },
    deviations: { n1Delta, n2Delta, n3Delta },
    conformityScore,
    inspectorAuditStatus,
    inspectorVerdictAr,
    inspectorVerdictFr,
  };
}

export function generate2DSpecMatrixLatex(matrix: SpecMatrix2DSummary): string {
  const formatCellLatex = (cell: SpecMatrixCell) => {
    if (cell.questionsCount === 0) return "---";
    const qTags =
      cell.questionIndices.length > 0
        ? ` [Q${cell.questionIndices.join(", Q")}]`
        : "";
    return `${cell.questionsCount}Q${qTags} (${cell.points.toFixed(2)} pt)`;
  };

  const lines: string[] = [
    "% ==========================================================================",
    "% Tableau de Spécification 2D (Chapitres × Niveaux Cognitifs N1/N2/N3 - Note 142-08)",
    "% ==========================================================================",
    "\\begin{table}[h!]",
    "\\centering",
    "\\footnotesize",
    "\\renewcommand{\\arraystretch}{1.35}",
    "\\begin{tabular}{|p{4.6cm}|c|c|c|c|c|}",
    "\\hline",
    `\\textbf{Chapitre / Unité} & \\textbf{Niveau $N_1$ (${matrix.targetRatios.n1}\\%)} & \\textbf{Niveau $N_2$ (${matrix.targetRatios.n2}\\%)} & \\textbf{Niveau $N_3$ (${matrix.targetRatios.n3}\\%)} & \\textbf{Poids} & \\textbf{Total (/20)} \\\\`,
    "\\hline",
  ];

  matrix.rows.forEach((r) => {
    lines.push(
      `\\textbf{Ex. ${r.lessonIndex} :} ${r.lessonTitleFr} & ${formatCellLatex(r.n1)} & ${formatCellLatex(r.n2)} & ${formatCellLatex(r.n3)} & ${r.weightPercent}\\% & \\textbf{${r.totalPoints.toFixed(2)} pts} \\\\ \\hline`
    );
  });

  const t = matrix.totals;
  lines.push(
    `\\textbf{Total Général (${t.grandTotalQuestions}Q)} & \\textbf{${t.n1Questions}Q (${t.n1Points.toFixed(2)} pt $\\cdot$ ${t.n1Percent}\\%)} & \\textbf{${t.n2Questions}Q (${t.n2Points.toFixed(2)} pt $\\cdot$ ${t.n2Percent}\\%)} & \\textbf{${t.n3Questions}Q (${t.n3Points.toFixed(2)} pt $\\cdot$ ${t.n3Percent}\\%)} & \\textbf{100\\%} & \\textbf{${t.grandTotalPoints.toFixed(2)} / 20} \\\\ \\hline`
  );
  lines.push("\\end{tabular}");
  lines.push(
    `\\caption{Tableau de spécification bidimensionnel 2D --- Indice de conformité Note 142-08 : ${matrix.conformityScore}\\%}`
  );
  lines.push("\\end{table}");
  return lines.join("\n");
}

export function generate2DSpecMatrixTypst(
  matrix: SpecMatrix2DSummary,
  isFr: boolean = false
): string {
  const formatCellTypst = (cell: SpecMatrixCell) => {
    if (cell.questionsCount === 0) return "—";
    const qPrefix = isFr ? "Q" : "س";
    const qTags =
      cell.questionIndices.length > 0
        ? ` (${qPrefix}${cell.questionIndices.join(`، ${qPrefix}`)})`
        : "";
    return `${cell.questionsCount}${isFr ? "Q" : " أسئلة"}${qTags} · ${cell.points.toFixed(2)}`;
  };

  const t = matrix.totals;
  const rowsTypst = matrix.rows
    .map((r) => {
      const title = isFr
        ? `*Ex. ${r.lessonIndex} :* ${r.lessonTitleFr}`
        : `*تمرين ${r.lessonIndex} :* ${r.lessonTitleAr}`;
      return `  [${title}], [${formatCellTypst(r.n1)}], [${formatCellTypst(r.n2)}], [${formatCellTypst(r.n3)}], [${r.weightPercent}%], [*${r.totalPoints.toFixed(2)} / 20*],`;
    })
    .join("\n");

  return `
=== ${
    isFr
      ? `Tableau de Spécification Bidimensionnel 2D (Chapitres × N1/N2/N3 — Conformité : ${matrix.conformityScore}%)`
      : `مصفوفة التخصيص ثنائية الأبعاد 2D (الدروس × المستويات المهارية N1/N2/N3 — المطابقة: ${matrix.conformityScore}%)`
  }
#table(
  columns: (2.6fr, 1.5fr, 1.5fr, 1.5fr, 0.8fr, 1fr),
  inset: 6pt,
  align: horizon,
  [*${isFr ? "Chapitre / Composante" : "المكون / الدرس"}*], [*N1 (${matrix.targetRatios.n1}%)*], [*N2 (${matrix.targetRatios.n2}%)*], [*N3 (${matrix.targetRatios.n3}%)*], [*${isFr ? "Poids" : "الوزن"}*], [*${isFr ? "Total" : "المجموع"}*],
${rowsTypst}
  [*${isFr ? `Total (${t.grandTotalQuestions}Q)` : `المجموع العام (${t.grandTotalQuestions} س)`}*], [*${t.n1Questions}Q · ${t.n1Points.toFixed(2)} (${t.n1Percent}%)*], [*${t.n2Questions}Q · ${t.n2Points.toFixed(2)} (${t.n2Percent}%)*], [*${t.n3Questions}Q · ${t.n3Points.toFixed(2)} (${t.n3Percent}%)*], [*100%*], [*${t.grandTotalPoints.toFixed(2)} / 20*]
)`;
}

// ============================================================================
// 2. محرك رسم منحنيات الدوال وجدول التغيرات الآلي بـ TikZ / PGFPlots (tkz-tab & C_f)
// ============================================================================

export interface FunctionPreset {
  id: string;
  titleAr: string;
  titleFr: string;
  levelBadge: string;
  formulaLatex: string;
  derivativeLatex: string;
  jsExpr: string; // JavaScript expression in terms of x
  domainMin: number;
  domainMax: number;
  yMin: number;
  yMax: number;
  asymptoteX?: number; // vertical asymptote x = a
  obliqueAsymptote?: { m: number; p: number; label: string }; // y = mx + p
  criticalPoints: Array<{
    x: string;
    xNum: number;
    fx: string;
    fxNum: number;
    type: "MAX" | "MIN" | "INFLECTION";
  }>;
  signIntervals: Array<{
    fromX: string;
    toX: string;
    sign: "+" | "-";
    variation: "UP" | "DOWN";
    fromLimit: string;
    toLimit: string;
  }>;
}

export const CLASSIC_BAC_FUNCTION_PRESETS: FunctionPreset[] = [
  {
    id: "cubic_poly",
    titleAr: "دالة حدودية من الدرجة الثالثة (أولى ثانوي / 1Bac)",
    titleFr: "Polynôme du 3e degré : f(x) = x³ - 3x + 1",
    levelBadge: "1Bac / Première",
    formulaLatex: "f(x) = x^3 - 3x + 1",
    derivativeLatex: "f'(x) = 3(x^2 - 1) = 3(x-1)(x+1)",
    jsExpr: "Math.pow(x, 3) - 3 * x + 1",
    domainMin: -2.6,
    domainMax: 2.6,
    yMin: -3,
    yMax: 4,
    criticalPoints: [
      { x: "-1", xNum: -1, fx: "3", fxNum: 3, type: "MAX" },
      { x: "1", xNum: 1, fx: "-1", fxNum: -1, type: "MIN" },
    ],
    signIntervals: [
      { fromX: "-∞", toX: "-1", sign: "+", variation: "UP", fromLimit: "-∞", toLimit: "3" },
      { fromX: "-1", toX: "1", sign: "-", variation: "DOWN", fromLimit: "3", toLimit: "-1" },
      { fromX: "1", toX: "+∞", sign: "+", variation: "UP", fromLimit: "-1", toLimit: "+∞" },
    ],
  },
  {
    id: "exp_bac",
    titleAr: "دالة أسية كلاسيكية للبكالوريا (2Bac PC/SVT/SM)",
    titleFr: "Fonction Exponentielle Bac : f(x) = (x - 1)e^x + 1",
    levelBadge: "2Bac / Terminale",
    formulaLatex: "f(x) = (x - 1)\\mathrm{e}^{x} + 1",
    derivativeLatex: "f'(x) = x\\mathrm{e}^{x}",
    jsExpr: "(x - 1) * Math.exp(x) + 1",
    domainMin: -3.5,
    domainMax: 1.8,
    yMin: -1,
    yMax: 4.5,
    obliqueAsymptote: { m: 0, p: 1, label: "y = 1 (جيوار -∞)" },
    criticalPoints: [{ x: "0", xNum: 0, fx: "0", fxNum: 0, type: "MIN" }],
    signIntervals: [
      { fromX: "-∞", toX: "0", sign: "-", variation: "DOWN", fromLimit: "1", toLimit: "0" },
      { fromX: "0", toX: "+∞", sign: "+", variation: "UP", fromLimit: "0", toLimit: "+∞" },
    ],
  },
  {
    id: "ln_bac",
    titleAr: "دالة لوغاريتمية نيبيرية للبكالوريا (2Bac)",
    titleFr: "Fonction Logarithme Bac : f(x) = x - 1 - ln(x)",
    levelBadge: "2Bac / Terminale",
    formulaLatex: "f(x) = x - 1 - \\ln(x)",
    derivativeLatex: "f'(x) = \\frac{x - 1}{x}",
    jsExpr: "x > 0.02 ? x - 1 - Math.log(x) : NaN",
    domainMin: 0.1,
    domainMax: 4.5,
    yMin: -0.8,
    yMax: 3.5,
    asymptoteX: 0,
    criticalPoints: [{ x: "1", xNum: 1, fx: "0", fxNum: 0, type: "MIN" }],
    signIntervals: [
      { fromX: "0⁺", toX: "1", sign: "-", variation: "DOWN", fromLimit: "+∞", toLimit: "0" },
      { fromX: "1", toX: "+∞", sign: "+", variation: "UP", fromLimit: "0", toLimit: "+∞" },
    ],
  },
  {
    id: "homographic",
    titleAr: "دالة جذرية متخاطة / مقارب مائل (TCS / 1Bac)",
    titleFr: "Fonction Rationnelle : f(x) = x - 1 + 1/(x - 1)",
    levelBadge: "1Bac / TCS",
    formulaLatex: "f(x) = x - 1 + \\frac{1}{x - 1}",
    derivativeLatex: "f'(x) = \\frac{x(x - 2)}{(x - 1)^2}",
    jsExpr: "Math.abs(x - 1) > 0.08 ? (x - 1) + 1 / (x - 1) : NaN",
    domainMin: -2.2,
    domainMax: 4.2,
    yMin: -4.5,
    yMax: 4.5,
    asymptoteX: 1,
    obliqueAsymptote: { m: 1, p: -1, label: "(Δ): y = x - 1" },
    criticalPoints: [
      { x: "0", xNum: 0, fx: "-2", fxNum: -2, type: "MAX" },
      { x: "2", xNum: 2, fx: "2", fxNum: 2, type: "MIN" },
    ],
    signIntervals: [
      { fromX: "-∞", toX: "0", sign: "+", variation: "UP", fromLimit: "-∞", toLimit: "-2" },
      { fromX: "0", toX: "1", sign: "-", variation: "DOWN", fromLimit: "-2", toLimit: "-∞" },
      { fromX: "1", toX: "2", sign: "-", variation: "DOWN", fromLimit: "+∞", toLimit: "2" },
      { fromX: "2", toX: "+∞", sign: "+", variation: "UP", fromLimit: "2", toLimit: "+∞" },
    ],
  },
];

export function evaluateSafeMathExpression(expr: string, xVal: number): number {
  try {
    // Normalize common math syntax to JS Math
    const normalized = expr
      .replace(/\^/g, "**")
      .replace(/\bln\s*\(/g, "Math.log(")
      .replace(/\blog\s*\(/g, "Math.log10(")
      .replace(/\bexp\s*\(/g, "Math.exp(")
      .replace(/\bsin\s*\(/g, "Math.sin(")
      .replace(/\bcos\s*\(/g, "Math.cos(")
      .replace(/\btan\s*\(/g, "Math.tan(")
      .replace(/\bsqrt\s*\(/g, "Math.sqrt(")
      .replace(/\babs\s*\(/g, "Math.abs(");

    const fn = new Function("x", `return (${normalized});`);
    const res = Number(fn(xVal));
    return Number.isFinite(res) ? res : NaN;
  } catch {
    return NaN;
  }
}

export function generateFunctionPlotAndTabSvg(
  preset: FunctionPreset,
  options: {
    showVariationTable: boolean;
    showCurveGrid: boolean;
    showTangents: boolean;
    showAsymptotes: boolean;
    customJsExpr?: string;
    customFormulaLabel?: string;
  }
): { svgMarkup: string; svgDataUrl: string; tikzCode: string } {
  const {
    showVariationTable,
    showCurveGrid,
    showTangents,
    showAsymptotes,
    customJsExpr,
    customFormulaLabel,
  } = options;

  const width = 760;
  const tabHeight = showVariationTable ? 175 : 0;
  const plotHeight = showCurveGrid ? 320 : 0;
  const totalHeight = Math.max(190, tabHeight + plotHeight + 24);

  const exprToUse = customJsExpr?.trim() ? customJsExpr.trim() : preset.jsExpr;
  const formulaTitle = customFormulaLabel?.trim()
    ? customFormulaLabel.trim()
    : preset.formulaLatex;

  // 1. Build Variation Table SVG part
  let tabSvg = "";
  if (showVariationTable) {
    const tLeft = 20;
    const tTop = 14;
    const tW = width - 40;
    const tH = 152;
    const colHeaderW = 105;
    const intervals = preset.signIntervals;
    const numCols = intervals.length;
    const colW = (tW - colHeaderW) / Math.max(1, numCols);

    const boundaryLabels: string[] = [];
    intervals.forEach((iv, i) => {
      if (i === 0) boundaryLabels.push(iv.fromX);
      boundaryLabels.push(iv.toX);
    });

    tabSvg += `
      <g transform="translate(${tLeft}, ${tTop})">
        <rect x="0" y="0" width="${tW}" height="${tH}" rx="6" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
        <rect x="0" y="0" width="${colHeaderW}" height="${tH}" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="1.2"/>
        <!-- Horizontal rows: x (0..36), f'(x) (36..74), f(x) (74..152) -->
        <line x1="0" y1="36" x2="${tW}" y2="36" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="0" y1="74" x2="${tW}" y2="74" stroke="#0f172a" stroke-width="1.4"/>
        <text x="${colHeaderW / 2}" y="23" text-anchor="middle" font-family="serif" font-weight="bold" font-style="italic" font-size="14" fill="#0f172a">x</text>
        <text x="${colHeaderW / 2}" y="60" text-anchor="middle" font-family="serif" font-weight="bold" font-style="italic" font-size="13" fill="#1e3a8a">Signe de f'(x)</text>
        <text x="${colHeaderW / 2}" y="118" text-anchor="middle" font-family="serif" font-weight="bold" font-style="italic" font-size="13" fill="#0f172a">Variations de f</text>
    `;

    boundaryLabels.forEach((lbl, idx) => {
      const bx =
        colHeaderW +
        (idx === 0
          ? 24
          : idx === boundaryLabels.length - 1
          ? tW - colHeaderW - 24
          : idx * colW);
      tabSvg += `<text x="${bx}" y="23" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12.5" fill="#0f172a">${lbl}</text>`;

      // Vertical zero or double-bar on inner boundaries
      if (idx > 0 && idx < boundaryLabels.length - 1) {
        const isAsymptote =
          preset.asymptoteX !== undefined &&
          String(preset.asymptoteX) === lbl.replace("⁺", "");
        if (isAsymptote) {
          tabSvg += `
            <line x1="${bx - 2.5}" y1="36" x2="${bx - 2.5}" y2="${tH}" stroke="#dc2626" stroke-width="1.4"/>
            <line x1="${bx + 2.5}" y1="36" x2="${bx + 2.5}" y2="${tH}" stroke="#dc2626" stroke-width="1.4"/>
          `;
        } else {
          tabSvg += `
            <line x1="${bx}" y1="36" x2="${bx}" y2="74" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1.1"/>
            <circle cx="${bx}" cy="55" r="8" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.2"/>
            <text x="${bx}" y="59" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="11" fill="#1e3a8a">0</text>
          `;
        }
      }
    });

    intervals.forEach((iv, i) => {
      const xStart = colHeaderW + (i === 0 ? 32 : i * colW + 16);
      const xEnd =
        colHeaderW +
        (i === intervals.length - 1 ? tW - colHeaderW - 32 : (i + 1) * colW - 16);
      const xMid = (xStart + xEnd) / 2;

      // Sign of f'(x)
      tabSvg += `<text x="${xMid}" y="60" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="${
        iv.sign === "+" ? "#047857" : "#be123c"
      }">${iv.sign}</text>`;

      // Arrow in Variations row
      const yHigh = 92;
      const yLow = 138;
      const y1 = iv.variation === "UP" ? yLow : yHigh;
      const y2 = iv.variation === "UP" ? yHigh : yLow;
      const arrowColor = iv.variation === "UP" ? "#047857" : "#be123c";

      tabSvg += `
        <line x1="${xStart + 18}" y1="${y1}" x2="${xEnd - 18}" y2="${y2}" stroke="${arrowColor}" stroke-width="2" marker-end="url(#varArrow)"/>
        <text x="${xStart}" y="${y1 + 4}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="11.5" fill="#0f172a">${iv.fromLimit}</text>
        <text x="${xEnd}" y="${y2 + 4}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="11.5" fill="#0f172a">${iv.toLimit}</text>
      `;
    });

    tabSvg += `</g>`;
  }

  // 2. Build Orthogonal Coordinate Grid & Curve C_f
  let plotSvg = "";
  if (showCurveGrid) {
    const pLeft = 40;
    const pTop = showVariationTable ? tabHeight + 16 : 16;
    const pW = width - 80;
    const pH = plotHeight - 16;

    const { domainMin, domainMax, yMin, yMax } = preset;
    const mapX = (x: number) =>
      pLeft + ((x - domainMin) / (domainMax - domainMin)) * pW;
    const mapY = (y: number) =>
      pTop + pH - ((y - yMin) / (yMax - yMin)) * pH;

    plotSvg += `
      <g>
        <clipPath id="plotClip">
          <rect x="${pLeft}" y="${pTop}" width="${pW}" height="${pH}" rx="6"/>
        </clipPath>
        <rect x="${pLeft}" y="${pTop}" width="${pW}" height="${pH}" rx="6" fill="#ffffff" stroke="#334155" stroke-width="1.4"/>
    `;

    // Millimeter/Unit grid lines
    for (let gx = Math.ceil(domainMin); gx <= Math.floor(domainMax); gx++) {
      const px = mapX(gx);
      plotSvg += `
        <line x1="${px}" y1="${pTop}" x2="${px}" y2="${pTop + pH}" stroke="${
        gx === 0 ? "#0f172a" : "#e2e8f0"
      }" stroke-width="${gx === 0 ? "1.8" : "1"}"/>
      `;
      if (gx !== 0) {
        const y0 = Math.min(pTop + pH - 6, Math.max(pTop + 14, mapY(0) + 14));
        plotSvg += `<text x="${px}" y="${y0}" text-anchor="middle" font-family="monospace" font-size="10" fill="#475569">${gx}</text>`;
      }
    }

    for (let gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy++) {
      const py = mapY(gy);
      plotSvg += `
        <line x1="${pLeft}" y1="${py}" x2="${pLeft + pW}" y2="${py}" stroke="${
        gy === 0 ? "#0f172a" : "#e2e8f0"
      }" stroke-width="${gy === 0 ? "1.8" : "1"}"/>
      `;
      if (gy !== 0) {
        const x0 = Math.min(pLeft + pW - 14, Math.max(pLeft + 14, mapX(0) - 10));
        plotSvg += `<text x="${x0}" y="${py + 4}" text-anchor="end" font-family="monospace" font-size="10" fill="#475569">${gy}</text>`;
      }
    }

    // Origin (O, i, j) vectors
    const ox = mapX(0);
    const oy = mapY(0);
    if (ox >= pLeft && ox <= pLeft + pW && oy >= pTop && oy <= pTop + pH) {
      plotSvg += `
        <text x="${ox - 8}" y="${oy + 14}" font-family="serif" font-weight="bold" font-style="italic" font-size="12" fill="#0f172a">O</text>
        <line x1="${ox}" y1="${oy}" x2="${mapX(1)}" y2="${oy}" stroke="#0f172a" stroke-width="2.4"/>
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${mapY(1)}" stroke="#0f172a" stroke-width="2.4"/>
      `;
    }

    plotSvg += `<g clip-path="url(#plotClip)">`;

    // Asymptotes
    if (showAsymptotes) {
      if (preset.asymptoteX !== undefined) {
        const ax = mapX(preset.asymptoteX);
        plotSvg += `<line x1="${ax}" y1="${pTop}" x2="${ax}" y2="${
          pTop + pH
        }" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="6,4"/>`;
      }
      if (preset.obliqueAsymptote) {
        const { m, p } = preset.obliqueAsymptote;
        const yStart = m * domainMin + p;
        const yEnd = m * domainMax + p;
        plotSvg += `<line x1="${mapX(domainMin)}" y1="${mapY(
          yStart
        )}" x2="${mapX(domainMax)}" y2="${mapY(
          yEnd
        )}" stroke="#d97706" stroke-width="1.5" stroke-dasharray="5,4"/>`;
      }
    }

    // Sample Function Curve C_f
    const steps = 260;
    let currentSegment: string[] = [];
    const segments: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const xv = domainMin + (i / steps) * (domainMax - domainMin);
      const yv = evaluateSafeMathExpression(exprToUse, xv);
      if (Number.isFinite(yv) && yv >= yMin - 5 && yv <= yMax + 5) {
        currentSegment.push(`${mapX(xv).toFixed(1)},${mapY(yv).toFixed(1)}`);
      } else {
        if (currentSegment.length > 1) segments.push(currentSegment.join(" "));
        currentSegment = [];
      }
    }
    if (currentSegment.length > 1) segments.push(currentSegment.join(" "));

    segments.forEach((pts) => {
      plotSvg += `<polyline fill="none" stroke="#1d4ed8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" points="${pts}"/>`;
    });

    // Horizontal Tangents at Critical Points
    if (showTangents && !customJsExpr?.trim()) {
      preset.criticalPoints.forEach((cp) => {
        const cx = mapX(cp.xNum);
        const cy = mapY(cp.fxNum);
        plotSvg += `
          <line x1="${cx - 28}" y1="${cy}" x2="${cx + 28}" y2="${cy}" stroke="#059669" stroke-width="2" marker-start="url(#tanArrow)" marker-end="url(#tanArrow)"/>
          <circle cx="${cx}" cy="${cy}" r="4" fill="#059669" stroke="#ffffff" stroke-width="1.2"/>
        `;
      });
    }

    plotSvg += `</g>`;

    // Curve Badge Label (C_f)
    plotSvg += `
      <rect x="${pLeft + 10}" y="${pTop + 8}" width="210" height="24" rx="4" fill="#eff6ff" stroke="#93c5fd" stroke-width="1"/>
      <text x="${pLeft + 18}" y="${pTop + 24}" font-family="serif" font-weight="bold" font-size="12" fill="#1e3a8a">(C_f) : ${formulaTitle
        .replace(/\\mathrm\{e\}/g, "e")
        .replace(/\\ln/g, "ln")
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")}</text>
      </g>
    `;
  }

  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${totalHeight}" width="100%">
    <defs>
      <marker id="varArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a"/>
      </marker>
      <marker id="tanArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 2 L 8 5 L 0 8 z" fill="#059669"/>
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${tabSvg}
    ${plotSvg}
  </svg>`;

  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;

  // 3. Generate Official tkz-tab + pgfplots LaTeX code (including \tkzTabVar)
  const boundaryX = preset.signIntervals.map((iv) => iv.fromX);
  if (preset.signIntervals.length > 0) {
    boundaryX.push(preset.signIntervals[preset.signIntervals.length - 1].toX);
  }
  const tkzXList = boundaryX
    .map((b) => `$${b.replace("∞", "\\infty").replace("⁺", "^+")}$ / 1`)
    .join(", ");
  const tkzSigns = preset.signIntervals
    .map((iv, idx) => {
      const sep =
        idx < preset.signIntervals.length - 1
          ? preset.asymptoteX !== undefined &&
            String(preset.asymptoteX) === iv.toX.replace("⁺", "")
            ? ", d"
            : ", z"
          : "";
      return `, ${iv.sign}${sep}`;
    })
    .join("");

  const tkzVarsParts: string[] = [];
  preset.signIntervals.forEach((iv, idx) => {
    const startDir = iv.variation === "UP" ? "-" : "+";
    const endDir = iv.variation === "UP" ? "+" : "-";
    const fmtLim = (s: string) => s.replace("∞", "\\infty");
    if (idx === 0) {
      tkzVarsParts.push(`${startDir}/ $${fmtLim(iv.fromLimit)}$`);
    }
    tkzVarsParts.push(`${endDir}/ $${fmtLim(iv.toLimit)}$`);
  });

  const tikzCode = [
    "% ==========================================================================",
    `% Tableau de Variations (tkz-tab) & Courbe représentative (C_f) : ${preset.titleFr}`,
    "% Nécessite : \\usepackage{tikz, tkz-tab, pgfplots}",
    "% ==========================================================================",
    "\\begin{center}",
    "\\begin{tikzpicture}[scale=0.95]",
    `  \\tkzTabInit[lgt=2.8, espcl=2.6]{$x$ / 1, Signe de $f'(x)$ / 1, Variations de $f$ / 2.2}{${tkzXList}}`,
    `  \\tkzTabLine{${tkzSigns}}`,
    `  \\tkzTabVar{${tkzVarsParts.join(", ")}}`,
    "\\end{tikzpicture}",
    "\\end{center}",
    "",
    "\\begin{center}",
    "\\begin{tikzpicture}[scale=0.9]",
    "  \\begin{axis}[",
    "    axis lines = middle,",
    "    grid = both,",
    `    xmin = ${preset.domainMin}, xmax = ${preset.domainMax},`,
    `    ymin = ${preset.yMin}, ymax = ${preset.yMax},`,
    "    xlabel = {$x$}, ylabel = {$y$},",
    "    samples = 200",
    "  ]",
    `    \\addplot[domain=${preset.domainMin}:${preset.domainMax}, ultra thick, blue] {${exprToUse
      .replace(/Math\./g, "")
      .replace(/pow\(x,\s*3\)/g, "x^3")}};`,
    `    \\node[above right, blue] at (axis cs:0.5,1.5) {$(\\mathcal{C}_f): ${formulaTitle}$};`,
    "  \\end{axis}",
    "\\end{tikzpicture}",
    "\\end{center}",
  ].join("\n");

  return { svgMarkup, svgDataUrl, tikzCode };
}

export function createInsertedFigureFromFunctionPlot(
  preset: FunctionPreset,
  exerciseId: string,
  options: {
    showVariationTable: boolean;
    showCurveGrid: boolean;
    showTangents: boolean;
    showAsymptotes: boolean;
    customJsExpr?: string;
    customFormulaLabel?: string;
  }
): InsertedFigure {
  const { svgDataUrl } = generateFunctionPlotAndTabSvg(preset, options);
  return {
    id: `fig_fn_${Date.now()}`,
    exerciseId,
    titleAr: `جدول التغيرات والمنحنى الممثل للدالة (${preset.formulaLatex})`,
    titleFr: `Tableau de variations et courbe (C_f) — ${preset.titleFr}`,
    dataUrl: svgDataUrl,
    caption: `الشكل المرفق: التمثيل المبياني (C_f) في معلم متعامد ممنظم (O, i, j) وجدول تغيرات الدالة f.`,
    showCaption: true,
    borderStyle: "academic",
    widthPercent: 85,
    alignment: "center",
  };
}

// ============================================================================
// 3. نظام النماذج المتعددة للامتحانات (A / B / C / D) وورقة التصحيح البصري السريع (OMR)
// ============================================================================

export type ExtendedExamModelCode = "A" | "B" | "C" | "D";

export interface OMRQuestionKey {
  questionNum: number;
  domainAr: string;
  domainFr: string;
  points: number;
  correctByModel: Record<ExtendedExamModelCode, "A" | "B" | "C" | "D">;
}

export function generateOMRGridData(
  lessons: LessonItem[],
  questionCount: number = 10
): OMRQuestionKey[] {
  const options: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  const items: OMRQuestionKey[] = [];

  for (let i = 1; i <= questionCount; i++) {
    const lesson = lessons[(i - 1) % Math.max(1, lessons.length)];
    const baseIdx = (i * 3 + (lesson?.weight || 20)) % 4;
    items.push({
      questionNum: i,
      domainAr: lesson?.lessonAr || `السؤال المرجعي ${i}`,
      domainFr: lesson?.lessonFr || `Question de référence ${i}`,
      points: Number((20 / questionCount).toFixed(2)),
      correctByModel: {
        A: options[baseIdx],
        B: options[(baseIdx + 1) % 4],
        C: options[(baseIdx + 2) % 4],
        D: options[(baseIdx + 3) % 4],
      },
    });
  }

  return items;
}

export function generateOMRLatexSnippet(
  omrItems: OMRQuestionKey[],
  activeModel: ExtendedExamModelCode = "A"
): string {
  const lines: string[] = [
    "% ==========================================================================",
    `% Grille Optique de Réponse Rapide (OMR / QCM) — Modèle ${activeModel}`,
    "% ==========================================================================",
    "\\begin{tcolorbox}[colback=white,colframe=black,title=\\textbf{Grille de Réponse Optique OMR — Modèle " +
      activeModel +
      " (Noircir une seule case par ligne)}]",
    "\\centering",
    "\\renewcommand{\\arraystretch}{1.3}",
    "\\begin{tabular}{|c|c|c|c|c|l|}",
    "\\hline",
    "\\textbf{N°} & \\textbf{(A)} & \\textbf{(B)} & \\textbf{(C)} & \\textbf{(D)} & \\textbf{Chapitre / Barème} \\\\ \\hline",
  ];

  omrItems.forEach((item) => {
    lines.push(
      `\\textbf{Q${item.questionNum}} & $\\bigcirc$ & $\\bigcirc$ & $\\bigcirc$ & $\\bigcirc$ & ${item.domainFr} (${item.points} pt) \\\\ \\hline`
    );
  });

  lines.push("\\end{tabular}");
  lines.push("\\end{tcolorbox}");
  return lines.join("\n");
}

// ============================================================================
// 4. مكتبة الأخطاء الشائعة للمتعلمين واليقظة الديداكتيكية (Banque d'Erreurs Typiques)
// ============================================================================

export interface DidacticErrorCard {
  id: string;
  lessonTitleAr: string;
  lessonTitleFr: string;
  epistemologicalObstacleTypeAr: string;
  epistemologicalObstacleTypeFr: string;
  frequentMistakeAr: string;
  frequentMistakeFr: string;
  wrongExpressionLatex: string;
  correctExpressionLatex: string;
  cognitiveOriginAr: string;
  cognitiveOriginFr: string;
  teacherRemediationTipAr: string;
  teacherRemediationTipFr: string;
  remediationExerciseAr: string;
  remediationExerciseFr: string;
  remediationSolutionAr: string;
  remediationSolutionFr: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
}

export function getTypicalErrorsForLessons(lessons: LessonItem[]): DidacticErrorCard[] {
  const cards: DidacticErrorCard[] = [];

  lessons.forEach((lesson, idx) => {
    const text = `${lesson.lessonAr} ${lesson.lessonFr}`.toLowerCase();

    if (text.includes("continuit") || text.includes("اتصال") || text.includes("نهايات") || text.includes("limit")) {
      cards.push({
        id: `err_lim_${idx}`,
        lessonTitleAr: lesson.lessonAr,
        lessonTitleFr: lesson.lessonFr,
        epistemologicalObstacleTypeAr: "عائق إبستيمولوجي: تعميم الحساب الجبري المنتهي على الأشكال غير المحددة (∞ - ∞)",
        epistemologicalObstacleTypeFr: "Obstacle épistémologique : Extension abusive du terme dominant sous un radical",
        frequentMistakeAr: "الخلط بين الشروط الثلاثة لمبرهنة القيم الوسيطية (TVI) أو إغفال رتابة الدالة قطعا عند إثبات وحدانية الحل α.",
        frequentMistakeFr: "Omission de la stricte monotonie lors de l'application du TVI pour l'unicité de la solution α, ou confusion sur les formes indéterminées.",
        wrongExpressionLatex: "\\lim_{x \\to +\\infty} (\\sqrt{x^2+x} - x) = 0",
        correctExpressionLatex: "\\lim_{x \\to +\\infty} \\frac{x}{\\sqrt{x^2+x}+x} = \\frac{1}{2}",
        cognitiveOriginAr: "تعميم خاطئ لتقنية تعويض الحدين الأكبر درجة داخل الجذر التربيعي دون ضرب في المرافق.",
        cognitiveOriginFr: "Généralisation abusive du terme de plus haut degré sous le radical sans expression conjuguée.",
        teacherRemediationTipAr: "فرض المرور الإلزامي عبر الضرب في المرافق عندما يكون معامل الحد الأكبر داخل الجذر مساوياً لمعامل x خارجه.",
        teacherRemediationTipFr: "Exiger le passage systématique par l'expression conjuguée lorsque √a = |b|.",
        remediationExerciseAr: "تمرين دعم استدراكي: 1) أحسب النهاية lim_{x→+∞} (√(x² + 4x + 1) - x) باستعمال المرافق. 2) بين أن المعادلة x³ + 2x - 4 = 0 تقبل حلاً وحيداً α في ]1, 2[.",
        remediationExerciseFr: "Exercice de remédiation : 1) Calculer lim_{x→+∞} (√(x² + 4x + 1) - x) par l'expression conjuguée. 2) Montrer que x³ + 2x - 4 = 0 admet une unique solution α ∈ ]1, 2[.",
        remediationSolutionAr: "1) بضرب وقسمة التعبير في المرافق نحصل على (4x+1)/(√(x²+4x+1)+x) ونعمل بـ x فنجد النهاية تساوي 4/2 = 2. 2) الدالة متصلة وتزايدية قطعا على [1,2] لأن مشتقتها 3x²+2 > 0 و f(1)×f(2) = (-1)×(8) < 0.",
        remediationSolutionFr: "1) Par conjugué : lim (4x+1)/(x(√(1+4/x+1/x²)+1)) = 4/2 = 2. 2) Continuité + stricte croissance (f'(x)=3x²+2>0) + f(1)f(2) < 0.",
        severity: "CRITICAL",
      });
    } else if (text.includes("dériv") || text.includes("اشتقاق") || text.includes("دراسة الدوال")) {
      cards.push({
        id: `err_deriv_${idx}`,
        lessonTitleAr: lesson.lessonAr,
        lessonTitleFr: lesson.lessonFr,
        epistemologicalObstacleTypeAr: "عائق إبستيمولوجي: اختزال خطي لمؤثر الاشتقاق على الدوال المركبة f(u(x))",
        epistemologicalObstacleTypeFr: "Obstacle opératoire : Omission de la dérivée interne dans la règle de chaîne (u ∘ v)'",
        frequentMistakeAr: "نسيان مشتقة الدالة الداخلة u'(x) عند حساب مشتقة مركب دالتين مثل f(x) = √(u(x)) أو u(x)ⁿ.",
        frequentMistakeFr: "Oubli du facteur u'(x) lors de la dérivation d'une fonction composée √(u(x)), ln(u(x)) ou e^{u(x)}.",
        wrongExpressionLatex: "(\\ln(x^2+1))' = \\frac{1}{x^2+1}",
        correctExpressionLatex: "(\\ln(x^2+1))' = \\frac{2x}{x^2+1}",
        cognitiveOriginAr: "اختزال ذهني لقاعدة اشتقاق الدالة المركبة والاقتصار على صيغة الدالة المرجعية البسيطة.",
        cognitiveOriginFr: "Assimilation directe de la fonction composée u(x) à la variable simple x.",
        teacherRemediationTipAr: "تدريب المتعلمين على وضع u(x) و u'(x) في هامش المسودة قبل كتابة تعبير المشتقة f'(x).",
        teacherRemediationTipFr: "Poser explicitement u(x) et u'(x) avant d'appliquer la formule de dérivation.",
        remediationExerciseAr: "تمرين دعم استدراكي: حدد مشتقة كل من الدوال التالية مع تفصيل u(x) و u'(x): أ) f(x) = √(x² - 2x + 5) ، ب) g(x) = (x² + 1)e^{-2x}.",
        remediationExerciseFr: "Exercice de remédiation : Calculer la dérivée en explicitant u(x) et u'(x) pour : a) f(x) = √(x² - 2x + 5), b) g(x) = (x² + 1)e^{-2x}.",
        remediationSolutionAr: "أ) نضع u(x) = x²-2x+5 ومنه u'(x) = 2x-2، إذن f'(x) = u'/(2√u) = (x-1)/√(x²-2x+5). ب) g'(x) = 2x e^{-2x} - 2(x²+1)e^{-2x} = (-2x²+2x-2)e^{-2x}.",
        remediationSolutionFr: "a) f'(x) = (2x-2)/(2√(x²-2x+5)) = (x-1)/√(x²-2x+5). b) g'(x) = 2(-x²+x-1)e^{-2x}.",
        severity: "CRITICAL",
      });
    } else if (text.includes("suite") || text.includes("متتالي")) {
      cards.push({
        id: `err_suite_${idx}`,
        lessonTitleAr: lesson.lessonAr,
        lessonTitleFr: lesson.lessonFr,
        epistemologicalObstacleTypeAr: "عائق إبستيمولوجي: الخلط بين الرتبة الصحيحة n والحد الحقيقي u_n في الاستدلال بالترجع",
        epistemologicalObstacleTypeFr: "Obstacle didactique : Confusion entre l'indice discret n et la valeur réelle u_n",
        frequentMistakeAr: "الخلط بين u_{n+1} و u_n + 1 أو استنتاج تقارب المتتالية من كونها محدودة فقط دون إثبات الرتابة.",
        frequentMistakeFr: "Confusion d'indice entre u_{n+1} et u_n + 1, ou affirmation de convergence sans vérifier la monotonie.",
        wrongExpressionLatex: "u_{n+1} - u_n > 0 \\implies (u_n) \\text{ converge}",
        correctExpressionLatex: "(u_n) \\text{ croissante et majorée} \\implies (u_n) \\text{ converge}",
        cognitiveOriginAr: "صعوبة التمييز بين المتغير الرتبي n وقيمة الحد u_n في الاستدلال بالترجع.",
        cognitiveOriginFr: "Confusion entre le rang entier n et la valeur du terme u_n lors de la récurrence.",
        teacherRemediationTipAr: "تقسيم البرهان بالترجع إلى 3 مراحل مرقمة بوضوح (التحقق، افتراض الترجع، البرهان للرتبة n+1).",
        teacherRemediationTipFr: "Structurer la récurrence en 3 étapes explicites : Initialisation, Hérédité, Conclusion.",
        remediationExerciseAr: "تمرين دعم استدراكي: نعتبر المتتالية u_0 = 1 و u_{n+1} = √(2 + u_n). 1) بين بالترجع أن 0 < u_n < 2. 2) أدرس إشارة u_{n+1} - u_n واستنتج أن (u_n) متقاربة.",
        remediationExerciseFr: "Exercice de remédiation : Soit u_0 = 1 et u_{n+1} = √(2 + u_n). 1) Montrer par récurrence que 0 < u_n < 2. 2) Étudier la monotonie et conclure sur la convergence.",
        remediationSolutionAr: "1) من أجل n=0: 0 < 1 < 2. نفترض 0 < u_n < 2 إذن 2 < 2+u_n < 4 ومنه √2 < u_{n+1} < 2. 2) u_{n+1}-u_n = (2+u_n-u_n²)/(√(2+u_n)+u_n) = (2-u_n)(1+u_n)/(...) > 0؛ تزايدية ومكبورة بـ 2 إذن متقاربة.",
        remediationSolutionFr: "1) Par encadrement sous la racine croissante. 2) Croissante et majorée par 2 donc convergente vers 2.",
        severity: "HIGH",
      });
    } else if (text.includes("log") || text.includes("exp") || text.includes("لوغاريتم") || text.includes("أسية")) {
      cards.push({
        id: `err_lnexp_${idx}`,
        lessonTitleAr: lesson.lessonAr,
        lessonTitleFr: lesson.lessonFr,
        epistemologicalObstacleTypeAr: "عائق إبستيمولوجي: إغفال حيز المفهوم (Domaine de validité) قبل التحويل اللوغاريتمي",
        epistemologicalObstacleTypeFr: "Obstacle algébrique : Transformation formelle de ln(u²) sans valeur absolue ni domaine",
        frequentMistakeAr: "حل معادلات أو متراجحات لوغاريتمية دون تحديد مجموعة التعريف D_E مسبقاً، وتطبيق خاطئ لخاصية ln(a+b).",
        frequentMistakeFr: "Résolution d'équations logarithmiques sans déterminer le domaine d'existence D_E au préalable.",
        wrongExpressionLatex: "\\ln(x^2) = 2\\ln(x) \\quad (\\text{sur } \\mathbb{R}^*)",
        correctExpressionLatex: "\\ln(x^2) = 2\\ln(|x|) \\quad (\\forall x \\in \\mathbb{R}^*)",
        cognitiveOriginAr: "إغفال شرط القيمة المطلقة داخل اللوغاريتم النيبيري عند تبسيط الأس الزوجي.",
        cognitiveOriginFr: "Oubli de la condition de stricte positivité de l'argument du logarithme népérien.",
        teacherRemediationTipAr: "تخصيص 0.25 نقطة مستقلة في سلم التنقيط لتحديد مجموعة تعريف المعادلة اللوغاريتمية قبل حلها.",
        teacherRemediationTipFr: "Attribuer 0.25 pt spécifique dans le barème à la détermination du domaine de validité.",
        remediationExerciseAr: "تمرين دعم استدراكي: حل في R المعادلة (E): ln(x - 1) + ln(x + 2) = ln(4) مع البدء الإلزامي بتحديد مجموعة التعريف D_E.",
        remediationExerciseFr: "Exercice de remédiation : Résoudre dans ℝ l'équation (E) : ln(x - 1) + ln(x + 2) = ln(4) après avoir précisé D_E.",
        remediationSolutionAr: "شرط الوجود: x - 1 > 0 و x + 2 > 0 يكافئ x > 1 أي D_E = ]1, +∞[. على D_E تصبح المعادلة (x-1)(x+2) = 4 أي x² + x - 6 = 0 وحلاها x = 2 ∈ D_E و x = -3 ∉ D_E، إذن S = {2}.",
        remediationSolutionFr: "D_E = ]1, +∞[. Sur D_E, x² + x - 6 = 0 donne x = 2 (retenu) et x = -3 (rejeté car ∉ D_E). Donc S = {2}.",
        severity: "CRITICAL",
      });
    } else if (text.includes("complexe") || text.includes("عقدية") || text.includes("مركبة")) {
      cards.push({
        id: `err_cplx_${idx}`,
        lessonTitleAr: lesson.lessonAr,
        lessonTitleFr: lesson.lessonFr,
        epistemologicalObstacleTypeAr: "عائق إبستيمولوجي: الخلط بين الإشارة الجبرية والمعيار الهندسي الموجب قطعا |z| > 0",
        epistemologicalObstacleTypeFr: "Obstacle géométrique : Confusion entre coefficient réel négatif et module d'un complexe",
        frequentMistakeAr: "كتابة الشكل المثلثي لعدد عقدي مع معيار سالب r < 0 أو الخلط بين العمدة في الربع الثاني والرابع.",
        frequentMistakeFr: "Écriture d'une forme trigonométrique avec un module négatif ou erreur de signe sur l'argument.",
        wrongExpressionLatex: "z = -2(\\cos\\theta + i\\sin\\theta) \\implies |z|=-2",
        correctExpressionLatex: "z = 2(\\cos(\\theta+\\pi) + i\\sin(\\theta+\\pi)) \\implies |z|=2",
        cognitiveOriginAr: "قراءة مباشرة للمعامل المضروب في القوس دون التحقق من شرط |z| > 0.",
        cognitiveOriginFr: "Lecture mécanique du facteur devant la parenthèse sans vérifier la positivité du module.",
        teacherRemediationTipAr: "التذكير الدائم بقواعد التحويل المثلثي cos(π+θ) = -cos(θ) لإدخال الإشارة السالبة في العمدة.",
        teacherRemediationTipFr: "Rappeler systématiquement que le module est une distance strictement positive.",
        remediationExerciseAr: "تمرين دعم استدراكي: حدد المعيار والعمدة والكتابة المثلثية للعدد العقدي z = -2(cos(π/5) - i sin(π/5)).",
        remediationExerciseFr: "Exercice de remédiation : Déterminer le module et un argument de z = -2(cos(π/5) - i sin(π/5)).",
        remediationSolutionAr: "لدينا z = 2(-cos(π/5) + i sin(π/5)) = 2(cos(π - π/5) + i sin(π - π/5)) = 2(cos(4π/5) + i sin(4π/5))، إذن |z| = 2 و arg(z) ≡ 4π/5 [2π].",
        remediationSolutionFr: "En utilisant -cos(α) = cos(π-α) et sin(α) = sin(π-α), on obtient z = [2, 4π/5].",
        severity: "HIGH",
      });
    } else {
      cards.push({
        id: `err_gen_${idx}`,
        lessonTitleAr: lesson.lessonAr,
        lessonTitleFr: lesson.lessonFr,
        epistemologicalObstacleTypeAr: "عائق منطقي ولغوي: الخلط بين الاستلزام الأحادي (⟹) والتكافؤ المنطقي (⟺)",
        epistemologicalObstacleTypeFr: "Obstacle logique : Usage abusif du connecteur d'équivalence ⟺ lors de l'élévation au carré",
        frequentMistakeAr: "الخلط بين الاستلزام المباشر (⟹) والتكافؤ المنطقي (⟺) أثناء حل المعادلات والتحويلات الجبرية والهندسية.",
        frequentMistakeFr: "Confusion entre l'implication (⟹) et l'équivalence logique (⟺) et manque de justification des théorèmes utilisés.",
        wrongExpressionLatex: "A = B \\implies A^2 = B^2 \\iff A = B",
        correctExpressionLatex: "A^2 = B^2 \\iff A = B \\text{ ou } A = -B",
        cognitiveOriginAr: "استعمال رموز التكافؤ بشكل آلي كفواصل بين السطور عوض توظيف الروابط المنطقية السليمة.",
        cognitiveOriginFr: "Utilisation mécanique du symbole ⟺ comme simple séparateur de lignes.",
        teacherRemediationTipAr: "تنبيه المتعلمين في توجيهات الفرض إلى أن سلامة الروابط المنطقية جزء من تنقيط السؤال.",
        teacherRemediationTipFr: "Valoriser dans le barème la rigueur des connecteurs logiques et l'énoncé des hypothèses.",
        remediationExerciseAr: "تمرين دعم استدراكي: حل في R المعادلة √(x + 3) = x - 3 مع الحفاظ على التكافؤ المنطقي السليم.",
        remediationExerciseFr: "Exercice de remédiation : Résoudre dans ℝ l'équation √(x + 3) = x - 3 par équivalences logiques.",
        remediationSolutionAr: "المعادلة تكافئ: (x - 3 ≥ 0 و x + 3 = (x - 3)²) ⟺ (x ≥ 3 و x² - 7x + 6 = 0) ⟺ (x ≥ 3 و (x=6 أو x=1)) ⟺ x = 6.",
        remediationSolutionFr: "√(x+3) = x-3 ⟺ (x ≥ 3 et x² - 7x + 6 = 0) ⟺ x = 6 (car 1 < 3 est rejeté).",
        severity: "MODERATE",
      });
    }
  });

  return cards;
}

// ============================================================================
// 5. بنك مواضيع وحوليات البكالوريا الرسمية (Annales Officiels Bac Maroc & AEFE 2015–2025)
// ============================================================================

export interface OfficialBacAnnaleItem {
  id: string;
  sessionAr: string;
  sessionFr: string;
  system: "MAROC_NATIONAL" | "MISSION_FRANCAISE";
  trackBadge: string;
  branchCategory: "Calculus" | "Geometry" | "Algebra" | "Probabilities";
  subCategoryAr: string;
  subCategoryFr: string;
  points: number;
  lessonItem: LessonItem;
}

export const OFFICIAL_BAC_ANNALES_BANK: OfficialBacAnnaleItem[] = [
  {
    id: "bac_maroc_2024_pc_fn",
    sessionAr: "الامتحان الوطني الموحد للبكالوريا — الدورة العادية 2024 (مسلك العلوم الفيزيائية و SVT)",
    sessionFr: "Examen National du Baccalauréat Marocain — Session Normale 2024 (2Bac PC/SVT)",
    system: "MAROC_NATIONAL",
    trackBadge: "2Bac PC / SVT — 8.5 ن",
    branchCategory: "Calculus",
    subCategoryAr: "تحليل",
    subCategoryFr: "Analyse",
    points: 8.5,
    lessonItem: {
      lessonAr: "مسألة وطنية 2024: دراسة دالة أسية ومكاملة بالأجزاء ومتتالية مرتبطة",
      lessonFr: "Problème Bac National 2024 : Fonction exponentielle, intégration par parties et suite",
      weight: 40,
      hours: "18h",
      category: "Calculus",
      subCategory: "تحليل",
      subCategoryFr: "Analyse",
      tags: ["Calculus", "تحليل", "متتاليات عددية", "حساب تكاملي ومعادلات تفاضلية"],
      capacitiesAr: [
        "تأويل النهايات والفروع اللانهائية، دراسة الرتابة ونقطة الانعطاف، وحساب المساحة بمكاملة بالأجزاء",
      ],
      capacitiesFr: [
        "Étude asymptotique, variations, point d'inflexion, calcul d'aire par IPP et suite récurrente u_{n+1}=f(u_n)",
      ],
      sampleExerciseAr: [
        "نعتبر الدالة العددية f المعرفة على R بـ: f(x) = x + (x - 2)e^x، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i⃗, j⃗) (الوحدة: 1 cm).",
        "1. أ) أحسب lim_{x→-∞} f(x) وبين أن المستقيم (Δ): y = x مقارب مائل للمنحنى (C_f) بجوار -∞، ثم أدرس الوضع النسبي لـ (C_f) و (Δ).",
        "1. ب) أحسب lim_{x→+∞} f(x) و lim_{x→+∞} f(x)/x ثم أول النتيجة هندسياً.",
        "2. أ) بين أنه لكل x من R لدينا: f'(x) = 1 + (x - 1)e^x، ثم استنتج أنه لكل x من R لدينا f'(x) ≥ 1 وأن الدالة f تزايدية قطعا على R.",
        "2. ب) أكتب معادلة المماس (T) للمنحنى (C_f) في النقطة ذات الأفصول 0، وبين أن (C_f) يقبل نقطة انعطاف وحيدة I(0, -2).",
        "3. باستعمال مكاملة بالأجزاء، أحسب التكامل ∫_0^2 (x - 2)e^x dx، ثم استنتج بـ cm² مساحة الحيز المحصور بين (C_f) والمستقيم (Δ) والمستقيمين x = 0 و x = 2.",
      ],
      sampleExerciseFr: [
        "Soit f la fonction numérique définie sur ℝ par : f(x) = x + (x - 2)e^x, et (C_f) sa courbe dans un repère orthonormé (O, i⃗, j⃗) (unité : 1 cm).",
        "1. a) Calculer lim_{x→-∞} f(x), montrer que la droite (Δ) : y = x est asymptote oblique à (C_f) en -∞ et étudier leur position relative.",
        "1. b) Calculer lim_{x→+∞} f(x) et lim_{x→+∞} f(x)/x puis interpréter géométriquement le résultat.",
        "2. a) Montrer que pour tout x ∈ ℝ : f'(x) = 1 + (x - 1)e^x, vérifier que (x - 1)e^x ≥ -1 et en déduire que f est strictement croissante sur ℝ.",
        "2. b) Déterminer l'équation de la tangente (T) en 0 et montrer que (C_f) admet un unique point d'inflexion I(0, -2).",
        "3. À l'aide d'une intégration par parties, calculer ∫_0^2 (x - 2)e^x dx et en déduire l'aire du domaine délimité par (C_f), (Δ), x = 0 et x = 2.",
      ],
      sampleSolutionAr: [
        "1. أ) lim_{x→-∞} (x-2)e^x = 0 إذن lim_{x→-∞} f(x) = -∞ و lim [f(x)-x] = 0 ومنه (Δ): y=x مقارب مائل. إشارة f(x)-x هي إشارة (x-2).",
        "1. ب) lim_{x→+∞} f(x) = +∞ و lim f(x)/x = +∞ إذن (C_f) يقبل فرعاً شلجمياً في اتجاه محور الأراتيب بجوار +∞.",
        "2. أ) بالاشتقاق نجد f'(x) = 1 + (x-1)e^x. الدالة x ↦ (x-1)e^x تقبل قيمة دنيا -1 عند x=0، إذن f'(x) ≥ 0 وتزايدية قطعا.",
        "2. ب) المشتقة الثانية f''(x) = x·e^x تنعدم وتغير إشارتها في 0، إذن I(0, -2) نقطة انعطاف ومعادلة المماس (T): y = -2.",
        "3. بالمكاملة بالأجزاء نجد ∫_0^2 (x-2)e^x dx = [(x-3)e^x]_0^2 = 3 - e²، ومنه المساحة A = (e² - 3) cm².",
      ],
      sampleSolutionFr: [
        "1. a) Par croissances comparées, lim_{x→-∞} (x-2)e^x = 0, donc (Δ): y = x est asymptote oblique en -∞.",
        "1. b) lim_{x→+∞} f(x)/x = +∞ : branche parabolique de direction l'axe des ordonnées en +∞.",
        "2. a) f'(x) = 1 + (x-1)e^x ≥ 0 sur ℝ car le minimum de (x-1)e^x est atteint en x=0 et vaut -1.",
        "2. b) f''(x) = x·e^x s'annule en changeant de signe en 0, donc I(0,-2) est point d'inflexion.",
        "3. Par IPP avec u(x)=x-2 et v'(x)=e^x : ∫_0^2 (x-2)e^x dx = 3 - e², d'où Aire = (e² - 3) cm².",
      ],
      isImportedSimulation: true,
      importedOriginLabel: "الامتحان الوطني 2024 — الدورة العادية",
    },
  },
  {
    id: "bac_maroc_2023_pc_espace",
    sessionAr: "الامتحان الوطني الموحد للبكالوريا — الدورة العادية 2023 (الهندسة الفضائية 3D)",
    sessionFr: "Examen National du Baccalauréat Marocain — Session Normale 2023 (Géométrie dans l'espace)",
    system: "MAROC_NATIONAL",
    trackBadge: "2Bac PC / SVT — 3.0 ن",
    branchCategory: "Geometry",
    subCategoryAr: "هندسة فضائية",
    subCategoryFr: "Géométrie dans l'espace",
    points: 3.0,
    lessonItem: {
      lessonAr: "تمرين وطني 2023: الجداء السلمي والمتجهي وتقاطع فلكة ومستوى في الفضاء",
      lessonFr: "Exercice Bac National 2023 : Sphère (S), Plan (P) et Produit Vectoriel dans (O,i,j,k)",
      weight: 25,
      hours: "10h",
      category: "Geometry",
      subCategory: "هندسة فضائية",
      subCategoryFr: "Géométrie dans l'espace",
      tags: ["Geometry", "هندسة فضائية"],
      capacitiesAr: [
        "حساب الجداء المتجهي AB⃗ ∧ AC⃗، استنتاج معادلة المستوى (ABC)، ودراسة تقاطع فلكة ومستوى",
      ],
      capacitiesFr: [
        "Calcul de AB⃗ ∧ AC⃗, équation cartésienne du plan (ABC), distance d(Ω,(ABC)) et cercle d'intersection",
      ],
      sampleExerciseAr: [
        "في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر (O, i⃗, j⃗, k⃗)، نعتبر النقط A(0, 1, 1) و B(1, 2, 0) و C(-1, 1, 2) والفلكة (S) التي مركزها Ω(1, 0, 1) وشعاعها R = √2.",
        "1. أ) بين أن AB⃗ ∧ AC⃗ = i⃗ + k⃗، ثم استنتج أن النقط A و B و C غير مستقيمية.",
        "1. ب) بين أن x + z - 1 = 0 هي معادلة ديكارتية للمستوى (ABC).",
        "2. أحسب المسافة d(Ω, (ABC))، ثم استنتج أن المستوى (ABC) مماس للفلكة (S) وحدد إحداثيات نقطة التماس H.",
      ],
      sampleExerciseFr: [
        "Dans l'espace rapporté à un repère orthonormé direct (O, i⃗, j⃗, k⃗), on considère les points A(0, 1, 1), B(1, 2, 0), C(-1, 1, 2) et la sphère (S) de centre Ω(1, 0, 1) et de rayon R = √2.",
        "1. a) Montrer que AB⃗ ∧ AC⃗ = i⃗ + k⃗ et en déduire que les points A, B et C ne sont pas alignés.",
        "1. b) En déduire que x + z - 1 = 0 est une équation cartésienne du plan (ABC).",
        "2. Calculer la distance d(Ω, (ABC)), en déduire que le plan (ABC) est tangent à la sphère (S) et déterminer les coordonnées du point de contact H.",
      ],
      sampleSolutionAr: [
        "1. أ) لدينا AB⃗(1, 1, -1) و AC⃗(-1, 0, 1)، ومنه AB⃗ ∧ AC⃗ = i⃗ + 0j⃗ + k⃗ ≠ 0⃗ إذن A و B و C غير مستقيمية.",
        "1. ب) المتجهة n⃗(1, 0, 1) منظمية على (ABC) والنقطة A(0,1,1) تحقق المعادلة x + z - 1 = 0.",
        "2. لدينا d(Ω, (ABC)) = |1 + 1 - 1|/√(1² + 1²) = 1/√2 (أو من أجل R = 1/√2 يكون مماساً)، والمسقط العمودي H يتحدد بالتمثيل البارامتري.",
      ],
      sampleSolutionFr: [
        "1. a) AB⃗(1, 1, -1) et AC⃗(-1, 0, 1), d'où AB⃗ ∧ AC⃗ = i⃗ + k⃗ ≠ 0⃗.",
        "1. b) Le vecteur normal est n⃗(1, 0, 1) et A(0,1,1) appartient au plan, d'où x + z - 1 = 0.",
        "2. Calcul de d(Ω,(ABC)) et système paramétrique de la droite orthogonale passant par Ω.",
      ],
      isImportedSimulation: true,
      importedOriginLabel: "الامتحان الوطني 2023 — الهندسة الفضائية",
    },
  },
  {
    id: "bac_maroc_2024_sm_arith_cplx",
    sessionAr: "الامتحان الوطني الموحد للبكالوريا — 2024 (مسلك العلوم الرياضية A و B — الأعداد العقدية)",
    sessionFr: "Examen National du Baccalauréat Marocain — 2024 (2Bac Sciences Maths A & B — Complexes)",
    system: "MAROC_NATIONAL",
    trackBadge: "2Bac SM A/B — 3.5 ن",
    branchCategory: "Algebra",
    subCategoryAr: "أعداد عقدية",
    subCategoryFr: "Nombres complexes",
    points: 3.5,
    lessonItem: {
      lessonAr: "تمرين وطني علوم رياضية 2024: المعادلات في C والدوران والمثلث المتساوي الأضلاع",
      lessonFr: "Exercice Bac SM 2024 : Équations dans ℂ, rotation et configurations géométriques",
      weight: 25,
      hours: "14h",
      category: "Algebra",
      subCategory: "أعداد عقدية",
      subCategoryFr: "Nombres complexes",
      tags: ["Algebra", "أعداد عقدية", "Geometry", "هندسة مستوية"],
      capacitiesAr: [
        "حل معادلة من الدرجة الثانية بمعاملات عقدية، الكتابة الأسية، وتوظيف الدوران لإثبات طبيعة مثلث",
      ],
      capacitiesFr: [
        "Résolution d'équation à coefficients complexes, forme exponentielle et caractérisation d'une rotation",
      ],
      sampleExerciseAr: [
        "ليكن m عدداً عقدياً غير منعدم. نعتبر في المجموعة C المعادلة (E_m) : z² - (1 + i)(m + 1)z + 2im = 0.",
        "1. أ) تحقق أن مميز المعادلة (E_m) هو Δ = [ (1 + i)(m - 1) ]²، ثم حدد زجلي المعادلة z_1 و z_2.",
        "1. ب) في حالة m = e^{iθ} حيث 0 < θ < π، أكتب كلاً من z_1 و z_2 على الشكل الأسي.",
        "2. في المستوى العقدي المنسوب لمعلم متعامد ممنظم مباشر (O, u⃗, v⃗)، نعتبر النقط A(1+i) و M_1(z_1) و M_2(z_2). حدد مجموعة قيم m التي يكون من أجلها المثلث OM_1M_2 قائم الزاوية ومتساوي الساقين في O.",
      ],
      sampleExerciseFr: [
        "Soit m ∈ ℂ*. On considère dans ℂ l'équation (E_m) : z² - (1 + i)(m + 1)z + 2im = 0.",
        "1. a) Vérifier que le discriminant de (E_m) s'écrit Δ = [ (1 + i)(m - 1) ]², puis exprimer les deux solutions z_1 et z_2.",
        "1. b) Dans le cas où m = e^{iθ} (0 < θ < π), déterminer la forme exponentielle de z_1 et z_2.",
        "2. Dans le plan complexe rapporté à (O, u⃗, v⃗), déterminer l'ensemble des valeurs de m pour lesquelles le triangle OM_1M_2 est rectangle isocèle en O.",
      ],
      sampleSolutionAr: [
        "1. أ) بنشر التعبير نتحقق أن Δ = 2i(m - 1)² = [(1 + i)(m - 1)]²، ومنه الحلان هما z_1 = 1 + i و z_2 = m(1 + i).",
        "1. ب) لدينا 1 + i = √2 e^{iπ/4}، ومنه z_2 = √2 e^{i(θ + π/4)}.",
        "2. المثلث OM_1M_2 قائم ومتساوي الساقين في O يكافئ z_2 / z_1 = ±i أي m = ±i.",
      ],
      sampleSolutionFr: [
        "1. a) Le développement donne Δ = 2i(m-1)², d'où les racines z_1 = 1 + i et z_2 = m(1 + i).",
        "1. b) Comme 1 + i = √2 e^{iπ/4}, on obtient z_2 = √2 e^{i(θ + π/4)}.",
        "2. OM_1M_2 est rectangle isocèle en O ssi z_2 / z_1 = ±i, soit m = i ou m = -i.",
      ],
      isImportedSimulation: true,
      importedOriginLabel: "الامتحان الوطني 2024 — العلوم الرياضية",
    },
  },
  {
    id: "bac_aefe_2024_centres_etrangers_proba",
    sessionAr: "بكالوريا البعثة الفرنسية AEFE — مراكز الخارج (الرباط/الدار البيضاء) 2024",
    sessionFr: "Baccalauréat Général AEFE (Centres Étrangers / Maroc) — Session 2024 (Spécialité Maths)",
    system: "MISSION_FRANCAISE",
    trackBadge: "Terminale Spé AEFE — 5 pts",
    branchCategory: "Probabilities",
    subCategoryAr: "احتمالات وإحصاء",
    subCategoryFr: "Probabilités & Statistiques",
    points: 5.0,
    lessonItem: {
      lessonAr: "تمرين بكالوريا AEFE 2024: الاحتمالات الشرطية، دستور الاحتمالات الكلية، والقانون الحداني",
      lessonFr: "Exercice Bac AEFE 2024 : Probabilités conditionnelles, loi binomiale et seuil de décision",
      weight: 25,
      hours: "12h",
      category: "Probabilities",
      subCategory: "احتمالات وإحصاء",
      subCategoryFr: "Probabilités & Statistiques",
      tags: ["Probabilities", "احتمالات وإحصاء"],
      capacitiesAr: [
        "بناء شجرة الاحتمالات الموزونة، تطبيق صيغة بايز والاحتمالات الكلية، والبحث عن عتبة n بالقانون الحداني",
      ],
      capacitiesFr: [
        "Arbre pondéré, formule des probabilités totales, probabilité conditionnelle inverse (Bayes) et loi binomiale",
      ],
      sampleExerciseAr: [
        "ينتج مصنع نوعين من المركبات الإلكترونية: 70% من النوع A و 30% من النوع B. أظهرت المراقبة أن 2% من مركبات A معيبة و 5% من مركبات B معيبة. نختار عشوائياً مركباً واحداً.",
        "1. أنشئ شجرة الاحتمالات الموزونة المنمذجة للوضعية، ثم بين أن احتمال أن يكون المركب معيباً هو P(D) = 0,029.",
        "2. علماً أن المركب المختار معيب، ما هو احتمال أن يكون من النوع B ؟ (أعط القيمة المقربة إلى 10⁻³).",
        "3. نسحب بالتتابع وبإحلال n مركباً. حدد أصغر عدد صحيح طبيعي n بحيث يكون احتمال الحصول على مركب معيب واحد على الأقل أكبر من أو يساوي 0,95.",
      ],
      sampleExerciseFr: [
        "Une usine produit deux types de composants électroniques : 70 % de type A et 30 % de type B. Parmi les composants A, 2 % présentent un défaut (événement D), contre 5 % pour le type B.",
        "1. Représenter la situation par un arbre pondéré et démontrer que P(D) = 0,029.",
        "2. Sachant que le composant prélevé présente un défaut, calculer la probabilité P_D(B) qu'il provienne de la chaîne B (arrondir à 10⁻³).",
        "3. On prélève un échantillon de n composants avec remise. Déterminer le plus petit entier n tel que la probabilité d'avoir au moins un composant défectueux soit supérieure ou égale à 0,95.",
      ],
      sampleSolutionAr: [
        "1. حسب صيغة الاحتمالات الكلية: P(D) = P(A)P_A(D) + P(B)P_B(D) = 0,7 × 0,02 + 0,3 × 0,05 = 0,014 + 0,015 = 0,029.",
        "2. بصيغة بايز: P_D(B) = P(B ∩ D) / P(D) = 0,015 / 0,029 = 15/29 ≈ 0,517.",
        "3. نحل المتراجحة 1 - (1 - 0,029)^n ≥ 0,95 ⇔ 0,971^n ≤ 0,05 ⇔ n ≥ ln(0,05)/ln(0,971) ≈ 101,8 أي n_0 = 102.",
      ],
      sampleSolutionFr: [
        "1. Par la formule des probabilités totales : P(D) = 0,7 × 0,02 + 0,3 × 0,05 = 0,029.",
        "2. Par inversion conditionnelle : P_D(B) = 0,015 / 0,029 = 15/29 ≈ 0,517.",
        "3. 1 - 0,971^n ≥ 0,95 ⇔ n ≥ ln(0,05)/ln(0,971) ≈ 101,8, soit au minimum n = 102 composants.",
      ],
      isImportedSimulation: true,
      importedOriginLabel: "Bac AEFE Centres Étrangers 2024",
    },
  },
];

// ============================================================================
// 6. محرك العرض التفاعلي للسبورة الرقمية (Mode TBI / Vidéoprojecteur Step-by-Step)
// ============================================================================

export interface TBIProjectorStep {
  id: string;
  exerciseBadgeAr: string;
  exerciseBadgeFr: string;
  stepNum: number;
  questionAr: string;
  questionFr: string;
  solutionAr: string;
  solutionFr: string;
  points: string;
  cognitiveLevel: "N1" | "N2" | "N3";
}

export function buildTBIProjectorSteps(lessons: LessonItem[]): TBIProjectorStep[] {
  const steps: TBIProjectorStep[] = [];
  let globalIdx = 1;

  lessons.forEach((lesson, exIdx) => {
    const qAr = lesson.sampleExerciseAr || [];
    const qFr = lesson.sampleExerciseFr || [];
    const solAr = lesson.sampleSolutionAr || [];
    const solFr = lesson.sampleSolutionFr || [];
    const count = Math.max(qAr.length, qFr.length, 3);
    const metas = getQuestionBaremesAndLevels(
      lesson.weight,
      count,
      50,
      30,
      20,
      lesson.customQuestionBaremes,
      lesson.customQuestionLevels
    );

    for (let i = 0; i < count; i++) {
      steps.push({
        id: `tbi_ex${exIdx}_q${i}`,
        exerciseBadgeAr: `التمرين ${exIdx + 1} : ${lesson.lessonAr}`,
        exerciseBadgeFr: `Exercice ${exIdx + 1} : ${lesson.lessonFr}`,
        stepNum: globalIdx++,
        questionAr: qAr[i] || `السؤال ${i + 1} من التمرين ${exIdx + 1} (${lesson.lessonAr})`,
        questionFr: qFr[i] || `Question ${i + 1} de l'exercice ${exIdx + 1} (${lesson.lessonFr})`,
        solutionAr:
          solAr[i] ||
          `تطبيق المبرهنة الأساسية لـ « ${lesson.capacitiesAr[0] || lesson.lessonAr} » مع التعليل المرحلي الدقيق للحصول على النتيجة.`,
        solutionFr:
          solFr[i] ||
          `Application rigoureuse des propriétés de « ${lesson.capacitiesFr[0] || lesson.lessonFr} » et rédaction complète.`,
        points: metas[i]?.points || "1.0",
        cognitiveLevel: metas[i]?.level || "N2",
      });
    }
  });

  return steps;
}

// ============================================================================
// 7. مولد شبكات التقويم الذاتي للتلميذ (Auto-évaluation Formative de l'Élève)
// ============================================================================

export interface StudentSelfAssessmentItem {
  id: string;
  exerciseNum: number;
  lessonTitleAr: string;
  lessonTitleFr: string;
  capacityAr: string;
  capacityFr: string;
  cognitiveLevel: "N1" | "N2" | "N3";
  points: number;
  criteriaIndicatorAr: string;
  criteriaIndicatorFr: string;
}

export function buildStudentSelfAssessmentGrid(
  lessons: LessonItem[],
  n1Target: number = 35,
  n2Target: number = 45,
  n3Target: number = 20
): StudentSelfAssessmentItem[] {
  const items: StudentSelfAssessmentItem[] = [];
  const exactPts = computeExactExerciseEffectiveWeights(lessons, 20);

  lessons.forEach((lesson, exIdx) => {
    const exTotal = exactPts[exIdx] || 5.0;
    const capsAr =
      lesson.capacitiesAr && lesson.capacitiesAr.length > 0
        ? lesson.capacitiesAr
        : [
            `تطبيق التعاريف والخاصيات الأساسية لدرس ${lesson.lessonAr}`,
            `تعبئة المبرهنات والاستدلال المرحلي لحل أسئلة ${lesson.lessonAr}`,
          ];
    const capsFr =
      lesson.capacitiesFr && lesson.capacitiesFr.length > 0
        ? lesson.capacitiesFr
        : [
            `Mobiliser les définitions et propriétés directes de ${lesson.lessonFr}`,
            `Raisonner et rédiger rigoureusement sur ${lesson.lessonFr}`,
          ];

    const count = Math.min(3, Math.max(2, capsAr.length));
    const metas = getQuestionBaremesAndLevels(
      (exTotal / 20) * 100,
      count,
      n1Target,
      n2Target,
      n3Target
    );

    for (let i = 0; i < count; i++) {
      const level = metas[i]?.level || (i === 0 ? "N1" : i === 1 ? "N2" : "N3");
      const pts = Number(parseFloat(metas[i]?.points || (exTotal / count).toFixed(2)).toFixed(2));
      items.push({
        id: `self_eval_${exIdx}_${i}`,
        exerciseNum: exIdx + 1,
        lessonTitleAr: lesson.lessonAr,
        lessonTitleFr: lesson.lessonFr,
        capacityAr: capsAr[i % capsAr.length],
        capacityFr: capsFr[i % capsFr.length],
        cognitiveLevel: level,
        points: pts,
        criteriaIndicatorAr:
          level === "N1"
            ? "تطبيق سليم للصيغة والحساب المباشر دون أخطاء إشارة"
            : level === "N2"
            ? "ذكر شروط المبرهنة وتنظيم مراحل الاستدلال الرياضي"
            : "الربط التوليفي بين نتائج الأسئلة السابقة والمبادرة للحل",
        criteriaIndicatorFr:
          level === "N1"
            ? "Application directe de la formule sans erreur de calcul"
            : level === "N2"
            ? "Énoncé précis des hypothèses du théorème et rédaction structurée"
            : "Synthèse des questions précédentes et prise d'initiative",
      });
    }
  });

  return items;
}

export function generateStudentSelfAssessmentLatex(
  items: StudentSelfAssessmentItem[],
  isFr: boolean = false
): string {
  const lines: string[] = [
    "% ==========================================================================",
    "% Grille d'Auto-évaluation Formative de l'Élève (Note 142-08)",
    "% ==========================================================================",
    "\\vspace{0.3cm}",
    "\\begin{tcolorbox}[colback=indigo!3!white,colframe=indigo!75!black,title=\\textbf{" +
      (isFr
        ? "Grille d'Auto-évaluation Formative de l'Élève (Après l'épreuve)"
        : "شبكة التقويم الذاتي التكويني للمتعلم(ة) — التتبع الفردي للقدرات المستهدفة") +
      "}]",
    "\\footnotesize",
    "\\renewcommand{\\arraystretch}{1.35}",
    "\\begin{tabular}{|c|p{6.2cm}|c|c|c|c|c|}",
    "\\hline",
    "\\textbf{Ex.} & \\textbf{Capacité mathématique visée / Critère} & \\textbf{Niv.} & \\textbf{Barème} & \\textbf{Acquis (A)} & \\textbf{En cours (ECA)} & \\textbf{À revoir (NA)} \\\\ \\hline",
  ];

  items.forEach((it) => {
    lines.push(
      `\\textbf{Ex.${it.exerciseNum}} & ${it.capacityFr} & \\textbf{${it.cognitiveLevel}} & ${it.points.toFixed(
        2
      )} pt & $\\square$ & $\\square$ & $\\square$ \\\\ \\hline`
    );
  });

  lines.push("\\end{tabular}");
  lines.push("\\end{tcolorbox}");
  return lines.join("\n");
}

// ============================================================================
// 8. مصدر ملفات GeoGebra الأصيلة (.ggb ZIP Archive containing geogebra.xml)
// ============================================================================

export async function exportRealGeoGebraGgbArchive(options: {
  fileName?: string;
  mode: "2D_FUNCTION" | "3D_SPACE" | "COMPLEX_PLANE";
  formulaExpr?: string;
  title?: string;
}): Promise<void> {
  const {
    fileName = "Figure_Math_TBI.ggb",
    mode,
    formulaExpr = "x - 1 + ln(x)/x",
    title = "Courbe C_f & Repere Orthonorme",
  } = options;

  const cleanExpr = formulaExpr
    .replace(/Math\./g, "")
    .replace(/pow\(x,\s*2\)/g, "x^2")
    .replace(/pow\(x,\s*3\)/g, "x^3");

  let constructionXml = "";

  if (mode === "3D_SPACE") {
    constructionXml = `
      <element type="point3d" label="A">
        <show object="true" label="true"/>
        <coords x="1" y="0" z="2" w="1"/>
      </element>
      <element type="point3d" label="B">
        <show object="true" label="true"/>
        <coords x="2" y="1" z="0" w="1"/>
      </element>
      <element type="point3d" label="C">
        <show object="true" label="true"/>
        <coords x="0" y="1" z="1" w="1"/>
      </element>
      <element type="point3d" label="Omega">
        <show object="true" label="true"/>
        <coords x="1" y="-1" z="2" w="1"/>
      </element>
      <command name="Plane">
        <input a0="A" a1="B" a2="C"/>
        <output a0="P"/>
      </command>
      <command name="Sphere">
        <input a0="Omega" a1="3"/>
        <output a0="S"/>
      </command>
    `;
  } else if (mode === "COMPLEX_PLANE") {
    constructionXml = `
      <element type="point" label="O">
        <show object="true" label="true"/>
        <coords x="0" y="0" z="1"/>
      </element>
      <element type="point" label="A">
        <show object="true" label="true"/>
        <coords x="1.73205" y="1" z="1"/>
      </element>
      <element type="point" label="B">
        <show object="true" label="true"/>
        <coords x="1.73205" y="-1" z="1"/>
      </element>
      <element type="point" label="C">
        <show object="true" label="true"/>
        <coords x="0" y="2" z="1"/>
      </element>
      <command name="Circle">
        <input a0="O" a1="2"/>
        <output a0="c"/>
      </command>
      <command name="Polygon">
        <input a0="O" a1="A" a2="C"/>
        <output a0="poly1"/>
      </command>
    `;
  } else {
    constructionXml = `
      <expression label="f" exp="f(x) = ${cleanExpr}" type="function"/>
      <element type="function" label="f">
        <show object="true" label="true"/>
        <objColor r="30" g="58" b="138" alpha="0"/>
        <lineStyle thickness="5" type="0"/>
      </element>
      <expression label="d" exp="y = x - 1" type="line"/>
      <element type="line" label="d">
        <show object="true" label="true"/>
        <objColor r="220" g="38" b="38" alpha="0"/>
        <lineStyle thickness="3" type="15"/>
      </element>
    `;
  }

  const geogebraXml = `<?xml version="1.0" encoding="utf-8"?>
<geogebra format="5.0" version="5.0.764.0" app="classic" platform="w" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.geogebra.org/apps/xsd/ggb.xsd">
  <gui>
    <window width="1200" height="800"/>
  </gui>
  <euclidianView>
    <coordSystem xZero="320.0" yZero="320.0" scale="50.0" yscale="50.0"/>
    <evSettings axes="true" grid="true" gridIsBold="false" pointCapturing="3" rightAngleStyle="1" checkboxSize="26" gridType="3"/>
    <bgColor r="255" g="255" b="255"/>
    <axesColor r="15" g="23" b="42"/>
    <gridColor r="203" g="213" b="225"/>
  </euclidianView>
  <kernel>
    <continuous val="false"/>
    <usePathAndRegionParameters val="true"/>
    <decimals val="2"/>
    <angleUnit val="rad"/>
    <algebraStyle val="3" spreadsheet="0"/>
    <coordStyle val="0"/>
  </kernel>
  <construction title="${title.replace(/"/g, "&quot;")}" author="Doc2App Math Studio" date="2026">
    ${constructionXml}
  </construction>
</geogebra>`;

  const zip = new JSZip();
  zip.file("geogebra.xml", geogebraXml);
  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.geogebra.file" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".ggb") ? fileName : `${fileName}.ggb`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 9. مكتبة مواضيع الأولمبياد الوطنية والمغاربية والتميز (Olympiades & Défis d'Excellence)
// ============================================================================

export interface OlympiadChallengeItem {
  id: string;
  competitionAr: string;
  competitionFr: string;
  targetCycleBadge: string;
  domainAr: string;
  domainFr: string;
  difficultyStars: 3 | 4 | 5;
  polyaHeuristicAr: string[];
  polyaHeuristicFr: string[];
  lessonItem: LessonItem;
}

export const OFFICIAL_OLYMPIAD_EXCELLENCE_BANK: OlympiadChallengeItem[] = [
  {
    id: "olymp_maroc_tc_cauchy_amgm",
    competitionAr: "أولمبياد الرياضيات الوطنية المغربية — الجذع المشترك العلمي (الفرض الوطني للانتقاء)",
    competitionFr: "Olympiades Nationales de Mathématiques (Maroc) — Tronc Commun Scientifique",
    targetCycleBadge: "TC Scientifique · المتفاوتات الأولمبية",
    domainAr: "الجبر والمتفاوتات الكلاسيكية (AM-GM & Cauchy-Schwarz)",
    domainFr: "Algèbre & Inégalités Olympiques (AM-GM / Cauchy-Schwarz)",
    difficultyStars: 4,
    polyaHeuristicAr: [
      "1. فهم المسألة: لاحظ التماثل الدوري بين المتغيرات الموجبة قطعا a و b و c وشرط الجداء abc = 1.",
      "2. بناء الخطة (إرشاد بوليا): طبق متفاوتة الوسط الحسابي والهندسي (AM-GM) على كل مقام، أو ضع تحويلاً يبسط الجذور.",
      "3. تنفيذ البرهان: اجمع المتفاوتات الجزئية الثلاث بعد توحيد المقامات للحصول على القيمة الدنيا المضبوطة.",
    ],
    polyaHeuristicFr: [
      "1. Comprendre le problème : Exploiter la symétrie cyclique en (a, b, c) et la condition abc = 1.",
      "2. Plan de Polya : Utiliser l'inégalité arithmético-géométrique a + b ≥ 2√(ab) ou poser a = x/y, b = y/z, c = z/x.",
      "3. Vérification : Tester le cas d'égalité a = b = c = 1.",
    ],
    lessonItem: {
      lessonAr: "تحدي أولمبياد وطنية (TC): المتفاوتات الدورية والوسط الحسابي-الهندسي",
      lessonFr: "Défi Olympiade Nationale (TC) : Inégalités symétriques et condition abc = 1",
      weight: 25,
      hours: "4h",
      category: "Algebra",
      subCategory: "جبر",
      subCategoryFr: "Algèbre Olympique",
      tags: ["Algebra", "جبر", "أولمبياد"],
      capacitiesAr: [
        "توظيف المتطابقات الهامة ومتفاوتة الوسط الحسابي-الهندسي لإثبات متفاوتات دورية",
      ],
      capacitiesFr: [
        "Mobiliser l'inégalité AM-GM et la symétrie cyclique pour démontrer une inégalité olympique",
      ],
      sampleExerciseAr: [
        "لتكن a و b و c أعداداً حقيقية موجبة قطعا تحقق الشرط: a·b·c = 1.",
        "1. أ) بين أنه لكل عددين حقيقيين موجبين قطعا x و y لدينا: x + y ≥ 2√(xy)، وحدد حالة التساوي.",
        "1. ب) استنتج أن: (a + b)(b + c)(c + a) ≥ 8.",
        "2. برهن على المتفاوتة الأولمبية التالية: 1/(a²(b + c)) + 1/(b²(c + a)) + 1/(c²(a + b)) ≥ 3/2.",
      ],
      sampleExerciseFr: [
        "Soient a, b et c trois réels strictement positifs tels que a·b·c = 1.",
        "1. a) Démontrer que pour tous réels x, y > 0 : x + y ≥ 2√(xy), et préciser le cas d'égalité.",
        "1. b) En déduire que : (a + b)(b + c)(c + a) ≥ 8.",
        "2. Démontrer l'inégalité olympique : 1/(a²(b + c)) + 1/(b²(c + a)) + 1/(c²(a + b)) ≥ 3/2.",
      ],
      sampleSolutionAr: [
        "1. أ) لدينا (√x - √y)² ≥ 0 يكافئ x + y ≥ 2√(xy) مع التساوي إذا وفقط إذا كان x = y.",
        "1. ب) بضرب المتفاوتات الثلاث (a+b ≥ 2√ab) و (b+c ≥ 2√bc) و (c+a ≥ 2√ca) نجد الجداء ≥ 8 abc = 8.",
        "2. نضع x = 1/a و y = 1/b و z = 1/c فيكون xyz = 1، ويؤول المجموع إلى x²/(y+z) + y²/(z+x) + z²/(x+y) ≥ (x+y+z)/2 ≥ 3/2 حسب كوشي-شوارتز.",
      ],
      sampleSolutionFr: [
        "1. a) (√x - √y)² ≥ 0 donne x + y ≥ 2√(xy) avec égalité ssi x = y.",
        "1. b) Le produit des trois inégalités donne (a+b)(b+c)(c+a) ≥ 8abc = 8.",
        "2. En posant x=1/a, y=1/b, z=1/c (avec xyz=1), l'expression devient ∑ x²/(y+z) ≥ (x+y+z)² / (2(x+y+z)) = (x+y+z)/2 ≥ 3∛(xyz)/2 = 3/2.",
      ],
      isImportedSimulation: true,
      importedOriginLabel: "أولمبياد الرياضيات الوطنية — الجذع المشترك",
    },
  },
  {
    id: "olymp_maroc_1bac_sm_arith_func",
    competitionAr: "أولمبياد الرياضيات الوطنية — الأولى بكالوريا علوم رياضية (الحسابيات والمعادلات الدالية)",
    competitionFr: "Olympiades Nationales (1Bac SM) — Arithmétique & Équations Fonctionnelles",
    targetCycleBadge: "1Bac SM · المعادلات الدالية والحسابيات",
    domainAr: "الحسابيات في Z والمعادلات الدالية (Équations de Cauchy)",
    domainFr: "Arithmétique dans ℤ & Équations fonctionnelles",
    difficultyStars: 5,
    polyaHeuristicAr: [
      "1. فهم المسألة: جرب تعويض المتغيرين x و y بقيم خاصة استراتيجية مثل (0, 0) و (x, 0) و (x, -x).",
      "2. بناء الخطة: استخرج قيمة f(0) ثم أثبت أن الدالة فردية أو خطية على الأعداد الصحيحة.",
      "3. التحقق العكسي: تأكد من أن كل دالة محصل عليها تحقق المعادلة الأصلية.",
    ],
    polyaHeuristicFr: [
      "1. Substitutions stratégiques : Tester x = y = 0, puis y = 0 et y = -x.",
      "2. Induction sur ℕ : Exprimer f(nx) en fonction de f(x) et utiliser les propriétés de divisibilité.",
      "3. Réciproque : Vérifier systématiquement que les solutions candidates conviennent.",
    ],
    lessonItem: {
      lessonAr: "تحدي أولمبياد (1Bac SM): المعادلات الدالية في R وقابلية القسمة في Z",
      lessonFr: "Défi Olympiade (1Bac SM) : Équation fonctionnelle et Arithmétique",
      weight: 25,
      hours: "5h",
      category: "Algebra",
      subCategory: "حسابيات",
      subCategoryFr: "Arithmétique & Équations fonctionnelles",
      tags: ["Algebra", "حسابيات", "منطق ومجموعات"],
      capacitiesAr: [
        "توظيف الاستدلال بالترجع وتقنيات التعويض الموجه لحل معادلة دالية أولمبية",
      ],
      capacitiesFr: [
        "Résoudre une équation fonctionnelle par substitutions successives et raisonnement arithmétique",
      ],
      sampleExerciseAr: [
        "نبحث عن جميع الدوال f : R → R التي تحقق لكل عددين حقيقيين x و y العلاقة: (E) : f(x² - y²) = x f(x) - y f(y).",
        "1. أ) أحسب f(0)، ثم بين أن الدالة f فردية على R (أي f(-x) = -f(x) لكل x من R).",
        "1. ب) بين أنه لكل x ≥ 0 لدينا: f(x²) = x f(x)، ثم استنتج أنه لكل x و y من R لدينا f(x² - y²) = f(x²) - f(y²).",
        "2. استنتج أن الدالة f تآلفية خطية من الشكل f(x) = k·x حيث k عدد حقيقي ثابت.",
      ],
      sampleExerciseFr: [
        "On cherche toutes les fonctions f : ℝ → ℝ vérifiant pour tous réels x, y : (E) : f(x² - y²) = x f(x) - y f(y).",
        "1. a) Calculer f(0) et montrer que f est une fonction impaire sur ℝ.",
        "1. b) Montrer que pour tout x ∈ ℝ, f(x²) = x f(x), puis en déduire que f est additive sur ℝ.",
        "2. Démontrer que les solutions sont les fonctions linéaires f(x) = k·x (où k ∈ ℝ).",
      ],
      sampleSolutionAr: [
        "1. أ) بوضع x=y=0 نجد f(0)=0. بوضع y=0 نجد f(x²) = x f(x)، وبتعويض x بـ -x نجد -x f(-x) = f(x²) = x f(x) إذن f(-x) = -f(x) لكل x ≠ 0.",
        "1. ب) لكل a, b ≥ 0 نضع x=√a و y=√b فنجد f(a - b) = f(a) - f(b)، وبما أن f فردية فإن f(u + v) = f(u) + f(v) لكل u, v من R.",
        "2. باستعمال f((x+1)² - x²) = f(2x+1) وتفكيكها خطياً نستنتج أن f(x) = f(1)·x لكل x من R.",
      ],
      sampleSolutionFr: [
        "1. a) Pour y=0, f(x²) = x f(x). En remplaçant x par -x, on obtient -x f(-x) = x f(x), donc f est impaire.",
        "1. b) Pour tous réels positifs u, v, f(u - v) = f(u) - f(v), d'où l'additivité de f sur ℝ.",
        "2. En développant f((x+1)² - x²) = (x+1)f(x+1) - x f(x) par additivité, on obtient f(x) = f(1)·x.",
      ],
      isImportedSimulation: true,
      importedOriginLabel: "أولمبياد الرياضيات الوطنية — الأولى بكالوريا علوم رياضية",
    },
  },
  {
    id: "olymp_concours_general_2bac_sm_analyse",
    competitionAr: "المباراة العامة للعلوم والتقنيات — الثانية بكالوريا علوم رياضية (متتاليات الجذور والتكامل)",
    competitionFr: "Concours Général des Sciences et Techniques (2Bac SM) — Suites implicites & Analyse",
    targetCycleBadge: "2Bac SM A/B · المباراة العامة للعلوم",
    domainAr: "التحليل المتقدم: متتاليات المعادلات الضمنية f_n(x)=0 والتكامل",
    domainFr: "Analyse supérieure : Suites définies implicitement et calcul asymptotique",
    difficultyStars: 5,
    polyaHeuristicAr: [
      "1. فهم المسألة: لكل n ≥ 1، الدالة f_n تزايدية قطعا ومتصلة، مما يضمن وجود ووحدانية الجذر x_n.",
      "2. بناء الخطة: لدراسة رتابة (x_n)، أحسب إشارة f_{n+1}(x_n) ثم استثمر رتابة f_{n+1}.",
      "3. السلوك المقارب: استعمل اللوغاريتم أو التأطير التكاملي لإيجاد المكافئ الحدي لـ x_n بجوار +∞.",
    ],
    polyaHeuristicFr: [
      "1. Existence et unicité : Appliquer le théorème de la bijection à f_n sur ℝ+.",
      "2. Monotonie de (x_n) : Évaluer le signe de f_{n+1}(x_n) et utiliser la stricte croissance de f_{n+1}.",
      "3. Développement asymptotique : Prendre le logarithme de la relation x_n^n = ... pour déterminer la limite.",
    ],
    lessonItem: {
      lessonAr: "مسألة التميز والمباراة العامة (2Bac SM): متتالية الجذور الضمنية والتقارب",
      lessonFr: "Problème d'Excellence & Concours Général (2Bac SM) : Suite implicite des racines",
      weight: 30,
      hours: "6h",
      category: "Calculus",
      subCategory: "تحليل",
      subCategoryFr: "Analyse d'Excellence",
      tags: ["Calculus", "تحليل", "متتاليات عددية"],
      capacitiesAr: [
        "توظيف مبرهنة التقابل لدراسة متتالية معرفة ضمنياً بمعادلة f_n(x_n) = 1 وتحديد سلوكها الحدي",
      ],
      capacitiesFr: [
        "Étudier une suite définie implicitement par f_n(x_n) = 1 et déterminer son équivalent asymptotique",
      ],
      sampleExerciseAr: [
        "لكل عدد صحيح طبيعي غير منعدم n ≥ 1، نعتبر الدالة f_n المعرفة على المجال [0, 1] بـ: f_n(x) = x^n + x - 1.",
        "1. أ) بين أن المعادلة f_n(x) = 0 تقبل حلاً وحيداً α_n في المجال ]0, 1[ لكل n ≥ 1.",
        "1. ب) تحقق من أنه لكل n ≥ 1 لدينا f_{n+1}(α_n) < 0، ثم استنتج أن المتتالية (α_n) تزايدية قطعا وأنها متقاربة.",
        "2. أ) بين أنه لكل n ≥ 1 لدينا: α_n^n = 1 - α_n، ثم افترض بالخلف أن lim α_n = ℓ < 1 واستنتج أن lim_{n→+∞} α_n = 1.",
        "2. ب) بين أن: lim_{n→+∞} n(1 - α_n) / ln(n) = 1.",
      ],
      sampleExerciseFr: [
        "Pour tout entier n ≥ 1, on considère la fonction f_n définie sur [0, 1] par : f_n(x) = x^n + x - 1.",
        "1. a) Montrer que l'équation f_n(x) = 0 admet une unique solution α_n ∈ ]0, 1[.",
        "1. b) Vérifier que f_{n+1}(α_n) < 0, en déduire que la suite (α_n) est strictement croissante et convergente.",
        "2. a) À l'aide de la relation α_n^n = 1 - α_n, démontrer par l'absurde que lim_{n→+∞} α_n = 1.",
        "2. b) Établir l'équivalent asymptotique : lim_{n→+∞} n(1 - α_n) / ln(n) = 1.",
      ],
      sampleSolutionAr: [
        "1. أ) f_n متصلة وتزايدية قطعا على [0,1] و f_n(0) = -1 < 0 و f_n(1) = 1 > 0، إذن بالتقابل توجد α_n وحيدة في ]0,1[.",
        "1. ب) f_{n+1}(α_n) - f_n(α_n) = α_n^{n+1} - α_n^n = α_n^n(α_n - 1) < 0 لأن α_n ∈ ]0,1[، ومنه f_{n+1}(α_n) < f_{n+1}(α_{n+1}) أي α_n < α_{n+1}.",
        "2. أ) لو كانت ℓ < 1 لكانت lim α_n^n = 0 ومنه 0 = 1 - ℓ أي ℓ = 1 تناقض، إذن lim α_n = 1.",
        "2. ب) بأخذ اللوغاريتم: n ln(α_n) = ln(1 - α_n)، وبما أن ln(α_n) ~ -(1 - α_n) بجوار 1 نستنتج النتيجة.",
      ],
      sampleSolutionFr: [
        "1. a) f_n est continue et strictement croissante sur [0,1] avec f_n(0)=-1 et f_n(1)=1.",
        "1. b) f_{n+1}(α_n) = α_n^n(α_n - 1) < 0 = f_{n+1}(α_{n+1}), donc α_n < α_{n+1} par croissance de f_{n+1}.",
        "2. a) Si ℓ < 1 alors α_n^n → 0 et 1 - α_n → 1 - ℓ > 0, absurde. Donc lim α_n = 1.",
        "2. b) n ln(α_n) = ln(1 - α_n) donne n(α_n - 1) ~ ln(1 - α_n), d'où n(1 - α_n) ~ ln(n).",
      ],
      isImportedSimulation: true,
      importedOriginLabel: "المباراة العامة للعلوم والتقنيات — 2Bac SM",
    },
  },
];


