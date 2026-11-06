/**
 * classCompetencyMatrix.ts
 * ---------------------------------------------------------------------------
 * مصفوفة تمكن الكفايات على مستوى القسم.
 *
 * تأخذ تعريف الكفايات ونقط التلاميذ (0..100) لكل كفاية، وتُنتج:
 *  - مصفوفة (تلميذ × كفاية) بمستوى التمكن: متحكم / في طور التمكن / غير متحكم.
 *  - معدل القسم لكل كفاية وترتيب أولويات التدخل.
 *  - قائمة التلاميذ المعرضين للتعثر وتوصيات علاجية بالعربية.
 *  - تصدير CSV جاهز للطباعة أو الاستيراد في Excel.
 *
 * الحدود المعتمدة: ≥75% متحكم، 50–74% في طور التمكن، <50% غير متحكم.
 * الوحدة نقية ولا تعتمد على DOM.
 */

export type MasteryLevel = "MASTERED" | "DEVELOPING" | "NOT_MASTERED";

export interface CompetencyDefinition {
  id: string;
  nameAr: string;
  /** وزن الكفاية في المعدل العام (الافتراضي 1). */
  weight?: number;
}

export interface StudentCompetencyInput {
  studentId: string;
  studentName: string;
  /** نسبة التمكن من 0 إلى 100 لكل كفاية، أو null عند غياب التقييم. */
  scores: Record<string, number | null | undefined>;
}

export interface CompetencyMatrixCell {
  pct: number | null;
  level: MasteryLevel | null;
}

export interface CompetencyMatrixRow {
  studentId: string;
  studentName: string;
  cells: Record<string, CompetencyMatrixCell>;
  overallPct: number | null;
  masteredCount: number;
  weakCount: number;
}

export interface CompetencyColumnSummary {
  competencyId: string;
  nameAr: string;
  classPct: number | null;
  level: MasteryLevel | null;
  masteredCount: number;
  atRiskCount: number;
  /** كلما ارتفعت الأولوية انخفض تمكن القسم (0–100). */
  priorityScore: number;
}

export interface ClassCompetencyMatrix {
  rows: CompetencyMatrixRow[];
  columns: CompetencyColumnSummary[];
  globalPct: number | null;
  priorityCompetencies: string[];
  atRiskStudents: string[];
  recommendedActionsAr: string[];
}

export const MASTERY_THRESHOLDS = {
  mastered: 75,
  developing: 50,
} as const;

const round2 = (value: number): number => Math.round(value * 100) / 100;
const clampPct = (value: number): number => Math.min(100, Math.max(0, value));

export function masteryLevelFromPct(pct: number | null | undefined): MasteryLevel | null {
  if (pct === null || pct === undefined || !Number.isFinite(pct)) return null;
  if (pct >= MASTERY_THRESHOLDS.mastered) return "MASTERED";
  if (pct >= MASTERY_THRESHOLDS.developing) return "DEVELOPING";
  return "NOT_MASTERED";
}

export function masteryLevelLabelAr(level: MasteryLevel | null): string {
  if (level === "MASTERED") return "متحكم";
  if (level === "DEVELOPING") return "في طور التمكن";
  if (level === "NOT_MASTERED") return "غير متحكم";
  return "غير مقيّم";
}

function weightedAverage(
  competencies: CompetencyDefinition[],
  scores: Record<string, number | null | undefined>
): number | null {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const competency of competencies) {
    const raw = scores[competency.id];
    if (raw === null || raw === undefined || !Number.isFinite(raw)) continue;
    const weight = competency.weight && competency.weight > 0 ? competency.weight : 1;
    weightedSum += clampPct(raw) * weight;
    weightTotal += weight;
  }

  return weightTotal > 0 ? round2(weightedSum / weightTotal) : null;
}

