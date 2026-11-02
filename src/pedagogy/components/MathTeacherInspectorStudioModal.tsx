import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  FilePlus2,
  FileText,
  GitBranch,
  LineChart,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Wand2,
  X,
} from "lucide-react";
import {
  DSQuestionDensity,
  InsertedFigure,
  LessonItem,
  getVariantQuestions,
} from "../data/curriculum";
import { MathText } from "./MathRenderer";
import { Interactive3DSpaceCanvas } from "./Interactive3DSpaceCanvas";
import { ClassCouncilReportModal } from "./ClassCouncilReportModal";
import {
  DifferentiatedPathConfig,
  DoublePenaltyFinding,
  DoublePenaltyReformulationMode,
  LongitudinalCohortTrackerConfig,
  ParametricCloneTemplateId,
  SpaceGeometry3DPresetType,
  analyzeDidacticProgressionAndTimeBudget,
  checkSingleMathExpressionWithMathJS,
  computeLongitudinalInspectorAnalytics,
  detectDoublePenaltyInLessons,
  exportExamToMoodleXML,
  generate3DSpaceGeometryPresetData,
  generateFunctionVariationAndCurveData,
  generateIntegralShadedAreaData,
  generateParametricClonesWithMathJS,
  generateRecursiveSequenceCobwebData,
  generateSignTableAndDomainData,
  parseCohortGradesToCheckpointStats,
  runFullEdTechDocumentDiagnostics,
  validateCustomQuestionWithMathJS,
} from "../utils/mathjsValidator";

export type MathInspectorStudioTabId =
  | "MATHJS_VALIDATOR"
  | "SIGN_TABLE_STUDIO"
  | "INTEGRAL_AREA_STUDIO"
  | "SPACE_GEOMETRY_3D_STUDIO"
  | "FUNCTION_CURVE_STUDIO"
  | "COBWEB_SEQUENCE_STUDIO"
  | "DIFFERENTIATED_PATH"
  | "DOUBLE_PENALTY_DETECTOR"
  | "LONGITUDINAL_COHORT"
  | "EDTECH_DEV_STUDIO";

export interface MathTeacherInspectorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: MathInspectorStudioTabId;
  lessons: LessonItem[];
  trackCode: string;
  trackLabelAr: string;
  trackLabelFr: string;
  school?: string;
  prof?: string;
  year?: string;
  semester?: string;
  dsQuestionDensity: DSQuestionDensity;
  isFr: boolean;
  onUpdateCustomQuestions: (
    lessonKey: string,
    questionsAr: string[],
    questionsFr: string[]
  ) => void;
  onInsertFigureToExam: (fig: InsertedFigure) => void;
  differentiatedPathConfig: DifferentiatedPathConfig;
  onChangeDifferentiatedPathConfig: (cfg: DifferentiatedPathConfig) => void;
  longitudinalConfig: LongitudinalCohortTrackerConfig;
  onChangeLongitudinalConfig: (cfg: LongitudinalCohortTrackerConfig) => void;
  onNotify: (type: "success" | "info" | "error", text: string) => void;
}

const FUNCTION_PRESETS = [
  {
    labelAr: "كثيرة حدود من الدرجة 3 (مطارف ونقطة انعطاف)",
    expr: "x^3 - 3*x + 1",
    xMin: -2.5,
    xMax: 2.5,
    x0: 0.5,
  },
  {
    labelAr: "دالة لوغاريتمية وطنية (2 باك): x - 1 + ln(x)/x",
    expr: "x - 1 + log(x)/x",
    xMin: 0.3,
    xMax: 4,
    x0: 1,
  },
  {
    labelAr: "دالة أسية وطنية (2 باك): (x - 1)*exp(x) + 1",
    expr: "(x - 1)*exp(x) + 1",
    xMin: -2.5,
    xMax: 2,
    x0: 0,
  },
  {
    labelAr: "دالة جذرية (1 باك / جذع مشترك): (2*x - 1)/(x + 1)",
    expr: "(2*x - 1)/(x + 1)",
    xMin: -0.5,
    xMax: 4,
    x0: 1,
  },
];

const SEQUENCE_PRESETS = [
  {
    labelAr: "متتالية درج تزايدي: f(x) = sqrt(x + 2) ، u₀ = 0",
    expr: "sqrt(x + 2)",
    u0: 0,
    steps: 5,
    xMin: 0,
    xMax: 3,
  },
  {
    labelAr: "متتالية حلزونية متناوبة (Escargot): f(x) = 1 + 1/(x + 1)",
    expr: "1 + 1/(x + 1)",
    u0: 0.2,
    steps: 6,
    xMin: 0,
    xMax: 2.2,
  },
  {
    labelAr: "متتالية تآلفية متقاربة: f(x) = 0.5*x + 1.5 ، u₀ = 0.4",
    expr: "0.5*x + 1.5",
    u0: 0.4,
    steps: 5,
    xMin: 0,
    xMax: 3.5,
  },
  {
    labelAr: "متتالية لوغاريتمية: f(x) = ln(x + 2) ، u₀ = 0.2",
    expr: "log(x + 2)",
    u0: 0.2,
    steps: 5,
    xMin: 0,
    xMax: 2,
  },
];

const SIGN_TABLE_PRESETS = [
  {
    labelAr: "تعبير كسري (جذع مشترك / 1 باك): (x^2 - 4) / (x - 1)",
    num: "x^2 - 4",
    den: "x - 1",
  },
  {
    labelAr: "ثلاثية حدود من الدرجة 2: x^2 - 5*x + 6",
    num: "x^2 - 5*x + 6",
    den: "1",
  },
  {
    labelAr: "إشارة المشتقة الكسرية: (x^2 - 2*x - 3) / (x^2 - 1)",
    num: "x^2 - 2*x - 3",
    den: "x^2 - 1",
  },
  {
    labelAr: "متراجحة جذرية تناظرية: (-2*x + 6) / (x + 2)",
    num: "-2*x + 6",
    den: "x + 2",
  },
];

const INTEGRAL_AREA_PRESETS = [
  {
    labelAr: "مساحة تحت قطع مكافئ (2 باك): f(x) = -x^2 + 4 على [0, 2]",
    fExpr: "-x^2 + 4",
    gExpr: "0",
    a: 0,
    b: 2,
    xMin: -2.5,
    xMax: 3,
  },
  {
    labelAr: "مساحة بين منحنيين (C_f) و (C_g): f(x) = 4 - x^2 و g(x) = x + 2 على [-2, 1]",
    fExpr: "4 - x^2",
    gExpr: "x + 2",
    a: -2,
    b: 1,
    xMin: -3,
    xMax: 2.5,
  },
  {
    labelAr: "مساحة دالة أسية والمقارب المائل: f(x) = exp(x) و g(x) = x على [0, 1.5]",
    fExpr: "exp(x)",
    gExpr: "x",
    a: 0,
    b: 1.5,
    xMin: -1,
    xMax: 2.2,
  },
  {
    labelAr: "مساحة دالة لوغاريتمية: f(x) = log(x) على [1, 3]",
    fExpr: "log(x)",
    gExpr: "0",
    a: 1,
    b: 3,
    xMin: 0.4,
    xMax: 4,
  },
];

export const MathTeacherInspectorStudioModal: React.FC<
  MathTeacherInspectorStudioModalProps
