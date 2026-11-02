import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  BrainCircuit,
  Calculator,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Code2,
  Edit3,
  FileCheck2,
  FileDown,
  FileJson,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  HeartHandshake,
  Layers,
  LogOut,
  Menu,
  Printer,
  RectangleHorizontal,
  RectangleVertical,
  RefreshCw,
  RotateCcw,
  Scale,
  Scan,
  Settings,
  Share2,
  Sliders,
  Smartphone,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";
import {
  BilingualLayout,
  DocLanguage,
  EducationSystem,
  ExportFormat,
  ModuleType,
} from "../data/curriculum";
import { TeacherLogo, TeacherLogoVariant } from "./TeacherLogo";

export interface TopNavigationHeaderProps {
  // Brand & Identity
  prof: string;
  school: string;
  currentTrackCode: string;
  savedBadge: boolean;
  saveStatus?: "idle" | "saving" | "saved" | "error";
  lastSavedTime?: Date | null;
  logoVariant: TeacherLogoVariant;
  customLogoUrl: string | null;
  onOpenLogoStudio: () => void;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;

  // Core Pedagogical Modules
  activeModule: ModuleType;
  onSelectModule: (mod: ModuleType) => void;
  isMission: boolean;

  // Document & System Controls
  educationSystem: EducationSystem;
  onSystemChange: (sys: EducationSystem) => void;
  docLang: DocLanguage;
  onChangeDocLang: (lang: DocLanguage) => void;
  bilingualLayout: BilingualLayout;
  onChangeBilingualLayout: (layout: BilingualLayout) => void;
  exportFormat: ExportFormat;
  onChangeExportFormat: (fmt: ExportFormat) => void;
  pageOrientation: "PORTRAIT" | "LANDSCAPE";
  onTogglePageOrientation: () => void;
  includeAnswerWorkspace: boolean;
  onToggleAnswerWorkspace: () => void;

  // Barème & Audit
  totalPoints: number;
  auditScorePercent: number;
  auditIssueCount: number;
  showAuditPanel: boolean;
  onToggleAuditPanel: () => void;
  onOpenBaremeModal: () => void;

  // Studios & Tools
  showMathPalette: boolean;
  onToggleMathPalette: () => void;
  onOpenAdvancedPedagogyStudio: () => void;
  onOpenPythonLab: () => void;
  onOpenAiAssistant: () => void;
  onOpenAiSettings: () => void;
  onOpenWolframVerifier: () => void;
  onOpenJsonConfigModal: () => void;
  onOpenAPKModal: () => void;
  onOpenInteractiveQuiz: () => void;
  onOpenSmartQcmScanner?: () => void;
  onOpenIndividualRemediation?: () => void;
  onOpenCrossPlatformSync?: () => void;
  selectedAiModel: "gemini-3.8-flash" | "gemini-4-argon";
  onSelectAiModel: (model: "gemini-3.8-flash" | "gemini-4-argon") => void;
  isExamSimulationActive: boolean;
  showImportedExamStudio: boolean;
  onToggleImportedExamStudio: () => void;

  // Export, Print & Cloud Drive
  isExportingPDF: boolean;
  onExportPDF: () => void;
  onPrintA4: () => void;
  onOpenExportCenter: () => void;
  onOpenExportDashboard: () => void;
  exportHistoryCount: number;
  onOpenBatchPrint: () => void;
  driveConnected: boolean;
  isLoggingInDrive: boolean;
  driveUserDisplayName?: string;
  onDriveSignIn: () => void;
  onToggleDrivePanel: () => void;
  onDriveLogout: () => void;

  // Workspace Layout
  isConfigDeckCollapsed: boolean;
  onToggleConfigDeck: () => void;
  onResetPreferences: () => void;

  // Didactic Inspection, Remedial Exam & Printing Enhancements
  onOpenDidacticChecklist?: () => void;
  onOpenRemedialExam?: () => void;
  showA4LivePageBreaks?: boolean;
  onToggleA4LivePageBreaks?: () => void;
  economicTwoUpPrintMode?: boolean;
  onToggleEconomicTwoUpPrintMode?: () => void;
}