export function buildClassCompetencyMatrix(
  competencies: CompetencyDefinition[],
  students: StudentCompetencyInput[]
): ClassCompetencyMatrix {
  const rows: CompetencyMatrixRow[] = students.map((student) => {
    const cells: Record<string, CompetencyMatrixCell> = {};
    let masteredCount = 0;
    let weakCount = 0;

    for (const competency of competencies) {
      const raw = student.scores?.[competency.id];
      const pct =
        raw === null || raw === undefined || !Number.isFinite(raw) ? null : round2(clampPct(raw));
      const level = masteryLevelFromPct(pct);
      cells[competency.id] = { pct, level };
      if (level === "MASTERED") masteredCount += 1;
      if (level === "NOT_MASTERED") weakCount += 1;
    }

    return {
      studentId: student.studentId,
      studentName: student.studentName,
      cells,
      overallPct: weightedAverage(competencies, student.scores || {}),
      masteredCount,
      weakCount,
    };
  });

  const columns: CompetencyColumnSummary[] = competencies.map((competency) => {
    const values: number[] = [];
    let masteredCount = 0;
    let atRiskCount = 0;

    for (const row of rows) {
      const cell = row.cells[competency.id];
      if (cell.pct !== null) values.push(cell.pct);
      if (cell.level === "MASTERED") masteredCount += 1;
      if (cell.level === "NOT_MASTERED") atRiskCount += 1;
    }

    const classPct =
      values.length > 0 ? round2(values.reduce((a, b) => a + b, 0) / values.length) : null;

    return {
      competencyId: competency.id,
      nameAr: competency.nameAr,
      classPct,
      level: masteryLevelFromPct(classPct),
      masteredCount,
      atRiskCount,
      priorityScore: classPct === null ? 0 : round2(100 - classPct),
    };
  });

  const globalValues = rows.map((row) => row.overallPct).filter((v): v is number => v !== null);
  const globalPct =
    globalValues.length > 0
      ? round2(globalValues.reduce((a, b) => a + b, 0) / globalValues.length)
      : null;

  const priorityCompetencies = columns
    .filter((column) => column.classPct !== null && column.classPct < MASTERY_THRESHOLDS.mastered)
    .sort((a, b) => (a.classPct ?? 100) - (b.classPct ?? 100))
    .slice(0, 3)
    .map((column) => column.competencyId);

  const atRiskStudents = rows
    .filter((row) => row.overallPct !== null && row.overallPct < MASTERY_THRESHOLDS.developing)
    .map((row) => row.studentId);

  const recommendedActionsAr: string[] = [];

  if (rows.length === 0) {
    recommendedActionsAr.push("لا توجد بيانات تلاميذ لبناء المصفوفة.");
  } else if (competencies.length === 0) {
    recommendedActionsAr.push("حدّد الكفايات المستهدفة أولاً.");
  } else {
    for (const competencyId of priorityCompetencies) {
      const column = columns.find((item) => item.competencyId === competencyId);
      if (!column) continue;
      recommendedActionsAr.push(
        `برمجة حصة دعم للكفاية «${column.nameAr}» (تمكن القسم ${column.classPct ?? 0}%، و${column.atRiskCount} تلميذاً غير متحكم).`
      );
    }
    if (atRiskStudents.length > 0) {
      recommendedActionsAr.push(
        `إدراج ${atRiskStudents.length} تلميذاً في خطة المعالجة الفردية ومتابعتهم أسبوعياً.`
      );
    }
    if (recommendedActionsAr.length === 0) {
      recommendedActionsAr.push("تمكن القسم من الكفايات المستهدفة: انتقل إلى أنشطة الإغناء والتحدي.");
    }
  }

  return {
    rows,
    columns,
    globalPct,
    priorityCompetencies,
    atRiskStudents,
    recommendedActionsAr,
  };
}

/** تصدير المصفوفة إلى CSV بترميز UTF-8 مع BOM (يفتح مباشرة في Excel). */
export function matrixToCsv(matrix: ClassCompetencyMatrix): string {
  const header = ["التلميذ", ...matrix.columns.map((column) => column.nameAr), "المعدل العام", "المستوى"];
  const lines = [header.map(escapeCsv).join(",")];

  for (const row of matrix.rows) {
    const values = [
      row.studentName,
      ...matrix.columns.map((column) => {
        const cell = row.cells[column.competencyId];
        return cell?.pct === null || cell?.pct === undefined ? "" : String(cell.pct);
      }),
      row.overallPct === null ? "" : String(row.overallPct),
      masteryLevelLabelAr(masteryLevelFromPct(row.overallPct)),
    ];
    lines.push(values.map(escapeCsv).join(","));
  }

  return "\uFEFF" + lines.join("\r\n");
}

function escapeCsv(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
