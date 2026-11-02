import {
  BilingualLayout,
  computeExactExerciseEffectiveWeights,
  DMSubType,
  DocLanguage,
  DSQuestionDensity,
  ExamModel,
  ExportFormat,
  generateMoroccanQCMExercise,
  generateMoroccanSynthesisProblem,
  GeoGebraResource,
  getAutoGeoGebraResourceForLesson,
  getQuestionBaremesAndLevels,
  getSerieAndDMExercises,
  getVariantQuestions,
  HeaderStyle,
  LessonItem,
  ModuleType,
  MoroccanDSStructureMode,
  QCMGeneratorConfig,
  resolveLessonHeaderIcon,
  SemesterType,
  SolutionDisplayMode,
  TrackData,
} from "../data/curriculum";
import {
  generateExerciseCorrection,
  generateSerieBlockCorrection,
} from "./correctionGenerator";
import {
  generateCustomCountSerieExercises,
  getMoroccanLessonMemo,
  MoroccanDMType,
  MOROCCAN_DM_PRESETS,
} from "./seriesGenerator";
import {
  StudentGridStyle,
  analyzeFullAnswerWorkspaceRequirement,
  buildCustomTcolorboxLatexPreamble,
  DEFAULT_TCOLORBOX_CONFIG,
  LATEX_PACKAGE_OPTIONS,
  LatexPackageTheme,
  TcolorboxCustomConfig,
} from "./latexPackagesAndMath";
import { generateFullMoroccanPedagogicalFiche } from "./ficheGenerator";
import { generateMoroccanDiagnosticPaper } from "./diagnosticGenerator";
import {
  build2DSpecificationMatrix,
  generate2DSpecMatrixLatex,
  generate2DSpecMatrixTypst,
  getTypicalErrorsForLessons,
} from "./advancedPedagogicalTools";
import { PythonAlgorithmPreset } from "../data/pythonAlgorithms";
import { sanitizeAndValidateQuestionsList } from "./mathjsValidator";
import { AppliedTitleCalligraphyConfig } from "../components/ArabicCalligraphySimulator";

export interface GeneratorParams {
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
  exportFormat: ExportFormat;
  activeModule: ModuleType;
  n1: number;
  n2: number;
  n3: number;
  fillBlanks: boolean;
  includeTICE: boolean;
  selectedLessonIdx: number;
  diagDuration: string;
  diagType?: string;
  customTopicNote?: string;
  system?: "MAROC_NATIONAL" | "MISSION_FRANCAISE";
  calculatorAllowed?: boolean;
  includeCompetencies?: boolean;
  customLessons?: LessonItem[];
  dmSubType?: DMSubType;
  dmNumber?: string;
  dmDueDate?: string;
  includeHints?: boolean;
  includeTeacherLogo?: boolean;
  customDocTitle?: string;
  customDocSubtitle?: string;
  customHeaderNote?: string;
  customExerciseTitles?: Record<number, string>;
  includeDetailedSolutions?: boolean;
  solutionDisplayMode?: SolutionDisplayMode;
  showQuestionBareme?: boolean;
  includeSelfEvalGrid?: boolean;
  geoGebraResourcesMap?: Record<string, GeoGebraResource>;
  autoAttachGeoGebra?: boolean;
  serieExerciseCount?: number;
  dsStructureMode?: MoroccanDSStructureMode;
  dsQuestionDensity?: DSQuestionDensity;
  includeMoroccanExamDirectives?: boolean;
  includeGradingScaleTable?: boolean;
  include2DSpecMatrix?: boolean;
  includeAnswerWorkspace?: boolean;
  studentGridStyle?: StudentGridStyle;
  moroccanDMType?: MoroccanDMType;
  includeLessonMemo?: boolean;
  includeDMContract?: boolean;
  latexPackageTheme?: LatexPackageTheme;
  tcolorboxConfig?: TcolorboxCustomConfig;
  qcmConfig?: QCMGeneratorConfig;
  includeInteractiveQrFooter?: boolean;
  interactiveExamUrl?: string;
  attachedPythonAlgorithms?: PythonAlgorithmPreset[];
  appliedTitleCalligraphy?: AppliedTitleCalligraphyConfig;
  includeCommonErrorsInSolutions?: boolean;
  pageMarginsMm?: {
    topMm: number;
    bottomMm: number;
    xMm: number;
  } | null;
}

function formatQuarterPoints(pts: number): string {
  const rounded = Math.round(pts * 4) / 4;
  return rounded
    .toFixed(2)
    .replace(/\.00$/, ".0")
    .replace(/(\.\d)0$/, "$1");
}

/**
 * يحول الرموز الرياضية اليونيكود (ℝ, ℕ, √, ≤, ≥, ≠, ∞, π, Δ, i⃗, ², ³...) إلى أوامر LaTeX قياسية
 * حتى يتم تجميع ملفات .tex مباشرة في Overleaf (pdflatex / xelatex) بدون أخطاء.
 */
export function sanitizeLatexDocumentBody(latexSource: string): string {
  if (!latexSource) return "";
  const verbatimBlocks: string[] = [];
  const withProtectedVerbatim = latexSource.replace(
    /\\begin\{verbatim\}[\s\S]*?\\end\{verbatim\}/g,
    (match) => {
      const idx = verbatimBlocks.length;
      verbatimBlocks.push(match);
      return `@@VERBATIM_BLOCK_${idx}@@`;
    }
  );
  const sanitized = withProtectedVerbatim
    .replace(/([A-Za-z]{2})\u20d7/g, "$\\overrightarrow{$1}$")
    .replace(/([a-zA-Z])\u20d7/g, "$\\vec{$1}$")
    .replace(/√\(([^)]+)\)/g, "$\\sqrt{$1}$")
    .replace(/√([0-9a-zA-Z]+)/g, "$\\sqrt{$1}$")
    .replace(/ℝ/g, "$\\mathbb{R}$")
    .replace(/ℕ/g, "$\\mathbb{N}$")
    .replace(/ℤ/g, "$\\mathbb{Z}$")
    .replace(/ℂ/g, "$\\mathbb{C}$")
    .replace(/ℚ/g, "$\\mathbb{Q}$")
    .replace(/≤/g, "$\\le$")
    .replace(/≥/g, "$\\ge$")
    .replace(/≠/g, "$\\neq$")
    .replace(/≈/g, "$\\approx$")
    .replace(/∞/g, "$\\infty$")
    .replace(/∀/g, "$\\forall$")
    .replace(/∃/g, "$\\exists$")
    .replace(/∈/g, "$\\in$")
    .replace(/∉/g, "$\\notin$")
    .replace(/⊂/g, "$\\subset$")
    .replace(/∪/g, "$\\cup$")
    .replace(/∩/g, "$\\cap$")
    .replace(/⇒/g, "$\\Rightarrow$")
    .replace(/⇔/g, "$\\Leftrightarrow$")
    .replace(/↦/g, "$\\mapsto$")
    .replace(/→/g, "$\\to$")
    .replace(/±/g, "$\\pm$")
    .replace(/×/g, "$\\times$")
    .replace(/÷/g, "$\\div$")
    .replace(/π/g, "$\\pi$")
    .replace(/Δ/g, "$\\Delta$")
    .replace(/Ω/g, "$\\Omega$")
    .replace(/Γ/g, "$\\Gamma$")
    .replace(/α/g, "$\\alpha$")
    .replace(/β/g, "$\\beta$")
    .replace(/θ/g, "$\\theta$")
    .replace(/λ/g, "$\\lambda$")
    .replace(/∫/g, "$\\int$")
    .replace(/∑/g, "$\\sum$")
    .replace(/∏/g, "$\\prod$")
    .replace(/⁻¹/g, "$^{-1}$")
    .replace(/²/g, "$^2$")
    .replace(/³/g, "$^3$")
    .replace(/⁴/g, "$^4$")
    // دمج علامات الدولار المتتالية الناتجة عن استبدال رمزين متجاورين
    .replace(/\$\$/g, "");
  return sanitized.replace(
    /@@VERBATIM_BLOCK_(\d+)@@/g,
    (_, idxStr) => verbatimBlocks[Number(idxStr)] || ""
  );
}

