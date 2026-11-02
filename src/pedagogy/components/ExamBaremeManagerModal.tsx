import React, { useState, useMemo } from "react";
import {
  X,
  Sparkles,
  Check,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  PenLine,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DSQuestionDensity,
  LessonItem,
  MoroccanDSStructureMode,
  QuestionMeta,
  getQuestionBaremesAndLevels,
  getVariantQuestions,
} from "../data/curriculum";
import { validateCustomQuestionWithMathJS } from "../utils/mathjsValidator";

export interface ExamBaremeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: LessonItem[];
  n1: number;
  n2: number;
  n3: number;
  customQuestionBaremesMap: Record<string, number[]>;
  onUpdateQuestionBaremes: (lessonKey: string, baremes: number[]) => void;
  customQuestionLevelsMap?: Record<string, Array<"N1" | "N2" | "N3">>;
  onUpdateQuestionLevels?: (lessonKey: string, levels: Array<"N1" | "N2" | "N3">) => void;
  onUpdateCustomQuestions?: (
    lessonKey: string,
    questionsAr: string[],
    questionsFr: string[]
  ) => void;
  onResetAllBaremes: () => void;
  showQuestionBareme: boolean;
  onToggleShowQuestionBareme: (show: boolean) => void;
  includeGradingScaleTable: boolean;
  onToggleIncludeGradingScaleTable: (include: boolean) => void;
  currentTrackCode: string;
  isFr: boolean;
  dsQuestionDensity?: DSQuestionDensity;
  dsStructureMode?: MoroccanDSStructureMode;
  isMission?: boolean;
}

