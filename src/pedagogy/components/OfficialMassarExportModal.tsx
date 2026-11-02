/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * نظام تصدير النقط والملاحظات البيداغوجية لمسار Massar (وزارة التربية الوطنية المغربية)
 * Module Officiel d'Exportation des Notes et Appréciations Massar (MEN Maroc)
 */

import React, { useMemo, useState } from "react";
import {
  Award,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Percent,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

export interface MassarStudentGrade {
  num: number;
  massarId: string;
  fullName: string;
  rawScore: number;
  maxRawScore: number;
  score20: number;
  appreciationAr: string;
  appreciationFr: string;
  status: "EXCELLENT" | "VERY_GOOD" | "GOOD" | "AVERAGE" | "REMEDIAL";
}

export interface OfficialMassarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackCode: string;
  trackLabelAr: string;
  trackLabelFr: string;
  dsKey: string;
  school: string;
  prof: string;
  year: string;
  isFr?: boolean;
  onNotify?: (type: "success" | "info" | "error", text: string) => void;
}

const DEFAULT_MASSAR_STUDENTS = [
  { id: "M130089123", name: "ياسين بنجلون", raw: 19.5 },
  { id: "M134567890", name: "فاطمة الزهراء العمراني", raw: 18.25 },
  { id: "M139876543", name: "حمزة التازي", raw: 16.75 },
  { id: "M131234567", name: "مريم العلمي", raw: 15.5 },
  { id: "M132345678", name: "عمر الفاسي الفهري", raw: 14.0 },
  { id: "M133456789", name: "إيمان الإدريسي", raw: 13.5 },
  { id: "M134567891", name: "أمين الودغيري", raw: 12.0 },
  { id: "M135678902", name: "سلمى بنكيران", raw: 11.25 },
  { id: "M136789013", name: "سعد المرابط", raw: 10.0 },
  { id: "M137890124", name: "خولة السبتي", raw: 9.25 },
  { id: "M138901235", name: "أيوب الشرقاوي", raw: 8.5 },
  { id: "M139012346", name: "هبة الشرايبي", raw: 7.0 },
];

