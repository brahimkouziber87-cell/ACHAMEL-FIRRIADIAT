/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * مولد ومدير رمز الاستجابة السريعة التفاعلي للدعم والمعالجة التدريجية
 * Portail QR Code Interactif d'Aide & Remédiation Pédagogique
 */

import React, { useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  QrCode,
  Smartphone,
  Sparkles,
  Video,
  X,
} from "lucide-react";

export interface InteractiveQrRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle: string;
  trackLabel: string;
  isFr?: boolean;
  onNotify?: (type: "success" | "info" | "error", text: string) => void;
}

export const InteractiveQrRemediationModal: React.FC<InteractiveQrRemediationModalProps> = ({
  isOpen,
  onClose,
  examTitle,
  trackLabel,
  isFr = false,
  onNotify,
}) => {
  const [selectedExerciseNum, setSelectedExerciseNum] = useState<number>(1);
  const [activeHintLevel, setActiveHintLevel] = useState<1 | 2 | 3>(1);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Generate a mock interactive remediation link
  const samplePortalUrl = `https://achamel-maths.ma/remediation?exam=${encodeURIComponent(
    examTitle
  )}&exo=${selectedExerciseNum}`;

  const hintsData = [
    {
      exo: 1,
      titleAr: "التمرين 1: النهايات والاتصال وتطبيقات مبرهنة القيم الوسيطية",
      titleFr: "Exercice 1: Limites, continuité et T.V.I",
      hint1Ar: "احسب النهاية بالضرب في المرافق الجبري بسطاً ومقاماً لإزالة الشكل غير المحدد [0/0].",
      hint1Fr: "Multiplier par l'expression conjuguée au numérateur et au dénominateur.",
      hint2Ar: "لإثبات وحدانية الحل في المجال ]0, 1[ تأكد من الرتابة قطعا وحساب $f(0) \\times f(1) < 0$.",
      hint2Fr: "Vérifier la stricte monotonie de la fonction et la condition $f(a)f(b) < 0$.",
      hint3Ar: "الحل المفصل وعناصر الإجابة الرسمية متوفرة في كبسولة الفيديو البيداغوجية المرفقة.",
      hint3Fr: "La solution détaillée est disponible dans la capsule vidéo interactive.",
    },
    {
      exo: 2,
      titleAr: "التمرين 2: المتتاليات العددية والتقارب",
      titleFr: "Exercice 2: Suites numériques et convergence",
      hint1Ar: "في البرهان بالترجع: احسب الفرق $u_{n+1} - 1 = \\frac{u_n - 1}{u_n + 4}$ واستغل الفرضية $u_n > 1$.",
      hint1Fr: "Pour la récurrence: factoriser $u_{n+1} - 1$ et appliquer l'hypothèse.",
      hint2Ar: "المتتالية المساعدة هندسية: احسب نسبة $v_{n+1} / v_n$ لتحديد الأساس $q = 1/5$.",
      hint2Fr: "Montrer que $v_{n+1} = \\frac{1}{5}v_n$ pour établir la nature géométrique.",
      hint3Ar: "بما أن الأساس $|q| < 1$ فإن نهاية $v_n$ هي 0 ومنه استنتج نهاية $u_n$.",
      hint3Fr: "Comme $|q| < 1$, $\\lim v_n = 0$, d'où $\\lim u_n = 1$.",
    },
    {
      exo: 3,
      titleAr: "التمرين 3: الأعداد العقدية والتحويلات الهندسية",
      titleFr: "Exercice 3: Nombres complexes et géométrie",
      hint1Ar: "لحساب المعيار والعمدة: اكتب $z$ على شكل $r(\\cos\\theta + i\\sin\\theta)$ بتحديد $r = \\sqrt{a^2+b^2}$.",
      hint1Fr: "Calculer le module $|z| = \\sqrt{a^2+b^2}$ puis factoriser pour identifier $\\theta$.",
      hint2Ar: "لحساب النسبة $\\frac{c-a}{b-a}$ اضرب في مرافق المقام واستنتج المعيار والزاوية الموجهة.",
      hint2Fr: "Calculer le quotient et vérifier que le module vaut 1 et l'argument $\\pi/3$.",
      hint3Ar: "المثلث متساوي الأضلاع لأن قياس أضلاعه متساوية والزاوية $\\pi/3$.",
      hint3Fr: "Le triangle est équilatéral direct.",
    },
  ];

  const currentHint = hintsData.find((h) => h.exo === selectedExerciseNum) || hintsData[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(samplePortalUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      onNotify?.("success", "تم نسخ رابط الدعم التفاعلي بنجاح!");
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 no-print"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  بوابة QR Code التفاعلية للدعم والمعالجة البيداغوجية المتدرجة
                </h2>
                <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Interactive Hint Scanner
                </span>
              </div>
              <p className="text-xs text-slate-300">
                رمز استجابة سريعة مطبوع على ورقة التلميذ يفتح تلميحات ذكية غير كاشفة للحل الكامل
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

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Mobile phone scanner simulator */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-100 p-4 rounded-2xl border border-slate-200">
            <div className="w-56 bg-slate-900 rounded-3xl p-3 shadow-2xl border-4 border-slate-800 flex flex-col items-center text-center">
              <div className="w-16 h-1 rounded-full bg-slate-700 mb-3" />
              <div className="bg-white p-3 rounded-2xl shadow-inner w-full flex flex-col items-center space-y-2">
                {/* Simulated QR Code SVG */}
                <div className="w-32 h-32 bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white relative">
                  <QrCode className="w-28 h-28 text-white" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white font-mono text-[9px] font-black shadow-xs">
                      ∑
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-600">
                  امسح بهاتفك للوصول للمساعدة
                </div>
              </div>
              <div className="text-white text-[11px] font-bold mt-3 space-y-0.5">
                <div>منصة الدعم الذاتي</div>
                <div className="text-emerald-400 text-[10px]">{trackLabel}</div>
              </div>
            </div>
          </div>

          {/* Interactive Hint Preview Drawer */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-black text-xs text-slate-800">
                  اختر التمرين المستهدف بالدعم:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setSelectedExerciseNum(num);
                        setActiveHintLevel(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedExerciseNum === num
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      تمرين {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900">
                  {isFr ? currentHint.titleFr : currentHint.titleAr}
                </h4>
              </div>

              {/* Progressive Hint Stages */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  مستويات التلميح البيداغوجي المتدرج:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold text-center">
                  <button
                    type="button"
                    onClick={() => setActiveHintLevel(1)}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      activeHintLevel === 1
                        ? "bg-sky-50 border-sky-400 text-sky-950 ring-1 ring-sky-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    💡 التلميح 1: الفكرة
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHintLevel(2)}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      activeHintLevel === 2
                        ? "bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🔍 التلميح 2: الطريقة
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHintLevel(3)}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      activeHintLevel === 3
                        ? "bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🎬 التلميح 3: الحل
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif">
                  {activeHintLevel === 1 && (
                    <div className="space-y-1">
                      <span className="font-bold text-sky-900 block font-sans">
                        التلميح الأول (توجيه عام دون كشف الحل):
                      </span>
                      <p>{isFr ? currentHint.hint1Fr : currentHint.hint1Ar}</p>
                    </div>
                  )}
                  {activeHintLevel === 2 && (
                    <div className="space-y-1">
                      <span className="font-bold text-amber-900 block font-sans">
                        التلميح الثاني (التذكير بالخاصية أو المبرهنة المناسبة):
                      </span>
                      <p>{isFr ? currentHint.hint2Fr : currentHint.hint2Ar}</p>
                    </div>
                  )}
                  {activeHintLevel === 3 && (
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-900 block font-sans">
                        التلميح الثالث (رابط الكبسولة التعليمية المصورة):
                      </span>
                      <p>{isFr ? currentHint.hint3Fr : currentHint.hint3Ar}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Link Copy */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 text-xs">
              <span className="font-mono text-[11px] text-slate-600 truncate max-w-[260px]" dir="ltr">
                {samplePortalUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? "تم النسخ" : "نسخ الرابط"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">
            يُطبع الرمز تلقائياً في ترويسة أو ذيل ورقة الفرض المحروس والسلاسل
          </div>
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
  );
};