export function generateOfflineSourceCode(params: GeneratorParams): string {
  const {
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
    exportFormat,
    activeModule,
    n1,
    n2,
    n3,
    fillBlanks,
    includeTICE,
    selectedLessonIdx,
    diagDuration,
    customLessons,
    dmSubType = "DEVOIR_MAISON",
    dmNumber = "N° 1",
    dmDueDate = "................",
    includeHints = true,
    includeTeacherLogo = true,
    customDocTitle = "",
    customDocSubtitle = "",
    customHeaderNote = "",
    customExerciseTitles = {},
    includeDetailedSolutions = false,
    solutionDisplayMode = "SEPARATE_PAGE_ANNEXES",
    showQuestionBareme = true,
    include2DSpecMatrix = true,
    includeAnswerWorkspace = false,
    studentGridStyle = "SEYES_FRENCH",
    includeSelfEvalGrid = true,
    geoGebraResourcesMap = {},
    autoAttachGeoGebra = true,
    serieExerciseCount = 6,
    dsStructureMode = "EXERCICES_ET_PROBLEME",
    dsQuestionDensity = "INTENSIVE",
    latexPackageTheme = "TCOLORBOX",
    tcolorboxConfig = DEFAULT_TCOLORBOX_CONFIG,
    qcmConfig,
    attachedPythonAlgorithms = [],
    pageMarginsMm = null,
  } = params;

  // تحديد هوامش الصفحة تلقائياً بناءً على نوع الوثيقة (فرض محروس: 16×15mm، سلسلة تمارين: 8×8mm، فرض منزلي: 12×12mm، رائز: 11×10mm، جذاذة: 10×9mm) أو التخصيص اليدوي
  const defaultMarginsMm =
    activeModule === "DS_142_08"
      ? { topMm: 16, bottomMm: 16, xMm: 15 }
      : activeModule === "DM_SERIE"
      ? dmSubType === "SERIE_TD"
        ? { topMm: 8, bottomMm: 8, xMm: 8 }
        : { topMm: 12, bottomMm: 12, xMm: 12 }
      : activeModule === "DIAGNOSTIC"
      ? { topMm: 11, bottomMm: 11, xMm: 10 }
      : { topMm: 10, bottomMm: 10, xMm: 9 };

  const activeMarginsMm = pageMarginsMm || defaultMarginsMm;
  const resolvedTopCm = (activeMarginsMm.topMm / 10).toFixed(1);
  const resolvedBottomCm = (activeMarginsMm.bottomMm / 10).toFixed(1);
  const resolvedXCm = (activeMarginsMm.xMm / 10).toFixed(1);

  const isMission =
    track.system === "MISSION_FRANCAISE" || params.system === "MISSION_FRANCAISE";
  const baseDsLessons: LessonItem[] =
    customLessons && customLessons.length > 0
      ? customLessons
      : track.semesters[sem][dsKey] || [];
  const allLessons: LessonItem[] = [
    ...Object.values(track.semesters.S1).flat(),
    ...Object.values(track.semesters.S2).flat(),
  ];
  const ficheLesson = allLessons[selectedLessonIdx] || allLessons[0];
  const isAr = docLang === "AR" && !isMission;
  const isPureFr = docLang === "FR" || isMission;
  const isDM = dmSubType === "DEVOIR_MAISON";
  const gridStyleBadge =
    studentGridStyle === "SEYES_FRENCH"
      ? "Seyès"
      : studentGridStyle === "LINED_RULED"
      ? "Ligné"
      : studentGridStyle === "MILLIMETER_GRID"
      ? "Millimétré"
      : studentGridStyle === "DOTTED_BOX"
      ? "Pointé"
      : "Cadre";

  const modelsToRender: Array<"A" | "B"> =
    examModel === "BOTH" ? ["A", "B"] : [examModel];

  const modelArabicLabel = (m: "A" | "B") => (m === "A" ? "أ" : "ب");

  const hasQCMGlobal =
    activeModule === "DS_142_08" &&
    (dsStructureMode === "QCM_ET_EXERCICES" ||
      dsStructureMode === "COMPLETE_EXAM_MAROC");
  const hasSynthesisProblemGlobal =
    activeModule === "DS_142_08" &&
    (dsStructureMode === "EXERCICES_ET_PROBLEME" ||
      dsStructureMode === "COMPLETE_EXAM_MAROC" ||
      dsStructureMode === "EXAMEN_BLANC_2BAC");
  const fixedQcmPts = hasQCMGlobal
    ? Number(((qcmConfig?.questionCount || 4) * 1.0).toFixed(1))
    : 0;
  const fixedProbPts = hasSynthesisProblemGlobal ? 8.5 : 0;
  const exBudget = Math.max(4, 20 - fixedQcmPts - fixedProbPts);

  // توزيع دقيق بمضاعفات 0.25 نقطة يضمن أن المجموع يساوي 20.00 / 20 دائماً
  const baseExactWeightsPct = computeExactExerciseEffectiveWeights(
    baseDsLessons,
    exBudget
  );
  const getLessonExactWeightPct = (
    lesson: LessonItem,
    idx?: number,
    list?: LessonItem[]
  ): number => {
    if (list && idx !== undefined) {
      const weights = computeExactExerciseEffectiveWeights(list, exBudget);
      if (weights[idx] !== undefined) return weights[idx];
    }
    const foundIdx = baseDsLessons.indexOf(lesson);
    if (foundIdx >= 0 && baseExactWeightsPct[foundIdx] !== undefined) {
      return baseExactWeightsPct[foundIdx];
    }
    const rawSum = Math.max(
      1,
      baseDsLessons.reduce((acc, l) => acc + l.weight, 0)
    );
    const pts = Math.max(0.5, Math.round(((lesson.weight / rawSum) * exBudget) * 4) / 4);
    return Number(((pts / 20) * 100).toFixed(2));
  };
  const getScaledLessonPoints = (
    rawWeight: number,
    lesson?: LessonItem,
    idx?: number,
    list?: LessonItem[]
  ): number => {
    if (lesson) {
      const pct = getLessonExactWeightPct(lesson, idx, list);
      return Math.round(((pct * 20) / 100) * 4) / 4;
    }
    const totalRaw = Math.max(
      1,
      baseDsLessons.reduce((acc, l) => acc + l.weight, 0)
    );
    return Math.max(0.5, Math.round(((rawWeight / totalRaw) * exBudget) * 4) / 4);
  };
  const getScaledLessonWeightPercent = (
    rawWeight: number,
    lesson?: LessonItem,
    idx?: number,
    list?: LessonItem[]
  ): number => {
    if (lesson) {
      return getLessonExactWeightPct(lesson, idx, list);
    }
    return Number(((getScaledLessonPoints(rawWeight) / 20) * 100).toFixed(2));
  };

  const spec2DMatrix =
    activeModule === "DS_142_08" && include2DSpecMatrix
      ? build2DSpecificationMatrix(
          baseDsLessons,
          n1,
          n2,
          n3,
          dsStructureMode,
          isMission,
          dsQuestionDensity,
          qcmConfig?.questionCount || 4
        )
      : null;

  // ================= أ. توليد كود TYPST (.typ) =================
  if (exportFormat === "TYPST") {
    const renderTypstHeader = (modelLabel?: "A" | "B") => {
      const sujBadge = modelLabel
        ? isMission
          ? ` — Sujet (${modelLabel})`
          : isAr
          ? ` — النموذج (${modelArabicLabel(modelLabel)})`
          : ` — Sujet (${modelLabel})`
        : "";

      const defaultDocTitle =
        activeModule === "DS_142_08"
          ? isMission
            ? `Devoir Surveillé N° ${dsKey.replace("DS", "")} (${sem})${sujBadge}`
            : isAr
            ? `الفرض المحروس ${dsKey} (${sem})${sujBadge}`
            : `Devoir Surveillé ${dsKey} (${sem})${sujBadge}`
          : activeModule === "DM_SERIE"
          ? isDM
            ? isAr
              ? `الفرض المنزلي ${dmNumber} (${sem})${sujBadge}`
              : `Devoir Maison (DM ${dmNumber} - ${sem})${sujBadge}`
            : isAr
            ? `سلسلة تمارين تطبيقية وتوليفية ${dmNumber} (${sem})`
            : `Série d'Exercices & Travaux Dirigés (${dmNumber} - ${sem})`
          : activeModule === "FICHE_OP2007"
          ? isMission
            ? "Fiche de Séquence Pédagogique (Lycée Français)"
            : "جذاذة تربوية رسمية (OP 2007)"
          : activeModule === "DIAGNOSTIC"
          ? isMission
            ? `Test de Positionnement & Diagnostic (${diagDuration})`
            : `رائز التقويم التشخيصي (${diagDuration})`
          : isMission
          ? "Progression Annuelle & Calendrier AEFE"
          : "التوزيع السنوي للمقرر والأطر المرجعية";

      const docTitle = customDocTitle.trim()
        ? `${customDocTitle.trim()}${sujBadge}`
        : defaultDocTitle;

      const defaultSubMeta =
        activeModule === "DM_SERIE"
          ? isDM
            ? isMission || isPureFr
              ? `À rendre le : ${dmDueDate}`
              : `تاريخ الإرجاع : ${dmDueDate}`
            : isMission || isPureFr
            ? "Exercices gradués (★ / ★★ / ★★★)"
            : "تمارين متدرجة حسب الصعوبة (★ / ★★ / ★★★)"
          : isMission || isPureFr
          ? `Durée de l'épreuve : ${track.durationFr}`
          : `المدة الزمنية : ${track.durationAr}`;

      const subMeta = customDocSubtitle.trim() || defaultSubMeta;

      return `#rect(width: 100%, stroke: 1.2pt + rgb("#1e1b4b"), inset: 10pt, radius: 4pt)[
  #grid(
    columns: (1.5fr, 2fr, 1.5fr),
    align: (left + horizon, center + horizon, right + horizon),
    [
      ${
        isMission
          ? `*AEFE / OSUI — Enseignement Français au Maroc*\n*${school}*\n#text(size: 8.5pt)[${params.calculatorAllowed !== false ? "✓ Calculatrice mode examen autorisée" : "✗ Calculatrice interdite"}]\nAnnée Scolaire : ${year}`
          : headerStyle === "OFFICIAL_AREF"
          ? `*المملكة المغربية — وزارة التربية الوطنية*\n${academy}\n${direction}\n*${school}*`
          : `*${school}*\nالسنة الدراسية : ${year}`
      }
    ],
    [
      #text(weight: "bold", size: 12pt)[${docTitle}]\n
      #text(size: 9pt)[${subMeta}]${
        customHeaderNote.trim()
          ? `\n      #v(2pt)\n      #text(size: 8pt, style: "italic")[${customHeaderNote.trim()}]`
          : ""
      }
    ],
    [
      ${
        includeTeacherLogo
          ? `#box(stroke: 1pt + rgb("#b45309"), fill: rgb("#09090b"), radius: 10pt, inset: (x: 6pt, y: 2.5pt))[#text(fill: rgb("#fde047"), weight: "bold", size: 7.5pt)[√ MATHEMATICS · Prof Kouziber]]\n      `
          : ""
      }*${isMission || isPureFr ? "Discipline : Mathématiques" : "المادة : الرياضيات"}*\n
      *${prof}*\n
      #text(size: 9.5pt)[${isMission || isPureFr ? track.labelFr : track.labelAr}]
    ]
  )
  ${
    isMission && params.includeCompetencies !== false
      ? `\n  #v(4pt)\n  #line(length: 100%, stroke: 0.5pt + rgb("#cbd5e1"))\n  #text(size: 8pt)[*Compétences évaluées (BOEN) :* [ ] Chercher  |  [ ] Modéliser  |  [ ] Représenter  |  [ ] Raisonner  |  [ ] Calculer  |  [ ] Communiquer]`
      : ""
  }
  ${
    (activeModule === "DS_142_08" || (activeModule === "DM_SERIE" && isDM)) &&
    (includeStudentBox || includeGradeBox)
      ? `\n  #v(4pt)\n  #line(length: 100%, stroke: 0.5pt + rgb("#cbd5e1"))\n  #grid(
    columns: (2fr, 1.2fr),
    [${
      includeStudentBox
        ? isMission || isPureFr
          ? "Nom & Prénom : ..........................................  Classe : ......... N° : ......"
          : "الاسم والنسب : ..........................................  القسم : ......... الرقم : ......"
        : ""
    }],
    [${
      includeGradeBox
        ? isMission || isPureFr
          ? "*Note : ......... / 20*  (Appréciation : .........)"
          : "*النقطة : ......... / 20*  (الملاحظة : .........)"
        : ""
    }]
  )`
      : ""
  }
]`;
    };

    const renderTypstDSModel = (m: "A" | "B") => {
      const orderedLessons =
        shuffleExercises && m === "B"
          ? [...baseDsLessons].reverse()
          : baseDsLessons;

      const hasQCM = hasQCMGlobal;
      const hasSynthesisProblem = hasSynthesisProblemGlobal;
      const qcmBlock = hasQCM
        ? generateMoroccanQCMExercise(orderedLessons, m, track.cycle, {
            ...qcmConfig,
            isMission,
          })
        : null;
      const synthesisProblem = hasSynthesisProblem
        ? generateMoroccanSynthesisProblem(orderedLessons, m, track.cycle, isMission)
        : null;
      const exOffset = hasQCM ? 1 : 0;

      const gradingStripCellsTypst: string[] = [];
      if (qcmBlock) {
        gradingStripCellsTypst.push(
          `[*Ex 1 (QCM)* : .... / ${qcmBlock.totalPoints}]`
        );
      }
      orderedLessons.forEach((l, idx) => {
        const pts = getScaledLessonPoints(l.weight, l, idx, orderedLessons);
        gradingStripCellsTypst.push(
          `[*Ex ${idx + 1 + exOffset}* : .... / ${formatQuarterPoints(pts)}]`
        );
      });
      if (synthesisProblem) {
        gradingStripCellsTypst.push(
          `[*${isMission || isPureFr ? "Problème" : "المسألة"}* : .... / ${synthesisProblem.totalPoints}]`
        );
      }
      gradingStripCellsTypst.push(`[*Total* : .... / 20]`);
      const gradingStripTypst =
        params.includeGradingScaleTable !== false
          ? `\n#block(width: 100%, fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#94a3b8"), inset: 5pt, radius: 3pt)[#text(size: 8pt)[${
              isMission || isPureFr
                ? "*Grille de notation par exercice :*  "
                : "*سلم تنقيط التمارين الفردي :*  "
            }${gradingStripCellsTypst.join("   |   ")}]]\n`
          : "";

      const qcmTypst = qcmBlock
        ? `\n=== ${isMission || isPureFr ? qcmBlock.titleFr : qcmBlock.titleAr} (${qcmBlock.totalPoints} pts)\n_${
            isMission || isPureFr ? qcmBlock.instructionFr : qcmBlock.instructionAr
          }_\n` +
          qcmBlock.items
            .map(
              (item) =>
                `+ *${isMission || isPureFr ? item.statementFr : item.statementAr}* #h(1fr) *[${item.points} ${isMission || isPureFr ? "pt" : "ن"}]*\n  ${(isMission || isPureFr ? item.optionsFr : item.optionsAr).join("   |   ")}`
            )
            .join("\n") +
          `\n\n#v(0.2cm)\n`
        : "";

      const synthTypst = synthesisProblem
        ? `\n\n// [SYNC_SECTION:SYNTHESIS_PROBLEM]\n#v(0.2cm)\n=== ${isMission || isPureFr ? synthesisProblem.titleFr : synthesisProblem.titleAr} (${synthesisProblem.totalPoints} pts)\n` +
          synthesisProblem.parts
            .map(
              (p, pIdx) =>
                `==== ${isMission || isPureFr ? p.partTitleFr : p.partTitleAr}\n` +
                (isMission || isPureFr ? p.questionsFr : p.questionsAr)
                  .map((q) => {
                    const wsSpec = analyzeFullAnswerWorkspaceRequirement({
                      questionText: q,
                      difficultyLevel: pIdx === 0 ? "N2" : "N3",
                      points: 1.5,
                    });
                    const wsTypst = includeAnswerWorkspace
                      ? `\n  #block(width: 100%, height: ${wsSpec.heightCmTypst}, stroke: (left: 1.5pt + rgb("#f43f5e"), rest: 0.4pt + luma(200)), inset: 5pt, radius: 3pt, fill: rgb("#fcfcff"))[#text(size: 7.5pt, fill: luma(120))[${
                          isMission || isPureFr
                            ? `[${gridStyleBadge}] ${wsSpec.taskBadgeFr} (${wsSpec.recommendedLines} lignes — ${wsSpec.methodStepsFr.join(" · ")})`
                            : `[${gridStyleBadge}] ${wsSpec.taskBadgeAr} (${wsSpec.recommendedLines} أسطر — ${wsSpec.methodStepsAr.join(" · ")})`
                        }]]`
                      : "";
                    return `+ ${q}${wsTypst}`;
                  })
                  .join("\n")
            )
            .join("\n\n")
        : "";

      return `// [SYNC_SECTION:HEADER]
${renderTypstHeader(m)}
${gradingStripTypst}
// [SYNC_SECTION:EXERCISES]
#v(0.3cm)
#text(weight: "bold", size: 12pt)[${
        isMission
          ? `Devoir Surveillé (${dsKey} - ${sem}) — Sujet ${m}`
          : isAr
          ? `نص الفرض المحروس (${dsKey} - ${sem}) — النموذج (${modelArabicLabel(m)})`
          : `Sujet du Devoir Surveillé (${dsKey} - ${sem}) — Modèle (${m})`
      }]
${qcmTypst}
${orderedLessons
  .map((l, idx) => {
    const rawVariantQs = getVariantQuestions(
      l,
      m,
      shuffleQuestions,
      0,
      dsQuestionDensity
    );
    const questionsAr = sanitizeAndValidateQuestionsList(
      rawVariantQs.questionsAr
    ).sanitizedQuestions;
    const questionsFr = sanitizeAndValidateQuestionsList(
      rawVariantQs.questionsFr
    ).sanitizedQuestions;
    const scaledPts = getScaledLessonPoints(l.weight, l, idx, orderedLessons);
    const scaledWeightPct = getScaledLessonWeightPercent(
      l.weight,
      l,
      idx,
      orderedLessons
    );
    const qMetas = getQuestionBaremesAndLevels(
      scaledWeightPct,
      questionsFr.length,
      n1,
      n2,
      n3,
      l.customQuestionBaremes,
      l.customQuestionLevels
    );
    const activeQuestions = isMission || isPureFr ? questionsFr : questionsAr;
    const customExTitle = customExerciseTitles[idx]?.trim();
    const displayExNum = idx + 1 + exOffset;
    const ptsStr = formatQuarterPoints(scaledPts);
    const resolvedIcon = resolveLessonHeaderIcon(l);
    const iconTypst = resolvedIcon?.typstPrefix ? `${resolvedIcon.typstPrefix} ` : "";
    const title = customExTitle
      ? `${iconTypst}${customExTitle} (${ptsStr} ${isMission || isPureFr ? "points" : "نقط"})`
      : isMission || isPureFr
      ? `${iconTypst}Exercice ${displayExNum} : ${l.lessonFr} (${ptsStr} points)`
      : `${iconTypst}التمرين ${displayExNum} : ${l.lessonAr} (${ptsStr} نقط)`;

    const ggbRes = getAutoGeoGebraResourceForLesson(
      l,
      geoGebraResourcesMap,
      autoAttachGeoGebra
    );
    const ggbTypst = ggbRes
      ? `\n#block(fill: rgb("#f0fdfa"), stroke: 0.6pt + rgb("#0d9488"), inset: 6pt, radius: 4pt, width: 100%)[*GeoGebra :* ${
          isMission || isPureFr ? ggbRes.titleFr : ggbRes.titleAr
        } ${
          ggbRes.fileName
            ? `— Fichier: \`${ggbRes.fileName}\``
            : ggbRes.interactiveUrl
            ? `— Lien: ${ggbRes.interactiveUrl}`
            : ""
        }]`
      : "";

    return `=== ${title}
