import React, { useRef } from "react";
import {
  FileSpreadsheet,
  GraduationCap,
  Printer,
  ShieldCheck,
  TrendingUp,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  LongitudinalCohortTrackerConfig,
  computeLongitudinalInspectorAnalytics,
} from "../utils/mathjsValidator";
import { renderQrSvgString } from "../utils/qrCodeHelper";

export interface ClassCouncilReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName?: string;
  profName?: string;
  trackLabelAr?: string;
  trackLabelFr?: string;
  year?: string;
  semester?: string;
  cohortConfig: LongitudinalCohortTrackerConfig;
  onNotify: (type: "success" | "info" | "error", text: string) => void;
}

interface CheckpointDisplayItem {
  checkpointId: string;
  checkpointTitle: string;
  cohortSize: number;
  meanGrade: number;
  successRatePercent: number;
  stdDev: number;
  masteryCounts: { A: number; ECA: number; NA: number };
}

export const ClassCouncilReportModal: React.FC<ClassCouncilReportModalProps> = ({
  isOpen,
  onClose,
  schoolName = "الثانوية التأهيلية الرسمية",
  profName = "أستاذ مادة الرياضيات",
  trackLabelAr = "2 باك علوم رياضية وتجريبية",
  trackLabelFr = "2BAC Sciences / Terminale Spécialité",
  year = "2024-2025",
  semester = "S1",
  cohortConfig,
  onNotify,
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const analytics = computeLongitudinalInspectorAnalytics(cohortConfig);
  const { netRemediationEfficiencyScore, meanProgressionDelta } = analytics;

  const checkpointStats: CheckpointDisplayItem[] = cohortConfig.checkpoints.map(
    (cp, idx) => {
      const cohortSize = cohortConfig.studentCount || 34;
      const aCount = Math.round((cp.masteryAPct / 100) * cohortSize);
      const ecaCount = Math.round((cp.masteryECAPct / 100) * cohortSize);
      const naCount = Math.max(0, cohortSize - aCount - ecaCount);
      return {
        checkpointId: cp.dsCode || `CP_${idx + 1}`,
        checkpointTitle: cp.titleAr || cp.titleFr || `المحطة ${idx + 1}`,
        cohortSize,
        meanGrade: cp.meanScore20,
        successRatePercent: cp.masteryAPct + cp.masteryECAPct,
        stdDev: cp.stdDeviation,
        masteryCounts: { A: aCount, ECA: ecaCount, NA: naCount },
      };
    }
  );

  const latestCheckpoint =
    checkpointStats.length > 0 ? checkpointStats[checkpointStats.length - 1] : null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv =
      "\uFEFFالرقم,المحطة التقويمية,عدد التلاميذ,المعدل الحسابي,نسبة النجاح,الانحراف المعياري,التحكم التام (A),في طور الاكتساب (ECA),غير متمكن (NA)\n";
    checkpointStats.forEach((cp: CheckpointDisplayItem, idx: number) => {
      csv += `${idx + 1},"${cp.checkpointTitle}",${cp.cohortSize},${cp.meanGrade.toFixed(2)},${cp.successRatePercent.toFixed(1)}%,${cp.stdDev.toFixed(2)},${cp.masteryCounts.A},${cp.masteryCounts.ECA},${cp.masteryCounts.NA}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `تقرير_مجلس_القسم_الاحصائي_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("success", "تم تصدير الإحصائيات بصيغة CSV بنجاح.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto no-print-bg">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black">
        {/* شريط التحكم العلوي */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  تقرير مجلس القسم والتفتيش البيداغوجي الرسمي (Bilan Pédagogique Officiel)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  المذكرة 142-08
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تحليل إحصائي طولي وتتبعي لنتائج الفروض المحروسة ونسب التحكم بالكفايات لتقديمه للإدارة والتفتيش
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>تصدير CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير A4</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* جسم الوثيقة المطبوعة A4 */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 print:p-0 print:overflow-visible">
          <div
            ref={reportRef}
            className="bg-white text-slate-950 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-200 font-sans print:shadow-none print:border-none print:p-0 print:max-w-none space-y-6"
          >
            {/* الترويسة الوزارية الرسمية */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="text-right text-xs leading-snug space-y-0.5 font-bold">
                <div className="text-slate-900 font-black text-sm">المملكة المغربية</div>
                <div className="text-slate-700">وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
                <div className="text-slate-600">الأكاديمية الجهوية للتربية والتكوين</div>
                <div className="text-slate-800">{schoolName}</div>
              </div>

              <div className="text-center space-y-1">
                <span className="inline-block bg-slate-100 border border-slate-300 text-slate-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  {year} · {semester === "S1" ? "الدورة الأولى" : "الدورة الثانية"}
                </span>
                <h1 className="text-base font-black text-slate-950 tracking-tight">
                  تقرير مجلس القسم والتتبع البيداغوجي لمادة الرياضيات
                </h1>
                <div className="text-xs font-bold text-slate-700 font-mono">
                  {trackLabelAr} ({trackLabelFr})
                </div>
              </div>

              <div
                className="w-16 h-16 shrink-0"
                dangerouslySetInnerHTML={{
                  __html: renderQrSvgString("BILAN_COHORT_COUNCIL_" + year, 64, "#0f172a"),
                }}
              />
            </div>

            {/* بطاقة المعطيات والمؤشرات الكبرى */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">الأستاذ(ة) المشرف(ة):</span>
                <span className="font-black text-slate-900">{profName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">الفوج / القسم:</span>
                <span className="font-bold text-slate-900">{cohortConfig.cohortName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">المعدل العام للمحطة الأخيرة:</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  {latestCheckpoint ? latestCheckpoint.meanGrade.toFixed(2) : "—"} / 20
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">تطور المعدل العام (Δ):</span>
                <span className="font-mono font-black text-cyan-700 text-sm">
                  {meanProgressionDelta > 0 ? "+" : ""}
                  {meanProgressionDelta.toFixed(2)} نقطة
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">مؤشر نجاعة الدعم الفارقي:</span>
                <span className="font-mono font-black text-indigo-800 text-sm">
                  {netRemediationEfficiencyScore}% / 100
                </span>
              </div>
            </div>

            {/* جدول تتبع المحطات التقويمية ومستويات التحكم */}
            <div className="space-y-2">
              <h2 className="text-xs font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>1. التطور الطولي للمحطات التقويمية (الفروض المحروسة والتشخيصي):</span>
              </h2>

              <table className="w-full text-right text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">المحطة التقويمية</th>
                    <th className="p-2.5">العدد</th>
                    <th className="p-2.5">المعدل الحسابي</th>
                    <th className="p-2.5">نسبة النجاح (≥10)</th>
                    <th className="p-2.5">الانحراف المعياري σ</th>
                    <th className="p-2.5 text-center">متمكن (A)</th>
                    <th className="p-2.5 text-center">في طور الاكتساب (ECA)</th>
                    <th className="p-2.5 text-center">غير متمكن (NA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {checkpointStats.map((cp: CheckpointDisplayItem) => (
                    <tr key={cp.checkpointId} className="hover:bg-slate-50">
                      <td className="p-2.5 font-sans font-bold text-slate-900">{cp.checkpointTitle}</td>
                      <td className="p-2.5 text-slate-700">{cp.cohortSize}</td>
                      <td className="p-2.5 font-black text-slate-900">{cp.meanGrade.toFixed(2)}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{cp.successRatePercent.toFixed(1)}%</td>
                      <td className="p-2.5 text-slate-600">{cp.stdDev.toFixed(2)}</td>
                      <td className="p-2.5 text-center bg-emerald-50 text-emerald-900 font-bold">
                        {cp.masteryCounts.A} ({((cp.masteryCounts.A / cp.cohortSize) * 100).toFixed(0)}%)
                      </td>
                      <td className="p-2.5 text-center bg-amber-50 text-amber-900 font-bold">
                        {cp.masteryCounts.ECA} ({((cp.masteryCounts.ECA / cp.cohortSize) * 100).toFixed(0)}%)
                      </td>
                      <td className="p-2.5 text-center bg-rose-50 text-rose-900 font-bold">
                        {cp.masteryCounts.NA} ({((cp.masteryCounts.NA / cp.cohortSize) * 100).toFixed(0)}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* مبيان التطور الطولي وقرار تأشيرة التفتيش التربوي */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div
                className="md:col-span-7 border border-slate-200 rounded-xl p-2 bg-white overflow-hidden"
                dangerouslySetInnerHTML={{ __html: analytics.svgEvolutionChart }}
              />
              <div className="md:col-span-5 border border-emerald-200 rounded-xl p-3.5 bg-emerald-50/70 space-y-2 text-xs">
                <div className="font-black text-emerald-950 flex items-center justify-between">
                  <span>خلاصة التجانس وتأشيرة المفتش التربوي:</span>
                  <span className="font-mono text-[11px] bg-emerald-800 text-white px-2 py-0.5 rounded">
                    ΔNA: {analytics.deltaNonAcquis}%
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-800 leading-relaxed">
                  {analytics.homogeneityTrendAr}
                </p>
                <p className="text-[11px] text-emerald-950 leading-relaxed border-t border-emerald-200/80 pt-1.5">
                  {analytics.inspectorVisaStatusAr}
                </p>
              </div>
            </div>

            {/* تشخيص التعثرات والتوصيات المعتمدة لمجلس القسم */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2">
                <h3 className="font-black text-slate-900 flex items-center gap-1.5 text-xs text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>مكامن الصعوبة والتعثر المرصودة في الفوج:</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed text-[11px]">
                  <li>الخلط بين مفهوم الاتصال وقابلية الاشتقاق في نقطة.</li>
                  <li>صعوبة توظيف مبرهنة القيم الوسيطية في إثبات وحدانية الحلول على مجالات مفتوحة.</li>
                  <li>أخطاء الحساب الجبري في فروع اللانهاية والمقارب المائل.</li>
                  <li>الحاجة لمزيد من التدريب على الاستدلال بالترجع وتأويل المتتاليات هندسياً.</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2">
                <h3 className="font-black text-slate-900 flex items-center gap-1.5 text-xs text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>خطة الدعم والمواكبة المقررة:</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed text-[11px]">
                  <li>تفعيل بطاقات المعالجة الفردية الفارقية الموجهة لكل متعثر عبر التطبيق.</li>
                  <li>تنظيم ورشات عمل لحل الوضعيات المركبة بالتعلم القرين ومجموعات الحاجة.</li>
                  <li>تزويد المتعلمين برموز QR تتضمن كبسولات مصورة للمفاهيم الأساسية.</li>
                  <li>إجراء تقويم تكويني استدراكي لقياس مدى استيعاب المعالجة المنجزة.</li>
                </ul>
              </div>
            </div>

            {/* خانات التوقيعات الرسمية لمجلس القسم */}
            <div className="pt-4 border-t-2 border-slate-300">
              <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold text-slate-800">
                <div className="space-y-12">
                  <span>أستاذ(ة) المادة</span>
                  <div className="text-[10px] text-slate-400 italic font-normal">(التوقيع والخاتم)</div>
                </div>
                <div className="space-y-12">
                  <span>الأستاذ(ة) الرئيس(ة)</span>
                  <div className="text-[10px] text-slate-400 italic font-normal">(التوقيع)</div>
                </div>
                <div className="space-y-12">
                  <span>رئيس(ة) المؤسسة / المفتش التربوي</span>
                  <div className="text-[10px] text-slate-400 italic font-normal">(التأشير والملاحظات)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
