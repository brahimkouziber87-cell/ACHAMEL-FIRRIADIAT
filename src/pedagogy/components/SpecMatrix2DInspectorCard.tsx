import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Download,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Flame,
  PlusCircle,
  RefreshCw,
  Scale,
  Sliders,
  Sparkles,
  Table2,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  DSQuestionDensity,
  FRENCH_COMPETENCIES,
  LessonItem,
} from "../data/curriculum";
import {
  build2DSpecificationMatrix,
  generate2DSpecMatrixLatex,
  generate2DSpecMatrixTypst,
  SpecMatrixCell,
  SpecMatrixRow,
} from "../utils/advancedPedagogicalTools";
import {
  AdaptiveSpecMatrixUpdateResult,
  computeAdaptive2DSpecMatrixWeights,
  createDefaultStudentSkillEvaluations,
  cycleSkillAcquisitionLevel,
  exportIntegratedPedagogicalReportCSV,
  exportIntegratedPedagogicalReportHTML,
  loadOrInitializeStudentSkillAssessments,
  saveStudentSkillAssessments,
  SKILL_ACQUISITION_META,
  SkillAcquisitionLevel,
  StudentSpecMatrixEvaluation,
  SuggestedRemedialExercise,
} from "../utils/specMatrixSkillAssessmentEngine";
import { MathText } from "./MathRenderer";

export type SpecMatrix2DSubTab =
  | "MATRIX_2D"
  | "AEFE_COMPETENCIES_MATRIX"
  | "STUDENT_SKILL_ASSESSMENT"
  | "ADAPTIVE_WEIGHTS_ENGINE";

export type HeatmapMetricMode =
  | "COMPOSITE_SKILL_DENSITY"
  | "POINTS_SHARE"
  | "QUESTIONS_INTENSITY";

export type HeatmapThermalLevel = "HIGH" | "MEDIUM" | "LOW" | "NONE";

export type AefeCompetencyId =
  | "CHERCHER"
  | "MODELISER"
  | "REPRESENTER"
  | "RAISONNER"
  | "CALCULER"
  | "COMMUNIQUER";

export type AefeProfileMode =
  | "STANDARD_AEFE"
  | "BAC_SCIENTIFIQUE"
  | "RESOLUTION_PROBLEMES";

export interface AefeCompetencyMeta {
  id: AefeCompetencyId;
  labelFr: string;
  labelAr: string;
  shortAr: string;
  descFr: string;
  descAr: string;
  defaultTargetPct: number;
}

export const AEFE_SIX_COMPETENCIES_META: AefeCompetencyMeta[] = [
  {
    id: "CHERCHER",
    labelFr: FRENCH_COMPETENCIES[0]?.label || "Chercher",
    labelAr: "البحث والتجريب (Chercher)",
    shortAr: "البحث",
    descFr:
      FRENCH_COMPETENCIES[0]?.desc ||
      "Analyser, expérimenter, conjecturer et décomposer un problème complexe",
    descAr: "تحليل المعطيات، التجريب، صياغة المظنونات وتفكيك المسائل المركبة",
    defaultTargetPct: 15,
  },
  {
    id: "MODELISER",
    labelFr: FRENCH_COMPETENCIES[1]?.label || "Modéliser",
    labelAr: "النمذجة الرياضية (Modéliser)",
    shortAr: "النمذجة",
    descFr:
      FRENCH_COMPETENCIES[1]?.desc ||
      "Traduire une situation réelle en langage mathématique et valider le modèle",
    descAr: "ترجمة وضعية إلى نموذج رياضي (دالة، متتالية، احتمال) والتحقق من صلاحيته",
    defaultTargetPct: 15,
  },
  {
    id: "REPRESENTER",
    labelFr: FRENCH_COMPETENCIES[2]?.label || "Représenter",
    labelAr: "التمثيل والتأويل (Représenter)",
    shortAr: "التمثيل",
    descFr:
      FRENCH_COMPETENCIES[2]?.desc ||
      "Choisir un cadre adapté (algébrique, géométrique, graphique, probabiliste)",
    descAr: "الانتقال بين الأطر المبيانية والهندسية والجبرية وتأويل المنحنيات",
    defaultTargetPct: 15,
  },
  {
    id: "RAISONNER",
    labelFr: FRENCH_COMPETENCIES[3]?.label || "Raisonner",
    labelAr: "الاستدلال والبرهنة (Raisonner)",
    shortAr: "الاستدلال",
    descFr:
      FRENCH_COMPETENCIES[3]?.desc ||
      "Développer une démarche logique, démontrer, réfuter par contre-exemple",
    descAr: "بناء استدلال منطقي متسلسل، البرهان بالترجع أو الخلف، وتبرير المراحل",
    defaultTargetPct: 25,
  },
  {
    id: "CALCULER",
    labelFr: FRENCH_COMPETENCIES[4]?.label || "Calculer",
    labelAr: "الحساب والمعالجة (Calculer)",
    shortAr: "الحساب",
    descFr:
      FRENCH_COMPETENCIES[4]?.desc ||
      "Mener à bien des calculs algébriques, formels et numériques avec précision",
    descAr: "إنجاز الحسابات الجبرية والتحليلية والمشتقات والتكاملات والحدود بدقة",
    defaultTargetPct: 20,
  },
  {
    id: "COMMUNIQUER",
    labelFr: FRENCH_COMPETENCIES[5]?.label || "Communiquer",
    labelAr: "التواصل والتحرير (Communiquer)",
    shortAr: "التواصل",
    descFr:
      FRENCH_COMPETENCIES[5]?.desc ||
      "Rédiger une démonstration rigoureuse avec notations mathématiques claires",
    descAr: "صياغة البراهين والنتائج بلغة رياضية سليمة وترميز علمي واضح",
    defaultTargetPct: 10,
  },
];

export const AEFE_PROFILE_TARGETS: Record<
  AefeProfileMode,
  {
    labelAr: string;
    labelFr: string;
    targets: Record<AefeCompetencyId, number>;
  }
> = {
  STANDARD_AEFE: {
    labelAr: "المعيار الرسمي الموازن (AEFE / Bulletin Officiel)",
    labelFr: "Référentiel Équilibré Officiel AEFE",
    targets: {
      CHERCHER: 15,
      MODELISER: 15,
      REPRESENTER: 15,
      RAISONNER: 25,
      CALCULER: 20,
      COMMUNIQUER: 10,
    },
  },
  BAC_SCIENTIFIQUE: {
    labelAr: "نسق البكالوريا العلمية (Spécialité Maths / 2BAC)",
    labelFr: "Profil Épreuve Finale Spécialité Maths",
    targets: {
      CHERCHER: 14,
      MODELISER: 14,
      REPRESENTER: 14,
      RAISONNER: 28,
      CALCULER: 20,
      COMMUNIQUER: 10,
    },
  },
  RESOLUTION_PROBLEMES: {
    labelAr: "نسق المسائل المفتوحة والبحث (Prise d'initiative)",
    labelFr: "Profil Résolution de Problèmes & Initiative",
    targets: {
      CHERCHER: 22,
      MODELISER: 20,
      REPRESENTER: 15,
      RAISONNER: 22,
      CALCULER: 13,
      COMMUNIQUER: 8,
    },
  },
};

export interface HeatmapStyleInfo {
  level: HeatmapThermalLevel;
  densityScore: number; // 0..100
  cellBgClass: string;
  cellBorderClass: string;
  textClass: string;
  badgeClass: string;
  barColorClass: string;
  rowAccentClass: string;
  labelAr: string;
  labelFr: string;
  shortTagAr: string;
}

export function buildHeatmapStyleFromLevel(
  level: HeatmapThermalLevel,
  densityScore: number
): HeatmapStyleInfo {
  const clamped = Math.max(0, Math.min(100, Math.round(densityScore)));
  if (level === "NONE") {
    return {
      level: "NONE",
      densityScore: 0,
      cellBgClass: "bg-slate-50/70",
      cellBorderClass: "border-slate-200",
      textClass: "text-slate-400",
      badgeClass: "bg-slate-100 text-slate-500 border-slate-200",
      barColorClass: "bg-slate-300",
      rowAccentClass: "border-r-4 border-r-slate-300",
      labelAr: "بدون مهارات مفعلة",
      labelFr: "Aucune compétence",
      shortTagAr: "0%",
    };
  }
  if (level === "HIGH") {
    return {
      level: "HIGH",
      densityScore: clamped,
      cellBgClass: "bg-rose-100/90",
      cellBorderClass: "border-rose-400",
      textClass: "text-rose-950",
      badgeClass: "bg-rose-600 text-white border-rose-700",
      barColorClass: "bg-rose-600",
      rowAccentClass: "border-r-4 border-r-rose-600 bg-rose-50/45",
      labelAr: "كثافة مهارية عالية",
      labelFr: "Forte densité de compétences",
      shortTagAr: `كثافة عالية ${clamped}%`,
    };
  }
  if (level === "MEDIUM") {
    return {
      level: "MEDIUM",
      densityScore: clamped,
      cellBgClass: "bg-amber-50/90",
      cellBorderClass: "border-amber-300",
      textClass: "text-amber-950",
      badgeClass: "bg-amber-500 text-white border-amber-600",
      barColorClass: "bg-amber-500",
      rowAccentClass: "border-r-4 border-r-amber-500 bg-amber-50/30",
      labelAr: "كثافة مهارية متوسطة",
      labelFr: "Densité modérée",
      shortTagAr: `كثافة متوسطة ${clamped}%`,
    };
  }
  // LOW -> Blue (الأزرق للدروس والخلايا ذات الكثافة المهارية المنخفضة)
  return {
    level: "LOW",
    densityScore: clamped,
    cellBgClass: "bg-sky-100/90",
    cellBorderClass: "border-sky-400",
    textClass: "text-sky-950",
    badgeClass: "bg-sky-600 text-white border-sky-700",
    barColorClass: "bg-sky-600",
    rowAccentClass: "border-r-4 border-r-sky-600 bg-sky-50/45",
    labelAr: "كثافة مهارية منخفضة",
    labelFr: "Faible densité de compétences",
    shortTagAr: `كثافة منخفضة ${clamped}%`,
  };
}

export interface AdaptiveApplyPayload {
  rawLessonWeightsMap: Record<string, number>;
  recommendedRatios: { n1: number; n2: number; n3: number };
  injectedExercises: SuggestedRemedialExercise[];
}

export interface SpecMatrix2DInspectorCardProps {
  lessons: LessonItem[];
  n1: number;
  n2: number;
  n3: number;
  dsStructureMode: string;
  isMission: boolean;
  isFr?: boolean;
  dsQuestionDensity?: DSQuestionDensity;
  qcmQuestionCount?: number;
  examDurationMinutes?: number;
  variant?: "interactive" | "print";
  include2DSpecMatrix?: boolean;
  onToggleIncludeInSheet?: (val: boolean) => void;
  onApplyPresetRatios?: (n1: number, n2: number, n3: number) => void;
  onOpenBaremeModal?: () => void;
  onOpenAdvancedStudio2D?: () => void;
  trackCode?: string;
  trackNameAr?: string;
  trackNameFr?: string;
  dsKey?: string;
  dsTitleAr?: string;
  dsTitleFr?: string;
  school?: string;
  prof?: string;
  year?: string;
  academy?: string;
  direction?: string;
  initialSubTab?: SpecMatrix2DSubTab;
  onApplyAdaptiveWeightsAndExercises?: (payload: AdaptiveApplyPayload) => void;
}

