import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  BookOpen,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Compass,
  Edit3,
  FileCheck2,
  FileDown,
  FileJson,
  FileSpreadsheet,
  Printer,
  RectangleHorizontal,
  RectangleVertical,
  Sliders,
  Smartphone,
  Sparkles,
  Stethoscope,
  Type,
  X,
  Zap,
  Code2,
  BrainCircuit,
  Calculator,
  FolderArchive,
  CheckCircle2,
  Layers,
  Scan,
  HeartHandshake,
  Share2,
} from "lucide-react";
import {
  DMSubType,
  DOC_FONT_OPTIONS,
  DocFontFamily,
  DocFontSize,
  ModuleType,
} from "../data/curriculum";

export interface SideNavigationMenuProps {
  activeModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  isMission: boolean;
  dmSubType: DMSubType;
  onSelectDmSubType?: (subType: DMSubType) => void;
  currentTrackLabel: string;
  currentTrackCode: string;
  semester: string;
  dsKey: string;
  activeExercisesCount: number;
  totalWeightScore: number;
  isExamSimulationActive: boolean;
  showImportedExamStudio: boolean;
  onToggleImportedExamStudio: () => void;
  onOpenLogoStudio: () => void;
  onOpenDrivePanel: () => void;
  driveConnected: boolean;
  driveUserName?: string;
  isConfigDeckCollapsed: boolean;
  onToggleConfigDeck: () => void;
  isInlineEditable: boolean;
  onToggleInlineEditable: () => void;
  pageOrientation: "PORTRAIT" | "LANDSCAPE";
  onTogglePageOrientation: () => void;
  onPrint: () => void;
  onExportPDF: () => void;
  isExportingPDF?: boolean;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  docFontFamily?: DocFontFamily;
  onChangeDocFontFamily?: (font: DocFontFamily) => void;
  docFontSize?: DocFontSize;
  onChangeDocFontSize?: (size: DocFontSize) => void;
  handwrittenSolutionsOnly?: boolean;
  onToggleHandwrittenSolutionsOnly?: () => void;
  onOpenAPKModal?: () => void;
  onOpenSmartQcmScanner?: () => void;
  onOpenIndividualRemediation?: () => void;
  onOpenCrossPlatformSync?: () => void;
  onOpenInteractiveQuiz?: () => void;
  onOpenPythonLab?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenAiPedagogicalAction?: (
    task: "GENERATE_ISOMORPHIC_VARIANT" | "SIMPLIFY_COMPLEX_WORDING"
  ) => void;
  onOpenWolframVerifier?: () => void;
  onOpenBatchPrint?: () => void;
  onOpenExportDashboard?: () => void;
  exportHistoryCount?: number;
  onOpenAdvancedPedagogyStudio?: () => void;
  auditScorePercent?: number;
  onOpenAuditPanel?: () => void;
  includeAnswerWorkspace?: boolean;
  onToggleAnswerWorkspace?: () => void;
  onOpenMobileConfigSheet?: (col: 1 | 2 | 3) => void;
  onOpenJsonConfigModal?: () => void;
}

