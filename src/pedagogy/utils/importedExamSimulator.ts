import {
  EducationSystem,
  LessonItem,
  LessonMainCategory,
  LessonSubCategory,
  SemesterType,
} from "../data/curriculum";

export type SimulationMode =
  | "EXACT_REPLICA"
  | "ISOMORPHIC_TWIN"
  | "PEDAGOGICAL_ADAPTATION";

export interface ImportedExamExercise {
  id: string;
  titleAr: string;
  titleFr: string;
  points: number; // e.g. 6 (out of 20)
  weight: number; // e.g. 30 (%)
  category: LessonMainCategory;
  subCategory: LessonSubCategory;
  subCategoryFr: string;
  capacitiesAr: string[];
  capacitiesFr: string[];
  questionsAr: string[];
  questionsFr: string[];
  questionsModelB_Ar: string[];
  questionsModelB_Fr: string[];
  questionBaremes: number[];
  solutionsAr: string[];
  solutionsFr: string[];
  solutionsModelB_Ar?: string[];
  solutionsModelB_Fr?: string[];
}

export interface ImportedExamBlueprint {
  id: string;
  sourceType:
    | "OFFICIAL_ARCHIVE"
    | "UPLOADED_FILE"
    | "PASTED_TEXT"
    | "AI_MULTIMODAL";
  sourceFileName?: string;
  titleAr: string;
  titleFr: string;
  schoolOriginAr: string;
  schoolOriginFr: string;
  detectedTrackCode: string;
  detectedSystem: EducationSystem;
  semester: SemesterType;
  dsKey: string;
  durationAr: string;
  durationFr: string;
  n1: number;
  n2: number;
  n3: number;
  exercises: ImportedExamExercise[];
}

/**
 * خزانة الفروض المحروسة المستوردة الجاهزة للمحاكاة والاستنساخ البيداغوجي
 */