export const SpecMatrix2DInspectorCard: React.FC<SpecMatrix2DInspectorCardProps> =
  React.memo(
    ({
      lessons,
      n1,
      n2,
      n3,
      dsStructureMode,
      isMission,
      isFr = false,
      dsQuestionDensity = "STANDARD",
      qcmQuestionCount = 4,
      examDurationMinutes = 120,
      variant = "interactive",
      include2DSpecMatrix = true,
      onToggleIncludeInSheet,
      onApplyPresetRatios,
      onOpenBaremeModal,
      onOpenAdvancedStudio2D,
      trackCode = "DEFAULT",
      trackNameAr = "السنة الثانية بكالوريا",
      trackNameFr = "2ème Baccalauréat",
      dsKey = "DS1",
      dsTitleAr = "الفرض المحروس رقم 1",
      dsTitleFr = "Devoir Surveillé N°1",
      school = "الثانوية التأهيلية",
      prof = "أستاذ(ة) المادة",
      year = "2024/2025",
      academy = "الأكاديمية الجهوية للتربية والتكوين",
      direction = "المديرية الإقليمية",
      initialSubTab = "MATRIX_2D",
      onApplyAdaptiveWeightsAndExercises,
    }) => {
      const [copiedFormat, setCopiedFormat] = useState<
        "LATEX" | "TYPST" | "AEFE_LATEX" | "AEFE_TYPST" | null
      >(null);
      const [activeSubTab, setActiveSubTab] =
        useState<SpecMatrix2DSubTab>(initialSubTab);
      const [heatmapEnabled, setHeatmapEnabled] = useState<boolean>(true);
      const [heatmapMetric, setHeatmapMetric] = useState<HeatmapMetricMode>(
        "COMPOSITE_SKILL_DENSITY"
      );
      const [aefeProfileMode, setAefeProfileMode] =
        useState<AefeProfileMode>("STANDARD_AEFE");

      const [studentEvaluations, setStudentEvaluations] = useState<
        StudentSpecMatrixEvaluation[]
      >(() => loadOrInitializeStudentSkillAssessments(trackCode, dsKey, lessons));
      const [selectedLessonFilter, setSelectedLessonFilter] = useState<string>("ALL");
      const [appliedFeedbackBanner, setAppliedFeedbackBanner] = useState<string | null>(
        null
      );

      const copyTimerRef = useRef<number | null>(null);
      const feedbackTimerRef = useRef<number | null>(null);

      useEffect(() => {
        return () => {
          if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
          if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
        };
      }, []);

      // Reload/normalize student evaluations when trackCode, dsKey, or lessons change
      useEffect(() => {
        const loaded = loadOrInitializeStudentSkillAssessments(
          trackCode,
          dsKey,
          lessons
        );
        setStudentEvaluations(loaded);
      }, [trackCode, dsKey, lessons]);

      const updateAndPersistStudents = (
        updater: (
          prev: StudentSpecMatrixEvaluation[]
        ) => StudentSpecMatrixEvaluation[]
      ) => {
        setStudentEvaluations((prev) => {
          const next = updater(prev);
          saveStudentSkillAssessments(trackCode, dsKey, next);
          return next;
        });
      };

      const adaptiveResult: AdaptiveSpecMatrixUpdateResult = useMemo(
        () =>
          computeAdaptive2DSpecMatrixWeights(
            lessons,
            studentEvaluations,
            trackCode,
            n1,
            n2,
            n3
          ),
        [lessons, studentEvaluations, trackCode, n1, n2, n3]
      );

      const spec2D = useMemo(
        () =>
          build2DSpecificationMatrix(
            lessons,
            n1,
            n2,
            n3,
            dsStructureMode,
            isMission,
            dsQuestionDensity,
            qcmQuestionCount,
            examDurationMinutes
          ),
        [
          lessons,
          n1,
          n2,
          n3,
          dsStructureMode,
          isMission,
          dsQuestionDensity,
          qcmQuestionCount,
          examDurationMinutes,
        ]
      );

      // ======================================================================
      // HEATMAP ENGINE FOR 2D SPECIFICATION MATRIX (ROWS & CELLS)
      // Red = High skill density (كثافة مهارية عالية)
      // Blue = Low skill density (كثافة مهارية منخفضة)
      // Amber = Medium/Balanced skill density (كثافة مهارية متوسطة)
      // ======================================================================
      const heatmapAnalysis = useMemo(() => {
        const rows = spec2D.rows;
        const computeRawRowIntensity = (r: SpecMatrixRow): number => {
          const activeCellsCount =
            (r.n1.questionsCount > 0 ? 1 : 0) +
            (r.n2.questionsCount > 0 ? 1 : 0) +
            (r.n3.questionsCount > 0 ? 1 : 0);
          const cognitiveWeightedQ =
            r.n1.questionsCount * 1.0 +
            r.n2.questionsCount * 1.45 +
            r.n3.questionsCount * 1.95;

          if (heatmapMetric === "POINTS_SHARE") {
            return r.totalPoints * 5 + r.weightPercent * 0.6;
          }
          if (heatmapMetric === "QUESTIONS_INTENSITY") {
            return r.totalQuestions * 12 + activeCellsCount * 10 + cognitiveWeightedQ * 4;
          }
          // COMPOSITE_SKILL_DENSITY
          return (
            cognitiveWeightedQ * 7.5 +
            r.totalPoints * 3.5 +
            r.weightPercent * 0.45 +
            activeCellsCount * 8
          );
        };

        const rawRowScores = rows.map(computeRawRowIntensity);
        const minRowRaw = rawRowScores.length ? Math.min(...rawRowScores) : 0;
        const maxRowRaw = rawRowScores.length ? Math.max(...rawRowScores) : 1;
        const rowSpread = maxRowRaw - minRowRaw;

        const rowStyles: HeatmapStyleInfo[] = rows.map((r, idx) => {
          if (r.totalQuestions === 0 || r.totalPoints <= 0) {
            return buildHeatmapStyleFromLevel("NONE", 0);
          }
          const raw = rawRowScores[idx];
          let normalizedScore = 55;
          if (rows.length === 1) {
            normalizedScore = Math.min(96, Math.max(25, Math.round(raw)));
          } else if (rowSpread > 0.01) {
            normalizedScore = Math.round(22 + ((raw - minRowRaw) / rowSpread) * 74);
          } else {
            // Identical raw scores across lessons: differentiate slightly or mark balanced
            normalizedScore = 56;
          }

          let level: HeatmapThermalLevel = "MEDIUM";
          if (rows.length >= 2 && rowSpread > 0.01) {
            if (raw >= maxRowRaw - rowSpread * 0.28 || normalizedScore >= 68) {
              level = "HIGH";
            } else if (raw <= minRowRaw + rowSpread * 0.28 || normalizedScore <= 38) {
              level = "LOW";
            } else {
              level = "MEDIUM";
            }
          } else {
            level =
              normalizedScore >= 68
                ? "HIGH"
                : normalizedScore <= 38
                ? "LOW"
                : "MEDIUM";
          }
          return buildHeatmapStyleFromLevel(level, normalizedScore);
        });

        // Compute cell-level heatmap styles across all active N1/N2/N3 cells
        const computeRawCellIntensity = (
          cell: SpecMatrixCell,
          taxonomicMultiplier: number
        ): number => {
          if (cell.questionsCount === 0 || cell.points <= 0) return 0;
          if (heatmapMetric === "POINTS_SHARE") {
            return cell.points * 10 + cell.percentageOfTotal * 1.2;
          }
          if (heatmapMetric === "QUESTIONS_INTENSITY") {
            return cell.questionsCount * 18 * taxonomicMultiplier + cell.points * 3;
          }
          return (
            cell.questionsCount * 11 * taxonomicMultiplier +
            cell.points * 7.5 +
            cell.percentageOfTotal * 0.9
          );
        };

        const allCellRaws: number[] = [];
        rows.forEach((r) => {
          const c1 = computeRawCellIntensity(r.n1, 1.0);
          const c2 = computeRawCellIntensity(r.n2, 1.22);
          const c3 = computeRawCellIntensity(r.n3, 1.45);
          if (c1 > 0) allCellRaws.push(c1);
          if (c2 > 0) allCellRaws.push(c2);
          if (c3 > 0) allCellRaws.push(c3);
        });

        const minCellRaw = allCellRaws.length ? Math.min(...allCellRaws) : 0;
        const maxCellRaw = allCellRaws.length ? Math.max(...allCellRaws) : 1;
        const cellSpread = maxCellRaw - minCellRaw;

        const getCellHeatmap = (
          cell: SpecMatrixCell,
          taxonomicMultiplier: number
        ): HeatmapStyleInfo => {
          if (cell.questionsCount === 0 || cell.points <= 0) {
            return buildHeatmapStyleFromLevel("NONE", 0);
          }
          const raw = computeRawCellIntensity(cell, taxonomicMultiplier);
          let normalized = 55;
          if (cellSpread > 0.01) {
            normalized = Math.round(20 + ((raw - minCellRaw) / cellSpread) * 76);
          }
          let level: HeatmapThermalLevel = "MEDIUM";
          if (allCellRaws.length >= 2 && cellSpread > 0.01) {
            if (raw >= maxCellRaw - cellSpread * 0.3 || normalized >= 68) {
              level = "HIGH";
            } else if (raw <= minCellRaw + cellSpread * 0.32 || normalized <= 38) {
              level = "LOW";
            } else {
              level = "MEDIUM";
            }
          } else {
            level =
              normalized >= 68 ? "HIGH" : normalized <= 38 ? "LOW" : "MEDIUM";
          }
          return buildHeatmapStyleFromLevel(level, normalized);
        };

        const cellStylesByRow = rows.map((r) => ({
          n1: getCellHeatmap(r.n1, 1.0),
          n2: getCellHeatmap(r.n2, 1.22),
          n3: getCellHeatmap(r.n3, 1.45),
        }));

        // Identify highest and lowest skill density lessons
        let highestRowIdx = 0;
        let lowestRowIdx = 0;
        rawRowScores.forEach((val, idx) => {
          if (val > rawRowScores[highestRowIdx]) highestRowIdx = idx;
          if (val < rawRowScores[lowestRowIdx]) lowestRowIdx = idx;
        });

        return {
          rowStyles,
          cellStylesByRow,
          highestLesson: rows[highestRowIdx] || null,
          highestStyle: rowStyles[highestRowIdx] || null,
          lowestLesson: rows[lowestRowIdx] || null,
          lowestStyle: rowStyles[lowestRowIdx] || null,
        };
      }, [spec2D, heatmapMetric]);

      // ======================================================================
      // AEFE 6-COMPETENCIES MATRIX & WEIGHT COMPARISON ENGINE
      // ======================================================================
      const aefeMatrixData = useMemo(() => {
        const profile = AEFE_PROFILE_TARGETS[aefeProfileMode];
        const rows = spec2D.rows;

        // Domain-aware affinity weights for each of the 6 AEFE competencies
        const getDomainAffinity = (
          lesson: LessonItem | undefined,
          row: SpecMatrixRow
        ): Record<AefeCompetencyId, number> => {
          const text = `${lesson?.lessonFr || row.lessonTitleFr} ${
            lesson?.lessonAr || row.lessonTitleAr
          } ${lesson?.category || ""} ${lesson?.subCategory || ""}`.toLowerCase();

          const affinity: Record<AefeCompetencyId, number> = {
            CHERCHER: 1.0,
            MODELISER: 1.0,
            REPRESENTER: 1.0,
            RAISONNER: 1.0,
            CALCULER: 1.0,
            COMMUNIQUER: 1.0,
          };

          if (
            text.includes("probabilit") ||
            text.includes("احتمال") ||
            text.includes("stat") ||
            text.includes("إحصاء")
          ) {
            affinity.MODELISER += 0.55;
            affinity.CHERCHER += 0.35;
            affinity.REPRESENTER += 0.2;
          } else if (
            text.includes("géom") ||
            text.includes("هندسة") ||
            text.includes("espace") ||
            text.includes("فضاء") ||
            text.includes("complexe") ||
            text.includes("عقدية") ||
            text.includes("vect")
          ) {
            affinity.REPRESENTER += 0.6;
            affinity.RAISONNER += 0.35;
            affinity.CALCULER += 0.25;
          } else if (
            text.includes("arithm") ||
            text.includes("حسابيات") ||
            text.includes("logique") ||
            text.includes("منطق") ||
            text.includes("structure") ||
            text.includes("بنيات")
          ) {
            affinity.RAISONNER += 0.65;
            affinity.CHERCHER += 0.45;
            affinity.COMMUNIQUER += 0.3;
          } else if (
            text.includes("suite") ||
            text.includes("متتالي") ||
            text.includes("différentielle") ||
            text.includes("تفاضلية")
          ) {
            affinity.RAISONNER += 0.45;
            affinity.MODELISER += 0.4;
            affinity.CALCULER += 0.3;
          } else {
            // Calculus / Functions / Continuity / Derivability / Integrals
            affinity.CALCULER += 0.45;
            affinity.REPRESENTER += 0.38;
            affinity.RAISONNER += 0.32;
            affinity.COMMUNIQUER += 0.2;
          }

          return affinity;
        };

        // Taxonomic N1/N2/N3 contribution matrix to the 6 AEFE competencies
        const taxonomicContribution: Record<
          "n1" | "n2" | "n3",
          Record<AefeCompetencyId, number>
        > = {
          n1: {
            CHERCHER: 0.05,
            MODELISER: 0.08,
            REPRESENTER: 0.22,
            RAISONNER: 0.12,
            CALCULER: 0.41,
            COMMUNIQUER: 0.12,
          },
          n2: {
            CHERCHER: 0.14,
            MODELISER: 0.18,
            REPRESENTER: 0.16,
            RAISONNER: 0.29,
            CALCULER: 0.13,
            COMMUNIQUER: 0.1,
          },
          n3: {
            CHERCHER: 0.34,
            MODELISER: 0.24,
            REPRESENTER: 0.08,
            RAISONNER: 0.22,
            CALCULER: 0.04,
            COMMUNIQUER: 0.08,
          },
        };

        // First pass: compute each lesson's 6 competency point allocations and raw AEFE competency richness
        const rawLessonAefeScores: number[] = [];

        const prelimRows = rows.map((r, rIdx) => {
          const matchedLesson =
            lessons[rIdx] ||
            lessons.find(
              (l) =>
                l.lessonFr === r.lessonTitleFr || l.lessonAr === r.lessonTitleAr
            );
          const affinity = getDomainAffinity(matchedLesson, r);

          // Combine N1, N2, N3 points with taxonomic contribution & domain affinity & profile targets
          const unnormalizedCompWeights: Record<AefeCompetencyId, number> = {
            CHERCHER: 0,
            MODELISER: 0,
            REPRESENTER: 0,
            RAISONNER: 0,
            CALCULER: 0,
            COMMUNIQUER: 0,
          };

          AEFE_SIX_COMPETENCIES_META.forEach((comp) => {
            const cId = comp.id;
            const n1Part = r.n1.points * taxonomicContribution.n1[cId];
            const n2Part = r.n2.points * taxonomicContribution.n2[cId];
            const n3Part = r.n3.points * taxonomicContribution.n3[cId];
            const basePts = Math.max(0.05, n1Part + n2Part + n3Part);
            const targetFactor = profile.targets[cId] / comp.defaultTargetPct;
            unnormalizedCompWeights[cId] =
              basePts * affinity[cId] * targetFactor;
          });

          const sumUnnorm = Object.values(unnormalizedCompWeights).reduce(
            (acc, v) => acc + v,
            0
          );

          const competencyPoints: Record<AefeCompetencyId, number> = {
            CHERCHER: 0,
            MODELISER: 0,
            REPRESENTER: 0,
            RAISONNER: 0,
            CALCULER: 0,
            COMMUNIQUER: 0,
          };

          AEFE_SIX_COMPETENCIES_META.forEach((comp) => {
            const cId = comp.id;
            const share =
              sumUnnorm > 0 ? unnormalizedCompWeights[cId] / sumUnnorm : 1 / 6;
            competencyPoints[cId] = Number((r.totalPoints * share).toFixed(2));
          });

          // Compute AEFE Competency Richness Score for comparing with current lesson weight:
          // Evaluates cognitive breadth across the 6 competencies, high-order competencies (Chercher/Modéliser/Raisonner),
          // number of curriculum capacities, and question diversity.
          const capacityCount = Math.max(
            2,
            matchedLesson?.capacitiesAr?.length || r.capacitiesAr.length || 3
          );
          const highOrderRatio =
            sumUnnorm > 0
              ? (unnormalizedCompWeights.CHERCHER * 1.35 +
                  unnormalizedCompWeights.MODELISER * 1.25 +
                  unnormalizedCompWeights.RAISONNER * 1.2 +
                  unnormalizedCompWeights.REPRESENTER * 1.1 +
                  unnormalizedCompWeights.CALCULER * 0.95 +
                  unnormalizedCompWeights.COMMUNIQUER * 1.0) /
                sumUnnorm
              : 1;

          const domainBreadthScore =
            Object.values(affinity).reduce((a, b) => a + b, 0) / 6;

          const rawAefeWeightSignal =
            r.totalQuestions * 3.8 * highOrderRatio +
            capacityCount * 2.6 * domainBreadthScore +
            (r.n2.questionsCount * 1.8 + r.n3.questionsCount * 2.7 + r.n1.questionsCount * 1.1);

          rawLessonAefeScores.push(Math.max(1, rawAefeWeightSignal));

          return {
            row: r,
            matchedLesson,
            competencyPoints,
            affinity,
          };
        });

        // Normalize AEFE Competency Suggested Weights to sum to 100%
        const totalRawAefeSignal = rawLessonAefeScores.reduce(
          (acc, v) => acc + v,
          0
        );
        const aefeWeightsPct = rawLessonAefeScores.map((val) =>
          totalRawAefeSignal > 0
            ? Math.max(8, Math.round((val / totalRawAefeSignal) * 100))
            : Math.round(100 / Math.max(1, rows.length))
        );
        const sumAefeWeights = aefeWeightsPct.reduce((a, b) => a + b, 0);
        if (aefeWeightsPct.length > 0 && sumAefeWeights !== 100) {
          aefeWeightsPct[0] = Math.max(
            5,
            aefeWeightsPct[0] + (100 - sumAefeWeights)
          );
        }

        // Gather all cell points across the 6xN matrix for Heatmap cell normalization
        const allCompCellValues: number[] = [];
        prelimRows.forEach((pr) => {
          AEFE_SIX_COMPETENCIES_META.forEach((comp) => {
            const pts = pr.competencyPoints[comp.id];
            if (pts > 0) allCompCellValues.push(pts);
          });
        });
        const minCompCell = allCompCellValues.length
          ? Math.min(...allCompCellValues)
          : 0;
        const maxCompCell = allCompCellValues.length
          ? Math.max(...allCompCellValues)
          : 1;
        const compCellSpread = maxCompCell - minCompCell;

        const enrichedRows = prelimRows.map((pr, idx) => {
          const currentWeightPercent = pr.row.weightPercent;
          const aefeWeightPercent = aefeWeightsPct[idx];
          const weightDelta = aefeWeightPercent - currentWeightPercent;
          const aefePointsOn20 = Number(((aefeWeightPercent * 20) / 100).toFixed(2));

          const cells: Record<
            AefeCompetencyId,
            {
              points: number;
              percentOfLesson: number;
              percentOfExam: number;
              heatmap: HeatmapStyleInfo;
            }
          > = {} as Record<
            AefeCompetencyId,
            {
              points: number;
              percentOfLesson: number;
              percentOfExam: number;
              heatmap: HeatmapStyleInfo;
            }
          >;

          AEFE_SIX_COMPETENCIES_META.forEach((comp) => {
            const pts = pr.competencyPoints[comp.id];
            const pctLesson =
              pr.row.totalPoints > 0
                ? Math.round((pts / pr.row.totalPoints) * 100)
                : 0;
            const pctExam = Number(((pts / 20) * 100).toFixed(1));

            let normScore = 50;
            if (compCellSpread > 0.01) {
              normScore = Math.round(
                18 + ((pts - minCompCell) / compCellSpread) * 78
              );
            }
            let level: HeatmapThermalLevel = "MEDIUM";
            if (pts <= 0.05) {
              level = "NONE";
            } else if (
              pts >= maxCompCell - compCellSpread * 0.3 ||
              normScore >= 68
            ) {
              level = "HIGH";
            } else if (
              pts <= minCompCell + compCellSpread * 0.32 ||
              normScore <= 38
            ) {
              level = "LOW";
            } else {
              level = "MEDIUM";
            }

            cells[comp.id] = {
              points: pts,
              percentOfLesson: pctLesson,
              percentOfExam: pctExam,
              heatmap: buildHeatmapStyleFromLevel(level, normScore),
            };
          });

          // Find dominant AEFE competency for this lesson
          let dominantCompId: AefeCompetencyId = "RAISONNER";
          let maxPts = -1;
          AEFE_SIX_COMPETENCIES_META.forEach((comp) => {
            if (pr.competencyPoints[comp.id] > maxPts) {
              maxPts = pr.competencyPoints[comp.id];
              dominantCompId = comp.id;
            }
          });

          return {
            row: pr.row,
            currentWeightPercent,
            aefeWeightPercent,
            aefePointsOn20,
            weightDelta,
            dominantCompId,
            rowHeatmap:
              heatmapAnalysis.rowStyles[idx] ||
              buildHeatmapStyleFromLevel("MEDIUM", 50),
            cells,
          };
        });

        // Compute grand totals per competency across the whole exam
        const competencyTotals = AEFE_SIX_COMPETENCIES_META.map((comp) => {
          const totalPts = Number(
            enrichedRows
              .reduce((sum, er) => sum + er.cells[comp.id].points, 0)
              .toFixed(2)
          );
          const actualPct = Math.round(
            (totalPts / Math.max(1, spec2D.totals.grandTotalPoints)) * 100
          );
          const targetPct = profile.targets[comp.id];
          const deltaPct = actualPct - targetPct;
          return {
            meta: comp,
            totalPoints: totalPts,
            actualPercent: actualPct,
            targetPercent: targetPct,
            deltaPercent: deltaPct,
          };
        });

        // Compute alignment index between Current Lesson Weights and AEFE Competency Weights
        const meanAbsWeightDelta =
          enrichedRows.length > 0
            ? enrichedRows.reduce(
                (acc, er) => acc + Math.abs(er.weightDelta),
                0
              ) / enrichedRows.length
            : 0;
        const aefeAlignmentScore = Math.max(
          55,
          Math.min(100, Math.round(100 - meanAbsWeightDelta * 2.2))
        );

        return {
          profile,
          enrichedRows,
          competencyTotals,
          aefeAlignmentScore,
        };
      }, [spec2D, lessons, aefeProfileMode, heatmapAnalysis.rowStyles]);

      const handleApplyAefeCompetencyWeights = (mode: "FULL_AEFE" | "HYBRID_50_50") => {
        const rawLessonWeightsMap: Record<string, number> = {};
        aefeMatrixData.enrichedRows.forEach((er, idx) => {
          const lessonKey =
            lessons[idx]?.lessonFr || er.row.lessonTitleFr || `L_${idx}`;
          const targetW =
            mode === "FULL_AEFE"
              ? er.aefeWeightPercent
              : Math.round((er.currentWeightPercent + er.aefeWeightPercent) / 2);
          rawLessonWeightsMap[lessonKey] = Math.max(5, targetW);
        });

        // Derive N1/N2/N3 ratios aligned with the active AEFE profile
        const pTargets = aefeMatrixData.profile.targets;
        const suggestedN1 = Math.round(
          pTargets.CALCULER + pTargets.REPRESENTER * 0.65 + pTargets.COMMUNIQUER * 0.4
        );
        const suggestedN3 = Math.round(
          pTargets.CHERCHER * 0.75 + pTargets.MODELISER * 0.55
        );
        const suggestedN2 = Math.max(20, 100 - suggestedN1 - suggestedN3);

        if (onApplyAdaptiveWeightsAndExercises) {
          onApplyAdaptiveWeightsAndExercises({
            rawLessonWeightsMap,
            recommendedRatios: {
              n1: suggestedN1,
              n2: suggestedN2,
              n3: suggestedN3,
            },
            injectedExercises: [],
          });
        } else if (onApplyPresetRatios) {
          onApplyPresetRatios(suggestedN1, suggestedN2, suggestedN3);
        }

        showTemporaryFeedback(
          mode === "FULL_AEFE"
            ? "تم تطبيق أوزان الدروس والنسب المهارية المشتقة من مصفوفة الكفايات الست (AEFE) بنجاح!"
            : "تمت الموازنة التوافقية (50% المذكرة 142-08 / 50% كفايات AEFE الست) وتحديث أوزان الدروس بنجاح!"
        );
      };

      const handleCopyAefeCode = (format: "AEFE_LATEX" | "AEFE_TYPST") => {
        const lines: string[] = [];
        if (format === "AEFE_LATEX") {
          lines.push(
            "% Matrice de Spécification selon les 6 Compétences AEFE & Comparaison des Poids"
          );
          lines.push("\\begin{table}[h!]");
          lines.push("\\centering");
          lines.push("\\renewcommand{\\arraystretch}{1.3}");
          lines.push("\\begin{tabular}{|l|c|c|c|c|c|c|c|c|c|}");
          lines.push("\\hline");
          lines.push(
            "\\textbf{Chapitre / Exercice} & \\textbf{Chercher} & \\textbf{Modéliser} & \\textbf{Représenter} & \\textbf{Raisonner} & \\textbf{Calculer} & \\textbf{Communiquer} & \\textbf{Poids Actuel} & \\textbf{Poids AEFE} & \\textbf{$\\Delta$} \\\\ \\hline"
          );
          aefeMatrixData.enrichedRows.forEach((er) => {
            const sign = er.weightDelta > 0 ? `+${er.weightDelta}\\%` : `${er.weightDelta}\\%`;
            lines.push(
              `Ex.${er.row.lessonIndex} ${er.row.lessonTitleFr} & ${er.cells.CHERCHER.points.toFixed(
                2
              )} & ${er.cells.MODELISER.points.toFixed(
                2
              )} & ${er.cells.REPRESENTER.points.toFixed(
                2
              )} & ${er.cells.RAISONNER.points.toFixed(
                2
              )} & ${er.cells.CALCULER.points.toFixed(
                2
              )} & ${er.cells.COMMUNIQUER.points.toFixed(2)} & ${
                er.currentWeightPercent
              }\\% & ${er.aefeWeightPercent}\\% & ${sign} \\\\ \\hline`
            );
          });
          lines.push("\\end{tabular}");
          lines.push("\\end{table}");
        } else {
          lines.push(
            "// Matrice de Spécification AEFE (6 Compétences) & Comparaison des Poids"
          );
          lines.push("#table(");
          lines.push(
            "  columns: (2fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 0.9fr),"
          );
          lines.push("  align: (left, center, center, center, center, center, center, center, center, center),");
          lines.push(
            "  [*Chapitre*], [*Chercher*], [*Modéliser*], [*Représenter*], [*Raisonner*], [*Calculer*], [*Communiquer*], [*Poids 142-08*], [*Poids AEFE*], [*Delta*],"
          );
          aefeMatrixData.enrichedRows.forEach((er) => {
            const sign = er.weightDelta > 0 ? `+${er.weightDelta}%` : `${er.weightDelta}%`;
            lines.push(
              `  [Ex.${er.row.lessonIndex} ${er.row.lessonTitleFr}], [${er.cells.CHERCHER.points.toFixed(
                2
              )}], [${er.cells.MODELISER.points.toFixed(
                2
              )}], [${er.cells.REPRESENTER.points.toFixed(
                2
              )}], [${er.cells.RAISONNER.points.toFixed(
                2
              )}], [${er.cells.CALCULER.points.toFixed(
                2
              )}], [${er.cells.COMMUNIQUER.points.toFixed(2)}], [${
                er.currentWeightPercent
              }%], [${er.aefeWeightPercent}%], [${sign}],`
            );
          });
          lines.push(")");
        }
        navigator.clipboard.writeText(lines.join("\n"));
        setCopiedFormat(format);
        if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = window.setTimeout(() => setCopiedFormat(null), 2000);
      };

      const handleCopyCode = (format: "LATEX" | "TYPST") => {
        const snippet =
          format === "LATEX"
            ? generate2DSpecMatrixLatex(spec2D)
            : generate2DSpecMatrixTypst(spec2D, isFr);
        navigator.clipboard.writeText(snippet);
        setCopiedFormat(format);
        if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = window.setTimeout(() => setCopiedFormat(null), 2000);
      };

      const showTemporaryFeedback = (msg: string) => {
        setAppliedFeedbackBanner(msg);
        if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = window.setTimeout(
          () => setAppliedFeedbackBanner(null),
          4000
        );
      };

      const handleToggleStudentSkill = (
        studentId: string,
        lessonFr: string,
        skillKey: "n1Status" | "n2Status" | "n3Status"
      ) => {
        updateAndPersistStudents((prev) =>
          prev.map((student) => {
            if (student.studentId !== studentId) return student;
            const currentRec = student.lessonRecords[lessonFr] || {
              n1Status: "IN_PROGRESS",
              n2Status: "IN_PROGRESS",
              n3Status: "IN_PROGRESS",
              previousScoreOn20: 11,
            };
            const nextLevel = cycleSkillAcquisitionLevel(currentRec[skillKey]);
            const updatedRec = {
              ...currentRec,
              [skillKey]: nextLevel,
            };
            const nextRecords = {
              ...student.lessonRecords,
              [lessonFr]: updatedRec,
            };

            // Recompute student average grade on 20
            let sumScores = 0;
            lessons.forEach((l) => {
              const r = nextRecords[l.lessonFr] || updatedRec;
              sumScores +=
                (SKILL_ACQUISITION_META[r.n1Status].numericScore * 0.45 +
                  SKILL_ACQUISITION_META[r.n2Status].numericScore * 0.35 +
                  SKILL_ACQUISITION_META[r.n3Status].numericScore * 0.2) *
                20;
            });
            const newGrade =
              lessons.length > 0
                ? Number((sumScores / lessons.length).toFixed(2))
                : student.previousExamGrade20;

            const newObs =
              newGrade >= 14
                ? "تحكم جيد في الكفايات الأساسية والتوليفية"
                : newGrade >= 10
                ? "مكتسبات متوسطة تحتاج تثبيت مهارات التطبيق المباشر N1/N2"
                : "تعثر ملحوظ في المهارات القاعدية N1/N2 يستوجب دعماً بيداغوجياً عاجلاً";

            return {
              ...student,
              previousExamGrade20: newGrade,
              lessonRecords: nextRecords,
              inspectorObservation: newObs,
            };
          })
        );
      };

      const handleSimulatePreset = (
        preset: "REALISTIC_MIXED" | "WEAK_N1_N2" | "HIGH_MASTERY"
      ) => {
        const generated = createDefaultStudentSkillEvaluations(lessons, preset);
        setStudentEvaluations(generated);
        saveStudentSkillAssessments(trackCode, dsKey, generated);
        showTemporaryFeedback(
          preset === "WEAK_N1_N2"
            ? "تم توليد سيناريو تعثر ملحوظ في المهارات القاعدية (N1/N2) لاختبار التحيين التلقائي للأوزان."
            : preset === "HIGH_MASTERY"
            ? "تم توليد سيناريو تحكم عالٍ في المكتسبات لجميع التلاميذ."
            : "تم توليد نتائج الفرض السابق الواقعية وتحديث مؤشرات الاكتساب."
        );
      };

      const handleExportHTMLReport = () => {
        exportIntegratedPedagogicalReportHTML({
          trackNameAr,
          trackNameFr,
          dsTitleAr,
          dsTitleFr,
          school,
          prof,
          year,
          academy,
          direction,
          lessons,
          students: studentEvaluations,
          adaptiveResult,
        });
        showTemporaryFeedback(
          "تم تصدير التقرير البيداغوجي المدمج (HTML قابلة للطباعة A4) بنجاح!"
        );
      };

      const handleExportCSVReport = () => {
        exportIntegratedPedagogicalReportCSV({
          trackNameAr,
          trackNameFr,
          dsTitleAr,
          dsTitleFr,
          school,
          prof,
          year,
          academy,
          direction,
          lessons,
          students: studentEvaluations,
          adaptiveResult,
        });
        showTemporaryFeedback(
          "تم تصدير شبكة تقييم المهارات المكتسبة وأوزان المصفوفة بصيغة CSV/Excel بنجاح!"
        );
      };

      const handleApplyAdaptiveUpdate = (includeSuggestedExercises: boolean) => {
        const allSuggestedExercises = includeSuggestedExercises
          ? adaptiveResult.recommendations.flatMap((rec) => rec.suggestedExercises)
          : [];

        if (onApplyAdaptiveWeightsAndExercises) {
          onApplyAdaptiveWeightsAndExercises({
            rawLessonWeightsMap: adaptiveResult.rawLessonWeightsMap,
            recommendedRatios: adaptiveResult.recommendedRatios,
            injectedExercises: allSuggestedExercises,
          });
        } else if (onApplyPresetRatios) {
          onApplyPresetRatios(
            adaptiveResult.recommendedRatios.n1,
            adaptiveResult.recommendedRatios.n2,
            adaptiveResult.recommendedRatios.n3
          );
        }

        showTemporaryFeedback(
          includeSuggestedExercises
            ? `تم تحديث أوزان مصفوفة التخصيص 2D تلقائياً وإدراج ${allSuggestedExercises.length} تمريناً/سؤالاً داعماً للمهارات الأقل اكتساباً (N1/N2) في الفرض القادم!`
            : "تم تحديث أوزان مصفوفة التخصيص 2D والنسب المهارية تلقائياً بناءً على نتائج الفرض السابق!"
        );
      };

      const renderCellContent = (
        cell: SpecMatrixCell,
        levelColorClass: string,
        badgeBgClass: string,
        cellHeatmap?: HeatmapStyleInfo
      ) => {
        if (cell.questionsCount === 0) {
          return (
            <span className="text-slate-400 font-mono text-[10.5px]">—</span>
          );
        }
        const qPrefix = isFr ? "Q" : "س";
        const activeTextClass =
          heatmapEnabled && cellHeatmap && cellHeatmap.level !== "NONE"
            ? cellHeatmap.textClass
            : levelColorClass;
        const activeBadgeClass =
          heatmapEnabled && cellHeatmap && cellHeatmap.level !== "NONE"
            ? cellHeatmap.level === "HIGH"
              ? "bg-rose-200/90 text-rose-950 border-rose-400"
              : cellHeatmap.level === "LOW"
              ? "bg-sky-200/90 text-sky-950 border-sky-400"
              : "bg-amber-200/80 text-amber-950 border-amber-400"
            : badgeBgClass;

        return (
          <div className="space-y-1">
            <div className={`font-mono font-extrabold ${activeTextClass} tabular-nums`}>
              {cell.questionsCount}
              {isFr ? "Q" : " س"} · {cell.points.toFixed(2)} {isFr ? "pt" : "ن"}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-0.5">
              {cell.questionIndices.map((qNum) => (
                <span
                  key={qNum}
                  className={`inline-block font-mono text-[9.5px] font-bold px-1 py-0.2 rounded border ${activeBadgeClass}`}
                >
                  {qPrefix}
                  {qNum}
                </span>
              ))}
              <span className="text-[9.5px] font-mono text-slate-600">
                ({cell.percentageOfTotal}%)
              </span>
            </div>
            {heatmapEnabled && cellHeatmap && cellHeatmap.level !== "NONE" && (
              <div className="pt-0.5 flex items-center justify-center">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-black border ${cellHeatmap.badgeClass}`}
                  title={isFr ? cellHeatmap.labelFr : cellHeatmap.labelAr}
                >
                  <span>
                    {cellHeatmap.level === "HIGH"
                      ? isFr
                        ? `Densité Haute ${cellHeatmap.densityScore}%`
                        : `كثافة عالية ${cellHeatmap.densityScore}%`
                      : cellHeatmap.level === "LOW"
                      ? isFr
                        ? `Densité Basse ${cellHeatmap.densityScore}%`
                        : `كثافة منخفضة ${cellHeatmap.densityScore}%`
                      : isFr
                      ? `Densité Moy. ${cellHeatmap.densityScore}%`
                      : `كثافة متوسطة ${cellHeatmap.densityScore}%`}
                  </span>
                </span>
              </div>
            )}
          </div>
        );
      };

      const renderDeltaBadge = (delta: number) => {
        const abs = Math.abs(delta);
        const sign = delta > 0 ? `+${delta}%` : `${delta}%`;
        if (abs <= 3) {
          return (
            <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              {delta === 0 ? (isFr ? "Exact" : "مطابق") : sign}
            </span>
          );
        }
        if (abs <= 8) {
          return (
            <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
              Δ {sign}
            </span>
          );
        }
        return (
          <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 border border-rose-300">
            Δ {sign}
          </span>
        );
      };

      const renderHeatmapControlStrip = () => (
        <div className="bg-slate-900 text-white rounded-xl p-2.5 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-[11px]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setHeatmapEnabled((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg font-black text-[11px] border transition flex items-center gap-1.5 cursor-pointer ${
                heatmapEnabled
                  ? "bg-gradient-to-r from-rose-600 via-amber-500 to-sky-600 text-white border-white/30 shadow-xs"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
              title="تفعيل أو إيقاف تلوين الخلايا والدروس تلقائياً حسب كثافة توزيع المهارات (Heatmap)"
            >
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span>
                نظام الخريطة الحرارية (Heatmap):{" "}
                {heatmapEnabled ? "مفعّل تلقائياً" : "متوقف"}
              </span>
            </button>

            {heatmapEnabled && (
              <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
                {(
                  [
                    {
                      id: "COMPOSITE_SKILL_DENSITY",
                      label: "الكثافة المهارية المركبة",
                    },
                    {
                      id: "POINTS_SHARE",
                      label: "تركيز النقط والأوزان",
                    },
                    {
                      id: "QUESTIONS_INTENSITY",
                      label: "كثافة الأسئلة الفرعية",
                    },
                  ] as { id: HeatmapMetricMode; label: string }[]
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setHeatmapMetric(m.id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                      heatmapMetric === m.id
                        ? "bg-cyan-400 text-slate-950 font-black"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thermal Legend: Blue (Low) -> Amber (Medium) -> Red (High) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-600 text-white font-bold border border-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-200" />
              <span>أزرق: كثافة مهارية منخفضة</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>برتقالي: كثافة متوسطة</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold border border-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-200" />
              <span>أحمر: كثافة مهارية عالية</span>
            </span>
          </div>
        </div>
      );

      // ========================================================================
      // 1. وضع الطباعة والمعاينة الورقية الرسمية A4 (Print Mode)
      // ========================================================================
      if (variant === "print") {
        return (
          <div className="mt-3 pt-3 border-t-2 border-slate-300 space-y-2.5 avoid-break">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-950 text-cyan-300 font-mono text-[10px] font-black px-2 py-0.5 rounded">
                  MATRICE 2D · 142-08
                </span>
                <span className="font-black text-indigo-950">
                  {isFr
                    ? "Tableau de Spécification Bidimensionnel 2D (Chapitres × Niveaux Taxonomiques N1 / N2 / N3) :"
                    : "مصفوفة التخصيص ثنائية الأبعاد 2D (تقاطع الدروس والقدرات مع المستويات المهارية N1 و N2 و N3):"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9.5px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
                  {isFr ? "Rouge : Densité Haute" : "أحمر: كثافة مهارية عالية"}
                </span>
                <span className="font-mono text-[9.5px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300">
                  {isFr ? "Bleu : Densité Basse" : "أزرق: كثافة مهارية منخفضة"}
                </span>
                <span
                  className={`font-mono text-[10.5px] font-extrabold px-2 py-0.5 rounded border ${
                    spec2D.inspectorAuditStatus === "CONFORME"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                      : spec2D.inspectorAuditStatus === "TOLERANCE"
                      ? "bg-amber-50 text-amber-900 border-amber-300"
                      : "bg-rose-50 text-rose-900 border-rose-300"
                  }`}
                >
                  {isFr
                    ? `Indice de conformité : ${spec2D.conformityScore}%`
                    : `مؤشر مطابقة المفتشية (142-08) : ${spec2D.conformityScore}%`}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-400 text-[10.5px] bg-white">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold">
                    <th className="border border-slate-400 p-1.5 text-start">
                      {isFr
                        ? "Composante / Chapitre & Capacités ciblées (OP 2007)"
                        : "المكون / الدرس والقدرات المنتظرة المستهدفة (OP 2007)"}
                    </th>
                    <th className="border border-slate-400 p-1.5 text-center bg-sky-50/70 w-32">
                      <div>
                        {isFr ? "N1 : Application" : "N1 : تطبيق مباشر"}
                      </div>
                      <div className="text-[9.5px] font-mono text-sky-900">
                        {isFr ? `Cible : ${n1}%` : `المستهدف: ${n1}%`} (
                        {((n1 * 20) / 100).toFixed(1)} {isFr ? "pt" : "ن"})
                      </div>
                    </th>
                    <th className="border border-slate-400 p-1.5 text-center bg-indigo-50/70 w-32">
                      <div>
                        {isFr ? "N2 : Mobilisation" : "N2 : استدلال وتعبئة"}
                      </div>
                      <div className="text-[9.5px] font-mono text-indigo-900">
                        {isFr ? `Cible : ${n2}%` : `المستهدف: ${n2}%`} (
                        {((n2 * 20) / 100).toFixed(1)} {isFr ? "pt" : "ن"})
                      </div>
                    </th>
                    <th className="border border-slate-400 p-1.5 text-center bg-amber-50/70 w-32">
                      <div>
                        {isFr ? "N3 : Synthèse" : "N3 : توليف ومبادرة"}
                      </div>
                      <div className="text-[9.5px] font-mono text-amber-900">
                        {isFr ? `Cible : ${n3}%` : `المستهدف: ${n3}%`} (
                        {((n3 * 20) / 100).toFixed(1)} {isFr ? "pt" : "ن"})
                      </div>
                    </th>
                    <th className="border border-slate-400 p-1.5 text-center w-16">
                      {isFr ? "Poids" : "الوزن"}
                    </th>
                    <th className="border border-slate-400 p-1.5 text-center w-16">
                      {isFr ? "Durée" : "الزمن"}
                    </th>
                    <th className="border border-slate-400 p-1.5 text-center w-24 bg-emerald-50/60">
                      {isFr ? "Barème (/20)" : "المجموع (/20)"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {spec2D.rows.map((r, rIdx) => {
                    const caps = (isFr ? r.capacitiesFr : r.capacitiesAr).slice(0, 2);
                    const rowHeat = heatmapAnalysis.rowStyles[rIdx];
                    const cellHeat = heatmapAnalysis.cellStylesByRow[rIdx];
                    return (
                      <tr
                        key={rIdx}
                        className={`border-b border-slate-300 ${
                          heatmapEnabled && rowHeat ? rowHeat.rowAccentClass : ""
                        }`}
                      >
                        <td className="border border-slate-400 p-1.5 align-top">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="font-extrabold text-slate-950">
                              {isFr
                                ? `Ex. ${r.lessonIndex} : ${r.lessonTitleFr}`
                                : `التمرين ${r.lessonIndex} : ${r.lessonTitleAr}`}
                            </span>
                            {heatmapEnabled && rowHeat && rowHeat.level !== "NONE" && (
                              <span
                                className={`font-mono text-[8.5px] font-black px-1.5 py-0.2 rounded border ${rowHeat.badgeClass}`}
                              >
                                {isFr ? rowHeat.labelFr : rowHeat.shortTagAr}
                              </span>
                            )}
                          </div>
                          {caps.length > 0 && (
                            <div className="text-[9.5px] text-slate-600 mt-0.5 leading-snug">
                              {caps.map((c, cIdx) => (
                                <span key={cIdx} className="block">
                                  • <MathText text={c} inline />
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td
                          className={`border border-slate-400 p-1.5 text-center align-middle ${
                            heatmapEnabled && cellHeat?.n1
                              ? cellHeat.n1.cellBgClass
                              : "bg-sky-50/20"
                          }`}
                        >
                          {renderCellContent(
                            r.n1,
                            "text-sky-950",
                            "bg-sky-50 text-sky-900 border-sky-200",
                            cellHeat?.n1
                          )}
                        </td>
                        <td
                          className={`border border-slate-400 p-1.5 text-center align-middle ${
                            heatmapEnabled && cellHeat?.n2
                              ? cellHeat.n2.cellBgClass
                              : "bg-indigo-50/20"
                          }`}
                        >
                          {renderCellContent(
                            r.n2,
                            "text-indigo-950",
                            "bg-indigo-50 text-indigo-900 border-indigo-200",
                            cellHeat?.n2
                          )}
                        </td>
                        <td
                          className={`border border-slate-400 p-1.5 text-center align-middle ${
                            heatmapEnabled && cellHeat?.n3
                              ? cellHeat.n3.cellBgClass
                              : "bg-amber-50/20"
                          }`}
                        >
                          {renderCellContent(
                            r.n3,
                            "text-amber-950",
                            "bg-amber-50 text-amber-900 border-amber-200",
                            cellHeat?.n3
                          )}
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono font-bold tabular-nums">
                          {r.weightPercent}%
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono text-slate-700 tabular-nums">
                          ~{r.estimatedMinutes} {isFr ? "min" : "د"}
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono font-black text-indigo-950 bg-emerald-50/20 tabular-nums">
                          <div>{r.totalPoints.toFixed(2)} pts</div>
                          <div className="text-[9px] font-normal text-slate-600">
                            ({r.totalQuestions} {isFr ? "questions" : "أسئلة"})
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black text-slate-950">
                    <td className="border border-slate-400 p-1.5 text-end">
                      {isFr
                        ? `Total Général (${spec2D.totals.grandTotalQuestions} questions)`
                        : `المجموع العام للفرض (${spec2D.totals.grandTotalQuestions} سؤالاً)`}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono bg-sky-100/60">
                      <div>
                        {spec2D.totals.n1Questions}Q · {spec2D.totals.n1Points.toFixed(2)}{" "}
                        {isFr ? "pt" : "ن"}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className="text-[9.5px] text-sky-950">
                          {isFr ? "Effectif :" : "الفعلي:"} {spec2D.totals.n1Percent}%
                        </span>
                        {renderDeltaBadge(spec2D.deviations.n1Delta)}
                      </div>
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono bg-indigo-100/60">
                      <div>
                        {spec2D.totals.n2Questions}Q · {spec2D.totals.n2Points.toFixed(2)}{" "}
                        {isFr ? "pt" : "ن"}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className="text-[9.5px] text-indigo-950">
                          {isFr ? "Effectif :" : "الفعلي:"} {spec2D.totals.n2Percent}%
                        </span>
                        {renderDeltaBadge(spec2D.deviations.n2Delta)}
                      </div>
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono bg-amber-100/60">
                      <div>
                        {spec2D.totals.n3Questions}Q · {spec2D.totals.n3Points.toFixed(2)}{" "}
                        {isFr ? "pt" : "ن"}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className="text-[9.5px] text-amber-950">
                          {isFr ? "Effectif :" : "الفعلي:"} {spec2D.totals.n3Percent}%
                        </span>
                        {renderDeltaBadge(spec2D.deviations.n3Delta)}
                      </div>
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono">
                      100%
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono">
                      {spec2D.totals.totalEstimatedMinutes} {isFr ? "min" : "د"}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono text-indigo-950 bg-emerald-100/70">
                      {spec2D.totals.grandTotalPoints.toFixed(2)} / 20
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* خلاصة وتأشيرة المفتش التربوي حول التوازن المهاري ثنائي الأبعاد + تشخيص المكتسبات */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 space-y-1 text-[10px] text-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    {isFr
                      ? spec2D.inspectorVerdictFr
                      : spec2D.inspectorVerdictAr}
                  </span>
                </div>
                <span className="font-mono text-[9.5px] font-bold text-indigo-950 shrink-0">
                  {isFr
                    ? "Visa d'Audit Pédagogique · Note 142-08 & AEFE"
                    : "تأشيرة التدقيق الديداكتيكي · المذكرة 142-08 و AEFE"}
                </span>
              </div>
              <div className="pt-1 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-slate-600">
                <span>
                  {isFr
                    ? adaptiveResult.inspectorDiagnosticSummaryFr
                    : adaptiveResult.inspectorDiagnosticSummaryAr}
                </span>
                <span className="font-mono font-bold text-emerald-800 shrink-0">
                  {isFr
                    ? `Maîtrise N1: ${adaptiveResult.globalN1MasteryPct}% · N2: ${adaptiveResult.globalN2MasteryPct}% · N3: ${adaptiveResult.globalN3MasteryPct}%`
                    : `التحكم الفعلي — N1: ${adaptiveResult.globalN1MasteryPct}% · N2: ${adaptiveResult.globalN2MasteryPct}% · N3: ${adaptiveResult.globalN3MasteryPct}%`}
                </span>
              </div>
            </div>
          </div>
        );
      }

      const filteredLessonsForSkillTable =
        selectedLessonFilter === "ALL"
          ? lessons
          : lessons.filter((l) => l.lessonFr === selectedLessonFilter);

      // ========================================================================
      // 2. الوضع التفاعلي لمرصد المفتش التربوي ولوحة الإعدادات (Interactive Mode)
      // ========================================================================
      return (
        <div className="rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/60 p-4 space-y-3.5 shadow-2xs">
          {/* Header & Inspector Conformity Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 text-cyan-300 border border-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                <Table2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs md:text-sm font-black text-slate-950">
                    مصفوفة التخصيص ثنائية الأبعاد (2D) وكفايات AEFE الست ونظام الخريطة الحرارية (Heatmap)
                  </h4>
                  <span
                    className={`text-[10.5px] font-mono font-black px-2 py-0.5 rounded-md border tabular-nums ${
                      spec2D.inspectorAuditStatus === "CONFORME"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : spec2D.inspectorAuditStatus === "TOLERANCE"
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-rose-100 text-rose-900 border-rose-300"
                    }`}
                  >
                    مؤشر المطابقة 142-08 : {spec2D.conformityScore}%
                  </span>
                  <span className="text-[10.5px] font-mono font-black px-2 py-0.5 rounded-md border bg-purple-100 text-purple-900 border-purple-300 tabular-nums">
                    توافق كفايات AEFE : {aefeMatrixData.aefeAlignmentScore}%
                  </span>
                  <span className="text-[10.5px] font-mono font-black px-2 py-0.5 rounded-md border bg-sky-100 text-sky-900 border-sky-300 tabular-nums">
                    مؤشر اكتساب القسم : {adaptiveResult.globalMasteryIndex}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  ربط تقاطعي بين الدروس والمهارات (N1/N2/N3) والكفايات الست المعتمدة في AEFE مع تلوين حراري تلقائي (Heatmap: الأحمر للكثافة المهارية العالية والأزرق للمنخفضة).
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {onToggleIncludeInSheet && (
                <button
                  type="button"
                  onClick={() => onToggleIncludeInSheet(!include2DSpecMatrix)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border transition flex items-center gap-1.5 cursor-pointer ${
                    include2DSpecMatrix
                      ? "bg-indigo-950 text-cyan-300 border-indigo-900 shadow-2xs"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {include2DSpecMatrix
                      ? "✓ مدمجة في ورقة الفرض A4"
                      : "+ إدراج في ورقة الفرض A4"}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportHTMLReport}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-black bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-900 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                title="تصدير التقرير البيداغوجي المدمج (مصفوفة التخصيص 2D + تقييم المهارات المكتسبة للتلاميذ)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>تصدير التقرير البيداغوجي المدمج</span>
              </button>

              {onApplyPresetRatios && (
                <button
                  type="button"
                  onClick={() => onApplyPresetRatios(35, 45, 20)}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-950 border border-teal-300 transition flex items-center gap-1 cursor-pointer"
                  title="ضبط النسب المهارية على معيار المفتشية العامة (35% N1 / 45% N2 / 20% N3)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>معيار المفتش (35/45/20)</span>
                </button>
              )}

              {onOpenBaremeModal && (
                <button
                  type="button"
                  onClick={onOpenBaremeModal}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-700" />
                  <span>تعديل مستويات الأسئلة</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleCopyCode("LATEX")}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition flex items-center gap-1 cursor-pointer"
                title="نسخ كود مصفوفة التخصيص 2D بصيغة LaTeX"
              >
                {copiedFormat === "LATEX" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800">تم نسخ LaTeX</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>كود LaTeX</span>
                  </>
                )}
              </button>

              {onOpenAdvancedStudio2D && (
                <button
                  type="button"
                  onClick={onOpenAdvancedStudio2D}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-700" />
                  <span>مختبر 2D الموسع</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-Tabs Navigation Bar inside 2D Specification Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSubTab("MATRIX_2D")}
              className={`px-3 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === "MATRIX_2D"
                  ? "bg-indigo-950 text-cyan-300 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <Table2 className="w-4 h-4 shrink-0" />
              <span>1. جدول التخصيص 2D (N1/N2/N3) + Heatmap</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("AEFE_COMPETENCIES_MATRIX")}
              className={`px-3 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === "AEFE_COMPETENCIES_MATRIX"
                  ? "bg-purple-900 text-amber-200 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-purple-50/60 border border-slate-200/80"
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>2. مصفوفة الكفايات الست (AEFE) ومقارنة الأوزان</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-100 text-purple-900">
                6 كفايات
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("STUDENT_SKILL_ASSESSMENT")}
              className={`px-3 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === "STUDENT_SKILL_ASSESSMENT"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-emerald-50/60 border border-slate-200/80"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>3. تقييم المهارات المكتسبة للتلاميذ</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-100 text-emerald-900">
                {studentEvaluations.length} تلميذ
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("ADAPTIVE_WEIGHTS_ENGINE")}
              className={`px-3 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === "ADAPTIVE_WEIGHTS_ENGINE"
                  ? "bg-amber-700 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-amber-50/60 border border-slate-200/80"
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>4. التحديث التلقائي للأوزان ودعم (N1/N2)</span>
            </button>
          </div>

          {appliedFeedbackBanner && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{appliedFeedbackBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setAppliedFeedbackBanner(null)}
                className="text-[11px] text-emerald-800 underline cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          )}

          {/* ==============================================================
              SUB-TAB 1: 2D SPECIFICATION MATRIX TABLE + HEATMAP SYSTEM
             ============================================================== */}
          {activeSubTab === "MATRIX_2D" && (
            <div className="space-y-3.5">
              {/* Heatmap Control Strip & Thermal Legend */}
              {renderHeatmapControlStrip()}

              {/* High vs Low Skill Density Diagnostic Strip */}
              {heatmapEnabled &&
                heatmapAnalysis.highestLesson &&
                heatmapAnalysis.lowestLesson && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl border border-rose-300 bg-rose-50/80 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-[10.5px] font-black text-rose-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                          <span>
                            الدرس ذو الكثافة المهارية الأعلى (اللون الأحمر — High Skill Density):
                          </span>
                        </div>
                        <div className="font-black text-rose-950 text-xs">
                          تمرين {heatmapAnalysis.highestLesson.lessonIndex} :{" "}
                          {heatmapAnalysis.highestLesson.lessonTitleAr}
                        </div>
                      </div>
                      <div className="text-end font-mono shrink-0">
                        <span className="inline-block px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10.5px]">
                          {heatmapAnalysis.highestStyle?.densityScore ?? 85}% كثافة
                        </span>
                        <div className="text-[10px] text-rose-900 mt-0.5 font-bold">
                          {heatmapAnalysis.highestLesson.totalQuestions} أسئلة ·{" "}
                          {heatmapAnalysis.highestLesson.totalPoints.toFixed(2)} ن (
                          {heatmapAnalysis.highestLesson.weightPercent}%)
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-sky-300 bg-sky-50/80 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-[10.5px] font-black text-sky-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
                          <span>
                            الدرس ذو الكثافة المهارية الأقل (اللون الأزرق — Low Skill Density):
                          </span>
                        </div>
                        <div className="font-black text-sky-950 text-xs">
                          تمرين {heatmapAnalysis.lowestLesson.lessonIndex} :{" "}
                          {heatmapAnalysis.lowestLesson.lessonTitleAr}
                        </div>
                      </div>
                      <div className="text-end font-mono shrink-0">
                        <span className="inline-block px-2 py-0.5 rounded bg-sky-600 text-white font-black text-[10.5px]">
                          {heatmapAnalysis.lowestStyle?.densityScore ?? 28}% كثافة
                        </span>
                        <div className="text-[10px] text-sky-900 mt-0.5 font-bold">
                          {heatmapAnalysis.lowestLesson.totalQuestions} أسئلة ·{" "}
                          {heatmapAnalysis.lowestLesson.totalPoints.toFixed(2)} ن (
                          {heatmapAnalysis.lowestLesson.weightPercent}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Target vs Actual Skill Comparison Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                {[
                  {
                    code: "N1",
                    title: "المستوى N1 : تطبيق مباشر للتعاريف والخاصيات",
                    target: spec2D.targetRatios.n1,
                    actualPct: spec2D.totals.n1Percent,
                    pts: spec2D.totals.n1Points,
                    qCount: spec2D.totals.n1Questions,
                    delta: spec2D.deviations.n1Delta,
                    barColor: "bg-sky-600",
                    cardBg: "bg-sky-50/50 border-sky-200/90",
                  },
                  {
                    code: "N2",
                    title: "المستوى N2 : استدلال وتعبئة الموارد",
                    target: spec2D.targetRatios.n2,
                    actualPct: spec2D.totals.n2Percent,
                    pts: spec2D.totals.n2Points,
                    qCount: spec2D.totals.n2Questions,
                    delta: spec2D.deviations.n2Delta,
                    barColor: "bg-indigo-600",
                    cardBg: "bg-indigo-50/50 border-indigo-200/90",
                  },
                  {
                    code: "N3",
                    title: "المستوى N3 : توليف، تعمق ومبادرة",
                    target: spec2D.targetRatios.n3,
                    actualPct: spec2D.totals.n3Percent,
                    pts: spec2D.totals.n3Points,
                    qCount: spec2D.totals.n3Questions,
                    delta: spec2D.deviations.n3Delta,
                    barColor: "bg-amber-600",
                    cardBg: "bg-amber-50/50 border-amber-200/90",
                  },
                ].map((lvl) => (
                  <div
                    key={lvl.code}
                    className={`p-2.5 rounded-xl border ${lvl.cardBg} space-y-1.5`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-black text-slate-900 text-[11px]">
                        {lvl.title}
                      </span>
                      {renderDeltaBadge(lvl.delta)}
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-600">
                        المستهدف: <strong>{lvl.target}%</strong> (
                        {((lvl.target * 20) / 100).toFixed(1)} ن)
                      </span>
                      <span className="font-black text-slate-950">
                        الفعلي: {lvl.actualPct}% ({lvl.pts.toFixed(2)} ن · {lvl.qCount} س)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full ${lvl.barColor} transition-all duration-300`}
                        style={{
                          width: `${Math.min(100, Math.max(4, lvl.actualPct))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 2D Cross-Tabulation Table with Automatic Skill-Density Heatmap */}
              <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                      <th className="p-2 text-start border-l border-slate-300">
                        التمرين / الدرس والقدرات المستهدفة (OP 2007) + مؤشر الكثافة الحراري
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 bg-sky-50/70 w-36">
                        <div>N1 : تطبيق مباشر</div>
                        <div className="text-[9.5px] font-mono text-sky-800">
                          المستهدف {n1}%
                        </div>
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 bg-indigo-50/70 w-36">
                        <div>N2 : استدلال وتعبئة</div>
                        <div className="text-[9.5px] font-mono text-indigo-800">
                          المستهدف {n2}%
                        </div>
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 bg-amber-50/70 w-36">
                        <div>N3 : توليف ومبادرة</div>
                        <div className="text-[9.5px] font-mono text-amber-800">
                          المستهدف {n3}%
                        </div>
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 w-24">
                        الوزن والكثافة
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 w-20">
                        الزمن
                      </th>
                      <th className="p-2 text-center bg-emerald-50/70 w-24">
                        النقط (/20)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {spec2D.rows.map((r, rIdx) => {
                      const rowHeat = heatmapAnalysis.rowStyles[rIdx];
                      const cellHeat = heatmapAnalysis.cellStylesByRow[rIdx];
                      return (
                        <tr
                          key={rIdx}
                          className={`border-b border-slate-200 transition ${
                            heatmapEnabled && rowHeat
                              ? rowHeat.rowAccentClass
                              : "hover:bg-slate-50/80"
                          }`}
                        >
                          <td className="p-2 border-l border-slate-200 align-top">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <div className="font-black text-slate-950 flex items-center gap-1.5">
                                <span className="bg-slate-900 text-cyan-300 font-mono text-[9.5px] px-1.5 py-0.2 rounded">
                                  تمرين {r.lessonIndex}
                                </span>
                                <span>{r.lessonTitleAr}</span>
                              </div>
                              {heatmapEnabled && rowHeat && rowHeat.level !== "NONE" && (
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${rowHeat.badgeClass}`}
                                >
                                  {rowHeat.labelAr} ({rowHeat.densityScore}%)
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                              {r.lessonTitleFr}
                            </div>
                            {r.capacitiesAr.length > 0 && (
                              <div className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">
                                القدرة: <MathText text={r.capacitiesAr[0]} inline />
                              </div>
                            )}
                            {heatmapEnabled && rowHeat && rowHeat.level !== "NONE" && (
                              <div className="mt-1.5 w-full h-1.5 bg-white/90 rounded-full overflow-hidden border border-slate-200">
                                <div
                                  className={`h-full ${rowHeat.barColorClass} transition-all duration-300`}
                                  style={{ width: `${rowHeat.densityScore}%` }}
                                />
                              </div>
                            )}
                          </td>
                          <td
                            className={`p-2 border-l border-slate-200 text-center transition ${
                              heatmapEnabled && cellHeat?.n1
                                ? `${cellHeat.n1.cellBgClass} ${cellHeat.n1.cellBorderClass}`
                                : "bg-sky-50/20"
                            }`}
                          >
                            {renderCellContent(
                              r.n1,
                              "text-sky-950",
                              "bg-sky-100/90 text-sky-900 border-sky-300",
                              cellHeat?.n1
                            )}
                          </td>
                          <td
                            className={`p-2 border-l border-slate-200 text-center transition ${
                              heatmapEnabled && cellHeat?.n2
                                ? `${cellHeat.n2.cellBgClass} ${cellHeat.n2.cellBorderClass}`
                                : "bg-indigo-50/20"
                            }`}
                          >
                            {renderCellContent(
                              r.n2,
                              "text-indigo-950",
                              "bg-indigo-100/90 text-indigo-900 border-indigo-300",
                              cellHeat?.n2
                            )}
                          </td>
                          <td
                            className={`p-2 border-l border-slate-200 text-center transition ${
                              heatmapEnabled && cellHeat?.n3
                                ? `${cellHeat.n3.cellBgClass} ${cellHeat.n3.cellBorderClass}`
                                : "bg-amber-50/20"
                            }`}
                          >
                            {renderCellContent(
                              r.n3,
                              "text-amber-950",
                              "bg-amber-100/90 text-amber-900 border-amber-300",
                              cellHeat?.n3
                            )}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-center font-mono font-bold text-slate-800 tabular-nums">
                            <div>{r.weightPercent}%</div>
                            {heatmapEnabled && rowHeat && (
                              <span
                                className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black border ${rowHeat.badgeClass}`}
                              >
                                {rowHeat.level === "HIGH"
                                  ? "عالية"
                                  : rowHeat.level === "LOW"
                                  ? "منخفضة"
                                  : "متوسطة"}
                              </span>
                            )}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-center font-mono text-slate-600 tabular-nums">
                            <span className="inline-flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {r.estimatedMinutes} د
                            </span>
                          </td>
                          <td className="p-2 text-center font-mono font-black text-indigo-950 bg-emerald-50/30 tabular-nums">
                            <div>{r.totalPoints.toFixed(2)} ن</div>
                            <div className="text-[9.5px] font-normal text-slate-500">
                              ({r.totalQuestions} أسئلة)
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-slate-950 border-t-2 border-slate-300">
                      <td className="p-2 text-end border-l border-slate-300">
                        المجموع العام للفرض ({spec2D.totals.grandTotalQuestions} سؤالاً)
                      </td>
                      <td className="p-2 text-center font-mono border-l border-slate-300 bg-sky-100/60">
                        <div>
                          {spec2D.totals.n1Questions} س · {spec2D.totals.n1Points.toFixed(2)}{" "}
                          ن ({spec2D.totals.n1Percent}%)
                        </div>
                      </td>
                      <td className="p-2 text-center font-mono border-l border-slate-300 bg-indigo-100/60">
                        <div>
                          {spec2D.totals.n2Questions} س · {spec2D.totals.n2Points.toFixed(2)}{" "}
                          ن ({spec2D.totals.n2Percent}%)
                        </div>
                      </td>
                      <td className="p-2 text-center font-mono border-l border-slate-300 bg-amber-100/60">
                        <div>
                          {spec2D.totals.n3Questions} س · {spec2D.totals.n3Points.toFixed(2)}{" "}
                          ن ({spec2D.totals.n3Percent}%)
                        </div>
                      </td>
                      <td className="p-2 text-center font-mono border-l border-slate-300">
                        100%
                      </td>
                      <td className="p-2 text-center font-mono border-l border-slate-300">
                        {spec2D.totals.totalEstimatedMinutes} د
                      </td>
                      <td className="p-2 text-center font-mono text-indigo-950 bg-emerald-100/80">
                        {spec2D.totals.grandTotalPoints.toFixed(2)} / 20
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              SUB-TAB 2: AEFE 6-COMPETENCIES MATRIX & LESSON WEIGHT COMPARISON
             ============================================================== */}
          {activeSubTab === "AEFE_COMPETENCIES_MATRIX" && (
            <div className="space-y-3.5">
              {/* Heatmap Control Strip */}
              {renderHeatmapControlStrip()}

              {/* Top Header & Profile Switcher + Weight Sync Actions */}
              <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Award className="w-4 h-4 text-purple-900 shrink-0" />
                      <h5 className="text-xs font-black text-purple-950">
                        مصفوفة التخصيص وفق الكفايات الست المعتمدة في AEFE (Les 6 Compétences Mathématiques) ومقارنتها مع الأوزان الحالية للدروس
                      </h5>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-purple-900 text-amber-200">
                        مؤشر توافق الأوزان: {aefeMatrixData.aefeAlignmentScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      تحليل تقاطعي يوزع نقط وأسئلة كل درس على الكفايات الست الرسمية في التعليم الفرنسي (Chercher, Modéliser, Représenter, Raisonner, Calculer, Communiquer) ويقارن وزن كل درس الحالي (المذكرة 142-08) بوزنه المهاري المرجعي في نظام AEFE.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <select
                      value={aefeProfileMode}
                      onChange={(e) =>
                        setAefeProfileMode(e.target.value as AefeProfileMode)
                      }
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white border border-purple-300 text-purple-950"
                      aria-label="نسق كفايات AEFE المرجعي"
                    >
                      <option value="STANDARD_AEFE">
                        {AEFE_PROFILE_TARGETS.STANDARD_AEFE.labelAr}
                      </option>
                      <option value="BAC_SCIENTIFIQUE">
                        {AEFE_PROFILE_TARGETS.BAC_SCIENTIFIQUE.labelAr}
                      </option>
                      <option value="RESOLUTION_PROBLEMES">
                        {AEFE_PROFILE_TARGETS.RESOLUTION_PROBLEMES.labelAr}
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleApplyAefeCompetencyWeights("FULL_AEFE")}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-purple-900 hover:bg-purple-800 text-amber-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="تطبيق أوزان الدروس المشتقة من الكفايات الست AEFE على الفرض الحالي"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>اعتماد أوزان كفايات AEFE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyAefeCompetencyWeights("HYBRID_50_50")}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-950 hover:bg-indigo-900 text-cyan-300 transition flex items-center gap-1 cursor-pointer"
                      title="موازنة توافقية 50/50 بين الأوزان الحالية (142-08) وأوزان كفايات AEFE"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>موازنة توافقية (142-08 × AEFE)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyAefeCode("AEFE_LATEX")}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormat === "AEFE_LATEX" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-800">تم نسخ LaTeX</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>LaTeX (AEFE)</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyAefeCode("AEFE_TYPST")}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormat === "AEFE_TYPST" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-800">تم نسخ Typst</span>
                        </>
                      ) : (
                        <>
                          <FileCode2 className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Typst (AEFE)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 AEFE Competencies Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                {aefeMatrixData.competencyTotals.map((ct) => (
                  <div
                    key={ct.meta.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-black text-[11px] text-purple-950">
                        {ct.meta.labelFr}
                      </span>
                      {renderDeltaBadge(ct.deltaPercent)}
                    </div>
                    <div className="text-[10.5px] font-bold text-slate-800">
                      {ct.meta.shortAr}
                    </div>
                    <div className="text-[9.5px] text-slate-500 line-clamp-2 leading-snug">
                      {ct.meta.descAr}
                    </div>
                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-500">
                        المستهدف: {ct.targetPercent}%
                      </span>
                      <span className="font-black text-indigo-950">
                        {ct.totalPoints.toFixed(2)} ن ({ct.actualPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-700 transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(6, ct.actualPercent * 2.5))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AEFE 6-Competencies Cross-Tabulation Table + Lesson Weight Comparison */}
              <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                      <th className="p-2 text-start border-l border-slate-300 min-w-[185px]">
                        الدرس / التمرين والكثافة المهارية (Heatmap)
                      </th>
                      {AEFE_SIX_COMPETENCIES_META.map((comp) => (
                        <th
                          key={comp.id}
                          className="p-1.5 text-center border-l border-slate-300 bg-purple-50/50 min-w-[96px]"
                        >
                          <div className="font-mono font-black text-purple-950 text-[10.5px]">
                            {comp.labelFr}
                          </div>
                          <div className="text-[9.5px] text-slate-700">
                            {comp.shortAr} ({aefeMatrixData.profile.targets[comp.id]}%)
                          </div>
                        </th>
                      ))}
                      <th className="p-2 text-center border-l border-slate-300 bg-sky-50/70 w-24">
                        <div>الوزن الحالي</div>
                        <div className="text-[9px] font-mono text-sky-900">
                          (المذكرة 142-08)
                        </div>
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 bg-purple-100/70 w-24">
                        <div>وزن كفايات AEFE</div>
                        <div className="text-[9px] font-mono text-purple-900">
                          (المرجعي المقترح)
                        </div>
                      </th>
                      <th className="p-2 text-center bg-emerald-50/70 min-w-[130px]">
                        مقارنة الأوزان والفارق (Δ)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {aefeMatrixData.enrichedRows.map((er, idx) => {
                      const dominantMeta =
                        AEFE_SIX_COMPETENCIES_META.find(
                          (c) => c.id === er.dominantCompId
                        ) || AEFE_SIX_COMPETENCIES_META[3];
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-slate-200 transition ${
                            heatmapEnabled
                              ? er.rowHeatmap.rowAccentClass
                              : "hover:bg-slate-50/80"
                          }`}
                        >
                          <td className="p-2 border-l border-slate-200 align-top">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="font-black text-slate-950">
                                تمرين {er.row.lessonIndex} : {er.row.lessonTitleAr}
                              </span>
                              {heatmapEnabled && er.rowHeatmap.level !== "NONE" && (
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black border ${er.rowHeatmap.badgeClass}`}
                                >
                                  {er.rowHeatmap.shortTagAr}
                                </span>
                              )}
                            </div>
                            <div className="text-[9.5px] font-mono text-slate-500 mt-0.5">
                              {er.row.lessonTitleFr}
                            </div>
                            <div className="text-[9.5px] text-purple-900 font-bold mt-1">
                              الكفاية المهيمنة: {dominantMeta.labelFr} ({dominantMeta.shortAr})
                            </div>
                          </td>

                          {AEFE_SIX_COMPETENCIES_META.map((comp) => {
                            const cCell = er.cells[comp.id];
                            return (
                              <td
                                key={comp.id}
                                className={`p-1.5 border-l border-slate-200 text-center align-middle transition ${
                                  heatmapEnabled
                                    ? `${cCell.heatmap.cellBgClass} ${cCell.heatmap.cellBorderClass}`
                                    : ""
                                }`}
                              >
                                <div
                                  className={`font-mono font-black text-[11px] tabular-nums ${
                                    heatmapEnabled
                                      ? cCell.heatmap.textClass
                                      : "text-slate-900"
                                  }`}
                                >
                                  {cCell.points.toFixed(2)} ن
                                </div>
                                <div className="text-[9.5px] font-mono text-slate-600">
                                  ({cCell.percentOfLesson}% من الدرس)
                                </div>
                                {heatmapEnabled && cCell.heatmap.level !== "NONE" && (
                                  <span
                                    className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[8.5px] font-mono font-black border ${cCell.heatmap.badgeClass}`}
                                  >
                                    {cCell.heatmap.level === "HIGH"
                                      ? "كثافة عالية"
                                      : cCell.heatmap.level === "LOW"
                                      ? "كثافة منخفضة"
                                      : "متوسطة"}
                                  </span>
                                )}
                              </td>
                            );
                          })}

                          {/* Current Lesson Weight */}
                          <td className="p-2 border-l border-slate-200 text-center font-mono bg-sky-50/30 tabular-nums">
                            <div className="font-black text-sky-950 text-xs">
                              {er.currentWeightPercent}%
                            </div>
                            <div className="text-[9.5px] text-slate-600">
                              ({er.row.totalPoints.toFixed(2)} / 20 ن)
                            </div>
                          </td>

                          {/* AEFE Competency Weight */}
                          <td className="p-2 border-l border-slate-200 text-center font-mono bg-purple-50/40 tabular-nums">
                            <div className="font-black text-purple-950 text-xs">
                              {er.aefeWeightPercent}%
                            </div>
                            <div className="text-[9.5px] text-purple-800">
                              ({er.aefePointsOn20.toFixed(2)} / 20 ن)
                            </div>
                          </td>

                          {/* Comparison & Delta */}
                          <td className="p-2 text-center align-middle space-y-1">
                            <div className="flex items-center justify-center gap-1">
                              {renderDeltaBadge(er.weightDelta)}
                            </div>
                            <div className="text-[9.5px] font-bold text-slate-700">
                              {Math.abs(er.weightDelta) <= 3
                                ? "متطابق مع كفايات AEFE"
                                : er.weightDelta > 0
                                ? "ثقل مهاري AEFE أعلى من الوزن الحالي"
                                : "الوزن الحالي أعلى من ثقل AEFE"}
                            </div>
                            {/* Dual Mini Comparison Bars */}
                            <div className="space-y-0.5 pt-0.5">
                              <div
                                className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                                title={`الوزن الحالي: ${er.currentWeightPercent}%`}
                              >
                                <div
                                  className="h-full bg-sky-600"
                                  style={{
                                    width: `${Math.min(100, er.currentWeightPercent)}%`,
                                  }}
                                />
                              </div>
                              <div
                                className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                                title={`وزن كفايات AEFE: ${er.aefeWeightPercent}%`}
                              >
                                <div
                                  className="h-full bg-purple-700"
                                  style={{
                                    width: `${Math.min(100, er.aefeWeightPercent)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-slate-950 border-t-2 border-slate-300">
                      <td className="p-2 text-end border-l border-slate-300">
                        مجموع النقط والنسب الفعلية للكفايات الست (/20)
                      </td>
                      {aefeMatrixData.competencyTotals.map((ct) => (
                        <td
                          key={ct.meta.id}
                          className="p-1.5 text-center font-mono border-l border-slate-300 bg-purple-100/50 tabular-nums"
                        >
                          <div>{ct.totalPoints.toFixed(2)} ن</div>
                          <div className="text-[9.5px] text-purple-900">
                            الفعلي: {ct.actualPercent}% (المستهدف {ct.targetPercent}%)
                          </div>
                        </td>
                      ))}
                      <td className="p-2 text-center font-mono border-l border-slate-300 bg-sky-100/60">
                        100%
                      </td>
                      <td className="p-2 text-center font-mono border-l border-slate-300 bg-purple-100/60">
                        100%
                      </td>
                      <td className="p-2 text-center font-mono text-emerald-950 bg-emerald-100/70">
                        توافق: {aefeMatrixData.aefeAlignmentScore}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}


          {/* ==============================================================
              SUB-TAB 2: STUDENT SKILL ACQUISITION ASSESSMENT & REPORT EXPORT
             ============================================================== */}
          {activeSubTab === "STUDENT_SKILL_ASSESSMENT" && (
            <div className="space-y-3.5">
              {/* Top Toolbar: Legend, Filter, Simulation & Export Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-emerald-950">
                      سجل المفتش التربوي لتقييم المهارات المكتسبة لكل تلميذ عبر جدول التخصيص 2D:
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      مكتسبة ✓ (A)
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      في طور الاكتساب ≈ (ECA)
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
                      غير مكتسبة ✗ (NA)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    انقر على أي خلية مهارية (N1 أو N2 أو N3) لتبديل حالة التملك للتلميذ؛ يتم حفظ التقييمات وحساب الأوزان التكيفية تلقائياً.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <select
                    value={selectedLessonFilter}
                    onChange={(e) => setSelectedLessonFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white border border-slate-300 text-slate-800"
                    aria-label="تصفية حسب الدرس"
                  >
                    <option value="ALL">جميع دروس الفرض ({lessons.length})</option>
                    {lessons.map((l) => (
                      <option key={l.lessonFr} value={l.lessonFr}>
                        {l.lessonAr}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleSimulatePreset("WEAK_N1_N2")}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 transition cursor-pointer"
                    title="محاكاة نتائج فرض سابق بتعثر في المهارات الأساسية N1/N2"
                  >
                    محاكاة تعثر N1/N2
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulatePreset("REALISTIC_MIXED")}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer"
                  >
                    توزيع واقعي متباين
                  </button>

                  <button
                    type="button"
                    onClick={handleExportHTMLReport}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير التقرير البيداغوجي المدمج (A4 HTML)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSVReport}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-950 hover:bg-indigo-900 text-cyan-300 transition flex items-center gap-1 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>تصدير Excel/CSV</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Strip */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-center">
                  <div className="text-[10.5px] text-slate-500">المؤشر العام للاكتساب</div>
                  <div className="text-base font-black font-mono text-indigo-950">
                    {adaptiveResult.globalMasteryIndex}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 text-center">
                  <div className="text-[10.5px] text-sky-800">تملك مهارات N1 (تطبيق)</div>
                  <div className="text-base font-black font-mono text-sky-900">
                    {adaptiveResult.globalN1MasteryPct}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-center">
                  <div className="text-[10.5px] text-indigo-800">تملك مهارات N2 (استدلال)</div>
                  <div className="text-base font-black font-mono text-indigo-900">
                    {adaptiveResult.globalN2MasteryPct}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 text-center">
                  <div className="text-[10.5px] text-amber-800">تملك مهارات N3 (توليف)</div>
                  <div className="text-base font-black font-mono text-amber-900">
                    {adaptiveResult.globalN3MasteryPct}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-center">
                  <div className="text-[10.5px] text-rose-800">تلاميذ في حاجة لدعم N1/N2</div>
                  <div className="text-base font-black font-mono text-rose-900">
                    {adaptiveResult.studentsNeedingSupportCount} /{" "}
                    {adaptiveResult.totalStudentsCount}
                  </div>
                </div>
              </div>

              {/* Per-Student Interactive 2D Skill Assessment Grid */}
              <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                      <th rowSpan={2} className="p-2 text-center border-l border-slate-300 w-9">
                        ر.ت
                      </th>
                      <th rowSpan={2} className="p-2 text-start border-l border-slate-300 min-w-[165px]">
                        التلميذ(ة) ورمز مسار (CNE)
                      </th>
                      <th rowSpan={2} className="p-2 text-center border-l border-slate-300 w-20 bg-slate-50">
                        نقطة الفرض السابق
                      </th>
                      {filteredLessonsForSkillTable.map((lesson) => (
                        <th
                          key={lesson.lessonFr}
                          colSpan={3}
                          className="p-1.5 text-center border-l border-slate-300 bg-indigo-50/60"
                        >
                          <div className="font-black text-indigo-950 text-[11px]">
                            {lesson.lessonAr}
                          </div>
                          <div className="text-[9.5px] font-mono text-slate-500">
                            {lesson.lessonFr}
                          </div>
                        </th>
                      ))}
                      <th rowSpan={2} className="p-2 text-start min-w-[180px]">
                        تشخيص المفتش / الأستاذ(ة)
                      </th>
                    </tr>
                    <tr className="bg-slate-50 text-[10px] font-mono font-bold border-b border-slate-300">
                      {filteredLessonsForSkillTable.map((lesson) => (
                        <React.Fragment key={`${lesson.lessonFr}_sub`}>
                          <th className="p-1 text-center border-l border-slate-200 bg-sky-50 text-sky-900">
                            N1
                          </th>
                          <th className="p-1 text-center border-l border-slate-200 bg-indigo-50 text-indigo-900">
                            N2
                          </th>
                          <th className="p-1 text-center border-l border-slate-300 bg-amber-50 text-amber-900">
                            N3
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentEvaluations.map((student, sIdx) => {
                      const renderSkillBtn = (
                        lessonFr: string,
                        skillKey: "n1Status" | "n2Status" | "n3Status",
                        status: SkillAcquisitionLevel
                      ) => {
                        const meta = SKILL_ACQUISITION_META[status];
                        return (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStudentSkill(student.studentId, lessonFr, skillKey)
                            }
                            className={`w-full px-1.5 py-1 rounded text-[10px] font-black border transition cursor-pointer ${meta.bgClass} ${meta.textClass} ${meta.borderClass} hover:opacity-85`}
                            title={`انقر لتغيير التقييم (${meta.labelAr})`}
                          >
                            {meta.shortAr}
                          </button>
                        );
                      };

                      return (
                        <tr
                          key={student.studentId}
                          className="border-b border-slate-200 hover:bg-slate-50/80 transition"
                        >
                          <td className="p-1.5 text-center font-mono font-bold text-slate-500 border-l border-slate-200">
                            {sIdx + 1}
                          </td>
                          <td className="p-1.5 border-l border-slate-200">
                            <div className="font-black text-slate-900">
                              {student.fullNameAr}
                            </div>
                            <div className="text-[9.5px] font-mono text-slate-500">
                              {student.cne} · {student.fullNameFr}
                            </div>
                          </td>
                          <td className="p-1.5 text-center font-mono font-black border-l border-slate-200 tabular-nums">
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                student.previousExamGrade20 >= 10
                                  ? "bg-emerald-50 text-emerald-800"
                                  : "bg-rose-50 text-rose-800"
                              }`}
                            >
                              {student.previousExamGrade20.toFixed(2)}
                            </span>
                          </td>
                          {filteredLessonsForSkillTable.map((lesson) => {
                            const rec = student.lessonRecords[lesson.lessonFr] || {
                              n1Status: "IN_PROGRESS",
                              n2Status: "IN_PROGRESS",
                              n3Status: "IN_PROGRESS",
                            };
                            return (
                              <React.Fragment key={`${student.studentId}_${lesson.lessonFr}`}>
                                <td className="p-1 border-l border-slate-200 text-center">
                                  {renderSkillBtn(lesson.lessonFr, "n1Status", rec.n1Status)}
                                </td>
                                <td className="p-1 border-l border-slate-200 text-center">
                                  {renderSkillBtn(lesson.lessonFr, "n2Status", rec.n2Status)}
                                </td>
                                <td className="p-1 border-l border-slate-300 text-center">
                                  {renderSkillBtn(lesson.lessonFr, "n3Status", rec.n3Status)}
                                </td>
                              </React.Fragment>
                            );
                          })}
                          <td className="p-1.5 text-[10.5px] text-slate-600">
                            {student.inspectorObservation}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              SUB-TAB 3: AUTOMATIC 2D WEIGHTS RECALIBRATION & N1/N2 REMEDIAL EXERCISES
             ============================================================== */}
          {activeSubTab === "ADAPTIVE_WEIGHTS_ENGINE" && (
            <div className="space-y-3.5">
              {/* Diagnostic & One-Click Action Header */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-800 shrink-0" />
                    <h5 className="text-xs font-black text-amber-950">
                      خوارزمية التحيين التلقائي لأوزان مصفوفة التخصيص 2D واقتراح التمارين الداعمة (N1/N2)
                    </h5>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyAdaptiveUpdate(false)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-indigo-950 hover:bg-indigo-900 text-cyan-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>تطبيق الأوزان المحينة فقط على المصفوفة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyAdaptiveUpdate(true)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>
                        تحديث الأوزان + إدراج التمارين الإضافية المقترحة (N1/N2) في الفرض
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  {adaptiveResult.inspectorDiagnosticSummaryAr}
                </p>
              </div>

              {/* Adaptive Recommendations & Suggested N1/N2 Exercises Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                      <th className="p-2 text-start border-l border-slate-300">
                        الدرس / الوحدة الدراسية
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 bg-sky-50/70">
                        تملك N1
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 bg-indigo-50/70">
                        تملك N2
                      </th>
                      <th className="p-2 text-center border-l border-slate-300">
                        الوزن السابق
                      </th>
                      <th className="p-2 text-center border-l border-slate-300 bg-emerald-50/70">
                        الوزن المحيّن تلقائياً
                      </th>
                      <th className="p-2 text-center border-l border-slate-300">
                        أولوية الدعم (N1/N2)
                      </th>
                      <th className="p-2 text-start min-w-[290px]">
                        التمارين الإضافية المقترحة للفرض القادم (N1 / N2)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adaptiveResult.recommendations.map((rec) => (
                      <tr
                        key={rec.lessonFr}
                        className="border-b border-slate-200 hover:bg-slate-50/80 transition"
                      >
                        <td className="p-2 border-l border-slate-200 align-top">
                          <div className="font-black text-slate-950">{rec.lessonAr}</div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {rec.lessonFr}
                          </div>
                        </td>
                        <td className="p-2 border-l border-slate-200 text-center font-mono font-bold text-sky-900 bg-sky-50/20">
                          <div>{rec.n1MasteryPct}%</div>
                          <div className="text-[9.5px] text-rose-700">
                            ({rec.n1NotAcquiredCount} غير مكتسبة)
                          </div>
                        </td>
                        <td className="p-2 border-l border-slate-200 text-center font-mono font-bold text-indigo-900 bg-indigo-50/20">
                          <div>{rec.n2MasteryPct}%</div>
                          <div className="text-[9.5px] text-rose-700">
                            ({rec.n2NotAcquiredCount} غير مكتسبة)
                          </div>
                        </td>
                        <td className="p-2 border-l border-slate-200 text-center font-mono text-slate-600">
                          {rec.previousWeight}%
                        </td>
                        <td className="p-2 border-l border-slate-200 text-center font-mono font-black bg-emerald-50/30">
                          <span className="text-indigo-950 text-xs">
                            {rec.recommendedWeight}%
                          </span>
                          <span
                            className={`block text-[9.5px] ${
                              rec.weightDelta > 0
                                ? "text-emerald-700"
                                : rec.weightDelta < 0
                                ? "text-amber-700"
                                : "text-slate-500"
                            }`}
                          >
                            ({rec.weightDelta >= 0 ? `+${rec.weightDelta}%` : `${rec.weightDelta}%`})
                          </span>
                        </td>
                        <td className="p-2 border-l border-slate-200 text-center align-middle">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border ${
                              rec.priorityLevel === "CRITICAL_REMEDIATION"
                                ? "bg-rose-100 text-rose-900 border-rose-300"
                                : rec.priorityLevel === "MODERATE_SUPPORT"
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-emerald-100 text-emerald-900 border-emerald-300"
                            }`}
                          >
                            {rec.priorityLabelAr}
                          </span>
                        </td>
                        <td className="p-2 space-y-1.5">
                          {rec.suggestedExercises.map((ex) => (
                            <div
                              key={ex.id}
                              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10.5px]"
                            >
                              <div className="flex items-center justify-between gap-1 font-bold text-indigo-950">
                                <span>
                                  [{ex.level} · {ex.points} ن]{" "}
                                  <MathText text={ex.questionAr} inline />
                                </span>
                              </div>
                              <div className="text-[9.5px] text-slate-500 mt-0.5">
                                الهدف: {ex.pedagogicalGoalAr}
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inspector Verdict Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-slate-100 px-3.5 py-2 rounded-xl text-[11px]">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-bold">{spec2D.inspectorVerdictAr}</span>
            </div>
            <span className="font-mono text-[10px] text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 shrink-0">
              Note 142-08 · Cadre Référentiel
            </span>
          </div>
        </div>
      );
    }
  );

SpecMatrix2DInspectorCard.displayName = "SpecMatrix2DInspectorCard";

