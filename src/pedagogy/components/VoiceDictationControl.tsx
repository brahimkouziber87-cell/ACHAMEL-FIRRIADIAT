import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Languages,
  Sparkles,
  Check,
  Trash2,
  Volume2,
  AlertCircle,
  CornerDownLeft,
  Wand2,
} from "lucide-react";

export type DictationLang = "ar-MA" | "fr-FR";

export type DictationTargetField =
  | "DOCUMENT_CURSOR"
  | "HEADER_INSTRUCTIONS"
  | "PEDAGOGICAL_NOTES"
  | "DOC_TITLE";

const SPOKEN_MATH_REPLACEMENTS: Array<{ pattern: RegExp; replacement: string }> = [
  // Arabic spoken math & pedagogical terms
  { pattern: /زائد ما لا نهاية|زائد مالانهاية/gi, replacement: "+∞" },
  { pattern: /ناقص ما لا نهاية|ناقص مالانهاية/gi, replacement: "-∞" },
  { pattern: /ما لا نهاية|مالانهاية/gi, replacement: "∞" },
  { pattern: /جذر مربع|الجذر المربع لـ?/gi, replacement: "√" },
  { pattern: /تكامل من|رمز التكامل|تكامل/gi, replacement: "∫" },
  { pattern: /مجموع من|رمز المجموع/gi, replacement: "∑" },
  { pattern: /ينتمي إلى|ينتمي الى/gi, replacement: "∈" },
  { pattern: /لا ينتمي إلى|لا ينتمي الى/gi, replacement: "∉" },
  { pattern: /مهما يكن|لكل/gi, replacement: "∀" },
  { pattern: /يوجد على الأقل/gi, replacement: "∃" },
  { pattern: /أكبر من أو يساوي|اكبر من او يساوي/gi, replacement: "≥" },
  { pattern: /أصغر من أو يساوي|اصغر من او يساوي/gi, replacement: "≤" },
  { pattern: /يخالف|لا يساوي/gi, replacement: "≠" },
  { pattern: /يستلزم/gi, replacement: "⇒" },
  { pattern: /يكافئ/gi, replacement: "⇔" },
  { pattern: /مجموعة الأعداد الحقيقية/gi, replacement: "ℝ" },
  { pattern: /مجموعة الأعداد العقدية/gi, replacement: "ℂ" },
  { pattern: /اللوغاريتم النبيري/gi, replacement: "ln(x)" },
  { pattern: /الدالة الأسية/gi, replacement: "eˣ" },
  { pattern: /إف بريم ل إكس|مشتقة الدالة إف/gi, replacement: "f'(x)" },

  // French spoken math & pedagogical terms
  { pattern: /\bplus l'infini\b/gi, replacement: "+∞" },
  { pattern: /\bmoins l'infini\b/gi, replacement: "-∞" },
  { pattern: /\bl'infini\b/gi, replacement: "∞" },
  { pattern: /\bracine carrée de\b|\bracine carrée\b/gi, replacement: "√" },
  { pattern: /\bintégrale de\b|\bintégrale\b/gi, replacement: "∫" },
  { pattern: /\bsomme de\b/gi, replacement: "∑" },
  { pattern: /\bappartient à\b/gi, replacement: "∈" },
  { pattern: /\bn'appartient pas à\b/gi, replacement: "∉" },
  { pattern: /\bpour tout\b|\bquel que soit\b/gi, replacement: "∀" },
  { pattern: /\bil existe\b/gi, replacement: "∃" },
  { pattern: /\bsupérieur ou égal à\b/gi, replacement: "≥" },
  { pattern: /\binférieur ou égal à\b/gi, replacement: "≤" },
  { pattern: /\bdifférent de\b/gi, replacement: "≠" },
  { pattern: /\bimplique\b/gi, replacement: "⇒" },
  { pattern: /\béquivaut à\b|\bsi et seulement si\b/gi, replacement: "⇔" },
  { pattern: /\bensemble des réels\b/gi, replacement: "ℝ" },
  { pattern: /\bensemble des complexes\b/gi, replacement: "ℂ" },
  { pattern: /\blogarithme népérien de x\b|\blogarithme népérien\b/gi, replacement: "ln(x)" },
  { pattern: /\bf prime de x\b|\bdérivée de f\b/gi, replacement: "f'(x)" },
  { pattern: /\bدمج شارة نصف نقطة\b|\bdemi point\b/gi, replacement: "[0.50 pt]" },
  { pattern: /\bنقطة واحدة\b|\bun point\b/gi, replacement: "[1.00 pt]" },
];

export function convertSpokenMathAndPedagogyTerms(
  input: string,
  enableSmartMath: boolean = true
): string {
  if (!input || !enableSmartMath) return input;
  let result = input;
  for (const rule of SPOKEN_MATH_REPLACEMENTS) {
    result = result.replace(rule.pattern, rule.replacement);
  }
  return result;
}

function getSpeechRecognitionConstructor(): any {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

export interface InlineVoiceDictationButtonProps {
  onTranscript: (text: string) => void;
  defaultLang?: DictationLang;
  title?: string;
  compact?: boolean;
  smartMathConversion?: boolean;
  className?: string;
}

export const InlineVoiceDictationButton: React.FC<
  InlineVoiceDictationButtonProps
> = ({
  onTranscript,
  defaultLang = "ar-MA",
  title = "إملاء صوتي مباشر عبر الميكروفون (Voice-to-Text)",
  compact = false,
  smartMathConversion = true,
  className = "",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<DictationLang>(defaultLang);
  const [interimText, setInterimText] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    setLang(defaultLang);
  }, [defaultLang]);

  const stopAudioMeter = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startAudioMeter = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 140) * 100)));
        rafRef.current = requestAnimationFrame(updateMeter);
      };
      rafRef.current = requestAnimationFrame(updateMeter);
    } catch {
      // SpeechRecognition will handle its own permission error if blocked
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    stopAudioMeter();
    setIsListening(false);
    setInterimText("");
  }, [stopAudioMeter]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const toggleListening = async () => {
    setErrorMsg(null);
    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setErrorMsg(
        lang === "fr-FR"
          ? "Navigateur non compatible avec la reconnaissance vocale Web Speech."
          : "المتصفح الحالي لا يدعم ميزة التعرف الصوتي المباشر (يرجى استخدام Chrome أو Edge)."
      );
      return;
    }

    try {
      await startAudioMeter();
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let finalChunk = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        if (finalChunk.trim()) {
          const processed = convertSpokenMathAndPedagogyTerms(
            finalChunk.trim(),
            smartMathConversion
          );
          onTranscriptRef.current(processed);
        }
        setInterimText(interim);
      };

      recognition.onerror = (event: any) => {
        const code = event?.error;
        if (code === "not-allowed" || code === "service-not-allowed") {
          setErrorMsg(
            lang === "fr-FR"
              ? "Accès au microphone refusé. Veuillez autoriser le microphone dans votre navigateur."
              : "تم رفض إذن الوصول إلى الميكروفون. يرجى السماح للمتصفح باستخدام الميكروفون."
          );
        } else if (code !== "aborted" && code !== "no-speech") {
          setErrorMsg(
            lang === "fr-FR"
              ? `Erreur microphone (${code})`
              : `تنبيه الميكروفون (${code})`
          );
        }
        stopListening();
      };

      recognition.onend = () => {
        stopAudioMeter();
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setErrorMsg(
        lang === "fr-FR"
          ? "Impossible de démarrer la dictée vocale."
          : "تعذر تشغيل الإملاء الصوتي عبر الميكروفون."
      );
      stopListening();
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 relative ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        title={`${title} (${lang === "ar-MA" ? "العربية" : "Français"})`}
        className={`inline-flex items-center justify-center gap-1 rounded-lg font-black transition cursor-pointer border ${
          compact ? "px-2 py-1 text-[10.5px]" : "px-2.5 py-1.5 text-xs"
        } ${
          isListening
            ? "bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-500/40 animate-pulse"
            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200"
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === "fr-FR" ? "Arrêter" : "إيقاف الإملاء"}</span>
            <span
              className="w-1.5 h-3 rounded-full bg-white/40 overflow-hidden inline-flex items-end"
              title="مستوى الصوت المباشر"
            >
              <span
                style={{ height: `${Math.max(20, audioLevel)}%` }}
                className="w-full bg-amber-300 transition-all duration-75"
              />
            </span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
            <span>{compact ? "إملاء صوتي" : "إملاء بالميكروفون"}</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          const nextLang: DictationLang = lang === "ar-MA" ? "fr-FR" : "ar-MA";
          setLang(nextLang);
          if (isListening) {
            stopListening();
          }
        }}
        title="تبديل لغة الإملاء الصوتي (العربية / Français)"
        className="px-1.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-mono text-[10px] font-bold transition cursor-pointer"
      >
        {lang === "ar-MA" ? "AR" : "FR"}
      </button>

      {isListening && interimText && (
        <div className="absolute bottom-full mb-1.5 left-0 z-40 max-w-xs bg-slate-950 text-cyan-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-cyan-500/40 shadow-lg whitespace-nowrap truncate pointer-events-none">
          🎙️ {interimText}...
        </div>
      )}

      {errorMsg && (
        <div className="absolute bottom-full mb-1.5 left-0 z-40 max-w-xs bg-rose-950 text-rose-100 text-[10.5px] font-bold px-2.5 py-1 rounded-lg border border-rose-500/50 shadow-lg flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export interface DocumentVoiceDictationStudioProps {
  isFr?: boolean;
  onInsertAtCursor: (text: string) => void;
  onAppendHeaderInstruction?: (text: string) => void;
  onAppendPedagogicalNote?: (text: string) => void;
  onUpdateDocTitle?: (text: string) => void;
  onEnsureInlineEditable?: () => void;
}

const QUICK_PEDAGOGICAL_VOICE_SNIPPETS = [
  {
    labelAr: "تعليمة الآلة الحاسبة",
    labelFr: "Calculatrice non programmable",
    textAr: "يُسمح باستعمال الآلة الحاسبة العلمية غير القابلة للبرمجة طبقاً للمذكرة 142-08.",
    textFr: "L'usage de la calculatrice scientifique non programmable est autorisé.",
  },
  {
    labelAr: "تعليمة تعليل الأجوبة",
    labelFr: "Rigueur & justification",
    textAr: "يجب تعليل جميع النتائج الرياضية بدقة، ويُؤخذ تنظيم الورقة بعين الاعتبار (0.50 ن).",
    textFr: "Toute réponse doit être soigneusement justifiée ; la présentation est notée sur 0,50 pt.",
  },
  {
    labelAr: "استمرارية المسألة",
    labelFr: "Admettre un résultat",
    textAr: "في حالة تعذر إثبات سؤال مرحلي، يُمكن للمترشح قبول نتيجته ومواصلة إنجاز التمرين.",
    textFr: "Le candidat peut admettre le résultat d'une question pour traiter la suite du problème.",
  },
];

export const DocumentVoiceDictationStudio: React.FC<
  DocumentVoiceDictationStudioProps
> = ({
  isFr = false,
  onInsertAtCursor,
  onAppendHeaderInstruction,
  onAppendPedagogicalNote,
  onUpdateDocTitle,
  onEnsureInlineEditable,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [dictationLang, setDictationLang] = useState<DictationLang>(
    isFr ? "fr-FR" : "ar-MA"
  );
  const [targetField, setTargetField] = useState<DictationTargetField>(
    "DOCUMENT_CURSOR"
  );
  const [smartMathEnabled, setSmartMathEnabled] = useState(true);
  const [autoStreamToTarget, setAutoStreamToTarget] = useState(true);
  const [draftTranscript, setDraftTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [statusNote, setStatusNote] = useState<{
    type: "info" | "error" | "success";
    text: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const dispatchTextToTarget = useCallback(
    (rawText: string) => {
      const cleaned = rawText.trim();
      if (!cleaned) return;
      if (targetField === "HEADER_INSTRUCTIONS" && onAppendHeaderInstruction) {
        onAppendHeaderInstruction(cleaned);
      } else if (targetField === "PEDAGOGICAL_NOTES" && onAppendPedagogicalNote) {
        onAppendPedagogicalNote(cleaned);
      } else if (targetField === "DOC_TITLE" && onUpdateDocTitle) {
        onUpdateDocTitle(cleaned);
      } else {
        onEnsureInlineEditable?.();
        onInsertAtCursor(cleaned + " ");
      }
    },
    [
      targetField,
      onAppendHeaderInstruction,
      onAppendPedagogicalNote,
      onUpdateDocTitle,
      onEnsureInlineEditable,
      onInsertAtCursor,
    ]
  );

  const stopAudioAnalyzer = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startAudioAnalyzer = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      const freqData = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = 0; i < freqData.length; i++) sum += freqData[i];
        const avg = sum / freqData.length;
        setAudioLevel(Math.min(100, Math.round((avg / 135) * 100)));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // handled by recognition.onerror
    }
  }, []);

  const stopDictation = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    stopAudioAnalyzer();
    setIsListening(false);
    setInterimTranscript("");
  }, [stopAudioAnalyzer]);

  useEffect(() => {
    return () => {
      stopDictation();
    };
  }, [stopDictation]);

  const handleToggleMicrophone = async () => {
    if (isListening) {
      stopDictation();
      setStatusNote({
        type: "info",
        text: isFr
          ? "Enregistrement vocal arrêté."
          : "تم إيقاف التسجيل الصوتي.",
      });
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setStatusNote({
        type: "error",
        text: isFr
          ? "La reconnaissance vocale Web Speech n'est pas prise en charge par ce navigateur (utilisez Chrome ou Edge). Vous pouvez toutefois saisir ou utiliser les modèles rapides ci-dessous."
          : "ميزة التعرف الصوتي المباشر غير مدعومة في هذا المتصفح (يُنصح بـ Chrome أو Edge). يمكنك تحرير النص أو استخدام القوالب السريعة أدناه.",
      });
      return;
    }

    try {
      await startAudioAnalyzer();
      const recognition = new SpeechRecognition();
      recognition.lang = dictationLang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusNote({
          type: "info",
          text:
            dictationLang === "fr-FR"
              ? "🎙️ Microphone actif — Dictez vos consignes ou formules mathématiques..."
              : "🎙️ الميكروفون نشط الآن — تحدث لتسجيل الملاحظات البيداغوجية أو تعليمات الفرض...",
        });
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let finalChunk = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += t + " ";
          } else {
            interim += t;
          }
        }

        if (finalChunk.trim()) {
          const converted = convertSpokenMathAndPedagogyTerms(
            finalChunk.trim(),
            smartMathEnabled
          );
          setDraftTranscript((prev) =>
            prev ? `${prev} ${converted}` : converted
          );
          if (autoStreamToTarget) {
            dispatchTextToTarget(converted);
          }
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        const errCode = event?.error;
        if (errCode === "not-allowed" || errCode === "service-not-allowed") {
          setStatusNote({
            type: "error",
            text: isFr
              ? "Accès au microphone refusé. Veuillez autoriser l'accès au microphone dans les paramètres du navigateur."
              : "تم حجب إذن الميكروفون. يرجى السماح للمتصفح بالوصول إلى الميكروفون أعلى شريط العنوان.",
          });
        } else if (errCode !== "aborted" && errCode !== "no-speech") {
          setStatusNote({
            type: "error",
            text: isFr
              ? `Erreur de reconnaissance vocale : ${errCode}`
              : `تنبيه أثناء التعرف الصوتي: ${errCode}`,
          });
        }
        stopDictation();
      };

      recognition.onend = () => {
        stopAudioAnalyzer();
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setStatusNote({
        type: "error",
        text: isFr
          ? "Impossible d'initialiser le microphone."
          : "تعذر تهيئة الميكروفون للإملاء الصوتي.",
      });
      stopDictation();
    }
  };

  return (
    <div className="rounded-xl bg-slate-950/90 border border-cyan-500/30 p-3 text-white space-y-2.5 shadow-inner">
      {/* الصف العلوي: زر الميكروفون، مؤشر الصوت، اختيار اللغة، واختيار حقل الإدراج */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMicrophone}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer border ${
              isListening
                ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-400 shadow-md shadow-rose-600/30"
                : "bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 text-slate-950 border-cyan-300 hover:brightness-105"
            }`}
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <MicOff className="w-4 h-4 shrink-0" />
                <span>
                  {isFr ? "Arrêter la dictée" : "إيقاف التسجيل الصوتي"}
                </span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 shrink-0" />
                <span>
                  {isFr
                    ? "Démarrer la dictée vocale (Mic)"
                    : "بدء الإملاء الصوتي بالميكروفون"}
                </span>
              </>
            )}
          </button>

          {/* مقياس مستوى الصوت المباشر (Live Audio Waveform Meter) */}
          {isListening && (
            <div
              className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-rose-500/40"
              title="مؤشر تردد الصوت المباشر من الميكروفون"
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <div className="flex items-end gap-0.5 h-3.5">
                {[0.4, 0.7, 1.0, 0.85, 0.55, 0.9, 0.6].map((factor, idx) => {
                  const barHeight = Math.max(
                    22,
                    Math.min(100, Math.round(audioLevel * factor))
                  );
                  return (
                    <span
                      key={idx}
                      style={{ height: `${barHeight}%` }}
                      className="w-1 rounded-full bg-gradient-to-t from-rose-500 via-amber-400 to-emerald-300 transition-all duration-75"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* اختيار لغة الإملاء الصوتي */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-[11px] font-bold">
            <Languages className="w-3.5 h-3.5 text-cyan-400 mx-1 shrink-0" />
            <button
              type="button"
              onClick={() => {
                setDictationLang("ar-MA");
                if (isListening) stopDictation();
              }}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                dictationLang === "ar-MA"
                  ? "bg-cyan-400 text-slate-950 font-black"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              العربية (AR)
            </button>
            <button
              type="button"
              onClick={() => {
                setDictationLang("fr-FR");
                if (isListening) stopDictation();
              }}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                dictationLang === "fr-FR"
                  ? "bg-cyan-400 text-slate-950 font-black"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Français (FR)
            </button>
          </div>
        </div>

        {/* وجهة الإدراج المباشر في المحرر */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <label className="flex items-center gap-1.5 text-slate-300 font-bold">
            <span>{isFr ? "Cible :" : "وجهة الإدراج:"}</span>
            <select
              value={targetField}
              onChange={(e) =>
                setTargetField(e.target.value as DictationTargetField)
              }
              className="bg-slate-900 text-cyan-200 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-cyan-400"
            >
              <option value="DOCUMENT_CURSOR">
                {isFr
                  ? "📄 Curseur dans la feuille A4 (Éditeur direct)"
                  : "📄 موضع المؤشر داخل ورقة الامتحان A4"}
              </option>
              <option value="HEADER_INSTRUCTIONS">
                {isFr
                  ? "📋 Consignes d'en-tête de l'épreuve"
                  : "📋 تعليمات وملاحظة ترويسة الفرض"}
              </option>
              <option value="PEDAGOGICAL_NOTES">
                {isFr
                  ? "💡 Notes didactiques & pédagogiques"
                  : "💡 التوجيهات والملاحظات البيداغوجية"}
              </option>
              <option value="DOC_TITLE">
                {isFr
                  ? "🏷️ Titre principal du document"
                  : "🏷️ العنوان الرئيسي للوثيقة"}
              </option>
            </select>
          </label>

          <label
            className="flex items-center gap-1.5 cursor-pointer text-amber-300 font-bold bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800"
            title="تحويل العبارات الرياضية المنطوقة مثل 'تكامل' أو 'جذر مربع' أو 'racine carrée' تلقائياً إلى رموز رياضية (∫, √, ∀, ∈, ∞)"
          >
            <input
              type="checkbox"
              checked={smartMathEnabled}
              onChange={(e) => setSmartMathEnabled(e.target.checked)}
              className="rounded accent-amber-400 w-3.5 h-3.5"
            />
            <Wand2 className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{isFr ? "Symboles Math Auto" : "تحويل الرموز الرياضية (∫ √ ∞)"}</span>
          </label>

          <label
            className="flex items-center gap-1.5 cursor-pointer text-emerald-300 font-bold bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800"
            title="إدراج الجمل المسجلة فوراً في الوثيقة بمجرد نطقها"
          >
            <input
              type="checkbox"
              checked={autoStreamToTarget}
              onChange={(e) => setAutoStreamToTarget(e.target.checked)}
              className="rounded accent-emerald-400 w-3.5 h-3.5"
            />
            <span>{isFr ? "Insertion directe" : "إدراج فوري أثناء النطق"}</span>
          </label>
        </div>
      </div>

      {/* حقل النص المفرغ بالصوت مع إمكانية التعديل والإدراج اليدوي */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={
              interimTranscript
                ? `${draftTranscript} ${interimTranscript}`.trim()
                : draftTranscript
            }
            onChange={(e) => setDraftTranscript(e.target.value)}
            placeholder={
              dictationLang === "fr-FR"
                ? "Parlez dans le microphone (ex: « Soit f une fonction définie sur ensemble des réels... ») ou saisissez ici..."
                : "تحدث في الميكروفون (مثال: « لتكن الدالة f المعرفة على مجموعة الأعداد الحقيقية... ») أو حرر النص هنا..."
            }
            className="w-full bg-slate-900/95 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={!draftTranscript.trim()}
            onClick={() => {
              dispatchTextToTarget(draftTranscript);
              setStatusNote({
                type: "success",
                text: isFr
                  ? "Texte dicté inséré dans le document avec succès !"
                  : "تم إدراج النص المسجل صوتياً في الوثيقة بنجاح!",
              });
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <CornerDownLeft className="w-3.5 h-3.5 shrink-0" />
            <span>{isFr ? "Insérer" : "إدراج في الوثيقة"}</span>
          </button>

          {draftTranscript && (
            <button
              type="button"
              onClick={() => setDraftTranscript("")}
              title={isFr ? "Effacer le texte" : "مسح النص المؤقت"}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* قوالب صوتية/تربوية سريعة الإدراج بضغطة واحدة */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/90 text-[10.5px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isFr ? "Consignes rapides :" : "تعليمات سريعة:"}</span>
          </span>
          {QUICK_PEDAGOGICAL_VOICE_SNIPPETS.map((snip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const txt = dictationLang === "fr-FR" ? snip.textFr : snip.textAr;
                setDraftTranscript((prev) => (prev ? `${prev} ${txt}` : txt));
                dispatchTextToTarget(txt);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-cyan-200 border border-slate-700/80 font-semibold transition cursor-pointer"
            >
              + {dictationLang === "fr-FR" ? snip.labelFr : snip.labelAr}
            </button>
          ))}
        </div>

        {statusNote && (
          <div
            className={`flex items-center gap-1 font-bold ${
              statusNote.type === "error"
                ? "text-rose-400"
                : statusNote.type === "success"
                ? "text-emerald-400"
                : "text-cyan-300"
            }`}
          >
            {statusNote.type === "success" ? (
              <Check className="w-3 h-3 shrink-0" />
            ) : (
              <AlertCircle className="w-3 h-3 shrink-0" />
            )}
            <span>{statusNote.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};
