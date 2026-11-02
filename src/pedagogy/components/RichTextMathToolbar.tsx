import React, { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  RemoveFormatting,
  Undo2,
  Redo2,
  Pi,
  Sparkles,
  ChevronDown,
  Award,
  Image as ImageIcon,
  PenTool,
  Mic,
} from "lucide-react";
import { DOC_FONT_OPTIONS, DocFontFamily } from "../data/curriculum";
import { DocumentVoiceDictationStudio } from "./VoiceDictationControl";

export interface RichTextMathToolbarProps {
  isFr?: boolean;
  isArabic?: boolean;
  onInsertMathSymbol?: (symbol: string) => void;
  onInsertImageFile?: (file: File) => void;
  docFontFamily?: DocFontFamily;
  onChangeDocFontFamily?: (font: DocFontFamily) => void;
}

const MATH_SYMBOLS = [
  // أعداد ومجموعات
  { label: "ℝ", insert: "ℝ", title: "مجموعة الأعداد الحقيقية (Ensemble des Réels)" },
  { label: "ℕ", insert: "ℕ", title: "مجموعة الأعداد الصحيحة الطبيعية" },
  { label: "ℤ", insert: "ℤ", title: "مجموعة الأعداد الصحيحة النسبية" },
  { label: "ℂ", insert: "ℂ", title: "مجموعة الأعداد العقدية (Nombres Complexes)" },
  // رموز التحليل والاشتقاق والتكامل والمتتاليات
  { label: "√x", insert: "√", title: "جذر مربع (Racine carrée)" },
  { label: "∫", insert: "∫", title: "تكامل (Intégrale)" },
  { label: "∑", insert: "∑", title: "مجموع (Somme)" },
  { label: "lim", insert: "lim_{x→+∞} ", title: "نهاية (Limite)" },
  { label: "f'(x)", insert: "f'(x)", title: "دالة مشتقة (Dérivée)" },
  { label: "(uₙ)", insert: "(uₙ)", title: "متتالية عددية (Suite)" },
  { label: "∞", insert: "∞", title: "لا نهاية (Infini)" },
  { label: "π", insert: "π", title: "العدد باي (Pi)" },
  { label: "eˣ", insert: "eˣ", title: "الدالة الأسية (Exponentielle)" },
  { label: "ln(x)", insert: "ln(x)", title: "اللوغاريتم النبيري (Logarithme népérien)" },
  // متجهات وهندسة
  { label: "u⃗", insert: "u⃗", title: "متجهة (Vecteur u)" },
  { label: "v⃗", insert: "v⃗", title: "متجهة (Vecteur v)" },
  { label: "AB⃗", insert: "AB⃗", title: "متجهة AB" },
  { label: "n⃗", insert: "n⃗", title: "متجهة منظمية (Normale)" },
  { label: "⊥", insert: "⊥", title: "تعامد (Perpendiculaire)" },
  { label: "∥", insert: "∥", title: "توازي (Parallèle)" },
  { label: "Δ", insert: "Δ", title: "مميز المعادلة أو مستقيم Delta" },
  { label: "θ", insert: "θ", title: "زاوية / عمدة عدد عقدي (Thêta)" },
  { label: "Ω", insert: "Ω", title: "مركز فلكة أو دائرة (Centre Oméga)" },
  // علاقات منطقية ومقارنة
  { label: "≤", insert: "≤", title: "أصغر من أو يساوي" },
  { label: "≥", insert: "≥", title: "أكبر من أو يساوي" },
  { label: "≠", insert: "≠", title: "يخالف (Différent)" },
  { label: "∈", insert: "∈", title: "ينتمي إلى (Appartient à)" },
  { label: "∉", insert: "∉", title: "لا ينتمي (N'appartient pas)" },
  { label: "⊂", insert: "⊂", title: "ضمن / احتواء (Inclus)" },
  { label: "∩", insert: "∩", title: "تقاطع (Intersection)" },
  { label: "∪", insert: "∪", title: "اتحاد (Union)" },
  { label: "⇒", insert: "⇒", title: "يستلزم (Implique)" },
  { label: "⇔", insert: "⇔", title: "يكافئ (Équivaut à)" },
  { label: "∀", insert: "∀", title: "مهما يكن (Pour tout / Quel que soit)" },
  { label: "∃", insert: "∃", title: "يوجد على الأقل (Il existe)" },
];

const BAREME_BADGES = [
  { label: "+ 0.25 pt", insert: " [0.25 pt] " },
  { label: "+ 0.50 pt", insert: " [0.50 pt] " },
  { label: "+ 0.75 pt", insert: " [0.75 pt] " },
  { label: "+ 1.00 pt (N1)", insert: " [1.00 pt · N1] " },
  { label: "+ 1.50 pt (N2)", insert: " [1.50 pt · N2] " },
  { label: "+ 2.00 pt (N3)", insert: " [2.00 pt · N3] " },
  { label: "فراغ برهان (...) ", insert: " ................................................. " },
];