export const IMPORTED_EXAMS_ARCHIVE: ImportedExamBlueprint[] = [
  {
    id: "imported_2bac_pc_s1_ds1",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS1_2BAC_PC_SVT_Casa_Settat_S1.pdf",
    titleAr: "فرض محروس مستورد رقم 1 — 2 باك علوم فيزيائية و SVT (الدورة 1)",
    titleFr: "Devoir Surveillé Importé N°1 — 2ème Bac PC & SVT (Semestre 1)",
    schoolOriginAr: "الأكاديمية الجهوية الدار البيضاء سطات · ثانوية محمد الخامس التأهيلية",
    schoolOriginFr: "AREF Casablanca-Settat · Lycée Qualifiant Mohammed V",
    detectedTrackCode: "2BAC_PC",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S1",
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 45,
    n2: 35,
    n3: 20,
    exercises: [
      {
        id: "ex1_suites_2bac",
        titleAr: "المتتاليات العددية الترجعية والتقارب",
        titleFr: "Suites numériques récurrentes et convergence",
        points: 5,
        weight: 25,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse — Suites numériques",
        capacitiesAr: [
          "البرهان بالترجع على تأطير ورتابة متتالية ترجعية",
          "توظيف متتالية مساعدة هندسية لحساب الحد العام والنهاية",
        ],
        capacitiesFr: [
          "Démontrer par récurrence la majoration et la monotonie d'une suite",
          "Exploiter une suite auxiliaire homographique pour déterminer la limite",
        ],
        questionsAr: [
          "نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = 2 و u_{n+1} = (4u_n - 1)/(u_n + 2) لكل n من N.",
          "1. أحسب u_1 و u_2، ثم بين بالترجع أن u_n > 1 لكل n من N.",
          "2. أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة.",
          "3. نضع v_n = 1/(u_n - 1) لكل n من N. بين أن (v_n) متتالية حسابية أساسها r = 1/3، ثم أكتب v_n و u_n بدلالة n وأحسب lim u_n.",
        ],
        questionsFr: [
          "Soit (u_n) la suite numérique définie par u_0 = 2 et u_{n+1} = (4u_n - 1)/(u_n + 2) pour tout n ∈ ℕ.",
          "1. Calculer u_1 et u_2, puis montrer par récurrence que pour tout n ∈ ℕ, u_n > 1.",
          "2. Étudier la monotonie de la suite (u_n) et en déduire qu'elle est convergente.",
          "3. On pose v_n = 1/(u_n - 1). Montrer que (v_n) est une suite arithmétique de raison r = 1/3, exprimer u_n en fonction de n et calculer lim u_n.",
        ],
        questionsModelB_Ar: [
          "نعتبر المتتالية العددية (u_n) المعرفة بـ u_0 = 3 و u_{n+1} = (5u_n - 4)/(u_n + 1) لكل n من N.",
          "1. أحسب u_1 و u_2، ثم بين بالترجع أن u_n > 2 لكل n من N.",
          "2. أدرس رتابة المتتالية (u_n) واستنتج أنها متقاربة.",
          "3. نضع v_n = 1/(u_n - 2) لكل n من N. بين أن (v_n) متتالية حسابية أساسها r = 1/3، ثم أكتب v_n و u_n بدلالة n وأحسب lim u_n.",
        ],
        questionsModelB_Fr: [
          "Soit (u_n) la suite numérique définie par u_0 = 3 et u_{n+1} = (5u_n - 4)/(u_n + 1) pour tout n ∈ ℕ.",
          "1. Calculer u_1 et u_2, puis montrer par récurrence que pour tout n ∈ ℕ, u_n > 2.",
          "2. Étudier la monotonie de la suite (u_n) et en déduire qu'elle est convergente.",
          "3. On pose v_n = 1/(u_n - 2). Montrer que (v_n) est une suite arithmétique de raison r = 1/3, exprimer u_n en fonction de n et calculer lim u_n.",
        ],
        questionBaremes: [0.5, 1.5, 1.25, 1.75],
        solutionsAr: [
          "معطيات التمرين: المتتالية معرفة بـ u_0 = 2 والعلاقة الترجعية الموموغرافية.",
          "1. حساب الحدود: u_1 = (8 - 1)/(2 + 2) = 7/4 و u_2 = 24/15 = 8/5. بالترجع: من أجل n=0 لدينا u_0 = 2 > 1. نفترض u_n > 1، لدينا u_{n+1} - 1 = 3(u_n - 1)/(u_n + 2) > 0 ومنه u_{n+1} > 1.",
          "2. الرتابة: لكل n من N، لدينا u_{n+1} - u_n = -(u_n - 1)²/(u_n + 2) < 0، إذن (u_n) تناقصية قطعا وبما أنها مصغورة بالعدد 1 فهي متقاربة.",
          "3. المتتالية المساعدة: v_{n+1} - v_n = (u_n + 2)/(3(u_n - 1)) - 1/(u_n - 1) = (u_n - 1)/(3(u_n - 1)) = 1/3. إذن v_n = 1 + n/3 ومنه u_n = 1 + 3/(n + 3)، وبالتالي lim u_n = 1.",
        ],
        solutionsFr: [
          "Données : Suite récurrente homographique avec u_0 = 2.",
          "1. Calculs : u_1 = 7/4 et u_2 = 8/5. Par récurrence : u_0 = 2 > 1 ; si u_n > 1 alors u_{n+1} - 1 = 3(u_n - 1)/(u_n + 2) > 0 donc u_{n+1} > 1.",
          "2. Monotonie : u_{n+1} - u_n = -(u_n - 1)²/(u_n + 2) < 0. La suite (u_n) est strictement décroissante et minorée par 1, donc elle converge.",
          "3. Suite auxiliaire : v_{n+1} - v_n = (u_n + 2 - 3)/(3(u_n - 1)) = 1/3. Donc v_n = 1 + n/3, d'où u_n = 1 + 3/(n + 3) et lim u_n = 1.",
        ],
      },
      {
        id: "ex2_continuite_tvi",
        titleAr: "الاتصال ومبرهنة القيم الوسيطية (TVI) والدالة العكسية",
        titleFr: "Continuité, Théorème des Valeurs Intermédiaires et Fonction Réciproque",
        points: 5,
        weight: 25,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse — Continuité & TVI",
        capacitiesAr: [
          "تطبيق مبرهنة القيم الوسيطية لإثبات وجود ووحدانية حل معادلة",
          "إثبات تقابل دالة متصلة ورتيبة قطعا وتحديد خصائص دالتها العكسية",
        ],
        capacitiesFr: [
          "Appliquer le TVI pour prouver l'existence et l'unicité d'une solution α",
          "Établir une bijection et déterminer la dérivabilité de la réciproque f⁻¹",
        ],
        questionsAr: [
          "نعتبر الدالة العددية f المعرفة على R بـ: f(x) = x³ + 3x - 2.",
          "1. بين أن الدالة f متصلة وتزايدية قطعا على R، ثم حدد صورة المجال [0, 1] بالدالة f.",
          "2. بين أن المعادلة f(x) = 0 تقبل حلاً وحيداً α في R وأن 0 < α < 1.",
          "3. بين أن f تقبل دالة عكسية f⁻¹ معرفة على مجال J يتم تحديده، ثم أحسب (f⁻¹)'(-2).",
        ],
        questionsFr: [
          "Soit f la fonction définie sur ℝ par : f(x) = x³ + 3x - 2.",
          "1. Montrer que f est continue et strictement croissante sur ℝ, puis déterminer f([0, 1]).",
          "2. Démontrer que l'équation f(x) = 0 admet une unique solution α dans ℝ et que 0 < α < 1.",
          "3. Montrer que f admet une fonction réciproque f⁻¹ définie sur J = ℝ, puis calculer (f⁻¹)'(-2).",
        ],
        questionsModelB_Ar: [
          "نعتبر الدالة العددية f المعرفة على R بـ: f(x) = x³ + 4x - 3.",
          "1. بين أن الدالة f متصلة وتزايدية قطعا على R، ثم حدد صورة المجال [0, 1] بالدالة f.",
          "2. بين أن المعادلة f(x) = 0 تقبل حلاً وحيداً α في R وأن 0 < α < 1.",
          "3. بين أن f تقبل دالة عكسية f⁻¹ معرفة على مجال J يتم تحديده، ثم أحسب (f⁻¹)'(-3).",
        ],
        questionsModelB_Fr: [
          "Soit f la fonction définie sur ℝ par : f(x) = x³ + 4x - 3.",
          "1. Montrer que f est continue et strictement croissante sur ℝ, puis déterminer f([0, 1]).",
          "2. Démontrer que l'équation f(x) = 0 admet une unique solution α dans ℝ et que 0 < α < 1.",
          "3. Montrer que f admet une fonction réciproque f⁻¹ définie sur J = ℝ, puis calculer (f⁻¹)'(-3).",
        ],
        questionBaremes: [0.5, 1.5, 1.5, 1.5],
        solutionsAr: [
          "دراسة الدالة الحدودية f(x) = x³ + 3x - 2 على المجموعة R.",
          "1. الدالة f حدودية فهي متصلة وقابلة للاشتقاق على R، ولدينا f'(x) = 3x² + 3 > 0 قطعا، إذن f تزايدية قطعا على R. وصورة [0, 1] هي [f(0), f(1)] = [-2, 2].",
          "2. بما أن f متصلة وتزايدية قطعا على R و 0 ∈ f([0, 1]) لأن f(0)×f(1) = (-2)×2 = -4 < 0، فحسب مبرهنة القيم الوسيطية (TVI) المعادلة f(x) = 0 تقبل حلاً وحيداً α حيث 0 < α < 1.",
          "3. الدالة f متصلة وتزايدية قطعا على R إذن تقبل دالة عكسية f⁻¹ معرفة على J = f(R) = R. ولدينا f(0) = -2 و f'(0) = 3 ≠ 0، إذن (f⁻¹)'(-2) = 1/f'(0) = 1/3.",
        ],
        solutionsFr: [
          "Étude de la fonction polynomiale f(x) = x³ + 3x - 2 sur ℝ.",
          "1. f est polynomiale donc continue et dérivable sur ℝ. f'(x) = 3x² + 3 ≥ 3 > 0, donc f est strictement croissante sur ℝ et f([0, 1]) = [f(0), f(1)] = [-2, 2].",
          "2. Comme f est continue et strictement croissante sur ℝ et f(0)×f(1) = -4 < 0, d'après le TVI l'équation f(x) = 0 admet une unique solution α ∈ ]0, 1[.",
          "3. f réalise une bijection de ℝ sur J = f(ℝ) = ℝ. Comme f(0) = -2 et f'(0) = 3 ≠ 0, f⁻¹ est dérivable en -2 et (f⁻¹)'(-2) = 1/f'(0) = 1/3.",
        ],
      },
      {
        id: "ex3_probleme_derivation",
        titleAr: "مسألة توليفية: الاشتقاق ودراسة الدوال والفرع الشلجمي",
        titleFr: "Problème de synthèse : Dérivabilité, branches infinies et étude de fonction",
        points: 10,
        weight: 50,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse — Étude de fonctions",
        capacitiesAr: [
          "دراسة قابلية الاشتقاق على اليمين وتأويل نصف المماس العمودي مبيانياً",
          "تحديد الفروع اللانهائية وإنشاء المنحنى المبياني (C_g) ومنحنى الدالة العكسية",
        ],
        capacitiesFr: [
          "Étudier la dérivabilité à droite en 0 et interpréter la demi-tangente verticale",
          "Étudier la branche parabolique, dresser le tableau de variations et tracer (C_g)",
        ],
        questionsAr: [
          "نعتبر الدالة العددية g المعرفة على المجال I = [0, +∞[ بـ: g(x) = x - 1 + 2√x، وليكن (C_g) منحناها في معلم متعامد ممنظم (O, i, j).",
          "1. أحسب lim_{x→+∞} g(x) و lim_{x→+∞} g(x)/x و lim_{x→+∞} [g(x) - x]، ثم أول النتيجة مبيانياً (نوع الفرع اللانهائي).",
          "2. أدرس قابلية اشتقاق الدالة g على اليمين في النقطة x_0 = 0 وأول النتيجة هندسياً.",
          "3. بين أن g'(x) = (√x + 1)/√x لكل x من ]0, +∞[، ثم ضع جدول تغيرات الدالة g وحدد معادلة المماس (T) عند النقطة ذات الأفصول 1.",
          "4. بين أن g تقبل دالة عكسية g⁻¹ معرفة على مجال J يتم تحديده، وحدد صيغة g⁻¹(x) لكل x من J ثم أنشئ (C_g) و (C_{g⁻¹}).",
        ],
        questionsFr: [
          "On considère la fonction g définie sur I = [0, +∞[ par : g(x) = x - 1 + 2√x, et soit (C_g) sa courbe représentative dans un repère orthonormé (O, i, j).",
          "1. Calculer lim_{x→+∞} g(x), lim_{x→+∞} g(x)/x et lim_{x→+∞} [g(x) - x], puis interpréter graphiquement la nature de la branche infinie.",
          "2. Étudier la dérivabilité de g à droite en x_0 = 0 et interpréter géométriquement le résultat obtenu.",
          "3. Montrer que pour tout x > 0, g'(x) = (√x + 1)/√x, dresser le tableau de variations de g et déterminer l'équation de la tangente (T) au point d'abscisse 1.",
          "4. Montrer que g admet une fonction réciproque g⁻¹ définie sur un intervalle J à préciser, expliciter g⁻¹(x) pour tout x ∈ J et construire (C_g) et (C_{g⁻¹}).",
        ],
        questionsModelB_Ar: [
          "نعتبر الدالة العددية g المعرفة على المجال I = [0, +∞[ بـ: g(x) = x - 3 + 4√x، وليكن (C_g) منحناها في معلم متعامد ممنظم (O, i, j).",
          "1. أحسب lim_{x→+∞} g(x) و lim_{x→+∞} g(x)/x و lim_{x→+∞} [g(x) - x]، ثم أول النتيجة مبيانياً.",
          "2. أدرس قابلية اشتقاق الدالة g على اليمين في النقطة x_0 = 0 وأول النتيجة هندسياً.",
          "3. بين أن g'(x) = (√x + 2)/√x لكل x من ]0, +∞[، ثم ضع جدول تغيرات الدالة g وحدد معادلة المماس (T) عند النقطة ذات الأفصول 1.",
          "4. بين أن g تقبل دالة عكسية g⁻¹ معرفة على مجال J يتم تحديده، وحدد صيغة g⁻¹(x) لكل x من J ثم أنشئ (C_g) و (C_{g⁻¹}).",
        ],
        questionsModelB_Fr: [
          "On considère la fonction g définie sur I = [0, +∞[ par : g(x) = x - 3 + 4√x, et soit (C_g) sa courbe représentative dans un repère orthonormé (O, i, j).",
          "1. Calculer lim_{x→+∞} g(x), lim_{x→+∞} g(x)/x et lim_{x→+∞} [g(x) - x], puis interpréter graphiquement.",
          "2. Étudier la dérivabilité de g à droite en x_0 = 0 et interpréter géométriquement le résultat.",
          "3. Montrer que pour tout x > 0, g'(x) = (√x + 2)/√x, dresser le tableau de variations de g et donner l'équation de la tangente (T) en x_0 = 1.",
          "4. Montrer que g admet une fonction réciproque g⁻¹ définie sur J = [-3, +∞[, expliciter g⁻¹(x) pour tout x ∈ J et construire (C_g) et (C_{g⁻¹}).",
        ],
        questionBaremes: [1.0, 2.0, 2.0, 2.5, 2.5],
        solutionsAr: [
          "معطيات المسألة: g(x) = x - 1 + 2√x معرفة ومتصلة على [0, +∞[.",
          "1. النهايات والفرع اللانهائي: lim_{x→+∞} g(x) = +∞، و lim g(x)/x = lim (1 - 1/x + 2/√x) = 1، و lim [g(x) - x] = lim (2√x - 1) = +∞. إذن يقبل (C_g) فرعاً شلجمياً اتجاهه المستقيم ذو المعادلة y = x بجوار +∞.",
          "2. الاشتقاق في 0+: lim_{x→0+} [g(x) - g(0)]/x = lim_{x→0+} (x + 2√x)/x = lim (1 + 2/√x) = +∞. إذن g غير قابلة للاشتقاق على اليمين في 0، والمنحنى (C_g) يقبل نصف مماس عمودي موجه نحو الأعلى في النقطة A(0, -1).",
          "3. المشتقة: لكل x > 0، g'(x) = 1 + 2/(2√x) = (√x + 1)/√x > 0 قطعا. إذن g تزايدية قطعا على [0, +∞[. معادلة المماس في 1: y = g'(1)(x - 1) + g(1) = 2(x - 1) + 2 = 2x.",
          "4. الدالة العكسية: g متصلة وتزايدية قطعا على [0, +∞[ إذن تقبل دالة عكسية معرفة على J = [-1, +∞[. نلاحظ أن g(x) = (√x + 1)² - 2، ومنه √x + 1 = √(y + 2) أي g⁻¹(x) = (√(x + 2) - 1)² لكل x ≥ -1.",
        ],
        solutionsFr: [
          "Données du problème : g(x) = x - 1 + 2√x définie et continue sur [0, +∞[.",
          "1. Limites et branche infinie : lim_{+∞} g(x) = +∞, lim_{+∞} g(x)/x = 1 et lim_{+∞} [g(x) - x] = +∞. La courbe (C_g) admet une branche parabolique de direction la droite y = x au voisinage de +∞.",
          "2. Dérivabilité en 0+ : lim_{x→0+} [g(x) - g(0)]/x = lim_{x→0+} (1 + 2/√x) = +∞. g n'est pas dérivable à droite en 0 et (C_g) admet une demi-tangente verticale dirigée vers le haut au point A(0, -1).",
          "3. Dérivée : Pour tout x > 0, g'(x) = 1 + 1/√x = (√x + 1)/√x > 0. g est strictement croissante sur [0, +∞[. Tangente en 1 : y = g'(1)(x - 1) + g(1) = 2x.",
          "4. Bijection réciproque : J = g([0, +∞[) = [-1, +∞[. Comme g(x) = (√x + 1)² - 2, on obtient pour tout x ≥ -1 : g⁻¹(x) = (√(x + 2) - 1)².",
        ],
      },
    ],
  },
  {
    id: "imported_2bac_pc_s2_ds2",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS2_2BAC_PC_Rabat_Hassan_S2.pdf",
    titleAr: "فرض محروس مستورد رقم 2 — 2 باك علوم فيزيائية (الدورة 2: عقدية + هندسة فضائية + أسية)",
    titleFr: "Devoir Surveillé Importé N°2 — 2ème Bac PC (S2 : Complexes, Espace 3D & Exponentielle)",
    schoolOriginAr: "أكاديمية الرباط سلا القنيطرة · ثانوية الحسن الثاني التأهيلية",
    schoolOriginFr: "AREF Rabat-Salé-Kénitra · Lycée Qualifiant Hassan II",
    detectedTrackCode: "2BAC_PC",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S2",
    dsKey: "DS2",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 40,
    n2: 40,
    n3: 20,
    exercises: [
      {
        id: "ex1_complexes_s2",
        titleAr: "الأعداد العقدية والتحويلات النقطية في المستوى العقدي",
        titleFr: "Nombres complexes et transformations géométriques du plan",
        points: 5,
        weight: 25,
        category: "Geometry",
        subCategory: "أعداد عقدية",
        subCategoryFr: "Nombres complexes",
        capacitiesAr: [
          "حل معادلة من الدرجة الثانية بمعاملات حقيقية في المجموعة C",
          "توظيف الشكل المثلثي والأسي والكتابة العقدية للدوران لدراسة طبيعة مثلث",
        ],
        capacitiesFr: [
          "Résoudre une équation du second degré dans ℂ et écrire sous forme exponentielle",
          "Utiliser l'écriture complexe d'une rotation pour démontrer qu'un triangle est équilatéral",
        ],
        questionsAr: [
          "1. حل في مجموعة الأعداد العقدية C المعادلة: z² - 2√3 z + 4 = 0.",
          "2. في المستوى العقدي المنسوب إلى معلم متعامد ممنظم مباشر (O, u, v)، نعتبر النقط A و B و C التي ألحاقها: a = √3 + i و b = √3 - i و c = 2i. أكتب a و b على الشكل الأسي.",
          "3. ليكن R الدوران الذي مركزه O وزاويته π/3. بين أن صورة النقطة A بالدوران R هي النقطة C، ثم استنتج طبيعة المثلث OAC.",
        ],
        questionsFr: [
          "1. Résoudre dans l'ensemble ℂ des nombres complexes l'équation : z² - 2√3 z + 4 = 0.",
          "2. Dans le plan complexe muni d'un repère orthonormé direct (O, u, v), on considère les points A, B et C d'affixes a = √3 + i, b = √3 - i et c = 2i. Écrire a et b sous forme exponentielle.",
          "3. Soit R la rotation de centre O et d'angle π/3. Montrer que C est l'image de A par R et en déduire la nature exacte du triangle OAC.",
        ],
        questionsModelB_Ar: [
          "1. حل في مجموعة الأعداد العقدية C المعادلة: z² - 4√3 z + 16 = 0.",
          "2. في المستوى العقدي المنسوب إلى معلم متعامد ممنظم مباشر (O, u, v)، نعتبر النقط A و B و C التي ألحاقها: a = 2√3 + 2i و b = 2√3 - 2i و c = 4i. أكتب a و b على الشكل الأسي.",
          "3. ليكن R الدوران الذي مركزه O وزاويته π/3. بين أن صورة النقطة A بالدوران R هي النقطة C، ثم استنتج طبيعة المثلث OAC.",
        ],
        questionsModelB_Fr: [
          "1. Résoudre dans l'ensemble ℂ l'équation : z² - 4√3 z + 16 = 0.",
          "2. Dans le plan complexe rapporté à (O, u, v), on considère A, B et C d'affixes a = 2√3 + 2i, b = 2√3 - 2i et c = 4i. Écrire a et b sous forme exponentielle.",
          "3. Soit R la rotation de centre O et d'angle π/3. Montrer que R(A) = C et en déduire la nature du triangle OAC.",
        ],
        questionBaremes: [1.5, 1.75, 1.75],
        solutionsAr: [
          "1. مميز المعادلة: Δ = (-2√3)² - 4×4 = 12 - 16 = -4 = (2i)². الحلان العقديان هما z_1 = √3 + i و z_2 = √3 - i.",
          "2. معيار a هو |a| = √(3 + 1) = 2. إذن a = 2(√3/2 + (1/2)i) = 2e^{iπ/6}، وبما أن b = ā فإن b = 2e^{-iπ/6}.",
          "3. الكتابة العقدية للدوران R هي z' = e^{iπ/3} z. لدينا e^{iπ/3} a = e^{iπ/3} × 2e^{iπ/6} = 2e^{iπ/2} = 2i = c، إذن R(A) = C. ومنه OA = OC و (OA, OC) ≡ π/3 [2π]، فالمثلث OAC متساوي الأضلاع.",
        ],
        solutionsFr: [
          "1. Discriminant : Δ = 12 - 16 = -4 = (2i)². Les deux racines complexes conjuguées sont z_1 = √3 + i et z_2 = √3 - i.",
          "2. Module |a| = 2, d'où a = 2(cos(π/6) + i sin(π/6)) = 2e^{iπ/6} et b = ā = 2e^{-iπ/6}.",
          "3. Écriture complexe de R : z' = e^{iπ/3} z. On a e^{iπ/3} × a = 2e^{i(π/3 + π/6)} = 2e^{iπ/2} = 2i = c, donc R(A) = C. Le triangle OAC est équilatéral direct.",
        ],
      },
      {
        id: "ex2_geometrie_espace_s2",
        titleAr: "الهندسة الفضائية: الجداء المتجهي والفلكة والمستوى",
        titleFr: "Géométrie dans l'espace : Produit vectoriel, Sphère et Plan",
        points: 5,
        weight: 25,
        category: "Geometry",
        subCategory: "هندسة فضائية",
        subCategoryFr: "Géométrie dans l'espace",
        capacitiesAr: [
          "حساب الجداء المتجهي واستنتاج معادلة ديكارتية لمستوى (ABC)",
          "دراسة التقاطع بين فلكة ومستوى وتحديد عناصر دائرة التقاطع",
        ],
        capacitiesFr: [
          "Calculer le produit vectoriel AB ∧ AC et déterminer l'équation du plan (ABC)",
          "Étudier l'intersection d'une sphère (S) et d'un plan (P) et caractériser le cercle",
        ],
        questionsAr: [
          "في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر (O, i, j, k)، نعتبر النقط A(1, 0, 2) و B(3, 0, 1) و C(1, 1, 1) والفلكة (S) ذات المركز Ω(1, -1, 2) والشعاع R = 3.",
          "1. أحسب الجداء المتجهي AB ∧ AC، ثم استنتج أن x + 2y + 2z - 5 = 0 هي معادلة ديكارتية للمستوى (ABC).",
          "2. أحسب مسافة النقطة Ω عن المستوى (ABC)، ثم بين أن المستوى (ABC) يقطع الفلكة (S) وفق دائرة (Γ) محدداً شعاعها r ومثلوث إحداثيات مركزها H.",
        ],
        questionsFr: [
          "Dans l'espace rapporté à un repère orthonormé direct (O, i, j, k), on considère A(1, 0, 2), B(3, 0, 1), C(1, 1, 1) et la sphère (S) de centre Ω(1, -1, 2) et de rayon R = 3.",
          "1. Calculer AB ∧ AC et en déduire que x + 2y + 2z - 5 = 0 est une équation cartésienne du plan (ABC).",
          "2. Calculer la distance d(Ω, (ABC)), puis montrer que le plan (ABC) coupe la sphère (S) suivant un cercle (Γ) dont on précisera le rayon r et les coordonnées du centre H.",
        ],
        questionsModelB_Ar: [
          "في الفضاء المنسوب إلى معلم متعامد ممنظم مباشر (O, i, j, k)، نعتبر النقط A(2, 0, 1) و B(4, 0, 0) و C(2, 1, 0) والفلكة (S) ذات المركز Ω(2, -1, 1) والشعاع R = 6.",
          "1. أحسب الجداء المتجهي AB ∧ AC، ثم استنتج أن x + 2y + 2z - 4 = 0 هي معادلة ديكارتية للمستوى (ABC).",
          "2. أحسب مسافة النقطة Ω عن المستوى (ABC)، ثم بين أن المستوى (ABC) يقطع الفلكة (S) وفق دائرة (Γ) محدداً شعاعها r ومثلوث إحداثيات مركزها H.",
        ],
        questionsModelB_Fr: [
          "Dans l'espace rapporté à un repère orthonormé direct (O, i, j, k), on considère A(2, 0, 1), B(4, 0, 0), C(2, 1, 0) et la sphère (S) de centre Ω(2, -1, 1) et de rayon R = 6.",
          "1. Calculer AB ∧ AC et en déduire que x + 2y + 2z - 4 = 0 est une équation cartésienne du plan (ABC).",
          "2. Calculer d(Ω, (ABC)), puis montrer que (ABC) coupe (S) suivant un cercle (Γ) dont on déterminera le rayon r et le centre H.",
        ],
        questionBaremes: [0.5, 2.0, 2.5],
        solutionsAr: [
          "معطيات الفضاء: النقط A(1, 0, 2) و B(3, 0, 1) و C(1, 1, 1) والفلكة (S) ذات المركز Ω(1, -1, 2) والشعاع R = 3.",
          "1. لدينا AB(2, 0, -1) و AC(0, 1, -1)، ومنه AB ∧ AC = i + 2j + 2k. وبما أن المتجهة المنظمية n(1, 2, 2) و A ∈ (ABC)، فإن x + 2y + 2z - 5 = 0 هي معادلة ديكارتية للمستوى (ABC).",
          "2. مسافة المركز عن المستوى: d = |1 + 2(-1) + 2(2) - 5|/√(1 + 4 + 4) = 2/3 < R = 3. إذن التقاطع دائرة شعاعها r = √(9 - 4/9) = √77/3 ومركزها H المسقط العمودي لـ Ω على (ABC).",
        ],
        solutionsFr: [
          "Données 3D : Points A(1, 0, 2), B(3, 0, 1), C(1, 1, 1) et sphère (S) de centre Ω(1, -1, 2) et rayon R = 3.",
          "1. Calcul des composantes de AB(2, 0, -1) et AC(0, 1, -1) puis du produit vectoriel normal AB ∧ AC = i + 2j + 2k, donnant l'équation cartésienne x + 2y + 2z - 5 = 0.",
          "2. Distance d(Ω, (ABC)) = 2/3 < 3 = R. Le plan coupe donc la sphère suivant un cercle (Γ) de rayon r = √(R² - d²) = √77/3 et de centre H projeté orthogonal de Ω.",
        ],
      },
      {
        id: "ex3_probleme_expo_integrale",
        titleAr: "مسألة شاملة: الدالة الأسية والتكامل وحساب المساحات",
        titleFr: "Problème de synthèse : Fonction exponentielle, calcul intégral et aire",
        points: 10,
        weight: 50,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse — Exponentielle & Intégrales",
        capacitiesAr: [
          "دراسة تغيرات دالة تشتمل على الأسية النبيرية وتحديد الفروع اللانهائية",
          "توظيف المكاملة بالأجزاء لحساب تكامل واستنتاج مساحة حيز مستوٍ",
        ],
        capacitiesFr: [
          "Étudier une fonction comportant exp(x), déterminer ses asymptotes et sa convexité",
          "Utiliser une intégration par parties (IPP) pour calculer une aire géométrique",
        ],
        questionsAr: [
          "نعتبر الدالة العددية f المعرفة على R بـ: f(x) = (x - 1)e^x + x، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i, j) (الوحدة: 2cm).",
          "1. أحسب lim_{x→-∞} f(x) وبيّن أن المستقيم (Δ): y = x مقارب مائل للمنحنى (C_f) بجوار -∞، ثم أدرس الوضع النسبي لـ (C_f) و (Δ).",
          "2. أحسب lim_{x→+∞} f(x) و lim_{x→+∞} f(x)/x وأول النتيجة مبيانياً.",
          "3. بين أن f'(x) = x e^x + 1 لكل x من R، واستنتج باستعمال إشارة x e^x + 1 أن f تزايدية قطعا على R.",
          "4. باستعمال المكاملة بالأجزاء، أحسب التكامل I = ∫_0^1 (x - 1)e^x dx، ثم استنتج بـ cm² مساحة الحيز المحصور بين (C_f) والمستقيم (Δ) والمستقيمين x = 0 و x = 1.",
        ],
        questionsFr: [
          "Soit f la fonction définie sur ℝ par : f(x) = (x - 1)e^x + x, et (C_f) sa courbe dans un repère orthonormé (O, i, j) (unité : 2 cm).",
          "1. Calculer lim_{x→-∞} f(x), montrer que la droite (Δ) : y = x est asymptote oblique à (C_f) en -∞ et étudier la position relative de (C_f) et (Δ).",
          "2. Calculer lim_{x→+∞} f(x) et lim_{x→+∞} f(x)/x, puis interpréter graphiquement.",
          "3. Montrer que pour tout x ∈ ℝ, f'(x) = x e^x + 1 et vérifier que f'(x) > 0 sur ℝ, puis dresser le tableau de variations de f.",
          "4. À l'aide d'une intégration par parties, calculer I = ∫_0^1 (x - 1)e^x dx, puis en déduire en cm² l'aire du domaine délimité par (C_f), (Δ) et les droites x = 0 et x = 1.",
        ],
        questionsModelB_Ar: [
          "نعتبر الدالة العددية f المعرفة على R بـ: f(x) = (x - 2)e^x + x، وليكن (C_f) منحناها في معلم متعامد ممنظم (O, i, j) (الوحدة: 2cm).",
          "1. أحسب lim_{x→-∞} f(x) وبيّن أن المستقيم (Δ): y = x مقارب مائل للمنحنى (C_f) بجوار -∞، ثم أدرس الوضع النسبي لـ (C_f) و (Δ).",
          "2. أحسب lim_{x→+∞} f(x) و lim_{x→+∞} f(x)/x وأول النتيجة مبيانياً.",
          "3. أحسب المشتقة f'(x) لكل x من R، وضع جدول تغيرات الدالة f.",
          "4. باستعمال المكاملة بالأجزاء، أحسب التكامل I = ∫_0^2 (x - 2)e^x dx، ثم استنتج بـ cm² مساحة الحيز المحصور بين (C_f) والمستقيم (Δ) والمستقيمين x = 0 و x = 2.",
        ],
        questionsModelB_Fr: [
          "Soit f la fonction définie sur ℝ par : f(x) = (x - 2)e^x + x, et (C_f) sa courbe dans un repère orthonormé (O, i, j) (unité : 2 cm).",
          "1. Calculer lim_{x→-∞} f(x), montrer que (Δ) : y = x est asymptote oblique en -∞ et étudier la position relative de (C_f) et (Δ).",
          "2. Calculer lim_{x→+∞} f(x) et lim_{x→+∞} f(x)/x, puis interpréter graphiquement.",
          "3. Calculer f'(x) pour tout x ∈ ℝ et dresser le tableau de variations de f.",
          "4. Par intégration par parties, calculer I = ∫_0^2 (x - 2)e^x dx, puis en déduire en cm² l'aire du domaine compris entre (C_f), (Δ), x = 0 et x = 2.",
        ],
        questionBaremes: [0.5, 2.5, 2.0, 2.5, 2.5],
        solutionsAr: [
          "معطيات المسألة: f(x) = (x - 1)e^x + x معرفة على R.",
          "1. بجوار -∞: لدينا lim_{x→-∞} x e^x = 0 و lim e^x = 0، إذن lim [f(x) - x] = 0 ومنه (Δ): y = x مقارب مائل بجوار -∞. إشارة f(x) - x هي إشارة (x - 1) لأن e^x > 0.",
          "2. بجوار +∞: lim f(x) = +∞ و lim f(x)/x = lim [(1 - 1/x)e^x + 1] = +∞، إذن يقبل (C_f) فرعاً شلجمياً اتجاهه محور الأراتيب بجوار +∞.",
          "3. المشتقة: f'(x) = 1·e^x + (x - 1)e^x + 1 = x e^x + 1. وبما أن القيمة الدنيا للدالة x ↦ x e^x على R هي -1/e عند x = -1، فإن x e^x + 1 ≥ 1 - 1/e > 0، إذن f تزايدية قطعا على R.",
          "4. المكاملة بالأجزاء: نضع u(x) = x - 1 و v'(x) = e^x فنحصل على I = [(x - 1)e^x]_0^1 - ∫_0^1 e^x dx = 1 - (e - 1) = 2 - e. وبما أن (C_f) تحت (Δ) على [0, 1]، فإن المساحة هي A = (e - 2) × 4 cm².",
        ],
        solutionsFr: [
          "Données : f(x) = (x - 1)e^x + x définie sur ℝ.",
          "1. En -∞ : lim [f(x) - x] = lim (x - 1)e^x = 0 par croissances comparées, donc (Δ) : y = x est asymptote oblique en -∞. Le signe de f(x) - x est celui de (x - 1).",
          "2. En +∞ : lim f(x) = +∞ et lim f(x)/x = +∞, donc (C_f) admet une branche parabolique de direction (Oy).",
          "3. Dérivée : f'(x) = x e^x + 1. Le minimum de x ↦ x e^x sur ℝ vaut -1/e, donc f'(x) ≥ 1 - 1/e > 0 : f est strictement croissante sur ℝ.",
          "4. IPP : En posant u(x) = x - 1 et v'(x) = e^x, I = [(x - 1)e^x]_0^1 - [e^x]_0^1 = 2 - e. L'aire vaut A = (-I) × ||i|| × ||j|| = 4(e - 2) cm².",
        ],
      },
    ],
  },
  {
    id: "imported_2bac_sm_s1_ds1",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS1_2BAC_SM_Moulay_Youssef_Rabat.pdf",
    titleAr: "فرض محروس مستورد — 2 باك علوم رياضية أ و ب (ثانوية مولاي يوسف · الرباط)",
    titleFr: "Devoir Surveillé Importé — 2ème Bac Sciences Maths A & B (Lycée Moulay Youssef)",
    schoolOriginAr: "أكاديمية الرباط سلا القنيطرة · ثانوية مولاي يوسف التقنية والرياضية",
    schoolOriginFr: "AREF Rabat · Lycée Moulay Youssef (Classes Sciences Mathématiques)",
    detectedTrackCode: "2BAC_SM",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S1",
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 30,
    n2: 40,
    n3: 30,
    exercises: [
      {
        id: "ex1_sm_suites_adjacentes",
        titleAr: "المتتاليات المتحادية ومبرهنة التزايدات المنتهية (TAF)",
        titleFr: "Suites adjacentes et Théorème des Accroissements Finis (TAF)",
        points: 8,
        weight: 40,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse SM — Suites & TAF",
        capacitiesAr: [
          "توظيف مبرهنة التزايدات المنتهية لإثبات متفاوتات تقارب متتالية",
          "إثبات تحادي متتاليتين واستنتاج تقاربهما نحو نفس النهاية",
        ],
        capacitiesFr: [
          "Appliquer l'inégalité des accroissements finis (IAF) à une suite récurrente",
          "Démontrer que deux suites sont adjacentes et encadrer leur limite commune",
        ],
        questionsAr: [
          "نعتبر المتتاليتين (u_n) و (v_n) المعرفتين لكل n ≥ 1 بـ: u_n = ∑_{k=1}^n 1/k² و v_n = u_n + 1/n.",
          "1. بين أن المتتالية (u_n) تزايدية قطعا وأن المتتالية (v_n) تناقصية قطعا لكل n ≥ 1.",
          "2. استنتج أن المتتاليتين (u_n) و (v_n) متحاديتان وأنهما تتقاربان نحو نفس النهاية L مع 1 < L ≤ 2.",
          "3. بتطبيق مبرهنة التزايدات المنتهية على الدالة x ↦ arctan(x) على المجال [n, n+1]، بين أن: 1/(1 + (n+1)²) < arctan(n+1) - arctan(n) < 1/(1 + n²).",
        ],
        questionsFr: [
          "On considère les suites (u_n) et (v_n) définies pour tout n ≥ 1 par : u_n = ∑_{k=1}^n 1/k² et v_n = u_n + 1/n.",
          "1. Montrer que la suite (u_n) est strictement croissante et que la suite (v_n) est strictement décroissante.",
          "2. En déduire que les suites (u_n) et (v_n) sont adjacentes et convergent vers une même limite L ∈ ]1, 2].",
          "3. En appliquant le théorème des accroissements finis (TAF) à la fonction x ↦ arctan(x) sur [n, n+1], établir que : 1/(1 + (n+1)²) < arctan(n+1) - arctan(n) < 1/(1 + n²).",
        ],
        questionsModelB_Ar: [
          "نعتبر المتتاليتين (u_n) و (v_n) المعرفتين لكل n ≥ 1 بـ: u_n = ∑_{k=1}^n 1/k³ و v_n = u_n + 1/(2n²).",
          "1. بين أن المتتالية (u_n) تزايدية قطعا وأن المتتالية (v_n) تناقصية قطعا لكل n ≥ 1.",
          "2. استنتج أن المتتاليتين (u_n) و (v_n) متحاديتان ومتقاربتان نحو نفس النهاية L.",
          "3. بتطبيق مبرهنة التزايدات المنتهية على الدالة x ↦ ln(x) على المجال [n, n+1]، بين أن: 1/(n+1) < ln(n+1) - ln(n) < 1/n.",
        ],
        questionsModelB_Fr: [
          "On considère les suites (u_n) et (v_n) définies pour tout n ≥ 1 par : u_n = ∑_{k=1}^n 1/k³ et v_n = u_n + 1/(2n²).",
          "1. Montrer que (u_n) est strictement croissante et que (v_n) est strictement décroissante.",
          "2. En déduire que (u_n) et (v_n) sont adjacentes et convergent vers une même limite L.",
          "3. En appliquant le TAF à la fonction x ↦ ln(x) sur [n, n+1], montrer que : 1/(n+1) < ln(n+1) - ln(n) < 1/n.",
        ],
        questionBaremes: [0.5, 2.5, 2.5, 2.5],
        solutionsAr: [
          "تعريف المتتاليتين: u_n مجموع مقلوبات المربعات و v_n = u_n + 1/n.",
          "1. لدينا u_{n+1} - u_n = 1/(n+1)² > 0، و v_{n+1} - v_n = 1/(n+1)² + 1/(n+1) - 1/n = -1/[n(n+1)²] < 0.",
          "2. بما أن (u_n) تزايدية و (v_n) تناقصية و lim (v_n - u_n) = lim (1/n) = 0، فهما متحاديتان ومتقاربتان نحو نفس النهاية L، ولدينا u_1 = 1 < L ≤ v_1 = 2.",
          "3. الدالة x ↦ arctan(x) متصلة على [n, n+1] وقابلة للاشتقاق على ]n, n+1[، فحسب TAF يوجد c ∈ ]n, n+1[ بحيث arctan(n+1) - arctan(n) = 1/(1 + c²)، ومن تأطير c نحصل على المتفاوتة.",
        ],
        solutionsFr: [
          "Suites (u_n) et (v_n) définies pour n ≥ 1.",
          "1. u_{n+1} - u_n = 1/(n+1)² > 0 et v_{n+1} - v_n = -1/[n(n+1)²] < 0.",
          "2. (u_n) croissante, (v_n) décroissante et lim (v_n - u_n) = 0 : elles sont adjacentes et convergent vers L ∈ [u_1, v_1] = [1, 2].",
          "3. Par le TAF appliqué à arctan sur [n, n+1], il existe c ∈ ]n, n+1[ tel que arctan(n+1) - arctan(n) = 1/(1 + c²), d'où l'encadrement.",
        ],
      },
      {
        id: "ex2_sm_probleme_arctan",
        titleAr: "مسألة معمقة: الاتصال والاشتقاق العكسي ودالة قوس الظل (Arctan)",
        titleFr: "Problème d'approfondissement : Bijection, fonction Arctan et équation fonctionnelle",
        points: 12,
        weight: 60,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse SM — Fonction Arctan & Bijections",
        capacitiesAr: [
          "دراسة دالة مركبة تشتمل على arctan وتحديد مقارباتها ومشتقتها",
          "حل معادلات مثلثية وعكسية واستنتاج مجاميع متسلسلات",
        ],
        capacitiesFr: [
          "Étudier une fonction composée avec arctan, sa dérivabilité et ses asymptotes",
          "Simplifier des expressions trigonométriques inverses et calculer la limite d'une somme",
        ],
        questionsAr: [
          "نعتبر الدالة العددية f المعرفة على المجال I = [0, +∞[ بـ: f(x) = arctan(√(x + 1)) - arctan(√x).",
          "1. أحسب f(0) و lim_{x→+∞} f(x)، ثم بين أن الدالة f قابلة للاشتقاق على ]0, +∞[ وأدرس قابلية اشتقاقها على اليمين في 0.",
          "2. بين أنه لكل x > 0 لدينا: f'(x) = 1/[2(x + 2)√(x + 1)] - 1/[2(x + 1)√x]، ثم استنتج رتابة الدالة f على [0, +∞[.",
          "3. تحقق أنه لكل k ∈ N* لدينا: arctan(1/(1 + k + k²)) = arctan(k + 1) - arctan(k)، ثم أحسب بدلالة n المجموع S_n = ∑_{k=1}^n arctan(1/(1 + k + k²)) وحدد نهايته.",
        ],
        questionsFr: [
          "Soit f la fonction définie sur I = [0, +∞[ par : f(x) = arctan(√(x + 1)) - arctan(√x).",
          "1. Calculer f(0) et lim_{x→+∞} f(x). Étudier la dérivabilité de f à droite en x_0 = 0.",
          "2. Calculer f'(x) pour tout x > 0 et en déduire le sens de variation de f sur [0, +∞[.",
          "3. Montrer que pour tout k ∈ ℕ*, arctan(1/(1 + k + k²)) = arctan(k + 1) - arctan(k), puis calculer la somme télescopique S_n = ∑_{k=1}^n arctan(1/(1 + k + k²)) et sa limite.",
        ],
        questionsModelB_Ar: [
          "نعتبر الدالة العددية f المعرفة على المجال I = [0, +∞[ بـ: f(x) = arctan(x + 1) - arctan(x).",
          "1. أحسب f(0) و lim_{x→+∞} f(x)، ثم بين أن الدالة f قابلة للاشتقاق على [0, +∞[.",
          "2. بين أنه لكل x ≥ 0 لدينا: f'(x) = (-2x - 1)/[(1 + x²)(1 + (x+1)²)]، ثم استنتج رتابة الدالة f.",
          "3. بين أنه لكل x ≥ 0 لدينا: f(x) = arctan(1/(1 + x + x²))، ثم استنتج نهاية المجموع S_n = ∑_{k=1}^n f(k).",
        ],
        questionsModelB_Fr: [
          "Soit f la fonction définie sur I = [0, +∞[ par : f(x) = arctan(x + 1) - arctan(x).",
          "1. Calculer f(0) et lim_{x→+∞} f(x), puis justifier la dérivabilité de f sur [0, +∞[.",
          "2. Montrer que pour tout x ≥ 0, f'(x) = (-2x - 1)/[(1 + x²)(1 + (x+1)²)] et dresser le tableau de variations.",
          "3. Établir que f(x) = arctan(1/(1 + x + x²)) et calculer la limite de S_n = ∑_{k=1}^n f(k).",
        ],
        questionBaremes: [1.0, 3.5, 3.5, 4.0],
        solutionsAr: [
          "معطيات المسألة: f(x) = arctan(√(x + 1)) - arctan(√x) على [0, +∞[.",
          "1. لدينا f(0) = arctan(1) - arctan(0) = π/4، وعند +∞ تؤول الدالتان إلى π/2 إذن lim f(x) = 0. في 0+، نسبة التزايد تؤول إلى -∞ لوجود √x، إذن غير قابلة للاشتقاق في 0+.",
          "2. بحساب المشتقة نجد أن الحد الثاني أكبر من الأول لكل x > 0، إذن f'(x) < 0 ومنه f تناقصية قطعا وتنقل [0, +∞[ إلى ]0, π/4].",
          "3. بحساب tan(arctan(k+1) - arctan(k)) = [(k+1) - k]/[1 + k(k+1)] = 1/(1 + k + k²). وبالتلسكوب نجد S_n = arctan(n + 1) - π/4، ومنه lim S_n = π/2 - π/4 = π/4.",
        ],
        solutionsFr: [
          "Données : f(x) = arctan(√(x + 1)) - arctan(√x) sur [0, +∞[.",
          "1. f(0) = π/4 et lim_{+∞} f(x) = π/2 - π/2 = 0. En 0+, le taux d'accroissement tend vers -∞ (demi-tangente verticale).",
          "2. Par dérivation des fonctions composées, f'(x) < 0 pour tout x > 0, donc f est strictement décroissante.",
          "3. Par la formule de tan(a - b), tan(arctan(k+1) - arctan(k)) = 1/(1 + k + k²). Par télescopage, S_n = arctan(n + 1) - π/4 → π/4.",
        ],
      },
    ],
  },
  {
    id: "imported_1bac_sx_s1_ds1",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS1_1BAC_ScExp_Fes_Moulay_Idriss.pdf",
    titleAr: "فرض محروس مستورد — الأولى باكالوريا علوم تجريبية ورياضية (المنطق + المرجح + الدوال)",
    titleFr: "Devoir Surveillé Importé — 1ère Bac Sciences Exp. & Maths (Logique, Barycentre & Fonctions)",
    schoolOriginAr: "أكاديمية فاس مكناس · ثانوية مولاي إدريس التأهيلية",
    schoolOriginFr: "AREF Fès-Meknès · Lycée Qualifiant Moulay Idriss",
    detectedTrackCode: "1BAC_SX",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S1",
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 45,
    n2: 35,
    n3: 20,
    exercises: [
      {
        id: "ex1_1bac_logique",
        titleAr: "مبادئ في المنطق الرياضي وطرق البرهان",
        titleFr: "Notions de logique mathématique et modes de raisonnement",
        points: 6,
        weight: 30,
        category: "Algebra",
        subCategory: "منطق ومجموعات",
        subCategoryFr: "Logique & Raisonnement",
        capacitiesAr: [
          "توظيف الاستدلال بالخلف والاستلزام المضاد للعكس وفصل الحالات",
          "استعمال البرهان بالترجع لإثبات مجاميع ومتفاوتات وقابلية القسمة",
        ],
        capacitiesFr: [
          "Utiliser le raisonnement par contraposée, par l'absurde et par disjonction des cas",
          "Rédiger un raisonnement par récurrence pour une somme ou une divisibilité",
        ],
        questionsAr: [
          "1. باستعمال الاستلزام المضاد للعكس، بين أنه لكل x و y من R: (x ≠ y و x + y ≠ 2) ⇒ x² - 2x ≠ y² - 2y.",
          "2. حل في المجموعة R بالاعتماد على فصل الحالات المعادلة: |x - 2| + |x + 1| = 5.",
          "3. بين بالترجع أنه لكل n من N* لدينا: 1 + 2 + 2² + ... + 2^{n-1} = 2^n - 1، وأن العدد 4^n - 1 يقبل القسمة على 3.",
        ],
        questionsFr: [
          "1. Par contraposée, montrer que pour tous réels x et y : (x ≠ y et x + y ≠ 2) ⇒ x² - 2x ≠ y² - 2y.",
          "2. Résoudre dans ℝ par disjonction des cas l'équation : |x - 2| + |x + 1| = 5.",
          "3. Démontrer par récurrence que pour tout n ∈ ℕ*, 1 + 2 + ... + 2^{n-1} = 2^n - 1 et que 4^n - 1 est divisible par 3.",
        ],
        questionsModelB_Ar: [
          "1. باستعمال الاستلزام المضاد للعكس، بين أنه لكل x و y من R: (x ≠ y و x + y ≠ 4) ⇒ x² - 4x ≠ y² - 4y.",
          "2. حل في المجموعة R بالاعتماد على فصل الحالات المعادلة: |x - 3| + |x + 1| = 6.",
          "3. بين بالترجع أنه لكل n من N* لدينا: 7^n - 1 يقبل القسمة على 6.",
        ],
        questionsModelB_Fr: [
          "1. Par contraposée, montrer que pour tous réels x et y : (x ≠ y et x + y ≠ 4) ⇒ x² - 4x ≠ y² - 4y.",
          "2. Résoudre dans ℝ par disjonction des cas l'équation : |x - 3| + |x + 1| = 6.",
          "3. Démontrer par récurrence que pour tout n ∈ ℕ*, 7^n - 1 est divisible par 6.",
        ],
        questionBaremes: [2.0, 2.0, 2.0],
        solutionsAr: [
          "1. المضاد للعكس: نفترض x² - 2x = y² - 2y، أي (x - y)(x + y - 2) = 0، ومنه x = y أو x + y = 2، وهو المطلوب.",
          "2. فصل الحالات على المجالات ]-∞, -1] و [-1, 2] و [2, +∞[ يعطي مجموعة الحلول S = {-2, 3}.",
          "3. بالترجع: 4^{n+1} - 1 = 4(4^n - 1) + 3 = 4(3k) + 3 = 3(4k + 1) مضاعف للعدد 3.",
        ],
        solutionsFr: [
          "1. Contraposée : x² - 2x = y² - 2y ⇔ (x - y)(x + y - 2) = 0 ⇔ x = y ou x + y = 2.",
          "2. Disjonction sur ]-∞, -1], [-1, 2] et [2, +∞[ : on obtient S = {-2, 3}.",
          "3. Hérédité : 4^{n+1} - 1 = 4(4^n - 1) + 3 = 3(4k + 1), multiple de 3.",
        ],
      },
      {
        id: "ex2_1bac_barycentre",
        titleAr: "المرجح في المستوى ومجموعات النقط",
        titleFr: "Barycentre dans le plan et ensembles de points",
        points: 6,
        weight: 30,
        category: "Geometry",
        subCategory: "هندسة مستوية",
        subCategoryFr: "Géométrie plane — Barycentre",
        capacitiesAr: [
          "إنشاء مرجح نقطتين أو ثلاث نقط وتوظيف خاصية التجميعية",
          "تحديد مجموعة النقط في المستوى باستعمال الاختزال المتجهي للمرجح",
        ],
        capacitiesFr: [
          "Construire le barycentre de deux ou trois points pondérés et utiliser l'associativité",
          "Déterminer et construire un lieu géométrique de points à l'aide de la réduction vectorielle",
        ],
        questionsAr: [
          "ليكن ABC مثلثاً في المستوى. نعتبر النقطة I مرجح النظمة {(A, 1); (B, 2)} والنقطة G مرجح النظمة {(A, 1); (B, 2); (C, 3)}.",
          "1. أكتب المتجهة AI بدلالة AB ثم أنشئ النقطة I.",
          "2. باستعمال خاصية التجميعية، بين أن النقطة G هي منتصف القطعة [IC].",
          "3. حدد وأنشئ مجموعة النقط M من المستوى التي تحقق: ||MA + 2MB + 3MC|| = 12.",
        ],
        questionsFr: [
          "Soit ABC un triangle. On considère I = Bar{(A, 1); (B, 2)} et G = Bar{(A, 1); (B, 2); (C, 3)}.",
          "1. Exprimer le vecteur AI en fonction de AB puis construire le point I.",
          "2. En utilisant l'associativité du barycentre, montrer que G est le milieu du segment [IC].",
          "3. Déterminer et construire l'ensemble (Γ) des points M du plan tels que : ||MA + 2MB + 3MC|| = 12.",
        ],
        questionsModelB_Ar: [
          "ليكن ABC مثلثاً في المستوى. نعتبر النقطة I مرجح النظمة {(A, 2); (B, 1)} والنقطة G مرجح النظمة {(A, 2); (B, 1); (C, 3)}.",
          "1. أكتب المتجهة AI بدلالة AB ثم أنشئ النقطة I.",
          "2. باستعمال خاصية التجميعية، بين أن النقطة G هي منتصف القطعة [IC].",
          "3. حدد وأنشئ مجموعة النقط M من المستوى التي تحقق: ||2MA + MB + 3MC|| = 18.",
        ],
        questionsModelB_Fr: [
          "Soit ABC un triangle. On considère I = Bar{(A, 2); (B, 1)} et G = Bar{(A, 2); (B, 1); (C, 3)}.",
          "1. Exprimer AI en fonction de AB et construire I.",
          "2. Par associativité, montrer que G est le milieu de [IC].",
          "3. Déterminer l'ensemble des points M du plan tels que : ||2MA + MB + 3MC|| = 18.",
        ],
        questionBaremes: [1.5, 2.0, 2.5],
        solutionsAr: [
          "1. بما أن I مرجح {(A,1);(B,2)} فإن AI = (2/3)AB.",
          "2. حسب خاصية التجميعية، G مرجح {(I, 1+2); (C, 3)} أي {(I, 3); (C, 3)}، إذن G منتصف القطعة [IC].",
          "3. لدينا MA + 2MB + 3MC = 6MG لكل نقطة M، إذن ||6MG|| = 12 يكافئ MG = 2. مجموعة النقط هي الدائرة التي مركزها G وشعاعها R = 2.",
        ],
        solutionsFr: [
          "1. Comme I = Bar{(A,1);(B,2)}, on a AI = (2/3)AB.",
          "2. Par associativité, G = Bar{(I, 3); (C, 3)}, donc G est l'isobarycentre (milieu) de [IC].",
          "3. Par réduction barycentrique, ||6MG|| = 12 ⇔ MG = 2 : c'est le cercle de centre G et de rayon 2.",
        ],
      },
      {
        id: "ex3_1bac_fonctions",
        titleAr: "عموميات حول الدوال العددية: المطاريف، الرتابة، وتركيب دالتين",
        titleFr: "Généralités sur les fonctions : Extremums, monotonie et composition",
        points: 8,
        weight: 40,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse — Généralités sur les fonctions",
        capacitiesAr: [
          "دراسة رتابة دالة باستعمال معدل التغير وتحديد مطاريفها",
          "تحديد مجموعة تعريف ورتابة مركب دالتين gof",
        ],
        capacitiesFr: [
          "Étudier la monotonie via le taux de variation et déterminer un extremum",
          "Déterminer le domaine et le sens de variation d'une fonction composée gof",
        ],
        questionsAr: [
          "نعتبر الدالتين العدديتين f و g المعرفتين بـ: f(x) = x² - 4x + 5 و g(x) = √(x - 1).",
          "1. بين أنه لكل x من R لدينا f(x) ≥ 1، واستنتج القيمة الدنيا للدالة f على R.",
          "2. أدرس رتابة الدالة f على كل من المجالين [2, +∞[ و ]-∞, 2] ثم ضع جدول تغيراتها.",
          "3. حدد مجموعة تعريف الدالة المركبة h = g ∘ f، ثم أدرس رتابتها على المجال [2, +∞[ وأعط صيغة h(x) المبسطة.",
        ],
        questionsFr: [
          "On considère les fonctions f et g définies par : f(x) = x² - 4x + 5 et g(x) = √(x - 1).",
          "1. Montrer que pour tout x ∈ ℝ, f(x) ≥ 1 et préciser le minimum absolu de f sur ℝ.",
          "2. Étudier la monotonie de f sur [2, +∞[ et sur ]-∞, 2], puis dresser son tableau de variations.",
          "3. Déterminer le domaine de définition de h = g ∘ f, étudier sa monotonie sur [2, +∞[ et simplifier h(x).",
        ],
        questionsModelB_Ar: [
          "نعتبر الدالتين العدديتين f و g المعرفتين بـ: f(x) = x² - 6x + 11 و g(x) = √(x - 2).",
          "1. بين أنه لكل x من R لدينا f(x) ≥ 2، واستنتج القيمة الدنيا للدالة f على R.",
          "2. أدرس رتابة الدالة f على كل من المجالين [3, +∞[ و ]-∞, 3] ثم ضع جدول تغيراتها.",
          "3. حدد مجموعة تعريف الدالة المركبة h = g ∘ f، ثم أدرس رتابتها على المجال [3, +∞[ وأعط صيغة h(x) المبسطة.",
        ],
        questionsModelB_Fr: [
          "On considère les fonctions f et g définies par : f(x) = x² - 6x + 11 et g(x) = √(x - 2).",
          "1. Montrer que pour tout x ∈ ℝ, f(x) ≥ 2 et préciser le minimum de f sur ℝ.",
          "2. Étudier la monotonie de f sur [3, +∞[ et sur ]-∞, 3], puis dresser son tableau de variations.",
          "3. Déterminer D_h pour h = g ∘ f, étudier sa monotonie sur [3, +∞[ et simplifier h(x).",
        ],
        questionBaremes: [2.0, 3.0, 3.0],
        solutionsAr: [
          "1. الشكل القانوني: f(x) - 1 = x² - 4x + 4 = (x - 2)² ≥ 0 لكل x من R، إذن 1 قيمة دنيا مطلقة لـ f عند x = 2.",
          "2. معدل التغير T(a, b) = a + b - 4. على [2, +∞[ لدينا T ≥ 0 إذن f تزايدية، وعلى ]-∞, 2] تناقصية.",
          "3. بما أن f(x) ≥ 1 لكل x من R فإن D_h = R. ولدينا h(x) = √((x - 2)²) = |x - 2|، وهي تزايدية على [2, +∞[ كمركب دالتين تزايديتين.",
        ],
        solutionsFr: [
          "1. Forme canonique : f(x) - 1 = (x - 2)² ≥ 0 sur ℝ, donc 1 est le minimum absolu atteint en x = 2.",
          "2. Taux de variation T(a, b) = a + b - 4 : positif sur [2, +∞[ (f croissante) et négatif sur ]-∞, 2] (f décroissante).",
          "3. Comme f(ℝ) = [1, +∞[ ⊂ D_g, on a D_h = ℝ et h(x) = |x - 2|, croissante sur [2, +∞[.",
        ],
      },
    ],
  },
  {
    id: "imported_tcs_biof_s1_ds1",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS1_TCS_BIOF_Marrakech_Ibn_Abbad.pdf",
    titleAr: "فرض محروس مستورد — الجذع المشترك العلمي BIOF (الحسابيات + الحساب المتجهي + الإسقاط)",
    titleFr: "Devoir Surveillé Importé — Tronc Commun Scientifique BIOF (Arithmétique, Vecteurs & Projection)",
    schoolOriginAr: "أكاديمية مراكش آسفي · ثانوية ابن عباد التأهيلية",
    schoolOriginFr: "AREF Marrakech-Safi · Lycée Qualifiant Ibn Abbad",
    detectedTrackCode: "TCS",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S1",
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 50,
    n2: 35,
    n3: 15,
    exercises: [
      {
        id: "ex1_tcs_arithmetique",
        titleAr: "الحسابيات في المجموعة N (الزوجية، التفكيك، والقواسم)",
        titleFr: "Arithmétique dans ℕ (Parité, PGCD/PPCM et Divisibilité)",
        points: 7,
        weight: 35,
        category: "Algebra",
        subCategory: "حسابيات",
        subCategoryFr: "Arithmétique dans ℕ",
        capacitiesAr: [
          "دراسة زوجية تعبير جبري وتوظيف تفكيك عدد إلى عوامل أولية",
          "تحديد PGCD و PPCM وحل معادلات القواسم في N",
        ],
        capacitiesFr: [
          "Étudier la parité d'une expression et décomposer en produit de facteurs premiers",
          "Calculer PGCD et PPCM et déterminer les diviseurs entiers",
        ],
        questionsAr: [
          "1. ليكن n عدداً صحيحاً طبيعياً. أدرس زوجية العدد A = n² + 3n + 4، ثم استنتج أن (n² + 3n + 4)(n + 1) مضاعف للعدد 2.",
          "2. فكك العددين a = 540 و b = 378 إلى جداء عوامل أولية، ثم حدد PGCD(a, b) و PPCM(a, b) واختزل الكسر 378/540.",
          "3. حدد جميع القيم الممكنة للعدد الصحيح الطبيعي n بحيث يكون (n + 3) قاسماً للعدد (2n + 14).",
        ],
        questionsFr: [
          "1. Soit n ∈ ℕ. Étudier la parité de l'entier A = n² + 3n + 4.",
          "2. Décomposer a = 540 et b = 378 en produit de facteurs premiers, puis déterminer PGCD(a, b), PPCM(a, b) et simplifier 378/540.",
          "3. Déterminer tous les entiers naturels n tels que (n + 3) divise (2n + 14).",
        ],
        questionsModelB_Ar: [
          "1. ليكن n عدداً صحيحاً طبيعياً. أدرس زوجية العدد A = n² + 5n + 6.",
          "2. فكك العددين a = 720 و b = 504 إلى جداء عوامل أولية، ثم حدد PGCD(a, b) و PPCM(a, b) واختزل الكسر 504/720.",
          "3. حدد جميع القيم الممكنة للعدد الصحيح الطبيعي n بحيث يكون (n + 2) قاسماً للعدد (2n + 12).",
        ],
        questionsModelB_Fr: [
          "1. Soit n ∈ ℕ. Étudier la parité de l'entier A = n² + 5n + 6.",
          "2. Décomposer a = 720 et b = 504 en facteurs premiers, puis déterminer PGCD(a, b) et PPCM(a, b).",
          "3. Déterminer tous les entiers naturels n tels que (n + 2) divise (2n + 12).",
        ],
        questionBaremes: [2.0, 3.0, 2.0],
        solutionsAr: [
          "1. نكتب A = n(n+1) + 2(n+2)، مجموع عددين زوجيين فهو زوجي لكل n من N.",
          "2. لدينا 540 = 2² × 3³ × 5 و 378 = 2 × 3³ × 7. إذن PGCD = 54 و PPCM = 3780، والكسر المختزل هو 7/10.",
          "3. لدينا 2n + 14 = 2(n + 3) + 8، إذن (n + 3) يقسم 8 أي n + 3 ∈ {1, 2, 4, 8}، وبما أن n + 3 ≥ 3 فإن n ∈ {1, 5}.",
        ],
        solutionsFr: [
          "1. A = n(n+1) + 2(n+2) est pair comme somme de deux entiers pairs.",
          "2. 540 = 2² × 3³ × 5 et 378 = 2 × 3³ × 7, d'où PGCD = 54, PPCM = 3780 et 378/540 = 7/10.",
          "3. 2n + 14 = 2(n + 3) + 8, donc (n + 3) ∈ D_8 = {1, 2, 4, 8}. Comme n + 3 ≥ 3, on obtient n ∈ {1, 5}.",
        ],
      },
      {
        id: "ex2_tcs_vecteurs",
        titleAr: "الحساب المتجهي في المستوى واستقامية النقط",
        titleFr: "Calcul vectoriel dans le plan et colinéarité",
        points: 7,
        weight: 35,
        category: "Geometry",
        subCategory: "هندسة مستوية",
        subCategoryFr: "Géométrie plane — Vecteurs",
        capacitiesAr: [
          "توظيف علاقة شال لإنشاء نقط والتعبير عن متجهات بدلالة متجهتين",
          "إثبات استقامية ثلاث نقط أو توازي مستقيمين متجهياً",
        ],
        capacitiesFr: [
          "Utiliser la relation de Chasles pour décomposer un vecteur dans une base",
          "Établir la colinéarité de deux vecteurs et en déduire l'alignement de trois points",
        ],
        questionsAr: [
          "ليكن ABC مثلثاً في المستوى. نعتبر النقطتين E و F المعرفتين بـ: AE = (3/2)AB و AF = 3AC - AB.",
          "1. أنشئ شكلاً هندسياً مناسباً يتضمن النقط A و B و C و E و F.",
          "2. باستعمال علاقة شال، بين أن: CE = (3/2)AB - AC وأن CF = -AB + 2AC.",
          "3. نعتبر النقطة M حيث AM = -(1/2)AB + (3/2)AC. عبر عن CM بدلالة CF واستنتج أن النقط C و M و F مستقيمية.",
        ],
        questionsFr: [
          "Soit ABC un triangle. On considère les points E et F définis par : AE = (3/2)AB et AF = 3AC - AB.",
          "1. Construire une figure soignée comportant les points A, B, C, E et F.",
          "2. À l'aide de la relation de Chasles, montrer que CE = (3/2)AB - AC et CF = -AB + 2AC.",
          "3. Soit M le point défini par AM = -(1/2)AB + (3/2)AC. Exprimer CM en fonction de CF et en déduire que C, M et F sont alignés.",
        ],
        questionsModelB_Ar: [
          "ليكن ABC مثلثاً في المستوى. نعتبر النقطتين E و F المعرفتين بـ: AE = 2AB و AF = 2AC - AB.",
          "1. أنشئ شكلاً هندسياً مناسباً يتضمن النقط A و B و C و E و F.",
          "2. باستعمال علاقة شال، بين أن: CE = 2AB - AC وأن CF = -AB + AC.",
          "3. استنتج العلاقة المتجهية بين النقط وأثبت الاستقامية.",
        ],
        questionsModelB_Fr: [
          "Soit ABC un triangle. On définit E et F par : AE = 2AB et AF = 2AC - AB.",
          "1. Construire la figure géométrique complète.",
          "2. Par la relation de Chasles, exprimer CE et CF en fonction de AB et AC.",
          "3. En déduire la colinéarité et l'alignement des points.",
        ],
        questionBaremes: [2.0, 2.5, 2.5],
        solutionsAr: [
          "1. إنشاء المثلث ABC وتمثيل النقطتين E و F باحترام المعاملات المتجهية.",
          "2. حسب علاقة شال: CE = CA + AE = -AC + (3/2)AB، و CF = CA + AF = -AC + 3AC - AB = -AB + 2AC.",
          "3. لدينا CM = CA + AM = -(1/2)AB + (1/2)AC = (1/2)(-AB + AC)... وبمقارنة المعاملات نجد CM = (1/2)CF، إذن C و M و F مستقيمية.",
        ],
        solutionsFr: [
          "1. Construction géométrique des points E et F à partir du triangle ABC.",
          "2. Par Chasles : CE = CA + AE = (3/2)AB - AC et CF = CA + AF = -AB + 2AC.",
          "3. On trouve CM colinéaire à CF, d'où l'alignement des points C, M et F.",
        ],
      },
      {
        id: "ex3_tcs_projection",
        titleAr: "الإسقاط في المستوى ومبرهنة طاليس المتجهية",
        titleFr: "La projection dans le plan et théorème de Thalès vectoriel",
        points: 6,
        weight: 30,
        category: "Geometry",
        subCategory: "هندسة مستوية",
        subCategoryFr: "Géométrie plane — Projection",
        capacitiesAr: [
          "استغلال خاصية محافظة الإسقاط على معامل استقامية متجهتين",
          "توظيف مبرهنة طاليس المتجهية لإثبات منتصف قطعة أو علاقة متجهية",
        ],
        capacitiesFr: [
          "Utiliser la conservation du coefficient de colinéarité par projection",
          "Démontrer une égalité vectorielle sur les projetés parallèlement à une droite",
        ],
        questionsAr: [
          "ليكن ABC مثلثاً و I منتصف القطعة [AB] و J النقطة المعرفة بـ AJ = (1/3)AC.",
          "1. لتكن K مسقط النقطة J على المستقيم (BC) بتوازٍ مع المستقيم (AB). عبر عن BK بدلالة BC.",
          "2. لتكن H مسقط النقطة I على المستقيم (BC) بتوازٍ مع المستقيم (AC). بين أن H منتصف [BC] واستنتج العلاقة بين HK و BC.",
        ],
        questionsFr: [
          "Soit ABC un triangle, I le milieu de [AB] et J le point tel que AJ = (1/3)AC.",
          "1. Soit K le projeté de J sur (BC) parallèlement à (AB). Exprimer BK en fonction de BC.",
          "2. Soit H le projeté de I sur (BC) parallèlement à (AC). Montrer que H est le milieu de [BC] et exprimer HK en fonction de BC.",
        ],
        questionsModelB_Ar: [
          "ليكن ABC مثلثاً و I منتصف القطعة [AB] و J النقطة المعرفة بـ AJ = (2/5)AC.",
          "1. لتكن K مسقط النقطة J على المستقيم (BC) بتوازٍ مع المستقيم (AB). عبر عن CK بدلالة CB.",
          "2. لتكن H مسقط النقطة I على المستقيم (BC) بتوازٍ مع المستقيم (AC). بين أن H منتصف [BC] واستنتج العلاقة بين HK و BC.",
        ],
        questionsModelB_Fr: [
          "Soit ABC un triangle, I le milieu de [AB] et J tel que AJ = (2/5)AC.",
          "1. Soit K le projeté de J sur (BC) parallèlement à (AB). Exprimer CK en fonction de CB.",
          "2. Soit H le projeté de I sur (BC) parallèlement à (AC). Montrer que H est le milieu de [BC] et exprimer HK en fonction de BC.",
        ],
        questionBaremes: [3.0, 3.0],
        solutionsAr: [
          "1. نعتبر الإسقاط p على (BC) بتوازٍ مع (AB): لدينا p(A) = B و p(C) = C و p(J) = K. وبما أن AJ = (1/3)AC، وبما أن الإسقاط يحافظ على معامل الاستقامية، فإن BK = (1/3)BC.",
          "2. بالإسقاط على (BC) بتوازٍ مع (AC)، صورة المنتصف I لـ [AB] هي المنتصف H لـ [BC]، إذن BH = (1/2)BC ومنه HK = BK - BH = -(1/6)BC.",
        ],
        solutionsFr: [
          "1. Par projection p sur (BC) parallèlement à (AB), p(A)=B, p(C)=C et p(J)=K. Par conservation du coefficient de colinéarité : BK = (1/3)BC.",
          "2. La projection conserve le milieu donc H est le milieu de [BC] (BH = (1/2)BC), d'où HK = BK - BH = -(1/6)BC.",
        ],
      },
    ],
  },
  {
    id: "imported_aefe_term_spe_ds",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS_Terminale_Spe_Lyautey_Casablanca.pdf",
    titleAr: "فرض محروس مستورد (البعثة الفرنسية AEFE) — Terminale Spécialité Maths (Lycée Lyautey)",
    titleFr: "Devoir Surveillé Importé (AEFE Maroc) — Terminale Spécialité Maths (Lycée Lyautey)",
    schoolOriginAr: "شبكة البعثة الفرنسية بالمغرب AEFE · ثانوية ليوطي الدار البيضاء",
    schoolOriginFr: "Réseau AEFE Maroc · Lycée Lyautey de Casablanca",
    detectedTrackCode: "TERM_SPE_FR",
    detectedSystem: "MISSION_FRANCAISE",
    semester: "S1",
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 35,
    n2: 40,
    n3: 25,
    exercises: [
      {
        id: "ex1_aefe_suites_python",
        titleAr: "المتتاليات العددية والبرمجة بلغة Python",
        titleFr: "Suites numériques, récurrence et algorithme de seuil Python",
        points: 6,
        weight: 30,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse & Algorithmique Python",
        capacitiesAr: [
          "البرهان بالترجع ودراسة تقارب متتالية عددية",
          "كتابة وتأويل دالة برمجية بلغة Python لحساب أصغر رتبة (Seuil)",
        ],
        capacitiesFr: [
          "Raisonner par récurrence et appliquer le théorème de convergence monotone",
          "Compléter et interpréter une fonction Python déterminant un seuil de convergence",
        ],
        questionsAr: [
          "نعتبر المتتالية (u_n) المعرفة بـ u_0 = 5 و u_{n+1} = 0.8 u_n + 2 لكل عدد طبيعي n.",
          "1. بين بالترجع أن u_n ≤ 10 وأن المتتالية (u_n) تزايدية، ثم استنتج أنها متقاربة وحدد نهايتها.",
          "2. نضع v_n = u_n - 10. بين أن (v_n) متتالية هندسية أساسها 0.8، ثم عبر عن u_n بدلالة n.",
          "3. أكتب دالة بلغة Python باسم seuil(eps) تعيد أصغر عدد طبيعي n بحيث |10 - u_n| < eps.",
        ],
        questionsFr: [
          "On considère la suite (u_n) définie par u_0 = 5 et, pour tout n ∈ ℕ, u_{n+1} = 0,8 u_n + 2.",
          "1. Démontrer par récurrence que 5 ≤ u_n ≤ u_{n+1} ≤ 10 pour tout n ∈ ℕ. En déduire que (u_n) converge.",
          "2. On pose v_n = u_n - 10. Montrer que (v_n) est géométrique de raison 0,8, puis exprimer u_n en fonction de n et calculer sa limite.",
          "3. Écrire une fonction Python `seuil(eps)` renvoyant le plus petit entier n tel que 10 - u_n < eps.",
        ],
        questionsModelB_Ar: [
          "نعتبر المتتالية (u_n) المعرفة بـ u_0 = 4 و u_{n+1} = 0.75 u_n + 3 لكل عدد طبيعي n.",
          "1. بين بالترجع أن u_n ≤ 12 وأن المتتالية (u_n) تزايدية، ثم استنتج أنها متقاربة.",
          "2. نضع v_n = u_n - 12. بين أن (v_n) متتالية هندسية أساسها 0.75، ثم عبر عن u_n بدلالة n.",
          "3. أكتب دالة بلغة Python باسم seuil(eps) تعيد أصغر عدد طبيعي n بحيث |12 - u_n| < eps.",
        ],
        questionsModelB_Fr: [
          "On considère la suite (u_n) définie par u_0 = 4 et, pour tout n ∈ ℕ, u_{n+1} = 0,75 u_n + 3.",
          "1. Démontrer par récurrence que 4 ≤ u_n ≤ u_{n+1} ≤ 12 pour tout n ∈ ℕ. En déduire que (u_n) converge.",
          "2. On pose v_n = u_n - 12. Montrer que (v_n) est géométrique de raison 0,75, puis exprimer u_n en fonction de n.",
          "3. Écrire une fonction Python `seuil(eps)` renvoyant le plus petit entier n tel que 12 - u_n < eps.",
        ],
        questionBaremes: [0.5, 2.0, 2.0, 1.5],
        solutionsAr: [
          "متتالية تآلفية ترجعية u_{n+1} = 0.8 u_n + 2.",
          "1. بالترجع المباشر: الدالة x ↦ 0.8x + 2 تزايدية على R وتحافظ على الترتيب، إذن 5 ≤ u_n ≤ u_{n+1} ≤ 10.",
          "2. لدينا v_{n+1} = 0.8 u_n - 8 = 0.8(u_n - 10) = 0.8 v_n. إذن u_n = 10 - 5×(0.8)^n ونهايتها 10.",
          "3. كود Python: `def seuil(eps): n, u = 0, 5 ; while 10 - u >= eps: u = 0.8*u + 2; n += 1 ; return n`.",
        ],
        solutionsFr: [
          "Suite arithmético-géométrique u_{n+1} = 0,8 u_n + 2.",
          "1. Récurrence immédiate grâce à la croissance de f(x) = 0,8x + 2 sur ℝ : (u_n) est croissante et majorée par 10, donc convergente.",
          "2. v_{n+1} = 0,8 v_n avec v_0 = -5, d'où u_n = 10 - 5 × (0,8)^n et lim u_n = 10.",
          "3. Script Python : `def seuil(eps): n, u = 0, 5 ; while 10 - u >= eps: u = 0.8*u + 2; n += 1 ; return n`.",
        ],
      },
      {
        id: "ex2_aefe_convexite_expo",
        titleAr: "الدالة الأسية والتقعر ونقطة الانعطاف (Convexité)",
        titleFr: "Fonction exponentielle, convexité, point d'inflexion et tangentes",
        points: 8,
        weight: 40,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse BOEN — Convexité & Exponentielle",
        capacitiesAr: [
          "حساب المشتقة الثانية f''(x) ودراسة التقعر ونقط الانعطاف",
          "استغلال التقعر لإثبات متفاوتة المماس فوق أو تحت المنحنى",
        ],
        capacitiesFr: [
          "Calculer la dérivée seconde f''(x), étudier la convexité et déterminer le point d'inflexion",
          "Exploiter la position relative d'une courbe convexe par rapport à ses tangentes",
        ],
        questionsAr: [
          "نعتبر الدالة f المعرفة على R بـ: f(x) = (x + 2)e^{-x}.",
          "1. أحسب نهايات f عند -∞ وعند +∞، ثم بين أن f'(x) = (-x - 1)e^{-x} وضع جدول تغيراتها.",
          "2. بين أن f''(x) = x e^{-x} لكل x من R، ثم أدرس تقعر المنحنى (C_f) وحدد إحداثيات نقطة الانعطاف I.",
          "3. أكتب معادلة المماس (T) عند النقطة I(0, 2)، واستنتج أنه لكل x ≥ 0 لدينا: (x + 2)e^{-x} ≥ 2 - x.",
        ],
        questionsFr: [
          "Soit f la fonction définie sur ℝ par : f(x) = (x + 2)e^{-x}.",
          "1. Déterminer les limites de f en -∞ et en +∞. Montrer que f'(x) = (-x - 1)e^{-x} et dresser le tableau de variations.",
          "2. Montrer que f''(x) = x e^{-x} sur ℝ, étudier la convexité de f et préciser les coordonnées du point d'inflexion I.",
          "3. Déterminer l'équation de la tangente (T) en I(0, 2) et en déduire que pour tout x ≥ 0, (x + 2)e^{-x} ≥ 2 - x.",
        ],
        questionsModelB_Ar: [
          "نعتبر الدالة f المعرفة على R بـ: f(x) = (x + 3)e^{-x}.",
          "1. أحسب نهايات f عند -∞ وعند +∞، ثم بين أن f'(x) = (-x - 2)e^{-x} وضع جدول تغيراتها.",
          "2. بين أن f''(x) = (x + 1)e^{-x} لكل x من R، ثم أدرس تقعر المنحنى (C_f) وحدد إحداثيات نقطة الانعطاف I.",
          "3. أكتب معادلة المماس (T) عند النقطة ذات الأفصول 0 واستنتج المتفاوتة المبيانية.",
        ],
        questionsModelB_Fr: [
          "Soit f la fonction définie sur ℝ par : f(x) = (x + 3)e^{-x}.",
          "1. Déterminer les limites de f aux bornes, calculer f'(x) et dresser le tableau de variations.",
          "2. Montrer que f''(x) = (x + 1)e^{-x}, étudier la convexité de f et déterminer le point d'inflexion.",
          "3. Donner l'équation de la tangente en 0 et en déduire l'inégalité de convexité.",
        ],
        questionBaremes: [0.5, 2.5, 2.5, 2.5],
        solutionsAr: [
          "معطيات الدالة: f(x) = (x + 2)e^{-x} على R.",
          "1. lim_{-∞} f(x) = -∞ و lim_{+∞} f(x) = 0 (مقارب أفقي y = 0). المشتقة f'(x) = (-x - 1)e^{-x} تنعدم في -1، والقيمة القصوى هي f(-1) = e.",
          "2. المشتقة الثانية f''(x) = x e^{-x} تنعدم وتغير إشارتها في 0: الدالة مقعرة على ]-∞, 0] ومحدبة على [0, +∞[، ونقطة الانعطاف هي I(0, 2).",
          "3. معادلة المماس في 0 هي y = -x + 2. وبما أن f محدبة على [0, +∞[ فإن منحناها يقع فوق مماساته، ومنه f(x) ≥ 2 - x لكل x ≥ 0.",
        ],
        solutionsFr: [
          "Données : f(x) = (x + 2)e^{-x} sur ℝ.",
          "1. lim_{-∞} f(x) = -∞ et lim_{+∞} f(x) = 0 par croissances comparées. Maximum en x = -1 égal à f(-1) = e.",
          "2. f''(x) = x e^{-x} s'annule en changeant de signe en 0 : f est concave sur ]-∞, 0] et convexe sur [0, +∞[. Point d'inflexion I(0, 2).",
          "3. Tangente en 0 : y = -x + 2. Par convexité sur [0, +∞[, (C_f) est au-dessus de sa tangente, d'où (x + 2)e^{-x} ≥ 2 - x.",
        ],
      },
      {
        id: "ex3_aefe_geometrie_3d",
        titleAr: "الهندسة المتجهية والتحليلية في الفضاء (Géométrie 3D)",
        titleFr: "Géométrie vectorielle et analytique dans l'espace (Orthogonalité & Plans)",
        points: 6,
        weight: 30,
        category: "Geometry",
        subCategory: "هندسة فضائية",
        subCategoryFr: "Géométrie dans l'espace 3D",
        capacitiesAr: [
          "تحديد تمثيل بارامتري لمستقيم ومعادلة ديكارتية لمستوى في الفضاء",
          "إثبات التعامد وتحديد المسقط العمودي والمسافة في الفضاء",
        ],
        capacitiesFr: [
          "Déterminer une représentation paramétrique de droite et une équation cartésienne de plan",
          "Étudier l'orthogonalité et calculer les coordonnées du projeté orthogonal H",
        ],
        questionsAr: [
          "في الفضاء المنسوب إلى معلم متعامد ممنظم (O, i, j, k)، نعتبر النقط A(1, 2, -1) و B(3, 0, 1) و C(0, 1, 2) والنقطة S(2, 3, 2).",
          "1. بين أن النقط A و B و C غير مستقيمية، وأن المتجهة n(1, 2, 1) منظمية على المستوى (ABC)، ثم استنتج معادلة ديكارتية لـ (ABC).",
          "2. حدد تمثيلاً بارامترياً للمستقيم (Δ) المار من S والعمودي على المستوى (ABC).",
          "3. حدد إحداثيات النقطة H المسقط العمودي لـ S على (ABC) وأحسب حجم رباعي الأوجه SABC.",
        ],
        questionsFr: [
          "Dans l'espace muni d'un repère orthonormé (O, i, j, k), on considère A(1, 2, -1), B(3, 0, 1), C(0, 1, 2) et S(2, 3, 2).",
          "1. Vérifier que n(1, 2, 1) est un vecteur normal au plan (ABC) et en déduire que x + 2y + z - 4 = 0 est une équation de (ABC).",
          "2. Donner une représentation paramétrique de la droite (Δ) passant par S et orthogonale au plan (ABC).",
          "3. Déterminer les coordonnées du projeté orthogonal H de S sur (ABC) et calculer la distance SH.",
        ],
        questionsModelB_Ar: [
          "في الفضاء المنسوب إلى معلم متعامد ممنظم (O, i, j, k)، نعتبر النقط A(2, 1, 0) و B(0, 2, 1) و C(1, 0, 2) والنقطة S(3, 3, 3).",
          "1. تحقق أن المتجهة n(1, 1, 1) منظمية على المستوى (ABC) واستنتج معادلة ديكارتية لـ (ABC).",
          "2. حدد تمثيلاً بارامترياً للمستقيم (Δ) المار من S والعمودي على (ABC).",
          "3. حدد إحداثيات المسقط العمودي H لـ S على (ABC) وأحسب المسافة SH.",
        ],
        questionsModelB_Fr: [
          "Dans l'espace muni d'un repère orthonormé (O, i, j, k), on considère A(2, 1, 0), B(0, 2, 1), C(1, 0, 2) et S(3, 3, 3).",
          "1. Vérifier que n(1, 1, 1) est normal au plan (ABC) et déterminer une équation cartésienne de (ABC).",
          "2. Donner une représentation paramétrique de la perpendiculaire (Δ) issue de S.",
          "3. Déterminer les coordonnées du projeté orthogonal H de S sur (ABC) et calculer SH.",
        ],
        questionBaremes: [0.5, 2.0, 1.5, 2.0],
        solutionsAr: [
          "معطيات الفضاء: النقط A و B و C و S(2, 3, 2).",
          "1. لدينا n · AB = 2 - 4 + 2 = 0 و n · AC = -1 - 2 + 3 = 0، إذن n منظمية على (ABC) ومعادلته x + 2y + z - 4 = 0.",
          "2. التمثيل البارامتري لـ (Δ): x = 2 + t ، y = 3 + 2t ، z = 2 + t (حيث t ∈ R).",
          "3. بتعويض التمثيل البارامتري في معادلة (ABC) نجد 6t + 6 = 0 أي t = -1، ومنه H(1, 1, 1) والمسافة SH = √6.",
        ],
        solutionsFr: [
          "Données 3D : Points A, B, C et sommet S(2, 3, 2).",
          "1. n · AB = 0 et n · AC = 0, donc n(1, 2, 1) est normal à (ABC) d'équation x + 2y + z - 4 = 0.",
          "2. Représentation paramétrique de (Δ) : x = 2 + t, y = 3 + 2t, z = 2 + t (t ∈ ℝ).",
          "3. En injectant dans l'équation du plan : (2+t) + 2(3+2t) + (2+t) - 4 = 0 ⇔ 6t = -6 ⇔ t = -1, d'où H(1, 1, 1) et SH = √6.",
        ],
      },
    ],
  },
  {
    id: "imported_2bac_svt_s2_proba",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS3_2BAC_SVT_Tanger_Regnault_IbnKhatib.pdf",
    titleAr: "فرض محروس مستورد رقم 3 — 2 باك علوم الحياة والأرض (الاحتمالات + اللوغاريتم + المتتاليات)",
    titleFr: "Devoir Surveillé Importé N°3 — 2ème Bac SVT & PC (Probabilités, Logarithme ln & Suites)",
    schoolOriginAr: "أكاديمية طنجة تطوان الحسيمة · ثانوية لسان الدين بن الخطيب",
    schoolOriginFr: "AREF Tanger-Tétouan-Al Hoceïma · Lycée Ibn Al Khatib",
    detectedTrackCode: "2BAC_SVT",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S2",
    dsKey: "DS3",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 50,
    n2: 35,
    n3: 15,
    exercises: [
      {
        id: "ex1_svt_probabilites",
        titleAr: "حساب الاحتمالات والمتغير العشوائي والقانون الحداني",
        titleFr: "Calcul des probabilités, variable aléatoire et loi binomiale",
        points: 6,
        weight: 30,
        category: "Probabilities",
        subCategory: "احتمالات وإحصاء",
        subCategoryFr: "Probabilités & Loi Binomiale",
        capacitiesAr: [
          "حساب احتمالات السحب في آن واحد أو بالتتابع",
          "تحديد قانون احتمال متغير عشوائي وأمله الرياضي E(X)",
        ],
        capacitiesFr: [
          "Calculer les probabilités lors d'un tirage simultané ou successif",
          "Déterminer la loi de probabilité d'une variable aléatoire X et son espérance E(X)",
        ],
        questionsAr: [
          "يحتوي صندوق على 9 كرات لا يمكن التمييز بينها باللمس: 4 كرات حمراء، 3 كرات خضراء، وكرتين بيضاوين. نسحب عشوائياً وفي آن واحد 3 كرات من الصندوق.",
          "1. بين أن عدد السحبات الممكنة هو Card(Ω) = 84، ثم أحسب احتمال الحدث A: «سحب 3 كرات من نفس اللون» والحدث B: «سحب كرة بيضاء واحدة على الأقل».",
          "2. ليكن X المتغير العشوائي الذي يربط كل سحبة بعدد الكرات البيضاء المسحوبة. حدد القيم التي يأخذها X، وضع جدول قانون احتماله، ثم أحسب أمله الرياضي E(X).",
        ],
        questionsFr: [
          "Une urne contient 9 boules indiscernables au toucher : 4 rouges, 3 vertes et 2 blanches. On tire simultanément 3 boules de l'urne.",
          "1. Vérifier que Card(Ω) = 84, puis calculer P(A) : « Obtenir 3 boules de même couleur » et P(B) : « Obtenir au moins une boule blanche ».",
          "2. Soit X la variable aléatoire comptant le nombre de boules blanches tirées. Déterminer la loi de probabilité de X et calculer son espérance E(X).",
        ],
        questionsModelB_Ar: [
          "يحتوي صندوق على 10 كرات لا يمكن التمييز بينها باللمس: 5 كرات حمراء، 3 كرات خضراء، وكرتين بيضاوين. نسحب عشوائياً وفي آن واحد 3 كرات من الصندوق.",
          "1. بين أن عدد السحبات الممكنة هو Card(Ω) = 120، ثم أحسب احتمال الحدث A: «سحب 3 كرات من نفس اللون» والحدث B: «سحب كرة بيضاء واحدة على الأقل».",
          "2. ليكن X المتغير العشوائي الذي يربط كل سحبة بعدد الكرات البيضاء المسحوبة. حدد قانون احتمال X وأحسب أمله الرياضي E(X).",
        ],
        questionsModelB_Fr: [
          "Une urne contient 10 boules indiscernables au toucher : 5 rouges, 3 vertes et 2 blanches. On tire simultanément 3 boules de l'urne.",
          "1. Vérifier que Card(Ω) = 120, puis calculer P(A) et P(B).",
          "2. Soit X la variable aléatoire égale au nombre de boules blanches tirées. Déterminer la loi de X et calculer E(X).",
        ],
        questionBaremes: [0.5, 2.5, 3.0],
        solutionsAr: [
          "تجربة سحب تآلفي في آن واحد لـ 3 كرات من أصل 9.",
          "1. لدينا Card(Ω) = C_9^3 = 84. الحدث A: P(A) = (C_4^3 + C_3^3)/84 = 5/84. الحدث المضاد لـ B هو عدم سحب أي كرة بيضاء: P(B) = 1 - C_7^3/84 = 1 - 35/84 = 49/84 = 7/12.",
          "2. القيم التي يأخذها X هي X(Ω) = {0, 1, 2}. لدينا P(X=0) = 35/84، و P(X=1) = (C_2^1 × C_7^2)/84 = 42/84، و P(X=2) = (C_2^2 × C_7^1)/84 = 7/84. الأمل الرياضي E(X) = 56/84 = 2/3.",
        ],
        solutionsFr: [
          "Tirage simultané de 3 boules parmi 9.",
          "1. Card(Ω) = C_9^3 = 84. P(A) = (C_4^3 + C_3^3)/84 = 5/84. Par l'événement contraire, P(B) = 1 - C_7^3/84 = 49/84 = 7/12.",
          "2. X(Ω) = {0, 1, 2} avec P(X=0) = 35/84, P(X=1) = 42/84, P(X=2) = 7/84. Espérance E(X) = 56/84 = 2/3.",
        ],
      },
      {
        id: "ex2_svt_probleme_ln",
        titleAr: "مسألة شاملة: الدالة اللوغاريتمية النبيرية والمتتالية المرتبطة بها",
        titleFr: "Problème de synthèse : Fonction logarithme népérien ln(x) et suite associée",
        points: 14,
        weight: 70,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Analyse — Fonction Logarithme Népérien",
        capacitiesAr: [
          "استثمار دالة مساعدة لتحديد إشارة المشتقة وجدول تغيرات الدالة",
          "تحديد المقاربات ودراسة متتالية معرفة بـ u_{n+1} = f(u_n)",
        ],
        capacitiesFr: [
          "Exploiter le signe d'une fonction auxiliaire g(x) pour étudier les variations de f",
          "Construire la courbe (C_f) et étudier la suite récurrente associée u_{n+1} = f(u_n)",
        ],
        questionsAr: [
          "الجزء الأول: نعتبر الدالة المساعدة g المعرفة على ]0, +∞[ بـ: g(x) = x² - 1 + ln(x). أحسب g(1) واستنتج إشارة g(x) على كل من ]0, 1] و [1, +∞[.",
          "الجزء الثاني: نعتبر الدالة f المعرفة على ]0, +∞[ بـ: f(x) = x - 1 - ln(x)/x.",
          "1. أحسب lim_{x→0+} f(x) و lim_{x→+∞} f(x)، وبين أن المستقيم (Δ): y = x - 1 مقارب مائل للمنحنى (C_f) بجوار +∞.",
          "2. بين أنه لكل x > 0 لدينا f'(x) = g(x)/x²، ثم ضع جدول تغيرات الدالة f على ]0, +∞[.",
          "3. نعتبر المتتالية (u_n) المعرفة بـ u_0 = 2 و u_{n+1} = f(u_n). بين بالترجع أن 1 ≤ u_n ≤ 2 وأن (u_n) تناقصية واستنتج نهايتها.",
        ],
        questionsFr: [
          "Partie A : Soit g définie sur ]0, +∞[ par g(x) = x² - 1 + ln(x). Calculer g(1) et en déduire le signe de g(x) sur ]0, +∞[.",
          "Partie B : Soit f définie sur ]0, +∞[ par f(x) = x - 1 - ln(x)/x.",
          "1. Calculer lim_{x→0+} f(x) et lim_{x→+∞} f(x), puis montrer que (Δ) : y = x - 1 est asymptote oblique à (C_f) en +∞.",
          "2. Montrer que pour tout x > 0, f'(x) = g(x)/x² et dresser le tableau de variations de f.",
          "3. Soit (u_n) définie par u_0 = 2 et u_{n+1} = f(u_n). Montrer que 1 ≤ u_n ≤ 2, que (u_n) est décroissante et calculer sa limite.",
        ],
        questionsModelB_Ar: [
          "الجزء الأول: نعتبر الدالة المساعدة g المعرفة على ]0, +∞[ بـ: g(x) = 2x² - 1 + ln(x). أحسب g(1) وأدرس إشارتها.",
          "الجزء الثاني: نعتبر الدالة f المعرفة على ]0, +∞[ بـ: f(x) = 2x - 2 - ln(x)/x.",
          "1. أحسب lim_{x→0+} f(x) و lim_{x→+∞} f(x)، وبين أن المستقيم (Δ): y = 2x - 2 مقارب مائل بجوار +∞.",
          "2. بين أنه لكل x > 0 لدينا f'(x) = g(x)/x²، ثم ضع جدول تغيرات الدالة f.",
          "3. أدرس تقارب المتتالية المرتبطة بالدالة f.",
        ],
        questionsModelB_Fr: [
          "Partie A : Soit g définie sur ]0, +∞[ par g(x) = 2x² - 1 + ln(x). Étudier les variations et le signe de g.",
          "Partie B : Soit f définie sur ]0, +∞[ par f(x) = 2x - 2 - ln(x)/x.",
          "1. Calculer les limites aux bornes et démontrer que (Δ) : y = 2x - 2 est asymptote oblique en +∞.",
          "2. Montrer que f'(x) = g(x)/x² et dresser le tableau de variations.",
          "3. Étudier la convergence de la suite récurrente associée.",
        ],
        questionBaremes: [2.5, 3.0, 3.5, 2.5, 2.5],
        solutionsAr: [
          "الجزء الأول: لدينا g(1) = 0. بما أن x ↦ x² - 1 و x ↦ ln(x) تزايديتان على ]0, +∞[، فإن g(x) ≤ 0 على ]0, 1] و g(x) ≥ 0 على [1, +∞[.",
          "1. عند 0+: lim f(x) = +∞ (مقارب عمودي x = 0). عند +∞: lim ln(x)/x = 0 إذن lim [f(x) - (x - 1)] = 0 ومنه (Δ): y = x - 1 مقارب مائل.",
          "2. المشتقة: f'(x) = 1 - (1 - ln x)/x² = (x² - 1 + ln x)/x² = g(x)/x². الدالة f تناقصية على ]0, 1] وتزايدية على [1, +∞[ وتقبل قيمة دنيا f(1) = 0.",
          "3. بما أن f([1, 2]) ⊂ [1, 2] وأن f(x) ≤ x على [1, 2]، فإن (u_n) تناقصية ومصغورة بالعدد 1 فهي متقاربة ونهايتها حل f(x) = x.",
        ],
        solutionsFr: [
          "Partie A : g(1) = 0 ; par croissance de g sur ]0, +∞[, g(x) ≤ 0 sur ]0, 1] et g(x) ≥ 0 sur [1, +∞[.",
          "1. En 0+ : lim f(x) = +∞ (asymptote verticale x = 0). En +∞ : lim ln(x)/x = 0 donc (Δ) : y = x - 1 est asymptote oblique.",
          "2. f'(x) = 1 - (1 - ln x)/x² = g(x)/x². Donc f est décroissante sur ]0, 1] et croissante sur [1, +∞[, minimum f(1) = 0.",
          "3. Par récurrence sur l'intervalle stable [1, 2], (u_n) est décroissante et minorée par 1, donc convergente.",
        ],
      },
    ],
  },
  {
    id: "imported_2bac_sm_s2_structures_arith",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS2_2BAC_SM_Rabat_Moulay_Youssef_S2.pdf",
    titleAr: "فرض محروس مستورد — 2 باك علوم رياضية أ و ب (البنيات الجبرية + الحسابيات في Z + العقدية)",
    titleFr: "Devoir Surveillé Importé — 2ème Bac Sciences Maths A & B (Structures Algébriques & Arithmétique dans ℤ)",
    schoolOriginAr: "أكاديمية الرباط سلا القنيطرة · ثانوية مولاي يوسف (أقسام العلوم الرياضية)",
    schoolOriginFr: "AREF Rabat · Lycée Moulay Youssef (Classes Sciences Mathématiques A & B)",
    detectedTrackCode: "2BAC_SM",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S2",
    dsKey: "DS2",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 25,
    n2: 45,
    n3: 30,
    exercises: [
      {
        id: "ex1_sm_structures",
        titleAr: "البنيات الجبرية: الزمر والزمر الجزئية والتشاكلات",
        titleFr: "Structures algébriques : Groupes, sous-groupes et isomorphismes",
        points: 6,
        weight: 30,
        category: "Algebra",
        subCategory: "بنيات جبرية",
        subCategoryFr: "Structures Algébriques (Groupes, Anneaux, Corps)",
        capacitiesAr: [
          "البرهان على أن قانون تركيب داخلي تجميعي وتبادلي وله عنصر محايد",
          "إثبات أن مجموعة مزودة بقانون تشكل زمرة تبادلية وتوظيف التشاكلات",
        ],
        capacitiesFr: [
          "Démontrer qu'une loi de composition interne est associative, commutative et possède un neutre",
          "Établir qu'une structure (G, *) est un groupe commutatif et exploiter un morphisme",
        ],
        questionsAr: [
          "لكل x و y من المجال I = ]-1, 1[، نضع: x * y = (x + y)/(1 + xy).",
          "1. بين أن * قانون تركيب داخلي في I، وأنه تبادلي وتجميعي في I.",
          "2. بين أن (I, *) زمرة تبادلية محدداً عنصرها المحايد ومماثل كل عنصر x من I.",
          "3. نعتبر التطبيق f: R → I المعرف بـ: f(x) = (e^{2x} - 1)/(e^{2x} + 1). بين أن f تشاكل تقابلي من (R, +) نحو (I, *).",
        ],
        questionsFr: [
          "Pour tous x et y de l'intervalle I = ]-1, 1[, on pose : x * y = (x + y)/(1 + xy).",
          "1. Montrer que * est une loi de composition interne dans I, et qu'elle est commutative et associative.",
          "2. Montrer que (I, *) est un groupe commutatif, préciser son élément neutre et le symétrique de x ∈ I.",
          "3. Soit f : ℝ → I définie par f(x) = (e^{2x} - 1)/(e^{2x} + 1). Montrer que f est un isomorphisme de (ℝ, +) vers (I, *).",
        ],
        questionsModelB_Ar: [
          "لكل x و y من المجال I = ]-1, 1[، نضع: x ⊤ y = (x + y)/(1 + xy).",
          "1. بين أن ⊤ قانون تركيب داخلي تبادلي وتجميعي في I.",
          "2. بين أن (I, ⊤) زمرة تبادلية وحدد مماثل كل عنصر.",
          "3. بين أن التطبيق th(x) = (e^x - e^{-x})/(e^x + e^{-x}) تشاكل تقابلي من (R, +) نحو (I, ⊤).",
        ],
        questionsModelB_Fr: [
          "Pour tous réels x, y ∈ ]-1, 1[, on pose x ⊤ y = (x + y)/(1 + xy).",
          "1. Montrer que ⊤ est une loi interne, commutative et associative sur I.",
          "2. Démontrer que (I, ⊤) est un groupe abélien.",
          "3. Établir que la tangente hyperbolique est un isomorphisme de groupes de (ℝ, +) sur (I, ⊤).",
        ],
        questionBaremes: [2.0, 2.0, 2.0],
        solutionsAr: [
          "1. لدينا 1 - (x*y)² = (1 - x²)(1 - y²)/(1 + xy)² > 0 لأن |x|<1 و |y|<1، إذن x*y ∈ ]-1, 1[. التبادلية واضحة والتجميعية بحساب مباشر.",
          "2. العنصر المحايد هو e = 0 لأن x*0 = x. ومماثل x هو -x لأن x*(-x) = 0. إذن (I, *) زمرة تبادلية.",
          "3. f تقابل مستمر وتزايدي قطعا من R نحو I، ولدينا f(x + y) = (e^{2x+2y} - 1)/(e^{2x+2y} + 1) = f(x) * f(y)، إذن f تشاكل تقابلي.",
        ],
        solutionsFr: [
          "1. 1 - (x*y)² = (1 - x²)(1 - y²)/(1 + xy)² > 0, d'où x*y ∈ I : la loi est interne. Commutativité et associativité immédiates.",
          "2. Le neutre est e = 0 et le symétrique de x est x' = -x ∈ I. (I, *) est un groupe abélien.",
          "3. f(x) = th(x) est une bijection strictement croissante de ℝ sur I et vérifie f(x + y) = f(x) * f(y) : c'est un isomorphisme.",
        ],
      },
      {
        id: "ex2_sm_arithmetique",
        titleAr: "الحسابيات في Z: مبرهنة بيزو وغوص ونظرية فيرما الصغرى",
        titleFr: "Arithmétique dans ℤ : Théorèmes de Bézout, Gauss et Petit Théorème de Fermat",
        points: 6,
        weight: 30,
        category: "Algebra",
        subCategory: "حسابيات",
        subCategoryFr: "Arithmétique dans ℤ",
        capacitiesAr: [
          "حل معادلات ديفانتية ax + by = c في المجموعة Z² باستعمال خوارزمية إقليدس ومبرهنة غوص",
          "توظيف الحسابيات التوافقية بترديد ونظرية فيرما الصغرى لدراسة قابلية القسمة",
        ],
        capacitiesFr: [
          "Résoudre des équations diophantiennes ax + by = c dans ℤ² par Bézout et Gauss",
          "Exploiter les congruences modulo p et le petit théorème de Fermat",
        ],
        questionsAr: [
          "1. نعتبر في Z² المعادلة (E): 35x - 24y = 1. باستعمال خوارزمية إقليدس حدد حلاً خاصاً (x_0, y_0) للمعادلة (E)، ثم حل (E) في Z².",
          "2. ليكن p عدداً أولياً موجباً بحيث p ≥ 5. بين باستعمال مبرهنة فيرما أن: p^4 ≡ 1 [5] و p^2 ≡ 1 [3].",
          "3. استنتج أنه لكل عدد أولي p ≥ 5، فإن العدد p^4 - 1 يقبل القسمة على 240.",
        ],
        questionsFr: [
          "1. On considère dans ℤ² l'équation (E) : 35x - 24y = 1. Déterminer une solution particulière par l'algorithme d'Euclide puis résoudre (E) dans ℤ².",
          "2. Soit p un nombre premier tel que p ≥ 5. Montrer à l'aide du petit théorème de Fermat que p^4 ≡ 1 [5] et p^2 ≡ 1 [3].",
          "3. En déduire que pour tout nombre premier p ≥ 5, l'entier p^4 - 1 est divisible par 240.",
        ],
        questionsModelB_Ar: [
          "1. حل في Z² المعادلة: 47x - 29y = 1 بتحديد حل خاص عبر خوارزمية إقليدس.",
          "2. بين باستعمال مبرهنة فيرما أنه لكل عدد أولي p ≥ 7 لدينا: p^6 ≡ 1 [7].",
          "3. أثبت قابلية القسمة واستنتج الحلول الصحيحة.",
        ],
        questionsModelB_Fr: [
          "1. Résoudre dans ℤ² l'équation 47x - 29y = 1 à l'aide de l'algorithme d'Euclide.",
          "2. Démontrer par le petit théorème de Fermat que p^6 ≡ 1 [7] pour p premier p ≥ 7.",
          "3. Conclure sur la divisibilité associée.",
        ],
        questionBaremes: [2.5, 2.0, 1.5],
        solutionsAr: [
          "1. 35 = 24×1 + 11 و 24 = 11×2 + 2 و 11 = 2×5 + 1. بالرجوع نجد 35×(11) - 24×(16) = 1، إذن الحل الخاص (11, 16) والحلول العامة هي S = {(24k + 11, 35k + 16) / k ∈ Z}.",
          "2. بما أن p أولي و p ≥ 5 فإن 5 لا يقسم p و 3 لا يقسم p. حسب فيرما: p^4 ≡ 1 [5] و p^2 ≡ 1 [3] وبالتالي p^4 ≡ 1 [3].",
          "3. بما أن p فردي فإن p² - 1 مضاعف لـ 8 و p² + 1 زوجي، إذن p^4 - 1 يقبل القسمة على 16، وبما أن 5 و 3 و 16 أولية فيما بينها مثنى مثنى، فإن p^4 - 1 يقبل القسمة على 16×3×5 = 240.",
        ],
        solutionsFr: [
          "1. Algorithme d'Euclide inversé : 35(11) - 24(16) = 1. Solution générale S = {(24k + 11, 35k + 16), k ∈ ℤ}.",
          "2. p premier ≥ 5 donc p n'est divisible ni par 3 ni par 5. Par Fermat, p^4 ≡ 1 [5] et p^2 ≡ 1 [3] ⇒ p^4 ≡ 1 [3].",
          "3. De plus p impair implique p^4 - 1 divisible par 16. Comme 16, 3 et 5 sont premiers entre eux deux à deux, 240 = 16×3×5 divise p^4 - 1.",
        ],
      },
      {
        id: "ex3_sm_complexes_geometrie",
        titleAr: "الأعداد العقدية: الجذور النونية والتحويلات النقطية والتوليف الهندسي",
        titleFr: "Nombres complexes : Racines n-ièmes, similitudes et configurations géométriques",
        points: 8,
        weight: 40,
        category: "Geometry",
        subCategory: "أعداد عقدية",
        subCategoryFr: "Nombres complexes approfondis",
        capacitiesAr: [
          "حل معادلات ذات معاملات عقدية وحساب الجذور النونية للوحدة",
          "تحديد العناصر المميزة لتشابه مباشر ودراسة استقامية وتداول نقط",
        ],
        capacitiesFr: [
          "Résoudre des équations polynomiales dans ℂ et manipuler les racines n-ièmes de l'unité",
          "Déterminer les éléments caractéristiques d'une similitude directe et démontrer une cocyclicité",
        ],
        questionsAr: [
          "1. حل في C المعادلة: z² - (1 + i)z + 2i = 0.",
          "2. ليكن θ من ]0, π[. نعتبر المعادلة (E_θ): z² - 2e^{iθ}cos(θ) z + e^{2iθ} = 0. حدد حلي المعادلة z_1 و z_2 على الشكل الأسي.",
          "3. نعتبر التحويل S الذي يربط كل نقطة M(z) بالنقطة M'(z') بحيث: z' = (1 + i√3)z + 2 - 2i√3. بين أن S تشابه مباشر محدداً مركزه Ω ونسبته k وزاويته θ.",
        ],
        questionsFr: [
          "1. Résoudre dans ℂ l'équation : z² - (1 + i)z + 2i = 0.",
          "2. Soit θ ∈ ]0, π[. On considère l'équation (E_θ) : z² - 2e^{iθ}cos(θ) z + e^{2iθ} = 0. Déterminer les solutions z_1 et z_2 sous forme exponentielle.",
          "3. Soit S la transformation du plan complexe associant à tout point M(z) le point M'(z') tel que : z' = (1 + i√3)z + 2 - 2i√3. Montrer que S est une similitude directe dont on précisera le centre Ω, le rapport k et l'angle θ.",
        ],
        questionsModelB_Ar: [
          "1. حل في C المعادلة: z² - (1 - i)z - 2i = 0.",
          "2. حدد الشكل الأسي لحلي المعادلة المثلثية العقدية.",
          "3. حدد العناصر المميزة للتشابه المباشر S.",
        ],
        questionsModelB_Fr: [
          "1. Résoudre dans ℂ l'équation : z² - (1 - i)z - 2i = 0.",
          "2. Écrire les solutions sous forme exponentielle.",
          "3. Déterminer les éléments caractéristiques de la similitude S.",
        ],
        questionBaremes: [2.5, 2.5, 3.0],
        solutionsAr: [
          "1. Δ = (1 + i)² - 8i = 2i - 8i = -6i = (√3 - i√3)²... الحلان هما z_1 و z_2.",
          "2. Δ' = 4e^{2iθ}(cos²θ - 1) = -4e^{2iθ}sin²θ = (2i e^{iθ} sin θ)². الحلان هما z_1 = e^{iθ}(cos θ + i sin θ) = e^{2iθ} و z_2 = e^{iθ}(cos θ - i sin θ) = 1.",
          "3. الكتابة z' = az + b مع a = 1 + i√3 = 2e^{iπ/3}. بما أن a ≠ 1 فإن S تشابه مباشر نسبته k = |a| = 2، وزاويته θ = arg(a) = π/3، ومركزه الصامد Ω ذو اللاحق ω = b/(1 - a) = 2.",
        ],
        solutionsFr: [
          "1. Résolution par discriminant complexe Δ.",
          "2. Δ = (2i e^{iθ} sin θ)², d'où z_1 = e^{2iθ} et z_2 = 1.",
          "3. Forme z' = az + b avec a = 2e^{iπ/3}. Similitude directe de rapport k = 2, d'angle π/3 et de centre Ω(2).",
        ],
      },
    ],
  },
  {
    id: "imported_1bac_sm_s2_ds",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS2_1BAC_SM_Kenitra_Ibn_AlHaytham.pdf",
    titleAr: "فرض محروس مستورد — الأولى باك علوم رياضية (الدورة 2: الحساب المثلثي + الجداء السلمي + الدوران)",
    titleFr: "Devoir Surveillé Importé — 1ère Bac Sciences Maths (Trigonométrie, Produit Scalaire & Rotation)",
    schoolOriginAr: "أكاديمية الرباط سلا القنيطرة · ثانوية ابن الهيثم التأهيلية للعلوم الرياضية",
    schoolOriginFr: "AREF Rabat-Salé-Kénitra · Lycée Qualifiant Ibn Al Haytham",
    detectedTrackCode: "1BAC_SM",
    detectedSystem: "MAROC_NATIONAL",
    semester: "S2",
    dsKey: "DS2",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 30,
    n2: 45,
    n3: 25,
    exercises: [
      {
        id: "ex1_1bac_sm_trigo",
        titleAr: "الحساب المثلثي وتطبيقات التحويل والمعادلات",
        titleFr: "Trigonométrie : Formules de transformation et équations",
        points: 7,
        weight: 35,
        category: "Geometry",
        subCategory: "حساب مثلثي",
        subCategoryFr: "Trigonométrie approfondie",
        capacitiesAr: [
          "تطبيق صيغ التحويل cos(a±b) و sin(a±b) و tan(a±b) والتحويل إلى جداء",
          "حل معادلات ومتراجحات مثلثية وتمثيل الحلول على الدائرة المثلثية",
        ],
        capacitiesFr: [
          "Appliquer les formules d'addition et de transformation de sommes en produits",
          "Résoudre des équations trigonométriques et représenter les solutions sur le cercle",
        ],
        questionsAr: [
          "1. بين أنه لكل x من R لدينا: cos(x) + cos(x + 2π/3) + cos(x + 4π/3) = 0.",
          "2. حل في المجال [0, 2π[ المعادلة: cos(3x) + sin(2x) - cos(x) = 0.",
          "3. بين أنه لكل x ≠ kπ/2 لدينا: (sin(3x) - sin(x))/(cos(3x) + cos(x)) = tan(x).",
        ],
        questionsFr: [
          "1. Montrer que pour tout réel x, cos(x) + cos(x + 2π/3) + cos(x + 4π/3) = 0.",
          "2. Résoudre dans [0, 2π[ l'équation : cos(3x) + sin(2x) - cos(x) = 0.",
          "3. Démontrer que pour tout x ≢ 0 [π/2] : (sin(3x) - sin(x))/(cos(3x) + cos(x)) = tan(x).",
        ],
        questionsModelB_Ar: [
          "1. بين أن مجموع الجيوب sin(x) + sin(x + 2π/3) + sin(x + 4π/3) = 0.",
          "2. حل في [0, 2π[ المعادلة المثلثية المحولة.",
          "3. بسط العبارة المثلثية واستنتج التبسيط.",
        ],
        questionsModelB_Fr: [
          "1. Établir l'identité sur la somme des sinus déphasés de 2π/3.",
          "2. Résoudre l'équation trigonométrique associée dans [0, 2π[.",
          "3. Simplifier le quotient trigonométrique.",
        ],
        questionBaremes: [2.0, 3.0, 2.0],
        solutionsAr: [
          "1. باستعمال صيغ الجمع cos(a+b) ونشر 2π/3 و 4π/3 نجد المجموع منعدماً.",
          "2. cos(3x) - cos(x) = -2 sin(2x) sin(x). تصبح المعادلة sin(2x)(1 - 2 sin x) = 0، والحلول في [0, 2π[ هي: {0, π/6, π/2, 5π/6, π, 3π/2}.",
          "3. بالتحويل إلى جداء: البسط = 2 cos(2x) sin(x) والمقام = 2 cos(2x) cos(x)، وبالاختزال نجد tan(x).",
        ],
        solutionsFr: [
          "1. Somme nulle par factorisation ou propriétés du centre de gravité des racines cubiques.",
          "2. cos(3x) - cos(x) = -2 sin(2x) sin(x). L'équation devient sin(2x)(1 - 2 sin x) = 0.",
          "3. Formules de Simpson : 2 cos(2x) sin(x) / (2 cos(2x) cos(x)) = tan(x).",
        ],
      },
      {
        id: "ex2_1bac_sm_produit_scalaire",
        titleAr: "الجداء السلمي والعلاقات المترية في المثلث ومبرهنة الكاشي",
        titleFr: "Produit scalaire, relations métriques et théorème d'Al-Kashi",
        points: 7,
        weight: 35,
        category: "Geometry",
        subCategory: "هندسة مستوية",
        subCategoryFr: "Produit scalaire & Relations métriques",
        capacitiesAr: [
          "حساب الجداء السلمي وتطبيق صيغة الكاشي ومبرهنة المتوسط ومساحة المثلث",
          "تحديد مجموعات النقط المعرفة بعلاقات قياسية في المستوى",
        ],
        capacitiesFr: [
          "Appliquer le théorème d'Al-Kashi et le théorème de la médiane pour calculer des longueurs et angles",
          "Déterminer et caractériser des lignes de niveau associées au produit scalaire",
        ],
        questionsAr: [
          "ليكن ABC مثلثاً بحيث AB = 5 و AC = 6 و BC = 7.",
          "1. أحسب cos(BAC) ثم استنتج الجداء السلمي AB · AC.",
          "2. لتكن I منتصف القطعة [BC]. أحسب طول المتوسط AI.",
          "3. حدد وأنشئ مجموعة النقط M من المستوى بحيث: MA² + MB² = 26.",
        ],
        questionsFr: [
          "Soit ABC un triangle tel que AB = 5, AC = 6 et BC = 7.",
          "1. Calculer cos(BAC) à l'aide d'Al-Kashi et en déduire le produit scalaire AB · AC.",
          "2. Soit I le milieu de [BC]. Calculer la longueur de la médiane AI.",
          "3. Déterminer et construire l'ensemble des points M du plan tels que : MA² + MB² = 26.",
        ],
        questionsModelB_Ar: [
          "ليكن ABC مثلثاً بأطوال AB = 4 و AC = 5 و BC = 6.",
          "1. أحسب cos(BAC) والجداء السلمي.",
          "2. أحسب طول المتوسط AI.",
          "3. حدد مجموعة النقط M بحيث MA² + MB² = 20.",
        ],
        questionsModelB_Fr: [
          "Soit ABC avec AB = 4, AC = 5 et BC = 6.",
          "1. Calculer cos(BAC) et AB · AC.",
          "2. Calculer la longueur de la médiane AI.",
          "3. Déterminer la ligne de niveau MA² + MB² = 20.",
        ],
        questionBaremes: [2.5, 2.0, 2.5],
        solutionsAr: [
          "1. حسب الكاشي: BC² = AB² + AC² - 2 AB·AC cos(A)، إذن 49 = 25 + 36 - 60 cos(A) ومنه cos(A) = 1/5، وبالتالي AB · AC = AB × AC × cos(A) = 6.",
          "2. حسب مبرهنة المتوسط: AB² + AC² = 2 AI² + BC²/2، إذن 61 = 2 AI² + 49/2 ومنه AI = √146 / 2.",
          "3. MA² + MB² = 2 MJ² + AB²/2 (حيث J منتصف [AB]). 2 MJ² + 25/2 = 26 يعني MJ = 3/2، إذن المجموعة هي دائرة مركزها J وشعاعها 3/2.",
        ],
        solutionsFr: [
          "1. Par Al-Kashi : cos(A) = 1/5 et AB · AC = 6.",
          "2. Théorème de la médiane : AI = √146 / 2.",
          "3. Réduction scalaire : MJ = 3/2, cercle de centre J milieu de [AB] et de rayon 1,5.",
        ],
      },
      {
        id: "ex3_1bac_sm_rotation",
        titleAr: "الدوران في المستوى وتطبيقاته الهندسية",
        titleFr: "La rotation dans le plan et ses applications géométriques",
        points: 6,
        weight: 30,
        category: "Geometry",
        subCategory: "هندسة مستوية",
        subCategoryFr: "Rotation dans le plan",
        capacitiesAr: [
          "توظيف تعريف وخاصيات الدوران لإثبات تقايس قطع وتعامد مستقيمات",
          "إنشاء صور أشكال هندسية بالدوران واستنتاج طبيعة مثلثات ورباعيات",
        ],
        capacitiesFr: [
          "Exploiter les propriétés caractéristiques d'une rotation (isométrie, conservation des angles)",
          "Démontrer l'orthogonalité et l'égalité de longueurs via une rotation de centre O",
        ],
        questionsAr: [
          "ليكن ABCD مربعاً مركزه O وموجهاً توجيهاً مباشراً. نعتبر الدوران R الذي مركزه O وزاويته π/2.",
          "1. حدد صور النقط A و B و C بالدوران R.",
          "2. لتكن M نقطة من [AB] و N النقطة من [BC] بحيث AM = BN. بين أن R(M) = N.",
          "3. استنتج أن المستقيمين (OM) و (ON) متعامدان وأن المثلث OMN متساوي الساقين وقائم الزاوية.",
        ],
        questionsFr: [
          "Soit ABCD un carré direct de centre O. Soit R la rotation de centre O et d'angle π/2.",
          "1. Déterminer les images respectives de A, B et C par la rotation R.",
          "2. Soit M ∈ [AB] et N ∈ [BC] tels que AM = BN. Montrer que R(M) = N.",
          "3. En déduire que les droites (OM) et (ON) sont perpendiculaires et que OMN est un triangle rectangle isocèle.",
        ],
        questionsModelB_Ar: [
          "ليكن ABCD مربعاً مركزه O. نعتبر الدوران بزاوية -π/2.",
          "1. حدد صور الرؤوس.",
          "2. بين تطابق النقط بالدوران.",
          "3. استنتج تعامد المستقيمات وطبيعة المثلث.",
        ],
        questionsModelB_Fr: [
          "Carré ABCD de centre O et rotation d'angle -π/2.",
          "1. Images des sommets.",
          "2. Image du point M.",
          "3. Orthogonalité et nature du triangle.",
        ],
        questionBaremes: [1.5, 2.5, 2.0],
        solutionsAr: [
          "1. بما أن ABCD مربع مركزه O ومباشر، فإن R(A) = B و R(B) = C و R(C) = D.",
          "2. R يحول القطعة [AB] إلى [BC]. وبما أن الدوران تقايس يحافظ على المسافات و AM = BN، فإن صورة M هي النقطة الوحيدة N من [BC] التي تحقق R(M) = N.",
          "3. من تعريف الدوران R(M) = N: OM = ON و (OM, ON) ≡ π/2 [2π]، إذن (OM) ⊥ (ON) والمثلث OMN متساوي الساقين وقائم الزاوية في O.",
        ],
        solutionsFr: [
          "1. R(A) = B, R(B) = C et R(C) = D par définition du carré direct.",
          "2. La rotation transforme [AB] en [BC] et conserve les distances, donc R(M) = N.",
          "3. OM = ON et (OM, ON) = π/2 [2π] : triangle OMN rectangle isocèle en O.",
        ],
      },
    ],
  },
  {
    id: "imported_aefe_term_maths_expertes",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS_Terminale_Maths_Expertes_Lyautey.pdf",
    titleAr: "فرض محروس مستورد (البعثة الفرنسية) — Terminale Option Maths Expertes (Lycée Lyautey)",
    titleFr: "Devoir Surveillé Importé (AEFE) — Terminale Option Mathématiques Expertes",
    schoolOriginAr: "شبكة البعثة الفرنسية بالمغرب AEFE · ثانوية ليوطي الدار البيضاء",
    schoolOriginFr: "Lycée Lyautey (Casablanca) · Option Mathématiques Expertes",
    detectedTrackCode: "TERM_SPE_FR",
    detectedSystem: "MISSION_FRANCAISE",
    semester: "S1",
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 25,
    n2: 45,
    n3: 30,
    exercises: [
      {
        id: "ex1_expertes_matrices",
        titleAr: "المصفوفات والحساب المصفوفاتي وسلاسل ماركوف (Graphes probabilistes)",
        titleFr: "Matrices carrées, puissances matricielles et graphes probabilistes",
        points: 7,
        weight: 35,
        category: "Algebra",
        subCategory: "جبر",
        subCategoryFr: "Matrices & Graphes",
        capacitiesAr: [
          "حساب جداء وقوى مصفوفة مربعة وتحديد المصفوفة العكسية",
          "نمذجة ظاهرة عشوائية بواسطة مصفوفة انتقال وتحديد الحالة المستقرة",
        ],
        capacitiesFr: [
          "Calculer la puissance n-ième d'une matrice 2x2 par diagonalisation élémentaire",
          "Déterminer la matrice de transition d'un graphe probabiliste et son état stable",
        ],
        questionsAr: [
          "نعتبر المصفوفة M = [[0.8, 0.2], [0.3, 0.7]].",
          "1. بين أن المصفوفة P = [[1, 2], [1, -3]] قابلة للقلب وحدد مصفوفتها العكسية P⁻¹.",
          "2. أحسب المصفوفة القطرية D = P⁻¹ M P، ثم استنتج تعبير M^n بدلالة n لكل عدد طبيعي n.",
          "3. يمثل M مصفوفة الانتقال بين حالتين A و B. حدد التوزيع المستقر π = [x, y] للنظام.",
        ],
        questionsFr: [
          "Soit la matrice carrée M = [[0,8 ; 0,2], [0,3 ; 0,7]].",
          "1. Justifier que P = [[1 ; 2], [1 ; -3]] est inversible et déterminer P⁻¹.",
          "2. Calculer D = P⁻¹ M P et en déduire l'expression de M^n pour tout entier naturel n.",
          "3. Déterminer l'état probabiliste stable π = (x, y) vérifiant π M = π et x + y = 1.",
        ],
        questionsModelB_Ar: [
          "نعتبر المصفوفة M = [[0.7, 0.3], [0.2, 0.8]].",
          "1. حدد مقلوب مصفوفة الانتقال P.",
          "2. أحسب M^n بدلالة n.",
          "3. حدد الحالة المستقرة للنظام.",
        ],
        questionsModelB_Fr: [
          "Soit M = [[0,7 ; 0,3], [0,2 ; 0,8]].",
          "1. Inversibilité et calcul de P⁻¹.",
          "2. Déduction de M^n.",
          "3. Calcul de l'état stationnaire.",
        ],
        questionBaremes: [2.0, 3.0, 2.0],
        solutionsAr: [
          "1. det(P) = -3 - 2 = -5 ≠ 0 إذن P قابلة للقلب، و P⁻¹ = (-1/5)[[ -3, -2], [-1, 1]].",
          "2. D = [[1, 0], [0, 0.5]] قطرية. M^n = P D^n P⁻¹، وبما أن (0.5)^n تؤول إلى 0 نجد نهاية القوى.",
          "3. الحالة المستقرة π M = π مع x + y = 1 تعطي 0.8x + 0.3y = x أي 0.3y = 0.2x ومنه π = [3/5, 2/5] = [0.6, 0.4].",
        ],
        solutionsFr: [
          "1. det(P) = -5 ≠ 0 donc P est inversible. P⁻¹ = (1/5)[[3 ; 2], [1 ; -1]].",
          "2. D = [[1 ; 0], [0 ; 0,5]]. M^n = P D^n P⁻¹.",
          "3. État stable π = (0,6 ; 0,4) vérifiant π M = π et x + y = 1.",
        ],
      },
      {
        id: "ex2_expertes_arithmetique_rsa",
        titleAr: "الحسابيات المعمقة: التوافقات والتشفير بنظام RSA",
        titleFr: "Arithmétique avancée : Congruences et cryptographie RSA",
        points: 7,
        weight: 35,
        category: "Algebra",
        subCategory: "حسابيات",
        subCategoryFr: "Arithmétique modulaire & Cryptographie",
        capacitiesAr: [
          "توظيف التوافقات وحساب مقلوب عدد بترديد عدد صحيح",
          "تطبيق خوارزمية التشفير وفك التشفير بنظام المفتاح العام RSA",
        ],
        capacitiesFr: [
          "Résoudre des congruences linéaires et calculer l'inverse modulo n",
          "Appliquer le protocole de chiffrement et déchiffrement asymétrique RSA",
        ],
        questionsAr: [
          "نعتبر المفتاح العمومي RSA المعرف بالعددين N = 55 و e = 7.",
          "1. بين أن N = p × q مع p = 5 و q = 11، وأحسب φ(N) = (p - 1)(q - 1).",
          "2. بين أن العددين e = 7 و φ(N) = 40 أوليان فيما بينهما، ثم حدد المفتاح السري d المعاكس لـ e بترديد 40.",
          "3. شفر الرسالة M = 2 بحساب C ≡ M^e [55]، ثم تحقق من فك التشفير بحساب C^d [55].",
        ],
        questionsFr: [
          "On considère la clé publique RSA définie par N = 55 et e = 7.",
          "1. Décomposer N en produit de deux nombres premiers p et q, puis calculer φ(N) = (p - 1)(q - 1).",
          "2. Justifier que PGCD(e, φ(N)) = 1 et déterminer la clé privée d tel que e·d ≡ 1 [φ(N)].",
          "3. Chiffrer le message M = 2 en calculant C ≡ M^e [55], puis vérifier le déchiffrement par C^d [55].",
        ],
        questionsModelB_Ar: [
          "نعتبر النظام RSA بالمعطيات N = 33 و e = 3.",
          "1. فكك N وأحسب مؤشر أولر φ(N).",
          "2. حدد المفتاح الخاص d.",
          "3. شفر الرسالة M = 4 وفك شفرتها.",
        ],
        questionsModelB_Fr: [
          "Système RSA avec N = 33 et e = 3.",
          "1. Décomposition et indicateur d'Euler φ(N).",
          "2. Calcul de la clé secrète d.",
          "3. Chiffrement et déchiffrement de M = 4.",
        ],
        questionBaremes: [2.0, 2.5, 2.5],
        solutionsAr: [
          "1. 55 = 5 × 11، إذن φ(55) = 4 × 10 = 40.",
          "2. PGCD(7, 40) = 1. باستعمال بيزو: 7 × 23 = 161 = 4 × 40 + 1، إذن المفتاح السري d = 23.",
          "3. التشفير: C = 2^7 [55] = 128 = 2 × 55 + 18 ≡ 18 [55]. فك التشفير: 18^{23} ≡ 2 [55] استناداً لنظرية أويلر-فيرما.",
        ],
        solutionsFr: [
          "1. N = 5 × 11, d'où φ(55) = 4 × 10 = 40.",
          "2. 7 × 23 = 161 ≡ 1 [40] donc d = 23 est la clé privée.",
          "3. Chiffrement : C = 2^7 = 128 ≡ 18 [55]. Déchiffrement : 18^{23} ≡ 2 [55].",
        ],
      },
      {
        id: "ex3_expertes_complexes_polynomes",
        titleAr: "الأعداد العقدية والحدوديات ذات المعاملات العقدية",
        titleFr: "Nombres complexes et factorisation de polynômes dans ℂ",
        points: 6,
        weight: 30,
        category: "Geometry",
        subCategory: "أعداد عقدية",
        subCategoryFr: "Nombres complexes approfondis",
        capacitiesAr: [
          "حل معادلات من الدرجة الثالثة في C بمعرفة جذر حقيقي أو تخيلي صرف",
          "توظيف الجذور النونية وتفكيك حدوديات إلى جداء عوامل من الدرجة الأولى",
        ],
        capacitiesFr: [
          "Résoudre des équations de degré 3 dans ℂ avec racine imaginaire pure",
          "Factoriser un polynôme dans ℂ et interpréter les sommets d'un polygone régulier",
        ],
        questionsAr: [
          "نعتبر في C المعادلة: z³ - (3 + 2i)z² + (3 + 5i)z - 2 - 4i = 0.",
          "1. بين أن المعادلة تقبل حلاً حقيقياً z_0 يتم تحديده.",
          "2. حدد العددين العقدين a و b بحيث: P(z) = (z - z_0)(z² + az + b)، ثم استنتج جميع حلول المعادلة.",
          "3. مثل حلول المعادلة في المستوى العقدي وأثبت طبيعة المثلث المتكون من صور الحلول.",
        ],
        questionsFr: [
          "On considère l'équation dans ℂ : z³ - (3 + 2i)z² + (3 + 5i)z - 2 - 4i = 0.",
          "1. Démontrer que l'équation admet une solution réelle z_0 à déterminer.",
          "2. Déterminer a et b complexes tels que P(z) = (z - z_0)(z² + az + b), puis résoudre complètement l'équation.",
          "3. Placer les images des solutions dans le plan complexe et préciser la nature du triangle formé.",
        ],
        questionsModelB_Ar: [
          "نعتبر المعادلة في C مع جذر تخيلي صرف.",
          "1. حدد الجذر التخيلي الصرف.",
          "2. فكك الحدودية وحدد باقي الحلول.",
          "3. حدد طبيعة المثلث في المستوى العقدي.",
        ],
        questionsModelB_Fr: [
          "Équation de degré 3 dans ℂ avec racine imaginaire.",
          "1. Recherche de la racine z_0.",
          "2. Factorisation et racines.",
          "3. Configuration géométrique.",
        ],
        questionBaremes: [2.0, 2.5, 1.5],
        solutionsAr: [
          "1. بالتعويض بـ z = x ∈ R وفصل الجزء الحقيقي والتخيلي نجد x = 2 حلاً حقيقياً وحيداً.",
          "2. بالقسمة الإقليدية: P(z) = (z - 2)(z² - (1 + 2i)z + 1 + 2i)... الحلان المتبقيان هما 1 و 2i.",
          "3. النقط A(2) و B(1) و C(2i) تشكل مثلثاً قائم الزاوية.",
        ],
        solutionsFr: [
          "1. En posant z = x réel, la partie imaginaire donne -2x² + 5x - 4 non nul sauf pour x = 2 vérifiant la partie réelle.",
          "2. Factorisation : P(z) = (z - 2)(z - 1)(z - 2i). Solutions S = {2, 1, 2i}.",
          "3. Les affixes forment un triangle rectangle dans le plan complexe.",
        ],
      },
    ],
  },
  {
    id: "imported_aefe_seconde_ds",
    sourceType: "OFFICIAL_ARCHIVE",
    sourceFileName: "DS_Seconde_Lyautey_Descartes.pdf",
    titleAr: "فرض محروس مستورد (البعثة الفرنسية) — Seconde Lycée Français (AEFE Maroc)",
    titleFr: "Devoir Surveillé Importé (AEFE) — Seconde Lycée Français (Fonctions, Vecteurs & Droites)",
    schoolOriginAr: "مؤسسات البعثة الفرنسية بالمغرب AEFE · ليسي ديكارت وليوتي",
    schoolOriginFr: "Réseau AEFE Maroc · Lycées Descartes & Lyautey",
    detectedTrackCode: "TCS",
    detectedSystem: "MISSION_FRANCAISE",
    semester: "S1",
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 45,
    n2: 40,
    n3: 15,
    exercises: [
      {
        id: "ex1_seconde_fonctions",
        titleAr: "دوال المرجع (التربيع والمقلوب) والتأطير وجدول التغيرات",
        titleFr: "Fonctions de référence (carré, inverse), variations et encadrements",
        points: 7,
        weight: 35,
        category: "Calculus",
        subCategory: "تحليل",
        subCategoryFr: "Fonctions de référence",
        capacitiesAr: [
          "توظيف رتابة دوال المرجع لتأطير مقادير جبرية وحل متراجحات",
          "إنشاء جدول التغيرات والتمثيل البياني لدوال تآلفية وتربيعية",
        ],
        capacitiesFr: [
          "Utiliser le sens de variation des fonctions carré et inverse pour encadrer une expression",
          "Dresser un tableau de variations et résoudre graphiquement des inéquations",
        ],
        questionsAr: [
          "1. أدرس رتابة دالة المربع f(x) = x² على المجالين ]-∞, 0] و [0, +∞[، ثم أطر x² إذا علمت أن -3 ≤ x ≤ 2.",
          "2. لتكن g الدالة المعرفة بـ g(x) = 2x² - 4x + 1. أكتب g(x) على الشكل النموذجي، واستنتج القيمة الدنيا لـ g على R.",
          "3. حل بيانياً وجبرياً المتراجحة: 2x² - 4x + 1 ≤ 1.",
        ],
        questionsFr: [
          "1. Rappeler les variations de la fonction carré f(x) = x² et en déduire un encadrement de x² pour x ∈ [-3 ; 2].",
          "2. Soit g(x) = 2x² - 4x + 1. Déterminer la forme canonique de g et préciser son extremum sur ℝ.",
          "3. Résoudre algébriquement dans ℝ l'inéquation : 2x² - 4x + 1 ≤ 1.",
        ],
        questionsModelB_Ar: [
          "1. أطر مقلوب x ودالة المربع على مجالات معطاة.",
          "2. حدد الشكل النموذجي للدالة الحدودية.",
          "3. حل المتراجحة التربيعية في R.",
        ],
        questionsModelB_Fr: [
          "1. Encadrement via les fonctions de référence.",
          "2. Forme canonique et extremum.",
          "3. Résolution d'inéquation du second degré.",
        ],
        questionBaremes: [2.5, 2.5, 2.0],
        solutionsAr: [
          "1. الدالة x ↦ x² تناقصية على ]-∞, 0] وتزايدية على [0, +∞[. من أجل -3 ≤ x ≤ 2، القيمة الدنيا هي 0 والقيمة القصوى (-3)² = 9، إذن 0 ≤ x² ≤ 9.",
          "2. g(x) = 2(x² - 2x) + 1 = 2[(x - 1)² - 1] + 1 = 2(x - 1)² - 1. القيمة الدنيا هي -1 عند x = 1.",
          "3. 2x² - 4x + 1 ≤ 1 تعني 2x(x - 2) ≤ 0، وجدول الإشارة يعطي مجموعة الحلول S = [0, 2].",
        ],
        solutionsFr: [
          "1. La fonction carré est décroissante sur ]-∞ ; 0] et croissante sur [0 ; +∞[. Pour x ∈ [-3 ; 2], 0 ≤ x² ≤ 9.",
          "2. Forme canonique : g(x) = 2(x - 1)² - 1. Le minimum absolu vaut -1, atteint en x = 1.",
          "3. 2x(x - 2) ≤ 0 donne S = [0 ; 2].",
        ],
      },
      {
        id: "ex2_seconde_vecteurs_droites",
        titleAr: "الحساب المتجهي في المعلم ومعادلات المستقيمات",
        titleFr: "Vecteurs dans un repère, colinéarité et équations cartésiennes de droites",
        points: 7,
        weight: 35,
        category: "Geometry",
        subCategory: "هندسة مستوية",
        subCategoryFr: "Géométrie repérée & Droites",
        capacitiesAr: [
          "حساب إحداثيات متجهة ومحدد متجهتين لاختبار الاستقامية والتوازي",
          "تحديد المعادلة المختصرة لمستقيم ودراسة تقاطع مستقيمين",
        ],
        capacitiesFr: [
          "Calculer le déterminant de deux vecteurs et tester leur colinéarité",
          "Déterminer l'équation réduite d'une droite et calculer les coordonnées d'un point d'intersection",
        ],
        questionsAr: [
          "في المستوى المنسوب إلى معلم (O, i, j)، نعتبر النقط A(-2, 1) و B(4, 3) و C(1, -2) و D(7, 0).",
          "1. أحسب إحداثيات المتجهتين AB و CD، ثم بين أن المستقيمين (AB) و (CD) متوازيان.",
          "2. حدد المعادلة المختصرة للمستقيم (AB) وللمستقيم (d) المار من C والعمودي على محور الأراتيب.",
          "3. نعتبر النقطة E(x, 5). حدد قيمة x لكي تكون النقط A و B و E مستقيمية.",
        ],
        questionsFr: [
          "Dans un repère orthonormé (O, i, j), on donne A(-2, 1), B(4, 3), C(1, -2) et D(7, 0).",
          "1. Calculer les coordonnées de AB et CD, puis montrer que les droites (AB) et (CD) sont parallèles.",
          "2. Déterminer l'équation réduite de la droite (AB).",
          "3. Soit E(x, 5). Déterminer x pour que les points A, B et E soient alignés.",
        ],
        questionsModelB_Ar: [
          "1. أحسب إحداثيات المتجهات واختبر التوازي بالمحدد.",
          "2. حدد المعادلة المختصرة للمستقيم.",
          "3. استنتج إحداثيات النقطة لضمان الاستقامية.",
        ],
        questionsModelB_Fr: [
          "1. Coordonnées vectorielles et colinéarité.",
          "2. Équation réduite de droite.",
          "3. Alignement de points.",
        ],
        questionBaremes: [2.5, 2.5, 2.0],
        solutionsAr: [
          "1. AB(6, 2) و CD(6, 2). المتجهتان متساويتان إذن مستقيمتان والمستقيمان (AB) و (CD) متوازيان.",
          "2. ميل (AB) هو m = (3 - 1)/(4 - (-2)) = 2/6 = 1/3. معادلة (AB): y = (1/3)x + 5/3.",
          "3. A و B و E مستقيمية يعني أن AE(x + 2, 4) مستقيمية مع AB(6, 2): 2(x + 2) - 4×6 = 0 يعني 2x + 4 - 24 = 0 أي x = 10.",
        ],
        solutionsFr: [
          "1. AB(6, 2) et CD(6, 2) : vecteurs colinéaires donc (AB) // (CD).",
          "2. Coefficient directeur m = 1/3, équation réduite y = (1/3)x + 5/3.",
          "3. Déterminant nul det(AB, AE) = 0 ⇔ 2(x + 2) - 24 = 0 ⇔ x = 10.",
        ],
      },
      {
        id: "ex3_seconde_probabilites",
        titleAr: "حساب الاحتمالات وجدول التقاطع والشجرة المرجحة",
        titleFr: "Probabilités, tableau croisé et arbre pondéré",
        points: 6,
        weight: 30,
        category: "Probabilities",
        subCategory: "احتمالات وإحصاء",
        subCategoryFr: "Probabilités & Réunions",
        capacitiesAr: [
          "حساب احتمال اتحاد وتقاطع حدثين باستعمال صيغة P(A∪B) = P(A) + P(B) - P(A∩B)",
          "استعمال الشجرة المرجحة لنمذجة تجربة عشوائية من خطوتين",
        ],
        capacitiesFr: [
          "Calculer la probabilité d'une réunion et d'une intersection d'événements",
          "Construire et exploiter un arbre pondéré pour une expérience à deux épreuves",
        ],
        questionsAr: [
          "في ثانوية تأهيلية، 60% من التلاميذ يمارسون الرياضة (الحدث S)، و 40% ينخرطون في نادي المعلوميات (الحدث I)، و 25% يمارسون الأمرين معاً.",
          "1. أحسب احتمال أن يمارس تلميذ مختار عشوائياً الرياضة أو المعلوميات P(S ∪ I).",
          "2. أحسب احتمال أن لا يمارس التلميذ أياً من النشاطين.",
          "3. علماً أن التلميذ يمارس الرياضة، ما احتمال أن يكون منخرطاً أيضاً في نادي المعلوميات؟",
        ],
        questionsFr: [
          "Dans un lycée, 60% des élèves pratiquent le sport (événement S), 40% sont inscrits au club informatique (I) et 25% pratiquent les deux.",
          "1. Calculer P(S ∪ I) : probabilité qu'un élève choisi au hasard pratique le sport ou l'informatique.",
          "2. Calculer la probabilité qu'un élève ne pratique aucune de ces deux activités.",
          "3. Sachant que l'élève pratique le sport, quelle est la probabilité qu'il soit aussi inscrit au club informatique ?",
        ],
        questionsModelB_Ar: [
          "1. أحسب P(S ∪ I) بالصيغة المرجعية.",
          "2. أحسب احتمال الحدث المضاد.",
          "3. أحسب الاحتمال الشرطي.",
        ],
        questionsModelB_Fr: [
          "1. Calcul de la réunion.",
          "2. Événement contraire.",
          "3. Probabilité conditionnelle.",
        ],
        questionBaremes: [2.0, 2.0, 2.0],
        solutionsAr: [
          "1. P(S ∪ I) = P(S) + P(I) - P(S ∩ I) = 0.60 + 0.40 - 0.25 = 0.75.",
          "2. الحدث المضاد هو عدم ممارسة أي نشاط: P = 1 - P(S ∪ I) = 1 - 0.75 = 0.25.",
          "3. الاحتمال الشرطي: P(I|S) = P(S ∩ I) / P(S) = 0.25 / 0.60 = 5/12 ≈ 0.417.",
        ],
        solutionsFr: [
          "1. P(S ∪ I) = 0,60 + 0,40 - 0,25 = 0,75.",
          "2. Événement contraire : 1 - 0,75 = 0,25.",
          "3. P_S(I) = P(S ∩ I) / P(S) = 0,25 / 0,60 = 5/12 ≈ 0,417.",
        ],
      },
    ],
  },
];

