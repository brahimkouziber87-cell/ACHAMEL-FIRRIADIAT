export interface ExcellenceTicketInput {
  studentId: string;
  studentName: string;
  className: string;
  massarCode?: string;
  average?: number | null;
  behaviorStatus?: string;
  rewardCategory?: string;
  rewardPrivilege?: string;
  customNote?: string;
  teacherName?: string;
  schoolName?: string;
  academicYear?: string;
  issueDate?: string;
  ticketSerial?: string;
}

export interface ExcellenceTicketData {
  ticketSerial: string;
  studentId: string;
  studentName: string;
  className: string;
  massarCode: string;
  averageText: string;
  behaviorStatus: string;
  rewardCategory: string;
  rewardPrivilege: string;
  customNote: string;
  teacherName: string;
  schoolName: string;
  academicYear: string;
  issueDate: string;
}

export interface ExerciseSvgAssignment {
  id: string;
  exerciseNumber: number;
  title: string;
  points: number;
  presetId: string;
  svg: string;
}

export const DEFAULT_EXERCISE_SVG_PRESETS: Record<
  string,
  { id: string; label: string; svg: string }
> = {
  sequences_sigma: {
    id: "sequences_sigma",
    label: "المتتاليات العددية (∑ Un)",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/><path d="M44 16 H20 L33 32 L20 48 H44" stroke="#1e3a8a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><text x="35" y="37" fill="#b45309" font-size="13" font-weight="900" font-family="serif">Un</text></svg>`,
  },
  calculus_integral: {
    id: "calculus_integral",
    label: "التحليل والاشتقاق (∫ f'(x))",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#eff6ff" stroke="#1e3a8a" stroke-width="2.5"/><path d="M12 46 C 22 46, 26 18, 36 18 C 44 18, 48 34, 54 24" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/><path d="M27 14 C 23 14, 22 20, 22 32 C 22 44, 21 50, 17 50" stroke="#d97706" stroke-width="3" stroke-linecap="round"/><text x="36" y="47" fill="#1e3a8a" font-size="14" font-weight="900" font-family="serif">f'(x)</text></svg>`,
  },
  logarithm_exp: {
    id: "logarithm_exp",
    label: "اللوغاريتم والأسية (ln / eˣ)",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#f0fdfa" stroke="#0d9488" stroke-width="2.5"/><path d="M14 50 Q 26 48 34 30 T 50 12" stroke="#0d9488" stroke-width="3" stroke-linecap="round"/><text x="16" y="26" fill="#1e3a8a" font-size="13" font-weight="900" font-family="serif">ln(x)</text><text x="36" y="48" fill="#d97706" font-size="13" font-weight="900" font-family="serif">eˣ</text></svg>`,
  },
  geometry_3d: {
    id: "geometry_3d",
    label: "الهندسة الفضائية (3D)",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#ecfdf5" stroke="#047857" stroke-width="2.5"/><polygon points="32,12 50,22 50,42 32,52 14,42 14,22" fill="rgba(16,185,129,0.12)" stroke="#047857" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 12 L32 32 M32 32 L50 42 M32 32 L14 42" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="3 2"/></svg>`,
  },
  complex_plane: {
    id: "complex_plane",
    label: "الأعداد العقدية (z = reⁱθ)",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#f5f3ff" stroke="#6d28d9" stroke-width="2.5"/><line x1="12" y1="36" x2="52" y2="36" stroke="#64748b" stroke-width="2"/><line x1="26" y1="50" x2="26" y2="14" stroke="#64748b" stroke-width="2"/><line x1="26" y1="36" x2="46" y2="20" stroke="#6d28d9" stroke-width="3" stroke-linecap="round"/><circle cx="46" cy="20" r="3.5" fill="#d97706"/><text x="34" y="19" fill="#1e3a8a" font-size="12" font-weight="900" font-family="serif">z=re^iθ</text></svg>`,
  },
  probability_bell: {
    id: "probability_bell",
    label: "الاحتمالات والإحصاء (P(X))",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#fff1f2" stroke="#be123c" stroke-width="2.5"/><path d="M12 46 C 20 46, 24 18, 32 18 C 40 18, 44 46, 52 46" fill="rgba(225,29,72,0.14)" stroke="#be123c" stroke-width="3" stroke-linecap="round"/><line x1="32" y1="18" x2="32" y2="46" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="3 2"/><text x="23" y="55" fill="#1e3a8a" font-size="11" font-weight="900" font-family="serif">P(X)</text></svg>`,
  },
};

