import React, { useState, useMemo } from "react";
import {
  X,
  Table2,
  LineChart,
  QrCode,
  AlertTriangle,
  Copy,
  Check,
  PlusCircle,
  Sparkles,
  FileCode2,
  CheckCircle2,
  Layers,
  Eye,
  BookOpen,
  MonitorPlay,
  ChevronRight,
  ChevronLeft,
  EyeOff,
  Camera,
  Scan,
} from "lucide-react";
import { LessonItem, InsertedFigure } from "../data/curriculum";
import {
  build2DSpecificationMatrix,
  generate2DSpecMatrixLatex,
  CLASSIC_BAC_FUNCTION_PRESETS,
  FunctionPreset,
  generateFunctionPlotAndTabSvg,
  createInsertedFigureFromFunctionPlot,
  generateOMRGridData,
  generateOMRLatexSnippet,
  getTypicalErrorsForLessons,
  ExtendedExamModelCode,
  OFFICIAL_BAC_ANNALES_BANK,
  buildTBIProjectorSteps,
} from "../utils/advancedPedagogicalTools";
import {
  SpecMatrix2DInspectorCard,
  AdaptiveApplyPayload,
} from "./SpecMatrix2DInspectorCard";

export type AdvancedPedagogyTabId =
  | "SPEC_2D"
  | "FUNCTION_PLOTTER"
  | "OMR_MODELS"
  | "DIDACTIC_ERRORS"
  | "BAC_ANNALES"
  | "TBI_PROJECTOR";

interface AdvancedMathPedagogyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AdvancedPedagogyTabId;
  lessons: LessonItem[];
  n1: number;
  n2: number;
  n3: number;
  onChangeSkillRatios?: (n1: number, n2: number, n3: number) => void;
  dsStructureMode: string;
  isMission: boolean;
  include2DSpecMatrix: boolean;
  onToggle2DSpecMatrix: (val: boolean) => void;
  includeOMRBubbleSheet: boolean;
  onToggleOMRBubbleSheet: (val: boolean) => void;
  omrQuestionCount: number;
  onChangeOmrQuestionCount: (count: number) => void;
  enableFourModelsABCD: boolean;
  onToggleFourModelsABCD: (val: boolean) => void;
  includeDidacticVigilanceSheet: boolean;
  onToggleDidacticVigilanceSheet: (val: boolean) => void;
  onInsertFigureToExam: (fig: InsertedFigure) => void;
  onInsertOfficialAnnaleExercise?: (lesson: LessonItem) => void;
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
  onOpenSmartQcmScanner?: () => void;
  onApplyAdaptiveWeightsAndExercises?: (payload: AdaptiveApplyPayload) => void;
}

