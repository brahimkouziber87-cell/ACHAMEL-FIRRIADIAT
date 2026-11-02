import React, { useState } from "react";
import {
  X,
  Code2,
  Play,
  Check,
  Copy,
  Terminal,
  BookOpen,
  Sparkles,
  FileCode,
  Layers,
  HelpCircle,
  PlusCircle,
  Download,
} from "lucide-react";
import {
  PYTHON_ALGORITHMS_BANK,
  PythonAlgorithmPreset,
  executeSimulatedPython,
} from "../data/pythonAlgorithms";

export interface PythonAlgorithmLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertAlgorithmIntoDoc?: (preset: PythonAlgorithmPreset) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}

export const PythonAlgorithmLabModal: React.FC<PythonAlgorithmLabModalProps> = ({
  isOpen,
  onClose,
  onInsertAlgorithmIntoDoc,
  onNotify,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    PYTHON_ALGORITHMS_BANK[0].id
  );
  const [activeTab, setActiveTab] = useState<"CODE" | "SIMULATION" | "QUESTIONS" | "LATEX_TYPST">("CODE");
  const [inputsMap, setInputsMap] = useState<Record<string, number | string>>(
    PYTHON_ALGORITHMS_BANK[0].sampleInputs
  );
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPreset =
    PYTHON_ALGORITHMS_BANK.find((p) => p.id === selectedPresetId) ||
    PYTHON_ALGORITHMS_BANK[0];

  const handleSelectPreset = (preset: PythonAlgorithmPreset) => {
    setSelectedPresetId(preset.id);
    setInputsMap(preset.sampleInputs);
    setSimulationLogs([]);
    setSimulationResult(null);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = executeSimulatedPython(currentPreset.id, inputsMap);
      setSimulationLogs(res.logs);
      setSimulationResult(res.resultSummary);
      setIsRunning(false);
      onNotify("success", "تم تشغيل الخوارزمية بنجاح والحصول على النتائج الرياضية!");
    }, 150);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    onNotify("info", "تم نسخ الكود المصدري إلى الحافظة!");
  };

  const handleInsert = () => {
    if (onInsertAlgorithmIntoDoc) {
      onInsertAlgorithmIntoDoc(currentPreset);
      onNotify("success", `تم إدراج خوارزمية "${currentPreset.titleAr}" في الورقة الحالية بنجاح!`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* الترويسة العلوية */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-mono text-xl font-black shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  مختبر بايثون الرياضياتي
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Python Algorithms Lab (AEFE & Maroc)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                خوارزميات الرياضيات والبرمجة بالسلك الثانوي
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* شريط اختيار الخوارزمية حسب الموضوع */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 shrink-0 flex items-center gap-2 overflow-x-auto studio-scroll">
          <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>النماذج المقررة :</span>
          </span>
          {PYTHON_ALGORITHMS_BANK.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
                }`}
              >
                <span>{preset.titleAr.split("(")[0]}</span>
                <span className="text-[10px] font-mono opacity-80">({preset.categoryAr})</span>
              </button>
            );
          })}
        </div>

        {/* جسم النافذة الرئيسي */}
        <div className="flex-1 overflow-y-auto studio-scroll p-4 sm:p-5 space-y-4">
          {/* بطاقة تفاصيل الخوارزمية المختارة */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-emerald-950">
                    {currentPreset.titleAr}
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                    {currentPreset.levelBadgeAr}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-600">
                  {currentPreset.titleFr}
                </div>
              </div>

              {onInsertAlgorithmIntoDoc && (
                <button
                  type="button"
                  onClick={handleInsert}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إدراج في ورقة الفرض / السلسلة</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-emerald-900 font-bold">الهدف الديداكتيكي : </strong>
              {currentPreset.objectiveAr}
            </p>
          </div>

          {/* تبويبات العرض (كود بايثون، المحاكاة والتجريب، أسئلة التلاميذ، LaTeX و Typst) */}
          <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("CODE")}
              className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "CODE"
                  ? "border-emerald-600 text-emerald-700 font-black"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>كود بايثون المصدري</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("SIMULATION")}
              className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "SIMULATION"
                  ? "border-emerald-600 text-emerald-700 font-black"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Play className="w-4 h-4" />
              <span>التشغيل والمحاكاة التفاعلية</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("QUESTIONS")}
              className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "QUESTIONS"
                  ? "border-emerald-600 text-emerald-700 font-black"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>أسئلة التقويم الموجهة للتلاميذ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("LATEX_TYPST")}
              className={`pb-2 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "LATEX_TYPST"
                  ? "border-emerald-600 text-emerald-700 font-black"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>أكواد LaTeX و Typst الجاهزة</span>
            </button>
          </div>

          {/* محتوى التبويب الأول: كود بايثون */}
          {activeTab === "CODE" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-600 font-bold">
                  script_python.py (Python 3.10+)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(currentPreset.pythonCode)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "تم النسخ!" : "نسخ الكود"}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-emerald-300 p-4 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed border border-slate-800" dir="ltr">
                <pre>{currentPreset.pythonCode}</pre>
              </div>
            </div>
          )}

          {/* محتوى التبويب الثاني: التجريب والمحاكاة التفاعلية */}
          {activeTab === "SIMULATION" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-700" />
                  <span>معاملات الدخل للتجربة (Paramètres d'entrée) :</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(currentPreset.sampleInputs).map(([k, v]) => (
                    <div key={k} className="space-y-1">
                      <label className="text-xs font-mono font-bold text-slate-700 block">
                        {k} :
                      </label>
                      <input
                        type="text"
                        value={inputsMap[k] ?? v}
                        onChange={(e) =>
                          setInputsMap({ ...inputsMap, [k]: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs bg-white text-slate-900 focus:outline-emerald-600"
                        dir="ltr"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    القيمة المتوقعة: {currentPreset.expectedOutputFr}
                  </span>
                  <button
                    type="button"
                    onClick={handleRunSimulation}
                    disabled={isRunning}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isRunning ? "جاري الحساب..." : "تشغيل ومحاكاة الكود الآن"}</span>
                  </button>
                </div>
              </div>

              {simulationResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 font-bold text-xs flex items-center justify-between">
                  <span>النتيجة النهائية : {simulationResult}</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Succès
                  </span>
                </div>
              )}

              {simulationLogs.length > 0 && (
                <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-1 max-h-56 overflow-y-auto studio-scroll border border-slate-800" dir="ltr">
                  <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1 mb-2">
                    --- Output Console & Log Trace ---
                  </div>
                  {simulationLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* محتوى التبويب الثالث: أسئلة التقويم الموجهة للتلاميذ */}
          {activeTab === "QUESTIONS" && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                💡 هذه الأسئلة مصممة للدمج المباشر أسفل كود بايثون في الفرض المحروس أو السلسلة لقياس كفايات البحث والنمذجة والتبرير.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* باللغة العربية */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-xs text-emerald-900 border-b border-slate-100 pb-1">
                    صيغة الأسئلة باللغة العربية :
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-800 leading-relaxed">
                    {currentPreset.pedagogicalQuestionsAr.map((q, idx) => (
                      <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* باللغة الفرنسية */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2" dir="ltr">
                  <h5 className="font-bold text-xs text-emerald-900 border-b border-slate-100 pb-1">
                    Questions en français (Programme AEFE / Lycée) :
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-800 leading-relaxed">
                    {currentPreset.pedagogicalQuestionsFr.map((q, idx) => (
                      <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* محتوى التبويب الرابع: كود LaTeX و Typst */}
          {activeTab === "LATEX_TYPST" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-900 font-mono">
                    LaTeX / XeLaTeX (tcolorbox + listings)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(currentPreset.latexCode)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition cursor-pointer"
                  >
                    نسخ كود LaTeX
                  </button>
                </div>
                <div className="bg-slate-900 text-indigo-300 p-3 rounded-2xl font-mono text-xs overflow-x-auto" dir="ltr">
                  <pre>{currentPreset.latexCode}</pre>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-900 font-mono">
                    Typst 0.12+ (raw code block)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(currentPreset.typstCode)}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition cursor-pointer"
                  >
                    نسخ كود Typst
                  </button>
                </div>
                <div className="bg-slate-900 text-teal-300 p-3 rounded-2xl font-mono text-xs overflow-x-auto" dir="ltr">
                  <pre>{currentPreset.typstCode}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* التذييل الإرشادي */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>متوافق تماماً مع توجيهات إدماج المعلوميات في تدريس الرياضيات (TICE & Python).</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