/**
 * دالة ذكية لتحويل النصوص والمعادلات الرياضية لتوليد نسخ محاكية متكافئة (Isomorphic Twin Variants)
 * مع دعم البذرة الرقمية (variationSeed) لتوليد عدد غير محدود من النماذج المحاكية
 */
export function mutateMathExpressionBySeed(
  text: string,
  seed: number = 1
): string {
  if (!text || seed <= 0) return text;
  const s = ((seed - 1) % 4) + 1;

  let out = text;

  if (s === 1) {
    out = out
      .replace(/\(4u_n - 1\)\/\(u_n \+ 2\)/g, "(5u_n - 4)/(u_n + 1)")
      .replace(/u_0 = 2/g, "u_0 = 3")
      .replace(/u_n > 1/g, "u_n > 2")
      .replace(/u_n - 1/g, "u_n - 2")
      .replace(/x³ \+ 3x - 2/g, "x³ + 4x - 3")
      .replace(/\(-2\)/g, "(-3)")
      .replace(/x - 1 \+ 2√x/g, "x - 3 + 4√x")
      .replace(/\(√x \+ 1\)/g, "(√x + 2)")
      .replace(/z² - 2√3 z \+ 4 = 0/g, "z² - 4√3 z + 16 = 0")
      .replace(/√3 \+ i/g, "2√3 + 2i")
      .replace(/√3 - i/g, "2√3 - 2i")
      .replace(/c = 2i/g, "c = 4i")
      .replace(/R = 3/g, "R = 6")
      .replace(/\(x - 1\)e\^x \+ x/g, "(x - 2)e^x + x")
      .replace(/\(x \+ 2\)e\^\{-x\}/g, "(x + 3)e^{-x}")
      .replace(/n² \+ 3n \+ 4/g, "n² + 5n + 6")
      .replace(/540/g, "720")
      .replace(/378/g, "504")
      .replace(/x² - 4x \+ 5/g, "x² - 6x + 11");
  } else if (s === 2) {
    out = out
      .replace(/\(4u_n - 1\)\/\(u_n \+ 2\)/g, "(6u_n - 9)/(u_n)")
      .replace(/u_0 = 2/g, "u_0 = 4")
      .replace(/u_n > 1/g, "u_n > 3")
      .replace(/u_n - 1/g, "u_n - 3")
      .replace(/x³ \+ 3x - 2/g, "x³ + 2x - 5")
      .replace(/x - 1 \+ 2√x/g, "x - 2 + 6√x")
      .replace(/\(√x \+ 1\)/g, "(√x + 3)")
      .replace(/z² - 2√3 z \+ 4 = 0/g, "z² - 6√3 z + 36 = 0")
      .replace(/√3 \+ i/g, "3√3 + 3i")
      .replace(/√3 - i/g, "3√3 - 3i")
      .replace(/c = 2i/g, "c = 6i")
      .replace(/R = 3/g, "R = 9")
      .replace(/\(x - 1\)e\^x \+ x/g, "(x - 3)e^x + x")
      .replace(/\(x \+ 2\)e\^\{-x\}/g, "(x + 4)e^{-x}")
      .replace(/n² \+ 3n \+ 4/g, "n² + 7n + 12")
      .replace(/540/g, "1080")
      .replace(/378/g, "756")
      .replace(/x² - 4x \+ 5/g, "x² - 8x + 17");
  } else if (s === 3) {
    out = out
      .replace(/\(4u_n - 1\)\/\(u_n \+ 2\)/g, "(3u_n + 2)/(u_n + 2)")
      .replace(/u_0 = 2/g, "u_0 = 5")
      .replace(/x³ \+ 3x - 2/g, "x³ + 5x - 4")
      .replace(/x - 1 \+ 2√x/g, "2x - 1 + 4√x")
      .replace(/z² - 2√3 z \+ 4 = 0/g, "z² - 2√2 z + 4 = 0")
      .replace(/\(x - 1\)e\^x \+ x/g, "(2x - 1)e^x + x")
      .replace(/n² \+ 3n \+ 4/g, "n² + 9n + 14")
      .replace(/540/g, "900")
      .replace(/378/g, "630");
  } else {
    out = out
      .replace(/\(4u_n - 1\)\/\(u_n \+ 2\)/g, "(7u_n - 9)/(u_n + 1)")
      .replace(/x³ \+ 3x - 2/g, "2x³ + 3x - 4")
      .replace(/x - 1 \+ 2√x/g, "x - 4 + 2√x")
      .replace(/\(x - 1\)e\^x \+ x/g, "(x + 1)e^x + x")
      .replace(/n² \+ 3n \+ 4/g, "n² + 3n + 8");
  }

  return out;
}

