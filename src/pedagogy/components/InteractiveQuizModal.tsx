import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Flag,
  HelpCircle,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Printer,
  QrCode,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Timer,
  UserCheck,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  evaluateStudentQuiz,
  exportQuizRosterToMassarCSV,
  InteractiveQuizData,
  QuizChoice,
  QuizEvaluationReport,
  QuizQuestionItem,
  StudentQuizSubmission,
} from "../utils/quizGenerator";
import { formatMathTypography } from "../utils/latexPackagesAndMath";
import { MathText } from "./MathRenderer";

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizData: InteractiveQuizData;
  onRegenerateWithAI?: (modelChoice: "gemini-3.8-flash" | "gemini-4-argon") => Promise<void>;
  isGeneratingAI?: boolean;
  selectedAiModel: "gemini-3.8-flash" | "gemini-4-argon";
  onSelectAiModel: (model: "gemini-3.8-flash" | "gemini-4-argon") => void;
  googleUserEmail?: string | null;
}

type QuizViewStep = "SETUP" | "TAKING" | "REPORT";

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  quizData,
  onRegenerateWithAI,
  isGeneratingAI = false,
  selectedAiModel,
  onSelectAiModel,
  googleUserEmail,
}) => {
  const [step, setStep] = useState<QuizViewStep>("SETUP");
  const [candidateName, setCandidateName] = useState<string>("");
  const [candidateClass, setCandidateClass] = useState<string>("2BAC PC / SM");
  const [candidateNumber, setCandidateNumber] = useState<string>("1");
  const [chosenDurationMinutes, setChosenDurationMinutes] = useState<number>(
    quizData.durationMinutes || 45
  );

  // حالة إجراء الاختبار (Taking State)
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> choiceId
  const [formulaAnswers, setFormulaAnswers] = useState<Record<string, string>>({}); // questionId -> direct math expression
  const [answerInputMode, setAnswerInputMode] = useState<"QCM" | "HYBRID_SYMBOLIC">("QCM");
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [quizDisplayLang, setQuizDisplayLang] = useState<"BILINGUAL" | "FR" | "AR">(
    quizData.system === "MISSION_FRANCAISE" ? "FR" : "BILINGUAL"
  );

  // حالة البث المباشر للحصة عبر رمز QR (Live Classroom QR Session)
  const [showClassroomQr, setShowClassroomQr] = useState<boolean>(false);
  const [classroomQrDataUrl, setClassroomQrDataUrl] = useState<string>("");
  const [classroomPin] = useState<string>(() =>
    String(Math.floor(100000 + Math.random() * 900000))
  );

  // التقرير النهائي وسجل نقط القسم لمنظومة مسار / Pronote
  const [report, setReport] = useState<QuizEvaluationReport | null>(null);
  const [classRosterReports, setClassRosterReports] = useState<
    QuizEvaluationReport[]
  >(() => {
    try {
      const saved = localStorage.getItem("pedagogical_quiz_class_roster_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedReviewQIdx, setSelectedReviewQIdx] = useState<number | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // إعادة ضبط الحالة عند فتح الكويز
  useEffect(() => {
    if (isOpen) {
      setStep("SETUP");
      setCurrentQIndex(0);
      setAnswers({});
      setFormulaAnswers({});
      setFlaggedIds([]);
      setElapsedSeconds(0);
      setIsTimerPaused(false);
      setShowSubmitConfirm(false);
      setReport(null);
      setSelectedReviewQIdx(null);
      setChosenDurationMinutes(quizData.durationMinutes || 45);
      setQuizDisplayLang(
        quizData.system === "MISSION_FRANCAISE" ? "FR" : "BILINGUAL"
      );
    }
  }, [isOpen, quizData]);

  // توليد رمز QR للحصة التفاعلية عند طلبه
  const handleToggleClassroomQr = async () => {
    const next = !showClassroomQr;
    setShowClassroomQr(next);
    if (next && !classroomQrDataUrl) {
      try {
        const shareUrl = `${window.location.origin}/?quizPin=${classroomPin}&track=${quizData.trackCode}`;
        const res = await fetch("/api/geogebra/generate-qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: shareUrl }),
        });
        const data = await res.json();
        if (data.qrCodeDataUrl) {
          setClassroomQrDataUrl(data.qrCodeDataUrl);
        }
      } catch {
        // ignore QR error
      }
    }
  };

  // عداد الوقت التنازلي / التصاعدي بدون آثار جانبية داخل دالة تحديث الحالة
  useEffect(() => {
    if (step !== "TAKING" || isTimerPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, isTimerPaused]);

  const totalTimeSeconds = chosenDurationMinutes * 60;
  const remainingSeconds = Math.max(0, totalTimeSeconds - elapsedSeconds);
  const isTimeRunningLow = chosenDurationMinutes > 0 && remainingSeconds <= 300; // أقل من 5 دقائق

  const currentQuestion: QuizQuestionItem | undefined =
    quizData.questions[currentQIndex];

  const answeredCount = useMemo(() => {
    const answeredIds = new Set([
      ...Object.keys(answers),
      ...Object.entries(formulaAnswers)
        .filter(([, val]) => val && val.trim().length > 0)
        .map(([k]) => k),
    ]);
    return answeredIds.size;
  }, [answers, formulaAnswers]);

  const unansweredCount = useMemo(() => {
    return quizData.questions.length - answeredCount;
  }, [quizData.questions.length, answeredCount]);

  const progressPercent = useMemo(() => {
    if (quizData.questions.length === 0) return 0;
    return Math.round((answeredCount / quizData.questions.length) * 100);
  }, [answeredCount, quizData.questions.length]);

  // بدء الاختبار
  const handleStartQuiz = () => {
    setStep("TAKING");
    setCurrentQIndex(0);
    setElapsedSeconds(0);
    setIsTimerPaused(false);
  };

  // اختيار إجابة
  const handleSelectChoice = (questionId: string, choiceId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  // وضع علامة مراجعة
  const handleToggleFlag = (questionId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // تسليم وتصحيح الاختبار مع ضمان قراءة أحدث إجابات التلميذ والوقت الفعلي وحفظ النقطة في لائحة مسار
  const handleFinishAndGrade = useCallback(() => {
    const submission: StudentQuizSubmission = {
      candidateName:
        candidateName.trim() ||
        (quizDisplayLang === "FR" ? "Élève Candidat(e)" : "تلميذ(ة)"),
      candidateClass:
        candidateClass.trim() ||
        (quizDisplayLang === "FR" ? "Lycée Qualifiant" : "السلك الثانوي التأهيلي"),
      candidateNumber: candidateNumber.trim() || "—",
      answers,
      formulaAnswers,
      flaggedQuestionIds: flaggedIds,
      elapsedSeconds,
      completedAt: new Date().toISOString(),
    };

    const finalReport = evaluateStudentQuiz(
      quizData,
      submission,
      quizDisplayLang === "FR" ? "FR" : "AR"
    );
    setReport(finalReport);
    setClassRosterReports((prev) => {
      const updated = [finalReport, ...prev].slice(0, 50);
      try {
        localStorage.setItem(
          "pedagogical_quiz_class_roster_v1",
          JSON.stringify(updated)
        );
      } catch {}
      return updated;
    });
    setStep("REPORT");
    setShowSubmitConfirm(false);
  }, [
    candidateName,
    candidateClass,
    candidateNumber,
    answers,
    formulaAnswers,
    flaggedIds,
    elapsedSeconds,
    quizData,
    quizDisplayLang,
  ]);

  // التسليم الآلي الفوري عند انتهاء المهلة الزمنية المحددة
  useEffect(() => {
    if (
      step === "TAKING" &&
      chosenDurationMinutes > 0 &&
      elapsedSeconds >= chosenDurationMinutes * 60
    ) {
      handleFinishAndGrade();
    }
  }, [step, chosenDurationMinutes, elapsedSeconds, handleFinishAndGrade]);

  // طباعة تقرير النتيجة مع عزل النافذة المنبثقة عن ورقة الفرض الخلفية
  const handlePrintReport = () => {
    document.body.classList.add("printing-quiz-report");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-quiz-report");
    }, 500);
  };

  // نسخ ملخص النتيجة إلى الحافظة
  const handleCopyReportSummary = () => {
    if (!report) return;
    const text = `📊 تقرير النتيجة الرسمية — اختبار الرياضيات التفاعلي
المترشح(ة): ${report.candidateName} (${report.candidateClass} - رقم ${report.candidateNumber})
الاختبار: ${report.examTitle}
النقطة النهائية: ${report.scoreOut20.toFixed(2)} / 20.00 (${report.percentage}%)
التقدير: ${report.appraisalAr}
الوقت المستغرق: ${report.timeSpentFormatted}
عدد الإجابات الصحيحة: ${report.correctCount} من أصل ${report.totalQuestions}
تاريخ الإنجاز: ${report.evaluatedAt}
منصة الهندسة البيداغوجية والتقويم التربوي — الأستاذ: ${quizData.prof}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="quiz-modal-root fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        ref={containerRef}
        className={`quiz-modal-card bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 flex flex-col w-full transition-all duration-300 print:border-none print:shadow-none print:w-full print:rounded-none ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none h-screen"
            : "max-w-5xl max-h-[92vh] h-full"
        }`}
      >
        {/* شريط الرأس التفاعلي */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-t-2xl border-b border-indigo-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  منصة الاختبارات التفاعلية · Quizzes
                </span>
                <span className="text-xs text-slate-300">
                  {quizData.totalQuestions} أسئلة · سلم 20/20 نقطة
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white line-clamp-1">
                {quizDisplayLang === "FR"
                  ? quizData.titleFr || quizData.titleAr
                  : quizData.titleAr}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* مبدل لغة عرض الأسئلة (مزدوج BIOF / فرنسي / عربي) */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setQuizDisplayLang("BILINGUAL")}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  quizDisplayLang === "BILINGUAL"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
                title="عرض مزدوج (العربية + الفرنسية BIOF)"
              >
                ع/FR
              </button>
              <button
                type="button"
                onClick={() => setQuizDisplayLang("FR")}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  quizDisplayLang === "FR"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Affichage en Français (BIOF / Mission)"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setQuizDisplayLang("AR")}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  quizDisplayLang === "AR"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
                title="عرض باللغة العربية"
              >
                عربي
              </button>
            </div>

            {step === "TAKING" && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm">
                <Clock
                  className={`w-4 h-4 ${
                    isTimeRunningLow ? "text-rose-400 animate-pulse" : "text-indigo-400"
                  }`}
                />
                <span
                  className={`font-mono font-bold ${
                    isTimeRunningLow ? "text-rose-300" : "text-white"
                  }`}
                >
                  {chosenDurationMinutes > 0
                    ? `${Math.floor(remainingSeconds / 60)}:${
                        remainingSeconds % 60 < 10 ? "0" : ""
                      }${remainingSeconds % 60}`
                    : `${Math.floor(elapsedSeconds / 60)}:${
                        elapsedSeconds % 60 < 10 ? "0" : ""
                      }${elapsedSeconds % 60}`}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  title={isTimerPaused ? "استئناف المؤقت" : "إيقاف المؤقت مؤقتاً للأستاذ"}
                  className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {isTimerPaused ? (
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Pause className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? "تصغير النافذة" : "ملء الشاشة للتلميذ"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* محتوى الشاشة حسب المرحلة */}
        <div className="quiz-modal-body flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {/* 1. مرحلة الإعداد وتحديد هوية المترشح (SETUP STEP) */}
          {step === "SETUP" && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                  <UserCheck className="w-4 h-4" />
                  بطاقة المترشح وإعدادات الاختبار
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  جاهز لبدء الاختبار التفاعلي والتصحيح الآلي
                </h3>
                <p className="text-sm text-slate-600">
                  يمكن للتلميذ الإجابة مباشرة على شاشة الحاسوب أو الهاتف، وسيتم احتساب
                  النقطة /20 وتحديد مواطن القوة والدعم آلياً فور التسليم.
                </p>
              </div>

              {/* اختيار نموذج الذكاء الاصطناعي مع حساب Google */}
              <div className="bg-gradient-to-br from-indigo-50/70 to-slate-100 p-4 rounded-xl border border-indigo-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-800">
                      محرك الذكاء الاصطناعي التوليدي للأسئلة
                    </span>
                  </div>
                  {googleUserEmail ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      مرتبط بـ {googleUserEmail}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      حساب Google متاح للربط
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectAiModel("gemini-3.8-flash")}
                    className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 ${
                      selectedAiModel === "gemini-3.8-flash"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400"
                        : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        selectedAiModel === "gemini-3.8-flash"
                          ? "bg-white/20 text-white"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Gemini 3.8 Flash</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          selectedAiModel === "gemini-3.8-flash"
                            ? "text-indigo-100"
                            : "text-slate-500"
                        }`}
                      >
                        فائق السرعة والدقة في صياغة الأسئلة البيداغوجية
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectAiModel("gemini-4-argon")}
                    className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 ${
                      selectedAiModel === "gemini-4-argon"
                        ? "bg-indigo-900 text-white border-indigo-900 shadow-md ring-2 ring-indigo-400"
                        : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        selectedAiModel === "gemini-4-argon"
                          ? "bg-amber-400/20 text-amber-300"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <span>Gemini 4 Argon</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          PRO
                        </span>
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          selectedAiModel === "gemini-4-argon"
                            ? "text-purple-200"
                            : "text-slate-500"
                        }`}
                      >
                        استدلال رياضي عميق للمسائل التوليفية والأولمبياد
                      </div>
                    </div>
                  </button>
                </div>

                {onRegenerateWithAI && (
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isGeneratingAI}
                      onClick={() => onRegenerateWithAI(selectedAiModel)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 bg-indigo-100/60 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          جاري التوليد الذكي للأسئلة عبر {selectedAiModel}...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          إعادة توليد وتوسيع المضللات الرياضية عبر الذكاء الاصطناعي
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* بيانات هوية التلميذ */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  معلومات التلميذ(ة) الممتحن(ة)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      الاسم الكامل للمترشح(ة) / Nom & Prénom
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="مثال: يوسف العلمي / Youssef El Alami"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      رقم الترتيب / N°
                    </label>
                    <input
                      type="text"
                      value={candidateNumber}
                      onChange={(e) => setCandidateNumber(e.target.value)}
                      placeholder="مثال: 12"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      القسم / الفوج / Classe
                    </label>
                    <input
                      type="text"
                      value={candidateClass}
                      onChange={(e) => setCandidateClass(e.target.value)}
                      placeholder="مثال: 2 باك ع تجريبية 1 / Terminale Spé Maths"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* تدبير الزمن ونمط الإجابة ورمز QR للحصة التفاعلية */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    مدة الاختبار ونمط التحقق الرياضي
                  </h4>
                  <button
                    type="button"
                    onClick={handleToggleClassroomQr}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                    {showClassroomQr
                      ? "إخفاء رمز QR للحصة"
                      : "بث الاختبار للتلاميذ عبر رمز QR (Live Session)"}
                  </button>
                </div>

                {showClassroomQr && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-700">
                    <div className="space-y-1.5 text-center sm:text-right">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        ● حصة تقويم تفاعلي نشطة للقسم (Live Classroom)
                      </span>
                      <div className="text-base font-black">
                        رمز الولوج السريع للقسم (PIN) :{" "}
                        <span className="font-mono text-amber-400 tracking-widest">
                          {classroomPin}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        اعرض هذا الرمز على السبورة التفاعلية ليقوم التلاميذ بمسحه وإجراء الرائز مباشرة، ثم صَدّر نقطهم آلياً إلى مسار / Pronote.
                      </p>
                    </div>
                    {classroomQrDataUrl && (
                      <img
                        src={classroomQrDataUrl}
                        alt="Classroom Quiz QR"
                        className="w-28 h-28 rounded-xl bg-white p-1.5 shadow-lg shrink-0"
                      />
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { label: "15 دقيقة", value: 15 },
                    { label: "30 دقيقة", value: 30 },
                    { label: "45 دقيقة", value: 45 },
                    { label: "60 دقيقة", value: 60 },
                    { label: "بدون توقيت", value: 0 },
                  ].map((dur) => (
                    <button
                      key={dur.value}
                      type="button"
                      onClick={() => setChosenDurationMinutes(dur.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        chosenDurationMinutes === dur.value
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>

                {/* اختيار نمط الإجابة: QCM فقط أو QCM + تعبير رياضي رمزي حر */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    نمط إجابة التلميذ والتحقق الرمزي:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAnswerInputMode("QCM")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        answerInputMode === "QCM"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      اختيار من متعدد (QCM 4 خيارات)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswerInputMode("HYBRID_SYMBOLIC")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        answerInputMode === "HYBRID_SYMBOLIC"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      مدمج (QCM + إدخال التعبير الرياضي المباشر)
                    </button>
                  </div>
                </div>
              </div>

              {/* إحصائيات بنية الاختبار */}
              <div className="bg-slate-100/80 p-4 rounded-xl border border-slate-200 flex items-center justify-around text-center text-xs text-slate-700">
                <div>
                  <div className="text-lg font-black text-slate-900">
                    {quizData.totalQuestions}
                  </div>
                  <div>سؤالاً تفاعلياً</div>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div>
                  <div className="text-lg font-black text-emerald-700">20.00</div>
                  <div>نقطة إجمالية</div>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div>
                  <div className="text-lg font-black text-indigo-700">
                    {classRosterReports.length}
                  </div>
                  <div>تلاميذ مسجلون باللائحة</div>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div>
                  <div className="text-lg font-black text-amber-700">
                    {quizData.calculatorAllowed ? "مسموحة" : "ممنوعة"}
                  </div>
                  <div>الآلة الحاسبة</div>
                </div>
              </div>

              {/* زر الانطلاق */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-black text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  بدء الاختبار التفاعلي الآن · Démarrer le Quiz
                </button>
              </div>
            </div>
          )}

          {/* 2. مرحلة إجراء الاختبار (TAKING STEP) */}
          {step === "TAKING" && currentQuestion && (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* شريط التقدم السريع والمعلومات */}
              <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 font-black text-sm flex items-center justify-center">
                    {currentQIndex + 1}/{quizData.totalQuestions}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold line-clamp-1">
                      {currentQuestion.exerciseTitleAr}
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      السؤال رقم {currentQIndex + 1}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      currentQuestion.level === "N1"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : currentQuestion.level === "N2"
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-purple-100 text-purple-800 border border-purple-300"
                    }`}
                  >
                    {currentQuestion.level === "N1"
                      ? "المستوى 1 (تطبيق مباشر)"
                      : currentQuestion.level === "N2"
                      ? "المستوى 2 (استدلال وتعبئة)"
                      : "المستوى 3 (تركيب وتحدي)"}
                  </span>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                    {currentQuestion.points} نقطة
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleFlag(currentQuestion.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                      flaggedIds.includes(currentQuestion.id)
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                    title="وضع علامة لمراجعة السؤال لاحقاً"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>مراجعة</span>
                  </button>
                </div>
              </div>

              {/* شريط الإنجاز العام */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* بطاقة السؤال الرئيسي */}
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-md space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-indigo-700 tracking-wide uppercase">
                    {quizDisplayLang === "FR"
                      ? currentQuestion.categoryFr || currentQuestion.category
                      : quizDisplayLang === "AR"
                      ? currentQuestion.category
                      : `${currentQuestion.category} · ${
                          currentQuestion.categoryFr || "Mathématiques"
                        }`}
                  </div>
                  {quizDisplayLang !== "FR" && (
                    <div
                      className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-sans"
                      dir="rtl"
                    >
                      <MathText text={currentQuestion.questionPromptAr} />
                    </div>
                  )}
                  {quizDisplayLang !== "AR" && (
                    <div
                      className={`${
                        quizDisplayLang === "FR"
                          ? "text-base sm:text-lg font-bold text-slate-900 leading-relaxed"
                          : "text-xs sm:text-sm text-slate-600 italic pt-1"
                      } font-sans`}
                      dir="ltr"
                    >
                      <MathText
                        text={
                          currentQuestion.questionPromptFr ||
                          currentQuestion.questionPromptAr
                        }
                      />
                    </div>
                  )}
                </div>

                {/* الخيارات التفاعلية الأربعة */}
                <div className="space-y-3">
                  {currentQuestion.choices.map((choice: QuizChoice, cIdx: number) => {
                    const isSelected = answers[currentQuestion.id] === choice.id;
                    const badgeCode =
                      choice.code || (["A", "B", "C", "D"][cIdx] as "A" | "B" | "C" | "D");
                    return (
                      <button
                        key={choice.id || cIdx}
                        type="button"
                        onClick={() => handleSelectChoice(currentQuestion.id, choice.id)}
                        className={`w-full p-4 rounded-xl text-right transition-all flex items-center justify-between border-2 ${
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-600 shadow-md text-indigo-950 font-bold"
                            : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                              isSelected
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {badgeCode}
                          </div>
                          <div className="text-right">
                            {quizDisplayLang !== "FR" && (
                              <div className="text-sm sm:text-base font-semibold">
                                <MathText text={choice.labelAr} />
                              </div>
                            )}
                            {quizDisplayLang !== "AR" && (
                              <div
                                className={`${
                                  quizDisplayLang === "FR"
                                    ? "text-sm sm:text-base font-semibold text-slate-900"
                                    : "text-xs text-slate-500 mt-0.5"
                                } font-sans`}
                                dir="ltr"
                              >
                                <MathText
                                  text={choice.labelFr || choice.labelAr}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0">
                          {isSelected && (
                            <div className="w-3.5 h-3.5 rounded-full bg-indigo-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* حقل الإدخال الرمزي المباشر للتعبير الرياضي (عند تفعيل النمط المدمج) */}
                {answerInputMode === "HYBRID_SYMBOLIC" && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-indigo-700" />
                        أو أدخل التعبير الرياضي النهائي مباشرة (تحقق رمزي من التكافؤ):
                      </label>
                      <div className="flex items-center gap-1" dir="ltr">
                        {["√(", "π", "e^", "ln(", "+∞", "-∞", "1/2", "i"].map(
                          (sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() =>
                                setFormulaAnswers((prev) => ({
                                  ...prev,
                                  [currentQuestion.id]:
                                    (prev[currentQuestion.id] || "") + sym,
                                }))
                              }
                              className="px-2 py-0.5 rounded bg-white border border-indigo-200 hover:bg-indigo-100 font-mono text-[11px] font-bold text-indigo-900"
                            >
                              {sym}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={formulaAnswers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        setFormulaAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: e.target.value,
                        }))
                      }
                      placeholder="Ex: -1/2  ou  sqrt(2)/2  ou  +∞"
                      className="w-full px-3 py-2 rounded-lg border border-indigo-300 bg-white font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* تلميح مساعد اختياري */}
                {(currentQuestion.hintAr || currentQuestion.hintFr) && (
                  <details className="text-xs text-slate-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                    <summary className="cursor-pointer font-bold text-amber-900 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      إرشاد منهجي للمترشح (Indication méthodique)
                    </summary>
                    <div className="mt-2 text-slate-700 leading-relaxed">
                      <MathText
                        text={
                          quizDisplayLang === "FR"
                            ? currentQuestion.hintFr || currentQuestion.hintAr || ""
                            : currentQuestion.hintAr || currentQuestion.hintFr || ""
                        }
                      />
                    </div>
                  </details>
                )}
              </div>

              {/* أزرار التنقل السفلية ولوحة الأسئلة السريعة */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    السابق
                  </button>

                  <button
                    type="button"
                    disabled={currentQIndex === quizData.questions.length - 1}
                    onClick={() =>
                      setCurrentQIndex((prev) =>
                        Math.min(quizData.questions.length - 1, prev + 1)
                      )
                    }
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    التالي
                  </button>
                </div>

                {/* لوحة أرقام الأسئلة المصغرة */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  {quizData.questions.map((q, idx) => {
                    const isAns = Boolean(answers[q.id]);
                    const isFlg = flaggedIds.includes(q.id);
                    const isCur = idx === currentQIndex;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          isCur
                            ? "ring-2 ring-indigo-600 bg-indigo-600 text-white"
                            : isFlg
                            ? "bg-amber-400 text-amber-950"
                            : isAns
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-400"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title={`السؤال ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* زر إنهاء الاختبار */}
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  إنهاء وتسليم الاختبار
                </button>
              </div>

              {/* نافذة تأكيد التسليم في حالة بقاء أسئلة فارغة */}
              {showSubmitConfirm && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                    <div className="flex items-center gap-3 text-amber-600">
                      <AlertCircle className="w-6 h-6" />
                      <h4 className="text-base font-bold text-slate-900">
                        تأكيد تسليم الاختبار وتصحيحه
                      </h4>
                    </div>

                    <p className="text-sm text-slate-600">
                      لقد أجبت عن{" "}
                      <span className="font-bold text-emerald-700">
                        {answeredCount}
                      </span>{" "}
                      سؤالاً من أصل{" "}
                      <span className="font-bold text-slate-900">
                        {quizData.totalQuestions}
                      </span>
                      .{unansweredCount > 0 && (
                        <span className="block mt-1 text-amber-700 font-semibold">
                          ⚠️ تنبيه: ما زال هناك {unansweredCount} سؤالاً بدون إجابة.
                        </span>
                      )}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSubmitConfirm(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200"
                      >
                        العودة للمراجعة
                      </button>
                      <button
                        type="button"
                        onClick={handleFinishAndGrade}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        تأكيد وحساب النقطة آلياً
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. تقرير النتيجة والتصحيح الآلي المفصل (REPORT STEP) */}
          {step === "REPORT" && report && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* بطاقة النتيجة الرسمية العليا */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-800 space-y-6 print:bg-white print:text-slate-900 print:border print:border-slate-300 print:shadow-none">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-indigo-800/80 pb-5">
                  <div className="text-center sm:text-right">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      شهادة التقييم الرقمي الفردي
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-2">
                      {report.candidateName}
                    </h3>
                    <div className="text-xs text-slate-300 mt-1">
                      {report.candidateClass} · رقم الترتيب: {report.candidateNumber} · {report.evaluatedAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                      <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                        {report.scoreOut20.toFixed(2)}
                      </div>
                      <div className="text-[11px] font-bold text-slate-300">
                        من أصل 20.00 نقطة
                      </div>
                    </div>

                    <div className="text-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                      <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                        {report.percentage}%
                      </div>
                      <div className="text-[11px] font-bold text-slate-300">
                        نسبة النجاح
                      </div>
                    </div>
                  </div>
                </div>

                {/* التقدير البيداغوجي */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-7 h-7 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-sm sm:text-base font-bold text-white">
                        {report.appraisalAr}
                      </div>
                      <div className="text-xs text-slate-300 italic mt-0.5" dir="ltr">
                        {report.appraisalFr}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 font-mono shrink-0">
                    ⏱️ الوقت: {report.timeSpentFormatted}
                  </div>
                </div>

                {/* أزرار الإجراءات للتقرير */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1 print:hidden">
                  <button
                    type="button"
                    onClick={handleCopyReportSummary}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        تم نسخ الملخص ✓
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        نسخ ملخص النتيجة
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      exportQuizRosterToMassarCSV(
                        classRosterReports.length > 0
                          ? classRosterReports
                          : [report],
                        quizData.titleAr
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    تصدير النقط إلى مسار / Pronote ({classRosterReports.length || 1})
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintReport}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    طباعة شهادة النتيجة (A4 / PDF)
                  </button>

                  <button
                    type="button"
                    onClick={handleStartQuiz}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    إعادة المحاولة
                  </button>
                </div>
              </div>

              {/* تفكيك المستويات المهارية N1 / N2 / N3 */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  تشخيص التحكم في المستويات المهارية والكفايات
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.competencyBreakdown.map((comp) => (
                    <div
                      key={comp.level}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            comp.level === "N1"
                              ? "bg-emerald-100 text-emerald-800"
                              : comp.level === "N2"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {comp.level}
                        </span>
                        <span className="text-sm font-black font-mono text-slate-800">
                          {comp.earnedPoints}/{comp.totalPoints} ن ({comp.percentage}%)
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {quizDisplayLang === "FR" ? comp.labelFr : comp.labelAr}
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            comp.percentage >= 75
                              ? "bg-emerald-500"
                              : comp.percentage >= 50
                              ? "bg-blue-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${comp.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* بطاقة الدعم والمعالجة الفردية الفارقية (Fiche de Remédiation Différenciée Post-Quiz) */}
              {report.remediationPlan && report.remediationPlan.length > 0 && (
                <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-300/80 shadow-xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
                    <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-amber-700" />
                      بطاقة التشخيص وخطة المعالجة والدعم الفردي الفارقي (Fiche de Remédiation Ciblée)
                    </h4>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-950">
                      موصى بها للتلميذ بناءً على الأخطاء المرصودة
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.remediationPlan.map((rem) => (
                      <div
                        key={rem.id}
                        className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-indigo-950">
                          <span>
                            {quizDisplayLang === "FR" ? rem.domainFr : rem.domainAr}
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {rem.level}
                          </span>
                        </div>
                        <div className="text-rose-800 font-semibold">
                          ⚠{" "}
                          {quizDisplayLang === "FR"
                            ? rem.diagnosedObstacleFr
                            : rem.diagnosedObstacleAr}
                        </div>
                        <div className="text-slate-700">
                          <strong>الإجراء العلاجي: </strong>
                          {quizDisplayLang === "FR"
                            ? rem.recommendedActionFr
                            : rem.recommendedActionAr}
                        </div>
                        <div className="text-[11px] text-emerald-900 bg-emerald-50/70 p-2 rounded border border-emerald-200">
                          <MathText
                            text={
                              quizDisplayLang === "FR"
                                ? rem.practiceExerciseFr
                                : rem.practiceExerciseAr
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* التصحيح المفصل سؤالاً بسؤال مع الشرح الرياضي */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                    التصحيح الرياضي المفصل وعناصر الإجابة
                  </h4>
                  <div className="text-xs text-slate-500">
                    <span className="text-emerald-700 font-bold">
                      {report.correctCount} صحيحة
                    </span>{" "}
                    ·{" "}
                    <span className="text-rose-700 font-bold">
                      {report.incorrectCount} خاطئة
                    </span>{" "}
                    ·{" "}
                    <span className="text-amber-700 font-bold">
                      {report.unansweredCount} بدون إجابة
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {report.verdicts.map((verd, idx) => {
                    const isExpanded = selectedReviewQIdx === idx;
                    return (
                      <div
                        key={verd.questionId}
                        className={`p-4 rounded-xl border transition-all ${
                          verd.isCorrect
                            ? "border-emerald-200 bg-emerald-50/40"
                            : verd.isUnanswered
                            ? "border-amber-200 bg-amber-50/40"
                            : "border-rose-200 bg-rose-50/40"
                        }`}
                      >
                        <div
                          className="flex items-start justify-between gap-3 cursor-pointer"
                          onClick={() =>
                            setSelectedReviewQIdx(isExpanded ? null : idx)
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {verd.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : verd.isUnanswered ? (
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-700">
                                  سؤال {verd.questionNumber}:
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {verd.exerciseTitle}
                                </span>
                                <span className="text-[11px] font-mono px-1.5 rounded bg-slate-200 text-slate-700">
                                  {verd.pointsEarned}/{verd.maxPoints} ن
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-slate-900 mt-1">
                                <MathText text={verd.questionPrompt} />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="text-xs text-indigo-700 hover:text-indigo-900 font-bold underline shrink-0 mt-1"
                          >
                            {isExpanded ? "إخفاء الشرح" : "عرض الشرح الرياضي"}
                          </button>
                        </div>

                        {/* إجابة التلميذ مقابل الإجابة الصحيحة */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                          <div
                            className={`p-2.5 rounded-lg ${
                              verd.isCorrect
                                ? "bg-emerald-100/70 text-emerald-950 font-semibold"
                                : "bg-rose-100/70 text-rose-950 font-semibold"
                            }`}
                          >
                            <span className="font-bold">إجابة التلميذ: </span>
                            <MathText text={verd.selectedChoiceLabel} />
                          </div>

                          <div className="p-2.5 rounded-lg bg-emerald-100/70 text-emerald-950 font-semibold">
                            <span className="font-bold">الإجابة الصحيحة: </span>
                            <MathText text={verd.correctChoiceLabel} />
                          </div>
                        </div>

                        {/* الشرح المفصل عند النقر */}
                        {isExpanded && (
                          <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-2">
                            <div className="font-bold text-indigo-800 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              التعليل البيداغوجي وعناصر الإجابة:
                            </div>
                            <div className="leading-relaxed">
                              <MathText text={verd.explanation} />
                            </div>
                            {verd.fullSolution && (
                              <div className="pt-2 border-t border-slate-100">
                                <span className="font-bold text-slate-700">
                                  البرهان الرياضي الكامل:
                                </span>
                                <div className="mt-1 text-[11px] text-slate-700 whitespace-pre-line leading-relaxed">
                                  <MathText text={verd.fullSolution} />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
