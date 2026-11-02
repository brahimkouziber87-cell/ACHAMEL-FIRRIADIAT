export type EducationSystem = "MAROC_NATIONAL" | "MISSION_FRANCAISE";
export type CycleType = "ALL" | "TC" | "1BAC" | "2BAC" | "2NDE" | "1ERE_SPE" | "TERM_SPE" | "TERM_EXP" | "TERM_COMPL";
export type DocLanguage = "FR" | "AR" | "BILINGUAL";
export type BilingualLayout = "SIDE_BY_SIDE" | "QUESTION_BY_QUESTION" | "TWO_VERSIONS";
export type ExportFormat = "LATEX" | "TYPST" | "PDF";
export type DocFontFamily =
  | "ACADEMIC_SERIF"
  | "MODERN_SANS"
  | "OFFICIAL_CAIRO"
  | "HANDWRITTEN_SCRIPT"
  | "HANDWRITTEN_NOTEBOOK"
  | "HANDWRITTEN_MAGHRIBI"
  | "HANDWRITTEN_BOARD";
export type DocFontSize = "COMPACT" | "NORMAL" | "LARGE";
export type ModuleType = "DS_142_08" | "DM_SERIE" | "FICHE_OP2007" | "DIAGNOSTIC" | "REPARTITION_CERTIF";
export type DMSubType = "DEVOIR_MAISON" | "SERIE_TD";
export type SemesterType = "S1" | "S2";
export type ExamModel = "A" | "B" | "BOTH";
export type HeaderStyle = "OFFICIAL_AREF" | "MODERN_COMPACT" | "CLASSIC_BORDERED";
export type SolutionDisplayMode = "INLINE_PER_EXERCISE" | "SEPARATE_PAGE_ANNEXES";
export type MoroccanDSStructureMode =
  | "STANDARD_142_08"
  | "QCM_ET_EXERCICES"
  | "EXERCICES_ET_PROBLEME"
  | "COMPLETE_EXAM_MAROC"
  | "EXAMEN_BLANC_2BAC";
export type DSQuestionDensity = "STANDARD" | "INTENSIVE";

export interface DocFontOption {
  id: DocFontFamily;
  labelAr: string;
  labelFr: string;
  shortAr: string;
  isHandwritten: boolean;
  cssClass: string;
}

export const DOC_FONT_OPTIONS: DocFontOption[] = [
  {
    id: "ACADEMIC_SERIF",
    labelAr: "أكاديمي كلاسيكي (Amiri / STIX Math)",
    labelFr: "Académique Serif (STIX Two / Amiri)",
    shortAr: "أكاديمي",
    isHandwritten: false,
    cssClass: "doc-font-academic",
  },
  {
    id: "MODERN_SANS",
    labelAr: "حديث واضح (IBM Plex Sans Arabic)",
    labelFr: "Moderne Sans (IBM Plex / Jakarta)",
    shortAr: "حديث",
    isHandwritten: false,
    cssClass: "doc-font-modern",
  },
  {
    id: "OFFICIAL_CAIRO",
    labelAr: "رسمي وزاري (Cairo / Plus Jakarta)",
    labelFr: "Officiel Ministériel (Cairo)",
    shortAr: "رسمي",
    isHandwritten: false,
    cssClass: "doc-font-official",
  },
  {
    id: "HANDWRITTEN_SCRIPT",
    labelAr: "✍️ خط الرقعة اليدوي للأستاذ (Aref Ruqaa / Caveat)",
    labelFr: "✍️ Écriture Manuscrite Professeur (Caveat / Ruqaa)",
    shortAr: "✍️ رقعة يدوي",
    isHandwritten: true,
    cssClass: "doc-font-handwritten",
  },
  {
    id: "HANDWRITTEN_NOTEBOOK",
    labelAr: "📓 خط الكراسة والدفتر المدرسي (Marhey / Patrick Hand)",
    labelFr: "📓 Cahier Scolaire Manuscrit (Patrick Hand / Marhey)",
    shortAr: "📓 خط الدفتر",
    isHandwritten: true,
    cssClass: "doc-font-notebook",
  },
  {
    id: "HANDWRITTEN_MAGHRIBI",
    labelAr: "🖋️ خط المخطوط المغربي والرقعة (Rakkas / Kalam)",
    labelFr: "🖋️ Calligraphie Marocaine & Plume (Kalam / Rakkas)",
    shortAr: "🖋️ مخطوط مغربي",
    isHandwritten: true,
    cssClass: "doc-font-maghribi",
  },
  {
    id: "HANDWRITTEN_BOARD",
    labelAr: "🧑‍🏫 خط السبورة الهندسي الحر (Lateef / Architects)",
    labelFr: "🧑‍🏫 Tableau & Géométrie Manuscrite (Architects / Lateef)",
    shortAr: "🧑‍🏫 خط السبورة",
    isHandwritten: true,
    cssClass: "doc-font-board",
  },
];

export type TraditionalTitleFontId =
  | "DEFAULT_DOC"
  | "ANDALUSI_MAGHRIBI_SCRIPT"
  | "THULUTH_ROYAL"
  | "DIWANI_SULTANI"
  | "DIWANI_JALI"
  | "RUQAA_INK"
  | "MAGHRIBI_ANDALUSI"
  | "KUFI_GEOMETRIC"
  | "NASKH_AMIRI";

export type TitleCalligraphyScale = "COMPACT" | "BALANCED" | "GRAND";
export type TitleOrnamentStyle =
  | "NONE"
  | "KASHIDA"
  | "ROYAL_BRACKETS"
  | "FULL_SULTANI"
  | "ANDALUSI_MOROCCAN";
export type TitleCalligraphyScope = "MAIN_TITLE_ONLY" | "HEADER_TITLES" | "ALL_TITLES";

export interface TraditionalTitleFontOption {
  id: TraditionalTitleFontId;
  nameAr: string;
  nameFr: string;
  shortAr: string;
  schoolOriginAr: string;
  descriptionAr: string;
  bestForAr: string;
  cssClass: string;
  sampleVerseAr: string;
  recommendedScale: TitleCalligraphyScale;
  recommendedOrnament?: TitleOrnamentStyle;
  letterSpacing?: string;
  wordSpacing?: string;
  lineHeight?: string;
  moroccanHeaderFramePreset?: boolean;
  harmonyBaseScore: number;
}

export const TRADITIONAL_TITLE_FONT_OPTIONS: TraditionalTitleFontOption[] = [
  {
    id: "DEFAULT_DOC",
    nameAr: "خط الوثيقة القياسي (بدون تخصيص خطي للعناوين)",
    nameFr: "Police standard du document",
    shortAr: "قياسي",
    schoolOriginAr: "الخط المعتمد في متن الوثيقة",
    descriptionAr: "يتبع خط الوثيقة العام المختار في الإعدادات دون فصل خط العناوين.",
    bestForAr: "الوثائق الموحدة ثنائية اللغة والامتحانات القياسية",
    cssClass: "",
    sampleVerseAr: "الفرض المحروس الأول في مادة الرياضيات",
    recommendedScale: "BALANCED",
    recommendedOrnament: "NONE",
    letterSpacing: "0em",
    wordSpacing: "0.04em",
    lineHeight: "1.6",
    harmonyBaseScore: 92,
  },
  {
    id: "ANDALUSI_MAGHRIBI_SCRIPT",
    nameAr: "الخط الأندلسي المغربي (Maghribi Script)",
    nameFr: "Calligraphie Andalouse-Maghrébine (Maghribi Script)",
    shortAr: "الأندلسي المغربي",
    schoolOriginAr: "المدرسة الأندلسية المغربية الرسمية (فاس · قرطبة · مراكش)",
    descriptionAr:
      "خط أندلسي مغربي أصيل مضبوط التباعد والمدود مع زخرفة التاج المغربي الأندلسي، معاير خصيصاً ليتناسب مع الترويسة المغربية الرسمية (AREF).",
    bestForAr:
      "الترويسة المغربية الرسمية (المملكة المغربية · الأكاديمية الجهوية) وعناوين الفروض والامتحانات الإشهادية",
    cssClass: "calligraphy-title-andalusi-maghribi-script",
    sampleVerseAr: "❁ ﴾ الفرض المحروس الرّسمي في مادّة الرّياضيات ﴿ ❁",
    recommendedScale: "BALANCED",
    recommendedOrnament: "ANDALUSI_MOROCCAN",
    letterSpacing: "0.025em",
    wordSpacing: "0.14em",
    lineHeight: "1.82",
    moroccanHeaderFramePreset: true,
    harmonyBaseScore: 99,
  },
  {
    id: "THULUTH_ROYAL",
    nameAr: "خط الثلث السلطاني الجليل (Thuluth Royal)",
    nameFr: "Calligraphie Thuluth Royale",
    shortAr: "خط الثلث",
    schoolOriginAr: "مدرسة ابن مقلة وياقوت المستعصمي — سيّد الخطوط العربية",
    descriptionAr:
      "يمتاز بطول الألفات واللامات وفخامة الترويسات المعمارية؛ يمنح عنوان الفرض هيبة رسمية وأكاديمية رفيعة.",
    bestForAr: "العنوان الرئيسي للفرض المحروس، الجذاذات التربوية، والبطاقات التقنية",
    cssClass: "calligraphy-title-thuluth",
    sampleVerseAr: "الفرض المحروس الرّسمي في مادة الرّياضيات",
    recommendedScale: "GRAND",
    recommendedOrnament: "FULL_SULTANI",
    letterSpacing: "0.01em",
    wordSpacing: "0.08em",
    lineHeight: "1.75",
    harmonyBaseScore: 97,
  },
  {
    id: "DIWANI_SULTANI",
    nameAr: "خط الديواني الهمايوني الانسيابي (Diwani Sultani)",
    nameFr: "Calligraphie Diwani Impériale",
    shortAr: "خط الديواني",
    schoolOriginAr: "المدرسة الديوانية العثمانية والمغربية للوثائق السلطانية",
    descriptionAr:
      "خط انسيابي متداخل الحروف ذو استدارات رشيقة وميلان متناغم، مثالي للعناوين الاحتفالية وترويسات المؤسسة.",
    bestForAr: "ترويسة المملكة والمؤسسة وعناوين الفروض المنزلية والمسابقات",
    cssClass: "calligraphy-title-diwani",
    sampleVerseAr: "الفرض المحروس الأوّل — مسلك العلوم الفيزيائية",
    recommendedScale: "BALANCED",
    recommendedOrnament: "ROYAL_BRACKETS",
    letterSpacing: "0.01em",
    wordSpacing: "0.1em",
    lineHeight: "1.85",
    harmonyBaseScore: 94,
  },
  {
    id: "DIWANI_JALI",
    nameAr: "خط الديواني الجلي المزخرف (Diwani Jali)",
    nameFr: "Calligraphie Diwani Jali Ornementale",
    shortAr: "ديواني جلي",
    schoolOriginAr: "مدرسة غزلان بك — الديواني المركّب المزدان بالتشكيل",
    descriptionAr:
      "أكثر كثافة وتقوساً من الديواني العادي مع تراكب هندسي بديع للحروف الكأسية والمدود.",
    bestForAr: "العناوين القصيرة والبارزة باللغة العربية الخالصة",
    cssClass: "calligraphy-title-diwani-jali",
    sampleVerseAr: "سلسلة تمارين التّميّز والأولمبياد في الرّياضيات",
    recommendedScale: "GRAND",
    recommendedOrnament: "FULL_SULTANI",
    letterSpacing: "0.015em",
    wordSpacing: "0.12em",
    lineHeight: "1.95",
    harmonyBaseScore: 91,
  },
  {
    id: "MAGHRIBI_ANDALUSI",
    nameAr: "الخط المغربي المبسوط والثلث الأندلسي (Maghribi)",
    nameFr: "Calligraphie Marocaine & Andalouse",
    shortAr: "مغربي مبسوط",
    schoolOriginAr: "المدرسة الفاسية والأندلسية العريقة بالمملكة المغربية",
    descriptionAr:
      "يعكس الهوية المغربية الأصيلة باستداراته الواسعة في النون والقاف والواو ووضوحه العالي في الطباعة.",
    bestForAr: "ترويسات وزارة التربية الوطنية والأكاديميات الجهوية والفروض المغربية",
    cssClass: "calligraphy-title-maghribi",
    sampleVerseAr: "المملكة المغربية · الفرض المحروس رقم 1",
    recommendedScale: "BALANCED",
    recommendedOrnament: "ANDALUSI_MOROCCAN",
    letterSpacing: "0.015em",
    wordSpacing: "0.1em",
    lineHeight: "1.75",
    moroccanHeaderFramePreset: true,
    harmonyBaseScore: 98,
  },
  {
    id: "RUQAA_INK",
    nameAr: "خط الرقعة الديواني بالحبر الأصيل (Ruqaa Ink)",
    nameFr: "Calligraphie Ruqaa Classique à l'Encre",
    shortAr: "رقعة ديواني",
    schoolOriginAr: "مدرسة ممتاز بك — الخط الأكاديمي الأكثر وضوحاً وسرعة",
    descriptionAr:
      "يجمع بين جمالية القلم المقطوط المائل والصرامة الهندسية الواضحة جداً لتلاميذ الإعدادي والثانوي.",
    bestForAr: "عناوين التمارين الرئيسية والعنوان الفرعي والمدة الزمنية",
    cssClass: "calligraphy-title-ruqaa-ink",
    sampleVerseAr: "التمرين الأول : اتّصال واشتقاق دالة عددية",
    recommendedScale: "BALANCED",
    recommendedOrnament: "NONE",
    letterSpacing: "0.01em",
    wordSpacing: "0.06em",
    lineHeight: "1.65",
    harmonyBaseScore: 96,
  },
  {
    id: "KUFI_GEOMETRIC",
    nameAr: "الخط الكوفي المصحفي والهندسي (Kufi Mamluki)",
    nameFr: "Calligraphie Kufi Géométrique",
    shortAr: "خط كوفي",
    schoolOriginAr: "المدرسة الكوفية الهندسية والمملوكية للعناوين المؤطرة",
    descriptionAr:
      "قائم على التناسب الهندسي المستقيم والزوايا المتزنة، يتناغم بامتياز مع الجداول الرياضية والأطر الهندسية.",
    bestForAr: "عناوين سلاسل التمارين، الأطر المرجعية، وشبكات التقويم",
    cssClass: "calligraphy-title-kufi",
    sampleVerseAr: "شبكة التّخصيص والتّقويم — المذكّرة 142-08",
    recommendedScale: "BALANCED",
    recommendedOrnament: "KASHIDA",
    letterSpacing: "0.02em",
    wordSpacing: "0.08em",
    lineHeight: "1.68",
    harmonyBaseScore: 95,
  },
  {
    id: "NASKH_AMIRI",
    nameAr: "خط النسخ الأميري السلطاني (Naskh Amiri)",
    nameFr: "Calligraphie Naskh Royale (Amiri)",
    shortAr: "نسخ أميري",
    schoolOriginAr: "مدرسة مطبعة بولاق والخط النسخي المحقق",
    descriptionAr:
      "أعلى درجات الوضوح والرصانة الأكاديمية، يقبل الحركات والتشكيل والرموز الرياضية المدمجة دون أي تعارض.",
    bestForAr: "العناوين المزدوجة التي تجمع بين النص العربي والرموز الرياضية أو الفرنسية",
    cssClass: "calligraphy-title-naskh",
    sampleVerseAr: "فرض محروس رقم 1 — الدّورة الأولى (S1)",
    recommendedScale: "BALANCED",
    recommendedOrnament: "NONE",
    letterSpacing: "0.01em",
    wordSpacing: "0.06em",
    lineHeight: "1.7",
    harmonyBaseScore: 99,
  },
];

/**
 * تنسيق العنوان بالكشيدة العربية التقليدية (التطويل الخطي ـ) أو الزخرفة الأندلسية المغربية أو الأقواس السلطانية
 */
export function formatTitleWithCalligraphyOrnaments(
  rawText: string,
  ornament: TitleOrnamentStyle
): string {
  const trimmed = rawText.trim();
  if (!trimmed || ornament === "NONE") return trimmed;

  const applyKashida = (input: string): string => {
    // نضيف الكشيدة (ـ) بذكاء داخل الكلمات العربية الطويلة بعد الحروف المتصلة الملائمة (س، ش، ص، ض، ط، ظ، ع، غ، ف، ق، ك، م)
    return input.replace(
      /([\u0633-\u063A\u0641-\u0643\u0645])([\u0628-\u064A]{2,})/g,
      (match, p1, p2, offset) => {
        if (offset > 28) return match;
        return `${p1}ـ${p2}`;
      }
    );
  };

  if (ornament === "KASHIDA") {
    return applyKashida(trimmed);
  }
  if (ornament === "ROYAL_BRACKETS") {
    return `﴾ ${trimmed} ﴿`;
  }
  if (ornament === "FULL_SULTANI") {
    return `۞ ﴾ ${applyKashida(trimmed)} ﴿ ۞`;
  }
  if (ornament === "ANDALUSI_MOROCCAN") {
    return `❁ ﴾ ${applyKashida(trimmed)} ﴿ ❁`;
  }
  return trimmed;
}

export interface TitleOrnamentMiniPreview {
  id: TitleOrnamentStyle;
  miniIconGlyph: string;
  labelAr: string;
  shortBadgeAr: string;
  descriptionAr: string;
}

export function getTitleOrnamentMiniPreview(
  ornament: TitleOrnamentStyle,
  enabled: boolean = true
): TitleOrnamentMiniPreview {
  if (!enabled || ornament === "NONE") {
    return {
      id: "NONE",
      miniIconGlyph: "أبجد",
      labelAr: "بدون زخرفة إضافية (نص صافي)",
      shortBadgeAr: "نص صافي",
      descriptionAr: "عرض ترويسة الفرض بنص خطي صافٍ دون أقواس أو شمسات زخرفية",
    };
  }
  switch (ornament) {
    case "ANDALUSI_MOROCCAN":
      return {
        id: "ANDALUSI_MOROCCAN",
        miniIconGlyph: "❁﴾ـ﴿❁",
        labelAr: "زخرفة أندلسية مغربية رسمية ❁ ﴾ ... ﴿ ❁",
        shortBadgeAr: "تاج أندلسي ❁",
        descriptionAr: "تاج الوردة الأندلسية المغربية مع أقواس سلطانية وكشيدة متزنة لترويسة AREF",
      };
    case "FULL_SULTANI":
      return {
        id: "FULL_SULTANI",
        miniIconGlyph: "۞﴾ـ﴿۞",
        labelAr: "ترويسة سلطانية كاملة ۞ ﴾ ... ﴿ ۞",
        shortBadgeAr: "شمسة سلطانية ۞",
        descriptionAr: "شمسة مصحفية مذهبة مع أقواس سلطانية وتطويل الحروف بالكشيدة",
      };
    case "ROYAL_BRACKETS":
      return {
        id: "ROYAL_BRACKETS",
        miniIconGlyph: "﴾ ... ﴿",
        labelAr: "أقواس سلطانية مزخرفة ﴾ ... ﴿",
        shortBadgeAr: "أقواس ﴾...﴿",
        descriptionAr: "تأطير العنوان الرئيسي بأقواس قرآنية وسلطانية رصينة بدون كشيدة",
      };
    case "KASHIDA":
      return {
        id: "KASHIDA",
        miniIconGlyph: "بـسـم",
        labelAr: "تطويل الحروف بالكشيدة الخطية (ـ)",
        shortBadgeAr: "كشيدة خطية ـ",
        descriptionAr: "تمديد أفقي متناغم للحروف المتصلة وفق ميزان السطر المغربي",
      };
  }
}

export type MoroccanHeaderSvgFrame =
  | "NONE"
  | "ZELLIGE_FEZ"
  | "ANDALUSI_ARCH"
  | "SULTANI_STAR";

export interface MoroccanHeaderSvgFrameOption {
  id: MoroccanHeaderSvgFrame;
  labelAr: string;
  shortAr: string;
  descriptionAr: string;
}

export const MOROCCAN_HEADER_SVG_FRAME_OPTIONS: MoroccanHeaderSvgFrameOption[] = [
  {
    id: "NONE",
    labelAr: "بدون إطار هندسي SVG",
    shortAr: "بدون إطار",
    descriptionAr: "الاكتفاء بالزخرفة النصية والخط الأندلسي دون إطار هندسي شعاعي",
  },
  {
    id: "ZELLIGE_FEZ",
    labelAr: "إفريز الزليج الفاسي المثمن (Zellige de Fès)",
    shortAr: "زليج فاسي ❖",
    descriptionAr: "شريط علوي وسفلي وزوايا هندسية بنجمة الزليج الفاسي المثمنة عالية الدقة للطباعة",
  },
  {
    id: "ANDALUSI_ARCH",
    labelAr: "قوس المحراب الأندلسي المغربي (Arc Andalou)",
    shortAr: "قوس أندلسي  arches",
    descriptionAr: "تأطير علوي مقوس مستوحى من الأقواس الأندلسية المغربية في مدارس فاس ومراكش",
  },
  {
    id: "SULTANI_STAR",
    labelAr: "الشمسة السلطانية المتماثلة (Rosace Sultanie)",
    shortAr: "شمسة سلطانية ۞",
    descriptionAr: "شمسات هندسية جانبية متناظرة بدقة Vector SVG تحيط بعنوان الفرض أو الامتحان",
  },
];

export interface ExamenBlanc2BacDomainWeight {
  domainAr: string;
  domainFr: string;
  targetPoints: number;
  percentage: number;
  detailsAr: string;
}

export interface ExamenBlanc2BacSpec {
  trackCode: string;
  cadreReferenceTitleAr: string;
  cadreReferenceTitleFr: string;
  officialDurationAr: string;
  officialDurationFr: string;
  coefficient: number;
  domains: ExamenBlanc2BacDomainWeight[];
}

export function getExamenBlanc2BacConfig(trackCode: string): ExamenBlanc2BacSpec {
  const normalized = (trackCode || "").toUpperCase();
  if (normalized.includes("SM")) {
    return {
      trackCode: normalized,
      cadreReferenceTitleAr: "الإطار المرجعي للامتحان الوطني الموحد للبكالوريا — مسلك العلوم الرياضية (أ & ب)",
      cadreReferenceTitleFr: "Cadre de Référence de l'Examen National — 2BAC Sciences Mathématiques (A & B)",
      officialDurationAr: "4 ساعات",
      officialDurationFr: "4 heures",
      coefficient: 9,
      domains: [
        {
          domainAr: "التحليل (المتتاليات، التكامل، المعادلات التفاضلية، مسألة الدوال)",
          domainFr: "Analyse (Suites, Intégrales, Éq. Différentielles & Problème de synthèse)",
          targetPoints: 10,
          percentage: 50,
          detailsAr: "مسألة شاملة + تمرين تحليل معمق (10 نقط / 20)",
        },
        {
          domainAr: "الأعداد العقدية والتطبيقات الهندسية",
          domainFr: "Nombres Complexes & Transformations Géométriques",
          targetPoints: 3.5,
          percentage: 17.5,
          detailsAr: "الأعداد العقدية والتحويلات الاعتيادية في المستوى (3.5 نقط / 20)",
        },
        {
          domainAr: "الحسابيات في Z والبنيات الجبرية",
          domainFr: "Arithmétique dans Z & Structures Algébriques",
          targetPoints: 3.5,
          percentage: 17.5,
          detailsAr: "الموافقات والأعداد الأولية + الزمر والحلقات والفضاءات المتجهية (3.5 نقط / 20)",
        },
        {
          domainAr: "حساب الاحتمالات والمتغيرات العشوائية",
          domainFr: "Calcul des Probabilités & Variables Aléatoires",
          targetPoints: 3,
          percentage: 15,
          detailsAr: "الاحتمالات الشرطية، الاستقلالية، والقانون الحداني (3 نقط / 20)",
        },
      ],
    };
  }
  if (normalized.includes("ECO") || normalized.includes("SGC")) {
    return {
      trackCode: normalized,
      cadreReferenceTitleAr: "الإطار المرجعي للامتحان الوطني الموحد للبكالوريا — مسلك العلوم الاقتصادية والتدبير",
      cadreReferenceTitleFr: "Cadre de Référence de l'Examen National — 2BAC Sciences Économiques & Gestion",
      officialDurationAr: "ساعتان (2 س)",
      officialDurationFr: "2 heures",
      coefficient: 4,
      domains: [
        {
          domainAr: "التحليل ودراسة الدوال العددية واللوغاريتمية والأسية",
          domainFr: "Analyse & Étude de fonctions (ln, exp, calcul intégral)",
          targetPoints: 11,
          percentage: 55,
          detailsAr: "مسألة تركيبية لدراسة دالة وتأويلاتها الاقتصادية والهندسية (11 نقطة / 20)",
        },
        {
          domainAr: "المتتاليات العددية",
          domainFr: "Suites Numériques",
          targetPoints: 4.5,
          percentage: 22.5,
          detailsAr: "المتتاليات الترجعية والهندسية والحسابية والنهايات (4.5 نقط / 20)",
        },
        {
          domainAr: "حساب الاحتمالات",
          domainFr: "Calcul des Probabilités",
          targetPoints: 4.5,
          percentage: 22.5,
          detailsAr: "التعداد، الاحتمالات الشرطية، المتغير العشوائي والأمل الرياضي (4.5 نقط / 20)",
        },
      ],
    };
  }
  // Default: 2BAC PC / SVT / STE / STM
  return {
    trackCode: normalized || "2BAC_PC",
    cadreReferenceTitleAr: "الإطار المرجعي للامتحان الوطني الموحد للبكالوريا — شعب العلوم التجريبية والتكنولوجيات (PC / SVT)",
    cadreReferenceTitleFr: "Cadre de Référence de l'Examen National — 2BAC Sciences Expérimentales (PC / SVT)",
    officialDurationAr: "3 ساعات",
    officialDurationFr: "3 heures",
    coefficient: 7,
    domains: [
      {
        domainAr: "التحليل (المتتاليات العددية، التكامل، ومسألة الدوال اللوغاريتمية/الأسية)",
        domainFr: "Analyse (Suites numériques, Calcul intégral & Problème de synthèse ln/exp)",
        targetPoints: 11,
        percentage: 55,
        detailsAr: "مسألة تركيبية (8 إلى 8.5 ن) + تمرين المتتاليات أو التكامل (2.5 إلى 3 ن)",
      },
      {
        domainAr: "الأعداد العقدية وتطبيقاتها الهندسية",
        domainFr: "Nombres Complexes & Interprétation Géométrique",
        targetPoints: 3,
        percentage: 15,
        detailsAr: "الشكل المثلثي والأسّي، المعادلات في C، والإزاحة/التحاكي/الدوران (3 نقط / 20)",
      },
      {
        domainAr: "الهندسة الفضائية (الجداء السلمي والمتجهي، الفلكة والمستوى)",
        domainFr: "Géométrie dans l'Espace (Produit scalaire & vectoriel, Sphère et Plan)",
        targetPoints: 3,
        percentage: 15,
        detailsAr: "معادلة مستوى، الفلكة، المسافة والتقاطعات في الفضاء (3 نقط / 20)",
      },
      {
        domainAr: "حساب الاحتمالات والمتغيرات العشوائية",
        domainFr: "Calcul des Probabilités & Loi Binomiale",
        targetPoints: 3,
        percentage: 15,
        detailsAr: "السحب، الاحتمال الشرطي، المتغير العشوائي والقانون الحداني (3 نقط / 20)",
      },
    ],
  };
}

export interface CalligraphyHarmonyReport {
  score: number;
  status: "EXCELLENT" | "GOOD" | "WARNING";
  statusLabelAr: string;
  arabicRatioPercent: number;
  wordCount: number;
  charLength: number;
  notesAr: string[];
  recommendationAr: string;
}

/**
 * تحليل تناسق العنوان مع الخط العربي التقليدي المختار (الأندلسي المغربي / الديواني / الثلث / الكوفي / المغربي...) قبل الاعتماد النهائي
 */
export function evaluateTitleCalligraphyHarmony(
  title: string,
  subtitle: string,
  fontId: TraditionalTitleFontId,
  scale: TitleCalligraphyScale
): CalligraphyHarmonyReport {
  const cleanTitle = (title || "").trim();
  const fontMeta =
    TRADITIONAL_TITLE_FONT_OPTIONS.find((f) => f.id === fontId) ||
    TRADITIONAL_TITLE_FONT_OPTIONS[0];

  const charLength = cleanTitle.length;
  const words = cleanTitle.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const arabicChars = (cleanTitle.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (cleanTitle.match(/[A-Za-z]/g) || []).length;
  const totalAlpha = Math.max(1, arabicChars + latinChars);
  const arabicRatioPercent = Math.round((arabicChars / totalAlpha) * 100);

  let score = fontMeta.harmonyBaseScore;
  const notesAr: string[] = [];

  if (fontId === "ANDALUSI_MAGHRIBI_SCRIPT") {
    notesAr.push(
      "ضبط مثالي لتباعد الحروف (0.025em) وتباعد الكلمات (0.14em) وارتفاع السطر (1.82) مع زخرفة التاج الأندلسي المغربي ❁ ﴾ ... ﴿ ❁ المتناغمة مع الترويسة المغربية الرسمية (AREF)."
    );
    if (latinChars > 10) {
      score -= 4;
      notesAr.push(
        "يُستحسن إبراز العنوان بالعربية الفصحى لإظهار تقوسات النون والقاف الأندلسية المغربية في أبهى حلة."
      );
    }
  } else if (fontId === "DIWANI_SULTANI" || fontId === "DIWANI_JALI") {
    if (latinChars > 4) {
      score -= 14;
      notesAr.push(
        "يحتوي العنوان على كلمات فرنسية/لاتينية؛ خط الديواني يتألق أكثر مع العناوين العربية الخالصة."
      );
    } else {
      notesAr.push("نسبة الحروف العربية مثالية لانسيابية وتقوسات خط الديواني.");
    }

    if (charLength > 52) {
      score -= 8;
      notesAr.push(
        "العنوان طويل نسبياً لخط الديواني؛ يُستحسن اختيار الحجم «المتوازن» لتجنب ازدحام الكؤوس والمدود."
      );
    } else {
      notesAr.push("طول العنوان متزن ويسمح بظهور رشاقتَي الألف واللام الديوانية.");
    }
  } else if (fontId === "THULUTH_ROYAL") {
    if (scale === "COMPACT") {
      score -= 6;
      notesAr.push(
        "خط الثلث السلطاني يحتاج إلى مساحة رأسية لإبراز الترويسات؛ الحجم «المتوازن» أو «الجلي» أفضل."
      );
    } else {
      notesAr.push("المساحة الرأسية والحجم المختار يبرزان هيبة الألفات في خط الثلث الجليل.");
    }
    if (latinChars > 8) {
      score -= 7;
      notesAr.push("يفضل تقليل المختصرات اللاتينية داخل عنوان الثلث للحفاظ على وحدة السطر الخطي.");
    }
  } else if (fontId === "MAGHRIBI_ANDALUSI" || fontId === "RUQAA_INK") {
    notesAr.push(
      "تناسق ممتاز مع الهوية البصرية للترويسة المدرسية المغربية ووضوح عالٍ في الطباعة الورقية (A4)."
    );
  } else if (fontId === "KUFI_GEOMETRIC") {
    notesAr.push(
      "استقامة الحروف الكوفية تتناغم هندسياً مع إطار الترويسة وجدول التنقيط المسطر."
    );
  } else {
    notesAr.push("وضوح أكاديمي قياسي متوافق مع النصوص العربية والفرنسية والرموز الرياضية.");
  }

  if (subtitle.trim().length > 0 && subtitle.trim().length < 75) {
    notesAr.push("توازن بصري متناسق بين العنوان الرئيسي والعنوان الفرعي والمدة الزمنية.");
  }

  score = Math.max(68, Math.min(99, score));
  const status: "EXCELLENT" | "GOOD" | "WARNING" =
    score >= 92 ? "EXCELLENT" : score >= 82 ? "GOOD" : "WARNING";

  const statusLabelAr =
    status === "EXCELLENT"
      ? "تناسق بصري وطباعي ممتاز"
      : status === "GOOD"
      ? "تناسق جيد وملائم للطباعة"
      : "يُنصح بضبط الحجم أو تقليل الرموز اللاتينية";

  const recommendationAr =
    status === "WARNING"
      ? "جرّب «الخط الأندلسي المغربي (Maghribi Script)» أو «الثلث السلطاني» أو «النسخ الأميري» إذا كان العنوان مزدوج اللغة (عربي/فرنسي)."
      : `الخط «${fontMeta.shortAr}» بالحجم والتباعد الحالي متناسق تماماً مع ترويسة الورقة المغربية الرسمية (A4) وجاهز للاعتماد النهائي.`;

  return {
    score,
    status,
    statusLabelAr,
    arabicRatioPercent,
    wordCount,
    charLength,
    notesAr,
    recommendationAr,
  };
}

export interface MissionSchoolPreset {
  id: string;
  name: string;
  city: string;
  network: "AEFE" | "OSUI" | "EGD";
}

export const MISSION_SCHOOLS: MissionSchoolPreset[] = [
  { id: "lyautey", name: "Lycée Lyautey", city: "Casablanca", network: "EGD" },
  { id: "descartes", name: "Lycée Descartes", city: "Rabat", network: "EGD" },
  { id: "massignon", name: "Lycée Louis Massignon", city: "Casablanca (Bouskoura)", network: "OSUI" },
  { id: "victor_hugo", name: "Lycée Victor Hugo", city: "Marrakech", network: "AEFE" },
  { id: "regnault", name: "Lycée Regnault", city: "Tanger", network: "EGD" },
  { id: "paul_valery", name: "Lycée Paul Valéry", city: "Meknès", network: "AEFE" },
  { id: "andre_malraux", name: "Lycée André Malraux", city: "Rabat", network: "OSUI" },
  { id: "lfia", name: "Lycée Français International d'Agadir", city: "Agadir", network: "OSUI" },
  { id: "majorelle", name: "Lycée Jacques Majorelle", city: "Marrakech", network: "OSUI" },
];

export const FRENCH_COMPETENCIES = [
  { id: "CHERCHER", label: "Chercher", desc: "Analyser, expérimenter, conjecturer et décomposer un problème complexe" },
  { id: "MODELISER", label: "Modéliser", desc: "Traduire une situation réelle en langage mathématique et valider le modèle" },
  { id: "REPRESENTER", label: "Représenter", desc: "Choisir un cadre adapté (algébrique, géométrique, graphique, probabiliste)" },
  { id: "RAISONNER", label: "Raisonner", desc: "Développer une démarche logique, démontrer, réfuter par contre-exemple" },
  { id: "CALCULER", label: "Calculer", desc: "Mener à bien des calculs algébriques, formels et numériques avec précision" },
  { id: "COMMUNIQUER", label: "Communiquer", desc: "Rédiger une démonstration rigoureuse avec notations mathématiques claires" },
];

export type LessonMainCategory = "Algebra" | "Calculus" | "Geometry" | "Probabilities";

export type LessonSubCategory =
  | "جبر"
  | "تحليل"
  | "هندسة فضائية"
  | "هندسة مستوية"
  | "حساب مثلثي"
  | "حسابيات"
  | "أعداد عقدية"
  | "احتمالات وإحصاء"
  | "منطق ومجموعات"
  | "مصفوفات ورسوم بيانية"
  | "بنيات جبرية";

export interface LessonTagFilterOption {
  id: string;
  labelAr: string;
  labelFr: string;
  group: "MAIN" | "SUB" | "TOPIC";
  colorClass: string;
}

export const LESSON_TAG_OPTIONS: LessonTagFilterOption[] = [
  // التصنيفات الفرعية الدقيقة (Sub-classifications)
  {
    id: "جبر",
    labelAr: "جبر (Algèbre)",
    labelFr: "Algèbre (جبر)",
    group: "SUB",
    colorClass: "bg-amber-50 text-amber-900 border-amber-200",
  },
  {
    id: "تحليل",
    labelAr: "تحليل (Analyse)",
    labelFr: "Analyse (تحليل)",
    group: "SUB",
    colorClass: "bg-indigo-50 text-indigo-900 border-indigo-200",
  },
  {
    id: "هندسة فضائية",
    labelAr: "هندسة فضائية (Géométrie dans l'espace)",
    labelFr: "Géométrie dans l'espace (هندسة فضائية)",
    group: "SUB",
    colorClass: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
  {
    id: "هندسة مستوية",
    labelAr: "هندسة مستوية (Géométrie plane)",
    labelFr: "Géométrie plane (هندسة مستوية)",
    group: "SUB",
    colorClass: "bg-teal-50 text-teal-900 border-teal-200",
  },
  {
    id: "أعداد عقدية",
    labelAr: "أعداد عقدية (Nombres complexes)",
    labelFr: "Nombres complexes (أعداد عقدية)",
    group: "SUB",
    colorClass: "bg-purple-50 text-purple-900 border-purple-200",
  },
  {
    id: "حسابيات",
    labelAr: "حسابيات (Arithmétique)",
    labelFr: "Arithmétique (حسابيات)",
    group: "SUB",
    colorClass: "bg-cyan-50 text-cyan-900 border-cyan-200",
  },
  {
    id: "حساب مثلثي",
    labelAr: "حساب مثلثي (Trigonométrie)",
    labelFr: "Trigonométrie (حساب مثلثي)",
    group: "SUB",
    colorClass: "bg-sky-50 text-sky-900 border-sky-200",
  },
  {
    id: "احتمالات وإحصاء",
    labelAr: "احتمالات وإحصاء (Probabilités & Stats)",
    labelFr: "Probabilités & Statistiques (احتمالات وإحصاء)",
    group: "SUB",
    colorClass: "bg-rose-50 text-rose-900 border-rose-200",
  },
  {
    id: "منطق ومجموعات",
    labelAr: "منطق ومجموعات (Logique & Ensembles)",
    labelFr: "Logique & Ensembles (منطق ومجموعات)",
    group: "SUB",
    colorClass: "bg-orange-50 text-orange-900 border-orange-200",
  },
  {
    id: "مصفوفات ورسوم بيانية",
    labelAr: "مصفوفات ورسوم بيانية (Matrices & Graphes)",
    labelFr: "Matrices & Graphes (مصفوفات ورسوم بيانية)",
    group: "SUB",
    colorClass: "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200",
  },
  {
    id: "بنيات جبرية",
    labelAr: "بنيات جبرية (Structures algébriques)",
    labelFr: "Structures algébriques (بنيات جبرية)",
    group: "SUB",
    colorClass: "bg-amber-50 text-amber-900 border-amber-300",
  },
  // محاور فرعية إضافية للتحليل
  {
    id: "متتاليات عددية",
    labelAr: "متتاليات عددية (Suites numériques)",
    labelFr: "Suites numériques (متتاليات عددية)",
    group: "TOPIC",
    colorClass: "bg-blue-50 text-blue-900 border-blue-200",
  },
  {
    id: "حساب تكاملي ومعادلات تفاضلية",
    labelAr: "حساب تكاملي ومعادلات تفاضلية (Intégrales & Éq. Diff.)",
    labelFr: "Intégrales & Éq. Différentielles",
    group: "TOPIC",
    colorClass: "bg-violet-50 text-violet-900 border-violet-200",
  },
  // التصنيفات الكبرى العامّة (Main Categories)
  {
    id: "Algebra",
    labelAr: "Algebra — الجبر العام والحسابيات",
    labelFr: "Algebra — Algèbre & Arithmétique",
    group: "MAIN",
    colorClass: "bg-amber-100/80 text-amber-950 border-amber-300",
  },
  {
    id: "Calculus",
    labelAr: "Calculus — التحليل والدوال والمتتاليات",
    labelFr: "Calculus — Analyse & Fonctions",
    group: "MAIN",
    colorClass: "bg-indigo-100/80 text-indigo-950 border-indigo-300",
  },
  {
    id: "Geometry",
    labelAr: "Geometry — الهندسة الفضائية والمستوية",
    labelFr: "Geometry — Géométrie plane & espace",
    group: "MAIN",
    colorClass: "bg-emerald-100/80 text-emerald-950 border-emerald-300",
  },
  {
    id: "Probabilities",
    labelAr: "Probabilities — الاحتمالات والإحصاء",
    labelFr: "Probabilities — Probabilités & Statistiques",
    group: "MAIN",
    colorClass: "bg-rose-100/80 text-rose-950 border-rose-300",
  },
];

export type LessonHeaderIconId =
  | "AUTO"
  | "FUNCTION"
  | "SEQUENCE"
  | "GEOMETRY"
  | "COMPLEX"
  | "PROBABILITY"
  | "INTEGRAL"
  | "ALGEBRA"
  | "LOGIC"
  | "NONE";

export interface LessonHeaderIconOption {
  id: LessonHeaderIconId;
  labelAr: string;
  labelFr: string;
  shortAr: string;
  shortFr: string;
  mathSymbol: string;
  latexPrefix: string;
  typstPrefix: string;
  badgeColorClass: string;
  accentHex: string;
}

export const LESSON_HEADER_ICON_OPTIONS: LessonHeaderIconOption[] = [
  {
    id: "AUTO",
    labelAr: "تلقائي (حسب محور الدرس)",
    labelFr: "Auto (selon le chapitre)",
    shortAr: "تلقائي",
    shortFr: "Auto",
    mathSymbol: "✨",
    latexPrefix: "",
    typstPrefix: "",
    badgeColorClass: "bg-slate-100 text-slate-800 border-slate-300",
    accentHex: "#334155",
  },
  {
    id: "FUNCTION",
    labelAr: "أيقونة دالة ومنحنى بياني — f(x)",
    labelFr: "Icône Fonction & Courbe — f(x)",
    shortAr: "دالة f(x)",
    shortFr: "Fonction f(x)",
    mathSymbol: "f(x)",
    latexPrefix: "$[f(x)]$",
    typstPrefix: "[$f(x)$]",
    badgeColorClass: "bg-indigo-50 text-indigo-950 border-indigo-300",
    accentHex: "#1d4ed8",
  },
  {
    id: "SEQUENCE",
    labelAr: "أيقونة متتالية عددية — (uₙ)",
    labelFr: "Icône Suite Numérique — (uₙ)",
    shortAr: "متتالية (uₙ)",
    shortFr: "Suite (uₙ)",
    mathSymbol: "(uₙ)",
    latexPrefix: "$[(u_n)]$",
    typstPrefix: "[$(u_n)$]",
    badgeColorClass: "bg-blue-50 text-blue-950 border-blue-300",
    accentHex: "#0369a1",
  },
  {
    id: "GEOMETRY",
    labelAr: "أيقونة هندسة مستوية/فضائية — △",
    labelFr: "Icône Géométrie Plane/Espace — △",
    shortAr: "هندسة △",
    shortFr: "Géométrie △",
    mathSymbol: "△",
    latexPrefix: "$[\\triangle]$",
    typstPrefix: "[△]",
    badgeColorClass: "bg-emerald-50 text-emerald-950 border-emerald-300",
    accentHex: "#047857",
  },
  {
    id: "COMPLEX",
    labelAr: "أيقونة الأعداد العقدية — ℂ",
    labelFr: "Icône Nombres Complexes — ℂ",
    shortAr: "عقدية ℂ",
    shortFr: "Complexes ℂ",
    mathSymbol: "ℂ",
    latexPrefix: "$[\\mathbb{C}]$",
    typstPrefix: "[ℂ]",
    badgeColorClass: "bg-purple-50 text-purple-950 border-purple-300",
    accentHex: "#6d28d9",
  },
  {
    id: "PROBABILITY",
    labelAr: "أيقونة الاحتمالات والإحصاء — P(A)",
    labelFr: "Icône Probabilités & Stats — P(A)",
    shortAr: "احتمالات P(A)",
    shortFr: "Probas P(A)",
    mathSymbol: "P(A)",
    latexPrefix: "$[P(A)]$",
    typstPrefix: "[$P(A)$]",
    badgeColorClass: "bg-rose-50 text-rose-950 border-rose-300",
    accentHex: "#be123c",
  },
  {
    id: "INTEGRAL",
    labelAr: "أيقونة التكامل والمعادلات التفاضلية — ∫",
    labelFr: "Icône Intégrale & Éq. Diff. — ∫",
    shortAr: "تكامل ∫",
    shortFr: "Intégrale ∫",
    mathSymbol: "∫",
    latexPrefix: "$[\\int]$",
    typstPrefix: "[$integral$]",
    badgeColorClass: "bg-violet-50 text-violet-950 border-violet-300",
    accentHex: "#4c1d95",
  },
  {
    id: "ALGEBRA",
    labelAr: "أيقونة الجبر والحسابيات — ∑",
    labelFr: "Icône Algèbre & Arithmétique — ∑",
    shortAr: "جبر ∑",
    shortFr: "Algèbre ∑",
    mathSymbol: "∑",
    latexPrefix: "$[\\sum]$",
    typstPrefix: "[$sum$]",
    badgeColorClass: "bg-amber-50 text-amber-950 border-amber-300",
    accentHex: "#b45309",
  },
  {
    id: "LOGIC",
    labelAr: "أيقونة المنطق والمجموعات — ∀∃",
    labelFr: "Icône Logique & Ensembles — ∀∃",
    shortAr: "منطق ∀∃",
    shortFr: "Logique ∀∃",
    mathSymbol: "∀∃",
    latexPrefix: "$[\\forall\\exists]$",
    typstPrefix: "[∀∃]",
    badgeColorClass: "bg-orange-50 text-orange-950 border-orange-300",
    accentHex: "#c2410c",
  },
  {
    id: "NONE",
    labelAr: "بدون أيقونة في ترويسة التمرين",
    labelFr: "Sans icône dans l'en-tête",
    shortAr: "بدون أيقونة",
    shortFr: "Aucune",
    mathSymbol: "∅",
    latexPrefix: "",
    typstPrefix: "",
    badgeColorClass: "bg-slate-50 text-slate-500 border-slate-200",
    accentHex: "#64748b",
  },
];

export interface LessonItem {
  lessonAr: string;
  lessonFr: string;
  weight: number;
  hours: string;
  category?: LessonMainCategory | string;
  subCategory?: LessonSubCategory | string;
  subCategoryFr?: string;
  tags?: string[];
  capacitiesAr: string[];
  capacitiesFr: string[];
  sampleExerciseAr?: string[];
  sampleExerciseFr?: string[];
  sampleExerciseModelB_Ar?: string[];
  sampleExerciseModelB_Fr?: string[];
  sampleSolutionAr?: string[];
  sampleSolutionFr?: string[];
  sampleSolutionModelB_Ar?: string[];
  sampleSolutionModelB_Fr?: string[];
  customQuestionBaremes?: number[];
  customQuestionLevels?: Array<"N1" | "N2" | "N3">;
  hasCustomQuestions?: boolean;
  isImportedSimulation?: boolean;
  importedOriginLabel?: string;
  customHeaderIcon?: LessonHeaderIconId;
}

export function detectAutoLessonHeaderIconId(
  lesson?: LessonItem
): Exclude<LessonHeaderIconId, "AUTO" | "NONE"> {
  if (!lesson) return "FUNCTION";
  const text = `${lesson.lessonAr || ""} ${lesson.lessonFr || ""} ${
    lesson.subCategory || ""
  } ${lesson.category || ""} ${(lesson.tags || []).join(" ")}`.toLowerCase();

  if (
    text.includes("متتالي") ||
    text.includes("suite") ||
    text.includes("u_n") ||
    text.includes("ترجعي")
  ) {
    return "SEQUENCE";
  }
  if (
    text.includes("تكامل") ||
    text.includes("أصلية") ||
    text.includes("تفاضلي") ||
    text.includes("intégral") ||
    text.includes("primitive") ||
    text.includes("différentielle")
  ) {
    return "INTEGRAL";
  }
  if (text.includes("عقدي") || text.includes("complexe")) {
    return "COMPLEX";
  }
  if (
    text.includes("هندسة") ||
    text.includes("فضاء") ||
    text.includes("فضائية") ||
    text.includes("مستوية") ||
    text.includes("مثلثي") ||
    text.includes("مرجح") ||
    text.includes("سلمي") ||
    text.includes("متجه") ||
    text.includes("فلكة") ||
    text.includes("دوران") ||
    text.includes("تحاكي") ||
    text.includes("إزاحة") ||
    text.includes("géométrie") ||
    text.includes("espace") ||
    text.includes("trigonom") ||
    text.includes("scalaire") ||
    text.includes("vectoriel") ||
    text.includes("barycentre") ||
    text.includes("rotation") ||
    text.includes("homothétie") ||
    text.includes("sphère") ||
    text.includes("vecteur") ||
    lesson.category === "Geometry"
  ) {
    return "GEOMETRY";
  }
  if (
    text.includes("احتمال") ||
    text.includes("إحصاء") ||
    text.includes("تعداد") ||
    text.includes("عشوائي") ||
    text.includes("probabilit") ||
    text.includes("statist") ||
    text.includes("dénombrement") ||
    text.includes("aléatoire") ||
    lesson.category === "Probabilities"
  ) {
    return "PROBABILITY";
  }
  if (
    text.includes("منطق") ||
    text.includes("مجموعات") ||
    text.includes("تطبيقات") ||
    text.includes("logique") ||
    text.includes("ensemble") ||
    text.includes("application")
  ) {
    return "LOGIC";
  }
  if (
    text.includes("حسابيات") ||
    text.includes("بنيات") ||
    text.includes("مصفوف") ||
    text.includes("حدوديات") ||
    text.includes("جبر") ||
    text.includes("نظمة") ||
    text.includes("arithmétique") ||
    text.includes("structure") ||
    text.includes("matrice") ||
    text.includes("polynôme") ||
    text.includes("algèbre") ||
    lesson.category === "Algebra"
  ) {
    return "ALGEBRA";
  }
  return "FUNCTION";
}

export function resolveLessonHeaderIcon(
  lesson?: LessonItem,
  explicitOverride?: LessonHeaderIconId
): LessonHeaderIconOption | null {
  const chosenId = explicitOverride ?? lesson?.customHeaderIcon ?? "AUTO";
  if (chosenId === "NONE") return null;
  const resolvedId =
    chosenId === "AUTO" ? detectAutoLessonHeaderIconId(lesson) : chosenId;
  return (
    LESSON_HEADER_ICON_OPTIONS.find((opt) => opt.id === resolvedId) ||
    LESSON_HEADER_ICON_OPTIONS[1]
  );
}

export function getLessonTags(lesson: LessonItem): string[] {
  const set = new Set<string>();
  if (lesson.subCategory) set.add(lesson.subCategory);
  if (lesson.category) set.add(lesson.category);
  if (Array.isArray(lesson.tags)) {
    lesson.tags.forEach((t) => set.add(t));
  }
  return Array.from(set);
}

export function getLessonBadgeColor(tagOrSubCategory?: string): string {
  const found = LESSON_TAG_OPTIONS.find((o) => o.id === tagOrSubCategory);
  return found ? found.colorClass : "bg-slate-100 text-slate-700 border-slate-200";
}

export type BranchColorGradientMode =
  | "AUTO_BY_LESSON"
  | "ANALYSIS_BLUE"
  | "GEOMETRY_GREEN"
  | "ALGEBRA_AMBER"
  | "PROBABILITY_PURPLE";

export interface BranchColorThemeConfig {
  id: Exclude<BranchColorGradientMode, "AUTO_BY_LESSON">;
  labelAr: string;
  labelFr: string;
  shortLabelAr: string;
  shortLabelFr: string;
  iconSymbol: string;
  branchBadgeAr: string;
  branchBadgeFr: string;
  headerGradientCss: string;
  vividBannerGradientCss: string;
  ribbonBarGradientCss: string;
  titleGradientCss: string;
  exerciseBannerGradientCss: string;
  accentColorHex: string;
  SecondaryColorHex: string;
  borderHex: string;
  softBgHex: string;
}

export const BRANCH_COLOR_THEMES: Record<
  Exclude<BranchColorGradientMode, "AUTO_BY_LESSON">,
  BranchColorThemeConfig
> = {
  ANALYSIS_BLUE: {
    id: "ANALYSIS_BLUE",
    labelAr: "الأزرق التحليلي (التحليل والدوال والمتتاليات — Analyse)",
    labelFr: "Bleu Analytique (Analyse, Fonctions & Suites)",
    shortLabelAr: "🔵 التحليل الرياضي",
    shortLabelFr: "🔵 Analyse",
    iconSymbol: "∫",
    branchBadgeAr: "تخصص التحليل الرياضي (Analyse)",
    branchBadgeFr: "Spécialité Analyse & Fonctions",
    headerGradientCss: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 48%, #e0f2fe 100%)",
    vividBannerGradientCss: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 52%, #0284c7 100%)",
    ribbonBarGradientCss: "linear-gradient(90deg, #1e40af 0%, #2563eb 50%, #06b6d4 100%)",
    titleGradientCss: "linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 55%, #0284c7 100%)",
    exerciseBannerGradientCss: "linear-gradient(90deg, #dbeafe 0%, #eff6ff 65%, #ffffff 100%)",
    accentColorHex: "#1d4ed8",
    SecondaryColorHex: "#0284c7",
    borderHex: "#2563eb",
    softBgHex: "#eff6ff",
  },
  GEOMETRY_GREEN: {
    id: "GEOMETRY_GREEN",
    labelAr: "الأخضر الهندسي (الهندسة المستوية والفضائية 3D — Géométrie)",
    labelFr: "Émeraude Géométrique (Géométrie Plane & Espace 3D)",
    shortLabelAr: "🟢 الهندسة والفضاء",
    shortLabelFr: "🟢 Géométrie",
    iconSymbol: "📐",
    branchBadgeAr: "تخصص الهندسة والفضاء (Géométrie)",
    branchBadgeFr: "Spécialité Géométrie & Espace 3D",
    headerGradientCss: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 48%, #ccfbf1 100%)",
    vividBannerGradientCss: "linear-gradient(135deg, #064e3b 0%, #047857 52%, #0d9488 100%)",
    ribbonBarGradientCss: "linear-gradient(90deg, #065f46 0%, #10b981 50%, #14b8a6 100%)",
    titleGradientCss: "linear-gradient(90deg, #064e3b 0%, #047857 55%, #0d9488 100%)",
    exerciseBannerGradientCss: "linear-gradient(90deg, #d1fae5 0%, #ecfdf5 65%, #ffffff 100%)",
    accentColorHex: "#047857",
    SecondaryColorHex: "#0d9488",
    borderHex: "#059669",
    softBgHex: "#ecfdf5",
  },
  ALGEBRA_AMBER: {
    id: "ALGEBRA_AMBER",
    labelAr: "العنبري والنيلي الجبري (الجبر، العقدية والحسابيات — Algèbre)",
    labelFr: "Ambre & Indigo Algébrique (Algèbre, Complexes & Arithmétique)",
    shortLabelAr: "🟠 الجبر والعقدية",
    shortLabelFr: "🟠 Algèbre & Complexes",
    iconSymbol: "∑",
    branchBadgeAr: "تخصص الجبر والأعداد العقدية (Algèbre)",
    branchBadgeFr: "Spécialité Algèbre & Nombres Complexes",
    headerGradientCss: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 48%, #e0e7ff 100%)",
    vividBannerGradientCss: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #3730a3 100%)",
    ribbonBarGradientCss: "linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #4f46e5 100%)",
    titleGradientCss: "linear-gradient(90deg, #78350f 0%, #b45309 50%, #3730a3 100%)",
    exerciseBannerGradientCss: "linear-gradient(90deg, #fef3c7 0%, #fffbeb 65%, #ffffff 100%)",
    accentColorHex: "#b45309",
    SecondaryColorHex: "#4338ca",
    borderHex: "#d97706",
    softBgHex: "#fffbeb",
  },
  PROBABILITY_PURPLE: {
    id: "PROBABILITY_PURPLE",
    labelAr: "البنفسجي الاحتمالي (الاحتمالات والإحصاء — Probabilités)",
    labelFr: "Pourpre Stochastique (Probabilités & Statistiques)",
    shortLabelAr: "🟣 الاحتمالات والإحصاء",
    shortLabelFr: "🟣 Probabilités",
    iconSymbol: "🎲",
    branchBadgeAr: "تخصص الاحتمالات والإحصاء (Probabilités)",
    branchBadgeFr: "Spécialité Probabilités & Statistiques",
    headerGradientCss: "linear-gradient(135deg, #f3e8ff 0%, #faf5ff 48%, #fce7f3 100%)",
    vividBannerGradientCss: "linear-gradient(135deg, #581c87 0%, #7e22ce 52%, #be185d 100%)",
    ribbonBarGradientCss: "linear-gradient(90deg, #6b21a8 0%, #a855f7 50%, #ec4899 100%)",
    titleGradientCss: "linear-gradient(90deg, #581c87 0%, #7e22ce 55%, #be185d 100%)",
    exerciseBannerGradientCss: "linear-gradient(90deg, #f3e8ff 0%, #faf5ff 65%, #ffffff 100%)",
    accentColorHex: "#7e22ce",
    SecondaryColorHex: "#be185d",
    borderHex: "#9333ea",
    softBgHex: "#faf5ff",
  },
};

export function detectLessonBranchTheme(lesson?: LessonItem): BranchColorThemeConfig {
  if (!lesson) return BRANCH_COLOR_THEMES.ANALYSIS_BLUE;
  const sub = lesson.subCategory || "";
  const cat = lesson.category || "";
  const text = `${lesson.lessonAr} ${lesson.lessonFr} ${(lesson.tags || []).join(" ")}`.toLowerCase();

  if (
    cat === "Geometry" ||
    sub === "هندسة فضائية" ||
    sub === "هندسة مستوية" ||
    sub === "حساب مثلثي" ||
    text.includes("هندسة") ||
    text.includes("فضاء") ||
    text.includes("فلكة") ||
    text.includes("جداء سلمي") ||
    text.includes("جداء متجهي") ||
    text.includes("المرجح") ||
    text.includes("مرجح") ||
    text.includes("تحويلات") ||
    text.includes("تحاكي") ||
    text.includes("دوران") ||
    text.includes("إسقاط") ||
    text.includes("متجه") ||
    text.includes("مستقيم في المستوى") ||
    text.includes("حساب مثلثي") ||
    text.includes("مثلثية") ||
    text.includes("géométrie") ||
    text.includes("espace") ||
    text.includes("sphère") ||
    text.includes("scalaire") ||
    text.includes("vectoriel") ||
    text.includes("barycentre") ||
    text.includes("rotation") ||
    text.includes("homothétie") ||
    text.includes("trigonom") ||
    text.includes("vecteur") ||
    text.includes("droite dans le plan")
  ) {
    return BRANCH_COLOR_THEMES.GEOMETRY_GREEN;
  }

  if (
    cat === "Probabilities" ||
    sub === "احتمالات وإحصاء" ||
    text.includes("احتمال") ||
    text.includes("إحصاء") ||
    text.includes("تعداد") ||
    text.includes("عشوائي") ||
    text.includes("مالية") ||
    text.includes("probabilit") ||
    text.includes("statist") ||
    text.includes("dénombrement") ||
    text.includes("aléatoire") ||
    text.includes("binomiale") ||
    text.includes("financ")
  ) {
    return BRANCH_COLOR_THEMES.PROBABILITY_PURPLE;
  }

  if (
    cat === "Algebra" ||
    sub === "جبر" ||
    sub === "أعداد عقدية" ||
    sub === "حسابيات" ||
    sub === "بنيات جبرية" ||
    sub === "منطق ومجموعات" ||
    sub === "مصفوفات ورسوم بيانية" ||
    text.includes("عقدية") ||
    text.includes("complexe") ||
    text.includes("arithméti") ||
    text.includes("حسابيات") ||
    text.includes("منطق") ||
    text.includes("logique") ||
    text.includes("مجموعات") ||
    text.includes("ensemble") ||
    text.includes("بنيات") ||
    text.includes("structure") ||
    text.includes("مصفوف") ||
    text.includes("matrice") ||
    text.includes("حدوديات") ||
    text.includes("polynôme") ||
    text.includes("نظمات")
  ) {
    return BRANCH_COLOR_THEMES.ALGEBRA_AMBER;
  }

  return BRANCH_COLOR_THEMES.ANALYSIS_BLUE;
}

export function resolveBranchColorTheme(
  mode: BranchColorGradientMode,
  lessons: LessonItem[]
): BranchColorThemeConfig {
  if (mode !== "AUTO_BY_LESSON") {
    return BRANCH_COLOR_THEMES[mode];
  }
  return detectLessonBranchTheme(lessons[0]);
}

export function getDistinctLessonBranchThemes(
  mode: BranchColorGradientMode,
  lessons: LessonItem[]
): BranchColorThemeConfig[] {
  if (mode !== "AUTO_BY_LESSON") {
    return [BRANCH_COLOR_THEMES[mode]];
  }
  if (!lessons || lessons.length === 0) {
    return [BRANCH_COLOR_THEMES.ANALYSIS_BLUE];
  }
  const seen = new Set<string>();
  const themes: BranchColorThemeConfig[] = [];
  for (const lesson of lessons) {
    const t = detectLessonBranchTheme(lesson);
    if (!seen.has(t.id)) {
      seen.add(t.id);
      themes.push(t);
    }
  }
  return themes.length > 0 ? themes : [BRANCH_COLOR_THEMES.ANALYSIS_BLUE];
}

export function resolveMultiLessonRibbonGradient(
  mode: BranchColorGradientMode,
  lessons: LessonItem[]
): string {
  const distinct = getDistinctLessonBranchThemes(mode, lessons);
  if (distinct.length <= 1) {
    return distinct[0].ribbonBarGradientCss;
  }
  const stops = distinct.map((t, idx) => {
    const pct = Math.round((idx / (distinct.length - 1)) * 100);
    return `${t.accentColorHex} ${pct}%`;
  });
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}


export interface SpatialGeometryInstructionPreset {
  id: "SPHERE_PLANE" | "TETRAHEDRON_SECTION" | "VECTOR_CROSS_PRODUCT" | "LINES_IN_SPACE";
  titleAr: string;
  titleFr: string;
  instructionsAr: string[];
  instructionsFr: string[];
}

export const SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS: SpatialGeometryInstructionPreset[] = [
  {
    id: "SPHERE_PLANE",
    titleAr: "تقاطع فلكة (S) ومستوى (P) والمستقيم المار من المركز Ω",
    titleFr: "Intersection d'une sphère (S) et d'un plan (P) dans (O, i⃗, j⃗, k⃗)",
    instructionsAr: [
      "الفضاء منسوب إلى معلم متعامد ممنظم مباشر (O, i⃗, j⃗, k⃗).",
      "تحقق مبيانياً وحسابياً من إحداثيات المتجهة المنظمية n⃗(a, b, c) على المستوى (P).",
      "قارن مسافة مركز الفلكة عن المستوى d(Ω, (P)) مع الشعاع R لتحديد طبيعة التقاطع (دائرة Γ أو مماس).",
      "حدد التمثيل البارامتري للمستقيم (Δ) المار من Ω والعمودي على (P) لاستنتاج إحداثيات مركز الدائرة H.",
    ],
    instructionsFr: [
      "L'espace est rapporté à un repère orthonormé direct (O, i⃗, j⃗, k⃗).",
      "Identifier les coordonnées du vecteur normal n⃗(a, b, c) au plan (P).",
      "Comparer la distance d(Ω, (P)) au rayon R pour caractériser l'intersection (cercle Γ ou point de tangence).",
      "Utiliser la représentation paramétrique de la droite (Δ) ⊥ (P) passant par Ω pour déterminer le projeté orthogonal H.",
    ],
  },
  {
    id: "VECTOR_CROSS_PRODUCT",
    titleAr: "الجداء السلمي والجداء المتجهي u⃗ ∧ v⃗ وحساب المساحات والمسافات",
    titleFr: "Produit scalaire, produit vectoriel u⃗ ∧ v⃗, aires et distances 3D",
    instructionsAr: [
      "الفضاء منسوب إلى معلم متعامد ممنظم مباشر (O, i⃗, j⃗, k⃗).",
      "أحسب إحداثيات الجداء المتجهي AB⃗ ∧ AC⃗ باستعمال المحددات الثنائية المستخرجة.",
      "استنتج أن النقط A و B و C غير مستقيمية وحدد معادلة ديكارتية للمستوى (ABC).",
      "أحسب مساحة المثلث ABC بالعلاقة S = ½ ||AB⃗ ∧ AC⃗|| ومسافة نقطة M عن المستقيم (AB).",
    ],
    instructionsFr: [
      "Dans le repère orthonormé direct (O, i⃗, j⃗, k⃗), calculer les composantes de AB⃗ ∧ AC⃗.",
      "Vérifier que AB⃗ ∧ AC⃗ ≠ 0⃗ pour justifier que A, B et C définissent un plan unique (ABC).",
      "Calculer l'aire du triangle ABC par S = ½ ||AB⃗ ∧ AC⃗|| et la distance d'un point à une droite.",
    ],
  },
  {
    id: "TETRAHEDRON_SECTION",
    titleAr: "رباعي الأوجه ABCD، الأوضاع النسبية، ومقاطع المجسمات الفضائية",
    titleFr: "Tétraèdre ABCD, orthogonalité dans l'espace et sections planes",
    instructionsAr: [
      "الفضاء منسوب إلى معلم متعامد ممنظم (A, AB⃗, AC⃗, AD⃗) مرتبط برباعي الأوجه.",
      "بين تعامد مستقيم مع مستوى بإثبات تعامده مع مستقيمين متقاطعين ضمن هذا المستوى.",
      "أنشئ أثر تقاطع المستوى القاطع مع أوجه رباعي الأوجه ABCD مع تعليل التوازي أو التقاطع.",
      "أحسب حجم رباعي الأوجه V = ⅙ |(AB⃗ ∧ AC⃗) · AD⃗| واستنتج الارتفاع الموافق.",
    ],
    instructionsFr: [
      "Étudier l'orthogonalité d'une droite et d'un plan dans le tétraèdre ABCD.",
      "Construire la section plane du tétraèdre en justifiant les intersections avec chaque face.",
      "Calculer le volume du tétraèdre V = ⅓ × Aire(Base) × Hauteur.",
    ],
  },
  {
    id: "LINES_IN_SPACE",
    titleAr: "التمثيل البارامتري لمستقيمين في الفضاء والأوضاع النسبية (تقاطع / تخالف)",
    titleFr: "Représentations paramétriques de droites et positions relatives (coplanaires / non coplanaires)",
    instructionsAr: [
      "أكتب التمثيل البارامتري لكل من المستقيمين (D) و (D') بدلالة الوسيطين الحقيقيين t و t'.",
      "أدرس استقامية المتجهتين الموجهتين u⃗ و u⃗' ثم حل النظمة لتحديد ما إذا كان المستقيمان متقاطعين أو غير مستوائيين.",
      "استعمل نافذة GeoGebra 3D لتدوير المعلم الفضائي والتحقق البصري من وضع المستقيمين.",
    ],
    instructionsFr: [
      "Déterminer les représentations paramétriques des droites (D) et (D') avec paramètres t et t' ∈ ℝ.",
      "Étudier la colinéarité des vecteurs directeurs puis résoudre le système pour conclure (sécantes ou non coplanaires).",
      "Faire pivoter le repère 3D GeoGebra pour visualiser la position relative dans l'espace.",
    ],
  },
];

export interface GeoGebraResource {
  id: string;
  lessonKey: string;
  titleAr: string;
  titleFr: string;
  type: "GGB_FILE" | "GEOGEBRA_LINK" | "FIGURE_IMAGE" | "PRESET_APPLET";
  fileName?: string;
  fileSizeKb?: number;
  ggbBase64?: string;
  interactiveUrl?: string;
  materialId?: string;
  qrCodeDataUrl?: string;
  isCustomUploaded?: boolean;
  is3D?: boolean;
  spatialPresetType?:
    | "SPHERE_PLANE"
    | "TETRAHEDRON_SECTION"
    | "VECTOR_CROSS_PRODUCT"
    | "LINES_IN_SPACE";
  spatialInstructionsListAr?: string[];
  spatialInstructionsListFr?: string[];
  previewSvgType?:
    | "PLAN_VECTORIEL"
    | "ESPACE_3D"
    | "PRODUIT_SCALAIRE"
    | "NOMBRES_COMPLEXES"
    | "TRIGONOMETRIE"
    | "FONCTIONS_COURBE";
  figureImageUrl?: string;
  instructionsAr?: string;
  instructionsFr?: string;
  showInteractiveIframe?: boolean;
}

export interface InsertedFigure {
  id: string;
  exerciseId: string; // e.g. "ex_0", "ex_1", or "global"
  titleAr: string;
  titleFr: string;
  dataUrl: string; // Base64 data URL
  widthPercent: number; // 25, 40, 60, 80, 100
  alignment: "center" | "left" | "right";
  caption?: string;
  showCaption?: boolean;
  borderStyle?: "academic" | "subtle" | "none";
  qrUrl?: string;
}

export const GEOGEBRA_PRESET_LIBRARY: GeoGebraResource[] = [
  {
    id: "preset_espace_3d",
    lessonKey: "هندسة فضائية",
    titleAr: "الفضاء 3D (O,i,j,k): تقاطع فلكة (S) ومستوى (P) والجداء المتجهي",
    titleFr: "Géométrie 3D : Intersection d'une Sphère (S) et d'un Plan (P)",
    type: "PRESET_APPLET",
    interactiveUrl: "https://www.geogebra.org/m/r8k9vxpc",
    materialId: "r8k9vxpc",
    is3D: true,
    spatialPresetType: "SPHERE_PLANE",
    spatialInstructionsListAr: SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS[0].instructionsAr,
    spatialInstructionsListFr: SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS[0].instructionsFr,
    previewSvgType: "ESPACE_3D",
    instructionsAr:
      "حرّك مركز الفلكة Ω أو غيّر المسافة d(Ω,(P)) في فضاء GeoGebra 3D لملاحظة أوضاع تقاطع الفلكة والمستوى.",
    instructionsFr:
      "Déplacez le centre Ω ou faites varier R dans GeoGebra 3D pour observer la section de la sphère (S) par le plan (P).",
  },
  {
    id: "preset_espace_3d_vect",
    lessonKey: "هندسة فضائية",
    titleAr: "الفضاء 3D (O,i,j,k): الجداء المتجهي u⃗ ∧ v⃗ ومعادلة المستوى (ABC)",
    titleFr: "Géométrie 3D : Produit Vectoriel u⃗ ∧ v⃗, Plan (ABC) et Distance",
    type: "PRESET_APPLET",
    interactiveUrl: "https://www.geogebra.org/3d",
    materialId: "r8k9vxpc",
    is3D: true,
    spatialPresetType: "VECTOR_CROSS_PRODUCT",
    spatialInstructionsListAr: SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS[1].instructionsAr,
    spatialInstructionsListFr: SPATIAL_GEOMETRY_INSTRUCTIONS_PRESETS[1].instructionsFr,
    previewSvgType: "ESPACE_3D",
    instructionsAr:
      "أدر المعلم المتعامد الممنظم المباشر (O,i,j,k) لمعاينة تعامد المتجهة u⃗ ∧ v⃗ مع المستوى (ABC).",
    instructionsFr:
      "Faites pivoter le repère orthonormé 3D pour observer l'orthogonalité du produit vectoriel AB⃗ ∧ AC⃗ au plan (ABC).",
  },
  {
    id: "preset_plane_circle",
    lessonKey: "هندسة مستوية",
    titleAr: "المستوى المنسوب لمعلم متعامد ممنظم: الدائرة (C) والمستقيم المماس (Δ)",
    titleFr: "Géométrie Plane : Produit Scalaire, Cercle (C) et Tangente (Δ)",
    type: "PRESET_APPLET",
    interactiveUrl: "https://www.geogebra.org/m/q7v4wxyz",
    materialId: "q7v4wxyz",
    previewSvgType: "PRODUIT_SCALAIRE",
    instructionsAr:
      "استعمل الشكل التفاعلي للتحقق من تعامد الشعاع ΩA مع المستقيم المماس (Δ) ومجموعة النقط M حيث MA·MB = 0.",
    instructionsFr:
      "Manipulez le point M sur le cercle (C) pour vérifier l'orthogonalité et le lieu géométrique MA·MB = k.",
  },
  {
    id: "preset_complex_plane",
    lessonKey: "أعداد عقدية",
    titleAr: "المستوى العقدي: التمثيل الهندسي للأعداد العقدية والتحويلات (دوران/تحاكي)",
    titleFr: "Plan Complexe : Module, Argument et Transformations (Rotation)",
    type: "PRESET_APPLET",
    interactiveUrl: "https://www.geogebra.org/m/c4mpx92k",
    materialId: "c4mpx92k",
    previewSvgType: "NOMBRES_COMPLEXES",
    instructionsAr:
      "لاحظ صورة النقطة M بالدوران R الذي مركزه O وزاويته π/3 وتأكد من طبيعة المثلث OMM'.",
    instructionsFr:
      "Observez l'image M' par la rotation d'angle π/3 et vérifiez la nature équilatérale du triangle OMM'.",
  },
  {
    id: "preset_trigo_circle",
    lessonKey: "حساب مثلثي",
    titleAr: "الدائرة المثلثية والأفاصيل المنحنية والمعادلات المثلثية",
    titleFr: "Cercle Trigonométrique & Équations cos(x) / sin(x)",
    type: "PRESET_APPLET",
    interactiveUrl: "https://www.geogebra.org/m/tr9g2025",
    materialId: "tr9g2025",
    previewSvgType: "PRODUIT_SCALAIRE",
    instructionsAr:
      "حرّك النقطة M على الدائرة المثلثية لقراءة جيب وجيب تمام الزاوية وحلول المعادلة المثلثية مبيانياً.",
    instructionsFr:
      "Faites glisser le point M sur le cercle unité pour visualiser cos(x), sin(x) et les solutions sur [-π, π].",
  },
];

export function isGeometryOrSpatialLesson(lesson: LessonItem): boolean {
  if (lesson.category === "Geometry") return true;
  if (
    lesson.subCategory === "هندسة فضائية" ||
    lesson.subCategory === "هندسة مستوية" ||
    lesson.subCategory === "أعداد عقدية" ||
    lesson.subCategory === "حساب مثلثي"
  ) {
    return true;
  }
  const t = `${lesson.lessonAr} ${lesson.lessonFr}`.toLowerCase();
  return (
    t.includes("هندسة") ||
    t.includes("فضاء") ||
    t.includes("جداء") ||
    t.includes("متجه") ||
    t.includes("دائرة") ||
    t.includes("عقدية") ||
    t.includes("géométrie") ||
    t.includes("espace") ||
    t.includes("scalaire") ||
    t.includes("vecteur") ||
    t.includes("complexe") ||
    t.includes("barycentre") ||
    t.includes("homothétie") ||
    t.includes("rotation")
  );
}

export function getAutoGeoGebraResourceForLesson(
  lesson: LessonItem,
  customResourcesMap: Record<string, GeoGebraResource>,
  autoAttachGeometry: boolean
): GeoGebraResource | null {
  // 1. إذا قام الأستاذ برفع ملف .ggb أو رابط مخصص لهذا الدرس تحديداً
  if (customResourcesMap[lesson.lessonFr]) {
    return customResourcesMap[lesson.lessonFr];
  }
  // 2. إذا كان هناك مورد عام مرفوع لجميع تمارين الهندسة
  if (customResourcesMap["__ALL_GEOMETRY__"] && isGeometryOrSpatialLesson(lesson)) {
    return customResourcesMap["__ALL_GEOMETRY__"];
  }
  // 3. إذا كان التضمين التلقائي لتمارين الهندسة مفعلاً
  if (!autoAttachGeometry || !isGeometryOrSpatialLesson(lesson)) {
    return null;
  }
  if (lesson.subCategory === "هندسة فضائية" || lesson.lessonFr.toLowerCase().includes("espace")) {
    return {
      ...GEOGEBRA_PRESET_LIBRARY[0],
      is3D: true,
      titleAr: `${lesson.lessonAr} — تمثيل الفضاء 3D والفلكة والمستوى`,
      titleFr: `${lesson.lessonFr} — Représentation dans l'espace 3D (.ggb)`,
    };
  }
  if (lesson.subCategory === "أعداد عقدية" || lesson.lessonFr.toLowerCase().includes("complexe")) {
    return {
      ...GEOGEBRA_PRESET_LIBRARY[3],
      titleAr: `${lesson.lessonAr} — المستوى العقدي والتحويلات`,
      titleFr: `${lesson.lessonFr} — Plan complexe & Transformations`,
    };
  }
  if (lesson.subCategory === "حساب مثلثي" || lesson.lessonFr.toLowerCase().includes("trigo")) {
    return {
      ...GEOGEBRA_PRESET_LIBRARY[4],
      titleAr: `${lesson.lessonAr} — الدائرة المثلثية`,
      titleFr: `${lesson.lessonFr} — Cercle trigonométrique`,
    };
  }
  return {
    ...GEOGEBRA_PRESET_LIBRARY[2],
    titleAr: `${lesson.lessonAr} — شكل هندسي تفاعلي (GeoGebra)`,
    titleFr: `${lesson.lessonFr} — Figure géométrique dynamique (GeoGebra)`,
  };
}

export function lessonMatchesTagFilter(lesson: LessonItem, filterTag: string): boolean {
  if (!filterTag || filterTag === "ALL") return true;
  if (lesson.category === filterTag) return true;
  if (lesson.subCategory === filterTag) return true;
  if (lesson.subCategoryFr === filterTag) return true;
  if (Array.isArray(lesson.tags) && lesson.tags.includes(filterTag)) return true;
  return false;
}

export function getVariantQuestions(
  lesson: LessonItem,
  model: "A" | "B" | "C" | "D" | string,
  shuffleQuestions: boolean,
  variantSeed: number = 0,
  density: DSQuestionDensity = "STANDARD"
): { questionsAr: string[]; questionsFr: string[] } {
  const titleFr = lesson.lessonFr.toLowerCase();
  const titleAr = lesson.lessonAr;
  const subCat = lesson.subCategory || "";
  let questionsAr: string[] = [];
  let questionsFr: string[] = [];

  // إذا كان الأستاذ في الصيغة الأساسية (variantSeed === 0) ووجدت أسئلة مخصصة، نثريها بأسئلة التوليف المغربية (N2/N3) لتكتمل بنية الفرض المحروس (5 أسئلة متدرجة)
  if (variantSeed === 0 && lesson.sampleExerciseAr && lesson.sampleExerciseFr) {
    if (model === "A") {
      questionsAr = [...lesson.sampleExerciseAr];
      questionsFr = [...lesson.sampleExerciseFr];
    } else if (model === "B") {
      if (lesson.sampleExerciseModelB_Ar && lesson.sampleExerciseModelB_Fr) {
        questionsAr = [...lesson.sampleExerciseModelB_Ar];
        questionsFr = [...lesson.sampleExerciseModelB_Fr];
      } else {
        questionsAr = lesson.sampleExerciseAr.map((q) =>
          q
            .replace("n² + 3n + 4", "n² + 5n + 6")
            .replace("540", "720")
            .replace("378", "504")
            .replace("(n + 11)", "(n + 9)")
            .replace("(2n + 30)", "(2n + 26)")
            .replace("x² - 2x + 3", "x² - 4x + 6")
            .replace("[1, +∞[", "[2, +∞[")
            .replace("x³ + x - 3 = 0", "x³ + 2x - 5 = 0")
            .replace("x - 2√x + 2", "x - 4√x + 5")
            .replace("(3/2)AB", "(5/2)AB")
            .replace("3AC - AB", "2AC - 3AB")
            .replace("-(5/2)AB + 3AC", "-(11/2)AB + 2AC")
        );
        questionsFr = lesson.sampleExerciseFr.map((q) =>
          q
            .replace("n² + 3n + 4", "n² + 5n + 6")
            .replace("540", "720")
            .replace("378", "504")
            .replace("(n + 11)", "(n + 9)")
            .replace("(2n + 30)", "(2n + 26)")
            .replace("x² - 2x + 3", "x² - 4x + 6")
            .replace("[1, +∞[", "[2, +∞[")
            .replace("x³ + x - 3 = 0", "x³ + 2x - 5 = 0")
            .replace("x - 2√x + 2", "x - 4√x + 5")
            .replace("(3/2)AB", "(5/2)AB")
            .replace("3AC - AB", "2AC - 3AB")
            .replace("-(5/2)AB + 3AC", "-(11/2)AB + 2AC")
        );
      }
    } else if (model === "C") {
      questionsAr = lesson.sampleExerciseAr.map((q) =>
        q
          .replace("n² + 3n + 4", "n² + 7n + 12")
          .replace("540", "1080")
          .replace("378", "756")
          .replace("(n + 11)", "(n + 13)")
          .replace("(2n + 30)", "(2n + 34)")
          .replace("x² - 2x + 3", "x² - 6x + 10")
          .replace("[1, +∞[", "[3, +∞[")
          .replace("x³ + x - 3 = 0", "x³ + 3x - 4 = 0")
          .replace("x - 2√x + 2", "x - 6√x + 10")
          .replace("(3/2)AB", "(7/2)AB")
          .replace("3AC - AB", "4AC - 2AB")
          .replace("-(5/2)AB + 3AC", "-(7/2)AB + 4AC")
      );
      questionsFr = lesson.sampleExerciseFr.map((q) =>
        q
          .replace("n² + 3n + 4", "n² + 7n + 12")
          .replace("540", "1080")
          .replace("378", "756")
          .replace("(n + 11)", "(n + 13)")
          .replace("(2n + 30)", "(2n + 34)")
          .replace("x² - 2x + 3", "x² - 6x + 10")
          .replace("[1, +∞[", "[3, +∞[")
          .replace("x³ + x - 3 = 0", "x³ + 3x - 4 = 0")
          .replace("x - 2√x + 2", "x - 6√x + 10")
          .replace("(3/2)AB", "(7/2)AB")
          .replace("3AC - AB", "4AC - 2AB")
          .replace("-(5/2)AB + 3AC", "-(7/2)AB + 4AC")
      );
    } else {
      // Model D
      questionsAr = lesson.sampleExerciseAr.map((q) =>
        q
          .replace("n² + 3n + 4", "n² + 4n + 3")
          .replace("540", "360")
          .replace("378", "252")
          .replace("(n + 11)", "(n + 7)")
          .replace("(2n + 30)", "(2n + 22)")
          .replace("x² - 2x + 3", "x² - 8x + 17")
          .replace("[1, +∞[", "[4, +∞[")
          .replace("x³ + x - 3 = 0", "x³ + x - 2 = 0")
          .replace("x - 2√x + 2", "x - 8√x + 17")
          .replace("(3/2)AB", "(9/2)AB")
          .replace("3AC - AB", "5AC - 3AB")
          .replace("-(5/2)AB + 3AC", "-(9/2)AB + 5AC")
      );
      questionsFr = lesson.sampleExerciseFr.map((q) =>
        q
          .replace("n² + 3n + 4", "n² + 4n + 3")
          .replace("540", "360")
          .replace("378", "252")
          .replace("(n + 11)", "(n + 7)")
          .replace("(2n + 30)", "(2n + 22)")
          .replace("x² - 2x + 3", "x² - 8x + 17")
          .replace("[1, +∞[", "[4, +∞[")
          .replace("x³ + x - 3 = 0", "x³ + x - 2 = 0")
          .replace("x - 2√x + 2", "x - 8√x + 17")
          .replace("(3/2)AB", "(9/2)AB")
          .replace("3AC - AB", "5AC - 3AB")
          .replace("-(5/2)AB + 3AC", "-(9/2)AB + 5AC")
      );
    }

    // إغناء التمارين المقتضبة (أقل من 4 أسئلة) بأسئلة استدلال وتوليف وفق المذكرة المغربية 142-08
    if (!lesson.isImportedSimulation && !lesson.hasCustomQuestions && questionsAr.length <= 3) {
      const capLastAr = lesson.capacitiesAr[lesson.capacitiesAr.length - 1] || lesson.lessonAr;
      const capLastFr = lesson.capacitiesFr[lesson.capacitiesFr.length - 1] || lesson.lessonFr;
      if (subCat === "تحليل" || lesson.category === "Calculus") {
        questionsAr.push(
          `${questionsAr.length + 1}. أ) باستعمال النتائج السابقة، أدرس الوضع النسبي للمنحنى (C_f) والمستقيم المقارب (أو المماس Δ) وحدد نقط التقاطع.`,
          `${questionsAr.length + 2}. ب) سؤال توليفي (المستوى N3): ناقش مبيانياً وحسابياً حسب قيم الوسيط الحقيقي m عدد وإشارة حلول المعادلة f(x) = m في المجال المدروس.`
        );
        questionsFr.push(
          `${questionsFr.length + 1}. a) En exploitant les questions précédentes, étudier la position relative de la courbe (C_f) par rapport à la droite (Δ) et préciser les points d'intersection.`,
          `${questionsFr.length + 2}. b) Synthèse (Niveau N3) : Discuter graphiquement et algébriquement, suivant les valeurs du paramètre réel m, le nombre de solutions de l'équation f(x) = m.`
        );
      } else if (subCat === "هندسة فضائية" || subCat === "هندسة مستوية" || lesson.category === "Geometry") {
        questionsAr.push(
          `${questionsAr.length + 1}. أ) حدد تمثيلاً بارامترياً للمستقيم (Δ) المار من مركز الثقل والعمودي على المستوى (أو المستقيم الحامل للقاعدة)، ثم استنتج إحداثيات المسقط العمودي H.`,
          `${questionsAr.length + 2}. ب) مسألة هندسية (N3): حدد مجموعة النقط M من المستوى (أو الفضاء) التي تحقق العلاقة المترية المدروسة، مع التعليل الهندسي الدقيق.`
        );
        questionsFr.push(
          `${questionsFr.length + 1}. a) Déterminer une représentation paramétrique de la droite orthogonale (Δ), puis en déduire les coordonnées du projeté orthogonal H.`,
          `${questionsFr.length + 2}. b) Lieu géométrique (Niveau N3) : Déterminer et caractériser l'ensemble (Γ) des points M vérifiant la relation métrique liée à « ${capLastFr} ».`
        );
      } else {
        questionsAr.push(
          `${questionsAr.length + 1}. استثمار وتعبئة (المستوى N2): استنتج من النتائج السابقة حل المتراجحة (أو النظمة) المرتبطة بقدرة « ${capLastAr} ».`,
          `${questionsAr.length + 2}. سؤال التعمق والمبادرة (المستوى N3): برهن على الخاصية التعميمية من أجل كل عنصر من المجموعة المدروسة واستنتج القيمة المضبوطة للمقدار المطلوب.`
        );
        questionsFr.push(
          `${questionsFr.length + 1}. Mobilisation (Niveau N2) : En déduire la résolution de l'inéquation ou du système associé à la capacité « ${capLastFr} ».`,
          `${questionsFr.length + 2}. Approfondissement (Niveau N3) : Démontrer la propriété généralisée et en déduire la valeur exacte de l'expression étudiée.`
        );
      }
    }
  } else if (subCat === "هندسة فضائية" || titleFr.includes("espace") || titleAr.includes("الفضائية")) {
    const isAlt = variantSeed % 2 === 1;
    const r = model === "A" ? (isAlt ? "√14" : "3") : isAlt ? "2√14" : "6";
    const dPlane = model === "A" ? (isAlt ? "4" : "3") : isAlt ? "8" : "6";
    const center = model === "A" ? (isAlt ? "Ω(2, -1, 1)" : "Ω(1, -1, 2)") : "Ω(2, 1, -1)";
    questionsAr = [
      `في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر (O, i, j, k)، نعتبر النقط A(1, 0, 2) و B(2, 1, 0) و C(0, 1, 1) والفلكة (S) التي مركزها ${center} وشعاعها R = ${r}.`,
      `1. أ) أحسب مركبات الجداء المتجهي AB ∧ AC، ثم استنتج أن النقط A و B و C غير مستقيمية.`,
      `1. ب) بين أن المعادلة الديكارتية للمستوى (ABC) هي: x + 2y + 2z - ${dPlane} = 0.`,
      `2. أ) حدد معادلة ديكارتية للفلكة (S)، ثم أحسب مسافة النقطة Ω عن المستوى (ABC).`,
      `2. ب) استنتج أن المستوى (ABC) يقطع الفلكة (S) وفق دائرة (Γ) يطلب تحديد شعاعها r.`,
      `3. حدد تمثيلاً بارامترياً للمستقيم (Δ) المار من Ω والعمودي على (ABC)، ثم استنتج إحداثيات النقطة H مركز الدائرة (Γ) ومعادلة المستوى (Q) المماس للفلكة (S) عند النقطة A.`,
    ];
    questionsFr = [
      `Dans l'espace rapporté à un repère orthonormé direct (O, i, j, k), on considère les points A(1, 0, 2), B(2, 1, 0), C(0, 1, 1) et la sphère (S) de centre ${center} et de rayon R = ${r}.`,
      `1. a) Calculer les coordonnées du produit vectoriel AB ∧ AC et en déduire que les points A, B et C ne sont pas alignés.`,
      `1. b) Montrer qu'une équation cartésienne du plan (ABC) est : x + 2y + 2z - ${dPlane} = 0.`,
      `2. a) Donner une équation cartésienne de la sphère (S), puis calculer la distance d(Ω, (ABC)).`,
      `2. b) En déduire que le plan (ABC) coupe la sphère (S) suivant un cercle (Γ) dont on précisera le rayon r.`,
      `3. Déterminer une représentation paramétrique de la droite (Δ) passant par Ω et orthogonale à (ABC), puis en déduire les coordonnées du centre H de (Γ) et l'équation du plan tangent en A.`,
    ];
  } else if (titleFr.includes("suite") || titleAr.includes("المتتاليات")) {
    const isAlt = variantSeed % 2 === 1;
    const a = model === "A" ? (isAlt ? "4" : "3") : "4";
    const b = model === "A" ? (isAlt ? "3" : "2") : "3";
    const u0 = model === "A" ? (isAlt ? "2" : "1") : "2";
    questionsAr = [
      `نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = ${u0} و u_{n+1} = (${a}u_n + ${b})/(u_n + 2) لكل n من N.`,
      `1. أ) أحسب الحدين u_1 و u_2، ثم بين بالترجع أن u_n > ${isAlt ? "1" : "0"} لكل n من N.`,
      `1. ب) تحقق أن u_{n+1} - u_n = -(u_n - ${b})(u_n + 1)/(u_n + 2)، ثم أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة.`,
      `2. نعتبر المتتالية العددية (v_n) المعرفة بـ: v_n = (u_n - ${b})/(u_n + 1) لكل n من N.`,
      `2. أ) بين أن (v_n) متتالية هندسية محدداً أساسها q وحدها الأول v_0.`,
      `2. ب) أكتب v_n ثم u_n بدلالة n، وأحسب نهاية المتتالية (u_n) والمجموع S_n = v_0 + v_1 + ... + v_n بدلالة n.`,
    ];
    questionsFr = [
      `Soit (u_n) la suite numérique définie par u_0 = ${u0} et u_{n+1} = (${a}u_n + ${b})/(u_n + 2) pour tout n ∈ ℕ.`,
      `1. a) Calculer u_1 et u_2, puis montrer par récurrence que u_n > ${isAlt ? "1" : "0"} pour tout n ∈ ℕ.`,
      `1. b) Vérifier que u_{n+1} - u_n = -(u_n - ${b})(u_n + 1)/(u_n + 2), étudier la monotonie de (u_n) et en déduire qu'elle est convergente.`,
      `2. On considère la suite auxiliaire (v_n) définie sur ℕ par : v_n = (u_n - ${b})/(u_n + 1).`,
      `2. a) Montrer que (v_n) est une suite géométrique dont on précisera la raison q et le premier terme v_0.`,
      `2. b) Exprimer v_n puis u_n en fonction de n, calculer lim u_n et exprimer la somme S_n = v_0 + v_1 + ... + v_n en fonction de n.`,
    ];
  } else if (titleFr.includes("complexe") || subCat === "أعداد عقدية") {
    const isAlt = variantSeed % 2 === 1;
    const re = model === "A" ? (isAlt ? "2√2" : "2√3") : "4√3";
    const c = model === "A" ? (isAlt ? "4" : "4") : "16";
    const affA = model === "A" ? (isAlt ? "√2 + i√2" : "√3 + i") : "2√3 + 2i";
    const affC = model === "A" ? (isAlt ? "-√2 + i√2" : "2i") : "4i";
    questionsAr = [
      `I. نعتبر في مجموعة الأعداد العقدية C المعادلة: (E) : z² - ${re} z + ${c} = 0.`,
      `1. أ) أحسب مميز المعادلة (E)، ثم حل في المجموعة C المعادلة (E).`,
      `1. ب) نضع a = ${affA} و b = ā. أكتب كلاً من a و b على الشكل المثلثي ثم الأسي، واستنتج أن a^{12} عدد حقيقي.`,
      `II. في المستوى العقدي المنسوب إلى معلم متعامد ممنظم مباشر (O, u, v)، نعتبر النقط A(a) و B(b) و C(c) حيث c = ${affC}.`,
      `2. أ) أكتب العدد العقدي (c - a)/(b - a) على الشكل الجبري ثم المثلثي، واستنتج طبيعة المثلث ABC.`,
      `2. ب) ليكن R الدوران الذي مركزه O وزاويته π/3. حدد الكتابة العقدية للدوران R ولحق النقطة D صورة A بالدوران R، ثم حدد مجموعة النقط M(z) حيث |z - a| = |z - b|.`,
    ];
    questionsFr = [
      `I. On considère dans l'ensemble des nombres complexes ℂ l'équation : (E) : z² - ${re} z + ${c} = 0.`,
      `1. a) Calculer le discriminant Δ de (E), puis résoudre dans ℂ l'équation (E).`,
      `1. b) On pose a = ${affA} et b = ā. Écrire a et b sous forme trigonométrique et exponentielle, puis montrer que a^{12} est un nombre réel.`,
      `II. Dans le plan complexe rapporté à un repère orthonormé direct (O, u, v), on considère les points A(a), B(b) et C(c) avec c = ${affC}.`,
      `2. a) Écrire le quotient (c - a)/(b - a) sous forme trigonométrique et en déduire la nature exacte du triangle ABC.`,
      `2. b) Soit R la rotation de centre O et d'angle π/3. Donner l'écriture complexe de R, déterminer l'affixe de D = R(A) et caractériser l'ensemble des points M(z) tels que |z - a| = |z - b|.`,
    ];
  } else if (
    titleFr.includes("intégral") ||
    titleFr.includes("primitive") ||
    titleFr.includes("différentielle") ||
    titleAr.includes("التكاملي") ||
    titleAr.includes("التفاضلية")
  ) {
    const isAlt = variantSeed % 2 === 1;
    const odeEq = model === "A"
      ? (isAlt ? "y'' - 4y' + 4y = 0" : "y'' - 2y' + y = 0")
      : "y'' - 3y' + 2y = 0";
    questionsAr = [
      `الجزء الأول: نعتبر المعادلة التفاضلية (E) : ${odeEq}.`,
      `1. أ) حل في R المعادلة المميزة المرتبطة بالمعادلة (E)، ثم استنتج الحل العام للمعادلة التفاضلية (E).`,
      `1. ب) حدد الحل الخاص h للمعادلة (E) الذي يحقق الشرطين: h(0) = 1 و h'(0) = 0.`,
      `الجزء الثاني: نعتبر التكاملين I = ∫_0^1 (x + 1)e^{-x} dx و J = ∫_0^{π/4} tan(x) dx.`,
      `2. أ) حدد الدالة الأصلية للدالة x ↦ tan(x) على [0, π/4]، ثم أحسب التكامل J.`,
      `2. ب) باستعمال المكاملة بالأجزاء، أحسب التكامل I، ثم استنتج بـ cm² مساحة الحيز المستوي المحصور بين منحنى الدالة f(x) = (x+1)e^{-x} ومحور الأفاصيل والمستقيمين x = 0 و x = 1 (حيث ||i|| = ||j|| = 2 cm).`,
    ];
    questionsFr = [
      `Partie I : On considère l'équation différentielle (E) : ${odeEq}.`,
      `1. a) Résoudre l'équation caractéristique associée à (E) et donner la solution générale de (E) sur ℝ.`,
      `1. b) Déterminer la solution particulière h de (E) vérifiant les conditions initiales h(0) = 1 et h'(0) = 0.`,
      `Partie II : On pose I = ∫_0^1 (x + 1)e^{-x} dx et J = ∫_0^{π/4} tan(x) dx.`,
      `2. a) Déterminer une primitive de x ↦ tan(x) sur [0, π/4] et calculer l'intégrale J.`,
      `2. b) À l'aide d'une intégration par parties (IPP), calculer I, puis en déduire en cm² l'aire du domaine plan délimité par la courbe de f(x) = (x+1)e^{-x}, l'axe des abscisses et les droites x = 0 et x = 1 (unité : 2 cm).`,
    ];
  } else if (titleFr.includes("logarithm") || titleFr.includes("exponentielle")) {
    const k = model === "A" ? (variantSeed % 2 === 1 ? "1" : "2") : "3";
    questionsAr = [
      `الجزء الأول: نعتبر الدالة المساعدة g المعرفة على المجال ]0, +∞[ بـ: g(x) = ${k}x² - 1 - ln(x).`,
      `1. أ) أحسب g'(x) لكل x > 0، ثم ضع جدول تغيرات الدالة g على ]0, +∞[ (لا يطلب حساب النهايات).`,
      `1. ب) أحسب g(1)، ثم استنتج إشارة g(x) على كل من المجالين ]0, 1] و [1, +∞[.`,
      `الجزء الثاني: نعتبر الدالة العددية f المعرفة على ]0, +∞[ بـ: f(x) = ${k}x - 1 + ln(x)/x، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i, j).`,
      `2. أ) أحسب lim_{x→0^+} f(x) و lim_{x→+∞} f(x)، وبين أن المستقيم (Δ) ذا المعادلة y = ${k}x - 1 مقارب مائل للمنحنى (C_f) بجوار +∞ وأدرس وضعه النسبي مع (C_f).`,
      `2. ب) بين أن f'(x) = g(x)/x² لكل x > 0، ضع جدول تغيرات الدالة f، ثم أنشئ المستقيم (Δ) والمنحنى (C_f) وأحسب مساحة الحيز المحصور بين (C_f) و (Δ) والمستقيمين x = 1 و x = e.`,
    ];
    questionsFr = [
      `Partie I : Soit g la fonction auxiliaire définie sur ]0, +∞[ par : g(x) = ${k}x² - 1 - ln(x).`,
      `1. a) Calculer g'(x) pour tout x > 0 et dresser le tableau de variations de g sur ]0, +∞[.`,
      `1. b) Calculer g(1) et en déduire le signe de g(x) sur ]0, +∞[.`,
      `Partie II : On considère la fonction f définie sur ]0, +∞[ par : f(x) = ${k}x - 1 + ln(x)/x et (C_f) sa courbe représentative dans un repère orthonormé (O, i, j).`,
      `2. a) Calculer les limites de f en 0^+ et en +∞, montrer que la droite (Δ) : y = ${k}x - 1 est asymptote oblique à (C_f) en +∞ et étudier leur position relative.`,
      `2. b) Montrer que f'(x) = g(x)/x² pour tout x > 0, dresser le tableau de variations de f, construire (Δ) et (C_f), puis calculer l'aire du domaine compris entre (C_f), (Δ) et les droites x = 1 et x = e.`,
    ];
  } else if (subCat === "احتمالات وإحصاء" || titleFr.includes("probabilit") || titleAr.includes("الاحتمالات")) {
    const nRed = model === "A" ? (variantSeed % 2 === 1 ? "5" : "4") : "5";
    const nGreen = model === "A" ? "3" : "4";
    const total = model === "A" ? (variantSeed % 2 === 1 ? "10" : "9") : "11";
    questionsAr = [
      `يحتوي كيس على ${total} كرات لا يمكن التمييز بينها باللمس: ${nRed} كرات حمراء، ${nGreen} كرات خضراء، وكرتين بيضاوين. نسحب عشوائياً وفي آن واحد 3 كرات من الكيس.`,
      `1. أ) تحقق من عدد الإمكانيات Card(Ω)، ثم أحسب احتمال الحدث A: «سحب 3 كرات من نفس اللون» والحدث B: «سحب كرة بيضاء على الأقل».`,
      `1. ب) أحسب احتمال الحدث C: «سحب 3 كرات مختلفة اللون مثنى مثنى»، ثم أحسب الاحتمال الشرطي P_B(C) وهل الحدثان B و C مستقلان؟`,
      `2. أ) ليكن X المتغير العشوائي الذي يربط كل سحبة بعدد الكرات البيضاء المسحوبة. حدد مجموعة قيم X(Ω) وقانون احتمال المتغير العشوائي X.`,
      `2. ب) أحسب الأمل الرياضي E(X) والمغايرة V(X) والانحراف الطرازي σ(X).`,
      `3. نعيد التجربة السابقة 4 مرات متتالية وبإحلال (اختبارات برنولي مستقلة). أحسب احتمال تحقق الحدث A ثلاث مرات بالضبط.`,
    ];
    questionsFr = [
      `Une urne contient ${total} boules indiscernables au toucher : ${nRed} rouges, ${nGreen} vertes et 2 blanches. On tire simultanément 3 boules de l'urne.`,
      `1. a) Déterminer Card(Ω), puis calculer la probabilité des événements A : « Obtenir 3 boules de même couleur » et B : « Obtenir au moins une boule blanche ».`,
      `1. b) Calculer la probabilité de C : « Obtenir 3 boules de couleurs deux à deux distinctes », calculer la probabilité conditionnelle P_B(C) et étudier l'indépendance de B et C.`,
      `2. a) Soit X la variable aléatoire égale au nombre de boules blanches tirées. Déterminer X(Ω) et établir la loi de probabilité de X.`,
      `2. b) Calculer l'espérance mathématique E(X), la variance V(X) et l'écart-type σ(X).`,
      `3. On répète l'épreuve 4 fois de manière indépendante avec remise (schéma de Bernoulli). Calculer la probabilité que l'événement A se réalise exactement 3 fois.`,
    ];
  } else if (subCat === "حساب مثلثي" || titleFr.includes("trigonométr")) {
    const val = model === "A" ? (variantSeed % 2 === 1 ? "1/2" : "√3/2") : "√2/2";
    questionsAr = [
      `1. أ) بسط التعبير المثلثي التالي لكل x من R : A(x) = cos(π - x) + sin(π/2 + x) + cos(x + 2π) + sin(π - x).`,
      `1. ب) بين أنه لكل x من R لدينا: cos⁴(x) - sin⁴(x) = cos(2x) و sin(2x)/(1 + cos(2x)) = tan(x) (حيث x ≠ π/2 + kπ).`,
      `2. أ) حل في R ثم في المجال ]-π, π] المعادلة المثلثية: cos(2x - π/6) = ${val}، ومثل صور الحلول على الدائرة المثلثية.`,
      `2. ب) حل في المجال [0, 2π] المعادلة: 2cos²(x) - 3cos(x) + 1 = 0.`,
      `3. حل في المجال ]-π, π] المتراجحة المثلثية: (2sin(x) - 1)(2cos(x) - √3) ≤ 0 بالاعتماد على الدائرة المثلثية.`,
    ];
    questionsFr = [
      `1. a) Simplifier pour tout réel x l'expression : A(x) = cos(π - x) + sin(π/2 + x) + cos(x + 2π) + sin(π - x).`,
      `1. b) Montrer que pour tout réel x : cos⁴(x) - sin⁴(x) = cos(2x) et sin(2x)/(1 + cos(2x)) = tan(x).`,
      `2. a) Résoudre dans ℝ puis dans ]-π, π] l'équation : cos(2x - π/6) = ${val} et placer les points images sur le cercle trigonométrique.`,
      `2. b) Résoudre dans [0, 2π] l'équation : 2cos²(x) - 3cos(x) + 1 = 0.`,
      `3. Résoudre dans ]-π, π] l'inéquation trigonométrique : (2sin(x) - 1)(2cos(x) - √3) ≤ 0 à l'aide du cercle trigonométrique.`,
    ];
  } else if (subCat === "هندسة مستوية" || lesson.category === "Geometry") {
    const xa = model === "A" ? (variantSeed % 2 === 1 ? "0" : "1") : "2";
    const yb = model === "A" ? "3" : "4";
    questionsAr = [
      `في المستوى المنسوب إلى معلم متعامد ممنظم (O, i, j)، نعتبر النقط A(${xa}, 2) و B(3, ${yb}) و C(-1, 4) والمجموعة (C) للنقط M(x,y) حيث: x² + y² - 2x - 4y - 4 = 0.`,
      `1. أ) أحسب الجداء السلمي AB · AC والمنظمين ||AB|| و ||AC||، ثم استنتج cos(BAC) و sin(BAC) ومساحة المثلث ABC.`,
      `1. ب) حدد معادلة ديكارتية للمستقيم (Δ) ارتفاع المثلث ABC المار من A، وأحسب مسافة النقطة B عن المستقيم (AC).`,
      `2. أ) بين أن (C) دائرة محدداً مركزها Ω وشعاعها R، ثم تحقق أن النقطة A تنتمي إلى الدائرة (C).`,
      `2. ب) حدد معادلة ديكارتية للمستقيم (T) المماس للدائرة (C) عند النقطة A، وأدرس الوضع النسبي للدائرة (C) والمستقيم (D) : 3x + 4y - 25 = 0.`,
    ];
    questionsFr = [
      `Dans le plan muni d'un repère orthonormé (O, i, j), on considère les points A(${xa}, 2), B(3, ${yb}), C(-1, 4) et l'ensemble (C) d'équation : x² + y² - 2x - 4y - 4 = 0.`,
      `1. a) Calculer le produit scalaire AB · AC ainsi que AB et AC, puis en déduire cos(BAC), sin(BAC) et l'aire du triangle ABC.`,
      `1. b) Déterminer une équation cartésienne de la hauteur (Δ) issue de A et calculer la distance de B à la droite (AC).`,
      `2. a) Montrer que (C) est un cercle dont on précisera le centre Ω et le rayon R, et vérifier que A ∈ (C).`,
      `2. b) Déterminer une équation de la tangente (T) à (C) en A et étudier la position relative de (C) et de la droite (D) : 3x + 4y - 25 = 0.`,
    ];
  } else if (subCat === "جبر" || subCat === "منطق ومجموعات" || subCat === "حسابيات" || lesson.category === "Algebra") {
    const root = model === "A" ? (variantSeed % 2 === 1 ? "1" : "2") : "3";
    const coef = model === "A" ? "5" : "7";
    questionsAr = [
      `الجزء الأول (المنطق والاستدلال): نعتبر العبارة (P) : « (∀x ∈ R), x² - 2x + 2 > 0 ».`,
      `1. أ) أعط نفي العبارة (P)، ثم بين أن العبارة (P) صحيحة.`,
      `1. ب) باستعمال الاستدلال بالترجع، بين أنه لكل n من N : 1 + 2 + 2² + ... + 2^n = 2^{n+1} - 1.`,
      `الجزء الثاني (الحدوديات والمعادلات): نعتبر الحدودية P(x) = x³ - ${coef}x² + 8x - 4 لكل x من R.`,
      `2. أ) أحسب P(${root})، ثم حدد الحدودية Q(x) من الدرجة الثانية بحيث P(x) = (x - ${root})Q(x) بطريقتين (القسمة الإقليدية أو المطابقة).`,
      `2. ب) حل في R المعادلة P(x) = 0، ضع جدول إشارة P(x) على R، ثم استنتج مجموعة حلول المتراجحة P(x) ≤ 0 والمعادلة P(√x) = 0.`,
    ];
    questionsFr = [
      `Partie I (Logique & Raisonnement) : On considère la proposition (P) : « (∀x ∈ ℝ), x² - 2x + 2 > 0 ».`,
      `1. a) Donner la négation de la proposition (P), puis démontrer que (P) est vraie.`,
      `1. b) Montrer par récurrence que pour tout n ∈ ℕ : 1 + 2 + 2² + ... + 2^n = 2^{n+1} - 1.`,
      `Partie II (Polynômes & Équations) : On considère le polynôme P(x) = x³ - ${coef}x² + 8x - 4 pour tout x ∈ ℝ.`,
      `2. a) Vérifier que α = ${root} est une racine de P(x), puis déterminer le polynôme Q(x) tel que P(x) = (x - ${root})Q(x) par division euclidienne.`,
      `2. b) Résoudre dans ℝ l'équation P(x) = 0, dresser le tableau de signes de P(x) et en déduire les solutions de P(x) ≤ 0 ainsi que de l'équation P(√x) = 0.`,
    ];
  } else {
    const k = model === "A" ? (variantSeed % 2 === 1 ? "4" : "2") : "3";
    questionsAr = [
      `نعتبر الدالة العددية f المعرفة بـ: f(x) = (x² - ${k}x + 1)/(x - 1) لكل x ≠ 1، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i, j).`,
      `1. أ) حدد مجموعة تعريف الدالة f، ثم أحسب النهايات عند محدات D_f واستنتج معادلة المستقيم المقارب العمودي.`,
      `1. ب) تحقق أنه لكل x من D_f لدينا: f(x) = x - ${Number(k) - 1} + ${2 - Number(k)}/(x - 1)، ثم استنتج أن (C_f) يقبل مقارباً مائلاً (Δ) بجوار +∞ و -∞.`,
      `2. أ) أحسب المشتقة f'(x) لكل x من D_f، ثم أدرس إشارتها وضع جدول تغيرات الدالة f.`,
      `2. ب) أكتب معادلة ديكارتية للمماس (T) للمنحنى (C_f) عند النقطة ذات الأفصول x_0 = 0، وبين أن نقطة تقاطع المقاربين Ω هي مركز تماثل للمنحنى (C_f).`,
      `3. أنشئ في نفس المعلم المستقيمين المقاربين والمنحنى (C_f)، ثم ناقش مبيانياً حسب قيم الوسيط m عدد حلول المعادلة f(x) = m.`,
    ];
    questionsFr = [
      `Soit f la fonction numérique définie pour tout x ≠ 1 par : f(x) = (x² - ${k}x + 1)/(x - 1) et (C_f) sa courbe dans un repère orthonormé (O, i, j).`,
      `1. a) Déterminer D_f, calculer les limites aux bornes de D_f et en déduire l'asymptote verticale.`,
      `1. b) Vérifier que pour tout x ∈ D_f : f(x) = x - ${Number(k) - 1} + ${2 - Number(k)}/(x - 1), et en déduire l'existence d'une asymptote oblique (Δ) en ±∞.`,
      `2. a) Calculer la dérivée f'(x), étudier son signe et dresser le tableau de variations complet de f.`,
      `2. b) Donner l'équation de la tangente (T) en x_0 = 0 et montrer que le point d'intersection Ω des deux asymptotes est centre de symétrie de (C_f).`,
      `3. Construire les asymptotes et la courbe (C_f), puis discuter graphiquement suivant les valeurs du réel m le nombre de solutions de f(x) = m.`,
    ];
  }

  if (
    density === "INTENSIVE" &&
    !lesson.isImportedSimulation &&
    !lesson.hasCustomQuestions
  ) {
    const capExtraAr =
      lesson.capacitiesAr[lesson.capacitiesAr.length - 1] ||
      lesson.capacitiesAr[0] ||
      lesson.lessonAr;
    const capExtraFr =
      lesson.capacitiesFr[lesson.capacitiesFr.length - 1] ||
      lesson.capacitiesFr[0] ||
      lesson.lessonFr;
    const nextNum = questionsAr.length + 1;
    if (subCat === "هندسة فضائية" || subCat === "هندسة مستوية" || lesson.category === "Geometry") {
      questionsAr.push(
        `${nextNum}. أ) استثمار هندسي (المستوى N2): حدد إحداثيات النقطة M' مماثلة النقطة المدروسة بالنسبة للمستقيم (أو المستوى)، ثم أحسب مساحة الحيز الهندسي أو حجم رباعي الأوجه.`,
        `${nextNum}. ب) سؤال التميز والمبادرة (المستوى N3 - المنهاج المغربي): ناقش حسب قيم الوسيط الحقيقي m الوضع النسبي وحدد المحل الهندسي لمراكز التقاطع.`
      );
      questionsFr.push(
        `${nextNum}. a) Exploitation géométrique (Niveau N2) : Déterminer les coordonnées du symétrique orthogonal M', puis calculer l'aire ou le volume du solide associé.`,
        `${nextNum}. b) Approfondissement & Initiative (Niveau N3 - OP Maroc) : Discuter suivant les valeurs du paramètre réel m la position relative et déterminer le lieu géométrique.`
      );
    } else if (subCat === "احتمالات وإحصاء" || titleFr.includes("probabilit")) {
      questionsAr.push(
        `${nextNum}. أ) استثمار قانون الاحتمال (المستوى N2): أحسب الاحتمال الشرطي علماً أن الكرات المسحوبة تحمل أرقاماً زوجية، وقارن النتيجة مع حالة السحب بالتتابع وبدون إحلال.`,
        `${nextNum}. ب) سؤال التعمق (المستوى N3): نكرر التجربة n مرة (n ≥ 2). حدد بدلالة n احتمال الحصول على الحدث المدروس مرة واحدة على الأقل، ثم أحسب نهايته عندما يؤول n إلى +∞.`
      );
      questionsFr.push(
        `${nextNum}. a) Exploitation probabiliste (Niveau N2) : Calculer la probabilité conditionnelle sachant la parité et comparer avec le tirage successif sans remise.`,
        `${nextNum}. b) Synthèse (Niveau N3) : On répète l'épreuve n fois (n ≥ 2). Exprimer en fonction de n la probabilité d'obtenir au moins un succès et calculer sa limite en +∞.`
      );
    } else if (subCat === "جبر" || subCat === "حسابيات" || subCat === "منطق ومجموعات" || lesson.category === "Algebra") {
      questionsAr.push(
        `${nextNum}. أ) تعبئة الموارد (المستوى N2): استثمر النتائج السابقة لحل النظمة أو المتراجحة البارامترية المرتبطة بـ « ${capExtraAr} ».`,
        `${nextNum}. ب) سؤال التعمق والاستدلال (المستوى N3 - المنهاج المغربي): برهن بالاستدلال بالخلف أو بفصل الحالات على الخاصية التعميمية من أجل كل عدد صحيح طبيعي n.`
      );
      questionsFr.push(
        `${nextNum}. a) Mobilisation (Niveau N2) : Exploiter les résultats précédents pour résoudre le système ou l'inéquation associé(e) à « ${capExtraFr} ».`,
        `${nextNum}. b) Raisonnement & Synthèse (Niveau N3) : Démontrer par l'absurde ou par disjonction des cas la propriété généralisée pour tout entier naturel n.`
      );
    } else {
      questionsAr.push(
        `${nextNum}. أ) تأويل مبياني وتكامل (المستوى N2): بين أن الدالة تقبل دالة عكسية f⁻¹ على مجال يطلب تحديده، ثم أنشئ منحناها (C_{f⁻¹}) في نفس المعلم المتعامد الممنظم.`,
        `${nextNum}. ب) سؤال التوليف والمبادرة (المستوى N3 - الإطار المرجعي المغربي): باعتبار المتتالية المعرفة بـ u_{n+1} = f(u_n)، أدرس رتابتها وتقاربها وحدد نهايتها بدقة.`
      );
      questionsFr.push(
        `${nextNum}. a) Bijection & Courbe réciproque (Niveau N2) : Montrer que f réalise une bijection sur un intervalle J à préciser et construire (C_{f⁻¹}) dans le même repère.`,
        `${nextNum}. b) Problème de synthèse (Niveau N3 - Cadre Référentiel Maroc) : Étudier la monotonie et la convergence de la suite récurrente définie par u_{n+1} = f(u_n).`
      );
    }
  }

  if (shuffleQuestions && model === "B" && questionsAr.length > 2) {
    const startsWithIntro = (q: string) =>
      !/^[0-9]+[\.\-\)]/i.test(q.trim()) && !/^Q[0-9]+/i.test(q.trim()) && !/^[I|V|X]+[\.\-\)]/i.test(q.trim());
    const hasIntroAr = startsWithIntro(questionsAr[0]);
    const hasIntroFr = startsWithIntro(questionsFr[0]);

    if (hasIntroAr && hasIntroFr && questionsAr.length > 3) {
      // الحفاظ على نص المعطيات/المسألة التمهيدي في الموضع 0 وتبديل الأسئلة الفرعية اللاحقة فقط
      return {
        questionsAr: [questionsAr[0], questionsAr[2], questionsAr[1], ...questionsAr.slice(3)],
        questionsFr: [questionsFr[0], questionsFr[2], questionsFr[1], ...questionsFr.slice(3)],
      };
    } else if (!hasIntroAr && !hasIntroFr) {
      return {
        questionsAr: [questionsAr[1], questionsAr[0], ...questionsAr.slice(2)],
        questionsFr: [questionsFr[1], questionsFr[0], ...questionsFr.slice(2)],
      };
    }
  }

  return { questionsAr, questionsFr };
}

export type QCMScoringMode =
  | "JUSTIFICATION_REQUIRED"
  | "DIRECT_NO_JUSTIFICATION"
  | "NEGATIVE_PENALTY";

export interface MoroccanQCMItem {
  num: number;
  statementAr: string;
  statementFr: string;
  optionsAr: string[];
  optionsFr: string[];
  correctAnswerAr: string;
  correctAnswerFr: string;
  justificationAr: string;
  justificationFr: string;
  points: string;
}

export interface QCMGeneratorConfig {
  questionCount?: number;
  scoringMode?: QCMScoringMode;
  customItems?: MoroccanQCMItem[];
  isMission?: boolean;
}

export function generateMoroccanQCMExercise(
  lessons: LessonItem[],
  model: "A" | "B" | "C" | "D" | string = "A",
  cycle: CycleType = "2BAC",
  config?: QCMGeneratorConfig
): {
  titleAr: string;
  titleFr: string;
  instructionAr: string;
  instructionFr: string;
  totalPoints: string;
  items: MoroccanQCMItem[];
} {
  const isModelA = model === "A" || model === "C";
  const l0 = lessons[0]?.lessonAr || "التحليل والدوال";
  const l0Fr = lessons[0]?.lessonFr || "Analyse et Fonctions";
  const l1 = lessons[1]?.lessonAr || l0;
  const l1Fr = lessons[1]?.lessonFr || l0Fr;

  const scoringMode: QCMScoringMode = config?.scoringMode || "JUSTIFICATION_REQUIRED";
  const requestedCount = Math.min(6, Math.max(2, config?.questionCount || 4));
  const customItems = config?.customItems || [];
  const isMission = Boolean(config?.isMission);

  const buildInstructions = (count: number, ptsPerQ: string, totalPts: string) => {
    if (scoringMode === "DIRECT_NO_JUSTIFICATION") {
      return {
        instructionAr: `لكل سؤال من الأسئلة الـ (${count}) المستقلة التالية، انقل على ورقة تحريرك رقم السؤال والحرف الموافق للاقتراح الصحيح الوحيد من بين الاختيارات الأربعة (أ، ب، ج، د). لا يُطلب منك تعليل الجواب (${totalPts} نقط = ${ptsPerQ} ن × ${count}):`,
        instructionFr: `Cet exercice est un questionnaire à choix multiples (QCM). Pour chacune des ${count} questions indépendantes, recopier sur la copie le numéro de la question et la lettre correspondant à la seule réponse exacte parmi (A, B, C, D). Aucune justification n'est demandée (${totalPts} pts = ${ptsPerQ} pt × ${count}) :`,
      };
    }
    if (scoringMode === "NEGATIVE_PENALTY") {
      return {
        instructionAr: `لكل سؤال من الأسئلة الـ (${count}) التالية، اختر الجواب الصحيح الوحيد من بين (أ، ب، ج، د). يمنح الجواب الصحيح (+${ptsPerQ} ن)، والجواب الخاطئ يخصم (-0.25 ن)، بينما عدم الإجابة يمنح (0 ن) دون أي خصم (${totalPts} نقط):`,
        instructionFr: `QCM à barème dégressif (${count} questions) : Une réponse exacte rapporte +${ptsPerQ} pt, une réponse fausse enlève -0.25 pt, et l'absence de réponse rapporte 0 pt (Total : ${totalPts} pts) :`,
      };
    }
    return {
      instructionAr: `لكل سؤال من الأسئلة الـ (${count}) المستقلة التالية، انقل على ورقة تحريرك رقم السؤال والحرف الموافق للاقتراح الصحيح الوحيد من بين الاختيارات الأربعة (أ، ب، ج، د) مع تعليل جوابك تعليلاً رياضياً دقيقاً (${totalPts} نقط = ${ptsPerQ} ن × ${count}):`,
      instructionFr: `Pour chacune des ${count} questions indépendantes suivantes, recopier sur votre copie le numéro de la question et la lettre correspondant à la seule réponse exacte parmi (A, B, C, D) en justifiant rigoureusement votre démarche (${totalPts} pts = ${ptsPerQ} pt × ${count}) :`,
    };
  };

  let basePool: MoroccanQCMItem[] = [];

  if (cycle === "TC" || cycle === "2NDE") {
    basePool = [
      {
        num: 1,
        statementAr: isModelA
          ? "ليكن n عدداً صحيحاً طبيعياً. العدد الصحيح A = n(n + 1)(2n + 1) هو دائماً:"
          : "ليكن n عدداً صحيحاً طبيعياً. العدد الصحيح B = n³ - n هو دائماً:",
        statementFr: isModelA
          ? "Soit n ∈ ℕ. L'entier naturel A = n(n + 1)(2n + 1) est toujours :"
          : "Soit n ∈ ℕ. L'entier naturel B = n³ - n est toujours :",
        optionsAr: ["أ) مضاعف للعدد 6", "ب) عدد فردي", "ج) عدد أولي", "د) مربع كامل"],
        optionsFr: ["A) Multiple de 6", "B) Un entier impair", "C) Un nombre premier", "D) Un carré parfait"],
        correctAnswerAr: "أ) مضاعف للعدد 6",
        correctAnswerFr: "A) Multiple de 6",
        justificationAr:
          "لأن جداء عددين متتاليين n(n+1) زوجي، وبفصل الحالات حسب بواقي قسمة n على 3 نجد أن الجداء يقبل القسمة على 2 وعلى 3 معاً.",
        justificationFr:
          "Le produit de deux entiers consécutifs est pair, et par disjonction des cas modulo 3, le produit est divisible par 2 et 3 donc par 6.",
        points: "1.0",
      },
      {
        num: 2,
        statementAr: isModelA
          ? "إذا كان x ∈ [1, 3] و y ∈ [-2, -1] فإن التأطير الصحيح للجداء x·y هو:"
          : "إذا كان x ∈ [2, 4] و y ∈ [-3, -1] فإن التأطير الصحيح للجداء x·y هو:",
        statementFr: isModelA
          ? "Si x ∈ [1, 3] et y ∈ [-2, -1], alors l'encadrement exact du produit x·y est :"
          : "Si x ∈ [2, 4] et y ∈ [-3, -1], alors l'encadrement exact du produit x·y est :",
        optionsAr: isModelA
          ? ["أ) -6 ≤ xy ≤ -1", "ب) -2 ≤ xy ≤ -3", "ج) 1 ≤ xy ≤ 6", "د) -3 ≤ xy ≤ -2"]
          : ["أ) -12 ≤ xy ≤ -2", "ب) -6 ≤ xy ≤ -4", "ج) 2 ≤ xy ≤ 12", "د) -8 ≤ xy ≤ -3"],
        optionsFr: isModelA
          ? ["A) -6 ≤ xy ≤ -1", "B) -2 ≤ xy ≤ -3", "C) 1 ≤ xy ≤ 6", "D) -3 ≤ xy ≤ -2"]
          : ["A) -12 ≤ xy ≤ -2", "B) -6 ≤ xy ≤ -4", "C) 2 ≤ xy ≤ 12", "D) -8 ≤ xy ≤ -3"],
        correctAnswerAr: isModelA ? "أ) -6 ≤ xy ≤ -1" : "أ) -12 ≤ xy ≤ -2",
        correctAnswerFr: isModelA ? "A) -6 ≤ xy ≤ -1" : "A) -12 ≤ xy ≤ -2",
        justificationAr:
          "نؤطر العدد الموجب (-y) أولاً ثم نضرب طرفاً بطرف الأعداد الموجبة، وأخيراً نضرب في (-1) مع قلب رمز المتفاوتة.",
        justificationFr:
          "On encadre d'abord l'opposé positif (-y) > 0, on multiplie membre à membre les positifs, puis on reprend l'opposé.",
        points: "1.0",
      },
      {
        num: 3,
        statementAr:
          "في المستوى المنسوب لمعلم متعامد ممنظم، إذا كان AB⃗(2, -3) و AC⃗(-4, 6) فإن النقط A و B و C:",
        statementFr:
          "Dans le plan muni d'un repère, si AB⃗(2, -3) et AC⃗(-4, 6), alors les points A, B et C :",
        optionsAr: [
          "أ) مستقيمية",
          "ب) تشكل مثلثاً قائم الزاوية",
          "ج) تشكل مثلثاً متساوي الأضلاع",
          "د) غير مستوائية",
        ],
        optionsFr: [
          "A) Sont alignés",
          "B) Forment un triangle rectangle",
          "C) Forment un triangle équilatéral",
          "D) Sont confondus",
        ],
        correctAnswerAr: "أ) مستقيمية",
        correctAnswerFr: "A) Sont alignés",
        justificationAr:
          "لأن محددة المتجهتين det(AB⃗, AC⃗) = 2×6 - (-3)×(-4) = 12 - 12 = 0 (أي AC⃗ = -2 AB⃗).",
        justificationFr:
          "Car det(AB⃗, AC⃗) = 2×6 - (-3)×(-4) = 0, soit AC⃗ = -2 AB⃗ (vecteurs colinéaires).",
        points: "1.0",
      },
      {
        num: 4,
        statementAr: isModelA
          ? "مجموعة حلول المتراجحة |2x - 3| ≤ 5 في المجموعة R هي المجال:"
          : "مجموعة حلول المتراجحة |2x - 1| ≤ 3 في المجموعة R هي المجال:",
        statementFr: isModelA
          ? "L'ensemble des solutions dans ℝ de l'inéquation |2x - 3| ≤ 5 est l'intervalle :"
          : "L'ensemble des solutions dans ℝ de l'inéquation |2x - 1| ≤ 3 est l'intervalle :",
        optionsAr: isModelA
          ? ["أ) S = [-1, 4]", "ب) S = [1, 4]", "ج) S = ]-∞, -1] ∪ [4, +∞[", "د) S = ]-1, 4["]
          : ["أ) S = [-1, 2]", "ب) S = [1, 2]", "ج) S = [-2, 1]", "د) S = ]-1, 2["],
        optionsFr: isModelA
          ? ["A) S = [-1, 4]", "B) S = [1, 4]", "C) S = ]-∞, -1] ∪ [4, +∞[", "D) S = ]-1, 4["]
          : ["A) S = [-1, 2]", "B) S = [1, 2]", "C) S = [-2, 1]", "D) S = ]-1, 2["],
        correctAnswerAr: isModelA ? "أ) S = [-1, 4]" : "أ) S = [-1, 2]",
        correctAnswerFr: isModelA ? "A) S = [-1, 4]" : "A) S = [-1, 2]",
        justificationAr:
          "بتطبيق الخاصية |X| ≤ r ⇔ -r ≤ X ≤ r ثم استخلاص قيمة x.",
        justificationFr:
          "Par équivalence : |X| ≤ r ⇔ -r ≤ X ≤ r, ce qui donne directement l'intervalle fermé.",
        points: "1.0",
      },
      {
        num: 5,
        statementAr: "مميز المعادلة من الدرجة الثانية x² - 4x + 3 = 0 ومجموع جذريها S هما:",
        statementFr: "Le discriminant Δ et la somme S des racines de l'équation x² - 4x + 3 = 0 sont :",
        optionsAr: ["أ) Δ = 4 و S = 4", "ب) Δ = 4 و S = -4", "ج) Δ = 28 و S = 3", "د) Δ = -4 و S = 4"],
        optionsFr: ["A) Δ = 4 et S = 4", "B) Δ = 4 et S = -4", "C) Δ = 28 et S = 3", "D) Δ = -4 et S = 4"],
        correctAnswerAr: "أ) Δ = 4 و S = 4",
        correctAnswerFr: "A) Δ = 4 et S = 4",
        justificationAr: "لدينا Δ = (-4)² - 4(1)(3) = 16 - 12 = 4، ومجموع الجذرين S = -b/a = 4.",
        justificationFr: "Δ = (-4)² - 4×1×3 = 4 et la somme des racines vaut S = -b/a = 4.",
        points: "1.0",
      },
      {
        num: 6,
        statementAr: "القيمة المضبوطة للعدد cos(π/3) + sin(π/6) تساوي:",
        statementFr: "La valeur exacte de cos(π/3) + sin(π/6) est égale à :",
        optionsAr: ["أ) 1", "ب) √3", "ج) 1/2", "د) √3/2"],
        optionsFr: ["A) 1", "B) √3", "C) 1/2", "D) √3/2"],
        correctAnswerAr: "أ) 1",
        correctAnswerFr: "A) 1",
        justificationAr: "لأن cos(π/3) = 1/2 و sin(π/6) = 1/2 ومنه مجموعهما يساوي 1.",
        justificationFr: "Puisque cos(π/3) = 1/2 et sin(π/6) = 1/2, leur somme vaut 1.",
        points: "1.0",
      },
    ];
  } else {
    basePool = [
      {
        num: 1,
        statementAr: isModelA
          ? "نهاية الدالة lim_{x→+∞} (ln(x² + 1) - 2x) على المجال ]0, +∞[ تساوي:"
          : "نهاية الدالة lim_{x→0^+} x² · ln(x) على المجال ]0, +∞[ تساوي:",
        statementFr: isModelA
          ? "La limite lim_{x→+∞} (ln(x² + 1) - 2x) est égale à :"
          : "La limite lim_{x→0^+} x² · ln(x) est égale à :",
        optionsAr: isModelA
          ? ["أ) -∞", "ب) 0", "ج) +∞", "د) 2"]
          : ["أ) 0", "ب) -∞", "ج) 1", "د) +∞"],
        optionsFr: isModelA
          ? ["A) -∞", "B) 0", "C) +∞", "D) 2"]
          : ["A) 0", "B) -∞", "C) 1", "D) +∞"],
        correctAnswerAr: isModelA ? "أ) -∞" : "أ) 0",
        correctAnswerFr: isModelA ? "A) -∞" : "A) 0",
        justificationAr: isModelA
          ? "بالتعميل بـ x نجد ln(x²+1) - 2x = x(2ln(x)/x - 2) + ln(1+1/x²) وبما أن lim ln(x)/x = 0 فإن النهاية هي -∞."
          : "حسب النهايات الاعتيادية الأساسية في المقرر لدينا لكل n ≥ 1 : lim_{x→0^+} x^n ln(x) = 0.",
        justificationFr: isModelA
          ? "En factorisant par x : x(2ln(x)/x - 2) + ln(1 + 1/x²) → -∞ car lim_{x→+∞} ln(x)/x = 0."
          : "D'après les limites de référence du programme (croissances comparées) : lim_{x→0^+} x^n ln(x) = 0.",
        points: "1.0",
      },
      {
        num: 2,
        statementAr: isModelA
          ? "في المجموعة C، عمدة العدد العقدي z = (-√3 + i)^6 توافق بترديد 2π العدد:"
          : "في المجموعة C، معيار وعمدة العدد العقدي z = 1 + i√3 هما:",
        statementFr: isModelA
          ? "Dans ℂ, un argument du nombre complexe z = (-√3 + i)^6 est congru modulo 2π à :"
          : "Dans ℂ, le module et un argument de z = 1 + i√3 sont :",
        optionsAr: isModelA
          ? ["أ) π [2π] (عدد حقيقي سالب)", "ب) π/2 [2π]", "ج) π/3 [2π]", "د) -π/6 [2π]"]
          : [
              "أ) |z| = 2 و arg(z) ≡ π/3 [2π]",
              "ب) |z| = 2 و arg(z) ≡ π/6 [2π]",
              "ج) |z| = 4 و arg(z) ≡ π/3 [2π]",
              "د) |z| = √2 و arg(z) ≡ π/4 [2π]",
            ],
        optionsFr: isModelA
          ? ["A) π [2π]", "B) π/2 [2π]", "C) π/3 [2π]", "D) -π/6 [2π]"]
          : [
              "A) |z| = 2 et arg(z) ≡ π/3 [2π]",
              "B) |z| = 2 et arg(z) ≡ π/6 [2π]",
              "C) |z| = 4 et arg(z) ≡ π/3 [2π]",
              "D) |z| = √2 et arg(z) ≡ π/4 [2π]",
            ],
        correctAnswerAr: isModelA
          ? "أ) π [2π] (عدد حقيقي سالب)"
          : "أ) |z| = 2 و arg(z) ≡ π/3 [2π]",
        correctAnswerFr: isModelA ? "A) π [2π]" : "A) |z| = 2 et arg(z) ≡ π/3 [2π]",
        justificationAr: isModelA
          ? "لدينا -√3 + i = 2 e^{i5π/6}، ومنه z = 2^6 e^{i5π} = -64، وعمدته 5π ≡ π [2π]."
          : "لدينا |z| = √(1 + 3) = 2، ومنه z = 2(1/2 + i√3/2) = 2(cos(π/3) + i sin(π/3)).",
        justificationFr: isModelA
          ? "On écrit -√3 + i = 2e^{i5π/6}, d'où z = 64e^{i5π} = -64 et arg(z) ≡ π [2π]."
          : "On calcule |z| = √(1² + (√3)²) = 2 et on factorise par 2 : z = 2(cos(π/3) + i sin(π/3)).",
        points: "1.0",
      },
      {
        num: 3,
        statementAr: isModelA
          ? "قيمة التكامل I = ∫_1^e (ln(x))/x dx تساوي بالضبط:"
          : "قيمة التكامل J = ∫_0^1 2x · e^{x²} dx تساوي بالضبط:",
        statementFr: isModelA
          ? "La valeur exacte de l'intégrale I = ∫_1^e (ln(x))/x dx est :"
          : "La valeur exacte de l'intégrale J = ∫_0^1 2x · e^{x²} dx est :",
        optionsAr: isModelA
          ? ["أ) 1/2", "ب) 1", "ج) e - 1", "د) 1/e"]
          : ["أ) e - 1", "ب) e", "ج) 1", "د) e² - 1"],
        optionsFr: isModelA
          ? ["A) 1/2", "B) 1", "C) e - 1", "D) 1/e"]
          : ["A) e - 1", "B) e", "C) 1", "D) e² - 1"],
        correctAnswerAr: isModelA ? "أ) 1/2" : "أ) e - 1",
        correctAnswerFr: isModelA ? "A) 1/2" : "A) e - 1",
        justificationAr: isModelA
          ? "الدالة تحت التكامل من الشكل u'(x)·u(x) حيث u(x) = ln(x)، إذن دالتها الأصلية هي (1/2)(ln x)²، ومنه I = 1/2."
          : "الدالة من الشكل u'(x)e^{u(x)} مع u(x) = x²، إذن دالتها الأصلية هي e^{x²}، ومنه J = e^1 - e^0 = e - 1.",
        justificationFr: isModelA
          ? "Forme u'·u avec u(x) = ln(x) : une primitive est (1/2)(ln x)², d'où I = 1/2 - 0 = 1/2."
          : "Forme u'·e^u avec u(x) = x² : une primitive est e^{x²}, d'où J = e^1 - e^0 = e - 1.",
        points: "1.0",
      },
      {
        num: 4,
        statementAr: isModelA
          ? "في الفضاء المنسوب لمعلم متعامد ممنظم، مسافة النقطة Ω(1, -1, 2) عن المستوى (P) : 2x - y + 2z - 3 = 0 هي:"
          : "في الفضاء المنسوب لمعلم متعامد ممنظم، مسافة النقطة Ω(2, 1, -1) عن المستوى (P) : x + 2y + 2z + 3 = 0 هي:",
        statementFr: isModelA
          ? "Dans l'espace muni d'un repère orthonormé, la distance du point Ω(1, -1, 2) au plan (P) : 2x - y + 2z - 3 = 0 est :"
          : "Dans l'espace muni d'un repère orthonormé, la distance du point Ω(2, 1, -1) au plan (P) : x + 2y + 2z + 3 = 0 est :",
        optionsAr: isModelA
          ? ["أ) d = 4/3", "ب) d = 2", "ج) d = 4/9", "د) d = √3"]
          : ["أ) d = 5/3", "ب) d = 3", "ج) d = 5/9", "د) d = √5"],
        optionsFr: isModelA
          ? ["A) d = 4/3", "B) d = 2", "C) d = 4/9", "D) d = √3"]
          : ["A) d = 5/3", "B) d = 3", "C) d = 5/9", "D) d = √5"],
        correctAnswerAr: isModelA ? "أ) d = 4/3" : "أ) d = 5/3",
        correctAnswerFr: isModelA ? "A) d = 4/3" : "A) d = 5/3",
        justificationAr: isModelA
          ? "بتطبيق صيغة المسافة: d(Ω, (P)) = |2(1) - (-1) + 2(2) - 3| / √(2² + (-1)² + 2²) = 4/3."
          : "بتطبيق صيغة المسافة: d(Ω, (P)) = |2 + 2(1) + 2(-1) + 3| / √(1² + 2² + 2²) = 5/3.",
        justificationFr: isModelA
          ? "Par application directe de la formule : d(Ω,(P)) = |2 + 1 + 4 - 3| / √(4 + 1 + 4) = 4/3."
          : "Par application directe de la formule : d(Ω,(P)) = |2 + 2 - 2 + 3| / √(1 + 4 + 4) = 5/3.",
        points: "1.0",
      },
      {
        num: 5,
        statementAr: "الحل العام للمعادلة التفاضلية y' + 2y = 0 على المجموعة R هو الدوال من الشكل:",
        statementFr: "La solution générale sur ℝ de l'équation différentielle y' + 2y = 0 est :",
        optionsAr: [
          "أ) y(x) = k·e^{-2x} (مع k ∈ R)",
          "ب) y(x) = k·e^{2x} (مع k ∈ R)",
          "ج) y(x) = -2e^x + k",
          "د) y(x) = k·cos(2x)",
        ],
        optionsFr: [
          "A) y(x) = k·e^{-2x} (k ∈ ℝ)",
          "B) y(x) = k·e^{2x} (k ∈ ℝ)",
          "C) y(x) = -2e^x + k",
          "D) y(x) = k·cos(2x)",
        ],
        correctAnswerAr: "أ) y(x) = k·e^{-2x} (مع k ∈ R)",
        correctAnswerFr: "A) y(x) = k·e^{-2x} (k ∈ ℝ)",
        justificationAr: "المعادلة من الشكل y' = ay مع a = -2، وحلولها هي الدوال x ↦ k·e^{-2x}.",
        justificationFr: "Équation linéaire y' = ay avec a = -2, dont les solutions sont x ↦ k·e^{-2x}.",
        points: "1.0",
      },
      {
        num: 6,
        statementAr: "إذا كان X متغيراً عشوائياً يتبع القانون الحداني B(n=4, p=1/2)، فإن الأمل الرياضي E(X) يساوي:",
        statementFr: "Si X suit la loi binomiale B(n=4, p=1/2), alors son espérance mathématique E(X) vaut :",
        optionsAr: ["أ) E(X) = 2", "ب) E(X) = 1", "ج) E(X) = 1/2", "د) E(X) = 4"],
        optionsFr: ["A) E(X) = 2", "B) E(X) = 1", "C) E(X) = 1/2", "D) E(X) = 4"],
        correctAnswerAr: "أ) E(X) = 2",
        correctAnswerFr: "A) E(X) = 2",
        justificationAr: "حسب خاصية الأمل الرياضي للقانون الحداني B(n, p) لدينا E(X) = n × p = 4 × (1/2) = 2.",
        justificationFr: "Pour une loi binomiale B(n, p), l'espérance est E(X) = n × p = 4 × 0,5 = 2.",
        points: "1.0",
      },
    ];
  }

  // دمج الأسئلة المخصصة التي أضافها الأستاذ مع الأسئلة المرجعية
  const combinedItems = [
    ...customItems,
    ...basePool.slice(0, Math.max(0, requestedCount - customItems.length)),
  ].slice(0, Math.max(requestedCount, customItems.length));

  const ptsPerItemNum = 1.0;
  const ptsPerItemStr = "1.0";
  const totalNumeric = Number((combinedItems.length * ptsPerItemNum).toFixed(1));

  const numberedItems: MoroccanQCMItem[] = combinedItems.map((it, idx) => ({
    ...it,
    num: idx + 1,
    points: ptsPerItemStr,
  }));

  const { instructionAr, instructionFr } = buildInstructions(
    numberedItems.length,
    ptsPerItemStr,
    totalNumeric.toFixed(1)
  );

  return {
    titleAr: isMission
      ? `التمرين الأول: أسئلة الاختيار من متعدد (QCM — ${numberedItems.length} أسئلة مستقلة) — ${l0}`
      : `التمرين الأول: أسئلة الاختيار من متعدد (QCM — ${numberedItems.length} أسئلة) — وفق الإطار المرجعي المغربي`,
    titleFr: isMission
      ? `Exercice 1 : Questionnaire à Choix Multiples (QCM — ${numberedItems.length} questions — Bac Spécialité AEFE)`
      : `Exercice 1 : QCM & Vrai/Faux (${numberedItems.length} questions) — Cadre Référentiel Marocain`,
    instructionAr,
    instructionFr,
    totalPoints: totalNumeric.toFixed(1),
    items: numberedItems,
  };
}

export interface MoroccanSynthesisProblem {
  titleAr: string;
  titleFr: string;
  totalPoints: string;
  parts: Array<{
    partTitleAr: string;
    partTitleFr: string;
    partPoints: string;
    questionsAr: string[];
    questionsFr: string[];
    correctionAr: string[];
    correctionFr: string[];
  }>;
}

export function generateMoroccanSynthesisProblem(
  lessons: LessonItem[],
  model: "A" | "B" | "C" | "D" | string = "A",
  cycle: CycleType = "2BAC",
  isMission: boolean = false
): MoroccanSynthesisProblem {
  const isModelA = model === "A";
  const k = model === "A" ? "2" : model === "B" ? "3" : model === "C" ? "4" : "5";

  if (cycle === "TC" || cycle === "1BAC") {
    return {
      titleAr: isMission
        ? "المسألة التوليفية الشاملة (Problème de Synthèse — AEFE / Première & Seconde) — دراسة دالة عددية، تأويل مبياني، ومتتالية مرتبطة"
        : "المسألة التوليفية الشاملة (Problème de Synthèse) — دراسة دالة عددية، تأويل مبياني، ومتتالية مرتبطة",
      titleFr: isMission
        ? "Problème de Synthèse (Format Éduscol / AEFE — Seconde & Première Spécialité) — Étude de fonction, représentation graphique et suite"
        : "Problème de Synthèse (Format Officiel Marocain) — Étude de fonction, représentation graphique et suite",
      totalPoints: "8.5",
      parts: [
        {
          partTitleAr: "الجزء الأول (Partie I) : دراسة حدودية وإشارة تعبير جبري (2.5 ن)",
          partTitleFr: "Partie I : Étude algébrique d'un polynôme auxiliaire (2.5 pts)",
          partPoints: "2.5",
          questionsAr: [
            `1. نعتبر الحدودية P(x) = x³ - ${k}x² - x + ${k} لكل x من R. تحقق أن العدد 1 جذر للحدودية P(x). [0.75 ن · N1]`,
            `2. حدد الحدودية Q(x) بحيث P(x) = (x - 1)Q(x)، ثم عمل P(x) إلى جداء عوامل من الدرجة الأولى. [1.0 ن · N2]`,
            `3. ضع جدول إشارة P(x) على R واستنتج حلول المتراجحة P(x) ≥ 0. [0.75 ن · N2]`,
          ],
          questionsFr: [
            `1. On considère le polynôme P(x) = x³ - ${k}x² - x + ${k} sur ℝ. Vérifier que 1 est une racine de P(x). [0.75 pt · N1]`,
            `2. Déterminer le trinôme Q(x) tel que P(x) = (x - 1)Q(x), puis factoriser complètement P(x). [1.0 pt · N2]`,
            `3. Dresser le tableau de signes de P(x) sur ℝ et en déduire les solutions de P(x) ≥ 0. [0.75 pt · N2]`,
          ],
          correctionAr: [
            `1. بتعويض x = 1 نجد P(1) = 1 - ${k} - 1 + ${k} = 0، إذن 1 جذر للحدودية P(x).`,
            `2. بالقسمة الإقليدية أو بالتعميل نجد P(x) = (x - 1)(x + 1)(x - ${k}).`,
            `3. تنعدم P(x) في -1 و 1 و ${k}، ومنه S = [-1, 1] ∪ [${k}, +∞[.`,
          ],
          correctionFr: [
            `1. On calcule P(1) = 1 - ${k} - 1 + ${k} = 0, donc 1 est bien racine.`,
            `2. Par factorisation : P(x) = (x - 1)(x + 1)(x - ${k}).`,
            `3. Tableau de signes de P(x) : S = [-1, 1] ∪ [${k}, +∞[.`,
          ],
        },
        {
          partTitleAr: "الجزء الثاني (Partie II) : دراسة دالة عددية وإنشاء منحناها المبياني (C_f) (6.0 ن)",
          partTitleFr: "Partie II : Étude d'une fonction numérique et tracé de sa courbe (C_f) (6.0 pts)",
          partPoints: "6.0",
          questionsAr: [
            `1. نعتبر الدالة العددية f المعرفة بـ f(x) = (x² - x + ${k})/(x - 1) لكل x ≠ 1، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i⃗, j⃗). حدد D_f وأحسب النهايات عند محدات D_f (في حال سلك الباكالوريا) أو تحقق من تغيراتها على المجالات. [1.25 ن · N1]`,
            `2. أ) بين أنه لكل x ≠ 1 لدينا: f(x) = x + ${k}/(x - 1)، واستنتج معادلة المستقيم المقارب المائل (Δ) للمنحنى (C_f) وأدرس الوضع النسبي لـ (C_f) و (Δ). [1.75 ن · N2]`,
            `2. ب) أحسب المشتقة f'(x) (أو معدل التغير) لكل x ≠ 1، ثم ضع جدول تغيرات الدالة f كاملاً. [1.5 ن · N2]`,
            `3. أنشئ المستقيمين المقاربين والمنحنى (C_f) بدقة، ثم ناقش مبيانياً حسب قيم الوسيط الحقيقي m عدد حلول المعادلة f(x) = m. [1.5 ن · N3]`,
          ],
          questionsFr: [
            `1. Soit f la fonction définie pour x ≠ 1 par f(x) = (x² - x + ${k})/(x - 1) et (C_f) sa courbe dans un repère orthonormé (O, i⃗, j⃗). Déterminer D_f et étudier le comportement aux bornes. [1.25 pt · N1]`,
            `2. a) Montrer que pour tout x ≠ 1 : f(x) = x + ${k}/(x - 1), en déduire l'asymptote oblique (Δ) et étudier la position relative de (C_f) et (Δ). [1.75 pt · N2]`,
            `2. b) Déterminer le sens de variation de f sur chaque intervalle de D_f et dresser son tableau de variations complet. [1.5 pt · N2]`,
            `3. Construire les asymptotes et la courbe (C_f), puis discuter graphiquement suivant les valeurs du paramètre m le nombre de solutions de f(x) = m. [1.5 pt · N3]`,
          ],
          correctionAr: [
            `1. مجموعة التعريف D_f = R \\ {1} = ]-∞, 1[ ∪ ]1, +∞[، والمستقيم x = 1 مقارب عمودي.`,
            `2. أ) بتوحيد المقامات نتحقق من الصيغة، والمستقيم (Δ): y = x مقارب مائل لأن lim [f(x) - x] = 0.`,
            `2. ب) المشتقة f'(x) = 1 - ${k}/(x - 1)² = ((x - 1)² - ${k})/(x - 1)²، وتنعدم في 1 - √${k} و 1 + √${k}.`,
            `3. المناقشة المبيانية الأفقية للمعادلة f(x) = m حسب القيم الحدية المحلية للدالة f.`,
          ],
          correctionFr: [
            `1. D_f = ℝ \\ {1} et la droite d'équation x = 1 est asymptote verticale.`,
            `2. a) Mise au même dénominateur immédiate ; (Δ) : y = x est asymptote oblique.`,
            `2. b) f'(x) = ((x - 1)² - ${k})/(x - 1)², s'annule en 1 ± √${k}.`,
            `3. Discussion graphique horizontale suivant la position de la droite y = m par rapport aux extrema locaux.`,
          ],
        },
      ],
    };
  }

  return {
    titleAr: isMission
      ? "المسألة التوليفية الشاملة (Problème de Synthèse — نمط الباكالوريا الفرنسية AEFE) — دراسة دالة، تكامل، ومتتالية مرتبطة"
      : "المسألة التوليفية الشاملة (Problème de Synthèse - نمط الامتحان الوطني المغربي) — دراسة دالة، تكامل، ومتتالية مرتبطة",
    titleFr: isMission
      ? "Problème de Synthèse (Format Épreuve de Spécialité Baccalauréat Français / AEFE) — Fonction, Intégrale & Suite récurrente"
      : "Problème de Synthèse (Format Examen National du Baccalauréat Marocain) — Fonction, Intégrale & Suite récurrente",
    totalPoints: "8.5",
    parts: [
      {
        partTitleAr: "الجزء الأول (Partie I) : دراسة الدالة المساعدة g وتحديد إشارتها (2.0 ن)",
        partTitleFr: "Partie I : Étude de la fonction auxiliaire g et détermination de son signe (2.0 pts)",
        partPoints: "2.0",
        questionsAr: [
          `نعتبر الدالة العددية g المعرفة على المجال ]0, +∞[ بما يلي: g(x) = x² + ${k} - ${k}ln(x).`,
          `1. أ) أحسب المشتقة g'(x) لكل x من ]0, +∞[، ثم أدرس إشارتها وضع جدول تغيرات الدالة g (حساب النهايات غير مطلوب). [1.0 ن · N1]`,
          `1. ب) أحسب القيمة الحدية الدنيا g(√(${k}/2)) أو تحقق أن g(1) = ${Number(k) + 1} > 0، ثم استنتج أنه لكل x من ]0, +∞[ لدينا: g(x) > 0. [1.0 ن · N2]`,
        ],
        questionsFr: [
          `Soit g la fonction numérique définie sur ]0, +∞[ par : g(x) = x² + ${k} - ${k}ln(x).`,
          `1. a) Calculer g'(x) pour tout x > 0, étudier son signe et dresser le tableau de variations de g (le calcul des limites n'est pas demandé). [1.0 pt · N1]`,
          `1. b) En déduire la valeur minimale de g sur ]0, +∞[ et montrer que pour tout x ∈ ]0, +∞[ : g(x) > 0. [1.0 pt · N2]`,
        ],
        correctionAr: [
          `1. أ) الدالة g قابلة للاشتقاق على ]0, +∞[ ولدينا g'(x) = 2x - ${k}/x = (2x² - ${k})/x. تنعدم في x_0 = √(${k}/2).`,
          `1. ب) القيمة الدنيا موجبة قطعا لأن ${k} - (${k}/2)ln(${k}/2) > 0، ومنه لكل x > 0 لدينا g(x) > 0.`,
        ],
        correctionFr: [
          `1. a) g est dérivable sur ]0, +∞[ et g'(x) = (2x² - ${k})/x, qui s'annule et change de signe en x_0 = √(${k}/2).`,
          `1. b) Le minimum absolu de g sur ]0, +∞[ est strictement positif, donc (∀x > 0), g(x) > 0.`,
        ],
      },
      {
        partTitleAr: "الجزء الثاني (Partie II) : دراسة الدالة العددية f والتمثيل المبياني (C_f) وحساب المساحة (4.0 ن)",
        partTitleFr: "Partie II : Étude de la fonction principale f, tracé de (C_f) et calcul d'aire (4.0 pts)",
        partPoints: "4.0",
        questionsAr: [
          `نعتبر الدالة العددية f المعرفة على ]0, +∞[ بـ: f(x) = x + ${k}(ln(x))/x، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i⃗, j⃗) (الوحدة: 2 cm).`,
          `1. أ) أحسب lim_{x→0^+} f(x) وأول النتيجة مبيانياً، ثم أحسب lim_{x→+∞} f(x). [0.75 ن · N1]`,
          `1. ب) بين أن المستقيم (Δ) ذا المعادلة y = x مقارب مائل للمنحنى (C_f) بجوار +∞، ثم أدرس الوضع النسبي للمنحنى (C_f) والمستقيم (Δ) على ]0, +∞[. [1.0 ن · N2]`,
          `2. أ) بين أنه لكل x من ]0, +∞[ لدينا: f'(x) = g(x)/x²، ثم استنتج رتابة الدالة f وضع جدول تغيراتها. [0.75 ن · N2]`,
          `2. ب) أكتب معادلة ديكارتية للمماس (T) للمنحنى (C_f) في النقطة A(1, 1)، ثم أنشئ المستقيمين (Δ) و (T) والمنحنى (C_f). [0.75 ن · N2]`,
          `3. أحسب التكامل I = ∫_1^e (ln(x))/x dx، ثم استنتج بـ cm² مساحة الحيز المستوي المحصور بين المنحنى (C_f) والمستقيم (Δ) والمستقيمين اللذين معادلتاهما x = 1 و x = e. [0.75 ن · N3]`,
        ],
        questionsFr: [
          `On considère la fonction f définie sur ]0, +∞[ par : f(x) = x + ${k}(ln(x))/x et (C_f) sa courbe dans un repère orthonormé (O, i⃗, j⃗) (unité graphique : 2 cm).`,
          `1. a) Calculer lim_{x→0^+} f(x) et interpréter géométriquement le résultat, puis calculer lim_{x→+∞} f(x). [0.75 pt · N1]`,
          `1. b) Montrer que la droite (Δ) : y = x est asymptote oblique à (C_f) au voisinage de +∞ et étudier la position relative de (C_f) et (Δ). [1.0 pt · N2]`,
          `2. a) Montrer que pour tout x > 0 : f'(x) = g(x)/x², en déduire le sens de variation de f et dresser son tableau de variations. [0.75 pt · N2]`,
          `2. b) Déterminer l'équation de la tangente (T) à (C_f) au point A(1, 1), puis construire (Δ), (T) et (C_f). [0.75 pt · N2]`,
          `3. Calculer l'intégrale I = ∫_1^e (ln(x))/x dx et en déduire en cm² l'aire du domaine plan délimité par (C_f), la droite (Δ) et les droites x = 1 et x = e. [0.75 pt · N3]`,
        ],
        correctionAr: [
          `1. أ) lim_{x→0^+} f(x) = -∞ ومنه محور الأراتيب (x = 0) مقارب عمودي لـ (C_f). ولدينا lim_{x→+∞} f(x) = +∞.`,
          `1. ب) لدينا lim_{x→+∞} [f(x) - x] = lim ${k}ln(x)/x = 0 إذن (Δ): y = x مقارب مائل. إشارة f(x) - x هي إشارة ln(x)، أي (C_f) فوق (Δ) على [1, +∞[ وتحته على ]0, 1].`,
          `2. أ) بالاشتقاق نجد f'(x) = 1 + ${k}(1 - ln(x))/x² = (x² + ${k} - ${k}ln(x))/x² = g(x)/x² > 0، إذن f تزايدية قطعا على ]0, +∞[.`,
          `2. ب) معادلة المماس (T) في A(1,1) هي y = f'(1)(x - 1) + f(1) = (${Number(k) + 1})(x - 1) + 1.`,
          `3. لدينا I = [(1/2)(ln x)²]_1^e = 1/2، ومنه المساحة A = ∫_1^e |f(x) - x| dx × 4 cm² = ${k} × (1/2) × 4 = ${Number(k) * 2} cm².`,
        ],
        correctionFr: [
          `1. a) lim_{x→0^+} f(x) = -∞ (axe des ordonnées asymptote verticale) et lim_{x→+∞} f(x) = +∞.`,
          `1. b) lim_{x→+∞} [f(x) - x] = 0 donc (Δ) : y = x est asymptote oblique. (C_f) est au-dessus de (Δ) sur [1, +∞[ et en dessous sur ]0, 1].`,
          `2. a) Pour tout x > 0, f'(x) = g(x)/x² > 0, donc f est strictement croissante sur ]0, +∞[.`,
          `2. b) Équation de la tangente en A(1,1) : y = ${Number(k) + 1}(x - 1) + 1.`,
          `3. I = [1/2 (ln x)²]_1^e = 1/2, d'où l'aire A = ${k} × I × ||i⃗||·||j⃗|| = ${Number(k) * 2} cm².`,
        ],
      },
      {
        partTitleAr: "الجزء الثالث (Partie III) : دراسة متتالية عددية ترجعية (u_n) مرتبطة بالدالة f (2.5 ن)",
        partTitleFr: "Partie III : Étude d'une suite numérique récurrente (u_n) associée à la fonction f (2.5 pts)",
        partPoints: "2.5",
        questionsAr: [
          `نعتبر المتتالية العددية (u_n) المعرفة بحدها الأول u_0 = ${isModelA ? "e" : "2"} وبالعلاقة الترجعية: u_{n+1} = f⁻¹(u_n) أو نعتبر المتتالية المعرفة بـ u_0 = 1 و u_{n+1} = √(u_n + ${k}) لكل n من N.`,
          `1. أ) بين أن الدالة f تقبل دالة عكسية f⁻¹ معرفة على المجال J = R نحو ]0, +∞[، وأحسب (f⁻¹)'(1). [0.75 ن · N2]`,
          `1. ب) بالنسبة للمتتالية الترجعية المرتبطة، بين بالترجع أن 1 ≤ u_n ≤ e لكل n من N، ثم أدرس رتابة المتتالية (u_n). [1.0 ن · N3]`,
          `1. ج) استنتج أن المتتالية (u_n) متقاربة وحدد نهايتها المضبوطة L. [0.75 ن · N3]`,
        ],
        questionsFr: [
          `On s'intéresse à la bijection réciproque f⁻¹ et à la suite récurrente (u_n) associée.`,
          `1. a) Montrer que f réalise une bijection de ]0, +∞[ sur J = ℝ et calculer le nombre dérivé (f⁻¹)'(1). [0.75 pt · N2]`,
          `1. b) Montrer par récurrence que pour tout n ∈ ℕ : 1 ≤ u_n ≤ e, puis étudier la monotonie de la suite (u_n). [1.0 pt · N3]`,
          `1. c) En déduire que la suite (u_n) est convergente et déterminer la valeur exacte de sa limite L. [0.75 pt · N3]`,
        ],
        correctionAr: [
          `1. أ) بما أن f متصلة وتزايدية قطعا على ]0, +∞[ فإنها تقبل دالة عكسية f⁻¹ معرفة على f(]0, +∞[) = R، ولدينا (f⁻¹)'(1) = 1/f'(1) = 1/${Number(k) + 1}.`,
          `1. ب) البرهان بالترجع يعتمد على تزايد الدالة واستقرار المجال [1, e]، والرتابة تستنتج من إشارة f(x) - x.`,
          `1. ج) بما أن (u_n) تناقصية ومصغورة بالعدد 1 فإنها متقاربة، ونهايتها L تحقق f(L) = L أي ln(L) = 0 ومنه L = 1.`,
        ],
        correctionFr: [
          `1. a) f est continue et strictement croissante sur ]0, +∞[, elle réalise donc une bijection sur ℝ, et (f⁻¹)'(1) = 1/f'(1) = 1/${Number(k) + 1}.`,
          `1. b) Par récurrence en utilisant la croissance de f sur l'intervalle stable [1, e].`,
          `1. c) La suite est monotone et bornée donc convergente vers l'unique point fixe L = 1 vérifiant f(L) = L.`,
        ],
      },
    ],
  };
}


export interface QuestionMeta {
  points: string;
  level: "N1" | "N2" | "N3";
  levelLabelAr: string;
  levelLabelFr: string;
}

/**
 * يوزع الرصيد الإجمالي المخصص للتمارين المستقلة (مثلاً 20 ن أو 16 ن أو 11.5 ن أو 7.5 ن)
 * على الدروس المختارة بمضاعفات ربع النقطة (0.25 ن) مع ضبط الباقي في التمرين الأخير
 * لضمان أن مجموع نقط الفرض المحروس يساوي دائماً 20.00 / 20 بدقة تامة.
 */
export function computeExactExerciseEffectiveWeights(
  lessons: Array<{ weight: number }>,
  exBudgetPoints: number
): number[] {
  if (!lessons || lessons.length === 0) return [];
  const rawSum = lessons.reduce((acc, l) => acc + (Number(l.weight) || 0), 0) || 100;
  const targetBudget = Math.max(1, Math.round(exBudgetPoints * 4) / 4);
  let allocatedPts = 0;

  return lessons.map((lesson, idx) => {
    let exPts: number;
    if (idx === lessons.length - 1) {
      exPts = Math.max(0.5, Math.round((targetBudget - allocatedPts) * 4) / 4);
    } else {
      const proportionalPts = ((Number(lesson.weight) || 0) / rawSum) * targetBudget;
      exPts = Math.max(0.5, Math.round(proportionalPts * 4) / 4);
      const minRemainingForOthers = (lessons.length - 1 - idx) * 0.5;
      if (allocatedPts + exPts > targetBudget - minRemainingForOthers) {
        exPts = Math.max(0.5, targetBudget - allocatedPts - minRemainingForOthers);
      }
      allocatedPts += exPts;
    }
    return Number(((exPts / 20) * 100).toFixed(2));
  });
}

/**
 * يوزع نقط التمرين (حسب وزنه المئوي ومستويات المذكرة 142-08 N1/N2/N3) على أسئلة التمرين بدقة رياضية (مضاعفات 0.25)
 */
export function getQuestionBaremesAndLevels(
  lessonWeight: number,
  questionCount: number,
  n1: number = 45,
  n2: number = 35,
  n3: number = 20,
  customBaremes?: number[],
  customLevels?: Array<"N1" | "N2" | "N3">
): QuestionMeta[] {
  const totalExPoints = Math.max(0.25, Math.round(((lessonWeight * 20) / 100) * 4) / 4);
  if (questionCount <= 0) return [];

  const rawRatios: number[] = [];
  const levels: Array<"N1" | "N2" | "N3"> = [];

  for (let i = 0; i < questionCount; i++) {
    const customLvl = customLevels?.[i];
    if (customLvl) {
      levels.push(customLvl);
      rawRatios.push(customLvl === "N1" ? Math.max(20, n1) : customLvl === "N3" ? Math.max(15, n3) : Math.max(20, n2));
    } else if (i === 0) {
      rawRatios.push(Math.max(20, n1));
      levels.push("N1");
    } else if (i === questionCount - 1 && questionCount >= 3) {
      rawRatios.push(Math.max(15, n3));
      levels.push("N3");
    } else {
      rawRatios.push(Math.max(20, n2));
      levels.push("N2");
    }
  }

  if (customBaremes && customBaremes.length > 0) {
    return Array.from({ length: questionCount }, (_, idx) => {
      const pt = customBaremes[idx] !== undefined ? customBaremes[idx] : 0.75;
      const lvl = levels[idx];
      return {
        points: Number(pt).toFixed(2).replace(/\.00$/, ".0").replace(/(\.\d)0$/, "$1"),
        level: lvl,
        levelLabelAr:
          lvl === "N1" ? "تطبيق مباشر (N1)" : lvl === "N2" ? "تعبئة وتوليف (N2)" : "تعمق وبحث (N3)",
        levelLabelFr:
          lvl === "N1"
            ? "Application (N1)"
            : lvl === "N2"
            ? "Mobilisation (N2)"
            : "Synthèse (N3)",
      };
    });
  }

  const ratioSum = rawRatios.reduce((a, b) => a + b, 0) || 1;
  const minStep = totalExPoints >= questionCount * 0.25 ? 0.25 : Number((totalExPoints / questionCount).toFixed(2));
  let allocated = 0;

  return rawRatios.map((r, idx) => {
    let pt: number;
    const remainingAfterCurrent = questionCount - 1 - idx;
    if (remainingAfterCurrent === 0) {
      pt = Math.max(
        minStep,
        minStep === 0.25
          ? Math.round((totalExPoints - allocated) * 4) / 4
          : Number((totalExPoints - allocated).toFixed(2))
      );
    } else {
      const rawPt = (totalExPoints * r) / ratioSum;
      pt =
        minStep === 0.25
          ? Math.max(0.25, Math.round(rawPt * 4) / 4)
          : Number(rawPt.toFixed(2));
      const maxAllowedForCurrent = Math.max(
        minStep,
        minStep === 0.25
          ? Math.round((totalExPoints - allocated - remainingAfterCurrent * minStep) * 4) / 4
          : Number((totalExPoints - allocated - remainingAfterCurrent * minStep).toFixed(2))
      );
      if (pt > maxAllowedForCurrent) {
        pt = maxAllowedForCurrent;
      }
      allocated = Number((allocated + pt).toFixed(2));
    }

    const lvl = levels[idx];
    return {
      points: pt.toFixed(2).replace(/\.00$/, ".0").replace(/(\.\d)0$/, "$1"),
      level: lvl,
      levelLabelAr:
        lvl === "N1" ? "تطبيق مباشر (N1)" : lvl === "N2" ? "تعبئة وتوليف (N2)" : "تعمق وبحث (N3)",
      levelLabelFr:
        lvl === "N1"
          ? "Application (N1)"
          : lvl === "N2"
          ? "Mobilisation (N2)"
          : "Synthèse (N3)",
    };
  });
}

export interface SerieExerciseBlock {
  badgeAr: string;
  badgeFr: string;
  stars: "★" | "★★" | "★★★";
  questionsAr: string[];
  questionsFr: string[];
  hintAr: string;
  hintFr: string;
  partPoints?: string;
  competenciesAr?: string[];
  competenciesFr?: string[];
}

export function getSerieAndDMExercises(
  lesson: LessonItem,
  subType: DMSubType,
  model: "A" | "B" = "A"
): SerieExerciseBlock[] {
  const { questionsAr, questionsFr } = getVariantQuestions(lesson, model, false);
  const cap0Ar = lesson.capacitiesAr[0] || lesson.lessonAr;
  const cap1Ar = lesson.capacitiesAr[1] || cap0Ar;
  const cap0Fr = lesson.capacitiesFr[0] || lesson.lessonFr;
  const cap1Fr = lesson.capacitiesFr[1] || cap0Fr;
  const subCat = lesson.subCategory || "تحليل";
  const titleFr = lesson.lessonFr.toLowerCase();
  const totalLessonPts = ((lesson.weight * 20) / 100).toFixed(1);
  const partAPts = (((lesson.weight * 20) / 100) * 0.25).toFixed(1);
  const partBPts = (((lesson.weight * 20) / 100) * 0.45).toFixed(1);
  const partCPts = (((lesson.weight * 20) / 100) * 0.30).toFixed(1);

  let synthesisQuestionsAr: string[] = [];
  let synthesisQuestionsFr: string[] = [];
  let synthesisHintAr = "";
  let synthesisHintFr = "";

  if (subCat === "هندسة فضائية" || titleFr.includes("espace")) {
    const param = model === "A" ? "m" : "k";
    synthesisQuestionsAr = [
      `1. نعتبر في الفضاء عائلة المستويات (P_${param}) المعرفة بالمعادلة: x + 2y + 2z - 3${param} = 0 حيث ${param} وسيط حقيقي. حدد قيم ${param} التي يكون من أجلها المستوى (P_${param}) مماساً للفلكة (S).`,
      `2. نفترض أن |${param}| < 2. بين أن تقاطع (S) و (P_${param}) هو دائرة (Γ_${param}) محدداً مركزها Ω_${param} وشعاعها r(${param}) بدلالة ${param}.`,
      `3. سؤال التعمق والبحث: حدد المحل الهندسي لمراكز الدوائر Ω_${param} عندما يتغير الوسيط ${param} في المجموعة R.`,
    ];
    synthesisQuestionsFr = [
      `1. On considère dans l'espace la famille de plans (P_${param}) d'équation : x + 2y + 2z - 3${param} = 0 (${param} ∈ ℝ). Déterminer les valeurs de ${param} pour lesquelles (P_${param}) est tangent à la sphère (S).`,
      `2. On suppose que (P_${param}) coupe (S) suivant un cercle (Γ_${param}). Déterminer les coordonnées du centre Ω_${param} et le rayon r(${param}) en fonction de ${param}.`,
      `3. Prise d'initiative : Quel est l'ensemble géométrique décrit par les centres Ω_${param} lorsque le paramètre ${param} décrit ℝ ?`,
    ];
    synthesisHintAr = "إرشاد للبحث: استعمل صيغة مسافة مركز الفلكة عن المستوى d(Ω, (P_m)) وقارنها مع الشعاع R.";
    synthesisHintFr = "Piste de recherche : Exprimer la distance d(Ω, (P_m)) en fonction du paramètre et la comparer au rayon R.";
  } else if (subCat === "أعداد عقدية" || titleFr.includes("complexe")) {
    const angle = model === "A" ? "π/3" : "π/4";
    synthesisQuestionsAr = [
      `1. نعتبر التحويل النقطي T في المستوى العقدي الذي يربط كل نقطة M(z) بالنقطة M'(z') بحيث: z' - i = e^{i${angle}}(z - i). حدد طبيعة التحويل T وعناصره المميزة.`,
      `2. لتكن (M_n) متتالية النقط المعرفة بـ M_0 = A و M_{n+1} = T(M_n) لكل n من N. عبر عن لحق النقطة z_n بدلالة n.`,
      `3. سؤال البحث والمبادرة: حدد أصغر عدد صحيح طبيعي n_0 غير منعدم بحيث تنطبق النقطة M_{n_0} مع النقطة M_0، ثم أحسب مجموع المسافات L_n = ∑_{k=0}^n M_k M_{k+1}.`,
    ];
    synthesisQuestionsFr = [
      `1. Soit T la transformation du plan complexe qui à tout point M(z) associe M'(z') tel que : z' - i = e^{i${angle}}(z - i). Reconnaître T et préciser ses éléments caractéristiques.`,
      `2. On définit la suite de points (M_n) par M_0 = A et M_{n+1} = T(M_n) pour tout n ∈ ℕ. Exprimer l'affixe z_n en fonction de n.`,
      `3. Question ouverte : Déterminer le plus petit entier n_0 ≥ 1 tel que M_{n_0} = M_0 et calculer la longueur de la ligne polygonale L_n = ∑_{k=0}^n M_k M_{k+1}.`,
    ];
    synthesisHintAr = "إرشاد منهجي: استثمر الكتابة العقدية للدوران وخواص القوى الأسية e^{inθ}.";
    synthesisHintFr = "Piste méthodologique : Exploiter l'écriture complexe d'une rotation et la périodicité de l'argument.";
  } else if (subCat === "احتمالات وإحصاء" || titleFr.includes("probabilit")) {
    synthesisQuestionsAr = [
      `1. نعيد تجربة السحب السابقة n مرة متتالية وبإحلال (اختبارات برنولي مستقلة). ليكن Y_n المتغير العشوائي الذي يساوي عدد المرات التي يتحقق فيها الحدث A.`,
      `2. حدد القانون الحداني للمتغير Y_n، ثم عبر عن الاحتمال p_n = P(Y_n ≥ 1) بدلالة n.`,
      `3. مسألة النمذجة واتخاذ القرار: ما هو أصغر عدد من التجارب n_0 يلزم إجراؤه ليكون احتمال تحقق الحدث A مرة واحدة على الأقل أكبر من أو يساوي 0.99 ؟`,
    ];
    synthesisQuestionsFr = [
      `1. On répète l'épreuve précédente n fois de manière indépendante (schéma de Bernoulli). Soit Y_n la variable aléatoire comptant le nombre de réalisations de l'événement A.`,
      `2. Préciser la loi binomiale suivie par Y_n et exprimer la probabilité p_n = P(Y_n ≥ 1) en fonction de n.`,
      `3. Modélisation & Prise de décision : Déterminer le nombre minimal d'épreuves n_0 pour que la probabilité p_n dépasse 0,99 (utiliser le logarithme népérien).`,
    ];
    synthesisHintAr = "إرشاد للبحث: مر إلى الحدث المضاد P(Y_n ≥ 1) = 1 - P(Y_n = 0) ثم استعمل دالة اللوغاريتم النبيري ln لحل المتراجحة.";
    synthesisHintFr = "Piste de recherche : Passer par l'événement contraire P(Y_n ≥ 1) = 1 - P(Y_n = 0) puis appliquer la fonction ln.";
  } else if (subCat === "جبر" || subCat === "حسابيات" || subCat === "منطق ومجموعات" || lesson.category === "Algebra") {
    const pVal = model === "A" ? "5" : "7";
    synthesisQuestionsAr = [
      `1. نعتبر في المجموعة N×N المعادلة الديوفانتية أو الجبرية (E) : x² - y² = 4n + ${pVal} حيث n عدد صحيح طبيعي معلوم.`,
      `2. بوضع u = x - y و v = x + y، بين أن u و v لهما نفس الزوجية، ثم استنتج شرطاً لازماً لوجود حلول في N.`,
      `3. سؤال البحث والبرهان: استنتج بواسطة الاستدلال بالخلف أو فصل الحالات مجموعة حلول المعادلة (E) وميز الحالات حسب زوجية n.`,
    ];
    synthesisQuestionsFr = [
      `1. On considère dans ℕ × ℕ l'équation algébrique (E) : x² - y² = 4n + ${pVal}, où n est un entier naturel fixé.`,
      `2. En posant u = x - y et v = x + y, démontrer que u et v ont la même parité et en déduire une condition nécessaire sur le second membre.`,
      `3. Synthèse & Raisonnement : Par un raisonnement par l'absurde ou par disjonction des cas, conclure sur l'existence de solutions entières.`,
    ];
    synthesisHintAr = "إرشاد للبحث: لاحظ أن جداء عددين لهما نفس الزوجية إما أن يكون فردياً أو مضاعفاً للعدد 4.";
    synthesisHintFr = "Piste de recherche : Remarquer que le produit de deux entiers de même parité est soit impair, soit multiple de 4.";
  } else {
    synthesisQuestionsAr = [
      `1. المسألة التوليفية (الربط بين الدالة والمتتالية): نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = ${model === "A" ? "1" : "2"} والعلاقة الترجعية u_{n+1} = f(u_n) لكل n من N حيث f هي الدالة المدروسة في الجزء الأول.`,
      `2. باستعمال رتابة الدالة f ومبيانها (C_f)، بين بالترجع أن المتتالية (u_n) محصورة ورتيبة على المجال المدروس.`,
      `3. استنتج أن المتتالية (u_n) متقاربة وحدد نهايتها الدقيقة L بحل المعادلة f(x) = x على المجال المحدد.`,
    ];
    synthesisQuestionsFr = [
      `1. Problème de synthèse (Suite récurrente associée à f) : Soit (u_n) la suite définie par u_0 = ${model === "A" ? "1" : "2"} et la relation u_{n+1} = f(u_n) pour tout n ∈ ℕ, où f désigne la fonction étudiée en Partie A.`,
      `2. En utilisant les variations de la fonction f et l'intervalle stable I, démontrer par récurrence que la suite (u_n) est bornée et monotone.`,
      `3. En déduire que la suite (u_n) converge et déterminer la valeur exacte de sa limite L comme point fixe vérifiant f(L) = L.`,
    ];
    synthesisHintAr = `إرشاد للبحث: ادرس إشارة g(x) = f(x) - x على المجال المستقر لتحديد رتابة المتتالية (u_n) ونقطة تقاطع (C_f) مع المستقيم (Δ): y = x.`;
    synthesisHintFr = `Piste de recherche : Étudier le signe de g(x) = f(x) - x sur l'intervalle stable I pour déterminer la monotonie de (u_n) et ses points fixes.`;
  }

  let olympiadQuestionsAr: string[] = [];
  let olympiadQuestionsFr: string[] = [];
  let olympiadHintAr = "";
  let olympiadHintFr = "";

  if (subCat === "هندسة فضائية" || titleFr.includes("espace")) {
    olympiadQuestionsAr = [
      `مسألة أولمبياد مفتوحة: ليكن (S) مجسماً كروياً في الفضاء و ABCD رباعي أوجه منتظم رؤوسه تنتمي إلى (S).`,
      `1. أثبت أن الارتفاعات الأربعة لرباعي الأوجه تتلاقى في نقطة وحيدة H هي مركز ثقله، وأحسب النسبة بين شعاع الفلكة المحيطة وشعاع الفلكة المماسة للأوجه.`,
      `2. تحدي المبادرة: حدد أصغر حجم لمتوازي مستطيلات يمكنه احتواء رباعي الأوجه ABCD بدقة.`,
    ];
    olympiadQuestionsFr = [
      `Problème ouvert & Olympiades : Soit (S) une sphère et ABCD un tétraèdre régulier inscrit dans (S).`,
      `1. Démontrer que les quatre hauteurs sont concourantes en un point unique H (centre de gravité) et déterminer le rapport des rayons des sphères circonscrite et inscrite.`,
      `2. Prise d'initiative : Déterminer le volume minimal d'un parallélépipède rectangle circonscrit à ABCD.`,
    ];
    olympiadHintAr = "تحدي أولمبياد: استعن بالتماثل الفضائي والجداء السلمي بين المتجهات الرأسية.";
    olympiadHintFr = "Piste Olympiades : Utiliser la symétrie centrale et le calcul vectoriel dans une base orthonormée.";
  } else if (subCat === "أعداد عقدية" || titleFr.includes("complexe")) {
    olympiadQuestionsAr = [
      `مسألة تحدي التميز: لكل عدد عقدي z يحقق |z| = 1، نعتبر المجموع S_n = ∑_{k=0}^{n-1} cos(2kπ/n).`,
      `1. برهن بالاستدلال العقدي أن النقط ذات الألحاق z_k = e^{i2kπ/n} تشكل مضلعاً منتظماً ذا n ضلعاً محيطه ثابت.`,
      `2. سؤال مفتوح: احسب الجداء P_n = ∏_{k=1}^{n-1} (1 - e^{i2kπ/n}) واستنتج قيمته الدقيقة بدلالة n.`,
    ];
    olympiadQuestionsFr = [
      `Défi d'Excellence & Olympiades : Pour tout z ∈ ℂ tel que |z| = 1, on considère la somme S_n = ∑_{k=0}^{n-1} cos(2kπ/n).`,
      `1. Établir géométriquement et algébriquement que les points z_k = e^{i2kπ/n} forment un polygone régulier à n côtés.`,
      `2. Question ouverte : Calculer le produit P_n = ∏_{k=1}^{n-1} (1 - e^{i2kπ/n}) et en déduire sa valeur exacte en fonction de n.`,
    ];
    olympiadHintAr = "تحدي أولمبياد: فكك الحدودية X^n - 1 في C واستعمل اشتقاق الصيغة عند 1.";
    olympiadHintFr = "Piste Olympiades : Factoriser le polynôme X^n - 1 dans ℂ[X] et évaluer sa dérivée en X = 1.";
  } else {
    olympiadQuestionsAr = [
      `مسألة التحدي والبحث المفتوح: نعتبر الدالة f المتصلة على [0, 1] والتي تحقق ∫_0^1 f(t) dt = 1/2.`,
      `1. برهن باستعمال مبرهنة القيم الوسيطية وجود عدد c من ]0, 1[ بحيث f(c) = c.`,
      `2. سؤال المبادرة: نفترض علاوة على ذلك أن f قابلة للاشتقاق وأن |f'(x)| ≤ 1 لكل x. حدد حصراً دقيقاً للقيمة القصوى لـ ∫_0^1 (f(t))² dt.`,
    ];
    olympiadQuestionsFr = [
      `Problème de Recherche & Olympiades : Soit f une fonction continue sur [0, 1] vérifiant ∫_0^1 f(t) dt = 1/2.`,
      `1. Démontrer par le théorème des valeurs intermédiaires qu'il existe c ∈ ]0, 1[ tel que f(c) = c.`,
      `2. Prise d'initiative : En supposant f dérivable avec |f'(x)| ≤ 1, déterminer un encadrement optimal de l'intégrale ∫_0^1 (f(t))² dt.`,
    ];
    olympiadHintAr = "تحدي أولمبياد: ادرس الدالة المساعدة g(x) = ∫_0^x f(t) dt - x²/2 وطبق مبرهنة رول.";
    olympiadHintFr = "Piste Olympiades : Introduire la fonction auxiliaire g(x) = ∫_0^x f(t) dt - x²/2 et appliquer le théorème de Rolle.";
  }

  if (subType === "DEVOIR_MAISON") {
    return [
      {
        badgeAr: `الجزء الأول (Partie A) — ضبط الأساسيات والأوتوماتيزمات (${partAPts} ن)`,
        badgeFr: `Partie A — Maîtrise des fondamentaux et automatismes (${partAPts} pts)`,
        stars: "★",
        partPoints: partAPts,
        questionsAr: questionsAr,
        questionsFr: questionsFr,
        hintAr: `إرشاد منهجي: استثمر خاصيات « ${cap0Ar} » وتأكد من شروط التطبيق قبل الاستنتاج.`,
        hintFr: `Indication méthodologique : Mobiliser les théorèmes sur « ${cap0Fr} » en vérifiant soigneusement les hypothèses.`,
        competenciesAr: [cap0Ar],
        competenciesFr: [cap0Fr],
      },
      {
        badgeAr: `الجزء الثاني (Partie B) — مسألة تحليلية واستدلالات مبرهنة (${partBPts} ن)`,
        badgeFr: `Partie B — Problème d'analyse et démonstrations articulées (${partBPts} pts)`,
        stars: "★★",
        partPoints: partBPts,
        questionsAr: synthesisQuestionsAr,
        questionsFr: synthesisQuestionsFr,
        hintAr: synthesisHintAr,
        hintFr: synthesisHintFr,
        competenciesAr: [cap1Ar, `الربط التوليفي والبرهان`],
        competenciesFr: [cap1Fr, `Synthèse et raisonnement`],
      },
      {
        badgeAr: `الجزء الثالث (Partie C) — مسألة النمذجة والبحث المفتوح وتحدي الأسبوع (${partCPts} ن)`,
        badgeFr: `Partie C — Modélisation, recherche approfondie et défi de la semaine (${partCPts} pts)`,
        stars: "★★★",
        partPoints: partCPts,
        questionsAr: olympiadQuestionsAr,
        questionsFr: olympiadQuestionsFr,
        hintAr: olympiadHintAr,
        hintFr: olympiadHintFr,
        competenciesAr: ["النمذجة الرياضية والبحث المفتوح", `المجموع الكلي: 20 ن`],
        competenciesFr: ["Modélisation et prise d'initiative", `Total épreuve : 20 pts`],
      },
    ];
  }

  // SERIE_TD : 4 graduated levels per lesson (★, ★★, ★★★, ★★★★)
  return [
    {
      badgeAr: "المستوى الأول (★) — تطبيق مباشر وتثبيت القواعد والمهارات",
      badgeFr: "Niveau 1 (★) — Application directe et automatismes du cours",
      stars: "★",
      questionsAr: [
        `1. تطبيق مباشر: أحسب وبسط التعابير الأساسية المرتبطة بـ « ${cap0Ar} » في الحالات الاعتيادية.`,
        questionsAr[0] || `2. تحقق من صحة المتساويات الأساسية لدرس ${lesson.lessonAr}.`,
        `3. احسب القيم العددية وقارن النتائج بالتحقق من شروط الوجود ومجموعات التعريف.`,
      ],
      questionsFr: [
        `1. Application directe : Calculer et simplifier les expressions liées à « ${cap0Fr} » dans les cas usuels.`,
        questionsFr[0] || `2. Vérifier les égalités fondamentales du chapitre ${lesson.lessonFr}.`,
        `3. Calculer les valeurs numériques et vérifier les domaines de validité.`,
      ],
      hintAr: `تذكير: راجع التعاريف والخاصيات المباشرة لـ ${lesson.lessonAr}.`,
      hintFr: `Rappel : Revoir les définitions et formules directes du cours sur ${lesson.lessonFr}.`,
      competenciesAr: [cap0Ar],
      competenciesFr: [cap0Fr],
    },
    {
      badgeAr: "المستوى الثاني (★★) — تعبئة الموارد وطرق الاستدلال والحل النموذجي (Type DS)",
      badgeFr: "Niveau 2 (★★) — Mobilisation des méthodes et résolution type examen",
      stars: "★★",
      questionsAr: questionsAr.slice(0, 3),
      questionsFr: questionsFr.slice(0, 3),
      hintAr: `منهجية: اربط بين معطيات السؤال وخاصية « ${cap1Ar} ».`,
      hintFr: `Méthode : Faire le lien entre les hypothèses de l'énoncé et la capacité « ${cap1Fr} ».`,
      competenciesAr: [cap1Ar],
      competenciesFr: [cap1Fr],
    },
    {
      badgeAr: "المستوى الثالث (★★★) — مسألة التوليف والتعمق المنهجي والتحضير للامتحان",
      badgeFr: "Niveau 3 (★★★) — Approfondissement, Synthèse & Problème articulé",
      stars: "★★★",
      questionsAr: synthesisQuestionsAr,
      questionsFr: synthesisQuestionsFr,
      hintAr: synthesisHintAr,
      hintFr: synthesisHintFr,
      competenciesAr: [cap0Ar, cap1Ar],
      competenciesFr: [cap0Fr, cap1Fr],
    },
    {
      badgeAr: "المستوى الرابع (★★★★) — مسألة التميز والأولمبياد والبحث المفتوح",
      badgeFr: "Niveau 4 (★★★★) — Défi d'excellence, problème ouvert & Olympiades",
      stars: "★★★",
      questionsAr: olympiadQuestionsAr,
      questionsFr: olympiadQuestionsFr,
      hintAr: olympiadHintAr,
      hintFr: olympiadHintFr,
      competenciesAr: ["التميز الرياضي والبحث المفتوح"],
      competenciesFr: ["Défi mathématique et recherche"],
    },
  ];
}

export interface ConfiguredSerieExercise {
  exerciseIndex: number;
  lesson: LessonItem;
  exerciseTitleAr: string;
  exerciseTitleFr: string;
  badgeAr: string;
  badgeFr: string;
  stars: "★" | "★★" | "★★★";
  questionsAr: string[];
  questionsFr: string[];
  hintAr: string;
  hintFr: string;
  competenciesAr: string[];
  competenciesFr: string[];
  blockIndex: number;
}

/**
 * يولد تمارين السلسلة البيداغوجية المتدرجة الصعوبة بالعدد المحدد بدقة من قِبل الأستاذ (serieExerciseCount)
 * مع تغطية شاملة لجميع الدروس المختارة ومستويات المهارات (تطبيق مباشر، استدلال، مسألة توليفية، أولمبياد)
 */
export function generateConfiguredSerieExercises(
  lessons: LessonItem[],
  targetCount: number = 5,
  model: "A" | "B" = "A"
): ConfiguredSerieExercise[] {
  if (!lessons || lessons.length === 0) return [];
  const count = Math.max(1, Math.min(20, targetCount));
  const result: ConfiguredSerieExercise[] = [];

  for (let i = 0; i < count; i++) {
    const lessonIdx = i % lessons.length;
    const lesson = lessons[lessonIdx];
    const blocks = getSerieAndDMExercises(lesson, "SERIE_TD", model);

    // تدرج صعوبة التمارين من البسيط للأكثر تعقيداً على امتداد السلسلة
    const ratio = count === 1 ? 0 : i / (count - 1);
    let blockIdx = 0;
    if (ratio < 0.28) {
      blockIdx = 0; // تطبيق مباشر وتثبيت القواعد (★)
    } else if (ratio < 0.6) {
      blockIdx = 1; // تعبئة المكتسبات وحساب المهارات النموذجية (★★)
    } else if (ratio < 0.85) {
      blockIdx = 2; // تعمق واستدلال ومسألة توليفية (★★★)
    } else {
      blockIdx = 3; // مسألة التميز والأولمبياد والبحث المفتوح (★★★)
    }

    const block = blocks[Math.min(blockIdx, blocks.length - 1)];
    const exNum = i + 1;
    const subTitleAr = block.badgeAr.includes("—") ? block.badgeAr.split("—")[1].trim() : block.badgeAr;
    const subTitleFr = block.badgeFr.includes("—") ? block.badgeFr.split("—")[1].trim() : block.badgeFr;

    result.push({
      exerciseIndex: exNum,
      lesson,
      exerciseTitleAr: `التمرين ${exNum} : ${lesson.lessonAr} (${subTitleAr})`,
      exerciseTitleFr: `Exercice ${exNum} : ${lesson.lessonFr} (${subTitleFr})`,
      badgeAr: block.badgeAr,
      badgeFr: block.badgeFr,
      stars: block.stars,
      questionsAr: block.questionsAr,
      questionsFr: block.questionsFr,
      hintAr: block.hintAr,
      hintFr: block.hintFr,
      competenciesAr: block.competenciesAr || [lesson.capacitiesAr[0] || lesson.lessonAr],
      competenciesFr: block.competenciesFr || [lesson.capacitiesFr[0] || lesson.lessonFr],
      blockIndex: blockIdx,
    });
  }

  return result;
}

export interface TrackData {
  code: string;
  cycle: CycleType;
  cycleAr: string;
  labelAr: string;
  labelFr: string;
  durationAr: string;
  durationFr: string;
  dsCount: number;
  prereqsAr: string[];
  prereqsFr: string[];
  system?: EducationSystem;
  semesters: {
    S1: Record<string, LessonItem[]>;
    S2: Record<string, LessonItem[]>;
  };
}

export const CURRICULUM_DB: Record<string, TrackData> = {
  // ==================== الجذوع المشتركة ====================
  TCS: {
    code: "TCS",
    cycle: "TC",
    cycleAr: "الجذوع المشتركة",
    labelAr: "الجذع المشترك العلمي (TC Scientifique)",
    labelFr: "Tronc Commun Scientifique (TCS - BIOF)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: [
      "الحساب العددي، القوى، والجذور المربعة (السنة الثالثة إعدادي)",
      "النشر والتعميل والمتطابقات الهامة والمعادلات والمتراجحات من الدرجة الأولى",
      "مبرهنتا طاليس وفيتاغورس والحساب المثلثي في المثلث القائم الزاوية",
      "المتجهات والإزاحة، المعلم في المستوى، ومعادلة مستقيم",
    ],
    prereqsFr: [
      "Calcul numérique, puissances et racines carrées (3ème année collège)",
      "Développement, factorisation, identités remarquables et équations du 1er degré",
      "Théorèmes de Thalès et de Pythagore, trigonométrie dans le triangle rectangle",
      "Vecteurs, translation, repère dans le plan et équation d'une droite",
    ],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "مبادئ في الحسابيات في المجموعة N",
            lessonFr: "Ensemble N et notions d'arithmétique",
            weight: 35,
            hours: "7h",
            category: "Algebra",
            subCategory: "حسابيات",
            subCategoryFr: "Arithmétique",
            tags: ["Algebra","جبر","حسابيات"],
            capacitiesAr: [
              "توظيف الزوجية وتفكيك عدد إلى جداء عوامل أولية في حل مسائل بسيطة",
              "تحديد المضاعف المشترك الأصغر (PPCM) والقاسم المشترك الأكبر (PGCD) لعددين طبيعيين",
            ],
            capacitiesFr: [
              "Utiliser la parité et la décomposition en produit de facteurs premiers",
              "Déterminer le PPCM et le PGCD de deux entiers naturels",
            ],
            sampleExerciseAr: [
              "ليكن n عدداً صحيحاً طبيعياً. أدرس زوجية العدد A = n² + 3n + 4.",
              "فكك العددين a = 540 و b = 378 إلى جداء عوامل أولية، ثم استنتج PGCD(a,b) و PPCM(a,b).",
              "حدد جميع القيم الممكنة للعدد الصحيح الطبيعي n بحيث يكون (n + 11) قاسماً للعدد (2n + 30).",
            ],
            sampleExerciseFr: [
              "Soit n ∈ ℕ. Étudier la parité de l'entier A = n² + 3n + 4.",
              "Décomposer a = 540 et b = 378 en produit de facteurs premiers, puis déduire PGCD(a,b) et PPCM(a,b).",
              "Déterminer tous les entiers naturels n tels que (n + 11) divise (2n + 30).",
            ],
          },
          {
            lessonAr: "الحساب المتجهي في المستوى",
            lessonFr: "Calcul vectoriel dans le plan",
            weight: 30,
            hours: "5h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: [
              "إنشاء متجهة من الشكل au + bv واستعمال علاقة شال",
              "التعبير متجهياً عن استقامية ثلاث نقط وتوازي مستقيمين ومنتصف قطعة",
            ],
            capacitiesFr: [
              "Construire un vecteur de la forme au + bv et utiliser la relation de Chasles",
              "Exprimer vectoriellement la colinéarité, l'alignement et le milieu d'un segment",
            ],
            sampleExerciseAr: [
              "ليكن ABC مثلثاً. أنشئ النقطتين M و N بحيث: AM = (3/2)AB و AN = 3AC - AB.",
              "بين باستعمال علاقة شال أن: MN = -(5/2)AB + 3AC، ثم استنتج استقامية النقط أو توازي المستقيمات.",
            ],
            sampleExerciseFr: [
              "Soit ABC un triangle. Construire les points M et N tels que : AM = (3/2)AB et AN = 3AC - AB.",
              "Montrer à l'aide de la relation de Chasles que MN = -(5/2)AB + 3AC et étudier la colinéarité.",
            ],
          },
          {
            lessonAr: "الإسقاط في المستوى",
            lessonFr: "La projection dans le plan",
            weight: 35,
            hours: "5h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: [
              "ترجمة خاصية الحفاظ على معامل الاستقامية متجهياً",
              "توظيف مبرهنة طاليس المباشرة والعكسية بتعبير الإسقاط",
            ],
            capacitiesFr: [
              "Traduire vectoriellement la conservation du coefficient de colinéarité",
              "Appliquer le théorème de Thalès direct et réciproque avec la projection",
            ],
          },
        ],
        DS2: [
          {
            lessonAr: "المجموعات N و Z و D و Q و R",
            lessonFr: "Les ensembles de nombres N, Z, D, Q et R",
            weight: 30,
            hours: "6h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: [
              "التمييز بين مجموعات الأعداد وإتقان الحساب الجبري (القوى، الجذور، المتطابقات الهامة التكعيبية)",
            ],
            capacitiesFr: [
              "Reconnaître les ensembles de nombres et maîtriser le calcul algébrique (puissances, radicaux, identités de degré 3)",
            ],
          },
          {
            lessonAr: "الترتيب في المجموعة R",
            lessonFr: "L'ordre dans R",
            weight: 40,
            hours: "9h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: [
              "مقارنة عددين حقيقيين وتأطير تعبير جبري",
              "استعمال القيمة المطلقة والمجالات والتقريبات العشرية",
            ],
            capacitiesFr: [
              "Comparer deux réels et encadrer une expression algébrique",
              "Utiliser la valeur absolue, les intervalles et les approximations décimales",
            ],
          },
          {
            lessonAr: "المستقيم في المستوى",
            lessonFr: "La droite dans le plan",
            weight: 30,
            hours: "7h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: [
              "تحديد معادلة ديكارتية وتمثيل بارامتري لمستقيم ودراسة الوضع النسبي لمستقيمين",
            ],
            capacitiesFr: [
              "Déterminer une équation cartésienne et une représentation paramétrique d'une droite",
            ],
          },
        ],
        DS3: [
          {
            lessonAr: "الحدوديات",
            lessonFr: "Les polynômes",
            weight: 30,
            hours: "4h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: [
              "إنجاز القسمة الإقليدية لحدودية P(x) على x - a وتعميلها علماً بجذر لها",
            ],
            capacitiesFr: [
              "Effectuer la division euclidienne d'un polynôme P(x) par (x - a) et le factoriser",
            ],
          },
          {
            lessonAr: "المعادلات والمتراجحات والنظمات",
            lessonFr: "Équations, inéquations et systèmes",
            weight: 45,
            hours: "10h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: [
              "حل معادلات ومتراجحات من الدرجة الثانية بمجهول واحد باستعمال المميز Δ",
              "حل نظمات معادلتين من الدرجة الأولى بمجهولين بطريقة كرامر (المحددة)",
            ],
            capacitiesFr: [
              "Résoudre des équations et inéquations du second degré à l'aide du discriminant Δ",
              "Résoudre des systèmes linéaires par la méthode de Cramer (déterminant)",
            ],
          },
          {
            lessonAr: "الإحصاء",
            lessonFr: "Statistiques",
            weight: 25,
            hours: "5h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: [
              "حساب وتأويل وسائط الوضع (المعدل، القيمة الوسطية، المنوال) ووسائط التشتت",
            ],
            capacitiesFr: [
              "Calculer et interpréter les paramètres de position et de dispersion",
            ],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الحساب المثلثي 1 و 2",
            lessonFr: "Calcul trigonométrique 1 et 2",
            weight: 55,
            hours: "14h",
            category: "Geometry",
            subCategory: "حساب مثلثي",
            subCategoryFr: "Trigonométrie",
            tags: ["Geometry","حساب مثلثي"],
            capacitiesAr: [
              "استعمال الدائرة المثلثية وحل المعادلات والمتراجحات المثلثية الأساسية",
              "توظيف مبرهنة الكاشي وقانون الجيوب في المثلث",
            ],
            capacitiesFr: [
              "Résoudre des équations et inéquations trigonométriques fondamentales",
              "Appliquer le théorème d'Al-Kashi et la loi des sinus dans un triangle",
            ],
          },
          {
            lessonAr: "عموميات حول الدوال العددية (الشطر 1)",
            lessonFr: "Généralités sur les fonctions numériques (Partie 1)",
            weight: 45,
            hours: "8h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: [
              "تحديد مجموعة التعريف، الزوجية، الرتابة بمعدل التغير، والمطاريف",
            ],
            capacitiesFr: [
              "Déterminer le domaine de définition, la parité, la monotonie et les extremums",
            ],
          },
        ],
        DS2: [
          {
            lessonAr: "دراسة الدوال المرجعية (الشطر 2)",
            lessonFr: "Étude des fonctions de référence (Partie 2)",
            weight: 50,
            hours: "8h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: [
              "دراسة وتمثيل الشلجم ax²+bx+c والهذلول (ax+b)/(cx+d) ودالة الجذر المربع",
            ],
            capacitiesFr: [
              "Étudier et représenter les fonctions trinôme (parabole), homographique (hyperbole) et racine carrée",
            ],
          },
          {
            lessonAr: "التحويلات الاعتيادية في المستوى",
            lessonFr: "Transformations usuelles dans le plan",
            weight: 50,
            hours: "6h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: [
              "توظيف التماثل المحوري والمركزي والإزاحة والتحاكي في إثبات خاصيات هندسية",
            ],
            capacitiesFr: [
              "Utiliser les symétries, la translation et l'homothétie dans des problèmes géométriques",
            ],
          },
        ],
        DS3: [
          {
            lessonAr: "الجداء السلمي في المستوى",
            lessonFr: "Produit scalaire dans le plan",
            weight: 50,
            hours: "6h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: [
              "حساب الجداء السلمي وتوظيفه في التعامد وحساب المسافات والزوايا ومبرهنة المتوسط",
            ],
            capacitiesFr: [
              "Calculer le produit scalaire et l'utiliser pour l'orthogonalité, les distances et le théorème de la médiane",
            ],
          },
          {
            lessonAr: "الهندسة الفضائية",
            lessonFr: "Géométrie dans l'espace",
            weight: 50,
            hours: "8h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية"],
            capacitiesAr: [
              "دراسة الأوضاع النسبية وتطبيق مبرهنات التوازي والتعامد في الفضاء",
            ],
            capacitiesFr: [
              "Étudier les positions relatives et appliquer les théorèmes de parallélisme et d'orthogonalité dans l'espace",
            ],
          },
        ],
      },
    },
  },

  TCT: {
    code: "TCT",
    cycle: "TC",
    cycleAr: "الجذوع المشتركة",
    labelAr: "الجذع المشترك التكنولوجي والمهني (TC Technologique & Pro)",
    labelFr: "Tronc Commun Technologique et Professionnel (TCT)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["الحساب الجبري، المعادلات، المثلثات، المتجهات، والدوال التآلفية"],
    prereqsFr: ["Calcul algébrique, équations, trigonométrie, vecteurs et fonctions affines"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الحسابيات في N والحساب المتجهي والإسقاط",
            lessonFr: "Arithmétique dans N, Calcul vectoriel et Projection",
            weight: 100,
            hours: "17h",
            category: "Algebra",
            subCategory: "حسابيات",
            subCategoryFr: "Arithmétique",
            tags: ["Geometry","هندسة مستوية","Algebra","جبر","حسابيات"],
            capacitiesAr: ["توظيف PGCD و PPCM وعلاقة شال ومبرهنة طاليس بالإسقاط"],
            capacitiesFr: ["Utiliser PGCD/PPCM, la relation de Chasles et le théorème de Thalès par projection"],
          },
        ],
        DS2: [
          {
            lessonAr: "المجموعات والترتيب في R والمستقيم في المستوى",
            lessonFr: "Ensembles, Ordre dans R et Droite dans le plan",
            weight: 100,
            hours: "22h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية","Algebra","جبر"],
            capacitiesAr: ["التأطير والقيمة المطلقة والمعادلة الديكارتية لمستقيم"],
            capacitiesFr: ["Encadrement, valeur absolue et équation cartésienne d'une droite"],
          },
        ],
        DS3: [
          {
            lessonAr: "الحدوديات والمعادلات والنظمات والإحصاء",
            lessonFr: "Polynômes, Équations, Systèmes et Statistiques",
            weight: 100,
            hours: "19h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء","Algebra","جبر"],
            capacitiesAr: ["القسمة الإقليدية، معادلات الدرجة الثانية، نظمات كرامر، والإحصاء"],
            capacitiesFr: ["Division euclidienne, second degré, systèmes de Cramer et statistiques"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الحساب المثلثي وعموميات حول الدوال",
            lessonFr: "Calcul trigonométrique et Généralités sur les fonctions",
            weight: 100,
            hours: "22h",
            category: "Geometry",
            subCategory: "حساب مثلثي",
            subCategoryFr: "Trigonométrie",
            tags: ["Geometry","حساب مثلثي","Calculus","تحليل"],
            capacitiesAr: ["المعادلات المثلثية ودراسة تغيرات دالة عددية"],
            capacitiesFr: ["Équations trigonométriques et étude des variations d'une fonction"],
          },
        ],
        DS2: [
          {
            lessonAr: "الدوال المرجعية والتحويلات الاعتيادية",
            lessonFr: "Fonctions de référence et Transformations du plan",
            weight: 100,
            hours: "14h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية","Calculus","تحليل"],
            capacitiesAr: ["الشلجم والهذلول والإزاحة والتحاكي"],
            capacitiesFr: ["Parabole, hyperbole, translation et homothétie"],
          },
        ],
        DS3: [
          {
            lessonAr: "الجداء السلمي والهندسة الفضائية",
            lessonFr: "Produit scalaire et Géométrie dans l'espace",
            weight: 100,
            hours: "14h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","هندسة مستوية"],
            capacitiesAr: ["الجداء السلمي والتعامد والتوازي في الفضاء"],
            capacitiesFr: ["Produit scalaire, parallélisme et orthogonalité dans l'espace"],
          },
        ],
      },
    },
  },

  TCLSH: {
    code: "TCLSH",
    cycle: "TC",
    cycleAr: "الجذوع المشتركة",
    labelAr: "الجذع المشترك للآداب والعلوم الإنسانية والتعليم الأصيل",
    labelFr: "Tronc Commun Lettres, Sc. Humaines et Enseignement Originel",
    durationAr: "ساعة واحدة (1h)",
    durationFr: "1 heure",
    dsCount: 2,
    prereqsAr: ["العمليات الحسابية، النسب المئوية، المعادلات من الدرجة الأولى، والمعلم في المستوى"],
    prereqsFr: ["Opérations numériques, pourcentages, équations du 1er degré et repère dans le plan"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الحساب العددي والنسب المئوية والمعادلات والمتراجحات",
            lessonFr: "Calcul numérique, pourcentages, équations et inéquations",
            weight: 100,
            hours: "16h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: ["توظيف النسب المئوية وحل معادلات ومتراجحات من الدرجة 1 و 2 ونظمات"],
            capacitiesFr: ["Appliquer les pourcentages et résoudre des équations/inéquations du 1er et 2nd degré"],
          },
        ],
        DS2: [
          {
            lessonAr: "الإحصاء",
            lessonFr: "Statistiques",
            weight: 100,
            hours: "8h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["تنظيم المعطيات الإحصائية وحساب المعدل الحسابي والقيمة الوسطية والمنوال"],
            capacitiesFr: ["Organiser une série statistique et calculer moyenne, médiane et mode"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "المعلم في المستوى ومعادلة مستقيم",
            lessonFr: "Repère dans le plan et équation d'une droite",
            weight: 100,
            hours: "10h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry", "هندسة مستوية"],
            capacitiesAr: ["تحديد معادلة مختصرة لمستقيم ودراسة تقاطع وتوازي مستقيمين"],
            capacitiesFr: ["Déterminer l'équation réduite d'une droite et étudier l'intersection de deux droites"],
          },
        ],
        DS2: [
          {
            lessonAr: "الدوال العددية الاعتيادية",
            lessonFr: "Fonctions numériques usuelles",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["دراسة وتمثيل الدالة التآلفية والدالة ax² والدالة a/x"],
            capacitiesFr: ["Étudier et représenter les fonctions affines, x ↦ ax² et x ↦ a/x"],
          },
        ],
      },
    },
  },

  // ==================== سلك الأولى بكالوريا ====================
  "1BAC_SM": {
    code: "1BAC_SM",
    cycle: "1BAC",
    cycleAr: "الأولى بكالوريا",
    labelAr: "الأولى بكالوريا - شعبة العلوم الرياضية (أ وب)",
    labelFr: "1ère Bac Sciences Mathématiques (A et B)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 4,
    prereqsAr: ["الحسابيات في N، المجموعات، الترتيب في R، الدوال العددية، المتجهات، والحساب المثلثي"],
    prereqsFr: ["Arithmétique dans N, ensembles, ordre dans R, fonctions, vecteurs et trigonométrie"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "مبادئ في المنطق",
            lessonFr: "Notions de logique",
            weight: 45,
            hours: "10h",
            category: "Algebra",
            subCategory: "منطق ومجموعات",
            subCategoryFr: "Logique & Ensembles",
            tags: ["Algebra","جبر","منطق ومجموعات"],
            capacitiesAr: ["المكممات ونفيها، البرهان بالمضاد للعكس، الخلف، فصل الحالات، التكافؤات، والترجع"],
            capacitiesFr: ["Quantificateurs, négation, contraposée, absurde, disjonction des cas et récurrence"],
          },
          {
            lessonAr: "المجموعات والتطبيقات",
            lessonFr: "Ensembles et applications",
            weight: 55,
            hours: "12h",
            category: "Algebra",
            subCategory: "منطق ومجموعات",
            subCategoryFr: "Logique & Ensembles",
            tags: ["Algebra","جبر","منطق ومجموعات"],
            capacitiesAr: ["العمليات على المجموعات، التباينية، الشمولية، التقابلية، والصورة المباشرة والعكسية"],
            capacitiesFr: ["Opérations sur les ensembles, injectivité, surjectivité, bijectivité, image directe et réciproque"],
          },
        ],
        DS2: [
          {
            lessonAr: "عموميات حول الدوال العددية",
            lessonFr: "Généralités sur les fonctions numériques",
            weight: 60,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["دالة الجزء الصحيح E(x)، الدوال الدورية والمحدودة، ورتابة مركب دالتين"],
            capacitiesFr: ["Fonction partie entière E(x), périodicité, bornage et monotonie de la composée gof"],
          },
          {
            lessonAr: "المرجح في المستوى",
            lessonFr: "Le barycentre dans le plan",
            weight: 40,
            hours: "8h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["خاصية التجميعية وتحديد المحال الهندسية واستقامية النقط وتلاقي المستقيمات"],
            capacitiesFr: ["Associativité du barycentre, alignement, concours de droites et lieux géométriques"],
          },
        ],
        DS3: [
          {
            lessonAr: "الجداء السلمي في المستوى وتطبيقاته",
            lessonFr: "Produit scalaire dans le plan et applications",
            weight: 50,
            hours: "10h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["الصيغة التحليلية، مسافة نقطة عن مستقيم، معادلة دائرة ومماساتها، ومجموعات النقط"],
            capacitiesFr: ["Expression analytique, distance point-droite, cercle, tangentes et lignes de niveau"],
          },
          {
            lessonAr: "الحساب المثلثي",
            lessonFr: "Calcul trigonométrique",
            weight: 50,
            hours: "10h",
            category: "Geometry",
            subCategory: "حساب مثلثي",
            subCategoryFr: "Trigonométrie",
            tags: ["Geometry","حساب مثلثي"],
            capacitiesAr: ["صيغ التحويل المثلثي وحل المعادلات والمتراجحات المثلثية المتقدمة"],
            capacitiesFr: ["Formules d'addition, de duplication, transformation somme-produit et équations"],
          },
        ],
        DS4: [
          {
            lessonAr: "المتتاليات العددية",
            lessonFr: "Les suites numériques",
            weight: 60,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["المتتاليات الحسابية والهندسية والترجعية وحساب المجاميع Σ والجداءات Π"],
            capacitiesFr: ["Suites arithmétiques, géométriques, récurrentes, sommes Σ et produits Π"],
          },
          {
            lessonAr: "نهاية دالة عددية",
            lessonFr: "Limite d'une fonction numérique",
            weight: 40,
            hours: "10h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["التعريف المكمم للنهاية وحساب النهايات الجبرية واللا جذرية والمثلثية ومبرهنات المقارنة"],
            capacitiesFr: ["Définition quantifiée de la limite, limites trigonométriques et théorèmes de comparaison"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الدوران في المستوى",
            lessonFr: "La rotation dans le plan",
            weight: 35,
            hours: "8h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["خاصيات الدوران وتركيب الدورانات في البراهين الهندسية"],
            capacitiesFr: ["Propriétés de la rotation et composée de rotations"],
          },
          {
            lessonAr: "الاشتقاق",
            lessonFr: "La dérivation",
            weight: 65,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["قابلية الاشتقاق، المماس، المشتقات المتتالية، صيغة لايبنتز، والمعادلة y''+ω²y=0"],
            capacitiesFr: ["Dérivabilité, tangente, dérivées successives, formule de Leibniz et y''+ω²y=0"],
          },
        ],
        DS2: [
          {
            lessonAr: "دراسة الدوال وتمثيلها المبياني",
            lessonFr: "Étude et représentation graphique des fonctions",
            weight: 55,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الفروع اللانهائية، التقعر، الانعطاف، والدراسة الكاملة للدوال العددية والمثلثية"],
            capacitiesFr: ["Branches infinies, concavité, inflexion et étude complète de fonctions"],
          },
          {
            lessonAr: "التعداد",
            lessonFr: "Le dénombrement",
            weight: 45,
            hours: "10h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الترتيبات، التبديلات، التأليفات، علاقة باسكال، وصيغة حدانية نيوتن"],
            capacitiesFr: ["Arrangements, permutations, combinaisons, triangle de Pascal et binôme de Newton"],
          },
        ],
        DS3: [
          {
            lessonAr: "الحسابيات في المجموعة Z",
            lessonFr: "Arithmétique dans Z",
            weight: 60,
            hours: "14h",
            category: "Algebra",
            subCategory: "حسابيات",
            subCategoryFr: "Arithmétique",
            tags: ["Algebra","جبر","حسابيات"],
            capacitiesAr: ["القسمة الإقليدية في Z، الموافقات بترديد n، PGCD و PPCM والأعداد الأولية"],
            capacitiesFr: ["Division euclidienne dans Z, congruences modulo n, PGCD, PPCM et nombres premiers"],
          },
          {
            lessonAr: "متجهات الفضاء وتحليلية الفضاء",
            lessonFr: "Géométrie analytique dans l'espace",
            weight: 40,
            hours: "10h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","هندسة مستوية"],
            capacitiesAr: ["التمثيلات البارامترية والمعادلات الديكارتية للمستقيمات والمستويات في الفضاء"],
            capacitiesFr: ["Représentations paramétriques et équations cartésiennes de droites et plans"],
          },
        ],
        DS4: [
          {
            lessonAr: "الجداء السلمي والجداء المتجهي في الفضاء",
            lessonFr: "Produit scalaire et produit vectoriel dans l'espace",
            weight: 100,
            hours: "14h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","هندسة مستوية"],
            capacitiesAr: ["الجداء السلمي والمتجهي u ∧ v، المسافات، ودراسة الفلكة ومستوياتها المماسة"],
            capacitiesFr: ["Produit scalaire, produit vectoriel u ∧ v, distances et étude analytique de la sphère"],
          },
        ],
      },
    },
  },

  "1BAC_SE": {
    code: "1BAC_SE",
    cycle: "1BAC",
    cycleAr: "الأولى بكالوريا",
    labelAr: "الأولى بكالوريا - شعبة العلوم التجريبية",
    labelFr: "1ère Bac Sciences Expérimentales (BIOF)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["الترتيب في R، المعادلات من الدرجة 2، الدوال المرجعية، الحساب المتجهي، والحساب المثلثي"],
    prereqsFr: ["Ordre dans R, second degré, fonctions de référence, calcul vectoriel et trigonométrie"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "مبادئ في المنطق",
            lessonFr: "Notions de logique",
            weight: 35,
            hours: "8h",
            category: "Algebra",
            subCategory: "منطق ومجموعات",
            subCategoryFr: "Logique & Ensembles",
            tags: ["Algebra","جبر","منطق ومجموعات"],
            capacitiesAr: ["المكممات ونفيها، الاستدلال بالمضاد للعكس، الخلف، فصل الحالات، والترجع"],
            capacitiesFr: ["Quantificateurs, négation, contraposée, absurde, disjonction des cas et récurrence"],
          },
          {
            lessonAr: "عموميات حول الدوال العددية",
            lessonFr: "Généralités sur les fonctions numériques",
            weight: 65,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الدوال المكبورة والمصغورة، المطاريف، ومقارنة دالتين، ورتابة مركب دالتين"],
            capacitiesFr: ["Fonctions bornées, extremums, comparaison graphique et monotonie de gof"],
          },
        ],
        DS2: [
          {
            lessonAr: "المرجح في المستوى",
            lessonFr: "Le barycentre dans le plan",
            weight: 35,
            hours: "6h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["إنشاء المرجح وخاصية التجميعية واستقامية النقط ومجموعات النقط"],
            capacitiesFr: ["Construction du barycentre, associativité, alignement et lieux géométriques"],
          },
          {
            lessonAr: "الجداء السلمي وتطبيقاته التحليلية",
            lessonFr: "Étude analytique du produit scalaire",
            weight: 65,
            hours: "10h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["الصيغة التحليلية، مسافة نقطة عن مستقيم، معادلة الدائرة والوضع النسبي مع مستقيم والمماس"],
            capacitiesFr: ["Expression analytique, distance point-droite, équation d'un cercle et tangente"],
          },
        ],
        DS3: [
          {
            lessonAr: "المتتاليات العددية",
            lessonFr: "Les suites numériques",
            weight: 50,
            hours: "10h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["الرتابة، المحدودية، المتتاليات الحسابية والهندسية ومجموع حدود متتابعة"],
            capacitiesFr: ["Monotonie, suites arithmétiques et géométriques, terme général et somme"],
          },
          {
            lessonAr: "الحساب المثلثي",
            lessonFr: "Calcul trigonométrique",
            weight: 50,
            hours: "8h",
            category: "Geometry",
            subCategory: "حساب مثلثي",
            subCategoryFr: "Trigonométrie",
            tags: ["Geometry","حساب مثلثي"],
            capacitiesAr: ["صيغ التحويل المثلثي وحل معادلات من الشكل a cos x + b sin x = c"],
            capacitiesFr: ["Formules de transformation et résolution de a cos x + b sin x = c"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "نهاية دالة عددية",
            lessonFr: "Limite d'une fonction numérique",
            weight: 45,
            hours: "10h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["نهايات الدوال الحدودية والجذرية واللا جذرية والمثلثية ومبرهنات المقارنة"],
            capacitiesFr: ["Limites des fonctions usuelles et trigonométriques, théorèmes de comparaison"],
          },
          {
            lessonAr: "الدوران في المستوى",
            lessonFr: "La rotation dans le plan",
            weight: 25,
            hours: "6h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["إنشاء صور الأشكال بدوران وتوظيف خاصيات الحفاظ على المسافة والزوايا"],
            capacitiesFr: ["Images des figures par une rotation et propriétés de conservation"],
          },
          {
            lessonAr: "الاشتقاق (الشطر 1)",
            lessonFr: "La dérivation (Partie 1)",
            weight: 30,
            hours: "6h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["قابلية الاشتقاق في نقطة، معادلة المماس، وحساب الدوال المشتقة"],
            capacitiesFr: ["Dérivabilité en un point, tangente et calcul des fonctions dérivées"],
          },
        ],
        DS2: [
          {
            lessonAr: "الاشتقاق ودراسة الدوال وتمثيلها المبياني",
            lessonFr: "Dérivation, étude et représentation des fonctions",
            weight: 100,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الرتابة والمطاريف، التقعر ونقط الانعطاف، الفروع اللانهائية، وإنشاء المنحنى المبياني"],
            capacitiesFr: ["Monotonie, extremums, concavité, branches infinies et tracé de (Cf)"],
          },
        ],
        DS3: [
          {
            lessonAr: "متجهات الفضاء وتحليلية الفضاء",
            lessonFr: "Vecteurs de l'espace et géométrie analytique",
            weight: 100,
            hours: "14h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","هندسة مستوية"],
            capacitiesAr: ["استوائية ثلاث متجهات، التمثيل البارامتري لمستقيم، والمعادلة الديكارتية لمستوى"],
            capacitiesFr: ["Coplanarité, représentation paramétrique d'une droite et équation cartésienne d'un plan"],
          },
        ],
      },
    },
  },

  "1BAC_STE_STM": {
    code: "1BAC_STE_STM",
    cycle: "1BAC",
    cycleAr: "الأولى بكالوريا",
    labelAr: "الأولى بكالوريا - العلوم والتكنولوجيات الكهربائية والميكانيكية (STE / STM)",
    labelFr: "1ère Bac Sciences et Technologies Électriques et Mécaniques",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["الحساب الجبري، المثلثي، المتجهي، والدوال العددية"],
    prereqsFr: ["Calcul algébrique, trigonométrique, vectoriel et fonctions numériques"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "مبادئ في المنطق وعموميات حول الدوال",
            lessonFr: "Notions de logique et Généralités sur les fonctions",
            weight: 100,
            hours: "20h",
            category: "Algebra",
            subCategory: "منطق ومجموعات",
            subCategoryFr: "Logique & Ensembles",
            tags: ["Algebra","جبر","منطق ومجموعات","Calculus","تحليل"],
            capacitiesAr: ["الاستدلالات المنطقية ودراسة تغيرات ومطاريف ومركب الدوال"],
            capacitiesFr: ["Raisonnements logiques, variations, extremums et composée de fonctions"],
          },
        ],
        DS2: [
          {
            lessonAr: "المرجح والجداء السلمي وتطبيقاته في المستوى",
            lessonFr: "Barycentre et Produit scalaire dans le plan",
            weight: 100,
            hours: "16h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["المرجح، الصيغة التحليلية للجداء السلمي، والدائرة"],
            capacitiesFr: ["Barycentre, produit scalaire analytique et équation d'un cercle"],
          },
        ],
        DS3: [
          {
            lessonAr: "المتتاليات العددية والحساب المثلثي",
            lessonFr: "Suites numériques et Calcul trigonométrique",
            weight: 100,
            hours: "18h",
            category: "Geometry",
            subCategory: "حساب مثلثي",
            subCategoryFr: "Trigonométrie",
            tags: ["Geometry","حساب مثلثي","Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["المتتاليات الحسابية والهندسية وصيغ التحويل والمعادلات المثلثية"],
            capacitiesFr: ["Suites arithmétiques et géométriques, formules de transformation trigonométrique"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "النهايات والدوران والاشتقاق (ج 1)",
            lessonFr: "Limites, Rotation et Dérivation (P1)",
            weight: 100,
            hours: "22h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية","Calculus","تحليل"],
            capacitiesAr: ["حساب النهايات، خاصيات الدوران، وقابلية الاشتقاق والدوال المشتقة"],
            capacitiesFr: ["Calcul de limites, rotation et dérivabilité"],
          },
        ],
        DS2: [
          {
            lessonAr: "دراسة الدوال وتمثيلها المبياني",
            lessonFr: "Étude et représentation des fonctions",
            weight: 100,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الفروع اللانهائية، التقعر، وإنشاء المنحنيات المبيانية"],
            capacitiesFr: ["Branches infinies, concavité et construction graphique"],
          },
        ],
        DS3: [
          {
            lessonAr: "الهندسة الفضائية وتحليلية الفضاء",
            lessonFr: "Géométrie analytique dans l'espace",
            weight: 100,
            hours: "14h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","هندسة مستوية"],
            capacitiesAr: ["المستقيمات والمستويات في الفضاء التحليلي"],
            capacitiesFr: ["Droites et plans dans l'espace rapporté à un repère"],
          },
        ],
      },
    },
  },

  "1BAC_ECO": {
    code: "1BAC_ECO",
    cycle: "1BAC",
    cycleAr: "الأولى بكالوريا",
    labelAr: "الأولى بكالوريا - شعبة علوم الاقتصاد والتدبير (SEG)",
    labelFr: "1ère Bac Sciences Économiques et Gestion (SEG)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["الحساب العددي، النسب المئوية، المعادلات والنظمات، والدوال المرجعية"],
    prereqsFr: ["Calcul numérique, pourcentages, équations, systèmes et fonctions de référence"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "مبادئ في المنطق",
            lessonFr: "Notions de logique",
            weight: 45,
            hours: "8h",
            category: "Algebra",
            subCategory: "منطق ومجموعات",
            subCategoryFr: "Logique & Ensembles",
            tags: ["Algebra","جبر","منطق ومجموعات"],
            capacitiesAr: ["العبارات، المكممات، والاستدلالات المنطقية"],
            capacitiesFr: ["Propositions, quantificateurs et raisonnements logiques"],
          },
          {
            lessonAr: "المعادلات والمتراجحات والنظمات والبرمجة الخطية",
            lessonFr: "Équations, inéquations, systèmes et programmation linéaire",
            weight: 55,
            hours: "10h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: ["حل النظمات مبيانياً وجبرياً وحل مسائل الاستمثال الاقتصادي"],
            capacitiesFr: ["Systèmes d'inéquations et optimisation par programmation linéaire"],
          },
        ],
        DS2: [
          {
            lessonAr: "عموميات حول الدوال العددية",
            lessonFr: "Généralités sur les fonctions numériques",
            weight: 100,
            hours: "10h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["مجموعة التعريف، الرتابة، المطاريف، وتأويلها الاقتصادي"],
            capacitiesFr: ["Domaine, monotonie, extremums et interprétation économique"],
          },
        ],
        DS3: [
          {
            lessonAr: "المتتاليات العددية وتطبيقاتها المالية",
            lessonFr: "Suites numériques et applications financières",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["المتتاليات الحسابية والهندسية والفائدة البسيطة والمركبة"],
            capacitiesFr: ["Suites arithmétiques et géométriques, intérêts simples et composés"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "التعداد والمصفوفات",
            lessonFr: "Dénombrement et Matrices",
            weight: 100,
            hours: "18h",
            category: "Algebra",
            subCategory: "مصفوفات ورسوم بيانية",
            subCategoryFr: "Matrices & Graphes",
            tags: ["Algebra","جبر","مصفوفات ورسوم بيانية","Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الترتيبات والتأليفات، العمليات على المصفوفات وحل النظمات مصفوفياً"],
            capacitiesFr: ["Arrangements, combinaisons, calcul matriciel et résolution de systèmes"],
          },
        ],
        DS2: [
          {
            lessonAr: "نهاية دالة عددية والاشتقاق",
            lessonFr: "Limites et dérivation",
            weight: 100,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["حساب النهايات والمقاربات والدوال المشتقة والكلفة الهامشية"],
            capacitiesFr: ["Calcul de limites, asymptotes et dérivées"],
          },
        ],
        DS3: [
          {
            lessonAr: "دراسة الدوال وتمثيلها المبياني",
            lessonFr: "Étude et représentation des fonctions",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["دراسة وتمثيل الدوال الحدودية والجذرية"],
            capacitiesFr: ["Étude complète de fonctions polynômes et rationnelles"],
          },
        ],
      },
    },
  },

  "1BAC_LSH": {
    code: "1BAC_LSH",
    cycle: "1BAC",
    cycleAr: "الأولى بكالوريا",
    labelAr: "الأولى بكالوريا - شعبة الآداب والعلوم الإنسانية (1Bac SH / 1Bac LSH)",
    labelFr: "1ère Bac Lettres et Sciences Humaines (1Bac SH / 1Bac LSH)",
    durationAr: "ساعة واحدة (1h)",
    durationFr: "1 heure",
    dsCount: 2,
    prereqsAr: [
      "الحساب العددي، النسب المئوية والتناسبية، ومسائل الزيادة والتخفيض",
      "المعادلات والمتراجحات من الدرجة الأولى والثانية بمجهول واحد، وحل النظمات الخطية",
      "الإحصاء: الجداول التكرارية، الترددات، والتمثيلات المبيانية (المخططات القضيبية والقطاعية)",
      "مبادئ الدوال: قراءة الصور والسوابق والمنحنيات البيانية البسيطة",
    ],
    prereqsFr: [
      "Calcul numérique, pourcentages, proportionnalité et variations relatives",
      "Équations et inéquations du 1er et 2nd degré, et systèmes de deux équations",
      "Statistiques : tableaux d'effectifs, fréquences et représentations graphiques",
      "Notions de fonctions : lecture graphique d'images, antécédents et variations",
    ],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "مبادئ في المنطق والحساب العددي والنسب المئوية",
            lessonFr: "Notions de logique, calcul numérique et pourcentages",
            weight: 50,
            hours: "10h",
            category: "Algebra",
            subCategory: "منطق ومجموعات",
            subCategoryFr: "Logique & Ensembles",
            tags: ["Algebra", "جبر", "منطق ومجموعات", "نسب مئوية"],
            capacitiesAr: [
              "استعمال العبارات ونفي عبارة والمكممات ومبدأ المثال المضاد",
              "حساب النسب المئوية وتطبيقات التخفيض، الزيادة، والنسب المتتالية",
            ],
            capacitiesFr: [
              "Propositions, négation, quantificateurs et contre-exemple",
              "Calcul des pourcentages, évolutions successives et taux d'évolution",
            ],
            sampleExerciseAr: [
              "حدد قيمة حقيقة كل عبارة مع التعليل: (P): « لكل x من ℝ: x² ≥ 0 »، و (Q): « يوجد عدد حقيقي x بحيث: x² + 1 = 0 ».",
              "في مكتبة جامعية، انخفض ثمن موسوعة أدبية بنسبة 15% خلال الأسبوع الأول، ثم ارتفع الثمن الجديد بنسبة 10% خلال الأسبوع الثاني. إذا كان الثمن الأصلي للموسوعة هو 400 درهم، احسب ثمنها النهائي وحدد نسبة التغير الإجمالية.",
            ],
            sampleExerciseFr: [
              "Déterminer la valeur de vérité de chaque proposition : (P): « ∀x ∈ ℝ, x² ≥ 0 » et (Q): « ∃x ∈ ℝ, x² + 1 = 0 ».",
              "Dans une librairie, le prix d'un recueil de littérature baisse de 15% la première semaine, puis augmente de 10% la deuxième semaine. Si le prix initial est 400 DH, calculer le prix final et le taux d'évolution global.",
            ],
          },
          {
            lessonAr: "المعادلات والمتراجحات والنظمات من الدرجة 1 و 2",
            lessonFr: "Équations, inéquations et systèmes du 1er et 2nd degré",
            weight: 50,
            hours: "12h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra", "جبر", "معادلات ونظمات"],
            capacitiesAr: [
              "حل معادلات ومتراجحات من الدرجة الثانية بمجهول واحد باستعمال المميز Δ وجدول الإشارة",
              "حل نظمة من معادلتين من الدرجة الأولى بمجهولين باستعمال التعويض أو التأليفة الخطية أو المحددة وحل مسائل مرتبطة بالواقع الاجتماعي والاقتصادي",
            ],
            capacitiesFr: [
              "Résolution d'équations et inéquations du 2nd degré via le discriminant Δ",
              "Résolution de systèmes linéaires à deux inconnues et modélisation de problèmes réels",
            ],
            sampleExerciseAr: [
              "حل في ℝ المعادلة: 2x² - 7x + 3 = 0 باستعمال المميز Δ.",
              "أنشئ جدول إشارة ثلاثية الحدود P(x) = 2x² - 7x + 3، ثم استنتج في ℝ حلول المتراجحة 2x² - 7x + 3 ≤ 0.",
              "اشترت جمعية ثقافية 30 كتاباً من صنفين (روايات أدبية وكتب تاريخية) بمبلغ إجمالي قدره 2100 درهم. إذا علمت أن ثمن الرواية 60 درهماً وثمن كتاب التاريخ 80 درهماً، فاحسب عدد الكتب المشتراة من كل صنف.",
            ],
            sampleExerciseFr: [
              "Résoudre dans ℝ l'équation : 2x² - 7x + 3 = 0 à l'aide du discriminant Δ.",
              "Dresser le tableau de signes de P(x) = 2x² - 7x + 3 et résoudre l'inéquation 2x² - 7x + 3 ≤ 0.",
              "Une association achète 30 livres (romans et ouvrages d'histoire) pour un montant total de 2100 DH. Le roman coûte 60 DH et l'ouvrage d'histoire 80 DH. Déterminer le nombre d'exemplaires de chaque catégorie.",
            ],
          },
        ],
        DS2: [
          {
            lessonAr: "المتتاليات العددية (الحسابية والهندسية)",
            lessonFr: "Suites numériques (arithmétiques et géométriques)",
            weight: 100,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus", "تحليل", "متتاليات عددية"],
            capacitiesAr: [
              "التعرف على المتتالية الحسابية وتحديد أساسها وحدها الأول وصيغة الحد العام un = u0 + n*r",
              "التعرف على المتتالية الهندسية وتحديد أساسها وصيغة الحد العام un = u0 * q^n",
              "حساب مجموع حدود متتابعة لمتتالية حسابية أو هندسية وتوظيفها في مسائل النمو الديموغرافي والادخار",
            ],
            capacitiesFr: [
              "Caractériser une suite arithmétique (raison r, premier terme, terme général un = u0 + n*r)",
              "Caractériser une suite géométrique (raison q, terme général un = u0 * q^n)",
              "Calculer la somme de termes consécutifs et modéliser des évolutions démographiques",
            ],
            sampleExerciseAr: [
              "نعتبر المتتالية الحسابية (un) المعرفة بـ: u0 = 5 والأساس r = 3. احسب u1 و u2، ثم عبر عن un بدلالة n.",
              "احسب المجموع: S = u0 + u1 + ... + u15.",
              "نعتبر المتتالية الهندسية (vn) المعرفة بـ: v0 = 2 والأساس q = 3. احسب v1 و v4، ثم احسب المجموع S' = v0 + v1 + ... + v5.",
              "بلغ عدد منخرطي نادٍ أدبي 200 منخرط سنة 2020، ويزداد هذا العدد كل سنة بـ 25 منخرطاً جديداً. حدد عدد منخرطي النادي المتوقع سنة 2030.",
            ],
            sampleExerciseFr: [
              "Soit la suite arithmétique (un) définie par u0 = 5 et la raison r = 3. Calculer u1, u2 et exprimer un en fonction de n.",
              "Calculer la somme S = u0 + u1 + ... + u15.",
              "Soit la suite géométrique (vn) définie par v0 = 2 et de raison q = 3. Calculer v1, v4 et la somme S' = v0 + v1 + ... + v5.",
              "Un club littéraire compte 200 adhérents en 2020. Le nombre d'adhérents augmente de 25 personnes chaque année. Prévoir le nombre d'adhérents en 2030.",
            ],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "التعداد وحساب الاحتمالات الأولي",
            lessonFr: "Le dénombrement et calcul des probabilités élémentaires",
            weight: 100,
            hours: "12h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities", "احتمالات وإحصاء", "تعداد"],
            capacitiesAr: [
              "استعمال مبدأ الجداء، الترتيبات بدون تكرار A_n^p، والترتيبات بتكرار n^p، والتأليفات C_n^p",
              "نمذجة مسائل السحب (في آن واحد، بالتتابع وبإحلال، بالتتابع وبدون إحلال)",
              "حساب احتمال حدث بسيط باستعمال الصيغة: p(A) = Card(A) / Card(Ω)",
            ],
            capacitiesFr: [
              "Principe multiplicatif, arrangements sans répétition A_n^p, avec répétition n^p et combinaisons C_n^p",
              "Modélisation des tirages simultanés, successifs avec ou sans remise",
              "Calcul de probabilités élémentaires d'événements équiprobables",
            ],
            sampleExerciseAr: [
              "يحتوي صندوق على 4 كرات بيضاء و 3 كرات حمراء. نسحب عشوائياً وفي آن واحد 3 كرات من الصندوق.",
              "1) ما هو عدد السحبات الممكنة الإجمالية Card(Ω)؟",
              "2) ما هو عدد السحبات التي تحتوي على 3 كرات بيضاء فقط؟",
              "3) ما هو عدد السحبات التي تحتوي على كرتين بيضاوين وكرة حمراء واحدة؟",
              "4) احسب احتمال الحدث A: « سحب ثلاث كرات من نفس اللون ».",
            ],
            sampleExerciseFr: [
              "Une urne contient 4 boules blanches et 3 boules rouges. On tire simultanément et au hasard 3 boules de l'urne.",
              "1) Quel est le nombre total de tirages possibles Card(Ω) ?",
              "2) Combien de tirages sont constitués uniquement de 3 boules blanches ?",
              "3) Combien de tirages contiennent exactement 2 boules blanches et 1 boule rouge ?",
              "4) Calculer la probabilité de l'événement A : « Tirer 3 boules de même couleur ».",
            ],
          },
        ],
        DS2: [
          {
            lessonAr: "نهايات واشتقاق ودراسة الدوال العددية",
            lessonFr: "Limites, dérivation et étude des fonctions numériques",
            weight: 60,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus", "تحليل", "دراسة الدوال"],
            capacitiesAr: [
              "حساب نهايات الدوال الحدودية والدوال المتخاطة عند أطراف مجموعة التعريف",
              "حساب الدالة المشتقة للدوال الاعتيادية وتحديد إشارة المشتقة وجدول التغيرات والمطاريف",
              "كتابة معادلة مماس المنحنى عند نقطة وإنشاء التمثيل المبياني وقراءة المعطيات منه",
            ],
            capacitiesFr: [
              "Calcul de limites de fonctions polynômes et rationnelles usuelles aux bornes",
              "Calcul de la dérivée, signe de f'(x), tableau de variations et extremums locaux",
              "Équation de la tangente y = f'(a)(x-a) + f(a) et tracé de la courbe représentative",
            ],
            sampleExerciseAr: [
              "نعتبر الدالة العددية f المعرفة على ℝ بـ: f(x) = x² - 4x + 3، وليكن (Cf) منحناها في معلم متعامد ممنظم.",
              "1) احسب lim_{x->+∞} f(x) و lim_{x->-∞} f(x).",
              "2) احسب f'(x) لكل x من ℝ، وادرس إشارتها ثم ضع جدول تغيرات الدالة f.",
              "3) حدد معادلة المماس (T) للمنحنى (Cf) عند النقطة ذات الأفصول x0 = 3.",
              "4) أنشئ المنحنى (Cf) في المعلم المتعامد الممنظم.",
            ],
            sampleExerciseFr: [
              "Soit la fonction numérique f définie sur ℝ par : f(x) = x² - 4x + 3, et (Cf) sa courbe représentative.",
              "1) Calculer lim_{x->+∞} f(x) et lim_{x->-∞} f(x).",
              "2) Calculer f'(x) pour tout x ∈ ℝ, étudier son signe et dresser le tableau de variations de f.",
              "3) Déterminer l'équation de la tangente (T) à (Cf) au point d'abscisse x0 = 3.",
              "4) Tracer la courbe (Cf) dans un repère orthonormé.",
            ],
          },
          {
            lessonAr: "الإحصاء وسلاسل المتغيرين والميزات الإحصائية",
            lessonFr: "Statistiques et caractéristiques de position et de dispersion",
            weight: 40,
            hours: "8h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities", "احتمالات وإحصاء", "إحصاء"],
            capacitiesAr: [
              "تحديد ميزات الموضع: المنوال، القيمة المتوسطة الحسابية، والوسيط",
              "تحديد ميزات التشتت: التباين والانحراف المعياري ومجال التشتت وتأويلها الديداكتيكي والاجتماعي",
            ],
            capacitiesFr: [
              "Déterminer les caractéristiques de position : mode, moyenne arithmétique et médiane",
              "Déterminer les caractéristiques de dispersion : variance, écart-type et étendue",
            ],
            sampleExerciseAr: [
              "يمثل الجدول التالي توزيع نقط 30 تلميذاً في الفرض الأول لمادة التاريخ والجغرافيا: النقط [8, 10, 12, 14, 16] والحصيصات [4, 8, 10, 6, 2].",
              "1) حدد منوال هذه السلسلة الإحصائية ومداها.",
              "2) احسب المعدل الحسابي x̄ لقسم الآداب.",
              "3) حدد القيمة الوسيطية Me للنقط.",
              "4) احسب التباين V والانحراف المعياري σ لهذه المتسلسلة وقدم تأويلاً بيداغوجياً لمدى تجانس نقط القسم.",
            ],
            sampleExerciseFr: [
              "Le tableau suivant donne la répartition des notes de 30 élèves en histoire-géographie : Notes [8, 10, 12, 14, 16] et Effectifs [4, 8, 10, 6, 2].",
              "1) Déterminer le mode et l'étendue de cette série statistique.",
              "2) Calculer la moyenne arithmétique x̄ de la classe.",
              "3) Déterminer la médiane Me des notes.",
              "4) Calculer la variance V et l'écart-type σ et interpréter l'homogénéité du groupe classe.",
            ],
          },
        ],
      },
    },
  },

  // ==================== سلك الثانية بكالوريا ====================
  "2BAC_SM": {
    code: "2BAC_SM",
    cycle: "2BAC",
    cycleAr: "الثانية بكالوريا",
    labelAr: "الثانية بكالوريا - مسلكا العلوم الرياضية (أ) و (ب)",
    labelFr: "2ème Bac Sciences Mathématiques A et B (BIOF)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 4,
    prereqsAr: ["المنطق، المجموعات والتطبيقات، الحسابيات في Z، النهايات والاشتقاق، والمتتاليات"],
    prereqsFr: ["Logique, ensembles et applications, arithmétique dans Z, analyse et suites"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الاتصال والاشتقاق ومبرهنة التزايدات المنتهية",
            lessonFr: "Continuité, dérivation, théorème de Rolle et TAF",
            weight: 60,
            hours: "18h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["مبرهنة القيم الوسيطية، التقابل، مبرهنة رول، ومبرهنة ومتفاوتة التزايدات المنتهية (TAF/IAF)"],
            capacitiesFr: ["TVI, bijection, théorème de Rolle, TAF et IAF"],
          },
          {
            lessonAr: "المتتاليات العددية",
            lessonFr: "Les suites numériques",
            weight: 40,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["التعريف المكمم للنهاية، المتتاليات المتحادية، والمتتاليات الترجعية u_{n+1}=f(u_n)"],
            capacitiesFr: ["Définition quantifiée, suites adjacentes et suites récurrentes u_{n+1}=f(u_n)"],
          },
        ],
        DS2: [
          {
            lessonAr: "الدوال اللوغاريتمية والدوال الأسية",
            lessonFr: "Fonctions logarithmiques et exponentielles",
            weight: 65,
            hours: "18h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["دراسة الدوال اللوغاريتمية والأسية ودوال القوى وتوظيف TAF"],
            capacitiesFr: ["Étude avancée des fonctions ln, exp et puissances"],
          },
          {
            lessonAr: "الدوال الأصلية والمعادلات التفاضلية",
            lessonFr: "Fonctions primitives et équations différentielles",
            weight: 35,
            hours: "8h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["الدوال الأصلية وحل المعادلات التفاضلية y'=ay+b و y''+ay'+by=0"],
            capacitiesFr: ["Primitives et résolution de y'=ay+b et y''+ay'+by=0"],
          },
        ],
        DS3: [
          {
            lessonAr: "الأعداد العقدية",
            lessonFr: "Les nombres complexes",
            weight: 100,
            hours: "20h",
            category: "Algebra",
            subCategory: "أعداد عقدية",
            subCategoryFr: "Nombres complexes",
            tags: ["Algebra","Geometry","جبر","أعداد عقدية"],
            capacitiesAr: ["الجذور النونية لعدد عقدي، المعادلات بمعاملات عقدية، والتحويلات في المستوى العقدي"],
            capacitiesFr: ["Racines n-ièmes, équations dans C et transformations complexes"],
          },
        ],
        DS4: [
          {
            lessonAr: "الحسابيات في Z",
            lessonFr: "Arithmétique dans Z",
            weight: 100,
            hours: "20h",
            category: "Algebra",
            subCategory: "حسابيات",
            subCategoryFr: "Arithmétique",
            tags: ["Algebra","جبر","حسابيات"],
            capacitiesAr: ["مبرهنات بوزو وغوص وفيرما الصغرى، المعادلات الديوفانتية، ونظمات العد"],
            capacitiesFr: ["Théorèmes de Bézout, Gauss, Fermat, équations diophantiennes et numération"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الحساب التكاملي والدوال المعرفة بتكامل",
            lessonFr: "Calcul intégral et fonctions définies par une intégrale",
            weight: 100,
            hours: "20h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["المكاملة بالأجزاء، تغيير المتغير، مجاميع ريمان، ودراسة الدوال المعرفة بتكامل"],
            capacitiesFr: ["IPP, changement de variable, sommes de Riemann et fonctions définies par intégrale"],
          },
        ],
        DS2: [
          {
            lessonAr: "البنيات الجبرية (الزمر، الحلقات، الجسوم)",
            lessonFr: "Structures algébriques (Groupes, Anneaux, Corps)",
            weight: 60,
            hours: "16h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: ["قوانين التركيب الداخلي، التشاكلات، الزمر، الحلقات، والجسوم"],
            capacitiesFr: ["Lois de composition interne, morphismes, groupes, anneaux et corps"],
          },
          {
            lessonAr: "الفضاءات المتجهية الحقيقية",
            lessonFr: "Espaces vectoriels réels",
            weight: 40,
            hours: "10h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","هندسة مستوية"],
            capacitiesAr: ["الفضاءات المتجهية الجزئية، الاستقلال الخطي، الأساس والبعد"],
            capacitiesFr: ["Sous-espaces vectoriels, familles libres et génératrices, base et dimension"],
          },
        ],
        DS3: [
          {
            lessonAr: "حساب الاحتمالات",
            lessonFr: "Calcul des probabilités",
            weight: 100,
            hours: "16h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الاحتمال الشرطي، صيغة الاحتمالات الكلية، صيغة بايز، والمتغيرات العشوائية"],
            capacitiesFr: ["Probabilités conditionnelles, probabilités totales, formule de Bayes et variables aléatoires"],
          },
        ],
        DS4: [
          {
            lessonAr: "فرض توليفي عام وفق الإطار المرجعي للامتحان الوطني",
            lessonFr: "Devoir de synthèse générale (Type Examen National SM)",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","Algebra","Geometry","تحليل","جبر","هندسة فضائية"],
            capacitiesAr: ["توليف شامل للتحليل والجبر والحسابيات والأعداد العقدية والاحتمالات"],
            capacitiesFr: ["Synthèse générale conforme au cadre de référence national"],
          },
        ],
      },
    },
  },

  "2BAC_PC": {
    code: "2BAC_PC",
    cycle: "2BAC",
    cycleAr: "الثانية بكالوريا",
    labelAr: "الثانية بكالوريا - مسلك العلوم الفيزيائية (2Bac PC)",
    labelFr: "2ème Bac Sciences Physiques (2Bac PC - BIOF)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["حساب النهايات، الاشتقاق، الفروع اللانهائية، المتتاليات العددية، والجداء السلمي"],
    prereqsFr: ["Calcul de limites, dérivation, branches infinies, suites numériques et produit scalaire"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الاتصال",
            lessonFr: "Continuité d'une fonction numérique",
            weight: 45,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الاتصال في نقطة وعلى مجال، صورة مجال، مبرهنة القيم الوسيطية (TVI)، والدالة العكسية"],
            capacitiesFr: ["Continuité, image d'un intervalle, TVI et fonction réciproque"],
            sampleExerciseAr: [
              "نعتبر الدالة العددية f المعرفة على [1, +∞[ بما يلي: f(x) = x² - 2x + 3.",
              "1. بين أن الدالة f متصلة وتزايدية قطعا على المجال I = [1, +∞[.",
              "2. استنتج أن f تقبل دالة عكسية f⁻¹ معرفة على مجال J يتم تحديده، ثم حدد f⁻¹(x) لكل x من J.",
              "3. بين أن المعادلة x³ + x - 3 = 0 تقبل حلاً وحيداً α في المجال ]1, 2[.",
            ],
            sampleExerciseFr: [
              "Soit f la fonction numérique définie sur I = [1, +∞[ par : f(x) = x² - 2x + 3.",
              "1. Montrer que f est continue et strictement croissante sur I = [1, +∞[.",
              "2. En déduire que f admet une fonction réciproque f⁻¹ définie sur un intervalle J à déterminer, puis calculer f⁻¹(x) pour tout x ∈ J.",
              "3. Montrer que l'équation x³ + x - 3 = 0 admet une unique solution α dans ]1, 2[.",
            ],
          },
          {
            lessonAr: "الاشتقاق ودراسة الدوال",
            lessonFr: "Dérivation et étude des fonctions",
            weight: 55,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["مشتقة دالة مركبة، الجذر من الرتبة n، مشتقة الدالة العكسية، ودراسة وتمثيل الدوال"],
            capacitiesFr: ["Dérivée de la composée, racine n-ième, réciproque et étude complète de fonctions"],
            sampleExerciseAr: [
              "لتكن g الدالة المعرفة على [0, +∞[ بما يلي: g(x) = x - 2√x + 2.",
              "1. أدرس قابلية اشتقاق الدالة g على اليمين في 0 وأول النتيجة مبيانياً.",
              "2. أحسب g'(x) لكل x من ]0, +∞[ ثم ضع جدول تغيرات الدالة g.",
              "3. أدرس الفروع اللانهائية للمنحنى (Cg) وأنشئه في معلم متعامد ممنظم (O, i, j).",
            ],
            sampleExerciseFr: [
              "Soit g la fonction définie sur [0, +∞[ par : g(x) = x - 2√x + 2.",
              "1. Étudier la dérivabilité de g à droite en 0 et interpréter géométriquement le résultat.",
              "2. Calculer g'(x) pour tout x ∈ ]0, +∞[ puis dresser le tableau de variations de g.",
              "3. Étudier la branche infinie de (Cg) au voisinage de +∞ et construire (Cg).",
            ],
          },
        ],
        DS2: [
          {
            lessonAr: "المتتاليات العددية",
            lessonFr: "Les suites numériques",
            weight: 70,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["معايير التقارب، مبرهنات الترتيب والحصر، والمتتاليات الترجعية u_{n+1}=f(u_n)"],
            capacitiesFr: ["Critères de convergence, encadrement et suites récurrentes u_{n+1}=f(u_n)"],
          },
          {
            lessonAr: "الدوال الأصلية",
            lessonFr: "Fonctions primitives",
            weight: 30,
            hours: "5h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["تحديد الدوال الأصلية للدوال الاعتيادية والمركبة على مجال"],
            capacitiesFr: ["Déterminer les primitives des fonctions usuelles et composées"],
          },
        ],
        DS3: [
          {
            lessonAr: "الدوال اللوغاريتمية",
            lessonFr: "Fonctions logarithmiques",
            weight: 65,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الخواص الجبرية والنهايات الأساسية ودراسة وتمثيل دوال تضم ln(x)"],
            capacitiesFr: ["Propriétés algébriques, limites fondamentales et étude de fonctions avec ln(x)"],
          },
          {
            lessonAr: "الأعداد العقدية (الشطر 1)",
            lessonFr: "Nombres complexes (Partie 1)",
            weight: 35,
            hours: "10h",
            category: "Algebra",
            subCategory: "أعداد عقدية",
            subCategoryFr: "Nombres complexes",
            tags: ["Algebra","Geometry","جبر","أعداد عقدية"],
            capacitiesAr: ["الشكل الجبري والمثلثي، المعيار والعمدة، والتأويلات الهندسية (المسافة، الزوايا، الاستقامية)"],
            capacitiesFr: ["Forme algébrique et trigonométrique, module, argument et interprétation géométrique"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الدوال الأسية",
            lessonFr: "Fonctions exponentielles",
            weight: 65,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["النهايات الأساسية ودراسة وتمثيل دوال تضم exp(x) و ln(x)"],
            capacitiesFr: ["Limites fondamentales et étude de fonctions comportant exp(x) et ln(x)"],
          },
          {
            lessonAr: "المعادلات التفاضلية",
            lessonFr: "Équations différentielles",
            weight: 35,
            hours: "4h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["حل المعادلة y'=ay+b والمعادلة y''+ay'+by=0"],
            capacitiesFr: ["Résoudre les équations différentielles y'=ay+b et y''+ay'+by=0"],
          },
        ],
        DS2: [
          {
            lessonAr: "الأعداد العقدية (الشطر 2)",
            lessonFr: "Nombres complexes (Partie 2)",
            weight: 45,
            hours: "10h",
            category: "Algebra",
            subCategory: "أعداد عقدية",
            subCategoryFr: "Nombres complexes",
            tags: ["Algebra","Geometry","جبر","أعداد عقدية"],
            capacitiesAr: ["الترميز الأسي e^{iθ}، معادلات الدرجة الثانية في C، والكتابة العقدية للإزاحة والتحاكي والدوران"],
            capacitiesFr: ["Notation exponentielle, équations du 2nd degré dans C et transformations planes"],
          },
          {
            lessonAr: "الحساب التكاملي",
            lessonFr: "Calcul intégral",
            weight: 55,
            hours: "10h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["حساب التكامل بالدوال الأصلية والمكاملة بالأجزاء وحساب المساحات والحجوم"],
            capacitiesFr: ["Calcul d'intégrales par primitives et IPP, calcul d'aires et de volumes"],
          },
        ],
        DS3: [
          {
            lessonAr: "الهندسة الفضائية (الجداء السلمي والمتجهي)",
            lessonFr: "Géométrie dans l'espace (Produit scalaire et vectoriel)",
            weight: 40,
            hours: "10h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","هندسة مستوية"],
            capacitiesAr: ["معادلة مستوى، المسافات، الفلكة، والجداء المتجهي في الفضاء"],
            capacitiesFr: ["Équation d'un plan, distances, étude de la sphère et produit vectoriel"],
          },
          {
            lessonAr: "حساب الاحتمالات",
            lessonFr: "Calcul des probabilités",
            weight: 60,
            hours: "12h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الاحتمال الشرطي، الاستقلالية، المتغيرات العشوائية، وقانون الحدانية"],
            capacitiesFr: ["Probabilité conditionnelle, indépendance, variables aléatoires et loi binomiale"],
          },
        ],
      },
    },
  },

  "2BAC_SVT_AGRO": {
    code: "2BAC_SVT_AGRO",
    cycle: "2BAC",
    cycleAr: "الثانية بكالوريا",
    labelAr: "الثانية بكالوريا - مسلكا علوم الحياة والأرض والعلوم الزراعية (SVT / AGRO)",
    labelFr: "2ème Bac SVT et Sciences Agronomiques (BIOF)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["حساب النهايات، الاشتقاق، دراسة الدوال، والمتتاليات العددية"],
    prereqsFr: ["Calcul de limites, dérivation, étude de fonctions et suites numériques"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الاتصال والاشتقاق ودراسة الدوال",
            lessonFr: "Continuité, dérivation et étude des fonctions",
            weight: 100,
            hours: "26h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الاتصال، مبرهنة القيم الوسيطية، الدالة العكسية، الجذر من الرتبة n، ودراسة الدوال"],
            capacitiesFr: ["Continuité, TVI, fonction réciproque, racine n-ième et étude de fonctions"],
          },
        ],
        DS2: [
          {
            lessonAr: "المتتاليات العددية والدوال الأصلية",
            lessonFr: "Suites numériques et Fonctions primitives",
            weight: 100,
            hours: "17h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["معايير التقارب ومبرهنات الترتيب والحصر، المتتاليات الترجعية u_{n+1}=f(u_n)، والدوال الأصلية"],
            capacitiesFr: ["Critères de convergence, suites u_{n+1}=f(u_n) et fonctions primitives"],
          },
        ],
        DS3: [
          {
            lessonAr: "الدوال اللوغاريتمية والأعداد العقدية (ج 1)",
            lessonFr: "Fonctions logarithmiques et Nombres complexes (P1)",
            weight: 100,
            hours: "24h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Algebra","Geometry","جبر","أعداد عقدية","Calculus","تحليل"],
            capacitiesAr: ["دراسة الدوال اللوغاريتمية والشكل الجبري والمثلثي للأعداد العقدية"],
            capacitiesFr: ["Fonctions comportant ln(x) et forme algébrique/trigonométrique des complexes"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الدوال الأسية والمعادلات التفاضلية",
            lessonFr: "Fonctions exponentielles et Équations différentielles",
            weight: 100,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["دراسة دوال تضم exp(x) وحل المعادلات التفاضلية"],
            capacitiesFr: ["Étude de fonctions avec exp(x) et résolution d'équations différentielles"],
          },
        ],
        DS2: [
          {
            lessonAr: "الأعداد العقدية (ج 2) والحساب التكاملي",
            lessonFr: "Nombres complexes (P2) et Calcul intégral",
            weight: 100,
            hours: "20h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Algebra","Geometry","جبر","أعداد عقدية","Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["الترميز الأسي، التحويلات العقدية، المكاملة بالأجزاء، وحساب المساحات"],
            capacitiesFr: ["Notation exponentielle, transformations, IPP et calcul d'aires"],
          },
        ],
        DS3: [
          {
            lessonAr: "الهندسة الفضائية وحساب الاحتمالات",
            lessonFr: "Géométrie dans l'espace et Calcul des probabilités",
            weight: 100,
            hours: "22h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية","Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الجداء السلمي والمتجهي والفلكة، والاحتمالات الشرطية والمتغيرات العشوائية"],
            capacitiesFr: ["Géométrie analytique dans l'espace, probabilités et variables aléatoires"],
          },
        ],
      },
    },
  },

  "2BAC_STE_STM": {
    code: "2BAC_STE_STM",
    cycle: "2BAC",
    cycleAr: "الثانية بكالوريا",
    labelAr: "الثانية بكالوريا - العلوم والتكنولوجيات الكهربائية والميكانيكية (STE / STM)",
    labelFr: "2ème Bac Sciences et Technologies Électriques et Mécaniques",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["النهايات، الاشتقاق، المتتاليات، والحساب المثلثي"],
    prereqsFr: ["Limites, dérivation, suites et trigonométrie"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الاتصال والاشتقاق ودراسة الدوال",
            lessonFr: "Continuité, dérivation et étude des fonctions",
            weight: 100,
            hours: "24h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["مبرهنة القيم الوسيطية، الدالة العكسية، واشتقاق الدوال المركبة"],
            capacitiesFr: ["TVI, fonction réciproque et étude de fonctions"],
          },
        ],
        DS2: [
          {
            lessonAr: "المتتاليات العددية والدوال الأصلية",
            lessonFr: "Suites numériques et Fonctions primitives",
            weight: 100,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["تقارب المتتاليات وتحديد الدوال الأصلية"],
            capacitiesFr: ["Convergence des suites et calcul de primitives"],
          },
        ],
        DS3: [
          {
            lessonAr: "الدوال اللوغاريتمية والأعداد العقدية (ج 1)",
            lessonFr: "Fonctions logarithmiques et Nombres complexes (P1)",
            weight: 100,
            hours: "22h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Algebra","Geometry","جبر","أعداد عقدية","Calculus","تحليل"],
            capacitiesAr: ["الدوال اللوغاريتمية والشكل الجبري والمثلثي للأعداد العقدية"],
            capacitiesFr: ["Fonctions logarithmiques et nombres complexes"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الدوال الأسية والمعادلات التفاضلية",
            lessonFr: "Fonctions exponentielles et Équations différentielles",
            weight: 100,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["الدوال الأسية وحل المعادلات التفاضلية المرتبطة بالكهرباء والميكانيك"],
            capacitiesFr: ["Fonctions exponentielles et équations différentielles"],
          },
        ],
        DS2: [
          {
            lessonAr: "الأعداد العقدية (ج 2) والحساب التكاملي",
            lessonFr: "Nombres complexes (P2) et Calcul intégral",
            weight: 100,
            hours: "20h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Algebra","Geometry","جبر","أعداد عقدية","Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["الترميز الأسي والتحويلات والمكاملة بالأجزاء وحساب المساحات والحجوم"],
            capacitiesFr: ["Notation exponentielle, transformations et calcul intégral"],
          },
        ],
        DS3: [
          {
            lessonAr: "حساب الاحتمالات",
            lessonFr: "Calcul des probabilités",
            weight: 100,
            hours: "12h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الاحتمال الشرطي، قانون الحدانية، والمتغيرات العشوائية"],
            capacitiesFr: ["Probabilité conditionnelle, loi binomiale et variables aléatoires"],
          },
        ],
      },
    },
  },

  "2BAC_ECO_TGC": {
    code: "2BAC_ECO_TGC",
    cycle: "2BAC",
    cycleAr: "الثانية بكالوريا",
    labelAr: "الثانية بكالوريا - العلوم الاقتصادية وتقنيات التدبير المحاسباتي (SE / TGC)",
    labelFr: "2ème Bac Sciences Économiques et Gestion Comptable (SE / TGC)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    prereqsAr: ["النهايات والاشتقاق، المتتاليات الحسابية والهندسية، والتعداد"],
    prereqsFr: ["Limites et dérivation, suites arithmétiques et géométriques, dénombrement"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الاتصال والاشتقاق ودراسة الدوال",
            lessonFr: "Continuité, dérivation et étude des fonctions",
            weight: 100,
            hours: "18h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الاتصال، مبرهنة القيم الوسيطية، الدالة العكسية، ودراسة الدوال وتأويلها الاقتصادي"],
            capacitiesFr: ["Continuité, TVI, bijection, dérivation et applications économiques"],
          },
        ],
        DS2: [
          {
            lessonAr: "المتتاليات العددية والدوال الأصلية",
            lessonFr: "Suites numériques et Fonctions primitives",
            weight: 100,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["المتتاليات الترجعية وتطبيقاتها المالية وتحديد الدوال الأصلية"],
            capacitiesFr: ["Suites récurrentes, applications financières et primitives"],
          },
        ],
        DS3: [
          {
            lessonAr: "الدوال اللوغاريتمية",
            lessonFr: "Fonctions logarithmiques",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الخواص الجبرية والنهايات ودراسة وتمثيل دوال تضم ln(x)"],
            capacitiesFr: ["Propriétés, limites et étude de fonctions comportant ln(x)"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الدوال الأسية",
            lessonFr: "Fonctions exponentielles",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["النهايات الأساسية ودراسة وتمثيل دوال تضم exp(x)"],
            capacitiesFr: ["Limites fondamentales et étude de fonctions comportant exp(x)"],
          },
        ],
        DS2: [
          {
            lessonAr: "الحساب التكاملي",
            lessonFr: "Calcul intégral",
            weight: 100,
            hours: "10h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["حساب التكامل بالدوال الأصلية والمكاملة بالأجزاء وحساب المساحات والقيمة المتوسطة"],
            capacitiesFr: ["Calcul intégral, IPP, calcul d'aires et valeur moyenne"],
          },
        ],
        DS3: [
          {
            lessonAr: "حساب الاحتمالات",
            lessonFr: "Calcul des probabilités",
            weight: 100,
            hours: "14h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الاحتمال الشرطي، الاحتمالات الكلية، المتغيرات العشوائية، وقانون الحدانية"],
            capacitiesFr: ["Probabilités conditionnelles, probabilités totales et variables aléatoires"],
          },
        ],
      },
    },
  },

  "2BAC_LETTRES": {
    code: "2BAC_LETTRES",
    cycle: "2BAC",
    cycleAr: "الثانية بكالوريا",
    labelAr: "الثانية بكالوريا - الآداب والعلوم الإنسانية والتعليم الأصيل (الوطني)",
    labelFr: "2ème Bac Lettres, Sciences Humaines et Enseignement Originel",
    durationAr: "ساعة واحدة (1h)",
    durationFr: "1 heure",
    dsCount: 2,
    prereqsAr: ["المتتاليات الحسابية والهندسية، التعداد، ودراسة الدوال الحدودية والمتخاطة"],
    prereqsFr: ["Suites arithmétiques et géométriques, dénombrement et fonctions usuelles"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "المتتاليات العددية ونهاية متتالية",
            lessonFr: "Suites numériques et limite d'une suite",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["المتتاليات الترجعية البسيطة وحساب نهاية متتالية"],
            capacitiesFr: ["Suites récurrentes simples et limite d'une suite"],
          },
        ],
        DS2: [
          {
            lessonAr: "الدالة اللوغاريتمية النيبيرية",
            lessonFr: "Fonction logarithme népérien",
            weight: 100,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["المعادلات اللوغاريتمية ودراسة دوال بسيطة تضم ln(x)"],
            capacitiesFr: ["Équations avec ln(x) et étude de fonctions comportant ln(x)"],
          },
        ],
      },
      S2: {
        DS1: [
          {
            lessonAr: "الدالة الأسية النيبيرية",
            lessonFr: "Fonction exponentielle népérienne",
            weight: 100,
            hours: "10h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["المعادلات الأسية ودراسة دوال بسيطة تضم e^x"],
            capacitiesFr: ["Équations avec e^x et étude de fonctions comportant e^x"],
          },
        ],
        DS2: [
          {
            lessonAr: "حساب الاحتمالات",
            lessonFr: "Calcul des probabilités",
            weight: 100,
            hours: "12h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["حساب احتمالات الأحداث في تجارب السحب والأمل الرياضياتي"],
            capacitiesFr: ["Calcul de probabilités lors de tirages et espérance mathématique"],
          },
        ],
      },
    },
  },

  // ==================== مدارس البعثة الفرنسية بالمغرب (AEFE / OSUI) ====================
  "2NDE_FR": {
    code: "2NDE_FR",
    cycle: "2NDE",
    cycleAr: "الجذع المشترك - البعثة الفرنسية (Seconde)",
    labelAr: "سلك الجذع المشترك (Seconde Générale et Technologique - AEFE)",
    labelFr: "Classe de Seconde Générale et Technologique (Mission Française / AEFE)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    system: "MISSION_FRANCAISE",
    prereqsAr: ["حساب عددي، جبري، متطابقات هامة، مبرهنة فيتاغورس وطاليس (سنة 3 إعدادي / 3ème)"],
    prereqsFr: ["Calcul numérique, calcul littéral, développement, factorisation, théorèmes de Pythagore et Thalès"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الأعداد والحساب والمجموعات والمجالات",
            lessonFr: "Nombres, calculs, ensembles et intervalles",
            weight: 50,
            hours: "12h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: ["التمييز بين المجموعات N, Z, D, Q, R والقيمة المطلقة وحصر الأعداد"],
            capacitiesFr: ["Manipuler les ensembles de nombres, intervalles, valeur absolue et encadrements"],
            sampleExerciseFr: [
              "1. Démontrer que le nombre A = √2 n'est pas un nombre rationnel (démonstration par l'absurde).",
              "2. Résoudre dans ℝ l'inéquation : |x - 3| ≤ 5 et donner l'ensemble des solutions sous forme d'intervalle.",
              "3. Écrire le nombre B = (2⁴ × 15⁻²) / (6⁻³ × 10²) sous la forme 2^p × 3^q × 5^r où p, q, r ∈ ℤ."
            ],
            sampleExerciseAr: [
              "1. برهن بالخلف أن العدد √2 ليس عدداً جذرياً.",
              "2. حل في R المتراجحة: |x - 3| ≤ 5 وأعط مجموعة الحلول على شكل مجال.",
              "3. أكتب العدد B = (2⁴ × 15⁻²) / (6⁻³ × 10²) على شكل 2^p × 3^q × 5^r حيث p و q و r أعداد صحيحة نسبية."
            ]
          },
          {
            lessonAr: "الحساب المتجهي ومعادلات المستقيمات",
            lessonFr: "Vecteurs du plan, colinéarité et repérage",
            weight: 50,
            hours: "14h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية"],
            capacitiesAr: ["حساب إحداثيات متجهة ومنتصف قطعة واختبار استقامية متجهتين وعلاقة شال"],
            capacitiesFr: ["Caractériser la colinéarité de deux vecteurs, relation de Chasles et calculs de coordonnées"],
            sampleExerciseFr: [
              "Dans un repère orthonormé (O, i, j), on donne les points A(-2; 3), B(4; 1) et C(1; -2).",
              "1. Calculer les coordonnées des vecteurs AB et AC, puis les distances AB et AC.",
              "2. Déterminer les coordonnées du point D tel que ABCD soit un parallélogramme.",
              "3. Les vecteurs u(2; -3) et v(-4; 6) sont-ils colinéaires ? Justifier."
            ],
            sampleExerciseAr: [
              "في معلم متعامد ممنظم (O, i, j)، نعتبر النقط A(-2; 3) و B(4; 1) و C(1; -2).",
              "1. أحسب إحداثيات المتجهتين AB و AC، ثم المسافتين AB و AC.",
              "2. حدد إحداثيات النقطة D بحيث يكون ABCD متوازي أضلاع.",
              "3. هل المتجهتان u(2; -3) و v(-4; 6) مستقيميتان؟ علل جوابك."
            ]
          }
        ],
        DS2: [
          {
            lessonAr: "عموميات حول الدوال ودراسة التغيرات",
            lessonFr: "Généralités sur les fonctions et variations",
            weight: 55,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["تحديد مجموعة التعريف، جدول التغيرات، المطاريف، والحل المبياني للمعادلات"],
            capacitiesFr: ["Déterminer domaine de définition, variations, extremums et résolutions graphiques f(x)=k et f(x) < g(x)"],
            sampleExerciseFr: [
              "Soit f la fonction définie sur [-4; 4] par sa courbe représentative (Cf).",
              "1. Déterminer les images de -2 et 0, ainsi que les antécédents éventuels de 1 par f.",
              "2. Dresser le tableau de variations complet de f sur [-4; 4].",
              "3. Résoudre graphiquement l'équation f(x) = 0 et l'inéquation f(x) > 2."
            ],
            sampleExerciseAr: [
              "لتكن f الدالة المعرفة على [-4; 4] بمنحناها المبياني (Cf).",
              "1. حدد صورتي -2 و 0، وسوابق 1 الممكنة بالدالة f.",
              "2. ضع جدول التغيرات الكامل للدالة f على المجال [-4; 4].",
              "3. حل مبيانياً المعادلة f(x) = 0 والمتراجحة f(x) > 2."
            ]
          },
          {
            lessonAr: "الدوال المرجعية (الدالة التآلفية، المربع، المقلوب)",
            lessonFr: "Fonctions de référence (carré, inverse, racine)",
            weight: 45,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["خاصيات ودراسة ورسم دوال x ↦ x² و x ↦ 1/x و x ↦ √x"],
            capacitiesFr: ["Maîtriser le sens de variation et les représentations des fonctions carré, inverse et racine carrée"],
            sampleExerciseFr: [
              "1. Déterminer le sens de variation de la fonction g(x) = (x - 2)² + 3 sur [2; +∞[ et sur ]-∞; 2].",
              "2. En déduire le minimum de g sur ℝ et la valeur en laquelle il est atteint.",
              "3. Comparer, sans calculatrice, (-3.1415)² et (-3.142)² en justifiant par la fonction carré."
            ],
            sampleExerciseAr: [
              "1. حدد رتابة الدالة g(x) = (x - 2)² + 3 على المجالين [2; +∞[ و ]-∞; 2].",
              "2. استنتج القيمة الدنوية للدالة g على R والقيمة التي تتحقق عندها.",
              "3. قارن، دون استعمال الآلة الحاسبة، بين (-3.1415)² و (-3.142)² مع التعليل بالدالة مربع."
            ]
          }
        ],
        DS3: [
          {
            lessonAr: "الإحصاء الوصفي والاحتمالات البسيطة",
            lessonFr: "Statistiques descriptives et probabilités élémentaires",
            weight: 50,
            hours: "14h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["المعدل، الوسيط، المدى، الربيعات Q1 و Q3، وشجرة الاحتمالات ومخططات ڤين"],
            capacitiesFr: ["Calculer moyenne, médiane, quartiles Q1 et Q3, diagramme en boîte et arbres de probabilité"],
            sampleExerciseFr: [
              "On lance un dé équilibré à 6 faces. On note A l'événement « obtenir un nombre pair » et B « obtenir un multiple de 3 ».",
              "1. Déterminer P(A), P(B) et P(A ∩ B).",
              "2. En déduire la probabilité de l'événement A ∪ B.",
              "3. Construire un arbre pondéré modélisant le tirage successif de deux jetons avec remise."
            ],
            sampleExerciseAr: [
              "نرمي نرداً نزيهاً ذا 6 أوجه. نعتبر الحدث A «الحصول على عدد زوجي» والحدث B «الحصول على مضاعف للعدد 3».",
              "1. حدد P(A) و P(B) و P(A ∩ B).",
              "2. استنتج احتمال الحدث A ∪ B.",
              "3. أنشئ شجرة احتمالات مرجحة لنمذجة سحب متتابع لبيدقين بالإرجاع."
            ]
          },
          {
            lessonAr: "المعادلات والمتراجحات وخوارزميات بايثون",
            lessonFr: "Équations de droites et algorithmique en Python",
            weight: 50,
            hours: "12h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية","Algebra","جبر"],
            capacitiesAr: ["معادلة مستقيم y = mx + p، التوازي والتقاطع، وكتابة دوال بسيطة بلغة Python"],
            capacitiesFr: ["Déterminer coefficient directeur, ordonnée à l'origine, intersection de droites et scripts Python"],
            sampleExerciseFr: [
              "1. Déterminer l'équation réduite de la droite (AB) avec A(1; 4) et B(-2; -2).",
              "2. Déterminer l'équation de la droite (d) parallèle à (AB) passant par C(0; 3).",
              "3. Écrire une fonction Python `colineaire(x1, y1, x2, y2)` renvoyant True si (x1, y1) et (x2, y2) sont colinéaires."
            ],
            sampleExerciseAr: [
              "1. حدد المعادلة المختصرة للمستقيم (AB) حيث A(1; 4) و B(-2; -2).",
              "2. حدد معادلة المستقيم (d) الموازي لـ (AB) والمار من النقطة C(0; 3).",
              "3. أكتب دالة بلغة بايثون `colineaire(x1, y1, x2, y2)` تُرجع True إذا كانت المتجهتان مستقيميتين."
            ]
          }
        ]
      },
      S2: {
        DS1: [
          { lessonAr: "الهندسة الإقليدية والتحويلات", lessonFr: "Géométrie et configurations du plan", weight: 50, hours: "12h", category: "Geometry", subCategory: "هندسة مستوية", subCategoryFr: "Géométrie plane", tags: ["Geometry","هندسة مستوية"], capacitiesAr: ["المثلثات، مبرهنة فيتاغورس، والدوائر"], capacitiesFr: ["Configurations géométriques usuelles et trigonométrie"] },
          { lessonAr: "دراسة الدوال وتطبيقاتها", lessonFr: "Fonctions et résolutions d'équations", weight: 50, hours: "14h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","تحليل"], capacitiesAr: ["حل المعادلات والمتراجحات باستعمال جدول الإشارة"], capacitiesFr: ["Résoudre des équations et inéquations par tableaux de signes"] }
        ],
        DS2: [
          { lessonAr: "الحساب المثلثي", lessonFr: "Trigonométrie et enroulement de la droite", weight: 50, hours: "12h", category: "Geometry", subCategory: "حساب مثلثي", subCategoryFr: "Trigonométrie", tags: ["Geometry","حساب مثلثي"], capacitiesAr: ["الدائرة المثلثية، الراديان، القيم الاعتيادية لجيب التمام والجيب"], capacitiesFr: ["Cercle trigonométrique, radian et valeurs remarquables de cos et sin"] },
          { lessonAr: "المتجهات والارتباط الخطي في الهندسة", lessonFr: "Vecteurs et alignement dans le plan", weight: 50, hours: "12h", category: "Geometry", subCategory: "هندسة مستوية", subCategoryFr: "Géométrie plane", tags: ["Geometry","هندسة مستوية"], capacitiesAr: ["استقامية النقط وتوازي المستقيمات بواسطة المتجهات"], capacitiesFr: ["Démontrer l'alignement et le parallélisme par le calcul vectoriel"] }
        ],
        DS3: [
          { lessonAr: "الاحتمالات المشروطة وأخذ العينات", lessonFr: "Échantillonnage et simulation probabiliste", weight: 100, hours: "18h", category: "Probabilities", subCategory: "احتمالات وإحصاء", subCategoryFr: "Probabilités & Statistiques", tags: ["Probabilities","احتمالات وإحصاء"], capacitiesAr: ["محاكاة تجربة عشوائية بلغة بايثون وفترات التقلب"], capacitiesFr: ["Simulations de fluctuations d'échantillonnage et intervalles de confiance"] }
        ]
      }
    }
  },

  "1ERE_SPE_FR": {
    code: "1ERE_SPE_FR",
    cycle: "1ERE_SPE",
    cycleAr: "الأولى بكالوريا - تخصص رياضيات (1ère Spécialité)",
    labelAr: "الأولى بكالوريا تخصص رياضيات (1ère Spécialité Mathématiques - AEFE)",
    labelFr: "Première Spécialité Mathématiques (Programme National Français)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    system: "MISSION_FRANCAISE",
    prereqsAr: ["الدوال المرجعية، المتجهات، الحساب الجبري، والإحصاء والاحتمالات (جذع مشترك)"],
    prereqsFr: ["Fonctions de référence, vecteurs, factorisation, géométrie repérée et probabilités"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "ثلاثيات الحدود من الدرجة الثانية",
            lessonFr: "Polynômes du second degré et forme canonique",
            weight: 50,
            hours: "14h",
            category: "Algebra",
            subCategory: "جبر",
            subCategoryFr: "Algèbre",
            tags: ["Algebra","جبر"],
            capacitiesAr: ["الشكل النموذجي، المميز دلتا، جدول الإشارة، وتحديد المطاريف ومسائل الاستمثال"],
            capacitiesFr: ["Écrire la forme canonique, calculer le discriminant Δ, factoriser et étudier le signe d'un trinôme"],
            sampleExerciseFr: [
              "Soit le trinôme P(x) = 2x² - 8x + 6.",
              "1. Déterminer la forme canonique de P(x).",
              "2. Calculer le discriminant Δ, en déduire les racines de P(x) et sa factorisation.",
              "3. Dresser le tableau de signes de P(x) et résoudre l'inéquation P(x) ≤ 0."
            ],
            sampleExerciseAr: [
              "نعتبر ثلاثي الحدود P(x) = 2x² - 8x + 6.",
              "1. حدد الشكل النموذجي للحدودية P(x).",
              "2. أحسب المميز Δ، واستنتج جذري P(x) وتعميلها.",
              "3. ضع جدول إشارة P(x) وحل المتراجحة P(x) ≤ 0."
            ]
          },
          {
            lessonAr: "المتتاليات الحسابية والهندسية",
            lessonFr: "Suites numériques (arithmétiques et géométriques)",
            weight: 50,
            hours: "14h",
            category: "Algebra",
            subCategory: "حسابيات",
            subCategoryFr: "Arithmétique",
            tags: ["Algebra","جبر","حسابيات","Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["الحد العام، الرتابة، مجموع حدود متتابعة، ونمذجة ظواهر التطور"],
            capacitiesFr: ["Calculer le terme général, sens de variation, somme de termes et seuils par algorithme"],
            sampleExerciseFr: [
              "Soit (u_n) la suite arithmétique de premier terme u_0 = 5 et de raison r = 3.",
              "1. Exprimer u_n en fonction de n et calculer u_{20}.",
              "2. Calculer la somme S = u_0 + u_1 + ... + u_{20}.",
              "3. Soit (v_n) la suite définie par v_n = 2 × 3^n. Démontrer que (v_n) est géométrique et préciser sa raison."
            ],
            sampleExerciseAr: [
              "لتكن (u_n) متتالية حسابية حدها الأول u_0 = 5 وأساسها r = 3.",
              "1. عبر عن u_n بدلالة n وأحسب u_{20}.",
              "2. أحسب المجموع S = u_0 + u_1 + ... + u_{20}.",
              "3. لتكن (v_n) المتتالية المعرفة بـ v_n = 2 × 3^n. بين أن (v_n) هندسية وحدد أساسها."
            ]
          }
        ],
        DS2: [
          {
            lessonAr: "الاشتقاق ودراسة التغيرات ومسائل الاستمثال",
            lessonFr: "Dérivation : nombre dérivé, fonction dérivée et tangentes",
            weight: 55,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["حساب المشتقة، معادلة المماس، دراسة الرتابة والمطاريف النسبية والمطلقة"],
            capacitiesFr: ["Calculer f'(a), déterminer l'équation de la tangente y = f'(a)(x-a)+f(a) et relier signe de f' et variations de f"],
            sampleExerciseFr: [
              "Soit f la fonction définie sur ℝ par f(x) = x³ - 3x² + 2.",
              "1. Déterminer la fonction dérivée f' de f.",
              "2. Étudier le signe de f'(x) et dresser le tableau de variations complet de f sur ℝ.",
              "3. Déterminer l'équation réduite de la tangente (T) à la courbe de f au point d'abscisse a = 2."
            ],
            sampleExerciseAr: [
              "نعتبر الدالة f المعرفة على R بـ f(x) = x³ - 3x² + 2.",
              "1. حدد الدالة المشتقة f' للدالة f.",
              "2. أدرس إشارة f'(x) وضع جدول تغيرات الدالة f على R.",
              "3. حدد معادلة المماس (T) لمنحنى f عند النقطة ذات الفاصلة a = 2."
            ]
          },
          {
            lessonAr: "الجداء السلمي وتطبيقاته في المستوى",
            lessonFr: "Produit scalaire dans le plan et trigonométrie",
            weight: 45,
            hours: "12h",
            category: "Geometry",
            subCategory: "هندسة مستوية",
            subCategoryFr: "Géométrie plane",
            tags: ["Geometry","هندسة مستوية","حساب مثلثي"],
            capacitiesAr: ["الصيغة التحليلية، مبرهنة الكاشي، التعامد، ومعادلة الدائرة"],
            capacitiesFr: ["Calculer u·v par coordonnées ou projeté orthogonal, formule d'Al-Kashi et équation cartésienne d'un cercle"],
            sampleExerciseFr: [
              "Soient u(3; -1) et v(2; 4) deux vecteurs dans un repère orthonormé.",
              "1. Calculer le produit scalaire u · v et les normes ||u|| et ||v||.",
              "2. En déduire la valeur exacte de cos(u, v) puis une valeur approchée de l'angle en degrés.",
              "3. Dans un triangle ABC avec AB = 5, AC = 7 et l'angle A = 60°, calculer la longueur BC (Al-Kashi)."
            ],
            sampleExerciseAr: [
              "ليكن u(3; -1) و v(2; 4) متجهتين في معلم متعامد ممنظم.",
              "1. أحسب الجداء السلمي u · v والمنظمين ||u|| و ||v||.",
              "2. استنتج القيمة المضبوطة لـ cos(u, v) ثم قياس الزاوية بالدرجات.",
              "3. في مثلث ABC حيث AB = 5 و AC = 7 والزاوية A = 60°، أحسب المسافة BC باستعمال مبرهنة الكاشي."
            ]
          }
        ],
        DS3: [
          {
            lessonAr: "الاحتمالات المشروطة والمتغيرات العشوائية",
            lessonFr: "Probabilités conditionnelles et variables aléatoires",
            weight: 50,
            hours: "14h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["شجرة الاحتمالات، صيغة الاحتمالات الكلية، P_A(B)، وقانون الاحتمال والأمل E(X) والتباين V(X)"],
            capacitiesFr: ["Arbre pondéré, formule des probabilités totales, P_A(B), loi de probabilité de X, espérance E(X) et variance"],
            sampleExerciseFr: [
              "Une urne contient 4 boules rouges et 6 boules vertes. On tire une boule au hasard, puis une deuxième sans remise.",
              "1. Modéliser la situation par un arbre pondéré.",
              "2. Calculer la probabilité d'obtenir deux boules de même couleur.",
              "3. On gagne 5€ pour chaque boule rouge tirée et on perd 3€ pour chaque boule verte. Soit X le gain algébrique. Déterminer la loi de probabilité de X et son espérance mathématique E(X)."
            ],
            sampleExerciseAr: [
              "يحتوي صندوق على 4 كرات حمراء و 6 كرات خضراء. نسحب كرة عشوائياً، ثم كرة ثانية دون إرجاع.",
              "1. نمذج الوضعية بشجرة احتمالات مرجحة.",
              "2. أحسب احتمال الحصول على كرتين من نفس اللون.",
              "3. نربح 5€ عن كل كرة حمراء مسحوبة ونخسر 3€ عن كل كرة خضراء. ليكن X المتغير العشوائي للربح. حدد قانون احتمال X وأمله الرياضياتي E(X)."
            ]
          },
          {
            lessonAr: "الدالة الأسية وخاصياتها الجبرية",
            lessonFr: "La fonction exponentielle : propriétés et dérivation",
            weight: 50,
            hours: "12h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["علاقة exp(a+b)=exp(a)exp(b)، المشتقة (e^u)'=u'e^u، والدراسة الكاملة للدوال الأسية"],
            capacitiesFr: ["Propriétés algébriques de l'exponentielle, dérivée de exp(u) et résolution d'équations e^x = k"],
            sampleExerciseFr: [
              "1. Simplifier l'expression : A = (e^(2x) × e^(-3)) / e^(x - 1).",
              "2. Résoudre dans ℝ l'équation : e^(2x) - 3e^x + 2 = 0 (on posera X = e^x).",
              "3. Soit g(x) = (2x - 1)e^x. Déterminer la dérivée g'(x) et dresser le tableau de variations de g sur ℝ."
            ],
            sampleExerciseAr: [
              "1. بسط التعبير: A = (e^(2x) × e^(-3)) / e^(x - 1).",
              "2. حل في R المعادلة: e^(2x) - 3e^x + 2 = 0 (بوضع X = e^x).",
              "3. لتكن g(x) = (2x - 1)e^x. حدد المشتقة g'(x) وضع جدول تغيرات الدالة g على R."
            ]
          }
        ]
      },
      S2: {
        DS1: [
          { lessonAr: "الهندسة التحليلية وتطبيقات الجداء السلمي", lessonFr: "Géométrie repérée : cercles et équations de droites", weight: 50, hours: "12h", category: "Geometry", subCategory: "هندسة مستوية", subCategoryFr: "Géométrie plane", tags: ["Geometry","هندسة مستوية"], capacitiesAr: ["المعادلات الديكارتية للدوائر ومسافة نقطة عن مستقيم"], capacitiesFr: ["Équations de cercles, orthogonalité et distance d'un point à une droite"] },
          { lessonAr: "المتتاليات العددية وخوارزميات العتبة في بايثون", lessonFr: "Suites et algorithmes de seuil en Python", weight: 50, hours: "14h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","تحليل","متتاليات عددية"], capacitiesAr: ["البرمجة بلغة بايثون لتحديد رتبة تجاوز عتبة عددية"], capacitiesFr: ["Programmer un algorithme de recherche de seuil en Python pour une suite"] }
        ],
        DS2: [
          { lessonAr: "الحساب المثلثي والمعادلات المثلثية", lessonFr: "Trigonométrie : formules d'addition et de duplication", weight: 50, hours: "12h", category: "Geometry", subCategory: "حساب مثلثي", subCategoryFr: "Trigonométrie", tags: ["Geometry","حساب مثلثي"], capacitiesAr: ["صيغ التحويل وحل المعادلات cos(x)=cos(a) و sin(x)=sin(a)"], capacitiesFr: ["Formules d'addition et duplication, résolution d'équations trigonométriques"] },
          { lessonAr: "الدوال الأسية والنمذجة الرياضية", lessonFr: "Modélisation par la fonction exponentielle", weight: 50, hours: "14h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","تحليل"], capacitiesAr: ["تطبيقات النمو الأسي والاضمحلال الإشعاعي وتبريد نيوتن"], capacitiesFr: ["Modélisation de phénomènes discrets et continus (désintégration, refroidissement)"] }
        ],
        DS3: [
          { lessonAr: "امتحان تركيبي شامل لنهاية السنة (Épreuve Commune)", lessonFr: "Épreuve de synthèse type Première Spécialité", weight: 100, hours: "16h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","Algebra","Geometry","تحليل","جبر","هندسة فضائية"], capacitiesAr: ["توليف الجبر والتحليل والهندسة والاحتمالات"], capacitiesFr: ["Synthèse complète conforme aux épreuves communes du Baccalauréat"] }
        ]
      }
    }
  },

  "TERM_SPE_FR": {
    code: "TERM_SPE_FR",
    cycle: "TERM_SPE",
    cycleAr: "الثانية بكالوريا - تخصص رياضيات (Terminale Spé)",
    labelAr: "الثانية بكالوريا تخصص رياضيات - البكالوريا الفرنسية (Terminale Spécialité - Bac)",
    labelFr: "Terminale Spécialité Mathématiques (Épreuve du Baccalauréat Général)",
    durationAr: "4 ساعات (4h)",
    durationFr: "4 heures",
    dsCount: 3,
    system: "MISSION_FRANCAISE",
    prereqsAr: ["الاشتقاق، المتتاليات، الجداء السلمي، الدوال الأسية، والاحتمالات المشروطة (1ère Spé)"],
    prereqsFr: ["Dérivation, suites numériques, produit scalaire, exponentielle et probabilités"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "التعداد والتحليل التوافقي",
            lessonFr: "Combinatoire et dénombrement",
            weight: 35,
            hours: "10h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["التبديلات، الترتيبات، التأليفات (k parmi n)، مثلث باسكال، وصيغة ثنائي حد نيوتن"],
            capacitiesFr: ["Dénombrer k-uplets, permutations, combinaisons, triangle de Pascal et formule du binôme de Newton"],
            sampleExerciseFr: [
              "Un mot de passe est composé de 4 lettres majuscules distinctes suivies de 3 chiffres distincts.",
              "1. Dénombrer le nombre total de mots de passe possibles.",
              "2. Démontrer par le calcul combinatoire que pour tous entiers 1 ≤ k ≤ n : k × (n parmi k) = n × (n-1 parmi k-1).",
              "3. Développer et simplifier à l'aide de la formule du binôme : (2x - 1)⁴."
            ],
            sampleExerciseAr: [
              "تتكون كلمة سر من 4 حروف كبرى متمايزة متبوعة بـ 3 أرقام متمايزة.",
              "1. أحسب عدد كلمات السر الممكنة إجمالاً.",
              "2. بين حسابياً أنه لكل عددين صحيحين 1 ≤ k ≤ n : k × C_n^k = n × C_{n-1}^{k-1}.",
              "3. أنشر وبسط باستعمال صيغة ثنائي حد نيوتن: (2x - 1)⁴."
            ]
          },
          {
            lessonAr: "نهايات المتتاليات والبرهان بالترجع ومبرهنات التقارب",
            lessonFr: "Suites : récurrence, limites et théorèmes de convergence",
            weight: 65,
            hours: "18h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["البرهان بالترجع، مبرهنة المتتالية الرتيبة والمحدودة، ومبرهنة المقارنة والحصر"],
            capacitiesFr: ["Raisonnement par récurrence, théorème de convergence monotone et théorème des gendarmes"],
            sampleExerciseFr: [
              "Soit la suite (u_n) définie par u_0 = 1 et u_{n+1} = √(2u_n + 3) pour tout n ∈ ℕ.",
              "1. Démontrer par récurrence que pour tout n ∈ ℕ : 0 < u_n < 3.",
              "2. Démontrer que la suite (u_n) est strictement croissante.",
              "3. En déduire que (u_n) converge et déterminer sa limite L."
            ],
            sampleExerciseAr: [
              "نعتبر المتتالية (u_n) المعرفة بـ u_0 = 1 و u_{n+1} = √(2u_n + 3) لكل n من N.",
              "1. برهن بالترجع أنه لكل n من N : 0 < u_n < 3.",
              "2. بين أن المتتالية (u_n) تزايدية قطعا.",
              "3. استنتج أن (u_n) متقاربة وحدد نهايتها L."
            ]
          }
        ],
        DS2: [
          {
            lessonAr: "الاتصال ومبرهنة القيم الوسيطية والتقعر ونقط الانعطاف",
            lessonFr: "Continuité, TVI, convexité et points d'inflexion",
            weight: 50,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["مبرهنة القيم الوسيطية، دراسة إشارة المشتقة الثانية f''، نقط الانعطاف والمماسات"],
            capacitiesFr: ["Appliquer le TVI pour justifier l'unicité d'une solution, convexité via f''(x) et points d'inflexion"],
            sampleExerciseFr: [
              "Soit f la fonction définie sur ℝ par f(x) = (x² - 2x + 1)e^x.",
              "1. Calculer f'(x) et f''(x) pour tout réel x.",
              "2. Étudier la convexité de f sur ℝ et préciser les coordonnées des éventuels points d'inflexion de (Cf).",
              "3. Démontrer que l'équation f(x) = 2 admet une unique solution α sur [0; 2] et donner un encadrement d'amplitude 10⁻²."
            ],
            sampleExerciseAr: [
              "لتكن f الدالة المعرفة على R بـ f(x) = (x² - 2x + 1)e^x.",
              "1. أحسب f'(x) و f''(x) لكل عدد حقيقي x.",
              "2. أدرس تقعر المنحنى (Cf) وحدد إحداثيات نقط الانعطاف الممكنة.",
              "3. بين أن المعادلة f(x) = 2 تقبل حلاً وحيداً α في المجال [0; 2] وأعط تأطيراً له بسعة 10⁻²."
            ]
          },
          {
            lessonAr: "الهندسة الفضائية: المتجهات والمساقط والتمثيل البارامتري",
            lessonFr: "Géométrie dans l'espace : produit scalaire, droites et plans",
            weight: 50,
            hours: "16h",
            category: "Geometry",
            subCategory: "هندسة فضائية",
            subCategoryFr: "Géométrie dans l'espace",
            tags: ["Geometry","هندسة فضائية"],
            capacitiesAr: ["المتجهة المنظمية، المعادلة الديكارتية لمستوى، والتمثيل البارامتري لمستقيم والمسافات"],
            capacitiesFr: ["Vecteur normal à un plan, équation cartésienne ax+by+cz+d=0, représentation paramétrique d'une droite et distances"],
            sampleExerciseFr: [
              "Dans un repère orthonormé de l'espace (O, i, j, k), on considère le plan (P) d'équation 2x - y + 2z - 5 = 0 et le point A(1; 3; -2).",
              "1. Donner un vecteur normal n au plan (P) et calculer la distance de A au plan (P).",
              "2. Déterminer une représentation paramétrique de la droite (d) orthogonale à (P) passant par A.",
              "3. Déterminer les coordonnées du projeté orthogonal H du point A sur le plan (P)."
            ],
            sampleExerciseAr: [
              "في معلم متعامد ممنظم للفضاء، نعتبر المستوى (P) ذي المعادلة 2x - y + 2z - 5 = 0 والنقطة A(1; 3; -2).",
              "1. أعط متجهة منظمية n على المستوى (P) وأحسب مسافة A عن المستوى (P).",
              "2. حدد تمثيلاً بارامترياً للمستقيم (d) العمودي على (P) والمار من A.",
              "3. حدد إحداثيات المسقط العمودي H للنقطة A على المستوى (P)."
            ]
          }
        ],
        DS3: [
          {
            lessonAr: "الدالة اللوغاريتمية النيبيرية والدوال الأسية",
            lessonFr: "Fonction logarithme népérien et croissances comparées",
            weight: 50,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["الخواص الجبرية، النهايات، التزايد المقارن lim x ln(x) و lim ln(x)/x، ودراسة الدوال"],
            capacitiesFr: ["Maîtriser les propriétés de ln, limites par croissances comparées et études complètes de fonctions"],
            sampleExerciseFr: [
              "Soit la fonction h définie sur ]0; +∞[ par h(x) = x - ln(x) - 1.",
              "1. Étudier les variations de h sur ]0; +∞[ et en déduire le signe de h(x).",
              "2. Soit f(x) = (ln(x) + 1) / x. Calculer les limites de f en 0 et en +∞ (croissances comparées).",
              "3. Calculer f'(x) et dresser le tableau de variations de f."
            ],
            sampleExerciseAr: [
              "نعتبر الدالة h المعرفة على ]0; +∞[ بـ h(x) = x - ln(x) - 1.",
              "1. أدرس تغيرات h على ]0; +∞[ واستنتج إشارة h(x).",
              "2. لتكن f(x) = (ln(x) + 1) / x. أحسب نهايتي f عند 0 وعند +∞ (التزايد المقارن).",
              "3. أحسب f'(x) وضع جدول تغيرات الدالة f."
            ]
          },
          {
            lessonAr: "الدوال الأصلية وحساب التكامل والمعادلات التفاضلية",
            lessonFr: "Primitives, calcul intégral, IPP et équations différentielles",
            weight: 50,
            hours: "16h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["المكاملة بالأجزاء، حساب المساحات، وحل المعادلة y'=ay و y'=ay+b"],
            capacitiesFr: ["Calcul d'intégrales par primitives, intégration par parties (IPP), calcul d'aires et résolution de y' = ay + b"],
            sampleExerciseFr: [
              "1. Calculer à l'aide d'une intégration par parties l'intégrale : I = ∫₁ᵉ x ln(x) dx.",
              "2. Résoudre sur ℝ l'équation différentielle (E) : y' + 2y = 4, avec la condition initiale y(0) = 5.",
              "3. Déterminer l'aire du domaine délimité par la courbe (Cf), l'axe des abscisses et les droites x = 1 et x = 2."
            ],
            sampleExerciseAr: [
              "1. أحسب باستعمال المكاملة بالأجزاء التكامل: I = ∫₁ᵉ x ln(x) dx.",
              "2. حل على R المعادلة التفاضلية (E) : y' + 2y = 4، مع الشرط البدئي y(0) = 5.",
              "3. حدد مساحة الحيز المحصور بين المنحنى (Cf) ومحور الأفاصيل والمستقيمين x = 1 و x = 2."
            ]
          }
        ]
      },
      S2: {
        DS1: [
          { lessonAr: "حساب الاحتمالات وقانون الحدانية وقانون الأعداد الكبيرة", lessonFr: "Loi binomiale, schéma de Bernoulli et loi des grands nombres", weight: 50, hours: "16h", category: "Probabilities", subCategory: "احتمالات وإحصاء", subCategoryFr: "Probabilités & Statistiques", tags: ["Probabilities","احتمالات وإحصاء"], capacitiesAr: ["B(n, p)، الأمل n p، التباين n p (1-p)، ومتباينة تشيبيشيف"], capacitiesFr: ["Schéma de Bernoulli, loi binomiale B(n, p), espérance, variance et inégalité de Bienaymé-Tchebychev"] },
          { lessonAr: "الحساب التكاملي المتقدم والقيمة المتوسطة", lessonFr: "Calcul intégral avancé et valeur moyenne", weight: 50, hours: "14h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"], capacitiesAr: ["حساب الحجوم والمساحات المعقدة والقيمة المتوسطة لدالة"], capacitiesFr: ["Applications du calcul intégral, encadrements et valeur moyenne"] }
        ],
        DS2: [
          { lessonAr: "امتحان البكالوريا التجريبي الأول (Bac Blanc N°1)", lessonFr: "Baccalauréat Blanc N°1 (Sujet complet 4 exercices)", weight: 100, hours: "18h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","Algebra","Geometry","تحليل","جبر","هندسة فضائية"], capacitiesAr: ["موضوع متكامل مطابق لمواصفات البكالوريا الفرنسية (تمرين هندسة، متتاليات، دوال، احتمالات)"], capacitiesFr: ["Sujet complet officiel conforme au Baccalauréat Général (Analyse, Suites, Géométrie espace, Probabilités)"] }
        ],
        DS3: [
          { lessonAr: "امتحان البكالوريا التجريبي الثاني (Bac Blanc N°2)", lessonFr: "Baccalauréat Blanc N°2 (Sujet complet 4 exercices)", weight: 100, hours: "18h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","Algebra","Geometry","تحليل","جبر","هندسة فضائية"], capacitiesAr: ["موضوع امتحاني تركيبي نهائي وفق الإطار المرجعي لوزارة التربية الفرنسية"], capacitiesFr: ["Épreuve finale type Baccalauréat avec grille nationale d'évaluation"] }
        ]
      }
    }
  },

  "TERM_EXP_FR": {
    code: "TERM_EXP_FR",
    cycle: "TERM_EXP",
    cycleAr: "الثانية بكالوريا - خيار رياضيات متقدمة (Maths Expertes)",
    labelAr: "الثانية بكالوريا خيار رياضيات متقدمة (Option Mathématiques Expertes - AEFE)",
    labelFr: "Terminale Option Mathématiques Expertes (Nombres complexes, Arithmétique & Graphes)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    system: "MISSION_FRANCAISE",
    prereqsAr: ["مكتسبات تخصص الرياضيات، الحسابيات، والتحليل"],
    prereqsFr: ["Spécialité Mathématiques, calcul littéral et raisonnements abstraits"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "الأعداد العقدية: الجبر والهندسة والجذور النونية",
            lessonFr: "Nombres complexes : trigonométrie, exponentielle et racines n-ièmes",
            weight: 60,
            hours: "18h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Geometry","حساب مثلثي","Algebra","جبر","أعداد عقدية","Calculus","تحليل"],
            capacitiesAr: ["صيغة موافر، صيغتا أولير، الجذور النونية للوحدة، ومعادلات الدرجة 3 و 4"],
            capacitiesFr: ["Formules de Moivre et d'Euler, racines n-ièmes de l'unité, factorisation polynomiale dans C et géométrie"],
            sampleExerciseFr: [
              "1. Déterminer les racines cinquièmes de l'unité sous forme trigonométrique.",
              "2. Résoudre dans ℂ l'équation : z⁴ + 4z² + 16 = 0.",
              "3. Linéariser l'expression cos⁵(x) à l'aide des formules d'Euler."
            ],
            sampleExerciseAr: [
              "1. حدد الجذور الخماسية للوحدة على الشكل المثلثي.",
              "2. حل في C المعادلة: z⁴ + 4z² + 16 = 0.",
              "3. خطط التعبير cos⁵(x) باستعمال صيغتي أولير."
            ]
          },
          {
            lessonAr: "الحسابيات: قابلية القسمة والموافقات",
            lessonFr: "Arithmétique : divisibilité, division euclidienne et congruences",
            weight: 40,
            hours: "14h",
            category: "Algebra",
            subCategory: "حسابيات",
            subCategoryFr: "Arithmétique",
            tags: ["Algebra","جبر","حسابيات"],
            capacitiesAr: ["الموافقات بترديد n، خواص القسمة في Z، وتطبيقات التشفير والتعمية"],
            capacitiesFr: ["Congruences modulo n, critères de divisibilité et chiffrement affine"],
            sampleExerciseFr: [
              "1. Démontrer par récurrence ou par les congruences que pour tout n ∈ ℕ, 3^(2n) - 1 est divisible par 8.",
              "2. Résoudre dans ℤ l'équation de congruence : 5x ≡ 3 [7].",
              "3. Déterminer le reste de la division euclidienne de 2026²⁰²⁷ par 11."
            ],
            sampleExerciseAr: [
              "1. بين بالترجع أو بالموافقات أنه لكل n من N، العدد 3^(2n) - 1 يقبل القسمة على 8.",
              "2. حل في Z معادلة الموافقات: 5x ≡ 3 [7].",
              "3. حدد باقي القسمة الإقليدية للعدد 2026²⁰²⁷ على 11."
            ]
          }
        ],
        DS2: [
          {
            lessonAr: "مبرهنات بوزو وغوص والأعداد الأولية والديوفانتية",
            lessonFr: "Arithmétique avancée : théorèmes de Bézout, Gauss et équations diophantiennes",
            weight: 50,
            hours: "16h",
            category: "Algebra",
            subCategory: "حسابيات",
            subCategoryFr: "Arithmétique",
            tags: ["Algebra","جبر","حسابيات"],
            capacitiesAr: ["خوارزمية إقليدس الموسعة، حل المعادلة ax+by=c في Z²، ومبرهنة فيرما الصغرى وتشفير RSA"],
            capacitiesFr: ["Algorithme d'Euclide étendu, résolution de ax + by = c dans Z², petit théorème de Fermat et système RSA"],
            sampleExerciseFr: [
              "1. Déterminer une solution particulière de l'équation diophantienne : 17x + 23y = 1.",
              "2. En déduire toutes les solutions entières de l'équation 17x + 23y = 5 dans ℤ².",
              "3. Démontrer le petit théorème de Fermat et calculer 7¹⁰⁰ modulo 13."
            ],
            sampleExerciseAr: [
              "1. حدد حلاً خاصاً للمعادلة الديوفانتية: 17x + 23y = 1.",
              "2. استنتج جميع الحلول الصحيحة للمعادلة 17x + 23y = 5 في Z².",
              "3. برهن مبرهنة فيرما الصغرى وأحسب 7¹⁰⁰ بترديد 13."
            ]
          },
          {
            lessonAr: "المصفوفات والعمليات المصفوفية وقوى المصفوفات",
            lessonFr: "Matrices et calcul matriciel",
            weight: 50,
            hours: "16h",
            category: "Algebra",
            subCategory: "مصفوفات ورسوم بيانية",
            subCategoryFr: "Matrices & Graphes",
            tags: ["Algebra","جبر","مصفوفات ورسوم بيانية"],
            capacitiesAr: ["جداء المصفوفات، مصفوفة عكسية، قوى المصفوفة A^n، وحل النظمات الخطية"],
            capacitiesFr: ["Produit matriciel, inverse d'une matrice carrée, calcul de A^n par diagonalisation et systèmes linéaires"],
            sampleExerciseFr: [
              "Soit la matrice A = [[2, 1], [0, 3]].",
              "1. Démontrer par récurrence que pour tout n ≥ 1, A^n = [[2^n, 3^n - 2^n], [0, 3^n]].",
              "2. Déterminer la matrice inverse A⁻¹.",
              "3. Résoudre le système linéaire associé à l'aide de la matrice inverse."
            ],
            sampleExerciseAr: [
              "نعتبر المصفوفة A = [[2, 1], [0, 3]].",
              "1. بين بالترجع أنه لكل n ≥ 1، A^n = [[2^n, 3^n - 2^n], [0, 3^n]].",
              "2. حدد مقلوب المصفوفة A⁻¹.",
              "3. حل النظمة الخطية المرتبطة باستعمال مقلوب المصفوفة."
            ]
          }
        ],
        DS3: [
          {
            lessonAr: "الرسوم البيانية وسلاسل ماركوف ومصفوفات الانتقال",
            lessonFr: "Graphes, chaînes de Markov et matrices de transition",
            weight: 100,
            hours: "18h",
            category: "Algebra",
            subCategory: "مصفوفات ورسوم بيانية",
            subCategoryFr: "Matrices & Graphes",
            tags: ["Algebra","جبر","مصفوفات ورسوم بيانية"],
            capacitiesAr: ["رسم بياني موجه، مصفوفة الانتقال، حالة مستقرة (état stable)، وتوزيع الاحتمال"],
            capacitiesFr: ["Graphes probabilistes, matrice de transition stochastique, état stable π et convergence à long terme"],
            sampleExerciseFr: [
              "Un client d'une banque utilise soit l'application mobile (état A), soit le guichet (état B). D'un mois à l'autre, 80% des utilisateurs de A restent sur A et 20% passent à B. Parmi ceux de B, 40% passent à A et 60% restent sur B.",
              "1. Représenter la situation par un graphe probabiliste et donner la matrice de transition M.",
              "2. Déterminer l'état probabiliste à long terme (état stable π = [x, y]).",
              "3. Interpréter le résultat pour la banque."
            ],
            sampleExerciseAr: [
              "زبون بنك يستعمل إما التطبيق الهاتفي (الوضعية A) أو الشباك البنكي (الوضعية B). من شهر لآخر، 80% من مستعملي A يظلون في A و 20% ينتقلون إلى B. ومن مستعملي B، 40% ينتقلون إلى A و 60% يظلون في B.",
              "1. مثل الوضعية برسم بياني احتمالي وأعط مصفوفة الانتقال M.",
              "2. حدد الوضعية الاحتمالية المستقرة على المدى الطويل (π = [x, y]).",
              "3. أول النتيجة المحصل عليها بالنسبة للبنك."
            ]
          }
        ]
      },
      S2: {
        DS1: [
          { lessonAr: "الأعداد العقدية والتحويلات الهندسية في المستوى", lessonFr: "Nombres complexes et transformations géométriques", weight: 50, hours: "16h", category: "Algebra", subCategory: "أعداد عقدية", subCategoryFr: "Nombres complexes", tags: ["Geometry","هندسة مستوية","Algebra","جبر","أعداد عقدية"], capacitiesAr: ["الكتابة العقدية للإزاحة والتحاكي والدوران والانعكاس"], capacitiesFr: ["Écritures complexes des similitudes directes, rotations et homothéties"] },
          { lessonAr: "الحسابيات ونظرية الأعداد والتشفير", lessonFr: "Cryptographie et arithmétique avancée", weight: 50, hours: "16h", category: "Algebra", subCategory: "حسابيات", subCategoryFr: "Arithmétique", tags: ["Algebra","جبر","حسابيات"], capacitiesAr: ["بروتوكول ديفي-هيلمان، خوارزمية RSA، والمربعات الصغرى"], capacitiesFr: ["Cryptosystèmes à clé publique (RSA, Diffie-Hellman) et résidus quadratiques"] }
        ],
        DS2: [
          { lessonAr: "سلاسل ماركوف وتطبيقات الاستمثال", lessonFr: "Modèles stochastiques et marches aléatoires", weight: 100, hours: "18h", category: "Algebra", subCategory: "مصفوفات ورسوم بيانية", subCategoryFr: "Matrices & Graphes", tags: ["Algebra","جبر","مصفوفات ورسوم بيانية"], capacitiesAr: ["سلاسل ماركوف مع حالات ماصة، زمن العودة، والمصفوفات العشوائية"], capacitiesFr: ["Chaînes de Markov avec états absorbants et marches aléatoires"] }
        ],
        DS3: [
          { lessonAr: "امتحان تركيبي شامل لخيار الرياضيات المتقدمة", lessonFr: "Épreuve de synthèse Terminale Maths Expertes", weight: 100, hours: "18h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","Algebra","Geometry","تحليل","جبر","هندسة فضائية"], capacitiesAr: ["موضوع امتحاني تركيبي يجمع الأعداد العقدية، الحسابيات، والمصفوفات"], capacitiesFr: ["Épreuve complète de synthèse (Complexes, Arithmétique, Graphes et Matrices)"] }
        ]
      }
    }
  },

  "TERM_COMPL_FR": {
    code: "TERM_COMPL_FR",
    cycle: "TERM_COMPL",
    cycleAr: "الثانية بكالوريا - خيار رياضيات تكميلية (Maths Complémentaires)",
    labelAr: "الثانية بكالوريا خيار رياضيات تكميلية (Option Mathématiques Complémentaires - AEFE)",
    labelFr: "Terminale Option Mathématiques Complémentaires (Modèles, Stats & Probas)",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    dsCount: 3,
    system: "MISSION_FRANCAISE",
    prereqsAr: ["الدوال، المتتاليات، والإحصاء (سلك الأولى بكالوريا)"],
    prereqsFr: ["Fonctions usuelles, suites arithmétiques/géométriques et statistiques"],
    semesters: {
      S1: {
        DS1: [
          {
            lessonAr: "المتتاليات والظواهر التطورية والتطبيقات المالية",
            lessonFr: "Suites numériques, modèles discrets et applications financières",
            weight: 50,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل","متتاليات عددية"],
            capacitiesAr: ["المتتاليات الحسابية والهندسية، الفائدة المركبة، والاستهلاك التناقصي"],
            capacitiesFr: ["Modélisation discrète par suites, intérêts simples et composés, amortissements"],
            sampleExerciseFr: [
              "Un capital de 10 000 € est placé à un taux d'intérêt annuel composé de 3%. On verse 500 € supplémentaires chaque fin d'année.",
              "1. Modéliser le capital disponible C_n au bout de n années par une relation de récurrence.",
              "2. Soit u_n = C_n + 500/0.03. Démontrer que (u_n) est une suite géométrique.",
              "3. En déduire l'expression de C_n en fonction de n et le montant au bout de 10 ans."
            ],
            sampleExerciseAr: [
              "يتم استثمار رأسمال قدره 10000 € بفائدة سنوية مركبة قدرها 3%. ويتم إيداع 500 € إضافية في نهاية كل سنة.",
              "1. نمذج الرأسمال المتوفر C_n بعد n سنة بعلاقة ترجعية.",
              "2. لتكن u_n = C_n + 500/0.03. بين أن (u_n) متتالية هندسية.",
              "3. استنتج تعبير C_n بدلالة n والمبلغ المحصل بعد 10 سنوات."
            ]
          },
          {
            lessonAr: "دوال النمو الأسي واللوغاريتمي",
            lessonFr: "Fonctions exponentielles et logarithmiques pour les sciences",
            weight: 50,
            hours: "14h",
            category: "Calculus",
            subCategory: "تحليل",
            subCategoryFr: "Analyse",
            tags: ["Calculus","تحليل"],
            capacitiesAr: ["تطبيقات النمو الديمغرافي، زمن التضاعف، واللوغاريتم العشري"],
            capacitiesFr: ["Modèles exponentiels, temps de doublement, demi-vie et logarithme décimal"],
            sampleExerciseFr: [
              "Une population de bactéries double toutes les 3 heures. Initialement, il y a 1000 bactéries.",
              "1. Exprimer le nombre de bactéries N(t) en fonction du temps t (en heures).",
              "2. Au bout de combien d'heures la population dépassera-t-elle 1 000 000 d'individus ? (Résoudre à l'aide du logarithme népérien).",
              "3. Déterminer la vitesse de croissance instantanée N'(t) à t = 6h."
            ],
            sampleExerciseAr: [
              "تتضاعف ساكنة بكتيرية كل 3 ساعات. في البداية، يوجد 1000 بكتيريا.",
              "1. عبر عن عدد البكتيريا N(t) بدلالة الزمن t (بالساعات).",
              "2. بعد كم ساعة سيتجاوز عدد الساكنة 1000000 فرد؟ (حل باستعمال اللوغاريتم النيبيري).",
              "3. حدد سرعة النمو اللحظية N'(t) عند اللحظة t = 6h."
            ]
          }
        ],
        DS2: [
          {
            lessonAr: "الاشتقاق والدوال الأصلية وتطبيقاتها الاقتصادية والبيولوجية",
            lessonFr: "Dérivation, primitives et applications économiques et biologiques",
            weight: 50,
            hours: "14h",
            category: "Algebra",
            subCategory: "منطق ومجموعات",
            subCategoryFr: "Logique & Ensembles",
            tags: ["Algebra","جبر","منطق ومجموعات","Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"],
            capacitiesAr: ["الكلفة الكلية، الكلفة الهامشية، الكلفة المتوسطة، والربح الأقصى"],
            capacitiesFr: ["Coût total, coût marginal, coût moyen et recherche du bénéfice maximal"],
            sampleExerciseFr: [
              "Une entreprise produit q tonnes d'un produit (0 ≤ q ≤ 20). Le coût total est C(q) = q³ - 12q² + 60q + 50. Chaque tonne est vendue 45 k€.",
              "1. Exprimer la recette R(q) et le bénéfice B(q) = R(q) - C(q).",
              "2. Calculer B'(q) et déterminer la quantité q maximisant le bénéfice de l'entreprise.",
              "3. Calculer le bénéfice maximal correspondant."
            ],
            sampleExerciseAr: [
              "تنتج شركة q أطنان من منتوج معين (0 ≤ q ≤ 20). الكلفة الكلية هي C(q) = q³ - 12q² + 60q + 50. يباع كل طن بـ 45 ألف درهم.",
              "1. عبر عن المداخيل R(q) والربح B(q) = R(q) - C(q).",
              "2. أحسب B'(q) وحدد الكمية q التي تمنح أقصى ربح للشركة.",
              "3. أحسب هذا الربح الأقصى."
            ]
          },
          {
            lessonAr: "الإحصاء بمتغيرين والتعديل الخطي بالمربعات الصغرى",
            lessonFr: "Statistiques à deux variables et ajustement affine",
            weight: 50,
            hours: "14h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["سحابة النقط، النقطة المتوسطة G، معادلة مستقيم التعديل الخطي (الانحدار) y = ax + b، والتنبؤ"],
            capacitiesFr: ["Nuage de points, point moyen G, droite d'ajustement affine par moindres carrés et prévisions"],
            sampleExerciseFr: [
              "On relève le chiffre d'affaires y_i (en k€) d'une société en fonction du rang de l'année x_i (de 1 à 6).",
              "1. Déterminer les coordonnées du point moyen G(x̄, ȳ) du nuage.",
              "2. Donner l'équation de la droite d'ajustement affine de y en x par la méthode des moindres carrés.",
              "3. Estimer le chiffre d'affaires attendu pour l'année de rang 8."
            ],
            sampleExerciseAr: [
              "نسجل رقم معاملات شركة y_i (بآلاف الدراهم) بدلالة رتبة السنة x_i (من 1 إلى 6).",
              "1. حدد إحداثيات النقطة المتوسطة G(x̄, ȳ) لسحابة النقط.",
              "2. أعط معادلة مستقيم التعديل الخطي لـ y بدلالة x بطريقة المربعات الصغرى.",
              "3. قدر رقم المعاملات المتوقع لسنة الرتبة 8."
            ]
          }
        ],
        DS3: [
          {
            lessonAr: "الاحتمالات وقوانين الكثافة والتوزيع الطبيعي",
            lessonFr: "Lois à densité, loi uniforme et loi normale",
            weight: 100,
            hours: "18h",
            category: "Probabilities",
            subCategory: "احتمالات وإحصاء",
            subCategoryFr: "Probabilités & Statistiques",
            tags: ["Probabilities","احتمالات وإحصاء"],
            capacitiesAr: ["الدالة الكثافة، قانون التوزيع المنتظم U([a,b])، والتوزيع الطبيعي N(μ, σ²) وحساب الاحتمالات بالحاسبة"],
            capacitiesFr: ["Loi uniforme, loi normale N(μ, σ²), calculs de P(X ≤ k) et intervalles de confiance"],
            sampleExerciseFr: [
              "La durée de vie d'un composant électronique suit la loi normale de moyenne μ = 500 heures et d'écart-type σ = 40 heures.",
              "1. Calculer la probabilité qu'un composant dure moins de 450 heures.",
              "2. Calculer P(460 ≤ X ≤ 540).",
              "3. Déterminer la durée de vie t telle que 95% des composants dépassent cette durée."
            ],
            sampleExerciseAr: [
              "تتبع مدة صلاحية مركب إلكتروني توزيعاً طبيعياً بمعدل μ = 500 ساعة وانحراف طرازي (معياري) σ = 40 ساعة.",
              "1. أحسب احتمال أن يشتغل المركب لأقل من 450 ساعة.",
              "2. أحسب P(460 ≤ X ≤ 540).",
              "3. حدد المدة t بحيث تتجاوز 95% من المركبات هذه المدة."
            ]
          }
        ]
      },
      S2: {
        DS1: [
          { lessonAr: "المعادلات التفاضلية والنمذجة المستمرة", lessonFr: "Équations différentielles et modèles de croissance", weight: 50, hours: "14h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"], capacitiesAr: ["حل المعادلات y'=ay وحساب المقادير الأسية"], capacitiesFr: ["Résoudre des équations différentielles linéaires d'ordre 1 et interpréter les solutions"] },
          { lessonAr: "الحساب التكاملي والقيمة المتوسطة", lessonFr: "Intégrales et valeurs moyennes en économie", weight: 50, hours: "14h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","تحليل","حساب تكاملي ومعادلات تفاضلية"], capacitiesAr: ["حساب الفائض الاستهلاكي وفائض المنتج بواسطة التكامل"], capacitiesFr: ["Calcul du surplus du consommateur et du producteur par intégration"] }
        ],
        DS2: [
          { lessonAr: "الاختبارات الإحصائية ومجالات الثقة", lessonFr: "Tests statistiques et intervalles de confiance", weight: 100, hours: "18h", category: "Probabilities", subCategory: "احتمالات وإحصاء", subCategoryFr: "Probabilités & Statistiques", tags: ["Probabilities","احتمالات وإحصاء"], capacitiesAr: ["مجال الثقة لنسبة مئوية، عينات الاستطلاع، واتخاذ القرار"], capacitiesFr: ["Intervalles de confiance pour une proportion et prise de décision"] }
        ],
        DS3: [
          { lessonAr: "امتحان تركيبي شامل للرياضيات التكميلية", lessonFr: "Épreuve de synthèse Terminale Maths Complémentaires", weight: 100, hours: "18h", category: "Calculus", subCategory: "تحليل", subCategoryFr: "Analyse", tags: ["Calculus","Algebra","Geometry","تحليل","جبر","هندسة فضائية"], capacitiesAr: ["توليف المسائل الاقتصادية والبيولوجية والإحصائية"], capacitiesFr: ["Épreuve de synthèse générale axée sur les applications scientifiques et économiques"] }
        ]
      }
    }
  }
};

// =============================================================================
// توحيد وتطابق مسميات ورموز مسالك البكالوريا المغربية
// مسلك 1bac sh هو الأولى باك آداب وعلوم إنسانية، ويرمز له في بعض المؤسسات بـ 1bac lsh
// =============================================================================
if (CURRICULUM_DB["1BAC_LSH"]) {
  CURRICULUM_DB["1BAC_SH"] = CURRICULUM_DB["1BAC_LSH"];
  CURRICULUM_DB["1BAC_LETTRES"] = CURRICULUM_DB["1BAC_LSH"];
  CURRICULUM_DB["1BAC_L"] = CURRICULUM_DB["1BAC_LSH"];
}
if (CURRICULUM_DB["1BAC_SE"]) {
  CURRICULUM_DB["1BAC_SX"] = CURRICULUM_DB["1BAC_SE"];
  CURRICULUM_DB["1BAC_EXP"] = CURRICULUM_DB["1BAC_SE"];
}
if (CURRICULUM_DB["2BAC_LETTRES"]) {
  CURRICULUM_DB["2BAC_LSH"] = {
    ...CURRICULUM_DB["2BAC_LETTRES"],
    code: "2BAC_LSH",
    labelAr: "الثانية بكالوريا - مسلكا الآداب والعلوم الإنسانية (2Bac SH / 2Bac LSH)",
    labelFr: "2ème Bac Lettres et Sciences Humaines (2Bac SH / 2Bac LSH)",
  };
  CURRICULUM_DB["2BAC_SH"] = CURRICULUM_DB["2BAC_LSH"];
  CURRICULUM_DB["2BAC_L"] = CURRICULUM_DB["2BAC_LSH"];
}

// =============================================================================
// تطوير إنتاج التقويمات التشخيصية وفق المنهاج المغربي
// (المذكرة الوزارية المنظمة لأسبوع التقويم التشخيصي والدعم الاستدراكي)
// =============================================================================

export interface MoroccanDiagnosticItem {
  id: string;
  num: number;
  domainAr: string;
  domainFr: string;
  prereqAr: string;
  prereqFr: string;
  questionAr: string;
  questionFr: string;
  optionsAr: string[];
  optionsFr: string[];
  correctAnswerAr: string;
  correctAnswerFr: string;
  justificationAr: string;
  justificationFr: string;
  points: number;
  remediationAr: string;
  remediationFr: string;
}

export interface MoroccanDiagnosticTest {
  titleAr: string;
  titleFr: string;
  subtitleAr: string;
  subtitleFr: string;
  instructionsAr: string[];
  instructionsFr: string[];
  totalPoints: number;
  domains: Array<{
    nameAr: string;
    nameFr: string;
    points: number;
    items: MoroccanDiagnosticItem[];
  }>;
  masteryScale: {
    mastered: { labelAr: string; labelFr: string; threshold: string };
    partial: { labelAr: string; labelFr: string; threshold: string };
    critical: { labelAr: string; labelFr: string; threshold: string };
  };
  remediationPlan: Array<{
    domainAr: string;
    domainFr: string;
    commonObstacleAr: string;
    commonObstacleFr: string;
    pedagogicalActionAr: string;
    pedagogicalActionFr: string;
    duration: string;
  }>;
}

export function generateMoroccanDiagnosticTest(
  track: TrackData,
  model: "A" | "B" = "A",
  cycle: CycleType = "2BAC"
): MoroccanDiagnosticTest {
  const isModelA = model === "A";

  const domain1Items: MoroccanDiagnosticItem[] = [
    {
      id: "diag_q1",
      num: 1,
      domainAr: "التحليل، حساب النهايات والدوال العددية",
      domainFr: "Analyse, calcul de limites & fonctions",
      prereqAr: "حساب النهايات وإزالة الأشكال غير المحددة (0/0 و ∞/∞)",
      prereqFr: "Calcul de limites et levée des formes indéterminées",
      questionAr: isModelA
        ? "قيمة النهاية: lim_{x→2} (x² - 4)/(x - 2) تساوي:"
        : "قيمة النهاية: lim_{x→3} (x² - 9)/(x - 3) تساوي:",
      questionFr: isModelA
        ? "La valeur de la limite lim_{x→2} (x² - 4)/(x - 2) est :"
        : "La valeur de la limite lim_{x→3} (x² - 9)/(x - 3) est :",
      optionsAr: isModelA
        ? ["أ) 0", "ب) 4", "ج) 2", "د) غير معرفة (+∞)"]
        : ["أ) 0", "ب) 6", "ج) 3", "د) غير معرفة (+∞)"],
      optionsFr: isModelA
        ? ["A) 0", "B) 4", "C) 2", "D) Indéterminée (+∞)"]
        : ["A) 0", "B) 6", "C) 3", "D) Indéterminée (+∞)"],
      correctAnswerAr: isModelA ? "ب) 4" : "ب) 6",
      correctAnswerFr: isModelA ? "B) 4" : "B) 6",
      justificationAr: isModelA
        ? "بالتعميل بالمتطابقة الهامة (x - 2)(x + 2) والاختزال بـ (x - 2) نجد lim (x + 2) = 4."
        : "بالتعميل بـ (x - 3)(x + 3) والاختزال بـ (x - 3) نجد lim (x + 3) = 6.",
      justificationFr: isModelA
        ? "Par factorisation (x - 2)(x + 2) puis simplification par (x - 2) ≠ 0 : lim (x + 2) = 4."
        : "Par factorisation (x - 3)(x + 3) puis simplification par (x - 3) ≠ 0 : lim (x + 3) = 6.",
      points: 1.5,
      remediationAr: "مراجعة تقنيات التعميل بالمتطابقات الهامة والضرب في المرافق لإزالة الأشكال غير المحددة.",
      remediationFr: "Révision des identités remarquables et de la multiplication par l'expression conjuguée.",
    },
    {
      id: "diag_q2",
      num: 2,
      domainAr: "التحليل، حساب النهايات والدوال العددية",
      domainFr: "Analyse, calcul de limites & fonctions",
      prereqAr: "حساب المشتقة وتحديد إشارة f'(x) ورتابة الدالة",
      prereqFr: "Dérivation et lien entre signe de f' et variations de f",
      questionAr: isModelA
        ? "مشتقة الدالة f(x) = (2x + 1)/(x - 1) لكل x ≠ 1 هي:"
        : "مشتقة الدالة f(x) = (3x + 2)/(x - 1) لكل x ≠ 1 هي:",
      questionFr: isModelA
        ? "La dérivée de la fonction f(x) = (2x + 1)/(x - 1) sur ℝ\\{1} est :"
        : "La dérivée de la fonction f(x) = (3x + 2)/(x - 1) sur ℝ\\{1} est :",
      optionsAr: isModelA
        ? ["أ) f'(x) = -3/(x - 1)²", "ب) f'(x) = 3/(x - 1)²", "ج) f'(x) = 1/(x - 1)²", "د) f'(x) = 2"]
        : ["أ) f'(x) = -5/(x - 1)²", "ب) f'(x) = 5/(x - 1)²", "ج) f'(x) = 1/(x - 1)²", "د) f'(x) = 3"],
      optionsFr: isModelA
        ? ["A) f'(x) = -3/(x - 1)²", "B) f'(x) = 3/(x - 1)²", "C) f'(x) = 1/(x - 1)²", "D) f'(x) = 2"]
        : ["A) f'(x) = -5/(x - 1)²", "B) f'(x) = 5/(x - 1)²", "C) f'(x) = 1/(x - 1)²", "D) f'(x) = 3"],
      correctAnswerAr: isModelA ? "أ) f'(x) = -3/(x - 1)²" : "أ) f'(x) = -5/(x - 1)²",
      correctAnswerFr: isModelA ? "A) f'(x) = -3/(x - 1)²" : "A) f'(x) = -5/(x - 1)²",
      justificationAr: isModelA
        ? "باستعمال مشتقة خارج دالتين (u'v - uv')/v² نجد: (2(x-1) - 1(2x+1))/(x-1)² = -3/(x-1)²."
        : "باستعمال مشتقة خارج دالتين (u'v - uv')/v² نجد: (3(x-1) - 1(3x+2))/(x-1)² = -5/(x-1)².",
      justificationFr: isModelA
        ? "Formule (u/v)' = (u'v - uv')/v² : (2(x - 1) - (2x + 1))/(x - 1)² = -3/(x - 1)²."
        : "Formule (u/v)' = (u'v - uv')/v² : (3(x - 1) - (3x + 2))/(x - 1)² = -5/(x - 1)².",
      points: 1.5,
      remediationAr: "تثبيت قواعد اشتقاق العمليات على الدوال وخاصة دالة كسرية وخارج دالتين.",
      remediationFr: "Consolidation des formules usuelles de dérivation des quotients et composées.",
    },
    {
      id: "diag_q3",
      num: 3,
      domainAr: "التحليل، حساب النهايات والدوال العددية",
      domainFr: "Analyse, calcul de limites & fonctions",
      prereqAr: "التأويل الهندسي للنهايات والمستقيمات المقاربة",
      prereqFr: "Interprétation graphique des limites et asymptotes",
      questionAr: "إذا كانت lim_{x→+∞} [f(x) - (2x + 1)] = 0، فإن المنحنى (C_f) يقبل بجوار +∞:",
      questionFr: "Si lim_{x→+∞} [f(x) - (2x + 1)] = 0, alors la courbe (C_f) admet au voisinage de +∞ :",
      optionsAr: [
        "أ) مقارباً مائلاً معادلته y = 2x + 1",
        "ب) مقارباً أفقياً معادلته y = 2",
        "ج) مقارباً عمودياً معادلته x = 1",
        "د) فرعاً شلجمياً في اتجاه محور الأراتيب",
      ],
      optionsFr: [
        "A) Une asymptote oblique d'équation y = 2x + 1",
        "B) Une asymptote horizontale d'équation y = 2",
        "C) Une asymptote verticale d'équation x = 1",
        "D) Une branche parabolique de direction (Oy)",
      ],
      correctAnswerAr: "أ) مقارباً مائلاً معادلته y = 2x + 1",
      correctAnswerFr: "A) Une asymptote oblique d'équation y = 2x + 1",
      justificationAr: "حسب التعريف الرسمي، إذا كان lim_{x→±∞} [f(x) - (ax + b)] = 0 فإن y = ax + b مقارب مائل.",
      justificationFr: "Par définition, lim [f(x) - (ax + b)] = 0 caractérise l'asymptote oblique y = ax + b.",
      points: 2.0,
      remediationAr: "إعادة بناء شجرة الفروع اللانهائية والمقاربات والتأويلات الهندسية.",
      remediationFr: "Schématisation de l'arbre des branches infinies et interprétation géométrique.",
    },
  ];

  const domain2Items: MoroccanDiagnosticItem[] = [
    {
      id: "diag_q4",
      num: 4,
      domainAr: "الجبر، المعادلات، المتراجحات والنظمات",
      domainFr: "Algèbre, équations, inéquations & systèmes",
      prereqAr: "حل معادلة من الدرجة الثانية بإشارة مميز ثلاثية الحدود Δ",
      prereqFr: "Résolution d'équation du second degré par le discriminant Δ",
      questionAr: isModelA
        ? "حلول المعادلة x² - 5x + 6 = 0 في المجموعة R هي:"
        : "حلول المعادلة x² - 7x + 12 = 0 في المجموعة R هي:",
      questionFr: isModelA
        ? "Les solutions dans ℝ de l'équation x² - 5x + 6 = 0 sont :"
        : "Les solutions dans ℝ de l'équation x² - 7x + 12 = 0 sont :",
      optionsAr: isModelA
        ? ["أ) S = {2, 3}", "ب) S = {-2, -3}", "ج) S = {1, 6}", "د) S = ∅"]
        : ["أ) S = {3, 4}", "ب) S = {-3, -4}", "ج) S = {2, 6}", "د) S = ∅"],
      optionsFr: isModelA
        ? ["A) S = {2, 3}", "B) S = {-2, -3}", "C) S = {1, 6}", "D) S = ∅"]
        : ["A) S = {3, 4}", "B) S = {-3, -4}", "C) S = {2, 6}", "D) S = ∅"],
      correctAnswerAr: isModelA ? "أ) S = {2, 3}" : "أ) S = {3, 4}",
      correctAnswerFr: isModelA ? "A) S = {2, 3}" : "A) S = {3, 4}",
      justificationAr: isModelA
        ? "المميز Δ = 25 - 24 = 1 > 0، والحلان هما (5 ± 1)/2 أي 2 و 3."
        : "المميز Δ = 49 - 48 = 1 > 0، والحلان هما (7 ± 1)/2 أي 3 و 4.",
      justificationFr: isModelA
        ? "Discriminant Δ = 25 - 24 = 1 > 0, d'où x = (5 ± 1)/2, soit S = {2, 3}."
        : "Discriminant Δ = 49 - 48 = 1 > 0, d'où x = (7 ± 1)/2, soit S = {3, 4}.",
      points: 2.5,
      remediationAr: "دعم مهارة حساب المميز واستنتاج جدول إشارة ثلاثية الحدود ax² + bx + c.",
      remediationFr: "Entraînement sur le calcul du discriminant et le tableau de signes du trinôme.",
    },
    {
      id: "diag_q5",
      num: 5,
      domainAr: "الجبر، المعادلات، المتراجحات والنظمات",
      domainFr: "Algèbre, équations, inéquations & systèmes",
      prereqAr: "حل نظمة خطية من معادلتين بمجهولين باستعمال المحددات أو التعويض",
      prereqFr: "Résolution de systèmes linéaires 2x2 par déterminant ou substitution",
      questionAr: isModelA
        ? "حل النظمة { 2x + y = 7 ; x - y = 2 } في R² هو الزوج (x, y):"
        : "حل النظمة { 3x + y = 10 ; x - y = 2 } في R² هو الزوج (x, y):",
      questionFr: isModelA
        ? "La solution dans ℝ² du système { 2x + y = 7 ; x - y = 2 } est le couple (x, y) :"
        : "La solution dans ℝ² du système { 3x + y = 10 ; x - y = 2 } est le couple (x, y) :",
      optionsAr: isModelA
        ? ["أ) (3, 1)", "ب) (2, 3)", "ج) (4, -1)", "د) (1, 5)"]
        : ["أ) (3, 1)", "ب) (4, 2)", "ج) (2, 4)", "د) (1, 7)"],
      optionsFr: isModelA
        ? ["A) (3, 1)", "B) (2, 3)", "C) (4, -1)", "D) (1, 5)"]
        : ["A) (3, 1)", "B) (4, 2)", "C) (2, 4)", "D) (1, 7)"],
      correctAnswerAr: isModelA ? "أ) (3, 1)" : "أ) (3, 1)",
      correctAnswerFr: isModelA ? "A) (3, 1)" : "A) (3, 1)",
      justificationAr: isModelA
        ? "بجمع المعادلتين طرفاً لطرف: 3x = 9 أي x = 3، ثم بتعويض x = 3 نجد y = 1."
        : "بجمع المعادلتين طرفاً لطرف: 4x = 12 أي x = 3، ثم بالتعويض نجد y = 1.",
      justificationFr: isModelA
        ? "Par addition membre à membre : 3x = 9 ⇒ x = 3, puis y = x - 2 = 1."
        : "Par addition membre à membre : 4x = 12 ⇒ x = 3, puis y = x - 2 = 1.",
      points: 2.5,
      remediationAr: "ترسيخ طريقة التأليفة الخطية والمحددات لحل النظمات الخطية والمسائل الحياتية المرتبطة.",
      remediationFr: "Consolidation de la méthode de combinaison linéaire et résolution matricielle.",
    },
  ];

  const domain3Items: MoroccanDiagnosticItem[] = [
    {
      id: "diag_q6",
      num: 6,
      domainAr: "الهندسة، المتجهات، الجداء السلمي وحساب المثلثات",
      domainFr: "Géométrie, vecteurs, produit scalaire & trigonométrie",
      prereqAr: "حساب الجداء السلمي لمتجهتين وشرط التعامد",
      prereqFr: "Produit scalaire et critère d'orthogonalité de deux vecteurs",
      questionAr: "في معلم متعامد ممنظم، إذا كان u⃗(2, -3) و v⃗(6, k) متجهتين متعامدتين، فإن قيمة k هي:",
      questionFr: "Dans un repère orthonormé, si u⃗(2, -3) et v⃗(6, k) sont orthogonaux, alors k vaut :",
      optionsAr: ["أ) 4", "ب) -4", "ج) 0", "د) 6"],
      optionsFr: ["A) 4", "B) -4", "C) 0", "D) 6"],
      correctAnswerAr: "أ) 4",
      correctAnswerFr: "A) 4",
      justificationAr: "u⃗ ⊥ v⃗ ⇔ u⃗ · v⃗ = 0 ⇔ 2(6) + (-3)(k) = 0 ⇔ 12 - 3k = 0 ⇔ k = 4.",
      justificationFr: "u⃗ ⊥ v⃗ ⇔ u⃗ · v⃗ = 0 ⇔ 2×6 + (-3)×k = 0 ⇔ 12 - 3k = 0 ⇔ k = 4.",
      points: 2.5,
      remediationAr: "تذكير بالصيغ التحليلية للجداء السلمي وتوظيفها في إثبات التعامد ومسافة نقطة عن مستقيم.",
      remediationFr: "Rappels sur l'expression analytique du produit scalaire et l'orthogonalité.",
    },
    {
      id: "diag_q7",
      num: 7,
      domainAr: "الهندسة، المتجهات، الجداء السلمي وحساب المثلثات",
      domainFr: "Géométrie, vecteurs, produit scalaire & trigonométrie",
      prereqAr: "الدائرة المثلثية والمعادلات المثلثية الأساسية",
      prereqFr: "Cercle trigonométrique et équations trigonométriques usuelles",
      questionAr: "حلول المعادلة cos(x) = 1/2 على المجال [-π, π] هي:",
      questionFr: "Les solutions dans [-π, π] de l'équation cos(x) = 1/2 sont :",
      optionsAr: ["أ) S = {-π/3, π/3}", "ب) S = {-π/6, π/6}", "ج) S = {π/3, 2π/3}", "د) S = {π/4}"],
      optionsFr: ["A) S = {-π/3, π/3}", "B) S = {-π/6, π/6}", "C) S = {π/3, 2π/3}", "D) S = {π/4}"],
      correctAnswerAr: "أ) S = {-π/3, π/3}",
      correctAnswerFr: "A) S = {-π/3, π/3}",
      justificationAr: "بما أن cos(π/3) = 1/2 والدالة زوجية فإن الحلين هما π/3 و -π/3 على المجال المحدد.",
      justificationFr: "Puisque cos(π/3) = 1/2 et cos(-x) = cos(x), les solutions sur [-π, π] sont ±π/3.",
      points: 2.5,
      remediationAr: "استحضار قيم الزوايا الاعتيادية على الدائرة المثلثية (0, π/6, π/4, π/3, π/2).",
      remediationFr: "Entraînement sur la lecture du cercle trigonométrique et valeurs remarquables.",
    },
  ];

  const domain4Items: MoroccanDiagnosticItem[] = [
    {
      id: "diag_q8",
      num: 8,
      domainAr: "الإحصاء، الاحتمالات والحسابيات",
      domainFr: "Statistiques, probabilités & arithmétique",
      prereqAr: "حساب الاحتمال المنتظم والحدث المضاد",
      prereqFr: "Probabilité d'équiprobabilité et événement contraire",
      questionAr: "يحتوي كيس على 3 كرات بيضاء و 5 كرات سوداء لا يمكن التمييز بينها باللمس. نسحب عشوائياً كرة واحدة. احتمال الحصول على كرة بيضاء هو:",
      questionFr: "Une urne contient 3 boules blanches et 5 boules noires indiscernables. On tire au hasard une boule. La probabilité d'obtenir une boule blanche est :",
      optionsAr: ["أ) 3/8", "ب) 5/8", "ج) 3/5", "د) 1/3"],
      optionsFr: ["A) 3/8", "B) 5/8", "C) 3/5", "D) 1/3"],
      correctAnswerAr: "أ) 3/8",
      correctAnswerFr: "A) 3/8",
      justificationAr: "العدد الإجمالي للكرات 3 + 5 = 8، وعدد الحالات الملائمة 3، إذن P = 3/8.",
      justificationFr: "Nombre total d'issues 3 + 5 = 8, issues favorables = 3, donc P = 3/8.",
      points: 2.0,
      remediationAr: "دعم مفاهيم فضاء العينة والاحتمال المنتظم وتطبيق قانون الحدث المضاد.",
      remediationFr: "Rappels sur l'univers équiprobable et les calculs de fractions élémentaires.",
    },
    {
      id: "diag_q9",
      num: 9,
      domainAr: "الإحصاء، الاحتمالات والحسابيات",
      domainFr: "Statistiques, probabilités & arithmétique",
      prereqAr: "المؤشرات الإحصائية (المعدل الحسابي x̄ والانحراف المعياري)",
      prereqFr: "Indicateurs statistiques (moyenne pondérée et variance)",
      questionAr: isModelA
        ? "المعدل الحسابي للقيم: 10 و 12 و 14 و 16 و 18 هو:"
        : "المعدل الحسابي للقيم: 8 و 10 و 12 و 14 و 16 هو:",
      questionFr: isModelA
        ? "La moyenne arithmétique des valeurs : 10, 12, 14, 16 et 18 est :"
        : "La moyenne arithmétique des valeurs : 8, 10, 12, 14 et 16 est :",
      optionsAr: isModelA
        ? ["أ) 14", "ب) 15", "ج) 12", "د) 16"]
        : ["أ) 12", "ب) 10", "ج) 14", "د) 11"],
      optionsFr: isModelA
        ? ["A) 14", "B) 15", "C) 12", "D) 16"]
        : ["A) 12", "B) 10", "C) 14", "D) 11"],
      correctAnswerAr: isModelA ? "أ) 14" : "أ) 12",
      correctAnswerFr: isModelA ? "A) 14" : "A) 12",
      justificationAr: isModelA
        ? "مجموع القيم 70 مقسوما على عددها 5 يعطي 14."
        : "مجموع القيم 60 مقسوما على عددها 5 يعطي 12.",
      justificationFr: isModelA
        ? "Somme = 70, nombre de valeurs = 5, donc la moyenne est 70/5 = 14."
        : "Somme = 60, nombre de valeurs = 5, donc la moyenne est 60/5 = 12.",
      points: 2.0,
      remediationAr: "التدريب على حساب المؤشرات المركزية ومؤشرات التشتت وتفسيرها الإحصائي.",
      remediationFr: "Révision de la moyenne pondérée, de la médiane et de l'écart-type.",
    },
  ];

  return {
    titleAr: "رائز التقويم التشخيصي للمكتسبات القبلية في مادة الرياضيات",
    titleFr: "Test de Positionnement & d'Évaluation Diagnostique en Mathématiques",
    subtitleAr: `السنة الدراسية ${track.labelAr} · المذكرة الوزارية المنظمة لأسابيع التقويم والدعم`,
    subtitleFr: `${track.labelFr} · Cadre Officiel du Ministère de l'Éducation Nationale`,
    instructionsAr: [
      "يتكون الرائز من 9 أسئلة موضوعاتية موزعة على أربعة مجالات رياضياتية رئيسية.",
      "لكل سؤال جواب صحيح وحيد من بين الاختيارات الأربعة المقترحة (أ، ب، ج، د).",
      "ضع علامة (X) في الخانة المناسبة على شبكة الأجوبة، ودون تعليلاً مقتضباً في الحيز المخصص.",
      "لا يُسمح باستعمال الآلة الحاسبة المبرمجة إلا إذا أشير إلى خلاف ذلك في التوجيهات.",
    ],
    instructionsFr: [
      "Le test comporte 9 questions thématiques réparties sur 4 domaines fondamentaux.",
      "Chaque question admet une seule réponse exacte parmi les 4 options (A, B, C, D).",
      "Cocher la réponse exacte et justifier succinctement dans l'espace réservé.",
      "Calculatrices programmables interdites sauf mention contraire explicite.",
    ],
    totalPoints: 20,
    domains: [
      {
        nameAr: "المجال 1: التحليل، حساب النهايات وتطبيقات الاشتقاق",
        nameFr: "Domaine 1 : Analyse, limites et dérivation",
        points: 5.0,
        items: domain1Items,
      },
      {
        nameAr: "المجال 2: الجبر، المعادلات، المتراجحات والنظمات",
        nameFr: "Domaine 2 : Algèbre, équations & systèmes",
        points: 5.0,
        items: domain2Items,
      },
      {
        nameAr: "المجال 3: الهندسة المستوية والفضائية والجداء السلمي وحساب المثلثات",
        nameFr: "Domaine 3 : Géométrie, produit scalaire & trigonométrie",
        points: 5.0,
        items: domain3Items,
      },
      {
        nameAr: "المجال 4: الإحصاء، الاحتمالات والحساب العددي",
        nameFr: "Domaine 4 : Statistiques, probabilités & arithmétique",
        points: 5.0,
        items: domain4Items,
      },
    ],
    masteryScale: {
      mastered: {
        labelAr: "متحكم (Maîtrisé)",
        labelFr: "Maîtrisé (Acquis)",
        threshold: "النقطة ≥ 15/20 (نسبة إنجاز ≥ 75%)",
      },
      partial: {
        labelAr: "في طور التحكم (En cours d'acquisition)",
        labelFr: "Partiellement acquis",
        threshold: "10/20 ≤ النقطة < 15/20 (نسبة إنجاز 50% إلى 74%)",
      },
      critical: {
        labelAr: "غير متحكم / تعثر حرج (Non maîtrisé)",
        labelFr: "Non acquis (Remédiation urgente)",
        threshold: "النقطة < 10/20 (نسبة إنجاز أقل من 50%)",
      },
    },
    remediationPlan: [
      {
        domainAr: "التحليل والنهايات والاشتقاق",
        domainFr: "Analyse & Limites",
        commonObstacleAr: "الخلط في تقنيات إزالة الأشكال غير المحددة والاشتقاق المركب",
        commonObstacleFr: "Confusion dans la levée des formes indéterminées et dérivées composées",
        pedagogicalActionAr: "ورشات تفاعلية لمطابقة الدوال مع مشتقاتها وجداول التغيرات، وتدريب مكثف على المتطابقات الهامة.",
        pedagogicalActionFr: "Ateliers ciblés d'association fonction-dérivée et fiches méthodologiques sur les limites.",
        duration: "حصتان (2h)",
      },
      {
        domainAr: "الجبر والمعادلات والنظمات",
        domainFr: "Algèbre & Systèmes",
        commonObstacleAr: "أخطاء الحساب الحرفي والتعامل مع الإشارات وإشارة ثلاثية الحدود",
        commonObstacleFr: "Erreurs de calcul algébrique élémentaire et règle des signes",
        pedagogicalActionAr: "تمارين استدراكية متدرجة الصعوبة بالعمل في مجموعات غير متجانسة واستعمال المحاكاة الرقمية.",
        pedagogicalActionFr: "Activités différenciées de calcul fractionnaire et résolution assistée de systèmes.",
        duration: "حصتان (2h)",
      },
      {
        domainAr: "الهندسة وحساب المثلثات",
        domainFr: "Géométrie & Trigonométrie",
        commonObstacleAr: "صعوبة قراءة الدائرة المثلثية وربط الجداء السلمي بالإسقاط العمودي",
        commonObstacleFr: "Difficulté de lecture du cercle trigonométrique et projection orthogonale",
        pedagogicalActionAr: "توظيف برمجية GeoGebra الدينامية لإنشاء الدائرة المثلثية وتحريك النقط ورؤية التعامد مباشرة.",
        pedagogicalActionFr: "Usage de GeoGebra dynamique pour visualiser le produit scalaire et les angles remarquables.",
        duration: "حصة واحدة (1h)",
      },
      {
        domainAr: "الإحصاء والاحتمالات",
        domainFr: "Statistiques & Dénombrement",
        commonObstacleAr: "تحديد فضاء العينة والتمييز بين السحب بالتتابع وبدون إحلال والتآليف",
        commonObstacleFr: "Dénombrement de l'univers et calcul des probabilités conditionnelles",
        pedagogicalActionAr: "تمثيل الوضعيات بواسطة شجرة الإمكانيات والمخططات وتطبيقات واقعية بسيطة.",
        pedagogicalActionFr: "Utilisation des arbres de choix et fiches de formalisation du vocabulaire probabiliste.",
        duration: "حصة واحدة (1h)",
      },
    ],
  };
}

// =============================================================================
// تطوير الفروض المنزلية وسلاسل التمارين وفق التوجيهات البيداغوجية
// =============================================================================

export interface EnhancedMoroccanDMBlock {
  blockTitleAr: string;
  blockTitleFr: string;
  difficultyLevel: "DIRECT" | "METHOD" | "OLYMPIC_CHALLENGE";
  difficultyStars: string;
  points: string;
  questionsAr: string[];
  questionsFr: string[];
  hintsAr: string[];
  hintsFr: string[];
  correctionAr: string[];
  correctionFr: string[];
}

export function getEnhancedMoroccanDMBlocks(
  lesson: LessonItem,
  isModelA: boolean = true
): EnhancedMoroccanDMBlock[] {
  const lAr = lesson.lessonAr;
  const lFr = lesson.lessonFr;

  return [
    {
      blockTitleAr: `المحور الأول (★) : التملك والاستيعاب المباشر للمكتسبات — ${lAr}`,
      blockTitleFr: `Axe 1 (★) : Assimilation et application directe des capacités — ${lFr}`,
      difficultyLevel: "DIRECT",
      difficultyStars: "★ تطبيق مباشر",
      points: "6.0",
      questionsAr: [
        `1. أكتب التعبير الرياضي للخاصية الأساسية المرتبطة بـ « ${lesson.capacitiesAr[0] || lAr} » مع تحديد الشروط الضرورية.`,
        `2. تطبيق عددي مباشر: بين بالبرهان الحسابي صحة النتيجة وتحقق من شروط التطبيق.`,
        `3. استنتج التأويل البيداغوجي المباشر للنتيجة في سياق الدرس.`,
      ],
      questionsFr: [
        `1. Énoncer rigoureusement la propriété fondamentale relative à « ${lesson.capacitiesFr[0] || lFr} ».`,
        `2. Application numérique directe : justifier pas à pas le résultat obtenu.`,
        `3. Donner l'interprétation géométrique ou algébrique immédiate du résultat.`,
      ],
      hintsAr: [
        "إضاءة ديداكتيكية: تذكر الشروط الدقيقة لنص الخاصية ولا تتسرع في الحساب دون التحقق من مجموعة الصلاحية.",
        "إرشاد: التعميل قبل التعويض يجنبك الأخطاء الحسابية المتكررة.",
      ],
      hintsFr: [
        "Coup de pouce : Vérifier scrupuleusement les hypothèses d'application du théorème avant tout calcul.",
        "Indice : Factoriser systématiquement pour simplifier les expressions.",
      ],
      correctionAr: [
        "1. صياغة الخاصية الرسمية بوضوح مع تحديد مجموعة التعريف والشروط.",
        "2. تفصيل مراحل الحساب والوصول إلى القيمة الدقيقة.",
        "3. التأويل الرياضي السليم للنتيجة وفق الأطر المرجعية.",
      ],
      correctionFr: [
        "1. Énoncé clair des hypothèses du théorème officiel.",
        "2. Calcul détaillé étape par étape menant à la valeur exacte.",
        "3. Interprétation mathématique conforme aux attendus.",
      ],
    },
    {
      blockTitleAr: `المحور الثاني (★★) : التوليف المنهجي وحل المسائل المركبة — ${lAr}`,
      blockTitleFr: `Axe 2 (★★) : Mobilisation méthodique et résolution de problème — ${lFr}`,
      difficultyLevel: "METHOD",
      difficultyStars: "★★ توليف منهجي",
      points: "8.0",
      questionsAr: [
        `1. نعتبر الدالة أو التعبير المركب المساعد. برهن باستعمال الاستدلال الرياضي المناسب (بالخلف، بالترجع، أو بفصل الحالات).`,
        `2. اربط بين نتيجتين سابقتين لإبراز المتراجحة أو الخاصية المستهدفة بدقة.`,
        `3. وظف معطيات التمرين لإيجاد القيمة الحدية أو دراسة السلوك المقارب.`,
      ],
      questionsFr: [
        `1. À l'aide d'un raisonnement rigoureux (récurrence, contraposée ou disjonction des cas), démontrer la proposition.`,
        `2. Établir une relation de synthèse reliant les résultats des étapes précédentes.`,
        `3. Déterminer les extrema ou étudier le comportement asymptotique associé.`,
      ],
      hintsAr: [
        "إضاءة ديداكتيكية: عند البرهان بالترجع، تحقق جيداً من مرحلة البداية ثم افترض صحة الخاصية للرتبة n وبرهنها لـ n+1.",
        "إرشاد: تأطير الفرق يساعد على معرفة الإشارة دون الحاجة لحسابات معقدة.",
      ],
      hintsFr: [
        "Coup de pouce : Soigner la phase d'hérédité pour le raisonnement par récurrence.",
        "Indice : Étudier le signe de la différence pour déduire l'inégalité recherchée.",
      ],
      correctionAr: [
        "1. صياغة دقيقة لمراحل الاستدلال المختار والتحقق من التكافؤات المنطقية.",
        "2. التركيب المنهجي واستنتاج النتيجة المطلوبة.",
        "3. حساب القيمة المستهدفة مع التعليل الكامل.",
      ],
      correctionFr: [
        "1. Rédaction soignée de la démarche déductive par étapes.",
        "2. Synthèse et justification des équivalences logiques.",
        "3. Détermination des valeurs cibles avec arguments rigoureux.",
      ],
    },
    {
      blockTitleAr: `المحور الثالث (★★★) : مسألة التحدي والتعمق والتفكير الأولمبي — ${lAr}`,
      blockTitleFr: `Axe 3 (★★★) : Problème ouvert, défi et approfondissement olympique — ${lFr}`,
      difficultyLevel: "OLYMPIC_CHALLENGE",
      difficultyStars: "★★★ تعمق وتحدي أولمبي",
      points: "6.0",
      questionsAr: [
        `1. وضعية مفتوحة: بين أنه لكل عدد صحيح n ≥ 1 أو لكل x من المجال، تتحقق المتفاوتة الكلاسيكية.`,
        `2. استنتج تقارباً أو حداً غير اعتيادي باستعمال مبرهنة الحصر أو تقنيات التحدي الرياضي.`,
        `3. صغ تعميماً رياضياً مستلهماً من أولمبياد الرياضيات حول هذا المفهوم.`,
      ],
      questionsFr: [
        `1. Question ouverte de recherche : montrer l'inégalité pour tout n ≥ 1 ou tout réel de l'intervalle.`,
        `2. En déduire la convergence ou une borne optimale à l'aide du théorème d'encadrement.`,
        `3. Proposer une généralisation inspirée des concours et olympiades de mathématiques.`,
      ],
      hintsAr: [
        "إضاءة ديداكتيكية: فكر في إدخال دالة مساعدة ودراسة تغيراتها، أو استعمال التقعر ومماس المنحنى.",
        "إرشاد: تذكر متراجحة كوشي-شوارز أو متراجحات التحدي الكلاسيكية في الأولمبياد.",
      ],
      hintsFr: [
        "Coup de pouce : Introduire une fonction auxiliaire et étudier sa convexité ou ses tangentes.",
        "Indice : Penser aux inégalités remarquables (Cauchy-Schwarz, convexité).",
      ],
      correctionAr: [
        "1. إدخال الدالة المساعدة أو الترتيب واستنتاج المتفاوتة بأناقة رياضية.",
        "2. تطبيق مبرهنة الدرك واستنتاج النهاية الدقيقة.",
        "3. الصياغة العامة للمسألة الأولمبية.",
      ],
      correctionFr: [
        "1. Étude de la fonction auxiliaire et déduction élégante de l'inégalité.",
        "2. Application du théorème des gendarmes et calcul de la limite.",
        "3. Énoncé de la généralisation conforme au niveau olympique.",
      ],
    },
  ];
}

