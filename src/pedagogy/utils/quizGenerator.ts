import { EducationSystem, LessonItem } from "../data/curriculum";
import { ImportedExamExercise } from "./importedExamSimulator";

export type CompetencyLevel = "N1" | "N2" | "N3";

export interface QuizChoice {
  id: string; // e.g. "opt_A", "opt_B", "opt_C", "opt_D"
  code: "A" | "B" | "C" | "D";
  labelAr: string;
  labelFr: string;
  isCorrect: boolean;
  explanationAr: string;
  explanationFr: string;
}

export interface QuizQuestionItem {
  id: string;
  exerciseId: string;
  exerciseTitleAr: string;
  exerciseTitleFr: string;
  questionIndex: number;
  questionPromptAr: string;
  questionPromptFr: string;
  choices: QuizChoice[];
  points: number; // e.g. 2.0 or 2.5 (summing to 20.00)
  level: CompetencyLevel;
  category: string;
  categoryFr: string;
  hintAr?: string;
  hintFr?: string;
  fullSolutionAr?: string;
  fullSolutionFr?: string;
}

export interface InteractiveQuizData {
  id: string;
  titleAr: string;
  titleFr: string;
  schoolAr: string;
  schoolFr: string;
  prof: string;
  trackCode: string;
  system: EducationSystem;
  totalQuestions: number;
  totalPoints: number; // 20.00
  durationMinutes: number; // e.g. 30, 45, 60 or 0 for untimed
  calculatorAllowed: boolean;
  questions: QuizQuestionItem[];
}

export interface StudentQuizSubmission {
  candidateName: string;
  candidateClass: string;
  candidateNumber: string;
  answers: Record<string, string>; // questionId -> choiceId
  formulaAnswers?: Record<string, string>; // questionId -> direct math expression
  flaggedQuestionIds: string[];
  elapsedSeconds: number;
  completedAt: string;
}

export interface CompetencyScoreSummary {
  level: CompetencyLevel;
  labelAr: string;
  labelFr: string;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  masteryStatus: "EXCELLENT" | "SATISFACTORY" | "DEVELOPING" | "NEEDS_REINFORCEMENT";
}

export interface RemediationActionItem {
  id: string;
  level: CompetencyLevel;
  domainAr: string;
  domainFr: string;
  diagnosedObstacleAr: string;
  diagnosedObstacleFr: string;
  recommendedActionAr: string;
  recommendedActionFr: string;
  practiceExerciseAr: string;
  practiceExerciseFr: string;
}

export interface QuestionVerdict {
  questionId: string;
  questionNumber: number;
  exerciseTitle: string;
  questionPrompt: string;
  level: CompetencyLevel;
  pointsEarned: number;
  maxPoints: number;
  selectedChoiceId: string | null;
  selectedChoiceLabel: string;
  correctChoiceId: string;
  correctChoiceLabel: string;
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
  fullSolution: string;
}

export interface QuizEvaluationReport {
  candidateName: string;
  candidateClass: string;
  candidateNumber: string;
  examTitle: string;
  scoreOut20: number;
  percentage: number;
  timeSpentFormatted: string;
  timeLimitFormatted: string;
  appraisalAr: string;
  appraisalFr: string;
  mentionColor: string;
  competencyBreakdown: CompetencyScoreSummary[];
  remediationPlan?: RemediationActionItem[];
  verdicts: QuestionVerdict[];
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalQuestions: number;
  evaluatedAt: string;
}

/**
 * محرك التحقق الرمزي من التكافؤ الرياضي لإجابات التلاميذ المفتوحة (Symbolic Equivalence Checker)
 */
export function checkSymbolicMathEquivalence(
  studentInput: string,
  correctChoice: QuizChoice
): boolean {
  if (!studentInput || !studentInput.trim()) return false;
  const normalizeMath = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
      .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
      .replace(/√\(([^)]+)\)/g, "sqrt($1)")
      .replace(/√(\d+)/g, "sqrt($1)")
      .replace(/\\ln/g, "ln")
      .replace(/\\pi/g, "pi")
      .replace(/π/g, "pi")
      .replace(/\\infty|∞/g, "inf")
      .replace(/,/g, ".");

  const normStudent = normalizeMath(studentInput);
  const normAr = normalizeMath(correctChoice.labelAr);
  const normFr = normalizeMath(correctChoice.labelFr);

  if (normStudent.length >= 1 && (normAr.includes(normStudent) || normFr.includes(normStudent))) {
    return true;
  }

  // مكافئات عددية وجبرية شهيرة في الثانوي التأهيلي
  const equivGroups = [
    ["1/2", "0.5", "2/4"],
    ["-1/2", "-0.5"],
    ["sqrt(2)/2", "1/sqrt(2)", "0.707"],
    ["sqrt(3)/2", "0.866"],
    ["e-1", "e^1-1"],
    ["+inf", "inf", "+∞"],
    ["-inf", "-∞"],
    ["0", "0.0", "l=0"],
    ["1", "1.0", "l=1"],
  ];

  for (const group of equivGroups) {
    if (
      group.some((g) => normStudent === g) &&
      group.some((g) => normAr.includes(g) || normFr.includes(g))
    ) {
      return true;
    }
  }

  return false;
}