export const TopNavigationHeader: React.FC<TopNavigationHeaderProps> = ({
  prof,
  school,
  currentTrackCode,
  savedBadge,
  saveStatus = "saved",
  lastSavedTime,
  logoVariant,
  customLogoUrl,
  onOpenLogoStudio,
  onToggleSidebar,
  onOpenMobileNav,
  activeModule,
  onSelectModule,
  isMission,
  educationSystem,
  onSystemChange,
  docLang,
  onChangeDocLang,
  bilingualLayout,
  onChangeBilingualLayout,
  exportFormat,
  onChangeExportFormat,
  pageOrientation,
  onTogglePageOrientation,
  includeAnswerWorkspace,
  onToggleAnswerWorkspace,
  totalPoints,
  auditScorePercent,
  auditIssueCount,
  showAuditPanel,
  onToggleAuditPanel,
  onOpenBaremeModal,
  showMathPalette,
  onToggleMathPalette,
  onOpenAdvancedPedagogyStudio,
  onOpenPythonLab,
  onOpenAiAssistant,
  onOpenAiSettings,
  onOpenWolframVerifier,
  onOpenJsonConfigModal,
  onOpenAPKModal,
  onOpenInteractiveQuiz,
  onOpenSmartQcmScanner,
  onOpenIndividualRemediation,
  onOpenCrossPlatformSync,
  selectedAiModel,
  onSelectAiModel,
  isExamSimulationActive,
  showImportedExamStudio,
  onToggleImportedExamStudio,
  isExportingPDF,
  onExportPDF,
  onPrintA4,
  onOpenExportCenter,
  onOpenExportDashboard,
  exportHistoryCount,
  onOpenBatchPrint,
  driveConnected,
  isLoggingInDrive,
  driveUserDisplayName,
  onDriveSignIn,
  onToggleDrivePanel,
  onDriveLogout,
  isConfigDeckCollapsed,
  onToggleConfigDeck,
  onResetPreferences,
  onOpenDidacticChecklist,
  onOpenRemedialExam,
  showA4LivePageBreaks,
  onToggleA4LivePageBreaks,
  economicTwoUpPrintMode,
  onToggleEconomicTwoUpPrintMode,
}) => {
  const [openMenu, setOpenMenu] = useState<"STUDIOS" | "EXPORT_HUB" | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const modules = [
    {
      id: "DS_142_08" as const,
      math: "∫",
      label: isMission ? "01. الفروض (DS)" : "01. الفروض المحروسة",
      shortLabel: "01. الفروض",
      icon: FileCheck2,
    },
    {
      id: "DM_SERIE" as const,
      math: "∑",
      label: "02. المنزلية والسلاسل",
      shortLabel: "02. السلاسل",
      icon: FileSpreadsheet,
    },
    {
      id: "FICHE_OP2007" as const,
      math: "∂",
      label: isMission ? "03. الجذاذات و Python" : "03. الجذاذات التربوية",
      shortLabel: "03. الجذاذات",
      icon: BookOpen,
    },
    {
      id: "DIAGNOSTIC" as const,
      math: "√",
      label: "04. الروائز التشخيصية",
      shortLabel: "04. التشخيصي",
      icon: Stethoscope,
    },
    {
      id: "REPARTITION_CERTIF" as const,
      math: "ℝ",
      label: "05. التوزيع السنوي",
      shortLabel: "05. التوزيع",
      icon: CalendarRange,
    },
  ] as const;

  const isScore20 = Math.abs(totalPoints - 20) <= 0.05;

  return (
    <>
      {/* =====================================================================
          المستوى الأول: الشريط العلوي المؤسسي الرصين (1-Row, 3-Zone Executive Top Bar)
         ===================================================================== */}
      <header
        ref={menuContainerRef}
        className="top-navigation-header cool-header-gradient sticky top-0 z-30 no-print w-full max-w-full min-w-0 text-white border-b border-cyan-500/30 px-3 xl:px-5 py-2 min-h-[54px] flex items-center justify-between gap-2 xl:gap-3"
      >
        {/* Zone 1: الهوية المؤسسية وزر القائمة الجانبية مع محاذاة مثالية للشعار والعنوان الرئيسي */}
        <div className="flex items-center gap-2.5 xl:gap-3 shrink-0 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                onOpenMobileNav();
              } else {
                onToggleSidebar();
              }
            }}
            className="w-9 h-9 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/30 flex items-center justify-center shrink-0 self-center cursor-pointer transition-colors"
            title="فتح أو طي شريط التنقل الجانبي"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 xl:gap-2.5 min-w-0 self-center">
            <button
              type="button"
              onClick={onOpenLogoStudio}
              className={`cursor-pointer w-9 h-9 ${
                logoVariant === "DOC2APP_MONO" ? "rounded-xl" : "rounded-full"
              } p-0.5 ${
                logoVariant === "DOC2APP_MONO"
                  ? "bg-gradient-to-tr from-slate-300 via-white to-slate-400 shadow-sm shadow-white/15"
                  : "bg-gradient-to-tr from-cyan-400 via-sky-400 to-teal-400 shadow-sm shadow-cyan-500/30"
              } shrink-0 self-center flex items-center justify-center transition-transform hover:scale-105`}
              title="Doc2App — تخصيص الهوية البصرية والشعار الأكاديمي للمنصة"
            >
              <TeacherLogo
                variant={logoVariant}
                size={32}
                customImageUrl={customLogoUrl}
              />
            </button>

            <div className="min-w-0 flex flex-col justify-center self-center gap-1">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLogoStudio();
                }}
                className="text-xs sm:text-[13.5px] font-black tracking-tight text-white hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 leading-none flex items-center gap-1.5"
              >
                <span
                  dir="ltr"
                  className="font-mono text-[11px] font-black tracking-wider text-cyan-300"
                  title="Doc2App — Minimalist Monochromatic Vector Math Identity"
                >
                  ∫DOC2APP
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span>منصة الهندسة البيداغوجية للرياضيات</span>
              </a>
              <div className="text-[10.5px] text-slate-300 flex items-center gap-1.5 whitespace-nowrap leading-none">
                <span className="font-bold text-white truncate max-w-[115px]">{prof}</span>
                <span aria-hidden="true" className="text-cyan-400/70">·</span>
                <span className="truncate max-w-[100px] xl:max-w-[150px] text-slate-300">{school}</span>
                <span aria-hidden="true" className="text-cyan-400/70">·</span>
                {saveStatus === "saving" ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 transition-all duration-200"
                    title="جاري حفظ التعديلات تلقائياً في التخزين المحلي الآمن (LocalStorage)..."
                  >
                    <RefreshCw className="w-2.5 h-2.5 text-cyan-300 animate-spin shrink-0" />
                    <span>جاري الحفظ...</span>
                  </span>
                ) : saveStatus === "error" ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300"
                    title="تنبيه: تعذر حفظ التعديلات في التخزين المحلي للمتصفح (سعة التخزين ممتلئة)"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                    <span>تنبيه التخزين</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300/95 transition-all duration-300"
                    title={
                      lastSavedTime
                        ? `مساحة العمل آمنة ومحفوظة تلقائياً في المتصفح (${lastSavedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })})`
                        : "مساحة العمل آمنة ومحفوظة تلقائياً في التخزين المحلي"
                    }
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span className="hidden sm:inline">محفوظ محلياً</span>
                    <span className="sm:hidden">محفوظ</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zone 2: المسارات البيداغوجية الخمسة الموحدة (Central Segmented Navigation) */}
        <nav
          aria-label="الوحدات البيداغوجية الخمس"
          className="flex items-center gap-0.5 sm:gap-1 bg-slate-950/75 p-1 rounded-xl border border-cyan-500/25 shrink-0 shadow-inner overflow-x-auto no-scrollbar"
        >
          {modules.map((mod) => {
            const IconComp = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`relative h-7.5 px-2.5 xl:px-3 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? "text-slate-950 font-black"
                    : "text-slate-200 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="topHeaderActiveModuleBg"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 rounded-lg shadow-sm shadow-cyan-400/30 z-0"
                  />
                )}
                <IconComp
                  className={`relative z-10 w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-slate-950" : "text-cyan-300"
                  }`}
                />
                <span
                  className={`relative z-10 font-serif text-xs ${
                    isActive ? "text-slate-950 font-black" : "text-cyan-300 font-bold"
                  }`}
                >
                  {mod.math}
                </span>
                <span className="relative z-10 hidden xl:inline">{mod.label}</span>
                <span className="relative z-10 xl:hidden">{mod.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: الاستوديوهات + مركز Overleaf + زر التصدير والطباعة الرئيسي */}
        <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
          {/* قائمة استوديوهات الرياضيات والمختبرات */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMenu((prev) => (prev === "STUDIOS" ? null : "STUDIOS"))
              }
              className={`h-8 px-2.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                openMenu === "STUDIOS"
                  ? "bg-slate-800 text-cyan-300 border-cyan-500/70"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80"
              }`}
              title="استوديوهات المنحنيات C_f، بايثون TICE، واستوديو الشعار"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden md:inline">المختبرات</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
                  openMenu === "STUDIOS" ? "rotate-180 text-cyan-300" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openMenu === "STUDIOS" && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl p-2 z-50 text-right space-y-1"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
                    <span>الاستوديوهات والمختبرات المتخصصة</span>
                    <span className="font-mono text-cyan-400">MATH · TICE</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenAdvancedPedagogyStudio();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-100 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>مختبر المنحنيات C_f و 2D و OMR</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300">tkz-tab</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenPythonLab();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-100 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>مختبر خوارزميات Python</span>
                    </div>
                    <span className="text-[10px] font-mono text-teal-300">TICE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenWolframVerifier();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-100 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>الحساب الرمزي ورسم الدوال (Wolfram)</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">CAS</span>
                  </button>

                  <div className="border-t border-slate-800 my-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        onOpenLogoStudio();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between gap-2 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>استوديو الهوية والشعار الرسمي</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">SVG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        onOpenJsonConfigModal();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between gap-2 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>حفظ أو استيراد إعدادات JSON</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">.json</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        onOpenAPKModal();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between gap-2 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>تثبيت التطبيق على الهاتف (APK)</span>
                      </div>
                      <span className="text-[10px] font-mono text-teal-300">PWA</span>
                    </button>

                    {onOpenSmartQcmScanner && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          onOpenSmartQcmScanner();
                        }}
                        className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-emerald-300 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Scan className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>المصحح الآلي الذكي (OMR Scanner)</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300">كاميرا</span>
                      </button>
                    )}

                    {onOpenIndividualRemediation && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          onOpenIndividualRemediation();
                        }}
                        className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-indigo-300 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <HeartHandshake className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>بطاقات المعالجة الفردية الفارقية</span>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-300">A4 + QR</span>
                      </button>
                    )}

                    {onOpenCrossPlatformSync && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          onOpenCrossPlatformSync();
                        }}
                        className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-cyan-300 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>تزامن الحاسوب واللوحة والهاتف (QR Sync)</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300">فوري</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* مركز التصدير و Overleaf */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMenu((prev) => (prev === "EXPORT_HUB" ? null : "EXPORT_HUB"))
              }
              className={`h-8 px-2.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                openMenu === "EXPORT_HUB"
                  ? "bg-slate-800 text-amber-300 border-amber-500/70"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80"
              }`}
              title="مركز الاستخراج المتقدم، سجل الملفات المصدّرة، حزم Overleaf، والطباعة المجمعة"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Overleaf</span>
              <span className="font-mono tabular-nums text-[10px] text-amber-300">
                ({exportHistoryCount})
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
                  openMenu === "EXPORT_HUB" ? "rotate-180 text-amber-300" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openMenu === "EXPORT_HUB" && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl p-2 z-50 text-right space-y-1"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
                    <span>مركز النشر الأكاديمي والأرشفة</span>
                    <span className="font-mono text-amber-400 tabular-nums">
                      {exportHistoryCount} ملفات
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenExportDashboard();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-amber-200 flex items-center justify-between gap-2 text-xs font-black transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>سجل التنزيلات وحزم Overleaf</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 tabular-nums">
                      ZIP / PDF
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenExportCenter();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-100 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>مركز الاستخراج المتعدد الصيغ</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">LaTeX/Typst</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenBatchPrint();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-100 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>الطباعة المجمعة للفروض (Batch)</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-300">A4 Queue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onOpenJsonConfigModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-200 flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>حفظ/استيراد مساحة العمل (.json)</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">v3.0</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onPrintA4();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between gap-2 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-slate-300 shrink-0" />
                      <span>طباعة فورية للورقة الحالية</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Ctrl+P</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* الكتلة المدمجة لتصدير PDF والطباعة الفورية A4 (Primary Action CTA) */}
          <div className="h-8 flex items-center rounded-lg bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
            <button
              type="button"
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className="h-full px-2.5 text-xs font-black text-slate-950 hover:bg-black/10 rounded-md transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer disabled:opacity-60 active:scale-95"
              title="تصدير الوثيقة الحالية بصيغة PDF عالي الدقة"
            >
              <FileDown className="w-3.5 h-3.5 shrink-0" />
              <span>{isExportingPDF ? "جاري..." : "تصدير PDF"}</span>
            </button>

            <div className="h-4 w-px bg-slate-950/25 mx-0.5 shrink-0" />

            <button
              type="button"
              onClick={onPrintA4}
              className="h-full px-2 text-xs font-black text-slate-950 hover:bg-black/10 rounded-md transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer active:scale-95"
              title="طباعة فورية للورقة الحالية على مقاس A4 (Ctrl+P)"
              aria-label="طباعة فورية A4"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">طباعة A4</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          المستوى الثاني: شريط ضوابط مساحة العمل المتناسق (Ergonomic Workspace Ribbon)
          يضم مواصفات الوثيقة، أدوات الصياغة الرياضية (∫∑ · CAS · AI)، والضوابط البيداغوجية
         ===================================================================== */}
      <div className="bg-white/95 backdrop-blur-xs border-b border-slate-200/90 w-full max-w-full min-w-0 px-3 xl:px-5 py-1.5 shadow-2xs no-print">
        <div className="w-full max-w-full min-w-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">

          {/* الجناح الأيمن: [1: مواصفات الوثيقة] + [2: الصياغة الرياضية والحساب الرمزي] + [3: الهندسة الورقية] */}
          <div className="flex items-center gap-2 shrink-0">

            {/* الجناح 1: مواصفات الوثيقة واللغة (Spécifications de base) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs shrink-0">
              {/* 1.1 المنظومة التعليمية */}
              <div className="h-7 flex items-center gap-0.5 p-0.5 bg-slate-200/60 rounded-lg text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => onSystemChange("MAROC_NATIONAL")}
                  className={`h-6 px-2 rounded-md font-bold transition whitespace-nowrap cursor-pointer ${
                    educationSystem === "MAROC_NATIONAL"
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                  title="المنظومة التربوية المغربية (المذكرة 142-08 والتوجيهات الرسمية)"
                >
                  <span className="hidden 2xl:inline">المنظومة </span>الوطنية
                </button>
                <button
                  type="button"
                  onClick={() => onSystemChange("MISSION_FRANCAISE")}
                  className={`h-6 px-2 rounded-md font-bold transition whitespace-nowrap cursor-pointer ${
                    educationSystem === "MISSION_FRANCAISE"
                      ? "bg-blue-900 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="نظام البكالوريا الفرنسية (AEFE / Mission)"
                >
                  <span className="hidden 2xl:inline">البعثة </span>الفرنسية
                </button>
              </div>

              {/* 1.2 لغة الوثيقة */}
              <div className="h-7 flex items-center gap-0.5 p-0.5 bg-slate-200/60 rounded-lg text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => onChangeDocLang("FR")}
                  className={`h-6 px-2 rounded-md font-bold transition whitespace-nowrap cursor-pointer ${
                    docLang === "FR"
                      ? "bg-white text-slate-950 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="صياغة فرنسية كاملة (BIOF / AEFE)"
                >
                  Français <span className="hidden 2xl:inline">{isMission ? "(AEFE)" : "(BIOF)"}</span>
                </button>
                {!isMission && (
                  <>
                    <button
                      type="button"
                      onClick={() => onChangeDocLang("AR")}
                      className={`h-6 px-2 rounded-md font-bold transition whitespace-nowrap cursor-pointer ${
                        docLang === "AR"
                          ? "bg-white text-slate-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      title="صياغة عربية أصيلة"
                    >
                      العربية
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeDocLang("BILINGUAL")}
                      className={`h-6 px-2 rounded-md font-bold transition whitespace-nowrap cursor-pointer ${
                        docLang === "BILINGUAL"
                          ? "bg-teal-700 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      title="صياغة مزدوجة فرنسية وعربية"
                    >
                      مزدوج
                    </button>
                  </>
                )}
              </div>

              {docLang === "BILINGUAL" && !isMission && (
                <select
                  value={bilingualLayout}
                  onChange={(e) => onChangeBilingualLayout(e.target.value as BilingualLayout)}
                  className="h-7 border border-teal-300 bg-teal-50/70 text-teal-950 rounded-lg px-2 text-xs font-bold shrink-0"
                >
                  <option value="SIDE_BY_SIDE">عمودان متقابلان</option>
                  <option value="QUESTION_BY_QUESTION">مزدوج سؤال بسؤال</option>
                  <option value="TWO_VERSIONS">نسختان منفصلتان</option>
                </select>
              )}

              {/* 1.3 محرك التصدير (PDF / LaTeX / Typst) */}
              <div className="h-7 flex items-center gap-0.5 p-0.5 bg-slate-200/60 rounded-lg font-mono text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => onChangeExportFormat("PDF")}
                  className={`h-6 px-2 rounded-md font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                    exportFormat === "PDF"
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3 h-3 shrink-0" />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeExportFormat("LATEX")}
                  className={`h-6 px-2 rounded-md font-bold transition whitespace-nowrap cursor-pointer ${
                    exportFormat === "LATEX"
                      ? "bg-white text-slate-950 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  LaTeX
                </button>
                <button
                  type="button"
                  onClick={() => onChangeExportFormat("TYPST")}
                  className={`h-6 px-2 rounded-md font-bold transition whitespace-nowrap cursor-pointer ${
                    exportFormat === "TYPST"
                      ? "bg-white text-slate-950 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Typst
                </button>
              </div>
            </div>

            {/* فاصل عمودي أنيق */}
            <div className="w-px h-6 bg-slate-200 shrink-0" aria-hidden="true" />

            {/* الجناح 2: أدوات الصياغة الرياضية والحساب الرمزي والذكاء الاصطناعي */}
            <div className="flex items-center gap-1 p-1 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs shrink-0">
              {/* أيقونة مدمجة للرموز والعمليات الرياضية السريعة (مخفية افتراضياً خلف أيقونة بسيطة لاستغلال الشاشة) */}
              <button
                id="btnToggleMathSymbolsPopover"
                type="button"
                onClick={onToggleMathPalette}
                aria-expanded={showMathPalette}
                aria-label="الرموز والعمليات الرياضية (∫, ∑, ×, ÷, √x)"
                className={`h-7 w-8 rounded-lg text-xs font-black transition shrink-0 flex items-center justify-center cursor-pointer border relative ${
                  showMathPalette
                    ? "bg-slate-900 text-cyan-300 border-cyan-500 shadow-sm ring-2 ring-cyan-400/30"
                    : "bg-white hover:bg-cyan-50 text-slate-800 hover:text-cyan-800 border-slate-200 hover:border-cyan-300"
                }`}
                title="إظهار أو إخفاء نافذة الرموز والعمليات الرياضية السريعة (∫, ∑, ×, ÷, a/b, xⁿ, √x, ℝ, u⃗)"
              >
                <span className="font-serif text-[12.5px] font-black leading-none tracking-tighter">
                  ∑±
                </span>
                {showMathPalette && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.5 -right-0.5" />
                )}
              </button>

              {/* التحقق الرمزي ورسم الدوال عبر WolframAlpha (أيقونة مدمجة) */}
              <button
                type="button"
                onClick={onOpenWolframVerifier}
                aria-label="مختبر WolframAlpha للحساب الرمزي"
                className="h-7 w-7 rounded-lg text-xs font-bold bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 hover:border-amber-300 transition shrink-0 flex items-center justify-center cursor-pointer"
                title="مختبر WolframAlpha للحساب الرمزي ورسم المنحنيات البيانية (CAS & Plots)"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              </button>

              {/* شريحة محرك الذكاء الاصطناعي Gemini AI */}
              <div className="h-7 flex items-center rounded-lg bg-white border border-slate-200 p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  className="h-full px-2 text-xs font-bold text-slate-800 hover:text-cyan-900 hover:bg-slate-100 rounded-md transition flex items-center gap-1 cursor-pointer"
                  title="فتح المساعد الديداكتيكي والرياضياتي الذكي (Gemini AI Engine)"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                  <span className="font-mono font-bold tracking-tight">
                    {selectedAiModel === "gemini-4-argon" ? "Argon 4" : "Flash 3.8"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onOpenAiSettings}
                  className="h-full w-5.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition flex items-center justify-center shrink-0 cursor-pointer border-r border-slate-200"
                  title="تفضيلات محرك الذكاء الاصطناعي وفحص الاتصال الحي"
                  aria-label="تفضيلات محرك الذكاء الاصطناعي"
                >
                  <Settings className="w-3 h-3" />
                </button>
              </div>

              {/* سلم التنقيط (تظهر في وضع الفروض DS) */}
              {activeModule === "DS_142_08" && (
                <button
                  type="button"
                  onClick={onOpenBaremeModal}
                  className="h-7 px-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                  title="تجزئة النقط وسلم التنقيط الدقيق وفق المذكرة 142-08"
                >
                  <Scale className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="hidden xl:inline">سلم النقط</span>
                  <span
                    className={`font-mono tabular-nums text-[10.5px] font-black ${
                      isScore20 ? "text-teal-700" : "text-amber-700"
                    }`}
                  >
                    {totalPoints.toFixed(2)}/20
                  </span>
                </button>
              )}
            </div>

            {/* فاصل عمودي أنيق */}
            <div className="w-px h-6 bg-slate-200 shrink-0" aria-hidden="true" />

            {/* الجناح 3: الهندسة الورقية والطباعة (Mise en page & Sortie A4) */}
            <div className="flex items-center gap-1 p-1 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs shrink-0">
              {/* توجيه الورقة */}
              <button
                type="button"
                onClick={onTogglePageOrientation}
                className="h-7 px-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
                title="تبديل اتجاه الورقة بين العمودي (Portrait) والأفقي (Landscape)"
              >
                {pageOrientation === "LANDSCAPE" ? (
                  <RectangleHorizontal className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                ) : (
                  <RectangleVertical className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                )}
                <span className="hidden sm:inline">{pageOrientation === "LANDSCAPE" ? "أفقي" : "عمودي"}</span>
              </button>

              {/* حيز إجابة التلميذ */}
              <button
                type="button"
                onClick={onToggleAnswerWorkspace}
                className={`h-7 px-2 rounded-lg text-xs font-bold border transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                  includeAnswerWorkspace
                    ? "bg-teal-700 text-white border-teal-800"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
                title="تفعيل أو تعطيل ترك فراغ الإجابة الكاملة المعاير للتلميذ تحت كل سؤال"
              >
                <Edit3 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">{includeAnswerWorkspace ? "حيز الإجابة: مفعّل" : "فراغ الإجابة"}</span>
                <span className="lg:hidden">فراغ الإجابة</span>
              </button>

              {/* فواصل A4 الحية */}
              {onToggleA4LivePageBreaks && (
                <button
                  type="button"
                  onClick={onToggleA4LivePageBreaks}
                  className={`h-7 px-2 rounded-lg text-xs font-bold border transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                    showA4LivePageBreaks
                      ? "bg-cyan-900 text-cyan-200 border-cyan-800 shadow-2xs"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                  title="إظهار أو إخفاء فواصل الصفحات الحية A4 لمعاينة تقطيع الصفحات"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span className="hidden xl:inline">فواصل A4</span>
                </button>
              )}

              {/* طباعة 2-في-1 اقتصادية */}
              {onToggleEconomicTwoUpPrintMode && (
                <button
                  type="button"
                  onClick={onToggleEconomicTwoUpPrintMode}
                  className={`h-7 px-2 rounded-lg text-xs font-bold border transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                    economicTwoUpPrintMode
                      ? "bg-emerald-900 text-emerald-200 border-emerald-800 shadow-2xs"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                  title="الطباعة الاقتصادية 2-في-1 (2-Up) لتقليص استهلاك الورق بنسبة 50%"
                >
                  <span className="font-mono text-[10.5px] font-black">2-Up</span>
                  <span className="hidden xl:inline">طباعة 2-في-1</span>
                </button>
              )}
            </div>
          </div>

          {/* الجناح الأيسر: [الجناح 3: التفتيش والمعالجة] + [الجناح 4: الأدوات والمزامنة] */}
          <div className="flex items-center gap-2 text-xs shrink-0">

            {/* الجناح 3: التفتيش والمعالجة البيداغوجية (Audit, Visa & Remédiation) */}
            <div className="flex items-center gap-1 p-1 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs shrink-0">
              {/* التأشير الديداكتيكي 142-08 للمفتش التربوي */}
              {onOpenDidacticChecklist && (
                <button
                  type="button"
                  onClick={onOpenDidacticChecklist}
                  className="h-7 px-2.5 rounded-lg font-black bg-slate-900 text-cyan-300 border border-cyan-500/80 hover:bg-slate-800 transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer shadow-xs"
                  title="فتح بطاقة المراقبة والتأشير الديداكتيكي للمفتش التربوي (Note 142-08)"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="hidden sm:inline">تأشير 142-08</span>
                  <span className="sm:hidden">142-08</span>
                </button>
              )}

              {/* الفرض الاستدراكي والمعالجة البيداغوجية المركزة */}
              {onOpenRemedialExam && (
                <button
                  type="button"
                  onClick={onOpenRemedialExam}
                  className="h-7 px-2.5 rounded-lg font-black bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="توليد الفرض الاستدراكي الموجه للمتعثرين (< 10/20) مع تعزيز N1/N2"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="hidden md:inline">فرض استدراكي</span>
                  <span className="md:hidden">استدراك</span>
                </button>
              )}

              {/* مرصد التدقيق البيداغوجي السريع */}
              <button
                type="button"
                onClick={onToggleAuditPanel}
                className={`h-7 px-2 rounded-lg font-bold border transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                  showAuditPanel
                    ? "bg-slate-900 text-cyan-300 border-slate-900"
                    : auditIssueCount === 0
                    ? "bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
                title="فتح مرصد المراجعة الشاملة وتدقيق المطابقة البيداغوجية (142-08)"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="hidden sm:inline">التدقيق</span>
                <span className="font-mono tabular-nums font-black">{auditScorePercent}%</span>
              </button>
            </div>

            {/* فاصل عمودي أنيق */}
            <div className="w-px h-6 bg-slate-200 shrink-0" aria-hidden="true" />

            {/* الجناح 4: الأدوات التفاعلية والمزامنة (Outils, Cloud & Interface) */}
            <div className="flex items-center gap-1 p-1 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs shrink-0">
              {/* الاختبار التفاعلي (Quiz) */}
              <button
                type="button"
                onClick={onOpenInteractiveQuiz}
                className="h-7 px-2 rounded-lg font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
                title="تحويل تمارين الفرض إلى اختبار تفاعلي (Quiz) للتلاميذ مع التصحيح الآلي"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="hidden lg:inline">اختبار تفاعلي</span>
                <span className="lg:hidden">كويز</span>
              </button>

              {/* محاكاة فرض مستورد */}
              <button
                type="button"
                onClick={onToggleImportedExamStudio}
                className={`h-7 px-2 rounded-lg font-bold border transition whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                  isExamSimulationActive
                    ? "bg-teal-700 text-white border-teal-800"
                    : showImportedExamStudio
                    ? "bg-slate-900 text-cyan-300 border-slate-900"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
                title="محاكاة وتوليد نظير موازٍ لفرض محروس مستورد من PDF أو صورة"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{isExamSimulationActive ? "محاكاة نشطة" : "محاكاة"}</span>
              </button>

              {/* سحابة Google Drive والتشفير المحلي */}
              {!driveConnected ? (
                <button
                  type="button"
                  onClick={onToggleDrivePanel}
                  disabled={isLoggingInDrive}
                  className="h-7 bg-white hover:bg-slate-100 text-slate-700 font-bold px-2 rounded-lg border border-slate-200 transition flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                  title="سحابة Google Drive والمزامنة التلقائية والتشفير المحلي AES-256"
                >
                  <Cloud className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{isLoggingInDrive ? "جاري..." : "Drive & تشفير"}</span>
                </button>
              ) : (
                <div className="h-7 flex items-center gap-1 bg-teal-50 border border-teal-200 px-2 rounded-lg shrink-0">
                  <button
                    type="button"
                    onClick={onToggleDrivePanel}
                    className="flex items-center gap-1 text-teal-900 font-bold hover:text-teal-950 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Cloud className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{driveUserDisplayName?.split(" ")[0] || "Drive"}</span>
                  </button>
                  <span aria-hidden="true" className="text-teal-300">·</span>
                  <button
                    type="button"
                    onClick={onDriveLogout}
                    title="تسجيل الخروج من Google Drive"
                    className="text-slate-500 hover:text-rose-600 p-0.5 flex items-center justify-center cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* حفظ واستيراد مساحة العمل الكاملة بصيغة JSON بين الأجهزة */}
              <button
                type="button"
                onClick={onOpenJsonConfigModal}
                className="h-7 px-2 rounded-lg font-bold bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-950 border border-slate-200 hover:border-amber-300 transition flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                title="حفظ واستيراد مساحة العمل الكاملة بصيغة JSON لنقلها بين الأجهزة"
              >
                <FileJson className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="hidden lg:inline">مساحة العمل JSON</span>
                <span className="lg:hidden">JSON</span>
              </button>

              {/* طي أو إظهار الإعدادات */}
              <button
                type="button"
                onClick={onToggleConfigDeck}
                className={`h-7 px-2 rounded-lg font-bold border transition flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                  isConfigDeckCollapsed
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
                title="طي أو إظهار لوحة الإعدادات للتركيز على معاينة الورقة (A4)"
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">
                  {isConfigDeckCollapsed ? "إظهار الإعدادات" : "طي الإعدادات"}
                </span>
              </button>

              {/* استعادة الافتراضي */}
              <button
                type="button"
                onClick={onResetPreferences}
                title="استعادة الإعدادات الافتراضية"
                className="h-7 w-7 text-slate-500 hover:text-rose-600 flex items-center justify-center rounded-lg border border-transparent hover:border-rose-200 hover:bg-rose-50 transition shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
