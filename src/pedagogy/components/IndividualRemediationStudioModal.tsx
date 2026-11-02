import React, { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  FileDown,
  GraduationCap,
  HeartHandshake,
  Layers,
  Printer,
  QrCode,
  RefreshCw,
  Sparkles,
  Target,
  UserCheck,
  X,
  AlertTriangle,
} from "lucide-react";
import { renderQrSvgString } from "../utils/qrCodeHelper";
import { DEFAULT_MOROCCAN_CLASS_ROSTER } from "../utils/evaluationGridExporter";
import { MathText } from "./MathRenderer";

export interface DidacticRemediationDeficit {
  id: string;
  topicAr: string;
  topicFr: string;
  deficitDescriptionAr: string;
  remedialRuleLatex: string;
  targetedExerciseAr: string;
  targetedExerciseFr: string;
  qrInteractiveUrl: string;
}

// بنك التعثرات الديداكتيكية والتمارين العلاجية المبرمجة وزارياً
const DIDACTIC_DEFICITS_BANK: DidacticRemediationDeficit[] = [
  {
    id: "limits_indeterminate",
    topicAr: "النهايات وحالات عدم التعيين",
    topicFr: "Limites et formes indéterminées",
    deficitDescriptionAr: "صعوبة في رفع حالات عدم التعيين $\\frac{0}{0}$ و $\\frac{\\infty}{\\infty}$ واستعمال المرافق والتعميل بالحد الأكبر درجة.",
    remedialRuleLatex: "\\lim_{x \\to x_0} \\frac{\\sqrt{u(x)} - \\sqrt{v(x)}}{x - x_0} = \\lim_{x \\to x_0} \\frac{u(x) - v(x)}{(x - x_0)(\\sqrt{u(x)} + \\sqrt{v(x)})}",
    targetedExerciseAr: "أحسب النهايتين التاليتين مع التعليل الدقيق:\n1. $\\lim_{x \\to 2} \\frac{\\sqrt{x+2} - 2}{x^2 - 4}$\n2. $\\lim_{x \\to +\\infty} \\sqrt{x^2 + 3x} - x$",
    targetedExerciseFr: "Calculer les limites suivantes avec justification rigoureuse:\n1. $\\lim_{x \\to 2} \\frac{\\sqrt{x+2} - 2}{x^2 - 4}$\n2. $\\lim_{x \\to +\\infty} \\sqrt{x^2 + 3x} - x$",
    qrInteractiveUrl: "https://kouziber-math.ma/remediation/limites-conjugue",
  },
  {
    id: "derivation_tangent",
    topicAr: "الاشتقاق ومعادلة المماس والتأويل الهندسي",
    topicFr: "Dérivation et interprétation géométrique",
    deficitDescriptionAr: "الخلط بين إشارة المشتقة وتغيرات الدالة، وصعوبة تحديد معادلة المماس عند نقطة الانعطاف.",
    remedialRuleLatex: "y = f'(x_0)(x - x_0) + f(x_0)",
    targetedExerciseAr: "لتكن $f(x) = \\frac{2x-1}{x+1}$.\n1. بين أن $f'(x) = \\frac{3}{(x+1)^2}$ واستنتج جدول تغيرات $f$.\n2. حدد معادلة المماس $(T)$ للمنحنى $(C_f)$ عند النقطة ذات الأفصول $0$.",
    targetedExerciseFr: "Soit $f(x) = \\frac{2x-1}{x+1}$.\n1. Montrer que $f'(x) = \\frac{3}{(x+1)^2}$ et dresser le tableau de variations.\n2. Donner l'équation de la tangente $(T)$ en $x_0 = 0$.",
    qrInteractiveUrl: "https://kouziber-math.ma/remediation/derivation-tangente",
  },
  {
    id: "space_geometry_cross_product",
    topicAr: "الهندسة الفضائية وتقاطع الفلكة والمستوى",
    topicFr: "Géométrie dans l'espace et sphère",
    deficitDescriptionAr: "أخطاء في حساب محددات الجداء المتجهي وتحديد إحداثيات المسقط العمودي لمركز الفلكة على المستوى.",
    remedialRuleLatex: "d(\\Omega, P) = \\frac{|ax_\\Omega + by_\\Omega + cz_\\Omega + d|}{\\sqrt{a^2+b^2+c^2}} < R \\implies r = \\sqrt{R^2 - d^2}",
    targetedExerciseAr: "في الفضاء المنسوب لمعلم متعامد ممنظم، نعتبر المستوى $(P): x+2y+2z-5=0$ والفلكة $(S)$ ذات المركز $\\Omega(1,-1,2)$ والشعاع $R=3$.\n1. أحسب $d(\\Omega, (P))$.\n2. استنتج طبيعة التقاطع وحدد شعاع الدائرة الناتجة.",
    targetedExerciseFr: "Dans l'espace orthonormé, on considère le plan $(P): x+2y+2z-5=0$ et la sphère $(S)$ de centre $\\Omega(1,-1,2)$ et rayon $R=3$.\n1. Calculer $d(\\Omega, (P))$.\n2. En déduire la nature de l'intersection et le rayon du cercle.",
    qrInteractiveUrl: "https://kouziber-math.ma/remediation/espace-sphere-plan",
  },
  {
    id: "complex_numbers_transformations",
    topicAr: "الأعداد العقدية والتحويلات النقطية (الدوران والتحاكي)",
    topicFr: "Nombres complexes et transformations du plan",
    deficitDescriptionAr: "صعوبة التمييز بين الكتابة العقدية للدوران والتحاكي والإزاحة وتحديد زاوية الدوران.",
    remedialRuleLatex: "R(\\Omega, \\theta) \\iff z' - \\omega = e^{i\\theta}(z - \\omega)",
    targetedExerciseAr: "نعتبر النقطتين $A(2+i)$ و $\\Omega(1)$.\n1. حدد الكتابة العقدية للدوران $R$ الذي مركزه $\\Omega$ وزاويته $\\frac{\\pi}{2}$.\n2. حدد لحق النقطة $B$ صورة $A$ بالدوران $R$.",
    targetedExerciseFr: "On considère $A(2+i)$ et $\\Omega(1)$.\n1. Donner l'écriture complexe de la rotation $R(\\Omega, \\frac{\\pi}{2})$.\n2. Déterminer l'affixe de $B = R(A)$.",
    qrInteractiveUrl: "https://kouziber-math.ma/remediation/complexes-rotations",
  },
  {
    id: "integration_by_parts",
    topicAr: "التكامل والمكاملة بالأجزاء وحساب المساحة",
    topicFr: "Calcul intégral et intégration par parties",
    deficitDescriptionAr: "صعوبة اختيار الدالتين $u$ و $v'$ في تقنية ALPES وحساب مساحة الحيز المحصور بين المنحنيين.",
    remedialRuleLatex: "\\int_a^b u(x)v'(x)dx = [u(x)v(x)]_a^b - \\int_a^b u'(x)v(x)dx",
    targetedExerciseAr: "باستعمال المكاملة بالأجزاء، أحسب التكاملين:\n1. $I = \\int_1^e x \\ln(x) dx$\n2. $J = \\int_0^1 (2x+1)e^x dx$",
    targetedExerciseFr: "En utilisant une intégration par parties, calculer:\n1. $I = \\int_1^e x \\ln(x) dx$\n2. $J = \\int_0^1 (2x+1)e^x dx$",
    qrInteractiveUrl: "https://kouziber-math.ma/remediation/integration-parties",
  },
];