export const OfficialMassarExportModal: React.FC<OfficialMassarExportModalProps> = ({
  isOpen,
  onClose,
  trackCode,
  trackLabelAr,
  trackLabelFr,
  dsKey,
  school,
  prof,
  year,
  isFr = false,
  onNotify,
}) => {
  const [students, setStudents] = useState<MassarStudentGrade[]>(() => {
    return DEFAULT_MASSAR_STUDENTS.map((item, idx) => {
      const score20 = Number(item.raw.toFixed(2));
      let status: "EXCELLENT" | "VERY_GOOD" | "GOOD" | "AVERAGE" | "REMEDIAL" = "GOOD";
      let appAr = "";
      let appFr = "";

      if (score20 >= 16) {
        status = "EXCELLENT";
        appAr = "عمل ممتاز ونتائج باهرة، تمكن تام من الكفايات الرياضية المستهدفة.";
        appFr = "Excellent travail, parfaite maîtrise des compétences mathématiques.";
      } else if (score20 >= 14) {
        status = "VERY_GOOD";
        appAr = "عمل جيد جدا، تحكم متقدم في تقنيات البرهان والحساب الدقيق.";
        appFr = "Très bon travail, acquisition solide des méthodes de démonstration.";
      } else if (score20 >= 12) {
        status = "GOOD";
        appAr = "عمل جيد، قدرة جيدة على حل المسائل مع استمرار التركيز على التفاصيل.";
        appFr = "Bon travail, méthode rigoureuse, poursuivez vos efforts.";
      } else if (score20 >= 10) {
        status = "AVERAGE";
        appAr = "مستوى متوسط، مجهود محمود مع الحاجة لتثبيت القواعد والمبرهنات الأساسية.";
        appFr = "Résultats moyens, des efforts à intensifier pour consolider les bases.";
      } else {
        status = "REMEDIAL";
        appAr = "مستوى غير كاف، تعثر في استيعاب المفاهيم المجردة يستدعي دعما فوريا.";
        appFr = "Niveau insuffisant, difficultés dans les notions clés, remédiation urgente.";
      }

      return {
        num: idx + 1,
        massarId: item.id,
        fullName: item.name,
        rawScore: item.raw,
        maxRawScore: 20,
        score20,
        appreciationAr: appAr,
        appreciationFr: appFr,
        status,
      };
    });
  });

  const [copied, setCopied] = useState<boolean>(false);

  // Statistics
  const stats = useMemo(() => {
    if (students.length === 0)
      return { avg: 0, min: 0, max: 0, passCount: 0, passRate: 0 };
    const scores = students.map((s) => s.score20);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Number((sum / scores.length).toFixed(2));
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const passCount = scores.filter((s) => s >= 10).length;
    const passRate = Number(((passCount / scores.length) * 100).toFixed(1));
    return { avg, min, max, passCount, passRate };
  }, [students]);

  const handleScoreChange = (idx: number, newScore: number) => {
    const clamped = Math.min(20, Math.max(0, Number(newScore) || 0));
    setStudents((prev) => {
      const next = [...prev];
      const s = next[idx];
      if (!s) return prev;

      let status: "EXCELLENT" | "VERY_GOOD" | "GOOD" | "AVERAGE" | "REMEDIAL" = "GOOD";
      let appAr = "";
      let appFr = "";

      if (clamped >= 16) {
        status = "EXCELLENT";
        appAr = "عمل ممتاز ونتائج باهرة، تمكن تام من الكفايات الرياضية المستهدفة.";
        appFr = "Excellent travail, parfaite maîtrise des compétences mathématiques.";
      } else if (clamped >= 14) {
        status = "VERY_GOOD";
        appAr = "عمل جيد جدا، تحكم متقدم في تقنيات البرهان والحساب الدقيق.";
        appFr = "Très bon travail, acquisition solide des méthodes de démonstration.";
      } else if (clamped >= 12) {
        status = "GOOD";
        appAr = "عمل جيد، قدرة جيدة على حل المسائل مع استمرار التركيز على التفاصيل.";
        appFr = "Bon travail, méthode rigoureuse, poursuivez vos efforts.";
      } else if (clamped >= 10) {
        status = "AVERAGE";
        appAr = "مستوى متوسط، مجهود محمود مع الحاجة لتثبيت القواعد والمبرهنات الأساسية.";
        appFr = "Résultats moyens, des efforts à intensifier pour consolider les bases.";
      } else {
        status = "REMEDIAL";
        appAr = "مستوى غير كاف، تعثر في استيعاب المفاهيم المجردة يستدعي دعما فوريا.";
        appFr = "Niveau insuffisant, difficultés dans les notions clés, remédiation urgente.";
      }

      next[idx] = {
        ...s,
        rawScore: clamped,
        score20: clamped,
        appreciationAr: appAr,
        appreciationFr: appFr,
        status,
      };
      return next;
    });
  };

  const handleExportCSV = () => {
    const header = "N°,Code Massar,Nom et Prénom,Note /20,Appréciation\n";
    const rows = students
      .map(
        (s) =>
          `${s.num},${s.massarId},"${s.fullName}",${s.score20},"${
            isFr ? s.appreciationFr : s.appreciationAr
          }"`
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Massar_Export_${trackCode}_${dsKey}_${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify?.("success", "تم تصدير ملف مسار CSV المعتمد بنجاح!");
  };

  const handleExportExcelXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#047857"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="12" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#064E3B" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Score">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#047857"/>
   <NumberFormat ss:Format="0.00"/>
  </Style>
  <Style ss:ID="Text">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Massar_Notes">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="100"/>
   <Column ss:Width="180"/>
   <Column ss:Width="80"/>
   <Column ss:Width="300"/>
   <Row ss:Height="25">
    <Cell ss:StyleID="Header"><Data ss:Type="String">N°</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Code Massar</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Nom et Prénom</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Note /20</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Appréciation Pédagogique</Data></Cell>
   </Row>
   ${students
     .map(
       (s) => `
   <Row>
    <Cell ss:StyleID="Default"><Data ss:Type="Number">${s.num}</Data></Cell>
    <Cell ss:StyleID="Default"><Data ss:Type="String">${s.massarId}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${s.fullName}</Data></Cell>
    <Cell ss:StyleID="Score"><Data ss:Type="Number">${s.score20}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${
      isFr ? s.appreciationFr : s.appreciationAr
    }</Data></Cell>
   </Row>`
     )
     .join("")}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Massar_Export_${trackCode}_${dsKey}_${year}.xml`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify?.("success", "تم تصدير مصنف Excel المعتمد لمنظومة مسار بنجاح!");
  };

  const handleCopyClipboard = () => {
    const text = students
      .map((s) => `${s.massarId}\t${s.fullName}\t${s.score20}\t${s.appreciationAr}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onNotify?.("success", "تم نسخ بيانات مسار إلى الحافظة (لصق مباشر في البوابة).");
    });
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
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  نظام تصدير النقط والملاحظات البيداغوجية لمسار Massar
                </h2>
                <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  MEN Maroc
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {school} | {trackLabelAr} | {dsKey} | الأستاذ: {prof}
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

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block font-medium">عدد المترشحين</span>
            <span className="text-sm font-black text-slate-900">{students.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block font-medium">معدل القسم /20</span>
            <span className="text-sm font-black text-emerald-700">{stats.avg}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block font-medium">نسبة التحكم (≥10)</span>
            <span className="text-sm font-black text-indigo-700">{stats.passRate}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block font-medium">أعلى نقطة</span>
            <span className="text-sm font-black text-teal-700">{stats.max}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block font-medium">أدنى نقطة</span>
            <span className="text-sm font-black text-rose-700">{stats.min}</span>
          </div>
        </div>

        {/* Interactive Students Table */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-300">
                <th className="p-2.5 w-12 text-center">ر.ت</th>
                <th className="p-2.5 w-28 text-center font-mono">رمز مسار</th>
                <th className="p-2.5">الاسم الكامل للتلميذ(ة)</th>
                <th className="p-2.5 w-24 text-center">النقطة /20</th>
                <th className="p-2.5">الملاحظة البيداغوجية لمسار (تلقائية حسب عتبة التحكم)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student, idx) => {
                const isRemedial = student.status === "REMEDIAL";
                return (
                  <tr
                    key={student.num}
                    className={`hover:bg-slate-50/80 transition ${
                      isRemedial ? "bg-rose-50/30" : ""
                    }`}
                  >
                    <td className="p-2.5 text-center font-mono font-bold text-slate-500">
                      {student.num}
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-slate-900 bg-slate-50/50">
                      {student.massarId}
                    </td>
                    <td className="p-2.5 font-bold text-slate-900">
                      {student.fullName}
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={student.score20}
                        onChange={(e) => handleScoreChange(idx, parseFloat(e.target.value))}
                        className={`w-18 text-center py-1 rounded-lg border font-black text-xs ${
                          student.score20 >= 10
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-rose-300 bg-rose-50 text-rose-900"
                        }`}
                      />
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-700 leading-snug">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            student.status === "EXCELLENT"
                              ? "bg-emerald-600"
                              : student.status === "VERY_GOOD"
                              ? "bg-teal-500"
                              : student.status === "GOOD"
                              ? "bg-sky-500"
                              : student.status === "AVERAGE"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span>{isFr ? student.appreciationFr : student.appreciationAr}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ بنجاح" : "نسخ جدول مسار للحافظة"}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير Massar CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcelXml}
              className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>تصدير ملف Excel رسمي</span>
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
