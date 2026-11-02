export type MathSymbolCategory =
  | "ALL"
  | "OPERATIONS"
  | "ANALYSIS"
  | "GEOMETRY"
  | "SETS_LOGIC"
  | "GREEK";

export interface MathSymbolItem {
  glyph: string;
  latex: string;
  nameAr: string;
  nameFr: string;
  category: Exclude<MathSymbolCategory, "ALL">;
  keywords?: string[];
}

export interface MathCategoryMeta {
  id: MathSymbolCategory;
  iconGlyph: string;
  labelAr: string;
  labelFr: string;
}

export const MATH_SYMBOL_CATEGORIES: MathCategoryMeta[] = [
  { id: "ALL", iconGlyph: "∑±", labelAr: "الكل", labelFr: "Tous" },
  { id: "OPERATIONS", iconGlyph: "×÷", labelAr: "العمليات والجبر", labelFr: "Opérations" },
  { id: "ANALYSIS", iconGlyph: "∫lim", labelAr: "التحليل والتكامل", labelFr: "Analyse" },
  { id: "GEOMETRY", iconGlyph: "u⃗⊥", labelAr: "الهندسة والمتجهات", labelFr: "Géométrie" },
  { id: "SETS_LOGIC", iconGlyph: "ℝ⇒", labelAr: "المجموعات والمنطق", labelFr: "Logique" },
  { id: "GREEK", iconGlyph: "αΔ", labelAr: "رموز إغريقية", labelFr: "Grec" },
];

