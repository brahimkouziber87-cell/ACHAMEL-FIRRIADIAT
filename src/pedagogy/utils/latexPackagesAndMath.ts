export type LatexPackageTheme =
  | "TCOLORBOX"
  | "FANCYHDR"
  | "MDFRAMED"
  | "BCLOGO"
  | "EXAM_OFFICIAL";

export type PaperSurfaceTexture =
  | "PLAIN_WHITE"
  | "MILLIMETER_GRID"
  | "SEYES_FRENCH"
  | "ACADEMIC_IVORY";

export type StudentGridStyle =
  | "SEYES_FRENCH"
  | "LINED_RULED"
  | "MILLIMETER_GRID"
  | "DOTTED_BOX"
  | "PLAIN_BOX";

export interface LatexPackageOption {
  id: LatexPackageTheme;
  packageCmd: string;
  labelAr: string;
  labelFr: string;
  badge: string;
  descriptionAr: string;
  descriptionFr: string;
  sheetSkinClass: string;
  exerciseBoxClass: string;
  exerciseHeaderClass: string;
  latexPreambleSnippet: string;
}

export const LATEX_PACKAGE_OPTIONS: LatexPackageOption[] = [
  {
    id: "TCOLORBOX",
    packageCmd: "\\usepackage[most]{tcolorbox}",
    labelAr: "حزمة tcolorbox (تأطير أكاديمي ملون ومزدوج)",
    labelFr: "Package tcolorbox (Cadres académiques titrés)",
    badge: "tcolorbox",
    descriptionAr:
      "تأطير التمارين والمسائل والمبرهنات داخل صناديق tcolorbox مزدوجة الحواف مع شريط عنوان علوي ملون وشارة تنقيط بارزة.",
    descriptionFr:
      "Encadrement des exercices et théorèmes dans des boîtes tcolorbox avec bandeau de titre coloré et barème en relief.",
    sheetSkinClass: "latex-skin-tcolorbox",
    exerciseBoxClass:
      "border-2 border-indigo-900/85 rounded-xl overflow-hidden bg-white shadow-xs",
    exerciseHeaderClass:
      "bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white px-4 py-2 border-b-2 border-indigo-950 -mx-4 -mt-4 mb-3 rounded-t-lg",
    latexPreambleSnippet: `% --- تنسيق حزمة tcolorbox الاحترافية للتمارين والمسائل ---
\\usepackage[most]{tcolorbox}
\\tcbuselibrary{skins,breakable,theorems}
\\newtcolorbox{exoBox}[2][]{%
  enhanced, breakable,
  colback=white, colframe=blue!45!black,
  colbacktitle=blue!50!black, coltitle=white,
  fonttitle=\\bfseries,
  title={#2},
  arc=2.5mm, boxrule=1.1pt,
  #1
}`,
  },
  {
    id: "FANCYHDR",
    packageCmd: "\\usepackage{fancyhdr}",
    labelAr: "حزمة fancyhdr (ترويسة وتذييل أكاديمي مسطر)",
    labelFr: "Package fancyhdr (En-têtes & pieds de page classiques)",
    badge: "fancyhdr",
    descriptionAr:
      "إظهار شريط الترويسة العلوية المسطرة (Running Header) وتذييل الصفحة السفلي المرقم بأسلوب امتحانات البكالوريا والجامعات.",
    descriptionFr:
      "En-têtes et pieds de page courants avec filets horizontaux doubles et numérotation officielle.",
    sheetSkinClass: "latex-skin-fancyhdr",
    exerciseBoxClass:
      "border-y-2 border-slate-900 border-x border-slate-300 rounded-none p-4 bg-white",
    exerciseHeaderClass:
      "border-b-2 border-double border-slate-900 pb-2 mb-3 text-slate-950 uppercase tracking-wide",
    latexPreambleSnippet: `% --- تنسيق حزمة fancyhdr للترويسات والتذييلات الأكاديمية ---
\\usepackage{fancyhdr}
\\usepackage{lastpage}
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0.8pt}
\\renewcommand{\\footrulewidth}{0.5pt}
\\fancyhead[L]{\\small\\bfseries Épreuve de Mathématiques}
\\fancyhead[R]{\\small\\bfseries Lycée Qualifiant · Barème /20}
\\fancyfoot[C]{\\small\\bfseries Page \\thepage\\ sur \\pageref{LastPage}}`,
  },
  {
    id: "MDFRAMED",
    packageCmd: "\\usepackage[framemethod=TikZ]{mdframed}",
    labelAr: "حزمة mdframed (شريط جانبي هندسي TikZ)",
    labelFr: "Package mdframed (Filet latéral TikZ & fond doux)",
    badge: "mdframed",
    descriptionAr:
      "تنسيق التمارين بشريط جانبي سميك (Left/Right Rule) مع خلفية رمادية/زرقاء هادئة جداً تبرز بنية الأسئلة الفرعية.",
    descriptionFr:
      "Mise en forme avec barre latérale épaisse TikZ et arrière-plan subtilement tramé.",
    sheetSkinClass: "latex-skin-mdframed",
    exerciseBoxClass:
      "border-s-4 border-s-cyan-700 border-y border-e border-slate-300 rounded-e-xl p-4 bg-slate-50/45",
    exerciseHeaderClass:
      "border-b border-cyan-800/30 pb-1.5 mb-3 text-cyan-950",
    latexPreambleSnippet: `% --- تنسيق حزمة mdframed مع TikZ ---
\\usepackage[framemethod=TikZ]{mdframed}
\\mdfdefinestyle{exoMdStyle}{%
  linecolor=cyan!70!black,
  outerlinewidth=2.5pt,
  topline=false, bottomline=false,
  backgroundcolor=gray!4,
  innertopmargin=8pt, innerbottommargin=8pt
}`,
  },
  {
    id: "BCLOGO",
    packageCmd: "\\usepackage[tikz]{bclogo}",
    labelAr: "حزمة bclogo (شارات بيداغوجية فرنسية/مغربية)",
    labelFr: "Package bclogo (Icônes & bandeaux didactiques)",
    badge: "bclogo",
    descriptionAr:
      "إدراج شارات وأوسمة بيداغوجية أمام عناوين التمارين والتوجيهات على غرار الكتب المدرسية الفرنسية والمغربية.",
    descriptionFr:
      "Encadrements enrichis d'icônes pédagogiques inspirés des manuels scolaires et annales.",
    sheetSkinClass: "latex-skin-bclogo",
    exerciseBoxClass:
      "border-2 border-dashed border-amber-700/70 rounded-2xl p-4 bg-amber-50/15",
    exerciseHeaderClass:
      "bg-amber-100/70 border border-amber-400/80 px-3 py-1.5 rounded-lg mb-3 text-amber-950",
    latexPreambleSnippet: `% --- تنسيق حزمة bclogo للشارات البيداغوجية ---
\\usepackage[tikz]{bclogo}
\\renewcommand{\\bcStyleTitre}[1]{\\bfseries\\color{blue!50!black}#1}`,
  },
  {
    id: "EXAM_OFFICIAL",
    packageCmd: "\\documentclass[addpoints,11pt]{exam}",
    labelAr: "صنف exam الرسمي (نموذج الامتحان الوطني الموحد)",
    labelFr: "Classe exam officielle (Format Baccalauréat & Concours)",
    badge: "exam.cls",
    descriptionAr:
      "المظهر الكلاسيكي الصارم للامتحانات الوطنية الموحدة ومباريات الأقسام التحضيرية مع جدول تنقيط آلي وشارات نقط محاطة بإطار.",
    descriptionFr:
      "Présentation officielle des examens nationaux et concours avec boîtes de points encadrées.",
    sheetSkinClass: "latex-skin-exam",
    exerciseBoxClass:
      "border border-slate-400 rounded-xl p-4 bg-white shadow-2xs",
    exerciseHeaderClass: "border-b border-slate-300 pb-1.5 mb-3 text-slate-950",
    latexPreambleSnippet: `% --- تنسيق الامتحانات الرسمية وحساب النقط ---
\\usepackage{framed,amssymb}
% \\boxedpoints % تأطير النقط في الهامش`,
  },
];

