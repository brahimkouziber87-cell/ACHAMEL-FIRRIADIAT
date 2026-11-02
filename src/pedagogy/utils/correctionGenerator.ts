import {
  ConfiguredSerieExercise,
  getQuestionBaremesAndLevels,
  LessonItem,
  SerieExerciseBlock,
} from "../data/curriculum";

export interface QuestionSolution {
  questionNumber: string;
  questionText: string;
  solutionTextAr: string;
  solutionTextFr: string;
  bareme: string; // e.g. "0.75 pt"
  baremeBreakdownAr: string[];
  baremeBreakdownFr: string[];
  pedagogicalNoteAr?: string;
  pedagogicalNoteFr?: string;
}

export interface ExerciseCorrection {
  exerciseIndex: number;
  exerciseTitleAr: string;
  exerciseTitleFr: string;
  totalPoints: string;
  weight: number;
  solutions: QuestionSolution[];
  generalAdviceAr: string;
  generalAdviceFr: string;
}

/**
 * يولد نموذج التصحيح المفصل وسلم التنقيط البيداغوجي وفق معايير الأطر المرجعية المغربية ومواقع الرياضيات (AlloSchool, Moutamadris)
 */
export function generateExerciseCorrection(
  lesson: LessonItem,
  exerciseIndex: number,
  model: "A" | "B" | "C" | "D" | string = "A",
  questionsAr: string[] = [],
  questionsFr: string[] = []
): ExerciseCorrection {
  const titleFr = lesson.lessonFr.toLowerCase();
  const titleAr = lesson.lessonAr;
  const weight = lesson.weight || 25;
  const totalPoints = ((weight * 20) / 100).toFixed(1);

  const solutions: QuestionSolution[] = [];

  const activeCustomSolAr =
    model === "B" && lesson.sampleSolutionModelB_Ar && lesson.sampleSolutionModelB_Ar.length > 0
      ? lesson.sampleSolutionModelB_Ar
      : lesson.sampleSolutionAr;
  const activeCustomSolFr =
    model === "B" && lesson.sampleSolutionModelB_Fr && lesson.sampleSolutionModelB_Fr.length > 0
      ? lesson.sampleSolutionModelB_Fr
      : lesson.sampleSolutionFr;

  if (
    (activeCustomSolAr && activeCustomSolAr.length > 0) ||
    (activeCustomSolFr && activeCustomSolFr.length > 0)
  ) {
    const count = Math.max(
      questionsAr.length,
      questionsFr.length,
      activeCustomSolAr?.length || 0,
      activeCustomSolFr?.length || 0
    );
    const totalPtsNum = (weight * 20) / 100;
    const defaultPerQ = Math.max(0.25, Math.round((totalPtsNum / Math.max(1, count)) * 4) / 4);

    for (let i = 0; i < count; i++) {
      const qPts =
        lesson.customQuestionBaremes && lesson.customQuestionBaremes[i] !== undefined
          ? lesson.customQuestionBaremes[i]
          : defaultPerQ;
      const sAr =
        activeCustomSolAr?.[i] ||
        activeCustomSolFr?.[i] ||
        `تطبيق الخاصية المبرمجة في درس « ${titleAr} » واستنتاج النتيجة المطلوبة بدقة.`;
      const sFr =
        activeCustomSolFr?.[i] ||
        activeCustomSolAr?.[i] ||
        `Application rigoureuse du théorème du chapitre « ${lesson.lessonFr} » et conclusion.`;

      solutions.push({
        questionNumber: `${i + 1}`,
        questionText: questionsFr[i] || questionsAr[i] || `Question ${i + 1}`,
        solutionTextAr: sAr,
        solutionTextFr: sFr,
        bareme: `${Number(qPts).toFixed(2).replace(/\.00$/, ".0").replace(/(\.\d)0$/, "$1")} pt`,
        baremeBreakdownAr: [
          `${(qPts * 0.35).toFixed(2)} ن : صياغة القاعدة أو الخاصية الرياضية المناسبة`,
          `${(qPts * 0.4).toFixed(2)} ن : سلامة المراحل الحسابية والاستدلال المنطقي`,
          `${(qPts * 0.25).toFixed(2)} ن : تأطير النتيجة النهائية ومطابقتها للمطلوب`,
        ],
        baremeBreakdownFr: [
          `${(qPts * 0.35).toFixed(2)} pt : Énoncé de la propriété ou méthode adéquate`,
          `${(qPts * 0.4).toFixed(2)} pt : Exactitude des calculs et enchaînement logique`,
          `${(qPts * 0.25).toFixed(2)} pt : Formulation et encadrement du résultat final`,
        ],
        pedagogicalNoteAr: lesson.isImportedSimulation
          ? "محاكاة فرض مستورد: تقبل كل طريقة مكافئة تؤدي إلى نفس النتيجة مع احترام تدرج سلم التنقيط."
          : undefined,
        pedagogicalNoteFr: lesson.isImportedSimulation
          ? "Simulation DS importé : Toute méthode équivalente rigoureuse reçoit la totalité des points."
          : undefined,
      });
    }

    return {
      exerciseIndex,
      exerciseTitleAr: titleAr,
      exerciseTitleFr: lesson.lessonFr,
      totalPoints,
      weight,
      solutions,
      generalAdviceAr:
        "عناصر إجابة وسلم تنقيط مفصل مستخرج ومُحاكى وفق بنية الفرض المحروس المستورد والأطر المرجعية الوطنية (142-08).",
      generalAdviceFr:
        "Corrigé type et barème détaillé générés par simulation conforme à la structure du Devoir Surveillé importé.",
    };
  }

  if (titleFr.includes("arithm") || titleAr.includes("حسابيات")) {
    const isModelA = model === "A";
    solutions.push({
      questionNumber: "1",
      questionText: questionsFr[0] || questionsAr[0] || "Étude de parité",
      solutionTextAr: isModelA
        ? `دراسة زوجية $A = n^2 + 3n + 4$ :
نكتب $A = n(n + 3) + 4$.
- الحالة الأولى: إذا كان $n$ زوجياً ($n = 2k$)، فإن $n(n+3) = 2k(2k+3) = 2K$ عدد زوجي.
- الحالة الثانية: إذا كان $n$ فردياً ($n = 2k+1$)، فإن $n+3 = 2k+4 = 2(k+2)$ عدد زوجي، وبالتالي $n(n+3)$ عدد زوجي.
في كلتا الحالتين، $n(n+3)$ زوجي، وبما أن 4 زوجي، فإن $A$ مجموع عددين زوجيين، إذن $A$ زوجي قطعا لكل $n \\in \\mathbb{N}$.`
        : `دراسة زوجية $A = n^2 + 5n + 6$ :
نلاحظ أن $A = (n+2)(n+3)$.
بما أن $(n+2)$ و $(n+3)$ عددان صحيحان طبيعيان متتاليان، فإن جداءهما دائماً عدد زوجي (أحدهما بالضرورة مضاعف لـ 2).
إذن $A$ زوجي قطعا لكل $n \\in \\mathbb{N}$.`,
      solutionTextFr: isModelA
        ? `Étude de la parité de $A = n^2 + 3n + 4$ :
On factorise partiellement : $A = n(n + 3) + 4$.
- 1er cas : Si $n$ est pair ($n = 2k$), alors $n(n+3)$ est pair comme multiple de 2.
- 2ème cas : Si $n$ est impair ($n = 2k+1$), alors $n+3 = 2k+4 = 2(k+2)$ est pair, donc $n(n+3)$ est pair.
Conclusion : Le produit de deux entiers de parités différentes ou de même parité donne $n(n+3)$ pair. Comme 4 est pair, la somme $A$ est strictement paire pour tout $n \\in \\mathbb{N}$.`
        : `Étude de la parité de $A = n^2 + 5n + 6$ :
On remarque la factorisation $A = (n+2)(n+3)$.
Comme $(n+2)$ et $(n+3)$ sont deux entiers consécutifs, leur produit est obligatoirement pair.
Par conséquent, $A$ est un nombre pair pour tout entier naturel $n$.`,
      bareme: "1.00 pt",
      baremeBreakdownAr: [
        "0.25 ن : صياغة التفكيك أو فصل الحالات",
        "0.50 ن : تبرير زوجية الجداء $n(n+3)$ أو الجداء المتتالي",
        "0.25 ن : الاستنتاج النهائي بأن $A$ زوجي",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Écriture de la factorisation ou disjonction des cas",
        "0.50 pt : Justification rigoureuse de la parité du produit",
        "0.25 pt : Conclusion conforme pour tout $n \\in \\mathbb{N}$",
      ],
      pedagogicalNoteAr: "ملاحظة للأستاذ: تقبل أي طريقة صحيحة مثل كتابة $A = n(n+1) + 2n + 4$.",
      pedagogicalNoteFr: "Remarque correcteur : Valider toute méthode exacte (ex: produit d'entiers consécutifs).",
    });

    solutions.push({
      questionNumber: "2",
      questionText: questionsFr[1] || questionsAr[1] || "Décomposition PGCD et PPCM",
      solutionTextAr: isModelA
        ? `تفكيك العددين $a = 540$ و $b = 378$ :
- $540 = 54 \\times 10 = 2 \\times 3^3 \\times 2 \\times 5 = 2^2 \\times 3^3 \\times 5$
- $378 = 2 \\times 189 = 2 \\times 3^3 \\times 7$
حساب القاسم المشترك الأكبر $PGCD(a,b)$ :
نأخذ العوامل الأولية المشتركة ذات الأصغر أس : $PGCD(540, 378) = 2^1 \\times 3^3 = 2 \\times 27 = 54$.
حساب المضاعف المشترك الأصغر $PPCM(a,b)$ :
نأخذ العوامل الأولية المشتركة وغير المشتركة ذات الأكبر أس :
$PPCM(540, 378) = 2^2 \\times 3^3 \\times 5 \\times 7 = 4 \\times 27 \\times 35 = 3780$.
(التحقق: $PGCD \\times PPCM = 54 \\times 3780 = 204120 = 540 \\times 378$).`
        : `تفكيك العددين $a = 720$ و $b = 504$ :
- $720 = 2^4 \\times 3^2 \\times 5$
- $504 = 2^3 \\times 3^2 \\times 7$
حساب $PGCD(a,b) = 2^3 \\times 3^2 = 8 \\times 9 = 72$.
حساب $PPCM(a,b) = 2^4 \\times 3^2 \\times 5 \\times 7 = 16 \\times 9 \\times 35 = 5040$.`,
      solutionTextFr: isModelA
        ? `Décomposition en facteurs premiers :
- $a = 540 = 2^2 \\times 3^3 \\times 5$
- $b = 378 = 2 \\times 3^3 \\times 7$
Calcul du PGCD : facteurs premiers communs avec le plus petit exposant :
$\\text{PGCD}(540, 378) = 2^1 \\times 3^3 = 54$.
Calcul du PPCM : facteurs communs et non communs avec le plus grand exposant :
$\\text{PPCM}(540, 378) = 2^2 \\times 3^3 \\times 5 \\times 7 = 3780$.`
        : `Décomposition en facteurs premiers :
- $a = 720 = 2^4 \\times 3^2 \\times 5$
- $b = 504 = 2^3 \\times 3^2 \\times 7$
$\\text{PGCD}(720, 504) = 2^3 \\times 3^2 = 72$.
$\\text{PPCM}(720, 504) = 2^4 \\times 3^2 \\times 5 \\times 7 = 5040$.`,
      bareme: "1.25 pt",
      baremeBreakdownAr: [
        "0.50 ن : التفكيك السليم للعددين إلى جداء عوامل أولية",
        "0.375 ن : تحديد قيمة PGCD مع القاعدة",
        "0.375 ن : تحديد قيمة PPCM مع القاعدة",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Décompositions exactes en puissances de premiers",
        "0.375 pt : Détermination et calcul du PGCD",
        "0.375 pt : Détermination et calcul du PPCM",
      ],
    });

    solutions.push({
      questionNumber: "3",
      questionText: questionsFr[2] || questionsAr[2] || "Divisibilité (n+11) | (2n+30)",
      solutionTextAr: isModelA
        ? `تحديد قيم $n \\in \\mathbb{N}$ بحيث $(n+11)$ يقسم $(2n+30)$ :
لدينا $(n+11)$ يقسم $(2n+30)$، وبما أن $(n+11)$ يقسم دائماً $2(n+11) = 2n+22$.
إذن $(n+11)$ يقسم الفرق : $(2n+30) - (2n+22) = 8$.
وبالتالي $(n+11)$ ينتمي لمجموعة قواسم 8 الموجبة : $\\mathcal{D}_8 = \\{1, 2, 4, 8\\}$.
بما أن $n \\in \\mathbb{N}$ فإن $n + 11 \\ge 11$.
وحيث أن أكبر قاسم للعدد 8 هو 8 وأصغر من 11، فإنه لا يوجد أي عدد صحيح طبيعي $n$ يحقق هذا الشرط.
مجموعة الحلول : $S = \\emptyset$.`
        : `تحديد قيم $n \\in \\mathbb{N}$ بحيث $(n+9)$ يقسم $(2n+26)$ :
لدينا $(n+9)$ يقسم $(2n+26) - 2(n+9) = 2n+26 - (2n+18) = 8$.
إذن $(n+9) \\in \\{1, 2, 4, 8\\}$.
بما أن $n \\ge 0 \\Rightarrow n+9 \\ge 9 > 8$. إذن لا يوجد حل في $\\mathbb{N}$ ($S = \\emptyset$).`,
      solutionTextFr: isModelA
        ? `Condition de divisibilité :
On a $(n+11) \\mid (2n+30)$ et de manière évidente $(n+11) \\mid 2(n+11) = 2n+22$.
Par combinaison linéaire, $(n+11)$ divise leur différence : $(2n+30) - (2n+22) = 8$.
Donc $(n+11) \\in \\text{Div}(8) = \\{1, 2, 4, 8\\}$.
Or, comme $n \\in \\mathbb{N}$, on a $n \\ge 0 \\implies n + 11 \\ge 11$.
Comme aucun diviseur de 8 n'est supérieur ou égal à 11, il n'existe aucun entier naturel $n$ solution.
Conclusion : $\\mathcal{S} = \\emptyset$.`
        : `Condition $(n+9) \\mid (2n+26)$ :
$(n+9) \\mid (2n+26 - 2(n+9)) = 8$.
Or $n \\ge 0 \\implies n+9 \\ge 9 > 8$. L'ensemble des solutions dans $\\mathbb{N}$ est vide : $\\mathcal{S} = \\emptyset$.`,
      bareme: "1.25 pt",
      baremeBreakdownAr: [
        "0.50 ن : استعمال التوافق أو خاصية الفرق للتخلص من المجهول n",
        "0.50 ن : حصر قواسم العدد 8 ومقارنتها مع $n+11$",
        "0.25 ن : استنتاج مجموعة الحلول بدقة",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Élimination de l'inconnue $n$ par combinaison linéaire",
        "0.50 pt : Détermination des diviseurs et encadrement",
        "0.25 pt : Déduction rigoureuse de l'ensemble vide",
      ],
    });
  } else if (titleFr.includes("suite") || titleAr.includes("متتاليات")) {
    const a = model === "A" ? "3" : "4";
    const b = model === "A" ? "2" : "3";
    const u0 = model === "A" ? "1" : "2";

    solutions.push({
      questionNumber: "1",
      questionText: `Démonstration par récurrence : $u_n > 0$ et monotonie`,
      solutionTextAr: `1. البرهان بالترجع أن $u_n > 0$ لكل $n \\in \\mathbb{N}$ :
- من أجل $n = 0$ : لدينا $u_0 = ${u0} > 0$، إذن الخاصية محققة من أجل $n = 0$.
- نفترض أن $u_n > 0$ من أجل عدد صحيح طبيعي $n$ ثابت، ولنبين أن $u_{n+1} > 0$ :
  لدينا $u_{n+1} = \\frac{${a}u_n + ${b}}{u_n + 2}$.
  بما أن $u_n > 0$ (حسب فرضية الترجع)، فإن البسط ${a}u_n + ${b} > 0$ والمقام $u_n + 2 > 0$.
  ومنه خارج عددين موجبين قطعا موجب قطعا، إذن $u_{n+1} > 0$.
- الخلاصة: حسب مبدأ الاستدلال بالترجع، فإن $u_n > 0$ لكل $n \\in \\mathbb{N}$.

2. دراسة رتابة $(u_n)$ :
نحسب الفرق $u_{n+1} - u_n = \\frac{${a}u_n + ${b}}{u_n + 2} - u_n = \\frac{-u_n^2 + (${a}-2)u_n + ${b}}{u_n + 2}$.
إشارة البسط تؤكد أن المتتالية رتيبة ومحدودة، وبالتالي متقاربة.`,
      solutionTextFr: `1. Démonstration par récurrence que $u_n > 0$ pour tout $n \\in \\mathbb{N}$ :
- Initialisation ($n = 0$) : $u_0 = ${u0} > 0$, la proposition est vraie au rang 0.
- Hérédité : Supposons que $u_n > 0$ pour un certain $n \\in \\mathbb{N}$. Montrons que $u_{n+1} > 0$.
  On a $u_{n+1} = \\frac{${a}u_n + ${b}}{u_n + 2}$. Par hypothèse de récurrence, $u_n > 0$, donc ${a}u_n + ${b} > 0$ et $u_n + 2 > 0$.
  Le quotient de deux réels strictement positifs est strictement positif, d'où $u_{n+1} > 0$.
- Conclusion : D'après le principe de récurrence, $\\forall n \\in \\mathbb{N},\\; u_n > 0$.

2. Monotonie et convergence :
Calcul de $u_{n+1} - u_n = \\frac{-u_n^2 + (${Number(a) - 2})u_n + ${b}}{u_n + 2}$.
La suite est monotone et bornée, donc convergente d'après le théorème de convergence monotone.`,
      bareme: "1.50 pt",
      baremeBreakdownAr: [
        "0.25 ن : مرحلة التحقق من الرتبة الأولى (n=0)",
        "0.50 ن : فرضية الترجع وتأطير بسط ومقام $u_{n+1}$",
        "0.25 ن : الاستنتاج وخلاصة الترجع",
        "0.50 ن : حساب الفرق $u_{n+1} - u_n$ واستنتاج التقارب",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Initialisation au rang 0",
        "0.50 pt : Hypothèse de récurrence et signe du quotient",
        "0.25 pt : Conclusion rigoureuse de la récurrence",
        "0.50 pt : Calcul de la différence et convergence",
      ],
      pedagogicalNoteAr: "معيار التصحيح: اشتراط صياغة المراحل الثلاث للترجع كاملة لمنح النقطة كاملة.",
      pedagogicalNoteFr: "Critère de notation : Les 3 étapes de la récurrence doivent être explicitement rédigées.",
    });

    solutions.push({
      questionNumber: "2",
      questionText: `Suite géométrique auxiliaire $(v_n)$ et calcul de limite`,
      solutionTextAr: `نضع $v_n = \\frac{u_n - ${b}}{u_n + 1}$.
1. نبين أن $(v_n)$ متتالية هندسية :
نحسب $v_{n+1} = \\frac{u_{n+1} - ${b}}{u_{n+1} + 1} = \\frac{\\frac{${a}u_n + ${b}}{u_n + 2} - ${b}}{\\frac{${a}u_n + ${b}}{u_n + 2} + 1}$.
نوحد المقامات في البسط والمقام ونختزل بـ $(u_n + 2)$ :
$v_{n+1} = q \\times v_n$.
نستنتج أن $(v_n)$ متتالية هندسية أساسها $q$ وحدها الأول $v_0 = \\frac{u_0 - ${b}}{u_0 + 1}$.
2. تعبير $v_n$ ثم $u_n$ بدلالة $n$ :
$v_n = v_0 \\times q^n$.
بما أن $|q| < 1$، فإن $\\lim_{n \\to +\\infty} q^n = 0$.
نستنتج أن $\\lim_{n \\to +\\infty} u_n = ${b}$.`,
      solutionTextFr: `On pose $v_n = \\frac{u_n - ${b}}{u_n + 1}$.
1. Preuve que $(v_n)$ est géométrique :
$v_{n+1} = \\frac{u_{n+1} - ${b}}{u_{n+1} + 1}$. En remplaçant $u_{n+1}$ par son expression et en réduisant au même dénominateur :
On factorise pour obtenir $v_{n+1} = q \\cdot v_n$.
Donc $(v_n)$ est une suite géométrique de raison $q$ et de premier terme $v_0$.
2. Expression explicite et limite :
$v_n = v_0 \\cdot q^n$. Comme $|q| < 1$, on a $\\lim q^n = 0$.
En inversant la relation pour exprimer $u_n = \\frac{v_n + ${b}}{1 - v_n}$, on conclut que $\\lim_{n \\to +\\infty} u_n = ${b}$.`,
      bareme: "1.50 pt",
      baremeBreakdownAr: [
        "0.50 ن : توحيد المقامات وتبسيط التعبير للوصول لـ $v_{n+1} = q \\cdot v_n$",
        "0.25 ن : استنتاج أساس المتتالية وحدها الأول $v_0$",
        "0.50 ن : التعبير الصريح لـ $u_n$ بدلالة $v_n$ ثم بدلالة $n$",
        "0.25 ن : حساب نهاية المتتالية مع التعليل بـ $\\lim q^n = 0$",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Réduction au même dénominateur et factorisation de $q$",
        "0.25 pt : Détermination de la raison et du premier terme",
        "0.50 pt : Expression de $u_n$ en fonction de $n$",
        "0.25 pt : Calcul de la limite avec justification $|q| < 1$",
      ],
    });
  } else if (titleFr.includes("complexe") || titleAr.includes("عقدية")) {
    const re = model === "A" ? "2" : "4";
    const c = model === "A" ? "4" : "16";
    solutions.push({
      questionNumber: "1",
      questionText: `Résolution de l'équation $z^2 - ${re}\\sqrt{3}z + ${c} = 0$ dans $\\mathbb{C}$`,
      solutionTextAr: `حل المعادلة $z^2 - ${re}\\sqrt{3}z + ${c} = 0$ في $\\mathbb{C}$ :
نحسب مميز المعادلة $\\Delta = b^2 - 4ac$ :
$\\Delta = (-${re}\\sqrt{3})^2 - 4 \\times 1 \\times ${c} = ${Number(re)**2 * 3} - ${4 * Number(c)} = -${4 * Number(c) - Number(re)**2 * 3} < 0$.
بما أن $\\Delta < 0$، فإن المعادلة تقبل حلين عقديين مترافقين في $\\mathbb{C}$ :
$z_1 = \\frac{-b + i\\sqrt{-\\Delta}}{2a} = \\frac{${re}\\sqrt{3} + i\\sqrt{${4 * Number(c) - Number(re)**2 * 3}}}{2} = ${model === "A" ? "\\sqrt{3} + i" : "2\\sqrt{3} + 2i"}$.
$z_2 = \\overline{z_1} = ${model === "A" ? "\\sqrt{3} - i" : "2\\sqrt{3} - 2i"}$.
مجموعة الحلول : $S = \\{${model === "A" ? "\\sqrt{3} - i\\; ;\\; \\sqrt{3} + i" : "2\\sqrt{3} - 2i\\; ;\\; 2\\sqrt{3} + 2i"}\\}$.`,
      solutionTextFr: `Résolution de l'équation $z^2 - ${re}\\sqrt{3}z + ${c} = 0$ dans $\\mathbb{C}$ :
Calcul du discriminant : $\\Delta = (-${re}\\sqrt{3})^2 - 4(1)(${c}) = ${Number(re)**2 * 3} - ${4 * Number(c)} < 0$.
Comme $\\Delta < 0$, l'équation admet deux solutions complexes conjuguées :
$z_1 = \\frac{${re}\\sqrt{3} + i\\sqrt{|\\Delta|}}{2} = ${model === "A" ? "\\sqrt{3} + i" : "2\\sqrt{3} + 2i"}$ et $z_2 = \\overline{z_1}$.
Ensemble des solutions : $\\mathcal{S} = \\{z_1, z_2\\}$.`,
      bareme: "1.00 pt",
      baremeBreakdownAr: [
        "0.25 ن : حساب المميز $\\Delta$ وتحديد إشارته السالبة",
        "0.50 ن : كتابة صيغتي الحلين المترافقين وتطبيقهما عددياً",
        "0.25 ن : كتابة مجموعة الحلول $S$",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Calcul exact de $\\Delta < 0$",
        "0.50 pt : Formules des solutions complexes conjuguées",
        "0.25 pt : Écriture finale de l'ensemble des solutions",
      ],
    });

    solutions.push({
      questionNumber: "2",
      questionText: `Forme trigonométrique et géométrie (Rotation)`,
      solutionTextAr: `1. الشكل المثلثي للعدد $a = \\sqrt{3} + i$ :
المعيار : $|a| = \\sqrt{(\\sqrt{3})^2 + 1^2} = \\sqrt{3 + 1} = 2$.
العمدة : $a = 2\\left(\\frac{\\sqrt{3}}{2} + \\frac{1}{2}i\\right) = 2\\left(\\cos\\frac{\\pi}{6} + i\\sin\\frac{\\pi}{6}\\right) = [2, \\frac{\\pi}{6}] = 2e^{i\\frac{\\pi}{6}}$.
2. صورة النقطة $A$ بالدوران $R(O, \\frac{\\pi}{3})$ :
التمثيل العقدي للدوران : $z' - z_\\Omega = e^{i\\theta}(z - z_\\Omega) \\implies z' = e^{i\\frac{\\pi}{3}} z_A$.
$d = e^{i\\frac{\\pi}{3}} \\times 2e^{i\\frac{\\pi}{6}} = 2e^{i(\\frac{\\pi}{3} + \\frac{\\pi}{6})} = 2e^{i\\frac{\\pi}{2}} = 2i = c$.
إذن النقطة $D$ تنطبق على النقطة $C$.`,
      solutionTextFr: `1. Forme trigonométrique et exponentielle de $a$ :
Module : $|a| = \\sqrt{3 + 1} = 2$.
Argument : $\\cos\\theta = \\frac{\\sqrt{3}}{2}$ et $\\sin\\theta = \\frac{1}{2} \\implies \\theta \\equiv \\frac{\\pi}{6} [2\\pi]$.
Forme trigonométrique : $a = 2\\left(\\cos\\frac{\\pi}{6} + i\\sin\\frac{\\pi}{6}\\right)$, et forme exponentielle : $a = 2e^{i\\frac{\\pi}{6}}$.
2. Image par la rotation $R(O, \\frac{\\pi}{3})$ :
Écriture complexe : $z' = e^{i\\pi/3} z$.
$z_D = e^{i\\pi/3} \\times 2e^{i\\pi/6} = 2e^{i(\\pi/3 + \\pi/6)} = 2e^{i\\pi/2} = 2i = c$.
Le point $D$ est confondu avec $C$.`,
      bareme: "1.25 pt",
      baremeBreakdownAr: [
        "0.25 ن : حساب المعيار بدقة",
        "0.25 ن : تحديد العمدة وكتابة الشكل المثلثي والأسي",
        "0.50 ن : الكتابة العقدية للدوران والتعويض بلحق النقطة A",
        "0.25 ن : الاستنتاج الهندسي لطبيعة المثلث أو تطابق النقطتين",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Calcul du module",
        "0.25 pt : Argument et formes trigonométrique / exponentielle",
        "0.50 pt : Écriture complexe de la rotation",
        "0.25 pt : Déduction géométrique",
      ],
    });
  } else if (titleFr.includes("logarithm") || titleFr.includes("exponentielle") || titleAr.includes("دوال") || titleAr.includes("لوغاريتم")) {
    const k = model === "A" ? "2" : "3";
    solutions.push({
      questionNumber: "1",
      questionText: `Limites aux bornes et interprétation graphique (Asymptotes)`,
      solutionTextAr: `1. النهاية عند $0^+$ :
لدينا $\\lim_{x \\to 0^+} (${k}x - 1) = -1$ و $\\lim_{x \\to 0^+} \\ln(x) = -\\infty$ مع $\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty$.
إذن بالضرب: $\\lim_{x \\to 0^+} \\frac{\\ln(x)}{x} = -\\infty$.
وبالتالي : $\\lim_{x \\to 0^+} f(x) = -\\infty$.
التأويل الهندسي: المستقيم ذو المعادلة $x = 0$ (محور الأراتيب) مقارب عمودي للمنحنى $(C_f)$.
2. النهاية عند $+\\infty$ :
لدينا $\\lim_{x \\to +\\infty} (${k}x - 1) = +\\infty$ ونهاية اعتيادية $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$.
إذن : $\\lim_{x \\to +\\infty} f(x) = +\\infty$.
المقارب المائل: بما أن $\\lim_{x \\to +\\infty} [f(x) - (${k}x - 1)] = \\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$، فإن المستقيم $(\\Delta)$ ذو المعادلة $y = ${k}x - 1$ مقارب مائل للمنحنى $(C_f)$ بجوار $+\\infty$.`,
      solutionTextFr: `1. Limite en $0^+$ et asymptote verticale :
$\\lim_{x \\to 0^+} (${k}x - 1) = -1$ et $\\lim_{x \\to 0^+} \\ln(x) = -\\infty$ avec $\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty$.
Par produit : $\\lim_{x \\to 0^+} \\frac{\\ln x}{x} = -\\infty$, d'où $\\lim_{x \\to 0^+} f(x) = -\\infty$.
Interprétation : La droite d'équation $x = 0$ est une asymptote verticale à la courbe $(C_f)$.
2. Limite en $+\\infty$ et asymptote oblique :
On a la limite usuelle de croissances comparées $\\lim_{x \\to +\\infty} \\frac{\\ln x}{x} = 0$.
Donc $\\lim_{x \\to +\\infty} f(x) = +\\infty$.
Comme $\\lim_{x \\to +\\infty} [f(x) - (${k}x - 1)] = 0$, la droite d'équation $y = ${k}x - 1$ est asymptote oblique à $(C_f)$ au voisinage de $+\\infty$.`,
      bareme: "1.50 pt",
      baremeBreakdownAr: [
        "0.50 ن : حساب نهاية $0^+$ مع التعليل والتأويل الهندسي (مقارب عمودي)",
        "0.50 ن : حساب نهاية $+\\infty$ باستعمال النهاية الاعتيادية $\\lim \\frac{\\ln x}{x} = 0$",
        "0.50 ن : تبرير وجود المقارب المائل $y = ax+b$ بحساب الفرق",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Limite en $0^+$, justification et asymptote verticale",
        "0.50 pt : Limite en $+\\infty$ via croissances comparées",
        "0.50 pt : Asymptote oblique par calcul de limite de $(f(x) - y)$",
      ],
    });

    solutions.push({
      questionNumber: "2",
      questionText: `Dérivée $f'(x)$, tableau de variations et tracé de $(C_f)$`,
      solutionTextAr: `1. حساب المشتقة $f'(x)$ لكل $x > 0$ :
الدالة $f$ قابلة للاشتقاق على $]0, +\\infty[$ كمجموع وخارج دوال اعتيادية قابلة للاشتقاق.
$f'(x) = (${k}x - 1)' + \\left(\\frac{\\ln x}{x}\\right)' = ${k} + \\frac{(\\frac{1}{x})x - (\\ln x)(1)}{x^2} = ${k} + \\frac{1 - \\ln x}{x^2} = \\frac{${k}x^2 + 1 - \\ln x}{x^2}$.
بما أن ${k}x^2 + 1 - \\ln x > 0$ لكل $x > 0$، فإن $f'(x) > 0$ قطعا على $]0, +\\infty[$.
2. جدول التغيرات :
الدالة $f$ تزايدية قطعا على المجال $]0, +\\infty[$.
3. الوضع النسبي وإنشاء المنحنى $(C_f)$ :
دراسة إشارة $f(x) - (${k}x - 1) = \\frac{\\ln x}{x}$ : المنحنى فوق $(\\Delta)$ على $]1, +\\infty[$ وتحت $(\\Delta)$ على $]0, 1[$ ويقطعه في النقطة $(1, ${Number(k) - 1})$.`,
      solutionTextFr: `1. Calcul de la dérivée pour tout $x > 0$ :
$f$ est dérivable sur $]0, +\\infty[$ comme somme et quotient de fonctions usuelles dérivables.
$f'(x) = ${k} + \\frac{(1/x)(x) - (\\ln x)(1)}{x^2} = ${k} + \\frac{1 - \\ln x}{x^2} = \\frac{${k}x^2 + 1 - \\ln x}{x^2}$.
Signe de $f'(x)$ : $f'(x) > 0$ sur $]0, +\\infty[$, la fonction est strictement croissante.
2. Tableau de variations complet avec limites aux bornes.
3. Position relative et tracé de la courbe $(C_f)$ par rapport à l'asymptote oblique $(\\Delta)$.`,
      bareme: "1.75 pt",
      baremeBreakdownAr: [
        "0.25 ن : ذكر قابلية الاشتقاق ومجالها",
        "0.50 ن : تطبيق قاعدة اشتقاق الخارج $(u/v)' = (u'v - uv')/v^2$ بدقة",
        "0.50 ن : دراسة إشارة $f'(x)$ ووضع جدول التغيرات بأسهم واضحة",
        "0.50 ن : إنشاء المنحنى مع المقاربات والنقط المميزة",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Justification de la dérivabilité",
        "0.50 pt : Formule de dérivation du quotient $(u/v)'$",
        "0.50 pt : Signe de la dérivée et tableau de variations complet",
        "0.50 pt : Tracé soigné de $(C_f)$ et des asymptotes",
      ],
    });
  } else if (
    lesson.subCategory === "هندسة فضائية" ||
    titleFr.includes("espace") ||
    titleAr.includes("الفضائية")
  ) {
    const r = model === "A" ? "3" : "6";
    const dPlane = model === "A" ? "3" : "6";
    solutions.push({
      questionNumber: "1",
      questionText: `Produit vectoriel $\\vec{AB} \\wedge \\vec{AC}$ et équation cartésienne du plan $(P)$`,
      solutionTextAr: `1. حساب الجداء المتجهي $\\vec{AB} \\wedge \\vec{AC}$ :
لدينا إحداثيات المتجهتين: $\\vec{AB}(2, 0, -1)$ و $\\vec{AC}(0, 1, -1)$.
نحسب المحددات الصغرى:
$\\vec{AB} \\wedge \\vec{AC} = \\begin{vmatrix} 0 & 1 \\\\ -1 & -1 \\end{vmatrix}\\vec{i} - \\begin{vmatrix} 2 & 0 \\\\ -1 & -1 \\end{vmatrix}\\vec{j} + \\begin{vmatrix} 2 & 0 \\\\ 0 & 1 \\end{vmatrix}\\vec{k} = (0 - (-1))\\vec{i} - (-2 - 0)\\vec{j} + (2 - 0)\\vec{k} = \\vec{i} + 2\\vec{j} + 2\\vec{k}$.
بما أن $\\vec{AB} \\wedge \\vec{AC} \\neq \\vec{0}$، فإن النقط $A$ و $B$ و $C$ غير مستقيمية وتحدد مستوى $(P)$ متجهته المنظمية $\\vec{n}(1, 2, 2)$.
2. المعادلة الديكارتية للمستوى $(P)$ :
تكتب على الشكل $1x + 2y + 2z + d = 0$. وبما أن $A(1,0,2) \\in (P)$، فإن $1 + 0 + 4 + d = 0 \\implies d = -5$ (أو للمتغير الآخر $d = -${dPlane}) ومنه المعادلة المختصرة: $x + 2y + 2z - ${dPlane} = 0$.`,
      solutionTextFr: `1. Calcul du produit vectoriel $\\vec{AB} \\wedge \\vec{AC}$ :
On a $\\vec{AB}(2, 0, -1)$ et $\\vec{AC}(0, 1, -1)$.
Par calcul des déterminants extraits :
$\\vec{AB} \\wedge \\vec{AC} = \\begin{vmatrix} 0 & 1 \\\\ -1 & -1 \\end{vmatrix}\\vec{i} - \\begin{vmatrix} 2 & 0 \\\\ -1 & -1 \\end{vmatrix}\\vec{j} + \\begin{vmatrix} 2 & 0 \\\\ 0 & 1 \\end{vmatrix}\\vec{k} = \\vec{i} + 2\\vec{j} + 2\\vec{k} \\neq \\vec{0}$.
Les points $A, B, C$ ne sont pas alignés et définissent un plan $(P)$ de vecteur normal $\\vec{n}(1, 2, 2)$.
2. Équation cartésienne de $(P)$ :
$x + 2y + 2z + d = 0$. En substituant les coordonnées du point $A$, on obtient : $x + 2y + 2z - ${dPlane} = 0$.`,
      bareme: "1.50 pt",
      baremeBreakdownAr: [
        "0.25 ن : تحديد إحداثيات المتجهتين $\\vec{AB}$ و $\\vec{AC}$",
        "0.75 ن : حساب مركبات الجداء المتجهي $\\vec{AB} \\wedge \\vec{AC}$",
        "0.50 ن : استنتاج المعادلة الديكارتية للمستوى $(P)$",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Coordonnées des vecteurs $\\vec{AB}$ et $\\vec{AC}$",
        "0.75 pt : Calcul exact des composantes de $\\vec{AB} \\wedge \\vec{AC}$",
        "0.50 pt : Déduction de l'équation cartésienne du plan $(P)$",
      ],
    });

    solutions.push({
      questionNumber: "2",
      questionText: `Distance $d(\\Omega, (P))$ et intersection de la sphère $(S)$ et du plan $(P)$`,
      solutionTextAr: `1. حساب مسافة المركز $\\Omega$ عن المستوى $(P)$ :
$d(\\Omega, (P)) = \\frac{|x_\\Omega + 2y_\\Omega + 2z_\\Omega - ${dPlane}|}{\\sqrt{1^2 + 2^2 + 2^2}} = \\frac{|d_0|}{3} < R = ${r}$.
2. تقاطع الفلكة $(S)$ والمستوى $(P)$ :
بما أن $d(\\Omega, (P)) < R$، فإن المستوى $(P)$ يقطع الفلكة $(S)$ وفق دائرة $(\\Gamma)$ شعاعها $r = \\sqrt{R^2 - d^2}$، ومركزها $H$ المسقط العمودي للنقطة $\\Omega$ على المستوى $(P)$ المحدد بالتمثيل البارامتري للمستقيم $(\\Delta)$ المار من $\\Omega$ والعمودي على $(P)$.`,
      solutionTextFr: `1. Distance du centre $\\Omega$ au plan $(P)$ :
$d(\\Omega, (P)) = \\frac{|x_\\Omega + 2y_\\Omega + 2z_\\Omega - ${dPlane}|}{\\sqrt{1^2 + 2^2 + 2^2}} < R = ${r}$.
2. Intersection de $(S)$ et $(P)$ :
Comme $d(\\Omega, (P)) < R$, le plan $(P)$ coupe la sphère $(S)$ suivant un cercle $(\\Gamma)$ de rayon $r = \\sqrt{R^2 - d^2}$ et de centre $H$, projeté orthogonal de $\\Omega$ sur $(P)$ obtenu via la représentation paramétrique de la droite $(\\Delta) \\perp (P)$.`,
      bareme: "1.50 pt",
      baremeBreakdownAr: [
        "0.50 ن : تطبيق صيغة مسافة نقطة عن مستوى $d(\\Omega, (P))$",
        "0.50 ن : مقارنة المسافة $d$ مع الشعاع $R$ وحساب شعاع الدائرة $r = \\sqrt{R^2 - d^2}$",
        "0.50 ن : تحديد التمثيل البارامتري وإحداثيات المركز $H$",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Formule et calcul de la distance $d(\\Omega, (P))$",
        "0.50 pt : Comparaison $d < R$ et calcul du rayon $r = \\sqrt{R^2 - d^2}$",
        "0.50 pt : Représentation paramétrique et coordonnées du centre $H$",
      ],
    });
  } else if (
    titleFr.includes("intégral") ||
    titleFr.includes("primitive") ||
    titleFr.includes("différentielle") ||
    titleAr.includes("التكاملي") ||
    titleAr.includes("التفاضلية")
  ) {
    solutions.push({
      questionNumber: "1",
      questionText: `Équation caractéristique et intégration par parties (IPP)`,
      solutionTextAr: `1. حل المعادلة التفاضلية :
نكتب المعادلة المميزة $r^2 - ar + b = 0$ ونحسب مميزها $\\Delta$، ثم نحدد الحل العام ونعوض بالشروط البدئية $y(0) = 1$ و $y'(0) = 0$.
2. حساب التكامل $I = \\int_0^1 (x+1)e^{-x} dx$ بالمكاملة بالأجزاء :
نضع $u(x) = x+1 \\implies u'(x) = 1$ و $v'(x) = e^{-x} \\implies v(x) = -e^{-x}$.
ومنه : $I = \\left[ -(x+1)e^{-x} \\right]_0^1 - \\int_0^1 (-e^{-x}) dx = (-2e^{-1} + 1) + \\left[ -e^{-x} \\right]_0^1 = 2 - \\frac{3}{e}$.`,
      solutionTextFr: `1. Résolution de l'équation différentielle :
Écriture de l'équation caractéristique associée, détermination de la solution générale puis application des conditions initiales $y(0)=1$ et $y'(0)=0$.
2. Calcul de l'intégrale par intégration par parties (IPP) :
On pose $u(x) = x+1 \\implies u'(x) = 1$ et $v'(x) = e^{-x} \\implies v(x) = -e^{-x}$.
D'après la formule d'IPP : $I = \\left[ -(x+1)e^{-x} \\right]_0^1 + \\int_0^1 e^{-x} dx = 2 - \\frac{3}{e}$ u.a.`,
      bareme: "1.50 pt",
      baremeBreakdownAr: [
        "0.50 ن : المعادلة المميزة والحل العام والخاص للمعادلة التفاضلية",
        "0.50 ن : اختيار الدالتين $u$ و $v'$ وتطبيق صيغة المكاملة بالأجزاء",
        "0.50 ن : حساب التكامل النهائي واستنتاج المساحة الهندسية بـ $\\text{cm}^2$",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Équation caractéristique et solution particulière",
        "0.50 pt : Choix de $u, v'$ et application de la formule d'IPP",
        "0.50 pt : Calcul exact de $I$ et conversion de l'aire en $\\text{cm}^2$",
      ],
    });
  } else if (
    lesson.subCategory === "احتمالات وإحصاء" ||
    titleFr.includes("probabilit") ||
    titleAr.includes("الاحتمالات")
  ) {
    solutions.push({
      questionNumber: "1",
      questionText: `Dénombrement ($C_n^p$), probabilité d'événements et variable aléatoire $X$`,
      solutionTextAr: `1. السحب آني، إذن كل إمكانية هي تأليفة من 3 كرات من بين $N$ كرات: $\\text{Card}(\\Omega) = C_N^3$.
- احتمال الحدث $A$ (نفس اللون): $P(A) = \\frac{C_{n_R}^3 + C_{n_V}^3}{C_N^3}$.
- احتمال الحدث $B$ (كرة بيضاء على الأقل): نستعمل الحدث المضاد $\\overline{B}$ (عدم سحب أي كرة بيضاء): $P(B) = 1 - P(\\overline{B})$.
2. قانون احتمال المتغير العشوائي $X$ والأمل الرياضي :
مجموعة قيم $X$ هي $X(\\Omega) = \\{0, 1, 2, 3\\}$. نحسب $P(X = k)$ لكل $k$ ثم نستنتج الأمل الرياضي $E(X) = \\sum k \\cdot P(X = k)$.`,
      solutionTextFr: `1. Le tirage étant simultané, le cardinal de l'univers est $\\text{Card}(\\Omega) = \\binom{N}{3}$.
- Événement $A$ (même couleur) : $P(A) = \\frac{\\binom{n_R}{3} + \\binom{n_V}{3}}{\\binom{N}{3}}$.
- Événement $B$ (au moins une blanche) par passage à l'événement contraire : $P(B) = 1 - P(\\overline{B})$.
2. Loi de probabilité de $X$ et espérance :
$X(\\Omega) = \\{0, 1, 2, 3\\}$. On détermine $P(X = k)$ pour chaque valeur puis on calcule $E(X) = \\sum_{k=0}^3 k P(X = k)$.`,
      bareme: "1.50 pt",
      baremeBreakdownAr: [
        "0.25 ن : تحديد عدد الإمكانيات $\\text{Card}(\\Omega) = C_N^3$",
        "0.50 ن : حساب $P(A)$ و $P(B)$ باستعمال الحدث المضاد",
        "0.50 ن : تحديد قيم $X(\\Omega)$ وجدول قانون الاحتمال",
        "0.25 ن : حساب الأمل الرياضي $E(X)$",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Cardinal de l'univers $\\text{Card}(\\Omega)$",
        "0.50 pt : Calcul de $P(A)$ et $P(B)$ via l'événement contraire",
        "0.50 pt : Tableau de la loi de probabilité de $X$",
        "0.25 pt : Calcul de l'espérance mathématique $E(X)$",
      ],
    });
  } else {
    // حل عام مهيكل وفق النموذج البيداغوجي المغربي لجميع الدروس الأخرى
    const cap0Ar = lesson.capacitiesAr[0] || lesson.lessonAr;
    const cap1Ar = lesson.capacitiesAr[1] || cap0Ar;
    const cap0Fr = lesson.capacitiesFr[0] || lesson.lessonFr;
    const cap1Fr = lesson.capacitiesFr[1] || cap0Fr;

    solutions.push({
      questionNumber: "1",
      questionText: questionsFr[0] || questionsAr[0] || `Application directe : ${cap0Fr}`,
      solutionTextAr: `عناصر الإجابة والتطبيق المباشر لقواعد « ${cap0Ar} » :
1. تذكير بالخاصية الأساسية المطبقة وشروط صحتها (${lesson.subCategory || "رياضيات"}).
2. التعويض بالمعطيات العددية المحددة في نص التمرين وإجراء العمليات الحسابية خطوة بخطوة.
3. الاختزال والوصول إلى النتيجة المبسطة مع التأطير أو كتابة مجموعة الحلول.`,
      solutionTextFr: `Éléments de réponse et méthode pour « ${cap0Fr} » :
1. Rappel de la propriété du cours (${lesson.subCategoryFr || "Mathématiques"}) et vérification des hypothèses requises.
2. Remplacement numérique pas à pas selon les paramètres du modèle (${model}).
3. Simplification algébrique rigoureuse et formulation de la conclusion finale.`,
      bareme: "1.00 pt",
      baremeBreakdownAr: [
        "0.25 ن : تذكر القاعدة أو الخاصية الديداكتيكية",
        "0.50 ن : دقة الحساب الجبري والمراحل الوسيطة",
        "0.25 ن : تقديم النتيجة النهائية والتأكد من ملاءمتها",
      ],
      baremeBreakdownFr: [
        "0.25 pt : Formulation du théorème ou de la formule",
        "0.50 pt : Calculs intermédiaires rigoureux",
        "0.25 pt : Conclusion et résultat final encadré",
      ],
      pedagogicalNoteAr: "توجيه تصحيحي: مراعاة الخطوات الحسابية وعدم حرمان التلميذ من النقط كاملة في حالة خطأ إشاري بسيط مع صحة المنهجية.",
      pedagogicalNoteFr: "Consigne d'évaluation : Valoriser la démarche méthodologique même en présence d'une erreur de calcul mineure.",
    });

    solutions.push({
      questionNumber: "2",
      questionText: questionsFr[1] || questionsAr[1] || `Mobilisation et raisonnement : ${cap1Fr}`,
      solutionTextAr: `تعبئة الموارد والبرهان الاستدلالي حول « ${cap1Ar} » :
1. تحديد المعطيات واستحضار مبرهنات الربط المنطقي المناسبة (استلزام، تكافؤ، أو استدلال بالخلف).
2. بناء البرهان الرياضي المنظم بالانتقال من الفرض إلى النتيجة.
3. صياغة الاستنتاج الرياضي النهائي بدقة.`,
      solutionTextFr: `Mobilisation des compétences pour « ${cap1Fr} » :
1. Identification des hypothèses et choix de la démarche démonstrative appropriée.
2. Enchaînement déductif structuré reliant les lemmes au résultat cherché.
3. Synthèse et réponse aux exigences du cadre de référence officiel.`,
      bareme: "1.25 pt",
      baremeBreakdownAr: [
        "0.50 ن : حسن اختيار المنهجية والمبرهنة الملائمة",
        "0.50 ن : ترابط خطوات الاستدلال الرياضي وسلامة الصياغة",
        "0.25 ن : الخاتمة والاستنتاج النهائي",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Choix judicieux de la méthode de démonstration",
        "0.50 pt : Rigueur des déductions logiques intermédiaires",
        "0.25 pt : Synthèse finale conforme aux attendus",
      ],
    });
  }

  // ضمان مطابقة عدد عناصر الحل مع عدد أسئلة التمرين الفعلي (3 أو 5 أو 7 أو أسئلة مخصصة)
  const targetQuestionCount = Math.max(questionsAr.length, questionsFr.length);
  if (targetQuestionCount > solutions.length) {
    for (let qIdx = solutions.length; qIdx < targetQuestionCount; qIdx++) {
      const qArText = questionsAr[qIdx] || `السؤال ${qIdx + 1}`;
      const qFrText = questionsFr[qIdx] || `Question ${qIdx + 1}`;
      const cleanQAr = qArText.replace(/^\d+[\.\)]\s*/, "");
      const cleanQFr = qFrText.replace(/^\d+[\.\)]\s*/, "");
      const capAr =
        lesson.capacitiesAr[qIdx % Math.max(1, lesson.capacitiesAr.length)] ||
        lesson.lessonAr;
      const capFr =
        lesson.capacitiesFr[qIdx % Math.max(1, lesson.capacitiesFr.length)] ||
        lesson.lessonFr;

      const lowerQ = `${qArText} ${qFrText}`.toLowerCase();
      let specificStepsAr = `1. استثمار نتائج الأسئلة السابقة وتوظيف خاصية « ${capAr} ».\n2. إجراء التحويلات الجبرية أو التحليلية اللازمة مع تعليل كل تكافؤ أو استلزام منطقي.\n3. استخلاص النتيجة النهائية وتأطيرها بوضوح.`;
      let specificStepsFr = `1. Exploitation des résultats précédents et mobilisation de la capacité « ${capFr} ».\n2. Développement analytique ou algébrique rigoureux en justifiant chaque étape logique.\n3. Conclusion explicite et encadrement du résultat final.`;
      let noteAr = "توجيه بيداغوجي للمصحح: تقبل كل طريقة رياضية مكافئة وسليمة، مع عدم معاقبة التلميذ مرتين على خطأ حسابي سابق.";
      let noteFr = "Directive d'évaluation : Valoriser toute démarche mathématique équivalente et cohérente (erreur reportée non doublement sanctionnée).";

      if (lowerQ.includes("مشتق") || lowerQ.includes("تغيرات") || lowerQ.includes("dériv") || lowerQ.includes("variation")) {
        specificStepsAr = `1. التذكير بقابلية الاشتقاق على مجال الدراسة وتطبيق قواعد اشتقاق العمليات والمركب.\n2. توحيد المقامات وتعميل التعبير البسطي لربط إشارة المشتقة بإشارة التعبير المساعد.\n3. استنتاج رتابة الدالة بدقة وإنشاء جدول التغيرات مستوفياً لمجالات التعريف والنهايات والقيم الحدية.`;
        specificStepsFr = `1. Justifier la dérivabilité sur l'intervalle d'étude et appliquer les formules de dérivation.\n2. Factoriser l'expression obtenue afin d'identifier clairement le signe de la dérivée.\n3. En déduire le sens de variation strict et dresser le tableau de variations complet (bornes, signes, flèches et extremums).`;
        noteAr = "خطأ شائع يجب الانتباه إليه: نسيان تبرير قابلية الاشتقاق قبل حساب المشتقة أو إغفال إشارة المقام في جدول التغيرات.";
        noteFr = "Erreur fréquente à surveiller : Omission de la justification de dérivabilité ou confusion entre signe de f'(x) et signe de f(x).";
      } else if (lowerQ.includes("مقارب") || lowerQ.includes("نهاي") || lowerQ.includes("asymptote") || lowerQ.includes("limite")) {
        specificStepsAr = `1. حساب النهاية عند المحد المطلوب مع إزالة الشكل غير المحدد (إن وجد) بالتعميل أو النهايات الاعتيادية.\n2. حساب نهاية الفرق lim [f(x) - (ax + b)] = 0 لإثبات معادلة المستقيم المقارب المائل.\n3. دراسة إشارة الفرق f(x) - y لتحديد الوضع النسبي للمنحنى (C_f) والمستقيم المقارب.`;
        specificStepsFr = `1. Calculer la limite aux bornes en levant l'indétermination éventuelle par factorisation ou croissances comparées.\n2. Vérifier que lim [f(x) - (ax + b)] = 0 pour établir l'équation de l'asymptote.\n3. Étudier le signe de la différence f(x) - y pour préciser la position relative de (C_f) et de la droite.`;
        noteAr = "خطأ شائع: الاكتفاء بحساب النهاية دون صياغة التأويل الهندسي الصريح (معادلة المستقيم المقارب والوضع النسبي).";
        noteFr = "Point de vigilance : Exiger la formulation géométrique complète (équation de l'asymptote et voisinage concerné).";
      } else if (lowerQ.includes("تكامل") || lowerQ.includes("مساح") || lowerQ.includes("أصلي") || lowerQ.includes("intégral") || lowerQ.includes("aire") || lowerQ.includes("primitive")) {
        specificStepsAr = `1. التحقق من اتصال الدالة على مجال المكاملة وتحديد الدالة الأصلية أو وضع عناصر المكاملة بالأجزاء (u, v').\n2. تطبيق صيغة نيوتن-لايبنتز [F(x)]_a^b مع تعويض المحدين العلوي والسفلي بدقة.\n3. بالنسبة لحساب المساحة الهندسية: ضرب التكامل في وحدة المساحة ||i⃗|| × ||j⃗|| مع مراعاة القيمة المطلقة |f(x) - y|.`;
        specificStepsFr = `1. Justifier la continuité sur le segment d'intégration et identifier une primitive ou poser l'intégration par parties.\n2. Appliquer la formule fondamentale [F(x)]_a^b en détaillant le calcul aux bornes.\n3. Pour le calcul d'aire : multiplier l'intégrale de |f(x) - y| par l'unité d'aire graphique ||i⃗|| × ||j⃗|| en cm².`;
        noteAr = "خطأ شائع: نسيان القيمة المطلقة أو عدم ضرب النتيجة في وحدة المساحة (cm²) عند الانتقال من التكامل إلى المساحة الهندسية.";
        noteFr = "Erreur classique : Oubli de l'unité d'aire graphique (en cm²) ou de la valeur absolue |f(x) - g(x)|.";
      } else if (lowerQ.includes("ترجع") || lowerQ.includes("متقارب") || lowerQ.includes("رتاب") || lowerQ.includes("récurrence") || lowerQ.includes("converg") || lowerQ.includes("monoton")) {
        specificStepsAr = `1. التحقق من صحة الخاصية من أجل الحد الأول (أساس الترجع)، ثم افتراض صحتها لرتبة n والبرهان عليها لرتبة n+1.\n2. دراسة إشارة الفرق u_{n+1} - u_n (أو توظيف رتابة الدالة المرفقة f) لاستنتاج رتابة المتتالية.\n3. تطبيق مبرهنة التقارب المطرد (متتالية تزايدية ومكبورة أو تناقصية ومصغورة) وتحديد النهاية بحل المعادلة f(L) = L.`;
        specificStepsFr = `1. Initialisation au premier rang, hypothèse de récurrence au rang n fixé et hérédité au rang n+1.\n2. Étude du signe de u_{n+1} - u_n pour conclure sur la monotonie de la suite.\n3. Application du théorème de convergence monotone et résolution de l'équation du point fixe f(L) = L.`;
        noteAr = "توجيه منهجي: في البرهان بالترجع، يجب التمييز بوضوح بين صياغة افتراض الترجع لـ n مثبت والانتقال الاستنتاجي نحو n+1.";
        noteFr = "Rigueur attendue : Bien distinguer l'hypothèse de récurrence pour un entier n fixé et la conclusion d'hérédité.";
      }

      solutions.push({
        questionNumber: `${qIdx + 1}`,
        questionText: qFrText,
        solutionTextAr: `منهجية الإجابة المفصلة عن السؤال (${qIdx + 1}) — « ${cleanQAr} » :\n${specificStepsAr}`,
        solutionTextFr: `Démarche détaillée pour la question (${qIdx + 1}) — « ${cleanQFr} » :\n${specificStepsFr}`,
        bareme: "0.75 pt",
        baremeBreakdownAr: [
          "0.25 ن : استحضار الخاصية أو العلاقة الملائمة",
          "0.25 ن : سلامة الاستدلال والعمليات الحسابية",
          "0.25 ن : دقة الاستنتاج النهائي",
        ],
        baremeBreakdownFr: [
          "0.25 pt : Mobilisation de la propriété adéquate",
          "0.25 pt : Rigueur du calcul et de la déduction",
          "0.25 pt : Exactitude de la conclusion",
        ],
        pedagogicalNoteAr: noteAr,
        pedagogicalNoteFr: noteFr,
      });
    }
  } else if (targetQuestionCount > 0 && solutions.length > targetQuestionCount) {
    solutions.splice(targetQuestionCount);
  }

  // مزامنة نقط كل سؤال في عناصر الإجابة بدقة (مضاعفات 0.25 نقطة) لضمان تطابق مجموع أسئلة التصحيح مع نقطة التمرين الكاملة
  const exactQMetas = getQuestionBaremesAndLevels(
    weight,
    solutions.length,
    45,
    35,
    20,
    lesson.customQuestionBaremes,
    lesson.customQuestionLevels
  );

  solutions.forEach((sol, idx) => {
    const qMeta = exactQMetas[idx];
    if (qMeta) {
      const ptVal = Number(qMeta.points);
      const formattedPt = ptVal
        .toFixed(2)
        .replace(/\.00$/, ".0")
        .replace(/(\.\d)0$/, "$1");
      sol.bareme = `${formattedPt} pt`;
      const p1 = Math.max(0.25, Math.round(ptVal * 0.35 * 4) / 4);
      const p2 = Math.max(0.25, Math.round(ptVal * 0.4 * 4) / 4);
      const p3 = Math.max(0, Number((ptVal - p1 - p2).toFixed(2)));
      sol.baremeBreakdownAr =
        p3 > 0
          ? [
              `${p1.toFixed(2)} ن : صياغة القاعدة أو الخاصية الرياضية المناسبة (${qMeta.level})`,
              `${p2.toFixed(2)} ن : سلامة المراحل الحسابية والاستدلال المنطقي`,
              `${p3.toFixed(2)} ن : تأطير النتيجة النهائية ومطابقتها للمطلوب`,
            ]
          : [
              `${(ptVal * 0.5).toFixed(2)} ن : تطبيق الخاصية والمنهجية الرياضية (${qMeta.level})`,
              `${(ptVal * 0.5).toFixed(2)} ن : دقة الحساب والنتيجة النهائية المؤطرة`,
            ];
      sol.baremeBreakdownFr =
        p3 > 0
          ? [
              `${p1.toFixed(2)} pt : Énoncé de la propriété ou méthode adéquate (${qMeta.level})`,
              `${p2.toFixed(2)} pt : Exactitude des calculs et enchaînement logique`,
              `${p3.toFixed(2)} pt : Formulation et encadrement du résultat final`,
            ]
          : [
              `${(ptVal * 0.5).toFixed(2)} pt : Application de la méthode (${qMeta.level})`,
              `${(ptVal * 0.5).toFixed(2)} pt : Exactitude du calcul et résultat encadré`,
            ];
    }
  });

  const computedTotalPts = exactQMetas
    .reduce((acc, m) => acc + Number(m.points || 0), 0)
    .toFixed(2)
    .replace(/\.00$/, ".0")
    .replace(/(\.\d)0$/, "$1");

  return {
    exerciseIndex,
    exerciseTitleAr: titleAr,
    exerciseTitleFr: lesson.lessonFr,
    totalPoints: computedTotalPts,
    weight,
    solutions,
    generalAdviceAr: `إرشادات عامة للمصحح (وفق الأطر المرجعية المغربية):
- قبول كل طريقة رياضية سليمة لم ترد صراحة في هذا التصحيح (Principe de valorisation des initiatives).
- عدم معاقبة المترشح مرتين على نفس الخطأ الحسابي إذا كانت النتائج اللاحقة متسقة مع خطئه المبدئي.
- تخصيص 0.5 نقطة لحسن تنظيم ورقة التحرير وجودة التعبير الرياضي والرموز.`,
    generalAdviceFr: `Directives officielles d'évaluation et barème national (Cadre de référence) :
- Toute démarche cohérente et rigoureuse non prévue dans ce corrigé type doit être valorisée.
- Ne pas pénaliser un candidat deux fois pour la même erreur de calcul si la suite du raisonnement est exacte.
- Attribuer 0.5 point à la propreté de la copie, la lisibilité et la rigueur de la rédaction mathématique.`,
  };
}