export const AdvancedMathPedagogyModal: React.FC<AdvancedMathPedagogyModalProps> = ({
  isOpen,
  onClose,
  initialTab = "SPEC_2D",
  lessons,
  n1,
  n2,
  n3,
  onChangeSkillRatios,
  dsStructureMode,
  isMission,
  include2DSpecMatrix,
  onToggle2DSpecMatrix,
  includeOMRBubbleSheet,
  onToggleOMRBubbleSheet,
  omrQuestionCount,
  onChangeOmrQuestionCount,
  enableFourModelsABCD,
  onToggleFourModelsABCD,
  includeDidacticVigilanceSheet,
  onToggleDidacticVigilanceSheet,
  onInsertFigureToExam,
  onInsertOfficialAnnaleExercise,
  trackCode,
  trackNameAr,
  trackNameFr,
  dsKey,
  dsTitleAr,
  dsTitleFr,
  school,
  prof,
  year,
  academy,
  direction,
  onOpenSmartQcmScanner,
  onApplyAdaptiveWeightsAndExercises,
}) => {
  const [activeTab, setActiveTab] = useState<AdvancedPedagogyTabId>(initialTab);

  // Sync initialTab when opened
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Function Plotter State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    CLASSIC_BAC_FUNCTION_PRESETS[0].id
  );
  const [customJsExpr, setCustomJsExpr] = useState<string>("");
  const [customFormulaLabel, setCustomFormulaLabel] = useState<string>("");
  const [showVariationTable, setShowVariationTable] = useState<boolean>(true);
  const [showCurveGrid, setShowCurveGrid] = useState<boolean>(true);
  const [showTangents, setShowTangents] = useState<boolean>(true);
  const [showAsymptotes, setShowAsymptotes] = useState<boolean>(true);
  const [targetExerciseIdx, setTargetExerciseIdx] = useState<string>("ex_0");
  const [copiedCodeTag, setCopiedCodeTag] = useState<string | null>(null);
  const [insertedSuccessMsg, setInsertedSuccessMsg] = useState<boolean>(false);

  // Custom tkz-tab Sign & Variation Intervals Override (Point 1)
  const [customSignIntervals, setCustomSignIntervals] = useState<
    FunctionPreset["signIntervals"] | null
  >(null);

  // OMR State
  const [previewOmrModel, setPreviewOmrModel] = useState<ExtendedExamModelCode>("A");

  // Official Annales Bank State (Point 3)
  const [annalesSystemFilter, setAnnalesSystemFilter] = useState<
    "ALL" | "MAROC_NATIONAL" | "MISSION_FRANCAISE"
  >("ALL");
  const [insertedAnnaleId, setInsertedAnnaleId] = useState<string | null>(null);

  // Interactive TBI Projector State (Point 4)
  const [tbiActiveStepIdx, setTbiActiveStepIdx] = useState<number>(0);
  const [tbiRevealedSolutions, setTbiRevealedSolutions] = useState<Record<string, boolean>>({});
  const [tbiLargeFont, setTbiLargeFont] = useState<boolean>(true);

  const basePreset: FunctionPreset = useMemo(
    () =>
      CLASSIC_BAC_FUNCTION_PRESETS.find((p) => p.id === selectedPresetId) ||
      CLASSIC_BAC_FUNCTION_PRESETS[0],
    [selectedPresetId]
  );

  const activePreset: FunctionPreset = useMemo(
    () =>
      customSignIntervals
        ? { ...basePreset, signIntervals: customSignIntervals }
        : basePreset,
    [basePreset, customSignIntervals]
  );

  const specMatrix = useMemo(
    () =>
      build2DSpecificationMatrix(lessons, n1, n2, n3, dsStructureMode, isMission),
    [lessons, n1, n2, n3, dsStructureMode, isMission]
  );

  const plotOutput = useMemo(
    () =>
      generateFunctionPlotAndTabSvg(activePreset, {
        showVariationTable,
        showCurveGrid,
        showTangents,
        showAsymptotes,
        customJsExpr,
        customFormulaLabel,
      }),
    [
      activePreset,
      showVariationTable,
      showCurveGrid,
      showTangents,
      showAsymptotes,
      customJsExpr,
      customFormulaLabel,
    ]
  );

  const omrItems = useMemo(
    () => generateOMRGridData(lessons, omrQuestionCount),
    [lessons, omrQuestionCount]
  );

  const didacticCards = useMemo(() => getTypicalErrorsForLessons(lessons), [lessons]);

  const tbiSteps = useMemo(() => buildTBIProjectorSteps(lessons), [lessons]);

  const filteredAnnales = useMemo(
    () =>
      OFFICIAL_BAC_ANNALES_BANK.filter(
        (item) => annalesSystemFilter === "ALL" || item.system === annalesSystemFilter
      ),
    [annalesSystemFilter]
  );

  if (!isOpen) return null;

  const handleCopyLatex = (code: string, tag: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeTag(tag);
    setTimeout(() => setCopiedCodeTag(null), 2200);
  };

  const handleInsertPlotIntoSheet = () => {
    const fig = createInsertedFigureFromFunctionPlot(activePreset, targetExerciseIdx, {
      showVariationTable,
      showCurveGrid,
      showTangents,
      showAsymptotes,
      customJsExpr,
      customFormulaLabel,
    });
    onInsertFigureToExam(fig);
    setInsertedSuccessMsg(true);
    setTimeout(() => setInsertedSuccessMsg(false), 2800);
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 md:p-5 overflow-y-auto print:hidden"
    >
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-l from-indigo-950 via-slate-900 to-slate-900 px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black text-white">
                  أستوديو الهندسة الديداكتيكية والرياضية المتقدمة (4 أدوات ذكية)
                </h2>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                  Note 142-08 & AEFE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                جدول التخصيص ثنائي البعد · راسم منحنيات الدوال وجدول التغيرات (tkz-tab) · النماذج المتعددة A/B/C/D وورقة OMR · بنك الأخطاء الشائعة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5 p-2.5 bg-slate-950/70 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("SPEC_2D")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
              activeTab === "SPEC_2D"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/60"
                : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Table2 className="w-3.5 h-3.5 shrink-0" />
            <span>1. جدول التخصيص 2D</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("FUNCTION_PLOTTER")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
              activeTab === "FUNCTION_PLOTTER"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/60"
                : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <LineChart className="w-3.5 h-3.5 shrink-0" />
            <span>2. محرر tkz-tab والمنحنى</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("BAC_ANNALES")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
              activeTab === "BAC_ANNALES"
                ? "bg-amber-600 text-white shadow-md shadow-amber-950/60"
                : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>3. بنك البكالوريا (Annales)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("TBI_PROJECTOR")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
              activeTab === "TBI_PROJECTOR"
                ? "bg-violet-600 text-white shadow-md shadow-violet-950/60"
                : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5 shrink-0" />
            <span>4. السبورة التفاعلية (TBI)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("OMR_MODELS")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
              activeTab === "OMR_MODELS"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/60"
                : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span>5. النماذج A/B/C/D و OMR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("DIDACTIC_ERRORS")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
              activeTab === "DIDACTIC_ERRORS"
                ? "bg-rose-600 text-white shadow-md shadow-rose-950/60"
                : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>6. الأخطاء الشائعة واليقظة</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-200">
          {/* ==============================================================
              TAB 1: 2D SPECIFICATION MATRIX (Tableau de Spécification 2D)
             ============================================================== */}
          {activeTab === "SPEC_2D" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">
                      مصفوفة التخصيص ثنائية البعد (الدروس × المستويات المهارية N1 / N2 / N3)
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md">
                      مؤشر المطابقة 142-08 : {specMatrix.conformityScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    تُقاطع هذه المصفوفة كل درس أو مكون في الفرض مع المستويات المهارية الثلاثة لحساب عدد الأسئلة والنقط بدقة.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/40 px-3 py-2 rounded-xl text-xs font-bold text-indigo-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={include2DSpecMatrix}
                      onChange={(e) => onToggle2DSpecMatrix(e.target.checked)}
                      className="rounded accent-indigo-500 w-4 h-4"
                    />
                    <span>إدراج جدول التخصيص 2D في ورقة المعاينة A4</span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyLatex(generate2DSpecMatrixLatex(specMatrix), "SPEC_LATEX")
                    }
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {copiedCodeTag === "SPEC_LATEX" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">تم نسخ كود LaTeX</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ جدول LaTeX</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Skill Ratio Presets */}
              {onChangeSkillRatios && (
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs">
                  <span className="font-bold text-slate-300">
                    معايير التوازن المهاري السريعة (N1 / N2 / N3):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onChangeSkillRatios(35, 45, 20)}
                      className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                        n1 === 35 && n2 === 45 && n3 === 20
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      المذكرة 142-08 الرسمي (35% / 45% / 20%)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeSkillRatios(40, 45, 15)}
                      className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                        n1 === 40 && n2 === 45 && n3 === 15
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      تثبيت ودعم أساسي (40% / 45% / 15%)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeSkillRatios(25, 50, 25)}
                      className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                        n1 === 25 && n2 === 50 && n3 === 25
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      مسلك العلوم الرياضية / تميز (25% / 50% / 25%)
                    </button>
                  </div>
                </div>
              )}

              {/* 2D Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/50">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/90 text-slate-200 border-b border-slate-700">
                      <th className="p-3 text-right border-l border-slate-700">
                        المكون / الدرس (Chapitre)
                      </th>
                      <th className="p-3 text-center border-l border-slate-700 bg-sky-950/40 text-sky-300">
                        <div>المستوى N1 (تطبيق مباشر)</div>
                        <div className="text-[10px] font-mono opacity-80">
                          المستهدف: {n1}% ({((n1 * 20) / 100).toFixed(1)} ن)
                        </div>
                      </th>
                      <th className="p-3 text-center border-l border-slate-700 bg-indigo-950/40 text-indigo-300">
                        <div>المستوى N2 (استدلال وتعبئة)</div>
                        <div className="text-[10px] font-mono opacity-80">
                          المستهدف: {n2}% ({((n2 * 20) / 100).toFixed(1)} ن)
                        </div>
                      </th>
                      <th className="p-3 text-center border-l border-slate-700 bg-amber-950/40 text-amber-300">
                        <div>المستوى N3 (تركيب ومبادرة)</div>
                        <div className="text-[10px] font-mono opacity-80">
                          المستهدف: {n3}% ({((n3 * 20) / 100).toFixed(1)} ن)
                        </div>
                      </th>
                      <th className="p-3 text-center border-l border-slate-700">
                        الوزن (%)
                      </th>
                      <th className="p-3 text-center bg-emerald-950/40 text-emerald-300">
                        مجموع التمرين (/20)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {specMatrix.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                      >
                        <td className="p-3 border-l border-slate-800">
                          <div className="font-bold text-white">
                            تمرين {row.lessonIndex} : {row.lessonTitleAr}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {row.lessonTitleFr}
                          </div>
                        </td>
                        <td className="p-3 text-center border-l border-slate-800 font-mono">
                          <span className="inline-block bg-sky-500/15 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded font-bold">
                            {row.n1.questionsCount} س · {row.n1.points.toFixed(2)} ن
                          </span>
                        </td>
                        <td className="p-3 text-center border-l border-slate-800 font-mono">
                          <span className="inline-block bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                            {row.n2.questionsCount} س · {row.n2.points.toFixed(2)} ن
                          </span>
                        </td>
                        <td className="p-3 text-center border-l border-slate-800 font-mono">
                          <span className="inline-block bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                            {row.n3.questionsCount} س · {row.n3.points.toFixed(2)} ن
                          </span>
                        </td>
                        <td className="p-3 text-center border-l border-slate-800 font-mono font-bold text-slate-300">
                          {row.weightPercent}%
                        </td>
                        <td className="p-3 text-center font-mono font-black text-emerald-400">
                          {row.totalPoints.toFixed(2)} / 20 ({row.totalQuestions} أسئلة)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-800/95 font-extrabold text-white border-t-2 border-slate-600">
                      <td className="p-3 border-l border-slate-700">
                        المجموع العام للفرض المحروس
                      </td>
                      <td className="p-3 text-center border-l border-slate-700 font-mono text-sky-300">
                        {specMatrix.totals.n1Questions} س ·{" "}
                        {specMatrix.totals.n1Points.toFixed(2)} ن (
                        {specMatrix.totals.n1Percent}%)
                      </td>
                      <td className="p-3 text-center border-l border-slate-700 font-mono text-indigo-300">
                        {specMatrix.totals.n2Questions} س ·{" "}
                        {specMatrix.totals.n2Points.toFixed(2)} ن (
                        {specMatrix.totals.n2Percent}%)
                      </td>
                      <td className="p-3 text-center border-l border-slate-700 font-mono text-amber-300">
                        {specMatrix.totals.n3Questions} س ·{" "}
                        {specMatrix.totals.n3Points.toFixed(2)} ن (
                        {specMatrix.totals.n3Percent}%)
                      </td>
                      <td className="p-3 text-center border-l border-slate-700 font-mono">
                        100%
                      </td>
                      <td className="p-3 text-center font-mono text-emerald-300 text-sm">
                        {specMatrix.totals.grandTotalPoints.toFixed(2)} / 20 (
                        {specMatrix.totals.grandTotalQuestions} س)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* التبويب المدمج لتقييم المهارات المكتسبة للتلاميذ والتحيين التلقائي لأوزان المصفوفة 2D */}
              <div className="pt-2">
                <SpecMatrix2DInspectorCard
                  lessons={lessons}
                  n1={n1}
                  n2={n2}
                  n3={n3}
                  dsStructureMode={dsStructureMode}
                  isMission={isMission}
                  variant="interactive"
                  include2DSpecMatrix={include2DSpecMatrix}
                  onToggleIncludeInSheet={onToggle2DSpecMatrix}
                  onApplyPresetRatios={onChangeSkillRatios}
                  trackCode={trackCode}
                  trackNameAr={trackNameAr}
                  trackNameFr={trackNameFr}
                  dsKey={dsKey}
                  dsTitleAr={dsTitleAr}
                  dsTitleFr={dsTitleFr}
                  school={school}
                  prof={prof}
                  year={year}
                  academy={academy}
                  direction={direction}
                  initialSubTab="STUDENT_SKILL_ASSESSMENT"
                  onApplyAdaptiveWeightsAndExercises={
                    onApplyAdaptiveWeightsAndExercises
                  }
                />
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 2: AUTO FUNCTION CURVE & TKZ-TAB VARIATION TABLE ENGINE
             ============================================================== */}
          {activeTab === "FUNCTION_PLOTTER" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-4 bg-slate-800/50 border border-slate-700/80 rounded-xl p-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                  <LineChart className="w-4 h-4 text-emerald-400" />
                  <span>إعدادات الدالة العددية وجدول التغيرات (tkz-tab)</span>
                </h3>

                {/* Preset Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    اختر دالة مرجعية من نماذج الفروض والامتحانات:
                  </label>
                  <div className="space-y-1.5">
                    {CLASSIC_BAC_FUNCTION_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(p.id);
                          setCustomJsExpr("");
                          setCustomFormulaLabel("");
                          setCustomSignIntervals(null);
                        }}
                        className={`w-full text-right p-2.5 rounded-xl border text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                          selectedPresetId === p.id && !customJsExpr
                            ? "bg-emerald-950/70 border-emerald-500/60 text-white"
                            : "bg-slate-900/70 border-slate-700/70 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <div className="font-bold">{p.titleAr}</div>
                          <div className="text-[11px] font-mono text-emerald-300 mt-0.5" dir="ltr">
                            {p.titleFr}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 shrink-0">
                          {p.levelBadge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Point 1: Interactive tkz-tab Sign & Variation Table Customizer */}
                <div className="space-y-2 pt-2 border-t border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-cyan-300">
                      تخصيص مجالات الإشارة والتغيرات (tkz-tab) مباشرة:
                    </label>
                    {customSignIntervals && (
                      <button
                        type="button"
                        onClick={() => setCustomSignIntervals(null)}
                        className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        إعادة الضبط
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activePreset.signIntervals.map((iv, idx) => (
                      <div
                        key={idx}
                        dir="ltr"
                        className="grid grid-cols-5 gap-1.5 items-center bg-slate-950/80 border border-slate-800 p-1.5 rounded-lg text-[11px] font-mono"
                      >
                        <input
                          type="text"
                          value={iv.fromX}
                          onChange={(e) => {
                            const next = [...activePreset.signIntervals];
                            next[idx] = { ...next[idx], fromX: e.target.value };
                            setCustomSignIntervals(next);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-white"
                          title="بداية المجال x_i"
                        />
                        <input
                          type="text"
                          value={iv.toX}
                          onChange={(e) => {
                            const next = [...activePreset.signIntervals];
                            next[idx] = { ...next[idx], toX: e.target.value };
                            setCustomSignIntervals(next);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-white"
                          title="نهاية المجال x_{i+1}"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...activePreset.signIntervals];
                            const newSign = iv.sign === "+" ? "-" : "+";
                            next[idx] = {
                              ...next[idx],
                              sign: newSign,
                              variation: newSign === "+" ? "UP" : "DOWN",
                            };
                            setCustomSignIntervals(next);
                          }}
                          className={`font-black py-1 rounded border cursor-pointer ${
                            iv.sign === "+"
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                              : "bg-rose-950 text-rose-300 border-rose-500/50"
                          }`}
                          title="انقر لعكس إشارة المشتقة f'(x) واتجاه التغير"
                        >
                          f': {iv.sign} ({iv.variation === "UP" ? "↗" : "↘"})
                        </button>
                        <input
                          type="text"
                          value={iv.fromLimit}
                          onChange={(e) => {
                            const next = [...activePreset.signIntervals];
                            next[idx] = { ...next[idx], fromLimit: e.target.value };
                            setCustomSignIntervals(next);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-amber-300"
                          title="النهاية/القيمة عند البداية"
                        />
                        <input
                          type="text"
                          value={iv.toLimit}
                          onChange={(e) => {
                            const next = [...activePreset.signIntervals];
                            next[idx] = { ...next[idx], toLimit: e.target.value };
                            setCustomSignIntervals(next);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-amber-300"
                          title="النهاية/القيمة عند النهاية"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Function Expression Override */}
                <div className="space-y-2 pt-2 border-t border-slate-700/80">
                  <label className="text-xs font-bold text-amber-300 block">
                    أو أدخل تعبير دالة مخصصة f(x) لرسم منحناها فوراً:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={customJsExpr}
                    onChange={(e) => setCustomJsExpr(e.target.value)}
                    placeholder="Ex: x^3 - 3*x + 1  ou  (x-1)*exp(x) + 1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={customFormulaLabel}
                    onChange={(e) => setCustomFormulaLabel(e.target.value)}
                    placeholder="عنوان المنحنى (اختياري): f(x) = x^2 - 2x"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Display Checkboxes */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/80 text-xs">
                  <label className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVariationTable}
                      onChange={(e) => setShowVariationTable(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>جدول التغيرات (tkz-tab)</span>
                  </label>
                  <label className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCurveGrid}
                      onChange={(e) => setShowCurveGrid(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>المنحنى (C_f) والمعلم</span>
                  </label>
                  <label className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTangents}
                      onChange={(e) => setShowTangents(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>المماسات الأفقية (f'(x)=0)</span>
                  </label>
                  <label className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAsymptotes}
                      onChange={(e) => setShowAsymptotes(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>المقاربات الهندسية (Δ)</span>
                  </label>
                </div>

                {/* Insert into Exercise Action */}
                <div className="pt-3 border-t border-slate-700 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-300 shrink-0">
                      إدراج الشكل في:
                    </label>
                    <select
                      value={targetExerciseIdx}
                      onChange={(e) => setTargetExerciseIdx(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    >
                      {lessons.map((l, idx) => (
                        <option key={idx} value={`ex_${idx}`}>
                          التمرين {idx + 1} : {l.lessonAr}
                        </option>
                      ))}
                      <option value="prob_synthese">المسألة التوليفية الشاملة (Problème)</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleInsertPlotIntoSheet}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-emerald-950/60 transition cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>إدراج المنحنى وجدول التغيرات في ورقة الفرض A4</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyLatex(plotOutput.tikzCode, "TIKZ_PLOT")}
                      className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 text-slate-200 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {copiedCodeTag === "TIKZ_PLOT" ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">تم نسخ TikZ</span>
                        </>
                      ) : (
                        <>
                          <FileCode2 className="w-4 h-4 text-amber-400" />
                          <span>نسخ كود tkz-tab</span>
                        </>
                      )}
                    </button>
                  </div>

                  {insertedSuccessMsg && (
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>تم إدراج جدول التغيرات والمنحنى (C_f) بنجاح داخل ورقة الفرض A4!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Live SVG & TikZ Preview Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-xl p-3 border-2 border-slate-700 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 text-xs text-slate-800">
                    <span className="font-black">
                      معاينة حية عالية الدقة (SVG Vectoriel — جاهز للطباعة A4)
                    </span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-indigo-900 font-bold" dir="ltr">
                      {activePreset.formulaLatex}
                    </span>
                  </div>
                  <div
                    className="w-full overflow-hidden rounded-lg border border-slate-200"
                    dangerouslySetInnerHTML={{ __html: plotOutput.svgMarkup }}
                  />
                </div>

                {/* TikZ Code Preview Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 font-mono">
                      كود LaTeX / TikZ & tkz-tab المولد تلقائياً:
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                      \usepackage&#123;tikz, tkz-tab, pgfplots&#125;
                    </span>
                  </div>
                  <pre
                    dir="ltr"
                    className="text-[11px] font-mono text-emerald-300 bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto max-h-36 leading-relaxed"
                  >
                    {plotOutput.tikzCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 3: MULTI-MODEL EXAMS (A/B/C/D) & OMR BUBBLE SHEET
             ============================================================== */}
          {activeTab === "OMR_MODELS" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Multi-Model A/B/C/D Card */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-black text-white">
                        نظام النماذج المتعددة المتوازية (Modèles A / B / C / D)
                      </h3>
                    </div>
                    <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      مكافحة الغش
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    يتيح توليد 4 نماذج متكافئة الصعوبة (A و B و C و D) مع تبديل آلي لترتيب التمارين والأسئلة وخيارات QCM لمنع الغش داخل الأقسام المكتظة.
                  </p>
                  <label className="flex items-center justify-between gap-3 bg-slate-900/90 border border-cyan-500/40 p-3 rounded-xl cursor-pointer">
                    <div className="text-xs font-bold text-cyan-200">
                      تفعيل توليد 4 نماذج كاملة (A + B + C + D) في المعاينة والطباعة
                    </div>
                    <input
                      type="checkbox"
                      checked={enableFourModelsABCD}
                      onChange={(e) => onToggleFourModelsABCD(e.target.checked)}
                      className="w-4 h-4 accent-cyan-500"
                    />
                  </label>
                </div>

                {/* OMR Bubble Sheet Card */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-black text-white">
                        ورقة الإجابة والتصحيح البصري السريع (OMR Bubble Grid)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {onOpenSmartQcmScanner && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenSmartQcmScanner();
                          }}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg text-[11px] font-black text-white shadow-xs transition cursor-pointer"
                        >
                          <Scan className="w-3.5 h-3.5" />
                          <span>فتح ماسح الكاميرا الذكي OMR</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyLatex(
                            generateOMRLatexSnippet(omrItems, previewOmrModel),
                            "OMR_LATEX"
                          )
                        }
                        className="flex items-center gap-1 bg-slate-900 hover:bg-slate-700 border border-slate-600 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-200 cursor-pointer"
                      >
                        {copiedCodeTag === "OMR_LATEX" ? (
                          <span className="text-emerald-300">✓ تم نسخ LaTeX</span>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>كود LaTeX</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex-1 flex items-center justify-between gap-2 bg-slate-900/90 border border-amber-500/40 p-3 rounded-xl cursor-pointer">
                      <span className="text-xs font-bold text-amber-200">
                        إدراج شبكة OMR في ورقة الفرض A4
                      </span>
                      <input
                        type="checkbox"
                        checked={includeOMRBubbleSheet}
                        onChange={(e) => onToggleOMRBubbleSheet(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </label>

                    <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-bold">عدد أسئلة OMR:</span>
                      <select
                        value={omrQuestionCount}
                        onChange={(e) => onChangeOmrQuestionCount(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 font-mono font-bold text-white"
                      >
                        <option value={6}>6 أسئلة</option>
                        <option value={8}>8 أسئلة</option>
                        <option value={10}>10 أسئلة</option>
                        <option value={12}>12 سؤالاً</option>
                        <option value={16}>16 سؤالاً</option>
                        <option value={20}>20 سؤالاً</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* OMR Preview & Multi-Model Answer Key Matrix */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="text-xs font-extrabold text-white">
                    مصفوفة مفاتيح الإجابة الآلية للنماذج الأربعة (Clé de Correction OMR — Modèles A / B / C / D):
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(["A", "B", "C", "D"] as ExtendedExamModelCode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPreviewOmrModel(m)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-xs font-extrabold transition cursor-pointer ${
                          previewOmrModel === m
                            ? "bg-cyan-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        نموذج {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {omrItems.map((item) => {
                    const correctOpt = item.correctByModel[previewOmrModel];
                    return (
                      <div
                        key={item.questionNum}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-black text-white">
                            Q{item.questionNum}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {item.points} ن
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 pt-1" dir="ltr">
                          {(["A", "B", "C", "D"] as const).map((opt) => (
                            <span
                              key={opt}
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-black border ${
                                correctOpt === opt
                                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs"
                                  : "bg-slate-950 text-slate-400 border-slate-700"
                              }`}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.domainAr}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 4: DIDACTIC ERRORS BANK (Banque d'Erreurs Typiques)
             ============================================================== */}
          {activeTab === "DIDACTIC_ERRORS" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white">
                    مكتبة الأخطاء الشائعة للمتعلمين وبطاقات اليقظة الديداكتيكية (Banque d'Erreurs Typiques)
                  </h3>
                  <p className="text-xs text-slate-400">
                    ترصد التمثلات الخاطئة الأكثر تردداً في أوراق التحرير لكل درس مختار في الفرض مع أصلها المعرفي وخطة المعالجة الفورية.
                  </p>
                </div>

                <label className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/40 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDidacticVigilanceSheet}
                    onChange={(e) => onToggleDidacticVigilanceSheet(e.target.checked)}
                    className="rounded accent-rose-500 w-4 h-4"
                  />
                  <span>إرفاق بطاقة اليقظة والأخطاء الشائعة في ملاحق الفرض A4</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {didacticCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <div className="font-black text-xs text-white">
                            {card.lessonTitleAr}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {card.lessonTitleFr}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            card.severity === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {card.severity === "CRITICAL" ? "خطأ شائع حرج" : "يقظة ديداكتيكية"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-200 leading-relaxed">
                        <span className="font-bold text-rose-400">⚠ الخطأ المرصود: </span>
                        {card.frequentMistakeAr}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1" dir="ltr">
                        <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-2 text-[11px] font-mono text-rose-200">
                          <div className="text-[9.5px] font-bold text-rose-400 mb-0.5">
                            ✗ الكتابة الخاطئة الشائعة:
                          </div>
                          {card.wrongExpressionLatex}
                        </div>
                        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-2 text-[11px] font-mono text-emerald-200">
                          <div className="text-[9.5px] font-bold text-emerald-400 mb-0.5">
                            ✓ الصياغة الرياضية السليمة:
                          </div>
                          {card.correctExpressionLatex}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div className="text-slate-400">
                        <strong className="text-amber-300">العائق الديداكتيكي: </strong>
                        {card.cognitiveOriginAr}
                      </div>
                      <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-2 text-indigo-200 font-semibold">
                        <strong className="text-cyan-300">💡 توجيه الأستاذ في التصحيح: </strong>
                        {card.teacherRemediationTipAr}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 5: OFFICIAL BAC ANNALES BANK (Point 3)
             ============================================================== */}
          {activeTab === "BAC_ANNALES" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>
                      بنك مواضيع وحوليات البكالوريا الرسمية (الامتحان الوطني المغربي & Bac AEFE 2023–2025)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    أدرج بنقرة واحدة تمريناً أو مسألة رسمية من الامتحانات الوطنية الموحدة أو بكالوريا البعثة الفرنسية (مرفقة بعناصر الإجابة الرسمية) داخل فرضك المحروس.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {[
                    { id: "ALL", label: "الكل (المغرب + AEFE)" },
                    { id: "MAROC_NATIONAL", label: "الامتحان الوطني المغربي" },
                    { id: "MISSION_FRANCAISE", label: "Bac AEFE (المغرب)" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setAnnalesSystemFilter(btn.id as typeof annalesSystemFilter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                        annalesSystemFilter === btn.id
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAnnales.map((annale) => (
                  <div
                    key={annale.id}
                    className="bg-slate-950/85 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                        <div>
                          <div className="text-xs font-black text-amber-300">
                            {annale.sessionAr}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400" dir="ltr">
                            {annale.sessionFr}
                          </div>
                        </div>
                        <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0">
                          {annale.trackBadge}
                        </span>
                      </div>

                      <div className="text-xs font-extrabold text-white">
                        {annale.lessonItem.lessonAr}
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 space-y-1 text-[11px] text-slate-300 max-h-40 overflow-y-auto">
                        {(annale.lessonItem.sampleExerciseAr || []).map((q, qIdx) => (
                          <div key={qIdx} className="leading-relaxed">
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-emerald-400 font-bold">
                        ✓ مرفق بعناصر الإجابة الرسمية (Corrigé officiel)
                      </span>
                      {onInsertOfficialAnnaleExercise && (
                        <button
                          type="button"
                          onClick={() => {
                            onInsertOfficialAnnaleExercise(annale.lessonItem);
                            setInsertedAnnaleId(annale.id);
                            setTimeout(() => setInsertedAnnaleId(null), 2500);
                          }}
                          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
                        >
                          {insertedAnnaleId === annale.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>تم الإدراج في الفرض!</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-4 h-4" />
                              <span>إدراج هذا التمرين في الفرض</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 6: INTERACTIVE SMARTBOARD / TBI PROJECTOR MODE (Point 4)
             ============================================================== */}
          {activeTab === "TBI_PROJECTOR" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-violet-950/50 border border-violet-500/40 rounded-xl p-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4 text-violet-300" />
                    <span>
                      وضع السبورة التفاعلية والعرض التدريجي داخل القسم (Mode TBI / Vidéoprojecteur Step-by-Step)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    اعرض أسئلة الفرض سؤالاً بسؤال بخط مكبر عالي التباين، واكشف عناصر الإجابة تدريجياً أثناء حصة التصحيح الجماعي.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTbiLargeFont((v) => !v)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800 cursor-pointer"
                  >
                    {tbiLargeFont ? "حجم خط السبورة: كبير جداً (XL)" : "حجم خط عادي"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const all: Record<string, boolean> = {};
                      tbiSteps.forEach((s) => {
                        all[s.id] = true;
                      });
                      setTbiRevealedSolutions(all);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-xs font-bold text-emerald-200 hover:bg-emerald-600/40 cursor-pointer"
                  >
                    إظهار جميع الحلول
                  </button>
                  <button
                    type="button"
                    onClick={() => setTbiRevealedSolutions({})}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/30 border border-rose-500/40 text-xs font-bold text-rose-200 hover:bg-rose-600/40 cursor-pointer"
                  >
                    إخفاء جميع الحلول
                  </button>
                </div>
              </div>

              {tbiSteps.length > 0 && (
                <div className="bg-slate-950 border-2 border-violet-500/40 rounded-2xl p-5 space-y-5 shadow-2xl">
                  {(() => {
                    const safeIdx = Math.min(tbiSteps.length - 1, Math.max(0, tbiActiveStepIdx));
                    const currentStep = tbiSteps[safeIdx];
                    const isRevealed = Boolean(tbiRevealedSolutions[currentStep.id]);

                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-violet-600 text-white font-mono font-black text-xs px-3 py-1 rounded-lg">
                              المرحلة {safeIdx + 1} / {tbiSteps.length}
                            </span>
                            <span className="text-xs font-extrabold text-violet-200">
                              {currentStep.exerciseBadgeAr}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg font-bold">
                              سلم التنقيط: {currentStep.points} ن
                            </span>
                            <span className="bg-indigo-950 text-indigo-300 border border-indigo-700 px-2.5 py-1 rounded-lg font-bold">
                              المستوى: {currentStep.cognitiveLevel}
                            </span>
                          </div>
                        </div>

                        {/* Question Box */}
                        <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 space-y-2.5">
                          <div className="text-[11px] font-bold text-cyan-400">
                            نص السؤال المعروض للتلاميذ (Énoncé de la question) :
                          </div>
                          <div
                            className={`font-bold text-white leading-relaxed ${
                              tbiLargeFont ? "text-lg md:text-xl" : "text-sm"
                            }`}
                          >
                            {currentStep.questionAr}
                          </div>
                          <div
                            dir="ltr"
                            className={`font-mono text-slate-300 border-t border-slate-800 pt-2 ${
                              tbiLargeFont ? "text-base" : "text-xs"
                            }`}
                          >
                            {currentStep.questionFr}
                          </div>
                        </div>

                        {/* Progressive Solution Reveal Box */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                setTbiRevealedSolutions((prev) => ({
                                  ...prev,
                                  [currentStep.id]: !prev[currentStep.id],
                                }))
                              }
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition cursor-pointer ${
                                isRevealed
                                  ? "bg-amber-600 hover:bg-amber-500 text-slate-950"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60"
                              }`}
                            >
                              {isRevealed ? (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  <span>إخفاء الحل المرحلي</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  <span>إظهار الحل وعناصر الإجابة على السبورة</span>
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={safeIdx === 0}
                                onClick={() => setTbiActiveStepIdx((i) => Math.max(0, i - 1))}
                                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                                <span>السؤال السابق</span>
                              </button>
                              <button
                                type="button"
                                disabled={safeIdx >= tbiSteps.length - 1}
                                onClick={() =>
                                  setTbiActiveStepIdx((i) => Math.min(tbiSteps.length - 1, i + 1))
                                }
                                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                              >
                                <span>السؤال الموالي</span>
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {isRevealed ? (
                            <div className="bg-emerald-950/45 border-2 border-emerald-500/50 rounded-xl p-4 space-y-2.5 animate-in fade-in">
                              <div className="flex items-center justify-between text-xs font-black text-emerald-300">
                                <span>✓ عناصر الإجابة والبرهان المفصل (Corrigé & Barème) :</span>
                                <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded">
                                  [{currentStep.points} pt]
                                </span>
                              </div>
                              <div
                                className={`font-bold text-emerald-100 leading-relaxed ${
                                  tbiLargeFont ? "text-base md:text-lg" : "text-xs"
                                }`}
                              >
                                {currentStep.solutionAr}
                              </div>
                              <div
                                dir="ltr"
                                className={`font-mono text-emerald-200/90 border-t border-emerald-800/60 pt-2 ${
                                  tbiLargeFont ? "text-sm md:text-base" : "text-xs"
                                }`}
                              >
                                {currentStep.solutionFr}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-900/50 border border-dashed border-slate-700 rounded-xl p-5 text-center text-xs text-slate-400">
                              الحل مخفي حالياً لإتاحة مهلة التفكير للتلاميذ على السبورة — انقر على «إظهار الحل وعناصر الإجابة» لكشفه.
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>
              جميع التعديلات والرسوم المبيانية وجداول التخصيص تنعكس مباشرة في المعاينة المباشرة A4 وكود LaTeX.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-5 py-2 rounded-xl transition cursor-pointer"
          >
            تم والعودة إلى المعاينة A4
          </button>
        </div>
      </div>
    </div>
  );
};