export interface PaperSurfaceOption {
  id: PaperSurfaceTexture;
  labelAr: string;
  labelFr: string;
  cssClass: string;
}

export const PAPER_SURFACE_OPTIONS: PaperSurfaceOption[] = [
  {
    id: "PLAIN_WHITE",
    labelAr: "ورق رسمي أبيض ناصع (A4 Officiel)",
    labelFr: "Papier Blanc Officiel A4",
    cssClass: "paper-surface-white",
  },
  {
    id: "MILLIMETER_GRID",
    labelAr: "ورق مليمتري هندسي دقيق (Grille Millimétrée)",
    labelFr: "Grille Mathématique Millimétrée",
    cssClass: "paper-surface-millimeter",
  },
  {
    id: "SEYES_FRENCH",
    labelAr: "تربيعات دفتر القسم (Grands Carreaux Seyès)",
    labelFr: "Feuille de Copie Seyès (Grands Carreaux)",
    cssClass: "paper-surface-seyes",
  },
  {
    id: "ACADEMIC_IVORY",
    labelAr: "ورق أكاديمي عاجي دافئ (Ivoire Académique)",
    labelFr: "Papier Ivoire Académique Confort",
    cssClass: "paper-surface-ivory",
  },
];

export type TcolorboxPaletteId =
  | "INDIGO_ROYAL"
  | "EMERALD_MATH"
  | "AMBER_SULTANI"
  | "BURGUNDY_CONCOURS"
  | "SLATE_MONO";