interface NavModuleDef {
  id: ModuleType;
  number: string;
  mathSymbol: string;
  titleAr: string;
  titleFr: string;
  subtitleAr: string;
  subtitleFr: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const SideNavigationMenu: React.FC<SideNavigationMenuProps> = ({
  activeModule,
  onSelectModule,
  isMission,
  dmSubType,
  onSelectDmSubType,
  currentTrackLabel,
  currentTrackCode,
  semester,
  dsKey,
  activeExercisesCount,
  totalWeightScore,
  isExamSimulationActive,
  showImportedExamStudio,
  onToggleImportedExamStudio,
  onOpenLogoStudio,
  onOpenDrivePanel,
  driveConnected,
  driveUserName,
  isConfigDeckCollapsed,
  onToggleConfigDeck,
  isInlineEditable,
  onToggleInlineEditable,
  pageOrientation,
  onTogglePageOrientation,
  onPrint,
  onExportPDF,
  isExportingPDF = false,
  isCollapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  docFontFamily = "ACADEMIC_SERIF",
  onChangeDocFontFamily,
  docFontSize = "NORMAL",
  onChangeDocFontSize,
  handwrittenSolutionsOnly = false,
  onToggleHandwrittenSolutionsOnly,
  onOpenAPKModal,
  onOpenSmartQcmScanner,
  onOpenIndividualRemediation,
  onOpenCrossPlatformSync,
  onOpenInteractiveQuiz,
  onOpenPythonLab,
  onOpenAiAssistant,
  onOpenAiPedagogicalAction,
  onOpenWolframVerifier,
  onOpenBatchPrint,
  onOpenExportDashboard,
  exportHistoryCount = 0,
  onOpenAdvancedPedagogyStudio,
  auditScorePercent,
  onOpenAuditPanel,
  includeAnswerWorkspace = false,
  onToggleAnswerWorkspace,
  onOpenMobileConfigSheet,
  onOpenJsonConfigModal,
}) => {
  const modules: NavModuleDef[] = [
    {
      id: "DS_142_08",
      number: "01",
      mathSymbol: "∫",
      titleAr: "الفروض المحروسة",
      titleFr: "Devoirs Surveillés",
      subtitleAr: "مذكرة 142-08 · نماذج A/B",
      subtitleFr: "DS officiel · Sujets A & B",
      icon: FileCheck2,
      badge: `${activeExercisesCount} تم · ${((totalWeightScore * 20) / 100).toFixed(1)}ن`,
    },
    {
      id: "DM_SERIE",
      number: "02",
      mathSymbol: "∑",
      titleAr: dmSubType === "DEVOIR_MAISON" ? "الفرض المنزلي" : "سلسلة التمارين",
      titleFr: dmSubType === "DEVOIR_MAISON" ? "Devoir Maison (DM)" : "Série d'exercices (TD)",
      subtitleAr: dmSubType === "DEVOIR_MAISON" ? "تقويم تكويني ذاتي" : "تدرج الكفايات والمحاور",
      subtitleFr: dmSubType === "DEVOIR_MAISON" ? "Travail autonome" : "Progression par axes",
      icon: FileSpreadsheet,
      badge: dmSubType === "DEVOIR_MAISON" ? "DM" : "TD",
    },
    {
      id: "FICHE_OP2007",
      number: "03",
      mathSymbol: "∂",
      titleAr: isMission ? "الجذاذات و Python" : "الجذاذات التربوية",
      titleFr: isMission ? "Fiches & Activités Python" : "Fiches Pédagogiques",
      subtitleAr: "توجيهات 2007 · وضعيات ديداكتيكية",
      subtitleFr: "Scénarios & Objectifs",
      icon: BookOpen,
    },
    {
      id: "DIAGNOSTIC",
      number: "04",
      mathSymbol: "√",
      titleAr: "الروائز التشخيصية",
      titleFr: "Évaluation Diagnostique",
      subtitleAr: "تشخيص التعثرات والتفييء",
      subtitleFr: "Positionnement & Remédiation",
      icon: Stethoscope,
    },
    {
      id: "REPARTITION_CERTIF",
      number: "05",
      mathSymbol: "ℝ",
      titleAr: "التوزيع السنوي",
      titleFr: "Progression Annuelle",
      subtitleAr: "توزيع الحصص والأسابيع الرسمية",
      subtitleFr: "Semaines & Volume horaire",
      icon: CalendarRange,
    },
  ];

  const renderSidebarBody = (forMobile: boolean) => {
    const collapsedState = forMobile ? false : isCollapsed;

    return (
      <div className="h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden studio-scroll bg-slate-950 text-slate-100 select-none">
        {/* القسم العلوي: الهوية وأزرار الطي والمواصفات الجارية */}
        <div className="p-3 space-y-3">
          {/* رأس القائمة */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-teal-500 text-slate-950 flex items-center justify-center font-serif text-sm font-black shrink-0 shadow-sm shadow-cyan-500/25">
                ∫
              </div>
              <AnimatePresence initial={false} mode="wait">
                {!collapsedState && (
                  <motion.div
                    key="brand-text"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <div className="font-black text-xs text-white truncate tracking-wide flex items-center gap-1">
                      <span>الهندسة البيداغوجية</span>
                      <span className="text-[10px] text-cyan-400 font-serif font-black">∑ π</span>
                    </div>
                    <div className="text-[10px] text-cyan-300/90 font-mono font-bold truncate">
                      Prof Kouziber Brahim
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* زر طي وتوسيع الشريط على الديسكتوب */}
            {!forMobile ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onToggleCollapsed}
                title={
                  collapsedState
                    ? "توسيع شريط التنقل (عرض التفاصيل)"
                    : "طي شريط التنقل (وضع الأيقونات)"
                }
                className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <motion.div
                  animate={{ rotate: collapsedState ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* بطاقة السياق البيداغوجي السريع عند التوسيع بألوان هادئة */}
          <AnimatePresence initial={false}>
            {!collapsedState && (
              <motion.div
                key="track-context-card"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-cyan-300 truncate max-w-[130px] flex items-center gap-1">
                      <span className="font-serif text-xs">√</span>
                      <span>{currentTrackCode}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {semester} · {dsKey}
                    </span>
                  </div>
                  <div
                    className="text-[10.5px] text-slate-300 font-medium truncate"
                    title={currentTrackLabel}
                  >
                    {currentTrackLabel}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* الوحدات البيداغوجية الخمس الرئيسية مع رموز رياضية أنيقة */}
          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {!collapsedState && (
                <motion.div
                  key="modules-heading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-wider whitespace-nowrap flex items-center justify-between"
                >
                  <span>الوحدات البيداغوجية</span>
                  <span className="text-[11px] font-serif text-cyan-400/80">∫ dx</span>
                </motion.div>
              )}
            </AnimatePresence>

            {modules.map((mod) => {
              const IconComp = mod.icon;
              const isActive = activeModule === mod.id;

              return (
                <div key={mod.id} className="relative group">
                  <motion.button
                    type="button"
                    layout
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectModule(mod.id);
                      if (forMobile) onCloseMobile();
                    }}
                    className={`relative w-full rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer text-right overflow-hidden ${
                      collapsedState ? "p-2.5 justify-center" : "p-2.5 justify-between"
                    } ${
                      isActive
                        ? "text-slate-950 font-black shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-slate-900/90 border border-transparent hover:border-slate-800"
                    }`}
                    title={`${mod.titleAr} (${mod.titleFr})`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={forMobile ? "activeMobileModuleBg" : "activeDesktopModuleBg"}
                        transition={{ type: "spring", stiffness: 360, damping: 32 }}
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 rounded-xl shadow-md shadow-cyan-500/20 z-0"
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                          isActive
                            ? "bg-slate-950 text-cyan-300 font-mono text-xs font-black scale-105"
                            : "bg-slate-900 text-slate-400 group-hover:text-cyan-300 group-hover:scale-105"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>

                      <AnimatePresence initial={false} mode="wait">
                        {!collapsedState && (
                          <motion.div
                            key="mod-text"
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif font-black text-xs text-cyan-400/90 ml-0.5">
                                [{mod.mathSymbol}]
                              </span>
                              <span className="font-black text-xs truncate">
                                {isMission ? mod.titleFr : mod.titleAr}
                              </span>
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isActive ? "text-slate-900/90 font-bold" : "text-slate-400"
                              }`}
                            >
                              {isMission ? mod.subtitleFr : mod.subtitleAr}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <AnimatePresence initial={false}>
                      {!collapsedState && mod.badge && (
                        <motion.span
                          key="mod-badge"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.15 }}
                          className={`relative z-10 text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 tabular-nums ${
                            isActive
                              ? "bg-slate-950 text-cyan-200"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {mod.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* زر التبديل السريع بين DM و TD داخل عنصر الفروض المنزلية */}
                  <AnimatePresence initial={false}>
                    {mod.id === "DM_SERIE" &&
                      !collapsedState &&
                      isActive &&
                      onSelectDmSubType && (
                        <motion.div
                          key="dm-subtype-switcher"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1.5 mr-9 p-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1 text-[10px] font-bold">
                            <button
                              type="button"
                              onClick={() => onSelectDmSubType("DEVOIR_MAISON")}
                              className={`flex-1 py-1 rounded text-center transition cursor-pointer ${
                                dmSubType === "DEVOIR_MAISON"
                                  ? "bg-cyan-500 text-slate-950 font-black"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              فرض منزلي (DM)
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectDmSubType("SERIE_TD")}
                              className={`flex-1 py-1 rounded text-center transition cursor-pointer ${
                                dmSubType === "SERIE_TD"
                                  ? "bg-cyan-500 text-slate-950 font-black"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              سلسلة (TD)
                            </button>
                          </div>
                        </motion.div>
                      )}
                  </AnimatePresence>

                  {/* تلميح التمرير (Tooltip) في وضع الأيقونات المصغرة */}
                  {collapsedState && (
                    <div className="hidden lg:group-hover:flex absolute right-full top-1/2 -translate-y-1/2 mr-2.5 z-50 bg-slate-900 text-white border border-slate-700 text-xs px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap flex-col gap-0.5 pointer-events-none">
                      <div className="font-black text-cyan-300 flex items-center gap-1.5">
                        <span className="font-serif">[{mod.mathSymbol}]</span>
                        <span>{mod.number}. {isMission ? mod.titleFr : mod.titleAr}</span>
                      </div>
                      <div className="text-[10px] text-slate-300">
                        {isMission ? mod.subtitleFr : mod.subtitleAr}
                      </div>
                      {mod.badge && (
                        <div className="text-[9.5px] font-mono text-teal-400 font-bold">
                          {mod.badge}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>


          {/* قسم الأدوات السريعة والاستوديوهات المساعدة */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <AnimatePresence initial={false}>
              {!collapsedState && (
                <motion.div
                  key="studios-heading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-wider whitespace-nowrap"
                >
                  الاستوديوهات المساعدة
                </motion.div>
              )}
            </AnimatePresence>

            {/* زر الاختبار التفاعلي والتصحيح الآلي */}
            {onOpenInteractiveQuiz && (
              <button
                type="button"
                onClick={() => {
                  onOpenInteractiveQuiz();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border border-amber-500/40 hover:from-amber-500/30 hover:to-orange-500/30 ${
                  collapsedState ? "justify-center" : "justify-between"
                }`}
                title="تحويل الفرض إلى اختبار تفاعلي (Quiz) للتلاميذ مع التصحيح الآلي وسجل النقط"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Zap className="w-4 h-4 text-amber-400 fill-current shrink-0" />
                  {!collapsedState && (
                    <span className="text-xs font-black truncate">
                      اختبار تفاعلي (Quiz)
                    </span>
                  )}
                </div>
                {!collapsedState && (
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    آلي /20
                  </span>
                )}
              </button>
            )}

            {/* مختبر بايثون وخوارزميات الثانوي */}
            {onOpenPythonLab && (
              <button
                type="button"
                onClick={() => {
                  onOpenPythonLab();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent ${
                  collapsedState ? "justify-center" : "justify-between"
                }`}
                title="مختبر خوارزميات بايثون (المتتاليات، العتبة، التفرع الثنائي، ومونتي كارلو)"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {!collapsedState && (
                    <span className="text-xs font-bold truncate">مختبر Python (خوارزميات)</span>
                  )}
                </div>
                {!collapsedState && (
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    TICE
                  </span>
                )}
              </button>
            )}

            {/* المساعد الديداكتيكي والرياضياتي الذكي (Gemini) + التعديلات البيداغوجية المقترحة */}
            {onOpenAiAssistant && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAiAssistant();
                    if (forMobile) onCloseMobile();
                  }}
                  className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white bg-cyan-950/35 hover:bg-cyan-950/60 border border-cyan-800/50 ${
                    collapsedState ? "justify-center" : "justify-between"
                  }`}
                  title="المساعد الرياضي والديداكتيكي الذكي (Gemini) لطلب تعديلات بيداغوجية مقترحة على الفرض، مثل اقتراح أسئلة موازية أو تبسيط صياغة المسائل المعقدة"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />
                    {!collapsedState && (
                      <span className="text-xs font-bold truncate">
                        المساعد الذكي (تعديلات الفرض)
                      </span>
                    )}
                  </div>
                  {!collapsedState && (
                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      IA
                    </span>
                  )}
                </button>

                {!collapsedState && onOpenAiPedagogicalAction && (
                  <div className="grid grid-cols-2 gap-1 px-1">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAiPedagogicalAction("GENERATE_ISOMORPHIC_VARIANT");
                        if (forMobile) onCloseMobile();
                      }}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-indigo-950 text-cyan-300 border border-slate-800 hover:border-cyan-700/60 transition flex items-center justify-center gap-1 cursor-pointer truncate"
                      title="اقتراح أسئلة موازية وتوليد نموذج متكافئ (Sujet B) للفرض الحالي"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">أسئلة موازية</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAiPedagogicalAction("SIMPLIFY_COMPLEX_WORDING");
                        if (forMobile) onCloseMobile();
                      }}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-teal-950 text-teal-300 border border-slate-800 hover:border-teal-700/60 transition flex items-center justify-center gap-1 cursor-pointer truncate"
                      title="تبسيط صياغة المسائل المعقدة وتفكيك الأسئلة المركبة في الفرض"
                    >
                      <Edit3 className="w-3 h-3 text-teal-400 shrink-0" />
                      <span className="truncate">تبسيط المسائل</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* مختبر WolframAlpha للتحقق الرمزي من الصيغ والمعادلات */}
            {onOpenWolframVerifier && (
              <button
                type="button"
                onClick={() => {
                  onOpenWolframVerifier();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent ${
                  collapsedState ? "justify-center" : "justify-between"
                }`}
                title="التحقق من صحة المعادلات والمسائل الرياضية المعقدة عبر WolframAlpha قبل إدراجها في الفرض"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Calculator className="w-4 h-4 text-orange-400 shrink-0" />
                  {!collapsedState && (
                    <span className="text-xs font-bold truncate">تحقق WolframAlpha</span>
                  )}
                </div>
                {!collapsedState && (
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                    CAS
                  </span>
                )}
              </button>
            )}

            {/* الطباعة المجمعة الموحدة لطابور الوثائق */}
            {onOpenBatchPrint && (
              <button
                type="button"
                onClick={() => {
                  onOpenBatchPrint();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent ${
                  collapsedState ? "justify-center" : "justify-between"
                }`}
                title="تجميع وطباعة عدة وثائق وفروض دفعة واحدة مع فواصل صفحات ذكية"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Printer className="w-4 h-4 text-blue-400 shrink-0" />
                  {!collapsedState && (
                    <span className="text-xs font-bold truncate">الطباعة المجمعة (Batch)</span>
                  )}
                </div>
                {!collapsedState && (
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    A4
                  </span>
                )}
              </button>
            )}

            {/* لوحة سجل الملفات المصدرة وحزم Overleaf */}
            {onOpenExportDashboard && (
              <button
                type="button"
                onClick={() => {
                  onOpenExportDashboard();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer text-cyan-200 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/50 ${
                  collapsedState ? "justify-center" : "justify-between"
                }`}
                title="لوحة التحكم المركزية لجميع الملفات المصدرة (سجل التنزيلات، حالة توليد PDF، وروابط حزم Overleaf)"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FolderArchive className="w-4 h-4 text-cyan-400 shrink-0" />
                  {!collapsedState && (
                    <span className="text-xs font-black truncate">سجل الملفات & Overleaf</span>
                  )}
                </div>
                {!collapsedState && (
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950">
                    {exportHistoryCount > 0 ? `${exportHistoryCount} ملف` : "ZIP/PDF"}
                  </span>
                )}
              </button>
            )}

            {/* أستوديو الهندسة الديداكتيكية المتقدمة (2D Spec / tkz-tab / OMR / TBI) */}
            {onOpenAdvancedPedagogyStudio && (
              <button
                type="button"
                onClick={() => {
                  onOpenAdvancedPedagogyStudio();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent ${
                  collapsedState ? "justify-center" : "justify-between"
                }`}
                title="أستوديو الهندسة الديداكتيكية المتقدمة: جدول التخصيص 2D، منحنيات الدوال C_f، أوراق OMR A/B/C/D، والسبورة التفاعلية TBI"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                  {!collapsedState && (
                    <span className="text-xs font-bold truncate">مختبر المنحنيات C_f و OMR</span>
                  )}
                </div>
                {!collapsedState && (
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    2D/TBI
                  </span>
                )}
              </button>
            )}

            {/* تفعيل/تعطيل كراسة وحيز الإجابة الكاملة المعاير للتلميذ */}
            {onToggleAnswerWorkspace && (
              <button
                type="button"
                onClick={() => {
                  onToggleAnswerWorkspace();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer border ${
                  collapsedState ? "justify-center" : "justify-between"
                } ${
                  includeAnswerWorkspace
                    ? "bg-teal-900/70 text-teal-100 border-teal-500/60"
                    : "text-slate-300 hover:text-white hover:bg-slate-900 border-transparent"
                }`}
                title="تفعيل أو تعطيل ترك فراغ الإجابة الكاملة المعاير للتلميذ تحت كل سؤال (مع شبكة معلم، جدول تغيرات، ومراحل الترجع)"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Edit3 className={`w-4 h-4 shrink-0 ${includeAnswerWorkspace ? "text-teal-300" : "text-slate-400"}`} />
                  {!collapsedState && (
                    <span className="text-xs font-bold truncate">حيز الإجابة الكاملة للتلميذ</span>
                  )}
                </div>
                {!collapsedState && (
                  <span
                    className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      includeAnswerWorkspace
                        ? "bg-teal-400 text-slate-950 font-black"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {includeAnswerWorkspace ? "مفعّل" : "معطّل"}
                  </span>
                )}
              </button>
            )}

            {/* مرصد المراجعة الشاملة والتدقيق البيداغوجي (142-08) */}
            {onOpenAuditPanel && typeof auditScorePercent === "number" && (
              <button
                type="button"
                onClick={() => {
                  onOpenAuditPanel();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer border ${
                  collapsedState ? "justify-center" : "justify-between"
                } ${
                  auditScorePercent === 100
                    ? "bg-emerald-950/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-900/60"
                    : "bg-slate-900/90 text-cyan-200 border-slate-800 hover:border-cyan-700/60"
                }`}
                title="فتح مرصد المراجعة الشاملة والتدقيق البيداغوجي والتقني (142-08 / OP 2007)"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      auditScorePercent === 100 ? "text-emerald-400" : "text-cyan-400"
                    }`}
                  />
                  {!collapsedState && (
                    <span className="text-xs font-bold truncate">مرصد المراجعة الشاملة</span>
                  )}
                </div>
                {!collapsedState && (
                  <span
                    className={`text-[9.5px] font-mono font-black px-1.5 py-0.5 rounded tabular-nums ${
                      auditScorePercent === 100
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                    }`}
                  >
                    {auditScorePercent}%
                  </span>
                )}
              </button>
            )}

            {/* محاكاة فرض مستورد */}
            <button
              type="button"
              onClick={() => {
                onToggleImportedExamStudio();
                if (forMobile) onCloseMobile();
              }}
              className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer ${
                collapsedState ? "justify-center" : "justify-between"
              } ${
                isExamSimulationActive
                  ? "bg-emerald-900/80 text-emerald-100 border border-emerald-500/50 shadow-xs"
                  : showImportedExamStudio
                  ? "bg-indigo-950 text-amber-300 border border-indigo-700/60"
                  : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
              title="محاكاة فرض محروس مستورد من PDF أو صورة"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                {!collapsedState && (
                  <span className="text-xs font-bold truncate">محاكاة فرض مستورد</span>
                )}
              </div>
              {!collapsedState && isExamSimulationActive && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">نشط</span>
              )}
            </button>

            {/* استوديو الشعار الملكي والهوية */}
            <button
              type="button"
              onClick={() => {
                onOpenLogoStudio();
                if (forMobile) onCloseMobile();
              }}
              className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent cursor-pointer ${
                collapsedState ? "justify-center" : "justify-start"
              }`}
              title="تخصيص الشعار الملكي والهوية البصرية للأستاذ"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              {!collapsedState && (
                <span className="text-xs font-bold truncate">استوديو الشعار والهوية</span>
              )}
            </button>

            {/* خزانة Google Drive */}
            <button
              type="button"
              onClick={() => {
                onOpenDrivePanel();
                if (forMobile) onCloseMobile();
              }}
              className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer ${
                collapsedState ? "justify-center" : "justify-between"
              } ${
                driveConnected
                  ? "text-emerald-300 hover:bg-emerald-950/40 border border-emerald-800/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
              title={driveConnected ? `سحابة Drive (${driveUserName || "متصل"})` : "ربط Google Drive"}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Cloud
                  className={`w-4 h-4 shrink-0 ${
                    driveConnected ? "text-emerald-400" : "text-slate-400"
                  }`}
                />
                {!collapsedState && (
                  <span className="text-xs font-bold truncate">
                    {driveConnected ? "خزانة Google Drive" : "ربط Google Drive"}
                  </span>
                )}
              </div>
              {!collapsedState && driveConnected && (
                <span className="text-[9.5px] font-mono text-emerald-400">متصل</span>
              )}
            </button>

            {/* حفظ واستيراد مساحة العمل الكاملة بصيغة JSON بين الأجهزة */}
            {onOpenJsonConfigModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenJsonConfigModal();
                  if (forMobile) onCloseMobile();
                }}
                className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 cursor-pointer text-amber-200 hover:text-white bg-amber-950/35 hover:bg-amber-900/50 border border-amber-800/40 ${
                  collapsedState ? "justify-center" : "justify-between"
                }`}
                title="حفظ واستيراد مساحة العمل الكاملة بصيغة JSON لنقلها بين الأجهزة"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileJson className="w-4 h-4 text-amber-400 shrink-0" />
                  {!collapsedState && (
                    <span className="text-xs font-black truncate">مساحة العمل (JSON)</span>
                  )}
                </div>
                {!collapsedState && (
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    v3.0
                  </span>
                )}
              </button>
            )}

            {/* طي أو إظهار لوحة الإعدادات */}
            <button
              type="button"
              onClick={onToggleConfigDeck}
              className={`w-full rounded-xl p-2 transition-all flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent cursor-pointer ${
                collapsedState ? "justify-center" : "justify-between"
              }`}
              title={
                isConfigDeckCollapsed
                  ? "إظهار لوحة الإعدادات"
                  : "طي الإعدادات للتركيز على المعاينة"
              }
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
                {!collapsedState && (
                  <span className="text-xs font-bold truncate">
                    {isConfigDeckCollapsed ? "إظهار الإعدادات" : "طي الإعدادات"}
                  </span>
                )}
              </div>
              {!collapsedState && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {isConfigDeckCollapsed ? "مخفية" : "مفتوحة"}
                </span>
              )}
            </button>
          </div>

          {/* قسم التنسيق والتحكم في الخطوط المدمج داخل القائمة الجانبية */}
          {!collapsedState && onChangeDocFontFamily && (
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Type className="w-3 h-3" />
                  <span>التنسيق وخطوط الكتابة</span>
                </span>
                { onChangeDocFontSize && (
                  <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-md border border-slate-800 text-[9.5px] font-bold">
                    {(
                      [
                        { id: "COMPACT", label: "صغير" },
                        { id: "NORMAL", label: "قياسي" },
                        { id: "LARGE", label: "كبير" },
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onChangeDocFontSize(s.id)}
                        className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                          docFontSize === s.id
                            ? "bg-amber-400 text-slate-950 font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-1 space-y-1.5">
                <select
                  value={docFontFamily}
                  onChange={(e) => onChangeDocFontFamily(e.target.value as DocFontFamily)}
                  className="w-full bg-slate-900 border border-slate-700/90 text-slate-100 rounded-lg px-2 py-1.5 text-[11px] font-bold focus:outline-none focus:border-amber-400"
                >
                  <optgroup label="الخطوط الأكاديمية والرسمية">
                    {DOC_FONT_OPTIONS.filter((f) => !f.isHandwritten).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.labelAr}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="✍️ خطوط الكتابة باليد">
                    {DOC_FONT_OPTIONS.filter((f) => f.isHandwritten).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.labelAr}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div className="grid grid-cols-2 gap-1">
                  {DOC_FONT_OPTIONS.filter((f) => f.isHandwritten).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onChangeDocFontFamily(f.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition truncate cursor-pointer ${
                        docFontFamily === f.id
                          ? "bg-amber-400 text-slate-950 border-amber-400 font-black"
                          : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {f.shortAr}
                    </button>
                  ))}
                </div>

                {onToggleHandwrittenSolutionsOnly && (
                  <button
                    type="button"
                    onClick={onToggleHandwrittenSolutionsOnly}
                    className={`w-full px-2 py-1 rounded-lg text-[10px] font-bold border transition flex items-center justify-between cursor-pointer ${
                      handwrittenSolutionsOnly
                        ? "bg-emerald-900/70 text-emerald-200 border-emerald-500/60"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span>✍️ خط اليد للتصحيح فقط</span>
                    <span className="font-mono text-[9.5px]">
                      {handwrittenSolutionsOnly ? "مفعّل" : "معطّل"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* القسم السفلي: أدوات النشر والطباعة وتوجيه الورقة */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
          {/* التعديل المباشر وتوجيه الورقة */}
          <div className={`grid gap-1.5 ${collapsedState ? "grid-cols-1" : "grid-cols-2"}`}>
            <button
              type="button"
              onClick={onToggleInlineEditable}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isInlineEditable
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
              title={
                isInlineEditable
                  ? "تعطيل التعديل المباشر"
                  : "تفعيل التعديل المباشر داخل الورقة"
              }
            >
              <Edit3 className="w-3.5 h-3.5 shrink-0" />
              {!collapsedState && (
                <span className="truncate">
                  {isInlineEditable ? "تعديل: مفعّل" : "تعديل مباشر"}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onTogglePageOrientation}
              className="p-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
              title={
                pageOrientation === "LANDSCAPE"
                  ? "الوضع الحالي: أفقي (Landscape) · انقر للتحويل لعمودي"
                  : "الوضع الحالي: عمودي (Portrait) · انقر للتحويل لأفقي"
              }
            >
              {pageOrientation === "LANDSCAPE" ? (
                <RectangleHorizontal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <RectangleVertical className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              )}
              {!collapsedState && (
                <span className="truncate">
                  {pageOrientation === "LANDSCAPE" ? "أفقي" : "عمودي"}
                </span>
              )}
            </button>
          </div>

          {/* زرا الطباعة الفورية وتصدير PDF */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className="w-full p-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              title="تصدير الوثيقة الحالية بصيغة PDF مقاس A4"
            >
              <FileDown className="w-4 h-4 shrink-0" />
              {!collapsedState && (
                <span className="truncate">
                  {isExportingPDF ? "جاري التصدير..." : "تصدير PDF"}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="w-full p-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition flex items-center justify-center gap-2 cursor-pointer"
              title="طباعة الورقة مباشرة على الطابعة أو كـ PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {!collapsedState && <span className="truncate">طباعة سريعة (A4)</span>}
            </button>

            {onOpenAPKModal && (
              <button
                type="button"
                onClick={onOpenAPKModal}
                className="w-full p-2 rounded-xl text-xs font-black bg-indigo-950 hover:bg-indigo-900 text-amber-300 border border-indigo-700/70 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="تثبيت التطبيق على هاتف أندرويد وتحويله إلى APK"
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                {!collapsedState && <span className="truncate">تثبيت التطبيق (APK)</span>}
              </button>
            )}

            {onOpenSmartQcmScanner && (
              <button
                type="button"
                onClick={onOpenSmartQcmScanner}
                className="w-full p-2 rounded-xl text-xs font-black bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/70 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="المصحح الآلي الذكي لأوراق إجابة QCM عبر الكاميرا"
              >
                <Scan className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                {!collapsedState && <span className="truncate">المصحح الآلي OMR</span>}
              </button>
            )}

            {onOpenIndividualRemediation && (
              <button
                type="button"
                onClick={onOpenIndividualRemediation}
                className="w-full p-2 rounded-xl text-xs font-black bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/70 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="توليد بطاقات المعالجة والدعم الفردية الفارقية"
              >
                <HeartHandshake className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                {!collapsedState && <span className="truncate">بطاقات المعالجة A4</span>}
              </button>
            )}

            {onOpenCrossPlatformSync && (
              <button
                type="button"
                onClick={onOpenCrossPlatformSync}
                className="w-full p-2 rounded-xl text-xs font-black bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/70 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="تزامن فوري بين الحاسوب والتابلت والهاتف"
              >
                <Share2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                {!collapsedState && <span className="truncate">تزامن QR متعدد المنصات</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. الشريط الجانبي الثابت في وضع الشاشات الكبيرة مع حركات Framer Motion سلسة */}
      <motion.aside
        aria-label="قائمة التنقل الجانبية الثابتة"
        initial={false}
        animate={{ width: isCollapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
        className="hidden lg:block shrink-0 sticky top-0 h-screen z-30 no-print border-l border-slate-800/80 overflow-hidden"
      >
        {renderSidebarBody(false)}
      </motion.aside>

      {/* 2. درج الموبايل السفلي (Bottom-Sheet Drawer) للوحدات والأدوات السريعة */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end no-print">
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={onCloseMobile}
            />
            <motion.div
              key="mobile-bottom-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="relative w-full max-h-[86vh] bg-slate-950 rounded-t-3xl border-t border-slate-700/80 shadow-2xl z-10 flex flex-col overflow-hidden"
            >
              {/* مقبض السحب العلوي للدرج السفلي + وصول سريع للوحات إعداد الفرض */}
              <div className="pt-2.5 pb-2 px-4 bg-slate-900/95 border-b border-slate-800 shrink-0 space-y-2.5">
                <div
                  onClick={onCloseMobile}
                  className="w-12 h-1.5 rounded-full bg-slate-600 mx-auto cursor-pointer"
                />
                {onOpenMobileConfigSheet && (
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-black">
                    <button
                      type="button"
                      onClick={() => {
                        onCloseMobile();
                        onOpenMobileConfigSheet(1);
                      }}
                      className="min-h-[42px] px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
                    >
                      01. المسلك والهوية
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCloseMobile();
                        onOpenMobileConfigSheet(2);
                      }}
                      className="min-h-[42px] px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition cursor-pointer"
                    >
                      02. الدروس والنسب
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCloseMobile();
                        onOpenMobileConfigSheet(3);
                      }}
                      className="min-h-[42px] px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition cursor-pointer"
                    >
                      03. النماذج والضوابط
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto studio-scroll">
                {renderSidebarBody(true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
