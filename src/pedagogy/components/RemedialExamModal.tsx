import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  FileCode2,
  FileDown,
  FileText,
  GraduationCap,
  HeartHandshake,
  Layers,
  Printer,
  RefreshCw,
  Sparkles,
  Target,
  Wand2,
  X,
} from "lucide-react";
import {
  computeExactExerciseEffectiveWeights,
  LessonItem,
  TrackData,
} from "../data/curriculum";
import { MathText } from "./MathRenderer";

export interface RemedialExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: TrackData;
  lessons: LessonItem[];
  school: string;
  prof: string;
  year: string;
  academy: string;
  direction: string;
  dsKey: string;
  isFr: boolean;
  onApplyRemedialExam: (remedialConfig: {
    targetLessons: LessonItem[];
    durationMinutes: number;
    totalPoints: number;
    n1: number;
    n2: number;
    n3: number;
    titleAr: string;
    titleFr: string;
  }) => void;
  onNotify: (type: "success" | "error" | "info", msg: string) => void;
}

export const RemedialExamModal: React.FC<RemedialExamModalProps> = ({
  isOpen,
  onClose,
  track,
  lessons,
  school,
  prof,
  year,
  academy,
  direction,
  dsKey,
  isFr,
  onApplyRemedialExam,
  onNotify,
}) => {
  const [examDuration, setExamDuration] = useState<60 | 120>(60);
  const [totalPoints, setTotalPoints] = useState<10 | 20>(20);
  const [selectedLessonIndices, setSelectedLessonIndices] = useState<number[]>(() =>
    lessons.map((_, i) => i)
  );
  const [focusLevelN1, setFocusLevelN1] = useState<number>(50);
  const [focusLevelN2, setFocusLevelN2] = useState<number>(40);
  const [focusLevelN3, setFocusLevelN3] = useState<number>(10);
  const [includePositiveMarkingGuide, setIncludePositiveMarkingGuide] = useState<boolean>(true);
  const [includeContractCommitment, setIncludeContractCommitment] = useState<boolean>(true);

  if (!isOpen) return null;

  const toggleLesson = (idx: number) => {
    setSelectedLessonIndices((prev) =>
      prev.includes(idx)
        ? prev.length > 1
          ? prev.filter((i) => i !== idx)
          : prev
        : [...prev, idx]
    );
  };

  const targetLessons = lessons.filter((_, idx) => selectedLessonIndices.includes(idx));
  const remedialWeights = computeExactExerciseEffectiveWeights(targetLessons, totalPoints);

  const handleConfirmGenerate = () => {
    if (targetLessons.length === 0) {
      onNotify("error", "يرجى اختيار درس واحد على الأقل للفرض الاستدراكي.");
      return;
    }

    onApplyRemedialExam({
      targetLessons,
      durationMinutes: examDuration,
      totalPoints,
      n1: focusLevelN1,
      n2: focusLevelN2,
      n3: focusLevelN3,
      titleAr: `الفرض الاستدراكي والدعم البيداغوجي الموجه (${dsKey})`,
      titleFr: `Devoir Surveillé de Rattrapage & Remédiation Ciblée (${dsKey})`,
    });

    onNotify(
      "success",
      `تم توليد الفرض الاستدراكي بنجاح على ${totalPoints} نقطة (${examDuration} دقيقة) مع نسبة تدعيم ${focusLevelN1}% N1!`
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* ترويسة النافذة */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 sm:p-6 border-b border-teal-800/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg border border-teal-300/40 shrink-0">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-900/80 text-emerald-200 font-mono text-[10.5px] font-black px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                  RÉGULATION & REMÉDIATION
                </span>
                <span className="text-[11px] text-teal-200 font-mono font-bold">
                  {track.code} · الدعم الاستدراكي
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                مولد الفرض الاستدراكي والمعالجة البيداغوجية المركزة
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="flex-1 overflow-y-auto studio-scroll p-5 sm:p-6 space-y-5">
          {/* 1. بطاقة التعريف والهدف البيداغوجي */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-black text-sm">
              <Target className="w-4 h-4 text-emerald-700" />
              <span>الهدف التربوي من الفرض الاستدراكي الموازي:</span>
            </div>
            <p className="leading-relaxed text-emerald-900">
              يخصص هذا الفرض للمتعثرين الحاصلين على معدل أقل من 10/20 في الفرض المحروس أو الرائز
              التشخيصي. يعتمد تصميماً ديداكتيكياً مكثفاً في مهارات التطبيق المباشر (N1: 50% و N2: 40%)
              مع أسئلة تمهيدية مجزأة، مع اعتماد سلم التصحيح الإيجابي وعدم معاقبة التلميذ على الخطأ
              الحسابي المنقول.
            </p>
          </div>

          {/* 2. إعدادات الغلاف الزمني والتنقيط الإجمالي */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-700" />
                <span>الغلاف الزمني للحصة الاستدراكية:</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setExamDuration(60)}
                  className={`p-3 rounded-xl border transition text-center cursor-pointer ${
                    examDuration === 60
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-sm font-black font-mono">1 ساعة (60 د)</div>
                  <div className="text-[10.5px] opacity-80 mt-0.5">حصة دعم مكثفة</div>
                </button>
                <button
                  type="button"
                  onClick={() => setExamDuration(120)}
                  className={`p-3 rounded-xl border transition text-center cursor-pointer ${
                    examDuration === 120
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-sm font-black font-mono">2 ساعتان (120 د)</div>
                  <div className="text-[10.5px] opacity-80 mt-0.5">فرض دوري موازي كامل</div>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>سلم التنقيط الإجمالي للفرض:</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTotalPoints(20)}
                  className={`p-3 rounded-xl border transition text-center cursor-pointer ${
                    totalPoints === 20
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-sm font-black font-mono">20 / 20 نقطة</div>
                  <div className="text-[10.5px] opacity-80 mt-0.5">المعيار الرسمي لمسار</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTotalPoints(10)}
                  className={`p-3 rounded-xl border transition text-center cursor-pointer ${
                    totalPoints === 10
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-sm font-black font-mono">10 / 10 نقاط</div>
                  <div className="text-[10.5px] opacity-80 mt-0.5">تقويم سريع وجيز</div>
                </button>
              </div>
            </div>
          </div>

          {/* 3. اختيار الدروس المستهدفة بالمعالجة والاستدراك */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span>الدروس والوحدات المستهدفة بالمعالجة ({targetLessons.length} مختارة):</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedLessonIndices(lessons.map((_, i) => i))}
                className="text-[11px] font-bold text-indigo-700 hover:text-indigo-950 underline cursor-pointer"
              >
                تحديد جميع الدروس
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lessons.map((lesson, idx) => {
                const isSelected = selectedLessonIndices.includes(idx);
                const assignedPts = isSelected
                  ? remedialWeights[targetLessons.findIndex((l) => l.lessonFr === lesson.lessonFr)] || 0
                  : 0;

                return (
                  <div
                    key={idx}
                    onClick={() => toggleLesson(idx)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition cursor-pointer ${
                      isSelected
                        ? "bg-teal-50/70 border-teal-300 shadow-2xs"
                        : "bg-white border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${
                          isSelected ? "bg-teal-700 text-white" : "border border-slate-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-950">
                          {idx + 1}. {isFr ? lesson.lessonFr : lesson.lessonAr}
                        </div>
                        <div className="text-[10.5px] text-slate-500 font-mono">
                          {lesson.hours} حصيص ساعي
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="font-mono text-xs font-black text-teal-900 bg-teal-100/80 px-2 py-0.5 rounded">
                        {assignedPts.toFixed(2)} ن
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. التوزيع المديداكتيكي للمهارات (N1 / N2 / N3) الخاص بالدعم */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>الهندسة المهارية المعززة للدعم والاستدراك:</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                N1: {focusLevelN1}% · N2: {focusLevelN2}% · N3: {focusLevelN3}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-cyan-800 font-bold block text-[11px]">N1 (معارف وتطبيق مباشر)</span>
                <span className="font-mono text-base font-black text-cyan-900">{focusLevelN1}%</span>
                <p className="text-[10px] text-slate-500">تثبيت القواعد الأساسية</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-teal-800 font-bold block text-[11px]">N2 (تطبيق موجه)</span>
                <span className="font-mono text-base font-black text-teal-900">{focusLevelN2}%</span>
                <p className="text-[10px] text-slate-500">أسئلة مرحلية توجيهية</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-indigo-800 font-bold block text-[11px]">N3 (مسألة توليف خفيفة)</span>
                <span className="font-mono text-base font-black text-indigo-900">{focusLevelN3}%</span>
                <p className="text-[10px] text-slate-500">إدماج مبسط للمكتسبات</p>
              </div>
            </div>
          </div>

          {/* 5. ميزات الدعم البيداغوجي المدمجة */}
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={includePositiveMarkingGuide}
                onChange={(e) => setIncludePositiveMarkingGuide(e.target.checked)}
                className="rounded text-emerald-700 w-4 h-4 accent-emerald-700"
              />
              <div>
                <span className="font-bold text-slate-900 block">
                  إدراج سلم التصحيح الإيجابي وتوجيهات عدم معاقبة الخطأ المتسلسل:
                </span>
                <span className="text-[10.5px] text-slate-600">
                  تمنح ربع النقطة لذكر الخاصية السليمة حتى وإن تعثر التلميذ في الحساب العددي النهائي.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={includeContractCommitment}
                onChange={(e) => setIncludeContractCommitment(e.target.checked)}
                className="rounded text-teal-700 w-4 h-4 accent-teal-700"
              />
              <div>
                <span className="font-bold text-slate-900 block">
                  إرفاق ميثاق التزام التلميذ بخطة الدعم وتصحيح الأخطاء:
                </span>
                <span className="text-[10.5px] text-slate-600">
                  خانة تفاعلية لتدوين الصعوبات المعالجة وتوقيع التلميذ والأستاذ لتعزيز الأثر التكويني.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* تذييل النافذة والأزرار */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-xs font-mono font-bold text-slate-600">
            المجموع: <strong className="text-slate-900">{totalPoints.toFixed(2)} ن</strong> · المدة:{" "}
            <strong className="text-slate-900">{examDuration} د</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleConfirmGenerate}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>توليد وتطبيق الفرض الاستدراكي</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
