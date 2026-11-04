import React from "react";
import {
  BilingualLayout,
  BRANCH_COLOR_THEMES,
  BranchColorGradientMode,
  computeExactExerciseEffectiveWeights,
  detectLessonBranchTheme,
  DMSubType,
  DOC_FONT_OPTIONS,
  DocFontFamily,
  DocFontSize,
  DocLanguage,
  DSQuestionDensity,
  ExamModel,
  FRENCH_COMPETENCIES,
  generateMoroccanQCMExercise,
  generateMoroccanSynthesisProblem,
  GeoGebraResource,
  getAutoGeoGebraResourceForLesson,
  getDistinctLessonBranchThemes,
  getQuestionBaremesAndLevels,
  getSerieAndDMExercises,
  getVariantQuestions,
  HeaderStyle,
  LessonHeaderIconId,
  LessonItem,
  ModuleType,
  MoroccanDSStructureMode,
  QCMGeneratorConfig,
  resolveBranchColorTheme,
  resolveLessonHeaderIcon,
  resolveMultiLessonRibbonGradient,
  SemesterType,
  SolutionDisplayMode,
  TRADITIONAL_TITLE_FONT_OPTIONS,
  formatTitleWithCalligraphyOrnaments,
  getExamenBlanc2BacConfig,
  TrackData,
} from "../data/curriculum";
import { AdvancedPedagogyTabId } from "./AdvancedMathPedagogyModal";
import {
  AppliedTitleCalligraphyConfig,
  MoroccanHeaderSvgBanner,
} from "./ArabicCalligraphySimulator";
import { TeacherLogo, TeacherLogoVariant } from "./TeacherLogo";
import { GeoGebraFigureCard } from "./GeoGebraFigureCard";
import { RichTextMathToolbar } from "./RichTextMathToolbar";
import { InsertedFigureCard } from "./InsertedFigureCard";
import { MathText } from "./MathRenderer";
import { SpecMatrix2DInspectorCard } from "./SpecMatrix2DInspectorCard";
import { InsertedFigure } from "../data/curriculum";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  Code2,
  Compass,
  FileSpreadsheet,
  Image as ImageIcon,
  Layers,
  Printer,
  Ruler,
  Scale,
  Settings,
  Sparkles,
  Upload,
  BrainCircuit,
  FileArchive,
  Play,
  QrCode,
  Terminal,
  Trash2,
} from "lucide-react";
import { InteractiveExamQrFooter } from "./InteractiveExamQrFooter";
import { buildInteractiveQuizLinkForDocument } from "../utils/qrCodeHelper";
import {
  A4LayoutOverflowReport,
  analyzeA4LayoutMetrics,
  computePrintMediaQueryMetrics,
  PrintPageSizePreset,
} from "../utils/pdfExporter";
import {
  PythonAlgorithmPreset,
  executeSimulatedPython,
} from "../data/pythonAlgorithms";
import {
  analyzeFullAnswerWorkspaceRequirement,
  DEFAULT_TCOLORBOX_CONFIG,
  formatMathTypography,
  getTcolorboxClasses,
  LATEX_PACKAGE_OPTIONS,
  LatexPackageTheme,
  PAPER_SURFACE_OPTIONS,
  PaperSurfaceTexture,
  StudentGridStyle,
  TCOLORBOX_FRAME_OPTIONS,
  TCOLORBOX_PALETTE_OPTIONS,
  TCOLORBOX_SHADING_OPTIONS,
  TcolorboxCustomConfig,
} from "../utils/latexPackagesAndMath";
import {
  BAC_CERTIFIED_CURVE_PRESETS,
  buildCustomEvaluationGrid,
  calculateExamTimeBalance,
  DEFAULT_MOROCCAN_CLASS_ROSTER,
  exportMassarPronoteGradeSheet,
  GridGranularity,
  MassarStudentEntry,
  parseMassarPronoteCSV,
} from "../utils/evaluationGridExporter";
import {
  generateExerciseCorrection,
  generateSerieBlockCorrection,
  ExerciseCorrection,
} from "../utils/correctionGenerator";
import { generateMoroccanDiagnosticPaper } from "../utils/diagnosticGenerator";
import {
  build2DSpecificationMatrix,
  generateOMRGridData,
  getTypicalErrorsForLessons,
  ExtendedExamModelCode,
} from "../utils/advancedPedagogicalTools";
import {
  generateCustomCountSerieExercises,
  getMoroccanLessonMemo,
  MoroccanDMType,
  MOROCCAN_DM_PRESETS,
} from "../utils/seriesGenerator";
import { generateFullMoroccanPedagogicalFiche } from "../utils/ficheGenerator";
import type {
  DifferentiatedPathConfig,
  LongitudinalCohortTrackerConfig,
} from "../utils/mathjsValidator";
import { OFFICIAL_DIDACTIC_CONSIGNES } from "../data/didacticConsignes";

interface PrintablePreviewProps {
  track: TrackData;
  sem: SemesterType;
  dsKey: string;
  school: string;
  prof: string;
  year: string;
  academy: string;
  direction: string;
  headerStyle: HeaderStyle;
  includeStudentBox: boolean;
  includeGradeBox: boolean;
  examModel: ExamModel;
  shuffleQuestions: boolean;
  shuffleExercises: boolean;
  docLang: DocLanguage;
  bilingualLayout: BilingualLayout;
  activeModule: ModuleType;
  n1: number;
  n2: number;
  n3: number;
  fillBlanks: boolean;
  includeTICE: boolean;
  selectedLessonIdx: number;
  diagDuration: string;
  diagType: string;
  showAnswerKey: boolean;
  includeDetailedSolutions?: boolean;
  solutionDisplayMode?: SolutionDisplayMode;
  onlyPrintSolutions?: boolean;
  system?: "MAROC_NATIONAL" | "MISSION_FRANCAISE";
  calculatorAllowed?: boolean;
  includeCompetencies?: boolean;
  customLessons?: LessonItem[];
  dmSubType?: DMSubType;
  dmNumber?: string;
  dmDueDate?: string;
  serieExerciseCount?: number;
  includeHints?: boolean;
  includeTeacherLogo?: boolean;
  logoVariant?: TeacherLogoVariant;
  includeLogoWatermark?: boolean;
  customLogoUrl?: string | null;
  customDocTitle?: string;
  customDocSubtitle?: string;
  customHeaderNote?: string;
  customExerciseTitles?: Record<number, string>;
  docFontFamily?: DocFontFamily;
  docFontSize?: DocFontSize;
  isInlineEditable?: boolean;
  showQuestionBareme?: boolean;
  includeAnswerWorkspace?: boolean;
  studentGridStyle?: StudentGridStyle;
  workspaceHeightMode?: "ADAPTIVE" | "COMPACT" | "GENEROUS";
  includeGradingScaleTable?: boolean;
  includeSelfEvalGrid?: boolean;
  geoGebraResourcesMap?: Record<string, GeoGebraResource>;
  autoAttachGeoGebra?: boolean;
  includeCustomEvalGridSheet?: boolean;
  onlyPrintEvalGrid?: boolean;
  evalGridGranularity?: GridGranularity;
  evalGridStudentCount?: number;
  pageOrientation?: "PORTRAIT" | "LANDSCAPE";
  onUpdateGeoGebraResource?: (lessonKey: string, resource: GeoGebraResource) => void;
  insertedFigures?: InsertedFigure[];
  onAddFigure?: (fig: InsertedFigure) => void;
  onUpdateFigure?: (fig: InsertedFigure) => void;
  onDeleteFigure?: (id: string) => void;
  dsStructureMode?: MoroccanDSStructureMode;
  dsQuestionDensity?: DSQuestionDensity;
  includeMoroccanExamDirectives?: boolean;
  handwrittenSolutionsOnly?: boolean;
  onChangeDocFontFamily?: (font: DocFontFamily) => void;
  moroccanDMType?: MoroccanDMType;
  includeLessonMemo?: boolean;
  includeDMContract?: boolean;
  ficheScenarioDisplayMode?: "GRID_OFFICIAL" | "CARDS_BY_SESSION" | "BOTH";
  ficheContentDetailLevel?: "FULL_WITH_PROOFS" | "SYNTHETIC_OFFICIAL";
  includeFichePlanningMatrix?: boolean;
  includeFicheTICE?: boolean;
  includeFicheFormativeEval?: boolean;
  includeExamFormulaSheet?: boolean;
  includeDSStudentSelfCheck?: boolean;
  includePostExamRemediationSheet?: boolean;
  includeOfficialExamCoverSheet?: boolean;
  appliedTitleCalligraphy?: AppliedTitleCalligraphyConfig;
  latexPackageTheme?: LatexPackageTheme;
  onChangeLatexPackageTheme?: (pkg: LatexPackageTheme) => void;
  tcolorboxConfig?: TcolorboxCustomConfig;
  onChangeTcolorboxConfig?: (cfg: TcolorboxCustomConfig) => void;
  paperSurface?: PaperSurfaceTexture;
  onChangePaperSurface?: (surf: PaperSurfaceTexture) => void;
  onOpenWolframVerifier?: () => void;
  include2DSpecMatrix?: boolean;
  includeOMRBubbleSheet?: boolean;
  omrQuestionCount?: number;
  enableFourModelsABCD?: boolean;
  includeDidacticVigilanceSheet?: boolean;
  onOpenAdvancedPedagogyStudio?: (tab?: AdvancedPedagogyTabId) => void;
  activeSyncSection?: string | null;
  enableBranchColorGradient?: boolean;
  branchColorMode?: BranchColorGradientMode;
  onChangeEnableBranchColorGradient?: (enabled: boolean) => void;
  onChangeBranchColorMode?: (mode: BranchColorGradientMode) => void;
  qcmConfig?: QCMGeneratorConfig;
  attachedPythonAlgorithms?: PythonAlgorithmPreset[];
  onOpenPythonLab?: () => void;
  onOpenAiAssistant?: () => void;
  onExportOverleafZipDirect?: () => void;
  onRemovePythonAlgorithm?: (id: string) => void;
  onChangeStudentGridStyle?: (style: StudentGridStyle) => void;
  includeIndividualGradingStrip?: boolean;
  includeRescueHintsAndContinuity?: boolean;
  onOpenBatchPrint?: () => void;
  showA4LivePageBreaks?: boolean;
  onToggleA4LivePageBreaks?: () => void;
  economicTwoUpPrintMode?: boolean;
  onToggleEconomicTwoUpPrintMode?: () => void;
  onOpenDidacticChecklist?: () => void;
  onOpenRemedialExam?: () => void;
  includeInteractiveQrFooter?: boolean;
  onToggleInteractiveQrFooter?: () => void;
  interactiveExamUrl?: string;
  onOpenInteractiveQuiz?: () => void;
  differentiatedPathConfig?: DifferentiatedPathConfig;
  longitudinalCohortConfig?: LongitudinalCohortTrackerConfig;
  onOpenMathInspectorStudio?: () => void;
  onSwitchDocumentViewModel?: (module: ModuleType, dmSubType?: DMSubType) => void;
  customPageMarginsMm?: {
    topMm: number;
    bottomMm: number;
    xMm: number;
    modelId: DocumentViewMarginModelId;
  } | null;
  onChangePageMarginsMm?: (
    margins: {
      topMm: number;
      bottomMm: number;
      xMm: number;
      modelId: DocumentViewMarginModelId;
    } | null
  ) => void;
  printPageSizePreset?: PrintPageSizePreset;
  customPageWidthMm?: number;
  customPageHeightMm?: number;
  simulatePrintMediaQuery?: boolean;
  onChangePrintPageSizePreset?: (preset: PrintPageSizePreset) => void;
  onChangeCustomPageDimensionsMm?: (widthMm: number, heightMm: number) => void;
  onToggleSimulatePrintMediaQuery?: () => void;
  selectedConsigneKeys?: string[];
  onChangeConsigneKeys?: (keys: string[]) => void;
  onOpenCompetencyBank?: () => void;
  onOpenMassarExport?: () => void;
  onOpenDiagnosticAnalysis?: () => void;
  onOpenBookletMode?: () => void;
  onOpenInteractiveQr?: () => void;
  isBookletPreviewMode?: boolean;
}

export type DocumentViewMarginModelId =
  | "DS_EXAM_OFFICIAL"
  | "SERIE_TD_COMPACT"
  | "DEVOIR_MAISON_BALANCED"
  | "DIAGNOSTIC_TEST"
  | "FICHE_PEDAGOGIQUE_WIDE"
  | "REPARTITION_ANNUELLE_WIDE";

export interface DocumentViewMarginModelSpec {
  id: DocumentViewMarginModelId;
  labelAr: string;
  labelFr: string;
  shortBadgeAr: string;
  shortBadgeFr: string;
  targetModule: ModuleType;
  targetDmSubType?: DMSubType;
  topMm: number;
  bottomMm: number;
  xMm: number;
  previewPadTopPx: number;
  previewPadBottomPx: number;
  previewPadXPx: number;
  verticalSpaceClass: string;
  descriptionAr: string;
  descriptionFr: string;
  accentColor: string;
}

export const DOC_VIEW_MARGIN_MODELS: DocumentViewMarginModelSpec[] = [
  {
    id: "DS_EXAM_OFFICIAL",
    labelAr: "نموذج الفرض المحروس",
    labelFr: "Modèle Devoir Surveillé (DS)",
    shortBadgeAr: "فرض محروس · هوامش رسمية (16×15mm)",
    shortBadgeFr: "DS Officiel (16×15mm)",
    targetModule: "DS_142_08",
    topMm: 16,
    bottomMm: 16,
    xMm: 15,
    previewPadTopPx: 32,
    previewPadBottomPx: 32,
    previewPadXPx: 36,
    verticalSpaceClass: "space-y-8",
    descriptionAr:
      "هوامش رسمية مريحة (1.6cm أعلى/أسفل · 1.5cm جانبياً) تمنح المتعلم مساحة بصرية واضحة لقراءة الأسئلة وسلم التنقيط والترويسة الوزارية.",
    descriptionFr:
      "Marges officielles aérées (1.6cm haut/bas · 1.5cm côtés) conformes à la note 142-08 pour le confort visuel en examen.",
    accentColor: "indigo",
  },
  {
    id: "SERIE_TD_COMPACT",
    labelAr: "نموذج سلسلة التمارين",
    labelFr: "Modèle Série d'Exercices (TD)",
    shortBadgeAr: "سلسلة تمارين · هوامش مدمجة (8×8mm)",
    shortBadgeFr: "Série TD Compacte (8×8mm)",
    targetModule: "DM_SERIE",
    targetDmSubType: "SERIE_TD",
    topMm: 8,
    bottomMm: 8,
    xMm: 8,
    previewPadTopPx: 14,
    previewPadBottomPx: 14,
    previewPadXPx: 16,
    verticalSpaceClass: "space-y-4",
    descriptionAr:
      "هوامش اقتصادية عالية الكثافة (0.8cm من جميع الجهات) تستثمر 87.4% من مساحة ورقة A4 لاستيعاب أكبر عدد من التمارين وتوفير حتى 35% من الورق.",
    descriptionFr:
      "Marges compactes haute densité (0.8cm partout) optimisant 87.4% de la feuille A4 pour regrouper un maximum d'exercices.",
    accentColor: "emerald",
  },
  {
    id: "DEVOIR_MAISON_BALANCED",
    labelAr: "نموذج الفرض المنزلي",
    labelFr: "Modèle Devoir Maison (DM)",
    shortBadgeAr: "فرض منزلي · هوامش متوازنة (12×12mm)",
    shortBadgeFr: "Devoir Maison (12×12mm)",
    targetModule: "DM_SERIE",
    targetDmSubType: "DEVOIR_MAISON",
    topMm: 12,
    bottomMm: 12,
    xMm: 12,
    previewPadTopPx: 22,
    previewPadBottomPx: 22,
    previewPadXPx: 24,
    verticalSpaceClass: "space-y-6",
    descriptionAr:
      "هوامش متوازنة (1.2cm من جميع الجهات) ملائمة للبحوث المنزلية، إرشادات التوجيه، وشبكة التقييم الذاتي للمتعلم.",
    descriptionFr:
      "Marges équilibrées (1.2cm) adaptées aux devoirs à la maison avec contrat didactique et auto-évaluation.",
    accentColor: "amber",
  },
  {
    id: "DIAGNOSTIC_TEST",
    labelAr: "نموذج الرائز التشخيصي",
    labelFr: "Modèle Test Diagnostique",
    shortBadgeAr: "رائز تشخيصي · هوامش قياسية (11×10mm)",
    shortBadgeFr: "Test Diagnostique (11×10mm)",
    targetModule: "DIAGNOSTIC",
    topMm: 11,
    bottomMm: 11,
    xMm: 10,
    previewPadTopPx: 18,
    previewPadBottomPx: 18,
    previewPadXPx: 20,
    verticalSpaceClass: "space-y-5",
    descriptionAr:
      "هوامش عملية (1.1cm أعلى/أسفل · 1.0cm جانبياً) مصممة لاحتواء أسئلة الروائز التشخيصية وخانات الإجابة السريعة في مطلع الموسم.",
    descriptionFr:
      "Marges fonctionnelles (1.1cm haut/bas · 1.0cm côtés) pour les tests diagnostiques de début d'année.",
    accentColor: "cyan",
  },
  {
    id: "FICHE_PEDAGOGIQUE_WIDE",
    labelAr: "نموذج الجذاذة التربوية",
    labelFr: "Modèle Fiche Pédagogique",
    shortBadgeAr: "جذاذة تربوية · هوامش عريضة (10×9mm)",
    shortBadgeFr: "Fiche OP 2007 (10×9mm)",
    targetModule: "FICHE_OP2007",
    topMm: 10,
    bottomMm: 10,
    xMm: 9,
    previewPadTopPx: 16,
    previewPadBottomPx: 16,
    previewPadXPx: 18,
    verticalSpaceClass: "space-y-4",
    descriptionAr:
      "هوامش عريضة للجداول الديداكتيكية (1.0cm أعلى/أسفل · 0.9cm جانبياً) لتوسيع أعمدة سيناريو الحصة وأنشطة الأستاذ والمتعلم.",
    descriptionFr:
      "Marges élargies (1.0cm haut/bas · 0.9cm côtés) pour maximiser la largeur des tableaux de scénario pédagogique.",
    accentColor: "violet",
  },
  {
    id: "REPARTITION_ANNUELLE_WIDE",
    labelAr: "نموذج التوزيع السنوي",
    labelFr: "Modèle Répartition Annuelle",
    shortBadgeAr: "توزيع سنوي · هوامش جداول عريضة (10×9mm)",
    shortBadgeFr: "Répartition Annuelle (10×9mm)",
    targetModule: "REPARTITION_CERTIF",
    topMm: 10,
    bottomMm: 10,
    xMm: 9,
    previewPadTopPx: 16,
    previewPadBottomPx: 16,
    previewPadXPx: 18,
    verticalSpaceClass: "space-y-5",
    descriptionAr:
      "هوامش عريضة مخصصة لجداول التوزيع الدوري السنوي والبرمجة الزمنية للفروض والامتحانات الإشهادية مع خانات التأشير.",
    descriptionFr:
      "Marges optimisées pour les tableaux de répartition périodique annuelle, calendrier ministériel et visas.",
    accentColor: "teal",
  },
];

export function resolveAutoDocViewMarginModel(
  activeModule: ModuleType,
  dmSubType?: DMSubType
): DocumentViewMarginModelSpec {
  if (activeModule === "DS_142_08") {
    return DOC_VIEW_MARGIN_MODELS[0];
  }
  if (activeModule === "DM_SERIE") {
    return dmSubType === "SERIE_TD"
      ? DOC_VIEW_MARGIN_MODELS[1]
      : DOC_VIEW_MARGIN_MODELS[2];
  }
  if (activeModule === "DIAGNOSTIC") {
    return DOC_VIEW_MARGIN_MODELS[3];
  }
  if (activeModule === "REPARTITION_CERTIF") {
    return DOC_VIEW_MARGIN_MODELS[5];
  }
  return DOC_VIEW_MARGIN_MODELS[4];
}

export interface DocumentPrintScopeOption {
  scope: "ALL" | "SUJET_ONLY" | "SOLUTIONS_ONLY" | "SPEC_GRID_ONLY";
  codeBadge: string;
  title: string;
  subtitle: string;
}

export interface DocumentQuickSectionPill {
  id: "HEADER" | "SPEC_TABLE" | "EXERCISES" | "SYNTHESIS_PROBLEM" | "SOLUTIONS";
  label: string;
}

export interface DocumentPrintStudioProfile {
  moduleBadge: string;
  scopes: DocumentPrintScopeOption[];
  quickSections: DocumentQuickSectionPill[];
}

export function resolveDocumentPrintStudioProfile(
  activeModule: ModuleType,
  dmSubType?: DMSubType,
  isFr: boolean = false
): DocumentPrintStudioProfile {
  if (activeModule === "DS_142_08") {
    return {
      moduleBadge: isFr ? "Devoir Surveillé · Note 142-08" : "الفرض المحروس · مذكرة 142-08",
      scopes: [
        {
          scope: "SUJET_ONLY",
          codeBadge: "Sujet Élève",
          title: isFr ? "📄 Sujet pour Élèves" : "📄 طباعة الفرض للتلاميذ",
          subtitle: isFr ? "Sans corrigé ni grille" : "ورقة الأسئلة فقط بدون حلول ولا شبكة",
        },
        {
          scope: "SOLUTIONS_ONLY",
          codeBadge: "Corrigé 20/20",
          title: isFr ? "📝 Corrigé & Barème" : "📝 عناصر الإجابة والحلول",
          subtitle: isFr ? "Barème détaillé 0.25 pt" : "سلم النقط المفصل والخطوات (0.25 ن)",
        },
        {
          scope: "SPEC_GRID_ONLY",
          codeBadge: "Note 142-08",
          title: isFr ? "📊 Grille de Spécification" : "📊 شبكة التخصيص 142-08",
          subtitle: isFr ? "Tableau & Matrice Bloom 2D" : "جدول القدرات ومصفوفة بلوم للمفتش",
        },
        {
          scope: "ALL",
          codeBadge: "Dossier Complet",
          title: isFr ? "🖨️ Dossier Pédagogique Complet" : "🖨️ العدة التربوية الكاملة",
          subtitle: isFr ? "Sujet + Corrigé + Grille" : "الفرض + عناصر الإجابة + الشبكة",
        },
      ],
      quickSections: [
        { id: "HEADER", label: isFr ? "1. En-tête" : "1. الترويسة" },
        { id: "SPEC_TABLE", label: isFr ? "2. Grille 142-08" : "2. جدول التخصيص" },
        { id: "EXERCISES", label: isFr ? "3. Exercices" : "3. التمارين" },
        { id: "SYNTHESIS_PROBLEM", label: isFr ? "4. Problème" : "4. المسألة" },
        { id: "SOLUTIONS", label: isFr ? "5. Corrigé" : "5. عناصر الإجابة" },
      ],
    };
  }

  if (activeModule === "DM_SERIE") {
    const isTD = dmSubType === "SERIE_TD";
    return {
      moduleBadge: isTD
        ? isFr
          ? "Série d'Exercices TD · Compact 8mm"
          : "سلسلة تمارين الدعم TD · مدمج 8mm"
        : isFr
        ? "Devoir Maison DM · Équilibré 12mm"
        : "الفرض المنزلي DM · متوازن 12mm",
      scopes: [
        {
          scope: "SUJET_ONLY",
          codeBadge: isTD ? "Série Élève" : "Sujet DM",
          title: isTD
            ? isFr
              ? "📄 Série TD pour Élèves"
              : "📄 طباعة السلسلة للتلاميذ"
            : isFr
            ? "📄 Sujet DM pour Élèves"
            : "📄 طباعة الفرض المنزلي للتلاميذ",
          subtitle: isFr ? "Exercices progressifs sans corrigé" : "التمارين المتدرجة ومذكرة الدرس بدون حلول",
        },
        {
          scope: "SOLUTIONS_ONLY",
          codeBadge: "Corrigé Détaillé",
          title: isFr ? "📝 Livret de Correction" : "📝 عناصر الإجابة والحلول المفصلة",
          subtitle: isFr ? "Méthodes et étapes de résolution" : "طرائق الحل خطوة بخطوة وتوجيهات التصحيح",
        },
        {
          scope: "SPEC_GRID_ONLY",
          codeBadge: "Auto-Évaluation",
          title: isFr ? "📊 Grille de Suivi & Compétences" : "📊 شبكة التتبع والقدرات المستهدفة",
          subtitle: isFr ? "Objectifs et grille d'auto-évaluation" : "جدول الدروس وشبكة التقويم الذاتي للتلميذ",
        },
        {
          scope: "ALL",
          codeBadge: "Kit TD / DM",
          title: isFr ? "🖨️ Dossier Complet (Sujet + Corrigé)" : "🖨️ الملف الكامل (الموضوع + الحلول)",
          subtitle: isFr ? "Série/DM + Grille + Corrigé" : "التمارين + شبكة التتبع + عناصر الإجابة",
        },
      ],
      quickSections: [
        { id: "HEADER", label: isFr ? "1. En-tête" : "1. الترويسة" },
        { id: "SPEC_TABLE", label: isFr ? "2. Cadre & Mémo" : "2. الإطار والملخص" },
        { id: "EXERCISES", label: isFr ? "3. Exercices" : "3. التمارين" },
        { id: "SOLUTIONS", label: isFr ? "4. Corrigé" : "4. الحلول والشبكة" },
      ],
    };
  }

  if (activeModule === "FICHE_OP2007") {
    return {
      moduleBadge: isFr ? "Fiche Pédagogique · OP 2007" : "الجذاذة التربوية الرسمية · OP 2007",
      scopes: [
        {
          scope: "SUJET_ONLY",
          codeBadge: "Fiche Séance",
          title: isFr ? "📄 Fiche de Séance Condensée" : "📄 جذاذة الحصة المختصرة للقسم",
          subtitle: isFr ? "Identification + Activité + Scénario" : "التوصيف + النشاط البنائي + جدول السيناريو",
        },
        {
          scope: "SOLUTIONS_ONLY",
          codeBadge: "Cours & Preuves",
          title: isFr ? "📝 Contenu du Cours & Exemples" : "📝 المتن النظري والأمثلة والتقويم",
          subtitle: isFr ? "Définitions, théorèmes, preuves & TICE" : "التعاريف والمبرهنات والبراهين وأنشطة TICE",
        },
        {
          scope: "SPEC_GRID_ONLY",
          codeBadge: "Grille Inspecteur",
          title: isFr ? "📊 Planification & Grille OP 2007" : "📊 مصفوفة التخطيط والجدول الديداكتيكي",
          subtitle: isFr ? "Capacités, prérequis et tableau 5 phases" : "الكفايات ومصفوفة الحصص لوثيقة التفتيش",
        },
        {
          scope: "ALL",
          codeBadge: "Fiche Intégrale",
          title: isFr ? "🖨️ Fiche Pédagogique Intégrale" : "🖨️ الجذاذة التربوية الشاملة (5 محطات)",
          subtitle: isFr ? "Scénario complet + Cours + TICE + Éval" : "جميع المحطات الخمس + المتن النظري + TICE",
        },
      ],
      quickSections: [
        { id: "HEADER", label: isFr ? "1. En-tête" : "1. الترويسة" },
        { id: "SPEC_TABLE", label: isFr ? "2. Identification & Plan" : "2. التوصيف والتخطيط" },
        { id: "EXERCISES", label: isFr ? "3. Cours & Scénario" : "3. الدرس والسيناريو" },
        { id: "SOLUTIONS", label: isFr ? "4. Évaluation & TICE" : "4. التقويم و TICE" },
      ],
    };
  }

  if (activeModule === "DIAGNOSTIC") {
    return {
      moduleBadge: isFr ? "Évaluation Diagnostique" : "الرائز التشخيصي وشبكة التفريغ",
      scopes: [
        {
          scope: "SUJET_ONLY",
          codeBadge: "Cahier Élève",
          title: isFr ? "📄 Test Diagnostique (Élèves)" : "📄 طباعة الرائز للتلاميذ",
          subtitle: isFr ? "QCM + Exercices + Problème" : "أسئلة QCM والتمارين والمسألة بدون حلول",
        },
        {
          scope: "SOLUTIONS_ONLY",
          codeBadge: "Corrigé & Erreurs",
          title: isFr ? "📝 Corrigé & Analyse des Obstacles" : "📝 عناصر الإجابة وخطة الدعم",
          subtitle: isFr ? "Grille des erreurs et remédiation" : "تصحيح الرائز وتحليل التمثلات وخطة الدعم",
        },
        {
          scope: "SPEC_GRID_ONLY",
          codeBadge: "Grille Dépouillement",
          title: isFr ? "📊 Cadre & Grille de Dépouillement" : "📊 الإطار المرجعي وشبكة التفريغ",
          subtitle: isFr ? "Domaines ciblés et liste de classe" : "مجالات التقويم وشبكة تفريغ نتائج القسم",
        },
        {
          scope: "ALL",
          codeBadge: "Dossier Diagnostic",
          title: isFr ? "🖨️ Dossier Diagnostique Complet" : "🖨️ ملف التقويم التشخيصي الكامل",
          subtitle: isFr ? "Test + Corrigé + Grille de classe" : "الرائز + عناصر الإجابة + شبكة التفريغ",
        },
      ],
      quickSections: [
        { id: "HEADER", label: isFr ? "1. En-tête" : "1. الترويسة" },
        { id: "SPEC_TABLE", label: isFr ? "2. Cadre & Domaines" : "2. الإطار والمجالات" },
        { id: "EXERCISES", label: isFr ? "3. QCM & Exercices" : "3. QCM والتمارين" },
        { id: "SYNTHESIS_PROBLEM", label: isFr ? "4. Problème" : "4. المسألة" },
        { id: "SOLUTIONS", label: isFr ? "5. Corrigé & Grille" : "5. التصحيح والتفريغ" },
      ],
    };
  }

  return {
    moduleBadge: isFr ? "Répartition Annuelle & Examens" : "التوزيع الدوري السنوي والمحطات الإشهادية",
    scopes: [
      {
        scope: "SUJET_ONLY",
        codeBadge: "Programme S1 & S2",
        title: isFr ? "📄 Répartition S1 & S2 + Visas" : "📄 توزيع دروس الدورة 1 والدورة 2",
        subtitle: isFr ? "Tableaux des chapitres et signatures" : "جداول الوحدات الدراسية والغلاف الساعي والتأشيرات",
      },
      {
        scope: "SOLUTIONS_ONLY",
        codeBadge: "Semestre 2 & Examen",
        title: isFr ? "📝 Semestre 2 & Examen Certificatif" : "📝 برنامج الدورة 2 والاستحقاق الإشهادي",
        subtitle: isFr ? "Chapitres S2 et calendrier certificatif" : "تركيز الدورة الثانية والامتحان الموحد",
      },
      {
        scope: "SPEC_GRID_ONLY",
        codeBadge: "Calendrier 142-08",
        title: isFr ? "📊 Cadre & Calendrier des DS" : "📊 الإطار الإداري وبرمجة الفروض",
        subtitle: isFr ? "Volume horaire, coeff et jalons DS" : "الحصيص الساعي والمعامل وتواريخ الفروض المحروسة",
      },
      {
        scope: "ALL",
        codeBadge: "Répartition Complète",
        title: isFr ? "🖨️ Répartition Annuelle Complète" : "🖨️ التوزيع السنوي الرسمي الكامل",
        subtitle: isFr ? "Cadre + Calendrier + S1 & S2 + Visas" : "الإطار الإداري + المحطات + S1 و S2 + التوقيعات",
      },
    ],
    quickSections: [
      { id: "HEADER", label: isFr ? "1. En-tête" : "1. الترويسة" },
      { id: "SPEC_TABLE", label: isFr ? "2. Cadre & Calendrier" : "2. الإطار والمحطات" },
      { id: "EXERCISES", label: isFr ? "3. Semestres S1 & S2" : "3. برنامج S1 و S2" },
    ],
  };
}

export const LessonHeaderIconSvg: React.FC<{
  iconId: Exclude<LessonHeaderIconId, "AUTO" | "NONE">;
  className?: string;
}> = ({ iconId, className = "w-3.5 h-3.5 shrink-0" }) => {
  switch (iconId) {
    case "FUNCTION":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M3 12h18" strokeOpacity="0.45" strokeWidth="1.4" />
          <path d="M12 3v18" strokeOpacity="0.45" strokeWidth="1.4" />
          <path d="M3 18C6.5 18 8.5 6 12 12C15.5 18 17.5 6 21 6" />
        </svg>
      );
    case "SEQUENCE":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M3 19h18" strokeOpacity="0.5" strokeWidth="1.5" />
          <path d="M4 19V5" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="7" cy="15" r="1.8" fill="currentColor" />
          <circle cx="11.5" cy="11" r="1.8" fill="currentColor" />
          <circle cx="16" cy="8.5" r="1.8" fill="currentColor" />
          <circle cx="20" cy="7" r="1.8" fill="currentColor" />
          <path d="M7 15l4.5-4 4.5-2.5 4-1.5" strokeDasharray="2 2" strokeWidth="1.4" />
        </svg>
      );
    case "GEOMETRY":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <polygon points="12 3 21 19 3 19" />
          <path d="M12 3v16" strokeDasharray="2 2" strokeWidth="1.4" />
          <rect x="12" y="15.5" width="3.5" height="3.5" strokeWidth="1.3" />
        </svg>
      );
    case "COMPLEX":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8" strokeOpacity="0.55" strokeWidth="1.5" />
          <path d="M12 12L17.5 6.5" strokeWidth="2.2" />
          <circle cx="17.5" cy="6.5" r="1.7" fill="currentColor" />
          <path d="M4 12h16M12 4v16" strokeOpacity="0.35" strokeWidth="1.2" />
        </svg>
      );
    case "PROBABILITY":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
          <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <circle cx="8.5" cy="15.5" r="1.4" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" />
        </svg>
      );
    case "INTEGRAL":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M15 4c-2.2 0-3 1.5-3 4v8c0 2.5-.8 4-3 4" />
          <path d="M5 18h14" strokeOpacity="0.4" strokeWidth="1.3" />
          <path d="M14 9c2-1.5 4-1 5 1v8H14V9z" fill="currentColor" fillOpacity="0.18" stroke="none" />
        </svg>
      );
    case "ALGEBRA":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M18 4H6l6 8-6 8h12" />
        </svg>
      );
    case "LOGIC":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <circle cx="9.5" cy="12" r="5.5" />
          <circle cx="14.5" cy="12" r="5.5" />
        </svg>
      );
  }
};

export const LessonHeaderIconBadge: React.FC<{
  lesson?: LessonItem;
  overrideIconId?: LessonHeaderIconId;
  isDarkHeader?: boolean;
  isFr?: boolean;
  accentHex?: string;
  bgHex?: string;
  borderHex?: string;
}> = ({
  lesson,
  overrideIconId,
  isDarkHeader = false,
  isFr = false,
  accentHex,
  bgHex,
  borderHex,
}) => {
  const resolved = resolveLessonHeaderIcon(lesson, overrideIconId);
  if (!resolved || resolved.id === "NONE" || resolved.id === "AUTO") return null;

  return (
    <span
      title={isFr ? resolved.labelFr : resolved.labelAr}
      style={
        isDarkHeader
          ? undefined
          : {
              borderColor: borderHex || `${resolved.accentHex}55`,
              color: accentHex || resolved.accentHex,
              backgroundColor: bgHex || undefined,
            }
      }
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[11px] font-black shrink-0 print-exact-color ${
        isDarkHeader
          ? "bg-white/20 text-amber-200 border-white/35 shadow-2xs"
          : "bg-white/95 shadow-2xs"
      }`}
    >
      <LessonHeaderIconSvg iconId={resolved.id} className="w-3.5 h-3.5 shrink-0" />
      <span className="font-mono text-[10.5px] leading-none tracking-tight">
        {resolved.mathSymbol}
      </span>
    </span>
  );
};

export const PrintablePreview: React.FC<PrintablePreviewProps> = React.memo(({
  track,
  sem,
  dsKey,
  school,
  prof,
  year,
  academy,
  direction,
  headerStyle,
  includeStudentBox,
  includeGradeBox,
  examModel,
  shuffleQuestions,
  shuffleExercises,
  docLang,
  bilingualLayout,
  activeModule,
  n1,
  n2,
  n3,
  fillBlanks,
  includeTICE,
  selectedLessonIdx,
  diagDuration,
  showAnswerKey,
  includeDetailedSolutions = false,
  solutionDisplayMode = "SEPARATE_PAGE_ANNEXES",
  onlyPrintSolutions = false,
  system,
  calculatorAllowed = true,
  includeCompetencies = true,
  customLessons,
  dmSubType = "DEVOIR_MAISON",
  dmNumber = "N° 1",
  dmDueDate = "................",
  serieExerciseCount = 6,
  includeHints = true,
  includeTeacherLogo = true,
  logoVariant = "ROYAL_GOLD",
  includeLogoWatermark = false,
  customLogoUrl = null,
  customDocTitle = "",
  customDocSubtitle = "",
  customHeaderNote = "",
  customExerciseTitles = {},
  docFontFamily = "ACADEMIC_SERIF",
  docFontSize = "NORMAL",
  isInlineEditable = false,
  showQuestionBareme = true,
  includeAnswerWorkspace = false,
  studentGridStyle = "SEYES_FRENCH",
  workspaceHeightMode = "ADAPTIVE",
  includeGradingScaleTable = true,
  includeSelfEvalGrid = true,
  geoGebraResourcesMap = {},
  autoAttachGeoGebra = true,
  includeCustomEvalGridSheet = false,
  onlyPrintEvalGrid = false,
  evalGridGranularity = "BY_QUESTION",
  evalGridStudentCount = 15,
  pageOrientation = "PORTRAIT",
  onUpdateGeoGebraResource,
  insertedFigures = [],
  onAddFigure,
  onUpdateFigure,
  onDeleteFigure,
  dsStructureMode = "EXERCICES_ET_PROBLEME",
  dsQuestionDensity = "INTENSIVE",
  includeMoroccanExamDirectives = true,
  handwrittenSolutionsOnly = false,
  onChangeDocFontFamily,
  moroccanDMType = "RECHERCHE_SYNTHESE",
  includeLessonMemo = true,
  includeDMContract = true,
  ficheScenarioDisplayMode = "BOTH",
  ficheContentDetailLevel = "FULL_WITH_PROOFS",
  includeFichePlanningMatrix = true,
  includeFicheTICE = true,
  includeFicheFormativeEval = true,
  includeExamFormulaSheet = false,
  includeDSStudentSelfCheck = true,
  includePostExamRemediationSheet = false,
  includeOfficialExamCoverSheet = false,
  appliedTitleCalligraphy,
  latexPackageTheme = "TCOLORBOX",
  onChangeLatexPackageTheme,
  tcolorboxConfig = DEFAULT_TCOLORBOX_CONFIG,
  onChangeTcolorboxConfig,
  paperSurface = "PLAIN_WHITE",
  onChangePaperSurface,
  onOpenWolframVerifier,
  include2DSpecMatrix = true,
  includeOMRBubbleSheet = false,
  omrQuestionCount = 10,
  enableFourModelsABCD = false,
  includeDidacticVigilanceSheet = false,
  onOpenAdvancedPedagogyStudio,
  activeSyncSection = null,
  enableBranchColorGradient = true,
  branchColorMode = "AUTO_BY_LESSON",
  onChangeEnableBranchColorGradient,
  onChangeBranchColorMode,
  qcmConfig,
  attachedPythonAlgorithms = [],
  onOpenPythonLab,
  onOpenAiAssistant,
  onExportOverleafZipDirect,
  onRemovePythonAlgorithm,
  onChangeStudentGridStyle,
  onOpenBatchPrint,
  includeIndividualGradingStrip = true,
  includeRescueHintsAndContinuity = true,
  showA4LivePageBreaks,
  onToggleA4LivePageBreaks,
  economicTwoUpPrintMode,
  onToggleEconomicTwoUpPrintMode,
  onOpenDidacticChecklist,
  onOpenRemedialExam,
  includeInteractiveQrFooter,
  onToggleInteractiveQrFooter,
  interactiveExamUrl,
  onOpenInteractiveQuiz,
  differentiatedPathConfig,
  longitudinalCohortConfig,
  onOpenMathInspectorStudio,
  onSwitchDocumentViewModel,
  customPageMarginsMm = null,
  onChangePageMarginsMm,
  printPageSizePreset = "A4",
  customPageWidthMm = 210,
  customPageHeightMm = 297,
  simulatePrintMediaQuery = false,
  onChangePrintPageSizePreset,
  onChangeCustomPageDimensionsMm,
  onToggleSimulatePrintMediaQuery,
  selectedConsigneKeys = ["CALC_ALLOWED", "BLANCO_FORBIDDEN", "CARE_REDACTION", "JUSTIFY_STEPS"],
  onChangeConsigneKeys,
  onOpenCompetencyBank,
  onOpenMassarExport,
  onOpenDiagnosticAnalysis,
  onOpenBookletMode,
  onOpenInteractiveQr,
  isBookletPreviewMode = false,
}) => {
  const [showMarginGuides, setShowMarginGuides] = React.useState<boolean>(false);
  const [internalShowA4PageBreaks, setInternalShowA4PageBreaks] = React.useState<boolean>(false);
  const [internalEconomicTwoUpMode, setInternalEconomicTwoUpMode] = React.useState<boolean>(false);
  const [internalIncludeInteractiveQr, setInternalIncludeInteractiveQr] = React.useState<boolean>(true);
  const [showPositiveMarkingTips, setShowPositiveMarkingTips] = React.useState<boolean>(true);
  const [syncDocTypeOnModelClick, setSyncDocTypeOnModelClick] = React.useState<boolean>(true);
  const [showCustomMarginSliders, setShowCustomMarginSliders] = React.useState<boolean>(false);
  const [measuredSheetDims, setMeasuredSheetDims] = React.useState<{
    widthPx: number;
    heightPx: number;
  }>({ widthPx: 794, heightPx: 1122 });
  const [internalMarginOverride, setInternalMarginOverride] = React.useState<{
    topMm: number;
    bottomMm: number;
    xMm: number;
    modelId: DocumentViewMarginModelId;
  } | null>(null);

  const [printScope, setPrintScope] = React.useState<
    "SUJET_ONLY" | "SOLUTIONS_ONLY" | "SPEC_GRID_ONLY" | null
  >(null);
  const [previewScopeFilter, setPreviewScopeFilter] = React.useState<
    "ALL" | "SUJET_ONLY" | "SOLUTIONS_ONLY" | "SPEC_GRID_ONLY"
  >("SUJET_ONLY");
  const [laserInkSaverMode, setLaserInkSaverMode] = React.useState<boolean>(false);
  const [isOnePageFitActive, setIsOnePageFitActive] = React.useState<boolean>(false);
  const [isPhotocopyContrastActive, setIsPhotocopyContrastActive] = React.useState<boolean>(false);
  const [projectedQuestion, setProjectedQuestion] = React.useState<{ text: string; label?: string } | null>(null);
  const [showAdvancedPaperSettings, setShowAdvancedPaperSettings] = React.useState<boolean>(false);

  React.useEffect(() => {
    setPreviewScopeFilter("SUJET_ONLY");
  }, [activeModule, dmSubType]);

  const effectivePrintScope: "SUJET_ONLY" | "SOLUTIONS_ONLY" | "SPEC_GRID_ONLY" | null =
    printScope || (previewScopeFilter === "ALL" ? null : previewScopeFilter);

  const printStudioProfile = React.useMemo(
    () =>
      resolveDocumentPrintStudioProfile(
        activeModule,
        dmSubType,
        docLang === "FR" || system === "MISSION_FRANCAISE"
      ),
    [activeModule, dmSubType, docLang, system]
  );

  const handleScrollToPreviewSection = React.useCallback((sectionId: string) => {
    const sheet = document.getElementById("printable-document-sheet");
    if (!sheet) return;
    const target = sheet.querySelector(`[data-sync-section="${sectionId}"]`) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("ring-2", "ring-cyan-500", "rounded-xl", "transition-all");
      window.setTimeout(() => {
        target.classList.remove("ring-2", "ring-cyan-500");
      }, 1600);
    } else {
      sheet.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleQuickPedagogicalPrint = React.useCallback(
    (scope: "SUJET_ONLY" | "SOLUTIONS_ONLY" | "SPEC_GRID_ONLY" | "ALL") => {
      if (scope === "ALL") {
        setPrintScope(null);
      } else {
        setPrintScope(scope);
      }

      window.setTimeout(() => {
        window.print();
        window.setTimeout(() => {
          setPrintScope(null);
        }, 1200);
      }, 180);
    },
    []
  );

  const autoDocMarginModel = React.useMemo(
    () => resolveAutoDocViewMarginModel(activeModule, dmSubType),
    [activeModule, dmSubType]
  );

  const effectiveMarginOverride =
    customPageMarginsMm !== undefined ? customPageMarginsMm : internalMarginOverride;

  const updateMarginOverride = React.useCallback(
    (
      next: {
        topMm: number;
        bottomMm: number;
        xMm: number;
        modelId: DocumentViewMarginModelId;
      } | null
    ) => {
      if (onChangePageMarginsMm) {
        onChangePageMarginsMm(next);
      } else {
        setInternalMarginOverride(next);
      }
    },
    [onChangePageMarginsMm]
  );

  const activeMarginModelSpec = React.useMemo(() => {
    if (effectiveMarginOverride) {
      const baseSpec =
        DOC_VIEW_MARGIN_MODELS.find((m) => m.id === effectiveMarginOverride.modelId) ||
        autoDocMarginModel;
      return {
        ...baseSpec,
        topMm: effectiveMarginOverride.topMm,
        bottomMm: effectiveMarginOverride.bottomMm,
        xMm: effectiveMarginOverride.xMm,
        previewPadTopPx: Math.round(effectiveMarginOverride.topMm * 2),
        previewPadBottomPx: Math.round(effectiveMarginOverride.bottomMm * 2),
        previewPadXPx: Math.round(effectiveMarginOverride.xMm * 2.25),
      };
    }
    return autoDocMarginModel;
  }, [effectiveMarginOverride, autoDocMarginModel]);

  const handleSelectDocumentViewModel = React.useCallback(
    (model: DocumentViewMarginModelSpec) => {
      if (syncDocTypeOnModelClick && onSwitchDocumentViewModel) {
        onSwitchDocumentViewModel(model.targetModule, model.targetDmSubType);
        updateMarginOverride(null);
      } else {
        updateMarginOverride({
          topMm: model.topMm,
          bottomMm: model.bottomMm,
          xMm: model.xMm,
          modelId: model.id,
        });
      }
    },
    [syncDocTypeOnModelClick, onSwitchDocumentViewModel, updateMarginOverride]
  );

  const printMediaMetrics = React.useMemo(
    () =>
      computePrintMediaQueryMetrics({
        preset: printPageSizePreset,
        orientation: pageOrientation,
        customWidthMm: customPageWidthMm,
        customHeightMm: customPageHeightMm,
        marginTopMm: activeMarginModelSpec.topMm,
        marginBottomMm: activeMarginModelSpec.bottomMm,
        marginXMm: activeMarginModelSpec.xMm,
        contentWidthPx: measuredSheetDims.widthPx,
        contentHeightPx: measuredSheetDims.heightPx,
      }),
    [
      printPageSizePreset,
      pageOrientation,
      customPageWidthMm,
      customPageHeightMm,
      activeMarginModelSpec.topMm,
      activeMarginModelSpec.bottomMm,
      activeMarginModelSpec.xMm,
      measuredSheetDims.widthPx,
      measuredSheetDims.heightPx,
    ]
  );

  const a4TotalWidthMm = printMediaMetrics.widthMm;
  const a4TotalHeightMm = printMediaMetrics.heightMm;
  const safePrintWidthMm = printMediaMetrics.printableWidthMm;
  const safePrintHeightMm = printMediaMetrics.printableHeightMm;
  const printableAreaUtilizationPct =
    Math.round(
      ((safePrintWidthMm * safePrintHeightMm) /
        Math.max(1, a4TotalWidthMm * a4TotalHeightMm)) *
        1000
    ) / 10;

  const effectiveShowA4Breaks =
    (showA4LivePageBreaks ?? internalShowA4PageBreaks) || simulatePrintMediaQuery;
  const effectiveEconomicMode = economicTwoUpPrintMode ?? internalEconomicTwoUpMode;
  const effectiveIncludeInteractiveQr = includeInteractiveQrFooter ?? internalIncludeInteractiveQr;

  const handleToggleA4Breaks = () => {
    if (onToggleA4LivePageBreaks) onToggleA4LivePageBreaks();
    else setInternalShowA4PageBreaks((v) => !v);
  };

  const handleToggleEconomicMode = () => {
    if (onToggleEconomicTwoUpPrintMode) onToggleEconomicTwoUpPrintMode();
    else setInternalEconomicTwoUpMode((v) => !v);
  };

  const handleToggleInteractiveQr = () => {
    if (onToggleInteractiveQrFooter) onToggleInteractiveQrFooter();
    else setInternalIncludeInteractiveQr((v) => !v);
  };

  const resolvedInteractiveQuizUrl = React.useMemo(() => {
    if (interactiveExamUrl && interactiveExamUrl.trim().length > 0) {
      return interactiveExamUrl;
    }
    return buildInteractiveQuizLinkForDocument({
      system: system === "MISSION_FRANCAISE" ? "MISSION_FRANCAISE" : "MAROC_NATIONAL",
      trackCode: track.code,
      semester: sem,
      dsNumber: dsKey.replace("DS", "") || "1",
      examModel: examModel === "B" ? "B" : "A",
      docType: activeModule,
      title: track.labelAr,
    });
  }, [interactiveExamUrl, system, track.code, track.labelAr, sem, dsKey, examModel, activeModule]);

  const [autoFitCompactionScale, setAutoFitCompactionScale] = React.useState<number>(1);
  const [a4LayoutReport, setA4LayoutReport] = React.useState<A4LayoutOverflowReport>(() =>
    analyzeA4LayoutMetrics({
      contentWidthPx: 794,
      scrollWidthPx: 794,
      contentHeightPx: 1050,
      orientation: pageOrientation === "LANDSCAPE" ? "landscape" : "portrait",
      currentMarginTopMm: activeMarginModelSpec.topMm,
      currentMarginBottomMm: activeMarginModelSpec.bottomMm,
      currentMarginXMm: activeMarginModelSpec.xMm,
      includeFooterQrCode: effectiveIncludeInteractiveQr,
    })
  );

  React.useEffect(() => {
    const measureSheet = () => {
      const el = document.getElementById("printable-document-sheet");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const wPx = Math.max(320, Math.round(rect.width || el.clientWidth || 794));
      const hPx = Math.max(240, Math.round(el.scrollHeight || rect.height || 1050));
      setMeasuredSheetDims((prev) =>
        Math.abs(prev.widthPx - wPx) > 2 || Math.abs(prev.heightPx - hPx) > 2
          ? { widthPx: wPx, heightPx: hPx }
          : prev
      );
      const report = analyzeA4LayoutMetrics({
        contentWidthPx: wPx,
        scrollWidthPx: Math.max(320, Math.round(el.scrollWidth || rect.width || 794)),
        contentHeightPx: hPx,
        orientation: pageOrientation === "LANDSCAPE" ? "landscape" : "portrait",
        currentMarginTopMm: activeMarginModelSpec.topMm,
        currentMarginBottomMm: activeMarginModelSpec.bottomMm,
        currentMarginXMm: activeMarginModelSpec.xMm,
        includeFooterQrCode: effectiveIncludeInteractiveQr,
      });
      setA4LayoutReport(report);
    };

    const timer = window.setTimeout(measureSheet, 120);
    window.addEventListener("resize", measureSheet);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measureSheet);
    };
  }, [
    activeModule,
    dmSubType,
    pageOrientation,
    printPageSizePreset,
    customPageWidthMm,
    customPageHeightMm,
    simulatePrintMediaQuery,
    activeMarginModelSpec.topMm,
    activeMarginModelSpec.bottomMm,
    activeMarginModelSpec.xMm,
    effectiveIncludeInteractiveQr,
    n1,
    n2,
    n3,
    docFontSize,
    docFontFamily,
    solutionDisplayMode,
    autoFitCompactionScale,
  ]);

  const handleApplyAutoA4LayoutFit = React.useCallback(() => {
    updateMarginOverride({
      topMm: a4LayoutReport.recommendedMarginTopMm,
      bottomMm: a4LayoutReport.recommendedMarginBottomMm,
      xMm: a4LayoutReport.recommendedMarginXMm,
      modelId: activeMarginModelSpec.id,
    });
    if (a4LayoutReport.hasTrailingOrphanOverflow || a4LayoutReport.hasHorizontalOverflow) {
      setAutoFitCompactionScale(a4LayoutReport.recommendedScaleFactor);
    } else {
      setAutoFitCompactionScale(1);
    }
  }, [a4LayoutReport, activeMarginModelSpec.id, updateMarginOverride]);

  const [showBacCurvesLibrary, setShowBacCurvesLibrary] = React.useState<boolean>(false);
  const [massarRoster, setMassarRoster] = React.useState<MassarStudentEntry[]>([]);
  const [customWorkspaceLineDeltas, setCustomWorkspaceLineDeltas] = React.useState<
    Record<string, number>
  >({});
  const massarCsvInputRef = React.useRef<HTMLInputElement | null>(null);
  const selectedLatexPkg =
    LATEX_PACKAGE_OPTIONS.find((p) => p.id === latexPackageTheme) ||
    LATEX_PACKAGE_OPTIONS[0];
  const customTcbStyles = getTcolorboxClasses(tcolorboxConfig, false);
  const problemTcbStyles = getTcolorboxClasses(tcolorboxConfig, true);
  const effectiveExerciseBoxClass =
    latexPackageTheme === "TCOLORBOX"
      ? customTcbStyles.boxClass
      : selectedLatexPkg.exerciseBoxClass;
  const effectiveExerciseHeaderClass =
    latexPackageTheme === "TCOLORBOX"
      ? customTcbStyles.headerClass
      : selectedLatexPkg.exerciseHeaderClass;
  const selectedPaperSurf =
    PAPER_SURFACE_OPTIONS.find((s) => s.id === paperSurface) ||
    PAPER_SURFACE_OPTIONS[0];
  const isMission =
    track.system === "MISSION_FRANCAISE" || system === "MISSION_FRANCAISE";
  const baseDsLessons: LessonItem[] =
    customLessons && customLessons.length > 0
      ? customLessons
      : track.semesters[sem][dsKey] || [];
  const allLessons = React.useMemo<LessonItem[]>(
    () => [
      ...Object.values(track.semesters.S1).flat(),
      ...Object.values(track.semesters.S2).flat(),
    ],
    [track]
  );
  const ficheLesson = allLessons[selectedLessonIdx] || allLessons[0];
  const isFr = docLang === "FR" || isMission;
  const isAr = docLang === "AR" && !isMission;
  const isBi = docLang === "BILINGUAL" && !isMission;
  const isDM = dmSubType === "DEVOIR_MAISON";

  const modelsToRender: Array<"A" | "B"> =
    examModel === "BOTH" ? ["A", "B"] : [examModel];

  const totalWeight = baseDsLessons.reduce((acc, l) => acc + l.weight, 0);

  const liveExamGridSummary = React.useMemo(
    () =>
      buildCustomEvaluationGrid({
        track,
        sem,
        dsKey,
        dmSubType,
        dmNumber,
        activeModule,
        lessons: baseDsLessons,
        n1,
        n2,
        n3,
        modelCode: examModel === "B" ? "B" : "A",
        shuffleQuestions,
        customExerciseTitles,
        serieExerciseCount,
        dsQuestionDensity,
        dsStructureMode,
        isMission,
      }),
    [
      track,
      sem,
      dsKey,
      dmSubType,
      dmNumber,
      activeModule,
      baseDsLessons,
      n1,
      n2,
      n3,
      examModel,
      shuffleQuestions,
      customExerciseTitles,
      serieExerciseCount,
      dsQuestionDensity,
      dsStructureMode,
      isMission,
    ]
  );

  const examTimeBalance = React.useMemo(
    () =>
      calculateExamTimeBalance({
        durationStr: diagDuration,
        questions: liveExamGridSummary.allQuestions,
        hasQcm:
          dsStructureMode === "QCM_ET_EXERCICES" ||
          dsStructureMode === "COMPLETE_EXAM_MAROC",
        hasSynthesisProblem:
          dsStructureMode === "EXERCICES_ET_PROBLEME" ||
          dsStructureMode === "COMPLETE_EXAM_MAROC" ||
          dsStructureMode === "EXAMEN_BLANC_2BAC",
      }),
    [liveExamGridSummary.allQuestions, diagDuration, dsStructureMode]
  );

  const [showCommonStudentErrorsCard, setShowCommonStudentErrorsCard] =
    React.useState<boolean>(true);

  const isHandwrittenFontActive = Boolean(
    DOC_FONT_OPTIONS.find((f) => f.id === docFontFamily)?.isHandwritten
  );
  const solutionHandwritingClass =
    handwrittenSolutionsOnly && !isHandwrittenFontActive ? "doc-font-handwritten" : "";

  const activeCalligraphyOption =
    appliedTitleCalligraphy && appliedTitleCalligraphy.fontId !== "DEFAULT_DOC"
      ? TRADITIONAL_TITLE_FONT_OPTIONS.find(
          (f) => f.id === appliedTitleCalligraphy.fontId
        ) || null
      : null;

  const activeCalligraphyCss = activeCalligraphyOption?.cssClass || "";
  const isMoroccanHeaderOrnamentEnabled =
    appliedTitleCalligraphy?.enableMoroccanHeaderOrnament ?? true;
  const isMoroccanAndalusiHeaderActive = Boolean(
    !isMission &&
      isMoroccanHeaderOrnamentEnabled &&
      (activeCalligraphyOption?.moroccanHeaderFramePreset ||
        appliedTitleCalligraphy?.ornament === "ANDALUSI_MOROCCAN")
  );
  const effectiveHeaderLetterSpacing =
    appliedTitleCalligraphy?.customLetterSpacingEm !== undefined
      ? `${appliedTitleCalligraphy.customLetterSpacingEm.toFixed(3)}em`
      : activeCalligraphyOption?.letterSpacing;

  const mainTitleCalligraphyClass = activeCalligraphyCss;
  const headerSubCalligraphyClass =
    appliedTitleCalligraphy &&
    appliedTitleCalligraphy.scope !== "MAIN_TITLE_ONLY"
      ? activeCalligraphyCss
      : "";
  const exerciseTitleCalligraphyClass =
    appliedTitleCalligraphy && appliedTitleCalligraphy.scope === "ALL_TITLES"
      ? activeCalligraphyCss
      : "";
  const mainTitleScaleClass =
    !activeCalligraphyCss
      ? "text-base"
      : appliedTitleCalligraphy?.scale === "GRAND"
      ? "text-2xl"
      : appliedTitleCalligraphy?.scale === "COMPACT"
      ? "text-lg"
      : "text-xl";

  const headerScopeLessons = React.useMemo<LessonItem[]>(
    () =>
      activeModule === "FICHE_OP2007" && ficheLesson
        ? [ficheLesson]
        : baseDsLessons,
    [activeModule, ficheLesson, baseDsLessons]
  );

  const activeHeaderBranchTheme = enableBranchColorGradient
    ? resolveBranchColorTheme(branchColorMode, headerScopeLessons)
    : null;

  const distinctHeaderBranchThemes = React.useMemo(
    () =>
      enableBranchColorGradient
        ? getDistinctLessonBranchThemes(branchColorMode, headerScopeLessons)
        : [],
    [enableBranchColorGradient, branchColorMode, headerScopeLessons]
  );

  const headerRibbonGradientCss = React.useMemo(
    () =>
      enableBranchColorGradient
        ? resolveMultiLessonRibbonGradient(branchColorMode, headerScopeLessons)
        : "",
    [enableBranchColorGradient, branchColorMode, headerScopeLessons]
  );

  const getArabicModelLetter = (code?: string): string => {
    if (!code) return "";
    if (code === "A") return "أ";
    if (code === "B") return "ب";
    if (code === "C") return "ج";
    if (code === "D") return "د";
    return code;
  };

  const renderDetailedCorrectionCard = (
    corr: ExerciseCorrection,
    isInline: boolean = false,
    explicitLesson?: LessonItem
  ) => {
    const matchedLesson =
      explicitLesson ||
      baseDsLessons.find(
        (l) =>
          corr.exerciseTitleAr.includes(l.lessonAr) ||
          corr.exerciseTitleFr.includes(l.lessonFr)
      );
    const didacticErrorCard =
      showCommonStudentErrorsCard && matchedLesson
        ? getTypicalErrorsForLessons([matchedLesson])[0]
        : null;

    return (
      <div
        className={`avoid-break rounded-xl overflow-hidden border ${solutionHandwritingClass} ${
          isInline
            ? "mt-3 bg-emerald-50/40 border-emerald-300 p-3.5 space-y-2.5"
            : "bg-white border-slate-300 p-4 space-y-3 shadow-2xs"
        }`}
      >
        <div className="flex flex-wrap justify-between items-center border-b border-emerald-200/80 pb-1.5 gap-2">
          <div className="font-black text-xs text-emerald-950 flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>
              {isFr
                ? `Correction Détaillée : ${corr.exerciseTitleFr}`
                : `عناصر الإجابة والحل المفصل : ${corr.exerciseTitleAr}`}
            </span>
            {(handwrittenSolutionsOnly || isHandwrittenFontActive) && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded">
                {isFr ? "✍️ Manuscrit Professeur" : "✍️ خط يد الأستاذ"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCommonStudentErrorsCard((v) => !v)}
              className={`no-print px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                showCommonStudentErrorsCard
                  ? "bg-rose-50 text-rose-900 border-rose-300"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
              title={
                isFr
                  ? "Afficher/Masquer la grille des erreurs fréquentes des élèves"
                  : "إظهار/إخفاء بطاقة تشخيص الأخطاء الشائعة للمتعلمين"
              }
            >
              {showCommonStudentErrorsCard
                ? isFr
                  ? "⚠️ Erreurs fréquentes : ON"
                  : "⚠️ تشخيص الأخطاء الشائعة: مفعل"
                : isFr
                ? "Erreurs fréquentes : OFF"
                : "تشخيص الأخطاء الشائعة: مخفي"}
            </button>
            <span className="font-mono font-extrabold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px] tabular-nums">
              {isFr ? `Barème : ${corr.totalPoints} pts` : `سلم التنقيط : ${corr.totalPoints} ن`}
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              ({corr.weight}%)
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {corr.solutions.map((sol, sIdx) => (
            <div
              key={sIdx}
              className="bg-white/95 rounded-lg p-2.5 border border-emerald-100 space-y-1.5 shadow-2xs"
            >
              <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                <span className="underline decoration-emerald-400 decoration-2 font-mono">
                  {isFr ? `Question ${sol.questionNumber}` : `السؤال ${sol.questionNumber}`}
                </span>
                <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-extrabold tabular-nums">
                  [{sol.bareme}]
                </span>
              </div>

              <div className="whitespace-pre-line text-slate-800 text-[11.5px] leading-relaxed font-normal select-text">
                <MathText text={isFr ? sol.solutionTextFr : sol.solutionTextAr} />
              </div>

              {/* تفصيل سلم التنقيط الجزئي البيداغوجي */}
              <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10.5px]">
                {(isFr ? sol.baremeBreakdownFr : sol.baremeBreakdownAr).map(
                  (b, bIdx) => (
                    <span
                      key={bIdx}
                      className="bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded font-medium"
                    >
                      <MathText text={b} inline />
                    </span>
                  )
                )}
              </div>

              {/* ملاحظات ديداكتيكية للأستاذ المصحح */}
              {(isFr ? sol.pedagogicalNoteFr : sol.pedagogicalNoteAr) && (
                <div className="text-[10px] text-amber-900 bg-amber-50/70 border border-amber-200/60 rounded p-1.5 font-medium">
                  ⚠️ <MathText text={isFr ? sol.pedagogicalNoteFr : sol.pedagogicalNoteAr} inline />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* بطاقة تشخيص الأخطاء الشائعة للمتعلمين واليقظة الديداكتيكية */}
        {didacticErrorCard && (
          <div className="avoid-break rounded-lg border border-rose-300 bg-rose-50/70 p-2.5 space-y-1.5 text-[10.5px]">
            <div className="flex flex-wrap items-center justify-between gap-1 font-black text-rose-950">
              <span>
                {isFr
                  ? "🚨 Grille des Erreurs Fréquentes des Élèves & Vigilance Didactique"
                  : "🚨 بطاقة تشخيص الأخطاء الشائعة للمتعلمين واليقظة الديداكتيكية"}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-200/80 text-rose-950 text-[9.5px] font-bold">
                {isFr ? didacticErrorCard.lessonTitleFr : didacticErrorCard.lessonTitleAr}
              </span>
            </div>
            <div className="text-slate-800 font-semibold">
              {isFr ? didacticErrorCard.frequentMistakeFr : didacticErrorCard.frequentMistakeAr}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
              <div className="bg-white/90 border border-rose-200 rounded px-2 py-1 text-rose-900">
                <span className="font-black">
                  {isFr ? "❌ Formulation erronée : " : "❌ الخطأ الشائع لدى المتعلم : "}
                </span>
                <MathText text={didacticErrorCard.wrongExpressionLatex} inline />
              </div>
              <div className="bg-white/90 border border-emerald-200 rounded px-2 py-1 text-emerald-950">
                <span className="font-black">
                  {isFr ? "✅ Formulation mathématique exacte : " : "✅ الصياغة الرياضية السليمة : "}
                </span>
                <MathText text={didacticErrorCard.correctExpressionLatex} inline />
              </div>
            </div>
            <div className="text-[10px] text-indigo-950 bg-indigo-50/80 border border-indigo-200/80 rounded px-2 py-1 font-medium">
              🎯{" "}
              <strong>
                {isFr ? "Piste de remédiation pédagogique : " : "توجيه بيداغوجي للدعم والمعالجة : "}
              </strong>
              {isFr
                ? didacticErrorCard.teacherRemediationTipFr
                : didacticErrorCard.teacherRemediationTipAr}
            </div>
          </div>
        )}

        <div className="pt-1 border-t border-emerald-200/80 text-[10.5px] text-emerald-900 font-semibold">
          💡 {isFr ? corr.generalAdviceFr : corr.generalAdviceAr}
        </div>
      </div>
    );
  };

  const renderAnnexesPage = (modelCode?: ExtendedExamModelCode | "A" | "B" | "C" | "D" | string) => {
    const mCode = ((modelCode as ExtendedExamModelCode) || "A");
    const orderedLessons =
      shuffleExercises && (mCode === "B" || mCode === "D")
        ? [...baseDsLessons].reverse()
        : baseDsLessons;

    const hasQCM =
      dsStructureMode === "QCM_ET_EXERCICES" ||
      dsStructureMode === "COMPLETE_EXAM_MAROC";
    const hasProblem =
      dsStructureMode === "EXERCICES_ET_PROBLEME" ||
      dsStructureMode === "COMPLETE_EXAM_MAROC" ||
      dsStructureMode === "EXAMEN_BLANC_2BAC";
    const qcmBlock = hasQCM
      ? generateMoroccanQCMExercise(orderedLessons, mCode, track.cycle, {
          ...qcmConfig,
          isMission,
        })
      : null;
    const synthesisProblem = hasProblem
      ? generateMoroccanSynthesisProblem(orderedLessons, mCode, track.cycle, isMission)
      : null;
    const exNumOffset = hasQCM ? 1 : 0;

    return (
      <div className={`page-break space-y-5 pt-4 ${solutionHandwritingClass}`}>
        {/* ترويسة الملحق الرسمي لعناصر الإجابة */}
        <div className="border-2 border-emerald-900 rounded-xl p-4 bg-emerald-50/30 space-y-2.5">
          <div className="flex flex-wrap justify-between items-center text-xs border-b border-emerald-200 pb-2 gap-2">
            <div className="font-extrabold text-emerald-950">
              {isMission ? (
                <>Enseignement Français au Maroc (AEFE / OSUI) · Discipline : Mathématiques</>
              ) : isFr ? (
                <>Royaume du Maroc · Ministère de l'Éducation Nationale</>
              ) : (
                <>المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة</>
              )}
              <div className="text-[11px] text-slate-600 font-normal">
                {school} · {prof} · {year}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-800 text-white font-extrabold px-3 py-1 rounded-md text-xs shadow-2xs">
                {isFr ? `Modèle (${mCode})` : `النموذج (${getArabicModelLetter(mCode)})`}
              </span>
            </div>
          </div>

          <div className="text-center py-1">
            <h2 className="text-base font-black text-emerald-950">
              {isMission
                ? "Cahier de Correction & Barème Détaillé (Annexe Officielle)"
                : isFr
                ? "Annexe Officielle : Corrigé Détaillé et Barème de Notation"
                : "الملحق الرسمي: عناصر الإجابة النموذجية وسلم التنقيط المفصل"}
            </h2>
            <p className="text-xs text-emerald-800 font-bold">
              {isFr
                ? `${track.labelFr} · Devoir Surveillé ${dsKey} (${sem})`
                : `${track.labelAr} · الفرض المحروس ${dsKey} (${sem === "S1" ? "الدورة 1" : "الدورة 2"})`}
            </p>
          </div>

          {/* توجيهات الأطر المرجعية المغربية ومواقع الرياضيات */}
          <div className="p-2.5 rounded-lg bg-white/95 border border-emerald-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
            <div className="font-bold text-emerald-950">
              {isFr
                ? "Directives officielles de correction et critères d'évaluation (Cadre de référence) :"
                : "توجيهات التصحيح وسلم التنقيط المعتمد (وفق الأطر المرجعية ومذكرات التقويم):"}
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
              <li>
                {isFr
                  ? "Toute démarche mathématique rigoureuse et cohérente doit être valorisée."
                  : "قبول أي طريقة رياضية واستدلالية سليمة تؤدي إلى النتيجة الصحيحة."}
              </li>
              <li>
                {isFr
                  ? "Ne pas pénaliser deux fois pour une erreur de calcul intermédiaire."
                  : "عدم معاقبة المترشح مرتين على نفس الخطأ الحسابي إذا كانت المنهجية اللاحقة صحيحة."}
              </li>
              <li>
                {isFr
                  ? "0.5 point réservé au soin de la copie, la lisibilité et la rigueur de rédaction."
                  : "تخصيص 0.5 نقطة لحسن تنظيم ورقة التحرير ونظافتها وجودة التعبير الرياضي."}
              </li>
            </ul>
          </div>
        </div>

        {/* شبكة التمارين والحلول المفصلة للملحق */}
        <div className="space-y-4">
          {qcmBlock && (
            <div className="avoid-break border border-emerald-700 rounded-xl p-3.5 bg-emerald-50/40 space-y-2">
              <div className="font-black text-xs text-emerald-950 border-b border-emerald-200 pb-1">
                {isFr
                  ? `Corrigé ${qcmBlock.titleFr}`
                  : `تصحيح ${qcmBlock.titleAr}`}
              </div>
              <ul className="space-y-1 text-xs text-slate-800">
                {qcmBlock.items.map((item) => (
                  <li key={item.num}>
                    <span className="font-bold text-emerald-950">
                      {item.num}) <MathText text={isFr ? item.correctAnswerFr : item.correctAnswerAr} inline /> :{" "}
                    </span>
                    <span>
                      <MathText text={isFr ? item.justificationFr : item.justificationAr} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(() => {
            const fixedQcmPts =
              hasQCM && qcmBlock ? parseFloat(qcmBlock.totalPoints) || 4.0 : 0;
            const fixedProbPts = hasProblem ? 8.5 : 0;
            const exBudget = Math.max(4, 20 - fixedQcmPts - fixedProbPts);
            const exactWeights = computeExactExerciseEffectiveWeights(
              orderedLessons,
              exBudget
            );
            return orderedLessons.map((lesson, idx) => {
              const effectiveWeight = exactWeights[idx] ?? lesson.weight;
              const { questionsAr, questionsFr } = getVariantQuestions(
                lesson,
                mCode,
                shuffleQuestions,
                0,
                dsQuestionDensity
              );
            const qMetas = getQuestionBaremesAndLevels(
              effectiveWeight,
              questionsFr.length,
              n1,
              n2,
              n3,
              lesson.customQuestionBaremes,
              lesson.customQuestionLevels
            );
            const lessonForCorr: LessonItem = {
              ...lesson,
              weight: effectiveWeight,
              customQuestionBaremes: qMetas.map((m) => parseFloat(m.points || "0")),
            };
            const corr = generateExerciseCorrection(
              lessonForCorr,
              idx + exNumOffset,
              mCode,
              questionsAr,
              questionsFr
            );
              return (
                <div key={idx} className="avoid-break">
                  {renderDetailedCorrectionCard(corr, false)}
                </div>
              );
            });
          })()}

          {synthesisProblem && (
            <div className="avoid-break border border-emerald-700 rounded-xl p-3.5 bg-emerald-50/40 space-y-2.5">
              <div className="font-black text-xs text-emerald-950 border-b border-emerald-200 pb-1">
                {isFr
                  ? `Éléments de corrigé — ${synthesisProblem.titleFr}`
                  : `عناصر إجابة المسألة التوليفية — ${synthesisProblem.titleAr}`}
              </div>
              {synthesisProblem.parts.map((part, pIdx) => (
                <div
                  key={pIdx}
                  className="bg-white p-2.5 rounded-lg border border-emerald-100 space-y-1 text-xs"
                >
                  <div className="font-extrabold text-emerald-950">
                    <MathText text={isFr ? part.partTitleFr : part.partTitleAr} />
                  </div>
                  {(isFr ? part.correctionFr : part.correctionAr).map(
                    (cLine, cIdx) => (
                      <div key={cIdx} className="text-slate-800 leading-relaxed">
                        <MathText text={cLine} />
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDMSerieAnnexesPage = (modelCode: ExtendedExamModelCode | "A" | "B" | "C" | "D" | string = "A") => {
    const arModelLetter = getArabicModelLetter(modelCode);
    return (
      <div className="page-break space-y-5 pt-4">
        {/* ترويسة ملحق الفرض المنزلي أو سلسلة التمارين */}
        <div className="border-2 border-emerald-900 rounded-xl p-4 bg-emerald-50/30 space-y-2.5">
          <div className="flex flex-wrap justify-between items-center text-xs border-b border-emerald-200 pb-2 gap-2">
            <div className="font-extrabold text-emerald-950">
              {isMission ? (
                <>AEFE / OSUI · Discipline : Mathématiques</>
              ) : isFr ? (
                <>Royaume du Maroc · Ministère de l'Éducation Nationale</>
              ) : (
                <>المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة</>
              )}
              <div className="text-[11px] text-slate-600 font-normal">
                {school} · {prof} · {year}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-800 text-white font-extrabold px-3 py-1 rounded-md text-xs shadow-2xs">
                {isDM ? `Corrigé Devoir Maison (${modelCode})` : `Corrigé Série TD (${modelCode})`}
              </span>
            </div>
          </div>

          <div className="text-center py-1">
            <h2 className="text-base font-black text-emerald-950">
              {isDM
                ? isFr
                  ? `Annexe : Corrigé Détaillé du Devoir Maison (${dmNumber}) — Modèle ${modelCode}`
                  : `الملحق الرسمي: عناصر الإجابة والحل المفصل للفرض المنزلي (${dmNumber}) — النموذج ${arModelLetter}`
                : isFr
                ? `Annexe : Corrigé Détaillé de la Série d'Exercices (${dmNumber}) — Modèle ${modelCode}`
                : `الملحق الرسمي: عناصر الإجابة والحل المفصل لسلسلة التمارين (${dmNumber}) — النموذج ${arModelLetter}`}
            </h2>
            <p className="text-xs text-emerald-800 font-bold">
              {isFr
                ? `${track.labelFr} · Semestre ${sem}`
                : `${track.labelAr} · ${sem === "S1" ? "الدورة الأولى" : "الدورة الثانية"}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {!isDM ? (
            generateCustomCountSerieExercises(
              baseDsLessons,
              serieExerciseCount,
              modelCode === "B" || modelCode === "D" ? "B" : "A"
            ).map((block, exIdx) => {
              const associatedLesson = baseDsLessons[exIdx % Math.max(1, baseDsLessons.length)];
              const blockCorr = generateSerieBlockCorrection(
                block,
                exIdx,
                associatedLesson,
                modelCode === "B" || modelCode === "D" ? "B" : "A"
              );
              return (
                <div key={exIdx} className="space-y-2 avoid-break">
                  <div className="font-black text-sm text-emerald-950 border-b border-emerald-200 pb-1 flex justify-between items-center">
                    <span>
                      {customExerciseTitles[exIdx]?.trim() || (isFr ? block.badgeFr : block.badgeAr)}
                    </span>
                    <span className="font-mono text-xs text-amber-600 font-bold">
                      {block.stars}
                    </span>
                  </div>
                  {renderDetailedCorrectionCard(blockCorr, false)}
                </div>
              );
            })
          ) : (
            baseDsLessons.map((lesson, idx) => {
              const abModel: "A" | "B" =
                modelCode === "B" || modelCode === "D" ? "B" : "A";
              const blocks = getSerieAndDMExercises(lesson, dmSubType, abModel);
              return (
                <div key={idx} className="space-y-3 avoid-break">
                  <div className="font-black text-sm text-emerald-950 border-b border-emerald-200 pb-1">
                    {customExerciseTitles[idx]?.trim()
                      ? customExerciseTitles[idx].trim()
                      : isFr
                      ? `Correction Problème ${idx + 1} : ${lesson.lessonFr}`
                      : `تصحيح التمرين التوليفي ${idx + 1} : ${lesson.lessonAr}`}
                  </div>
                  {blocks.map((block, bIdx) => (
                    <div key={bIdx}>
                      {renderDetailedCorrectionCard(
                        generateSerieBlockCorrection(block, bIdx, lesson, abModel),
                        false
                      )}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderCustomEvaluationGridSheet = () => {
    const gridData = buildCustomEvaluationGrid({
      track,
      sem,
      dsKey,
      dmSubType,
      dmNumber,
      activeModule,
      lessons: baseDsLessons,
      n1,
      n2,
      n3,
      modelCode: examModel === "B" ? "B" : "A",
      shuffleQuestions,
      customExerciseTitles,
      serieExerciseCount,
      dsQuestionDensity,
      dsStructureMode,
      isMission,
    });

    const dynamicCols =
      evalGridGranularity === "BY_QUESTION"
        ? gridData.allQuestions.map((q) => ({
            code: isFr ? q.questionLabelFr : q.questionLabelAr,
            pts: q.points,
          }))
        : gridData.exercises.map((ex) => ({
            code: isFr ? `Ex ${ex.exerciseNumber}` : `تمرين ${ex.exerciseNumber}`,
            pts: ex.totalPoints,
          }));

    const rowsCount = Math.min(35, Math.max(5, evalGridStudentCount));

    return (
      <div
        id="printable-evaluation-grid-section"
        className={`${onlyPrintEvalGrid ? "" : "page-break pt-4"} space-y-5`}
      >
        {/* ترويسة شبكة التقويم المخصصة */}
        <div className="border-2 border-indigo-950 rounded-xl p-4 bg-indigo-50/30 space-y-2">
          <div className="flex flex-wrap justify-between items-center text-xs border-b border-indigo-200 pb-2 gap-2">
            <div className="font-extrabold text-indigo-950">
              {isMission ? (
                <>Enseignement Français au Maroc (AEFE / OSUI) · Mathématiques</>
              ) : isFr ? (
                <>Royaume du Maroc · Ministère de l'Éducation Nationale · {academy}</>
              ) : (
                <>المملكة المغربية · وزارة التربية الوطنية · {academy} · {direction}</>
              )}
              <div className="text-[11px] text-slate-600 font-normal">
                {school} · {prof} · {year}
              </div>
            </div>
            <div>
              <span className="inline-block bg-indigo-950 text-white font-extrabold px-3 py-1 rounded-md text-xs">
                {isFr ? "Grille d'Évaluation & Dépouillement" : "شبكة التقويم والتفريغ المخصصة"}
              </span>
            </div>
          </div>

          <div className="text-center py-1">
            <h2 className="text-base font-black text-indigo-950">
              {isFr ? gridData.titleFr : gridData.titleAr}
            </h2>
            <p className="text-xs text-indigo-800 font-bold tabular-nums">
              {isFr ? gridData.subtitleFr : gridData.subtitleAr}
            </p>
          </div>
        </div>

        {/* 1. الجدول التحليلي التفصيلي حسب التمارين والأسئلة والقدرات */}
        <div className="space-y-2 avoid-break">
          <h4 className="font-extrabold text-xs text-slate-900 flex items-center justify-between">
            <span>
              {isFr
                ? "I. Grille Analytique d'Évaluation par Exercice, Question et Capacité"
                : "أولاً: شبكة التقويم التحليلية التفصيلية حسب التمارين والأسئلة والقدرات المستهدفة"}
            </span>
            <span className="font-mono text-[11px] text-indigo-900 font-bold tabular-nums">
              N1: {n1}% · N2: {n2}% · N3: {n3}%
            </span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400 text-[11px] bg-white">
              <thead>
                <tr className="bg-slate-100 text-slate-950">
                  <th className="border border-slate-400 p-1.5 text-center w-20">
                    {isFr ? "Question" : "السؤال"}
                  </th>
                  <th className="border border-slate-400 p-1.5 text-start w-44">
                    {isFr ? "Exercice & Chapitre" : "التمرين والدرس"}
                  </th>
                  <th className="border border-slate-400 p-1.5 text-start">
                    {isFr
                      ? "Capacité attendue & Critère d'évaluation"
                      : "القدرة المنتظرة ومعيار التقويم في التمرين"}
                  </th>
                  <th className="border border-slate-400 p-1.5 text-center w-28">
                    {isMission
                      ? "Compétence"
                      : isFr
                      ? "Niveau (142-08)"
                      : "المستوى المهاري"}
                  </th>
                  <th className="border border-slate-400 p-1.5 text-center w-20">
                    {isFr ? "Barème" : "التنقيط"}
                  </th>
                  <th className="border border-slate-400 p-1.5 text-center w-32">
                    {isFr ? "Maîtrise (A / EC / NA)" : "التحكم (أ / ج / د)"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {gridData.allQuestions.map((q, idx) => (
                  <tr key={idx} className="border-b border-slate-300">
                    <td className="border border-slate-400 p-1.5 text-center font-mono font-bold text-indigo-950 tabular-nums">
                      {isFr ? q.questionLabelFr : q.questionLabelAr}
                    </td>
                    <td className="border border-slate-400 p-1.5 font-bold text-slate-900">
                      {isFr ? q.exerciseTitleFr : q.exerciseTitleAr}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-slate-700">
                      <div className="font-semibold text-slate-900">
                        {isFr ? q.capacityFr : q.capacityAr}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-md">
                        {isFr ? q.questionSnippetFr : q.questionSnippetAr}
                      </div>
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono text-[10.5px] font-bold">
                      {isMission
                        ? `${q.boenCompetencyFr} (${q.levelCode})`
                        : isFr
                        ? q.levelLabelFr
                        : q.levelLabelAr}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono font-extrabold text-emerald-900 tabular-nums bg-emerald-50/40">
                      {q.points.toFixed(2)} {isFr ? "pt" : "ن"}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono text-[10px] text-slate-500">
                      [ ] A &nbsp; [ ] EC &nbsp; [ ] NA
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-extrabold">
                  <td colSpan={4} className="border border-slate-400 p-1.5 text-end">
                    {isFr ? "Total général de l'évaluation" : "المجموع العام للفرض"}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono text-indigo-950 tabular-nums">
                    {gridData.totalPoints.toFixed(2)} / 20
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono text-xs">
                    {gridData.totalWeight}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. شبكة تفريغ نقط التلاميذ واستثمار النتائج + بوابة مسار (Massar) و Pronote */}
        <div className="space-y-2 avoid-break">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <span>
                {isFr
                  ? "II. Grille de Dépouillement des Notes de la Classe (Compatible Massar & Pronote)"
                  : "ثانياً: شبكة تفريغ نقط المتعلمين واستثمار النتائج (متوافقة مع منظومة مسار Massar و Pronote)"}
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {evalGridGranularity === "BY_QUESTION"
                  ? isFr
                    ? "Détail par Question"
                    : "تفريغ تفصيلي حسب الأسئلة"
                  : isFr
                  ? "Synthèse par Exercice"
                  : "تفريغ إجمالي حسب التمارين"}
              </span>
            </h4>

            {/* أزرار استيراد وتصدير لائحة مسار / Pronote (تظهر في المعاينة التفاعلية ولا تطبع) */}
            <div className="no-print flex flex-wrap items-center gap-1.5">
              <input
                ref={massarCsvInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const parsed = parseMassarPronoteCSV(String(reader.result || ""));
                    if (parsed.length > 0) {
                      setMassarRoster(parsed);
                    }
                  };
                  reader.readAsText(file, "UTF-8");
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => setMassarRoster(DEFAULT_MOROCCAN_CLASS_ROSTER)}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-300 text-[10.5px] font-extrabold transition cursor-pointer"
                title="تعبئة الجدول بلائحة قسم مغربي نموذجية بـ 15 تلميذاً مع رموز مسار (Code Massar)"
              >
                📋 تعبئة لائحة قسم مسار (15 تلميذاً)
              </button>
              <button
                type="button"
                onClick={() => massarCsvInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[10.5px] font-bold transition cursor-pointer"
                title="استيراد ملف CSV مستخرج من منظومة مسار أو Pronote يحتوي على رموز التلاميذ وأسمائهم"
              >
                📂 استيراد لائحة (.CSV)
              </button>
              {massarRoster.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMassarRoster([])}
                  className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10.5px] font-bold transition cursor-pointer"
                >
                  إفراغ الأسماء
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  exportMassarPronoteGradeSheet({
                    gridData,
                    school,
                    prof,
                    year,
                    academy,
                    direction,
                    docLang,
                    system: system || "MAROC_NATIONAL",
                    granularity: evalGridGranularity,
                    studentCount: rowsCount,
                    n1,
                    n2,
                    n3,
                    customStudents:
                      massarRoster.length > 0 ? massarRoster : DEFAULT_MOROCCAN_CLASS_ROSTER,
                    dsKey,
                    semester: sem,
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10.5px] font-black shadow-2xs transition cursor-pointer"
                title="تصدير ورقة تنقيط مسار و Pronote بصيغة CSV UTF-8 جاهزة للفتح في Excel"
              >
                📥 تصدير ملف مسار / Pronote (.CSV)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400 text-[10.5px] bg-white">
              <thead>
                <tr className="bg-slate-100 text-slate-950">
                  <th className="border border-slate-400 p-1 text-center w-8">
                    {isFr ? "N°" : "ر.ت"}
                  </th>
                  <th className="border border-slate-400 p-1 text-center w-24 font-mono">
                    {isFr ? "Code Massar" : "رمز مسار"}
                  </th>
                  <th className="border border-slate-400 p-1.5 text-start min-w-[140px]">
                    {isFr ? "Nom & Prénom de l'élève" : "الاسم والنسب للمتعلم(ة)"}
                  </th>
                  {dynamicCols.map((c, cIdx) => (
                    <th
                      key={cIdx}
                      className="border border-slate-400 p-1 text-center font-mono"
                    >
                      <div>{c.code}</div>
                      <div className="text-[9.5px] text-indigo-800 font-bold tabular-nums">
                        /{c.pts}
                      </div>
                    </th>
                  ))}
                  <th className="border border-slate-400 p-1 text-center w-16 bg-indigo-50/60 font-mono">
                    {isFr ? "Total /20" : "المجموع /20"}
                  </th>
                  <th className="border border-slate-400 p-1 text-center w-28">
                    {isFr ? "Décision / Soutien" : "قرار الدعم"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  { length: massarRoster.length > 0 ? massarRoster.length : rowsCount },
                  (_, rIdx) => {
                    const st = massarRoster[rIdx];
                    return (
                      <tr key={rIdx} className="h-6">
                        <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-700 tabular-nums">
                          {rIdx + 1}
                        </td>
                        <td className="border border-slate-400 p-1 text-center font-mono text-[10px] font-semibold text-indigo-950 tabular-nums">
                          {st ? st.massarCode : "...................."}
                        </td>
                        <td className="border border-slate-400 p-1 font-semibold text-slate-800">
                          {st
                            ? isFr
                              ? st.fullNameFr
                              : st.fullNameAr
                            : "........................................................"}
                        </td>
                        {dynamicCols.map((_, cIdx) => (
                          <td
                            key={cIdx}
                            className="border border-slate-400 p-1 text-center font-mono"
                          />
                        ))}
                        <td className="border border-slate-400 p-1 text-center bg-indigo-50/20 font-mono font-bold" />
                        <td className="border border-slate-400 p-1 text-center text-[9.5px] text-slate-500">
                          [ ] A &nbsp; [ ] EC &nbsp; [ ] NA
                        </td>
                      </tr>
                    );
                  }
                )}
                <tr className="bg-amber-50/60 font-bold">
                  <td colSpan={3} className="border border-slate-400 p-1.5 text-end">
                    {isFr
                      ? "Moyenne de la classe / Taux de réussite (%)"
                      : "معدل القسم في كل عنصر / نسبة التحكم (%)"}
                  </td>
                  {dynamicCols.map((_, cIdx) => (
                    <td key={cIdx} className="border border-slate-400 p-1 text-center" />
                  ))}
                  <td className="border border-slate-400 p-1 text-center" />
                  <td className="border border-slate-400 p-1 text-center" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentHeader = (modelBadge?: ExtendedExamModelCode | "A" | "B" | "C" | "D" | string) => {
    const arLetter = getArabicModelLetter(modelBadge);
    const modelText = modelBadge
      ? isMission
        ? ` — Sujet ${modelBadge}`
        : isFr
        ? ` — Sujet ${modelBadge}`
        : isAr
        ? ` — النموذج (${arLetter})`
        : ` — النموذج ${arLetter} / Sujet ${modelBadge}`
      : "";

    return (
      <div
        style={
          activeHeaderBranchTheme
            ? {
                backgroundImage: activeHeaderBranchTheme.headerGradientCss,
                borderColor: activeHeaderBranchTheme.borderHex,
              }
            : undefined
        }
        className={`avoid-break rounded-xl overflow-hidden shadow-xs print-exact-color ${
          activeHeaderBranchTheme ? "branch-themed-card" : ""
        } ${
          isMoroccanAndalusiHeaderActive ? "andalusi-maghribi-official-header " : ""
        }${
          isMission
            ? "border-2 border-indigo-950 bg-white"
            : headerStyle === "CLASSIC_BORDERED"
            ? "border-2 border-slate-900 bg-white"
            : headerStyle === "MODERN_COMPACT"
            ? "border border-slate-300 bg-slate-50/70"
            : "border-2 border-indigo-950 bg-white"
        }`}
      >
        {/* الشريط اللوني العلوي الحيوي حسب تخصص الدروس المدرجة (تحليل / هندسة / جبر / احتمالات) */}
        {activeHeaderBranchTheme && headerRibbonGradientCss && (
          <div
            style={{ backgroundImage: headerRibbonGradientCss }}
            className="h-2 w-full print-exact-color"
          />
        )}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-xs">
          {/* العمود الأول: المؤسسة / الوزارة / البعثة */}
          <div className={isFr ? "text-left space-y-1" : "text-right space-y-1"}>
            {isMission ? (
              <>
                <div className="font-extrabold text-blue-900 text-[11px] tracking-tight">
                  Enseignement Français au Maroc (AEFE / OSUI)
                </div>
                <div className="font-black text-slate-950 text-sm">{school}</div>
                <div className="text-[11px] text-slate-600 font-semibold">
                  {calculatorAllowed
                    ? "✓ Calculatrice autorisée (mode examen actif - circ. 2015-178)"
                    : "✗ Calculatrice interdite"}
                </div>
              </>
            ) : (
              <>
                {headerStyle === "OFFICIAL_AREF" && (
                  <>
                    <div
                      style={
                        isMoroccanAndalusiHeaderActive && effectiveHeaderLetterSpacing
                          ? {
                              letterSpacing: effectiveHeaderLetterSpacing,
                              ["--title-letter-spacing" as string]: effectiveHeaderLetterSpacing,
                            }
                          : undefined
                      }
                      className={`font-extrabold text-slate-900 ${
                        isMoroccanAndalusiHeaderActive ? headerSubCalligraphyClass : ""
                      }`}
                    >
                      {isFr
                        ? "Royaume du Maroc · Ministère de l'Éducation Nationale, du Préscolaire et des Sports"
                        : isMoroccanAndalusiHeaderActive
                        ? "❁ المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة"
                        : "المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة"}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700">{academy}</div>
                    <div className="text-[11px] text-slate-600">{direction}</div>
                  </>
                )}
                <div
                  style={
                    headerSubCalligraphyClass && effectiveHeaderLetterSpacing
                      ? {
                          letterSpacing: effectiveHeaderLetterSpacing,
                          ["--title-letter-spacing" as string]: effectiveHeaderLetterSpacing,
                        }
                      : undefined
                  }
                  className={`font-extrabold text-indigo-950 pt-0.5 text-sm ${headerSubCalligraphyClass}`}
                >
                  {school}
                </div>
              </>
            )}
            <div className="text-slate-600 font-semibold tabular-nums text-[11px] flex flex-wrap items-center gap-1.5">
              <span>{isFr ? `Année Scolaire : ${year}` : `السنة الدراسية: ${year}`}</span>
              {!isMission && (
                <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.2 rounded">
                  {isFr ? "Note 142-08 · OP 2007" : "مذكرة 142-08 · OP 2007"}
                </span>
              )}
            </div>
          </div>

          {/* العمود الأوسط: عنوان الوثيقة والنموذج والمدة */}
          <div className="text-center space-y-1 border-y md:border-y-0 md:border-x border-slate-200 py-2 md:py-0 px-3">
            {isMoroccanHeaderOrnamentEnabled &&
              appliedTitleCalligraphy?.svgHeaderFrame &&
              appliedTitleCalligraphy.svgHeaderFrame !== "NONE" && (
                <MoroccanHeaderSvgBanner
                  frame={appliedTitleCalligraphy.svgHeaderFrame}
                  position="TOP"
                />
              )}
            {isMoroccanAndalusiHeaderActive && !isFr && (
              <div className="text-[9.5px] font-bold text-amber-800/85 tracking-widest select-none">
                ─── ❁ المملكة المغربية · الخط الأندلسي المغربي ❁ ───
              </div>
            )}
            <div
              style={{
                ...(activeCalligraphyOption || effectiveHeaderLetterSpacing
                  ? {
                      letterSpacing: effectiveHeaderLetterSpacing,
                      ["--title-letter-spacing" as string]: effectiveHeaderLetterSpacing,
                      wordSpacing: activeCalligraphyOption?.wordSpacing,
                      lineHeight: activeCalligraphyOption?.lineHeight,
                    }
                  : {}),
                ...(activeHeaderBranchTheme
                  ? {
                      backgroundImage: activeHeaderBranchTheme.titleGradientCss,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }
                  : {}),
              }}
              className={`font-black text-indigo-950 ${mainTitleScaleClass} ${mainTitleCalligraphyClass}`}
            >
              {(() => {
                const rawResolvedTitle = customDocTitle.trim()
                  ? `${customDocTitle.trim()}${modelText}`
                  : activeModule === "DS_142_08"
                  ? dsStructureMode === "EXAMEN_BLANC_2BAC"
                    ? isFr
                      ? `Examen Blanc du Baccalauréat (${track.code})${modelText}`
                      : isAr
                      ? `الامتحان التجريبي الموحد للبكالوريا (${track.labelAr})${modelText}`
                      : `الامتحان التجريبي للبكالوريا / Examen Blanc (${track.code})${modelText}`
                    : isMission
                    ? `Devoir Surveillé N° ${dsKey.replace("DS", "")} (${sem})${modelText}`
                    : isFr
                    ? `Devoir Surveillé N° ${dsKey.replace("DS", "")} (${sem})${modelText}`
                    : isAr
                    ? `الفرض المحروس رقم ${dsKey.replace("DS", "")} (${sem === "S1" ? "الدورة 1" : "الدورة 2"})${modelText}`
                    : `الفرض المحروس ${dsKey} / Devoir Surveillé ${dsKey}${modelText}`
                  : activeModule === "DM_SERIE"
                  ? isDM
                    ? isFr
                      ? `Devoir Maison ${dmNumber} (${sem})${modelText}`
                      : isAr
                      ? `الفرض المنزلي ${dmNumber} (${sem === "S1" ? "الدورة 1" : "الدورة 2"})${modelText}`
                      : `الفرض المنزلي ${dmNumber} / Devoir Maison ${dmNumber}${modelText}`
                    : isFr
                    ? `Série d'Exercices & Travaux Dirigés ${dmNumber} (${sem})`
                    : isAr
                    ? `سلسلة تمارين تطبيقية وتوليفية ${dmNumber} (${sem === "S1" ? "الدورة 1" : "الدورة 2"})`
                    : `سلسلة تمارين ${dmNumber} / Série d'Exercices ${dmNumber}`
                  : activeModule === "FICHE_OP2007"
                  ? isMission
                    ? "Fiche de Séquence Pédagogique (Programme Officiel)"
                    : isFr
                    ? "Fiche Pédagogique (Programme Officiel)"
                    : "جذاذة تربوية وفق التوجيهات التربوية 2007"
                  : activeModule === "DIAGNOSTIC"
                  ? isMission
                    ? "Test de Positionnement & Diagnostic"
                    : isFr
                    ? "Test d'Évaluation Diagnostique"
                    : "رائز التقويم التشخيصي للمكتسبات القبلية"
                  : isMission
                  ? "Progression Annuelle & Calendrier AEFE"
                  : isFr
                  ? "Répartition Annuelle & Programme"
                  : "التوزيع السنوي للمقرر والأطر المرجعية";

                return appliedTitleCalligraphy &&
                  isMoroccanHeaderOrnamentEnabled &&
                  appliedTitleCalligraphy.ornament !== "NONE" &&
                  !isFr
                  ? formatTitleWithCalligraphyOrnaments(
                      rawResolvedTitle,
                      appliedTitleCalligraphy.ornament
                    )
                  : rawResolvedTitle;
              })()}
            </div>
            {isMoroccanHeaderOrnamentEnabled &&
              appliedTitleCalligraphy?.svgHeaderFrame === "ZELLIGE_FEZ" && (
                <MoroccanHeaderSvgBanner frame="ZELLIGE_FEZ" position="BOTTOM" />
              )}
            <div
              style={
                headerSubCalligraphyClass && effectiveHeaderLetterSpacing
                  ? {
                      letterSpacing: effectiveHeaderLetterSpacing,
                      ["--title-letter-spacing" as string]: effectiveHeaderLetterSpacing,
                    }
                  : undefined
              }
              className={`text-xs font-bold text-slate-700 tabular-nums ${headerSubCalligraphyClass}`}
            >
              {customDocSubtitle.trim()
                ? customDocSubtitle.trim()
                : activeModule === "DIAGNOSTIC"
                ? isFr
                  ? `Durée : ${diagDuration}`
                  : `المدة: ${diagDuration}`
                : activeModule === "DM_SERIE"
                ? isDM
                  ? isFr
                    ? `À rendre le : ${dmDueDate} · Barème : 20 points`
                    : `تاريخ الإرجاع: ${dmDueDate} · سلم التنقيط: 20 نقطة`
                  : isFr
                  ? "Exercices progressifs (★ Application · ★★ Méthodes · ★★★ Approfondissement)"
                  : "تمارين متدرجة الصعوبة (★ تطبيق · ★★ توليف · ★★★ تعمق وتحدي)"
                : isFr
                ? `Durée de l'épreuve : ${track.durationFr}`
                : `المدة الزمنية: ${track.durationAr}`}
            </div>
            {distinctHeaderBranchThemes.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5">
                {distinctHeaderBranchThemes.map((bTheme) => (
                  <span
                    key={bTheme.id}
                    style={{
                      backgroundImage: bTheme.vividBannerGradientCss,
                      borderColor: bTheme.borderHex,
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black text-white shadow-2xs print-exact-color"
                  >
                    <span className="font-serif text-[11px] text-amber-200">
                      {bTheme.iconSymbol}
                    </span>
                    <span>
                      {isFr ? bTheme.branchBadgeFr : bTheme.branchBadgeAr}
                    </span>
                  </span>
                ))}
              </div>
            )}
            {customHeaderNote.trim() ? (
              <div className="text-[11px] text-indigo-900 font-semibold italic pt-0.5">
                {customHeaderNote.trim()}
              </div>
            ) : (
              isMission &&
              (activeModule === "DS_142_08" || (activeModule === "DM_SERIE" && isDM)) && (
                <div className="text-[10px] text-slate-500 italic">
                  La clarté des raisonnements et la rigueur de la rédaction sont prises en compte
                </div>
              )
            )}
          </div>

          {/* العمود الثالث: المادة والأستاذ والشعبة + شعار الأستاذ المطوّر */}
          <div
            className={`flex items-center gap-3 ${
              isFr ? "justify-end text-right" : "justify-end text-left"
            }`}
          >
            <div className="space-y-1">
              <div className="font-bold text-slate-800">
                {isFr ? "Discipline : Mathématiques" : "المادة: الرياضيات"}
              </div>
              <div className="font-extrabold text-slate-950">{prof}</div>
              <div className="text-indigo-900 font-bold">
                {isFr ? track.labelFr : track.labelAr}
              </div>
              {isBi && <div className="text-[11px] text-slate-500">{track.labelFr}</div>}
            </div>
            {includeTeacherLogo && (
              <div className="shrink-0">
                <TeacherLogo
                  variant={logoVariant}
                  size={60}
                  customImageUrl={customLogoUrl}
                  className="shadow-xs rounded-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* سطر الكفايات الرياضية الرسمية للبعثة الفرنسية */}
        {isMission &&
          includeCompetencies &&
          (activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
            <div className="border-t border-indigo-200 bg-indigo-50/70 px-4 py-2 text-[11px] text-indigo-950 font-bold">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-indigo-900 font-extrabold">
                  Compétences mathématiques évaluées (BOEN) :
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {FRENCH_COMPETENCIES.map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 border border-indigo-400 bg-white rounded-xs inline-block"></span>
                      <span>{c.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* شريط تعريف التلميذ والنقطة في الفروض والروائز مع خاتم المؤسسة وتأشيرتها الرسمية */}
        {(activeModule === "DS_142_08" ||
          activeModule === "DIAGNOSTIC" ||
          (activeModule === "DM_SERIE" && isDM)) &&
          (includeStudentBox || includeGradeBox) && (
            <div className="border-t border-slate-300 bg-slate-50/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              {includeStudentBox && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-bold text-slate-800">
                  <span className="flex items-center gap-1">
                    <span>{isFr ? "Nom & Prénom :" : "الاسم والنسب :"}</span>
                    <span className="moroccan-dotted-guide min-w-[160px] sm:min-w-[220px]" />
                  </span>
                  <span className="flex items-center gap-1">
                    <span>{isFr ? "Classe :" : "القسم :"}</span>
                    <span className="moroccan-dotted-guide min-w-[70px]" />
                  </span>
                  <span className="flex items-center gap-1">
                    <span>{isFr ? "N° :" : "الرقم :"}</span>
                    <span className="moroccan-dotted-guide min-w-[45px]" />
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* خاتم المؤسسة وتأشيرة الإدارة التربوية الرسمية */}
                <div className="hidden sm:flex flex-col items-center justify-center px-2 py-0.5 border border-dashed border-slate-400 bg-white rounded-md text-[9px] text-slate-600 leading-tight">
                  <span className="font-bold">{isFr ? "Cachet de l'établissement" : "خاتم المؤسسة وتأشيرة الإدارة"}</span>
                  <span className="text-[7.5px] text-slate-400 font-mono">Visa de l'administration</span>
                </div>

                {includeGradeBox && (
                  <div className="flex items-center gap-3 font-extrabold text-indigo-950 tabular-nums">
                    <span className="bg-white border-2 border-slate-900 px-3 py-1 rounded-md text-sm font-mono shadow-2xs">
                      {isFr ? "Note : ..... / 20" : "النقطة : ..... / 20"}
                    </span>
                    <span className="text-slate-600 font-normal text-[11px] hidden md:inline">
                      {isFr ? "Appréciation : ...................." : "الملاحظة : ...................."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* الخط الأكاديمي المزدوج الفاصل للترويسة الرسمية */}
        <div className="moroccan-academic-divider" />

        {/* شريط التوجيهات والتعليمات الرسمية لإجراء الاختبار (المذكرة الوزارية 142-08) */}
        {selectedConsigneKeys && selectedConsigneKeys.length > 0 && (activeModule === "DS_142_08" || activeModule === "DIAGNOSTIC") && (
          <div className="border-t border-slate-300 bg-slate-50/95 px-3 py-1.5 text-[10px] text-slate-800 avoid-break print-exact-color">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1 font-bold">
              <span className="text-emerald-950 flex items-center gap-1 font-black">
                <Scale className="w-3 h-3 text-emerald-700" />
                <span>{isFr ? "Consignes officielles de l'épreuve :" : "توجيهات وتعليمات رسمية لإجراء الاختبار (المذكرة 142-08):"}</span>
              </span>
              <span className="text-[9px] text-slate-500 font-mono">Cadres de Référence & OP 2007</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[9.5px] leading-tight text-slate-700">
              {OFFICIAL_DIDACTIC_CONSIGNES.filter((c) => selectedConsigneKeys.includes(c.key)).map((c) => (
                <div key={c.key} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>{isFr ? c.bodyFr : c.bodyAr}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const fontClass =
    DOC_FONT_OPTIONS.find((f) => f.id === docFontFamily)?.cssClass || "doc-font-academic";

  const scaleClass =
    docFontSize === "COMPACT"
      ? "doc-scale-compact"
      : docFontSize === "LARGE"
      ? "doc-scale-large"
      : "doc-scale-normal";

  const orientationClass =
    pageOrientation === "LANDSCAPE"
      ? "sheet-landscape page-landscape"
      : "sheet-portrait page-portrait";

  const handleProcessDroppedFile = (file: File, exerciseId: string) => {
    if (file.name.endsWith(".ggb")) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = typeof reader.result === "string" ? reader.result : "";
        try {
          const res = await fetch("/api/geogebra/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              fileBase64: base64,
              fileSize: file.size,
              targetExerciseTitle: isFr
                ? `Figure GeoGebra (${file.name})`
                : `شكل هندسي تفاعلي (${file.name})`,
            }),
          });
          const data = await res.json();
          if (data.success && data.resource) {
            onUpdateGeoGebraResource?.(exerciseId, data.resource);
            return;
          }
        } catch {
          // fallback
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    if (!file.type.startsWith("image/") && !/\.(png|jpe?g|svg|webp|gif)$/i.test(file.name)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const newFig: InsertedFigure = {
        id: `fig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        exerciseId,
        titleAr: `شكل توضيحي: ${cleanName}`,
        titleFr: `Figure : ${cleanName}`,
        dataUrl,
        widthPercent: 60,
        alignment: "center",
      };
      onAddFigure?.(newFig);
    };
    reader.readAsDataURL(file);
  };

  const renderExerciseFigureDropZone = (exerciseId: string) => {
    if (!isInlineEditable) return null;
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("figure-drop-active");
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("figure-drop-active");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("figure-drop-active");
          const file = e.dataTransfer.files?.[0];
          if (file) handleProcessDroppedFile(file, exerciseId);
        }}
        className="no-print my-2 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-2.5 text-center bg-slate-50/70 hover:bg-indigo-50/60 transition cursor-pointer group"
      >
        <input
          type="file"
          id={`fig-drop-${exerciseId}`}
          accept="image/*,.ggb"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleProcessDroppedFile(f, exerciseId);
            e.target.value = "";
          }}
        />
        <label
          htmlFor={`fig-drop-${exerciseId}`}
          className="cursor-pointer flex flex-col items-center gap-1 text-slate-500 group-hover:text-indigo-900"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {isFr
                ? "Déposer ici une image / figure géométrique ou cliquer pour insérer"
                : "اسحب وأفلت هنا صورة أو شكلاً هندسياً توضيحياً أو انقر للإدراج"}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            PNG, JPG, SVG, WebP, GeoGebra (.ggb)
          </span>
        </label>
      </div>
    );
  };

  // دالة تصيير كراسة التلميذ / حيز الإجابة الكاملة المعاير ذكياً (Full-Answer Calibrated Student Workspace)
  const renderStudentAnswerWorkspace = (
    difficultyLevel: "N1" | "N2" | "N3" | number | string = "N1",
    customPrompt?: string,
    showMargin = true,
    options?: {
      questionText?: string;
      solutionText?: string;
      points?: number | string;
      workspaceId?: string;
    }
  ) => {
    if (!includeAnswerWorkspace) return null;

    const wsId =
      options?.workspaceId ||
      `ws_${String(difficultyLevel)}_${(options?.questionText || customPrompt || "").slice(0, 24)}`;
    const lineDelta = customWorkspaceLineDeltas[wsId] || 0;

    const wsSpec = analyzeFullAnswerWorkspaceRequirement({
      questionText: options?.questionText,
      solutionText: options?.solutionText,
      difficultyLevel,
      points: options?.points,
      workspaceHeightMode,
      customLineDelta: lineDelta,
    });

    const baseHeight = wsSpec.heightPx;
    const levelStr = String(difficultyLevel).toUpperCase();

    // تحديد خلفية التسطير بحسب النمط المختار (أو التبديل التلقائي للورق الميليمتري في أسئلة الإنشاء الهندسي عند اختيار الكراسة)
    let gridBackgroundStyle: React.CSSProperties = {};
    let gridLabel = "";

    const effectiveGridStyle =
      wsSpec.taskType === "CURVE_GRAPH" && studentGridStyle === "PLAIN_BOX"
        ? "MILLIMETER_GRID"
        : studentGridStyle;

    switch (effectiveGridStyle) {
      case "SEYES_FRENCH":
        gridBackgroundStyle = {
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(139, 92, 246, 0.22) 0px, rgba(139, 92, 246, 0.22) 1px, transparent 1px, transparent 32px),
            repeating-linear-gradient(to bottom, rgba(139, 92, 246, 0.25) 0px, rgba(139, 92, 246, 0.25) 1px, transparent 1px, transparent 32px),
            repeating-linear-gradient(to bottom, rgba(186, 230, 253, 0.45) 0px, rgba(186, 230, 253, 0.45) 1px, transparent 1px, transparent 8px)
          `,
          backgroundColor: "#fcfcff",
        };
        gridLabel = isFr
          ? `Seyès 8×8mm · ${wsSpec.recommendedLines} lignes (Réponse complète)`
          : `تسطير Seyès 8×8mm · ${wsSpec.recommendedLines} أسطر (للإجابة الكاملة)`;
        break;

      case "LINED_RULED":
        gridBackgroundStyle = {
          backgroundImage: `repeating-linear-gradient(to bottom, rgba(148, 163, 184, 0.42) 0px, rgba(148, 163, 184, 0.42) 1px, transparent 1px, transparent 26px)`,
          backgroundColor: "#ffffff",
        };
        gridLabel = isFr
          ? `Ligné 8mm · ${wsSpec.recommendedLines} lignes calibrées`
          : `مسطر 8mm · ${wsSpec.recommendedLines} أسطر معايرة للإجابة الكاملة`;
        break;

      case "MILLIMETER_GRID":
        gridBackgroundStyle = {
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(234, 88, 12, 0.28) 0px, rgba(234, 88, 12, 0.28) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(to bottom, rgba(234, 88, 12, 0.28) 0px, rgba(234, 88, 12, 0.28) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(to right, rgba(234, 88, 12, 0.1) 0px, rgba(234, 88, 12, 0.1) 1px, transparent 1px, transparent 4px),
            repeating-linear-gradient(to bottom, rgba(234, 88, 12, 0.1) 0px, rgba(234, 88, 12, 0.1) 1px, transparent 1px, transparent 4px)
          `,
          backgroundColor: "#fffdf9",
        };
        gridLabel = isFr
          ? `Papier millimétré · ${wsSpec.recommendedLines} lignes + Tracé`
          : `ورق ميليمتري · ${wsSpec.recommendedLines} أسطر + إنشاء هندسي`;
        break;

      case "DOTTED_BOX":
        gridBackgroundStyle = {
          backgroundImage: `radial-gradient(rgba(100, 116, 139, 0.35) 1.2px, transparent 1.2px)`,
          backgroundSize: "16px 16px",
          backgroundColor: "#ffffff",
        };
        gridLabel = isFr
          ? `Grille pointée 5mm · ${wsSpec.recommendedLines} lignes`
          : `شبكة نقطية 5mm · ${wsSpec.recommendedLines} أسطر`;
        break;

      case "PLAIN_BOX":
      default:
        gridBackgroundStyle = {
          backgroundColor: "#ffffff",
        };
        gridLabel = isFr
          ? `Cadre blanc · ${wsSpec.recommendedLines} lignes`
          : `إطار أبيض · ${wsSpec.recommendedLines} أسطر`;
        break;
    }

    const isLtr = isFr || isMission;
    const activeSteps = isLtr ? wsSpec.methodStepsFr : wsSpec.methodStepsAr;

    return (
      <div className="mt-2.5 mb-3 w-full select-none avoid-break">
        <div className="rounded-xl border border-slate-300/95 overflow-hidden shadow-2xs flex bg-white">
          {/* عمود الهامش مع خط أحمر رسمي كلاسيكي لتقويم الأستاذ */}
          {showMargin && (
            <div
              className={`w-16 sm:w-20 shrink-0 bg-rose-50/30 flex flex-col justify-between p-1.5 text-[9px] font-bold text-rose-900/85 text-center ${
                isLtr ? "border-r-2 border-rose-400" : "border-l-2 border-rose-400 order-last"
              }`}
            >
              <div className="space-y-0.5">
                <span className="tracking-tight uppercase block font-extrabold">
                  {isFr ? "Marge" : "الهامش"}
                </span>
                <span className="inline-block px-1.5 py-0.2 rounded bg-rose-100/80 text-rose-900 font-mono text-[8px]">
                  {levelStr.includes("3") ? "N3" : levelStr.includes("2") ? "N2" : "N1"}
                </span>
              </div>

              <div className="border border-rose-300/90 rounded-md bg-white/90 p-1 text-[8.5px] leading-tight shadow-2xs space-y-1">
                <span className="block text-rose-950 font-black">
                  {isFr ? "Note" : "النقطة"}
                </span>
                <div className="h-4 border-b border-dotted border-rose-300" />
                {options?.points && (
                  <span className="block font-mono text-[8px] text-slate-600">
                    / {options.points}
                  </span>
                )}
              </div>

              <div className="space-y-0.5 text-[7.5px] text-rose-700/80 font-mono">
                <span className="block font-bold">
                  {wsSpec.recommendedLines} {isFr ? "lignes" : "أسطر"}
                </span>
                <span className="block text-[7px] text-slate-400">
                  ({wsSpec.heightCmLatex})
                </span>
              </div>
            </div>
          )}

          {/* حيز التحرير الرئيسي المعاير للإجابة الكاملة مع القوالب المنهجية المساعدة */}
          <div
            className="flex-1 relative flex flex-col justify-between p-2.5"
            style={{
              minHeight: `${baseHeight}px`,
              ...gridBackgroundStyle,
            }}
          >
            {/* الشريط المنهجي العلوي لتوجيه التلميذ نحو الإجابة الكاملة */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/80 bg-white/85 backdrop-blur-xs px-2 py-1 rounded-md text-[9px] text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                <span>
                  {customPrompt || (isLtr ? wsSpec.taskBadgeFr : wsSpec.taskBadgeAr)}
                </span>
                {wsSpec.subQuestionsCount > 1 && (
                  <span className="font-mono text-[8px] bg-indigo-50 text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-200">
                    {wsSpec.subQuestionsCount}{" "}
                    {isLtr ? "sous-parties détectées" : "شطور فرعية"}
                  </span>
                )}
              </div>

              {/* أزرار تعديل عدد الأسطر يدوياً لكل سؤال (تظهر على الشاشة فقط) */}
              <div className="no-print flex items-center gap-1 font-mono text-[8.5px]">
                <button
                  type="button"
                  onClick={() =>
                    setCustomWorkspaceLineDeltas((prev) => ({
                      ...prev,
                      [wsId]: (prev[wsId] || 0) - 2,
                    }))
                  }
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer transition"
                  title={isFr ? "Réduire l'espace (-2 lignes)" : "تقليص الفراغ بسطرين (-2)"}
                >
                  -2 {isFr ? "lig." : "أسطر"}
                </button>
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-900 font-bold border border-indigo-200">
                  {wsSpec.recommendedLines} {isFr ? "lignes" : "أسطر"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCustomWorkspaceLineDeltas((prev) => ({
                      ...prev,
                      [wsId]: (prev[wsId] || 0) + 2,
                    }))
                  }
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer transition"
                  title={isFr ? "Agrandir l'espace (+2 lignes)" : "توسيع الفراغ بسطرين (+2)"}
                >
                  +2 {isFr ? "lig." : "أسطر"}
                </button>
              </div>
            </div>

            {/* خطوات التحرير الكامل الاسترشادية */}
            <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1 text-[8.5px] text-slate-500/90 font-medium px-1">
              {activeSteps.map((step, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white/75 border border-dashed border-slate-300/80 rounded px-1.5 py-0.5 truncate"
                >
                  {step}
                </div>
              ))}
            </div>

            {/* قوالب بيداغوجية مدمجة حسب طبيعة السؤال (البرهان بالترجع / جدول التغيرات / إنشاء المنحنى) */}
            {wsSpec.taskType === "RECURRENCE_PROOF" && (
              <div className="my-2 space-y-2 px-1.5 text-[9.5px] text-slate-600/90 font-semibold">
                <div className="border-b border-dotted border-slate-300 pb-4">
                  • {isLtr ? "Étape 1 (Initialisation) :" : "المرحلة 1 (التحقق الأساسي من أجل الحد الأول) :"}
                </div>
                <div className="border-b border-dotted border-slate-300 pb-10">
                  • {isLtr ? "Étape 2 (Hérédité — Soit n fixé, supposons que... et montrons que...) :" : "المرحلة 2 (افتراض الترجع لـ n والبرهان على صحة الخاصية من أجل n + 1) :"}
                </div>
                <div className="border-b border-dotted border-slate-300 pb-3">
                  • {isLtr ? "Étape 3 (Conclusion d'après le principe de récurrence) :" : "المرحلة 3 (الاستنتاج النهائي حسب مبدأ الترجع) :"}
                </div>
              </div>
            )}

            {wsSpec.taskType === "VARIATION_TABLE" && (
              <div className="my-2 bg-white/95 border border-slate-400 rounded-lg overflow-hidden shadow-2xs">
                <div className="bg-slate-100/90 px-2 py-0.5 border-b border-slate-300 text-[8.5px] font-bold text-slate-700 flex justify-between">
                  <span>
                    {isLtr
                      ? "Cadre pré-tracée du Tableau de Signe & de Variations :"
                      : "إطار مهيأ لجدول الإشارة والتغيرات الكامل للدالة :"}
                  </span>
                  <span className="font-mono text-slate-500" dir="ltr">
                    x | f&apos;(x) | f(x)
                  </span>
                </div>
                <table className="w-full border-collapse text-[9.5px] font-mono" dir="ltr">
                  <tbody>
                    <tr className="border-b border-slate-400 h-6 bg-slate-50/60">
                      <td className="border-r border-slate-400 w-20 text-center font-bold text-slate-800">
                        x
                      </td>
                      <td className="px-3 text-slate-400 flex items-center justify-between h-6">
                        <span>-∞</span>
                        <span>................</span>
                        <span>+∞</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-400 h-7">
                      <td className="border-r border-slate-400 w-20 text-center font-bold text-slate-800">
                        Signe f&apos;(x)
                      </td>
                      <td className="px-3 text-center text-slate-300">
                        | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
                      </td>
                    </tr>
                    <tr className="h-16">
                      <td className="border-r border-slate-400 w-20 text-center font-bold text-slate-800">
                        Variations de f(x)
                      </td>
                      <td className="px-3 text-slate-300 text-center align-middle text-[8.5px]">
                        {isLtr
                          ? "(Flèches de croissance/décroissance, limites aux bornes et extremums)"
                          : "(أسهم الرتابة والتزايد/التناقص مع النهايات عند المحدات والمطارف)"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {wsSpec.taskType === "CURVE_GRAPH" && (
              <div className="my-2 flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="flex-1 border border-dashed border-slate-300 rounded-lg p-2 bg-white/60 flex flex-col justify-between text-[9px] text-slate-500">
                  <span className="font-bold text-slate-700">
                    {isLtr
                      ? "Éléments géométriques préparatoires au tracé :"
                      : "العناصر الهندسية الممهدة لإنشاء المنحنى :"}
                  </span>
                  <div className="space-y-2 my-auto py-2">
                    <div className="border-b border-dotted border-slate-300 pb-1">
                      • {isLtr ? "Asymptotes / Branches infinies :" : "المقاربات والفروع اللانهائية :"}
                    </div>
                    <div className="border-b border-dotted border-slate-300 pb-1">
                      • {isLtr ? "Tangentes horizontales / obliques :" : "المماسات الأفقية والمائلة :"}
                    </div>
                    <div className="border-b border-dotted border-slate-300 pb-1">
                      • {isLtr ? "Points particuliers & intersections :" : "نقط التقاطع مع المحورين والانعطاف :"}
                    </div>
                  </div>
                </div>

                {/* معلم متعامد ممنظم (O, i, j) مرسوم بدقة شعاعية لإنشاء المنحنى */}
                <div className="w-full sm:w-64 h-44 bg-white border border-slate-400 rounded-lg p-1.5 flex flex-col items-center justify-center relative shrink-0 shadow-2xs">
                  <span
                    className="absolute top-1 left-2 text-[8px] font-mono font-bold text-slate-600 bg-white/90 px-1 rounded"
                    dir="ltr"
                  >
                    Repère orthonormé (O, i⃗, j⃗)
                  </span>
                  <svg
                    viewBox="-110 -75 220 150"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <pattern
                        id={`grid_${wsId.replace(/[^a-zA-Z0-9]/g, "")}`}
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="0.7"
                        />
                      </pattern>
                    </defs>
                    <rect
                      x="-100"
                      y="-65"
                      width="200"
                      height="130"
                      fill={`url(#grid_${wsId.replace(/[^a-zA-Z0-9]/g, "")})`}
                    />
                    {/* المحور الأفقي Ox */}
                    <line
                      x1="-100"
                      y1="0"
                      x2="102"
                      y2="0"
                      stroke="#334155"
                      strokeWidth="1.2"
                    />
                    <polygon points="105,0 99,-3 99,3" fill="#334155" />
                    <text x="96" y="11" fontSize="8" fontWeight="bold" fill="#0f172a">
                      x
                    </text>
                    {/* المحور العمودي Oy */}
                    <line
                      x1="0"
                      y1="65"
                      x2="0"
                      y2="-65"
                      stroke="#334155"
                      strokeWidth="1.2"
                    />
                    <polygon points="0,-68 -3,-62 3,-62" fill="#334155" />
                    <text x="5" y="-58" fontSize="8" fontWeight="bold" fill="#0f172a">
                      y
                    </text>
                    {/* المتجهتان الواحديتان i و j وأصل المعلم O */}
                    <line
                      x1="0"
                      y1="0"
                      x2="20"
                      y2="0"
                      stroke="#4f46e5"
                      strokeWidth="1.8"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-20"
                      stroke="#4f46e5"
                      strokeWidth="1.8"
                    />
                    <text x="-9" y="10" fontSize="7.5" fontWeight="bold" fill="#1e293b">
                      O
                    </text>
                    <text x="9" y="10" fontSize="7.5" fontWeight="bold" fill="#4f46e5">
                      i⃗
                    </text>
                    <text x="-10" y="-8" fontSize="7.5" fontWeight="bold" fill="#4f46e5">
                      j⃗
                    </text>
                  </svg>
                </div>
              </div>
            )}

            {/* مساحة التسطير الفارغة الإضافية لضمان استيعاب التحرير الكامل للتلميذ */}
            <div className="flex-1 min-h-[64px]" />

            {/* شريط تأطير النتيجة النهائية وشارة التسطير في الأسفل */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-dashed border-slate-300/80">
              <div className="border border-indigo-300/90 bg-white/90 rounded-md px-2.5 py-1 text-[9px] font-bold text-indigo-950 min-w-[210px] sm:min-w-[260px] flex items-center justify-between">
                <span>
                  {isLtr
                    ? "Conclusion / Résultat final encadré :"
                    : "تأطير النتيجة النهائية والاستنتاج :"}
                </span>
                <span className="text-slate-300 font-mono">........................</span>
              </div>

              <div className="no-print text-[8px] font-mono text-slate-400/90 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
                {gridLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-3">
      {/* حقن ديناميكي لقواعد @page في الطباعة لضبط الهوامش تلقائياً حسب نموذج الوثيقة */}
      <style>{`
        @media print {
          @page {
            size: A4 ${pageOrientation === "LANDSCAPE" ? "landscape" : "portrait"};
            margin-top: ${activeMarginModelSpec.topMm}mm;
            margin-bottom: ${activeMarginModelSpec.bottomMm}mm;
            margin-left: ${activeMarginModelSpec.xMm}mm;
            margin-right: ${activeMarginModelSpec.xMm}mm;
          }
        }
      `}</style>

      {/* ============================================================================
          شريط أدوات الطباعة والمعاينة البيداغوجية الذكي المتكيف مع نوع الوثيقة
          يتيح للأستاذ معاينة أو طباعة أي نطاق من الوثيقة الحالية بضغطة زر واحدة
         ============================================================================ */}
      {/* ============================================================================
          استوديو الطباعة والمعاينة البيداغوجية الموحد (Unified Educational Studio Bar)
          تصميم موحد فائق الأناقة والهدوء، يزيل الازدحام ويجعل الورقة A4 واضحة ومباشرة
         ============================================================================ */}
      <div className="no-print bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-3 border border-indigo-500/30 shadow-xl space-y-2.5">
        {/* المستوى 1: شريط التحكم الرئيسي المنظم (Document Profile + Scope Tabs + Print Actions) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* هوية الوثيقة الحالية ومقاس الهوامش */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold text-sm shadow-xs">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs font-black text-white flex flex-wrap items-center gap-1.5">
                <span>{printStudioProfile.moduleBadge}</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  A4 ISO 216 · {activeMarginModelSpec.topMm}×{activeMarginModelSpec.xMm}mm
                </span>
                {printScope && (
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse">
                    جاري إرسال {printScope} للطابعة...
                  </span>
                )}
                {previewScopeFilter !== "ALL" && !printScope && (
                  <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 text-[10px] font-black">
                    معاينة مفلترة: {previewScopeFilter}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* تبويبات النطاق البيداغوجي المباشر (Segmented Document Scope Control) */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-indigo-500/30 shadow-inner">
            {printStudioProfile.scopes.map((sc) => {
              const isSelected = previewScopeFilter === sc.scope;
              return (
                <button
                  key={`scope-tab-${sc.scope}`}
                  type="button"
                  onClick={() => {
                    setPreviewScopeFilter(sc.scope);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-xs font-black"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                  title={`${sc.title} — ${sc.subtitle}`}
                >
                  <span className="font-mono text-[10px] opacity-75">{sc.codeBadge}</span>
                  <span>{sc.title}</span>
                </button>
              );
            })}
          </div>

          {/* أزرار الإجراءات الفورية: الطباعة وتوفير الحبر وفتح الدرج */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickPedagogicalPrint(previewScopeFilter)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              title="طباعة النطاق المعروض حالياً على ورق A4 بهوامش دقيقة ومنضبطة (Ctrl + P)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة فورية</span>
            </button>

            <button
              type="button"
              onClick={() => setLaserInkSaverMode((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                laserInkSaverMode
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs"
                  : "bg-slate-800/90 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-800"
              }`}
              title="وضع توفير حبر الطابعة الليزرية وسحب النسخ المدرسي بالأبيض والأسود"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">
                {laserInkSaverMode ? "توفير الحبر: مفعّل" : "توفير الحبر"}
              </span>
            </button>

            {/* الحل المبتكر 1: زر الضبط التلقائي للورقة الواحدة لمنع انزلاق بضعة أسطر للصفحة الثانية */}
            <button
              type="button"
              onClick={() => setIsOnePageFitActive((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                isOnePageFitActive
                  ? "bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-xs ring-2 ring-emerald-200"
                  : "bg-slate-800/90 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-800"
              }`}
              title="الضبط التلقائي للورقة الواحدة (1-Page Smart Fit): ضغط الهوامش وتباعدات KaTeX لاحتواء الفرض كاملاً في صفحة A4 واحدة"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">
                {isOnePageFitActive ? "صفحة واحدة: مفعّل" : "ملاءمة صفحة واحدة"}
              </span>
            </button>

            {/* الحل المبتكر 2: زر تباين السحب والاستنساخ المدرسي */}
            <button
              type="button"
              onClick={() => setIsPhotocopyContrastActive((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                isPhotocopyContrastActive
                  ? "bg-white text-slate-950 border-white font-black shadow-xs ring-2 ring-slate-300"
                  : "bg-slate-800/90 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-800"
              }`}
              title="نمط السحب والاستنساخ عالي التباين: إزالة التدرجات الرمادية وضمان خروج الأسئلة بالأسود النقي 100% على آلات السحب (Régéoneur)"
            >
              <span>📄</span>
              <span className="hidden sm:inline">
                {isPhotocopyContrastActive ? "تباين السحب: مفعّل" : "تباين السحب"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvancedPaperSettings((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border transition cursor-pointer flex items-center gap-1.5 ${
                showAdvancedPaperSettings
                  ? "bg-amber-400 text-slate-950 border-amber-300 shadow-xs"
                  : "bg-slate-800/90 text-cyan-200 border-slate-700 hover:bg-slate-800"
              }`}
              title="فتح درج أدوات الهندسة البيداغوجية، قوالب الهوامش، تصدير مسار، وكتيب A5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showAdvancedPaperSettings ? "إغلاق الضبط ▲" : "أدوات وضبط متقدم ▼"}</span>
            </button>
          </div>
        </div>

        {/* المستوى 2: شريط مدمج وهادئ (Section Jumps + A4 Balance + Time Balance) */}
        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-xl px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* الانتقال السريع لأقسام الورقة الحالية */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10.5px] font-bold text-slate-400 pl-1">
              انتقال سريع:
            </span>
            {printStudioProfile.quickSections.map((sec) => (
              <button
                key={`jump-sec-${sec.id}`}
                type="button"
                onClick={() => handleScrollToPreviewSection(sec.id)}
                className="px-2 py-0.5 rounded-md bg-indigo-950 hover:bg-indigo-800 text-cyan-200 hover:text-white border border-indigo-700/50 text-[10.5px] font-bold transition cursor-pointer"
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* مؤشرات التوازن البيداغوجي A4 والزمن */}
          <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-bold border ${
                a4LayoutReport.hasTrailingOrphanOverflow || a4LayoutReport.hasHorizontalOverflow
                  ? "bg-amber-950/80 text-amber-200 border-amber-500/40"
                  : "bg-emerald-950/80 text-emerald-200 border-emerald-500/40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  a4LayoutReport.hasTrailingOrphanOverflow || a4LayoutReport.hasHorizontalOverflow
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-400"
                }`}
              />
              <span>
                {a4LayoutReport.hasTrailingOrphanOverflow
                  ? `تجاوز A4: ص ${a4LayoutReport.rawPageCount} (${a4LayoutReport.lastPageFillPercentBefore}%)`
                  : `تخطيط A4 متوازن (${a4LayoutReport.rawPageCount} ص · ${printableAreaUtilizationPct}% استغلال)`}
              </span>
            </span>

            {activeModule === "DS_142_08" && (
              <span className="inline-flex items-center gap-1 text-slate-300 font-mono">
                <span>⏱️ زمن الإنجاز:</span>
                <strong className="text-amber-300">{examTimeBalance.estimatedStudentMinutes} د</strong>
                <span className="text-slate-500">/</span>
                <span className="text-white">{examTimeBalance.officialMinutes} د</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleToggleA4Breaks}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                effectiveShowA4Breaks
                  ? "bg-cyan-500 text-slate-950 border-cyan-400"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
              }`}
              title="إظهار أو إخفاء فواصل صفحات A4 الحية"
            >
              <Layers className="w-3 h-3" />
              <span>فواصل A4</span>
            </button>

            <button
              type="button"
              onClick={handleToggleEconomicMode}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                effectiveEconomicMode
                  ? "bg-emerald-500 text-slate-950 border-emerald-400"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
              }`}
              title="طباعة صفحتين A5 في ورقة A4 واحدة بالعرض لتوفير الورق"
            >
              <span className="font-mono text-[9px] font-black">2-Up</span>
              <span>اقتصادي</span>
            </button>
          </div>
        </div>

        {/* المستوى 3: درج الأدوات المتقدمة وقوالب الهوامش (يظهر فقط عند النقر لتوفير المساحة) */}
        {showAdvancedPaperSettings && (
          <div className="bg-slate-950/90 rounded-xl p-3 border border-indigo-500/30 space-y-3 pt-3">
            {/* أ. شريط نماذج الهوامش البيداغوجية والضبط التلقائي Auto-Fit */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900/60 pb-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-cyan-300 font-black flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>نماذج هوامش A4 :</span>
                </span>
                {DOC_VIEW_MARGIN_MODELS.map((model) => {
                  const isSelected = activeMarginModelSpec.id === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleSelectDocumentViewModel(model)}
                      title={isFr ? model.descriptionFr : model.descriptionAr}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 border-cyan-300 shadow-2xs font-black"
                          : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span>{isFr ? model.labelFr : model.labelAr}</span>
                      <span className="font-mono text-[9px] opacity-75">
                        ({model.topMm}×{model.xMm})
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleApplyAutoA4LayoutFit}
                  className="px-2.5 py-1 rounded-lg text-[10.5px] font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                  title="ضبط الهوامش والمسافات تلقائياً لمنع تجاوز الصفحات"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>ضبط تلقائي A4 (Auto-Fit)</span>
                </button>

                {autoFitCompactionScale < 1 && (
                  <button
                    type="button"
                    onClick={() => setAutoFitCompactionScale(1)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    إلغاء الضغط ({Math.round(autoFitCompactionScale * 100)}%)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowMarginGuides((v) => !v)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                    showMarginGuides
                      ? "bg-cyan-500 text-slate-950 border-cyan-400"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  }`}
                  title="إظهار أو إخفاء خطوط مسطرة الهوامش"
                >
                  <Compass className="w-3 h-3" />
                  <span>مسطرة الهوامش</span>
                </button>
              </div>
            </div>

            {/* ب. الأدوات التربوية التكميلية والتبديل بين أنواع الوثائق */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900/60 pb-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-amber-300 font-black pl-1">أدوات تكميلية:</span>
                {onOpenCompetencyBank && (
                  <button
                    type="button"
                    onClick={onOpenCompetencyBank}
                    className="px-2.5 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-bold border border-emerald-500/40 transition cursor-pointer"
                  >
                    📚 بنك التمارين (بلوم)
                  </button>
                )}
                {onOpenMassarExport && (
                  <button
                    type="button"
                    onClick={onOpenMassarExport}
                    className="px-2.5 py-1 rounded-lg bg-teal-900/80 hover:bg-teal-800 text-teal-100 font-bold border border-teal-500/40 transition cursor-pointer"
                  >
                    📊 تصدير مسار Massar
                  </button>
                )}
                {onOpenDiagnosticAnalysis && (
                  <button
                    type="button"
                    onClick={onOpenDiagnosticAnalysis}
                    className="px-2.5 py-1 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 font-bold border border-indigo-500/40 transition cursor-pointer"
                  >
                    📈 رصد التعثرات 142-08
                  </button>
                )}
                {onOpenBookletMode && (
                  <button
                    type="button"
                    onClick={onOpenBookletMode}
                    className="px-2.5 py-1 rounded-lg bg-sky-900/80 hover:bg-sky-800 text-sky-100 font-bold border border-sky-500/40 transition cursor-pointer"
                  >
                    📖 كتيب مطوي A4/A5
                  </button>
                )}
                {onOpenInteractiveQr && (
                  <button
                    type="button"
                    onClick={onOpenInteractiveQr}
                    className="px-2.5 py-1 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-100 font-bold border border-purple-500/40 transition cursor-pointer"
                  >
                    📲 كود الدعم QR
                  </button>
                )}
                {onAddFigure && (
                  <button
                    type="button"
                    onClick={() => setShowBacCurvesLibrary((v) => !v)}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer border ${
                      showBacCurvesLibrary
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-black"
                        : "bg-slate-800 text-amber-200 border-slate-700 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>منحنيات البكالوريا</span>
                  </button>
                )}
              </div>

              {/* تبديل فوري لنوع الوثيقة الحالية */}
              {onSwitchDocumentViewModel && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-bold">تبديل سريع:</span>
                  <button
                    type="button"
                    onClick={() => onSwitchDocumentViewModel(activeModule === "FICHE_OP2007" ? "DS_142_08" : "FICHE_OP2007")}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 text-[10.5px] font-bold cursor-pointer"
                  >
                    {activeModule === "FICHE_OP2007" ? "📄 الفرض المحروس" : "📚 الجذاذة التربوية"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeModule === "DM_SERIE") onSwitchDocumentViewModel("REPARTITION_CERTIF");
                      else onSwitchDocumentViewModel("DM_SERIE", "SERIE_TD");
                    }}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-200 border border-slate-700 text-[10.5px] font-bold cursor-pointer"
                  >
                    {activeModule === "DM_SERIE" ? "📅 التوزيع السنوي" : "📑 سلسلة التمارين"}
                  </button>
                </div>
              )}
            </div>

            {/* ج. الضبط الدقيق للهوامش بالمليمتر وحزم LaTeX وخامة الورق */}
            <div className="pt-2 border-t border-indigo-900/60 space-y-2.5">
            {/* شريط الضبط اليدوي للهوامش وربط نوع الوثيقة */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] font-bold text-slate-700">
                  {isFr ? activeMarginModelSpec.descriptionFr : activeMarginModelSpec.descriptionAr}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {onSwitchDocumentViewModel && (
                    <label className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={syncDocTypeOnModelClick}
                        onChange={(e) => setSyncDocTypeOnModelClick(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>تبديل نوع الوثيقة والهوامش معاً</span>
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowCustomMarginSliders((v) => !v)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                      showCustomMarginSliders
                        ? "bg-indigo-900 text-amber-200 border-indigo-800"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50"
                    }`}
                  >
                    ضبط الهوامش بالمليمتر (mm)
                  </button>
                  {effectiveMarginOverride && (
                    <button
                      type="button"
                      onClick={() => updateMarginOverride(null)}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-extrabold cursor-pointer"
                    >
                      استعادة الضبط التلقائي
                    </button>
                  )}
                </div>
              </div>

              {showCustomMarginSliders && (
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center bg-white rounded-xl p-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-700">
                      <span>الهامش العلوي (Top):</span>
                      <span className="font-mono text-indigo-700">
                        {activeMarginModelSpec.topMm} mm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={1}
                      value={activeMarginModelSpec.topMm}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateMarginOverride({
                          topMm: val,
                          bottomMm: activeMarginModelSpec.bottomMm,
                          xMm: activeMarginModelSpec.xMm,
                          modelId: activeMarginModelSpec.id,
                        });
                      }}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-700">
                      <span>الهامش السفلي (Bottom):</span>
                      <span className="font-mono text-indigo-700">
                        {activeMarginModelSpec.bottomMm} mm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={1}
                      value={activeMarginModelSpec.bottomMm}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateMarginOverride({
                          topMm: activeMarginModelSpec.topMm,
                          bottomMm: val,
                          xMm: activeMarginModelSpec.xMm,
                          modelId: activeMarginModelSpec.id,
                        });
                      }}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-700">
                      <span>الهامش الجانبي (Left/Right):</span>
                      <span className="font-mono text-emerald-700">
                        {activeMarginModelSpec.xMm} mm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={1}
                      value={activeMarginModelSpec.xMm}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateMarginOverride({
                          topMm: activeMarginModelSpec.topMm,
                          bottomMm: activeMarginModelSpec.bottomMm,
                          xMm: val,
                          modelId: activeMarginModelSpec.id,
                        });
                      }}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-lg p-2 font-mono text-[9.5px] leading-relaxed">
                    <div className="text-amber-300 font-bold mb-0.5">LaTeX / Typst Sync:</div>
                    <div className="truncate">
                      \geometry&#123;top={(activeMarginModelSpec.topMm / 10).toFixed(1)}cm,
                      bottom={(activeMarginModelSpec.bottomMm / 10).toFixed(1)}cm, x=
                      {(activeMarginModelSpec.xMm / 10).toFixed(1)}cm&#125;
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* اختيار حزمة تنسيق LaTeX المباشرة */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 px-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  حزمة تنسيق LaTeX:
                </span>
                {LATEX_PACKAGE_OPTIONS.map((pkg) => {
                  const isActive = latexPackageTheme === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => onChangeLatexPackageTheme?.(pkg.id)}
                      title={isFr ? pkg.descriptionFr : pkg.descriptionAr}
                      className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? "bg-indigo-950 text-amber-300 border-indigo-900 shadow-xs ring-1 ring-indigo-400"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40"
                      }`}
                    >
                      <span>{pkg.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* اختيار خامة الورق ورمز QR */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                  {PAPER_SURFACE_OPTIONS.map((surf) => (
                    <button
                      key={surf.id}
                      type="button"
                      onClick={() => onChangePaperSurface?.(surf.id)}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer ${
                        paperSurface === surf.id
                          ? "bg-white text-indigo-950 shadow-2xs font-black"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      title={isFr ? surf.labelFr : surf.labelAr}
                    >
                      {surf.id === "PLAIN_WHITE"
                        ? "أبيض A4"
                        : surf.id === "MILLIMETER_GRID"
                        ? "مليمتري"
                        : surf.id === "SEYES_FRENCH"
                        ? "دفتر Seyès"
                        : "عاجي"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleToggleInteractiveQr}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    effectiveIncludeInteractiveQr
                      ? "bg-indigo-900 text-amber-300 border-indigo-800 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                  title="إدراج رمز الاستجابة السريعة (QR Code) للنسخة التفاعلية الرقمية للفرض في أسفل وثيقة PDF"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>رمز QR التفاعلي</span>
                </button>
              </div>
            </div>

            {/* شريط تخصيص حزمة tcolorbox للمسائل الرياضية المعقدة */}
            {latexPackageTheme === "TCOLORBOX" && onChangeTcolorboxConfig && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-indigo-50/50 border border-indigo-200/80 rounded-xl px-3 py-2 text-[11px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-indigo-950 flex items-center gap-1">
                    <span>🎨 تخصيص tcolorbox للمسائل المعقدة:</span>
                  </span>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {TCOLORBOX_PALETTE_OPTIONS.map((pal) => {
                      const active = tcolorboxConfig.palette === pal.id;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() =>
                            onChangeTcolorboxConfig({
                              ...tcolorboxConfig,
                              palette: pal.id,
                            })
                          }
                          title={isFr ? pal.labelFr : pal.labelAr}
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer ${
                            active
                              ? "bg-slate-900 text-white shadow-2xs"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-white/50 shrink-0"
                            style={{ backgroundColor: pal.swatchHex }}
                          />
                          <span className="hidden md:inline">
                            {pal.labelAr.split(" (")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-600">التظليل (colback):</span>
                    {TCOLORBOX_SHADING_OPTIONS.map((sh) => {
                      const active = tcolorboxConfig.shading === sh.id;
                      return (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() =>
                            onChangeTcolorboxConfig({
                              ...tcolorboxConfig,
                              shading: sh.id,
                            })
                          }
                          title={isFr ? sh.labelFr : sh.labelAr}
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition cursor-pointer ${
                            active
                              ? "bg-indigo-900 text-amber-300"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {sh.percentLabel}
                        </button>
                      );
                    })}
                  </div>

                  <select
                    value={tcolorboxConfig.frameStyle}
                    onChange={(e) =>
                      onChangeTcolorboxConfig({
                        ...tcolorboxConfig,
                        frameStyle: e.target.value as TcolorboxCustomConfig["frameStyle"],
                      })
                    }
                    className="border border-slate-300 rounded-lg px-2 py-1 text-[10.5px] bg-white font-bold text-slate-800"
                  >
                    {TCOLORBOX_FRAME_OPTIONS.map((fr) => (
                      <option key={fr.id} value={fr.id}>
                        {isFr ? fr.labelFr : fr.labelAr}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-1 font-bold text-indigo-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tcolorboxConfig.applyToComplexProblems}
                      onChange={(e) =>
                        onChangeTcolorboxConfig({
                          ...tcolorboxConfig,
                          applyToComplexProblems: e.target.checked,
                        })
                      }
                      className="rounded text-indigo-700 w-3.5 h-3.5 accent-indigo-700"
                    />
                    <span>تأطير المسألة التوليفية</span>
                  </label>
                </div>
              </div>
            )}

            {/* شريط التدرج اللوني التلقائي للترويسات بناءً على تخصص الدرس */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1.5 font-extrabold text-slate-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableBranchColorGradient}
                    onChange={(e) =>
                      onChangeEnableBranchColorGradient?.(e.target.checked)
                    }
                    className="rounded text-indigo-700 w-3.5 h-3.5 accent-indigo-700"
                  />
                  <span className="flex items-center gap-1">
                    <span>🎨</span>
                    <span>التدرج اللوني التلقائي للترويسات حسب تخصص الدرس :</span>
                  </span>
                </label>

                {enableBranchColorGradient && (
                  <div className="flex flex-wrap items-center gap-1">
                    {(
                      [
                        {
                          mode: "AUTO_BY_LESSON" as BranchColorGradientMode,
                          label: "⚡ تلقائي حيوي (حسب كل درس)",
                          dotClass:
                            "bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500",
                        },
                        {
                          mode: "ANALYSIS_BLUE" as BranchColorGradientMode,
                          label: "∫ التحليل (أزرق)",
                          dotClass: "bg-blue-600",
                        },
                        {
                          mode: "GEOMETRY_GREEN" as BranchColorGradientMode,
                          label: "⌖ الهندسة (أخضر)",
                          dotClass: "bg-emerald-600",
                        },
                        {
                          mode: "ALGEBRA_AMBER" as BranchColorGradientMode,
                          label: "ℂ الجبر والعقدية (عنبري)",
                          dotClass: "bg-amber-600",
                        },
                        {
                          mode: "PROBABILITY_PURPLE" as BranchColorGradientMode,
                          label: "ℙ الاحتمالات (بنفسجي)",
                          dotClass: "bg-purple-600",
                        },
                      ] as const
                    ).map((item) => {
                      const active = branchColorMode === item.mode;
                      return (
                        <button
                          key={item.mode}
                          type="button"
                          onClick={() => onChangeBranchColorMode?.(item.mode)}
                          className={`px-2 py-0.5 rounded-lg border text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer ${
                            active
                              ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full inline-block ${item.dotClass}`}
                          />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* درج مكتبة المنحنيات الشعاعية الجاهزة للباكالوريا (Vector SVG + TikZ) */}
        {showBacCurvesLibrary && onAddFigure && (
          <div className="p-3 rounded-xl bg-amber-50/90 border-2 border-amber-300 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
              <div className="font-black text-amber-950 flex items-center gap-2">
                <span className="bg-amber-900 text-amber-200 font-mono text-[10px] px-2 py-0.5 rounded">
                  TIKZ / SVG VECTOR
                </span>
                <span>
                  مكتبة المنحنيات المرجعية المعتمدة في الباكالوريا المغربية والبعثة (إدراج فوري بضغطة واحدة مع كود TikZ):
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBacCurvesLibrary(false)}
                className="text-amber-900 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {BAC_CERTIFIED_CURVE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white border border-amber-300 rounded-xl p-2.5 flex flex-col justify-between gap-2 shadow-2xs hover:border-indigo-500 transition"
                >
                  <div className="space-y-1.5">
                    <div className="h-24 w-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={preset.svgDataUrl}
                        alt={preset.titleFr}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="font-extrabold text-[11px] text-slate-900">
                      {isFr ? preset.titleFr : preset.titleAr}
                    </div>
                    <p className="text-[10px] text-slate-600 line-clamp-2">
                      {isFr ? preset.captionFr : preset.captionAr}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onAddFigure({
                          id: `bac_svg_${preset.id}_${Date.now()}`,
                          titleAr: preset.titleAr,
                          titleFr: preset.titleFr,
                          caption: isFr ? preset.captionFr : preset.captionAr,
                          dataUrl: preset.svgDataUrl,
                          widthPercent: 72,
                          alignment: "center",
                          exerciseId: "ex_0",
                          borderStyle: "academic",
                        });
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-white font-extrabold text-[10.5px] transition cursor-pointer text-center"
                    >
                      + إدراج في التمرين 1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onAddFigure({
                          id: `bac_svg_prob_${preset.id}_${Date.now()}`,
                          titleAr: preset.titleAr,
                          titleFr: preset.titleFr,
                          caption: isFr ? preset.captionFr : preset.captionAr,
                          dataUrl: preset.svgDataUrl,
                          widthPercent: 75,
                          alignment: "center",
                          exerciseId: "ex_probleme_synthese",
                          borderStyle: "academic",
                        });
                      }}
                      className="py-1 px-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-[10.5px] transition cursor-pointer text-center"
                      title="إدراج المنحنى في المسألة التوليفية الشاملة"
                    >
                      + للمسألة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* شريط تخصيص كراسة التلميذ والتسطير تحت الأسئلة */}
        {includeAnswerWorkspace && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-purple-950 flex items-center gap-1">
                <span>📝</span>
                <span>تسطير كراسة التلميذ (Cahier / Devoir) :</span>
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { id: "SEYES_FRENCH", label: "كراسة فرنسية (Seyès 8mm)" },
                  { id: "LINED_RULED", label: "أسطر متوازية (Ligné)" },
                  { id: "MILLIMETER_GRID", label: "ورق ميليمتري (منحنيات)" },
                  { id: "DOTTED_BOX", label: "شبكة نقطية" },
                  { id: "PLAIN_BOX", label: "إطار أبيض" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChangeStudentGridStyle?.(s.id as StudentGridStyle)}
                    className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer ${
                      studentGridStyle === s.id
                        ? "bg-purple-900 text-white shadow-2xs"
                        : "bg-white text-purple-900 border border-purple-200 hover:bg-purple-100/60"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-purple-700 font-medium">
              ارتفاع الأسطر يتكيف تلقائياً مع صعوبة السؤال (N1: 3 أسطر · N2: 6 أسطر · N3: 10 أسطر)
            </span>
          </div>
        )}
          </div>
        )}
      </div>

      {/* شريط الأدوات الذكي للتحرير النصي الغني والرموز الرياضية يظهر عند تفعيل التعديل المباشر */}
      {isInlineEditable && (
        <div className="no-print sticky top-2 z-40 shadow-sm rounded-xl overflow-hidden">
          <RichTextMathToolbar
            isArabic={!isFr}
            docFontFamily={docFontFamily}
            onChangeDocFontFamily={onChangeDocFontFamily}
            onInsertMathSymbol={(sym: string) => {
              document.execCommand("insertText", false, sym);
            }}
            onInsertImageFile={(file) => {
              handleProcessDroppedFile(file, "sheet-global");
            }}
          />
        </div>
      )}

      {/* حقن قاعدة @media print و @page الفورية لمطابقة مقاس الورقة المختار أثناء الطباعة */}
      <style>{printMediaMetrics.cssMediaPrintBlock}</style>

      {/* شريط محاكي استعلامات الطباعة الفوري (@media print & @page Simulator) عند تفعيله */}
      {(simulatePrintMediaQuery || printPageSizePreset !== "A4" || effectiveShowA4Breaks) && (
        <div
          dir="rtl"
          className="no-print bg-slate-950 text-white rounded-2xl px-3.5 py-2.5 border border-cyan-500/40 shadow-md flex flex-wrap items-center justify-between gap-2 text-[11px]"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-black text-[10.5px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>@media print Simulator</span>
            </span>
            <code
              dir="ltr"
              className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 font-mono text-[10px]"
            >
              {printMediaMetrics.cssPageRule}
            </code>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">
              المقاس: {printMediaMetrics.widthMm}×{printMediaMetrics.heightMm}mm · فاصل الصفحة:{" "}
              {printMediaMetrics.pageBreakIntervalPx}px ({printMediaMetrics.estimatedPageCount} صفحات)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "A4" as PrintPageSizePreset, label: "A4 (210×297)" },
                { id: "LETTER" as PrintPageSizePreset, label: "Letter (216×279)" },
                { id: "CUSTOM" as PrintPageSizePreset, label: `Custom (${customPageWidthMm}×${customPageHeightMm})` },
              ] as const
            ).map((presetBtn) => {
              const active = printPageSizePreset === presetBtn.id;
              return (
                <button
                  key={presetBtn.id}
                  type="button"
                  onClick={() => onChangePrintPageSizePreset?.(presetBtn.id)}
                  className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold border transition cursor-pointer ${
                    active
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  {presetBtn.label}
                </button>
              );
            })}

            {onToggleSimulatePrintMediaQuery && (
              <button
                type="button"
                onClick={onToggleSimulatePrintMediaQuery}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
                  simulatePrintMediaQuery
                    ? "bg-amber-400 text-slate-950 border-amber-300"
                    : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {simulatePrintMediaQuery ? "إيقاف محاكاة @media print" : "تفعيل محاكاة @media print"}
              </button>
            )}
          </div>
        </div>
      )}

      <div
        id="printable-document-sheet"
        dir={isFr ? "ltr" : "rtl"}
        contentEditable={isInlineEditable}
        suppressContentEditableWarning={true}
        style={{
          paddingTop: `${Math.round(activeMarginModelSpec.previewPadTopPx * autoFitCompactionScale)}px`,
          paddingBottom: `${Math.round(activeMarginModelSpec.previewPadBottomPx * autoFitCompactionScale)}px`,
          paddingLeft: `${Math.round(activeMarginModelSpec.previewPadXPx * autoFitCompactionScale)}px`,
          paddingRight: `${Math.round(activeMarginModelSpec.previewPadXPx * autoFitCompactionScale)}px`,
          ...(printPageSizePreset !== "A4" || simulatePrintMediaQuery
            ? {
                width: `${printMediaMetrics.widthMm}mm`,
                maxWidth: "100%",
                minHeight: `${printMediaMetrics.heightMm}mm`,
              }
            : {}),
          ...(autoFitCompactionScale < 1
            ? { fontSize: `${Math.round(autoFitCompactionScale * 100)}%` }
            : {}),
        }}
        data-margin-model={activeMarginModelSpec.id}
        data-page-size-preset={printPageSizePreset}
        data-page-dimensions-mm={`${printMediaMetrics.widthMm}x${printMediaMetrics.heightMm}`}
        data-interactive-quiz-url={resolvedInteractiveQuizUrl}
        data-a4-auto-fit={autoFitCompactionScale < 1 ? "compacted" : "standard"}
        data-ink-saver={laserInkSaverMode ? "true" : "false"}
        data-active-scope={effectivePrintScope || "ALL"}
        className={`print-sheet moroccan-official-sheet ${fontClass} ${scaleClass} ${orientationClass} ${
          selectedLatexPkg.sheetSkinClass
        } ${selectedPaperSurf.cssClass} ${
          laserInkSaverMode ? "laser-ink-saver" : ""
        } ${
          isOnePageFitActive ? "one-page-smart-fit" : ""
        } ${
          isPhotocopyContrastActive ? "photocopy-high-contrast" : ""
        } ${
          effectiveEconomicMode ? "mode-two-up-print" : ""
        } ${
          simulatePrintMediaQuery
            ? "ring-4 ring-cyan-500/60 shadow-2xl mx-auto"
            : ""
        } ${
          isInlineEditable ? "editable-sheet ring-2 ring-indigo-500/40" : ""
        } relative overflow-hidden text-slate-900 rounded-2xl transition-all duration-200 ${
          autoFitCompactionScale < 1
            ? a4LayoutReport.recommendedVerticalGapClass
            : activeMarginModelSpec.verticalSpaceClass
        }`}
      >
      {/* فواصل الصفحات الحية لمعاينة حدود @page (A4 / Letter / Custom) وتفادي تشطير المسائل والجداول */}
      {effectiveShowA4Breaks && (
        <div
          aria-hidden="true"
          className="no-print pointer-events-none absolute inset-0 z-30"
        >
          {printMediaMetrics.pageBreakOffsetsPx.map((topOffset, idx) => {
            const pageNum = idx + 1;
            const halfBuffer = Math.round(printMediaMetrics.marginBufferPx / 2);
            const cutMm = Math.round(pageNum * printMediaMetrics.heightMm);
            return (
              <div
                key={`page-break-${printPageSizePreset}-${pageNum}`}
                style={{
                  top: `${Math.max(0, topOffset - halfBuffer)}px`,
                  height: `${halfBuffer * 2}px`,
                }}
                className="absolute left-0 right-0 flex flex-col justify-center bg-gradient-to-b from-amber-500/10 via-cyan-500/20 to-amber-500/10 border-y border-dashed border-amber-500/50"
              >
                <div className="w-full border-b-2 border-dashed border-cyan-600 flex flex-wrap items-center justify-between px-3 py-0.5 bg-white/85 backdrop-blur-2xs shadow-2xs">
                  <span className="bg-slate-950 text-cyan-300 text-[10px] font-mono font-black px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 border border-cyan-500/40">
                    <span>✂</span>
                    <span>
                      فاصل صفحة @page ({printPageSizePreset}): نهاية ص {pageNum} / بداية ص{" "}
                      {pageNum + 1}
                    </span>
                  </span>
                  <span className="bg-cyan-950 text-amber-300 text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-700">
                    @page {printMediaMetrics.widthMm}×{printMediaMetrics.heightMm}mm · Cut @{" "}
                    {cutMm}mm (~{topOffset}px)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* مسطرة القياس العلوية والجانبية وهوامش الأمان A4 الديناميكية عند تفعيلها */}
      {showMarginGuides && (
        <div
          aria-hidden="true"
          style={{
            top: `${Math.max(4, Math.round(activeMarginModelSpec.previewPadTopPx * 0.45))}px`,
            bottom: `${Math.max(4, Math.round(activeMarginModelSpec.previewPadBottomPx * 0.45))}px`,
            left: `${Math.max(4, Math.round(activeMarginModelSpec.previewPadXPx * 0.45))}px`,
            right: `${Math.max(4, Math.round(activeMarginModelSpec.previewPadXPx * 0.45))}px`,
          }}
          className="no-print pointer-events-none absolute border-2 border-dashed border-cyan-500/75 rounded-lg z-20 flex flex-col justify-between p-1.5"
        >
          <div className="flex flex-wrap justify-between items-center gap-1 text-[9px] font-mono font-bold text-cyan-800 bg-cyan-50/90 border border-cyan-200 px-2 py-0.5 rounded shadow-2xs">
            <span>
              {isFr ? activeMarginModelSpec.labelFr : activeMarginModelSpec.labelAr} · Top:{" "}
              {activeMarginModelSpec.topMm}mm / Bottom: {activeMarginModelSpec.bottomMm}mm
            </span>
            <span>
              Safe Area: {safePrintWidthMm}mm × {safePrintHeightMm}mm ({printableAreaUtilizationPct}% A4)
            </span>
            <span>Package: {selectedLatexPkg.badge}</span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono font-bold text-cyan-800 bg-cyan-50/90 border border-cyan-200 px-2 py-0.5 rounded shadow-2xs">
            <span>Margin Left: {activeMarginModelSpec.xMm}mm</span>
            <span>
              \geometry&#123;top={(activeMarginModelSpec.topMm / 10).toFixed(1)}cm, bottom=
              {(activeMarginModelSpec.bottomMm / 10).toFixed(1)}cm, x=
              {(activeMarginModelSpec.xMm / 10).toFixed(1)}cm&#125;
            </span>
            <span>Margin Right: {activeMarginModelSpec.xMm}mm</span>
          </div>
        </div>
      )}

      {/* ترويسة حزمة fancyhdr الجارية في أعلى الورقة (\pagestyle{fancy}) */}
      {latexPackageTheme === "FANCYHDR" && (
        <div className="border-b-2 border-double border-slate-900 pb-1.5 mb-2 flex items-center justify-between text-[11px] font-mono font-bold text-slate-800">
          <span>
            {school} · {isFr ? track.labelFr : track.labelAr}
          </span>
          <span className="uppercase tracking-wider text-indigo-950">
            \pagestyle&#123;fancy&#125; · {dsKey} ({sem})
          </span>
          <span>
            {prof} · {year}
          </span>
        </div>
      )}

      {/* العلامة المائية الاختيارية لشعار الأستاذ في خلفية الورقة */}
      {includeLogoWatermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0 opacity-[0.055]"
        >
          <TeacherLogo
            variant={logoVariant}
            size={380}
            customImageUrl={customLogoUrl}
          />
        </div>
      )}
      {/* في حال اختيار طباعة أو تصدير شبكة التقويم المخصصة فقط */}
      {onlyPrintEvalGrid && renderCustomEvaluationGridSheet()}

      {/* 1. وحدة الفروض المحروسة وشبكة التقويم 142-08 (مع دعم النماذج المتعددة A / B والأوزان المخصصة) */}
      {!onlyPrintEvalGrid && activeModule === "DS_142_08" && (
        <div className="space-y-8">
          {/* أ. شبكة التخصيص أو الكفايات ومصفوفة التخصيص ثنائية الأبعاد 2D (قابلة للإظهار أو الإخفاء عند الطباعة) */}
          {effectivePrintScope !== "SUJET_ONLY" &&
            effectivePrintScope !== "SOLUTIONS_ONLY" &&
            !onlyPrintSolutions &&
            (includeGradingScaleTable || include2DSpecMatrix) && (
          <div
            data-sync-section="SPEC_TABLE"
            className={`space-y-3 avoid-break transition-all duration-300 ${
              activeSyncSection === "SPEC_TABLE"
                ? "ring-2 ring-cyan-500/80 bg-cyan-50/20 rounded-xl p-2 -mx-2"
                : ""
            }`}
          >
            {includeGradingScaleTable && (
              <>
                <h4 className="font-extrabold text-sm text-indigo-950 border-b border-slate-200 pb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    {isMission
                      ? "1. Grille d'évaluation par compétences mathématiques (Programme National Français & AEFE)"
                      : isFr
                      ? "1. Grille de spécification et d'évaluation (Note Ministérielle N° 142-08 & OP 2007)"
                      : "1. شبكة التخصيص والتقويم المعيارية (طبقاً للمذكرة الوزارية رقم 142-08 والتوجيهات التربوية 2007)"}
                  </span>
                  <span className="text-xs font-bold text-slate-600 tabular-nums">
                    {baseDsLessons.length} {isFr ? "chapitres · Pas : 0.25 pt" : "دروس · تدرج السلم: 0.25 ن"}
                  </span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-400 text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900">
                        <th className="border border-slate-400 p-2 text-start">
                          {isMission
                            ? "Thème & Chapitre du programme"
                            : isFr
                            ? "Chapitre / Unité"
                            : "الوحدة / الدرس"}
                        </th>
                        <th className="border border-slate-400 p-2 text-start">
                          {isMission
                            ? "Attendus de fin d'année & Compétences ciblées (BOEN)"
                            : isFr
                            ? "Capacités attendues (OP 2007)"
                            : "القدرات المنتظرة (التوجيهات التربوية 2007)"}
                        </th>
                        <th className="border border-slate-400 p-2 text-center w-24">
                          {isFr ? "Pondération" : "نسبة الأهمية"}
                        </th>
                        <th className="border border-slate-400 p-2 text-center w-24">
                          {isFr ? "Barème" : "سلم التنقيط"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const hasQcmTable =
                          !isMission &&
                          (dsStructureMode === "QCM_ET_EXERCICES" ||
                            dsStructureMode === "COMPLETE_EXAM_MAROC");
                        const hasProbTable =
                          dsStructureMode === "EXERCICES_ET_PROBLEME" ||
                          dsStructureMode === "COMPLETE_EXAM_MAROC" ||
                          dsStructureMode === "EXAMEN_BLANC_2BAC";
                        const qcmPtsTable = hasQcmTable
                          ? Number(((qcmConfig?.questionCount || 4) * 1.0).toFixed(2))
                          : 0;
                        const probPtsTable = hasProbTable ? 8.5 : 0;
                        const exBudgetTable = Math.max(4, 20 - qcmPtsTable - probPtsTable);
                        const exactTableWeights = computeExactExerciseEffectiveWeights(
                          baseDsLessons,
                          exBudgetTable
                        );

                        let runningPointsTotal = qcmPtsTable + probPtsTable;

                        const rows = baseDsLessons.map((item, i) => {
                          const v = getVariantQuestions(item, "A", false, 0, dsQuestionDensity);
                          const effW = exactTableWeights[i] ?? item.weight;
                          const metas = getQuestionBaremesAndLevels(
                            effW,
                            v.questionsFr.length,
                            n1,
                            n2,
                            n3,
                            item.customQuestionBaremes,
                            item.customQuestionLevels
                          );
                          const rowPtsNum = metas.reduce(
                            (s, m) => s + parseFloat(m.points || "0"),
                            0
                          );
                          runningPointsTotal += rowPtsNum;
                          const pts = rowPtsNum
                            .toFixed(2)
                            .replace(/\.00$/, ".0")
                            .replace(/(\.\d)0$/, "$1");

                          return (
                            <tr key={i} className="border-b border-slate-300">
                              <td className="border border-slate-400 p-2 font-bold">
                                {isFr
                                  ? item.lessonFr
                                  : isAr
                                  ? item.lessonAr
                                  : `${item.lessonAr} / ${item.lessonFr}`}
                              </td>
                              <td className="border border-slate-400 p-2">
                                <ul className="list-disc list-inside space-y-0.5">
                                  {(isFr ? item.capacitiesFr : item.capacitiesAr).map((c, idx) => (
                                    <li key={idx}>
                                      <MathText text={c} inline />
                                      {isBi && item.capacitiesFr[idx]
                                        ? ` — ${item.capacitiesFr[idx]}`
                                        : ""}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="border border-slate-400 p-2 text-center font-mono font-bold tabular-nums">
                                {effW}%
                              </td>
                              <td className="border border-slate-400 p-2 text-center font-mono font-extrabold text-indigo-950 tabular-nums">
                                {pts} / 20
                              </td>
                            </tr>
                          );
                        });

                        return (
                          <>
                            {hasQcmTable && (
                              <tr className="border-b border-slate-300 bg-slate-50/60">
                                <td className="border border-slate-400 p-2 font-bold">
                                  {isFr
                                    ? "QCM & Vrai/Faux avec justification"
                                    : "تمرين الاختيار من متعدد (QCM) مع التعليل"}
                                </td>
                                <td className="border border-slate-400 p-2 text-slate-700">
                                  {isFr
                                    ? "Vérification des acquis fondamentaux et justification rapide (N1)"
                                    : "التحقق من المكتسبات الأساسية وسرعة التعليل الرياضي (N1)"}
                                </td>
                                <td className="border border-slate-400 p-2 text-center font-mono font-bold tabular-nums">
                                  {Number(((qcmPtsTable / 20) * 100).toFixed(1))}%
                                </td>
                                <td className="border border-slate-400 p-2 text-center font-mono font-extrabold text-indigo-950 tabular-nums">
                                  {qcmPtsTable.toFixed(1)} / 20
                                </td>
                              </tr>
                            )}
                            {rows}
                            {hasProbTable && (
                              <tr className="border-b border-slate-300 bg-slate-50/60">
                                <td className="border border-slate-400 p-2 font-bold">
                                  {isFr
                                    ? "Problème de Synthèse (Format Bac)"
                                    : "المسألة التوليفية الشاملة (نمط البكالوريا)"}
                                </td>
                                <td className="border border-slate-400 p-2 text-slate-700">
                                  {isFr
                                    ? "Mobilisation conjointe, étude de fonction et suite associée (N2/N3)"
                                    : "توليف الموارد، دراسة دالة عددية ومتتالية مرتبطة بها (N2/N3)"}
                                </td>
                                <td className="border border-slate-400 p-2 text-center font-mono font-bold tabular-nums">
                                  42.5%
                                </td>
                                <td className="border border-slate-400 p-2 text-center font-mono font-extrabold text-indigo-950 tabular-nums">
                                  8.5 / 20
                                </td>
                              </tr>
                            )}
                            <tr className="bg-slate-50 font-extrabold">
                              <td colSpan={2} className="border border-slate-400 p-2 text-end">
                                {isFr ? "Total de l'évaluation" : "مجموع الفرض المحروس"}
                              </td>
                              <td className="border border-slate-400 p-2 text-center font-mono tabular-nums">
                                {Math.round((runningPointsTotal / 20) * 100)}%
                              </td>
                              <td className="border border-slate-400 p-2 text-center font-mono tabular-nums text-indigo-950">
                                {runningPointsTotal
                                  .toFixed(2)
                                  .replace(/\.00$/, ".0")
                                  .replace(/(\.\d)0$/, "$1")}{" "}
                                / 20
                              </td>
                            </tr>
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* بطاقة الأطر المرجعية الوطنية الموحدة للامتحان التجريبي للبكالوريا (Examen Blanc 2BAC) */}
                {dsStructureMode === "EXAMEN_BLANC_2BAC" && (() => {
                  const bacSpec = getExamenBlanc2BacConfig(track.code);
                  return (
                    <div className="border-2 border-amber-600/80 rounded-xl p-3 bg-amber-50/60 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300/80 pb-1.5">
                        <span className="font-black text-amber-950">
                          🎓 {isFr ? bacSpec.cadreReferenceTitleFr : bacSpec.cadreReferenceTitleAr}
                        </span>
                        <span className="font-mono font-extrabold bg-amber-900 text-amber-100 px-2 py-0.5 rounded text-[10.5px]">
                          {isFr
                            ? `Durée officielle : ${bacSpec.officialDurationFr} · Coeff : ${bacSpec.coefficient}`
                            : `المدة الرسمية: ${bacSpec.officialDurationAr} · المعامل: ${bacSpec.coefficient}`}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {bacSpec.domains.map((dom, dIdx) => (
                          <div
                            key={dIdx}
                            className="bg-white/95 border border-amber-200 rounded-lg p-2 space-y-0.5"
                          >
                            <div className="flex items-center justify-between gap-1 font-extrabold text-slate-900 text-[11px]">
                              <span>{isFr ? dom.domainFr : dom.domainAr}</span>
                              <span className="font-mono text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded shrink-0">
                                {dom.targetPoints} / 20 ({dom.percentage}%)
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-600">{dom.detailsAr}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* تفصيل المستويات المهارية أو الكفايات */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="border border-slate-300 rounded-lg p-2 bg-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700">
                      {isFr ? "Niveau N1 (Application directe)" : "المستوى 1 (تطبيق مباشر - N1)"}
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 tabular-nums">
                      {n1}% ({((n1 * 20) / 100).toFixed(1)} pts)
                    </span>
                  </div>
                  <div className="border border-slate-300 rounded-lg p-2 bg-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700">
                      {isFr
                        ? "Niveau N2 (Mobilisation & Raisonnement)"
                        : "المستوى 2 (تعبئة وتوليف - N2)"}
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 tabular-nums">
                      {n2}% ({((n2 * 20) / 100).toFixed(1)} pts)
                    </span>
                  </div>
                  <div className="border border-slate-300 rounded-lg p-2 bg-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700">
                      {isFr
                        ? "Niveau N3 (Approfondissement & Synthèse)"
                        : "المستوى 3 (تعمق ومبادرة - N3)"}
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 tabular-nums">
                      {n3}% ({((n3 * 20) / 100).toFixed(1)} pts)
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* مكون مصفوفة التخصيص ثنائية البعد (Tableau de Spécification 2D - Bloom × Chapitres) */}
            {include2DSpecMatrix && (
              <SpecMatrix2DInspectorCard
                lessons={baseDsLessons}
                n1={n1}
                n2={n2}
                n3={n3}
                dsStructureMode={dsStructureMode}
                isMission={isMission}
                isFr={isFr}
                dsQuestionDensity={dsQuestionDensity}
                qcmQuestionCount={qcmConfig?.questionCount || 4}
                examDurationMinutes={
                  track.durationFr.includes("4")
                    ? 240
                    : track.durationFr.includes("3")
                    ? 180
                    : track.durationFr.includes("1")
                    ? 60
                    : 120
                }
                variant="print"
              />
            )}
          </div>
          )}

          {/* ب. أوراق الفرض المحروس لكل نموذج مختار (A / B / A+B أو النماذج الأربعة A / B / C / D) */}
          {effectivePrintScope !== "SPEC_GRID_ONLY" &&
            effectivePrintScope !== "SOLUTIONS_ONLY" &&
            !onlyPrintSolutions &&
            (enableFourModelsABCD
              ? (["A", "B", "C", "D"] as const)
              : modelsToRender
            ).map((modelCode, modelIdx) => {
              const orderedLessons =
                shuffleExercises && (modelCode === "B" || modelCode === "D")
                  ? [...baseDsLessons].reverse()
                  : baseDsLessons;

              const hasQCM =
                dsStructureMode === "QCM_ET_EXERCICES" ||
                dsStructureMode === "COMPLETE_EXAM_MAROC";
              const hasSynthesisProblem =
                dsStructureMode === "EXERCICES_ET_PROBLEME" ||
                dsStructureMode === "COMPLETE_EXAM_MAROC" ||
                dsStructureMode === "EXAMEN_BLANC_2BAC";
              const qcmBlock = hasQCM
                ? generateMoroccanQCMExercise(orderedLessons, modelCode, track.cycle, {
                    ...qcmConfig,
                    isMission,
                  })
                : null;
              const synthesisProblem = hasSynthesisProblem
                ? generateMoroccanSynthesisProblem(orderedLessons, modelCode, track.cycle, isMission)
                : null;
              const exerciseNumOffset = hasQCM ? 1 : 0;

              return (
                <div
                  key={modelCode}
                  data-sync-section="HEADER"
                  className={`space-y-4 pt-4 border-t border-slate-300 ${
                    modelIdx > 0 ||
                    (effectivePrintScope !== "SUJET_ONLY" &&
                      (includeGradingScaleTable || include2DSpecMatrix))
                      ? "page-break"
                      : ""
                  } ${
                    activeSyncSection === "HEADER"
                      ? "ring-2 ring-indigo-500/50 rounded-xl p-2 -mx-2 transition-all"
                      : ""
                  }`}
                >
                  {renderDocumentHeader(modelCode)}

                  {/* الشريط الفردي المصغر لتنقيط الأسئلة على ورقة التلميذ (Mini-Barème Individuel par Question) */}
                  {includeIndividualGradingStrip && liveExamGridSummary.allQuestions.length > 0 && (
                    <div className="avoid-break border-2 border-indigo-950/80 rounded-xl p-2.5 bg-white shadow-2xs space-y-1.5 text-[10.5px]">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1">
                        <span className="font-black text-indigo-950 flex items-center gap-1.5">
                          <span className="bg-indigo-950 text-white font-mono text-[9.5px] px-1.5 py-0.5 rounded">
                            BARÈME INDIVIDUEL
                          </span>
                          <span>
                            {isFr
                              ? "Grille de notation individuelle par question (réservée au professeur correcteur) :"
                              : "شبكة التنقيط الفردية المصغرة حسب الأسئلة (خاصة بالأستاذ المصحح لتفادي أخطاء الجمع):"}
                          </span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-600 font-bold tabular-nums">
                          {liveExamGridSummary.allQuestions.length}{" "}
                          {isFr ? "questions évaluées · Total /20" : "سؤالاً مقيّماً · المجموع /20"}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-400 text-center font-mono text-[10px]">
                          <thead>
                            <tr className="bg-slate-100 text-slate-900">
                              <th className="border border-slate-400 px-1.5 py-0.5 text-start font-sans font-extrabold bg-indigo-50/70 w-20">
                                {isFr ? "Question" : "السؤال"}
                              </th>
                              {liveExamGridSummary.allQuestions.slice(0, 14).map((q, qIdx) => (
                                <th key={qIdx} className="border border-slate-400 px-1 py-0.5 font-extrabold">
                                  <div>{isFr ? q.questionLabelFr : q.questionLabelAr}</div>
                                  <div className="text-[9px] text-indigo-800 font-normal">
                                    /{q.points}
                                  </div>
                                </th>
                              ))}
                              <th className="border border-slate-400 px-1.5 py-0.5 bg-amber-50 font-black text-indigo-950">
                                <div>{isFr ? "TOTAL" : "المجموع"}</div>
                                <div className="text-[9px]">/20</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="h-6 bg-white">
                              <td className="border border-slate-400 px-1.5 py-1 text-start font-sans font-bold text-slate-700 bg-slate-50">
                                {isFr ? "Note obtenue" : "النقطة المحصلة"}
                              </td>
                              {liveExamGridSummary.allQuestions.slice(0, 14).map((_, qIdx) => (
                                <td key={qIdx} className="border border-slate-400 px-1 py-1" />
                              ))}
                              <td className="border border-slate-400 px-1.5 py-1 bg-amber-50/30 font-bold" />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* إطار التوجيهات والإرشادات الرسمية للمترشح وفق المذكرة الوزارية 142-08 والأطر المرجعية المغربية */}
                  {!isMission && includeMoroccanExamDirectives && (
                    <div className="avoid-break bg-slate-50/90 border border-slate-300 rounded-xl px-4 py-2.5 text-[11px] text-slate-800 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-extrabold text-indigo-950 border-b border-slate-200 pb-1">
                        <span>
                          {isFr
                            ? "📋 Consignes et directives officielles aux candidats (Note Ministérielle N° 142-08 & Cadre de Référence) :"
                            : "📋 توجيهات وإرشادات تربوية رسمية للمترشح(ة) (طبقاً للمذكرة الوزارية 142-08 والإطار المرجعي):"}
                        </span>
                        <span className="font-mono text-[10.5px] bg-indigo-100/80 text-indigo-950 px-2 py-0.5 rounded">
                          {calculatorAllowed
                            ? isFr
                              ? "✓ Calculatrice scientifique non programmable autorisée"
                              : "✓ الآلة الحاسبة العلمية غير القابلة للبرمجة مسموحة"
                            : isFr
                            ? "✗ Calculatrice non autorisée"
                            : "✗ لا يُسمح باستعمال الآلة الحاسبة"}
                        </span>
                      </div>
                      <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0.5 text-[10.5px] text-slate-700 font-medium">
                        <li>
                          {isFr
                            ? "Le candidat peut traiter les exercices dans l'ordre qui lui convient en numérotant soigneusement chaque question."
                            : "يُمكن للمترشح(ة) إنجاز تمارين الفرض حسب الترتيب الذي يناسبه شريطة ترقيم كل تمرين وسؤال بدقة."}
                        </li>
                        <li>
                          {isFr
                            ? "Toute réponse doit être rigoureusement justifiée ; les étapes du raisonnement sont prises en compte dans le barème."
                            : "يُراعى في التقويم وتوزيع النقط وضوح الاستدلال الرياضي، تعليل النتائج، وسلامة التحرير والإنشاء الهندسي."}
                        </li>
                        <li>
                          {isFr
                            ? "La présentation de la copie, la clarté de la rédaction et la rigueur des notations sont valorisées (0,50 pt)."
                            : "يُخصص جزء من التنقيط (0.50 ن) لسلامة التحرير الرياضي، وضوح الخط، وتنظيم ورقة التحرير."}
                        </li>
                        <li>
                          {isFr
                            ? "L'échange de matériel (calculatrice, règle, gomme...) entre les candidats est strictement interdit."
                            : "يُمنع تبادل اللوازم الهندسية أو الآلة الحاسبة بين المترشحين طيلة حصة الإنجاز."}
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* المقترح البيداغوجي 1: تذكرة الصيغ والمعطيات المرجعية المسموحة (Formulaire Mathématique & Aide-Mémoire Autorisé) */}
                  {includeExamFormulaSheet && baseDsLessons.length > 0 && (
                    <div className="avoid-break border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
                        <div className="flex items-center gap-2 font-black text-slate-950">
                          <span className="bg-slate-900 text-cyan-300 font-mono text-[10.5px] px-2 py-0.5 rounded">
                            {isFr ? "FORMULAIRE" : "تذكرة الصيغ المرجعية"}
                          </span>
                          <span>
                            {isFr
                              ? "Formulaire mathématique et rappels de référence autorisés pour l'épreuve :"
                              : "تذكرة الصيغ والعلاقات المرجعية المسموح بتوظيفها في الفرض:"}
                          </span>
                        </div>
                        <span className="text-[10.5px] font-mono font-bold text-slate-600">
                          {isFr ? "Données non exhaustives" : "معطيات مرجعية مساعدة"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {baseDsLessons.map((lesson, lIdx) => {
                          const memo = getMoroccanLessonMemo(lesson);
                          const formulas = (
                            isFr ? memo.essentialFormulasFr : memo.essentialFormulasAr
                          ).slice(0, 2);
                          return (
                            <div
                              key={lIdx}
                              className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1"
                            >
                              <div className="font-extrabold text-[11px] text-slate-900 border-b border-slate-100 pb-0.5">
                                {lIdx + 1}. {isFr ? lesson.lessonFr : lesson.lessonAr}
                              </div>
                              <div className="space-y-0.5 font-mono text-[10.5px] text-slate-700">
                                {formulas.map((f, fIdx) => (
                                  <div key={fIdx} className="flex items-start gap-1.5">
                                    <span className="text-cyan-700 font-bold">·</span>
                                    <span className="overflow-x-auto select-text"><MathText text={f} inline /></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* شارة النماذج الأربعة المتوازية (Modèles A / B / C / D) وورقة الإجابة والتصحيح البصري السريع (OMR Bubble Grid) */}
                  {(enableFourModelsABCD || includeOMRBubbleSheet) && (
                    <div className="avoid-break border-2 border-slate-900 rounded-xl p-3.5 bg-white space-y-2.5 text-xs relative">
                      {/* علامات الضبط البصري OMR Fiducial Marks في الأركان الأربعة */}
                      {includeOMRBubbleSheet && (
                        <>
                          <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-slate-950 inline-block" />
                          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-slate-950 inline-block" />
                          <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 bg-slate-950 inline-block" />
                          <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 bg-slate-950 inline-block" />
                        </>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-2 px-2">
                        <div className="font-black text-slate-950 flex items-center gap-2">
                          <span className="bg-slate-950 text-white font-mono text-[10.5px] px-2 py-0.5 rounded">
                            OMR / QCM
                          </span>
                          <span>
                            {isFr
                              ? "Grille de Réponse Optique & Identification du Modèle d'Épreuve :"
                              : "ورقة الإجابة والتصحيح البصري السريع (OMR) وتحديد نموذج الفرض:"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px]" dir="ltr">
                          <span className="font-bold text-slate-700">Modèle :</span>
                          {(["A", "B", "C", "D"] as ExtendedExamModelCode[]).map((m) => (
                            <span
                              key={m}
                              className={`px-2 py-0.5 rounded border font-black ${
                                m === modelCode
                                  ? "bg-slate-950 text-white border-slate-950"
                                  : "bg-slate-50 text-slate-600 border-slate-400"
                              }`}
                            >
                              [{m === modelCode ? "●" : "○"} {m}]
                            </span>
                          ))}
                        </div>
                      </div>

                      {includeOMRBubbleSheet && (() => {
                        const omrGrid = generateOMRGridData(baseDsLessons, omrQuestionCount);
                        return (
                          <div className="px-2 space-y-2">
                            <div className="text-[10.5px] text-slate-600 font-semibold flex flex-wrap justify-between gap-2">
                              <span>
                                {isFr
                                  ? "Consigne OMR : Noircir complètement un seul cercle par question au stylo noir ou bleu foncé."
                                  : "تعليمة التصحيح الآلي: ظلل دائرة واحدة فقط لكل سؤال بقلم جاف أسود أو أزرق داكن دون تشطيب."}
                              </span>
                              <span className="font-mono font-bold text-slate-800">
                                Code Massar / CNE : [ _ ][ _ ][ _ ][ _ ][ _ ][ _ ][ _ ][ _ ][ _ ][ _ ]
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1" dir="ltr">
                              {omrGrid.map((qItem) => {
                                const correctChoice = qItem.correctByModel[modelCode as ExtendedExamModelCode] || "A";
                                return (
                                  <div
                                    key={qItem.questionNum}
                                    className="border border-slate-300 rounded-lg px-2 py-1.5 flex items-center justify-between bg-slate-50/50"
                                  >
                                    <span className="font-mono font-black text-[11px] text-slate-900 mr-1.5">
                                      Q{qItem.questionNum}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {(["A", "B", "C", "D"] as const).map((opt) => {
                                        const isCorrectMarked =
                                          (showAnswerKey || includeDetailedSolutions) &&
                                          correctChoice === opt;
                                        return (
                                          <span
                                            key={opt}
                                            className={`w-4 h-4 rounded-full border flex items-center justify-center font-mono text-[9.5px] font-bold ${
                                              isCorrectMarked
                                                ? "bg-emerald-700 text-white border-emerald-900"
                                                : "bg-white text-slate-700 border-slate-500"
                                            }`}
                                          >
                                            {opt}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* التمرين التمهيدي: QCM وصواب/خطأ مع التعليل (وفق المنهاج المغربي) */}
                    {qcmBlock && (
                      <div
                        style={
                          activeHeaderBranchTheme
                            ? { borderColor: activeHeaderBranchTheme.borderHex }
                            : undefined
                        }
                        className={`avoid-break border border-indigo-300 rounded-xl p-4 space-y-3 bg-white shadow-2xs ${
                          activeHeaderBranchTheme ? "branch-themed-card" : ""
                        }`}
                      >
                        <div
                          style={
                            activeHeaderBranchTheme
                              ? latexPackageTheme === "TCOLORBOX"
                                ? {
                                    backgroundImage:
                                      activeHeaderBranchTheme.vividBannerGradientCss,
                                    borderColor: activeHeaderBranchTheme.borderHex,
                                  }
                                : {
                                    backgroundImage:
                                      activeHeaderBranchTheme.headerGradientCss,
                                    borderColor: activeHeaderBranchTheme.borderHex,
                                  }
                              : undefined
                          }
                          className={`font-extrabold text-sm flex flex-wrap justify-between items-center gap-2 print-exact-color ${
                            activeHeaderBranchTheme
                              ? latexPackageTheme === "TCOLORBOX"
                                ? "text-white rounded-lg px-3 py-2 border shadow-2xs"
                                : "text-slate-900 rounded-lg px-3 py-1.5 border"
                              : "text-indigo-950 border-b border-indigo-100 pb-1.5"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span>{isFr ? qcmBlock.titleFr : qcmBlock.titleAr}</span>
                            {activeHeaderBranchTheme && (
                              <span
                                style={
                                  latexPackageTheme === "TCOLORBOX"
                                    ? undefined
                                    : {
                                        backgroundColor:
                                          activeHeaderBranchTheme.softBgHex,
                                        color: activeHeaderBranchTheme.accentColorHex,
                                        borderColor: activeHeaderBranchTheme.borderHex,
                                      }
                                }
                                className={
                                  latexPackageTheme === "TCOLORBOX"
                                    ? "text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/15 text-amber-200 border border-white/25"
                                    : "text-[10px] font-extrabold px-2 py-0.5 rounded border"
                                }
                              >
                                {activeHeaderBranchTheme.iconSymbol}{" "}
                                {isFr
                                  ? activeHeaderBranchTheme.shortLabelFr
                                  : activeHeaderBranchTheme.shortLabelAr}
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-mono font-bold px-2.5 py-0.5 rounded border tabular-nums text-xs ${
                              activeHeaderBranchTheme &&
                              latexPackageTheme === "TCOLORBOX"
                                ? "bg-white/15 text-amber-300 border-white/25"
                                : "text-indigo-950 bg-indigo-50 border-indigo-200"
                            }`}
                          >
                            {qcmBlock.totalPoints} {isFr ? "points" : "نقط"} · QCM / Vrai-Faux
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                          {isFr ? qcmBlock.instructionFr : qcmBlock.instructionAr}
                        </p>

                        <div className="space-y-2.5">
                          {qcmBlock.items.map((item) => (
                            <div
                              key={item.num}
                              className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/90 space-y-1.5 text-xs"
                            >
                              <div className="flex justify-between items-start gap-2 font-bold text-slate-900">
                                <span>
                                  {item.num}. <MathText text={isFr ? item.statementFr : item.statementAr} inline />
                                </span>
                                {showQuestionBareme && (
                                  <span className="font-mono text-[10.5px] font-bold text-indigo-900 shrink-0 tabular-nums">
                                    [{item.points} {isFr ? "pt" : "ن"} · N1]
                                  </span>
                                )}
                              </div>
                              {isBi && (
                                <div dir="ltr" className="text-left text-slate-600 italic text-[11px]">
                                  {item.num}. <MathText text={item.statementFr} inline />
                                </div>
                              )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono text-[11.5px] font-semibold text-slate-800">
                                  {(isFr ? item.optionsFr : item.optionsAr).map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className="bg-white border border-slate-300 rounded px-2.5 py-1 flex items-center gap-1.5"
                                    >
                                      <span className="w-3 h-3 rounded-xs border border-slate-400 inline-block shrink-0" />
                                      <span className="overflow-x-auto"><MathText text={opt} inline /></span>
                                    </div>
                                  ))}
                                </div>
                                {includeAnswerWorkspace &&
                                  (!qcmConfig?.scoringMode ||
                                    qcmConfig.scoringMode === "JUSTIFICATION_REQUIRED") &&
                                  renderStudentAnswerWorkspace(
                                    "N1",
                                    isFr
                                      ? "Justification mathématique du choix QCM :"
                                      : "تعليل الجواب الصحيح والخطوات الحسابية :",
                                    true,
                                    {
                                      questionText: isFr ? item.statementFr : item.statementAr,
                                      solutionText: isFr
                                        ? item.justificationFr
                                        : item.justificationAr,
                                      points: item.points,
                                      workspaceId: `ds_${modelCode}_qcm_${item.num}`,
                                    }
                                  )}
                              </div>
                            ))}
                          </div>

                        {includeDetailedSolutions &&
                          solutionDisplayMode === "INLINE_PER_EXERCISE" && (
                            <div
                              className={`mt-3 bg-emerald-50/50 border border-emerald-300 rounded-xl p-3.5 space-y-2 ${solutionHandwritingClass}`}
                            >
                              <div className="font-black text-xs text-emerald-950 flex items-center justify-between border-b border-emerald-200 pb-1">
                                <span>
                                  {isFr
                                    ? "Correction détaillée du QCM (avec justification) :"
                                    : "عناصر الإجابة والتعليل لتمرين QCM :"}
                                </span>
                                <span className="font-mono text-[11px] text-emerald-800">
                                  [{qcmBlock.totalPoints} {isFr ? "pts" : "ن"}]
                                </span>
                              </div>
                              <div className="space-y-1.5 text-xs text-slate-800">
                                {qcmBlock.items.map((item) => (
                                  <div key={item.num} className="bg-white p-2 rounded border border-emerald-100">
                                    <span className="font-extrabold text-emerald-900">
                                      {item.num}) <MathText text={isFr ? item.correctAnswerFr : item.correctAnswerAr} inline /> :{" "}
                                    </span>
                                    <span><MathText text={isFr ? item.justificationFr : item.justificationAr} /></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {/* ج. تمارين الخوارزميات والبرمجة بلغة بايثون المرفقة (Python Algorithm Exercises) */}
                    {attachedPythonAlgorithms && attachedPythonAlgorithms.length > 0 && (
                      <div className="space-y-4">
                        {attachedPythonAlgorithms.map((pyAlgo, pyIdx) => {
                          const pyExNum = hasQCM ? 2 + pyIdx : 1 + pyIdx;
                          return (
                            <div
                              key={pyAlgo.id}
                              className="avoid-break border-2 border-emerald-700/80 rounded-2xl p-4 bg-white shadow-xs space-y-3 relative"
                            >
                              {/* شريط عنوان تمرين بايثون مع تدرج لوني */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center font-mono text-sm shadow-xs shrink-0">
                                    <Code2 className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-black text-sm text-emerald-950">
                                        {isFr
                                          ? `Exercice ${pyExNum} : Algorithme Python & ${pyAlgo.categoryFr}`
                                          : `تمرين ${pyExNum} : الخوارزميات والبرمجة بلغة بايثون (${pyAlgo.categoryAr})`}
                                      </h4>
                                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                                        Python 3.10+ · {pyAlgo.levelBadgeAr.split(" / ")[0]}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium">
                                      {isFr ? pyAlgo.titleFr : pyAlgo.titleAr}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {showQuestionBareme && (
                                    <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                      [3.0 {isFr ? "pts" : "ن"} · N2]
                                    </span>
                                  )}
                                  {onRemovePythonAlgorithm && (
                                    <button
                                      type="button"
                                      onClick={() => onRemovePythonAlgorithm(pyAlgo.id)}
                                      className="no-print p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                      title="حذف هذا التمرين البرمجي من الورقة"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* الهدف والتمهيد الرياضي */}
                              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                <strong className="text-emerald-900 font-bold">
                                  {isFr ? "Contexte & Objectif :" : "السياق والهدف الرياضي :"}
                                </strong>{" "}
                                {isFr ? pyAlgo.objectiveFr : pyAlgo.objectiveAr}
                              </div>

                              {/* كود بايثون المنسق والمرقم برمجياً */}
                              <div className="rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 text-slate-100 font-mono text-xs" dir="ltr">
                                <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                    <span className="font-bold text-slate-300 ml-1">
                                      {pyAlgo.id}.py
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-emerald-400 font-mono">
                                    Langage Python (circulaire TICE)
                                  </span>
                                </div>

                                <div className="p-3.5 overflow-x-auto studio-scroll leading-relaxed text-emerald-300">
                                  <pre className="font-mono text-xs">{pyAlgo.pythonCode}</pre>
                                </div>
                              </div>

                              {/* شبكة أسئلة التقويم الموجهة للتلميذ */}
                              <div className="space-y-1.5 pt-1">
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                  <span className="text-emerald-700 font-black">✍️</span>
                                  <span>
                                    {isFr
                                      ? "Questions d'évaluation et d'analyse algorithmique :"
                                      : "أسئلة التقويم والتحليل الخوارزمي الموجهة للتلميذ(ة):"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-800">
                                  {(isFr
                                    ? pyAlgo.pedagogicalQuestionsFr
                                    : pyAlgo.pedagogicalQuestionsAr
                                  ).map((q, qIdx) => (
                                    <div
                                      key={qIdx}
                                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/90 leading-relaxed space-y-1.5"
                                    >
                                      <div><MathText text={q} /></div>
                                      {includeAnswerWorkspace &&
                                        renderStudentAnswerWorkspace("N2", undefined, true, {
                                          questionText: q,
                                          solutionText: isFr
                                            ? pyAlgo.expectedOutputFr
                                            : pyAlgo.expectedOutputAr,
                                          points: 1.0,
                                          workspaceId: `ds_${modelCode}_py_${pyAlgo.id}_${qIdx}`,
                                        })}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* عناصر إجابة تمرين بايثون عند تفعيل الحلول */}
                              {includeDetailedSolutions && (
                                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-300 text-xs text-emerald-950 space-y-1">
                                  <div className="font-bold border-b border-emerald-200 pb-1">
                                    {isFr
                                      ? "Corrigé & Trace d'exécution attendue :"
                                      : "عناصر الإجابة والأثر العددي المتوقع :"}
                                  </div>
                                  <p><MathText text={isFr ? pyAlgo.expectedOutputFr : pyAlgo.expectedOutputAr} /></p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {orderedLessons.map((lesson, idx) => {
                      const pythonOffset = attachedPythonAlgorithms?.length || 0;
                      const displayExNum = idx + 1 + exerciseNumOffset + pythonOffset;
                      const fixedQcmPts =
                        hasQCM && qcmBlock ? parseFloat(qcmBlock.totalPoints) || 4.0 : 0;
                      const fixedProbPts = hasSynthesisProblem ? 8.5 : 0;
                      const exBudget = Math.max(4, 20 - fixedQcmPts - fixedProbPts);
                      const exactWeightsForModel = computeExactExerciseEffectiveWeights(
                        orderedLessons,
                        exBudget
                      );
                      const effectiveWeight = exactWeightsForModel[idx] ?? lesson.weight;
                      const lessonBranchTheme = enableBranchColorGradient
                        ? branchColorMode === "AUTO_BY_LESSON"
                          ? detectLessonBranchTheme(lesson)
                          : resolveBranchColorTheme(branchColorMode, [lesson])
                        : null;
                      const { questionsAr, questionsFr } = getVariantQuestions(
                        lesson,
                        modelCode,
                        shuffleQuestions,
                        0,
                        dsQuestionDensity
                      );
                      const qMetas = getQuestionBaremesAndLevels(
                        effectiveWeight,
                        questionsFr.length,
                        n1,
                        n2,
                        n3,
                        lesson.customQuestionBaremes,
                        lesson.customQuestionLevels
                      );
                      const exPointsNum = qMetas.reduce(
                        (s, m) => s + parseFloat(m.points || "0"),
                        0
                      );
                      const exPoints = exPointsNum
                        .toFixed(2)
                        .replace(/\.00$/, ".0")
                        .replace(/(\.\d)0$/, "$1");
                      const lessonForCorr: LessonItem = {
                        ...lesson,
                        weight: effectiveWeight,
                        customQuestionBaremes: qMetas.map((m) =>
                          parseFloat(m.points || "0")
                        ),
                      };
                      const corr = generateExerciseCorrection(
                        lessonForCorr,
                        idx,
                        modelCode,
                        questionsAr,
                        questionsFr
                      );
                      const ggbResource = getAutoGeoGebraResourceForLesson(
                        lesson,
                        geoGebraResourcesMap,
                        autoAttachGeoGebra
                      );

                      if (isBi && bilingualLayout === "SIDE_BY_SIDE") {
                        return (
                          <div
                            key={idx}
                            style={
                              lessonBranchTheme
                                ? { borderColor: lessonBranchTheme.borderHex }
                                : undefined
                            }
                            className={`avoid-break border border-slate-300 rounded-xl p-4 space-y-3 bg-white ${
                              lessonBranchTheme ? "branch-themed-card" : ""
                            }`}
                          >
                            {lessonBranchTheme && (
                              <div
                                style={{
                                  backgroundImage:
                                    lessonBranchTheme.vividBannerGradientCss,
                                }}
                                className="rounded-lg px-3 py-1.5 text-white flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold shadow-2xs print-exact-color"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span className="font-serif text-amber-200 text-sm">
                                    {lessonBranchTheme.iconSymbol}
                                  </span>
                                  <span>{lessonBranchTheme.branchBadgeAr}</span>
                                </span>
                                <span className="font-mono text-[11px] bg-white/15 px-2 py-0.5 rounded border border-white/25 text-amber-200">
                                  {lessonBranchTheme.branchBadgeFr}
                                </span>
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div
                                dir="ltr"
                                className="text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4"
                              >
                                <div
                                  style={
                                    lessonBranchTheme
                                      ? {
                                          backgroundImage:
                                            lessonBranchTheme.headerGradientCss,
                                          borderColor: lessonBranchTheme.borderHex,
                                        }
                                      : undefined
                                  }
                                  className={`font-extrabold text-sm text-slate-900 flex justify-between items-center pb-1 print-exact-color ${
                                    lessonBranchTheme
                                      ? "rounded-lg px-2.5 py-1.5 border"
                                      : "border-b border-slate-100"
                                  }`}
                                >
                                  <span
                                    style={
                                      lessonBranchTheme
                                        ? { color: lessonBranchTheme.accentColorHex }
                                        : undefined
                                    }
                                    className="inline-flex items-center gap-1.5"
                                  >
                                    <LessonHeaderIconBadge lesson={lesson} isFr={true} />
                                    <span>Exercice {displayExNum} : {lesson.lessonFr}</span>
                                  </span>
                                  <span className="font-mono tabular-nums text-xs text-indigo-950">
                                    ({exPoints} pts · {effectiveWeight}%)
                                  </span>
                                </div>
                                <ol className="list-decimal list-inside text-xs space-y-2 text-slate-800 leading-relaxed">
                                  {questionsFr.map((q, qIdx) => {
                                    const meta = qMetas[qIdx];
                                    return (
                                      <li key={qIdx} className="space-y-1">
                                        <span><MathText text={q} /></span>
                                        {showQuestionBareme && meta && (
                                          <span className="inline-block ml-2 font-mono text-[10.5px] font-bold text-indigo-900 tabular-nums">
                                            [{meta.points} pt · {meta.level}]
                                          </span>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ol>
                              </div>

                              <div dir="rtl" className="text-right space-y-2">
                                <div
                                  style={
                                    lessonBranchTheme
                                      ? {
                                          backgroundImage:
                                            lessonBranchTheme.headerGradientCss,
                                          borderColor: lessonBranchTheme.borderHex,
                                        }
                                      : undefined
                                  }
                                  className={`font-extrabold text-sm text-slate-900 flex justify-between items-center pb-1 print-exact-color ${
                                    lessonBranchTheme
                                      ? "rounded-lg px-2.5 py-1.5 border"
                                      : "border-b border-slate-100"
                                  }`}
                                >
                                  <span
                                    style={
                                      lessonBranchTheme
                                        ? { color: lessonBranchTheme.accentColorHex }
                                        : undefined
                                    }
                                    className="inline-flex items-center gap-1.5"
                                  >
                                    <LessonHeaderIconBadge lesson={lesson} isFr={false} />
                                    <span>التمرين {displayExNum} : {lesson.lessonAr}</span>
                                  </span>
                                  <span className="font-mono tabular-nums text-xs text-indigo-950">
                                    ({exPoints} ن · {effectiveWeight}%)
                                  </span>
                                </div>
                                <ol className="list-decimal list-inside text-xs space-y-2 text-slate-800 leading-relaxed">
                                  {questionsAr.map((q, qIdx) => {
                                    const meta = qMetas[qIdx];
                                    return (
                                      <li key={qIdx} className="space-y-1">
                                        <span><MathText text={q} /></span>
                                        {showQuestionBareme && meta && (
                                          <span className="inline-block mr-2 font-mono text-[10.5px] font-bold text-indigo-900 tabular-nums">
                                            [{meta.points} ن · {meta.level}]
                                          </span>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ol>
                              </div>
                            </div>

                            {ggbResource && (
                              <GeoGebraFigureCard
                                resource={ggbResource}
                                lesson={lesson}
                                exerciseNumber={idx + 1}
                                isFr={isFr}
                                isBi={isBi}
                                onResourceUpdated={(updated) =>
                                  onUpdateGeoGebraResource?.(
                                    lesson.lessonFr || `${lesson.weight}-${idx}`,
                                    updated
                                  )
                                }
                              />
                            )}

                            {/* الأشكال الهندسية والرسوم التوضيحية المندرجة في التمرين */}
                            {insertedFigures
                              .filter((f) => f.exerciseId === `ex_${idx}` || f.exerciseId === lesson.lessonFr)
                              .map((fig) => (
                                <InsertedFigureCard
                                  key={fig.id}
                                  figure={fig}
                                  isInlineEditable={isInlineEditable}
                                  isFr={isFr}
                                  onUpdateFigure={onUpdateFigure}
                                  onDeleteFigure={onDeleteFigure}
                                />
                              ))}

                            {renderExerciseFigureDropZone(`ex_${idx}`)}

                            {includeAnswerWorkspace &&
                              questionsAr.map((qAr, qIdx) => {
                                const meta = qMetas[qIdx];
                                const sol = corr.solutions[qIdx];
                                return (
                                  <div key={qIdx}>
                                    {renderStudentAnswerWorkspace(
                                      meta?.level || "N2",
                                      isFr
                                        ? `Réponse complète — Question ${qIdx + 1} :`
                                        : `حيز الإجابة الكاملة — السؤال ${qIdx + 1} :`,
                                      true,
                                      {
                                        questionText: `${qAr} ${questionsFr[qIdx] || ""}`,
                                        solutionText: sol?.solutionTextAr,
                                        points: meta?.points,
                                        workspaceId: `ds_bi_${modelCode}_ex_${idx}_q_${qIdx}`,
                                      }
                                    )}
                                  </div>
                                );
                              })}

                            {includeDetailedSolutions &&
                              solutionDisplayMode === "INLINE_PER_EXERCISE" &&
                              renderDetailedCorrectionCard(corr, true)}
                          </div>
                        );
                      }

                      const activeQuestions = isFr ? questionsFr : questionsAr;

                      return (
                        <div
                          key={idx}
                          data-sync-section="EXERCISES"
                          style={
                            lessonBranchTheme
                              ? { borderColor: lessonBranchTheme.borderHex }
                              : undefined
                          }
                          className={`avoid-break p-4 space-y-3 ${effectiveExerciseBoxClass} ${
                            lessonBranchTheme ? "branch-themed-card" : ""
                          } ${
                            activeSyncSection === "EXERCISES" && idx === 0
                              ? "ring-2 ring-cyan-500/70 transition-all"
                              : ""
                          }`}
                        >
                          <div
                            style={
                              lessonBranchTheme
                                ? latexPackageTheme === "TCOLORBOX"
                                  ? {
                                      backgroundImage:
                                        lessonBranchTheme.vividBannerGradientCss,
                                      borderColor: lessonBranchTheme.borderHex,
                                    }
                                  : {
                                      backgroundImage:
                                        lessonBranchTheme.headerGradientCss,
                                      borderColor: lessonBranchTheme.borderHex,
                                    }
                                : undefined
                            }
                            className={`font-extrabold text-sm flex flex-wrap justify-between items-center gap-2 print-exact-color ${effectiveExerciseHeaderClass} ${
                              lessonBranchTheme
                                ? latexPackageTheme === "TCOLORBOX"
                                  ? "rounded-lg px-3 py-2 border text-white shadow-2xs"
                                  : "rounded-lg px-2.5 py-1.5 border"
                                : ""
                            }`}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              {latexPackageTheme === "BCLOGO" && (
                                <span className="text-amber-700 font-black">★</span>
                              )}
                              <LessonHeaderIconBadge
                                lesson={lesson}
                                isDarkHeader={
                                  Boolean(lessonBranchTheme) &&
                                  latexPackageTheme === "TCOLORBOX"
                                }
                                isFr={isFr}
                              />
                              {lessonBranchTheme && !resolveLessonHeaderIcon(lesson) && (
                                <span
                                  className={`w-6 h-6 rounded-md inline-flex items-center justify-center font-serif text-xs font-black shrink-0 ${
                                    latexPackageTheme === "TCOLORBOX"
                                      ? "bg-white/20 text-amber-200 border border-white/30"
                                      : "text-white shadow-2xs"
                                  }`}
                                  style={
                                    latexPackageTheme === "TCOLORBOX"
                                      ? undefined
                                      : {
                                          backgroundImage:
                                            lessonBranchTheme.vividBannerGradientCss,
                                        }
                                  }
                                >
                                  {lessonBranchTheme.iconSymbol}
                                </span>
                              )}
                              <span
                                style={
                                  lessonBranchTheme
                                    ? latexPackageTheme === "TCOLORBOX"
                                      ? { color: "#ffffff" }
                                      : { color: lessonBranchTheme.accentColorHex }
                                    : undefined
                                }
                                className={exerciseTitleCalligraphyClass}
                              >
                                {customExerciseTitles[idx]?.trim()
                                  ? customExerciseTitles[idx].trim()
                                  : isMission
                                  ? `Exercice ${displayExNum} : ${lesson.lessonFr}`
                                  : isFr
                                  ? `Exercice ${displayExNum} : ${lesson.lessonFr}`
                                  : isAr
                                  ? `التمرين ${displayExNum} : ${lesson.lessonAr}`
                                  : `التمرين ${displayExNum} / Exercice ${displayExNum} : ${lesson.lessonAr} — ${lesson.lessonFr}`}
                              </span>
                              {lesson.subCategory && (
                                <span
                                  className={`text-[11px] font-normal ${
                                    latexPackageTheme === "TCOLORBOX"
                                      ? "text-white/85"
                                      : "text-slate-600"
                                  }`}
                                >
                                  · {isFr ? lesson.subCategoryFr || lesson.category : lesson.subCategory}
                                </span>
                              )}
                              {lessonBranchTheme && (
                                <span
                                  style={
                                    latexPackageTheme === "TCOLORBOX"
                                      ? undefined
                                      : {
                                          backgroundColor: lessonBranchTheme.softBgHex,
                                          color: lessonBranchTheme.accentColorHex,
                                          borderColor: lessonBranchTheme.borderHex,
                                        }
                                  }
                                  className={
                                    latexPackageTheme === "TCOLORBOX"
                                      ? "text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/15 text-amber-200 border border-white/25"
                                      : "text-[10px] font-extrabold px-2 py-0.5 rounded border"
                                  }
                                >
                                  {isFr
                                    ? lessonBranchTheme.branchBadgeFr
                                    : lessonBranchTheme.branchBadgeAr}
                                </span>
                              )}
                            </div>
                            <span
                              className={`font-mono font-bold tabular-nums text-xs ${
                                latexPackageTheme === "TCOLORBOX"
                                  ? customTcbStyles.badgeClass
                                  : latexPackageTheme === "EXAM_OFFICIAL"
                                  ? "border-2 border-slate-900 px-2 py-0.5 bg-slate-50 text-slate-950"
                                  : "text-indigo-950"
                              }`}
                            >
                              {exPoints} {isFr ? "points" : "نقط"} · {effectiveWeight}%
                            </span>
                          </div>

                          <ol className="list-decimal list-inside space-y-4 text-[13.5px] text-slate-900 leading-[2.15]">
                            {activeQuestions.map((q, qIdx) => {
                              const meta = qMetas[qIdx];
                              const prefix =
                                fillBlanks && idx === 0 && qIdx === 0
                                  ? isFr
                                    ? "(Preuve guidée à trous) "
                                    : "(برهان موجه بملء الفراغات) "
                                  : "";
                              return (
                                <li
                                  key={qIdx}
                                  className="space-y-2 mb-3 question-projection-target"
                                  title="انقر نقراً مزدوجاً لعرض السؤال بملء الشاشة على المسلاط الصفي (Mode Datashow)"
                                  onDoubleClick={() =>
                                    setProjectedQuestion({
                                      text: q,
                                      label: `التمرين ${idx + 1} — السؤال ${qIdx + 1}`,
                                    })
                                  }
                                >
                                  <div className="inline">
                                    <span>
                                      {prefix && <span className="font-semibold">{prefix}</span>}
                                      <MathText text={q} />
                                    </span>
                                    {showQuestionBareme && meta && (
                                      <span className="inline-block mx-2 font-mono text-[11px] font-bold text-indigo-900 tabular-nums">
                                        [{meta.points} {isFr ? "pt" : "ن"} · {meta.level}]
                                      </span>
                                    )}
                                  </div>
                                  {isBi && questionsFr[qIdx] && (
                                    <div
                                      dir="ltr"
                                      className="text-left text-slate-600 italic mt-0.5 pl-4"
                                    >
                                      <MathText text={questionsFr[qIdx]} />
                                    </div>
                                  )}
                                  {includeRescueHintsAndContinuity && meta?.level === "N3" && (
                                    <div className="mt-1 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-300/90 text-[10.5px] text-amber-950 flex flex-wrap items-center justify-between gap-2">
                                      <span>
                                        <strong>
                                          {isFr
                                            ? "💡 Continuité & Coup de pouce (N3) :"
                                            : "💡 استمرارية البحث وتلميح الإنقاذ (سؤال توليفي N3) :"}
                                        </strong>{" "}
                                        {isFr
                                          ? "En cas de blocage sur cette démonstration, le candidat peut admettre le résultat annoncé pour traiter les questions suivantes (ou solliciter l'indication méthodologique auprès du professeur contre -0,25 pt)."
                                          : "في حال تعذر إثبات هذه النتيجة، يُسمح للمترشح(ة) بقبولها (Admettre le résultat) ومواصلة الإجابة عن الأسئلة الموالية دون ضياع نقطها."}
                                      </span>
                                    </div>
                                  )}
                                  {includeAnswerWorkspace &&
                                    renderStudentAnswerWorkspace(
                                      meta?.level || "N1",
                                      undefined,
                                      true,
                                      {
                                        questionText: q,
                                        solutionText: isFr
                                          ? corr.solutions[qIdx]?.solutionTextFr
                                          : corr.solutions[qIdx]?.solutionTextAr,
                                        points: meta?.points,
                                        workspaceId: `ds_${modelCode}_ex_${idx}_q_${qIdx}`,
                                      }
                                    )}
                                </li>
                              );
                            })}
                          </ol>

                          {ggbResource && (
                            <GeoGebraFigureCard
                              resource={ggbResource}
                              lesson={lesson}
                              exerciseNumber={idx + 1}
                              isFr={isFr}
                              isBi={isBi}
                              onResourceUpdated={(updated) =>
                                onUpdateGeoGebraResource?.(
                                  lesson.lessonFr || `${lesson.weight}-${idx}`,
                                  updated
                                )
                              }
                            />
                          )}

                          {/* الأشكال الهندسية والرسوم التوضيحية المندرجة في التمرين */}
                          {insertedFigures
                            .filter((f) => f.exerciseId === `ex_${idx}` || f.exerciseId === lesson.lessonFr)
                            .map((fig) => (
                              <InsertedFigureCard
                                key={fig.id}
                                figure={fig}
                                isInlineEditable={isInlineEditable}
                                isFr={isFr}
                                onUpdateFigure={onUpdateFigure}
                                onDeleteFigure={onDeleteFigure}
                              />
                            ))}

                          {renderExerciseFigureDropZone(`ex_${idx}`)}

                          {includeDetailedSolutions &&
                            solutionDisplayMode === "INLINE_PER_EXERCISE" &&
                            renderDetailedCorrectionCard(corr, true)}
                        </div>
                      );
                    })}

                    {/* المسألة التوليفية الشاملة (Problème de Synthèse - نمط الامتحان الوطني والفرض المحروس المغربي) */}
                    {synthesisProblem && (() => {
                      const synthBranchTheme = enableBranchColorGradient
                        ? branchColorMode === "AUTO_BY_LESSON"
                          ? BRANCH_COLOR_THEMES.ANALYSIS_BLUE
                          : resolveBranchColorTheme(branchColorMode, baseDsLessons)
                        : null;
                      return (
                      <div
                        data-sync-section="SYNTHESIS_PROBLEM"
                        style={
                          synthBranchTheme
                            ? { borderColor: synthBranchTheme.borderHex }
                            : undefined
                        }
                        className={`avoid-break p-4 space-y-4 ${
                          synthBranchTheme ? "branch-themed-card" : ""
                        } ${
                          latexPackageTheme === "TCOLORBOX" &&
                          tcolorboxConfig.applyToComplexProblems
                            ? problemTcbStyles.boxClass
                            : "border-2 border-indigo-900/80 rounded-xl bg-white shadow-xs"
                        } ${
                          activeSyncSection === "SYNTHESIS_PROBLEM"
                            ? "ring-2 ring-amber-500/80 transition-all"
                            : ""
                        }`}
                      >
                        <div
                          style={
                            synthBranchTheme
                              ? latexPackageTheme === "TCOLORBOX" &&
                                tcolorboxConfig.applyToComplexProblems
                                ? {
                                    backgroundImage:
                                      synthBranchTheme.vividBannerGradientCss,
                                    borderColor: synthBranchTheme.borderHex,
                                  }
                                : {
                                    backgroundImage:
                                      synthBranchTheme.headerGradientCss,
                                    borderColor: synthBranchTheme.borderHex,
                                  }
                              : undefined
                          }
                          className={`font-black text-sm flex flex-wrap justify-between items-center gap-2 print-exact-color ${
                            latexPackageTheme === "TCOLORBOX" &&
                            tcolorboxConfig.applyToComplexProblems
                              ? problemTcbStyles.headerClass
                              : synthBranchTheme
                              ? "text-slate-950 rounded-lg px-3 py-2 border"
                              : "text-indigo-950 border-b-2 border-indigo-100 pb-2"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={
                                latexPackageTheme === "TCOLORBOX" &&
                                tcolorboxConfig.applyToComplexProblems
                                  ? "bg-white/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded font-mono border border-white/25"
                                  : "bg-indigo-950 text-amber-300 text-[11px] px-2.5 py-0.5 rounded font-mono"
                              }
                            >
                              {isFr ? "PROBLÈME (tcolorbox)" : "مسألة توليفية"}
                            </span>
                            <span>
                              {isFr ? synthesisProblem.titleFr : synthesisProblem.titleAr}
                            </span>
                            {synthBranchTheme && (
                              <span
                                style={
                                  latexPackageTheme === "TCOLORBOX" &&
                                  tcolorboxConfig.applyToComplexProblems
                                    ? undefined
                                    : {
                                        backgroundColor: synthBranchTheme.softBgHex,
                                        color: synthBranchTheme.accentColorHex,
                                        borderColor: synthBranchTheme.borderHex,
                                      }
                                }
                                className={
                                  latexPackageTheme === "TCOLORBOX" &&
                                  tcolorboxConfig.applyToComplexProblems
                                    ? "text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/15 text-amber-200 border border-white/25"
                                    : "text-[10px] font-extrabold px-2 py-0.5 rounded border"
                                }
                              >
                                {synthBranchTheme.iconSymbol}{" "}
                                {isFr
                                  ? synthBranchTheme.branchBadgeFr
                                  : synthBranchTheme.branchBadgeAr}
                              </span>
                            )}
                          </div>
                          <span
                            className={
                              latexPackageTheme === "TCOLORBOX" &&
                              tcolorboxConfig.applyToComplexProblems
                                ? `${problemTcbStyles.badgeClass} tabular-nums text-xs`
                                : "font-mono font-extrabold text-indigo-950 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded tabular-nums text-xs"
                            }
                          >
                            {synthesisProblem.totalPoints} {isFr ? "points" : "نقط"}
                          </span>
                        </div>

                        <div className="space-y-3.5">
                          {synthesisProblem.parts.map((part, pIdx) => (
                            <div
                              key={pIdx}
                              className={`p-3 rounded-xl space-y-2 ${
                                latexPackageTheme === "TCOLORBOX" &&
                                tcolorboxConfig.applyToComplexProblems
                                  ? problemTcbStyles.partBoxClass
                                  : "bg-slate-50/80 border border-slate-200"
                              }`}
                            >
                              <div className="font-extrabold text-xs text-indigo-950 border-b border-slate-200 pb-1 flex justify-between items-center">
                                <span><MathText text={isFr ? part.partTitleFr : part.partTitleAr} /></span>
                                <span className="font-mono text-[11px] text-indigo-800 tabular-nums">
                                  ({part.partPoints} {isFr ? "pts" : "ن"})
                                </span>
                              </div>
                              <div className="space-y-4 text-[13.5px] text-slate-900 leading-[2.15]">
                                {(isFr ? part.questionsFr : part.questionsAr).map((q, qIdx) => (
                                  <div key={qIdx} className="space-y-2 mb-3">
                                    <div><MathText text={q} /></div>
                                    {isBi && part.questionsFr[qIdx] && (
                                      <div
                                        dir="ltr"
                                        className="text-left text-slate-600 italic text-[11px] pl-3"
                                      >
                                        <MathText text={part.questionsFr[qIdx]} />
                                      </div>
                                    )}
                                    {includeAnswerWorkspace &&
                                      renderStudentAnswerWorkspace(
                                        pIdx === 0 ? "N2" : "N3",
                                        undefined,
                                        true,
                                        {
                                          questionText: q,
                                          solutionText: isFr
                                            ? part.correctionFr[qIdx]
                                            : part.correctionAr[qIdx],
                                          points: (
                                            parseFloat(part.partPoints || "3") /
                                            Math.max(1, part.questionsAr.length)
                                          ).toFixed(2),
                                          workspaceId: `ds_${modelCode}_synth_${pIdx}_q_${qIdx}`,
                                        }
                                      )}
                                  </div>
                                ))}
                              </div>
                              {includeRescueHintsAndContinuity && pIdx < synthesisProblem.parts.length - 1 && (
                                <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 border border-indigo-200 text-[10.5px] text-indigo-950">
                                  <strong>
                                    {isFr
                                      ? "🔗 Note de continuité (Style Baccalauréat) :"
                                      : "🔗 ملحوظة استمرارية المسألة (ضمان تكافؤ الفرص) :"}
                                  </strong>{" "}
                                  {isFr
                                    ? "Les résultats de cette partie peuvent être admis et utilisés librement dans les parties suivantes du problème."
                                    : "يُمكن للمترشح(ة) قبول نتائج هذا الجزء وتوظيفها مباشرة في معالجة الأجزاء الموالية من المسألة التوليفية."}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {insertedFigures
                          .filter((f) => f.exerciseId === "ex_probleme_synthese")
                          .map((fig) => (
                            <InsertedFigureCard
                              key={fig.id}
                              figure={fig}
                              isInlineEditable={isInlineEditable}
                              isFr={isFr}
                              onUpdateFigure={onUpdateFigure}
                              onDeleteFigure={onDeleteFigure}
                            />
                          ))}

                        {renderExerciseFigureDropZone("ex_probleme_synthese")}

                        {includeDetailedSolutions &&
                          solutionDisplayMode === "INLINE_PER_EXERCISE" && (
                            <div
                              className={`mt-3 bg-emerald-50/50 border border-emerald-300 rounded-xl p-3.5 space-y-2.5 ${solutionHandwritingClass}`}
                            >
                              <div className="font-black text-xs text-emerald-950 flex items-center justify-between border-b border-emerald-200 pb-1">
                                <span>
                                  {isFr
                                    ? "Éléments de réponse & Corrigé du Problème de Synthèse :"
                                    : "عناصر الإجابة والحل المفصل للمسألة التوليفية الشاملة :"}
                                </span>
                                <span className="font-mono text-[11px] text-emerald-800">
                                  [{synthesisProblem.totalPoints} {isFr ? "pts" : "ن"}]
                                </span>
                              </div>
                              {synthesisProblem.parts.map((part, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="bg-white p-2.5 rounded-lg border border-emerald-100 space-y-1 text-xs"
                                >
                                  <div className="font-extrabold text-emerald-950">
                                    {isFr ? part.partTitleFr : part.partTitleAr}
                                  </div>
                                  {(isFr ? part.correctionFr : part.correctionAr).map(
                                    (cLine, cIdx) => (
                                      <div key={cIdx} className="text-slate-800 leading-relaxed">
                                        <MathText text={cLine} />
                                      </div>
                                    )
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      );
                    })()}

                    {/* المقترح البيداغوجي 2: شبكة التقويم الذاتي وتدبير زمن الإنجاز للمترشح أسفل ورقة الفرض */}
                    {includeDSStudentSelfCheck && (() => {
                      const durMatch = (track.durationFr || track.durationAr || "2h").match(/(\d+)/);
                      const hoursNum = durMatch ? Math.max(1, parseInt(durMatch[1], 10)) : 2;
                      const totalMinutes = hoursNum <= 4 ? hoursNum * 60 : hoursNum;
                      const reviewMinutes = 10;
                      const workingMinutes = Math.max(30, totalMinutes - reviewMinutes);
                      const fixedQcmPts =
                        hasQCM && qcmBlock ? parseFloat(qcmBlock.totalPoints) || 4.0 : 0;
                      const fixedProbPts = hasSynthesisProblem ? 8.5 : 0;
                      const exBudget = Math.max(4, 20 - fixedQcmPts - fixedProbPts);
                      const exactTimeWeights = computeExactExerciseEffectiveWeights(
                        orderedLessons,
                        exBudget
                      );

                      const timeRows: Array<{
                        label: string;
                        pts: number;
                        mins: number;
                      }> = [];

                      if (hasQCM && qcmBlock) {
                        timeRows.push({
                          label: isFr ? "Ex 1 : QCM & Justification" : "التمرين 1 : أسئلة QCM مع التعليل",
                          pts: fixedQcmPts,
                          mins: Math.round((fixedQcmPts / 20) * workingMinutes),
                        });
                      }

                      orderedLessons.forEach((lesson, idx) => {
                        const displayExNum = idx + 1 + exerciseNumOffset;
                        const effectiveWeight = exactTimeWeights[idx] ?? lesson.weight;
                        const { questionsFr } = getVariantQuestions(
                          lesson,
                          modelCode,
                          shuffleQuestions,
                          0,
                          dsQuestionDensity
                        );
                        const qMetas = getQuestionBaremesAndLevels(
                          effectiveWeight,
                          questionsFr.length,
                          n1,
                          n2,
                          n3,
                          lesson.customQuestionBaremes,
                          lesson.customQuestionLevels
                        );
                        const ptsNum = Number(
                          qMetas
                            .reduce((s, m) => s + parseFloat(m.points || "0"), 0)
                            .toFixed(2)
                        );
                        timeRows.push({
                          label: isFr
                            ? `Exercice ${displayExNum} : ${lesson.lessonFr}`
                            : `التمرين ${displayExNum} : ${lesson.lessonAr}`,
                          pts: ptsNum,
                          mins: Math.max(5, Math.round((ptsNum / 20) * workingMinutes)),
                        });
                      });

                      if (hasSynthesisProblem && synthesisProblem) {
                        timeRows.push({
                          label: isFr
                            ? "Problème de Synthèse"
                            : "المسألة التوليفية الشاملة",
                          pts: 8.5,
                          mins: Math.round((8.5 / 20) * workingMinutes),
                        });
                      }

                      return (
                        <div className="avoid-break border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 space-y-2 text-[11px]">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
                            <span className="font-black text-slate-950">
                              {isFr
                                ? "⏱️ Grille de Gestion du Temps & Auto-vérification du Candidat (avant remise de la copie) :"
                                : "⏱️ شبكة تدبير زمن الإنجاز والمراجعة الذاتية للمترشح(ة) (قبل تسليم ورقة التحرير):"}
                            </span>
                            <span className="font-mono font-bold text-slate-700 tabular-nums">
                              {isFr
                                ? `Durée totale : ${totalMinutes} min (dont ${reviewMinutes} min de relecture)`
                                : `الحصيص الإجمالي: ${totalMinutes} د (منها ${reviewMinutes} دقائق للمراجعة النهائية)`}
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-slate-300 bg-white text-[10.5px]">
                              <thead>
                                <tr className="bg-slate-100 text-slate-900 font-bold">
                                  <th className="border border-slate-300 p-1.5 text-start">
                                    {isFr ? "Composante de l'épreuve" : "مكونات الفرض المحروس"}
                                  </th>
                                  <th className="border border-slate-300 p-1.5 text-center w-20">
                                    {isFr ? "Barème" : "التنقيط"}
                                  </th>
                                  <th className="border border-slate-300 p-1.5 text-center w-28">
                                    {isFr ? "Temps conseillé" : "الزمن المقترح"}
                                  </th>
                                  <th className="border border-slate-300 p-1.5 text-center w-36">
                                    {isFr ? "Vérification (Copie)" : "التحقق من التحرير"}
                                  </th>
                                  <th className="border border-slate-300 p-1.5 text-center w-40">
                                    {isFr ? "Auto-évaluation" : "تقدير التحكم الذاتي"}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {timeRows.map((tr, rIdx) => (
                                  <tr key={rIdx} className="border-b border-slate-200">
                                    <td className="border border-slate-300 p-1.5 font-bold text-slate-800">
                                      {tr.label}
                                    </td>
                                    <td className="border border-slate-300 p-1.5 text-center font-mono font-extrabold text-slate-900 tabular-nums">
                                      {tr.pts.toFixed(2)} {isFr ? "pts" : "ن"}
                                    </td>
                                    <td className="border border-slate-300 p-1.5 text-center font-mono text-cyan-900 font-bold tabular-nums">
                                      ≈ {tr.mins} {isFr ? "min" : "دقيقة"}
                                    </td>
                                    <td className="border border-slate-300 p-1.5 text-center font-mono text-[10px] text-slate-600">
                                      {isFr ? "[ ] Traité  [ ] Relu" : "[ ] أُنجز  [ ] روجع"}
                                    </td>
                                    <td className="border border-slate-300 p-1.5 text-center font-mono text-[10px] text-slate-600">
                                      {isFr ? "[ ] Maîtrisé [ ] Moyen [ ] Difficile" : "[ ] متحكم [ ] متوسط [ ] صعب"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}

                    {/* تذييل الورقة الامتحانية المغربية الرسمية */}
                    <div className="moroccan-exam-footer-notice avoid-break">
                      <span className="font-bold text-slate-700">
                        {isFr
                          ? "Royaume du Maroc · Ministère de l'Éducation Nationale · Note 142-08"
                          : "المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة · المذكرة الوزارية 142-08"}
                      </span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {isFr ? "Tournez la page S.V.P ➔" : "اقلب الصفحة من فضلك ➔"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* ج. عناصر الإجابة وسلم التنقيط المفصل المدمج (متوافق 100% مع بنية الفرض وتجزئة النقط) */}
          {!onlyPrintSolutions &&
            effectivePrintScope !== "SUJET_ONLY" &&
            effectivePrintScope !== "SPEC_GRID_ONLY" &&
            (showAnswerKey || effectivePrintScope === "SOLUTIONS_ONLY") &&
            (() => {
            const hasQCM =
              dsStructureMode === "QCM_ET_EXERCICES" ||
              dsStructureMode === "COMPLETE_EXAM_MAROC";
            const hasSynthesisProblem =
              dsStructureMode === "EXERCICES_ET_PROBLEME" ||
              dsStructureMode === "COMPLETE_EXAM_MAROC";
            const fixedQcmPts = hasQCM
              ? Number(((qcmConfig?.questionCount || 4) * 1.0).toFixed(2))
              : 0;
            const fixedProbPts = hasSynthesisProblem ? 8.5 : 0;
            const exBudget = Math.max(4, 20 - fixedQcmPts - fixedProbPts);
            const exactAnswerKeyWeights = computeExactExerciseEffectiveWeights(
              baseDsLessons,
              exBudget
            );
            const exNumOffset = hasQCM ? 1 : 0;

            return (
              <div className="page-break avoid-break space-y-3 pt-4 border-t-2 border-dashed border-slate-300">
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center justify-between">
                  <span>
                    {isMission
                      ? "Corrigé type et barème détaillé (Conforme à l'épreuve du Baccalauréat)"
                      : isFr
                      ? "Éléments de réponse et barème détaillé (Cahier de textes)"
                      : "عناصر الإجابة وسلم التنقيط المفصل (خاص بدفتر النصوص وملف الأستاذ)"}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded">
                    {examModel === "BOTH" ? "Modèles A & B" : `Modèle ${examModel}`}
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {hasQCM && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-slate-900 flex justify-between">
                        <span>
                          {isFr
                            ? "Corrigé Exercice 1 : QCM & Vrai/Faux avec justification"
                            : "تصحيح التمرين 1 : أسئلة الاختيار من متعدد (QCM) مع التعليل"}
                        </span>
                        <span className="font-mono text-emerald-800 font-extrabold tabular-nums">
                          {fixedQcmPts.toFixed(2)} pts ({Math.round((fixedQcmPts / 20) * 100)}%)
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {isFr
                          ? "1.00 pt par item (0.50 pt pour le choix exact + 0.50 pt pour la justification rigoureuse)."
                          : "1.00 نقطة لكل سؤال (0.50 ن للاختيار الصحيح + 0.50 ن لسلامة التعليل الرياضي)."}
                      </p>
                    </div>
                  )}

                  {baseDsLessons.map((lesson, idx) => {
                    const effectiveWeight = exactAnswerKeyWeights[idx] ?? lesson.weight;
                    const { questionsFr } = getVariantQuestions(
                      lesson,
                      "A",
                      false,
                      0,
                      dsQuestionDensity
                    );
                    const qMetas = getQuestionBaremesAndLevels(
                      effectiveWeight,
                      questionsFr.length,
                      n1,
                      n2,
                      n3,
                      lesson.customQuestionBaremes,
                      lesson.customQuestionLevels
                    );
                    const exPointsNum = qMetas.reduce(
                      (s, m) => s + parseFloat(m.points || "0"),
                      0
                    );
                    const exPoints = exPointsNum.toFixed(2);
                    const displayExNum = idx + 1 + exNumOffset;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                      >
                        <div className="font-bold text-slate-900 flex justify-between">
                          <span>
                            {isFr
                              ? `Corrigé Exercice ${displayExNum} (${lesson.lessonFr})`
                              : `تصحيح التمرين ${displayExNum} (${lesson.lessonAr})`}
                          </span>
                          <span className="font-mono text-emerald-800 font-extrabold tabular-nums">
                            {exPoints} pts ({effectiveWeight}%)
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {isMission
                            ? `Barème fractionné (${qMetas.map((m) => `${m.points}p`).join(" + ")}) par étape de démonstration pour les Sujets A et B.`
                            : isFr
                            ? `Barème détaillé par question (${qMetas.map((m) => `${m.points} pt`).join(" · ")}) sur ${exPoints} pts.`
                            : `توزيع مجزأ على ${qMetas.length} أسئلة (${qMetas.map((m) => `${m.points} ن`).join(" + ")}) بمجموع ${exPoints} نقط.`}
                        </p>
                      </div>
                    );
                  })}

                  {hasSynthesisProblem && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-slate-900 flex justify-between">
                        <span>
                          {isFr
                            ? "Corrigé du Problème de Synthèse (Parties I, II, III)"
                            : "تصحيح المسألة التوليفية الشاملة (الأجزاء I و II و III)"}
                        </span>
                        <span className="font-mono text-emerald-800 font-extrabold tabular-nums">
                          8.50 pts (42.5%)
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {isFr
                          ? "Partie I (2.50 pts · N1) + Partie II (3.50 pts · N2) + Partie III (2.50 pts · N3)."
                          : "الجزء الأول (2.50 ن · N1) + الجزء الثاني (3.50 ن · N2) + الجزء الثالث (2.50 ن · N3)."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* د. ملحق عناصر الإجابة والحل المفصل في صفحة منفصلة (Annexes) */}
          {effectivePrintScope !== "SUJET_ONLY" &&
            effectivePrintScope !== "SPEC_GRID_ONLY" &&
            (includeDetailedSolutions || onlyPrintSolutions || effectivePrintScope === "SOLUTIONS_ONLY") &&
            (solutionDisplayMode === "SEPARATE_PAGE_ANNEXES" || onlyPrintSolutions || effectivePrintScope === "SOLUTIONS_ONLY") && (
              <div
                data-sync-section="SOLUTIONS"
                className={`space-y-6 ${
                  activeSyncSection === "SOLUTIONS"
                    ? "ring-2 ring-emerald-500/70 rounded-xl p-2 -mx-2 transition-all"
                    : ""
                }`}
              >
                {(enableFourModelsABCD
                  ? (["A", "B", "C", "D"] as const)
                  : modelsToRender
                ).map((m) => (
                  <React.Fragment key={`annex-${m}`}>
                    {renderAnnexesPage(m)}
                  </React.Fragment>
                ))}
              </div>
            )}

          {/* المقترح البيداغوجي 3: ملحق خطة الدعم والمعالجة التربوية لما بعد الفرض (Fiche de Remédiation Post-DS 142-08) */}
          {includePostExamRemediationSheet && !onlyPrintSolutions && effectivePrintScope !== "SUJET_ONLY" && (
            <div className="page-break pt-4 space-y-4">
              <div className="border-2 border-slate-900 rounded-xl p-4 bg-slate-50/70 space-y-2">
                <div className="flex flex-wrap justify-between items-center text-xs border-b border-slate-300 pb-2 gap-2">
                  <div className="font-extrabold text-slate-950">
                    {isFr
                      ? `${school} · ${prof} · Année Scolaire ${year}`
                      : `${school} · ${prof} · الموسم الدراسي ${year}`}
                  </div>
                  <span className="bg-slate-900 text-cyan-300 font-mono text-[11px] font-black px-3 py-1 rounded-md">
                    {isFr
                      ? "Dispositif de Remédiation Post-DS (Note 142-08)"
                      : "بطاقة الاستثمار الديداكتيكي وخطة الدعم والمعالجة (مذكرة 142-08)"}
                  </span>
                </div>
                <div className="text-center py-1">
                  <h3 className="text-base font-black text-slate-950">
                    {isFr
                      ? `Fiche de Diagnostic des Erreurs & Plan de Remédiation Différenciée — ${dsKey} (${sem})`
                      : `شبكة تشخيص التعثرات وخطة الدعم والمعالجة التربوية الفارقية — الفرض ${dsKey} (${sem === "S1" ? "الدورة 1" : "الدورة 2"})`}
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">
                    {isFr
                      ? `${track.labelFr} · Séance de compte-rendu et de consolidation`
                      : `${track.labelAr} · حصة تصحيح الفرض المحروس واستثمار النتائج`}
                  </p>
                </div>
              </div>

              {/* 1. تشخيص الصعوبات والأخطاء الشائعة المرتبطة بدروس الفرض */}
              <div className="space-y-2 avoid-break">
                <h4 className="font-black text-xs text-slate-950">
                  {isFr
                    ? "I. Diagnostic des difficultés fréquentes et obstacles didactiques observés :"
                    : "أولاً: تشخيص الأخطاء الشائعة والعوائق الديداكتيكية المرصودة في أوراق التحرير:"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {baseDsLessons.map((lesson, lIdx) => {
                    const memo = getMoroccanLessonMemo(lesson);
                    return (
                      <div
                        key={lIdx}
                        className="p-3 rounded-xl border border-slate-300 bg-white space-y-1.5"
                      >
                        <div className="font-extrabold text-slate-950 border-b border-slate-200 pb-1 flex justify-between">
                          <span>
                            {lIdx + 1}. {isFr ? lesson.lessonFr : lesson.lessonAr}
                          </span>
                          <span className="font-mono text-[10.5px] text-cyan-800">
                            {lesson.weight}%
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                          {(isFr ? memo.commonPitfallsFr : memo.commonPitfallsAr).map(
                            (pit, pIdx) => (
                              <li key={pIdx}>{pit}</li>
                            )
                          )}
                        </ul>
                        <div className="pt-1 text-[10.5px] text-teal-900 bg-teal-50/70 p-2 rounded border border-teal-200 font-semibold">
                          <span className="font-black">
                            {isFr ? "Remédiation ciblée : " : "التدخل العلاجي المقترح: "}
                          </span>
                          <span>{isFr ? memo.inspectorAdviceFr : memo.inspectorAdviceAr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. تفييء المتعلمين والأنشطة العلاجية الفارقية حسب المجموعات الثلاث */}
              <div className="space-y-2 avoid-break">
                <h4 className="font-black text-xs text-slate-950">
                  {isFr
                    ? "II. Groupes de besoin et exercices de remédiation différenciée :"
                    : "ثانياً: تفييء المتعلمين حسب فئات التحكم والأنشطة العلاجية المبرمجة:"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-rose-300 bg-rose-50/30 space-y-1.5">
                    <div className="font-black text-rose-950 flex justify-between items-center border-b border-rose-200 pb-1">
                      <span>
                        {isFr ? "Groupe A (Note < 08/20)" : "المجموعة أ (النقطة < 08/20)"}
                      </span>
                      <span className="font-mono text-[10px] bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded">
                        N1 · {n1}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      {isFr
                        ? "Objectif : Réappropriation des définitions, formules de base et calculs directs sur :"
                        : "الهدف العلاجي: تثبيت القواعد الأساسية والتطبيق المباشر للمبرهنات في:"}
                    </p>
                    <div className="bg-white p-2 rounded border border-rose-200 text-[10.5px] text-slate-800 font-medium">
                      {baseDsLessons[0]
                        ? isFr
                          ? baseDsLessons[0].sampleExerciseFr?.[0] ||
                            baseDsLessons[0].capacitiesFr[0] ||
                            baseDsLessons[0].lessonFr
                          : baseDsLessons[0].sampleExerciseAr?.[0] ||
                            baseDsLessons[0].capacitiesAr[0] ||
                            baseDsLessons[0].lessonAr
                        : ""}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/30 space-y-1.5">
                    <div className="font-black text-amber-950 flex justify-between items-center border-b border-amber-200 pb-1">
                      <span>
                        {isFr ? "Groupe B (08 ≤ Note < 13)" : "المجموعة ب (08 ≤ النقطة < 13)"}
                      </span>
                      <span className="font-mono text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                        N2 · {n2}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      {isFr
                        ? "Objectif : Maîtrise de la rédaction démonstrative et enchaînement des étapes méthodologiques :"
                        : "الهدف العلاجي: تجويد التحرير الاستدلالي والربط بين أسئلة التمرين:"}
                    </p>
                    <div className="bg-white p-2 rounded border border-amber-200 text-[10.5px] text-slate-800 font-medium">
                      {baseDsLessons[0]
                        ? isFr
                          ? baseDsLessons[0].sampleExerciseFr?.[1] ||
                            baseDsLessons[0].capacitiesFr[0] ||
                            baseDsLessons[0].lessonFr
                          : baseDsLessons[0].sampleExerciseAr?.[1] ||
                            baseDsLessons[0].capacitiesAr[0] ||
                            baseDsLessons[0].lessonAr
                        : ""}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-teal-300 bg-teal-50/30 space-y-1.5">
                    <div className="font-black text-teal-950 flex justify-between items-center border-b border-teal-200 pb-1">
                      <span>
                        {isFr ? "Groupe C (Note ≥ 13/20)" : "المجموعة ج (النقطة ≥ 13/20)"}
                      </span>
                      <span className="font-mono text-[10px] bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded">
                        N3 · {n3}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      {isFr
                        ? "Objectif : Approfondissement, prise d'initiative et résolution de problèmes ouverts :"
                        : "هدف الإغناء والتميز: حل وضعيات غير نمطية ومسائل توليفية مركبة:"}
                    </p>
                    <div className="bg-white p-2 rounded border border-teal-200 text-[10.5px] text-slate-800 font-medium">
                      {baseDsLessons[baseDsLessons.length - 1]
                        ? isFr
                          ? baseDsLessons[baseDsLessons.length - 1].sampleExerciseFr?.slice(-1)[0] ||
                            baseDsLessons[baseDsLessons.length - 1].capacitiesFr.slice(-1)[0] ||
                            baseDsLessons[baseDsLessons.length - 1].lessonFr
                          : baseDsLessons[baseDsLessons.length - 1].sampleExerciseAr?.slice(-1)[0] ||
                            baseDsLessons[baseDsLessons.length - 1].capacitiesAr.slice(-1)[0] ||
                            baseDsLessons[baseDsLessons.length - 1].lessonAr
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* المقترح البيداغوجي 4: البطاقة التقنية والإحصائية للفرض المحروس ودفتر النصوص (Fiche Technique & Bilan Statistique) */}
          {includeOfficialExamCoverSheet && !onlyPrintSolutions && effectivePrintScope !== "SUJET_ONLY" && (
            <div className="page-break pt-4 space-y-4">
              <div className="border-2 border-slate-900 rounded-xl p-4 bg-white space-y-3">
                <div className="flex flex-wrap justify-between items-center text-xs border-b-2 border-slate-900 pb-2.5 gap-2">
                  <div>
                    <div className="font-black text-slate-950">
                      {isFr
                        ? `Royaume du Maroc · ${academy} · ${direction}`
                        : `المملكة المغربية · ${academy} · ${direction}`}
                    </div>
                    <div className="text-[11px] text-slate-600 font-bold">
                      {school} · {prof} · {year}
                    </div>
                  </div>
                  <span className="bg-slate-900 text-cyan-300 font-mono text-xs font-black px-3 py-1 rounded-md">
                    {isFr
                      ? "Dossier Officiel d'Évaluation & Cahier de Textes"
                      : "بطاقة تقنية وإحصائية للفرض المحروس (دفتر النصوص وملف التفتيش)"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">
                      {isFr ? "Filière / Niveau :" : "المسلك والمستوى:"}
                    </span>
                    <span className="font-black text-slate-950">
                      {isFr ? track.labelFr : track.labelAr}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">
                      {isFr ? "Épreuve & Semestre :" : "الفرض والأسدوس:"}
                    </span>
                    <span className="font-black text-slate-950 font-mono">
                      {dsKey} ({sem}) · {isFr ? track.durationFr : track.durationAr}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">
                      {isFr ? "Date de passation :" : "تاريخ إجراء الفرض:"}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      .... / .... / 202..
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">
                      {isFr ? "Date de correction :" : "تاريخ التصحيح والدعم:"}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      .... / .... / 202..
                    </span>
                  </div>
                </div>

                {/* جدول الإحصائيات البعدية لنتائج الفرض المحروس */}
                <div className="space-y-2">
                  <h4 className="font-black text-xs text-slate-950">
                    {isFr
                      ? "I. Bilan Statistique des Notes de la Classe (après correction) :"
                      : "أولاً: الحصيلة الإحصائية لنتائج القسم بعد تصحيح الفرض المحروس:"}
                  </h4>
                  <table className="w-full border-collapse border border-slate-400 text-[11px] text-center bg-white">
                    <thead>
                      <tr className="bg-slate-100 text-slate-950 font-extrabold">
                        <th className="border border-slate-400 p-1.5">
                          {isFr ? "Effectif Présents" : "عدد الحاضرين"}
                        </th>
                        <th className="border border-slate-400 p-1.5">
                          {isFr ? "Note Max" : "أعلى نقطة"}
                        </th>
                        <th className="border border-slate-400 p-1.5">
                          {isFr ? "Note Min" : "أدنى نقطة"}
                        </th>
                        <th className="border border-slate-400 p-1.5">
                          {isFr ? "Moyenne Classe" : "معدل القسم"}
                        </th>
                        <th className="border border-slate-400 p-1.5">
                          {isFr ? "Notes ≥ 10/20 (%)" : "نسبة التحكم (≥ 10/20)"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="h-9 font-mono text-slate-600">
                        <td className="border border-slate-400 p-1.5">.... / ....</td>
                        <td className="border border-slate-400 p-1.5">.... / 20</td>
                        <td className="border border-slate-400 p-1.5">.... / 20</td>
                        <td className="border border-slate-400 p-1.5">.... / 20</td>
                        <td className="border border-slate-400 p-1.5">.... %</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* توزيع فئات النقط */}
                <div className="space-y-2">
                  <h4 className="font-black text-xs text-slate-950">
                    {isFr
                      ? "II. Répartition des élèves par tranches de notes :"
                      : "ثانياً: توزيع المتعلمين حسب فئات النقط المحصل عليها:"}
                  </h4>
                  <table className="w-full border-collapse border border-slate-400 text-[11px] text-center bg-white">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold font-mono">
                        <th className="border border-slate-400 p-1.5">[0 ; 5[</th>
                        <th className="border border-slate-400 p-1.5">[5 ; 8[</th>
                        <th className="border border-slate-400 p-1.5">[8 ; 10[</th>
                        <th className="border border-slate-400 p-1.5">[10 ; 12[</th>
                        <th className="border border-slate-400 p-1.5">[12 ; 14[</th>
                        <th className="border border-slate-400 p-1.5">[14 ; 16[</th>
                        <th className="border border-slate-400 p-1.5">[16 ; 20]</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="h-8 font-mono text-slate-500">
                        <td className="border border-slate-400 p-1.5">....</td>
                        <td className="border border-slate-400 p-1.5">....</td>
                        <td className="border border-slate-400 p-1.5">....</td>
                        <td className="border border-slate-400 p-1.5">....</td>
                        <td className="border border-slate-400 p-1.5">....</td>
                        <td className="border border-slate-400 p-1.5">....</td>
                        <td className="border border-slate-400 p-1.5">....</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* توقيع الأستاذ وملاحظات الإدارة التربوية والتفتيش */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="border border-slate-300 rounded-lg p-3 h-20">
                    <div className="font-bold text-slate-800">
                      {isFr ? "Signature du Professeur :" : "توقيع الأستاذ(ة) وملاحظاته:"}
                    </div>
                  </div>
                  <div className="border border-slate-300 rounded-lg p-3 h-20">
                    <div className="font-bold text-slate-800">
                      {isFr ? "Visa de la Direction Pédagogique :" : "تأشيرة الإدارة التربوية:"}
                    </div>
                  </div>
                  <div className="border border-slate-300 rounded-lg p-3 h-20">
                    <div className="font-bold text-slate-800">
                      {isFr ? "Visa de l'Inspecteur Pédagogique :" : "تأشيرة وتوجيهات السيد(ة) المفتش(ة):"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* هـ. شبكة التقويم والتفريغ المخصصة (Grille d'évaluation PDF/A4) */}
          {includeCustomEvalGridSheet && !onlyPrintSolutions && effectivePrintScope !== "SUJET_ONLY" && renderCustomEvaluationGridSheet()}

          {/* و. ملحق مكتبة الأخطاء الشائعة للمتعلمين وبطاقات اليقظة الديداكتيكية (Banque d'Erreurs Typiques & Vigilance Didactique) */}
          {includeDidacticVigilanceSheet && !onlyPrintSolutions && effectivePrintScope !== "SUJET_ONLY" && (() => {
            const errorCards = getTypicalErrorsForLessons(baseDsLessons);
            return (
              <div className="page-break pt-4 space-y-4">
                <div className="border-2 border-rose-900 rounded-xl p-4 bg-rose-50/40 space-y-3">
                  <div className="flex flex-wrap justify-between items-center text-xs border-b border-rose-200 pb-2 gap-2">
                    <div className="font-black text-rose-950">
                      {isFr
                        ? `Banque d'Erreurs Typiques & Fiche de Vigilance Didactique — ${dsKey} (${sem})`
                        : `بطاقة اليقظة الديداكتيكية والأخطاء الشائعة للمتعلمين — الفرض ${dsKey} (${sem})`}
                    </div>
                    <span className="bg-rose-900 text-white font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded">
                      {isFr ? "Guide du Correcteur & Remédiation" : "دليل الأستاذ المصحح ووقاية التعثرات"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {errorCards.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white border border-rose-200 rounded-xl p-3 space-y-2 avoid-break shadow-2xs"
                      >
                        <div className="font-extrabold text-slate-950 border-b border-slate-100 pb-1 flex justify-between items-center">
                          <span>{isFr ? c.lessonTitleFr : c.lessonTitleAr}</span>
                          <span className="font-mono text-[10px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold">
                            {c.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-800 leading-relaxed">
                          <strong className="text-rose-800">
                            {isFr ? "⚠ Erreur fréquente : " : "⚠ الخطأ الشائع المرصود: "}
                          </strong>
                          {isFr ? c.frequentMistakeFr : c.frequentMistakeAr}
                        </p>
                        <div className="grid grid-cols-2 gap-2 font-mono text-[10.5px]" dir="ltr">
                          <div className="bg-rose-50 border border-rose-200 rounded p-1.5 text-rose-900">
                            <span className="font-bold block text-[9.5px]">✗ Erreur :</span>
                            {c.wrongExpressionLatex}
                          </div>
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-1.5 text-emerald-900">
                            <span className="font-bold block text-[9.5px]">✓ Correct :</span>
                            {c.correctExpressionLatex}
                          </div>
                        </div>
                        <div className="text-[10.5px] text-slate-600">
                          <strong>{isFr ? "Origine : " : "السبب المعرفي: "}</strong>
                          {isFr ? c.cognitiveOriginFr : c.cognitiveOriginAr}
                        </div>
                        <div className="bg-indigo-50/70 border border-indigo-200 rounded p-1.5 text-[10.5px] text-indigo-950 font-semibold">
                          <strong>{isFr ? "💡 Conseil : " : "💡 توجيه ديداكتيكي: "}</strong>
                          {isFr ? c.teacherRemediationTipFr : c.teacherRemediationTipAr}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 2. وحدة الفروض المنزلية وسلاسل التمارين (DM & Séries d'exercices TD) */}
      {!onlyPrintEvalGrid && activeModule === "DM_SERIE" && (
        <div className="space-y-8">
          {!onlyPrintSolutions && effectivePrintScope !== "SOLUTIONS_ONLY" && (
            <>
              {/* جدول توزيع الدروس والأوزان المختارة في الفرض المنزلي أو السلسلة */}
              {effectivePrintScope !== "SUJET_ONLY" && (
              <div data-sync-section="SPEC_TABLE" className="space-y-2.5 avoid-break">
                <h4 className="font-extrabold text-sm text-indigo-950 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>
                    {isDM
                      ? isFr
                        ? `Répartition des chapitres et barème du Devoir Maison (${dmNumber})`
                        : `توزيع الدروس وسلم تنقيط الفرض المنزلي (${dmNumber})`
                      : isFr
                      ? `Chapitres et objectifs ciblés par la Série d'exercices (${dmNumber})`
                      : `الدروس والقدرات المستهدفة في سلسلة التمارين (${dmNumber})`}
                  </span>
                  <span className="text-xs font-bold text-slate-600 tabular-nums">
                    {isDM
                      ? isFr
                        ? `À rendre le : ${dmDueDate}`
                        : `تاريخ الإرجاع: ${dmDueDate}`
                      : isFr
                      ? "Progression ★ / ★★ / ★★★"
                      : "تدرج ★ / ★★ / ★★★"}
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                  {baseDsLessons.map((item, idx) => {
                    const pts = ((item.weight * 20) / 100).toFixed(1);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="font-bold text-slate-900 truncate">
                          {idx + 1}. {isFr ? item.lessonFr : item.lessonAr}
                        </div>
                        <span className="font-mono font-extrabold text-indigo-900 tabular-nums shrink-0">
                          {item.weight}% {isDM ? `· ${pts} pts` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}

              {(isDM ? modelsToRender : (["A"] as Array<"A" | "B">)).map(
                (modelCode, modelIdx) => (
                  <div
                    key={modelCode}
                    className={`space-y-6 pt-4 border-t border-slate-300 ${
                      modelIdx > 0 ? "page-break" : ""
                    }`}
                  >
                    <div data-sync-section="HEADER">
                      {renderDocumentHeader(isDM ? modelCode : undefined)}
                    </div>

                    {/* ترويسة نمط الفرض المنزلي والأهداف التكوينية */}
                    {isDM && !isMission && (
                      <div data-sync-section="SPEC_TABLE" className="avoid-break bg-indigo-50/50 border border-indigo-200/90 rounded-xl p-3.5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-md border font-mono ${
                                MOROCCAN_DM_PRESETS[moroccanDMType]?.badgeColor ||
                                "bg-indigo-100 text-indigo-900 border-indigo-300"
                              }`}
                            >
                              {isFr ? "CADRE PÉDAGOGIQUE DU DEVOIR MAISON" : "الهندسة البيداغوجية للفرض المنزلي"}
                            </span>
                            <h5 className="font-black text-xs text-indigo-950">
                              {isFr
                                ? MOROCCAN_DM_PRESETS[moroccanDMType]?.titleFr || "Devoir Maison"
                                : MOROCCAN_DM_PRESETS[moroccanDMType]?.titleAr || "فرض منزلي"}
                            </h5>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                            <span>
                              ⏱️ {isFr ? "Temps estimé : " : "المدة التقديرية: "}
                              {MOROCCAN_DM_PRESETS[moroccanDMType]?.estimatedHours || "2h30"}
                            </span>
                            <span>·</span>
                            <span className="text-indigo-900 font-mono">
                              📅 {isFr ? "À rendre le : " : "تاريخ الإرجاع: "}
                              {dmDueDate}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {isFr
                            ? MOROCCAN_DM_PRESETS[moroccanDMType]?.descriptionFr
                            : MOROCCAN_DM_PRESETS[moroccanDMType]?.descriptionAr}
                        </p>
                      </div>
                    )}

                    {/* كبسولة ملخص الدرس التذكيري (Fiche Mémo Express) في مقدمة سلسلة التمارين بألوان هادئة وباردة */}
                    {!isDM && includeLessonMemo && baseDsLessons.length > 0 && (() => {
                      const memo = getMoroccanLessonMemo(baseDsLessons[0]);
                      return (
                        <div className="avoid-break border border-slate-300 rounded-xl p-4 bg-slate-50/60 space-y-3 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-900 text-cyan-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black flex items-center gap-1">
                                <span className="font-serif">∫</span>
                                <span>{isFr ? "FICHE MÉMO" : "كبسولة التذكير بالدرس"}</span>
                              </span>
                              <h4 className="font-black text-xs text-slate-950">
                                {isFr
                                  ? `Rappel Essentiel du Cours & Formules Clés : ${memo.lessonTitleFr}`
                                  : `تذكير مركز بالمعارف والخاصيات الأساسية: ${memo.lessonTitleAr}`}
                              </h4>
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                              {isFr ? "Cadre de Référence MEN" : "وفق الأطر المرجعية المغربية"}
                            </span>
                          </div>

                          {/* المفهوم والتعريف المحوري */}
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                            <span className="font-black text-slate-950 ml-1">
                              {isFr ? "📌 Définition & Concept clé : " : "📌 المفهوم والتعريف المحوري: "}
                            </span>
                            <span><MathText text={isFr ? memo.coreDefinitionFr : memo.coreDefinitionAr} /></span>
                          </div>

                          {/* الصيغ والخاصيات الأساسية */}
                          <div className="space-y-1.5">
                            <div className="font-extrabold text-[11.5px] text-slate-900 flex items-center gap-1.5">
                              <span className="font-serif text-cyan-700 font-black">∑</span>
                              <span>
                                {isFr
                                  ? "Formules et propriétés fondamentales à mobiliser :"
                                  : "الصيغ والخاصيات الجوهرية للدرس:"}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              {(isFr ? memo.essentialFormulasFr : memo.essentialFormulasAr).map((f, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 font-mono text-[11px] flex items-center gap-1.5"
                                >
                                  <span className="text-teal-600 font-bold shrink-0">✓</span>
                                  <span className="overflow-x-auto select-text"><MathText text={f} inline /></span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* الهفوات الشائعة وتوجيه المفتش */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                            <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-2.5 space-y-1 text-rose-950">
                              <div className="font-black flex items-center gap-1">
                                <span>⚠️</span>
                                <span>{isFr ? "Erreurs fréquentes à éviter :" : "أخطاء وهفوات شائعة ينبغي تجنبها:"}</span>
                              </div>
                              <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-rose-900">
                                {(isFr ? memo.commonPitfallsFr : memo.commonPitfallsAr).map((p, pIdx) => (
                                  <li key={pIdx}>{p}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-2.5 space-y-1 text-teal-950">
                              <div className="font-black flex items-center gap-1">
                                <span className="font-serif font-black text-teal-700">∂</span>
                                <span>{isFr ? "Conseil de l'Inspecteur Pédagogique :" : "توجيه وتوصية المفتش التربوي:"}</span>
                              </div>
                              <div className="text-[10.5px] text-teal-900 leading-relaxed font-medium">
                                <MathText text={isFr ? memo.inspectorAdviceFr : memo.inspectorAdviceAr} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {effectivePrintScope !== "SPEC_GRID_ONLY" && (
                    <>
                    <div data-sync-section="EXERCISES" className="space-y-6">
                      {!isDM ? (
                        /* نمط سلسلة التمارين (Série TD) : توليد وعرض التمارين بالعدد الذي حدده الأستاذ (serieExerciseCount) */
                        generateCustomCountSerieExercises(baseDsLessons, serieExerciseCount, modelCode).map((block, exIdx) => {
                          const activeQs = isFr ? block.questionsFr : block.questionsAr;
                          const associatedLesson = baseDsLessons[exIdx % Math.max(1, baseDsLessons.length)];
                          const blockCorr = generateSerieBlockCorrection(
                            block,
                            exIdx,
                            associatedLesson,
                            modelCode
                          );
                          const dmGgbResource = getAutoGeoGebraResourceForLesson(
                            associatedLesson,
                            geoGebraResourcesMap,
                            autoAttachGeoGebra
                          );

                          const customTitle = customExerciseTitles[exIdx]?.trim();
                          const defaultTitle = isFr
                            ? (block.badgeFr || `Exercice ${exIdx + 1} : ${associatedLesson.lessonFr}`)
                            : (block.badgeAr || `التمرين ${exIdx + 1} : ${associatedLesson.lessonAr}`);

                          const serieBranchTheme = enableBranchColorGradient
                            ? branchColorMode === "AUTO_BY_LESSON"
                              ? detectLessonBranchTheme(associatedLesson)
                              : resolveBranchColorTheme(branchColorMode, [associatedLesson])
                            : null;

                          return (
                            <div
                              key={exIdx}
                              style={
                                serieBranchTheme
                                  ? { borderColor: serieBranchTheme.borderHex }
                                  : undefined
                              }
                              className={`avoid-break space-y-4 ${effectiveExerciseBoxClass} ${
                                serieBranchTheme ? "branch-themed-card" : ""
                              }`}
                            >
                              <div
                                style={
                                  serieBranchTheme
                                    ? latexPackageTheme === "TCOLORBOX"
                                      ? {
                                          backgroundImage:
                                            serieBranchTheme.vividBannerGradientCss,
                                          borderColor: serieBranchTheme.borderHex,
                                        }
                                      : {
                                          backgroundImage:
                                            serieBranchTheme.headerGradientCss,
                                          borderColor: serieBranchTheme.borderHex,
                                        }
                                    : undefined
                                }
                                className={`${effectiveExerciseHeaderClass} print-exact-color ${
                                  serieBranchTheme
                                    ? latexPackageTheme === "TCOLORBOX"
                                      ? "rounded-lg px-3 py-2 border text-white shadow-2xs"
                                      : "rounded-lg px-2.5 py-1.5 border"
                                    : ""
                                }`}
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <LessonHeaderIconBadge
                                    lesson={associatedLesson}
                                    isDarkHeader={
                                      Boolean(serieBranchTheme) &&
                                      latexPackageTheme === "TCOLORBOX"
                                    }
                                    isFr={isFr}
                                  />
                                  <span className="bg-indigo-950 text-amber-300 text-[11px] font-mono px-2.5 py-0.5 rounded font-black">
                                    {isFr ? `EX ${exIdx + 1}` : `التمرين ${exIdx + 1}`}
                                  </span>
                                  <span
                                    style={
                                      serieBranchTheme
                                        ? latexPackageTheme === "TCOLORBOX"
                                          ? { color: "#ffffff" }
                                          : { color: serieBranchTheme.accentColorHex }
                                        : undefined
                                    }
                                    className={`text-sm font-extrabold ${exerciseTitleCalligraphyClass}`}
                                  >
                                    {customTitle || defaultTitle}
                                  </span>
                                  {serieBranchTheme && (
                                    <span
                                      style={
                                        latexPackageTheme === "TCOLORBOX"
                                          ? undefined
                                          : {
                                              backgroundColor: serieBranchTheme.softBgHex,
                                              color: serieBranchTheme.accentColorHex,
                                              borderColor: serieBranchTheme.borderHex,
                                            }
                                      }
                                      className={
                                        latexPackageTheme === "TCOLORBOX"
                                          ? "text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/15 text-amber-200 border border-white/25"
                                          : "text-[10px] font-extrabold px-2 py-0.5 rounded border"
                                      }
                                    >
                                      {serieBranchTheme.iconSymbol}{" "}
                                      {isFr
                                        ? serieBranchTheme.shortLabelFr
                                        : serieBranchTheme.shortLabelAr}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-amber-400 font-mono tracking-widest text-xs font-black">
                                    {block.stars}
                                  </span>
                                  {block.partPoints && (
                                    <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                      {block.partPoints} {isFr ? "pts" : "ن"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <ol className="list-decimal list-inside space-y-4 text-[13.5px] text-slate-900 leading-[2.15]">
                                {activeQs.map((q, qIdx) => (
                                  <li key={qIdx} className="space-y-2 mb-3">
                                    <span className="font-medium"><MathText text={q} /></span>
                                    {isBi && block.questionsFr[qIdx] && (
                                      <div
                                        dir="ltr"
                                        className="text-left text-slate-600 italic mt-0.5 pl-4 font-normal"
                                      >
                                        <MathText text={block.questionsFr[qIdx]} />
                                      </div>
                                    )}
                                    {includeAnswerWorkspace &&
                                      renderStudentAnswerWorkspace(
                                        qIdx === 0 ? "N1" : qIdx === 1 ? "N2" : "N3",
                                        undefined,
                                        true,
                                        {
                                          questionText: q,
                                          solutionText: isFr
                                            ? blockCorr.solutions[qIdx]?.solutionTextFr
                                            : blockCorr.solutions[qIdx]?.solutionTextAr,
                                          points: blockCorr.solutions[qIdx]?.bareme,
                                          workspaceId: `serie_ex_${exIdx}_q_${qIdx}`,
                                        }
                                      )}
                                  </li>
                                ))}
                              </ol>

                              {includeHints && block.hintAr && (
                                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-indigo-900 italic font-medium flex items-center gap-1.5 bg-indigo-50/50 p-2 rounded-lg">
                                  <span>💡</span>
                                  <span>{isFr ? block.hintFr : block.hintAr}</span>
                                </div>
                              )}

                              {dmGgbResource && (
                                <GeoGebraFigureCard
                                  resource={dmGgbResource}
                                  lesson={associatedLesson}
                                  exerciseNumber={exIdx + 1}
                                  isFr={isFr}
                                  isBi={isBi}
                                  onResourceUpdated={(updated) =>
                                    onUpdateGeoGebraResource?.(
                                      associatedLesson.lessonFr || `${associatedLesson.weight}-${exIdx}`,
                                      updated
                                    )
                                  }
                                />
                              )}

                              {/* الأشكال الهندسية والرسوم التوضيحية المندرجة في تمرين السلسلة */}
                              {insertedFigures
                                .filter(
                                  (f) =>
                                    f.exerciseId === `serie_ex_${exIdx}` ||
                                    f.exerciseId === `ex_${exIdx}` ||
                                    f.exerciseId === associatedLesson.lessonFr
                                )
                                .map((fig) => (
                                  <InsertedFigureCard
                                    key={fig.id}
                                    figure={fig}
                                    isInlineEditable={isInlineEditable}
                                    isFr={isFr}
                                    onUpdateFigure={onUpdateFigure}
                                    onDeleteFigure={onDeleteFigure}
                                  />
                                ))}

                              {renderExerciseFigureDropZone(`serie_ex_${exIdx}`)}

                              {includeDetailedSolutions &&
                                solutionDisplayMode === "INLINE_PER_EXERCISE" &&
                                renderDetailedCorrectionCard(blockCorr, true)}
                            </div>
                          );
                        })
                      ) : (
                        /* نمط الفرض المنزلي (Devoir Maison) : تنظيم بيداغوجي شامل يربط الدروس بمسائل توليفية */
                        baseDsLessons.map((lesson, idx) => {
                          const exPoints = ((lesson.weight * 20) / 100).toFixed(1);
                          const blocks = getSerieAndDMExercises(
                            lesson,
                            dmSubType,
                            modelCode
                          );
                          const dmGgbResource = getAutoGeoGebraResourceForLesson(
                            lesson,
                            geoGebraResourcesMap,
                            autoAttachGeoGebra
                          );

                          const dmBranchTheme = enableBranchColorGradient
                            ? branchColorMode === "AUTO_BY_LESSON"
                              ? detectLessonBranchTheme(lesson)
                              : resolveBranchColorTheme(branchColorMode, [lesson])
                            : null;

                          return (
                            <div
                              key={idx}
                              style={
                                dmBranchTheme
                                  ? { borderColor: dmBranchTheme.borderHex }
                                  : undefined
                              }
                              className={`avoid-break space-y-4 ${effectiveExerciseBoxClass} ${
                                dmBranchTheme ? "branch-themed-card" : ""
                              }`}
                            >
                              <div
                                style={
                                  dmBranchTheme
                                    ? latexPackageTheme === "TCOLORBOX"
                                      ? {
                                          backgroundImage:
                                            dmBranchTheme.vividBannerGradientCss,
                                          borderColor: dmBranchTheme.borderHex,
                                        }
                                      : {
                                          backgroundImage:
                                            dmBranchTheme.headerGradientCss,
                                          borderColor: dmBranchTheme.borderHex,
                                        }
                                    : undefined
                                }
                                className={`${effectiveExerciseHeaderClass} print-exact-color ${
                                  dmBranchTheme
                                    ? latexPackageTheme === "TCOLORBOX"
                                      ? "rounded-lg px-3 py-2 border text-white shadow-2xs"
                                      : "rounded-lg px-2.5 py-1.5 border"
                                    : ""
                                }`}
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <LessonHeaderIconBadge
                                    lesson={lesson}
                                    isDarkHeader={
                                      Boolean(dmBranchTheme) &&
                                      latexPackageTheme === "TCOLORBOX"
                                    }
                                    isFr={isFr}
                                  />
                                  {dmBranchTheme && !resolveLessonHeaderIcon(lesson) && (
                                    <span className="w-6 h-6 rounded-md bg-white/20 text-amber-200 border border-white/30 inline-flex items-center justify-center font-serif text-xs font-black">
                                      {dmBranchTheme.iconSymbol}
                                    </span>
                                  )}
                                  <span
                                    style={
                                      dmBranchTheme
                                        ? latexPackageTheme === "TCOLORBOX"
                                          ? { color: "#ffffff" }
                                          : { color: dmBranchTheme.accentColorHex }
                                        : undefined
                                    }
                                    className={exerciseTitleCalligraphyClass}
                                  >
                                    {customExerciseTitles[idx]?.trim()
                                      ? customExerciseTitles[idx].trim()
                                      : isFr
                                      ? `Problème ${idx + 1} : ${lesson.lessonFr}`
                                      : `التمرين التوليفي ${idx + 1} : ${lesson.lessonAr}`}
                                  </span>
                                  {dmBranchTheme && (
                                    <span
                                      style={
                                        latexPackageTheme === "TCOLORBOX"
                                          ? undefined
                                          : {
                                              backgroundColor: dmBranchTheme.softBgHex,
                                              color: dmBranchTheme.accentColorHex,
                                              borderColor: dmBranchTheme.borderHex,
                                            }
                                      }
                                      className={
                                        latexPackageTheme === "TCOLORBOX"
                                          ? "text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/15 text-amber-200 border border-white/25"
                                          : "text-[10px] font-extrabold px-2 py-0.5 rounded border"
                                      }
                                    >
                                      {isFr
                                        ? dmBranchTheme.branchBadgeFr
                                        : dmBranchTheme.branchBadgeAr}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-md tabular-nums text-xs">
                                  {exPoints} {isFr ? "points" : "نقط"} ({lesson.weight}%)
                                </span>
                              </div>

                              <div className="space-y-4">
                                {blocks.map((block, bIdx) => {
                                  const activeQs = isFr
                                    ? block.questionsFr
                                    : block.questionsAr;
                                  const blockCorr = generateSerieBlockCorrection(
                                    block,
                                    bIdx,
                                    lesson,
                                    modelCode
                                  );

                                  return (
                                    <div
                                      key={bIdx}
                                      className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/90 space-y-2"
                                    >
                                      <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 border-b border-slate-200/70 pb-1.5">
                                        <span>
                                          {isFr ? block.badgeFr : block.badgeAr}
                                        </span>
                                        <span className="text-amber-600 font-mono tracking-widest">
                                          {block.stars}
                                        </span>
                                      </div>

                                      <ol className="list-decimal list-inside space-y-2 text-xs text-slate-800 leading-relaxed">
                                        {activeQs.map((q, qIdx) => (
                                          <li key={qIdx} className="space-y-1">
                                            <span><MathText text={q} /></span>
                                            {isBi && block.questionsFr[qIdx] && (
                                              <div
                                                dir="ltr"
                                                className="text-left text-slate-600 italic mt-0.5 pl-4"
                                              >
                                                <MathText text={block.questionsFr[qIdx]} />
                                              </div>
                                            )}
                                            {includeAnswerWorkspace &&
                                              renderStudentAnswerWorkspace(
                                                qIdx === 0 ? "N1" : qIdx === 1 ? "N2" : "N3",
                                                undefined,
                                                true,
                                                {
                                                  questionText: q,
                                                  solutionText: isFr
                                                    ? blockCorr.solutions[qIdx]?.solutionTextFr
                                                    : blockCorr.solutions[qIdx]?.solutionTextAr,
                                                  points: blockCorr.solutions[qIdx]?.bareme,
                                                  workspaceId: `dm_ex_${idx}_b_${bIdx}_q_${qIdx}`,
                                                }
                                              )}
                                          </li>
                                        ))}
                                      </ol>

                                      {includeHints && (
                                        <div className="pt-1.5 border-t border-slate-200/80 text-[11px] text-indigo-900 italic font-medium">
                                          💡 {isFr ? block.hintFr : block.hintAr}
                                        </div>
                                      )}

                                      {includeDetailedSolutions &&
                                        solutionDisplayMode === "INLINE_PER_EXERCISE" &&
                                        renderDetailedCorrectionCard(blockCorr, true)}
                                    </div>
                                  );
                                })}
                              </div>

                              {dmGgbResource && (
                                <GeoGebraFigureCard
                                  resource={dmGgbResource}
                                  lesson={lesson}
                                  exerciseNumber={idx + 1}
                                  isFr={isFr}
                                  isBi={isBi}
                                  onResourceUpdated={(updated) =>
                                    onUpdateGeoGebraResource?.(
                                      lesson.lessonFr || `${lesson.weight}-${idx}`,
                                      updated
                                    )
                                  }
                                />
                              )}

                              {/* الأشكال الهندسية والرسوم التوضيحية المندرجة في الفرض المنزلي */}
                              {insertedFigures
                                .filter(
                                  (f) =>
                                    f.exerciseId === `dm_${idx}` ||
                                    f.exerciseId === lesson.lessonFr
                                )
                                .map((fig) => (
                                  <InsertedFigureCard
                                    key={fig.id}
                                    figure={fig}
                                    isInlineEditable={isInlineEditable}
                                    isFr={isFr}
                                    onUpdateFigure={onUpdateFigure}
                                    onDeleteFigure={onDeleteFigure}
                                  />
                                ))}

                              {renderExerciseFigureDropZone(`dm_${idx}`)}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* شبكة التقويم الذاتي للمتعلم وبطاقة تسليم الفرض المنزلي (تطوير إنتاج الفروض المنزلية) */}
                    {includeSelfEvalGrid && (
                      <div className="avoid-break border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <h5 className="font-extrabold text-xs text-indigo-950">
                            {isDM
                              ? isFr
                                ? "Grille d'Auto-Évaluation de l'Élève & Coupon de Remise du Devoir Maison"
                                : "شبكة التقويم الذاتي للتلميذ وبطاقة تتبع وتسليم الفرض المنزلي"
                              : isFr
                              ? "Bilan d'Auto-Positionnement par Compétences (Série TD)"
                              : "شبكة التقويم الذاتي لتتبع التحكم في قدرات السلسلة"}
                          </h5>
                          <span className="text-[11px] font-mono font-bold text-slate-600 tabular-nums">
                            {isDM
                              ? isFr
                                ? `Date limite : ${dmDueDate}`
                                : `آخر أجل للإرجاع: ${dmDueDate}`
                              : "Auto-Diagnostic"}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-slate-300 text-[11px] bg-white">
                            <thead>
                              <tr className="bg-slate-100 text-slate-900">
                                <th className="border border-slate-300 p-1.5 text-start">
                                  {isFr
                                    ? "Capacité / Compétence mathématique ciblée"
                                    : "القدرة الرياضياتية المستهدفة في الفرض المنزلي"}
                                </th>
                                <th className="border border-slate-300 p-1.5 text-center w-24">
                                  {isFr ? "Acquis (A)" : "متحكم (أ)"}
                                </th>
                                <th className="border border-slate-300 p-1.5 text-center w-28">
                                  {isFr ? "En cours (EC)" : "في طور التحكم"}
                                </th>
                                <th className="border border-slate-300 p-1.5 text-center w-24">
                                  {isFr ? "Non acquis" : "يحتاج لدعم"}
                                </th>
                                {isDM && (
                                  <th className="border border-slate-300 p-1.5 text-center w-24">
                                    {isFr ? "Note Prof." : "نقطة الأستاذ"}
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {baseDsLessons.map((l, lIdx) => {
                                const pts = ((l.weight * 20) / 100).toFixed(1);
                                const cap = isFr
                                  ? l.capacitiesFr[0] || l.lessonFr
                                  : l.capacitiesAr[0] || l.lessonAr;
                                return (
                                  <tr key={lIdx}>
                                    <td className="border border-slate-300 p-1.5 font-medium text-slate-800">
                                      <span className="font-bold text-slate-950">
                                        {lIdx + 1}. {isFr ? l.lessonFr : l.lessonAr} :
                                      </span>{" "}
                                      {cap}
                                    </td>
                                    <td className="border border-slate-300 p-1.5 text-center font-mono text-slate-400">
                                      [ &nbsp; ]
                                    </td>
                                    <td className="border border-slate-300 p-1.5 text-center font-mono text-slate-400">
                                      [ &nbsp; ]
                                    </td>
                                    <td className="border border-slate-300 p-1.5 text-center font-mono text-slate-400">
                                      [ &nbsp; ]
                                    </td>
                                    {isDM && (
                                      <td className="border border-slate-300 p-1.5 text-center font-mono font-bold tabular-nums text-indigo-950">
                                        .... / {pts}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {isDM && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-700 font-semibold">
                            <div>
                              {isFr
                                ? "Engagement d'intégrité (Travail personnel) : [  ] Oui"
                                : "التزام العمل الشخصي والأمانة العلمية: [  ] نعم"}
                            </div>
                            <div>
                              {isFr
                                ? "Difficultés rencontrées : ........................................"
                                : "الصعوبات المصادفة أثناء الإنجاز: ............................"}
                            </div>
                            <div className="text-end">
                              {isFr
                                ? "Visa du Professeur / Parents : ...................."
                                : "توقيع الأستاذ / ولي الأمر: ...................."}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ميثاق الفرض المنزلي وعقد الالتزام بالعمل الذاتي والتكويني */}
                    {includeDMContract && isDM && (
                      <div className="avoid-break border border-slate-300 rounded-xl p-4 bg-white space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <h5 className="font-black text-xs text-indigo-950 flex items-center gap-1.5">
                            <span>📜</span>
                            <span>
                              {isFr
                                ? "Charte d'Engagement & Contrat de Travail Personnel à Domicile"
                                : "ميثاق الفرض المنزلي وعقد الالتزام بالعمل الذاتي"}
                            </span>
                          </h5>
                          <span className="text-[10.5px] text-slate-500 font-mono">
                            {isFr
                              ? "Orientations Pédagogiques & Critères Formatifs"
                              : "التوجيهات التربوية الرسمية ومعايير التقويم التكويني"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                            <div className="font-bold text-slate-900">
                              1. {isFr ? "Rigueur & Rédaction" : "جودة التحرير والتنظيم"}
                            </div>
                            <p className="text-[10.5px] text-slate-600 leading-relaxed">
                              {isFr
                                ? "Soigner la clarté des raisonnements, encadrer les résultats et numéroter rigoureusement chaque question."
                                : "احترام تسلسل الأسئلة وتأطير النتائج النهائية والكتابة بخط واضح مقروء وتجنب التشطيب."}
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                            <div className="font-bold text-slate-900">
                              2. {isFr ? "Autonomie & Recherche" : "البحث والتكوين الذاتي"}
                            </div>
                            <p className="text-[10.5px] text-slate-600 leading-relaxed">
                              {isFr
                                ? "Exploiter les ressources officielles, GeoGebra et formuler des démarches déductives personnelles."
                                : "توظيف الكتاب المدرسي والبرمجيات التفاعلية للتحقق من التخمينات قبل صياغة البرهان الجبري."}
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                            <div className="font-bold text-slate-900">
                              3. {isFr ? "Feedback Formatif de l'Enseignant" : "الملاحظات التكوينية وتوجيه الأستاذ"}
                            </div>
                            <div className="h-10 border-b border-dotted border-slate-300 text-[10px] text-slate-400 italic flex items-end">
                              {isFr
                                ? "Points forts constatés & pistes de remédiation..."
                                : "المكتسبات المتحكم فيها ومجالات المعالجة والدعم..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    </>
                    )}
                  </div>
                )
              )}
            </>
          )}

          {effectivePrintScope !== "SUJET_ONLY" &&
            effectivePrintScope !== "SPEC_GRID_ONLY" &&
            (showAnswerKey || effectivePrintScope === "SOLUTIONS_ONLY") && (
              <div data-sync-section="SOLUTIONS" className="avoid-break space-y-3 pt-4 border-t-2 border-dashed border-slate-300">
                <h4 className="font-extrabold text-sm text-emerald-950">
                  {isFr
                    ? "Éléments de correction et pistes de résolution détaillée"
                    : "عناصر الإجابة وتوجيهات الحل المفصل"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {baseDsLessons.map((lesson, idx) => {
                    const exPoints = ((lesson.weight * 20) / 100).toFixed(1);
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1"
                      >
                        <div className="font-bold text-emerald-950 flex justify-between">
                          <span>
                            {isFr
                              ? `Corrigé — ${lesson.lessonFr}`
                              : `تصحيح — ${lesson.lessonAr}`}
                          </span>
                          <span className="font-mono font-bold tabular-nums">
                            {isDM ? `${exPoints} pts` : `${lesson.weight}%`}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {isFr
                            ? `Validation des étapes clés sur « ${lesson.capacitiesFr[0]} » et rédaction rigoureuse des justifications.`
                            : `التحقق من المراحل الاستدلالية الأساسية حول « ${lesson.capacitiesAr[0]} » وسلامة التحرير الرياضي.`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* ملحق عناصر الإجابة للـ DM وسلاسل التمارين في صفحة منفصلة */}
          {effectivePrintScope !== "SUJET_ONLY" &&
            effectivePrintScope !== "SPEC_GRID_ONLY" &&
            (includeDetailedSolutions || onlyPrintSolutions || effectivePrintScope === "SOLUTIONS_ONLY") &&
            (solutionDisplayMode === "SEPARATE_PAGE_ANNEXES" || onlyPrintSolutions || effectivePrintScope === "SOLUTIONS_ONLY") && (
              <div data-sync-section="SOLUTIONS" className="space-y-6">
                {modelsToRender.map((m) => (
                  <React.Fragment key={`dm-annex-${m}`}>
                    {renderDMSerieAnnexesPage(m)}
                  </React.Fragment>
                ))}
              </div>
            )}

          {/* شبكة التقويم والتفريغ المخصصة للفرض المنزلي */}
          {includeCustomEvalGridSheet && !onlyPrintSolutions && effectivePrintScope !== "SUJET_ONLY" && renderCustomEvaluationGridSheet()}
        </div>
      )}

      {/* 3. محتوى الجذاذة التربوية الشاملة: السيناريو البيداغوجي الكامل ومحتوى الدرس وفق التوجيهات الرسمية */}
      {!onlyPrintEvalGrid && activeModule === "FICHE_OP2007" && (() => {
        const fiche = generateFullMoroccanPedagogicalFiche(ficheLesson, track);

        return (
          <div className="space-y-6 text-xs md:text-sm">
            <div data-sync-section="HEADER">
              {renderDocumentHeader()}
            </div>

            {/* بطاقة التوصيف والترويسة البيداغوجية الرسمية للجذاذة */}
            {effectivePrintScope !== "SOLUTIONS_ONLY" && (
            <>
            <div data-sync-section="SPEC_TABLE" className="avoid-break bg-slate-900 text-white rounded-2xl p-4 md:p-5 border border-cyan-900/50 space-y-3.5 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-teal-500 text-slate-950 flex items-center justify-center font-serif text-base font-black shadow-sm">
                    ∂
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase">
                      {isMission
                        ? "FICHE DE SÉQUENCE PÉDAGOGIQUE & INGÉNIERIE DIDACTIQUE (BOEN / AEFE)"
                        : isFr
                        ? "FICHE PÉDAGOGIQUE OFFICIELLE & SCÉNARIO DIDACTIQUE COMPLET"
                        : "الجذاذة التربوية الرسمية والسيناريو الديداكتيكي المتكامل للدرس"}
                    </span>
                    <h3 className="text-base md:text-lg font-black text-white">
                      {isFr ? fiche.lessonTitleFr : `${fiche.lessonTitleAr} (${fiche.lessonTitleFr})`}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-cyan-300">
                    {isFr ? fiche.trackLabelFr : fiche.trackLabelAr} ({fiche.trackCode})
                  </div>
                  <div className="text-[10.5px] font-mono text-slate-400">
                    {isMission
                      ? "Lycée Français (AEFE / OSUI)"
                      : isFr
                      ? "Cycle Secondaire Qualifiant"
                      : "السلك الثانوي التأهيلي"}{" "}
                    · {sem === "S1" ? (isFr ? "Semestre 1" : "الدورة الأولى") : (isFr ? "Semestre 2" : "الدورة الثانية")}
                  </div>
                </div>
              </div>

              {/* شبكة توزيع الغلاف الزمني والحصص الديداكتيكية للدرس */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="font-serif text-cyan-400">⏱</span>
                    <span>{isFr ? "Distribution horaire officielle des séances :" : "التوزيع الزمني الديداكتيكي للحصص (الغلاف الإجمالي: " + fiche.hoursGlobal + "):"}</span>
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{fiche.hoursGlobal}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10.5px]">
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/80">
                    <div className="text-slate-400 text-[10px]">{isFr ? "Activités d'intro" : "الأنشطة الاستكشافية"}</div>
                    <div className="font-mono font-bold text-cyan-300">{fiche.sessionsDistribution.activitiesHours}</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/80">
                    <div className="text-slate-400 text-[10px]">{isFr ? "Cours & Notions" : "مأسسة وبناء الدرس"}</div>
                    <div className="font-mono font-bold text-teal-300">{fiche.sessionsDistribution.courseHours}</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/80">
                    <div className="text-slate-400 text-[10px]">{isFr ? "Exercices & Méthodes" : "الترييض وبناء الطرائق"}</div>
                    <div className="font-mono font-bold text-sky-300">{fiche.sessionsDistribution.exercisesHours}</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/80">
                    <div className="text-slate-400 text-[10px]">{isFr ? "TICE & Python" : "إدماج TICE والبايثون"}</div>
                    <div className="font-mono font-bold text-emerald-300">{fiche.sessionsDistribution.ticeHours}</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/80 col-span-2 sm:col-span-1">
                    <div className="text-slate-400 text-[10px]">{isFr ? "Éval & Soutien" : "التقويم التكويني والدعم"}</div>
                    <div className="font-mono font-bold text-cyan-200">{fiche.sessionsDistribution.evalRemediationHours}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* الكفايات والقدرات والمكتسبات القبلية والامتدادات الرسمية (OP 2007) */}
            <div className="avoid-break grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* الكفايات المستهدفة */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 font-black text-xs text-slate-950 border-b border-slate-200 pb-1.5">
                  <span className="text-cyan-700 font-serif font-black">1.</span>
                  <span>{isFr ? "Compétences mathématiques visées" : "الكفايات الرياضية المستهدفة"}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 font-medium">
                  {(isFr ? fiche.targetCompetenciesFr : fiche.targetCompetenciesAr).map((comp, idx) => (
                    <li key={idx} className="leading-relaxed">{comp}</li>
                  ))}
                </ul>
              </div>

              {/* القدرات والمهارات المنتظرة الرسمية */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 font-black text-xs text-slate-950 border-b border-slate-200 pb-1.5">
                  <span className="text-teal-700 font-serif font-black">2.</span>
                  <span>
                    {isMission
                      ? "Capacités & Attendus du Programme (BOEN)"
                      : isFr
                      ? "Capacités & Habiletés attendues (OP 2007)"
                      : "القدرات والمهارات المنتظرة (التوجيهات 2007)"}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 font-medium">
                  {(isFr ? fiche.expectedCapacitiesFr : fiche.expectedCapacitiesAr).map((cap, idx) => (
                    <li key={idx} className="leading-relaxed">{cap}</li>
                  ))}
                </ul>
              </div>

              {/* المكتسبات القبلية والامتدادات */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 font-black text-xs text-slate-950 border-b border-slate-200 pb-1.5">
                  <span className="text-sky-700 font-serif font-black">3.</span>
                  <span>{isFr ? "Prérequis & Prolongements" : "المكتسبات القبلية والامتدادات"}</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">{isFr ? "Prérequis :" : "المكتسبات القبلية:"}</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {(isFr ? fiche.prerequisitesFr : fiche.prerequisitesAr).slice(0, 3).map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">{isFr ? "Prolongements :" : "الامتدادات والآفاق:"}</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {(isFr ? fiche.extensionsFr : fiche.extensionsAr).slice(0, 2).map((ext, idx) => (
                        <li key={idx}>{ext}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* الدعامات الديداكتيكية والمراجع الرسمية المعتمدة */}
            <div className="avoid-break bg-slate-50 border border-slate-300 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  🛠 {isFr ? "Supports et matériel didactique :" : "الوسائل والدعامات الديداكتيكية المعتمدة:"}
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {(isFr ? fiche.didacticToolsFr : fiche.didacticToolsAr).join(" · ")}
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  📚 {isFr ? "Références officielles & bibliographie :" : "المراجع التربوية والوثائق الرسمية المؤطرة:"}
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {(isFr ? fiche.pedagogicalReferencesFr : fiche.pedagogicalReferencesAr).join(" · ")}
                </p>
              </div>
            </div>

            {/* مصفوفة التخطيط الزمني الشامل لحصص الدرس (Grille de Planification Globale) */}
            {includeFichePlanningMatrix && fiche.globalPlanningSessions && fiche.globalPlanningSessions.length > 0 && (
              <div className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-cyan-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                      📅 {isFr ? "PLANIFICATION GLOBALE" : "مصفوفة التخطيط"}
                    </span>
                    <h4 className="font-black text-sm text-slate-950">
                      {isFr ? "Planification Globale et Répartition des Séances du Cours" : "مصفوفة التخطيط الزمني العام وتوزيع حصص الدرس"}
                    </h4>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-500 font-bold">
                    {fiche.globalPlanningSessions.length} {isFr ? "séances prévues" : "حصص ديداكتيكية"}
                  </span>
                </div>

                <div className="overflow-x-auto studio-scroll border border-slate-200 rounded-xl">
                  <table className="w-full text-right text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-black border-b border-slate-800 text-[10.5px]">
                        <th className="p-2 border-l border-slate-800 whitespace-nowrap">{isFr ? "Séance" : "الحصة"}</th>
                        <th className="p-2 border-l border-slate-800">{isFr ? "Thème & Objectif de la séance" : "موضوع وهدف الحصة"}</th>
                        <th className="p-2 border-l border-slate-800 whitespace-nowrap">{isFr ? "Nature" : "طبيعة الحصة"}</th>
                        <th className="p-2 border-l border-slate-800 whitespace-nowrap">{isFr ? "Durée" : "الغلاف"}</th>
                        <th className="p-2">{isFr ? "Notions clés & Capacités" : "المفاهيم المحورية والقدرات"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {fiche.globalPlanningSessions.map((plan) => (
                        <tr key={plan.sessionNumber} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2 font-mono font-bold text-cyan-900 bg-slate-50/60 border-l border-slate-200 text-center whitespace-nowrap">
                            #{plan.sessionNumber}
                          </td>
                          <td className="p-2 border-l border-slate-200 font-bold text-slate-900">
                            {isFr ? plan.themeFr : plan.themeAr}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                              {isFr ? plan.sessionTypeFr : plan.sessionTypeAr}
                            </span>
                          </td>
                          <td className="p-2 border-l border-slate-200 font-mono text-cyan-800 font-bold text-center whitespace-nowrap">
                            {plan.allocatedHours}
                          </td>
                          <td className="p-2 text-slate-600 text-[10.5px] leading-relaxed">
                            {isFr ? plan.keyConceptsFr : plan.keyConceptsAr}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            </>
            )}

            {/* 1. المحطة الأولى: الوضعية الانطلاقية والنشاط البنائي الاستكشافي */}
            {effectivePrintScope !== "SPEC_GRID_ONLY" && effectivePrintScope !== "SOLUTIONS_ONLY" && (
            <div className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-cyan-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                    {isFr ? "ÉTAPE 1" : "المحطة الأولى"}
                  </span>
                  <h4 className="font-black text-sm text-slate-950">
                    {isFr ? fiche.introductoryActivity.titleFr : fiche.introductoryActivity.titleAr}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                  ⏱ {fiche.sessionsDistribution.activitiesHours}
                </span>
              </div>

              {/* سياق المسألة ونص النشاط */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs">
                <div className="font-bold text-slate-900">
                  📌 {isFr ? "Situation-problème & Contexte mathématique :" : "سياق المسألة ونص النشاط البنائي:"}
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  <MathText text={isFr ? fiche.introductoryActivity.problemContextFr : fiche.introductoryActivity.problemContextAr} />
                </p>
                <div className="space-y-1.5 pt-1.5 border-t border-slate-200/80">
                  {(isFr ? fiche.introductoryActivity.questionsFr : fiche.introductoryActivity.questionsAr).map((q, qIdx) => (
                    <div key={qIdx} className="text-slate-800 text-[11.5px] bg-white p-2 rounded-lg border border-slate-200 font-semibold">
                      <MathText text={q} />
                    </div>
                  ))}
                </div>
              </div>

              {/* التخمينات المنتظرة والعوائق الإبستمولوجية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-3 space-y-1 text-cyan-950">
                  <span className="font-bold block">💡 {isFr ? "Conjectures attendues des élèves :" : "التخمينات والفرضيات المنتظرة من المتعلمين:"}</span>
                  <ul className="list-disc list-inside space-y-0.5 text-cyan-900">
                    {(isFr ? fiche.introductoryActivity.expectedConjecturesFr : fiche.introductoryActivity.expectedConjecturesAr).map((c, cIdx) => (
                      <li key={cIdx}><MathText text={c} inline /></li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-1 text-rose-950">
                  <span className="font-bold block">⚠️ {isFr ? "Obstacles épistémologiques et didactiques :" : "العوائق الإبستمولوجية والتمثلات الشائعة:"}</span>
                  <p className="text-rose-900 leading-relaxed">
                    <MathText text={isFr ? fiche.introductoryActivity.epistemologicalObstaclesFr : fiche.introductoryActivity.epistemologicalObstaclesAr} />
                  </p>
                </div>
              </div>
            </div>
            )}

            {/* 2. المحطة الثانية: محتوى الدرس كامل مع التعاريف، المبرهنات، البراهين التأسيسية، والأمثلة المحلولة */}
            {effectivePrintScope !== "SPEC_GRID_ONLY" && (
            <div data-sync-section="EXERCISES" className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-teal-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                    {isFr ? "ÉTAPE 2" : "المحطة الثانية"}
                  </span>
                  <h4 className="font-black text-sm text-slate-950">
                    {isFr ? "Contenu Intégral du Cours & Formalisation Théorique" : "محتوى الدرس الكامل: التعاريف، المبرهنات مع البراهين، والأمثلة المحلولة خطوة بخطوة"}
                  </h4>
                </div>
                <span className="text-[10.5px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded font-bold">
                  {isFr ? "Théorie & Démonstrations" : "المتن النظري والبراهين"}
                </span>
              </div>

              {fiche.fullCourseContent.map((sec) => (
                <div key={sec.sectionNum} className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-200 pb-2">
                    <h5 className="font-black text-xs md:text-sm text-slate-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-xs">
                        {sec.sectionNum}
                      </span>
                      <span>{isFr ? sec.titleFr : sec.titleAr}</span>
                    </h5>
                    {(sec.axisSummaryAr || sec.axisSummaryFr) && (
                      <p className="text-[11px] text-slate-500 font-medium mt-1 mr-8">
                        {isFr ? sec.axisSummaryFr : sec.axisSummaryAr}
                      </p>
                    )}
                  </div>

                  {/* التعاريف الرياضية */}
                  {sec.definitions.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-extrabold text-[11px] text-teal-950 uppercase tracking-wide block">
                        {isFr ? "Définitions formelles :" : "التعاريف الرياضية المؤسسة:"}
                      </span>
                      {sec.definitions.map((def, dIdx) => (
                        <div key={dIdx} className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200/90 space-y-1.5 text-xs">
                          <div className="font-black text-teal-950 flex items-center gap-1.5">
                            <span className="font-serif text-teal-700">📖</span>
                            <span>{isFr ? def.termFr : def.termAr}</span>
                          </div>
                          <div className="text-slate-800 leading-relaxed font-medium">
                            <MathText text={isFr ? def.contentFr : def.contentAr} />
                          </div>
                          {def.notationMath && (
                            <div className="pt-1 font-mono text-center text-teal-900 font-bold bg-white/90 p-2 rounded-lg border border-teal-200 text-[11.5px] select-all">
                              <MathText text={def.notationMath} inline />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* المبرهنات والقواعد والخاصيات الأساسية مع البراهين */}
                  {sec.theorems.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wide block">
                        {isFr ? "Théorèmes officiels et démonstrations au programme :" : "المبرهنات والخاصيات الجوهرية والبراهين التأسيسية المقررة:"}
                      </span>
                      {sec.theorems.map((theo, tIdx) => (
                        <div key={tIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 space-y-2.5 text-xs">
                          <div className="font-black text-slate-950 flex items-center justify-between border-b border-slate-200 pb-1.5">
                            <span className="flex items-center gap-1.5">
                              <span className="text-cyan-700 font-serif">⚡</span>
                              <span>{isFr ? theo.nameFr : theo.nameAr}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                              {isFr ? "Théorème officiel" : "مبرهنة رسمية"}
                            </span>
                          </div>
                          <div className="text-slate-900 leading-relaxed font-semibold">
                            <MathText text={isFr ? theo.statementFr : theo.statementAr} />
                          </div>
                          {theo.conditionsAr && theo.conditionsAr.length > 0 && (
                            <div className="text-[10.5px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                              <span className="font-bold text-slate-900 block">
                                🔍 {isFr ? "Conditions préalables d'application (Hypothèses) :" : "شروط وفرضيات التطبيق الضرورية:"}
                              </span>
                              <ul className="list-disc list-inside space-y-0.5">
                                {(isFr ? theo.conditionsFr : theo.conditionsAr)?.map((cond, cIdx) => (
                                  <li key={cIdx}><MathText text={cond} inline /></li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* عناصر البرهان التأسيسي المقررة رسمياً */}
                          {(theo.proofAr || theo.proofFr) && ficheContentDetailLevel !== "SYNTHETIC_OFFICIAL" && (
                            <div className="text-[10.5px] text-slate-800 bg-cyan-50/40 p-2.5 rounded-lg border border-cyan-200/80 leading-relaxed space-y-1">
                              <span className="font-bold text-cyan-950 flex items-center gap-1">
                                <span>✍️</span>
                                <span>{isFr ? "Démonstration formelle (au programme) :" : "البرهان التأسيسي المقابل (مقرر رسمياً):"}</span>
                              </span>
                              <div className="font-medium text-slate-700">
                                <MathText text={isFr ? theo.proofFr : theo.proofAr} />
                              </div>
                            </div>
                          )}

                          {/* النتيجة المباشرة للمبرهنة إن وجدت */}
                          {(theo.corollaryAr || theo.corollaryFr) && (
                            <div className="text-[10.5px] text-teal-900 bg-teal-50/60 p-2 rounded-lg border border-teal-200">
                              <span className="font-bold">{isFr ? "Corollaire direct :" : "نتيجة مباشرة:"} </span>
                              <span><MathText text={isFr ? theo.corollaryFr : theo.corollaryAr} /></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* الأمثلة التطبيقية المحلولة خطوة بخطوة */}
                  {sec.solvedExamples.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-extrabold text-[11px] text-cyan-950 uppercase tracking-wide block">
                        {isFr ? "Exemples d'application résolus pas à pas :" : "أمثلة تطبيقية نموذجية محلولة خطوة بخطوة:"}
                      </span>
                      {sec.solvedExamples.map((ex, eIdx) => (
                        <div key={eIdx} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 text-xs shadow-2xs">
                          <div className="font-black text-slate-950 flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <span className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono">
                                {ex.difficultyLevel || "N1"}
                              </span>
                              <span>{isFr ? ex.titleFr : ex.titleAr}</span>
                            </span>
                            <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                              {isFr ? "Méthode pas à pas" : "خطوات الحل"}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-medium text-slate-800">
                            <MathText text={isFr ? ex.statementFr : ex.statementAr} />
                          </div>
                          <div className="space-y-1 text-[11.5px]">
                            <span className="font-bold text-slate-900 block">{isFr ? "Démarche de résolution :" : "مسار الحل والاستدلال الديداكتيكي:"}</span>
                            {(isFr ? ex.solutionStepsFr : ex.solutionStepsAr).map((step, sIdx) => (
                              <div key={sIdx} className="text-slate-700 leading-relaxed font-mono text-[11px] bg-slate-50/50 p-1.5 rounded border border-slate-100">
                                <MathText text={step} />
                              </div>
                            ))}
                          </div>
                          <div className="text-[10.5px] text-teal-950 bg-teal-50/80 p-2 rounded-lg border border-teal-200 font-medium">
                            🧑‍🏫 <strong>{isFr ? "Conseil de l'enseignant :" : "توجيه تربوي للمدرس:"}</strong>{" "}
                            {isFr ? ex.pedagogicalNoteFr : ex.pedagogicalNoteAr}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* الأخطاء الشائعة والمنزلقات الواجب تفاديها */}
                  {sec.commonMistakesAr && sec.commonMistakesAr.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-[11px] space-y-1 text-amber-950">
                      <span className="font-bold block flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{isFr ? "Erreurs courantes des élèves & Pièges à éviter :" : "الأخطاء الشائعة لدى المتعلمين والمنزلقات الواجب تفاديها:"}</span>
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-amber-900 font-medium">
                        {(isFr ? sec.commonMistakesFr : sec.commonMistakesAr)?.map((mistake, mIdx) => (
                          <li key={mIdx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {/* كبسولة جدول الصيغ والقواعد الرسمية المركزة */}
              {fiche.officialFormulasSummary && fiche.officialFormulasSummary.length > 0 && (
                <div className="avoid-break bg-slate-900 text-white rounded-2xl p-4 md:p-5 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-cyan-400 font-black text-base">∑</span>
                      <h5 className="font-black text-xs md:text-sm text-cyan-300">
                        {isFr ? "Formulaire de Synthèse des Relations et Formules Officielles" : "جدول القوانين والصيغ والترميزات الرياضية الرسمية المركزة"}
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {isFr ? "Aide-mémoire didactique" : "تذكرة رياضية مركزة"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {fiche.officialFormulasSummary.map((f, fIdx) => (
                      <div key={fIdx} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 space-y-1">
                        <div className="text-cyan-300 font-bold text-[10.5px]">
                          {isFr ? f.titleFr : f.titleAr}
                        </div>
                        <div className="font-mono text-white text-center font-bold bg-slate-950 p-1.5 rounded border border-slate-800 text-[11px] overflow-x-auto">
                          <MathText text={f.latex} inline />
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          <MathText text={f.domainOrCondition} inline />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* 3. المحطة الثالثة: السيناريو الديداكتيكي وتدبير الحصص */}
            {effectivePrintScope !== "SOLUTIONS_ONLY" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-sky-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                    {isFr ? "ÉTAPE 3" : "المحطة الثالثة"}
                  </span>
                  <h4 className="font-black text-sm text-slate-950">
                    {isFr ? "Tableau Didactique Officiel & Déroulement Séquentiel des Séances" : "جدول السيناريو الديداكتيكي وتدبير مراحل الحصص (Séance par séance)"}
                  </h4>
                </div>
                <span className="text-[10.5px] font-mono text-slate-500 font-bold">
                  {isFr ? "Gestion de classe & Postures" : "تدبير القسم وأدوار الأستاذ والمتعلم"}
                </span>
              </div>

              {/* الجدول الديداكتيكي الرسمي المعتمد من المفتشية */}
              {(ficheScenarioDisplayMode === "GRID_OFFICIAL" || ficheScenarioDisplayMode === "BOTH") && (
                <div className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                      <span>📋</span>
                      <span>{isFr ? "Grille d'ingénierie didactique officielle (5 phases)" : "الجدول الديداكتيكي الرسمي لتدبير المحطات الخمس للدرس"}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {isMission ? "Programme Officiel BOEN & AEFE" : "Note 142-08 & OP 2007"}
                    </span>
                  </div>

                  <div className="overflow-x-auto studio-scroll border border-slate-200 rounded-xl">
                    <table className="w-full text-right text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-black border-b border-slate-800">
                          <th className="p-2.5 border-l border-slate-800 whitespace-nowrap">{isFr ? "Étape / Durée" : "المرحلة والمدة"}</th>
                          <th className="p-2.5 border-l border-slate-800">{isFr ? "Objectifs didactiques" : "الأهداف الإجرائية"}</th>
                          <th className="p-2.5 border-l border-slate-800">{isFr ? "Rôle de l'enseignant" : "مهام الأستاذ وتدبير القسم"}</th>
                          <th className="p-2.5 border-l border-slate-800">{isFr ? "Rôle de l'élève" : "مهام ونشاط المتعلم"}</th>
                          <th className="p-2.5 whitespace-nowrap">{isFr ? "Modalités" : "صيغ العمل"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {fiche.didacticSteps.map((step) => (
                          <tr key={step.stepNum} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2.5 font-bold text-slate-950 border-l border-slate-200 bg-slate-50/70 align-top whitespace-nowrap">
                              <div className="font-black text-cyan-900">{isFr ? step.phaseFr : step.phaseAr}</div>
                              <div className="font-mono text-[10px] text-slate-500 font-bold mt-1">⏱ {step.durationMinutes} min</div>
                            </td>
                            <td className="p-2.5 border-l border-slate-200 align-top text-slate-700">
                              <ul className="list-disc list-inside space-y-0.5">
                                {(isFr ? step.objectifsFr : step.objectifsAr).map((obj, oIdx) => (
                                  <li key={oIdx}>{obj}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-2.5 border-l border-slate-200 align-top text-slate-700 leading-relaxed">
                              {isFr ? step.teacherRoleFr : step.teacherRoleAr}
                            </td>
                            <td className="p-2.5 border-l border-slate-200 align-top text-slate-700 leading-relaxed">
                              {isFr ? step.studentRoleFr : step.studentRoleAr}
                            </td>
                            <td className="p-2.5 align-top text-slate-600 text-[10.5px]">
                              {isFr ? step.modalitiesFr : step.modalitiesAr}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* السيناريو البيداغوجي التفصيلي حصة بحصة (Séance par séance) */}
              {(ficheScenarioDisplayMode === "CARDS_BY_SESSION" || ficheScenarioDisplayMode === "BOTH") &&
                fiche.detailedSessionScenarios &&
                fiche.detailedSessionScenarios.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                      <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                        <span>🗓</span>
                        <span>{isFr ? "Scénario détaillé séance par séance (Micro-ingénierie)" : "السيناريو الديداكتيكي التفصيلي لكل حصة دراسية على حدة"}</span>
                      </span>
                      <span className="text-[10px] font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded font-bold">
                        {fiche.detailedSessionScenarios.length} {isFr ? "séances détaillées" : "حصص مفصلة بدقة"}
                      </span>
                    </div>

                    {fiche.detailedSessionScenarios.map((session) => (
                      <div key={session.sessionNum} className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-2xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-slate-900 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
                              S{session.sessionNum}
                            </span>
                            <div>
                              <h5 className="font-black text-xs md:text-sm text-slate-950">
                                {isFr ? session.sessionTitleFr : session.sessionTitleAr}
                              </h5>
                              <span className="text-[10.5px] text-slate-500 font-medium">
                                {isFr ? session.sessionTypeFr : session.sessionTypeAr}
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                            ⏱ {session.durationLabel}
                          </span>
                        </div>

                        {/* الأهداف الإجرائية للحصة */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                          <span className="font-bold text-slate-900 block">
                            🎯 {isFr ? "Objectifs opérationnels de la séance :" : "الأهداف الإجرائية الدقيقة للحصة:"}
                          </span>
                          <ul className="list-disc list-inside text-slate-700 space-y-0.5 font-medium">
                            {(isFr ? session.operationalObjectivesFr : session.operationalObjectivesAr).map((obj, idx) => (
                              <li key={idx}>{obj}</li>
                            ))}
                          </ul>
                        </div>

                        {/* المقاطع الديداكتيكية الدقيقة للحصة */}
                        <div className="space-y-2">
                          <span className="font-extrabold text-[11px] text-slate-900 block">
                            {isFr ? "Déroulement minuté des moments didactiques :" : "المسار الزمني الدقيق للمقاطع الديداكتيكية للحصة:"}
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {session.moments.map((m, mIdx) => (
                              <div key={mIdx} className="p-3 rounded-xl bg-white border border-slate-200/90 space-y-2 text-[11px] shadow-2xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                                  <span className="font-bold text-slate-950">
                                    {isFr ? m.momentTitleFr : m.momentTitleAr}
                                  </span>
                                  <span className="font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded text-[10px]">
                                    ⏱ {m.durationMin} min
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700">
                                  <div>
                                    <span className="font-bold text-slate-900">🧑‍🏫 {isFr ? "Professeur :" : "تدخلات الأستاذ:"} </span>
                                    <span>{isFr ? m.teacherRoleFr : m.teacherRoleAr}</span>
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900">👨‍🎓 {isFr ? "Élève :" : "أنشطة التلميذ:"} </span>
                                    <span>{isFr ? m.studentRoleFr : m.studentRoleAr}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                                  <span><strong>{isFr ? "Modalité :" : "صيغة العمل:"}</strong> {isFr ? m.workModalityFr : m.workModalityAr}</span>
                                  <span><strong>{isFr ? "Supports :" : "المعينات:"}</strong> {isFr ? m.materialsFr : m.materialsAr}</span>
                                  <span className="text-emerald-700 font-semibold"><strong>{isFr ? "Indicateur :" : "مؤشر التملك:"}</strong> {isFr ? m.assessmentIndicatorFr : m.assessmentIndicatorAr}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* خلاصة الحصة والتكليف المنزلي */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10.5px]">
                          <div>
                            <span className="font-bold text-slate-900">📌 {isFr ? "Bilan de fin de séance :" : "خلاصة الحصة:"} </span>
                            <span className="text-slate-700">{isFr ? session.summaryRuleFr : session.summaryRuleAr}</span>
                          </div>
                          {(session.homeworkTaskAr || session.homeworkTaskFr) && (
                            <div className="text-cyan-950 bg-cyan-50/80 px-2.5 py-1 rounded-lg border border-cyan-200 font-medium">
                              <strong>🏠 {isFr ? "Travail personnel :" : "التكليف المنزلي:"}</strong> {isFr ? session.homeworkTaskFr : session.homeworkTaskAr}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            )}

            {/* 4. المحطة الرابعة: إدماج TICE وبرمجة بايثون (GeoGebra & Python Script) */}
            {includeFicheTICE && effectivePrintScope !== "SPEC_GRID_ONLY" && (
              <div className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-teal-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                      {isFr ? "ÉTAPE 4" : "المحطة الرابعة"}
                    </span>
                    <h4 className="font-black text-sm text-slate-950">
                      {isFr ? "Intégration des TICE & Algorithmique Python" : "إدماج التكنولوجيا TICE والبرمجة بالبايثون (GeoGebra & Python)"}
                    </h4>
                  </div>
                  <span className="text-[10.5px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    NumWorks · Python 3.x · GeoGebra 6
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* نشاط GeoGebra */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="font-black text-slate-950 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                      <span className="font-serif text-teal-700 font-black">📐</span>
                      <span>{isFr ? fiche.ticeIntegration.geogebraActivity.titleFr : fiche.ticeIntegration.geogebraActivity.titleAr}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {isFr ? fiche.ticeIntegration.geogebraActivity.goalFr : fiche.ticeIntegration.geogebraActivity.goalAr}
                    </p>
                    <div className="space-y-1 pt-1 text-[11px]">
                      <span className="font-bold text-slate-900 block">{isFr ? "Protocole de manipulation :" : "خطوات الإنجاز والمحاكاة على GeoGebra:"}</span>
                      {(isFr ? fiche.ticeIntegration.geogebraActivity.stepsFr : fiche.ticeIntegration.geogebraActivity.stepsAr).map((step, sIdx) => (
                        <div key={sIdx} className="bg-white p-1.5 rounded border border-slate-200 text-slate-700 font-mono text-[10.5px]">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* كود وخوارزمية بايثون */}
                  <div className="p-3.5 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-cyan-300 font-sans font-black">
                      <span>🐍 {isFr ? fiche.ticeIntegration.pythonScript.titleFr : fiche.ticeIntegration.pythonScript.titleAr}</span>
                      <span className="text-[10px] text-slate-400 font-mono">script.py</span>
                    </div>
                    <pre dir="ltr" className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 overflow-x-auto text-[11px] leading-relaxed text-teal-200 select-all font-mono">
                      {fiche.ticeIntegration.pythonScript.code}
                    </pre>
                    <div className="text-[10.5px] font-sans text-slate-300 leading-relaxed pt-1">
                      <span className="font-bold text-cyan-300">{isFr ? "Explication :" : "شرح الخوارزمية:"} </span>
                      <span>{isFr ? fiche.ticeIntegration.pythonScript.explanationFr : fiche.ticeIntegration.pythonScript.explanationAr}</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 bg-slate-900/90 p-1.5 rounded border border-emerald-900/50">
                      <span>Output : </span>
                      <span>{fiche.ticeIntegration.pythonScript.sampleOutput}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. المحطة الخامسة: التقويم التكويني والدعم الفوري والعمل المنزلي */}
            {includeFicheFormativeEval && effectivePrintScope !== "SPEC_GRID_ONLY" && (
              <div data-sync-section="SOLUTIONS" className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-cyan-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                      {isFr ? "ÉTAPE 5" : "المحطة الخامسة"}
                    </span>
                    <h4 className="font-black text-sm text-slate-950">
                      {isFr ? fiche.formativeEvaluation.titleFr : fiche.formativeEvaluation.titleAr}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    ⏱ 20 min · {isFr ? "Bilan & Remédiation" : "تفييء ودعم"}
                  </span>
                </div>

                {/* تمرين التقويم التكويني الوجيز */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">
                    🎯 <MathText text={isFr ? fiche.formativeEvaluation.testExerciseFr.statement : fiche.formativeEvaluation.testExerciseAr.statement} />
                  </div>
                  <div className="space-y-1.5">
                    {(isFr ? fiche.formativeEvaluation.testExerciseFr.questions : fiche.formativeEvaluation.testExerciseAr.questions).map((q, qIdx) => (
                      <div key={qIdx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                        <span className="font-semibold text-slate-800"><MathText text={q} /></span>
                        <span className="font-mono text-cyan-800 font-bold text-[10.5px]">
                          {(isFr ? fiche.formativeEvaluation.testExerciseFr.markingScheme : fiche.formativeEvaluation.testExerciseAr.markingScheme)[qIdx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* استراتيجيات المعالجة والعمل المنزلي */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 space-y-1 text-teal-950">
                    <span className="font-bold block">💡 {isFr ? "Dispositif de remédiation immédiate :" : "خطة المعالجة والدعم الفوري للتعثرات:"}</span>
                    <ul className="list-disc list-inside space-y-0.5 text-teal-900">
                      {(isFr ? fiche.formativeEvaluation.remediationStrategiesFr : fiche.formativeEvaluation.remediationStrategiesAr).map((rem, rIdx) => (
                        <li key={rIdx}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-100/80 border border-slate-300 rounded-xl p-3 space-y-1 text-slate-900">
                    <span className="font-bold block">🏠 {isFr ? "Prescriptions de travail personnel hors classe :" : "التكليفات والعمل المنزلي الذاتي (دفتر النصوص):"}</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {(isFr ? fiche.formativeEvaluation.homeworkAssignmentsFr : fiche.formativeEvaluation.homeworkAssignmentsAr).map((hw, hIdx) => (
                        <li key={hIdx}>{hw}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. محتوى الرائز التشخيصي وشبكة التفريغ والتحليل الديداكتيكي للتعثرات وفق المنهاج المغربي */}
      {!onlyPrintEvalGrid && activeModule === "DIAGNOSTIC" && (() => {
        const diagPaper = generateMoroccanDiagnosticPaper(
          track.code,
          diagDuration,
          examModel === "B" ? "B" : "A"
        );

        return (
          <div className="space-y-5 text-xs md:text-sm">
            <div data-sync-section="HEADER">
              {renderDocumentHeader(examModel === "B" ? "B" : "A")}
            </div>

            {/* إطار التوجيهات الرسمية ومجالات الرائز التشخيصي */}
            {effectivePrintScope !== "SOLUTIONS_ONLY" && (
            <div data-sync-section="SPEC_TABLE" className="avoid-break border-2 border-indigo-950 rounded-xl p-4 bg-indigo-50/40 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-950 text-amber-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                    {isFr ? "CADRE PÉDAGOGIQUE" : "الإطار البيداغوجي"}
                  </span>
                  <h3 className="font-black text-sm text-indigo-950">
                    {isFr ? diagPaper.titleFr : diagPaper.titleAr}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-900 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg">
                  <span>⏱ {isFr ? "Durée :" : "المدة :"} {diagPaper.duration}</span>
                  <span>·</span>
                  <span>🎯 {isFr ? "Seuil :" : "عتبة التحكم :"} {diagPaper.masteryThresholdPercent}%</span>
                </div>
              </div>

              {/* مجالات التقويم المستهدفة */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {diagPaper.domains.map((dom) => (
                  <div
                    key={dom.code}
                    className="p-2 rounded-lg bg-white border border-indigo-100 text-center space-y-0.5"
                  >
                    <div className="font-black text-indigo-950 text-[11px]">
                      {isFr ? dom.labelFr : dom.labelAr}
                    </div>
                    <div className="text-[10px] font-mono text-indigo-700 font-bold">
                      {dom.weightPercent}% {isFr ? "de l'épreuve" : "من الرائز"}
                    </div>
                  </div>
                ))}
              </div>

              {/* توجيهات الإنجاز */}
              <div className="bg-white/80 p-3 rounded-lg border border-indigo-100/80 text-[11px] text-slate-700 space-y-1">
                <div className="font-extrabold text-indigo-950">
                  {isFr ? "Directives officielles pour les élèves :" : "توجيهات رسمية للمتعلم(ة) :"}
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {(isFr ? diagPaper.instructionsFr : diagPaper.instructionsAr).map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
            )}

            {/* الجزء الأول : أسئلة متعددة الاختيارات (QCM) وفحص المكتسبات الأساسية والتمثلات */}
            {effectivePrintScope !== "SPEC_GRID_ONLY" && effectivePrintScope !== "SOLUTIONS_ONLY" && (
            <>
            <div className="avoid-break border border-slate-300 rounded-xl p-4 space-y-4 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 text-[11px] px-2 py-0.5 rounded font-black">
                    PARTIE I
                  </span>
                  <h4 className="font-black text-sm text-slate-950">
                    {isFr
                      ? "Partie I : Questionnaire à Choix Multiples (QCM) & Diagnostic des représentations (4 pts)"
                      : "الجزء الأول : رائز الأسئلة متعددة الاختيارات (QCM) ورصد المفاهيم والتمثلات (4 نقط)"}
                  </h4>
                </div>
                <span className="font-mono text-xs text-indigo-950 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  4.0 {isFr ? "points" : "نقط"}
                </span>
              </div>

              <div className="space-y-4">
                {diagPaper.qcmItems.map((item, qIdx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between font-extrabold text-xs text-slate-900 border-b border-slate-200/80 pb-1.5">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-950 text-white flex items-center justify-center text-[10px] font-mono shrink-0">
                          {qIdx + 1}
                        </span>
                        <span><MathText text={isFr ? item.questionFr : item.questionAr} inline /></span>
                      </span>
                      <span className="font-mono text-[11px] text-indigo-800 shrink-0">
                        [{item.points} {isFr ? "pt" : "ن"}]
                      </span>
                    </div>

                    {/* خيارات الإجابة الأربعة */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {(isFr ? item.optionsFr : item.optionsAr).map((opt) => (
                        <div
                          key={opt.code}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 font-medium"
                        >
                          <span className="font-mono font-bold text-slate-700 w-5 h-5 rounded border border-slate-300 flex items-center justify-center text-[11px] bg-slate-50 shrink-0">
                            {opt.code}
                          </span>
                          <span className="text-slate-800 overflow-x-auto"><MathText text={opt.text} inline /></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الجزء الثاني : تمارين التطبيق المباشر والاستدلال الرياضي */}
            <div data-sync-section="EXERCISES" className="space-y-4">
              {diagPaper.directExercises.map((ex) => (
                <div
                  key={ex.id}
                  className={`avoid-break space-y-3 ${effectiveExerciseBoxClass}`}
                >
                  <div className={effectiveExerciseHeaderClass}>
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-950 text-white text-[11px] px-2 py-0.5 rounded font-black">
                        EXERCICE {ex.number}
                      </span>
                      <h4 className="font-black text-sm">
                        {isFr ? ex.titleFr : ex.titleAr}
                      </h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-950 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {ex.totalPoints} {isFr ? "points" : "نقط"}
                    </span>
                  </div>

                  <div className="text-[11px] text-indigo-900 bg-indigo-50/50 p-2 rounded-lg font-bold border border-indigo-100">
                    🎯 {isFr ? "Prérequis ciblé : " : "المكتسب القبلي المستهدف : "}
                    <span className="text-slate-800 font-semibold">{isFr ? ex.prerequisiteFr : ex.prerequisiteAr}</span>
                  </div>

                  <ol className="list-none space-y-4 text-[13.5px] text-slate-900 leading-[2.15]">
                    {(isFr ? ex.questionsFr : ex.questionsAr).map((q, qIdx) => (
                      <li key={qIdx} className="space-y-2 mb-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-bold text-slate-950">{q.label}</span>
                          <span className="flex-1"><MathText text={q.text} /></span>
                          <span className="font-mono text-[10.5px] font-bold text-indigo-900">
                            [{q.points}]
                          </span>
                        </div>
                        {includeAnswerWorkspace &&
                          renderStudentAnswerWorkspace("N1", undefined, true, {
                            questionText: q.text,
                            solutionText: (isFr ? ex.solutionsFr : ex.solutionsAr)[qIdx],
                            points: q.points,
                            workspaceId: `diag_ex_${ex.id}_q_${qIdx}`,
                          })}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* الجزء الثالث : المسألة التشخيصية التوليفية */}
            <div
              data-sync-section="SYNTHESIS_PROBLEM"
              className={`avoid-break space-y-3 ${
                latexPackageTheme === "TCOLORBOX" && tcolorboxConfig.applyToComplexProblems
                  ? problemTcbStyles.boxClass
                  : "border-2 border-indigo-900 rounded-xl p-4 bg-white shadow-xs"
              }`}
            >
              <div
                className={
                  latexPackageTheme === "TCOLORBOX" && tcolorboxConfig.applyToComplexProblems
                    ? problemTcbStyles.headerClass
                    : "flex flex-wrap items-center justify-between border-b-2 border-indigo-100 pb-2 gap-2"
                }
              >
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-950 text-amber-300 text-[11px] px-2.5 py-0.5 rounded font-mono font-black">
                    PROBLÈME
                  </span>
                  <h4 className="font-black text-sm">
                    <MathText text={isFr ? diagPaper.synthesisProblem.titleFr : diagPaper.synthesisProblem.titleAr} inline />
                  </h4>
                </div>
                <span className="font-mono font-extrabold text-indigo-950 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded text-xs">
                  {diagPaper.synthesisProblem.totalPoints} {isFr ? "points" : "نقط"}
                </span>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg leading-relaxed italic border border-slate-200">
                <MathText text={isFr ? diagPaper.synthesisProblem.contextFr : diagPaper.synthesisProblem.contextAr} />
              </div>

              <div className="space-y-3">
                {(isFr ? diagPaper.synthesisProblem.partsFr : diagPaper.synthesisProblem.partsAr).map((part, pIdx) => (
                  <div key={pIdx} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                    <div className="font-extrabold text-xs text-indigo-950 border-b border-slate-200 pb-1 flex justify-between items-center">
                      <span><MathText text={part.partTitle} inline /></span>
                      <span className="font-mono text-[11px] text-indigo-800 tabular-nums">
                        ({part.points} {isFr ? "pts" : "ن"})
                      </span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-800 leading-relaxed">
                      {part.questions.map((q, qIdx) => (
                        <li key={qIdx} className="space-y-1">
                          <span><MathText text={q} /></span>
                          {includeAnswerWorkspace &&
                            renderStudentAnswerWorkspace("N3", undefined, true, {
                              questionText: q,
                              points: (
                                parseFloat(String(part.points || "4")) /
                                Math.max(1, part.questions.length)
                              ).toFixed(2),
                              workspaceId: `diag_synth_${pIdx}_q_${qIdx}`,
                            })}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            {/* الأشكال والرسوم التوضيحية المندرجة في الرائز */}
            {insertedFigures
              .filter((f) => f.exerciseId.startsWith("diag") || f.exerciseId === "ex_diag")
              .map((fig) => (
                <InsertedFigureCard
                  key={fig.id}
                  figure={fig}
                  isInlineEditable={isInlineEditable}
                  isFr={isFr}
                  onUpdateFigure={onUpdateFigure}
                  onDeleteFigure={onDeleteFigure}
                />
              ))}

            {renderExerciseFigureDropZone("diag_main")}
            </>
            )}

            {/* ملحق عناصر الإجابة والتحليل الديداكتيكي للتعثرات (Corrigé & Grille Diagnostique) */}
            {effectivePrintScope !== "SUJET_ONLY" &&
              (showAnswerKey ||
                includeDetailedSolutions ||
                effectivePrintScope === "SOLUTIONS_ONLY" ||
                effectivePrintScope === "SPEC_GRID_ONLY") && (
              <div data-sync-section="SOLUTIONS" className="page-break pt-4 space-y-4">
                <div className="border-2 border-emerald-800 rounded-xl p-4 bg-emerald-50/40 space-y-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between border-b border-emerald-200 pb-2 gap-2">
                    <h4 className="font-black text-sm text-emerald-950">
                      {isFr
                        ? "Grille de Correction Détaillée, Analyse Didactique des Erreurs & Plan de Remédiation"
                        : "عناصر الإجابة وشبكة التحليل الديداكتيكي للتعثرات وخطة الدعم الاستدراكي"}
                    </h4>
                    <span className="font-mono text-xs font-bold text-emerald-900 bg-white border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                      {isFr ? "Document du Professeur" : "خاص بالأستاذ وملف التقويم"}
                    </span>
                  </div>

                  {/* جدول تحليل أسئلة الـ QCM ورصد التمثلات والحلول */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-400 text-xs bg-white">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 text-[11px]">
                          <th className="border border-slate-400 p-2 text-center w-24">
                            {isFr ? "Question / Domaine" : "السؤال والمجال"}
                          </th>
                          <th className="border border-slate-400 p-2 text-start w-52">
                            {isFr ? "Réponse & Justification" : "الجواب والتعليل"}
                          </th>
                          <th className="border border-slate-400 p-2 text-start">
                            {isFr ? "Erreur type & Obstacle" : "التمثل والخطأ الشائع"}
                          </th>
                          <th className="border border-slate-400 p-2 text-start w-48">
                            {isFr ? "Plan de Remédiation" : "خطة الدعم المقترحة"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagPaper.qcmItems.map((item) => (
                          <tr key={item.id} className="border-b border-slate-300 text-[11px]">
                            <td className="border border-slate-400 p-2 text-center font-bold">
                              <div className="font-mono text-indigo-950 font-black">{item.id.toUpperCase()}</div>
                              <div className="text-[10px] text-slate-500 font-normal">
                                {isFr ? item.domainFr : item.domainAr}
                              </div>
                            </td>
                            <td className="border border-slate-400 p-2">
                              <span className="inline-block bg-emerald-100 text-emerald-950 font-mono font-bold px-1.5 py-0.5 rounded text-[11px] mb-1">
                                {isFr ? "Option :" : "الخيار :"} {item.correctCode}
                              </span>
                              <div className="text-slate-800 leading-relaxed">
                                <MathText text={isFr ? item.justificationFr : item.justificationAr} />
                              </div>
                            </td>
                            <td className="border border-slate-400 p-2 text-slate-700">
                              <div className="font-bold text-rose-800 mb-0.5">
                                ⚠ <MathText text={isFr ? item.commonErrorFr : item.commonErrorAr} inline />
                              </div>
                              <div className="text-[10.5px] text-slate-500">
                                <strong>{isFr ? "Origine :" : "السبب :"}</strong> {isFr ? item.didacticalOriginFr : item.didacticalOriginAr}
                              </div>
                            </td>
                            <td className="border border-slate-400 p-2 font-semibold text-emerald-900 bg-emerald-50/20">
                              {isFr ? item.remediationPlanFr : item.remediationPlanAr}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* حلول التمارين التطبيقية والمسألة التوليفية */}
                  <div className="space-y-2 pt-2">
                    <h5 className="font-black text-xs text-emerald-950">
                      {isFr ? "Corrigé succinct des exercices d'application & problème :" : "عناصر الإجابة المختصرة للتمارين التطبيقية والمسألة :"}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {diagPaper.directExercises.map((ex) => (
                        <div key={ex.id} className="p-3 rounded-lg bg-white border border-emerald-200 space-y-1">
                          <div className="font-bold text-emerald-950 border-b border-emerald-100 pb-1">
                            {isFr ? ex.titleFr : ex.titleAr}
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                            {(isFr ? ex.solutionsFr : ex.solutionsAr).map((sol, sIdx) => (
                              <li key={sIdx}><MathText text={sol} inline /></li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* شبكة تفريغ نتائج التقويم التشخيصي للقسم */}
                <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-3 avoid-break">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h5 className="font-black text-xs text-slate-900">
                      {isFr
                        ? "Grille de Dépouillement Collectif du Test Diagnostique (Bilan de Classe)"
                        : "شبكة التفريغ الجماعي لنتائج التقويم التشخيصي للقسم (تقرير تركيبي)"}
                    </h5>
                    <span className="text-[11px] font-mono text-slate-600 font-bold">
                      {school} · {prof} · {year}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-400 text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-950">
                          <th className="border border-slate-400 p-1.5 text-center w-12">N°</th>
                          <th className="border border-slate-400 p-1.5 text-start min-w-[140px]">
                            {isFr ? "Nom & Prénom de l'élève" : "الاسم والنسب للمتعلم(ة)"}
                          </th>
                          <th className="border border-slate-400 p-1.5 text-center">QCM /4</th>
                          <th className="border border-slate-400 p-1.5 text-center">Ex 1 /4</th>
                          <th className="border border-slate-400 p-1.5 text-center">Ex 2 /4</th>
                          <th className="border border-slate-400 p-1.5 text-center">Problème /8</th>
                          <th className="border border-slate-400 p-1.5 text-center font-black bg-indigo-50/70">Total /20</th>
                          <th className="border border-slate-400 p-1.5 text-center w-36">
                            {isFr ? "Décision de Soutien" : "قرار الدعم الاستدراكي"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((rowNum) => (
                          <tr key={rowNum} className="h-6">
                            <td className="border border-slate-400 p-1 text-center font-mono font-bold text-slate-700">
                              {rowNum}
                            </td>
                            <td className="border border-slate-400 p-1 text-slate-400">
                              ...................................................
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono"></td>
                            <td className="border border-slate-400 p-1 text-center font-mono"></td>
                            <td className="border border-slate-400 p-1 text-center font-mono"></td>
                            <td className="border border-slate-400 p-1 text-center font-mono"></td>
                            <td className="border border-slate-400 p-1 text-center font-mono font-black bg-indigo-50/30"></td>
                            <td className="border border-slate-400 p-1 text-center text-[10px] text-slate-600">
                              [ ] A &nbsp; [ ] EC &nbsp; [ ] NA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 5. وحدة التوزيع الدوري السنوي وتدبير المحطات الإشهادية والتقويمية وفق المقرر الوزاري */}
      {!onlyPrintEvalGrid && activeModule === "REPARTITION_CERTIF" && (() => {
        const isSm = track.code.includes("SM");
        const isPc = track.code.includes("PC") || track.code.includes("SVT");
        const isEco = track.code.includes("SE") || track.code.includes("ECO");
        const isTc = track.cycle === "TC" || track.code.startsWith("TC");
        const is1Bac = track.cycle === "1BAC" || track.code.startsWith("1BAC");
        const is2Bac = track.cycle === "2BAC" || track.code.startsWith("2BAC");

        const weeklyHours = isMission
          ? track.code === "TERM_EXP_FR"
            ? "9h / sem (6h Spé + 3h Expertes)"
            : track.code === "TERM_SPE_FR"
            ? "6 heures / semaine"
            : track.code === "TERM_COMPL_FR"
            ? "3 heures / semaine"
            : "4 heures / semaine"
          : is2Bac && isSm
          ? isFr
            ? "9 heures / semaine (7h + 2h TD)"
            : "9 ساعات / أسبوع (7س درس + 2س ت.ت)"
          : is1Bac && isSm
          ? isFr
            ? "7 heures / semaine"
            : "7 ساعات / أسبوع"
          : isPc
          ? isFr
            ? "5 heures / semaine"
            : "5 ساعات / أسبوع"
          : isEco
          ? isFr
            ? "4 heures / semaine"
            : "4 ساعات / أسبوع"
          : isTc
          ? isFr
            ? "5 heures / semaine"
            : "5 ساعات / أسبوع"
          : isFr
          ? "4 heures / semaine"
          : "4 ساعات / أسبوع";

        const officialCoeff = isMission
          ? track.code.startsWith("TERM_SPE") || track.code.startsWith("TERM_EXP")
            ? "Coeff. 16 (Épreuve Finale Spécialité Bac)"
            : track.code.startsWith("TERM_COMPL")
            ? "Contrôle Continu LSL (Coeff. Bac)"
            : track.code.startsWith("1ERE_")
            ? "Contrôle Continu Bac & Épreuve Anticipée"
            : "Positionnement National 2nde & Orientation"
          : is2Bac && isSm
          ? isFr
            ? "Coefficient 9 (Examen National)"
            : "المعامل 9 (امتحان وطني موحد)"
          : is2Bac && isPc
          ? isFr
            ? "Coefficient 7 (Examen National)"
            : "المعامل 7 (امتحان وطني موحد)"
          : is2Bac && isEco
          ? isFr
            ? "Coefficient 4 (Examen National)"
            : "المعامل 4 (امتحان وطني موحد)"
          : is1Bac && isSm
          ? isFr
            ? "Coefficient 7 (Contrôle Continu)"
            : "المعامل 7 (مراقبة مستمرة + إعداد)"
          : is1Bac
          ? isFr
            ? "Coefficient 4"
            : "المعامل 4"
          : isFr
          ? "Coefficient 4 (Tronc Commun)"
          : "المعامل 4 (الجذع المشترك)";

        const s1Lessons = Object.values(track.semesters.S1).flat();
        const s2Lessons = Object.values(track.semesters.S2).flat();

        return (
          <div className="space-y-6 text-xs md:text-sm">
            <div data-sync-section="HEADER">
              {renderDocumentHeader()}
            </div>

            {/* بطاقة الإطار الإداري والبيداغوجي للتوزيع السنوي */}
            {effectivePrintScope !== "SUJET_ONLY" && (
            <>
            <div data-sync-section="SPEC_TABLE" className="avoid-break bg-slate-900 text-white rounded-2xl p-4 md:p-5 border border-cyan-900/60 space-y-3.5 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-teal-500 text-slate-950 flex items-center justify-center font-serif text-base font-black shadow-sm">
                    ℝ
                  </span>
                  <div>
                    <span className="text-[10.5px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {isFr
                        ? "RÉPARTITION PÉRIODIQUE ANNUELLE & CALENDRIER DES ÉVALUATIONS CERTIFICATIVES"
                        : "التوزيع الدوري السنوي والمحطات التقويمية والإشهادية (المقرر الوزاري 2026-2027)"}
                    </span>
                    <h3 className="font-black text-sm md:text-base text-white">
                      {isFr ? track.labelFr : track.labelAr}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="bg-slate-800 text-cyan-300 border border-slate-700 px-3 py-1 rounded-lg font-bold">
                    ⏱ {weeklyHours}
                  </span>
                  <span className="bg-slate-800 text-amber-300 border border-slate-700 px-3 py-1 rounded-lg font-bold">
                    ⚖️ {officialCoeff}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-300">
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {isFr ? "CADRE RÉFÉRENTIEL" : "المرجعية البيداغوجية"}
                  </span>
                  <span className="font-bold text-white">
                    {isMission ? "Programmes BOEN & AEFE" : "التوجيهات التربوية 2007 & الأطر المرجعية"}
                  </span>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {isFr ? "VOLUME HORAIRE TOTAL" : "الحصيص الساعي الإجمالي"}
                  </span>
                  <span className="font-bold text-cyan-300 font-mono">
                    {allLessons.reduce((acc, l) => {
                      const m = l.hours.match(/(\d+)/);
                      return acc + (m ? parseInt(m[1], 10) : 10);
                    }, 0)}{" "}
                    {isFr ? "heures / an" : "ساعة / سنة"}
                  </span>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {isFr ? "UNITÉS DU PROGRAMME" : "الوحدات الدراسية"}
                  </span>
                  <span className="font-bold text-white">
                    {allLessons.length} {isFr ? "chapitres majeurs" : "دروس مقررة"}
                  </span>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {isFr ? "CONTRÔLE CONTINU (NOTE 142-08)" : "المراقبة المستمرة (مذكرة 142-08)"}
                  </span>
                  <span className="font-bold text-emerald-300">
                    {track.dsCount * 2}{" "}
                    {isFr
                      ? `devoirs surveillés (${track.dsCount}/semestre · ${track.durationFr})`
                      : `فروض محروسة رسمية (${track.dsCount}/دورة · ${track.durationAr})`}
                  </span>
                </div>
              </div>
            </div>

            {/* جدول محطات المراقبة المستمرة والامتحانات الإشهادية الرسمية */}
            <div className="avoid-break bg-white border border-slate-300 rounded-2xl p-4 md:p-5 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-amber-300 font-mono text-[11px] px-2.5 py-0.5 rounded font-black">
                    {isFr ? "CALENDRIER MINISTÉRIEL" : "البرمجة الزمنية للمحطات التقويمية والإشهادية"}
                  </span>
                  <h4 className="font-black text-xs md:text-sm text-slate-950">
                    {isFr
                      ? "Jalons du Contrôle Continu & Examens Certificatifs (Session 2026-2027)"
                      : "محطات الفروض المحروسة والامتحانات الإشهادية والمداولات (المقرر الوزاري 2026-2027)"}
                  </h4>
                </div>
                <span className="text-[10.5px] font-mono text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                  {isMission ? "BOEN · LSL / Pronote (AEFE)" : `Note 142-08 (${track.dsCount} DS/Sem) · MASSAR`}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[11px] bg-white">
                  <thead>
                    <tr className="bg-slate-100 text-slate-950 font-extrabold">
                      <th className="border border-slate-300 p-2 text-center w-20">
                        {isFr ? "Période" : "الفترة"}
                      </th>
                      <th className="border border-slate-300 p-2 text-start">
                        {isFr ? "Événement / Échéance Pédagogique" : "المحطة التربوية والتقويمية"}
                      </th>
                      <th className="border border-slate-300 p-2 text-center w-36">
                        {isFr ? "Semaine / Date indicative" : "الأسبوع / التاريخ التقديري"}
                      </th>
                      <th className="border border-slate-300 p-2 text-start">
                        {isFr ? "Dispositif didactique & Modalités" : "الإجراءات الديداكتيكية والتنظيمية"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 bg-indigo-50/30">
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold text-indigo-950">
                        S1
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        {isFr ? "Évaluation Diagnostique & Soutien Prérequis" : "التقويم التشخيصي وعدة الدعم الاستدراكي للتعثرات"}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                        {isFr ? "Semaines 1-3 (Septembre)" : "الأسابيع 1 إلى 3 (شتنبر)"}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {isFr
                          ? "Passation du test diagnostique, analyse des bilans et remédiation ciblée"
                          : "تمرير الرائز التشخيصي، تفريغ النتائج في شبكة القسم، وإرساء حصص الدعم الوقائي"}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold text-indigo-950">
                        S1
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        {isFr ? `Devoir Surveillé N° 1 (DS 1 — ${track.durationFr})` : `الفرض المحروس رقم 1 (الدورة الأولى — ${track.durationAr})`}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                        {isFr ? "Semaine 8-9 (Novembre)" : "الأسبوع 8-9 (نونبر)"}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {isFr
                          ? "Évaluation sommative Note 142-08 + Semaine de correction et de remédiation"
                          : "تقويم إجمالي للمكتسبات وفق المذكرة 142-08 يليه أسبوع تصحيح الفرض والدعم الفوري"}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold text-indigo-950">
                        S1
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        {isFr ? `Devoir Surveillé N° 2 (DS 2 — ${track.durationFr})` : `الفرض المحروس رقم 2 (الدورة الأولى — ${track.durationAr})`}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                        {isFr ? "Semaine 13-14 (Décembre)" : "الأسبوع 13-14 (دجنبر)"}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {isFr
                          ? "Évaluation formative et sommative sur les chapitres d'approfondissement"
                          : "تقويم تكويني وإجمالي على دروس التحليل والجبر المتداخلة مع رصد التطور الفردي"}
                      </td>
                    </tr>
                    {track.dsCount >= 3 && (
                      <tr className="border-b border-slate-200 bg-slate-50/60">
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-indigo-950">
                          S1
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">
                          {isFr
                            ? `Devoir Surveillé N° 3 (DS 3)${track.dsCount === 3 ? " & Bilan S1" : ""}`
                            : `الفرض المحروس رقم 3${track.dsCount === 3 ? " ومسك نقط الدورة 1 في مسار" : " (الدورة الأولى)"}`}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                          {isFr ? "Semaine 16-17 (Janvier)" : "الأسبوع 16-17 (يناير)"}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {isFr
                            ? "Synthèse semestrielle et vérification des attendus du cadre de référence"
                            : "تقويم توليفي لدروس الدورة الأولى وضبط مؤشرات التمكن"}
                        </td>
                      </tr>
                    )}
                    {track.dsCount >= 4 && (
                      <tr className="border-b border-slate-200 bg-indigo-50/40">
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-indigo-950">
                          S1
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">
                          {isFr ? "Devoir Surveillé N° 4 (DS 4 — Spécial Sciences Math) & Bilan S1" : "الفرض المحروس رقم 4 (خاص بمسلك العلوم الرياضية) ومسك نقط الدورة 1"}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                          {isFr ? "Semaine 18 (Fin Janvier)" : "الأسبوع 18 (أواخر يناير)"}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {isFr
                            ? "4e DS officiel Note 142-08 (Arithmétique / Structures / Analyse) et saisie MASSAR"
                            : "الفرض الرابع الرسمي وفق المذكرة 142-08 للعلوم الرياضية واحتساب معدل الدورة 1"}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-200 bg-emerald-50/30">
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-950">
                        S2
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        {isFr ? `Reprise des Apprentissages & Devoir Surveillé N° 1 (S2 — ${track.durationFr})` : `انطلاق الدورة 2 والفرض المحروس رقم 1 (${track.durationAr})`}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                        {isFr ? "Semaine 24-25 (Mars)" : "الأسبوع 24-25 (مارس)"}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {isFr
                          ? "Évaluation sur les nouvelles unités (Intégrales, Complexes, Géométrie)"
                          : "تقويم الوحدات الجديدة (التكامل، الأعداد العقدية، الفضاء، الاحتمالات)"}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-950">
                        S2
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        {isFr ? `Devoir Surveillé N° 2 (S2 — ${track.durationFr})` : `الفرض المحروس رقم 2 (الدورة الثانية — ${track.durationAr})`}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                        {isFr ? "Semaine 28-29 (Avril)" : "الأسبوع 28-29 (أبريل)"}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {isFr
                          ? "Contrôle continu de synthèse et consolidation des compétences du Bac"
                          : "تثبيت الكفايات الأساسية المستهدفة في الامتحان الوطني / الجهوي الموحد"}
                      </td>
                    </tr>
                    {track.dsCount >= 3 && (
                      <tr className="border-b border-slate-200 bg-amber-50/40">
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-amber-950">
                          S2
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">
                          {isFr ? "Devoir Surveillé N° 3 / Examen Blanc (Bac Blanc)" : "الفرض المحروس رقم 3 / الامتحان التجريبي الموحد (Bac Blanc)"}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                          {isFr ? "Semaine 32-33 (Mai)" : "الأسبوع 32-33 (ماي)"}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {isFr
                            ? "Simulation en conditions réelles d'examen (Sujet national complet sur 20 pts)"
                            : "محاكاة واقعية لشروط الامتحان الوطني/الجهوي بموضوع توليفي شامل وتدبير الزمن"}
                        </td>
                      </tr>
                    )}
                    {track.dsCount >= 4 && (
                      <tr className="border-b border-slate-200 bg-emerald-50/50">
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-950">
                          S2
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">
                          {isFr ? "Devoir Surveillé N° 4 (S2 — Synthèse Finale SM)" : "الفرض المحروس رقم 4 (الدورة الثانية — توليف شامل علوم رياضية)"}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                          {isFr ? "Semaine 34 (Fin Mai)" : "الأسبوع 34 (أواخر ماي)"}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700">
                          {isFr
                            ? "Dernier DS de synthèse (Structures algébriques, Probabilités & Analyse)"
                            : "الفرض الرابع للدورة الثانية (البنيات الجبرية والاحتمالات والتحليل) قبل الوطني"}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-rose-50/40 font-bold">
                      <td className="border border-slate-300 p-2 text-center font-mono font-extrabold text-rose-950">
                        CERTIF
                      </td>
                      <td className="border border-slate-300 p-2 text-rose-950">
                        {isMission
                          ? track.code.startsWith("TERM_")
                            ? "🎓 Épreuves Finales de Spécialité du Baccalauréat & Grand Oral (AEFE)"
                            : track.code.startsWith("1ERE_")
                            ? "🎓 Épreuves Anticipées du Baccalauréat & Validation Annuelle LSL"
                            : "🎓 Conseil de Classe du 3e Trimestre & Passage en 1ère Générale"
                          : isFr
                          ? is2Bac
                            ? "🎓 Examen National du Baccalauréat (Session Normale)"
                            : is1Bac
                            ? "🎓 Examen Régional Unifié de la 1ère Année du Bac"
                            : "🎓 Conseils de Classe & Orientation vers le Cycle Baccalauréat"
                          : is2Bac
                          ? "🎓 الامتحان الوطني الموحد لنيل شهادة البكالوريا (الدورة العادية)"
                          : is1Bac
                          ? "🎓 الامتحان الجهوي الموحد للسنة الأولى من سلك البكالوريا"
                          : "🎓 مجالس الأقسام والتوجيه التربوي نحو مسالك السنة الأولى بكالوريا"}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-rose-950">
                        {isFr ? "Semaine 36 (Juin)" : "الأسبوع 36 (أوائل يونيو)"}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-800">
                        {isMission
                          ? "Épreuves terminales / Bilans LSL (Livret Scolaire du Lycée) et jurys académiques AEFE"
                          : isFr
                          ? "Épreuve certificative officielle suivie des délibérations et session de rattrapage (Juillet)"
                          : "الاستحقاق الإشهادي الرسمي يليه إعلان النتائج والدورة الاستدراكية (يوليوز)"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            </>
            )}

            {/* تفصيل وحدات ومقرر الدورة الأولى (Semestre 1) */}
            {effectivePrintScope !== "SPEC_GRID_ONLY" && effectivePrintScope !== "SOLUTIONS_ONLY" && (
            <div data-sync-section="EXERCISES" className="space-y-3 avoid-break">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                <h4 className="font-black text-sm text-indigo-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-900 text-white flex items-center justify-center font-mono text-xs">
                    S1
                  </span>
                  <span>{isFr ? "Programme Détaillé du Premier Semestre (S1)" : "التوزيع البيداغوجي المفصل للدورة الأولى (S1)"}</span>
                </h4>
                <span className="font-mono text-xs text-indigo-900 font-bold">
                  {s1Lessons.length} {isFr ? "chapitres" : "دروس"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs bg-white">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold">
                      <th className="border border-slate-300 p-2 text-center w-12">N°</th>
                      <th className="border border-slate-300 p-2 text-start min-w-[180px]">
                        {isFr ? "Chapitre / Unité d'apprentissage" : "عنوان الدرس / الوحدة الدراسية"}
                      </th>
                      <th className="border border-slate-300 p-2 text-center w-24">
                        {isFr ? "Horaire" : "الغلاف الساعي"}
                      </th>
                      <th className="border border-slate-300 p-2 text-start">
                        {isFr ? "Capacités attendues & Compétences majeures" : "القدرات الأساسية والمهام الديداكتيكية المنتظرة"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {s1Lessons.map((lesson, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-slate-700">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">
                          {isFr ? lesson.lessonFr : `${lesson.lessonAr} / ${lesson.lessonFr}`}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold tabular-nums text-indigo-950">
                          {lesson.hours}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700 leading-relaxed text-[11px]">
                          {(isFr ? lesson.capacitiesFr : lesson.capacitiesAr).join(" · ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {/* تفصيل وحدات ومقرر الدورة الثانية (Semestre 2) */}
            {effectivePrintScope !== "SPEC_GRID_ONLY" && (
            <div data-sync-section="SOLUTIONS" className="space-y-3 avoid-break">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                <h4 className="font-black text-sm text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-800 text-white flex items-center justify-center font-mono text-xs">
                    S2
                  </span>
                  <span>{isFr ? "Programme Détaillé du Deuxième Semestre (S2)" : "التوزيع البيداغوجي المفصل للدورة الثانية (S2)"}</span>
                </h4>
                <span className="font-mono text-xs text-emerald-900 font-bold">
                  {s2Lessons.length} {isFr ? "chapitres" : "دروس"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs bg-white">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold">
                      <th className="border border-slate-300 p-2 text-center w-12">N°</th>
                      <th className="border border-slate-300 p-2 text-start min-w-[180px]">
                        {isFr ? "Chapitre / Unité d'apprentissage" : "عنوان الدرس / الوحدة الدراسية"}
                      </th>
                      <th className="border border-slate-300 p-2 text-center w-24">
                        {isFr ? "Horaire" : "الغلاف الساعي"}
                      </th>
                      <th className="border border-slate-300 p-2 text-start">
                        {isFr ? "Capacités attendues & Compétences majeures" : "القدرات الأساسية والمهام الديداكتيكية المنتظرة"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {s2Lessons.map((lesson, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-slate-700">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">
                          {isFr ? lesson.lessonFr : `${lesson.lessonAr} / ${lesson.lessonFr}`}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold tabular-nums text-emerald-950">
                          {lesson.hours}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-700 leading-relaxed text-[11px]">
                          {(isFr ? lesson.capacitiesFr : lesson.capacitiesAr).join(" · ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {/* توقيعات الاعتماد والمصادقة الإدارية والتفتيشية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs avoid-break">
              <div className="border border-slate-300 rounded-xl p-3 h-24 bg-white">
                <div className="font-extrabold text-slate-900">
                  {isFr ? "Signature du Professeur :" : "توقيع الأستاذ(ة) المنسق:"}
                </div>
                <div className="text-[10px] text-slate-500 pt-1 font-mono">{prof}</div>
              </div>
              <div className="border border-slate-300 rounded-xl p-3 h-24 bg-white">
                <div className="font-extrabold text-slate-900">
                  {isFr ? "Visa du Chef d'Établissement :" : "تأشيرة السيد رئيس المؤسسة (المدير):"}
                </div>
                <div className="text-[10px] text-slate-500 pt-1 font-mono">{school}</div>
              </div>
              <div className="border border-slate-300 rounded-xl p-3 h-24 bg-white">
                <div className="font-extrabold text-slate-900">
                  {isFr ? "Visa de l'Inspecteur Pédagogique :" : "تأشيرة وملاحظات السيد(ة) المفتش(ة) التربوي(ة):"}
                </div>
                <div className="text-[10px] text-slate-400 italic pt-1">
                  {isFr ? "Approuvé et visé le ...................." : "تمت المعاينة والمصادقة بتاريخ ................"}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* صندوق رمز الاستجابة السريعة (QR Code) للنسخة التفاعلية الرقمية للفرض في أسفل وثيقة PDF */}
      {effectiveIncludeInteractiveQr && (
        <InteractiveExamQrFooter
          url={resolvedInteractiveQuizUrl}
          docLang={isFr ? "FR" : "AR"}
          trackTitleAr={track.labelAr}
          trackTitleFr={track.labelFr}
          trackCode={track.code}
          semester={sem}
          dsNumber={dsKey.replace("DS", "") || "1"}
          examModel={examModel === "B" ? "B" : "A"}
          durationAr={track.durationAr}
          durationFr={track.durationFr}
          n1={n1}
          n2={n2}
          n3={n3}
          onOpenInteractiveQuiz={onOpenInteractiveQuiz}
          onToggleVisibility={handleToggleInteractiveQr}
        />
      )}

      {/* تذييل الصفحة الجاري لحزمة fancyhdr (\fancyfoot) */}
      {latexPackageTheme === "FANCYHDR" && (
        <div className="border-t border-slate-900 pt-2 mt-6 flex items-center justify-between text-[10.5px] font-mono font-bold text-slate-700">
          <span>{school}</span>
          <span>— Page 1 / 1 (\thepage) —</span>
          <span>Barème Officiel : 20 / 20</span>
        </div>
      )}
      </div>

      {/* الحل المبتكر 3: استوديو العرض الصفي والمسلاط (Classroom Projector Modal) */}
      {projectedQuestion && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 no-print"
          dir="rtl"
          onClick={() => setProjectedQuestion(null)}
        >
          <div
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-10 space-y-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  📽️
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    وضع العرض الصفي والمسلاط (Mode TBI / Datashow)
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    عرض السؤال بحجم مكبر مع صيغ رياضية فائقة الوضوح للتلاميذ في الفصل
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProjectedQuestion(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            <div className="py-6 px-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-right">
              {projectedQuestion.label && (
                <div className="inline-block bg-slate-900 text-cyan-300 font-mono text-xs font-black px-3 py-1 rounded-lg mb-4">
                  {projectedQuestion.label}
                </div>
              )}
              <div className="text-lg sm:text-2xl font-bold text-slate-900 leading-[2.4] select-text">
                <MathText text={projectedQuestion.text} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-bold border-t border-slate-100">
              <span>انقر بالخارج أو على ✕ للعودة لمعاينة الفرض A4</span>
              <button
                type="button"
                onClick={() => setProjectedQuestion(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer"
              >
                إغلاق العرض الصفي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PrintablePreview.displayName = "PrintablePreview";
