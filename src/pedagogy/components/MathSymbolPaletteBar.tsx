import React, { useState, useRef, useEffect } from "react";
import { Check, Search, X, Pin, PinOff, Copy, Sparkles } from "lucide-react";
import {
  MATH_SYMBOLS_LIBRARY,
  MATH_SYMBOL_CATEGORIES,
  MathSymbolCategory,
  MathSymbolItem,
  filterMathSymbols,
} from "../utils/mathSymbolsRegistry";

export { MATH_SYMBOLS_LIBRARY };
export type { MathSymbolItem };

interface MathSymbolPaletteBarProps {
  onInsertSymbol?: (glyph: string, latex?: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isArabic?: boolean;
}

export const MathSymbolPaletteBar: React.FC<MathSymbolPaletteBarProps> = ({
  onInsertSymbol,
  isOpen,
  onToggle,
  isArabic = true,
}) => {
  const [selectedCat, setSelectedCat] = useState<MathSymbolCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copyMode, setCopyMode] = useState<"GLYPH" | "LATEX">("GLYPH");
  const [isPinned, setIsPinned] = useState<boolean>(true);
  const [copiedGlyph, setCopiedGlyph] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Track the last focused input or textarea in the workspace so clicking a symbol can also insert directly
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popoverRef.current && popoverRef.current.contains(target)) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        lastFocusedInputRef.current = target as HTMLInputElement | HTMLTextAreaElement;
      }
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onToggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onToggle]);

  const filteredSymbols = filterMathSymbols(selectedCat, searchQuery);

  const handleCopyOrInsert = (item: MathSymbolItem) => {
    const textToUse = copyMode === "LATEX" ? item.latex : item.glyph;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToUse).catch(() => {});
    }

    // Also insert into the last active input/textarea if still mounted and editable
    const activeEl = lastFocusedInputRef.current;
    if (
      activeEl &&
      document.body.contains(activeEl) &&
      !activeEl.disabled &&
      !activeEl.readOnly &&
      activeEl.type !== "checkbox" &&
      activeEl.type !== "radio" &&
      activeEl.type !== "range" &&
      activeEl.type !== "number"
    ) {
      try {
        const start = activeEl.selectionStart ?? activeEl.value.length;
        const end = activeEl.selectionEnd ?? activeEl.value.length;
        const nextVal =
          activeEl.value.slice(0, start) + textToUse + activeEl.value.slice(end);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        if (activeEl.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
          nativeTextAreaValueSetter.call(activeEl, nextVal);
        } else if (nativeInputValueSetter) {
          nativeInputValueSetter.call(activeEl, nextVal);
        } else {
          activeEl.value = nextVal;
        }
        activeEl.dispatchEvent(new Event("input", { bubbles: true }));
        activeEl.focus();
        activeEl.setSelectionRange(start + textToUse.length, start + textToUse.length);
      } catch {
        // Fallback to clipboard-only if input does not support selection range
      }
    }

    setCopiedGlyph(textToUse);
    setTimeout(() => {
      setCopiedGlyph(null);
    }, 1800);

    if (onInsertSymbol) {
      onInsertSymbol(textToUse, item.latex);
    }

    if (!isPinned) {
      onToggle();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="mathSymbolPalettePopover"
      ref={popoverRef}
      role="dialog"
      aria-label="نافذة الرموز والعمليات الرياضية السريعة"
      className="no-print fixed top-[94px] left-1/2 -translate-x-1/2 z-50 w-[min(96vw,880px)] rounded-2xl bg-slate-900/98 text-slate-100 border border-cyan-500/45 shadow-2xl backdrop-blur-xl select-none overflow-hidden"
    >
      {/* الشريط العلوي المدمج للنافذة المنبثقة */}
      <div className="px-3.5 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 flex items-center justify-center font-serif text-xs font-black shadow-xs">
            ∑±
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-cyan-200 text-xs">
                {isArabic
                  ? "الرموز والعمليات الرياضية المدمجة"
                  : "Palette des Symboles & Opérations Mathématiques"}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono border border-slate-700">
                {filteredSymbols.length} {isArabic ? "رمزاً وعملية" : "symboles"}
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400">
              {isArabic
                ? "انقر على أي رمز أو عملية حسابية لنسخها فوراً وإدراجها في الحقل النشط"
                : "Cliquez sur un symbole ou une opération pour copier et insérer"}
            </p>
          </div>
          {copiedGlyph && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 text-[11px] font-bold flex items-center gap-1 shadow-xs">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>تم نسخ: {copiedGlyph}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* حقل بحث سريع في الرموز والعمليات */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="mathSymbolSearchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? "بحث (تكامل، كسر، ضرب، Δ...)" : "Rechercher..."}
              className="h-7 w-44 sm:w-52 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 pr-7 pl-6 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* تبديل صيغة النسخ: الرمز المباشر أو كود LaTeX */}
          <div className="h-7 flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10.5px] font-bold">
            <button
              type="button"
              onClick={() => setCopyMode("GLYPH")}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                copyMode === "GLYPH"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="نسخ الرمز الرياضي المباشر (مثال: ∫, ×, √x)"
            >
              رمز ∑
            </button>
            <button
              type="button"
              onClick={() => setCopyMode("LATEX")}
              className={`px-2 py-0.5 rounded-md font-mono transition cursor-pointer ${
                copyMode === "LATEX"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="نسخ صيغة LaTeX (مثال: \int, \times, \frac{a}{b})"
            >
              LaTeX
            </button>
          </div>

          {/* تثبيت أو إغلاق تلقائي بعد الاختيار */}
          <button
            type="button"
            onClick={() => setIsPinned((v) => !v)}
            title={
              isPinned
                ? "مثبت: تبقى النافذة مفتوحة عند اختيار عدة رموز (انقر للإغلاق التلقائي)"
                : "إغلاق تلقائي فور اختيار الرمز"
            }
            className={`h-7 px-2 rounded-lg border text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer ${
              isPinned
                ? "bg-cyan-950/80 text-cyan-300 border-cyan-700/60"
                : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
          >
            {isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
            <span className="hidden sm:inline">{isPinned ? "مثبت" : "تلقائي"}</span>
          </button>

          <button
            id="btnCloseMathSymbolsPopover"
            type="button"
            onClick={onToggle}
            title="إغلاق نافذة الرموز والعمليات الرياضية (Esc)"
            aria-label="إغلاق نافذة الرموز والعمليات الرياضية"
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/50 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* شريط تبويبات الفئات الرياضية */}
      <div className="px-3.5 py-2 bg-slate-900/95 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {MATH_SYMBOL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCat(c.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              selectedCat === c.id
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-xs"
                : "bg-slate-800/70 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="font-mono text-[10.5px] opacity-90">{c.iconGlyph}</span>
            <span>{isArabic ? c.labelAr : c.labelFr}</span>
          </button>
        ))}
      </div>

      {/* شبكة الرموز والعمليات الرياضية */}
      <div className="p-3 max-h-[240px] overflow-y-auto studio-scroll">
        {filteredSymbols.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            لا توجد رموز أو عمليات مطابقة لعبارة البحث «{searchQuery}»
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
            {filteredSymbols.map((item) => (
              <button
                key={`${item.category}-${item.glyph}`}
                type="button"
                onClick={() => handleCopyOrInsert(item)}
                title={`${item.nameAr} (${item.nameFr}) · LaTeX: ${item.latex}`}
                className="math-symbol-btn group relative h-11 px-2 rounded-xl bg-slate-800/90 hover:bg-cyan-950/80 border border-slate-700/70 hover:border-cyan-400/70 text-slate-100 hover:text-cyan-200 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <span className="text-sm font-black font-serif leading-none">
                  {copyMode === "LATEX" ? item.latex : item.glyph}
                </span>
                <span className="text-[9.5px] text-slate-400 group-hover:text-cyan-300 truncate max-w-full leading-tight">
                  {isArabic ? item.nameAr : item.nameFr}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