${activeQuestions
  .map((q, qIdx) => {
    const meta = qMetas[qIdx];
    const baremeSuffix =
      showQuestionBareme && meta
        ? ` #h(1fr) *[${meta.points} ${isMission || isPureFr ? "pt" : "ن"} · ${meta.level}]*`
        : "";
    const wsSpec = analyzeFullAnswerWorkspaceRequirement({
      questionText: q,
      difficultyLevel: meta?.level || "N1",
      points: meta?.points,
    });
    const workspaceTypst = includeAnswerWorkspace
      ? `\n  #block(width: 100%, height: ${wsSpec.heightCmTypst}, stroke: (left: 1.5pt + rgb("#f43f5e"), rest: 0.4pt + luma(200)), inset: 5pt, radius: 3pt, fill: rgb("#fcfcff"))[#text(size: 7.5pt, fill: luma(120))[${
          isMission || isPureFr
            ? `[${gridStyleBadge}] ${wsSpec.taskBadgeFr} · ${wsSpec.recommendedLines} lignes (${meta?.level || "N1"}) — ${wsSpec.methodStepsFr.join(" | ")}`
            : `[${gridStyleBadge}] ${wsSpec.taskBadgeAr} · ${wsSpec.recommendedLines} أسطر (${meta?.level || "N1"}) — ${wsSpec.methodStepsAr.join(" | ")}`
        }]]`
      : "";
    return `+ ${
      fillBlanks && idx === 0 && qIdx === 0
        ? isMission || isPureFr
          ? `_(Preuve guidée à trous)_ ${q}`
          : `_(برهان موجه بملء الفراغات)_ ${q}`
        : q
    }${baremeSuffix}${workspaceTypst}`;
  })
  .join("\n")}${ggbTypst}`;
  })
  .join("\n\n#v(0.2cm)\n")}${synthTypst}`;
    };

    const renderTypstDMSerie = (m: "A" | "B") => {
      const bodyContent = !isDM
        ? generateCustomCountSerieExercises(
            baseDsLessons,
            serieExerciseCount,
            m
          )
            .map((block, exIdx) => {
              const associatedLesson =
                baseDsLessons[exIdx % Math.max(1, baseDsLessons.length)];
              const resolvedIcon = resolveLessonHeaderIcon(associatedLesson);
              const iconTypst = resolvedIcon?.typstPrefix ? `${resolvedIcon.typstPrefix} ` : "";
              const customTitle = customExerciseTitles[exIdx]?.trim();
              const headerTitle =
                customTitle ||
                (isMission || isPureFr ? block.badgeFr : block.badgeAr);
              const qs =
                isMission || isPureFr ? block.questionsFr : block.questionsAr;
              const hint = isMission || isPureFr ? block.hintFr : block.hintAr;

              return `=== ${iconTypst}${headerTitle} (${block.stars})
${qs.map((q) => `+ ${q}`).join("\n")}${
                includeHints && hint ? `\n#emph[${hint}]` : ""
              }`;
            })
            .join("\n\n#v(0.25cm)\n")
        : baseDsLessons
            .map((l, idx) => {
              const blocks = getSerieAndDMExercises(l, dmSubType, m);
              const pts = ((l.weight * 20) / 100).toFixed(1);
              const resolvedIcon = resolveLessonHeaderIcon(l);
              const iconTypst = resolvedIcon?.typstPrefix ? `${resolvedIcon.typstPrefix} ` : "";
              const headerTitle =
                customExerciseTitles[idx]?.trim()
                  ? `== ${iconTypst}${customExerciseTitles[idx].trim()} (${pts} ${isMission || isPureFr ? "points" : "نقط"} — ${l.weight}%)`
                  : isMission || isPureFr
                  ? `== ${iconTypst}Problème ${idx + 1} : ${l.lessonFr} (${pts} points — ${l.weight}%)`
                  : `== ${iconTypst}التمرين التوليفي ${idx + 1} : ${l.lessonAr} (${pts} نقط — ${l.weight}%)`;

              const dmGgbRes = getAutoGeoGebraResourceForLesson(
                l,
                geoGebraResourcesMap,
                autoAttachGeoGebra
              );
              const dmGgbTypst = dmGgbRes
                ? `\n\n#block(fill: rgb("#f0fdfa"), stroke: 0.6pt + rgb("#0d9488"), inset: 6pt, radius: 4pt, width: 100%)[*Support GeoGebra :* ${
                    isMission || isPureFr ? dmGgbRes.titleFr : dmGgbRes.titleAr
                  } ${
                    dmGgbRes.fileName
                      ? `(\`${dmGgbRes.fileName}\`)`
                      : dmGgbRes.interactiveUrl || ""
                  }]`
                : "";

              return `${headerTitle}
${blocks
  .map((b) => {
    const qs = isMission || isPureFr ? b.questionsFr : b.questionsAr;
    const hint = isMission || isPureFr ? b.hintFr : b.hintAr;
    return `=== ${isMission || isPureFr ? b.badgeFr : b.badgeAr}
${qs.map((q) => `+ ${q}`).join("\n")}${
      includeHints ? `\n#emph[${hint}]` : ""
    }`;
  })
  .join("\n\n")}${dmGgbTypst}`;
            })
            .join("\n\n#v(0.3cm)\n#line(length: 100%, stroke: 0.4pt)\n");

      const solutionsTypst = includeDetailedSolutions
        ? `\n\n#pagebreak()\n== ${
            isMission || isPureFr
              ? `Annexe : Corrigé Détaillé (${isDM ? `Devoir Maison ${dmNumber} - Sujet ${m}` : `Série d'Exercices ${dmNumber}`})`
              : `الملحق الرسمي: عناصر الإجابة والحل المفصل (${isDM ? `الفرض المنزلي ${dmNumber}` : `سلسلة التمارين ${dmNumber}`})`
          }\n` +
          (!isDM
            ? generateCustomCountSerieExercises(
                baseDsLessons,
                serieExerciseCount,
                m
              )
                .map((block, exIdx) => {
                  const associatedLesson =
                    baseDsLessons[exIdx % Math.max(1, baseDsLessons.length)];
                  const corr = generateSerieBlockCorrection(
                    block,
                    exIdx,
                    associatedLesson,
                    m
                  );
                  return (
                    `=== ${
                      customExerciseTitles[exIdx]?.trim() ||
                      (isMission || isPureFr ? block.badgeFr : block.badgeAr)
                    }\n` +
                    corr.solutions
                      .map(
                        (s) =>
                          `+ *${
                            isMission || isPureFr
                              ? `Question ${s.questionNumber}`
                              : `السؤال ${s.questionNumber}`
                          }* [${s.bareme}]\n  ${
                            isMission || isPureFr
                              ? s.solutionTextFr
                              : s.solutionTextAr
                          }`
                      )
                      .join("\n\n")
                  );
                })
                .join("\n\n#v(0.25cm)\n")
            : baseDsLessons
                .map((l, idx) => {
                  const blocks = getSerieAndDMExercises(l, dmSubType, m);
                  return (
                    `=== ${
                      isMission || isPureFr
                        ? `Corrigé Problème ${idx + 1} : ${l.lessonFr}`
                        : `تصحيح التمرين التوليفي ${idx + 1} : ${l.lessonAr}`
                    }\n` +
                    blocks
                      .map((b, bIdx) => {
                        const corr = generateSerieBlockCorrection(
                          b,
                          bIdx,
                          l,
                          m
                        );
                        return corr.solutions
                          .map(
                            (s) =>
                              `+ *${
                                isMission || isPureFr
                                  ? `Question ${s.questionNumber}`
                                  : `السؤال ${s.questionNumber}`
                              }* [${s.bareme}]\n  ${
                                isMission || isPureFr
                                  ? s.solutionTextFr
                                  : s.solutionTextAr
                              }`
                          )
                          .join("\n\n");
                      })
                      .join("\n\n")
                  );
                })
                .join("\n\n#v(0.3cm)\n"))
        : "";

      return `// [SYNC_SECTION:HEADER]
${renderTypstHeader(isDM ? m : undefined)}

// [SYNC_SECTION:EXERCISES]
#v(0.3cm)
${bodyContent}${
        includeSelfEvalGrid
          ? `\n\n#v(0.4cm)\n=== ${
              isMission || isPureFr
                ? "Grille d'Auto-Évaluation de l'Élève & Suivi des Compétences"
                : "شبكة التقويم الذاتي للتلميذ وتتبع التحكم في القدرات"
            }\n#table(\n  columns: (4fr, 1.2fr, 1.2fr, 1.2fr),\n  inset: 6pt,\n  [*${
              isMission || isPureFr ? "Capacité ciblée" : "القدرة المستهدفة"
            }*], [*Acquis*], [*En cours*], [*Non acquis*],\n${baseDsLessons
              .map(
                (l, i) =>
                  `  [${i + 1}. ${isMission || isPureFr ? l.capacitiesFr[0] || l.lessonFr : l.capacitiesAr[0] || l.lessonAr}], [[ ]], [[ ]], [[ ]],`
              )
              .join("\n")}\n)`
          : ""
      }${solutionsTypst ? `\n// [SYNC_SECTION:SOLUTIONS]${solutionsTypst}` : ""}`;
    };

    return `// ============================================================================
// وثيقة بيداغوجية رسمية مصففة بواسطة Typst (.typ)
// المؤسسة: ${school} | الأستاذ: ${prof} | السنة الدراسية: ${year}
// المسلك: ${track.labelAr} (${track.labelFr})
// النظام التعليمي: ${isMission ? "مدارس البعثة الفرنسية بالمغرب (AEFE / OSUI)" : "السلك الثانوي التأهيلي المغربي"}
// ============================================================================

#set page(paper: "a4", margin: (top: ${resolvedTopCm}cm, bottom: ${resolvedBottomCm}cm, x: ${resolvedXCm}cm))
#set text(font: "${isAr ? "Amiri" : "Linux Libertine"}", size: 11pt, lang: "${isAr ? "ar" : "fr"}", dir: ${isAr ? "rtl" : "ltr"})

${
  activeModule === "DS_142_08"
    ? `// [SYNC_SECTION:SPEC_TABLE]
== ${
        isMission
          ? "Grille d'évaluation par compétences mathématiques (Programme National Français & AEFE)"
          : "أولاً: شبكة التخصيص والتقويم (طبقاً للمذكرة الوزارية رقم 142-08)"
      }
#table(
  columns: (2.5fr, 4.5fr, 1.2fr, 1.2fr),
  inset: 7pt,
  align: horizon,
  [${isMission ? "*Thème / Chapitre*" : "*الوحدة / الدرس*"}], [${isMission ? "*Attendus du programme (BOEN)*" : "*القدرات المنتظرة (التوجيهات التربوية 2007)*"}], [${isMission ? "*Pondération*" : "*نسبة الأهمية*"}], [${isMission ? "*Barème*" : "*سلم التنقيط*"}],
${
  hasQCMGlobal
    ? `  [*${isMission || isPureFr ? "Exercice 1 : QCM de synthèse" : "التمرين 1 : أسئلة متعددة الاختيارات (QCM)"}*], [${isMission || isPureFr ? "Maîtrise des concepts et calculs rapides" : "التحكم في المفاهيم الأساسية والحساب السريع"}], [20%], [*4.0 / 20*],\n`
    : ""
}${baseDsLessons
  .map((l, idx) => {
    const scaledPts = getScaledLessonPoints(l.weight, l, idx, baseDsLessons);
    const scaledPct = getScaledLessonWeightPercent(l.weight, l, idx, baseDsLessons);
    return `  [*${isMission || isPureFr ? l.lessonFr : l.lessonAr}*], [${(isMission || isPureFr ? l.capacitiesFr : l.capacitiesAr).join(" ؛ ")}], [${scaledPct}%], [*${formatQuarterPoints(scaledPts)} / 20*],`;
  })
  .join("\n")}${
  hasSynthesisProblemGlobal
    ? `\n  [*${isMission || isPureFr ? "Problème de Synthèse (Type Bac)" : "المسألة التوليفية الشاملة (نموذج الإطار المرجعي)"}*], [${isMission || isPureFr ? "Modélisation et résolution de problème" : "التوليف بين التحليل والهندسة وحل المسائل"}], [42.5%], [*8.5 / 20*],`
    : ""
}
)

