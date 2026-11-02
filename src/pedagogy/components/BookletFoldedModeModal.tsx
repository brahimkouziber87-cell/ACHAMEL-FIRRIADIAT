/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * نمط الكتيب المطوي A4 إلى A5 (Mode Livret / Cahier d'exercices plié)
 * Livret Plié A4 paysage -> A5 portrait pour les séries et devoirs
 */

import React, { useState } from "react";
import {
  Book,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Layers,
  Printer,
  RotateCcw,
  Scissors,
  Sparkles,
  X,
} from "lucide-react";

export interface BookletFoldedModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  docTitle: string;
  trackLabel: string;
  school: string;
  prof: string;
  year: string;
  isFr?: boolean;
  onPrintBooklet: () => void;
  onNotify?: (type: "success" | "info" | "error", text: string) => void;
}

export const BookletFoldedModeModal: React.FC<BookletFoldedModeModalProps> = ({
  isOpen,
  onClose,
  docTitle,
  trackLabel,
  school,
  prof,
  year,
  isFr = false,
  onPrintBooklet,
  onNotify,
}) => {
  const [activeSheetSide, setActiveSheetSide] = useState<"FRONT" | "BACK">("FRONT");
  const [showFoldGuides, setShowFoldGuides] = useState<boolean>(true);
  const [showStapleMarks, setShowStapleMarks] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 no-print"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-teal-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  نمط الكتيب المطوي A4 إلى A5 (Mode Livret / Cahier d'exercices)
                </h2>
                <span className="text-[11px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-400/30">
                  A4 Landscape ➔ 2 × A5
                </span>
              </div>
              <p className="text-xs text-slate-300">
                طباعة اقتصادية عالية الكثافة لسلاسل التمارين، الدفاتر المنزلية وكراسات الدعم
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">معاينة وجه الورقة:</span>
            <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-slate-200 font-bold text-center">
              <button
                type="button"
                onClick={() => setActiveSheetSide("FRONT")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeSheetSide === "FRONT"
                    ? "bg-teal-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                الوجه الأمامي (صفحة 4 & صفحة 1)
              </button>
              <button
                type="button"
                onClick={() => setActiveSheetSide("BACK")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeSheetSide === "BACK"
                    ? "bg-teal-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                الوجه الخلفي (صفحة 2 & صفحة 3)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={showFoldGuides}
                onChange={(e) => setShowFoldGuides(e.target.checked)}
                className="rounded text-teal-700 w-3.5 h-3.5"
              />
              <span>إظهار خط الطي المركزي</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={showStapleMarks}
                onChange={(e) => setShowStapleMarks(e.target.checked)}
                className="rounded text-teal-700 w-3.5 h-3.5"
              />
              <span>علامات الدبابيس (Agrafes)</span>
            </label>
          </div>
        </div>

        {/* Virtual Booklet Preview (A4 Landscape) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-200 flex items-center justify-center">
          <div
            className="w-full max-w-4xl bg-white rounded-lg shadow-xl border border-slate-300 relative aspect-[297/210] flex overflow-hidden"
            dir="ltr"
          >
            {/* Left Page (A5) */}
            <div className="flex-1 p-5 border-r border-slate-200 relative flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <span className="font-mono text-[10px] text-slate-400">
                    {activeSheetSide === "FRONT" ? "PAGE 4 (Quatrième de couverture)" : "PAGE 2"}
                  </span>
                  <span className="font-bold text-slate-600 text-[10px]">
                    {school} - {trackLabel}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 text-sm">
                    {activeSheetSide === "FRONT"
                      ? "ملحق القواعد والنتائج الأساسية"
                      : "التمرين الثاني: دراسة الدوال والتأويل الهندسي"}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {activeSheetSide === "FRONT"
                      ? "ملاحظات الأستاذ، شبكة التقويم الذاتي للمتعلم، وروابط الدعم والمعالجة المرقمنة عبر رمز الاستجابة السريعة QR Code."
                      : "دراسة الفروع اللانهائية، تحديد نقط الانعطاف، وإنشاء المنحنى (C_f) في المعلم المتعامد الممنظم."}
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10px] space-y-1">
                    <div>lim f(x) = +inf quand x tend vers +inf</div>
                    <div>f'(x) = 2x - 3 + 1/(x+1)</div>
                  </div>
                </div>
              </div>
              <div className="text-center font-mono text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-2">
                - {activeSheetSide === "FRONT" ? "4" : "2"} -
              </div>
            </div>

            {/* Central Folding Crease & Staples */}
            {showFoldGuides && (
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 border-r-2 border-dashed border-teal-500/60 z-10 pointer-events-none flex flex-col justify-between py-6">
                {showStapleMarks && (
                  <>
                    <div className="w-2.5 h-6 -ml-1 rounded-sm bg-slate-800 shadow-xs border border-white" />
                    <div className="text-[9px] font-mono font-bold text-teal-800 bg-teal-100/90 px-1 py-0.5 rounded -ml-6 text-center">
                      خط الطي
                    </div>
                    <div className="w-2.5 h-6 -ml-1 rounded-sm bg-slate-800 shadow-xs border border-white" />
                  </>
                )}
              </div>
            )}

            {/* Right Page (A5) */}
            <div className="flex-1 p-5 relative flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <span className="font-bold text-slate-600 text-[10px]">
                    {year} | الأستاذ: {prof}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {activeSheetSide === "FRONT" ? "PAGE 1 (Couverture & Sujet)" : "PAGE 3"}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 text-sm">
                    {activeSheetSide === "FRONT"
                      ? docTitle || "سلسلة التمارين والدعم: الحساب التكاملي والدوال"
                      : "التمرين الثالث: المتتاليات العددية والتقارب"}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {activeSheetSide === "FRONT"
                      ? "كراسة موجهة للتلميذ تضم التمارين المرمزة حسب المهارات والكفايات، مصممة للطباعة المطوية لتوفير 50% من الورق."
                      : "البرهان بالترجع، دراسة الرتابة، واستعمال المتتالية المساعدة الهندسية لحساب النهاية."}
                  </p>
                  <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 font-mono text-[10px] space-y-1 text-teal-950">
                    <div>u(0) = 2,  u(n+1) = (2u(n) + 3)/(u(n) + 4)</div>
                    <div>Demontrer que u(n) &gt; 1 pour tout n.</div>
                  </div>
                </div>
              </div>
              <div className="text-center font-mono text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-2">
                - {activeSheetSide === "FRONT" ? "1" : "3"} -
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="text-slate-600 text-[11px]">
            <span className="font-bold text-slate-800">إرشادات الطباعة:</span> اختر طباعة بوجهين (Duplex) مع قلب الورقة على الحافة القصيرة (Retourner sur le bord court).
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrintBooklet}
              className="px-4 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكتيب A4/A5 الآن</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