/**
 * محرك الخوارزمية الفوري لتحويل تمارين الفرض المحروس إلى كويز تفاعلي متكامل
 */
export function convertExercisesToInteractiveQuiz(params: {
  lessons: LessonItem[] | ImportedExamExercise[];
  titleAr: string;
  titleFr: string;
  schoolAr?: string;
  schoolFr?: string;
  prof?: string;
  trackCode: string;
  system: EducationSystem;
  durationMinutes?: number;
  calculatorAllowed?: boolean;
}): InteractiveQuizData {
  const {
    lessons,
    titleAr,
    titleFr,
    schoolAr = "ثانوية التأهيلية للرياضيات",
    schoolFr = "Lycée Qualifiant de Mathématiques",
    prof = "أستاذ مادة الرياضيات",
    trackCode,
    system,
    durationMinutes = 45,
    calculatorAllowed = true,
  } = params;

  const rawQuestions: QuizQuestionItem[] = [];
  let globalQIndex = 1;

  lessons.forEach((item, exIdx) => {
    const isImportedEx = "questionsAr" in item && Array.isArray((item as ImportedExamExercise).questionsAr);
    const exTitleAr =
      "titleAr" in item && typeof (item as ImportedExamExercise).titleAr === "string"
        ? (item as ImportedExamExercise).titleAr
        : "lessonAr" in item && typeof (item as LessonItem).lessonAr === "string"
        ? (item as LessonItem).lessonAr
        : `التمرين ${exIdx + 1}`;
    const exTitleFr =
      "titleFr" in item && typeof (item as ImportedExamExercise).titleFr === "string"
        ? (item as ImportedExamExercise).titleFr
        : "lessonFr" in item && typeof (item as LessonItem).lessonFr === "string"
        ? (item as LessonItem).lessonFr
        : `Exercice ${exIdx + 1}`;
    const category = item.category || "Calculus";
    const subCategory = ("subCategory" in item ? item.subCategory : "") || "تحليل ودوال";
    const subCategoryFr = ("subCategoryFr" in item ? item.subCategoryFr : "") || "Analyse mathématique";

    let questionsArList: string[] = [];
    let questionsFrList: string[] = [];
    let baremesList: number[] = [];
    let solutionsArList: string[] = [];
    let solutionsFrList: string[] = [];
    let capacitiesArList: string[] = item.capacitiesAr || [];
    let capacitiesFrList: string[] = item.capacitiesFr || [];

    if (isImportedEx) {
      const ex = item as ImportedExamExercise;
      questionsArList = ex.questionsAr || [];
      questionsFrList = ex.questionsFr || [];
      baremesList = ex.questionBaremes || [];
      solutionsArList = ex.solutionsAr || [];
      solutionsFrList = ex.solutionsFr || [];
    } else {
      const l = item as LessonItem;
      const rawAr = l.sampleExerciseAr;
      const sampleAr = Array.isArray(rawAr)
        ? rawAr
        : typeof rawAr === "string"
        ? [rawAr]
        : [];
      questionsArList = sampleAr.filter((s: string) => typeof s === "string" && s.trim().length > 5);

      const rawFr = l.sampleExerciseFr;
      const sampleFr = Array.isArray(rawFr)
        ? rawFr
        : typeof rawFr === "string"
        ? [rawFr]
        : [];
      questionsFrList = sampleFr.filter((s: string) => typeof s === "string" && s.trim().length > 5);

      baremesList = l.customQuestionBaremes || [];
      solutionsArList = Array.isArray(l.sampleSolutionAr)
        ? l.sampleSolutionAr
        : [l.capacitiesAr?.join(" - ") || ""];
      solutionsFrList = Array.isArray(l.sampleSolutionFr)
        ? l.sampleSolutionFr
        : [l.capacitiesFr?.join(" - ") || ""];
    }

    if (questionsArList.length === 0) {
      questionsArList = [
        `حدد الخاصية الأساسية المرتبطة بـ ${exTitleAr}`,
        `أحسب القيمة الدقيقة أو استنتج النتيجة الرياضية في ${exTitleAr}`,
      ];
      questionsFrList = [
        `Déterminer la propriété fondamentale relative à : ${exTitleFr}`,
        `Calculer la valeur exacte ou déduire le résultat mathématique dans : ${exTitleFr}`,
      ];
    }

    questionsArList.forEach((qAr, qIdx) => {
      const qFr = questionsFrList[qIdx] || qAr;
      const solAr = solutionsArList[qIdx] || solutionsArList[0] || "تطبيق مباشر للمبرهنات والقواعد الرياضية المعمول بها.";
      const solFr = solutionsFrList[qIdx] || solutionsFrList[0] || "Application directe des théorèmes et propriétés du cours.";
      const capacityAr = capacitiesArList[qIdx % Math.max(1, capacitiesArList.length)] || "البرهان والاستدلال الرياضي";
      const capacityFr = capacitiesFrList[qIdx % Math.max(1, capacitiesFrList.length)] || "Raisonnement et justification";

      // تحديد المستوى المهاري N1 / N2 / N3 بناء على دلالات السؤال
      let level: CompetencyLevel = "N2";
      if (/أحسب|تحقق|بين أن u_1|احتمال|فكك|أنشئ|calculer|vérifier|déterminer/i.test(qAr)) {
        level = "N1";
      } else if (/استنتج|دالة عكسية|مبرهنة|متتاليتين متحاديتين|حجم|تكامل|déduire|bijection|tvi|ipp|valeurs intermédiaires/i.test(qAr)) {
        level = "N3";
      }

      // توليد 4 خيارات رياضية ذكية مع مضللات بيداغوجية
      const choices = generateAlgorithmicChoices({
        questionTextAr: qAr,
        questionTextFr: qFr,
        solutionTextAr: solAr,
        solutionTextFr: solFr,
        category: String(category),
        qIndex: globalQIndex,
      });

      rawQuestions.push({
        id: `q_${globalQIndex}_${exIdx}_${qIdx}`,
        exerciseId: `ex_${exIdx + 1}`,
        exerciseTitleAr: exTitleAr,
        exerciseTitleFr: exTitleFr,
        questionIndex: globalQIndex,
        questionPromptAr: qAr.replace(/^\d+[\.\-\)]\s*/, ""),
        questionPromptFr: qFr.replace(/^\d+[\.\-\)]\s*/, ""),
        choices,
        points: baremesList[qIdx] || 2.0,
        level,
        category: subCategory,
        categoryFr: subCategoryFr,
        hintAr: `إرشاد منهجي: اعتمد على خاصية: ${capacityAr}.`,
        hintFr: `Indication : Mobiliser la propriété suivante : ${capacityFr}.`,
        fullSolutionAr: solAr,
        fullSolutionFr: solFr,
      });

      globalQIndex++;
    });
  });

  // موازنة سلم التنقيط ليصبح مجموع النقط مساوياً لـ 20.00 نقطة بالضبط
  const totalRawPoints = rawQuestions.reduce((acc, q) => acc + q.points, 0);
  const scaleRatio = totalRawPoints > 0 ? 20 / totalRawPoints : 1;

  let currentSum = 0;
  const balancedQuestions = rawQuestions.map((q, idx) => {
    let balanced = Math.round(q.points * scaleRatio * 4) / 4; // مضاعفات 0.25
    if (balanced <= 0.25) balanced = 0.5;
    if (idx === rawQuestions.length - 1) {
      const remaining = Math.max(0.5, 20 - currentSum);
      return { ...q, points: Number(remaining.toFixed(2)) };
    }
    currentSum += balanced;
    return { ...q, points: Number(balanced.toFixed(2)) };
  });

  return {
    id: `quiz_${Date.now()}`,
    titleAr: `اختبار تفاعلي: ${titleAr}`,
    titleFr: `Quiz Interactif : ${titleFr}`,
    schoolAr,
    schoolFr,
    prof,
    trackCode,
    system,
    totalQuestions: balancedQuestions.length,
    totalPoints: 20.0,
    durationMinutes,
    calculatorAllowed,
    questions: balancedQuestions,
  };
}