${
  isMission
    ? `*Pondération formative : Compétences de base & Modélisation approfondie*\n- *Niveau N1 (Application directe) :* ${n1}% (${((n1 * 20) / 100).toFixed(1)} pts) | *Niveau N2 (Mobilisation & Raisonnement) :* ${n2}% (${((n2 * 20) / 100).toFixed(1)} pts) | *Niveau N3 (Approfondissement) :* ${n3}% (${((n3 * 20) / 100).toFixed(1)} pts)`
    : `*توزيع المستويات المهارية (Niveaux taxonomiques - مذكرة 142-08):*\n- *المستوى الأول N1 (تطبيق مباشر):* ${n1}% (${((n1 * 20) / 100).toFixed(1)} نقط) | *المستوى الثاني N2 (تعبئة وتوليف):* ${n2}% (${((n2 * 20) / 100).toFixed(1)} نقط) | *المستوى الثالث N3 (تعمق وبحث):* ${n3}% (${((n3 * 20) / 100).toFixed(1)} نقط)`
}
${spec2DMatrix ? `\n${generate2DSpecMatrixTypst(spec2DMatrix, isMission || isPureFr)}\n` : ""}
${modelsToRender.map((m) => renderTypstDSModel(m)).join("\n\n#pagebreak()\n\n")}
${
  includeDetailedSolutions
    ? `\n// [SYNC_SECTION:SOLUTIONS]\n#pagebreak()\n== ${
        isMission
          ? "Annexe : Corrigé Détaillé et Barème Officiel (AEFE / Baccalauréat)"
          : isPureFr
          ? "Annexe : Corrigé Détaillé et Barème Officiel de Notation"
          : "الملحق الرسمي: عناصر الإجابة النموذجية وسلم التنقيط المفصل"
      } (${examModel})\n#text(size: 8.5pt, style: "italic")[${
        isMission || isPureFr
          ? "Directives officielles : valorisation de toute démarche mathématique cohérente et barème fractionné par étape."
          : "توجيهات ديداكتيكية رسمية: قبول أي طريقة رياضية سليمة، وعدم تكرار الخصم على الأخطاء الحسابية، و0.5 ن لنظافة الورقة."
      }]\n\n` +
      modelsToRender
        .map((m) => {
          const orderedLessons =
            shuffleExercises && m === "B"
              ? [...baseDsLessons].reverse()
              : baseDsLessons;
          const qcmBlock = hasQCMGlobal
            ? generateMoroccanQCMExercise(orderedLessons, m, track.cycle, {
                ...qcmConfig,
                isMission,
              })
            : null;
          const synthProb = hasSynthesisProblemGlobal
            ? generateMoroccanSynthesisProblem(orderedLessons, m, track.cycle, isMission)
            : null;
          const exOffset = hasQCMGlobal ? 1 : 0;

          const qcmSolTypst = qcmBlock
            ? `==== ${isMission || isPureFr ? qcmBlock.titleFr : qcmBlock.titleAr} (${qcmBlock.totalPoints} pts)\n` +
              qcmBlock.items
                .map(
                  (item, qIdx) =>
                    `+ *Q${qIdx + 1}* [${item.points} pt] : *${isMission || isPureFr ? item.correctAnswerFr : item.correctAnswerAr}* — ${isMission || isPureFr ? item.justificationFr : item.justificationAr}`
                )
                .join("\n") +
              `\n\n#v(0.3cm)\n`
            : "";

          const synthSolTypst = synthProb
            ? `\n\n#v(0.3cm)\n==== ${isMission || isPureFr ? synthProb.titleFr : synthProb.titleAr} (${synthProb.totalPoints} pts)\n` +
              synthProb.parts
                .map(
                  (part) =>
                    `*${isMission || isPureFr ? part.partTitleFr : part.partTitleAr}*\n` +
                    (isMission || isPureFr ? part.correctionFr : part.correctionAr)
                      .map((sol: string) => `+ ${sol}`)
                      .join("\n")
                )
                .join("\n\n")
            : "";

          return (
            `=== ${
              isMission || isPureFr
                ? `Corrigé du Sujet (${m})`
                : `عناصر إجابة النموذج (${modelArabicLabel(m)})`
            }\n` +
            qcmSolTypst +
            orderedLessons
              .map((l, idx) => {
                const rawVariantQs = getVariantQuestions(
                  l,
                  m,
                  shuffleQuestions,
                  0,
                  dsQuestionDensity
                );
                const questionsAr = sanitizeAndValidateQuestionsList(
                  rawVariantQs.questionsAr
                ).sanitizedQuestions;
                const questionsFr = sanitizeAndValidateQuestionsList(
                  rawVariantQs.questionsFr
                ).sanitizedQuestions;
                const scaledWeightPct = getScaledLessonWeightPercent(
                  l.weight,
                  l,
                  idx,
                  orderedLessons
                );
                const scaledPts = getScaledLessonPoints(
                  l.weight,
                  l,
                  idx,
                  orderedLessons
                );
                const corr = generateExerciseCorrection(
                  { ...l, weight: scaledWeightPct },
                  idx,
                  m,
                  questionsAr,
                  questionsFr
                );
                const displayExNum = idx + 1 + exOffset;
                return (
                  `==== ${
                    isMission || isPureFr
                      ? `Exercice ${displayExNum} : ${l.lessonFr}`
                      : `التمرين ${displayExNum} : ${l.lessonAr}`
                  } (${formatQuarterPoints(scaledPts)} pts)\n` +
                  corr.solutions
                    .map(
                      (s) =>
                        `+ *${
                          isMission || isPureFr
                            ? `Question ${s.questionNumber}`
                            : `السؤال ${s.questionNumber}`
                        }* [${s.bareme}]\n  ${
                          isMission || isPureFr
                            ? s.solutionTextFr
                            : s.solutionTextAr
                        }`
                    )
                    .join("\n\n")
                );
              })
              .join("\n\n#v(0.3cm)\n") +
            synthSolTypst
          );
        })
        .join("\n\n#pagebreak()\n\n")
    : ""
}
`
    : activeModule === "DM_SERIE"
    ? `${
        isDM
          ? modelsToRender.map((m) => renderTypstDMSerie(m)).join("\n\n#pagebreak()\n\n")
          : renderTypstDMSerie("A")
      }`
    : activeModule === "FICHE_OP2007"
    ? (() => {
        const fiche = generateFullMoroccanPedagogicalFiche(ficheLesson, track);
        return `// [SYNC_SECTION:HEADER]
${renderTypstHeader()}
#v(0.3cm)
// [SYNC_SECTION:SPEC_TABLE]
== ${isMission ? "Fiche de Séquence Pédagogique (BOEN / AEFE) :" : "الجذاذة التربوية والسيناريو الديداكتيكي الكامل :"} ${isMission || isPureFr ? fiche.lessonTitleFr : fiche.lessonTitleAr}
- *${isMission || isPureFr ? "Enveloppe horaire :" : "الغلاف الزمني الرسمي:"}* ${fiche.hoursGlobal} (${fiche.sessionsDistribution.activitiesHours} ${isMission || isPureFr ? "Activités" : "أنشطة"} | ${fiche.sessionsDistribution.courseHours} ${isMission || isPureFr ? "Cours" : "بناء الدرس"} | ${fiche.sessionsDistribution.exercisesHours} ${isMission || isPureFr ? "Exercices" : "تمارين"} | ${fiche.sessionsDistribution.ticeHours} TICE)
- *${isMission ? "Attendus de fin d'année (BOEN) :" : "القدرات المنتظرة (التوجيهات التربوية 2007):"}*
${(isMission || isPureFr ? fiche.expectedCapacitiesFr : fiche.expectedCapacitiesAr).map((c) => `  - ${c}`).join("\n")}

// [SYNC_SECTION:EXERCISES]
=== 1. ${isMission || isPureFr ? fiche.introductoryActivity.titleFr : fiche.introductoryActivity.titleAr}
${isMission || isPureFr ? fiche.introductoryActivity.problemContextFr : fiche.introductoryActivity.problemContextAr}
${(isMission || isPureFr ? fiche.introductoryActivity.questionsFr : fiche.introductoryActivity.questionsAr).map((q) => `+ ${q}`).join("\n")}

=== 2. ${isMission || isPureFr ? "Contenu Intégral du Cours & Théorèmes" : "المتن النظري للدرس، المبرهنات، والأمثلة المحلولة"}
${fiche.fullCourseContent
  .map(
    (sec) =>
      `==== ${sec.sectionNum}. ${isMission || isPureFr ? sec.titleFr : sec.titleAr}\n` +
      sec.definitions
        .map(
          (d) =>
            `- *${isMission || isPureFr ? d.termFr : d.termAr} :* ${isMission || isPureFr ? d.contentFr : d.contentAr}`
        )
        .join("\n") +
      "\n" +
      sec.theorems
        .map(
          (t) =>
            `- *${isMission || isPureFr ? t.nameFr : t.nameAr} :* ${isMission || isPureFr ? t.statementFr : t.statementAr}`
        )
        .join("\n")
  )
  .join("\n\n")}

=== 3. ${isMission || isPureFr ? "Grille d'Ingénierie Didactique (5 phases)" : "الجدول الديداكتيكي لتدبير المحطات الخمس للدرس"}
#table(
  columns: (1.5fr, 3fr, 3fr, 1.5fr),
  inset: 6pt,
  [*${isMission || isPureFr ? "Phase / Durée" : "المرحلة والمدة"}*], [*${isMission || isPureFr ? "Rôle de l'enseignant" : "مهام الأستاذ"}*], [*${isMission || isPureFr ? "Rôle de l'élève" : "مهام المتعلم"}*], [*${isMission || isPureFr ? "Modalités" : "صيغ العمل"}*],
${fiche.didacticSteps
  .map(
    (st) =>
      `  [${isMission || isPureFr ? st.phaseFr : st.phaseAr} (${st.durationMinutes} min)], [${isMission || isPureFr ? st.teacherRoleFr : st.teacherRoleAr}], [${isMission || isPureFr ? st.studentRoleFr : st.studentRoleAr}], [${isMission || isPureFr ? st.modalitiesFr : st.modalitiesAr}],`
  )
  .join("\n")}
)
${
  includeTICE
    ? `\n=== 4. ${isMission || isPureFr ? fiche.ticeIntegration.pythonScript.titleFr : fiche.ticeIntegration.pythonScript.titleAr}\n\`\`\`python\n${fiche.ticeIntegration.pythonScript.code}\n\`\`\``
    : ""
}
// [SYNC_SECTION:SOLUTIONS]
=== 5. ${isMission || isPureFr ? fiche.formativeEvaluation.titleFr : fiche.formativeEvaluation.titleAr}
*${isMission || isPureFr ? fiche.formativeEvaluation.testExerciseFr.statement : fiche.formativeEvaluation.testExerciseAr.statement}*
${(isMission || isPureFr ? fiche.formativeEvaluation.testExerciseFr.questions : fiche.formativeEvaluation.testExerciseAr.questions).map((q) => `+ ${q}`).join("\n")}`;
      })()
    : activeModule === "DIAGNOSTIC"
    ? (() => {
        const diagModel = examModel === "B" ? "B" : "A";
        const diag = generateMoroccanDiagnosticPaper(track.code, diagDuration, diagModel);
        return `// [SYNC_SECTION:HEADER]
${renderTypstHeader(diagModel)}
#v(0.3cm)
// [SYNC_SECTION:SPEC_TABLE]
== ${isMission || isPureFr ? diag.titleFr : diag.titleAr} (${diag.duration} — Seuil: ${diag.masteryThresholdPercent}%)
// [SYNC_SECTION:EXERCISES]
=== Partie I : QCM (4.0 pts)
${diag.qcmItems
  .map(
    (item, idx) =>
      `+ *Q${idx + 1}.* ${isMission || isPureFr ? item.questionFr : item.questionAr} *[${item.points} pt]*\n  ${(isMission || isPureFr ? item.optionsFr : item.optionsAr).map((o) => `(${o.code}) ${o.text}`).join("   |   ")}`
  )
  .join("\n")}

${diag.directExercises
  .map(
    (ex) =>
      `=== ${isMission || isPureFr ? ex.titleFr : ex.titleAr} (${ex.totalPoints} pts)\n` +
      (isMission || isPureFr ? ex.questionsFr : ex.questionsAr)
        .map((q) => `+ *${q.label}* ${q.text} #h(1fr) *[${q.points}]*`)
        .join("\n")
  )
  .join("\n\n")}

// [SYNC_SECTION:SYNTHESIS_PROBLEM]
=== ${isMission || isPureFr ? diag.synthesisProblem.titleFr : diag.synthesisProblem.titleAr} (${diag.synthesisProblem.totalPoints} pts)
_${isMission || isPureFr ? diag.synthesisProblem.contextFr : diag.synthesisProblem.contextAr}_
${(isMission || isPureFr ? diag.synthesisProblem.partsFr : diag.synthesisProblem.partsAr)
  .map(
    (p) =>
      `==== ${p.partTitle} (${p.points} pts)\n` +
      p.questions.map((q) => `+ ${q}`).join("\n")
  )
  .join("\n\n")}

// [SYNC_SECTION:SOLUTIONS]
#pagebreak()
== ${isMission || isPureFr ? "Grille de Correction Détaillée, Analyse Didactique des Erreurs & Plan de Remédiation" : "عناصر الإجابة وشبكة التحليل الديداكتيكي للتعثرات وخطة الدعم الاستدراكي"}
#table(
  columns: (1.2fr, 3fr, 3fr, 2.8fr),
  inset: 6pt,
  [*Question*], [*${isMission || isPureFr ? "Réponse & Justification" : "الجواب والتعليل"}*], [*${isMission || isPureFr ? "Erreur type & Origine" : "الخطأ الشائع والسبب"}*], [*${isMission || isPureFr ? "Plan de Remédiation" : "خطة الدعم"}*],