> = ({
  isOpen,
  onClose,
  initialTab = "MATHJS_VALIDATOR",
  lessons,
  trackCode,
  trackLabelAr,
  trackLabelFr,
  school,
  prof,
  year,
  semester,
  dsQuestionDensity,
  isFr,
  onUpdateCustomQuestions,
  onInsertFigureToExam,
  differentiatedPathConfig,
  onChangeDifferentiatedPathConfig,
  longitudinalConfig,
  onChangeLongitudinalConfig,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<MathInspectorStudioTabId>(initialTab);

  // حالة التبويب 1: فاحص التعبيرات المباشر عبر MathJS
  const [liveTestQuestion, setLiveTestQuestion] = useState<string>(
    "نعتبر الدالة $f(x) = x^3 - 3x + 1$ المعرفة على $\\mathbb{R}$. بين أن $f'(x) = 3(x-1)(x+1)$."
  );
  const [directAlgebraInput, setDirectAlgebraInput] = useState<string>(
    "x^3 - 3*x + 1"
  );

  // حالة التبويب 2: مختبر الدوال وجدول التغيرات والمنحنى (مقترح الأستاذ 1)
  const [fnExpr, setFnExpr] = useState<string>("x^3 - 3*x + 1");
  const [fnXMin, setFnXMin] = useState<number>(-2.5);
  const [fnXMax, setFnXMax] = useState<number>(2.5);
  const [fnTangentX0, setFnTangentX0] = useState<number>(0.5);
  const [targetExerciseIdxFn, setTargetExerciseIdxFn] = useState<number>(0);
  const [copiedTikzFn, setCopiedTikzFn] = useState<boolean>(false);

  // حالة التبويب 3: مختبر المتتاليات الترجعية u_{n+1}=f(u_n) (مقترح الأستاذ 2)
  const [seqExpr, setSeqExpr] = useState<string>("sqrt(x + 2)");
  const [seqU0, setSeqU0] = useState<number>(0);
  const [seqSteps, setSeqSteps] = useState<number>(5);
  const [seqXMin, setSeqXMin] = useState<number>(0);
  const [seqXMax, setSeqXMax] = useState<number>(3);
  const [targetExerciseIdxSeq, setTargetExerciseIdxSeq] = useState<number>(0);
  const [copiedTikzSeq, setCopiedTikzSeq] = useState<boolean>(false);

  // حالة مقترح الأستاذ الجديد 1: مولد جدول الإشارة ومجموعة التعريف الآلي (D_f)
  const [signNumExpr, setSignNumExpr] = useState<string>("x^2 - 4");
  const [signDenExpr, setSignDenExpr] = useState<string>("x - 1");
  const [targetExerciseIdxSign, setTargetExerciseIdxSign] = useState<number>(0);
  const [copiedTikzSign, setCopiedTikzSign] = useState<boolean>(false);

  // حالة مقترح الأستاذ الجديد 2: مختبر التكامل والمساحات المظللة بين منحنيين
  const [intFExpr, setIntFExpr] = useState<string>("-x^2 + 4");
  const [intGExpr, setIntGExpr] = useState<string>("0");
  const [intABound, setIntABound] = useState<number>(0);
  const [intBBound, setIntBBound] = useState<number>(2);
  const [intXMin, setIntXMin] = useState<number>(-2.5);
  const [intXMax, setIntXMax] = useState<number>(3);
  const [intUnitIcm, setIntUnitIcm] = useState<number>(2);
  const [intUnitJcm, setIntUnitJcm] = useState<number>(2);
  const [targetExerciseIdxInt, setTargetExerciseIdxInt] = useState<number>(0);
  const [copiedTikzInt, setCopiedTikzInt] = useState<boolean>(false);

  // حالة مقترح الأستاذ الجديد 3: مكتبة الأشكال الهندسية الفضائية الجاهزة (3D Wireframe SVG)
  const [spacePresetType, setSpacePresetType] =
    useState<SpaceGeometry3DPresetType>("CUBE");
  const [spaceParamA, setSpaceParamA] = useState<number>(4);
  const [spaceParamB, setSpaceParamB] = useState<number>(2);
  const [spaceShowSection, setSpaceShowSection] = useState<boolean>(true);
  const [targetExerciseIdxSpace, setTargetExerciseIdxSpace] = useState<number>(0);
  const [showCouncilReportModal, setShowCouncilReportModal] = useState<boolean>(false);
  const [viewMode3D, setViewMode3D] = useState<"INTERACTIVE_CANVAS" | "SVG">("INTERACTIVE_CANVAS");
  const [copiedTikzSpace, setCopiedTikzSpace] = useState<boolean>(false);

  // حالات إضافية لتحسين النقطة 2 و 3 للمفتش التربوي
  const [selectedReformulationMode, setSelectedReformulationMode] =
    useState<DoublePenaltyReformulationMode>("MONTRER_QUE");
  const [targetOfficialDurationMin, setTargetOfficialDurationMin] =
    useState<number>(120);
  const [rawMassarGradesInput, setRawMassarGradesInput] = useState<string>(
    "15.5 ; 14.25 ; 16.0 ; 12.5 ; 11.75 ; 13.0 ; 9.5 ; 8.25 ; 10.5 ; 14.5 ; 7.5 ; 11.0 ; 13.5 ; 15.0 ; 9.0 ; 12.0"
  );
  const [targetMassarCheckpointIdx, setTargetMassarCheckpointIdx] =
    useState<number>(1); // 0=DS1, 1=DS2, 2=DS3

  // حالات مقترحات مطور البرامج التربوية (EdTech Dev Studio)
  const [cloneTemplateId, setCloneTemplateId] =
    useState<ParametricCloneTemplateId>("RATIONAL_ANALYSIS");
  const [cloneSeed, setCloneSeed] = useState<number>(2026);
  const [selectedCloneVariantIdx, setSelectedCloneVariantIdx] =
    useState<number>(0);
  const [targetExerciseIdxClone, setTargetExerciseIdxClone] =
    useState<number>(0);
  const [copiedMoodleXml, setCopiedMoodleXml] = useState<boolean>(false);

  // فحص شامل لكافة أسئلة الفرض عبر MathJS
  const allExamQuestionsAudit = useMemo(() => {
    return lessons.map((lesson, exIdx) => {
      const lessonKey = `${trackCode}_${lesson.lessonFr}`;
      const { questionsAr, questionsFr } = getVariantQuestions(
        lesson,
        "A",
        false,
        0,
        dsQuestionDensity
      );
      const arChecks = questionsAr.map((q) => validateCustomQuestionWithMathJS(q));
      const frChecks = questionsFr.map((q) => validateCustomQuestionWithMathJS(q));
      return {
        exIdx,
        lesson,
        lessonKey,
        questionsAr,
        questionsFr,
        arChecks,
        frChecks,
      };
    });
  }, [lessons, trackCode, dsQuestionDensity]);

  const liveQuestionCheck = useMemo(
    () => validateCustomQuestionWithMathJS(liveTestQuestion),
    [liveTestQuestion]
  );

  const directAlgebraCheck = useMemo(
    () => checkSingleMathExpressionWithMathJS(directAlgebraInput),
    [directAlgebraInput]
  );

  // بيانات التبويب 2 (الدالة وجدول التغيرات والمنحنى)
  const functionCurveData = useMemo(
    () =>
      generateFunctionVariationAndCurveData(
        fnExpr,
        fnXMin,
        fnXMax,
        fnTangentX0
      ),
    [fnExpr, fnXMin, fnXMax, fnTangentX0]
  );

  // بيانات التبويب 3 (المتتالية الترجعية والإنشاء الهندسي)
  const sequenceCobwebData = useMemo(
    () =>
      generateRecursiveSequenceCobwebData(
        seqExpr,
        seqU0,
        seqSteps,
        seqXMin,
        seqXMax
      ),
    [seqExpr, seqU0, seqSteps, seqXMin, seqXMax]
  );

  // بيانات التبويب 5 (مدقق العقوبة المزدوجة للمفتش التربوي)
  const doublePenaltyFindings: DoublePenaltyFinding[] = useMemo(() => {
    return detectDoublePenaltyInLessons(lessons, (lesson) =>
      getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity)
    );
  }, [lessons, dsQuestionDensity]);

  // بيانات النقطة 2 للمفتش التربوي: التدرج الديداكتيكي N1->N2->N3 وميزانية الزمن (1×3) وتجزئة سلم التنقيط (0.25 ن)
  const didacticProgressionReport = useMemo(() => {
    return analyzeDidacticProgressionAndTimeBudget(
      lessons,
      (lesson) => getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity),
      targetOfficialDurationMin
    );
  }, [lessons, dsQuestionDensity, targetOfficialDurationMin]);

  // بيانات النقطة 3 للمفتش التربوي: مبيان التطور الطولي SVG ومؤشر نجاعة الدعم ومعامل التجانس CV
  const longitudinalAnalytics = useMemo(() => {
    return computeLongitudinalInspectorAnalytics(longitudinalConfig);
  }, [longitudinalConfig]);

  // تحليل لائحة نقط مسار وتصنيف المتعلمين إلى 3 مجموعات دعم
  const parsedMassarStats = useMemo(() => {
    return parseCohortGradesToCheckpointStats(rawMassarGradesInput);
  }, [rawMassarGradesInput]);

  // بيانات مطور البرامج التربوية 1: النماذج البارامترية المتكافئة A/B/C/D عبر MathJS
  const parametricClones = useMemo(() => {
    return generateParametricClonesWithMathJS(cloneTemplateId, cloneSeed);
  }, [cloneTemplateId, cloneSeed]);

  // بيانات مطور البرامج التربوية 2: تشخيص كثافة الصفحة A4 وسلامة محددات LaTeX وشجرة MathJS AST
  const edtechDiagnostics = useMemo(() => {
    return runFullEdTechDocumentDiagnostics(
      lessons,
      (lesson) => getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity),
      longitudinalConfig.includeInPrintablePreview
    );
  }, [lessons, dsQuestionDensity, longitudinalConfig.includeInPrintablePreview]);

  // بيانات مطور البرامج التربوية 3: تصدير Moodle XML المعياري
  const moodleXmlOutput = useMemo(() => {
    return exportExamToMoodleXML(
      `Devoir_Surveille_${trackCode}`,
      trackCode,
      lessons,
      (lesson) => getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity)
    );
  }, [lessons, trackCode, dsQuestionDensity]);

  // بيانات مقترح الأستاذ الجديد 1: جدول الإشارة ومجموعة التعريف الآلي
  const signTableData = useMemo(
    () => generateSignTableAndDomainData(signNumExpr, signDenExpr, -10, 10),
    [signNumExpr, signDenExpr]
  );

  // بيانات مقترح الأستاذ الجديد 2: التكامل والمساحة المظللة بين منحنيين
  const integralAreaData = useMemo(
    () =>
      generateIntegralShadedAreaData(
        intFExpr,
        intGExpr,
        intABound,
        intBBound,
        intXMin,
        intXMax,
        intUnitIcm,
        intUnitJcm
      ),
    [
      intFExpr,
      intGExpr,
      intABound,
      intBBound,
      intXMin,
      intXMax,
      intUnitIcm,
      intUnitJcm,
    ]
  );

  // بيانات مقترح الأستاذ الجديد 3: الهندسة الفضائية 3D Wireframe SVG
  const spaceGeometryData = useMemo(
    () =>
      generate3DSpaceGeometryPresetData(
        spacePresetType,
        spaceParamA,
        spaceParamB,
        spaceShowSection
      ),
    [spacePresetType, spaceParamA, spaceParamB, spaceShowSection]
  );

  if (!isOpen) return null;

  // إصلاح وتنقية جميع الأسئلة المخصصة في الفرض عبر MathJS بنقرة واحدة
  const handleAutoSanitizeAllExamQuestions = () => {
    let fixedCount = 0;
    allExamQuestionsAudit.forEach((item) => {
      const hasChanges =
        item.arChecks.some((c) => c.wasAutoFixed) ||
        item.frChecks.some((c) => c.wasAutoFixed);
      if (hasChanges) {
        fixedCount++;
        onUpdateCustomQuestions(
          item.lessonKey,
          item.arChecks.map((c) => c.sanitizedText),
          item.frChecks.map((c) => c.sanitizedText)
        );
      }
    });
    onNotify(
      "success",
      fixedCount > 0
        ? `تم إصلاح وتنقية الصيغ الرياضية في ${fixedCount} تمارين بنجاح بواسطة مكتبة MathJS قبل عرضها في معاينة الورقة!`
        : "جميع التعبيرات الرياضية في أسئلة الفرض سليمة ومتوازنة 100% وفق فحص MathJS!"
    );
  };

  // إدراج منحنى الدالة وجدول التغيرات في ورقة الفرض
  const handleInsertFunctionCurveFigure = () => {
    if (!functionCurveData.isValid || !functionCurveData.svgContent) return;
    const targetLesson = lessons[targetExerciseIdxFn] || lessons[0];
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      functionCurveData.svgContent
    )}`;
    const fig: InsertedFigure = {
      id: `mathjs_fn_${Date.now()}`,
      titleAr: `جدول التغيرات والمنحنى البياني (C_f) للدالة f(x) = ${functionCurveData.simplifiedExpr}`,
      titleFr: `Tableau de variations et courbe (C_f) de f(x) = ${functionCurveData.simplifiedExpr}`,
      dataUrl: svgDataUrl,
      caption: isFr
        ? `Généré via MathJS : f'(x) = ${functionCurveData.symbolicDerivative} | Tangente (T) en x₀=${functionCurveData.tangentX0} : ${functionCurveData.tangentEquation}`
        : `تمثيل مبياني مولد بدقة عبر MathJS: f'(x) = ${functionCurveData.symbolicDerivative} | معادلة المماس (T) عند x₀=${functionCurveData.tangentX0}: ${functionCurveData.tangentEquation}`,
      showCaption: true,
      borderStyle: "academic",
      exerciseId: `ex_${targetExerciseIdxFn}`,
      widthPercent: 85,
      alignment: "center",
    };
    onInsertFigureToExam(fig);
    onNotify(
      "success",
      `تم إدراج جدول التغيرات والمنحنى (C_f) للدالة في التمرين ${targetExerciseIdxFn + 1} (${targetLesson?.lessonAr || ""}) داخل ورقة الفرض!`
    );
  };

  // إدراج سؤال دراسة الدالة المولدة بـ MathJS مباشرة في التمرين المختار
  const handleInjectFunctionQuestionIntoExercise = () => {
    const targetLesson = lessons[targetExerciseIdxFn] || lessons[0];
    if (!targetLesson) return;
    const lessonKey = `${trackCode}_${targetLesson.lessonFr}`;
    const current = getVariantQuestions(
      targetLesson,
      "A",
      false,
      0,
      dsQuestionDensity
    );
    const nextNum = current.questionsAr.length + 1;
    const qAr = `${nextNum}. نعتبر الدالة $f(x) = ${functionCurveData.simplifiedExpr}$ على $[${functionCurveData.xMin}, ${functionCurveData.xMax}]$. بين أن $f'(x) = ${functionCurveData.symbolicDerivative}$، ثم أنشئ جدول تغيرات $f$ ومعادلة المماس $(T): ${functionCurveData.tangentEquation}$ عند $x_0 = ${functionCurveData.tangentX0}$.`;
    const qFr = `${nextNum}. Soit $f(x) = ${functionCurveData.simplifiedExpr}$ sur $[${functionCurveData.xMin}, ${functionCurveData.xMax}]$. Montrer que $f'(x) = ${functionCurveData.symbolicDerivative}$, dresser le tableau de variations de $f$ et vérifier que la tangente $(T)$ en $x_0 = ${functionCurveData.tangentX0}$ a pour équation $${functionCurveData.tangentEquation}$.`;
    onUpdateCustomQuestions(
      lessonKey,
      [...current.questionsAr, qAr],
      [...current.questionsFr, qFr]
    );
    onNotify(
      "success",
      `تم إدراج سؤال دراسة الدالة ومشتقتها الرمزية f'(x) = ${functionCurveData.symbolicDerivative} في التمرين ${targetExerciseIdxFn + 1}!`
    );
  };

  // إدراج الإنشاء الهندسي للمتتالية الترجعية u_{n+1}=f(u_n) في ورقة الفرض
  const handleInsertSequenceCobwebFigure = () => {
    if (!sequenceCobwebData.isValid || !sequenceCobwebData.svgContent) return;
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      sequenceCobwebData.svgContent
    )}`;
    const fig: InsertedFigure = {
      id: `mathjs_seq_${Date.now()}`,
      titleAr: `الإنشاء الهندسي لحدود المتتالية الترجعية u_{n+1} = f(u_n) مع u₀ = ${sequenceCobwebData.u0}`,
      titleFr: `Construction géométrique de la suite récurrente u_{n+1} = f(u_n) avec u₀ = ${sequenceCobwebData.u0}`,
      dataUrl: svgDataUrl,
      caption: isFr
        ? `${sequenceCobwebData.behaviorLabelFr} — Premiers termes : ${sequenceCobwebData.terms.slice(0, 5).map((t, i) => `u_${i}=${t}`).join(" ; ")}`
        : `${sequenceCobwebData.behaviorLabelAr} — الحدود الأولى: ${sequenceCobwebData.terms.slice(0, 5).map((t, i) => `u_${i}=${t}`).join(" ، ")}${sequenceCobwebData.fixedPointApprox !== null ? ` | النهاية ℓ ≈ ${sequenceCobwebData.fixedPointApprox}` : ""}`,
      showCaption: true,
      borderStyle: "academic",
      exerciseId: `ex_${targetExerciseIdxSeq}`,
      widthPercent: 80,
      alignment: "center",
    };
    onInsertFigureToExam(fig);
    onNotify(
      "success",
      `تم إدراج مخطط الإنشاء الهندسي للمتتالية الترجعية (${sequenceCobwebData.behaviorType === "ESCARGOT" ? "حلزون Escargot" : "درج Escalier"}) في التمرين ${targetExerciseIdxSeq + 1}!`
    );
  };

  // إصلاح موضع عقوبة مزدوجة واحد أو جميع المواضع حسب النمط الديداكتيكي المختار (MONTRER_QUE / ADMETTRE_RESULTAT / QUESTION_TREMPLIN)
  const handleFixSingleDoublePenalty = (
    finding: DoublePenaltyFinding,
    modeOverride?: DoublePenaltyReformulationMode
  ) => {
    const mode = modeOverride || selectedReformulationMode;
    const targetLesson = lessons[finding.exerciseIndex];
    if (!targetLesson) return;
    const lessonKey = `${trackCode}_${targetLesson.lessonFr}`;
    const current = getVariantQuestions(
      targetLesson,
      "A",
      false,
      0,
      dsQuestionDensity
    );
    const nextAr = [...current.questionsAr];
    const nextFr = [...current.questionsFr];
    const chosen = finding.repairedByMode?.[mode] || {
      ar: finding.repairedQuestionAr,
      fr: finding.repairedQuestionFr,
    };
    nextAr[finding.questionIndex] = chosen.ar;
    nextFr[finding.questionIndex] = chosen.fr;
    onUpdateCustomQuestions(lessonKey, nextAr, nextFr);
    onNotify(
      "success",
      `تم إصلاح صياغة السؤال (${finding.questionIndex + 1}) في التمرين (${finding.exerciseIndex + 1}) بنمط «${mode === "MONTRER_QUE" ? "بين أن" : mode === "ADMETTRE_RESULTAT" ? "صمام القبول" : "سؤال مرحلي أ/ب"}» لمنع العقوبة المزدوجة!`
    );
  };

  const handleFixAllDoublePenalties = () => {
    if (doublePenaltyFindings.length === 0) return;
    const byEx: Record<number, DoublePenaltyFinding[]> = {};
    doublePenaltyFindings.forEach((f) => {
      if (!byEx[f.exerciseIndex]) byEx[f.exerciseIndex] = [];
      byEx[f.exerciseIndex].push(f);
    });

    Object.entries(byEx).forEach(([exIdxStr, list]) => {
      const exIdx = Number(exIdxStr);
      const lesson = lessons[exIdx];
      if (!lesson) return;
      const lessonKey = `${trackCode}_${lesson.lessonFr}`;
      const current = getVariantQuestions(
        lesson,
        "A",
        false,
        0,
        dsQuestionDensity
      );
      const nextAr = [...current.questionsAr];
      const nextFr = [...current.questionsFr];
      list.forEach((f) => {
        const chosen = f.repairedByMode?.[selectedReformulationMode] || {
          ar: f.repairedQuestionAr,
          fr: f.repairedQuestionFr,
        };
        nextAr[f.questionIndex] = chosen.ar;
        nextFr[f.questionIndex] = chosen.fr;
      });
      onUpdateCustomQuestions(lessonKey, nextAr, nextFr);
    });

    onNotify(
      "success",
      `تمت إعادة صياغة ${doublePenaltyFindings.length} أسئلة وسطية تلقائياً بنمط «${selectedReformulationMode === "MONTRER_QUE" ? "بين أن / Montrer que" : selectedReformulationMode === "ADMETTRE_RESULTAT" ? "صمام القبول / Admettre" : "سؤال مرحلي أ/ب / Tremplin"}»!`
    );
  };

  // إعادة ترتيب أسئلة التمرين تصاعدياً حسب التدرج الديداكتيكي (N1 -> N2 -> N3) بنقرة واحدة
  const handleReorderExerciseQuestionsByProgression = (
    exIdx: number,
    recommendedOrderIndices: number[]
  ) => {
    const lesson = lessons[exIdx];
    if (!lesson) return;
    const lessonKey = `${trackCode}_${lesson.lessonFr}`;
    const current = getVariantQuestions(
      lesson,
      "A",
      false,
      0,
      dsQuestionDensity
    );
    const reorderedAr = recommendedOrderIndices.map((oldIdx, newIdx) => {
      const raw = current.questionsAr[oldIdx] || "";
      const stripped = raw.replace(/^\s*[0-9]+[\.\-\)]\s*/, "");
      return `${newIdx + 1}. ${stripped}`;
    });
    const reorderedFr = recommendedOrderIndices.map((oldIdx, newIdx) => {
      const raw = current.questionsFr[oldIdx] || "";
      const stripped = raw.replace(/^\s*[0-9]+[\.\-\)]\s*/, "");
      return `${newIdx + 1}. ${stripped}`;
    });
    onUpdateCustomQuestions(lessonKey, reorderedAr, reorderedFr);
    onNotify(
      "success",
      `تمت إعادة ترتيب أسئلة التمرين ${exIdx + 1} (${lesson.lessonAr}) تصاعدياً من N1 (استرداد) إلى N2 (تطبيق) ثم N3 (توليف)!`
    );
  };

  // تطبيق الإحصائيات المستخرجة من لائحة نقط مسار على الفرض المختار (DS1 أو DS2 أو DS3)
  const handleApplyMassarGradesToCheckpoint = () => {
    if (parsedMassarStats.validCount === 0) return;
    const nextCheckpoints = [...longitudinalConfig.checkpoints] as LongitudinalCohortTrackerConfig["checkpoints"];
    const targetCp = nextCheckpoints[targetMassarCheckpointIdx];
    if (!targetCp) return;

    const updatedCp = {
      ...targetCp,
      meanScore20: parsedMassarStats.meanScore,
      stdDeviation: parsedMassarStats.stdDev,
      masteryAPct: parsedMassarStats.acquisPercent,
      masteryECAPct: parsedMassarStats.enCoursPercent,
      masteryNAPct: parsedMassarStats.nonAcquisPercent,
      inspectorObservationAr: parsedMassarStats.triageSummaryAr,
    };
    nextCheckpoints[targetMassarCheckpointIdx] = updatedCp;

    onChangeLongitudinalConfig({
      ...longitudinalConfig,
      checkpoints: nextCheckpoints,
    });

    onNotify(
      "success",
      `تم استيراد ${parsedMassarStats.validCount} نقطة من لائحة القسم وتحديث مؤشرات ${updatedCp.dsCode} وتصنيف مجموعات الدعم الثلاث!`
    );
  };

  // إدراج مبيان التطور الطولي للفوج (DS1 -> DS2 -> DS3) كشكل SVG في التقرير/الفرض
  const handleInsertLongitudinalChartFigure = () => {
    if (!longitudinalAnalytics.svgEvolutionChart) return;
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      longitudinalAnalytics.svgEvolutionChart
    )}`;
    const fig: InsertedFigure = {
      id: `inspector_cohort_svg_${Date.now()}`,
      titleAr: `المبيان التطوري الطولي لمكتسبات الفوج (${longitudinalConfig.cohortName}) عبر DS1 ← DS2 ← DS3`,
      titleFr: `Évolution longitudinale des acquis de la cohorte (${longitudinalConfig.cohortName}) : DS1 → DS2 → DS3`,
      dataUrl: svgDataUrl,
      caption: isFr
        ? longitudinalAnalytics.inspectorVisaStatusFr
        : longitudinalAnalytics.inspectorVisaStatusAr,
      showCaption: true,
      borderStyle: "academic",
      exerciseId: "ex_0",
      widthPercent: 85,
      alignment: "center",
    };
    onInsertFigureToExam(fig);
    onNotify(
      "success",
      "تم إدراج مبيان التطور الطولي للفوج (SVG) مع خلاصة تأشيرة المفتش التربوي في ورقة الفرض!"
    );
  };

  // إدراج النموذج البارامتري المتكافئ (A أو B أو C أو D) المولد عبر MathJS في التمرين المختار
  const handleInjectParametricCloneIntoExercise = (variantIdx: number) => {
    const clone = parametricClones[variantIdx];
    const targetLesson = lessons[targetExerciseIdxClone] || lessons[0];
    if (!clone || !targetLesson) return;
    const lessonKey = `${trackCode}_${targetLesson.lessonFr}`;
    const qArLines = clone.questionAr
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const qFrLines = clone.questionFr
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    onUpdateCustomQuestions(lessonKey, qArLines, qFrLines);
    onNotify(
      "success",
      `تم حقن النموذج البارامتري المتكافئ [Modèle ${clone.variantCode} — Seed ${clone.seedUsed}] في التمرين ${targetExerciseIdxClone + 1} (${targetLesson.lessonAr})!`
    );
  };

  // تحميل ملف Moodle XML المعياري لمنصات التعليم الإلكتروني
  const handleDownloadMoodleXmlFile = () => {
    const blob = new Blob([moodleXmlOutput], {
      type: "application/xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Moodle_Bank_${trackCode}_DS.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify(
      "success",
      "تم تصدير بنك أسئلة الفرض بصيغة Moodle XML المعيارية (مدعومة بـ MathJax وسلم التنقيط)!"
    );
  };

  // إدراج جدول الإشارة ومجموعة التعريف كشكل SVG في ورقة الفرض
  const handleInsertSignTableFigure = () => {
    if (!signTableData.isValid || !signTableData.svgSignTable) return;
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      signTableData.svgSignTable
    )}`;
    const fig: InsertedFigure = {
      id: `mathjs_sign_${Date.now()}`,
      titleAr: `جدول إشارة التعبير ${signTableData.numeratorExpr}${signTableData.hasDenominator ? ` / (${signTableData.denominatorExpr})` : ""}`,
      titleFr: `Tableau de signes de ${signTableData.numeratorExpr}${signTableData.hasDenominator ? ` / (${signTableData.denominatorExpr})` : ""}`,
      dataUrl: svgDataUrl,
      caption: isFr
        ? `Domaine : ${signTableData.domainLatex} | S(E ≥ 0) = ${signTableData.solutionNonNegLatex}`
        : `مجموعة التعريف: ${signTableData.domainLatex} | حلول المتراجحة E(x) ≥ 0: S = ${signTableData.solutionNonNegLatex}`,
      showCaption: true,
      borderStyle: "academic",
      exerciseId: `ex_${targetExerciseIdxSign}`,
      widthPercent: 85,
      alignment: "center",
    };
    onInsertFigureToExam(fig);
    onNotify(
      "success",
      `تم إدراج جدول الإشارة الأكاديمي (مع القيم الممنوعة || والجذور) في التمرين ${targetExerciseIdxSign + 1}!`
    );
  };

  // إدراج سؤال جدول الإشارة ومجموعة التعريف في التمرين المختار
  const handleInjectSignTableQuestion = () => {
    const targetLesson = lessons[targetExerciseIdxSign] || lessons[0];
    if (!targetLesson || !signTableData.isValid) return;
    const lessonKey = `${trackCode}_${targetLesson.lessonFr}`;
    const current = getVariantQuestions(
      targetLesson,
      "A",
      false,
      0,
      dsQuestionDensity
    );
    const nextNum = current.questionsAr.length + 1;
    const qAr = `${nextNum}. ${signTableData.suggestedQuestionAr.replace(/\n/g, " ")}`;
    const qFr = `${nextNum}. ${signTableData.suggestedQuestionFr.replace(/\n/g, " ")}`;
    onUpdateCustomQuestions(
      lessonKey,
      [...current.questionsAr, qAr],
      [...current.questionsFr, qFr]
    );
    onNotify(
      "success",
      `تم إدراج سؤال مجموعة التعريف وجدول الإشارة والمتراجحة في التمرين ${targetExerciseIdxSign + 1}!`
    );
  };

  // إدراج مبيان التكامل والمساحة المظللة كشكل SVG في ورقة الفرض
  const handleInsertIntegralAreaFigure = () => {
    if (!integralAreaData.isValid || !integralAreaData.svgPlotWithShadedArea) return;
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      integralAreaData.svgPlotWithShadedArea
    )}`;
    const fig: InsertedFigure = {
      id: `mathjs_int_${Date.now()}`,
      titleAr: `الحيز المستوي المظلل بين (C_f) و ${integralAreaData.gExpr === "0" ? "محور الأفاصيل" : "(C_g)"} على [${integralAreaData.aBound}, ${integralAreaData.bBound}]`,
      titleFr: `Domaine plan hachuré entre (C_f) et ${integralAreaData.gExpr === "0" ? "(Ox)" : "(C_g)"} sur [${integralAreaData.aBound}, ${integralAreaData.bBound}]`,
      dataUrl: svgDataUrl,
      caption: isFr
        ? `Aire géométrique A = ${integralAreaData.geometricAreaUA} u.a. = ${integralAreaData.geometricAreaCm2} cm² (||i||=${integralAreaData.unitIcm}cm, ||j||=${integralAreaData.unitJcm}cm)`
        : `المساحة الهندسية للحيز المظلل: A = ${integralAreaData.geometricAreaUA} u.a. = ${integralAreaData.geometricAreaCm2} cm² (||i||=${integralAreaData.unitIcm}cm, ||j||=${integralAreaData.unitJcm}cm)`,
      showCaption: true,
      borderStyle: "academic",
      exerciseId: `ex_${targetExerciseIdxInt}`,
      widthPercent: 80,
      alignment: "center",
    };
    onInsertFigureToExam(fig);
    onNotify(
      "success",
      `تم إدراج مبيان التكامل والحيز المظلل (${integralAreaData.geometricAreaCm2} cm²) في التمرين ${targetExerciseIdxInt + 1}!`
    );
  };

  // إدراج سؤال حساب التكامل والمساحة المظللة في التمرين المختار
  const handleInjectIntegralQuestion = () => {
    const targetLesson = lessons[targetExerciseIdxInt] || lessons[0];
    if (!targetLesson || !integralAreaData.isValid) return;
    const lessonKey = `${trackCode}_${targetLesson.lessonFr}`;
    const current = getVariantQuestions(
      targetLesson,
      "A",
      false,
      0,
      dsQuestionDensity
    );
    const nextNum = current.questionsAr.length + 1;
    const qAr = `${nextNum}. ${integralAreaData.suggestedQuestionAr.replace(/\n/g, " ")}`;
    const qFr = `${nextNum}. ${integralAreaData.suggestedQuestionFr.replace(/\n/g, " ")}`;
    onUpdateCustomQuestions(
      lessonKey,
      [...current.questionsAr, qAr],
      [...current.questionsFr, qFr]
    );
    onNotify(
      "success",
      `تم إدراج سؤال حساب التكامل والمساحة المظللة بالـ cm² في التمرين ${targetExerciseIdxInt + 1}!`
    );
  };

  // إدراج مجسم الهندسة الفضائية 3D Wireframe SVG في ورقة الفرض
  const handleInsertSpaceGeometryFigure = () => {
    if (!spaceGeometryData.svgWireframe) return;
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      spaceGeometryData.svgWireframe
    )}`;
    const fig: InsertedFigure = {
      id: `mathjs_3d_${Date.now()}`,
      titleAr: spaceGeometryData.titleAr.replace(/\$/g, ""),
      titleFr: spaceGeometryData.titleFr.replace(/\$/g, ""),
      dataUrl: svgDataUrl,
      caption: isFr
        ? spaceGeometryData.keyMetricsSummaryFr.replace(/\$/g, "")
        : spaceGeometryData.keyMetricsSummaryAr.replace(/\$/g, ""),
      showCaption: true,
      borderStyle: "academic",
      exerciseId: `ex_${targetExerciseIdxSpace}`,
      widthPercent: 75,
      alignment: "center",
    };
    onInsertFigureToExam(fig);
    onNotify(
      "success",
      `تم إدراج المجسم الفضائي ثلاثي الأبعاد (${spaceGeometryData.presetType}) في التمرين ${targetExerciseIdxSpace + 1}!`
    );
  };

  // إدراج تمرين/سؤال الهندسة الفضائية في التمرين المختار
  const handleInjectSpaceGeometryQuestion = () => {
    const targetLesson = lessons[targetExerciseIdxSpace] || lessons[0];
    if (!targetLesson) return;
    const lessonKey = `${trackCode}_${targetLesson.lessonFr}`;
    const current = getVariantQuestions(
      targetLesson,
      "A",
      false,
      0,
      dsQuestionDensity
    );
    const nextNum = current.questionsAr.length + 1;
    const qAr = `${nextNum}. ${spaceGeometryData.suggestedQuestionAr.replace(/\n/g, " ")}`;
    const qFr = `${nextNum}. ${spaceGeometryData.suggestedQuestionFr.replace(/\n/g, " ")}`;
    onUpdateCustomQuestions(
      lessonKey,
      [...current.questionsAr, qAr],
      [...current.questionsFr, qFr]
    );
    onNotify(
      "success",
      `تم إدراج سؤال الهندسة الفضائية المتكامل في التمرين ${targetExerciseIdxSpace + 1}!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs no-print">
      <div
        dir="rtl"
        className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-6xl max-h-[93vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* الترويسة العلوية */}
        <div className="p-4 sm:p-5 bg-gradient-to-l from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center font-mono text-base font-black shadow-md">
              f′(x)
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-cyan-300 font-bold">
                <span>مختبر MathJS الرمزي</span>
                <span aria-hidden="true">·</span>
                <span>مقترحات أستاذ المادة</span>
                <span aria-hidden="true">·</span>
                <span>مقترحات المفتش التربوي (النقطة 2 و 3 المطورة)</span>
                <span aria-hidden="true">·</span>
                <span>مقترحات مطور البرامج التربوية (EdTech Studio)</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                أستوديو التحقق الجبري (MathJS) ومختبر الأستاذ والمفتش التربوي ومطور البرامج — {isFr ? trackLabelFr : trackLabelAr}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* شريط التبويبات الـ 10 (شاملاً مقترحات المفتش 2 و 3 المطورة ومختبر مطور البرامج التربوية) */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1.5 shrink-0">
          {[
            {
              id: "DOUBLE_PENALTY_DETECTOR" as MathInspectorStudioTabId,
              label: "نقطة المفتش 2: العقوبة المزدوجة والتدرج 1×3",
              badge: `فحص (${doublePenaltyFindings.length})`,
              icon: Stethoscope,
            },
            {
              id: "LONGITUDINAL_COHORT" as MathInspectorStudioTabId,
              label: "نقطة المفتش 3: التتبع الطولي ومبيان مسار",
              badge: `نجاعة ${longitudinalAnalytics.netRemediationEfficiencyScore}%`,
              icon: TrendingUp,
            },
            {
              id: "EDTECH_DEV_STUDIO" as MathInspectorStudioTabId,
              label: "مقترحات مطور البرامج التربوية",
              badge: "A/B/C/D + Moodle XML",
              icon: Code2,
            },
            {
              id: "SIGN_TABLE_STUDIO" as MathInspectorStudioTabId,
              label: "جدول الإشارة ومجموعة التعريف D_f",
              badge: "مقترح أستاذ 1",
              icon: Wand2,
            },
            {
              id: "INTEGRAL_AREA_STUDIO" as MathInspectorStudioTabId,
              label: "التكامل والمساحات المظللة",
              badge: "مقترح أستاذ 2",
              icon: Sparkles,
            },
            {
              id: "SPACE_GEOMETRY_3D_STUDIO" as MathInspectorStudioTabId,
              label: "الهندسة الفضائية 3D SVG",
              badge: "مقترح أستاذ 3",
              icon: Play,
            },
            {
              id: "MATHJS_VALIDATOR" as MathInspectorStudioTabId,
              label: "مدقق التعبيرات MathJS",
              badge: "MathJS AST",
              icon: ShieldCheck,
            },
            {
              id: "FUNCTION_CURVE_STUDIO" as MathInspectorStudioTabId,
              label: "منحنى (C_f) وجدول التغيرات",
              badge: "مختبر الدوال",
              icon: LineChart,
            },
            {
              id: "COBWEB_SEQUENCE_STUDIO" as MathInspectorStudioTabId,
              label: "المتتاليات u_{n+1}=f(u_n)",
              badge: "الإنشاء الهندسي",
              icon: RefreshCw,
            },
            {
              id: "DIFFERENTIATED_PATH" as MathInspectorStudioTabId,
              label: "المسار الفارقي (أ/ب)",
              badge: "بيداغوجيا فارقية",
              icon: GitBranch,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-cyan-300 shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/90"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* جسم الأستوديو القابل للتمرير */}
        <div className="p-4 sm:p-6 overflow-y-auto studio-scroll flex-1 space-y-5">
          {/* ================================================================
              التبويب 1: أداة التحقق من سلامة التعبيرات الرياضية في الأسئلة المخصصة باستخدام mathjs
             ================================================================ */}
          {activeTab === "MATHJS_VALIDATOR" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-l from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-cyan-950">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>
                      محرك التحقق الجبري والرمزي (MathJS Parser + Symbolic Derivative + Sanitizer) قبل العرض في المعاينة
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    يفحص هذا المحرك جميع الصيغ الرياضية المكتوبة داخل الأسئلة المخصصة (توازن الأقواس والحاضنات، محددات LaTeX، القسمة على صفر، سلامة شجرة AST الجبرية في MathJS، والاشتقاق الرمزي التلقائي) وينقيها تلقائياً قبل عرضها في الورقة.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoSanitizeAllExamQuestions}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                >
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  <span>فحص وإصلاح جميع أسئلة الفرض تلقائياً (MathJS)</span>
                </button>
              </div>

              {/* مختبر الفحص الفوري لسؤال مخصص أو صيغة جبرية */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <label className="block text-xs font-black text-slate-900">
                    اختبار سؤال مخصص (مع صيغ $...$ أو معادلات) قبل عرضه في الورقة:
                  </label>
                  <textarea
                    rows={3}
                    value={liveTestQuestion}
                    onChange={(e) => setLiveTestQuestion(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder="أدخل نص السؤال المخصص مع الصيغ الرياضية مثل $f(x) = ...$"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                        liveQuestionCheck.isValid && !liveQuestionCheck.hasWarnings
                          ? "bg-emerald-100 text-emerald-950 border border-emerald-300"
                          : "bg-amber-100 text-amber-950 border border-amber-300"
                      }`}
                    >
                      {liveQuestionCheck.isValid && !liveQuestionCheck.hasWarnings ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      )}
                      <span>
                        {liveQuestionCheck.isValid && !liveQuestionCheck.hasWarnings
                          ? "التعبيرات الرياضية سليمة 100% (Valid MathJS AST)"
                          : `تم رصد ${liveQuestionCheck.issues.length} ملاحظة/إصلاح تلقائي`}
                      </span>
                    </span>

                    {liveQuestionCheck.wasAutoFixed && (
                      <button
                        type="button"
                        onClick={() => setLiveTestQuestion(liveQuestionCheck.sanitizedText)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs cursor-pointer"
                      >
                        تطبيق النص المُصحح تلقائياً
                      </button>
                    )}
                  </div>

                  {/* معاينة العرض النهائي بعد التنقية */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">
                      معاينة العرض الآمن في الورقة بعد تنقية MathJS :
                    </div>
                    <div className="text-xs text-slate-900 leading-relaxed">
                      <MathText text={liveQuestionCheck.sanitizedText} />
                    </div>
                  </div>

                  {liveQuestionCheck.issues.length > 0 && (
                    <div className="space-y-1.5">
                      {liveQuestionCheck.issues.map((iss, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg text-[11px] font-medium border ${
                            iss.type === "ERROR"
                              ? "bg-rose-50 border-rose-200 text-rose-950"
                              : iss.type === "WARNING"
                              ? "bg-amber-50 border-amber-200 text-amber-950"
                              : "bg-emerald-50 border-emerald-200 text-emerald-950"
                          }`}
                        >
                          {isFr ? iss.messageFr : iss.messageAr}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* محلل التعبير الجبري المباشر عبر MathJS */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <label className="block text-xs font-black text-slate-900">
                    محلل الصيغة الجبرية والمشتقة الرمزية المباشر (MathJS Symbolic Engine):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={directAlgebraInput}
                    onChange={(e) => setDirectAlgebraInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder="e.g. (2*x - 1)/(x + 1) or x^2 * log(x)"
                  />

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10.5px] text-slate-500 block">
                        حالة التحليل النحوي (parse):
                      </span>
                      <span
                        className={`font-mono font-black ${
                          directAlgebraCheck.isValid ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {directAlgebraCheck.isValid
                          ? `✓ Valid (${directAlgebraCheck.astType})`
                          : `✗ ${directAlgebraCheck.errorMessage}`}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10.5px] text-slate-500 block">
                        التبسيط الجبري (simplify):
                      </span>
                      <span className="font-mono font-black text-slate-900" dir="ltr">
                        {directAlgebraCheck.simplified || "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10.5px] text-slate-500 block">
                        المشتقة الرمزية (derivative w.r.t x):
                      </span>
                      <span className="font-mono font-black text-indigo-800" dir="ltr">
                        {directAlgebraCheck.symbolicDerivativeX || "—"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10.5px] text-slate-500 block">
                        التقييم العددي عند x = 1:
                      </span>
                      <span className="font-mono font-black text-teal-800" dir="ltr">
                        {directAlgebraCheck.sampleEvalAt1 ?? "غير معرف عند 1"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* جدول نتائج تدقيق جميع أسئلة التمارين الحالية في الفرض */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-black flex items-center justify-between">
                  <span>تقرير فحص MathJS لكافة أسئلة التمارين المدرجة في الفرض الحالي</span>
                  <span className="font-mono text-cyan-300 text-[11px]">
                    {allExamQuestionsAudit.length} تمارين مفحوصة
                  </span>
                </div>
                <div className="divide-y divide-slate-200 max-h-72 overflow-y-auto studio-scroll">
                  {allExamQuestionsAudit.map((exAudit) => (
                    <div key={exAudit.lessonKey} className="p-3.5 space-y-2">
                      <div className="font-black text-xs text-slate-900 flex items-center justify-between">
                        <span>
                          التمرين {exAudit.exIdx + 1} : {exAudit.lesson.lessonAr} ({exAudit.lesson.lessonFr})
                        </span>
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {exAudit.arChecks.filter((c) => c.isValid).length} / {exAudit.arChecks.length} أسئلة سليمة
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {exAudit.arChecks.map((chk, qIdx) => (
                          <div
                            key={qIdx}
                            className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80"
                          >
                            <div className="flex-1 text-slate-800">
                              <span className="font-mono font-bold text-indigo-900 ml-1.5">
                                س{qIdx + 1}:
                              </span>
                              <MathText text={chk.sanitizedText} />
                            </div>
                            <span
                              className={`font-mono text-[10.5px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                chk.isValid && !chk.hasWarnings
                                  ? "bg-emerald-100 text-emerald-900"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {chk.isValid && !chk.hasWarnings
                                ? `MathJS ✓ (${chk.expressionsChecked.length} صيغ)`
                                : "تم الإصلاح التلقائي ✓"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              التبويب 2: مقترح أستاذ المادة رقم 1 — مولد منحنيات الدوال وجداول التغيرات (MathJS + TikZ + SVG)
             ================================================================ */}
          {activeTab === "FUNCTION_CURVE_STUDIO" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-700">قوالب دوال جاهزة:</span>
                {FUNCTION_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFnExpr(p.expr);
                      setFnXMin(p.xMin);
                      setFnXMax(p.xMax);
                      setFnTangentX0(p.x0);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-[11px] font-bold text-slate-800 transition cursor-pointer"
                  >
                    {p.labelAr}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    تعبير الدالة $f(x)$ (يدعم `x^3`, `log(x)`, `exp(x)`, `sqrt(x)`):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={fnExpr}
                    onChange={(e) => setFnExpr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    المجال x_min :
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={fnXMin}
                    onChange={(e) => setFnXMin(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    المجال x_max :
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={fnXMax}
                    onChange={(e) => setFnXMax(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    نقطة المماس x₀ :
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={fnTangentX0}
                    onChange={(e) => setFnTangentX0(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {functionCurveData.isValid ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* المعاينة البصرية لجدول التغيرات والمنحنى */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-900">
                        المعاينة المتزامنة: جدول التغيرات + المنحنى (C_f) والمماس (T)
                      </span>
                      <span className="font-mono text-[11px] text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200" dir="ltr">
                        f'(x) = {functionCurveData.symbolicDerivative}
                      </span>
                    </div>

                    <div
                      className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
                      dangerouslySetInnerHTML={{ __html: functionCurveData.svgContent }}
                    />

                    {/* أزرار الإدراج الفوري في ورقة الفرض */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">التمرين المستهدف:</span>
                        <select
                          value={targetExerciseIdxFn}
                          onChange={(e) => setTargetExerciseIdxFn(Number(e.target.value))}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold"
                        >
                          {lessons.map((l, idx) => (
                            <option key={idx} value={idx}>
                              التمرين {idx + 1}: {l.lessonAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleInjectFunctionQuestionIntoExercise}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <FilePlus2 className="w-3.5 h-3.5 text-indigo-700" />
                          <span>إضافة سؤال دراسة الدالة للتمرين</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleInsertFunctionCurveFigure}
                          className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 text-cyan-400" />
                          <span>إدراج الجدول والمنحنى في ورقة الفرض</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* كود TikZ / PGFPlots / tkz-tab الجاهز للنسخ */}
                  <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Code2 className="w-4 h-4" />
                        <span>كود LaTeX / TikZ (`tkz-tab` + `pgfplots`)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(functionCurveData.tikzLatexCode);
                          setCopiedTikzFn(true);
                          setTimeout(() => setCopiedTikzFn(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-200 text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTikzFn ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTikzFn ? "تم النسخ" : "نسخ كود TikZ"}</span>
                      </button>
                    </div>
                    <pre
                      dir="ltr"
                      className="p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[380px] studio-scroll leading-relaxed"
                    >
                      {functionCurveData.tikzLatexCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold">
                  تعذر تحليل الدالة: {functionCurveData.errorMessage}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              التبويب 3: مقترح أستاذ المادة رقم 2 — مختبر المتتاليات الترجعية u_{n+1}=f(u_n)
             ================================================================ */}
          {activeTab === "COBWEB_SEQUENCE_STUDIO" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-700">أمثلة متتاليات ترجعية قياسية:</span>
                {SEQUENCE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSeqExpr(p.expr);
                      setSeqU0(p.u0);
                      setSeqSteps(p.steps);
                      setSeqXMin(p.xMin);
                      setSeqXMax(p.xMax);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 text-[11px] font-bold text-slate-800 transition cursor-pointer"
                  >
                    {p.labelAr}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    الدالة المرفقة $f(x)$ :
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={seqExpr}
                    onChange={(e) => setSeqExpr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    الحد الأول $u_0$ :
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={seqU0}
                    onChange={(e) => setSeqU0(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    عدد الحدود $N$ :
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={9}
                    value={seqSteps}
                    onChange={(e) => setSeqSteps(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    بداية المجال x_min :
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={seqXMin}
                    onChange={(e) => setSeqXMin(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    نهاية المجال x_max :
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={seqXMax}
                    onChange={(e) => setSeqXMax(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {sequenceCobwebData.isValid && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-900">
                        {sequenceCobwebData.behaviorLabelAr}
                      </span>
                      {sequenceCobwebData.fixedPointApprox !== null && (
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                          النقطة الصامدة / النهاية: ℓ ≈ {sequenceCobwebData.fixedPointApprox}
                        </span>
                      )}
                    </div>

                    <div
                      className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
                      dangerouslySetInnerHTML={{ __html: sequenceCobwebData.svgContent }}
                    />

                    {/* جدول القيم العددية للحدود */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {sequenceCobwebData.terms.map((val, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900 font-bold"
                          dir="ltr"
                        >
                          u_{idx} = {val}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">إدراج في:</span>
                        <select
                          value={targetExerciseIdxSeq}
                          onChange={(e) => setTargetExerciseIdxSeq(Number(e.target.value))}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold"
                        >
                          {lessons.map((l, idx) => (
                            <option key={idx} value={idx}>
                              التمرين {idx + 1}: {l.lessonAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleInsertSequenceCobwebFigure}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-cyan-400" />
                        <span>إدراج الإنشاء الهندسي للمتتالية في ورقة الفرض</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Code2 className="w-4 h-4" />
                        <span>كود TikZ للإنشاء الهندسي (`Escalier / Escargot`)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(sequenceCobwebData.tikzLatexCode);
                          setCopiedTikzSeq(true);
                          setTimeout(() => setCopiedTikzSeq(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-200 text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTikzSeq ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTikzSeq ? "تم النسخ" : "نسخ كود TikZ"}</span>
                      </button>
                    </div>
                    <pre
                      dir="ltr"
                      className="p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[380px] studio-scroll leading-relaxed"
                    >
                      {sequenceCobwebData.tikzLatexCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              التبويب 4: مقترح أستاذ المادة رقم 3 — المسارات الفارقية (البيداغوجيا الفارقية) وسؤال التميز (+1 ن) داخل الورقة
             ================================================================ */}
          {activeTab === "DIFFERENTIATED_PATH" && (
            <div className="space-y-4">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 max-w-3xl">
                  <div className="text-xs font-black text-indigo-950 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-indigo-700" />
                    <span>
                      البيداغوجيا الفارقية داخل نفس ورقة الفرض (Parcours au choix : Piste Guidée vs Piste Experte + Question Bonus)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    يتيح هذا الخيار للتلميذ اختيار طريقة معالجة السؤال التوليفي الأخير بحسب وتيرته: إما اتباع <strong>المسار الموجه بأسئلة وسيطة متدرجة (Piste Guidée)</strong> أو <strong>المسار المفتوح المباشر (Piste Experte)</strong> لنفس الحصة النقطية ({differentiatedPathConfig.pointsAllocated} ن)، مع إمكانية إضافة <strong>سؤال التميز الاختياري (+1 ن Bonus)</strong>.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-indigo-300 text-xs font-black text-indigo-950 cursor-pointer shadow-2xs">
                    <input
                      type="checkbox"
                      checked={differentiatedPathConfig.enabled}
                      onChange={(e) =>
                        onChangeDifferentiatedPathConfig({
                          ...differentiatedPathConfig,
                          enabled: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-indigo-700 rounded"
                    />
                    <span>إدراج إطار المسار الفارقي في ورقة الفرض</span>
                  </label>
                  <label className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-black text-amber-950 cursor-pointer shadow-2xs">
                    <input
                      type="checkbox"
                      checked={differentiatedPathConfig.includeBonusQuestion}
                      onChange={(e) =>
                        onChangeDifferentiatedPathConfig({
                          ...differentiatedPathConfig,
                          includeBonusQuestion: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-amber-600 rounded"
                    />
                    <span>إدراج سؤال التميز الاختياري (+1.00 ن Bonus)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-black text-teal-900">
                    المسار الأول (Piste A — المسار الموجه بأسئلة وسيطة):
                  </div>
                  {differentiatedPathConfig.guidedStepsAr.map((step, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const next = [...differentiatedPathConfig.guidedStepsAr];
                          next[sIdx] = e.target.value;
                          onChangeDifferentiatedPathConfig({
                            ...differentiatedPathConfig,
                            guidedStepsAr: next,
                          });
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-black text-indigo-900">
                    المسار الثاني (Piste B — المسار الخبير المفتوح):
                  </div>
                  <textarea
                    rows={3}
                    value={differentiatedPathConfig.expertPromptAr}
                    onChange={(e) =>
                      onChangeDifferentiatedPathConfig({
                        ...differentiatedPathConfig,
                        expertPromptAr: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs"
                  />

                  <div className="text-xs font-black text-amber-900 pt-1">
                    سؤال التميز الاختياري (Question Bonus +{differentiatedPathConfig.bonusPoints} ن):
                  </div>
                  <textarea
                    rows={2}
                    value={differentiatedPathConfig.bonusQuestionAr}
                    onChange={(e) =>
                      onChangeDifferentiatedPathConfig({
                        ...differentiatedPathConfig,
                        bonusQuestionAr: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-amber-300 bg-amber-50/40 p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              التبويب 5: مقترح المفتش التربوي رقم 2 (مطور) —
              1) مدقق "العقوبة المزدوجة" بـ 3 أنماط إصلاح ديداكتيكية (بين أن / صمام القبول / سؤال مرحلي أ-ب)
              2) مدقق التدرج الديداكتيكي (N1 -> N2 -> N3) وميزانية الزمن بقاعدة المفتش (1×3) وتجزئة سلم التنقيط بالربع نقطة (0.25 ن)
             ================================================================ */}
          {activeTab === "DOUBLE_PENALTY_DETECTOR" && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1 max-w-3xl">
                    <div className="text-xs font-black text-amber-950 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-amber-700" />
                      <span>
                        النقطة 2 من مقترحات المفتش التربوي: مدقق "العقوبة المزدوجة" (Double Peine) + التدرج الديداكتيكي وميزانية الزمن (1×3)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      يرصد هذا المدقق الأسئلة الوسطية المفتوحة التي يتوقف عليها باقي التمرين، ويتيح تحويلها بنقرة واحدة وفق <strong>3 صيغ ديداكتيكية معتمدة</strong>، بالإضافة إلى فحص التدرج المعرفي (<MathText text="$N_1 \to N_2 \to N_3$" />) وتقدير زمن الإنجاز بقاعدة المفتش (<MathText text="$1 \times 3$" />) وتفكيك سلم التنقيط بالربع نقطة (<MathText text="$0.25\text{ pt}$" />).
                    </p>
                  </div>

                  {doublePenaltyFindings.length > 0 && (
                    <button
                      type="button"
                      onClick={handleFixAllDoublePenalties}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>
                        إصلاح جميع مواضع العقوبة المزدوجة ({doublePenaltyFindings.length}) بنقرة واحدة
                      </span>
                    </button>
                  )}
                </div>

                {/* اختيار نمط إعادة الصياغة البيداغوجي المفضل لدى المفتش */}
                <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] font-black text-amber-950">
                    اختر نمط المعالجة الديداكتيكية لمنع العقوبة المزدوجة:
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        {
                          mode: "MONTRER_QUE" as DoublePenaltyReformulationMode,
                          label: "1) صيغة «بين أن... / Montrer que» (تحقق ذاتي عبر MathJS)",
                        },
                        {
                          mode: "ADMETTRE_RESULTAT" as DoublePenaltyReformulationMode,
                          label: "2) صيغة «صمام القبول / Admettre le résultat» للاستمرارية",
                        },
                        {
                          mode: "QUESTION_TREMPLIN" as DoublePenaltyReformulationMode,
                          label: "3) صيغة «سؤال مرحلي موجه (أ / ب) / Question-tremplin»",
                        },
                      ]
                    ).map((opt) => (
                      <button
                        key={opt.mode}
                        type="button"
                        onClick={() => setSelectedReformulationMode(opt.mode)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer ${
                          selectedReformulationMode === opt.mode
                            ? "bg-amber-900 text-amber-100 shadow-2xs"
                            : "bg-white text-slate-700 border border-amber-300 hover:bg-amber-100/60"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* قسم 1: نتائج رصد العقوبة المزدوجة */}
              {doublePenaltyFindings.length === 0 ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                  <div className="text-sm font-black text-emerald-950">
                    لا توجد أي مخاطر "عقوبة مزدوجة" (Double Peine) في تمارين الفرض الحالي!
                  </div>
                  <p className="text-xs text-emerald-800">
                    جميع الأسئلة الوسطية الحرجة مصاغة بأسلوب يضمن استمرارية البحث («بين أن / تحقق أن / صمام قبول») وفق توجيهات المفتشية التربوية.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {doublePenaltyFindings.map((finding) => {
                    const previewByMode = finding.repairedByMode?.[selectedReformulationMode] || {
                      ar: finding.repairedQuestionAr,
                      fr: finding.repairedQuestionFr,
                      baremeStepsAr: "0.25 ن للخطوة + 0.25 ن للنتيجة",
                    };
                    return (
                      <div
                        key={finding.id}
                        className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-1 rounded-lg">
                            التمرين {finding.exerciseIndex + 1} ({finding.lessonAr}) — السؤال {finding.questionIndex + 1} يؤثر على السؤال {finding.dependentQuestionIndex + 1}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleFixSingleDoublePenalty(finding, selectedReformulationMode)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                              <span>تطبيق الصياغة المختارة على هذا السؤال</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600">{finding.riskDescriptionAr}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                            <div className="font-bold text-rose-900">الصياغة الحالية المفتوحة (تسبب عقوبة مزدوجة):</div>
                            <MathText text={isFr ? finding.originalQuestionFr : finding.originalQuestionAr} />
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                            <div className="font-bold text-emerald-900">
                              الصياغة المقترحة ({selectedReformulationMode === "MONTRER_QUE" ? "بين أن" : selectedReformulationMode === "ADMETTRE_RESULTAT" ? "صمام القبول" : "سؤال مرحلي أ/ب"}) {finding.usedSymbolicMathJS ? "— مشتقة رمزية MathJS" : ""}:
                            </div>
                            <MathText text={isFr ? previewByMode.fr : previewByMode.ar} />
                            <div className="pt-1 border-t border-emerald-200/80 text-[11px] font-mono text-emerald-950">
                              <span className="font-bold">تفكيك التنقيط (0.25 ن): </span>
                              <MathText text={previewByMode.baremeStepsAr} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* قسم 2: مدقق التدرج الديداكتيكي (N1 -> N2 -> N3) وميزانية الزمن بقاعدة المفتش (1×3) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-indigo-950 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-700" />
                      <span>
                        مصفوفة التفتيش التربوي: التدرج الديداكتيكي (N1 ← N2 ← N3) وميزانية الزمن بقاعدة (1×3) وتجزئة سلم التنقيط (0.25 ن)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      قاعدة المفتش التربوي (المذكرة 142-08): زمن إنجاز التلميذ يساوي تقريباً 3 أضعاف زمن إنجاز الأستاذ (<MathText text="$T_{\text{élève}} \approx 3 \times T_{\text{prof}}$" />)، مع وجوب تدرج الأسئلة من الاسترداد (N1) إلى التطبيق (N2) ثم التوليف (N3).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs">
                    <span className="font-bold text-slate-700">مدة الفرض الرسمية:</span>
                    <select
                      value={targetOfficialDurationMin}
                      onChange={(e) => setTargetOfficialDurationMin(Number(e.target.value))}
                      className="font-mono font-black text-indigo-900 bg-transparent outline-hidden cursor-pointer"
                    >
                      <option value={60}>60 دقيقة (ساعة واحدة)</option>
                      <option value={120}>120 دقيقة (ساعتان)</option>
                      <option value={180}>180 دقيقة (3 ساعات)</option>
                      <option value={240}>240 دقيقة (4 ساعات)</option>
                    </select>
                  </div>
                </div>

                {/* بطاقات ملخص ميزانية الزمن والتدرج */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold">زمن إنجاز الأستاذ المقدر</div>
                    <div className="text-base font-mono font-black text-slate-900 mt-0.5">
                      {didacticProgressionReport.totalTeacherMinutes} دقيقة
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-indigo-200">
                    <div className="text-[11px] text-indigo-700 font-bold">زمن إنجاز التلميذ (قاعدة 1×3)</div>
                    <div className="text-base font-mono font-black text-indigo-950 mt-0.5">
                      {didacticProgressionReport.totalStudentMinutes} د / {didacticProgressionReport.targetDurationMinutes} د
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold">اختلالات التدرج (N3 قبل N1/N2)</div>
                    <div
                      className={`text-base font-mono font-black mt-0.5 ${
                        didacticProgressionReport.inversionCount === 0
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {didacticProgressionReport.inversionCount === 0
                        ? "0 (تدرج سليم 100%)"
                        : `${didacticProgressionReport.inversionCount} اختلال بالترتيب`}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-200">
                    <div className="text-[11px] text-emerald-700 font-bold">توافق سلم التنقيط (0.25 ن)</div>
                    <div className="text-base font-mono font-black text-emerald-900 mt-0.5">
                      {didacticProgressionReport.quarterPointCompliancePercent}%
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    didacticProgressionReport.timeBudgetStatus === "OPTIMAL"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                      : "bg-amber-50 border-amber-300 text-amber-950"
                  }`}
                >
                  {didacticProgressionReport.timeBudgetStatusAr}
                </div>

                {/* تفصيل كل تمرين مع زر إعادة الترتيب الديداكتيكي بنقرة واحدة */}
                <div className="space-y-3">
                  {didacticProgressionReport.exercises.map((ex) => (
                    <div
                      key={ex.exerciseIndex}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs font-black">
                            التمرين {ex.exerciseIndex + 1} ({ex.points} ن)
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            {isFr ? ex.lessonFr : ex.lessonAr}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            (أستاذ: {ex.totalTeacherMinutes} د | تلميذ 1×3: {ex.totalStudentMinutes} د)
                          </span>
                        </div>

                        {ex.hasInversion ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleReorderExerciseQuestionsByProgression(
                                ex.exerciseIndex,
                                ex.recommendedOrderIndices
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>إعادة ترتيب الأسئلة تصاعدياً (N1 ← N2 ← N3)</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            تدرج ديداكتيكي متسق (N1 ← N2 ← N3)
                          </span>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                              <th className="p-1.5">السؤال</th>
                              <th className="p-1.5">المستوى المعرفي</th>
                              <th className="p-1.5">زمن الأستاذ / التلميذ (1×3)</th>
                              <th className="p-1.5">سلم التنقيط التحليلي المفكك (0.25 ن)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ex.questionsAudit.map((qa) => (
                              <tr
                                key={qa.questionIndex}
                                className={`border-b border-slate-100 ${
                                  qa.hasProgressionInversion ? "bg-amber-50/70" : ""
                                }`}
                              >
                                <td className="p-1.5 font-mono font-bold text-slate-800">
                                  س{qa.questionIndex + 1}
                                </td>
                                <td className="p-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                      qa.level === "N1_RESTITUTION"
                                        ? "bg-emerald-100 text-emerald-900"
                                        : qa.level === "N2_APPLICATION"
                                        ? "bg-indigo-100 text-indigo-900"
                                        : "bg-amber-100 text-amber-900"
                                    }`}
                                  >
                                    {qa.level === "N1_RESTITUTION"
                                      ? "N1 استرداد"
                                      : qa.level === "N2_APPLICATION"
                                      ? "N2 تطبيق"
                                      : "N3 توليف"}
                                  </span>
                                  {qa.hasProgressionInversion && (
                                    <span className="mr-1.5 text-[10px] font-bold text-amber-800">
                                      (اختلال تدرج)
                                    </span>
                                  )}
                                </td>
                                <td className="p-1.5 font-mono text-slate-700">
                                  {qa.estimatedTeacherMinutes} د ←{" "}
                                  <strong>{qa.estimatedStudentMinutes} د</strong>
                                </td>
                                <td className="p-1.5 text-slate-700">
                                  {isFr ? qa.analyticalBaremeFr : qa.analyticalBaremeAr}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              التبويب 6: مقترح المفتش التربوي رقم 3 (مطور) —
              لوحة التتبع الطولي لمكتسبات الفوج DS1 -> DS2 -> DS3 + مبيان التطور SVG + مصنف نقط مسار (Massar Grade Triage)
             ================================================================ */}
          {activeTab === "LONGITUDINAL_COHORT" && (
            <div className="space-y-5">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 max-w-3xl">
                  <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>
                      النقطة 3 من مقترحات المفتش التربوي: لوحة التتبع الطولي لمكتسبات الفوج (DS1 → DS2 → DS3) ومؤشر نجاعة الدعم الفارقي
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    تقيس هذه الأداة التفتيشية التطور الفعلي لمؤشرات التحكم (A / ECA / NA)، والمعدل العام، ومعامل التجانس السيكومتري (<MathText text="$CV = \sigma / \bar{x}$" />)، وتولد مبيان التطور الطولي بصيغة SVG مع استيراد مباشر للائحة نقط مسار وتصنيف التلاميذ إلى 3 مجموعات دعم.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCouncilReportModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-200" />
                    <span>توليد تقرير مجلس القسم والتفتيش الرسمي (A4)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertLongitudinalChartFigure}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <FilePlus2 className="w-4 h-4 text-cyan-400" />
                    <span>إدراج مبيان التطور الطولي (SVG) في الورقة</span>
                  </button>

                  <label className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-emerald-300 text-xs font-black text-emerald-950 cursor-pointer shadow-2xs">
                    <input
                      type="checkbox"
                      checked={longitudinalConfig.includeInPrintablePreview}
                      onChange={(e) =>
                        onChangeLongitudinalConfig({
                          ...longitudinalConfig,
                          includeInPrintablePreview: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-emerald-700 rounded"
                    />
                    <span>إدراج بطاقة ومبيان التتبع الطولي (DS1→DS3) في المعاينة والطباعة</span>
                  </label>
                </div>
              </div>

              {/* القسم الجديد 1: مبيان التطور الطولي SVG + مؤشرات تأشيرة المفتش التربوي */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
                  <div
                    className="w-full overflow-hidden rounded-xl"
                    dangerouslySetInnerHTML={{
                      __html: longitudinalAnalytics.svgEvolutionChart,
                    }}
                  />
                </div>

                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                      <span>مؤشرات تأشيرة المفتش التربوي (DS1 ← DS3):</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-900 text-emerald-200 font-mono text-xs font-black">
                        النجاعة: {longitudinalAnalytics.netRemediationEfficiencyScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[10.5px] text-slate-500 font-bold">تطور المعدل العام</div>
                        <div className="font-mono font-black text-sm text-indigo-900 mt-0.5">
                          {longitudinalAnalytics.meanProgressionDelta >= 0 ? "+" : ""}
                          {longitudinalAnalytics.meanProgressionDelta} ن (/20)
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[10.5px] text-slate-500 font-bold">تقليص فئة التعثر (ΔNA)</div>
                        <div className="font-mono font-black text-sm text-emerald-700 mt-0.5">
                          {longitudinalAnalytics.deltaNonAcquis}% (A: +{longitudinalAnalytics.deltaAcquis}%)
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 col-span-2">
                        <div className="text-[10.5px] text-slate-500 font-bold">
                          معامل التجانس السيكومتري (CV = σ / x̄):
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 mt-0.5">
                          {longitudinalAnalytics.homogeneityTrendAr}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950 text-emerald-100 text-xs space-y-1">
                    <div className="font-black text-amber-300">قرار وتأشيرة المفتش التربوي:</div>
                    <p className="leading-relaxed text-[11px]">
                      {isFr
                        ? longitudinalAnalytics.inspectorVisaStatusFr
                        : longitudinalAnalytics.inspectorVisaStatusAr}
                    </p>
                  </div>
                </div>
              </div>

              {/* القسم الجديد 2: محلل نقط مسار وتصنيف مجموعات الدعم الثلاث بنقرة واحدة */}
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-black text-indigo-950">
                      مستورد نقط «مسار» ومصنف مجموعات الدعم الفارقي الثلاث (Massar Grade Parser &amp; 3-Group Auto-Triage)
                    </div>
                    <p className="text-[11px] text-slate-600">
                      ألصق لائحة نقط التلاميذ (/20) مفصولة بفاصلة أو مسافة أو سطر جديد لحساب المعدل والانحراف المعياري وتوزيع (A / ECA / NA) آلياً وتحديث الفرض المختار.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={targetMassarCheckpointIdx}
                      onChange={(e) => setTargetMassarCheckpointIdx(Number(e.target.value))}
                      className="rounded-xl border border-indigo-300 bg-white px-2.5 py-1.5 text-xs font-black text-indigo-950"
                    >
                      <option value={0}>تطبيق على DS1 (الفرض 1)</option>
                      <option value={1}>تطبيق على DS2 (الفرض 2)</option>
                      <option value={2}>تطبيق على DS3 (الفرض 3)</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleApplyMassarGradesToCheckpoint}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs cursor-pointer"
                    >
                      تحديث مؤشرات {longitudinalConfig.checkpoints[targetMassarCheckpointIdx]?.dsCode || "DS"}
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  dir="ltr"
                  value={rawMassarGradesInput}
                  onChange={(e) => setRawMassarGradesInput(e.target.value)}
                  placeholder="15.5 ; 14.0 ; 12.25 ; 9.5 ; 8.0 ; 16.5 ..."
                  className="w-full rounded-xl border border-indigo-300 bg-white p-2.5 font-mono text-xs text-slate-800"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white p-2.5 rounded-xl border border-indigo-200">
                  <span className="font-bold text-slate-800">
                    {parsedMassarStats.triageSummaryAr}
                  </span>
                  <span className="font-mono font-black text-indigo-900">
                    x̄ = {parsedMassarStats.meanScore}/20 | σ = {parsedMassarStats.stdDev} | Med = {parsedMassarStats.medianScore}
                  </span>
                </div>
              </div>

              {/* محرر مؤشرات الفروض الثلاثة DS1 / DS2 / DS3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {longitudinalConfig.checkpoints.map((cp, idx) => (
                  <div
                    key={cp.dsCode}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded bg-slate-900 text-cyan-300">
                        {cp.dsCode}
                      </span>
                      <span className="text-xs font-black text-slate-900">{cp.titleAr}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-600">
                          معدل القسم (/20):
                        </label>
                        <input
                          type="number"
                          step="0.25"
                          min={0}
                          max={20}
                          value={cp.meanScore20}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const next = [...longitudinalConfig.checkpoints] as LongitudinalCohortTrackerConfig["checkpoints"];
                            next[idx] = { ...cp, meanScore20: val };
                            onChangeLongitudinalConfig({
                              ...longitudinalConfig,
                              checkpoints: next,
                            });
                          }}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-600">
                          الانحراف المعياري (σ):
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min={0.5}
                          max={8}
                          value={cp.stdDeviation}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const next = [...longitudinalConfig.checkpoints] as LongitudinalCohortTrackerConfig["checkpoints"];
                            next[idx] = { ...cp, stdDeviation: val };
                            onChangeLongitudinalConfig({
                              ...longitudinalConfig,
                              checkpoints: next,
                            });
                          }}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-emerald-800">
                          متحكم A (%):
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={cp.masteryAPct}
                          onChange={(e) => {
                            const valA = Number(e.target.value);
                            const next = [...longitudinalConfig.checkpoints] as LongitudinalCohortTrackerConfig["checkpoints"];
                            const nextECA = Math.max(0, 100 - valA - cp.masteryNAPct);
                            next[idx] = { ...cp, masteryAPct: valA, masteryECAPct: nextECA };
                            onChangeLongitudinalConfig({
                              ...longitudinalConfig,
                              checkpoints: next,
                            });
                          }}
                          className="w-full rounded-lg border border-emerald-300 bg-white px-2 py-1 font-mono font-bold text-emerald-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-rose-800">
                          غير متحكم NA (%):
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={cp.masteryNAPct}
                          onChange={(e) => {
                            const valNA = Number(e.target.value);
                            const nextECA = Math.max(0, 100 - cp.masteryAPct - valNA);
                            const next = [...longitudinalConfig.checkpoints] as LongitudinalCohortTrackerConfig["checkpoints"];
                            next[idx] = {
                              ...cp,
                              masteryNAPct: valNA,
                              masteryECAPct: nextECA,
                            };
                            onChangeLongitudinalConfig({
                              ...longitudinalConfig,
                              checkpoints: next,
                            });
                          }}
                          className="w-full rounded-lg border border-rose-300 bg-white px-2 py-1 font-mono font-bold text-rose-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-3 w-full rounded-full overflow-hidden flex border border-slate-300">
                        <div
                          style={{ width: `${cp.masteryAPct}%` }}
                          className="bg-emerald-600"
                          title={`A: ${cp.masteryAPct}%`}
                        />
                        <div
                          style={{ width: `${cp.masteryECAPct}%` }}
                          className="bg-amber-400"
                          title={`ECA: ${cp.masteryECAPct}%`}
                        />
                        <div
                          style={{ width: `${cp.masteryNAPct}%` }}
                          className="bg-rose-500"
                          title={`NA: ${cp.masteryNAPct}%`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600">
                        <span className="text-emerald-700">A: {cp.masteryAPct}%</span>
                        <span className="text-amber-700">ECA: {cp.masteryECAPct}%</span>
                        <span className="text-rose-700">NA: {cp.masteryNAPct}%</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {cp.inspectorObservationAr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              التبويب 7: مقترحات مطور البرامج التربوية (EdTech Software Developer Studio)
              1) مولد النماذج البارامترية المتكافئة المضادة للغش عبر MathJS (Modèles A / B / C / D)
              2) مدقق كثافة الصفحة A4 ومنع الأسطر اليتيمة وفحص شجرة MathJS AST
              3) جسر التصدير المعياري المفتوح لمنصات التعليم الإلكتروني (Moodle XML / QTI)
             ================================================================ */}
          {activeTab === "EDTECH_DEV_STUDIO" && (
            <div className="space-y-6">
              {/* الأداة 1 لمطور البرامج التربوية: مولد التمارين البارامترية المتكافئة A/B/C/D */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="space-y-1 max-w-3xl">
                    <div className="text-xs font-black text-indigo-950 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-700" />
                      <span>
                        مقترح مطور البرامج التربوية 1: مولد النماذج البارامترية المتكافئة المضادة للغش عبر MathJS (Isomorphic Cloner A / B / C / D)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      يولد 4 نماذج متكافئة تماماً في البنية الجبرية والمهارات المستهدفة ومختلفة في المعاملات العددية، مع ضمان بقاء المشتقات والنهايات والحلول أعداداً صحيحة أو جذرية مضبوطة ومحسوبة رمزياً بواسطة <code>mathjs</code>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <select
                      value={cloneTemplateId}
                      onChange={(e) =>
                        setCloneTemplateId(e.target.value as ParametricCloneTemplateId)
                      }
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-900"
                    >
                      <option value="RATIONAL_ANALYSIS">دالة جذرية ومقاربات (1 باك / 2 باك)</option>
                      <option value="EXP_ANALYSIS">دالة أسية ومطراف (2 باك وطني)</option>
                      <option value="LOG_ANALYSIS">دالة لوغاريتمية ورتابة (2 باك وطني)</option>
                      <option value="ARITHMETIC_GEOMETRIC_SUITE">متتالية ترجعية تآلفية (1 باك / 2 باك)</option>
                      <option value="COMPLEX_EQUATION">معادلة عقدية ومثلث متساوي الساقين (2 باك)</option>
                    </select>

                    <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300">
                      <span className="text-[11px] font-bold text-slate-600">البذرة (Seed):</span>
                      <input
                        type="number"
                        value={cloneSeed}
                        onChange={(e) => setCloneSeed(Number(e.target.value) || 2026)}
                        className="w-16 font-mono font-black text-indigo-900 outline-hidden"
                      />
                    </div>

                    <select
                      value={targetExerciseIdxClone}
                      onChange={(e) => setTargetExerciseIdxClone(Number(e.target.value))}
                      className="rounded-xl border border-indigo-300 bg-indigo-50 px-2.5 py-1.5 font-bold text-indigo-950"
                    >
                      {lessons.map((l, idx) => (
                        <option key={idx} value={idx}>
                          حقن في التمرين {idx + 1}: {l.lessonAr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* بطاقات النماذج الأربعة A / B / C / D */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {parametricClones.map((clone, idx) => {
                    const isSelected = selectedCloneVariantIdx === idx;
                    return (
                      <div
                        key={clone.variantCode}
                        onClick={() => setSelectedCloneVariantIdx(idx)}
                        className={`p-3 rounded-xl border transition cursor-pointer space-y-2 ${
                          isSelected
                            ? "bg-indigo-950 text-white border-indigo-900 shadow-md"
                            : "bg-white text-slate-800 border-slate-200 hover:border-indigo-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-xs font-black ${
                              isSelected
                                ? "bg-cyan-400 text-slate-950"
                                : "bg-slate-900 text-cyan-300"
                            }`}
                          >
                            Modèle {clone.variantCode}
                          </span>
                          <span className="font-mono text-[10px] opacity-75">
                            Seed #{clone.seedUsed}
                          </span>
                        </div>
                        <div
                          className={`p-2 rounded-lg text-xs ${
                            isSelected ? "bg-white/10 text-cyan-200" : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <MathText text={`$${clone.functionOrRelationLatex}$`} />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInjectParametricCloneIntoExercise(idx);
                          }}
                          className={`w-full py-1.5 rounded-lg font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                        >
                          <FilePlus2 className="w-3.5 h-3.5" />
                          <span>حقن النموذج {clone.variantCode} في التمرين {targetExerciseIdxClone + 1}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* معاينة النموذج المختار مع عناصر الإجابة الرمزية */}
                {parametricClones[selectedCloneVariantIdx] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                      <div className="font-black text-indigo-950">
                        نص أسئلة النموذج {parametricClones[selectedCloneVariantIdx].variantCode}:
                      </div>
                      <div className="leading-relaxed text-slate-800">
                        <MathText
                          text={
                            isFr
                              ? parametricClones[selectedCloneVariantIdx].questionFr
                              : parametricClones[selectedCloneVariantIdx].questionAr
                          }
                        />
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <div className="font-black text-emerald-950">
                        عناصر الإجابة والمشتقة/النتيجة الرمزية المحققة بـ MathJS:
                      </div>
                      <div className="leading-relaxed text-slate-800">
                        <MathText
                          text={
                            isFr
                              ? parametricClones[selectedCloneVariantIdx].answerKeyFr
                              : parametricClones[selectedCloneVariantIdx].answerKeyAr
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* الأداة 2 لمطور البرامج التربوية: مدقق كثافة الصفحة A4 وسلامة شجرة MathJS AST */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      مقترح مطور البرامج التربوية 2: مدقق كثافة الصفحة A4 ومنع الأسطر اليتيمة وفحص شجرة MathJS AST
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs font-black">
                    مؤشر سلامة الصيغ: {edtechDiagnostics.mathSyntaxHealthScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold">الارتفاع المقدر للورقة</div>
                    <div className="text-base font-mono font-black text-slate-900 mt-0.5">
                      {edtechDiagnostics.estimatedTotalHeightMm} مم ({edtechDiagnostics.estimatedA4Pages} ص A4)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold">نسبة ملء الصفحة الأخيرة</div>
                    <div className="text-base font-mono font-black text-indigo-900 mt-0.5">
                      {edtechDiagnostics.lastPageFillPercent}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold">تعبيرات MathJS AST مفحوصة</div>
                    <div className="text-base font-mono font-black text-emerald-700 mt-0.5">
                      {edtechDiagnostics.astVerifiedExpressionsCount} صيغة سليمة
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold">توازن محددات LaTeX ($...$)</div>
                    <div className="text-base font-mono font-black text-slate-900 mt-0.5">
                      {edtechDiagnostics.latexDelimiterWarningsCount === 0
                        ? "متوازن 100%"
                        : `${edtechDiagnostics.latexDelimiterWarningsCount} تنبيه`}
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    edtechDiagnostics.hasOrphanPageRisk
                      ? "bg-amber-50 border-amber-300 text-amber-950"
                      : "bg-emerald-50 border-emerald-200 text-emerald-950"
                  }`}
                >
                  {edtechDiagnostics.densityRecommendationAr}
                </div>
              </div>

              {/* الأداة 3 لمطور البرامج التربوية: جسر التصدير المعياري المفتوح Moodle XML */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-cyan-300 flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      <span>
                        مقترح مطور البرامج التربوية 3: جسر التصدير المعياري لبنوك الأسئلة (Moodle XML + MathJax + Barème)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      يُصدّر تمارين الفرض المحروس الحالي وعناصر إجابتها وسلم تنقيطها وتصنيفها المعرفي (N1/N2/N3) إلى صيغة Moodle XML القياسية القابلة للاستيراد الفوري في منصات التعليم عن بعد.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(moodleXmlOutput);
                        setCopiedMoodleXml(true);
                        setTimeout(() => setCopiedMoodleXml(false), 2000);
                        onNotify("info", "تم نسخ كود Moodle XML المعياري إلى الحافظة!");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedMoodleXml ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedMoodleXml ? "تم النسخ" : "نسخ كود XML"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadMoodleXmlFile}
                      className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <FilePlus2 className="w-3.5 h-3.5" />
                      <span>تحميل ملف Moodle XML (.xml)</span>
                    </button>
                  </div>
                </div>

                <pre
                  dir="ltr"
                  className="max-h-40 overflow-y-auto rounded-xl bg-slate-950/90 border border-slate-800 p-3 font-mono text-[10.5px] text-emerald-300 leading-relaxed"
                >
                  {moodleXmlOutput}
                </pre>
              </div>
            </div>
          )}

          {/* ================================================================
              مقترح أستاذ المادة الجديد 1:
              مولد جداول الإشارة ومجموعة التعريف الآلي (Tableaux de Signes & D_f)
             ================================================================ */}
          {activeTab === "SIGN_TABLE_STUDIO" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-l from-indigo-50 to-cyan-50 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-indigo-950">
                    <Wand2 className="w-4 h-4 text-indigo-700" />
                    <span>
                      مقترح أستاذ الرياضيات 1: مولد جدول الإشارة ومجموعة التعريف الآلي (Tableaux de Signes &amp; Ensemble de Définition D_f)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    يحلل البسط $P(x)$ والمقام $Q(x)$ عبر <span className="font-mono font-bold">mathjs</span> لاستخراج الجذور الحقيقية والقيم الممنوعة (خط مضاعف <span className="font-mono font-bold text-rose-700">||</span>)، ثم يولد جدول الإشارة الأكاديمي بصيغتي <span className="font-mono font-bold">SVG</span> و <span className="font-mono font-bold">TikZ/tkz-tab</span> مع حلول المتراجحات الأربع.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {SIGN_TABLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSignNumExpr(preset.num);
                        setSignDenExpr(preset.den);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-bold transition cursor-pointer"
                    >
                      {preset.labelAr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-black text-slate-900">
                    إعداد البسط P(x) والمقام Q(x) والتمرين المستهدف
                  </h3>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      تعبير البسط P(x) (بصيغة MathJS مثل x^2 - 4):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={signNumExpr}
                      onChange={(e) => setSignNumExpr(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      تعبير المقام Q(x) (ضع 1 إذا كان تعبيراً حدودياً بدون مقام):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={signDenExpr}
                      onChange={(e) => setSignDenExpr(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  {signTableData.isValid ? (
                    <div className="bg-white border border-indigo-200 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-indigo-950">مجموعة التعريف المستخرجة آلياً:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold">
                          MathJS Verified
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900">
                        <MathText text={`$$${signTableData.domainLatex}$$`} />
                      </div>
                      <div className="text-[11px] text-slate-700 leading-relaxed">
                        <MathText text={isFr ? signTableData.domainExplanationFr : signTableData.domainExplanationAr} />
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
                        <div className="flex items-center justify-between bg-emerald-50/70 px-2.5 py-1 rounded">
                          <span className="font-bold text-emerald-950">حلول $E(x) \ge 0$:</span>
                          <MathText text={`$S = ${signTableData.solutionNonNegLatex}$`} />
                        </div>
                        <div className="flex items-center justify-between bg-emerald-50/40 px-2.5 py-1 rounded">
                          <span className="font-bold text-emerald-900">حلول $E(x) &gt; 0$:</span>
                          <MathText text={`$S = ${signTableData.solutionStrictPosLatex}$`} />
                        </div>
                        <div className="flex items-center justify-between bg-rose-50/70 px-2.5 py-1 rounded">
                          <span className="font-bold text-rose-950">حلول $E(x) \le 0$:</span>
                          <MathText text={`$S = ${signTableData.solutionNonPosLatex}$`} />
                        </div>
                        <div className="flex items-center justify-between bg-rose-50/40 px-2.5 py-1 rounded">
                          <span className="font-bold text-rose-900">حلول $E(x) &lt; 0$:</span>
                          <MathText text={`$S = ${signTableData.solutionStrictNegLatex}$`} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-bold">
                      {signTableData.errorMessage}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">
                      اختر التمرين المستهدف في ورقة الفرض:
                    </label>
                    <select
                      value={targetExerciseIdxSign}
                      onChange={(e) => setTargetExerciseIdxSign(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      {lessons.map((l, idx) => (
                        <option key={idx} value={idx}>
                          التمرين {idx + 1}: {isFr ? l.lessonFr : l.lessonAr}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleInsertSignTableFigure}
                        disabled={!signTableData.isValid}
                        className="px-3 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <FilePlus2 className="w-4 h-4" />
                        <span>إدراج جدول الإشارة في الورقة</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleInjectSignTableQuestion}
                        disabled={!signTableData.isValid}
                        className="px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>حقن سؤال $D_f$ والمتراجحة</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900">
                        معاينة جدول الإشارة الأكاديمي (SVG — يبرز الجذور 0 والقيم الممنوعة ||)
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(signTableData.tikzCode);
                          setCopiedTikzSign(true);
                          setTimeout(() => setCopiedTikzSign(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedTikzSign ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTikzSign ? "تم نسخ كود tkz-tab!" : "نسخ كود TikZ / tkz-tab"}</span>
                      </button>
                    </div>

                    {signTableData.isValid && signTableData.svgSignTable && (
                      <div
                        className="w-full overflow-x-auto rounded-xl border border-slate-200 p-2 bg-slate-50"
                        dangerouslySetInnerHTML={{ __html: signTableData.svgSignTable }}
                      />
                    )}

                    {signTableData.isValid && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                          <div className="text-[11px] font-black text-indigo-950">
                            صياغة السؤال المقترح للإدراج:
                          </div>
                          <div className="text-xs text-slate-800 leading-relaxed">
                            <MathText
                              text={
                                isFr
                                  ? signTableData.suggestedQuestionFr
                                  : signTableData.suggestedQuestionAr
                              }
                            />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                          <div className="text-[11px] font-black text-emerald-950">
                            عناصر الإجابة وسلم التنقيط:
                          </div>
                          <div className="text-xs text-slate-800 leading-relaxed">
                            <MathText
                              text={
                                isFr
                                  ? signTableData.suggestedAnswerFr
                                  : signTableData.suggestedAnswerAr
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              مقترح أستاذ المادة الجديد 2:
              مختبر حساب التكامل والمساحات المظللة (Calcul Intégral & Aires Hachurées)
             ================================================================ */}
          {activeTab === "INTEGRAL_AREA_STUDIO" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-l from-indigo-50 to-emerald-50 border border-indigo-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-indigo-950">
                    <Sparkles className="w-4 h-4 text-indigo-700" />
                    <span>
                      مقترح أستاذ الرياضيات 2: مختبر حساب التكامل والمساحات المظللة بين منحنيين (Calcul Intégral &amp; Aires Hachurées)
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <MathText text="يحسب التكامل الجبري والمساحة الهندسية للحيز المحصور بين $(C_f)$ و $(C_g)$ على $[a,b]$ بوحدة المساحة ($\text{u.a.}$) وبالـ $\text{cm}^2$ وفق منظمي المعلم $\|\vec{i}\|$ و $\|\vec{j}\|$، مع توليد شكل SVG مظلل وجاهز للطباعة." />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {INTEGRAL_AREA_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIntFExpr(preset.fExpr);
                        setIntGExpr(preset.gExpr);
                        setIntABound(preset.a);
                        setIntBBound(preset.b);
                        setIntXMin(preset.xMin);
                        setIntXMax(preset.xMax);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-bold transition cursor-pointer"
                    >
                      {preset.labelAr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-black text-slate-900">
                    إعداد الدالتين f(x) و g(x) ومجال المكاملة [a, b] ووحدة المعلم
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        الدالة الأولى f(x):
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={intFExpr}
                        onChange={(e) => setIntFExpr(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        الدالة الثانية g(x) (0 لمحور الأفاصيل):
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={intGExpr}
                        onChange={(e) => setIntGExpr(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-700">الحد a:</label>
                      <input
                        type="number"
                        step="0.5"
                        value={intABound}
                        onChange={(e) => setIntABound(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-700">الحد b:</label>
                      <input
                        type="number"
                        step="0.5"
                        value={intBBound}
                        onChange={(e) => setIntBBound(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-indigo-800">||i|| (cm):</label>
                      <input
                        type="number"
                        step="0.5"
                        min={0.5}
                        value={intUnitIcm}
                        onChange={(e) => setIntUnitIcm(Number(e.target.value))}
                        className="w-full rounded-lg border border-indigo-300 bg-white px-2 py-1 text-xs font-mono font-bold text-indigo-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-indigo-800">||j|| (cm):</label>
                      <input
                        type="number"
                        step="0.5"
                        min={0.5}
                        value={intUnitJcm}
                        onChange={(e) => setIntUnitJcm(Number(e.target.value))}
                        className="w-full rounded-lg border border-indigo-300 bg-white px-2 py-1 text-xs font-mono font-bold text-indigo-900"
                      />
                    </div>
                  </div>

                  {integralAreaData.isValid && (
                    <div className="bg-white border border-indigo-200 rounded-xl p-3 space-y-2 text-xs">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-bold">التكامل الجبري</div>
                          <div className="font-mono font-black text-sm text-slate-900">
                            {integralAreaData.signedIntegralValue}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                          <div className="text-[10px] text-indigo-700 font-bold">المساحة بـ (u.a.)</div>
                          <div className="font-mono font-black text-sm text-indigo-950">
                            {integralAreaData.geometricAreaUA} u.a.
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                          <div className="text-[10px] text-emerald-700 font-bold">المساحة بـ (cm²)</div>
                          <div className="font-mono font-black text-sm text-emerald-950">
                            {integralAreaData.geometricAreaCm2} cm²
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">
                      اختر التمرين المستهدف في ورقة الفرض:
                    </label>
                    <select
                      value={targetExerciseIdxInt}
                      onChange={(e) => setTargetExerciseIdxInt(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      {lessons.map((l, idx) => (
                        <option key={idx} value={idx}>
                          التمرين {idx + 1}: {isFr ? l.lessonFr : l.lessonAr}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleInsertIntegralAreaFigure}
                        disabled={!integralAreaData.isValid}
                        className="px-3 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <FilePlus2 className="w-4 h-4" />
                        <span>إدراج مبيان الحيز المظلل</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleInjectIntegralQuestion}
                        disabled={!integralAreaData.isValid}
                        className="px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>حقن سؤال التكامل والمساحة</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900">
                        معاينة المنحنى والحيز المظلل بالتاشير الأكاديمي (Aire Hachurée SVG)
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(integralAreaData.tikzCode);
                          setCopiedTikzInt(true);
                          setTimeout(() => setCopiedTikzInt(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedTikzInt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTikzInt ? "تم نسخ كود TikZ!" : "نسخ كود TikZ"}</span>
                      </button>
                    </div>

                    {integralAreaData.isValid && integralAreaData.svgPlotWithShadedArea && (
                      <div
                        className="w-full overflow-x-auto rounded-xl border border-slate-200 p-2 bg-slate-50"
                        dangerouslySetInnerHTML={{
                          __html: integralAreaData.svgPlotWithShadedArea,
                        }}
                      />
                    )}

                    {integralAreaData.isValid && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                          <div className="text-[11px] font-black text-indigo-950">
                            صياغة سؤال التكامل والمساحة المقترح:
                          </div>
                          <div className="text-xs text-slate-800 leading-relaxed">
                            <MathText
                              text={
                                isFr
                                  ? integralAreaData.suggestedQuestionFr
                                  : integralAreaData.suggestedQuestionAr
                              }
                            />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                          <div className="text-[11px] font-black text-emerald-950">
                            عناصر الإجابة الدقيقة (u.a. و cm²):
                          </div>
                          <div className="text-xs text-slate-800 leading-relaxed">
                            <MathText
                              text={
                                isFr
                                  ? integralAreaData.suggestedAnswerFr
                                  : integralAreaData.suggestedAnswerAr
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              مقترح أستاذ المادة الجديد 3:
              مكتبة الأشكال الهندسية الفضائية الجاهزة (3D Wireframe SVG Presets)
             ================================================================ */}
          {activeTab === "SPACE_GEOMETRY_3D_STUDIO" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-cyan-300">
                    <Play className="w-4 h-4 text-cyan-300" />
                    <span>
                      مقترح أستاذ الرياضيات 3: مكتبة الأشكال الهندسية الفضائية ثلاثية الأبعاد (3D Wireframe SVG — Géométrie dans l&apos;espace)
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed">
                    <MathText text="مجسمات فضائية أكاديمية بأحرف مرئية متصلة وأحرف خلفية متقطعة مع تقاطعات مستوية مظللة (مكعب $ABCDEFGH$، رباعي الأوجه $ABCD$، هرم منتظم $SABCD$، وفلكة $(S)$ يقطعها مستوٍ $(P)$ وفق دائرة $(C)$)." />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: "CUBE", label: "1. مكعب ABCDEFGH + مقطع (BDE)" },
                      { id: "TETRAHEDRON", label: "2. رباعي الأوجه ABCD + (IJK)" },
                      { id: "PYRAMID", label: "3. هرم منتظم SABCD + ارتفاع SO" },
                      { id: "SPHERE_PLANE", label: "4. فلكة (S) ومستوٍ قاطع (P)" },
                    ] as { id: SpaceGeometry3DPresetType; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSpacePresetType(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        spacePresetType === item.id
                          ? "bg-cyan-400 text-slate-950 shadow-sm"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-black text-slate-900">
                    ضبط القياسات الهندسية للمجسم الفضائي
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {spacePresetType === "SPHERE_PLANE"
                          ? "شعاع الفلكة R:"
                          : "طول الحرف / الضلع a:"}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min={1}
                        max={20}
                        value={spaceParamA}
                        onChange={(e) => setSpaceParamA(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {spacePresetType === "SPHERE_PLANE"
                          ? "مسافة المركز d(Ω,(P)):"
                          : "الارتفاع الجانبي h:"}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min={0.5}
                        max={15}
                        value={spaceParamB}
                        onChange={(e) => setSpaceParamB(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={spaceShowSection}
                      onChange={(e) => setSpaceShowSection(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>إظهار المستوى القاطع المظلل (Section plane) داخل المجسم</span>
                  </label>

                  <div className="p-3 rounded-xl bg-white border border-indigo-200 space-y-1.5 text-xs">
                    <div className="font-black text-indigo-950">الخصائص الهندسية المحسوبة:</div>
                    <div className="text-slate-700 leading-relaxed">
                      <MathText
                        text={
                          isFr
                            ? spaceGeometryData.keyMetricsSummaryFr
                            : spaceGeometryData.keyMetricsSummaryAr
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">
                      اختر التمرين المستهدف في ورقة الفرض:
                    </label>
                    <select
                      value={targetExerciseIdxSpace}
                      onChange={(e) => setTargetExerciseIdxSpace(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      {lessons.map((l, idx) => (
                        <option key={idx} value={idx}>
                          التمرين {idx + 1}: {isFr ? l.lessonFr : l.lessonAr}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleInsertSpaceGeometryFigure}
                        className="px-3 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <FilePlus2 className="w-4 h-4" />
                        <span>إدراج المجسم 3D في الورقة</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleInjectSpaceGeometryQuestion}
                        className="px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>حقن تمرين الهندسة الفضائية</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900">
                        <MathText
                          text={
                            isFr ? spaceGeometryData.titleFr : spaceGeometryData.titleAr
                          }
                        />
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(spaceGeometryData.tikzCode);
                          setCopiedTikzSpace(true);
                          setTimeout(() => setCopiedTikzSpace(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedTikzSpace ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTikzSpace ? "تم نسخ كود TikZ!" : "نسخ كود TikZ 3D"}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pb-2">
                      <button
                        type="button"
                        onClick={() => setViewMode3D("INTERACTIVE_CANVAS")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          viewMode3D === "INTERACTIVE_CANVAS"
                            ? "bg-cyan-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        محاكاة مدارية ثلاثية الأبعاد 3D Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode3D("SVG")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          viewMode3D === "SVG"
                            ? "bg-cyan-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        رسم SVG الأكاديمي القياسي
                      </button>
                    </div>

                    {viewMode3D === "INTERACTIVE_CANVAS" ? (
                      <Interactive3DSpaceCanvas
                        presetType={spacePresetType}
                        paramA={spaceParamA}
                        paramB={spaceParamB}
                        showSection={spaceShowSection}
                      />
                    ) : (
                      <div
                        className="w-full overflow-x-auto rounded-xl border border-slate-200 p-2 bg-slate-50"
                        dangerouslySetInnerHTML={{
                          __html: spaceGeometryData.svgWireframe,
                        }}
                      />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                        <div className="text-[11px] font-black text-indigo-950">
                          أسئلة الهندسة الفضائية المقترحة للإدراج:
                        </div>
                        <div className="text-xs text-slate-800 leading-relaxed">
                          <MathText
                            text={
                              isFr
                                ? spaceGeometryData.suggestedQuestionFr
                                : spaceGeometryData.suggestedQuestionAr
                            }
                          />
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <div className="text-[11px] font-black text-emerald-950">
                          عناصر الإجابة المفصلة:
                        </div>
                        <div className="text-xs text-slate-800 leading-relaxed">
                          <MathText
                            text={
                              isFr
                                ? spaceGeometryData.suggestedAnswerFr
                                : spaceGeometryData.suggestedAnswerAr
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* شريط الإغلاق السفلي */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <Award className="w-4 h-4 text-indigo-700" />
            <span>
              جميع الأدوات متوافقة مع المذكرة 142-08 والتوجيهات التربوية الرسمية ومعايير البعثة الفرنسية AEFE
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer"
          >
            إغلاق والعودة لمعاينة الورقة
          </button>
        </div>
      {showCouncilReportModal && (
        <ClassCouncilReportModal
          isOpen={showCouncilReportModal}
          onClose={() => setShowCouncilReportModal(false)}
          schoolName={school || "الثانوية التأهيلية الرسمية"}
          profName={prof || "أستاذ مادة الرياضيات"}
          trackLabelAr={trackLabelAr}
          trackLabelFr={trackLabelFr}
          year={year || "2024-2025"}
          semester={semester || "S1"}
          cohortConfig={longitudinalConfig}
          onNotify={onNotify}
        />
      )}
    </div>
    </div>
  );
};

export default MathTeacherInspectorStudioModal;
