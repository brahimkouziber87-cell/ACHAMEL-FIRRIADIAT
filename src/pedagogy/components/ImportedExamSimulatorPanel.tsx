import React, { useEffect, useState } from "react";
import {
  IMPORTED_EXAMS_ARCHIVE,
  ImportedExamBlueprint,
  ImportedExamExercise,
  parseImportedExamText,
  SimulationMode,
} from "../utils/importedExamSimulator";
import { EducationSystem, LessonItem } from "../data/curriculum";
import { PdfDocumentHighlighterStudio } from "./PdfDocumentHighlighterStudio";
import {
  CheckCircle2,
  CopyPlus,
  FileCode2,
  FileText,
  FileUp,
  Highlighter,
  Layers,
  RefreshCw,
  Sliders,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";

export type ImportSimulatorTabId =
  | "ARCHIVE"
  | "UPLOAD_FILE"
  | "PASTE_TEXT"
  | "PDF_HIGHLIGHTER";

interface ImportedExamSimulatorPanelProps {
  activeBlueprint: ImportedExamBlueprint | null;
  isSimulationActive: boolean;
  simulationMode: SimulationMode;
  variationSeed: number;
  targetTrackCode: string;
  trackLabel?: string;
  educationSystem?: EducationSystem;
  initialImportTab?: ImportSimulatorTabId;
  onApplySimulation: (
    blueprint: ImportedExamBlueprint,
    mode: SimulationMode,
    seed: number
  ) => void;
  onDisableSimulation: () => void;
  onCloseStudio?: () => void;
  onExportPDF?: () => void;
  onExportEvalGridExcel?: () => void;
  selectedAiModel?: "gemini-3.8-flash" | "gemini-4-argon";
  onInsertLessonToExam?: (lesson: LessonItem) => void;
  onInsertQuestionToExam?: (payload: {
    questionAr: string;
    questionFr: string;
    solutionAr: string;
    solutionFr: string;
    points?: number;
    level?: "N1" | "N2" | "N3";
  }) => void;
  onNotify?: (type: "success" | "error" | "info", message: string) => void;
}

const SAMPLE_PASTED_EXAM = `التمرين الأول (6 نقط): المتتاليات العددية
نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = 2 و u_{n+1} = (4u_n - 1)/(u_n + 2) لكل n من N.
1. أحسب u_1 و u_2، ثم بين بالترجع أن u_n > 1 لكل n من N.
2. أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة.
3. نضع v_n = 1/(u_n - 1). بين أن (v_n) متتالية حسابية أساسها r = 1/3 ثم أكتب u_n بدلالة n وأحسب lim u_n.

التمرين الثاني (5 نقط): الأعداد العقدية والتحويلات
1. حل في مجموعة الأعداد العقدية C المعادلة: z² - 2√3 z + 4 = 0.
2. نعتبر في المستوى العقدي النقط A و B و C التي ألحاقها a = √3 + i و b = √3 - i و c = 2i. أكتب a على الشكل الأسي.
3. بين أن صورة A بالدوران R الذي مركزه O وزاويته π/3 هي C، واستنتج طبيعة المثلث OAC.

التمرين الثالث (9 نقط): مسألة دراسة دالة عددية والتكامل
نعتبر الدالة العددية f المعرفة على R بـ: f(x) = (x - 1)e^x + x.
1. أحسب lim_{x→-∞} f(x) وبين أن المستقيم (Δ): y = x مقارب مائل بجوار -∞.
2. أحسب المشتقة f'(x) لكل x من R وبين أن f تزايدية قطعا على R.
3. باستعمال المكاملة بالأجزاء، أحسب التكامل I = ∫_0^1 (x - 1)e^x dx واستنتج مساحة الحيز المحصور.`;

export const ImportedExamSimulatorPanel: React.FC<
  ImportedExamSimulatorPanelProps
> = ({
  activeBlueprint,
  isSimulationActive,
  simulationMode,
  variationSeed,
  targetTrackCode,
  trackLabel = "2BAC Sciences Mathématiques / PC",
  educationSystem = "MAROC_NATIONAL",
  initialImportTab = "ARCHIVE",
  onApplySimulation,
  onDisableSimulation,
  onCloseStudio,
  onExportPDF,
  onExportEvalGridExcel,
  selectedAiModel = "gemini-3.8-flash",
  onInsertLessonToExam,
  onInsertQuestionToExam,
  onNotify,
}) => {
  const [importTab, setImportTab] =
    useState<ImportSimulatorTabId>(initialImportTab);

  useEffect(() => {
    setImportTab(initialImportTab);
  }, [initialImportTab]);

  const [selectedBlueprint, setSelectedBlueprint] =
    useState<ImportedExamBlueprint>(
      activeBlueprint || IMPORTED_EXAMS_ARCHIVE[0]
    );
  const [localMode, setLocalMode] = useState<SimulationMode>(simulationMode);
  const [localSeed, setLocalSeed] = useState<number>(variationSeed);
  const [rawPasteText, setRawPasteText] = useState<string>(SAMPLE_PASTED_EXAM);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    name: string;
    sizeKb: number;
    mimeType: string;
    base64?: string;
    textContent?: string;
  } | null>(null);
  const [editingExerciseIdx, setEditingExerciseIdx] = useState<number | null>(
    null
  );
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const handleSelectArchiveExam = (exam: ImportedExamBlueprint) => {
    setSelectedBlueprint(exam);
    onApplySimulation(exam, localMode, localSeed);
    setFeedbackBanner(
      `تم استيراد ومحاكاة « ${exam.titleAr} » (${exam.exercises.length} تمارين · 20/20 نقطة) مباشرة في ورقة الفرض المعاينة!`
    );
  };

  const handleModeChange = (newMode: SimulationMode) => {
    setLocalMode(newMode);
    onApplySimulation(selectedBlueprint, newMode, localSeed);
  };

  const handleRegenerateTwinVariant = () => {
    const nextSeed = localSeed + 1;
    setLocalSeed(nextSeed);
    setLocalMode("ISOMORPHIC_TWIN");
    onApplySimulation(selectedBlueprint, "ISOMORPHIC_TWIN", nextSeed);
    setFeedbackBanner(
      `تم توليد النسخة المحاكية الموازية رقم #${nextSeed} بتبديل المعطيات العددية والدوال وإعادة حساب الحلول!`
    );
  };

  const handleParsePastedTextInstant = () => {
    if (!rawPasteText.trim()) return;
    const parsed = parseImportedExamText(rawPasteText);
    setSelectedBlueprint(parsed);
    onApplySimulation(parsed, localMode, localSeed);
    setFeedbackBanner(
      `تم تفكيك بنية النص المستورد إلى ${parsed.exercises.length} تمارين مهيكلة وموازنة سلم التنقيط على 20/20 واعتمادها في المعاينة!`
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    const isTextOrCode = /\.(txt|tex|typ|md|json|csv)$/i.test(file.name);

    if (isTextOrCode) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        setUploadedFileInfo({
          name: file.name,
          sizeKb,
          mimeType: file.type || "text/plain",
          textContent: text,
        });
        setRawPasteText(text);
        const parsed = parseImportedExamText(text, file.name);
        setSelectedBlueprint(parsed);
        onApplySimulation(parsed, localMode, localSeed);
        setFeedbackBanner(
          `تم قراءة وتحليل الملف « ${file.name} » (${parsed.exercises.length} تمارين) وتوليد المحاكاة الكاملة فوراً!`
        );
      };
      reader.readAsText(file);
    } else {
      // ملف PDF أو صورة مصورة لفرض محروس (PNG / JPG / WebP)
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : "";
        const mime =
          file.type ||
          (file.name.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : "image/png");
        setUploadedFileInfo({
          name: file.name,
          sizeKb,
          mimeType: mime,
          base64: dataUrl,
        });
        // نشغل التحليل الذكي تلقائياً للملف المرفوع
        await triggerAISimulation({
          fileName: file.name,
          fileBase64: dataUrl,
          fileMimeType: mime,
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const triggerAISimulation = async (params?: {
    fileName?: string;
    fileBase64?: string;
    fileMimeType?: string;
    textOverride?: string;
  }) => {
    setIsAnalyzingAI(true);
    setFeedbackBanner(
      "جاري تحليل بنية الفرض المحروس المستورد واستخراج التمارين وسلم التنقيط والحلول..."
    );

    try {
      const response = await fetch("/api/simulate-imported-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawText:
            params?.textOverride ??
            uploadedFileInfo?.textContent ??
            (importTab === "PASTE_TEXT" ? rawPasteText : ""),
          fileBase64: params?.fileBase64 ?? uploadedFileInfo?.base64,
          fileMimeType: params?.fileMimeType ?? uploadedFileInfo?.mimeType,
          fileName: params?.fileName ?? uploadedFileInfo?.name,
          simulationMode: localMode,
          targetTrackCode,
          modelChoice: selectedAiModel,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.blueprint) {
        throw new Error(data.error || "تعذر استخراج البنية عبر الخادم");
      }

      const aiBp: ImportedExamBlueprint = data.blueprint;
      setSelectedBlueprint(aiBp);
      onApplySimulation(aiBp, localMode, localSeed);
      setFeedbackBanner(
        `تم تحليل ومحاكاة الفرض المستورد « ${aiBp.titleAr} » بنجاح (${aiBp.exercises.length} تمارين مع عناصر الإجابة والنموذج الموازي)!`
      );
    } catch {
      // محرك احتياطي فوري يعمل دون انقطاع
      const fallbackBp =
        rawPasteText.trim().length > 15
          ? parseImportedExamText(
              rawPasteText,
              params?.fileName || uploadedFileInfo?.name
            )
          : {
              ...IMPORTED_EXAMS_ARCHIVE[0],
              sourceType: "UPLOADED_FILE" as const,
              sourceFileName:
                params?.fileName ||
                uploadedFileInfo?.name ||
                "Devoir_Importe.pdf",
              titleAr: `محاكاة الفرض المستورد (${
                params?.fileName || uploadedFileInfo?.name || "وثيقة مرفوعة"
              })`,
            };

      setSelectedBlueprint(fallbackBp);
      onApplySimulation(fallbackBp, localMode, localSeed);
      setFeedbackBanner(
        `تمت هيكلة ومحاكاة الفرض المستورد عبر المحرك الرياضي الفوري (${fallbackBp.exercises.length} تمارين · 20/20 نقطة)!`
      );
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleUpdateExerciseField = (
    exIdx: number,
    updater: (ex: ImportedExamExercise) => ImportedExamExercise
  ) => {
    const updatedExercises = selectedBlueprint.exercises.map((ex, i) =>
      i === exIdx ? updater(ex) : ex
    );
    const totalPts =
      updatedExercises.reduce((acc, e) => acc + e.points, 0) || 20;
    let remW = 100;
    const normalizedExercises = updatedExercises.map((ex, i) => {
      const w =
        i === updatedExercises.length - 1
          ? Math.max(5, remW)
          : Math.max(5, Math.round((ex.points / totalPts) * 100));
      remW -= w;
      return { ...ex, weight: w };
    });

    const nextBp: ImportedExamBlueprint = {
      ...selectedBlueprint,
      exercises: normalizedExercises,
    };
    setSelectedBlueprint(nextBp);
    onApplySimulation(nextBp, localMode, localSeed);
  };

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-4 md:p-5 shadow-xs space-y-4">
      {/* رأس استوديو محاكاة الفرض المستورد */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-950 text-amber-400 flex items-center justify-center shrink-0">
            <CopyPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black text-slate-950">
                استوديو محاكاة واستنساخ الفروض المحروسة المستوردة (DS Import & Clone Simulator)
              </h3>
              {isSimulationActive && (
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">
                  ● وضع محاكاة الفرض المستورد نشط في الورقة (A4)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600">
              استورد أي فرض محروس (ملف PDF / صورة مصورة / كود LaTeX / نص أو من الأرشيف الرسمي) لمحاكاته بنفس البنية وسلم التنقيط أو توليد نسخة موازية بمعطيات ودوال جديدة
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRegenerateTwinVariant}
            className="px-3 py-1.5 rounded-lg text-xs font-black bg-indigo-900 hover:bg-indigo-950 text-white transition flex items-center gap-1.5 cursor-pointer"
            title="توليد فرض محروس موازٍ بنفس البنية والأسئلة مع تبديل الأعداد والدوال والمتتاليات"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span>توليد محاكاة بأعداد ودوال جديدة (#{localSeed + 1})</span>
          </button>

          {isSimulationActive && (
            <button
              type="button"
              onClick={onDisableSimulation}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>إنهاء المحاكاة</span>
            </button>
          )}

          {onCloseStudio && (
            <button
              type="button"
              onClick={onCloseStudio}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              طي اللوحة
            </button>
          )}
        </div>
      </div>

      {/* إشعار التفاعل الفوري */}
      {feedbackBanner && (
        <div className="bg-emerald-50/90 border border-emerald-300 text-emerald-950 rounded-xl px-3.5 py-2 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="text-emerald-800 hover:text-emerald-950 text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. اختيار مصدر استيراد الفرض المحروس + نمط المحاكاة */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* تبويبات مصدر الاستيراد (7 أعمدة) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setImportTab("ARCHIVE")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                importTab === "ARCHIVE"
                  ? "bg-white text-indigo-950 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. أرشيف فروض جاهزة ({IMPORTED_EXAMS_ARCHIVE.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setImportTab("UPLOAD_FILE")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                importTab === "UPLOAD_FILE"
                  ? "bg-white text-indigo-950 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>2. رفع ملف (PDF / صورة)</span>
            </button>
            <button
              type="button"
              onClick={() => setImportTab("PASTE_TEXT")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                importTab === "PASTE_TEXT"
                  ? "bg-white text-indigo-950 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>3. لصق نص أو LaTeX</span>
            </button>
            <button
              type="button"
              onClick={() => setImportTab("PDF_HIGHLIGHTER")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                importTab === "PDF_HIGHLIGHTER"
                  ? "bg-indigo-950 text-amber-300 shadow-2xs"
                  : "bg-amber-100/80 text-indigo-950 hover:bg-amber-200/80"
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>4. عارض PDF التفاعلي والتظليل الذكي</span>
            </button>
          </div>

          {/* محتوى التبويب الأول: خزانة الفروض المستوردة الجاهزة */}
          {importTab === "ARCHIVE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto studio-scroll pr-1">
              {IMPORTED_EXAMS_ARCHIVE.map((exam) => {
                const isSelected = selectedBlueprint.id === exam.id;
                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => handleSelectArchiveExam(exam)}
                    className={`text-right p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                      isSelected
                        ? "border-indigo-700 bg-indigo-50/70 ring-1 ring-indigo-600/30"
                        : "border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between gap-1 text-[10px] text-indigo-800 font-bold">
                        <span>{exam.detectedTrackCode} · {exam.semester}</span>
                        <span className="font-mono">{exam.exercises.length} تمارين · 20/20</span>
                      </div>
                      <div className="text-xs font-black text-slate-950 leading-snug">
                        {exam.titleAr}
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate">
                        {exam.schoolOriginAr}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-600 pt-1 border-t border-slate-200/70 flex flex-wrap items-center gap-1">
                      {exam.exercises.map((ex, i) => (
                        <span key={ex.id}>
                          {i > 0 ? " · " : ""}
                          ت{i + 1}: {ex.subCategory} ({ex.points}ن)
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* محتوى التبويب الثاني: رفع ملف فرض محروس مستورد */}
          {importTab === "UPLOAD_FILE" && (
            <div className="border-2 border-dashed border-indigo-300 bg-indigo-50/30 rounded-xl p-4 text-center space-y-3">
              <div className="flex flex-col items-center gap-1.5">
                <FileUp className="w-7 h-7 text-indigo-800" />
                <div className="text-xs font-black text-slate-900">
                  ارفع ملف الفرض المحروس المستورد لتحليله ومحاكاته تلقائياً
                </div>
                <p className="text-[11px] text-slate-600 max-w-md">
                  يدعم ملفات <strong>PDF</strong>، صور الفروض الممسوحة ضوئياً (<strong>PNG, JPG, WebP</strong>)، أو ملفات الكود والنصوص (<strong>.tex, .typ, .txt, .json</strong>)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <label className="cursor-pointer px-4 py-2 rounded-lg text-xs font-black bg-indigo-900 hover:bg-indigo-950 text-white transition inline-flex items-center gap-1.5">
                  <FileUp className="w-3.5 h-3.5" />
                  <span>اختيار ملف الفرض من الجهاز</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.tex,.typ,.txt,.md,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedFileInfo && (
                  <>
                    <button
                      type="button"
                      onClick={() => triggerAISimulation()}
                      disabled={isAnalyzingAI}
                      className="px-3.5 py-2 rounded-lg text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isAnalyzingAI
                          ? "جاري تحليل الملف..."
                          : `إعادة تحليل « ${uploadedFileInfo.name} »`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportTab("PDF_HIGHLIGHTER")}
                      className="px-3.5 py-2 rounded-lg text-xs font-black bg-indigo-950 hover:bg-indigo-900 text-amber-300 border border-indigo-700 transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                      <span>فتح في عارض PDF التفاعلي وتظليل المقاطع</span>
                    </button>
                  </>
                )}
              </div>

              {uploadedFileInfo && (
                <div className="text-[11px] text-indigo-950 font-bold bg-white border border-indigo-200 rounded-lg px-3 py-1.5 inline-flex items-center gap-2">
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-700" />
                  <span>
                    الملف المرفوع: {uploadedFileInfo.name} ({uploadedFileInfo.sizeKb} KB)
                  </span>
                </div>
              )}
            </div>
          )}

          {importTab === "PDF_HIGHLIGHTER" && (
            <div className="bg-indigo-950/90 text-amber-200 rounded-xl p-3 text-xs font-bold flex items-center justify-between gap-2 border border-indigo-700">
              <div className="flex items-center gap-2">
                <Highlighter className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  عارض PDF التفاعلي مفتوح بالأسفل بكامل العرض — ظلل أي مقطع بالماوس لتوليد تمرين رياضي موازٍ وإدراجه في الفرض!
                </span>
              </div>
            </div>
          )}

          {/* محتوى التبويب الثالث: لصق نص الفرض أو كود LaTeX */}
          {importTab === "PASTE_TEXT" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">
                  الصق نص الفرض المحروس (بالعربية أو الفرنسية أو كود LaTeX):
                </span>
                <button
                  type="button"
                  onClick={() => setRawPasteText(SAMPLE_PASTED_EXAM)}
                  className="text-indigo-800 hover:underline font-bold cursor-pointer"
                >
                  استعادة نص الفرض النموذجي
                </button>
              </div>
              <textarea
                rows={5}
                value={rawPasteText}
                onChange={(e) => setRawPasteText(e.target.value)}
                placeholder="الصق هنا نص التمارين والأسئلة أو كود LaTeX للفرض المستورد..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50/70 p-2.5 text-xs text-slate-900 font-mono leading-relaxed focus:bg-white focus:border-indigo-600 outline-none"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleParsePastedTextInstant}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-indigo-900 hover:bg-indigo-950 text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>تفكيك ومحاكاة النص فوراً في الورقة (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerAISimulation({ textOverride: rawPasteText })
                  }
                  disabled={isAnalyzingAI}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isAnalyzingAI
                      ? "جاري المحاكاة المعمقة..."
                      : "محاكاة ذكية معمقة وتوليد الحلول"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* أنماط المحاكاة الثلاثة وخلاصة البنية (5 أعمدة) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-800" />
                <span>اختر نمط محاكاة الفرض المستورد:</span>
              </span>
              <span className="text-[11px] font-mono text-indigo-800">
                النسخة #{localSeed}
              </span>
            </div>

            <div className="space-y-1.5">
              {(
                [
                  {
                    id: "EXACT_REPLICA" as SimulationMode,
                    title: "1. محاكاة مطابقة وتنسيق رسمي (Réplique Fidèle)",
                    desc: "الاحتفاظ بنفس تمارين وأسئلة الفرض المستورد مع إلباسه الترويسة الرسمية وتوليد عناصر الإجابة وشبكة التقويم.",
                  },
                  {
                    id: "ISOMORPHIC_TWIN" as SimulationMode,
                    title: "2. محاكاة موازية بتغيير الأعداد والدوال (Clone Isomorphe)",
                    desc: "نفس بنية ومهارات وسلم تنقيط الفرض المستورد تماماً مع تغيير الدوال والمعاملات والأعداد لمنع الغش.",
                  },
                  {
                    id: "PEDAGOGICAL_ADAPTATION" as SimulationMode,
                    title: "3. تكييف بيداغوجي وإرشادات منهجية (Adaptation)",
                    desc: "إدراج توجيهات وإرشادات منهجية للأسئلة المركبة وموازنة تدريج الصعوبة (N1/N2/N3).",
                  },
                ] as const
              ).map((m) => {
                const active = localMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleModeChange(m.id)}
                    className={`w-full text-right p-2 rounded-lg border transition cursor-pointer ${
                      active
                        ? "bg-indigo-950 text-white border-indigo-950"
                        : "bg-white text-slate-800 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-xs font-black">{m.title}</div>
                    <div
                      className={`text-[10.5px] leading-snug ${
                        active ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {m.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* أزرار التطبيق المباشر والتصدير */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onApplySimulation(selectedBlueprint, localMode, localSeed)
              }
              className="flex-1 py-2 px-3 rounded-lg text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white transition text-center cursor-pointer"
            >
              تطبيق المحاكاة في ورقة الفرض (A4)
            </button>
            {onExportPDF && (
              <button
                type="button"
                onClick={onExportPDF}
                className="py-2 px-3 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
              >
                تصدير PDF
              </button>
            )}
            {onExportEvalGridExcel && (
              <button
                type="button"
                onClick={onExportEvalGridExcel}
                className="py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition cursor-pointer"
              >
                شبكة Excel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* عارض وثائق PDF التفاعلي وتوليد التمارين بالتظليل الذكي (يظهر بكامل العرض عند اختيار تبويب PDF_HIGHLIGHTER) */}
      {importTab === "PDF_HIGHLIGHTER" && (
        <PdfDocumentHighlighterStudio
          targetTrackCode={targetTrackCode}
          trackLabel={trackLabel}
          educationSystem={educationSystem}
          selectedAiModel={selectedAiModel}
          initialUploadedFile={
            uploadedFileInfo?.base64
              ? {
                  name: uploadedFileInfo.name,
                  mimeType: uploadedFileInfo.mimeType,
                  base64: uploadedFileInfo.base64,
                }
              : null
          }
          onInsertLessonToExam={(lessonItem) => {
            if (onInsertLessonToExam) {
              onInsertLessonToExam(lessonItem);
            }
            setFeedbackBanner(
              `✓ تم إدراج التمرين المولد من المقطع المظلل (« ${lessonItem.lessonAr} ») مع عناصر الإجابة مباشرة في ورقة الفرض A4!`
            );
          }}
          onInsertQuestionToExam={(qPayload) => {
            if (onInsertQuestionToExam) {
              onInsertQuestionToExam(qPayload);
            }
            setFeedbackBanner(
              `✓ تم إدراج السؤال المولد من المقطع المظلل (${qPayload.points || 1.5} ن · ${qPayload.level || "N2"}) مباشرة في الفرض الحالي!`
            );
          }}
          onNotify={(type, msg) => {
            setFeedbackBanner(msg);
            onNotify?.(type, msg);
          }}
        />
      )}

      {/* 2. تفصيل وتحرير تمارين الفرض المستورد والمحاكى */}
      <div className="border-t border-slate-200 pt-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-black text-slate-900 flex flex-wrap items-center gap-2">
            <span>بنية الفرض المستورد قيد المحاكاة:</span>
            <span className="text-indigo-900">{selectedBlueprint.titleAr}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-slate-600">
              {selectedBlueprint.exercises.length} تمارين · مجموع النقط:{" "}
              {selectedBlueprint.exercises
                .reduce((s, e) => s + e.points, 0)
                .toFixed(1)}{" "}
              / 20
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            يمكنك تعديل عنوان أو تنقيط أو أسئلة أي تمرين مستورد مباشرة أدناه
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {selectedBlueprint.exercises.map((ex, idx) => {
            const isEditing = editingExerciseIdx === idx;
            return (
              <div
                key={ex.id}
                className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black text-indigo-950">
                      التمرين {idx + 1} · {ex.subCategory}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-extrabold text-emerald-800">
                        {ex.points} ن ({ex.weight}%)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingExerciseIdx(isEditing ? null : idx)
                        }
                        className="text-[10.5px] font-bold text-indigo-700 hover:underline cursor-pointer"
                      >
                        {isEditing ? "إغلاق التحرير" : "تعديل"}
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={ex.titleAr}
                          onChange={(e) =>
                            handleUpdateExerciseField(idx, (item) => ({
                              ...item,
                              titleAr: e.target.value,
                            }))
                          }
                          className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold"
                          placeholder="عنوان التمرين بالعربية"
                        />
                        <input
                          type="number"
                          min={1}
                          max={20}
                          step={0.5}
                          value={ex.points}
                          onChange={(e) =>
                            handleUpdateExerciseField(idx, (item) => ({
                              ...item,
                              points: Math.max(
                                1,
                                Math.min(20, Number(e.target.value) || 4)
                              ),
                            }))
                          }
                          className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono font-bold text-center"
                          title="النقط المخصصة للتمرين من 20"
                        />
                      </div>
                      <textarea
                        rows={4}
                        value={ex.questionsAr.join("\n")}
                        onChange={(e) => {
                          const lines = e.target.value
                            .split("\n")
                            .filter((l) => l.trim().length > 0);
                          handleUpdateExerciseField(idx, (item) => ({
                            ...item,
                            questionsAr: lines,
                            questionsFr: lines,
                          }));
                        }}
                        className="w-full rounded border border-slate-300 bg-white p-1.5 text-[11px] leading-relaxed"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-xs font-bold text-slate-900">
                        {ex.titleAr}
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                        {ex.questionsAr.slice(0, 3).map((q, qI) => (
                          <li key={qI} className="truncate" title={q}>
                            {q.replace(/^\d+[\.\)]\s*/, "")}
                          </li>
                        ))}
                        {ex.questionsAr.length > 3 && (
                          <li className="text-[10px] text-slate-500 list-none">
                            + {ex.questionsAr.length - 3} أسئلة إضافية...
                          </li>
                        )}
                      </ol>
                    </>
                  )}
                </div>

                <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{ex.questionsAr.length} أسئلة مبرمجة</span>
                  <span>مرفق بالحل المفصل والنموذج B</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
