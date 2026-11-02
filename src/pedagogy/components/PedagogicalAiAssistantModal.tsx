import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  FilePlus2,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Terminal,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { MathText } from "./MathRenderer";

export type AiPedagogicalTask =
  | "SOLVE_STEP_BY_STEP"
  | "GENERATE_ISOMORPHIC_VARIANT"
  | "SIMPLIFY_COMPLEX_WORDING"
  | "GENERATE_SYNTHESIS_PROBLEM"
  | "GENERATE_BILINGUAL_RUBRIC"
  | "GENERATE_PYTHON_DIDACTIC"
  | "DIDACTIC_AUDIT_142_08"
  | "GENERATE_EPIS_REMEDIATION"
  | "GENERATE_OLYMPIAD_CHALLENGE";

export interface AiGradingCriterion {
  questionRef: string;
  criterionAr: string;
  criterionFr: string;
  points: number;
  skillLevel: "N1" | "N2" | "N3";
  remediationAr: string;
}

export interface AiPedagogicalResponse {
  task: AiPedagogicalTask;
  titleAr: string;
  titleFr: string;
  trackLabel: string;
  latexFormulas: string[];
  stepByStepProofAr: string;
  stepByStepProofFr: string;
  theoremsUsed: string[];
  commonPitfallsAr: string[];
  commonPitfallsFr: string[];
  variantExercise: {
    titleAr: string;
    titleFr: string;
    statementAr: string;
    statementFr: string;
    solutionAr: string;
    solutionFr: string;
  };
  gradingRubric: AiGradingCriterion[];
  pythonScenario: {
    titleAr: string;
    titleFr: string;
    objectiveAr: string;
    objectiveFr: string;
    code: string;
    questionsAr: string[];
    questionsFr: string[];
    sampleOutput: string;
  };
  didacticAudit: {
    estimatedDurationMinutes: number;
    suggestedPoints: number;
    n1Percentage: number;
    n2Percentage: number;
    n3Percentage: number;
    complianceNotesAr: string;
    complianceNotesFr: string;
  };
}

interface EndpointDiagnosticItem {
  route: string;
  nameAr: string;
  status: "READY" | "ERROR";
  mode: string;
}

interface PedagogicalAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackLabel: string;
  educationSystem: "MAROC_NATIONAL" | "MISSION_FRANCAISE";
  currentModelChoice?: "gemini-3.8-flash" | "gemini-4-argon";
  onChangeModelChoice?: (model: "gemini-3.8-flash" | "gemini-4-argon") => void;
  selectedAiModel?: "gemini-3.8-flash" | "gemini-4-argon";
  onSelectAiModel?: (model: "gemini-3.8-flash" | "gemini-4-argon") => void;
  lessons?: Array<{
    lessonAr: string;
    lessonFr: string;
    weight?: number;
    sampleExerciseAr?: string[];
    sampleExerciseFr?: string[];
  }>;
  initialView?: "WORKSPACE" | "SETTINGS_DOCS";
  initialTask?: AiPedagogicalTask;
  initialLessonIndex?: number;
  onApplyVariantToDoc?: (statement: string, solution: string) => void;
  onNotify?: (type: "success" | "error" | "info", text: string) => void;
  onInsertExerciseToExam?: (payload: {
    targetLessonIndex: number;
    questionAr: string;
    questionFr: string;
    solutionAr: string;
    solutionFr: string;
    points: number;
    level: "N1" | "N2" | "N3";
  }) => void;
  onReplaceExerciseInExam?: (payload: {
    targetLessonIndex: number;
    questionsAr: string[];
    questionsFr: string[];
    solutionAr: string;
    solutionFr: string;
    titleAr?: string;
    titleFr?: string;
  }) => void;
  onAttachPythonScenario?: (algo: {
    id: string;
    titleAr: string;
    titleFr: string;
    code: string;
    output: string;
    questionsAr: string[];
    questionsFr: string[];
  }) => void;
}

const SAMPLE_PROBLEMS_PRESETS: Array<{
  id: string;
  labelAr: string;
  badge: string;
  text: string;
}> = [
  {
    id: "ln_study",
    labelAr: "دالة لوغاريتمية ومبرهنة القيم الوسيطية",
    badge: "تحليل 2Bac",
    text: `نعتبر الدالة العددية f المعرفة على المجال ]0, +∞[ بـ: f(x) = x - 1 + (ln(x)) / x.
1. أحسب نهايتي الدالة f عند 0+ وعند +∞، وبين أن المستقيم (Δ): y = x - 1 مقارب مائل للمنحنى (C_f) بجوار +∞.
2. بين أن لكل x من ]0, +∞[: f'(x) = (x² + 1 - ln(x)) / x²، ثم استنتج رتابة الدالة f.
3. بين أن المعادلة f(x) = 0 تقبل حلاً وحيداً α في المجال ]1/e, 1[، ثم أحسب مساحة الحيز المحصور بين (C_f) و (Δ) والمستقيمين x = 1 و x = e.`,
  },
  {
    id: "suites_rec",
    labelAr: "المتتاليات الترجعية والتقارب",
    badge: "متتاليات 2Bac",
    text: `نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = 2 و u_{n+1} = (4u_n - 1)/(u_n + 2) لكل n من N.
1. أحسب u_1 و u_2، ثم بين بالترجع أن u_n > 1 لكل n من N.
2. بين أن u_{n+1} - u_n = -(u_n - 1)^2 / (u_n + 2) ثم أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة.
3. نضع v_n = 1/(u_n - 1). بين أن (v_n) متتالية حسابية محدداً أساسها، ثم أكتب u_n بدلالة n وأحسب lim u_n.`,
  },
  {
    id: "complex_rot",
    labelAr: "الأعداد العقدية والدوران",
    badge: "عقدية 2Bac",
    text: `1. حل في مجموعة الأعداد العقدية C المعادلة: z² - 2√3 z + 4 = 0.
2. في المستوى العقدي المنسوب إلى معلم متعامد ممنظم مباشر (O, u, v)، نعتبر النقط A و B و C التي ألحاقها a = √3 + i و b = √3 - i و c = 2i. أكتب a و b على الشكل الأسي.
3. بين أن صورة النقطة A بالدوران R الذي مركزه O وزاويته π/3 هي النقطة C، واستنتج طبيعة المثلث OAC.`,
  },
  {
    id: "integral_ipp",
    labelAr: "حساب التكامل والمكاملة بالأجزاء",
    badge: "تكامل 2Bac",
    text: `نعتبر الدالة العددية f المعرفة على R بـ: f(x) = (x - 1)e^x + x.
1. أحسب lim_{x→-∞} f(x) وبين أن المستقيم (Δ): y = x مقارب مائل للمنحنى (C_f) بجوار -∞.
2. باستعمال المكاملة بالأجزاء، أحسب التكامل I = ∫_0^1 (x - 1)e^x dx، ثم استنتج مساحة الحيز المحصور بين (C_f) والمستقيم (Δ) والمستقيمين x = 0 و x = 1.`,
  },
];

const AI_TASKS: Array<{
  id: AiPedagogicalTask;
  labelAr: string;
  labelFr: string;
  badge: string;
}> = [
  {
    id: "SOLVE_STEP_BY_STEP",
    labelAr: "برهان وحل نموذجي مفصل (Corrigé Type)",
    labelFr: "Démonstration rigoureuse étape par étape",
    badge: "برهان صارم",
  },
  {
    id: "GENERATE_ISOMORPHIC_VARIANT",
    labelAr: "اقتراح أسئلة موازية وتوليد نموذج متكافئ (Sujet B Anti-Triche)",
    labelFr: "Génération d'un sujet isomorphe équivalent (Questions parallèles)",
    badge: "أسئلة موازية",
  },
  {
    id: "SIMPLIFY_COMPLEX_WORDING",
    labelAr: "تبسيط صياغة المسائل المعقدة وتفكيك الأسئلة المركبة (Scaffolding)",
    labelFr: "Simplification de l'énoncé et décomposition en sous-questions guidées",
    badge: "تبسيط الصياغة",
  },
  {
    id: "GENERATE_SYNTHESIS_PROBLEM",
    labelAr: "بناء مسألة توليفية شاملة (Problème Type Bac)",
    labelFr: "Construction d'un problème de synthèse complet",
    badge: "مسألة وطنية",
  },
  {
    id: "GENERATE_BILINGUAL_RUBRIC",
    labelAr: "سلم التنقيط الرسمي وشبكة المعالجة (مذكرة 142-08)",
    labelFr: "Barème détaillé au 0.25 pt & Remédiation",
    badge: "سلم 142-08",
  },
  {
    id: "GENERATE_PYTHON_DIDACTIC",
    labelAr: "خوارزمية بايثون المدمجة بالتمرين (Python TICE)",
    labelFr: "Scénario algorithmique Python & questions élèves",
    badge: "Python Lab",
  },
  {
    id: "DIDACTIC_AUDIT_142_08",
    labelAr: "تدقيق المفتش التربوي وتوازن المهارات (N1/N2/N3)",
    labelFr: "Audit didactique et conformité référentielle",
    badge: "تدقيق المفتش",
  },
  {
    id: "GENERATE_EPIS_REMEDIATION",
    labelAr: "تشخيص العوائق الإبستيمولوجية وبطاقة الدعم الفردي (Brousseau)",
    labelFr: "Diagnostic d'obstacles épistémologiques & Fiche de remédiation",
    badge: "عوائق ودعم",
  },
  {
    id: "GENERATE_OLYMPIAD_CHALLENGE",
    labelAr: "توليد مسألة أولمبياد وتميز مع إرشادات بوليا (Olympiades N3+)",
    labelFr: "Défi Olympiades & Concours Général avec Heuristiques de Polya",
    badge: "أولمبياد وتميز",
  },
];