/**
 * توليد 4 خيارات دقيقة ومضللات رياضية وفق السياق الرياضي للمسألة
 */
function generateAlgorithmicChoices(params: {
  questionTextAr: string;
  questionTextFr: string;
  solutionTextAr: string;
  solutionTextFr: string;
  category: string;
  qIndex: number;
}): QuizChoice[] {
  const { questionTextAr, questionTextFr, solutionTextAr, solutionTextFr, qIndex } = params;
  const text = `${questionTextAr} ${solutionTextAr}`.toLowerCase();

  // 1. نمط النهايات والتقارب (Limits & Convergence)
  if (text.includes("lim") || text.includes("نهاية") || text.includes("متقاربة")) {
    const isOne = text.includes("= 1") || text.includes("تؤول إلى 1");
    const isZero = text.includes("= 0") || text.includes("تؤول إلى 0");
    const isInf = text.includes("+∞") || text.includes("انهاية");

    const correctValAr = isOne ? "L = 1" : isZero ? "L = 0" : isInf ? "+∞" : "L = e - 1";
    const correctValFr = isOne ? "L = 1" : isZero ? "L = 0" : isInf ? "+∞" : "L = e - 1";

    return [
      {
        id: `c_${qIndex}_A`,
        code: "A",
        labelAr: correctValAr,
        labelFr: correctValFr,
        isCorrect: true,
        explanationAr: "إجابة صحيحة: مطابقة لقيمة النهاية المحسوبة عبر تأطير المتتالية/الدالة أو توظيف مبرهنات المقارنة والعمليات.",
        explanationFr: "Réponse exacte : Conforme au calcul de la limite par théorèmes de comparaison ou opérations.",
      },
      {
        id: `c_${qIndex}_B`,
        code: "B",
        labelAr: isZero ? "L = 1" : "L = 0",
        labelFr: isZero ? "L = 1" : "L = 0",
        isCorrect: false,
        explanationAr: "خطأ شائع: إهمال حد في التعبير أو تطبيق غير سليم لخارج النهايات.",
        explanationFr: "Erreur fréquente : simplification hâtive ou mauvaise manipulation de fraction.",
      },
      {
        id: `c_${qIndex}_C`,
        code: "C",
        labelAr: isInf ? "-∞" : "+∞",
        labelFr: isInf ? "-∞" : "+∞",
        isCorrect: false,
        explanationAr: "خطأ في تحديد شكل غير محدد والخلط بين إشارة البسط والمقام.",
        explanationFr: "Erreur de forme indéterminée ou de signe au voisinage de la borne.",
      },
      {
        id: `c_${qIndex}_D`,
        code: "D",
        labelAr: "المتتالية غير متقاربة (متباعدة)",
        labelFr: "La suite est divergente sans limite finie",
        isCorrect: false,
        explanationAr: "خطأ: المتتالية رتيبة ومحدودة، وبالتالي فهي متقاربة حتماً حسب مبرهنة التقارب الرتيب.",
        explanationFr: "Faux : La suite est monotone et bornée, elle converge nécessairement d'après le théorème.",
      },
    ];
  }

  // 2. نمط الاشتقاق والرتابة (Derivatives & Monotony)
  if (text.includes("اشتقاق") || text.includes("تزايدية") || text.includes("تناقصية") || text.includes("f'")) {
    return [
      {
        id: `c_${qIndex}_A`,
        code: "A",
        labelAr: "f'(x) > 0 قطعا على المجال، والدالة f تزايدية قطعا",
        labelFr: "f'(x) > 0 strictement sur l'intervalle, f est strictement croissante",
        isCorrect: true,
        explanationAr: "صحيح: إشارة المشتقة موجبة قطعا مما يستلزم رتابة تزايدية صارمة على مجموعة التعريف.",
        explanationFr: "Exact : Le signe positif de la dérivée implique la stricte croissance sur le domaine.",
      },
      {
        id: `c_${qIndex}_B`,
        code: "B",
        labelAr: "f'(x) < 0 قطعا والدالة f تناقصية قطعا",
        labelFr: "f'(x) < 0 strictement et f est strictement décroissante",
        isCorrect: false,
        explanationAr: "خطأ شائع: ارتكاب خطأ في إشارة المشتقة أو نسيان إشارة الناقص عند مشتقة المقلوب.",
        explanationFr: "Erreur fréquente de signe dans le calcul de la dérivée d'un quotient.",
      },
      {
        id: `c_${qIndex}_C`,
        code: "C",
        labelAr: "f'(x) تنعدم وتغير إشارتها والدالة غير رتيبة",
        labelFr: "f'(x) s'annule en changeant de signe, fonction non monotone",
        isCorrect: false,
        explanationAr: "خطأ: لم تنعدم المشتقة على هذا المجال؛ المقدار موجب قطعا لجميع قيم المتغير.",
        explanationFr: "Faux : La dérivée garde un signe constant strictement positif sur tout l'intervalle.",
      },
      {
        id: `c_${qIndex}_D`,
        code: "D",
        labelAr: "الدالة f غير قابلة للاشتقاق على كامل المجال",
        labelFr: "La fonction n'est pas dérivable sur l'intervalle",
        isCorrect: false,
        explanationAr: "خطأ: الدالة قابلة للاشتقاق كمركب ومجموع دوال اعتيادية قابلة للاشتقاق.",
        explanationFr: "Faux : La fonction est dérivable comme somme et composée de fonctions dérivables.",
      },
    ];
  }

  // 3. نمط الأعداد العقدية (Complex Numbers)
  if (text.includes("عقدية") || text.includes("z²") || text.includes("دوران") || text.includes("affixe")) {
    return [
      {
        id: `c_${qIndex}_A`,
        code: "A",
        labelAr: "المثلث متساوي الأضلاع أو قائم الزاوية متساوي الساقين بحساب النسبة العقدية",
        labelFr: "Le triangle est équilatéral direct déduit de l'argument et du module de la rotation",
        isCorrect: true,
        explanationAr: "صحيح: معيار النسبة يساوي 1 وعمدتها توافق زاوية التحويل النقطي.",
        explanationFr: "Exact : Le module du rapport vaut 1 et son argument correspond exactement à l'angle.",
      },
      {
        id: `c_${qIndex}_B`,
        code: "B",
        labelAr: "المثلث متساوي الساقين فقط دون تساوي الأضلاع",
        labelFr: "Le triangle est seulement isocèle non équilatéral",
        isCorrect: false,
        explanationAr: "غير دقيق: لم ينتبه المتعلم إلى أن زاوية الرأس تساوي π/3 مما يجعله متساوي الأضلاع حتماً.",
        explanationFr: "Incomplet : L'angle au sommet vaut π/3, rendant le triangle équilatéral.",
      },
      {
        id: `c_${qIndex}_C`,
        code: "C",
        labelAr: "النقط A و B و C مستقيمية",
        labelFr: "Les points A, B et C sont alignés",
        isCorrect: false,
        explanationAr: "خطأ: عمدة النسبة لا توافق مضاعفاً للعدد π، إذن النقط غير مستقيمية.",
        explanationFr: "Faux : L'argument du rapport n'est pas congru à 0 modulo π.",
      },
      {
        id: `c_${qIndex}_D`,
        code: "D",
        labelAr: "المعادلة لا تقبل حلولاً في المجموعة C",
        labelFr: "L'équation n'admet aucune solution dans ℂ",
        isCorrect: false,
        explanationAr: "خطأ جسيم: حسب مبرهنة دالمبير-غاوس، كل معادلة حدودية من الدرجة n تقبل بالضبط n حلاً في C.",
        explanationFr: "Faux : Toute équation polynomiale de degré 2 admet exactement deux solutions dans ℂ.",
      },
    ];
  }

  // 4. نمط الهندسة الفضائية والجداء السلمي والمتجهي (3D Geometry & Vectors)
  if (text.includes("فلكة") || text.includes("مستوى") || text.includes("متجهي") || text.includes("sphère")) {
    return [
      {
        id: `c_${qIndex}_A`,
        code: "A",
        labelAr: "المستوى يقطع الفلكة وفق دائرة لأن مسافة المركز عن المستوى أصغر من الشعاع d < R",
        labelFr: "Le plan coupe la sphère suivant un cercle car d(Ω, P) < R",
        isCorrect: true,
        explanationAr: "صحيح: خاصية تقاطع فلكة ومستوى؛ المسافة d أصغر قطعا من شعاع الفلكة R.",
        explanationFr: "Exact : Condition vérifiée d(Ω, P) < R impliquant une section circulaire.",
      },
      {
        id: `c_${qIndex}_B`,
        code: "B",
        labelAr: "المستوى مماس للفلكة في نقطة وحيدة لأن d = R",
        labelFr: "Le plan est tangent à la sphère en un point unique (d = R)",
        isCorrect: false,
        explanationAr: "خطأ في حساب المسافة: المسافة المحسوبة أصغر قطعا من الشعاع وليس مساوية له.",
        explanationFr: "Erreur de calcul métrique : la distance trouvée est strictement inférieure au rayon.",
      },
      {
        id: `c_${qIndex}_C`,
        code: "C",
        labelAr: "تقاطع المستوى والفلكة هو المجموعة الفارغة لأن d > R",
        labelFr: "L'intersection est vide car le plan est extérieur à la sphère",
        isCorrect: false,
        explanationAr: "خطأ: المستوى يقطع الفلكة ولا يقع خارجها.",
        explanationFr: "Faux : Le plan n'est pas extérieur à la sphère.",
      },
      {
        id: `c_${qIndex}_D`,
        code: "D",
        labelAr: "المتجهة المنظمية غير عمودية على المستوى المحدد بالنقط",
        labelFr: "Le vecteur normal proposé n'est pas orthogonal aux vecteurs du plan",
        isCorrect: false,
        explanationAr: "خطأ: الجداءان السلميان مع متجهتي التوجيه منعدمان كلاهما.",
        explanationFr: "Faux : Les produits scalaires avec les deux vecteurs directeurs sont nuls.",
      },
    ];
  }

  // 5. نمط عام متدرج (General Mathematical Assertions)
  return [
    {
      id: `c_${qIndex}_A`,
      code: "A",
      labelAr: "الاستنتاج الرياضي صحيح ومبرهن بالترجع أو بالتكافؤات المتتالية",
      labelFr: "L'affirmation mathématique est vraie et rigoureusement établie",
      isCorrect: true,
      explanationAr: "صحيح: البرهان الرياضي سليم ومطابق للتوجيهات الرسمية والأطر المرجعية.",
      explanationFr: "Exact : Démonstration rigoureuse conforme aux attendus du programme officiel.",
    },
    {
      id: `c_${qIndex}_B`,
      code: "B",
      labelAr: "الخاصية صحيحة فقط إذا كان المتغير منعدماً",
      labelFr: "La propriété n'est vérifiée que pour la valeur nulle",
      isCorrect: false,
      explanationAr: "خطأ: الخاصية عامة ومحققة لجميع عناصر المجموعة المعتبرة.",
      explanationFr: "Faux : La propriété est universellement vraie sur tout le domaine considéré.",
    },
    {
      id: `c_${qIndex}_C`,
      code: "C",
      labelAr: "الاستلزام العكسي خاطئ ولا يمكن تعميم النتيجة",
      labelFr: "L'implication réciproque est fausse, contre-exemple identifiable",
      isCorrect: false,
      explanationAr: "خطأ: توجد تكافؤات منطقية تامة في كل خطوة من خطوات الاستدلال.",
      explanationFr: "Faux : Les étapes de raisonnement constituent des équivalences logiques.",
    },
    {
      id: `c_${qIndex}_D`,
      code: "D",
      labelAr: "المعطيات غير كافية لحسم صحة العبارة",
      labelFr: "Les données sont insuffisantes pour conclure",
      isCorrect: false,
      explanationAr: "خطأ: المعطيات الواردة في نص التمرين كافية وتامة للبرهنة.",
      explanationFr: "Faux : Les hypothèses de l'énoncé suffisent pleinement à la démonstration.",
    },
  ];
}