export type TcolorboxShadingLevel = "NONE" | "SOFT" | "MEDIUM" | "RICH";

export type TcolorboxFrameStyle =
  | "ROUNDED_SHADOW"
  | "SHARP_DOUBLE"
  | "LEFT_ACCENT";

export interface TcolorboxCustomConfig {
  palette: TcolorboxPaletteId;
  shading: TcolorboxShadingLevel;
  frameStyle: TcolorboxFrameStyle;
  applyToComplexProblems: boolean;
}

export const DEFAULT_TCOLORBOX_CONFIG: TcolorboxCustomConfig = {
  palette: "INDIGO_ROYAL",
  shading: "SOFT",
  frameStyle: "ROUNDED_SHADOW",
  applyToComplexProblems: true,
};

export interface TcolorboxPaletteOption {
  id: TcolorboxPaletteId;
  labelAr: string;
  labelFr: string;
  swatchHex: string;
  latexColFrame: string;
  latexColBackTitle: string;
  latexColBackTint: string;
}

export const TCOLORBOX_PALETTE_OPTIONS: TcolorboxPaletteOption[] = [
  {
    id: "INDIGO_ROYAL",
    labelAr: "نيلي ملكي أكاديمي (Indigo Royal)",
    labelFr: "Indigo Royal Académique",
    swatchHex: "#1e1b4b",
    latexColFrame: "blue!45!black",
    latexColBackTitle: "blue!55!black",
    latexColBackTint: "blue",
  },
  {
    id: "EMERALD_MATH",
    labelAr: "زمردي رياضي مغربي (Émeraude Math)",
    labelFr: "Émeraude Mathématique",
    swatchHex: "#064e3b",
    latexColFrame: "teal!60!black",
    latexColBackTitle: "teal!70!black",
    latexColBackTint: "teal",
  },
  {
    id: "AMBER_SULTANI",
    labelAr: "ذهبي سلطاني للمسائل (Or & Ambre)",
    labelFr: "Ambre & Or Concours",
    swatchHex: "#78350f",
    latexColFrame: "orange!55!black",
    latexColBackTitle: "orange!65!black",
    latexColBackTint: "yellow!60!orange",
  },
  {
    id: "BURGUNDY_CONCOURS",
    labelAr: "عنابي مباريات التميز (Bordeaux CPGE)",
    labelFr: "Bordeaux Grand Concours",
    swatchHex: "#881337",
    latexColFrame: "red!55!black",
    latexColBackTitle: "red!65!black",
    latexColBackTint: "red",
  },
  {
    id: "SLATE_MONO",
    labelAr: "رمادي فحمي رسمي للطباعة (Monochrome)",
    labelFr: "Noir & Gris Officiel",
    swatchHex: "#0f172a",
    latexColFrame: "black!80",
    latexColBackTitle: "black!85",
    latexColBackTint: "gray",
  },
];

export const TCOLORBOX_SHADING_OPTIONS: Array<{
  id: TcolorboxShadingLevel;
  labelAr: string;
  labelFr: string;
  percentLabel: string;
  latexPercent: number;
}> = [
  {
    id: "NONE",
    labelAr: "بدون تظليل خلفي (أبيض ناصع 0%)",
    labelFr: "Fond blanc pur (0%)",
    percentLabel: "0%",
    latexPercent: 0,
  },
  {
    id: "SOFT",
    labelAr: "تظليل هادئ جداً (Soft 4%)",
    labelFr: "Tramage léger (4%)",
    percentLabel: "4%",
    latexPercent: 4,
  },
  {
    id: "MEDIUM",
    labelAr: "تظليل أكاديمي متوسط (Medium 8%)",
    labelFr: "Tramage académique (8%)",
    percentLabel: "8%",
    latexPercent: 8,
  },
  {
    id: "RICH",
    labelAr: "تظليل بارز للمسائل المعقدة (Rich 14%)",
    labelFr: "Tramage soutenu Problèmes (14%)",
    percentLabel: "14%",
    latexPercent: 14,
  },
];

export const TCOLORBOX_FRAME_OPTIONS: Array<{
  id: TcolorboxFrameStyle;
  labelAr: string;
  labelFr: string;
}> = [
  {
    id: "ROUNDED_SHADOW",
    labelAr: "زوايا دائرية مع ظل أكاديمي (Rounded + Shadow)",
    labelFr: "Coins arrondis & ombre portée",
  },
  {
    id: "SHARP_DOUBLE",
    labelAr: "إطار هندسي مزدوج حاد (Double Boxrule)",
    labelFr: "Cadre double strict",
  },
  {
    id: "LEFT_ACCENT",
    labelAr: "شريط جانبي عريض للمسائل (Bandeau Latéral)",
    labelFr: "Bandeau latéral renforcé",
  },
];