${diag.qcmItems
  .map(
    (item) =>
      `  [*${item.id.toUpperCase()}* (${item.correctCode})], [${isMission || isPureFr ? item.justificationFr : item.justificationAr}], [${isMission || isPureFr ? item.commonErrorFr : item.commonErrorAr}], [${isMission || isPureFr ? item.remediationPlanFr : item.remediationPlanAr}],`
  )
  .join("\n")}
)`;
      })()
    : `// [SYNC_SECTION:HEADER]
${renderTypstHeader()}
#v(0.3cm)
// [SYNC_SECTION:SPEC_TABLE]
== ${isMission ? "Progression Annuelle & Calendrier Scolaire AEFE" : "التوزيع السنوي للمقرر الدراسي والأطر المرجعية"} (${isMission || isPureFr ? track.labelFr : track.labelAr})
// [SYNC_SECTION:EXERCISES]
#table(
  columns: (1.2fr, 3.5fr, 1.3fr, 4fr),
  inset: 6pt,
  [${isMission ? "*Période*" : "*الدورة*"}], [${isMission ? "*Thème / Chapitre*" : "*عنوان الدرس / الوحدة*"}], [${isMission ? "*Horaire*" : "*الغلاف الزمني*"}], [${isMission ? "*Attendus majeurs*" : "*القدرات الأساسية المستهدفة*"}],
${allLessons
  .map(
    (l, i) =>
      `  [${isMission ? `Période ${Math.min(5, Math.floor((i / allLessons.length) * 5) + 1)}` : i < Math.ceil(allLessons.length / 2) ? "S1" : "S2"}], [*${isMission || isPureFr ? l.lessonFr : l.lessonAr}*], [${l.hours}], [${(isMission || isPureFr ? l.capacitiesFr : l.capacitiesAr)[0]}],`
  )
  .join("\n")}
)
`}${
      attachedPythonAlgorithms.length > 0
        ? `\n\n// [SYNC_SECTION:PYTHON_TICE]\n#v(0.4cm)\n== ${
            isMission || isPureFr
              ? "Annexe Algorithmique & Programmation Python (TICE)"
              : "ملحق البرمجة والخوارزميات الرياضية بلغة Python (إدماج TICE)"
          }\n` +
          attachedPythonAlgorithms
            .map(
              (algo, aIdx) =>
                `=== ${aIdx + 1}. ${
                  isMission || isPureFr ? algo.titleFr : algo.titleAr
                } (${isMission || isPureFr ? algo.levelBadgeFr : algo.levelBadgeAr})\n_${
                  isMission || isPureFr ? algo.objectiveFr : algo.objectiveAr
                }_\n\`\`\`python\n${algo.pythonCode}\n\`\`\`\n` +
                (isMission || isPureFr
                  ? algo.pedagogicalQuestionsFr
                  : algo.pedagogicalQuestionsAr
                )
                  .map((q: string) => `+ ${q}`)
                  .join("\n") +
                (includeDetailedSolutions
                  ? `\n\n*${
                      isMission || isPureFr
                        ? "Sortie console attendue & Interprétation :"
                        : "المخرج العددي المتوقع في الكونسول والتأويل الرياضي:"
                    }* ${
                      isMission || isPureFr
                        ? algo.expectedOutputFr
                        : algo.expectedOutputAr
                    }`
                  : "")
            )
            .join("\n\n#v(0.25cm)\n")
        : ""
    }${
      params.includeInteractiveQrFooter !== false && params.interactiveExamUrl
        ? `\n\n#v(0.4cm)\n#rect(width: 100%, stroke: 0.8pt + rgb("#0f172a"), radius: 6pt, inset: 8pt, fill: rgb("#f8fafc"))[\n  *${
            isMission || isPureFr
              ? "Version Interactive en Ligne du Devoir & Auto-Correction (QR Code) :"
              : "النسخة التفاعلية الرقمية للفرض والتصحيح الآلي الفوري (رمز QR):"
          }*\n  #linebreak()\n  #text(size: 8.5pt)[${params.interactiveExamUrl.replace(/#/g, "\\#")}]\n]`
        : ""
    }`;
  }

  // ================= ب. توليد كود LATEX / XELATEX (.tex) =================
  const selectedLatexPkg =
    LATEX_PACKAGE_OPTIONS.find((p) => p.id === latexPackageTheme) ||
    LATEX_PACKAGE_OPTIONS[0];

  const activeLatexPkgSnippet =
    latexPackageTheme === "TCOLORBOX"
      ? buildCustomTcolorboxLatexPreamble(tcolorboxConfig)
      : selectedLatexPkg.latexPreambleSnippet;

  const titleCalligraphyCfg = params.appliedTitleCalligraphy;
  const xeLatexLetterSpace = Number(
    ((titleCalligraphyCfg?.customLetterSpacingEm ?? 0.025) * 100).toFixed(1)
  );
  const xeLatexFontFamilyName =
    titleCalligraphyCfg?.fontId === "KUFI_GEOMETRIC"
      ? "Reem Kufi"
      : titleCalligraphyCfg?.fontId === "DIWANI_JALI"
      ? "Rakkas"
      : titleCalligraphyCfg?.fontId === "DIWANI_SULTANI" ||
        titleCalligraphyCfg?.fontId === "RUQAA_INK"
      ? "Aref Ruqaa"
      : "Amiri";

  const preamble = isPureFr
    ? `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[french]{babel}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{geometry,array,multirow,booktabs,fancyhdr,xcolor}
\\geometry{top=${resolvedTopCm}cm, bottom=${resolvedBottomCm}cm, left=${resolvedXCm}cm, right=${resolvedXCm}cm}
${activeLatexPkgSnippet}`
    : `% ============================================================================
% ملاحظة هامة: يُترجم هذا الملف باستخدام محرك XeLaTeX لدعم العربية والفرنسية معاً
% الحزمة التنسيقية المختارة: ${selectedLatexPkg.packageCmd}
% قالب خط الترويسة المغربية: ${titleCalligraphyCfg?.fontId || "ANDALUSI_MAGHRIBI_SCRIPT"} (LetterSpace=${xeLatexLetterSpace})
% ============================================================================
\\documentclass[11pt,a4paper]{article}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{geometry,array,multirow,booktabs,fancyhdr,xcolor}
\\usepackage{fontspec}
\\usepackage{polyglossia}
\\geometry{top=${resolvedTopCm}cm, bottom=${resolvedBottomCm}cm, left=${resolvedXCm}cm, right=${resolvedXCm}cm}
${activeLatexPkgSnippet}
${
  docLang === "AR"
    ? `\\setmainlanguage{arabic}\n\\setotherlanguage{french}\n\\newfontfamily\\arabicfont[Script=Arabic]{Amiri}\n\\newfontfamily\\maghribititlefont[Script=Arabic,LetterSpace=${xeLatexLetterSpace}]{${xeLatexFontFamilyName}}`
    : `\\setmainlanguage{french}\n\\setotherlanguage{arabic}\n\\newfontfamily\\arabicfont[Script=Arabic]{Amiri}\n\\newfontfamily\\maghribititlefont[Script=Arabic,LetterSpace=${xeLatexLetterSpace}]{${xeLatexFontFamilyName}}`
}`;

  const renderLatexCartouche = (modelLabel?: "A" | "B") => {
    const sujTitle = modelLabel ? ` — \\textbf{Sujet ${modelLabel}}` : "";
    const defaultLatexDocTitle =
      activeModule === "DS_142_08"
        ? dsStructureMode === "EXAMEN_BLANC_2BAC"
          ? `Examen Blanc du Baccalauréat (${track.code})${sujTitle}`
          : isMission
          ? `Devoir Surveillé N° ${dsKey.replace("DS", "")} (${sem})${sujTitle}`
          : `Devoir Surveillé ${dsKey} (${sem})${sujTitle}`
        : activeModule === "DM_SERIE"
        ? isDM
          ? `Devoir Maison (DM ${dmNumber} — ${sem})${sujTitle}`
          : `Série d'Exercices \\& Travaux Dirigés (${dmNumber} — ${sem})`
        : activeModule === "FICHE_OP2007"
        ? isMission
          ? "Fiche de Séquence Pédagogique (BOEN / AEFE)"
          : "Fiche Pédagogique Officielle (OP 2007)"
        : activeModule === "DIAGNOSTIC"
        ? `Test Diagnostique (${diagDuration})`
        : "Répartition Annuelle du Programme";

    const rawLatexDocTitle = customDocTitle.trim()
      ? `${customDocTitle.trim()}${sujTitle}`
      : defaultLatexDocTitle;
    const isOrnamentActive =
      (titleCalligraphyCfg?.enableMoroccanHeaderOrnament ?? true) &&
      titleCalligraphyCfg?.ornament !== "NONE";
    const latexDocTitle =
      !isPureFr && isOrnamentActive
        ? `{\\maghribititlefont ❁ ﴾ ${rawLatexDocTitle} ﴿ ❁}`
        : rawLatexDocTitle;

    const defaultLatexSubMeta =
      activeModule === "DM_SERIE"
        ? isDM
          ? `\\textbf{Date de remise : ${dmDueDate}}`
          : `\\textbf{Exercices gradués (Niveaux 1, 2 et 3)}`
        : `\\textbf{Durée : ${track.durationFr}}`;

    const latexSubMeta = customDocSubtitle.trim()
      ? `\\textbf{${customDocSubtitle.trim()}}`
      : defaultLatexSubMeta;

    return `\\noindent
\\renewcommand{\\arraystretch}{1.25}
\\begin{tabular}{|p{5.4cm}|p{6.4cm}|p{5.2cm}|}
\\hline
${
  isMission
    ? `\\textbf{AEFE / OSUI — Mission Française} \\\\ \\textbf{${school}} \\\\ ${params.calculatorAllowed !== false ? "{\\footnotesize \\textit{Calculatrice mode examen autorisée}}" : "{\\footnotesize \\textit{Calculatrice interdite}}"} \\\\ Année : ${year}`
    : headerStyle === "OFFICIAL_AREF"
    ? `\\textbf{Royaume du Maroc} \\\\ Ministère de l'Éducation Nationale \\\\ \\textit{${academy}} \\\\ \\textit{${direction}} \\\\ \\textbf{${school}}`
    : `\\textbf{${school}} \\\\ Année Scolaire : ${year}`
} &
\\centering \\textbf{\\large ${latexDocTitle}} \\\\ \\vspace{0.1cm} ${latexSubMeta}${
      customHeaderNote.trim() ? ` \\\\ {\\footnotesize \\textit{${customHeaderNote.trim()}}}` : ""
    } \\\\ Année : ${year} &
\\raggedleft ${
      includeTeacherLogo
        ? `\\fbox{\\footnotesize $\\sqrt{\\mathbf{MATHEMATICS}}$ \\textbf{Prof Kouziber}} \\\\ `
        : ""
    }\\textbf{Matière : Mathématiques} \\\\ \\textbf{${prof}} \\\\ ${track.labelFr} \\tabularnewline