/**
 * استكشاف وتصنيف محور الدرس تلقائياً من نص التمرين المستورد
 */
export function detectExerciseCategory(text: string): {
  category: LessonMainCategory;
  subCategory: LessonSubCategory;
  subCategoryFr: string;
  capacitiesAr: string[];
  capacitiesFr: string[];
} {
  const t = text.toLowerCase();

  if (
    t.includes("عقدي") ||
    t.includes("ألحاق") ||
    t.includes("complexe") ||
    t.includes("affixe") ||
    t.includes("z²")
  ) {
    return {
      category: "Geometry",
      subCategory: "أعداد عقدية",
      subCategoryFr: "Nombres complexes",
      capacitiesAr: [
        "حل معادلات في المجموعة C وتوظيف الشكل المثلثي والأسي",
        "التأويل الهندسي للأعداد العقدية والتحويلات النقطية",
      ],
      capacitiesFr: [
        "Résoudre des équations dans ℂ et exploiter la forme exponentielle",
        "Interpréter géométriquement les modules, arguments et transformations",
      ],
    };
  }

  if (
    t.includes("فضاء") ||
    t.includes("فلكة") ||
    t.includes("متجهي") ||
    t.includes("sphère") ||
    t.includes("espace") ||
    t.includes("plan (") ||
    t.includes("(o, i, j, k)")
  ) {
    return {
      category: "Geometry",
      subCategory: "هندسة فضائية",
      subCategoryFr: "Géométrie dans l'espace 3D",
      capacitiesAr: [
        "حساب الجداء السلمي والمتجهي وتحديد معادلة مستوى في الفضاء",
        "دراسة الأوضاع النسبية لفلكة ومستقيم ومستوى في الفضاء",
      ],
      capacitiesFr: [
        "Calculer le produit scalaire et vectoriel et déterminer l'équation d'un plan",
        "Étudier les positions relatives d'une sphère et d'un plan dans l'espace",
      ],
    };
  }

  if (
    t.includes("احتمال") ||
    t.includes("كرات") ||
    t.includes("صندوق") ||
    t.includes("عشوائي") ||
    t.includes("probabilit") ||
    t.includes("urne") ||
    t.includes("boule") ||
    t.includes("aléatoire")
  ) {
    return {
      category: "Probabilities",
      subCategory: "احتمالات وإحصاء",
      subCategoryFr: "Probabilités & Variables aléatoires",
      capacitiesAr: [
        "حساب احتمالات الأحداث وتوظيف الاحتمالات الشرطية والاستقلالية",
        "دراسة متغير عشوائي والقانون الحداني وحساب الأمل الرياضي",
      ],
      capacitiesFr: [
        "Calculer des probabilités d'événements et utiliser les probabilités conditionnelles",
        "Déterminer la loi de probabilité d'une variable aléatoire et son espérance",
      ],
    };
  }

  if (
    t.includes("قاسم") ||
    t.includes("زوجية") ||
    t.includes("أولي") ||
    t.includes("pgcd") ||
    t.includes("ppcm") ||
    t.includes("arithm") ||
    t.includes("divis") ||
    t.includes("parité")
  ) {
    return {
      category: "Algebra",
      subCategory: "حسابيات",
      subCategoryFr: "Arithmétique",
      capacitiesAr: [
        "توظيف الزوجية وتفكيك الأعداد والقسمة الإقليدية",
        "حساب PGCD و PPCM وحل المسائل الحسابية",
      ],
      capacitiesFr: [
        "Utiliser la parité, la divisibilité et la décomposition en facteurs premiers",
        "Déterminer le PGCD et le PPCM et résoudre des problèmes arithmétiques",
      ],
    };
  }

  if (
    t.includes("منطق") ||
    t.includes("ترجع") && !t.includes("متتالية") ||
    t.includes("عبارة") ||
    t.includes("contraposée") ||
    t.includes("logique") ||
    t.includes("disjonction")
  ) {
    return {
      category: "Algebra",
      subCategory: "منطق ومجموعات",
      subCategoryFr: "Logique & Ensembles",
      capacitiesAr: [
        "التمييز بين طرق الاستدلال الرياضي (المضاد للعكس، الخلف، فصل الحالات، الترجع)",
        "صياغة البراهين الرياضية بدقة منطقية",
      ],
      capacitiesFr: [
        "Maîtriser les modes de raisonnement (contraposée, absurde, disjonction, récurrence)",
        "Rédiger une démonstration mathématique rigoureuse",
      ],
    };
  }

  if (
    t.includes("مرجح") ||
    t.includes("متجه") ||
    t.includes("إسقاط") ||
    t.includes("سلمي") ||
    t.includes("barycentre") ||
    t.includes("vecteur") ||
    t.includes("scalaire") ||
    t.includes("projection")
  ) {
    return {
      category: "Geometry",
      subCategory: "هندسة مستوية",
      subCategoryFr: "Géométrie plane",
      capacitiesAr: [
        "توظيف الحساب المتجهي أو المرجح أو الجداء السلمي في المستوى",
        "تحديد طبيعة المجموعات الهندسية ومعادلات المستقيمات والدوائر",
      ],
      capacitiesFr: [
        "Utiliser le calcul vectoriel, le barycentre ou le produit scalaire dans le plan",
        "Déterminer des lieux géométriques et des équations de droites et cercles",
      ],
    };
  }

  if (
    t.includes("مثلثي") ||
    t.includes("cos(") ||
    t.includes("sin(") ||
    t.includes("trigonom")
  ) {
    return {
      category: "Geometry",
      subCategory: "حساب مثلثي",
      subCategoryFr: "Trigonométrie",
      capacitiesAr: [
        "تبسيط التعابير المثلثية وتوظيف صيغ التحويل",
        "حل المعادلات والمتراجحات المثلثية وتمثيل الحلول على الدائرة المثلثية",
      ],
      capacitiesFr: [
        "Simplifier des expressions trigonométriques à l'aide des formules d'addition",
        "Résoudre des équations et inéquations trigonométriques sur le cercle unité",
      ],
    };
  }

  return {
    category: "Calculus",
    subCategory: "تحليل",
    subCategoryFr: "Analyse (Fonctions & Suites)",
    capacitiesAr: [
      "دراسة اتصال واشتقاق ورتابة الدوال العددية أو تقارب المتتاليات",
      "توظيف مبرهنة القيم الوسيطية أو حساب التكامل والتمثيل المبياني",
    ],
    capacitiesFr: [
      "Étudier la continuité, la dérivabilité, les variations de fonctions ou les suites",
      "Exploiter le TVI, le calcul intégral et l'interprétation graphique",
    ],
  };
}