export function getTcolorboxClasses(
  config: TcolorboxCustomConfig = DEFAULT_TCOLORBOX_CONFIG,
  isSynthesisProblem = false
): {
  boxClass: string;
  headerClass: string;
  badgeClass: string;
  subCategoryClass: string;
  partBoxClass: string;
} {
  const { palette, shading, frameStyle } = config;

  const borderMap: Record<TcolorboxPaletteId, string> = {
    INDIGO_ROYAL: "border-indigo-900/90",
    EMERALD_MATH: "border-emerald-900/90",
    AMBER_SULTANI: "border-amber-900/90",
    BURGUNDY_CONCOURS: "border-rose-950/90",
    SLATE_MONO: "border-slate-900",
  };

  const leftBorderMap: Record<TcolorboxPaletteId, string> = {
    INDIGO_ROYAL: "border-s-indigo-900",
    EMERALD_MATH: "border-s-emerald-800",
    AMBER_SULTANI: "border-s-amber-800",
    BURGUNDY_CONCOURS: "border-s-rose-900",
    SLATE_MONO: "border-s-slate-900",
  };

  const bgShadingMap: Record<
    TcolorboxPaletteId,
    Record<TcolorboxShadingLevel, string>
  > = {
    INDIGO_ROYAL: {
      NONE: "bg-white",
      SOFT: "bg-indigo-50/25",
      MEDIUM: "bg-indigo-50/55",
      RICH: "bg-indigo-100/50",
    },
    EMERALD_MATH: {
      NONE: "bg-white",
      SOFT: "bg-emerald-50/25",
      MEDIUM: "bg-emerald-50/55",
      RICH: "bg-emerald-100/50",
    },
    AMBER_SULTANI: {
      NONE: "bg-white",
      SOFT: "bg-amber-50/25",
      MEDIUM: "bg-amber-50/55",
      RICH: "bg-amber-100/50",
    },
    BURGUNDY_CONCOURS: {
      NONE: "bg-white",
      SOFT: "bg-rose-50/25",
      MEDIUM: "bg-rose-50/55",
      RICH: "bg-rose-100/50",
    },
    SLATE_MONO: {
      NONE: "bg-white",
      SOFT: "bg-slate-50/45",
      MEDIUM: "bg-slate-100/65",
      RICH: "bg-slate-200/55",
    },
  };

  const headerBgMap: Record<TcolorboxPaletteId, string> = {
    INDIGO_ROYAL:
      "bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border-indigo-950 text-white",
    EMERALD_MATH:
      "bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 border-emerald-950 text-white",
    AMBER_SULTANI:
      "bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-900 border-amber-950 text-white",
    BURGUNDY_CONCOURS:
      "bg-gradient-to-r from-rose-950 via-red-950 to-rose-900 border-rose-950 text-white",
    SLATE_MONO:
      "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 border-slate-950 text-white",
  };

  const frameClass =
    frameStyle === "ROUNDED_SHADOW"
      ? `border-2 ${borderMap[palette]} rounded-xl shadow-sm`
      : frameStyle === "SHARP_DOUBLE"
      ? `border-4 border-double ${borderMap[palette]} rounded-none shadow-2xs`
      : `border-y border-e border-slate-300 border-s-4 ${leftBorderMap[palette]} rounded-e-xl shadow-2xs`;

  const effectiveShading =
    isSynthesisProblem && shading === "SOFT" ? "MEDIUM" : shading;

  return {
    boxClass: `${frameClass} overflow-hidden ${bgShadingMap[palette][effectiveShading]}`,
    headerClass: `${headerBgMap[palette]} px-4 py-2 border-b-2 -mx-4 -mt-4 mb-3 ${
      frameStyle === "ROUNDED_SHADOW" ? "rounded-t-lg" : ""
    }`,
    badgeClass:
      "bg-white/15 text-amber-300 px-2.5 py-0.5 rounded-md border border-white/25 font-mono font-bold",
    subCategoryClass: "text-white/80",
    partBoxClass:
      effectiveShading === "NONE"
        ? "bg-slate-50/70 border border-slate-200"
        : "bg-white/85 border border-slate-300/80 shadow-2xs",
  };
}

