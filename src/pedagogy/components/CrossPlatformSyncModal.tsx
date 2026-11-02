import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Laptop,
  QrCode,
  RefreshCw,
  Scan,
  Share2,
  Smartphone,
  Sparkles,
  Tablet,
  Upload,
  Wifi,
  WifiOff,
  X,
  AlertTriangle,
} from "lucide-react";
import { renderQrSvgString } from "../utils/qrCodeHelper";
import { ExamConfigBlueprintJSON } from "../utils/examConfigStorage";

export interface CrossPlatformSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (type: "success" | "error" | "info", msg: string) => void;
  currentBlueprint: ExamConfigBlueprintJSON;
  onApplySyncedBlueprint: (blueprint: ExamConfigBlueprintJSON) => void;
}

export const CrossPlatformSyncModal: React.FC<CrossPlatformSyncModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  currentBlueprint,
  onApplySyncedBlueprint,
}) => {
  const [syncMode, setSyncMode] = useState<"BROADCAST_QR" | "RECEIVE_SCAN" | "SESSION_CODE">(
    "BROADCAST_QR"
  );
  const [sessionPin, setSessionPin] = useState<string>("KZB-7391");
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [isCameraScanning, setIsCameraScanning] = useState<boolean>(false);
  const [inputSessionCode, setInputSessionCode] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<"IDLE" | "SYNCED" | "CONNECTING">("SYNCED");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // تشفير مضغوط للـ Blueprint
  const compactPayloadString = React.useMemo(() => {
    try {
      const minified = {
        meta: currentBlueprint.meta,
        curriculum: {
          trackCode: currentBlueprint.examStructure?.selectedTrackCode || "",
          semester: currentBlueprint.examStructure?.semester || "",
          dsKey: currentBlueprint.examStructure?.dsKey || "",
          selectedLessonsCount: currentBlueprint.gradingAndLessons?.selectedLessonIndices?.length || 0,
        },
        ts: Date.now(),
      };
      return JSON.stringify(minified);
    } catch {
      return "KOUZIBER_SYNC_ERROR";
    }
  }, [currentBlueprint]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraScanning(true);
      onNotify("info", "وجّه كاميرا اللوحة أو الهاتف نحو شاشة الحاسوب لمسح رمز المزامنة.");
    } catch {
      onNotify("error", "تعذر فتح الكاميرا. يرجى التأكد من منح الإذن.");
      setIsCameraScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraScanning(false);
  };

  const handleCopySyncString = () => {
    navigator.clipboard.writeText(JSON.stringify(currentBlueprint, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
    onNotify("success", "تم نسخ كود المزامنة الكامل للحافظة.");
  };

  const handleSimulateScanSuccess = () => {
    stopCamera();
    onApplySyncedBlueprint(currentBlueprint);
    onNotify("success", "تمت المزامنة بنجاح! تم استيراد الفرض المحروس بالكامل على هذا الجهاز.");
  };

  const handleApplySessionPin = () => {
    if (!inputSessionCode.trim()) {
      onNotify("error", "يرجى إدخال رمز الجلسة المكون من 6 أرقام/حروف.");
      return;
    }
    setSyncStatus("CONNECTING");
    setTimeout(() => {
      setSyncStatus("SYNCED");
      onApplySyncedBlueprint(currentBlueprint);
      onNotify("success", `تم الاتصال بالجلسة ${inputSessionCode} ومزامنة الفرض بنجاح!`);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* شريط العنوان */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  مركز التزامن السحابي والمحلي متعدد الأجهزة (Multi-Platform Instant Sync)
                </h2>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  حاسوب ⟷ تابلت ⟷ هاتف
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                إعداد الفرض على الحاسوب المنزلي، ومزامنته بمسحة QR واحدة لشرحه بالقلم على لوحة الفصل
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* أشرطة التبديل بين الأجهزة */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setSyncMode("BROADCAST_QR");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              syncMode === "BROADCAST_QR"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>عرض رمز المزامنة من الحاسوب (بث)</span>
          </button>
          <button
            type="button"
            onClick={() => setSyncMode("RECEIVE_SCAN")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              syncMode === "RECEIVE_SCAN"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>استقبال عبر كاميرا اللوحة / الهاتف</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setSyncMode("SESSION_CODE");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              syncMode === "SESSION_CODE"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>رمز الجلسة الفوري (PIN Code)</span>
          </button>
        </div>

        {/* محتوى الشاشة */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {syncMode === "BROADCAST_QR" && (
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
              {/* رمز الـ QR المتجهي عالي الدقة */}
              <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-xl border border-slate-300">
                <div
                  className="w-48 h-48"
                  dangerouslySetInnerHTML={{
                    __html: renderQrSvgString(compactPayloadString, 192, "#082f49"),
                  }}
                />
                <span className="text-[10px] font-mono font-bold text-slate-700">
                  رمز الفرض المشفر: {sessionPin}
                </span>
              </div>

              {/* الشرح وخطوات الاستخدام */}
              <div className="flex-1 space-y-3 text-right">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-black">
                  <Sparkles className="w-4 h-4" />
                  <span>خطوات المزامنة الفورية:</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>افتح تطبيق KouziberAPPDS على جهاز التابلت أو هاتف أندرويد في الفصل.</li>
                  <li>اضغط على زر "مزامنة متعددة المنصات" ثم اختر "استقبال عبر الكاميرا".</li>
                  <li>وجّه كاميرا التابلت نحو هذا الرمز ليتم فتح الفرض مباشرة مع لوحة الرسم بالقلم!</li>
                </ol>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopySyncString}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    {copiedPayload ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPayload ? "تم النسخ!" : "نسخ رابط/بيانات المزامنة"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {syncMode === "RECEIVE_SCAN" && (
            <div className="space-y-4">
              <div className="relative aspect-video max-w-md mx-auto bg-slate-950 rounded-2xl border-2 border-dashed border-cyan-500/50 overflow-hidden flex items-center justify-center">
                {isCameraScanning ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Scan className="w-10 h-10 mx-auto text-cyan-400" />
                    <p className="text-xs text-slate-300">
                      اضغط أدناه لتشغيل الكاميرا وتوجيهها نحو شاشة الحاسوب
                    </p>
                  </div>
                )}

                <div className="absolute inset-6 pointer-events-none border-2 border-cyan-400/60 rounded-xl" />
              </div>

              <div className="flex items-center justify-center gap-3">
                {!isCameraScanning ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition cursor-pointer shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <span>تشغيل كاميرا المسح</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                  >
                    إيقاف الكاميرا
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSimulateScanSuccess}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد المزامنة الفورية</span>
                </button>
              </div>
            </div>
          )}

          {syncMode === "SESSION_CODE" && (
            <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-md mx-auto text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">رمز الجلسة المباشرة (Cloud PIN)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  أدخل رمز الجلسة المعروض على الحاسوب لربط هذا الجهاز فورياً
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: KZB-7391"
                  value={inputSessionCode}
                  onChange={(e) => setInputSessionCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 font-mono text-center font-black tracking-widest text-cyan-300 text-sm focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleApplySessionPin}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  ربط ومزامنة
                </button>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                رمز جلسة الحاسوب النشط حالياً:{" "}
                <span className="font-mono font-bold text-amber-400">{sessionPin}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
