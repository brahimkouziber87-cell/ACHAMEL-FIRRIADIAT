import {
  BilingualLayout,
  BranchColorGradientMode,
  CURRICULUM_DB,
  DMSubType,
  DocFontFamily,
  DocFontSize,
  DocLanguage,
  DSQuestionDensity,
  EducationSystem,
  ExamModel,
  ExportFormat,
  GeoGebraResource,
  HeaderStyle,
  InsertedFigure,
  LessonHeaderIconId,
  ModuleType,
  MoroccanDSStructureMode,
  MoroccanQCMItem,
  QCMScoringMode,
  SemesterType,
  SolutionDisplayMode,
} from "../data/curriculum";
import { TeacherLogoVariant } from "../components/TeacherLogo";
import { MoroccanDMType } from "./seriesGenerator";
import {
  DEFAULT_TCOLORBOX_CONFIG,
  LatexPackageTheme,
  PaperSurfaceTexture,
  StudentGridStyle,
  TcolorboxCustomConfig,
} from "./latexPackagesAndMath";
import { AppliedTitleCalligraphyConfig } from "../components/ArabicCalligraphySimulator";
import { GridGranularity } from "./evaluationGridExporter";
import { PythonAlgorithmPreset } from "../data/pythonAlgorithms";
import {
  secureGetItem,
  secureGetItemSync,
  secureSetItem,
  isEncryptedPayload,
} from "./cryptoStorage";

export interface ExamConfigBlueprintJSON {
  meta: {
    schemaVersion: "2.0.0" | "3.0.0";
    appIdentifier: "pedagogical-math-studio-lycee";
    exportedAt: string;
    configName: string;
    notes?: string;
    deviceHint?: string;
  };
  identity: {
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
    includeTeacherLogo: boolean;
    logoVariant: TeacherLogoVariant;
    includeLogoWatermark: boolean;
    customLogoUrl?: string | null;
  };
  examStructure: {
    activeModule: ModuleType;
    selectedTrackCode: string;
    semester: SemesterType;
    dsKey: string;
    selectedLessonIdx: number;
    examModel: ExamModel;
    shuffleQuestions: boolean;
    shuffleExercises: boolean;
    dsStructureMode: MoroccanDSStructureMode;
    dsQuestionDensity: DSQuestionDensity;
    includeMoroccanExamDirectives: boolean;
    dmSubType: DMSubType;
    dmNumber: string;
    dmDueDate: string;
    serieExerciseCount: number;
    includeHints: boolean;
    moroccanDMType: MoroccanDMType;
    includeLessonMemo: boolean;
    includeDMContract: boolean;
    diagDuration: string;
    diagType: string;
    ficheScenarioDisplayMode?: "GRID_OFFICIAL" | "CARDS_BY_SESSION" | "BOTH";
    ficheContentDetailLevel?: "FULL_WITH_PROOFS" | "SYNTHETIC_OFFICIAL";
    includeFichePlanningMatrix?: boolean;
    includeFicheTICE?: boolean;
    includeFicheFormativeEval?: boolean;
  };
  gradingAndLessons: {
    isCustomLessonMode: boolean;
    selectedLessonIndices: number[];
    selectedLessonRefs: Array<{
      index: number;
      lessonAr: string;
      lessonFr: string;
      weight: number;
    }>;
    customWeightsMap: Record<string, number>;
    customLessonIconsMap?: Record<string, LessonHeaderIconId>;
    customQuestionBaremesMap: Record<string, number[]>;
    customQuestionLevelsMap: Record<string, Array<"N1" | "N2" | "N3">>;
    customQuestionsMap: Record<string, { ar: string[]; fr: string[] }>;
    n1: number;
    n2: number;
    n3: number;
    fillBlanks: boolean;
    includeTICE: boolean;
    showQuestionBareme: boolean;
    includeGradingScaleTable: boolean;
    includeSelfEvalGrid: boolean;
    qcmQuestionCount?: number;
    qcmScoringMode?: QCMScoringMode;
    customQcmItems?: MoroccanQCMItem[];
    include2DSpecMatrix?: boolean;
    includeOMRBubbleSheet?: boolean;
    omrQuestionCount?: number;
    enableFourModelsABCD?: boolean;
    includeDidacticVigilanceSheet?: boolean;
    includeIndividualGradingStrip?: boolean;
    includeRescueHintsAndContinuity?: boolean;
  };
  appearanceAndExport: {
    docLang: DocLanguage;
    bilingualLayout: BilingualLayout;
    exportFormat: ExportFormat;
    pageOrientation: "PORTRAIT" | "LANDSCAPE";
    docFontFamily: DocFontFamily;
    docFontSize: DocFontSize;
    latexPackageTheme: LatexPackageTheme;
    paperSurface: PaperSurfaceTexture;
    customDocTitle: string;
    customDocSubtitle: string;
    customHeaderNote: string;
    customExerciseTitles: Record<number, string>;
    includeDetailedSolutions: boolean;
    solutionDisplayMode: SolutionDisplayMode;
    includeAnswerWorkspace: boolean;
    handwrittenSolutionsOnly: boolean;
    includeExamFormulaSheet: boolean;
    includeDSStudentSelfCheck: boolean;
    includePostExamRemediationSheet: boolean;
    includeOfficialExamCoverSheet: boolean;
    enableBranchColorGradient?: boolean;
    branchColorMode?: BranchColorGradientMode;
    tcolorboxConfig?: TcolorboxCustomConfig;
    appliedTitleCalligraphy?: AppliedTitleCalligraphyConfig;
    studentGridStyle?: StudentGridStyle;
    workspaceHeightMode?: "ADAPTIVE" | "COMPACT" | "GENEROUS";
    includeCustomEvalGridSheet?: boolean;
    evalGridGranularity?: GridGranularity;
    evalGridStudentCount?: number;
    showA4LivePageBreaks?: boolean;
    economicTwoUpPrintMode?: boolean;
    includeInteractiveQrFooter?: boolean;
  };
  workspaceExtensions?: {
    autoAttachGeoGebra?: boolean;
    geoGebraResourcesMap?: Record<string, GeoGebraResource>;
    isGeoGebra3DMode?: boolean;
    selectedSpatialPresetId?:
      | "SPHERE_PLANE"
      | "VECTOR_CROSS_PRODUCT"
      | "TETRAHEDRON_SECTION"
      | "LINES_IN_SPACE";
    insertedFigures?: InsertedFigure[];
    attachedPythonAlgorithms?: PythonAlgorithmPreset[];
    selectedAiModel?: "gemini-3.8-flash" | "gemini-4-argon";
    viewMode?: "CODE" | "PREVIEW" | "SPLIT";
    previewZoom?: number;
    syncScrollEnabled?: boolean;
    isInlineEditable?: boolean;
    showAnswerKey?: boolean;
    localStorageSnapshot?: Record<string, string>;
  };
}