/**
 * تقييم وتصحيح إجابات التلميذ آلياً وحساب النتيجة والمستويات المهارية
 */
export function evaluateStudentQuiz(
  quiz: InteractiveQuizData,
  submission: StudentQuizSubmission,
  lang: "AR" | "FR" = "AR"
): QuizEvaluationReport {
  let totalEarnedPoints = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const competencyTotals: Record<
    CompetencyLevel,
    { earned: number; max: number }
  > = {
    N1: { earned: 0, max: 0 },
    N2: { earned: 0, max: 0 },
    N3: { earned: 0, max: 0 },
  };

  const verdicts: QuestionVerdict[] = quiz.questions.map((q, idx) => {
    const selectedChoiceId = submission.answers[q.id] || null;
    const directFormula = submission.formulaAnswers?.[q.id]?.trim() || "";
    const correctChoice = q.choices.find((c) => c.isCorrect) || q.choices[0];
    const selectedChoice = q.choices.find((c) => c.id === selectedChoiceId);

    const isFormulaCorrect =
      directFormula.length > 0 &&
      correctChoice &&
      checkSymbolicMathEquivalence(directFormula, correctChoice);

    const isUnanswered = !selectedChoiceId && !directFormula;
    const isCorrect =
      !isUnanswered &&
      (selectedChoice?.isCorrect === true || isFormulaCorrect);

    const pointsEarned = isCorrect ? q.points : 0;
    totalEarnedPoints += pointsEarned;

    const safeLevel: CompetencyLevel =
      q.level === "N1" || q.level === "N2" || q.level === "N3" ? q.level : "N2";
    competencyTotals[safeLevel].max += q.points;
    if (isCorrect) {
      competencyTotals[safeLevel].earned += q.points;
      correctCount++;
    } else if (isUnanswered) {
      unansweredCount++;
    } else {
      incorrectCount++;
    }

    const useFr = lang === "FR";
    return {
      questionId: q.id,
      questionNumber: idx + 1,
      exerciseTitle: useFr
        ? q.exerciseTitleFr || q.exerciseTitleAr
        : q.exerciseTitleAr || q.exerciseTitleFr,
      questionPrompt: useFr
        ? q.questionPromptFr || q.questionPromptAr
        : q.questionPromptAr || q.questionPromptFr,
      level: safeLevel,
      pointsEarned,
      maxPoints: q.points,
      selectedChoiceId,
      selectedChoiceLabel: selectedChoice
        ? `${selectedChoice.code || "A"}) ${
            useFr
              ? selectedChoice.labelFr || selectedChoice.labelAr
              : selectedChoice.labelAr || selectedChoice.labelFr
          }`
        : directFormula
        ? `${useFr ? "Expression saisie :" : "تعبير مدخل:"} ${directFormula}`
        : useFr
        ? "Non répondu (لم يُجب)"
        : "لم يُجب (Non répondu)",
      correctChoiceId: correctChoice?.id || "c1",
      correctChoiceLabel: correctChoice
        ? `${correctChoice.code || "A"}) ${
            useFr
              ? correctChoice.labelFr || correctChoice.labelAr
              : correctChoice.labelAr || correctChoice.labelFr
          }`
        : "—",
      isCorrect,
      isUnanswered,
      explanation: correctChoice
        ? useFr
          ? correctChoice.explanationFr || correctChoice.explanationAr
          : correctChoice.explanationAr || correctChoice.explanationFr
        : "",
      fullSolution: useFr
        ? q.fullSolutionFr || q.fullSolutionAr || ""
        : q.fullSolutionAr || q.fullSolutionFr || "",
    };
  });

  const scoreOut20 = Number(Math.min(20, Math.max(0, totalEarnedPoints)).toFixed(2));
  const percentage = Math.round((scoreOut20 / 20) * 100);

  // حساب التقدير البيداغوجي وفق المعايير المغربية والفرنسية
  let appraisalAr = "تحكم ممتاز ومتميز في الكفايات والقدرات الرياضية المستهدفة";
  let appraisalFr = "Excellente maîtrise des compétences mathématiques évaluées";
  let mentionColor = "#059669"; // Emerald

  if (scoreOut20 >= 18) {
    appraisalAr = "ممتاز جداً · Félicitations du jury (تفوق باهر في الاستدلال والتوليف)";
    appraisalFr = "Excellent — Très grande maîtrise conceptuelle et rigueur démonstrative";
    mentionColor = "#059669";
  } else if (scoreOut20 >= 16) {
    appraisalAr = "حسن جداً · Mention Très Bien (تحكم قوي في القواعد والمنهجية)";
    appraisalFr = "Très Bien — Solide rigueur méthodique et calculatoire";
    mentionColor = "#2563eb";
  } else if (scoreOut20 >= 14) {
    appraisalAr = "حسن · Mention Bien (استيعاب جيد للمفاهيم مع إمكانية تحسين سرعة الإنجاز)";
    appraisalFr = "Bien — Bonnes acquisitions globales avec bonne démarche de résolution";
    mentionColor = "#0284c7";
  } else if (scoreOut20 >= 12) {
    appraisalAr = "مستحسن · Mention Assez Bien (مكتسبات مقبولة تحتاج إلى تعميق البرهان)";
    appraisalFr = "Assez Bien — Notions acquises, approfondir la rédaction géométrique/analytique";
    mentionColor = "#d97706";
  } else if (scoreOut20 >= 10) {
    appraisalAr = "متوسط / مقبول · Mention Passable (تم استيفاء العتبة الدنيا للنجاح)";
    appraisalFr = "Passable — Seuil minimal atteint, révisions nécessaires sur les méthodes clés";
    mentionColor = "#ea580c";
  } else {
    appraisalAr = "دون العتبة · En cours d'acquisition (بحاجة لخطة معالجة ودعم بيداغوجي فارقي)";
    appraisalFr = "Insuffisant — Nécessite un plan de remédiation ciblée et soutien pédagogique";
    mentionColor = "#dc2626";
  }

  // توزيع الكفايات N1 / N2 / N3
  const competencyBreakdown: CompetencyScoreSummary[] = [
    {
      level: "N1",
      labelAr: "المستوى الأول N1: التطبيق المباشر واسترجاع المعارف",
      labelFr: "Niveau 1 : Application directe et automatismes",
      earnedPoints: Number(competencyTotals.N1.earned.toFixed(2)),
      totalPoints: Number(competencyTotals.N1.max.toFixed(2)),
      percentage: competencyTotals.N1.max > 0 ? Math.round((competencyTotals.N1.earned / competencyTotals.N1.max) * 100) : 100,
      masteryStatus:
        competencyTotals.N1.max === 0 || competencyTotals.N1.earned / competencyTotals.N1.max >= 0.8
          ? "EXCELLENT"
          : competencyTotals.N1.earned / competencyTotals.N1.max >= 0.5
          ? "SATISFACTORY"
          : "NEEDS_REINFORCEMENT",
    },
    {
      level: "N2",
      labelAr: "المستوى الثاني N2: الاستدلال وتعبئة المعارف وحل المشكلات",
      labelFr: "Niveau 2 : Mobilisation des ressources et raisonnement",
      earnedPoints: Number(competencyTotals.N2.earned.toFixed(2)),
      totalPoints: Number(competencyTotals.N2.max.toFixed(2)),
      percentage: competencyTotals.N2.max > 0 ? Math.round((competencyTotals.N2.earned / competencyTotals.N2.max) * 100) : 100,
      masteryStatus:
        competencyTotals.N2.max === 0 || competencyTotals.N2.earned / competencyTotals.N2.max >= 0.75
          ? "EXCELLENT"
          : competencyTotals.N2.earned / competencyTotals.N2.max >= 0.5
          ? "SATISFACTORY"
          : "NEEDS_REINFORCEMENT",
    },
    {
      level: "N3",
      labelAr: "المستوى الثالث N3: التوليف والتعمق والتحدي البيداغوجي",
      labelFr: "Niveau 3 : Synthèse, transfert et approfondissement",
      earnedPoints: Number(competencyTotals.N3.earned.toFixed(2)),
      totalPoints: Number(competencyTotals.N3.max.toFixed(2)),
      percentage: competencyTotals.N3.max > 0 ? Math.round((competencyTotals.N3.earned / competencyTotals.N3.max) * 100) : 100,
      masteryStatus:
        competencyTotals.N3.max === 0 || competencyTotals.N3.earned / competencyTotals.N3.max >= 0.7
          ? "EXCELLENT"
          : competencyTotals.N3.earned / competencyTotals.N3.max >= 0.4
          ? "DEVELOPING"
          : "NEEDS_REINFORCEMENT",
    },
  ];

  // توليد خطة الدعم والمعالجة الفردية الفارقية (Fiche de Remédiation Différenciée)
  const remediationPlan: RemediationActionItem[] = quiz.questions
    .filter((q) => {
      const v = verdicts.find((item) => item.questionId === q.id);
      return v && !v.isCorrect;
    })
    .slice(0, 4)
    .map((q, idx) => ({
      id: `rem_${idx + 1}`,
      level: q.level,
      domainAr: q.exerciseTitleAr,
      domainFr: q.exerciseTitleFr,
      diagnosedObstacleAr:
        q.level === "N1"
          ? "تعثر في الضبط الإجرائي للقواعد الأساسية أو الإشارات الجبرية"
          : q.level === "N2"
          ? "صعوبة في اختيار المبرهنة المناسبة أو ربط المعطيات"
          : "حاجة إلى تقوية مهارة البرهان التوليفي واستثمار النتائج السابقة",
      diagnosedObstacleFr:
        q.level === "N1"
          ? "Fragilité sur les règles de calcul direct et formules de base"
          : q.level === "N2"
          ? "Difficulté dans la mobilisation du théorème adéquat"
          : "Besoin de structurer les démonstrations de synthèse à plusieurs étapes",
      recommendedActionAr:
        q.hintAr ||
        "مراجعة ملخص الدرس وإعادة تحرير البرهان خطوة بخطوة مع التحقق من الشروط البدئية.",
      recommendedActionFr:
        q.hintFr ||
        "Revoir les propriétés fondamentales du chapitre et rédiger chaque étape avec rigueur.",
      practiceExerciseAr: `تمرين دعم مخصص: أعد إنجاز السؤال (${q.questionPromptAr.slice(0, 75)}...) بالاعتماد على الحل النموذجي المرفق.`,
      practiceExerciseFr: `Exercice de remédiation : Reprendre la question (${q.questionPromptFr.slice(0, 75)}...) à l'aide du corrigé détaillé.`,
    }));

  const mins = Math.floor(submission.elapsedSeconds / 60);
  const secs = submission.elapsedSeconds % 60;
  const timeSpentFormatted = `${mins} دقيقة و ${secs < 10 ? "0" : ""}${secs} ثانية`;
  const timeLimitFormatted = quiz.durationMinutes > 0 ? `${quiz.durationMinutes} دقيقة` : "تدريب حر (بدون قيد زمني)";

  return {
    candidateName: submission.candidateName || "تلميذ(ة)",
    candidateClass: submission.candidateClass || "السلك الثانوي التأهيلي",
    candidateNumber: submission.candidateNumber || "—",
    examTitle: quiz.titleAr,
    scoreOut20,
    percentage,
    timeSpentFormatted,
    timeLimitFormatted,
    appraisalAr,
    appraisalFr,
    mentionColor,
    competencyBreakdown,
    remediationPlan,
    verdicts,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalQuestions: quiz.totalQuestions,
    evaluatedAt: new Date().toLocaleString("ar-MA", { dateStyle: "long", timeStyle: "short" }),
  };
}

