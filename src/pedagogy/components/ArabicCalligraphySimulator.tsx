import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Eye,
  Grid,
  Layers,
  RotateCcw,
  Sliders,
  Sparkles,
  Type,
  Wand2,
} from "lucide-react";
import {
  evaluateTitleCalligraphyHarmony,
  formatTitleWithCalligraphyOrnaments,
  getTitleOrnamentMiniPreview,
  MOROCCAN_HEADER_SVG_FRAME_OPTIONS,
  MoroccanHeaderSvgFrame,
  TitleCalligraphyScale,
  TitleCalligraphyScope,
  TitleOrnamentStyle,
  TRADITIONAL_TITLE_FONT_OPTIONS,
  TraditionalTitleFontId,
} from "../data/curriculum";

export interface AppliedTitleCalligraphyConfig {
  fontId: TraditionalTitleFontId;
  scale: TitleCalligraphyScale;
  ornament: TitleOrnamentStyle;
  scope: TitleCalligraphyScope;
  enableMoroccanHeaderOrnament?: boolean;
  customLetterSpacingEm?: number;
  svgHeaderFrame?: MoroccanHeaderSvgFrame;
}

export const MoroccanHeaderSvgBanner: React.FC<{
  frame?: MoroccanHeaderSvgFrame;
  position?: "TOP" | "BOTTOM";
  className?: string;
}> = ({ frame = "NONE", position = "TOP", className = "" }) => {
  if (!frame || frame === "NONE") return null;

  if (frame === "ZELLIGE_FEZ") {
    return (
      <div className={`w-full flex items-center justify-center select-none pointer-events-none ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 360 24"
          className="w-full max-w-[340px] h-5 text-amber-800/85 print:text-slate-900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Fez 8-pointed Khatam Star */}
          <g transform="translate(22,12)">
            <rect x="-6.5" y="-6.5" width="13" height="13" stroke="currentColor" strokeWidth="1.25" />
            <rect x="-6.5" y="-6.5" width="13" height="13" transform="rotate(45)" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="0" cy="0" r="2.2" fill="currentColor" />
          </g>
          {/* Interlaced Frieze Line Left */}
          <path d="M36 9 H138 M36 15 H138" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 2" />
          <polygon points="90,6 96,12 90,18 84,12" stroke="currentColor" strokeWidth="1.1" fill="currentColor" fillOpacity="0.14" />
          {/* Center Fez Zellige Rosette */}
          <g transform="translate(180,12)">
            <rect x="-7.5" y="-7.5" width="15" height="15" stroke="currentColor" strokeWidth="1.35" fill="currentColor" fillOpacity="0.1" />
            <rect x="-7.5" y="-7.5" width="15" height="15" transform="rotate(45)" stroke="currentColor" strokeWidth="1.35" fill="currentColor" fillOpacity="0.1" />
            <circle cx="0" cy="0" r="2.8" fill="currentColor" />
            <path d="M-24 0 L-12 0 M12 0 L24 0" stroke="currentColor" strokeWidth="1.3" />
          </g>
          {/* Interlaced Frieze Line Right */}
          <polygon points="270,6 276,12 270,18 264,12" stroke="currentColor" strokeWidth="1.1" fill="currentColor" fillOpacity="0.14" />
          <path d="M222 9 H324 M222 15 H324" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 2" />
          {/* Right Fez 8-pointed Khatam Star */}
          <g transform="translate(338,12)">
            <rect x="-6.5" y="-6.5" width="13" height="13" stroke="currentColor" strokeWidth="1.25" />
            <rect x="-6.5" y="-6.5" width="13" height="13" transform="rotate(45)" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="0" cy="0" r="2.2" fill="currentColor" />
          </g>
        </svg>
      </div>
    );
  }

  if (frame === "ANDALUSI_ARCH") {
    return (
      <div
        className={`w-full flex items-center justify-center select-none pointer-events-none ${
          position === "BOTTOM" ? "rotate-180" : ""
        } ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 360 26"
          className="w-full max-w-[350px] h-5.5 text-amber-800/85 print:text-slate-900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Spandrel Frame */}
          <path
            d="M8 24 V6 H95 C115 6 128 18 145 18 C158 18 168 4 180 2 C192 4 202 18 215 18 C232 18 245 6 265 6 H352 V24"
            stroke="currentColor"
            strokeWidth="1.35"
          />
          <path
            d="M14 24 V9 H92 C112 9 125 21 145 21 C159 21 169 8 180 5.5 C191 8 201 21 215 21 C235 21 248 9 268 9 H346 V24"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2.5 1.5"
          />
          {/* Finial Keystone */}
          <circle cx="180" cy="12" r="2.3" fill="currentColor" />
          {/* Spandrel Arabesque Rosettes */}
          <circle cx="46" cy="14" r="3" stroke="currentColor" strokeWidth="1" />
          <circle cx="314" cy="14" r="3" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // SULTANI_STAR
  return (
    <div className={`w-full flex items-center justify-center select-none pointer-events-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 360 24"
        className="w-full max-w-[340px] h-5 text-amber-800/85 print:text-slate-900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 12 H135" stroke="currentColor" strokeWidth="1.1" />
        <path d="M34 9 H125 M34 15 H125" stroke="currentColor" strokeWidth="0.65" />
        <circle cx="135" cy="12" r="2" fill="currentColor" />
        {/* Center Sultani Medallion */}
        <g transform="translate(180,12)">
          <polygon
            points="0,-9 2.5,-3 9,-3 4,1.5 6,8 0,4.2 -6,8 -4,1.5 -9,-3 -2.5,-3"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <circle cx="0" cy="0" r="10.2" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        <circle cx="225" cy="12" r="2" fill="currentColor" />
        <path d="M225 12 H344" stroke="currentColor" strokeWidth="1.1" />
        <path d="M235 9 H326 M235 15 H326" stroke="currentColor" strokeWidth="0.65" />
      </svg>
    </div>
  );
};

interface ArabicCalligraphySimulatorProps {
  docTitle: string;
  docSubtitle: string;
  headerNote: string;
  school: string;
  prof: string;
  academy: string;
  firstExerciseTitle: string;
  appliedConfig: AppliedTitleCalligraphyConfig;
  onApplyConfig: (config: AppliedTitleCalligraphyConfig) => void;
  onUpdateDocTitleText?: (formattedTitle: string) => void;
}

export const ArabicCalligraphySimulator: React.FC<ArabicCalligraphySimulatorProps> = ({
  docTitle,
  docSubtitle,
  headerNote,
  school,
  prof,
  academy,
  firstExerciseTitle,
  appliedConfig,
  onApplyConfig,
  onUpdateDocTitleText,
}) => {
  // حالة المحاكي الداخلية لمعاينة الخطوط بحرية قبل الاعتماد النهائي
  const [previewFontId, setPreviewFontId] = useState<TraditionalTitleFontId>(
    appliedConfig.fontId === "DEFAULT_DOC" ? "ANDALUSI_MAGHRIBI_SCRIPT" : appliedConfig.fontId
  );
  const [previewScale, setPreviewScale] = useState<TitleCalligraphyScale>(
    appliedConfig.scale || "BALANCED"
  );
  const [previewOrnament, setPreviewOrnament] = useState<TitleOrnamentStyle>(
    appliedConfig.ornament && appliedConfig.ornament !== "NONE"
      ? appliedConfig.ornament
      : "ANDALUSI_MOROCCAN"
  );
  const [previewScope, setPreviewScope] = useState<TitleCalligraphyScope>(
    appliedConfig.scope || "HEADER_TITLES"
  );
  const [enableMoroccanHeaderOrnament, setEnableMoroccanHeaderOrnament] = useState<boolean>(
    appliedConfig.enableMoroccanHeaderOrnament ?? true
  );
  const [customLetterSpacingEm, setCustomLetterSpacingEm] = useState<number>(
    appliedConfig.customLetterSpacingEm ?? 0.025
  );
  const [svgHeaderFrame, setSvgHeaderFrame] = useState<MoroccanHeaderSvgFrame>(
    appliedConfig.svgHeaderFrame || "ZELLIGE_FEZ"
  );
  const [simulatorMode, setSimulatorMode] = useState<"SINGLE_STAGE" | "COMPARE_GRID">(
    "SINGLE_STAGE"
  );
  const [showMizanGrid, setShowMizanGrid] = useState<boolean>(true);
  const [previewSurface, setPreviewSurface] = useState<
    "A4_WHITE" | "PARCHMENT" | "ROYAL_NAVY"
  >("PARCHMENT");
  const [customTestPhrase, setCustomTestPhrase] = useState<string>("");

  // مزامنة الحالة عند تغير الإعدادات من خارج المحاكي (من تبويب الخطوط والورقة أو محرر العناوين)
  React.useEffect(() => {
    if (appliedConfig.fontId !== "DEFAULT_DOC") {
      setPreviewFontId(appliedConfig.fontId);
    }
    if (appliedConfig.scale) setPreviewScale(appliedConfig.scale);
    if (appliedConfig.ornament) setPreviewOrnament(appliedConfig.ornament);
    if (appliedConfig.scope) setPreviewScope(appliedConfig.scope);
    if (appliedConfig.enableMoroccanHeaderOrnament !== undefined) {
      setEnableMoroccanHeaderOrnament(appliedConfig.enableMoroccanHeaderOrnament);
    }
    if (appliedConfig.customLetterSpacingEm !== undefined) {
      setCustomLetterSpacingEm(appliedConfig.customLetterSpacingEm);
    }
    if (appliedConfig.svgHeaderFrame !== undefined) {
      setSvgHeaderFrame(appliedConfig.svgHeaderFrame);
    }
  }, [
    appliedConfig.fontId,
    appliedConfig.scale,
    appliedConfig.ornament,
    appliedConfig.scope,
    appliedConfig.enableMoroccanHeaderOrnament,
    appliedConfig.customLetterSpacingEm,
    appliedConfig.svgHeaderFrame,
  ]);

  const activeFontMeta = useMemo(
    () =>
      TRADITIONAL_TITLE_FONT_OPTIONS.find((f) => f.id === previewFontId) ||
      TRADITIONAL_TITLE_FONT_OPTIONS[1],
    [previewFontId]
  );

  const effectiveTitleToPreview =
    customTestPhrase.trim() ||
    docTitle.trim() ||
    "الفرض المحروس رقم 1 — الدورة الأولى في مادة الرياضيات";

  const effectiveOrnamentStyle: TitleOrnamentStyle = enableMoroccanHeaderOrnament
    ? previewOrnament
    : "NONE";

  const ornamentMiniMeta = useMemo(
    () => getTitleOrnamentMiniPreview(previewOrnament, enableMoroccanHeaderOrnament),
    [previewOrnament, enableMoroccanHeaderOrnament]
  );

  const formattedMainTitle = useMemo(
    () => formatTitleWithCalligraphyOrnaments(effectiveTitleToPreview, effectiveOrnamentStyle),
    [effectiveTitleToPreview, effectiveOrnamentStyle]
  );

  const harmonyReport = useMemo(
    () =>
      evaluateTitleCalligraphyHarmony(
        effectiveTitleToPreview,
        docSubtitle,
        previewFontId,
        previewScale
      ),
    [effectiveTitleToPreview, docSubtitle, previewFontId, previewScale]
  );

  const isCurrentlyApplied =
    appliedConfig.fontId === previewFontId &&
    appliedConfig.scale === previewScale &&
    appliedConfig.ornament === previewOrnament &&
    appliedConfig.scope === previewScope &&
    (appliedConfig.enableMoroccanHeaderOrnament ?? true) === enableMoroccanHeaderOrnament &&
    (appliedConfig.customLetterSpacingEm ?? 0.025) === customLetterSpacingEm &&
    (appliedConfig.svgHeaderFrame || "ZELLIGE_FEZ") === svgHeaderFrame;

  const resolvedLetterSpacingCss = `${customLetterSpacingEm.toFixed(3)}em`;

  const scaleSizeClass =
    previewScale === "COMPACT"
      ? "text-lg md:text-xl"
      : previewScale === "GRAND"
      ? "text-2xl md:text-3xl"
      : "text-xl md:text-2xl";

  const surfaceStyles =
    previewSurface === "ROYAL_NAVY"
      ? "bg-slate-950 text-amber-100 border-amber-500/40"
      : previewSurface === "PARCHMENT"
      ? "bg-[#fcf8ef] text-slate-950 border-amber-300/80"
      : "bg-white text-slate-950 border-slate-300";

  return (
    <div
      dir="rtl"
      className="bg-white border-2 border-indigo-200/90 rounded-2xl p-3.5 space-y-3.5 shadow-xs"
    >
      {/* الشريط العلوي للمحاكي */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-serif text-sm font-black shadow-2xs">
            ق
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-950">
                محاكي الخطوط العربية التقليدية وميزان تناسق العناوين
              </h3>
              <span className="text-[10.5px] font-bold text-slate-500">
                الأندلسي المغربي (Maghribi Script) · الثلث · الديواني · الديواني الجلي · الرقعة · الكوفي
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              عاين تناسق العنوان الرئيسي والفرعي مع قواعد الخط العربي الأصيل وتباعد الترويسة المغربية الرسمية قبل اعتماده في التصميم النهائي للورقة (A4).
            </p>
          </div>
        </div>

        {/* أزرار التبديل بين المعاينة التفصيلية ومقارنة جميع الخطوط */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setSimulatorMode("SINGLE_STAGE")}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                simulatorMode === "SINGLE_STAGE"
                  ? "bg-slate-900 text-amber-300 font-black shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>لوحة الميزان والتناسق</span>
            </button>
            <button
              type="button"
              onClick={() => setSimulatorMode("COMPARE_GRID")}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                simulatorMode === "COMPARE_GRID"
                  ? "bg-slate-900 text-amber-300 font-black shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>مقارنة جميع الخطوط معاً</span>
            </button>
          </div>
        </div>
      </div>

      {/* شريط اختيار الخط العربي التقليدي */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="font-black text-slate-800">
            1. اختر الخط العربي التقليدي للمعاينة في المحاكي (شامل الخط الأندلسي المغربي المعاير للترويسة الرسمية):
          </span>
          <span className="text-slate-500 font-semibold">
            المدرسة الخطية: <strong className="text-indigo-950">{activeFontMeta.schoolOriginAr}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-1.5">
          {TRADITIONAL_TITLE_FONT_OPTIONS.map((fontOpt) => {
            const isSelected = previewFontId === fontOpt.id;
            const isAppliedOnDoc =
              appliedConfig.fontId === fontOpt.id && fontOpt.id !== "DEFAULT_DOC";
            return (
              <button
                key={fontOpt.id}
                type="button"
                onClick={() => {
                  setPreviewFontId(fontOpt.id);
                  if (fontOpt.recommendedOrnament) {
                    setPreviewOrnament(fontOpt.recommendedOrnament);
                  }
                  if (fontOpt.recommendedScale) {
                    setPreviewScale(fontOpt.recommendedScale);
                  }
                }}
                className={`p-2 rounded-xl border text-right transition flex flex-col justify-between gap-1 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-amber-400/50"
                    : fontOpt.id === "ANDALUSI_MAGHRIBI_SCRIPT"
                    ? "bg-amber-50/80 hover:bg-amber-100/80 text-amber-950 border-amber-300"
                    : "bg-slate-50/90 hover:bg-white text-slate-800 border-slate-200/90"
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1">
                  <span
                    className={`text-[10.5px] font-black truncate ${
                      isSelected ? "text-amber-300" : "text-slate-900"
                    }`}
                  >
                    {fontOpt.shortAr}
                  </span>
                  {isAppliedOnDoc && (
                    <span
                      title="معتمد حالياً في الوثيقة"
                      className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
                    />
                  )}
                </div>
                <div
                  className={`text-sm truncate w-full py-0.5 ${fontOpt.cssClass} ${
                    isSelected ? "text-white" : "text-indigo-950"
                  }`}
                >
                  {fontOpt.id === "ANDALUSI_MAGHRIBI_SCRIPT" ? "❁ الرياضيات ❁" : "الرياضيات"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ضوابط التناسق، الحجم، الزخرفة، ونطاق التطبيق */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
        {/* 1. حجم خط العنوان */}
        <div>
          <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
            حجم القلم والثلث الرأسي:
          </label>
          <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded-lg border border-slate-300 text-[10.5px] font-bold">
            {(
              [
                { id: "COMPACT", label: "مدمج" },
                { id: "BALANCED", label: "متوازن" },
                { id: "GRAND", label: "جليّ بارز" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPreviewScale(s.id)}
                className={`py-1 rounded-md transition cursor-pointer ${
                  previewScale === s.id
                    ? "bg-indigo-950 text-white font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. الكشيدة والزخرفة السلطانية والأندلسية المغربية */}
        <div>
          <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
            الكشيدة والزخرفة الخطية:
          </label>
          <select
            value={previewOrnament}
            onChange={(e) => {
              const nextOrn = e.target.value as TitleOrnamentStyle;
              setPreviewOrnament(nextOrn);
              if (nextOrn !== "NONE") {
                setEnableMoroccanHeaderOrnament(true);
              }
            }}
            className="w-full border border-slate-300 rounded-lg px-2 py-1 text-[11px] bg-white font-bold text-slate-900"
          >
            <option value="NONE">بدون زخرفة إضافية (نص صافي)</option>
            <option value="ANDALUSI_MOROCCAN">زخرفة أندلسية مغربية رسمية ❁ ﴾ ... ﴿ ❁</option>
            <option value="KASHIDA">تطويل الحروف بالكشيدة (ـ)</option>
            <option value="ROYAL_BRACKETS">أقواس سلطانية مزخرفة ﴾ ... ﴿</option>
            <option value="FULL_SULTANI">ترويسة سلطانية كاملة ۞ ﴾ ... ﴿ ۞</option>
          </select>
        </div>

        {/* 3. نطاق تطبيق الخط في الوثيقة */}
        <div>
          <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
            نطاق التطبيق عند الاعتماد:
          </label>
          <select
            value={previewScope}
            onChange={(e) => setPreviewScope(e.target.value as TitleCalligraphyScope)}
            className="w-full border border-slate-300 rounded-lg px-2 py-1 text-[11px] bg-white font-bold text-slate-900"
          >
            <option value="MAIN_TITLE_ONLY">العنوان الرئيسي للوثيقة فقط</option>
            <option value="HEADER_TITLES">ترويسة الوثيقة كاملة (الرئيسي + الفرعي + المؤسسة)</option>
            <option value="ALL_TITLES">جميع العناوين (الترويسة + عناوين التمارين)</option>
          </select>
        </div>

        {/* 4. خلفية المسرح وشبكة الميزان */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10.5px] font-bold text-slate-700">
              بيئة العرض وشبكة الميزان:
            </label>
            <button
              type="button"
              onClick={() => setShowMizanGrid((v) => !v)}
              className={`text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                showMizanGrid ? "text-amber-800 underline" : "text-slate-500"
              }`}
            >
              <Grid className="w-3 h-3" />
              <span>{showMizanGrid ? "إخفاء الميزان" : "إظهار الميزان"}</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded-lg border border-slate-300 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setPreviewSurface("PARCHMENT")}
              className={`py-1 rounded transition cursor-pointer ${
                previewSurface === "PARCHMENT"
                  ? "bg-amber-800 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              رق مخطوط
            </button>
            <button
              type="button"
              onClick={() => setPreviewSurface("A4_WHITE")}
              className={`py-1 rounded transition cursor-pointer ${
                previewSurface === "A4_WHITE"
                  ? "bg-indigo-950 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ورقة A4
            </button>
            <button
              type="button"
              onClick={() => setPreviewSurface("ROYAL_NAVY")}
              className={`py-1 rounded transition cursor-pointer ${
                previewSurface === "ROYAL_NAVY"
                  ? "bg-slate-900 text-amber-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              لوحة ملكية
            </button>
          </div>
        </div>
      </div>

      {/* قسم إعدادات الخط الأندلسي المغربي وترويسة المملكة المغربية (Toggle الزخرفة مع الأيقونة المصغرة + Slider التباعد الأفقي بين الحروف) */}
      <div className="bg-amber-50/75 border border-amber-300/90 rounded-xl p-3 space-y-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-900 text-amber-200 font-serif text-xs font-black shadow-2xs">
              ❁
            </span>
            <div>
              <div className="font-black text-amber-950 text-xs">
                إعدادات الخط الأندلسي المغربي وزخرفة الترويسة المغربية الرسمية (Maghribi Header Controls)
              </div>
              <div className="text-[10.5px] text-amber-900/80">
                تحكم فوري في تفعيل الزخرفة الأندلسية المغربية وضبط التباعد الأفقي بين الحروف (Letter Spacing) مع معاينة حية
              </div>
            </div>
          </div>

          {/* أيقونة مصغرة توضح شكل الزخرفة المختارة */}
          <div className="flex items-center gap-2 bg-white border border-amber-300 rounded-lg px-2.5 py-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500">شكل الزخرفة المختارة:</span>
            <span
              title={ornamentMiniMeta.descriptionAr}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-serif text-xs font-black border ${
                enableMoroccanHeaderOrnament && previewOrnament !== "NONE"
                  ? "bg-amber-100 text-amber-950 border-amber-400"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
            >
              <span className="tracking-wider">{ornamentMiniMeta.miniIconGlyph}</span>
              <span className="font-sans text-[10px] font-extrabold">
                {ornamentMiniMeta.shortBadgeAr}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          {/* 1. زر تبديل (Toggle) لتفعيل أو إلغاء الزخرفة الخاصة بالترويسة المغربية مع أيقونة مصغرة */}
          <div className="bg-white/95 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-11 h-9 rounded-lg border flex flex-col items-center justify-center shrink-0 transition ${
                  enableMoroccanHeaderOrnament && previewOrnament !== "NONE"
                    ? "bg-amber-950 text-amber-300 border-amber-700 shadow-2xs"
                    : "bg-slate-100 text-slate-500 border-slate-300"
                }`}
                title="أيقونة مصغرة توضح شكل الزخرفة المختارة للترويسة"
              >
                <span className="text-[11px] font-serif font-black leading-none">
                  {ornamentMiniMeta.miniIconGlyph}
                </span>
                <span className="text-[8.5px] font-mono opacity-80 mt-0.5">
                  {enableMoroccanHeaderOrnament && previewOrnament !== "NONE" ? "مفعّلة" : "معطّلة"}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-slate-900 truncate">
                  زخرفة الترويسة المغربية ({ornamentMiniMeta.labelAr})
                </div>
                <div className="text-[10px] text-slate-600 truncate">
                  {ornamentMiniMeta.descriptionAr}
                </div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={enableMoroccanHeaderOrnament}
              onClick={() => {
                const nextEnabled = !enableMoroccanHeaderOrnament;
                setEnableMoroccanHeaderOrnament(nextEnabled);
                const nextOrn =
                  nextEnabled && previewOrnament === "NONE"
                    ? "ANDALUSI_MOROCCAN"
                    : previewOrnament;
                if (nextEnabled && previewOrnament === "NONE") {
                  setPreviewOrnament("ANDALUSI_MOROCCAN");
                }
                onApplyConfig({
                  fontId: previewFontId,
                  scale: previewScale,
                  ornament: nextOrn,
                  scope: previewScope,
                  enableMoroccanHeaderOrnament: nextEnabled,
                  customLetterSpacingEm,
                  svgHeaderFrame,
                });
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enableMoroccanHeaderOrnament ? "bg-amber-700" : "bg-slate-300"
              }`}
              title={
                enableMoroccanHeaderOrnament
                  ? "إلغاء تفعيل زخرفة الترويسة المغربية"
                  : "تفعيل زخرفة الترويسة المغربية"
              }
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  enableMoroccanHeaderOrnament ? "-translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 2. شريط تمرير (Slider) للتحكم الدقيق في التباعد الأفقي بين الحروف (Letter Spacing) للترويسة */}
          <div className="bg-white/95 border border-amber-200 rounded-xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="andalusi-letter-spacing-slider"
                className="text-[11px] font-black text-slate-900 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-800" />
                <span>التباعد الأفقي بين الحروف (Letter Spacing):</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-mono text-[10.5px] font-black border border-amber-300">
                  {customLetterSpacingEm.toFixed(3)}em
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const defaultSpacing = 0.025;
                    setCustomLetterSpacingEm(defaultSpacing);
                    onApplyConfig({
                      fontId: previewFontId,
                      scale: previewScale,
                      ornament: previewOrnament,
                      scope: previewScope,
                      enableMoroccanHeaderOrnament,
                      customLetterSpacingEm: defaultSpacing,
                      svgHeaderFrame,
                    });
                  }}
                  className="text-[10px] font-bold text-amber-800 hover:underline cursor-pointer"
                  title="إعادة ضبط التباعد الأفقي إلى القيمة المعيارية للخط الأندلسي المغربي (0.025em)"
                >
                  ضبط قياسي
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[9.5px] font-mono text-slate-500">0.00em</span>
              <input
                id="andalusi-letter-spacing-slider"
                type="range"
                min={0}
                max={0.12}
                step={0.005}
                value={customLetterSpacingEm}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCustomLetterSpacingEm(val);
                  onApplyConfig({
                    fontId: previewFontId,
                    scale: previewScale,
                    ornament: previewOrnament,
                    scope: previewScope,
                    enableMoroccanHeaderOrnament,
                    customLetterSpacingEm: val,
                    svgHeaderFrame,
                  });
                }}
                className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
              />
              <span className="text-[9.5px] font-mono text-slate-500">0.12em</span>
            </div>
          </div>

          {/* 3. شريط ترويسة زخرفي مغربي SVG متعدد الأنماط للطباعة عالية الدقة */}
          <div className="md:col-span-2 bg-white/95 border border-amber-200 rounded-xl p-2.5 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>إطار الترويسة الهندسي الشعاعي (Vector Moroccan SVG Header Frame):</span>
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                دقة شعاعية 100% للطباعة الورقية وPDF
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {MOROCCAN_HEADER_SVG_FRAME_OPTIONS.map((frameOpt) => {
                const isSelected = svgHeaderFrame === frameOpt.id;
                return (
                  <button
                    key={frameOpt.id}
                    type="button"
                    onClick={() => {
                      setSvgHeaderFrame(frameOpt.id);
                      onApplyConfig({
                        fontId: previewFontId,
                        scale: previewScale,
                        ornament: previewOrnament,
                        scope: previewScope,
                        enableMoroccanHeaderOrnament,
                        customLetterSpacingEm,
                        svgHeaderFrame: frameOpt.id,
                      });
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-right transition cursor-pointer ${
                      isSelected
                        ? "bg-amber-900 text-amber-100 border-amber-950 font-black shadow-2xs"
                        : "bg-amber-50/50 hover:bg-amber-100/70 text-slate-800 border-amber-200 font-bold"
                    }`}
                  >
                    <div className="text-[10.5px]">{frameOpt.shortAr}</div>
                    <div
                      className={`text-[9.5px] truncate ${
                        isSelected ? "text-amber-200/90" : "text-slate-500"
                      }`}
                    >
                      {frameOpt.labelAr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* مسرح المعاينة: إما لوحة الميزان التفصيلية أو مقارنة جميع الخطوط جنباً إلى جنب */}
      {simulatorMode === "SINGLE_STAGE" ? (
        <div
          className={`rounded-2xl border-2 p-4 md:p-5 transition-colors relative overflow-hidden ${surfaceStyles} ${
            showMizanGrid && previewSurface !== "ROYAL_NAVY" ? "calligraphy-mizan-grid" : ""
          } ${
            enableMoroccanHeaderOrnament &&
            activeFontMeta.moroccanHeaderFramePreset &&
            previewSurface !== "ROYAL_NAVY"
              ? "andalusi-maghribi-official-header"
              : ""
          }`}
        >
          {/* شارة نوع الخط وأصله وإعدادات التباعد والزخرفة الخاصة بالترويسة المغربية الرسمية */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pb-2.5 mb-3 border-b border-current/15">
            <div className="flex flex-wrap items-center gap-2 font-bold">
              <Type className="w-3.5 h-3.5 opacity-75" />
              <span>معاينة حية للترويسة بـ: {activeFontMeta.nameAr}</span>
              {enableMoroccanHeaderOrnament && activeFontMeta.moroccanHeaderFramePreset && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-950 border border-amber-400/80 text-[10px] font-black">
                  ❁ متناغم مع الترويسة المغربية الرسمية (AREF)
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] opacity-85 font-mono">
              <span>تباعد الحروف: {resolvedLetterSpacingCss}</span>
              <span>·</span>
              <span>تباعد الكلمات: {activeFontMeta.wordSpacing || "0.08em"}</span>
              <span>·</span>
              <span>ارتفاع السطر: {activeFontMeta.lineHeight || "1.75"}</span>
              <span>·</span>
              <span>الزخرفة: {ornamentMiniMeta.miniIconGlyph}</span>
              <span>·</span>
              <span>العربية: {harmonyReport.arabicRatioPercent}%</span>
            </div>
          </div>

          {/* محاكاة الترويسة الفعلية للفرض */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-center md:text-right">
            <div className="space-y-0.5 text-[11px] opacity-85">
              <div
                style={{
                  letterSpacing:
                    previewScope !== "MAIN_TITLE_ONLY" ? resolvedLetterSpacingCss : undefined,
                  ["--title-letter-spacing" as string]:
                    previewScope !== "MAIN_TITLE_ONLY" ? resolvedLetterSpacingCss : undefined,
                }}
                className="font-bold"
              >
                {enableMoroccanHeaderOrnament && activeFontMeta.moroccanHeaderFramePreset
                  ? "❁ المملكة المغربية · وزارة التربية الوطنية والتعليم الأولي والرياضة"
                  : "المملكة المغربية · وزارة التربية الوطنية"}
              </div>
              <div className="text-[10.5px] opacity-80">{academy}</div>
              <div
                style={{
                  letterSpacing:
                    previewScope !== "MAIN_TITLE_ONLY" ? resolvedLetterSpacingCss : undefined,
                  ["--title-letter-spacing" as string]:
                    previewScope !== "MAIN_TITLE_ONLY" ? resolvedLetterSpacingCss : undefined,
                }}
                className={`font-black text-xs pt-0.5 ${
                  previewScope !== "MAIN_TITLE_ONLY" ? activeFontMeta.cssClass : ""
                }`}
              >
                {school}
              </div>
            </div>

            <div
              className={`md:col-span-1 text-center space-y-1.5 py-2 px-3 rounded-xl border ${
                enableMoroccanHeaderOrnament && activeFontMeta.moroccanHeaderFramePreset
                  ? "border-amber-600/45 bg-amber-500/[0.06]"
                  : "border-current/15 bg-current/[0.03]"
              }`}
            >
              {enableMoroccanHeaderOrnament && svgHeaderFrame !== "NONE" && (
                <MoroccanHeaderSvgBanner frame={svgHeaderFrame} position="TOP" />
              )}
              {enableMoroccanHeaderOrnament && activeFontMeta.moroccanHeaderFramePreset && (
                <div className="text-[9.5px] font-bold tracking-widest opacity-80">
                  ─── {ornamentMiniMeta.miniIconGlyph} ───
                </div>
              )}
              <div
                style={{
                  letterSpacing: resolvedLetterSpacingCss,
                  ["--title-letter-spacing" as string]: resolvedLetterSpacingCss,
                  wordSpacing: activeFontMeta.wordSpacing,
                  lineHeight: activeFontMeta.lineHeight,
                }}
                className={`font-black tracking-normal transition-all ${activeFontMeta.cssClass} ${scaleSizeClass}`}
              >
                {formattedMainTitle}
              </div>
              {enableMoroccanHeaderOrnament && svgHeaderFrame === "ZELLIGE_FEZ" && (
                <MoroccanHeaderSvgBanner frame="ZELLIGE_FEZ" position="BOTTOM" />
              )}
              <div
                style={{
                  letterSpacing:
                    previewScope !== "MAIN_TITLE_ONLY" ? resolvedLetterSpacingCss : undefined,
                  ["--title-letter-spacing" as string]:
                    previewScope !== "MAIN_TITLE_ONLY" ? resolvedLetterSpacingCss : undefined,
                }}
                className={`text-xs font-bold opacity-90 ${
                  previewScope !== "MAIN_TITLE_ONLY" ? activeFontMeta.cssClass : ""
                }`}
              >
                {docSubtitle.trim() || "المدة الزمنية: ساعتان (2h) · سلم التنقيط: 20/20"}
              </div>
              {headerNote.trim() && (
                <div className="text-[10.5px] italic opacity-75">{headerNote}</div>
              )}
            </div>

            <div className="space-y-0.5 text-[11px] md:text-left opacity-85">
              <div className="font-bold">المادة: الرياضيات</div>
              <div className="font-extrabold">{prof}</div>
              <div className="text-[10.5px] opacity-75">معاينة التناسق قبل الطباعة</div>
            </div>
          </div>

          {/* معاينة عنوان التمرين الأول أسفل الترويسة للتأكد من التناغم مع متن الورقة */}
          <div className="mt-3.5 pt-2.5 border-t border-current/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-bold opacity-70">
                معاينة عنوان التمرين مع هذا التنسيق:
              </span>
              <span
                style={{
                  letterSpacing:
                    previewScope === "ALL_TITLES" ? resolvedLetterSpacingCss : undefined,
                  ["--title-letter-spacing" as string]:
                    previewScope === "ALL_TITLES" ? resolvedLetterSpacingCss : undefined,
                }}
                className={`font-black text-sm ${
                  previewScope === "ALL_TITLES" ? activeFontMeta.cssClass : ""
                }`}
              >
                {firstExerciseTitle || "التمرين 1 : اتصال واشتقاق دالة عددية ودراسة تغيراتها"}
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold opacity-80">
              [6.0 نقط · N1/N2]
            </span>
          </div>
        </div>
      ) : (
        /* شبكة مقارنة جميع الخطوط العربية التقليدية جنباً إلى جنب */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TRADITIONAL_TITLE_FONT_OPTIONS.filter((f) => f.id !== "DEFAULT_DOC").map(
            (fontOpt) => {
              const isSelected = previewFontId === fontOpt.id;
              const rep = evaluateTitleCalligraphyHarmony(
                effectiveTitleToPreview,
                docSubtitle,
                fontOpt.id,
                previewScale
              );
              return (
                <div
                  key={fontOpt.id}
                  onClick={() => setPreviewFontId(fontOpt.id)}
                  className={`rounded-xl border p-3 transition cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/30"
                      : "bg-[#fcf9f2] hover:bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-1.5">
                    <div>
                      <div className="text-xs font-black text-slate-950">
                        {fontOpt.nameAr}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {fontOpt.bestForAr}
                      </div>
                    </div>
                    <span className="font-mono text-[10.5px] font-black text-emerald-800 shrink-0">
                      تناسق {rep.score}%
                    </span>
                  </div>

                  <div className="py-2 text-center space-y-1">
                    <div
                      style={{
                        letterSpacing: resolvedLetterSpacingCss,
                        ["--title-letter-spacing" as string]: resolvedLetterSpacingCss,
                      }}
                      className={`text-xl font-black text-indigo-950 ${fontOpt.cssClass}`}
                    >
                      {formatTitleWithCalligraphyOrnaments(
                        effectiveTitleToPreview,
                        effectiveOrnamentStyle
                      )}
                    </div>
                    <div
                      className={`text-xs font-bold text-slate-600 ${fontOpt.cssClass}`}
                    >
                      {docSubtitle.trim() || "المدة الزمنية: ساعتان · المعامل: 7"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 text-[10.5px]">
                    <span className="text-slate-500">{fontOpt.shortAr}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewFontId(fontOpt.id);
                        onApplyConfig({
                          fontId: fontOpt.id,
                          scale: previewScale,
                          ornament: previewOrnament,
                          scope: previewScope,
                          enableMoroccanHeaderOrnament,
                          customLetterSpacingEm,
                        });
                      }}
                      className="text-indigo-800 hover:text-indigo-950 font-black underline cursor-pointer"
                    >
                      اعتماد مباشر للوثيقة ←
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* شريط التشخيص البصري ومؤشر التناسق + أزرار الاعتماد النهائي */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-black flex items-center gap-1 ${
                harmonyReport.status === "EXCELLENT"
                  ? "text-emerald-800"
                  : harmonyReport.status === "GOOD"
                  ? "text-indigo-900"
                  : "text-amber-800"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                مؤشر التناسق والوضوح الطباعي: {harmonyReport.score}% ({harmonyReport.statusLabelAr})
              </span>
            </span>
            <span className="text-[11px] text-slate-400">·</span>
            <span className="text-[11px] font-semibold text-slate-600">
              {activeFontMeta.descriptionAr}
            </span>
          </div>
          <div className="text-[11px] text-slate-700 font-medium">
            💡 <strong>توصية الخبير الخطي:</strong> {harmonyReport.notesAr[0]}{" "}
            <span className="text-indigo-900 font-bold">
              {harmonyReport.recommendationAr}
            </span>
          </div>
        </div>

        {/* أزرار التطبيق والاعتماد النهائي */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {effectiveOrnamentStyle !== "NONE" && onUpdateDocTitleText && (
            <button
              type="button"
              onClick={() => onUpdateDocTitleText(formattedMainTitle)}
              title="إدراج الكشيدة أو الأقواس السلطانية مباشرة في حقل نص العنوان الرئيسي"
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition flex items-center gap-1 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-700" />
              <span>تثبيت الزخرفة في النص</span>
            </button>
          )}

          {appliedConfig.fontId !== "DEFAULT_DOC" && (
            <button
              type="button"
              onClick={() => {
                setPreviewFontId("DEFAULT_DOC");
                setPreviewOrnament("NONE");
                setEnableMoroccanHeaderOrnament(false);
                setCustomLetterSpacingEm(0.01);
                setSvgHeaderFrame("NONE");
                onApplyConfig({
                  fontId: "DEFAULT_DOC",
                  scale: "BALANCED",
                  ornament: "NONE",
                  scope: "HEADER_TITLES",
                  enableMoroccanHeaderOrnament: false,
                  customLetterSpacingEm: 0.01,
                  svgHeaderFrame: "NONE",
                });
              }}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة الخط القياسي</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onApplyConfig({
                fontId: previewFontId,
                scale: previewScale,
                ornament: previewOrnament,
                scope: previewScope,
                enableMoroccanHeaderOrnament,
                customLetterSpacingEm,
                svgHeaderFrame,
              })
            }
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isCurrentlyApplied && previewFontId !== "DEFAULT_DOC"
                ? "bg-emerald-700 text-white"
                : "bg-indigo-950 hover:bg-indigo-900 text-amber-300"
            }`}
          >
            {isCurrentlyApplied && previewFontId !== "DEFAULT_DOC" ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>معتمد في التصميم النهائي للوثيقة ({activeFontMeta.shortAr})</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>اعتماد «{activeFontMeta.shortAr}» في التصميم النهائي للوثيقة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* حقل اختياري لتجربة عبارة حرة داخل المحاكي دون تغيير عنوان الوثيقة إلا عند الرغبة */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[11px]">
        <span className="font-bold text-slate-600 shrink-0">
          تجربة نص حر في المحاكي (اختياري):
        </span>
        <input
          type="text"
          value={customTestPhrase}
          onChange={(e) => setCustomTestPhrase(e.target.value)}
          placeholder="اكتب هنا أي عنوان لتجربته بالخط الديواني أو الثلث دون تغيير عنوانك الأصلي..."
          className="flex-1 min-w-[220px] border border-slate-300 rounded-lg px-2.5 py-1 text-xs bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        {customTestPhrase.trim() && (
          <>
            <button
              type="button"
              onClick={() => {
                onUpdateDocTitleText?.(customTestPhrase.trim());
                setCustomTestPhrase("");
              }}
              className="text-[11px] font-black text-indigo-800 hover:underline cursor-pointer"
            >
              اعتماد هذا النص كعنوان رئيسي
            </button>
            <button
              type="button"
              onClick={() => setCustomTestPhrase("")}
              className="text-[11px] font-bold text-rose-700 hover:underline cursor-pointer"
            >
              مسح النص التجريبي
            </button>
          </>
        )}
      </div>
    </div>
  );
};