export interface SavedLocalConfigPreset {
  id: string;
  title: string;
  savedAt: string;
  trackCode: string;
  module: ModuleType;
  blueprint: ExamConfigBlueprintJSON;
}

const LOCAL_VAULT_STORAGE_KEY = "pedagogical_math_exam_config_vault_v1";

// المفاتيح المحلية المسموح بنقلها ضمن لقطة مساحة العمل بين الأجهزة
const PORTABLE_STORAGE_KEYS_PREFIXES = [
  "pedagogical_math_",
  "prof_math_",
  "spec_matrix_2d_",
  "student_eval_",
];

export function capturePortableLocalStorageSnapshot(): Record<string, string> {
  const snapshot: Record<string, string> = {};
  try {
    if (typeof window === "undefined" || !window.localStorage) return snapshot;
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (
        PORTABLE_STORAGE_KEYS_PREFIXES.some((prefix) => key.startsWith(prefix))
      ) {
        const val = window.localStorage.getItem(key);
        if (typeof val === "string" && val.length < 250_000) {
          snapshot[key] = val;
        }
      }
    }
  } catch {
    // ignore storage read errors
  }
  return snapshot;
}

export function restorePortableLocalStorageSnapshot(
  snapshot?: Record<string, string>
): number {
  if (!snapshot || typeof snapshot !== "object") return 0;
  let restoredCount = 0;
  try {
    if (typeof window === "undefined" || !window.localStorage) return 0;
    Object.entries(snapshot).forEach(([key, value]) => {
      if (
        typeof key === "string" &&
        typeof value === "string" &&
        PORTABLE_STORAGE_KEYS_PREFIXES.some((prefix) => key.startsWith(prefix))
      ) {
        window.localStorage.setItem(key, value);
        restoredCount++;
      }
    });
  } catch {
    // ignore quota errors
  }
  return restoredCount;
}

// ===================================================================
// IndexedDB Engine for Multi-Year Persistent Storage (No 5MB Quota Limit)
// ===================================================================
const IDB_NAME = "PedagogicalMathStudioArchivesDB";
const IDB_STORE_NAME = "examArchives";
const IDB_VERSION = 1;

function openStudioIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available in this environment"));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        const store = db.createObjectStore(IDB_STORE_NAME, { keyPath: "id" });
        store.createIndex("savedAt", "savedAt", { unique: false });
        store.createIndex("trackCode", "trackCode", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * حفظ نسخة أرشيفية كاملة في IndexedDB (تجاوز حد 5MB في localStorage)
 */
export async function saveExamArchiveToIndexedDB(
  preset: SavedLocalConfigPreset
): Promise<SavedLocalConfigPreset[]> {
  try {
    const db = await openStudioIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE_NAME, "readwrite");
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.put(preset);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed saving to IndexedDB, fallback to local vault:", err);
  }
  return saveConfigToLocalVault(preset);
}