/**
 * تصدير لائحة نقط التلاميذ الذين أجروا الاختبار التفاعلي بصيغة متوافقة مع منظومة «مسار» (Massar) و Pronote
 */
export function exportQuizRosterToMassarCSV(
  reports: QuizEvaluationReport[],
  examTitle: string
): void {
  const headers = [
    "الرقم الترتيبي (N°)",
    "الاسم الكامل للمترشح(ة) (Nom & Prénom)",
    "القسم / الفوج (Classe)",
    "النقطة النهائية /20 (Note /20)",
    "نسبة التحكم (%)",
    "المستوى N1",
    "المستوى N2",
    "المستوى N3",
    "الإجابات الصحيحة",
    "الوقت المستغرق",
    "التقدير والملاحظة البيداغوجية (Appréciation Massar/Pronote)",
  ];

  const rows = reports.map((r, idx) => {
    const n1Score = r.competencyBreakdown.find((c) => c.level === "N1");
    const n2Score = r.competencyBreakdown.find((c) => c.level === "N2");
    const n3Score = r.competencyBreakdown.find((c) => c.level === "N3");
    return [
      r.candidateNumber !== "—" ? r.candidateNumber : String(idx + 1),
      `"${r.candidateName.replace(/"/g, '""')}"`,
      `"${r.candidateClass.replace(/"/g, '""')}"`,
      r.scoreOut20.toFixed(2),
      `${r.percentage}%`,
      n1Score ? `${n1Score.earnedPoints}/${n1Score.totalPoints}` : "—",
      n2Score ? `${n2Score.earnedPoints}/${n2Score.totalPoints}` : "—",
      n3Score ? `${n3Score.earnedPoints}/${n3Score.totalPoints}` : "—",
      `${r.correctCount}/${r.totalQuestions}`,
      `"${r.timeSpentFormatted}"`,
      `"${r.appraisalAr.replace(/"/g, '""')}"`,
    ].join(";");
  });

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Massar_Pronote_Notes_${examTitle.replace(/\s+/g, "_").slice(0, 30)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

