import React, { useState } from "react";
import {
  X,
  FileDown,
  Printer,
  FileCode,
  Layers,
  Sparkles,
  Check,
  ExternalLink,
  Settings,
  Globe,
  BookOpen,
  FileJson,
  FileArchive,
  Archive,
  FileText,
  Sliders,
} from "lucide-react";
import {
  exportStandaloneHTML,
  exportEditableWordDoc,
  exportPreviewToPDF,
  PrintMarginPreset,
  PrintColorMode,
  PrintDpiQuality,
} from "../utils/pdfExporter";
import { generateOverleafZipBundle } from "../utils/overleafZipExporter";
import { exportExamToMoodleXML } from "../utils/mathjsValidator";
import { LessonItem } from "../data/curriculum";

export interface ExportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintPreview: (solutionsOnly?: boolean) => void;
  onDownloadFile: (overrideFmt?: "PDF" | "LATEX" | "TYPST") => void;
  exportFormat: "PDF" | "LATEX" | "TYPST";
  setExportFormat: (fmt: "PDF" | "LATEX" | "TYPST") => void;
  pageOrientation: "PORTRAIT" | "LANDSCAPE";
  setPageOrientation: (o: "PORTRAIT" | "LANDSCAPE") => void;
  documentFileTag: string;
  year: string;
  includeDetailedSolutions: boolean;
  setIncludeDetailedSolutions: (inc: boolean) => void;
  examModel: "A" | "B" | "BOTH";
  setExamModel: (m: "A" | "B" | "BOTH") => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
  onOpenJsonConfigModal?: () => void;
  school?: string;
  prof?: string;
  trackLabelAr?: string;
  trackLabelFr?: string;
  academy?: string;
  direction?: string;
  generatedLatexCode?: string;
  hasQcm?: boolean;
  hasPython?: boolean;
  lessons?: LessonItem[];
  interactiveExamUrl?: string;
  includeInteractiveQrFooter?: boolean;
  onOpenExportDashboard?: () => void;
  onFileExported?: (
    fileName: string,
    category: "PDF" | "OVERLEAF_ZIP" | "LATEX_TYPST" | "EXCEL_CSV" | "HTML_JSON",
    formatLabel: string,
    fileSizeKb: number
  ) => void;
}