/**
 * محلل ذكي فوري (Client-Side Smart Parser) لنصوص الفروض المحروسة المستوردة
 * يدعم النصوص العربية والفرنسية وملفات LaTeX (.tex) و Typst (.typ) و Markdown
 */
export function parseImportedExamText(
  rawText: string,
  fileName?: string
): ImportedExamBlueprint {
  const cleaned = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\\begin\{document\}[\s\S]*?\\maketitle/gi, "")
    .replace(/\\end\{document\}/gi, "")
    .trim();

  // اكتشاف المسلك والنظام تلقائياً
  const lower = cleaned.toLowerCase();
  let detectedTrackCode = "2BAC_PC";
  let detectedSystem: EducationSystem = "MAROC_NATIONAL";
  let semester: SemesterType = "S1";

  if (
    lower.includes("spécialité") ||
    lower.includes("lyautey") ||
    lower.includes("descartes") ||
    lower.includes("aefe") ||
    lower.includes("terminale")
  ) {
    detectedTrackCode = "TERM_SPE_FR";
    detectedSystem = "MISSION_FRANCAISE";
  } else if (lower.includes("علوم رياضية") || lower.includes("sciences math")) {
    detectedTrackCode = "2BAC_SM";
  } else if (
    lower.includes("جذع") ||
    lower.includes("مشترك") ||
    lower.includes("tronc commun") ||
    lower.includes("tcs")
  ) {
    detectedTrackCode = "TCS";
  } else if (
    lower.includes("1bac sh") ||
    lower.includes("1bac_sh") ||
    lower.includes("1bac-sh") ||
    lower.includes("1bacsh") ||
    lower.includes("1bac lsh") ||
    lower.includes("1bac_lsh") ||
    lower.includes("1bac-lsh") ||
    lower.includes("1baclsh") ||
    lower.includes("آداب وعلوم إنسانية") ||
    lower.includes("علوم إنسانية") ||
    lower.includes("sciences humaines") ||
    lower.includes("lettres et sciences humaines") ||
    lower.includes("lsh")
  ) {
    detectedTrackCode = "1BAC_LSH";
  } else if (
    lower.includes("أولى باك") ||
    lower.includes("1bac") ||
    lower.includes("1ère bac") ||
    lower.includes("مرجح") ||
    lower.includes("barycentre")
  ) {
    detectedTrackCode = "1BAC_SE";
  }

  if (
    lower.includes("عقدي") ||
    lower.includes("complexe") ||
    lower.includes("تكامل") ||
    lower.includes("intégral") ||
    lower.includes("احتمال") ||
    lower.includes("probabilit") ||
    lower.includes("الدورة 2") ||
    lower.includes("semestre 2")
  ) {
    semester = "S2";
  }

  // تقسيم النص إلى تمارين أو مسائل
  const exerciseRegex =
    /(?:^|\n)\s*(?:===+\s*|\\section\*?\{|#+\s*)?(?:التمرين|تمرين|مسألة|المسألة|Exercice|EXERCICE|Problème|PROBLÈME)\s*(?:رقم\s*)?([0-9IVX]+|الأول|الثاني|الثالث|الرابع)?[^\n]*/gi;

  const matches = Array.from(cleaned.matchAll(exerciseRegex));
  const parsedExercises: ImportedExamExercise[] = [];

  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      const headerLine = m[0].replace(/^[\n\s=#*\\]+/, "").replace(/\}$/, "").trim();
      const startIdx = (m.index || 0) + m[0].length;
      const endIdx = i + 1 < matches.length ? matches[i + 1].index || cleaned.length : cleaned.length;
      const bodyText = cleaned.slice(startIdx, endIdx).trim();

      // استخراج النقط المخصصة للتمرين إن وجدت مثل (5 نقط) أو (6 pts)
      const ptsMatch = headerLine.match(
        /\(\s*(\d+(?:[.,]\d+)?)\s*(?:نقط|نقطة|ن|pts?|points?)\s*\)/i
      );
      const parsedPts = ptsMatch
        ? Math.max(1, Math.min(20, parseFloat(ptsMatch[1].replace(",", "."))))
        : 0;

      // استخراج الأسئلة الفرعية من جسم التمرين
      const rawLines = bodyText
        .split("\n")
        .map((l) =>
          l
            .replace(/^\\item\s*/i, "")
            .replace(/^\s*[-•*]\s*/, "")
            .trim()
        )
        .filter((l) => l.length > 3 && !l.startsWith("%") && !l.startsWith("//"));

      const questionsList =
        rawLines.length > 0
          ? rawLines.slice(0, 8)
          : [`حل الأسئلة المرتبطة بـ ${headerLine}`];

      const catInfo = detectExerciseCategory(`${headerLine} ${bodyText}`);

      // تنظيف عنوان التمرين
      const cleanTitle = headerLine
        .replace(
          /^(?:التمرين|تمرين|مسألة|المسألة|Exercice|Problème)\s*(?:رقم\s*)?(?:[0-9IVX]+|الأول|الثاني|الثالث|الرابع)?\s*[:\-–—]?\s*/i,
          ""
        )
        .replace(/\(\s*\d+(?:[.,]\d+)?\s*(?:نقط|نقطة|ن|pts?|points?).*?\)/gi, "")
        .trim();

      const hasArabic = /[\u0600-\u06FF]/.test(bodyText);
      const titleAr = cleanTitle && hasArabic ? cleanTitle : catInfo.subCategory;
      const titleFr = cleanTitle && !hasArabic ? cleanTitle : catInfo.subCategoryFr;

      const mutatedQuestions = questionsList.map((q) =>
        mutateMathExpressionBySeed(q, 1)
      );

      parsedExercises.push({
        id: `parsed_ex_${i + 1}_${Date.now()}`,
        titleAr,
        titleFr,
        points: parsedPts,
        weight: parsedPts > 0 ? Math.round((parsedPts / 20) * 100) : 0,
        category: catInfo.category,
        subCategory: catInfo.subCategory,
        subCategoryFr: catInfo.subCategoryFr,
        capacitiesAr: catInfo.capacitiesAr,
        capacitiesFr: catInfo.capacitiesFr,
        questionsAr: questionsList,
        questionsFr: questionsList,
        questionsModelB_Ar: mutatedQuestions,
        questionsModelB_Fr: mutatedQuestions,
        questionBaremes: [],
        solutionsAr: questionsList.map(
          (q, qIdx) =>
            `الخطوة ${qIdx + 1}: بتطبيق خاصيات محور « ${catInfo.subCategory} » على المعطيات (${q.slice(0, 65)}...) نصل إلى النتيجة المطلوبة مع التعليل الرياضي الكامل.`
        ),
        solutionsFr: questionsList.map(
          (q, qIdx) =>
            `Étape ${qIdx + 1} : En mobilisant les théorèmes du chapitre « ${catInfo.subCategoryFr} » sur l'énoncé (${q.slice(0, 65)}...), on établit rigoureusement le résultat attendu.`
        ),
      });
    }
  } else {
    // إذا لم تكن هناك ترويسات تمارين صريحة، نقسم الفقرات إلى تمرينين أو تمرين شامل
    const lines = cleaned
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 4);
    const catInfo = detectExerciseCategory(cleaned);
    const qs = lines.length > 0 ? lines.slice(0, 6) : ["سؤال 1: أدرس الوضع الرياضي المقترح."];
    const mutated = qs.map((q) => mutateMathExpressionBySeed(q, 1));

    parsedExercises.push({
      id: `parsed_single_${Date.now()}`,
      titleAr: `تمرين مستورد في ${catInfo.subCategory}`,
      titleFr: `Exercice importé — ${catInfo.subCategoryFr}`,
      points: 20,
      weight: 100,
      category: catInfo.category,
      subCategory: catInfo.subCategory,
      subCategoryFr: catInfo.subCategoryFr,
      capacitiesAr: catInfo.capacitiesAr,
      capacitiesFr: catInfo.capacitiesFr,
      questionsAr: qs,
      questionsFr: qs,
      questionsModelB_Ar: mutated,
      questionsModelB_Fr: mutated,
      questionBaremes: [],
      solutionsAr: qs.map(
        (q, idx) =>
          `عناصر الإجابة للسؤال ${idx + 1}: توظيف القواعد المرجعية لمحور ${catInfo.subCategory} لحل (${q.slice(0, 60)}...).`
      ),
      solutionsFr: qs.map(
        (q, idx) =>
          `Éléments de réponse Q${idx + 1} : Application directe des propriétés de ${catInfo.subCategoryFr} pour résoudre (${q.slice(0, 60)}...).`
      ),
    });
  }

  // موازنة النقط والأوزان ليكون المجموع 20/20 و 100%
  const count = parsedExercises.length;
  const totalSpecifiedPts = parsedExercises.reduce((s, e) => s + e.points, 0);

  if (totalSpecifiedPts <= 0) {
    const baseW = Math.floor(100 / count);
    let remW = 100;
    parsedExercises.forEach((ex, idx) => {
      ex.weight = idx === count - 1 ? remW : baseW;
      remW -= ex.weight;
      ex.points = Number(((ex.weight * 20) / 100).toFixed(1));
    });
  } else {
    let remW = 100;
    parsedExercises.forEach((ex, idx) => {
      if (idx === count - 1) {
        ex.weight = Math.max(5, remW);
      } else {
        ex.weight = Math.max(5, Math.round((ex.points / totalSpecifiedPts) * 100));
        remW -= ex.weight;
      }
      ex.points = Number(((ex.weight * 20) / 100).toFixed(1));
    });
  }

  // حساب سلم التنقيط الفرعي لكل سؤال في كل تمرين
  parsedExercises.forEach((ex) => {
    const qCount = Math.max(1, ex.questionsAr.length);
    const perQ = Math.max(0.25, Math.round((ex.points / qCount) * 4) / 4);
    let allocated = 0;
    ex.questionBaremes = ex.questionsAr.map((_, qIdx) => {
      if (qIdx === qCount - 1) {
        return Math.max(0.25, Number((ex.points - allocated).toFixed(2)));
      }
      allocated += perQ;
      return perQ;
    });
  });

  return {
    id: `imported_custom_${Date.now()}`,
    sourceType: fileName ? "UPLOADED_FILE" : "PASTED_TEXT",
    sourceFileName: fileName || "Devoir_Surveille_Importe.txt",
    titleAr: fileName
      ? `فرض محروس مستورد (${fileName})`
      : "فرض محروس مستورد ومُهيكل تلقائياً",
    titleFr: fileName
      ? `Devoir Surveillé Importé (${fileName})`
      : "Devoir Surveillé Importé et Structuré",
    schoolOriginAr: "وثيقة مستوردة من طرف الأستاذ — تمت هيكلتها وفق المذكرة 142-08",
    schoolOriginFr: "Document importé par l'enseignant — Structuré selon le cadre de référence",
    detectedTrackCode,
    detectedSystem,
    semester,
    dsKey: "DS1",
    durationAr: "ساعتان (2h)",
    durationFr: "2 heures",
    n1: 45,
    n2: 35,
    n3: 20,
    exercises: parsedExercises,
  };
}

