/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * شبكة تحليل التقويم التشخيصي ورصد تعثرات القسم والفرص العلاجية
 * Grille d'Analyse Diagnostique & Fréquence des Erreurs - Note 142-08
 */

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  Download,
  FileCheck2,
  FileDown,
  Layers,
  Lightbulb,
  Printer,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

export interface DiagnosticCompetencyStat {
  code: string;
  labelAr: string;
  labelFr: string;
  domain: string;
  masteryRate: number; // percentage 0-100
  testedStudents: number;
  masteredStudents: number;
  criticalErrorAr: string;
  criticalErrorFr: string;
  remediationPlanAr: string;
  remediationPlanFr: string;
}

export interface DiagnosticClassAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackCode: string;
  trackLabelAr: string;
  trackLabelFr: string;
  school: string;
  prof: string;
  year: string;
  isFr?: boolean;
  onNotify?: (type: "success" | "info" | "error", text: string) => void;
}

const DEFAULT_DIAGNOSTIC_COMPETENCIES: DiagnosticCompetencyStat[] = [
  {
    code: "ANA-LIM",
    labelAr: "حساب النهايات وإزالة الحالات غير المحددة الأساسية",
    labelFr: "Calcul des limites et formes indéterminées",
    domain: "التحليل",
    masteryRate: 72,
    testedStudents: 36,
    masteredStudents: 26,
    criticalErrorAr: "الخلط في إشارة $x$ عند التعميل داخل الجذر المربع $(\\sqrt{x^2}=|x|)$ بجوار $-\\infty$.",
    criticalErrorFr: "Confusion de signe lors de la sortie de $x$ du radical en $-\\infty$.",
    remediationPlanAr: "سلسلة تمارين علاجية مركزة على توظيف القيمة المطلقة والمرافق الجبري.",
    remediationPlanFr: "Feuille de remédiation ciblée sur la valeur absolue et l'expression conjuguée.",
  },
  {
    code: "ANA-DERIV",
    labelAr: "الاشتقاق وتحديد إشارة المشتقة وجدول التغيرات",
    labelFr: "Dérivation et tableau de variations",
    domain: "التحليل",
    masteryRate: 58,
    testedStudents: 36,
    masteredStudents: 21,
    criticalErrorAr: "صعوبة اشتقاق الدوال المركبة $(f(u(x)))'$ ونسيان ضرب المشتقة في $u'(x)$.",
    criticalErrorFr: "Omission du facteur $u'(x)$ dans la dérivation des composées.",
    remediationPlanAr: "كبسولات تدريب تفاعلية وتطبيق قواعد جدول المشتقات خطوة بخطوة.",
    remediationPlanFr: "Rappels guidés et exercices gradués sur la règle de dérivation en chaîne.",
  },
  {
    code: "ANA-TVI",
    labelAr: "تطبيق مبرهنة القيم الوسيطية واستنتاج إشارة دالة",
    labelFr: "Théorème des Valeurs Intermédiaires (TVI)",
    domain: "التحليل",
    masteryRate: 47,
    testedStudents: 36,
    masteredStudents: 17,
    criticalErrorAr: "إغفال شرط الرتابة قطعا لإثبات وحدانية الحل والاكتفاء بالاتصال فقط.",
    criticalErrorFr: "Omission de la stricte monotonie pour conclure à l'unicité de la solution.",
    remediationPlanAr: "أنشطة ديداكتيكية لتمييز شروط الوجود مقابل شروط الوحدانية عبر GeoGebra.",
    remediationPlanFr: "Visualisation dynamique sur GeoGebra des bijections continues.",
  },
  {
    code: "ALG-REC",
    labelAr: "البرهان بالترجع وصياغة مراحله الثلاث بدقة",
    labelFr: "Raisonnement par récurrence",
    domain: "المتتاليات",
    masteryRate: 64,
    testedStudents: 36,
    masteredStudents: 23,
    criticalErrorAr: "الانطلاق من الخاصية المراد البرهان عليها بدلاً من فرضية الترجع.",
    criticalErrorFr: "Confusion logique: partir de $P(n+1)$ au lieu d'utiliser l'hypothèse $P(n)$.",
    remediationPlanAr: "جذاذة توجيهية تركز على البناء المنطقي والانتقال الاستلزامي الصارم.",
    remediationPlanFr: "Fiche méthodologique de rédaction rigoureuse de l'hérédité.",
  },
  {
    code: "ALG-CPX",
    labelAr: "الحساب في الأعداد العقدية والانتقال بين الأشكال",
    labelFr: "Nombres complexes: formes algébrique et trigo",
    domain: "الجبر",
    masteryRate: 53,
    testedStudents: 36,
    masteredStudents: 19,
    criticalErrorAr: "أخطاء في تحديد العمدة عند انعدام الجزء الحقيقي أو السالبية في الجزء الحقيقي.",
    criticalErrorFr: "Erreurs sur la détermination de l'argument principal $\\theta \\in ]-\\pi, \\pi]$.",
    remediationPlanAr: "توظيف الدائرة المثلثية الممنهجة لتحديد الزوايا الاعتيادية والمرافقة.",
    remediationPlanFr: "Utilisation systématique du cercle trigonométrique.",
  },
  {
    code: "GEO-ESP",
    labelAr: "الجداء السلمي والمتجهي ومعادلة الفلكة والمستوى",
    labelFr: "Géométrie dans l'espace: Sphère et plans",
    domain: "الهندسة",
    masteryRate: 69,
    testedStudents: 36,
    masteredStudents: 25,
    criticalErrorAr: "تحديد إحداثيات مركز الفلكة بأخطاء في الإشارة عند الشكل القانوني.",
    criticalErrorFr: "Erreurs de signe sur les coordonnées du centre lors de la forme canonique.",
    remediationPlanAr: "تمارين مطابقة لاختبارات البكالوريا الرسمية لتثبيت الشكل القانوني السريع.",
    remediationPlanFr: "Entraînement aux formes canoniques rapides sur repère $(O, i, j, k)$.",
  },
];

