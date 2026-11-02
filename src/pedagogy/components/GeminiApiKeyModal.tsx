import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
  Zap,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import {
  getClientGeminiApiKey,
  setClientGeminiApiKey,
  testGeminiApiKey,
} from "../services/geminiClient";

export interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessActivated?: () => void;
  onUseBuiltinFallback?: () => void;
  onNotify?: (type: "success" | "error" | "info", msg: string) => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSuccessActivated,
  onUseBuiltinFallback,
  onNotify,
}) => {
  const [keyInput, setKeyInput] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existing = getClientGeminiApiKey();
      if (existing) {
        setKeyInput(existing);
      }
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndActivate = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setTestResult({
        success: false,
        message: "يرجى لصق أو كتابة مفتاح Google Gemini API أولاً.",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testGeminiApiKey(trimmed);
      setTestResult(res);

      if (res.success) {
        setClientGeminiApiKey(trimmed);
        onNotify?.("success", "تم تفعيل الذكاء الاصطناعي Google Gemini بنجاح!");
        setTimeout(() => {
          onClose();
          onSuccessActivated?.();
        }, 800);
      } else {
        onNotify?.("error", res.message);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setKeyInput(text.trim());
      }
    } catch {
      // ignore clipboard permission error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 text-cyan-300">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <span>تفعيل محرك الذكاء الاصطناعي Google Gemini</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  مجاني 100%
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                يلزم مفتاح API مجاني للربط مع خوادم Google الذكية وتوليد التمارين والحلول
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Explanation Alert */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-700/60 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-black text-cyan-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>لماذا يتطلب التطبيق مفتاح API رغم وجود اتصال بالإنترنت؟</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              محركات الذكاء الاصطناعي (مثل Google Gemini) هي خدمات سحابية متقدمة تتطلب مصادقة حساب المطور لتقديم إجابات مخصصة لكل أستاذ. تقدم شركة Google هذه الخدمة مجاناً بدون أي اشتراك.
            </p>
          </div>

          {/* Quick Steps */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="font-black text-slate-200">خطوات الحصول على المفتاح المجاني (30 ثانية):</div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px]">
              <li>
                افتح منصة{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 font-bold hover:underline"
                >
                  <span>Google AI Studio</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>سجل الدخول بحسابك في Google واضغط على «Create API key».</li>
              <li>انسخ المفتاح (يبدأ بـ <code className="font-mono text-amber-300">AIzaSy...</code>) وألصقه في الخانة أسفله.</li>
            </ol>
          </div>

          {/* Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>مفتاح Gemini API:</span>
              </span>
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold transition cursor-pointer"
              >
                لصق من الحافظة
              </button>
            </label>

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                testResult.success
                  ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300"
                  : "bg-rose-950/80 border border-rose-500/50 text-rose-300"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onUseBuiltinFallback?.();
            }}
            className="text-xs text-slate-400 hover:text-slate-200 font-bold transition cursor-pointer"
          >
            المتابعة بالمحرك التربوي المدمج (بدون مفتاح)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAndActivate}
              disabled={isTesting || !keyInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs transition shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isTesting ? "جاري الفحص والتفعيل..." : "حفظ وتفعيل التوليد الذكي"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