export interface IndividualRemediationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (type: "success" | "error" | "info", msg: string) => void;
  schoolName?: string;
  profName?: string;
  trackLabel?: string;
}

export const IndividualRemediationStudioModal: React.FC<IndividualRemediationStudioModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  schoolName = "ثانوية التميز التأهيلية",
  profName = "ذ. إبراهيم كوزيبر",
  trackLabel = "2 باك علوم تجريبية / رياضية",
}) => {
  const [selectedStudentName, setSelectedStudentName] = useState<string>("يوسف العلمي");
  const [selectedStudentGrade, setSelectedStudentGrade] = useState<string>("07.50 / 20");
  const [selectedDeficitIds, setSelectedDeficitIds] = useState<string[]>([
    "limits_indeterminate",
    "derivation_tangent",
  ]);
  const [includeContract, setIncludeContract] = useState<boolean>(true);
  const [includeQrCode, setIncludeQrCode] = useState<boolean>(true);
  const [customTeacherNote, setCustomTeacherNote] = useState<string>(
    "المرجو التركيز على مراجعة الخطوات المنهجية وإنجاز التمارين قبل نهاية الأسبوع."
  );

  if (!isOpen) return null;

  const toggleDeficit = (id: string) => {
    setSelectedDeficitIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((i) => i !== id)
          : prev
        : [...prev, id]
    );
  };

  const selectedDeficits = DIDACTIC_DEFICITS_BANK.filter((d) => selectedDeficitIds.includes(d.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* شريط العنوان */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  استوديو بطاقات المعالجة والدعم الفردي الفارقي (Fiche de Remédiation Personnalisée)
                </h2>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  بيداغوجيا الفوارق
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                توليد بطاقة استدراكية مصوبة ومطبوعة A4 لكل تلميذ متعثر مع تذكير القواعد ورموز QR تفاعلية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى الاستوديو: لوحة الإعداد + ورقة المعاينة المطبوعة */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* لوحة الضبط والاختيار */}
          <div className="lg:col-span-5 space-y-4">
            {/* اختيار التلميذ والنقطة */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>بيانات التلميذ المتعثر</span>
              </h3>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">اختر من لائحة القسم أو اكتب الاسم:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedStudentName}
                    onChange={(e) => setSelectedStudentName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                  />
                  <select
                    onChange={(e) => {
                      const item = DEFAULT_MOROCCAN_CLASS_ROSTER.find(
                        (r) => r.massarCode === e.target.value || r.codeMassar === e.target.value
                      );
                      if (item) setSelectedStudentName(item.fullNameFr || item.nomFr || "");
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 text-xs font-mono text-slate-300"
                  >
                    <option value="">لائحة مسار...</option>
                    {DEFAULT_MOROCCAN_CLASS_ROSTER.map((st) => (
                      <option key={st.massarCode} value={st.massarCode}>
                        {st.fullNameFr || st.nomFr || st.fullNameAr} ({st.massarCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">نقطة الفرض المرصودة:</label>
                <input
                  type="text"
                  value={selectedStudentGrade}
                  onChange={(e) => setSelectedStudentGrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-rose-300 font-mono"
                />
              </div>
            </div>

            {/* بنك التعثرات المرصودة */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <h3 className="text-xs font-black text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span>تحديد مكامن التعثر المراد معالجتها</span>
                </span>
                <span className="text-[10px] text-slate-400">{selectedDeficitIds.length} محددة</span>
              </h3>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {DIDACTIC_DEFICITS_BANK.map((def) => {
                  const isChecked = selectedDeficitIds.includes(def.id);
                  return (
                    <label
                      key={def.id}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                        isChecked
                          ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDeficit(def.id)}
                        className="mt-0.5 accent-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-white text-[11px]">{def.topicAr}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{def.deficitDescriptionAr}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* خيارات إضافية */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">تضمين رمز QR ديداكتيكي تفاعلي</span>
                <input
                  type="checkbox"
                  checked={includeQrCode}
                  onChange={(e) => setIncludeQrCode(e.target.checked)}
                  className="accent-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">إدراج ميثاق التعاقد والالتزام التربوي</span>
                <input
                  type="checkbox"
                  checked={includeContract}
                  onChange={(e) => setIncludeContract(e.target.checked)}
                  className="accent-indigo-500"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-2.5 rounded-xl text-xs shadow-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة بطاقة المعالجة الفردية A4 للمتعلم</span>
            </button>
          </div>

          {/* القسم الأيمن: معاينة الورقة المطبوعة A4 */}
          <div className="lg:col-span-7 bg-white text-slate-950 p-6 rounded-2xl shadow-2xl border border-slate-200 font-sans print:shadow-none print:border-none print:p-0">
            {/* ترويسة الورقة الرسمية */}
            <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-3">
              <div className="text-right text-[11px] font-bold leading-tight">
                <div>المملكة المغربية — وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
                <div className="text-slate-600">{schoolName} — مادة الرياضيات</div>
                <div className="text-indigo-950 font-black text-xs mt-0.5">
                  بطاقة المعالجة والدعم الفردي الفارقي (Fiche de Remédiation Ciblée)
                </div>
              </div>
              {includeQrCode && (
                <div
                  className="w-16 h-16 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: renderQrSvgString("https://kouziber-math.ma/remediation/" + selectedStudentName, 64, "#1e1b4b"),
                  }}
                />
              )}
            </div>

            {/* بطاقة التلميذ والتشخيص */}
            <div className="grid grid-cols-3 gap-2 my-3 p-2 bg-indigo-50 rounded-lg text-[11px] border border-indigo-200">
              <div>
                <span className="font-bold text-indigo-950">التلميذ(ة): </span>
                <span className="font-black text-slate-900">{selectedStudentName}</span>
              </div>
              <div>
                <span className="font-bold text-indigo-950">المستوى: </span>
                <span className="font-semibold text-slate-800">{trackLabel}</span>
              </div>
              <div>
                <span className="font-bold text-indigo-950">النقطة المحصلة: </span>
                <span className="font-mono font-black text-rose-700">{selectedStudentGrade}</span>
              </div>
            </div>

            {/* قائمة التعثرات والتمارين الاستدراكية الموجهة */}
            <div className="space-y-3.5 my-3">
              {selectedDeficits.map((def, idx) => (
                <div key={def.id} className="border border-slate-300 rounded-xl p-3 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-black text-xs text-indigo-950">{def.topicAr}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono italic">{def.topicFr}</span>
                  </div>

                  {/* تشخيص الخلل */}
                  <div className="text-[10px] text-rose-800 bg-rose-50 p-1.5 rounded border border-rose-200">
                    <span className="font-bold">تشخيص الخلل المعرفي: </span>
                    <MathText text={def.deficitDescriptionAr} />
                  </div>

                  {/* تذكير بالقاعدة الرياضية الأساسية */}
                  <div className="text-[10px] bg-amber-50 p-2 rounded border border-amber-200 text-slate-900">
                    <div className="font-bold text-amber-950 mb-0.5">تذكير مركزي بالقاعدة الرياضية (Rappel clé):</div>
                    <div className="text-center font-mono py-1">
                      <MathText text={`$${def.remedialRuleLatex}$`} />
                    </div>
                  </div>

                  {/* التمرين الاستدراكي الموجه */}
                  <div className="text-[10px] bg-white p-2 rounded border border-slate-200">
                    <div className="font-bold text-indigo-900 mb-1">تمرين استدراكي تطبيقي (Exercice ciblé):</div>
                    <div className="whitespace-pre-line text-slate-800 leading-relaxed font-sans">
                      <MathText text={def.targetedExerciseAr} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ميثاق الالتزام والتعاقد البيداغوجي */}
            {includeContract && (
              <div className="mt-3 p-2.5 border border-indigo-200 rounded-xl bg-indigo-50/50 text-[10px] space-y-1.5">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-indigo-700" />
                  <span>ميثاق التعاقد البيداغوجي والالتزام بالتحسن (Contrat d'engagement):</span>
                </div>
                <p className="text-slate-700 text-[9px] leading-tight">
                  أتعهد أنا التلميذ(ة) بالعمل على تدارك التعثرات المحددة أعلاه، ومراجعة التذكير بالقواعد، وإعادة إنجاز التمارين المصوبة قبل الفرض المحروس الموالي.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1.5 text-center text-[9px] font-bold border-t border-indigo-200">
                  <div>توقيع التلميذ(ة)</div>
                  <div>توقيع ولي الأمر</div>
                  <div>ملاحظة وتوقيع الأستاذ(ة)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