export const MATH_SYMBOLS_LIBRARY: MathSymbolItem[] = [
  // 1. العمليات الحسابية والجبرية (Opérations Arithmétiques & Algébriques)
  { glyph: "+", latex: "+", nameAr: "جمع", nameFr: "Addition", category: "OPERATIONS", keywords: ["plus", "زائد"] },
  { glyph: "−", latex: "-", nameAr: "طرح / ناقص", nameFr: "Soustraction", category: "OPERATIONS", keywords: ["minus", "ناقص"] },
  { glyph: "×", latex: "\\times", nameAr: "ضرب / جداء", nameFr: "Multiplication", category: "OPERATIONS", keywords: ["times", "ضرب"] },
  { glyph: "÷", latex: "\\div", nameAr: "قسمة", nameFr: "Division", category: "OPERATIONS", keywords: ["div", "قسمة"] },
  { glyph: "±", latex: "\\pm", nameAr: "زائد أو ناقص", nameFr: "Plus ou moins", category: "OPERATIONS", keywords: ["pm"] },
  { glyph: "∓", latex: "\\mp", nameAr: "ناقص أو زائد", nameFr: "Moins ou plus", category: "OPERATIONS", keywords: ["mp"] },
  { glyph: "=", latex: "=", nameAr: "يساوي", nameFr: "Égal", category: "OPERATIONS", keywords: ["equal", "تساوي"] },
  { glyph: "≠", latex: "\\neq", nameAr: "يخالف", nameFr: "Différent de", category: "OPERATIONS", keywords: ["neq", "لا يساوي"] },
  { glyph: "≈", latex: "\\approx", nameAr: "يقارب بالتقريب", nameFr: "Environ égal", category: "OPERATIONS", keywords: ["approx", "تقريبا"] },
  { glyph: "≡", latex: "\\equiv", nameAr: "يوافق بترديد", nameFr: "Congru à", category: "OPERATIONS", keywords: ["modulo", "ترديد"] },
  { glyph: "≤", latex: "\\le", nameAr: "أصغر من أو يساوي", nameFr: "Inférieur ou égal", category: "OPERATIONS", keywords: ["le", "اصغر"] },
  { glyph: "≥", latex: "\\ge", nameAr: "أكبر من أو يساوي", nameFr: "Supérieur ou égal", category: "OPERATIONS", keywords: ["ge", "اكبر"] },
  { glyph: "a/b", latex: "\\frac{a}{b}", nameAr: "كسر اعتيادي", nameFr: "Fraction a/b", category: "OPERATIONS", keywords: ["frac", "كسر"] },
  { glyph: "x²", latex: "x^{2}", nameAr: "مربع عدد (أس 2)", nameFr: "Carré x²", category: "OPERATIONS", keywords: ["square", "مربع"] },
  { glyph: "xⁿ", latex: "x^{n}", nameAr: "قوة / أس n", nameFr: "Puissance xⁿ", category: "OPERATIONS", keywords: ["power", "أس", "قوة"] },
  { glyph: "√x", latex: "\\sqrt{x}", nameAr: "جذر مربع", nameFr: "Racine carrée", category: "OPERATIONS", keywords: ["sqrt", "جذر"] },
  { glyph: "ⁿ√x", latex: "\\sqrt[n]{x}", nameAr: "جذر من الرتبة n", nameFr: "Racine n-ième", category: "OPERATIONS", keywords: ["root", "جذر نوني"] },
  { glyph: "|x|", latex: "|x|", nameAr: "القيمة المطلقة", nameFr: "Valeur absolue", category: "OPERATIONS", keywords: ["abs", "مطلقة"] },
  { glyph: "n!", latex: "n!", nameAr: "عاملي n", nameFr: "Factorielle n!", category: "OPERATIONS", keywords: ["fact", "عاملي"] },
  { glyph: "Cₙᵏ", latex: "C_n^k", nameAr: "تأليفة (تعداد)", nameFr: "Combinaison", category: "OPERATIONS", keywords: ["comb", "تأليفة"] },

  // 2. التحليل الرياضي والاشتقاق والتكامل (Analyse & Calcul Intégral)
  { glyph: "∫", latex: "\\int_{a}^{b}", nameAr: "تكامل", nameFr: "Intégrale", category: "ANALYSIS", keywords: ["int"] },
  { glyph: "∑", latex: "\\sum_{k=1}^{n}", nameAr: "مجموع سيغما", nameFr: "Somme", category: "ANALYSIS", keywords: ["sum"] },
  { glyph: "∏", latex: "\\prod_{k=1}^{n}", nameAr: "جداء متتالي", nameFr: "Produit", category: "ANALYSIS", keywords: ["prod"] },
  { glyph: "lim", latex: "\\lim_{x \\to +\\infty}", nameAr: "نهاية دالة", nameFr: "Limite", category: "ANALYSIS", keywords: ["limit"] },
  { glyph: "f'(x)", latex: "f'(x)", nameAr: "مشتقة أولى", nameFr: "Dérivée première", category: "ANALYSIS", keywords: ["deriv"] },
  { glyph: "f''(x)", latex: "f''(x)", nameAr: "مشتقة ثانية", nameFr: "Dérivée seconde", category: "ANALYSIS", keywords: ["deriv2"] },
  { glyph: "∂", latex: "\\partial", nameAr: "مشتق جزئي", nameFr: "Dérivée partielle", category: "ANALYSIS", keywords: ["partial"] },
  { glyph: "eˣ", latex: "e^{x}", nameAr: "دالة أسية", nameFr: "Exponentielle", category: "ANALYSIS", keywords: ["exp"] },
  { glyph: "ln(x)", latex: "\\ln(x)", nameAr: "لوغاريتم نبيري", nameFr: "Logarithme népérien", category: "ANALYSIS", keywords: ["ln", "log"] },
  { glyph: "(uₙ)", latex: "(u_n)_{n \\in \\mathbb{N}}", nameAr: "متتالية عددية", nameFr: "Suite numérique", category: "ANALYSIS", keywords: ["suite"] },
  { glyph: "∞", latex: "+\\infty", nameAr: "لا نهاية", nameFr: "Infini", category: "ANALYSIS", keywords: ["inf"] },
  { glyph: "π", latex: "\\pi", nameAr: "العدد باي", nameFr: "Pi", category: "ANALYSIS", keywords: ["pi"] },
  { glyph: "(𝒞f)", latex: "(\\mathcal{C}_f)", nameAr: "منحنى الدالة", nameFr: "Courbe représentative", category: "ANALYSIS", keywords: ["courbe"] },
  { glyph: "dx", latex: "\\,\\mathrm{d}x", nameAr: "تفاضل x", nameFr: "Différentielle", category: "ANALYSIS", keywords: ["dx"] },

  // 3. الهندسة والمتجهات والفضاء (Géométrie, Vecteurs & Espace)
  { glyph: "u⃗", latex: "\\vec{u}", nameAr: "متجهة u", nameFr: "Vecteur u", category: "GEOMETRY" },
  { glyph: "v⃗", latex: "\\vec{v}", nameAr: "متجهة v", nameFr: "Vecteur v", category: "GEOMETRY" },
  { glyph: "AB⃗", latex: "\\overrightarrow{AB}", nameAr: "متجهة AB", nameFr: "Vecteur AB", category: "GEOMETRY" },
  { glyph: "n⃗", latex: "\\vec{n}", nameAr: "متجهة منظمية", nameFr: "Vecteur normal", category: "GEOMETRY" },
  { glyph: "‖u⃗‖", latex: "\\|\\vec{u}\\|", nameAr: "معيار متجهة", nameFr: "Norme de vecteur", category: "GEOMETRY" },
  { glyph: "u⃗·v⃗", latex: "\\vec{u} \\cdot \\vec{v}", nameAr: "جداء سلمي", nameFr: "Produit scalaire", category: "GEOMETRY" },
  { glyph: "u⃗∧v⃗", latex: "\\vec{u} \\wedge \\vec{v}", nameAr: "جداء متجهي", nameFr: "Produit vectoriel", category: "GEOMETRY" },
  { glyph: "⊥", latex: "\\perp", nameAr: "تعامد", nameFr: "Perpendiculaire", category: "GEOMETRY" },
  { glyph: "∥", latex: "\\parallel", nameAr: "توازي", nameFr: "Parallèle", category: "GEOMETRY" },
  { glyph: "(𝒟)", latex: "(\\mathcal{D})", nameAr: "مستقيم D", nameFr: "Droite D", category: "GEOMETRY" },
  { glyph: "(𝒫)", latex: "(\\mathcal{P})", nameAr: "مستوى P", nameFr: "Plan P", category: "GEOMETRY" },
  { glyph: "(𝒮)", latex: "(\\mathcal{S})", nameAr: "فلكة S", nameFr: "Sphère S", category: "GEOMETRY" },
  { glyph: "(O,i⃗,j⃗,k⃗)", latex: "(O, \\vec{i}, \\vec{j}, \\vec{k})", nameAr: "معلم متعامد ممنظم", nameFr: "Repère orthonormé", category: "GEOMETRY" },

  // 4. المجموعات والمنطق (Ensembles & Logique)
  { glyph: "ℝ", latex: "\\mathbb{R}", nameAr: "مجموعة الأعداد الحقيقية", nameFr: "Ensemble des réels", category: "SETS_LOGIC" },
  { glyph: "ℕ", latex: "\\mathbb{N}", nameAr: "الأعداد الصحيحة الطبيعية", nameFr: "Entiers naturels", category: "SETS_LOGIC" },
  { glyph: "ℤ", latex: "\\mathbb{Z}", nameAr: "الأعداد الصحيحة النسبية", nameFr: "Entiers relatifs", category: "SETS_LOGIC" },
  { glyph: "ℚ", latex: "\\mathbb{Q}", nameAr: "الأعداد الجذرية", nameFr: "Rationnels", category: "SETS_LOGIC" },
  { glyph: "ℂ", latex: "\\mathbb{C}", nameAr: "الأعداد العقدية", nameFr: "Nombres complexes", category: "SETS_LOGIC" },
  { glyph: "∈", latex: "\\in", nameAr: "ينتمي إلى", nameFr: "Appartient à", category: "SETS_LOGIC" },
  { glyph: "∉", latex: "\\notin", nameAr: "لا ينتمي", nameFr: "N'appartient pas", category: "SETS_LOGIC" },
  { glyph: "⊂", latex: "\\subset", nameAr: "ضمن / احتواء", nameFr: "Inclus dans", category: "SETS_LOGIC" },
  { glyph: "∩", latex: "\\cap", nameAr: "تقاطع مجموعتين", nameFr: "Intersection", category: "SETS_LOGIC" },
  { glyph: "∪", latex: "\\cup", nameAr: "اتحاد مجموعتين", nameFr: "Union", category: "SETS_LOGIC" },
  { glyph: "⇒", latex: "\\implies", nameAr: "استلزام منطقي", nameFr: "Implication", category: "SETS_LOGIC" },
  { glyph: "⇔", latex: "\\iff", nameAr: "تكافؤ منطقي", nameFr: "Équivalence", category: "SETS_LOGIC" },
  { glyph: "∀", latex: "\\forall", nameAr: "مهما يكن (لكل)", nameFr: "Pour tout", category: "SETS_LOGIC" },
  { glyph: "∃", latex: "\\exists", nameAr: "يوجد على الأقل", nameFr: "Il existe", category: "SETS_LOGIC" },
  { glyph: "∃!", latex: "\\exists!", nameAr: "يوجد عنصر وحيد", nameFr: "Il existe un unique", category: "SETS_LOGIC" },
  { glyph: "∅", latex: "\\emptyset", nameAr: "المجموعة الفارغة", nameFr: "Ensemble vide", category: "SETS_LOGIC" },

  // 5. الحروف اليونانية والثوابت (Lettres Grecques & Constantes)
  { glyph: "α", latex: "\\alpha", nameAr: "ألفا", nameFr: "Alpha", category: "GREEK" },
  { glyph: "β", latex: "\\beta", nameAr: "بيتا", nameFr: "Bêta", category: "GREEK" },
  { glyph: "γ", latex: "\\gamma", nameAr: "غاما", nameFr: "Gamma", category: "GREEK" },
  { glyph: "θ", latex: "\\theta", nameAr: "ثيتا (عمدة/زاوية)", nameFr: "Thêta", category: "GREEK" },
  { glyph: "λ", latex: "\\lambda", nameAr: "لامدا (معامل)", nameFr: "Lambda", category: "GREEK" },
  { glyph: "Δ", latex: "\\Delta", nameAr: "دلتا (مميز المعادلة)", nameFr: "Discriminant Delta", category: "GREEK" },
  { glyph: "Ω", latex: "\\Omega", nameAr: "أوميغا (فضاء الإمكانيات/مركز)", nameFr: "Oméga", category: "GREEK" },
  { glyph: "σ", latex: "\\sigma", nameAr: "سيغما (انحراف معياري)", nameFr: "Écart-type Sigma", category: "GREEK" },
  { glyph: "φ", latex: "\\varphi", nameAr: "فاي", nameFr: "Phi", category: "GREEK" },
];

export function filterMathSymbols(
  category: MathSymbolCategory,
  searchQuery: string = ""
): MathSymbolItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return MATH_SYMBOLS_LIBRARY.filter((item) => {
    const matchesCategory = category === "ALL" || item.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const haystacks = [
      item.glyph.toLowerCase(),
      item.latex.toLowerCase(),
      item.nameAr.toLowerCase(),
      item.nameFr.toLowerCase(),
      ...(item.keywords || []).map((k) => k.toLowerCase()),
    ];
    return haystacks.some((h) => h.includes(normalizedQuery));
  });
}

export function shouldEnablePedagogyFullscreen(tabId: string): boolean {
  return String(tabId || "").trim() === "pedagogy";
}