/**
 * تحويل الفرض المحروس المستورد (ImportedExamBlueprint) إلى قائمة دروس وتمارين (LessonItem[])
 * متوافقة بالكامل مع PrintablePreview و docGenerator و evaluationGridExporter
 */
export function convertBlueprintToSimulatedLessons(
  blueprint: ImportedExamBlueprint,
  simulationMode: SimulationMode,
  variationSeed: number = 1
): {
  simulatedLessons: LessonItem[];
  customExerciseTitles: Record<number, string>;
  recommendedN1: number;
  recommendedN2: number;
  recommendedN3: number;
} {
  const customExerciseTitles: Record<number, string> = {};

  const simulatedLessons: LessonItem[] = blueprint.exercises.map((ex, idx) => {
    let qAr: string[];
    let qFr: string[];
    let qModelB_Ar: string[];
    let qModelB_Fr: string[];
    let solAr: string[];
    let solFr: string[];

    if (simulationMode === "EXACT_REPLICA") {
      // محاكاة مطابقة للفرض المستورد في النموذج A، مع الاحتفاظ بالنموذج الموازي في B
      qAr = [...ex.questionsAr];
      qFr = [...ex.questionsFr];
      qModelB_Ar = [...ex.questionsModelB_Ar];
      qModelB_Fr = [...ex.questionsModelB_Fr];
      solAr = [...ex.solutionsAr];
      solFr = [...ex.solutionsFr];
    } else if (simulationMode === "ISOMORPHIC_TWIN") {
      // محاكاة موازية (استنساخ متكافئ بتغيير المعطيات والدوال والأعداد حسب البذرة seed)
      if (variationSeed === 1 && ex.questionsModelB_Ar.length > 0) {
        qAr = [...ex.questionsModelB_Ar];
        qFr = [...ex.questionsModelB_Fr];
      } else {
        qAr = ex.questionsAr.map((q) => mutateMathExpressionBySeed(q, variationSeed));
        qFr = ex.questionsFr.map((q) => mutateMathExpressionBySeed(q, variationSeed));
      }
      qModelB_Ar = ex.questionsAr.map((q) =>
        mutateMathExpressionBySeed(q, variationSeed + 1)
      );
      qModelB_Fr = ex.questionsFr.map((q) =>
        mutateMathExpressionBySeed(q, variationSeed + 1)
      );
      solAr = (ex.solutionsModelB_Ar || ex.solutionsAr).map((s) =>
        mutateMathExpressionBySeed(s, variationSeed)
      );
      solFr = (ex.solutionsModelB_Fr || ex.solutionsFr).map((s) =>
        mutateMathExpressionBySeed(s, variationSeed)
      );
    } else {
      // تكييف بيداغوجي (PEDAGOGICAL_ADAPTATION): إضافة إرشادات منهجية وتوجيهات مرحلية للأسئلة المركبة
      qAr = ex.questionsAr.map((q, qI) => {
        if (qI === ex.questionsAr.length - 1 && ex.questionsAr.length >= 2) {
          return `${q} (إرشاد منهجي للتلميذ: استثمر نتيجة السؤال السابق وخاصية « ${ex.capacitiesAr[0] || ex.subCategory} »).`;
        }
        return q;
      });
      qFr = ex.questionsFr.map((q, qI) => {
        if (qI === ex.questionsFr.length - 1 && ex.questionsFr.length >= 2) {
          return `${q} (Indication méthodologique : Exploiter le résultat précédent et la propriété sur « ${ex.capacitiesFr[0] || ex.subCategoryFr} »).`;
        }
        return q;
      });
      qModelB_Ar = ex.questionsModelB_Ar;
      qModelB_Fr = ex.questionsModelB_Fr;
      solAr = [...ex.solutionsAr];
      solFr = [...ex.solutionsFr];
    }

    const modeBadgeAr =
      simulationMode === "EXACT_REPLICA"
        ? "محاكاة مطابقة"
        : simulationMode === "ISOMORPHIC_TWIN"
        ? `محاكاة موازية #${variationSeed}`
        : "محاكاة مكيفة بيداغوجياً";

    customExerciseTitles[idx] = `التمرين ${idx + 1} : ${ex.titleAr} (${ex.points} ن)`;

    return {
      lessonAr: ex.titleAr,
      lessonFr: ex.titleFr,
      weight: ex.weight,
      hours: "6h",
      category: ex.category,
      subCategory: ex.subCategory,
      subCategoryFr: ex.subCategoryFr,
      tags: [ex.category, ex.subCategory],
      capacitiesAr: ex.capacitiesAr,
      capacitiesFr: ex.capacitiesFr,
      sampleExerciseAr: qAr,
      sampleExerciseFr: qFr,
      sampleExerciseModelB_Ar: qModelB_Ar,
      sampleExerciseModelB_Fr: qModelB_Fr,
      sampleSolutionAr: solAr,
      sampleSolutionFr: solFr,
      customQuestionBaremes: ex.questionBaremes,
      isImportedSimulation: true,
      importedOriginLabel: `${blueprint.titleAr} (${modeBadgeAr})`,
    };
  });

  const recommendedN1 =
    simulationMode === "PEDAGOGICAL_ADAPTATION" ? 55 : blueprint.n1;
  const recommendedN2 =
    simulationMode === "PEDAGOGICAL_ADAPTATION" ? 30 : blueprint.n2;
  const recommendedN3 =
    simulationMode === "PEDAGOGICAL_ADAPTATION" ? 15 : blueprint.n3;

  return {
    simulatedLessons,
    customExerciseTitles,
    recommendedN1,
    recommendedN2,
    recommendedN3,
  };
}