export function createExcellenceTicketData(
  input: ExcellenceTicketInput
): ExcellenceTicketData {
  const studentName = (input.studentName || "تلميذ(ة) متميز(ة)").trim();
  const className = (input.className || "2BAC-PC-1").trim();
  const massarCode = (input.massarCode || "M130000000").trim();
  const avgVal =
    typeof input.average === "number" && Number.isFinite(input.average)
      ? `${input.average.toFixed(2)} / 20`
      : "متميز";
  const behaviorStatus = (input.behaviorStatus || "منضبط ومتميز").trim();
  const rewardCategory = (
    input.rewardCategory || "تفوق وتميز في حل المسائل الرياضية والانضباط الصفي"
  ).trim();
  const rewardPrivilege = (
    input.rewardPrivilege ||
    "إشادة رسمية في دفتر التتبع الفردي + أولوية التتويج في لوحة الشرف للقسم"
  ).trim();
  const customNote = (
    input.customNote ||
    "تُمنح هذه التذكرة التقديرية تنويهاً بالاجتهاد المثمر والانخراط الإيجابي الفعال في حصة الرياضيات."
  ).trim();
  const teacherName = (input.teacherName || "الأستاذ إبراهيم قزيبر").trim();
  const schoolName = (input.schoolName || "الثانوية التأهيلية").trim();
  const academicYear = (input.academicYear || "2026 / 2027").trim();
  const issueDate = (
    input.issueDate || new Date().toISOString().slice(0, 10)
  ).trim();
  const serialSuffix = String(
    Math.abs(
      Array.from(studentName + className + issueDate).reduce(
        (acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 9000,
        1000
      )
    )
  ).padStart(4, "0");
  const ticketSerial =
    input.ticketSerial || `EX-${issueDate.slice(0, 4)}-${serialSuffix}`;

  return {
    ticketSerial,
    studentId: input.studentId || "std-1",
    studentName,
    className,
    massarCode,
    averageText: avgVal,
    behaviorStatus,
    rewardCategory,
    rewardPrivilege,
    customNote,
    teacherName,
    schoolName,
    academicYear,
    issueDate,
  };
}

export function svgToDataUri(svgContent: string): string {
  const trimmed = String(svgContent || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:image/svg+xml")) return trimmed;
  let cleanSvg = trimmed;
  if (!cleanSvg.includes("xmlns=")) {
    cleanSvg = cleanSvg.replace(
      "<svg",
      '<svg xmlns="http://www.w3.org/2000/svg"'
    );
  }
  return "data:image/svg+xml;utf8," + encodeURIComponent(cleanSvg);
}

export function buildPrintedHeaderExerciseIconsStripHtml(
  exercises: ExerciseSvgAssignment[]
): string {
  if (!Array.isArray(exercises) || exercises.length === 0) return "";
  const cardsHtml = exercises
    .map((ex, idx) => {
      const uri = svgToDataUri(
        ex.svg || DEFAULT_EXERCISE_SVG_PRESETS.calculus_integral.svg
      );
      const exNum = ex.exerciseNumber || idx + 1;
      const pts = ex.points ? ` (${ex.points} ن)` : "";
      return `
        <div class="printed-header-exercise-svg-badge" data-exercise-number="${exNum}" style="display:inline-flex;align-items:center;gap:6px;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:8px;padding:3px 9px;font-size:0.74rem;font-weight:800;color:#0f172a;">
          <img src="${uri}" alt="أيقونة التمرين ${exNum}" style="width:22px;height:22px;object-fit:contain;border-radius:50%;background:#ffffff;border:1px solid #94a3b8;padding:1px;flex-shrink:0;" />
          <span>التمرين ${exNum}${pts}: <strong style="color:#1e3a8a;">${ex.title}</strong></span>
        </div>
      `;
    })
    .join("");

  return `
    <div id="wbPrintedHeaderExercisesStrip" class="wb-printed-header-exercises-strip" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin-top:8px;padding-top:7px;border-top:1px dashed #cbd5e1;direction:rtl;font-family:'Cairo',sans-serif;">
      <span style="font-size:0.72rem;font-weight:900;color:#475569;">📌 خريطة تمارين الوثيقة:</span>
      ${cardsHtml}
    </div>
  `;
}