/**
 * استيراد مجموعة قوالب دفعة واحدة إلى IndexedDB و localStorage عند استعادة نسخة احتياطية
 */
export async function importArchivesBatchToIndexedDB(
  presets: SavedLocalConfigPreset[]
): Promise<SavedLocalConfigPreset[]> {
  if (!Array.isArray(presets) || presets.length === 0) {
    return loadExamArchivesFromIndexedDB();
  }
  for (const preset of presets) {
    if (preset && preset.id && preset.blueprint) {
      await saveExamArchiveToIndexedDB(preset);
    }
  }
  return loadExamArchivesFromIndexedDB();
}

/**
 * استرجاع جميع الأرشيفات التاريخية من IndexedDB مع دمج أرشيف localStorage
 */
export async function loadExamArchivesFromIndexedDB(): Promise<
  SavedLocalConfigPreset[]
> {
  const localList = loadSavedConfigVault();
  try {
    const db = await openStudioIndexedDB();
    const idbList = await new Promise<SavedLocalConfigPreset[]>(
      (resolve, reject) => {
        const tx = db.transaction(IDB_STORE_NAME, "readonly");
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      }
    );

    if (idbList && idbList.length > 0) {
      const map = new Map<string, SavedLocalConfigPreset>();
      idbList.forEach((p) => map.set(p.id, p));
      localList.forEach((p) => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      return Array.from(map.values()).sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );
    }
  } catch (err) {
    console.warn("IndexedDB load fallback to localStorage:", err);
  }
  return localList;
}

/**
 * حذف أرشيف محدد من IndexedDB و localStorage
 */
export async function deleteExamArchiveFromIndexedDB(
  id: string
): Promise<SavedLocalConfigPreset[]> {
  try {
    const db = await openStudioIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE_NAME, "readwrite");
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB delete fallback:", err);
  }
  return deleteConfigFromLocalVault(id);
}

/**
 * تصدير الأرشيف الكامل لجميع فروض الأستاذ + حالة مساحة العمل الحالية كملف JSON مجمع للنسخ الاحتياطي
 */
