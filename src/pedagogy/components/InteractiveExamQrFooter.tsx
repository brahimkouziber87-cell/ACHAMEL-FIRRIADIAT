import React, { useMemo, useState } from "react";
import QRCode from "qrcode";
import { QrCode, ExternalLink, Copy, Check, EyeOff, Smartphone, Sparkles, ShieldCheck } from "lucide-react";

export interface InteractiveExamQrFooterProps {
  url: string;
  docLang: "AR" | "FR";
  trackTitleAr: string;
  trackTitleFr: string;
  trackCode: string;
  semester: "S1" | "S2";
  dsNumber: string;
  examModel: "A" | "B";
  durationAr: string;
  durationFr: string;
  n1: number;
  n2: number;
  n3: number;
  onOpenInteractiveQuiz?: () => void;
  onToggleVisibility?: () => void;
}

export const InteractiveExamQrFooter: React.FC<InteractiveExamQrFooterProps> = ({
  url,
  docLang,
  trackTitleAr,
  trackTitleFr,
  trackCode,
  semester,
  dsNumber,
  examModel,
  durationAr,
  durationFr,
  n1,
  n2,
  n3,
  onOpenInteractiveQuiz,
  onToggleVisibility,
}) => {
  const [copied, setCopied] = useState(false);
  const isAr = docLang === "AR";

  // Synchronously generate ISO/IEC 18004 QR Code matrix for crisp vector SVG rendering (zero async delay during PDF capture)
  const qrMatrix = useMemo(() => {
    try {
      const qr = QRCode.create(url || "https://men.gov.ma", {
        errorCorrectionLevel: "M",
      });
      const size = qr.modules.size;
      const data = qr.modules.data;
      const cells: { x: number; y: number }[] = [];
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (data[y * size + x]) {
            cells.push({ x, y });
          }
        }
      }
      return { size, cells };
    } catch {
      return { size: 21, cells: [] };
    }
  }, [url]);

  // Deterministic short verification PIN derived from exam config
  const verificationPin = useMemo(() => {
    const raw = `${trackCode}-${semester}-DS${dsNumber}-${examModel}-${n1}-${n2}-${n3}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(4, "0").slice(0, 4);
    return `M142-${semester}D${dsNumber}-${examModel}-${hex}`;
  }, [trackCode, semester, dsNumber, examModel, n1, n2, n3]);

  const handleCopyUrl = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const margin = 2;
  const viewBoxSize = qrMatrix.size + margin * 2;

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="avoid-break mt-6 pt-3 border-t-2 border-dashed border-slate-300 text-slate-900 select-none"
    >
      <div className="border-2 border-slate-900 rounded-xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* QR Code Vector Box */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div
              className="relative bg-white p-2 rounded-lg border-2 border-slate-900 shadow-sm flex flex-col items-center justify-center"
              title={isAr ? "امسح رمز الاستجابة السريعة لفتح النسخة التفاعلية للفرض" : "Scannez le QR Code pour ouvrir la version interactive du devoir"}
            >
              <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                width="92"
                height="92"
                shapeRendering="crispEdges"
                className="block"
                aria-label="QR Code Interactive Exam"
              >
                <rect x="0" y="0" width={viewBoxSize} height={viewBoxSize} fill="#ffffff" />
                {qrMatrix.cells.map((cell, idx) => (
                  <rect
                    key={idx}
                    x={cell.x + margin}
                    y={cell.y + margin}
                    width={1}
                    height={1}
                    fill="#0f172a"
                  />
                ))}
              </svg>
              <span className="mt-1 text-[8px] font-mono font-black tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                {verificationPin}
              </span>
            </div>

            {/* Primary Info & Instructions */}
            <div className={`space-y-1 ${isAr ? "text-right" : "text-left"}`}>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-black tracking-wide">
                  <QrCode className="w-3 h-3 text-amber-400" />
                  {isAr ? "النسخة التفاعلية الرقمية للفرض (Online Quiz)" : "Version Interactive en Ligne (Quiz Numérique)"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-300 text-[9px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-indigo-700" />
                  {isAr ? "المذكرة الوزارية 142-08" : "Note Ministérielle 142-08"}
                </span>
              </div>

              <p className="text-[11px] font-bold text-slate-800 leading-snug max-w-xl">
                {isAr
                  ? "امسح رمز QR بكاميرا الهاتف أو اللوحة اللمسية للولوج المباشر إلى النسخة التفاعلية لهذا الفرض المحروس وإنجازه رقمياً مع التصحيح الآلي الفوري والتغذية الراجعة الديداكتيكية."
                  : "Scannez ce code QR avec votre smartphone ou tablette pour accéder directement à la version interactive en ligne de ce devoir surveillé avec auto-correction immédiate et bilan diagnostique."}
              </p>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[9.5px] font-bold text-slate-700">
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">
                  {isAr ? trackTitleAr : trackTitleFr}
                </span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">
                  {isAr
                    ? `الدورة ${semester === "S1" ? "1" : "2"} • الفرض المحروس رقم ${dsNumber} (نموذج ${examModel})`
                    : `Semestre ${semester === "S1" ? "1" : "2"} • Devoir Surveillé N°${dsNumber} (Sujet ${examModel})`}
                </span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">
                  {isAr ? `المدة: ${durationAr}` : `Durée : ${durationFr}`}
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded font-mono">
                  N1:{n1}% | N2:{n2}% | N3:{n3}%
                </span>
              </div>
            </div>
          </div>

          {/* Right/Left Side: Direct Link + Interactive Preview Controls (.no-print) */}
          <div className="flex flex-col items-stretch sm:items-end justify-between gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
            <div className={`text-[9px] text-slate-600 font-mono bg-slate-100/90 border border-slate-300 rounded-lg px-2.5 py-1.5 max-w-[250px] truncate ${isAr ? "text-left" : "text-right"}`} dir="ltr">
              <div className="flex items-center gap-1 text-[8.5px] font-sans font-bold text-slate-500 mb-0.5">
                <Smartphone className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                <span>{isAr ? "رابط الولوج المباشر للتلميذ(ة):" : "Lien d'accès direct élève :"}</span>
              </div>
              <span className="text-slate-800 font-semibold">{url}</span>
            </div>

            {/* Interactive Controls - Hidden in PDF & Print via .no-print */}
            <div className="no-print flex flex-wrap items-center gap-1.5">
              {onOpenInteractiveQuiz && (
                <button
                  type="button"
                  onClick={onOpenInteractiveQuiz}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                  title={isAr ? "معاينة وتجربة الاختبار التفاعلي الآن" : "Tester le quiz interactif maintenant"}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAr ? "تجربة النسخة التفاعلية" : "Lancer le Quiz"}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                title={isAr ? "نسخ رابط الاختبار التفاعلي لمشاركته مع التلاميذ" : "Copier le lien du devoir interactif"}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>{copied ? (isAr ? "تم النسخ!" : "Copié !") : (isAr ? "نسخ الرابط" : "Copier")}</span>
              </button>

              {onToggleVisibility && (
                <button
                  type="button"
                  onClick={onToggleVisibility}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-200 text-[10px] font-bold transition-colors cursor-pointer"
                  title={isAr ? "إخفاء صندوق رمز QR من أسفل الوثيقة" : "Masquer le bloc QR du bas du document"}
                >
                  <EyeOff className="w-3 h-3" />
                  <span>{isAr ? "إخفاء" : "Masquer"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