export const ExamBaremeManagerModal: React.FC<ExamBaremeManagerModalProps> = ({
  isOpen,
  onClose,
  lessons,
  n1,
  n2,
  n3,
  customQuestionBaremesMap,
  onUpdateQuestionBaremes,
  customQuestionLevelsMap = {},
  onUpdateQuestionLevels,
  onUpdateCustomQuestions,
  onResetAllBaremes,
  showQuestionBareme,
  onToggleShowQuestionBareme,
  includeGradingScaleTable,
  onToggleIncludeGradingScaleTable,
  currentTrackCode,
  isFr,
  dsQuestionDensity = "STANDARD",
  dsStructureMode = "STANDARD_142_08",
  isMission = false,
}) => {
  const [editingQuestionKey, setEditingQuestionKey] = useState<string | null>(null);
  const [draftAr, setDraftAr] = useState("");
  const [draftFr, setDraftFr] = useState("");

  const hasQCM =
    !isMission &&
    (dsStructureMode === "QCM_ET_EXERCICES" || dsStructureMode === "COMPLETE_EXAM_MAROC");
  const hasSynthesisProblem =
    !isMission &&
    (dsStructureMode === "EXERCICES_ET_PROBLEME" || dsStructureMode === "COMPLETE_EXAM_MAROC");

  const fixedQcmPoints = hasQCM ? 4.0 : 0;
  const fixedProblemPoints = hasSynthesisProblem ? 8.5 : 0;
  const targetExercisesBudget = Math.max(4, 20 - fixedQcmPoints - fixedProblemPoints);
  const scaleFactor = targetExercisesBudget / 20;

  // استخراج تفاصيل الأسئلة الفعلية والتنقيط لكل تمرين بالتطابق التام مع ورقة المعاينة
  const exercisesData = useMemo(() => {
    return lessons.map((lesson, exIdx) => {
      const lessonKey = `${currentTrackCode}_${lesson.lessonFr}`;
      const variant = getVariantQuestions(lesson, "A", false, 0, dsQuestionDensity);
      const questionsAr = variant.questionsAr;
      const questionsFr = variant.questionsFr;
      const qCount = Math.max(1, questionsAr.length);
      const customBaremes = customQuestionBaremesMap[lessonKey];
      const customLevels = customQuestionLevelsMap[lessonKey] || lesson.customQuestionLevels;
      const effectiveWeight = Number((lesson.weight * scaleFactor).toFixed(2));

      const metas: QuestionMeta[] = getQuestionBaremesAndLevels(
        effectiveWeight,
        qCount,
        n1,
        n2,
        n3,
        customBaremes,
        customLevels
      );

      const exTotal = metas.reduce((sum, m) => sum + parseFloat(m.points || "0"), 0);

      return {
        lesson,
        lessonKey,
        exIdx,
        qCount,
        questionsAr,
        questionsFr,
        metas,
        exTotal: parseFloat(exTotal.toFixed(2)),
        expectedExTotal: parseFloat(((effectiveWeight * 20) / 100).toFixed(2)),
      };
    });
  }, [
    lessons,
    currentTrackCode,
    customQuestionBaremesMap,
    customQuestionLevelsMap,
    n1,
    n2,
    n3,
    dsQuestionDensity,
    scaleFactor,
  ]);

  // المجموع الكلي لنقط الفرض شاملاً التمارين الموضوعاتية + QCM + المسألة التوليفية
  const totalExamScore = useMemo(() => {
    const exSum = exercisesData.reduce((acc, curr) => acc + curr.exTotal, 0);
    return parseFloat((exSum + fixedQcmPoints + fixedProblemPoints).toFixed(2));
  }, [exercisesData, fixedQcmPoints, fixedProblemPoints]);

  const scoreDiff = parseFloat((totalExamScore - 20.0).toFixed(2));
  const isPerfect20 = Math.abs(scoreDiff) < 0.05;

  // حساب التوزيع الفعلي للمستويات المهارية N1 / N2 / N3
  const skillDistribution = useMemo(() => {
    let n1Pts = fixedQcmPoints;
    let n2Pts = hasSynthesisProblem ? 4.75 : 0;
    let n3Pts = hasSynthesisProblem ? 3.75 : 0;

    exercisesData.forEach((ex) => {
      ex.metas.forEach((m) => {
        const val = parseFloat(m.points || "0");
        if (m.level === "N1") n1Pts += val;
        else if (m.level === "N3") n3Pts += val;
        else n2Pts += val;
      });
    });

    const total = Math.max(0.25, n1Pts + n2Pts + n3Pts);
    return {
      n1Pts: parseFloat(n1Pts.toFixed(2)),
      n2Pts: parseFloat(n2Pts.toFixed(2)),
      n3Pts: parseFloat(n3Pts.toFixed(2)),
      n1Pct: Math.round((n1Pts / total) * 100),
      n2Pct: Math.round((n2Pts / total) * 100),
      n3Pct: Math.round((n3Pts / total) * 100),
    };
  }, [exercisesData, fixedQcmPoints, hasSynthesisProblem]);

  if (!isOpen) return null;

  // تعديل نقطة سؤال معين (+/- 0.25)
  const handleModifyPoint = (
    lessonKey: string,
    currentMetas: QuestionMeta[],
    qIdx: number,
    delta: number
  ) => {
    const currentPoints = currentMetas.map((m) => parseFloat(m.points || "0"));
    const newVal = Math.max(0.25, parseFloat((currentPoints[qIdx] + delta).toFixed(2)));
    currentPoints[qIdx] = newVal;
    onUpdateQuestionBaremes(lessonKey, currentPoints);
  };

  // إدخال نقطة مباشرة لسؤال
  const handleDirectSetPoint = (
    lessonKey: string,
    currentMetas: QuestionMeta[],
    qIdx: number,
    valStr: string
  ) => {
    const val = parseFloat(valStr);
    if (isNaN(val) || val <= 0) return;
    const currentPoints = currentMetas.map((m) => parseFloat(m.points || "0"));
    currentPoints[qIdx] = parseFloat(val.toFixed(2));
    onUpdateQuestionBaremes(lessonKey, currentPoints);
  };

  // تبديل المستوى المهاري لسؤال (N1 -> N2 -> N3)
  const handleCycleQuestionLevel = (
    lessonKey: string,
    currentMetas: QuestionMeta[],
    qIdx: number
  ) => {
    if (!onUpdateQuestionLevels) return;
    const currentLevels = currentMetas.map((m) => m.level);
    const cur = currentLevels[qIdx];
    currentLevels[qIdx] = cur === "N1" ? "N2" : cur === "N2" ? "N3" : "N1";
    onUpdateQuestionLevels(lessonKey, currentLevels);
  };

  // موازنة تلقائية دقيقة لجعل مجموع الفرض 20.00 نقطة تماماً بمضاعفات 0.25
  const handleAutoBalance20 = () => {
    const totalWeight = lessons.reduce((s, l) => s + l.weight, 0) || 100;
    let allocatedTotal = 0;

    exercisesData.forEach((ex, idx) => {
      const isLastEx = idx === exercisesData.length - 1;
      const exTargetPts = isLastEx
        ? Math.max(0.5, Math.round((targetExercisesBudget - allocatedTotal) * 4) / 4)
        : Math.max(
            0.5,
            Math.round(((ex.lesson.weight / totalWeight) * targetExercisesBudget) * 4) / 4
          );
      allocatedTotal += exTargetPts;

      const canonical = getQuestionBaremesAndLevels(
        (exTargetPts / 20) * 100,
        ex.qCount,
        n1,
        n2,
        n3,
        undefined,
        ex.metas.map((m) => m.level)
      );
      const pts = canonical.map((c) => parseFloat(c.points));
      onUpdateQuestionBaremes(ex.lessonKey, pts);
    });
  };

  // حفظ تعديل نص السؤال بعد التحقق والتنقية التلقائية بواسطة مكتبة mathjs قبل عرضه في معاينة الورقة
  const handleSaveEditedQuestion = (ex: (typeof exercisesData)[number], qIdx: number) => {
    if (!onUpdateCustomQuestions) return;
    const nextAr = [...ex.questionsAr];
    const nextFr = [...ex.questionsFr];
    if (draftAr.trim()) {
      const validatedAr = validateCustomQuestionWithMathJS(draftAr.trim());
      nextAr[qIdx] = validatedAr.sanitizedText;
    }
    if (draftFr.trim()) {
      const validatedFr = validateCustomQuestionWithMathJS(draftFr.trim());
      nextFr[qIdx] = validatedFr.sanitizedText;
    }
    onUpdateCustomQuestions(ex.lessonKey, nextAr, nextFr);
    setEditingQuestionKey(null);
  };

  // إضافة سؤال جديد للتمرين
  const handleAddQuestionToExercise = (ex: (typeof exercisesData)[number]) => {
    if (!onUpdateCustomQuestions) return;
    const newNum = ex.questionsAr.length + 1;
    const nextAr = [
      ...ex.questionsAr,
      `${newNum}. سؤال إضافي (${ex.lesson.lessonAr}): استنتج القيمة المضبوطة أو برهن على العلاقة المطلوبة.`,
    ];
    const nextFr = [
      ...ex.questionsFr,
      `${newNum}. Question supplémentaire (${ex.lesson.lessonFr}) : En déduire la valeur exacte ou démontrer la relation demandée.`,
    ];
    onUpdateCustomQuestions(ex.lessonKey, nextAr, nextFr);
    const nextPts = [...ex.metas.map((m) => parseFloat(m.points || "0")), 0.75];
    onUpdateQuestionBaremes(ex.lessonKey, nextPts);
  };

  // حذف سؤال من التمرين
  const handleDeleteQuestionFromExercise = (
    ex: (typeof exercisesData)[number],
    qIdx: number
  ) => {
    if (!onUpdateCustomQuestions || ex.questionsAr.length <= 1) return;
    const nextAr = ex.questionsAr.filter((_, i) => i !== qIdx);
    const nextFr = ex.questionsFr.filter((_, i) => i !== qIdx);
    onUpdateCustomQuestions(ex.lessonKey, nextAr, nextFr);
    const nextPts = ex.metas
      .map((m) => parseFloat(m.points || "0"))
      .filter((_, i) => i !== qIdx);
    onUpdateQuestionBaremes(ex.lessonKey, nextPts);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs">
      <div
        dir="rtl"
        className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* الترويسة العلوية للمودال */}
        <div className="p-4 sm:p-5 cool-header-gradient text-white flex items-center justify-between border-b border-cyan-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-serif text-lg font-black shadow-sm">
              ∑
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
                <span>المذكرة الوزارية رقم 142-08</span>
                <span aria-hidden="true">·</span>
                <span>تجزئة النقط وتحرير الأسئلة والمستويات المهارية</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                هندسة الفرض المحروس وتجزئة سلم التنقيط (20/20 ن)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* شريط الإحصائيات والمراقبة الحية لـ 20/20 */}
        <div className="p-3 sm:p-4 bg-slate-100/90 border-b border-slate-200 shrink-0 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* مؤشر مجموع الفرض الكلي */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm tabular-nums ${
                  isPerfect20
                    ? "bg-emerald-50 text-emerald-950 border-emerald-300"
                    : "bg-amber-50 text-amber-950 border-amber-300"
                }`}
              >
                {isPerfect20 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>المجموع الكلي للفرض :</span>
                <span className="text-base font-extrabold underline underline-offset-4">
                  {totalExamScore.toFixed(2)} / 20.00 ن
                </span>
              </div>

              {(hasQCM || hasSynthesisProblem) && (
                <div className="text-[11px] font-bold text-slate-600 tabular-nums flex items-center gap-1.5">
                  {hasQCM && <span>QCM: 4.00 ن</span>}
                  {hasQCM && hasSynthesisProblem && <span aria-hidden="true">+</span>}
                  {hasSynthesisProblem && <span>مسألة توليفية: 8.50 ن</span>}
                  <span aria-hidden="true">+</span>
                  <span>التمارين: {(totalExamScore - fixedQcmPoints - fixedProblemPoints).toFixed(2)} ن</span>
                </div>
              )}

              {!isPerfect20 && (
                <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg tabular-nums">
                  {scoreDiff > 0
                    ? `فائض +${scoreDiff.toFixed(2)} ن عن 20/20`
                    : `ينقص ${Math.abs(scoreDiff).toFixed(2)} ن لاكتمال 20/20`}
                </span>
              )}
            </div>

            {/* أزرار العمليات السريعة */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoBalance20}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>موازنة تلقائية 20.00/20 (142-08)</span>
              </button>
              <button
                type="button"
                onClick={onResetAllBaremes}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استرجاع الافتراضي</span>
              </button>
            </div>
          </div>

          {/* بارومتر توزيع المستويات المهارية N1 / N2 / N3 */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-800">
                المستوى N1 (تطبيق مباشر · المعيار 35%) :
              </span>
              <span className="font-mono font-black text-cyan-800 tabular-nums">
                {skillDistribution.n1Pts} ن ({skillDistribution.n1Pct}%)
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-800">
                المستوى N2 (تعبئة وتوليف · المعيار 45%) :
              </span>
              <span className="font-mono font-black text-teal-800 tabular-nums">
                {skillDistribution.n2Pts} ن ({skillDistribution.n2Pct}%)
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-800">
                المستوى N3 (مبادرة وبرهان · المعيار 20%) :
              </span>
              <span className="font-mono font-black text-sky-900 tabular-nums">
                {skillDistribution.n3Pts} ن ({skillDistribution.n3Pct}%)
              </span>
            </div>
          </div>
        </div>

        {/* محتوى التمارين وتجزئة الأسئلة وتحريرها التفاعلي */}
        <div className="p-4 sm:p-5 overflow-y-auto studio-scroll space-y-4 flex-1">
          {exercisesData.map((ex) => (
            <div
              key={ex.lessonKey}
              className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 hover:border-slate-300 transition"
            >
              {/* ترويسة التمرين */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center tabular-nums">
                    {ex.exIdx + 1}
                  </span>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-slate-950">
                      التمرين {ex.exIdx + 1} : {isFr ? ex.lesson.lessonFr : ex.lesson.lessonAr}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 tabular-nums">
                      <span>الوزن النسبي: {ex.lesson.weight}%</span>
                      <span aria-hidden="true">·</span>
                      <span>الحصة المعيارية: {ex.expectedExTotal} ن</span>
                      <span aria-hidden="true">·</span>
                      <span>{ex.qCount} أسئلة</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onUpdateCustomQuestions && (
                    <button
                      type="button"
                      onClick={() => handleAddQuestionToExercise(ex)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-700" />
                      <span>إضافة سؤال للتمرين</span>
                    </button>
                  )}
                  <span
                    className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg border tabular-nums ${
                      Math.abs(ex.exTotal - ex.expectedExTotal) < 0.15
                        ? "bg-slate-100 text-slate-900 border-slate-200"
                        : "bg-amber-50 text-amber-900 border-amber-300"
                    }`}
                  >
                    مجموع التمرين: {ex.exTotal.toFixed(2)} ن
                  </span>
                </div>
              </div>

              {/* شبكة الأسئلة وأزرار التنقيط والتحرير */}
              <div className="grid grid-cols-1 gap-2">
                {ex.metas.map((meta, qIdx) => {
                  const currentPt = parseFloat(meta.points || "0");
                  const qTextAr = ex.questionsAr[qIdx] || `السؤال ${qIdx + 1}`;
                  const qTextFr = ex.questionsFr[qIdx] || `Question ${qIdx + 1}`;
                  const editKey = `${ex.lessonKey}__${qIdx}`;
                  const isEditingThis = editingQuestionKey === editKey;

                  return (
                    <div
                      key={qIdx}
                      className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        {/* رقم السؤال ونص السؤال */}
                        <div className="flex items-start gap-2 min-w-[220px] flex-1">
                          <span className="font-mono font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 tabular-nums shrink-0">
                            س{qIdx + 1}
                          </span>
                          <span className="text-slate-800 font-medium leading-relaxed">
                            {isFr ? qTextFr : qTextAr}
                          </span>
                        </div>

                        {/* شارة المستوى المهاري + شارة فحص MathJS القابلة للنقر */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {(() => {
                            const mathCheck = validateCustomQuestionWithMathJS(
                              isFr ? qTextFr : qTextAr
                            );
                            return (
                              <span
                                title={
                                  mathCheck.issues.length > 0
                                    ? mathCheck.issues
                                        .map((i) => (isFr ? i.messageFr : i.messageAr))
                                        .join(" | ")
                                    : "تم التحقق من سلامة التعبيرات الرياضية بواسطة MathJS"
                                }
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${
                                  mathCheck.isValid && !mathCheck.hasWarnings
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-amber-50 text-amber-900 border-amber-300"
                                }`}
                              >
                                {mathCheck.isValid && !mathCheck.hasWarnings
                                  ? "MathJS ✓"
                                  : "MathJS ⚠"}
                              </span>
                            );
                          })()}
                          <button
                            type="button"
                            onClick={() => handleCycleQuestionLevel(ex.lessonKey, ex.metas, qIdx)}
                            title="انقر لتغيير المستوى المهاري للسؤال (N1 ↔ N2 ↔ N3)"
                            className={`text-[10.5px] font-mono font-bold px-2 py-1 rounded-lg border whitespace-nowrap transition cursor-pointer ${
                              meta.level === "N1"
                                ? "bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100"
                                : meta.level === "N3"
                                ? "bg-sky-100 text-sky-950 border-sky-300 hover:bg-sky-200"
                                : "bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100"
                            }`}
                          >
                            {meta.level === "N1"
                              ? "تطبيق N1"
                              : meta.level === "N3"
                              ? "مبادرة N3"
                              : "توليف N2"}
                          </button>

                          {onUpdateCustomQuestions && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isEditingThis) {
                                  setEditingQuestionKey(null);
                                } else {
                                  setEditingQuestionKey(editKey);
                                  setDraftAr(qTextAr);
                                  setDraftFr(qTextFr);
                                }
                              }}
                              title="تحرير نص السؤال باللغتين العربية والفرنسية"
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                isEditingThis
                                  ? "bg-slate-900 text-cyan-300 border-slate-900"
                                  : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
                              }`}
                            >
                              <PenLine className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onUpdateCustomQuestions && ex.qCount > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestionFromExercise(ex, qIdx)}
                              title="حذف هذا السؤال من التمرين"
                              className="p-1.5 rounded-lg bg-white text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* أدوات التحكم في التنقيط الجزئي */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleModifyPoint(ex.lessonKey, ex.metas, qIdx, -0.25)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-rose-50 border border-slate-300 text-slate-700 hover:text-rose-700 font-mono font-black flex items-center justify-center transition cursor-pointer"
                            title="إنقاص 0.25 ن"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            step="0.25"
                            min="0.25"
                            max="10"
                            value={currentPt}
                            onChange={(e) =>
                              handleDirectSetPoint(ex.lessonKey, ex.metas, qIdx, e.target.value)
                            }
                            className="w-14 text-center font-mono font-black text-xs p-1 bg-white border border-slate-300 rounded-lg text-slate-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-cyan-600"
                          />
                          <span className="text-[11px] font-bold text-slate-500">ن</span>

                          <button
                            type="button"
                            onClick={() => handleModifyPoint(ex.lessonKey, ex.metas, qIdx, 0.25)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-emerald-50 border border-slate-300 text-slate-700 hover:text-emerald-700 font-mono font-black flex items-center justify-center transition cursor-pointer"
                            title="زيادة 0.25 ن"
                          >
                            +
                          </button>

                          {/* اختيارات نقطية سريعة */}
                          <div className="hidden md:flex items-center gap-1 mr-1.5 border-r border-slate-200 pr-2">
                            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((presetVal) => (
                              <button
                                key={presetVal}
                                type="button"
                                onClick={() =>
                                  handleDirectSetPoint(
                                    ex.lessonKey,
                                    ex.metas,
                                    qIdx,
                                    presetVal.toString()
                                  )
                                }
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums transition cursor-pointer ${
                                  Math.abs(currentPt - presetVal) < 0.05
                                    ? "bg-slate-900 text-cyan-300"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {presetVal}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* منطقة تحرير نص السؤال عند تفعيل زر التعديل مع مدقق MathJS الفوري */}
                      {isEditingThis && (() => {
                        const draftCheckAr = validateCustomQuestionWithMathJS(draftAr);
                        const draftCheckFr = validateCustomQuestionWithMathJS(draftFr);
                        const allDraftIssues = [
                          ...draftCheckAr.issues,
                          ...draftCheckFr.issues,
                        ];
                        return (
                        <div className="pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-white p-2.5 rounded-lg">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10.5px] font-bold text-slate-600">
                                صياغة السؤال بالعربية :
                              </label>
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  draftCheckAr.isValid && !draftCheckAr.hasWarnings
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "bg-amber-100 text-amber-900"
                                }`}
                              >
                                {draftCheckAr.isValid && !draftCheckAr.hasWarnings
                                  ? "MathJS AR ✓"
                                  : "تنقية تلقائية متاحة"}
                              </span>
                            </div>
                            <textarea
                              rows={2}
                              value={draftAr}
                              onChange={(e) => setDraftAr(e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                            />
                          </div>
                          <div dir="ltr">
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10.5px] font-bold text-slate-600 text-left">
                                Énoncé de la question (Français) :
                              </label>
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  draftCheckFr.isValid && !draftCheckFr.hasWarnings
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "bg-amber-100 text-amber-900"
                                }`}
                              >
                                {draftCheckFr.isValid && !draftCheckFr.hasWarnings
                                  ? "MathJS FR ✓"
                                  : "Auto-Fix Ready"}
                              </span>
                            </div>
                            <textarea
                              rows={2}
                              value={draftFr}
                              onChange={(e) => setDraftFr(e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                            />
                          </div>
                          {allDraftIssues.length > 0 && (
                            <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
                              {allDraftIssues.slice(0, 3).map((iss, idxIss) => (
                                <div
                                  key={idxIss}
                                  className={`text-[11px] font-medium ${
                                    iss.type === "ERROR"
                                      ? "text-rose-800"
                                      : iss.type === "WARNING"
                                      ? "text-amber-800"
                                      : "text-emerald-800"
                                  }`}
                                >
                                  • {isFr ? iss.messageFr : iss.messageAr}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-2">
                            {(draftCheckAr.wasAutoFixed || draftCheckFr.wasAutoFixed) ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setDraftAr(draftCheckAr.sanitizedText);
                                  setDraftFr(draftCheckFr.sanitizedText);
                                }}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 cursor-pointer"
                              >
                                إصلاح الأقواس والصيغ الرياضية تلقائياً (MathJS)
                              </button>
                            ) : <div />}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingQuestionKey(null)}
                                className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              >
                                إلغاء
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditedQuestion(ex, qIdx)}
                                className="px-3.5 py-1 rounded-lg text-xs font-black bg-slate-900 hover:bg-slate-800 text-cyan-300 cursor-pointer"
                              >
                                فحص بـ MathJS وحفظ في الورقة
                              </button>
                            </div>
                          </div>
                        </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* خيارات العرض على ورقة الامتحان وزر التأكيد */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showQuestionBareme}
                onChange={(e) => onToggleShowQuestionBareme(e.target.checked)}
                className="rounded text-cyan-700 w-4 h-4 accent-cyan-600"
              />
              <span>إظهار سلم التنقيط والمستوى المهاري أمام كل سؤال [1.50 ن · N2]</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGradingScaleTable}
                onChange={(e) => onToggleIncludeGradingScaleTable(e.target.checked)}
                className="rounded text-cyan-700 w-4 h-4 accent-cyan-600"
              />
              <span>إدراج جدول شبكة التخصيص وسلم التنقيط (142-08) أعلى الفرض</span>
            </label>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Check className="w-4 h-4 text-cyan-400" />
            <span>حفظ وتطبيق على ورقة الفرض</span>
          </button>
        </div>
      </div>
    </div>
  );
};
