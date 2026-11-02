/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * نافذة بنك التمارين البيداغوجي المرمز حسب الكفايات ومستويات بلوم
 * Banque d'Exercices Normalisée par Compétences (Taxonomie de Bloom N1/N2/N3)
 */

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Filter,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  PlusCircle,
  Search,
  Sparkles,
  Star,
  Timer,
  X,
} from "lucide-react";
import {
  BloomTaxonomyLevel,
  COMPETENCY_QUESTION_BANK,
  CompetencyExerciseItem,
  MathDomain,
} from "../data/competencyQuestionBank";
import { MathText } from "./MathRenderer";

export interface CompetencyQuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertExercise: (exercise: CompetencyExerciseItem) => void;
  currentTrackCode?: string;
  isFr?: boolean;
  onNotify?: (type: "success" | "info" | "error", text: string) => void;
}

export const CompetencyQuestionBankModal: React.FC<CompetencyQuestionBankModalProps> = ({
  isOpen,
  onClose,
  onInsertExercise,
  currentTrackCode = "2BAC_PC",
  isFr = false,
  onNotify,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedBloom, setSelectedBloom] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | "ALL">("ALL");
  const [activeExerciseId, setActiveExerciseId] = useState<string>(
    COMPETENCY_QUESTION_BANK[0]?.id || ""
  );
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return COMPETENCY_QUESTION_BANK.filter((ex) => {
      if (selectedDomain !== "ALL" && ex.domain !== selectedDomain) return false;
      if (selectedBloom !== "ALL" && ex.bloomLevel !== selectedBloom) return false;
      if (selectedDifficulty !== "ALL" && ex.difficultyStars !== selectedDifficulty)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = ex.code.toLowerCase().includes(q);
        const matchTitleAr = ex.titleAr.toLowerCase().includes(q);
        const matchTitleFr = ex.titleFr.toLowerCase().includes(q);
        const matchTopicAr = ex.topicAr.toLowerCase().includes(q);
        const matchTopicFr = ex.topicFr.toLowerCase().includes(q);
        if (!matchCode && !matchTitleAr && !matchTitleFr && !matchTopicAr && !matchTopicFr)
          return false;
      }
      return true;
    });
  }, [searchQuery, selectedDomain, selectedBloom, selectedDifficulty]);

  const activeExercise = useMemo(() => {
    return (
      filteredExercises.find((e) => e.id === activeExerciseId) ||
      filteredExercises[0] ||
      COMPETENCY_QUESTION_BANK[0]
    );
  }, [filteredExercises, activeExerciseId]);

  const handleCopyLatex = (ex: CompetencyExerciseItem) => {
    const questions = isFr ? ex.statementFr : ex.statementAr;
    const code = `\\begin{exercise}[${ex.code}] {${isFr ? ex.titleFr : ex.titleAr}} (${ex.points} pts)\n` +
      questions.join("\n") +
      `\n\\end{exercise}`;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(ex.id);
      setTimeout(() => setCopiedId(null), 2000);
      onNotify?.("success", `تم نسخ كود LaTeX للتمرين [${ex.code}] إلى الحافظة.`);
    });
  };

  const handleInsert = (ex: CompetencyExerciseItem) => {
    onInsertExercise(ex);
    onNotify?.("success", `✓ تم إدراج التمرين [${ex.code}] مباشرة في الفرض أو السلسلة الحالية!`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 no-print"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  بنك التمارين البيداغوجي المرمز حسب الكفايات ومستويات بلوم
                </h2>
                <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Taxonomie de Bloom N1/N2/N3
                </span>
              </div>
              <p className="text-xs text-slate-300">
                تمارين معيارية مطابقة للأطر المرجعية والمذكرة 142-08 مع عناصر الإجابة والتلميحات التدريجية
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

        {/* Filter bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برمز الكفاية (مثلاً ANA-LIM) أو عنوان الدرس..."
              className="w-full pr-9 pl-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Domain filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white font-bold text-slate-700"
            >
              <option value="ALL">جميع المجالات الرياضية</option>
              <option value="ANALYSE">التحليل الرياضي (Analyse)</option>
              <option value="ALGEBRE">الجبر والأعداد العقدية (Algèbre)</option>
              <option value="SUITES_NUMERIQUES">المتتاليات العددية (Suites)</option>
              <option value="GEOMETRIE_ESPACE">الهندسة الفضائية (Espace)</option>
            </select>

            {/* Bloom filter */}
            <select
              value={selectedBloom}
              onChange={(e) => setSelectedBloom(e.target.value)}
              className="border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white font-bold text-slate-700"
            >
              <option value="ALL">جميع مستويات بلوم</option>
              <option value="N1">N1: استرداد وتطبيق مباشر</option>
              <option value="N2">N2: استثمار المكتسبات وتوظيفها</option>
              <option value="N3">N3: التوليف وحل وضعيات مشكلات</option>
            </select>

            <span className="text-xs text-slate-500 font-bold">
              ({filteredExercises.length} تمرين متطابق)
            </span>
          </div>
        </div>

        {/* Main Content: Split Master-Detail */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Exercises List (Left on RTL) */}
          <div className="md:col-span-5 border-l border-slate-200 overflow-y-auto p-2.5 space-y-2 bg-slate-50/50">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                لا توجد تمارين مطابقة لمعايير البحث الحالية.
              </div>
            ) : (
              filteredExercises.map((ex) => {
                const isSelected = activeExercise?.id === ex.id;
                const bloomBadgeColor =
                  ex.bloomLevel === "N1"
                    ? "bg-teal-100 text-teal-900 border-teal-300"
                    : ex.bloomLevel === "N2"
                    ? "bg-indigo-100 text-indigo-900 border-indigo-300"
                    : "bg-rose-100 text-rose-900 border-rose-300";

                return (
                  <div
                    key={ex.id}
                    onClick={() => {
                      setActiveExerciseId(ex.id);
                      setShowSolution(false);
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer text-right ${
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-400 shadow-xs ring-1 ring-emerald-400"
                        : "bg-white hover:bg-slate-100/80 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300">
                          {ex.code}
                        </span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${bloomBadgeColor}`}
                        >
                          {ex.bloomLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                        <Timer className="w-3.5 h-3.5" />
                        <span>{ex.estimatedMinutes} د</span>
                        <span className="text-slate-300">|</span>
                        <span>{ex.points} ن</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                      {isFr ? ex.titleFr : ex.titleAr}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {isFr ? ex.topicFr : ex.topicAr}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Exercise Detail Preview (Right on RTL) */}
          <div className="md:col-span-7 flex flex-col overflow-y-auto p-4 bg-white space-y-4">
            {activeExercise ? (
              <>
                {/* Meta details banner */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-emerald-900 text-emerald-200">
                        {activeExercise.code}
                      </span>
                      <h3 className="text-sm font-black text-slate-900">
                        {isFr ? activeExercise.titleFr : activeExercise.titleAr}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {isFr ? activeExercise.topicFr : activeExercise.topicAr}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300">
                      {activeExercise.points} نقط
                    </span>
                    <button
                      type="button"
                      onClick={() => handleInsert(activeExercise)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>إدراج في الفرض الحالي</span>
                    </button>
                  </div>
                </div>

                {/* Statement KaTeX Box */}
                <div className="p-4 rounded-xl border border-slate-300/80 bg-slate-50/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>نص التمرين المصاغ بدقة رياضية (Énoncé de l'exercice):</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyLatex(activeExercise)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedId === activeExercise.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">تم نسخ LaTeX</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ كود LaTeX</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm font-medium leading-relaxed font-serif">
                    {(isFr ? activeExercise.statementFr : activeExercise.statementAr).map(
                      (line, idx) => (
                        <div key={idx} className="p-1">
                          <MathText text={line} />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Didactic Obstacle & Warning */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-black">العائق الديداكتيكي والخطأ الشائع (Obstacle Didactique):</span>
                    <p className="text-[11.5px] text-amber-900 leading-relaxed">
                      {isFr
                        ? activeExercise.didacticObstacleFr
                        : activeExercise.didacticObstacleAr}
                    </p>
                  </div>
                </div>

                {/* Toggles for Hints and Solution */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowHints((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      showHints
                        ? "bg-sky-900 text-sky-200 border-sky-800"
                        : "bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                    <span>تلميحات الدعم البيداغوجي المتدرج (Indices)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSolution((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      showSolution
                        ? "bg-emerald-900 text-emerald-200 border-emerald-800"
                        : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>عناصر الإجابة وسلم التنقيط (Corrigé & Barème)</span>
                  </button>
                </div>

                {/* Hints panel */}
                {showHints && (
                  <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs space-y-2 text-sky-950">
                    <div className="font-black text-sky-900">
                      التلميحات الموجهة للتلميذ في إطار المعالجة والدعم:
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-sky-200 font-mono text-[11px]">
                      <span className="font-bold text-sky-900">المستوى 1: </span>
                      {isFr
                        ? activeExercise.hints.hint1Fr
                        : activeExercise.hints.hint1Ar}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-sky-200 font-mono text-[11px]">
                      <span className="font-bold text-sky-900">المستوى 2: </span>
                      {isFr
                        ? activeExercise.hints.hint2Fr
                        : activeExercise.hints.hint2Ar}
                    </div>
                    <div className="text-[11px] text-sky-800 italic">
                      القاعدة المرجعية:{" "}
                      {isFr
                        ? activeExercise.hints.theoremRefFr
                        : activeExercise.hints.theoremRefAr}
                    </div>
                  </div>
                )}

                {/* Solution panel */}
                {showSolution && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                    <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>عناصر الإجابة النموذجية المبرهنة وسلم التنقيط:</span>
                    </div>
                    <div className="space-y-1.5 text-xs sm:text-sm font-serif leading-relaxed text-slate-800 bg-white p-3 rounded-lg border border-emerald-200">
                      {(isFr ? activeExercise.solutionFr : activeExercise.solutionAr).map(
                        (step, sIdx) => (
                          <div key={sIdx} className="py-1 border-b border-slate-100 last:border-b-0">
                            <MathText text={step} />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">
            تتوافق كفايات البنك بنسبة 100% مع الأطر المرجعية للامتحان الوطني الموحد للبكالوريا
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