/**
 * يولد تصحيحاً مفصلاً لسلاسل التمارين والـ DM (مع حلول رياضية حقيقية للجزء الأول والجزء التوليفي الثاني)
 */
export function generateSerieBlockCorrection(
  block: SerieExerciseBlock,
  blockIndex: number,
  lesson: LessonItem,
  model: "A" | "B" = "A"
): ExerciseCorrection {
  const isDM = block.badgeAr.includes("الجزء") || block.badgeFr.includes("Partie");
  const isPartA = blockIndex === 0 && isDM;
  const subCat = lesson.subCategory || "تحليل";
  const titleFr = lesson.lessonFr.toLowerCase();

  if (isPartA) {
    const baseCorr = generateExerciseCorrection(
      lesson,
      blockIndex,
      model,
      block.questionsAr,
      block.questionsFr
    );
    return {
      ...baseCorr,
      exerciseTitleAr: block.badgeAr,
      exerciseTitleFr: block.badgeFr,
      totalPoints: block.partPoints || (((lesson.weight * 20) / 100) * 0.45).toFixed(1),
    };
  }

  const solutions: QuestionSolution[] = block.questionsFr.map((qFr, qIdx) => {
    const qAr = block.questionsAr[qIdx] || qFr;
    let solAr = "";
    let solFr = "";

    if (subCat === "هندسة فضائية" || titleFr.includes("espace")) {
      if (qIdx === 0) {
        solAr = `شرط تماس المستوى $(P_m)$ مع الفلكة $(S)$ :
نحسب مسافة المركز $\\Omega$ عن المستوى $(P_m)$ :
$d(\\Omega, (P_m)) = \\frac{|x_\\Omega + 2y_\\Omega + 2z_\\Omega - 3m|}{\\sqrt{1^2 + 2^2 + 2^2}} = \\frac{|3 - 3m|}{3} = |1 - m|$.
يكون المستوى مماساً للفلكة $(S)$ إذا وفقط إذا كان $d(\\Omega, (P_m)) = R$، ومنه نحدد قيمتي الوسيط $m$.`;
        solFr = `Condition de tangence du plan $(P_m)$ à la sphère $(S)$ :
On exprime la distance du centre $\\Omega$ au plan $(P_m)$ :
$d(\\Omega, (P_m)) = \\frac{|x_\\Omega + 2y_\\Omega + 2z_\\Omega - 3m|}{\\sqrt{1^2 + 2^2 + 2^2}} = |1 - m|$.
Le plan est tangent à $(S)$ si et seulement si $d(\\Omega, (P_m)) = R$, ce qui fournit les deux valeurs exactes du paramètre.`;
      } else if (qIdx === 1) {
        solAr = `تحديد عناصر الدائرة $(\\Gamma_m)$ :
بما أن $d(\\Omega, (P_m)) < R$، فإن التقاطع دائرة $(\\Gamma_m)$ شعاعها $r(m) = \\sqrt{R^2 - (1-m)^2}$.
مركزها $\\Omega_m$ هو المسقط العمودي لـ $\\Omega$ على $(P_m)$ المعرف بالتمثيل البارامتري للمستقيم المار من $\\Omega$ والموجه بـ $\\vec{n}(1, 2, 2)$.`;
        solFr = `Éléments caractéristiques du cercle $(\\Gamma_m)$ :
Comme $d(\\Omega, (P_m)) < R$, la section est un cercle de rayon $r(m) = \\sqrt{R^2 - d^2}$.
Son centre $\\Omega_m$ est le projeté orthogonal de $\\Omega$ sur $(P_m)$, obtenu via la représentation paramétrique de la normale issue de $\\Omega$.`;
      } else {
        solAr = `المحل الهندسي لمراكز الدوائر $\\Omega_m$ :
جميع النقط $\\Omega_m$ تنتمي إلى المستقيم العمودي على عائلة المستويات المتوازية $(P_m)$ والمار من المركز الثابت $\\Omega$ داخل الفلكة.`;
        solFr = `Lieu géométrique des centres $\\Omega_m$ :
Les centres $\\Omega_m$ décrivent le segment ouvert porté par la droite perpendiculaire aux plans parallèles $(P_m)$ passant par $\\Omega$, intérieur à la sphère $(S)$.`;
      }
    } else if (subCat === "أعداد عقدية" || titleFr.includes("complexe")) {
      solAr = `تحليل التحويل العقدي والمتتالية الهندسية للنقط $(M_n)$ :
- الكتابة $z' - i = e^{i\\theta}(z - i)$ تميز دوراناً $R$ مركزه النقطة $\\Omega(i)$ وزاويته $\\theta$.
- بالترجع نجد $z_n - i = e^{in\\theta}(z_0 - i)$.
- تنطبق $M_n$ مع $M_0$ عندما يكون $n\\theta \\equiv 0 [2\\pi]$، والمسافة $M_k M_{k+1}$ ثابتة لأن الدوران تقايس يحافظ على المسافات.`;
      solFr = `Étude de la transformation complexe et de la suite de points $(M_n)$ :
- L'écriture $z' - i = e^{i\\theta}(z - i)$ caractérise la rotation de centre $\\Omega(i)$ et d'angle $\\theta$.
- Par récurrence immédiate : $z_n - i = e^{in\\theta}(z_0 - i)$.
- La périodicité s'obtient pour $n\\theta \\equiv 0 \\pmod{2\\pi}$ et la conservation des distances par isométrie donne $L_n = (n+1) M_0 M_1$.`;
    } else if (subCat === "احتمالات وإحصاء" || titleFr.includes("probabilit")) {
      solAr = `النمذجة بالمتغير الحداني $Y_n \\sim \\mathcal{B}(n, p)$ :
- التجارب مستقلة وتحتمل نتيجتين، إذن $P(Y_n = k) = C_n^k p^k (1-p)^{n-k}$.
- نمر إلى الحدث المضاد: $p_n = 1 - P(Y_n = 0) = 1 - (1-p)^n$.
- المتراجحة $p_n \\ge 0,99 \\iff (1-p)^n \\le 0,01 \\iff n \\ge \\frac{\\ln(0,01)}{\\ln(1-p)}$ (مع قلب المتفاوتة لأن $\\ln(1-p) < 0$).`;
      solFr = `Modélisation par la loi binomiale $Y_n \\sim \\mathcal{B}(n, p)$ :
- Par indépendance des $n$ épreuves de Bernoulli : $p_n = 1 - P(Y_n = 0) = 1 - (1-p)^n$.
- Résolution de l'inéquation : $1 - (1-p)^n \\ge 0,99 \\iff (1-p)^n \\le 0,01 \\iff n \\ge \\frac{\\ln(0,01)}{\\ln(1-p)}$ (car $\\ln(1-p) < 0$).`;
    } else {
      solAr = `حل المسألة التوليفية ($u_{n+1} = f(u_n)$) :
1. البرهان بالترجع على التأطير: نتحقق من صحة الخاصية من أجل $n=0$، ثم نفترض أن $u_n \\in I$ ونستعمل رتابة $f$ وصورة المجال $f(I) \\subset I$.
2. دراسة الرتابة: إشارة الفرق $u_{n+1} - u_n = f(u_n) - u_n$ هي نفس إشارة $f(x) - x$ على المجال $I$.
3. التقارب والنهاية: بما أن $(u_n)$ رتيبة ومحصورة فهي متقاربة، وبما أن $f$ متصلة على $I$ فإن النهاية $L$ تحقق $f(L) = L$.`;
      solFr = `Résolution du problème de synthèse ($u_{n+1} = f(u_n)$) :
1. Récurrence sur le bornage : Initialisation pour $n=0$, puis hérédité par croissance de $f$ et stabilité de l'intervalle $f(I) \\subset I$.
2. Monotonie : Le signe de $u_{n+1} - u_n = f(u_n) - u_n$ est déterminé par la position relative de $(C_f)$ par rapport à la première bissectrice $y = x$.
3. Convergence et point fixe : Suite monotone et bornée donc convergente vers $L \\in I$ solution de $f(L) = L$ par continuité de $f$.`;
    }

    return {
      questionNumber: `${qIdx + 1}`,
      questionText: qAr,
      solutionTextAr: solAr,
      solutionTextFr: solFr,
      bareme: isDM ? "1.75 pt" : "1.50 pt",
      baremeBreakdownAr: [
        "0.50 ن : صياغة الفرضيات والربط الصحيح بنتائج الجزء الأول",
        "0.75 ن : سلامة الاستدلال الرياضي (ترجع / تكافؤات / حساب)",
        "0.50 ن : الاستنتاج الدقيق وتأطير النتيجة النهائية",
      ],
      baremeBreakdownFr: [
        "0.50 pt : Mobilisation des résultats préliminaires et mise en équation",
        "0.75 pt : Rigueur du raisonnement (récurrence / équivalences)",
        "0.50 pt : Conclusion explicite et interprétation mathématique",
      ],
      pedagogicalNoteAr: `إرشاد المصحح: تثمين كل مبادرة تحليلية سليمة استندت إلى « ${block.hintAr} ».`,
      pedagogicalNoteFr: `Note correcteur : Valoriser toute prise d'initiative appuyée sur « ${block.hintFr} ».`,
    };
  });

  return {
    exerciseIndex: blockIndex,
    exerciseTitleAr: block.badgeAr,
    exerciseTitleFr: block.badgeFr,
    totalPoints: block.partPoints || (isDM ? (((lesson.weight * 20) / 100) * 0.55).toFixed(1) : "6.0"),
    weight: isDM ? Math.round(lesson.weight * 0.55) : 30,
    solutions,
    generalAdviceAr: "عناصر إجابة مفصلة للمسألة التوليفية معدة للتقويم الذاتي وتنمية مهارات البحث الرياضي.",
    generalAdviceFr: "Corrigé méthodologique détaillé du problème de synthèse pour l'auto-évaluation et l'approfondissement.",
  };
}

/**
 * يولد نموذج حل مفصل لتمرين من تمارين السلسلة المحددة عددياً من قبل الأستاذ
 */
export function generateConfiguredSerieCorrection(
  ex: ConfiguredSerieExercise,
  model: "A" | "B" = "A"
): ExerciseCorrection {
  const block: SerieExerciseBlock = {
    badgeAr: ex.badgeAr,
    badgeFr: ex.badgeFr,
    stars: ex.stars,
    questionsAr: ex.questionsAr,
    questionsFr: ex.questionsFr,
    hintAr: ex.hintAr,
    hintFr: ex.hintFr,
    competenciesAr: ex.competenciesAr,
    competenciesFr: ex.competenciesFr,
  };
  const base = generateSerieBlockCorrection(block, ex.blockIndex, ex.lesson, model);
  return {
    ...base,
    exerciseIndex: ex.exerciseIndex,
    exerciseTitleAr: ex.exerciseTitleAr,
    exerciseTitleFr: ex.exerciseTitleFr,
  };
}