export function buildCustomTcolorboxLatexPreamble(
  config: TcolorboxCustomConfig = DEFAULT_TCOLORBOX_CONFIG
): string {
  const pal =
    TCOLORBOX_PALETTE_OPTIONS.find((p) => p.id === config.palette) ||
    TCOLORBOX_PALETTE_OPTIONS[0];
  const shade =
    TCOLORBOX_SHADING_OPTIONS.find((s) => s.id === config.shading) ||
    TCOLORBOX_SHADING_OPTIONS[1];

  const colbackExpr =
    shade.latexPercent === 0
      ? "white"
      : `${pal.latexColBackTint}!${shade.latexPercent}!white`;

  const frameRuleSnippet =
    config.frameStyle === "ROUNDED_SHADOW"
      ? "arc=2.5mm, boxrule=1.1pt, drop fuzzy shadow,"
      : config.frameStyle === "SHARP_DOUBLE"
      ? "sharp corners, boxrule=1.4pt, borderline={0.5pt}{2pt}{black!50},"
      : "sharp corners, boxrule=0.5pt, leftrule=3.5pt,";

  return `% --- تنسيق حزمة tcolorbox المخصصة للمسائل الرياضية المعقدة (${pal.labelFr} | تظليل ${shade.percentLabel}) ---
\\usepackage[most]{tcolorbox}
\\tcbuselibrary{skins,breakable,theorems}
\\newtcolorbox{exoBox}[2][]{%
  enhanced, breakable,
  colback=${colbackExpr},
  colframe=${pal.latexColFrame},
  colbacktitle=${pal.latexColBackTitle},
  coltitle=white,
  fonttitle=\\bfseries,
  title={#2},
  ${frameRuleSnippet}
  #1
}
\\newtcolorbox{problemeComplexeBox}[2][]{%
  enhanced, breakable,
  colback=${pal.latexColBackTint}!${Math.min(18, shade.latexPercent + 4)}!white,
  colframe=${pal.latexColFrame},
  colbacktitle=${pal.latexColBackTitle},
  coltitle=white,
  fonttitle=\\bfseries\\large,
  title={\\textbf{Problème de Synthèse : } #2},
  ${frameRuleSnippet}
  #1
}`;
}

/**
 * محرك تجميل وتحسين الصيغ والرموز الرياضية في المعاينة الحية والاختبارات التفاعلية
 */
export function formatMathTypography(text: string): string {
  if (!text) return "";
  let clean = text;

  // إزالة علامات الدولار المحيطة بالنص البسيط إن وجدت
  if (clean.startsWith("$") && clean.endsWith("$") && clean.indexOf("$", 1) === clean.length - 1) {
    clean = clean.slice(1, -1).trim();
  }

  return clean
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
    .replace(/\\sqrt\[([^[\]]+)\]\{([^{}]+)\}/g, "ⁿ√($2)")
    .replace(/\\mathbb\{R\}/g, "ℝ")
    .replace(/\\mathbb\{C\}/g, "ℂ")
    .replace(/\\mathbb\{N\}/g, "ℕ")
    .replace(/\\mathbb\{Z\}/g, "ℤ")
    .replace(/\\mathbb\{Q\}/g, "ℚ")
    .replace(/\\mathcal\{C\}_([a-zA-Z])/g, "(C_$1)")
    .replace(/\\vec\{([a-zA-Z0-9]+)\}/g, "$1⃗")
    .replace(/\\infty/g, "∞")
    .replace(/\\pi\b/g, "π")
    .replace(/\\alpha\b/g, "α")
    .replace(/\\beta\b/g, "β")
    .replace(/\\gamma\b/g, "γ")
    .replace(/\\theta\b/g, "θ")
    .replace(/\\lambda\b/g, "λ")
    .replace(/\\Delta\b/g, "Δ")
    .replace(/\\forall\b/g, "∀")
    .replace(/\\exists\b/g, "∃")
    .replace(/\\in\b/g, "∈")
    .replace(/\\notin\b/g, "∉")
    .replace(/\\subset\b/g, "⊂")
    .replace(/\\cup\b/g, "∪")
    .replace(/\\cap\b/g, "∩")
    .replace(/\\leq\b|<=/g, "≤")
    .replace(/\\geq\b|>=/g, "≥")
    .replace(/\\neq\b|!=/g, "≠")
    .replace(/\\approx\b/g, "≈")
    .replace(/\\equiv\b/g, "≡")
    .replace(/\\times\b/g, "×")
    .replace(/\\pm\b/g, "±")
    .replace(/<=>|\\iff\b/g, "⇔")
    .replace(/\\implies\b/g, "⇒")
    .replace(/\\to\b|->/g, "→")
    .replace(/\\int\b/g, "∫")
    .replace(/\\sum\b/g, "∑")
    .replace(/\\prod\b/g, "∏")
    .replace(/u_\{n\+1\}/g, "uₙ₊₁")
    .replace(/u_\{n\}/g, "uₙ")
    .replace(/u_n\b/g, "uₙ")
    .replace(/v_n\b/g, "vₙ")
    .replace(/u_0\b/g, "u₀")
    .replace(/u_1\b/g, "u₁")
    .replace(/z_1\b/g, "z₁")
    .replace(/z_2\b/g, "z₂");
}

