import { LessonItem, SerieExerciseBlock, getVariantQuestions } from "../data/curriculum";

export interface MoroccanLessonMemo {
  lessonTitleAr: string;
  lessonTitleFr: string;
  coreDefinitionAr: string;
  coreDefinitionFr: string;
  essentialFormulasAr: string[];
  essentialFormulasFr: string[];
  commonPitfallsAr: string[];
  commonPitfallsFr: string[];
  inspectorAdviceAr: string;
  inspectorAdviceFr: string;
}

export type MoroccanDMType =
  | "RECHERCHE_SYNTHESE"
  | "TICE_GEOGEBRA"
  | "MODELISATION_OPTIMISATION"
  | "PREPARATOIRE_DS";

export interface MoroccanDMConfig {
  type: MoroccanDMType;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr: string;
  estimatedHours: string;
  badgeColor: string;
}

export const MOROCCAN_DM_PRESETS: Record<MoroccanDMType, MoroccanDMConfig> = {
  RECHERCHE_SYNTHESE: {
    type: "RECHERCHE_SYNTHESE",
    titleAr: "فرض منزلي استكشافي وتوليفي (Recherche & Synthèse)",
    titleFr: "Devoir Maison de Recherche, Synthèse & Approfondissement",
    descriptionAr: "يركز على الربط الديداكتيكي بين عدة فصول، وتوظيف الاستدلال بالترجع والخلف، ومسائل البحث المفتوح.",
    descriptionFr: "Mobilisation transversale de plusieurs chapitres, raisonnements par récurrence/l'absurde et questions ouvertes.",
    estimatedHours: "2h30 à 3h00",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
  },
  TICE_GEOGEBRA: {
    type: "TICE_GEOGEBRA",
    titleAr: "فرض منزلي مدعم بالتكنولوجيا والبرمجيات (TICE & GeoGebra)",
    titleFr: "Devoir Maison avec Expérimentation TICE & Simulation GeoGebra",
    descriptionAr: "يعتمد على التخمين البياني بواسطة برمجية GeoGebra أو خوارزميات بايثون قبل البرهان الجبري الصارم.",
    descriptionFr: "Conjecture graphique et expérimentation dynamique sous GeoGebra avant la démonstration analytique rigoureuse.",
    estimatedHours: "2h00",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  MODELISATION_OPTIMISATION: {
    type: "MODELISATION_OPTIMISATION",
    titleAr: "فرض منزلي للنمذجة الرياضية والاستمثال (Modélisation Réelle)",
    titleFr: "Devoir Maison de Modélisation Concrète & Problèmes d'Optimisation",
    descriptionAr: "معالجة وضعيات واقعية مستقاة من الفيزياء والاقتصاد وعلم الأحياء وحساب المساحات والحجوم القصوية.",
    descriptionFr: "Modélisation de situations concrètes (physique, économie, SVT), recherche d'extrema et optimisation de ressources.",
    estimatedHours: "2h30",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
  },
  PREPARATOIRE_DS: {
    type: "PREPARATOIRE_DS",
    titleAr: "فرض منزلي تحضيري تدريبي للفرض المحروس (Préparation au DS)",
    titleFr: "Devoir Maison d'Entraînement Ciblé & Consolidation Pré-DS",
    descriptionAr: "محاكاة شاملة لبنية الفرض المحروس القادم لتمكين المتعلم من التقييم الذاتي ومعالجة الثغرات قبل الامتحان.",
    descriptionFr: "Simulation conforme au format du prochain DS ministériel permettant l'auto-évaluation et la remédiation préventive.",
    estimatedHours: "2h00",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
  },
};

/**
 * يولد كبسولة ملخص الدرس التذكيري (Fiche Mémo / Rappel Express)
 * وفق المقاربة البيداغوجية لمفتشي مادة الرياضيات بالثانوي التأهيلي المغربي
 */
export function getMoroccanLessonMemo(lesson: LessonItem): MoroccanLessonMemo {
  const lAr = lesson.lessonAr;
  const lFr = lesson.lessonFr;
  const subCat = lesson.subCategory || "تحليل";
  const titleFr = lFr.toLowerCase();

  if (titleFr.includes("dériv") || titleFr.includes("اشتقاق") || titleFr.includes("etude de fonction")) {
    return {
      lessonTitleAr: lAr,
      lessonTitleFr: lFr,
      coreDefinitionAr: "العدد المشتق f'(x₀) يمثل المعامل الموجه لمماس منحنى الدالة عند النقطة (x₀, f(x₀))، والسرعة اللحظية لتغير الظاهرة.",
      coreDefinitionFr: "Le nombre dérivé f'(x₀) est le coefficient directeur de la tangente à (C_f) en x₀, soit la limite du taux d'accroissement quand x → x₀.",
      essentialFormulasAr: [
        "مشتقة الجداء: (u · v)' = u'v + uv'",
        "مشتقة الخارج: (u / v)' = (u'v - uv') / v²",
        "مشتقة المركب: (v ∘ u)'(x) = u'(x) · v'(u(x))",
        "مشتقة الجذر النوني: (ⁿ√u)' = u' / (n · ⁿ√(uⁿ⁻¹))",
        "معادلة المماس: (T) : y = f'(x₀)(x - x₀) + f(x₀)",
      ],
      essentialFormulasFr: [
        "Produit : (u · v)' = u'v + uv'",
        "Quotient : (u / v)' = (u'v - uv') / v²",
        "Composée : (v ∘ u)'(x) = u'(x) · v'(u(x))",
        "Racine n-ième : (ⁿ√u)' = u' / (n · ⁿ√(uⁿ⁻¹))",
        "Tangente en x₀ : y = f'(x₀)(x - x₀) + f(x₀)",
      ],
      commonPitfallsAr: [
        "نسيان شرط قابلية الاشتقاق قبل حساب المشتقة على مجال مفتوح.",
        "الخطأ الشائع في إشارة مشتقة الخارج: كتابة u'v + uv' بدل u'v - uv'.",
        "إغفال مشتقة الدالة الداخلية u'(x) عند اشتقاق الدالة المركبة f(u(x)).",
        "الخلط بين إشارة الدالة المشتقة f'(x) وإشارة الدالة الأصلية f(x).",
      ],
      commonPitfallsFr: [
        "Oublier de justifier la dérivabilité sur un intervalle ouvert avant tout calcul.",
        "Erreur de signe fréquente sur la dérivée d'un quotient : u'v - uv' et non u'v + uv'.",
        "Omission de la dérivée interne u'(x) lors de la dérivation d'une fonction composée.",
        "Confusion entre le signe de f'(x) (qui donne le sens de variation) et le signe de f(x).",
      ],
      inspectorAdviceAr: "توجيه المفتش: اضبط جدول إشارة f'(x) بعناية فائقة، ودون بدقة النهايات وقيم النقط المميزة في جدول التغيرات لضمان رسم منحنٍ سليم.",
      inspectorAdviceFr: "Conseil de l'Inspecteur : Soigner le tableau de variations en y reportant limites aux bornes et extremums pour sécuriser le tracé graphique de (C_f).",
    };
  }

  if (titleFr.includes("continu") || titleFr.includes("اتصال") || titleFr.includes("limite") || titleFr.includes("نهايات")) {
    return {
      lessonTitleAr: lAr,
      lessonTitleFr: lFr,
      coreDefinitionAr: "تكون الدالة f متصلة في النقطة x₀ إذا وفقط إذا كانت lim_{x→x₀} f(x) = f(x₀). مبرهنة القيم الوسيطية (TVI) تؤكد وجود الحلول للمعادلات المستعصية.",
      coreDefinitionFr: "f est continue en x₀ ssi lim_{x→x₀} f(x) = f(x₀). Le TVI assure l'existence de racines pour f(x) = 0 sur [a, b].",
      essentialFormulasAr: [
        "شرط الاتصال على اليمين واليسار: lim_{x→x₀⁺} f(x) = lim_{x→x₀⁻} f(x) = f(x₀)",
        "مبرهنة القيم الوسيطية: إذا كانت f متصلة على [a, b] وكان f(a)·f(b) < 0، فإنه يوجد على الأقل c ∈ ]a, b[ بحيث f(c) = 0",
        "مبرهنة الدالة العكسية: كل دالة متصلة ورتيبة قطعا على مجال I تقبل دالة عكسية f⁻¹ معرفة على f(I)",
        "نهايات الدوال المثلثية: lim_{x→0} sin(x)/x = 1 و lim_{x→0} (1 - cos(x))/x² = 1/2",
      ],
      essentialFormulasFr: [
        "Continuité à gauche/droite : lim_{x→x₀⁺} f(x) = lim_{x→x₀⁻} f(x) = f(x₀)",
        "Théorème des Valeurs Intermédiaires (TVI) : f continue sur [a,b] et f(a)f(b) < 0 ⇒ ∃ c ∈ ]a,b[, f(c) = 0",
        "Théorème de la bijection : f continue et strictement monotone sur I ⇒ f bijective de I sur f(I)",
        "Limites trigonométriques clés : lim_{x→0} sin(x)/x = 1 et lim_{x→0} (1 - cos(x))/x² = 1/2",
      ],
      commonPitfallsAr: [
        "تطبيق مبرهنة القيم الوسيطية دون التحقق من شرط الاتصال على مجال مغلق [a, b].",
        "الادعاء بوحدانية الحل دون التحقق الصارم من الرتابة قطعا للدالة.",
        "الخلط بين الأشكال غير المحددة الأربعة: (0/0، ∞/∞، 0×∞، +∞ - ∞).",
      ],
      commonPitfallsFr: [
        "Appliquer le TVI sans préciser la continuité sur l'intervalle fermé [a, b].",
        "Conclure à l'unicité de la solution sans prouver la stricte monotonie.",
        "Confusion entre formes indéterminées réelles et limites directes usuelles.",
      ],
      inspectorAdviceAr: "توجيه المفتش: صغ شروط مبرهنة القيم الوسيطية بدقة: الاتصال، الرتابة قطعا، وإشارة الجداء f(a)·f(b) لضمان النقطة الكاملة في الامتحان الوطني.",
      inspectorAdviceFr: "Conseil de l'Inspecteur : Rédiger rigoureusement les trois hypothèses du TVI : continuité, stricte monotonie et f(a)·f(b) < 0.",
    };
  }

  if (titleFr.includes("suite") || titleFr.includes("متتالي")) {
    return {
      lessonTitleAr: lAr,
      lessonTitleFr: lFr,
      coreDefinitionAr: "المتتالية العددية هي تطبيق من جزء من ℕ نحو ℝ. دراسة التقارب تعتمد على الرتابة والحدود (مكبرة / مصغرة) أو مبرهنات المقارنة والدرك.",
      coreDefinitionFr: "Une suite est une fonction définie sur une partie de ℕ à valeurs dans ℝ. Toute suite croissante et majorée converge dans ℝ.",
      essentialFormulasAr: [
        "متتالية حسابية: u_{n+1} = u_n + r ⇒ u_n = u_p + (n - p)r والـمجموع: S = (n - p + 1)(u_p + u_n)/2",
        "متتالية هندسية: u_{n+1} = q · u_n ⇒ u_n = u_p · qⁿ⁻ᵖ والـمجموع: S = u_p · (1 - qⁿ⁻ᵖ⁺¹)/(1 - q)",
        "مبرهنة التقارب المونوطوني: كل متتالية تزايدية ومكبرة متقاربة، وكل متتالية تناقصية ومصغرة متقاربة",
        "المتتالية المرتبطة بدالة u_{n+1} = f(u_n): إذا كانت متقاربة نحو ℓ و f متصلة فإن f(ℓ) = ℓ",
      ],
      essentialFormulasFr: [
        "Suite arithmétique : u_n = u_p + (n - p)r et Somme S = (nb termes)(premier + dernier)/2",
        "Suite géométrique : u_n = u_p · qⁿ⁻ᵖ et Somme S = premier · (1 - q^{nb}) / (1 - q)",
        "Théorème de convergence monotone : toute suite croissante majorée converge dans ℝ",
        "Suite récurrente u_{n+1} = f(u_n) : si u_n → ℓ et f continue, alors la limite vérifie f(ℓ) = ℓ",
      ],
      commonPitfallsAr: [
        "الخطأ في حساب عدد حدود المجموع: عدد الحدود هو (دليل النهاية - دليل البداية + 1).",
        "إغفال شرط استقرار المجال f(I) ⊂ I عند دراسة المتتاليات التراجعية u_{n+1} = f(u_n).",
        "الاستنتاج الخاطئ أن المتتالية المتقاربة يجب أن تكون حسابية أو هندسية بالضرورة.",
      ],
      commonPitfallsFr: [
        "Erreur récurrente sur le nombre de termes d'une somme : n - p + 1.",
        "Oublier de vérifier la stabilité de l'intervalle f(I) ⊂ I pour u_{n+1} = f(u_n).",
        "Confusion entre la convergence d'une suite et sa monotonie.",
      ],
      inspectorAdviceAr: "توجيه المفتش: في البرهان بالترجع، اكتب بوضوح عبارة «نفترض أن الخاصية صحيحة من أجل n ونبين صحتها من أجل n+1» مع التأكيد على التحقق من الرتبة الأولى.",
      inspectorAdviceFr: "Conseil de l'Inspecteur : Soigner la structure en 3 étapes du raisonnement par récurrence : initialisation, hérédité et conclusion.",
    };
  }

  if (titleFr.includes("complex") || titleFr.includes("عقدية")) {
    return {
      lessonTitleAr: lAr,
      lessonTitleFr: lFr,
      coreDefinitionAr: "الأعداد العقدية ℂ تمدد الحقل ℝ وتتيح حل جميع المعادلات الحدودية، وتقدم جسراً هندسياً رفيعاً للتحويلات المستوية (الإزاحة، التحاكي، الدوران).",
      coreDefinitionFr: "L'ensemble ℂ des nombres complexes permet la résolution des équations polynomiales et fournit un cadre algébrique élégant pour la géométrie plane.",
      essentialFormulasAr: [
        "الشكل الجبري: z = a + ib مع a, b ∈ ℝ و i² = -1",
        "المعيار والعمدة: |z| = √(a² + b²) و z = |z|(cos θ + i sin θ) = |z|e^{iθ}",
        "صيغة موآفر: (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)",
        "صيغ أويلر: cos θ = (e^{iθ} + e^{-iθ})/2 و sin θ = (e^{iθ} - e^{-iθ})/(2i)",
        "التمثيل العقدي للدوران: R(Ω, θ) : z' - ω = e^{iθ}(z - ω)",
      ],
      essentialFormulasFr: [
        "Forme algébrique : z = a + ib avec a, b ∈ ℝ et i² = -1",
        "Module et argument : |z| = √(a² + b²) et z = |z|e^{iθ}",
        "Formule de Moivre : (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)",
        "Formules d'Euler : cos θ = (e^{iθ} + e^{-iθ})/2 et sin θ = (e^{iθ} - e^{-iθ})/(2i)",
        "Écriture complexe d'une rotation : z' - ω = e^{iθ}(z - ω)",
      ],
      commonPitfallsAr: [
        "نسيان الإشارة السالبة في مربع الوحدة التخيلية: i² = -1 وليس 1.",
        "حساب المعيار: كتابة √(a² + (ib)²) بدل √(a² + b²).",
        "الخلط بين زوايا الدوران والتحاكي ذي النسبة السالبة.",
      ],
      commonPitfallsFr: [
        "Oublier que i² = -1 lors du développement d'expressions algébriques.",
        "Calcul de module : écrire faussement √(a² + (ib)²) au lieu de √(a² + b²).",
        "Confusion entre angle de rotation et argument d'un rapport de colinéarité.",
      ],
      inspectorAdviceAr: "توجيه المفتش: اربط دوماً بين المقادير العقدية والتأويل الهندسي: arg((z_C - z_A)/(z_B - z_A)) يمثل قياس الزاوية الموجهة (AB⃗, AC⃗).",
      inspectorAdviceFr: "Conseil de l'Inspecteur : Relier systématiquement l'algèbre complexe à la géométrie : arg((z_C - z_A)/(z_B - z_A)) = (AB⃗, AC⃗) [2π].",
    };
  }

  if (titleFr.includes("espace") || titleFr.includes("فضائية") || subCat === "هندسة فضائية") {
    return {
      lessonTitleAr: lAr,
      lessonTitleFr: lFr,
      coreDefinitionAr: "الهندسة الفضائية التحليلية تدرس التعامد، التوازي، المستويات، المستقيمات، والفلكات باستعمال المتجهات، الجداء السلمي والجداء المتجهي.",
      coreDefinitionFr: "La géométrie analytique de l'espace étudie droites, plans et sphères via les vecteurs, le produit scalaire et le produit vectoriel.",
      essentialFormulasAr: [
        "معادلة المستوى: ax + by + cz + d = 0 مع n⃗(a, b, c) متجهة منظمية",
        "التمثيل البارامتري لمستقيم: x = x_A + at, y = y_A + bt, z = z_A + ct (t ∈ ℝ)",
        "مسافة نقطة عن مستوى: d(M₀, (P)) = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)",
        "معادلة الفلكة: S(Ω, R) : (x - a)² + (y - b)² + (z - c)² = R²",
        "الجداء المتجهي u⃗ ∧ v⃗: منظم u⃗ ∧ v⃗ يمثل مساحة متوازي الأضلاع، ويكون عمودياً على u⃗ و v⃗",
      ],
      essentialFormulasFr: [
        "Équation cartésienne d'un plan : ax + by + cz + d = 0 avec n⃗(a, b, c) vecteur normal",
        "Représentation paramétrique de droite : x = x_A + at, y = y_A + bt, z = z_A + ct",
        "Distance d'un point à un plan : d(M₀, P) = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)",
        "Équation de la sphère : (x - a)² + (y - b)² + (z - c)² = R²",
        "Produit vectoriel u⃗ ∧ v⃗ orthogonal à u⃗ et v⃗ avec ||u⃗ ∧ v⃗|| = aire du parallélogramme",
      ],
      commonPitfallsAr: [
        "الخلط بين المتجهة المنظمية على مستوى n⃗ والمتجهة الموجهة لمستقيم u⃗.",
        "نسيان القيمة المطلقة في بسط صيغة مسافة نقطة عن مستوى.",
        "الخطأ في حساب محددات الجداء المتجهي وضبط إشارة المعامل j⃗.",
      ],
      commonPitfallsFr: [
        "Confusion entre vecteur normal à un plan et vecteur directeur d'une droite.",
        "Oubli de la valeur absolue au numérateur de la distance point-plan.",
        "Erreur de signe sur la composante en j⃗ lors du calcul de u⃗ ∧ v⃗.",
      ],
      inspectorAdviceAr: "توجيه المفتش: لتحديد تقاطع فلكة مع مستوى، قارن المسافة d(Ω, (P)) مع شعاع الفلكة R (تقاطع فارغ، نقطة تماس، أو دائرة شعاعها r = √(R² - d²)).",
      inspectorAdviceFr: "Conseil de l'Inspecteur : Pour l'intersection plan-sphère, comparer systématiquement d = d(Ω, P) à R pour conclure (vide, tangent, cercle r = √(R² - d²)).",
    };
  }

  // الوضع الافتراضي العام لدروس الرياضيات المغربية
  return {
    lessonTitleAr: lAr,
    lessonTitleFr: lFr,
    coreDefinitionAr: `المفاهيم المحورية والقدرات المستهدفة وفق التوجيهات التربوية المغربية لدرس « ${lAr} ».`,
    coreDefinitionFr: `Notions clés et compétences attendues selon les Orientations Pédagogiques pour « ${lFr} ».`,
    essentialFormulasAr: [
      `الخاصية الأساسية الأولى: الاستيعاب الدقيق للتعريف الرياضي لـ « ${lesson.capacitiesAr[0] || lAr} ».`,
      `الخاصية الأساسية الثانية: البرهان المنطقي والتطبيق المباشر في الوضعيات القياسية.`,
      `الخاصية الأساسية الثالثة: التوليف وحل المعادلات والمتراجحات والمسائل التطبيقية.`,
    ],
    essentialFormulasFr: [
      `Propriété fondamentale 1 : Maîtrise rigoureuse de « ${lesson.capacitiesFr[0] || lFr} ».`,
      `Propriété fondamentale 2 : Démonstration logique et application directe usuelle.`,
      `Propriété fondamentale 3 : Résolution d'équations, inéquations et problèmes de synthèse.`,
    ],
    commonPitfallsAr: [
      "إغفال شروط التطبيق ومجال الصلاحية قبل الشروع في العمليات الحسابية.",
      "عدم تعليل الخطوات والاستدلال بالنتائج دون إبراز المبرهنات المعتمدة.",
    ],
    commonPitfallsFr: [
      "Oublier de vérifier le domaine de validité avant les calculs.",
      "Donner des résultats bruts sans justifier par les théorèmes du programme.",
    ],
    inspectorAdviceAr: "توجيه المفتش: التزم بالدقة المنهجية، واكتب بوضوح القواعد الرياضية المستعملة وأطر النتائج النهائية.",
    inspectorAdviceFr: "Conseil de l'Inspecteur : Rédiger avec rigueur, citer explicitement les théorèmes mobilisés et encadrer les résultats finaux.",
  };
}

export interface CustomSerieExerciseOption {
  exerciseIndex: number;
  exerciseNumber: number;
  lessonTitleAr: string;
  lessonTitleFr: string;
  levelBadgeAr: string;
  levelBadgeFr: string;
  stars: "★" | "★★" | "★★★";
  difficulty: "N1" | "N2" | "N3" | "N4";
  targetCapacityAr: string;
  targetCapacityFr: string;
  questionsAr: string[];
  questionsFr: string[];
  hintAr: string;
  hintFr: string;
  suggestedPoints?: string;
  didacticSectionAr?: string;
  didacticSectionFr?: string;
}

/**
 * يولد سلسلة تمارين مخصصة بعدد محدد بدقة يختاره الأستاذ (من 1 إلى 20 تمريناً)
 * مع تدرج ديداكتيكي دقيق (N1 تطبيق مباشر -> N2 تعبئة وتمارين نموذجية -> N3 توليف وامتحانات -> N4 مبادرة وأولمبياد)
 */
export function generateCustomCountSerieExercises(
  lessons: LessonItem[],
  targetCount: number = 6,
  model: "A" | "B" = "A"
): SerieExerciseBlock[] {
  const safeCount = Math.min(20, Math.max(1, targetCount));
  const primaryLesson = lessons[0] || {
    lessonAr: "الرياضيات",
    lessonFr: "Mathématiques",
    weight: 100,
    capacitiesAr: ["التحكم في المعارف الرياضية الأساسية", "البرهان وحل المشكلات"],
    capacitiesFr: ["Maîtrise des connaissances de base", "Raisonnement et résolution"],
  };

  const allBlocks: SerieExerciseBlock[] = [];

  // إذا كانت السلسلة تحتوي على أكثر من درس، نوزع التمارين على الدروس المختارة بالتساوي والتدرج
  for (let i = 0; i < safeCount; i++) {
    const lessonForEx = lessons[i % lessons.length] || primaryLesson;
    const { questionsAr, questionsFr } = getVariantQuestions(lessonForEx, model, false);
    const subCat = lessonForEx.subCategory || "تحليل";
    const titleFr = lessonForEx.lessonFr.toLowerCase();
    const cap0Ar = lessonForEx.capacitiesAr[0] || lessonForEx.lessonAr;
    const cap1Ar = lessonForEx.capacitiesAr[1] || cap0Ar;
    const cap0Fr = lessonForEx.capacitiesFr[0] || lessonForEx.lessonFr;
    const cap1Fr = lessonForEx.capacitiesFr[1] || cap0Fr;
    const exNum = i + 1;

    // تدرج بيداغوجي للصعوبة بناء على موقع التمرين بالنسبة للعدد الإجمالي
    const relativePos = safeCount > 1 ? i / (safeCount - 1) : 0;

    let badgeAr = "";
    let badgeFr = "";
    let stars: "★" | "★★" | "★★★" = "★";
    let qAr: string[] = [];
    let qFr: string[] = [];
    let hintAr = "";
    let hintFr = "";
    let partPts = "";

    if (relativePos < 0.25 || i === 0) {
      // المرحلة الأولى: تطبيق مباشر وأوتوماتيزمات الحساب (N1)
      stars = "★";
      partPts = "2.5";
      badgeAr = `التمرين ${exNum} (★) [تطبيق وأوتوماتيزمات N1] — ${lessonForEx.lessonAr}`;
      badgeFr = `Exercice ${exNum} (★) [Application & Automatismes N1] — ${lessonForEx.lessonFr}`;
      qAr = [
        `1. أ) أحسب وبسط التعابير الرياضية الأساسية المرتبطة بـ « ${cap0Ar} » في الحالات الاعتيادية.`,
        questionsAr[0] || `1. ب) تحقق من صحة العلاقات والصيغ المرجعية لدرس ${lessonForEx.lessonAr}.`,
        `2. حدد مجموعة التعريف وشروط الوجود والقيم الخاصة بالنسبة للتعبير المعطى.`,
      ];
      qFr = [
        `1. a) Calculer et simplifier les expressions fondamentales liées à « ${cap0Fr} ».`,
        questionsFr[0] || `1. b) Vérifier les formules fondamentales associées à ${lessonForEx.lessonFr}.`,
        `2. Préciser le domaine de validité et les valeurs remarquables de l'expression.`,
      ];
      hintAr = `تذكير ديداكتيكي: راجع التعاريف والخاصيات الأساسية المباشرة لـ ${lessonForEx.lessonAr}.`;
      hintFr = `Rappel didactique : Mobiliser directement les définitions du cours sur ${lessonForEx.lessonFr}.`;
    } else if (relativePos < 0.50 || i === 1) {
      // المرحلة الثانية: تعبئة الموارد وطرق الحساب النموذجية (N2)
      stars = "★★";
      partPts = "3.0";
      badgeAr = `التمرين ${exNum} (★★) [طرائق وتمارين نموذجية N2] — ${lessonForEx.lessonAr}`;
      badgeFr = `Exercice ${exNum} (★★) [Méthodes types & Modèles N2] — ${lessonForEx.lessonFr}`;
      qAr = [
        questionsAr[1] || `1. حل المعادلات والمتراجحات المقترنة بـ « ${cap0Ar} » في المجموعة ℝ.`,
        `2. أدرس الإشارة، أو احسب المشتقة والتقعر، أو استنتج رتابة التعبير الجبري بدقة.`,
        `3. اعطِ تأويلاً بيانياً أو هندسياً للنتائج المحصل عليها.`,
      ];
      qFr = [
        questionsFr[1] || `1. Résoudre les équations et inéquations associées à « ${cap0Fr} » dans ℝ.`,
        `2. Étudier le signe, la dérivabilité ou les variations de l'expression étudiée.`,
        `3. Interpréter géométriquement ou graphiquement les résultats obtenus.`,
      ];
      hintAr = `منهجية: انتبه لإشارات الحدود واستعمل جدول الإشارة للربط بين الجبر والهندسة.`;
      hintFr = `Méthode : Dresser un tableau de signes rigoureux et justifier chaque équivalence.`;
    } else if (relativePos < 0.75 || i === 2) {
      // المرحلة الثالثة: تمرين توليفي نوعي يربط عدة محاور (Type DS / Examen)
      stars = "★★";
      partPts = "3.5";
      badgeAr = `التمرين ${exNum} (★★) [توليفي ونمط الامتحان الوطني N3] — ${lessonForEx.lessonAr}`;
      badgeFr = `Exercice ${exNum} (★★) [Synthèse & Type Examen National N3] — ${lessonForEx.lessonFr}`;
      qAr = [
        questionsAr[2] || `1. بين أن الدالة أو المتتالية المدروسة متصلة ورتيبة على المجال المحدد.`,
        `2. طبق المبرهنات الأساسية (مبرهنة القيم الوسيطية TVI / مبرهنة التزايدات المنتهية TAF / مبرهنات الهندسة والفلكة).`,
        `3. استنتج حلاً وحيداً للمعادلة وأعط تأطيراً دقيقاً سعته 10⁻¹ للحل.`,
      ];
      qFr = [
        questionsFr[2] || `1. Démontrer la continuité et la stricte monotonie sur l'intervalle considéré.`,
        `2. Appliquer les théorèmes fondamentaux (TVI / TAF / orthogonalité / produit scalaire).`,
        `3. En déduire l'existence et l'unicité d'une solution α et donner un encadrement à 10⁻¹ près.`,
      ];
      hintAr = `منهجية الامتحان: تأكد من صياغة الشروط الثلاثة لمبرهنة القيم الوسيطية (الاتصال، الرتابة، وإشارة الجداء f(a)·f(b) < 0).`;
      hintFr = `Conseil examen : Rédiger rigoureusement les hypothèses du théorème des valeurs intermédiaires.`;
    } else if (relativePos < 0.90 || i === safeCount - 2) {
      // المرحلة الرابعة: مسألة النمذجة والاستمثال والمسائل الهندسية / الفيزيائية المفتوحة
      stars = "★★★";
      partPts = "4.0";
      badgeAr = `التمرين ${exNum} (★★★) [مسألة نمذجة واستمثال واقعي] — ${lessonForEx.lessonAr}`;
      badgeFr = `Exercice ${exNum} (★★★) [Modélisation concrète & Optimisation] — ${lessonForEx.lessonFr}`;
      if (subCat === "هندسة فضائية" || titleFr.includes("espace")) {
        qAr = [
          `1. نعتبر مجسماً هندسياً في الفضاء (فلكة ومستويات متقاطعة). عبر عن حجم أو مساحة المقطع بدلالة وسيط h.`,
          `2. حدد قيمة الوسيط h التي يكون من أجلها الحجم قصوياً أو دنوياً (مسألة الاستمثال).`,
          `3. صمم طريقة هندسية للتحقق من النتيجة باستعمال برمجية GeoGebra 3D.`,
        ];
        qFr = [
          `1. Exprimer le volume ou l'aire de la section en fonction d'un paramètre réel h.`,
          `2. Déterminer la valeur exacte de h qui optimise le volume (maximum/minimum).`,
          `3. Valider la conjecture à l'aide d'une simulation dynamique sous GeoGebra 3D.`,
        ];
      } else if (subCat === "أعداد عقدية" || titleFr.includes("complexe")) {
        qAr = [
          `1. اربط بين التحويل العقدي والمجموع الهندسي لمسافات النقط في المستوى.`,
          `2. بين أن مجموعة النقط التي تحقق شرطاً معيناً هي دائرة أو واسط قطعة، وحدد عناصرها المميزة.`,
          `3. بين أن النقط تشكل مضلعاً منتظماً واستنتج مساحته بدلالة عدد الأضلاع n.`,
        ];
        qFr = [
          `1. Modéliser la configuration géométrique par les nombres complexes.`,
          `2. Déterminer la nature de l'ensemble des points M(z) vérifiant la condition géométrique.`,
          `3. Démontrer que les points forment un polygone régulier et exprimer son aire.`,
        ];
      } else {
        qAr = [
          `1. نعتبر وضعية نمذجة لحساب مساحة حيز مستوٍ أو نمو ظاهرة طبيعية عبر الدالة f(x).`,
          `2. أوجد القيمة المثلى للمتغير x التي تجعل المردودية أو المساحة قصوية بدراسة إشارة المشتقة f'(x).`,
          `3. ناقش مصداقية النموذج والحلول الممكنة حسب الشروط الواقعية للمسألة.`,
        ];
        qFr = [
          `1. Modélisation : Traduire la situation concrète par une fonction f(x) à optimiser.`,
          `2. Déterminer l'extremum local en étudiant la dérivée première et dresser le bilan.`,
          `3. Interpréter la portée pratique et discuter les limites du modèle.`,
        ];
      }
      hintAr = `إرشاد للنمذجة: حدد بوضوح المتغير المستقل ومجموعة تعريفه الواقعية قبل اشتقاق دالة الاستمثال.`;
      hintFr = `Indication modélisation : Poser précisément la variable et son intervalle de définition réel.`;
    } else {
      // المرحلة الأخيرة: تحدي التميز والبحث المفتوح والأولمبياد (N4)
      stars = "★★★";
      partPts = "4.5";
      badgeAr = `التمرين ${exNum} (★★★) [تحدي التميز وأولمبياد الرياضيات N4] — ${lessonForEx.lessonAr}`;
      badgeFr = `Exercice ${exNum} (★★★) [Défi d'Excellence & Olympiades N4] — ${lessonForEx.lessonFr}`;
      if (subCat === "حسابيات" || subCat === "جبر" || titleFr.includes("arithm")) {
        qAr = [
          `مسألة أولمبياد مفتوحة: نعتبر الأعداد الصحيحة الطبيعية x و y و z التي تحقق: x³ + y³ = z³.`,
          `1. باستعمال التوافقات بترديد 7 أو 9، أثبت أن أحد الأعداد يجب أن يكون مضاعفاً لـ 7.`,
          `2. سؤال المبادرة والبحث: ناقش إمكانية وجود حلول غير بديهية في ℤ³.`,
        ];
        qFr = [
          `Défi Olympiades : Soient x, y, z des entiers naturels vérifiant x³ + y³ = z³.`,
          `1. À l'aide des congruences modulo 7, montrer que l'un des entiers est divisible par 7.`,
          `2. Prise d'initiative : Discuter l'existence de solutions non triviales dans ℤ³.`,
        ];
      } else if (subCat === "أعداد عقدية" || titleFr.includes("complexe")) {
        qAr = [
          `مسألة التحدي الأولمبي: لكل عدد عقدي z يحقق z^n = 1 مع z ≠ 1، نعتبر المجموع S_n = ∑_{k=1}^{n-1} 1/(1 - e^{i2kπ/n}).`,
          `1. برهن أن الجزء الحقيقي لكل حد من حدود المجموع ثابت ويساوي 1/2.`,
          `2. سؤال المبادرة: استنتج القيمة الدقيقة للمجموع S_n بدلالة n.`,
        ];
        qFr = [
          `Défi d'Excellence : Pour tout z racine n-ième de l'unité (z ≠ 1), on considère S_n = ∑_{k=1}^{n-1} 1/(1 - e^{i2kπ/n}).`,
          `1. Établir que la partie réelle de chaque terme est constante égale à 1/2.`,
          `2. Prise d'initiative : En déduire la valeur exacte de la somme S_n en fonction de n.`,
        ];
      } else {
        qAr = [
          `مسألة التحدي والبحث المفتوح: لتكن f دالة متصلة على [0, 1] تحقق f(0) = 0 و f(1) = 1.`,
          `1. بين أنه لكل عدد صحيح n ≥ 2، يوجد عدد c_n من ]0, 1[ بحيث f(c_n + 1/n) - f(c_n) = 1/n.`,
          `2. سؤال المبادرة المفتوح: ادرس تقارب المتتالية (c_n) عندما يؤول n إلى +∞.`,
        ];
        qFr = [
          `Problème de Recherche & Olympiades : Soit f une fonction continue sur [0, 1] avec f(0) = 0 et f(1) = 1.`,
          `1. Démontrer que pour tout entier n ≥ 2, il existe c_n ∈ ]0, 1[ tel que f(c_n + 1/n) - f(c_n) = 1/n.`,
          `2. Question ouverte : Étudier le comportement asymptotique de la suite (c_n) quand n → +∞.`,
        ];
      }
      hintAr = `تحدي أولمبياد: استعمل الدالة المساعدة g(x) = f(x + 1/n) - f(x) - 1/n والمجموع التلسكوبي ∑ g(k/n) وطبق مبرهنة القيم الوسيطية.`;
      hintFr = `Piste Olympiades : Considérer la fonction auxiliaire g(x) = f(x + 1/n) - f(x) - 1/n et exploiter une somme télescopique.`;
    }

    allBlocks.push({
      badgeAr,
      badgeFr,
      stars,
      partPoints: partPts,
      questionsAr: qAr,
      questionsFr: qFr,
      hintAr,
      hintFr,
      competenciesAr: [cap0Ar, cap1Ar],
      competenciesFr: [cap0Fr, cap1Fr],
    });
  }

  return allBlocks;
}