export async function exportAllArchivesBackupJSON(
  currentWorkspaceBlueprint?: ExamConfigBlueprintJSON
): Promise<void> {
  const archives = await loadExamArchivesFromIndexedDB();
  const dateStr = new Date().toISOString().slice(0, 10);
  const jsonString = JSON.stringify(
    {
      appIdentifier: "pedagogical-math-studio-lycee",
      exportType: "FULL_ARCHIVES_BACKUP",
      schemaVersion: "3.0.0",
      exportedAt: new Date().toISOString(),
      totalArchives: archives.length,
      currentWorkspace: currentWorkspaceBlueprint || null,
      localStorageSnapshot: capturePortableLocalStorageSnapshot(),
      archives,
    },
    null,
    2
  );
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Workspace_Backup_Mathematiques_Lycee_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadSavedConfigVault(): SavedLocalConfigPreset[] {
  try {
    const raw = secureGetItemSync(LOCAL_VAULT_STORAGE_KEY) || localStorage.getItem(LOCAL_VAULT_STORAGE_KEY);
    if (!raw) return [];
    if (isEncryptedPayload(raw)) {
      // إذا كان مشفراً ولم يُفك بعد بالذاكرة، سيتم جلبه لاحقاً عبر loadSavedConfigVaultAsync
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * جلب الأرشيف المحلي مع فك التشفير التلقائي عند تفعيل نظام الحماية المشفر
 */
export async function loadSavedConfigVaultAsync(): Promise<SavedLocalConfigPreset[]> {
  try {
    const raw = await secureGetItem(LOCAL_VAULT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return loadSavedConfigVault();
  }
}

export function saveConfigToLocalVault(
  preset: SavedLocalConfigPreset
): SavedLocalConfigPreset[] {
  try {
    const existing = loadSavedConfigVault().filter((p) => p.id !== preset.id);
    const updated = [preset, ...existing].slice(0, 50);
    const jsonStr = JSON.stringify(updated);
    // تشفير وحفظ فوري في LocalStorage
    secureSetItem(LOCAL_VAULT_STORAGE_KEY, jsonStr).catch((e) =>
      console.warn("Secure vault async save warning:", e)
    );
    return updated;
  } catch {
    return loadSavedConfigVault();
  }
}

export function deleteConfigFromLocalVault(
  id: string
): SavedLocalConfigPreset[] {
  try {
    const updated = loadSavedConfigVault().filter((p) => p.id !== id);
    const jsonStr = JSON.stringify(updated);
    secureSetItem(LOCAL_VAULT_STORAGE_KEY, jsonStr).catch((e) =>
      console.warn("Secure vault async delete warning:", e)
    );
    return updated;
  } catch {
    return loadSavedConfigVault();
  }
}


export function downloadExamConfigAsJSON(
  blueprint: ExamConfigBlueprintJSON,
  customFileName?: string
): void {
  const safeTrack = blueprint.examStructure.selectedTrackCode || "MATH";
  const safeMod = blueprint.examStructure.activeModule || "DS";
  const safeDs = blueprint.examStructure.dsKey || "S1";
  const datePart = new Date().toISOString().slice(0, 10);
  const fileName =
    customFileName ||
    `Workspace_${safeTrack}_${safeMod}_${safeDs}_Modele_${blueprint.examStructure.examModel}_${datePart}.json`;

  const jsonString = JSON.stringify(blueprint, null, 2);
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".json") ? fileName : `${fileName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  normalizedBlueprint?: ExamConfigBlueprintJSON;
  bundledArchives?: SavedLocalConfigPreset[];
}

/**
 * فحص وتدقيق ملف JSON المستورد والتأكد من سلامة البنية والمسالك وتوزيع النقط وحالة مساحة العمل الكاملة
 */
export function validateAndNormalizeExamConfigJSON(
  rawInput: unknown
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawInput || typeof rawInput !== "object") {
    return {
      valid: false,
      errors: [
        "ملف JSON غير صالح أو فارغ. يرجى اختيار ملف مساحة عمل أو إعدادات فرض صحيح (.json).",
      ],
      warnings: [],
    };
  }

  let obj = rawInput as Record<string, any>;
  let bundledArchives: SavedLocalConfigPreset[] | undefined;

  // دعم ملف النسخ الاحتياطي الشامل (FULL_ARCHIVES_BACKUP) الذي يضم currentWorkspace و archives
  if (
    obj.exportType === "FULL_ARCHIVES_BACKUP" &&
    Array.isArray(obj.archives)
  ) {
    bundledArchives = obj.archives;
    if (obj.currentWorkspace && typeof obj.currentWorkspace === "object") {
      obj = {
        ...obj.currentWorkspace,
        workspaceExtensions: {
          ...(obj.currentWorkspace.workspaceExtensions || {}),
          localStorageSnapshot:
            obj.localStorageSnapshot ||
            obj.currentWorkspace.workspaceExtensions?.localStorageSnapshot,
        },
      };
    } else if (obj.archives.length > 0 && obj.archives[0]?.blueprint) {
      obj = obj.archives[0].blueprint;
      warnings.push(
        `تم اكتشاف حزمة أرشيف شاملة تضم ${obj.archives.length} قوالب محفوظة؛ سيتم استيراد القوالب وتطبيق أحدث قالب على مساحة العمل.`
      );
    }
  }

  // دعم استيراد كل من الصيغة المهيكلة الكاملة (v2.0.0 / v3.0.0) أو صيغة التفضيلات المسطحة (v1)
  const isStructured =
    obj.meta?.appIdentifier === "pedagogical-math-studio-lycee" ||
    (obj.examStructure && obj.gradingAndLessons);

  if (!isStructured && !obj.selectedTrackCode && !obj.educationSystem) {
    return {
      valid: false,
      errors: [
        "هذا الملف لا يحتوي على بنية مساحة عمل أو إعدادات فرض محروس خاصة بمنصة الهندسة البيداغوجية للرياضيات.",
      ],
      warnings: [],
    };
  }

  const trackCode: string =
    obj.examStructure?.selectedTrackCode || obj.selectedTrackCode || "2BAC_PC";
  const resolvedTrackCode = CURRICULUM_DB[trackCode] ? trackCode : "2BAC_PC";
  if (!CURRICULUM_DB[trackCode]) {
    warnings.push(
      `المسلك "${trackCode}" غير موجود في قاعدة البيانات الحالية؛ تم استبداله تلقائياً بمسلك 2BAC_PC.`
    );
  }

  const rawN1 = Number(obj.gradingAndLessons?.n1 ?? obj.n1 ?? 35);
  const rawN2 = Number(obj.gradingAndLessons?.n2 ?? obj.n2 ?? 45);
  const rawN3 = Number(obj.gradingAndLessons?.n3 ?? obj.n3 ?? 20);
  const sumN = rawN1 + rawN2 + rawN3;

  let n1 = rawN1;
  let n2 = rawN2;
  let n3 = rawN3;
  if (sumN !== 100 || rawN1 < 5 || rawN2 < 5 || rawN3 < 5) {
    warnings.push(
      `مجموع نسب المستويات المهارية في الملف كان (${sumN}%)؛ تمت موازنته تلقائياً إلى 100% وفق المذكرة 142-08.`
    );
    n1 = 35;
    n2 = 45;
    n3 = 20;
  }

  const trackObj = CURRICULUM_DB[resolvedTrackCode];
  const allLessonsForTrack = [
    ...Object.values(trackObj.semesters.S1).flat(),
    ...Object.values(trackObj.semesters.S2).flat(),
  ];

  let selectedLessonIndices: number[] = Array.isArray(
    obj.gradingAndLessons?.selectedLessonIndices ?? obj.selectedLessonIndices
  )
    ? (
        obj.gradingAndLessons?.selectedLessonIndices ??
        obj.selectedLessonIndices
      ).filter(
        (idx: unknown) =>
          typeof idx === "number" && idx >= 0 && idx < allLessonsForTrack.length
      )
    : [0, Math.min(1, Math.max(0, allLessonsForTrack.length - 1))];

  if (
    Array.isArray(obj.gradingAndLessons?.selectedLessonRefs) &&
    obj.gradingAndLessons.selectedLessonRefs.length > 0
  ) {
    const matchedByTitle: number[] = [];
    for (const ref of obj.gradingAndLessons.selectedLessonRefs) {
      const foundIdx = allLessonsForTrack.findIndex(
        (l) => l.lessonFr === ref.lessonFr || l.lessonAr === ref.lessonAr
      );
      if (foundIdx !== -1 && !matchedByTitle.includes(foundIdx)) {
        matchedByTitle.push(foundIdx);
      }
    }
    if (matchedByTitle.length > 0) {
      selectedLessonIndices = matchedByTitle;
    }
  }

  if (selectedLessonIndices.length === 0 && allLessonsForTrack.length > 0) {
    selectedLessonIndices = [0];
  }

  const normalizedBlueprint: ExamConfigBlueprintJSON = {
    meta: {
      schemaVersion: "3.0.0",
      appIdentifier: "pedagogical-math-studio-lycee",
      exportedAt: obj.meta?.exportedAt || new Date().toISOString(),
      configName:
        obj.meta?.configName ||
        `مساحة عمل ${resolvedTrackCode} - ${obj.examStructure?.dsKey || obj.dsKey || "DS1"}`,
      notes: obj.meta?.notes || "",
      deviceHint: obj.meta?.deviceHint || "",
    },
    identity: {
      educationSystem:
        obj.identity?.educationSystem ||
        obj.educationSystem ||
        "MAROC_NATIONAL",
      school: obj.identity?.school || obj.school || "ROOSEVELT SCHOOL 2",
      prof: obj.identity?.prof || obj.prof || "Prof. Brahim KOUZIBER",
      year: obj.identity?.year || obj.year || "2026-2027",
      academy:
        obj.identity?.academy ||
        obj.academy ||
        "الأكاديمية الجهوية للتربية والتكوين لجهة الدار البيضاء-سطات",
      direction:
        obj.identity?.direction || obj.direction || "المديرية الإقليمية أنفا",
      headerStyle:
        obj.identity?.headerStyle || obj.headerStyle || "OFFICIAL_AREF",
      includeStudentBox: Boolean(
        obj.identity?.includeStudentBox ?? obj.includeStudentBox ?? true
      ),
      includeGradeBox: Boolean(
        obj.identity?.includeGradeBox ?? obj.includeGradeBox ?? true
      ),
      calculatorAllowed: Boolean(
        obj.identity?.calculatorAllowed ?? obj.calculatorAllowed ?? true
      ),
      includeCompetencies: Boolean(
        obj.identity?.includeCompetencies ?? obj.includeCompetencies ?? true
      ),
      includeTeacherLogo: Boolean(
        obj.identity?.includeTeacherLogo ?? obj.includeTeacherLogo ?? true
      ),
      logoVariant:
        obj.identity?.logoVariant || obj.logoVariant || "ROYAL_GOLD",
      includeLogoWatermark: Boolean(
        obj.identity?.includeLogoWatermark ?? obj.includeLogoWatermark ?? false
      ),
      customLogoUrl:
        obj.identity?.customLogoUrl !== undefined
          ? obj.identity.customLogoUrl
          : obj.customLogoUrl || null,
    },
    examStructure: {
      activeModule:
        obj.examStructure?.activeModule || obj.activeModule || "DS_142_08",
      selectedTrackCode: resolvedTrackCode,
      semester: obj.examStructure?.semester || obj.semester || "S1",
      dsKey: obj.examStructure?.dsKey || obj.dsKey || "DS1",
      selectedLessonIdx: Number(
        obj.examStructure?.selectedLessonIdx ?? obj.selectedLessonIdx ?? 0
      ),
      examModel: obj.examStructure?.examModel || obj.examModel || "A",
      shuffleQuestions: Boolean(
        obj.examStructure?.shuffleQuestions ?? obj.shuffleQuestions ?? true
      ),
      shuffleExercises: Boolean(
        obj.examStructure?.shuffleExercises ?? obj.shuffleExercises ?? false
      ),
      dsStructureMode:
        obj.examStructure?.dsStructureMode ||
        obj.dsStructureMode ||
        "EXERCICES_ET_PROBLEME",
      dsQuestionDensity:
        obj.examStructure?.dsQuestionDensity ||
        obj.dsQuestionDensity ||
        "INTENSIVE",
      includeMoroccanExamDirectives: Boolean(
        obj.examStructure?.includeMoroccanExamDirectives ??
          obj.includeMoroccanExamDirectives ??
          true
      ),
      dmSubType:
        obj.examStructure?.dmSubType || obj.dmSubType || "DEVOIR_MAISON",
      dmNumber: obj.examStructure?.dmNumber || obj.dmNumber || "N° 1",
      dmDueDate: obj.examStructure?.dmDueDate || obj.dmDueDate || "2026-11-15",
      serieExerciseCount: Number(
        obj.examStructure?.serieExerciseCount ?? obj.serieExerciseCount ?? 6
      ),
      includeHints: Boolean(
        obj.examStructure?.includeHints ?? obj.includeHints ?? true
      ),
      moroccanDMType:
        obj.examStructure?.moroccanDMType ||
        obj.moroccanDMType ||
        "RECHERCHE_SYNTHESE",
      includeLessonMemo: Boolean(
        obj.examStructure?.includeLessonMemo ?? obj.includeLessonMemo ?? true
      ),
      includeDMContract: Boolean(
        obj.examStructure?.includeDMContract ?? obj.includeDMContract ?? true
      ),
      diagDuration: obj.examStructure?.diagDuration || obj.diagDuration || "1h",
      diagType: obj.examStructure?.diagType || obj.diagType || "MIXED",
      ficheScenarioDisplayMode:
        obj.examStructure?.ficheScenarioDisplayMode || "BOTH",
      ficheContentDetailLevel:
        obj.examStructure?.ficheContentDetailLevel || "FULL_WITH_PROOFS",
      includeFichePlanningMatrix: Boolean(
        obj.examStructure?.includeFichePlanningMatrix ?? true
      ),
      includeFicheTICE: Boolean(obj.examStructure?.includeFicheTICE ?? true),
      includeFicheFormativeEval: Boolean(
        obj.examStructure?.includeFicheFormativeEval ?? true
      ),
    },
    gradingAndLessons: {
      isCustomLessonMode: Boolean(
        obj.gradingAndLessons?.isCustomLessonMode ??
          obj.isCustomLessonMode ??
          false
      ),
      selectedLessonIndices,
      selectedLessonRefs: Array.isArray(
        obj.gradingAndLessons?.selectedLessonRefs
      )
        ? obj.gradingAndLessons.selectedLessonRefs
        : [],
      customWeightsMap:
        obj.gradingAndLessons?.customWeightsMap &&
        typeof obj.gradingAndLessons.customWeightsMap === "object"
          ? obj.gradingAndLessons.customWeightsMap
          : obj.customWeightsMap && typeof obj.customWeightsMap === "object"
          ? obj.customWeightsMap
          : {},
      customLessonIconsMap:
        obj.gradingAndLessons?.customLessonIconsMap &&
        typeof obj.gradingAndLessons.customLessonIconsMap === "object"
          ? obj.gradingAndLessons.customLessonIconsMap
          : obj.customLessonIconsMap &&
            typeof obj.customLessonIconsMap === "object"
          ? obj.customLessonIconsMap
          : {},
      customQuestionBaremesMap:
        obj.gradingAndLessons?.customQuestionBaremesMap &&
        typeof obj.gradingAndLessons.customQuestionBaremesMap === "object"
          ? obj.gradingAndLessons.customQuestionBaremesMap
          : {},
      customQuestionLevelsMap:
        obj.gradingAndLessons?.customQuestionLevelsMap &&
        typeof obj.gradingAndLessons.customQuestionLevelsMap === "object"
          ? obj.gradingAndLessons.customQuestionLevelsMap
          : {},
      customQuestionsMap:
        obj.gradingAndLessons?.customQuestionsMap &&
        typeof obj.gradingAndLessons.customQuestionsMap === "object"
          ? obj.gradingAndLessons.customQuestionsMap
          : {},
      n1,
      n2,
      n3,
      fillBlanks: Boolean(
        obj.gradingAndLessons?.fillBlanks ?? obj.fillBlanks ?? true
      ),
      includeTICE: Boolean(
        obj.gradingAndLessons?.includeTICE ?? obj.includeTICE ?? true
      ),
      showQuestionBareme: Boolean(
        obj.gradingAndLessons?.showQuestionBareme ??
          obj.showQuestionBareme ??
          true
      ),
      includeGradingScaleTable: Boolean(
        obj.gradingAndLessons?.includeGradingScaleTable ??
          obj.includeGradingScaleTable ??
          true
      ),
      includeSelfEvalGrid: Boolean(
        obj.gradingAndLessons?.includeSelfEvalGrid ??
          obj.includeSelfEvalGrid ??
          true
      ),
      qcmQuestionCount: Number(
        obj.gradingAndLessons?.qcmQuestionCount ?? 4
      ),
      qcmScoringMode:
        obj.gradingAndLessons?.qcmScoringMode || "JUSTIFICATION_REQUIRED",
      customQcmItems: Array.isArray(obj.gradingAndLessons?.customQcmItems)
        ? obj.gradingAndLessons.customQcmItems
        : [],
      include2DSpecMatrix: Boolean(
        obj.gradingAndLessons?.include2DSpecMatrix ?? true
      ),
      includeOMRBubbleSheet: Boolean(
        obj.gradingAndLessons?.includeOMRBubbleSheet ?? false
      ),
      omrQuestionCount: Number(
        obj.gradingAndLessons?.omrQuestionCount ?? 10
      ),
      enableFourModelsABCD: Boolean(
        obj.gradingAndLessons?.enableFourModelsABCD ?? false
      ),
      includeDidacticVigilanceSheet: Boolean(
        obj.gradingAndLessons?.includeDidacticVigilanceSheet ?? false
      ),
      includeIndividualGradingStrip: Boolean(
        obj.gradingAndLessons?.includeIndividualGradingStrip ?? true
      ),
      includeRescueHintsAndContinuity: Boolean(
        obj.gradingAndLessons?.includeRescueHintsAndContinuity ?? true
      ),
    },
    appearanceAndExport: {
      docLang: obj.appearanceAndExport?.docLang || obj.docLang || "FR",
      bilingualLayout:
        obj.appearanceAndExport?.bilingualLayout ||
        obj.bilingualLayout ||
        "SIDE_BY_SIDE",
      exportFormat:
        obj.appearanceAndExport?.exportFormat || obj.exportFormat || "PDF",
      pageOrientation:
        obj.appearanceAndExport?.pageOrientation ||
        obj.pageOrientation ||
        "PORTRAIT",
      docFontFamily:
        obj.appearanceAndExport?.docFontFamily ||
        obj.docFontFamily ||
        "ACADEMIC_SERIF",
      docFontSize:
        obj.appearanceAndExport?.docFontSize || obj.docFontSize || "NORMAL",
      latexPackageTheme:
        obj.appearanceAndExport?.latexPackageTheme ||
        obj.latexPackageTheme ||
        "TCOLORBOX",
      paperSurface:
        obj.appearanceAndExport?.paperSurface ||
        obj.paperSurface ||
        "PLAIN_WHITE",
      customDocTitle: obj.appearanceAndExport?.customDocTitle || "",
      customDocSubtitle: obj.appearanceAndExport?.customDocSubtitle || "",
      customHeaderNote: obj.appearanceAndExport?.customHeaderNote || "",
      customExerciseTitles:
        obj.appearanceAndExport?.customExerciseTitles &&
        typeof obj.appearanceAndExport.customExerciseTitles === "object"
          ? obj.appearanceAndExport.customExerciseTitles
          : {},
      includeDetailedSolutions: Boolean(
        obj.appearanceAndExport?.includeDetailedSolutions ??
          obj.includeDetailedSolutions ??
          false
      ),
      solutionDisplayMode:
        obj.appearanceAndExport?.solutionDisplayMode ||
        obj.solutionDisplayMode ||
        "SEPARATE_PAGE_ANNEXES",
      includeAnswerWorkspace: Boolean(
        obj.appearanceAndExport?.includeAnswerWorkspace ??
          obj.includeAnswerWorkspace ??
          false
      ),
      handwrittenSolutionsOnly: Boolean(
        obj.appearanceAndExport?.handwrittenSolutionsOnly ?? false
      ),
      includeExamFormulaSheet: Boolean(
        obj.appearanceAndExport?.includeExamFormulaSheet ?? false
      ),
      includeDSStudentSelfCheck: Boolean(
        obj.appearanceAndExport?.includeDSStudentSelfCheck ?? true
      ),
      includePostExamRemediationSheet: Boolean(
        obj.appearanceAndExport?.includePostExamRemediationSheet ?? false
      ),
      includeOfficialExamCoverSheet: Boolean(
        obj.appearanceAndExport?.includeOfficialExamCoverSheet ?? false
      ),
      enableBranchColorGradient: Boolean(
        obj.appearanceAndExport?.enableBranchColorGradient ??
          obj.enableBranchColorGradient ??
          true
      ),
      branchColorMode:
        obj.appearanceAndExport?.branchColorMode ||
        obj.branchColorMode ||
        "AUTO_BY_LESSON",
      tcolorboxConfig:
        obj.appearanceAndExport?.tcolorboxConfig &&
        typeof obj.appearanceAndExport.tcolorboxConfig === "object"
          ? {
              ...DEFAULT_TCOLORBOX_CONFIG,
              ...obj.appearanceAndExport.tcolorboxConfig,
            }
          : DEFAULT_TCOLORBOX_CONFIG,
      appliedTitleCalligraphy:
        obj.appearanceAndExport?.appliedTitleCalligraphy &&
        typeof obj.appearanceAndExport.appliedTitleCalligraphy === "object"
          ? obj.appearanceAndExport.appliedTitleCalligraphy
          : {
              fontId: "DEFAULT_DOC",
              scale: "BALANCED",
              ornament: "NONE",
              scope: "HEADER_TITLES",
            },
      studentGridStyle:
        obj.appearanceAndExport?.studentGridStyle || "SEYES_FRENCH",
      workspaceHeightMode:
        obj.appearanceAndExport?.workspaceHeightMode || "ADAPTIVE",
      includeCustomEvalGridSheet: Boolean(
        obj.appearanceAndExport?.includeCustomEvalGridSheet ?? false
      ),
      evalGridGranularity:
        obj.appearanceAndExport?.evalGridGranularity || "BY_QUESTION",
      evalGridStudentCount: Number(
        obj.appearanceAndExport?.evalGridStudentCount ?? 25
      ),
      showA4LivePageBreaks: Boolean(
        obj.appearanceAndExport?.showA4LivePageBreaks ?? false
      ),
      economicTwoUpPrintMode: Boolean(
        obj.appearanceAndExport?.economicTwoUpPrintMode ?? false
      ),
      includeInteractiveQrFooter: Boolean(
        obj.appearanceAndExport?.includeInteractiveQrFooter ?? true
      ),
    },
    workspaceExtensions: {
      autoAttachGeoGebra: Boolean(
        obj.workspaceExtensions?.autoAttachGeoGebra ?? true
      ),
      geoGebraResourcesMap:
        obj.workspaceExtensions?.geoGebraResourcesMap &&
        typeof obj.workspaceExtensions.geoGebraResourcesMap === "object"
          ? obj.workspaceExtensions.geoGebraResourcesMap
          : {},
      isGeoGebra3DMode: Boolean(
        obj.workspaceExtensions?.isGeoGebra3DMode ?? true
      ),
      selectedSpatialPresetId:
        obj.workspaceExtensions?.selectedSpatialPresetId || "SPHERE_PLANE",
      insertedFigures: Array.isArray(obj.workspaceExtensions?.insertedFigures)
        ? obj.workspaceExtensions.insertedFigures
        : [],
      attachedPythonAlgorithms: Array.isArray(
        obj.workspaceExtensions?.attachedPythonAlgorithms
      )
        ? obj.workspaceExtensions.attachedPythonAlgorithms
        : [],
      selectedAiModel:
        obj.workspaceExtensions?.selectedAiModel === "gemini-4-argon"
          ? "gemini-4-argon"
          : "gemini-3.8-flash",
      viewMode:
        obj.workspaceExtensions?.viewMode === "CODE" ||
        obj.workspaceExtensions?.viewMode === "SPLIT"
          ? obj.workspaceExtensions.viewMode
          : "PREVIEW",
      previewZoom: Number(obj.workspaceExtensions?.previewZoom ?? 100),
      syncScrollEnabled: Boolean(
        obj.workspaceExtensions?.syncScrollEnabled ?? true
      ),
      isInlineEditable: Boolean(
        obj.workspaceExtensions?.isInlineEditable ?? false
      ),
      showAnswerKey: Boolean(obj.workspaceExtensions?.showAnswerKey ?? true),
      localStorageSnapshot:
        obj.workspaceExtensions?.localStorageSnapshot &&
        typeof obj.workspaceExtensions.localStorageSnapshot === "object"
          ? obj.workspaceExtensions.localStorageSnapshot
          : undefined,
    },
  };

  return {
    valid: true,
    errors,
    warnings,
    normalizedBlueprint,
    bundledArchives,
  };
}