export interface WolframPresetItem {
  id: string;
  categoryAr: string;
  categoryFr: string;
  trackBadge: string;
  titleAr: string;
  titleFr: string;
  query: string;
  operationType: "VERIFY_AND_SOLVE" | "LIMIT_DERIVATIVE" | "INTEGRAL" | "COMPLEX_ALGEBRA" | "ARITHMETIC";
}

export const WOLFRAM_HIGH_SCHOOL_PRESETS: WolframPresetItem[] = [
  {
    id: "wa_lim_ln",
    categoryAr: "النهايات والاتصال والاشتقاق",
    categoryFr: "Limites, Continuité et Dérivation",
    trackBadge: "2BAC SM / PC · Terminale Spé",
    titleAr: "نهاية لوغاريتمية مركبة بجوار الصفر",
    titleFr: "Limite logarithmique en 0",
    query: "limit of (ln(1 + x) - x) / x^2 as x -> 0",
    operationType: "LIMIT_DERIVATIVE",
  },
  {
    id: "wa_int_ipp",
    categoryAr: "الحساب التكاملي والدوال الأصلية",
    categoryFr: "Calcul Intégral & Primitives",
    trackBadge: "2BAC SM / PC / SVT",
    titleAr: "تكامل بالتجزيء لدالة لوغاريتمية وأسية",
    titleFr: "Intégration par parties (Logarithme)",
    query: "integrate x^2 * ln(x) dx from x = 1 to e",
    operationType: "INTEGRAL",
  },
  {
    id: "wa_complex_deg3",
    categoryAr: "الأعداد العقدية والتحويلات النقطية",
    categoryFr: "Nombres Complexes & Géométrie",
    trackBadge: "2BAC SM / PC · Maths Expertes",
    titleAr: "معادلة من الدرجة الثالثة في مجموعة الأعداد العقدية ℂ",
    titleFr: "Équation du 3ème degré dans ℂ",
    query: "solve z^3 - (3 + 2i)z^2 + (3 + 4i)z - 2i = 0 over complex numbers",
    operationType: "COMPLEX_ALGEBRA",
  },
  {
    id: "wa_ode_second",
    categoryAr: "المعادلات التفاضلية",
    categoryFr: "Équations Différentielles",
    trackBadge: "2BAC SM / PC",
    titleAr: "معادلة تفاضلية من الرتبة الثانية بشرطين بدئيين",
    titleFr: "Équation différentielle linéaire d'ordre 2",
    query: "y'' - 4y' + 4y = (2x + 1)e^(2x), y(0) = 1, y'(0) = 2",
    operationType: "VERIFY_AND_SOLVE",
  },
  {
    id: "wa_arith_bezout",
    categoryAr: "الحسابيات في ℤ والموافقات",
    categoryFr: "Arithmétique dans ℤ & Congruences",
    trackBadge: "2BAC SM · 1BAC SM · Maths Expertes",
    titleAr: "معادلة ديوفانتية ومبرهنة بيزو وغاوس",
    titleFr: "Équation diophantienne (Théorème de Bézout)",
    query: "solve 53x - 37y = 1 over integers",
    operationType: "ARITHMETIC",
  },
  {
    id: "wa_trig_int",
    categoryAr: "تكاملات أولمبياد ومباريات التميز",
    categoryFr: "Intégrales Classiques & Concours",
    trackBadge: "2BAC SM · CPGE",
    titleAr: "تكامل كوشي المثلثي الشهير على [0, π/4]",
    titleFr: "Intégrale de Bertrand/Cauchy ln(1 + tan(x))",
    query: "integrate ln(1 + tan(x)) dx from x = 0 to pi/4",
    operationType: "INTEGRAL",
  },
];

export type FullAnswerTaskType =
  | "CURVE_GRAPH"
  | "VARIATION_TABLE"
  | "RECURRENCE_PROOF"
  | "MULTI_STEP_PROOF"
  | "CALCULATION";

export interface FullAnswerWorkspaceSpec {
  taskType: FullAnswerTaskType;
  recommendedLines: number;
  heightPx: number;
  heightCmLatex: string;
  heightCmTypst: string;
  taskBadgeAr: string;
  taskBadgeFr: string;
  methodStepsAr: string[];
  methodStepsFr: string[];
  subQuestionsCount: number;
}

/**
 * محرك المعايرة الذكية للفراغ المخصص للإجابة الكاملة للتلميذ (Full-Answer Workspace Calibration Engine)
 * يحلل نص السؤال وعدد الأسئلة الفرعية والعمليات الرياضية والحلول والنقط لتحديد عدد الأسطر والارتفاع الفعلي والقالب المساعد
 */