export const RichTextMathToolbar: React.FC<RichTextMathToolbarProps> = ({
  isFr = false,
  isArabic,
  onInsertMathSymbol,
  onInsertImageFile,
  docFontFamily,
  onChangeDocFontFamily,
}) => {
  const [showMathSymbols, setShowMathSymbols] = useState<boolean>(true);
  const [showBaremeMenu, setShowBaremeMenu] = useState<boolean>(false);
  const [showVoiceDictation, setShowVoiceDictation] = useState<boolean>(true);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onInsertImageFile) {
      onInsertImageFile(file);
    }
    e.target.value = "";
  };

  const effectiveFr = isArabic !== undefined ? !isArabic : isFr;

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const insertTextAtCursor = (text: string) => {
    if (onInsertMathSymbol) {
      onInsertMathSymbol(text);
      return;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      document.execCommand("insertText", false, text);
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className="no-print sticky top-16 z-20 mb-4 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-slate-700/80 space-y-2 select-none animate-in fade-in slide-in-from-top-2">
      {/* الصف الأول: أدوات التنسيق النصي والتراجع والهيكلة */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* مجموعة التنسيق الأساسي */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("bold");
            }}
            title="عريض (Gras - Ctrl+B)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("italic");
            }}
            title="مائل (Italique - Ctrl+I)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("underline");
            }}
            title="تسطير (Souligné - Ctrl+U)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("strikeThrough");
            }}
            title="يتوسطه خط (Barré)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("removeFormat");
            }}
            title="إزالة التنسيق (Effacer le format)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* مجموعة الهيكلة والقوائم */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("formatBlock", "<h3>");
            }}
            title="عنوان فرعي (Titre H3)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("formatBlock", "<h4>");
            }}
            title="عنوان صغير (Titre H4)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Heading4 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("insertUnorderedList");
            }}
            title="قائمة نقطية (Puces)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("insertOrderedList");
            }}
            title="قائمة رقمية (Numérotation)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* قائمة إدراج شارات التنقيط والمستويات المهارية */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBaremeMenu((v) => !v)}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-amber-300 border border-indigo-700/80 font-black text-[11px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isFr ? "Insérer Barème [pt]" : "إدراج شارة تنقيط [ن]"}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showBaremeMenu && (
            <div className="absolute top-full left-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl z-30 min-w-[190px] space-y-1">
              {BAREME_BADGES.map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertTextAtCursor(b.insert);
                    setShowBaremeMenu(false);
                  }}
                  className="w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* زر إدراج صورة توضيحية أو شكل هندسي */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*,.ggb"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title={effectiveFr ? "Insérer une figure géométrique ou une image" : "إدراج شكل هندسي أو صورة توضيحية"}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-900/90 hover:bg-indigo-800 text-indigo-100 border border-indigo-600/70 font-black text-[11px] flex items-center gap-1.5 cursor-pointer shadow-2xs transition active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-300" />
            <span>{effectiveFr ? "Insérer Figure / Image" : "إدراج صورة / شكل"}</span>
          </button>
        </div>

        {/* مبدل سريع لخطوط الكتابة باليد داخل المحرر المباشر */}
        {onChangeDocFontFamily && (
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <PenTool className="w-3.5 h-3.5 text-amber-400 mx-1 shrink-0" />
            {DOC_FONT_OPTIONS.filter((f) => f.isHandwritten).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChangeDocFontFamily(f.id)}
                title={effectiveFr ? f.labelFr : f.labelAr}
                className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition whitespace-nowrap cursor-pointer ${
                  docFontFamily === f.id
                    ? "bg-amber-400 text-slate-950 font-black shadow-2xs"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {f.shortAr}
              </button>
            ))}
          </div>
        )}

        {/* زر التراجع والإعادة والتنبيه الحي */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("undo");
              }}
              title="تراجع (Ctrl+Z)"
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("redo");
              }}
              title="إعادة (Ctrl+Y)"
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>
              {isFr
                ? "Mode Édition Active : cliquez sur le texte pour modifier"
                : "التحرير المباشر مفعل : انقر على أي سؤال أو نص للتعديل الفوري"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowVoiceDictation((v) => !v)}
            title={
              effectiveFr
                ? "Dictée vocale (Microphone) pour insérer des notes ou consignes dans le document"
                : "الإملاء الصوتي عبر الميكروفون لتسجيل الملاحظات التربوية وتعليمات الفرض مباشرة في الورقة"
            }
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border transition flex items-center gap-1.5 cursor-pointer ${
              showVoiceDictation
                ? "bg-rose-600 text-white border-rose-500 shadow-xs"
                : "bg-slate-800 text-rose-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{effectiveFr ? "Dictée Vocale" : "الإملاء الصوتي (Mic)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMathSymbols((v) => !v)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black border transition flex items-center gap-1 cursor-pointer ${
              showMathSymbols
                ? "bg-amber-400 text-slate-950 border-amber-400"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Pi className="w-3.5 h-3.5" />
            <span>{showMathSymbols ? "لوحة الرموز الرياضية" : "إظهار الرموز"}</span>
          </button>
        </div>
      </div>

      {/* شريط الإملاء الصوتي المباشر عبر الميكروفون (Voice-to-Text Dictation) داخل محرر الورقة */}
      {showVoiceDictation && (
        <div className="pt-2 border-t border-slate-800">
          <DocumentVoiceDictationStudio
            isFr={effectiveFr}
            onInsertAtCursor={(txt) => insertTextAtCursor(txt)}
          />
        </div>
      )}

      {/* الصف الثاني: شريط نقر الرموز الرياضية السريعة (Math Symbol Palette) */}
      {showMathSymbols && (
        <div className="pt-2 border-t border-slate-800 flex items-center gap-1 overflow-x-auto studio-scroll pb-1">
          <span className="text-[10px] font-bold text-slate-400 px-1 whitespace-nowrap">
            {isFr ? "Symboles :" : "رموز سريعة:"}
          </span>
          {MATH_SYMBOLS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertTextAtCursor(s.insert);
              }}
              title={s.title}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-700/80 text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer active:scale-95"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
