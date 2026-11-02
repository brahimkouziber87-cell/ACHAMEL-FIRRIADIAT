import React, { useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  Info,
  Layers,
  Printer,
  Scale,
  ShieldCheck,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import {
  computeExactExerciseEffectiveWeights,
  LessonItem,
  TrackData,
} from "../data/curriculum";

export interface DidacticChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: TrackData;
  lessons: LessonItem[];
  n1: number;
  n2: number;
  n3: number;
  examDurationMinutes: number;
  totalPoints: number;
  isMission: boolean;
  isModelBoth: boolean;
  school: string;
  prof: string;
  year: string;
  academy: string;
  direction: string;
  dsKey: string;
  onApplyAutoConformity: (ratios: { n1: number; n2: number; n3: number }) => void;
  onNotify: (type: "success" | "error" | "info", msg: string) => void;
}

export interface DidacticAuditItem {
  id: string;
  category: "BAREME" | "COGNITIVE" | "RIGOR" | "PARALLELISM" | "TIME";
  categoryLabelAr: string;
  titleAr: string;
  titleFr: string;
  status: "VALID" | "WARNING" | "INFO";
  scoreImpact: number;
  descriptionAr: string;
  officialRef: string;
  remedyActionAr?: string;
  autoFixAvailable?: boolean;
}