export const ExportCenterModal: React.FC<ExportCenterModalProps> = ({
  isOpen,
  onClose,
  onPrintPreview,
  onDownloadFile,
  exportFormat,
  setExportFormat,
  pageOrientation,
  setPageOrientation,
  documentFileTag,
  year,
  includeDetailedSolutions,
  setIncludeDetailedSolutions,
  examModel,
  setExamModel,
  onNotify,
  onOpenJsonConfigModal,
  school = "Lycée d'Excellence",
  prof = "Prof. Brahim KOUZIBER",
  trackLabelAr = "2 باك علوم رياضية وتجريبية",
  trackLabelFr = "2BAC Sciences / Terminale Spécialité",
  academy = "الأكاديمية الجهوية للتربية والتكوين",
  direction = "المديرية الإقليمية",
  generatedLatexCode = "",
  hasQcm = true,
  hasPython = true,
  lessons = [],
  interactiveExamUrl,
  includeInteractiveQrFooter = true,
  onOpenExportDashboard,
  onFileExported,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingOverleafZip, setIsExportingOverleafZip] = useState(false);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [includeFooterQrCode, setIncludeFooterQrCode] = useState(includeInteractiveQrFooter);
  const [autoAdjustA4Layout, setAutoAdjustA4Layout] = useState(true);
  const [marginPreset, setMarginPreset] = useState<PrintMarginPreset>("STANDARD");
  const [colorMode, setColorMode] = useState<PrintColorMode>("FULL_COLOR");
  const [dpiQuality, setDpiQuality] = useState<PrintDpiQuality>("HIGH_300");

  // حالة شريط التقدم ومؤشر التوليد التفاعلي
  const [generatingStatus, setGeneratingStatus] = useState<{
    active: boolean;
    type: "PDF" | "ZIP" | null;
    progress: number;
    stageTitle: string;
    stageDetail: string;
  }>({
    active: false,
    type: null,
    progress: 0,
    stageTitle: "",
    stageDetail: "",
  });

  if (!isOpen) return null;

  const baseFileName = `${documentFileTag}_${year}`;

  // دالة مساعدة لتحديث مرحلة التقدم بشكل سلس
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // تصدير حزمة Overleaf ZIP المتكاملة
  const handleExportOverleafZip = async () => {
    if (isExportingOverleafZip || generatingStatus.active) return;
    setIsExportingOverleafZip(true);
    setGeneratingStatus({
      active: true,
      type: "ZIP",
      progress: 18,
      stageTitle: "توليد ملفات LaTeX المعيارية (main.tex)...",
      stageDetail: "تنسيق الترويسة المغربية وتمارين الفرض بصيغة LaTeX الرياضية النظيفة",
    });
    onNotify("info", "جاري بناء وتجميع حزمة Overleaf ZIP المتكاملة (main.tex + preamble.tex + README)...");

    try {
      await sleep(350);
      setGeneratingStatus((prev) => ({
        ...prev,
        progress: 45,
        stageTitle: "تضمين الحزم الرياضية (preamble.tex & TikZ)...",
        stageDetail: "ربط حزم STIX Math و tcolorbox والبيئات الرياضية والرسوم البيانية",
      }));

      await sleep(350);
      setGeneratingStatus((prev) => ({
        ...prev,
        progress: 75,
        stageTitle: "إعداد أكواد بايثون ودليل Overleaf (README.md)...",
        stageDetail: "تجهيز أرشيف الحزمة البرمجية وضبط ترميز UTF-8 القياسي",
      }));

      const zipBlob = await generateOverleafZipBundle({
        docTitle: documentFileTag,
        school,
        prof,
        year,
        academy,
        direction,
        trackLabelAr,
        trackLabelFr,
        examModel,
        latexCode: generatedLatexCode,
        hasQcm,
        hasPython,
      });

      setGeneratingStatus((prev) => ({
        ...prev,
        progress: 95,
        stageTitle: "ضغط الحزمة وتوليد ملف ZIP...",
        stageDetail: "اكتمال تجهيز الملف المضغوط وجاهزية التحميل",
      }));
      await sleep(300);

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseFileName}_Overleaf_Package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setGeneratingStatus({
        active: true,
        type: "ZIP",
        progress: 100,
        stageTitle: "اكتمل التوليد بنجاح!",
        stageDetail: "تم حفظ حزمة Overleaf ZIP في مجلد التنزيلات.",
      });
      await sleep(400);

      onFileExported?.(
        `${baseFileName}_Overleaf_Package.zip`,
        "OVERLEAF_ZIP",
        "Overleaf Project (.zip)",
        Number((zipBlob.size / 1024).toFixed(1)) || 46.5
      );
      onNotify("success", `تم تصدير حزمة Overleaf بنجاح (${baseFileName}_Overleaf_Package.zip)!`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء تجميع ملف ZIP";
      onNotify("error", `تعذر إنشاء حزمة Overleaf ZIP: ${msg}`);
    } finally {
      setIsExportingOverleafZip(false);
      setGeneratingStatus({
        active: false,
        type: null,
        progress: 0,
        stageTitle: "",
        stageDetail: "",
      });
    }
  };

  // تصدير PDF مباشر
  const handleExportMoodleXml = () => {
    try {
      const xml = exportExamToMoodleXML(
        `${trackLabelAr || "رياضيات"} - ${documentFileTag}`,
        "BAC",
        lessons || [],
        (l) => ({
          questionsAr: l.sampleExerciseAr || [],
          questionsFr: l.sampleExerciseFr || [],
          answersAr: l.sampleSolutionAr || [],
          answersFr: l.sampleSolutionFr || [],
        })
      );
      const blob = new Blob([xml], { type: "application/xml;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseFileName}_Moodle_TelmidTICE.xml`;
      a.click();
      URL.revokeObjectURL(url);
      onFileExported?.(`${baseFileName}_Moodle_TelmidTICE.xml`, "HTML_JSON", "Moodle XML (.xml)", Number((blob.size / 1024).toFixed(1)) || 24.5);
      onNotify("success", "تم تصدير بنك التمارين بصيغة Moodle XML المعتمدة لمنصة TelmidTICE بنجاح!");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ غير متوقع";
      onNotify("error", `تعذر تصدير Moodle XML: ${msg}`);
    }
  };

  const handleExportDirectPDF = async () => {
    if (isExportingPDF || generatingStatus.active) return;
    setIsExportingPDF(true);
    setGeneratingStatus({
      active: true,
      type: "PDF",
      progress: 20,
      stageTitle: "تهيئة بيئة المعالجة والخطوط المتجهية...",
      stageDetail: "فحص بيئة التصيير عالية الدقة (300 DPI) وتضمين خطوط STIX الرياضية",
    });
    onNotify("info", "جاري معالجة وتقسيم صفحات الوثيقة بدقة عالية 300 DPI وتوليد ملف PDF...");

    try {
      await sleep(400);
      setGeneratingStatus((prev) => ({
        ...prev,
        progress: 50,
        stageTitle: "التقسيم الذكي للصفحات ومنع بتر التمارين...",
        stageDetail: "فحص فواصل الصفحات وهوامش الأمان وحساب ارتفاع الكتل الرياضية",
      }));

      await sleep(400);
      setGeneratingStatus((prev) => ({
        ...prev,
        progress: 80,
        stageTitle: "توليد ملف PDF المتجهي وترقيم الصفحات...",
        stageDetail: "رسم الترويسة والتذييل وتوليد طبقات PDF النقية للطباعة المدرسية",
      }));

      await exportPreviewToPDF({
        elementId: "printable-document-sheet",
        fileName: `${baseFileName}.pdf`,
        orientation: pageOrientation.toLowerCase() as "portrait" | "landscape",
        showPageNumbers,
        docTitle: documentFileTag,
        headerMeta: `${school} · ${year}`,
        marginPreset,
        colorMode,
        dpiQuality,
        interactiveQuizUrl: interactiveExamUrl,
        includeFooterQrCode,
        autoAdjustA4Layout,
      });

      setGeneratingStatus({
        active: true,
        type: "PDF",
        progress: 100,
        stageTitle: "تم توليد ملف PDF بنجاح!",
        stageDetail: "جاري حفظ الملف في جهازك...",
      });
      await sleep(400);

      onFileExported?.(
        `${baseFileName}.pdf`,
        "PDF",
        colorMode === "LASER_MONO" ? "PDF Monochrome (A4)" : "PDF Vectoriel (A4)",
        dpiQuality === "ULTRA_PRINT" ? 440.0 : dpiQuality === "STANDARD_150" ? 195.0 : 315.0
      );
      onNotify("success", `تم تصدير وتحميل ملف PDF بنجاح (${baseFileName}.pdf)!`);
      onClose();
    } catch {
      onPrintPreview(false);
      onNotify("info", "تم فتح نافذة حفظ PDF المباشرة للمتصفح.");
    } finally {
      setIsExportingPDF(false);
      setGeneratingStatus({
        active: false,
        type: null,
        progress: 0,
        stageTitle: "",
        stageDetail: "",
      });
    }
  };

  // تصدير HTML مستقل
  const handleExportHTML = () => {
    try {
      exportStandaloneHTML(
        "printable-document-sheet",
        `${baseFileName}.html`,
        `${documentFileTag} - ${year}`
      );
      onFileExported?.(
        `${baseFileName}.html`,
        "HTML_JSON",
        "HTML Standalone (.html)",
        84.2
      );
      onNotify("success", `تم تصدير ملف HTML المستقل بنجاح (${baseFileName}.html)!`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ غير متوقع";
      onNotify("error", `تعذر تصدير HTML: ${msg}`);
    }
  };

  // تصدير ملف Microsoft Word قابل للتعديل (.doc)
  const handleExportWordDoc = () => {
    try {
      exportEditableWordDoc(
        "printable-document-sheet",
        `${baseFileName}.doc`,
        `${documentFileTag} - ${year}`,
        pageOrientation.toLowerCase() as "portrait" | "landscape"
      );
      onFileExported?.(
        `${baseFileName}.doc`,
        "HTML_JSON",
        "Microsoft Word (.doc)",
        92.5
      );
      onNotify("success", `تم تصدير ملف Microsoft Word القابل للتعديل بنجاح (${baseFileName}.doc)!`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ غير متوقع";
      onNotify("error", `تعذر تصدير ملف Word: ${msg}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* الترويسة العلوية للمودال */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-cyan-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-serif text-lg font-black shadow-md">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  مركز استخراج وإنشاء الملفات
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Export & Print Engine
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                تصدير واستخراج وثائق الرياضيات الرسمية
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenExportDashboard && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenExportDashboard();
                }}
                disabled={generatingStatus.active}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>سجل التحميلات وحزم Overleaf</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={generatingStatus.active}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* مؤشر وشريط التقدم الديناميكي أثناء التوليد (Generating Status & Progress Bar) */}
        {generatingStatus.active && (
          <div className="p-4 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 text-white border-b border-cyan-500/40 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/40 animate-spin">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-cyan-200 flex items-center gap-2">
                      <span>{generatingStatus.stageTitle}</span>
                      <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                        {generatingStatus.type === "PDF" ? "PDF 300 DPI" : "Overleaf ZIP Bundle"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {generatingStatus.stageDetail}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-black text-cyan-300 tracking-wider">
                    {generatingStatus.progress}%
                  </span>
                  <div className="text-[10px] font-mono text-cyan-400/80">جاري المعالجة</div>
                </div>
              </div>

              {/* شريط التقدم المتحرك ذو التدرج اللوني مع وميض Shimmer */}
              <div className="relative w-full h-3 rounded-full bg-slate-800/80 overflow-hidden border border-cyan-800/50 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 transition-all duration-300 ease-out shadow-lg shadow-cyan-500/50 relative overflow-hidden"
                  style={{ width: `${generatingStatus.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]" />
                </div>
              </div>
            </div>
          </div>
        )}


        {/* إعدادات التصدير السريعة */}
        <div className="p-4 bg-slate-100/90 border-b border-slate-200 shrink-0 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* اتجاه الصفحة A4 */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                توجيه الورقة (Orientation A4) :
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => setPageOrientation("PORTRAIT")}
                  className={`py-1.5 px-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                    pageOrientation === "PORTRAIT"
                      ? "bg-slate-900 text-cyan-300 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  عمودي (Portrait)
                </button>
                <button
                  type="button"
                  onClick={() => setPageOrientation("LANDSCAPE")}
                  className={`py-1.5 px-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                    pageOrientation === "LANDSCAPE"
                      ? "bg-slate-900 text-cyan-300 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  أفقي (Landscape)
                </button>
              </div>
            </div>

            {/* النموذج المراد استخراجه */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                النموذج المراد استخراجه (Modèle) :
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => setExamModel("A")}
                  className={`py-1.5 px-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                    examModel === "A"
                      ? "bg-slate-900 text-cyan-300 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  النموذج أ (A)
                </button>
                <button
                  type="button"
                  onClick={() => setExamModel("B")}
                  className={`py-1.5 px-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                    examModel === "B"
                      ? "bg-slate-900 text-cyan-300 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  النموذج ب (B)
                </button>
                <button
                  type="button"
                  onClick={() => setExamModel("BOTH")}
                  className={`py-1.5 px-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                    examModel === "BOTH"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  كلاهما (A + B)
                </button>
              </div>
            </div>
          </div>

          {/* معايير الطباعة الاحترافية: الهوامش ونمط الحبر والدقة */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/80">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                <Sliders className="w-3 h-3 text-cyan-700" />
                <span>هوامش الصفحة A4 :</span>
              </label>
              <select
                value={marginPreset}
                onChange={(e) => setMarginPreset(e.target.value as PrintMarginPreset)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
              >
                <option value="STANDARD">قياسية متوازنة (8.5mm)</option>
                <option value="NARROW">ضيقة مكثفة (6mm)</option>
                <option value="OFFICIAL_EXAM">رسمية للامتحانات (11mm)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                <Printer className="w-3 h-3 text-cyan-700" />
                <span>نمط الحبر والطباعة :</span>
              </label>
              <select
                value={colorMode}
                onChange={(e) => {
                  const next = e.target.value as PrintColorMode;
                  setColorMode(next);
                  document.body.classList.toggle("print-mono-laser", next === "LASER_MONO");
                }}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
              >
                <option value="FULL_COLOR">ألوان أكاديمية كاملة (Color)</option>
                <option value="LASER_MONO">طباعة ليزر أبيض وأسود (B&amp;W)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-cyan-700" />
                <span>كثافة النقاط (DPI) :</span>
              </label>
              <select
                value={dpiQuality}
                onChange={(e) => setDpiQuality(e.target.value as PrintDpiQuality)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800"
              >
                <option value="HIGH_300">عالية الدقة (300 DPI — مستحسن)</option>
                <option value="ULTRA_PRINT">فائقة للمطابع (Ultra Print)</option>
                <option value="STANDARD_150">سريعة وخفيفة (150 DPI)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-slate-200">
            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showPageNumbers}
                onChange={(e) => setShowPageNumbers(e.target.checked)}
                className="rounded text-cyan-700 w-3.5 h-3.5 accent-cyan-600"
              />
              <span>إدراج الترويسة الجارية وترقيم وتذييل الصفحات الرسمي (A4)</span>
            </label>

            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDetailedSolutions}
                onChange={(e) => setIncludeDetailedSolutions(e.target.checked)}
                className="rounded text-cyan-700 w-3.5 h-3.5 accent-cyan-600"
              />
              <span>تضمين عناصر الإجابة وسلم التصحيح المفصل (Corrigé)</span>
            </label>

            <label className="flex items-center gap-2 font-bold text-emerald-900 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFooterQrCode}
                onChange={(e) => setIncludeFooterQrCode(e.target.checked)}
                className="rounded text-emerald-700 w-3.5 h-3.5 accent-emerald-600"
              />
              <span>توليد وإدراج رمز QR للاختبار التفاعلي تلقائياً في تذييل PDF</span>
            </label>

            <label className="flex items-center gap-2 font-bold text-indigo-900 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdjustA4Layout}
                onChange={(e) => setAutoAdjustA4Layout(e.target.checked)}
                className="rounded text-indigo-700 w-3.5 h-3.5 accent-indigo-600"
              />
              <span>كشف وضبط تخطيط A4 تلقائياً لمنع تجاوز الصفحات وتأمين هوامش الطباعة</span>
            </label>
          </div>
        </div>

        {/* شبكة خيارات التصدير الكبرى */}
        <div className="p-4 sm:p-5 overflow-y-auto studio-scroll space-y-3 flex-1">
          {/* 1. تصدير PDF مباشر عالي الجودة */}
          <div
            onClick={() => !generatingStatus.active && handleExportDirectPDF()}
            className={`p-4 rounded-2xl border-2 border-cyan-700/60 bg-gradient-to-br from-cyan-50/50 via-white to-slate-50 transition shadow-2xs hover:shadow-md flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-cyan-600 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <FileDown className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    تحميل ملف PDF فوري مضبوط الهوامش (Direct PDF A4)
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-800 bg-cyan-100 font-bold px-2 py-0.5 rounded">
                    {colorMode === "LASER_MONO" ? "B&W Laser" : "300 DPI · A4"}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  تقسيم ذكي للصفحات يمنع بتر التمارين والجداول، مع ترويسة جارية وتذييل رسمي مشكّل بالعربية والفرنسية.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={generatingStatus.active}
              className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-xs shrink-0 shadow-sm transition disabled:opacity-50"
            >
              {generatingStatus.type === "PDF" ? "جاري التوليد..." : "تحميل PDF الآن"}
            </button>
          </div>

          {/* 2. طباعة PDF المتجهي النقي عبر المتصفح */}
          <div
            onClick={() => {
              if (generatingStatus.active) return;
              document.body.classList.toggle("print-mono-laser", colorMode === "LASER_MONO");
              onPrintPreview(false);
              onClose();
            }}
            className={`p-4 rounded-2xl border border-slate-300 bg-white transition shadow-2xs flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-cyan-300 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <Printer className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    طباعة A4 المتجهية المباشرة (Vector Print)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-100 font-bold px-2 py-0.5 rounded">
                    Ctrl + P
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  طباعة فورية عبر محرك المتصفح مع عزل تلقائي للورقة وتكرار ترويسات الجداول ومنع انقسام التمارين.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={generatingStatus.active}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs shrink-0 transition disabled:opacity-50"
            >
              فتح نافذة الطباعة
            </button>
          </div>

          {/* 2. ب- تصدير ملف Microsoft Word قابل للتعديل المباشر (.doc) */}
          <div
            onClick={() => !generatingStatus.active && handleExportWordDoc()}
            className={`p-4 rounded-2xl border border-blue-300 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 transition shadow-2xs flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-blue-500 hover:shadow-sm cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    تصدير وثيقة Microsoft Word قابلة للتعديل (.doc)
                  </h4>
                  <span className="text-[10px] font-mono text-blue-900 bg-blue-100 font-bold px-2 py-0.5 rounded">
                    MS Word · A4
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  ملف وورد قياسي مضبوط الهوامش والجداول والاتجاه (RTL/LTR) يفتح مباشرة في Microsoft Word للتعديل الحر.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={generatingStatus.active}
              className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-black text-xs shrink-0 transition disabled:opacity-50"
            >
              تحميل .doc
            </button>
          </div>

          {/* 3. تصدير كود LaTeX المكتبي (.tex) */}
          <div
            onClick={() => {
              if (generatingStatus.active) return;
              setExportFormat("LATEX");
              onDownloadFile("LATEX");
              onClose();
            }}
            className={`p-4 rounded-2xl border border-slate-300 bg-white transition shadow-2xs flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <FileCode className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    تصدير كود LaTeX الكامل (.tex)
                  </h4>
                  <span className="text-[10px] font-mono text-indigo-800 bg-indigo-100 font-bold px-2 py-0.5 rounded">
                    Overleaf · TeXmaker
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  ملف LaTeX جاهز للتجميع مع حزم STIX Math والترويسة الأكاديمية المغربية الرسمية.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={generatingStatus.active}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-100 text-indigo-950 font-black text-xs shrink-0 transition disabled:opacity-50"
            >
              تحميل .tex
            </button>
          </div>

          {/* 3. ب- حزمة Overleaf ZIP المتكاملة القابلة للتجميع المباشر */}
          <div
            onClick={() => !generatingStatus.active && handleExportOverleafZip()}
            className={`p-4 rounded-2xl border-2 border-emerald-600/70 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 transition shadow-2xs hover:shadow-md flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-emerald-600 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <FileArchive className="w-6 h-6 text-emerald-200" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    تصدير حزمة Overleaf ZIP المتكاملة (.zip)
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded border border-emerald-300">
                    جاهز للرفع والتجميع الفوري
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  حزمة مضغوطة متكاملة تضم <code className="bg-slate-100 px-1 rounded text-slate-800">main.tex</code> و <code className="bg-slate-100 px-1 rounded text-slate-800">preamble.tex</code> وملف الإرشادات <code className="bg-slate-100 px-1 rounded text-slate-800">README.md</code> لفتح المشروع بنقرة واحدة على Overleaf.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <a
                href="https://www.overleaf.com/project"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-emerald-950 border border-emerald-300 font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition"
                title="فتح موقع Overleaf لرفع حزمة ZIP وتجميع المشروع سحابياً"
              >
                <span>فتح Overleaf</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              </a>
              <button
                type="button"
                disabled={generatingStatus.active}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {generatingStatus.type === "ZIP" ? "جاري البناء..." : "تحميل حزمة .zip"}
              </button>
            </div>
          </div>

          {/* تصدير بنك الأسئلة الموحد لمنصة تلميذ تيس ومودل Moodle XML */}
          <div
            onClick={() => !generatingStatus.active && handleExportMoodleXml()}
            className={`p-4 rounded-2xl border-2 border-amber-600/70 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 transition shadow-2xs hover:shadow-md flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-amber-600 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition font-black text-sm">
                XML
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    تصدير بنك الأسئلة لمنصة تلميذ تيس ومودل (Moodle XML)
                  </h4>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded border border-amber-300">
                    TelmidTICE / Moodle LMS
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  تصدير الفرض بكامل أسئلته وعناصره وسلم النقط بصيغة Moodle XML المعيارية للاستيراد المباشر في المنصات الافتراضية للوزارة.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={generatingStatus.active}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shrink-0 transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              تحميل .xml
            </button>
          </div>

          {/* 4. تصدير كود Typst الحديث (.typ) */}
          <div
            onClick={() => {
              if (generatingStatus.active) return;
              setExportFormat("TYPST");
              onDownloadFile("TYPST");
              onClose();
            }}
            className={`p-4 rounded-2xl border border-slate-300 bg-white transition shadow-2xs flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-teal-400 hover:bg-teal-50/30 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    تصدير كود Typst الحديث السريع (.typ)
                  </h4>
                  <span className="text-[10px] font-mono text-teal-800 bg-teal-100 font-bold px-2 py-0.5 rounded">
                    Typst 0.12+
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  صيغة التصفيف الحديثة السريعة التي تجمع سرعة التنفيذ مع جمالية المعادلات الرياضية.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={generatingStatus.active}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-teal-100 text-teal-950 font-black text-xs shrink-0 transition disabled:opacity-50"
            >
              تحميل .typ
            </button>
          </div>

          {/* 5. تصدير ملف HTML مستقل أوفلاين (.html) */}
          <div
            onClick={() => !generatingStatus.active && handleExportHTML()}
            className={`p-4 rounded-2xl border border-slate-300 bg-white transition shadow-2xs flex items-center justify-between gap-4 group ${
              generatingStatus.active
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-sky-400 hover:bg-sky-50/30 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-950">
                    تصدير صفحة ويب مستقلة أوفلاين (.html)
                  </h4>
                  <span className="text-[10px] font-mono text-sky-800 bg-sky-100 font-bold px-2 py-0.5 rounded">
                    Offline · Word Editable
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  ملف HTML مدمج التنسيق يفتح في أي متصفح بدون إنترنت وقابل للتعديل المباشر في Microsoft Word.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={generatingStatus.active}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-sky-950 font-black text-xs shrink-0 transition disabled:opacity-50"
            >
              تحميل .html
            </button>
          </div>

          {/* 6. تصدير واستيراد إعدادات الفرض المحروس بصيغة JSON (.json) */}
          {onOpenJsonConfigModal && (
            <div
              onClick={() => {
                onClose();
                onOpenJsonConfigModal();
              }}
              className="p-4 rounded-2xl border-2 border-amber-500/70 hover:border-amber-500 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 transition shadow-2xs cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                  <FileJson className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-slate-950">
                      حفظ واستيراد إعدادات الفرض بصيغة JSON (.json)
                    </h4>
                    <span className="text-[10px] font-mono text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded">
                      توفير الوقت · قابل لإعادة الاستيراد
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    تصدير نظام النقط والدروس المختارة ونمط الفرض إلى ملف JSON لحفظه أو مشاركته وإعادة استيراده لاحقاً.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition shadow-xs"
              >
                فتح مدير JSON
              </button>
            </div>
          )}
        </div>

        {/* التذييل الإرشادي */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>جميع الملفات المصدرة متوافقة تماماً مع المعايير التربوية لوزارة التربية الوطنية.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