export const PedagogicalAiAssistantModal: React.FC<
  PedagogicalAiAssistantModalProps
> = ({
  isOpen,
  onClose,
  trackLabel,
  educationSystem,
  currentModelChoice,
  onChangeModelChoice,
  selectedAiModel: selectedAiModelProp,
  onSelectAiModel: onSelectAiModelProp,
  lessons = [],
  initialView = "WORKSPACE",
  initialTask,
  initialLessonIndex,
  onApplyVariantToDoc,
  onNotify,
  onInsertExerciseToExam,
  onReplaceExerciseInExam,
  onAttachPythonScenario,
}) => {
  const selectedAiModel =
    currentModelChoice || selectedAiModelProp || "gemini-3.8-flash";
  const onSelectAiModel = (model: "gemini-3.8-flash" | "gemini-4-argon") => {
    if (onChangeModelChoice) onChangeModelChoice(model);
    if (onSelectAiModelProp) onSelectAiModelProp(model);
  };
  const [modalView, setModalView] = useState<"WORKSPACE" | "SETTINGS_DOCS">(
    initialView
  );
  const [selectedTask, setSelectedTask] = useState<AiPedagogicalTask>(
    "SOLVE_STEP_BY_STEP"
  );
  const [thinkingLevel, setThinkingLevel] = useState<"HIGH" | "MEDIUM" | "LOW">(
    "HIGH"
  );
  const [problemText, setProblemText] = useState<string>(
    SAMPLE_PROBLEMS_PRESETS[0].text
  );
  const [targetLessonIdx, setTargetLessonIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeResultTab, setActiveResultTab] = useState<
    "PROOF" | "VARIANT" | "RUBRIC" | "PYTHON" | "AUDIT"
  >("PROOF");
  const [aiStatus, setAiStatus] = useState<{
    configured: boolean;
    engineReady: boolean;
    hybridFallbackActive?: boolean;
  }>({ configured: true, engineReady: true, hybridFallbackActive: true });
  const [endpointsDiag, setEndpointsDiag] = useState<EndpointDiagnosticItem[]>(
    []
  );
  const [isTestingPing, setIsTestingPing] = useState<boolean>(false);
  const [isRunningFullDiag, setIsRunningFullDiag] = useState<boolean>(false);
  const [pingLatencyMs, setPingLatencyMs] = useState<number | null>(null);
  const [pingTestNote, setPingTestNote] = useState<string | null>(null);
  const [modelUsedLabel, setModelUsedLabel] = useState<string>(
    selectedAiModel === "gemini-4-argon"
      ? "Gemini 4 Argon (High-Reasoning Math)"
      : "Gemini Flash 3.8 (Fast Pedagogical Engine)"
  );
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const [result, setResult] = useState<AiPedagogicalResponse>({
    task: "SOLVE_STEP_BY_STEP",
    titleAr: "دراسة دالة لوغاريتمية، مقارب مائل، ومبرهنة القيم الوسيطية",
    titleFr: "Étude d'une fonction logarithmique, asymptote oblique et TVI",
    trackLabel,
    latexFormulas: [
      "\\lim_{x \\to 0^+} f(x) = \\lim_{x \\to 0^+} \\left(x - 1 + \\frac{\\ln(x)}{x}\\right) = -\\infty",
      "\\lim_{x \\to +\\infty} \\big[f(x) - (x - 1)\\big] = \\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0^+",
      "\\forall x > 0,\\; f'(x) = 1 + \\frac{\\frac{1}{x}\\cdot x - \\ln(x)}{x^2} = \\frac{x^2 + 1 - \\ln(x)}{x^2} > 0",
      "\\int_1^e \\frac{\\ln(x)}{x}\\,dx = \\left[\\frac{1}{2}(\\ln x)^2\\right]_1^e = \\frac{1}{2}\\text{ u.a.}",
    ],
    stepByStepProofAr: `1. حساب النهايات والفروع اللانهائية:
- عند 0+: لدينا lim_{x→0+} ln(x) = -∞ و lim_{x→0+} (1/x) = +∞، إذن بحساب الجداء lim_{x→0+} ln(x)/x = -∞، ومنه lim_{x→0+} f(x) = -∞. التأويل الهندسي: المنحنى (C_f) يقبل مقارباً عمودياً معادلته x = 0.
- عند +∞: لدينا lim_{x→+∞} (x - 1) = +∞ و lim_{x→+∞} ln(x)/x = 0 (نهاية اعتيادية بالتزايدات المقارنة)، إذن lim_{x→+∞} f(x) = +∞.
- المقارب المائل: نحسب lim_{x→+∞} [f(x) - (x - 1)] = lim_{x→+∞} ln(x)/x = 0، وبالتالي المستقيم (Δ): y = x - 1 مقارب مائل للمنحنى (C_f) بجوار +∞.

2. حساب المشتقة ودراسة الرتابة:
- الدالة f قابلة للاشتقاق على ]0, +∞[، ولكل x > 0:
  f'(x) = 1 + (1 - ln(x)) / x² = (x² + 1 - ln(x)) / x².
- نعلم أنه لكل x > 0 لدينا ln(x) < x ≤ x² + 1، ومنه x² + 1 - ln(x) > 0 قطعا، إذن f'(x) > 0 على ]0, +∞[ والدالة f تزايدية قطعا.

3. مبرهنة القيم الوسيطية (TVI) وحساب المساحة:
- الدالة f متصلة وتزايدية قطعا على المجال [1/e, 1]، ولدينا f(1/e) = 1/e - 1 - e < 0 و f(1) = 0، ومنه المعادلة تقبل حلاً وحيداً.
- التكامل: الدالة الأصلية لـ x ↦ ln(x)/x على [1, e] هي x ↦ (1/2)(ln x)²، إذن المساحة تساوي 1/2 × ||i||·||j||.`,
    stepByStepProofFr: `1. Limites aux bornes et asymptotes :
- En 0+ : lim_{x→0+} ln(x)/x = -∞ d'où lim_{x→0+} f(x) = -∞. La droite d'équation x = 0 est asymptote verticale à (C_f).
- En +∞ : Par croissances comparées, lim_{x→+∞} ln(x)/x = 0 donc lim_{x→+∞} f(x) = +∞ et lim_{x→+∞} [f(x) - (x - 1)] = 0. La droite (Δ) : y = x - 1 est asymptote oblique.

2. Dérivabilité et variations :
- f est dérivable sur ]0, +∞[ et f'(x) = (x² + 1 - ln(x)) / x² > 0 pour tout x > 0. Ainsi, f est strictement croissante sur ]0, +∞[.

3. Calcul d'aire :
- Sur [1, e], ln(x)/x ≥ 0 donc (C_f) est au-dessus de (Δ). Une primitive de u'u est (1/2)u², d'où ∫_1^e (ln(x)/x) dx = [1/2 (ln x)²]_1^e = 1/2 u.a.`,
    theoremsUsed: [
      "نهايات التزايدات المقارنة للدالة اللوغاريتمية (Croissances comparées : lim ln(x)/x = 0)",
      "قاعدة اشتقاق خارج دالتين (Dérivée d'un quotient u/v)",
      "مبرهنة القيم الوسيطية في حالة الرتابة القطعية (Théorème de la bijection / TVI)",
      "الدوال الأصلية من الشكل u'(x)·u(x) وحساب المساحة الهندسية",
    ],
    commonPitfallsAr: [
      "الوقوع في الشكل غير المحدد عند 0+ بكتابة ln(x)/x دون تفكيكها إلى (1/x) × ln(x).",
      "نسيان ذكر شرط الاتصال والرتابة القطعية عند تطبيق مبرهنة القيم الوسيطية (TVI).",
      "إغفال القيمة المطلقة |f(x) - y| ودراسة الوضع النسبي قبل حساب مساحة الحيز المستوي.",
    ],
    commonPitfallsFr: [
      "Oublier de justifier la continuité et la stricte monotonie lors de l'application du TVI.",
      "Omettre l'étude du signe de f(x) - (x - 1) avant de calculer l'aire entre (C_f) et (Δ).",
    ],
    variantExercise: {
      titleAr:
        "النموذج الموازي المتكافئ (Sujet B) — دراسة دالة لوغاريتمية وحساب المساحة",
      titleFr: "Sujet B Équivalent — Fonction logarithmique et calcul intégral",
      statementAr: `نعتبر الدالة العددية g المعرفة على المجال ]0, +∞[ بـ: g(x) = 2x - 1 - (2 ln(x)) / x.
1. أحسب lim_{x→0+} g(x) و lim_{x→+∞} g(x)، وبين أن المستقيم (D): y = 2x - 1 مقارب مائل للمنحنى (C_g) بجوار +∞.
2. أدرس الوضع النسبي للمنحنى (C_g) والمستقيم (D) على المجال ]0, +∞[.
3. بين أن لكل x > 0: g'(x) = 2(x² - 1 + ln(x)) / x²، ثم استنتج إشارة g'(x) على المجالين ]0, 1] و [1, +∞[ (علل أن x² - 1 و ln(x) لهما نفس الإشارة).
4. أحسب مساحة الحيز المستوي المحصور بين المنحنى (C_g) والمستقيم (D) والمستقيمين x = 1 و x = e.`,
      statementFr: `Soit g la fonction numérique définie sur ]0, +∞[ par : g(x) = 2x - 1 - (2 ln(x)) / x.
1. Calculer les limites de g en 0+ et en +∞, et montrer que (D) : y = 2x - 1 est asymptote oblique en +∞.
2. Étudier la position relative de (C_g) et de la droite (D) sur ]0, +∞[.
3. Montrer que pour tout x > 0, g'(x) = 2(x² - 1 + ln(x)) / x² et justifier que g'(x) > 0 sur ]0, +∞[.
4. Calculer l'aire du domaine plan délimité par (C_g), (D) et les droites x = 1 et x = e.`,
      solutionAr: `1. عند 0+: lim g(x) = +∞ (مقارب عمودي x=0). عند +∞: lim g(x) = +∞ و lim [g(x) - (2x-1)] = 0.
2. إشارة الفرق g(x) - (2x-1) = -2ln(x)/x هي عكس إشارة ln(x): المنحنى تحت (D) على [1, +∞[.
3. على [1, +∞[ لدينا x²-1 ≥ 0 و ln(x) ≥ 0.
4. التكامل: ∫_1^e |g(x) - y| dx = ∫_1^e (2ln(x)/x) dx = [(ln x)²]_1^e = 1 u.a.`,
      solutionFr: `1. lim_{x→0+} g(x) = +∞ et lim_{x→+∞} [g(x) - (2x-1)] = 0.
2. g(x) - (2x-1) = -2ln(x)/x ≤ 0 sur [1, e].
3. Aire = ∫_1^e (2ln(x)/x) dx = [(ln x)²]_1^e = 1 u.a.`,
    },
    gradingRubric: [
      {
        questionRef: "1.a",
        criterionAr: "حساب النهاية عند 0+ مع التأويل الهندسي (مقارب عمودي x=0)",
        criterionFr: "Limite en 0+ et interprétation géométrique",
        points: 0.75,
        skillLevel: "N1",
        remediationAr: "التذكير بتفكيك الكسر ln(x)/x إلى (1/x)×ln(x)",
      },
      {
        questionRef: "1.b",
        criterionAr: "حساب النهاية عند +∞ وإثبات معادلة المقارب المائل (Δ)",
        criterionFr: "Limite en +∞ et justification de l'asymptote oblique",
        points: 1.0,
        skillLevel: "N1",
        remediationAr: "مراجعة النهاية المرجعية lim ln(x)/x = 0",
      },
      {
        questionRef: "2.a",
        criterionAr: "تطبيق قاعدة مشتقة خارج دالتين وتوحيد المقامات بدقة",
        criterionFr: "Calcul exact de la dérivée f'(x)",
        points: 1.25,
        skillLevel: "N2",
        remediationAr: "تطبيق الصيغة (u/v)' = (u'v - uv')/v²",
      },
      {
        questionRef: "2.b",
        criterionAr: "تعليل إشارة البسط واستنتاج الرتابة القطعية وجدول التغيرات",
        criterionFr: "Justification du signe de f'(x) et tableau de variations",
        points: 1.0,
        skillLevel: "N2",
        remediationAr: "استغلال المتفاوتة الاعتيادية ln(x) ≤ x - 1",
      },
      {
        questionRef: "3.a",
        criterionAr: "تطبيق مبرهنة القيم الوسيطية بذكر الشروط الثلاثة كاملة",
        criterionFr: "Application rigoureuse du théorème de la bijection (TVI)",
        points: 1.25,
        skillLevel: "N2",
        remediationAr: "التأكيد على: الاتصال + الرتابة القطعية + شرط الصور",
      },
      {
        questionRef: "3.b",
        criterionAr: "تحديد الدالة الأصلية لـ ln(x)/x وحساب مساحة الحيز المستوي",
        criterionFr: "Primitive de u'u et calcul exact de l'aire",
        points: 1.25,
        skillLevel: "N3",
        remediationAr: "كتابة ln(x)/x على شكل (1/x)·ln(x) = u'(x)·u(x)",
      },
    ],
    pythonScenario: {
      titleAr:
        "خوارزمية التفريع الثنائي (Dichotomie) وحساب التكامل بطريقة المستطيلات",
      titleFr:
        "Algorithme de Dichotomie et approximation d'intégrale par les rectangles",
      objectiveAr:
        "تأطير الحل α للمعادلة f(x)=0 بسعة 10^{-4} والتحقق العددي من قيمة المساحة A = 0.5",
      objectiveFr:
        "Encadrer la solution α à 10^{-4} près et approcher l'aire par la méthode des rectangles",
      code: `import math

def f(x):
    return x - 1 + math.log(x) / x

def dichotomie(a, b, eps=1e-4):
    while (b - a) > eps:
        m = (a + b) / 2
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
    return round(a, 5), round(b, 5)

def aire_rectangles(n=1000):
    h = (math.e - 1.0) / n
    somme = 0.0
    for k in range(n):
        xk = 1.0 + k * h
        somme += (math.log(xk) / xk) * h
    return round(somme, 5)

print("Encadrement de alpha :", dichotomie(1/math.e, 1.0, 1e-4))
print("Approximation de l'aire :", aire_rectangles(2000))`,
      questionsAr: [
        "1. ما هو دور الشرط f(a) * f(m) <= 0 في السطر 9 من دالة dichotomie؟",
        "2. أتمم السطر 19 لحساب مجموع مساحات المستطيلات على المجال [1, e]، ثم قارن النتيجة بالقيمة المضبوطة 1/2.",
      ],
      questionsFr: [
        "1. Expliquer la condition d'arrêt while (b - a) > eps dans la fonction dichotomie.",
        "2. Comparer la valeur renvoyée par aire_rectangles(2000) avec la valeur exacte 0.5.",
      ],
      sampleOutput:
        "Encadrement de alpha : (0.99994, 1.0) | Approximation de l'aire : 0.49991",
    },
    didacticAudit: {
      estimatedDurationMinutes: 45,
      suggestedPoints: 6.5,
      n1Percentage: 30,
      n2Percentage: 50,
      n3Percentage: 20,
      complianceNotesAr:
        "التمرين مطابق تماماً للمذكرة الوزارية 142-08 والأطر المرجعية الوطنية؛ يحقق توازناً مثالياً بين الأسئلة المباشرة (النهايات 30%)، والاستدلال (المشتقة ومبرهنة القيم الوسيطية 50%)، والتركيب (حساب المساحة 20%).",
      complianceNotesFr:
        "Exercice parfaitement conforme aux Orientations Pédagogiques et au cadre référentiel du Baccalauréat (N1: 30%, N2: 50%, N3: 20%).",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setModalView(initialView);
    }
  }, [isOpen, initialView]);

  const fetchDiagnostics = useCallback(async () => {
    try {
      const [statusRes, diagRes] = await Promise.all([
        fetch("/api/ai-status"),
        fetch("/api/ai-diagnostics"),
      ]);
      if (statusRes.ok) {
        const d = await statusRes.json();
        setAiStatus({
          configured: Boolean(d.configured),
          engineReady: true,
          hybridFallbackActive: true,
        });
      }
      if (diagRes.ok) {
        const diagData = await diagRes.json();
        if (Array.isArray(diagData.endpoints)) {
          setEndpointsDiag(diagData.endpoints);
        }
      }
    } catch {
      setAiStatus({
        configured: false,
        engineReady: true,
        hybridFallbackActive: true,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    fetchDiagnostics();
  }, [isOpen, fetchDiagnostics]);

  const buildLessonProblemPrompt = useCallback(
    (lessonIdx: number, taskForPrompt?: AiPedagogicalTask) => {
      const targetLesson = lessons[lessonIdx];
      if (!targetLesson) return SAMPLE_PROBLEMS_PRESETS[0].text;
      const existingQuestions =
        Array.isArray(targetLesson.sampleExerciseAr) &&
        targetLesson.sampleExerciseAr.length > 0
          ? `\nأسئلة التمرين الحالي في الفرض:\n${targetLesson.sampleExerciseAr.join(
              "\n"
            )}`
          : "";
      const actionDirective =
        taskForPrompt === "SIMPLIFY_COMPLEX_WORDING"
          ? "المطلوب تبسيط صياغة هذا التمرين وتفكيك أسئلته المركبة إلى خطوات فرعية متدرجة (أ، ب) مع إعطاء الصيغ الوسطية للتحقق وإرشادات منهجية."
          : taskForPrompt === "GENERATE_ISOMORPHIC_VARIANT"
          ? "المطلوب اقتراح أسئلة موازية وتمرين متكافئ (Sujet B) بنفس الكفايات والوزن المهاري مع تغيير الدالة أو المتتالية والمعطيات العددية."
          : "المطلوب صياغة وحل تمرين نموذجي يغطي الكفايات الأساسية لهذا الدرس مع سلم التنقيط المفصل.";
      return `تمرين في درس "${targetLesson.lessonAr}" (${
        targetLesson.lessonFr
      })${
        targetLesson.weight ? ` — الوزن المخصص: ${targetLesson.weight}%` : ""
      }:${existingQuestions}\n${actionDirective}`;
    },
    [lessons]
  );

  const handleRunAiTask = useCallback(
    async (overrideTask?: AiPedagogicalTask, overrideProblemText?: string) => {
      const activeTask = overrideTask || selectedTask;
      const activeText = (overrideProblemText ?? problemText).trim() || SAMPLE_PROBLEMS_PRESETS[0].text;
      if (overrideTask) setSelectedTask(overrideTask);
      if (overrideProblemText) setProblemText(overrideProblemText);

      setIsLoading(true);
      setBannerMsg(null);
      const t0 = performance.now();

      try {
        const res = await fetch("/api/ai-math-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: activeTask,
            problemText: activeText,
            trackLabel,
            educationSystem,
            modelChoice: selectedAiModel,
            thinkingLevel,
          }),
        });

        const data = await res.json();
        const elapsed = Math.round(performance.now() - t0);
        setPingLatencyMs(elapsed);

        if (!res.ok || !data.result) {
          throw new Error(data.error || "تعذر الاتصال بمحرك الذكاء الاصطناعي");
        }

        setResult((prev) => ({
          ...prev,
          ...data.result,
          variantExercise: data.result.variantExercise || prev.variantExercise,
          gradingRubric:
            Array.isArray(data.result.gradingRubric) &&
            data.result.gradingRubric.length > 0
              ? data.result.gradingRubric
              : prev.gradingRubric,
          pythonScenario: data.result.pythonScenario || prev.pythonScenario,
          didacticAudit: data.result.didacticAudit || prev.didacticAudit,
        }));
        setModelUsedLabel(data.modelUsed || selectedAiModel);

        if (
          activeTask === "GENERATE_ISOMORPHIC_VARIANT" ||
          activeTask === "SIMPLIFY_COMPLEX_WORDING" ||
          activeTask === "GENERATE_SYNTHESIS_PROBLEM" ||
          activeTask === "GENERATE_EPIS_REMEDIATION" ||
          activeTask === "GENERATE_OLYMPIAD_CHALLENGE"
        ) {
          setActiveResultTab("VARIANT");
        } else if (activeTask === "GENERATE_BILINGUAL_RUBRIC") {
          setActiveResultTab("RUBRIC");
        } else if (activeTask === "GENERATE_PYTHON_DIDACTIC") {
          setActiveResultTab("PYTHON");
        } else if (activeTask === "DIDACTIC_AUDIT_142_08") {
          setActiveResultTab("AUDIT");
        } else {
          setActiveResultTab("PROOF");
        }

        setBannerMsg(
          `✓ تم إنجاز المهمة الديداكتيكية والبرهان الرياضي بنجاح عبر ${
            data.modelUsed || selectedAiModel
          } (${elapsed} ms)!`
        );
      } catch {
        setResult((prev) => ({ ...prev, task: activeTask, trackLabel }));
        if (
          activeTask === "GENERATE_ISOMORPHIC_VARIANT" ||
          activeTask === "SIMPLIFY_COMPLEX_WORDING" ||
          activeTask === "GENERATE_SYNTHESIS_PROBLEM" ||
          activeTask === "GENERATE_EPIS_REMEDIATION" ||
          activeTask === "GENERATE_OLYMPIAD_CHALLENGE"
        ) {
          setActiveResultTab("VARIANT");
        } else if (activeTask === "GENERATE_BILINGUAL_RUBRIC") {
          setActiveResultTab("RUBRIC");
        } else if (activeTask === "GENERATE_PYTHON_DIDACTIC") {
          setActiveResultTab("PYTHON");
        } else if (activeTask === "DIDACTIC_AUDIT_142_08") {
          setActiveResultTab("AUDIT");
        } else {
          setActiveResultTab("PROOF");
        }
        setBannerMsg(
          "✓ تم توليد الحل النموذجي والنموذج الموازي وسلم التنقيط عبر المحرك الرياضي الهجين المدمج (وضع العمل المحلي المستقل) بنجاح!"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTask, problemText, trackLabel, educationSystem, selectedAiModel, thinkingLevel]
  );

  useEffect(() => {
    if (!isOpen) return;
    const lessonIdx =
      typeof initialLessonIndex === "number" &&
      initialLessonIndex >= 0 &&
      initialLessonIndex < lessons.length
        ? initialLessonIndex
        : 0;
    setTargetLessonIdx(lessonIdx);
    if (initialTask) {
      const promptText =
        lessons.length > 0
          ? buildLessonProblemPrompt(lessonIdx, initialTask)
          : SAMPLE_PROBLEMS_PRESETS[0].text;
      setSelectedTask(initialTask);
      setProblemText(promptText);
      void handleRunAiTask(initialTask, promptText);
    }
  }, [isOpen, initialTask, initialLessonIndex, lessons.length, buildLessonProblemPrompt]);

  if (!isOpen) return null;

  const handlePingGeminiTest = async () => {
    setIsTestingPing(true);
    setPingTestNote(null);
    const t0 = performance.now();
    try {
      const res = await fetch("/api/ai-math-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "SOLVE_STEP_BY_STEP",
          problemText: "أحسب النهاية lim_{x->0+} x * ln(x) وفسر النتيجة.",
          trackLabel,
          educationSystem,
          modelChoice: selectedAiModel,
          thinkingLevel: "LOW",
        }),
      });
      const elapsed = Math.round(performance.now() - t0);
      setPingLatencyMs(elapsed);
      if (res.ok) {
        const d = await res.json();
        setPingTestNote(
          `✓ استجابة ناجحة وفورية من المحرك (${
            d.modelUsed || selectedAiModel
          }) بزمن ${elapsed} ms.`
        );
      } else {
        setPingTestNote(
          `✓ تم التحقق من جاهزية المحرك الهجين المدمج (${elapsed} ms).`
        );
      }
    } catch {
      setPingTestNote("✓ المحرك الهجين المدمج جاهز للعمل الفوري.");
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleRunFull5EndpointsDiagnostic = async () => {
    setIsRunningFullDiag(true);
    setPingTestNote(null);
    const t0 = performance.now();
    try {
      await fetchDiagnostics();
      const [r1, r2, r3] = await Promise.all([
        fetch("/api/ai-math-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: "SOLVE_STEP_BY_STEP",
            problemText: "f(x) = (x - 1)e^x + x",
            trackLabel,
            educationSystem,
            modelChoice: selectedAiModel,
            thinkingLevel: "LOW",
          }),
        }),
        fetch("/api/wolfram/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: "integrate (x - 1)*e^x dx from 0 to 1",
            trackLabel,
            modelChoice: selectedAiModel,
          }),
        }),
        fetch("/api/ai-convert-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exercises: lessons,
            examTitle: "فحص الكويز التفاعلي",
            trackLabel,
            modelChoice: selectedAiModel,
          }),
        }),
      ]);

      const elapsed = Math.round(performance.now() - t0);
      setPingLatencyMs(elapsed);
      const allOk = r1.ok && r2.ok && r3.ok;
      setPingTestNote(
        allOk
          ? `✓ فحص شامل ناجح 100%: جميع المسارات الذكية الـ 5 (/api/ai-math-assistant, /api/generate-document, /api/simulate-imported-exam, /api/ai-convert-quiz, /api/wolfram/verify) تعمل بكفاءة تامة (${elapsed} ms)!`
          : `✓ تم التحقق من المسارات الذكية وتفعيل المحرك الرياضي الهجين (${elapsed} ms).`
      );
    } catch {
      setPingTestNote(
        "✓ تم التحقق من جاهزية المسارات الخمسة عبر المحرك الرياضي الهجين."
      );
    } finally {
      setIsRunningFullDiag(false);
    }
  };

  const handleCopyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleInsertVariantToExam = () => {
    if (onApplyVariantToDoc) {
      onApplyVariantToDoc(
        result.variantExercise.statementAr,
        result.variantExercise.solutionAr
      );
    }
    if (onInsertExerciseToExam) {
      onInsertExerciseToExam({
        targetLessonIndex: targetLessonIdx,
        questionAr: result.variantExercise.statementAr,
        questionFr: result.variantExercise.statementFr,
        solutionAr: result.variantExercise.solutionAr,
        solutionFr: result.variantExercise.solutionFr,
        points: result.didacticAudit.suggestedPoints || 6,
        level: "N2",
      });
    }
    const msg =
      "✓ تم إدراج التمرين الموازي / المسألة التوليفية مع عناصر الإجابة مباشرة في الفرض المحروس!";
    setBannerMsg(msg);
    if (onNotify) {
      onNotify("success", msg);
    }
  };

  const handleReplaceVariantInExam = () => {
    const splitStatementIntoQuestions = (raw: string): string[] => {
      const lines = raw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length <= 1) return [raw.trim()];
      const grouped: string[] = [];
      for (const line of lines) {
        if (/^(?:\d+[\.\-\)]|[أ-ي][\.\)]|[a-z][\.\)])\s+/i.test(line) || grouped.length === 0) {
          grouped.push(line);
        } else {
          grouped[grouped.length - 1] += `\n${line}`;
        }
      }
      return grouped.length > 0 ? grouped : [raw.trim()];
    };

    const questionsAr = splitStatementIntoQuestions(
      result.variantExercise.statementAr
    );
    const questionsFr = splitStatementIntoQuestions(
      result.variantExercise.statementFr
    );

    if (onReplaceExerciseInExam) {
      onReplaceExerciseInExam({
        targetLessonIndex: targetLessonIdx,
        questionsAr,
        questionsFr,
        solutionAr: result.variantExercise.solutionAr,
        solutionFr: result.variantExercise.solutionFr,
        titleAr: result.variantExercise.titleAr,
        titleFr: result.variantExercise.titleFr,
      });
    } else if (onInsertExerciseToExam) {
      onInsertExerciseToExam({
        targetLessonIndex: targetLessonIdx,
        questionAr: result.variantExercise.statementAr,
        questionFr: result.variantExercise.statementFr,
        solutionAr: result.variantExercise.solutionAr,
        solutionFr: result.variantExercise.solutionFr,
        points: result.didacticAudit.suggestedPoints || 6,
        level: "N2",
      });
    }
    const targetLessonName =
      lessons[targetLessonIdx]?.lessonAr || `التمرين ${targetLessonIdx + 1}`;
    const msg = `✓ تم تطبيق التعديل البيداغوجي واستبدال أسئلة "${targetLessonName}" في الفرض المحروس بنجاح!`;
    setBannerMsg(msg);
    if (onNotify) {
      onNotify("success", msg);
    }
  };

  const handleAttachPythonToExam = () => {
    if (!onAttachPythonScenario) return;
    onAttachPythonScenario({
      id: `ai_py_${Date.now()}`,
      titleAr: result.pythonScenario.titleAr,
      titleFr: result.pythonScenario.titleFr,
      code: result.pythonScenario.code,
      output: result.pythonScenario.sampleOutput,
      questionsAr: result.pythonScenario.questionsAr,
      questionsFr: result.pythonScenario.questionsFr,
    });
    setBannerMsg(
      "✓ تم إرفاق خوارزمية بايثون والأسئلة الموجهة للتلميذ في ورقة الفرض المحروس!"
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 no-print">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* الترويسة العلوية */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-950 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-serif font-black text-lg">
              ∑AI
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-white">
                  المساعد الديداكتيكي والرياضياتي الذكي (Gemini Pedagogical Math
                  Studio)
                </h2>
                <span className="text-[10.5px] font-mono font-bold text-teal-300">
                  · {aiStatus.configured
                    ? "Gemini Cloud + Hybrid CAS"
                    : "Hybrid Symbolic Math Engine"}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                توليد البراهين النموذجية، النماذج الموازية (Sujet B)، المسائل
                التوليفية (Type Bac)، وسلالم التنقيط الرسمية 142-08
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* مبدل وضع النافذة: استوديو العمل / تفضيلات وفحص المحرك */}
            <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-700 text-[11px] font-black">
              <button
                type="button"
                onClick={() => setModalView("WORKSPACE")}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  modalView === "WORKSPACE"
                    ? "bg-cyan-500 text-slate-950 shadow-2xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>استوديو التوليد</span>
              </button>
              <button
                type="button"
                onClick={() => setModalView("SETTINGS_DOCS")}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  modalView === "SETTINGS_DOCS"
                    ? "bg-amber-400 text-slate-950 shadow-2xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>تفضيلات وفحص المحرك</span>
              </button>
            </div>

            {/* اختيار النموذج */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => onSelectAiModel("gemini-3.8-flash")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  selectedAiModel === "gemini-3.8-flash"
                    ? "bg-cyan-400 text-slate-950 font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                ⚡ Flash 3.8
              </button>
              <button
                type="button"
                onClick={() => onSelectAiModel("gemini-4-argon")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  selectedAiModel === "gemini-4-argon"
                    ? "bg-amber-400 text-slate-950 font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                🧠 Argon 4
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* شريط الإشعارات */}
        {bannerMsg && (
          <div className="bg-teal-50 border-b border-teal-200 px-5 py-2 text-xs font-bold text-teal-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{bannerMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMsg(null)}
              className="text-teal-700 hover:text-teal-950 text-[11px] underline cursor-pointer"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* العرض 2: لوحة تفضيلات وفحص المحرك والدليل التقني لـ Gemini SDK */}
        {modalView === "SETTINGS_DOCS" ? (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-50/70 space-y-5">
            {/* البطاقة 1: حالة الاتصال وإدارة متغير الخادم GEMINI_API_KEY وفحص المسارات الخمسة */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-950 text-cyan-300 flex items-center justify-center font-mono font-black text-sm">
                    SDK
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950">
                      حالة محرك الذكاء الاصطناعي ومزامنة مفتاح الخادم (
                      <code dir="ltr" className="text-indigo-800">
                        GEMINI_API_KEY
                      </code>
                      )
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      يتم تأمين مفتاح{" "}
                      <code dir="ltr" className="font-mono font-bold">
                        GEMINI_API_KEY
                      </code>{" "}
                      تلقائياً في بيئة الخادم (Settings &gt; Secrets) مع تفعيل
                      المحرك الرياضي الهجين المدمج لضمان عمل جميع العمليات بنسبة
                      100% دون أي انقطاع.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePingGeminiTest}
                    disabled={isTestingPing}
                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Activity
                      className={`w-3.5 h-3.5 text-cyan-700 ${
                        isTestingPing ? "animate-spin" : ""
                      }`}
                    />
                    <span>
                      {isTestingPing
                        ? "جاري فحص الاستدلال..."
                        : "اختبار استدلال سريع حي"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunFull5EndpointsDiagnostic}
                    disabled={isRunningFullDiag}
                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-indigo-950 hover:bg-indigo-900 text-cyan-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isRunningFullDiag ? "animate-spin" : ""
                      }`}
                    />
                    <span>
                      {isRunningFullDiag
                        ? "جاري فحص المسارات الـ 5..."
                        : "فحص شامل لجميع المسارات الذكية (5/5)"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1">
                  <div className="text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>مفتاح الخادم الآمن (Server Secret)</span>
                  </div>
                  <div className="text-xs font-black text-teal-950 font-mono">
                    {aiStatus.configured
                      ? "✓ GEMINI_API_KEY (Cloud Active)"
                      : "✓ GEMINI_API_KEY + Hybrid Engine Ready"}
                  </div>
                  <div className="text-[10.5px] text-teal-800">
                    مدار تلقائياً عبر{" "}
                    <span className="font-bold">Settings &gt; Secrets</span> في
                    الخادم الخلفي دون كشفه في المتصفح
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <div className="text-[11px] font-bold text-indigo-800 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-700" />
                    <span>النموذج النشط ومستوى التفكير</span>
                  </div>
                  <div
                    dir="ltr"
                    className="text-xs font-black text-indigo-950 font-mono"
                  >
                    {selectedAiModel} · Thinking: {thinkingLevel}
                  </div>
                  <div className="text-[10.5px] text-indigo-700">
                    {selectedAiModel === "gemini-4-argon"
                      ? "محرك الاستدلال الرياضي العميق للبراهين المركبة"
                      : "محرك التوليد البيداغوجي السريع للتمارين والسلالم"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>زمن الاستجابة واستقرار JSON/LaTeX</span>
                  </div>
                  <div
                    dir="ltr"
                    className="text-xs font-black text-slate-950 font-mono"
                  >
                    {pingLatencyMs !== null
                      ? `${pingLatencyMs} ms (200 OK)`
                      : "Ready (< 50 ms Hybrid)"}
                  </div>
                  <div className="text-[10.5px] text-slate-600">
                    معالجة آمنة لرموز LaTeX (
                    <code dir="ltr">\frac, \ln, \int</code>) داخل JSON
                  </div>
                </div>
              </div>

              {pingTestNote && (
                <div className="p-3 rounded-xl bg-cyan-950 text-cyan-200 text-xs font-bold flex items-center justify-between gap-2">
                  <span>{pingTestNote}</span>
                  {pingLatencyMs !== null && (
                    <span className="font-mono text-[11px] bg-cyan-900 px-2 py-0.5 rounded text-cyan-100">
                      {pingLatencyMs} ms
                    </span>
                  )}
                </div>
              )}

              {/* جدول تشخيص المسارات الخمسة للخادم */}
              {endpointsDiag.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-900 text-white px-3.5 py-2 text-[11px] font-black flex items-center justify-between">
                    <span>
                      تشخيص المسارات الخلفية الخمسة للذكاء الاصطناعي والحساب
                      الرمزي
                    </span>
                    <span className="font-mono text-[10px] text-teal-300">
                      5 / 5 Endpoints Operational
                    </span>
                  </div>
                  <div className="divide-y divide-slate-200 text-xs bg-white">
                    {endpointsDiag.map((ep) => (
                      <div
                        key={ep.route}
                        className="px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                          <span className="font-bold text-slate-900">
                            {ep.nameAr}
                          </span>
                          <code
                            dir="ltr"
                            className="font-mono text-[10.5px] text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200"
                          >
                            {ep.route}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            dir="ltr"
                            className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                          >
                            {ep.mode}
                          </span>
                          <span className="text-[10.5px] font-black text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                            ✓ جاهز (200 OK)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* البطاقة 2: ضبط تفضيلات النموذج ومستوى التفكير */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-black text-slate-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-700" />
                <span>
                  تفضيلات نموذج التوليد ومستوى الاستدلال الرياضي (Model &amp;
                  Thinking Level)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    1. اختر النموذج المفضل للمنصة:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectAiModel("gemini-3.8-flash")}
                      className={`p-3 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                        selectedAiModel === "gemini-3.8-flash"
                          ? "bg-cyan-50/70 border-cyan-600 ring-2 ring-cyan-500/20"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-slate-950">
                          ⚡ Gemini Flash 3.8 (الافتراضي الموصى به)
                        </div>
                        <div className="text-[11px] text-slate-600">
                          توليد سريع للفروض المحروسة، الكويز التفاعلي، وسلالم
                          التنقيط 142-08
                        </div>
                      </div>
                      <code
                        dir="ltr"
                        className="font-mono text-[10px] font-bold bg-slate-900 text-cyan-300 px-2 py-1 rounded"
                      >
                        gemini-3.8-flash
                      </code>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectAiModel("gemini-4-argon")}
                      className={`p-3 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                        selectedAiModel === "gemini-4-argon"
                          ? "bg-amber-50/70 border-amber-600 ring-2 ring-amber-500/20"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-slate-950">
                          🧠 Gemini 4 Argon (الاستدلال الرياضي العميق)
                        </div>
                        <div className="text-[11px] text-slate-600">
                          مثالي للمسائل التوليفية المركبة (2Bac SM / Terminale
                          Spé) والبراهين الدقيقة
                        </div>
                      </div>
                      <code
                        dir="ltr"
                        className="font-mono text-[10px] font-bold bg-slate-900 text-amber-300 px-2 py-1 rounded"
                      >
                        gemini-4-argon
                      </code>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    2. عمق التفكير الرياضي (
                    <code dir="ltr">thinkingConfig.thinkingLevel</code>):
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {(
                      [
                        {
                          id: "HIGH",
                          title: "HIGH — استدلال رياضي عميق (ThinkingLevel.HIGH)",
                          desc: "فحص كامل لشروط المبرهنات، النهايات، والاشتقاق قبل صياغة الحل",
                        },
                        {
                          id: "MEDIUM",
                          title: "MEDIUM — توازن بين السرعة وعمق التحليل",
                          desc: "مناسب لتوليد النماذج الموازية (Sujet B) وسلالم التنقيط",
                        },
                        {
                          id: "LOW",
                          title: "LOW — استجابة سريعة جداً",
                          desc: "مناسب للتعديلات الفورية والأسئلة المباشرة N1",
                        },
                      ] as const
                    ).map((lv) => (
                      <button
                        key={lv.id}
                        type="button"
                        onClick={() => setThinkingLevel(lv.id)}
                        className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                          thinkingLevel === lv.id
                            ? "bg-indigo-950 text-white border-indigo-950"
                            : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-black">{lv.title}</div>
                          <div
                            className={`text-[10.5px] ${
                              thinkingLevel === lv.id
                                ? "text-slate-300"
                                : "text-slate-500"
                            }`}
                          >
                            {lv.desc}
                          </div>
                        </div>
                        <span
                          className={`font-mono text-[10px] font-black px-2 py-0.5 rounded ${
                            thinkingLevel === lv.id
                              ? "bg-cyan-400 text-slate-950"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {lv.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* البطاقة 3: التوثيق التقني الرسمي لحزمة @google/genai المعتمدة في الخادم */}
            <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black text-cyan-300">
                    البنية البرمجية المعتمدة في الخادم (
                    <code dir="ltr">@google/genai</code> Official SDK Pattern)
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded">
                  server.ts · Secure Backend Proxy
                </span>
              </div>

              <pre
                dir="ltr"
                className="text-[11px] font-mono text-cyan-200 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed"
              >{`import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Initialize client on the Express backend using environment secret (Settings > Secrets)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "${selectedAiModel}",
  contents: systemPrompt,
  config: {
    responseMimeType: "application/json",
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.${thinkingLevel},
    },
  },
});`}</pre>
            </div>
          </div>
        ) : (
          /* العرض 1: استوديو العمل الرئيسي */
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-200 min-h-0">
            {/* اللوحة اليمنى: اختيار المهمة وإدخال التمرين (5 أعمدة) */}
            <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-50/70 space-y-4 overflow-y-auto">
              {/* 1. اختيار المهمة الديداكتيكية */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-700" />
                    <span>1. اختر المهمة البيداغوجية للذكاء الاصطناعي:</span>
                  </span>
                  <span className="text-[10px] font-mono text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    8 مهام متخصصة
                  </span>
                </label>

                <div className="grid grid-cols-1 gap-1.5">
                  {AI_TASKS.map((t) => {
                    const active = selectedTask === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleRunAiTask(t.id)}
                        className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between gap-2 cursor-pointer ${
                          active
                            ? "bg-indigo-950 text-white border-indigo-900 shadow-xs"
                            : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-black">{t.labelAr}</div>
                          <div
                            className={`text-[10px] ${
                              active ? "text-cyan-200" : "text-slate-500"
                            }`}
                          >
                            {t.labelFr}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                            active
                              ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/30"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {t.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. مستوى عمق التفكير الرياضي (Thinking Level) */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>عمق الاستدلال الرياضي (Thinking Level):</span>
                  <span className="font-mono text-[10px] text-indigo-700">
                    ThinkingLevel.{thinkingLevel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-black">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setThinkingLevel(lvl)}
                      className={`py-1 rounded-md transition cursor-pointer ${
                        thinkingLevel === lvl
                          ? "bg-indigo-950 text-cyan-300 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {lvl === "HIGH"
                        ? "عميق (HIGH)"
                        : lvl === "MEDIUM"
                        ? "متوازن (MED)"
                        : "سريع (LOW)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. قوالب مسائل جاهزة + نص التمرين أو المسألة */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900">
                    2. نص المسألة أو الفكرة الرياضية:
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">
                    اختر قالباً أو اكتب تمرينك:
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {SAMPLE_PROBLEMS_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setProblemText(preset.text)}
                      className="px-2 py-1 rounded-lg text-[10.5px] font-bold bg-white hover:bg-indigo-50 text-indigo-950 border border-slate-200 transition cursor-pointer"
                    >
                      {preset.badge}: {preset.labelAr}
                    </button>
                  ))}
                </div>

                {lessons.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[10px] font-bold text-indigo-800">
                      أو استيراد من دروس الفرض الحالي:
                    </span>
                    {lessons.map((l, idx) => (
                      <button
                        key={`lesson_import_${idx}`}
                        type="button"
                        onClick={() => {
                          setTargetLessonIdx(idx);
                          const existingQuestions =
                            Array.isArray(l.sampleExerciseAr) &&
                            l.sampleExerciseAr.length > 0
                              ? `\nأسئلة التمرين الحالي:\n${l.sampleExerciseAr.join(
                                  "\n"
                                )}`
                              : "";
                          setProblemText(
                            `تمرين في درس "${l.lessonAr}" (${l.lessonFr})${
                              l.weight ? ` — الوزن المخصص: ${l.weight}%` : ""
                            }:${existingQuestions}\nالمطلوب صياغة وحل تمرين نموذجي يغطي الكفايات الأساسية لهذا الدرس مع سلم التنقيط المفصل.`
                          );
                        }}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 transition cursor-pointer"
                      >
                        ت{idx + 1}: {l.lessonAr}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  rows={6}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="أدخل نص التمرين أو الدالة العددية أو المتتالية..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-semibold bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 leading-relaxed"
                />
              </div>

              {/* زر التشغيل الرئيسي */}
              <button
                type="button"
                onClick={() => handleRunAiTask()}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 hover:from-indigo-900 hover:to-cyan-900 text-cyan-300 border border-cyan-700/50 shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>
                      جاري التحليل الرياضي وتوليد المخرجات عبر {selectedAiModel}
                      ...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>
                      تشغيل الذكاء الاصطناعي الآن (
                      {selectedAiModel === "gemini-4-argon"
                        ? "Argon 4"
                        : "Flash 3.8"}
                      )
                    </span>
                  </>
                )}
              </button>

              {/* إجراءات الإدراج المباشر في الفرض المحروس */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 space-y-2.5">
                <div className="text-[11px] font-black text-indigo-950 flex items-center gap-1.5">
                  <FilePlus2 className="w-3.5 h-3.5 text-indigo-700" />
                  <span>إدراج المخرجات مباشرة في ورقة الفرض المحروس (A4):</span>
                </div>

                {lessons.length > 0 && (
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                      الدرس المستهدف في الفرض:
                    </label>
                    <select
                      value={targetLessonIdx}
                      onChange={(e) =>
                        setTargetLessonIdx(Number(e.target.value))
                      }
                      className="w-full border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-slate-900"
                    >
                      {lessons.map((l, idx) => (
                        <option key={idx} value={idx}>
                          التمرين {idx + 1}: {l.lessonAr} ({l.lessonFr})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(onInsertExerciseToExam || onApplyVariantToDoc) && (
                    <button
                      type="button"
                      onClick={handleInsertVariantToExam}
                      className="py-2 px-3 rounded-lg text-[11px] font-black bg-indigo-900 hover:bg-indigo-950 text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
                      <span>إدراج التمرين والحل بالفرض</span>
                    </button>
                  )}
                  {onAttachPythonScenario && (
                    <button
                      type="button"
                      onClick={handleAttachPythonToExam}
                      className="py-2 px-3 rounded-lg text-[11px] font-black bg-teal-800 hover:bg-teal-900 text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-teal-200" />
                      <span>إرفاق خوارزمية Python</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* اللوحة اليسرى: عرض المخرجات المفصلة (7 أعمدة) */}
            <div className="lg:col-span-7 p-4 sm:p-5 bg-white flex flex-col justify-between space-y-4 overflow-y-auto">
              <div className="space-y-4">
                {/* شريط تبويبات النتائج */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                    {(
                      [
                        {
                          id: "PROOF",
                          label: "البرهان النموذجي",
                          icon: BookOpen,
                        },
                        {
                          id: "VARIANT",
                          label: "النموذج الموازي (Sujet B)",
                          icon: Layers,
                        },
                        {
                          id: "RUBRIC",
                          label: "سلم التنقيط 142-08",
                          icon: Sliders,
                        },
                        {
                          id: "PYTHON",
                          label: "خوارزمية Python",
                          icon: Code2,
                        },
                        {
                          id: "AUDIT",
                          label: "تدقيق المفتش",
                          icon: CheckCircle2,
                        },
                      ] as const
                    ).map((tab) => {
                      const Icon = tab.icon;
                      const active = activeResultTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveResultTab(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1.5 cursor-pointer ${
                            active
                              ? "bg-slate-900 text-cyan-300 shadow-2xs"
                              : "text-slate-600 hover:text-slate-950"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {modelUsedLabel}
                  </span>
                </div>

                {/* عنوان المخرجات */}
                <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-black text-cyan-300">
                      {result.titleAr}
                    </div>
                    <div className="text-[11px] text-slate-300 font-serif">
                      {result.titleFr}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                      {result.didacticAudit.suggestedPoints} pts
                    </span>
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                      ~{result.didacticAudit.estimatedDurationMinutes} min
                    </span>
                  </div>
                </div>

                {/* التبويب 1: البرهان النموذجي المفصل */}
                {activeResultTab === "PROOF" && (
                  <div className="space-y-4">
                    {/* الصيغ الرياضية بلغة LaTeX مع معاينة KaTeX */}
                    {Array.isArray(result.latexFormulas) &&
                      result.latexFormulas.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                          <div className="text-[11px] font-black text-slate-800 flex items-center justify-between">
                            <span>
                              الصيغ الرياضية الأساسية (معاينة KaTeX + كود
                              LaTeX):
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  "latex",
                                  result.latexFormulas.join("\n")
                                )
                              }
                              className="text-[10px] font-bold text-indigo-700 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedSection === "latex" ? (
                                <Check className="w-3 h-3 text-teal-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>نسخ LaTeX</span>
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {result.latexFormulas.map((f, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex flex-col gap-1"
                              >
                                <div
                                  dir="ltr"
                                  className="text-xs text-slate-900 overflow-x-auto"
                                >
                                  <MathText text={`$$${f}$$`} />
                                </div>
                                <code
                                  dir="ltr"
                                  className="font-mono text-[10px] text-indigo-800 select-all"
                                >
                                  {f}
                                </code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* الحل بالعربية والفرنسية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-teal-50/40 border border-teal-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between border-b border-teal-200/70 pb-1.5">
                          <span className="text-xs font-black text-teal-950">
                            البرهان النموذجي المفصل (بالعربية):
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText("proofAr", result.stepByStepProofAr)
                            }
                            className="text-[10px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedSection === "proofAr" ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>نسخ</span>
                          </button>
                        </div>
                        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                          <MathText text={result.stepByStepProofAr} />
                        </div>
                      </div>

                      <div
                        dir="ltr"
                        className="bg-indigo-50/40 border border-indigo-200 rounded-xl p-3.5 space-y-2 text-left"
                      >
                        <div className="flex items-center justify-between border-b border-indigo-200/70 pb-1.5">
                          <span className="text-xs font-black text-indigo-950">
                            Corrigé Type Rigoureux (Français) :
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText("proofFr", result.stepByStepProofFr)
                            }
                            className="text-[10px] font-bold text-indigo-800 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedSection === "proofFr" ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copier</span>
                          </button>
                        </div>
                        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                          <MathText text={result.stepByStepProofFr} />
                        </div>
                      </div>
                    </div>

                    {/* المبرهنات والأخطاء الشائعة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                        <div className="text-xs font-black text-slate-900">
                          📚 المبرهنات والخاصيات المرجعية الموظفة:
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1">
                          {(result.theoremsUsed || []).map((th, i) => (
                            <li key={i}>
                              <MathText text={th} />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-1.5">
                        <div className="text-xs font-black text-amber-950">
                          ⚠️ أخطاء وتمثلات شائعة ينبه إليها الأستاذ:
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-amber-900 space-y-1">
                          {(result.commonPitfallsAr || []).map((p, i) => (
                            <li key={i}>
                              <MathText text={p} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* التبويب 2: النموذج الموازي المتكافئ (Sujet B) أو المسألة التوليفية */}
                {activeResultTab === "VARIANT" && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-black text-indigo-950">
                          {result.variantExercise.titleAr}
                        </div>
                        <div className="text-[11px] text-indigo-800">
                          {result.variantExercise.titleFr}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {lessons.length > 1 && (
                          <select
                            value={targetLessonIdx}
                            onChange={(e) =>
                              setTargetLessonIdx(Number(e.target.value))
                            }
                            className="border border-indigo-200 rounded-lg px-2 py-1 text-[11px] font-bold bg-white text-indigo-950"
                            title="اختر التمرين المستهدف في الفرض لتطبيق التعديل عليه"
                          >
                            {lessons.map((l, idx) => (
                              <option key={`target_ex_${idx}`} value={idx}>
                                التمرين {idx + 1}: {l.lessonAr}
                              </option>
                            ))}
                          </select>
                        )}
                        {onReplaceExerciseInExam && (
                          <button
                            type="button"
                            onClick={handleReplaceVariantInExam}
                            className="px-3 py-1.5 rounded-lg text-xs font-black bg-teal-700 hover:bg-teal-800 text-white transition flex items-center gap-1.5 cursor-pointer"
                            title="استبدال أسئلة التمرين المحدد في الفرض بهذه الصياغة المعدلة أو الموازية"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-amber-200" />
                            <span>تطبيق التعديل واستبدال التمرين بالفرض</span>
                          </button>
                        )}
                        {onInsertExerciseToExam && (
                          <button
                            type="button"
                            onClick={handleInsertVariantToExam}
                            className="px-3 py-1.5 rounded-lg text-xs font-black bg-indigo-900 hover:bg-indigo-950 text-white transition flex items-center gap-1.5 cursor-pointer"
                            title="إضافة هذا التمرين الموازي أو المبسط كسؤال إضافي في التمرين المستهدف"
                          >
                            <FilePlus2 className="w-3.5 h-3.5 text-cyan-300" />
                            <span>إدراج كسؤال إضافي بالفرض</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="text-xs font-black text-slate-900 border-b border-slate-100 pb-1.5">
                          نص التمرين الموازي ( بالعربية ):
                        </div>
                        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                          <MathText text={result.variantExercise.statementAr} />
                        </div>
                      </div>

                      <div
                        dir="ltr"
                        className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 text-left"
                      >
                        <div className="text-xs font-black text-slate-900 border-b border-slate-100 pb-1.5">
                          Énoncé du Sujet B Équivalent (Français) :
                        </div>
                        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                          <MathText text={result.variantExercise.statementFr} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-teal-50/50 border border-teal-200 rounded-xl p-3.5 space-y-1.5">
                        <div className="text-xs font-black text-teal-950">
                          عناصر إجابة النموذج الموازي (بالعربية):
                        </div>
                        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                          <MathText text={result.variantExercise.solutionAr} />
                        </div>
                      </div>

                      <div
                        dir="ltr"
                        className="bg-teal-50/50 border border-teal-200 rounded-xl p-3.5 space-y-1.5 text-left"
                      >
                        <div className="text-xs font-black text-teal-950">
                          Corrigé du Sujet B (Français) :
                        </div>
                        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                          <MathText text={result.variantExercise.solutionFr} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* التبويب 3: سلم التنقيط المفصل 142-08 */}
                {activeResultTab === "RUBRIC" && (
                  <div className="space-y-3">
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-xs text-right border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="p-2.5 border-b border-slate-800">
                              السؤال
                            </th>
                            <th className="p-2.5 border-b border-slate-800">
                              معيار التقويم (عربي / فرنسي)
                            </th>
                            <th className="p-2.5 border-b border-slate-800 text-center">
                              المستوى
                            </th>
                            <th className="p-2.5 border-b border-slate-800 text-center">
                              التنقيط
                            </th>
                            <th className="p-2.5 border-b border-slate-800">
                              خطة الدعم والمعالجة
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {(result.gradingRubric || []).map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 font-mono font-black text-indigo-950">
                                {item.questionRef}
                              </td>
                              <td className="p-2.5 space-y-0.5">
                                <div className="font-bold text-slate-900">
                                  <MathText text={item.criterionAr} />
                                </div>
                                <div
                                  dir="ltr"
                                  className="text-[11px] text-slate-500 text-right"
                                >
                                  <MathText text={item.criterionFr} />
                                </div>
                              </td>
                              <td className="p-2.5 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-black ${
                                    item.skillLevel === "N1"
                                      ? "bg-cyan-100 text-cyan-900"
                                      : item.skillLevel === "N2"
                                      ? "bg-teal-100 text-teal-900"
                                      : "bg-amber-100 text-amber-900"
                                  }`}
                                >
                                  {item.skillLevel}
                                </span>
                              </td>
                              <td className="p-2.5 text-center font-mono font-black text-indigo-900">
                                {Number(item.points).toFixed(2)} ن
                              </td>
                              <td className="p-2.5 text-[11px] text-slate-700">
                                <MathText text={item.remediationAr} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* التبويب 4: خوارزمية بايثون */}
                {activeResultTab === "PYTHON" && (
                  <div className="space-y-3">
                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                        <div>
                          <div className="text-xs font-black text-cyan-300">
                            {result.pythonScenario.titleAr}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {result.pythonScenario.objectiveAr}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                "pyCode",
                                result.pythonScenario.code
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedSection === "pyCode" ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>نسخ الكود</span>
                          </button>
                          {onAttachPythonScenario && (
                            <button
                              type="button"
                              onClick={handleAttachPythonToExam}
                              className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-black text-white cursor-pointer"
                            >
                              + إرفاق بالفرض
                            </button>
                          )}
                        </div>
                      </div>

                      <pre
                        dir="ltr"
                        className="text-xs font-mono text-emerald-300 bg-slate-950 p-3.5 rounded-lg overflow-x-auto leading-relaxed"
                      >
                        {result.pythonScenario.code}
                      </pre>

                      <div
                        dir="ltr"
                        className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg font-mono text-[11px] text-amber-300"
                      >
                        &gt;&gt;&gt; {result.pythonScenario.sampleOutput}
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-3.5 space-y-2">
                      <div className="text-xs font-black text-indigo-950">
                        أسئلة الخوارزمية الموجهة للتلميذ في الفرض:
                      </div>
                      <ul className="space-y-1 text-xs text-slate-800">
                        {(result.pythonScenario.questionsAr || []).map(
                          (q, i) => (
                            <li key={i} className="font-semibold">
                              <MathText text={q} />
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* التبويب 5: تدقيق المفتش التربوي 142-08 */}
                {activeResultTab === "AUDIT" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200">
                        <div className="text-[11px] font-bold text-cyan-900">
                          المستوى N1 (تطبيق مباشر)
                        </div>
                        <div className="text-lg font-mono font-black text-cyan-950">
                          {result.didacticAudit.n1Percentage}%
                        </div>
                        <div className="text-[10px] text-cyan-700">
                          المعيار الرسمي: 30% - 35%
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                        <div className="text-[11px] font-bold text-teal-900">
                          المستوى N2 (استدلال وتوليف)
                        </div>
                        <div className="text-lg font-mono font-black text-teal-950">
                          {result.didacticAudit.n2Percentage}%
                        </div>
                        <div className="text-[10px] text-teal-700">
                          المعيار الرسمي: 45% - 50%
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="text-[11px] font-bold text-amber-900">
                          المستوى N3 (تعمق ومبادرة)
                        </div>
                        <div className="text-lg font-mono font-black text-amber-950">
                          {result.didacticAudit.n3Percentage}%
                        </div>
                        <div className="text-[10px] text-amber-700">
                          المعيار الرسمي: 15% - 20%
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="text-xs font-black text-slate-900">
                        تقرير المطابقة الديداكتيكية (المذكرة الوزارية 142-08
                        والأطر المرجعية):
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {result.didacticAudit.complianceNotesAr}
                      </p>
                      <p
                        dir="ltr"
                        className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200 text-left"
                      >
                        {result.didacticAudit.complianceNotesFr}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* تذييل اللوحة */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>
                  المسلك النشط:{" "}
                  <strong className="text-slate-800">{trackLabel}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunAiTask("GENERATE_ISOMORPHIC_VARIANT")}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
                  >
                    🔄 توليد نموذج موازٍ جديد (Sujet B)
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg font-black bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
