/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * مكتبة التوجيهات والتعليمات الرسمية لإجراء الفروض المحروسة والامتحانات
 * Consignes Officielles des Examens & Évaluations - Mathématiques Lycée Marocain
 * مطابق للمذكرة 142-08 والتوجيهات التربوية 2007
 */

export interface DidacticConsigneItem {
  id: string;
  key: string;
  titleAr: string;
  titleFr: string;
  bodyAr: string;
  bodyFr: string;
  icon: "CALCULATOR" | "BLANCO" | "CARE" | "JUSTIFY" | "GEOMETRY" | "SCALE" | "ETHICS";
  isDefaultActive: boolean;
  category: "EXAM_HEADER" | "GRADING" | "STUDENT_COPY";
}

export const OFFICIAL_DIDACTIC_CONSIGNES: DidacticConsigneItem[] = [
  {
    id: "calc-allowed",
    key: "CALC_ALLOWED",
    titleAr: "الآلة الحاسبة العلمية",
    titleFr: "Calculatrice scientifique",
    bodyAr: "يُسمح باستعمال الآلة الحاسبة العلمية غير القابلة للبرمجة.",
    bodyFr: "L'usage de la calculatrice scientifique non programmable est strictement autorisé.",
    icon: "CALCULATOR",
    isDefaultActive: true,
    category: "EXAM_HEADER",
  },
  {
    id: "blanco-forbidden",
    key: "BLANCO_FORBIDDEN",
    titleAr: "منع استعمال المبيض (Blanco)",
    titleFr: "Interdiction du correcteur",
    bodyAr: "يُمنع منعاً باتاً استعمال المبيض (Blanco) أو القلم الأحمر على ورقة التحرير.",
    bodyFr: "L'usage du correcteur (blanco) et du stylo rouge est formellement interdit sur la copie.",
    icon: "BLANCO",
    isDefaultActive: true,
    category: "EXAM_HEADER",
  },
  {
    id: "care-and-redaction",
    key: "CARE_REDACTION",
    titleAr: "العناية بالورقة وجودة التحرير (1 pt)",
    titleFr: "Soin et clarté de la rédaction (1 pt)",
    bodyAr: "تُخصص نقطة واحدة لجودة الخط، تنظيم ورقة التحرير، وتأطير النتائج النهائية.",
    bodyFr: "1 point est réservé au soin de la copie, à la clarté de la rédaction et à l'encadrement des résultats.",
    icon: "CARE",
    isDefaultActive: true,
    category: "GRADING",
  },
  {
    id: "justify-steps",
    key: "JUSTIFY_STEPS",
    titleAr: "التبرير الرياضي الإلزامي",
    titleFr: "Justification obligatoire",
    bodyAr: "كل نتيجة أو جواب غير معلل بمبرهنة أو قاعدة صريحة يعتبر لاغياً.",
    bodyFr: "Toute affirmation non justifiée par une règle, un théorème ou un calcul explicite sera considérée comme nulle.",
    icon: "JUSTIFY",
    isDefaultActive: true,
    category: "EXAM_HEADER",
  },
  {
    id: "geometry-frame",
    key: "GEOMETRY_FRAME",
    titleAr: "دقة الإنشاءات الهندسية ومقياس المعلم",
    titleFr: "Précision des tracés géométriques",
    bodyAr: "تُراعى الدقة المتناهية في الإنشاءات الهندسية ورسم المنحنيات في المعلم المتعامد الممنظم.",
    bodyFr: "La précision des constructions géométriques et le respect des unités dans le repère sont rigoureusement évalués.",
    icon: "GEOMETRY",
    isDefaultActive: false,
    category: "STUDENT_COPY",
  },
  {
    id: "bareme-indicatif",
    key: "BAREME_INDICATIF",
    titleAr: "سلم التنقيط التقديري",
    titleFr: "Barème indicatif",
    bodyAr: "سلم التنقيط الممنوح لكل سؤال تقديري وقد يخضع لتعديل طفيف أثناء التصحيح الجماعي.",
    bodyFr: "Le barème mentionné est donné à titre indicatif et peut faire l'objet d'un ajustement didactique.",
    icon: "SCALE",
    isDefaultActive: false,
    category: "GRADING",
  },
];