export const DiagnosticClassAnalysisModal: React.FC<DiagnosticClassAnalysisModalProps> = ({
  isOpen,
  onClose,
  trackCode,
  trackLabelAr,
  trackLabelFr,
  school,
  prof,
  year,
  isFr = false,
  onNotify,
}) => {
  const [competencies, setCompetencies] = useState<DiagnosticCompetencyStat[]>(
    DEFAULT_DIAGNOSTIC_COMPETENCIES
  );
  const [activeTab, setActiveTab] = useState<"GRID" | "OBSTACLES" | "INSPECTION_REPORT">("GRID");

  // Global class average mastery
  const globalMastery = useMemo(() => {
    const sum = competencies.reduce((acc, c) => acc + c.masteryRate, 0);
    return Math.round(sum / competencies.length);
  }, [competencies]);

  const handlePrintReport = () => {
    window.print();
  };

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
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 text-white p-4 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  شبكة تحليل التقويم التشخيصي ورصد تعثرات القسم والفرص العلاجية
                </h2>
                <span className="text-[11px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  Note 142-08
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {school} | {trackLabelAr} | تقرير الأستاذ والمفتش التربوي | السنة: {year}
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

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("GRID")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "GRID"
                  ? "bg-indigo-900 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>مؤشرات التحكم في الكفايات</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("OBSTACLES")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "OBSTACLES"
                  ? "bg-indigo-900 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>العوائق الديداكتيكية وخطة الدعم</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("INSPECTION_REPORT")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "INSPECTION_REPORT"
                  ? "bg-teal-900 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>تقرير التفتيش التربوي الجاهز</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">متوسط تحكم القسم:</span>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-md ${
                globalMastery >= 60
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              {globalMastery}%
            </span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {activeTab === "GRID" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {competencies.map((comp) => {
                  const isLow = comp.masteryRate < 50;
                  const isMedium = comp.masteryRate >= 50 && comp.masteryRate < 70;
                  return (
                    <div
                      key={comp.code}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-900 text-cyan-300">
                            {comp.code}
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            {comp.labelAr}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                            isLow
                              ? "bg-rose-100 text-rose-900 border border-rose-300"
                              : isMedium
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          }`}
                        >
                          {comp.masteryRate}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLow
                              ? "bg-rose-500"
                              : isMedium
                              ? "bg-amber-500"
                              : "bg-emerald-600"
                          }`}
                          style={{ width: `${comp.masteryRate}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>المجال: {comp.domain}</span>
                        <span>
                          {comp.masteredStudents} من أصل {comp.testedStudents} تلميذ(ة) متمكن(ة)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "OBSTACLES" && (
            <div className="space-y-3">
              {competencies.map((comp) => (
                <div
                  key={comp.code}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-indigo-900">
                      [{comp.code}] {comp.labelAr}
                    </span>
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      نسبة التعثر: {100 - comp.masteryRate}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
                      <div className="font-black flex items-center gap-1.5 text-rose-900">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>العائق الديداكتيكي والخطأ الشائع:</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed">
                        {comp.criticalErrorAr}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-950 space-y-1">
                      <div className="font-black flex items-center gap-1.5 text-teal-900">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>خطة المعالجة والدعم الفارقي المقترحة:</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed">
                        {comp.remediationPlanAr}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "INSPECTION_REPORT" && (
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-300 space-y-4 text-xs leading-relaxed font-serif">
              <div className="text-center space-y-1 border-b border-slate-300 pb-3">
                <h3 className="text-sm font-black text-slate-900">
                  المملكة المغربية — وزارة التربية الوطنية والتعليم الأولي والرياضة
                </h3>
                <h4 className="text-base font-black text-indigo-950">
                  تقرير استثمار نتائج التقويم التشخيصي لمادة الرياضيات
                </h4>
                <p className="text-xs text-slate-600">
                  المؤسسة: {school} | المسلك: {trackLabelAr} | الأستاذ: {prof} | الموسم الدراسي: {year}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-black text-slate-900">1. الحصيلة الإجمالية للتقويم التشخيصي:</h5>
                <p className="text-slate-700">
                  أجري التقويم التشخيصي وفق مقتضيات المذكرة الوزارية 142-08 على عينة شملت 36 تلميذاً وتلميذة. وقد أظهرت النتائج معدل تحكم إجمالي بلغ {globalMastery}% في مجموع الكفايات المستهدفة.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-black text-slate-900">2. الكفايات ذات الأولوية في المعالجة والدعم:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-800">
                  {competencies
                    .filter((c) => c.masteryRate < 60)
                    .map((c) => (
                      <li key={c.code}>
                        <span className="font-bold">[{c.code}] {c.labelAr}:</span> نسبة تحكم {c.masteryRate}% — {c.criticalErrorAr}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-black text-slate-900">3. الإجراءات البيداغوجية المتخذة:</h5>
                <p className="text-slate-700">
                  تخصيص حصص دعم مندمجة في بداية الحصص الدراسية (أنشطة افتتاحية مدتها 10 دقائق)، وتوزيع بطاقات تمارين علاجية متدرجة الصعوبة (N1 و N2) مع توظيف البرمجيات الرقمية التفاعلية GeoGebra لترسيخ المفاهيم الهندسية والتحليلية.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-slate-700 font-sans">
                <div>توقيع أستاذ المادة: ....................</div>
                <div>تأشيرة السيد المفتش التربوي: ....................</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintReport}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التقرير التشخيصي</span>
            </button>
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