export function analyzeFullAnswerWorkspaceRequirement(params: {
  questionText?: string;
  solutionText?: string;
  difficultyLevel?: string | number;
  points?: number | string;
  workspaceHeightMode?: "ADAPTIVE" | "COMPACT" | "GENEROUS";
  customLineDelta?: number;
}): FullAnswerWorkspaceSpec {
  const qText = (params.questionText || "").toLowerCase();
  const sText = (params.solutionText || "").toLowerCase();
  const combined = `${qText} ${sText}`;
  const levelStr = String(params.difficultyLevel || "N1").toUpperCase();
  const pts =
    typeof params.points === "number"
      ? params.points
      : parseFloat(String(params.points || "1")) || 1;

  // رصد عدد الشطور أو الأسئلة الفرعية داخل السؤال الواحد (أ، ب، ج / a), b), c) / ثم استنتج / en déduire)
  const subPartsMatches =
    (params.questionText || "").match(
      /(\b[abc]\)|\b[أبجد]\)|ثم استنتج|واستنتج|en déduire|puis calculer|puis montrer|حدد.*ثم)/gi
    ) || [];
  const subQuestionsCount = Math.max(1, Math.min(4, 1 + subPartsMatches.length));

  // تصنيف نوع المهمة الرياضية المطلوبة لبناء الفضاء الكامل للإجابة
  let taskType: FullAnswerTaskType = "CALCULATION";
  let baseLines = 5;
  let extraScaffoldPx = 0;
  let taskBadgeAr = "تحرير الحل الكامل والتعليل الرياضي";
  let taskBadgeFr = "Rédaction complète & justification";
  let methodStepsAr: string[] = [
    "1. تذكير بالخاصية أو الصيغة المرجعية",
    "2. مراحل الحساب الجبري والتبسيط",
    "3. تأطير النتيجة النهائية",
  ];
  let methodStepsFr: string[] = [
    "1. Rappel de la propriété / formule",
    "2. Étapes du calcul et simplification",
    "3. Résultat final encadré",
  ];

  const isCurveGraph =
    /أنشئ|ارسم|إنشاء المنحنى|رسم المنحنى|منحنى الدالة|تمثيل مبياني|معلم متعامد|construire.*courbe|tracer.*courbe|représentation graphique|repère orthonormé|\(c_f\)|\(c_g\)|\(o,\s*\\vec\{i\}/i.test(
      qText
    );
  const isVariationTable =
    /جدول التغيرات|جدول تغيرات|جدول الإشارة|تغيرات الدالة|tableau de variation|tableau de signe|variations de la fonction|dresser le tableau/i.test(
      qText
    );
  const isRecurrence =
    /بالترجع|برهن بالترجع|بين بالترجع|مبدأ الترجع|récurrence|par récurrence|hérédité|initialisation/i.test(
      combined
    );
  const isMultiStepProof =
    /تكامل|مكاملة بالتجزيء|معادلة تفاضلية|مبرهنة القيم الوسيطية|مبرهنة التزايدات|رتابة|متتالية متقاربة|الأعداد العقدية|الشكل المثلثي|المسافة|فلكة|تقاطع|أولمبياد|برهن أن|بين أن|استنتج أن|intégrale|intégration par parties|équation différentielle|tvi|bijection|convergence|complexe|trigonométrique|sphère|démontrer que|montrer que/i.test(
      combined
    );

  if (isCurveGraph) {
    taskType = "CURVE_GRAPH";
    baseLines = 12;
    extraScaffoldPx = 140;
    taskBadgeAr = "إنشاء هندسي للمنحنى (Cf) والمقاربات والمماسات في معلم متعامد ممنظم";
    taskBadgeFr = "Construction géométrique de (Cf), asymptotes et tangentes dans (O, i, j)";
    methodStepsAr = [
      "1. تحديد جدول القيم المساعدة والمقاربات",
      "2. رسم المماسات الأفقية والمائلة ونقط الانعطاف",
      "3. إنشاء المنحنى (Cf) بدقة داخل المعلم المتعامد الممنظم",
    ];
    methodStepsFr = [
      "1. Placer les asymptotes et points particuliers",
      "2. Tracer les tangentes horizontales / obliques",
      "3. Construire la courbe (Cf) avec soin dans le repère",
    ];
  } else if (isVariationTable) {
    taskType = "VARIATION_TABLE";
    baseLines = 9;
    extraScaffoldPx = 92;
    taskBadgeAr = "دراسة إشارة المشتقة f'(x) وتأطير جدول التغيرات الكامل";
    taskBadgeFr = "Étude du signe de f'(x) et tableau complet des variations";
    methodStepsAr = [
      "1. حساب المشتقة f'(x) وتعميلها على حيز التعريف",
      "2. تعليل إشارة f'(x) وتحديد المطارف",
      "3. ملء جدول التغيرات الكامل مع النهايات عند المحدات",
    ];
    methodStepsFr = [
      "1. Calcul et factorisation de la dérivée f'(x)",
      "2. Justification du signe de f'(x) sur Df",
      "3. Tableau complet des variations avec limites aux bornes",
    ];
  } else if (isRecurrence) {
    taskType = "RECURRENCE_PROOF";
    baseLines = 10;
    extraScaffoldPx = 42;
    taskBadgeAr = "برهان كامل بالترجع (3 مراحل منهجية مفصلة)";
    taskBadgeFr = "Raisonnement complet par récurrence (3 étapes rigoureuses)";
    methodStepsAr = [
      "1. التحقق الأساسي (Initialisation) من أجل الحد الأول n = n₀",
      "2. افتراض الترجع لـ n والبرهان على صحة الخاصية لـ n + 1 (Hérédité)",
      "3. الاستنتاج النهائي حسب مبدأ الترجع لكل n",
    ];
    methodStepsFr = [
      "1. Initialisation : vérification pour le premier rang n = n₀",
      "2. Hérédité : hypothèse au rang n et démonstration au rang n+1",
      "3. Conclusion : synthèse selon le principe de récurrence",
    ];
  } else if (
    isMultiStepProof ||
    levelStr.includes("3") ||
    levelStr.includes("N3") ||
    levelStr.includes("SYNTH")
  ) {
    taskType = "MULTI_STEP_PROOF";
    baseLines = levelStr.includes("3") || levelStr.includes("N3") ? 10 : 8;
    extraScaffoldPx = 24;
    taskBadgeAr = "استدلال رياضي متعدد المراحل وتحرير مفصل للجواب الكامل";
    taskBadgeFr = "Démonstration structurée multi-étapes & rédaction complète";
    methodStepsAr = [
      "1. صياغة المعطيات والشروط اللازمة لتطبيق المبرهنة",
      "2. التسلسل المنطقي للبرهان أو التكامل خطوة بخطوة",
      "3. استخلاص النتيجة النهائية وتأطيرها بوضوح",
    ];
    methodStepsFr = [
      "1. Énoncé des hypothèses et conditions d'application",
      "2. Développement logique étape par étape",
      "3. Conclusion mathématique encadrée",
    ];
  } else {
    taskType = "CALCULATION";
    baseLines = levelStr.includes("2") || levelStr.includes("N2") ? 7 : 6;
    extraScaffoldPx = 18;
  }

  // تعديل عدد الأسطر بناءً على عدد الأسئلة الفرعية، وزن النقط، وطول الحل النموذجي
  if (subQuestionsCount > 1) {
    baseLines += (subQuestionsCount - 1) * 3;
  }
  if (pts >= 2.0) {
    baseLines += 3;
  } else if (pts >= 1.25) {
    baseLines += 2;
  }

  if (params.solutionText) {
    const solArrows = (params.solutionText.match(/⇒|⇔|→|\n|؛/g) || []).length;
    const estimatedSolLines = Math.ceil(params.solutionText.length / 65) + solArrows;
    baseLines = Math.max(baseLines, Math.min(18, estimatedSolLines + 3));
  }

  // تطبيق معامل كثافة الارتفاع المختار من طرف الأستاذ
  if (params.workspaceHeightMode === "COMPACT") {
    baseLines = Math.max(4, Math.round(baseLines * 0.8));
  } else if (params.workspaceHeightMode === "GENEROUS") {
    baseLines = Math.round(baseLines * 1.25) + 2;
  }

  // تطبيق التعديل اليدوي لعدد الأسطر (+ / -) إن وجد
  const recommendedLines = Math.max(
    4,
    Math.min(28, baseLines + (params.customLineDelta || 0))
  );

  // كل سطر كراسة يعادل 26px + المساحة المخصصة للهياكل المدمجة (معلم أو جدول تغيرات)
  const heightPx = Math.max(136, recommendedLines * 26 + extraScaffoldPx);

  // تحويل الارتفاع إلى سنتيمترات دقيقة لملفات LaTeX و Typst لضمان تطابق الورقة المطبوعة
  const cmVal = Math.max(3.2, Math.min(11.5, Number((heightPx / 36).toFixed(1))));
  const heightCmLatex = `${cmVal}cm`;
  const heightCmTypst = `${cmVal}cm`;

  return {
    taskType,
    recommendedLines,
    heightPx,
    heightCmLatex,
    heightCmTypst,
    taskBadgeAr,
    taskBadgeFr,
    methodStepsAr,
    methodStepsFr,
    subQuestionsCount,
  };
}