\\hline
${
  isMission && params.includeCompetencies !== false
    ? `\\multicolumn{3}{|l|}{\\textbf{Compétences évaluées (BOEN) :} [ ] Chercher \\quad [ ] Modéliser \\quad [ ] Représenter \\quad [ ] Raisonner \\quad [ ] Calculer \\quad [ ] Communiquer} \\\\ \\hline`
    : ""
}
${
  (activeModule === "DS_142_08" || (activeModule === "DM_SERIE" && isDM)) &&
  (includeStudentBox || includeGradeBox)
    ? `\\multicolumn{2}{|l|}{${
        includeStudentBox
          ? "\\textbf{Nom \\& Prénom :} \\dotfill \\textbf{Classe :} \\dots\\dots \\textbf{N$^\\circ$ :} \\dots"
          : ""
      }} & ${
        includeGradeBox
          ? "\\textbf{Note :} \\dots\\dots / 20 \\\\ \\textbf{Obs. :} \\dotfill"
          : ""
      } \\tabularnewline \\hline`
    : ""
}
\\end{tabular}
\\vspace{0.35cm}`;
  };

  const renderLatexDSModel = (m: "A" | "B") => {
    const orderedLessons =
      shuffleExercises && m === "B"
        ? [...baseDsLessons].reverse()
        : baseDsLessons;

    const hasQCM = hasQCMGlobal;
    const hasSynthesisProblem = hasSynthesisProblemGlobal;
    const qcmBlock = hasQCM
      ? generateMoroccanQCMExercise(orderedLessons, m, track.cycle, {
          ...qcmConfig,
          isMission,
        })
      : null;
    const synthesisProblem = hasSynthesisProblem
      ? generateMoroccanSynthesisProblem(orderedLessons, m, track.cycle, isMission)
      : null;
    const exOffset = hasQCM ? 1 : 0;

    const gradingStripItemsLatex: string[] = [];
    if (qcmBlock) {
      gradingStripItemsLatex.push(
        `\\textbf{Ex 1 (QCM) :} \\dots/${qcmBlock.totalPoints}`
      );
    }
    orderedLessons.forEach((l, idx) => {
      const pts = getScaledLessonPoints(l.weight, l, idx, orderedLessons);
      gradingStripItemsLatex.push(
        `\\textbf{Ex ${idx + 1 + exOffset} :} \\dots/${formatQuarterPoints(pts)}`
      );
    });
    if (synthesisProblem) {
      gradingStripItemsLatex.push(
        `\\textbf{${isMission || isPureFr ? "Problème" : "المسألة"} :} \\dots/${synthesisProblem.totalPoints}`
      );
    }
    gradingStripItemsLatex.push(`\\textbf{Total :} \\dots/20`);
    const gradingStripLatex =
      params.includeGradingScaleTable !== false
        ? `\n\\noindent\\fbox{\\parbox{0.98\\textwidth}{\\footnotesize \\textbf{${
            isMission || isPureFr
              ? "Barème \\& Relevé par exercice :"
              : "سلم التنقيط وتوزيع نقط التمارين :"
          }} \\quad ${gradingStripItemsLatex.join(" \\quad | \\quad ")}}}\n\\vspace{0.2cm}\n`
        : "";

    const qcmHeader = qcmBlock
      ? `${isMission || isPureFr ? qcmBlock.titleFr : qcmBlock.titleAr} (${qcmBlock.totalPoints} pts)`
      : "";
    const qcmInner = qcmBlock
      ? `\\noindent\\textit{${
          isMission || isPureFr ? qcmBlock.instructionFr : qcmBlock.instructionAr
        }}\n\\begin{enumerate}\n` +
        qcmBlock.items
          .map(
            (item) =>
              `  \\item \\textbf{${isMission || isPureFr ? item.statementFr : item.statementAr}} \\hfill \\textbf{[${item.points} pt]}\n  \\newline ${(isMission || isPureFr ? item.optionsFr : item.optionsAr).join(" \\quad | \\quad ")}`
          )
          .join("\n") +
        `\n\\end{enumerate}`
      : "";

    const qcmLatex = qcmBlock
      ? latexPackageTheme === "TCOLORBOX"
        ? `\n\\begin{exoBox}{${qcmHeader}}\n${qcmInner}\n\\end{exoBox}\n\\vspace{0.2cm}\n`
        : `\n\\subsection*{${qcmHeader}}\n${qcmInner}\n\\vspace{0.2cm}\n`
      : "";

    const synthBody = synthesisProblem
      ? synthesisProblem.parts
          .map(
            (p, pIdx) =>
              `\\subsubsection*{${isMission || isPureFr ? p.partTitleFr : p.partTitleAr}}\n\\begin{enumerate}\n` +
              (isMission || isPureFr ? p.questionsFr : p.questionsAr)
                .map((q) => {
                  const wsSpec = analyzeFullAnswerWorkspaceRequirement({
                    questionText: q,
                    difficultyLevel: pIdx === 0 ? "N2" : "N3",
                    points: 1.5,
                  });
                  const wsLatex = includeAnswerWorkspace
                    ? `\n  \\par\\vspace{0.12cm}\\noindent\\fcolorbox{gray!45}{white}{\\parbox{0.95\\linewidth}{\\vspace{0.1cm}{\\tiny\\color{gray} [${gridStyleBadge} $\\cdot$ ${
                        isMission || isPureFr ? wsSpec.taskBadgeFr : wsSpec.taskBadgeAr
                      } $\\cdot$ ${wsSpec.recommendedLines} ${
                        isMission || isPureFr ? "lignes" : "أسطر"
                      }]}\\vspace{${wsSpec.heightCmLatex}}}}\\vspace{0.12cm}`
                    : "";
                  return `  \\item ${q}${wsLatex}`;
                })
                .join("\n") +
              `\n\\end{enumerate}`
          )
          .join("\n\\vspace{0.15cm}\n")
      : "";

    const synthLatex = synthesisProblem
      ? latexPackageTheme === "TCOLORBOX" && tcolorboxConfig.applyToComplexProblems
        ? `\n\n% [SYNC_SECTION:SYNTHESIS_PROBLEM]\n\\vspace{0.25cm}\n\\begin{problemeComplexeBox}{${isMission || isPureFr ? synthesisProblem.titleFr : synthesisProblem.titleAr} (${synthesisProblem.totalPoints} pts)}\n${synthBody}\n\\end{problemeComplexeBox}`
        : `\n\n% [SYNC_SECTION:SYNTHESIS_PROBLEM]\n\\vspace{0.25cm}\n\\subsection*{${isMission || isPureFr ? synthesisProblem.titleFr : synthesisProblem.titleAr} (${synthesisProblem.totalPoints} pts)}\n${synthBody}`
      : "";

    return `% [SYNC_SECTION:HEADER]
${renderLatexCartouche(m)}
${gradingStripLatex}
% [SYNC_SECTION:EXERCISES]
\\section*{${
      isAr
        ? `نص الفرض المحروس (${dsKey} - ${sem}) — النموذج (${modelArabicLabel(m)})`
        : `Énoncé du Devoir Surveillé (${dsKey} - ${sem}) — Modèle ${m} ${
            docLang === "BILINGUAL" ? `(Bilingue : ${bilingualLayout})` : ""
          }`
    }}
${qcmLatex}
${orderedLessons
  .map((l, idx) => {
    const rawVariantQs = getVariantQuestions(
      l,
      m,
      shuffleQuestions,
      0,
      dsQuestionDensity
    );
    const questionsAr = sanitizeAndValidateQuestionsList(
      rawVariantQs.questionsAr
    ).sanitizedQuestions;
    const questionsFr = sanitizeAndValidateQuestionsList(
      rawVariantQs.questionsFr
    ).sanitizedQuestions;
    const activeQs = isMission || isPureFr ? questionsFr : questionsAr;
    const scaledPts = getScaledLessonPoints(l.weight, l, idx, orderedLessons);
    const scaledWeightPct = getScaledLessonWeightPercent(
      l.weight,
      l,
      idx,
      orderedLessons
    );
    const qMetas = getQuestionBaremesAndLevels(
      scaledWeightPct,
      activeQs.length,
      n1,
      n2,
      n3,
      l.customQuestionBaremes,
      l.customQuestionLevels
    );
    const ggbRes = getAutoGeoGebraResourceForLesson(
      l,
      geoGebraResourcesMap,
      autoAttachGeoGebra
    );
    const ggbLatex = ggbRes
      ? `\n\\noindent\\fbox{\\parbox{0.97\\textwidth}{\\footnotesize \\textbf{Support GeoGebra :} ${
          isMission || isPureFr ? ggbRes.titleFr : ggbRes.titleAr
        } ${
          ggbRes.fileName
            ? `(\\texttt{${ggbRes.fileName}})`
            : ggbRes.interactiveUrl
            ? `--- \\texttt{${ggbRes.interactiveUrl}}`
            : ""
        }}}`
      : "";

    const displayExNum = idx + 1 + exOffset;
    const customExTitle = customExerciseTitles[idx]?.trim();
    const ptsStr = formatQuarterPoints(scaledPts);
    const resolvedIcon = resolveLessonHeaderIcon(l);
    const iconLatex = resolvedIcon?.latexPrefix ? `${resolvedIcon.latexPrefix} ` : "";
    const exHeader = customExTitle
      ? `${iconLatex}${customExTitle} (${ptsStr} points — ${scaledWeightPct}\\%)`
      : isMission || isPureFr
      ? `${iconLatex}Exercice ${displayExNum} : ${l.lessonFr} (${ptsStr} points — ${scaledWeightPct}\\%)`
      : `${iconLatex}التمرين ${displayExNum} : ${l.lessonAr} (${ptsStr} نقط — ${scaledWeightPct}\\%)`;

    const enumItems = `\\begin{enumerate}
${activeQs
  .map((q, qIdx) => {
    const meta = qMetas[qIdx];
    const baremeLatex =
      showQuestionBareme && meta
        ? ` \\hfill \\textbf{[${meta.points} pt $\\cdot$ ${meta.level}]}`
        : "";
    const wsSpec = analyzeFullAnswerWorkspaceRequirement({
      questionText: q,
      difficultyLevel: meta?.level || "N1",
      points: meta?.points,
    });
    const workspaceLatex = includeAnswerWorkspace
      ? `\n  \\par\\vspace{0.12cm}\\noindent\\fcolorbox{gray!45}{white}{\\parbox{0.95\\linewidth}{\\vspace{0.1cm}{\\tiny\\color{gray} [${gridStyleBadge} $\\cdot$ ${
          isMission || isPureFr ? wsSpec.taskBadgeFr : wsSpec.taskBadgeAr
        } $\\cdot$ ${wsSpec.recommendedLines} ${
          isMission || isPureFr ? "lignes" : "أسطر"
        } $\\cdot$ ${meta?.level || "N1"}]}\\vspace{${wsSpec.heightCmLatex}}}}\\vspace{0.12cm}`
      : "";
    return `  \\item ${
      fillBlanks && idx === 0 && qIdx === 0
        ? `\\textit{(${isMission || isPureFr ? "Preuve guidée à trous" : "برهان موجه بملء الفراغات"})} ${q}`
        : q
    }${baremeLatex}${workspaceLatex}`;
  })
  .join("\n")}
\\end{enumerate}${ggbLatex}`;

    if (latexPackageTheme === "TCOLORBOX") {
      return `\\begin{exoBox}{${exHeader}}
${enumItems}
\\end{exoBox}`;
    }

    return `\\subsection*{${exHeader}}
${enumItems}`;
  })
  .join("\n\n\\vspace{0.25cm}\n")}${synthLatex}`;
  };

  const renderLatexDMSerieModel = (m: "A" | "B") => {
    const bodyLatex = !isDM
      ? generateCustomCountSerieExercises(
          baseDsLessons,
          serieExerciseCount,
          m
        )
          .map((b, exIdx) => {
            const associatedLesson =
              baseDsLessons[exIdx % Math.max(1, baseDsLessons.length)];
            const resolvedIcon = resolveLessonHeaderIcon(associatedLesson);
            const iconLatex = resolvedIcon?.latexPrefix ? `${resolvedIcon.latexPrefix} ` : "";
            const customTitle = customExerciseTitles[exIdx]?.trim();
            const header = `${iconLatex}${
              customTitle ||
              (isMission || isPureFr ? b.badgeFr : b.badgeAr)
            } (${b.stars})`;
            const qs = isMission || isPureFr ? b.questionsFr : b.questionsAr;
            const hint = isMission || isPureFr ? b.hintFr : b.hintAr;
            const inner = `\\begin{enumerate}
${qs.map((q) => `  \\item ${q}`).join("\n")}
\\end{enumerate}${
              includeHints && hint
                ? `\n\\noindent\\textit{\\small ${hint}}\n`
                : ""
            }`;
            if (latexPackageTheme === "TCOLORBOX") {
              return `\\begin{exoBox}{${header}}\n${inner}\n\\end{exoBox}`;
            }
            return `\\subsection*{${header}}\n${inner}`;
          })
          .join("\n\n\\vspace{0.25cm}\n")
      : baseDsLessons
          .map((l, idx) => {
            const blocks = getSerieAndDMExercises(l, dmSubType, m);
            const pts = ((l.weight * 20) / 100).toFixed(1);
            const resolvedIcon = resolveLessonHeaderIcon(l);
            const iconLatex = resolvedIcon?.latexPrefix ? `${resolvedIcon.latexPrefix} ` : "";
            const customTitle = customExerciseTitles[idx]?.trim();
            const probHeader = customTitle
              ? `${iconLatex}${customTitle} (${pts} points — ${l.weight}\\%)`
              : isMission || isPureFr
              ? `${iconLatex}Problème ${idx + 1} : ${l.lessonFr} (${pts} points — ${l.weight}\\%)`
              : `${iconLatex}التمرين التوليفي ${idx + 1} : ${l.lessonAr} (${pts} نقط — ${l.weight}\\%)`;
            const probInner = blocks
              .map(
                (b) => `\\subsubsection*{${isMission || isPureFr ? b.badgeFr : b.badgeAr}}
\\begin{enumerate}
${(isMission || isPureFr ? b.questionsFr : b.questionsAr).map((q) => `  \\item ${q}`).join("\n")}
\\end{enumerate}${
                  includeHints
                    ? `\n\\noindent\\textit{\\small ${isMission || isPureFr ? b.hintFr : b.hintAr}}\n`
                    : ""
                }`
              )
              .join("\n\\vspace{0.15cm}\n");

            if (latexPackageTheme === "TCOLORBOX") {
              return `\\begin{exoBox}{${probHeader}}\n${probInner}\n\\end{exoBox}`;
            }
            return `\\subsection*{${probHeader}}\n${probInner}`;
          })
          .join("\n\n\\vspace{0.3cm}\\hrule\\vspace{0.3cm}\n");

    const dmSerieSolutionsLatex = includeDetailedSolutions
      ? `\n\n% [SYNC_SECTION:SOLUTIONS]\n\\newpage\n\\section*{${
          isMission || isPureFr
            ? `Annexe : Corrigé Détaillé (${isDM ? `Devoir Maison ${dmNumber} - Sujet ${m}` : `Série TD ${dmNumber}`})`
            : `الملحق الرسمي: عناصر الإجابة والحل المفصل (${isDM ? `الفرض المنزلي ${dmNumber}` : `سلسلة التمارين ${dmNumber}`})`
        }}\n` +
        (!isDM
          ? generateCustomCountSerieExercises(
              baseDsLessons,
              serieExerciseCount,
              m
            )
              .map((block, exIdx) => {
                const associatedLesson =
                  baseDsLessons[exIdx % Math.max(1, baseDsLessons.length)];
                const corr = generateSerieBlockCorrection(
                  block,
                  exIdx,
                  associatedLesson,
                  m
                );
                return (
                  `\\subsection*{${
                    customExerciseTitles[exIdx]?.trim() ||
                    (isMission || isPureFr ? block.badgeFr : block.badgeAr)
                  }}\n\\begin{enumerate}\n` +
                  corr.solutions
                    .map(
                      (s) =>
                        `  \\item \\textbf{${isMission || isPureFr ? `Question ${s.questionNumber}` : `السؤال ${s.questionNumber}`}} \\hfill \\textbf{[${s.bareme}]} \\newline\n  ${(
                          isMission || isPureFr
                            ? s.solutionTextFr
                            : s.solutionTextAr
                        ).replace(/\n/g, "\n  \\newline ")}`
                    )
                    .join("\n\n") +
                  `\n\\end{enumerate}`
                );
              })
              .join("\n\n\\vspace{0.25cm}\n")
          : baseDsLessons
              .map((l, idx) => {
                const blocks = getSerieAndDMExercises(l, dmSubType, m);
                return (
                  `\\subsection*{${
                    isMission || isPureFr
                      ? `Corrigé Problème ${idx + 1} : ${l.lessonFr}`
                      : `تصحيح التمرين التوليفي ${idx + 1} : ${l.lessonAr}`
                  }}\n` +
                  blocks
                    .map((b, bIdx) => {
                      const corr = generateSerieBlockCorrection(b, bIdx, l, m);
                      return (
                        `\\begin{enumerate}\n` +
                        corr.solutions
                          .map(
                            (s) =>
                              `  \\item \\textbf{${isMission || isPureFr ? `Question ${s.questionNumber}` : `السؤال ${s.questionNumber}`}} \\hfill \\textbf{[${s.bareme}]} \\newline\n  ${(
                                isMission || isPureFr
                                  ? s.solutionTextFr
                                  : s.solutionTextAr
                              ).replace(/\n/g, "\n  \\newline ")}`
                          )
                          .join("\n\n") +
                        `\n\\end{enumerate}`
                      );
                    })
                    .join("\n\\vspace{0.15cm}\n")
                );
              })
              .join("\n\n\\vspace{0.3cm}\n"))
      : "";

    return `% [SYNC_SECTION:HEADER]