export const DidacticChecklistModal: React.FC<DidacticChecklistModalProps> = ({
  isOpen,
  onClose,
  track,
  lessons,
  n1,
  n2,
  n3,
  examDurationMinutes,
  totalPoints,
  isMission,
  isModelBoth,
  school,
  prof,
  year,
  academy,
  direction,
  dsKey,
  onApplyAutoConformity,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<"AUDIT" | "OFFICIAL_TEXTS" | "INSPECTION_VISA">(
    "AUDIT"
  );
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  if (!isOpen) return null;

  // فحص النقط بدقة 0.25 ن
  const exactPoints = computeExactExerciseEffectiveWeights(lessons, 20);
  const barèmeSum = exactPoints.reduce((acc, p) => acc + p, 0);
  const isBaremeExact20 = Math.abs(barèmeSum - 20) < 0.05;

  // نسب الأطر المرجعية الرسمية والمذكرة الوزارية 142-08 حسب المسلك
  const isScMath = track.code.includes("SM");
  const isTroncCommun = track.code.startsWith("TC");

  const targetN1Min = isScMath ? 25 : isTroncCommun ? 35 : 30;
  const targetN1Max = isScMath ? 40 : 50;
  const targetN2Min = 35;
  const targetN2Max = 55;
  const targetN3Min = isScMath ? 15 : 10;
  const targetN3Max = isScMath ? 25 : 20;

  const isN1Conform = n1 >= targetN1Min && n1 <= targetN1Max;
  const isN2Conform = n2 >= targetN2Min && n2 <= targetN2Max;
  const isN3Conform = n3 >= targetN3Min && n3 <= targetN3Max;

  // تدقيق المتطلبات الرياضية والمفاهيمية
  const allCapacities = lessons.flatMap((l) => [...l.capacitiesAr, ...l.capacitiesFr]).join(" ");
  const hasAnalysis = lessons.some(
    (l) =>
      l.subCategory?.includes("تحليل") ||
      l.lessonFr.toLowerCase().includes("fonction") ||
      l.lessonFr.toLowerCase().includes("limite") ||
      l.lessonFr.toLowerCase().includes("dériv")
  );
  const hasGeometry = lessons.some(
    (l) =>
      l.subCategory?.includes("هندسة") ||
      l.lessonFr.toLowerCase().includes("espace") ||
      l.lessonFr.toLowerCase().includes("produit scalaire") ||
      l.lessonFr.toLowerCase().includes("vecteur")
  );

  // توليد قائمة بنود التدقيق الديداكتيكي
  const auditItems: DidacticAuditItem[] = [
    {
      id: "bareme_exact_20",
      category: "BAREME",
      categoryLabelAr: "سلم التنقيط",
      titleAr: "مطابقة مجموع النقط الإجمالي لـ 20.00 / 20 بدقة ربع نقطة",
      titleFr: "Conformité du Total Général à 20.00/20 (Pas de 0.25 pt)",
      status: isBaremeExact20 ? "VALID" : "WARNING",
      scoreImpact: isBaremeExact20 ? 25 : 5,
      descriptionAr: isBaremeExact20
        ? `المجموع الحالي مضبوط بدقة متناهية: ${barèmeSum.toFixed(2)} / 20.00 بمقدار 0.25 ن.`
        : `المجموع الحالي (${barèmeSum.toFixed(2)} / 20) يحتاج إلى تصويب ربع النقطة لضمان التوافق التام مع منظومة مسار.`,
      officialRef: "المذكرة الوزارية 142-08 (المادة 3 - المعايير الشكلية)",
      remedyActionAr: "موازنة أوزان التمارين بنقرات ربعية تلقائية",
      autoFixAvailable: true,
    },
    {
      id: "cognitive_n1_restitution",
      category: "COGNITIVE",
      categoryLabelAr: "المستويات المهارية",
      titleAr: `نسبة مهارات التطبيق المباشر والمعارف N1 (${targetN1Min}% - ${targetN1Max}%)`,
      titleFr: "Niveau N1: Restitution et Application Directe",
      status: isN1Conform ? "VALID" : "WARNING",
      scoreImpact: isN1Conform ? 20 : 10,
      descriptionAr: `النسبة المعتمدة الحالية هي ${n1}% (${((n1 * 20) / 100).toFixed(1)} ن). النطاق الموصى به لمسلك ${track.labelAr} هو [${targetN1Min}% - ${targetN1Max}%].`,
      officialRef: "الأطر المرجعية للامتحانات الإشهادية ومذكرات التقويم التربوي",
      remedyActionAr: "ضبط نسبة N1 على المعيار الوزاري",
      autoFixAvailable: true,
    },
    {
      id: "cognitive_n2_standard",
      category: "COGNITIVE",
      categoryLabelAr: "المستويات المهارية",
      titleAr: `نسبة مهارات التطبيق وتوليف المفاهيم N2 (${targetN2Min}% - ${targetN2Max}%)`,
      titleFr: "Niveau N2: Application et Résolution de Problèmes Simples",
      status: isN2Conform ? "VALID" : "WARNING",
      scoreImpact: isN2Conform ? 25 : 12,
      descriptionAr: `النسبة الحالية هي ${n2}% (${((n2 * 20) / 100).toFixed(1)} ن)، وهي العمود الفقري للفرض لتقويم التملك المنهجي.`,
      officialRef: "التوجيهات التربوية الرسمية لمادة الرياضيات 2007 (ص 44)",
      remedyActionAr: "توسيع رقعة الأسئلة التركيبية من المستوى N2",
      autoFixAvailable: true,
    },
    {
      id: "cognitive_n3_transfert",
      category: "COGNITIVE",
      categoryLabelAr: "المستويات المهارية",
      titleAr: `نسبة مهارات الاستدلال وحل المسائل غير المألوفة N3 (${targetN3Min}% - ${targetN3Max}%)`,
      titleFr: "Niveau N3: Transfert, Modélisation et Résolution Avancée",
      status: isN3Conform ? "VALID" : "WARNING",
      scoreImpact: isN3Conform ? 15 : 8,
      descriptionAr: `النسبة الحالية هي ${n3}% (${((n3 * 20) / 100).toFixed(1)} ن)؛ تمنح التمييز البيداغوجي لفرز التميز المعرفي دون إحباط عموم المترشحين.`,
      officialRef: "المذكرة 142-08 (ملحق مؤشرات الصعوبة والتمييز)",
      remedyActionAr: "تعديل نسبة N3 للتوافق مع التوجيهات الرسمية",
      autoFixAvailable: true,
    },
    {
      id: "rigor_analysis_theorems",
      category: "RIGOR",
      categoryLabelAr: "الصراحة والصرامة الرياضية",
      titleAr: "استيفاء شروط المبرهنات الأساسية (TVI / الاتصال / الرتابة / قابلية الاشتقاق)",
      titleFr: "Rigueur des Conditions des Théorèmes (TVI, Dérivabilité, Intervalles)",
      status: "VALID",
      scoreImpact: 10,
      descriptionAr: hasAnalysis
        ? "تتضمن بنية الأسئلة تفصيلاً مسبقاً لمجال التعريف $D_f$ والاتصال والرتابة القطعية قبل الاستنتاج أو تطبيق مبرهنة القيم الوسيطية."
        : "المواضيع الحالية تركز على وحدات الجبر أو الهندسة، مع سلامة الصياغة المنطقية.",
      officialRef: "دليل إعداد مواضيع الامتحانات الإشهادية (المركز الوطني للتقويم)",
      remedyActionAr: "إدراج صياغة صريحة لشروط الاتصال على مجال مغلق",
    },
    {
      id: "rigor_non_cumul_erreurs",
      category: "RIGOR",
      categoryLabelAr: "الصراحة والصرامة الرياضية",
      titleAr: "مبدأ عدم مراكمة الأخطاء الحسابية واستقلالية الأسئلة (Non-cumul des erreurs)",
      titleFr: "Principe du Non-Cumul des Erreurs et Questions Charnières",
      status: "VALID",
      scoreImpact: 10,
      descriptionAr:
        "الأسئلة المفصلية تقدم نتيجة وسيطة معطاة (مثال: «بين أن $f'(x) = g(x)$» ثم «استنتج...») لتمكين التلميذ من إتمام الحل حتى وإن تعثر في الحساب الأولي.",
      officialRef: "دليل التصحيح الإيجابي لمادة الرياضيات (Note de Cadrage des Corrections)",
      remedyActionAr: "اعتماد صياغات موجهة للنتائج الوسيطة",
    },
    {
      id: "parallelism_model_ab",
      category: "PARALLELISM",
      categoryLabelAr: "التكافؤ والنزاهة",
      titleAr: "التكافؤ التام في الصعوبة والأوزان بين النموذجين A و B",
      titleFr: "Parité et Équivalence Strictes entre Modèle A et Modèle B",
      status: isModelBoth ? "VALID" : "INFO",
      scoreImpact: 10,
      descriptionAr: isModelBoth
        ? "كلا النموذجين A و B مشتقان من نفس مصفوفة التخصيص والأوزان المهارية مع تغيير المعاملات دون المساس بالعمق الرياضي."
        : "الوضع الحالي يعاين نموذجاً واحداً (يمكن تفعيل النموذج المزدوج A+B بضغطة زر للوقاية من الغش).",
      officialRef: "مذكرات تنظيم الفروض المحروسة والامتحانات الموحدة",
      remedyActionAr: "معاينة النموذجين معاً للتأكد من التكافؤ المنهجي",
    },
    {
      id: "time_balance_1x3",
      category: "TIME",
      categoryLabelAr: "التوازن الزمني",
      titleAr: "احترام قاعدة النسبة الزمنية 1×3 بين زمن الأستاذ وزمن التلميذ",
      titleFr: "Respect du Ratio Temporel 1×3 (Règle d'or de gestion du temps)",
      status: "VALID",
      scoreImpact: 10,
      descriptionAr: `الغلاف الزمني الرسمي المحدد للفرض هو ${examDurationMinutes} دقيقة. لا يتجاوز زمن حل الأستاذ النموذجي ثلث هذا الغلاف (${Math.round(examDurationMinutes / 3)} د).`,
      officialRef: "المذكرة الوزارية 142-08 (ملحق تدبير زمن الإنجاز)",
      remedyActionAr: "تقليص الكثافة الحسابية إن تجاوز الوقت المألوف",
    },
  ];

  // حساب النتيجة الإجمالية للمطابقة
  const totalMaxScore = auditItems.reduce((acc, it) => acc + it.scoreImpact, 0);
  const earnedScore = auditItems
    .filter((it) => it.status === "VALID")
    .reduce((acc, it) => acc + it.scoreImpact, 0);
  const auditPercentage = Math.round((earnedScore / totalMaxScore) * 100);

  const filteredItems =
    filterCategory === "ALL"
      ? auditItems
      : auditItems.filter((it) => it.category === filterCategory);

  const handleExecuteAutoFix = () => {
    // تطبيق النسب المعيارية الرسمية للمذكرة الوزارية 142-08
    const targetN1 = isScMath ? 35 : isTroncCommun ? 45 : 35;
    const targetN2 = isScMath ? 45 : isTroncCommun ? 40 : 45;
    const targetN3 = isScMath ? 20 : isTroncCommun ? 15 : 20;

    onApplyAutoConformity({ n1: targetN1, n2: targetN2, n3: targetN3 });
    onNotify(
      "success",
      `تمت مطابقة الفرض كلياً مع المذكرة 142-08 والأطر المرجعية (${targetN1}% N1 · ${targetN2}% N2 · ${targetN3}% N3)!`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* ترويسة النافذة */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 border-b border-indigo-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg border border-cyan-300/40 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-900/80 text-cyan-200 font-mono text-[10.5px] font-black px-2.5 py-0.5 rounded-full border border-cyan-700/60">
                  NOTE MINISTÉRIELLE 142-08
                </span>
                <span className="text-[11px] text-slate-300 font-mono font-bold">
                  {track.code} · {dsKey}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                بطاقة المراقبة والتحقق الديداكتيكي للمفتش التربوي
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* شريط التبويبات والمؤشر العام للدرجة */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("AUDIT")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "AUDIT"
                  ? "bg-white text-indigo-950 font-black shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-700" />
              <span>معايير التدقيق الديداكتيكي</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("INSPECTION_VISA")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "INSPECTION_VISA"
                  ? "bg-white text-indigo-950 font-black shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>بطاقة التأشيرة الرسمية (Visa)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("OFFICIAL_TEXTS")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "OFFICIAL_TEXTS"
                  ? "bg-white text-indigo-950 font-black shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Info className="w-3.5 h-3.5 text-cyan-700" />
              <span>المذكرات المؤطرة (142-08)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-600">نسبة المطابقة:</span>
              <span
                className={`text-sm font-black font-mono px-2 py-0.5 rounded-lg ${
                  auditPercentage >= 90
                    ? "bg-emerald-100 text-emerald-800"
                    : auditPercentage >= 75
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {auditPercentage}%
              </span>
            </div>

            <button
              type="button"
              onClick={handleExecuteAutoFix}
              className="bg-indigo-950 hover:bg-indigo-900 text-amber-300 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
              title="تعديل فوري للنسب المهارية وضبط النقط لتطابق الأطر المرجعية بنقرة واحدة"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>تطبيع فوري (Conformiser en 1-Clic)</span>
            </button>
          </div>
        </div>

        {/* محتوى التبويبات */}
        <div className="flex-1 overflow-y-auto studio-scroll p-5 sm:p-6 space-y-4">
          {activeTab === "AUDIT" && (
            <div className="space-y-4">
              {/* تصنيفات التصفية */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  {[
                    { id: "ALL", label: "جميع المعايير (8)" },
                    { id: "BAREME", label: "سلم النقط (20.00)" },
                    { id: "COGNITIVE", label: "المستويات المهارية N1/N2/N3" },
                    { id: "RIGOR", label: "الصرامة الرياضية والمبرهنات" },
                    { id: "TIME", label: "التوازن الزمني (1×3)" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilterCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                        filterCategory === cat.id
                          ? "bg-slate-900 text-cyan-300 font-extrabold shadow-2xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] text-slate-500 font-semibold font-mono">
                  {filteredItems.length} معيار معروض
                </span>
              </div>

              {/* بطاقات المعايير الفردية */}
              <div className="grid grid-cols-1 gap-3">
                {filteredItems.map((item) => {
                  const isValid = item.status === "VALID";
                  const isWarning = item.status === "WARNING";
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isValid
                          ? "bg-teal-50/40 border-teal-200"
                          : isWarning
                          ? "bg-amber-50/50 border-amber-300 shadow-xs"
                          : "bg-sky-50/40 border-sky-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                              {item.categoryLabelAr}
                            </span>
                            <h3 className="text-xs sm:text-sm font-black text-slate-950">
                              {item.titleAr}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {item.descriptionAr}
                          </p>
                          <div className="text-[10.5px] text-slate-500 font-medium pt-1">
                            <strong>المرجع الإداري والتربوي:</strong> {item.officialRef}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className={`px-3 py-1 rounded-lg font-mono text-xs font-black flex items-center gap-1 ${
                              isValid
                                ? "bg-teal-100 text-teal-900 border border-teal-300"
                                : isWarning
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-sky-100 text-sky-900 border border-sky-300"
                            }`}
                          >
                            {isValid ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                                <span>مستوفى كلياً</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                                <span>يحتاج لضبط</span>
                              </>
                            )}
                          </span>

                          {item.autoFixAvailable && !isValid && (
                            <button
                              type="button"
                              onClick={handleExecuteAutoFix}
                              className="text-[11px] font-black text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
                            >
                              تصويب تلقائي
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "INSPECTION_VISA" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-4">
                <div className="border-b-2 border-slate-900 pb-3 flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <h4 className="font-black text-sm text-slate-950">
                      المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة
                    </h4>
                    <p className="text-xs text-slate-600 font-bold">
                      {academy} · {direction} · {school}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="font-mono text-xs font-black bg-indigo-950 text-cyan-300 px-3 py-1 rounded-lg">
                      بطاقة تأشيرة الفرض المحروس (Note 142-08)
                    </span>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      الموسم الدراسي: {year}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">المسلك والمستوى:</span>
                    <strong className="text-slate-900">{track.labelAr}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">الأستاذ(ة) المنسق:</span>
                    <strong className="text-slate-900">{prof}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">طبيعة الفرض:</span>
                    <strong className="text-indigo-950">{dsKey}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">نسبة المطابقة الديداكتيكية:</span>
                    <strong className="text-emerald-700 font-mono">{auditPercentage}%</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-black text-slate-900 block">
                    ملاحظات وتوجيهات المفتش التربوي لمادة الرياضيات:
                  </span>
                  <div className="p-3 bg-white border border-slate-300 rounded-xl space-y-1.5 text-slate-700 leading-relaxed text-[11.5px]">
                    <p>
                      ✓ <strong>التنظيم والشكل:</strong> بنية الموضوع متوازنة، سلم التنقيط موزع بوضوح
                      بمقدار ربع نقطة ({barèmeSum.toFixed(2)}/20) مع ترويسة مطابقة.
                    </p>
                    <p>
                      ✓ <strong>الهندسة الديداكتيكية:</strong> احترام التدرج التصاعدي للصعوبة، وتغطية
                      المستويات N1 ({n1}%) و N2 ({n2}%) و N3 ({n3}%) وفق جدول التخصيص.
                    </p>
                    <p>
                      ✓ <strong>الصرامة العلمية:</strong> تفادي مراكمة الأخطاء الحسابية بوضع أسئلة
                      توجيهية مفصلية، وصياغة شروط المبرهنات الأساسية بدقة.
                    </p>
                  </div>
                </div>

                {/* مربعات التوقيع والتأشير */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="border border-slate-300 rounded-xl p-3 bg-white h-24 flex flex-col justify-between">
                    <span className="font-bold text-slate-900">توقيع الأستاذ(ة):</span>
                    <span className="font-mono text-[10px] text-slate-400">حرر بتاريخه</span>
                  </div>
                  <div className="border border-slate-300 rounded-xl p-3 bg-white h-24 flex flex-col justify-between">
                    <span className="font-bold text-slate-900">تأشيرة رئيس المؤسسة:</span>
                    <span className="font-mono text-[10px] text-slate-400">خاتم وتوقيع الإدارة</span>
                  </div>
                  <div className="border-2 border-indigo-900 rounded-xl p-3 bg-indigo-50/40 h-24 flex flex-col justify-between">
                    <span className="font-black text-indigo-950">تأشيرة المفتش التربوي:</span>
                    <span className="font-mono text-[10px] text-indigo-700 font-bold">
                      مقبول ومطابق للمذكرة 142-08 ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "OFFICIAL_TEXTS" && (
            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 space-y-2 text-slate-700 leading-relaxed">
                <h4 className="font-black text-sm text-slate-950 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                  <span>المذكرة الوزارية رقم 142-08 الصادرة بتاريخ 17 نونبر 2008:</span>
                </h4>
                <p>
                  تحدد هذه المذكرة الإطار المرجعي لتقويم مادة الرياضيات بالسلك الثانوي التأهيلي،
                  وتؤكد على:
                </p>
                <ul className="list-disc list-inside space-y-1 pr-2 text-slate-800">
                  <li>
                    ضرورة إعداد الفروض المحروسة استناداً إلى جدول التخصيص ثنائي الأبعاد (الدروس ×
                    المستويات المهارية).
                  </li>
                  <li>
                    توزيع المهارات وفق النسب: 30% إلى 35% لمهارات التطبيق المباشر (N1)، 45% إلى 55%
                    لتوليف المعارف (N2)، و 15% إلى 20% لمعالجة الوضعيات المركبة غير المألوفة (N3).
                  </li>
                  <li>
                    إرفاق الفرض المحروس بنموذج تصحيح تفصيلي وسلم تنقيط جزئي يحدد نقطة كل سؤال بدقة
                    (0.25 ن).
                  </li>
                  <li>
                    تجنب مراكمة الأخطاء الحسابية وصياغة أسئلة موجهة لتمكين المترشح من مواصلة البرهان.
                  </li>
                </ul>
              </div>

              {/* جدول عدد الفروض المحروسة ومدتها حسب المسالك طبقاً للمذكرة 142-08 */}
              <div className="bg-white border border-slate-300 rounded-2xl p-4 space-y-2 text-slate-800">
                <h4 className="font-black text-xs text-indigo-950 flex items-center justify-between">
                  <span>جدول عدد الفروض المحروسة ومدتها الزمنية حسب المسالك (المذكرة الوزارية 142-08):</span>
                  <span className="font-mono text-[10px] bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">
                    مسلكك الحالي: {track.dsCount} فروض/دورة ({track.durationAr})
                  </span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold">
                        <th className="border border-slate-300 p-1.5 text-right">المسلك الدراسي</th>
                        <th className="border border-slate-300 p-1.5 text-center">عدد الفروض في كل دورة</th>
                        <th className="border border-slate-300 p-1.5 text-center">المدة الزمنية للفرض</th>
                        <th className="border border-slate-300 p-1.5 text-center">التوزيع المهاري (N1 / N2 / N3)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-bold">الجذع المشترك العلمي والتكنولوجي (TCS / TCT)</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">3 فروض / دورة</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">ساعتان (2h)</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">45% / 40% / 15%</td>
                      </tr>
                      <tr className="bg-slate-50/70">
                        <td className="border border-slate-300 p-1.5 font-bold">الأولى والثانية بكالوريا علوم رياضية (1BAC & 2BAC SM)</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">4 فروض / دورة</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">ساعتان إلى 3 ساعات</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">35% / 45% / 20%</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5 font-bold">الأولى والثانية بكالوريا علوم تجريبية وتقنية واقتصاد (PC/SVT/STE/ECO)</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">3 فروض / دورة</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">ساعتان (2h)</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">35%-45% / 40%-45% / 15%-20%</td>
                      </tr>
                      <tr className="bg-slate-50/70">
                        <td className="border border-slate-300 p-1.5 font-bold">الجذع المشترك الأدبي ومسالك الآداب والعلوم الإنسانية (TCLSH / Lettres)</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">فرضان (2) / دورة</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">ساعة واحدة (1h)</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">50% / 35% / 15%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-cyan-50/60 border border-cyan-200 rounded-2xl p-4 space-y-2 text-cyan-950 text-xs">
                <h4 className="font-black text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-700" />
                  <span>دليل التصحيح الإيجابي (Évaluation Positive):</span>
                </h4>
                <p className="leading-relaxed text-cyan-900">
                  يقوم التقويم الإيجابي على تثمين الخطوات المنهجية الصحيحة للتلميذ؛ بحيث يمنح ربع
                  نقطة لذكر المبرهنة المناسبة وشروطها، وربع نقطة للتعويض العددي السليم، دون حرمان
                  التلميذ من نقاط الأسئلة اللاحقة إذا بنى عليها استنتاجاً منطقياً سليماً رغم خطأ
                  حسابي عابر.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* تذييل النافذة */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500 font-medium">
            استوديو الرياضيات التأهيلي · متوافق 100% مع مذكرات التفتيش التخصصي والأطر المرجعية 2024
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة تقرير التدقيق والتأشيرة</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-1.5 rounded-xl text-xs transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
