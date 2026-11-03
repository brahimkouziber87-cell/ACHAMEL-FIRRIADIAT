import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CalendarRange,
  Calculator,
  Check,
  CheckCircle2,
  Cloud,
  CloudUpload,
  Code2,
  Compass,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck2,
  FileDown,
  FileJson,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderOpen,
  GraduationCap,
  Highlighter,
  Layers,
  Link2,
  LogOut,
  MapPin,
  Menu,
  Mic,
  PenLine,
  Percent,
  Printer,
  RectangleHorizontal,
  RectangleVertical,
  Redo2,
  RefreshCw,
  RotateCcw,
  Scale,
  School,
  Sliders,
  Smartphone,
  Sparkles,
  Stethoscope,
  Table2,
  Tag,
  Trash2,
  Type,
  Undo2,
  Upload,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { User } from "firebase/auth";
import {
  BilingualLayout,
  BRANCH_COLOR_THEMES,
  BranchColorGradientMode,
  computeExactExerciseEffectiveWeights,
  CURRICULUM_DB,
  CycleType,
  DMSubType,
  DOC_FONT_OPTIONS,
  DocFontFamily,
  DocFontSize,
  DocLanguage,
  DSQuestionDensity,
  EducationSystem,
  ExamModel,
  ExportFormat,
  FRENCH_COMPETENCIES,
  GEOGEBRA_PRESET_LIBRARY,
  GeoGebraResource,
  getAutoGeoGebraResourceForLesson,
  getLessonBadgeColor,
  getLessonTags,
  getQuestionBaremesAndLevels,
  getTitleOrnamentMiniPreview,
  getExamenBlanc2BacConfig,
  getVariantQuestions,
  HeaderStyle,
  InsertedFigure,
  isGeometryOrSpatialLesson,
  LESSON_HEADER_ICON_OPTIONS,
  LESSON_TAG_OPTIONS,
  LessonHeaderIconId,
  LessonItem,
  lessonMatchesTagFilter,
  MISSION_SCHOOLS,
  ModuleType,
  MOROCCAN_HEADER_SVG_FRAME_OPTIONS,
  MoroccanDSStructureMode,
  MoroccanQCMItem,
  QCMGeneratorConfig,
  QCMScoringMode,
  resolveLessonHeaderIcon,
  SemesterType,
  SolutionDisplayMode,
  SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS,
  TRADITIONAL_TITLE_FONT_OPTIONS,
  TraditionalTitleFontId,
} from "./data/curriculum";
import {
  AppliedTitleCalligraphyConfig,
  ArabicCalligraphySimulator,
} from "./components/ArabicCalligraphySimulator";
import { generateOfflineSourceCode } from "./utils/docGenerator";
import {
  exportBookletImposedPDF,
  computePrintMediaQueryMetrics,
  exportPedagogicalAuditReportToPDF,
  exportPreviewToPDF,
  exportStandaloneHTML,
  PrintPageSizePreset,
} from "./utils/pdfExporter";
import {
  buildCustomEvaluationGrid,
  DEFAULT_MOROCCAN_CLASS_ROSTER,
  exportEvaluationGridToCSV,
  exportEvaluationGridToExcel,
  exportMassarPronoteGradeSheet,
  GridGranularity,
} from "./utils/evaluationGridExporter";
import {
  convertBlueprintToSimulatedLessons,
  IMPORTED_EXAMS_ARCHIVE,
  ImportedExamBlueprint,
  SimulationMode,
} from "./utils/importedExamSimulator";
import {
  ImportedExamSimulatorPanel,
  ImportSimulatorTabId,
} from "./components/ImportedExamSimulatorPanel";
import {
  DocumentViewMarginModelId,
  LessonHeaderIconBadge,
  LessonHeaderIconSvg,
  PrintablePreview,
  resolveAutoDocViewMarginModel,
} from "./components/PrintablePreview";
import { TouchPreviewCanvas } from "./components/TouchPreviewCanvas";
import {
  SpecMatrix2DInspectorCard,
  AdaptiveApplyPayload,
} from "./components/SpecMatrix2DInspectorCard";
import { TeacherLogo, TeacherLogoVariant } from "./components/TeacherLogo";
import { SideNavigationMenu } from "./components/SideNavigationMenu";
import { TopNavigationHeader } from "./components/TopNavigationHeader";
import { APKInstallModal } from "./components/APKInstallModal";
import { SmartQcmScannerModal } from "./components/SmartQcmScannerModal";
import { IndividualRemediationStudioModal } from "./components/IndividualRemediationStudioModal";
import { CrossPlatformSyncModal } from "./components/CrossPlatformSyncModal";
import { MathSymbolPaletteBar } from "./components/MathSymbolPaletteBar";
import {
  DocumentVoiceDictationStudio,
  InlineVoiceDictationButton,
} from "./components/VoiceDictationControl";
import { ExamBaremeManagerModal } from "./components/ExamBaremeManagerModal";
import { ExportCenterModal } from "./components/ExportCenterModal";
import {
  ExportDashboardModal,
  ExportHistoryEntry,
  loadExportHistory,
  recordExportHistoryEntry,
} from "./components/ExportDashboardModal";
import { MoroccanDMType, MOROCCAN_DM_PRESETS } from "./utils/seriesGenerator";
import {
  convertExercisesToInteractiveQuiz,
  InteractiveQuizData,
} from "./utils/quizGenerator";
import { InteractiveQuizModal } from "./components/InteractiveQuizModal";
import { WolframAlphaVerifierModal } from "./components/WolframAlphaVerifierModal";
import { ExamConfigStorageModal } from "./components/ExamConfigStorageModal";
import { ExamConfigBlueprintJSON, loadSavedConfigVault } from "./utils/examConfigStorage";
import { BatchPrintModal, BatchPrintItem, BatchPrintOptions } from "./components/BatchPrintModal";
import { DidacticChecklistModal } from "./components/DidacticChecklistModal";
import { RemedialExamModal } from "./components/RemedialExamModal";
import {
  AdvancedMathPedagogyModal,
  AdvancedPedagogyTabId,
} from "./components/AdvancedMathPedagogyModal";
import {
  DEFAULT_TCOLORBOX_CONFIG,
  LATEX_PACKAGE_OPTIONS,
  LatexPackageTheme,
  PaperSurfaceTexture,
  StudentGridStyle,
  TCOLORBOX_FRAME_OPTIONS,
  TCOLORBOX_PALETTE_OPTIONS,
  TCOLORBOX_SHADING_OPTIONS,
  TcolorboxCustomConfig,
} from "./utils/latexPackagesAndMath";
import { PythonAlgorithmLabModal } from "./components/PythonAlgorithmLabModal";
import {
  AiPedagogicalTask,
  PedagogicalAiAssistantModal,
} from "./components/PedagogicalAiAssistantModal";
import { PythonAlgorithmPreset } from "./data/pythonAlgorithms";
import { generateOverleafZipBundle } from "./utils/overleafZipExporter";
import {
  deleteDriveDocument,
  DriveFileItem,
  fetchSettingsFromDrive,
  getAccessToken,
  googleSignIn,
  initAuth,
  listSavedDriveDocuments,
  logout,
  SETTINGS_FILE_NAME,
  syncSettingsToDrive,
  SyncSettingsPayload,
  uploadDocumentToDrive,
} from "./services/googleDrive";
import { GoogleDriveSyncModal } from "./components/GoogleDriveSyncModal";
import {
  isLocalEncryptionEnabled,
  setLocalEncryptionEnabled,
} from "./utils/cryptoStorage";
import {
  DEFAULT_LONGITUDINAL_COHORT_CONFIG,
  DifferentiatedPathConfig,
  LongitudinalCohortTrackerConfig,
  detectDoublePenaltyInLessons,
  getDefaultDifferentiatedPathForTrack,
  sanitizeAndValidateQuestionsList,
  analyzeDidacticProgressionAndTimeBudget,
  runFullEdTechDocumentDiagnostics,
} from "./utils/mathjsValidator";
import type { MathInspectorStudioTabId } from "./components/MathTeacherInspectorStudioModal";
import {
  FourProposalsInnovationStudioModal,
  InnovationProposalTabId,
} from "./components/FourProposalsInnovationStudioModal";
import { CompetencyQuestionBankModal } from "./components/CompetencyQuestionBankModal";
import { OfficialMassarExportModal } from "./components/OfficialMassarExportModal";
import { DiagnosticClassAnalysisModal } from "./components/DiagnosticClassAnalysisModal";
import { BookletFoldedModeModal } from "./components/BookletFoldedModeModal";
import { InteractiveQrRemediationModal } from "./components/InteractiveQrRemediationModal";
import { ExamConsignesSelector } from "./components/ExamConsignesSelector";
import { OFFICIAL_DIDACTIC_CONSIGNES } from "./data/didacticConsignes";
import type { CompetencyExerciseItem } from "./data/competencyQuestionBank";

const MathTeacherInspectorStudioModal = React.lazy(
  () => import("./components/MathTeacherInspectorStudioModal")
);

const STORAGE_KEY = "pedagogical_math_prefs_v4";

interface SavedPreferences {
  educationSystem: EducationSystem;
  school: string;
  prof: string;
  year: string;
  academy: string;
  direction: string;
  headerStyle: HeaderStyle;
  includeStudentBox: boolean;
  includeGradeBox: boolean;
  calculatorAllowed: boolean;
  includeCompetencies: boolean;
  examModel: ExamModel;
  shuffleQuestions: boolean;
  shuffleExercises: boolean;
  docLang: DocLanguage;
  bilingualLayout: BilingualLayout;
  exportFormat: ExportFormat;
  activeModule: ModuleType;
  selectedTrackCode: string;
  semester: SemesterType;
  dsKey: string;
  n1: number;
  n2: number;
  n3: number;
  fillBlanks: boolean;
  includeTICE: boolean;
  dmSubType: DMSubType;
  dmNumber: string;
  dmDueDate: string;
  includeHints: boolean;
  includeTeacherLogo: boolean;
  logoVariant: TeacherLogoVariant;
  includeLogoWatermark: boolean;
  customLogoUrl: string | null;
  docFontFamily: DocFontFamily;
  docFontSize: DocFontSize;
  includeDetailedSolutions?: boolean;
  solutionDisplayMode?: SolutionDisplayMode;
  showQuestionBareme?: boolean;
  includeAnswerWorkspace?: boolean;
  includeGradingScaleTable?: boolean;
  includeSelfEvalGrid?: boolean;
  serieExerciseCount?: number;
  isCustomLessonMode?: boolean;
  selectedLessonIndices?: number[];
  customWeightsMap?: Record<string, number>;
  customLessonIconsMap?: Record<string, LessonHeaderIconId>;
  dsStructureMode?: MoroccanDSStructureMode;
  dsQuestionDensity?: DSQuestionDensity;
  latexPackageTheme?: LatexPackageTheme;
  paperSurface?: PaperSurfaceTexture;
  enableBranchColorGradient?: boolean;
  branchColorMode?: BranchColorGradientMode;
  includeInteractiveQrFooter?: boolean;
  studentGridStyle?: StudentGridStyle;
  appliedTitleCalligraphy?: AppliedTitleCalligraphyConfig;
}

const DEFAULT_PREFS: SavedPreferences = {
  educationSystem: "MAROC_NATIONAL",
  school: "ROOSEVELT SCHOOL 2",
  prof: "Prof. Brahim KOUZIBER",
  year: "2026-2027",
  academy: "الأكاديمية الجهوية للتربية والتكوين لجهة الدار البيضاء-سطات",
  direction: "المديرية الإقليمية أنفا",
  headerStyle: "OFFICIAL_AREF",
  includeStudentBox: true,
  includeGradeBox: true,
  calculatorAllowed: true,
  includeCompetencies: true,
  examModel: "A",
  shuffleQuestions: true,
  shuffleExercises: false,
  docLang: "FR",
  bilingualLayout: "SIDE_BY_SIDE",
  exportFormat: "PDF",
  activeModule: "DS_142_08",
  selectedTrackCode: "2BAC_PC",
  semester: "S1",
  dsKey: "DS1",
  n1: 35,
  n2: 45,
  n3: 20,
  fillBlanks: true,
  includeTICE: true,
  dmSubType: "DEVOIR_MAISON",
  dmNumber: "N° 1",
  dmDueDate: "2026-11-15",
  serieExerciseCount: 6,
  includeHints: true,
  includeTeacherLogo: true,
  logoVariant: "DOC2APP_MONO",
  includeLogoWatermark: false,
  customLogoUrl: null,
  docFontFamily: "ACADEMIC_SERIF",
  docFontSize: "NORMAL",
  includeDetailedSolutions: false,
  solutionDisplayMode: "SEPARATE_PAGE_ANNEXES",
  showQuestionBareme: true,
  includeAnswerWorkspace: false,
  includeGradingScaleTable: true,
  includeSelfEvalGrid: true,
  isCustomLessonMode: false,
  selectedLessonIndices: [0, 1],
  customWeightsMap: {},
  customLessonIconsMap: {},
  dsStructureMode: "EXERCICES_ET_PROBLEME",
  dsQuestionDensity: "INTENSIVE",
  latexPackageTheme: "TCOLORBOX",
  paperSurface: "PLAIN_WHITE",
  enableBranchColorGradient: true,
  branchColorMode: "AUTO_BY_LESSON",
  includeInteractiveQrFooter: true,
  studentGridStyle: "SEYES_FRENCH",
  appliedTitleCalligraphy: {
    fontId: "DEFAULT_DOC",
    scale: "BALANCED",
    ornament: "NONE",
    scope: "HEADER_TITLES",
    enableMoroccanHeaderOrnament: true,
    customLetterSpacingEm: 0.025,
  },
};

function loadInitialPrefs(): SavedPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

interface QuickEditorSnapshot {
  customDocTitle: string;
  customDocSubtitle: string;
  customHeaderNote: string;
  customExerciseTitles: Record<number, string>;
  customWeightsMap: Record<string, number>;
  customLessonIconsMap: Record<string, LessonHeaderIconId>;
  school: string;
  prof: string;
}

export default function App() {
  const initial = useMemo(() => loadInitialPrefs(), []);

  // 1. نظام التعليم (مغربي وطني أو بعثة فرنسية)
  const [educationSystem, setEducationSystem] = useState<EducationSystem>(
    initial.educationSystem || "MAROC_NATIONAL"
  );
  const isMission = educationSystem === "MISSION_FRANCAISE";

  // 2. المعطيات الإدارية والمؤسسية وترويسة الملفات
  const [school, setSchool] = useState<string>(() => {
    if (typeof window !== "undefined" && (window as any).db?.teacherProfile?.school) {
      return (window as any).db.teacherProfile.school;
    }
    return initial.school;
  });
  const [prof, setProf] = useState<string>(() => {
    if (typeof window !== "undefined" && (window as any).db?.teacherProfile?.name) {
      return (window as any).db.teacherProfile.name;
    }
    return initial.prof;
  });
  const [year, setYear] = useState<string>(initial.year);
  const [academy, setAcademy] = useState<string>(initial.academy);
  const [direction, setDirection] = useState<string>(initial.direction);
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>(initial.headerStyle);
  const [includeStudentBox, setIncludeStudentBox] = useState<boolean>(
    initial.includeStudentBox
  );
  const [includeGradeBox, setIncludeGradeBox] = useState<boolean>(initial.includeGradeBox);
  const [calculatorAllowed, setCalculatorAllowed] = useState<boolean>(
    initial.calculatorAllowed ?? true
  );
  const [includeCompetencies, setIncludeCompetencies] = useState<boolean>(
    initial.includeCompetencies ?? true
  );
  const [includeTeacherLogo, setIncludeTeacherLogo] = useState<boolean>(
    initial.includeTeacherLogo ?? true
  );
  const [logoVariant, setLogoVariant] = useState<TeacherLogoVariant>(
    initial.logoVariant || "DOC2APP_MONO"
  );
  const [includeLogoWatermark, setIncludeLogoWatermark] = useState<boolean>(
    initial.includeLogoWatermark ?? false
  );
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(
    initial.customLogoUrl || null
  );
  const [showLogoStudio, setShowLogoStudio] = useState<boolean>(false);
  const [showAPKModal, setShowAPKModal] = useState<boolean>(false);
  const [showSmartQcmScannerModal, setShowSmartQcmScannerModal] = useState<boolean>(false);
  const [showIndividualRemediationModal, setShowIndividualRemediationModal] = useState<boolean>(false);
  const [showCrossPlatformSyncModal, setShowCrossPlatformSyncModal] = useState<boolean>(false);

  // 3. نظام النماذج المتعددة لمنع الغش (Modèle A / Modèle B / A+B)
  const [examModel, setExamModel] = useState<ExamModel>(initial.examModel);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(initial.shuffleQuestions);
  const [shuffleExercises, setShuffleExercises] = useState<boolean>(initial.shuffleExercises);

  // 4. إعدادات اللغة والتخطيط والتصدير
  const [docLang, setDocLang] = useState<DocLanguage>(initial.docLang);
  const [bilingualLayout, setBilingualLayout] = useState<BilingualLayout>(
    initial.bilingualLayout
  );
  const [exportFormat, setExportFormat] = useState<ExportFormat>(initial.exportFormat);

  // 5. الوحدة البيداغوجية والمسلك والفصل
  const [activeModule, setActiveModule] = useState<ModuleType>(initial.activeModule);
  const [cycleFilter, setCycleFilter] = useState<CycleType>("ALL");
  const [selectedTrackCode, setSelectedTrackCode] = useState<string>(
    initial.selectedTrackCode
  );
  const [semester, setSemester] = useState<SemesterType>(initial.semester);
  const [dsKey, setDsKey] = useState<string>(initial.dsKey);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState<number>(0);

  // 6. إعدادات الفروض المنزلية والسلاسل (DM & Séries TD)
  const [dmSubType, setDmSubType] = useState<DMSubType>(
    initial.dmSubType || "DEVOIR_MAISON"
  );
  const [dmNumber, setDmNumber] = useState<string>(initial.dmNumber || "N° 1");
  const [dmDueDate, setDmDueDate] = useState<string>(initial.dmDueDate || "2026-11-15");
  const [serieExerciseCount, setSerieExerciseCount] = useState<number>(
    initial.serieExerciseCount || 6
  );
  const [includeHints, setIncludeHints] = useState<boolean>(initial.includeHints ?? true);
  const [moroccanDMType, setMoroccanDMType] = useState<MoroccanDMType>("RECHERCHE_SYNTHESE");
  const [includeLessonMemo, setIncludeLessonMemo] = useState<boolean>(true);
  const [includeDMContract, setIncludeDMContract] = useState<boolean>(true);
  const [showMathPalette, setShowMathPalette] = useState<boolean>(false);

  // 7. اختيار الدروس وتخصيص النسب المئوية لكل درس وتجزئة النقط والأسئلة
  const [isCustomLessonMode, setIsCustomLessonMode] = useState<boolean>(
    initial.isCustomLessonMode ?? false
  );
  const [selectedLessonIndices, setSelectedLessonIndices] = useState<number[]>(
    initial.selectedLessonIndices || [0, 1]
  );
  const [customWeightsMap, setCustomWeightsMap] = useState<Record<string, number>>(
    initial.customWeightsMap || {}
  );
  const [customLessonIconsMap, setCustomLessonIconsMap] = useState<
    Record<string, LessonHeaderIconId>
  >(initial.customLessonIconsMap || {});
  const [customQuestionBaremesMap, setCustomQuestionBaremesMap] = useState<Record<string, number[]>>({});
  const [customQuestionLevelsMap, setCustomQuestionLevelsMap] = useState<
    Record<string, Array<"N1" | "N2" | "N3">>
  >({});
  const [customQuestionsMap, setCustomQuestionsMap] = useState<
    Record<string, { ar: string[]; fr: string[] }>
  >({});
  const [isBaremeModalOpen, setIsBaremeModalOpen] = useState<boolean>(false);
  const [isExportCenterOpen, setIsExportCenterOpen] = useState<boolean>(false);
  const [isJsonConfigModalOpen, setIsJsonConfigModalOpen] = useState<boolean>(false);
  const [showAuditPanel, setShowAuditPanel] = useState<boolean>(false);
  const skipTrackResetRef = useRef<boolean>(true);
  const [col1Tab, setCol1Tab] = useState<"TRACK_EXAM" | "IDENTITY" | "FONTS_PAGE">(
    "TRACK_EXAM"
  );

  // إعدادات الجذاذة التربوية الرسمية (FICHE_OP2007)
  const [ficheScenarioDisplayMode, setFicheScenarioDisplayMode] = useState<"GRID_OFFICIAL" | "CARDS_BY_SESSION" | "BOTH">("BOTH");
  const [ficheContentDetailLevel, setFicheContentDetailLevel] = useState<"FULL_WITH_PROOFS" | "SYNTHETIC_OFFICIAL">("FULL_WITH_PROOFS");
  const [includeFichePlanningMatrix, setIncludeFichePlanningMatrix] = useState<boolean>(true);
  const [includeFicheTICE, setIncludeFicheTICE] = useState<boolean>(true);
  const [includeFicheFormativeEval, setIncludeFicheFormativeEval] = useState<boolean>(true);

  // 8. إعدادات الرائز التشخيصي
  const [diagDuration, setDiagDuration] = useState<string>("1h");
  const [diagType, setDiagType] = useState<string>("MIXED");

  // 9. الضوابط الديداكتيكية والمستويات المهارية
  const [n1, setN1] = useState<number>(initial.n1);
  const [n2, setN2] = useState<number>(initial.n2);
  const [n3, setN3] = useState<number>(initial.n3);
  const [fillBlanks, setFillBlanks] = useState<boolean>(initial.fillBlanks);
  const [includeTICE, setIncludeTICE] = useState<boolean>(initial.includeTICE);
  const [customTopicNote, setCustomTopicNote] = useState<string>("");

  // 10. المخرجات والمعاينة والمحرر النصي السريع والخطوط والتمرير المتزامن
  const [viewMode, setViewMode] = useState<"CODE" | "PREVIEW" | "SPLIT">("PREVIEW");
  const [syncScrollEnabled, setSyncScrollEnabled] = useState<boolean>(true);
  const [activeSyncSection, setActiveSyncSection] = useState<string | null>(null);
  const codeScrollRef = useRef<HTMLPreElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const isSyncingScrollRef = useRef<"CODE" | "PREVIEW" | null>(null);
  const syncTimeoutRef = useRef<number | null>(null);
  const lastScrollRatioRef = useRef<number>(0);
  const [pageOrientation, setPageOrientation] = useState<"PORTRAIT" | "LANDSCAPE">("PORTRAIT");
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [showQuickEditor, setShowQuickEditor] = useState<boolean>(false);
  const [showCalligraphySimulator, setShowCalligraphySimulator] = useState<boolean>(false);
  const [appliedTitleCalligraphy, setAppliedTitleCalligraphy] =
    useState<AppliedTitleCalligraphyConfig>(
      initial.appliedTitleCalligraphy || {
        fontId: "DEFAULT_DOC",
        scale: "BALANCED",
        ornament: "NONE",
        scope: "HEADER_TITLES",
        enableMoroccanHeaderOrnament: true,
        customLetterSpacingEm: 0.025,
      }
    );
  const [isInlineEditable, setIsInlineEditable] = useState<boolean>(false);
  const [showQuickVoiceDictation, setShowQuickVoiceDictation] =
    useState<boolean>(false);
  const [customDocTitle, setCustomDocTitle] = useState<string>("");
  const [customDocSubtitle, setCustomDocSubtitle] = useState<string>("");
  const [customHeaderNote, setCustomHeaderNote] = useState<string>("");
  const [customExerciseTitles, setCustomExerciseTitles] = useState<Record<number, string>>({});
  const [docFontFamily, setDocFontFamily] = useState<DocFontFamily>(
    initial.docFontFamily || "ACADEMIC_SERIF"
  );
  const [docFontSize, setDocFontSize] = useState<DocFontSize>(
    initial.docFontSize || "NORMAL"
  );
  const [includeDetailedSolutions, setIncludeDetailedSolutions] = useState<boolean>(
    initial.includeDetailedSolutions ?? false
  );
  const [solutionDisplayMode, setSolutionDisplayMode] = useState<SolutionDisplayMode>(
    initial.solutionDisplayMode || "SEPARATE_PAGE_ANNEXES"
  );
  const [onlyPrintSolutions, setOnlyPrintSolutions] = useState<boolean>(false);
  const [savedBadge, setSavedBadge] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(() => new Date());
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("ALL");
  const [showQuestionBareme, setShowQuestionBareme] = useState<boolean>(
    initial.showQuestionBareme ?? true
  );
  const [includeAnswerWorkspace, setIncludeAnswerWorkspace] = useState<boolean>(
    initial.includeAnswerWorkspace ?? false
  );
  const [studentGridStyle, setStudentGridStyle] = useState<StudentGridStyle>(
    initial.studentGridStyle || "SEYES_FRENCH"
  );
  const [workspaceHeightMode, setWorkspaceHeightMode] = useState<
    "ADAPTIVE" | "COMPACT" | "GENEROUS"
  >("ADAPTIVE");
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState<boolean>(false);
  const [includeGradingScaleTable, setIncludeGradingScaleTable] = useState<boolean>(
    initial.includeGradingScaleTable ?? true
  );
  const [includeSelfEvalGrid, setIncludeSelfEvalGrid] = useState<boolean>(
    initial.includeSelfEvalGrid ?? true
  );
  // 10. ب-2: إعدادات بنية الفرض المحروس وفق المنهاج المغربي (142-08) وخطوط الكتابة باليد
  const [dsStructureMode, setDsStructureMode] =
    useState<MoroccanDSStructureMode>(
      initial.dsStructureMode || "EXERCICES_ET_PROBLEME"
    );
  const [dsQuestionDensity, setDsQuestionDensity] =
    useState<DSQuestionDensity>(initial.dsQuestionDensity || "INTENSIVE");
  const [includeMoroccanExamDirectives, setIncludeMoroccanExamDirectives] =
    useState<boolean>(true);
  const [handwrittenSolutionsOnly, setHandwrittenSolutionsOnly] =
    useState<boolean>(false);

  // 10. ج. حالات دعم GeoGebra التفاعلي وشبكات التقويم المخصصة (Excel & PDF)
  const [autoAttachGeoGebra, setAutoAttachGeoGebra] = useState<boolean>(true);
  const [geoGebraResourcesMap, setGeoGebraResourcesMap] = useState<
    Record<string, GeoGebraResource>
  >({});
  const [ggbTargetLessonKey, setGgbTargetLessonKey] =
    useState<string>("__ALL_GEOMETRY__");
  const [ggbLinkInput, setGgbLinkInput] = useState<string>("");
  const [ggbCustomTitleInput, setGgbCustomTitleInput] = useState<string>("");
  const [includeCustomEvalGridSheet, setIncludeCustomEvalGridSheet] =
    useState<boolean>(false);
  const [onlyPrintEvalGrid, setOnlyPrintEvalGrid] = useState<boolean>(false);
  const [evalGridGranularity, setEvalGridGranularity] =
    useState<GridGranularity>("BY_QUESTION");
  const [evalGridStudentCount, setEvalGridStudentCount] = useState<number>(25);
  const [isExportingEvalGridPDF, setIsExportingEvalGridPDF] =
    useState<boolean>(false);
  const [insertedFigures, setInsertedFigures] = useState<InsertedFigure[]>([]);

  // 10. أ-2: حالة محاكاة الفروض المحروسة المستوردة (Imported Exam Simulator & Cloner)
  const [showImportedExamStudio, setShowImportedExamStudio] =
    useState<boolean>(false);
  const [isExamSimulationActive, setIsExamSimulationActive] =
    useState<boolean>(false);
  const [activeImportedBlueprint, setActiveImportedBlueprint] =
    useState<ImportedExamBlueprint | null>(IMPORTED_EXAMS_ARCHIVE[0]);
  const [importedStudioInitialTab, setImportedStudioInitialTab] =
    useState<ImportSimulatorTabId>("ARCHIVE");
  const [examSimulationMode, setExamSimulationMode] =
    useState<SimulationMode>("ISOMORPHIC_TWIN");
  const [examVariationSeed, setExamVariationSeed] = useState<number>(1);
  const [simulatedImportedLessons, setSimulatedImportedLessons] = useState<
    LessonItem[]
  >([]);

  // 10. أ-3: تبويب العمود الثالث وطي لوحة الإعدادات لتحقيق التناسق البصري
  const [col3Tab, setCol3Tab] = useState<"EVAL_MODELS" | "GEOGEBRA" | "EVAL_GRID">(
    "EVAL_MODELS"
  );
  const [isConfigDeckCollapsed, setIsConfigDeckCollapsed] =
    useState<boolean>(false);

  // 10. أ-3 (مكرر): المقترحات البيداغوجية الأربعة المضافة للفرض المحروس وملف الأستاذ
  const [includeExamFormulaSheet, setIncludeExamFormulaSheet] =
    useState<boolean>(false);
  const [includeDSStudentSelfCheck, setIncludeDSStudentSelfCheck] =
    useState<boolean>(true);
  const [includePostExamRemediationSheet, setIncludePostExamRemediationSheet] =
    useState<boolean>(false);
  const [includeOfficialExamCoverSheet, setIncludeOfficialExamCoverSheet] =
    useState<boolean>(false);

  // 10. أ-3 (جديد): حالة مختبر MathJS ومقترحات أستاذ المادة (1-3) ومقترحات المفتش التربوي (2-3)
  const [showMathInspectorStudioModal, setShowMathInspectorStudioModal] =
    useState<boolean>(false);
  const [mathInspectorStudioTab, setMathInspectorStudioTab] =
    useState<MathInspectorStudioTabId>("MATHJS_VALIDATOR");
  const [differentiatedPathConfig, setDifferentiatedPathConfig] =
    useState<DifferentiatedPathConfig>(() =>
      getDefaultDifferentiatedPathForTrack(
        initial.selectedTrackCode || "2BAC_PC"
      )
    );
  const [longitudinalCohortConfig, setLongitudinalCohortConfig] =
    useState<LongitudinalCohortTrackerConfig>(() => {
      try {
        const saved = localStorage.getItem("prof_math_longitudinal_cohort_v1");
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore read error
      }
      return DEFAULT_LONGITUDINAL_COHORT_CONFIG;
    });

  useEffect(() => {
    try {
      localStorage.setItem(
        "prof_math_longitudinal_cohort_v1",
        JSON.stringify(longitudinalCohortConfig)
      );
    } catch {
      // ignore write error
    }
  }, [longitudinalCohortConfig]);

  // 10. أ-4: شريط التنقل الجانبي الثابت والتحكم في طيه وحفظ الحالة محلياً (مطوي على شكل أيقونات افتراضياً لتحسين استغلال الشاشة)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("pedagogical_math_sidebar_collapsed");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [mobileConfigSheetOpen, setMobileConfigSheetOpen] = useState<boolean>(false);
  const [mobileActiveColumn, setMobileActiveColumn] = useState<1 | 2 | 3>(1);

  const handleOpenMobileConfigSheet = useCallback((col: 1 | 2 | 3 = 1) => {
    setMobileActiveColumn(col);
    setMobileConfigSheetOpen(true);
  }, []);

  // 11. نموذج الذكاء الاصطناعي الفعال (Gemini 3.8 Flash vs Gemini 4 Argon)
  const [selectedAiModel, setSelectedAiModel] = useState<
    "gemini-3.8-flash" | "gemini-4-argon"
  >(() => {
    try {
      const saved = localStorage.getItem("prof_math_ai_engine_prefs_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.modelChoice === "gemini-3.8-flash" ||
          parsed.modelChoice === "gemini-4-argon"
        ) {
          return parsed.modelChoice;
        }
      }
    } catch {
      // ignore storage read errors
    }
    return "gemini-3.8-flash";
  });

  // 12. نظام الاختبارات التفاعلية والتصحيح الآلي المباشر (Interactive Quizzes)
  const [showInteractiveQuizModal, setShowInteractiveQuizModal] =
    useState<boolean>(false);
  const [currentInteractiveQuiz, setCurrentInteractiveQuiz] =
    useState<InteractiveQuizData | null>(null);
  const [isAiConvertingQuiz, setIsAiConvertingQuiz] =
    useState<boolean>(false);

  // 13. حزمة تنسيق LaTeX الاحترافية وتخصيص tcolorbox وسطح الورقة وأداة التحقق عبر WolframAlpha
  const [latexPackageTheme, setLatexPackageTheme] =
    useState<LatexPackageTheme>(initial.latexPackageTheme || "TCOLORBOX");
  const [tcolorboxConfig, setTcolorboxConfig] = useState<TcolorboxCustomConfig>(
    DEFAULT_TCOLORBOX_CONFIG
  );
  const [paperSurface, setPaperSurface] =
    useState<PaperSurfaceTexture>(initial.paperSurface || "PLAIN_WHITE");
  const [showWolframVerifierModal, setShowWolframVerifierModal] =
    useState<boolean>(false);

  // 14. أستوديو الهندسة الديداكتيكية والرياضية المتقدمة (جدول التخصيص 2D، منحنى الدالة tkz-tab، OMR A/B/C/D، بنك الأخطاء، بنك البكالوريا، والسبورة التفاعلية TBI)
  const [showAdvancedPedagogyModal, setShowAdvancedPedagogyModal] =
    useState<boolean>(false);
  const [advancedPedagogyInitialTab, setAdvancedPedagogyInitialTab] =
    useState<AdvancedPedagogyTabId>("SPEC_2D");
  const [include2DSpecMatrix, setInclude2DSpecMatrix] = useState<boolean>(true);
  const [includeOMRBubbleSheet, setIncludeOMRBubbleSheet] =
    useState<boolean>(false);
  const [omrQuestionCount, setOmrQuestionCount] = useState<number>(10);
  const [enableFourModelsABCD, setEnableFourModelsABCD] =
    useState<boolean>(false);
  const [includeDidacticVigilanceSheet, setIncludeDidacticVigilanceSheet] =
    useState<boolean>(false);
  const [includeIndividualGradingStrip, setIncludeIndividualGradingStrip] =
    useState<boolean>(true);
  const [includeRescueHintsAndContinuity, setIncludeRescueHintsAndContinuity] =
    useState<boolean>(true);
  const [showDidacticChecklistModal, setShowDidacticChecklistModal] =
    useState<boolean>(false);
  const [showRemedialExamModal, setShowRemedialExamModal] =
    useState<boolean>(false);
  const [showA4LivePageBreaks, setShowA4LivePageBreaks] =
    useState<boolean>(false);
  const [printPageSizePreset, setPrintPageSizePreset] =
    useState<PrintPageSizePreset>("A4");
  const [customPageWidthMm, setCustomPageWidthMm] = useState<number>(210);
  const [customPageHeightMm, setCustomPageHeightMm] = useState<number>(297);
  const [simulatePrintMediaQuery, setSimulatePrintMediaQuery] =
    useState<boolean>(false);
  const [economicTwoUpPrintMode, setEconomicTwoUpPrintMode] =
    useState<boolean>(false);
  const [customPageMarginsMm, setCustomPageMarginsMm] = useState<{
    topMm: number;
    bottomMm: number;
    xMm: number;
    modelId: DocumentViewMarginModelId;
  } | null>(null);
  const [includeInteractiveQrFooter, setIncludeInteractiveQrFooter] =
    useState<boolean>(initial.includeInteractiveQrFooter ?? true);
  const hasHandledUrlQuizRef = useRef<boolean>(false);

  // 15. التدرج اللوني للنصوص والترويسات حسب تخصص المادة (الأزرق للتحليل، الأخضر للهندسة، العنبري للجبر، البنفسجي للاحتمالات)
  const [enableBranchColorGradient, setEnableBranchColorGradient] =
    useState<boolean>(initial.enableBranchColorGradient ?? true);
  const [branchColorMode, setBranchColorMode] =
    useState<BranchColorGradientMode>(
      initial.branchColorMode || "AUTO_BY_LESSON"
    );

  // 16. إعدادات وتطوير أسئلة الاختيار من متعدد (QCM) في الفروض المحروسة
  const [qcmQuestionCount, setQcmQuestionCount] = useState<number>(4);
  const [qcmScoringMode, setQcmScoringMode] = useState<QCMScoringMode>(
    "JUSTIFICATION_REQUIRED"
  );
  const [customQcmItems, setCustomQcmItems] = useState<MoroccanQCMItem[]>([]);
  const [showCustomQcmBuilder, setShowCustomQcmBuilder] =
    useState<boolean>(false);
  const [draftQcmStmtAr, setDraftQcmStmtAr] = useState<string>("");
  const [draftQcmStmtFr, setDraftQcmStmtFr] = useState<string>("");
  const [draftQcmOptA, setDraftQcmOptA] = useState<string>("");
  const [draftQcmOptB, setDraftQcmOptB] = useState<string>("");
  const [draftQcmOptC, setDraftQcmOptC] = useState<string>("");
  const [draftQcmOptD, setDraftQcmOptD] = useState<string>("");
  const [draftQcmCorrectCode, setDraftQcmCorrectCode] = useState<
    "أ" | "ب" | "ج" | "د"
  >("أ");
  const [draftQcmJustifAr, setDraftQcmJustifAr] = useState<string>("");

  const activeQcmConfig = useMemo<QCMGeneratorConfig>(
    () => ({
      questionCount: qcmQuestionCount,
      scoringMode: qcmScoringMode,
      customItems: customQcmItems,
      isMission,
    }),
    [qcmQuestionCount, qcmScoringMode, customQcmItems, isMission]
  );

  // 17. وضع الهندسة الفضائية ثلاثية الأبعاد (GeoGebra 3D .ggb) وتعليماتها الخاصة
  const [isGeoGebra3DMode, setIsGeoGebra3DMode] = useState<boolean>(true);
  const [selectedSpatialPresetId, setSelectedSpatialPresetId] = useState<
    | "SPHERE_PLANE"
    | "VECTOR_CROSS_PRODUCT"
    | "TETRAHEDRON_SECTION"
    | "LINES_IN_SPACE"
  >("SPHERE_PLANE");

  // 18. مختبر بايثون ومساعد الذكاء الاصطناعي البيداغوجي المطور وحزمة Overleaf ZIP ولوحة الملفات المصدرة
  const [showPythonLabModal, setShowPythonLabModal] = useState<boolean>(false);
  const [showPedagogicalAiModal, setShowPedagogicalAiModal] = useState<boolean>(false);
  const [pedagogicalAiInitialView, setPedagogicalAiInitialView] = useState<
    "WORKSPACE" | "SETTINGS_DOCS"
  >("WORKSPACE");
  const [pedagogicalAiInitialTask, setPedagogicalAiInitialTask] = useState<
    AiPedagogicalTask | undefined
  >(undefined);
  const [pedagogicalAiInitialLessonIdx, setPedagogicalAiInitialLessonIdx] =
    useState<number>(0);
  const [attachedPythonAlgorithms, setAttachedPythonAlgorithms] = useState<PythonAlgorithmPreset[]>([]);
  const [isExportDashboardOpen, setIsExportDashboardOpen] = useState<boolean>(false);
  const [showFourProposalsModal, setShowFourProposalsModal] = useState<boolean>(false);
  const [fourProposalsTab, setFourProposalsTab] = useState<InnovationProposalTabId>("INTERACTIVE_CF_SPLINE");
  const [showCompetencyBankModal, setShowCompetencyBankModal] = useState<boolean>(false);
  const [showMassarExportModal, setShowMassarExportModal] = useState<boolean>(false);
  const [showDiagnosticAnalysisModal, setShowDiagnosticAnalysisModal] = useState<boolean>(false);
  const [showBookletModeModal, setShowBookletModeModal] = useState<boolean>(false);
  const [showInteractiveQrModal, setShowInteractiveQrModal] = useState<boolean>(false);
  const [selectedConsigneKeys, setSelectedConsigneKeys] = useState<string[]>([
    "CALC_ALLOWED",
    "BLANCO_FORBIDDEN",
    "CARE_REDACTION",
    "JUSTIFY_STEPS",
  ]);
  const [isBookletPreviewMode, setIsBookletPreviewMode] = useState<boolean>(false);
  const [exportHistory, setExportHistory] = useState<ExportHistoryEntry[]>(() =>
    loadExportHistory(CURRICULUM_DB[initial.selectedTrackCode], initial.semester)
  );

  const handleOpenPedagogicalAiWithTask = useCallback(
    (task?: AiPedagogicalTask, lessonIdx: number = 0) => {
      setPedagogicalAiInitialView("WORKSPACE");
      setPedagogicalAiInitialTask(task);
      setPedagogicalAiInitialLessonIdx(lessonIdx);
      setShowPedagogicalAiModal(true);
    },
    []
  );

  const handleInsertPythonAlgorithm = useCallback((preset: PythonAlgorithmPreset) => {
    setAttachedPythonAlgorithms((prev) => {
      const exists = prev.some((p) => p.id === preset.id);
      if (exists) return prev;
      return [...prev, preset];
    });
  }, []);

  const handleRemovePythonAlgorithm = useCallback((id: string) => {
    setAttachedPythonAlgorithms((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleApplyAiVariant = useCallback((statement: string, solution: string) => {
    setCustomTopicNote((prev) =>
      prev ? `${prev}\n\n[نموذج موازٍ B مولد بالذكاء الاصطناعي]:\n${statement}` : `[نموذج موازٍ B مولد بالذكاء الاصطناعي]:\n${statement}`
    );
  }, []);


  const handleOpenAdvancedPedagogyStudio = useCallback(
    (tab: AdvancedPedagogyTabId = "SPEC_2D") => {
      setAdvancedPedagogyInitialTab(tab);
      setShowAdvancedPedagogyModal(true);
    },
    []
  );

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pedagogical_math_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);

  const [statusMessage, setStatusMessage] = useState<{
    type: "info" | "error" | "success";
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  // 10. ب. سجل التراجع والإعادة للإعدادات السريعة والعناوين وتوزيع أوزان الدروس (Undo / Redo History Stack)
  const [history, setHistory] = useState<QuickEditorSnapshot[]>([
    {
      customDocTitle: "",
      customDocSubtitle: "",
      customHeaderNote: "",
      customExerciseTitles: {},
      customWeightsMap: {},
      customLessonIconsMap: initial.customLessonIconsMap || {},
      school: initial.school,
      prof: initial.prof,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isHistoryNavigatingRef = useRef<boolean>(false);

  // 11. حالة الاتصال بـ Google Drive والأرشيف السحابي
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isLoggingInDrive, setIsLoggingInDrive] = useState<boolean>(false);
  const [isUploadingDrive, setIsUploadingDrive] = useState<boolean>(false);
  const [showDrivePanel, setShowDrivePanel] = useState<boolean>(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);

  // تهيئة مستمع مصادقة Google Drive
  useEffect(() => {
    const unsubscribe = initAuth(
      (u, tok) => {
        setDriveUser(u);
        setDriveToken(tok);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchDriveFiles = async (tokenOverride?: string) => {
    const tok = tokenOverride || driveToken || (await getAccessToken());
    if (!tok) return;
    setIsLoadingDriveFiles(true);
    try {
      const files = await listSavedDriveDocuments(tok);
      setDriveFiles(files);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "AUTH_REQUIRED") {
        setDriveToken(null);
      }
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  const handleGoogleDriveSignIn = async () => {
    setIsLoggingInDrive(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setDriveUser(res.user);
        setDriveToken(res.accessToken);
        setShowDrivePanel(true);
        await fetchDriveFiles(res.accessToken);
        setStatusMessage({
          type: "success",
          text: `تم ربط حساب Google Drive بنجاح (${res.user.displayName || res.user.email}).`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر تسجيل الدخول";
      setStatusMessage({
        type: "error",
        text: `تعذر الاتصال بحساب Google Drive: ${msg}`,
      });
    } finally {
      setIsLoggingInDrive(false);
    }
  };

  const handleGoogleDriveLogout = async () => {
    await logout();
    setDriveUser(null);
    setDriveToken(null);
    setDriveFiles([]);
    setShowDrivePanel(false);
    setStatusMessage({
      type: "info",
      text: "تم تسجيل الخروج من حساب Google Drive.",
    });
  };

  const handleSaveToGoogleDrive = async () => {
    let tok = driveToken || (await getAccessToken());
    if (!tok) {
      try {
        setIsLoggingInDrive(true);
        const res = await googleSignIn();
        if (!res) return;
        setDriveUser(res.user);
        setDriveToken(res.accessToken);
        tok = res.accessToken;
      } catch {
        setStatusMessage({
          type: "error",
          text: "يرجى تسجيل الدخول بحساب Google أولاً لحفظ الملفات في Google Drive.",
        });
        return;
      } finally {
        setIsLoggingInDrive(false);
      }
    }

    setIsUploadingDrive(true);
    try {
      const ext = exportFormat === "TYPST" ? "typ" : "tex";
      const docTag =
        activeModule === "DM_SERIE"
          ? dmSubType === "DEVOIR_MAISON"
            ? `DM_${dmNumber.replace(/\s+/g, "")}`
            : `Serie_TD_${dmNumber.replace(/\s+/g, "")}`
          : `${activeModule}_${dsKey}`;
      const fileName = `${currentTrack.code}_${docTag}_Modele_${examModel}_${year}.${ext}`;
      const description = `${currentTrack.labelFr} | ${school} | ${prof} | ${year}`;

      const uploaded = await uploadDocumentToDrive({
        accessToken: tok,
        fileName,
        content: generatedCode,
        description,
      });

      setShowDrivePanel(true);
      await fetchDriveFiles(tok);
      setStatusMessage({
        type: "success",
        text: `تم حفظ الملف "${uploaded.name}" مباشرة في مجلد المنصة على Google Drive بنجاح!`,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "AUTH_REQUIRED") {
        setDriveToken(null);
        setStatusMessage({
          type: "error",
          text: "انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول إلى Google Drive.",
        });
      } else {
        const msg = err instanceof Error ? err.message : "خطأ أثناء الرفع";
        setStatusMessage({
          type: "error",
          text: msg,
        });
      }
    } finally {
      setIsUploadingDrive(false);
    }
  };

  const confirmDeleteDriveFile = async () => {
    if (!fileToDelete) return;
    const tok = driveToken || (await getAccessToken());
    if (!tok) return;

    try {
      await deleteDriveDocument(tok, fileToDelete.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setStatusMessage({
        type: "info",
        text: `تم حذف الملف "${fileToDelete.name}" من Google Drive.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر حذف الملف";
      setStatusMessage({
        type: "error",
        text: msg,
      });
    } finally {
      setFileToDelete(null);
    }
  };

  // 11. ب: خيار المزامنة التلقائية للإعدادات المفضلة مع Google Drive عند التغيير
  const [driveAutoSyncEnabled, setDriveAutoSyncEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("prof_math_drive_auto_sync_enabled");
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });
  const [lastDriveSyncTime, setLastDriveSyncTime] = useState<Date | null>(null);
  const [isSyncingDriveSettings, setIsSyncingDriveSettings] = useState<boolean>(false);
  const autoSyncDebounceTimerRef = useRef<number | null>(null);
  const isInitialMountRef = useRef<boolean>(true);

  const handleToggleDriveAutoSync = useCallback((enabled: boolean) => {
    setDriveAutoSyncEnabled(enabled);
    try {
      localStorage.setItem("prof_math_drive_auto_sync_enabled", String(enabled));
    } catch {}
    setStatusMessage({
      type: enabled ? "success" : "info",
      text: enabled
        ? "تم تفعيل مزامنة الإعدادات المفضلة تلقائياً مع Google Drive."
        : "تم تعطيل مزامنة الإعدادات التلقائية مع Google Drive.",
    });
  }, []);

  const handleSyncSettingsToDriveNow = useCallback(async () => {
    const tok = driveToken || (await getAccessToken());
    if (!tok) {
      setStatusMessage({
        type: "error",
        text: "يرجى تسجيل الدخول بحساب Google أولاً لمزامنة الإعدادات.",
      });
      return;
    }

    setIsSyncingDriveSettings(true);
    try {
      const payload: SyncSettingsPayload = {
        schemaVersion: "3.0.0",
        updatedAt: new Date().toISOString(),
        sourceDevice: typeof navigator !== "undefined" ? navigator.platform || "Web" : "Web",
        teacherIdentity: {
          educationSystem,
          school,
          prof,
          year,
          academy,
          direction,
          headerStyle,
          logoVariant,
          includeTeacherLogo,
          includeLogoWatermark,
          includeStudentBox,
          includeGradeBox,
          calculatorAllowed,
          includeCompetencies,
        },
        pedagogicalPreferences: {
          docLang,
          bilingualLayout,
          exportFormat,
          docFontFamily,
          docFontSize,
          latexPackageTheme,
          paperSurface,
          tcolorboxConfig,
          appliedTitleCalligraphy,
          studentGridStyle,
          dsStructureMode,
          dsQuestionDensity,
          enableBranchColorGradient,
          branchColorMode,
          qcmQuestionCount,
          qcmScoringMode,
          selectedAiModel,
        },
        customLessonsMap: {
          customWeightsMap,
          customLessonIconsMap,
        },
      };

      const result = await syncSettingsToDrive(tok, payload);
      setLastDriveSyncTime(new Date());
      setStatusMessage({
        type: "success",
        text: result.isNew
          ? "تم إنشاء وحفظ ملف الإعدادات المفضلة في Google Drive بنجاح!"
          : "تم تحديث ومزامنة الإعدادات المفضلة في Google Drive بنجاح!",
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "AUTH_REQUIRED") {
        setDriveToken(null);
      }
      const msg = err instanceof Error ? err.message : "خطأ أثناء المزامنة";
      setStatusMessage({
        type: "error",
        text: `تعذر مزامنة الإعدادات مع Google Drive: ${msg}`,
      });
    } finally {
      setIsSyncingDriveSettings(false);
    }
  }, [
    driveToken,
    educationSystem,
    school,
    prof,
    year,
    academy,
    direction,
    headerStyle,
    logoVariant,
    includeTeacherLogo,
    includeLogoWatermark,
    includeStudentBox,
    includeGradeBox,
    calculatorAllowed,
    includeCompetencies,
    docLang,
    bilingualLayout,
    exportFormat,
    docFontFamily,
    docFontSize,
    latexPackageTheme,
    paperSurface,
    tcolorboxConfig,
    appliedTitleCalligraphy,
    studentGridStyle,
    dsStructureMode,
    dsQuestionDensity,
    enableBranchColorGradient,
    branchColorMode,
    qcmQuestionCount,
    qcmScoringMode,
    selectedAiModel,
    customWeightsMap,
    customLessonIconsMap,
  ]);

  const handleRestoreSettingsFromDrive = useCallback(async () => {
    const tok = driveToken || (await getAccessToken());
    if (!tok) {
      setStatusMessage({
        type: "error",
        text: "يرجى تسجيل الدخول بحساب Google أولاً لاسترجاع الإعدادات.",
      });
      return;
    }

    setIsSyncingDriveSettings(true);
    try {
      const data = await fetchSettingsFromDrive(tok);
      if (!data || !data.settings) {
        setStatusMessage({
          type: "info",
          text: "لم يتم العثور على ملف إعدادات محفوظ سابقاً في مجلد المنصة على Google Drive.",
        });
        return;
      }

      const { teacherIdentity, pedagogicalPreferences, customLessonsMap } = data.settings;
      if (teacherIdentity) {
        if (teacherIdentity.prof) setProf(teacherIdentity.prof);
        if (teacherIdentity.school) setSchool(teacherIdentity.school);
        if (teacherIdentity.year) setYear(teacherIdentity.year);
        if (teacherIdentity.academy) setAcademy(teacherIdentity.academy);
        if (teacherIdentity.direction) setDirection(teacherIdentity.direction);
        if (teacherIdentity.headerStyle) setHeaderStyle(teacherIdentity.headerStyle as HeaderStyle);
        if (teacherIdentity.logoVariant) setLogoVariant(teacherIdentity.logoVariant as TeacherLogoVariant);
        if (typeof teacherIdentity.includeTeacherLogo === "boolean") setIncludeTeacherLogo(teacherIdentity.includeTeacherLogo);
        if (typeof teacherIdentity.includeLogoWatermark === "boolean") setIncludeLogoWatermark(teacherIdentity.includeLogoWatermark);
        if (typeof teacherIdentity.includeStudentBox === "boolean") setIncludeStudentBox(teacherIdentity.includeStudentBox);
        if (typeof teacherIdentity.includeGradeBox === "boolean") setIncludeGradeBox(teacherIdentity.includeGradeBox);
        if (typeof teacherIdentity.calculatorAllowed === "boolean") setCalculatorAllowed(teacherIdentity.calculatorAllowed);
        if (typeof teacherIdentity.includeCompetencies === "boolean") setIncludeCompetencies(teacherIdentity.includeCompetencies);
      }

      if (pedagogicalPreferences) {
        if (pedagogicalPreferences.docLang) setDocLang(pedagogicalPreferences.docLang as DocLanguage);
        if (pedagogicalPreferences.bilingualLayout) setBilingualLayout(pedagogicalPreferences.bilingualLayout as BilingualLayout);
        if (pedagogicalPreferences.exportFormat) setExportFormat(pedagogicalPreferences.exportFormat as ExportFormat);
        if (pedagogicalPreferences.docFontFamily) setDocFontFamily(pedagogicalPreferences.docFontFamily as DocFontFamily);
        if (pedagogicalPreferences.docFontSize) setDocFontSize(pedagogicalPreferences.docFontSize as DocFontSize);
        if (pedagogicalPreferences.latexPackageTheme) setLatexPackageTheme(pedagogicalPreferences.latexPackageTheme as LatexPackageTheme);
        if (pedagogicalPreferences.paperSurface) setPaperSurface(pedagogicalPreferences.paperSurface as PaperSurfaceTexture);
        if (pedagogicalPreferences.tcolorboxConfig) setTcolorboxConfig(pedagogicalPreferences.tcolorboxConfig as TcolorboxCustomConfig);
        if (pedagogicalPreferences.appliedTitleCalligraphy) setAppliedTitleCalligraphy(pedagogicalPreferences.appliedTitleCalligraphy as AppliedTitleCalligraphyConfig);
        if (pedagogicalPreferences.studentGridStyle) setStudentGridStyle(pedagogicalPreferences.studentGridStyle as StudentGridStyle);
        if (pedagogicalPreferences.dsStructureMode) setDsStructureMode(pedagogicalPreferences.dsStructureMode as MoroccanDSStructureMode);
        if (pedagogicalPreferences.dsQuestionDensity) setDsQuestionDensity(pedagogicalPreferences.dsQuestionDensity as DSQuestionDensity);
        if (typeof pedagogicalPreferences.enableBranchColorGradient === "boolean") setEnableBranchColorGradient(pedagogicalPreferences.enableBranchColorGradient);
        if (pedagogicalPreferences.branchColorMode) setBranchColorMode(pedagogicalPreferences.branchColorMode as BranchColorGradientMode);
        if (pedagogicalPreferences.qcmQuestionCount) setQcmQuestionCount(pedagogicalPreferences.qcmQuestionCount);
        if (pedagogicalPreferences.qcmScoringMode) setQcmScoringMode(pedagogicalPreferences.qcmScoringMode as QCMScoringMode);
        if (pedagogicalPreferences.selectedAiModel) setSelectedAiModel(pedagogicalPreferences.selectedAiModel as "gemini-3.8-flash" | "gemini-4-argon");
      }

      if (customLessonsMap) {
        if (customLessonsMap.customWeightsMap) setCustomWeightsMap(customLessonsMap.customWeightsMap);
        if (customLessonsMap.customLessonIconsMap) setCustomLessonIconsMap(customLessonsMap.customLessonIconsMap as Record<string, LessonHeaderIconId>);
      }

      setLastDriveSyncTime(new Date());
      setStatusMessage({
        type: "success",
        text: `تم استرجاع وتطبيق الإعدادات بنجاح من Google Drive (آخر تعديل: ${new Date(data.modifiedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}).`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء الاسترجاع";
      setStatusMessage({
        type: "error",
        text: `تعذر استرجاع الإعدادات من Google Drive: ${msg}`,
      });
    } finally {
      setIsSyncingDriveSettings(false);
    }
  }, [driveToken]);

  // تأثير المزامنة التلقائية اللحظية عند تغيير أي إعداد مفضل مع تأخير (Debounce 2500ms)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (!driveAutoSyncEnabled || !driveToken) return;

    if (autoSyncDebounceTimerRef.current) {
      window.clearTimeout(autoSyncDebounceTimerRef.current);
    }

    autoSyncDebounceTimerRef.current = window.setTimeout(() => {
      handleSyncSettingsToDriveNow();
    }, 2500);

    return () => {
      if (autoSyncDebounceTimerRef.current) {
        window.clearTimeout(autoSyncDebounceTimerRef.current);
      }
    };
  }, [
    driveAutoSyncEnabled,
    driveToken,
    prof,
    school,
    year,
    academy,
    direction,
    headerStyle,
    logoVariant,
    includeTeacherLogo,
    includeLogoWatermark,
    includeStudentBox,
    includeGradeBox,
    calculatorAllowed,
    includeCompetencies,
    docLang,
    bilingualLayout,
    exportFormat,
    docFontFamily,
    docFontSize,
    latexPackageTheme,
    paperSurface,
    tcolorboxConfig,
    appliedTitleCalligraphy,
    studentGridStyle,
    dsStructureMode,
    dsQuestionDensity,
    enableBranchColorGradient,
    branchColorMode,
    qcmQuestionCount,
    qcmScoringMode,
    selectedAiModel,
    customWeightsMap,
    customLessonIconsMap,
    handleSyncSettingsToDriveNow,
  ]);


  // التبديل بين النظام المغربي ونظام البعثة الفرنسية
  const handleSystemChange = (sys: EducationSystem) => {
    setEducationSystem(sys);
    setCycleFilter("ALL");

    if (sys === "MISSION_FRANCAISE") {
      setSchool("Lycée Lyautey (Casablanca)");
      setDocLang("FR");
      setSelectedTrackCode("TERM_SPE_FR");
      setStatusMessage({
        type: "info",
        text: "تم تفعيل وضع مدارس البعثة الفرنسية بالمغرب (AEFE / OSUI) — تم تحديد Lycée Lyautey وتخصص الرياضيات.",
      });
    } else {
      setSchool("ROOSEVELT SCHOOL 2");
      setSelectedTrackCode("2BAC_PC");
      setStatusMessage({
        type: "info",
        text: "تم تفعيل وضع السلك الثانوي التأهيلي المغربي (وزارة التربية الوطنية).",
      });
    }
  };

  // اختيار مؤسسة فرنسية جاهزة
  const handleSelectMissionSchool = (schoolPreset: (typeof MISSION_SCHOOLS)[0]) => {
    setSchool(`${schoolPreset.name} (${schoolPreset.city})`);
    setStatusMessage({
      type: "success",
      text: `تم تحديد ${schoolPreset.name} (${schoolPreset.network} - ${schoolPreset.city}) وتحديث الترويسة بنجاح.`,
    });
  };

  // حفظ الإعدادات تلقائياً في LocalStorage مع تأخير ذكي (Debounce) لتحسين الأداء والذاكرة
  useEffect(() => {
    setSaveStatus("saving");
    let badgeTimer: ReturnType<typeof setTimeout> | null = null;
    const saveTimer = setTimeout(() => {
      try {
        const prefsToSave: SavedPreferences = {
          educationSystem,
          school,
          prof,
          year,
          academy,
          direction,
          headerStyle,
          includeStudentBox,
          includeGradeBox,
          calculatorAllowed,
          includeCompetencies,
          examModel,
          shuffleQuestions,
          shuffleExercises,
          docLang,
          bilingualLayout,
          exportFormat,
          activeModule,
          selectedTrackCode,
          semester,
          dsKey,
          n1,
          n2,
          n3,
          fillBlanks,
          includeTICE,
          dmSubType,
          dmNumber,
          dmDueDate,
          includeHints,
          includeTeacherLogo,
          logoVariant,
          includeLogoWatermark,
          customLogoUrl,
          docFontFamily,
          docFontSize,
          includeDetailedSolutions,
          solutionDisplayMode,
          showQuestionBareme,
          includeAnswerWorkspace,
          includeGradingScaleTable,
          includeSelfEvalGrid,
          serieExerciseCount,
          isCustomLessonMode,
          selectedLessonIndices,
          customWeightsMap,
          customLessonIconsMap,
          dsStructureMode,
          dsQuestionDensity,
          latexPackageTheme,
          paperSurface,
          enableBranchColorGradient,
          branchColorMode,
          includeInteractiveQrFooter,
          studentGridStyle,
          appliedTitleCalligraphy,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefsToSave));
        setSaveStatus("saved");
        setLastSavedTime(new Date());
        setSavedBadge(true);
        badgeTimer = setTimeout(() => setSavedBadge(false), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 280);

    return () => {
      clearTimeout(saveTimer);
      if (badgeTimer) clearTimeout(badgeTimer);
    };
  }, [
    educationSystem,
    school,
    prof,
    year,
    academy,
    direction,
    headerStyle,
    includeStudentBox,
    includeGradeBox,
    calculatorAllowed,
    includeCompetencies,
    examModel,
    shuffleQuestions,
    shuffleExercises,
    docLang,
    bilingualLayout,
    exportFormat,
    activeModule,
    selectedTrackCode,
    semester,
    dsKey,
    n1,
    n2,
    n3,
    fillBlanks,
    includeTICE,
    dmSubType,
    dmNumber,
    dmDueDate,
    includeHints,
    includeTeacherLogo,
    logoVariant,
    includeLogoWatermark,
    customLogoUrl,
    docFontFamily,
    docFontSize,
    includeDetailedSolutions,
    solutionDisplayMode,
    showQuestionBareme,
    includeAnswerWorkspace,
    includeGradingScaleTable,
    includeSelfEvalGrid,
    serieExerciseCount,
    isCustomLessonMode,
    selectedLessonIndices,
    customWeightsMap,
    customLessonIconsMap,
    dsStructureMode,
    dsQuestionDensity,
    latexPackageTheme,
    paperSurface,
    enableBranchColorGradient,
    branchColorMode,
    includeInteractiveQrFooter,
    studentGridStyle,
    appliedTitleCalligraphy,
  ]);

  const handleResetPreferences = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEducationSystem(DEFAULT_PREFS.educationSystem);
    setSchool(DEFAULT_PREFS.school);
    setProf(DEFAULT_PREFS.prof);
    setYear(DEFAULT_PREFS.year);
    setAcademy(DEFAULT_PREFS.academy);
    setDirection(DEFAULT_PREFS.direction);
    setHeaderStyle(DEFAULT_PREFS.headerStyle);
    setIncludeStudentBox(DEFAULT_PREFS.includeStudentBox);
    setIncludeGradeBox(DEFAULT_PREFS.includeGradeBox);
    setCalculatorAllowed(DEFAULT_PREFS.calculatorAllowed);
    setIncludeCompetencies(DEFAULT_PREFS.includeCompetencies);
    setExamModel(DEFAULT_PREFS.examModel);
    setShuffleQuestions(DEFAULT_PREFS.shuffleQuestions);
    setShuffleExercises(DEFAULT_PREFS.shuffleExercises);
    setDocLang(DEFAULT_PREFS.docLang);
    setBilingualLayout(DEFAULT_PREFS.bilingualLayout);
    setExportFormat(DEFAULT_PREFS.exportFormat);
    setActiveModule(DEFAULT_PREFS.activeModule);
    setSelectedTrackCode(DEFAULT_PREFS.selectedTrackCode);
    setSemester(DEFAULT_PREFS.semester);
    setDsKey(DEFAULT_PREFS.dsKey);
    setN1(DEFAULT_PREFS.n1);
    setN2(DEFAULT_PREFS.n2);
    setN3(DEFAULT_PREFS.n3);
    setFillBlanks(DEFAULT_PREFS.fillBlanks);
    setIncludeTICE(DEFAULT_PREFS.includeTICE);
    setDmSubType(DEFAULT_PREFS.dmSubType);
    setDmNumber(DEFAULT_PREFS.dmNumber);
    setDmDueDate(DEFAULT_PREFS.dmDueDate);
    setIncludeHints(DEFAULT_PREFS.includeHints);
    setIncludeTeacherLogo(DEFAULT_PREFS.includeTeacherLogo);
    setLogoVariant(DEFAULT_PREFS.logoVariant);
    setIncludeLogoWatermark(DEFAULT_PREFS.includeLogoWatermark);
    setCustomLogoUrl(null);
    setDocFontFamily(DEFAULT_PREFS.docFontFamily);
    setDocFontSize(DEFAULT_PREFS.docFontSize);
    setIncludeDetailedSolutions(false);
    setSolutionDisplayMode("SEPARATE_PAGE_ANNEXES");
    setOnlyPrintSolutions(false);
    setCustomDocTitle("");
    setCustomDocSubtitle("");
    setCustomHeaderNote("");
    setCustomExerciseTitles({});
    setIsCustomLessonMode(false);
    setCustomWeightsMap({});
    setCustomLessonIconsMap({});
    setShowQuestionBareme(DEFAULT_PREFS.showQuestionBareme ?? true);
    setIncludeAnswerWorkspace(DEFAULT_PREFS.includeAnswerWorkspace || false);
    setStudentGridStyle(DEFAULT_PREFS.studentGridStyle || "SEYES_FRENCH");
    setIncludeGradingScaleTable(DEFAULT_PREFS.includeGradingScaleTable ?? true);
    setIncludeSelfEvalGrid(DEFAULT_PREFS.includeSelfEvalGrid ?? true);
    setDsStructureMode(DEFAULT_PREFS.dsStructureMode || "EXERCICES_ET_PROBLEME");
    setDsQuestionDensity(DEFAULT_PREFS.dsQuestionDensity || "INTENSIVE");
    setLatexPackageTheme(DEFAULT_PREFS.latexPackageTheme || "TCOLORBOX");
    setPaperSurface(DEFAULT_PREFS.paperSurface || "PLAIN_WHITE");
    setEnableBranchColorGradient(DEFAULT_PREFS.enableBranchColorGradient ?? true);
    setBranchColorMode(DEFAULT_PREFS.branchColorMode || "AUTO_BY_LESSON");
    setIncludeInteractiveQrFooter(DEFAULT_PREFS.includeInteractiveQrFooter ?? true);
    setAppliedTitleCalligraphy(
      DEFAULT_PREFS.appliedTitleCalligraphy || {
        fontId: "DEFAULT_DOC",
        scale: "BALANCED",
        ornament: "NONE",
        scope: "HEADER_TITLES",
        enableMoroccanHeaderOrnament: true,
        customLetterSpacingEm: 0.025,
      }
    );
    setStatusMessage({
      type: "info",
      text: "تمت استعادة الإعدادات والتفضيلات الافتراضية بنجاح.",
    });
  };

  // رفع شعار مخصص من جهاز الأستاذ
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomLogoUrl(reader.result);
        setIncludeTeacherLogo(true);
        setStatusMessage({
          type: "success",
          text: "تم رفع واعتماد صورة شعار الأستاذ المخصصة بنجاح في المنصة والوثائق!",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // تحميل الشعار المطوّر بصيغة SVG عالية الدقة
  const handleDownloadDevelopedLogo = async () => {
    try {
      const isDoc2App = logoVariant === "DOC2APP_MONO";
      const svgPath = isDoc2App
        ? "/doc2app-academic-logo.svg"
        : "/prof-kouziber-logo.svg";
      const downloadName = isDoc2App
        ? "Doc2App_Academic_Math_Logo.svg"
        : "Prof_Kouziber_Brahim_Logo_Developed.svg";
      const res = await fetch(svgPath);
      const svgText = await res.text();
      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  // تصفية المسالك حسب النظام التعليمي والسلك المختار مع منع تكرار الرموز المرادفة (Aliases)
  const filteredTracks = useMemo(() => {
    const seenCodes = new Set<string>();
    return Object.values(CURRICULUM_DB).filter((t) => {
      if (!t || !t.code) return false;
      if (seenCodes.has(t.code)) return false;
      seenCodes.add(t.code);

      const isMissionTrack = t.system === "MISSION_FRANCAISE";
      if (educationSystem === "MISSION_FRANCAISE") {
        if (!isMissionTrack) return false;
      } else {
        if (isMissionTrack) return false;
      }

      if (cycleFilter === "ALL") return true;
      return t.cycle === cycleFilter;
    });
  }, [educationSystem, cycleFilter]);

  // التأكد من صلاحية المسلك المختار
  useEffect(() => {
    const normalizedCode = (CURRICULUM_DB[selectedTrackCode]?.code) || selectedTrackCode;
    if (!filteredTracks.some((t) => t.code === normalizedCode || t.code === selectedTrackCode)) {
      if (filteredTracks.length > 0) {
        setSelectedTrackCode(filteredTracks[0].code);
      }
    }
  }, [filteredTracks, selectedTrackCode]);

  const currentTrack =
    CURRICULUM_DB[selectedTrackCode] || filteredTracks[0] || CURRICULUM_DB["2BAC_PC"];

  const availableDSKeys = useMemo(() => {
    return Object.keys(currentTrack.semesters[semester] || {});
  }, [currentTrack, semester]);

  useEffect(() => {
    if (!availableDSKeys.includes(dsKey)) {
      setDsKey(availableDSKeys[0] || "DS1");
    }
  }, [availableDSKeys, dsKey]);

  const allTrackLessons = useMemo<LessonItem[]>(() => {
    return [
      ...Object.values(currentTrack.semesters.S1).flat(),
      ...Object.values(currentTrack.semesters.S2).flat(),
    ];
  }, [currentTrack]);

  // حساب عدد الدروس لكل تصنيف فرعي أو وسم في المسلك الحالي (تجميع أحادي المرور O(N) لتحسين الذاكرة والأداء)
  const trackTagCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = { ALL: allTrackLessons.length };
    const candidateTagSet = new Set<string>(
      LESSON_TAG_OPTIONS.map((opt) => opt.id)
    );
    for (const l of allTrackLessons) {
      for (const t of getLessonTags(l)) {
        candidateTagSet.add(t);
      }
    }
    for (const tagId of candidateTagSet) {
      if (tagId === "ALL") continue;
      let count = 0;
      for (const l of allTrackLessons) {
        if (lessonMatchesTagFilter(l, tagId)) count++;
      }
      counts[tagId] = count;
    }
    return counts;
  }, [allTrackLessons]);

  // الدروس المصفاة حسب التصنيف الفرعي أو الوسم المختار مع الاحتفاظ بفهرسها الأصلي
  const filteredTrackLessonsWithIdx = useMemo(() => {
    return allTrackLessons
      .map((lesson, idx) => ({ lesson, idx }))
      .filter(({ lesson }) => lessonMatchesTagFilter(lesson, selectedTagFilter));
  }, [allTrackLessons, selectedTagFilter]);

  useEffect(() => {
    if (selectedLessonIdx >= allTrackLessons.length) {
      setSelectedLessonIdx(0);
    } else if (
      selectedTagFilter !== "ALL" &&
      filteredTrackLessonsWithIdx.length > 0 &&
      !filteredTrackLessonsWithIdx.some((item) => item.idx === selectedLessonIdx)
    ) {
      setSelectedLessonIdx(filteredTrackLessonsWithIdx[0].idx);
    }
  }, [allTrackLessons, selectedLessonIdx, selectedTagFilter, filteredTrackLessonsWithIdx]);

  // الدروس الافتراضية للفرض الحالي
  const defaultDSLessons = useMemo<LessonItem[]>(() => {
    return currentTrack.semesters[semester][dsKey] || [];
  }, [currentTrack, semester, dsKey]);

  // عند تغيير المسلك يدوياً، نضبط الدروس المختارة في الوضع الحر على أول درسين ونعيد التصفية إلى الكل (مع عدم مسح الدروس عند الاستيراد البرمجي من JSON)
  useEffect(() => {
    if (skipTrackResetRef.current) {
      skipTrackResetRef.current = false;
      return;
    }
    setSelectedLessonIndices([0, Math.min(1, Math.max(0, allTrackLessons.length - 1))]);
    setCustomWeightsMap({});
    setSelectedTagFilter("ALL");
  }, [currentTrack.code, allTrackLessons.length]);

  // اعتماد جميع دروس التصنيف المختار مباشرة في الوثيقة مع موازنة الأوزان إلى 100%
  const handleSelectAllFilteredTagLessons = (tagId: string) => {
    const matchingIndices = allTrackLessons
      .map((l, i) => (lessonMatchesTagFilter(l, tagId) ? i : -1))
      .filter((i) => i !== -1);
    if (matchingIndices.length > 0) {
      setIsCustomLessonMode(true);
      setSelectedLessonIndices(matchingIndices);
      const count = matchingIndices.length;
      const baseW = Math.max(5, Math.floor(100 / count));
      const updatedWeights: Record<string, number> = { ...customWeightsMap };
      let running = 0;
      matchingIndices.forEach((lessonIdx, idx) => {
        const l = allTrackLessons[lessonIdx];
        if (!l) return;
        const key = `${currentTrack.code}_${l.lessonFr}`;
        if (idx === count - 1) {
          updatedWeights[key] = Math.max(5, 100 - running);
        } else {
          updatedWeights[key] = baseW;
          running += baseW;
        }
      });
      setCustomWeightsMap(updatedWeights);
      setStatusMessage({
        type: "info",
        text: `تم تحديد جميع دروس تصنيف « ${tagId} » (${matchingIndices.length} دروس) وموازنة أوزانها إلى 100%.`,
      });
    }
  };

  // تطبيق محاكاة الفرض المحروس المستورد على الورقة المعاينة (A4) وشبكة التقويم
  const handleApplyImportedExamSimulation = (
    blueprint: ImportedExamBlueprint,
    mode: SimulationMode,
    seed: number
  ) => {
    const {
      simulatedLessons,
      customExerciseTitles: simTitles,
      recommendedN1,
      recommendedN2,
      recommendedN3,
    } = convertBlueprintToSimulatedLessons(blueprint, mode, seed);

    setActiveImportedBlueprint(blueprint);
    setExamSimulationMode(mode);
    setExamVariationSeed(seed);
    setSimulatedImportedLessons(simulatedLessons);
    setIsExamSimulationActive(true);
    setActiveModule("DS_142_08");

    if (blueprint.detectedSystem && blueprint.detectedSystem !== educationSystem) {
      setEducationSystem(blueprint.detectedSystem);
    }
    if (blueprint.detectedTrackCode && CURRICULUM_DB[blueprint.detectedTrackCode]) {
      setSelectedTrackCode(blueprint.detectedTrackCode);
    }
    if (blueprint.semester) {
      setSemester(blueprint.semester);
    }
    setN1(recommendedN1);
    setN2(recommendedN2);
    setN3(recommendedN3);
    setCustomExerciseTitles(simTitles);
    setIncludeDetailedSolutions(true);
    setViewMode("PREVIEW");

    const modeLabel =
      mode === "EXACT_REPLICA"
        ? "محاكاة مطابقة للفرض المستورد"
        : mode === "ISOMORPHIC_TWIN"
        ? `محاكاة موازية بمعطيات ودوال جديدة (#${seed})`
        : "محاكاة مكيفة بيداغوجياً";

    setStatusMessage({
      type: "success",
      text: `تم تفعيل وضع « ${modeLabel} » لـ « ${blueprint.titleAr} » (${simulatedLessons.length} تمارين · 20/20 نقطة) مع توليد عناصر الإجابة وشبكة التقويم!`,
    });
  };

  const handleDisableImportedExamSimulation = () => {
    setIsExamSimulationActive(false);
    setSimulatedImportedLessons([]);
    setCustomExerciseTitles({});
    setStatusMessage({
      type: "info",
      text: "تم إيقاف وضع محاكاة الفرض المستورد والعودة إلى اختيار الدروس العادي.",
    });
  };

  // حساب قائمة الدروس الفعلية مع النسب المئوية المخصصة والأيقونة المخصصة من طرف الأستاذ أو من محاكاة الفرض المستورد
  const activeCustomLessons = useMemo<LessonItem[]>(() => {
    const enrichLesson = (lesson: LessonItem) => {
      const key = `${currentTrack.code}_${lesson.lessonFr}`;
      const customW = customWeightsMap[key];
      const customIcon = customLessonIconsMap[key];
      const customBaremes = customQuestionBaremesMap[key];
      const customLevels = customQuestionLevelsMap[key];
      const customQs = customQuestionsMap[key];
      return {
        ...lesson,
        weight: customW !== undefined ? customW : lesson.weight,
        customHeaderIcon: customIcon || lesson.customHeaderIcon || "AUTO",
        customQuestionBaremes: customBaremes || lesson.customQuestionBaremes,
        customQuestionLevels: customLevels || lesson.customQuestionLevels,
        ...(customQs
          ? {
              sampleExerciseAr: customQs.ar,
              sampleExerciseFr: customQs.fr,
              hasCustomQuestions: true,
            }
          : {}),
      };
    };

    if (isExamSimulationActive && simulatedImportedLessons.length > 0) {
      return simulatedImportedLessons.map(enrichLesson);
    }

    const baseList = isCustomLessonMode
      ? selectedLessonIndices
          .map((idx) => allTrackLessons[idx])
          .filter((l): l is LessonItem => Boolean(l))
      : defaultDSLessons;

    if (baseList.length === 0 && allTrackLessons.length > 0) {
      return [enrichLesson({ ...allTrackLessons[0], weight: 100 })];
    }

    return baseList.map(enrichLesson);
  }, [
    isExamSimulationActive,
    simulatedImportedLessons,
    isCustomLessonMode,
    selectedLessonIndices,
    allTrackLessons,
    defaultDSLessons,
    customWeightsMap,
    customLessonIconsMap,
    customQuestionBaremesMap,
    customQuestionLevelsMap,
    customQuestionsMap,
    currentTrack.code,
  ]);

  const totalCustomWeight = useMemo(() => {
    return activeCustomLessons.reduce((sum, l) => sum + l.weight, 0);
  }, [activeCustomLessons]);

  const handleInsertCompetencyExercise = useCallback((ex: CompetencyExerciseItem) => {
    const targetLesson = activeCustomLessons[0] || allTrackLessons[0];
    if (!targetLesson) return;
    const key = `${currentTrack.code}_${targetLesson.lessonFr}`;

    setCustomQuestionsMap((prev) => {
      const existing = prev[key] || {
        ar: targetLesson.sampleExerciseAr || ["1) حدد مجموعة التعريف."],
        fr: targetLesson.sampleExerciseFr || ["1) Déterminer l'ensemble de définition."],
      };
      return {
        ...prev,
        [key]: {
          ar: [...existing.ar, ...ex.statementAr],
          fr: [...existing.fr, ...ex.statementFr],
        },
      };
    });

    setCustomExerciseTitles((prev) => ({
      ...prev,
      0: isMission || docLang === "FR" ? `[${ex.code}] ${ex.titleFr}` : `[${ex.code}] ${ex.titleAr}`,
    }));

    setStatusMessage({
      type: "success",
      text: `✓ تم إدراج التمرين المرمز [${ex.code}] (${ex.points} ن · بلوم ${ex.bloomLevel}) بنجاح في الفرض/السلسلة!`,
    });
  }, [activeCustomLessons, allTrackLessons, currentTrack.code, docLang, isMission]);

  // حساب الإحصائيات الحية للفرض المحروس (مجموع النقط الفعلي، عدد الأسئلة، توزيع المستويات N1/N2/N3)
  const liveExamStats = useMemo(() => {
    const hasQCM =
      activeModule === "DS_142_08" &&
      (dsStructureMode === "QCM_ET_EXERCICES" ||
        dsStructureMode === "COMPLETE_EXAM_MAROC");
    const hasProb =
      !isMission &&
      activeModule === "DS_142_08" &&
      (dsStructureMode === "EXERCICES_ET_PROBLEME" ||
        dsStructureMode === "COMPLETE_EXAM_MAROC" ||
        dsStructureMode === "EXAMEN_BLANC_2BAC");

    const qcmPts = hasQCM ? Number((qcmQuestionCount * 1.0).toFixed(2)) : 0;
    const probPts = hasProb ? 8.5 : 0;
    const exercisesBudget = Math.max(4, 20 - qcmPts - probPts);
    const exactEffectiveWeights = computeExactExerciseEffectiveWeights(
      activeCustomLessons,
      exercisesBudget
    );

    let totalPts = qcmPts + probPts;
    let totalQuestions = (hasQCM ? qcmQuestionCount : 0) + (hasProb ? 6 : 0);
    let n1Pts = hasQCM ? qcmPts * 0.5 : 0;
    let n2Pts = (hasQCM ? qcmPts * 0.5 : 0) + (hasProb ? 4.5 : 0);
    let n3Pts = hasProb ? 4.0 : 0;

    activeCustomLessons.forEach((lesson, lIdx) => {
      const effectiveWeight = exactEffectiveWeights[lIdx] ?? lesson.weight;
      const qs = getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity);
      const qCount = Math.max(1, qs.questionsFr.length);
      const key = `${currentTrack.code}_${lesson.lessonFr}`;
      const metas = getQuestionBaremesAndLevels(
        effectiveWeight,
        qCount,
        n1,
        n2,
        n3,
        customQuestionBaremesMap[key] || lesson.customQuestionBaremes,
        customQuestionLevelsMap[key] || lesson.customQuestionLevels
      );
      totalQuestions += qCount;
      metas.forEach((m) => {
        const ptVal = parseFloat(m.points || "0");
        totalPts += ptVal;
        if (m.level === "N1") n1Pts += ptVal;
        else if (m.level === "N2") n2Pts += ptVal;
        else n3Pts += ptVal;
      });
    });

    return {
      totalPoints: Number(totalPts.toFixed(2)),
      totalQuestions,
      n1Pts: Number(n1Pts.toFixed(2)),
      n2Pts: Number(n2Pts.toFixed(2)),
      n3Pts: Number(n3Pts.toFixed(2)),
      hasQCM,
      hasProb,
    };
  }, [
    isMission,
    activeModule,
    dsStructureMode,
    qcmQuestionCount,
    totalCustomWeight,
    activeCustomLessons,
    dsQuestionDensity,
    currentTrack.code,
    n1,
    n2,
    n3,
    customQuestionBaremesMap,
    customQuestionLevelsMap,
  ]);

  // حساب العناوين الافتراضية للوثيقة والتمارين وتزامنها مع محرر العناوين السريع والتحقق من صحة البيانات (Validation)
  const defaultDocTitle = useMemo(() => {
    const isFrDoc = docLang === "FR" || isMission;
    const isArDoc = docLang === "AR" && !isMission;
    const isDM = dmSubType === "DEVOIR_MAISON";
    if (activeModule === "DS_142_08") {
      return isMission || isFrDoc
        ? `Devoir Surveillé N° ${dsKey.replace("DS", "")} (${semester})`
        : isArDoc
        ? `الفرض المحروس رقم ${dsKey.replace("DS", "")} (${
            semester === "S1" ? "الدورة 1" : "الدورة 2"
          })`
        : `الفرض المحروس ${dsKey} / Devoir Surveillé ${dsKey}`;
    }
    if (activeModule === "DM_SERIE") {
      if (isDM) {
        return isFrDoc
          ? `Devoir Maison ${dmNumber} (${semester})`
          : isArDoc
          ? `الفرض المنزلي ${dmNumber} (${semester === "S1" ? "الدورة 1" : "الدورة 2"})`
          : `الفرض المنزلي ${dmNumber} / Devoir Maison ${dmNumber}`;
      }
      return isFrDoc
        ? `Série d'Exercices & Travaux Dirigés ${dmNumber} (${semester})`
        : isArDoc
        ? `سلسلة تمارين تطبيقية وتوليفية ${dmNumber} (${
            semester === "S1" ? "الدورة 1" : "الدورة 2"
          })`
        : `سلسلة تمارين ${dmNumber} / Série d'Exercices ${dmNumber}`;
    }
    if (activeModule === "FICHE_OP2007") {
      return isMission
        ? "Fiche de Séquence Pédagogique (Programme Officiel)"
        : isFrDoc
        ? "Fiche Pédagogique (Programme Officiel)"
        : "جذاذة تربوية وفق التوجيهات التربوية 2007";
    }
    if (activeModule === "DIAGNOSTIC") {
      return isMission
        ? "Test de Positionnement & Diagnostic"
        : isFrDoc
        ? "Test d'Évaluation Diagnostique"
        : "رائز التقويم التشخيصي للمكتسبات القبلية";
    }
    return isMission
      ? "Progression Annuelle & Calendrier AEFE"
      : isFrDoc
      ? "Répartition Annuelle & Programme"
      : "التوزيع السنوي للمقرر والأطر المرجعية";
  }, [activeModule, docLang, isMission, dmSubType, dsKey, semester, dmNumber]);

  const defaultDocSubtitle = useMemo(() => {
    const isFrDoc = docLang === "FR" || isMission;
    const isDM = dmSubType === "DEVOIR_MAISON";
    if (activeModule === "DIAGNOSTIC") {
      return isFrDoc ? `Durée : ${diagDuration}` : `المدة: ${diagDuration}`;
    }
    if (activeModule === "DM_SERIE") {
      if (isDM) {
        return isFrDoc
          ? `À rendre le : ${dmDueDate} · Barème : 20 points`
          : `تاريخ الإرجاع: ${dmDueDate} · سلم التنقيط: 20 نقطة`;
      }
      return isFrDoc
        ? "Exercices progressifs (★ Application · ★★ Méthodes · ★★★ Approfondissement)"
        : "تمارين متدرجة الصعوبة (★ تطبيق · ★★ توليف · ★★★ تعمق وتحدي)";
    }
    return isFrDoc
      ? `Durée de l'épreuve : ${currentTrack.durationFr}`
      : `المدة الزمنية: ${currentTrack.durationAr}`;
  }, [activeModule, docLang, isMission, dmSubType, diagDuration, dmDueDate, currentTrack]);

  const defaultExerciseTitles = useMemo<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    const isFrDoc = docLang === "FR" || isMission;

    if (activeModule === "DM_SERIE" && dmSubType === "SERIE_TD") {
      for (let i = 0; i < serieExerciseCount; i++) {
        const lesson = activeCustomLessons[i % Math.max(1, activeCustomLessons.length)];
        const exNum = i + 1;
        map[i] = isFrDoc
          ? `Exercice ${exNum} : ${lesson?.lessonFr || "Exercice"}`
          : `التمرين ${exNum} : ${lesson?.lessonAr || "تمرين"}`;
      }
      return map;
    }

    activeCustomLessons.forEach((lesson, idx) => {
      map[idx] = isFrDoc
        ? `Exercice ${idx + 1} : ${lesson.lessonFr}`
        : `التمرين ${idx + 1} : ${lesson.lessonAr}`;
    });
    return map;
  }, [activeCustomLessons, docLang, isMission, activeModule, dmSubType, serieExerciseCount]);

  // مزامنة العناوين الافتراضية تلقائياً عند تغيير الوحدة أو الفصل أو اللغة أو عدد التمارين
  useEffect(() => {
    setCustomDocTitle(defaultDocTitle);
    setCustomDocSubtitle(defaultDocSubtitle);
  }, [defaultDocTitle, defaultDocSubtitle]);

  useEffect(() => {
    if (!isExamSimulationActive) {
      setCustomExerciseTitles(defaultExerciseTitles);
    }
  }, [defaultExerciseTitles, isExamSimulationActive]);

  // التحقق من صحة البيانات (Validation) في محرر العناوين السريع لمنع ترك العناوين الرئيسية فارغة
  const quickEditorValidation = useMemo(() => {
    const emptyDocTitle = customDocTitle.trim().length === 0;
    const emptyDocSubtitle = customDocSubtitle.trim().length === 0;
    const emptySchool = school.trim().length === 0;
    const emptyProf = prof.trim().length === 0;
    const emptyExerciseIndices: number[] = [];

    if (activeModule === "DM_SERIE" && dmSubType === "SERIE_TD") {
      for (let i = 0; i < serieExerciseCount; i++) {
        const val = customExerciseTitles[i] ?? "";
        if (val.trim().length === 0) {
          emptyExerciseIndices.push(i);
        }
      }
    } else if (activeModule === "DS_142_08" || activeModule === "DM_SERIE") {
      activeCustomLessons.forEach((_, idx) => {
        const val = customExerciseTitles[idx] ?? "";
        if (val.trim().length === 0) {
          emptyExerciseIndices.push(idx);
        }
      });
    }

    const errorMessages: string[] = [];
    if (emptyDocTitle) {
      errorMessages.push("العنوان الرئيسي للوثيقة");
    }
    if (emptyDocSubtitle) {
      errorMessages.push("العنوان الفرعي / المدة الزمنية");
    }
    if (emptySchool) {
      errorMessages.push("اسم المؤسسة التعليمية");
    }
    if (emptyProf) {
      errorMessages.push("اسم الأستاذ(ة)");
    }
    emptyExerciseIndices.forEach((idx) => {
      errorMessages.push(`عنوان التمرين رقم ${idx + 1}`);
    });

    return {
      emptyDocTitle,
      emptyDocSubtitle,
      emptySchool,
      emptyProf,
      emptyExerciseIndices,
      errorMessages,
      hasErrors: errorMessages.length > 0,
      errorCount: errorMessages.length,
    };
  }, [
    customDocTitle,
    customDocSubtitle,
    school,
    prof,
    activeModule,
    dmSubType,
    serieExerciseCount,
    activeCustomLessons,
    customExerciseTitles,
  ]);

  // إصلاح واستعادة جميع العناوين الرئيسية الفارغة بضغطة زر واحدة
  const handleFixEmptyQuickTitles = useCallback(() => {
    if (customDocTitle.trim().length === 0) {
      setCustomDocTitle(defaultDocTitle);
    }
    if (customDocSubtitle.trim().length === 0) {
      setCustomDocSubtitle(defaultDocSubtitle);
    }
    if (school.trim().length === 0) {
      setSchool(
        isMission ? "Lycée Lyautey (Casablanca)" : DEFAULT_PREFS.school
      );
    }
    if (prof.trim().length === 0) {
      setProf(DEFAULT_PREFS.prof);
    }
    if (activeModule === "DM_SERIE" && dmSubType === "SERIE_TD") {
      setCustomExerciseTitles((prev) => {
        const next = { ...prev };
        for (let i = 0; i < serieExerciseCount; i++) {
          if (!next[i] || next[i].trim().length === 0) {
            next[i] = defaultExerciseTitles[i] || `التمرين ${i + 1}`;
          }
        }
        return next;
      });
    } else if (activeModule === "DS_142_08" || activeModule === "DM_SERIE") {
      setCustomExerciseTitles((prev) => {
        const next = { ...prev };
        activeCustomLessons.forEach((_, idx) => {
          if (!next[idx] || next[idx].trim().length === 0) {
            next[idx] = defaultExerciseTitles[idx] || `التمرين ${idx + 1}`;
          }
        });
        return next;
      });
    }
    setStatusMessage({
      type: "success",
      text: "✓ تم إصلاح واستعادة جميع العناوين الرئيسية الفارغة في محرر العناوين السريع بنجاح.",
    });
  }, [
    customDocTitle,
    customDocSubtitle,
    school,
    prof,
    defaultDocTitle,
    defaultDocSubtitle,
    defaultExerciseTitles,
    isMission,
    activeModule,
    dmSubType,
    serieExerciseCount,
    activeCustomLessons,
  ]);

  // تنبيه المستخدم عند ترك حقل عنوان رئيسي فارغاً
  const handlePrimaryTitleBlur = useCallback(
    (fieldLabel: string, currentValue: string) => {
      if (currentValue.trim().length === 0) {
        setStatusMessage({
          type: "error",
          text: `⚠️ تنبيه التحقق من صحة البيانات: لا يمكن ترك « ${fieldLabel} » فارغاً في محرر العناوين السريع! يرجى إدخال عنوان صحيح أو استعادة القيمة الافتراضية.`,
        });
      }
    },
    []
  );

  // تغيير وزن درس معين
  const handleLessonWeightChange = (lessonFr: string, newWeight: number) => {
    const clamped = Math.max(5, Math.min(100, Math.round(newWeight)));
    const key = `${currentTrack.code}_${lessonFr}`;
    setCustomWeightsMap((prev) => ({
      ...prev,
      [key]: clamped,
    }));
  };

  // تغيير الأيقونة المخصصة لترويسة تمرين الدرس في الورقة المطبوعة
  const handleLessonIconChange = (
    lessonFr: string,
    newIconId: LessonHeaderIconId,
    lessonTitleLabel?: string
  ) => {
    const key = `${currentTrack.code}_${lessonFr}`;
    setCustomLessonIconsMap((prev) => ({
      ...prev,
      [key]: newIconId,
    }));
    const selectedOpt = LESSON_HEADER_ICON_OPTIONS.find(
      (opt) => opt.id === newIconId
    );
    setStatusMessage({
      type: "info",
      text: `تم تحديث أيقونة ترويسة التمرين لدرس « ${
        lessonTitleLabel || lessonFr
      } » إلى: ${selectedOpt?.labelAr || newIconId} ${
        selectedOpt?.mathSymbol ? `(${selectedOpt.mathSymbol})` : ""
      }`,
    });
  };

  // موازنة النسب تلقائياً ليكون المجموع 100%
  const handleNormalizeWeightsTo100 = () => {
    if (activeCustomLessons.length === 0) return;
    const sum = activeCustomLessons.reduce((acc, l) => acc + l.weight, 0);
    if (sum <= 0) return;

    const updated: Record<string, number> = { ...customWeightsMap };
    let runningTotal = 0;

    activeCustomLessons.forEach((l, idx) => {
      const key = `${currentTrack.code}_${l.lessonFr}`;
      if (idx === activeCustomLessons.length - 1) {
        updated[key] = Math.max(5, 100 - runningTotal);
      } else {
        const w = Math.max(5, Math.round((l.weight / sum) * 100));
        updated[key] = w;
        runningTotal += w;
      }
    });

    setCustomWeightsMap(updated);
    setStatusMessage({
      type: "success",
      text: "تمت موازنة نسب الدروس تلقائياً ليصبح المجموع 100% (20/20 نقطة).",
    });
  };

  // توزيع متساوٍ للنسب بين الدروس المختارة
  const handleEqualizeWeights = () => {
    const count = activeCustomLessons.length;
    if (count === 0) return;
    const base = Math.floor(100 / count);
    const updated: Record<string, number> = { ...customWeightsMap };
    let running = 0;

    activeCustomLessons.forEach((l, idx) => {
      const key = `${currentTrack.code}_${l.lessonFr}`;
      if (idx === count - 1) {
        updated[key] = 100 - running;
      } else {
        updated[key] = base;
        running += base;
      }
    });

    setCustomWeightsMap(updated);
    setStatusMessage({
      type: "info",
      text: `تم توزيع النسب بالتساوي على ${count} دروس مختارة.`,
    });
  };

  // تبديل اختيار درس في الوضع المخصص الحر
  const handleToggleLessonInCustomMode = (idx: number) => {
    setSelectedLessonIndices((prev) => {
      if (prev.includes(idx)) {
        if (prev.length <= 1) return prev; // الاحتفاظ بدرس واحد على الأقل
        return prev.filter((i) => i !== idx);
      }
      return [...prev, idx].sort((a, b) => a - b);
    });
  };

  const handleUpdateQuestionBaremes = (lessonKey: string, baremes: number[]) => {
    setCustomQuestionBaremesMap((prev) => ({
      ...prev,
      [lessonKey]: baremes,
    }));
    setStatusMessage({
      type: "success",
      text: "تم تحديث سلم التنقيط وتجزئة النقط على الأسئلة بنجاح!",
    });
  };

  const handleUpdateQuestionLevels = (
    lessonKey: string,
    levels: Array<"N1" | "N2" | "N3">
  ) => {
    setCustomQuestionLevelsMap((prev) => ({
      ...prev,
      [lessonKey]: levels,
    }));
    setStatusMessage({
      type: "info",
      text: "تم تحديث المستويات المهارية (N1 / N2 / N3) للأسئلة بنجاح.",
    });
  };

  const handleUpdateCustomQuestions = (
    lessonKey: string,
    questionsAr: string[],
    questionsFr: string[]
  ) => {
    const validatedAr = sanitizeAndValidateQuestionsList(questionsAr);
    const validatedFr = sanitizeAndValidateQuestionsList(questionsFr);
    setCustomQuestionsMap((prev) => ({
      ...prev,
      [lessonKey]: {
        ar: validatedAr.sanitizedQuestions,
        fr: validatedFr.sanitizedQuestions,
      },
    }));
    const totalAutoFixed =
      validatedAr.autoFixedCount + validatedFr.autoFixedCount;
    setStatusMessage({
      type: "success",
      text:
        totalAutoFixed > 0
          ? `تم فحص وتنقية الأسئلة المخصصة بواسطة مكتبة MathJS (إصلاح تلقائي لـ ${totalAutoFixed} صيغ رياضية) قبل عرضها في معاينة الورقة!`
          : "تم التحقق من سلامة التعبيرات الرياضية بواسطة MathJS وتحديث الأسئلة المخصصة في المعاينة بنجاح!",
    });
  };

  const handleResetAllBaremes = () => {
    setCustomQuestionBaremesMap({});
    setCustomQuestionLevelsMap({});
    setCustomQuestionsMap({});
    setStatusMessage({
      type: "info",
      text: "تم استرجاع سلم التنقيط والأسئلة الافتراضية المتوازنة طبقاً للمذكرة 142-08.",
    });
  };

  // مرصد التدقيق البيداغوجي الشامل واقتراح النقائص (Pedagogical & Technical Audit 142-08 / OP 2007)
  const pedagogicalAuditReport = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      status: "PASS" | "WARN" | "RECOMMEND";
      detail: string;
      actionLabel?: string;
      onFix?: () => void;
    }> = [];

    // 1. تدقيق مجموع النقط الفعلي في الورقة (20/20 ن)
    const isScore20 = Math.abs(liveExamStats.totalPoints - 20) <= 0.05;
    items.push({
      id: "SCORE_20",
      title: "تطابق سلم التنقيط الإجمالي مع المعيار الرسمي (20.00 / 20.00 ن)",
      status: isScore20 ? "PASS" : "WARN",
      detail: isScore20
        ? `مجموع نقط الأسئلة والتمارين في الورقة مضبوط بدقة (${liveExamStats.totalPoints.toFixed(2)} / 20.00 ن).`
        : `مجموع النقط الحالي هو ${liveExamStats.totalPoints.toFixed(2)} / 20.00 ن (فارق ${(liveExamStats.totalPoints - 20).toFixed(2)} ن عن المعيار الوزاري).`,
      actionLabel: isScore20 ? "مراجعة تجزئة النقط" : "موازنة تلقائية إلى 20/20",
      onFix: () => {
        if (isScore20) {
          setIsBaremeModalOpen(true);
        } else {
          setCustomQuestionBaremesMap({});
          handleNormalizeWeightsTo100();
          setStatusMessage({
            type: "success",
            text: "تمت موازنة سلم التنقيط الإجمالي تلقائياً ليستقر في 20.00 / 20.00 ن.",
          });
        }
      },
    });

    // 2. تدقيق مجموع الأوزان النسبية للدروس (100%)
    const isWeight100 = totalCustomWeight === 100;
    items.push({
      id: "WEIGHT_100",
      title: "توازن الأوزان النسبية للدروس المختارة (100%)",
      status: isWeight100 ? "PASS" : "WARN",
      detail: isWeight100
        ? `توزيع أوزان الدروس الـ ${activeCustomLessons.length} متكامل ومضبوط على 100%.`
        : `مجموع أوزان الدروس حالياً هو ${totalCustomWeight}% بدلاً من 100%، مما قد يؤثر على تناسب نقط التمارين.`,
      actionLabel: "موازنة الأوزان إلى 100%",
      onFix: handleNormalizeWeightsTo100,
    });

    // 3. التوازن الديداكتيكي للمستويات المهارية N1 / N2 / N3 وفق المذكرة 142-08
    const isLevelsBalanced =
      n1 >= 25 && n1 <= 40 && n2 >= 40 && n2 <= 55 && n3 >= 15 && n3 <= 25 && n1 + n2 + n3 === 100;
    items.push({
      id: "SKILL_LEVELS",
      title: "التوازن الديداكتيكي للمستويات المهارية (N1: 35% · N2: 45% · N3: 20%)",
      status: isLevelsBalanced ? "PASS" : "RECOMMEND",
      detail: isLevelsBalanced
        ? `النسب الحالية (${n1}% N1 · ${n2}% N2 · ${n3}% N3) تطابق توصيات المفتشية العامة لمادة الرياضيات.`
        : `التوزيع الحالي (${n1}% N1 · ${n2}% N2 · ${n3}% N3) يميل عن التوزيع المرجعي المتوازن (35% / 45% / 20%).`,
      actionLabel: "تطبيق معيار المفتش (35/45/20)",
      onFix: () => {
        setN1(35);
        setN2(45);
        setN3(20);
        setStatusMessage({
          type: "success",
          text: "تم ضبط المستويات المهارية على التوزيع الرسمي للمذكرة 142-08 (35% N1 · 45% N2 · 20% N3).",
        });
      },
    });

    // 4. ملاءمة عدد الأسئلة مع المدة الزمنية الرسمية للمسلك
    const durationHours = currentTrack.durationFr.includes("4")
      ? 4
      : currentTrack.durationFr.includes("3")
      ? 3
      : currentTrack.durationFr.includes("1")
      ? 1
      : 2;
    const maxRecommendedQuestions = durationHours * 9;
    const isDurationFit = liveExamStats.totalQuestions <= maxRecommendedQuestions;
    items.push({
      id: "DURATION_FIT",
      title: `ملاءمة طول الفرض (${liveExamStats.totalQuestions} سؤالاً) مع الحصة الزمنية (${currentTrack.durationFr})`,
      status: isDurationFit ? "PASS" : "RECOMMEND",
      detail: isDurationFit
        ? `عدد الأسئلة الإجمالي (${liveExamStats.totalQuestions} سؤالاً) مناسب جداً لإنجاز التلميذ خلال ${currentTrack.durationAr}.`
        : `عدد الأسئلة (${liveExamStats.totalQuestions} سؤالاً) مرتفع نسبياً لمدة ${currentTrack.durationAr}؛ يُنصح باعتماد الكثافة القياسية أو البنية الكلاسيكية.`,
      actionLabel: "ضبط كثافة قياسية مناسبة للوقت",
      onFix: () => {
        setDsQuestionDensity("STANDARD");
        if (durationHours <= 2 && dsStructureMode === "COMPLETE_EXAM_MAROC") {
          setDsStructureMode("STANDARD_142_08");
        }
        setStatusMessage({
          type: "success",
          text: `تم ضبط كثافة الأسئلة لتتناسب مع المدة الزمنية الرسمية (${currentTrack.durationFr}).`,
        });
      },
    });

    // 5. اكتمال العدة التربوية (عناصر الإجابة + سلم التنقيط الجزئي + جدول المواصفات)
    const isPedagogicalKitComplete =
      includeDetailedSolutions && showQuestionBareme && includeGradingScaleTable;
    items.push({
      id: "PEDAGOGICAL_KIT",
      title: "اكتمال الملف التربوي للأستاذ والمفتش (التصحيح المفصل + جدول التخصيص + التنقيط الجزئي)",
      status: isPedagogicalKitComplete ? "PASS" : "RECOMMEND",
      detail: isPedagogicalKitComplete
        ? "جميع مكونات الملف التربوي مفعلة (جدول المواصفات 142-08 + التنقيط الجزئي لكل سؤال + عناصر الإجابة المفصلة)."
        : "لتقديم ملف تربوي متكامل للمفتش والتلاميذ، يُقترح تفعيل التصحيح المفصل وجدول التخصيص والتنقيط الجزئي.",
      actionLabel: "تفعيل العدة التربوية الكاملة",
      onFix: () => {
        setIncludeDetailedSolutions(true);
        setShowQuestionBareme(true);
        setIncludeGradingScaleTable(true);
        if (quickEditorValidation.hasErrors) {
          handleFixEmptyQuickTitles();
        }
        setStatusMessage({
          type: "success",
          text: "تم تفعيل عناصر الإجابة المفصلة وجدول التخصيص 142-08 والتنقيط الجزئي بنجاح!",
        });
      },
    });

    // 6. تفعيل المقترحات البيداغوجية المتكاملة لما بعد الفرض (تذكرة الصيغ + تدبير الزمن + خطة المعالجة والدعم + البطاقة الإحصائية)
    const isExtendedPortfolioComplete =
      includeDSStudentSelfCheck &&
      includePostExamRemediationSheet &&
      includeOfficialExamCoverSheet &&
      includeExamFormulaSheet;
    items.push({
      id: "EXTENDED_PORTFOLIO",
      title: "الحقيبة البيداغوجية المتكاملة (تذكرة الصيغ + تدبير الزمن + خطة الدعم الفارقي + البطاقة الإحصائية)",
      status: isExtendedPortfolioComplete ? "PASS" : "RECOMMEND",
      detail: isExtendedPortfolioComplete
        ? "الملاحق البيداغوجية الأربعة مفعلة في الورقة: تذكرة الصيغ، شبكة تدبير الزمن للمترشح، خطة الدعم والمعالجة الفارقية، والبطاقة الإحصائية لدفتر النصوص."
        : "يُقترح إغناء الفرض المحروس بتذكرة الصيغ المرجعية، شبكة تدبير الزمن للمترشح، بطاقة الدعم الفارقي لما بعد الفرض، والبطاقة الإحصائية لدفتر النصوص.",
      actionLabel: isExtendedPortfolioComplete
        ? "مفعلة بالكامل ✓"
        : "تفعيل الملاحق البيداغوجية الـ 4",
      onFix: () => {
        setIncludeExamFormulaSheet(true);
        setIncludeDSStudentSelfCheck(true);
        setIncludePostExamRemediationSheet(true);
        setIncludeOfficialExamCoverSheet(true);
        setStatusMessage({
          type: "success",
          text: "تم تفعيل الملاحق البيداغوجية الأربعة (تذكرة الصيغ + تدبير الزمن + خطة المعالجة والدعم + البطاقة الإحصائية لدفتر النصوص) في المعاينة الورقية!",
        });
      },
    });

    // 7. معايرة كراسة وحيز الإجابة الكاملة للتلميذ وشريط التنقيط الفردي
    const isWorkspaceAndContinuityReady =
      includeIndividualGradingStrip && includeRescueHintsAndContinuity;
    items.push({
      id: "FULL_ANSWER_WORKSPACE",
      title: "حيز الإجابة الكاملة المعاير للتلميذ واستمرارية الأسئلة",
      status: isWorkspaceAndContinuityReady ? "PASS" : "RECOMMEND",
      detail: includeAnswerWorkspace
        ? "كراسة الإجابة الكاملة للتلميذ مفعلة مع معايرة عدد الأسطر تلقائياً وتضمين المعلم المتعامد وجدول التغيرات ومراحل البرهان بالترجع وإطار النتيجة النهائية."
        : isWorkspaceAndContinuityReady
        ? "شريط التنقيط الفردي وتوجيهات الاستمرارية مفعلة. يمكنك أيضاً تفعيل «حيز الإجابة الكاملة للتلميذ» لتحويل الورقة إلى كراسة امتحان مدمجة."
        : "يُقترح تفعيل شريط التنقيط الفردي وتوجيهات استمرارية الأسئلة، مع إمكانية تفعيل حيز الإجابة الكاملة المعاير تحت كل سؤال.",
      actionLabel: includeAnswerWorkspace
        ? "كراسة الإجابة مفعلة ✓"
        : "تفعيل حيز الإجابة الكاملة",
      onFix: () => {
        setIncludeAnswerWorkspace(true);
        setIncludeIndividualGradingStrip(true);
        setIncludeRescueHintsAndContinuity(true);
        setStatusMessage({
          type: "success",
          text: "تم تفعيل كراسة وحيز الإجابة الكاملة المعاير للتلميذ تحت كل سؤال مع شريط التنقيط الفردي وتوجيهات الاستمرارية!",
        });
      },
    });

    // 8. مصفوفة التخصيص ثنائية الأبعاد (2D) وبطاقة اليقظة الديداكتيكية للأخطاء الشائعة
    const is2DAndVigilanceReady = include2DSpecMatrix && includeDidacticVigilanceSheet;
    items.push({
      id: "SPEC_2D_VIGILANCE",
      title: "مصفوفة التخصيص ثنائية الأبعاد (2D) وبطاقة اليقظة الديداكتيكية",
      status: is2DAndVigilanceReady ? "PASS" : "RECOMMEND",
      detail: is2DAndVigilanceReady
        ? "مصفوفة التخصيص ثنائية الأبعاد (الدروس × المهارات N1/N2/N3) وبطاقة رصد الأخطاء الشائعة مدمجتان في ملف الأستاذ."
        : "لتعزيز حجية الفرض أمام التفتيش التربوي، يُنصح بتفعيل مصفوفة التخصيص ثنائية الأبعاد (2D) وبطاقة اليقظة الديداكتيكية للأخطاء الشائعة.",
      actionLabel: is2DAndVigilanceReady
        ? "مفعلة بالكامل ✓"
        : "تفعيل مصفوفة 2D واليقظة الديداكتيكية",
      onFix: () => {
        setInclude2DSpecMatrix(true);
        setIncludeDidacticVigilanceSheet(true);
        setStatusMessage({
          type: "success",
          text: "تم تفعيل مصفوفة التخصيص ثنائية الأبعاد (2D) وبطاقة اليقظة الديداكتيكية للأخطاء الشائعة بنجاح!",
        });
      },
    });

    // 9. الإدماج التكنولوجي (TICE / GeoGebra QR) وسلامة بيانات الترويسة الرسمية
    const isTiceAndIdentityReady =
      includeTICE && autoAttachGeoGebra && !quickEditorValidation.hasErrors;
    items.push({
      id: "TICE_AND_IDENTITY",
      title: "الإدماج التكنولوجي (TICE / GeoGebra QR) وسلامة الهوية الرسمية",
      status: isTiceAndIdentityReady ? "PASS" : "RECOMMEND",
      detail: isTiceAndIdentityReady
        ? "إدماج البرمجيات التفاعلية (GeoGebra / Python TICE) مفعّل مع اكتمال بيانات المؤسسة والأستاذ وعناوين التمارين."
        : "يُنصح بتفعيل الإدماج التكنولوجي (TICE / GeoGebra QR) والتأكد من خلو عناوين التمارين والترويسة من الحقول الفارغة.",
      actionLabel: isTiceAndIdentityReady
        ? "مستوفى بالكامل ✓"
        : "تفعيل TICE وضبط العناوين",
      onFix: () => {
        setIncludeTICE(true);
        setAutoAttachGeoGebra(true);
        if (quickEditorValidation.hasErrors) {
          handleFixEmptyQuickTitles();
        }
        setStatusMessage({
          type: "success",
          text: "تم تفعيل الإدماج التكنولوجي (TICE / GeoGebra QR) وضبط بيانات الهوية وعناوين التمارين بنجاح!",
        });
      },
    });

    // 10. رمز الاستجابة السريعة (QR Code) للنسخة التفاعلية الرقمية للفرض والمطابقة مع المذكرة 142-08
    items.push({
      id: "INTERACTIVE_QR_142_08",
      title: "رمز QR للنسخة التفاعلية الرقمية للفرض في أسفل وثيقة PDF (مذكرة 142-08)",
      status: includeInteractiveQrFooter ? "PASS" : "RECOMMEND",
      detail: includeInteractiveQrFooter
        ? "رمز الاستجابة السريعة (QR Code) مدمج في أسفل وثيقة PDF لتمكين التلاميذ من مسحه والولوج الفوري للنسخة التفاعلية والتصحيح الآلي."
        : "يُنصح بتفعيل رمز QR في أسفل وثيقة PDF لربط الورقة المطبوعة بالنسخة التفاعلية الرقمية للفرض المحروس.",
      actionLabel: includeInteractiveQrFooter ? "مفعّل في أسفل PDF ✓" : "تفعيل رمز QR التفاعلي",
      onFix: () => {
        setIncludeInteractiveQrFooter(true);
        setStatusMessage({
          type: "success",
          text: "تم تفعيل رمز الاستجابة السريعة (QR Code) للنسخة التفاعلية الرقمية في أسفل وثيقة PDF!",
        });
      },
    });

    // 11. مدقق "العقوبة المزدوجة" الديداكتيكي الآلي وفحص سلامة التعبيرات الرياضية بـ MathJS
    const doublePenaltyList = detectDoublePenaltyInLessons(
      activeCustomLessons,
      (lesson) => getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity)
    );
    const isDoublePenaltyFree = doublePenaltyList.length === 0;
    items.push({
      id: "DOUBLE_PENALTY_MATHJS",
      title: "سلامة التعبيرات الجبرية (MathJS) وخلو الفرض من «العقوبة المزدوجة» الديداكتيكية",
      status: isDoublePenaltyFree ? "PASS" : "RECOMMEND",
      detail: isDoublePenaltyFree
        ? "جميع التعبيرات الرياضية مفحوصة عبر MathJS، ولا توجد أسئلة وسطية مفتوحة تؤدي إلى عقوبة مزدوجة للتلميذ."
        : `رصد مدقق المفتش ${doublePenaltyList.length} سؤالاً وسطياً مفتوحاً قد يؤدي إلى عقوبة مزدوجة؛ يُنصح بتحويلها إلى صيغة «بين أن / Montrer que».`,
      actionLabel: isDoublePenaltyFree
        ? "فتح مختبر MathJS والمفتش"
        : `إصلاح العقوبة المزدوجة (${doublePenaltyList.length})`,
      onFix: () => {
        if (doublePenaltyList.length > 0) {
          setMathInspectorStudioTab("DOUBLE_PENALTY_DETECTOR");
          setShowMathInspectorStudioModal(true);
        } else {
          setMathInspectorStudioTab("MATHJS_VALIDATOR");
          setShowMathInspectorStudioModal(true);
        }
      },
    });

    // 12. المسار الفارقي بالاختيار (البيداغوجيا الفارقية) وسؤال التميز والتتبع الطولي لمكتسبات الفوج (DS1 → DS2 → DS3)
    const isDiffAndLongitudinalReady =
      differentiatedPathConfig.enabled &&
      longitudinalCohortConfig.includeInPrintablePreview;
    items.push({
      id: "DIFF_PATH_AND_LONGITUDINAL",
      title: "المسار الفارقي بالاختيار (+1 ن تميز) ولوحة التتبع الطولي لمكتسبات الفوج (DS1→DS3)",
      status: isDiffAndLongitudinalReady ? "PASS" : "RECOMMEND",
      detail: isDiffAndLongitudinalReady
        ? "المسار الفارقي بالاختيار (Piste Guidée / Experte) وبطاقة التتبع الطولي لمكتسبات الفوج (DS1→DS2→DS3) مفعلان في الورقة."
        : "لتفعيل مقترحات أستاذ المادة والمفتش التربوي، يمكنك إدراج المسار الفارقي وسؤال التميز (+1 ن) وبطاقة التتبع الطولي للفوج.",
      actionLabel: isDiffAndLongitudinalReady
        ? "مفعلة بالكامل ✓"
        : "تفعيل المسار الفارقي والتتبع الطولي",
      onFix: () => {
        setDifferentiatedPathConfig((prev) => ({
          ...prev,
          enabled: true,
          includeBonusQuestion: true,
        }));
        setLongitudinalCohortConfig((prev) => ({
          ...prev,
          includeInPrintablePreview: true,
        }));
        setStatusMessage({
          type: "success",
          text: "تم تفعيل المسار الفارقي بالاختيار وسؤال التميز (+1 ن) وبطاقة التتبع الطولي لمكتسبات الفوج (DS1 → DS2 → DS3) في المعاينة!",
        });
      },
    });

    // 13. التدرج الديداكتيكي وميزانية الزمن (قاعدة 1x3 للمفتش التربوي)
    const examDurationMinutes = currentTrack.durationFr?.includes("3h")
      ? 180
      : currentTrack.durationFr?.includes("1h30")
      ? 90
      : 120;
    const didacticProgression = analyzeDidacticProgressionAndTimeBudget(
      activeCustomLessons,
      (lesson) => getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity),
      examDurationMinutes
    );
    const isTimeFeasible = didacticProgression.timeBudgetStatus !== "OVERLOAD";
    const hasNoInversion = didacticProgression.inversionCount === 0;
    const isProgressionOptimal = isTimeFeasible && hasNoInversion;

    items.push({
      id: "DIDACTIC_PROGRESSION_AND_BUDGET",
      title: "التدرج الديداكتيكي المعرفي (N1→N2→N3) وميزانية الزمن التقديري (قاعدة 1×3)",
      status: isProgressionOptimal ? "PASS" : "RECOMMEND",
      detail: isProgressionOptimal
        ? `الميزانية الزمنية للتلميذ متوازنة (${didacticProgression.totalStudentMinutes} د لفرض مدته ${examDurationMinutes} د)، والتدرج الصعودي للأسئلة محترم.`
        : `تنبيه ديداكتيكي: زمن التلميذ المقدر (${didacticProgression.totalStudentMinutes} د) قد يفوق سعة الإنجاز، أو توجد أسئلة مركبة تسبق التطبيق المباشر (${didacticProgression.inversionCount} تنبيه).`,
      actionLabel: "ضبط التدرج وميزانية الزمن",
      onFix: () => {
        setMathInspectorStudioTab("DOUBLE_PENALTY_DETECTOR");
        setShowMathInspectorStudioModal(true);
      },
    });

    // 14. تدقيق الكثافة الإخراجية للوثيقة (A4 Page Fit) وصحة الشجرة الرياضية LaTeX AST
    const docDiagnostics = runFullEdTechDocumentDiagnostics(
      activeCustomLessons,
      (lesson) => getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity),
      longitudinalCohortConfig.includeInPrintablePreview
    );
    const isDocDensityHealthy = !docDiagnostics.hasOrphanPageRisk && docDiagnostics.latexDelimiterWarningsCount === 0;

    items.push({
      id: "EDTECH_DENSITY_AND_AST",
      title: "المعايرة الطباعية للورقة A4، كثافة التصفيف، وسلامة شجرة الرموز LaTeX AST",
      status: isDocDensityHealthy ? "PASS" : "RECOMMEND",
      detail: isDocDensityHealthy
        ? `الإخراج الطباعي متزن بنسبة ملء ${docDiagnostics.lastPageFillPercent}% على ${docDiagnostics.estimatedA4Pages} صفحة A4، وشجرة LaTeX خالية من الأقواس المكسورة.`
        : `ملاحظة إخراجية: خطر صفحة يتيمة (كثافة الصفحة الأخيرة ${docDiagnostics.lastPageFillPercent}%) أو أقواس LaTeX غير متوازنة (${docDiagnostics.latexDelimiterWarningsCount}). يُنصح بالمواءمة عبر استوديو المطور.`,
      actionLabel: "استوديو المطور EdTech",
      onFix: () => {
        setMathInspectorStudioTab("EDTECH_DEV_STUDIO");
        setShowMathInspectorStudioModal(true);
      },
    });

    const passCount = items.filter((i) => i.status === "PASS").length;
    const scorePercent = Math.round((passCount / items.length) * 100);

    return {
      items,
      passCount,
      issueCount: items.length - passCount,
      scorePercent,
      technicalMetrics: {
        doublePenaltyCount: doublePenaltyList.length,
        doublePenaltySummary:
          doublePenaltyList.length === 0
            ? "جميع التعبيرات الرياضية مفحوصة عبر MathJS وخالية من أسئلة العقوبة المزدوجة الوسطية."
            : `تم رصد ${doublePenaltyList.length} سؤالاً وسطياً مفتوحاً يوصى بتحويله إلى صيغة «بين أن / Montrer que».`,
        estimatedStudentMinutes: didacticProgression.totalStudentMinutes,
        officialDurationMinutes: examDurationMinutes,
        timeBudgetStatus: didacticProgression.timeBudgetStatus,
        inversionCount: didacticProgression.inversionCount,
        estimatedA4Pages: docDiagnostics.estimatedA4Pages,
        lastPageFillPercent: docDiagnostics.lastPageFillPercent,
        latexDelimiterWarningsCount: docDiagnostics.latexDelimiterWarningsCount,
      },
    };
  }, [
    liveExamStats,
    totalCustomWeight,
    activeCustomLessons,
    dsQuestionDensity,
    differentiatedPathConfig.enabled,
    longitudinalCohortConfig.includeInPrintablePreview,
    n1,
    n2,
    n3,
    currentTrack.durationFr,
    currentTrack.durationAr,
    dsStructureMode,
    includeDetailedSolutions,
    showQuestionBareme,
    includeGradingScaleTable,
    includeDSStudentSelfCheck,
    includePostExamRemediationSheet,
    includeOfficialExamCoverSheet,
    includeExamFormulaSheet,
    includeAnswerWorkspace,
    includeIndividualGradingStrip,
    includeRescueHintsAndContinuity,
    include2DSpecMatrix,
    includeDidacticVigilanceSheet,
    includeTICE,
    autoAttachGeoGebra,
    includeInteractiveQrFooter,
    quickEditorValidation.hasErrors,
    handleFixEmptyQuickTitles,
  ]);

  const [isExportingAuditPDF, setIsExportingAuditPDF] = useState<boolean>(false);
  const [autoExportAuditPdfOnFix, setAutoExportAuditPdfOnFix] = useState<boolean>(true);

  const handleExportPedagogicalAuditPDF = useCallback(
    async (isAutoTriggered: boolean = false) => {
      if (isExportingAuditPDF) return;
      setIsExportingAuditPDF(true);
      setStatusMessage({
        type: "info",
        text: isAutoTriggered
          ? "جاري التصدير التلقائي لتقرير «مرصد التدقيق البيداغوجي والتقني» إلى ملف PDF مستقل..."
          : "جاري توليد وتصدير تقرير «مرصد التدقيق البيداغوجي والتقني» إلى ملف PDF مستقل...",
      });

      try {
        const effectiveTitle =
          customDocTitle ||
          (isExamSimulationActive && activeImportedBlueprint
            ? activeImportedBlueprint.titleAr
            : defaultDocTitle);

        const lessonsSummary = activeCustomLessons.map((l) => ({
          lessonAr: l.lessonAr,
          lessonFr: l.lessonFr,
          weight: l.weight,
          points: Number(((l.weight / 100) * 20).toFixed(2)),
        }));

        const exportedFileName = await exportPedagogicalAuditReportToPDF({
          academy,
          direction,
          school,
          prof,
          year,
          trackLabelAr: currentTrack.labelAr,
          trackLabelFr: currentTrack.labelFr,
          trackCode: currentTrack.code,
          semester,
          dsKey,
          docTitle: effectiveTitle,
          durationFr: currentTrack.durationFr,
          examModel,
          scorePercent: pedagogicalAuditReport.scorePercent,
          passCount: pedagogicalAuditReport.passCount,
          issueCount: pedagogicalAuditReport.issueCount,
          totalPoints: liveExamStats.totalPoints,
          totalQuestions: liveExamStats.totalQuestions,
          totalExercises: activeCustomLessons.length,
          n1,
          n2,
          n3,
          items: pedagogicalAuditReport.items.map((it) => ({
            id: it.id,
            title: it.title,
            status: it.status,
            detail: it.detail,
            actionLabel: it.actionLabel,
          })),
          technicalMetrics: pedagogicalAuditReport.technicalMetrics,
          lessonsSummary,
        });

        const updatedHist = recordExportHistoryEntry({
          fileName: exportedFileName,
          formatLabel: "Audit Report PDF (142-08)",
          category: "PDF",
          trackCode: currentTrack.code,
          trackLabelAr: currentTrack.labelAr,
          semester,
          moduleType: activeModule,
          modelCode: examModel,
          fileSizeKb: 195.4,
          dpiOrCompiler: "Standalone Audit PDF · 300 DPI",
          includeAnswerWorkspace,
          includeDetailedSolutions,
        });
        setExportHistory(updatedHist);

        setStatusMessage({
          type: "success",
          text: `✓ تم تصدير تقرير «مرصد التدقيق البيداغوجي» المستقل (${exportedFileName}) شاملاً جميع التوصيات البيداغوجية والتقنية (${pedagogicalAuditReport.scorePercent}%) بنجاح!`,
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "تعذر تصدير تقرير مرصد التدقيق البيداغوجي إلى PDF.";
        setStatusMessage({
          type: "error",
          text: msg,
        });
      } finally {
        setIsExportingAuditPDF(false);
      }
    },
    [
      isExportingAuditPDF,
      customDocTitle,
      isExamSimulationActive,
      activeImportedBlueprint,
      defaultDocTitle,
      activeCustomLessons,
      academy,
      direction,
      school,
      prof,
      year,
      currentTrack,
      semester,
      dsKey,
      examModel,
      pedagogicalAuditReport,
      liveExamStats,
      n1,
      n2,
      n3,
      activeModule,
      includeAnswerWorkspace,
      includeDetailedSolutions,
    ]
  );

  const handleAutoFixAllAuditIssues = () => {
    setCustomQuestionBaremesMap({});
    handleNormalizeWeightsTo100();
    setN1(35);
    setN2(45);
    setN3(20);
    setDsQuestionDensity("STANDARD");
    setIncludeDetailedSolutions(true);
    setShowQuestionBareme(true);
    setIncludeGradingScaleTable(true);
    setIncludeExamFormulaSheet(true);
    setIncludeDSStudentSelfCheck(true);
    setIncludePostExamRemediationSheet(true);
    setIncludeOfficialExamCoverSheet(true);
    setIncludeIndividualGradingStrip(true);
    setIncludeRescueHintsAndContinuity(true);
    setInclude2DSpecMatrix(true);
    setIncludeDidacticVigilanceSheet(true);
    setIncludeTICE(true);
    setAutoAttachGeoGebra(true);
    setIncludeInteractiveQrFooter(true);
    setDifferentiatedPathConfig((prev) => ({
      ...prev,
      enabled: true,
      includeBonusQuestion: true,
    }));
    setLongitudinalCohortConfig((prev) => ({
      ...prev,
      includeInPrintablePreview: true,
    }));
    if (quickEditorValidation.hasErrors) {
      handleFixEmptyQuickTitles();
    }
    setStatusMessage({
      type: "success",
      text: "✓ تمت المراجعة الشاملة وتصحيح جميع البنود الـ 14: موازنة التنقيط 20/20، المذكرة 142-08، مصفوفة التخصيص 2D، المسار الفارقي، واليقظة الديداكتيكية!",
    });
    if (autoExportAuditPdfOnFix) {
      window.setTimeout(() => {
        handleExportPedagogicalAuditPDF(true);
      }, 350);
    }
  };

  const handleSliderChange = (level: "N1" | "N2" | "N3", val: number) => {
    if (level === "N1") {
      const rem = 100 - val;
      const newN2 = Math.max(15, Math.min(55, Math.round((rem * n2) / Math.max(1, n2 + n3))));
      const newN3 = Math.max(5, 100 - val - newN2);
      setN1(val);
      setN2(100 - val - newN3);
      setN3(newN3);
    } else if (level === "N2") {
      const newN3 = Math.max(5, 100 - n1 - val);
      setN2(100 - n1 - newN3);
      setN3(newN3);
    } else {
      const newN2 = Math.max(15, 100 - n1 - val);
      setN3(100 - n1 - newN2);
      setN2(newN2);
    }
  };

  const historyStateRef = useRef({ history, historyIndex });
  useEffect(() => {
    historyStateRef.current = { history, historyIndex };
  }, [history, historyIndex]);

  // تسجيل لقطة جديدة في سجل التراجع/الإعادة عند تعديل العناوين أو أوزان الدروس أو المؤسسة/الأستاذ
  useEffect(() => {
    if (isHistoryNavigatingRef.current) {
      isHistoryNavigatingRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const { history: curHist, historyIndex: curIdx } = historyStateRef.current;
      const currentSnap = curHist[curIdx];
      const nextSnap: QuickEditorSnapshot = {
        customDocTitle,
        customDocSubtitle,
        customHeaderNote,
        customExerciseTitles,
        customWeightsMap,
        customLessonIconsMap,
        school,
        prof,
      };

      if (currentSnap) {
        const isIdentical =
          currentSnap.customDocTitle === nextSnap.customDocTitle &&
          currentSnap.customDocSubtitle === nextSnap.customDocSubtitle &&
          currentSnap.customHeaderNote === nextSnap.customHeaderNote &&
          currentSnap.school === nextSnap.school &&
          currentSnap.prof === nextSnap.prof &&
          JSON.stringify(currentSnap.customExerciseTitles) ===
            JSON.stringify(nextSnap.customExerciseTitles) &&
          JSON.stringify(currentSnap.customWeightsMap) ===
            JSON.stringify(nextSnap.customWeightsMap) &&
          JSON.stringify(currentSnap.customLessonIconsMap || {}) ===
            JSON.stringify(nextSnap.customLessonIconsMap || {});

        if (isIdentical) return;
      }

      const sliced = curHist.slice(0, curIdx + 1);
      const updated = [...sliced, nextSnap];
      if (updated.length > 30) {
        updated.shift();
      }
      setHistory(updated);
      setHistoryIndex(updated.length - 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    customDocTitle,
    customDocSubtitle,
    customHeaderNote,
    customExerciseTitles,
    customWeightsMap,
    customLessonIconsMap,
    school,
    prof,
  ]);

  // دالة التحديث التلقائي لأوزان مصفوفة التخصيص 2D وإدراج التمارين الداعمة (N1/N2) بناءً على نتائج الفرض السابق
  const handleApplyAdaptiveSpecMatrixWeightsAndExercises = useCallback(
    (payload: AdaptiveApplyPayload) => {
      const { rawLessonWeightsMap, recommendedRatios, injectedExercises } = payload;

      // 1. تحديث أوزان الدروس في المصفوفة 2D تلقائياً
      setCustomWeightsMap((prev) => {
        const next = { ...prev };
        Object.entries(rawLessonWeightsMap).forEach(([lessonFr, newWeight]) => {
          next[`${currentTrack.code}_${lessonFr}`] = newWeight;
        });
        return next;
      });

      // 2. تحديث نسب المستويات المهارية (N1 / N2 / N3)
      setN1(recommendedRatios.n1);
      setN2(recommendedRatios.n2);
      setN3(recommendedRatios.n3);

      // 3. اقتراح وإدراج تمارين إضافية للدروس ذات المهارات الأقل اكتساباً (N1/N2) في الفرض القادم
      if (injectedExercises && injectedExercises.length > 0) {
        const groupedByLesson: Record<
          string,
          typeof injectedExercises
        > = {};
        injectedExercises.forEach((ex) => {
          if (!groupedByLesson[ex.lessonFr]) {
            groupedByLesson[ex.lessonFr] = [];
          }
          groupedByLesson[ex.lessonFr].push(ex);
        });

        setCustomQuestionsMap((prevQ) => {
          const nextQ = { ...prevQ };
          Object.entries(groupedByLesson).forEach(([lessonFr, exList]) => {
            const key = `${currentTrack.code}_${lessonFr}`;
            const baseLesson = activeCustomLessons.find(
              (l) => l.lessonFr === lessonFr
            );
            const fallbackVariant = baseLesson
              ? getVariantQuestions(baseLesson, "A", false, 0, dsQuestionDensity)
              : { questionsAr: [], questionsFr: [] };
            const existingAr =
              nextQ[key]?.ar ||
              (baseLesson?.sampleExerciseAr && baseLesson.sampleExerciseAr.length > 0
                ? [...baseLesson.sampleExerciseAr]
                : [...fallbackVariant.questionsAr]);
            const existingFr =
              nextQ[key]?.fr ||
              (baseLesson?.sampleExerciseFr && baseLesson.sampleExerciseFr.length > 0
                ? [...baseLesson.sampleExerciseFr]
                : [...fallbackVariant.questionsFr]);

            const newAr = [...existingAr];
            const newFr = [...existingFr];

            exList.forEach((ex) => {
              if (!newAr.includes(ex.questionAr)) {
                newAr.push(ex.questionAr);
                newFr.push(ex.questionFr);
              }
            });

            nextQ[key] = { ar: newAr, fr: newFr };
          });
          return nextQ;
        });

        setCustomQuestionLevelsMap((prevLvl) => {
          const nextLvl = { ...prevLvl };
          Object.entries(groupedByLesson).forEach(([lessonFr, exList]) => {
            const key = `${currentTrack.code}_${lessonFr}`;
            const baseLesson = activeCustomLessons.find(
              (l) => l.lessonFr === lessonFr
            );
            const fallbackVariant = baseLesson
              ? getVariantQuestions(baseLesson, "A", false, 0, dsQuestionDensity)
              : { questionsAr: [], questionsFr: [] };
            const baseCount =
              baseLesson?.sampleExerciseAr?.length ||
              fallbackVariant.questionsAr.length ||
              3;
            const currentArr: Array<"N1" | "N2" | "N3"> = nextLvl[key]
              ? [...nextLvl[key]]
              : Array.from({ length: baseCount }, (_, idx) =>
                  idx === 0 ? "N1" : idx === baseCount - 1 ? "N3" : "N2"
                );
            exList.forEach((ex) => {
              currentArr.push(ex.level);
            });
            nextLvl[key] = currentArr;
          });
          return nextLvl;
        });

        // إزالة أي تخصيص يدوي جامد للنقط كي يعيد النظام توزيع الوزن الجديد للدرس بدقة (0.25 ن) مع الحفاظ على المجموع 20/20
        setCustomQuestionBaremesMap((prevBar) => {
          const nextBar = { ...prevBar };
          Object.keys(groupedByLesson).forEach((lessonFr) => {
            const key = `${currentTrack.code}_${lessonFr}`;
            delete nextBar[key];
          });
          return nextBar;
        });
      }

      setStatusMessage({
        type: "success",
        text:
          injectedExercises.length > 0
            ? `تم تحديث أوزان مصفوفة التخصيص 2D تلقائياً وإدراج ${injectedExercises.length} أسئلة/تمارين داعمة للمهارات الأقل اكتساباً (N1/N2) مع موازنة السلم على 20/20!`
            : `تم تحديث أوزان مصفوفة التخصيص 2D تلقائياً (${recommendedRatios.n1}% N1 · ${recommendedRatios.n2}% N2 · ${recommendedRatios.n3}% N3) بناءً على نتائج الفرض السابق!`,
      });
    },
    [currentTrack.code, activeCustomLessons, dsQuestionDensity]
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const targetIdx = historyIndex - 1;
    const snap = history[targetIdx];
    if (!snap) return;

    isHistoryNavigatingRef.current = true;
    setCustomDocTitle(snap.customDocTitle);
    setCustomDocSubtitle(snap.customDocSubtitle);
    setCustomHeaderNote(snap.customHeaderNote);
    setCustomExerciseTitles(snap.customExerciseTitles);
    setCustomWeightsMap(snap.customWeightsMap);
    if (snap.customLessonIconsMap) {
      setCustomLessonIconsMap(snap.customLessonIconsMap);
    }
    setSchool(snap.school);
    setProf(snap.prof);
    setHistoryIndex(targetIdx);
    setStatusMessage({
      type: "info",
      text: `تم التراجع عن التعديل (Undo) — الخطوة ${targetIdx + 1} من ${history.length}`,
    });
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const targetIdx = historyIndex + 1;
    const snap = history[targetIdx];
    if (!snap) return;

    isHistoryNavigatingRef.current = true;
    setCustomDocTitle(snap.customDocTitle);
    setCustomDocSubtitle(snap.customDocSubtitle);
    setCustomHeaderNote(snap.customHeaderNote);
    setCustomExerciseTitles(snap.customExerciseTitles);
    setCustomWeightsMap(snap.customWeightsMap);
    if (snap.customLessonIconsMap) {
      setCustomLessonIconsMap(snap.customLessonIconsMap);
    }
    setSchool(snap.school);
    setProf(snap.prof);
    setHistoryIndex(targetIdx);
    setStatusMessage({
      type: "info",
      text: `تمت استعادة التعديل (Redo) — الخطوة ${targetIdx + 1} من ${history.length}`,
    });
  }, [historyIndex, history]);

  // دعم اختصارات لوحة المفاتيح لسطح المكتب: Ctrl+Z للتراجع، Ctrl+Y للإعادة، Ctrl+E لمركز التصدير، و Ctrl+B لوضع التركيز على الورقة
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      const keyLower = e.key.toLowerCase();
      if (keyLower === "z" && !e.shiftKey) {
        if (historyIndex > 0) {
          e.preventDefault();
          handleUndo();
        }
      } else if ((keyLower === "z" && e.shiftKey) || keyLower === "y") {
        if (historyIndex < history.length - 1) {
          e.preventDefault();
          handleRedo();
        }
      } else if (keyLower === "e") {
        e.preventDefault();
        setIsExportCenterOpen((v) => !v);
      } else if (keyLower === "b") {
        e.preventDefault();
        setIsConfigDeckCollapsed((v) => !v);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, historyIndex, history.length]);

  // بناء الرابط التفاعلي المباشر للفرض المحروس (لتضمينه في رمز QR أسفل وثيقة PDF)
  const interactiveExamUrl = useMemo(() => {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://ais-pre-rsw3xd2wr4jevx5kl4om4d-251237406585.europe-west2.run.app";
    const params = new URLSearchParams();
    params.set("quiz", "1");
    params.set("sys", educationSystem);
    params.set("track", currentTrack.code);
    params.set("sem", semester);
    params.set("ds", dsKey);
    params.set("model", examModel === "B" ? "B" : "A");
    params.set("lang", docLang === "AR" ? "AR" : "FR");
    params.set("n1", String(n1));
    params.set("n2", String(n2));
    params.set("n3", String(n3));
    if (isCustomLessonMode && selectedLessonIndices.length > 0) {
      params.set("lessons", selectedLessonIndices.join(","));
    }
    return `${origin}/?${params.toString()}`;
  }, [
    educationSystem,
    currentTrack.code,
    semester,
    dsKey,
    examModel,
    docLang,
    n1,
    n2,
    n3,
    isCustomLessonMode,
    selectedLessonIndices,
  ]);

  // الاستجابة التلقائية عند مسح رمز QR من أسفل الفرض الورقي أو فتح الرابط التفاعلي المباشر
  useEffect(() => {
    if (hasHandledUrlQuizRef.current || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hasQuizTrigger = params.get("quiz") === "1" || Boolean(params.get("quizPin"));
    if (!hasQuizTrigger) return;

    hasHandledUrlQuizRef.current = true;
    skipTrackResetRef.current = true;

    const urlSys = params.get("sys");
    const urlTrack = params.get("track");
    const urlSem = params.get("sem");
    const urlDs = params.get("ds");
    const urlModel = params.get("model");
    const urlLang = params.get("lang");
    const urlN1 = Number(params.get("n1"));
    const urlN2 = Number(params.get("n2"));
    const urlN3 = Number(params.get("n3"));
    const urlLessons = params.get("lessons");

    const resolvedTrack =
      (urlTrack && CURRICULUM_DB[urlTrack]) || currentTrack || CURRICULUM_DB["2BAC_PC"];
    const resolvedSys: EducationSystem =
      urlSys === "MISSION_FRANCAISE" || resolvedTrack.system === "MISSION_FRANCAISE"
        ? "MISSION_FRANCAISE"
        : "MAROC_NATIONAL";
    const resolvedSem: SemesterType = urlSem === "S2" ? "S2" : "S1";
    const availableDsForTrack = Object.keys(resolvedTrack.semesters[resolvedSem] || {});
    const resolvedDs =
      urlDs && availableDsForTrack.includes(urlDs)
        ? urlDs
        : availableDsForTrack[0] || "DS1";

    setEducationSystem(resolvedSys);
    setSelectedTrackCode(resolvedTrack.code);
    setSemester(resolvedSem);
    setDsKey(resolvedDs);
    if (urlModel === "A" || urlModel === "B") {
      setExamModel(urlModel);
    }
    if (urlLang === "AR" || urlLang === "FR") {
      setDocLang(urlLang);
    }
    if (urlN1 > 0 && urlN2 > 0 && urlN3 > 0 && urlN1 + urlN2 + urlN3 === 100) {
      setN1(urlN1);
      setN2(urlN2);
      setN3(urlN3);
    }

    const trackAllLessons = [
      ...Object.values(resolvedTrack.semesters.S1).flat(),
      ...Object.values(resolvedTrack.semesters.S2).flat(),
    ];

    let targetQuizLessons =
      resolvedTrack.semesters[resolvedSem][resolvedDs] || trackAllLessons.slice(0, 2);

    if (urlLessons) {
      const parsedIndices = urlLessons
        .split(",")
        .map((x) => parseInt(x.trim(), 10))
        .filter((idx) => !isNaN(idx) && idx >= 0 && idx < trackAllLessons.length);
      if (parsedIndices.length > 0) {
        setIsCustomLessonMode(true);
        setSelectedLessonIndices(parsedIndices);
        targetQuizLessons = parsedIndices.map((i) => trackAllLessons[i]);
      }
    }

    try {
      const quizTitleAr = `الفرض المحروس رقم ${resolvedDs.replace("DS", "")} (${
        resolvedSem === "S1" ? "الدورة 1" : "الدورة 2"
      }) — ${resolvedTrack.labelAr}`;
      const quizTitleFr = `Devoir Surveillé N° ${resolvedDs.replace("DS", "")} (${resolvedSem}) — ${resolvedTrack.labelFr}`;
      const generatedQuiz = convertExercisesToInteractiveQuiz({
        lessons: targetQuizLessons,
        titleAr: quizTitleAr,
        titleFr: quizTitleFr,
        schoolAr: school,
        schoolFr: school,
        prof,
        trackCode: resolvedTrack.code,
        system: resolvedSys,
        durationMinutes: 45,
        calculatorAllowed,
      });
      setCurrentInteractiveQuiz(generatedQuiz);
      setShowInteractiveQuizModal(true);
      setStatusMessage({
        type: "success",
        text: `تم فتح النسخة التفاعلية الرقمية للفرض المحروس (${resolvedTrack.labelAr} · ${resolvedDs}) عبر رمز الاستجابة السريعة QR!`,
      });
    } catch {
      // ignore
    }
  }, [currentTrack, school, prof, calculatorAllowed]);

  const buildSourceCodeForFormat = useCallback(
    (targetFormat: ExportFormat) => {
      return generateOfflineSourceCode({
        track: currentTrack,
        sem: semester,
        dsKey,
        school,
        prof,
        year,
        academy,
        direction,
        headerStyle,
        includeStudentBox,
        includeGradeBox,
        calculatorAllowed,
        includeCompetencies,
        examModel,
        shuffleQuestions,
        shuffleExercises,
        docLang,
        bilingualLayout,
        exportFormat: targetFormat,
        activeModule,
        n1,
        n2,
        n3,
        fillBlanks,
        includeTICE,
        selectedLessonIdx,
        diagDuration,
        diagType,
        customTopicNote,
        system: educationSystem,
        customLessons: activeCustomLessons,
        dmSubType,
        dmNumber,
        dmDueDate,
        serieExerciseCount,
        includeHints,
        includeTeacherLogo,
        customDocTitle,
        customDocSubtitle,
        customHeaderNote,
        customExerciseTitles,
        includeDetailedSolutions,
        solutionDisplayMode,
        showQuestionBareme,
        includeSelfEvalGrid,
        geoGebraResourcesMap,
        autoAttachGeoGebra,
        dsStructureMode,
        dsQuestionDensity,
        moroccanDMType,
        includeLessonMemo,
        includeDMContract,
        latexPackageTheme,
        tcolorboxConfig,
        qcmConfig: activeQcmConfig,
        include2DSpecMatrix,
        includeAnswerWorkspace,
        studentGridStyle,
        includeInteractiveQrFooter,
        interactiveExamUrl,
        attachedPythonAlgorithms,
        appliedTitleCalligraphy,
        pageMarginsMm: customPageMarginsMm,
      });
    },
    [
      currentTrack,
      semester,
      dsKey,
      school,
      prof,
      year,
      academy,
      direction,
      headerStyle,
      includeStudentBox,
      includeGradeBox,
      calculatorAllowed,
      includeCompetencies,
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
      diagType,
      customTopicNote,
      educationSystem,
      activeCustomLessons,
      dmSubType,
      dmNumber,
      dmDueDate,
      serieExerciseCount,
      includeHints,
      includeTeacherLogo,
      customDocTitle,
      customDocSubtitle,
      customHeaderNote,
      customExerciseTitles,
      includeDetailedSolutions,
      solutionDisplayMode,
      showQuestionBareme,
      includeSelfEvalGrid,
      geoGebraResourcesMap,
      autoAttachGeoGebra,
      dsStructureMode,
      dsQuestionDensity,
      moroccanDMType,
      includeLessonMemo,
      includeDMContract,
      latexPackageTheme,
      tcolorboxConfig,
      activeQcmConfig,
      include2DSpecMatrix,
      includeAnswerWorkspace,
      studentGridStyle,
      includeInteractiveQrFooter,
      interactiveExamUrl,
      attachedPythonAlgorithms,
      appliedTitleCalligraphy,
      customPageMarginsMm,
    ]
  );

  const triggerOfflineGeneration = useCallback(() => {
    const code = buildSourceCodeForFormat(exportFormat);
    setGeneratedCode(code);
  }, [buildSourceCodeForFormat, exportFormat]);

  const handleDirectExportOverleafZip = useCallback(async () => {
    try {
      const durationAr = currentTrack.durationAr || "ساعتان (2h)";
      const durationFr = currentTrack.durationFr || "2 heures";
      const latexSource =
        exportFormat === "TYPST" || !generatedCode
          ? buildSourceCodeForFormat("LATEX")
          : generatedCode;
      const zipBlob = await generateOverleafZipBundle({
        docTitle: `${currentTrack.cycle}_${activeModule}_${dsKey}_${year}`,
        school,
        prof,
        year,
        academy,
        direction,
        trackLabelAr: currentTrack.labelAr,
        trackLabelFr: currentTrack.labelFr,
        examModel,
        durationAr,
        durationFr,
        latexCode: latexSource,
        hasQcm:
          dsStructureMode === "QCM_ET_EXERCICES" ||
          dsStructureMode === "COMPLETE_EXAM_MAROC",
        hasPython: attachedPythonAlgorithms.length > 0,
        appliedTitleCalligraphy,
      });

      const zipFileName = `Overleaf_${currentTrack.code}_${semester}_${dsKey}_${year}.zip`;
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const updatedHist = recordExportHistoryEntry({
        fileName: zipFileName,
        formatLabel: "Overleaf Project (.zip)",
        category: "OVERLEAF_ZIP",
        trackCode: currentTrack.code,
        trackLabelAr: currentTrack.labelAr,
        semester,
        moduleType: activeModule,
        modelCode: examModel,
        fileSizeKb: Number((zipBlob.size / 1024).toFixed(1)) || 46.8,
        dpiOrCompiler: "XeLaTeX · TeX Live 2025",
        includedFiles: ["main.tex", "preamble.tex", "README_OVERLEAF.md"],
        includeAnswerWorkspace,
        includeDetailedSolutions,
        cachedContent: latexSource,
      });
      setExportHistory(updatedHist);

      setStatusMessage({
        type: "success",
        text: `تم إنشاء وتحميل حزمة Overleaf ZIP المتكاملة (${zipFileName}) وحفظها في لوحة الملفات المصدّرة!`,
      });
    } catch {
      setStatusMessage({
        type: "error",
        text: "تعذر توليد حزمة Overleaf ZIP",
      });
    }
  }, [
    currentTrack,
    activeModule,
    dsKey,
    year,
    school,
    prof,
    academy,
    direction,
    examModel,
    semester,
    exportFormat,
    generatedCode,
    buildSourceCodeForFormat,
    dsStructureMode,
    attachedPythonAlgorithms.length,
    includeAnswerWorkspace,
    includeDetailedSolutions,
  ]);

  const handleApplyRemedialExam = useCallback(
    (remedialConfig: {
      targetLessons: LessonItem[];
      durationMinutes: number;
      totalPoints: number;
      n1: number;
      n2: number;
      n3: number;
      titleAr: string;
      titleFr: string;
    }) => {
      setActiveModule("DS_142_08");
      setViewMode("PREVIEW");
      setIsCustomLessonMode(true);
      const newIndices = remedialConfig.targetLessons
        .map((tl) => allTrackLessons.findIndex((l) => l.lessonFr === tl.lessonFr))
        .filter((idx) => idx !== -1);
      if (newIndices.length > 0) {
        setSelectedLessonIndices(newIndices);
      }
      setN1(remedialConfig.n1);
      setN2(remedialConfig.n2);
      setN3(remedialConfig.n3);
      setDiagDuration(`${remedialConfig.durationMinutes} min`);
      const nextTitle =
        isMission || docLang === "FR"
          ? remedialConfig.titleFr
          : remedialConfig.titleAr;
      const nextSubtitle =
        isMission || docLang === "FR"
          ? `Barème : ${remedialConfig.totalPoints} points · Durée : ${remedialConfig.durationMinutes} min`
          : `سلم التنقيط الإجمالي : ${remedialConfig.totalPoints} نقطة · المدة : ${remedialConfig.durationMinutes} دقيقة`;
      setCustomDocTitle(nextTitle);
      setCustomDocSubtitle(nextSubtitle);
      window.setTimeout(() => {
        setCustomDocTitle(nextTitle);
        setCustomDocSubtitle(nextSubtitle);
      }, 20);
      setIncludeDetailedSolutions(true);
      setIncludePostExamRemediationSheet(true);
      setIncludeIndividualGradingStrip(true);
      setCustomQuestionBaremesMap({});
      setStatusMessage({
        type: "success",
        text: `تم تفعيل وتوليد الفرض الاستدراكي بنجاح على ${remedialConfig.totalPoints} نقطة (${remedialConfig.durationMinutes} دقيقة)!`,
      });
    },
    [allTrackLessons, isMission, docLang]
  );

  const handleApplyAutoConformity = useCallback(
    (ratios: { n1: number; n2: number; n3: number }) => {
      setN1(ratios.n1);
      setN2(ratios.n2);
      setN3(ratios.n3);
      setCustomQuestionBaremesMap({});
      handleNormalizeWeightsTo100();
      setStatusMessage({
        type: "success",
        text: `تم تطبيق النسب الرسمية المعتمدة للمذكرة 142-08 (${ratios.n1}% N1 · ${ratios.n2}% N2 · ${ratios.n3}% N3) وموازنة السلم التراكمي!`,
      });
    },
    []
  );

  useEffect(() => {
    const genTimer = window.setTimeout(() => {
      triggerOfflineGeneration();
    }, 90);
    return () => window.clearTimeout(genTimer);
  }, [triggerOfflineGeneration]);

  // محرك التمرير المتزامن والتركيز التلقائي بين محرر الكود المصدري ومعاينة الورقة A4
  const detectSectionFromRatio = useCallback(
    (ratio: number): string => {
      if (ratio < 0.16) return "SPEC_TABLE";
      if (ratio < 0.32) return "HEADER";
      if (ratio < 0.68) return "EXERCISES";
      if (ratio < 0.85) return "SYNTHESIS_PROBLEM";
      return "SOLUTIONS";
    },
    []
  );

  const handleCodeScroll = useCallback(() => {
    const codeEl = codeScrollRef.current;
    if (!codeEl) return;
    if (isSyncingScrollRef.current === "PREVIEW") return;

    const maxScroll = Math.max(1, codeEl.scrollHeight - codeEl.clientHeight);
    const ratio = Math.min(1, Math.max(0, codeEl.scrollTop / maxScroll));
    lastScrollRatioRef.current = ratio;

    if (!syncScrollEnabled) return;

    const detected = detectSectionFromRatio(ratio);
    setActiveSyncSection((prev) => (prev === detected ? prev : detected));

    const previewEl = previewScrollRef.current;
    if (previewEl) {
      isSyncingScrollRef.current = "CODE";
      const previewMax = Math.max(
        1,
        previewEl.scrollHeight - previewEl.clientHeight
      );
      previewEl.scrollTop = ratio * previewMax;
      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = window.setTimeout(() => {
        if (isSyncingScrollRef.current === "CODE") {
          isSyncingScrollRef.current = null;
        }
      }, 60);
    }
  }, [syncScrollEnabled, detectSectionFromRatio]);

  const handlePreviewScroll = useCallback(() => {
    const previewEl = previewScrollRef.current;
    if (!previewEl) return;
    if (isSyncingScrollRef.current === "CODE") return;

    const maxScroll = Math.max(
      1,
      previewEl.scrollHeight - previewEl.clientHeight
    );
    const ratio = Math.min(1, Math.max(0, previewEl.scrollTop / maxScroll));
    lastScrollRatioRef.current = ratio;

    if (!syncScrollEnabled) return;

    const detected = detectSectionFromRatio(ratio);
    setActiveSyncSection((prev) => (prev === detected ? prev : detected));

    const codeEl = codeScrollRef.current;
    if (codeEl) {
      isSyncingScrollRef.current = "PREVIEW";
      const codeMax = Math.max(1, codeEl.scrollHeight - codeEl.clientHeight);
      codeEl.scrollTop = ratio * codeMax;
      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = window.setTimeout(() => {
        if (isSyncingScrollRef.current === "PREVIEW") {
          isSyncingScrollRef.current = null;
        }
      }, 60);
    }
  }, [syncScrollEnabled, detectSectionFromRatio]);

  const handleJumpToSyncSection = useCallback(
    (sectionId: string, fallbackRatio: number) => {
      setActiveSyncSection(sectionId);
      lastScrollRatioRef.current = fallbackRatio;

      const previewEl = previewScrollRef.current;
      if (previewEl) {
        const targetNode = previewEl.querySelector(
          `[data-sync-section="${sectionId}"]`
        ) as HTMLElement | null;
        if (targetNode) {
          const offsetTop =
            targetNode.getBoundingClientRect().top -
            previewEl.getBoundingClientRect().top +
            previewEl.scrollTop -
            16;
          previewEl.scrollTo({ top: Math.max(0, offsetTop), behavior: "smooth" });
        } else {
          const previewMax = Math.max(
            1,
            previewEl.scrollHeight - previewEl.clientHeight
          );
          previewEl.scrollTo({
            top: fallbackRatio * previewMax,
            behavior: "smooth",
          });
        }
      }

      const codeEl = codeScrollRef.current;
      if (codeEl) {
        const marker = `[SYNC_SECTION:${sectionId}]`;
        const idx = generatedCode.indexOf(marker);
        const ratioToUse =
          idx !== -1 && generatedCode.length > 0
            ? Math.min(1, Math.max(0, idx / generatedCode.length))
            : fallbackRatio;
        const codeMax = Math.max(1, codeEl.scrollHeight - codeEl.clientHeight);
        codeEl.scrollTo({ top: ratioToUse * codeMax, behavior: "smooth" });
      }
    },
    [generatedCode]
  );

  // عند التبديل بين وضع الكود ووضع المعاينة أو التقسيم، يتم استعادة موضع التمرير المقابل تلقائياً
  useEffect(() => {
    if (!syncScrollEnabled) return;
    const ratio = lastScrollRatioRef.current;
    const timer = window.setTimeout(() => {
      if ((viewMode === "CODE" || viewMode === "SPLIT") && codeScrollRef.current) {
        const codeMax = Math.max(
          1,
          codeScrollRef.current.scrollHeight - codeScrollRef.current.clientHeight
        );
        codeScrollRef.current.scrollTop = ratio * codeMax;
      }
      if (
        (viewMode === "PREVIEW" || viewMode === "SPLIT") &&
        previewScrollRef.current
      ) {
        const previewMax = Math.max(
          1,
          previewScrollRef.current.scrollHeight -
            previewScrollRef.current.clientHeight
        );
        previewScrollRef.current.scrollTop = ratio * previewMax;
      }
    }, 40);
    return () => window.clearTimeout(timer);
  }, [viewMode, syncScrollEnabled]);

  // إدراج صيغة أو سؤال تم التحقق منه عبر WolframAlpha مباشرة في التمرين المختار من الفرض الحالي
  const handleInsertVerifiedWolframQuestion = useCallback(
    (payload: {
      questionAr: string;
      questionFr: string;
      solutionAr: string;
      solutionFr: string;
      points?: number;
      level?: "N1" | "N2" | "N3";
      latexCode?: string;
      targetLessonIndex?: number;
    }) => {
      const idx = payload.targetLessonIndex ?? 0;
      const targetLesson =
        activeCustomLessons[idx] ||
        activeCustomLessons[0] ||
        allTrackLessons[0];
      if (!targetLesson) return;

      const key = `${currentTrack.code}_${targetLesson.lessonFr}`;
      const pt = Number(payload.points) || 1.5;
      const lvl = payload.level || "N2";

      setCustomQuestionsMap((prev) => {
        const fallbackQs = getVariantQuestions(
          targetLesson,
          "A",
          false,
          0,
          dsQuestionDensity
        );
        const existingAr =
          prev[key]?.ar ||
          (targetLesson.sampleExerciseAr && targetLesson.sampleExerciseAr.length > 0
            ? [...targetLesson.sampleExerciseAr]
            : [...fallbackQs.questionsAr]);
        const existingFr =
          prev[key]?.fr ||
          (targetLesson.sampleExerciseFr && targetLesson.sampleExerciseFr.length > 0
            ? [...targetLesson.sampleExerciseFr]
            : [...fallbackQs.questionsFr]);

        const nextIdx = existingAr.length + 1;
        return {
          ...prev,
          [key]: {
            ar: [...existingAr, `${nextIdx}) [Wolfram✓] ${payload.questionAr}`],
            fr: [...existingFr, `${nextIdx}) [Wolfram✓] ${payload.questionFr}`],
          },
        };
      });

      setCustomQuestionLevelsMap((prev) => {
        const fallbackQs = getVariantQuestions(
          targetLesson,
          "A",
          false,
          0,
          dsQuestionDensity
        );
        const baseCount =
          targetLesson.sampleExerciseAr?.length ||
          fallbackQs.questionsAr.length ||
          3;
        const existing =
          prev[key] ||
          targetLesson.customQuestionLevels ||
          Array.from({ length: baseCount }, (_, i) =>
            i === 0 ? "N1" : i === baseCount - 1 ? "N3" : "N2"
          );
        return { ...prev, [key]: [...existing, lvl] };
      });

      // إعادة موازنة نقط الأسئلة تلقائياً مع الحفاظ على سلم 20/20
      setCustomQuestionBaremesMap((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });

      setStatusMessage({
        type: "success",
        text: `تم التحقق بنجاح عبر WolframAlpha وإدراج السؤال (${pt} ن · ${lvl}) في تمرين « ${targetLesson.lessonAr} » داخل الفرض المحروس!`,
      });
    },
    [activeCustomLessons, allTrackLessons, currentTrack.code, dsQuestionDensity]
  );

  // استبدال أسئلة التمرين المحدد في الفرض بالتعديل البيداغوجي المقترح من المساعد الذكي (أسئلة موازية أو صياغة مبسطة)
  const handleReplaceExerciseFromAi = useCallback(
    (payload: {
      targetLessonIndex: number;
      questionsAr: string[];
      questionsFr: string[];
      solutionAr: string;
      solutionFr: string;
      titleAr?: string;
      titleFr?: string;
    }) => {
      const targetLesson =
        activeCustomLessons[payload.targetLessonIndex] ||
        activeCustomLessons[0] ||
        allTrackLessons[0];
      if (!targetLesson) return;

      const key = `${currentTrack.code}_${targetLesson.lessonFr}`;
      const cleanAr =
        Array.isArray(payload.questionsAr) && payload.questionsAr.length > 0
          ? payload.questionsAr
          : ["1. حل التمرين المعدل بيداغوجياً."];
      const cleanFr =
        Array.isArray(payload.questionsFr) && payload.questionsFr.length > 0
          ? payload.questionsFr
          : cleanAr;

      setCustomQuestionsMap((prev) => ({
        ...prev,
        [key]: {
          ar: cleanAr,
          fr: cleanFr,
        },
      }));

      setCustomQuestionBaremesMap((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });

      setStatusMessage({
        type: "success",
        text: `✓ تم تحديث تمرين « ${targetLesson.lessonAr} » في الفرض المحروس بالتعديل البيداغوجي المقترح (${cleanAr.length} أسئلة متدرجة)!`,
      });
    },
    [activeCustomLessons, allTrackLessons, currentTrack.code]
  );

  // إدراج تمرين رسمي من بنك امتحانات البكالوريا الوطنية أو البعثة الفرنسية (Annales) مباشرة في الفرض الحالي
  const handleInsertOfficialAnnaleExercise = useCallback(
    (annaleLesson: LessonItem) => {
      const targetLesson = activeCustomLessons[0] || allTrackLessons[0];
      if (!targetLesson) return;

      const fallbackQs = getVariantQuestions(
        annaleLesson,
        "A",
        false,
        0,
        dsQuestionDensity
      );
      const key = `${currentTrack.code}_${targetLesson.lessonFr}`;
      setCustomQuestionsMap((prev) => ({
        ...prev,
        [key]: {
          ar:
            annaleLesson.sampleExerciseAr && annaleLesson.sampleExerciseAr.length > 0
              ? annaleLesson.sampleExerciseAr
              : fallbackQs.questionsAr,
          fr:
            annaleLesson.sampleExerciseFr && annaleLesson.sampleExerciseFr.length > 0
              ? annaleLesson.sampleExerciseFr
              : fallbackQs.questionsFr,
        },
      }));
      setCustomExerciseTitles((prev) => ({
        ...prev,
        0: isMission || docLang === "FR" ? annaleLesson.lessonFr : annaleLesson.lessonAr,
      }));
      setStatusMessage({
        type: "success",
        text: `✓ تم إدراج التمرين الرسمي « ${annaleLesson.lessonAr} » مع عناصر الإجابة مباشرة في الفرض الحالي!`,
      });
    },
    [
      activeCustomLessons,
      allTrackLessons,
      currentTrack.code,
      isMission,
      docLang,
      dsQuestionDensity,
    ]
  );

  const handleAddCustomQcmQuestion = () => {
    const stmtAr = draftQcmStmtAr.trim();
    const stmtFr = draftQcmStmtFr.trim() || stmtAr;
    if (!stmtAr) {
      setStatusMessage({
        type: "error",
        text: "يرجى كتابة نص سؤال الاختيار من متعدد (QCM) قبل الإضافة.",
      });
      return;
    }
    const optA = draftQcmOptA.trim() || "الخيار الأول";
    const optB = draftQcmOptB.trim() || "الخيار الثاني";
    const optC = draftQcmOptC.trim() || "الخيار الثالث";
    const optD = draftQcmOptD.trim() || "الخيار الرابع";
    const frCodeMap: Record<"أ" | "ب" | "ج" | "د", string> = {
      أ: `Réponse A`,
      ب: `Réponse B`,
      ج: `Réponse C`,
      د: `Réponse D`,
    };
    const newItem: MoroccanQCMItem = {
      num: customQcmItems.length + 1,
      points: "1.0",
      statementAr: stmtAr,
      statementFr: stmtFr,
      optionsAr: [`أ) ${optA}`, `ب) ${optB}`, `ج) ${optC}`, `د) ${optD}`],
      optionsFr: [`A) ${optA}`, `B) ${optB}`, `C) ${optC}`, `D) ${optD}`],
      correctAnswerAr: `الجواب الصحيح (${draftQcmCorrectCode})`,
      correctAnswerFr: frCodeMap[draftQcmCorrectCode],
      justificationAr:
        draftQcmJustifAr.trim() ||
        "بتطبيق الخاصية المبرهنة في الدرس والتعويض العددي المباشر.",
      justificationFr:
        draftQcmJustifAr.trim() ||
        "Par application directe de la propriété du cours.",
    };
    setCustomQcmItems((prev) => {
      const next = [...prev, newItem];
      if (next.length > qcmQuestionCount) {
        setQcmQuestionCount(Math.min(6, next.length));
      }
      return next;
    });
    if (
      dsStructureMode !== "QCM_ET_EXERCICES" &&
      dsStructureMode !== "COMPLETE_EXAM_MAROC"
    ) {
      setDsStructureMode("QCM_ET_EXERCICES");
    }
    setDraftQcmStmtAr("");
    setDraftQcmStmtFr("");
    setDraftQcmOptA("");
    setDraftQcmOptB("");
    setDraftQcmOptC("");
    setDraftQcmOptD("");
    setDraftQcmJustifAr("");
    setStatusMessage({
      type: "success",
      text: "تم إدراج سؤال QCM المخصص بـ 4 اختيارات وتفعيله في الفرض المحروس فوراً!",
    });
  };

  // بناء كائن إعدادات الفرض الحالي الشامل لتصديره إلى ملف JSON أو حفظه في الخزانة
  const currentExamConfigBlueprint = useMemo<ExamConfigBlueprintJSON>(() => {
    const selectedLessonRefs = activeCustomLessons.map((lesson) => {
      const idx = allTrackLessons.findIndex((l) => l.lessonFr === lesson.lessonFr);
      return {
        index: idx >= 0 ? idx : 0,
        lessonAr: lesson.lessonAr,
        lessonFr: lesson.lessonFr,
        weight: lesson.weight,
      };
    });

    return {
      meta: {
        schemaVersion: "3.0.0",
        appIdentifier: "pedagogical-math-studio-lycee",
        exportedAt: new Date().toISOString(),
        configName:
          customDocTitle ||
          `${currentTrack.labelAr} (${currentTrack.code}) - ${
            activeModule === "DS_142_08" ? dsKey : activeModule
          }`,
        notes: customTopicNote || "",
      },
      identity: {
        educationSystem,
        school,
        prof,
        year,
        academy,
        direction,
        headerStyle,
        includeStudentBox,
        includeGradeBox,
        calculatorAllowed,
        includeCompetencies,
        includeTeacherLogo,
        logoVariant,
        includeLogoWatermark,
        customLogoUrl,
      },
      examStructure: {
        activeModule,
        selectedTrackCode: currentTrack.code,
        semester,
        dsKey,
        selectedLessonIdx,
        examModel,
        shuffleQuestions,
        shuffleExercises,
        dsStructureMode,
        dsQuestionDensity,
        includeMoroccanExamDirectives,
        dmSubType,
        dmNumber,
        dmDueDate,
        serieExerciseCount,
        includeHints,
        moroccanDMType,
        includeLessonMemo,
        includeDMContract,
        diagDuration,
        diagType,
        ficheScenarioDisplayMode,
        ficheContentDetailLevel,
        includeFichePlanningMatrix,
        includeFicheTICE,
        includeFicheFormativeEval,
      },
      gradingAndLessons: {
        isCustomLessonMode,
        selectedLessonIndices,
        selectedLessonRefs,
        customWeightsMap,
        customLessonIconsMap,
        customQuestionBaremesMap,
        customQuestionLevelsMap,
        customQuestionsMap,
        n1,
        n2,
        n3,
        fillBlanks,
        includeTICE,
        showQuestionBareme,
        includeGradingScaleTable,
        includeSelfEvalGrid,
        qcmQuestionCount,
        qcmScoringMode,
        customQcmItems,
        include2DSpecMatrix,
        includeOMRBubbleSheet,
        omrQuestionCount,
        enableFourModelsABCD,
        includeDidacticVigilanceSheet,
        includeIndividualGradingStrip,
        includeRescueHintsAndContinuity,
      },
      appearanceAndExport: {
        docLang,
        bilingualLayout,
        exportFormat,
        pageOrientation,
        docFontFamily,
        docFontSize,
        latexPackageTheme,
        paperSurface,
        customDocTitle,
        customDocSubtitle,
        customHeaderNote,
        customExerciseTitles,
        includeDetailedSolutions,
        solutionDisplayMode,
        includeAnswerWorkspace,
        handwrittenSolutionsOnly,
        includeExamFormulaSheet,
        includeDSStudentSelfCheck,
        includePostExamRemediationSheet,
        includeOfficialExamCoverSheet,
        enableBranchColorGradient,
        branchColorMode,
        tcolorboxConfig,
        appliedTitleCalligraphy,
        studentGridStyle,
        workspaceHeightMode,
        includeCustomEvalGridSheet,
        evalGridGranularity,
        evalGridStudentCount,
        showA4LivePageBreaks,
        economicTwoUpPrintMode,
        includeInteractiveQrFooter,
      },
      workspaceExtensions: {
        autoAttachGeoGebra,
        geoGebraResourcesMap,
        isGeoGebra3DMode,
        selectedSpatialPresetId,
        insertedFigures,
        attachedPythonAlgorithms,
        selectedAiModel,
        viewMode,
        previewZoom,
        syncScrollEnabled,
        isInlineEditable,
        showAnswerKey,
      },
    };
  }, [
    activeCustomLessons,
    allTrackLessons,
    customDocTitle,
    currentTrack,
    activeModule,
    dsKey,
    customTopicNote,
    educationSystem,
    school,
    prof,
    year,
    academy,
    direction,
    headerStyle,
    includeStudentBox,
    includeGradeBox,
    calculatorAllowed,
    includeCompetencies,
    includeTeacherLogo,
    logoVariant,
    includeLogoWatermark,
    customLogoUrl,
    semester,
    selectedLessonIdx,
    examModel,
    shuffleQuestions,
    shuffleExercises,
    dsStructureMode,
    dsQuestionDensity,
    includeMoroccanExamDirectives,
    dmSubType,
    dmNumber,
    dmDueDate,
    serieExerciseCount,
    includeHints,
    moroccanDMType,
    includeLessonMemo,
    includeDMContract,
    diagDuration,
    diagType,
    ficheScenarioDisplayMode,
    ficheContentDetailLevel,
    includeFichePlanningMatrix,
    includeFicheTICE,
    includeFicheFormativeEval,
    isCustomLessonMode,
    selectedLessonIndices,
    customWeightsMap,
    customLessonIconsMap,
    customQuestionBaremesMap,
    customQuestionLevelsMap,
    customQuestionsMap,
    n1,
    n2,
    n3,
    fillBlanks,
    includeTICE,
    showQuestionBareme,
    includeGradingScaleTable,
    includeSelfEvalGrid,
    qcmQuestionCount,
    qcmScoringMode,
    customQcmItems,
    include2DSpecMatrix,
    includeOMRBubbleSheet,
    omrQuestionCount,
    enableFourModelsABCD,
    includeDidacticVigilanceSheet,
    includeIndividualGradingStrip,
    includeRescueHintsAndContinuity,
    docLang,
    bilingualLayout,
    exportFormat,
    pageOrientation,
    docFontFamily,
    docFontSize,
    latexPackageTheme,
    paperSurface,
    customDocSubtitle,
    customHeaderNote,
    customExerciseTitles,
    includeDetailedSolutions,
    solutionDisplayMode,
    includeAnswerWorkspace,
    handwrittenSolutionsOnly,
    includeExamFormulaSheet,
    includeDSStudentSelfCheck,
    includePostExamRemediationSheet,
    includeOfficialExamCoverSheet,
    enableBranchColorGradient,
    branchColorMode,
    tcolorboxConfig,
    appliedTitleCalligraphy,
    studentGridStyle,
    workspaceHeightMode,
    includeCustomEvalGridSheet,
    evalGridGranularity,
    evalGridStudentCount,
    showA4LivePageBreaks,
    economicTwoUpPrintMode,
    includeInteractiveQrFooter,
    autoAttachGeoGebra,
    geoGebraResourcesMap,
    isGeoGebra3DMode,
    selectedSpatialPresetId,
    insertedFigures,
    attachedPythonAlgorithms,
    selectedAiModel,
    viewMode,
    previewZoom,
    syncScrollEnabled,
    isInlineEditable,
    showAnswerKey,
  ]);

  // تطبيق حالة مساحة العمل الشاملة المستوردة من ملف JSON مع الحفاظ التام على الدروس والأوزان والتنقيط والملحقات
  const handleApplyExamConfigBlueprint = useCallback(
    (
      blueprint: ExamConfigBlueprintJSON,
      options: { keepCurrentIdentity: boolean }
    ) => {
      skipTrackResetRef.current = true;
      setIsExamSimulationActive(false);

      if (!options.keepCurrentIdentity) {
        setEducationSystem(blueprint.identity.educationSystem);
        setSchool(blueprint.identity.school);
        setProf(blueprint.identity.prof);
        setYear(blueprint.identity.year);
        setAcademy(blueprint.identity.academy);
        setDirection(blueprint.identity.direction);
        setHeaderStyle(blueprint.identity.headerStyle);
        setIncludeStudentBox(blueprint.identity.includeStudentBox);
        setIncludeGradeBox(blueprint.identity.includeGradeBox);
        setCalculatorAllowed(blueprint.identity.calculatorAllowed);
        setIncludeCompetencies(blueprint.identity.includeCompetencies);
        setIncludeTeacherLogo(blueprint.identity.includeTeacherLogo);
        setLogoVariant(blueprint.identity.logoVariant);
        setIncludeLogoWatermark(blueprint.identity.includeLogoWatermark);
        if (blueprint.identity.customLogoUrl !== undefined) {
          setCustomLogoUrl(blueprint.identity.customLogoUrl);
        }
      } else {
        setEducationSystem(blueprint.identity.educationSystem);
        setCalculatorAllowed(blueprint.identity.calculatorAllowed);
      }

      if (blueprint.meta.notes !== undefined) {
        setCustomTopicNote(blueprint.meta.notes);
      }

      setActiveModule(blueprint.examStructure.activeModule);
      setSelectedTrackCode(blueprint.examStructure.selectedTrackCode);
      setSemester(blueprint.examStructure.semester);
      setDsKey(blueprint.examStructure.dsKey);
      setSelectedLessonIdx(blueprint.examStructure.selectedLessonIdx);
      setExamModel(blueprint.examStructure.examModel);
      setShuffleQuestions(blueprint.examStructure.shuffleQuestions);
      setShuffleExercises(blueprint.examStructure.shuffleExercises);
      setDsStructureMode(blueprint.examStructure.dsStructureMode);
      setDsQuestionDensity(blueprint.examStructure.dsQuestionDensity);
      setIncludeMoroccanExamDirectives(
        blueprint.examStructure.includeMoroccanExamDirectives
      );
      setDmSubType(blueprint.examStructure.dmSubType);
      setDmNumber(blueprint.examStructure.dmNumber);
      setDmDueDate(blueprint.examStructure.dmDueDate);
      setSerieExerciseCount(blueprint.examStructure.serieExerciseCount);
      setIncludeHints(blueprint.examStructure.includeHints);
      setMoroccanDMType(blueprint.examStructure.moroccanDMType);
      setIncludeLessonMemo(blueprint.examStructure.includeLessonMemo);
      setIncludeDMContract(blueprint.examStructure.includeDMContract);
      setDiagDuration(blueprint.examStructure.diagDuration);
      setDiagType(blueprint.examStructure.diagType);
      if (blueprint.examStructure.ficheScenarioDisplayMode) {
        setFicheScenarioDisplayMode(
          blueprint.examStructure.ficheScenarioDisplayMode
        );
      }
      if (blueprint.examStructure.ficheContentDetailLevel) {
        setFicheContentDetailLevel(
          blueprint.examStructure.ficheContentDetailLevel
        );
      }
      if (blueprint.examStructure.includeFichePlanningMatrix !== undefined) {
        setIncludeFichePlanningMatrix(
          blueprint.examStructure.includeFichePlanningMatrix
        );
      }
      if (blueprint.examStructure.includeFicheTICE !== undefined) {
        setIncludeFicheTICE(blueprint.examStructure.includeFicheTICE);
      }
      if (blueprint.examStructure.includeFicheFormativeEval !== undefined) {
        setIncludeFicheFormativeEval(
          blueprint.examStructure.includeFicheFormativeEval
        );
      }

      setIsCustomLessonMode(blueprint.gradingAndLessons.isCustomLessonMode);
      setSelectedLessonIndices(blueprint.gradingAndLessons.selectedLessonIndices);
      setCustomWeightsMap(blueprint.gradingAndLessons.customWeightsMap);
      if (blueprint.gradingAndLessons.customLessonIconsMap) {
        setCustomLessonIconsMap(blueprint.gradingAndLessons.customLessonIconsMap);
      }
      setCustomQuestionBaremesMap(
        blueprint.gradingAndLessons.customQuestionBaremesMap
      );
      setCustomQuestionLevelsMap(
        blueprint.gradingAndLessons.customQuestionLevelsMap
      );
      setCustomQuestionsMap(blueprint.gradingAndLessons.customQuestionsMap);
      setN1(blueprint.gradingAndLessons.n1);
      setN2(blueprint.gradingAndLessons.n2);
      setN3(blueprint.gradingAndLessons.n3);
      setFillBlanks(blueprint.gradingAndLessons.fillBlanks);
      setIncludeTICE(blueprint.gradingAndLessons.includeTICE);
      setShowQuestionBareme(blueprint.gradingAndLessons.showQuestionBareme);
      setIncludeGradingScaleTable(
        blueprint.gradingAndLessons.includeGradingScaleTable
      );
      setIncludeSelfEvalGrid(blueprint.gradingAndLessons.includeSelfEvalGrid);
      if (blueprint.gradingAndLessons.qcmQuestionCount !== undefined) {
        setQcmQuestionCount(blueprint.gradingAndLessons.qcmQuestionCount);
      }
      if (blueprint.gradingAndLessons.qcmScoringMode) {
        setQcmScoringMode(blueprint.gradingAndLessons.qcmScoringMode);
      }
      if (Array.isArray(blueprint.gradingAndLessons.customQcmItems)) {
        setCustomQcmItems(blueprint.gradingAndLessons.customQcmItems);
      }
      if (blueprint.gradingAndLessons.include2DSpecMatrix !== undefined) {
        setInclude2DSpecMatrix(blueprint.gradingAndLessons.include2DSpecMatrix);
      }
      if (blueprint.gradingAndLessons.includeOMRBubbleSheet !== undefined) {
        setIncludeOMRBubbleSheet(
          blueprint.gradingAndLessons.includeOMRBubbleSheet
        );
      }
      if (blueprint.gradingAndLessons.omrQuestionCount !== undefined) {
        setOmrQuestionCount(blueprint.gradingAndLessons.omrQuestionCount);
      }
      if (blueprint.gradingAndLessons.enableFourModelsABCD !== undefined) {
        setEnableFourModelsABCD(
          blueprint.gradingAndLessons.enableFourModelsABCD
        );
      }
      if (blueprint.gradingAndLessons.includeDidacticVigilanceSheet !== undefined) {
        setIncludeDidacticVigilanceSheet(
          blueprint.gradingAndLessons.includeDidacticVigilanceSheet
        );
      }
      if (blueprint.gradingAndLessons.includeIndividualGradingStrip !== undefined) {
        setIncludeIndividualGradingStrip(
          blueprint.gradingAndLessons.includeIndividualGradingStrip
        );
      }
      if (
        blueprint.gradingAndLessons.includeRescueHintsAndContinuity !== undefined
      ) {
        setIncludeRescueHintsAndContinuity(
          blueprint.gradingAndLessons.includeRescueHintsAndContinuity
        );
      }

      setDocLang(blueprint.appearanceAndExport.docLang);
      setBilingualLayout(blueprint.appearanceAndExport.bilingualLayout);
      setExportFormat(blueprint.appearanceAndExport.exportFormat);
      setPageOrientation(blueprint.appearanceAndExport.pageOrientation);
      setDocFontFamily(blueprint.appearanceAndExport.docFontFamily);
      setDocFontSize(blueprint.appearanceAndExport.docFontSize);
      setLatexPackageTheme(blueprint.appearanceAndExport.latexPackageTheme);
      setPaperSurface(blueprint.appearanceAndExport.paperSurface);
      setCustomDocTitle(blueprint.appearanceAndExport.customDocTitle);
      setCustomDocSubtitle(blueprint.appearanceAndExport.customDocSubtitle);
      setCustomHeaderNote(blueprint.appearanceAndExport.customHeaderNote);
      setCustomExerciseTitles(blueprint.appearanceAndExport.customExerciseTitles);
      setIncludeDetailedSolutions(
        blueprint.appearanceAndExport.includeDetailedSolutions
      );
      setSolutionDisplayMode(blueprint.appearanceAndExport.solutionDisplayMode);
      setIncludeAnswerWorkspace(
        blueprint.appearanceAndExport.includeAnswerWorkspace
      );
      setHandwrittenSolutionsOnly(
        blueprint.appearanceAndExport.handwrittenSolutionsOnly
      );
      setIncludeExamFormulaSheet(
        blueprint.appearanceAndExport.includeExamFormulaSheet
      );
      setIncludeDSStudentSelfCheck(
        blueprint.appearanceAndExport.includeDSStudentSelfCheck
      );
      setIncludePostExamRemediationSheet(
        blueprint.appearanceAndExport.includePostExamRemediationSheet
      );
      setIncludeOfficialExamCoverSheet(
        blueprint.appearanceAndExport.includeOfficialExamCoverSheet
      );
      if (blueprint.appearanceAndExport.enableBranchColorGradient !== undefined) {
        setEnableBranchColorGradient(
          blueprint.appearanceAndExport.enableBranchColorGradient
        );
      }
      if (blueprint.appearanceAndExport.branchColorMode) {
        setBranchColorMode(blueprint.appearanceAndExport.branchColorMode);
      }
      if (blueprint.appearanceAndExport.tcolorboxConfig) {
        setTcolorboxConfig(blueprint.appearanceAndExport.tcolorboxConfig);
      }
      if (blueprint.appearanceAndExport.appliedTitleCalligraphy) {
        setAppliedTitleCalligraphy(
          blueprint.appearanceAndExport.appliedTitleCalligraphy
        );
      }
      if (blueprint.appearanceAndExport.studentGridStyle) {
        setStudentGridStyle(blueprint.appearanceAndExport.studentGridStyle);
      }
      if (blueprint.appearanceAndExport.workspaceHeightMode) {
        setWorkspaceHeightMode(
          blueprint.appearanceAndExport.workspaceHeightMode
        );
      }
      if (
        blueprint.appearanceAndExport.includeCustomEvalGridSheet !== undefined
      ) {
        setIncludeCustomEvalGridSheet(
          blueprint.appearanceAndExport.includeCustomEvalGridSheet
        );
      }
      if (blueprint.appearanceAndExport.evalGridGranularity) {
        setEvalGridGranularity(
          blueprint.appearanceAndExport.evalGridGranularity
        );
      }
      if (blueprint.appearanceAndExport.evalGridStudentCount !== undefined) {
        setEvalGridStudentCount(
          blueprint.appearanceAndExport.evalGridStudentCount
        );
      }
      if (blueprint.appearanceAndExport.showA4LivePageBreaks !== undefined) {
        setShowA4LivePageBreaks(
          blueprint.appearanceAndExport.showA4LivePageBreaks
        );
      }
      if (
        blueprint.appearanceAndExport.economicTwoUpPrintMode !== undefined
      ) {
        setEconomicTwoUpPrintMode(
          blueprint.appearanceAndExport.economicTwoUpPrintMode
        );
      }
      if (
        blueprint.appearanceAndExport.includeInteractiveQrFooter !== undefined
      ) {
        setIncludeInteractiveQrFooter(
          blueprint.appearanceAndExport.includeInteractiveQrFooter
        );
      }

      if (blueprint.workspaceExtensions) {
        if (blueprint.workspaceExtensions.autoAttachGeoGebra !== undefined) {
          setAutoAttachGeoGebra(blueprint.workspaceExtensions.autoAttachGeoGebra);
        }
        if (blueprint.workspaceExtensions.geoGebraResourcesMap) {
          setGeoGebraResourcesMap(
            blueprint.workspaceExtensions.geoGebraResourcesMap
          );
        }
        if (blueprint.workspaceExtensions.isGeoGebra3DMode !== undefined) {
          setIsGeoGebra3DMode(blueprint.workspaceExtensions.isGeoGebra3DMode);
        }
        if (blueprint.workspaceExtensions.selectedSpatialPresetId) {
          setSelectedSpatialPresetId(
            blueprint.workspaceExtensions.selectedSpatialPresetId
          );
        }
        if (Array.isArray(blueprint.workspaceExtensions.insertedFigures)) {
          setInsertedFigures(blueprint.workspaceExtensions.insertedFigures);
        }
        if (
          Array.isArray(blueprint.workspaceExtensions.attachedPythonAlgorithms)
        ) {
          setAttachedPythonAlgorithms(
            blueprint.workspaceExtensions.attachedPythonAlgorithms
          );
        }
        if (blueprint.workspaceExtensions.selectedAiModel) {
          setSelectedAiModel(blueprint.workspaceExtensions.selectedAiModel);
        }
        if (blueprint.workspaceExtensions.viewMode) {
          setViewMode(blueprint.workspaceExtensions.viewMode);
        }
        if (blueprint.workspaceExtensions.previewZoom !== undefined) {
          setPreviewZoom(blueprint.workspaceExtensions.previewZoom);
        }
        if (blueprint.workspaceExtensions.syncScrollEnabled !== undefined) {
          setSyncScrollEnabled(blueprint.workspaceExtensions.syncScrollEnabled);
        }
        if (blueprint.workspaceExtensions.isInlineEditable !== undefined) {
          setIsInlineEditable(blueprint.workspaceExtensions.isInlineEditable);
        }
        if (blueprint.workspaceExtensions.showAnswerKey !== undefined) {
          setShowAnswerKey(blueprint.workspaceExtensions.showAnswerKey);
        }
      }

      setStatusMessage({
        type: "success",
        text: `✓ تم استيراد وتطبيق مساحة العمل الكاملة « ${blueprint.meta.configName} » (${blueprint.examStructure.selectedTrackCode} · ${blueprint.examStructure.dsKey}) بنجاح!`,
      });
    },
    []
  );

  const handleAIGenerate = async () => {
    setIsGeneratingAI(true);
    setStatusMessage({
      type: "info",
      text: "جاري صياغة التمارين الرياضية والحلول المفصلة وفق الدروس والنسب المختارة عبر محرك الذكاء الاصطناعي...",
    });

    const targetLessons =
      activeModule === "DS_142_08" || activeModule === "DM_SERIE"
        ? activeCustomLessons
        : activeModule === "FICHE_OP2007"
        ? [allTrackLessons[selectedLessonIdx] || allTrackLessons[0]]
        : allTrackLessons;

    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school,
          prof,
          year,
          academy,
          direction,
          headerStyle,
          includeStudentBox,
          includeGradeBox,
          calculatorAllowed,
          includeCompetencies,
          examModel,
          shuffleQuestions,
          shuffleExercises,
          trackLabelAr: currentTrack.labelAr,
          trackLabelFr: currentTrack.labelFr,
          durationAr: currentTrack.durationAr,
          durationFr: currentTrack.durationFr,
          docLang,
          bilingualLayout,
          exportFormat,
          activeModule,
          sem: semester,
          dsKey,
          n1,
          n2,
          n3,
          fillBlanks,
          includeTICE,
          lessons: targetLessons,
          prereqsAr: currentTrack.prereqsAr,
          prereqsFr: currentTrack.prereqsFr,
          diagDuration,
          diagType,
          customTopicNote,
          system: educationSystem,
          dmSubType,
          dmNumber,
          dmDueDate,
          includeHints,
          serieExerciseCount,
          dsStructureMode,
          dsQuestionDensity,
          modelChoice: selectedAiModel,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.code) {
        throw new Error(data.error || "تعذر استلام الكود المصدري من الخادم");
      }

      if (
        Array.isArray(data.generatedExercises) &&
        data.generatedExercises.length > 0
      ) {
        setCustomQuestionsMap((prev) => {
          const updated = { ...prev };
          targetLessons.forEach((lesson, idx) => {
            const genEx =
              data.generatedExercises[idx] || data.generatedExercises[0];
            if (
              lesson &&
              genEx &&
              Array.isArray(genEx.questionsAr) &&
              genEx.questionsAr.length > 0
            ) {
              const key = `${currentTrack.code}_${lesson.lessonFr}`;
              updated[key] = {
                ar: genEx.questionsAr,
                fr:
                  Array.isArray(genEx.questionsFr) &&
                  genEx.questionsFr.length > 0
                    ? genEx.questionsFr
                    : genEx.questionsAr,
              };
            }
          });
          return updated;
        });
      }

      setGeneratedCode(data.code);
      setStatusMessage({
        type: "success",
        text: `✓ تم توليد وتحديث التمارين الرياضية والحلول المفصلة في المعاينة الورقية (A4) والكود المصدري بنجاح عبر ${
          data.modelUsed || selectedAiModel
        }!`,
      });
    } catch {
      triggerOfflineGeneration();
      setStatusMessage({
        type: "success",
        text: "✓ تم توليد الفرض المحروس والحلول المفصلة وتحديث المعاينة الورقية والكود المصدري عبر المحرك الرياضي المدمج بنجاح!",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // فتح وإعداد الاختبار التفاعلي للتمارين الحالية (يدعم الدروس المختارة أو الفرض المحاكى المستورد بدقة عالية)
  const handleOpenInteractiveQuiz = useCallback(() => {
    try {
      const sourceExercises =
        isExamSimulationActive && activeImportedBlueprint
          ? activeImportedBlueprint.exercises
          : activeCustomLessons;
      const effectiveTitleAr =
        customDocTitle ||
        (isExamSimulationActive && activeImportedBlueprint
          ? activeImportedBlueprint.titleAr
          : defaultDocTitle);
      const effectiveTitleFr =
        customDocSubtitle ||
        (isExamSimulationActive && activeImportedBlueprint
          ? activeImportedBlueprint.titleFr
          : defaultDocSubtitle);

      const quiz = convertExercisesToInteractiveQuiz({
        lessons: sourceExercises,
        titleAr: effectiveTitleAr,
        titleFr: effectiveTitleFr,
        schoolAr: school,
        schoolFr: school,
        prof,
        trackCode: currentTrack.code,
        system: educationSystem,
        durationMinutes: 45,
        calculatorAllowed,
      });
      setCurrentInteractiveQuiz(quiz);
      setShowInteractiveQuizModal(true);
      setStatusMessage({
        type: "success",
        text: `تم تحويل تمارين « ${effectiveTitleAr} » بنجاح إلى اختبار تفاعلي (${quiz.totalQuestions} أسئلة · 20/20 نقطة) جاهز لإجراء التلاميذ والتصحيح الآلي!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر تجهيز الاختبار التفاعلي";
      setStatusMessage({
        type: "error",
        text: msg,
      });
    }
  }, [
    isExamSimulationActive,
    activeImportedBlueprint,
    activeCustomLessons,
    customDocTitle,
    defaultDocTitle,
    customDocSubtitle,
    defaultDocSubtitle,
    school,
    prof,
    currentTrack.code,
    educationSystem,
    calculatorAllowed,
  ]);

  // إعادة توليد أسئلة الاختبار التفاعلي وتدقيق المضللات بالذكاء الاصطناعي
  const handleRegenerateQuizWithAI = async (
    modelChoice: "gemini-3.8-flash" | "gemini-4-argon"
  ) => {
    setIsAiConvertingQuiz(true);
    setStatusMessage({
      type: "info",
      text: `جاري توليد أسئلة الاختبار التفاعلي والمضللات الرياضية الذكية عبر ${modelChoice}...`,
    });

    try {
      const sourceExercises =
        isExamSimulationActive && activeImportedBlueprint
          ? activeImportedBlueprint.exercises
          : activeCustomLessons;
      const effectiveTitleAr =
        customDocTitle ||
        (isExamSimulationActive && activeImportedBlueprint
          ? activeImportedBlueprint.titleAr
          : defaultDocTitle);

      const response = await fetch("/api/ai-convert-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exercises: sourceExercises,
          examTitle: effectiveTitleAr,
          trackLabel: `${currentTrack.labelAr} (${currentTrack.labelFr})`,
          docLang,
          modelChoice,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.quiz) {
        throw new Error(data.error || "تعذر استلام الكويز من الخادم");
      }

      const rawQs: unknown[] = Array.isArray(data.quiz.questions)
        ? data.quiz.questions
        : [];
      const codes: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

      const normalizedQuestions = rawQs.map((rawQ: any, qIdx: number) => {
        const rawChoices: any[] = Array.isArray(rawQ?.choices) ? rawQ.choices : [];
        return {
          id: rawQ?.id || `ai_q_${qIdx + 1}`,
          exerciseId: rawQ?.exerciseId || `ai_ex_${qIdx + 1}`,
          exerciseTitleAr: rawQ?.exerciseTitleAr || `التمرين ${qIdx + 1}`,
          exerciseTitleFr: rawQ?.exerciseTitleFr || `Exercice ${qIdx + 1}`,
          questionIndex: qIdx + 1,
          questionPromptAr: rawQ?.questionPromptAr || rawQ?.questionPromptFr || "",
          questionPromptFr: rawQ?.questionPromptFr || rawQ?.questionPromptAr || "",
          points: Number(rawQ?.points) > 0 ? Number(rawQ.points) : 2.5,
          level:
            rawQ?.level === "N1" || rawQ?.level === "N2" || rawQ?.level === "N3"
              ? rawQ.level
              : ("N2" as const),
          category: rawQ?.category || "تحليل ودوال",
          categoryFr: rawQ?.categoryFr || "Analyse et Fonctions",
          hintAr: rawQ?.hintAr || "",
          hintFr: rawQ?.hintFr || "",
          fullSolutionAr: rawQ?.fullSolutionAr || "",
          fullSolutionFr: rawQ?.fullSolutionFr || "",
          choices: rawChoices.slice(0, 4).map((ch: any, cIdx: number) => ({
            id: ch?.id || `ai_q_${qIdx + 1}_c_${cIdx + 1}`,
            code: codes[cIdx] || "A",
            labelAr: ch?.labelAr || ch?.labelFr || `الخيار ${cIdx + 1}`,
            labelFr: ch?.labelFr || ch?.labelAr || `Option ${cIdx + 1}`,
            isCorrect: Boolean(ch?.isCorrect),
            explanationAr: ch?.explanationAr || ch?.explanationFr || "",
            explanationFr: ch?.explanationFr || ch?.explanationAr || "",
          })),
        };
      });

      // ضمان توازن سلم التنقيط ليكون المجموع 20.00 بالضبط
      const rawSum = normalizedQuestions.reduce((acc, q) => acc + q.points, 0);
      if (normalizedQuestions.length > 0 && rawSum > 0) {
        let running = 0;
        normalizedQuestions.forEach((q, idx) => {
          if (idx === normalizedQuestions.length - 1) {
            q.points = Number(Math.max(0.5, 20 - running).toFixed(2));
          } else {
            const scaled = Math.round(((q.points / rawSum) * 20) * 4) / 4;
            q.points = Math.max(0.5, scaled);
            running += q.points;
          }
        });
      }

      const aiQuiz: InteractiveQuizData = {
        id: `quiz_ai_${Date.now()}`,
        titleAr: data.quiz.titleAr || effectiveTitleAr,
        titleFr:
          data.quiz.titleFr ||
          customDocSubtitle ||
          (isExamSimulationActive && activeImportedBlueprint
            ? activeImportedBlueprint.titleFr
            : defaultDocSubtitle),
        schoolAr: school,
        schoolFr: school,
        prof,
        trackCode: currentTrack.code,
        system: educationSystem,
        totalQuestions: normalizedQuestions.length,
        totalPoints: 20.0,
        durationMinutes: data.quiz.durationMinutes || 45,
        calculatorAllowed: data.quiz.calculatorAllowed ?? calculatorAllowed,
        questions: normalizedQuestions,
      };

      setCurrentInteractiveQuiz(aiQuiz);
      setStatusMessage({
        type: "success",
        text: `تم توليد وتدقيق أسئلة الكويز الرياضية (${normalizedQuestions.length} أسئلة · 20/20 نقطة) عبر ${data.modelUsed || modelChoice} بنجاح!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء تحويل الكويز بالذكاء الاصطناعي";
      setStatusMessage({
        type: "error",
        text: `${msg} — تم الاحتفاظ بالنسخة الخوارزمية الفورية.`,
      });
    } finally {
      setIsAiConvertingQuiz(false);
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDocumentFileTag = () => {
    const tag =
      activeModule === "DM_SERIE"
        ? dmSubType === "DEVOIR_MAISON"
          ? `DM_${dmNumber.replace(/\s+/g, "")}`
          : `Serie_TD_${dmNumber.replace(/\s+/g, "")}`
        : `${activeModule}_${dsKey}`;
    return `${currentTrack.code}_${tag}_Modele_${examModel}`;
  };

  const handleExportPDF = async () => {
    if (isExportingPDF) return;
    setIsExportingPDF(true);
    const previousViewMode = viewMode;
    if (previousViewMode !== "PREVIEW") {
      setViewMode("PREVIEW");
    }

    setStatusMessage({
      type: "info",
      text: "جاري تصدير الوثيقة النهائية بصيغة PDF عالية الدقة مع الاحتفاظ الكامل بالتنسيق والخطوط...",
    });

    try {
      // انتظار رسم نافذة المعاينة إذا كان المستخدم في وضع الكود
      await new Promise((r) => setTimeout(r, previousViewMode !== "PREVIEW" ? 280 : 80));
      const baseName = `${getDocumentFileTag()}_${year}.pdf`;
      await exportPreviewToPDF({
        elementId: "printable-document-sheet",
        fileName: baseName,
        orientation: pageOrientation.toLowerCase() as "portrait" | "landscape",
        showPageNumbers: true,
        docTitle: getDocumentFileTag(),
        headerMeta: `${school} · ${year}`,
        isMission,
        isFrench: isMission || docLang === "FR",
        interactiveQuizUrl: interactiveExamUrl,
        includeFooterQrCode: includeInteractiveQrFooter,
        autoAdjustA4Layout: true,
      });
      const updatedHist = recordExportHistoryEntry({
        fileName: baseName,
        formatLabel: "PDF Vectoriel (A4)",
        category: "PDF",
        trackCode: currentTrack.code,
        trackLabelAr: currentTrack.labelAr,
        semester,
        moduleType: activeModule,
        modelCode: examModel,
        fileSizeKb: 318.4,
        dpiOrCompiler: "300 DPI · Vector Math",
        includeAnswerWorkspace,
        includeDetailedSolutions,
      });
      setExportHistory(updatedHist);
      setStatusMessage({
        type: "success",
        text: `تم تصدير وتحميل ملف PDF بنجاح (${baseName}) بالتنسيق الكامل للمعاينة!`,
      });
    } catch {
      window.print();
      setStatusMessage({
        type: "info",
        text: "تم فتح نافذة حفظ PDF المباشرة للمتصفح.",
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadFile = (
    overrideFmt?: "PDF" | "LATEX" | "TYPST" | React.MouseEvent
  ) => {
    const activeFmt =
      typeof overrideFmt === "string" ? overrideFmt : exportFormat;
    if (activeFmt === "PDF") {
      handleExportPDF();
      return;
    }
    const ext = activeFmt === "LATEX" ? "tex" : "typ";
    const fName = `${getDocumentFileTag()}.${ext}`;
    const sourceToSave =
      activeFmt === exportFormat && generatedCode
        ? generatedCode
        : buildSourceCodeForFormat(activeFmt);
    const blob = new Blob([sourceToSave], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fName;
    a.click();
    URL.revokeObjectURL(url);

    const updatedHist = recordExportHistoryEntry({
      fileName: fName,
      formatLabel: ext === "tex" ? "LaTeX (.tex)" : "Typst (.typ)",
      category: "LATEX_TYPST",
      trackCode: currentTrack.code,
      trackLabelAr: currentTrack.labelAr,
      semester,
      moduleType: activeModule,
      modelCode: examModel,
      fileSizeKb: Number((blob.size / 1024).toFixed(1)) || 24.5,
      dpiOrCompiler: ext === "tex" ? "UTF-8 · XeLaTeX" : "Typst 0.12",
      includeAnswerWorkspace,
      includeDetailedSolutions,
      cachedContent: sourceToSave,
    });
    setExportHistory(updatedHist);
  };

  const handlePrint = (solutionsOnly?: boolean | React.MouseEvent) => {
    setViewMode("PREVIEW");
    const isOnly = typeof solutionsOnly === "boolean" ? solutionsOnly : false;
    
    // ضبط فئة التوجيه على مستند الطباعة
    if (pageOrientation === "LANDSCAPE") {
      document.body.classList.add("print-landscape");
      document.body.classList.remove("print-portrait");
    } else {
      document.body.classList.add("print-portrait");
      document.body.classList.remove("print-landscape");
    }

    if (isOnly) {
      setOnlyPrintSolutions(true);
      setTimeout(() => {
        window.print();
        setTimeout(() => setOnlyPrintSolutions(false), 500);
      }, 150);
    } else {
      setOnlyPrintSolutions(false);
      setTimeout(() => {
        window.print();
      }, 150);
    }
  };

  // تنفيذ أمر الطباعة المجمعة الموحد
  const handleExecuteBatchPrint = (
    items: BatchPrintItem[],
    options: BatchPrintOptions
  ) => {
    const selectedItems = items.filter((it) => it.selected);
    if (selectedItems.length === 0) {
      setStatusMessage({
        type: "error",
        text: "يرجى تحديد وثيقة واحدة على الأقل في طابور الطباعة المجمعة.",
      });
      return;
    }

    // إذا تم اختيار قالب محفوظ من خزانة الفروض، نطبقه أولاً مع الحفاظ على هوية المؤسسة
    const selectedSavedBp = selectedItems.find(
      (it) => it.category === "SAVED_BLUEPRINT" && it.blueprint
    );
    if (selectedSavedBp?.blueprint) {
      handleApplyExamConfigBlueprint(selectedSavedBp.blueprint, {
        keepCurrentIdentity: true,
      });
    }

    // تطبيق خيارات التسطير وحيز الإجابة طبقاً لاختيار طابور الطباعة المجمعة
    setIncludeAnswerWorkspace(Boolean(options.includeStudentWorkbookGrid));
    if (options.includeStudentWorkbookGrid) {
      setStudentGridStyle(options.studentGridStyle);
    }

    const hasModelA = selectedItems.some((it) => it.id === "doc_model_a");
    const hasModelB = selectedItems.some((it) => it.id === "doc_model_b");
    const hasSolutions = selectedItems.some((it) => it.id === "doc_solutions_annex");
    const hasEvalGrid = selectedItems.some((it) => it.id === "doc_eval_grid");
    const hasRemediation = selectedItems.some((it) => it.id === "doc_remediation_sheet");
    const hasCover = selectedItems.some((it) => it.id === "doc_cover_cahier_textes");
    const hasFormula = selectedItems.some((it) => it.id === "doc_formula_sheet");

    if (hasModelA && hasModelB) {
      setExamModel("BOTH");
    } else if (hasModelB && !hasModelA) {
      setExamModel("B");
    } else if (hasModelA) {
      setExamModel("A");
    }

    setIncludeDetailedSolutions(hasSolutions);
    if (hasSolutions) {
      setSolutionDisplayMode("SEPARATE_PAGE_ANNEXES");
    }
    setIncludeCustomEvalGridSheet(hasEvalGrid);
    setIncludePostExamRemediationSheet(hasRemediation);
    setIncludeOfficialExamCoverSheet(hasCover);
    setIncludeExamFormulaSheet(hasFormula);

    // التأكد من وضع المعاينة
    setViewMode("PREVIEW");
    setIsBatchPrintModalOpen(false);

    setStatusMessage({
      type: "info",
      text: options.bookletMode
        ? `جاري توليد كتيب الطباعة المطوي تلقائياً (Booklet A4 → A5) لـ ${selectedItems.length} وثائق...`
        : `جاري تهيئة طابور الطباعة المجمعة (${selectedItems.length} وثائق) مع فواصل صفحات ذكية...`,
    });

    setTimeout(async () => {
      if (options.bookletMode) {
        try {
          const bookletTag = `Booklet_A4_to_A5_${getDocumentFileTag()}_${year}.pdf`;
          const res = await exportBookletImposedPDF({
            elementId: "printable-document-sheet",
            fileName: bookletTag,
            bindingEdge: options.bookletBindingEdge,
            addFoldGuides: options.bookletAddFoldGuides,
            docTitle: customDocTitle || defaultDocTitle,
            headerMeta: `${school} · ${prof} · ${year}`,
            isMission,
            isFrench: docLang === "FR",
          });

          const updatedHist = recordExportHistoryEntry({
            fileName: res.fileName,
            formatLabel: `Booklet A4→A5 (${res.physicalA4Sheets} أوراق A4)`,
            category: "PDF",
            trackCode: currentTrack.code,
            trackLabelAr: currentTrack.labelAr,
            semester,
            moduleType: activeModule,
            modelCode: examModel,
            fileSizeKb: 310.5,
            dpiOrCompiler: `Saddle-Stitch Booklet · ${res.paddedBookletPages}p A5`,
            includeAnswerWorkspace: Boolean(options.includeStudentWorkbookGrid),
            includeDetailedSolutions: hasSolutions,
          });
          setExportHistory(updatedHist);

          setStatusMessage({
            type: "success",
            text: `✓ تم توليد وتصدير الكتيب المطوي (${res.fileName}) بنجاح: ${res.originalPages} صفحات أصلية رُتبت في ${res.physicalA4Sheets} أوراق A4 أفقية (${res.paddedBookletPages} ص A5 جاهزة للطي)!`,
          });
        } catch (err: unknown) {
          const msg =
            err instanceof Error
              ? err.message
              : "تعذر توليد ملف الكتيب المطوي (Booklet PDF).";
          setStatusMessage({
            type: "error",
            text: msg,
          });
        }
      } else {
        // إطلاق أمر الطباعة الموحد
        handlePrint(false);
        setStatusMessage({
          type: "success",
          text: `تم إطلاق أمر الطباعة المجمعة بنجاح (${selectedItems.length} وثائق متتالية)!`,
        });
      }
    }, 450);
  };

  const handleUpdateGeoGebraResource = (
    lessonKey: string,
    updated: GeoGebraResource
  ) => {
    setGeoGebraResourcesMap((prev) => ({
      ...prev,
      [lessonKey]: updated,
    }));
    setStatusMessage({
      type: "success",
      text: `تم تحديث النشاط الهندسي GeoGebra (${updated.fileName || updated.titleAr}) وتوليد رمز QR بدقة عالية تلقائياً داخل الورقة!`,
    });
  };

  const handleAddFigure = (fig: InsertedFigure) => {
    setInsertedFigures((prev) => [...prev, fig]);
    setStatusMessage({
      type: "success",
      text: `تم إدراج الشكل التوضيحي « ${fig.titleAr} » بنجاح في ورقة المعاينة!`,
    });
  };

  const handleUpdateFigure = (updated: InsertedFigure) => {
    setInsertedFigures((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
  };

  const handleDeleteFigure = (id: string) => {
    setInsertedFigures((prev) => prev.filter((f) => f.id !== id));
    setStatusMessage({
      type: "info",
      text: "تم حذف الشكل التوضيحي من الورقة.",
    });
  };

  // دوال رفع ملفات GeoGebra (.ggb / صور هندسية) وإضافة الروابط التفاعلية
  const handleGeoGebraFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetLesson = activeCustomLessons.find(
      (l) => l.lessonFr === ggbTargetLessonKey
    );
    const defaultTitleAr =
      ggbCustomTitleInput.trim() ||
      (targetLesson
        ? `${targetLesson.lessonAr} (${file.name})`
        : `ملف هندسي تفاعلي (${file.name})`);
    const defaultTitleFr =
      ggbCustomTitleInput.trim() ||
      (targetLesson
        ? `${targetLesson.lessonFr} (${file.name})`
        : `Figure GeoGebra (${file.name})`);

    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    const isImage = /\.(png|jpe?g|svg|webp)$/i.test(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const spatialPreset =
        SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS.find(
          (p) => p.id === selectedSpatialPresetId
        ) || SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS[0];

      const newRes: GeoGebraResource = {
        id: `ggb_upload_${Date.now()}`,
        lessonKey: ggbTargetLessonKey,
        titleAr: defaultTitleAr,
        titleFr: defaultTitleFr,
        type: isImage ? "FIGURE_IMAGE" : "GGB_FILE",
        fileName: file.name,
        fileSizeKb: sizeKb,
        ggbBase64: !isImage ? dataUrl : undefined,
        figureImageUrl: isImage ? dataUrl : undefined,
        is3D: isGeoGebra3DMode,
        spatialPresetType: isGeoGebra3DMode ? spatialPreset.id : undefined,
        spatialInstructionsListAr: isGeoGebra3DMode
          ? spatialPreset.instructionsAr
          : undefined,
        spatialInstructionsListFr: isGeoGebra3DMode
          ? spatialPreset.instructionsFr
          : undefined,
        interactiveUrl:
          ggbLinkInput.trim() ||
          (isGeoGebra3DMode
            ? "https://www.geogebra.org/3d"
            : "https://www.geogebra.org/geometry"),
        instructionsAr: isGeoGebra3DMode
          ? `نشاط هندسة فضائية ثلاثية الأبعاد (GeoGebra 3D .ggb) — ${spatialPreset.titleAr}: افتح الملف في محرك 3D أو اتبع تعليمات المعلم المتعامد الممنظم المباشر (O, i⃗, j⃗, k⃗).`
          : "افتح ملف GeoGebra المرفق (.ggb) أو امسح رمز QR لتحريك الشكل الهندسي والتحقق من المظنات.",
        instructionsFr: isGeoGebra3DMode
          ? `Activité de Géométrie dans l'Espace (GeoGebra 3D .ggb) — ${spatialPreset.titleFr} dans le repère orthonormé direct (O, i⃗, j⃗, k⃗).`
          : "Ouvrez le fichier .ggb joint ou scannez le QR code pour manipuler la figure géométrique.",
      };

      setGeoGebraResourcesMap((prev) => ({
        ...prev,
        [ggbTargetLessonKey]: newRes,
      }));
      setGgbCustomTitleInput("");
      setStatusMessage({
        type: "success",
        text: `تم إرفاق ملف ${isGeoGebra3DMode ? "GeoGebra 3D (.ggb) للهندسة الفضائية" : "GeoGebra"} « ${file.name} » (${sizeKb} KB) بنجاح مع تعليمات الفضاء!`,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddGeoGebraLink = () => {
    const trimmed = ggbLinkInput.trim();
    if (!trimmed) {
      setStatusMessage({
        type: "error",
        text: "يرجى إدخال رابط GeoGebra تفاعلي (مثل https://www.geogebra.org/m/...) أو معرف الورقة التفاعلية.",
      });
      return;
    }

    const match = trimmed.match(
      /geogebra\.org\/(?:m|classic|calculator|geometry|3d)\/([a-zA-Z0-9]+)/i
    );
    const matId = match
      ? match[1]
      : /^[a-zA-Z0-9]{6,12}$/.test(trimmed)
      ? trimmed
      : undefined;
    const normalizedUrl = trimmed.startsWith("http")
      ? trimmed
      : matId
      ? `https://www.geogebra.org/m/${matId}`
      : `https://${trimmed}`;

    const targetLesson = activeCustomLessons.find(
      (l) => l.lessonFr === ggbTargetLessonKey
    );
    const titleAr =
      ggbCustomTitleInput.trim() ||
      (targetLesson
        ? `${targetLesson.lessonAr} — نشاط تفاعلي GeoGebra`
        : "ورقة عمل هندسية تفاعلية عبر GeoGebra");
    const titleFr =
      ggbCustomTitleInput.trim() ||
      (targetLesson
        ? `${targetLesson.lessonFr} — Applet interactive GeoGebra`
        : "Figure géométrique interactive GeoGebra");

    const newRes: GeoGebraResource = {
      id: `ggb_link_${Date.now()}`,
      lessonKey: ggbTargetLessonKey,
      titleAr,
      titleFr,
      type: "GEOGEBRA_LINK",
      interactiveUrl: normalizedUrl,
      materialId: matId,
      instructionsAr:
        "امسح رمز الاستجابة السريعة QR أو افتح الرابط التفاعلي لتحريك النقط والمتجهات واستكشاف الخاصية الهندسية.",
      instructionsFr:
        "Scannez le QR code ou ouvrez le lien interactif GeoGebra pour manipuler la figure et conjecturer.",
    };

    setGeoGebraResourcesMap((prev) => ({
      ...prev,
      [ggbTargetLessonKey]: newRes,
    }));
    setGgbLinkInput("");
    setGgbCustomTitleInput("");
    setStatusMessage({
      type: "success",
      text: `تم ربط النشاط التفاعلي GeoGebra (${normalizedUrl}) وتضمينه تلقائياً في الفروض المحروسة والمنزلية.`,
    });
  };

  // دوال توليد وتصدير شبكات التقويم المخصصة (Grilles d'évaluation Excel & PDF)
  const handleExportEvaluationGridExcel = () => {
    const gridData = buildCustomEvaluationGrid({
      track: currentTrack,
      sem: semester,
      dsKey,
      dmSubType,
      dmNumber,
      activeModule,
      lessons: activeCustomLessons,
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

    exportEvaluationGridToExcel({
      gridData,
      school,
      prof,
      year,
      academy,
      direction,
      docLang,
      system: educationSystem,
      granularity: evalGridGranularity,
      studentCount: evalGridStudentCount,
      n1,
      n2,
      n3,
    });

    setStatusMessage({
      type: "success",
      text: `تم توليد وتحميل شبكة التقويم وتفريغ النقط بصيغة Excel (.xls) بناءً على تمارين الفرض (${gridData.exercises.length} تمارين، ${gridData.allQuestions.length} أسئلة).`,
    });
  };

  const handleExportEvaluationGridCSV = () => {
    const gridData = buildCustomEvaluationGrid({
      track: currentTrack,
      sem: semester,
      dsKey,
      dmSubType,
      dmNumber,
      activeModule,
      lessons: activeCustomLessons,
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

    exportMassarPronoteGradeSheet({
      gridData,
      school,
      prof,
      year,
      academy,
      direction,
      docLang,
      system: educationSystem,
      granularity: evalGridGranularity,
      studentCount: evalGridStudentCount,
      n1,
      n2,
      n3,
      customStudents: DEFAULT_MOROCCAN_CLASS_ROSTER.slice(
        0,
        Math.max(5, evalGridStudentCount)
      ),
      dsKey,
      semester,
    });

    setStatusMessage({
      type: "success",
      text: "تم تصدير ورقة تنقيط مسار و Pronote بصيغة CSV UTF-8 مع رموز مسار والتقديرات التربوية جاهزة للاستيراد في Excel.",
    });
  };

  const handleExportEvaluationGridPDF = async () => {
    if (isExportingEvalGridPDF) return;
    setIsExportingEvalGridPDF(true);
    const prevView = viewMode;
    if (prevView !== "PREVIEW") setViewMode("PREVIEW");
    setOnlyPrintEvalGrid(true);

    setStatusMessage({
      type: "info",
      text: "جاري توليد وتصدير شبكة التقويم المخصصة (Grille d'évaluation) بصيغة PDF عالية الدقة...",
    });

    try {
      await new Promise((r) => setTimeout(r, 320));
      const pdfName = `Grille_Evaluation_${getDocumentFileTag()}_${year}.pdf`;
      await exportPreviewToPDF({
        elementId: "printable-document-sheet",
        fileName: pdfName,
      });
      setStatusMessage({
        type: "success",
        text: `تم تصدير وتحميل شبكة التقويم المخصصة بصيغة PDF بنجاح (${pdfName})!`,
      });
    } catch {
      window.print();
    } finally {
      setOnlyPrintEvalGrid(false);
      setIsExportingEvalGridPDF(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden math-canvas-cool text-slate-900 flex flex-col font-sans selection:bg-cyan-200 selection:text-cyan-950">
      {/* نافذة تثبيت التطبيق على الهاتف وتوليد حزمة أندرويد APK */}
      {showAPKModal && (
        <APKInstallModal
          isOpen={showAPKModal}
          onClose={() => setShowAPKModal(false)}
        />
      )}

      {/* نافذة إدارة وتوزيع النقط على الأسئلة والمستويات المهارية N1 / N2 / N3 وفق المذكرة 142-08 */}
      {isBaremeModalOpen && (
        <ExamBaremeManagerModal
          isOpen={isBaremeModalOpen}
          onClose={() => setIsBaremeModalOpen(false)}
          lessons={activeCustomLessons}
          n1={n1}
          n2={n2}
          n3={n3}
          customQuestionBaremesMap={customQuestionBaremesMap}
          customQuestionLevelsMap={customQuestionLevelsMap}
          onUpdateQuestionBaremes={handleUpdateQuestionBaremes}
          onUpdateQuestionLevels={handleUpdateQuestionLevels}
          onUpdateCustomQuestions={handleUpdateCustomQuestions}
          onResetAllBaremes={handleResetAllBaremes}
          showQuestionBareme={showQuestionBareme}
          onToggleShowQuestionBareme={setShowQuestionBareme}
          includeGradingScaleTable={includeGradingScaleTable}
          onToggleIncludeGradingScaleTable={setIncludeGradingScaleTable}
          currentTrackCode={currentTrack.code}
          isFr={isMission || docLang === "FR"}
          dsQuestionDensity={dsQuestionDensity}
          dsStructureMode={dsStructureMode}
          isMission={isMission}
        />
      )}

      {/* مركز تصدير الوثائق والملفات متعدد الصيغ (PDF، LaTeX، Typst، HTML المستقل، JSON، وحزمة Overleaf ZIP) */}
      {isExportCenterOpen && (
        <ExportCenterModal
          isOpen={isExportCenterOpen}
          onClose={() => setIsExportCenterOpen(false)}
          onPrintPreview={handlePrint}
          onDownloadFile={(overrideFmt) => handleDownloadFile(overrideFmt)}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          pageOrientation={pageOrientation}
          setPageOrientation={setPageOrientation}
          documentFileTag={getDocumentFileTag()}
          year={year}
          includeDetailedSolutions={includeDetailedSolutions}
          setIncludeDetailedSolutions={setIncludeDetailedSolutions}
          examModel={examModel}
          setExamModel={setExamModel}
          onNotify={(type, text) => setStatusMessage({ type, text })}
          onOpenJsonConfigModal={() => setIsJsonConfigModalOpen(true)}
          school={school}
          prof={prof}
          trackLabelAr={currentTrack.labelAr}
          trackLabelFr={currentTrack.labelFr}
          academy={academy}
          direction={direction}
          generatedLatexCode={
            exportFormat === "TYPST" || !generatedCode
              ? buildSourceCodeForFormat("LATEX")
              : generatedCode
          }
          hasQcm={dsStructureMode === "QCM_ET_EXERCICES" || dsStructureMode === "COMPLETE_EXAM_MAROC"}
          hasPython={attachedPythonAlgorithms.length > 0}
          lessons={activeCustomLessons}
          interactiveExamUrl={interactiveExamUrl}
          includeInteractiveQrFooter={includeInteractiveQrFooter}
          onOpenExportDashboard={() => setIsExportDashboardOpen(true)}
          onFileExported={(fileName, category, formatLabel, fileSizeKb) => {
            const updated = recordExportHistoryEntry({
              fileName,
              formatLabel,
              category,
              trackCode: currentTrack.code,
              trackLabelAr: currentTrack.labelAr,
              semester,
              moduleType: activeModule,
              modelCode: examModel,
              fileSizeKb,
              dpiOrCompiler:
                category === "OVERLEAF_ZIP"
                  ? "XeLaTeX · TeX Live 2025"
                  : category === "PDF"
                  ? "300 DPI · Vector Math"
                  : "UTF-8 Standard",
              includedFiles:
                category === "OVERLEAF_ZIP"
                  ? ["main.tex", "preamble.tex", "README_OVERLEAF.md"]
                  : undefined,
              includeAnswerWorkspace,
              includeDetailedSolutions,
              cachedContent:
                category === "OVERLEAF_ZIP" && exportFormat === "TYPST"
                  ? buildSourceCodeForFormat("LATEX")
                  : generatedCode,
            });
            setExportHistory(updated);
          }}
        />
      )}

      {/* لوحة القيادة المركزية للملفات المصدّرة وسجل التحميلات وحزم Overleaf */}
      {isExportDashboardOpen && (
        <ExportDashboardModal
          isOpen={isExportDashboardOpen}
          onClose={() => setIsExportDashboardOpen(false)}
          track={currentTrack}
          sem={semester}
          dsKey={dsKey}
          activeModule={activeModule}
          examModel={examModel}
          includeAnswerWorkspace={includeAnswerWorkspace}
          includeDetailedSolutions={includeDetailedSolutions}
          latexCode={
            exportFormat === "TYPST" || !generatedCode
              ? buildSourceCodeForFormat("LATEX")
              : generatedCode
          }
          typstCode={
            exportFormat === "TYPST" && generatedCode
              ? generatedCode
              : buildSourceCodeForFormat("TYPST")
          }
          exportHistory={exportHistory}
          onUpdateExportHistory={setExportHistory}
          onTriggerPrintPdf={() => handlePrint(false)}
          onTriggerExportOverleafZip={handleDirectExportOverleafZip}
          onTriggerDownloadLatex={() => handleDownloadFile("LATEX")}
          onTriggerDownloadTypst={() => handleDownloadFile("TYPST")}
          onTriggerDownloadHtml={() => {
            exportStandaloneHTML(
              "printable-document-sheet",
              `${getDocumentFileTag()}_${year}.html`,
              `${getDocumentFileTag()} - ${year}`
            );
          }}
          onTriggerDownloadEvalExcel={handleExportEvaluationGridExcel}
          onOpenExportCenter={() => setIsExportCenterOpen(true)}
        />
      )}

      {/* نافذة الطباعة المجمعة الموحدة لطابور الوثائق والفروض المحفوظة */}
      {isBatchPrintModalOpen && (
        <BatchPrintModal
          isOpen={isBatchPrintModalOpen}
          onClose={() => setIsBatchPrintModalOpen(false)}
          currentDocTitle={getDocumentFileTag()}
          trackLabel={isMission || docLang === "FR" ? currentTrack.labelFr : currentTrack.labelAr}
          examModel={examModel}
          savedBlueprints={loadSavedConfigVault().map((v) => v.blueprint)}
          onExecuteBatchPrint={handleExecuteBatchPrint}
        />
      )}

      {/* نافذة تصدير واستيراد إعدادات الفرض المحروس بصيغة JSON وخزانة القوالب */}
      {isJsonConfigModalOpen && (
        <ExamConfigStorageModal
          isOpen={isJsonConfigModalOpen}
          onClose={() => setIsJsonConfigModalOpen(false)}
          currentBlueprint={currentExamConfigBlueprint}
          onApplyBlueprint={handleApplyExamConfigBlueprint}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* نافذة المصحح الآلي الذكي لأوراق الإجابة QCM بالذكاء البصري والكاميرا */}
      {showSmartQcmScannerModal && (
        <SmartQcmScannerModal
          isOpen={showSmartQcmScannerModal}
          onClose={() => setShowSmartQcmScannerModal(false)}
          onNotify={(type, msg) => setStatusMessage({ type, text: msg })}
          examTitle={`${currentTrack.labelAr} — ${semester === "S1" ? "الدورة الأولى" : "الدورة الثانية"}`}
          trackLabel={currentTrack.labelAr}
          initialModel={examModel === "B" ? "B" : "A"}
        />
      )}

      {/* نافذة استوديو بطاقات المعالجة والدعم الفردي الفارقي مع رموز QR */}
      {showIndividualRemediationModal && (
        <IndividualRemediationStudioModal
          isOpen={showIndividualRemediationModal}
          onClose={() => setShowIndividualRemediationModal(false)}
          onNotify={(type, msg) => setStatusMessage({ type, text: msg })}
          schoolName={school}
          profName={prof}
          trackLabel={currentTrack.labelAr}
        />
      )}

      {/* نافذة مركز التزامن السحابي والمحلي متعدد الأجهزة (حاسوب ⟷ تابلت ⟷ هاتف) */}
      {showCrossPlatformSyncModal && (
        <CrossPlatformSyncModal
          isOpen={showCrossPlatformSyncModal}
          onClose={() => setShowCrossPlatformSyncModal(false)}
          onNotify={(type, msg) => setStatusMessage({ type, text: msg })}
          currentBlueprint={currentExamConfigBlueprint}
          onApplySyncedBlueprint={(bp) =>
            handleApplyExamConfigBlueprint(bp, { keepCurrentIdentity: false })
          }
        />
      )}

      {/* نافذة تأكيد الحذف الإلزامية لملفات Google Drive */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700 font-black text-base">
              <Trash2 className="w-5 h-5 shrink-0" />
              <span>تأكيد حذف الملف من Google Drive</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف الملف{" "}
              <span className="font-bold text-slate-950">"{fileToDelete.name}"</span> نهائياً من
              مجلد Google Drive الخاص بك؟ لا يمكن التراجع عن هذه العملية.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                إلغاء (Cancel)
              </button>
              <button
                onClick={confirmDeleteDriveFile}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white transition"
              >
                تأكيد الحذف النهائي (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تخصيص الهوية البصرية للتطبيق والوثائق */}
      {showLogoStudio && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3.5">
                <TeacherLogo
                  variant={logoVariant}
                  size={46}
                  customImageUrl={customLogoUrl}
                />
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    تخصيص الهوية البصرية للمنصة والوثائق (Doc2App & Math Crest)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    DOC2APP Minimalist Vector Math · √ Prof Kouziber Brahim · Vector HD
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoStudio(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                إغلاق
              </button>
            </div>

            {/* معاينة النسخ الأربع المطوّرة بما فيها شعار Doc2App الأحادي اللون */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {(
                [
                  {
                    id: "DOC2APP_MONO" as TeacherLogoVariant,
                    title: "شعار Doc2App الأكاديمي (Mono)",
                    desc: "تصميم شعاعي أحادي اللون (∫ Doc → App) مثالي للترويسة",
                  },
                  {
                    id: "ROYAL_GOLD" as TeacherLogoVariant,
                    title: "النسخة الذهبية (3D Gold)",
                    desc: "تدرج ذهبي 24K وخلفية أوبسيديان",
                  },
                  {
                    id: "ACADEMIC_CREST" as TeacherLogoVariant,
                    title: "الوسام الأكاديمي (Math Crest)",
                    desc: "بنقش الرموز الرياضية (∫ ∑ π ∞ Δ)",
                  },
                  {
                    id: "PRINT_MONO" as TeacherLogoVariant,
                    title: "نسخة الطباعة الورقية (B&W)",
                    desc: "مخصصة لطباعة الفروض بالليزر بوضوح فائق",
                  },
                ] as const
              ).map((item) => {
                const isSelected = !customLogoUrl && logoVariant === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCustomLogoUrl(null);
                      setLogoVariant(item.id);
                    }}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-100/80 ring-2 ring-slate-900/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <TeacherLogo variant={item.id} size={96} />
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 leading-snug">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* خيارات الإدراج في الترويسة والعلامة المائية */}
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={includeTeacherLogo}
                    onChange={(e) => setIncludeTeacherLogo(e.target.checked)}
                    className="rounded text-indigo-700 w-4 h-4"
                  />
                  <span>إدراج الهوية البصرية في ترويسة الفروض والوثائق</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={includeLogoWatermark}
                    onChange={(e) => setIncludeLogoWatermark(e.target.checked)}
                    className="rounded text-indigo-700 w-4 h-4"
                  />
                  <span>إدراج علامة مائية وسط صفحة الفرض (Watermark)</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 rounded-lg text-xs font-black bg-indigo-900 hover:bg-indigo-950 text-white flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع صورة مخصصة (PNG / JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>

                  {customLogoUrl && (
                    <button
                      onClick={() => setCustomLogoUrl(null)}
                      className="px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 transition"
                    >
                      استعادة النسخة الشعاعية
                    </button>
                  )}
                </div>

                <button
                  onClick={handleDownloadDevelopedLogo}
                  className="px-4 py-2 rounded-lg text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل بصيغة SVG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. الشريط العلوي المؤسسي الموحد وشريط ضوابط الوثيقة (Executive Top Bar & Workspace Ribbon) */}
      <TopNavigationHeader
        prof={prof}
        school={school}
        currentTrackCode={currentTrack.code}
        savedBadge={savedBadge}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        logoVariant={logoVariant}
        customLogoUrl={customLogoUrl}
        onOpenLogoStudio={() => setShowLogoStudio(true)}
        onToggleSidebar={handleToggleSidebar}
        onOpenMobileNav={() => setMobileNavOpen(true)}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        isMission={isMission}
        educationSystem={educationSystem}
        onSystemChange={handleSystemChange}
        docLang={docLang}
        onChangeDocLang={setDocLang}
        bilingualLayout={bilingualLayout}
        onChangeBilingualLayout={setBilingualLayout}
        exportFormat={exportFormat}
        onChangeExportFormat={(fmt) => {
          setExportFormat(fmt);
          if (fmt === "PDF") {
            setViewMode("PREVIEW");
          }
        }}
        pageOrientation={pageOrientation}
        onTogglePageOrientation={() =>
          setPageOrientation((prev) => (prev === "PORTRAIT" ? "LANDSCAPE" : "PORTRAIT"))
        }
        includeAnswerWorkspace={includeAnswerWorkspace}
        onToggleAnswerWorkspace={() => setIncludeAnswerWorkspace((v) => !v)}
        totalPoints={liveExamStats.totalPoints}
        auditScorePercent={pedagogicalAuditReport.scorePercent}
        auditIssueCount={pedagogicalAuditReport.issueCount}
        showAuditPanel={showAuditPanel}
        onToggleAuditPanel={() => setShowAuditPanel((v) => !v)}
        onOpenBaremeModal={() => setIsBaremeModalOpen(true)}
        showMathPalette={showMathPalette}
        onToggleMathPalette={() => setShowMathPalette((v) => !v)}
        onOpenAdvancedPedagogyStudio={() =>
          handleOpenAdvancedPedagogyStudio("FUNCTION_PLOTTER")
        }
        onOpenPythonLab={() => setShowPythonLabModal(true)}
        onOpenAiAssistant={() => {
          setPedagogicalAiInitialView("WORKSPACE");
          setShowPedagogicalAiModal(true);
        }}
        onOpenAiSettings={() => {
          setPedagogicalAiInitialView("SETTINGS_DOCS");
          setShowPedagogicalAiModal(true);
        }}
        onOpenWolframVerifier={() => setShowWolframVerifierModal(true)}
        onOpenJsonConfigModal={() => setIsJsonConfigModalOpen(true)}
        onOpenAPKModal={() => setShowAPKModal(true)}
        onOpenSmartQcmScanner={() => setShowSmartQcmScannerModal(true)}
        onOpenIndividualRemediation={() => setShowIndividualRemediationModal(true)}
        onOpenCrossPlatformSync={() => setShowCrossPlatformSyncModal(true)}
        onOpenInteractiveQuiz={handleOpenInteractiveQuiz}
        selectedAiModel={selectedAiModel}
        onSelectAiModel={setSelectedAiModel}
        isExamSimulationActive={isExamSimulationActive}
        showImportedExamStudio={showImportedExamStudio}
        onToggleImportedExamStudio={() => {
          setActiveModule("DS_142_08");
          setShowImportedExamStudio((v) => !v);
        }}
        isExportingPDF={isExportingPDF}
        onExportPDF={handleExportPDF}
        onPrintA4={() => handlePrint(false)}
        onOpenExportCenter={() => setIsExportCenterOpen(true)}
        onOpenExportDashboard={() => setIsExportDashboardOpen(true)}
        exportHistoryCount={exportHistory.length}
        onOpenBatchPrint={() => setIsBatchPrintModalOpen(true)}
        driveConnected={!!driveToken}
        isLoggingInDrive={isLoggingInDrive}
        driveUserDisplayName={driveUser?.displayName || undefined}
        onDriveSignIn={handleGoogleDriveSignIn}
        onToggleDrivePanel={() => {
          setShowDrivePanel((v) => !v);
          fetchDriveFiles();
        }}
        onDriveLogout={handleGoogleDriveLogout}
        isConfigDeckCollapsed={isConfigDeckCollapsed}
        onToggleConfigDeck={() => setIsConfigDeckCollapsed((v) => !v)}
        onResetPreferences={handleResetPreferences}
        onOpenDidacticChecklist={() => setShowDidacticChecklistModal(true)}
        onOpenRemedialExam={() => setShowRemedialExamModal(true)}
        showA4LivePageBreaks={showA4LivePageBreaks}
        onToggleA4LivePageBreaks={() => setShowA4LivePageBreaks((v) => !v)}
        economicTwoUpPrintMode={economicTwoUpPrintMode}
        onToggleEconomicTwoUpPrintMode={() => setEconomicTwoUpPrintMode((v) => !v)}
      />

      {/* لوحة الرموز والعمليات الرياضية السريعة بألوان باردة هادئة */}
      <MathSymbolPaletteBar
        isOpen={showMathPalette}
        onToggle={() => setShowMathPalette(false)}
        isArabic={docLang !== "FR"}
        onInsertSymbol={(glyph) => {
          setStatusMessage({
            type: "success",
            text: `تم نسخ الرمز الرياضي « ${glyph} » إلى الحافظة بنجاح، يمكنك لصقه في أي حقل أو سؤال.`,
          });
        }}
      />

      {/* هيكل لوحة التحكم مع شريط التنقل الجانبي الثابت (Persistent Side Navigation Layout) */}
      <div className="flex-1 flex w-full min-h-0 relative">
        <SideNavigationMenu
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          isMission={isMission}
          dmSubType={dmSubType}
          onSelectDmSubType={setDmSubType}
          currentTrackLabel={isMission ? currentTrack.labelFr : currentTrack.labelAr}
          currentTrackCode={currentTrack.code}
          semester={semester}
          dsKey={dsKey}
          activeExercisesCount={activeCustomLessons.length}
          totalWeightScore={totalCustomWeight}
          isExamSimulationActive={isExamSimulationActive}
          showImportedExamStudio={showImportedExamStudio}
          onToggleImportedExamStudio={() => {
            setActiveModule("DS_142_08");
            setShowImportedExamStudio((v) => !v);
          }}
          onOpenLogoStudio={() => setShowLogoStudio(true)}
          onOpenDrivePanel={() => {
            setShowDrivePanel((v) => !v);
            if (!showDrivePanel) fetchDriveFiles();
          }}
          driveConnected={!!driveToken}
          driveUserName={driveUser?.displayName || undefined}
          isConfigDeckCollapsed={isConfigDeckCollapsed}
          onToggleConfigDeck={() => setIsConfigDeckCollapsed((v) => !v)}
          isInlineEditable={isInlineEditable}
          onToggleInlineEditable={() => setIsInlineEditable((v) => !v)}
          pageOrientation={pageOrientation}
          onTogglePageOrientation={() =>
            setPageOrientation((prev) => (prev === "PORTRAIT" ? "LANDSCAPE" : "PORTRAIT"))
          }
          onPrint={() => handlePrint(false)}
          onExportPDF={handleExportPDF}
          isExportingPDF={isExportingPDF}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={handleToggleSidebar}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          onOpenMobileConfigSheet={handleOpenMobileConfigSheet}
          docFontFamily={docFontFamily}
          onChangeDocFontFamily={setDocFontFamily}
          docFontSize={docFontSize}
          onChangeDocFontSize={setDocFontSize}
          handwrittenSolutionsOnly={handwrittenSolutionsOnly}
          onToggleHandwrittenSolutionsOnly={() =>
            setHandwrittenSolutionsOnly((v) => !v)
          }
          onOpenAPKModal={() => setShowAPKModal(true)}
          onOpenSmartQcmScanner={() => setShowSmartQcmScannerModal(true)}
          onOpenIndividualRemediation={() => setShowIndividualRemediationModal(true)}
          onOpenCrossPlatformSync={() => setShowCrossPlatformSyncModal(true)}
          onOpenInteractiveQuiz={handleOpenInteractiveQuiz}
          onOpenPythonLab={() => setShowPythonLabModal(true)}
          onOpenAiAssistant={() => {
            setPedagogicalAiInitialTask(undefined);
            setShowPedagogicalAiModal(true);
          }}
          onOpenAiPedagogicalAction={(task) =>
            handleOpenPedagogicalAiWithTask(task, pedagogicalAiInitialLessonIdx)
          }
          onOpenWolframVerifier={() => setShowWolframVerifierModal(true)}
          onOpenBatchPrint={() => setIsBatchPrintModalOpen(true)}
          onOpenExportDashboard={() => setIsExportDashboardOpen(true)}
          exportHistoryCount={exportHistory.length}
          onOpenAdvancedPedagogyStudio={() => handleOpenAdvancedPedagogyStudio("SPEC_2D")}
          auditScorePercent={pedagogicalAuditReport.scorePercent}
          onOpenAuditPanel={() => setShowAuditPanel((v) => !v)}
          includeAnswerWorkspace={includeAnswerWorkspace}
          onToggleAnswerWorkspace={() => setIncludeAnswerWorkspace((v) => !v)}
          onOpenJsonConfigModal={() => setIsJsonConfigModalOpen(true)}
        />

        {/* حاوية المحتوى الرئيسي بعرض الشاشة الكاملة */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* المحتوى الرئيسي */}
          <main className="max-w-none w-full mx-auto px-2.5 md:px-4 py-2.5 pb-20 lg:pb-4 space-y-3 flex-1">
        {/* لوحة أرشيف Google Drive السحابي مع حركة Framer Motion */}
        <AnimatePresence initial={false}>
          {showDrivePanel && (
            <motion.section
              key="drive-cloud-panel"
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden no-print"
            >
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    خزانة الملفات السحابية على Google Drive
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    المجلد: منصة الهندسة البيداغوجية - الرياضيات (Math Platform)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchDriveFiles()}
                  disabled={isLoadingDriveFiles}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDriveFiles ? "animate-spin" : ""}`} />
                  <span>تحديث</span>
                </button>
                <button
                  onClick={handleSaveToGoogleDrive}
                  disabled={isUploadingDrive}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>{isUploadingDrive ? "جاري الحفظ..." : "حفظ الوثيقة الحالية"}</span>
                </button>
                <button
                  onClick={() => setShowDrivePanel(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {isLoadingDriveFiles ? (
              <div className="text-center py-6 text-xs text-slate-500 font-semibold">
                جاري تحميل قائمة الملفات المحفوظة من Google Drive...
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-600 space-y-1">
                <p className="font-bold">لا توجد ملفات محفوظة بعد في مجلد المنصة على Google Drive.</p>
                <p className="text-[11px] text-slate-500">
                  اضغط على «حفظ في Google Drive» لتصدير الفرض المحروس أو المنزلي أو السلسلة مباشرة إلى حسابك.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between gap-2 hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-slate-900 break-all">
                        {file.name}
                      </div>
                      {file.description && (
                        <div className="text-[11px] text-slate-500 truncate">
                          {file.description}
                        </div>
                      )}
                      {file.createdTime && (
                        <div className="text-[10px] text-slate-400 tabular-nums">
                          {new Date(file.createdTime).toLocaleDateString("ar-MA")}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {file.webViewLink ? (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>فتح في Drive</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold">محفوظ</span>
                      )}
                      <button
                        onClick={() => setFileToDelete(file)}
                        title="حذف الملف من Google Drive"
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* شريط اختيار مؤسسات البعثة الفرنسية بالمغرب عند تفعيل وضع البعثة */}
        {isMission && (
          <section className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <School className="w-4 h-4 text-blue-800" />
                <span>مؤسسات التعليم الفرنسي بالمغرب (Sélection rapide d'un Lycée)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                AEFE · OSUI · EGD
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {MISSION_SCHOOLS.map((s) => {
                const isSelected = school.includes(s.name);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectMissionSchool(s)}
                    className={`p-3 rounded-lg text-xs transition text-right border flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-700 text-blue-950 font-black"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-semibold"
                    }`}
                  >
                    <div className="space-y-0.5 text-right">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{s.city}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[10px] text-slate-600">{s.network}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* شريط السياق البيداغوجي الحي ومنصة المختبرات التخصصية الموحدة (Unified Context & Didactic Labs Dock) */}
        <section className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs no-print">
          {/* الصف العلوي: مسار الوثيقة الحية (Unboxed Breadcrumb) + ضوابط المعاينة والتدقيق الأساسية */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-black text-slate-950">
                {activeModule === "DS_142_08"
                  ? "فرض محروس (DS)"
                  : activeModule === "DM_SERIE"
                  ? dmSubType === "DEVOIR_MAISON"
                    ? "فرض منزلي (DM)"
                    : "سلسلة تمارين (TD)"
                  : activeModule === "FICHE_OP2007"
                  ? "جذاذة تربوية"
                  : activeModule === "DIAGNOSTIC"
                  ? "رائز تشخيصي"
                  : "التوزيع السنوي"}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-bold text-slate-800">
                {isMission ? currentTrack.labelFr : `${currentTrack.labelAr} (${currentTrack.code})`}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono font-semibold text-slate-700 tabular-nums">
                {activeModule === "DS_142_08"
                  ? `${semester} · ${dsKey} · ${currentTrack.durationFr}`
                  : activeModule === "DM_SERIE"
                  ? `${dmNumber} · ${semester}`
                  : currentTrack.durationFr}
              </span>
              {(activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-mono font-extrabold text-teal-800 tabular-nums">
                    {activeCustomLessons.length} تمارين · {liveExamStats.totalQuestions} سؤالاً ·{" "}
                    {liveExamStats.totalPoints.toFixed(2)}/20 ن
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* زر التبديل السريع لحيز الإجابة الكاملة المعاير للتلميذ */}
              <button
                type="button"
                onClick={() => setIncludeAnswerWorkspace((v) => !v)}
                className={`h-7.5 px-2.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 cursor-pointer border ${
                  includeAnswerWorkspace
                    ? "bg-teal-700 text-white border-teal-800 shadow-2xs"
                    : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
                title="ترك فراغ الإجابة الكاملة المعاير للتلميذ تحت كل سؤال (مع شبكة معلم، جدول تغيرات، ومراحل البرهان بالترجع)"
              >
                <Edit3 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {includeAnswerWorkspace
                    ? "✓ حيز الإجابة الكاملة: مفعّل"
                    : "ترك فراغ للإجابة الكاملة"}
                </span>
              </button>

              {/* زر مرصد التدقيق البيداغوجي الشامل واقتراح النقائص */}
              <button
                type="button"
                onClick={() => setShowAuditPanel((v) => !v)}
                className={`h-7.5 px-2.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 cursor-pointer border ${
                  showAuditPanel
                    ? "bg-slate-900 text-cyan-300 border-slate-900"
                    : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
                title="فتح مرصد المراجعة الشاملة والتدقيق البيداغوجي وتصحيح الأخطاء واقتراح النقائص (142-08)"
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    showAuditPanel ? "text-cyan-400" : "text-teal-700"
                  }`}
                />
                <span>المراجعة وتدقيق المطابقة</span>
                <span className="font-mono tabular-nums font-black text-teal-700">
                  {pedagogicalAuditReport.scorePercent}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsConfigDeckCollapsed((v) => !v)}
                className={`hidden lg:inline-flex items-center gap-1.5 h-7.5 px-2.5 rounded-lg text-[11px] font-black transition cursor-pointer border ${
                  isConfigDeckCollapsed
                    ? "bg-slate-900 text-cyan-300 border-slate-900 shadow-2xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
                title="تبديل وضع اللوح الإلكتروني والتركيز الكامل على ورقة A4 (اختصار سطح المكتب: Ctrl+B)"
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isConfigDeckCollapsed
                    ? "إظهار أعمدة الإعدادات (Ctrl+B)"
                    : "التركيز على الورقة A4"}
                </span>
              </button>
              {isConfigDeckCollapsed && (
                <button
                  type="button"
                  onClick={() => handleOpenMobileConfigSheet(1)}
                  className="hidden lg:inline-flex h-7.5 px-2.5 rounded-lg text-[11px] font-black bg-slate-900 text-cyan-300 border border-slate-700 items-center gap-1.5 cursor-pointer"
                  title="فتح درج الإعدادات السريع دون مغادرة معاينة الورقة"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>درج الإعدادات العائم</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenMobileConfigSheet(1)}
                className="lg:hidden h-7.5 px-2.5 rounded-lg text-[11px] font-black bg-slate-900 text-cyan-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>درج الإعدادات والضوابط</span>
              </button>
            </div>
          </div>

          {/* الصف السفلي الموحد: رصيف المختبرات الديداكتيكية واستوديوهات المفتش والأستاذ (Unified Segmented Lab Dock) */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10.5px] font-black text-slate-400 whitespace-nowrap shrink-0 pl-1">
              المختبرات التخصصية:
            </span>

            {/* زر تحويل التمارين الحالية إلى اختبار تفاعلي مع تصحيح آلي فوري (Interactive Quiz) */}
            <button
              type="button"
              onClick={handleOpenInteractiveQuiz}
              className="h-7 px-2.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 cursor-pointer border bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-amber-600 shadow-2xs whitespace-nowrap shrink-0"
              title="تحويل التمارين الحالية إلى اختبار تفاعلي (Interactive Quiz) مع تصحيح آلي فوري وسجل نقط عبر مكتبة quizGenerator"
            >
              <Zap className="w-3.5 h-3.5 text-amber-100 fill-current shrink-0" />
              <span>اختبار تفاعلي وتصحيح آلي (Quiz /20)</span>
            </button>

            {activeModule === "DS_142_08" && (
              <button
                type="button"
                onClick={() => handleOpenAdvancedPedagogyStudio("SPEC_2D")}
                className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-900 text-cyan-300 border-slate-800 hover:bg-slate-800 whitespace-nowrap shrink-0"
                title="فتح مصفوفة التخصيص 2D وتقييم المهارات المكتسبة للتلاميذ والتقرير البيداغوجي المدمج"
              >
                <Table2 className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>مصفوفة التخصيص 2D</span>
              </button>
            )}

            {activeModule === "DS_142_08" && (
              <button
                type="button"
                onClick={() => {
                  setImportedStudioInitialTab("ARCHIVE");
                  setShowImportedExamStudio((v) => !v);
                }}
                className={`h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border whitespace-nowrap shrink-0 ${
                  isExamSimulationActive
                    ? "bg-teal-700 text-white border-teal-800"
                    : showImportedExamStudio && importedStudioInitialTab !== "PDF_HIGHLIGHTER"
                    ? "bg-slate-900 text-cyan-300 border-slate-800"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                <Sparkles className="w-3 h-3 text-cyan-700 shrink-0" />
                <span>
                  {showImportedExamStudio && importedStudioInitialTab !== "PDF_HIGHLIGHTER"
                    ? "إخفاء استوديو المحاكاة"
                    : isExamSimulationActive
                    ? `الفرض المحاكى (#${examVariationSeed})`
                    : "محاكاة فرض خارجي"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (showImportedExamStudio && importedStudioInitialTab === "PDF_HIGHLIGHTER") {
                  setShowImportedExamStudio(false);
                } else {
                  setImportedStudioInitialTab("PDF_HIGHLIGHTER");
                  setShowImportedExamStudio(true);
                }
              }}
              className={`h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border whitespace-nowrap shrink-0 ${
                showImportedExamStudio && importedStudioInitialTab === "PDF_HIGHLIGHTER"
                  ? "bg-slate-900 text-amber-300 border-slate-800"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
              }`}
              title="فتح عارض PDF التفاعلي وتظليل المقاطع بالماوس لتوليد تمارين رياضية موازية بالذكاء الاصطناعي"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>عارض PDF والتوليد بالتظليل</span>
            </button>

            <div className="w-px h-4 bg-slate-200 shrink-0 mx-0.5" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                setMathInspectorStudioTab("SIGN_TABLE_STUDIO");
                setShowMathInspectorStudioModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="مولد جدول الإشارة ومجموعة التعريف الآلي (Tableaux de Signes & D_f) عبر MathJS"
            >
              <span className="font-mono text-indigo-700 font-black">±||</span>
              <span>جدول الإشارة و D_f</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMathInspectorStudioTab("INTEGRAL_AREA_STUDIO");
                setShowMathInspectorStudioModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="مختبر حساب التكامل والمساحات المظللة بين منحنيين (Calcul Intégral & Aires Hachurées)"
            >
              <span className="font-serif text-emerald-700 font-black">∫</span>
              <span>التكامل والمساحة المظللة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMathInspectorStudioTab("SPACE_GEOMETRY_3D_STUDIO");
                setShowMathInspectorStudioModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="مكتبة الأشكال الهندسية الفضائية ثلاثية الأبعاد (مكعب، رباعي أوجه، هرم، فلكة ومستوٍ قاطع)"
            >
              <span className="font-mono text-cyan-800 font-black">3D</span>
              <span>الهندسة الفضائية SVG</span>
            </button>

            <div className="w-px h-4 bg-slate-200 shrink-0 mx-0.5" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                setMathInspectorStudioTab("DOUBLE_PENALTY_DETECTOR");
                setShowMathInspectorStudioModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="النقطة 2 للمفتش التربوي: مدقق العقوبة المزدوجة (3 أنماط إصلاح) + التدرج الديداكتيكي وميزانية الزمن (1×3)"
            >
              <span className="font-mono text-amber-700 font-black">1×3</span>
              <span>مدقق المفتش (العقوبة المزدوجة)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMathInspectorStudioTab("LONGITUDINAL_COHORT");
                setShowMathInspectorStudioModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="النقطة 3 للمفتش التربوي: لوحة التتبع الطولي (DS1→DS2→DS3) ومبيان التطور ومصنف نقط مسار"
            >
              <span className="font-mono text-teal-800 font-black">DS1→3</span>
              <span>التتبع الطولي ومسار</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMathInspectorStudioTab("EDTECH_DEV_STUDIO");
                setShowMathInspectorStudioModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-900 hover:bg-slate-800 text-cyan-300 border-slate-800 whitespace-nowrap shrink-0"
              title="مقترحات مطور البرامج التربوية: مولد النماذج البارامترية المتكافئة A/B/C/D + مدقق كثافة A4 + تصدير Moodle XML"
            >
              <span className="font-mono text-amber-300 font-black">A/B/C/D</span>
              <span>مختبر النماذج و Moodle XML</span>
            </button>

            <div className="w-px h-4 bg-slate-200 shrink-0 mx-0.5" aria-hidden="true" />

            {/* أزرار الوصول الفوري للمقترحات العملية الأربعة الجديدة */}
            <button
              type="button"
              onClick={() => {
                setFourProposalsTab("INTERACTIVE_CF_SPLINE");
                setShowFourProposalsModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-900 hover:bg-slate-800 text-cyan-300 border-slate-800 whitespace-nowrap shrink-0"
              title="المقترح 1: محرر المنحنيات البيانية التفاعلي باللمس والماوس (C_f Interactive Spline) مع استنتاج الصيغة وجدول التغيرات"
            >
              <span className="font-serif text-cyan-300 font-black">C_f</span>
              <span>محرر المنحنى بالماوس</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFourProposalsTab("MASSAR_XLSX_STUDIO");
                setShowFourProposalsModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="المقترح 2: استيراد وتصدير مباشر لملفات منظومة «مسار» الرسمية (Excel / CSV) مع التقديرات التربوية الآلية"
            >
              <span className="font-mono text-emerald-700 font-black">.XLS</span>
              <span>مصنف مسار الرسمي</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFourProposalsTab("BIOF_ERRORS_CATALOG");
                setShowFourProposalsModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="المقترح 3: بنك الأخطاء الشائعة للمتعلمين والعوائق الإبستيمولوجية حسب كل درس (BIOF)"
            >
              <span className="font-mono text-amber-700 font-black">BIOF</span>
              <span>بنك الأخطاء الشائعة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFourProposalsTab("QR_PROGRESSIVE_HINTS");
                setShowFourProposalsModal(true);
              }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 whitespace-nowrap shrink-0"
              title="المقترح 4: مولد أوراق التصحيح الذاتي والتلميحات التدريجية بالرمز المربع (Auto-Évaluation par QR Code)"
            >
              <span className="font-mono text-indigo-700 font-black">QR</span>
              <span>تلميحات التصحيح الذاتي</span>
            </button>
          </div>
        </section>

        {/* مرصد التدقيق البيداغوجي الشامل واقتراح النقائص (Pedagogical & Technical Diagnostic Panel) */}
        <AnimatePresence initial={false}>
          {showAuditPanel && (
            <motion.section
              key="pedagogical-audit-panel"
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden no-print"
            >
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-800/60 font-serif font-black text-sm flex items-center justify-center shrink-0">
                      ∑✓
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
                        <span>المراجعة الشاملة وتدقيق المطابقة البيداغوجية واقتراح النقائص</span>
                        <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-900 border border-cyan-200">
                          {pedagogicalAuditReport.passCount}/{pedagogicalAuditReport.items.length} معايير مستوفاة ({pedagogicalAuditReport.scorePercent}%)
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        فحص آلي فوري لسلم التنقيط (20/20)، توازن المستويات المهارية (N1/N2/N3)، تناسب عدد الأسئلة مع زمن الحصة، واكتمال عناصر الإجابة وفق المذكرة 142-08 والتوجيهات التربوية 2007.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
                      title="تصدير ملف PDF مستقل لتقرير مرصد التدقيق تلقائياً فور الضغط على زر التصحيح الشامل"
                    >
                      <input
                        type="checkbox"
                        checked={autoExportAuditPdfOnFix}
                        onChange={(e) => setAutoExportAuditPdfOnFix(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-teal-700 accent-teal-700"
                      />
                      <span>تصدير PDF تلقائي عند المطابقة</span>
                    </label>

                    <button
                      type="button"
                      disabled={isExportingAuditPDF}
                      onClick={() => handleExportPedagogicalAuditPDF(false)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-teal-700 hover:bg-teal-800 text-white border border-teal-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                      title="تصدير تقرير مرصد التدقيق البيداغوجي والتقني الشامل إلى ملف PDF مستقل جاهز للطباعة والتأشير"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>
                        {isExportingAuditPDF
                          ? "جاري تصدير التقرير PDF..."
                          : "تصدير تقرير التدقيق PDF مستقل"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAutoFixAllAuditIssues}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>تصحيح جميع النقائص وموازنة الفرض بضغطة واحدة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAuditPanel(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pedagogicalAuditReport.items.map((item) => {
                    const isPass = item.status === "PASS";
                    const isWarn = item.status === "WARN";
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition ${
                          isPass
                            ? "bg-teal-50/40 border-teal-200/90"
                            : isWarn
                            ? "bg-amber-50/50 border-amber-300/90"
                            : "bg-sky-50/40 border-sky-200/90"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-black text-slate-900 leading-snug">
                              {item.title}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-black px-2 py-0.5 rounded shrink-0 ${
                                isPass
                                  ? "bg-teal-100 text-teal-900 border border-teal-300"
                                  : isWarn
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-sky-100 text-sky-900 border border-sky-300"
                              }`}
                            >
                              {isPass ? "✓ مستوفى" : isWarn ? "⚠️ تنبيه" : "💡 تحسين مقترح"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>

                        {item.onFix && item.actionLabel && (
                          <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                            <button
                              type="button"
                              onClick={item.onFix}
                              className={`px-3 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                                isPass
                                  ? "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                                  : "bg-slate-900 hover:bg-slate-800 text-cyan-300"
                              }`}
                            >
                              {item.actionLabel}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* مكون مصفوفة التخصيص ثنائية الأبعاد (2D) لتدقيق المفتش التربوي (الدروس × المهارات N1/N2/N3) */}
                {activeModule === "DS_142_08" && (
                  <SpecMatrix2DInspectorCard
                    lessons={activeCustomLessons}
                    n1={n1}
                    n2={n2}
                    n3={n3}
                    dsStructureMode={dsStructureMode}
                    isMission={isMission}
                    isFr={docLang === "FR" || isMission}
                    dsQuestionDensity={dsQuestionDensity}
                    qcmQuestionCount={qcmQuestionCount}
                    examDurationMinutes={
                      currentTrack.durationFr.includes("4")
                        ? 240
                        : currentTrack.durationFr.includes("3")
                        ? 180
                        : currentTrack.durationFr.includes("1")
                        ? 60
                        : 120
                    }
                    variant="interactive"
                    include2DSpecMatrix={include2DSpecMatrix}
                    onToggleIncludeInSheet={(val) => setInclude2DSpecMatrix(val)}
                    onApplyPresetRatios={(newN1, newN2, newN3) => {
                      setN1(newN1);
                      setN2(newN2);
                      setN3(newN3);
                      setStatusMessage({
                        type: "success",
                        text: `تم ضبط المستويات المهارية على (${newN1}% N1 · ${newN2}% N2 · ${newN3}% N3) وتحديث مصفوفة التخصيص 2D!`,
                      });
                    }}
                    onOpenBaremeModal={() => setIsBaremeModalOpen(true)}
                    onOpenAdvancedStudio2D={() => handleOpenAdvancedPedagogyStudio("SPEC_2D")}
                    trackCode={currentTrack.code}
                    trackNameAr={currentTrack.labelAr}
                    trackNameFr={currentTrack.labelFr}
                    dsKey={dsKey}
                    dsTitleAr={customDocTitle || defaultDocTitle || `الفرض المحروس ${dsKey}`}
                    dsTitleFr={`Devoir Surveillé ${dsKey} (${semester})`}
                    school={school}
                    prof={prof}
                    year={year}
                    academy={academy}
                    direction={direction}
                    onApplyAdaptiveWeightsAndExercises={
                      handleApplyAdaptiveSpecMatrixWeightsAndExercises
                    }
                  />
                )}

                {/* شريط التفعيل الفوري للمقترحات والنقائص البيداغوجية الـ 4 المدمجة في الورقة (A4) */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div className="font-black text-slate-900 flex items-center gap-1.5">
                    <span className="font-serif text-cyan-700 font-black">∂</span>
                    <span>تفعيل فوري للملاحق والمقترحات البيداغوجية في الورقة (A4):</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIncludeExamFormulaSheet((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        includeExamFormulaSheet
                          ? "bg-slate-900 text-cyan-300 border-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {includeExamFormulaSheet ? "✓ " : "+ "}تذكرة الصيغ المرجعية (Formulaire)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludeDSStudentSelfCheck((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        includeDSStudentSelfCheck
                          ? "bg-slate-900 text-cyan-300 border-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {includeDSStudentSelfCheck ? "✓ " : "+ "}شبكة تدبير الزمن والمراجعة للمترشح
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludePostExamRemediationSheet((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        includePostExamRemediationSheet
                          ? "bg-slate-900 text-cyan-300 border-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {includePostExamRemediationSheet ? "✓ " : "+ "}خطة الدعم والمعالجة الفارقية (142-08)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludeOfficialExamCoverSheet((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        includeOfficialExamCoverSheet
                          ? "bg-slate-900 text-cyan-300 border-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {includeOfficialExamCoverSheet ? "✓ " : "+ "}البطاقة التقنية والإحصائية (دفتر النصوص)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludeAnswerWorkspace((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        includeAnswerWorkspace
                          ? "bg-teal-700 text-white border-teal-800"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {includeAnswerWorkspace ? "✓ " : "+ "}حيز الإجابة الكاملة المعاير للتلميذ
                    </button>
                    <button
                      type="button"
                      onClick={() => setInclude2DSpecMatrix((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        include2DSpecMatrix
                          ? "bg-slate-900 text-cyan-300 border-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {include2DSpecMatrix ? "✓ " : "+ "}مصفوفة التخصيص ثنائية الأبعاد (2D)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludeDidacticVigilanceSheet((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        includeDidacticVigilanceSheet
                          ? "bg-slate-900 text-cyan-300 border-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {includeDidacticVigilanceSheet ? "✓ " : "+ "}بطاقة اليقظة الديداكتيكية والأخطاء الشائعة
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* استوديو محاكاة واستنساخ الفروض المحروسة المستوردة وعارض PDF التفاعلي مع حركات Framer Motion */}
        <AnimatePresence initial={false}>
          {showImportedExamStudio && (
            <motion.section
              key="imported-exam-studio-panel"
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden no-print"
            >
              <ImportedExamSimulatorPanel
                activeBlueprint={activeImportedBlueprint}
                isSimulationActive={isExamSimulationActive}
                simulationMode={examSimulationMode}
                variationSeed={examVariationSeed}
                targetTrackCode={currentTrack.code}
                trackLabel={isMission ? currentTrack.labelFr : currentTrack.labelAr}
                educationSystem={educationSystem}
                initialImportTab={importedStudioInitialTab}
                onApplySimulation={handleApplyImportedExamSimulation}
                onDisableSimulation={handleDisableImportedExamSimulation}
                onCloseStudio={() => setShowImportedExamStudio(false)}
                onExportPDF={handleExportPDF}
                onExportEvalGridExcel={handleExportEvaluationGridExcel}
                selectedAiModel={selectedAiModel}
                onInsertLessonToExam={handleInsertOfficialAnnaleExercise}
                onInsertQuestionToExam={handleInsertVerifiedWolframQuestion}
                onNotify={(type, text) => setStatusMessage({ type, text })}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* شريط وصول سريع على الجوال يبقي معاينة الورقة A4 في صدارة الشاشة ويفتح الإعدادات في درج سفلي (Bottom-Sheet Drawer) */}
        <div className="lg:hidden no-print bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileCheck2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="text-[11px] font-black text-slate-900 truncate">
              المعاينة الورقية A4 قيد التركيز المباشر
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenMobileConfigSheet(1)}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <span className="text-cyan-300 font-mono">01</span>
              <span>المسلك</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenMobileConfigSheet(2)}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <span className="text-cyan-300 font-mono">02</span>
              <span>الدروس</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenMobileConfigSheet(3)}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <span className="text-cyan-300 font-mono">03</span>
              <span>النماذج</span>
            </button>
          </div>
        </div>

        {/* خلفية معتمة للدرج السفلي على الجوال والألواح الإلكترونية */}
        {mobileConfigSheetOpen && (
          <div
            className={`${
              isConfigDeckCollapsed ? "" : "lg:hidden "
            }fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-xs no-print`}
            onClick={() => setMobileConfigSheetOpen(false)}
          />
        )}

        {/* لوحة الإعدادات الثلاثية: على الحاسوب 3 أعمدة، وعلى الجوال/اللوح درج سفلي (Bottom-Sheet Drawer) */}
        <AnimatePresence initial={false}>
          {(!isConfigDeckCollapsed || mobileConfigSheetOpen) && (
            <motion.section
              key="three-column-config-deck"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`no-print ${
                mobileConfigSheetOpen
                  ? isConfigDeckCollapsed
                    ? "fixed inset-x-0 bottom-0 z-50 bg-slate-50 rounded-t-3xl border-t border-slate-300 shadow-2xl max-h-[88vh] flex flex-col p-4 overflow-y-auto"
                    : "fixed inset-x-0 bottom-0 z-50 bg-slate-50 rounded-t-3xl border-t border-slate-300 shadow-2xl max-h-[88vh] flex flex-col p-3.5 overflow-y-auto lg:static lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:rounded-none lg:max-h-none lg:overflow-visible"
                  : "hidden lg:block overflow-hidden"
              }`}
            >
              {/* رأس الدرج السفلي وتبويبات الأعمدة الثلاثة على الجوال واللوح الإلكتروني */}
              <div
                className={`${
                  isConfigDeckCollapsed ? "" : "lg:hidden "
                }sticky top-0 z-20 bg-slate-50/95 backdrop-blur-xs pb-3 mb-3 border-b border-slate-200`}
              >
                <div
                  className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mb-2.5 cursor-pointer"
                  onClick={() => setMobileConfigSheetOpen(false)}
                />
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div>
                    <h3 className="text-xs font-black text-slate-950">
                      درج الإعدادات والضوابط البيداغوجية
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      اختر قسم الإعدادات أو أغلقه للعودة الفورية إلى معاينة الورقة A4
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileConfigSheetOpen(false)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>معاينة الورقة A4</span>
                    <span>✕</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMobileActiveColumn(1)}
                    className={`min-h-[40px] py-1.5 px-2 rounded-lg text-[11px] font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                      mobileActiveColumn === 1
                        ? "bg-slate-900 text-cyan-300 shadow-xs"
                        : "text-slate-700 hover:text-slate-950"
                    }`}
                  >
                    <span className="font-mono">01</span>
                    <span>المسلك والهوية</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActiveColumn(2)}
                    className={`min-h-[40px] py-1.5 px-2 rounded-lg text-[11px] font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                      mobileActiveColumn === 2
                        ? "bg-slate-900 text-cyan-300 shadow-xs"
                        : "text-slate-700 hover:text-slate-950"
                    }`}
                  >
                    <span className="font-mono">02</span>
                    <span>الدروس والنسب</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActiveColumn(3)}
                    className={`min-h-[40px] py-1.5 px-2 rounded-lg text-[11px] font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                      mobileActiveColumn === 3
                        ? "bg-slate-900 text-cyan-300 shadow-xs"
                        : "text-slate-700 hover:text-slate-950"
                    }`}
                  >
                    <span className="font-mono">03</span>
                    <span>النماذج والضوابط</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch">
            {/* العمود الأول: الهوية المؤسسية والمسلك الدراسي والخطوط */}
            <div className={`bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex-col justify-between max-h-[560px] ${mobileActiveColumn === 1 ? "flex" : "hidden lg:flex"}`}>
              <div className="overflow-y-auto studio-scroll space-y-4 pr-1">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-black flex items-center justify-center">
                      01
                    </span>
                    <h2 className="font-black text-slate-950 text-sm">
                      المسلك الدراسي والهوية والخطوط
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {isMission ? "AEFE · OSUI" : "AREF · المغرب"}
                  </span>
                </div>

                {/* شريط تبويبات العمود الأول لمنع التكدس العمودي وتوحيد الارتفاع مع العمودين 2 و 3 */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-[11px] font-black">
                  <button
                    type="button"
                    onClick={() => setCol1Tab("TRACK_EXAM")}
                    className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                      col1Tab === "TRACK_EXAM"
                        ? "bg-white text-slate-950 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                    <span>المسلك والفرض</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCol1Tab("IDENTITY")}
                    className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                      col1Tab === "IDENTITY"
                        ? "bg-white text-slate-950 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <School className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>المؤسسة والترويسة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCol1Tab("FONTS_PAGE")}
                    className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                      col1Tab === "FONTS_PAGE"
                        ? "bg-white text-slate-950 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                    <span>الخطوط والورقة</span>
                  </button>
                </div>

            {col1Tab === "IDENTITY" && (
              <div className="space-y-3.5">
                {!isMission && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الأكاديمية الجهوية (AREF)
                      </label>
                      <input
                        type="text"
                        value={academy}
                        onChange={(e) => setAcademy(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        المديرية الإقليمية
                      </label>
                      <input
                        type="text"
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className={isMission ? "col-span-2" : ""}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      المؤسسة / Établissement
                    </label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      الأستاذ / Professeur
                    </label>
                    <input
                      type="text"
                      value={prof}
                      onChange={(e) => setProf(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      السنة الدراسية
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold tabular-nums bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3.5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      نمط الترويسة:
                    </label>
                    <select
                      value={headerStyle}
                      onChange={(e) => setHeaderStyle(e.target.value as HeaderStyle)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50/50 font-bold text-slate-900 flex-1"
                    >
                      <option value="OFFICIAL_AREF">
                        {isMission
                          ? "الترويسة الرسمية للبعثة (AEFE / OSUI)"
                          : "الترويسة الوزارية الكاملة (AREF)"}
                      </option>
                      <option value="MODERN_COMPACT">الترويسة العصرية المدمجة</option>
                      <option value="CLASSIC_BORDERED">الترويسة الكلاسيكية المؤطرة</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeStudentBox}
                        onChange={(e) => setIncludeStudentBox(e.target.checked)}
                        className="rounded text-cyan-700 w-3.5 h-3.5"
                      />
                      <span>بيانات التلميذ والقسم</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeGradeBox}
                        onChange={(e) => setIncludeGradeBox(e.target.checked)}
                        className="rounded text-cyan-700 w-3.5 h-3.5"
                      />
                      <span>خانة النقطة والملاحظة</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTeacherLogo}
                        onChange={(e) => setIncludeTeacherLogo(e.target.checked)}
                        className="rounded text-cyan-700 w-3.5 h-3.5"
                      />
                      <span>إدراج الهوية في الترويسة</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLogoWatermark}
                        onChange={(e) => setIncludeLogoWatermark(e.target.checked)}
                        className="rounded text-cyan-700 w-3.5 h-3.5"
                      />
                      <span>علامة مائية وسط الصفحة</span>
                    </label>
                    {isMission && (
                      <>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={calculatorAllowed}
                            onChange={(e) => setCalculatorAllowed(e.target.checked)}
                            className="rounded text-cyan-700 w-3.5 h-3.5"
                          />
                          <span>الحاسبة مسموحة</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeCompetencies}
                            onChange={(e) => setIncludeCompetencies(e.target.checked)}
                            className="rounded text-cyan-700 w-3.5 h-3.5"
                          />
                          <span>الكفايات الـ 6 (BOEN)</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* محدد التوجيهات والتعليمات الرسمية لإجراء الفروض المحروسة والامتحانات (المذكرة 142-08) */}
                <ExamConsignesSelector
                  selectedConsigneKeys={selectedConsigneKeys}
                  onChangeConsigneKeys={setSelectedConsigneKeys}
                  isFr={isMission || docLang === "FR"}
                />
              </div>
            )}

            {col1Tab === "FONTS_PAGE" && (
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-cyan-800 shrink-0" />
                    <span className="text-xs font-black text-slate-950">
                      التنسيق والتحكم في الخطوط والورقة
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold text-cyan-800">
                    {DOC_FONT_OPTIONS.find((f) => f.id === docFontFamily)?.shortAr || "خط أكاديمي"}
                  </span>
                </div>

                {/* قائمة اختيار الخط الرئيسي (أكاديمي / يدوي) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    نوع خط الوثيقة (الأكاديمي وخطوط الكتابة باليد):
                  </label>
                  <select
                    value={docFontFamily}
                    onChange={(e) => setDocFontFamily(e.target.value as DocFontFamily)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  >
                    <optgroup label="الخطوط الأكاديمية والرسمية المطبوعة">
                      {DOC_FONT_OPTIONS.filter((f) => !f.isHandwritten).map((fontOpt) => (
                        <option key={fontOpt.id} value={fontOpt.id}>
                          {fontOpt.labelAr}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="✍️ خطوط الكتابة باليد (Handwriting Fonts)">
                      {DOC_FONT_OPTIONS.filter((f) => f.isHandwritten).map((fontOpt) => (
                        <option key={fontOpt.id} value={fontOpt.id}>
                          {fontOpt.labelAr}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* أزرار التبديل السريع لخطوط الكتابة باليد */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-700">
                      ✍️ وصول سريع لخطوط الكتابة باليد:
                    </span>
                    {DOC_FONT_OPTIONS.find((f) => f.id === docFontFamily)?.isHandwritten && (
                      <button
                        type="button"
                        onClick={() => setDocFontFamily("ACADEMIC_SERIF")}
                        className="text-[10px] font-bold text-cyan-800 hover:text-slate-950 underline cursor-pointer"
                      >
                        إعادة للخط الأكاديمي
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DOC_FONT_OPTIONS.filter((f) => f.isHandwritten).map((fontOpt) => {
                      const active = docFontFamily === fontOpt.id;
                      return (
                        <button
                          key={fontOpt.id}
                          type="button"
                          onClick={() => setDocFontFamily(fontOpt.id)}
                          className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-right truncate cursor-pointer ${
                            active
                              ? "bg-slate-900 text-cyan-300 border-slate-900 font-black shadow-2xs"
                              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {fontOpt.shortAr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* قوالب الخطوط التقليدية لتبويبات العناوين والترويسة المغربية الرسمية */}
                <div className="border-t border-slate-200/90 pt-2.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-black text-indigo-950 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-amber-900 text-amber-200 flex items-center justify-center font-serif text-[10px] font-black">
                        ق
                      </span>
                      <span>قوالب الخطوط التقليدية لتبويبات العناوين:</span>
                    </label>
                    {appliedTitleCalligraphy.fontId !== "DEFAULT_DOC" && (
                      <button
                        type="button"
                        onClick={() =>
                          setAppliedTitleCalligraphy({
                            fontId: "DEFAULT_DOC",
                            scale: "BALANCED",
                            ornament: "NONE",
                            scope: "HEADER_TITLES",
                          })
                        }
                        className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer"
                      >
                        إعادة للخط القياسي
                      </button>
                    )}
                  </div>

                  <select
                    value={appliedTitleCalligraphy.fontId}
                    onChange={(e) => {
                      const nextFontId = e.target.value as TraditionalTitleFontId;
                      const fontOpt = TRADITIONAL_TITLE_FONT_OPTIONS.find(
                        (f) => f.id === nextFontId
                      );
                      const nextOrnament =
                        fontOpt?.recommendedOrnament ??
                        (nextFontId === "DEFAULT_DOC" ? "NONE" : appliedTitleCalligraphy.ornament);
                      const nextScale = fontOpt?.recommendedScale ?? appliedTitleCalligraphy.scale;
                      setAppliedTitleCalligraphy((prev) => ({
                        ...prev,
                        fontId: nextFontId,
                        ornament: nextOrnament,
                        scale: nextScale,
                      }));
                      if (fontOpt?.moroccanHeaderFramePreset && !isMission) {
                        setHeaderStyle("OFFICIAL_AREF");
                      }
                      setStatusMessage({
                        type: "success",
                        text:
                          nextFontId === "DEFAULT_DOC"
                            ? "تمت استعادة خط العناوين القياسي للوثيقة."
                            : `تم اعتماد قالب «${fontOpt?.nameAr}» لتبويبات العناوين مع ضبط التباعد (${fontOpt?.letterSpacing || "0.01em"}) والزخرفة الخاصة بالترويسة المغربية الرسمية!`,
                      });
                    }}
                    className="w-full border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    {TRADITIONAL_TITLE_FONT_OPTIONS.map((tFont) => (
                      <option key={tFont.id} value={tFont.id}>
                        {tFont.id === "ANDALUSI_MAGHRIBI_SCRIPT"
                          ? `🇲🇦 ${tFont.nameAr} — متناغم مع الترويسة المغربية`
                          : tFont.nameAr}
                      </option>
                    ))}
                  </select>

                  {/* قسم إعدادات الخط الأندلسي المغربي (Maghribi Script): زر التفعيل + زر تبديل الزخرفة (Toggle) مع أيقونة مصغرة + شريط تمرير التباعد الأفقي بين الحروف (Letter Spacing Slider) */}
                  {(() => {
                    const isMoroccanOrnamentEnabled =
                      appliedTitleCalligraphy.enableMoroccanHeaderOrnament ?? true;
                    const activeOrnamentForPreview =
                      appliedTitleCalligraphy.ornament === "NONE" && isMoroccanOrnamentEnabled
                        ? "ANDALUSI_MOROCCAN"
                        : appliedTitleCalligraphy.ornament;
                    const ornamentMiniMeta = getTitleOrnamentMiniPreview(
                      activeOrnamentForPreview,
                      isMoroccanOrnamentEnabled && appliedTitleCalligraphy.ornament !== "NONE"
                    );
                    const currentSpacingEm =
                      appliedTitleCalligraphy.customLetterSpacingEm ?? 0.025;

                    return (
                      <div className="bg-amber-50/85 border border-amber-200/90 rounded-xl p-2.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAppliedTitleCalligraphy({
                                fontId: "ANDALUSI_MAGHRIBI_SCRIPT",
                                scale: "BALANCED",
                                ornament: "ANDALUSI_MOROCCAN",
                                scope: "HEADER_TITLES",
                                enableMoroccanHeaderOrnament: true,
                                customLetterSpacingEm: 0.025,
                              });
                              if (!isMission) {
                                setHeaderStyle("OFFICIAL_AREF");
                              }
                              setStatusMessage({
                                type: "success",
                                text: "تم تفعيل «الخط الأندلسي المغربي (Maghribi Script)» مع ضبط إعدادات التباعد والزخرفة الأندلسية ❁ ﴾ ... ﴿ ❁ ليتناسب مع الترويسة المغربية الرسمية!",
                              });
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] font-black border transition flex items-center justify-between cursor-pointer ${
                              appliedTitleCalligraphy.fontId === "ANDALUSI_MAGHRIBI_SCRIPT"
                                ? "bg-slate-900 text-amber-300 border-slate-900 shadow-2xs"
                                : "bg-white hover:bg-amber-100/70 text-amber-950 border-amber-300"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>❁</span>
                              <span>الخط الأندلسي المغربي (Maghribi Script)</span>
                            </span>
                            <span className="text-[10px] font-mono">
                              {appliedTitleCalligraphy.fontId === "ANDALUSI_MAGHRIBI_SCRIPT"
                                ? "✓ مفعّل للترويسة"
                                : "تفعيل فوري"}
                            </span>
                          </button>
                        </div>

                        {/* 1. زر تبديل (Toggle) لتفعيل أو إلغاء الزخرفة الخاصة بالترويسة المغربية مع أيقونة مصغرة توضح شكل الزخرفة */}
                        <div className="bg-white/95 border border-amber-200 rounded-lg p-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              title={`أيقونة مصغرة توضح شكل الزخرفة المختارة: ${ornamentMiniMeta.descriptionAr}`}
                              className={`inline-flex items-center justify-center px-2 py-1 rounded-md font-serif text-[11px] font-black border shrink-0 transition ${
                                isMoroccanOrnamentEnabled &&
                                appliedTitleCalligraphy.ornament !== "NONE"
                                  ? "bg-amber-950 text-amber-300 border-amber-700 shadow-2xs"
                                  : "bg-slate-100 text-slate-500 border-slate-300"
                              }`}
                            >
                              {ornamentMiniMeta.miniIconGlyph}
                            </span>
                            <div className="min-w-0">
                              <div className="text-[10.5px] font-black text-slate-900 truncate">
                                زخرفة الترويسة المغربية ({ornamentMiniMeta.shortBadgeAr})
                              </div>
                              <div className="text-[9.5px] text-slate-600 truncate">
                                {isMoroccanOrnamentEnabled &&
                                appliedTitleCalligraphy.ornament !== "NONE"
                                  ? "مفعّلة في الترويسة المغربية"
                                  : "معطّلة (نص صافي بدون زخرفة)"}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            role="switch"
                            aria-checked={
                              isMoroccanOrnamentEnabled &&
                              appliedTitleCalligraphy.ornament !== "NONE"
                            }
                            onClick={() => {
                              const currentlyActive =
                                isMoroccanOrnamentEnabled &&
                                appliedTitleCalligraphy.ornament !== "NONE";
                              const nextEnabled = !currentlyActive;
                              setAppliedTitleCalligraphy((prev) => ({
                                ...prev,
                                enableMoroccanHeaderOrnament: nextEnabled,
                                ornament:
                                  nextEnabled && prev.ornament === "NONE"
                                    ? "ANDALUSI_MOROCCAN"
                                    : prev.ornament,
                              }));
                              setStatusMessage({
                                type: "info",
                                text: nextEnabled
                                  ? "تم تفعيل الزخرفة الأندلسية الخاصة بالترويسة المغربية ❁ ﴾ ... ﴿ ❁ في المعاينة الحية."
                                  : "تم إلغاء الزخرفة الخاصة بالترويسة المغربية مع الاحتفاظ بالخط المختار.",
                              });
                            }}
                            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isMoroccanOrnamentEnabled &&
                              appliedTitleCalligraphy.ornament !== "NONE"
                                ? "bg-amber-700"
                                : "bg-slate-300"
                            }`}
                            title="تفعيل أو إلغاء الزخرفة الخاصة بالترويسة المغربية"
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                isMoroccanOrnamentEnabled &&
                                appliedTitleCalligraphy.ornament !== "NONE"
                                  ? "-translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {/* 2. شريط تمرير (Slider) للتحكم الدقيق في التباعد الأفقي بين الحروف (Letter Spacing) للترويسة مع تحديث المعاينة فورياً */}
                        <div className="bg-white/95 border border-amber-200 rounded-lg p-2 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <label
                              htmlFor="sidebar-andalusi-letter-spacing"
                              className="text-[10.5px] font-black text-slate-800 flex items-center gap-1"
                            >
                              <Sliders className="w-3 h-3 text-amber-800" />
                              <span>التباعد الأفقي للحروف (Letter Spacing):</span>
                            </label>
                            <div className="flex items-center gap-1">
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 font-mono text-[10px] font-black border border-amber-300">
                                {currentSpacingEm.toFixed(3)}em
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAppliedTitleCalligraphy((prev) => ({
                                    ...prev,
                                    customLetterSpacingEm: 0.025,
                                  }))
                                }
                                className="text-[9.5px] font-bold text-amber-800 hover:underline cursor-pointer"
                                title="إعادة ضبط التباعد الأفقي إلى القيمة المعيارية (0.025em)"
                              >
                                قياسي
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-slate-500">0.00</span>
                            <input
                              id="sidebar-andalusi-letter-spacing"
                              type="range"
                              min={0}
                              max={0.12}
                              step={0.005}
                              value={currentSpacingEm}
                              onChange={(e) => {
                                const nextVal = parseFloat(e.target.value);
                                setAppliedTitleCalligraphy((prev) => ({
                                  ...prev,
                                  customLetterSpacingEm: nextVal,
                                }));
                              }}
                              className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
                            />
                            <span className="text-[9px] font-mono text-slate-500">0.12em</span>
                          </div>
                        </div>

                        {/* شريط اختيار الإطار الهندسي الشعاعي SVG للترويسة المغربية */}
                        <div className="bg-white/95 border border-amber-200 rounded-lg p-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-black text-slate-800">
                            <span>الإطار الزخرفي الشعاعي للترويسة (SVG):</span>
                            <span className="text-[9px] text-amber-800 font-bold">Vector 300 DPI</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {MOROCCAN_HEADER_SVG_FRAME_OPTIONS.map((frameOpt) => {
                              const currentSvgFrame =
                                appliedTitleCalligraphy.svgHeaderFrame || "ZELLIGE_FEZ";
                              const isSelected = currentSvgFrame === frameOpt.id;
                              return (
                                <button
                                  key={frameOpt.id}
                                  type="button"
                                  onClick={() =>
                                    setAppliedTitleCalligraphy((prev) => ({
                                      ...prev,
                                      svgHeaderFrame: frameOpt.id,
                                    }))
                                  }
                                  className={`px-2 py-1 rounded border text-[9.5px] font-bold text-right transition cursor-pointer ${
                                    isSelected
                                      ? "bg-amber-900 text-amber-100 border-amber-950 font-black"
                                      : "bg-amber-50/60 hover:bg-amber-100/70 text-slate-800 border-amber-200"
                                  }`}
                                >
                                  {frameOpt.shortAr}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[10px] text-amber-900/90 font-mono px-0.5">
                          <span>تباعد الحروف: {currentSpacingEm.toFixed(3)}em · الكلمات: 0.14em</span>
                          <span>الزخرفة: {ornamentMiniMeta.miniIconGlyph} (AREF)</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* حجم الخط واتجاه الورقة في صف واحد */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                      حجم الخط:
                    </label>
                    <div className="grid grid-cols-3 gap-0.5 bg-white p-0.5 rounded-lg border border-slate-300 text-[10.5px] font-bold">
                      {(
                        [
                          { id: "COMPACT", label: "صغير" },
                          { id: "NORMAL", label: "عادي" },
                          { id: "LARGE", label: "كبير" },
                        ] as const
                      ).map((sizeOpt) => (
                        <button
                          key={sizeOpt.id}
                          type="button"
                          onClick={() => setDocFontSize(sizeOpt.id)}
                          className={`py-1 rounded-md transition cursor-pointer ${
                            docFontSize === sizeOpt.id
                              ? "bg-slate-900 text-cyan-300 font-black"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {sizeOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                      اتجاه الورقة (A4):
                    </label>
                    <div className="grid grid-cols-2 gap-0.5 bg-white p-0.5 rounded-lg border border-slate-300 text-[10.5px] font-bold">
                      <button
                        type="button"
                        onClick={() => setPageOrientation("PORTRAIT")}
                        className={`py-1 rounded-md transition flex items-center justify-center gap-1 cursor-pointer ${
                          pageOrientation === "PORTRAIT"
                            ? "bg-slate-900 text-cyan-300 font-black"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <RectangleVertical className="w-3 h-3" />
                        <span>عمودي</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPageOrientation("LANDSCAPE")}
                        className={`py-1 rounded-md transition flex items-center justify-center gap-1 cursor-pointer ${
                          pageOrientation === "LANDSCAPE"
                            ? "bg-slate-900 text-cyan-300 font-black"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <RectangleHorizontal className="w-3 h-3" />
                        <span>أفقي</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* محاكي استعلامات الطباعة الفوري (@media print & @page Simulator: A4 / Letter / Custom + Page Break Boundaries) */}
                {(() => {
                  const activeMargins =
                    customPageMarginsMm ||
                    resolveAutoDocViewMarginModel(activeModule, dmSubType);
                  const livePrintMetrics = computePrintMediaQueryMetrics({
                    preset: printPageSizePreset,
                    orientation: pageOrientation,
                    customWidthMm: customPageWidthMm,
                    customHeightMm: customPageHeightMm,
                    marginTopMm: activeMargins.topMm,
                    marginBottomMm: activeMargins.bottomMm,
                    marginXMm: activeMargins.xMm,
                  });

                  return (
                    <div className="bg-slate-950 text-white rounded-xl p-3 space-y-2.5 border border-cyan-500/40 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Printer className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-[11px] font-black text-cyan-200">
                            محاكي استعلامات الطباعة الفوري (@media print &amp; @page)
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[9.5px] font-bold">
                          {livePrintMetrics.widthMm}×{livePrintMetrics.heightMm}mm
                        </span>
                      </div>

                      {/* التبديل بين مقاسات @page (A4 / Letter / Custom) */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          مقاس الورقة في قاعدة @page (A4 · Letter · Custom):
                        </label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                          {(
                            [
                              {
                                id: "A4" as PrintPageSizePreset,
                                title: "A4 القياسي",
                                sub: "210×297mm",
                              },
                              {
                                id: "LETTER" as PrintPageSizePreset,
                                title: "US Letter",
                                sub: "215.9×279.4mm",
                              },
                              {
                                id: "CUSTOM" as PrintPageSizePreset,
                                title: "مخصص Custom",
                                sub: `${customPageWidthMm}×${customPageHeightMm}mm`,
                              },
                            ] as const
                          ).map((item) => {
                            const active = printPageSizePreset === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setPrintPageSizePreset(item.id);
                                  setShowA4LivePageBreaks(true);
                                  if (viewMode === "CODE") {
                                    setViewMode("PREVIEW");
                                  }
                                }}
                                className={`py-1.5 px-1.5 rounded-md transition flex flex-col items-center justify-center cursor-pointer border ${
                                  active
                                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-2xs"
                                    : "bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800"
                                }`}
                              >
                                <span className="text-[10.5px] leading-tight">
                                  {item.title}
                                </span>
                                <span
                                  dir="ltr"
                                  className={`font-mono text-[9px] ${
                                    active ? "text-slate-900" : "text-slate-400"
                                  }`}
                                >
                                  {item.sub}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* أبعاد المقاس المخصص (Custom @page size) */}
                      {printPageSizePreset === "CUSTOM" && (
                        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 space-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-amber-300">
                              أبعاد @page المخصصة (بالمليمتر mm):
                            </span>
                            <div className="flex items-center gap-1 font-mono text-[9px]">
                              {[
                                { label: "A5", w: 148, h: 210 },
                                { label: "B5", w: 176, h: 250 },
                                { label: "Legal", w: 216, h: 356 },
                              ].map((q) => (
                                <button
                                  key={q.label}
                                  type="button"
                                  onClick={() => {
                                    setCustomPageWidthMm(q.w);
                                    setCustomPageHeightMm(q.h);
                                    setShowA4LivePageBreaks(true);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-200 border border-slate-700 transition cursor-pointer"
                                >
                                  {q.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="flex justify-between text-[9.5px] text-slate-300 mb-0.5">
                                <span>العرض (Width):</span>
                                <span className="font-mono text-cyan-300 font-bold">
                                  {customPageWidthMm}mm
                                </span>
                              </label>
                              <input
                                type="range"
                                min={140}
                                max={320}
                                step={1}
                                value={customPageWidthMm}
                                onChange={(e) => {
                                  setCustomPageWidthMm(Number(e.target.value));
                                  setShowA4LivePageBreaks(true);
                                }}
                                className="w-full h-1.5 bg-slate-700 rounded-lg accent-cyan-400 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="flex justify-between text-[9.5px] text-slate-300 mb-0.5">
                                <span>الارتفاع (Height):</span>
                                <span className="font-mono text-cyan-300 font-bold">
                                  {customPageHeightMm}mm
                                </span>
                              </label>
                              <input
                                type="range"
                                min={180}
                                max={420}
                                step={1}
                                value={customPageHeightMm}
                                onChange={(e) => {
                                  setCustomPageHeightMm(Number(e.target.value));
                                  setShowA4LivePageBreaks(true);
                                }}
                                className="w-full h-1.5 bg-slate-700 rounded-lg accent-cyan-400 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* أزرار إظهار حدود فواصل الصفحات (Page Break Boundaries) وتفعيل محاكاة @media print */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowA4LivePageBreaks((v) => !v);
                            if (viewMode === "CODE") setViewMode("PREVIEW");
                          }}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-black border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            showA4LivePageBreaks || simulatePrintMediaQuery
                              ? "bg-amber-400 text-slate-950 border-amber-300 shadow-2xs"
                              : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
                          }`}
                        >
                          <Layers className="w-3 h-3 shrink-0" />
                          <span>
                            {showA4LivePageBreaks || simulatePrintMediaQuery
                              ? "حدود فواصل الصفحات: مرئية"
                              : "إظهار حدود فواصل الصفحات"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSimulatePrintMediaQuery((prev) => {
                              const next = !prev;
                              if (next) setShowA4LivePageBreaks(true);
                              return next;
                            });
                            if (viewMode === "CODE") setViewMode("PREVIEW");
                          }}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-black border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            simulatePrintMediaQuery
                              ? "bg-emerald-400 text-slate-950 border-emerald-300 shadow-2xs"
                              : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
                          }`}
                        >
                          <Eye className="w-3 h-3 shrink-0" />
                          <span>
                            {simulatePrintMediaQuery
                              ? "محاكاة @media print: نشطة"
                              : "محاكاة @media print الحية"}
                          </span>
                        </button>
                      </div>

                      {/* سطر الكود الفوري لقاعدة @page ومقاييس القطع */}
                      <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                          <span>حيز الطباعة الآمن: {livePrintMetrics.printableWidthMm}×{livePrintMetrics.printableHeightMm}mm</span>
                          <span className="text-cyan-300">
                            فاصل القطع: ~{livePrintMetrics.pageBreakIntervalPx}px
                          </span>
                        </div>
                        <code
                          dir="ltr"
                          className="block text-[9.5px] font-mono text-amber-300 truncate"
                          title={livePrintMetrics.cssPageRule}
                        >
                          {livePrintMetrics.cssPageRule}
                        </code>
                      </div>
                    </div>
                  );
                })()}

                {/* خيار خط اليد للتصحيح وعناصر الإجابة فقط */}
                <label className="flex items-center gap-2 pt-1 text-[11px] font-bold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={handwrittenSolutionsOnly}
                    onChange={(e) => setHandwrittenSolutionsOnly(e.target.checked)}
                    className="rounded text-cyan-700 w-3.5 h-3.5 accent-cyan-700"
                  />
                  <span>✍️ تطبيق خط اليد على عناصر الإجابة والتصحيح فقط</span>
                </label>

                {/* حزم تنسيق LaTeX وتخصيص حزمة tcolorbox للمسائل الرياضية المعقدة */}
                <div className="border-t border-slate-200/90 pt-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-black text-indigo-950 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      <span>حزمة تأطير المسائل والتمارين (LaTeX Package):</span>
                    </label>
                    <span className="font-mono text-[10px] font-bold text-indigo-800">
                      {LATEX_PACKAGE_OPTIONS.find((p) => p.id === latexPackageTheme)?.badge}
                    </span>
                  </div>

                  <select
                    value={latexPackageTheme}
                    onChange={(e) => setLatexPackageTheme(e.target.value as LatexPackageTheme)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    {LATEX_PACKAGE_OPTIONS.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.labelAr}
                      </option>
                    ))}
                  </select>

                  {latexPackageTheme === "TCOLORBOX" && (
                    <div className="bg-indigo-50/60 border border-indigo-200/90 rounded-xl p-2.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-black text-indigo-950">
                          🎨 إعدادات حزمة tcolorbox للمسائل الرياضية المعقدة:
                        </span>
                        <code
                          dir="ltr"
                          className="font-mono text-[9.5px] bg-white text-indigo-900 border border-indigo-200 px-1.5 py-0.5 rounded"
                        >
                          \newtcolorbox&#123;problemeComplexeBox&#125;
                        </code>
                      </div>

                      {/* لوحة الألوان الأكاديمية لـ tcolorbox */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          لوحة ألوان الإطار والترويسة (colframe / colbacktitle):
                        </label>
                        <div className="grid grid-cols-1 gap-1">
                          {TCOLORBOX_PALETTE_OPTIONS.map((pal) => {
                            const active = tcolorboxConfig.palette === pal.id;
                            return (
                              <button
                                key={pal.id}
                                type="button"
                                onClick={() =>
                                  setTcolorboxConfig((prev) => ({
                                    ...prev,
                                    palette: pal.id,
                                  }))
                                }
                                className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition flex items-center justify-between cursor-pointer ${
                                  active
                                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full inline-block border border-white/60 shrink-0"
                                    style={{ backgroundColor: pal.swatchHex }}
                                  />
                                  <span>{pal.labelAr}</span>
                                </span>
                                <code
                                  dir="ltr"
                                  className={`font-mono text-[9.5px] ${
                                    active ? "text-cyan-300" : "text-slate-500"
                                  }`}
                                >
                                  {pal.latexColFrame}
                                </code>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* درجة التظليل الخلفي (colback) ونمط الحواف */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">
                            كثافة التظليل الخلفي (colback):
                          </label>
                          <div className="grid grid-cols-4 gap-1 bg-white p-0.5 rounded-lg border border-slate-300">
                            {TCOLORBOX_SHADING_OPTIONS.map((sh) => (
                              <button
                                key={sh.id}
                                type="button"
                                onClick={() =>
                                  setTcolorboxConfig((prev) => ({
                                    ...prev,
                                    shading: sh.id,
                                  }))
                                }
                                title={sh.labelAr}
                                className={`py-1 rounded font-mono text-[10px] font-bold transition cursor-pointer ${
                                  tcolorboxConfig.shading === sh.id
                                    ? "bg-indigo-900 text-amber-300 font-black"
                                    : "text-slate-600 hover:text-slate-950"
                                }`}
                              >
                                {sh.percentLabel}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">
                            هندسة الإطار والحواف:
                          </label>
                          <select
                            value={tcolorboxConfig.frameStyle}
                            onChange={(e) =>
                              setTcolorboxConfig((prev) => ({
                                ...prev,
                                frameStyle: e.target.value as TcolorboxCustomConfig["frameStyle"],
                              }))
                            }
                            className="w-full border border-slate-300 rounded-lg px-2 py-1 text-[10.5px] bg-white font-bold text-slate-900"
                          >
                            {TCOLORBOX_FRAME_OPTIONS.map((fr) => (
                              <option key={fr.id} value={fr.id}>
                                {fr.labelAr}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 pt-0.5 text-[10.5px] font-bold text-indigo-950 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tcolorboxConfig.applyToComplexProblems}
                          onChange={(e) =>
                            setTcolorboxConfig((prev) => ({
                              ...prev,
                              applyToComplexProblems: e.target.checked,
                            }))
                          }
                          className="rounded text-indigo-700 w-3.5 h-3.5 accent-indigo-700"
                        />
                        <span>
                          تخصيص صندوق مزدوج للمسائل الرياضية التوليفية المعقدة (Problème de Synthèse)
                        </span>
                      </label>
                    </div>
                  )}

                  {/* ميزة التدرج اللوني للنصوص والترويسات حسب تخصص المادة (التحليل، الهندسة، الجبر، الاحتمالات) */}
                  <div className="border-t border-slate-200/90 pt-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-[11px] font-black text-indigo-950 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableBranchColorGradient}
                          onChange={(e) =>
                            setEnableBranchColorGradient(e.target.checked)
                          }
                          className="rounded text-indigo-700 w-4 h-4 accent-indigo-700"
                        />
                        <span>
                          🌈 تفعيل التدرج اللوني للنصوص والترويسات حسب تخصص المادة
                        </span>
                      </label>
                      <span className="font-mono text-[9.5px] font-bold text-indigo-700">
                        Specialty Gradient
                      </span>
                    </div>

                    {enableBranchColorGradient && (
                      <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-2.5 space-y-2">
                        <div className="text-[10px] font-bold text-slate-600">
                          اختر نمط التدرج اللوني للترويسة وعناوين التمارين:
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setBranchColorMode("AUTO_BY_LESSON")}
                            className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition flex items-center justify-between cursor-pointer ${
                              branchColorMode === "AUTO_BY_LESSON"
                                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 rounded-full inline-block bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 border border-white/60 shrink-0" />
                              <span>
                                تلقائي ذكي حسب فرع كل تمرين (الأزرق للتحليل · الأخضر للهندسة · العنبري للجبر)
                              </span>
                            </span>
                            <span className="font-mono text-[9.5px] opacity-80">
                              Auto
                            </span>
                          </button>

                          {(
                            Object.values(BRANCH_COLOR_THEMES) as Array<
                              (typeof BRANCH_COLOR_THEMES)[keyof typeof BRANCH_COLOR_THEMES]
                            >
                          ).map((theme) => {
                            const active = branchColorMode === theme.id;
                            return (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => setBranchColorMode(theme.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition flex items-center justify-between cursor-pointer ${
                                  active
                                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className="w-3.5 h-3.5 rounded-full inline-block border border-white/60 shrink-0"
                                    style={{
                                      backgroundImage: theme.titleGradientCss,
                                    }}
                                  />
                                  <span>{theme.labelAr}</span>
                                </span>
                                <span
                                  className="text-[9.5px] font-mono px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: theme.softBgHex,
                                    color: theme.accentColorHex,
                                  }}
                                >
                                  {theme.branchBadgeAr}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* تصفية حسب السلك واختيار المسلك وإعدادات الفرض */}
            {col1Tab === "TRACK_EXAM" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المستوى الدراسي:
                </label>
                <div
                  className={`grid gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold ${
                    isMission ? "grid-cols-6" : "grid-cols-4"
                  }`}
                >
                  {isMission ? (
                    (
                      [
                        { id: "ALL", label: "الكل" },
                        { id: "2NDE", label: "2nde" },
                        { id: "1ERE_SPE", label: "1ère Spé" },
                        { id: "TERM_SPE", label: "Tle Spé" },
                        { id: "TERM_EXP", label: "Expertes" },
                        { id: "TERM_COMPL", label: "Compl." },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCycleFilter(item.id)}
                        className={`py-1.5 rounded-md transition whitespace-nowrap text-center ${
                          cycleFilter === item.id
                            ? "bg-white text-blue-950 shadow-2xs font-black"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))
                  ) : (
                    (
                      [
                        { id: "ALL", label: "الكل" },
                        { id: "TC", label: "الجذوع" },
                        { id: "1BAC", label: "1 باك" },
                        { id: "2BAC", label: "2 باك" },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCycleFilter(item.id)}
                        className={`py-1.5 rounded-md transition whitespace-nowrap ${
                          cycleFilter === item.id
                            ? "bg-white text-indigo-950 shadow-2xs font-black"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMission
                    ? "الشعبة والتخصص (Programme Français) :"
                    : "الشعبة / المسلك الرسمي:"}
                </label>
                <select
                  value={selectedTrackCode}
                  onChange={(e) => setSelectedTrackCode(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-slate-50/50 font-black text-indigo-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {filteredTracks.map((t) => (
                    <option key={t.code} value={t.code}>
                      {isMission
                        ? t.labelFr
                        : `[${t.cycleAr}] ${docLang === "FR" ? t.labelFr : t.labelAr}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* خيارات الفرض المحروس وفق المنهاج المغربي (142-08) */}
              {activeModule === "DS_142_08" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الدورة (Semestre)
                      </label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value as SemesterType)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/50 font-bold"
                      >
                        <option value="S1">Semestre 1 (الدورة 1)</option>
                        <option value="S2">Semestre 2 (الدورة 2)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        رقم الفرض / DS
                      </label>
                      <select
                        value={dsKey}
                        onChange={(e) => setDsKey(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/50 font-bold tabular-nums"
                      >
                        {availableDSKeys.map((k) => (
                          <option key={k} value={k}>
                            {k} ({currentTrack.durationFr})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-2.5 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-black text-indigo-950 mb-1">
                        {isMission
                          ? "🇫🇷 بنية الفرض المحروس (Devoir Surveillé & QCM AEFE) :"
                          : "🇲🇦 هندسة الفرض المحروس (وفق المذكرة 142-08 والأطر المرجعية):"}
                      </label>
                      <select
                        value={dsStructureMode}
                        onChange={(e) =>
                          setDsStructureMode(e.target.value as MoroccanDSStructureMode)
                        }
                        className="w-full border border-indigo-300 rounded-lg p-2 text-xs bg-white font-bold text-slate-900"
                      >
                        <option value="STANDARD_142_08">
                          1. البنية الكلاسيكية (تمارين مستقلة متدرجة N1/N2/N3)
                        </option>
                        <option value="QCM_ET_EXERCICES">
                          2. بنية مدمجة (تمرين أسئلة متعددة الاختيارات QCM + تمارين موضوعاتية)
                        </option>
                        <option value="EXERCICES_ET_PROBLEME">
                          3. بنية موسعة (تمارين + مسألة توليفية شاملة Partie I/II/III)
                        </option>
                        <option value="COMPLETE_EXAM_MAROC">
                          4. فرض شامل متكامل (QCM + تمارين + مسألة توليفية شاملة)
                        </option>
                        <option value="EXAMEN_BLANC_2BAC">
                          5. الامتحان التجريبي للبكالوريا (Examen Blanc 2BAC — الإطار المرجعي الوطني)
                        </option>
                      </select>
                    </div>

                    {/* بطاقة الأطر المرجعية للامتحان التجريبي للبكالوريا (Examen Blanc 2BAC) */}
                    {dsStructureMode === "EXAMEN_BLANC_2BAC" && (() => {
                      const bacSpec = getExamenBlanc2BacConfig(currentTrack.code);
                      return (
                        <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-2.5 space-y-2 text-[11px]">
                          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-amber-200 pb-1.5">
                            <span className="font-black text-amber-950">
                              🎓 {bacSpec.cadreReferenceTitleAr}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-100 font-mono text-[10px] font-black">
                              {bacSpec.officialDurationAr} · المعامل {bacSpec.coefficient}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {bacSpec.domains.map((dom, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between gap-2 bg-white/90 border border-amber-200/80 rounded-lg px-2 py-1 text-[10.5px]"
                              >
                                <span className="font-bold text-slate-800 truncate">
                                  {dom.domainAr}
                                </span>
                                <span className="font-mono font-black text-amber-900 shrink-0">
                                  {dom.targetPoints} ن ({dom.percentage}%)
                                </span>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setN1(30);
                              setN2(50);
                              setN3(20);
                              setCustomDocTitle(
                                `الامتحان التجريبي الموحد للبكالوريا (${currentTrack.labelAr})`
                              );
                              setCustomDocSubtitle(
                                `المدة: ${bacSpec.officialDurationAr} — المعامل: ${bacSpec.coefficient}`
                              );
                              setDiagDuration(bacSpec.officialDurationFr);
                            }}
                            className="w-full py-1.5 px-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-black text-[10.5px] transition cursor-pointer shadow-2xs"
                          >
                            ⚡ ضبط العنوان والمدة والمستويات المهارية (30% / 50% / 20%) وفق الإطار المرجعي
                          </button>
                        </div>
                      );
                    })()}

                    {/* قسم تطوير وإدراج أسئلة الاختيار من متعدد (QCM) في الفروض المحروسة */}
                    <div className="bg-white border border-indigo-200 rounded-xl p-2.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-[11px] font-black text-indigo-950 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              dsStructureMode === "QCM_ET_EXERCICES" ||
                              dsStructureMode === "COMPLETE_EXAM_MAROC"
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDsStructureMode(
                                  dsStructureMode === "EXERCICES_ET_PROBLEME"
                                    ? "COMPLETE_EXAM_MAROC"
                                    : "QCM_ET_EXERCICES"
                                );
                              } else {
                                setDsStructureMode(
                                  dsStructureMode === "COMPLETE_EXAM_MAROC"
                                    ? "EXERCICES_ET_PROBLEME"
                                    : "STANDARD_142_08"
                                );
                              }
                            }}
                            className="rounded text-indigo-700 w-4 h-4 accent-indigo-700"
                          />
                          <span>
                            ☑️ إدراج تمرين أسئلة متعددة الاختيارات (QCM — 4 خيارات أ/ب/ج/د)
                          </span>
                        </label>
                        <span className="font-mono text-[10px] font-bold bg-indigo-100 text-indigo-950 px-2 py-0.5 rounded">
                          {qcmQuestionCount} أسئلة · {qcmQuestionCount}.0 ن
                        </span>
                      </div>

                      {(dsStructureMode === "QCM_ET_EXERCICES" ||
                        dsStructureMode === "COMPLETE_EXAM_MAROC") && (
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                                عدد أسئلة QCM:
                              </label>
                              <select
                                value={qcmQuestionCount}
                                onChange={(e) =>
                                  setQcmQuestionCount(Number(e.target.value))
                                }
                                className="w-full border border-slate-300 rounded-lg px-2 py-1 text-[11px] bg-slate-50 font-bold text-slate-900"
                              >
                                <option value={3}>3 أسئلة (3 نقط)</option>
                                <option value={4}>4 أسئلة قياسية (4 نقط)</option>
                                <option value={5}>5 أسئلة موسعة (5 نقط)</option>
                                <option value={6}>6 أسئلة شاملة (6 نقط)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                                نظام التنقيط والتعليل:
                              </label>
                              <select
                                value={qcmScoringMode}
                                onChange={(e) =>
                                  setQcmScoringMode(
                                    e.target.value as QCMScoringMode
                                  )
                                }
                                className="w-full border border-slate-300 rounded-lg px-2 py-1 text-[11px] bg-slate-50 font-bold text-slate-900"
                              >
                                <option value="JUSTIFICATION_REQUIRED">
                                  مع التعليل الرياضي (0.5 + 0.5)
                                </option>
                                <option value="DIRECT_NO_JUSTIFICATION">
                                  اختيار مباشر بدون تعليل
                                </option>
                                <option value="NEGATIVE_PENALTY">
                                  مع خصم ربع نقطة للخطأ (-0.25)
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                setShowCustomQcmBuilder((prev) => !prev)
                              }
                              className="text-[10.5px] font-black text-indigo-800 hover:text-indigo-950 underline cursor-pointer"
                            >
                              {showCustomQcmBuilder
                                ? "▲ إخفاء محرر إضافة سؤال QCM مخصص"
                                : "+ إضافة سؤال QCM مخصص بـ 4 اختيارات (أ / ب / ج / د)"}
                            </button>
                            {customQcmItems.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setCustomQcmItems([])}
                                className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                              >
                                مسح المخصصة ({customQcmItems.length})
                              </button>
                            )}
                          </div>

                          {showCustomQcmBuilder && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1.5 text-[11px]">
                              <input
                                type="text"
                                value={draftQcmStmtAr}
                                onChange={(e) =>
                                  setDraftQcmStmtAr(e.target.value)
                                }
                                placeholder="نص السؤال (مثال: قيمة النهاية lim_{x→+∞} ln(x)/x هي...)"
                                className="w-full border border-slate-300 rounded px-2 py-1 bg-white font-semibold"
                              />
                              <div className="grid grid-cols-2 gap-1.5">
                                <input
                                  type="text"
                                  value={draftQcmOptA}
                                  onChange={(e) =>
                                    setDraftQcmOptA(e.target.value)
                                  }
                                  placeholder="الخيار أ (A)"
                                  className="border border-slate-300 rounded px-2 py-1 bg-white"
                                />
                                <input
                                  type="text"
                                  value={draftQcmOptB}
                                  onChange={(e) =>
                                    setDraftQcmOptB(e.target.value)
                                  }
                                  placeholder="الخيار ب (B)"
                                  className="border border-slate-300 rounded px-2 py-1 bg-white"
                                />
                                <input
                                  type="text"
                                  value={draftQcmOptC}
                                  onChange={(e) =>
                                    setDraftQcmOptC(e.target.value)
                                  }
                                  placeholder="الخيار ج (C)"
                                  className="border border-slate-300 rounded px-2 py-1 bg-white"
                                />
                                <input
                                  type="text"
                                  value={draftQcmOptD}
                                  onChange={(e) =>
                                    setDraftQcmOptD(e.target.value)
                                  }
                                  placeholder="الخيار د (D)"
                                  className="border border-slate-300 rounded px-2 py-1 bg-white"
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <select
                                  value={draftQcmCorrectCode}
                                  onChange={(e) =>
                                    setDraftQcmCorrectCode(
                                      e.target.value as "أ" | "ب" | "ج" | "د"
                                    )
                                  }
                                  className="border border-slate-300 rounded px-2 py-1 bg-white font-bold"
                                >
                                  <option value="أ">الصحيح: أ (A)</option>
                                  <option value="ب">الصحيح: ب (B)</option>
                                  <option value="ج">الصحيح: ج (C)</option>
                                  <option value="د">الصحيح: د (D)</option>
                                </select>
                                <input
                                  type="text"
                                  value={draftQcmJustifAr}
                                  onChange={(e) =>
                                    setDraftQcmJustifAr(e.target.value)
                                  }
                                  placeholder="التعليل المختصر للحل..."
                                  className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddCustomQcmQuestion}
                                  className="bg-indigo-900 hover:bg-indigo-800 text-white font-black px-2.5 py-1 rounded cursor-pointer shrink-0"
                                >
                                  إدراج
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-700">
                        كثافة أسئلة كل تمرين:
                      </span>
                      <div className="grid grid-cols-2 gap-1 bg-white p-0.5 rounded-lg border border-indigo-200 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setDsQuestionDensity("STANDARD")}
                          className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                            dsQuestionDensity === "STANDARD"
                              ? "bg-indigo-950 text-white"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          قياسي (5 أسئلة)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDsQuestionDensity("INTENSIVE")}
                          className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                            dsQuestionDensity === "INTENSIVE"
                              ? "bg-indigo-950 text-white"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          مكثف وشامل (+N3)
                        </button>
                      </div>
                    </div>

                    {!isMission && (
                      <>

                      {/* بارومتر المطابقة البيداغوجية وتوجيهات مفتش مادة الرياضيات بألوان هادئة وباردة (Note 142-08) */}
                      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/80 text-white rounded-xl p-3 space-y-2.5 shadow-xs border border-cyan-900/40">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif text-cyan-300 text-sm font-black">∫ dx</span>
                            <span className="font-black text-xs text-cyan-200">
                              بارومتر تدقيق المفتش التربوي لمادة الرياضيات (المذكرة 142-08)
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black ${
                              n1 >= 25 && n1 <= 40 && n2 >= 40 && n2 <= 55 && n3 >= 15 && n3 <= 25
                                ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            }`}
                          >
                            {n1 >= 25 && n1 <= 40 && n2 >= 40 && n2 <= 55 && n3 >= 15 && n3 <= 25
                              ? "✓ توازن ديداكتيكي مثالي"
                              : "⚠️ يحتاج لضبط التوازن"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px]">
                          <div className="bg-slate-900/80 rounded-lg p-1.5 border border-slate-800">
                            <div className="text-slate-300 text-[10px] flex items-center justify-center gap-1">
                              <span className="font-serif text-cyan-400 font-bold">[=]</span>
                              <span>N1 (تطبيق مباشر)</span>
                            </div>
                            <div className="font-mono font-black text-cyan-300 tabular-nums">
                              {n1}% ({((n1 * 20) / 100).toFixed(1)} ن)
                            </div>
                            <div className="text-[9.5px] text-slate-400">المعيار: 30-35%</div>
                          </div>
                          <div className="bg-slate-900/80 rounded-lg p-1.5 border border-slate-800">
                            <div className="text-slate-300 text-[10px] flex items-center justify-center gap-1">
                              <span className="font-serif text-teal-400 font-bold">[∼]</span>
                              <span>N2 (تطبيق وتوليف)</span>
                            </div>
                            <div className="font-mono font-black text-teal-300 tabular-nums">
                              {n2}% ({((n2 * 20) / 100).toFixed(1)} ن)
                            </div>
                            <div className="text-[9.5px] text-slate-400">المعيار: 45-50%</div>
                          </div>
                          <div className="bg-slate-900/80 rounded-lg p-1.5 border border-slate-800">
                            <div className="text-slate-300 text-[10px] flex items-center justify-center gap-1">
                              <span className="font-serif text-sky-400 font-bold">[∗]</span>
                              <span>N3 (وضعيات غير مألوفة)</span>
                            </div>
                            <div className="font-mono font-black text-sky-300 tabular-nums">
                              {n3}% ({((n3 * 20) / 100).toFixed(1)} ن)
                            </div>
                            <div className="text-[9.5px] text-slate-400">المعيار: 15-20%</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
                          <span className="text-[10px] text-slate-300">
                            التوزيع الديداكتيكي المعياري:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setN1(35);
                              setN2(45);
                              setN3(20);
                              setStatusMessage({
                                type: "success",
                                text: "تم تطبيق التوزيع البيداغوجي المعياري للمفتش (35% N1 - 45% N2 - 20% N3) بنجاح.",
                              });
                            }}
                            className="text-[10.5px] font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 px-2.5 py-1 rounded-md transition cursor-pointer shadow-xs"
                          >
                            تطبيق التوزيع المعياري (35% / 45% / 20%)
                          </button>
                        </div>
                      </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* خيارات الفروض المنزلية وسلاسل التمارين */}
              {activeModule === "DM_SERIE" && (
                <div className="pt-2 border-t border-slate-200/80 space-y-3">
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-black">
                    <button
                      onClick={() => setDmSubType("DEVOIR_MAISON")}
                      className={`py-1.5 rounded-md transition ${
                        dmSubType === "DEVOIR_MAISON"
                          ? "bg-white text-indigo-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      فرض منزلي (DM)
                    </button>
                    <button
                      onClick={() => setDmSubType("SERIE_TD")}
                      className={`py-1.5 rounded-md transition ${
                        dmSubType === "SERIE_TD"
                          ? "bg-white text-indigo-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      سلسلة تمارين (Série TD)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {dmSubType === "DEVOIR_MAISON" ? "رقم الفرض المنزلي:" : "رقم السلسلة:"}
                      </label>
                      <select
                        value={dmNumber}
                        onChange={(e) => setDmNumber(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/50 font-bold"
                      >
                        <option value="N° 1">N° 1 (الأول)</option>
                        <option value="N° 2">N° 2 (الثاني)</option>
                        <option value="N° 3">N° 3 (الثالث)</option>
                        <option value="N° 4">N° 4 (الرابع)</option>
                      </select>
                    </div>
                    {dmSubType === "DEVOIR_MAISON" ? (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          تاريخ الإرجاع (Remise):
                        </label>
                        <input
                          type="text"
                          value={dmDueDate}
                          onChange={(e) => setDmDueDate(e.target.value)}
                          placeholder="2026-11-15"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/50 font-bold tabular-nums"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          الدورة (Semestre):
                        </label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value as SemesterType)}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/50 font-bold"
                        >
                          <option value="S1">Semestre 1</option>
                          <option value="S2">Semestre 2</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* النمط البيداغوجي للفرض المنزلي وفق التوجيهات الرسمية */}
                  {dmSubType === "DEVOIR_MAISON" && !isMission && (
                    <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-2.5 space-y-2">
                      <label className="block text-[11px] font-black text-indigo-950">
                        🇲🇦 النمط البيداغوجي للفرض المنزلي (وفق التوجيهات الرسمية):
                      </label>
                      <select
                        value={moroccanDMType}
                        onChange={(e) => setMoroccanDMType(e.target.value as MoroccanDMType)}
                        className="w-full border border-indigo-300 rounded-lg p-2 text-xs bg-white font-bold text-slate-900"
                      >
                        {Object.values(MOROCCAN_DM_PRESETS).map((p) => (
                          <option key={p.type} value={p.type}>
                            {p.titleAr} ({p.estimatedHours})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10.5px] text-indigo-900 leading-relaxed font-medium">
                        {MOROCCAN_DM_PRESETS[moroccanDMType]?.descriptionAr}
                      </p>
                    </div>
                  )}

                  {/* أداة تحديد عدد تمارين السلسلة بحرية للأستاذ مع التدرج البيداغوجي */}
                  {dmSubType === "SERIE_TD" && (
                    <div className="bg-indigo-50/70 border border-indigo-200/90 rounded-xl p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-indigo-950 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-indigo-700" />
                          <span>تحديد عدد تمارين السلسلة (Nombre d'exercices) :</span>
                        </label>
                        <span className="font-mono text-xs font-black text-indigo-900 bg-white border border-indigo-300 px-2 py-0.5 rounded-md tabular-nums">
                          {serieExerciseCount} تمارين
                        </span>
                      </div>

                      {/* أزرار سريعة للاختيار المباشر لعدد التمارين */}
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                        {[3, 4, 5, 6, 8, 10, 12].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              setSerieExerciseCount(num);
                              setStatusMessage({
                                type: "info",
                                text: `تم تحديد عدد تمارين السلسلة: ${num} تمارين متدرجة الصعوبة.`,
                              });
                            }}
                            className={`py-1 rounded-md text-[11px] font-mono font-black transition cursor-pointer ${
                              serieExerciseCount === num
                                ? "bg-indigo-950 text-amber-300 shadow-xs"
                                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      {/* منزلق تحديد العدد المخصص */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                          تخصيص حر:
                        </span>
                        <input
                          type="range"
                          min={2}
                          max={15}
                          value={serieExerciseCount}
                          onChange={(e) => setSerieExerciseCount(Number(e.target.value))}
                          className="flex-1 accent-indigo-700 cursor-pointer"
                        />
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={serieExerciseCount}
                          onChange={(e) =>
                            setSerieExerciseCount(
                              Math.max(1, Math.min(20, Number(e.target.value)))
                            )
                          }
                          className="w-12 border border-indigo-300 rounded-md py-0.5 px-1 text-center font-mono text-xs font-bold bg-white tabular-nums"
                        />
                        <span className="text-[11px] font-bold text-slate-600">تمرين</span>
                      </div>

                      <p className="text-[10.5px] text-indigo-900/90 leading-relaxed font-medium bg-white/80 p-2 rounded-lg border border-indigo-100">
                        ✨ <strong>التدرج البيداغوجي وفق المنهاج المغربي:</strong> تتدرج السلسلة آلياً من تمارين التطبيق المباشر (★ N1) إلى التمارين النموذجية (★★ N2) ثم التوليفية (★★★ N3) ومسائل التميز والأولمبياد (★★★★ N4).
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeHints}
                        onChange={(e) => setIncludeHints(e.target.checked)}
                        className="rounded text-indigo-700 w-3.5 h-3.5"
                      />
                      <span>إدراج إرشادات منهجية للحل (Indications méthodologiques)</span>
                    </label>
                    <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSelfEvalGrid}
                        onChange={(e) => setIncludeSelfEvalGrid(e.target.checked)}
                        className="rounded text-indigo-700 w-3.5 h-3.5"
                      />
                      <span>
                        {dmSubType === "DEVOIR_MAISON"
                          ? "إدراج شبكة التقويم الذاتي وبطاقة تسليم الفرض المنزلي"
                          : "إدراج شبكة التموقع الذاتي للتحكم في قدرات السلسلة"}
                      </span>
                    </label>

                    {dmSubType === "DEVOIR_MAISON" && (
                      <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeDMContract}
                          onChange={(e) => setIncludeDMContract(e.target.checked)}
                          className="rounded text-indigo-700 w-3.5 h-3.5"
                        />
                        <span>إدراج ميثاق الفرض المنزلي والالتزام بالبحث الذاتي (Charte d'engagement)</span>
                      </label>
                    )}

                    {dmSubType === "SERIE_TD" && (
                      <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeLessonMemo}
                          onChange={(e) => setIncludeLessonMemo(e.target.checked)}
                          className="rounded text-indigo-700 w-3.5 h-3.5"
                        />
                        <span>إدراج كبسولة التذكير بالمعارف والخاصيات (Fiche Mémo Express) في مقدمة السلسلة</span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* خيار اختيار الدرس في تبويب الجذاذات التربوية */}
              {activeModule === "FICHE_OP2007" && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    اختر الدرس من المقرر الرسمي ({filteredTrackLessonsWithIdx.length} دروس):
                  </label>
                  <select
                    value={selectedLessonIdx}
                    onChange={(e) => setSelectedLessonIdx(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-slate-50/50 font-bold"
                  >
                    {(filteredTrackLessonsWithIdx.length > 0
                      ? filteredTrackLessonsWithIdx
                      : allTrackLessons.map((lesson, idx) => ({ lesson, idx }))
                    ).map(({ lesson: l, idx }) => (
                      <option key={idx} value={idx}>
                        [{l.subCategory || "رياضيات"}] {isMission || docLang === "FR" ? l.lessonFr : `${l.lessonAr} — ${l.lessonFr}`} ({l.hours})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* خيارات الرائز التشخيصي */}
              {activeModule === "DIAGNOSTIC" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      مدة الرائز التشخيصي
                    </label>
                    <select
                      value={diagDuration}
                      onChange={(e) => setDiagDuration(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/50 font-bold"
                    >
                      <option value="1h">ساعة واحدة (1h)</option>
                      <option value="2h">ساعتان (2h)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      نمط أسئلة الرائز
                    </label>
                    <select
                      value={diagType}
                      onChange={(e) => setDiagType(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/50 font-bold"
                    >
                      <option value="MIXED">مزدوج (QCM + تمارين مفتوحة)</option>
                      <option value="QCM">اختيار من متعدد (QCM)</option>
                      <option value="OPEN">تمارين مفتوحة وموجهة</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
          <div className="pt-3 border-t border-slate-200 mt-3 space-y-2">
            <button
              type="button"
              onClick={() => setIsJsonConfigModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <FileJson className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>تصدير / استيراد إعدادات الفرض (JSON)</span>
            </button>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>
                الترويسة:{" "}
                {headerStyle === "OFFICIAL_AREF"
                  ? "رسمية"
                  : headerStyle === "MODERN_COMPACT"
                  ? "مدمجة"
                  : "مؤطرة"}
              </span>
              <span className="font-mono tabular-nums">{year}</span>
            </div>
          </div>
        </div>

            {/* العمود الثاني: اختيار الدروس وتحديد نسبة كل درس (%) */}
            <div className={`bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex-col justify-between max-h-[640px] ${mobileActiveColumn === 2 ? "flex" : "hidden lg:flex"}`}>
              <div className="overflow-y-auto studio-scroll space-y-4 pr-1">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-black flex items-center justify-center">
                      02
                    </span>
                    <h2 className="font-black text-slate-950 text-sm">
                      اختيار الدروس وتخصيص الأوزان (%)
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {(activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                      <span
                        className={`text-xs font-mono font-extrabold tabular-nums ${
                          totalCustomWeight === 100 ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        المجموع: {totalCustomWeight}%
                      </span>
                    )}
                  {history.length > 1 && (
                    <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={handleUndo}
                        disabled={!canUndo}
                        title="تراجع عن تعديل الأوزان أو العناوين (Ctrl + Z)"
                        className="p-1 rounded text-slate-600 hover:text-slate-950 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRedo}
                        disabled={!canRedo}
                        title="إعادة تطبيق التعديل (Ctrl + Y)"
                        className="p-1 rounded text-slate-600 hover:text-slate-950 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
                      >
                        <Redo2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* نظام التصفية المتقدم حسب التصنيفات الفرعية والوسوم (جبر، تحليل، هندسة فضائية...) */}
              {activeModule !== "DIAGNOSTIC" && (
                <div className="bg-slate-50/90 border border-slate-200/90 rounded-lg p-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="lesson-tag-filter-select"
                      className="text-[11px] font-black text-slate-800 flex items-center gap-1.5"
                    >
                      <Filter className="w-3.5 h-3.5 text-indigo-700" />
                      <span>تصفية الدروس والمسائل حسب التصنيف الفرعي:</span>
                    </label>
                    {selectedTagFilter !== "ALL" && (
                      <button
                        type="button"
                        onClick={() => setSelectedTagFilter("ALL")}
                        className="text-[10px] font-bold text-rose-700 hover:underline"
                      >
                        إلغاء التصفية ({allTrackLessons.length})
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      id="lesson-tag-filter-select"
                      value={selectedTagFilter}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedTagFilter(val);
                        if (
                          val !== "ALL" &&
                          (activeModule === "DS_142_08" || activeModule === "DM_SERIE")
                        ) {
                          setIsCustomLessonMode(true);
                        }
                      }}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="ALL">
                        جميع التصنيفات والمحاور ({allTrackLessons.length} دروس)
                      </option>
                      <optgroup label="التصنيفات الفرعية الدقيقة (جبر، تحليل، هندسة فضائية...)">
                        {LESSON_TAG_OPTIONS.filter((o) => o.group === "SUB" || o.group === "TOPIC").map(
                          (opt) => {
                            const count = trackTagCounts[opt.id] || 0;
                            return (
                              <option key={opt.id} value={opt.id}>
                                {isMission || docLang === "FR" ? opt.labelFr : opt.labelAr} ({count})
                              </option>
                            );
                          }
                        )}
                      </optgroup>
                      <optgroup label="التصنيفات الكبرى (Algebra / Calculus / Geometry)">
                        {LESSON_TAG_OPTIONS.filter((o) => o.group === "MAIN").map((opt) => {
                          const count = trackTagCounts[opt.id] || 0;
                          return (
                            <option key={opt.id} value={opt.id}>
                              {isMission || docLang === "FR" ? opt.labelFr : opt.labelAr} ({count})
                            </option>
                          );
                        })}
                      </optgroup>
                    </select>
                  </div>

                  {/* أزرار التصفية السريعة للتصنيفات الفرعية المتوفرة في المسلك */}
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTagFilter("ALL")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border transition ${
                        selectedTagFilter === "ALL"
                          ? "bg-indigo-950 text-white border-indigo-950"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      الكل ({allTrackLessons.length})
                    </button>
                    {LESSON_TAG_OPTIONS.filter(
                      (o) =>
                        (o.group === "SUB" || o.id === "متتاليات عددية") &&
                        (trackTagCounts[o.id] > 0 ||
                          ["جبر", "تحليل", "هندسة فضائية"].includes(o.id))
                    ).map((opt) => {
                      const count = trackTagCounts[opt.id] || 0;
                      const active = selectedTagFilter === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            const nextVal = active ? "ALL" : opt.id;
                            setSelectedTagFilter(nextVal);
                            if (
                              nextVal !== "ALL" &&
                              (activeModule === "DS_142_08" || activeModule === "DM_SERIE")
                            ) {
                              setIsCustomLessonMode(true);
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border transition ${
                            active
                              ? "bg-indigo-700 text-white border-indigo-700 shadow-2xs"
                              : `${opt.colorClass} hover:opacity-85`
                          }`}
                        >
                          {opt.id} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {selectedTagFilter !== "ALL" &&
                    filteredTrackLessonsWithIdx.length > 0 &&
                    (activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                        <span className="text-[10px] font-bold text-indigo-950">
                          تم العثور على {filteredTrackLessonsWithIdx.length} دروس في « {selectedTagFilter} »
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectAllFilteredTagLessons(selectedTagFilter)}
                          className="text-[10px] font-black bg-indigo-700 hover:bg-indigo-800 text-white px-2.5 py-1 rounded-md transition"
                        >
                          اعتماد كل دروس « {selectedTagFilter} »
                        </button>
                      </div>
                    )}
                </div>
              )}

              {/* أزرار التبديل بين التقسيم الرسمي والاختيار الحر للدروس */}
              {(activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                <div className="space-y-3 border-b border-slate-200/80 pb-4">
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-black">
                    <button
                      onClick={() => {
                        setIsCustomLessonMode(false);
                        setSelectedTagFilter("ALL");
                      }}
                      className={`py-1.5 rounded-md transition ${
                        !isCustomLessonMode
                          ? "bg-white text-indigo-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      دروس {dsKey} الرسمية
                    </button>
                    <button
                      onClick={() => setIsCustomLessonMode(true)}
                      className={`py-1.5 rounded-md transition ${
                        isCustomLessonMode
                          ? "bg-white text-indigo-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      اختيار حر من المقرر ({selectedLessonIndices.length})
                    </button>
                  </div>

                  {/* قائمة اختيار الدروس عند تفعيل الاختيار الحر أو التصفية */}
                  {(isCustomLessonMode || selectedTagFilter !== "ALL") && (
                    <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2.5 space-y-1.5 bg-slate-50/40">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>
                          {selectedTagFilter === "ALL"
                            ? "حدد الدروس المراد إدراجها في الوثيقة:"
                            : `الدروس المطابقة لتصنيف « ${selectedTagFilter} » (${filteredTrackLessonsWithIdx.length}):`}
                        </span>
                      </div>

                      {filteredTrackLessonsWithIdx.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-500 font-semibold space-y-1.5">
                          <p>لا توجد دروس في هذا المسلك ضمن تصنيف « {selectedTagFilter} ».</p>
                          <button
                            type="button"
                            onClick={() => setSelectedTagFilter("ALL")}
                            className="text-indigo-700 font-bold underline text-[11px]"
                          >
                            عرض جميع دروس المسلك ({allTrackLessons.length})
                          </button>
                        </div>
                      ) : (
                        filteredTrackLessonsWithIdx.map(({ lesson, idx }) => {
                          const checked = selectedLessonIndices.includes(idx);
                          const lessonTags = getLessonTags(lesson);
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col gap-1 p-2 rounded-lg border text-xs transition ${
                                checked
                                  ? "bg-indigo-50/80 border-indigo-200 text-indigo-950 font-bold"
                                  : "bg-white border-slate-200/70 hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    if (!isCustomLessonMode) setIsCustomLessonMode(true);
                                    handleToggleLessonInCustomMode(idx);
                                  }}
                                  className="rounded text-indigo-700 w-3.5 h-3.5 shrink-0"
                                />
                                <span className="truncate flex-1">
                                  {isMission || docLang === "FR"
                                    ? lesson.lessonFr
                                    : `${lesson.lessonAr} (${lesson.lessonFr})`}
                                </span>
                              </label>
                              <div className="flex flex-wrap items-center gap-1 pr-5">
                                {lessonTags.map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() =>
                                      setSelectedTagFilter((prev) => (prev === tag ? "ALL" : tag))
                                    }
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border transition ${getLessonBadgeColor(
                                      tag
                                    )}`}
                                    title={`تصفية حسب: ${tag}`}
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* أزرار موازنة النسب المئوية */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNormalizeWeightsTo100}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-extrabold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Scale className="w-3.5 h-3.5 text-indigo-700" />
                      <span>موازنة إلى 100%</span>
                    </button>
                    <button
                      onClick={handleEqualizeWeights}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-extrabold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Percent className="w-3.5 h-3.5 text-emerald-700" />
                      <span>توزيع متساوٍ</span>
                    </button>
                    <button
                      onClick={() => setCustomWeightsMap({})}
                      title="استعادة الأوزان الافتراضية"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-2.5 rounded-lg transition"
                    >
                      ↺
                    </button>
                  </div>
                </div>
              )}

              {/* قائمة الدروس المختارة مع منزلق التحكم في نسبة كل درس (%) */}
              {(activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                <div className="divide-y divide-slate-200/80">
                  {activeCustomLessons.map((item, idx) => {
                    const pts = ((item.weight * 20) / 100).toFixed(1);
                    const caps =
                      isMission || docLang === "FR" ? item.capacitiesFr : item.capacitiesAr;
                    const itemTags = getLessonTags(item);
                    return (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex justify-between items-start text-xs font-black text-slate-950 gap-2">
                          <div className="space-y-1">
                            <span className="block">
                              {idx + 1}.{" "}
                              {isMission || docLang === "FR"
                                ? item.lessonFr
                                : `${item.lessonAr} · ${item.lessonFr}`}
                            </span>
                            <div className="flex flex-wrap items-center gap-1">
                              {itemTags.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTagFilter((prev) => (prev === tag ? "ALL" : tag));
                                    setIsCustomLessonMode(true);
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border transition ${getLessonBadgeColor(
                                    tag
                                  )}`}
                                >
                                  <Tag className="w-2.5 h-2.5 inline ml-0.5" />
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                          <span className="font-mono text-indigo-900 font-extrabold tabular-nums whitespace-nowrap text-xs">
                            {item.weight}% · {pts} pts
                          </span>
                        </div>

                        {/* التحكم في نسبة الدرس */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                            الوزن:
                          </span>
                          <input
                            type="range"
                            min={5}
                            max={100}
                            step={5}
                            value={item.weight}
                            onChange={(e) =>
                              handleLessonWeightChange(item.lessonFr, Number(e.target.value))
                            }
                            className="flex-1 accent-indigo-700"
                          />
                          <input
                            type="number"
                            min={5}
                            max={100}
                            value={item.weight}
                            onChange={(e) =>
                              handleLessonWeightChange(item.lessonFr, Number(e.target.value))
                            }
                            className="w-14 border border-slate-300 rounded-md py-1 px-1.5 text-center font-mono text-xs font-bold tabular-nums bg-slate-50/50"
                          />
                          <span className="text-xs font-bold text-slate-500">%</span>
                        </div>

                        {/* اختيار أيقونة مخصصة لترويسة التمرين داخل الورقة المطبوعة */}
                        {(() => {
                          const lessonStorageKey = `${currentTrack.code}_${item.lessonFr}`;
                          const currentSelectedIconId: LessonHeaderIconId =
                            customLessonIconsMap[lessonStorageKey] ||
                            item.customHeaderIcon ||
                            "AUTO";
                          const resolvedPreviewIcon = resolveLessonHeaderIcon(
                            item,
                            currentSelectedIconId
                          );
                          const quickPills: Array<{
                            id: LessonHeaderIconId;
                            shortLabel: string;
                          }> = [
                            { id: "AUTO", shortLabel: "تلقائي" },
                            { id: "FUNCTION", shortLabel: "دالة f(x)" },
                            { id: "SEQUENCE", shortLabel: "متتالية (uₙ)" },
                            { id: "GEOMETRY", shortLabel: "هندسة △" },
                            { id: "COMPLEX", shortLabel: "عقدية ℂ" },
                            { id: "PROBABILITY", shortLabel: "احتمالات P" },
                            { id: "INTEGRAL", shortLabel: "تكامل ∫" },
                            { id: "NONE", shortLabel: "بدون" },
                          ];

                          return (
                            <div className="bg-indigo-50/55 border border-indigo-200/80 rounded-lg p-2 space-y-1.5">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-[10.5px] font-extrabold text-indigo-950 flex items-center gap-1.5">
                                  <span>أيقونة ترويسة التمرين في الورقة المطبوعة:</span>
                                  {resolvedPreviewIcon ? (
                                    <LessonHeaderIconBadge
                                      lesson={item}
                                      overrideIconId={currentSelectedIconId}
                                      accentHex="#312e81"
                                      bgHex="#eef2ff"
                                      borderHex="#a5b4fc"
                                    />
                                  ) : (
                                    <span className="text-[9.5px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                      بدون أيقونة
                                    </span>
                                  )}
                                </span>

                                <select
                                  value={currentSelectedIconId}
                                  onChange={(e) =>
                                    handleLessonIconChange(
                                      item.lessonFr,
                                      e.target.value as LessonHeaderIconId,
                                      isMission ? item.lessonFr : item.lessonAr
                                    )
                                  }
                                  aria-label={`أيقونة ترويسة التمرين لدرس ${item.lessonAr}`}
                                  className="text-[10.5px] font-bold bg-white border border-indigo-300 text-indigo-950 rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                                >
                                  {LESSON_HEADER_ICON_OPTIONS.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                      {opt.labelAr}{" "}
                                      {opt.mathSymbol ? `(${opt.mathSymbol})` : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* أزرار اختيار سريع للأيقونات الرياضية الأكثر استخداماً */}
                              <div className="flex items-center gap-1 flex-wrap">
                                {quickPills.map((pill) => {
                                  const isActive = currentSelectedIconId === pill.id;
                                  return (
                                    <button
                                      key={pill.id}
                                      type="button"
                                      onClick={() =>
                                        handleLessonIconChange(
                                          item.lessonFr,
                                          pill.id,
                                          isMission ? item.lessonFr : item.lessonAr
                                        )
                                      }
                                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-extrabold border transition flex items-center gap-1 cursor-pointer ${
                                        isActive
                                          ? "bg-indigo-800 text-white border-indigo-900 shadow-xs"
                                          : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60"
                                      }`}
                                    >
                                      {pill.id !== "AUTO" && pill.id !== "NONE" && (
                                        <LessonHeaderIconSvg
                                          iconId={pill.id}
                                          className="w-2.5 h-2.5 shrink-0"
                                        />
                                      )}
                                      <span>{pill.shortLabel}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}

                        <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
                          {caps.slice(0, 2).map((c, cIdx) => (
                            <li key={cIdx} className="truncate">
                              {c}
                            </li>
                          ))}
                        </ul>

                        {/* شارة الربط التلقائي أو المخصص بـ GeoGebra لتمارين الهندسة */}
                        {(isGeometryOrSpatialLesson(item) ||
                          Boolean(geoGebraResourcesMap[item.lessonFr])) && (
                          <div className="flex items-center justify-between gap-2 bg-teal-50/70 border border-teal-200/80 rounded-md px-2.5 py-1 text-[10.5px]">
                            <span className="font-bold text-teal-950 flex items-center gap-1 truncate">
                              <Compass className="w-3 h-3 text-teal-700 shrink-0" />
                              {geoGebraResourcesMap[item.lessonFr]
                                ? `مرفق مخصص: ${
                                    geoGebraResourcesMap[item.lessonFr].fileName ||
                                    geoGebraResourcesMap[item.lessonFr].titleAr
                                  }`
                                : autoAttachGeoGebra
                                ? "✓ مضمن تلقائياً بشكل ورابط GeoGebra تفاعلي"
                                : "تمرين هندسي (يمكن إرفاق ملف .ggb)"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setGgbTargetLessonKey(item.lessonFr);
                                setCol3Tab("GEOGEBRA");
                              }}
                              className="text-[10px] font-black text-teal-800 hover:underline shrink-0 cursor-pointer"
                            >
                              تخصيص GeoGebra
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeModule === "FICHE_OP2007" &&
                (() => {
                  const lesson =
                    allTrackLessons[selectedLessonIdx] ||
                    filteredTrackLessonsWithIdx[0]?.lesson ||
                    allTrackLessons[0];
                  if (!lesson) return null;
                  const lessonTags = getLessonTags(lesson);
                  return (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start text-xs font-black text-indigo-950 gap-2">
                        <div className="space-y-1">
                          <span className="block">
                            {isMission ? lesson.lessonFr : `${lesson.lessonAr} · ${lesson.lessonFr}`}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            {lessonTags.map((tag, tIdx) => (
                              <React.Fragment key={tag}>
                                {tIdx > 0 && <span aria-hidden="true">·</span>}
                                <span>{tag}</span>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        <span className="text-emerald-800 font-mono tabular-nums font-bold shrink-0">
                          {lesson.hours}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        {isMission
                          ? "Objectifs d'apprentissage et capacités attendues :"
                          : "القدرات المنتظرة الرسمية (OP 2007):"}
                      </p>
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5">
                        {lesson.capacitiesFr.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}

              {activeModule === "DIAGNOSTIC" && (
                <div className="space-y-2.5">
                  <p className="text-xs font-black text-indigo-950">
                    {isMission
                      ? "Prérequis fondamentaux ciblés par l'évaluation diagnostique :"
                      : "المكتسبات القبلية الأساسية المستهدفة بالرائز التشخيصي:"}
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5">
                    {(isMission ? currentTrack.prereqsFr : currentTrack.prereqsAr).map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeModule === "REPARTITION_CERTIF" && (
                <div className="divide-y divide-slate-100">
                  {filteredTrackLessonsWithIdx.map(({ lesson: l, idx: i }) => (
                    <div
                      key={i}
                      className="py-2 flex justify-between items-center text-xs gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-slate-800">
                          {i + 1}. {isMission || docLang === "FR" ? l.lessonFr : l.lessonAr}
                        </span>
                        {l.subCategory && (
                          <>
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {l.subCategory}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="font-mono text-indigo-900 font-bold tabular-nums shrink-0">
                        {l.hours}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 mt-3 flex justify-between items-center text-[11px] text-slate-500 font-semibold tabular-nums">
              <span>المدة الرسمية: {currentTrack.durationFr}</span>
              <span>
                {activeCustomLessons.length} دروس · مجموع النقط:{" "}
                {((totalCustomWeight * 20) / 100).toFixed(1)}/20
              </span>
            </div>
          </div>

            {/* العمود الثالث: النماذج المتعددة والضوابط الديداكتيكية والمختبرات */}
            <div className={`bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex-col justify-between max-h-[640px] ${mobileActiveColumn === 3 ? "flex" : "hidden lg:flex"}`}>
              <div className="overflow-y-auto studio-scroll space-y-4 pr-1">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs font-black flex items-center justify-center">
                      03
                    </span>
                    <h2 className="font-black text-slate-950 text-sm">
                      النماذج والضوابط والمختبرات
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Sujet {examModel}
                  </span>
                </div>

                {/* شريط تبويبات العمود الثالث لمنع التكدس العمودي وتحقيق التناسق */}
                {(activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-[11px] font-black">
                    <button
                      type="button"
                      onClick={() => setCol3Tab("EVAL_MODELS")}
                      className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                        col3Tab === "EVAL_MODELS"
                          ? "bg-white text-indigo-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      <span>النماذج والتصحيح</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCol3Tab("GEOGEBRA")}
                      className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                        col3Tab === "GEOGEBRA"
                          ? "bg-white text-teal-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>هندسة GeoGebra</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCol3Tab("EVAL_GRID")}
                      className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                        col3Tab === "EVAL_GRID"
                          ? "bg-white text-indigo-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Table2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>شبكة التقويم</span>
                    </button>
                  </div>
                )}

                {/* التبويب 1: النماذج المتكافئة + المستويات المهارية + التصحيح المفصل */}
                {(col3Tab === "EVAL_MODELS" ||
                  (activeModule !== "DS_142_08" && activeModule !== "DM_SERIE")) && (
                  <div className="space-y-3.5">
                    {/* قسم إنشاء نماذج متعددة لمنع الغش */}
                    {(activeModule === "DS_142_08" ||
                      (activeModule === "DM_SERIE" && dmSubType === "DEVOIR_MAISON")) && (
                      <div className="space-y-2.5 border-b border-slate-200/80 pb-3.5">
                        <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-700" />
                            <span>النماذج المتكافئة (Modèles Anti-Triche):</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-black">
                          <button
                            type="button"
                            onClick={() => setExamModel("A")}
                            className={`py-1.5 rounded-md transition whitespace-nowrap cursor-pointer ${
                              examModel === "A"
                                ? "bg-white text-indigo-950 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            النموذج أ (A)
                          </button>
                          <button
                            type="button"
                            onClick={() => setExamModel("B")}
                            className={`py-1.5 rounded-md transition whitespace-nowrap cursor-pointer ${
                              examModel === "B"
                                ? "bg-white text-indigo-950 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            النموذج ب (B)
                          </button>
                          <button
                            type="button"
                            onClick={() => setExamModel("BOTH")}
                            className={`py-1.5 rounded-md transition whitespace-nowrap cursor-pointer ${
                              examModel === "BOTH"
                                ? "bg-emerald-700 text-white shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            النموذجان (A + B)
                          </button>
                        </div>

                        <div className="flex flex-col gap-1.5 text-[11px] font-bold text-slate-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={shuffleQuestions}
                              onChange={(e) => setShuffleQuestions(e.target.checked)}
                              className="rounded text-indigo-700 w-3.5 h-3.5"
                            />
                            <span>تغيير الأرقام والمعاملات وتبديل الأسئلة في النموذج (ب)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={shuffleExercises}
                              onChange={(e) => setShuffleExercises(e.target.checked)}
                              className="rounded text-indigo-700 w-3.5 h-3.5"
                            />
                            <span>عكس ترتيب التمارين في النموذج (ب)</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* منزلقات المستويات المهارية */}
                    {activeModule === "DS_142_08" && (
                      <div className="space-y-2.5 text-xs border-b border-slate-200/80 pb-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800">
                            {isMission
                              ? "Graduation des niveaux de difficulté :"
                              : "توزيع المستويات المهارية (مذكرة 142-08):"}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-teal-800">
                            {isMission ? "BOEN / AEFE" : "Réf : Note 142-08"}
                          </span>
                        </div>

                        {/* قوالب التوزيع المهاري المعيارية وفق المذكرة 142-08 والأطر المرجعية */}
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-[10.5px] font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              setN1(45);
                              setN2(40);
                              setN3(15);
                            }}
                            className={`py-1 px-1.5 rounded transition cursor-pointer ${
                              n1 === 45 && n2 === 40 && n3 === 15
                                ? "bg-white text-indigo-950 shadow-2xs font-black"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                            title="التوزيع الرسمي القياسي للمذكرة 142-08 (45% تطبيق مباشر / 40% استدلال / 15% توليف)"
                          >
                            معيار 142-08 (45/40/15)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setN1(35);
                              setN2(45);
                              setN3(20);
                            }}
                            className={`py-1 px-1.5 rounded transition cursor-pointer ${
                              n1 === 35 && n2 === 45 && n3 === 20
                                ? "bg-white text-indigo-950 shadow-2xs font-black"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                            title="توزيع الإطار المرجعي للامتحان الوطني الموحد للبكالوريا (35% تطبيق / 45% تعبئة / 20% مسألة توليفية)"
                          >
                            إطار وطني (35/45/20)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setN1(50);
                              setN2(35);
                              setN3(15);
                            }}
                            className={`py-1 px-1.5 rounded transition cursor-pointer ${
                              n1 === 50 && n2 === 35 && n3 === 15
                                ? "bg-white text-indigo-950 shadow-2xs font-black"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                            title="توزيع الفرض الأول لتثبيت المكتسبات القبلية والقدرات الأساسية (50% تطبيق / 35% استدلال / 15% تعمق)"
                          >
                            تثبيت أساسي (50/35/15)
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-600">
                              {isMission ? "Niveau 1 (Application) :" : "المستوى 1 (تطبيق مباشر - N1):"}
                            </span>
                            <span className="font-extrabold text-indigo-900 font-mono tabular-nums">
                              {n1}% · {((n1 * 20) / 100).toFixed(1)} pts
                            </span>
                          </div>
                          <input
                            type="range"
                            min={30}
                            max={60}
                            value={n1}
                            onChange={(e) => handleSliderChange("N1", Number(e.target.value))}
                            className="w-full accent-indigo-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-600">
                              {isMission ? "Niveau 2 (Mobilisation) :" : "المستوى 2 (تعبئة وتوليف - N2):"}
                            </span>
                            <span className="font-extrabold text-indigo-900 font-mono tabular-nums">
                              {n2}% · {((n2 * 20) / 100).toFixed(1)} pts
                            </span>
                          </div>
                          <input
                            type="range"
                            min={20}
                            max={50}
                            value={n2}
                            onChange={(e) => handleSliderChange("N2", Number(e.target.value))}
                            className="w-full accent-indigo-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-600">
                              {isMission ? "Niveau 3 (Initiative) :" : "المستوى 3 (تعمق ومبادرة - N3):"}
                            </span>
                            <span className="font-extrabold text-indigo-900 font-mono tabular-nums">
                              {n3}% · {((n3 * 20) / 100).toFixed(1)} pts
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={30}
                            value={n3}
                            onChange={(e) => handleSliderChange("N3", Number(e.target.value))}
                            className="w-full accent-indigo-700"
                          />
                        </div>

                        {/* بطاقة تجزئة النقط وسلّم الأسئلة الدقيق (المذكرة 142-08) */}
                        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-950">
                              <Scale className="w-4 h-4 text-cyan-700 shrink-0" />
                              <span>تجزئة النقط وسلّم الأسئلة (142-08)</span>
                            </div>
                            <span
                              className={`text-[10.5px] font-mono font-black px-2 py-0.5 rounded-md border tabular-nums ${
                                Math.abs(liveExamStats.totalPoints - 20) <= 0.1
                                  ? "text-emerald-800 bg-emerald-100/90 border-emerald-300"
                                  : "text-amber-800 bg-amber-100/90 border-amber-300"
                              }`}
                            >
                              {liveExamStats.totalPoints.toFixed(2)} / 20.00 ن
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            تخصيص نقطة ونص ومستوى كل سؤال بدقة (+/- 0.25 ن) مع موازنة تلقائية تضمن مطابقة المذكرة 142-08.
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsBaremeModalOpen(true)}
                            className="w-full py-1.5 px-3 rounded-lg text-xs font-black bg-slate-900 hover:bg-slate-800 text-cyan-200 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                            <span>فتح مدير تجزئة النقط وتعديل الأسئلة ({liveExamStats.totalQuestions} سؤالاً)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMathInspectorStudioTab("MATHJS_VALIDATOR");
                              setShowMathInspectorStudioModal(true);
                            }}
                            className="w-full py-1.5 px-3 rounded-lg text-xs font-black bg-gradient-to-l from-indigo-950 via-slate-900 to-teal-950 hover:from-indigo-900 hover:to-teal-900 text-cyan-200 border border-cyan-500/40 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>
                              مختبر MathJS وأدوات الأستاذ والمفتش (المنحنيات + المتتاليات + العقوبة المزدوجة)
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* خيارات بيداغوجية إضافية */}
                    <div className="space-y-1.5 text-[11.5px]">
                      {activeModule === "DS_142_08" && (
                        <>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={differentiatedPathConfig.enabled}
                              onChange={(e) =>
                                setDifferentiatedPathConfig((prev) => ({
                                  ...prev,
                                  enabled: e.target.checked,
                                }))
                              }
                              className="rounded text-indigo-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-indigo-950">
                              إدراج المسار الفارقي بالاختيار (Piste Guidée / Experte) وسؤال التميز (+1 ن)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={longitudinalCohortConfig.includeInPrintablePreview}
                              onChange={(e) =>
                                setLongitudinalCohortConfig((prev) => ({
                                  ...prev,
                                  includeInPrintablePreview: e.target.checked,
                                }))
                              }
                              className="rounded text-emerald-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-emerald-950">
                              إدراج بطاقة التتبع الطولي لمكتسبات الفوج (DS1 → DS2 → DS3) للتفتيش التربوي
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showQuestionBareme}
                              onChange={(e) => setShowQuestionBareme(e.target.checked)}
                              className="rounded text-indigo-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-slate-800">
                              إظهار التنقيط الجزئي والمستوى المهاري [pt · N1/N2/N3]
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeGradingScaleTable}
                              onChange={(e) => setIncludeGradingScaleTable(e.target.checked)}
                              className="rounded text-indigo-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-slate-700">
                              إدراج جدول التخصيص والقدرات (142-08) أعلى الفرض
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={include2DSpecMatrix}
                              onChange={(e) => setInclude2DSpecMatrix(e.target.checked)}
                              className="rounded text-indigo-800 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-indigo-950">
                              إدراج مصفوفة التخصيص ثنائية الأبعاد (2D) لتدقيق المفتش التربوي (الدروس × N1/N2/N3)
                            </span>
                          </label>
                          {!isMission && (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={includeMoroccanExamDirectives}
                                onChange={(e) =>
                                  setIncludeMoroccanExamDirectives(e.target.checked)
                                }
                                className="rounded text-indigo-700 w-3.5 h-3.5"
                              />
                              <span className="font-bold text-indigo-950">
                                إدراج إطار التوجيهات الرسمية للمترشح (المذكرة 142-08)
                              </span>
                            </label>
                          )}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeExamFormulaSheet}
                              onChange={(e) => setIncludeExamFormulaSheet(e.target.checked)}
                              className="rounded text-cyan-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-slate-700">
                              إرفاق تذكرة الصيغ المرجعية المسموحة (Formulaire Mathématique)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeDSStudentSelfCheck}
                              onChange={(e) => setIncludeDSStudentSelfCheck(e.target.checked)}
                              className="rounded text-cyan-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-slate-700">
                              إدراج شبكة تدبير الزمن والتقويم الذاتي للمترشح أسفل الفرض
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includePostExamRemediationSheet}
                              onChange={(e) =>
                                setIncludePostExamRemediationSheet(e.target.checked)
                              }
                              className="rounded text-teal-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-teal-950">
                              إرفاق بطاقة تشخيص الأخطاء وخطة الدعم الفارقي لما بعد الفرض
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeOfficialExamCoverSheet}
                              onChange={(e) =>
                                setIncludeOfficialExamCoverSheet(e.target.checked)
                              }
                              className="rounded text-slate-900 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-slate-900">
                              إرفاق البطاقة التقنية والإحصائية للفرض (دفتر النصوص والتفتيش)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeIndividualGradingStrip}
                              onChange={(e) =>
                                setIncludeIndividualGradingStrip(e.target.checked)
                              }
                              className="rounded text-indigo-800 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-indigo-950">
                              إدراج شبكة التنقيط الفردية المصغرة حسب الأسئلة أعلى ورقة التلميذ (Mini-Barème)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeRescueHintsAndContinuity}
                              onChange={(e) =>
                                setIncludeRescueHintsAndContinuity(e.target.checked)
                              }
                              className="rounded text-amber-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-amber-950">
                              إدراج ملحوظات استمرارية البحث وتلميحات الإنقاذ لأسئلة N3 والمسألة (Admettre le résultat)
                            </span>
                          </label>
                        </>
                      )}

                      {(activeModule === "DS_142_08" ||
                        activeModule === "DM_SERIE" ||
                        activeModule === "DIAGNOSTIC") && (
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeAnswerWorkspace}
                              onChange={(e) => setIncludeAnswerWorkspace(e.target.checked)}
                              className="rounded text-indigo-700 w-3.5 h-3.5"
                            />
                            <span className="font-bold text-slate-700">
                              إدراج كراسة التلميذ وحيز التحرير المسطر تحت الأسئلة (Seyès / Millimétré)
                            </span>
                          </label>
                          {includeAnswerWorkspace && (
                            <div className="mr-5 p-2 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1.5 text-[10.5px]">
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="font-bold text-purple-950">نمط التسطير:</span>
                                {[
                                  { id: "SEYES_FRENCH", label: "Seyès 8mm" },
                                  { id: "LINED_RULED", label: "مسطر Ligné" },
                                  { id: "MILLIMETER_GRID", label: "ميليمتري" },
                                  { id: "DOTTED_BOX", label: "نقطي" },
                                  { id: "PLAIN_BOX", label: "إطار أبيض" },
                                ].map((st) => (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={() =>
                                      setStudentGridStyle(
                                        st.id as
                                          | "SEYES_FRENCH"
                                          | "LINED_RULED"
                                          | "MILLIMETER_GRID"
                                          | "DOTTED_BOX"
                                          | "PLAIN_BOX"
                                      )
                                    }
                                    className={`px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                                      studentGridStyle === st.id
                                        ? "bg-purple-900 text-white"
                                        : "bg-white text-purple-900 border border-purple-200 hover:bg-purple-100"
                                    }`}
                                  >
                                    {st.label}
                                  </button>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="font-bold text-purple-950">ارتفاع الحيز:</span>
                                {[
                                  { id: "ADAPTIVE", label: "تكيفي ذكي (N1/N2/N3)" },
                                  { id: "COMPACT", label: "مدمج (اقتصادي)" },
                                  { id: "GENEROUS", label: "متسع (تحرير مفصل)" },
                                ].map((hm) => (
                                  <button
                                    key={hm.id}
                                    type="button"
                                    onClick={() =>
                                      setWorkspaceHeightMode(
                                        hm.id as "ADAPTIVE" | "COMPACT" | "GENEROUS"
                                      )
                                    }
                                    className={`px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                                      workspaceHeightMode === hm.id
                                        ? "bg-indigo-900 text-white"
                                        : "bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100"
                                    }`}
                                  >
                                    {hm.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fillBlanks}
                          onChange={(e) => setFillBlanks(e.target.checked)}
                          className="rounded text-indigo-700 w-3.5 h-3.5"
                        />
                        <span className="font-bold text-slate-700">
                          {isMission
                            ? "Questions de raisonnement guidé à trous"
                            : "إدراج أسئلة استدلال بملء الفراغات (Preuves à trous)"}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeTICE}
                          onChange={(e) => setIncludeTICE(e.target.checked)}
                          className="rounded text-indigo-700 w-3.5 h-3.5"
                        />
                        <span className="font-bold text-slate-700">
                          {isMission
                            ? "Intégration d'un scénario TICE (Python / GeoGebra)"
                            : "إدراج سيناريو توظيف GeoGebra والحاسبة العلمية (TICE)"}
                        </span>
                      </label>
                    </div>

                    {/* بطاقة إعدادات الجذاذة البيداغوجية والسيناريو الكامل (OP 2007) */}
                    {activeModule === "FICHE_OP2007" && (
                      <div className="bg-sky-50/70 border border-sky-200/90 rounded-xl p-3 space-y-3 mt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-black text-sky-950">
                            <FileText className="w-4 h-4 text-sky-700 shrink-0" />
                            <span>إعدادات السيناريو البيداغوجي ومحتوى الدرس</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-300">
                            OP 2007
                          </span>
                        </div>

                        {/* طريقة عرض السيناريو البيداغوجي */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-sky-950 block">
                            طريقة عرض السيناريو الديداكتيكي للحصص:
                          </label>
                          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-sky-200 text-[10px] font-bold text-center">
                            <button
                              type="button"
                              onClick={() => setFicheScenarioDisplayMode("GRID_OFFICIAL")}
                              className={`py-1 rounded cursor-pointer transition ${
                                ficheScenarioDisplayMode === "GRID_OFFICIAL"
                                  ? "bg-sky-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              الشبكة الرسمية
                            </button>
                            <button
                              type="button"
                              onClick={() => setFicheScenarioDisplayMode("CARDS_BY_SESSION")}
                              className={`py-1 rounded cursor-pointer transition ${
                                ficheScenarioDisplayMode === "CARDS_BY_SESSION"
                                  ? "bg-sky-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              حصة بحصة
                            </button>
                            <button
                              type="button"
                              onClick={() => setFicheScenarioDisplayMode("BOTH")}
                              className={`py-1 rounded cursor-pointer transition ${
                                ficheScenarioDisplayMode === "BOTH"
                                  ? "bg-sky-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              كلاهما معاً
                            </button>
                          </div>
                        </div>

                        {/* عمق محتوى الدرس والبراهين */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-sky-950 block">
                            عمق محتوى الدرس والبراهين الرياضية:
                          </label>
                          <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-lg border border-sky-200 text-[10px] font-bold text-center">
                            <button
                              type="button"
                              onClick={() => setFicheContentDetailLevel("FULL_WITH_PROOFS")}
                              className={`py-1 rounded cursor-pointer transition ${
                                ficheContentDetailLevel === "FULL_WITH_PROOFS"
                                  ? "bg-sky-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              شامل مع البراهين والتمارين
                            </button>
                            <button
                              type="button"
                              onClick={() => setFicheContentDetailLevel("SYNTHETIC_OFFICIAL")}
                              className={`py-1 rounded cursor-pointer transition ${
                                ficheContentDetailLevel === "SYNTHETIC_OFFICIAL"
                                  ? "bg-sky-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              ملخص رسمي مقتضب
                            </button>
                          </div>
                        </div>

                        {/* مفاتيح التبديل الإضافية للجذاذة */}
                        <div className="space-y-1.5 text-[11px] font-medium text-slate-700 pt-1 border-t border-sky-200">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeFichePlanningMatrix}
                              onChange={(e) => setIncludeFichePlanningMatrix(e.target.checked)}
                              className="rounded text-sky-700 w-3.5 h-3.5"
                            />
                            <span>مصفوفة التخطيط المرحلي للدرس وعدد الساعات الإجمالي</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeFicheTICE}
                              onChange={(e) => setIncludeFicheTICE(e.target.checked)}
                              className="rounded text-sky-700 w-3.5 h-3.5"
                            />
                            <span>سيناريو توظيف GeoGebra والحاسبة العلمية في الحصص</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeFicheFormativeEval}
                              onChange={(e) => setIncludeFicheFormativeEval(e.target.checked)}
                              className="rounded text-sky-700 w-3.5 h-3.5"
                            />
                            <span>محطة التقويم التكويني ومؤشرات التحقق ومعالجة التعثرات</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* أداة إدراج نموذج تصحيح تفصيلي */}
                    <div className="space-y-2 pt-2.5 border-t border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-black text-emerald-950 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeDetailedSolutions}
                            onChange={(e) => setIncludeDetailedSolutions(e.target.checked)}
                            className="rounded text-emerald-700 w-4 h-4 accent-emerald-700"
                          />
                          <span>إدراج نموذج تصحيح تفصيلي (Corrigé Détaillé)</span>
                        </label>
                      </div>

                      {includeDetailedSolutions && (
                        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-2.5 space-y-2">
                          <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-lg border border-emerald-100 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() => setSolutionDisplayMode("INLINE_PER_EXERCISE")}
                              className={`py-1 px-2 rounded-md transition cursor-pointer ${
                                solutionDisplayMode === "INLINE_PER_EXERCISE"
                                  ? "bg-emerald-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              بجانب كل تمرين
                            </button>
                            <button
                              type="button"
                              onClick={() => setSolutionDisplayMode("SEPARATE_PAGE_ANNEXES")}
                              className={`py-1 px-2 rounded-md transition cursor-pointer ${
                                solutionDisplayMode === "SEPARATE_PAGE_ANNEXES"
                                  ? "bg-emerald-700 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              صفحة منفصلة (الملحق)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* بطاقة الوصول السريع للأدوات الديداكتيكية والرياضية المتقدمة الأربعة */}
                    <div className="pt-2.5 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-indigo-950">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>أدوات التطوير الديداكتيكي والرياضي المتقدم:</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => handleOpenAdvancedPedagogyStudio("SPEC_2D")}
                          className="p-2 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 text-right transition cursor-pointer"
                        >
                          📊 جدول التخصيص 2D
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAdvancedPedagogyStudio("FUNCTION_PLOTTER")}
                          className="p-2 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 text-right transition cursor-pointer"
                        >
                          📈 منحنى C_f & tkz-tab
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAdvancedPedagogyStudio("OMR_MODELS")}
                          className="p-2 rounded-lg border border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-950 text-right transition cursor-pointer"
                        >
                          🔘 نماذج A/B/C/D و OMR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAdvancedPedagogyStudio("DIDACTIC_ERRORS")}
                          className="p-2 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-950 text-right transition cursor-pointer"
                        >
                          ⚠️ بنك الأخطاء الشائعة
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* التبويب 2: مختبر GeoGebra التفاعلي لتمارين الهندسة */}
                {col3Tab === "GEOGEBRA" &&
                  (activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-xs font-black text-teal-950 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={autoAttachGeoGebra}
                            onChange={(e) => setAutoAttachGeoGebra(e.target.checked)}
                            className="rounded text-teal-700 w-4 h-4 accent-teal-700"
                          />
                          <span>التضمين التلقائي للأشكال وروابط GeoGebra</span>
                        </label>
                        <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          .ggb / QR
                        </span>
                      </div>

                      <div className="bg-teal-50/50 border border-teal-200/90 rounded-xl p-3 space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-teal-950 mb-1">
                            التمرين المستهدف لإرفاق ملف GeoGebra أو الرابط التفاعلي:
                          </label>
                          <select
                            value={ggbTargetLessonKey}
                            onChange={(e) => setGgbTargetLessonKey(e.target.value)}
                            className="w-full border border-teal-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-slate-900"
                          >
                            <option value="__ALL_GEOMETRY__">
                              جميع تمارين الهندسة المستوية والفضائية والعقدية تلقائياً
                            </option>
                            {activeCustomLessons.map((l, idx) => (
                              <option key={idx} value={l.lessonFr}>
                                التمرين {idx + 1}:{" "}
                                {isMission || docLang === "FR" ? l.lessonFr : l.lessonAr}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-teal-950">
                            إضافة رابط نشاط تفاعلي (GeoGebra Classroom / Applet):
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={ggbLinkInput}
                              onChange={(e) => setGgbLinkInput(e.target.value)}
                              placeholder="https://www.geogebra.org/m/..."
                              dir="ltr"
                              className="flex-1 border border-teal-300 rounded-lg px-2.5 py-1.5 text-[11px] bg-white font-mono"
                            />
                            <button
                              type="button"
                              onClick={handleAddGeoGebraLink}
                              className="bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-black px-3 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Link2 className="w-3 h-3" />
                              <span>إدراج</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          {/* خيار GeoGebra 3D (.ggb) وتعليمات الهندسة الفضائية */}
                          <div className="bg-emerald-950/95 text-emerald-50 rounded-xl p-2.5 space-y-2 border border-emerald-700/70">
                            <div className="flex items-center justify-between gap-2">
                              <label className="flex items-center gap-2 text-[11px] font-black text-emerald-200 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isGeoGebra3DMode}
                                  onChange={(e) =>
                                    setIsGeoGebra3DMode(e.target.checked)
                                  }
                                  className="rounded text-emerald-400 w-3.5 h-3.5 accent-emerald-400"
                                />
                                <span>
                                  🧊 وضع الهندسة الفضائية ثلاثية الأبعاد (GeoGebra 3D .ggb)
                                </span>
                              </label>
                              <span
                                dir="ltr"
                                className="font-mono text-[9.5px] font-black bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded"
                              >
                                (O, i⃗, j⃗, k⃗)
                              </span>
                            </div>

                            {isGeoGebra3DMode && (
                              <div className="space-y-1.5 pt-1 border-t border-emerald-800/80">
                                <label className="block text-[10px] font-bold text-emerald-200">
                                  تعليمات خاصة بتمارين الهندسة الفضائية المرفقة بالملف:
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <select
                                    value={selectedSpatialPresetId}
                                    onChange={(e) =>
                                      setSelectedSpatialPresetId(
                                        e.target.value as typeof selectedSpatialPresetId
                                      )
                                    }
                                    className="flex-1 border border-emerald-700 rounded-lg px-2 py-1 text-[10.5px] bg-emerald-900/90 text-white font-bold"
                                  >
                                    {SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS.map(
                                      (sp) => (
                                        <option key={sp.id} value={sp.id}>
                                          {sp.titleAr}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const sp =
                                        SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS.find(
                                          (p) => p.id === selectedSpatialPresetId
                                        ) ||
                                        SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS[0];
                                      const preset3D =
                                        GEOGEBRA_PRESET_LIBRARY.find(
                                          (p) => p.is3D
                                        ) || GEOGEBRA_PRESET_LIBRARY[1];
                                      setGeoGebraResourcesMap((prev) => ({
                                        ...prev,
                                        [ggbTargetLessonKey]: {
                                          ...preset3D,
                                          id: `ggb_3d_${Date.now()}`,
                                          lessonKey: ggbTargetLessonKey,
                                          is3D: true,
                                          titleAr: `${sp.titleAr} — فضاء 3D (.ggb)`,
                                          titleFr: `${sp.titleFr} — GeoGebra 3D (.ggb)`,
                                          interactiveUrl:
                                            "https://www.geogebra.org/3d",
                                          spatialPresetType: sp.id,
                                          spatialInstructionsListAr:
                                            sp.instructionsAr,
                                          spatialInstructionsListFr:
                                            sp.instructionsFr,
                                        },
                                      }));
                                      setStatusMessage({
                                        type: "success",
                                        text: `✓ تم تضمين مشهد GeoGebra 3D (.ggb) مع تعليمات « ${sp.titleAr} » في الوثيقة!`,
                                      });
                                    }}
                                    className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[10.5px] shrink-0 cursor-pointer"
                                  >
                                    تضمين 3D
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <label className="cursor-pointer w-full justify-center bg-white hover:bg-teal-100/70 text-teal-950 border border-teal-300 rounded-lg px-3 py-2 text-xs font-black transition flex items-center gap-1.5 shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-teal-700" />
                            <span>
                              {isGeoGebra3DMode
                                ? "رفع ملف GeoGebra 3D (.ggb) للهندسة الفضائية أو صورة"
                                : "رفع ملف GeoGebra (.ggb) أو صورة شكل هندسي"}
                            </span>
                            <input
                              type="file"
                              accept=".ggb,.png,.svg,.jpg,.jpeg,.webp"
                              onChange={handleGeoGebraFileUpload}
                              className="hidden"
                            />
                          </label>

                          <select
                            defaultValue=""
                            onChange={(e) => {
                              const preset = GEOGEBRA_PRESET_LIBRARY.find(
                                (p) => p.id === e.target.value
                              );
                              if (preset) {
                                setGeoGebraResourcesMap((prev) => ({
                                  ...prev,
                                  [ggbTargetLessonKey]: {
                                    ...preset,
                                    lessonKey: ggbTargetLessonKey,
                                  },
                                }));
                                setStatusMessage({
                                  type: "success",
                                  text: `تم إدراج قالب GeoGebra التفاعلي « ${preset.titleAr} » في الفرض.`,
                                });
                              }
                            }}
                            className="w-full border border-teal-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-teal-950"
                          >
                            <option value="" disabled>
                              + اختيار قالب شكل هندسي جاهز (2D أو 3D فضائية) من المكتبة...
                            </option>
                            {GEOGEBRA_PRESET_LIBRARY.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.is3D ? "🧊 [3D] " : "📐 [2D] "}
                                {p.titleAr}
                              </option>
                            ))}
                          </select>
                        </div>

                        {Object.keys(geoGebraResourcesMap).length > 0 && (
                          <div className="pt-2 border-t border-teal-200/80 space-y-1">
                            <div className="text-[10.5px] font-extrabold text-teal-900">
                              المرفقات الهندسية المفعلة في الورقة:
                            </div>
                            {Object.entries(geoGebraResourcesMap).map(([key, res]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-teal-200 text-[11px]"
                              >
                                <span className="font-bold text-slate-800 truncate">
                                  {res.fileName ? `📄 ${res.fileName}` : `🔗 ${res.titleAr}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setGeoGebraResourcesMap((prev) => {
                                      const next = { ...prev };
                                      delete next[key];
                                      return next;
                                    })
                                  }
                                  className="text-rose-600 hover:underline font-bold text-[10px] mr-2 shrink-0 cursor-pointer"
                                >
                                  حذف
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* التبويب 3: مولد شبكات التقويم والتفريغ المخصصة (Excel & PDF) */}
                {col3Tab === "EVAL_GRID" &&
                  (activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                          <Table2 className="w-4 h-4 text-indigo-700 shrink-0" />
                          <span>شبكة التقويم وتفريغ النقط (Grille d&apos;évaluation)</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          Excel & PDF
                        </span>
                      </div>

                      <div className="bg-indigo-50/50 border border-indigo-200/90 rounded-xl p-3.5 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              تفصيل الشبكة:
                            </label>
                            <select
                              value={evalGridGranularity}
                              onChange={(e) =>
                                setEvalGridGranularity(e.target.value as GridGranularity)
                              }
                              className="w-full border border-indigo-200 rounded-lg px-2 py-1.5 text-xs bg-white font-bold text-slate-900"
                            >
                              <option value="BY_QUESTION">تفصيلي حسب كل سؤال وقدرة</option>
                              <option value="BY_EXERCISE">إجمالي حسب التمارين</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              عدد تلاميذ القسم:
                            </label>
                            <select
                              value={evalGridStudentCount}
                              onChange={(e) =>
                                setEvalGridStudentCount(Number(e.target.value))
                              }
                              className="w-full border border-indigo-200 rounded-lg px-2 py-1.5 text-xs bg-white font-bold text-slate-900 tabular-nums"
                            >
                              <option value={15}>15 تلميذاً</option>
                              <option value={25}>25 تلميذاً</option>
                              <option value={30}>30 تلميذاً</option>
                              <option value={35}>35 تلميذاً</option>
                              <option value={40}>40 تلميذاً</option>
                            </select>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs font-bold text-indigo-950 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeCustomEvalGridSheet}
                            onChange={(e) =>
                              setIncludeCustomEvalGridSheet(e.target.checked)
                            }
                            className="rounded text-indigo-700 w-4 h-4"
                          />
                          <span>
                            إرفاق صفحة شبكة التقويم وتفريغ النقط أسفل المعاينة الورقية (A4)
                          </span>
                        </label>

                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={handleExportEvaluationGridExcel}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <FileSpreadsheet className="w-4 h-4 shrink-0" />
                            <span>تصدير شبكة التقويم والتفريغ بصيغة Excel (.xls)</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={handleExportEvaluationGridPDF}
                              disabled={isExportingEvalGridPDF}
                              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-black py-2 px-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <FileDown className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {isExportingEvalGridPDF ? "جاري التصدير..." : "تصدير الشبكة PDF"}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={handleExportEvaluationGridCSV}
                              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-2 px-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                              <span>ملف مسار / CSV</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-[11px] font-bold text-slate-600">
                      توجيهات ديداكتيكية إضافية للتوليد الذكي (اختياري):
                    </label>
                    <InlineVoiceDictationButton
                      compact
                      defaultLang={isMission || docLang === "FR" ? "fr-FR" : "ar-MA"}
                      title="تسجيل الملاحظات والتوجيهات الديداكتيكية بالصوت عبر الميكروفون"
                      onTranscript={(spoken) =>
                        setCustomTopicNote((prev) =>
                          prev ? `${prev} ${spoken}` : spoken
                        )
                      }
                    />
                  </div>
                  <input
                    type="text"
                    value={customTopicNote}
                    onChange={(e) => setCustomTopicNote(e.target.value)}
                    placeholder={
                      isMission
                        ? "Ex: Insister sur la convexité et le TVI..."
                        : "مثال: التركيز على المتتاليات الترجعية أو مبرهنة القيم الوسيطية..."
                    }
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>
              </div>

              {/* أزرار التوليد في أسفل العمود الثالث */}
              <div className="space-y-2 pt-3 border-t border-slate-200 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    triggerOfflineGeneration();
                    setStatusMessage({
                      type: "success",
                      text: `تم تحديث الوثيقة والنماذج المختارة فوراً (${activeCustomLessons.length} دروس فعالة).`,
                    });
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2 px-4 rounded-xl transition text-xs flex justify-center items-center gap-2 whitespace-nowrap active:scale-98 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  <span>تحديث فوري للوثيقة والنماذج</span>
                </button>

                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI}
                  className="w-full bg-indigo-950 hover:bg-indigo-900 disabled:opacity-60 text-white font-black py-2.5 px-4 rounded-xl transition text-xs flex justify-center items-center gap-2 whitespace-nowrap active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    {isGeneratingAI
                      ? "جاري بناء التمارين والحلول المفصلة..."
                      : `توليد ذكي متقدم عبر Gemini (${isMission ? "Type Bac" : "الأطر المرجعية"})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPedagogicalAiInitialTask(undefined);
                    setPedagogicalAiInitialView("WORKSPACE");
                    setShowPedagogicalAiModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-900 to-indigo-950 hover:from-cyan-800 hover:to-indigo-900 text-cyan-200 border border-cyan-700/50 font-black py-2 px-4 rounded-xl transition text-xs flex justify-center items-center gap-2 whitespace-nowrap active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span>استوديو المساعد الديداكتيكي والبرهان (9 مهام ذكية)</span>
                </button>

                {/* بطاقة التعديلات البيداغوجية الذكية المقترحة على الفرض (PedagogicalAiAssistantModal Quick Actions) */}
                <div className="bg-slate-900/95 border border-cyan-800/50 rounded-xl p-2.5 space-y-2 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>تعديلات بيداغوجية مقترحة على الفرض:</span>
                    </span>
                    {activeCustomLessons.length > 1 && (
                      <select
                        value={pedagogicalAiInitialLessonIdx}
                        onChange={(e) =>
                          setPedagogicalAiInitialLessonIdx(
                            Number(e.target.value)
                          )
                        }
                        className="bg-slate-800 text-cyan-200 border border-slate-700 rounded-md px-1.5 py-0.5 text-[10px] font-bold max-w-[135px] truncate"
                        title="اختر التمرين المستهدف في الفرض لطلب تعديل بيداغوجي عليه"
                      >
                        {activeCustomLessons.map((l, idx) => (
                          <option key={`ai_side_target_${idx}`} value={idx}>
                            ت{idx + 1}: {l.lessonAr}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenPedagogicalAiWithTask(
                          "GENERATE_ISOMORPHIC_VARIANT",
                          pedagogicalAiInitialLessonIdx
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg text-[10.5px] font-black bg-indigo-950/90 hover:bg-indigo-900 text-cyan-200 border border-cyan-700/50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="اقتراح أسئلة موازية وتوليد نموذج متكافئ (Sujet B) للتمرين المحدد"
                    >
                      <RefreshCw className="w-3 h-3 text-cyan-300 shrink-0" />
                      <span>اقتراح أسئلة موازية</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenPedagogicalAiWithTask(
                          "SIMPLIFY_COMPLEX_WORDING",
                          pedagogicalAiInitialLessonIdx
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg text-[10.5px] font-black bg-teal-950/90 hover:bg-teal-900 text-teal-200 border border-teal-700/50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="تبسيط صياغة المسائل المعقدة وتفكيك الأسئلة المركبة إلى خطوات متدرجة ميسرة"
                    >
                      <Edit3 className="w-3 h-3 text-teal-300 shrink-0" />
                      <span>تبسيط صياغة المسائل</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* رسالة الحالة الإشعارية */}
        {statusMessage && (
          <div
            className={`px-4 py-3 rounded-lg border text-xs font-bold flex items-center justify-between no-print ${
              statusMessage.type === "error"
                ? "bg-red-50 border-red-200 text-red-900"
                : statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-indigo-50 border-indigo-200 text-indigo-900"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs underline hover:opacity-80"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* منطقة المخرجات: استوديو المعاينة الورقية A4 أو الكود المصدري */}
        <section className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex flex-nowrap justify-between items-center border-b border-slate-200 pb-3.5 gap-2.5 overflow-x-auto studio-scroll no-print">
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("PREVIEW")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === "PREVIEW"
                      ? "bg-white text-slate-950 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-700" />
                  <span>المعاينة الورقية (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("CODE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === "CODE"
                      ? "bg-white text-slate-950 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-700" />
                  <span>
                    الكود المصدري ({exportFormat === "TYPST" ? "Typst" : "LaTeX"})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("SPLIT");
                    setSyncScrollEnabled(true);
                  }}
                  title="عرض محرر الكود المصدري ومعاينة الورقة A4 جنباً إلى جنب مع التمرير المتزامن والتركيز التلقائي"
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === "SPLIT"
                      ? "bg-indigo-950 text-cyan-300 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 text-cyan-500" />
                  <span>عرض مزدوج متزامن (الكود + الورقة)</span>
                </button>
              </div>

              {/* زر تفعيل/إيقاف التمرير المتزامن والتركيز التلقائي بين الكود والورقة */}
              <button
                type="button"
                onClick={() => setSyncScrollEnabled((v) => !v)}
                title="مزامنة موضع التمرير تلقائياً والتركيز على القسم المقابل بين محرر الكود ومعاينة الورقة"
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  syncScrollEnabled
                    ? "bg-cyan-50 text-cyan-950 border-cyan-300"
                    : "bg-white text-slate-500 border-slate-200 hover:text-slate-800"
                }`}
              >
                <Link2 className={`w-3.5 h-3.5 ${syncScrollEnabled ? "text-cyan-700" : "text-slate-400"}`} />
                <span>{syncScrollEnabled ? "التمرير المتزامن مفعل" : "تفعيل التمرير المتزامن"}</span>
              </button>

              {/* زر وضع التركيز الورقي الكامل (Focus Paper Mode) لطي لوحات الإعداد وإفراد المساحة للورقة */}
              <button
                type="button"
                onClick={() => {
                  const nextCollapsed = !isConfigDeckCollapsed;
                  setIsConfigDeckCollapsed(nextCollapsed);
                  if (nextCollapsed) {
                    setShowQuickEditor(false);
                  }
                }}
                title="وضع التركيز الورقي: طي لوحات الضبط الجانبية والعلوية لتوسيع مساحة معاينة وطبع ورقة A4"
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  isConfigDeckCollapsed && !showQuickEditor
                    ? "bg-indigo-950 text-amber-300 border-indigo-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-950"
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-cyan-500" />
                <span>{isConfigDeckCollapsed && !showQuickEditor ? "إلغاء التركيز الورقي" : "وضع التركيز الورقي A4"}</span>
              </button>

              {/* مبدل سريع للنماذج وعناصر الإجابة مباشرة فوق المعاينة */}
              {viewMode === "PREVIEW" &&
                (activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                  <>
                    <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setExamModel("A")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          examModel === "A"
                            ? "bg-white text-indigo-950 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Sujet A
                      </button>
                      <button
                        type="button"
                        onClick={() => setExamModel("B")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          examModel === "B"
                            ? "bg-white text-indigo-950 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Sujet B
                      </button>
                      <button
                        type="button"
                        onClick={() => setExamModel("BOTH")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          examModel === "BOTH"
                            ? "bg-emerald-700 text-white shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        A + B
                      </button>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer bg-emerald-50/70 px-3 py-1.5 rounded-xl border border-emerald-200 whitespace-nowrap shrink-0">
                        <input
                          type="checkbox"
                          checked={includeDetailedSolutions}
                          onChange={(e) => setIncludeDetailedSolutions(e.target.checked)}
                          className="rounded text-emerald-700 w-3.5 h-3.5 accent-emerald-700"
                        />
                        <span className="font-extrabold text-emerald-950">التصحيح التفصيلي</span>
                      </label>

                      {includeDetailedSolutions && (
                        <div className="flex items-center gap-1 bg-emerald-100/70 p-0.5 rounded-xl border border-emerald-200 text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => setSolutionDisplayMode("INLINE_PER_EXERCISE")}
                            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                              solutionDisplayMode === "INLINE_PER_EXERCISE"
                                ? "bg-white text-emerald-950 shadow-2xs font-extrabold"
                                : "text-emerald-900 hover:text-emerald-950"
                            }`}
                          >
                            بجانب التمرين
                          </button>
                          <button
                            type="button"
                            onClick={() => setSolutionDisplayMode("SEPARATE_PAGE_ANNEXES")}
                            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                              solutionDisplayMode === "SEPARATE_PAGE_ANNEXES"
                                ? "bg-white text-emerald-950 shadow-2xs font-extrabold"
                                : "text-emerald-900 hover:text-emerald-950"
                            }`}
                          >
                            صفحة الملحق
                          </button>
                        </div>
                      )}

                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer mr-1">
                        <input
                          type="checkbox"
                          checked={showAnswerKey}
                          onChange={(e) => setShowAnswerKey(e.target.checked)}
                          className="rounded text-indigo-700 w-3.5 h-3.5"
                        />
                        <span>ملخص التنقيط</span>
                      </label>
                    </div>
                  </>
                )}
            </div>

            {/* أدوات التحكم في التكبير، شبكات التقويم، الحفظ في Google Drive، تصدير PDF، والطباعة في صف واحد */}
            <div className="flex items-center gap-2 shrink-0">
              {viewMode === "PREVIEW" && (
                <>
                  {/* مبدل تنسيق الورقة عمودي (Portrait) / أفقي (Landscape) */}
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-300 text-xs font-bold shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setPageOrientation("PORTRAIT")}
                      title="تنسيق الورقة عمودي (Portrait)"
                      className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                        pageOrientation === "PORTRAIT"
                          ? "bg-indigo-950 text-white font-extrabold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <RectangleVertical className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">عمودي</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageOrientation("LANDSCAPE")}
                      title="تنسيق الورقة أفقي (Landscape)"
                      className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                        pageOrientation === "LANDSCAPE"
                          ? "bg-indigo-950 text-white font-extrabold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <RectangleHorizontal className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">أفقي</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom((z) => Math.max(75, z - 10))}
                      title="تصغير المعاينة"
                      className="p-1 rounded-lg text-slate-600 hover:bg-white transition cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] px-1.5 tabular-nums">{previewZoom}%</span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom((z) => Math.min(125, z + 10))}
                      title="تكبير المعاينة"
                      className="p-1 rounded-lg text-slate-600 hover:bg-white transition cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {(activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleExportEvaluationGridExcel}
                    title="توليد وتحميل شبكة التقويم وتفريغ النقط بصيغة Excel (.xls) مع المعادلات التلقائية"
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>شبكة Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportEvaluationGridPDF}
                    disabled={isExportingEvalGridPDF}
                    title="تصدير شبكة التقويم والتفريغ المخصصة بصيغة PDF"
                    className="bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-800 border border-slate-300 text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Table2 className="w-3.5 h-3.5 text-cyan-700" />
                    <span>
                      {isExportingEvalGridPDF ? "جاري..." : "شبكة PDF"}
                    </span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveToGoogleDrive}
                disabled={isUploadingDrive}
                className="bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-800 border border-slate-300 text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                <CloudUpload className="w-3.5 h-3.5 text-sky-700" />
                <span>{isUploadingDrive ? "جاري الرفع..." : "حفظ في Drive"}</span>
              </button>

              {includeDetailedSolutions && solutionDisplayMode === "SEPARATE_PAGE_ANNEXES" && (
                <button
                  type="button"
                  onClick={() => handlePrint(true)}
                  title="طباعة صفحة الملحق وعناصر الإجابة المفصلة فقط"
                  className="bg-slate-900 hover:bg-slate-800 text-cyan-200 text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>طباعة الملحق فقط</span>
                </button>
              )}

              {viewMode === "CODE" && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "تم النسخ" : "نسخ الكود"}</span>
                </button>
              )}

              {exportFormat !== "PDF" && (
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="bg-slate-900 hover:bg-slate-800 text-cyan-200 text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تحميل ({exportFormat === "LATEX" ? ".tex" : ".typ"})</span>
                </button>
              )}
            </div>
          </div>

          {/* محرر العناوين السريع المزود بالتحقق من صحة البيانات (Validation) بعد دمج خيارات التنسيق والخطوط في لوحة الإعدادات */}
          {viewMode === "PREVIEW" && (
            <div
              className={`border rounded-xl p-3 space-y-2.5 no-print transition-colors ${
                quickEditorValidation.hasErrors
                  ? "bg-rose-50/60 border-rose-300"
                  : "bg-slate-50/90 border-slate-200/90"
              }`}
            >
              <div className="flex flex-nowrap items-center justify-between gap-2.5 overflow-x-auto studio-scroll">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                    <PenLine className="w-4 h-4 text-indigo-700 shrink-0" />
                    <span className="text-xs font-black text-slate-950">
                      محرر العناوين السريع
                    </span>
                  </div>

                  {/* مؤشر التحقق من صحة البيانات (Validation Status Badge) */}
                  {quickEditorValidation.hasErrors ? (
                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-0.5 rounded-lg text-[11px] font-black whitespace-nowrap">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>
                        تنبيه: {quickEditorValidation.errorCount} عنوان رئيسي فارغ!
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-lg text-[10.5px] font-bold whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>العناوين الرئيسية مكتملة</span>
                    </span>
                  )}

                  {/* أداة التراجع والإعادة (Undo / Redo) */}
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300 shadow-2xs shrink-0">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      title="تراجع عن التعديل الأخير (Ctrl + Z)"
                      className="px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 active:scale-95 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5 text-indigo-800 shrink-0" />
                      <span className="hidden sm:inline">تراجع</span>
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200" />
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={!canRedo}
                      title="إعادة تطبيق التعديل (Ctrl + Y)"
                      className="px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 active:scale-95 cursor-pointer"
                    >
                      <Redo2 className="w-3.5 h-3.5 text-indigo-800 shrink-0" />
                      <span className="hidden sm:inline">إعادة</span>
                    </button>
                    {history.length > 1 && (
                      <span className="text-[10px] text-slate-400 font-mono font-bold px-1 tabular-nums">
                        {historyIndex + 1}/{history.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* أزرار الانتقال لإعدادات الخطوط والتنسيق، قائمة خطوط تبويبات العناوين، محاكي الخطوط التقليدية، التعديل الحر، وطي المحرر */}
                <div className="flex items-center gap-1.5 text-xs shrink-0">
                  <select
                    aria-label="اختيار خط العناوين التقليدي"
                    value={appliedTitleCalligraphy.fontId}
                    onChange={(e) => {
                      const nextFontId = e.target.value as TraditionalTitleFontId;
                      const fontOpt = TRADITIONAL_TITLE_FONT_OPTIONS.find(
                        (f) => f.id === nextFontId
                      );
                      const nextOrnament =
                        fontOpt?.recommendedOrnament ??
                        (nextFontId === "DEFAULT_DOC" ? "NONE" : appliedTitleCalligraphy.ornament);
                      const nextScale = fontOpt?.recommendedScale ?? appliedTitleCalligraphy.scale;
                      const parsedDefaultSpacing = fontOpt?.letterSpacing
                        ? parseFloat(fontOpt.letterSpacing.replace("em", ""))
                        : 0.025;
                      setAppliedTitleCalligraphy((prev) => ({
                        ...prev,
                        fontId: nextFontId,
                        ornament: nextOrnament,
                        scale: nextScale,
                        enableMoroccanHeaderOrnament: nextOrnament !== "NONE",
                        customLetterSpacingEm: Number.isNaN(parsedDefaultSpacing)
                          ? 0.025
                          : parsedDefaultSpacing,
                      }));
                      if (fontOpt?.moroccanHeaderFramePreset && !isMission) {
                        setHeaderStyle("OFFICIAL_AREF");
                      }
                      setStatusMessage({
                        type: "success",
                        text:
                          nextFontId === "DEFAULT_DOC"
                            ? "تمت استعادة خط العناوين القياسي للوثيقة."
                            : `تم اختيار «${fontOpt?.nameAr}» لتبويبات العناوين مع ضبط التباعد والزخرفة للترويسة المغربية الرسمية!`,
                      });
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-black bg-amber-50/90 hover:bg-amber-100 text-amber-950 border border-amber-300 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                    title="اختيار خط تبويبات العناوين من قوالب الخطوط التقليدية (شامل الخط الأندلسي المغربي Maghribi Script)"
                  >
                    {TRADITIONAL_TITLE_FONT_OPTIONS.map((tFont) => (
                      <option key={tFont.id} value={tFont.id}>
                        {tFont.id === "DEFAULT_DOC"
                          ? "خط العناوين: القياسي"
                          : `خط العناوين: ${tFont.nameAr}`}
                      </option>
                    ))}
                  </select>

                  {/* زر تبديل سريع (Toggle) للزخرفة المغربية مع أيقونة مصغرة + شريط تمرير التباعد الأفقي (Letter Spacing) في شريط محرر العناوين */}
                  {(() => {
                    const isOrnEnabled =
                      (appliedTitleCalligraphy.enableMoroccanHeaderOrnament ?? true) &&
                      appliedTitleCalligraphy.ornament !== "NONE";
                    const miniMeta = getTitleOrnamentMiniPreview(
                      appliedTitleCalligraphy.ornament === "NONE"
                        ? "ANDALUSI_MOROCCAN"
                        : appliedTitleCalligraphy.ornament,
                      isOrnEnabled
                    );
                    const spacingVal =
                      appliedTitleCalligraphy.customLetterSpacingEm ?? 0.025;
                    return (
                      <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50/85 border border-amber-300 text-[10.5px]">
                        <button
                          type="button"
                          onClick={() => {
                            const nextEnabled = !isOrnEnabled;
                            setAppliedTitleCalligraphy((prev) => ({
                              ...prev,
                              enableMoroccanHeaderOrnament: nextEnabled,
                              ornament:
                                nextEnabled && prev.ornament === "NONE"
                                  ? "ANDALUSI_MOROCCAN"
                                  : prev.ornament,
                            }));
                          }}
                          title="تفعيل أو إلغاء الزخرفة الخاصة بالترويسة المغربية (مع أيقونة مصغرة لشكل الزخرفة)"
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-black border transition cursor-pointer ${
                            isOrnEnabled
                              ? "bg-amber-900 text-amber-200 border-amber-800"
                              : "bg-white text-slate-600 border-slate-300"
                          }`}
                        >
                          <span className="font-serif">{miniMeta.miniIconGlyph}</span>
                          <span>{isOrnEnabled ? "زخرفة مفعّلة" : "بدون زخرفة"}</span>
                        </button>
                        <div className="flex items-center gap-1.5" title="التباعد الأفقي بين الحروف للترويسة (Letter Spacing)">
                          <span className="font-bold text-amber-950">تباعد:</span>
                          <input
                            type="range"
                            min={0}
                            max={0.12}
                            step={0.005}
                            value={spacingVal}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setAppliedTitleCalligraphy((prev) => ({
                                ...prev,
                                customLetterSpacingEm: val,
                              }));
                            }}
                            className="w-16 h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
                          />
                          <span className="font-mono text-[10px] font-black text-amber-900">
                            {spacingVal.toFixed(3)}em
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickEditor(true);
                      setShowCalligraphySimulator((v) => !v);
                    }}
                    title="فتح أو إغلاق محاكي معاينة الخطوط العربية التقليدية (الخط الأندلسي المغربي، الديواني، الثلث، الرقعة، الكوفي) للتأكد من تناسق العناوين قبل التصميم النهائي"
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 border whitespace-nowrap cursor-pointer ${
                      showCalligraphySimulator
                        ? "bg-slate-900 text-amber-300 border-slate-900 shadow-2xs"
                        : "bg-amber-50/80 text-amber-950 border-amber-300 hover:bg-amber-100"
                    }`}
                  >
                    <span className="font-serif text-xs">ق</span>
                    <span>
                      محاكي الخطوط التقليدية (الأندلسي المغربي / الثلث)
                      {appliedTitleCalligraphy.fontId !== "DEFAULT_DOC"
                        ? ` · ${
                            TRADITIONAL_TITLE_FONT_OPTIONS.find(
                              (f) => f.id === appliedTitleCalligraphy.fontId
                            )?.shortAr || ""
                          }`
                        : ""}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsConfigDeckCollapsed(false);
                      setCol1Tab("FONTS_PAGE");
                      setStatusMessage({
                        type: "info",
                        text: "تم فتح تبويب «الخطوط والورقة» ضمن العمود الأول للتحكم في خطوط العناوين والمتن والكتابة باليد.",
                      });
                    }}
                    title="فتح خيارات التنسيق والتحكم في الخطوط ضمن لوحة الإعدادات"
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Type className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                    <span>
                      إعدادات الخطوط والتنسيق ({DOC_FONT_OPTIONS.find((f) => f.id === docFontFamily)?.shortAr})
                    </span>
                  </button>

                  {/* أزرار الأدوات التفاعلية المجمعة بأناقة لمنع الازدحام */}
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setShowWolframVerifierModal(true)}
                      title="مختبر WolframAlpha للتحقق من الصيغ الرياضية"
                      className="p-1.5 rounded text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAdvancedPedagogyStudio("BAC_ANNALES")}
                      title="بنك امتحانات البكالوريا الرسمية (Annales Bac)"
                      className="p-1.5 rounded text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAdvancedPedagogyStudio("TBI_PROJECTOR")}
                      title="وضع العرض الصفي والسبورة التفاعلية (Mode TBI)"
                      className="p-1.5 rounded text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQuickVoiceDictation((v) => !v)}
                      title="استوديو الإملاء الصوتي (Voice-to-Text)"
                      className={`p-1.5 rounded transition cursor-pointer ${
                        showQuickVoiceDictation
                          ? "bg-rose-600 text-white shadow-xs"
                          : "text-slate-700 hover:text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsInlineEditable((v) => !v)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 border whitespace-nowrap cursor-pointer ${
                      isInlineEditable
                        ? "bg-indigo-700 text-white border-indigo-700"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>
                      {isInlineEditable
                        ? "✓ التعديل الحر مفعل"
                        : "تعديل بالورقة"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQuickEditor((v) => !v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black border transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      showQuickEditor
                        ? "bg-indigo-950 text-white border-indigo-950 shadow-xs"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-xs"
                    }`}
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>{showQuickEditor ? "إخفاء حقول العناوين ▲" : "تحرير العناوين والترويسة ▼"}</span>
                  </button>
                </div>
              </div>

              {/* استوديو الإملاء الصوتي التربوي والرياضي المباشر عبر الميكروفون (Voice-to-Text Studio) */}
              {showQuickVoiceDictation && (
                <div className="pt-1">
                  <DocumentVoiceDictationStudio
                    isFr={isMission || docLang === "FR"}
                    onEnsureInlineEditable={() => setIsInlineEditable(true)}
                    onInsertAtCursor={(txt) => {
                      setIsInlineEditable(true);
                      const sheet = document.getElementById(
                        "printable-document-sheet"
                      );
                      const sel = window.getSelection();
                      if (
                        sel &&
                        sel.rangeCount > 0 &&
                        sheet &&
                        sheet.contains(sel.anchorNode)
                      ) {
                        document.execCommand("insertText", false, txt);
                      } else {
                        setCustomHeaderNote((prev) =>
                          prev ? `${prev} · ${txt.trim()}` : txt.trim()
                        );
                      }
                    }}
                    onAppendHeaderInstruction={(txt) =>
                      setCustomHeaderNote((prev) =>
                        prev ? `${prev} · ${txt}` : txt
                      )
                    }
                    onAppendPedagogicalNote={(txt) =>
                      setCustomTopicNote((prev) =>
                        prev ? `${prev} ${txt}` : txt
                      )
                    }
                    onUpdateDocTitle={(txt) => setCustomDocTitle(txt)}
                  />
                </div>
              )}

              {/* شريط تنبيه المستخدم الفوري عند ترك أي عنوان رئيسي فارغاً (Validation Alert Banner) */}
              {quickEditorValidation.hasErrors && (
                <div
                  role="alert"
                  className="bg-rose-100/95 border border-rose-300 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-950"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                    <div>
                      <span className="font-black">
                        تنبيه التحقق من صحة البيانات (Validation):{" "}
                      </span>
                      <span className="font-semibold">
                        يرجى عدم ترك العناوين الرئيسية فارغة! الحقول المطلوبة الفارغة حالياً:{" "}
                        <strong className="underline">
                          {quickEditorValidation.errorMessages.join(" ، ")}
                        </strong>
                        .
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFixEmptyQuickTitles}
                    className="bg-rose-700 hover:bg-rose-800 text-white font-black px-3 py-1.5 rounded-lg text-[11px] transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>إصلاح واستعادة العناوين الفارغة تلقائياً</span>
                  </button>
                </div>
              )}

              <AnimatePresence initial={false}>
                {showQuickEditor && (
                  <motion.div
                    key="quick-editor-fields"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-2.5 border-t border-slate-200/80">
                      {/* الصف الأول: العناوين الرئيسية الأربعة مع التحقق الفوري من عدم تركها فارغة */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {/* 1. عنوان الوثيقة الرئيسي */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-700">
                              العنوان الرئيسي للوثيقة <span className="text-rose-600">*</span>
                            </label>
                            {quickEditorValidation.emptyDocTitle && (
                              <button
                                type="button"
                                onClick={() => setCustomDocTitle(defaultDocTitle)}
                                className="text-[10px] font-black text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
                              >
                                استعادة الافتراضي
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            aria-invalid={quickEditorValidation.emptyDocTitle}
                            value={customDocTitle}
                            onChange={(e) => setCustomDocTitle(e.target.value)}
                            onBlur={(e) =>
                              handlePrimaryTitleBlur("العنوان الرئيسي للوثيقة", e.target.value)
                            }
                            placeholder="أدخل العنوان الرئيسي للوثيقة..."
                            className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                              quickEditorValidation.emptyDocTitle
                                ? "border-rose-500 bg-rose-50/80 text-rose-950 focus:ring-2 focus:ring-rose-500/30"
                                : "border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-600"
                            }`}
                          />
                          {quickEditorValidation.emptyDocTitle && (
                            <p className="mt-1 text-[10.5px] font-bold text-rose-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>لا يمكن ترك العنوان الرئيسي فارغاً</span>
                            </p>
                          )}
                        </div>

                        {/* 2. العنوان الفرعي / المدة وسلم التنقيط */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-700">
                              العنوان الفرعي والمدة <span className="text-rose-600">*</span>
                            </label>
                            {quickEditorValidation.emptyDocSubtitle && (
                              <button
                                type="button"
                                onClick={() => setCustomDocSubtitle(defaultDocSubtitle)}
                                className="text-[10px] font-black text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
                              >
                                استعادة الافتراضي
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            aria-invalid={quickEditorValidation.emptyDocSubtitle}
                            value={customDocSubtitle}
                            onChange={(e) => setCustomDocSubtitle(e.target.value)}
                            onBlur={(e) =>
                              handlePrimaryTitleBlur("العنوان الفرعي والمدة", e.target.value)
                            }
                            placeholder="أدخل العنوان الفرعي والمدة..."
                            className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                              quickEditorValidation.emptyDocSubtitle
                                ? "border-rose-500 bg-rose-50/80 text-rose-950 focus:ring-2 focus:ring-rose-500/30"
                                : "border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-600"
                            }`}
                          />
                          {quickEditorValidation.emptyDocSubtitle && (
                            <p className="mt-1 text-[10.5px] font-bold text-rose-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>لا يمكن ترك العنوان الفرعي فارغاً</span>
                            </p>
                          )}
                        </div>

                        {/* 3. اسم المؤسسة التعليمية */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-700">
                              المؤسسة التعليمية <span className="text-rose-600">*</span>
                            </label>
                            {quickEditorValidation.emptySchool && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSchool(
                                    isMission
                                      ? "Lycée Lyautey (Casablanca)"
                                      : DEFAULT_PREFS.school
                                  )
                                }
                                className="text-[10px] font-black text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
                              >
                                استعادة الافتراضي
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            aria-invalid={quickEditorValidation.emptySchool}
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            onBlur={(e) =>
                              handlePrimaryTitleBlur("اسم المؤسسة التعليمية", e.target.value)
                            }
                            placeholder="أدخل اسم المؤسسة التعليمية..."
                            className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                              quickEditorValidation.emptySchool
                                ? "border-rose-500 bg-rose-50/80 text-rose-950 focus:ring-2 focus:ring-rose-500/30"
                                : "border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-600"
                            }`}
                          />
                          {quickEditorValidation.emptySchool && (
                            <p className="mt-1 text-[10.5px] font-bold text-rose-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>لا يمكن ترك اسم المؤسسة فارغاً</span>
                            </p>
                          )}
                        </div>

                        {/* 4. اسم الأستاذ(ة) */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-700">
                              اسم الأستاذ(ة) <span className="text-rose-600">*</span>
                            </label>
                            {quickEditorValidation.emptyProf && (
                              <button
                                type="button"
                                onClick={() => setProf(DEFAULT_PREFS.prof)}
                                className="text-[10px] font-black text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
                              >
                                استعادة الافتراضي
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            aria-invalid={quickEditorValidation.emptyProf}
                            value={prof}
                            onChange={(e) => setProf(e.target.value)}
                            onBlur={(e) =>
                              handlePrimaryTitleBlur("اسم الأستاذ(ة)", e.target.value)
                            }
                            placeholder="أدخل اسم الأستاذ(ة)..."
                            className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                              quickEditorValidation.emptyProf
                                ? "border-rose-500 bg-rose-50/80 text-rose-950 focus:ring-2 focus:ring-rose-500/30"
                                : "border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-600"
                            }`}
                          />
                          {quickEditorValidation.emptyProf && (
                            <p className="mt-1 text-[10.5px] font-bold text-rose-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>لا يمكن ترك اسم الأستاذ(ة) فارغاً</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* الصف الثاني: عناوين التمارين الرئيسية + ملاحظة الترويسة الاختيارية */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/70">
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <label className="block text-[10.5px] font-bold text-slate-600">
                              توجيه أو ملاحظة عامة في الترويسة (اختياري):
                            </label>
                            <InlineVoiceDictationButton
                              compact
                              defaultLang={
                                isMission || docLang === "FR" ? "fr-FR" : "ar-MA"
                              }
                              title="تسجيل تعليمات الفرض أو ملاحظات الترويسة صوتياً عبر الميكروفون"
                              onTranscript={(spoken) =>
                                setCustomHeaderNote((prev) =>
                                  prev ? `${prev} · ${spoken}` : spoken
                                )
                              }
                            />
                          </div>
                          <input
                            type="text"
                            value={customHeaderNote}
                            onChange={(e) => setCustomHeaderNote(e.target.value)}
                            placeholder={
                              isMission || docLang === "FR"
                                ? "Ex: Calculatrice non programmable autorisée"
                                : "مثال: يُسمح باستعمال الآلة الحاسبة غير القابلة للبرمجة"
                            }
                            className="w-full border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          />
                        </div>

                        {(activeModule === "DS_142_08" || activeModule === "DM_SERIE") && (() => {
                          const isSerieTD = activeModule === "DM_SERIE" && dmSubType === "SERIE_TD";
                          const totalExCount = isSerieTD ? serieExerciseCount : activeCustomLessons.length;
                          const quickEditorExercises = isSerieTD
                            ? Array.from({ length: serieExerciseCount }).map((_, idx) => ({
                                lesson: activeCustomLessons[idx % Math.max(1, activeCustomLessons.length)],
                                idx,
                              }))
                            : activeCustomLessons.map((lesson, idx) => ({ lesson, idx }));

                          return (
                            <div className="md:col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10.5px] font-bold text-slate-700">
                                  {isSerieTD
                                    ? `عناوين تمارين السلسلة (${totalExCount} تمارين) `
                                    : `عناوين التمارين الرئيسية (${totalExCount} تمارين) `}
                                  <span className="text-rose-600">*</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomDocTitle(defaultDocTitle);
                                    setCustomDocSubtitle(defaultDocSubtitle);
                                    setCustomHeaderNote("");
                                    setCustomExerciseTitles(defaultExerciseTitles);
                                    setStatusMessage({
                                      type: "info",
                                      text: "تمت استعادة جميع العناوين الرئيسية الافتراضية للترويسة والتمارين.",
                                    });
                                  }}
                                  className="text-[10px] font-bold text-indigo-700 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>استعادة كافة العناوين الافتراضية</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {quickEditorExercises.map(({ lesson, idx }) => {
                                  const exVal = customExerciseTitles[idx] ?? "";
                                  const isExEmpty = exVal.trim().length === 0;
                                  const lessonKey = lesson
                                    ? `${currentTrack.code}_${lesson.lessonFr}`
                                    : "";
                                  const currentLessonIconId: LessonHeaderIconId = lesson
                                    ? customLessonIconsMap[lessonKey] ||
                                      lesson.customHeaderIcon ||
                                      "AUTO"
                                    : "AUTO";
                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex items-center gap-1">
                                        {lesson && (
                                          <LessonHeaderIconBadge
                                            lesson={lesson}
                                            overrideIconId={currentLessonIconId}
                                          />
                                        )}
                                        <input
                                          type="text"
                                          required
                                          aria-invalid={isExEmpty}
                                          value={exVal}
                                          onChange={(e) =>
                                            setCustomExerciseTitles((prev) => ({
                                              ...prev,
                                              [idx]: e.target.value,
                                            }))
                                          }
                                          onBlur={(e) =>
                                            handlePrimaryTitleBlur(
                                              `عنوان التمرين رقم ${idx + 1}`,
                                              e.target.value
                                            )
                                          }
                                          placeholder={
                                            isMission || docLang === "FR"
                                              ? `Exercice ${idx + 1} : ${lesson?.lessonFr || "Exercice"}`
                                              : `التمرين ${idx + 1} : ${lesson?.lessonAr || "تمرين"}`
                                          }
                                          className={`w-full border rounded-lg px-2 py-1 text-xs font-semibold transition focus:outline-none ${
                                            isExEmpty
                                              ? "border-rose-500 bg-rose-50/80 text-rose-950 focus:ring-2 focus:ring-rose-500/30"
                                              : "border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-600"
                                          }`}
                                        />
                                        {lesson && (
                                          <select
                                            value={currentLessonIconId}
                                            onChange={(e) =>
                                              handleLessonIconChange(
                                                lesson.lessonFr,
                                                e.target.value as LessonHeaderIconId,
                                                isMission ? lesson.lessonFr : lesson.lessonAr
                                              )
                                            }
                                            title="تخصيص أيقونة ترويسة التمرين في الورقة المطبوعة"
                                            className="border border-indigo-200 bg-indigo-50/70 text-indigo-950 rounded-md px-1.5 py-1 text-[10px] font-bold shrink-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                          >
                                            {LESSON_HEADER_ICON_OPTIONS.map((opt) => (
                                              <option key={opt.id} value={opt.id}>
                                                {opt.mathSymbol
                                                  ? `${opt.mathSymbol} ${opt.labelAr}`
                                                  : opt.labelAr}
                                              </option>
                                            ))}
                                          </select>
                                        )}
                                        {isExEmpty && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setCustomExerciseTitles((prev) => ({
                                                ...prev,
                                                [idx]:
                                                  defaultExerciseTitles[idx] ||
                                                  `التمرين ${idx + 1} : ${lesson?.lessonAr || "تمرين"}`,
                                              }))
                                            }
                                            className="px-1.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded text-[10px] font-black shrink-0 cursor-pointer"
                                          >
                                            استعادة
                                          </button>
                                        )}
                                      </div>
                                      {isExEmpty && (
                                        <p className="mt-0.5 text-[10px] font-bold text-rose-700 flex items-center gap-1">
                                          <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                          <span>عنوان التمرين {idx + 1} لا يمكن تركه فارغاً</span>
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* محاكي معاينة الخطوط العربية التقليدية (الديواني، الثلث، المغربي، الرقعة، الكوفي) للتأكد من تناسق العناوين قبل التصميم النهائي */}
                      <AnimatePresence initial={false}>
                        {showCalligraphySimulator && (
                          <motion.div
                            key="arabic-calligraphy-simulator"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden pt-2"
                          >
                            <ArabicCalligraphySimulator
                              docTitle={customDocTitle || defaultDocTitle}
                              docSubtitle={customDocSubtitle || defaultDocSubtitle}
                              headerNote={customHeaderNote}
                              school={school}
                              prof={prof}
                              academy={academy}
                              firstExerciseTitle={
                                customExerciseTitles[0] ||
                                defaultExerciseTitles[0] ||
                                `التمرين 1 : ${activeCustomLessons[0]?.lessonAr || "تمرين تطبيقي"}`
                              }
                              appliedConfig={appliedTitleCalligraphy}
                              onApplyConfig={(cfg) => {
                                setAppliedTitleCalligraphy(cfg);
                                const fontLabel =
                                  TRADITIONAL_TITLE_FONT_OPTIONS.find(
                                    (f) => f.id === cfg.fontId
                                  )?.nameAr || "الخط القياسي";
                                setStatusMessage({
                                  type: "success",
                                  text:
                                    cfg.fontId === "DEFAULT_DOC"
                                      ? "تمت استعادة خط العناوين القياسي للوثيقة."
                                      : `تم اعتماد «${fontLabel}» في عناوين الوثيقة النهائية بنجاح! يمكنك معاينة النتيجة مباشرة على ورقة A4 أسفله.`,
                                });
                              }}
                              onUpdateDocTitleText={(formattedTitle) => {
                                setCustomDocTitle(formattedTitle);
                                setStatusMessage({
                                  type: "info",
                                  text: "تم تحديث نص العنوان الرئيسي للوثيقة بالكشيدة والزخرفة المختارة.",
                                });
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* شريط التركيز التلقائي والانتقال المتزامن بين أقسام الكود المصدري ومعاينة الورقة (يظهر فقط في العرض المنقسم SPLIT لمنع الازدحام في المعاينة العادية) */}
          {syncScrollEnabled && viewMode === "SPLIT" && (
            <div className="no-print flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-slate-100 px-3.5 py-2 rounded-xl border border-slate-800 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-black text-cyan-300">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>التمرير المتزامن والتركيز التلقائي:</span>
                </span>
                <span className="text-slate-300 hidden md:inline">
                  مرر داخل الكود أو الورقة أو اضغط على أي قسم للتركيز التلقائي المتزامن
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "SPEC_TABLE", label: "1. جدول التخصيص", ratio: 0.05 },
                  { id: "HEADER", label: "2. الترويسة الرسمية", ratio: 0.22 },
                  { id: "EXERCISES", label: "3. التمارين (exoBox)", ratio: 0.48 },
                  { id: "SYNTHESIS_PROBLEM", label: "4. المسألة التوليفية", ratio: 0.75 },
                  { id: "SOLUTIONS", label: "5. عناصر الإجابة", ratio: 0.92 },
                ].map((sec) => {
                  const isFocused = activeSyncSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleJumpToSyncSection(sec.id, sec.ratio)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        isFocused
                          ? "bg-cyan-400 text-slate-950 font-black shadow-2xs"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {sec.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div
            className={
              viewMode === "SPLIT"
                ? "grid grid-cols-1 xl:grid-cols-12 gap-4 items-start"
                : "block"
            }
          >
            {(viewMode === "CODE" || viewMode === "SPLIT") && (
              <div
                className={
                  viewMode === "SPLIT" ? "xl:col-span-5 space-y-2 no-print" : "block"
                }
              >
                {viewMode === "SPLIT" && (
                  <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-1.5 rounded-t-xl border-b border-slate-800 text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>محرر الكود المصدري المتزامن ({exportFormat === "TYPST" ? "Typst" : "LaTeX"})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "تم النسخ" : "نسخ"}</span>
                    </button>
                  </div>
                )}
                <pre
                  ref={codeScrollRef}
                  onScroll={handleCodeScroll}
                  dir="ltr"
                  className={`bg-slate-950 text-slate-100 p-5 overflow-y-auto overflow-x-auto text-xs leading-relaxed select-all font-mono no-print border border-slate-800 ${
                    viewMode === "SPLIT"
                      ? "rounded-b-xl max-h-[820px]"
                      : "rounded-xl max-h-[680px]"
                  }`}
                >
                  {generatedCode}
                </pre>
              </div>
            )}

            {(viewMode === "PREVIEW" || viewMode === "SPLIT") && (
              <TouchPreviewCanvas
                ref={previewScrollRef}
                onScroll={handlePreviewScroll}
                zoom={previewZoom}
                onZoomChange={setPreviewZoom}
                pageOrientation={pageOrientation}
                syncScrollEnabled={syncScrollEnabled}
                viewMode={viewMode}
              >
                <PrintablePreview
                    track={currentTrack}
                    sem={semester}
                    dsKey={dsKey}
                    school={school}
                    prof={prof}
                    year={year}
                    academy={academy}
                    direction={direction}
                    headerStyle={headerStyle}
                    includeStudentBox={includeStudentBox}
                    includeGradeBox={includeGradeBox}
                    calculatorAllowed={calculatorAllowed}
                    includeCompetencies={includeCompetencies}
                    examModel={examModel}
                    shuffleQuestions={shuffleQuestions}
                    shuffleExercises={shuffleExercises}
                    docLang={docLang}
                    bilingualLayout={bilingualLayout}
                    activeModule={activeModule}
                    n1={n1}
                    n2={n2}
                    n3={n3}
                    fillBlanks={fillBlanks}
                    includeTICE={includeTICE}
                    selectedLessonIdx={selectedLessonIdx}
                    diagDuration={diagDuration}
                    diagType={diagType}
                    showAnswerKey={showAnswerKey}
                    includeDetailedSolutions={includeDetailedSolutions}
                    solutionDisplayMode={solutionDisplayMode}
                    onlyPrintSolutions={onlyPrintSolutions}
                    system={educationSystem}
                    customLessons={activeCustomLessons}
                    dmSubType={dmSubType}
                    dmNumber={dmNumber}
                    dmDueDate={dmDueDate}
                    serieExerciseCount={serieExerciseCount}
                    includeHints={includeHints}
                    includeTeacherLogo={includeTeacherLogo}
                    logoVariant={logoVariant}
                    includeLogoWatermark={includeLogoWatermark}
                    customLogoUrl={customLogoUrl}
                    customDocTitle={customDocTitle}
                    customDocSubtitle={customDocSubtitle}
                    customHeaderNote={customHeaderNote}
                    customExerciseTitles={customExerciseTitles}
                    docFontFamily={docFontFamily}
                    docFontSize={docFontSize}
                    isInlineEditable={isInlineEditable}
                    showQuestionBareme={showQuestionBareme}
                    includeGradingScaleTable={includeGradingScaleTable}
                    includeAnswerWorkspace={includeAnswerWorkspace}
                    studentGridStyle={studentGridStyle}
                    workspaceHeightMode={workspaceHeightMode}
                    onChangeStudentGridStyle={setStudentGridStyle}
                    onOpenBatchPrint={() => setIsBatchPrintModalOpen(true)}
                    includeSelfEvalGrid={includeSelfEvalGrid}
                    geoGebraResourcesMap={geoGebraResourcesMap}
                    autoAttachGeoGebra={autoAttachGeoGebra}
                    includeCustomEvalGridSheet={includeCustomEvalGridSheet}
                    onlyPrintEvalGrid={onlyPrintEvalGrid}
                    evalGridGranularity={evalGridGranularity}
                    evalGridStudentCount={evalGridStudentCount}
                    pageOrientation={pageOrientation}
                    onUpdateGeoGebraResource={handleUpdateGeoGebraResource}
                    insertedFigures={insertedFigures}
                    onAddFigure={handleAddFigure}
                    onUpdateFigure={handleUpdateFigure}
                    onDeleteFigure={handleDeleteFigure}
                    dsStructureMode={dsStructureMode}
                    dsQuestionDensity={dsQuestionDensity}
                    includeMoroccanExamDirectives={includeMoroccanExamDirectives}
                    handwrittenSolutionsOnly={handwrittenSolutionsOnly}
                    onChangeDocFontFamily={setDocFontFamily}
                    moroccanDMType={moroccanDMType}
                    includeLessonMemo={includeLessonMemo}
                    includeDMContract={includeDMContract}
                    ficheScenarioDisplayMode={ficheScenarioDisplayMode}
                    ficheContentDetailLevel={ficheContentDetailLevel}
                    includeFichePlanningMatrix={includeFichePlanningMatrix}
                    includeFicheTICE={includeFicheTICE}
                    includeFicheFormativeEval={includeFicheFormativeEval}
                    includeExamFormulaSheet={includeExamFormulaSheet}
                    includeDSStudentSelfCheck={includeDSStudentSelfCheck}
                    includePostExamRemediationSheet={includePostExamRemediationSheet}
                    includeOfficialExamCoverSheet={includeOfficialExamCoverSheet}
                    appliedTitleCalligraphy={appliedTitleCalligraphy}
                    latexPackageTheme={latexPackageTheme}
                    onChangeLatexPackageTheme={setLatexPackageTheme}
                    tcolorboxConfig={tcolorboxConfig}
                    onChangeTcolorboxConfig={setTcolorboxConfig}
                    paperSurface={paperSurface}
                    onChangePaperSurface={setPaperSurface}
                    onOpenWolframVerifier={() => setShowWolframVerifierModal(true)}
                    include2DSpecMatrix={include2DSpecMatrix}
                    includeOMRBubbleSheet={includeOMRBubbleSheet}
                    omrQuestionCount={omrQuestionCount}
                    enableFourModelsABCD={enableFourModelsABCD}
                    includeDidacticVigilanceSheet={includeDidacticVigilanceSheet}
                    onOpenAdvancedPedagogyStudio={handleOpenAdvancedPedagogyStudio}
                    activeSyncSection={syncScrollEnabled ? activeSyncSection : null}
                    enableBranchColorGradient={enableBranchColorGradient}
                    branchColorMode={branchColorMode}
                    onChangeEnableBranchColorGradient={setEnableBranchColorGradient}
                    onChangeBranchColorMode={setBranchColorMode}
                    qcmConfig={activeQcmConfig}
                    attachedPythonAlgorithms={attachedPythonAlgorithms}
                    onOpenPythonLab={() => setShowPythonLabModal(true)}
                    onOpenAiAssistant={() => setShowPedagogicalAiModal(true)}
                    onExportOverleafZipDirect={handleDirectExportOverleafZip}
                    onRemovePythonAlgorithm={handleRemovePythonAlgorithm}
                    includeIndividualGradingStrip={includeIndividualGradingStrip}
                    includeRescueHintsAndContinuity={includeRescueHintsAndContinuity}
                    showA4LivePageBreaks={showA4LivePageBreaks}
                    onToggleA4LivePageBreaks={() => setShowA4LivePageBreaks((v) => !v)}
                    economicTwoUpPrintMode={economicTwoUpPrintMode}
                    onToggleEconomicTwoUpPrintMode={() => setEconomicTwoUpPrintMode((v) => !v)}
                    onOpenDidacticChecklist={() => setShowDidacticChecklistModal(true)}
                    onOpenRemedialExam={() => setShowRemedialExamModal(true)}
                    includeInteractiveQrFooter={includeInteractiveQrFooter}
                    onToggleInteractiveQrFooter={() => setIncludeInteractiveQrFooter((v) => !v)}
                    interactiveExamUrl={interactiveExamUrl}
                    onOpenInteractiveQuiz={handleOpenInteractiveQuiz}
                    differentiatedPathConfig={differentiatedPathConfig}
                    longitudinalCohortConfig={longitudinalCohortConfig}
                    onOpenMathInspectorStudio={() => {
                      setMathInspectorStudioTab("LONGITUDINAL_COHORT");
                      setShowMathInspectorStudioModal(true);
                    }}
                    customPageMarginsMm={customPageMarginsMm}
                    onChangePageMarginsMm={setCustomPageMarginsMm}
                    printPageSizePreset={printPageSizePreset}
                    customPageWidthMm={customPageWidthMm}
                    customPageHeightMm={customPageHeightMm}
                    simulatePrintMediaQuery={simulatePrintMediaQuery}
                    onChangePrintPageSizePreset={(preset) => {
                      setPrintPageSizePreset(preset);
                      setShowA4LivePageBreaks(true);
                    }}
                    onChangeCustomPageDimensionsMm={(w, h) => {
                      setCustomPageWidthMm(w);
                      setCustomPageHeightMm(h);
                      setShowA4LivePageBreaks(true);
                    }}
                    onToggleSimulatePrintMediaQuery={() =>
                      setSimulatePrintMediaQuery((prev) => {
                        const next = !prev;
                        if (next) setShowA4LivePageBreaks(true);
                        return next;
                      })
                    }
                    selectedConsigneKeys={selectedConsigneKeys}
                    onChangeConsigneKeys={setSelectedConsigneKeys}
                    onOpenCompetencyBank={() => setShowCompetencyBankModal(true)}
                    onOpenMassarExport={() => setShowMassarExportModal(true)}
                    onOpenDiagnosticAnalysis={() => setShowDiagnosticAnalysisModal(true)}
                    onOpenBookletMode={() => setShowBookletModeModal(true)}
                    onOpenInteractiveQr={() => setShowInteractiveQrModal(true)}
                    isBookletPreviewMode={isBookletPreviewMode}
                    onSwitchDocumentViewModel={(nextModule, nextDmSubType) => {
                      setActiveModule(nextModule);
                      if (nextDmSubType) {
                        setDmSubType(nextDmSubType);
                      }
                      const autoSpec = resolveAutoDocViewMarginModel(
                        nextModule,
                        nextDmSubType || dmSubType
                      );
                      setStatusMessage({
                        type: "info",
                        text: `تم التبديل إلى « ${autoSpec.labelAr} » وضبط هوامش الورقة تلقائياً (${autoSpec.topMm}mm أعلى/أسفل · ${autoSpec.xMm}mm يمين/يسار).`,
                      });
                    }}
                  />
              </TouchPreviewCanvas>
            )}
          </div>
        </section>
      </main>
      {/* استوديو الابتكارات التطبيقية الأربعة (منحنى C_f التفاعلي · مصنف مسار Excel · بنك أخطاء BIOF · تلميحات QR) */}
      {showFourProposalsModal && (
        <FourProposalsInnovationStudioModal
          isOpen={showFourProposalsModal}
          onClose={() => setShowFourProposalsModal(false)}
          initialTab={fourProposalsTab}
          lessons={activeCustomLessons}
          trackCode={currentTrack.code}
          trackLabelAr={currentTrack.labelAr}
          trackLabelFr={currentTrack.labelFr}
          school={school}
          prof={prof}
          year={year}
          semester={semester}
          dsKey={dsKey}
          isFr={isMission || docLang === "FR"}
          onInsertFigureToExam={handleAddFigure}
          onUpdateCustomQuestions={handleUpdateCustomQuestions}
          longitudinalConfig={longitudinalCohortConfig}
          onChangeLongitudinalConfig={setLongitudinalCohortConfig}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* 1. نافذة بنك التمارين البيداغوجي المرمز (Bloom N1/N2/N3) */}
      {showCompetencyBankModal && (
        <CompetencyQuestionBankModal
          isOpen={showCompetencyBankModal}
          onClose={() => setShowCompetencyBankModal(false)}
          onInsertExercise={handleInsertCompetencyExercise}
          currentTrackCode={currentTrack.code}
          isFr={isMission || docLang === "FR"}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* 2. نافذة نظام تصدير مسار Massar الرسمي */}
      {showMassarExportModal && (
        <OfficialMassarExportModal
          isOpen={showMassarExportModal}
          onClose={() => setShowMassarExportModal(false)}
          trackCode={currentTrack.code}
          trackLabelAr={currentTrack.labelAr}
          trackLabelFr={currentTrack.labelFr}
          dsKey={dsKey}
          school={school}
          prof={prof}
          year={year}
          isFr={isMission || docLang === "FR"}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* 3. نافذة شبكة رصد التعثرات والتقويم التشخيصي للمفتش والأستاذ */}
      {showDiagnosticAnalysisModal && (
        <DiagnosticClassAnalysisModal
          isOpen={showDiagnosticAnalysisModal}
          onClose={() => setShowDiagnosticAnalysisModal(false)}
          trackCode={currentTrack.code}
          trackLabelAr={currentTrack.labelAr}
          trackLabelFr={currentTrack.labelFr}
          school={school}
          prof={prof}
          year={year}
          isFr={isMission || docLang === "FR"}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* 4. نافذة نمط الكتيب المطوي A4 إلى A5 */}
      {showBookletModeModal && (
        <BookletFoldedModeModal
          isOpen={showBookletModeModal}
          onClose={() => setShowBookletModeModal(false)}
          docTitle={customDocTitle || defaultDocTitle || `الفرض المحروس ${dsKey}`}
          trackLabel={isMission || docLang === "FR" ? currentTrack.labelFr : currentTrack.labelAr}
          school={school}
          prof={prof}
          year={year}
          isFr={isMission || docLang === "FR"}
          onPrintBooklet={() => {
            window.print();
          }}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* 5. نافذة كود الاستجابة السريعة التفاعلي والدعم المرقمن */}
      {showInteractiveQrModal && (
        <InteractiveQrRemediationModal
          isOpen={showInteractiveQrModal}
          onClose={() => setShowInteractiveQrModal(false)}
          examTitle={customDocTitle || defaultDocTitle || `الفرض المحروس ${dsKey}`}
          trackLabel={isMission || docLang === "FR" ? currentTrack.labelFr : currentTrack.labelAr}
          isFr={isMission || docLang === "FR"}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* أستوديو التحقق الجبري (MathJS) ومقترحات أستاذ المادة والمفتش التربوي (محمل بشكل كسول Code-Split) */}
      {showMathInspectorStudioModal && (
        <React.Suspense fallback={null}>
          <MathTeacherInspectorStudioModal
            isOpen={showMathInspectorStudioModal}
            onClose={() => setShowMathInspectorStudioModal(false)}
            initialTab={mathInspectorStudioTab}
            lessons={activeCustomLessons}
            trackCode={currentTrack.code}
            trackLabelAr={currentTrack.labelAr}
            trackLabelFr={currentTrack.labelFr}
            school={school}
            prof={prof}
            year={year}
            semester={semester}
            dsQuestionDensity={dsQuestionDensity}
            isFr={isMission || docLang === "FR"}
            onUpdateCustomQuestions={handleUpdateCustomQuestions}
            onInsertFigureToExam={handleAddFigure}
            differentiatedPathConfig={differentiatedPathConfig}
            onChangeDifferentiatedPathConfig={setDifferentiatedPathConfig}
            longitudinalConfig={longitudinalCohortConfig}
            onChangeLongitudinalConfig={setLongitudinalCohortConfig}
            onNotify={(type, text) => setStatusMessage({ type, text })}
          />
        </React.Suspense>
      )}
      {/* نافذة الاختبار التفاعلي (Interactive Quiz) والتصحيح الآلي المباشر للتلاميذ */}
      {currentInteractiveQuiz && (
        <InteractiveQuizModal
          isOpen={showInteractiveQuizModal}
          onClose={() => setShowInteractiveQuizModal(false)}
          quizData={currentInteractiveQuiz}
          onRegenerateWithAI={handleRegenerateQuizWithAI}
          isGeneratingAI={isAiConvertingQuiz}
          selectedAiModel={selectedAiModel}
          onSelectAiModel={setSelectedAiModel}
          googleUserEmail={driveUser?.email}
        />
      )}

      {/* نافذة مختبر WolframAlpha للبحث والتحقق من الصيغ الرياضية المعقدة وتوليد المنحنيات البيانية */}
      {showWolframVerifierModal && (
        <WolframAlphaVerifierModal
          isOpen={showWolframVerifierModal}
          onClose={() => setShowWolframVerifierModal(false)}
          trackLabel={`${currentTrack.labelAr} (${currentTrack.labelFr})`}
          selectedAiModel={selectedAiModel}
          lessons={activeCustomLessons}
          onInsertVerifiedQuestion={handleInsertVerifiedWolframQuestion}
          onInsertFigureToExam={handleAddFigure}
        />
      )}

      {/* نافذة أستوديو الهندسة الديداكتيكية والرياضية المتقدمة (6 أدوات متكاملة) */}
      {showAdvancedPedagogyModal && (
        <AdvancedMathPedagogyModal
          isOpen={showAdvancedPedagogyModal}
          onClose={() => setShowAdvancedPedagogyModal(false)}
          initialTab={advancedPedagogyInitialTab}
          lessons={activeCustomLessons}
          n1={n1}
          n2={n2}
          n3={n3}
          onChangeSkillRatios={(newN1, newN2, newN3) => {
            setN1(newN1);
            setN2(newN2);
            setN3(newN3);
          }}
          dsStructureMode={dsStructureMode}
          isMission={isMission}
          include2DSpecMatrix={include2DSpecMatrix}
          onToggle2DSpecMatrix={setInclude2DSpecMatrix}
          includeOMRBubbleSheet={includeOMRBubbleSheet}
          onToggleOMRBubbleSheet={setIncludeOMRBubbleSheet}
          omrQuestionCount={omrQuestionCount}
          onChangeOmrQuestionCount={setOmrQuestionCount}
          enableFourModelsABCD={enableFourModelsABCD}
          onToggleFourModelsABCD={setEnableFourModelsABCD}
          includeDidacticVigilanceSheet={includeDidacticVigilanceSheet}
          onToggleDidacticVigilanceSheet={setIncludeDidacticVigilanceSheet}
          onInsertFigureToExam={handleAddFigure}
          onInsertOfficialAnnaleExercise={handleInsertOfficialAnnaleExercise}
          trackCode={currentTrack.code}
          trackNameAr={currentTrack.labelAr}
          trackNameFr={currentTrack.labelFr}
          dsKey={dsKey}
          dsTitleAr={customDocTitle || defaultDocTitle || `الفرض المحروس ${dsKey}`}
          dsTitleFr={`Devoir Surveillé ${dsKey} (${semester})`}
          school={school}
          prof={prof}
          year={year}
          academy={academy}
          direction={direction}
          onOpenSmartQcmScanner={() => setShowSmartQcmScannerModal(true)}
          onApplyAdaptiveWeightsAndExercises={
            handleApplyAdaptiveSpecMatrixWeightsAndExercises
          }
        />
      )}

      {/* نافذة مختبر بايثون الرياضياتي للمنهاج المغربي والبعثة الفرنسية AEFE */}
      {showPythonLabModal && (
        <PythonAlgorithmLabModal
          isOpen={showPythonLabModal}
          onClose={() => setShowPythonLabModal(false)}
          onInsertAlgorithmIntoDoc={handleInsertPythonAlgorithm}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* نافذة المساعد الرياضي والديداكتيكي المطور للذكاء الاصطناعي (Gemini) */}
      {showPedagogicalAiModal && (
        <PedagogicalAiAssistantModal
          isOpen={showPedagogicalAiModal}
          onClose={() => {
            setShowPedagogicalAiModal(false);
            setPedagogicalAiInitialTask(undefined);
          }}
          trackLabel={`${currentTrack.labelAr} (${currentTrack.labelFr})`}
          educationSystem={educationSystem}
          currentModelChoice={selectedAiModel}
          onChangeModelChoice={setSelectedAiModel}
          lessons={activeCustomLessons}
          initialView={pedagogicalAiInitialView}
          initialTask={pedagogicalAiInitialTask}
          initialLessonIndex={pedagogicalAiInitialLessonIdx}
          onApplyVariantToDoc={handleApplyAiVariant}
          onInsertExerciseToExam={handleInsertVerifiedWolframQuestion}
          onReplaceExerciseInExam={handleReplaceExerciseFromAi}
          onAttachPythonScenario={(algo) => {
            const newPreset: PythonAlgorithmPreset = {
              id: algo.id || `ai_py_${Date.now()}`,
              titleAr: algo.titleAr,
              titleFr: algo.titleFr,
              topicCategory: "Analyse",
              categoryAr: "خوارزميات ومحاكاة عددية (TICE)",
              categoryFr: "Algorithmique & Simulation Numérique (TICE)",
              cycle:
                currentTrack.cycle === "TC" ||
                currentTrack.cycle === "1BAC" ||
                currentTrack.cycle === "2BAC"
                  ? currentTrack.cycle
                  : "ALL",
              levelBadgeAr: currentTrack.labelAr,
              levelBadgeFr: currentTrack.labelFr,
              objectiveAr: `محاكاة خوارزمية بلغة Python مرتبطة بـ ${
                activeCustomLessons[0]?.lessonAr || "الفرض المحروس"
              }.`,
              objectiveFr: `Simulation algorithmique en Python liée à ${
                activeCustomLessons[0]?.lessonFr || "l'épreuve"
              }.`,
              pythonCode: algo.code,
              pedagogicalQuestionsAr: algo.questionsAr,
              pedagogicalQuestionsFr: algo.questionsFr,
              sampleInputs: { n: 10 },
              expectedOutputAr: algo.output,
              expectedOutputFr: algo.output,
              latexCode: `\\begin{verbatim}\n${algo.code}\n\\end{verbatim}`,
              typstCode: `\`\`\`python\n${algo.code}\n\`\`\``,
            };
            handleInsertPythonAlgorithm(newPreset);
          }}
          onNotify={(type, text) => setStatusMessage({ type, text })}
        />
      )}

      {/* نافذة بطاقة المراقبة والتحقق الديداكتيكي للمفتش التربوي (المذكرة 142-08) */}
      {showDidacticChecklistModal && (
        <DidacticChecklistModal
          isOpen={showDidacticChecklistModal}
          onClose={() => setShowDidacticChecklistModal(false)}
          track={currentTrack}
          lessons={activeCustomLessons}
          n1={n1}
          n2={n2}
          n3={n3}
          examDurationMinutes={
            currentTrack.durationFr.includes("4")
              ? 240
              : currentTrack.durationFr.includes("3")
              ? 180
              : currentTrack.durationFr.includes("1")
              ? 60
              : 120
          }
          totalPoints={liveExamStats.totalPoints}
          isMission={isMission}
          isModelBoth={examModel === "BOTH"}
          school={school}
          prof={prof}
          year={year}
          academy={academy}
          direction={direction}
          dsKey={dsKey}
          onApplyAutoConformity={handleApplyAutoConformity}
          onNotify={(type, msg) => setStatusMessage({ type, text: msg })}
        />
      )}

      {/* نافذة مولد الفرض الاستدراكي والمعالجة البيداغوجية المركزة (Rattrapage & Remédiation Ciblée) */}
      {showRemedialExamModal && (
        <RemedialExamModal
          isOpen={showRemedialExamModal}
          onClose={() => setShowRemedialExamModal(false)}
          track={currentTrack}
          lessons={activeCustomLessons}
          school={school}
          prof={prof}
          year={year}
          academy={academy}
          direction={direction}
          dsKey={dsKey}
          isFr={docLang === "FR" || isMission}
          onApplyRemedialExam={handleApplyRemedialExam}
          onNotify={(type, msg) => setStatusMessage({ type, text: msg })}
        />
      )}

      {/* نافذة السحابة ومزامنة الإعدادات مع Google Drive ونظام التشفير المحلي AES-256 */}
      <GoogleDriveSyncModal
        isOpen={showDrivePanel}
        onClose={() => setShowDrivePanel(false)}
        driveUser={driveUser}
        driveToken={driveToken}
        isLoggingIn={isLoggingInDrive}
        isUploading={isUploadingDrive}
        driveFiles={driveFiles}
        isLoadingFiles={isLoadingDriveFiles}
        autoSyncEnabled={driveAutoSyncEnabled}
        onToggleAutoSync={handleToggleDriveAutoSync}
        onSignIn={handleGoogleDriveSignIn}
        onLogout={handleGoogleDriveLogout}
        onUploadCurrentDoc={handleSaveToGoogleDrive}
        onSyncSettingsNow={handleSyncSettingsToDriveNow}
        onRestoreSettingsFromDrive={handleRestoreSettingsFromDrive}
        onDeleteFile={confirmDeleteDriveFile}
        onNotify={(type, text) => setStatusMessage({ type, text })}
        lastSyncTime={lastDriveSyncTime}
        isSyncingSettings={isSyncingDriveSettings}
      />

      {/* شريط التحكم السفلي العائم للجوال (Mobile Bottom Dock) للوصول السريع دون مزاحمة معاينة الورقة A4 */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 no-print shadow-2xl">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => handleOpenMobileConfigSheet(1)}
            className={`min-h-[46px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-black transition cursor-pointer ${
              mobileConfigSheetOpen && mobileActiveColumn === 1
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <span className="font-mono text-[11px] font-black text-cyan-400">01</span>
            <span>المسلك</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenMobileConfigSheet(2)}
            className={`min-h-[46px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-black transition cursor-pointer ${
              mobileConfigSheetOpen && mobileActiveColumn === 2
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <span className="font-mono text-[11px] font-black text-cyan-400">02</span>
            <span>الدروس</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenMobileConfigSheet(3)}
            className={`min-h-[46px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-black transition cursor-pointer ${
              mobileConfigSheetOpen && mobileActiveColumn === 3
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <span className="font-mono text-[11px] font-black text-cyan-400">03</span>
            <span>النماذج</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileConfigSheetOpen(false);
              setMobileNavOpen(true);
            }}
            className={`min-h-[46px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-black transition cursor-pointer ${
              mobileNavOpen
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>الأدوات</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="min-h-[46px] rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 flex flex-col items-center justify-center gap-0.5 text-[10px] font-black transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