${renderLatexCartouche(isDM ? m : undefined)}

% [SYNC_SECTION:EXERCISES]
\\section*{${
      isDM
        ? isMission || isPureFr
          ? `Devoir Maison (${dmNumber} - ${sem}) — Sujet ${m} (À rendre le : ${dmDueDate})`
          : `الفرض المنزلي (${dmNumber} - ${sem}) — النموذج (${modelArabicLabel(m)}) (تاريخ الإرجاع : ${dmDueDate})`
        : isMission || isPureFr
        ? `Série d'Exercices \\& Travaux Dirigés (${dmNumber} - ${sem})`
        : `سلسلة التمارين التطبيقية والتوليفية (${dmNumber} - ${sem})`
    }}

${bodyLatex}${dmSerieSolutionsLatex}`;
  };

  return sanitizeLatexDocumentBody(`${preamble}

\\pagestyle{fancy}
\\fancyhf{}
\\lhead{\\small \\textbf{${school}} (${year})}
\\chead{\\small \\textbf{${track.labelFr}}}
\\rhead{\\small \\textbf{${prof}}}
\\renewcommand{\\headrulewidth}{0.4pt}

\\begin{document}

${
  activeModule === "DS_142_08"
    ? `% ============================================================================
% [SYNC_SECTION:SPEC_TABLE]
% PARTIE 1 : ${isMission ? "GRILLE D'ÉVALUATION PAR COMPÉTENCES (PROGRAMME FRANÇAIS & AEFE)" : "GRILLE DE SPÉCIFICATION ET D'ÉVALUATION (NOTE MINISTÉRIELLE 142-08)"}
% ============================================================================
\\section*{1. ${isMission ? "Grille d'évaluation par compétences mathématiques (Programme Français)" : "Grille de spécification et d'évaluation (Conforme à la Note 142-08)"}}

\\begin{center}
\\renewcommand{\\arraystretch}{1.3}
\\begin{tabular}{|p{4.2cm}|p{7.5cm}|c|c|}
\\hline
\\textbf{${isMission ? "Thème / Chapitre" : "Chapitre / Unité"}} & \\textbf{${isMission ? "Attendus du programme (BOEN)" : "Capacités attendues (OP 2007)"}} & \\textbf{Pondération} & \\textbf{Barème} \\\\
\\hline
${
  hasQCMGlobal
    ? `\\textbf{Exercice 1 : QCM de synthèse} & Maîtrise des concepts fondamentaux et calculs rapides & ${Math.round((fixedQcmPts / 20) * 100)}\\% & \\textbf{${formatQuarterPoints(fixedQcmPts)} pts} \\\\ \\hline\n`
    : ""
}${baseDsLessons
  .map((l, idx) => {
    const scaledPts = getScaledLessonPoints(l.weight, l, idx, baseDsLessons);
    const scaledPct = getScaledLessonWeightPercent(l.weight, l, idx, baseDsLessons);
    return `\\textbf{${isPureFr ? l.lessonFr : `${l.lessonFr} \\newline (\\textarabic{${l.lessonAr}})`}} & ${l.capacitiesFr.join(" ; ")} & ${scaledPct}\\% & \\textbf{${formatQuarterPoints(scaledPts)} pts} \\\\ \\hline`;
  })
  .join("\n")}${
  hasSynthesisProblemGlobal
    ? `\n\\textbf{Problème de Synthèse (Type Bac)} & Modélisation, étude analytique et interprétation géométrique & 42.5\\% & \\textbf{8.5 pts} \\\\ \\hline`
    : ""
}
\\multicolumn{2}{|r|}{\\textbf{Total du Devoir Surveillé}} & \\textbf{100\\%} & \\textbf{20 / 20} \\\\
\\hline
\\end{tabular}
\\end{center}

\\noindent\\textbf{${isMission ? "Pondération formative des niveaux :" : "Répartition des niveaux taxonomiques (Note 142-08) :"}}
N1 (Application) : ${n1}\\% (${((n1 * 20) / 100).toFixed(1)} pts) \\quad | \\quad
N2 (Mobilisation) : ${n2}\\% (${((n2 * 20) / 100).toFixed(1)} pts) \\quad | \\quad
N3 (Synthèse) : ${n3}\\% (${((n3 * 20) / 100).toFixed(1)} pts)
${spec2DMatrix ? `\n\\vspace{0.2cm}\n${generate2DSpecMatrixLatex(spec2DMatrix)}\n` : ""}
\\vspace{0.3cm}
\\hrule
\\vspace{0.4cm}

% ============================================================================
% PARTIE 2 : SUJETS DU DEVOIR SURVEILLÉ (MODÈLE : ${examModel})
% ============================================================================
${modelsToRender.map((m) => renderLatexDSModel(m)).join("\n\n\\newpage\n\n")}

${
  includeDetailedSolutions
    ? `\n\\newpage\n% ============================================================================\n% [SYNC_SECTION:SOLUTIONS]\n% ANNEXE : CORRIGÉ DÉTAILLÉ ET BARÈME OFFICIEL (CADRE DE RÉFÉRENCE)\n% ============================================================================\n\\section*{${
        isMission
          ? "Annexe : Corrigé Détaillé et Barème Officiel (AEFE / Bac)"
          : isPureFr
          ? "Annexe : Corrigé Détaillé et Barème Officiel de Notation"
          : "الملحق الرسمي: عناصر الإجابة النموذجية وسلم التنقيط المفصل"
      } (Modèle ${examModel})}\n\\noindent\\textit{${
        isMission || isPureFr
          ? "Directives officielles : Toute démarche rigoureuse et cohérente doit être valorisée conformément au cadre de référence. Ne pas pénaliser deux fois pour une erreur de calcul intermédiaire. 0.5 pt réservé au soin de la rédaction."
          : "توجيهات رسمية: قبول أي طريقة برهان سليمة، مراعاة الدقة في التحرير الرياضي، عدم تكرار الخصم على الأخطاء الحسابية، و0.5 نقطة لنظافة الورقة."
      }}\n\n\\vspace{0.4cm}\n\n` +
      modelsToRender
        .map((m) => {
          const orderedLessons =
            shuffleExercises && m === "B"
              ? [...baseDsLessons].reverse()
              : baseDsLessons;
          const qcmBlock = hasQCMGlobal
            ? generateMoroccanQCMExercise(orderedLessons, m, track.cycle, {
                ...qcmConfig,
                isMission,
              })
            : null;
          const synthProb = hasSynthesisProblemGlobal
            ? generateMoroccanSynthesisProblem(orderedLessons, m, track.cycle, isMission)
            : null;
          const exOffset = hasQCMGlobal ? 1 : 0;

          const qcmSolLatex = qcmBlock
            ? `\\subsubsection*{${isMission || isPureFr ? qcmBlock.titleFr : qcmBlock.titleAr} \\quad \\textnormal{(${qcmBlock.totalPoints} pts)}}\n\\begin{enumerate}\n` +
              qcmBlock.items
                .map(
                  (item, qIdx) =>
                    `  \\item \\textbf{Q${qIdx + 1}} \\hfill \\textbf{[${item.points} pt]} \\newline \\textbf{${isMission || isPureFr ? item.correctAnswerFr : item.correctAnswerAr}} --- ${isMission || isPureFr ? item.justificationFr : item.justificationAr}`
                )
                .join("\n") +
              `\n\\end{enumerate}\n\\vspace{0.3cm}\n`
            : "";

          const synthSolLatex = synthProb
            ? `\n\n\\vspace{0.3cm}\n\\subsubsection*{${isMission || isPureFr ? synthProb.titleFr : synthProb.titleAr} \\quad \\textnormal{(${synthProb.totalPoints} pts)}}\n` +
              synthProb.parts
                .map(
                  (part) =>
                    `\\textbf{${isMission || isPureFr ? part.partTitleFr : part.partTitleAr}}\n\\begin{enumerate}\n` +
                    (isMission || isPureFr ? part.correctionFr : part.correctionAr)
                      .map((sol: string) => `  \\item ${sol}`)
                      .join("\n") +
                    `\n\\end{enumerate}`
                )
                .join("\n\\vspace{0.15cm}\n")
            : "";

          return (
            `\\subsection*{${
              isMission || isPureFr
                ? `Corrigé du Sujet (${m})`
                : `عناصر إجابة النموذج (${modelArabicLabel(m)})`
            }}\n` +
            qcmSolLatex +
            orderedLessons
              .map((l, idx) => {
                const rawVariantQs = getVariantQuestions(
                  l,
                  m,
                  shuffleQuestions,
                  0,
                  dsQuestionDensity
                );
                const questionsAr = sanitizeAndValidateQuestionsList(
                  rawVariantQs.questionsAr
                ).sanitizedQuestions;
                const questionsFr = sanitizeAndValidateQuestionsList(
                  rawVariantQs.questionsFr
                ).sanitizedQuestions;
                const scaledWeightPct = getScaledLessonWeightPercent(
                  l.weight,
                  l,
                  idx,
                  orderedLessons
                );
                const scaledPts = getScaledLessonPoints(
                  l.weight,
                  l,
                  idx,
                  orderedLessons
                );
                const corr = generateExerciseCorrection(
                  { ...l, weight: scaledWeightPct },
                  idx,
                  m,
                  questionsAr,
                  questionsFr
                );
                const displayExNum = idx + 1 + exOffset;
                const typicalErr =
                  params.includeCommonErrorsInSolutions !== false
                    ? getTypicalErrorsForLessons([l])[0]
                    : undefined;
                const didacticErrorLatex = typicalErr
                  ? `\n\\vspace{0.15cm}\n\\noindent\\fbox{\\parbox{0.97\\textwidth}{\\footnotesize \\textbf{${
                      isMission || isPureFr
                        ? "Grille des Erreurs Fréquentes \\& Vigilance Didactique :"
                        : "بطاقة تشخيص الأخطاء الشائعة للمتعلمين واليقظة الديداكتيكية :"
                    }} ${
                      isMission || isPureFr
                        ? typicalErr.frequentMistakeFr
                        : typicalErr.frequentMistakeAr
                    } \\newline \\textbf{${
                      isMission || isPureFr ? "Expression erronée :" : "الخطأ الشائع :"
                    }} $${typicalErr.wrongExpressionLatex}$ $\\longrightarrow$ \\textbf{${
                      isMission || isPureFr ? "Formulation correcte :" : "الصواب :"
                    }} $${typicalErr.correctExpressionLatex}$ \\newline \\textit{${
                      isMission || isPureFr
                        ? `Remédiation : ${typicalErr.teacherRemediationTipFr}`
                        : `توجيه بيداغوجي للدعم : ${typicalErr.teacherRemediationTipAr}`
                    }}}}`
                  : "";
                return (
                  `\\subsubsection*{${
                    isMission || isPureFr
                      ? `Exercice ${displayExNum} : ${l.lessonFr}`
                      : `التمرين ${displayExNum} : ${l.lessonAr}`
                  } \\quad \\textnormal{(${formatQuarterPoints(scaledPts)} pts)}}\n\\begin{enumerate}\n` +
                  corr.solutions
                    .map(
                      (s) =>
                        `  \\item \\textbf{${isMission || isPureFr ? `Question ${s.questionNumber}` : `السؤال ${s.questionNumber}`}} \\hfill \\textbf{[${s.bareme}]} \\newline\n  ${(
                          isMission || isPureFr
                            ? s.solutionTextFr
                            : s.solutionTextAr
                        ).replace(/\n/g, "\n  \\newline ")}`
                    )
                    .join("\n\n") +
                  `\n\\end{enumerate}` +
                  didacticErrorLatex
                );
              })
              .join("\n\n\\vspace{0.4cm}\n") +
            synthSolLatex
          );
        })
        .join("\n\n\\newpage\n\n")
    : `\\newpage\n% ============================================================================\n% [SYNC_SECTION:SOLUTIONS]\n% PARTIE 3 : ÉLÉMENTS DE RÉPONSE ET BARÈME DÉTAILLÉ (CAHIER DE TEXTES)\n% ============================================================================\n\\section*{Corrigé type et barème détaillé (Cahier de textes — Modèle ${examModel})}\n\\begin{itemize}\n` +
      baseDsLessons
        .map(
          (l, idx) =>
            `  \\item \\textbf{Corrigé de l'exercice ${idx + 1 + (hasQCMGlobal ? 1 : 0)} (${l.lessonFr}) :} Barème détaillé par étape de 0.25 pt à 1 pt sur un total de ${formatQuarterPoints(getScaledLessonPoints(l.weight, l, idx, baseDsLessons))} points (${getScaledLessonWeightPercent(l.weight, l, idx, baseDsLessons)}\\%).`
        )
        .join("\n") +
      `\n\\end{itemize}`
}`
    : activeModule === "DM_SERIE"
    ? `% ============================================================================
% ${isDM ? "DEVOIR MAISON (DM)" : "SÉRIE D'EXERCICES & TRAVAUX DIRIGÉS (TD)"}
% ============================================================================
${
  isDM
    ? modelsToRender.map((m) => renderLatexDMSerieModel(m)).join("\n\n\\newpage\n\n")
    : renderLatexDMSerieModel("A")
}`
    : activeModule === "FICHE_OP2007"
    ? (() => {
        const fiche = generateFullMoroccanPedagogicalFiche(ficheLesson, track);
        return `% ============================================================================
% [SYNC_SECTION:HEADER]
% FICHE PÉDAGOGIQUE COMPLÈTE & SCÉNARIO DIDACTIQUE
% ============================================================================
${renderLatexCartouche()}

% [SYNC_SECTION:SPEC_TABLE]
\\section*{${isMission ? "Fiche de Séquence Pédagogique (BOEN / AEFE) :" : "Fiche Pédagogique Officielle (OP 2007) :"} ${fiche.lessonTitleFr}}
\\textbf{Enveloppe horaire globale :} ${fiche.hoursGlobal} (${fiche.sessionsDistribution.activitiesHours} Activités | ${fiche.sessionsDistribution.courseHours} Cours | ${fiche.sessionsDistribution.exercisesHours} Exercices | ${fiche.sessionsDistribution.ticeHours} TICE) \\\\
\\textbf{${isMission ? "Attendus du programme (BOEN) :" : "Capacités attendues (OP 2007) :"}}
\\begin{itemize}
${fiche.expectedCapacitiesFr.map((c) => `  \\item ${c}`).join("\n")}
\\end{itemize}

% [SYNC_SECTION:EXERCISES]
\\subsection*{1. ${fiche.introductoryActivity.titleFr}}
\\noindent ${fiche.introductoryActivity.problemContextFr}
\\begin{enumerate}
${fiche.introductoryActivity.questionsFr.map((q) => `  \\item ${q}`).join("\n")}
\\end{enumerate}

\\subsection*{2. Contenu Intégral du Cours, Théorèmes \\& Exemples Résolus}
${fiche.fullCourseContent
  .map(
    (sec) =>
      `\\subsubsection*{${sec.sectionNum}. ${sec.titleFr}}\n` +
      sec.definitions
        .map((d) => `\\noindent\\textbf{Définition (${d.termFr}) :} ${d.contentFr}\\\\`)
        .join("\n") +
      "\n" +
      sec.theorems
        .map(
          (t) =>
            latexPackageTheme === "TCOLORBOX"
              ? `\\begin{exoBox}{Théorème : ${t.nameFr}}\n${t.statementFr}${t.proofFr ? `\n\\par\\smallskip\\textit{Démonstration :} ${t.proofFr}` : ""}\n\\end{exoBox}`
              : `\\noindent\\textbf{Théorème (${t.nameFr}) :} ${t.statementFr}${t.proofFr ? `\\\\ \\textit{Démonstration :} ${t.proofFr}` : ""}`
        )
        .join("\n\\vspace{0.2cm}\n")
  )
  .join("\n\n\\vspace{0.25cm}\n")}

\\subsection*{3. Grille d'Ingénierie Didactique (5 phases)}
\\begin{center}
\\renewcommand{\\arraystretch}{1.25}
\\begin{tabular}{|p{3.2cm}|p{5.5cm}|p{5.5cm}|p{2.2cm}|}
\\hline
\\textbf{Phase / Durée} & \\textbf{Rôle du Professeur} & \\textbf{Activité de l'Élève} & \\textbf{Modalités} \\\\
\\hline
${fiche.didacticSteps
  .map(
    (st) =>
      `\\textbf{${st.phaseFr}} (${st.durationMinutes} min) & ${st.teacherRoleFr} & ${st.studentRoleFr} & ${st.modalitiesFr} \\\\ \\hline`
  )
  .join("\n")}
\\end{tabular}
\\end{center}
${
  includeTICE
    ? `\n\\subsection*{4. ${fiche.ticeIntegration.geogebraActivity.titleFr} \\& Python}\n\\noindent ${fiche.ticeIntegration.geogebraActivity.goalFr}\n\\begin{verbatim}\n${fiche.ticeIntegration.pythonScript.code}\n\\end{verbatim}`
    : ""
}

% [SYNC_SECTION:SOLUTIONS]
\\subsection*{5. ${fiche.formativeEvaluation.titleFr}}
\\noindent\\textbf{${fiche.formativeEvaluation.testExerciseFr.statement}}
\\begin{enumerate}
${fiche.formativeEvaluation.testExerciseFr.questions.map((q, idx) => `  \\item ${q} \\hfill \\textbf{[${fiche.formativeEvaluation.testExerciseFr.markingScheme[idx] || "1 pt"}]}`).join("\n")}
\\end{enumerate}`;
      })()
    : activeModule === "DIAGNOSTIC"
    ? (() => {
        const diagModel = examModel === "B" ? "B" : "A";
        const diag = generateMoroccanDiagnosticPaper(track.code, diagDuration, diagModel);
        const exLatex = diag.directExercises
          .map((ex) => {
            const inner = `\\noindent\\textit{Prérequis ciblé : ${ex.prerequisiteFr}}\n\\begin{enumerate}\n${ex.questionsFr
              .map((q) => `  \\item \\textbf{${q.label}} ${q.text} \\hfill \\textbf{[${q.points}]}`)
              .join("\n")}\n\\end{enumerate}`;
            if (latexPackageTheme === "TCOLORBOX") {
              return `\\begin{exoBox}{Exercice ${ex.number} : ${ex.titleFr} (${ex.totalPoints} pts)}\n${inner}\n\\end{exoBox}`;
            }
            return `\\subsection*{Exercice ${ex.number} : ${ex.titleFr} (${ex.totalPoints} pts)}\n${inner}`;
          })
          .join("\n\\vspace{0.25cm}\n");

        const synthInner =
          `\\noindent\\textit{${diag.synthesisProblem.contextFr}}\n` +
          diag.synthesisProblem.partsFr
            .map(
              (p) =>
                `\\subsubsection*{${p.partTitle} (${p.points} pts)}\n\\begin{enumerate}\n${p.questions
                  .map((q) => `  \\item ${q}`)
                  .join("\n")}\n\\end{enumerate}`
            )
            .join("\n\\vspace{0.15cm}\n");

        const synthLatex =
          latexPackageTheme === "TCOLORBOX" && tcolorboxConfig.applyToComplexProblems
            ? `\\begin{problemeComplexeBox}{${diag.synthesisProblem.titleFr} (${diag.synthesisProblem.totalPoints} pts)}\n${synthInner}\n\\end{problemeComplexeBox}`
            : `\\subsection*{${diag.synthesisProblem.titleFr} (${diag.synthesisProblem.totalPoints} pts)}\n${synthInner}`;

        return `% ============================================================================
% [SYNC_SECTION:HEADER]
% TEST DIAGNOSTIQUE COMPLET & GRILLE DE REMÉDIATION
% ============================================================================
${renderLatexCartouche(diagModel)}

% [SYNC_SECTION:SPEC_TABLE]
\\section*{${diag.titleFr} (Durée : ${diag.duration} — Seuil de maîtrise : ${diag.masteryThresholdPercent}\\%)}
\\textbf{Prérequis fondamentaux évalués :}
\\begin{itemize}
${track.prereqsFr.map((p) => `  \\item ${p}`).join("\n")}
\\end{itemize}

% [SYNC_SECTION:EXERCISES]
\\subsection*{Partie I : QCM de Diagnostic des Représentations (4.0 pts)}
\\begin{enumerate}
${diag.qcmItems
  .map(
    (item) =>
      `  \\item \\textbf{${item.questionFr}} \\hfill \\textbf{[${item.points} pt]}\n  \\newline ${item.optionsFr.map((o) => `(\\textbf{${o.code}}) ${o.text}`).join(" \\quad | \\quad ")}`
  )
  .join("\n")}
\\end{enumerate}

\\vspace{0.25cm}
${exLatex}

% [SYNC_SECTION:SYNTHESIS_PROBLEM]
\\vspace{0.25cm}
${synthLatex}

% [SYNC_SECTION:SOLUTIONS]
\\newpage
\\section*{Grille de Correction Détaillée, Analyse Didactique des Erreurs \\& Plan de Remédiation}
\\begin{center}
\\renewcommand{\\arraystretch}{1.25}
\\begin{tabular}{|c|p{4.8cm}|p{5.2cm}|p{4.8cm}|}
\\hline
\\textbf{QCM} & \\textbf{Réponse \\& Justification} & \\textbf{Erreur Type \\& Obstacle} & \\textbf{Plan de Remédiation} \\\\
\\hline
${diag.qcmItems
  .map(
    (item) =>
      `\\textbf{${item.id.toUpperCase()}} (${item.correctCode}) & ${item.justificationFr} & ${item.commonErrorFr} & ${item.remediationPlanFr} \\\\ \\hline`
  )
  .join("\n")}
\\end{tabular}
\\end{center}`;
      })()
    : `% ============================================================================
% [SYNC_SECTION:HEADER]
% RÉPARTITION ANNUELLE
% ============================================================================
${renderLatexCartouche()}

% [SYNC_SECTION:SPEC_TABLE]
\\section*{${isMission ? "Progression Annuelle & Calendrier AEFE" : "Répartition Annuelle du Programme"} (${track.labelFr})}

% [SYNC_SECTION:EXERCISES]
\\begin{center}
\\renewcommand{\\arraystretch}{1.2}
\\begin{tabular}{|c|p{6.5cm}|c|p{7.5cm}|}
\\hline
\\textbf{${isMission ? "Période" : "Semestre"}} & \\textbf{Chapitre} & \\textbf{Horaire} & \\textbf{Attendus} \\\\
\\hline
${allLessons
  .map(
    (l, idx) =>
      `${isMission ? `Période ${Math.min(5, Math.floor((idx / allLessons.length) * 5) + 1)}` : idx < Math.ceil(allLessons.length / 2) ? "S1" : "S2"} & \\textbf{${l.lessonFr}} & ${l.hours} & ${l.capacitiesFr[0]} \\\\ \\hline`
  )
  .join("\n")}
\\end{tabular}
\\end{center}`
}
${
  attachedPythonAlgorithms.length > 0
    ? `\n\\vspace{0.4cm}\n% [SYNC_SECTION:PYTHON_TICE]\n\\section*{${
        isMission || isPureFr
          ? "Annexe Algorithmique \\& Programmation Python (TICE)"
          : "ملحق البرمجة والخوارزميات الرياضية بلغة Python (إدماج TICE)"
      }}\n` +
      attachedPythonAlgorithms
        .map(
          (algo, aIdx) =>
            `\\subsection*{${aIdx + 1}. ${
              isMission || isPureFr ? algo.titleFr : algo.titleAr
            } (${isMission || isPureFr ? algo.levelBadgeFr : algo.levelBadgeAr})}\n\\noindent\\textit{${
              isMission || isPureFr ? algo.objectiveFr : algo.objectiveAr
            }}\n\\begin{verbatim}\n${algo.pythonCode}\n\\end{verbatim}\n\\begin{enumerate}\n` +
            (isMission || isPureFr
              ? algo.pedagogicalQuestionsFr
              : algo.pedagogicalQuestionsAr
            )
              .map((q: string) => `  \\item ${q}`)
              .join("\n") +
            `\n\\end{enumerate}` +
            (includeDetailedSolutions
              ? `\n\\noindent\\textbf{${
                  isMission || isPureFr
                    ? "Sortie console attendue :"
                    : "المخرج العددي المتوقع :"
                }} ${
                  isMission || isPureFr
                    ? algo.expectedOutputFr
                    : algo.expectedOutputAr
                }`
              : "")
        )
        .join("\n\\vspace{0.25cm}\n")
    : ""
}
${
  params.includeInteractiveQrFooter !== false && params.interactiveExamUrl
    ? `\n\\vspace{0.4cm}\n\\noindent\\fbox{\\parbox{0.97\\textwidth}{\\footnotesize \\textbf{${
        isMission || isPureFr
          ? "Version Interactive en Ligne du Devoir \\& Auto-Correction Immédiate (QR Code) :"
          : "النسخة التفاعلية الرقمية للفرض والتصحيح الآلي الفوري (QR Code) :"
      }} \\newline \\texttt{${params.interactiveExamUrl.replace(/([%&#_])/g, "\\$1")}}}}`
    : ""
}

\\end{document}`
  );
}
